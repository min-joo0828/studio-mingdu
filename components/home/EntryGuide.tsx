import Link from "next/link";

const ENTRY_ITEMS = [
    {
        label: "지친 하루",
        tag: "지침",
    },
    {
        label: "그래도 해낸 날",
        tag: "성장",
    },
    {
        label: "아이와 나",
        tag: "육아",
    },
];

export default function EntryGuide() {
    return (
        <div className="py-8 text-center">
            <p className="mb-4 text-base text-stone-600">
                지금 어떤 이야기가 보고 싶으세요?
            </p>

            <div className="flex flex-wrap justify-center gap-3">
                {ENTRY_ITEMS.map((item) => (
                    <Link
                        key={item.tag}
                        href={`/instatoons/tag/${encodeURIComponent(item.tag)}`}
                        className="
                            rounded-full border border-stone-200
                            px-4 py-2 text-sm text-stone-700
                            hover:bg-stone-100 transition
                        "
                    >
                        {item.label}
                    </Link>
                ))}
            </div>
        </div>
    );
}
