"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Rnd } from "react-rnd";

type ElementType = "text" | "image" | "video";

type BoxVariant =
  | "plain"
  | "border"
  | "shadow"
  | "rounded"
  | "roundedShadow"
  | "borderRounded";

type EditorElement = {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;

  bgColor: string;
  variant: BoxVariant;

  text?: string;
  fontSize?: number;
  color?: string;

  // media: dataURL 권장(새창 미리보기/저장에 안전)
  src?: string;
  fileName?: string;
};

type MenuState = {
  open: boolean;
  canvasX: number;
  canvasY: number;
};

const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `id_${Date.now()}_${Math.random().toString(16).slice(2)}`;

const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

function getVariantStyle(variant: BoxVariant): React.CSSProperties {
  switch (variant) {
    case "border":
      return { border: "1px solid rgba(148,163,184,0.9)" };
    case "shadow":
      return { boxShadow: "0 10px 24px rgba(15,23,42,0.12)" };
    case "rounded":
      return { borderRadius: 14 };
    case "roundedShadow":
      return { borderRadius: 14, boxShadow: "0 10px 24px rgba(15,23,42,0.12)" };
    case "borderRounded":
      return { border: "1px solid rgba(148,163,184,0.9)", borderRadius: 14 };
    case "plain":
    default:
      return {};
  }
}

function variantToInlineCss(variant: BoxVariant) {
  switch (variant) {
    case "border":
      return "border:1px solid rgba(148,163,184,0.9);";
    case "shadow":
      return "box-shadow:0 10px 24px rgba(15,23,42,0.12);";
    case "rounded":
      return "border-radius:14px;";
    case "roundedShadow":
      return "border-radius:14px;box-shadow:0 10px 24px rgba(15,23,42,0.12);";
    case "borderRounded":
      return "border:1px solid rgba(148,163,184,0.9);border-radius:14px;";
    case "plain":
    default:
      return "";
  }
}

function escapeHtml(s: string) {
  return (s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("파일을 읽을 수 없습니다."));
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.readAsDataURL(file);
  });
}

