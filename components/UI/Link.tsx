import NextLink, { LinkProps as NextLinkProps } from 'next/link';

type LinkSize = "sm" | "md" | "lg" | "none";
type LinkVariant = "outline" | "ghost" | "solid";

interface CustomLinkProps extends NextLinkProps {
  children: React.ReactNode;
  size?: LinkSize;
  variant?: LinkVariant;
  rounded?: boolean; // Controlar si es muy redondeado o estándar
  className?: string; // Para ajustes extra de diseño
}

const sizeClasses: Record<LinkSize, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
  none: "", // Sin padding, para usar dentro de párrafos
};

const variantClasses: Record<LinkVariant, string> = {
  outline: "text-gray-600 border border-white hover:bg-gray-50",
  ghost: "bg-transparent text-gray-500 hover:text-blue-600 hover:bg-blue-50 border-transparent",
  solid: "bg-blue-600 text-white hover:bg-blue-700 border-transparent",
};

export default function Link({
  href,
  children,
  size = "md",
  variant = "outline",
  rounded = true,
  className = "",
  ...props
}: CustomLinkProps) {
  return (
    <NextLink
      href={href}
      className={`
        inline-flex items-center justify-center font-semibold transition-all duration-200
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${rounded ? "rounded-lg" : "rounded-none"}
        ${className}
      `}
      {...props}
    >
      {children}
    </NextLink>
  );
}