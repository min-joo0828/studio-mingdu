// app/instatoon/page.tsx

import Section from "@/components/common/Section";
import Container from "@/components/common/Container";
import Card from "@/components/common/Card";

export default function InstaToonPage() {
    // 아직 실제 데이터 없으니까 예시 데이터 준비
    const dummyToons = [
        {
            title: "오늘도 워킹맘 모드",
            description: "회사와 육아 사이에서 균형을 찾아가는 마리나의 하루.",
            thumbnail: "", // 나중에 실제 이미지 경로 들어갈 예정
            date: "2025.02.01",
        },
        {
            title: "소피아의 깜찍한 질문",
            description: "아이와의 대화를 통해 하루가 따뜻해지는 순간.",
            thumbnail: "",
            date: "2025.01.26",
        },
        {
            title: "마리나의 퇴근 후 순간",
            description: "잠시 숨 돌리는 엄마의 작은 휴식.",
            thumbnail: "",
            date: "2025.01.20",
        },
    ];

    return (
        <main>
            <Section
                title="InstaToon"
                description="따뜻한 감성으로 기록한 일상의 순간들입니다."
            >
                <Container className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {dummyToons.map((toon, index) => (
                        <Card key={index} className="p-0 overflow-hidden">
                            {/* Thumbnail 영역 */}
                            <div className="w-full h-56 bg-secondary flex items-center justify-center overflow-hidden">
                                {toon.thumbnail ? (
                                    <img
                                        src={toon.thumbnail}
                                        alt={toon.title}
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    <span className="text-muted">이미지 준비중</span>
                                )}
                            </div>

                            {/* Text 영역 */}
                            <div className="p-5">
                                <h2 className="text-xl font-bold text-primary line-clamp-2">
                                    {toon.title}
                                </h2>

                                <p className="mt-2 text-muted text-sm line-clamp-3 leading-relaxed">
                                    {toon.description}
                                </p>

                                <p className="mt-3 text-xs text-muted">{toon.date}</p>
                            </div>
                        </Card>
                    ))}
                </Container>
            </Section>
        </main>
    );
}
