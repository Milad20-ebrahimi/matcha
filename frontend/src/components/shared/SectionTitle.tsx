import type { ReactNode } from "react";

interface SectionTitleProps {
  title: string;
  description?: ReactNode;
}

export default function SectionTitle({
  title,
  description,
}: SectionTitleProps) {
  return (
    <div className="mb-10 text-center">
      <h2 className="text-3xl font-bold text-slate-900">
        {title}
      </h2>

      {description && (
        <p className="mt-3 text-sm text-slate-500">
          {description}
        </p>
      )}
    </div>
  );
}
