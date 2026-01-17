import { apiFetch } from "./api";

export type FaqItem = {
  id: number;
  title: string;
  content: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export function getFaqs() {
  return apiFetch<FaqItem[]>(`/faq`, { method: "GET" });
}

export function createFaq(body: { title: string; content: string }, opts?: { token?: string | null }) {
  return apiFetch<FaqItem>(`/faq`, {
    method: "POST",
    token: opts?.token ?? null,
    body: JSON.stringify(body),
  });
}

export function deleteFaq(id: number, opts?: { token?: string | null }) {
  return apiFetch<{ ok: true }>(`/faq/${id}`, {
    method: "DELETE",
    token: opts?.token ?? null,
  });
}

export function reorderFaq(ids: number[], opts?: { token?: string | null }) {
  return apiFetch<{ ok: true }>(`/faq/reorder`, {
    method: "PUT",
    token: opts?.token ?? null,
    body: JSON.stringify({ ids }),
  });
}
