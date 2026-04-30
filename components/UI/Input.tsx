import React, { ComponentType, forwardRef } from "react";
import Text from "./Text";

type InputSize = "sm" | "md" | "lg";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  sizeVariant?: InputSize;
  className?: string;
  LeftIcon?: ComponentType<{ className?: string }>; // Tipado para recibir clases de Tailwind
  RightIcon?: ComponentType<{ className?: string }>;
}

const sizeClasses: Record<InputSize, string> = {
  sm: "py-1.5 text-xs",
  md: "py-2.5 text-sm",
  lg: "py-3.5 text-base",
};

// Controlamos el padding lateral según si hay iconos o no
const getPaddingClasses = (size: InputSize, hasLeft: boolean, hasRight: boolean) => {
  const paddings = {
    sm: { left: hasLeft ? "pl-9" : "pl-3", right: hasRight ? "pr-9" : "pr-3" },
    md: { left: hasLeft ? "pl-11" : "pl-4", right: hasRight ? "pr-11" : "pr-4" },
    lg: { left: hasLeft ? "pl-12" : "pl-4", right: hasRight ? "pr-12" : "pr-4" },
  };
  return `${paddings[size].left} ${paddings[size].right}`;
};

const Input = forwardRef<HTMLInputElement, InputProps>(({ 
  label, 
  error, 
  sizeVariant = "md", 
  className = "",
  LeftIcon,
  RightIcon,
  ...props 
}, ref) => {
    const hasLeftIcon = !!LeftIcon;
    const hasRightIcon = !!RightIcon;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-sm font-semibold text-gray-700 ml-1">
            {label}
          </label>
        )}

        {/* Contenedor relativo para posicionar los iconos */}
        <div className="relative flex items-center">
          
          {/* Icono Izquierdo */}
          {LeftIcon && (
            <div className="absolute left-3 text-gray-400 pointer-events-none">
              <LeftIcon className={`${sizeVariant === 'sm' ? 'w-4 h-4' : 'w-5 h-5'}`} />
            </div>
          )}

          <input
            ref={ref}
            className={`
              w-full bg-gray-50 border rounded-lg transition-all
              placeholder:text-gray-400 outline-none
              focus:ring-2 focus:ring-blue-500/20 focus:bg-white
              ${sizeClasses[sizeVariant]} 
              ${getPaddingClasses(sizeVariant, hasLeftIcon, hasRightIcon)}
              ${error 
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" 
                : "border-gray-200 focus:border-blue-500"
              }
              ${className}
            `}
            {...props}
          />

          {/* Icono Derecho */}
          {RightIcon && (
            <div className="absolute right-3 text-gray-400 pointer-events-none">
              <RightIcon className={`${sizeVariant === 'sm' ? 'w-4 h-4' : 'w-5 h-5'}`} />
            </div>
          )}
        </div>

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