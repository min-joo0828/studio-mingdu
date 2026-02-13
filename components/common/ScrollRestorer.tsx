"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const SCROLL_KEY_PREFIX = "scroll-pos:";

export default function ScrollRestorer() {
    const pathname = usePathname();

    useEffect(() => {
        const key = SCROLL_KEY_PREFIX + pathname;

        // 🔹 복원
        const savedY = sessionStorage.getItem(key);
        if (savedY) {
            window.scrollTo(0, Number(savedY));
        }

        // 🔹 저장
        const saveScroll = () => {
            sessionStorage.setItem(key, String(window.scrollY));
        };

        window.addEventListener("beforeunload", saveScroll);
        window.addEventListener("pagehide", saveScroll);

        return () => {
            saveScroll();
            window.removeEventListener("beforeunload", saveScroll);
            window.removeEventListener("pagehide", saveScroll);
        };
    }, [pathname]);

    return null;
}
