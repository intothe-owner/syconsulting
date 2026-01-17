"use client";

import SiteFooter from "@/components/SiteFooter";
import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQna, useUpdateQna } from "@/lib/qnaQueries";
import { useSession } from "next-auth/react";

export default function QnaEditPage() {
  const { data: session, status } = useSession();
  const isAdmin =
    status === "authenticated" && (session as any)?.user?.role === "admin";
  const accessToken: string | null =
    status === "authenticated" ? ((session as any)?.accessToken ?? null) : null;

  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  // ✅ 게스트 비밀번호: 상세페이지에서 검증 성공 시 sessionStorage에 저장해둔 값 사용
  const [guestPw, setGuestPw] = useState("");

  useEffect(() => {
    if (!Number.isFinite(id)) return;
    try {
      const v = sessionStorage.getItem(`qna_pw_${id}`) ?? "";
      setGuestPw(v);
    } catch {
      setGuestPw("");
    }
  }, [id]);

  // ✅ Edit 페이지에서도 상세 데이터 가져와야 폼 세팅 가능
  // - 관리자: token으로 열림
  // - 게스트: 비밀글이면 password가 필요할 수 있으니 guestPw를 함께 전달
  const { data, isLoading, error } = useQna(id, {
    token: isAdmin ? accessToken : null,
    password: !isAdmin ? (guestPw || undefined) : undefined,
  });

  const update = useUpdateQna(id, { token: isAdmin ? accessToken : null });

  // ✅ 폼 상태
  const [mounted, setMounted] = useState(false);
  const [category, setCategory] = useState("이용안내");
  const [question, setQuestion] = useState("");
  const [isSecret, setIsSecret] = useState(false);
  const [initialSecret, setInitialSecret] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  // ✅ 데이터가 있으면 최초 1회 폼 초기화
  useEffect(() => {
    if (!data || mounted) return;
    setCategory(data.category);
    setQuestion(data.question);
    setIsSecret(!!data.isSecret);
    setInitialSecret(!!data.isSecret);
    setMounted(true);
  }, [data, mounted]);

  const canSubmit = useMemo(() => {
    if (question.trim().length < 2) return false;

    // ✅ 게스트는 수정 저장 시 비밀번호가 반드시 필요
    if (!isAdmin && guestPw.trim().length < 1) return false;

    // ✅ 공개글 -> 비밀글 전환만 newPassword 필수
    if (!initialSecret && isSecret && newPassword.trim().length < 1) return false;

    return true;
  }, [question, isAdmin, guestPw, isSecret, initialSecret, newPassword]);

  const onSubmit = async () => {
    // ✅ 게스트인데 비번 없으면 저장 막기 (UI는 떠도 됨)
    if (!isAdmin && guestPw.trim().length < 1) {
      alert("비밀번호 인증이 필요합니다. 상세페이지에서 '수정' 버튼으로 다시 진행하세요.");
      router.push(`/qna/${id}`);
      return;
    }

    await update.mutateAsync({
      category,
      question: question.trim(),
      isSecret,
      password: isAdmin ? undefined : guestPw, // ✅ 게스트는 항상
      newPassword: newPassword.trim() || undefined,
    });

    router.push("/qna");
    router.refresh();
  };

  // ✅ 핵심: "비밀번호가 필요합니다" 같은 에러가 떠도 페이지 자체는 나오게
  // -> 에러는 상단에 경고로만 표시하고, 폼은 사용 가능(저장은 guestPw 없으면 막힘)
  const showDataError = !!error && !(error as any)?.message?.includes("비밀번호");

  return (
    <div className="-mt-16">
      <section className="relative w-full overflow-hidden bg-[url('/images/notice.jpg')] bg-cover bg-center py-14 md:h-[400px] md:py-0">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center gap-8 px-4 md:gap-10">
          <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
            질문과 답변 (Q&amp;A)
          </h1>
        </div>
      </section>

      <div className="mx-auto w-full max-w-3xl px-4 py-10 md:py-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Q&amp;A 수정</h1>
            <p className="mt-2 text-sm text-gray-600">
              카테고리/질문/비밀글 설정을 수정하세요.
            </p>
          </div>
          <Link
            href="/qna"
            className="inline-flex h-10 items-center rounded-xl border px-4 text-sm font-semibold"
          >
            목록
          </Link>
        </div>

        {/* ✅ 로딩 표시는 하되, 페이지는 유지 */}
        {isLoading && (
          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 text-center text-gray-500">
            불러오는 중...
          </div>
        )}

        {/* ✅ 에러가 있어도 페이지 유지 (비밀번호 관련은 아예 노출 안함) */}
        {showDataError && (
          <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {(error as Error).message}
          </div>
        )}

        {/* ✅ 게스트가 비번 없이 직접 edit에 온 경우 안내(“비밀번호가 필요합니다” 대신 안내문) */}
        {!isAdmin && !guestPw && (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            비밀번호 인증이 필요합니다. 상세 페이지에서 <b>수정</b> 버튼을 눌러 비밀번호 확인 후 들어오세요.
          </div>
        )}

        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 md:p-6 space-y-6">
          <label className="block">
            <div className="text-sm font-semibold text-gray-900">카테고리</div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-2 h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:border-gray-400"
            >
              <option>이용안내</option>
              <option>요금/결제</option>
              <option>계약/정책</option>
              <option>서류/준비</option>
              <option>기타</option>
            </select>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isSecret}
              onChange={(e) => setIsSecret(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <span className="text-sm font-semibold text-gray-900">비밀글</span>
          </label>

          {isSecret && (
            <label className="block">
              <div className="text-sm font-semibold text-gray-900">
                비밀번호(설정/변경)
              </div>
              <input
                type="password"
                className="mt-2 h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-gray-400"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={initialSecret ? "변경하려면 입력(선택)" : "비밀글로 전환하려면 필수"}
              />
            </label>
          )}

          <label className="block">
            <div className="text-sm font-semibold text-gray-900">질문</div>
            <textarea
              className="mt-2 min-h-[180px] w-full resize-y rounded-xl border border-gray-200 px-3 py-3 text-sm outline-none focus:border-gray-400"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </label>

          {update.error && (
            <p className="text-sm text-red-600">{(update.error as Error).message}</p>
          )}

          <div className="flex justify-end gap-2">
            <Link
              href="/qna"
              className="inline-flex h-10 items-center justify-center rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold"
            >
              취소
            </Link>
            <button
              disabled={!canSubmit || update.isPending}
              onClick={onSubmit}
              className="inline-flex h-10 items-center justify-center rounded-xl bg-gray-900 px-4 text-sm font-semibold text-white hover:bg-black disabled:opacity-50"
            >
              {update.isPending ? "저장 중..." : "저장"}
            </button>
          </div>
        </div>
      </div>

      <SiteFooter
        companyName="SY 컨설팅"
        infoLine="사업자등록번호 000-00-00000 | 대표 OOO | 서울시 OO구 OO로 00 | 02-000-0000 | Email: hello@sy.co.kr"
      />
    </div>
  );
}
