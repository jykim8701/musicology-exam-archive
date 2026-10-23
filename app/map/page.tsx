import Link from "next/link";
import { approach, axes, debates, mapIntro, oneLine, topics } from "@/data/map";
import { getAuthors, getBooksByName, type Book } from "@/lib/books";

export const metadata = { title: "지형도 · 음악학 종합시험 문헌 아카이브" };

// 지형도의 이름("Hepokoski")에 해당하는 저자 페이지 (대표 저자일 때만)
function authorPage(name: string, authors: string[]) {
  const surname = name.split(/\s+/).pop();
  return authors.find((a) => a.split(/\s+/).pop() === surname);
}

export default function MapPage() {
  const authors = getAuthors();

  return (
    <main className="mx-auto max-w-4xl px-4 pt-8 pb-16 sm:px-6">
      <p className="text-sm tracking-wider text-accent">TOPIC MAP</p>
      <h2 className="mt-2 font-serif text-[1.9rem] font-bold tracking-wide text-ink">{mapIntro.title}</h2>
      <p className="mt-1 text-[15px] text-muted">{mapIntro.subtitle}</p>
      <p className="mt-4 border-b border-line pb-6 text-[15px] leading-8 text-[#4a4c50]">
        <span className="mr-2 rounded bg-navy px-2 py-0.5 text-xs font-bold text-white">목표</span>
        {mapIntro.goal}
      </p>

      <h3 className="kicker">1 . 답 안 접 근 법</h3>
      <ol className="grid gap-3 sm:grid-cols-4">
        {approach.steps.map((s, i) => (
          <li key={s} className="card flex items-center gap-3 !px-4">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">
              {i + 1}
            </span>
            <span className="text-[14px] font-medium leading-snug">{s}</span>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-[14px] text-muted">
        <b className="text-ink">{approach.note.title}</b> — {approach.note.body}
      </p>

      <h3 className="kicker">2 . 핵 심 토 픽 지 도</h3>
      <div className="grid gap-4 md:grid-cols-2">
        {topics.map((t, i) => {
          const related = new Map<string, Book>();
          t.authors.forEach((a) => getBooksByName(a).forEach((b) => related.set(b.id, b)));
          return (
            <article key={t.title} className="card">
              <h4 className="flex items-baseline gap-2.5 font-serif text-[17px] font-bold text-ink">
                <span className="text-accent">{i + 1}</span>
                {t.title}
              </h4>
              <dl className="mt-3 space-y-2.5 text-[14px] leading-6">
                <div>
                  <dt className="text-xs font-bold tracking-wider text-accent">핵심 질문</dt>
                  <dd>{t.question}</dd>
                </div>
                <div>
                  <dt className="text-xs font-bold tracking-wider text-accent">주요 저자</dt>
                  <dd>
                    {t.authors.map((a, j) => {
                      const page = authorPage(a, authors);
                      return (
                        <span key={a}>
                          {j > 0 && ", "}
                          {page ? (
                            <Link href={`/authors/${encodeURIComponent(page)}`} className="hover:text-accent">
                              {a}
                            </Link>
                          ) : (
                            a
                          )}
                        </span>
                      );
                    })}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-bold tracking-wider text-accent">핵심 키워드</dt>
                  <dd className="mt-1 flex flex-wrap gap-1.5">
                    {t.keywords.map((k) => (
                      <span key={k} className="rounded bg-chip px-2 py-0.5 text-xs text-[#5a5650]">{k}</span>
                    ))}
                  </dd>
                </div>
                {related.size > 0 && (
                  <div className="border-t border-line pt-2.5">
                    <dt className="text-xs font-bold tracking-wider text-accent">관련 문헌</dt>
                    <dd className="mt-1 space-y-0.5 text-[13px]">
                      {[...related.values()]
                        .sort((a, b) => a.order - b.order)
                        .map((b) => (
                          <Link key={b.id} href={`/books/${b.id}`} className="block text-muted hover:text-accent">
                            {b.order}. {b.title}
                          </Link>
                        ))}
                    </dd>
                  </div>
                )}
              </dl>
            </article>
          );
        })}
      </div>

      <h3 className="kicker">3 . 가 장 중 요 한 연 결 축</h3>
      <ol className="space-y-3">
        {axes.map((a, i) => (
          <li key={a.summary} className="card">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
              <span className="mr-1 font-serif font-bold text-accent">{i + 1}</span>
              {a.chain.map((c, j) => (
                <span key={c} className="flex items-center gap-2">
                  {j > 0 && <span className="text-muted">→</span>}
                  <span className="rounded bg-navy/90 px-2.5 py-0.5 text-[13px] font-medium text-white">{c}</span>
                </span>
              ))}
            </div>
            <p className="mt-2 text-[14px] leading-6 text-muted">{a.summary}</p>
          </li>
        ))}
      </ol>

      <h3 className="kicker">4 . 시 험 에 서 자 주 엮 이 는 큰 논 점</h3>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {debates.map((d) => (
          <li key={d} className="rounded border border-line bg-card px-4 py-3 text-center text-[14px] font-medium">
            {d}
          </li>
        ))}
      </ul>

      <div className="card mt-10 !border-l-accent">
        <p className="text-xs font-bold tracking-[0.25em] text-accent">한 줄 정리</p>
        <p className="mt-2 font-serif text-[16px] leading-8 text-ink">{oneLine}</p>
      </div>
    </main>
  );
}
