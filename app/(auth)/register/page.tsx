"use client";

import { useState } from "react";
import { useRegister } from "@/features/auth/hooks/useRegister";
import AuthLayout from "@/features/auth/components/AuthLayout";
import ErrorMessage from "@/features/auth/components/ErrorMessage";
import RegisterFooter from "@/features/auth/components/RegisterFooter";
import Input from "@/components/UI/Input";
import Button from "@/components/UI/Button";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const { error, loading, register } = useRegister();

  return (
    <AuthLayout title="Crea tu cuenta" subtitle="Únete a la red de Ingeniería de Sistemas UDO">

      {error && <ErrorMessage error={error} />}

      <form className="mt-8 space-y-5" onSubmit={e => { e.preventDefault(); register(formData) }}>
        <div className="space-y-4">
          <Input
            label="Usuario"
            required
            placeholder="nombreDeUsuario"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />


          <Input
            label="Correo"
            type="email"
            required
            placeholder="correo@ejemplo.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />

          {/* Grid para que en PC se vean uno al lado del otro */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <Input
              label="Contraseña"
              type="password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />

            <Input
              label="Confirmar contraseña"
              type="password"
              required
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          isLoading={loading}
          size="lg"
        >
          {loading ? "Validando datos..." : "Registrarse"}
        </Button>
      </form>

      <RegisterFooter />
    </AuthLayout >
  );
}