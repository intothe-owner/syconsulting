"use client";

import ServiceTabsBar, { ServiceTabItem } from "@/components/ServiceTabsBar";
import SiteFooter from "@/components/SiteFooter";
import { motion, Variants } from "framer-motion";
import React from "react";
import {
  Sparkles,
  Home,
  KeyRound,
  Building2,
  Receipt,
  FileText,
  ClipboardList,
  CalendarCheck,
  ShieldCheck,
  LineChart,
  Scale,
  Wallet,
  HandCoins,
  Waypoints,
  Percent,
  Landmark,
  ScrollText,
  BadgeCheck,
  ArrowUpRight,
  ArrowDownRight,
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

// ✅ “설명 이미지” 역할(아이콘 그리드 패널)
type VisualItem = {
  icon: React.ReactNode;
  label: string;
  hint?: string;
  tone?: "blue" | "emerald" | "slate";
};

function VisualPanel({ title, items }: { title?: string; items: VisualItem[] }) {
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

// ✅ 섹션 공통 래퍼
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
      viewport={{ once: true, amount: 0.18 }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

export default function RealEstateTax() {
  return (
    <div className="-mt-16">
      <section className="relative w-full overflow-hidden bg-[url('/images/about.jpg')] bg-cover bg-center py-14 md:h-[400px] md:py-0">
        <div className="absolute inset-0 bg-black/30" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center gap-8 px-4 md:gap-10">
          <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
            부동산 세금 컨설팅
          </h1>

          <ServiceTabsBar items={TABS} mobileCols={2} />
        </div>
      </section>

      {/* ✅ 컨텐츠 */}
      <div className="mx-auto w-full max-w-6xl space-y-10 px-4 py-10 md:py-14">
        {/* 1) 소개 */}
        <RevealSection className="space-y-4">
          <VisualPanel
            title="보유·임대·처분 구간별 세금 포인트"
            items={[
              {
                tone: "blue",
                icon: <KeyRound className="h-5 w-5" />,
                label: "취득",
                hint: "취득세·총비용",
              },
              {
                tone: "slate",
                icon: <Home className="h-5 w-5" />,
                label: "보유",
                hint: "구조·현금흐름",
              },
              {
                tone: "emerald",
                icon: <HandCoins className="h-5 w-5" />,
                label: "임대",
                hint: "소득·증빙·운영",
              },
              {
                tone: "slate",
                icon: <Receipt className="h-5 w-5" />,
                label: "처분",
                hint: "양도·변수 점검",
              },
            ]}
          />

          <RevealSection className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <motion.div variants={sectionChild}>
              <SectionTitle
                eyebrow="Overview"
                title="보유·임대·처분의 모든 구간에서 ‘세금 흐름’을 정리합니다"
                desc="부동산 세금은 취득할 때, 보유하는 동안, 임대할 때, 처분할 때마다 과세 포인트가 달라집니다. 현재 보유 현황과 계획(매수/매도/임대/증여)을 함께 정리해, 리스크를 줄이고 유리한 선택을 할 수 있도록 구조적으로 설계합니다."
                icon={
                  <IconBadge tone="blue">
                    <Building2 className="h-5 w-5" />
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
                    <ShieldCheck className="h-5 w-5" />
                  </IconBadge>
                  <p className="text-sm font-extrabold text-slate-900">핵심 목표</p>
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  세금 리스크 최소화 + 거래 의사결정 최적화 + 현금흐름 예측 가능
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
                  보유현황 정리 → 계획(매수/매도/임대) 점검 → 세금 시뮬레이션 → 실행 체크리스트
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
                  세금 영향 리포트 + 시나리오 비교표 + 거래/임대 체크리스트
                </p>
              </div>
            </motion.div>
          </RevealSection>
        </RevealSection>

        {/* 2) 이런 분께 추천 */}
        <RevealSection className="space-y-4">
          <VisualPanel
            title="결정 전에 꼭 점검해야 하는 경우"
            items={[
              { tone: "slate", icon: <ArrowUpRight className="h-5 w-5" />, label: "매도", hint: "타이밍 비교" },
              { tone: "slate", icon: <Home className="h-5 w-5" />, label: "다주택", hint: "주택 수 관리" },
              { tone: "emerald", icon: <HandCoins className="h-5 w-5" />, label: "임대", hint: "소득·신고" },
              { tone: "blue", icon: <KeyRound className="h-5 w-5" />, label: "취득", hint: "총비용 계산" },
            ]}
          />

          <motion.div variants={sectionChild}>
            <SectionTitle
              eyebrow="Who"
              title="이런 분께 추천합니다"
              desc="부동산은 ‘한 번의 거래’가 세금에 큰 차이를 만듭니다. 결정 전에 점검이 필요합니다."
              icon={
                <IconBadge tone="blue">
                  <ClipboardList className="h-5 w-5" />
                </IconBadge>
              }
            />
          </motion.div>

          <motion.div variants={sectionChild} className="grid gap-5 md:grid-cols-2">
            <Card
              title="매도 타이밍이 고민될 때"
              icon={
                <IconBadge tone="slate">
                  <ArrowUpRight className="h-5 w-5" />
                </IconBadge>
              }
            >
              매도 시 예상되는 세금 부담과 변수(보유기간, 실거주 여부, 주택 수 등)를 점검해
              ‘언제, 어떻게’ 처분하는 게 유리한지 비교합니다.
            </Card>

            <Card
              title="다주택/주택 수 관리가 필요할 때"
              icon={
                <IconBadge tone="slate">
                  <Home className="h-5 w-5" />
                </IconBadge>
              }
            >
              가족 단위 보유 현황을 함께 정리하고, 주택 수와 과세 영향이 커지는 지점을
              사전에 확인합니다.
            </Card>

            <Card
              title="임대 수익은 있는데 세금이 불안할 때"
              icon={
                <IconBadge tone="emerald">
                  <HandCoins className="h-5 w-5" />
                </IconBadge>
              }
            >
              임대소득 구조를 정리하고, 신고·증빙·비용 처리 등 운영 리스크를 줄이는
              기준을 마련합니다.
            </Card>

            <Card
              title="취득(매수) 전에 세금과 비용을 알고 싶을 때"
              icon={
                <IconBadge tone="blue">
                  <KeyRound className="h-5 w-5" />
                </IconBadge>
              }
            >
              취득세, 중개수수료, 대출 구조 등 ‘사실상 총비용’을 정리해
              매수 전 의사결정을 돕습니다.
            </Card>
          </motion.div>
        </RevealSection>

        {/* 3) 제공 범위 */}
        <RevealSection className="space-y-4">
          <VisualPanel
            title="구간별 체크로 체계화"
            items={[
              { tone: "blue", icon: <KeyRound className="h-5 w-5" />, label: "취득", hint: "세금·자금" },
              { tone: "slate", icon: <Home className="h-5 w-5" />, label: "보유", hint: "구조·관리" },
              { tone: "emerald", icon: <HandCoins className="h-5 w-5" />, label: "임대", hint: "운영·증빙" },
              { tone: "slate", icon: <Receipt className="h-5 w-5" />, label: "처분", hint: "시뮬레이션" },
            ]}
          />

          <motion.div variants={sectionChild}>
            <SectionTitle
              eyebrow="Scope"
              title="컨설팅 제공 범위"
              desc="거래 단계별로 세금 포인트가 다르기 때문에, ‘구간별 체크’로 체계화합니다."
              icon={
                <IconBadge tone="blue">
                  <ScrollText className="h-5 w-5" />
                </IconBadge>
              }
            />
          </motion.div>

          <motion.div variants={sectionChild} className="grid gap-5 md:grid-cols-3">
            <Card
              title="취득(매수) 단계 점검"
              icon={
                <IconBadge tone="blue">
                  <KeyRound className="h-5 w-5" />
                </IconBadge>
              }
            >
              취득세·부대비용 구조, 대출/자금 계획, 보유 목적(거주/임대/투자)에 따른
              리스크 포인트를 점검합니다.
            </Card>

            <Card
              title="보유(관리) 단계 점검"
              icon={
                <IconBadge tone="slate">
                  <Home className="h-5 w-5" />
                </IconBadge>
              }
            >
              보유 구조(명의/지분/대출), 유지 비용과 현금흐름, 향후 처분 계획까지 연결해
              보유 전략을 정리합니다.
            </Card>

            <Card
              title="임대(수익) 단계 점검"
              icon={
                <IconBadge tone="emerald">
                  <HandCoins className="h-5 w-5" />
                </IconBadge>
              }
            >
              임대소득 흐름, 증빙/비용 처리, 계약/관리 포인트를 정리해
              운영 리스크를 낮춥니다.
            </Card>

            <Card
              title="처분(매도) 단계 시뮬레이션"
              icon={
                <IconBadge tone="slate">
                  <Receipt className="h-5 w-5" />
                </IconBadge>
              }
            >
              매도 시나리오별 예상 세금 부담과 변수를 비교하고,
              거래 전 체크리스트를 제공합니다.
            </Card>

            <Card
              title="가족/자산 전체 연계(선택)"
              icon={
                <IconBadge tone="blue">
                  <Landmark className="h-5 w-5" />
                </IconBadge>
              }
            >
              부동산이 금융자산·상속/증여 계획과 어떻게 연결되는지 정리하고,
              전체 자산 흐름 속에서 방향을 잡습니다.
            </Card>

            <Card
              title="문서/증빙 정리(선택)"
              icon={
                <IconBadge tone="emerald">
                  <BadgeCheck className="h-5 w-5" />
                </IconBadge>
              }
            >
              자주 빠지는 증빙과 서류(취득/리모델링/임대 운영 등)를 정리해
              신고 리스크를 줄입니다.
            </Card>
          </motion.div>
        </RevealSection>

        {/* 4) 진행 프로세스 */}
        <RevealSection className="space-y-4">
          <VisualPanel
            title="현재 + 계획을 합쳐 최적화"
            items={[
              { tone: "slate", icon: <ClipboardList className="h-5 w-5" />, label: "현황", hint: "보유·대출" },
              { tone: "blue", icon: <Percent className="h-5 w-5" />, label: "변수", hint: "주택수·기간" },
              { tone: "slate", icon: <Scale className="h-5 w-5" />, label: "비교", hint: "시나리오" },
              { tone: "emerald", icon: <CalendarCheck className="h-5 w-5" />, label: "실행", hint: "체크리스트" },
            ]}
          />

          <motion.div variants={sectionChild}>
            <SectionTitle
              eyebrow="Process"
              title="진행 프로세스"
              desc="‘현재 보유 상태’와 ‘앞으로의 계획’을 합쳐서 최적의 선택지를 만듭니다."
              icon={
                <IconBadge tone="blue">
                  <Waypoints className="h-5 w-5" />
                </IconBadge>
              }
            />
          </motion.div>

          <motion.div variants={sectionChild} className="grid gap-5 md:grid-cols-4">
            <Card
              title="1) 현황 파악"
              icon={
                <IconBadge tone="slate">
                  <ClipboardList className="h-5 w-5" />
                </IconBadge>
              }
            >
              보유 부동산/대출/임대 현황 정리, 목표(매수/매도/임대) 설정
            </Card>

            <Card
              title="2) 변수 점검"
              icon={
                <IconBadge tone="blue">
                  <Percent className="h-5 w-5" />
                </IconBadge>
              }
            >
              주택 수, 보유기간, 실거주, 임대 형태 등 과세 변수 체크
            </Card>

            <Card
              title="3) 시나리오 비교"
              icon={
                <IconBadge tone="slate">
                  <Scale className="h-5 w-5" />
                </IconBadge>
              }
            >
              매도/보유/임대 변경 등 선택지별 세금·현금흐름 비교표 제시
            </Card>

            <Card
              title="4) 실행 가이드"
              icon={
                <IconBadge tone="emerald">
                  <CalendarCheck className="h-5 w-5" />
                </IconBadge>
              }
            >
              거래/임대/증빙 체크리스트 제공, 일정과 우선순위 확정
            </Card>
          </motion.div>
        </RevealSection>

        {/* 5) 준비 자료 */}
        <RevealSection className="space-y-4">
          <VisualPanel
            title="준비 자료(빠르게)"
            items={[
              { tone: "slate", icon: <Home className="h-5 w-5" />, label: "부동산", hint: "주소·명의" },
              { tone: "slate", icon: <Wallet className="h-5 w-5" />, label: "대출", hint: "잔액·금리" },
              { tone: "emerald", icon: <HandCoins className="h-5 w-5" />, label: "임대", hint: "보증금·월세" },
              { tone: "blue", icon: <ScrollText className="h-5 w-5" />, label: "계획", hint: "매수/매도" },
            ]}
          />

          <motion.div variants={sectionChild}>
            <SectionTitle
              eyebrow="Checklist"
              title="준비 자료"
              desc="기본 정보만 있어도 시작 가능합니다. 확인 가능한 범위부터 정리합니다."
              icon={
                <IconBadge tone="blue">
                  <FileText className="h-5 w-5" />
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
                <li>부동산 현황(종류/주소/명의/지분/취득 시점)</li>
                <li>대출 현황(금리/상환 방식/잔액)</li>
                <li>임대 여부(보증금/월세/계약 기간)</li>
                <li>향후 계획(매수/매도/임대 전환 등)</li>
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
                <li>취득 관련 자료(계약서, 취득세 납부 등)</li>
                <li>리모델링/수선 비용 증빙(있다면)</li>
                <li>임대차 계약서 및 관리 내역</li>
                <li>가족 단위 보유 현황(주택 수/명의 분산 등)</li>
              </ul>
            </Card>
          </motion.div>
        </RevealSection>
      </div>

      <SiteFooter companyName="SY 컨설팅" />
    </div>
  );
}
