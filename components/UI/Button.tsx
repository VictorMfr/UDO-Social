import React from "react";

type ButtonIntent = "primary" | "secondary" | "danger" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  intent?: ButtonIntent;
  size?: ButtonSize;
  isLoading?: boolean;
}

const intentClasses: Record<ButtonIntent, string> = {
  primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm border-transparent",
  secondary: "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 shadow-sm",
  danger: "bg-red-500 text-white hover:bg-red-600 shadow-sm border-transparent",
  ghost: "bg-transparent text-gray-600 hover:bg-gray-100 border-transparent",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export default function Button({
  children,
  intent = "primary",
  size = "md",
  isLoading = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center font-semibold rounded-lg border transition-all duration-200
        active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${intentClasses[intent]}
        ${sizeClasses[size]}
        ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          {/* Spinner simple con CSS puro */}
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Cargando...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}