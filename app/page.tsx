"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import booksData from "@/data/books.json";

export default function BookListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedKeyword, setSelectedKeyword] = useState("");

  const allKeywords = useMemo(() => {
    const keywords = new Set<string>();
    booksData.forEach((book) => {
      book.keywords.forEach((keyword) => keywords.add(keyword));
    });
    return Array.from(keywords).sort((a, b) => a.localeCompare(b, "ko"));
  }, []);

  const filteredBooks = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLocaleLowerCase();

    return booksData.filter((book) => {
      const matchesSearch =
        book.title.toLocaleLowerCase().includes(normalizedSearchTerm) ||
        book.author.toLocaleLowerCase().includes(normalizedSearchTerm);
      const matchesKeyword =
        !selectedKeyword || book.keywords.includes(selectedKeyword);

      return matchesSearch && matchesKeyword;
    });
  }, [searchTerm, selectedKeyword]);

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            음악학 종합시험 문헌 아카이브
          </h1>
          <p className="text-gray-600">
            총 {booksData.length}권의 핵심 문헌의 전제, 근거, 강점 및 한계점 정리
          </p>
        </header>

        <div className="mb-8 flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:flex-row">
          <input
            type="search"
            aria-label="책 제목 또는 저자 검색"
            placeholder="책 제목 또는 저자 검색..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            aria-label="키워드 필터"
            value={selectedKeyword}
            onChange={(event) => setSelectedKeyword(event.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">모든 키워드 보기</option>
            {allKeywords.map((keyword) => (
              <option key={keyword} value={keyword}>
                {keyword}
              </option>
            ))}
          </select>
        </div>

        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {filteredBooks.map((book) => (
              <article
                key={book.id}
                className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div>
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <span className="rounded bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-800">
                      {book.year}년 · #{book.id}
                    </span>
                    <Link
                      href={`/authors/${encodeURIComponent(book.author)}`}
                      className="text-right text-xs font-medium text-indigo-600 hover:underline"
                    >
                      {book.author}
                    </Link>
                  </div>
                  <h2 className="mb-1 text-xl font-bold text-gray-900">
                    <Link
                      href={`/books/${book.id}`}
                      className="transition-colors hover:text-blue-600"
                    >
                      {book.title}
                    </Link>
                  </h2>
                  <p className="mb-3 text-sm text-gray-500">{book.category}</p>
                  <p className="mb-4 line-clamp-2 text-sm text-gray-700">
                    {book.thesis}
                  </p>
                </div>

                <div>
                  <div className="mb-4 flex flex-wrap gap-1.5">
                    {book.keywords.map((keyword) => (
                      <Link
                        key={keyword}
                        href={`/keywords/${encodeURIComponent(keyword)}`}
                        className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-700 transition-colors hover:bg-gray-200"
                      >
                        #{keyword}
                      </Link>
                    ))}
                  </div>
                  <Link
                    href={`/books/${book.id}`}
                    className="block w-full rounded-lg bg-gray-900 py-2 text-center text-sm font-medium text-white hover:bg-gray-800"
                  >
                    상세 내용 보기 &rarr;
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-600">
            검색 결과가 없습니다.
          </p>
        )}
      </div>
    </main>
  );
}
