export type QnaItem = {
  id: number;
  question: string;
  answer?: string;
  category: string;
  date: string;
  views: number;
  answered: boolean;

  // ✅ 추가
  isSecret?: boolean;
  passwordHash?: string; // 비밀번호 해시(평문 저장 X)
};

const KEY = "qna_items_v1";

const SEED: QnaItem[] = [
  {
    id: 1,
    question: "서비스 진행 프로세스는 어떻게 되나요?",
    answer:
      "상담 접수 → 사전 진단(자료 요청) → 방향성 제안 → 실행안/계약 → 진행/리뷰 순서로 진행됩니다.",
    category: "이용안내",
    date: "2026-01-10T09:00:00.000Z",
    views: 128,
    answered: true,
    isSecret:false,
  },
  {
    id: 2,
    question: "컨설팅 계약 기간과 해지 조건이 궁금합니다.",
    answer:
      "기본 계약 기간은 프로젝트 범위에 따라 다르며, 중도 해지 시 진행 구간에 따른 정산 기준을 적용합니다.",
    category: "계약/정책",
    date: "2026-01-09T09:00:00.000Z",
    views: 74,
    answered: true,
    isSecret:true,
  },
  {
    id: 3,
    question: "비용 산정 기준(견적)은 어떤 항목으로 구성되나요?",
    answer: "",
    category: "요금/결제",
    date: "2026-01-08T09:00:00.000Z",
    views: 91,
    answered: false,
    isSecret:false,
  },
];

function safeParse<T>(v: string | null): T | null {
  if (!v) return null;
  try {
    return JSON.parse(v) as T;
  } catch {
    return null;
  }
}

export function ensureSeed() {
  if (typeof window === "undefined") return;
  const cur = safeParse<QnaItem[]>(localStorage.getItem(KEY));
  if (!cur || cur.length === 0) {
    localStorage.setItem(KEY, JSON.stringify(SEED));
  }
}

export function getQnaList(): QnaItem[] {
  if (typeof window === "undefined") return SEED;
  ensureSeed();
  return safeParse<QnaItem[]>(localStorage.getItem(KEY)) ?? SEED;
}

export function getQnaById(id: number): QnaItem | undefined {
  const list = getQnaList();
  return list.find((x) => x.id === id);
}

export function upsertQna(item: QnaItem) {
  if (typeof window === "undefined") return;
  const list = getQnaList();
  const idx = list.findIndex((x) => x.id === item.id);
  if (idx >= 0) list[idx] = item;
  else list.unshift(item);
  localStorage.setItem(KEY, JSON.stringify(list));
}

export async function createQna(data: {
  category: string;
  question: string;
  answer?: string;
  isSecret: boolean;
  password?: string; // 입력받고 해시해서 저장
}) {
  const list = getQnaList();
  const nextId = Math.max(0, ...list.map((x) => x.id)) + 1;

  const answered = !!data.answer?.trim();
  const passwordHash =
    data.isSecret && data.password?.trim()
      ? await hashPassword(data.password.trim())
      : undefined;

  if (data.isSecret && !passwordHash) {
    throw new Error("비밀글은 비밀번호가 필요합니다.");
  }

  const item: QnaItem = {
    id: nextId,
    question: data.question.trim(),
    answer: data.answer?.trim() ?? "",
    category: data.category.trim() || "기타",
    date: new Date().toISOString(),
    views: 0,
    answered,

    isSecret: data.isSecret,
    passwordHash,
  };

  list.unshift(item);
  localStorage.setItem(KEY, JSON.stringify(list));
  return item;
}

// export function createQna(data: Omit<QnaItem, "id" | "date" | "views" | "answered">) {
//   if (typeof window === "undefined") return;
//   const list = getQnaList();
//   const nextId = Math.max(0, ...list.map((x) => x.id)) + 1;

//   const answered = !!data.answer?.trim();
//   const item: QnaItem = {
//     id: nextId,
//     question: data.question.trim(),
//     answer: data.answer?.trim() ?? "",
//     category: data.category.trim() || "기타",
//     date: new Date().toISOString(),
//     views: 0,
//     answered,
//   };

//   list.unshift(item);
//   localStorage.setItem(KEY, JSON.stringify(list));
//   return item;
// }

export function increaseView(id: number) {
  if (typeof window === "undefined") return;
  const list = getQnaList();
  const idx = list.findIndex((x) => x.id === id);
  if (idx < 0) return;
  list[idx] = { ...list[idx], views: (list[idx].views ?? 0) + 1 };
  localStorage.setItem(KEY, JSON.stringify(list));
}
export async function hashPassword(pw: string) {
  const enc = new TextEncoder().encode(pw);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}