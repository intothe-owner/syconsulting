import { apiFetch } from "./api";

const BASE_PATH = "/qna"; // ✅ 백엔드 경로가 다르면 여기만 바꾸면 됨

export type QnaListItem = {
  id: number;
  question: string;
  category: string;
  views: number;
  answered: boolean;
  isSecret: boolean;
  date: string | Date;
};

export type QnaListResponse = {
  items: QnaListItem[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type QnaDetail = {
  id: number;
  question: string;
  category: string;
  answer: string | null;
  views: number;
  answered: boolean;
  isSecret: boolean;
  createdAt: string;
  updatedAt: string;
};
export type UpdateQnaBody = {
  category?: string;
  question?: string;
  isSecret?: boolean;
  password?: string;
  newPassword?: string;

  // ✅ 관리자 답변
  answer?: string;
};
export function getQnas(params: { page: number; pageSize: number; q?: string }) {
  const qs = new URLSearchParams({
    page: String(params.page),
    pageSize: String(params.pageSize),
    ...(params.q ? { q: params.q } : {}),
  });
  return apiFetch<QnaListResponse>(`${BASE_PATH}?${qs.toString()}`);
}

// ✅ 상세: 게스트는 비밀글일 때만 x-qna-password,
// ✅ 관리자는 Bearer 토큰으로 바로 열람되게 token 전달
export function getQna(id: number, opts?: { password?: string; token?: string | null }) {
  const password = opts?.password;
  const token = opts?.token ?? null;
  return apiFetch<QnaDetail>(`${BASE_PATH}/${id}`, {
    token,
    headers: password ? { "x-qna-password": password } : {},
  });
}

export function createQna(body: {
  category: string;
  question: string;
  isSecret: boolean;
  password?: string;
  captchaVerified: boolean;
}) {
  return apiFetch(`${BASE_PATH}`, { method: "POST", body: JSON.stringify(body) });
}

// ✅ 수정/삭제는 관리자 전용으로 가는 구조(토큰 필수)
export function updateQna(
  id: number,
  body: {
    category?: string;
    question?: string;
    isSecret?: boolean;
    password?: string;
    newPassword?: string;
  },
  opts?: { token?: string | null }
) {
  return apiFetch(`${BASE_PATH}/${id}`, {
    method: "PUT",
    token: opts?.token ?? null,
    body: JSON.stringify(body),
  });
}

export function deleteQna(
  id: number,
  body?: { password?: string },
  opts?: { token?: string | null }
) {
  return apiFetch(`${BASE_PATH}/${id}`, {
    method: "DELETE",
    token: opts?.token ?? null,
    body: JSON.stringify(body ?? {}),
  });
}
export function verifyQnaPassword(
  id: number,
  password: string,
  opts?: { token?: string | null }
) {
  return apiFetch<{ ok: boolean }>(`${BASE_PATH}/${id}/verify`, {
    method: "POST",
    token: opts?.token ?? null,
    body: JSON.stringify({ password }),
  });
}