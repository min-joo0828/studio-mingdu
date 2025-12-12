// components/common/Section.tsx
import { ReactNode } from "react";

interface SectionProps {
    title?: string;
    description?: string;
    children?: ReactNode;
    className?: string;
    innerClassName?: string;
}

export default function Section({
    title,
    description,
    children,
    className = "",
    innerClassName = "",
}: SectionProps) {
    return (
        <section className={`py-12 sm:py-16 ${className}`}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                {title && (
                    <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-4">
                        {title}
                    </h2>
                )}
                {description && (
                    <p className="text-muted text-lg leading-relaxed mb-8">
                        {description}
                    </p>
                )}

                <div className={innerClassName}>{children}</div>
            </div>
        </section>
    );
}
