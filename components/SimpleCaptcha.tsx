"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  length?: number; // 기본 5
  onValidChange?: (ok: boolean) => void;
};

const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const makeCode = (len: number) => {
  // 숫자만 (원하면 영문 섞어도 됨)
  let s = "";
  for (let i = 0; i < len; i++) s += String(randInt(0, 9));
  return s;
};

export default function SimpleCaptcha({ length = 5, onValidChange }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [code, setCode] = useState(() => makeCode(length));
  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false);

  const ok = useMemo(() => {
    if (!touched) return false;
    return value.trim() === code;
  }, [value, code, touched]);

  const refresh = () => {
    setCode(makeCode(length));
    setValue("");
    setTouched(false);
    onValidChange?.(false);
  };

  useEffect(() => {
    onValidChange?.(ok);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ok]);

  // canvas 렌더
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // 배경
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#F3F4F6"; // gray-100
    ctx.fillRect(0, 0, w, h);

    // 노이즈 라인
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.moveTo(randInt(0, w), randInt(0, h));
      ctx.lineTo(randInt(0, w), randInt(0, h));
      ctx.strokeStyle = `rgba(0,0,0,${Math.random() * 0.25})`;
      ctx.lineWidth = randInt(1, 2);
      ctx.stroke();
    }

    // 점 노이즈
    for (let i = 0; i < 50; i++) {
      ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.2})`;
      ctx.fillRect(randInt(0, w), randInt(0, h), 1, 1);
    }

    // 문자 그리기
    const fontSize = 28;
    ctx.font = `700 ${fontSize}px ui-sans-serif, system-ui, -apple-system`;
    ctx.textBaseline = "middle";

    const gap = w / (code.length + 1);
    for (let i = 0; i < code.length; i++) {
      const ch = code[i];
      const x = gap * (i + 1) + randInt(-6, 6);
      const y = h / 2 + randInt(-4, 4);
      const rot = (randInt(-15, 15) * Math.PI) / 180;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);

      ctx.fillStyle = "#111827"; // gray-900
      ctx.fillText(ch, -fontSize / 4, 0);
      ctx.restore();
    }
  }, [code]);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4">
      <div className="flex flex-wrap items-center gap-3">
        <canvas
          ref={canvasRef}
          width={180}
          height={56}
          className="rounded-xl border border-gray-200 bg-gray-50"
        />

        <button
          type="button"
          onClick={refresh}
          className="inline-flex h-11 items-center justify-center rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-800 hover:bg-gray-50"
        >
          새로고침
        </button>

        <div className="flex-1 min-w-[220px]">
          <input
            value={value}
            onChange={(e) => {
              setTouched(true);
              setValue(e.target.value);
            }}
            placeholder="자동방지번호 입력"
            className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-gray-400"
          />
          {touched && (
            <p className={`mt-1 text-xs ${ok ? "text-emerald-700" : "text-rose-600"}`}>
              {ok ? "확인되었습니다." : "자동방지번호가 일치하지 않습니다."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
