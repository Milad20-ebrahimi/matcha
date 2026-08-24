import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({
  label,
  error,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium text-slate-900">
          {label}
        </label>
      )}

      <input
        className={`
          w-full
          rounded-xl
          border
          px-4
          py-3
          text-sm
          outline-none
          transition
          placeholder:text-slate-400
          focus:border-yellow-400
          ${error ? "border-red-500" : "border-slate-200"}
          ${className}
        `}
        {...props}
      />

      {error && (
        <span className="text-xs text-red-500">
          {error}
        </span>
      )}
    </div>
  );
}
