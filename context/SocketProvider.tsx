'use client';

import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useUserContext } from "./UserProvider";

const SocketContext = createContext<{
    socket: Socket | null
}>({
    socket: null
});

const socketConnection = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
    transports: ['websocket'],
    autoConnect: false
});

export function useSocketContext () {
    const ctx = useContext(SocketContext);
    return ctx;
}

export default function SocketProvider({ children }: { children: React.ReactNode }) {
    const [socket] = useState<Socket>(socketConnection);

    // contexto de usuario
    const userCtx = useUserContext();

    const data = {
        socket
    }

    useEffect(() => {
        // Mandar una señal de que el usuario esta en linea
        if (!socket.connected) {
            socket.connect();
        }

        if (userCtx.user) {
            socket.emit('user_online', { userId: userCtx.user.id });
        }
        
    }, [socket, userCtx.user]);

    return (
        <SocketContext.Provider value={data}>
            {children}
        </SocketContext.Provider>
    )
}