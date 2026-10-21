import BookList from "@/components/BookList";
import { books, getKeywords } from "@/lib/books";

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="mb-6 text-2xl font-bold">음악학 종합시험 문헌 정리</h1>
      <BookList books={books} keywords={getKeywords()} />
    </main>
  );
}
