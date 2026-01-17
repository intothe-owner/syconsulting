import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFaq, deleteFaq, getFaqs, reorderFaq } from "./faq";

export const FAQ_KEYS = {
  all: ["faqs"] as const,
};

export function useFaqs() {
  return useQuery({
    queryKey: FAQ_KEYS.all,
    queryFn: getFaqs,
  });
}

export function useCreateFaq(opts?: { token?: string | null }) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { title: string; content: string }) =>
      createFaq(body, { token: opts?.token ?? null }),
    onSuccess: () => qc.invalidateQueries({ queryKey: FAQ_KEYS.all }),
  });
}

export function useDeleteFaq(opts?: { token?: string | null }) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteFaq(id, { token: opts?.token ?? null }),
    onSuccess: () => qc.invalidateQueries({ queryKey: FAQ_KEYS.all }),
  });
}

export function useReorderFaq(opts?: { token?: string | null }) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (ids: number[]) => reorderFaq(ids, { token: opts?.token ?? null }),
    onSuccess: () => qc.invalidateQueries({ queryKey: FAQ_KEYS.all }),
  });
}
