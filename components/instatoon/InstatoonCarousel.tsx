"use client";

import { useRef, useState } from "react";

type Props = {
    images: string[];
    title: string;
};

export default function InstatoonCarousel({ images, title }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [active, setActive] = useState(0);
    const isProgrammaticScroll = useRef(false);

    const handleScroll = () => {
        if (isProgrammaticScroll.current) return;

        const el = containerRef.current;
        if (!el) return;

        const index = Math.round(el.scrollLeft / el.clientWidth);
        setActive(index);
    };

    const moveTo = (index: number) => {
        const el = containerRef.current;
        if (!el) return;

        isProgrammaticScroll.current = true;

        el.scrollTo({
            left: el.clientWidth * index,
            behavior: "smooth",
        });

        setActive(index);

        setTimeout(() => {
            isProgrammaticScroll.current = false;
        }, 300);
    };

    return (
        <div>
            {/* 이미지 영역 */}
            <div
                ref={containerRef}
                className="
          flex overflow-x-auto snap-x snap-mandatory
          scroll-smooth scrollbar-hide
        "
                onScroll={handleScroll}
            >
                {images.map((url, index) => (
                    <img
                        key={index}
                        src={url}
                        alt={`${title} - cut ${index + 1}`}
                        draggable={false}
                        className="
              snap-start
              shrink-0
              min-w-full
              rounded-2xl
              ring-1 ring-black/5
            "
                    />
                ))}
            </div>

            {/* 힌트 */}
            <p className="mt-2 text-center text-xs text-muted opacity-70">
                ← 좌우로 넘겨보세요 →
            </p>

            {/* dots */}
            <div className="mt-2 flex justify-center gap-2">
                {images.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => moveTo(i)}
                        className={`h-2 w-2 rounded-full transition ${i === active ? "bg-stone-700" : "bg-stone-300"
                            }`}
                        aria-label={`컷 ${i + 1}로 이동`}
                    />
                ))}
            </div>
        </div>
    );
}
