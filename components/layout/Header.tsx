"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Header() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    const navItems = [
        { name: "Home", href: "/" },
        { name: "Articles", href: "/articles" },
        { name: "InstaToon", href: "/instatoons" },
        { name: "About", href: "/about" },
    ];

    const isActive = (href: string) => pathname === href;

    return (
        <header className="w-full border-b border-neutral-200 bg-white">
            <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                {/* 로고 */}
                <Link href="/" className="text-xl font-bold text-primary">
                    Studio Mingdu
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden sm:flex gap-6">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`text-sm font-medium transition-colors ${isActive(item.href)
                                ? "text-primary font-semibold"
                                : "text-muted hover:text-primary"
                                }`}
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>

                {/* Mobile Menu Button */}
                <button
                    className="sm:hidden text-primary"
                    onClick={() => setOpen(!open)}
                >
                    ☰
                </button>
            </div>

            {/* Mobile Nav */}
            {open && (
                <div className="sm:hidden bg-white border-t border-neutral-200 px-4 py-3 space-y-3">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`block text-sm font-medium ${isActive(item.href)
                                ? "text-primary font-semibold"
                                : "text-muted"
                                }`}
                            onClick={() => setOpen(false)}
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>
            )}
        </header>
    );
}
