/**
 * Workwity - Company Work-TI Test Data
 *
 * Recommended path:
 * src/data/workti/companyWorktiData.ts
 *
 * Design principles
 * - 개인 Work-TI의 4축(S/L, E/Y, M/D, G/A)을 그대로 사용합니다.
 * - 개인은 "내가 선호하는 업무 방식", 기업은 "우리 팀에서 실제로 일어나는 업무 방식"을 측정합니다.
 * - 본문 24문항 = 4축 x 6문항
 * - 보너스 언어문화 6문항은 Work-TI 코드 산출과 분리합니다.
 * - 채점 로직은 `@/lib/workti/workTIEngine`(구직자 worktiData.ts와 공용)에
 *   위임합니다. 아래 §5 참고.
 */

import {
  calculateTraitScoresFor,
  calculateWorkTIResultFor,
  createWorkTIResultFromScoresFor,
  getBonusBadgesFor,
  type AxisResult,
  type BonusBadgeResultFor,
  type TraitScores,
} from "@/lib/workti/workTIEngine";

export type MainTraitCode = "S" | "L" | "E" | "Y" | "M" | "D" | "G" | "A";
export type MainOptionLabel = "A" | "B";
export type BonusOptionLabel = "A" | "B";

export type WorkTIDimension = "execution" | "decision" | "speed" | "value";

export type CompanyBonusCategory =
  | "terms"
  | "title"
  | "feedback"
  | "meeting"
  | "messenger"
  | "documentation";

export type WorkTICode =
  | "SEMG" | "SEMA" | "SEDG" | "SEDA"
  | "SYMG" | "SYMA" | "SYDG" | "SYDA"
  | "LEMG" | "LEMA" | "LEDG" | "LEDA"
  | "LYMG" | "LYMA" | "LYDG" | "LYDA";

export interface CompanyMainQuestionOption {
  label: MainOptionLabel;
  code: MainTraitCode;
  text: string;
}

export interface CompanyWorkTIQuestion {
  id: number;
  dimension: WorkTIDimension;
  question: string;
  options: readonly [CompanyMainQuestionOption, CompanyMainQuestionOption];
}

export interface CompanyBonusQuestionOption {
  label: BonusOptionLabel;
  badgeTag: string;
  displayText: string;
  text: string;
}

export interface CompanyBonusQuestion {
  id: number;
  category: CompanyBonusCategory;
  question: string;
  options: readonly [CompanyBonusQuestionOption, CompanyBonusQuestionOption];
}

export interface CompanyWorkTIResultDefinition {
  code: WorkTICode;
  title: string;
  catchphrase: string;
  description: string;
  workStyle: string;
  decisionStyle: string;
  qualityStyle: string;
  growthStyle: string;
  goodFit: string;
  /** 2~3 short "이런 구성원이 잘 맞아요" bullets, derived from the type's execution/decision/quality axes — shown as FitSection's `points` (mirrors the seeker report's `goodFitCompany.points`). */
  goodFitPoints: readonly string[];
  caution: string;
  /** "더 잘 맞춰 일하기 위한 팁" — practical advice for working well with this team, paired with `caution` in the seeker-report-style 2-card checkpoint section. */
  collaborationTip: string;
  tags: readonly string[];
}

// ==========================================
// 1. 기업용 메인 24개 Work-TI 문항
// ==========================================

