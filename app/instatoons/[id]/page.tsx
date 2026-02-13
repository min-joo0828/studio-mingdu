import type { Metadata } from "next";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import InstatoonCarousel from "@/components/instatoon/InstatoonCarousel";

type Props = {
    params: Promise<{ id: string }>;
};

/* ==================================================
   SEO / OG Metadata
================================================== */
export async function generateMetadata(
    { params }: Props
): Promise<Metadata> {
    const { id } = await params;

    const { data: toon } = await supabase
        .from("instagram_toons")
        .select("title, description, image_urls")
        .eq("id", id)
        .eq("is_published", true)
        .single();

    if (!toon) {
        return {
            title: "인스타툰을 찾을 수 없어요",
        };
    }

    const ogImage = toon.image_urls?.[0];

    return {
        title: toon.title,
        description:
            toon.description?.slice(0, 120) ??
            "Studio Mingdu의 인스타툰 작품입니다.",
        openGraph: {
            title: toon.title,
            description:
                toon.description?.slice(0, 120) ??
                "Studio Mingdu의 인스타툰 작품",
            type: "article",
            images: ogImage
                ? [
                    {
                        url: ogImage,
                        width: 800,
                        height: 1000,
                        alt: toon.title,
                    },
                ]
                : [],
        },
    };
}

