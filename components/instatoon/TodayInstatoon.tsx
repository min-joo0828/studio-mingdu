import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function TodayInstatoon() {
    const { data: toons } = await supabase
        .from("instagram_toons")
        .select("id, title, image_urls, today_comment")
        .eq("is_published", true)
        .order("published_at", { ascending: false })
        .limit(7);

    if (!toons || toons.length === 0) return null;

    // 최근 7개 중 랜덤 1개
    const pick = toons[Math.floor(Math.random() * toons.length)];

    return (
        <section className="mt-12">
            <h2 className="mb-4 text-lg font-semibold text-stone-800">
                오늘의 Instatoon
            </h2>

            <Link
                href={`/instatoons/${pick.id}`}
                className="group block max-w-md"
            >
                <div className="overflow-hidden rounded-2xl">
                    <img
                        src={pick.image_urls[0]}
                        alt={pick.title}
                        className="
                            aspect-[4/5] w-full object-cover
                            transition-transform duration-300
                            group-hover:scale-105
                        "
                    />
                </div>

                {/* 제목 */}
                <p className="mt-3 text-base font-medium text-stone-700 group-hover:underline">
                    {pick.title}
                </p>

                {/* 한 줄 코멘트 */}
                <p className="mt-1 text-sm text-stone-500 leading-relaxed">
                    {pick.today_comment?.trim()
                        ? pick.today_comment
                        : "오늘은 이 기록이 조금 마음에 남았어요."}
                </p>
            </Link>
        </section>
    );
}