export const COMPANY_WORK_TI_QUESTIONS = [
  // ------------------------------------------
  // S / L : 실행 스타일
  // ------------------------------------------
  {
    id: 1,
    dimension: "execution",
    question: "새로운 프로젝트를 시작할 때 우리 팀은 보통?",
    options: [
      {
        label: "A",
        code: "S",
        text: "핵심 아이디어와 간단한 초안을 빠르게 공유하고 피드백을 받으며 구체화한다.",
      },
      {
        label: "B",
        code: "L",
        text: "유사 사례와 필요한 데이터를 충분히 조사하고 방향을 구체화한 뒤 공유한다.",
      },
    ],
  },
  {
    id: 2,
    dimension: "execution",
    question: "목표는 정해졌지만 실행 방법이 모호한 업무가 생기면?",
    options: [
      {
        label: "A",
        code: "S",
        text: "우선 가능한 가설이나 방법으로 실행해 보고 결과를 보며 방향을 조정한다.",
      },
      {
        label: "B",
        code: "L",
        text: "목적과 조건을 충분히 확인하고 실행 기준을 명확하게 만든 뒤 시작한다.",
      },
    ],
  },
  {
    id: 3,
    dimension: "execution",
    question: "새로운 문제의 해결책을 찾을 때 우리 팀은?",
    options: [
      {
        label: "A",
        code: "S",
        text: "여러 아이디어를 실제로 시도하며 가능성을 확인하는 편이다.",
      },
      {
        label: "B",
        code: "L",
        text: "기존 데이터와 검증된 사례를 충분히 살펴본 뒤 해결책을 정하는 편이다.",
      },
    ],
  },
  {
    id: 4,
    dimension: "execution",
    question: "다른 팀과 새로운 협업을 시작할 때는?",
    options: [
      {
        label: "A",
        code: "S",
        text: "짧은 미팅이나 메신저로 핵심을 맞춘 뒤 먼저 움직인다.",
      },
      {
        label: "B",
        code: "L",
        text: "목적, 역할, 일정 등 협업 기준을 정리한 뒤 본격적으로 움직인다.",
      },
    ],
  },
  {
    id: 5,
    dimension: "execution",
    question: "새로운 트렌드나 기술을 발견했을 때는?",
    options: [
      {
        label: "A",
        code: "S",
        text: "가능성이 있다면 작은 범위에서 빠르게 테스트해 본다.",
      },
      {
        label: "B",
        code: "L",
        text: "효과와 사례를 충분히 검토한 뒤 도입 여부를 결정한다.",
      },
    ],
  },
  {
    id: 6,
    dimension: "execution",
    question: "프로젝트 회고에서 우리 팀이 더 중요하게 보는 것은?",
    options: [
      {
        label: "A",
        code: "S",
        text: "어떤 시도를 했고 그 과정에서 무엇을 배웠는지.",
      },
      {
        label: "B",
        code: "L",
        text: "사전에 세운 계획과 근거가 실제 결과와 얼마나 잘 맞았는지.",
      },
    ],
  },

  // ------------------------------------------
  // E / Y : 의사결정과 자율성
  // ------------------------------------------
  {
    id: 7,
    dimension: "decision",
    question: "예상치 못한 문제가 생겨 빠른 판단이 필요할 때는?",
    options: [
      {
        label: "A",
        code: "E",
        text: "담당자가 자신의 권한 안에서 먼저 판단하고 진행한 뒤 공유할 수 있다.",
      },
      {
        label: "B",
        code: "Y",
        text: "관련 구성원이나 리더와 상황을 공유하고 방향을 맞춘 뒤 진행하는 편이다.",
      },
    ],
  },
  {
    id: 8,
    dimension: "decision",
    question: "업무를 맡길 때 우리 팀은 보통?",
    options: [
      {
        label: "A",
        code: "E",
        text: "목표와 책임 범위를 정하고 구체적인 수행 방법은 담당자에게 맡긴다.",
      },
      {
        label: "B",
        code: "Y",
        text: "목표와 함께 주요 진행 방식과 기준도 어느 정도 정해서 공유한다.",
      },
    ],
  },
  {
    id: 9,
    dimension: "decision",
    question: "담당자와 팀의 의견이 다를 때는?",
    options: [
      {
        label: "A",
        code: "E",
        text: "충분한 근거가 있다면 담당자가 최종 판단하고 진행할 수 있는 여지가 크다.",
      },
      {
        label: "B",
        code: "Y",
        text: "관련 구성원의 의견을 조율해 팀이 동의할 수 있는 방향을 찾는 편이다.",
      },
    ],
  },
  {
    id: 10,
    dimension: "decision",
    question: "프로젝트의 실무 의사결정 권한은?",
    options: [
      {
        label: "A",
        code: "E",
        text: "담당자가 자신의 영역에서 비교적 넓은 결정 권한을 갖는다.",
      },
      {
        label: "B",
        code: "Y",
        text: "역할과 기준에 따라 주요 결정을 함께 확인하며 진행한다.",
      },
    ],
  },
  {
    id: 11,
    dimension: "decision",
    question: "새로운 업무 도구나 방식을 사용하고 싶다면?",
    options: [
      {
        label: "A",
        code: "E",
        text: "업무에 도움이 된다고 판단하면 담당자가 먼저 시험해 볼 수 있다.",
      },
      {
        label: "B",
        code: "Y",
        text: "팀의 기존 방식과 호환성을 검토하고 공통 기준을 정한 뒤 적용하는 편이다.",
      },
    ],
  },
  {
    id: 12,
    dimension: "decision",
    question: "우리 팀에서 좋은 성과로 인정받기 쉬운 것은?",
    options: [
      {
        label: "A",
        code: "E",
        text: "담당 영역의 문제를 스스로 정의하고 해결한 성과.",
      },
      {
        label: "B",
        code: "Y",
        text: "팀이 합의한 역할과 기준을 정확하게 수행해 공동 목표에 기여한 성과.",
      },
    ],
  },

  // ------------------------------------------
  // M / D : 속도와 완성도
  // ------------------------------------------
  {
    id: 13,
    dimension: "speed",
    question: "마감이 가까운데 결과물이 약 70% 정도 완성됐다면?",
    options: [
      {
        label: "A",
        code: "M",
        text: "핵심 기능이나 목적을 충족한다면 먼저 공개하고 이후 개선하는 편이다.",
      },
      {
        label: "B",
        code: "D",
        text: "필요하다면 일정을 조정해서라도 주요 디테일을 충분히 다듬은 뒤 공개한다.",
      },
    ],
  },
  {
    id: 14,
    dimension: "speed",
    question: "내부 문서나 실무 산출물의 기준은?",
    options: [
      {
        label: "A",
        code: "M",
        text: "핵심 내용이 명확하게 전달되면 세부 형식은 비교적 자유롭다.",
      },
      {
        label: "B",
        code: "D",
        text: "내용뿐 아니라 형식과 세부 기준까지 일정 수준 맞추는 것을 중요하게 본다.",
      },
    ],
  },
  {
    id: 15,
    dimension: "speed",
    question: "효율적으로 일한다는 말에 우리 팀은 어느 쪽에 가까운가?",
    options: [
      {
        label: "A",
        code: "M",
        text: "불필요한 과정과 작업을 줄여 결과까지 걸리는 시간을 단축한다.",
      },
      {
        label: "B",
        code: "D",
        text: "중요한 문제를 충분히 파고들어 다시 손볼 일을 줄인다.",
      },
    ],
  },
  {
    id: 16,
    dimension: "speed",
    question: "테스트나 검증은 어느 정도까지 하는 편인가?",
    options: [
      {
        label: "A",
        code: "M",
        text: "핵심적인 사용 흐름과 주요 위험 요소가 확인되면 다음 단계로 넘어간다.",
      },
      {
        label: "B",
        code: "D",
        text: "예외 상황과 세부 오류 가능성까지 폭넓게 확인한 뒤 다음 단계로 넘어간다.",
      },
    ],
  },
  {
    id: 17,
    dimension: "speed",
    question: "마감일과 완성도가 충돌한다면?",
    options: [
      {
        label: "A",
        code: "M",
        text: "핵심 품질을 확보했다면 약간의 아쉬움이 있어도 약속한 일정을 우선한다.",
      },
      {
        label: "B",
        code: "D",
        text: "중요한 품질이 부족하다면 관계자와 일정을 조율해 완성도를 높이는 편이다.",
      },
    ],
  },
  {
    id: 18,
    dimension: "speed",
    question: "결과물이 '완료됐다'고 판단하는 기준은?",
    options: [
      {
        label: "A",
        code: "M",
        text: "핵심 목적을 충족해 다음 업무로 넘어갈 수 있는 상태.",
      },
      {
        label: "B",
        code: "D",
        text: "주요 세부사항까지 충분히 다듬어 추가 수정 가능성이 낮은 상태.",
      },
    ],
  },

  // ------------------------------------------
  // G / A : 성장과 지속가능성
  // ------------------------------------------
  {
    id: 19,
    dimension: "value",
    question: "우리 팀의 보상과 성장 기회는 어느 쪽에 가까운가?",
    options: [
      {
        label: "A",
        code: "G",
        text: "성과와 조직 성장에 따라 역할이나 보상의 상승 폭이 커질 수 있다.",
      },
      {
        label: "B",
        code: "A",
        text: "역할과 기준에 따라 비교적 예측 가능한 보상과 성장 경로를 제공한다.",
      },
    ],
  },
  {
    id: 20,
    dimension: "value",
    question: "구성원의 역할 범위는?",
    options: [
      {
        label: "A",
        code: "G",
        text: "상황에 따라 기존 직무 영역을 넘어 다양한 업무를 맡는 경우가 많다.",
      },
      {
        label: "B",
        code: "A",
        text: "각자의 전문 영역과 역할 범위가 비교적 명확하게 구분되어 있다.",
      },
    ],
  },
  {
    id: 21,
    dimension: "value",
    question: "불확실하지만 큰 성과 가능성이 있는 프로젝트라면?",
    options: [
      {
        label: "A",
        code: "G",
        text: "일정 수준의 실패 가능성을 감수하더라도 도전해 보는 편이다.",
      },
      {
        label: "B",
        code: "A",
        text: "예상되는 위험과 영향을 충분히 줄일 수 있을 때 추진하는 편이다.",
      },
    ],
  },
  {
    id: 22,
    dimension: "value",
    question: "조직이나 사업 방향의 변화 빈도는?",
    options: [
      {
        label: "A",
        code: "G",
        text: "시장과 상황에 따라 팀 구조나 우선순위가 비교적 자주 달라질 수 있다.",
      },
      {
        label: "B",
        code: "A",
        text: "중장기 방향과 역할을 비교적 안정적으로 유지하는 편이다.",
      },
    ],
  },
  {
    id: 23,
    dimension: "value",
    question: "특정 시기에 업무량이 크게 증가하면?",
    options: [
      {
        label: "A",
        code: "G",
        text: "중요한 목표 달성을 위해 일정 기간 업무 강도가 높아지는 경우가 있다.",
      },
      {
        label: "B",
        code: "A",
        text: "업무량이 증가하더라도 개인의 지속 가능한 업무 리듬을 유지하려고 조정한다.",
      },
    ],
  },
  {
    id: 24,
    dimension: "value",
    question: "구성원의 커리어 성장을 지원하는 방식은?",
    options: [
      {
        label: "A",
        code: "G",
        text: "새로운 역할과 더 큰 책임을 맡으며 빠르게 경험 범위를 넓히게 하는 편이다.",
      },
      {
        label: "B",
        code: "A",
        text: "담당 분야의 전문성을 꾸준히 쌓으며 안정적으로 깊이를 키우게 하는 편이다.",
      },
    ],
  },
] as const satisfies readonly CompanyWorkTIQuestion[];

