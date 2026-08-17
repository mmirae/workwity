/**
 * Workwity - Work-TI Test Data, Types & Helpers
 * Recommended path: src/data/workti/worktiData.ts
 *
 * Notes
 * - 질문/결과 문구는 원본을 유지합니다.
 * - 24개 본문 문항을 모두 응답해야 결과를 계산합니다.
 * - 각 축의 원점수와 강도(strength)를 함께 반환합니다.
 * - 3:3 동점은 대표 문항(tie-break question) 응답으로 결정합니다.
 * - Work Identity Match는 4글자 코드가 아니라 축별 연속 점수로 계산합니다.
 * - 실제 채점 로직은 `@/lib/workti/workTIEngine`(구직자/기업 공용 엔진)에
 *   있습니다. 이 파일의 계산 함수들은 그 엔진에 이 파일의 질문/결과
 *   데이터셋을 넘겨주는 얇은 wrapper입니다 — 외부에 노출된 함수 이름과
 *   시그니처, 동작은 이전과 동일합니다.
 */

import {
  calculateTraitScoresFor,
  calculateWorkTIResultFor,
  calculateWorkIdentityMatchFor,
  createWorkTIResultFromScoresFor,
  getBonusBadgesFor,
} from "@/lib/workti/workTIEngine";

export type MainTraitCode = "S" | "L" | "E" | "Y" | "M" | "D" | "G" | "A";
export type MainOptionLabel = "A" | "B";
export type BonusOptionLabel = "A" | "B";

export type WorkTIDimension = "execution" | "decision" | "speed" | "value";
export type BonusCategory = "terms" | "title" | "feedback" | "meeting" | "messenger" | "documentation";

export type WorkTICode =
  | "SEMG" | "SEMA" | "SEDG" | "SEDA"
  | "SYMG" | "SYMA" | "SYDG" | "SYDA"
  | "LEMG" | "LEMA" | "LEDG" | "LEDA"
  | "LYMG" | "LYMA" | "LYDG" | "LYDA";

export interface MainQuestionOption {
  label: MainOptionLabel;
  code: MainTraitCode;
  text: string;
}

export interface WorkTIQuestion {
  id: number;
  dimension: WorkTIDimension;
  question: string;
  options: readonly [MainQuestionOption, MainQuestionOption];
}

export interface BonusQuestionOption {
  label: BonusOptionLabel;
  badgeTag: string;
  displayText: string;
  text: string;
}

export interface BonusQuestion {
  id: number;
  category: BonusCategory;
  question: string;
  options: readonly [BonusQuestionOption, BonusQuestionOption];
}

export interface WorkTIResultDefinition {
  code: WorkTICode;
  title: string;
  catchphrase: string;
  description: string;
  tags: readonly string[];
}

/**
 * 결과 페이지에서 사용하는 16개 유형별 상세 콘텐츠. `WORK_TI_RESULTS`의
 * code/title과 모순되지 않도록 구성하며, 4글자 코드의 각 축 의미(§2 참고)를
 * 그대로 반영합니다.
 */
export interface WorkTIResultDetail {
  code: WorkTICode;
  title: string;
  oneLiner: string;
  characterIcon: string;

  heroQuote: string;
  coreValues: string[];

  goodFitCompany: {
    summary: string;
    points: string[];
  };

  workLifeStyle: string;
  leadershipStyle: string;
  communicationStyle: string;

  stressTrigger: string;
  growthTip: string;
}

export type MainAnswers = Partial<Record<number, MainTraitCode>>;
export type BonusAnswers = Partial<Record<number, BonusOptionLabel>>;

export type TraitScores = Record<MainTraitCode, number>;

export interface AxisResult {
  dimension: WorkTIDimension;
  leftCode: MainTraitCode;
  rightCode: MainTraitCode;
  leftScore: number;
  rightScore: number;
  selectedCode: MainTraitCode;
  /**
   * 0~100. 50은 완전 동점, 100은 한쪽으로 완전히 치우친 상태입니다.
   */
  selectedPercentage: number;
  isTie: boolean;
  tieBreakQuestionId?: number;
}

export interface WorkTITestResult {
  code: WorkTICode;
  definition: WorkTIResultDefinition;
  scores: TraitScores;
  axes: Record<WorkTIDimension, AxisResult>;
}

export interface BonusBadgeResult {
  questionId: number;
  category: BonusCategory;
  label: BonusOptionLabel;
  badgeTag: string;
  displayText: string;
}

export interface MatchAxisDetail {
  dimension: WorkTIDimension;
  similarity: number;
  userSelectedCode: MainTraitCode;
  companySelectedCode: MainTraitCode;
  userPosition: number;
  companyPosition: number;
}

export interface WorkIdentityMatchResult {
  percentage: number;
  axisDetails: Record<WorkTIDimension, MatchAxisDetail>;
}

const BONUS_QUESTION_COUNT = 6;

