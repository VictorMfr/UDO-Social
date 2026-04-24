"use client";

import { useState } from "react";
import Link from "@/components/UI/Link";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { AxiosError } from "axios";
import Cookies from "js-cookie";
import Text from "@/components/UI/Text";
import Title from "@/components/UI/Title";
import Input from "@/components/UI/Input";
import Button from "@/components/UI/Button";
import Card from "@/components/UI/Card";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();











  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Disparar estado de carga
    setLoading(true);
    setError(null);

    try {

      // Hacer peticion
      await api.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      }, { withCredentials: true });

      // 2. CREAR LA COOKIE DE ESPEJO
      // Esta cookie no es sensible (no tiene el token), solo es una señal.
      // Debe llamarse igual que la que buscaremos en el proxy.
      Cookies.set('app_session_status', 'active', {
        expires: 1, // 1 día
        sameSite: 'lax' // Al ser el mismo dominio del cliente, lax funciona perfecto
      });

      router.replace('/feed');
    } catch (err) {
      if (err instanceof AxiosError && err.response) {
        setError(err.response.data.message || "Credenciales incorrectas");
      } else {
        setError("Error de conexión con el servidor");
      }
    } finally {
      setLoading(false);
    }
  };










  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card variant="flat" padding="lg" className="max-w-sm w-full space-y-8">

        {/* Encabezado */}
        <div className="text-center space-y-2">
          <Title variant="h3" weight="black">
            Bienvenido de nuevo
          </Title>
          <Text variant="sm" className="text-gray-500">
            Ingresa a tu cuenta de UDO Social
          </Text>
        </div>

        {/* Alerta de Error */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
            <Text variant="xs" weight="semibold" className="text-red-700">
              {error}
            </Text>
          </div>
        )}

        {/* Formulario */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="Correo"
              type="email"
              placeholder="Ej. correo@ejemplo.com"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              sizeVariant="md"
            />

            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              sizeVariant="md"
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              isLoading={loading}
              className="w-full"
              size="lg"
            >
              Entrar ahora
            </Button>
          </div>
        </form>

        {/* Pie de página */}
        <div className="text-center">
          <Text variant="sm" className="text-gray-500">
            ¿No tienes una cuenta?{" "}
            <Link
              href="/register"
              size="none"
              variant="ghost"
              className="text-blue-600 font-bold hover:underline"
            >
              Regístrate aquí
            </Link>
          </Text>
        </div>
      </Card>
    </div>
  );
}