// ==========================================
// 2. 기업용 보너스 언어문화 6문항
// Work-TI 코드에는 반영하지 않고 별도 매칭용으로 사용
// ==========================================

export const COMPANY_BONUS_QUESTIONS = [
  {
    id: 25,
    category: "terms",
    question: "우리 팀에서 업무 용어는 주로 어떤 방식으로 사용하나요?",
    options: [
      {
        label: "A",
        badgeTag: "#판교사투리_사용",
        displayText: "영단어 혼용 & 업계 용어",
        text: "KPI, ASAP, 얼라인, 액션 아이템처럼 영단어와 업계 표현을 자연스럽게 섞어 쓰는 편이다.",
      },
      {
        label: "B",
        badgeTag: "#직관적표준어_사용",
        displayText: "직관적이고 명확한 한국어",
        text: "가능하면 누구나 바로 이해할 수 있는 한국어와 설명 중심의 표현을 사용하는 편이다.",
      },
    ],
  },
  {
    id: 26,
    category: "title",
    question: "우리 팀의 호칭과 말투는 어느 쪽에 더 가까운가요?",
    options: [
      {
        label: "A",
        badgeTag: "#수평적호칭_문화",
        displayText: "닉네임 & 수평적 말투",
        text: "닉네임을 사용하거나 비교적 격식이 적은 수평적인 말투를 사용하는 편이다.",
      },
      {
        label: "B",
        badgeTag: "#상호존댓말_문화",
        displayText: "~님 호칭 & 상호 존댓말",
        text: "~님 호칭과 상호 존댓말을 기본으로 비교적 명확한 예의를 유지하는 편이다.",
      },
    ],
  },
  {
    id: 27,
    category: "feedback",
    question: "우리 팀에서 피드백은 주로 어떻게 전달되나요?",
    options: [
      {
        label: "A",
        badgeTag: "#직설피드백_문화",
        displayText: "핵심 중심의 직접적 피드백",
        text: "개선이 필요한 점을 핵심 위주로 비교적 직접적으로 전달하는 편이다.",
      },
      {
        label: "B",
        badgeTag: "#공감피드백_문화",
        displayText: "배려와 맥락을 포함한 피드백",
        text: "상대의 상황과 맥락을 고려해 쿠션어와 설명을 곁들여 전달하는 편이다.",
      },
    ],
  },
  {
    id: 28,
    category: "meeting",
    question: "우리 팀의 회의는 어느 쪽에 더 가까운가요?",
    options: [
      {
        label: "A",
        badgeTag: "#결론중심_회의",
        displayText: "핵심만 빠르게, 결론 중심 회의",
        text: "필요한 인원 중심으로 짧게 논의하고, 핵심 결론을 정한 뒤 바로 실행으로 넘어가는 편이다.",
      },
      {
        label: "B",
        badgeTag: "#충분한논의_회의",
        displayText: "다양한 의견을 나누는 논의형 회의",
        text: "관련 구성원의 다양한 관점을 충분히 듣고, 논의를 거쳐 합의된 결론을 만드는 편이다.",
      },
    ],
  },
  {
    id: 29,
    category: "messenger",
    question: "우리 팀의 업무 메신저 사용 방식은 어느 쪽에 더 가까운가요?",
    options: [
      {
        label: "A",
        badgeTag: "#실시간핑퐁_문화",
        displayText: "빠른 실시간 답장을 선호",
        text: "업무 시간에는 메시지를 비교적 빠르게 확인하고, 급한 건은 DM이나 전화 등으로 즉시 확인하는 편이다.",
      },
      {
        label: "B",
        badgeTag: "#비동기소통_문화",
        displayText: "몰입을 존중하는 비동기 소통",
        text: "급하지 않은 메시지는 즉시 답장을 기대하지 않고, 각자의 몰입 시간을 존중하며 확인 후 답하는 편이다.",
      },
    ],
  },
  {
    id: 30,
    category: "documentation",
    question: "우리 팀은 업무 내용을 공유하거나 인수인계할 때 어느 쪽에 더 가까운가요?",
    options: [
      {
        label: "A",
        badgeTag: "#구두공유_문화",
        displayText: "대화와 즉석 질의응답 중심",
        text: "문서보다 직접 설명하거나 대화하면서 궁금한 점을 바로 확인하는 방식이 자주 사용된다.",
      },
      {
        label: "B",
        badgeTag: "#문서화_문화",
        displayText: "맥락과 결정 이유까지 문서화",
        text: "나중에 다른 사람이 봐도 이해할 수 있도록 맥락과 결정 이유를 문서로 남기는 편이다.",
      },
    ],
  },
] as const satisfies readonly CompanyBonusQuestion[];

// ==========================================
// 3. 기업용 Work-TI 16가지 결과 정의
// 개인용과 동일한 코드를 사용하되,
// "사람의 성향"이 아니라 "팀의 실제 업무환경"으로 설명
// ==========================================

export const COMPANY_WORK_TI_RESULTS: Readonly<
  Record<WorkTICode, CompanyWorkTIResultDefinition>
