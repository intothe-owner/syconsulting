// app/apply/[id]/page.tsx
import Link from "next/link";
import { fetchApplyDetail, formatKST, classTypeLabel, statusLabel, statusBadgeClass } from "@/lib/applyApi";

export default async function ApplyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await fetchApplyDetail(id);
  const it = data.item;

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* 상단바 */}
      <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white/90 backdrop-blur">
        <div className="mx-auto w-full max-w-md px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/apply/list"
              className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold"
            >
              ← 목록
            </Link>

            <span
              className={[
                "inline-flex items-center rounded-full border px-2 py-1 text-[11px] font-semibold",
                statusBadgeClass(it.status),
              ].join(" ")}
            >
              {statusLabel(it.status)}
            </span>
          </div>

          <div className="mt-3">
            <p className="text-xs text-neutral-500">신청번호 #{it.id}</p>
            <h1 className="mt-1 text-lg font-semibold">
              {it.name} · {classTypeLabel(it.classType)}
            </h1>
            <p className="mt-1 text-xs text-neutral-500">
              접수 {formatKST(it.createdAt)} · 수정 {formatKST(it.updatedAt)}
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-md px-4 py-4">
        {/* 정보 카드 */}
        <section className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
          <div className="space-y-4">
            <Row label="연락처" value={it.phone} />
            <Row label="전화(숫자)" value={it.phoneDigits} />
            <Row label="주소" value={it.address || `${it.district} ${it.neighborhoodDetail}`} />
            <Row label="유입경로" value={it.howFound} />
            <Row label="개인정보 동의" value={it.privacyAgree ? "동의" : "미동의"} />
          </div>
        </section>

        {/* 지원동기 */}
        <section className="mt-3 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold">지원동기</h2>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-neutral-800">
            {it.motivation || "-"}
          </p>
        </section>

        {/* 하단 액션(예: 전화걸기) */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <a
            href={`tel:${it.phoneDigits}`}
            className="rounded-xl bg-neutral-900 px-4 py-3 text-center text-sm font-semibold text-white"
          >
            전화하기
          </a>
          <Link
            href="/apply/list"
            className="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-center text-sm font-semibold"
          >
            목록으로
          </Link>
        </div>
      </main>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <p className="shrink-0 text-xs font-semibold text-neutral-500">{label}</p>
      <p className="min-w-0 text-right text-sm text-neutral-900">{value || "-"}</p>
    </div>
  );
}
