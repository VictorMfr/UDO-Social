import { useUserContext } from "@/context/UserProvider";
import { useState } from "react";
import SearchBar from "./SearchBar";
import Contacts, { SearchUser } from "./Contacts/Contacts";
import ChatFloatingWindow from "./Contacts/ChatFloatingWindows";

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
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col sticky top-20 overflow-hidden h-[calc(100vh-120px)]">

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
        </div>
    );
}