import Link from "next/link";
import { notFound } from "next/navigation";
import { getBook, getBooks } from "@/lib/books";

export function generateStaticParams() {
  return getBooks().map((b) => ({ id: b.id }));
}

const sourceNote = {
  scan: "PDF가 스캔본이라 텍스트를 추출하지 못했습니다. 이 요약은 일반적인 학계 이해에 기반하므로 원문과 대조해 확인하세요.",
  none: "리딩리스트 폴더에 PDF가 없습니다. 이 요약은 일반적인 학계 이해에 기반하므로 원문과 대조해 확인하세요.",
};

export default async function BookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const book = getBook(id);
  if (!book) notFound();

  const books = getBooks();
  const i = books.findIndex((b) => b.id === book.id);
  const prev = books[i - 1];
  const next = books[i + 1];

  return (
    <main className="mx-auto max-w-3xl p-6">
      <Link href="/" className="text-sm underline">← 목록</Link>

      <p className="mt-4 text-sm opacity-70">
        {book.no}번 · {book.category}
      </p>
      <h1 className="text-2xl font-bold">{book.title}</h1>
      <p className="opacity-80">
        <Link href={`/authors/${encodeURIComponent(book.author)}`} className="underline">
          {book.author}
        </Link>
        {book.authorLine !== book.author && (
          <span className="opacity-80"> ({book.authorLine})</span>
        )}{" "}
        · {book.year}
      </p>
      {book.note && <p className="mt-1 text-sm opacity-70">{book.note}</p>}

      <div className="mt-3 flex flex-wrap gap-2">
        {book.keywords.map((k) => (
          <Link
            key={k}
            href={`/keywords/${encodeURIComponent(k)}`}
            className="rounded-full bg-black/10 px-2 py-0.5 text-sm"
          >
            #{k}
          </Link>
        ))}
      </div>

      {book.source !== "pdf" && (
        <p className="mt-4 rounded bg-amber-100 p-3 text-sm text-amber-900 dark:bg-amber-950 dark:text-amber-200">
          {sourceNote[book.source]}
        </p>
      )}

      {book.sections.map((s) => (
        <section key={s.title} className="mt-8">
          <h2 className="mb-2 border-b border-gray-400/40 pb-1 text-lg font-bold">{s.title}</h2>
          {s.html ? (
            <div className="md" dangerouslySetInnerHTML={{ __html: s.html }} />
          ) : (
            <p className="opacity-60">아직 작성 전</p>
          )}
        </section>
      ))}

      {book.pdfs.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-2 border-b border-gray-400/40 pb-1 text-lg font-bold">원문 PDF</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {book.pdfs.map((f) => (
              <li key={f}>
                <a href={`/pdf?f=${encodeURIComponent(f)}`} target="_blank" className="underline">
                  {f}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <nav className="mt-10 flex justify-between gap-4 text-sm">
        <span>{prev && <Link href={`/books/${prev.id}`} className="underline">← {prev.title}</Link>}</span>
        <span className="text-right">{next && <Link href={`/books/${next.id}`} className="underline">{next.title} →</Link>}</span>
      </nav>
    </main>
  );
}
