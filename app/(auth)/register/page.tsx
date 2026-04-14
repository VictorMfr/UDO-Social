"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { AxiosError } from "axios";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "" // Nuevo campo en el estado
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();



  // Enviar formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Disparar estado de cargado
    setLoading(true);
    setError(null);

    // Validación de igualdad de la contraseña
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    // Validación de longitud mínima de contraseña
    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      setLoading(false);
      return;
    }


    try {
      // Envio de los datos
      const response = await api.post("/auth/register", {
        email: formData.email,
        password: formData.password,
        username: formData.username
      });


      // Si todo marcha bien, redirigir a iniciar sesion
      if (response.status === 201) {
        router.replace("/login");
      }

    } catch (err) {
      console.log(err)
      const axiosError = err as AxiosError<{ message: string }>;
      setError(
        axiosError.response?.data?.message || "Ocurrió un error en el registro"
      );
    } finally {
      setLoading(false);
    }
  };
















  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl shadow-gray-200/50">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Crea tu cuenta</h2>
          <p className="mt-2 text-sm text-gray-500">
            Únete a la red de Ingeniería de Sistemas UDO
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-sm animate-pulse rounded-lg">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">


            <div>
              <label className="block text-sm font-medium text-gray-700">Usuario</label>
              <input
                required
                className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                placeholder="nombreDeUsuario"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>


            <div>
              <label className="block text-sm font-medium text-gray-700">Correo</label>
              <input
                type="email"
                required
                className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                placeholder="correo@ejemplo.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            {/* Grid para que en PC se vean uno al lado del otro */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                <input
                  type="password"
                  required
                  className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Repetir</label>
                <input
                  type="password"
                  required
                  className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none transition-all ${loading ? "opacity-70 cursor-not-allowed" : "hover:scale-[1.02]"
              }`}
          >
            {loading ? "Validando datos..." : "Registrarse"}
          </button>
        </form>

        <div className="text-center text-sm">
          <p className="text-gray-500">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}