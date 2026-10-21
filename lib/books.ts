import fs from "fs";
import path from "path";
import authorsData from "@/data/authors.json";

export type Book = {
  id: string;
  title: string;
  author: string;
  year: number;
  no?: number; // 원래 목록 번호 (같은 해 안에서 순서를 정할 때 사용)
  order?: number; // 출판년도순 번호 (자동 계산)
  coauthors?: string[];
  note?: string;
  premises: string[];
  grounds: string[];
  strengths: string[];
  limits: string[];
  keywords: string[];
  summary?: string;
  files?: { label: string; path: string }[];
  related: string[];
};

const dir = path.join(process.cwd(), "data", "books");

// 출판년도순 정렬, 같은 해에는 원래 목록 번호(no) 순
export const books: Book[] = fs
  .readdirSync(dir)
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf-8")) as Book)
  .sort((a, b) => a.year - b.year || (a.no ?? 999) - (b.no ?? 999))
  .map((b, i) => ({ ...b, order: i + 1 }));

export const authorNotes: Record<string, string> = authorsData;

export const getBook = (id: string) => books.find((b) => b.id === id);

export const getAuthors = () =>
  Array.from(new Set(books.map((b) => b.author)));

export const getBooksByAuthor = (name: string) =>
  books.filter((b) => b.author === name).sort((a, b) => a.year - b.year);

export const getKeywords = () =>
  Array.from(new Set(books.flatMap((b) => b.keywords))).sort();

export const getBooksByKeyword = (tag: string) =>
  books.filter((b) => b.keywords.includes(tag));
