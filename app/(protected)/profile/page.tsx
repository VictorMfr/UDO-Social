"use client";
import { useEffect, useState } from "react";
import api from "@/lib/axios";

// Tus componentes de sistema de diseño
import Card from "@/components/UI/Card";
import Title from "@/components/UI/Title";
import Text from "@/components/UI/Text";
import Button from "@/components/UI/Button";
import Avatar from "@/components/Avatar"; // El componente que creamos

interface UserData {
  id: number;
  username: string;
  email: string;
  bio: string;
  avatar: string | null;
}

export default function Profile() {
  const [user, setUser] = useState<UserData | null>(null);
  const [bio, setBio] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await api.get('/users/me');
        setUser(response.data);
        setBio(response.data.bio || "");
      } catch (error) {
        console.error("Error al cargar perfil:", error);
      } finally {
        setLoadingProfile(false);
      }
    };
    getProfile();
  }, []);

  const updateProfile = async () => {
    setIsUpdating(true);
    try {
      const response = await api.put('/users/me', { bio });
      if (response.status === 200) {
        alert('Información actualizada correctamente');
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
      alert('Error al guardar los cambios');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loadingProfile) {
    return <div className="p-10 text-center text-gray-500 italic">Cargando perfil...</div>;
  }

  return (
    <Card variant="elevated" padding="lg" className="max-w-2xl mx-auto">
      {/* SECCIÓN DE ENCABEZADO Y AVATAR */}
      <div className="flex flex-col items-center border-b border-gray-100 pb-8 mb-8 text-center">
        
        {/* Usamos el componente Avatar con la prop editable */}
        <Avatar 
          initialSrc={user?.avatar} 
          size="xl" 
          editable={true} 
        />
        
        <div className="mt-4">
          <Title variant="h3" weight="black" className="text-gray-900">
            {user?.username}
          </Title>
          <Text variant="sm" className="text-gray-500">
            {user?.email}
          </Text>
        </div>
      </div>

      {/* FORMULARIO DE INFORMACIÓN */}
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
            Biografía
          </label>
          <textarea
            className="w-full p-4 text-sm bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none resize-none transition-all text-gray-800 min-h-[120px]"
            placeholder="Cuéntale a la comunidad de la UDO sobre ti..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
          <Text variant="xs" className="text-gray-400 ml-1">
            Tu biografía será visible para todos los estudiantes de Ingeniería.
          </Text>
        </div>

        <div className="flex justify-end pt-4">
          <Button
            onClick={updateProfile}
            isLoading={isUpdating}
            size="md"
            className="px-8 shadow-lg shadow-blue-500/20"
          >
            Guardar cambios
          </Button>
        </div>
      </div>
    </Card>
  );
}