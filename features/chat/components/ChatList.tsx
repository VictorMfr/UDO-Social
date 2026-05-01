import { useMemo } from "react";
import { ContactUser, Conversation } from "../chat.types";
import { formatDate } from "@/lib/formatDate";
import { useConversations } from "../hooks/useConversations";
import { useSearchUsers } from "../hooks/useSearchUsers";
import NoResultsMessage from "./NoResultsMessage";
import ChatListItem from "./ChatListItem";

export default function ChatList({
    searchTerm,
    onSelectChat
}: {
    searchTerm: string;
    onSelectChat: (user: ContactUser, conversationId?: number) => void
}) {

    
    const { conversations, loading, onlineUsers, typingStatus } = useConversations();

    // Filtrado local
    const filteredConversations = useMemo(() => {
        if (!searchTerm) return conversations;

        return conversations.filter(conversation => {
            if (conversation.type == 'PRIVATE') {
                return conversation.other_participants[0].user.username.includes(searchTerm);
            }
        });
    }, [searchTerm, conversations]);

    const { foundUsers, isSearchingAPI } = useSearchUsers(searchTerm, filteredConversations.length);

    // Lógica de visualización
    const showSkeleton = loading || isSearchingAPI;

    // Si no hay resultados despues de buscar nuevos usuarios
    const noResults = !showSkeleton && searchTerm && searchTerm.length > 2 && filteredConversations.length === 0 && foundUsers.length === 0;

    // Si inicialmente la lista de contactos esta vacia, mostramos un mensaje
    const isEmptyContacts = !loading && conversations.length === 0 && !searchTerm;

    // Lógica de carga
    if (showSkeleton) return null;
    if (isEmptyContacts) return null;
    if (noResults) return <NoResultsMessage/>

    return (
        <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conv) => {
                const partner = conv.other_participants[0].user;
                return (
                    <ChatListItem
                        key={conv.id}
                        username={partner.username}
                        avatarSrc={partner.avatar}
                        date={formatDate(conv.updated_at)}
                        lastMessage={conv.lastMessage.content}
                        isOnline={onlineUsers.has(partner.id)}
                        isTyping={!!typingStatus[conv.id]}
                        onClick={() => onSelectChat(partner, conv.id)}
                    />
                );
            })}

            {filteredConversations.length === 0 && foundUsers.map((user) => (
                <ChatListItem
                    key={`user-${user.id}`}
                    username={user.username}
                    avatarSrc={user.avatar}
                    date="" 
                    lastMessage="Empezar nueva conversación"
                    isOnline={onlineUsers.has(user.id)} // También podemos saber si están online
                    isTyping={false} // No puede estar escribiendo si no hay chat aún
                    onClick={() => onSelectChat(user)}
                />
            ))}
        </div>
    );
}