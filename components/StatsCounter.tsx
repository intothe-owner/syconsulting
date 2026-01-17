"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

type StatItem = {
  value: number;
  label: string;
  decimals?: number;
  suffix?: string;
};

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function formatNumber(v: number, decimals = 0) {
  return v.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function useCountUp(target: number, start: boolean, resetKey: number, durationMs = 1200) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    // 화면 밖이면 0으로 리셋
    if (!start) {
      setVal(0);
      return;
    }

    let raf = 0;
    const startAt = performance.now();
    const from = 0;
    const to = target;

    const tick = (now: number) => {
      const elapsed = now - startAt;
      const t = Math.min(1, elapsed / durationMs);
      const eased = easeOutCubic(t);
      setVal(from + (to - from) * eased);

      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target, durationMs, resetKey]);

  return val;
}

function StatCell({
  item,
  visible,
  resetKey,
}: {
  item: StatItem;
  visible: boolean;
  resetKey: number;
}) {
  const current = useCountUp(item.value, visible, resetKey, 1200);
  const shown = formatNumber(current, item.decimals ?? 0);

  return (
    <div className="text-center">
      <div className="text-5xl font-bold tracking-tight text-blue-700 sm:text-4xl">
        {shown}
        {item.suffix ?? ""}
      </div>
      <div className="mt-2 text-lg font-semibold text-gray-900">{item.label}</div>
    </div>
  );
}

export default function StatsCounter() {
  const items: StatItem[] = useMemo(
    () => [
      { value: 581, label: "함께한 기업" },
      { value: 27845, label: "교육 수료생" },
      { value: 4.93, label: "평점", decimals: 2 },
      { value: 70.8, label: "성장율", decimals: 1, suffix: "%" },
    ],
    []
  );

  const [visible, setVisible] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 12 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      viewport={{ amount: 0.35, once: false }}
      onViewportEnter={() => {
        setVisible(true);
        setResetKey((k) => k + 1); // ✅ 들어올 때마다 카운터 재시작
      }}
      onViewportLeave={() => {
        setVisible(false); // ✅ 벗어나면 fadeOut
      }}
    >
      <div className="grid grid-cols-2 gap-y-10 sm:grid-cols-4 sm:gap-y-0">
        {items.map((it) => (
          <StatCell key={it.label} item={it} visible={visible} resetKey={resetKey} />
        ))}
      </div>
    </motion.div>
  );
}
