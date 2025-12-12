export default function Footer() {
    return (
        <footer className="w-full border-t border-neutral-200 bg-secondary mt-16">
            <div className="max-w-4xl mx-auto px-4 py-8 text-center">
                <p className="text-primary font-semibold text-lg">
                    Studio Mingdu
                </p>

                <p className="text-muted text-sm mt-2 leading-relaxed">
                    글, 인스타툰, 그리고 작은 세계관을 담는 작업실
                </p>

                <p className="text-muted text-xs mt-6">
                    © {new Date().getFullYear()} Studio Mingdu. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
