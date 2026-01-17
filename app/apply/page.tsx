"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type ClassType = "AI" | "CODING";
type HowFound =
    | "홈페이지"
    | "지인추천"
    | "인스타그램"
    | "유튜브"
    | "검색"
    | "현수막·전단"
    | "기타";

type FormState = {
    classType: ClassType | "";
    name: string;
    phone: string;

    district: string;            // ✅ 부산 구/군 선택
    neighborhoodDetail: string;  // ✅ 동/읍/면 직접 입력

    motivation: string;
    howFound: HowFound | "";
};

const ONLY_DIGITS = /[^0-9]/g;
const formatPhone = (raw: string) => {
    const digits = raw.replace(/[^0-9]/g, "").slice(0, 11);

    // 02(서울) 케이스까지 대충 대응(필요없으면 제거 가능)
    if (digits.startsWith("02")) {
        if (digits.length <= 2) return digits;
        if (digits.length <= 5) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
        if (digits.length <= 9)
            return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5)}`;
        return `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6)}`;
    }

    // 일반 휴대폰/지역번호 (3-3/4-4)
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    if (digits.length <= 11)
        return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;

    return digits;
};

export default function ApplyPage() {
    const BASE = process.env.NEXT_PUBLIC_API_BASE;
    const busanAreas = useMemo(
        () => [
            "중구",
            "서구",
            "동구",
            "영도구",
            "부산진구",
            "동래구",
            "남구",
            "북구",
            "해운대구",
            "사하구",
            "금정구",
            "강서구",
            "연제구",
            "수영구",
            "사상구",
            "기장군",
        ],
        []
    );

    const howFoundOptions: HowFound[] = useMemo(
        () => ["홈페이지", "지인추천", "인스타그램", "유튜브", "검색", "현수막·전단", "기타"],
        []
    );

    const [form, setForm] = useState<FormState>({
        classType: "",
        name: "",
        phone: "",
        district: "",
        neighborhoodDetail: "",
        motivation: "",
        howFound: "",
    });

    const [submitting, setSubmitting] = useState(false);
    const [touched, setTouched] = useState<Record<keyof FormState, boolean>>({
        classType: false,
        name: false,
        phone: false,
        district: false,
        neighborhoodDetail: false,
        motivation: false,
        howFound: false,
    });

    const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const markTouched = <K extends keyof FormState>(key: K) => {
        setTouched((prev) => ({ ...prev, [key]: true }));
    };

    const errors = useMemo(() => {
        const e: Partial<Record<keyof FormState, string>> = {};
        if (!form.classType) e.classType = "수업 종류를 선택해 주세요.";
        if (!form.name.trim()) e.name = "이름을 입력해 주세요.";
        if (!form.phone.trim()) e.phone = "연락처를 입력해 주세요.";
        else if (form.phone.replace(/[^0-9]/g, "").length < 10)
            e.phone = "연락처를 10~11자리로 입력해 주세요.";

        // ✅ 구/군은 필수
        if (!form.district) e.district = "구/군을 선택해 주세요.";

        // ✅ 동네(동/읍/면)도 필수로 하고 싶으면 아래 유지
        if (!form.neighborhoodDetail.trim())
            e.neighborhoodDetail = "동네(동/읍/면)를 입력해 주세요.";

        if (!form.motivation.trim()) e.motivation = "지원동기를 입력해 주세요.";
        if (!form.howFound) e.howFound = "알게 된 계기를 하나 선택해 주세요.";
        return e;
    }, [form]);

    const isValid = Object.keys(errors).length === 0;

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setTouched({
            classType: true,
            name: true,
            phone: true,
            district: true,
            neighborhoodDetail: true,
            motivation: true,
            howFound: true,
        });

        if (!isValid) return;

        setSubmitting(true);
        try {
            // ✅ 서버로 보낼 payload (필요하면 phoneDigits도 추가 가능)
            const payload = {
                ...form,
                phoneDigits: form.phone.replace(/[^0-9]/g, ""), // 서버에서 원하면 사용
                address: `${form.district} ${form.neighborhoodDetail}`.trim(),
            };

            const r = await fetch(`${BASE}/apply`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await r.json().catch(() => ({}));

            if (!r.ok) {
                throw new Error(data?.message || "신청 접수에 실패했습니다.");
            }

            alert("수강신청이 접수되었습니다. 곧 연락드릴게요!");

            // 제출 후 초기화
            setForm({
                classType: "",
                name: "",
                phone: "",
                district: "",
                neighborhoodDetail: "",
                motivation: "",
                howFound: "",
            });
            setTouched({
                classType: false,
                name: false,
                phone: false,
                district: false,
                neighborhoodDetail: false,
                motivation: false,
                howFound: false,
            });
        } catch (err: any) {
            alert(err?.message || "서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };


    const showErr = (key: keyof FormState) => touched[key] && errors[key];

    return (
        <div className="min-h-screen bg-white text-neutral-900">
            {/* Top bar */}
            <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white/80 backdrop-blur">
                <div className="mx-auto flex w-full max-w-3xl items-center justify-center px-4 py-4">
                    <Image
                        src="/images/unbox.png"
                        alt="UNBOX"
                        width={140}
                        height={40}
                        priority
                        className="h-8 w-auto"
                    />
                </div>
            </header>

            <main className="mx-auto w-full max-w-3xl px-4 py-10">
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm md:p-8">
                    <div className="mb-6">
                        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                            수강 신청
                        </h1>
                        <p className="mt-2 text-sm text-neutral-600">
                            아래 항목을 작성해주시면 확인 후 연락드릴게요.
                        </p>
                    </div>

                    <form onSubmit={onSubmit} className="space-y-5">
                        {/* 수업종류 */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">수업 종류</label>
                            <select
                                value={form.classType}
                                onChange={(e) => setField("classType", e.target.value as any)}
                                onBlur={() => markTouched("classType")}
                                className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200"
                            >
                                <option value="">선택해 주세요</option>
                                <option value="AI">AI 수업</option>
                                <option value="CODING">코딩 수업</option>
                            </select>
                            {showErr("classType") ? (
                                <p className="text-xs text-red-600">{errors.classType}</p>
                            ) : null}
                        </div>

                        {/* 이름 */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">이름</label>
                            <input
                                value={form.name}
                                onChange={(e) => setField("name", e.target.value)}
                                onBlur={() => markTouched("name")}
                                placeholder="예) 김OO"
                                className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200"
                            />
                            {showErr("name") ? (
                                <p className="text-xs text-red-600">{errors.name}</p>
                            ) : null}
                        </div>

                        {/* 연락처 */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">연락처</label>
                            <input
                                value={form.phone}
                                onChange={(e) => setField("phone", formatPhone(e.target.value))}
                                onBlur={() => markTouched("phone")}
                                inputMode="numeric"
                                placeholder="예: 010-1234-5678"
                                className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200"
                            />

                            {showErr("phone") ? (
                                <p className="text-xs text-red-600">{errors.phone}</p>
                            ) : (
                                <p className="text-xs text-neutral-500">
                                    하이픈 없이 숫자만 입력해 주세요.
                                </p>
                            )}
                        </div>

                        {/* ✅ 사는동네: 구/군 + 동네 입력 */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">사는 동네 (부산)</label>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {/* 구/군 */}
                                <div className="space-y-2">
                                    <select
                                        value={form.district}
                                        onChange={(e) => setField("district", e.target.value)}
                                        onBlur={() => markTouched("district")}
                                        className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200"
                                    >
                                        <option value="">구/군 선택</option>
                                        {busanAreas.map((a) => (
                                            <option key={a} value={a}>
                                                {a}
                                            </option>
                                        ))}
                                    </select>
                                    {showErr("district") ? (
                                        <p className="text-xs text-red-600">{errors.district}</p>
                                    ) : null}
                                </div>

                                {/* 동네(동/읍/면) */}
                                <div className="space-y-2">
                                    <input
                                        value={form.neighborhoodDetail}
                                        onChange={(e) => setField("neighborhoodDetail", e.target.value)}
                                        onBlur={() => markTouched("neighborhoodDetail")}
                                        placeholder="동/읍/면 입력 (예: 우동, 좌동, 명지동)"
                                        className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200"
                                    />
                                    {showErr("neighborhoodDetail") ? (
                                        <p className="text-xs text-red-600">
                                            {errors.neighborhoodDetail}
                                        </p>
                                    ) : (
                                        <p className="text-xs text-neutral-500">
                                            예) 해운대구 / 우동
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 지원동기 */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">지원동기</label>
                            <textarea
                                value={form.motivation}
                                onChange={(e) => setField("motivation", e.target.value)}
                                onBlur={() => markTouched("motivation")}
                                placeholder="수업을 듣고 싶은 이유를 간단히 적어주세요."
                                rows={5}
                                className="w-full resize-none rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200"
                            />
                            {showErr("motivation") ? (
                                <p className="text-xs text-red-600">{errors.motivation}</p>
                            ) : null}
                        </div>

                        {/* 알게 된 계기(라디오) */}
                        <div className="space-y-2">
                            <div className="flex items-end justify-between gap-2">
                                <label className="text-sm font-medium">알게 된 계기</label>
                                <span className="text-xs text-neutral-500">1개만 선택</span>
                            </div>

                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                {howFoundOptions.map((opt) => {
                                    const checked = form.howFound === opt;
                                    return (
                                        <label
                                            key={opt}
                                            className={[
                                                "flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition",
                                                checked
                                                    ? "border-neutral-400 bg-neutral-50"
                                                    : "border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50",
                                            ].join(" ")}
                                        >
                                            <input
                                                type="radio"
                                                name="howFound"
                                                value={opt}
                                                checked={checked}
                                                onChange={() => setField("howFound", opt)}
                                                onBlur={() => markTouched("howFound")}
                                                className="h-4 w-4 accent-neutral-900"
                                            />
                                            <span className="text-neutral-900">{opt}</span>
                                        </label>
                                    );
                                })}
                            </div>

                            {showErr("howFound") ? (
                                <p className="text-xs text-red-600">{errors.howFound}</p>
                            ) : null}
                        </div>

                        {/* 버튼 */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full rounded-xl bg-neutral-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {submitting ? "접수 중..." : "수강 신청하기"}
                            </button>

                            <p className="mt-3 text-center text-xs text-neutral-500">
                                제출하신 정보는 수강 안내 연락 목적 외에는 사용하지 않습니다.
                            </p>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
