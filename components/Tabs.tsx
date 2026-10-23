"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "문헌 정리", match: (p: string) => !p.startsWith("/map") },
  { href: "/map", label: "지형도", match: (p: string) => p.startsWith("/map") },
];

// usePathname이 대기하는 동안(빌드 시 모르는 경로) 보여 줄 활성 표시 없는 탭
export function TabsFallback() {
  return (
    <nav className="grid grid-cols-2">
      {tabs.map((t) => (
        <Link key={t.href} href={t.href} className="border-b-[3px] border-transparent py-3.5 text-center text-sm font-bold text-tab">
          {t.label}
        </Link>
      ))}
    </nav>
  );
}

export default function Tabs() {
  const pathname = usePathname();
  return (
    <nav className="grid grid-cols-2">
      {tabs.map((t) => {
        const active = t.match(pathname);
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`border-b-[3px] py-3.5 text-center text-sm font-bold transition-colors ${
              active ? "border-accent text-white" : "border-transparent text-tab hover:text-white/90"
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
