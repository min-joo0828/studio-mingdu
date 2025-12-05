export const dynamic = "force-dynamic";

export default async function ArticlesPage() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/rss`, {
        cache: "no-store",
    });

    const data = await response.json();
    const articles = data.articles ?? [];

    return (
        <main className="px-8 py-12">
            <h1 className="text-3xl font-bold text-[#3E3632] mb-8">Articles</h1>

            {articles.length === 0 && (
                <p className="text-[#6A5F58]">브런치 글을 불러올 수 없어요 😢</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {articles.map((article: any, index: number) => (
                    <a
                        key={index}
                        href={article.link}
                        target="_blank"
                        className="bg-white rounded-2xl shadow-sm border border-[#F2E9E3] overflow-hidden hover:shadow-lg transition-shadow"
                    >
                        <div className="relative w-full aspect-[3/2] bg-[#F5EFE9] overflow-hidden">
                            {article.thumbnail ? (
                                <img
                                    src={article.thumbnail}
                                    alt={article.title}
                                    className="object-cover w-full h-full"
                                />
                            ) : (
                                <div className="flex items-center justify-center w-full h-full text-[#A38C7B]">
                                    No Image
                                </div>
                            )}
                        </div>

                        <div className="p-6">
                            <h2 className="text-lg font-semibold text-[#3E3632] leading-snug line-clamp-2">
                                {article.title}
                            </h2>

                            <p className="mt-2 text-[#6A5F58] text-sm line-clamp-3 leading-relaxed">
                                {article.description}
                            </p>

                            <p className="mt-3 text-[#A38C7B] text-xs tracking-wide">{article.date}</p>
                        </div>
                    </a>
                ))}
            </div>
        </main>
    );
}
