import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Cookies from "js-cookie";
import { LoginCredentials } from "../auth.types";
import { AxiosError } from "axios";

export const useLogin = () => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const login = async (formData: LoginCredentials) => {
        setLoading(true);
        setError(null);
        try {
            await api.post("/auth/login", formData, { withCredentials: true });
            Cookies.set('app_session_status', 'active', { expires: 1, sameSite: 'lax' });
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

    return { login, error, loading };
};