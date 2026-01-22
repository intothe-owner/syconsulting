"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Image from "next/image";
import { useSession } from "next-auth/react";

import GallerySection, { GalleryItem } from "@/components/GallerySection";

/** ✅ 너 백엔드 주소로 수정 */
const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8080";
const LIST_URL = `${API_BASE}/gallery`; // GET /gallery?page=1&pageSize=60 (가정)

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

/** ✅ 백엔드 응답 타입(필드명은 네 백엔드에 맞춰 수정 가능) */
type ApiGalleryItem = {
  id: string | number;
  imageUrl?: string; // 원본
  thumbUrl?: string; // 썸네일
  title?: string | null;
  alt?: string | null;
};

export default function UnboxOnePage() {
  const { data: session, status } = useSession();
  const isAdmin =
    status === "authenticated" && (session as any)?.user?.role === "admin";

  // ✅ 갤러리 스크롤 컨테이너 ref
  const galleryScrollRef = useRef<HTMLDivElement | null>(null);

  // ✅ 백엔드에서 내려받은 갤러리 목록 state
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [galleryError, setGalleryError] = useState<string | null>(null);

  // ✅ 목록 가져오기 함수
  const fetchGallery = async () => {
    setGalleryLoading(true);
    setGalleryError(null);

    try {
      const r = await fetch(`${LIST_URL}?page=1&pageSize=120`, { method: "GET" });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data?.message || "갤러리 목록 로드 실패");

      const apiItems: ApiGalleryItem[] = (data.items ?? data ?? []) as any[];

      // ✅ GallerySection이 요구하는 형태로 매핑
      const mapped: GalleryItem[] = apiItems.map((x) => ({
        id: String(x.id),
        thumbSrc: x.thumbUrl ?? x.imageUrl ?? "",
        fullSrc: x.imageUrl ?? x.thumbUrl ?? "",
        title: x.title ?? undefined,
        alt: x.alt ?? x.title ?? undefined,
      }));

      // 빈 URL 제거
      setGalleryItems(mapped.filter((m) => m.thumbSrc && m.fullSrc));
    } catch (e: any) {
      setGalleryError(e?.message ?? "갤러리 목록 로드 오류");
    } finally {
      setGalleryLoading(false);
    }
  };

  // ✅ 페이지 진입 시 1회 로드
  useEffect(() => {
    fetchGallery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sections: Section[] = useMemo(
    () => [
      {
        id: "gallery",
        kicker: "Gallery",
        title: "활동 갤러리",
        body: "UNBOX의 교육/봉사 활동 현장을 공유합니다.",
        render: () => (
          <>
            {galleryLoading && (
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
                갤러리 불러오는 중...
              </div>
            )}

            {galleryError && (
              <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-100">
                {galleryError}
                <button
                  type="button"
                  onClick={fetchGallery}
                  className="ml-3 rounded-lg border border-red-300/20 bg-black/20 px-2 py-1 text-xs text-red-50 hover:bg-black/30"
                >
                  다시 시도
                </button>
              </div>
            )}

            {/* ✅ 여기서 백엔드 목록을 GallerySection으로 전달 */}
            <GallerySection
              items={galleryItems}
              variantsItem={item}
              scrollRef={galleryScrollRef}
              pageSize={12}
              autoLoad={false} // ✅ 부모에서 로드하니까 끔
              onUploadedItems={(newItems) => {
                // ✅ 업로드 성공하면 즉시 목록에 반영(최신이 위로)
                setGalleryItems((prev) => [...newItems, ...prev]);
              }}
            />
          </>
        ),
      },
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
    [galleryItems, galleryLoading, galleryError]
  );

  const [idx, setIdx] = useState(0);
  const lockRef = useRef(false);

  const wrapRef = useRef<HTMLDivElement | null>(null);
  const touchStartY = useRef<number | null>(null);

  // ✅ 휠: 갤러리 섹션에서는 갤러리 스크롤 우선
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();

      const curSection = sections[idx];
      const isGallery = curSection?.id === "gallery";

      if (isGallery) {
        const sc = galleryScrollRef.current;
        if (sc) {
          const atTop = sc.scrollTop <= 0;
          const atBottom = sc.scrollTop + sc.clientHeight >= sc.scrollHeight - 1;
          const goingDown = e.deltaY > 0;

          if ((goingDown && !atBottom) || (!goingDown && !atTop)) {
            sc.scrollBy({ top: e.deltaY, behavior: "auto" });
            return;
          }
        }
      }

      if (lockRef.current) return;
      lockRef.current = true;

      const dir = e.deltaY > 0 ? 1 : -1;
      setIdx((prev) => Math.max(0, Math.min(sections.length - 1, prev + dir)));

      window.setTimeout(() => (lockRef.current = false), 700);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel as any);
  }, [sections, idx]);

  // ✅ 모바일 스와이프
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
      e.preventDefault();
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (lockRef.current) return;
      if (touchStartY.current == null) return;

      const endY = e.changedTouches?.[0]?.clientY ?? touchStartY.current;
      const dy = endY - touchStartY.current;
      touchStartY.current = null;

      if (Math.abs(dy) < THRESHOLD) return;

      lockRef.current = true;
      const dir = dy < 0 ? 1 : -1;

      setIdx((prev) => Math.max(0, Math.min(sections.length - 1, prev + dir)));
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
  const isGallery = cur.id === "gallery";

  return (
    <div
      ref={wrapRef}
      className="relative h-screen w-screen overflow-hidden bg-zinc-950 overscroll-none touch-none"
    >
      {/* 로고 */}
      <div className="absolute left-6 top-6 z-50 flex items-center gap-4">
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
        <div className="pointer-events-none">
          <div className="text-2xl font-extrabold tracking-tight text-white md:text-3xl">
            언박스 재단
          </div>
        </div>
      </div>

      {/* 인디케이터 */}
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

      <AnimatePresence mode="wait">
        <motion.section
          key={cur.id}
          variants={pageWrap}
          initial="hidden"
          animate="show"
          exit="hidden"
          className="h-screen w-screen"
        >
          <div
            className={`absolute inset-0 ${
              cur.id === "hero"
                ? "bg-[radial-gradient(80%_60%_at_50%_10%,rgba(255,255,255,0.14),rgba(0,0,0,0))]"
                : "bg-[radial-gradient(60%_50%_at_50%_10%,rgba(255,255,255,0.10),rgba(0,0,0,0))]"
            }`}
          />

          <div
            className={[
              "relative mx-auto h-full max-w-6xl px-6",
              isGallery
                ? "flex flex-col justify-start pt-[120px] pb-10"
                : "flex flex-col justify-center",
            ].join(" ")}
          >
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
                  className="mt-4 max-w-3xl text-base leading-relaxed text-white/75 md:text-lg"
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