> = {
  SEMG: {
    code: "SEMG",
    title: "린 개척형 조직",
    catchphrase: "빠르게 시도하고, 자율적으로 결정하며, 성장 기회를 넓혀가는 팀",
    description:
      "새로운 아이디어를 빠르게 실행하고 담당자에게 넓은 자율성을 주는 성장 지향형 업무환경입니다. 완벽한 준비보다 빠른 학습과 시장 반응을 중시하며, 변화와 도전을 자연스럽게 받아들이는 편입니다.",
    workStyle:
      "초기 가설과 아이디어를 빠르게 실행해 보고 실제 반응을 바탕으로 방향을 수정합니다.",
    decisionStyle:
      "담당자가 자신의 영역에서 주도적으로 판단하고 움직일 수 있는 여지가 큽니다.",
    qualityStyle:
      "핵심 목적을 충족하면 빠르게 공개하거나 다음 단계로 넘어가는 편입니다.",
    growthStyle:
      "역할 확장, 새로운 책임, 도전적 과제를 통해 빠른 성장 기회를 제공하는 환경에 가깝습니다.",
    goodFit:
      "빠른 변화와 넓은 자율성을 즐기며 직접 문제를 발견하고 해결하는 사람과 잘 맞습니다.",
    goodFitPoints: [
      "가설을 빠르게 세우고 실행하며 배우는 사람",
      "자율적으로 자신의 업무를 설계할 수 있는 사람",
      "완벽함보다 속도와 실용성을 중요하게 생각하는 사람",
    ],
    caution:
      "명확한 가이드, 예측 가능한 역할, 충분한 검토 시간을 선호하는 사람에게는 다소 혼란스럽게 느껴질 수 있습니다.",
    collaborationTip:
      "궁금한 점이 생기면 그때그때 바로 질문하고 확인하면, 빠른 흐름 속에서도 방향을 잃지 않을 수 있어요.",
    tags: ["#빠른실험", "#높은자율성", "#도전지향", "#성장기회"],
  },
  SEMA: {
    code: "SEMA",
    title: "자율 효율형 조직",
    catchphrase: "군더더기 없이 빠르게, 각자의 방식으로 안정적으로",
    description:
      "불필요한 절차를 줄이고 담당자에게 자율성을 주면서도 과도한 변화보다는 지속 가능한 실행을 중시하는 팀입니다. 빠르고 실용적인 업무 진행과 개인의 독립성을 함께 선호합니다.",
    workStyle:
      "복잡한 준비보다 필요한 만큼 정리한 뒤 빠르게 업무를 진행하는 편입니다.",
    decisionStyle:
      "개인의 판단과 자율성을 존중하며 실무자가 직접 결정할 수 있는 범위가 넓습니다.",
    qualityStyle:
      "핵심 결과가 충족되면 과도한 디테일보다는 효율적인 완료를 선호합니다.",
    growthStyle:
      "과격한 변화보다 안정적인 환경 안에서 효율과 자율성을 유지하는 쪽에 가깝습니다.",
    goodFit:
      "간섭을 최소화한 환경에서 스스로 우선순위를 정하고 효율적으로 일하는 사람과 잘 맞습니다.",
    goodFitPoints: [
      "가설을 빠르게 세우고 실행하며 배우는 사람",
      "자율적으로 자신의 업무를 설계할 수 있는 사람",
      "완벽함보다 속도와 실용성을 중요하게 생각하는 사람",
    ],
    caution:
      "세밀한 품질 기준이나 촘촘한 협업 절차가 필요한 사람에게는 기준이 느슨하게 느껴질 수 있습니다.",
    collaborationTip:
      "품질 기준이 필요한 부분은 먼저 합의해두면, 자율성은 유지하면서도 결과물의 편차를 줄일 수 있어요.",
    tags: ["#자율실행", "#효율중심", "#실용주의", "#지속가능"],
  },
  SEDG: {
    code: "SEDG",
    title: "자율 장인형 조직",
    catchphrase: "빠르게 시작하되, 맡은 일은 깊게 완성하는 성장형 팀",
    description:
      "실행은 빠르지만 결과물의 완성도에는 높은 기준을 두는 조직입니다. 담당자의 자율성과 전문성을 존중하며, 도전적인 과제를 통해 깊은 몰입과 성장을 끌어내는 환경에 가깝습니다.",
    workStyle:
      "아이디어를 빠르게 시도하면서도 실행 과정에서 깊이를 더해 결과를 고도화합니다.",
    decisionStyle:
      "담당자가 높은 자율성을 가지고 자신의 전문적 판단을 적극적으로 활용합니다.",
    qualityStyle:
      "디테일과 완성도를 중요하게 여기며 중요한 품질 이슈는 충분히 다듬고 넘어갑니다.",
    growthStyle:
      "도전적인 문제와 높은 책임을 통해 개인의 전문성과 경험 범위를 빠르게 확장합니다.",
    goodFit:
      "자율적으로 몰입하면서 높은 완성도와 성장 모두를 추구하는 사람과 잘 맞습니다.",
    goodFitPoints: [
      "가설을 빠르게 세우고 실행하며 배우는 사람",
      "자율적으로 자신의 업무를 설계할 수 있는 사람",
      "디테일과 완성도를 중요하게 생각하는 사람",
    ],
    caution:
      "명확한 업무 지시나 가벼운 책임 범위를 원하는 사람에게는 부담이 클 수 있습니다.",
    collaborationTip:
      "맡은 영역의 기대 수준을 먼저 확인해두면, 자율성 안에서도 방향을 잃지 않고 몰입할 수 있어요.",
    tags: ["#자율몰입", "#높은완성도", "#도전과제", "#전문성성장"],
  },
  SEDA: {
    code: "SEDA",
    title: "자율 품질형 조직",
    catchphrase: "각자의 전문성을 믿고, 차분하게 완성도를 쌓는 팀",
    description:
      "담당자에게 넓은 자율성을 주면서도 빠른 성장 경쟁보다는 안정적인 품질과 전문성을 중요하게 보는 업무환경입니다. 독립적인 몰입과 높은 완성도를 선호합니다.",
    workStyle:
      "충분한 사전 분석에 머무르기보다 실제 실행을 통해 방향을 구체화하되, 결과물은 각 담당자가 깊게 다듬습니다.",
    decisionStyle:
      "개인의 전문적 판단과 독립성을 존중하는 편입니다.",
    qualityStyle:
      "완성도와 세부 품질을 중요하게 여기며 충분히 검토한 결과물을 선호합니다.",
    growthStyle:
      "급격한 역할 변화보다 자신의 전문 영역에서 안정적으로 깊이를 쌓을 수 있는 환경에 가깝습니다.",
    goodFit:
      "간섭이 적은 환경에서 자기 기준을 가지고 정교하게 일하는 사람과 잘 맞습니다.",
    goodFitPoints: [
      "가설을 빠르게 세우고 실행하며 배우는 사람",
      "자율적으로 자신의 업무를 설계할 수 있는 사람",
      "디테일과 완성도를 중요하게 생각하는 사람",
    ],
    caution:
      "잦은 협업과 빠른 역할 확장을 기대하는 사람에게는 다소 고립되거나 정적으로 느껴질 수 있습니다.",
    collaborationTip:
      "먼저 다가가 의견을 나누는 노력을 조금 더하면, 독립적인 업무 방식 안에서도 협업의 리듬을 만들 수 있어요.",
    tags: ["#독립업무", "#품질중심", "#전문성", "#안정적환경"],
  },
  SYMG: {
    code: "SYMG",
    title: "체계적 실행형 조직",
    catchphrase: "명확한 기준 안에서 빠르게 움직이며 성장하는 팀",
    description:
      "팀의 공통 기준과 협업 방식을 중요하게 여기면서도 실행 속도와 성장 기회를 적극적으로 추구하는 업무환경입니다. 역할과 방향을 함께 맞춘 뒤 빠르게 결과를 만들어내는 편입니다.",
    workStyle:
      "핵심 방향과 기준을 팀 안에서 맞춘 뒤 속도감 있게 실행합니다.",
    decisionStyle:
      "개인 단독 판단보다 관련 구성원과의 조율과 공통 기준을 중요하게 봅니다.",
    qualityStyle:
      "필요한 기준을 충족하면 완벽함보다 일정과 추진력을 우선하는 편입니다.",
    growthStyle:
      "체계적인 협업 안에서 새로운 역할과 도전적인 목표를 경험할 기회가 많습니다.",
    goodFit:
      "명확한 시스템과 팀플레이를 선호하면서도 빠르게 성과를 내고 성장하고 싶은 사람과 잘 맞습니다.",
    goodFitPoints: [
      "가설을 빠르게 세우고 실행하며 배우는 사람",
      "팀과 충분히 논의하며 함께 결정하는 사람",
      "완벽함보다 속도와 실용성을 중요하게 생각하는 사람",
    ],
    caution:
      "완전한 개인 자율이나 충분한 검토 시간을 원하는 사람에게는 속도와 조율 과정이 답답하게 느껴질 수 있습니다.",
    collaborationTip:
      "속도가 빠른 만큼, 조율이 필요한 부분은 먼저 짧게 맞추고 시작하면 훨씬 수월하게 움직일 수 있어요.",
    tags: ["#체계적실행", "#빠른협업", "#팀기준", "#성장지향"],
  },
  SYMA: {
    code: "SYMA",
    title: "시스템 조화형 조직",
    catchphrase: "정해진 기준 안에서 빠르고 안정적으로 움직이는 팀",
    description:
      "공통의 프로세스와 협업 기준을 중요하게 여기며, 과도한 도전보다는 안정적이고 효율적인 운영을 선호하는 조직입니다. 팀원 간 역할을 맞추고 일정한 속도로 꾸준히 성과를 내는 환경에 가깝습니다.",
    workStyle:
      "업무 기준과 역할을 정리한 뒤 효율적으로 실행하며 불필요한 변동을 줄입니다.",
    decisionStyle:
      "팀 규칙과 합의를 바탕으로 의사결정을 진행하는 편입니다.",
    qualityStyle:
      "과도한 완벽주의보다는 정해진 기준을 충족하며 일정하게 결과를 내는 것을 중요하게 봅니다.",
    growthStyle:
      "급격한 변화보다 예측 가능한 역할과 안정적인 성장 경로를 선호합니다.",
    goodFit:
      "명확한 기준, 안정적인 협업, 예측 가능한 업무 리듬을 선호하는 사람과 잘 맞습니다.",
    goodFitPoints: [
      "가설을 빠르게 세우고 실행하며 배우는 사람",
      "팀과 충분히 논의하며 함께 결정하는 사람",
      "완벽함보다 속도와 실용성을 중요하게 생각하는 사람",
    ],
    caution:
      "큰 자율성이나 파격적인 도전 기회를 원하는 사람에게는 보수적으로 느껴질 수 있습니다.",
    collaborationTip:
      "정해진 기준 안에서도 새로운 시도를 제안해보면, 안정적인 리듬을 유지하며 조금씩 변화를 만들 수 있어요.",
    tags: ["#프로세스중심", "#안정적속도", "#협업기준", "#예측가능"],
  },
  SYDG: {
    code: "SYDG",
    title: "체계적 성장형 조직",
    catchphrase: "정교한 시스템 위에서 높은 품질과 성장을 함께 추구하는 팀",
    description:
      "명확한 기준과 협업 체계를 바탕으로 높은 완성도와 도전적인 성과를 동시에 추구하는 환경입니다. 준비와 검증을 중요하게 여기면서도 조직과 구성원의 성장 가능성을 적극적으로 확장합니다.",
    workStyle:
      "실행 전 필요한 기준과 근거를 맞추고, 진행 과정에서도 체계적으로 개선합니다.",
    decisionStyle:
      "팀의 공통 기준과 협의를 중요하게 여기며 중요한 결정은 함께 검토합니다.",
    qualityStyle:
      "디테일과 오류 가능성을 폭넓게 확인하며 높은 품질 기준을 유지합니다.",
    growthStyle:
      "정교한 시스템 안에서 더 큰 역할과 높은 난도의 과제를 경험할 기회를 제공합니다.",
    goodFit:
      "체계, 높은 완성도, 팀워크, 성장 기회를 모두 중요하게 생각하는 사람과 잘 맞습니다.",
    goodFitPoints: [
      "가설을 빠르게 세우고 실행하며 배우는 사람",
      "팀과 충분히 논의하며 함께 결정하는 사람",
      "디테일과 완성도를 중요하게 생각하는 사람",
    ],
    caution:
      "빠른 실험이나 개인 단독 판단을 선호하는 사람에게는 절차와 검토 과정이 무겁게 느껴질 수 있습니다.",
    collaborationTip:
      "검토 절차의 목적을 미리 이해하면, 꼼꼼한 과정도 답답함보다 신뢰의 장치로 느껴질 수 있어요.",
    tags: ["#체계적성장", "#높은품질", "#팀협의", "#도전과제"],
  },
  SYDA: {
    code: "SYDA",
    title: "안정 품질형 조직",
    catchphrase: "명확한 기준과 꼼꼼한 검증으로 신뢰를 쌓는 팀",
    description:
      "정해진 절차와 협업 기준을 바탕으로 안정성과 품질을 가장 중요하게 보는 업무환경입니다. 큰 변동보다는 예측 가능한 운영, 리스크 관리, 신뢰도 높은 결과물을 선호합니다.",
    workStyle:
      "업무의 목적과 절차를 충분히 정리한 뒤 안정적으로 진행합니다.",
    decisionStyle:
      "개인의 즉흥적 판단보다 공통 기준과 확인 절차를 중요하게 여깁니다.",
    qualityStyle:
      "세부 오류와 예외 상황을 꼼꼼하게 검토하고 높은 완성도를 유지합니다.",
    growthStyle:
      "급격한 역할 변화보다 전문성과 역할을 안정적으로 쌓을 수 있는 환경에 가깝습니다.",
    goodFit:
      "예측 가능성, 명확한 기준, 품질 관리, 안정적인 협업을 중요하게 생각하는 사람과 잘 맞습니다.",
    goodFitPoints: [
      "가설을 빠르게 세우고 실행하며 배우는 사람",
      "팀과 충분히 논의하며 함께 결정하는 사람",
      "디테일과 완성도를 중요하게 생각하는 사람",
    ],
    caution:
      "빠른 변화와 높은 자율성을 선호하는 사람에게는 절차가 많고 속도가 느리게 느껴질 수 있습니다.",
    collaborationTip:
      "절차가 왜 필요한지 먼저 파악해두면, 안정적인 흐름 속에서도 답답함 없이 적응할 수 있어요.",
    tags: ["#품질관리", "#리스크관리", "#명확한기준", "#안정운영"],
  },
  LEMG: {
    code: "LEMG",
    title: "데이터 개척형 조직",
    catchphrase: "충분히 분석하고, 결정은 자율적으로, 성장은 과감하게",
    description:
      "데이터와 리서치를 충분히 활용해 방향을 잡은 뒤 담당자가 주도적으로 의사결정하고 실행하는 성장 지향형 조직입니다. 근거 있는 도전과 자율적인 전략 실행을 선호합니다.",
    workStyle:
      "시장, 사용자, 과거 사례를 충분히 분석한 뒤 실행 방향을 정합니다.",
    decisionStyle:
      "근거가 충분하다면 담당자가 자신의 판단으로 방향을 이끌 수 있는 여지가 큽니다.",
    qualityStyle:
      "완벽한 디테일보다는 핵심 결과와 실행 속도를 중시하는 편입니다.",
    growthStyle:
      "새로운 시장과 높은 난도의 과제를 통해 빠른 성장과 역할 확장을 추구합니다.",
    goodFit:
      "분석을 좋아하면서도 스스로 판단하고 도전적인 목표를 추진하고 싶은 사람과 잘 맞습니다.",
    goodFitPoints: [
      "충분히 분석한 뒤 결론을 내리는 사람",
      "자율적으로 자신의 업무를 설계할 수 있는 사람",
      "완벽함보다 속도와 실용성을 중요하게 생각하는 사람",
    ],
    caution:
      "팀 차원의 지속적인 합의나 높은 디테일 검증이 필요한 사람에게는 개인 책임이 크게 느껴질 수 있습니다.",
    collaborationTip:
      "중요한 판단 전에 관련된 사람과 짧게라도 의견을 나누면, 자율성을 지키면서도 부담을 덜 수 있어요.",
    tags: ["#데이터기반", "#자율판단", "#전략실행", "#성장도전"],
  },
  LEMA: {
    code: "LEMA",
    title: "자율 분석형 조직",
    catchphrase: "근거를 충분히 쌓고, 각자의 전문 판단으로 안정적으로",
    description:
      "충분한 조사와 데이터에 기반해 업무를 시작하며 담당자의 전문적 판단과 독립성을 존중하는 안정 지향형 환경입니다. 급격한 변화보다 논리적이고 지속 가능한 실행을 선호합니다.",
    workStyle:
      "자료와 근거를 충분히 확인한 뒤 실행하는 편입니다.",
    decisionStyle:
      "담당자의 전문성과 독립적 판단을 신뢰하며 자율적인 의사결정을 허용합니다.",
    qualityStyle:
      "핵심을 정확하게 전달하면 과도한 디테일보다는 효율적인 마무리를 선호합니다.",
    growthStyle:
      "예측 가능한 환경에서 자신의 전문성을 차분하게 확장할 수 있는 구조에 가깝습니다.",
    goodFit:
      "분석적인 사고와 독립적인 업무 방식을 선호하면서 안정적인 리듬을 원하는 사람과 잘 맞습니다.",
    goodFitPoints: [
      "충분히 분석한 뒤 결론을 내리는 사람",
      "자율적으로 자신의 업무를 설계할 수 있는 사람",
      "완벽함보다 속도와 실용성을 중요하게 생각하는 사람",
    ],
    caution:
      "빠른 실험이나 밀도 높은 팀 협업을 선호하는 사람에게는 느슨하거나 정적으로 느껴질 수 있습니다.",
    collaborationTip:
      "정기적으로 진행 상황을 공유하는 습관을 더하면, 독립적인 분석 방식 안에서도 팀과의 연결감을 유지할 수 있어요.",
    tags: ["#깊은리서치", "#자율분석", "#안정적실행", "#전문성"],
  },
  LEDG: {
    code: "LEDG",
    title: "집요한 전략형 조직",
    catchphrase: "철저히 분석하고 깊게 완성하며 큰 성과를 노리는 팀",
    description:
      "충분한 리서치와 높은 품질 기준을 바탕으로 담당자가 강한 책임감과 자율성을 가지고 성장 목표를 추구하는 조직입니다. 깊은 사고, 정교한 결과물, 도전적인 성과를 모두 중요하게 봅니다.",
    workStyle:
      "문제를 충분히 분석하고 근거를 확보한 뒤 실행합니다.",
    decisionStyle:
      "전문성과 근거가 있다면 담당자가 높은 자율성과 책임을 가지고 방향을 정합니다.",
    qualityStyle:
      "세부 완성도와 검증 수준이 높으며 결과물의 품질에 타협하지 않는 편입니다.",
    growthStyle:
      "어려운 문제와 큰 책임을 맡으며 전문성과 영향력을 빠르게 키울 수 있는 환경입니다.",
    goodFit:
      "깊은 분석, 높은 자율성, 완성도, 도전적 성장을 모두 원하는 사람과 잘 맞습니다.",
    goodFitPoints: [
      "충분히 분석한 뒤 결론을 내리는 사람",
      "자율적으로 자신의 업무를 설계할 수 있는 사람",
      "디테일과 완성도를 중요하게 생각하는 사람",
    ],
    caution:
      "가벼운 책임과 빠른 완료를 선호하는 사람에게는 업무 강도와 기대 수준이 높게 느껴질 수 있습니다.",
    collaborationTip:
      "기대 수준을 미리 구체적으로 확인해두면, 높은 몰입도 부담보다 성장의 발판으로 느껴질 수 있어요.",
    tags: ["#깊은분석", "#높은자율", "#완성도", "#고난도성장"],
  },
  LEDA: {
    code: "LEDA",
    title: "독립 정밀형 조직",
    catchphrase: "충분히 분석하고 꼼꼼하게 완성하며 안정적으로 운영하는 팀",
    description:
      "깊은 조사와 높은 품질 기준, 담당자의 독립적인 판단을 중요하게 보는 안정 지향형 조직입니다. 리스크를 줄이고 전문성을 깊게 쌓는 데 적합한 환경입니다.",
    workStyle:
      "자료와 근거를 충분히 확보한 뒤 신중하게 업무를 진행합니다.",
    decisionStyle:
      "담당자의 전문적 판단을 존중하며 비교적 독립적인 업무 수행이 가능합니다.",
    qualityStyle:
      "예외 상황과 세부 품질까지 꼼꼼하게 검토하고 완성도를 높입니다.",
    growthStyle:
      "급격한 역할 변화보다 전문 분야의 깊이와 신뢰도를 꾸준히 쌓는 환경입니다.",
    goodFit:
      "혼자 깊게 몰입하고 정교한 결과물을 만드는 것을 좋아하는 사람과 잘 맞습니다.",
    goodFitPoints: [
      "충분히 분석한 뒤 결론을 내리는 사람",
      "자율적으로 자신의 업무를 설계할 수 있는 사람",
      "디테일과 완성도를 중요하게 생각하는 사람",
    ],
    caution:
      "빠른 협업, 즉각적인 실행, 잦은 변화에서 에너지를 얻는 사람에게는 다소 느리게 느껴질 수 있습니다.",
    collaborationTip:
      "분석에 필요한 시간을 미리 공유해두면, 신중한 속도도 답답함보다 신뢰로 받아들여질 수 있어요.",
    tags: ["#정밀분석", "#독립몰입", "#품질중심", "#안정적전문성"],
  },
  LYMG: {
    code: "LYMG",
    title: "합의형 전략 실행 조직",
    catchphrase: "충분히 분석하고 함께 방향을 맞춘 뒤 빠르게 실행하는 팀",
    description:
      "데이터와 리서치를 중요하게 여기며 주요 의사결정을 팀과 함께 조율하는 성장 지향형 환경입니다. 근거와 협의를 확보한 뒤에는 속도감 있게 실행하는 편입니다.",
    workStyle:
      "필요한 자료와 데이터를 검토한 뒤 실행 방향을 정합니다.",
    decisionStyle:
      "관련 구성원과 의견을 충분히 맞추고 공통된 방향을 만드는 것을 중요하게 봅니다.",
    qualityStyle:
      "핵심 기준이 충족되면 지나친 디테일보다는 일정과 추진력을 우선합니다.",
    growthStyle:
      "팀의 합의와 체계적인 협업 안에서 새로운 역할과 성장 기회를 제공합니다.",
    goodFit:
      "데이터 기반 사고와 팀 협업을 좋아하면서 빠르게 성장하고 싶은 사람과 잘 맞습니다.",
    goodFitPoints: [
      "충분히 분석한 뒤 결론을 내리는 사람",
      "팀과 충분히 논의하며 함께 결정하는 사람",
      "완벽함보다 속도와 실용성을 중요하게 생각하는 사람",
    ],
    caution:
      "완전한 자율 의사결정이나 높은 수준의 디테일 검증을 원하는 사람에게는 다소 타협적으로 느껴질 수 있습니다.",
    collaborationTip:
      "의견을 조율하는 과정에 적극적으로 참여하면, 합의된 방향이 오히려 더 빠른 실행으로 이어질 수 있어요.",
    tags: ["#데이터협업", "#합의중심", "#빠른실행", "#성장기회"],
  },
  LYMA: {
    code: "LYMA",
    title: "안정 전략형 조직",
    catchphrase: "근거를 확인하고 함께 결정하며 안정적으로 운영하는 팀",
    description:
      "데이터와 검토를 바탕으로 팀이 충분히 합의한 뒤 안정적인 방식으로 실행하는 환경입니다. 급격한 변화보다 예측 가능성, 협업, 지속 가능한 운영을 중요하게 봅니다.",
    workStyle:
      "충분한 근거와 사례를 확인한 뒤 계획적으로 업무를 시작합니다.",
    decisionStyle:
      "개인 단독 판단보다 팀 차원의 합의와 공통 기준을 중요하게 여깁니다.",
    qualityStyle:
      "필요한 기준을 충족하면 과도한 완벽주의보다 안정적인 완료를 선호합니다.",
    growthStyle:
      "정해진 역할과 안정적인 협업 구조 안에서 꾸준히 성장하는 환경에 가깝습니다.",
    goodFit:
      "근거 있는 의사결정, 협업, 안정적인 업무 리듬을 선호하는 사람과 잘 맞습니다.",
    goodFitPoints: [
      "충분히 분석한 뒤 결론을 내리는 사람",
      "팀과 충분히 논의하며 함께 결정하는 사람",
      "완벽함보다 속도와 실용성을 중요하게 생각하는 사람",
    ],
    caution:
      "빠른 도전과 큰 자율성을 원하는 사람에게는 변화 속도가 느리게 느껴질 수 있습니다.",
    collaborationTip:
      "작은 제안부터 꾸준히 던져보면, 안정적인 합의 구조 안에서도 변화의 물꼬를 틀 수 있어요.",
    tags: ["#근거중심", "#팀합의", "#안정운영", "#지속가능"],
  },
  LYDG: {
    code: "LYDG",
    title: "정교한 시스템 성장 조직",
    catchphrase: "철저히 분석하고 함께 설계해 높은 완성도와 성장을 만드는 팀",
    description:
      "깊은 리서치, 팀 단위의 의사결정, 높은 품질 기준, 성장 지향성을 모두 갖춘 조직입니다. 복잡한 문제를 체계적으로 풀고 큰 프로젝트를 안정적으로 확장하는 데 강한 환경입니다.",
    workStyle:
      "충분한 분석과 계획을 바탕으로 체계적인 실행 구조를 만듭니다.",
    decisionStyle:
      "중요한 의사결정은 관련 구성원과 충분히 논의하고 합의하는 편입니다.",
    qualityStyle:
      "세부 품질과 예외 상황까지 폭넓게 검토하며 높은 완성도를 추구합니다.",
    growthStyle:
      "정교한 시스템 안에서 더 큰 프로젝트와 책임을 경험하며 조직과 함께 성장합니다.",
    goodFit:
      "복잡한 문제를 깊게 파고들고 협업하며 높은 수준의 결과를 만들고 싶은 사람과 잘 맞습니다.",
    goodFitPoints: [
      "충분히 분석한 뒤 결론을 내리는 사람",
      "팀과 충분히 논의하며 함께 결정하는 사람",
      "디테일과 완성도를 중요하게 생각하는 사람",
    ],
    caution:
      "빠른 즉흥 실행이나 개인 단독 의사결정을 선호하는 사람에게는 절차가 많게 느껴질 수 있습니다.",
    collaborationTip:
      "논의 단계에서 적극적으로 목소리를 내면, 촘촘한 절차 안에서도 원하는 방향을 반영할 수 있어요.",
    tags: ["#정밀기획", "#팀협의", "#높은완성도", "#조직성장"],
  },
  LYDA: {
    code: "LYDA",
    title: "정밀 안정형 조직",
    catchphrase: "충분히 분석하고 함께 검증해 가장 안정적인 결과를 만드는 팀",
    description:
      "깊은 분석, 팀 합의, 높은 완성도, 안정성을 모두 중요하게 보는 업무환경입니다. 리스크를 줄이고 품질과 신뢰도를 높이는 데 강하며, 예측 가능한 구조 안에서 전문성을 쌓기 좋습니다.",
    workStyle:
      "자료와 기준을 충분히 확보하고 계획적으로 업무를 진행합니다.",
    decisionStyle:
      "관련 구성원과의 합의와 명확한 절차를 중요하게 여깁니다.",
    qualityStyle:
      "세부 오류와 리스크까지 꼼꼼하게 확인하며 높은 완성도를 유지합니다.",
    growthStyle:
      "안정적인 구조 안에서 전문성과 신뢰도를 꾸준히 높이는 환경에 가깝습니다.",
    goodFit:
      "분석, 협업, 품질, 안정성을 모두 중요하게 생각하는 사람과 잘 맞습니다.",
    goodFitPoints: [
      "충분히 분석한 뒤 결론을 내리는 사람",
      "팀과 충분히 논의하며 함께 결정하는 사람",
      "디테일과 완성도를 중요하게 생각하는 사람",
    ],
    caution:
      "속도, 즉흥성, 큰 자율성, 잦은 역할 변화를 선호하는 사람에게는 답답하게 느껴질 수 있습니다.",
    collaborationTip:
      "검증된 방식을 존중하면서 작은 개선을 제안해보면, 안정적인 틀 안에서도 변화를 만들어갈 수 있어요.",
    tags: ["#정밀검증", "#합의중심", "#품질안정", "#리스크관리"],
  },
};

