"use client";

import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

type SelectOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

type AnimatedSelectProps = {
  label?: string;
  value?: string; // controlled
  defaultValue?: string; // uncontrolled
  options: SelectOption[];
  placeholder?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
};

export const AnimatedSelect = ({
  label,
  value,
  defaultValue = "",
  options,
  placeholder = "선택하세요",
  onChange,
  disabled = false,
  className = "",
  buttonClassName = "",
  menuClassName = "",
}: AnimatedSelectProps) => {
  const id = useId();
  const isControlled = value !== undefined;

  const [inner, setInner] = useState(defaultValue);
  const [open, setOpen] = useState(false);

  const wrapRef = useRef<HTMLDivElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  const currentValue = isControlled ? value! : inner;

  const selected = useMemo(
    () => options.find((o) => o.value === currentValue),
    [options, currentValue]
  );

  const setValue = (v: string) => {
    if (!isControlled) setInner(v);
    onChange?.(v);
  };

  // 바깥 클릭 닫기
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!open) return;
      const el = wrapRef.current;
      if (!el) return;
      if (!el.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [open]);

  // ESC 닫기
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className={["w-full max-w-md", className].join(" ")} ref={wrapRef}>
      {label && (
        <label
          htmlFor={id}
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <button
          id={id}
          ref={btnRef}
          type="button"
          disabled={disabled}
          onClick={() => setOpen((v) => !v)}
          className={[
            "w-full flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2",
            "shadow-sm transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500",
            disabled ? "opacity-60 cursor-not-allowed" : "hover:bg-slate-50",
            buttonClassName,
          ].join(" ")}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span
            className={[
              "text-sm",
              selected ? "text-slate-900" : "text-slate-400",
            ].join(" ")}
          >
            {selected ? selected.label : placeholder}
          </span>

          <ChevronDown
            className={[
              "h-4 w-4 text-slate-500 transition-transform duration-200",
              open ? "rotate-180" : "rotate-0",
            ].join(" ")}
          />
        </button>

        {/* dropdown menu (animated) */}
        <div
          className={[
            "absolute left-0 right-0 z-50 mt-2 origin-top",
            // 열고 닫을 때 애니메이션
            "transition-all duration-150 ease-out",
            open
              ? "pointer-events-auto opacity-100 translate-y-0 scale-100"
              : "pointer-events-none opacity-0 -translate-y-1 scale-[0.98]",
          ].join(" ")}
        >
          <div
            className={[
              "max-h-64 overflow-auto rounded-xl border border-slate-200 bg-white shadow-lg p-1",
              menuClassName,
            ].join(" ")}
            role="listbox"
            aria-label="Select options"
          >
            {options.map((opt) => {
              const isSelected = opt.value === currentValue;
              const isDisabled = !!opt.disabled;

              return (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  disabled={isDisabled}
                  onClick={() => {
                    if (isDisabled) return;
                    setValue(opt.value);
                    setOpen(false);
                    btnRef.current?.focus();
                  }}
                  className={[
                    "w-full flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm",
                    "transition-colors",
                    isDisabled
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-slate-100",
                    isSelected ? "bg-indigo-50 text-indigo-700" : "text-slate-700",
                  ].join(" ")}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && <Check className="h-4 w-4" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedSelect;
