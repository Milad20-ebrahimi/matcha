import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export default function Card({
  children,
  className = "",
  ...props
}: CardProps) {
  return (
    <div
      className={`
        rounded-2xl
        border
        border-slate-100
        bg-white
        p-6
        shadow-sm
        transition
        duration-300
        hover:shadow-md
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