// ==========================================
// 4. Claude Code 연동 메모
// ==========================================

/**
 * IMPORTANT - source of truth
 *
 * 개인 Work-TI의 최신 기준 파일은
 * `frontend/src/data/workti/worktiData.ts` 입니다.
 * 루트의 과거 `data/worktiData.ts` 사본을 기준으로 구현하지 마세요.
 *
 * 구현 시 권장사항
 *
 * 1) 현재 개인용 계산 함수는 `WORK_TI_QUESTIONS`, `WORK_TI_RESULTS`를
 *    함수 내부에서 직접 참조하므로 기업 질문 배열을 그대로 넘겨 재사용할 수 없습니다.
 *
 * 2) 따라서 계산 엔진을 공용화하세요. 예시 방향:
 *    - calculateTraitScoresFor(questions, answers)
 *    - calculateWorkTIResultFor(questions, resultDefinitions, answers)
 *    - 개인 wrapper: calculateWorkTIResult(...)
 *    - 기업 wrapper: calculateCompanyWorkTIResult(...)
 *
 * 3) 개인/기업 모두 동일한 4축과 축당 6문항 구조를 사용합니다.
 *    기업 테스트 결과도 기존 AxisResult / TraitScores와 호환되게 만들어
 *    `calculateWorkIdentityMatch`가 두 결과의 축별 원점수 위치를 비교할 수 있게 하세요.
 *
 * 4) 동점 처리 대표 문항은 개인용과 동일한 축 위치를 유지합니다.
 *    - execution: Q1
 *    - decision: Q8
 *    - speed: Q17
 *    - value: Q19
 *
 * 5) 언어문화 6문항은 Work-TI 코드 산출과 분리합니다.
 *    최신 개인용 보너스 카테고리와 정확히 대응합니다.
 *    - Q25 terms
 *    - Q26 title
 *    - Q27 feedback
 *    - Q28 meeting
 *    - Q29 messenger
 *    - Q30 documentation
 *
 * 6) 언어문화 매칭은 가능하면 단순 UI상의 A/B 문자열보다
 *    question id 또는 category + 의미 방향을 기준으로 계산하세요.
 *    현재 개인/기업은 같은 문항 번호에서 A/B 의미가 대응되도록 설계되어 있습니다.
 *
 * 7) 기업 테스트 첫 화면에는 아래 취지의 안내를 노출하세요.
 *    "좋은 조직과 나쁜 조직을 나누는 테스트가 아닙니다.
 *     이상적인 모습을 고르기보다 현재 팀에서 실제로 더 자주 일어나는 방식을 선택해 주세요."
 *
 * 8) 기업 결과 페이지 권장 섹션
 *    - Work-TI 코드 + 기업용 유형명
 *    - catchphrase / description
 *    - 4축 비율
 *    - 업무 진행 방식
 *    - 의사결정 방식
 *    - 속도/품질 기준
 *    - 성장/안정 환경
 *    - 잘 맞는 구성원
 *    - 미스매치 주의
 *    - 언어문화 6개 badge
 *    - "이 결과는 채용공고의 Work-TI 정보로 사용됩니다" 안내
 */

