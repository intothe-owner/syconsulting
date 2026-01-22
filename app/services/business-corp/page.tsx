"use client";

import ServiceTabsBar, { ServiceTabItem } from "@/components/ServiceTabsBar";
import SiteFooter from "@/components/SiteFooter";
import { motion, Variants } from "framer-motion";
import React from "react";
import {
  BriefcaseBusiness,
  Building2,
  ShieldCheck,
  TrendingUp,
  Users,
  FileText,
  ClipboardList,
  CheckCircle2,
  Layers3,
  Scale,
  Receipt,
  CalendarCheck,
  Sparkles,
  Waypoints,
  BadgeCheck,
  PieChart,
  HandCoins,
} from "lucide-react";

const TABS: ServiceTabItem[] = [
  { label: "사업자·법인 컨설팅", href: "/services/business-corp" },
  { label: "금융소득·자산 컨설팅", href: "/services/finance-asset" },
  { label: "상속·증여 컨설팅", href: "/services/inheritance-gift" },
  { label: "부동산 세금 컨설팅", href: "/services/realestate-tax" },
  { label: "세무대행(선택)", href: "/services/tax-outsourcing" },
];

// ✅ 섹션 단위(타이틀/본문 묶음) 등장 + 내부 아이템 stagger
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

// ✅ 작은 아이콘 배지
function IconBadge({
  children,
  tone = "blue",
}: {
  children: React.ReactNode;
  tone?: "blue" | "emerald" | "slate";
}) {
  const toneClass =
    tone === "emerald"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
      : tone === "slate"
      ? "bg-slate-100 text-slate-700 ring-slate-200"
      : "bg-blue-50 text-blue-700 ring-blue-100";

  return (
    <span
      className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ring-1 ${toneClass}`}
      aria-hidden="true"
    >
      {children}
    </span>
  );
}

// ✅ 섹션 제목 + 아이콘
function SectionTitle({
  eyebrow,
  title,
  desc,
  icon,
}: {
  eyebrow?: string;
  title: string;
  desc?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-start gap-3">
        {icon ? <div className="mt-0.5">{icon}</div> : null}
        <div className="min-w-0">
          {eyebrow ? (
            <p className="text-sm font-semibold tracking-wide text-blue-600">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="text-xl font-extrabold tracking-tight text-slate-900 md:text-2xl">
            <span className="text-blue-800">{title}</span>
          </h2>
        </div>
      </div>

      {desc ? (
        <p className="max-w-3xl text-sm leading-relaxed text-slate-600 md:text-base">
          {desc}
        </p>
      ) : null}
    </div>
  );
}

// ✅ “내용을 그대로 묘사하지 않는” 개념 이미지 패널(아이콘 그리드)
// - 이미지 파일 없이도 “보여주는” 역할을 함
type VisualItem = {
  icon: React.ReactNode;
  label: string; // 짧게
  hint?: string; // 더 짧게(선택)
  tone?: "blue" | "emerald" | "slate";
};

function VisualPanel({
  title,
  items,
}: {
  title?: string;
  items: VisualItem[];
}) {
  return (
    <motion.div
      variants={sectionChild}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      {title ? (
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-blue-700" />
          <p className="text-sm font-extrabold text-slate-900">{title}</p>
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4"
          >
            <IconBadge tone={it.tone ?? "blue"}>{it.icon}</IconBadge>
            <div className="min-w-0">
              <p className="text-sm font-extrabold text-slate-900">{it.label}</p>
              {it.hint ? (
                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                  {it.hint}
                </p>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function Card({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      variants={sectionChild}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="mb-3 flex items-center gap-3">
        {icon ? <div>{icon}</div> : null}
        <div className="text-base font-extrabold tracking-tight text-slate-900">
          <span>{title}</span>
        </div>
      </div>
      <div className="text-sm leading-relaxed text-slate-600">{children}</div>
    </motion.div>
  );
}

// ✅ 섹션 공통 래퍼: 스크롤 진입 시 애니메이션 실행
function RevealSection({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      variants={sectionWrap}
      initial="hidden"
      whileInView="show"
      viewport={{
        once: true,
        amount: 0.18,
      }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

export default function Business() {
  return (
    <div className="-mt-16">
      <section className="relative w-full overflow-hidden bg-[url('/images/about.jpg')] bg-cover bg-center py-14 md:h-[400px] md:py-0">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center gap-8 px-4 md:gap-10">
          <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
            사업자·법인 컨설팅
          </h1>
          <ServiceTabsBar items={TABS} mobileCols={2} />
        </div>
      </section>

      {/* ✅ 컨텐츠 */}
      <div className="mx-auto w-full max-w-6xl space-y-10 px-4 py-10 md:py-14">
        {/* 1) 소개 */}
        <RevealSection className="space-y-4">
          {/* ✅ “설명 이미지(아이콘 패널)” 먼저: 내용을 그림으로 묘사X, 개념만 보여줌 */}
          <VisualPanel
            title="컨설팅이 다루는 핵심 축"
            items={[
              {
                tone: "blue",
                icon: <Building2 className="h-5 w-5" />,
                label: "구조 설계",
                hint: "개인/법인·보수·자금흐름",
              },
              {
                tone: "slate",
                icon: <Receipt className="h-5 w-5" />,
                label: "세무·재무",
                hint: "신고·증빙·손익 구조",
              },
              {
                tone: "emerald",
                icon: <ShieldCheck className="h-5 w-5" />,
                label: "리스크 관리",
                hint: "계약·인건비·운영 규칙",
              },
              {
                tone: "blue",
                icon: <TrendingUp className="h-5 w-5" />,
                label: "성장 로드맵",
                hint: "KPI·예산·패키지 구성",
              },
            ]}
          />

          <RevealSection className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <motion.div variants={sectionChild}>
              <SectionTitle
                eyebrow="Overview"
                title="사업의 시작부터 성장, 리스크 관리까지 한 번에 정리합니다"
                desc="사업자 형태(개인/법인) 선택, 세무·재무 구조, 운영 리스크, 성장 로드맵을 한 흐름으로 점검하고 ‘실행 가능한’ 의사결정을 돕는 컨설팅입니다."
                icon={
                  <IconBadge tone="blue">
                    <BriefcaseBusiness className="h-5 w-5" />
                  </IconBadge>
                }
              />
            </motion.div>

            <motion.div
              variants={sectionChild}
              className="mt-6 grid gap-4 md:grid-cols-3"
            >
              <div className="rounded-2xl bg-slate-50 p-5">
                <div className="flex items-center gap-3">
                  <IconBadge tone="emerald">
                    <TrendingUp className="h-5 w-5" />
                  </IconBadge>
                  <p className="text-sm font-extrabold text-slate-900">핵심 목표</p>
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  구조 최적화 + 리스크 최소화 + 성장 전략 정렬
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <div className="flex items-center gap-3">
                  <IconBadge tone="blue">
                    <Waypoints className="h-5 w-5" />
                  </IconBadge>
                  <p className="text-sm font-extrabold text-slate-900">컨설팅 방식</p>
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  현황 진단 → 설계 → 실행 가이드 → 사후 점검(옵션)
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <div className="flex items-center gap-3">
                  <IconBadge tone="slate">
                    <FileText className="h-5 w-5" />
                  </IconBadge>
                  <p className="text-sm font-extrabold text-slate-900">산출물</p>
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  요약 리포트 + 체크리스트 + 실행 플랜(단계별)
                </p>
              </div>
            </motion.div>
          </RevealSection>
        </RevealSection>

        {/* 2) 이런 분께 추천 */}
        <RevealSection className="space-y-4">
          {/* ✅ 추천 대상 “설명 이미지” */}
          <VisualPanel
            title="이 컨설팅이 잘 맞는 상황"
            items={[
              {
                tone: "blue",
                icon: <Building2 className="h-5 w-5" />,
                label: "전환 고민",
                hint: "개인 → 법인",
              },
              {
                tone: "emerald",
                icon: <ShieldCheck className="h-5 w-5" />,
                label: "리스크 불안",
                hint: "증빙·인건비·계약",
              },
              {
                tone: "blue",
                icon: <PieChart className="h-5 w-5" />,
                label: "체계 부족",
                hint: "원가·마진·KPI",
              },
              {
                tone: "slate",
                icon: <Scale className="h-5 w-5" />,
                label: "갈등 이슈",
                hint: "지분·룰·보상",
              },
            ]}
          />

          <motion.div variants={sectionChild}>
            <SectionTitle
              eyebrow="Who"
              title="이런 분께 추천합니다"
              desc="현재 상태에 따라 ‘지금 해야 할 1~2가지’를 명확히 잡는 것이 가장 빠릅니다."
              icon={
                <IconBadge tone="blue">
                  <Users className="h-5 w-5" />
                </IconBadge>
              }
            />
          </motion.div>

          <motion.div variants={sectionChild} className="grid gap-5 md:grid-cols-2">
            <Card
              title="개인사업자에서 법인 전환을 고민 중"
              icon={
                <IconBadge tone="blue">
                  <Building2 className="h-5 w-5" />
                </IconBadge>
              }
            >
              매출 규모, 인건비/외주 비중, 대표자 급여·배당, 투자·대출 계획을 함께 고려해
              전환 시점과 방식(현물출자/포괄양수도 등) 방향을 잡습니다.
            </Card>

            <Card
              title="세무 리스크가 걱정될 때"
              icon={
                <IconBadge tone="emerald">
                  <ShieldCheck className="h-5 w-5" />
                </IconBadge>
              }
            >
              증빙/계약/인건비/차량·접대비 등 빈번한 이슈를 체크리스트로 점검하고,
              운영 습관을 표준화합니다.
            </Card>

            <Card
              title="사업이 커졌는데 체계가 따라오지 않을 때"
              icon={
                <IconBadge tone="blue">
                  <TrendingUp className="h-5 w-5" />
                </IconBadge>
              }
            >
              매출/원가/마진 구조를 재정렬하고, KPI와 예산(월/분기) 기준을 잡아
              의사결정 속도를 높입니다.
            </Card>

            <Card
              title="공동창업/지분/임원 구성으로 갈등이 생길 때"
              icon={
                <IconBadge tone="slate">
                  <Scale className="h-5 w-5" />
                </IconBadge>
              }
            >
              지분·보상·의사결정(주주총회/이사회) 룰을 정리하고,
              분쟁 리스크를 예방하는 문서화 포인트를 제시합니다.
            </Card>
          </motion.div>
        </RevealSection>

        {/* 3) 제공 범위 */}
        <RevealSection className="space-y-4">
          {/* ✅ 제공 범위 “설명 이미지” */}
          <VisualPanel
            title="모듈형 구성(필요한 것만 선택)"
            items={[
              {
                tone: "blue",
                icon: <Layers3 className="h-5 w-5" />,
                label: "구조",
                hint: "형태·보수·흐름",
              },
              {
                tone: "slate",
                icon: <Receipt className="h-5 w-5" />,
                label: "진단",
                hint: "신고·장부·증빙",
              },
              {
                tone: "emerald",
                icon: <ShieldCheck className="h-5 w-5" />,
                label: "리스크",
                hint: "계약·인건비",
              },
              {
                tone: "blue",
                icon: <TrendingUp className="h-5 w-5" />,
                label: "성장",
                hint: "KPI·예산",
              },
            ]}
          />

          <motion.div variants={sectionChild}>
            <SectionTitle
              eyebrow="Scope"
              title="컨설팅 제공 범위"
              desc="필요한 것만 묶어서 진행할 수 있도록 모듈형으로 제공합니다."
              icon={
                <IconBadge tone="blue">
                  <Layers3 className="h-5 w-5" />
                </IconBadge>
              }
            />
          </motion.div>

          <motion.div variants={sectionChild} className="grid gap-5 md:grid-cols-3">
            <Card
              title="사업 형태·구조 설계"
              icon={
                <IconBadge tone="blue">
                  <Building2 className="h-5 w-5" />
                </IconBadge>
              }
            >
              개인/법인 선택, 대표자 보수 구조(급여·배당), 가족 참여 구조,
              자금 흐름(계좌/카드/증빙) 정리
            </Card>

            <Card
              title="세무·재무 진단"
              icon={
                <IconBadge tone="slate">
                  <Receipt className="h-5 w-5" />
                </IconBadge>
              }
            >
              신고/장부/증빙 상태 점검, 비용처리 기준 정리,
              원가·마진·손익 구조 리빌딩
            </Card>

            <Card
              title="운영 리스크 관리"
              icon={
                <IconBadge tone="emerald">
                  <ShieldCheck className="h-5 w-5" />
                </IconBadge>
              }
            >
              계약서·거래 구조 점검, 인건비/외주/4대보험 이슈 체크,
              리스크 체크리스트 제공
            </Card>

            <Card
              title="성장 로드맵"
              icon={
                <IconBadge tone="blue">
                  <TrendingUp className="h-5 w-5" />
                </IconBadge>
              }
            >
              가격·패키지·서비스 구성 정리, 목표 매출 설계,
              월간 KPI/예산 운영 가이드
            </Card>

            <Card
              title="법인 전환(선택)"
              icon={
                <IconBadge tone="slate">
                  <Scale className="h-5 w-5" />
                </IconBadge>
              }
            >
              전환 타이밍, 절차/서류/세무 포인트,
              전환 후 운영 룰(급여·배당·비용) 정리
            </Card>

            <Card
              title="사후 점검(선택)"
              icon={
                <IconBadge tone="emerald">
                  <CalendarCheck className="h-5 w-5" />
                </IconBadge>
              }
            >
              실행 후 1~2회 점검 미팅,
              운영 체크리스트 기반 보완 포인트 정리
            </Card>
          </motion.div>
        </RevealSection>

        {/* 4) 진행 프로세스 */}
        <RevealSection className="space-y-4">
          {/* ✅ 프로세스 “설명 이미지” */}
          <VisualPanel
            title="한눈에 보는 진행 흐름"
            items={[
              {
                tone: "slate",
                icon: <ClipboardList className="h-5 w-5" />,
                label: "진단",
                hint: "목표·현황",
              },
              {
                tone: "blue",
                icon: <Layers3 className="h-5 w-5" />,
                label: "설계",
                hint: "선택지 비교",
              },
              {
                tone: "emerald",
                icon: <BadgeCheck className="h-5 w-5" />,
                label: "적용",
                hint: "체크리스트",
              },
              {
                tone: "emerald",
                icon: <CalendarCheck className="h-5 w-5" />,
                label: "점검",
                hint: "보완·다음액션",
              },
            ]}
          />

          <motion.div variants={sectionChild}>
            <SectionTitle
              eyebrow="Process"
              title="진행 프로세스"
              desc="복잡한 문제를 ‘우선순위’로 단순화한 뒤 실행 단위로 쪼갭니다."
              icon={
                <IconBadge tone="blue">
                  <Waypoints className="h-5 w-5" />
                </IconBadge>
              }
            />
          </motion.div>

          <motion.div variants={sectionChild} className="grid gap-5 md:grid-cols-4">
            <Card
              title="1) 사전 진단"
              icon={
                <IconBadge tone="slate">
                  <ClipboardList className="h-5 w-5" />
                </IconBadge>
              }
            >
              목표/현황 파악, 자료 요청, 핵심 이슈(3개 내) 정의
            </Card>

            <Card
              title="2) 분석·설계"
              icon={
                <IconBadge tone="blue">
                  <Layers3 className="h-5 w-5" />
                </IconBadge>
              }
            >
              구조/리스크/개선안 정리, 선택지별 장단점 비교
            </Card>

            <Card
              title="3) 실행 가이드"
              icon={
                <IconBadge tone="emerald">
                  <CheckCircle2 className="h-5 w-5" />
                </IconBadge>
              }
            >
              바로 적용 가능한 체크리스트·운영 규칙 제공
            </Card>

            <Card
              title="4) 점검(옵션)"
              icon={
                <IconBadge tone="emerald">
                  <CalendarCheck className="h-5 w-5" />
                </IconBadge>
              }
            >
              적용 결과 확인, 누락/리스크 보완, 다음 액션 확정
            </Card>
          </motion.div>
        </RevealSection>

        {/* 5) 준비 자료 */}
        <RevealSection className="space-y-4">
          {/* ✅ 준비 자료 “설명 이미지” */}
          <VisualPanel
            title="준비하면 좋은 자료 카테고리"
            items={[
              {
                tone: "slate",
                icon: <FileText className="h-5 w-5" />,
                label: "기본 문서",
                hint: "등록·등기",
              },
              {
                tone: "blue",
                icon: <HandCoins className="h-5 w-5" />,
                label: "매출 자료",
                hint: "신고·정산",
              },
              {
                tone: "slate",
                icon: <Receipt className="h-5 w-5" />,
                label: "비용 내역",
                hint: "인건비·임차료",
              },
              {
                tone: "emerald",
                icon: <ShieldCheck className="h-5 w-5" />,
                label: "계약/리스크",
                hint: "거래·외주",
              },
            ]}
          />

          <motion.div variants={sectionChild}>
            <SectionTitle
              eyebrow="Checklist"
              title="준비 자료"
              desc="가능한 범위에서 준비하시면 되고, 없으면 ‘현재 기준’으로 시작해도 됩니다."
              icon={
                <IconBadge tone="blue">
                  <ClipboardList className="h-5 w-5" />
                </IconBadge>
              }
            />
          </motion.div>

          <motion.div variants={sectionChild} className="grid gap-5 md:grid-cols-2">
            <Card
              title="기본 자료"
              icon={
                <IconBadge tone="slate">
                  <FileText className="h-5 w-5" />
                </IconBadge>
              }
            >
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>사업자등록/법인등기(해당 시)</li>
                <li>최근 1년 매출 자료(부가세 신고/카드·현금영수증 등)</li>
                <li>주요 비용 내역(인건비/외주/임차료/차량 등)</li>
                <li>주요 계약서(거래처/외주/임대차 등)</li>
              </ul>
            </Card>

            <Card
              title="있으면 더 좋은 자료"
              icon={
                <IconBadge tone="emerald">
                  <BadgeCheck className="h-5 w-5" />
                </IconBadge>
              }
            >
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>월별 손익/원가 자료(없으면 추정으로 구성)</li>
                <li>정산/견적/서비스 패키지 자료</li>
                <li>대표자 개인 자금 계획(투자·대출·가족 지원 등)</li>
                <li>팀 조직도/업무 분장</li>
              </ul>
            </Card>
          </motion.div>
        </RevealSection>
      </div>

      <SiteFooter companyName="SY 컨설팅" />
    </div>
  );
}
