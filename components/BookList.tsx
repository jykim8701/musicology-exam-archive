"use client";

import { useState } from "react";
import Link from "next/link";
import type { Book } from "@/lib/books";

export default function BookList({
  books,
  keywords,
}: {
  books: Book[];
  keywords: string[];
}) {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("");

  const q = query.trim().toLowerCase();
  const filtered = books.filter((b) => {
    const text = [
      b.title,
      b.author,
      ...(b.coauthors ?? []),
      ...b.premises,
      ...b.grounds,
      ...b.strengths,
      ...b.limits,
      ...b.keywords,
    ]
      .join(" ")
      .toLowerCase();
    return (!q || text.includes(q)) && (!tag || b.keywords.includes(tag));
  });

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="제목, 저자, 전제, 키워드로 검색"
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
              · {b.year}
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