export default function DragDropTagEditor({
  initialHtml,
  onHtmlChange,
  syncKey
}: {
  initialHtml?: string; // 현재는 파싱 안 함(원하면 추후 HTML->요소 파서 추가 가능)
  onHtmlChange: (html: string) => void;
  syncKey?: number | string; // ✅ 추가
}) {
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);

  // ✅ contentEditable DOM 참조(커서 튐 방지 + 키 처리)
  const textRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [elements, setElements] = useState<EditorElement[]>([
    {
      id: uid(),
      type: "text",
      x: 60,
      y: 60,
      w: 320,
      h: 120,
      z: 1,
      bgColor: "#ffffff",
      variant: "plain",
      text: "텍스트를 클릭해서 편집하세요.",
      fontSize: 18,
      color: "#0f172a",
    },
  ]);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = useMemo(
    () => elements.find((e) => e.id === selectedId) ?? null,
    [elements, selectedId]
  );

  const [menu, setMenu] = useState<MenuState>({
    open: false,
    canvasX: 0,
    canvasY: 0,
  });

  // ✅ DOM(contentEditable)에서 텍스트를 읽어 상태에 반영
  const syncTextFromDom = (id: string) => {
    const node = textRefs.current[id];
    if (!node) return;
    const text = (node.textContent ?? "").toString();
    setElements((prev) => prev.map((p) => (p.id === id ? { ...p, text } : p)));
  };

  // ✅ 선택된 요소(박스) 삭제: Delete 키/메뉴 버튼 모두에서 재사용
  const removeSelected = (id?: string) => {
    const targetId = id ?? selectedId;
    if (!targetId) return;

    setElements((prev) => prev.filter((e) => e.id !== targetId));
    setSelectedId((prev) => (prev === targetId ? null : prev));
    setMenu((m) => ({ ...m, open: false }));
  };

  // ✅ 선택된 상태에서 Delete/Backspace 누르면 "요소(박스)" 삭제
  // - 단, contentEditable/입력폼 포커스 중이면 텍스트 편집 우선(박스 삭제 금지)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!selectedId) return;
      if (e.key !== "Delete" && e.key !== "Backspace") return;

      const ae = document.activeElement as HTMLElement | null;
      if (ae) {
        const tag = ae.tagName;
        if (ae.isContentEditable || tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") {
          return; // 텍스트/입력 편집 중에는 박스 삭제 금지
        }
      }

      e.preventDefault();
      e.stopPropagation();
      removeSelected(selectedId);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedId]); // removeSelected는 setState만 사용

  // ✅ 요소들로부터 HTML 생성 → 상위(PageCreatePage)의 form.content로 반영
  const generatedHtml = useMemo(() => {
    const items = elements
      .slice()
      .sort((a, b) => a.z - b.z)
      .map((el) => {
        const base =
          `position:absolute;left:${Math.round(el.x)}px;top:${Math.round(el.y)}px;` +
          `width:${Math.round(el.w)}px;height:${Math.round(el.h)}px;` +
          `background:${el.bgColor};box-sizing:border-box;overflow:hidden;` +
          variantToInlineCss(el.variant);

        if (el.type === "text") {
          const fs = el.fontSize ?? 18;
          const color = el.color ?? "#0f172a";
          const text = escapeHtml(el.text ?? "");
          return `<div style="${base}padding:12px;white-space:pre-wrap;word-break:break-word;color:${color};font-size:${fs}px;">${text}</div>`;
        }

        if (el.type === "image") {
          const src = el.src ? escapeHtml(el.src) : "";
          return `<img src="${src}" style="${base}padding:8px;object-fit:contain;" />`;
        }

        const vsrc = el.src ? escapeHtml(el.src) : "";
        return `<video src="${vsrc}" style="${base}padding:8px;object-fit:contain;" controls></video>`;
      })
      .join("\n");

    return `<div style="position:relative;width:100%;height:720px;">\n${items}\n</div>`;
  }, [elements]);

  useEffect(() => {
    onHtmlChange(generatedHtml);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generatedHtml]);

  const bringToFront = (id: string) => {
    setElements((prev) => {
      const maxZ = prev.reduce((m, e) => Math.max(m, e.z), 0);
      return prev.map((e) => (e.id === id ? { ...e, z: maxZ + 1 } : e));
    });
  };

  const selectElement = (id: string | null) => {
    setSelectedId(id);
    if (id) bringToFront(id);
  };

  const closeMenu = () => setMenu((m) => ({ ...m, open: false }));

  const openContextMenu = (clientX: number, clientY: number) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    const cx = rect ? clientX - rect.left : clientX;
    const cy = rect ? clientY - rect.top : clientY;
    setMenu({ open: true, canvasX: cx, canvasY: cy });
  };

  const addTextAt = (x: number, y: number) => {
    const id = uid();
    setElements((prev) => {
      const maxZ = prev.reduce((m, e) => Math.max(m, e.z), 0);
      return [
        ...prev,
        {
          id,
          type: "text",
          x: clamp(x, 0, 5000),
          y: clamp(y, 0, 5000),
          w: 320,
          h: 120,
          z: maxZ + 1,
          bgColor: "#ffffff",
          variant: "plain",
          text: "새 텍스트",
          fontSize: 18,
          color: "#0f172a",
        },
      ];
    });

    selectElement(id);
    closeMenu();

    requestAnimationFrame(() => {
      const el = document.querySelector(`[data-text-id="${id}"]`) as HTMLDivElement | null;
      el?.focus();
    });
  };

  const updateSelected = (patch: Partial<EditorElement>) => {
    if (!selectedId) return;
    setElements((prev) => prev.map((e) => (e.id === selectedId ? { ...e, ...patch } : e)));
  };

  const onCanvasContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    openContextMenu(e.clientX, e.clientY);
  };

  const onCanvasMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target?.dataset?.role === "dd-canvas") {
      selectElement(null);
      closeMenu();
    } else {
      closeMenu();
    }
  };

  const onElementContextMenu = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    selectElement(id);
    openContextMenu(e.clientX, e.clientY);
  };

  const onPickImage = () => imageInputRef.current?.click();
  const onPickVideo = () => videoInputRef.current?.click();

  const addMediaFromFile = async (
    type: "image" | "video",
    file: File,
    x: number,
    y: number
  ) => {
    const dataUrl = await fileToDataUrl(file);
    const id = uid();

    setElements((prev) => {
      const maxZ = prev.reduce((m, e) => Math.max(m, e.z), 0);
      const w = type === "image" ? 360 : 420;
      const h = type === "image" ? 240 : 260;

      return [
        ...prev,
        {
          id,
          type,
          x: clamp(x, 0, 5000),
          y: clamp(y, 0, 5000),
          w,
          h,
          z: maxZ + 1,
          bgColor: "#ffffff",
          variant: "borderRounded",
          src: dataUrl,
          fileName: file.name,
        },
      ];
    });

    selectElement(id);
    closeMenu();
  };

  const onImageInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await addMediaFromFile("image", file, menu.canvasX, menu.canvasY);
    } catch {
      alert("이미지 파일을 불러오지 못했습니다.");
    }
    e.target.value = "";
  };

  const onVideoInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await addMediaFromFile("video", file, menu.canvasX, menu.canvasY);
    } catch {
      alert("동영상 파일을 불러오지 못했습니다.");
    }
    e.target.value = "";
  };

  const fontSizes = [12, 14, 16, 18, 20, 24, 28, 32, 40];
  const importFromHtml = (html: string) => {
    const s = (html ?? "").trim();
    if (!s) return null;

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(s, "text/html");

      // wrapper: position:relative 컨테이너 찾기 (없으면 body 전체에서 검색)
      const root =
        doc.body.querySelector('div[style*="position:relative"]') ?? doc.body;

      const nodes = Array.from(root.children) as HTMLElement[];

      const parseStyle = (styleText: string) => {
        const map = new Map<string, string>();
        styleText
          .split(";")
          .map((x) => x.trim())
          .filter(Boolean)
          .forEach((kv) => {
            const idx = kv.indexOf(":");
            if (idx < 0) return;
            const k = kv.slice(0, idx).trim().toLowerCase();
            const v = kv.slice(idx + 1).trim();
            map.set(k, v);
          });
        return map;
      };

      const px = (v?: string) => {
        if (!v) return 0;
        const n = parseFloat(v.replace("px", "").trim());
        return Number.isFinite(n) ? n : 0;
      };

      const detectVariant = (st: Map<string, string>): BoxVariant => {
        const hasBorder = (st.get("border") ?? "").includes("solid");
        const hasShadow = (st.get("box-shadow") ?? "").length > 0;
        const radius = px(st.get("border-radius"));
        const hasRounded = radius > 0;

        if (hasBorder && hasRounded) return "borderRounded";
        if (hasRounded && hasShadow) return "roundedShadow";
        if (hasBorder) return "border";
        if (hasShadow) return "shadow";
        if (hasRounded) return "rounded";
        return "plain";
      };

      const imported: EditorElement[] = [];

      nodes.forEach((node, idx) => {
        const tag = node.tagName.toLowerCase();
        const st = parseStyle(node.getAttribute("style") ?? "");

        const x = px(st.get("left"));
        const y = px(st.get("top"));
        const w = px(st.get("width"));
        const h = px(st.get("height"));
        const bgColor = st.get("background") ?? "#ffffff";
        const variant = detectVariant(st);

        // 기본값 방어
        const safeW = Math.max(60, w || 320);
        const safeH = Math.max(40, h || 120);

        if (tag === "div") {
          const fontSize = px(st.get("font-size")) || 18;
          const color = st.get("color") || "#0f172a";
          const text = node.textContent ?? "";

          imported.push({
            id: uid(),
            type: "text",
            x,
            y,
            w: safeW,
            h: safeH,
            z: idx + 1,
            bgColor,
            variant,
            text,
            fontSize,
            color,
          });
          return;
        }

        if (tag === "img") {
          const src = (node as HTMLImageElement).getAttribute("src") ?? "";
          imported.push({
            id: uid(),
            type: "image",
            x,
            y,
            w: safeW,
            h: safeH,
            z: idx + 1,
            bgColor,
            variant,
            src,
            fileName: "image",
          });
          return;
        }

        if (tag === "video") {
          const src = (node as HTMLVideoElement).getAttribute("src") ?? "";
          imported.push({
            id: uid(),
            type: "video",
            x,
            y,
            w: safeW,
            h: safeH,
            z: idx + 1,
            bgColor,
            variant,
            src,
            fileName: "video",
          });
          return;
        }
      });

      // 아무것도 못 읽었으면 null
      if (!imported.length) return null;

      return imported;
    } catch {
      return null;
    }
  };
  // ✅ syncKey가 바뀔 때만 "코드 -> 에디터" 반영
  useEffect(() => {
    if (syncKey === undefined) return;
    const imported = importFromHtml(initialHtml ?? "");
    if (!imported) return;

    setElements(imported);
    setSelectedId(null);
    setMenu((m) => ({ ...m, open: false }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [syncKey]);
  return (
    <div className="relative">
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onImageInputChange}
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={onVideoInputChange}
      />

      <div
        ref={canvasRef}
        data-role="dd-canvas"
        onContextMenu={onCanvasContextMenu}
        onMouseDown={onCanvasMouseDown}
        className="relative h-[720px] w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
        <div className="pointer-events-none absolute left-3 top-3 rounded-lg bg-slate-900/70 px-3 py-2 text-xs text-white">
          우클릭: 메뉴 / 선택: 점선+핸들 / 테두리 드래그: 이동 / 선택 후 Delete: 박스 삭제
        </div>

        {elements
          .slice()
          .sort((a, b) => a.z - b.z)
          .map((el) => {
            const isSelected = el.id === selectedId;

            return (
              <Rnd
                key={el.id}
                bounds="parent"
                size={{ width: el.w, height: el.h }}
                position={{ x: el.x, y: el.y }}
                onDragStart={() => selectElement(el.id)}
                onDragStop={(_, d) => {
                  setElements((prev) =>
                    prev.map((p) => (p.id === el.id ? { ...p, x: d.x, y: d.y } : p))
                  );
                }}
                onResizeStart={() => selectElement(el.id)}
                onResizeStop={(_, __, ref, ___, pos) => {
                  const newW = Math.max(60, ref.offsetWidth);
                  const newH = Math.max(40, ref.offsetHeight);
                  setElements((prev) =>
                    prev.map((p) =>
                      p.id === el.id ? { ...p, w: newW, h: newH, x: pos.x, y: pos.y } : p
                    )
                  );
                }}
                style={{ zIndex: el.z }}
                enableResizing={{
                  top: false,
                  right: false,
                  bottom: false,
                  left: false,
                  topRight: true,
                  bottomRight: true,
                  bottomLeft: true,
                  topLeft: true,
                }}
                resizeHandleClasses={{
                  topLeft: "resize-handle tl",
                  topRight: "resize-handle tr",
                  bottomLeft: "resize-handle bl",
                  bottomRight: "resize-handle br",
                }}
                dragHandleClassName="drag-handle"
                onContextMenu={(e: any) => {
                  e.preventDefault?.();
                  onElementContextMenu(e as any, el.id);
                }}
              >
                <div
                  onMouseDown={() => selectElement(el.id)}
                  onContextMenu={(e) => onElementContextMenu(e, el.id)}
                  className="relative h-full w-full"
                  style={{
                    backgroundColor: el.bgColor,
                    ...getVariantStyle(el.variant),
                  }}
                >
                  {isSelected && (
                    <>
                      <div className="pointer-events-none absolute inset-0 rounded-[inherit] border-2 border-dashed border-slate-400" />
                      <div className="drag-handle edge top" />
                      <div className="drag-handle edge bottom" />
                      <div className="drag-handle edge left" />
                      <div className="drag-handle edge right" />
                    </>
                  )}

                  {el.type === "text" && (
                    <div className="h-full w-full p-3">
                      <div
                        data-text-id={el.id}
                        ref={(node) => {
                          textRefs.current[el.id] = node;

                          // ✅ 최초/필요 시에만 DOM에 텍스트 주입 (포커스 중이면 건드리지 않음)
                          if (!node) return;
                          const isFocused = document.activeElement === node;
                          if (isFocused) return;

                          const domText = node.textContent ?? "";
                          const stateText = el.text ?? "";
                          if (domText !== stateText) node.textContent = stateText;
                        }}
                        contentEditable
                        suppressContentEditableWarning
                        spellCheck={false}
                        className="h-full w-full outline-none"
                        style={{
                          fontSize: el.fontSize ?? 18,
                          color: el.color ?? "#0f172a",
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                          cursor: "text",
                        }}
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          selectElement(el.id);
                        }}
                        onFocus={() => selectElement(el.id)}
                        onInput={() => {
                          // ✅ 입력(타이핑/삭제 포함) 후 상태 동기화
                          syncTextFromDom(el.id);
                        }}
                        onKeyDown={(e) => {
                          // ✅ 텍스트 편집 중엔 전역 단축키/요소삭제와 충돌 방지
                          e.stopPropagation();

                          // 텍스트 삭제는 기본 동작 그대로
                          if (e.key === "Backspace" || e.key === "Delete") {
                            requestAnimationFrame(() => {
                              syncTextFromDom(el.id);
                            });
                          }
                        }}
                      />
                    </div>
                  )}

                  {el.type === "image" && (
                    <div className="h-full w-full p-2">
                      <img
                        src={el.src}
                        alt={el.fileName ?? "image"}
                        className="h-full w-full select-none rounded-xl object-contain"
                        draggable={false}
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          selectElement(el.id);
                        }}
                      />
                    </div>
                  )}

                  {el.type === "video" && (
                    <div className="h-full w-full p-2">
                      <video
                        src={el.src}
                        className="h-full w-full rounded-xl object-contain"
                        controls
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          selectElement(el.id);
                        }}
                      />
                    </div>
                  )}
                </div>
              </Rnd>
            );
          })}

        {menu.open && (
          <div
            className="absolute z-[9999] min-w-[300px] rounded-xl border border-slate-200 bg-white p-3 text-sm shadow-lg"
            style={{
              left: Math.max(8, menu.canvasX),
              top: Math.max(8, menu.canvasY),
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="mb-2 text-xs font-semibold text-slate-500">우클릭 메뉴</div>

            <div className="space-y-1">
              <button
                className="w-full rounded-lg px-3 py-2 text-left hover:bg-slate-50"
                onClick={() => addTextAt(menu.canvasX, menu.canvasY)}
              >
                텍스트 추가
              </button>

              <div className="h-px bg-slate-100" />

              <div className="flex items-center justify-between gap-3 px-1 py-1">
                <span className={selected?.type === "text" ? "text-slate-700" : "text-slate-300"}>
                  텍스트 사이즈
                </span>
                <select
                  className="w-[140px] rounded-lg border border-slate-200 px-2 py-1 text-sm disabled:opacity-40"
                  disabled={!selected || selected.type !== "text"}
                  value={selected?.fontSize ?? 18}
                  onChange={(e) => updateSelected({ fontSize: Number(e.target.value) })}
                >
                  {fontSizes.map((s) => (
                    <option key={s} value={s}>
                      {s}px
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between gap-3 px-1 py-1">
                <span className={selected?.type === "text" ? "text-slate-700" : "text-slate-300"}>
                  텍스트 색
                </span>
                <input
                  type="color"
                  className="h-8 w-[140px] cursor-pointer rounded-lg border border-slate-200 disabled:opacity-40"
                  disabled={!selected || selected.type !== "text"}
                  value={(selected?.type === "text" ? selected.color : "#0f172a") ?? "#0f172a"}
                  onChange={(e) => updateSelected({ color: e.target.value })}
                />
              </div>

              <div className="flex items-center justify-between gap-3 px-1 py-1">
                <span className={selected ? "text-slate-700" : "text-slate-300"}>
                  텍스트 박스 배경색
                </span>
                <input
                  type="color"
                  className="h-8 w-[140px] cursor-pointer rounded-lg border border-slate-200 disabled:opacity-40"
                  disabled={!selected}
                  value={selected?.bgColor ?? "#ffffff"}
                  onChange={(e) => updateSelected({ bgColor: e.target.value })}
                />
              </div>

              <div className="flex items-center justify-between gap-3 px-1 py-1">
                <span className={selected ? "text-slate-700" : "text-slate-300"}>
                  텍스트 박스(스타일)
                </span>
                <select
                  className="w-[140px] rounded-lg border border-slate-200 px-2 py-1 text-sm disabled:opacity-40"
                  disabled={!selected}
                  value={selected?.variant ?? "plain"}
                  onChange={(e) => updateSelected({ variant: e.target.value as BoxVariant })}
                >
                  <option value="plain">기본</option>
                  <option value="border">테두리</option>
                  <option value="shadow">그림자</option>
                  <option value="rounded">라운드</option>
                  <option value="borderRounded">테두리+라운드</option>
                  <option value="roundedShadow">라운드+그림자</option>
                </select>
              </div>

              <div className="h-px bg-slate-100" />

              <button
                className="w-full rounded-lg px-3 py-2 text-left hover:bg-slate-50"
                onClick={onPickImage}
              >
                이미지첨부(파일)
              </button>

              <button
                className="w-full rounded-lg px-3 py-2 text-left hover:bg-slate-50"
                onClick={onPickVideo}
              >
                동영상첨부(파일)
              </button>

              <div className="h-px bg-slate-100" />

              <div className="flex gap-2">
                <button
                  className="flex-1 rounded-lg border border-slate-200 px-3 py-2 hover:bg-slate-50"
                  onClick={closeMenu}
                >
                  닫기
                </button>
                <button
                  className="flex-1 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-rose-700 hover:bg-rose-100 disabled:opacity-40"
                  disabled={!selectedId}
                  onClick={() => removeSelected()}
                >
                  선택 삭제
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .edge {
          position: absolute;
          pointer-events: auto;
        }
        .edge.top {
          left: 0;
          right: 0;
          top: -6px;
          height: 12px;
          cursor: move;
        }
        .edge.bottom {
          left: 0;
          right: 0;
          bottom: -6px;
          height: 12px;
          cursor: move;
        }
        .edge.left {
          top: 0;
          bottom: 0;
          left: -6px;
          width: 12px;
          cursor: move;
        }
        .edge.right {
          top: 0;
          bottom: 0;
          right: -6px;
          width: 12px;
          cursor: move;
        }

        .resize-handle {
          width: 12px !important;
          height: 12px !important;
          border-radius: 9999px !important;
          background: #ffffff !important;
          border: 2px solid rgba(100, 116, 139, 0.9) !important;
          box-shadow: 0 6px 14px rgba(15, 23, 42, 0.14);
        }
        .resize-handle.tl {
          left: -7px !important;
          top: -7px !important;
        }
        .resize-handle.tr {
          right: -7px !important;
          top: -7px !important;
        }
        .resize-handle.bl {
          left: -7px !important;
          bottom: -7px !important;
        }
        .resize-handle.br {
          right: -7px !important;
          bottom: -7px !important;
        }
      `}</style>
    </div>
  );
}
