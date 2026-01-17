"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import SimpleCaptcha from "@/components/SimpleCaptcha";
import { useCreateQna } from "@/lib/qnaQueries";

export default function QnaNewPage() {
  const router = useRouter();
  const create = useCreateQna();

  const [category, setCategory] = useState("이용안내");
  const [question, setQuestion] = useState("");
  const [isSecret, setIsSecret] = useState(false);

  // ✅ 비밀번호는 항상 필수
  const [password, setPassword] = useState("");

  const [captchaOk, setCaptchaOk] = useState(false);

  const canSubmit = useMemo(() => {
    if (question.trim().length < 2) return false;
    if (password.trim().length < 2) return false; // ✅ 항상 필수
    if (!captchaOk) return false;
    return true;
  }, [question, password, captchaOk]);

  const onSubmit = async () => {
    await create.mutateAsync({
      category,
      question: question.trim(),
      isSecret,
      password: password.trim(), // ✅ 항상 전송 (undefined 금지)
      captchaVerified: captchaOk,
    });
    router.push("/qna");
    router.refresh();
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

      <div className="mx-auto w-full max-w-3xl px-4 py-10 md:py-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Q&amp;A 글쓰기</h1>
            <p className="mt-2 text-sm text-gray-600">질문을 입력하세요.</p>
          </div>
          <Link
            href="/qna"
            className="inline-flex h-10 items-center rounded-xl border px-4 text-sm font-semibold"
          >
            목록
          </Link>
        </div>

        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 md:p-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <label className="md:col-span-1">
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

            <div className="md:col-span-2 flex items-end">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isSecret}
                  onChange={(e) => setIsSecret(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <span className="text-sm font-semibold text-gray-900">비밀글</span>
              </label>
            </div>
          </div>

          {/* ✅ 비밀번호 입력은 항상 노출 */}
          <label className="block">
            <div className="text-sm font-semibold text-gray-900">
              비밀번호 <span className="text-red-500">*</span>
            </div>
            <input
              type="password"
              className="mt-2 h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-gray-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="수정/삭제에 사용할 비밀번호(필수)"
              autoComplete="new-password"
            />
            <p className="mt-1 text-xs text-gray-500">
              비밀글 여부와 관계없이 수정/삭제 확인에 사용됩니다.
            </p>
          </label>

          <label className="block">
            <div className="text-sm font-semibold text-gray-900">질문</div>
            <textarea
              className="mt-2 min-h-[180px] w-full resize-y rounded-xl border border-gray-200 px-3 py-3 text-sm outline-none focus:border-gray-400"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="질문 내용을 입력하세요"
            />
          </label>

          <SimpleCaptcha onValidChange={setCaptchaOk} />

          {create.error && (
            <p className="text-sm text-red-600">{(create.error as Error).message}</p>
          )}

          <div className="flex justify-end gap-2">
            <Link
              href="/qna"
              className="inline-flex h-10 items-center justify-center rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold"
            >
              취소
            </Link>
            <button
              disabled={!canSubmit || create.isPending}
              onClick={onSubmit}
              className="inline-flex h-10 items-center justify-center rounded-xl bg-gray-900 px-4 text-sm font-semibold text-white hover:bg-black disabled:opacity-50"
            >
              {create.isPending ? "등록 중..." : "등록"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
