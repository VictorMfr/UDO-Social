"use client";

import { useState } from "react";
import Input from "@/components/UI/Input";
import Button from "@/components/UI/Button";
import { useLogin } from "@/features/auth/hooks/useLogin";
import { LoginCredentials } from "@/features/auth/auth.types";
import ErrorMessage from "@/features/auth/components/ErrorMessage";
import AuthLayout from "@/features/auth/components/AuthLayout";
import LoginFooter from "@/features/auth/components/LoginFooter";

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginCredentials>({ email: "", password: "" });
  const { error, loading, login } = useLogin();

  return (
    <AuthLayout title="Bienvenido de nuevo" subtitle="Ingresa a tu cuenta">
      {/* Alerta de Error */}
      {error && <ErrorMessage error={error} />}

      {/* Formulario */}
      <form className="space-y-6" onSubmit={e => { e.preventDefault(); login(formData) }}>
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

      <LoginFooter />
    </AuthLayout>
  );
}