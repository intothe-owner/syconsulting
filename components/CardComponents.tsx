import React from "react";

type Size = number | string;

interface CardComponentsProps {
  children: React.ReactNode;
  width?: Size;          // 900 | "900px" | "100%" 등
  height?: Size;         // 320 | "auto" 등
  mobileMaxWidth?: string; // 기본 "90vw" (원하면 "90%"로)
  className?: string;
  fullWidth?:boolean;//전체 가로 사이즈
}

const toCssSize = (v: Size) => (typeof v === "number" ? `${v}px` : v);

// px 값(숫자 또는 "123px")이면 모바일에서 min(px, 90vw) 적용
const toResponsiveWidth = (width: Size, mobileMax: string) => {
  if (typeof width === "number") return `min(${width}px, ${mobileMax})`;

  const w = width.trim();
  // "123px" 형태면 min 적용
  if (/^\d+(\.\d+)?px$/.test(w)) return `min(${w}, ${mobileMax})`;

  // "100%", "90vw", "rem" 등은 사용자가 의도한 값 그대로 사용
  return w;
};

export default function CardComponents({
  children,
  width = 600,
  height = "auto",
  mobileMaxWidth = "90vw", // ✅ 여기 "90%"로 바꿔도 됨
  className = "",
  fullWidth = false
}: CardComponentsProps) {
  const w = fullWidth===false?toResponsiveWidth(width, mobileMaxWidth):'100%';
  const h = toCssSize(height);

  return (
    <div
      style={{ width: w, height: h }}
      className={[
        "border rounded-[10px] border-black/20 shadow-md bg-white p-4",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}
