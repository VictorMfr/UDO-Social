'use client';

import { useState, useRef, MouseEventHandler } from 'react';
import Image from 'next/image';
import api from '@/lib/axios';
import { LuCamera, LuLoader } from 'react-icons/lu';
import Text from './UI/Text';

interface AvatarProps {
  initialSrc?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  editable?: boolean;
  className?: string;
  onMouseOver?: MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: MouseEventHandler<HTMLDivElement>;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

const sizeClasses = {
  sm: 'w-10 h-10',
  md: 'w-16 h-16',
  lg: 'w-24 h-24',
  xl: 'w-32 h-32',
};

export default function Avatar({ 
    initialSrc, 
    size = 'md', 
    editable = false,
    className = "", // Valor por defecto vacío
    onMouseOver,
    onMouseLeave,
    onClick
}: AvatarProps) {
  const [src, setSrc] = useState(initialSrc || '/default-avatar.png');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    const previousSrc = src;
    setSrc(localUrl);
    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await api.put('/users/me/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSrc(response.data.avatarUrl);
    } catch (err) {
      setSrc(previousSrc);
      setError('No se pudo subir la imagen');
    } finally {
      setIsUploading(false);
      URL.revokeObjectURL(localUrl);
    }
  };

  return (
    /* Aplicamos className al contenedor padre */
    <div 
      className={`flex flex-col items-center gap-2 ${className}`}
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      <div className={`relative group rounded-full overflow-hidden border-2 border-gray-100 bg-gray-50 ${sizeClasses[size]}`}>
        <Image
          src={src}
          alt="Avatar de usuario"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />

        {isUploading && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
            <LuLoader className="w-1/2 h-1/2 text-white animate-spin" />
          </div>
        )}

        {editable && !isUploading && (
          <button
            onClick={(e) => {
              e.stopPropagation(); // Evitamos que el click dispare el onClick del padre
              fileInputRef.current?.click();
            }}
            className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white z-20"
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