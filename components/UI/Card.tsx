import React from "react";

type CardVariant = "flat" | "elevated" | "glass" | "outline";
type CardPadding = "none" | "sm" | "md" | "lg";

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  padding?: CardPadding;
  className?: string;
  onClick?: () => void; // Por si la tarjeta debe ser clickeable
}

const variantClasses: Record<CardVariant, string> = {
  flat: "bg-white border border-gray-100",
  elevated: "bg-white border border-gray-100 shadow-xl shadow-gray-200/50",
  glass: "bg-white/70 backdrop-blur-md border border-white/20",
  outline: "bg-gray-50/50 border-2 border-gray-200 border-dashed",
};

const paddingClasses: Record<CardPadding, string> = {
  none: "p-0",
  sm: "p-3",
  md: "p-5",
  lg: "p-8",
};

export default function Card({
  children,
  variant = "elevated",
  padding = "md",
  className = "",
  onClick,
}: CardProps) {
  const isClickable = !!onClick;

  return (
    <div
      onClick={onClick}
      className={`
        rounded-2xl transition-all duration-200
        ${variantClasses[variant]}
        ${paddingClasses[padding]}
        ${isClickable ? "cursor-pointer hover:scale-[1.01] active:scale-95" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}