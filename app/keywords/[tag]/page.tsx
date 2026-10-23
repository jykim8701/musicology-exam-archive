import Link from "next/link";
import { notFound } from "next/navigation";
import { getBooksByKeyword, getKeywords } from "@/lib/books";

export function generateStaticParams() {
  return getKeywords().map((tag) => ({ tag }));
}

function Cell({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-1 pl-4 marker:text-navy">
      {items.map((t, i) => (
        <li key={i}>{t}</li>
      ))}
    </ul>
  );
}

export default async function KeywordPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const keyword = decodeURIComponent(tag);
  const list = getBooksByKeyword(keyword);
  if (list.length === 0) notFound();

  return (
    <main className="mx-auto max-w-6xl px-4 pt-8 pb-16 sm:px-6">
      <Link href="/" className="text-[13px] text-muted hover:text-accent">← 문헌 목록</Link>
      <p className="mt-5 text-sm tracking-wider text-accent">KEYWORD</p>
      <h2 className="mt-2 font-serif text-[1.9rem] font-bold text-ink">#{keyword}</h2>
      <p className="mt-1 text-[15px] text-muted">{list.length}권 비교</p>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[800px] border-collapse bg-card text-[13px] leading-6">
          <thead>
            <tr className="bg-[#f0ebe3] text-left text-navy">
              <th className="border border-line p-2.5">문헌</th>
              <th className="border border-line p-2.5">전제</th>
              <th className="border border-line p-2.5">논리적 근거</th>
              <th className="border border-line p-2.5">강점 / 의의</th>
              <th className="border border-line p-2.5">한계</th>
            </tr>
          </thead>
          <tbody>
            {list.map((b) => (
              <tr key={b.id} className="align-top">
                <td className="border border-line p-2.5">
                  <Link href={`/books/${b.id}`} className="font-serif font-bold text-ink hover:text-accent">
                    {b.title}
                  </Link>
                  <div className="text-muted">{b.author}, {b.year}</div>
                </td>
                <td className="border border-line p-2.5"><Cell items={b.premises} /></td>
                <td className="border border-line p-2.5"><Cell items={b.grounds} /></td>
                <td className="border border-line p-2.5"><Cell items={b.strengths} /></td>
                <td className="border border-line p-2.5"><Cell items={b.limits} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
