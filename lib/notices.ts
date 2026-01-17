import { apiFetch } from "./api";

export type NoticeListItem = {
  id: number;
  title: string;
  views: number;
  date: string | Date; // backend: createdAt를 date로 내려줌
};

export type NoticeListResponse = {
  items: NoticeListItem[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type NoticeDetail = {
  id: number;
  title: string;
  content: string;
  views: number;
  createdAt: string;
  updatedAt: string;
};

export function getNotices(params: { page: number; pageSize: number; q?: string }) {
  const qs = new URLSearchParams({
    page: String(params.page),
    pageSize: String(params.pageSize),
    ...(params.q ? { q: params.q } : {}),
  });
  return apiFetch<NoticeListResponse>(`/notices?${qs.toString()}`);
}

export function getNotice(id: number) {
  return apiFetch<NoticeDetail>(`/notices/${id}`);
}

export function createNotice(body: { title: string; content: string }, token: string) {
  return apiFetch(`/notices`, { method: "POST", body: JSON.stringify(body), token });
}

export function updateNotice(
  id: number,
  body: { title: string; content: string },
  token: string
) {
  return apiFetch(`/notices/${id}`, { method: "PUT", body: JSON.stringify(body), token });
}

export function deleteNotice(id: number, token: string) {
  return apiFetch(`/notices/${id}`, { method: "DELETE", token });
}
