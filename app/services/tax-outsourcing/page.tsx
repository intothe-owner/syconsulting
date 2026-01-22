"use client";

import ServiceTabsBar, { ServiceTabItem } from "@/components/ServiceTabsBar";
import SiteFooter from "@/components/SiteFooter";
import { motion, Variants } from "framer-motion";
import React from "react";
import {
  Sparkles,
  ClipboardList,
  ShieldCheck,
  FileText,
  Receipt,
  CalendarCheck,
  Waypoints,
  BadgeCheck,
  FolderCheck,
  Wallet,
  CreditCard,
  Landmark,
  Users,
  UserCheck,
  BriefcaseBusiness,
  BellRing,
  BarChart3,
  TrendingUp,
  Percent,

  ScrollText 
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
      viewport={{ once: true, amount: 0.18 }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

export default function TaxOutsourcing() {
  return (
    <div className="-mt-16">
      <section className="relative w-full overflow-hidden bg-[url('/images/about.jpg')] bg-cover bg-center py-14 md:h-[400px] md:py-0">
        <div className="absolute inset-0 bg-black/30" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center gap-8 px-4 md:gap-10">
          <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
            세무대행(선택)
          </h1>

          <ServiceTabsBar items={TABS} mobileCols={2} />
        </div>
      </section>

      {/* ✅ 컨텐츠 */}
      <div className="mx-auto w-full max-w-6xl space-y-10 px-4 py-10 md:py-14">
        {/* 1) 소개 */}
        <RevealSection className="space-y-4">
          <VisualPanel
            title="세무대행 = 신고 + 운영 루틴"
            items={[
              {
                tone: "blue",
                icon: <FolderCheck className="h-5 w-5" />,
                label: "증빙 루틴",
                hint: "수집·정리 표준화",
              },
              {
                tone: "emerald",
                icon: <ShieldCheck className="h-5 w-5" />,
                label: "리스크 감소",
                hint: "가산세·누락 예방",
              },
              {
                tone: "slate",
                icon: <CalendarCheck className="h-5 w-5" />,
                label: "기한 관리",
                hint: "부가세·원천세",
              },
              {
                tone: "blue",
                icon: <BarChart3 className="h-5 w-5" />,
                label: "월별 손익",
                hint: "의사결정 속도",
              },
            ]}
          />

          <RevealSection className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <motion.div variants={sectionChild}>
              <SectionTitle
                eyebrow="Overview"
                title="신고 ‘대행’이 아니라, 운영이 편해지는 ‘세무 관리’로 바꿉니다"
                desc="세무대행은 단순히 신고를 대신하는 서비스가 아닙니다. 증빙·거래 구조·인건비·비용 처리 기준을 정리해 ‘세무 리스크’를 줄이고, 매월 숫자가 쌓이도록 만들어 의사결정이 쉬워지게 합니다. (※ 필요하신 경우에만 선택 진행)"
                icon={
                  <IconBadge tone="blue">
                    <ClipboardList className="h-5 w-5" />
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
                  신고 리스크 최소화 + 증빙 표준화 + 월별 손익 흐름 확보
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <div className="flex items-center gap-3">
                  <IconBadge tone="slate">
                    <Waypoints className="h-5 w-5" />
                  </IconBadge>
                  <p className="text-sm font-extrabold text-slate-900">운영 방식</p>
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  자료 수집/정리 → 장부 반영 → 신고/보고 → 리스크 점검(반복)
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <div className="flex items-center gap-3">
                  <IconBadge tone="blue">
                    <FileText className="h-5 w-5" />
                  </IconBadge>
                  <p className="text-sm font-extrabold text-slate-900">산출물</p>
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  월별 리포트(요약) + 증빙 체크리스트 + 주요 이슈 알림
                </p>
              </div>
            </motion.div>
          </RevealSection>
        </RevealSection>

        {/* 2) 이런 분께 추천 */}
        <RevealSection className="space-y-4">
          <VisualPanel
            title="이럴 때 세무대행이 ‘효과’가 큽니다"
            items={[
              {
                tone: "slate",
                icon: <CreditCard className="h-5 w-5" />,
                label: "증빙 누락",
                hint: "카드/현금 섞임",
              },
              {
                tone: "blue",
                icon: <Users className="h-5 w-5" />,
                label: "인건비/외주",
                hint: "기준 혼선",
              },
              {
                tone: "emerald",
                icon: <BellRing className="h-5 w-5" />,
                label: "신고 일정",
                hint: "부가세·원천세",
              },
              {
                tone: "blue",
                icon: <TrendingUp className="h-5 w-5" />,
                label: "월별 손익",
                hint: "숫자 부재",
              },
            ]}
          />

          <motion.div variants={sectionChild}>
            <SectionTitle
              eyebrow="Who"
              title="이런 분께 추천합니다"
              desc="‘신고는 했는데 불안하다’ 또는 ‘매달 숫자가 안 보인다’면 세무대행이 효과적입니다."
              icon={
                <IconBadge tone="blue">
                  <UserCheck className="h-5 w-5" />
                </IconBadge>
              }
            />
          </motion.div>

          <motion.div variants={sectionChild} className="grid gap-5 md:grid-cols-2">
            <Card
              title="증빙이 매번 누락되고 정리가 어려울 때"
              icon={
                <IconBadge tone="slate">
                  <FolderCheck className="h-5 w-5" />
                </IconBadge>
              }
            >
              카드/계좌/현금 지출이 섞여 있거나, 증빙 수집이 늦어져 신고 때마다
              급하게 맞추는 상황을 표준화(룰/체크리스트)로 바꿉니다.
            </Card>

            <Card
              title="인건비·외주비 처리 기준이 헷갈릴 때"
              icon={
                <IconBadge tone="blue">
                  <BriefcaseBusiness className="h-5 w-5" />
                </IconBadge>
              }
            >
              급여/4대보험/프리랜서/외주 정산 등 자주 발생하는 이슈를 정리하고,
              리스크가 생기는 구간을 사전에 차단합니다.
            </Card>

            <Card
              title="부가세/종소세/원천세 일정이 부담될 때"
              icon={
                <IconBadge tone="emerald">
                  <CalendarCheck className="h-5 w-5" />
                </IconBadge>
              }
            >
              신고 일정과 준비 자료를 미리 안내하고,
              기한·누락·가산세 리스크를 줄이는 운영 루틴을 만듭니다.
            </Card>

            <Card
              title="월별 손익이 안 보여 의사결정이 느릴 때"
              icon={
                <IconBadge tone="blue">
                  <BarChart3 className="h-5 w-5" />
                </IconBadge>
              }
            >
              매출/원가/고정비 흐름을 월 단위로 정리해
              ‘무엇을 줄이고, 무엇을 늘릴지’ 판단이 가능하게 합니다.
            </Card>
          </motion.div>
        </RevealSection>

        {/* 3) 제공 범위 */}
        <RevealSection className="space-y-4">
          <VisualPanel
            title="제공 범위(모듈형)"
            items={[
              { tone: "blue", icon: <ClipboardList className="h-5 w-5" />, label: "기장", hint: "장부 관리" },
              { tone: "slate", icon: <Percent className="h-5 w-5" />, label: "부가세", hint: "분기 신고" },
              { tone: "slate", icon: <Users className="h-5 w-5" />, label: "원천세", hint: "지급명세" },
              { tone: "blue", icon: <Receipt className="h-5 w-5" />, label: "연간", hint: "종소세/법인세" },
            ]}
          />

          <motion.div variants={sectionChild}>
            <SectionTitle
              eyebrow="Scope"
              title="세무대행 제공 범위"
              desc="사업 규모와 상황에 맞춰 ‘필요한 것만’ 선택할 수 있도록 구성합니다."
              icon={
                <IconBadge tone="blue">
                  <ScrollText className="h-5 w-5"/>
                </IconBadge>
              }
            />
          </motion.div>

          <motion.div variants={sectionChild} className="grid gap-5 md:grid-cols-3">
            <Card
              title="기장/장부 관리"
              icon={
                <IconBadge tone="blue">
                  <ClipboardList className="h-5 w-5" />
                </IconBadge>
              }
            >
              매출·매입·경비 자료를 정리해 장부에 반영하고,
              비용 처리 기준을 함께 표준화합니다.
            </Card>

            <Card
              title="부가가치세 신고"
              icon={
                <IconBadge tone="slate">
                  <Percent className="h-5 w-5" />
                </IconBadge>
              }
            >
              분기별 부가세 신고 준비부터 제출까지 진행하며,
              누락되기 쉬운 매입/증빙을 사전 점검합니다.
            </Card>

            <Card
              title="원천세/지급명세 관리"
              icon={
                <IconBadge tone="slate">
                  <Users className="h-5 w-5" />
                </IconBadge>
              }
            >
              급여/프리랜서/외주 지급 자료를 정리하고,
              원천세 신고 및 지급명세 관련 이슈를 점검합니다.
            </Card>

            <Card
              title="종합소득세/법인세 신고"
              icon={
                <IconBadge tone="blue">
                  <Receipt className="h-5 w-5" />
                </IconBadge>
              }
            >
              연간 결산 흐름에 맞춰 준비 자료를 정리하고,
              신고 리스크를 낮추는 포인트를 함께 체크합니다.
            </Card>

            <Card
              title="4대보험/인건비 이슈 점검(선택)"
              icon={
                <IconBadge tone="emerald">
                  <ShieldCheck className="h-5 w-5" />
                </IconBadge>
              }
            >
              인건비 구조(직원/외주/프리랜서)를 점검하고,
              잦은 분쟁/리스크 구간을 예방합니다.
            </Card>

            <Card
              title="월간 리포트(요약) 제공(선택)"
              icon={
                <IconBadge tone="blue">
                  <BarChart3 className="h-5 w-5" />
                </IconBadge>
              }
            >
              월별 매출·비용·손익 흐름을 요약해
              대표의 의사결정을 돕습니다.
            </Card>
          </motion.div>
        </RevealSection>

        {/* 4) 진행 프로세스 */}
        <RevealSection className="space-y-4">
          <VisualPanel
            title="루틴이 있는 세무 운영"
            items={[
              { tone: "slate", icon: <FolderCheck className="h-5 w-5" />, label: "초기세팅", hint: "룰 설정" },
              { tone: "blue", icon: <Wallet className="h-5 w-5" />, label: "월간정리", hint: "장부 반영" },
              { tone: "slate", icon: <Receipt className="h-5 w-5" />, label: "신고/제출", hint: "기한 준수" },
              { tone: "emerald", icon: <BadgeCheck className="h-5 w-5" />, label: "점검/개선", hint: "기준 업데이트" },
            ]}
          />

          <motion.div variants={sectionChild}>
            <SectionTitle
              eyebrow="Process"
              title="진행 프로세스"
              desc="‘자료 요청이 잦고 번거로운 세무’가 아니라, ‘루틴이 있는 세무’로 운영합니다."
              icon={
                <IconBadge tone="blue">
                  <Waypoints className="h-5 w-5" />
                </IconBadge>
              }
            />
          </motion.div>

          <motion.div variants={sectionChild} className="grid gap-5 md:grid-cols-4">
            <Card
              title="1) 초기 세팅"
              icon={
                <IconBadge tone="slate">
                  <FolderCheck className="h-5 w-5" />
                </IconBadge>
              }
            >
              사업 구조/거래 흐름 파악, 증빙 룰 설정, 자료 공유 방식 정리
            </Card>

            <Card
              title="2) 월간 정리"
              icon={
                <IconBadge tone="blue">
                  <Wallet className="h-5 w-5" />
                </IconBadge>
              }
            >
              매출/매입/경비 반영, 누락 증빙 확인, 이슈 사전 안내
            </Card>

            <Card
              title="3) 신고/제출"
              icon={
                <IconBadge tone="slate">
                  <Receipt className="h-5 w-5" />
                </IconBadge>
              }
            >
              부가세·원천세·연간 신고 일정에 맞춰 자료 확정 및 제출
            </Card>

            <Card
              title="4) 점검/개선"
              icon={
                <IconBadge tone="emerald">
                  <BadgeCheck className="h-5 w-5" />
                </IconBadge>
              }
            >
              자주 발생하는 리스크를 줄이도록 기준 업데이트(선택)
            </Card>
          </motion.div>
        </RevealSection>

        {/* 5) 준비 자료 */}
        <RevealSection className="space-y-4">
          <VisualPanel
            title="준비 자료(핵심 카테고리)"
            items={[
              { tone: "slate", icon: <CreditCard className="h-5 w-5" />, label: "매출", hint: "카드/현금" },
              { tone: "slate", icon: <Receipt className="h-5 w-5" />, label: "경비", hint: "증빙 모으기" },
              { tone: "blue", icon: <Landmark className="h-5 w-5" />, label: "통장/카드", hint: "사업/개인 구분" },
              { tone: "emerald", icon: <Users className="h-5 w-5" />, label: "인건비", hint: "직원/외주" },
            ]}
          />

          <motion.div variants={sectionChild}>
            <SectionTitle
              eyebrow="Checklist"
              title="준비 자료"
              desc="처음에는 ‘확인 가능한 것’부터 시작해도 됩니다. 세팅 후에는 루틴대로 운영합니다."
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
                <li>사업자등록/법인등기(해당 시)</li>
                <li>매출 자료(카드/현금영수증/세금계산서/계좌 입금 등)</li>
                <li>매입/경비 증빙(세금계산서/현금영수증/카드전표 등)</li>
                <li>통장/카드 사용 현황(사업용/개인용 구분)</li>
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
                <li>직원/외주 인건비 자료(급여대장, 계약서, 지급 내역)</li>
                <li>임대차/거래처 계약서(주요 계약)</li>
                <li>차량/접대비/해외결제 등 리스크 항목 사용 내역</li>
                <li>월별 목표(매출/비용/인건비 계획)</li>
              </ul>
            </Card>
          </motion.div>
        </RevealSection>
      </div>

      <SiteFooter companyName="SY 컨설팅" />
    </div>
  );
}
