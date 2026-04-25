import { useUserContext } from "@/context/UserProvider";
import { useState } from "react";
import SearchBar from "./SearchBar";
import Contacts, { SearchUser } from "./Contacts/Contacts";
import ChatFloatingWindow from "./Contacts/ChatFloatingWindows";
import Card from "@/components/UI/Card";

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
    dest: SearchUser | Conversation | null;
}

export default function Inbox() {

    const userCtx = useUserContext();

    // Estados para la búsqueda
    const [searchTerm, setSearchTerm] = useState("");

    const [chatWindow, setChatWindow] = useState<ChatWindow>({
        isOpen: false,
        dest: null
    });

    // Verificar que las credenciales del usuario estén cargando o no
    if (userCtx.loading) {
        return (
            <aside className="animate-pulse">
                <div className="bg-gray-300 w-full h-[600px] rounded" />
            </aside>
        )
    }


    return (
        <Card className="sticky top-10" variant="flat">
            {/* Header de mensajes */}
            <div className="p-4 border-b bg-white flex justify-between items-center">
                <h2 className="font-bold text-gray-900">{"Mensajes"}</h2>
            </div>

            {/* Buscador Dinámico */}
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

            {/* Lista de contactos */}
            <Contacts searchTerm={searchTerm} onSelectChat={setChatWindow} />

            {/* Ventana de chat flotante */}
            <ChatFloatingWindow
                chat={chatWindow}
                onClose={() => setChatWindow({
                    isOpen: false,
                    dest: null
                })}
            />
        </Card>
    );
}