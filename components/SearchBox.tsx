"use client";

import React, { useEffect, useState } from "react";
import { Search, X } from "lucide-react";

type SearchBoxProps = {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  className?: string;
  disabled?: boolean;

  // ✅ 추가: 높이/버튼 폭 커스터마이즈
  heightClassName?: string;      // ex) "h-12"
  buttonMinWidthClassName?: string; // ex) "min-w-[96px]"
};

export const SearchBox = ({
  value,
  defaultValue = "",
  placeholder = "검색어를 입력하세요",
  onChange,
  onSearch,
  className = "",
  disabled = false,
  heightClassName = "h-12",
  buttonMinWidthClassName = "min-w-[96px]",
}: SearchBoxProps) => {
  const isControlled = value !== undefined;
  const [inner, setInner] = useState(defaultValue);

  const currentValue = isControlled ? value : inner;

  useEffect(() => {
    if (isControlled) return;
    setInner(defaultValue);
  }, [defaultValue, isControlled]);

  const setValue = (v: string) => {
    if (!isControlled) setInner(v);
    onChange?.(v);
  };

  const submit = () => onSearch?.(currentValue.trim());

  return (
    <div className={["w-full max-w-md", className].join(" ")}>
      <div
        className={[
          "flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3",
          "shadow-sm",
          "focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-200",
          disabled ? "opacity-60" : "",
          heightClassName, // ✅ 높이 고정
        ].join(" ")}
      >
        <Search className="h-5 w-5 text-slate-400" />

        <input
          value={currentValue}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
          placeholder={placeholder}
          disabled={disabled}
          className={[
            "w-full bg-transparent text-sm text-slate-900",
            "outline-none placeholder:text-slate-400",
            "h-full", // ✅ 컨테이너 높이 맞춰줌
          ].join(" ")}
        />

        {currentValue?.length > 0 && !disabled && (
          <button
            type="button"
            onClick={() => setValue("")}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-slate-100"
            aria-label="Clear"
          >
            <X className="h-4 w-4 text-slate-500" />
          </button>
        )}

        <button
          type="button"
          onClick={submit}
          disabled={disabled}
          className={[
            "inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 text-sm font-medium text-white",
            "hover:bg-indigo-700 transition-colors",
            "disabled:cursor-not-allowed disabled:opacity-60",
            "h-full",                 // ✅ 버튼 높이 = 컨테이너 높이
            "whitespace-nowrap",      // ✅ '검색' 줄바꿈 방지
            buttonMinWidthClassName,  // ✅ 버튼 폭 확보
          ].join(" ")}
        >
          검색
        </button>
      </div>
    </div>
  );
};

export default SearchBox;
