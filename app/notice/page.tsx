"use client";

import SiteFooter from "@/components/SiteFooter";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useDeleteNotice, useNotices } from "@/lib/noticeQueries";
import { toYMD } from "@/lib/api";

export default function Notice() {
  const { data: session, status } = useSession();
  const isAdmin =
    status === "authenticated" && (session as any)?.user?.role === "admin";
  const token = (session as any)?.accessToken as string | undefined;

  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const pageSize = 10;

  const { data, isLoading, error } = useNotices({ page, pageSize, q: q.trim() || undefined });
  const del = useDeleteNotice(token ?? null);

  const items = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;

  // (선택) 관리자 체크박스 UI - 지금은 단일 삭제만, 체크는 UI만 유지
  const [selected, setSelected] = useState<Record<number, boolean>>({});
  const allChecked = useMemo(() => items.length > 0 && items.every((n) => selected[n.id]), [items, selected]);

  const toggleAll = () => {
    const next: Record<number, boolean> = {};
    if (!allChecked) items.forEach((n) => (next[n.id] = true));
    setSelected(next);
  };
  const toggleOne = (id: number) => setSelected((p) => ({ ...p, [id]: !p[id] }));

  const onDelete = async (id: number) => {
    if (!isAdmin) return;
    if (!confirm("삭제할까요?")) return;
    await del.mutateAsync(id);
  };

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

      <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-10 md:py-14">
        {/* 상단 바 */}
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900">공지 목록</h2>
            <p className="mt-1 text-sm text-gray-600">중요 안내사항을 확인하세요.</p>
          </div>

          <div className="flex items-center gap-2">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="제목 검색"
              className="h-10 w-52 rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-gray-400"
            />
            <button
              onClick={() => setPage(1)}
              className="inline-flex h-10 items-center justify-center rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-800 hover:bg-gray-50"
            >
              검색
            </button>

            {isAdmin && (
              <Link
                href="/notice/new"
                className="inline-flex h-10 items-center justify-center rounded-xl bg-gray-900 px-4 text-sm font-semibold text-white hover:bg-black"
              >
                글쓰기
              </Link>
            )}
          </div>
        </div>

        {/* 테이블 */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-gray-50 text-gray-700">
                <tr className="[&>th]:px-4 [&>th]:py-3">
                  {isAdmin && (
                    <th className="w-[52px]">
                      <input
                        type="checkbox"
                        checked={allChecked}
                        onChange={toggleAll}
                        className="h-4 w-4 rounded border-gray-300"
                        aria-label="전체 선택"
                      />
                    </th>
                  )}
                  <th className="min-w-[360px]">제목</th>
                  <th className="w-[140px]">날짜</th>
                  <th className="w-[120px] text-right">조회수</th>
                  {isAdmin && <th className="w-[180px] text-right">관리</th>}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {isLoading && (
                  <tr>
                    <td colSpan={isAdmin ? 5 : 3} className="px-4 py-10 text-center text-gray-500">
                      불러오는 중...
                    </td>
                  </tr>
                )}

                {!isLoading && error && (
                  <tr>
                    <td colSpan={isAdmin ? 5 : 3} className="px-4 py-10 text-center text-red-600">
                      {(error as Error).message}
                    </td>
                  </tr>
                )}

                {!isLoading &&
                  !error &&
                  items.map((n) => (
                    <tr key={n.id} className="hover:bg-gray-50 [&>td]:px-4 [&>td]:py-3">
                      {isAdmin && (
                        <td className="w-[52px]">
                          <input
                            type="checkbox"
                            checked={!!selected[n.id]}
                            onChange={() => toggleOne(n.id)}
                            className="h-4 w-4 rounded border-gray-300"
                          />
                        </td>
                      )}

                      <td className="font-medium text-gray-900">
                        <Link href={`/notice/${n.id}`} className="line-clamp-1 hover:underline">
                          {n.title}
                        </Link>
                      </td>

                      <td className="text-gray-700">{toYMD(n.date)}</td>

                      <td className="text-right tabular-nums text-gray-700">
                        {Number(n.views).toLocaleString()}
                      </td>

                      {isAdmin && (
                        <td className="text-right">
                          <div className="inline-flex items-center gap-2">
                            <Link
                              href={`/notice/${n.id}/edit`}
                              className="inline-flex h-9 items-center justify-center rounded-xl border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-800 hover:bg-gray-50"
                            >
                              수정
                            </Link>
                            <button
                              type="button"
                              onClick={() => onDelete(n.id)}
                              disabled={del.isPending}
                              className="inline-flex h-9 items-center justify-center rounded-xl border border-gray-200 bg-white px-3 text-xs font-semibold text-red-600 hover:bg-gray-50 disabled:opacity-60"
                            >
                              삭제
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}

                {!isLoading && !error && items.length === 0 && (
                  <tr>
                    <td colSpan={isAdmin ? 5 : 3} className="px-4 py-12 text-center text-gray-500">
                      등록된 공지사항이 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* 페이지네이션 */}
          <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 text-sm text-gray-600">
            <div>
              페이지 {page} / {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <button
                className="h-9 rounded-xl border border-gray-200 bg-white px-3 text-sm font-semibold hover:bg-gray-50 disabled:opacity-50"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                이전
              </button>
              <button
                className="h-9 rounded-xl border border-gray-200 bg-white px-3 text-sm font-semibold hover:bg-gray-50 disabled:opacity-50"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                다음
              </button>
            </div>
          </div>
        </div>
      </div>

      <SiteFooter
        companyName="SY 컨설팅"
      />
    </div>
  );
}
