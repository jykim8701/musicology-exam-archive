import type { Metadata } from "next";
import { Suspense } from "react";
import Tabs, { TabsFallback } from "@/components/Tabs";
import "./globals.css";

export const metadata: Metadata = {
  title: "음악학 종합시험 문헌 아카이브",
  description: "음악학 종합시험 핵심 문헌의 전제, 근거, 강점 및 한계점을 살펴보세요.",
};

// 헤더 배경의 잔잔한 물결선
function Waves() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-1/2 h-24 w-full -translate-y-1/2"
      viewBox="0 0 1200 100"
      preserveAspectRatio="none"
    >
      {[0, 14, 28].map((y) => (
        <path
          key={y}
          d={`M0 ${40 + y} C 200 ${20 + y}, 400 ${60 + y}, 600 ${40 + y} S 1000 ${20 + y}, 1200 ${40 + y}`}
          fill="none"
          stroke="white"
          strokeOpacity={0.06}
          strokeWidth={1.5}
        />
      ))}
    </svg>
  );
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <head>
        {/* 한글 폰트는 분할 파일이 많아 next/font 대신 스타일시트로 불러온다 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* 루트 레이아웃이라 모든 페이지에 적용되므로 이 규칙(Pages Router용)은 해당 없음 */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&family=Noto+Serif+KR:wght@500;700&display=swap"
        />
      </head>
      <body className="flex min-h-full flex-col">
        <header className="bg-navy">
          <div className="relative overflow-hidden">
            <Waves />
            <div className="relative mx-auto max-w-4xl px-4 py-8 sm:px-6">
              <p className="text-[11px] font-bold tracking-[0.35em] text-white/80">
                음 악 학 · 종 합 시 험
              </p>
              <h1 className="mt-2 font-serif text-3xl font-bold text-white">문헌 아카이브</h1>
              <p className="mt-3 text-[13px] leading-6 text-white/75">
                리딩리스트 48권의 논지와 근거, 한계를 정리하고
                <br />
                토픽과 연결축으로 서로 비교하는 공부 노트
              </p>
            </div>
          </div>
          <div className="border-t border-white/10">
            <div className="mx-auto max-w-4xl px-4 sm:px-6">
              <Suspense fallback={<TabsFallback />}>
                <Tabs />
              </Suspense>
            </div>
          </div>
        </header>
        <div className="flex-1">{children}</div>
      </body>
    </html>
  );
}
