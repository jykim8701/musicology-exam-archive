import BookList, { type BookListItem } from "@/components/BookList";
import { getBooks, getKeywords } from "@/lib/books";

export default function Home() {
  // 클라이언트 목록에는 본문 HTML을 보내지 않는다
  const items: BookListItem[] = getBooks().map((b) => ({
    id: b.id, no: b.no, order: b.order, title: b.title, author: b.author,
    authorLine: b.authorLine, coauthors: b.coauthors, year: b.year, category: b.category,
    keywords: b.keywords, pdfs: b.pdfs, source: b.source, note: b.note,
    summary: b.summary, searchText: b.searchText,
  }));
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="mb-6 text-2xl font-bold">음악학 종합시험 문헌 정리</h1>
      <BookList books={items} keywords={getKeywords()} />
    </main>
  );
}
