import { supabase } from "@/lib/supabase";
import InstatoonCarousel from "@/components/instatoon/InstatoonCarousel";

type Props = {
    params: Promise<{ id: string }>;
};

export default async function InstatoonDetailPage({ params }: Props) {
    const { id } = await params;

    const { data: toon, error } = await supabase
        .from("instagram_toons")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !toon) {
        return <p className="p-8">인스타툰을 찾을 수 없어요.</p>;
    }
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

            {/* 컷 이미지들 */}
            <InstatoonCarousel
                images={toon.image_urls}
                title={toon.title}
            />

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
                        <li
                            key={tag}
                            className="text-xs rounded-full bg-stone-100 px-3 py-1 text-stone-600"
                        >
                            #{tag}
                        </li>
                    ))}
                </ul>
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
        </main>
    );
}
