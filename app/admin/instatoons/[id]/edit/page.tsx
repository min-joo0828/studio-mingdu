"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
 * Sortable Image
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
            {isFirst && (
                <div className="absolute left-2 top-2 z-10 rounded bg-black/70 px-2 py-0.5 text-xs text-white">
                    대표
                </div>
            )}

            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove();
                }}
                className="absolute right-2 top-2 z-10 rounded-full bg-white px-2 py-0.5 text-xs shadow hover:bg-red-50"
            >
                ✕
            </button>

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
export default function EditInstatoonPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [title, setTitle] = useState("");
    const [images, setImages] = useState<string[]>([]);
    const [description, setDescription] = useState("");
    const [music, setMusic] = useState("");
    const [tags, setTags] = useState("");
    const [instagramUrl, setInstagramUrl] = useState("");
    const [isPublished, setIsPublished] = useState(false);

    /* 기존 데이터 불러오기 */
    useEffect(() => {
        const fetchInstatoon = async () => {
            const { data, error } = await supabase
                .from("instagram_toons")
                .select("*")
                .eq("id", id)
                .single();

            if (error || !data) {
                alert("데이터를 불러올 수 없습니다.");
                router.push("/admin/instatoons");
                return;
            }

            setTitle(data.title);
            setImages(data.image_urls || []);
            setDescription(data.description || "");
            setMusic(data.music || "");
            setTags((data.tags || []).join(", "));
            setInstagramUrl(data.instagram_url || "");
            setIsPublished(data.is_published);

            setLoading(false);
        };

        fetchInstatoon();
    }, [id, router]);

    /* 이미지 업로드 */
    const uploadImages = async (files: FileList | null) => {
        if (!files || files.length === 0) return;

        for (const file of Array.from(files)) {
            const ext = file.name.split(".").pop();
            const filePath = `instatoons/${crypto.randomUUID()}.${ext}`;

            const { error } = await supabase.storage
                .from("studio-mingdu")
                .upload(filePath, file);

            if (error) {
                alert("이미지 업로드 실패");
                console.error(error);
                return;
            }

            const { data } = supabase.storage
                .from("studio-mingdu")
                .getPublicUrl(filePath);

            setImages((prev) => [...prev, data.publicUrl]);
        }
    };

    /* 개별 이미지 삭제 */
    const removeImage = async (url: string) => {
        const path = getStoragePathFromUrl(url);
        setImages((prev) => prev.filter((u) => u !== url));

        if (!path) return;

        await supabase.storage
            .from("studio-mingdu")
            .remove([path]);
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

    /* 수정 저장 */
    const saveChanges = async () => {
        if (!title || images.length === 0) {
            alert("제목과 이미지는 필수입니다.");
            return;
        }

        setSaving(true);

        const { error } = await supabase
            .from("instagram_toons")
            .update({
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
            })
            .eq("id", id);

        setSaving(false);

        if (error) {
            alert("수정 실패");
            console.error(error);
        } else {
            alert("수정 완료!");
            router.push("/admin/instatoons");
        }
    };

    /* 🔥 인스타툰 전체 삭제 */
    const deleteInstatoon = async () => {
        if (!confirm("이 인스타툰을 완전히 삭제할까요?\n(이미지도 모두 삭제됩니다)")) {
            return;
        }

        setDeleting(true);

        try {
            // 1️⃣ Storage 이미지 전부 삭제
            const paths = images
                .map(getStoragePathFromUrl)
                .filter(Boolean) as string[];

            if (paths.length > 0) {
                const { error: storageError } = await supabase.storage
                    .from("studio-mingdu")
                    .remove(paths);

                if (storageError) {
                    throw storageError;
                }
            }

            // 2️⃣ DB row 삭제
            const { error: dbError } = await supabase
                .from("instagram_toons")
                .delete()
                .eq("id", id);

            if (dbError) {
                throw dbError;
            }

            alert("삭제 완료");
            router.push("/admin/instatoons");
        } catch (err) {
            alert("삭제 중 오류가 발생했습니다.");
            console.error(err);
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <main className="px-6 py-20 text-center text-sm text-black/50">
                불러오는 중…
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-4xl px-6 py-10">
            <div className="mb-8 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-[#3E3632]">
                    Instatoon 수정
                </h1>

                {/* 🔥 삭제 버튼 */}
                <button
                    onClick={deleteInstatoon}
                    disabled={deleting}
                    className="rounded-lg border border-red-400 px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                    {deleting ? "삭제 중…" : "삭제"}
                </button>
            </div>

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
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#3E3632] px-4 py-2 text-sm text-white">
                    + 이미지 추가
                    <input
                        type="file"
                        multiple
                        className="hidden"
                        onChange={(e) => uploadImages(e.target.files)}
                    />
                </label>

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
            </section>

            {/* 설명 */}
            <label className="mb-6 block">
                <span className="text-sm font-medium">설명</span>
                <textarea
                    className="mt-1 w-full rounded border p-2"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </label>

            {/* 음악 */}
            <label className="mb-6 block">
                <span className="text-sm font-medium">추천 음악</span>
                <input
                    className="mt-1 w-full rounded border p-2"
                    value={music}
                    onChange={(e) => setMusic(e.target.value)}
                />
            </label>

            {/* 태그 */}
            <label className="mb-6 block">
                <span className="text-sm font-medium">태그</span>
                <input
                    className="mt-1 w-full rounded border p-2"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                />
            </label>

            {/* 공개 여부 */}
            <label className="mb-8 flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                />
                <span className="text-sm">공개</span>
            </label>

            <button
                onClick={saveChanges}
                disabled={saving}
                className="rounded-lg bg-[#3E3632] px-6 py-2 text-white disabled:opacity-50"
            >
                {saving ? "저장 중…" : "수정 저장"}
            </button>
        </main>
    );
}
