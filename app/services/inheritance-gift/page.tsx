"use client";

import ServiceTabsBar, { ServiceTabItem } from "@/components/ServiceTabsBar";
import SiteFooter from "@/components/SiteFooter";
import { motion, Variants } from "framer-motion";
import React from "react";

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

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      variants={sectionChild}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="mb-3 text-base font-extrabold tracking-tight text-slate-900">
        <span>{title}</span>
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

export default function Inheritance() {
  return (
    <div className="-mt-16">
      <section className="relative w-full overflow-hidden bg-[url('/images/about.jpg')] bg-cover bg-center py-14 md:h-[400px] md:py-0">
        <div className="absolute inset-0 bg-black/30" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center gap-8 px-4 md:gap-10">
          <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
            상속·증여 컨설팅
          </h1>

          <ServiceTabsBar items={TABS} mobileCols={2} />
        </div>
      </section>

      {/* ✅ 컨텐츠 */}
      <div className="mx-auto w-full max-w-6xl space-y-10 px-4 py-10 md:py-14">
        {/* 1) 소개 */}
        <RevealSection className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
          <motion.div variants={sectionChild}>
            <SectionTitle
              eyebrow="Overview"
              title="가족의 자산을 ‘분쟁 없이’ ‘세금까지’ 함께 설계합니다"
              desc="상속·증여는 단순히 세금을 줄이는 문제가 아니라, 가족의 의사결정·자산 흐름·미래 계획이 함께 연결되는 과정입니다. 현재 보유 자산을 정리하고, 상속·증여 시나리오를 비교해 가장 현실적인 실행 로드맵을 제시합니다."
            />
          </motion.div>

          <motion.div variants={sectionChild} className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm font-extrabold text-slate-900">핵심 목표</p>
              <p className="mt-2 text-sm text-slate-600">
                세금 리스크 최소화 + 가족 분쟁 예방 + 계획적인 자산 이전
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm font-extrabold text-slate-900">컨설팅 방식</p>
              <p className="mt-2 text-sm text-slate-600">
                자산 정리 → 시나리오 비교 → 실행 순서 설계 → 체크리스트 제공
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm font-extrabold text-slate-900">산출물</p>
              <p className="mt-2 text-sm text-slate-600">
                상속·증여 설계 리포트 + 절차 체크리스트 + 일정(타임라인)
              </p>
            </div>
          </motion.div>
        </RevealSection>

        {/* 2) 이런 분께 추천 */}
        <RevealSection className="space-y-4">
          <motion.div variants={sectionChild}>
            <SectionTitle
              eyebrow="Who"
              title="이런 분께 추천합니다"
              desc="‘나중에 하자’가 가장 위험할 수 있습니다. 미리 정리하면 선택지가 늘어납니다."
            />
          </motion.div>

          <motion.div variants={sectionChild} className="grid gap-5 md:grid-cols-2">
            <Card title="부동산 비중이 높아 상속세가 걱정될 때">
              부동산 평가/보유 구조/임대 수익 흐름을 함께 점검하고,
              상속 시 예상 세액과 재원 마련(현금흐름) 전략을 비교합니다.
            </Card>
            <Card title="자녀에게 단계적으로 증여하고 싶을 때">
              증여 시기·금액·자산 종류에 따라 달라지는 과세 구조를 정리하고,
              여러 회차(분할) 증여 시나리오를 설계합니다.
            </Card>
            <Card title="가족 간 분쟁 가능성이 걱정될 때">
              자산 배분 원칙과 의사결정 구조를 정리하고,
              오해가 생기기 쉬운 쟁점을 사전에 문서화하는 방향을 제시합니다.
            </Card>
            <Card title="가업/법인 지분을 함께 이전해야 할 때">
              개인자산과 법인 지분(주식)을 함께 고려해
              지분 구조, 배당/급여, 의결권 등 핵심 포인트를 정리합니다.
            </Card>
          </motion.div>
        </RevealSection>

        {/* 3) 제공 범위 */}
        <RevealSection className="space-y-4">
          <motion.div variants={sectionChild}>
            <SectionTitle
              eyebrow="Scope"
              title="컨설팅 제공 범위"
              desc="상속·증여는 ‘세금’과 ‘가족’과 ‘자산 구조’가 동시에 움직입니다. 전체를 함께 봅니다."
            />
          </motion.div>

          <motion.div variants={sectionChild} className="grid gap-5 md:grid-cols-3">
            <Card title="자산 목록화·구조 정리">
              부동산/금융자산/보험/연금/법인지분 등을 한 번에 정리하고,
              명의/부채/현금흐름/유동성을 함께 점검합니다.
            </Card>

            <Card title="상속 시나리오 설계">
              예상 세액, 공제 항목, 납부 재원 마련(현금화/대출/분할 등)까지 고려해
              현실적인 실행 가능성을 비교합니다.
            </Card>

            <Card title="증여 시나리오 설계">
              증여 대상/자산 종류/시점에 따른 변화(세액·리스크)를 비교하고,
              분할 증여/단계별 이전 전략을 제시합니다.
            </Card>

            <Card title="부동산 중심 플랜">
              부동산 평가·처분/보유 전략, 임대 수익, 가족별 보유 구조 등
              부동산 비중이 큰 가정에 맞춘 정리 방향을 제공합니다.
            </Card>

            <Card title="가족 합의·분쟁 예방">
              분쟁이 잦은 포인트(배분/관리/명의/부채)를 사전에 점검하고,
              합의가 필요한 항목을 체크리스트로 제공합니다.
            </Card>

            <Card title="실행 체크리스트">
              신고/서류/기한/증빙 등을 단계별로 정리해,
              실행 과정에서 누락과 리스크를 줄입니다.
            </Card>
          </motion.div>
        </RevealSection>

        {/* 4) 진행 프로세스 */}
        <RevealSection className="space-y-4">
          <motion.div variants={sectionChild}>
            <SectionTitle
              eyebrow="Process"
              title="진행 프로세스"
              desc="복잡한 상속·증여를 ‘한 장의 일정표’로 단순화합니다."
            />
          </motion.div>

          <motion.div variants={sectionChild} className="grid gap-5 md:grid-cols-4">
            <Card title="1) 현황 파악">
              자산/부채/명의/가족 구성 정리, 목표(분쟁·세금·현금흐름) 설정
            </Card>
            <Card title="2) 분석·진단">
              예상 세액/리스크 분석, 공제·변수 체크, 취약 지점 도출
            </Card>
            <Card title="3) 시나리오 비교">
              상속/증여/혼합 전략 비교, 실행 가능성(현금흐름/유동성) 검증
            </Card>
            <Card title="4) 실행 설계">
              절차·서류·기한·역할 분담, 단계별 체크리스트 제공(옵션 점검 포함)
            </Card>
          </motion.div>
        </RevealSection>

        {/* 5) 준비 자료 */}
        <RevealSection className="space-y-4">
          <motion.div variants={sectionChild}>
            <SectionTitle
              eyebrow="Checklist"
              title="준비 자료"
              desc="모든 자료가 완벽하지 않아도 괜찮습니다. 확인 가능한 범위부터 시작합니다."
            />
          </motion.div>

          <motion.div variants={sectionChild} className="grid gap-5 md:grid-cols-2">
            <Card title="기본 자료">
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>가족관계/상속인 구성(대략적 정보도 가능)</li>
                <li>부동산 내역(주소/명의/취득가/대출 여부)</li>
                <li>금융자산 내역(예금/주식/펀드/채권 등)</li>
                <li>보험/연금 가입 내역(수익자/보장/수령 구조)</li>
              </ul>
            </Card>

            <Card title="있으면 더 좋은 자료">
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>자산별 보유 목적(거주/임대/투자 등)</li>
                <li>가족별 자금 수요/지원 계획(주거·교육·창업 등)</li>
                <li>법인 지분/가업 관련 자료(해당 시)</li>
                <li>기존 증여 이력(있다면 간단히)</li>
              </ul>
            </Card>
          </motion.div>
        </RevealSection>
      </div>

      <SiteFooter
        companyName="SY 컨설팅"
        infoLine="사업자등록번호 000-00-00000 | 대표 OOO | 서울시 OO구 OO로 00 | 02-000-0000 | Email: hello@sy.co.kr"
      />
    </div>
  );
}
