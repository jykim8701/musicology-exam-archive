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

      <ul className="mt-3 space-y-3">
        {filtered.map((b) => (
          <li key={b.id} className="card">
            <div className="flex items-baseline gap-3">
              <span className="w-7 shrink-0 text-right font-serif text-sm font-bold text-accent">{b.order}</span>
              <div className="min-w-0">
                <Link href={`/books/${b.id}`} className="font-serif text-[17px] font-bold text-ink hover:text-accent">
                  {b.title}
                </Link>
                <div className="mt-1 text-[13px] text-muted">
                  <Link href={`/authors/${encodeURIComponent(b.author)}`} className="hover:text-accent">
                    {b.author}
                  </Link>
                  {b.coauthors && b.coauthors.length > 0 && <span> 외 {b.coauthors.join(", ")}</span>}
                  {" · "}
                  {b.year} · {b.category} · 기존 {b.no}번
                  {b.source !== "pdf" && <span className="ml-2 text-accent">⚠ 원문 미확인</span>}
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {b.keywords.map((k) => (
                    <Link
                      key={k}
                      href={`/keywords/${encodeURIComponent(k)}`}
                      className="rounded bg-chip px-2 py-0.5 text-xs text-[#5a5650] hover:text-accent"
                    >
                      #{k}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
