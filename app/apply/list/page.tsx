// app/apply/list/page.tsx
import ApplyListClient from "./ApplyListClient";
import { fetchApplyList } from "@/lib/applyApi";

type SearchParams = {
  page?: string;
  q?: string;
  classType?: string;
  status?: string;
  district?: string;
  order?: "new" | "old";
};

export default async function ApplyListPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;

  const page = Math.max(1, Number(sp.page ?? 1));
  const q = (sp.q ?? "").trim();
  const classType = (sp.classType ?? "").trim();
  const status = (sp.status ?? "").trim();
  const district = (sp.district ?? "").trim();
  const order = (sp.order ?? "new") as "new" | "old";

  const data = await fetchApplyList({
    page,
    pageSize: 20,
    q: q || undefined,
    classType: classType || undefined,
    status: status || undefined,
    district: district || undefined,
    order,
  });

  // key를 주면 검색조건이 바뀌었을 때 클라이언트 상태가 깔끔히 초기화됨
  const key = [page, q, classType, status, district, order].join("|");

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* 상단바(모바일 느낌) */}
      <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white/90 backdrop-blur">
        <div className="mx-auto w-full max-w-md px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-base font-semibold">수강신청 목록</h1>
            <span className="text-xs text-neutral-500">총 {data.total}건</span>
          </div>

          {/* 검색/필터 */}
          <form className="mt-3 space-y-2" action="/apply/list" method="GET">
            <input type="hidden" name="page" value="1" />
            <div className="flex gap-2">
              <input
                name="q"
                defaultValue={q}
                placeholder="이름/전화/주소 검색"
                className="flex-1 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200"
              />
              <button
                type="submit"
                className="rounded-xl bg-neutral-900 px-4 py-3 text-sm font-semibold text-white"
              >
                검색
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <select
                name="classType"
                defaultValue={classType}
                className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-3 text-sm outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200"
              >
                <option value="">수업 전체</option>
                <option value="AI">AI</option>
                <option value="CODING">CODING</option>
              </select>

              <select
                name="status"
                defaultValue={status}
                className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-3 text-sm outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200"
              >
                <option value="">상태 전체</option>
                <option value="NEW">신규</option>
                <option value="CONTACTED">연락완료</option>
                <option value="DONE">처리완료</option>
                <option value="CANCELLED">취소</option>
              </select>

              <input
                name="district"
                defaultValue={district}
                placeholder="구/군(예: 해운대구)"
                className="col-span-2 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200"
              />

              <select
                name="order"
                defaultValue={order}
                className="col-span-2 w-full rounded-xl border border-neutral-200 bg-white px-3 py-3 text-sm outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200"
              >
                <option value="new">최신순</option>
                <option value="old">오래된순</option>
              </select>
            </div>
          </form>
        </div>
      </header>

      <main className="mx-auto w-full max-w-md px-4 py-4">
        <ApplyListClient key={key} initialData={data} />
      </main>
    </div>
  );
}
