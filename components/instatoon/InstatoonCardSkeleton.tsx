export default function InstatoonCardSkeleton() {
    return (
        <div className="animate-pulse">
            {/* 이미지 영역 */}
            <div className="aspect-[4/5] w-full rounded-xl bg-stone-200 mb-3" />

            {/* 제목 영역 */}
            <div className="h-4 w-3/4 rounded bg-stone-200" />
        </div>
    );
}
