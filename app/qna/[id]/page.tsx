"use client";

import SiteFooter from "@/components/SiteFooter";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  useDeleteQna,
  useQna,
  useVerifyQnaPassword,
  useUpdateQna, // ✅ 추가
} from "@/lib/qnaQueries";
import { toYMD } from "@/lib/api";
import { useSession } from "next-auth/react";

type PwModalMode = "edit" | "delete";

export default function QnaDetailPage() {
  const { data: session, status } = useSession();
  const isAdmin =
    status === "authenticated" && (session as any)?.user?.role === "admin";
  const accessToken: string | null =
    status === "authenticated" ? ((session as any)?.accessToken ?? null) : null;

  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  // ✅ 비밀번호 입력값과 적용값 분리(비밀글 열람용)
  const [pwInput, setPwInput] = useState("");
  const [pwApplied, setPwApplied] = useState<string | undefined>(undefined);

  // ✅ 게스트 수정/삭제용 모달
  const [pwModalOpen, setPwModalOpen] = useState(false);
  const [pwModalMode, setPwModalMode] = useState<PwModalMode>("delete");
  const [pwActionInput, setPwActionInput] = useState("");

  // ✅ 상세 호출
  const { data, isLoading, error, isFetching } = useQna(id, {
    password: pwApplied,
    token: isAdmin ? accessToken : null,
  });

  // ✅ 삭제
  const del = useDeleteQna({ token: isAdmin ? accessToken : null });

  // ✅ 비밀번호 검증
  const verify = useVerifyQnaPassword({
    token: isAdmin ? accessToken : null,
  });

  // ✅ 관리자 답변 업데이트 훅 (토큰 필요)
  const update = useUpdateQna(id, { token: isAdmin ? accessToken : null });

  // ✅ 관리자 답변 입력 상태
  const [answerDraft, setAnswerDraft] = useState("");
  const [answerMounted, setAnswerMounted] = useState(false);

  // data 로드되면 답변 초기 세팅(한 번만)
  useEffect(() => {
    if (!data || answerMounted) return;
    setAnswerDraft(data.answer ?? "");
    setAnswerMounted(true);
  }, [data, answerMounted]);

  const errMsg = (error as Error | undefined)?.message ?? "";

  // ✅ 비밀글 열람 필요(게스트만)
  const needUnlock = useMemo(() => {
    if (isAdmin) return false;
    if (!errMsg) return false;
    return (
      errMsg.includes("비밀번호") ||
      errMsg.includes("401") ||
      errMsg.includes("403") ||
      errMsg.toLowerCase().includes("unauthorized") ||
      errMsg.toLowerCase().includes("forbidden")
    );
  }, [isAdmin, errMsg]);

  const onUnlock = () => {
    const v = pwInput.trim();
    if (!v) return alert("비밀번호를 입력하세요.");
    setPwApplied(v);
  };

  // =========================
  // ✅ 수정/삭제 버튼 동작(게스트는 비번 모달)
  // =========================
  const openPwModal = (mode: PwModalMode) => {
    setPwModalMode(mode);
    setPwActionInput("");
    setPwModalOpen(true);
  };

  const onEditClick = () => {
    if (isAdmin) {
      router.push(`/qna/${id}/edit`);
      return;
    }
    openPwModal("edit");
  };

  const onDeleteClick = async () => {
    if (!confirm("삭제할까요?")) return;

    if (isAdmin) {
      await del.mutateAsync({ id });
      router.push("/qna");
      router.refresh();
      return;
    }

    openPwModal("delete");
  };

  const onConfirmPwAction = async () => {
    const pw = pwActionInput.trim();
    if (!pw) return alert("비밀번호를 입력하세요.");

    try {
      await verify.mutateAsync({ id, password: pw });

      if (pwModalMode === "edit") {
        sessionStorage.setItem(`qna_pw_${id}`, pw);
        setPwModalOpen(false);
        router.push(`/qna/${id}/edit`);
        return;
      }

      await del.mutateAsync({ id, password: pw });
      setPwModalOpen(false);
      router.push("/qna");
      router.refresh();
    } catch (e: any) {
      alert(e?.message || "비밀번호가 일치하지 않습니다.");
    }
  };

  const closePwModal = () => setPwModalOpen(false);
  const modalBusy = verify.isPending || del.isPending;

  // =========================
  // ✅ 관리자 답변 저장
  // =========================
  const onSaveAnswer = async () => {
    if (!isAdmin) return;

    // 빈 답변도 허용(답변 삭제)할 거면 trim 체크 제거하면 됨
    const v = answerDraft ?? "";
    await update.mutateAsync({
      answer: v, // ✅ 백엔드 PUT /qna/:id 로 전달
    });

    // 서버값 반영
    router.refresh();
    // 또는 react-query invalidate를 너 qnaQueries에서 하고 있다면 그 방식으로
    alert("답변이 저장되었습니다.");
  };

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

      <div className="mx-auto w-full max-w-4xl space-y-6 px-4 py-10 md:py-14">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Q&amp;A 상세</h2>
            <p className="mt-1 text-sm text-gray-600">질문 내용과 답변을 확인하세요.</p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/qna"
              className="inline-flex h-10 items-center justify-center rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-800 hover:bg-gray-50"
            >
              목록
            </Link>

            <button
              type="button"
              onClick={onEditClick}
              className="inline-flex h-10 items-center justify-center rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-800 hover:bg-gray-50"
            >
              수정
            </button>

            <button
              type="button"
              onClick={onDeleteClick}
              disabled={del.isPending}
              className="inline-flex h-10 items-center justify-center rounded-xl bg-gray-900 px-4 text-sm font-semibold text-white hover:bg-black disabled:opacity-60"
            >
              삭제
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-7">
          {(isLoading || isFetching) && (
            <div className="py-10 text-center text-gray-500">불러오는 중...</div>
          )}

          {!isLoading && error && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                {(error as Error).message}
              </div>

              {needUnlock && (
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                  <div className="text-sm font-semibold text-gray-900">비밀글 해제</div>
                  <p className="mt-1 text-sm text-gray-600">
                    비밀번호를 입력하면 내용을 확인할 수 있습니다.
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <input
                      type="password"
                      value={pwInput}
                      onChange={(e) => setPwInput(e.target.value)}
                      placeholder="비밀번호"
                      className="h-10 w-56 rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:border-gray-400"
                      onKeyDown={(e) => e.key === "Enter" && onUnlock()}
                    />
                    <button
                      type="button"
                      onClick={onUnlock}
                      className="inline-flex h-10 items-center justify-center rounded-xl bg-gray-900 px-4 text-sm font-semibold text-white hover:bg-black"
                    >
                      확인
                    </button>

                    {pwApplied && (
                      <span className="text-xs text-gray-500">적용됨: ●●●●</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {!isLoading && !error && data && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                {data.isSecret && (
                  <span className="rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs font-semibold text-gray-700">
                    🔒 비밀글
                  </span>
                )}

                {data.answered ? (
                  <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    답변완료
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                    답변대기
                  </span>
                )}

                <span className="text-xs text-gray-500">
                  {toYMD(data.createdAt)} · 조회 {Number(data.views).toLocaleString()}
                </span>
                <span className="text-xs text-gray-500">· {data.category}</span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900">{data.question}</h3>
              </div>

              {/* ✅ 답변 표시 */}
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <div className="text-sm font-bold text-gray-900">답변</div>
                <div className="mt-2 whitespace-pre-wrap text-sm text-gray-800">
                  {data.answer?.trim() ? data.answer : "아직 답변이 등록되지 않았습니다."}
                </div>
              </div>

              {/* ✅ 관리자 답변 입력 영역 */}
              {isAdmin && (
                <div className="rounded-2xl border border-gray-200 bg-white p-4">
                  <div className="text-sm font-bold text-gray-900">관리자 답변 입력</div>
                  <textarea
                    className="mt-2 min-h-[140px] w-full resize-y rounded-xl border border-gray-200 px-3 py-3 text-sm outline-none focus:border-gray-400"
                    value={answerDraft}
                    onChange={(e) => setAnswerDraft(e.target.value)}
                    placeholder="답변을 입력하세요"
                  />

                  {update.error && (
                    <p className="mt-2 text-sm text-red-600">
                      {(update.error as Error).message}
                    </p>
                  )}

                  <div className="mt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={onSaveAnswer}
                      disabled={update.isPending}
                      className="inline-flex h-10 items-center justify-center rounded-xl bg-gray-900 px-4 text-sm font-semibold text-white hover:bg-black disabled:opacity-60"
                    >
                      {update.isPending ? "저장 중..." : "답변달기"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ✅ 게스트 비밀번호 입력 모달 */}
      {pwModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closePwModal();
          }}
        >
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
            <div className="text-lg font-bold text-gray-900">
              {pwModalMode === "edit" ? "수정" : "삭제"} 비밀번호 입력
            </div>
            <p className="mt-1 text-sm text-gray-600">
              {pwModalMode === "edit"
                ? "수정하려면 글 작성 시 입력한 비밀번호가 필요합니다."
                : "삭제하려면 글 작성 시 입력한 비밀번호가 필요합니다."}
            </p>

            <input
              type="password"
              value={pwActionInput}
              onChange={(e) => setPwActionInput(e.target.value)}
              placeholder="비밀번호"
              className="mt-4 h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-gray-400"
              autoFocus
              disabled={modalBusy}
              onKeyDown={(e) => e.key === "Enter" && onConfirmPwAction()}
            />

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={closePwModal}
                disabled={modalBusy}
                className="inline-flex h-10 items-center justify-center rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-800 hover:bg-gray-50 disabled:opacity-60"
              >
                취소
              </button>
              <button
                type="button"
                onClick={onConfirmPwAction}
                disabled={modalBusy}
                className="inline-flex h-10 items-center justify-center rounded-xl bg-gray-900 px-4 text-sm font-semibold text-white hover:bg-black disabled:opacity-60"
              >
                {modalBusy ? "확인 중..." : "확인"}
              </button>
            </div>
          </div>
        </div>
      )}

      <SiteFooter
        companyName="SY 컨설팅"
        infoLine="사업자등록번호 000-00-00000 | 대표 OOO | 서울시 OO구 OO로 00 | 02-000-0000 | Email: hello@sy.co.kr"
      />
    </div>
  );
}
