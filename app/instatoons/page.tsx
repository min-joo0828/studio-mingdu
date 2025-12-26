import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default async function InstatoonsPage() {
    const { data: toons, error } = await supabase
        .from("instagram_toons")
        .select("id, title, image_urls, description, published_at")
        .order("published_at", { ascending: false });

    if (error) {
        return <p>인스타툰을 불러오지 못했어요.</p>;
    }

    return (
        <main className="px-4 py-8 sm:px-8 sm:py-12 max-w-5xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-bold mb-8">
                Instatoons
            </h1>

            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {toons?.map((toon) => (
                    <li
                        key={toon.id}
                        className="rounded-2xl bg-white overflow-hidden ring-1 ring-black/5 hover:shadow-lg transition"
                    >
                        <Link href={`/instatoons/${toon.id}`}>
                            {toon.image_urls?.[0] && (
                                <img
                                    src={toon.image_urls[0]}
                                    alt={toon.title}
                                    className="w-full aspect-[4/5] object-cover"
                                />
                            )}

                            <div className="p-4">
                                <h2 className="font-semibold text-base mb-1">
                                    {toon.title}
                                </h2>

                                {toon.description && (
                                    <p className="text-sm text-gray-600 line-clamp-2">
                                        {toon.description}
                                    </p>
                                )}
                            </div>
                        </Link>
                    </li>

                ))}
            </ul>
        </main>
    );
}
