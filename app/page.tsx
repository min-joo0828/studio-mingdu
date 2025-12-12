import Section from "@/components/common/Section";
import Container from "@/components/common/Container";
import Card from "@/components/common/Card";

export default function Home() {
  return (
    <main>
      {/* 1. Hero Section */}
      <Section>
        <Container className="py-20 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-primary leading-snug">
            작가 밍듀의 작은 작업실
          </h1>

          <p className="mt-6 text-lg text-muted leading-relaxed max-w-2xl mx-auto">
            글, 인스타툰, 그리고 세계관을 만들어가는 공간.
            흩어진 기록을 모아 나만의 세계를 만들어가는 여정을 담고 있어요.
          </p>
        </Container>
      </Section>

      {/* 2. InstaToon Preview */}
      <Section
        title="InstaToon"
        description="최근 작업한 인스타툰을 미리 만나보세요."
      >
        <Container className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <div className="h-40 bg-secondary rounded-lg mb-4"></div>
            <h3 className="font-bold text-primary text-lg">인스타툰 예시 1</h3>
            <p className="text-muted mt-1 text-sm">작업 미리보기 카드</p>
          </Card>

          <Card>
            <div className="h-40 bg-secondary rounded-lg mb-4"></div>
            <h3 className="font-bold text-primary text-lg">인스타툰 예시 2</h3>
            <p className="text-muted mt-1 text-sm">작업 미리보기 카드</p>
          </Card>

          <Card>
            <div className="h-40 bg-secondary rounded-lg mb-4"></div>
            <h3 className="font-bold text-primary text-lg">인스타툰 예시 3</h3>
            <p className="text-muted mt-1 text-sm">작업 미리보기 카드</p>
          </Card>
        </Container>
      </Section>

      {/* 3. Brunch Articles */}
      <Section
        title="Brunch Articles"
        description="브런치에 쌓인 글들을 한 곳에서."
      >
        <Container className="grid sm:grid-cols-2 gap-6">
          <Card>
            <h3 className="font-bold text-primary text-xl">글 제목 예시 1</h3>
            <p className="text-muted mt-3 text-base leading-relaxed">
              글 요약 부분이 들어갑니다. 밍듀의 감성이 담긴 따뜻한 에세이…
            </p>
            <p className="text-sm text-muted mt-4">2025.01.01</p>
          </Card>

          <Card>
            <h3 className="font-bold text-primary text-xl">글 제목 예시 2</h3>
            <p className="text-muted mt-3 text-base leading-relaxed">
              또 다른 글의 요약입니다. 브런치에서 연재 중인 이야기들…
            </p>
            <p className="text-sm text-muted mt-4">2025.01.10</p>
          </Card>
        </Container>
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
