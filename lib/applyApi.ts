// lib/applyApi.ts
export type ApplyStatus = "NEW" | "CONTACTED" | "DONE" | "CANCELLED";
export type ApplyClassType = "AI" | "CODING";

export type ApplyItem = {
  id: number;
  classType: ApplyClassType;
  name: string;
  phone: string;
  phoneDigits: string;
  district: string;
  neighborhoodDetail: string;
  address: string;
  howFound: string;
  motivation?: string;
  status: ApplyStatus;
  privacyAgree: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ApplyListResponse = {
  ok: boolean;
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  items: ApplyItem[];
};

export type ApplyDetailResponse = {
  ok: boolean;
  item: ApplyItem;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ||
  process.env.API_BASE ||
  "http://localhost:8080";

export function buildApplyListUrl(params: {
  page?: number;
  pageSize?: number;
  q?: string;
  classType?: string;
  status?: string;
  district?: string;
  order?: "new" | "old";
  from?: string; // YYYY-MM-DD
  to?: string; // YYYY-MM-DD
}) {
  const sp = new URLSearchParams();
  if (params.page) sp.set("page", String(params.page));
  if (params.pageSize) sp.set("pageSize", String(params.pageSize));
  if (params.q) sp.set("q", params.q);
  if (params.classType) sp.set("classType", params.classType);
  if (params.status) sp.set("status", params.status);
  if (params.district) sp.set("district", params.district);
  if (params.order) sp.set("order", params.order);
  if (params.from) sp.set("from", params.from);
  if (params.to) sp.set("to", params.to);

  const qs = sp.toString();
  return `${API_BASE}/apply${qs ? `?${qs}` : ""}`;
}

export async function fetchApplyList(params: Parameters<typeof buildApplyListUrl>[0]) {
  const url = buildApplyListUrl(params);
  const r = await fetch(url, { cache: "no-store" });
  const data = (await r.json().catch(() => null)) as ApplyListResponse | null;
  if (!r.ok || !data?.ok) throw new Error((data as any)?.message || "목록 조회 실패");
  return data;
}

export async function fetchApplyDetail(id: string | number) {
  const r = await fetch(`${API_BASE}/apply/${id}`, { cache: "no-store" });
  const data = (await r.json().catch(() => null)) as ApplyDetailResponse | null;
  if (!r.ok || !data?.ok) throw new Error((data as any)?.message || "상세 조회 실패");
  return data;
}

export function formatKST(iso: string) {
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat("ko-KR", {
      timeZone: "Asia/Seoul",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    return iso;
  }
}

export function classTypeLabel(v: ApplyClassType) {
  return v === "AI" ? "AI 수업" : "코딩 수업";
}

export function statusLabel(v: ApplyStatus) {
  switch (v) {
    case "NEW":
      return "신규";
    case "CONTACTED":
      return "연락완료";
    case "DONE":
      return "처리완료";
    case "CANCELLED":
      return "취소";
  }
}

export function statusBadgeClass(v: ApplyStatus) {
  switch (v) {
    case "NEW":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "CONTACTED":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "DONE":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "CANCELLED":
      return "bg-neutral-100 text-neutral-700 border-neutral-200";
  }
}
