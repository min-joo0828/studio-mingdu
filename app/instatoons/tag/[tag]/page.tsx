import { supabase } from "@/lib/supabase";
import TagToonInfinite from "@/components/instatoon/TagToonInfinite";

type Props = {
    params: Promise<{ tag: string }>;
};

const PAGE_SIZE = 9;

const TAG_DESCRIPTIONS: Record<string, string> = {
    지침: "조금 지치고, 마음이 무거운 날의 기록들",
    성장: "그래도 오늘을 해냈다고 말해주고 싶은 날",
    육아: "아이와 함께였던 순간들을 모아봤어요",
};

export default async function InstatoonsByTagPage({ params }: Props) {
    const { tag } = await params;
    const decodedTag = decodeURIComponent(tag);

    const { data: initialToons, error } = await supabase
        .from("instagram_toons")
        .select("id, title, image_urls, published_at")
        .contains("tags", [decodedTag])
        .eq("is_published", true)
        .order("published_at", { ascending: false })
        .range(0, PAGE_SIZE - 1);

    if (error || !initialToons || initialToons.length === 0) {
        return (
            <main className="px-6 py-20 text-center text-sm text-stone-500">
                <p>
                    <span className="font-medium">#{decodedTag}</span> 태그의 인스타툰이 아직 없어요.
                </p>
            </main>
        );
    }

    // 2️⃣ 함께 많이 등장한 태그 (추천 태그)
    let relatedTags: string[] = [];

    if (initialToons.length > 0) {
        // 현재 태그로 묶인 인스타툰들의 id 목록
        const toonIds = initialToons.map((t) => t.id);

        // 해당 인스타툰들의 tags 전체 가져오기
        const { data: tagRows } = await supabase
            .from("instagram_toons")
            .select("tags")
            .in("id", toonIds)
            .eq("is_published", true);

        if (tagRows) {
            const tagCountMap: Record<string, number> = {};

            tagRows.forEach((row) => {
                row.tags?.forEach((t: string) => {
                    if (t !== decodedTag) {
                        tagCountMap[t] = (tagCountMap[t] || 0) + 1;
                    }
                });
            });

            relatedTags = Object.entries(tagCountMap)
                .sort((a, b) => b[1] - a[1]) // 많이 등장한 순
                .slice(0, 3)
                .map(([tag]) => tag);
        }
    }

    return (
        <main className="px-4 py-8 max-w-5xl mx-auto">
            {/* 헤더 */}
            <header className="mb-6">
                <h1 className="text-xl sm:text-2xl font-semibold text-stone-800">
                    #{decodedTag}
                </h1>

                {TAG_DESCRIPTIONS[decodedTag] && (
                    <p className="mt-1 text-sm text-stone-600">
                        {TAG_DESCRIPTIONS[decodedTag]}
                    </p>
                )}

                <p className="mt-1 text-xs text-stone-400">
                    최신순으로 보여드려요
                </p>
            </header>

            {/* 무한 스크롤 */}
            <TagToonInfinite
                tag={decodedTag}
                initialToons={initialToons}
                pageSize={PAGE_SIZE}
            />

            {/* 함께 보는 태그 */}
            {relatedTags.length > 0 && (
                <section className="mt-14">
                    <h2 className="mb-4 text-base font-semibold text-stone-700">
                        이 태그와 함께 많이 보는 이야기
                    </h2>

                    <ul className="flex flex-wrap gap-3">
                        {relatedTags.map((tag) => (
                            <li key={tag}>
                                <a
                                    href={`/instatoons/tag/${encodeURIComponent(tag)}`}
                                    className="inline-block rounded-full bg-stone-100 px-4 py-2 text-sm text-stone-600 hover:bg-stone-200 transition"
                                >
                                    #{tag}
                                </a>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </main>
    );
}
