import React from "react";

type TextVariant = "xs" | "sm" | "base" | "lg" | "xl";
type TextWeight = "normal" | "medium" | "semibold" | "bold";

interface TextProps {
  children: React.ReactNode;
  variant?: TextVariant;
  weight?: TextWeight;
  className?: string;
}

const variantClasses: Record<TextVariant, string> = {
  xs: "text-xs leading-4",
  sm: "text-sm leading-5",
  base: "text-base leading-6",
  lg: "text-lg leading-7",
  xl: "text-xl leading-8",
};

const weightClasses: Record<TextWeight, string> = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
};

export default function Text({
  children,
  variant = "base",
  weight = "normal",
  className = "",
}: TextProps) {
  return (
    <p className={`${variantClasses[variant]} ${weightClasses[weight]} text-gray-700 ${className}`}>
      {children}
    </p>
  );
}