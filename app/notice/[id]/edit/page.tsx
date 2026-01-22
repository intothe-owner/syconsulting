"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useNotice, useUpdateNotice } from "@/lib/noticeQueries";
import SiteFooter from "@/components/SiteFooter";

export default function NoticeEditPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  const { data: session, status } = useSession();
  const isAdmin =
    status === "authenticated" && (session as any)?.user?.role === "admin";
  const token = (session as any)?.accessToken as string | undefined;

  const { data, isLoading, error } = useNotice(id);
  const update = useUpdateNotice(id, token ?? null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (!data) return;
    setTitle(data.title);
    setContent(data.content);
  }, [data]);

  const canSave = useMemo(
    () => title.trim().length >= 2 && content.trim().length >= 5,
    [title, content]
  );

  const onSave = async () => {
    await update.mutateAsync({ title: title.trim(), content: content.trim() });
    router.push(`/notice/${id}`);
    router.refresh();
  };

  if (status === "loading") return null;

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-xl font-bold text-gray-900">접근 불가</h1>
        <p className="mt-2 text-sm text-gray-600">관리자만 수정할 수 있습니다.</p>
        <Link href={`/notice/${id}`} className="mt-6 inline-flex h-10 items-center rounded-xl border px-4">
          돌아가기
        </Link>
      </div>
    );
  }

  if (isLoading) return <div className="mx-auto max-w-3xl px-4 py-16 text-gray-500">불러오는 중...</div>;
  if (error) return <div className="mx-auto max-w-3xl px-4 py-16 text-red-600">{(error as Error).message}</div>;
  if (!data) return null;

  return (
    <div className="-mt-16">
    <section className="relative w-full overflow-hidden bg-[url('/images/notice.jpg')] bg-cover bg-center py-14 md:h-[400px] md:py-0">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center gap-8 px-4 md:gap-10">
          <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
            공지사항
          </h1>
        </div>
      </section>
    <div className="mx-auto w-full max-w-3xl px-4 py-10 md:py-14">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">공지사항 수정</h1>
          <p className="mt-2 text-sm text-gray-600">제목과 내용을 수정하세요.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/notice/${id}`} className="inline-flex h-10 items-center rounded-xl border px-4 text-sm font-semibold">
            상세
          </Link>
          <Link href="/notice" className="inline-flex h-10 items-center rounded-xl border px-4 text-sm font-semibold">
            목록
          </Link>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
        <label className="block text-sm font-semibold text-gray-900">제목</label>
        <input
          className="mt-2 h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-gray-400"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label className="mt-6 block text-sm font-semibold text-gray-900">내용</label>
        <textarea
          className="mt-2 min-h-[240px] w-full resize-y rounded-xl border border-gray-200 px-3 py-3 text-sm outline-none focus:border-gray-400"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {update.error && (
          <p className="mt-3 text-sm text-red-600">{(update.error as Error).message}</p>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <Link
            href={`/notice/${id}`}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold"
          >
            취소
          </Link>
          <button
            disabled={!canSave || update.isPending}
            onClick={onSave}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-gray-900 px-4 text-sm font-semibold text-white hover:bg-black disabled:opacity-50"
          >
            {update.isPending ? "저장 중..." : "저장"}
          </button>
        </div>
      </div>
    </div>
    <SiteFooter
                companyName="SY 컨설팅"
              />
    </div>
  );
}
