export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="w-full py-6 px-8 flex justify-between items-center border-b border-[#E8DCCF]">
        <h1 className="text-2xl font-bold text-[#3E3632]">
          Studio Mingdu
        </h1>

        <nav className="flex gap-6 text-lg text-[#6A5F58]">
          <a href="/articles" className="hover:text-[#FFBFA9]">Articles</a>
          <a href="/instatoons" className="hover:text-[#FFBFA9]">Instatoons</a>
          <a href="/characters" className="hover:text-[#FFBFA9]">Characters</a>
          <a href="/about" className="hover:text-[#FFBFA9]">About</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="px-8 mt-20">
        <h2 className="text-4xl font-semibold text-[#3E3632] leading-snug">
          작가 밍듀의 작은 작업실<br />
          글, 인스타툰, 그리고 세계관을 담는 공간
        </h2>

        <p className="mt-6 text-lg text-[#6A5F58] leading-relaxed">
          브런치에 흩어진 글들, 인스타에 흩어진 그림들을<br />
          모두 한곳에 천천히 쌓아가는 중이에요.
        </p>
      </section>
    </div>
  );
}
