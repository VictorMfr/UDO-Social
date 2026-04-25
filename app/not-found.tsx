"use client";
import Link from "next/link";
import { useRouter } from "next/navigation"; // 1. Importamos el router
import Card from "@/components/UI/Card";
import Title from "@/components/UI/Title";
import Text from "@/components/UI/Text";
import Button from "@/components/UI/Button";

export default function NotFound() {
  const router = useRouter(); // 2. Inicializamos el hook

  return (
    <div className="min-h-[calc(100vh-64px)] w-full bg-gray-50 flex items-center justify-center p-6">
      <Card variant="elevated" padding="lg" className="max-w-md w-full text-center shadow-xl">
        {/* Código de error visual */}
        <div className="mb-6">
          <span className="text-8xl font-black text-blue-100 select-none">404</span>
        </div>

        <Title variant="h2" weight="black" className="text-gray-900 mb-2">
          ¡Oops! Página no encontrada
        </Title>
        
        <Text className="text-gray-500 mb-8 leading-relaxed">
          La página que estás buscando no existe por los momentos. 
          Verifica la URL o regresa al feed principal.
        </Text>

        <div className="flex flex-col gap-3">
          {/* 3. Botón para retroceder usando router.back() */}
          <Button 
            onClick={() => router.back()} 
            className="w-full shadow-lg shadow-blue-500/20" 
            size="md"
          >
            <Text className="text-white">Regresar a la página anterior</Text>
          </Button>

          <Link href="/feed" className="w-full">
            
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <Text variant="xs" className="text-gray-400 italic">
            UDO Social
          </Text>
        </div>
      </Card>
    </div>
  );
}