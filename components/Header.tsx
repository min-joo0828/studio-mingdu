export default function Header() {
    return (
        <header className="w-full bg-[#FFF9F2] border-b border-[#F0E6DD]">
            <div className="max-w-4xl mx-auto flex items-center justify-between px-4 py-4 sm:px-6 sm:py-5">

                {/* 로고 */}
                <a href="/" className="text-[#3E3632] font-bold text-xl sm:text-2xl">
                    Studio Mingdu
                </a>

                {/* 메뉴 */}
                <nav className="flex items-center gap-4 sm:gap-8 text-sm sm:text-base">
                    <a href="/" className="text-[#6A5F58] hover:text-[#3E3632]">Home</a>
                    <a href="/articles" className="text-[#6A5F58] hover:text-[#3E3632]">Articles</a>
                    <a href="/instatoons" className="text-[#6A5F58] hover:text-[#3E3632]">Instatoons</a>
                    <a href="/characters" className="text-[#6A5F58] hover:text-[#3E3632]">Characters</a>
                    <a href="/about" className="text-[#6A5F58] hover:text-[#3E3632]">About</a>
                </nav>
            </div>
        </header>
    );
}
