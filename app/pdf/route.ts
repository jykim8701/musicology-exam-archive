import fs from "fs/promises";
import path from "path";
import { type NextRequest } from "next/server";
import { PDF_DIR } from "@/lib/books";

// 리딩리스트 폴더의 PDF를 브라우저에서 열 수 있게 전달 (/pdf?f=파일명.pdf)
export async function GET(request: NextRequest) {
  const name = request.nextUrl.searchParams.get("f") ?? "";
  if (path.basename(name) !== name || !name.toLowerCase().endsWith(".pdf")) {
    return new Response("잘못된 파일 이름", { status: 400 });
  }
  try {
    const data = await fs.readFile(path.join(PDF_DIR, name));
    return new Response(data, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename*=UTF-8''${encodeURIComponent(name)}`,
      },
    });
  } catch {
    return new Response("PDF를 찾을 수 없습니다", { status: 404 });
  }
}
