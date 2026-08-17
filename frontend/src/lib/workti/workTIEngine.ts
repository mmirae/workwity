/**
 * Shared Work-TI scoring engine — used by both the job-seeker dataset
 * (`@/data/workti/worktiData`) and the company dataset
 * (`@/data/workti/companyWorktiData`).
 *
 * Seeker and company questionnaires share the same 4 axes, the same 8
 * trait codes, and the same tie-break question ids (execution: Q1,
 * decision: Q8, speed: Q17, value: Q19) — only question wording and result
 * definitions differ. So the actual scoring math (trait tallying, axis
 * resolution incl. tie-break, 4-letter code derivation, bonus badge
 * extraction, Work Identity Match) lives here exactly once; each dataset
 * module supplies its own questions / result definitions / answers to it
 * and re-exports thin wrappers with its own names and types.
 *
 * This module intentionally has zero dependency on either data file, so
 * worktiData.ts (and companyWorktiData.ts) can import from here without
 * creating a circular import.
 */

export type MainTraitCode = "S" | "L" | "E" | "Y" | "M" | "D" | "G" | "A";
export type WorkTIDimension = "execution" | "decision" | "speed" | "value";
export type WorkTICode =
  | "SEMG" | "SEMA" | "SEDG" | "SEDA"
  | "SYMG" | "SYMA" | "SYDG" | "SYDA"
  | "LEMG" | "LEMA" | "LEDG" | "LEDA"
  | "LYMG" | "LYMA" | "LYDG" | "LYDA";

export type OptionLabel = "A" | "B";
export type MainAnswers = Partial<Record<number, MainTraitCode>>;
export type BonusAnswers = Partial<Record<number, OptionLabel>>;
export type TraitScores = Record<MainTraitCode, number>;

export interface EngineMainOption {
  label: OptionLabel;
  code: MainTraitCode;
}

export interface EngineMainQuestion {
  id: number;
  dimension: WorkTIDimension;
  options: readonly [EngineMainOption, EngineMainOption];
}

export interface EngineBonusOption {
  label: OptionLabel;
  badgeTag: string;
  displayText: string;
}

export interface EngineBonusQuestion<TCategory extends string> {
  id: number;
  category: TCategory;
  options: readonly [EngineBonusOption, EngineBonusOption];
}

export interface BonusBadgeResultFor<TCategory extends string> {
  questionId: number;
  category: TCategory;
  label: OptionLabel;
  badgeTag: string;
  displayText: string;
}

export interface AxisResult {
  dimension: WorkTIDimension;
  leftCode: MainTraitCode;
  rightCode: MainTraitCode;
  leftScore: number;
  rightScore: number;
  selectedCode: MainTraitCode;
  /** 0~100. 50은 완전 동점, 100은 한쪽으로 완전히 치우친 상태입니다. */
  selectedPercentage: number;
  isTie: boolean;
  tieBreakQuestionId?: number;
}

export interface WorkTIResultFor<TDef> {
  code: WorkTICode;
  definition: TDef;
  scores: TraitScores;
  axes: Record<WorkTIDimension, AxisResult>;
}

export interface WorkIdentityMatchAxisDetail {
  dimension: WorkTIDimension;
  similarity: number;
  userSelectedCode: MainTraitCode;
  companySelectedCode: MainTraitCode;
  userPosition: number;
  companyPosition: number;
}

export interface WorkIdentityMatchResult {
  percentage: number;
  axisDetails: Record<WorkTIDimension, WorkIdentityMatchAxisDetail>;
}

/** Shared axis definition — identical for every Work-TI questionnaire (seeker and company alike). */
export const DIMENSION_CONFIG = {
  execution: { left: "S", right: "L", tieBreakQuestionId: 1 },
  decision: { left: "E", right: "Y", tieBreakQuestionId: 8 },
  speed: { left: "M", right: "D", tieBreakQuestionId: 17 },
  value: { left: "G", right: "A", tieBreakQuestionId: 19 },
} as const satisfies Record<
  WorkTIDimension,
  { left: MainTraitCode; right: MainTraitCode; tieBreakQuestionId: number }
>;

function assertCompleteMainAnswers(
  questions: readonly EngineMainQuestion[],
  mainAnswers: MainAnswers
): asserts mainAnswers is Record<number, MainTraitCode> {
  const missingIds = questions.map((question) => question.id).filter((id) => !mainAnswers[id]);

  if (missingIds.length > 0) {
    throw new Error(`Work-TI 본문 문항이 완료되지 않았습니다. 미응답 문항: ${missingIds.join(", ")}`);
  }

  if (Object.keys(mainAnswers).length < questions.length) {
    throw new Error(`Work-TI 본문 문항은 총 ${questions.length}개에 응답해야 합니다.`);
  }

  for (const question of questions) {
    const answer = mainAnswers[question.id];
    const validCodes = question.options.map((option) => option.code);

    if (!validCodes.includes(answer as MainTraitCode)) {
      throw new Error(`문항 ${question.id}의 응답 코드가 유효하지 않습니다.`);
    }
  }
}

