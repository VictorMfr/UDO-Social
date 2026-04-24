import React, { forwardRef } from "react";
import Text from "./Text";

type InputSize = "sm" | "md" | "lg";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  sizeVariant?: InputSize; // Cambiado a sizeVariant para no chocar con el atributo 'size' nativo de HTML
  className?: string;
}

const sizeClasses: Record<InputSize, string> = {
  sm: "px-3 py-1.5 text-xs",      // Para buscadores o barras laterales
  md: "px-4 py-2.5 text-sm",     // El estándar para formularios
  lg: "px-4 py-3.5 text-base",   // Para el Login o registros importantes
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, sizeVariant = "md", className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-sm font-semibold text-gray-700 ml-1">
            {label}
          </label>
        )}

        <input
          ref={ref}
          className={`
            w-full bg-gray-50 border rounded-lg transition-all
            placeholder:text-gray-400 outline-none
            focus:ring-2 focus:ring-blue-500/20 focus:bg-white
            ${sizeClasses[sizeVariant]} 
            ${error 
              ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" 
              : "border-gray-200 focus:border-blue-500"
            }
            ${className}
          `}
          {...props}
        />

        {error && (
          <Text variant="xs" className="text-red-500 ml-1 font-medium">
            {error}
          </Text>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;