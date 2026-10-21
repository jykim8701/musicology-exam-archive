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
    <main className="mx-auto max-w-3xl p-6">
      <Link href="/" className="text-sm underline">← 목록</Link>
      <h1 className="mt-4 text-2xl font-bold">{author}</h1>

      <section className="mt-6">
        <h2 className="mb-2 text-lg font-bold">입장 변화 / 일관성</h2>
        <p className="whitespace-pre-wrap">
          {authorNotes[author] ?? "아직 작성 전 (data/authors.json에 추가)"}
        </p>
      </section>

      <section className="mt-6">
        <h2 className="mb-2 text-lg font-bold">저작 ({list.length}권, 연도순)</h2>
        <div className="space-y-4">
          {list.map((b) => (
            <div key={b.id} className="rounded border border-gray-400 p-4">
              <Link href={`/books/${b.id}`} className="font-bold underline">
                {b.title}
              </Link>{" "}
              <span className="text-sm opacity-70">({b.year})</span>
              <p className="mt-2 text-sm">
                <b>전제:</b> {b.premises.join(" / ") || "-"}
              </p>
              <p className="text-sm">
                <b>한계:</b> {b.limits.join(" / ") || "-"}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
