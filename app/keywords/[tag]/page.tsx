import Link from "next/link";
import { notFound } from "next/navigation";
import { getBooksByKeyword, getKeywords } from "@/lib/books";

export function generateStaticParams() {
  return getKeywords().map((tag) => ({ tag }));
}

function Cell({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-1 pl-4">
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
    <main className="mx-auto max-w-6xl p-6">
      <Link href="/" className="text-sm underline">← 목록</Link>
      <h1 className="mt-4 text-2xl font-bold">#{keyword}</h1>
      <p className="opacity-70">{list.length}권 비교</p>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[800px] border-collapse text-sm">
          <thead>
            <tr className="text-left">
              <th className="border border-gray-400 p-2">문헌</th>
              <th className="border border-gray-400 p-2">전제</th>
              <th className="border border-gray-400 p-2">논리적 근거</th>
              <th className="border border-gray-400 p-2">강점 / 의의</th>
              <th className="border border-gray-400 p-2">한계</th>
            </tr>
          </thead>
          <tbody>
            {list.map((b) => (
              <tr key={b.id} className="align-top">
                <td className="border border-gray-400 p-2">
                  <Link href={`/books/${b.id}`} className="font-bold underline">
                    {b.title}
                  </Link>
                  <div className="opacity-70">{b.author}, {b.year}</div>
                </td>
                <td className="border border-gray-400 p-2"><Cell items={b.premises} /></td>
                <td className="border border-gray-400 p-2"><Cell items={b.grounds} /></td>
                <td className="border border-gray-400 p-2"><Cell items={b.strengths} /></td>
                <td className="border border-gray-400 p-2"><Cell items={b.limits} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
