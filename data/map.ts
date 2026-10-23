// "지형도" 탭 내용. 이 파일만 고치면 /map 페이지가 바뀐다.
// authors의 이름(성)은 study/books의 저자와 대조해 관련 문헌 링크를 자동으로 만든다.

export const mapIntro = {
  title: "음악학 종합시험 지형도",
  subtitle: "토픽 중심 핵심 정리 — 누가 무엇을 비판했고, 무엇을 주장했는가",
  goal: "세부 암기보다 '토픽–논점–연결축'을 먼저 파악하기",
};

export const approach = {
  steps: ["공통 질문 설정", "각 저자의 핵심 주장 정리", "충돌점과 연결점 비교", "마지막에 비판적 평가"],
  note: { title: "석사 수준 핵심", body: "넓고 정확하게, 지나치게 세세하지 않게" },
};

export type Topic = {
  title: string;
  question: string;
  authors: string[];
  keywords: string[];
};

export const topics: Topic[] = [
  {
    title: "음악사와 역사서술",
    question: "음악사는 작품의 역사인가, 담론과 방법의 역사인가?",
    authors: ["Dahlhaus", "Kerman", "Cook"],
    keywords: ["구조사", "사건사", "역사적 구성", "음악학 비판"],
  },
  {
    title: "작품 개념과 박물관 문화",
    question: "'작품(work)'은 언제, 어떻게 규범이 되었는가?",
    authors: ["Goehr", "Dahlhaus", "Taruskin"],
    keywords: ["work-concept", "Werktreue", "박물관 문화"],
  },
  {
    title: "텍스트 vs. 연주/사건",
    question: "음악의 중심은 악보인가, 연주 행위인가?",
    authors: ["Taruskin", "Small", "Abbate", "Cook"],
    keywords: ["authenticity 비판", "musicking", "drastic"],
  },
  {
    title: "미학·자율성·절대음악",
    question: "음악은 자율적인 예술인가, 사회와 윤리에서 자유로운가?",
    authors: ["Hanslick", "Adorno", "Taruskin", "Jankélévitch"],
    keywords: ["형식미", "자율성", "절대음악", "윤리"],
  },
  {
    title: "형식·분석·음악이론",
    question: "분석은 보편적 도구인가, 역사적 산물인가?",
    authors: ["A. B. Marx", "Schenker", "Caplin", "Hepokoski", "Darcy", "Lewin"],
    keywords: ["형식기능", "소나타 이론", "구조", "경험"],
  },
  {
    title: "오페라·서사·목소리",
    question: "음악은 어떻게 이야기하고, 누가 말하는가?",
    authors: ["Abbate", "Parker", "Cone", "Kerman", "Scher"],
    keywords: ["narrative", "unsung voices", "composer's voice"],
  },
  {
    title: "청취·수행·현상학",
    question: "음악은 듣는 대상인가, 참여하는 행위인가?",
    authors: ["Small", "Cook", "Lewin"],
    keywords: ["performance", "participation", "perception"],
  },
  {
    title: "기술·매체·복제",
    question: "기술은 음악과 청취를 어떻게 바꾸는가?",
    authors: ["Benjamin", "McLuhan", "Sterne", "Katz", "Chion"],
    keywords: ["reproducibility", "medium", "audile technique", "recording"],
  },
  {
    title: "근대성·도시·사운드스케이프",
    question: "근대 도시의 공간과 소리는 음악 경험을 어떻게 재편하는가?",
    authors: ["Harvey", "Schorske", "Schafer", "Sterne"],
    keywords: ["Paris", "Vienna", "soundscape", "listening"],
  },
  {
    title: "젠더·장애·규범성",
    question: "음악의 '정상성'은 어떻게 구성되는가?",
    authors: ["McClary", "Straus"],
    keywords: ["gender", "disability", "normalizing the abnormal"],
  },
];

export const axes: { chain: string[]; summary: string }[] = [
  {
    chain: ["Dahlhaus", "Goehr", "Taruskin", "Small", "Abbate"],
    summary: "작품 중심 음악사 → 작품 개념의 역사화 → authenticity 비판 → musicking → 수행의 현재성",
  },
  {
    chain: ["Hanslick", "절대음악 전통", "Adorno", "Taruskin"],
    summary: "형식의 자율성 → 예술의 자율성 → 사회비판 → 자율성의 윤리적 한계 비판",
  },
  {
    chain: ["Marx / Ratner", "Caplin", "Hepokoski·Darcy", "Schenker / Lewin"],
    summary: "형식과 토픽 → 형식기능 → 규범과 변형 → 구조와 경험",
  },
  {
    chain: ["Schafer", "Sterne", "Katz"],
    summary: "소리환경 → 청취의 역사 → 녹음기술과 음악 실천",
  },
  {
    chain: ["McClary", "Straus"],
    summary: "젠더 비판 → 장애학과 규범성 비판",
  },
  {
    chain: ["Harvey + Schorske"],
    summary: "근대 도시의 공간·정치·문화와 음악 경험",
  },
];

export const debates = [
  "역사성 vs 보편성",
  "작품 vs 연주",
  "자율성 vs 사회성",
  "분석도구 vs 역사적 맥락",
  "기술변화 vs 청취변화",
  "형식미 vs 윤리·정치",
];

export const oneLine =
  "종합시험의 핵심은 모든 책을 세부적으로 외우는 것이 아니라, 같은 토픽 안에서 저자들이 무엇을 비판하고 무엇을 주장하는지 비교 가능한 지형도로 파악하는 것이다.";
