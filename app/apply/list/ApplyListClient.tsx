"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { ApplyItem, ApplyListResponse, ApplyStatus } from "@/lib/applyApi";
import {
  classTypeLabel,
  formatKST,
  statusBadgeClass,
  statusLabel,
} from "@/lib/applyApi";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8080";
const STATUS_OPTIONS: ApplyStatus[] = ["NEW", "CONTACTED", "DONE", "CANCELLED"];

export default function ApplyListClient({ initialData }: { initialData: ApplyListResponse }) {
  const router = useRouter();
  const sp = useSearchParams();

  const [items, setItems] = useState<ApplyItem[]>(initialData.items);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [busy, setBusy] = useState(false);

  // 일괄 상태 선택값
  const [bulkStatus, setBulkStatus] = useState<ApplyStatus>("CONTACTED");

  useEffect(() => {
    setItems(initialData.items);
    setSelected(new Set());
  }, [initialData.items]);

  const selectedIds = useMemo(() => Array.from(selected), [selected]);
  const isAllChecked = items.length > 0 && selected.size === items.length;

  const page = initialData.page;
  const totalPages = initialData.totalPages || 1;

  const makeHref = (next: Record<string, string>) => {
    const params = new URLSearchParams(sp.toString());
    Object.entries(next).forEach(([k, v]) => params.set(k, v));
    return `/apply/list?${params.toString()}`;
  };

  const toggleOne = (id: number) => {
    setSelected((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  };

  const toggleAll = () => {
    setSelected(isAllChecked ? new Set() : new Set(items.map((x) => x.id)));
  };

  // ✅ 개별 삭제
  const deleteOne = async (id: number) => {
    if (!confirm("이 신청을 삭제할까요?")) return;
    setBusy(true);
    try {
      const r = await fetch(`${API_BASE}/apply/${id}`, { method: "DELETE" });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data?.message || "삭제 실패");

      setItems((prev) => prev.filter((x) => x.id !== id));
      setSelected((prev) => {
        const n = new Set(prev);
        n.delete(id);
        return n;
      });

      router.refresh();
    } catch (e: any) {
      alert(e?.message || "삭제 중 오류");
    } finally {
      setBusy(false);
    }
  };

  // ✅ 일괄 삭제 (POST /apply/bulk-delete)
  const deleteSelected = async () => {
    if (!selectedIds.length) return;
    if (!confirm(`선택한 ${selectedIds.length}건을 삭제할까요?`)) return;

    setBusy(true);
    try {
      const r = await fetch(`${API_BASE}/apply/bulk-delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data?.message || "일괄 삭제 실패");

      setItems((prev) => prev.filter((x) => !selected.has(x.id)));
      setSelected(new Set());
      router.refresh();
    } catch (e: any) {
      alert(e?.message || "일괄 삭제 중 오류");
    } finally {
      setBusy(false);
    }
  };

  // ✅ 개별 상태 변경
  const changeStatusOne = async (id: number, status: ApplyStatus) => {
    setBusy(true);
    try {
      // UI 먼저 반영(체감 빠르게)
      setItems((prev) => prev.map((x) => (x.id === id ? { ...x, status } : x)));

      const r = await fetch(`${API_BASE}/apply/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data?.message || "상태 변경 실패");

      router.refresh();
    } catch (e: any) {
      alert(e?.message || "상태 변경 중 오류");
      router.refresh(); // 실패 시 서버 상태로 복구
    } finally {
      setBusy(false);
    }
  };

  // ✅ 일괄 상태 변경 (PATCH /apply/bulk-status)
  const changeStatusSelected = async () => {
    if (!selectedIds.length) return;
    if (!confirm(`선택한 ${selectedIds.length}건의 상태를 "${statusLabel(bulkStatus)}"로 변경할까요?`))
      return;

    setBusy(true);
    try {
      // UI 먼저 반영
      setItems((prev) =>
        prev.map((x) => (selected.has(x.id) ? { ...x, status: bulkStatus } : x))
      );

      const r = await fetch(`${API_BASE}/apply/bulk-status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds, status: bulkStatus }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data?.message || "일괄 상태 변경 실패");

      setSelected(new Set());
      router.refresh();
    } catch (e: any) {
      alert(e?.message || "일괄 상태 변경 중 오류");
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      {/* ✅ 상단 액션바 (모바일) */}
      <div className="mb-3 rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isAllChecked}
              onChange={toggleAll}
              className="h-4 w-4 accent-neutral-900"
            />
            <span className="font-semibold">전체 선택</span>
            <span className="text-xs text-neutral-500">({selectedIds.length}개)</span>
          </label>

          <button
            type="button"
            onClick={deleteSelected}
            disabled={busy || selectedIds.length === 0}
            className="rounded-xl bg-red-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
          >
            선택 삭제
          </button>
        </div>

        {/* ✅ 일괄 상태변경 */}
        <div className="mt-3 flex items-center gap-2">
          <select
            value={bulkStatus}
            onChange={(e) => setBulkStatus(e.target.value as ApplyStatus)}
            className="flex-1 rounded-xl border border-neutral-200 bg-white px-3 py-3 text-sm outline-none"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {statusLabel(s)}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={changeStatusSelected}
            disabled={busy || selectedIds.length === 0}
            className="rounded-xl bg-neutral-900 px-3 py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            선택 상태변경
          </button>
        </div>

        <p className="mt-2 text-[11px] text-neutral-500">
          {busy ? "처리중..." : selectedIds.length ? `${selectedIds.length}건 선택됨` : "선택 없음"}
        </p>
      </div>

      {/* ✅ 카드 리스트 */}
      <div className="space-y-3">
        {items.map((it) => {
          const checked = selected.has(it.id);

          return (
            <div key={it.id} className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
              <div className="flex items-start gap-3">
                {/* 체크 */}
                <div className="pt-1">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleOne(it.id)}
                    className="h-4 w-4 accent-neutral-900"
                  />
                </div>

                {/* 본문(상세 링크) */}
                <Link href={`/apply/${it.id}`} className="flex-1 min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {it.name} <span className="text-neutral-400">·</span>{" "}
                    <span className="font-medium text-neutral-700">
                      {classTypeLabel(it.classType)}
                    </span>
                  </p>

                  <p className="mt-1 text-xs text-neutral-600">{it.phone}</p>
                  <p className="mt-1 line-clamp-1 text-xs text-neutral-600">
                    {it.address || `${it.district} ${it.neighborhoodDetail}`}
                  </p>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-neutral-500">유입: {it.howFound}</span>
                    <span className="text-xs text-neutral-500">{formatKST(it.createdAt)}</span>
                  </div>
                </Link>

                {/* 상태 변경 + 삭제 */}
                <div className="flex flex-col items-end gap-2">
                  <div
                    className={[
                      "rounded-full border px-2 py-1 text-[11px] font-semibold",
                      statusBadgeClass(it.status),
                    ].join(" ")}
                  >
                    <select
                      value={it.status}
                      onChange={(e) => changeStatusOne(it.id, e.target.value as ApplyStatus)}
                      disabled={busy}
                      className="bg-transparent text-[11px] font-semibold outline-none"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {statusLabel(s)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={() => deleteOne(it.id)}
                    disabled={busy}
                    className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 disabled:opacity-50"
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {items.length === 0 ? (
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-center text-sm text-neutral-600">
            조회 결과가 없습니다.
          </div>
        ) : null}
      </div>

      {/* 페이지네이션 */}
      <div className="sticky bottom-3 mt-6">
        <div className="rounded-2xl border border-neutral-200 bg-white/95 p-3 shadow-sm backdrop-blur">
          <div className="flex items-center justify-between">
            <Link
              href={makeHref({ page: String(Math.max(1, page - 1)) })}
              aria-disabled={page <= 1}
              className={[
                "rounded-xl px-4 py-2 text-sm font-semibold",
                page <= 1
                  ? "pointer-events-none bg-neutral-100 text-neutral-400"
                  : "bg-neutral-900 text-white",
              ].join(" ")}
            >
              이전
            </Link>

            <div className="text-center">
              <p className="text-sm font-semibold">
                {page} / {totalPages}
              </p>
              <p className="text-[11px] text-neutral-500">
                {initialData.total}건 · 페이지당 {initialData.pageSize}건
              </p>
            </div>

            <Link
              href={makeHref({ page: String(Math.min(totalPages, page + 1)) })}
              aria-disabled={page >= totalPages}
              className={[
                "rounded-xl px-4 py-2 text-sm font-semibold",
                page >= totalPages
                  ? "pointer-events-none bg-neutral-100 text-neutral-400"
                  : "bg-neutral-900 text-white",
              ].join(" ")}
            >
              다음
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
