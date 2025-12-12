// app/about/page.tsx

import Section from "@/components/common/Section";
import Container from "@/components/common/Container";
import Card from "@/components/common/Card";

export default function AboutPage() {
    return (
        <main>
            {/* 소개 섹션 */}
            <Section
                title="About Studio Mingdu"
                description="작가 밍듀의 작은 작업실, 그리고 이 공간을 만들게 된 이야기"
            >
                <Container className="space-y-8">
                    <Card>
                        <p className="leading-relaxed text-muted">
                            Studio Mingdu는 <strong className="text-primary">글쓰기</strong>,
                            <strong className="text-primary"> 인스타툰</strong>,
                            <strong className="text-primary"> 그리고 세계관</strong>을 담는 작은 작업실이에요.
                            <br />
                            <br />
                            브런치에 흩어진 글들, 인스타그램에 흩어진 그림들을
                            한곳에 천천히 쌓아보기 위해 이 공간을 만들었어요.
                            하루의 감정, 부모로서의 고민, 개발자로서의 성장까지—
                            밍듀라는 사람이 살아가는 모든 순간을 이곳에 기록합니다.
                        </p>
                    </Card>
                </Container>
            </Section>

            {/* 세계관 섹션 */}
            <Section
                title="Studio World"
                description="마리나, 소피아, 그리고 햅이 함께 살아가는 세계"
            >
                <Container className="grid gap-6 sm:grid-cols-2">
                    <Card>
                        <h3 className="text-xl font-bold text-primary">Marina</h3>
                        <p className="mt-3 text-muted leading-relaxed">
                            따뜻함과 성찰을 담은 엄마의 시선.
                            일하는 엄마 마리나의 일상은 언제나 진솔하고 때로는 유머러스해요.
                            밍듀의 감성이 가장 많이 담긴 캐릭터입니다.
                        </p>
                    </Card>

                    <Card>
                        <h3 className="text-xl font-bold text-primary">Sophia</h3>
                        <p className="mt-3 text-muted leading-relaxed">
                            귀엽고 사랑스러운 에너지의 아이.
                            일상의 사소한 순간도 소피아의 시선에서는 따뜻한 이야기로 변해요.
                            인스타툰에서 자주 등장하는 주인공이에요.
                        </p>
                    </Card>
                </Container>
            </Section>

            {/* 웹사이트 목적 */}
            <Section
                title="Why I Built This Website"
                description="Studio Mingdu가 존재하는 이유"
            >
                <Container>
                    <Card>
                        <p className="leading-relaxed text-muted">
                            이 공간은 단순한 포트폴리오가 아니라,
                            내가 살아온 기록과 앞으로의 여정을 담는 “작업실”이에요.
                            <br />
                            <br />
                            글쓰기, 그림, 세계관 기록이 모두 이곳에서 연결되고,
                            시간이 흐를수록 밍듀만의 아카이브가 되어 축적되기를 바라며 만들었어요.
                            <br />
                            <br />
                            천천히, 그러나 꾸준히.
                            Studio Mingdu는 그렇게 자라날 예정입니다.
                        </p>
                    </Card>
                </Container>
            </Section>
        </main>
    );
}
