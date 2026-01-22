"use client";

import React from "react";

type Tone = "blue" | "amber" | "purple" | "slate";

/** 공통 카드 래퍼(이미지처럼 보이게) */
function VisualCard({
  title,
  subtitle,
  tone = "blue",
  children,
  className = "",
}: {
  title?: string;
  subtitle?: string;
  tone?: Tone;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`sy-visual sy-visual--${tone} ${className}`}>
      <div className="sy-visual__bg" aria-hidden />
      {(title || subtitle) && (
        <div className="sy-visual__header">
          {title ? <div className="sy-visual__title">{title}</div> : null}
          {subtitle ? <div className="sy-visual__sub">{subtitle}</div> : null}
        </div>
      )}
      <div className="sy-visual__body">{children}</div>
    </div>
  );
}

/** 1) Overview/소개 섹션용 — 흐름 리본 + 노드 3개 */
export function FlowRibbon({
  tone = "blue",
  labels = ["진단", "설계", "실행"],
}: {
  tone?: Tone;
  labels?: [string, string, string];
}) {
  return (
    <VisualCard
      tone={tone}
      title="Consulting Flow"
      subtitle="진단 → 설계 → 실행"
      className="sy-visual--h240"
    >
      <div className="sy-flow">
        <div className="sy-flow__ribbon" aria-hidden />
        <div className="sy-flow__node sy-flow__node--1">
          <div className="sy-flow__ring" />
          <div className="sy-flow__label">{labels[0]}</div>
        </div>
        <div className="sy-flow__node sy-flow__node--2">
          <div className="sy-flow__ring" />
          <div className="sy-flow__label">{labels[1]}</div>
        </div>
        <div className="sy-flow__node sy-flow__node--3">
          <div className="sy-flow__ring" />
          <div className="sy-flow__label">{labels[2]}</div>
        </div>
      </div>
    </VisualCard>
  );
}

/** 2) Process 섹션용 — 순환 오빗(원형) + 4개 점 */
export function OrbitCycle({
  tone = "purple",
  labels = ["현황", "분석", "실행", "점검"],
}: {
  tone?: Tone;
  labels?: [string, string, string, string];
}) {
  return (
    <VisualCard
      tone={tone}
      title="Cycle"
      subtitle="계획과 점검의 선순환"
      className="sy-visual--h280"
    >
      <div className="sy-orbit">
        <div className="sy-orbit__ring" aria-hidden />
        <div className="sy-orbit__dot sy-orbit__dot--top">
          <div className="sy-orbit__dotCore" />
          <div className="sy-orbit__txt">{labels[0]}</div>
        </div>
        <div className="sy-orbit__dot sy-orbit__dot--right">
          <div className="sy-orbit__dotCore" />
          <div className="sy-orbit__txt">{labels[1]}</div>
        </div>
        <div className="sy-orbit__dot sy-orbit__dot--bottom">
          <div className="sy-orbit__dotCore" />
          <div className="sy-orbit__txt">{labels[2]}</div>
        </div>
        <div className="sy-orbit__dot sy-orbit__dot--left">
          <div className="sy-orbit__dotCore" />
          <div className="sy-orbit__txt">{labels[3]}</div>
        </div>

        {/* 회전 하이라이트 (이미지 느낌) */}
        <div className="sy-orbit__sweep" aria-hidden />
      </div>
    </VisualCard>
  );
}

/** 3) Growth/로드맵 섹션용 — 상승 그래프 느낌 */
export function GrowthChart({
  tone = "amber",
  caption = "리스크를 줄이고, 성장을 설계합니다",
}: {
  tone?: Tone;
  caption?: string;
}) {
  return (
    <VisualCard
      tone={tone}
      title="Growth"
      subtitle={caption}
      className="sy-visual--h260"
    >
      <div className="sy-growth">
        <div className="sy-growth__grid" aria-hidden />
        <div className="sy-growth__axis" aria-hidden />
        <div className="sy-growth__line" aria-hidden />

        {/* 포인트 4개 */}
        <div className="sy-growth__pt sy-growth__pt--1" />
        <div className="sy-growth__pt sy-growth__pt--2" />
        <div className="sy-growth__pt sy-growth__pt--3" />
        <div className="sy-growth__pt sy-growth__pt--4" />

        <div className="sy-growth__note">KPI · 예산 · 현금흐름</div>
      </div>
    </VisualCard>
  );
}
