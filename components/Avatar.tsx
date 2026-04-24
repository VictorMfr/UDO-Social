'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import api from '@/lib/axios';
import { LuCamera, LuLoader } from 'react-icons/lu'; // Usando react-icons para iconos
import Text from './UI/Text';

interface AvatarProps {
  initialSrc?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  editable?: boolean;
}

const sizeClasses = {
  sm: 'w-10 h-10',
  md: 'w-16 h-16',
  lg: 'w-24 h-24',
  xl: 'w-32 h-32',
};

export default function Avatar({ initialSrc, size = 'md', editable = false }: AvatarProps) {
  const [src, setSrc] = useState(initialSrc || '/default-avatar.png');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Optimistic Update: Mostrar previsualización local inmediata
    const localUrl = URL.createObjectURL(file);
    const previousSrc = src;
    setSrc(localUrl);
    setIsUploading(true);
    setError(null);

    // 2. Preparar el envío
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await api.put('/users/me/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // 3. Confirmar con la URL real del servidor
      setSrc(response.data.avatarUrl);
    } catch (err) {
      // 4. Rollback: Si falla la subida, volver a la imagen anterior
      setSrc(previousSrc);
      setError('No se pudo subir la imagen');
    } finally {
      setIsUploading(false);
      URL.revokeObjectURL(localUrl); // Limpiar memoria
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`relative group rounded-full overflow-hidden border-2 border-gray-100 bg-gray-50 ${sizeClasses[size]}`}>
        {/* Imagen del Avatar */}
        <Image
          src={src}
          alt="Avatar de usuario"
          fill
          className="object-cover"
        />

        {/* Overlay de carga */}
        {isUploading && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
            <LuLoader className="w-1/2 h-1/2 text-white animate-spin" />
          </div>
        )}

        {/* Botón de edición (solo si editable=true) */}
        {editable && !isUploading && (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
            title="Cambiar foto de perfil"
          >
            <LuCamera className="w-1/3 h-1/3" />
          </button>
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
      </div>
      
      {error && <Text variant="xs" className="text-red-500 font-medium">{error}</Text>}
    </div>
  );
}