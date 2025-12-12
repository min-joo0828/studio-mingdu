// components/common/Card.tsx
import { ReactNode } from "react";

interface CardProps {
    children: ReactNode;
    className?: string;
}

export default function Card({ children, className }: CardProps) {
    const baseClass =
        "bg-white shadow-soft rounded-lg p-6 border border-secondary/40 transition hover:shadow-lg hover:-translate-y-1";

    return (
        <div className={className ? `${baseClass} ${className}` : baseClass}>
            {children}
        </div>
    );
}