// ==========================================
// 1. 메인 24개 Work-TI 딜레마 질문 데이터
// ==========================================
export const WORK_TI_QUESTIONS = [
  {
    id: 1,
    dimension: "execution",
    question: "새로운 프로젝트 기획을 시작할 때 당신의 첫 행동은?",
    options: [
      { label: "A", code: "S", text: "일단 간단한 초안만 잡고 관련 팀에 공유해 피드백을 부딪혀본다." },
      { label: "B", code: "L", text: "유사 사례와 시장 데이터 분석 보고서부터 정교하게 수집한다." },
    ],
  },
  {
    id: 2,
    dimension: "execution",
    question: "업무 수행 중 모호한 과제가 던져졌을 때 당신은?",
    options: [
      { label: "A", code: "S", text: "최선이라 생각하는 가설을 세우고 실행하며 기획을 다듬어 나간다." },
      { label: "B", code: "L", text: "업무의 명확한 목적과 가이드라인이 정리될 때까지 조사와 질문을 계속한다." },
    ],
  },
  {
    id: 3,
    dimension: "execution",
    question: "문제 해결 아이디어를 도출할 때 더 선호하는 방식은?",
    options: [
      { label: "A", code: "S", text: "브레인스토밍 후 빠르게 시도해 보는 도전에 끌린다." },
      { label: "B", code: "L", text: "과거 데이터와 검증된 타사 모범 사례(Best Practice) 연구에 끌린다." },
    ],
  },
  {
    id: 4,
    dimension: "execution",
    question: "타 팀과 신규 협업을 시작해야 할 때 당신은?",
    options: [
      { label: "A", code: "S", text: "메신저나 짧은 미팅으로 취지를 설명하고 일단 작업을 시작한다." },
      { label: "B", code: "L", text: "협업 목적, R&R, 일정표가 정리된 공식 문서를 먼저 작성해 전달한다." },
    ],
  },
  {
    id: 5,
    dimension: "execution",
    question: "시장의 최신 트렌드를 업무에 적용할 때 당신의 스타일은?",
    options: [
      { label: "A", code: "S", text: "트렌디해 보이면 검증되지 않았어도 우리 서비스에 빠르게 테스트해 본다." },
      { label: "B", code: "L", text: "타사가 도입해 수치적 성과가 입증된 검증된 기능 위주로 선별 도입한다." },
    ],
  },
  {
    id: 6,
    dimension: "execution",
    question: "프로젝트 회고를 진행할 때 더 중요하게 보는 것은?",
    options: [
      { label: "A", code: "S", text: '"얼마나 빠르게 시도하고 시사점을 얻었는가"' },
      { label: "B", code: "L", text: '"초기 기획과 데이터 분석대로 프로세스가 잘 흘러갔는가"' },
    ],
  },
  {
    id: 7,
    dimension: "decision",
    question: "업무 진행 중 예외 상황이 발생해 마감일이 위태로울 때 당신은?",
    options: [
      { label: "A", code: "E", text: "내가 판단해서 우선순위를 조율하고 빠르게 진행한 뒤 사후 보고한다." },
      { label: "B", code: "Y", text: "즉시 팀장 및 관계자 소집 미팅을 열어 합의하에 일정을 변경한다." },
    ],
  },
  {
    id: 8,
    dimension: "decision",
    question: "나에게 가장 잘 맞는 리더/조직의 스타일은?",
    options: [
      { label: "A", code: "E", text: "목표만 정해주고 방식은 100% 나에게 위임해 주는 조직." },
      { label: "B", code: "Y", text: "명확한 가이드라인, 매뉴얼, 체계적인 피드백을 제공해 주는 조직." },
    ],
  },
  {
    id: 9,
    dimension: "decision",
    question: "프로젝트의 방향성에 대해 내 생각과 팀의 의견이 다를 때?",
    options: [
      { label: "A", code: "E", text: "내 생각이 맞는 근거를 강하게 설득하여 주도적으로 이끌어본다." },
      { label: "B", code: "Y", text: "팀 전체의 합의와 조직의 방향성을 존중하여 내 의견을 유연하게 맞춘다." },
    ],
  },
  {
    id: 10,
    dimension: "decision",
    question: "업무 권한에 대해 당신이 느끼는 편안함은?",
    options: [
      { label: "A", code: "E", text: "전권을 잡고 프로젝트의 선장이 되는 것이 마음 편하다." },
      { label: "B", code: "Y", text: "팀의 규칙 안에서 내 역할에 집중하는 것이 마음 편하다." },
    ],
  },
  {
    id: 11,
    dimension: "decision",
    question: "업무용 도구(Tool)나 프로세스를 바꿀 때 당신은?",
    options: [
      { label: "A", code: "E", text: "내가 효율적이라 느낀 툴을 즉시 개인 업무에 적용해본다." },
      { label: "B", code: "Y", text: "팀 전체가 정한 컨벤션과 매뉴얼이 수립될 때까지 기존 방식을 유지한다." },
    ],
  },
  {
    id: 12,
    dimension: "decision",
    question: "나의 성과가 가장 빛나는 순간은?",
    options: [
      { label: "A", code: "E", text: "아무도 시키지 않은 문제를 스스로 발견하고 해결했을 때." },
      { label: "B", code: "Y", text: "정해진 체계와 공정 안에서 맡은 역할을 완벽히 완수했을 때." },
    ],
  },
  {
    id: 13,
    dimension: "speed",
    question: "제품/기획안 배포 직전, 70% 완성도지만 타임어택인 상황이라면?",
    options: [
      { label: "A", code: "M", text: '"스피드가 생명!" 일단 시장/유저에게 오픈하고 수정해 나간다.' },
      { label: "B", code: "D", text: '"완벽함이 생명!" 마감이 조금 늦어지더라도 디테일을 잡고 오픈한다.' },
    ],
  },
  {
    id: 14,
    dimension: "speed",
    question: "문서를 작성하거나 코드를 짜는 등 산출물을 만들 때 당신은?",
    options: [
      { label: "A", code: "M", text: "가독성과 핵심 전달만 되면 형식은 크게 신경 쓰지 않는다." },
      { label: "B", code: "D", text: "폰트 크기, 줄바꿈, 띄어쓰기, 주석 하나까지 완벽하게 맞춘다." },
    ],
  },
  {
    id: 15,
    dimension: "speed",
    question: "업무 중 '린(Lean)하게 일한다'의 의미를 당신은 어떻게 받아들이나요?",
    options: [
      { label: "A", code: "M", text: "불필요한 절차를 최소화하고 속도를 극대화하는 것." },
      { label: "B", code: "D", text: "겉핥기가 되지 않도록 문제의 본질을 깊이 있게 파고드는 것." },
    ],
  },
  {
    id: 16,
    dimension: "speed",
    question: "테스트나 검증 작업에 대한 당신의 가치관은?",
    options: [
      { label: "A", code: "M", text: "핵심 유저 플로우 1~2개만 이상 없으면 빠르게 다음 단계로 넘어간다." },
      { label: "B", code: "D", text: "모든 엣지 케이스(Edge Case)와 오류 가능성을 사전에 검증해야 안심된다." },
    ],
  },
  {
    id: 17,
    dimension: "speed",
    question: "업무 마감일(Deadline)에 대한 생각은?",
    options: [
      { label: "A", code: "M", text: "퀄리티가 다소 아쉬워도 마감 시간 엄수가 최우선이다." },
      { label: "B", code: "D", text: "퀄리티가 떨어지는 산출물을 낼 바엔 일정을 조율하는 게 맞다." },
    ],
  },
  {
    id: 18,
    dimension: "speed",
    question: "일을 완성했다고 느낄 때의 기준은?",
    options: [
      { label: "A", code: "M", text: "핵심 목적을 달성하고 다음 과제로 넘어가도 될 때." },
      { label: "B", code: "D", text: "더 이상 어디 하나 손볼 곳 없이 완성도가 다듬어졌을 때." },
    ],
  },
  {
    id: 19,
    dimension: "value",
    question: "보상 체계와 회사를 선택할 때 더 끌리는 조건은?",
    options: [
      { label: "A", code: "G", text: "높은 성장에 따른 스톡옵션, 성과급, 커리어 퀀텀점프의 기회." },
      { label: "B", code: "A", text: "예측 가능한 보상, 안정적인 고용 환경, 건강한 워라밸." },
    ],
  },
  {
    id: 20,
    dimension: "value",
    question: "회사나 팀의 R&R(역할) 범위에 대해 당신은?",
    options: [
      { label: "A", code: "G", text: "제 영역을 넘어 다양한 일을 멀티플레이어로 경험하는 것이 재미있다." },
      { label: "B", code: "A", text: "내 직무 고유의 전문 영역에 집중하여 확실한 깊이를 만드는 것이 좋다." },
    ],
  },
  {
    id: 21,
    dimension: "value",
    question: "비즈니스 리스크가 높은 도전적 프로젝트가 주어졌을 때?",
    options: [
      { label: "A", code: "G", text: "실패하더라도 큰 배움과 성장을 얻을 수 있어 가슴이 뛴다." },
      { label: "B", code: "A", text: "리스크가 너무 크면 팀과 서비스에 불필요한 타격을 주므로 신중해야 한다." },
    ],
  },
  {
    id: 22,
    dimension: "value",
    question: "회사의 조직 개편이나 사업 방향 전환이 빈번할 때 당신은?",
    options: [
      { label: "A", code: "G", text: "빠른 시장 변화에 맞춘 당연한 과정이라 느끼며 리듬을 탄다." },
      { label: "B", code: "A", text: "예측 가능성이 떨어져 스트레스를 받고 효율이 떨어진다." },
    ],
  },
  {
    id: 23,
    dimension: "value",
    question: "야근이나 주말 대응이 필요한 몰입 시즌에 대한 생각은?",
    options: [
      { label: "A", code: "G", text: "성장의 가속도를 붙이는 시기라면 기꺼이 밤을 지새울 수 있다." },
      { label: "B", code: "A", text: "지속 가능한 업무를 위해 개인의 휴식과 일상의 균형이 보장되어야 한다." },
    ],
  },
  {
    id: 24,
    dimension: "value",
    question: "당신이 꿈꾸는 3년 뒤 커리어 모습은?",
    options: [
      { label: "A", code: "G", text: "신규 사업이나 팀을 리드하는 거침없는 해결사/개척자." },
      { label: "B", code: "A", text: "내 분야에서 누구보다 신뢰받는 대체 불가능한 든든한 전문가." },
    ],
  },
] as const satisfies readonly WorkTIQuestion[];

