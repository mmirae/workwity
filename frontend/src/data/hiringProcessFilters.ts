export const HIRING_PROCESS_FILTERS = [
  {
    id: "portfolio",
    label: "포트폴리오",
    category: "submission",
    description:
      "포트폴리오 제출 또는 포트폴리오 기반 검토가 포함된 전형",
  },

  {
    id: "assignment",
    label: "과제 전형",
    category: "assessment",
    description:
      "사전 과제, 실무 과제 등 별도의 과제 수행 또는 제출이 포함된 전형",
  },
  {
    id: "no_assignment",
    label: "과제 없음",
    category: "assessment",
    description:
      "별도의 과제 전형을 진행하지 않는다고 명시된 채용",
  },

  {
    id: "coding_test",
    label: "코딩테스트",
    category: "assessment",
    description:
      "코딩 또는 직무 관련 프로그래밍 테스트가 포함된 전형",
  },
  {
    id: "no_coding_test",
    label: "코딩테스트 없음",
    category: "assessment",
    description:
      "별도의 코딩테스트를 진행하지 않는다고 명시된 채용",
  },

  {
    id: "aptitude_test",
    label: "인적성",
    category: "assessment",
    description:
      "인성검사, 적성검사 또는 인적성 평가가 포함된 전형",
  },
  {
    id: "no_aptitude_test",
    label: "인적성 없음",
    category: "assessment",
    description:
      "별도의 인적성 검사를 진행하지 않는다고 명시된 채용",
  },

  {
    id: "interview_1",
    label: "면접 1회",
    category: "interview_count",
    description:
      "최종 합격 전 진행되는 면접이 한 차례인 채용",
  },
  {
    id: "interview_2",
    label: "면접 2회",
    category: "interview_count",
    description:
      "최종 합격 전 진행되는 면접이 두 차례인 채용",
  },
  {
    id: "interview_3_plus",
    label: "면접 3회 이상",
    category: "interview_count",
    description:
      "최종 합격 전 진행되는 면접이 세 차례 이상인 채용",
  },

  {
    id: "video_interview",
    label: "화상 면접",
    category: "interview_type",
    description:
      "온라인 화상 방식으로 진행되는 면접이 포함된 채용",
  },
  {
    id: "onsite_interview",
    label: "대면 면접",
    category: "interview_type",
    description:
      "오프라인에서 직접 진행되는 면접이 포함된 채용",
  },

  {
    id: "coffee_chat",
    label: "커피챗",
    category: "other",
    description:
      "포트폴리오나 과제 전형을 대신하거나, 정식 면접 전 서로의 업무 방식과 역할을 가볍게 확인하는 대화형 전형",
  },
] as const;

export const HIRING_FILTER_EXCLUSIVE_GROUPS = [
  ["assignment", "no_assignment"],
  ["coding_test", "no_coding_test"],
  ["aptitude_test", "no_aptitude_test"],
  ["interview_1", "interview_2", "interview_3_plus"],
] as const;

export type HiringProcessFilterId = (typeof HIRING_PROCESS_FILTERS)[number]["id"];

export const HIRING_PROCESS_FILTER_IDS = HIRING_PROCESS_FILTERS.map(
  (filter) => filter.id
) as HiringProcessFilterId[];

export function isHiringProcessFilterId(value: string): value is HiringProcessFilterId {
  return (HIRING_PROCESS_FILTER_IDS as string[]).includes(value);
}

export function getHiringProcessFilterLabel(id: HiringProcessFilterId): string {
  return HIRING_PROCESS_FILTERS.find((filter) => filter.id === id)?.label ?? id;
}

/**
 * Applies HIRING_FILTER_EXCLUSIVE_GROUPS to a list of ids: within each
 * exclusive group, only the id that appears last in `ids` survives.
 * Used both to sanitize AI output (in case the model returns e.g. both
 * "assignment" and "no_assignment") and to auto-deselect the previous
 * choice when a company swaps to another value in the same group.
 */
export function resolveExclusiveFilters(
  ids: readonly HiringProcessFilterId[]
): HiringProcessFilterId[] {
  const result: HiringProcessFilterId[] = [];
  for (const id of ids) {
    if (result.includes(id)) continue;
    const group = HIRING_FILTER_EXCLUSIVE_GROUPS.find((candidate) =>
      (candidate as readonly string[]).includes(id)
    );
    if (group) {
      for (const other of group) {
        const index = result.indexOf(other as HiringProcessFilterId);
        if (index !== -1) result.splice(index, 1);
      }
    }
    result.push(id);
  }
  return result;
}