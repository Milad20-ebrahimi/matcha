import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  isLoading?: boolean;
}


const variants = {
  primary:
    "bg-yellow-400 text-slate-900 hover:bg-yellow-300",

  secondary:
    "bg-slate-900 text-white hover:bg-slate-800",

  outline:
    "border border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white",
};


export default function Button({
  children,
  variant = "primary",
  isLoading = false,
  disabled,
  className = "",
  ...props
}: ButtonProps) {

  return (
    <button
      disabled={disabled || isLoading}
      className={`
        inline-flex
        items-center
        justify-center
        rounded-full
        px-6
        py-3
        text-sm
        font-medium
        transition
        duration-300
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {isLoading ? "در حال پردازش..." : children}
    </button>
  );
}
