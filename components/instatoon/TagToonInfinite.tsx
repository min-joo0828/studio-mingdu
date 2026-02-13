"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import InstatoonCardSkeleton from "@/components/instatoon/InstatoonCardSkeleton";

type Toon = {
    id: string;
    title: string;
    image_urls: string[];
    published_at: string | null;
};

type Props = {
    tag: string;
    initialToons: Toon[];
    pageSize: number;
};

export default function TagToonInfinite({
    tag,
    initialToons,
    pageSize,
}: Props) {
    const [toons, setToons] = useState<Toon[]>(initialToons);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const sentinelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!sentinelRef.current || !hasMore) return;

        const observer = new IntersectionObserver(
            async ([entry]) => {
                if (!entry.isIntersecting || loading) return;

                setLoading(true);

                const from = page * pageSize;
                const to = from + pageSize - 1;

                const { data, error } = await supabase
                    .from("instagram_toons")
                    .select("id, title, image_urls, published_at")
                    .contains("tags", [tag])
                    .eq("is_published", true)
                    .order("published_at", { ascending: false })
                    .range(from, to);

                if (!error && data && data.length > 0) {
                    setToons((prev) => [...prev, ...data]);
                    setPage((p) => p + 1);

                    if (data.length < pageSize) {
                        setHasMore(false);
                    }
                } else {
                    setHasMore(false);
                }

                setLoading(false);
            },
            { rootMargin: "200px" }
        );

        observer.observe(sentinelRef.current);

        return () => observer.disconnect();
    }, [page, pageSize, tag, loading, hasMore]);

    return (
        <>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {toons.map((toon) => (
                    <li key={toon.id}>
                        <Link href={`/instatoons/${toon.id}`} className="group block">
                            <div className="relative overflow-hidden rounded-xl">
                                {/* 이미지 */}
                                <img
                                    src={toon.image_urls[0]}
                                    alt={toon.title}
                                    className="
                    aspect-[4/5] w-full object-cover
                    transition-transform duration-300
                    group-hover:scale-105
                  "
                                />

                                {/* 오버레이 */}
                                <div
                                    className="
                    pointer-events-none
                    absolute inset-0
                    bg-gradient-to-t
                    from-black/50 via-black/10 to-transparent
                    opacity-0
                    transition-opacity duration-300
                    group-hover:opacity-100
                  "
                                />

                                {/* 제목 */}
                                <p
                                    className="
                    pointer-events-none
                    absolute bottom-2 left-2 right-2
                    text-sm font-medium text-white
                    opacity-0
                    transition-all duration-300
                    translate-y-2
                    group-hover:opacity-100
                    group-hover:translate-y-0
                  "
                                >
                                    {toon.title}
                                </p>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>

            {loading && (
                <ul className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                    {Array.from({ length: pageSize }).map((_, i) => (
                        <li key={i}>
                            <InstatoonCardSkeleton />
                        </li>
                    ))}
                </ul>
            )}

            {/* Sentinel */}
            {hasMore && (
                <div ref={sentinelRef} className="py-10 text-center text-sm text-stone-400">
                    {loading && "불러오는 중…"}
                </div>
            )}
        </>
    );
}
