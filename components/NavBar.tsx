'use client';

import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function NavBar() {

    const router = useRouter();

    const logout = async () => {
        try {
            await api.post("/auth/logout", {}, { withCredentials: true });
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        } finally {
            Cookies.remove('app_session_status');
            router.replace("/login");
        }
    }

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
            <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
                <span className="font-bold text-blue-600 text-xl italic">UDO Social</span>
                <button
                    onClick={logout}
                    className="text-sm text-gray-500 hover:text-red-500 font-medium"
                >
                    Salir
                </button>
            </div>
        </nav>
    )
}