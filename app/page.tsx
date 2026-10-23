import BookList, { type BookListItem } from "@/components/BookList";
import { getBooks, getCategories } from "@/lib/books";

export default function Home() {
  // 클라이언트 목록에는 본문 HTML을 보내지 않는다
  const books = getBooks();
  const items: BookListItem[] = books.map((b) => ({
    id: b.id, no: b.no, order: b.order, pin: b.pin, title: b.title, author: b.author,
    authorLine: b.authorLine, coauthors: b.coauthors, year: b.year, category: b.category,
    keywords: b.keywords, pdfs: b.pdfs, source: b.source, note: b.note,
    summary: b.summary, thesis: b.thesis, searchText: b.searchText,
  }));

  return (
    <main className="mx-auto max-w-5xl px-4 pt-8 pb-16 sm:px-6">
      <p className="text-sm tracking-wider text-accent">READING LIST · {books.length}</p>
      <h2 className="mt-2 font-serif text-[1.9rem] font-bold tracking-wide text-ink">문헌 정리</h2>
      <p className="mt-1 text-[15px] text-muted">논지 · 근거 · 강점 · 한계, 그리고 시험 대비 포인트</p>
      <p className="mt-4 border-b border-line pb-6 text-[15px] leading-8 text-[#4a4c50]">
        리딩리스트의 문헌마다 핵심 논지와 구성, 전제와 논리적 근거, 강점과 한계를 정리했습니다.
        본문의 &lsquo;(23번)&rsquo; 같은 표기는 기존 리딩리스트 번호이며, 누르면 연결된 문헌으로 이동합니다. 또, 저자와 키워드를 누르면 같은 저자·주제의 문헌을 모아 볼 수 있습니다.
      </p>

      <h3 className="kicker">문 헌 목 록</h3>
      <BookList books={items} categories={getCategories()} />
    </main>
  );
}
