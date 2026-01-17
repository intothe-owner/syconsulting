"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useDeleteNotice, useNotice } from "@/lib/noticeQueries";
import { toYMD } from "@/lib/api";
import SiteFooter from "@/components/SiteFooter";

export default function NoticeDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  const { data: session, status } = useSession();
  const isAdmin =
    status === "authenticated" && (session as any)?.user?.role === "admin";
  const token = (session as any)?.accessToken as string | undefined;

  const { data, isLoading, error } = useNotice(id);
  const del = useDeleteNotice(token ?? null);

  const onDelete = async () => {
    if (!isAdmin) return;
    if (!confirm("삭제할까요?")) return;
    await del.mutateAsync(id);
    router.push("/notice");
    router.refresh();
  };

  if (isLoading) {
    return <div className="mx-auto max-w-3xl px-4 py-16 text-gray-500">불러오는 중...</div>;
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-red-600">
        {(error as Error).message}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-xl font-bold text-gray-900">게시글 없음</h1>
        <Link href="/notice" className="mt-6 inline-flex h-10 items-center rounded-xl border px-4">
          목록으로
        </Link>
      </div>
    );
  }

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
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{data.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600">
            <span>날짜: {toYMD(data.createdAt)}</span>
            <span>조회수: {Number(data.views).toLocaleString()}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/notice"
            className="inline-flex h-10 items-center justify-center rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-800 hover:bg-gray-50"
          >
            목록
          </Link>

          {isAdmin && (
            <>
              <Link
                href={`/notice/${id}/edit`}
                className="inline-flex h-10 items-center justify-center rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-800 hover:bg-gray-50"
              >
                수정
              </Link>
              <button
                onClick={onDelete}
                disabled={del.isPending}
                className="inline-flex h-10 items-center justify-center rounded-xl bg-red-600 px-4 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                삭제
              </button>
            </>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
        <pre className="whitespace-pre-wrap break-words text-sm leading-relaxed text-gray-800">
          {data.content}
        </pre>
      </div>
    </div>
    <SiteFooter
            companyName="SY 컨설팅"
            infoLine="사업자등록번호 000-00-00000 | 대표 OOO | 서울시 OO구 OO로 00 | 02-000-0000 | Email: hello@sy.co.kr"
          />
    </div>
  );
}
