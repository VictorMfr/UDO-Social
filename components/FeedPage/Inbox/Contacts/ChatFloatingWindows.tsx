import { IUserContext, useUserContext } from "@/context/UserProvider";
import { ChatWindow } from "../Inbox";
import { Conversation, SearchUser } from "./Contacts";
import { useEffect, useRef, useState } from "react";
import api from "@/lib/axios";
import { io } from "socket.io-client";

// Funcion para obtener la informacion asumiendo
function isChatAConversation(dest: SearchUser | Conversation): dest is Conversation {
  return (dest as Conversation).id !== undefined && (dest as Conversation).starter_username !== undefined;
}

// Funcion para obtener la informacion del contacto
const getDestInfo = (dest: SearchUser | Conversation, userCtx: IUserContext) => {
  // Comprobar si es una conversacion existente
  if (isChatAConversation(dest)) {

    // Se debe, por lo tanto, obtener el nombre del otro usuario
    const otherUsername = (dest.starter_username === userCtx.user?.username) ? dest.receiver_username : dest.starter_username;

    return {
      id: dest.id,
      name: otherUsername
    };
  }

  // Si no es una conversacion, entonces es un nuevo usuario encontrado
  return {
    id: dest.id,
    name: dest.username
  };
};

// Interfaz para el manejo de mensajes
export interface Message {
  id: number,
  dest: 'other' | 'self',
  content: string,
  date: string
}

// Interfaz para la respuesta de mensajes de la API
export interface MessagesRequest {
  id: number,
  sender_id: number,
  message: string,
  updated_at: string
}

/*
  Descripccion del problema:

  Se necesita que, cuando se comience una conversacion con el segundo usuario,
  se establezca una conexion de tipo socket, abierto. Esta funcion haria tal conexion
  inicial al servidor que esta (para efectos de desarrollo) en localhost:3000

  Socket.io buscara dentro de tal url una ruta en /socket.io
*/
const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
  transports: ['websocket'],
  autoConnect: false
});


