import Link from "next/link";
import { notFound } from "next/navigation";
import booksData from "@/data/books.json";

type BookPageProps = {
  params: Promise<{ id: string }>;
};

export const instant = false;

export function generateStaticParams() {
  return booksData.map((book) => ({ id: String(book.id) }));
}

export default async function BookPage({ params }: BookPageProps) {
  const { id } = await params;
  const book = booksData.find((entry) => entry.id === Number(id));

  if (!book) {
    notFound();
  }

  const sections = [
    { title: "핵심 전제", items: book.premises },
    { title: "논거", items: book.grounds },
    { title: "강점", items: book.strengths },
    { title: "한계점", items: book.limits },
  ];

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-12">
      <article className="mx-auto max-w-3xl rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:p-10">
        <Link href="/" className="text-sm font-medium text-indigo-600 hover:underline">
          &larr; 문헌 목록
        </Link>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span className="rounded bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-800">
            {book.year}년 · #{book.id}
          </span>
          <span className="text-sm text-gray-500">{book.category}</span>
        </div>
        <h1 className="mt-3 text-3xl font-bold text-gray-900">{book.title}</h1>
        <Link
          href={`/authors/${encodeURIComponent(book.author)}`}
          className="mt-2 inline-block text-indigo-600 hover:underline"
        >
          {book.author}
        </Link>

        <section className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900">핵심 논지</h2>
          <p className="mt-2 leading-7 text-gray-700">{book.thesis}</p>
        </section>

        {sections.map(({ title, items }) => (
          <section key={title} className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <ul className="mt-2 list-disc space-y-2 pl-5 leading-7 text-gray-700">
              {items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ))}

        <section className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900">논리적 근거</h2>
          <p className="mt-2 leading-7 text-gray-700">{book.logicalbasis}</p>
        </section>

        <div className="mt-8 flex flex-wrap gap-2">
          {book.keywords.map((keyword) => (
            <Link
              key={keyword}
              href={`/keywords/${encodeURIComponent(keyword)}`}
              className="rounded bg-gray-100 px-2.5 py-1 text-sm text-gray-700 hover:bg-gray-200"
            >
              #{keyword}
            </Link>
          ))}
        </div>
      </article>
    </main>
  );
}
