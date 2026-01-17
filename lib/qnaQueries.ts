"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createQna, deleteQna, getQna, getQnas, updateQna, verifyQnaPassword,type UpdateQnaBody } from "./qna";

export function useQnas(params: { page: number; pageSize: number; q?: string }) {
  return useQuery({
    queryKey: ["qna", params],
    queryFn: () => getQnas(params),
  });
}

export function useQna(id: number, opts?: { password?: string; token?: string | null }) {
  const password = opts?.password;
  const token = opts?.token ?? null;

  return useQuery({
    // ✅ 비번/토큰도 캐시 키에 포함 (게스트/관리자 응답 다름)
    queryKey: ["qna", id, password ?? "", token ?? ""],
    queryFn: () => getQna(id, { password, token }),
    enabled: Number.isFinite(id) && id > 0,
  });
}

export function useCreateQna() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: {
      category: string;
      question: string;
      isSecret: boolean;
      password?: string;
      captchaVerified: boolean;
    }) => createQna(body),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["qna"] });
    },
  });
}

export function useUpdateQna(id: number, opts?: { token?: string | null }) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (body: UpdateQnaBody) =>
      updateQna(id, body, { token: opts?.token ?? null }),
    onSuccess: () => {
      // 너 프로젝트 키에 맞춰 invalidate (예시)
      qc.invalidateQueries({ queryKey: ["qna", id] });
      qc.invalidateQueries({ queryKey: ["qnas"] });
    },
  });
}

export function useDeleteQna(opts?: { token?: string | null }) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { id: number; password?: string }) =>
      deleteQna(vars.id, { password: vars.password }, { token: opts?.token ?? null }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["qna"] });
    },
  });
}
export function useVerifyQnaPassword(opts?: { token?: string | null }) {
  return useMutation({
    mutationFn: (vars: { id: number; password: string }) =>
      verifyQnaPassword(vars.id, vars.password, { token: opts?.token ?? null }),
  });
}