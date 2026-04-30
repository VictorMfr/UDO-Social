import { useUserContext } from "@/context/UserProvider";
import { useState } from "react";
import SearchBar from "./SearchBar";
import Contacts, { ContactUser } from "./Contacts/Contacts";
import ChatFloatingWindow from "./Contacts/ChatFloatingWindow/ChatFloatingWindows";
import Card from "@/components/UI/Card";
import Text from "@/components/UI/Text";

export interface Conversation {
    id: number;
    updated_at: string;
    starter_username: string;
    receiver_username: string;
    last_message: string | null;
    last_message_sender_id: number;
}


// Tipado para la ventana
export interface ChatWindow {
    isOpen: boolean;
    user: ContactUser | null;
    conversationId?: number;
}

export default function Inbox() {

    const userCtx = useUserContext();

    // Estados para la búsqueda
    const [searchTerm, setSearchTerm] = useState("");

    const [chatWindow, setChatWindow] = useState<ChatWindow>({ isOpen: false, user: null });

    // Verificar que las credenciales del usuario estén cargando o no
    if (userCtx.loading) {
        return (
            <aside className="animate-pulse">
                <div className="bg-gray-300 w-full h-150 rounded" />
            </aside>
        )
    }

    const closeChatWindow = () => {
        setChatWindow({
            isOpen: false,
            user: null
        })
    }


    return (
        <Card className="sticky top-10 space-y-2 h-167.5" variant="flat" padding="md">
            {/* Header de mensajes */}

            <div>
                <Text variant="xl">Mensajes</Text>
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            </div>

            {/* Lista de contactos */}
            <Contacts searchTerm={searchTerm} onSelectChat={setChatWindow} />

            {/* Ventana de chat flotante */}
            <ChatFloatingWindow
                chat={chatWindow}
                onClose={closeChatWindow}
            />
        </Card>
    );
}