function assertValidBonusAnswers<TCategory extends string>(
  bonusQuestions: readonly EngineBonusQuestion<TCategory>[],
  bonusAnswers: BonusAnswers
): void {
  for (const [rawId, answer] of Object.entries(bonusAnswers)) {
    const id = Number(rawId);
    const question = bonusQuestions.find((item) => item.id === id);

    if (!question) {
      throw new Error(`존재하지 않는 보너스 문항 ID입니다: ${id}`);
    }

    if (!question.options.some((option) => option.label === answer)) {
      throw new Error(`보너스 문항 ${id}의 응답이 유효하지 않습니다.`);
    }
  }
}

export function calculateTraitScoresFor(
  questions: readonly EngineMainQuestion[],
  mainAnswers: MainAnswers
): TraitScores {
  assertCompleteMainAnswers(questions, mainAnswers);

  const scores: TraitScores = {
    S: 0, L: 0,
    E: 0, Y: 0,
    M: 0, D: 0,
    G: 0, A: 0,
  };

  for (const question of questions) {
    const selectedCode = mainAnswers[question.id];
    scores[selectedCode] += 1;
  }

  return scores;
}

function calculateAxisResultFor(
  dimension: WorkTIDimension,
  scores: TraitScores,
  mainAnswers: Record<number, MainTraitCode>
): AxisResult {
  const config = DIMENSION_CONFIG[dimension];
  const leftScore = scores[config.left];
  const rightScore = scores[config.right];
  const total = leftScore + rightScore;
  const isTie = leftScore === rightScore;

  let selectedCode: MainTraitCode;

  if (isTie) {
    const tieBreakAnswer = mainAnswers[config.tieBreakQuestionId];

    if (tieBreakAnswer !== config.left && tieBreakAnswer !== config.right) {
      throw new Error(`${dimension} 축 동점 판정에 필요한 대표 문항 응답이 유효하지 않습니다.`);
    }

    selectedCode = tieBreakAnswer;
  } else {
    selectedCode = leftScore > rightScore ? config.left : config.right;
  }

  const selectedScore = selectedCode === config.left ? leftScore : rightScore;
  const selectedPercentage = total > 0
    ? Math.round((selectedScore / total) * 100)
    : 50;

  return {
    dimension,
    leftCode: config.left,
    rightCode: config.right,
    leftScore,
    rightScore,
    selectedCode,
    selectedPercentage,
    isTie,
    ...(isTie ? { tieBreakQuestionId: config.tieBreakQuestionId } : {}),
  };
}

export function calculateWorkTIResultFor<TDef>(
  questions: readonly EngineMainQuestion[],
  resultDefinitions: Readonly<Record<WorkTICode, TDef>>,
  mainAnswers: MainAnswers
): WorkTIResultFor<TDef> {
  assertCompleteMainAnswers(questions, mainAnswers);

  const scores = calculateTraitScoresFor(questions, mainAnswers);

  const axes = {
    execution: calculateAxisResultFor("execution", scores, mainAnswers),
    decision: calculateAxisResultFor("decision", scores, mainAnswers),
    speed: calculateAxisResultFor("speed", scores, mainAnswers),
    value: calculateAxisResultFor("value", scores, mainAnswers),
  } satisfies Record<WorkTIDimension, AxisResult>;

  const code = [
    axes.execution.selectedCode,
    axes.decision.selectedCode,
    axes.speed.selectedCode,
    axes.value.selectedCode,
  ].join("") as WorkTICode;

  const definition = resultDefinitions[code];

  if (!definition) {
    throw new Error(`정의되지 않은 Work-TI 결과 코드입니다: ${code}`);
  }

  return { code, definition, scores, axes };
}

export function getBonusBadgesFor<TCategory extends string>(
  bonusQuestions: readonly EngineBonusQuestion<TCategory>[],
  bonusAnswers: BonusAnswers,
  bonusQuestionCount: number,
  requireComplete = true
): BonusBadgeResultFor<TCategory>[] {
  assertValidBonusAnswers(bonusQuestions, bonusAnswers);

  if (requireComplete) {
    const missingIds = bonusQuestions
      .map((question) => question.id)
      .filter((id) => !bonusAnswers[id]);

    if (missingIds.length > 0 || Object.keys(bonusAnswers).length < bonusQuestionCount) {
      throw new Error(`보너스 문항이 완료되지 않았습니다. 미응답 문항: ${missingIds.join(", ")}`);
    }
  }

  return bonusQuestions.flatMap((question) => {
    const selectedLabel = bonusAnswers[question.id];

    if (!selectedLabel) {
      return [];
    }

    const selectedOption = question.options.find(
      (option) => option.label === selectedLabel
    );

    if (!selectedOption) {
      throw new Error(`보너스 문항 ${question.id}의 선택지를 찾을 수 없습니다.`);
    }

    return [{
      questionId: question.id,
      category: question.category,
      label: selectedLabel,
      badgeTag: selectedOption.badgeTag,
      displayText: selectedOption.displayText,
    }];
  });
}

