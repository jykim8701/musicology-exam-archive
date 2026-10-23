import Link from "next/link";
import { notFound } from "next/navigation";
import { authorNotes, getAuthors, getBooksByAuthor } from "@/lib/books";

export function generateStaticParams() {
  return getAuthors().map((name) => ({ name }));
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const author = decodeURIComponent(name);
  const list = getBooksByAuthor(author);
  if (list.length === 0) notFound();

  return (
    <main className="mx-auto max-w-4xl px-4 pt-8 pb-16 sm:px-6">
      <Link href="/" className="text-[13px] text-muted hover:text-accent">← 문헌 목록</Link>
      <p className="mt-5 text-sm tracking-wider text-accent">AUTHOR</p>
      <h2 className="mt-2 font-serif text-[1.9rem] font-bold text-ink">{author}</h2>

      <h3 className="kicker">입 장 변 화 / 일 관 성</h3>
      <p className="text-[15px] leading-8 whitespace-pre-wrap">
        {authorNotes[author] ?? <span className="text-muted">아직 작성 전 (data/authors.json에 추가)</span>}
      </p>

      <h3 className="kicker">저 작 ({list.length}권, 연도순)</h3>
      <div className="space-y-3">
        {list.map((b) => (
          <div key={b.id} className="card">
            <Link href={`/books/${b.id}`} className="font-serif text-[17px] font-bold text-ink hover:text-accent">
              {b.title}
            </Link>{" "}
            <span className="text-[13px] text-muted">({b.year} · {b.order}번 · 기존 {b.no}번)</span>
            {b.summary && <p className="mt-2 line-clamp-3 text-[14px] leading-7 text-[#4a4c50]">{b.summary}</p>}
            <p className="mt-2 text-[13px] leading-6">
              <b className="text-navy">전제</b> <span className="text-muted">{b.premises.join(" / ") || "-"}</span>
            </p>
            <p className="text-[13px] leading-6">
              <b className="text-navy">한계</b> <span className="text-muted">{b.limits.join(" / ") || "-"}</span>
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
