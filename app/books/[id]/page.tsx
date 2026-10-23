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

// 강조 카드로 보여 줄 섹션
const highlighted = new Set(["핵심 논지"]);

// "강점 / 의의" → "강 점 / 의 의" (소제목의 넓은 자간, 연속 공백은 HTML에서 하나로 합쳐짐)
const spaced = (s: string) => s.split("").join(" ");

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
    <main className="mx-auto max-w-4xl px-4 pt-8 pb-16 sm:px-6">
      <Link href="/" className="text-[13px] text-muted hover:text-accent">← 문헌 목록</Link>

      <p className="mt-5 text-sm tracking-wider text-accent">
        {book.order}번 · {book.category} · 기존 {book.no}번
      </p>
      <h2 className="mt-2 font-serif text-[1.75rem] leading-snug font-bold text-ink">{book.title}</h2>
      <p className="mt-2 text-[15px] text-muted">
        <Link href={`/authors/${encodeURIComponent(book.author)}`} className="text-ink hover:text-accent">
          {book.author}
        </Link>
        {book.authorLine !== book.author && <span> ({book.authorLine})</span>} · {book.year}
      </p>
      {book.note && (
        <p className="mt-2 text-[13px] leading-6 text-muted" dangerouslySetInnerHTML={{ __html: book.note }} />
      )}

      <div className="mt-4 flex flex-wrap gap-1.5 border-b border-line pb-6">
        {book.keywords.map((k) => (
          <Link
            key={k}
            href={`/keywords/${encodeURIComponent(k)}`}
            className="rounded bg-chip px-2 py-0.5 text-xs text-[#5a5650] hover:text-accent"
          >
            #{k}
          </Link>
        ))}
      </div>

      {book.source !== "pdf" && (
        <p className="mt-6 rounded border border-accent/30 bg-accent/5 px-4 py-3 text-[13px] leading-6 text-accent">
          {sourceNote[book.source]}
        </p>
      )}

      {book.sections.map((s) => (
        <section key={s.title}>
          <h3 className="kicker">{spaced(s.title)}</h3>
          {!s.html ? (
            <p className="text-muted">아직 작성 전</p>
          ) : highlighted.has(s.title) ? (
            <div className="card md font-medium" dangerouslySetInnerHTML={{ __html: s.html }} />
          ) : (
            <div className="md text-[15px]" dangerouslySetInnerHTML={{ __html: s.html }} />
          )}
        </section>
      ))}

      {book.pdfs.length > 0 && (
        <section>
          <h3 className="kicker">{spaced("원문 PDF")}</h3>
          <ul className="space-y-1 text-[13px]">
            {book.pdfs.map((f) => (
              <li key={f}>
                <a href={`/pdf?f=${encodeURIComponent(f)}`} target="_blank" className="text-accent underline underline-offset-2">
                  {f}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <nav className="mt-12 grid grid-cols-2 gap-4 border-t border-line pt-5 text-[13px]">
        <span>
          {prev && (
            <Link href={`/books/${prev.id}`} className="text-muted hover:text-accent">
              ← {prev.order}. {prev.title}
            </Link>
          )}
        </span>
        <span className="text-right">
          {next && (
            <Link href={`/books/${next.id}`} className="text-muted hover:text-accent">
              {next.order}. {next.title} →
            </Link>
          )}
        </span>
      </nav>
    </main>
  );
}
