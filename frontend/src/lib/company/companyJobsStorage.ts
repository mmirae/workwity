import { SEED_COMPANY_JOBS, type CompanyJobPosting } from "@/lib/mock/companyApplicants";

const KEY = "workwity:company-job-postings";

function readCreated(): CompanyJobPosting[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "[]") as CompanyJobPosting[];
  } catch {
    return [];
  }
}

/** Seed postings + anything created through the "공고 등록" flow this session. */
export function getCompanyJobs(): CompanyJobPosting[] {
  return [...SEED_COMPANY_JOBS, ...readCreated()];
}

export function addCompanyJob(posting: CompanyJobPosting): void {
  const next = [...readCreated(), posting];
  window.localStorage.setItem(KEY, JSON.stringify(next));
}
