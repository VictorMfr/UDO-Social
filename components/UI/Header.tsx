'use client';

import Link from "./Link";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Button from "./Button"; // Asumiendo que guardaste el componente Button anterior

export default function Header({
    auth
}: {
    auth: boolean
}) {
    const router = useRouter();

    const logout = async () => {
        try {
            // Petición al backend de Express para invalidar sesión
            await api.post("/auth/logout", {}, { withCredentials: true });
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        } finally {
            // Limpieza de estado local y redirección
            Cookies.remove('app_session_status');
            router.replace("/login");
        }
    }

    return (
        <header className="top-0 w-full bg-white/80 backdrop-blur-md border-b border-black/20 z-50">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-blue-700 tracking-tight">
                    UDO Social
                </h1>
                <nav>
                    <ul className="flex items-center gap-4">
                        {/* Renderizar solo si NO está autenticado */}
                        {!auth ? (
                            <>
                                <li>
                                    <Link
                                        href="/login"
                                        size="sm"
                                        variant="solid"
                                    >
                                        Iniciar sesión
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/register"
                                        size="sm"
                                        variant="outline"
                                    >
                                        Registrarse
                                    </Link>
                                </li>
                            </>
                        ) : (
                            /* Renderizar solo si ESTÁ autenticado */
                            <li>
                                <Button
                                    onClick={logout}
                                    intent="ghost"
                                    size="sm"
                                    className="text-gray-500 hover:text-red-600"
                                >
                                    Salir
                                </Button>
                            </li>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
}