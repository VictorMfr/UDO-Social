import { useUserContext } from "@/context/UserProvider";
import api from "@/lib/axios";
import { useEffect, useMemo, useState } from "react";
import { ChatWindow } from "../Inbox";

// Interfaz de un contacto normal
export interface Conversation {
    id: number;
    updated_at: string;
    starter_username: string;
    receiver_username: string;
    last_message: string | null;
    last_message_sender_id: number;
}

// Interfaz de un usuario buscado en la API
export interface SearchUser {
    id: number;
    username: string;
}




export default function Contacts({
    searchTerm,
    onSelectChat
}: {
    searchTerm: string;
    onSelectChat: (chat: ChatWindow) => void
}) {
    const userCtx = useUserContext();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [foundUsers, setFoundUsers] = useState<SearchUser[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isSearchingAPI, setIsSearchingAPI] = useState<boolean>(false);




    // Lógica para determinar el nombre del otro usuario
    const handleContactClick = (conv: Conversation) => {

        // Abrir ventana de chat con la información de la conversación seleccionada
        onSelectChat({
            isOpen: true,
            dest: conv
        });
    };

    // Iniciar conversacion con un nuevo usuario encontrado
    const handleNewUserClick = async (user: SearchUser) => {

        // Solo abrir ventana de chat con la id del usuario encontrado
        onSelectChat({
            isOpen: true,
            dest: user
        });
    };














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

    // Filtrado local
    const filteredConversations = useMemo(() => {
        if (!searchTerm) return conversations;
        const currentUsername = userCtx.user?.username || "";

        return conversations.filter(conversation => {
            const otherUsername = (conversation.starter_username === currentUsername)
                ? conversation.receiver_username
                : conversation.starter_username;
            return otherUsername.toLowerCase().includes(searchTerm.toLowerCase());
        });
    }, [searchTerm, conversations, userCtx.user]);











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
                const response = await api.get<SearchUser[]>(`/users?q=${searchTerm}`);
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
                <div className="p-4 space-y-2">
                    {/* Prioridad 1: Conversaciones locales */}
                    {filteredConversations.map((conv) => (
                        <div key={`conv-${conv.id}`} className="bg-white border rounded-xl p-4 hover:border-blue-300 transition-all cursor-pointer" onClick={() => handleContactClick(conv)}>
                            <h3 className="font-bold text-sm">
                                {conv.starter_username === userCtx.user?.username ? conv.receiver_username : conv.starter_username}
                            </h3>
                            <p className="text-xs text-gray-500 truncate">{conv.last_message || "Sin mensajes"}</p>
                        </div>
                    ))}

                    {/* Mensaje si no hay contactos inicialmente */}
                    {isEmptyContacts && (
                        <div className="text-center py-10">
                            <p className="text-gray-400 text-sm italic">Aún no tienes conversaciones. Busca a alguien para iniciar un chat.</p>
                        </div>
                    )}

                    {/* Prioridad 2: Usuarios nuevos de la API */}
                    {foundUsers.map((user) => (
                        <div
                            key={`user-${user.id}`}
                            className="bg-blue-50 border border-blue-100 rounded-xl p-4 hover:bg-blue-100 transition-all cursor-pointer"
                            onClick={() => handleNewUserClick(user)}
                        >
                            <h3 className="font-bold text-sm text-blue-800">@{user.username}</h3>
                            <p className="text-[10px] text-blue-500 uppercase font-bold tracking-tighter">Nuevo contacto</p>
                        </div>
                    ))}

                    {/* Mensaje si no hay contactos despues de filtrar */}
                    {noResults && (
                        <div className="text-center py-10">
                            <p className="text-gray-400 text-sm italic">No encontramos a nadie con ese nombre.</p>
                        </div>
                    )}


                </div>
            )}
        </div>
    );
}