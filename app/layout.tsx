// app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "./providers";
import LayoutShell from "@/components/LayoutShell";

export const metadata: Metadata = {
  title: {
    default: "SY컨설팅",
    template: "%s | SY컨설팅",
  },
  description: "사업자·법인, 세무, 자산, 상속·증여 등 맞춤 컨설팅을 제공합니다.",
  keywords: [
    "SY컨설팅",
    "컨설팅",
    "세무",
    "세무대행",
    "사업자",
    "법인",
    "자산관리",
    "상속",
    "증여",
    "부동산세금",
  ],
  icons: {
    icon: "/icon.ico",
    shortcut: "/icon.ico",
  },
  robots: { index: true, follow: true },
  openGraph: {
    title: "SY컨설팅",
    description: "사업자·법인, 세무, 자산, 상속·증여 컨설팅",
    type: "website",
    locale: "ko_KR",
  },
};

// ✅ “타이틀바(주소창/상단바) 색상” = theme-color
export const viewport: Viewport = {
  themeColor: "#7dd3fc", // 연파랑 (Tailwind sky-300 느낌)
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-[#070b14] text-white">
        <Providers>
          <LayoutShell>{children}</LayoutShell>
        </Providers>
      </body>
    </html>
  );
}
