import ChatFloatingWindow from "@/features/chat/components/ChatFloatingWindows";
import SearchBar from "@/features/chat/components/SearchBar";
import Card from "@/components/UI/Card";
import Text from "@/components/UI/Text";
import InboxSkeleton from "./InboxSkeleton";
import { useUserContext } from "@/context/UserProvider";
import { useState } from "react";
import { useChatWindow } from "../hooks/useChatWindow";
import ChatList from "./ChatList";

export default function InboxCard() {
    const { loading } = useUserContext();
    const [searchTerm, setSearchTerm] = useState("");
    const { chatWindow, openChat, closeChat } = useChatWindow();

    if (loading) return <InboxSkeleton />;

    return (
        <Card className="sticky top-10 space-y-2 h-167.5" variant="elevated" padding="md">
            <Text variant="sm" className="text-gray-400">(Esta funcionalidad aun no es segura)</Text>
            <div>
                <Text variant="xl" weight="bold">Mensajes</Text>
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            </div>

            <ChatList 
                searchTerm={searchTerm}
                onSelectChat={openChat}
            />

            <ChatFloatingWindow 
                chat={chatWindow} 
                onClose={closeChat} 
            />

            
        </Card>
    );
}