"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createNotice,
  deleteNotice,
  getNotice,
  getNotices,
  updateNotice,
} from "./notices";

export function useNotices(params: { page: number; pageSize: number; q?: string }) {
  return useQuery({
    queryKey: ["notices", params],
    queryFn: () => getNotices(params),
  });
}

export function useNotice(id: number) {
  return useQuery({
    queryKey: ["notice", id],
    queryFn: () => getNotice(id),
    enabled: Number.isFinite(id) && id > 0,
  });
}

export function useCreateNotice(token: string | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { title: string; content: string }) => {
      if (!token) throw new Error("No token");
      return createNotice(body, token);
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["notices"] });
    },
  });
}

export function useUpdateNotice(id: number, token: string | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { title: string; content: string }) => {
      if (!token) throw new Error("No token");
      return updateNotice(id, body, token);
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["notices"] });
      await qc.invalidateQueries({ queryKey: ["notice", id] });
    },
  });
}

export function useDeleteNotice(token: string | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => {
      if (!token) throw new Error("No token");
      return deleteNotice(id, token);
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["notices"] });
    },
  });
}
