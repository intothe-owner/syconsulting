"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type ServiceTabItem = {
  label: string;
  href: string;
};

type Props = {
  items: ServiceTabItem[];
  className?: string;
  /** 모바일 컬럼 수 (기본 2) */
  mobileCols?: 1 | 2 | 3;
};

export default function ServiceTabsBar({
  items,
  className,
  mobileCols = 2,
}: Props) {
  const pathname = usePathname();

  const mobileGrid =
    mobileCols === 1
      ? "grid-cols-1"
      : mobileCols === 3
      ? "grid-cols-3"
      : "grid-cols-2";

  return (
    <div className={["w-full", className].join(" ")}>
      <div className="flex justify-center">
        {/* 폭은 가운데 정렬 */}
        <div className="w-full max-w-5xl">
          <div
            className={[
              "overflow-hidden",
              "border border-white/30 bg-white/10 backdrop-blur-md",
              "shadow-[0_10px_30px_rgba(0,0,0,0.18)]",
              // ✅ 모바일: grid로 내려가게 / ✅ md~: 가로 1줄 5등분
              "grid",
              mobileGrid,
              "md:grid-cols-5",
            ].join(" ")}
          >
            {items.map((tab) => {
              const active = pathname === tab.href;

              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  aria-current={active ? "page" : undefined}
                  className={[
                    "flex items-center justify-center",
                    "h-12 px-4 text-sm font-semibold md:h-14 md:px-6 md:text-base",
                    "transition",
                    // ✅ 그리드 셀 구분선(모바일/PC 모두)
                    "border-r border-b border-white/25",
                    // 마지막 열/행은 border 남아도 괜찮지만, 깔끔하게 하고 싶으면 아래에서 개선 가능
                    active
                      ? "bg-white text-neutral-900"
                      : "text-white/85 hover:bg-white/10 hover:text-white",
                  ].join(" ")}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
