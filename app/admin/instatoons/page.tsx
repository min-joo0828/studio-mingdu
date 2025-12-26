"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

type Instatoon = {
    id: string;
    title: string;
    image_urls: string[];
    tags: string[];
    is_published: boolean;
    created_at: string;
};

function getStoragePathFromUrl(url: string) {
    const marker = "/storage/v1/object/public/studio-mingdu/";
    const index = url.indexOf(marker);
    if (index === -1) return null;
    return url.substring(index + marker.length);
}

export default function AdminInstatoonsPage() {
    const [items, setItems] = useState<Instatoon[]>([]);
    const [loading, setLoading] = useState(true);

    /* 목록 조회 */
    const fetchInstatoons = async () => {
        setLoading(true);

        const { data, error } = await supabase
            .from("instagram_toons")
            .select(
                "id, title, image_urls, tags, is_published, created_at"
            )
            .order("created_at", { ascending: false });

        if (error) {
            alert("목록 조회 실패");
            console.error(error);
        } else {
            setItems(data || []);
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchInstatoons();
    }, []);

    /* 공개 / 비공개 토글 */
    const togglePublish = async (item: Instatoon) => {
        const next = !item.is_published;

        // UI 즉시 반영
        setItems((prev) =>
            prev.map((it) =>
                it.id === item.id
                    ? { ...it, is_published: next }
                    : it
            )
        );

        const { error } = await supabase
            .from("instagram_toons")
            .update({
                is_published: next,
                published_at: next ? new Date().toISOString() : null,
            })
            .eq("id", item.id);

        if (error) {
            alert("공개 상태 변경 실패");
            console.error(error);
            fetchInstatoons(); // 롤백
        }
    };

    /* 삭제 */
    const deleteInstatoon = async (id: string) => {
        if (!confirm("정말 삭제할까요?\n(이미지도 함께 삭제됩니다)")) {
            return;
        }

        try {
            // 1️⃣ 해당 instatoon의 image_urls 조회
            const { data, error: fetchError } = await supabase
                .from("instagram_toons")
                .select("image_urls")
                .eq("id", id)
                .single();

            if (fetchError || !data) {
                throw fetchError;
            }

            const imageUrls: string[] = data.image_urls || [];

            // 2️⃣ Storage 이미지 삭제
            const paths = imageUrls
                .map(getStoragePathFromUrl)
                .filter(Boolean) as string[];

            if (paths.length > 0) {
                const { error: storageError } = await supabase.storage
                    .from("studio-mingdu")
                    .remove(paths);

                if (storageError) {
                    throw storageError;
                }
            }

            // 3️⃣ DB row 삭제
            const { error: dbError } = await supabase
                .from("instagram_toons")
                .delete()
                .eq("id", id);

            if (dbError) {
                throw dbError;
            }

            // 4️⃣ UI 반영
            setItems((prev) => prev.filter((it) => it.id !== id));
        } catch (err) {
            alert("삭제 중 오류가 발생했습니다.");
            console.error(err);
        }
    };


    return (
        <main className="mx-auto max-w-5xl px-6 py-10">
            <div className="mb-8 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-[#3E3632]">
                    Instatoon 관리
                </h1>

                <Link
                    href="/admin/instatoons/new"
                    className="rounded-lg bg-[#3E3632] px-4 py-2 text-sm text-white hover:opacity-90"
                >
                    + 새 인스타툰
                </Link>
            </div>

            {loading ? (
                <p className="text-sm text-black/50">불러오는 중…</p>
            ) : items.length === 0 ? (
                <div className="rounded-xl border border-dashed p-10 text-center text-sm text-black/40">
                    아직 등록된 인스타툰이 없습니다.
                </div>
            ) : (
                <ul className="space-y-4">
                    {items.map((item) => (
                        <li
                            key={item.id}
                            className="flex items-center gap-4 rounded-xl border bg-white p-4 shadow-sm"
                        >
                            {/* 썸네일 */}
                            <div className="h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-black/5">
                                {item.image_urls?.[0] ? (
                                    <img
                                        src={item.image_urls[0]}
                                        alt={item.title}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-xs text-black/40">
                                        No Image
                                    </div>
                                )}
                            </div>

                            {/* 정보 */}
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <h2 className="font-medium">
                                        {item.title}
                                    </h2>

                                    {item.is_published ? (
                                        <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-700">
                                            공개
                                        </span>
                                    ) : (
                                        <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                                            비공개
                                        </span>
                                    )}
                                </div>

                                {item.tags?.length > 0 && (
                                    <div className="mt-1 flex flex-wrap gap-1">
                                        {item.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="rounded bg-black/5 px-2 py-0.5 text-xs text-black/60"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* 액션 */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => togglePublish(item)}
                                    className="rounded border px-3 py-1 text-xs hover:bg-black/5"
                                >
                                    {item.is_published ? "비공개" : "공개"}
                                </button>

                                <Link
                                    href={`/admin/instatoons/${item.id}/edit`}
                                    className="rounded border px-3 py-1 text-xs hover:bg-black/5"
                                >
                                    수정
                                </Link>

                                <button
                                    onClick={() => deleteInstatoon(item.id)}
                                    className="rounded border border-red-300 px-3 py-1 text-xs text-red-600 hover:bg-red-50"
                                >
                                    삭제
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </main>
    );
}
