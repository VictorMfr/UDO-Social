'use client';

import Avatar from "@/components/Avatar";
import Text from "@/components/UI/Text";
import IsTypingMessage from "@/features/chat/components/IsTypingMessage";

interface ChatListItemProps {
  username: string;
  avatarSrc?: string | null;
  lastMessage: string;
  date: string;
  isActive?: boolean;
  isOnline?: boolean;   // Nueva prop desde el hook central
  isTyping?: boolean;   // Nueva prop desde el hook central
  onClick?: () => void;
}

export default function ChatListItem({
  username,
  avatarSrc,
  lastMessage,
  date,
  isActive = false,
  isOnline = false,
  isTyping = false,
  onClick
}: ChatListItemProps) {

  return (
    <div
      onClick={onClick}
      className={`
        flex items-center gap-3 cursor-pointer transition-all duration-200
        hover:bg-gray-50 active:bg-gray-100 p-2 rounded-xl
        ${isActive ? 'bg-blue-50/50' : ''}
      `}
    >
      {/* 1. Avatar con indicador de línea */}
      <div className="relative">
        <Avatar
          initialSrc={avatarSrc}
          size="sm"
          className="border-none shadow-sm"
        />
        
        {isOnline && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
        )}
      </div>

      {/* 2. Contenido del mensaje */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline gap-2">
          <Text weight="bold" className="text-gray-900 truncate leading-none">
            {username}
          </Text>
          <Text variant="xs" className="text-gray-400 whitespace-nowrap leading-none">
            {date}
          </Text>
        </div>

        <div className="flex items-center gap-1 mt-1">
          {isTyping ? (
            <IsTypingMessage />
          ) : (
            <Text variant="sm" className="text-gray-500 truncate leading-none">
              {lastMessage}
            </Text>
          )}
        </div>
      </div>
    </div>
  );
}