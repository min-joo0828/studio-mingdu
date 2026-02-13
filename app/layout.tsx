import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollRestorer from "@/components/common/ScrollRestorer";
import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Studio Mingdu",
    template: "%s | Studio Mingdu",
  },
  description:
    "글, 인스타툰, 그리고 세계관을 만들어가는 작가 밍듀의 작은 작업실",
  openGraph: {
    title: "Studio Mingdu",
    description:
      "글과 인스타툰으로 세계관을 만들어가는 작가 밍듀의 작업실",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "Studio Mingdu",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen flex flex-col bg-neutral-50 text-[#3E3632]">
        <Header />
        <ScrollRestorer />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
