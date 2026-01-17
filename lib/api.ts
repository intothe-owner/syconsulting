const BASE = process.env.NEXT_PUBLIC_API_BASE;

type FetchOptions = RequestInit & {
  token?: string | null;
};

export async function apiFetch<T>(path: string, opts: FetchOptions = {}): Promise<T> {
  if (!BASE) throw new Error("NEXT_PUBLIC_API_BASE is not set");

  const { token, headers, ...rest } = opts;

  const r = await fetch(`${BASE}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers || {}),
    },
  });

  const text = await r.text();
  const data = text ? JSON.parse(text) : null;

  if (!r.ok) {
    throw new Error(data?.message || `Request failed (${r.status})`);
  }
  return data as T;
}

export function toYMD(d?: string | Date | null) {
  if (!d) return "-";

  const dt = typeof d === "string" ? new Date(d) : d;

  if (!(dt instanceof Date) || Number.isNaN(dt.getTime())) return "-";

  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  const day = String(dt.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
