import Avatar from "@/components/Avatar";
import Card from "@/components/UI/Card";
import Text from "@/components/UI/Text";
import Link from "next/link";
import { useState } from "react";

export default function PostAuthor({ 
    username, 
    date, 
    avatar,
    userId,
    allowUserClickProfile
}: { 
    username: string, 
    date: string, 
    avatar: string,
    userId: number,
    allowUserClickProfile?: boolean
}) {
    const [showUserDetails, setShowUserDetails] = useState<boolean>(false);

    return (
        /* 1. Contenedor relativo para que el pop-up se posicione respecto a este div */
        <div className="relative flex items-center gap-2 mb-3">
            
            <div className="relative">
                <Avatar
                    initialSrc={avatar}
                    size="sm"
                    onClick={() => setShowUserDetails(!showUserDetails)}
                    className="hover:cursor-pointer"
                />

                {/* 2. Tarjeta Emergente (Pop-up) */}
                {showUserDetails && allowUserClickProfile && (
                    <>
                        {/* Overlay invisible para cerrar al hacer click fuera */}
                        <div 
                            className="fixed inset-0 z-10" 
                            onClick={() => setShowUserDetails(false)} 
                        />

                        {/* La Card posicionada absolutamente respecto al Avatar */}
                        <Card 
                            variant="elevated" 
                            padding="sm"
                            className="absolute top-full left-0 mt-2 w-48 z-100 shadow-2xl animate-in fade-in zoom-in duration-200"
                        >
                            <div className="flex flex-col gap-1">
                                <Text weight="bold" variant="sm">{username}</Text>
                                <Text variant="xs" className="text-gray-500">Estudiante de la UDO</Text>
                                <hr className="my-1 border-gray-100" />
                                <Link href={`profile/${userId}`} className="text-xs text-blue-600">Ver perfil completo</Link>
                            </div>
                        </Card>
                    </>
                )}
            </div>

            <div>
                <p className="font-bold text-gray-900 text-sm">{username}</p>
                <p className="text-xs text-gray-500">
                    {new Date(date).toLocaleDateString()}
                </p>
            </div>
        </div>
    );
}