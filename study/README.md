# 리딩리스트 요약 관리

## 구조

```
study/
├── books/        ← 원본. 책 1권 = MD 파일 1개 (여기만 고치면 됨)
├── html/         ← 자동 생성된 HTML (직접 고치지 말 것)
└── build.mjs     ← MD → HTML 변환 스크립트
```

## 사용법

1. `study/books/`의 MD 파일을 VS Code에서 열어 수정한다
   - 미리보기: `Ctrl+K V` (오른쪽에 렌더링된 화면)
2. 터미널에서 HTML을 다시 만든다
   ```
   npm run study
   ```
3. `study/html/index.html`을 브라우저로 연다 (검색창으로 제목·저자·키워드 찾기 가능)

## MD 파일 형식

```markdown
---
no: 7                      ← 리딩리스트 번호 (목록 정렬 기준)
title: 책 제목              ← 콜론(:)이 들어가면 "따옴표"로 감싸기
author: 저자
year: 1976
category: 음악사회학·문화비평
keywords: [키워드1, 키워드2]
pdf: 파일명.pdf | 보조파일명.pdf   ← 여러 개면 | 로 구분
source: pdf                 ← pdf / scan(스캔본) / none(PDF 없음)
---

## 요약
## 핵심 논지
## 구성
## 전제
## 논리적 근거
## 강점 / 의의
## 한계
## 연결된 문헌
## 시험 대비 포인트
```

- `source`가 `scan`이나 `none`이면 HTML 상단에 "원문 미확인" 경고가 표시된다
- 본문 표기 규칙: `(해석)` = 원문이 아닌 해석, `확인 필요` = 원문 대조가 필요한 부분
