// study/books/*.md → study/html/*.html
// 실행: npm run study
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { marked } from "marked";

const root = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(root, "books");
const outDir = path.join(root, "html");
const pdfDir = "C:/Users/piano/Documents/종합시험/리딩리스트";

// 간단한 frontmatter 파서 (key: value, key: [a, b])
function parse(file) {
  const raw = fs.readFileSync(file, "utf-8").replace(/\r\n/g, "\n");
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) throw new Error(`frontmatter 없음: ${file}`);
  const meta = {};
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (!kv) continue;
    let v = kv[2].trim().replace(/^"(.*)"$/, "$1");
    if (kv[1] !== "pdf" && v.startsWith("[") && v.endsWith("]")) {
      v = v.slice(1, -1).split(",").map((s) => s.trim()).filter(Boolean);
    }
    meta[kv[1]] = v;
  }
  return { ...meta, slug: path.basename(file, ".md"), body: m[2] };
}

const esc = (s) =>
  String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

const css = `
:root{--bg:#fbfaf7;--fg:#1d1b18;--muted:#6b665e;--line:#e4e0d8;--card:#fff;--accent:#7a3e1d;--chip:#f1ece3;--warn:#8a5a00;--warnbg:#fff4d6}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#161513;--fg:#ece8e1;--muted:#a39d93;--line:#2e2b27;--card:#1e1c1a;--accent:#e0a37c;--chip:#2a2723;--warn:#f0c060;--warnbg:#332a14}}
:root[data-theme="dark"]{--bg:#161513;--fg:#ece8e1;--muted:#a39d93;--line:#2e2b27;--card:#1e1c1a;--accent:#e0a37c;--chip:#2a2723;--warn:#f0c060;--warnbg:#332a14}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.75 "Pretendard","Apple SD Gothic Neo","Malgun Gothic",system-ui,sans-serif}
main{max-width:46rem;margin:0 auto;padding:2rem 1rem 4rem}
a{color:var(--accent)}
h1{font-size:1.7rem;line-height:1.3;margin:.5rem 0}
h2{font-size:1.15rem;margin:2.2rem 0 .6rem;padding-bottom:.3rem;border-bottom:1px solid var(--line)}
h3{font-size:1rem;margin:1.4rem 0 .4rem}
.meta{color:var(--muted);font-size:.95rem}
.chips{display:flex;flex-wrap:wrap;gap:.35rem;margin:.8rem 0}
.chip{background:var(--chip);border-radius:999px;padding:.05rem .6rem;font-size:.82rem}
.warn{background:var(--warnbg);color:var(--warn);border-radius:.4rem;padding:.5rem .8rem;font-size:.9rem;margin:1rem 0}
blockquote{margin:1rem 0;padding:.2rem 1rem;border-left:3px solid var(--accent);color:var(--muted)}
table{border-collapse:collapse;width:100%;font-size:.92rem;display:block;overflow-x:auto}
th,td{border:1px solid var(--line);padding:.35rem .6rem;text-align:left;vertical-align:top}
code{background:var(--chip);padding:0 .3rem;border-radius:.2rem}
.nav{display:flex;justify-content:space-between;gap:1rem;margin-top:3rem;font-size:.9rem}
input{width:100%;padding:.6rem .8rem;font:inherit;border:1px solid var(--line);border-radius:.5rem;background:var(--card);color:var(--fg)}
.list{list-style:none;padding:0;margin:1rem 0}
.list li{background:var(--card);border:1px solid var(--line);border-radius:.6rem;padding:.7rem .9rem;margin:.5rem 0}
.list a{text-decoration:none;font-weight:600}
.list .meta{font-size:.85rem}
.no{display:inline-block;min-width:2.4rem;color:var(--muted);font-variant-numeric:tabular-nums}
`;

const page = (title, body) => `<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title><style>${css}</style></head>
<body><main>${body}</main></body></html>`;

const sourceNote = {
  scan: "PDF가 스캔본이라 텍스트를 추출하지 못했습니다. 이 요약은 일반적인 학계 이해에 기반하므로 원문과 대조해 확인하세요.",
  none: "리딩리스트 폴더에 PDF가 없습니다. 이 요약은 일반적인 학계 이해에 기반하므로 원문과 대조해 확인하세요.",
};

const books = fs
  .readdirSync(srcDir)
  .filter((f) => f.endsWith(".md"))
  .map((f) => parse(path.join(srcDir, f)))
  .sort((a, b) => parseFloat(a.no) - parseFloat(b.no));

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

books.forEach((b, i) => {
  const prev = books[i - 1];
  const next = books[i + 1];
  const kw = Array.isArray(b.keywords) ? b.keywords : [];
  // 파일명에 쉼표가 있을 수 있어 pdf는 | 로 구분
  const pdfs = (b.pdf || "").split("|").map((s) => s.trim()).filter(Boolean);
  const body = `
<a href="index.html">← 전체 목록</a>
<p class="meta" style="margin-top:1.5rem">${esc(b.no)} · ${esc(b.category)}</p>
<h1>${esc(b.title)}</h1>
<p class="meta">${esc(b.author)} · ${esc(b.year)}</p>
<div class="chips">${kw.map((k) => `<span class="chip">#${esc(k)}</span>`).join("")}</div>
${sourceNote[b.source] ? `<div class="warn">${sourceNote[b.source]}</div>` : ""}
${marked.parse(b.body)}
${pdfs.length ? `<h2>원문 PDF</h2><ul>${pdfs.map((p) => `<li><a href="${esc(encodeURI("file:///" + pdfDir + "/" + p))}">${esc(p)}</a></li>`).join("")}</ul>` : ""}
<div class="nav"><span>${prev ? `<a href="${prev.slug}.html">← ${esc(prev.title)}</a>` : ""}</span><span>${next ? `<a href="${next.slug}.html">${esc(next.title)} →</a>` : ""}</span></div>`;
  fs.writeFileSync(path.join(outDir, `${b.slug}.html`), page(b.title, body));
});

const index = `
<h1>종합시험 리딩리스트</h1>
<p class="meta">${books.length}개 항목 · 이름을 누르면 요약으로 이동합니다</p>
<input id="q" placeholder="제목, 저자, 키워드로 찾기" autocomplete="off">
<ul class="list" id="list">${books
  .map(
    (b) => `<li data-s="${esc([b.title, b.author, b.category, ...(b.keywords || [])].join(" ").toLowerCase())}">
<span class="no">${esc(b.no)}</span><a href="${b.slug}.html">${esc(b.title)}</a>
<div class="meta">${esc(b.author)} · ${esc(b.year)} · ${esc(b.category)}${b.source && b.source !== "pdf" ? " · ⚠ 원문 미확인" : ""}</div></li>`,
  )
  .join("")}</ul>
<script>
const q=document.getElementById('q'),items=[...document.querySelectorAll('#list li')];
q.addEventListener('input',()=>{const v=q.value.trim().toLowerCase();items.forEach(li=>li.style.display=!v||li.dataset.s.includes(v)?'':'none')});
</script>`;
fs.writeFileSync(path.join(outDir, "index.html"), page("종합시험 리딩리스트", index));

console.log(`${books.length}개 문헌 → ${path.relative(process.cwd(), outDir)}/index.html`);
