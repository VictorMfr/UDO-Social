import api from "@/lib/axios";
import { useEffect, useMemo, useState } from "react";
import { ChatWindow } from "../Inbox";
import ContactItem from "./ContactItem";
import { formatDate } from "@/lib/formatDate";
import Text from "@/components/UI/Text";
import { useSocketContext } from "@/context/SocketProvider";

// Interfaz de un contacto normal
export interface Conversation {
    id: number,
    type: 'PRIVATE' | 'GROUP',
    updated_at: string,
    self_participation: {
        last_read_message_id: number
    },
    lastMessage: {
        content: string
    },
    other_participants: {
        user_id: number,
        user: {
            id: number,
            username: string,
            avatar: string
        } 
    }[]
}

// Interfaz de un usuario buscado en la API
export interface ContactUser {
    id: number;
    username: string;
    avatar: string;
    new?: boolean;
}

export default function Contacts({
    searchTerm,
    onSelectChat
}: {
    searchTerm: string;
    onSelectChat: (chat: ChatWindow) => void
}) {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [foundUsers, setFoundUsers] = useState<ContactUser[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isSearchingAPI, setIsSearchingAPI] = useState<boolean>(false);

    // Socket
    const { socket } = useSocketContext();


    // Iniciar conversacion con un nuevo usuario encontrado
    const handleNewUserClick = async (user: ContactUser) => {
        // Solo abrir ventana de chat con la id del usuario encontrado
        onSelectChat({
            isOpen: true,
            user: {
                ...user,
                new: true
            }
        });
    };

    const handleExistingUserClick = async (conv: Conversation) => {
        onSelectChat({
            isOpen: true,
            user: conv.other_participants[0].user,
            conversationId: conv.id
        });
    }

    // Cargar conversaciones iniciales
    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const response = await api.get<Conversation[]>("/conversations");
                setConversations(response.data);
            } catch (error) {
                console.error('Error al cargar conversaciones', error);
            } finally {
                setLoading(false);
            }
        };
        fetchConversations();
    }, []);

    // Escuchar nuevos mensajes para actualizar la lista de conversaciones
    useEffect(() => {
        if (socket) {
            socket.on('new_message', ({ conversationId, message }) => {
                setConversations(prev => prev.map(conv => {
                    if (conv.id === conversationId) {
                        return {
                            ...conv,
                            lastMessage: { content: message.content },
                            updated_at: message.date
                        };
                    }
                    return conv;
                }));
            });

            // También escuchar cuando se envía un mensaje (para actualizar el remitente)
            socket.on('message_sent', ({ conversationId }: { conversationId: number }) => {
                // Recargar las conversaciones para obtener el último mensaje actualizado
                api.get<Conversation[]>("/conversations").then(response => {
                    setConversations(response.data);
                }).catch(console.error);
            });
        }

        return () => {
            if (socket) {
                socket.off('new_message');
                socket.off('message_sent');
            }
        };
    }, [socket]);



    // Filtrado local
    const filteredConversations = useMemo(() => {
        if (!searchTerm) return conversations;

        return conversations.filter(conversation => {
            if (conversation.type == 'PRIVATE') {
                return conversation.other_participants[0].user.username.includes(searchTerm);
            }
        });
    }, [searchTerm, conversations]);


    // Busqueda remota con debounce
    useEffect(() => {
        // Limpiamos usuarios encontrados si el término es corto o hay coincidencias locales
        if (searchTerm.length <= 2 || filteredConversations.length > 0) {
            setFoundUsers([]);
            setIsSearchingAPI(false);
            return;
        }

        // Consultar a la API por los usuarios disponibles a conversar
        const delayDebounceFn = setTimeout(async () => {
            setIsSearchingAPI(true);
            try {
                const response = await api.get<ContactUser[]>(`/users?q=${searchTerm}`);
                setFoundUsers(response.data);
            } catch (error) {
                console.error('Error al buscar usuarios', error);
            } finally {
                setIsSearchingAPI(false);
            }
        }, 500);

        // ESTO ES VITAL: Cancela el timer si el usuario sigue escribiendo
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, filteredConversations.length]);


    // Lógica de visualización
    const showSkeleton = loading || isSearchingAPI;

    // Si no hay resultados despues de buscar nuevos usuarios
    const noResults = !showSkeleton && searchTerm && searchTerm.length > 2 && filteredConversations.length === 0 && foundUsers.length === 0;

    // Si inicialmente la lista de contactos esta vacia, mostramos un mensaje
    const isEmptyContacts = !loading && conversations.length === 0 && !searchTerm;



    return (
        <div className="flex-1 overflow-y-auto">
            {showSkeleton ? (
                <div className="animate-pulse p-4 space-y-3">
                    {[1, 2, 3].map(i => <div key={i} className="h-12 bg-gray-200 rounded-xl w-full" />)}
                </div>
            ) : (
                <div>
                    {/* Prioridad 1: Conversaciones locales */}
                    {filteredConversations.map((conv) => (
                        <ContactItem
                            userId={conv.other_participants[0].user.id}
                            conversationId={conv.id}
                            date={formatDate(conv.updated_at)}
                            lastMessage={conv.lastMessage.content || "Sin mensajes"}
                            username={conv.other_participants[0].user.username}
                            key={`conv-${conv.id}`}
                            avatarSrc={conv.other_participants[0].user.avatar}
                            isRead={false}
                            onClick={() => handleExistingUserClick(conv)}
                        />
                    ))}

                    {/* Mensaje si no hay contactos inicialmente */}
                    {isEmptyContacts && (
                        <div className="text-center py-10">
                            <Text>Aún no tienes conversaciones. Busca a alguien para iniciar un chat.</Text>
                        </div>
                    )}

                    {/* Prioridad 2: Usuarios nuevos de la API */}
                    {foundUsers.map((user) => (
                        <ContactItem
                            userId={user.id}
                            date={''}
                            lastMessage={"Empezar nueva conversacion"}
                            username={user.username}
                            key={user.id}
                            avatarSrc={user.avatar}
                            isRead={false}
                            newContact={true}
                            onClick={() => handleNewUserClick(user)}
                        />
                    ))}

                    {/* Mensaje si no hay contactos despues de filtrar */}
                    {noResults && (
                        <div className="text-center py-10">
                            <Text>No encontramos a nadie con ese nombre.</Text>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}