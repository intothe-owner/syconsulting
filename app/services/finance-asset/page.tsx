"use client";

import ServiceTabsBar, { ServiceTabItem } from "@/components/ServiceTabsBar";
import SiteFooter from "@/components/SiteFooter";
import { motion, Variants } from "framer-motion";
import React from "react";
import {
  Sparkles,
  Wallet,
  PieChart,
  ShieldCheck,
  TrendingUp,
  CalendarCheck,
  ClipboardList,
  FileText,
  BadgeCheck,
  Receipt,
  LineChart,
  Coins,
  HandCoins,
  Landmark,
  CreditCard,
  Scale,
  Banknote,
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

export default function FinanceAsset() {
  return (
    <div className="-mt-16">
      <section className="relative w-full overflow-hidden bg-[url('/images/about.jpg')] bg-cover bg-center py-14 md:h-[400px] md:py-0">
        <div className="absolute inset-0 bg-black/30" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center gap-8 px-4 md:gap-10">
          <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
            금융소득·자산 컨설팅
          </h1>

          <ServiceTabsBar items={TABS} mobileCols={2} />
        </div>
      </section>

      {/* ✅ 컨텐츠 */}
      <div className="mx-auto w-full max-w-6xl space-y-10 px-4 py-10 md:py-14">
        {/* 1) 소개 */}
        <RevealSection className="space-y-4">
          <VisualPanel
            title="자산을 ‘한 장의 설계도’로 보는 핵심 축"
            items={[
              {
                tone: "blue",
                icon: <Wallet className="h-5 w-5" />,
                label: "통합 자산",
                hint: "예금·주식·연금·보험",
              },
              {
                tone: "slate",
                icon: <Receipt className="h-5 w-5" />,
                label: "세금 구조",
                hint: "과세·공제·누수 구간",
              },
              {
                tone: "emerald",
                icon: <ShieldCheck className="h-5 w-5" />,
                label: "리스크",
                hint: "변동성·유동성·집중도",
              },
              {
                tone: "blue",
                icon: <HandCoins className="h-5 w-5" />,
                label: "현금흐름",
                hint: "월/분기 소득 시나리오",
              },
            ]}
          />

          <RevealSection className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <motion.div variants={sectionChild}>
              <SectionTitle
                eyebrow="Overview"
                title="흩어진 자산을 ‘한 장의 설계도’로 정리합니다"
                desc="예금·펀드·주식·연금·보험·부동산 등 자산을 통합적으로 점검하고, 목표(은퇴·현금흐름·가족 보호)에 맞춰 세금·리스크·배분 전략을 함께 설계하는 컨설팅입니다."
                icon={
                  <IconBadge tone="blue">
                    <PieChart className="h-5 w-5" />
                  </IconBadge>
                }
              />
            </motion.div>

            <motion.div variants={sectionChild} className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-5">
                <div className="flex items-center gap-3">
                  <IconBadge tone="emerald">
                    <TrendingUp className="h-5 w-5" />
                  </IconBadge>
                  <p className="text-sm font-extrabold text-slate-900">핵심 목표</p>
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  자산 배분 최적화 + 세금 리스크 관리 + 안정적 현금흐름
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <div className="flex items-center gap-3">
                  <IconBadge tone="blue">
                    <ClipboardList className="h-5 w-5" />
                  </IconBadge>
                  <p className="text-sm font-extrabold text-slate-900">컨설팅 방식</p>
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  자산 진단 → 목표 설정 → 배분·세금 설계 → 실행 체크리스트
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
                  자산 구조 리포트 + 리스크 점검표 + 실행 로드맵(월/분기)
                </p>
              </div>
            </motion.div>
          </RevealSection>
        </RevealSection>

        {/* 2) 이런 분께 추천 */}
        <RevealSection className="space-y-4">
          <VisualPanel
            title="이 컨설팅이 특히 도움 되는 상황"
            items={[
              {
                tone: "slate",
                icon: <Receipt className="h-5 w-5" />,
                label: "세금 부담",
                hint: "금융소득 증가",
              },
              {
                tone: "blue",
                icon: <Banknote className="h-5 w-5" />,
                label: "현금흐름",
                hint: "월 수입 중심",
              },
              {
                tone: "emerald",
                icon: <ShieldCheck className="h-5 w-5" />,
                label: "불안감",
                hint: "리스크 과다",
              },
              {
                tone: "slate",
                icon: <Scale className="h-5 w-5" />,
                label: "가족 설계",
                hint: "보장·상속 연결",
              },
            ]}
          />

          <motion.div variants={sectionChild}>
            <SectionTitle
              eyebrow="Who"
              title="이런 분께 추천합니다"
              desc="‘수익률’만이 아니라 ‘목표 달성’과 ‘지속 가능한 현금흐름’이 필요할 때 도움이 됩니다."
              icon={
                <IconBadge tone="blue">
                  <BadgeCheck className="h-5 w-5" />
                </IconBadge>
              }
            />
          </motion.div>

          <motion.div variants={sectionChild} className="grid gap-5 md:grid-cols-2">
            <Card
              title="금융소득이 늘어 세금이 부담될 때"
              icon={
                <IconBadge tone="slate">
                  <Receipt className="h-5 w-5" />
                </IconBadge>
              }
            >
              이자·배당·금융상품 수익 흐름을 정리하고, 과세 구조와 공제·절세 포인트를 함께 점검합니다.
              (상품 변경이 아니라 ‘구조’부터 잡는 방식)
            </Card>

            <Card
              title="현금흐름(월 수입) 중심으로 재구성이 필요할 때"
              icon={
                <IconBadge tone="blue">
                  <HandCoins className="h-5 w-5" />
                </IconBadge>
              }
            >
              은퇴/반은퇴 시점에 맞춰 생활비 흐름을 설계하고, 연금·배당·이자·임대 등 소득원을 균형 있게 배치합니다.
            </Card>

            <Card
              title="리스크가 커 보여 불안할 때"
              icon={
                <IconBadge tone="emerald">
                  <ShieldCheck className="h-5 w-5" />
                </IconBadge>
              }
            >
              주식/펀드/대체투자 비중, 변동성, 유동성(언제 현금화 가능한지)을 점검해
              ‘감당 가능한 리스크’ 범위로 재정렬합니다.
            </Card>

            <Card
              title="가족 보호·상속/증여까지 함께 고민할 때"
              icon={
                <IconBadge tone="slate">
                  <Scale className="h-5 w-5" />
                </IconBadge>
              }
            >
              보험/연금/부동산/현금성 자산을 가족 단위로 정리하고, 향후 상속·증여 설계와 연결되는 포인트를 미리 체크합니다.
            </Card>
          </motion.div>
        </RevealSection>

        {/* 3) 제공 범위 */}
        <RevealSection className="space-y-4">
          <VisualPanel
            title="진단 + 설계 + 실행(모듈형)"
            items={[
              {
                tone: "blue",
                icon: <Wallet className="h-5 w-5" />,
                label: "통합 진단",
                hint: "구성·집중도",
              },
              {
                tone: "blue",
                icon: <Banknote className="h-5 w-5" />,
                label: "현금흐름",
                hint: "시나리오",
              },
              {
                tone: "emerald",
                icon: <ShieldCheck className="h-5 w-5" />,
                label: "리스크",
                hint: "한도·유동성",
              },
              {
                tone: "slate",
                icon: <Receipt className="h-5 w-5" />,
                label: "세금",
                hint: "누수 구간",
              },
            ]}
          />

          <motion.div variants={sectionChild}>
            <SectionTitle
              eyebrow="Scope"
              title="컨설팅 제공 범위"
              desc="‘진단 + 설계 + 실행’에 필요한 항목을 모듈형으로 제공합니다."
              icon={
                <IconBadge tone="blue">
                  <LineChart className="h-5 w-5" />
                </IconBadge>
              }
            />
          </motion.div>

          <motion.div variants={sectionChild} className="grid gap-5 md:grid-cols-3">
            <Card
              title="자산 진단(통합)"
              icon={
                <IconBadge tone="blue">
                  <Wallet className="h-5 w-5" />
                </IconBadge>
              }
            >
              보유 금융자산·부동산·연금·보험을 한 화면에서 정리하고,
              자산 구성/유동성/집중도를 분석합니다.
            </Card>

            <Card
              title="현금흐름 설계"
              icon={
                <IconBadge tone="blue">
                  <HandCoins className="h-5 w-5" />
                </IconBadge>
              }
            >
              월/분기 단위의 소득·지출 구조를 정리하고,
              은퇴 이후 지속 가능한 현금흐름 시나리오를 설계합니다.
            </Card>

            <Card
              title="리스크 관리"
              icon={
                <IconBadge tone="emerald">
                  <ShieldCheck className="h-5 w-5" />
                </IconBadge>
              }
            >
              변동성/집중 투자/환율·금리 민감도 등 위험요인을 점검하고,
              목표에 맞는 리스크 한도를 제시합니다.
            </Card>

            <Card
              title="세금 구조 점검"
              icon={
                <IconBadge tone="slate">
                  <Receipt className="h-5 w-5" />
                </IconBadge>
              }
            >
              금융소득 과세 구조, 연금 과세, 부동산 관련 세금과의 연계 포인트 등
              ‘세금이 새는 구간’을 점검합니다.
            </Card>

            <Card
              title="자산 배분 전략"
              icon={
                <IconBadge tone="blue">
                  <PieChart className="h-5 w-5" />
                </IconBadge>
              }
            >
              목표(안정/성장/현금흐름)에 따른 자산 배분 원칙을 세우고,
              리밸런싱(조정) 기준을 마련합니다.
            </Card>

            <Card
              title="정기 점검(선택)"
              icon={
                <IconBadge tone="emerald">
                  <CalendarCheck className="h-5 w-5" />
                </IconBadge>
              }
            >
              분기/반기 단위로 실행 상태 점검,
              시장/가족 상황 변화에 따른 조정 가이드를 제공합니다.
            </Card>
          </motion.div>
        </RevealSection>

        {/* 4) 진행 프로세스 */}
        <RevealSection className="space-y-4">
          <VisualPanel
            title="한눈에 보는 진행 흐름"
            items={[
              { tone: "slate", icon: <ClipboardList className="h-5 w-5" />, label: "현황", hint: "목표 설정" },
              { tone: "blue", icon: <LineChart className="h-5 w-5" />, label: "분석", hint: "리스크·세금" },
              { tone: "blue", icon: <PieChart className="h-5 w-5" />, label: "설계", hint: "배분·시나리오" },
              { tone: "emerald", icon: <BadgeCheck className="h-5 w-5" />, label: "실행", hint: "체크·점검" },
            ]}
          />

          <motion.div variants={sectionChild}>
            <SectionTitle
              eyebrow="Process"
              title="진행 프로세스"
              desc="자산은 ‘많이 아는 것’보다 ‘지속 가능한 시스템’을 만드는 게 중요합니다."
              icon={
                <IconBadge tone="blue">
                  <ClipboardList className="h-5 w-5" />
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
              자산 목록화, 소득/지출 흐름 정리, 목표(기간·금액·리스크) 설정
            </Card>

            <Card
              title="2) 분석·진단"
              icon={
                <IconBadge tone="blue">
                  <LineChart className="h-5 w-5" />
                </IconBadge>
              }
            >
              구성/집중도/유동성/리스크 분석, 세금 이슈 및 누수 구간 점검
            </Card>

            <Card
              title="3) 설계"
              icon={
                <IconBadge tone="blue">
                  <PieChart className="h-5 w-5" />
                </IconBadge>
              }
            >
              배분 원칙 수립, 현금흐름 시나리오 구성, 실행 우선순위 결정
            </Card>

            <Card
              title="4) 실행·점검"
              icon={
                <IconBadge tone="emerald">
                  <CalendarCheck className="h-5 w-5" />
                </IconBadge>
              }
            >
              체크리스트 기반 실행, 리밸런싱 기준 적용, 정기 점검(옵션)
            </Card>
          </motion.div>
        </RevealSection>

        {/* 5) 준비 자료 */}
        <RevealSection className="space-y-4">
          <VisualPanel
            title="준비 자료 카테고리(빠르게)"
            items={[
              { tone: "blue", icon: <CreditCard className="h-5 w-5" />, label: "금융내역", hint: "보유 현황" },
              { tone: "slate", icon: <Landmark className="h-5 w-5" />, label: "연금/보험", hint: "요약 구조" },
              { tone: "blue", icon: <Coins className="h-5 w-5" />, label: "소득/지출", hint: "흐름" },
              { tone: "slate", icon: <Receipt className="h-5 w-5" />, label: "부채/대출", hint: "금리·계획" },
            ]}
          />

          <motion.div variants={sectionChild}>
            <SectionTitle
              eyebrow="Checklist"
              title="준비 자료"
              desc="가능한 범위에서 준비해 주시면 되고, 없으면 현재 확인 가능한 자료로 시작합니다."
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
                <li>금융자산 내역(예금/적금/펀드/주식/채권 등 보유 현황)</li>
                <li>연금/보험 상품 요약(가입 내역, 납입/수령 구조)</li>
                <li>최근 6~12개월 소득/지출 흐름(대략도 가능)</li>
                <li>대출/부채 현황(금리, 상환 계획 포함)</li>
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
                <li>투자 목표(은퇴 시점, 목표 자금, 월 생활비 목표)</li>
                <li>보유 부동산 현황(임대 여부, 보유 목적)</li>
                <li>가족 구성/부양 계획(보장/상속 연결 고려 시)</li>
                <li>과거 투자 경험/선호(감당 가능한 변동성)</li>
              </ul>
            </Card>
          </motion.div>
        </RevealSection>
      </div>

      <SiteFooter companyName="SY 컨설팅" />
    </div>
  );
}
