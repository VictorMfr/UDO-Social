"use client";

import { use, useEffect, useState } from "react";
import api from "@/lib/axios";
import Card from "@/components/UI/Card";
import Avatar from "@/components/Avatar";
import Text from "@/components/UI/Text";
import Title from "@/components/UI/Title";
import Feed from "@/components/FeedPage/Feed/Feed";

interface PublicUser {
    id: number,
    avatar: string,
    username: string,
    bio: string,
}

export default function UserPublicProfile({ params }: { params: Promise<{ userId: string }> }) {
    const [user, setUser] = useState<PublicUser | null>(null);
    const [loading, setLoading] = useState(true);

    const { userId } = use(params);


    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                // Consultamos al endpoint público por ID
                const response = await api.get(`/users/${userId}`);
                setUser(response.data);
            } catch (error) {
                console.error("Error cargando perfil", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserProfile();
    }, [userId]);

    if (loading) return <p className="text-center p-10">Cargando perfil del estudiante...</p>;
    if (!user) return <p className="text-center p-10">Usuario no encontrado.</p>;

    return (

        <div className="w-full bg-gray-100 h-screen">

            {/* Contenedor interno para centrar el contenido (Grid) */}
            <div className="grid grid-cols-12 gap-6 max-w-7xl mx-auto p-6">

                {/* 1. Sidebar de Perfil */}
                <aside className="col-span-12 md:col-span-4 lg:col-span-3">
                    <Card variant="flat" padding="lg" className="sticky top-24 flex flex-col items-center text-center">
                        <div className="mb-4">
                            <Avatar
                                initialSrc={user.avatar}
                                size="xl"
                                editable={false}
                                className="shadow-sm rounded-full"
                            />
                        </div>

                        <Title variant="h3" weight="black" className="text-gray-900">
                            {user.username}
                        </Title>

                        <Text variant="sm" className="text-gray-400 mb-4">
                            @{user.username.toLowerCase()}
                        </Text>

                        <div className="w-full border-t border-gray-100 pt-4">
                            <Text className="text-gray-600 text-sm leading-relaxed">
                                {user.bio || "Este estudiante aún no ha definido su biografía académica."}
                            </Text>
                        </div>
                    </Card>
                </aside>

                {/* 2. Seccion de Feed */}
                <main className="col-span-12 md:col-span-8 lg:col-span-9 space-y-4 px-16">
                    <Feed userId={user.id} />
                </main>

            </div>
        </div>



    );
}