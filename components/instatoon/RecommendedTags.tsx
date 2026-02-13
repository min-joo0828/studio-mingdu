import Link from "next/link";
import { supabase } from "@/lib/supabase";

type TagCount = {
    tag: string;
    count: number;
};

export default async function RecommendedTags() {
    const { data: toons } = await supabase
        .from("instagram_toons")
        .select("tags")
        .eq("is_published", true);

    if (!toons) return null;

    // 태그 집계
    const counter = new Map<string, number>();

    toons.forEach((toon) => {
        (toon.tags || []).forEach((tag: string) => {
            counter.set(tag, (counter.get(tag) || 0) + 1);
        });
    });

    const tags: TagCount[] = Array.from(counter.entries())
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 8); // 상위 8개만 노출

    if (tags.length === 0) return null;

    return (
        <section className="mt-12">
            <h2 className="mb-4 text-lg font-semibold text-stone-800">
                이런 이야기는 어때요?
            </h2>

            <ul className="flex flex-wrap gap-3">
                {tags.map(({ tag, count }) => (
                    <li key={tag}>
                        <Link
                            href={`/instatoons/tag/${encodeURIComponent(tag)}`}
                            className="
                inline-flex items-center gap-1
                rounded-full bg-stone-100 px-4 py-2
                text-sm text-stone-700
                hover:bg-stone-200
                transition
              "
                        >
                            #{tag}
                            <span className="text-xs text-stone-400">
                                {count}
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
}