/* ==================================================
   Page
================================================== */
export default async function InstatoonDetailPage({ params }: Props) {
    const { id } = await params;

    // 1️⃣ 현재 인스타툰
    const { data: toon, error } = await supabase
        .from("instagram_toons")
        .select("*")
        .eq("id", id)
        .eq("is_published", true)
        .single();

    if (error || !toon) {
        return <p className="p-8">인스타툰을 찾을 수 없어요.</p>;
    }

    // 기준 시각 (published_at 없으면 created_at fallback)
    const pivot = toon.published_at ?? toon.created_at;

    // 2️⃣ 이전 / 다음 인스타툰
    const [{ data: prev }, { data: next }] = await Promise.all([
        // 이전 (더 최근)
        supabase
            .from("instagram_toons")
            .select("id, title, image_urls")
            .eq("is_published", true)
            .gt("published_at", pivot)
            .order("published_at", { ascending: true })
            .limit(1),

        // 다음 (더 과거)
        supabase
            .from("instagram_toons")
            .select("id, title, image_urls")
            .eq("is_published", true)
            .lt("published_at", pivot)
            .order("published_at", { ascending: false })
            .limit(1),
    ]);

    // 3️⃣ 비슷한 인스타툰 (같은 tag 우선)
    let relatedToons: any[] = [];

    if (toon.tags?.length > 0) {
        const { data: relatedByTag } = await supabase
            .from("instagram_toons")
            .select("id, title, image_urls, tags")
            .eq("is_published", true)
            .neq("id", toon.id)
            .overlaps("tags", toon.tags)
            .order("published_at", { ascending: false })
            .limit(3);

        relatedToons = relatedByTag ?? [];
    }

    // 부족하면 최신 인스타툰으로 채우기
    const relatedIds = relatedToons.map((t) => t.id);
    if (relatedToons.length < 3) {
        const { data: fallback } = await supabase
            .from("instagram_toons")
            .select("id, title, image_urls, tags")
            .eq("is_published", true)
            .not("id", "in", `(${relatedIds.join(",")})`)
            .neq("id", toon.id)
            .order("published_at", { ascending: false })
            .limit(3 - relatedToons.length);

        relatedToons = [...relatedToons, ...(fallback ?? [])];
    }

    const prevToon = prev?.[0];
    const nextToon = next?.[0];

    return (
        <main className="px-4 py-8 sm:px-8 sm:py-12 max-w-3xl mx-auto">
            {/* 제목 */}
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                {toon.title}
            </h1>

            {/* 날짜 */}
            {toon.published_at && (
                <p className="text-sm text-gray-400 mb-6">
                    {new Date(toon.published_at).toLocaleDateString()}
                </p>
            )}

            {/* 캐러셀 */}
            <InstatoonCarousel images={toon.image_urls} title={toon.title} />

            {/* 설명 */}
            {toon.description && (
                <p className="mt-8 text-base leading-relaxed text-gray-700">
                    {toon.description}
                </p>
            )}

            {/* 음악 */}
            {toon.music && (
                <div className="mt-6 rounded-xl bg-stone-50 p-4 text-sm text-gray-600">
                    🎵 {toon.music}
                </div>
            )}

            {/* 태그 */}
            {toon.tags?.length > 0 && (
                <ul className="mt-6 flex flex-wrap gap-2">
                    {toon.tags.map((tag: string) => (
                        <li key={tag}>
                            <Link
                                href={`/instatoons/tag/${encodeURIComponent(tag)}`}
                                className="text-xs rounded-full bg-stone-100 px-3 py-1 text-stone-600 hover:bg-stone-200"
                            >
                                #{tag}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}

            {/* 브런치 글로 더 읽기 */}
            {toon.related_article_url && (
                <div className="mt-6 rounded-xl bg-stone-50 p-4">
                    <p className="text-sm text-stone-700">
                        ✍️ 이 이야기를 글로 더 풀어봤어요
                    </p>
                    <a
                        href={toon.related_article_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block text-sm text-stone-600 underline underline-offset-4 hover:text-stone-800"
                    >
                        브런치에서 읽기 →
                    </a>
                </div>
            )}

            {/* 인스타 원본 링크 */}
            {toon.instagram_url && (
                <div className="mt-6">
                    <a
                        href={toon.instagram_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block text-sm text-stone-600 underline underline-offset-4 hover:text-stone-800"
                    >
                        인스타에서 원본 보기 →
                    </a>
                </div>
            )}

            {/* 이전 / 다음 네비게이션 */}
            <nav className="mt-10 grid grid-cols-2 gap-4">
                {prevToon ? (
                    <Link
                        href={`/instatoons/${prevToon.id}`}
                        className="group flex items-center gap-3 rounded-xl border p-3 hover:bg-stone-50"
                    >
                        <span className="text-sm text-stone-400">← 이전</span>
                        <img
                            src={prevToon.image_urls[0]}
                            alt={prevToon.title}
                            className="h-16 w-12 rounded object-cover"
                        />
                        <span className="text-sm font-medium text-stone-700 line-clamp-2">
                            {prevToon.title}
                        </span>
                    </Link>
                ) : (
                    <div />
                )}

                {nextToon ? (
                    <Link
                        href={`/instatoons/${nextToon.id}`}
                        className="group flex items-center justify-end gap-3 rounded-xl border p-3 hover:bg-stone-50"
                    >
                        <span className="text-sm font-medium text-stone-700 line-clamp-2 text-right">
                            {nextToon.title}
                        </span>
                        <img
                            src={nextToon.image_urls[0]}
                            alt={nextToon.title}
                            className="h-16 w-12 rounded object-cover"
                        />
                        <span className="text-sm text-stone-400">다음 →</span>
                    </Link>
                ) : (
                    <div />
                )}
            </nav>

            {/* 비슷한 이야기 */}
            {relatedToons.length > 0 && (
                <section className="mt-14">
                    <h2 className="mb-4 text-lg font-semibold text-stone-700">
                        이 인스타툰과 비슷한 이야기
                    </h2>

                    <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {relatedToons.map((item) => (
                            <li key={item.id}>
                                <Link
                                    href={`/instatoons/${item.id}`}
                                    className="block rounded-xl border overflow-hidden hover:bg-stone-50 transition"
                                >
                                    <img
                                        src={item.image_urls[0]}
                                        alt={item.title}
                                        className="aspect-[4/5] w-full object-cover"
                                    />
                                    <div className="p-3">
                                        <p className="text-sm font-medium text-stone-700 line-clamp-2">
                                            {item.title}
                                        </p>

                                        {item.tags?.length > 0 && (
                                            <p className="mt-1 text-xs text-stone-400">
                                                #{item.tags[0]}
                                            </p>
                                        )}
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </main>
    );
}
