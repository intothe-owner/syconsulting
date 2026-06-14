"use client";

import ServiceTabsBar, { ServiceTabItem } from "@/components/ServiceTabsBar";
import SiteFooter from "@/components/SiteFooter";
import { motion, Variants } from "framer-motion";
import React from "react";
import {
  Monitor,
  Smartphone,
  Layers,
  CheckCircle2,
  Gift,
  FileCode2,
  MousePointerClick,
  AppWindow,
  Waypoints,
  Settings,
  Image as ImageIcon,
} from "lucide-react";
import Image from "next/image";



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

function IconBadge({
  children,
  tone = "blue",
}: {
  children: React.ReactNode;
  tone?: "blue" | "emerald" | "slate" | "indigo";
}) {
  const toneClass =
    tone === "emerald"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
      : tone === "slate"
      ? "bg-slate-100 text-slate-700 ring-slate-200"
      : tone === "indigo"
      ? "bg-indigo-50 text-indigo-700 ring-indigo-100"
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

type VisualItem = {
  icon: React.ReactNode;
  label: string;
  hint?: string;
  tone?: "blue" | "emerald" | "slate" | "indigo";
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
          <Gift className="h-4 w-4 text-blue-700" />
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

export default function DevelopmentFree() {
  return (
    <div className="-mt-16">
      <section className="relative w-full overflow-hidden bg-[url('/images/dev-bg.jpg')] bg-cover bg-center py-14 md:h-[400px] md:py-0">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center gap-8 px-4 md:gap-10">
          <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
            홈페이지 및 앱 개발(무료)
          </h1>
         
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl space-y-10 px-4 py-10 md:py-14">
        {/* 1) 핵심 조건 요약 */}
        <RevealSection className="space-y-4">
          <VisualPanel
            title="무료 제작 혜택 조건"
            items={[
              {
                tone: "emerald",
                icon: <Gift className="h-5 w-5" />,
                label: "컨설팅 계약 시",
                hint: "100% 무상 지원",
              },
              {
                tone: "blue",
                icon: <Layers className="h-5 w-5" />,
                label: "5페이지 이내",
                hint: "핵심 웹사이트 구축",
              },
              {
                tone: "slate",
                icon: <AppWindow className="h-5 w-5" />,
                label: "게시판 3개",
                hint: "공지사항, 문의 등",
              },
              {
                tone: "indigo",
                icon: <Smartphone className="h-5 w-5" />,
                label: "안드로이드 앱",
                hint: "전용 앱 무상 제작",
              },
            ]}
          />

          <RevealSection className="rounded-2xl border border-blue-200 bg-blue-50/50 p-7 shadow-sm">
            <motion.div variants={sectionChild}>
              <SectionTitle
                eyebrow="Special Offer"
                title="컨설팅과 함께, 비즈니스의 온라인 거점을 무료로 구축하세요"
                desc="컨설팅 계약을 진행하시는 고객님들께 사업 초기 꼭 필요한 공식 홈페이지와 안드로이드 전용 앱을 무상으로 개발해 드립니다. 비즈니스의 전문성을 한층 더 높여보세요."
                icon={
                  <IconBadge tone="blue">
                    <FileCode2 className="h-5 w-5" />
                  </IconBadge>
                }
              />
            </motion.div>
          </RevealSection>
        </RevealSection>

        {/* 2) 웹/앱 결과물 예시 (이미지 플레이스홀더 영역) */}
        <RevealSection className="space-y-4">
          <motion.div variants={sectionChild}>
            <SectionTitle
              eyebrow="Preview"
              title="제공되는 결과물 예시"
              desc="트렌디한 반응형 웹사이트와 사용자 친화적인 안드로이드 앱을 제작합니다."
              icon={
                <IconBadge tone="slate">
                  <Monitor className="h-5 w-5" />
                </IconBadge>
              }
            />
          </motion.div>

          <motion.div variants={sectionChild} className="grid gap-6 md:grid-cols-2">
            {/* 웹사이트 이미지 영역 */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="aspect-[4/3] w-full bg-slate-100 flex items-center justify-center relative">
                {/* 추후 여기에 실제 이미지를 <img>나 <Image> 태그로 교체하시면 됩니다 */}
                <div className="flex flex-col items-center gap-2 text-slate-400">
                  <Image 
                    src="/images/homepage.png" 
                    alt="반응형 웹사이트가 PC, 태블릿, 모바일 기기에 최적화된 예시"
                    fill
                    className="object-cover"
                    priority={true}
                    />
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <IconBadge tone="blue">
                    <Monitor className="h-4 w-4" />
                  </IconBadge>
                  <h3 className="text-lg font-extrabold text-slate-900">반응형 웹사이트</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  PC, 태블릿, 모바일 등 어떤 기기에서도 최적화되어 보이는 5페이지 이내의 브랜드 공식 홈페이지를 제작해 드립니다. (게시판 3개 포함)
                </p>
              </div>
            </div>

            {/* 안드로이드 앱 이미지 영역 */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="aspect-[4/3] w-full bg-slate-100 flex items-center justify-center relative">
                {/* 추후 여기에 실제 앱 화면 이미지를 교체하시면 됩니다 */}
                <div className="flex flex-col items-center gap-2 text-slate-400">
                  <Image 
                    src="/images/android.png" 
                    alt="반응형 웹사이트가 PC, 태블릿, 모바일 기기에 최적화된 예시"
                    fill
                    className="object-cover"
                    priority={true}
                    />
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <IconBadge tone="indigo">
                    <Smartphone className="h-4 w-4" />
                  </IconBadge>
                  <h3 className="text-lg font-extrabold text-slate-900">안드로이드 전용 앱</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  고객들이 스마트폰에서 바로 접근할 수 있는 안드로이드(Android) 전용 앱을 무상으로 빌드 및 제공하여 고객 접근성을 극대화합니다.
                </p>
              </div>
            </div>
          </motion.div>
        </RevealSection>

        {/* 3) 진행 가이드 */}
        <RevealSection className="space-y-4">
          <VisualPanel
            title="개발 진행 프로세스"
            items={[
              {
                tone: "slate",
                icon: <Waypoints className="h-5 w-5" />,
                label: "요구사항 수집",
                hint: "디자인 컨셉 및 메뉴 확정",
              },
              {
                tone: "blue",
                icon: <FileCode2 className="h-5 w-5" />,
                label: "웹/앱 개발",
                hint: "페이지 및 게시판 연동",
              },
              {
                tone: "emerald",
                icon: <MousePointerClick className="h-5 w-5" />,
                label: "검수 및 수정",
                hint: "디테일 조정",
              },
              {
                tone: "indigo",
                icon: <CheckCircle2 className="h-5 w-5" />,
                label: "최종 오픈",
                hint: "도메인 연결 및 앱 제공",
              },
            ]}
          />

          <motion.div variants={sectionChild}>
            <SectionTitle
              eyebrow="Notice"
              title="무료 제작 관련 유의사항"
              desc="원활한 개발 진행을 위해 아래 내용을 꼭 확인해 주세요."
              icon={
                <IconBadge tone="slate">
                  <Settings className="h-5 w-5" />
                </IconBadge>
              }
            />
          </motion.div>

          <motion.div variants={sectionChild} className="grid gap-5 md:grid-cols-2">
            <Card
              title="페이지 및 기능 추가"
              icon={
                <IconBadge tone="blue">
                  <Layers className="h-5 w-5" />
                </IconBadge>
              }
            >
              기본 제공되는 5페이지, 게시판 3개를 초과하거나 복잡한 맞춤형 기능(결제, 회원가입 고도화 등)이 추가될 경우, 별도의 실비가 발생할 수 있습니다.
            </Card>

            <Card
              title="iOS(애플) 앱 관련"
              icon={
                <IconBadge tone="indigo">
                  <Smartphone className="h-5 w-5" />
                </IconBadge>
              }
            >
              기본 무료 제공 내역은 <strong>안드로이드(Android) 앱</strong>에 한정됩니다. iOS(아이폰) 앱 개발 및 스토어 등록이 필요하신 경우 별도로 문의해 주시기 바랍니다.
            </Card>
          </motion.div>
        </RevealSection>
      </div>

      <SiteFooter companyName="IntoThe" />
    </div>
  );
}