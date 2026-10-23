import fs from "fs";
import path from "path";
import { marked } from "marked";
import authorsData from "@/data/authors.json";

export type Section = { title: string; html: string };

export type Book = {
  id: string;
  no: number; // 기존 리딩리스트 번호 (본문의 "(23번)" 참조가 가리키는 번호)
  order: number; // 목록 순서: pin 문헌이 맨 앞, 나머지는 출판년도순 (자동 계산)
  pin: boolean;
  title: string;
  author: string; // 대표 저자 (저자 페이지 기준)
  authorLine: string; // frontmatter의 author 그대로 (편자·역자 포함)
  coauthors?: string[];
  year: number;
  category: string;
  keywords: string[];
  pdfs: string[];
  source: "pdf" | "scan" | "none";
  note?: string; // 인라인 HTML (기울임 등)
  summary?: string;
  thesis?: string; // 핵심 논지 (목록 카드용 평문)
  sections: Section[];
  premises: string[];
  grounds: string[];
  strengths: string[];
  limits: string[];
  searchText: string;
};

const dir = path.join(process.cwd(), "study", "books");

// 리딩리스트 PDF 폴더 (다른 위치면 READING_LIST_DIR 환경변수로 지정)
export const PDF_DIR =
  process.env.READING_LIST_DIR ?? "C:/Users/piano/Documents/종합시험/리딩리스트";

// 간단한 frontmatter 파서 (key: value, key: [a, b]) — study/build.mjs와 같은 규칙
function parseFrontmatter(raw: string) {
  const m = raw.replace(/\r\n/g, "\n").match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) throw new Error("frontmatter 없음");
  const meta: Record<string, string> = {};
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (kv) meta[kv[1]] = kv[2].trim().replace(/^"(.*)"$/, "$1");
  }
  return { meta, body: m[2] };
}

const list = (v = "") =>
  v.replace(/^\[|\]$/g, "").split(",").map((s) => s.trim()).filter(Boolean);

const plain = (s: string) =>
  s.replace(/\*\*|__|`/g, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").trim();

const isEmpty = (md: string) =>
  md.replace(/<!--[\s\S]*?-->/g, "").replace(/작성 전/g, "").trim() === "";

const bullets = (md = "") =>
  md.split("\n").filter((l) => /^- /.test(l)).map((l) => plain(l.slice(2)));

// "(23번)", "(5번, 6번)", "(34–35번)" 같은 리딩리스트 번호 참조를 책 페이지 링크로
function linkRefs(html: string, idByNo: Map<number, string>) {
  const link = (n: string, text: string) => {
    const id = idByNo.get(Number(n));
    return id ? `<a href="/books/${id}">${text}</a>` : text;
  };
  return html.replace(/\(\d{1,2}(?:[–-]\d{1,2})?번[^()]*\)/g, (group) =>
    group
      .replace(/(\d{1,2})([–-])(\d{1,2})번/g, (_, a, dash, b) => `${link(a, a)}${dash}${link(b, `${b}번`)}`)
      .replace(/(?<![\d>])(\d{1,2})번/g, (m, n) => link(n, m)),
  );
}

function load(): Book[] {
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
  const parsed = files.map((f) => ({
    id: f.replace(/\.md$/, "").replace(/^\d+-/, ""),
    ...parseFrontmatter(fs.readFileSync(path.join(dir, f), "utf-8")),
  }));
  const idByNo = new Map(parsed.map((p) => [Number(p.meta.no), p.id]));

  return parsed
    .map(({ id, meta, body }) => {
      // 맨 앞 인용문(> ...)은 서지 메모
      const noteMatch = body.match(/^\s*((?:>.*\n?)+)/);
      const note = noteMatch
        ? (marked.parseInline(
            noteMatch[1].split("\n").map((l) => l.replace(/^>\s?/, "")).join(" ").trim(),
          ) as string)
        : undefined;
      const rest = noteMatch ? body.slice(noteMatch[0].length) : body;

      const raw = rest
        .split(/^## /m)
        .slice(1)
        .map((chunk) => {
          const nl = chunk.indexOf("\n");
          return { title: chunk.slice(0, nl).trim(), md: chunk.slice(nl + 1).trim() };
        });
      const md = (t: string) => raw.find((s) => s.title === t)?.md;

      const names = meta.author.replace(/\s*\([^)]*\)/g, "").split(",").map((s) => s.trim());
      const summary = md("요약");
      const thesis = md("핵심 논지");

      return {
        id,
        no: Number(meta.no),
        order: 0,
        pin: meta.pin === "true",
        title: meta.title,
        author: names[0],
        authorLine: meta.author,
        coauthors: names.length > 1 ? names.slice(1) : undefined,
        year: Number(meta.year),
        category: meta.category,
        keywords: list(meta.keywords),
        pdfs: (meta.pdf ?? "").split("|").map((s) => s.trim()).filter(Boolean),
        source: (meta.source || "pdf") as Book["source"],
        note,
        summary: summary && !isEmpty(summary) ? plain(summary) : undefined,
        thesis: thesis && !isEmpty(thesis) ? plain(thesis) : undefined,
        sections: raw.map((s) => ({
          title: s.title,
          html: isEmpty(s.md) ? "" : linkRefs(marked.parse(s.md) as string, idByNo),
        })),
        premises: bullets(md("전제")),
        grounds: bullets(md("논리적 근거")),
        strengths: bullets(md("강점 / 의의")),
        limits: bullets(md("한계")),
        searchText: [meta.title, meta.author, meta.category, meta.keywords, plain(rest)]
          .join(" ")
          .toLowerCase(),
      };
    })
    .sort((a, b) => Number(b.pin) - Number(a.pin) || a.year - b.year || a.no - b.no)
    .map((b, i) => ({ ...b, order: i + 1 }));
}

// 매 요청마다 다시 읽으므로 dev 서버에서 MD를 고치고 새로고침하면 바로 반영된다
export const getBooks = () => load();

export const authorNotes: Record<string, string> = authorsData;

export const getBook = (id: string) => getBooks().find((b) => b.id === id);

export const getAuthors = () => Array.from(new Set(getBooks().map((b) => b.author)));

export const getBooksByAuthor = (name: string) =>
  getBooks()
    .filter((b) => b.author === name)
    .sort((a, b) => a.year - b.year);

export const getKeywords = () =>
  Array.from(new Set(getBooks().flatMap((b) => b.keywords))).sort();

export const getBooksByKeyword = (tag: string) =>
  getBooks().filter((b) => b.keywords.includes(tag));

export const getCategories = () => Array.from(new Set(getBooks().map((b) => b.category)));

// 지형도의 "Hepokoski", "A. B. Marx" 같은 이름으로 문헌 찾기 (저자·공저자·편자 포함)
export const getBooksByName = (name: string) => {
  const surname = name.trim().split(/\s+/).pop()!.toLowerCase();
  return getBooks().filter((b) =>
    b.authorLine.toLowerCase().split(/[^\p{L}]+/u).includes(surname),
  );
};