// ==========================================
// 5. 계산 로직 — 구직자/기업 공용 엔진(workTIEngine)에 위임
//
// 위 메모 2)에서 권장한 대로, 실제 채점 수학(trait 집계, 축 계산과 동점
// 처리, 4글자 코드 산출, 보너스 배지 추출)은 `@/lib/workti/workTIEngine`에
// 한 번만 존재합니다. worktiData.ts도 같은 엔진에 위임하는 wrapper이므로,
// 동점 처리 대표 문항(execution Q1 / decision Q8 / speed Q17 / value Q19)과
// 원점수 계산 방식이 구직자용과 완전히 동일합니다.
// ==========================================

export type CompanyMainAnswers = Partial<Record<number, MainTraitCode>>;
export type CompanyBonusAnswers = Partial<Record<number, BonusOptionLabel>>;
export type CompanyBonusBadgeResult = BonusBadgeResultFor<CompanyBonusCategory>;

export interface CompanyWorkTITestResult {
  code: WorkTICode;
  definition: CompanyWorkTIResultDefinition;
  scores: TraitScores;
  axes: Record<WorkTIDimension, AxisResult>;
}

const COMPANY_BONUS_QUESTION_COUNT = 6;

export function calculateCompanyTraitScores(mainAnswers: CompanyMainAnswers): TraitScores {
  return calculateTraitScoresFor(COMPANY_WORK_TI_QUESTIONS, mainAnswers);
}

