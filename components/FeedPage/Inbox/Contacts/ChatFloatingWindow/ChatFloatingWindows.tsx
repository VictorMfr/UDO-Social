import { ChatWindow } from "../../Inbox";
import { ChangeEventHandler, useEffect, useState } from "react";
import Avatar from "@/components/Avatar";
import Input from "@/components/UI/Input";
import Button from "@/components/UI/Button";
import { LuSend } from "react-icons/lu";
import { formatDate } from "@/lib/formatDate";
import api from "@/lib/axios";
import { useSocketContext } from "@/context/SocketProvider";




// Interfaz para el manejo de mensajes
export interface Message {
  id: number,
  origin: 'other' | 'self',
  content: string,
  date: string,
  sender?: {
    id: number,
    username: string,
    avatar: string
  }
}

// Interfaz para la respuesta de mensajes de la API
export interface MessageResponse {
  id: number;
  conversationId?: number;
  created_at: string
}


export default function ChatFloatingWindow({
  chat,
  onClose
}: {
  chat: ChatWindow,
  onClose: () => void
}) {

  // Administracion de mensajes
  const [messagesList, setMessagesList] = useState<Message[]>([]);
  const [newMessageUserInput, setNewMessageUserInput] = useState("");
  const [isOtherTyping, setIsOtherTyping] = useState(false);

  // Socket
  const { socket } = useSocketContext();

  // Cargar mensajes cuando se abre una conversación existente
  useEffect(() => {
    const fetchMessages = async () => {
      if (chat.conversationId) {
        try {
          const response = await api.get<Message[]>(`/messages?idConv=${chat.conversationId}`);
          setMessagesList(response.data);
        } catch (error) {
          console.error('Error al cargar mensajes', error);
        }
      } else {
        // Limpiar mensajes si es una nueva conversación
        setMessagesList([]);
      }
    };

    fetchMessages();
  }, [chat.conversationId]);

  // Unirse a la sala de conversación y escuchar eventos de typing
  useEffect(() => {
    if (socket && chat.conversationId) {
      // Unirse a la sala de la conversación
      socket.emit('join_conversation', chat.conversationId);

      // Escuchar cuando el otro usuario está escribiendo
      socket.on('user_typing_message', ({ conversationId }) => {
        if (conversationId === chat.conversationId) {
          setIsOtherTyping(true);
        }
      });

      // Escuchar cuando el otro usuario dejó de escribir
      socket.on('user_stopped_typing', ({ conversationId }) => {
        if (conversationId === chat.conversationId) {
          setIsOtherTyping(false);
        }
      });

      // Escuchar nuevos mensajes en tiempo real
      socket.on('new_message', ({ conversationId, message }) => {
        if (conversationId === chat.conversationId) {
          // Verificar que el mensaje no sea del usuario actual para evitar duplicados
          // El mensaje del usuario actual ya fue añadido y actualizado localmente
          setMessagesList(prev => {
            // Si ya existe un mensaje con este ID, no añadirlo de nuevo
            const exists = prev.some(msg => msg.id === message.id);
            if (exists) return prev;
            
            return [...prev, {
              id: message.id,
              content: message.content,
              date: message.date,
              origin: message.origin,
              sender: message.sender
            }];
          });
        }
      });
    }

    return () => {
      if (socket && chat.conversationId) {
        socket.off('user_typing_message');
        socket.off('user_stopped_typing');
        socket.off('new_message');
      }
    };
  }, [socket, chat.conversationId]);

  // Cuando usuario escribe un nuevo mensaje - detectar typing
  useEffect(() => {
    let typingTimeout: NodeJS.Timeout | undefined;

    if (newMessageUserInput.length > 0 && socket && chat.conversationId) {
      socket.emit('typing_message', chat.conversationId);

      // Detener typing después de 2 segundos de inactividad
      clearTimeout(typingTimeout);
      typingTimeout = setTimeout(() => {
        if (socket && chat.conversationId) {
          socket.emit('stop_typing_message', chat.conversationId);
        }
      }, 2000);
    }

    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
      // Limpiar el estado de typing al desmontar
      if (socket && chat.conversationId) {
        socket.emit('stop_typing_message', chat.conversationId);
      }
    };
  }, [newMessageUserInput, socket, chat.conversationId]);

  // Handler para el input
  const changeUserInputMessage: ChangeEventHandler<HTMLInputElement, HTMLInputElement> = (e) => {
    setNewMessageUserInput(e.target.value);
  }


  // Cuando el usuario envia el mensaje
  const handleNewMessageSend = async () => {
    // Generar un ID temporal negativo para identificar el mensaje local
    const tempId = Date.now();

    // Primero se añade el nuevo mensaje a la lista con ID temporal
    setMessagesList(prev => [
      ...prev, {
        id: -tempId, // ID negativo para identificar como mensaje local
        content: newMessageUserInput,
        date: formatDate(new Date().toISOString()), origin: 'self'
      }
    ]);

    // Detener el indicador de typing
    if (socket && chat.conversationId) {
      socket.emit('stop_typing_message', chat.conversationId);
    }



    // Luego se crea toda la comunicacion desde la Base de Datos
    try {

      // Verificar si se trata de un usuario nuevo
      if (chat.user?.new) {
        const response = await api.post<MessageResponse>('/conversations', {
          receiver_user_id: chat.user?.id,
          initial_message: newMessageUserInput
        });

        // Actualizar el mensaje temporal con los datos reales del backend
        setMessagesList(prev => prev.map(msg => 
          msg.id === -tempId 
            ? { 
                ...msg, 
                id: response.data.id, 
                date: formatDate(response.data.created_at) 
              }
            : msg
        ));

        // Notificar via socket que se envió el mensaje
        if (socket && response.data.conversationId) {
          socket.emit('message_sent', response.data.conversationId);
        }
      } else if (chat.conversationId) {
        // Si es una conversación existente, enviar mensaje a esa conversación
        const response = await api.post<MessageResponse>('/messages', {
          content: newMessageUserInput,
          conversation_id: chat.conversationId
        });

        // Actualizar el mensaje temporal con los datos reales del backend
        setMessagesList(prev => prev.map(msg => 
          msg.id === -tempId 
            ? { 
                ...msg, 
                id: response.data.id, 
                date: formatDate(response.data.created_at) 
              }
            : msg
        ));

        // Notificar via socket que se envió el mensaje
        if (socket) {
          socket.emit('message_sent', chat.conversationId);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      // Se limpia el campo
      setNewMessageUserInput("");
    }
  }






  if (!chat.isOpen || !chat.user) return null;

  return (
    <div className="fixed bottom-0 right-8 w-80 bg-white shadow-2xl rounded-t-xl border border-gray-200 flex flex-col z-50 animate-in slide-in-from-bottom duration-300">
      {/* Header Estilo LinkedIn */}
      <div className="p-3 bg-white border-b flex justify-between items-center cursor-pointer rounded-t-xl hover:bg-gray-50">
        <div className="flex items-center gap-2">
          <Avatar
            initialSrc={chat.user.avatar}
            size="sm"
          />
          <span className="font-bold text-sm text-gray-800">{chat.user.username}</span>
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
        <p className="text-[10px] text-center text-gray-400">Estás chateando con {chat.user.username}</p>

        {/* Lista de mensajes */}
        {messagesList.map((message) => (
          <div key={message.id} className={`p-2 rounded-lg ${message.origin === 'self' ? 'bg-blue-500 text-white ml-auto' : 'bg-gray-200 text-gray-800 mr-auto'}`}>
            <p className="text-sm">{message.content}</p>
            <p className="text-[8px] text-right">{message.date}</p>
          </div>
        ))}

        {/* Indicador de que el otro usuario está escribiendo */}
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
      <div className="p-3 border-t bg-white flex gap-2">
        <Input
          value={newMessageUserInput}
          onChange={changeUserInputMessage}
          type="text"
          placeholder="Escribe un mensaje..."
        />

        <Button onClick={handleNewMessageSend}>
          <LuSend />
        </Button>
      </div>
    </div>
  );
}