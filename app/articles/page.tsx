export const dynamic = "force-dynamic";

import Section from "@/components/common/Section";
import Container from "@/components/common/Container";
import Card from "@/components/common/Card";

export default async function ArticlesPage() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/rss`, {
        next: { revalidate: 3600 },
        cache: "no-store",
    });

    const data = await response.json();
    const articles = data.articles ?? [];

    return (
        <main>
            <Section
                title="Brunch Articles"
                description="브런치에 작성한 글들이 자동으로 업데이트돼요."
            >
                <Container className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {articles.length === 0 && (
                        <p className="text-muted">브런치 글을 불러올 수 없어요 😢</p>
                    )}

                    {articles.map((article: any, index: number) => (
                        <a
                            key={index}
                            href={article.link}
                            target="_blank"
                            className="block"
                        >
                            <Card className="p-0 overflow-hidden">
                                {/* Thumbnail */}
                                <div className="w-full h-48 bg-secondary flex items-center justify-center overflow-hidden">
                                    {article.thumbnail ? (
                                        <img
                                            src={article.thumbnail}
                                            alt={article.title}
                                            className="object-cover w-full h-full"
                                        />
                                    ) : (
                                        <div className="text-muted">이미지 없음</div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <h2 className="font-bold text-primary text-lg line-clamp-2">
                                        {article.title}
                                    </h2>

                                    <p className="mt-2 text-muted text-sm leading-relaxed line-clamp-3">
                                        {article.description}
                                    </p>

                                    <p className="mt-3 text-xs text-muted">{article.date}</p>
                                </div>
                            </Card>
                        </a>
                    ))}
                </Container>
            </Section>
        </main>
    );
}
