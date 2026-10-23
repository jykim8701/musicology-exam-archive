"use client";

import { useState } from "react";
import Link from "next/link";
import type { Book } from "@/lib/books";

export type BookListItem = Omit<Book, "sections" | "premises" | "grounds" | "strengths" | "limits">;

export default function BookList({
  books,
  keywords,
}: {
  books: BookListItem[];
  keywords: string[];
}) {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("");

  const q = query.trim().toLowerCase();
  const filtered = books.filter(
    (b) => (!q || b.searchText.includes(q)) && (!tag || b.keywords.includes(tag)),
  );

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="제목, 저자, 본문, 키워드로 검색"
        className="w-full rounded border border-gray-400 bg-transparent p-2"
      />

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          onClick={() => setTag("")}
          className={`rounded-full border px-3 py-1 text-sm ${
            tag === "" ? "bg-black/20 font-bold" : ""
          }`}
        >
          전체
        </button>
        {keywords.map((k) => (
          <button
            key={k}
            onClick={() => setTag(tag === k ? "" : k)}
            className={`rounded-full border px-3 py-1 text-sm ${
              tag === k ? "bg-black/20 font-bold" : ""
            }`}
          >
            {k}
          </button>
        ))}
      </div>

      <p className="mt-4 text-sm opacity-70">{filtered.length}권 (출판년도순)</p>

      <ul className="mt-2 space-y-3">
        {filtered.map((b) => (
          <li key={b.id} className="rounded border border-gray-400 p-4">
            <Link href={`/books/${b.id}`} className="text-lg font-bold underline">
              {b.order}. {b.title}
            </Link>
            <div className="text-sm opacity-80">
              <Link href={`/authors/${encodeURIComponent(b.author)}`} className="underline">
                {b.author}
              </Link>
              {b.coauthors && b.coauthors.length > 0 && (
                <span> 외 {b.coauthors.join(", ")}</span>
              )}{" "}
              · {b.year} · <span className="opacity-80">{b.no}번 · {b.category}</span>
              {b.source !== "pdf" && <span className="ml-1 text-amber-700 dark:text-amber-400">⚠ 원문 미확인</span>}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {b.keywords.map((k) => (
                <Link
                  key={k}
                  href={`/keywords/${encodeURIComponent(k)}`}
                  className="rounded-full bg-black/10 px-2 py-0.5 text-xs"
                >
                  #{k}
                </Link>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
