"use client";

import Image from "next/image";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { useSession } from "next-auth/react";
import { createPortal } from "react-dom";

/** ✅ 너 백엔드 주소로 수정 */
const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8080";
const UPLOAD_URL = `${API_BASE}/gallery/upload`;
const LIST_URL = `${API_BASE}/gallery`;

export type GalleryItem = {
  id: string;
  /** ✅ 그리드(목록)에서 보여줄 썸네일 */
  thumbSrc: string;
  /** ✅ 라이트박스(상세)에서 보여줄 원본 */
  fullSrc: string;
  alt?: string;
  title?: string;
};

type Props = {
  items?: GalleryItem[];
  variantsItem?: Variants;
  scrollRef?: React.RefObject<HTMLDivElement | null>;
  pageSize?: number;
  onUploadedItems?: (newItems: GalleryItem[]) => void;
  autoLoad?: boolean;
  listQuery?: { page?: number; pageSize?: number };
};

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes)) return "";
  const units = ["B", "KB", "MB", "GB"];
  let v = bytes;
  let i = 0;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i += 1;
  }
  return `${v.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

type ApiGalleryItem = {
  id: string;
  imageUrl: string;
  thumbUrl: string;
  title?: string | null;
};

export default function GallerySection({
  items = [],
  variantsItem,
  scrollRef,
  pageSize = 12,
  onUploadedItems,
  autoLoad = true,
  listQuery,
}: Props) {
  const { data: session, status } = useSession();
  const isAdmin =
    status === "authenticated" && (session as any)?.user?.role === "admin";

  /** ✅ Portal 마운트 체크 (SSR/CSR 안전) */
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  /** ✅ 내부에서 목록 관리(단독 동작 가능하게) */
  const [localItems, setLocalItems] = useState<GalleryItem[]>(items);

  /** ✅ props items가 바뀌면 동기화(부모에서 관리하는 경우) */
  useEffect(() => {
    setLocalItems(items);
  }, [items]);

  /** ✅ 백엔드에서 목록 자동 로드 */
  useEffect(() => {
    if (!autoLoad) return;

    const page = listQuery?.page ?? 1;
    const ps = listQuery?.pageSize ?? 60;

    (async () => {
      try {
        const r = await fetch(`${LIST_URL}?page=${page}&pageSize=${ps}`, {
          method: "GET",
        });
        const data = await r.json();
        if (!r.ok) throw new Error(data?.message || "목록 로드 실패");

        const mapped: GalleryItem[] = (data.items as any[]).map((x: any) => ({
          id: String(x.id),
          thumbSrc: x.thumbUrl ?? x.thumbSrc ?? x.src,
          fullSrc: x.imageUrl ?? x.fullSrc ?? x.src,
          title: x.title ?? undefined,
          alt: x.title ?? undefined,
        }));

        setLocalItems(mapped);
      } catch (e) {
        console.error(e);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoLoad]);

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  // ✅ 페이지네이션
  const [page, setPage] = useState(0);

  // ✅ 업로드 모달 상태
  const [uploadOpen, setUploadOpen] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [picked, setPicked] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const hasItems = localItems?.length > 0;

  const totalPages = useMemo(() => {
    if (!hasItems) return 1;
    return Math.max(1, Math.ceil(localItems.length / pageSize));
  }, [hasItems, localItems.length, pageSize]);

  const pagedItems = useMemo(() => {
    if (!hasItems) return [];
    const start = page * pageSize;
    return localItems.slice(start, start + pageSize);
  }, [hasItems, localItems, page, pageSize]);

  const clampAll = (i: number) => {
    if (!hasItems) return 0;
    const n = localItems.length;
    return (i + n) % n;
  };

  const cur = hasItems ? localItems[clampAll(active)] : null;

  const openAt = (indexInPage: number) => {
    if (!hasItems) return;
    const absoluteIndex = page * pageSize + indexInPage;
    setActive(absoluteIndex);
    setOpen(true);
  };

  const close = () => setOpen(false);
  const prev = () => setActive((p) => clampAll(p - 1));
  const next = () => setActive((p) => clampAll(p + 1));

  // ✅ ESC / Arrow keys (라이트박스)
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // ✅ 페이지 변경 시 갤러리 스크롤을 맨 위로
  useEffect(() => {
    const sc = scrollRef?.current;
    if (!sc) return;
    sc.scrollTo({ top: 0, behavior: "auto" });
  }, [page, scrollRef]);

  // ✅ 업로드 모달 열릴 때 선택 초기화
  useEffect(() => {
    if (!uploadOpen) return;
    setPicked([]);
    setDragOver(false);
  }, [uploadOpen]);

  // ✅ 업로드 모달 ESC 닫기
  useEffect(() => {
    if (!uploadOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setUploadOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [uploadOpen]);

  const Wrap: any = variantsItem ? motion.div : "div";
  const wrapProps = variantsItem ? { variants: variantsItem } : {};

  const canPrevPage = page > 0;
  const canNextPage = page < totalPages - 1;

  const goPrevPage = () => setPage((p) => Math.max(0, p - 1));
  const goNextPage = () => setPage((p) => Math.min(totalPages - 1, p + 1));

  const addFiles = (filesLike: FileList | File[]) => {
    const arr = Array.from(filesLike ?? []);
    const imgs = arr.filter((f) => f.type.startsWith("image/"));
    if (imgs.length === 0) return;

    setPicked((prev) => {
      const map = new Map<string, File>();
      [...prev, ...imgs].forEach((f) => map.set(`${f.name}_${f.size}`, f));
      return Array.from(map.values());
    });
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    addFiles(e.target.files);
    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };

  const removePicked = (idx: number) => {
    setPicked((prev) => prev.filter((_, i) => i !== idx));
  };

  /** ✅ 백엔드 업로드 */
  const startUpload = async () => {
    if (picked.length === 0) return;
    setUploading(true);

    try {
      const fd = new FormData();
      picked.forEach((f) => fd.append("files", f));

      const r = await fetch(UPLOAD_URL, {
        method: "POST",
        body: fd,
      });

      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data?.message || "업로드 실패");

      const apiItems: ApiGalleryItem[] = (data.items ?? []) as any[];

      const newItems: GalleryItem[] = apiItems.map((x) => ({
        id: String(x.id),
        thumbSrc: (x as any).thumbUrl,
        fullSrc: (x as any).imageUrl,
        title: x.title ?? undefined,
        alt: x.title ?? undefined,
      }));

      onUploadedItems?.(newItems);
      setLocalItems((prev) => [...newItems, ...prev]);
      setUploadOpen(false);
    } catch (e: any) {
      alert(e?.message ?? "업로드 중 오류");
      console.error(e);
    } finally {
      setUploading(false);
    }
  };

  /** ✅ Portal로 띄울 모달 Root */
  const ModalRoot = mounted ? document.body : null;

  const openUploadModal = () => {
    if (!isAdmin) return;
    setUploadOpen(true);
  };

  /** ✅✅✅ 여기부터: 조기 return 제거하고, 화면만 조건부로 */
  return (
    <>
      <Wrap
        {...wrapProps}
        className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur md:p-6"
      >
        {!hasItems ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white/70">
            갤러리 이미지가 없습니다.
            {isAdmin && (
              <div className="mt-4">
                <button
                  type="button"
                  onClick={openUploadModal}
                  className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white/80 transition hover:bg-white/10"
                >
                  + 이미지 등록
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* 헤더 */}
            <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="text-base font-semibold text-white">
                    갤러리
                  </div>
                  {isAdmin && (
                    <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-200">
                      ADMIN
                    </span>
                  )}
                </div>
                <div className="mt-1 text-xs text-white/55">
                  휠로 스크롤 · 클릭하면 크게 보기
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 md:justify-end">
                {/* 페이지 이동 */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={goPrevPage}
                    disabled={!canPrevPage}
                    className={`rounded-lg border px-3 py-1.5 text-sm transition
                      ${
                        canPrevPage
                          ? "border-white/15 bg-white/5 text-white/80 hover:bg-white/10"
                          : "border-white/10 bg-white/5 text-white/30 opacity-60 cursor-not-allowed"
                      }`}
                  >
                    이전
                  </button>

                  <div className="min-w-[84px] text-center text-xs text-white/60">
                    {page + 1} / {totalPages}
                  </div>

                  <button
                    type="button"
                    onClick={goNextPage}
                    disabled={!canNextPage}
                    className={`rounded-lg border px-3 py-1.5 text-sm transition
                      ${
                        canNextPage
                          ? "border-white/15 bg-white/5 text-white/80 hover:bg-white/10"
                          : "border-white/10 bg-white/5 text-white/30 opacity-60 cursor-not-allowed"
                      }`}
                  >
                    다음
                  </button>
                </div>

                {/* 관리자 버튼 */}
                {isAdmin && (
                  <button
                    type="button"
                    onClick={openUploadModal}
                    className="ml-1 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-sm text-white/80 transition hover:bg-white/10"
                  >
                    + 이미지 등록
                  </button>
                )}
              </div>
            </div>

            {/* 스크롤 영역 */}
            <div ref={scrollRef} className="max-h-[68vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
                {pagedItems.map((it, i) => (
                  <button
                    key={it.id}
                    type="button"
                    onClick={() => openAt(i)}
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/20 outline-none transition hover:border-white/20"
                    aria-label="갤러리 이미지 보기"
                  >
                    <div className="relative aspect-[4/3] w-full">
                      <Image
                        src={it.thumbSrc}
                        alt={it.alt ?? it.title ?? "gallery"}
                        fill
                        sizes="(max-width: 768px) 50vw, 33vw"
                        className="object-cover transition duration-300 group-hover:scale-[1.03]"
                        priority={i < 6}
                      />
                    </div>

                    {(it.title || it.alt) && (
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-3 opacity-0 transition group-hover:opacity-100">
                        <div className="line-clamp-1 text-left text-sm font-semibold text-white">
                          {it.title ?? it.alt}
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div className="mt-4 text-center text-xs text-white/40">
                {pageSize}개씩 표시 · 총 {localItems.length}개
              </div>
            </div>
          </>
        )}
      </Wrap>

      {/* ✅✅✅ 업로드 모달(관리자만) - Portal 렌더: 이제 빈 상태에서도 항상 렌더됨 */}
      {ModalRoot &&
        createPortal(
          <AnimatePresence>
            {uploadOpen && isAdmin && (
              <motion.div
                className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/80 p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setUploadOpen(false)}
                aria-modal="true"
                role="dialog"
              >
                <motion.div
                  className="w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl"
                  initial={{ y: 10, scale: 0.98, opacity: 0 }}
                  animate={{ y: 0, scale: 1, opacity: 1 }}
                  exit={{ y: 10, scale: 0.98, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                    <div className="text-sm font-semibold text-white/90">
                      이미지 등록
                      <span className="ml-2 text-xs font-normal text-white/50">
                        드래그&드롭 또는 클릭 선택
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setUploadOpen(false)}
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/80 transition hover:bg-white/10"
                    >
                      닫기 (ESC)
                    </button>
                  </div>

                  <div className="p-4 md:p-5">
                    <div
                      className={`flex min-h-[180px] flex-col items-center justify-center rounded-2xl border border-dashed p-6 text-center transition
                        ${
                          dragOver
                            ? "border-white/40 bg-white/10"
                            : "border-white/15 bg-white/5 hover:bg-white/10"
                        }`}
                      onDrop={onDrop}
                      onDragOver={onDragOver}
                      onDragLeave={onDragLeave}
                      onClick={() => inputRef.current?.click()}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="text-sm font-semibold text-white/90">
                        여기에 이미지를 드롭하세요
                      </div>
                      <div className="mt-2 text-xs text-white/60">
                        또는 클릭해서 파일 선택
                      </div>

                      <input
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={onInputChange}
                      />

                      <div className="mt-4 rounded-lg border border-white/10 bg-black/20 px-3 py-1.5 text-xs text-white/70">
                        선택된 파일: {picked.length}개
                      </div>
                    </div>

                    {picked.length > 0 && (
                      <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-3">
                        <div className="mb-2 text-xs font-semibold text-white/70">
                          선택된 파일
                        </div>

                        <div className="max-h-[180px] overflow-y-auto pr-1">
                          <ul className="space-y-2">
                            {picked.map((f, i) => (
                              <li
                                key={`${f.name}_${f.size}`}
                                className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/20 px-3 py-2"
                              >
                                <div className="min-w-0">
                                  <div className="truncate text-sm text-white/85">
                                    {f.name}
                                  </div>
                                  <div className="text-xs text-white/50">
                                    {formatBytes(f.size)}
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removePicked(i)}
                                  className="shrink-0 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/70 transition hover:bg-white/10"
                                >
                                  제거
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-3 border-t border-white/10 px-4 py-3">
                    <div className="text-xs text-white/45">
                      업로드는 {UPLOAD_URL} 로 전송됩니다.
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPicked([])}
                        disabled={picked.length === 0 || uploading}
                        className={`rounded-lg border px-3 py-1.5 text-sm transition
                          ${
                            picked.length > 0 && !uploading
                              ? "border-white/15 bg-white/5 text-white/80 hover:bg-white/10"
                              : "border-white/10 bg-white/5 text-white/30 opacity-60 cursor-not-allowed"
                          }`}
                      >
                        초기화
                      </button>

                      <button
                        type="button"
                        onClick={startUpload}
                        disabled={picked.length === 0 || uploading}
                        className={`rounded-lg border px-3 py-1.5 text-sm transition
                          ${
                            picked.length > 0 && !uploading
                              ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-100 hover:bg-emerald-400/15"
                              : "border-white/10 bg-white/5 text-white/30 opacity-60 cursor-not-allowed"
                          }`}
                      >
                        {uploading ? "업로드 중..." : "업로드"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          ModalRoot
        )}

      {/* ✅ 라이트박스는 items 있을 때만 */}
      {ModalRoot &&
        createPortal(
          <AnimatePresence>
            {open && cur && (
              <motion.div
                className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={close}
                aria-modal="true"
                role="dialog"
              >
                <motion.div
                  className="relative w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl"
                  initial={{ y: 10, scale: 0.98, opacity: 0 }}
                  animate={{ y: 0, scale: 1, opacity: 1 }}
                  exit={{ y: 10, scale: 0.98, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                    <div className="text-sm font-semibold text-white/90">
                      {cur.title ?? "Gallery"}
                      <span className="ml-2 text-xs font-normal text-white/50">
                        {clampAll(active) + 1} / {localItems.length}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={close}
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/80 transition hover:bg-white/10"
                    >
                      닫기 (ESC)
                    </button>
                  </div>

                  <div className="relative aspect-[16/9] w-full bg-black">
                    <Image
                      src={cur.fullSrc}
                      alt={cur.alt ?? cur.title ?? "selected"}
                      fill
                      sizes="(max-width: 768px) 100vw, 80vw"
                      className="object-contain"
                      priority
                    />
                    <button
                      type="button"
                      onClick={prev}
                      className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-white/15 bg-black/35 p-3 text-white/90 backdrop-blur transition hover:bg-black/55"
                      aria-label="이전 이미지"
                    >
                      <span className="block text-xl leading-none">‹</span>
                    </button>
                    <button
                      type="button"
                      onClick={next}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/15 bg-black/35 p-3 text-white/90 backdrop-blur transition hover:bg-black/55"
                      aria-label="다음 이미지"
                    >
                      <span className="block text-xl leading-none">›</span>
                    </button>
                  </div>

                  <div className="border-t border-white/10 px-4 py-3 text-xs text-white/55">
                    좌/우 화살표 키로 이동 가능 · 바깥 영역 클릭 또는 ESC로 닫기
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          ModalRoot
        )}
    </>
  );
}
