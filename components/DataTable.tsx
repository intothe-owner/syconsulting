"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export type DataTableHeader = {
  text: string; // 컬럼명
  value: string; // 데이터 키
  thClassName?: string;
  tdClassName?: string;
};

export type DataTableItem = Record<string, any> & {
  disabled?: boolean; // 행 비활성화
};

type DataTableProps = {
  headers: DataTableHeader[];
  items?: DataTableItem[];

  // selectable
  selectable?: boolean;
  itemKey?: string; // selection key (없으면 headers[0].value)
  updateSelection?: (selectedKeys: Array<string | number>) => void;

  // ✅ 행 링크 (체크박스 제외한 나머지 영역 클릭 시 이동)
  rowHref?: (item: DataTableItem, index: number) => string | null | undefined;

  // UI
  className?: string;
  emptyText?: string;

  // row click (링크 이동 전 추가 동작)
  onRowClick?: (item: DataTableItem, index: number) => void;
};

const cn = (...arr: Array<string | undefined | false>) => arr.filter(Boolean).join(" ");

export const DataTable = ({
  headers,
  items = [],
  selectable = false,
  itemKey,
  updateSelection,
  rowHref,
  className = "",
  emptyText = "데이터가 없습니다.",
  onRowClick,
}: DataTableProps) => {
  const router = useRouter();

  if (!headers || headers.length === 0) {
    throw new Error("<DataTable /> headers is required.");
  }

  const headerKeys = useMemo(() => headers.map((h) => h.value), [headers]);
  const keyField = itemKey || headerKeys[0];

  const enabledKeys = useMemo(() => {
    return items
      .filter((it) => !it.disabled)
      .map((it) => it[keyField] as string | number)
      .filter((v) => v !== undefined && v !== null);
  }, [items, keyField]);

  const [selection, setSelection] = useState<Set<string | number>>(new Set());
  const headCheckboxRef = useRef<HTMLInputElement | null>(null);

  // selection -> parent notify
  useEffect(() => {
    updateSelection?.(Array.from(selection));
  }, [selection, updateSelection]);

  const isAllSelected =
    enabledKeys.length > 0 && enabledKeys.every((k) => selection.has(k));
  const isSomeSelected =
    enabledKeys.some((k) => selection.has(k)) && !isAllSelected;

  useEffect(() => {
    if (!headCheckboxRef.current) return;
    headCheckboxRef.current.indeterminate = isSomeSelected;
  }, [isSomeSelected]);

  const toggleRow = (rowKey: string | number, disabled?: boolean) => {
    if (disabled) return;
    setSelection((prev) => {
      const next = new Set(prev);
      if (next.has(rowKey)) next.delete(rowKey);
      else next.add(rowKey);
      return next;
    });
  };

  const toggleAll = () => {
    setSelection((prev) => {
      const next = new Set(prev);
      if (isAllSelected) {
        enabledKeys.forEach((k) => next.delete(k));
      } else {
        enabledKeys.forEach((k) => next.add(k));
      }
      return next;
    });
  };

  return (
    <div
      className={cn(
        "w-full overflow-x-auto rounded-xl border border-slate-200 bg-white",
        className
      )}
    >
      <table className="w-full table-auto border-separate border-spacing-0 text-sm">
        <thead>
          <tr className="bg-slate-50">
            {selectable && (
              <th className="w-[48px] border-b border-slate-200 px-3 py-3">
                <input
                  ref={headCheckboxRef}
                  type="checkbox"
                  className="h-4 w-4 accent-indigo-600"
                  checked={isAllSelected}
                  onChange={toggleAll}
                  disabled={enabledKeys.length === 0}
                  aria-label="전체 선택"
                />
              </th>
            )}

            {headers.map((h) => (
              <th
                key={h.value}
                className={cn(
                  "border-b border-slate-200 px-4 py-3 text-left font-semibold text-slate-700",
                  h.thClassName
                )}
              >
                {h.text}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {items.length === 0 ? (
            <tr>
              <td
                colSpan={headers.length + (selectable ? 1 : 0)}
                className="px-4 py-10 text-center text-slate-500"
              >
                {emptyText}
              </td>
            </tr>
          ) : (
            items.map((item, index) => {
              const rowKey = item[keyField] as string | number;
              const disabled = !!item.disabled;
              const selected = selection.has(rowKey);
              const href = rowHref?.(item, index);

              return (
                <tr
                  key={rowKey ?? index}
                  className={cn(
                    "transition-colors",
                    disabled ? "opacity-60" : "hover:bg-slate-50",
                    selected ? "bg-indigo-50" : "",
                    href && !disabled ? "cursor-pointer" : ""
                  )}
                  onClick={() => {
                    if (disabled) return;

                    onRowClick?.(item, index);

                    if (href) router.push(href);
                  }}
                >
                  {selectable && (
                    <td className="border-b border-slate-200 px-3 py-3">
                      <input
                        type="checkbox"
                        className="h-4 w-4 accent-indigo-600"
                        checked={selected}
                        disabled={disabled}
                        onChange={() => toggleRow(rowKey, disabled)}
                        onClick={(e) => e.stopPropagation()} // ✅ 체크박스 클릭 시 링크 이동 방지
                        aria-label={`행 선택: ${rowKey}`}
                      />
                    </td>
                  )}

                  {headerKeys.map((k) => (
                    <td
                      key={`${String(k)}-${index}`}
                      className={cn(
                        "border-b border-slate-200 px-4 py-3 text-slate-800",
                        headers.find((h) => h.value === k)?.tdClassName
                      )}
                    >
                      {item?.[k]}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