/**
 * 축의 왼쪽 성향 위치를 0~100으로 환산합니다.
 * 예: S 5 / L 1 => S 방향 83점
 *     S 3 / L 3 => 50점
 */
function getLeftTraitPosition(axis: AxisResult): number {
  const total = axis.leftScore + axis.rightScore;
  return total === 0 ? 50 : Math.round((axis.leftScore / total) * 100);
}

function calculateAxisSimilarity(userAxis: AxisResult, companyAxis: AxisResult): number {
  const userPosition = getLeftTraitPosition(userAxis);
  const companyPosition = getLeftTraitPosition(companyAxis);
  return Math.max(0, 100 - Math.abs(userPosition - companyPosition));
}

/**
 * 두 결과(구직자/구직자, 구직자/기업, 기업/기업 등 어떤 조합이든)의 4개 축
 * 원점수 위치를 비교합니다. `definition` 없이 `axes`만 필요합니다.
 *
 * 기본 가중치: 실행 25% · 의사결정 30% · 속도/디테일 25% · 가치 20%
 */
export function calculateWorkIdentityMatchFor(
  userAxes: Record<WorkTIDimension, AxisResult>,
  companyAxes: Record<WorkTIDimension, AxisResult>,
  weights: Partial<Record<WorkTIDimension, number>> = {}
): WorkIdentityMatchResult {
  const resolvedWeights: Record<WorkTIDimension, number> = {
    execution: weights.execution ?? 0.25,
    decision: weights.decision ?? 0.30,
    speed: weights.speed ?? 0.25,
    value: weights.value ?? 0.20,
  };

  const weightSum = Object.values(resolvedWeights).reduce((sum, weight) => sum + weight, 0);

  if (weightSum <= 0) {
    throw new Error("Work Identity Match 가중치 합은 0보다 커야 합니다.");
  }

  const dimensions: WorkTIDimension[] = ["execution", "decision", "speed", "value"];
  let weightedScore = 0;

  const axisDetails = {} as Record<WorkTIDimension, WorkIdentityMatchAxisDetail>;

  for (const dimension of dimensions) {
    const userAxis = userAxes[dimension];
    const companyAxis = companyAxes[dimension];
    const similarity = calculateAxisSimilarity(userAxis, companyAxis);
    const normalizedWeight = resolvedWeights[dimension] / weightSum;

    weightedScore += similarity * normalizedWeight;

    axisDetails[dimension] = {
      dimension,
      similarity,
      userSelectedCode: userAxis.selectedCode,
      companySelectedCode: companyAxis.selectedCode,
      userPosition: getLeftTraitPosition(userAxis),
      companyPosition: getLeftTraitPosition(companyAxis),
    };
  }

  return {
    percentage: Math.round(weightedScore),
    axisDetails,
  };
}

/**
 * 저장된 원점수만 있을 때도 결과 객체를 재구성합니다 (질문에 응답하지 않고
 * TraitScores만으로 axes/code를 되짚어 계산 — Match 계산이나 mock 지원자
 * 데이터 등에서 사용).
 */
export function createWorkTIResultFromScoresFor<TDef>(
  questions: readonly EngineMainQuestion[],
  resultDefinitions: Readonly<Record<WorkTICode, TDef>>,
  scores: TraitScores
): WorkTIResultFor<TDef> {
  const mockAnswers = {} as Record<number, MainTraitCode>;

  for (const question of questions) {
    const config = DIMENSION_CONFIG[question.dimension];
    // 동점용 대표 문항 응답을 안정적으로 설정하기 위한 임시값입니다.
    mockAnswers[question.id] = scores[config.left] >= scores[config.right]
      ? config.left
      : config.right;
  }

  const axes = {
    execution: calculateAxisResultFor("execution", scores, mockAnswers),
    decision: calculateAxisResultFor("decision", scores, mockAnswers),
    speed: calculateAxisResultFor("speed", scores, mockAnswers),
    value: calculateAxisResultFor("value", scores, mockAnswers),
  } satisfies Record<WorkTIDimension, AxisResult>;

  const code = [
    axes.execution.selectedCode,
    axes.decision.selectedCode,
    axes.speed.selectedCode,
    axes.value.selectedCode,
  ].join("") as WorkTICode;

  const definition = resultDefinitions[code];

  if (!definition) {
    throw new Error(`정의되지 않은 Work-TI 결과 코드입니다: ${code}`);
  }

  return { code, definition, scores, axes };
}