// ==========================================
// 2. 보너스 6개 조직 언어 문화 질문 데이터
// (25~27번은 확정 데이터, 28~30번은 추가된 회의/메신저/문서화 문항)
// ==========================================
export const BONUS_QUESTIONS = [
  {
    id: 25,
    category: "terms",
    question: "업무 협업 중, 듣거나 쓰고 싶어 하는 선호 방식은?",
    options: [
      {
        label: "A",
        badgeTag: "#판교사투리_환영",
        displayText: "ASAP하게 린하게 셋업!",
        text: '"Jay, 이번 쿼터 KPI 얼라인을 위해 이 액션 아이템을 ASAP하게 린하게 가시죠!" (판교사투리/영단어 혼용)',
      },
      {
        label: "B",
        badgeTag: "#직관적표준어_선호",
        displayText: "직관적이고 명확한 한국어",
        text: '"제이 님, 이번 분기 목표 달성을 위해 이 실행 과제를 가능한 한 빨리 간결하게 진행하시죠!" (직관적인 표준어)',
      },
    ],
  },
  {
    id: 26,
    category: "title",
    question: "팀 내 소통 시, 내가 훨씬 더 편하게 느껴지는 호칭과 언어는?",
    options: [
      {
        label: "A",
        badgeTag: "#수평적반말_선호",
        displayText: "닉네임 & 수평 반말",
        text: '"루카스, 이번 기획안 확인해 봤어? 의견 공유해 줘!" (닉네임/수평적 반말 문화)',
      },
      {
        label: "B",
        badgeTag: "#상호존댓말_선호",
        displayText: "~님 호칭 & 상호 존댓말",
        text: '"김철수 님, 이번 기획안 확인해 보셨나요? 의견 부탁드립니다!" (상호 존댓말 및 ~님 호칭)',
      },
    ],
  },
  {
    id: 27,
    category: "feedback",
    question: "피드백을 주거나 받을 때, 나에게 더 와닿는 스타일은?",
    options: [
      {
        label: "A",
        badgeTag: "#돌직구_직설형",
        displayText: "핵심만 콕! 직설적 피드백",
        text: '"이 부분은 논리가 부족합니다. 핵심 수치 위주로 기획안 전면 수정 부탁드립니다." (핵심 위주의 직설적 단도직입)',
      },
      {
        label: "B",
        badgeTag: "#쿠션어_공감형",
        displayText: "배려와 공감 중심 쿠션어",
        text: '"고생 많으셨어요! 전체적으로 좋은데, 수치 부분만 조금 더 보완되면 더 완벽할 것 같아요." (배려와 공감 중심의 쿠션어)',
      },
    ],
  },
  {
    id: 28,
    category: "meeting",
    question: "회의를 진행할 때 더 선호하는 방식은?",
    options: [
      {
        label: "A",
        badgeTag: "#결론중심_회의",
        displayText: "핵심만 빠르게, 결론 중심 회의",
        text: '"오늘 회의는 15분! 결론만 빠르게 정하고 바로 실행으로 넘어가시죠." (최소 인원, 빠른 의사결정 중심의 회의 문화)',
      },
      {
        label: "B",
        badgeTag: "#충분한논의_회의",
        displayText: "다양한 의견을 나누는 논의형 회의",
        text: '"시간이 걸리더라도 관련된 분들 의견을 충분히 들어보고 합의된 결론을 내리시죠." (다양한 관점을 나누고 합의를 거치는 회의 문화)',
      },
    ],
  },
  {
    id: 29,
    category: "messenger",
    question: "업무 메신저(슬랙/카카오톡 등)를 사용할 때 더 편한 방식은?",
    options: [
      {
        label: "A",
        badgeTag: "#실시간핑퐁_선호",
        displayText: "빠른 실시간 답장이 편해요",
        text: '"메시지 보내면 바로바로 답장하고, 급한 건은 전화나 DM으로 확인하는 게 편해요." (즉각적인 실시간 소통 문화)',
      },
      {
        label: "B",
        badgeTag: "#비동기소통_선호",
        displayText: "여유 있게 확인하고 답장해요",
        text: '"급한 게 아니면 서로의 몰입 시간을 방해하지 않게, 확인 후 여유 있게 답장하는 게 편해요." (몰입을 존중하는 비동기 소통 문화)',
      },
    ],
  },
  {
    id: 30,
    category: "documentation",
    question: "업무 내용을 공유하거나 인수인계할 때 더 선호하는 방식은?",
    options: [
      {
        label: "A",
        badgeTag: "#구두공유_선호",
        displayText: "말로 빠르게 설명하는 게 편해요",
        text: '"문서보다 직접 얼굴 보고 얘기하면서 궁금한 점을 바로 물어보고 이해하는 게 빨라요." (구두 설명과 즉석 질의응답 중심)',
      },
      {
        label: "B",
        badgeTag: "#문서화_선호",
        displayText: "문서로 꼼꼼히 남기는 게 편해요",
        text: '"나중에 누가 봐도 이해할 수 있도록 맥락과 결정 이유까지 문서로 정리해두는 게 편해요." (기록과 문서화 중심의 공유 문화)',
      },
    ],
  },
] as const satisfies readonly BonusQuestion[];

// ==========================================
// 3. Work-TI 16가지 결과 유형 데이터
// ==========================================
export const WORK_TI_RESULTS: Readonly<Record<WorkTICode, WorkTIResultDefinition>> = {
  SEMG: {
    code: "SEMG",
    title: "린 스타트업 개척자",
    catchphrase: "가설 세웠으면 지금 당장 오픈합시다!",
    description: "속도가 생명! 자율적인 실행력과 불굴의 도전 정신을 겸비한 연쇄 실행가입니다.",
    tags: ["#스피드_최상", "#자율적_개척", "#가설검증", "#퀀텀점프"],
  },
  SEMA: {
    code: "SEMA",
    title: "자율적 린 실무가",
    catchphrase: "쓸데없는 절차 빼고 깔끔하게 끝내죠.",
    description: "자율성을 바탕으로 잡음을 줄이고 빠른 속도로 실무를 쳐내는 스마트 일꾼입니다.",
    tags: ["#실속주의", "#군더더기_제로", "#자율실행", "#워라밸_조화"],
  },
  SEDG: {
    code: "SEDG",
    title: "자율적 디테일 모험가",
    catchphrase: "스스로 깊게 파고들어 명작을 만듭니다.",
    description: "지시 없이도 높은 완성도와 성장을 집요하게 추구하는 장인형 인재입니다.",
    tags: ["#장인정신", "#자율주도", "#완벽주의", "#폭풍성장"],
  },
  SEDA: {
    code: "SEDA",
    title: "자율적 완벽주의자",
    catchphrase: "내 일은 내가 알아서 완벽하게 챙깁니다.",
    description: "타인의 간섭 없이 맡은 바 디테일과 품질을 완수해 내는 솔로 플레이어입니다.",
    tags: ["#독립적", "#디테일_끝판왕", "#자기주도", "#안정적_완성도"],
  },
  SYMG: {
    code: "SYMG",
    title: "체계적 스피드 엔진",
    catchphrase: "정해진 스크럼 속에서 빠르게 달립니다.",
    description: "팀의 가이드라인과 절차 안에서 스피디하게 성과를 내는 추진력 강한 엔진입니다.",
    tags: ["#스크럼_마스터", "#체계적_속도", "#팀플레이어", "#목표달성"],
  },
  SYMA: {
    code: "SYMA",
    title: "시스템 조화주의자",
    catchphrase: "규칙을 지키며 안정적으로 빠른 배포!",
    description: "체계화된 환경에서 리스크 없이 속도감 있게 일하는 평화로운 협업가입니다.",
    tags: ["#시스템_조화", "#리스크_관리", "#안정적_속도", "#규칙_준수"],
  },
  SYDG: {
    code: "SYDG",
    title: "체계적 성장의 정석",
    catchphrase: "단단한 시스템 위에서 크게 성장합니다.",
    description: "명확한 체계 속에서 완벽한 디테일과 폭발적 성장을 동시에 이뤄내는 에이스입니다.",
    tags: ["#정석_에이스", "#체계적_디테일", "#성장지향", "#품질보장"],
  },
  SYDA: {
    code: "SYDA",
    title: "든든한 시스템 수호자",
    catchphrase: "오류 제로! 가장 안전하고 완벽한 일처리",
    description: "데이터와 체계를 바탕으로 한 치의 오차도 허용하지 않는 조직의 든든한 수호자입니다.",
    tags: ["#품질검증", "#오류_제로", "#체계적_안정성", "#신뢰도_최상"],
  },
  LEMG: {
    code: "LEMG",
    title: "데이터 기반 개척가",
    catchphrase: "분석은 철저하게, 의사결정은 자율적으로!",
    description: "데이터를 깊이 연구한 후 스스로 방향을 잡아 새로운 기회를 만드는 스마트 전략가입니다.",
    tags: ["#데이터_기반", "#자율적_전략", "#성장_탐색", "#통찰력"],
  },
  LEMA: {
    code: "LEMA",
    title: "자율적 리서처",
    catchphrase: "근거가 확실하다면 혼자서도 척척",
    description: "풍부한 리서치를 기반으로 주도적이면서도 안정적인 산출물을 내는 분석형 인재입니다.",
    tags: ["#깊은_조사", "#자율_연구", "#논리적", "#안정적_수행"],
  },
  LEDG: {
    code: "LEDG",
    title: "집요한 인사이트 분석가",
    catchphrase: "모든 데이터와 디테일을 파헤쳐 성장한다",
    description: "깊은 분석력과 집요한 완벽주의로 서비스의 폭발적 성장을 이끄는 분석가입니다.",
    tags: ["#인사이트_발굴", "#집요한_분석", "#디테일_최상", "#성장_견인"],
  },
  LEDA: {
    code: "LEDA",
    title: "독립적 전략 연구원",
    catchphrase: "차분하고 정교하게 리스크를 없앱니다",
    description: "독립적인 환경에서 완벽한 리서치와 디테일로 모든 리스크를 차단하는 학자형입니다.",
    tags: ["#돌다리_검증", "#리스크_차단", "#정교한_분석", "#독립적_몰입"],
  },
  LYMG: {
    code: "LYMG",
    title: "합의형 데이터 스피더",
    catchphrase: "분석된 자료를 토대로 다함께 빠르게!",
    description: "데이터를 바탕으로 팀원들과 긴밀히 소통하며 속도감 있게 진행하는 협력가입니다.",
    tags: ["#데이터_소통", "#팀_합의", "#빠른_실행", "#협업_지향"],
  },
  LYMA: {
    code: "LYMA",
    title: "데이터 기반 조화로운 전략가",
    catchphrase: "돌다리도 두들겨 보고 평화롭게 갑니다",
    description: "객관적 데이터와 팀 내 합의를 거쳐 안전하고 정석대로 과제를 이끄는 스타일입니다.",
    tags: ["#평화로운_소통", "#데이터_증명", "#안정적_진행", "#협력_중심"],
  },
  LYDG: {
    code: "LYDG",
    title: "정교한 시스템 기획자",
    catchphrase: "철저한 분석과 기획으로 대형 성과를",
    description: "정밀한 리서치와 체계적인 시스템을 구축하여 조직의 대형 성장을 이끄는 기획자입니다.",
    tags: ["#대형_기획", "#시스템_구축", "#정밀_분석", "#조직_성장"],
  },
  LYDA: {
    code: "LYDA",
    title: "완벽한 품질 전략가",
    catchphrase: "가장 리스크 없는 완성도를 약속합니다",
    description: "분석, 합의, 완벽주의, 안정성을 모두 갖춘 최고 수준의 품질 및 프로세스 검증자입니다.",
    tags: ["#품질_최고봉", "#결점_제로", "#체계적_분석", "#조직_안정"],
  },
};

