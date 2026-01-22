"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type SiteFooterProps = {
  companyName?: string;
  infoLine?: string;
  copyrightName?: string;
  loginHref?: string;
};

export default function SiteFooter({
  companyName = "SY 컨설팅",
  infoLine = "사업자등록번호 000-00-00000 | 대표 신동훈 | 부산광역시 부산진구 전포대로 275번길 65(전포동) | 010-4181-5082",
  copyrightName,
  loginHref,
}: SiteFooterProps) {
  const year = new Date().getFullYear();
  const owner = copyrightName ?? companyName;

  const router = useRouter();
  const { status } = useSession(); // ✅ 로그인 상태 확인
  const authed = status === "authenticated";

  // ✅ 모달/폼 상태
  const [open, setOpen] = useState(false);
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") setOpen(false);
  };

  const onLogin = async () => {
    setErr(null);
    setLoading(true);

    const res = await signIn("credentials", {
      adminId,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setErr("아이디 또는 비밀번호가 올바르지 않습니다.");
      return;
    }

    setOpen(false);
    // 필요하면 /admin으로 보내기
    router.refresh(); // 세션 반영 빠르게
    router.push("/");
  };

  const onLogout = async () => {
    // ✅ redirect false로 하면 현재 페이지 유지하면서 세션만 정리
    await signOut({ redirect: false });
    router.refresh();
  };

  return (
    <>
      <footer className="w-full border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-3 text-sm text-gray-600">
              <div className="font-semibold text-gray-900">{companyName}</div>
              <div className="leading-relaxed">{infoLine}</div>
              <div className="pt-3 text-xs text-gray-500">
                © {year}. {owner}. All rights reserved.
              </div>
            </div>

            {/* ✅ 오른쪽 아이콘: 로그인 상태면 로그아웃(열린 자물쇠) */}
            <div className="pt-1">
              {authed ? (
                <button
                  type="button"
                  aria-label="로그아웃"
                  onClick={onLogout}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50"
                  title="로그아웃"
                >
                  <UnlockIcon />
                </button>
              ) : loginHref ? (
                <Link
                  href={loginHref}
                  aria-label="관리자 로그인"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50"
                >
                  <LockIcon />
                </Link>
              ) : (
                <button
                  type="button"
                  aria-label="관리자 로그인"
                  onClick={() => {
                    setErr(null);
                    setOpen(true);
                  }}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50"
                  title="로그인"
                >
                  <LockIcon />
                </button>
              )}
            </div>
          </div>
        </div>
      </footer>

      {/* ✅ 로그인 모달: 로그아웃 상태일 때만 */}
      {!authed && open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          onKeyDown={onKeyDown}
        >
          <button
            className="absolute inset-0 bg-black/40"
            aria-label="닫기"
            onClick={() => setOpen(false)}
          />

          <div className="relative z-[101] w-[92%] max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold text-gray-900">관리자 로그인</div>
              <button
                type="button"
                aria-label="닫기"
                onClick={() => setOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100"
              >
                <XIcon />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-sm text-gray-700">아이디</label>
                <input
                  className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-gray-400"
                  placeholder="아이디"
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  autoFocus
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-700">비밀번호</label>
                <input
                  type="password"
                  className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-gray-400"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") onLogin();
                  }}
                />
              </div>

              {err && <p className="text-sm text-red-600">{err}</p>}

              <button
                type="button"
                disabled={loading}
                className="mt-2 h-11 w-full rounded-xl bg-gray-900 text-sm font-semibold text-white transition hover:bg-black disabled:opacity-60"
                onClick={onLogin}
              >
                {loading ? "로그인 중..." : "로그인"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 10V8a5 5 0 0 1 10 0v2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M6 10h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UnlockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M17 10V8a5 5 0 0 0-9.58-2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M6 10h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M18 6 6 18M6 6l12 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
