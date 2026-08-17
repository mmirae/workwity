import type { TraitScores } from "@/data/workti/worktiData";
import type { HiringProcessFilterId } from "@/data/hiringProcessFilters";

export interface MockJob {
  id: string;
  company: string;
  companyInitial: string;
  title: string;
  /** Canonical hiring-process tags — HIRING_PROCESS_FILTERS ids, shared with the company-side AI job-analysis flow. */
  hiringProcessFilterIds: HiringProcessFilterId[];
  functionCategory: string;
  careerLabel: string;
  /** A fictional company's raw Work-TI scores — fed into
   * `createWorkTIResultFromScores` to compute a real Work Identity Match
   * against whoever is viewing the list, instead of a hardcoded number. */
  companyScores: TraitScores;
  postedAt: string;
  process: string[];
  duration: string;
  duties: string[];
  requirements: string[];
}

export const MOCK_JOBS: MockJob[] = [
  {
    id: "tosslab-product-designer",
    company: "토스트랩",
    companyInitial: "토",
    title: "프로덕트 디자이너",
    hiringProcessFilterIds: ["portfolio", "no_coding_test", "interview_1"],
    functionCategory: "디자인",
    careerLabel: "3년 이상",
    companyScores: { S: 5, L: 1, E: 4, Y: 2, M: 4, D: 2, G: 4, A: 2 },
    postedAt: "2026-08-01",
    process: ["서류", "포트폴리오 심사", "1차 실무면접"],
    duration: "2~3주",
    duties: [
      "핵심 프로덕트의 사용자 흐름과 화면 설계",
      "리서치부터 프로토타입까지 빠르게 검증하는 디자인 스프린트 운영",
      "PM · 엔지니어와 함께 기능 우선순위 논의",
    ],
    requirements: ["프로덕트 디자인 경력 3년 이상", "Figma 기반 협업 경험", "빠른 실행과 반복 개선에 익숙한 분"],
  },
  {
    id: "neuronlabs-backend-engineer",
    company: "뉴런랩스",
    companyInitial: "뉴",
    title: "백엔드 엔지니어",
    hiringProcessFilterIds: ["assignment", "no_coding_test", "interview_2"],
    functionCategory: "개발",
    careerLabel: "3~7년",
    companyScores: { S: 3, L: 3, E: 3, Y: 3, M: 2, D: 4, G: 3, A: 3 },
    postedAt: "2026-07-28",
    process: ["서류", "과제 전형", "1차 실무면접", "임원 면접"],
    duration: "3~4주",
    duties: ["대규모 트래픽을 처리하는 API 서버 설계 및 운영", "데이터 정합성과 안정성을 우선하는 시스템 개선", "코드 리뷰와 문서화를 통한 팀 지식 공유"],
    requirements: ["백엔드 개발 경력 3~7년", "분산 시스템 경험 우대", "꼼꼼한 테스트와 문서화를 중요하게 여기는 분"],
  },
  {
    id: "lightcompany-growth-marketer",
    company: "라잇컴퍼니",
    companyInitial: "라",
    title: "그로스 마케터",
    hiringProcessFilterIds: ["coffee_chat", "interview_1"],
    functionCategory: "마케팅",
    careerLabel: "2년 이상",
    companyScores: { S: 6, L: 0, E: 5, Y: 1, M: 5, D: 1, G: 5, A: 1 },
    postedAt: "2026-08-03",
    process: ["커피챗", "서류", "1차 실무면접"],
    duration: "1~2주",
    duties: ["신규 채널 실험과 빠른 캠페인 실행", "데이터 기반 퍼널 개선", "주간 단위 그로스 지표 리뷰"],
    requirements: ["그로스·퍼포먼스 마케팅 경력 2년 이상", "빠른 실행과 실험을 즐기는 분", "데이터 분석 툴 활용 경험"],
  },
  {
    id: "pangyostudio-ux-researcher",
    company: "판교스튜디오",
    companyInitial: "판",
    title: "UX 리서처",
    hiringProcessFilterIds: ["portfolio", "assignment", "interview_1"],
    functionCategory: "디자인",
    careerLabel: "신입 · 경력",
    companyScores: { S: 1, L: 5, E: 2, Y: 4, M: 1, D: 5, G: 2, A: 4 },
    postedAt: "2026-07-20",
    process: ["서류", "포트폴리오 심사", "과제 전형", "1차 실무면접"],
    duration: "3주 이상",
    duties: ["정성·정량 리서치 설계 및 실행", "리서치 결과를 체계적인 인사이트 문서로 정리", "디자인팀과 함께 심층 사용자 인터뷰 진행"],
    requirements: ["리서치 방법론에 대한 이해", "꼼꼼한 문서화와 근거 기반 커뮤니케이션", "정교한 분석을 선호하는 분"],
  },
  {
    id: "gridworks-frontend-engineer",
    company: "그리드웍스",
    companyInitial: "그",
    title: "프론트엔드 엔지니어",
    hiringProcessFilterIds: ["coffee_chat", "no_coding_test", "interview_1"],
    functionCategory: "개발",
    careerLabel: "1~4년",
    companyScores: { S: 4, L: 2, E: 4, Y: 2, M: 4, D: 2, G: 4, A: 2 },
    postedAt: "2026-08-05",
    process: ["커피챗", "서류", "1차 실무면접"],
    duration: "1~2주",
    duties: ["사용자 대면 웹 서비스의 UI 구현 및 성능 개선", "디자인 시스템 컴포넌트 설계", "빠른 배포와 실험을 통한 반복 개선"],
    requirements: ["프론트엔드 개발 경력 1~4년", "React 기반 프로젝트 경험", "자율적으로 일정을 조율할 수 있는 분"],
  },
  {
    id: "steadyframe-hr-manager",
    company: "스테디프레임",
    companyInitial: "스",
    title: "HR 매니저",
    hiringProcessFilterIds: ["portfolio", "interview_2"],
    functionCategory: "인사",
    careerLabel: "5년 이상",
    companyScores: { S: 1, L: 5, E: 1, Y: 5, M: 1, D: 5, G: 1, A: 5 },
    postedAt: "2026-07-15",
    process: ["서류", "1차 실무면접", "임원 면접"],
    duration: "3주 이상",
    duties: ["채용 프로세스 전반 설계 및 운영", "체계적인 온보딩·평가 제도 관리", "안정적인 조직 문화 정착을 위한 정책 수립"],
    requirements: ["HR 경력 5년 이상", "체계적인 프로세스 설계 경험", "안정성과 일관성을 중요하게 여기는 분"],
  },
  {
    id: "orbitline-data-analyst",
    company: "오빗라인",
    companyInitial: "오",
    title: "데이터 분석가",
    hiringProcessFilterIds: ["assignment", "interview_1"],
    functionCategory: "데이터",
    careerLabel: "2년 이상",
    companyScores: { S: 2, L: 4, E: 3, Y: 3, M: 2, D: 4, G: 4, A: 2 },
    postedAt: "2026-08-06",
    process: ["서류", "과제 전형", "1차 실무면접"],
    duration: "2~3주",
    duties: ["핵심 비즈니스 지표 정의 및 대시보드 구축", "실험 설계와 데이터 기반 의사결정 지원", "정교한 분석을 통한 성장 기회 발굴"],
    requirements: ["데이터 분석 경력 2년 이상", "SQL 및 통계 분석 역량", "근거 기반으로 꼼꼼하게 검증하는 분"],
  },
  {
    id: "seedloop-community-manager",
    company: "시드루프",
    companyInitial: "시",
    title: "커뮤니티 매니저",
    hiringProcessFilterIds: ["coffee_chat", "no_coding_test", "interview_1"],
    functionCategory: "마케팅",
    careerLabel: "신입 · 경력",
    companyScores: { S: 5, L: 1, E: 4, Y: 2, M: 5, D: 1, G: 3, A: 3 },
    postedAt: "2026-07-30",
    process: ["커피챗", "서류", "1차 실무면접"],
    duration: "1~2주",
    duties: ["커뮤니티 채널 운영 및 사용자 소통", "이벤트 기획과 빠른 실행", "사용자 피드백을 제품팀에 전달"],
    requirements: ["커뮤니티·소셜 채널 운영 경험", "빠르고 유연한 커뮤니케이션", "새로운 시도를 즐기는 분"],
  },
];