// ==========================================
// 4. Work-TI 16가지 결과 유형 상세 데이터
//
// 각 유형은 4글자 코드를 아래 축 정의대로 분해해 작성합니다.
//   S 실행하며 구체화 / L 리서치·분석 후 실행
//   E 자율적 의사결정 / Y 체계·합의 기반 의사결정
//   M 속도·마감 중시 / D 완성도·디테일 중시
//   G 성장·도전 지향 / A 안정·워라밸 지향
// 한 글자만 다른 유형끼리는 해당 축과 직접 연관된 필드(leadershipStyle은
// E/Y, communicationStyle은 S/L·M/D, workLifeStyle은 G/A)에서 차이가
// 드러나도록 교차 검증했습니다.
// ==========================================
export const WORK_TI_RESULT_DETAILS: Readonly<Record<WorkTICode, WorkTIResultDetail>> = {
  SEMG: {
    code: "SEMG",
    title: "린 스타트업 개척자",
    oneLiner: "가설을 세우면 바로 실행하고, 스스로 판단하며 속도감 있게 성장 기회를 만들어가는 개척자",
    characterIcon: "🚀",
    heroQuote:
      "목표만 명확하다면, 방법은 제가 정하고 가장 빠른 속도로 부딪혀보는 환경에서 가장 잘 일합니다.",
    coreValues: ["빠른 실행", "자율적 판단", "속도 중심", "성장과 도전"],
    goodFitCompany: {
      summary: "의사결정이 빠르고, 실행 속도만큼 성장 기회도 큰 회사",
      points: [
        "가설만 있어도 바로 시도해볼 수 있고, 완성도보다 배포 속도를 중요하게 보는 팀",
        "목표만 정해주고 실행 방법은 개인에게 맡기는 자율적인 의사결정 구조",
        "빠르게 성장하는 만큼 성과에 따른 보상과 커리어 기회가 열려 있는 조직",
      ],
    },
    workLifeStyle:
      "몰입 시즌의 야근이나 주말 대응도 성장의 발판으로 여기고 기꺼이 받아들이는 편입니다. 다만 그만큼 성과와 임팩트로 보상받지 못하면 금방 동력을 잃을 수 있습니다.",
    leadershipStyle:
      "누가 시키지 않아도 먼저 움직이고, 실행 후 결과로 보여주는 리더십을 발휘합니다. 팀원에게도 방법을 강요하기보다 목표만 던져주고 각자 알아서 뛰게 하는 편을 선호합니다.",
    communicationStyle:
      "회의보다 실행이 빠른 편이라 아이디어가 떠오르면 메신저로 짧게 던지고 바로 시도해보자고 제안합니다. 보고도 결과와 다음 액션 위주로 간결하게 전달합니다.",
    stressTrigger:
      "모든 실행에 사전 승인이 필요하거나, 작은 결정 하나까지 여러 단계의 합의를 거쳐야 하는 조직에서는 답답함을 느낍니다. 변화 없이 반복되는 업무만 계속된다면 금세 흥미를 잃을 수 있습니다.",
    growthTip:
      "실행 전에 핵심 가설 한두 가지만이라도 데이터로 빠르게 검증해보면, 특유의 속도는 유지하면서 시행착오를 줄일 수 있습니다.",
  },
  SEMA: {
    code: "SEMA",
    title: "자율적 린 실무가",
    oneLiner: "군더더기 없이 스스로 판단해 빠르게 처리하되, 삶의 균형은 지키고 싶은 실속파",
    characterIcon: "🛠️",
    heroQuote:
      "불필요한 절차 없이 제 방식대로 빠르게 끝내고, 남은 시간은 제 삶에 쓸 수 있는 환경에서 가장 잘 일합니다.",
    coreValues: ["실속 있는 실행", "자율적 판단", "효율적인 속도", "안정과 균형"],
    goodFitCompany: {
      summary: "불필요한 절차 없이 개인에게 실행을 맡기되, 워라밸을 지켜주는 실속형 조직",
      points: [
        "보고와 결재 단계가 짧고, 각자 알아서 빠르게 처리하도록 맡기는 업무 방식",
        "정해진 시간 안에 몰입하고, 그 외 시간은 개인의 삶으로 존중해주는 문화",
        "예측 가능한 업무 강도 속에서 꾸준히 실무 역량을 인정받을 수 있는 구조",
      ],
    },
    workLifeStyle:
      "정해진 근무 시간 안에서 효율을 극대화하는 것을 선호하며, 워라밸이 흔들리는 몰입 시즌이 잦아지면 쉽게 지칩니다. 예측 가능한 업무 강도가 유지될 때 가장 꾸준한 퍼포먼스를 냅니다.",
    leadershipStyle:
      "지시를 기다리기보다 스스로 우선순위를 정해 처리하고 결과만 공유하는 편입니다. 팀원에게도 세세한 간섭 없이 각자의 방식을 존중해주는 편안한 동료가 되어줍니다.",
    communicationStyle:
      "일단 부딪혀보고 알게 된 것을 메신저로 짧게 공유하는 편으로, 메시지는 핵심만 담아 필요한 액션 위주로 전달합니다. 형식을 갖춘 보고보다는 결과가 나오면 바로 공유하는 실용적인 소통을 선호합니다.",
    stressTrigger:
      "간단한 업무에도 여러 단계의 승인과 보고 양식을 요구하는 조직에서는 비효율을 느끼며 답답해합니다. 야근과 몰입이 상시화되어 개인 시간이 계속 침해되면 쉽게 소진됩니다.",
    growthTip:
      "가끔은 처리 전에 팀에 짧게라도 진행 방향을 공유해두면, 자율성은 지키면서도 불필요한 오해를 줄일 수 있습니다.",
  },
  SEDG: {
    code: "SEDG",
    title: "자율적 디테일 모험가",
    oneLiner: "일단 부딪혀 시작하되, 끝까지 파고들어 완성도를 높이며 성장을 추구하는 장인형 개척자",
    characterIcon: "🎯",
    heroQuote:
      "제가 주도적으로 방향을 정하고, 누구보다 깊이 파고들어 완성도 높은 결과로 성장을 증명하는 환경에서 가장 잘 일합니다.",
    coreValues: ["실행하며 구체화", "자율적 판단", "높은 완성도", "성장과 도전"],
    goodFitCompany: {
      summary: "실행의 자유를 주면서도, 결과물의 완성도와 성장 기회를 함께 인정하는 조직",
      points: [
        "초기 가설 실행부터 세부 완성까지 한 사람에게 온전히 맡기는 업무 방식",
        "방법과 속도를 개인의 판단에 맡기는 자율적인 의사결정 구조",
        "높은 완성도를 낸 만큼 확실한 성과 보상과 성장 기회로 이어지는 문화",
      ],
    },
    workLifeStyle:
      "몰입해서 결과물을 완성해야 할 때는 야근도 마다하지 않지만, 그 몰입이 확실한 성장으로 이어질 때만 의미를 느낍니다. 결과 없는 소모적인 야근에는 쉽게 지칩니다.",
    leadershipStyle:
      "누가 시키지 않아도 스스로 문제를 발견해 끝까지 완성해내는 리더십을 보입니다. 팀원에게도 디테일을 강요하기보다, 각자의 방식으로 완성도를 만들어가도록 믿고 맡기는 편입니다.",
    communicationStyle:
      "초안을 먼저 만들어보고 실행하면서 다듬어가는 대화를 선호하지만, 공유할 때는 놓친 부분이 없도록 꼼꼼하게 정리해서 전달합니다.",
    stressTrigger:
      "완성도를 확인할 시간도 없이 무조건 빨리 배포부터 하라고 압박받으면 불안함을 느낍니다. 모든 진행 상황을 일일이 보고하고 승인받아야 하는 환경에서는 답답함을 느낍니다.",
    growthTip:
      "80% 완성도 시점에서 한 번 중간 공유를 해보는 습관을 들이면, 디테일에 대한 강점은 유지하면서 협업 리듬을 맞출 수 있습니다.",
  },
  SEDA: {
    code: "SEDA",
    title: "자율적 완벽주의자",
    oneLiner: "스스로 시작하고 판단해서, 흔들림 없는 완성도로 안정적인 결과를 만드는 솔로 플레이어",
    characterIcon: "🛡️",
    heroQuote:
      "제 방식대로 판단하고, 아무도 재촉하지 않는 상태에서 흠 없는 결과물을 완성할 수 있는 환경에서 가장 잘 일합니다.",
    coreValues: ["자기주도 실행", "자율적 판단", "높은 완성도", "안정과 균형"],
    goodFitCompany: {
      summary: "실행과 결과물의 디테일을 개인에게 믿고 맡기며, 안정적인 근무 환경을 보장하는 조직",
      points: [
        "일의 시작부터 마무리까지 혼자 책임지고 완성할 수 있게 맡기는 업무 방식",
        "잦은 회의나 보고 없이 개인의 판단과 속도를 존중하는 자율적인 구조",
        "무리한 몰입 시즌 없이도 꾸준한 완성도를 인정받을 수 있는 안정적인 문화",
      ],
    },
    workLifeStyle:
      "정해진 루틴 안에서 완성도를 차곡차곡 쌓아가는 것을 선호하며, 예측 불가능한 야근이나 잦은 방향 전환에는 쉽게 지칩니다. 안정적인 강도로 오래 일하는 것을 더 중요하게 생각합니다.",
    leadershipStyle:
      "누구의 확인도 없이 스스로 품질을 책임지는 편이라, 혼자 맡은 영역에서 가장 강한 신뢰를 만듭니다. 협업할 때도 서로의 영역을 침범하지 않고 각자의 전문성을 존중하는 편을 선호합니다.",
    communicationStyle:
      "필요한 부분만 실행하면서 확인하는 대화를 선호하고, 공유할 때는 오류나 예외 상황까지 꼼꼼하게 문서로 정리해 전달합니다.",
    stressTrigger:
      "충분한 검증 없이 무조건 빨리 끝내라고 재촉받으면 불안함을 느낍니다. 잦은 조직 개편이나 예측 불가능한 업무 강도 변화가 이어지면 안정감을 잃고 지칩니다.",
    growthTip:
      "가끔은 완벽하게 끝내기 전에 진행 중인 상태를 짧게라도 공유해보면, 혼자만의 완성도를 지키면서도 협업의 신뢰를 더 쌓을 수 있습니다.",
  },
  SYMG: {
    code: "SYMG",
    title: "체계적 스피드 엔진",
    oneLiner: "정해진 체계와 가이드라인 안에서, 빠른 실행 속도로 성장 목표를 밀어붙이는 추진력",
    characterIcon: "⚡",
    heroQuote:
      "역할과 프로세스가 명확한 팀 안에서, 빠른 속도로 실행하며 다 함께 성장 목표를 향해 달릴 수 있는 환경에서 가장 잘 일합니다.",
    coreValues: ["실행하며 구체화", "체계와 합의", "속도와 효율", "성장과 도전"],
    goodFitCompany: {
      summary: "명확한 프로세스 안에서 빠른 실행과 성장을 동시에 추구하는 조직",
      points: [
        "스크럼이나 스프린트처럼 짧은 주기로 실행하고 개선하는 체계적인 업무 방식",
        "역할과 R&R이 명확히 정의되어 있어 그 안에서 마음껏 속도를 낼 수 있는 구조",
        "빠른 성과를 낸 만큼 성장과 보상으로 확실하게 돌아오는 목표 지향적 문화",
      ],
    },
    workLifeStyle:
      "명확한 목표를 향해 달릴 때는 몰입도가 높아지고, 그 과정의 강도 높은 시기도 성장으로 받아들이는 편입니다. 다만 그 몰입이 팀의 합의 없이 일방적으로 요구될 때는 부담을 느낍니다.",
    leadershipStyle:
      "정해진 역할과 프로세스 안에서 팀과 보폭을 맞추며 이끄는 편으로, 독단적으로 결정하기보다 합의된 방향을 빠르게 실행에 옮기는 데 강점이 있습니다.",
    communicationStyle:
      "일단 실행해보고 배운 것을 스프린트 회의나 체크인에서 빠르고 간결하게 공유하며 다음 방향을 조정하는 편입니다. 정해진 채널과 형식은 지키되 속도감 있게 소통합니다.",
    stressTrigger:
      "가이드라인 없이 전부 알아서 판단하라고 던져지는 모호한 환경에서는 방향을 잃고 혼란스러워합니다. 속도를 낼 수 없을 만큼 절차가 많아지면 답답함을 느낍니다.",
    growthTip:
      "가끔은 정해진 프로세스 밖에서 스스로 판단해보는 작은 시도를 해보면, 체계 안에서의 강점에 자율적인 순발력까지 더할 수 있습니다.",
  },
  SYMA: {
    code: "SYMA",
    title: "시스템 조화주의자",
    oneLiner: "정해진 규칙 안에서 빠르게 움직이되, 리스크 없이 안정적인 균형을 지키는 조화주의자",
    characterIcon: "⚙️",
    heroQuote:
      "명확한 규칙과 역할이 있는 팀에서, 리스크 없이 안정적인 속도로 꾸준히 성과를 낼 수 있는 환경에서 가장 잘 일합니다.",
    coreValues: ["실행하며 구체화", "체계와 합의", "속도와 효율", "안정과 균형"],
    goodFitCompany: {
      summary: "체계적인 프로세스로 리스크를 관리하면서 꾸준한 속도를 내는 안정적인 조직",
      points: [
        "정해진 규칙과 절차 안에서 빠르게 실행할 수 있도록 프로세스가 잘 갖춰진 업무 방식",
        "역할 분담이 명확해서 팀원 간 마찰 없이 합의를 이루기 쉬운 조직 구조",
        "무리한 몰입 없이도 예측 가능한 속도로 꾸준히 결과를 낼 수 있는 안정적인 문화",
      ],
    },
    workLifeStyle:
      "정해진 프로세스 안에서 꾸준한 리듬으로 일하는 것을 선호하며, 워라밸이 보장되는 선에서 속도를 내는 것을 가장 편안하게 느낍니다. 예측 불가능한 몰입 시즌이 잦아지면 쉽게 지칩니다.",
    leadershipStyle:
      "혼자 앞서나가기보다 팀의 합의를 먼저 확인하고 다 함께 속도를 맞춰 움직이는 편입니다. 갈등을 만들지 않으면서도 정해진 프로세스를 지켜 신뢰를 쌓는 조율자 역할에 강합니다.",
    communicationStyle:
      "일단 부딪혀보고 알게 된 것을 정해진 채널과 형식 안에서 빠르고 간결하게 공유하며, 팀 전체가 같은 정보를 볼 수 있도록 공유를 놓치지 않는 편입니다.",
    stressTrigger:
      "가이드라인이 없어 매번 스스로 판단해야 하는 모호한 상황에서는 불안함을 느낍니다. 잦은 조직 개편이나 예측 불가능한 업무 강도가 계속되면 안정감을 잃습니다.",
    growthTip:
      "가끔은 정해진 규칙이 없는 새로운 상황에서도 먼저 나서서 판단해보는 연습을 하면, 안정적인 강점에 유연함을 더할 수 있습니다.",
  },
  SYDG: {
    code: "SYDG",
    title: "체계적 성장의 정석",
    oneLiner: "체계 안에서 실행하며 구체화하고, 완성도 높은 결과로 성장을 증명하는 정석형 에이스",
    characterIcon: "🏗️",
    heroQuote:
      "명확한 프로세스와 기준이 있는 팀에서, 완성도 높은 결과물로 확실한 성장을 만들어가는 환경에서 가장 잘 일합니다.",
    coreValues: ["실행하며 구체화", "체계와 합의", "높은 완성도", "성장과 도전"],
    goodFitCompany: {
      summary: "체계적인 프로세스와 품질 기준을 갖추고, 그만큼 확실한 성장 기회를 주는 조직",
      points: [
        "정해진 프로세스 안에서 실행하고 다듬어가며 완성도를 높이는 업무 방식",
        "역할과 품질 기준이 명확해 그 안에서 전문성을 인정받기 쉬운 구조",
        "높은 완성도를 낸 만큼 확실한 승진과 성장 기회로 이어지는 목표 지향적 문화",
      ],
    },
    workLifeStyle:
      "성장을 위한 몰입 시즌은 기꺼이 받아들이지만, 그 과정이 체계 없이 무질서하게 흘러가면 스트레스를 받습니다. 명확한 기준과 계획이 있는 강도 높은 업무를 선호합니다.",
    leadershipStyle:
      "정해진 프로세스를 지키면서도 결과물의 완성도로 신뢰를 얻는 편이며, 팀원들과는 명확한 기준을 공유해 함께 품질을 끌어올리는 방식을 선호합니다.",
    communicationStyle:
      "실행하면서 구체화한 내용을 정해진 형식에 맞춰 꼼꼼하게 정리해 공유하는 편으로, 팀 전체가 같은 기준으로 결과물을 확인할 수 있게 신경 씁니다.",
    stressTrigger:
      "기준이나 가이드라인 없이 무작정 알아서 하라고 던져지면 방향을 잃고 답답함을 느낍니다. 충분한 검증 없이 서둘러 배포하라는 압박이 계속되면 불안해합니다.",
    growthTip:
      "완성도를 다듬는 시간에 상한선을 정해두는 연습을 하면, 품질에 대한 강점을 지키면서도 속도를 조금 더 확보할 수 있습니다.",
  },
  SYDA: {
    code: "SYDA",
    title: "든든한 시스템 수호자",
    oneLiner: "정해진 체계 안에서 꼼꼼하게 실행해, 오차 없는 완성도와 안정을 지키는 수호자",
    characterIcon: "🏰",
    heroQuote:
      "명확한 규칙과 기준이 있는 팀에서, 오류 없는 완성도로 꾸준하고 안정적으로 신뢰를 쌓는 환경에서 가장 잘 일합니다.",
    coreValues: ["실행하며 구체화", "체계와 합의", "높은 완성도", "안정과 균형"],
    goodFitCompany: {
      summary: "체계적인 품질 기준과 안정적인 근무 환경을 동시에 갖춘 신뢰 중심의 조직",
      points: [
        "정해진 프로세스와 체크리스트로 오류를 사전에 차단하는 꼼꼼한 업무 방식",
        "역할과 책임 범위가 명확해 예측 가능하게 협업할 수 있는 조직 구조",
        "무리한 몰입 없이도 정확하고 안정적인 결과물로 인정받을 수 있는 문화",
      ],
    },
    workLifeStyle:
      "예측 가능한 강도로 꾸준히 일하는 것을 가장 편안하게 느끼며, 무리한 야근보다는 정해진 시간 안에서 완성도를 높이는 방식을 선호합니다.",
    leadershipStyle:
      "정해진 기준과 절차를 지키며 팀 전체의 안정성을 지키는 역할을 자처하고, 꼼꼼한 검증으로 팀의 신뢰를 얻는 편입니다.",
    communicationStyle:
      "일단 실행하면서 파악한 내용을 오류나 예외 상황까지 미리 점검해 문서로 꼼꼼하게 정리하는 편이며, 정해진 채널과 형식을 벗어나지 않는 소통을 선호합니다.",
    stressTrigger:
      "충분한 검증 없이 서둘러 배포하라는 압박을 받으면 크게 불안해합니다. 가이드라인 없이 즉흥적으로 판단해야 하는 상황이 이어지면 방향을 잃습니다.",
    growthTip:
      "모든 것을 완벽하게 확인하기보다 핵심 리스크 위주로 검증 범위를 좁혀보면, 꼼꼼함은 유지하면서도 속도를 더할 수 있습니다.",
  },
  LEMG: {
    code: "LEMG",
    title: "데이터 기반 개척가",
    oneLiner: "충분한 리서치로 방향을 잡은 뒤, 스스로 빠르게 실행해 성장 기회를 만드는 전략가",
    characterIcon: "🧭",
    heroQuote:
      "충분한 데이터로 방향을 확인한 뒤, 제 판단으로 빠르게 움직여 새로운 성장 기회를 만들 수 있는 환경에서 가장 잘 일합니다.",
    coreValues: ["데이터 기반 분석", "자율적 판단", "속도와 효율", "성장과 도전"],
    goodFitCompany: {
      summary: "데이터 기반 의사결정을 존중하면서도, 실행의 자율성과 성장 기회를 함께 주는 조직",
      points: [
        "감이 아닌 데이터와 분석을 근거로 방향을 정하는 것을 중요하게 여기는 문화",
        "분석이 끝난 뒤에는 실행 방법을 개인에게 위임하는 자율적인 의사결정 구조",
        "새로운 기회를 탐색한 만큼 확실한 성과와 성장으로 이어지는 보상 체계",
      ],
    },
    workLifeStyle:
      "분석한 방향이 확실할 때는 몰입해서 빠르게 밀어붙이며, 그 몰입이 스스로 선택한 도전이라면 강도 높은 시기도 기꺼이 받아들입니다.",
    leadershipStyle:
      "충분한 근거를 갖춘 뒤에는 스스로 판단해 밀어붙이는 리더십을 보이며, 팀원에게도 방향에 대한 근거를 공유하되 실행 방법은 믿고 맡기는 편입니다.",
    communicationStyle:
      "결론을 말하기 전에 데이터와 근거를 먼저 정리해서 공유하지만, 방향이 정해진 뒤에는 메시지를 짧고 빠르게 주고받으며 실행에 속도를 냅니다.",
    stressTrigger:
      "충분한 근거 없이 무조건 빨리 실행부터 하라고 압박받으면 불안함을 느낍니다. 작은 결정 하나까지 여러 단계의 승인을 거쳐야 하는 환경에서는 답답해합니다.",
    growthTip:
      "분석이 끝나기를 기다리기보다 작은 범위로 먼저 시도해보며 감을 잡는 연습을 더하면, 통찰력에 실행 속도까지 더할 수 있습니다.",
  },
  LEMA: {
    code: "LEMA",
    title: "자율적 리서처",
    oneLiner: "충분한 근거를 확보한 뒤 스스로 판단해 실행하고, 안정적인 속도로 마무리하는 분석가",
    characterIcon: "📚",
    heroQuote:
      "충분한 자료 조사를 마친 뒤, 누구의 재촉도 없이 제 판단으로 안정적으로 마무리할 수 있는 환경에서 가장 잘 일합니다.",
    coreValues: ["데이터 기반 분석", "자율적 판단", "효율적인 속도", "안정과 균형"],
    goodFitCompany: {
      summary: "충분한 리서치 시간을 보장하면서, 실행은 개인의 자율에 맡기는 안정적인 조직",
      points: [
        "결론을 내리기 전 자료 조사와 검증에 충분한 시간을 인정해주는 업무 방식",
        "리서치가 끝난 뒤에는 실행 방법과 속도를 개인에게 맡기는 자율적인 구조",
        "무리한 몰입 없이도 논리적인 결과물로 인정받을 수 있는 안정적인 문화",
      ],
    },
    workLifeStyle:
      "예측 가능한 리듬 속에서 충분히 조사하고 판단할 시간이 있을 때 가장 편안함을 느끼며, 근거 없이 급하게 처리해야 하는 상황이 잦아지면 지칩니다.",
    leadershipStyle:
      "충분한 근거를 갖춘 뒤 스스로 결정하고 책임지는 편이며, 협업할 때도 서로의 판단을 존중하며 불필요하게 간섭하지 않는 편안한 동료가 되어줍니다.",
    communicationStyle:
      "결론보다 근거를 먼저 정리해서 공유하는 편이며, 메시지는 간결하게 핵심만 전달해 서로의 시간을 아끼는 소통을 선호합니다.",
    stressTrigger:
      "충분한 근거 없이 무조건 빨리 결정하라고 압박받으면 불안함을 느낍니다. 잦은 방향 전환과 예측 불가능한 업무 강도가 이어지면 지칩니다.",
    growthTip:
      "가끔은 모든 근거가 갖춰지지 않아도 작은 시도부터 먼저 해보는 연습을 하면, 신중함은 지키면서도 실행 속도를 조금 더 높일 수 있습니다.",
  },
  LEDG: {
    code: "LEDG",
    title: "집요한 인사이트 분석가",
    oneLiner: "데이터를 끝까지 파헤쳐 스스로 방향을 정하고, 완성도 높은 결과로 성장을 이끄는 분석가",
    characterIcon: "🔬",
    heroQuote:
      "데이터를 깊이 파고들어 제 판단으로 방향을 정하고, 완성도 높은 결과로 성장을 증명할 수 있는 환경에서 가장 잘 일합니다.",
    coreValues: ["데이터 기반 분석", "자율적 판단", "높은 완성도", "성장과 도전"],
    goodFitCompany: {
      summary: "깊이 있는 분석과 높은 완성도를 존중하며, 그만큼 확실한 성장 기회를 주는 조직",
      points: [
        "표면적인 결론보다 근본 원인을 깊이 파고드는 것을 인정해주는 분석 중심 문화",
        "분석과 완성도에 대한 방법을 개인의 판단에 맡기는 자율적인 의사결정 구조",
        "집요하게 파고든 결과가 확실한 성과와 성장으로 연결되는 보상 체계",
      ],
    },
    workLifeStyle:
      "깊이 파고드는 분석과 완성 작업에 몰입할 때 야근도 마다하지 않지만, 그 몰입이 실제 성장과 성과로 이어질 때만 만족을 느낍니다.",
    leadershipStyle:
      "충분한 근거와 완성도를 갖춘 뒤 스스로 밀어붙이는 편이며, 팀원에게도 분석의 깊이와 완성도를 중요하게 요구하되 방법은 믿고 맡깁니다.",
    communicationStyle:
      "결론을 말하기 전에 근거와 데이터를 촘촘하게 정리해서 공유하며, 보고나 공유 자료는 놓치는 부분이 없도록 꼼꼼하게 작성합니다.",
    stressTrigger:
      "충분한 분석과 검증 없이 서둘러 결론을 내리라고 압박받으면 크게 불안해합니다. 작은 결정까지 매번 승인받아야 하는 환경에서는 답답함을 느낍니다.",
    growthTip:
      "완벽한 분석을 마치기 전에 중간 인사이트만이라도 먼저 공유해보면, 깊이는 유지하면서도 팀과의 협업 속도를 높일 수 있습니다.",
  },
  LEDA: {
    code: "LEDA",
    title: "독립적 전략 연구원",
    oneLiner: "충분한 리서치와 검증으로 리스크를 차단하며, 스스로 판단해 안정적으로 완성하는 연구원",
    characterIcon: "🧩",
    heroQuote:
      "충분한 시간을 갖고 정교하게 검증한 뒤, 누구의 방해도 없이 안정적으로 결과를 완성할 수 있는 환경에서 가장 잘 일합니다.",
    coreValues: ["데이터 기반 분석", "자율적 판단", "높은 완성도", "안정과 균형"],
    goodFitCompany: {
      summary: "충분한 리서치 시간과 독립적인 업무 환경을 보장하는 안정적인 조직",
      points: [
        "결론을 내리기 전 충분한 검증과 리스크 분석 시간을 인정해주는 업무 방식",
        "혼자 깊이 몰입해서 완성할 수 있도록 방해 없이 맡겨주는 자율적인 구조",
        "무리한 몰입 시즌 없이도 정교한 결과물로 신뢰를 인정받을 수 있는 문화",
      ],
    },
    workLifeStyle:
      "예측 가능한 환경에서 충분한 시간을 갖고 검증할 때 가장 안정감을 느끼며, 근거 없이 급박하게 몰아붙이는 상황에는 쉽게 지칩니다.",
    leadershipStyle:
      "혼자 깊이 검증한 내용을 바탕으로 조용히 신뢰를 쌓는 편이며, 협업할 때도 서로의 전문 영역과 판단을 침범하지 않는 것을 중요하게 생각합니다.",
    communicationStyle:
      "결론보다 근거와 리스크 분석 과정을 먼저 정리해서 문서로 공유하며, 즉흥적인 대화보다 정리된 자료를 통한 소통을 선호합니다.",
    stressTrigger:
      "충분한 검증 없이 무조건 빨리 진행하라고 재촉받으면 크게 불안해합니다. 잦은 방향 전환과 예측 불가능한 상황이 계속되면 안정감을 잃습니다.",
    growthTip:
      "모든 리스크를 다 없애려 하기보다 핵심 리스크 한두 가지에 집중해 검증 범위를 좁혀보면, 신중함을 지키면서도 속도를 더할 수 있습니다.",
  },
  LYMG: {
    code: "LYMG",
    title: "합의형 데이터 스피더",
    oneLiner: "데이터로 방향을 맞추고, 팀과 합의한 뒤 빠르게 실행해 성장을 만드는 협력가",
    characterIcon: "🤝",
    heroQuote:
      "데이터를 근거로 팀과 방향을 맞춘 뒤, 다 함께 빠른 속도로 실행하며 성장할 수 있는 환경에서 가장 잘 일합니다.",
    coreValues: ["데이터 기반 분석", "체계와 합의", "속도와 효율", "성장과 도전"],
    goodFitCompany: {
      summary: "데이터 기반의 팀 합의를 거쳐 빠르게 실행하고 함께 성장하는 조직",
      points: [
        "결정 전에 데이터를 함께 검토하고 합의하는 과정을 중요하게 여기는 문화",
        "역할과 프로세스가 명확해 합의된 방향으로 빠르게 실행할 수 있는 구조",
        "팀 전체의 빠른 실행이 확실한 성장과 성과로 이어지는 목표 지향적 보상",
      ],
    },
    workLifeStyle:
      "팀과 함께 정한 목표를 향해 몰입할 때 힘이 나며, 그 몰입이 팀의 합의를 바탕으로 한 것이라면 강도 높은 시기도 기꺼이 받아들입니다.",
    leadershipStyle:
      "데이터를 근거로 팀의 합의를 이끌어내고, 합의된 방향은 빠르게 실행으로 옮기는 조율자형 리더십을 보입니다. 독단적인 결정보다 팀 전체의 속도를 맞추는 것을 중요하게 여깁니다.",
    communicationStyle:
      "결론을 내기 전 데이터를 팀과 함께 검토하는 대화를 선호하며, 합의가 끝난 뒤에는 메시지를 짧고 빠르게 주고받으며 실행 속도를 냅니다.",
    stressTrigger:
      "충분한 데이터나 합의 없이 혼자 빨리 결정하라고 던져지면 불안함을 느낍니다. 정해진 프로세스 없이 방향이 계속 바뀌면 혼란스러워합니다.",
    growthTip:
      "가끔은 팀의 합의를 기다리기 전에 작은 범위로 먼저 시도해보는 연습을 하면, 협업의 강점을 지키면서도 실행 속도를 더 높일 수 있습니다.",
  },
  LYMA: {
    code: "LYMA",
    title: "데이터 기반 조화로운 전략가",
    oneLiner: "데이터로 근거를 확인하고 팀과 합의해, 안정적인 속도로 평화롭게 진행하는 전략가",
    characterIcon: "🌿",
    heroQuote:
      "데이터로 검증된 근거를 팀과 함께 확인한 뒤, 안정적이고 예측 가능한 속도로 진행할 수 있는 환경에서 가장 잘 일합니다.",
    coreValues: ["데이터 기반 분석", "체계와 합의", "효율적인 속도", "안정과 균형"],
    goodFitCompany: {
      summary: "데이터와 팀 합의를 바탕으로 안정적이고 예측 가능하게 일하는 조직",
      points: [
        "감이 아닌 데이터로 근거를 확인한 뒤 결정하는 것을 중요하게 여기는 문화",
        "역할과 절차가 명확해 팀원 간 마찰 없이 합의를 이루기 쉬운 조직 구조",
        "무리한 몰입 없이도 꾸준하고 안정적인 성과를 인정받을 수 있는 문화",
      ],
    },
    workLifeStyle:
      "예측 가능한 리듬 속에서 팀과 보폭을 맞춰 일할 때 가장 편안함을 느끼며, 워라밸이 보장되는 선에서 꾸준히 성과를 쌓는 것을 선호합니다.",
    leadershipStyle:
      "데이터를 근거로 팀의 합의를 조율하는 역할을 자처하며, 갈등 없이 모두가 동의할 수 있는 방향으로 이끄는 평화로운 리더십을 보입니다.",
    communicationStyle:
      "결론 전에 데이터를 팀과 충분히 공유하고 논의하는 대화를 선호하며, 메시지는 정리된 형식으로 간결하게 전달합니다.",
    stressTrigger:
      "충분한 근거나 합의 없이 혼자 빨리 결정해야 하는 상황에서는 불안함을 느낍니다. 잦은 조직 개편과 예측 불가능한 변화가 계속되면 지칩니다.",
    growthTip:
      "가끔은 모든 데이터가 갖춰지지 않아도 팀에 의견을 먼저 제안해보는 연습을 하면, 신중함을 지키면서도 조금 더 주도적으로 움직일 수 있습니다.",
  },
  LYDG: {
    code: "LYDG",
    title: "정교한 시스템 기획자",
    oneLiner: "정밀한 분석으로 체계를 설계하고, 높은 완성도로 조직의 성장을 이끄는 기획자",
    characterIcon: "📐",
    heroQuote:
      "충분한 분석을 바탕으로 명확한 체계를 설계하고, 완성도 높은 결과로 조직의 성장을 이끌 수 있는 환경에서 가장 잘 일합니다.",
    coreValues: ["데이터 기반 분석", "체계와 합의", "높은 완성도", "성장과 도전"],
    goodFitCompany: {
      summary: "정밀한 분석과 체계적인 프로세스를 갖추고, 큰 성장을 함께 그리는 조직",
      points: [
        "결정 전에 충분한 데이터와 근거를 확보하는 것을 중요하게 여기는 분석 중심 문화",
        "역할과 프로세스가 명확히 설계되어 있어 큰 그림을 체계적으로 그릴 수 있는 구조",
        "정교하게 설계한 시스템이 조직의 큰 성장과 성과로 이어지는 목표 지향적 보상",
      ],
    },
    workLifeStyle:
      "큰 그림을 설계하고 완성해가는 몰입 시즌은 성장의 기회로 받아들이지만, 그 과정이 체계 없이 무질서하면 스트레스를 받습니다.",
    leadershipStyle:
      "정밀한 분석과 근거로 팀의 합의를 이끌어내고, 정해진 체계 안에서 완성도 높은 결과를 함께 만들어가는 기획자형 리더십을 보입니다.",
    communicationStyle:
      "결론 전에 데이터와 근거를 정리한 기획안을 공유하는 것을 선호하며, 공유 자료는 놓치는 부분이 없도록 꼼꼼하게 작성합니다.",
    stressTrigger:
      "충분한 분석과 합의 없이 즉흥적으로 진행하라고 하면 불안함을 느낍니다. 검증 없이 서둘러 결과물을 내라는 압박이 계속되면 스트레스를 받습니다.",
    growthTip:
      "기획을 완벽하게 마치기 전에 초안 단계에서 팀과 먼저 공유해보면, 정교함은 유지하면서도 실행 속도를 더 높일 수 있습니다.",
  },
  LYDA: {
    code: "LYDA",
    title: "완벽한 품질 전략가",
    oneLiner: "충분한 분석과 합의를 거쳐, 오차 없는 완성도로 안정을 지키는 품질 전략가",
    characterIcon: "🏛️",
    heroQuote:
      "충분한 데이터와 팀의 합의를 바탕으로, 오류 없는 완성도와 안정적인 속도로 신뢰를 쌓을 수 있는 환경에서 가장 잘 일합니다.",
    coreValues: ["데이터 기반 분석", "체계와 합의", "높은 완성도", "안정과 균형"],
    goodFitCompany: {
      summary: "정밀한 분석과 체계적인 검증으로 리스크를 관리하는 안정적인 조직",
      points: [
        "결정 전에 데이터와 근거를 충분히 확인하는 것을 당연하게 여기는 문화",
        "역할과 검증 절차가 명확해 예측 가능하게 협업할 수 있는 조직 구조",
        "무리한 몰입 없이도 정교하고 안정적인 결과물로 신뢰를 인정받는 문화",
      ],
    },
    workLifeStyle:
      "예측 가능한 강도로 충분한 시간을 갖고 검증할 때 가장 안정감을 느끼며, 무리한 몰입 시즌이 반복되면 쉽게 지칩니다.",
    leadershipStyle:
      "데이터와 근거로 팀의 합의를 조율하며, 정해진 절차와 품질 기준을 지켜 조직 전체의 안정성을 지키는 역할을 자처합니다.",
    communicationStyle:
      "결론 전에 데이터와 리스크를 꼼꼼히 정리한 문서로 공유하는 것을 선호하며, 정해진 형식과 채널을 벗어나지 않는 신중한 소통을 합니다.",
    stressTrigger:
      "충분한 검증과 합의 없이 서둘러 결정하라는 압박을 받으면 크게 불안해합니다. 잦은 변화와 예측 불가능한 상황이 이어지면 안정감을 잃습니다.",
    growthTip:
      "모든 리스크를 다 검증하려 하기보다 핵심 리스크 위주로 범위를 좁혀보면, 꼼꼼함을 지키면서도 조금 더 속도를 낼 수 있습니다.",
  },
};

