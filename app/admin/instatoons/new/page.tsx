"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import {
    DndContext,
    closestCenter,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    SortableContext,
    useSortable,
    arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

/* -----------------------------
 * Utils
 * ---------------------------- */
function getStoragePathFromUrl(url: string) {
    const marker = "/storage/v1/object/public/studio-mingdu/";
    const index = url.indexOf(marker);
    if (index === -1) return null;
    return url.substring(index + marker.length);
}

/* -----------------------------
 * Sortable Image Card
 * ---------------------------- */
function SortableImage({
    url,
    isFirst,
    onRemove,
}: {
    url: string;
    isFirst: boolean;
    onRemove: () => void;
}) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: url });

    return (
        <div
            ref={setNodeRef}
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
            }}
            {...attributes}
            className="relative rounded-xl border bg-white p-2 shadow-sm"
        >
            {/* 대표 표시 */}
            {isFirst && (
                <div className="absolute left-2 top-2 z-10 rounded bg-black/70 px-2 py-0.5 text-xs text-white">
                    대표
                </div>
            )}

            {/* 삭제 버튼 (🔥 드래그와 완전 분리) */}
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation(); // 🔥 핵심
                    onRemove();
                }}
                className="absolute right-2 top-2 z-10 rounded-full bg-white px-2 py-0.5 text-xs shadow hover:bg-red-50"
            >
                ✕
            </button>

            {/* 드래그 핸들 영역 */}
            <div {...listeners}>
                <img
                    src={url}
                    alt="instatoon"
                    className="aspect-[4/5] w-32 rounded-lg object-cover"
                />

                <p className="mt-1 text-center text-xs text-black/40">
                    드래그로 순서 변경
                </p>
            </div>
        </div>
    );
}

/* -----------------------------
 * Page
 * ---------------------------- */
export default function NewInstatoonPage() {
    const [title, setTitle] = useState("");
    const [images, setImages] = useState<string[]>([]);
    const [description, setDescription] = useState("");
    const [music, setMusic] = useState("");
    const [tags, setTags] = useState("");
    const [instagramUrl, setInstagramUrl] = useState("");
    const [isPublished, setIsPublished] = useState(false);

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    /* 이미지 업로드 */
    const uploadImages = async (files: FileList | null) => {
        if (!files || files.length === 0) return;

        setUploading(true);

        for (const file of Array.from(files)) {
            const ext = file.name.split(".").pop();
            const filePath = `instatoons/${crypto.randomUUID()}.${ext}`;

            const { error } = await supabase.storage
                .from("studio-mingdu")
                .upload(filePath, file);

            if (error) {
                alert("이미지 업로드 실패");
                console.error(error);
                setUploading(false);
                return;
            }

            const { data } = supabase.storage
                .from("studio-mingdu")
                .getPublicUrl(filePath);

            setImages((prev) => [...prev, data.publicUrl]);
        }

        setUploading(false);
    };

    /* 이미지 삭제 */
    const removeImage = async (url: string) => {
        const path = getStoragePathFromUrl(url);

        // UI에서 먼저 제거
        setImages((prev) => prev.filter((u) => u !== url));

        if (!path) {
            console.warn("Storage path not found:", url);
            return;
        }

        const { error } = await supabase.storage
            .from("studio-mingdu")
            .remove([path]);

        if (error) {
            alert("스토리지 이미지 삭제 실패");
            console.error(error);
        }
    };

    /* 드래그 종료 */
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || active.id === over.id) return;

        setImages((items) =>
            arrayMove(
                items,
                items.indexOf(active.id as string),
                items.indexOf(over.id as string)
            )
        );
    };

    /* 저장 */
    const saveInstatoon = async () => {
        if (!title || images.length === 0) {
            alert("제목과 이미지는 필수입니다.");
            return;
        }

        setLoading(true);

        const { error } = await supabase
            .from("instagram_toons")
            .insert({
                title,
                image_urls: images,
                description: description || null,
                music: music || null,
                tags: tags
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean),
                instagram_url: instagramUrl || null,
                is_published: isPublished,
                published_at: isPublished ? new Date().toISOString() : null,
            });

        setLoading(false);

        if (error) {
            alert("저장 실패");
            console.error(error);
        } else {
            alert("등록 완료!");
            location.href = "/admin/instatoons";
        }
    };

    return (
        <main className="mx-auto max-w-4xl px-6 py-10">
            <h1 className="mb-8 text-2xl font-bold text-[#3E3632]">
                Instatoon 등록
            </h1>

            {/* 제목 */}
            <label className="mb-6 block">
                <span className="text-sm font-medium">제목</span>
                <input
                    className="mt-1 w-full rounded border p-2"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </label>

            {/* 이미지 */}
            <section className="mb-8">
                <div className="flex items-center gap-3">
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#3E3632] px-4 py-2 text-sm text-white">
                        + 이미지 추가
                        <input
                            type="file"
                            multiple
                            className="hidden"
                            onChange={(e) => uploadImages(e.target.files)}
                        />
                    </label>

                    {uploading && (
                        <span className="text-sm text-black/50">
                            업로드 중…
                        </span>
                    )}
                </div>

                {images.length === 0 ? (
                    <div className="mt-4 rounded-xl border border-dashed p-8 text-center text-sm text-black/40">
                        아직 등록된 이미지가 없습니다.
                    </div>
                ) : (
                    <DndContext
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext items={images}>
                            <div className="mt-4 flex flex-wrap gap-4">
                                {images.map((url, idx) => (
                                    <SortableImage
                                        key={url}
                                        url={url}
                                        isFirst={idx === 0}
                                        onRemove={() => removeImage(url)}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                )}

                <p className="mt-3 text-xs text-black/50">
                    · 첫 번째 이미지가 대표 이미지입니다.
                </p>
            </section>

            {/* 설명 */}
            <label className="mb-6 block">
                <span className="text-sm font-medium">
                    설명 / 캡션 초안
                </span>
                <textarea
                    className="mt-1 w-full rounded border p-2"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </label>

            {/* 음악 */}
            <label className="mb-6 block">
                <span className="text-sm font-medium">
                    추천 음악
                </span>
                <input
                    className="mt-1 w-full rounded border p-2"
                    value={music}
                    onChange={(e) => setMusic(e.target.value)}
                    placeholder="아티스트 - 곡명"
                />
            </label>

            {/* 태그 */}
            <label className="mb-6 block">
                <span className="text-sm font-medium">
                    태그 (콤마 구분)
                </span>
                <input
                    className="mt-1 w-full rounded border p-2"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                />
            </label>

            {/* 인스타 URL */}
            <label className="mb-6 block">
                <span className="text-sm font-medium">
                    Instagram URL
                </span>
                <input
                    className="mt-1 w-full rounded border p-2"
                    value={instagramUrl}
                    onChange={(e) => setInstagramUrl(e.target.value)}
                />
            </label>

            {/* 공개 여부 */}
            <label className="mb-8 flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                />
                <span className="text-sm">즉시 공개</span>
            </label>

            <button
                onClick={saveInstatoon}
                disabled={loading}
                className="rounded-lg bg-[#3E3632] px-6 py-2 text-white disabled:opacity-50"
            >
                {loading ? "저장 중…" : "Instatoon 등록"}
            </button>
        </main>
    );
}
