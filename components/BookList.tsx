"use client";

import { useState } from "react";
import Link from "next/link";
import type { Book } from "@/lib/books";

export type BookListItem = Omit<Book, "sections" | "premises" | "grounds" | "strengths" | "limits">;

export default function BookList({
  books,
  categories,
}: {
  books: BookListItem[];
  categories: string[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");

  const q = query.trim().toLowerCase();
  const filtered = books.filter(
    (b) => (!q || b.searchText.includes(q)) && (!category || b.category === category),
  );

  const chip = (active: boolean) =>
    `rounded-full border px-3 py-1 text-[13px] transition-colors ${
      active ? "border-navy bg-navy text-white" : "border-line bg-card text-muted hover:border-navy/40"
    }`;

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="제목, 저자, 본문, 키워드로 검색"
        className="w-full rounded border border-line bg-card px-4 py-2.5 text-[15px] outline-none focus:border-navy/50"
      />

      <div className="mt-3 flex flex-wrap gap-2">
        <button onClick={() => setCategory("")} className={chip(category === "")}>
          전체
        </button>
        {categories.map((c) => (
          <button key={c} onClick={() => setCategory(category === c ? "" : c)} className={chip(category === c)}>
            {c}
          </button>
        ))}
      </div>

      <p className="mt-5 text-[13px] text-muted">{filtered.length}권 · 출판년도순 (Opera as Drama를 맨 앞에 고정)</p>

      <ul className="mt-3 grid gap-5 md:grid-cols-2">
        {filtered.map((b) => (
          <li
            key={b.id}
            className="flex flex-col rounded-lg border border-line bg-card p-6 shadow-[0_1px_3px_rgb(20_34_49/0.06)]"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="flex items-center gap-2 text-[13px]">
                <span className="font-serif font-bold text-accent">{b.order}</span>
                <span className="rounded bg-navy/8 px-2 py-0.5 font-bold text-navy">
                  {b.year}년 · #{b.no}
                </span>
              </span>
              <Link
                href={`/authors/${encodeURIComponent(b.author)}`}
                className="text-right text-[13px] text-navy/80 hover:text-accent"
              >
                {b.author}
                {b.coauthors && b.coauthors.length > 0 && <span className="text-muted"> 외</span>}
              </Link>
            </div>

            <Link
              href={`/books/${b.id}`}
              className="mt-3 font-serif text-[19px] leading-snug font-bold text-ink hover:text-accent"
            >
              {b.title}
            </Link>
            <p className="mt-1.5 text-[13px] text-muted">
              {b.category}
              {b.source !== "pdf" && <span className="ml-2 text-accent">⚠ 원문 미확인</span>}
            </p>

            {b.thesis && <p className="mt-3 line-clamp-3 text-[14px] leading-7 text-[#45474b]">{b.thesis}</p>}

            <div className="mt-4 flex flex-wrap gap-1.5">
              {b.keywords.slice(0, 5).map((k) => (
                <Link
                  key={k}
                  href={`/keywords/${encodeURIComponent(k)}`}
                  className="rounded bg-chip px-2 py-0.5 text-xs text-[#5a5650] hover:text-accent"
                >
                  #{k}
                </Link>
              ))}
            </div>

            {/* 카드 높이가 달라도 버튼은 항상 맨 아래 */}
            <div className="flex-1" />
            <Link
              href={`/books/${b.id}`}
              className="mt-5 block rounded-md bg-navy py-2.5 text-center text-[14px] font-bold text-white transition-colors hover:bg-accent"
            >
              상세 내용 보기 →
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
