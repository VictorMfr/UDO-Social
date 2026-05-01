import { useState } from "react";
import { ChatWindow, ContactUser } from "../chat.types";

// useChatWindow.ts (Lógica extraída)
export const useChatWindow = () => {
    const [chatWindow, setChatWindow] = useState<ChatWindow>({ isOpen: false, user: null });
    
    const openChat = (user: ContactUser, conversationId?: number) => {
        setChatWindow({ isOpen: true, user, conversationId })
    }
        
    const closeChat = () => setChatWindow({ isOpen: false, user: null });

    return { chatWindow, openChat, closeChat };
};