export const dynamic = "force-dynamic";

export default async function ArticlesPage() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/rss`, {
        next: { revalidate: 3600 },
        cache: "no-store",
    });

    const data = await response.json();
    const articles = data.articles ?? [];

    return (
        <main className="px-4 py-8 sm:px-6 sm:py-12">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#3E3632] mb-6 sm:mb-8">
                    Articles
                </h1>

                {articles.length === 0 && (
                    <p className="text-[#6A5F58]">브런치 글을 불러올 수 없어요 😢</p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-10">
                    {articles.map((article: any, index: number) => (
                        <a
                            key={index}
                            href={article.link}
                            target="_blank"
                            className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
                        >
                            <div className="w-full h-48 bg-[#F5EFE9] overflow-hidden">
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

                            <div className="p-5 sm:p-6">
                                <h2 className="text-lg sm:text-xl font-semibold text-[#3E3632] line-clamp-2">
                                    {article.title}
                                </h2>

                                <p className="mt-2 sm:mt-3 text-[#6A5F58] text-sm leading-relaxed line-clamp-3">
                                    {article.description}
                                </p>

                                <p className="mt-3 sm:mt-4 text-[#A38C7B] text-xs">{article.date}</p>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </main>
    );
}
