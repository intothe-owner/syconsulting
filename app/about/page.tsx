"use client";

import SiteFooter from "@/components/SiteFooter";
import { motion, Variants } from "framer-motion";
import React from "react";
import Image from "next/image";

// ✅ lucide 아이콘
import {
  DraftingCompass,
  Route,
  Handshake,
  Target,
  BadgeCheck,
  ShieldCheck,
  Sparkles,
  Eye,
  Users,
  BriefcaseBusiness,
  PiggyBank,
  Gift,
  Building2,
  FileText,
  CalendarCheck,
  Search,
  LayoutDashboard,
  ListChecks,
  RefreshCcw,
  Layers,
  FileSpreadsheet,
  SlidersHorizontal,
} from "lucide-react";

const sectionWrap: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.08,
    },
  },
};

const sectionChild: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

function SectionTitle({
  eyebrow,
  title,
  desc,
}: {
  eyebrow?: string;
  title: string;
  desc?: string;
}) {
  return (
    <div className="space-y-2">
      {eyebrow ? (
        <p className="text-sm font-semibold tracking-wide text-blue-600">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-xl font-extrabold tracking-tight text-slate-900 md:text-2xl">
        <span className="text-blue-800">{title}</span>
      </h2>
      {desc ? (
        <p className="max-w-3xl text-sm leading-relaxed text-slate-600 md:text-base">
          {desc}
        </p>
      ) : null}
    </div>
  );
}

function StatCard({
  label,
  value,
  desc,
  icon,
}: {
  label: string;
  value: string;
  desc?: string;
  icon?: React.ReactNode;
}) {
  return (
    <motion.div
      variants={sectionChild}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-600">{label}</p>
        {icon ? (
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
            {icon}
          </span>
        ) : null}
      </div>

      <p className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
        <span className="text-blue-800">{value}</span>
      </p>
      {desc ? <p className="mt-2 text-sm text-slate-600">{desc}</p> : null}
    </motion.div>
  );
}

function ValueCard({
  title,
  children,
  icon,
}: {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <motion.div
      variants={sectionChild}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="flex items-center gap-3">
        {icon ? (
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-700">
            {icon}
          </span>
        ) : null}
        <p className="text-base font-extrabold tracking-tight text-slate-900">
          <span>{title}</span>
        </p>
      </div>

      <div className="mt-3 text-sm leading-relaxed text-slate-600">
        {children}
      </div>
    </motion.div>
  );
}

function InfoImage({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  return (
    <motion.div
      variants={sectionChild}
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="relative w-full">
        {/* ✅ responsive 이미지 */}
        <Image
          src={src}
          alt={alt}
          width={1400}
          height={800}
          className="h-auto w-full"
          priority={false}
        />
      </div>
    </motion.div>
  );
}

export default function About() {
  return (
    <div className="-mt-16">
      <section className="relative w-full overflow-hidden bg-[url('/images/about.jpg')] bg-cover bg-center py-14 md:h-[400px] md:py-0">
        <div className="absolute inset-0 bg-black/30" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center gap-8 px-4 md:gap-10">
          <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
            회사소개
          </h1>
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl space-y-10 px-4 py-10 md:py-14">
        {/* 1) Intro */}
        <motion.section
          variants={sectionWrap}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.18 }}
          className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"
        >
          <motion.div variants={sectionChild} className="grid gap-6 md:grid-cols-[1fr_340px]">
            <div>
              <SectionTitle
                eyebrow="About SY Consulting"
                title="고민한 만큼 고객님의 자산은 커집니다"
                desc="SY 컨설팅은 상속·증여세, 종합소득세, 부동산 관련 세금 등 복잡한 자산 이슈를 ‘한 장의 설계도’로 정리해 드립니다. 단순한 조언이 아닌, 실행 가능한 방향과 체크리스트까지 제시해 고객님의 자산을 안전하게 지키고 키우는 길을 함께 만듭니다."
              />
            </div>

            {/* ✅ Intro에 어울리는 작은 이미지(선택) */}
            <div className="rounded-2xl bg-slate-50 p-5">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <DraftingCompass className="h-5 w-5" />
                </span>
                <p className="text-sm font-extrabold text-slate-900">한 장의 설계도</p>
              </div>
              <p className="mt-2 text-sm text-slate-600">
                복잡한 세금·자산 이슈를 구조화하고, 실행 기준까지 문서로 남깁니다.
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={sectionChild}
            className="mt-6 grid gap-4 md:grid-cols-3"
          >
            <div className="rounded-2xl bg-slate-50 p-5">
              <div className="flex items-center gap-2">
                <Route className="h-5 w-5 text-slate-600" />
                <p className="text-sm font-extrabold text-slate-900">핵심 관점</p>
              </div>
              <p className="mt-2 text-sm text-slate-600">
                세금 문제를 자산의 “전체 흐름” 속에서 함께 설계
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <div className="flex items-center gap-2">
                <BadgeCheck className="h-5 w-5 text-slate-600" />
                <p className="text-sm font-extrabold text-slate-900">컨설팅 방식</p>
              </div>
              <p className="mt-2 text-sm text-slate-600">
                진단 → 설계 → 실행 가이드 → 점검(옵션)
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <div className="flex items-center gap-2">
                <Handshake className="h-5 w-5 text-slate-600" />
                <p className="text-sm font-extrabold text-slate-900">약속</p>
              </div>
              <p className="mt-2 text-sm text-slate-600">
                고객 상황에 맞춘 맞춤 솔루션과 현실적인 실행안 제시
              </p>
            </div>
          </motion.div>
        </motion.section>

        {/* 2) Mission / Vision */}
        <motion.section
          variants={sectionWrap}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.18 }}
          className="grid gap-5 md:grid-cols-2"
        >
          <ValueCard title="미션(Mission)" icon={<Target className="h-5 w-5" />}>
            고객이 일궈온 자산의 가치를 지키기 위해, 복잡한 세금·자산 문제를
            이해하기 쉬운 구조로 정리하고 실행 가능한 해법을 제공합니다.
          </ValueCard>

          <ValueCard title="비전(Vision)" icon={<Sparkles className="h-5 w-5" />}>
            자산 컨설팅의 기준을 “성과”가 아닌 “신뢰”로 세웁니다. 한 번의 상담이
            아니라, 장기적으로 안심할 수 있는 관리 기준을 함께 만들어갑니다.
          </ValueCard>
        </motion.section>

        {/* ✅ 미션/비전과 찰떡인 “흐름도” 이미지 */}
        <motion.section
          variants={sectionWrap}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.18 }}
        >
          <InfoImage
            src="/images/sy_diagram_flow.png"
            alt="SY 컨설팅의 미션·비전·가치·전략 흐름"
          />
        </motion.section>

        {/* 3) Values */}
        <motion.section
          variants={sectionWrap}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.18 }}
          className="space-y-4"
        >
          <motion.div variants={sectionChild}>
            <SectionTitle
              eyebrow="Core Values"
              title="우리가 중요하게 생각하는 4가지"
              desc="상담의 결과가 ‘문서’로 끝나지 않고, 실제 실행으로 이어지도록 설계합니다."
            />
          </motion.div>

          <div className="grid gap-5 md:grid-cols-4">
            <ValueCard title="정확성" icon={<ShieldCheck className="h-5 w-5" />}>
              법·세무 기준을 바탕으로 근거 중심의 판단을 제공합니다.
            </ValueCard>
            <ValueCard title="현실성" icon={<ListChecks className="h-5 w-5" />}>
              당장 실행 가능한 선택지와 우선순위를 명확히 제시합니다.
            </ValueCard>
            <ValueCard title="투명성" icon={<Eye className="h-5 w-5" />}>
              장단점·리스크·예상 비용을 숨기지 않고 분명히 설명합니다.
            </ValueCard>
            <ValueCard title="동행" icon={<Users className="h-5 w-5" />}>
              고객의 상황 변화에 맞춰 점검과 조정까지 함께합니다.
            </ValueCard>
          </div>
        </motion.section>

        {/* 4) What we do */}
        <motion.section
          variants={sectionWrap}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.18 }}
          className="space-y-4"
        >
          <motion.div variants={sectionChild}>
            <SectionTitle
              eyebrow="Service"
              title="우리가 제공하는 컨설팅"
              desc="세금 이슈를 ‘한 번의 대응’이 아니라, ‘지속 가능한 구조’로 해결합니다."
            />
          </motion.div>

          <div className="grid gap-5 md:grid-cols-3">
            <ValueCard title="사업자·법인 컨설팅" icon={<BriefcaseBusiness className="h-5 w-5" />}>
              개인/법인 선택, 비용 구조, 리스크 점검, 운영 기준 정리
            </ValueCard>
            <ValueCard title="금융소득·자산 컨설팅" icon={<PiggyBank className="h-5 w-5" />}>
              자산 배분, 현금흐름 설계, 리스크·세금 구조 점검
            </ValueCard>
            <ValueCard title="상속·증여 컨설팅" icon={<Gift className="h-5 w-5" />}>
              사전 점검, 가족 단위 자산 정리, 분쟁/세금 리스크 최소화
            </ValueCard>
            <ValueCard title="부동산 세금 컨설팅" icon={<Building2 className="h-5 w-5" />}>
              보유/임대/처분 단계별 세금 이슈 정리 및 전략 설계
            </ValueCard>
            <ValueCard title="세무대행(선택)" icon={<FileText className="h-5 w-5" />}>
              신고/장부/증빙의 표준화로 운영 리스크를 줄이는 관리
            </ValueCard>
            <ValueCard title="정기 점검(선택)" icon={<CalendarCheck className="h-5 w-5" />}>
              분기/반기 단위 점검으로 실행 상태를 확인하고 조정
            </ValueCard>
          </div>
        </motion.section>

        {/* 5) Process */}
        <motion.section
          variants={sectionWrap}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.18 }}
          className="space-y-4"
        >
          <motion.div variants={sectionChild}>
            <SectionTitle
              eyebrow="Process"
              title="진행 프로세스"
              desc="현황을 정리하고, 선택지를 비교한 뒤, 실행 기준까지 만들겠습니다."
            />
          </motion.div>

          <div className="grid gap-5 md:grid-cols-4">
            <ValueCard title="1) 현황 진단" icon={<Search className="h-5 w-5" />}>
              자료 확인, 목표 설정, 핵심 이슈(3개 내) 정의
            </ValueCard>
            <ValueCard title="2) 분석·설계" icon={<LayoutDashboard className="h-5 w-5" />}>
              구조/리스크/절세 포인트 분석, 선택지별 비교
            </ValueCard>
            <ValueCard title="3) 실행 가이드" icon={<ListChecks className="h-5 w-5" />}>
              체크리스트 제공, 우선순위 기반 실행 로드맵 제시
            </ValueCard>
            <ValueCard title="4) 점검(옵션)" icon={<RefreshCcw className="h-5 w-5" />}>
              적용 결과 확인, 리스크 보완, 다음 액션 확정
            </ValueCard>
          </div>
        </motion.section>

        {/* ✅ 프로세스에 잘 맞는 “순환도” 이미지 */}
        <motion.section
          variants={sectionWrap}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.18 }}
        >
          <InfoImage
            src="/images/sy_diagram_cycle.png"
            alt="SY 컨설팅 점검·개선 순환 프로세스"
          />
        </motion.section>

        {/* 6) Stats */}
        <motion.section
          variants={sectionWrap}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.18 }}
          className="space-y-4"
        >
          <motion.div variants={sectionChild}>
            <SectionTitle
              eyebrow="At a Glance"
              title="한눈에 보는 SY 컨설팅"
              desc="아래 수치는 페이지 구성용 샘플입니다. 실제 수치/문구로 교체해 사용하세요."
            />
          </motion.div>

          <div className="grid gap-5 md:grid-cols-3">
            <StatCard
              label="컨설팅 범위"
              value="세금·자산 통합"
              desc="세무/자산을 함께 설계"
              icon={<Layers className="h-5 w-5" />}
            />
            <StatCard
              label="산출물"
              value="리포트 + 체크리스트"
              desc="실행 가능한 가이드 제공"
              icon={<FileSpreadsheet className="h-5 w-5" />}
            />
            <StatCard
              label="운영"
              value="맞춤형 설계"
              desc="고객 상황·목표 중심"
              icon={<SlidersHorizontal className="h-5 w-5" />}
            />
          </div>
        </motion.section>

        {/* ✅ 스탯에 어울리는 “성장 그래프” 이미지 */}
        <motion.section
          variants={sectionWrap}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.18 }}
        >
          <InfoImage
            src="/images/sy_diagram_growth.png"
            alt="SY 컨설팅 가치 상승 흐름"
          />
        </motion.section>

        {/* 7) Closing */}
        <motion.section
          variants={sectionWrap}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.18 }}
          className="rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-7 shadow-sm"
        >
          <motion.div variants={sectionChild} className="space-y-2">
            <p className="text-sm font-semibold tracking-wide text-blue-600">
              Promise
            </p>
            <p className="text-lg font-extrabold tracking-tight text-slate-900 md:text-xl">
              사회에 남는 것은 <span className="text-blue-800">‘성과’</span>가 아니라{" "}
              <span className="text-blue-800">‘신뢰’</span>입니다
            </p>
            <p className="text-sm text-slate-600">
              고객님의 고민을 함께 나누고, 고객님만을 위한 솔루션을 책임감 있게 제시하겠습니다.
            </p>
          </motion.div>
        </motion.section>
      </div>

      <SiteFooter companyName="SY 컨설팅" />
    </div>
  );
}
