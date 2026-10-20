import Link from "next/link";
import { notFound } from "next/navigation";
import booksData from "@/data/books.json";

type AuthorPageProps = {
  params: Promise<{ author: string }>;
};

export const instant = false;

export function generateStaticParams() {
  return Array.from(new Set(booksData.map((book) => book.author))).map((author) => ({
    author,
  }));
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { author } = await params;
  const decodedAuthor = decodeURIComponent(author);
  const authorBooks = booksData.filter((book) => book.author === decodedAuthor);

  if (authorBooks.length === 0) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="text-sm font-medium text-indigo-600 hover:underline">
          &larr; 문헌 목록
        </Link>
        <h1 className="mt-6 text-3xl font-bold text-gray-900">{decodedAuthor}</h1>
        <p className="mt-2 text-gray-600">이 저자의 문헌 {authorBooks.length}권</p>
        <ul className="mt-6 space-y-4">
          {authorBooks.map((book) => (
            <li
              key={book.id}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <p className="text-sm text-gray-500">
                {book.year}년 · {book.category}
              </p>
              <Link
                href={`/books/${book.id}`}
                className="mt-1 inline-block text-lg font-semibold text-gray-900 hover:text-blue-600"
              >
                {book.title}
              </Link>
              <p className="mt-2 line-clamp-2 text-sm text-gray-700">{book.thesis}</p>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
