"use client";

import dynamic from "next/dynamic";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

export const HtmlCodeEditor = ({
  value,
  onChange,
  height = 420,
}: {
  value: string;
  onChange: (v: string) => void;
  height?: number;
}) => {
  return (
    <div className="space-y-2">
      <div className="text-sm font-semibold text-slate-800">HTML 소스 편집</div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <MonacoEditor
          height={height}
          language="html"
          theme="vs" // 다크 필요하면 "vs-dark"
          value={value}
          onChange={(v) => onChange(v ?? "")}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            tabSize: 2,
            wordWrap: "on",
            scrollBeyondLastLine: false,
            formatOnType: true,
            formatOnPaste: true,
            automaticLayout: true,
          }}
        />
      </div>

      <div className="text-xs text-slate-500">
        * Monaco(=VS Code 엔진) 기반 HTML 코드 에디터입니다.
      </div>
    </div>
  );
};