// ==========================================
// 5. 검증 및 계산 헬퍼 (구직자/기업 공용 엔진에 위임)
// ==========================================

export function calculateTraitScores(mainAnswers: MainAnswers): TraitScores {
  return calculateTraitScoresFor(WORK_TI_QUESTIONS, mainAnswers);
}

export function calculateWorkTIResult(mainAnswers: MainAnswers): WorkTITestResult {
  return calculateWorkTIResultFor(WORK_TI_QUESTIONS, WORK_TI_RESULTS, mainAnswers);
}

/**
 * 기존 코드와의 호환용 간단 함수.
 */
export function calculateWorkTICode(mainAnswers: MainAnswers): WorkTICode {
  return calculateWorkTIResult(mainAnswers).code;
}

export function getBonusBadges(
  bonusAnswers: BonusAnswers,
  requireComplete = true
): BonusBadgeResult[] {
  return getBonusBadgesFor(BONUS_QUESTIONS, bonusAnswers, BONUS_QUESTION_COUNT, requireComplete);
}

// ==========================================
// 6. Work Identity Match 계산
// ==========================================

/**
 * 두 결과의 4개 축 원점수 간 거리를 비교합니다. 구직자/구직자 뿐 아니라
 * 구직자/기업 조합도 비교할 수 있도록 `definition`이 아닌 `axes`만 요구합니다
 * (기존 `WorkTITestResult`는 `axes`를 포함하므로 이 시그니처는 이전과
 * 100% 호환됩니다).
 *
 * 기본 가중치:
 * - 실행 스타일 25%
 * - 의사결정 30%
 * - 속도/디테일 25%
 * - 가치 지향 20%
 *
 * 의사결정 축은 입사 후 보고·합의·자율성 충돌 가능성이 커 조금 더 높게 둡니다.
 * 필요하면 weights 인자로 변경할 수 있습니다.
 */
export function calculateWorkIdentityMatch(
  userResult: { axes: Record<WorkTIDimension, AxisResult> },
  companyResult: { axes: Record<WorkTIDimension, AxisResult> },
  weights: Partial<Record<WorkTIDimension, number>> = {}
): WorkIdentityMatchResult {
  return calculateWorkIdentityMatchFor(userResult.axes, companyResult.axes, weights);
}

/**
 * UI에서 저장된 원점수만 있을 때도 결과 객체를 재구성할 수 있도록 제공합니다.
 */
export function createWorkTIResultFromScores(scores: TraitScores): WorkTITestResult {
  return createWorkTIResultFromScoresFor(WORK_TI_QUESTIONS, WORK_TI_RESULTS, scores);
}
