"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Image from "next/image";

type Section = {
  id: string;
  title: string;
  kicker?: string;
  body?: string;
  render?: () => React.ReactNode;
};

const pageWrap: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.35 } },
};

const sectionIn: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

export default function UnboxOnePage() {
  const sections: Section[] = useMemo(
    () => [
      {
        id: "hero",
        kicker: "UNBOX",
        title: "도움의 손길을 ‘선물’로 정의하고, 그 선물을 열어봅니다.",
        body: "AI 및 코딩 교육이 필요한 미래 인재를 양성하기 위한 기관, UNBOX 재단",
        render: () => (
          <motion.div variants={stagger} className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              { t: "교육 봉사", d: "지역사회 기반 AI·코딩 교육 지원" },
              { t: "미래 인재", d: "실무형 AI 활용 역량 강화" },
              { t: "격차 해소", d: "디지털 격차를 줄이는 지속가능 활동" },
            ].map((x) => (
              <motion.div
                key={x.t}
                variants={item}
                className="rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur"
              >
                <div className="text-lg font-semibold text-white">{x.t}</div>
                <div className="mt-2 text-sm leading-relaxed text-white/80">{x.d}</div>
              </motion.div>
            ))}
          </motion.div>
        ),
      },
      {
        id: "about",
        kicker: "About UNBOX",
        title: "UNBOX 재단 소개",
        body:
          "언박스 재단은 도움의 손길을 ‘선물’로 정의하고, 그 선물을 열어본다는 의미입니다. AI 및 코딩의 교육이 필요한 미래 인재를 양성하기 위한 기관입니다.",
      },
      {
        id: "purpose",
        kicker: "Purpose",
        title: "설립목적",
        render: () => (
          <motion.ul variants={stagger} className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              "국내 AI 산업의 경쟁력 강화를 위해 교육 및 활용 전문가를 육성",
              "지역사회를 대상으로 교육 관련 봉사활동을 수행",
              "디지털 격차 해소와 지역 기반 AI산업의 활성화 및 가치 창출",
            ].map((t) => (
              <motion.li
                key={t}
                variants={item}
                className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
              >
                <div className="text-base font-semibold text-zinc-900">핵심 목표</div>
                <div className="mt-3 text-sm leading-relaxed text-zinc-700">{t}</div>
              </motion.li>
            ))}
          </motion.ul>
        ),
      },
      {
        id: "biz",
        kicker: "Programs",
        title: "주요사업",
        render: () => (
          <motion.div variants={stagger} className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              "AI 활용 전문가 양성 및 교육 봉사 서비스 사업",
              "AI 산업 지역간 문화교류 및 활성화 지원 사업",
              "AI 교육 콘텐츠 플랫폼 개발 및 프로그래밍 연구, 개발 사업",
              "기타 AI 산업의 목적 달성을 위하여 필요한 사업",
            ].map((t) => (
              <motion.div
                key={t}
                variants={item}
                className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
              >
                <div className="text-sm font-semibold text-zinc-900">사업</div>
                <div className="mt-2 text-sm leading-relaxed text-zinc-700">{t}</div>
              </motion.div>
            ))}
          </motion.div>
        ),
      },
    ],
    []
  );

  const [idx, setIdx] = useState(0);
  const lockRef = useRef(false);

  // ✅ 모바일 스와이프용 refs
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const touchStartY = useRef<number | null>(null);

  // ✅ 휠 1번 = 이전/다음 섹션
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (lockRef.current) return;
      e.preventDefault();

      lockRef.current = true;
      const dir = e.deltaY > 0 ? 1 : -1;

      setIdx((prev) => {
        const next = Math.max(0, Math.min(sections.length - 1, prev + dir));
        return next;
      });

      window.setTimeout(() => (lockRef.current = false), 700);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel as any);
  }, [sections.length]);

  // ✅ 모바일 스와이프(위/아래)로 이전/다음 섹션
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const THRESHOLD = 55;

    const onTouchStart = (e: TouchEvent) => {
      if (lockRef.current) return;
      if (e.touches.length !== 1) return;
      touchStartY.current = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (touchStartY.current == null) return;
      // ✅ 스크롤/바운스 방지(이 페이지는 1-page 전환 UX)
      e.preventDefault();
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (lockRef.current) return;
      if (touchStartY.current == null) return;

      const endY = e.changedTouches?.[0]?.clientY ?? touchStartY.current;
      const dy = endY - touchStartY.current; // +면 아래로 드래그
      touchStartY.current = null;

      if (Math.abs(dy) < THRESHOLD) return;

      lockRef.current = true;
      const dir = dy < 0 ? 1 : -1; // 위로 스와이프 => 다음

      setIdx((prev) => {
        const next = Math.max(0, Math.min(sections.length - 1, prev + dir));
        return next;
      });

      window.setTimeout(() => (lockRef.current = false), 700);
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove as any);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [sections.length]);

  const cur = sections[idx];

  return (
    <div
      ref={wrapRef}
      className="relative h-screen w-screen overflow-hidden bg-zinc-950 overscroll-none touch-none"
    >
      {/* 좌측 로고 + 재단명 고정 */}
      <div className="absolute left-6 top-6 z-50 flex items-center gap-4">
        {/* 로고 */}
        <div className="pointer-events-auto relative select-none overflow-hidden rounded-2xl border border-white/10 bg-white backdrop-blur w-[84px] h-[84px]">
          <Image
            src="/images/unbox.png"
            alt="로고"
            fill
            sizes="84px"
            className="object-contain p-2"
            priority
          />
        </div>

        {/* 텍스트 */}
        <div className="pointer-events-none">
          <div className="text-2xl font-extrabold tracking-tight text-white md:text-3xl">
            언박스 재단
          </div>
          {/* <div className="mt-1 text-sm text-white/60">UNBOX Foundation</div> */}
        </div>
      </div>

      {/* 인디케이터(선택): 오른쪽 점 */}
      <div className="absolute right-6 top-1/2 z-50 -translate-y-1/2 space-y-3">
        {sections.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setIdx(i)}
            className={`block h-2.5 w-2.5 rounded-full transition ${
              i === idx ? "bg-white" : "bg-white/30 hover:bg-white/60"
            }`}
            aria-label={`${i + 1} 섹션 이동`}
          />
        ))}
      </div>

      {/* 섹션 전환 */}
      <AnimatePresence mode="wait">
        <motion.section
          key={cur.id}
          variants={pageWrap}
          initial="hidden"
          animate="show"
          exit="hidden"
          className="h-screen w-screen"
        >
          {/* 섹션별 배경(컨셉) */}
          <div
            className={`absolute inset-0 ${
              cur.id === "hero"
                ? "bg-[radial-gradient(80%_60%_at_50%_10%,rgba(255,255,255,0.14),rgba(0,0,0,0))]"
                : "bg-[radial-gradient(60%_50%_at_50%_10%,rgba(255,255,255,0.10),rgba(0,0,0,0))]"
            }`}
          />

          <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-center px-6">
            <motion.div variants={stagger} initial="hidden" animate="show">
              {cur.kicker && (
                <motion.div
                  variants={item}
                  className={`text-sm font-semibold tracking-wide ${
                    cur.id === "hero" ? "text-white/80" : "text-white/70"
                  }`}
                >
                  {cur.kicker}
                </motion.div>
              )}

              <motion.h1
                variants={sectionIn}
                className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-white md:text-5xl"
              >
                {cur.title}
              </motion.h1>

              {cur.body && (
                <motion.p
                  variants={item}
                  className="mt-5 max-w-3xl text-base leading-relaxed text-white/75 md:text-lg"
                >
                  {cur.body}
                </motion.p>
              )}

              {cur.render?.()}

              {cur.id === "hero" && (
                <motion.div variants={item} className="mt-10 text-sm text-white/60">
                  마우스 휠 또는 위/아래 스와이프로 다음 섹션 이동
                </motion.div>
              )}
            </motion.div>
          </div>
        </motion.section>
      </AnimatePresence>
    </div>
  );
}
