'use client';

import Avatar from "@/components/Avatar";
import Text from "@/components/UI/Text";
import { useSocketContext } from "@/context/SocketProvider";
import { useEffect, useState } from "react";
import { LuCheckCheck } from "react-icons/lu";

interface ContactItemProps {
  userId: number; // ID del contacto para comparar con eventos de socket
  conversationId?: number; // ID de la conversación para eventos de typing
  username: string;
  avatarSrc?: string | null;
  lastMessage: string;
  date: string;
  isActive?: boolean; // Para resaltar si el chat está abierto
  onClick?: () => void;
  isRead: boolean;
  newContact?: boolean
}

export default function ContactItem({
  userId,
  conversationId,
  username,
  avatarSrc,
  lastMessage,
  date,
  isActive = false,
  isRead = false,
  newContact,
  onClick
}: ContactItemProps) {

  const [isOnline, setIsOnline] = useState<boolean>();
  const [isTyping, setIsTyping] = useState(false);

  const { socket } = useSocketContext();

  useEffect(() => {
    if (socket) {
      // Escuchar cuando el usuario se conecta (recibe lista de contactos en línea)
      socket.on('contacts_online', ({ contacts }: { contacts: number[] }) => {
        if (contacts.includes(userId)) {
          setIsOnline(true);
        }
      });

      // Cuando recibe una notificacion de que un contacto esta en linea
      socket.on('contact_online', ({ userId: onlineUserId }: { userId: number }) => {
        if (onlineUserId === userId) {
          setIsOnline(true);
        }
      });

      // Cuando el contacto se desconecta
      socket.on('contact_offline', ({ userId: offlineUserId }: { userId: number }) => {
        if (offlineUserId === userId) {
          setIsOnline(false);
        }
      });

      // Escuchar eventos de typing para esta conversación
      if (conversationId) {
        socket.on('user_typing_message', ({ conversationId: convId }: { conversationId: number }) => {
          if (convId === conversationId) {
            setIsTyping(true);
          }
        });

        socket.on('user_stopped_typing', ({ conversationId: convId }: { conversationId: number }) => {
          if (convId === conversationId) {
            setIsTyping(false);
          }
        });

        // Escuchar nuevos mensajes para actualizar el último mensaje
        socket.on('new_message', ({ conversationId: convId, message }) => {
          if (convId === conversationId) {
            setIsTyping(false);
          }
        });
      }
    }

    return () => {
      if (socket) {
        socket.off('contacts_online');
        socket.off('contact_online');
        socket.off('contact_offline');
        socket.off('user_typing_message');
        socket.off('user_stopped_typing');
        socket.off('new_message');
      }
    };
  }, [socket, userId, conversationId]);



  return (
    <div
      onClick={onClick}
      className={`
        flex items-center gap-3 cursor-pointer transition-all duration-200
        hover:bg-gray-50 active:bg-gray-100 p-2 rounded
        ${isActive ? 'bg-blue-50/50' : ''}
      `}
    >
      {/* 1. Avatar sin bordes pesados para listas */}
      <div className="relative">
        <Avatar
          initialSrc={avatarSrc}
          size="sm"
          className="border-none shadow-sm"
        />
        {/* Indicador de línea (opcional, podrías pasarlo por props) */}
        {isOnline && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>}
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

        {/* El mensaje se trunca automáticamente si es muy largo */}
        <div className="flex gap-1">
          {/* Icono de leido */}
          {!newContact && <LuCheckCheck className={`${isRead? 'text-blue-500': 'text-gray-300'}`}/>}
          {isTyping ? (
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-xs text-green-600 italic">escribiendo</span>
              <div className="flex gap-0.5">
                <span className="w-1 h-1 bg-green-600 rounded-full animate-bounce"></span>
                <span className="w-1 h-1 bg-green-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1 h-1 bg-green-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          ) : (
            <Text className="text-xs text-gray-500 truncate mt-0.5 leading-none">
              {lastMessage}
            </Text>
          )}
        </div>



      </div>

      {/* 3. Indicador de no leído (opcional) */}
      {/* <div className="w-2 h-2 bg-blue-600 rounded-full"></div> */}
    </div>
  );
}