export function calculateCompanyWorkTIResult(mainAnswers: CompanyMainAnswers): CompanyWorkTITestResult {
  return calculateWorkTIResultFor(COMPANY_WORK_TI_QUESTIONS, COMPANY_WORK_TI_RESULTS, mainAnswers);
}

/** 기존 개인용 `calculateWorkTICode`와 대응하는 호환용 간단 함수. */
export function calculateCompanyWorkTICode(mainAnswers: CompanyMainAnswers): WorkTICode {
  return calculateCompanyWorkTIResult(mainAnswers).code;
}

export function getCompanyBonusBadges(
  bonusAnswers: CompanyBonusAnswers,
  requireComplete = true
): CompanyBonusBadgeResult[] {
  return getBonusBadgesFor(COMPANY_BONUS_QUESTIONS, bonusAnswers, COMPANY_BONUS_QUESTION_COUNT, requireComplete);
}

/**
 * 저장된 원점수만으로 결과 객체를 재구성합니다 (Work Identity Match, mock
 * 지원자 비교 등에서 사용 — 개인용 `createWorkTIResultFromScores`와 동일한 역할).
 */
export function createCompanyWorkTIResultFromScores(scores: TraitScores): CompanyWorkTITestResult {
  return createWorkTIResultFromScoresFor(COMPANY_WORK_TI_QUESTIONS, COMPANY_WORK_TI_RESULTS, scores);
}
