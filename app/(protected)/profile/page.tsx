"use client";
import api from "@/lib/axios";
import { useEffect, useState } from "react";

interface User {
    id: number,
    username: string,
    email: string,
    bio: string
}

export default function Profile() {
    const [bio, setBio] = useState("");
    const [username, setUsername] = useState("");
    const [loadingProfile, setLoadingProfile] = useState(true);

    // Para consultar el perfil de usuario
    useEffect(() => {
        const getProfile = async () => {
            try {
                const response = await api.get('/users/me');
                setBio(response.data.bio);
                setUsername(response.data.username);
            } catch (error) {
                console.log(error);
            } finally {
                setLoadingProfile(false)
            }
        }

        getProfile();
    }, []);

    const updateProfile = async () => {
        try {
            const response = await api.put('/users/me', {
                bio
            });

            if (response.status == 200) {
                alert('usuario actualizado');
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="bg-white rounded-2xl p-6">
            {/* Encabezado */}
            <div className="flex flex-col border-b pb-4 mb-4">
                <div className="h-20 w-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold mb-3">
                    U
                </div>
                <h2 className="text-xl font-bold text-gray-900">{username}</h2>
                <p className="text-sm text-gray-500">Edita tu información personal</p>
            </div>

            {/* Formulario de Bio */}
            <div className="space-y-4">
                <div className="">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Biografía
                    </label>
                    <textarea
                        className=" mt-2 p-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none resize-none transition-all text-gray-800"
                        placeholder="Escribe algo sobre ti..."
                        rows={4}
                        value={bio || ""}
                        onChange={(e) => setBio(e.target.value)}
                        disabled={loadingProfile}
                    />
                </div>

                <button
                    className="py-3 px-6 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-all active:scale-[0.98]"
                    onClick={updateProfile}
                >
                    Guardar cambios
                </button>
            </div>
        </div>
    );
}