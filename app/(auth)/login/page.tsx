"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { AxiosError } from "axios";
import Cookies from "js-cookie";

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
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl shadow-gray-200/50">
        {/* Encabezado */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Bienvenido de nuevo</h2>
          <p className="mt-2 text-sm text-gray-500">
            Ingresa a tu cuenta de UDO Social
          </p>
        </div>

        {/* Alerta de Error */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Formulario */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Correo</label>
              <input
                type="text"
                required
                className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                placeholder="Ej. correo@ejemplo.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contraseña</label>
              <input
                type="password"
                required
                className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Cargando..." : "Entrar ahora"}
            </button>
          </div>
        </form>

        {/* Pie de página del login */}
        <div className="text-center text-sm">
          <p className="text-gray-500">
            ¿No tienes una cuenta?{" "}
            <Link href="/register" className="font-semibold text-blue-600 hover:text-blue-500">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}