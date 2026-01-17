"use client";

import { motion, type Variants } from "framer-motion";

type ConsultingCard = {
  title: string;
  body: string;
};

export default function CustomConsultingSection() {
  const cards: ConsultingCard[] = [
    {
      title: "지속적인 사후관리",
      body: "컨설팅이 끝이 아닙니다.\n성과 점검·보완·피드백으로\n실행이 정착되도록 돕습니다.",
    },
    {
      title: "목표를 위한 전략 수립",
      body: "현황 진단부터 로드맵까지.\n실행 가능한 전략과\n우선순위를 설계합니다.",
    },
    {
      title: "기업목표 설정",
      body: "막연한 계획을 수치화합니다.\n핵심 KPI·기간·담당을 정해\n목표를 명확히 만듭니다.",
    },
  ];

  // ✅ 최신 framer-motion 타입 호환: ease를 string 대신 cubic-bezier 배열로
  const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

  const container: Variants = {
    hidden: { opacity: 0, y: 18 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: EASE_OUT },
    },
  };

  const titleV: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: EASE_OUT },
    },
  };

  // ✅ stagger는 부모에서 주는게 타입/동작 모두 안정적
  const cardsWrap: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.12,
      },
    },
  };

  const cardV: Variants = {
    hidden: { opacity: 0, y: 14 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: EASE_OUT },
    },
  };

  return (
    <section className="w-full">
      <motion.div
        className="relative w-full overflow-hidden bg-[url('/images/main01.jpg')] bg-cover bg-center py-14 md:h-[520px] md:py-0"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ amount: 0.35, once: false }} // 들어오면 show, 나가면 hidden으로
      >
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center text-white md:pt-16"
            variants={titleV}
          >
            <p className="text-sm font-medium tracking-wide text-white/90 sm:text-base">
              차별화 된 컨설팅으로 기업의 가치를 더하는
            </p>
            <h2 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
              SY 맞춤형 컨설팅
            </h2>
          </motion.div>

          <motion.div
            className="mt-10 grid grid-cols-1 gap-6 md:mt-16 md:grid-cols-3"
            variants={cardsWrap}
          >
            {cards.map((c) => (
              <motion.div
                key={c.title}
                variants={cardV}
                className="
                  flex flex-col rounded-lg border border-emerald-400/80 bg-black/30 p-6 backdrop-blur-sm
                  md:h-[240px] md:p-8
                "
              >
                <div className="text-2xl font-extrabold text-white md:text-3xl">
                  {c.title}
                </div>
                <div className="mt-5 whitespace-pre-line text-base font-semibold text-white/95 md:mt-8 md:text-lg">
                  {c.body}
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="hidden h-10 md:block" />
        </div>
      </motion.div>
    </section>
  );
}
