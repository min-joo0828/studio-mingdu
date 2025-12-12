// components/common/Container.tsx
import { ReactNode } from "react";

interface ContainerProps {
    children: ReactNode;
    className?: string;
}

export default function Container({ children, className }: ContainerProps) {
    const baseClass = "mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8";
    const mergedClass = className ? `${baseClass} ${className}` : baseClass;

    return <div className={mergedClass}>{children}</div>;
}
