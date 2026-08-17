import type { TraitScores } from "@/data/workti/worktiData";
import type { HiringProcessFilterId } from "@/data/hiringProcessFilters";

export interface CompanyJobPosting {
  id: string;
  title: string;
  status: "발행중" | "마감";
  process: string[];
  postedAt: string;
  /** Canonical hiring-process tags — HIRING_PROCESS_FILTERS ids, shared with the candidate-side Jobs filter. */
  hiringProcessFilterIds: HiringProcessFilterId[];
  experience?: string | null;
  employmentType?: string | null;
  workMode?: string | null;
  location?: string | null;
  responsibilities?: string[];
  requirements?: string[];
  preferredQualifications?: string[];
}

export const SEED_COMPANY_JOBS: CompanyJobPosting[] = [
  {
    id: "posting-designer",
    title: "프로덕트 디자이너",
    status: "발행중",
    hiringProcessFilterIds: ["portfolio", "no_coding_test", "interview_1"],
    process: ["서류", "포트폴리오 심사", "1차 실무면접"],
    postedAt: "2026-07-20",
  },
  {
    id: "posting-backend",
    title: "백엔드 엔지니어",
    status: "발행중",
    hiringProcessFilterIds: ["assignment", "interview_1"],
    process: ["서류", "과제 전형", "1차 실무면접"],
    postedAt: "2026-07-25",
  },
];

export interface MockApplicant {
  id: string;
  jobId: string;
  name: string;
  career: string;
  workTIScores: TraitScores;
  appliedAt: string;
}

export const SEED_APPLICANTS: MockApplicant[] = [
  {
    id: "applicant-1",
    jobId: "posting-designer",
    name: "김지은",
    career: "3년 · 디자인",
    workTIScores: { S: 5, L: 1, E: 4, Y: 2, M: 4, D: 2, G: 4, A: 2 },
    appliedAt: "2026-07-22",
  },
  {
    id: "applicant-2",
    jobId: "posting-designer",
    name: "박서준",
    career: "5년 · 디자인",
    workTIScores: { S: 1, L: 5, E: 2, Y: 4, M: 1, D: 5, G: 2, A: 4 },
    appliedAt: "2026-07-23",
  },
  {
    id: "applicant-3",
    jobId: "posting-backend",
    name: "이하늘",
    career: "4년 · 개발",
    workTIScores: { S: 3, L: 3, E: 3, Y: 3, M: 2, D: 4, G: 3, A: 3 },
    appliedAt: "2026-07-26",
  },
  {
    id: "applicant-4",
    jobId: "posting-backend",
    name: "정도윤",
    career: "2년 · 개발",
    workTIScores: { S: 4, L: 2, E: 4, Y: 2, M: 5, D: 1, G: 5, A: 1 },
    appliedAt: "2026-07-27",
  },
];
