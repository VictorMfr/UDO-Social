import { useEffect, useState } from "react";
import { Conversation } from "../chat.types";
import { useSocketContext } from "@/context/SocketProvider";
import api from "@/lib/axios";

export const useConversations = () => {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    
    // Estados centralizados
    const [onlineUsers, setOnlineUsers] = useState<Set<number>>(new Set());
    const [typingStatus, setTypingStatus] = useState<Record<number, boolean>>({});

    const { socket } = useSocketContext();

    // 1. Carga inicial
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

    // 2. Lógica centralizada de Sockets
    useEffect(() => {
        if (!socket) return;

        // --- Gestión de Presencia ---
        const handleContactsOnline = ({ contacts }: { contacts: number[] }) => {
            setOnlineUsers(new Set(contacts));
        };

        const handleContactOnline = ({ userId }: { userId: number }) => {
            setOnlineUsers(prev => new Set(prev).add(userId));
        };

        const handleContactOffline = ({ userId }: { userId: number }) => {
            setOnlineUsers(prev => {
                const next = new Set(prev);
                next.delete(userId);
                return next;
            });
        };

        // --- Gestión de Escritura ---
        const handleTyping = ({ conversationId: id }: { conversationId: number }) => {
            setTypingStatus(prev => ({ ...prev, [id]: true }));
        };

        const handleStopTyping = ({ conversationId: id }: { conversationId: number }) => {
            setTypingStatus(prev => ({ ...prev, [id]: false }));
        };

        // --- Gestión de Mensajes (Actualización de lista) ---
        const handleNewMessage = ({ conversationId, message }: { conversationId: number, message: { content: string, date: string } }) => {
            setTypingStatus(prev => ({ ...prev, [conversationId]: false })); // Si llega mensaje, deja de escribir
            
            setConversations(prev => {
                const index = prev.findIndex(c => c.id === conversationId);
                if (index === -1) return prev; // Podrías disparar un fetch aquí si es conv nueva

                const updated = {
                    ...prev[index],
                    lastMessage: { content: message.content },
                    updated_at: message.date
                };

                // Movemos al principio (Optimistic UI)
                const filtered = prev.filter(c => c.id !== conversationId);
                return [updated, ...filtered];
            });
        };

        // Registro de eventos
        socket.on('contacts_online', handleContactsOnline);
        socket.on('contact_online', handleContactOnline);
        socket.on('contact_offline', handleContactOffline);
        socket.on('user_typing_message', handleTyping);
        socket.on('user_stopped_typing', handleStopTyping);
        socket.on('new_message', handleNewMessage);
        
        // Simplificamos message_sent usando la misma lógica de handleNewMessage o localmente
        socket.on('message_sent', ({ conversationId, message }) => {
             handleNewMessage({ conversationId, message }); 
        });

        return () => {
            socket.off('contacts_online', handleContactsOnline);
            socket.off('contact_online', handleContactOnline);
            socket.off('contact_offline', handleContactOffline);
            socket.off('user_typing_message', handleTyping);
            socket.off('user_stopped_typing', handleStopTyping);
            socket.off('new_message', handleNewMessage);
            socket.off('message_sent');
        };
    }, [socket]);

    return { 
        conversations, 
        setConversations, 
        loading, 
        onlineUsers, 
        typingStatus 
    };
};