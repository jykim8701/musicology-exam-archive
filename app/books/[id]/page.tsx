import Link from "next/link";
import { notFound } from "next/navigation";
import { books, getBook } from "@/lib/books";

export function generateStaticParams() {
  return books.map((b) => ({ id: b.id }));
}

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="mt-6">
      <h2 className="mb-2 text-lg font-bold">{title}</h2>
      {items.length === 0 ? (
        <p className="opacity-60">아직 작성 전</p>
      ) : (
        <ul className="list-disc space-y-1 pl-5">
          {items.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default async function BookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const book = getBook(id);
  if (!book) notFound();

  return (
    <main className="mx-auto max-w-3xl p-6">
      <Link href="/" className="text-sm underline">← 목록</Link>

      <h1 className="mt-4 text-2xl font-bold">
        {book.order}. {book.title}
      </h1>
      <p className="opacity-80">
        <Link href={`/authors/${encodeURIComponent(book.author)}`} className="underline">
          {book.author}
        </Link>
        {book.coauthors && book.coauthors.length > 0 && (
          <span> 외 {book.coauthors.join(", ")}</span>
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

      {book.summary && (
        <section className="mt-6">
          <h2 className="mb-2 text-lg font-bold">요약</h2>
          <p className="whitespace-pre-wrap">{book.summary}</p>
        </section>
      )}

      <Section title="전제" items={book.premises} />
      <Section title="논리적 근거" items={book.grounds} />
      <Section title="강점 / 의의" items={book.strengths} />
      <Section title="한계" items={book.limits} />

      {book.related.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-2 text-lg font-bold">연결된 문헌 / 저자</h2>
          <ul className="list-disc space-y-1 pl-5">
            {book.related.map((rid) => {
              const r = getBook(rid);
              return (
                <li key={rid}>
                  {r ? (
                    <Link href={`/books/${rid}`} className="underline">
                      {r.title} ({r.author})
                    </Link>
                  ) : (
                    rid
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {book.files && book.files.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-2 text-lg font-bold">첨부 자료</h2>
          <ul className="list-disc space-y-1 pl-5">
            {book.files.map((f) => (
              <li key={f.path}>
                <a href={f.path} target="_blank" className="underline">
                  {f.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
