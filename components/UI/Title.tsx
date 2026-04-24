import React from "react";

type TitleVariant = "h1" | "h2" | "h3" | "h4" | "h5";
type TitleWeight = "bold" | "extrabold" | "black";

interface TitleProps {
  children: React.ReactNode;
  variant?: TitleVariant;
  as?: TitleVariant; // Etiqueta HTML real
  weight?: TitleWeight;
  className?: string;
}

const variantClasses: Record<TitleVariant, string> = {
  h1: "text-4xl md:text-5xl tracking-tight leading-tight",
  h2: "text-3xl tracking-tight",
  h3: "text-2xl tracking-tight",
  h4: "text-xl",
  h5: "text-lg",
};

const weightClasses: Record<TitleWeight, string> = {
  bold: "font-bold",
  extrabold: "font-extrabold",
  black: "font-black",
};

export default function Title({
  children,
  variant = "h2",
  as: Component = variant, // Si no se pasa 'as', usa la variante como etiqueta
  weight = "bold",
  className = "",
}: TitleProps) {
  return (
    <Component
      className={`${variantClasses[variant]} ${weightClasses[weight]} text-gray-900 ${className}`}
    >
      {children}
    </Component>
  );
}