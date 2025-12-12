// app/layout.tsx
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Studio Mingdu",
  description: "밍듀의 스튜디오 — 인스타툰, 글쓰기, 포트폴리오 프로젝트",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className="min-h-screen flex flex-col bg-neutral-50 text-[#3E3632]">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
