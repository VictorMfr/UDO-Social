import { useRouter } from "next/navigation";
import { useState } from "react";
import { RegisterCredentials } from "../auth.types";
import { AxiosError } from "axios";
import api from "@/lib/axios";

export const useRegister = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const register = async (formData: RegisterCredentials) => {
    if (formData.password !== formData.confirmPassword) {
      return setError("Las contraseñas no coinciden");
    }
    if (formData.password.length < 6) {
      return setError("La contraseña debe tener al menos 6 caracteres");
    }

    setLoading(true);
    setError(null);

    try {
      await api.post("/auth/register", {
        email: formData.email,
        password: formData.password,
        username: formData.username
      });
      router.replace("/login");
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(axiosError.response?.data?.message || "Ocurrió un error");
    } finally {
      setLoading(false);
    }
  };

  return { register, error, loading };
};