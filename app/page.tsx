import Section from "@/components/common/Section";
import Container from "@/components/common/Container";
import Card from "@/components/common/Card";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import RecommendedTags from "@/components/instatoon/RecommendedTags";
import TodayInstatoon from "@/components/instatoon/TodayInstatoon";
import EntryGuide from "@/components/home/EntryGuide";

import type { Metadata } from "next";

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: "작가 밍듀의 작은 작업실",
    description:
      "글, 인스타툰, 그리고 세계관을 만들어가는 공간. 흩어진 기록을 모아 나만의 세계를 만들어갑니다.",
    openGraph: {
      title: "Studio Mingdu",
      description:
        "글과 인스타툰으로 세계관을 만들어가는 작가 밍듀의 작업실",
      url: "https://studio-mingdu.vercel.app",
      siteName: "Studio Mingdu",
      type: "website",
    },
  };
};

export default async function Home() {
  /* =========================
     1️⃣ Instatoon (Supabase)
  ========================= */
  const { data: instatoons } = await supabase
    .from("instagram_toons")
    .select("id, title, image_urls")
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .limit(3);

  /* =========================
     2️⃣ Brunch Articles (/api/rss)
  ========================= */
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/rss?limit=2`,
    {
      next: { revalidate: 3600 },
    }
  );

  const data = await response.json();
  const articles = (data.articles ?? []).slice(0, 2);

  return (
    <main>
      {/* 1. Hero Section */}
      <Section>
        <Container className="py-5 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-primary leading-snug">
            작가 밍듀의 작은 작업실
          </h1>

          <p className="mt-6 text-lg text-muted leading-relaxed max-w-2xl mx-auto">
            글, 인스타툰, 그리고 세계관을 만들어가는 공간.
            흩어진 기록을 모아 나만의 세계를 만들어가는 여정을 담고 있어요.
          </p>
        </Container>
      </Section>

      {/* 🌿 Hero → Content 전환 요소 */}
      <div className="flex justify-center">
        <span className="block w-12 h-px bg-stone-300" />
      </div>

      <EntryGuide />

      {/* 2. InstaToon Preview */}
      <Section
        title="InstaToon"
        description="최근 작업한 인스타툰을 미리 만나보세요."
      >
        <Container className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {instatoons?.map((toon) => (
            <Link
              key={toon.id}
              href={`/instatoons/${toon.id}`}
              className="block"
            >
              <Card>
                {toon.image_urls?.[0] && (
                  <img
                    src={toon.image_urls[0]}
                    alt={toon.title}
                    className="w-full aspect-[4/5] object-cover rounded-lg mb-4"
                  />
                )}

                <h3 className="font-bold text-primary text-lg line-clamp-2">
                  {toon.title}
                </h3>
              </Card>
            </Link>
          ))}
        </Container>

        <div className="mt-8 text-center">
          <Link
            href="/instatoons"
            className="text-sm text-muted hover:underline"
          >
            인스타툰 전체 보기 →
          </Link>
        </div>
      </Section>

      {/* 🌿 오늘의 Instatoon */}
      <Section>
        <Container>
          <TodayInstatoon />
        </Container>
      </Section>

      {/* ⭐ Recommended Tags */}
      <Section
        title="추천 태그"
        description="관심 있는 이야기부터 살펴보세요."
      >
        <Container>
          <RecommendedTags />
        </Container>
      </Section>

      {/* 3. Brunch Articles */}
      <Section
        title="Brunch Articles"
        description="브런치에 쌓인 글들을 한 곳에서."
      >
        <Container className="grid sm:grid-cols-2 gap-6">
          {articles.map((article: any, index: number) => (
            <a
              key={index}
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Card className="h-full flex flex-col p-0 overflow-hidden">
                {/* Thumbnail */}
                <div className="h-40 w-full bg-secondary overflow-hidden">
                  {article.thumbnail ? (
                    <img
                      src={article.thumbnail}
                      alt={article.title}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted">
                      이미지 없음
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-primary text-lg line-clamp-2">
                    {article.title}
                  </h3>

                  <p className="text-muted mt-2 text-sm line-clamp-3">
                    {article.description}
                  </p>

                  <p className="mt-auto text-xs text-muted">
                    {article.date}
                  </p>
                </div>
              </Card>
            </a>
          ))}
        </Container>

        <div className="mt-8 text-center">
          <Link
            href="/articles"
            className="text-sm text-muted hover:underline"
          >
            브런치 글 전체 보기 →
          </Link>
        </div>
      </Section>

      {/* 4. About Section */}
      <Section
        title="About Studio Mingdu"
        description="작가 밍듀가 만들어가는 크리에이티브 공간입니다."
      >
        <Container className="max-w-3xl">
          <p className="text-lg leading-relaxed text-primary">
            Studio Mingdu는 글과 그림이 만나는 작은 창작 공간입니다.
            인스타툰, 에세이, 세계관 프로젝트 등 다양한 작업들을 모아
            더 많은 사람들과 나누기 위해 만들어졌어요.
            앞으로 차곡차곡 콘텐츠를 쌓아갈 예정이에요.
          </p>
        </Container>
      </Section>
    </main>
  );
}