export default function ChatFloatingWindow({
  chat,
  onClose
}: {
  chat: ChatWindow,
  onClose: () => void
}) {

  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const userCtx = useUserContext();


  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);




  //Hook para manejar la conexión Socket.io y recibir eventos de ella en tiempo real
  useEffect(() => {
    // 1. Solo conectar si el chat está abierto y hay un destino
    if (chat.isOpen && chat.dest?.id) {

      if (!socket.connected) {
        socket.connect(); // Conexión manual bajo demanda
      }

      // 2. Unirse a la sala
      socket.emit("join_conversation", chat.dest.id);

      // 3. Escuchar mensajes
      socket.on("receive_message", (newMessage) => {
        // Solo agregar si no soy el emisor
        if (newMessage.sender_id !== userCtx.user!.id) {
          setMessages((prev) => {
            const exists = prev.find(m => m.id === newMessage.id);
            if (exists) return prev; // Si ya está, no hagas nada
            return [...prev, {
              id: newMessage.id,
              content: newMessage.content,
              dest: 'other',
              date: new Date(newMessage.date).toISOString().replace('T', ' ').replace(/..\+/, ' ')
            }];
          });
        }
      });

      // Escuchar cuando el OTRO empieza a escribir
      socket.on('user_typing_message', () => {
        setIsOtherTyping(true);
      });

      // Escuchar cuando el OTRO se detiene
      socket.on('user_stopped_typing', () => {
        setIsOtherTyping(false);
      });

      return () => {
        socket.off("receive_message");
        socket.off("user_typing_message");
        socket.off("user_stopped_typing");
        socket.disconnect();
      };
    }
  }, [chat.isOpen, chat.dest?.id, userCtx.user]);











  // Hook para cargar el historial de mensajes al abrir el chat
  useEffect(() => {

    // Necesariamente el modal debe estar abierto y debe consultar el historial
    // solo si se trata de una conversacion existente, no de un nuevo usuario encontrado
    if (!chat.isOpen || !isChatAConversation(chat.dest!)) return;

    // Cargar historial de la DB
    const fetchHistory = async () => {
      const res = await api.get<MessagesRequest[]>(`/messages?idConv=${(chat.dest as Conversation).id}`);

      // Mapea los datos de tu DB al formato de tu interfaz Message
      const history: Message[] = res.data.map(m => ({
        id: m.id,
        content: m.message,
        dest: m.sender_id === userCtx.user!.id ? 'self' : 'other' as 'self' | 'other',
        date: new Date(m.updated_at).toISOString().replace('T', ' ').replace(/..\+/, ' ')
      }));

      setMessages(history);
    };

    fetchHistory();
  }, [chat.isOpen, chat.dest, userCtx.user]);













  // Función para enviar mensaje
  const handleSendMessage = async () => {
    try {
      // Si el chat es una conversacion existente, solo se debe crear un nuevo mensaje asociado a esa conversacion
      if (isChatAConversation(chat.dest!)) {
        const response = await api.post('/messages', {
          conversation_id: chat.dest.id,
          message: messageInput,
          sender_id: userCtx.user!.id
        });

        // Agregar el nuevo mensaje a la lista de mensajes del chat
        setMessages(prev => [...prev, {
          id: response.data.id,
          dest: 'self',
          content: messageInput,
          date: response.data.created_at
        }]);

        // Limpiar el campo de input
        setMessageInput("");
      }

      // Es un mensaje para un nuevo usuario, se debe crear una conversacion
      const conversation = await api.post('/conversations', {
        receiver_id: chat.dest!.id,
        message: messageInput
      });

      // Agregar el nuevo mensaje a la lista de mensajes del chat
      setMessages(prev => [...prev, {
        id: conversation.data.id,
        dest: 'self',
        content: messageInput,
        date: conversation.data.updated_at
      }]);

      // Unirse a la sala de la nueva conversación
      socket.emit("join_conversation", conversation.data.conversation_id);

      // Limpiar el campo de input
      setMessageInput("");

    } catch (error) {
      console.log("Error al enviar mensaje:", error);
    }
  }


  // Funcion para controlar el cambio del input de mensaje
  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);

    // Solo emitir typing si es una conversación existente
    if (isChatAConversation(chat.dest!)) {
      socket.emit('typing_message', {
        conversationId: chat.dest.id,
        username: userCtx.user?.username
      });

      // Si ya había un cronómetro corriendo, lo matamos
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

      // Creamos uno nuevo
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('stop_typing_message', { conversationId: chat.dest!.id });
      }, 2000);
    }
  };





  if (!chat.isOpen || !chat.dest) return null;



  // Obtener la informacion del cntacto a mostrar en la ventana
  const { name } = getDestInfo(chat.dest, userCtx);


  return (
    <div className="fixed bottom-0 right-8 w-80 bg-white shadow-2xl rounded-t-xl border border-gray-200 flex flex-col z-50 animate-in slide-in-from-bottom duration-300">
      {/* Header Estilo LinkedIn */}
      <div className="p-3 bg-white border-b flex justify-between items-center cursor-pointer rounded-t-xl hover:bg-gray-50">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="font-bold text-sm text-gray-800">{name}</span>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Cuerpo de Mensajes */}
      <div className="h-80 overflow-y-auto p-4 flex flex-col gap-2 bg-gray-50">
        {/* Aquí va tu mapeo de mensajes: <MessageList id={chat.conversationId} /> */}
        <p className="text-[10px] text-center text-gray-400">Estás chateando con {name}</p>

        {/* Lista de mensajes */}
        {messages.map((message) => (
          <div key={message.id} className={`p-2 rounded-lg ${message.dest === 'self' ? 'bg-blue-500 text-white ml-auto' : 'bg-gray-200 text-gray-800 mr-auto'}`}>
            <p className="text-sm">{message.content}</p>
            <p className="text-[8px] text-right">{message.date}</p>
          </div>
        ))}

        {/* Dentro del div de mensajes */}
        {isOtherTyping && (
          <div className="flex items-center gap-1 ml-2 mb-2">
            <span className="text-[10px] text-gray-400 italic">El usuario está escribiendo</span>
            <div className="flex gap-1">
              <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></span>
              <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t bg-white flex">
        <input
          value={messageInput}
          onChange={handleMessageChange}
          type="text"
          placeholder="Escribe un mensaje..."
          className="w-full text-xs bg-gray-100 border-none rounded  px-4 py-2 focus:ring-1 focus:ring-blue-500"
        />
        <button onClick={handleSendMessage} className="right-4 bottom-4 bg-blue-500 text-white rounded p-2 hover:bg-blue-600 transition">Enviar</button>
      </div>
    </div>
  );
}