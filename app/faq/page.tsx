"use client";

import SiteFooter from "@/components/SiteFooter";
import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";
import { useCreateFaq, useDeleteFaq, useFaqs, useReorderFaq } from "@/lib/faqQueries";
import type { FaqItem } from "@/lib/faq";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function CreateFaqModal({
  open,
  onClose,
  onSubmit,
  busy,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (v: { title: string; content: string }) => void;
  busy?: boolean;
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  if (!open) return null;

  const submit = () => {
    const t = title.trim();
    const c = content.trim();
    if (!t) return alert("제목을 입력하세요.");
    if (!c) return alert("내용을 입력하세요.");
    onSubmit({ title: t, content: c });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl">
        <div className="text-lg font-bold text-gray-900">FAQ 등록</div>
        <p className="mt-1 text-sm text-gray-600">제목과 내용을 입력하세요.</p>

        <label className="mt-4 block">
          <div className="text-sm font-semibold text-gray-900">제목</div>
          <input
            className="mt-2 h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-gray-400"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="예) 서비스 신청은 어떻게 하나요?"
            disabled={!!busy}
            autoFocus
          />
        </label>

        <label className="mt-4 block">
          <div className="text-sm font-semibold text-gray-900">내용</div>
          <textarea
            className="mt-2 min-h-[160px] w-full resize-y rounded-xl border border-gray-200 px-3 py-3 text-sm outline-none focus:border-gray-400"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="답변 내용을 입력하세요."
            disabled={!!busy}
          />
        </label>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={!!busy}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold hover:bg-gray-50 disabled:opacity-60"
          >
            취소
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={!!busy}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-gray-900 px-4 text-sm font-semibold text-white hover:bg-black disabled:opacity-60"
          >
            {busy ? "등록 중..." : "등록"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SortableFaqRow({
  item,
  isAdmin,
  onDelete,
  openId,
  setOpenId,
}: {
  item: FaqItem;
  isAdmin: boolean;
  onDelete: (id: number) => void;
  openId: number | null;
  setOpenId: (id: number | null) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
    disabled: !isAdmin, // ✅ 관리자만 드래그
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
  };

  const isOpen = openId === item.id;

  return (
    <div ref={setNodeRef} style={style} className="rounded-2xl border border-gray-200 bg-white">
      <div className="flex items-start gap-3 p-4">
        {/* 드래그 핸들 */}
        {isAdmin ? (
          <button
            type="button"
            className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
            title="드래그해서 순서 변경"
            {...attributes}
            {...listeners}
          >
            ≡
          </button>
        ) : (
          <div className="mt-1 h-9 w-9" />
        )}

        <button
          type="button"
          onClick={() => setOpenId(isOpen ? null : item.id)}
          className="flex-1 text-left"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="text-base font-semibold text-gray-900">{item.title}</div>
            <div className="text-gray-500">{isOpen ? "▾" : "▸"}</div>
          </div>
          {isOpen && (
            <div className="mt-3 whitespace-pre-wrap text-sm text-gray-700">{item.content}</div>
          )}
        </button>

        {/* 삭제 버튼(관리자만) */}
        {isAdmin && (
          <button
            type="button"
            onClick={() => onDelete(item.id)}
            className="inline-flex h-9 items-center justify-center rounded-xl bg-rose-600 px-3 text-sm font-semibold text-white hover:bg-rose-700"
          >
            삭제
          </button>
        )}
      </div>
    </div>
  );
}

export default function FaqPage() {
  const { data: session, status } = useSession();
  const isAdmin = status === "authenticated" && (session as any)?.user?.role === "admin";
  const accessToken: string | null =
    status === "authenticated" ? ((session as any)?.accessToken ?? null) : null;

  const { data, isLoading, error } = useFaqs();
  const create = useCreateFaq({ token: isAdmin ? accessToken : null });
  const del = useDeleteFaq({ token: isAdmin ? accessToken : null });
  const reorder = useReorderFaq({ token: isAdmin ? accessToken : null });

  const [modalOpen, setModalOpen] = useState(false);
  const [openId, setOpenId] = useState<number | null>(null);

  // 화면용 정렬 리스트(드래그 즉시 반영)
  const [localItems, setLocalItems] = useState<FaqItem[] | null>(null);

  const items = useMemo(() => {
    const src = localItems ?? data ?? [];
    return [...src].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }, [data, localItems]);

  // data가 새로 오면 localItems 리셋(드래그 후 서버 반영)
  useMemo(() => {
    if (!data) return;
    setLocalItems(null);
  }, [data]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const onDelete = async (id: number) => {
    if (!isAdmin) return;
    if (!confirm("삭제할까요?")) return;
    await del.mutateAsync(id);
  };

  const onCreate = async (v: { title: string; content: string }) => {
    await create.mutateAsync(v);
    setModalOpen(false);
  };

  const onDragEnd = async (e: DragEndEvent) => {
    if (!isAdmin) return;
    const { active, over } = e;
    if (!over) return;
    if (active.id === over.id) return;

    const oldIndex = items.findIndex((x) => x.id === active.id);
    const newIndex = items.findIndex((x) => x.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const moved = arrayMove(items, oldIndex, newIndex);

    // ✅ UI 즉시 반영
    setLocalItems(
      moved.map((it, idx) => ({ ...it, sortOrder: idx + 1 }))
    );

    // ✅ 서버 저장 (id 배열만 보내기)
    await reorder.mutateAsync(moved.map((x) => x.id));
  };

  return (
    <div className="-mt-16">
      <section className="relative w-full overflow-hidden bg-[url('/images/notice.jpg')] bg-cover bg-center py-14 md:h-[400px] md:py-0">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center gap-8 px-4 md:gap-10">
          <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl">FAQ</h1>
        </div>
      </section>

      <div className="mx-auto w-full max-w-4xl space-y-6 px-4 py-10 md:py-14">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900">자주 묻는 질문</h2>
            <p className="mt-1 text-sm text-gray-600">필요한 정보를 빠르게 확인하세요.</p>
          </div>

          {/* ✅ 관리자만 등록 버튼 */}
          {isAdmin && (
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="inline-flex h-10 items-center justify-center rounded-xl bg-gray-900 px-4 text-sm font-semibold text-white hover:bg-black"
            >
              등록하기
            </button>
          )}
        </div>

        {isLoading && <div className="text-center text-gray-500">불러오는 중...</div>}

        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {(error as Error).message}
          </div>
        )}

        {!isLoading && !error && (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={items.map((x) => x.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {items.map((it) => (
                  <SortableFaqRow
                    key={it.id}
                    item={it}
                    isAdmin={isAdmin}
                    onDelete={onDelete}
                    openId={openId}
                    setOpenId={setOpenId}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      <CreateFaqModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={onCreate}
        busy={create.isPending}
      />

      <SiteFooter
        companyName="SY 컨설팅"
        infoLine="사업자등록번호 000-00-00000 | 대표 OOO | 서울시 OO구 OO로 00 | 02-000-0000 | Email: hello@sy.co.kr"
      />
    </div>
  );
}
