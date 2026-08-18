import { SEED_COMPANY_JOBS, type CompanyJobPosting } from "@/lib/mock/companyApplicants";

const KEY = "workwity:company-job-postings";
const STATUS_KEY = "workwity:company-job-status-overrides";
const DELETED_KEY = "workwity:company-job-deleted-ids";
const EDITS_KEY = "workwity:company-job-edits";

type CompanyJobEdit = Partial<Omit<CompanyJobPosting, "id" | "status">>;

function readCreated(): CompanyJobPosting[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "[]") as CompanyJobPosting[];
  } catch {
    return [];
  }
}

function readStatusOverrides(): Record<string, CompanyJobPosting["status"]> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(STATUS_KEY) ?? "{}") as Record<string, CompanyJobPosting["status"]>;
  } catch {
    return {};
  }
}

function readDeletedIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(DELETED_KEY) ?? "[]") as string[];
  } catch {
    return [];
  }
}

function readEdits(): Record<string, CompanyJobEdit> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(EDITS_KEY) ?? "{}") as Record<string, CompanyJobEdit>;
  } catch {
    return {};
  }
}

/** Seed postings + anything created through the "공고 등록" flow this session, minus deleted ones. */
export function getCompanyJobs(): CompanyJobPosting[] {
  const overrides = readStatusOverrides();
  const deletedIds = readDeletedIds();
  const edits = readEdits();
  return [...SEED_COMPANY_JOBS, ...readCreated()]
    .filter((job) => !deletedIds.includes(job.id))
    .map((job) => (edits[job.id] ? { ...job, ...edits[job.id] } : job))
    .map((job) => (overrides[job.id] ? { ...job, status: overrides[job.id] } : job));
}

export function addCompanyJob(posting: CompanyJobPosting): void {
  const next = [...readCreated(), posting];
  window.localStorage.setItem(KEY, JSON.stringify(next));
}

/** Demo-level 모집중/마감 toggle — stored as an id→status override so it works for both seed and created postings. */
export function setCompanyJobStatus(id: string, status: CompanyJobPosting["status"]): void {
  const overrides = readStatusOverrides();
  overrides[id] = status;
  window.localStorage.setItem(STATUS_KEY, JSON.stringify(overrides));
}

/**
 * Demo-level delete: removes the posting from the "created" list (if it's a
 * user-created posting) and records the id as deleted so a seed posting with
 * that id never resurfaces from getCompanyJobs() either. There's no backing
 * DB, so "deleted" just means "filtered out from here on".
 */
export function deleteCompanyJob(id: string): void {
  window.localStorage.setItem(KEY, JSON.stringify(readCreated().filter((job) => job.id !== id)));

  const deletedIds = readDeletedIds();
  if (!deletedIds.includes(id)) {
    window.localStorage.setItem(DELETED_KEY, JSON.stringify([...deletedIds, id]));
  }
}

/**
 * Demo-level edit: for a user-created posting, updates it in place in the
 * "created" list. For a seed posting, records the change as an id→edit
 * override (same pattern as status overrides), merged on top of the seed
 * data at read time — status is intentionally excluded so an edit never
 * silently reopens/closes a posting.
 */
export function updateCompanyJob(id: string, patch: CompanyJobEdit): void {
  const created = readCreated();
  const index = created.findIndex((job) => job.id === id);
  if (index !== -1) {
    created[index] = { ...created[index], ...patch, id };
    window.localStorage.setItem(KEY, JSON.stringify(created));
    return;
  }

  const edits = readEdits();
  edits[id] = patch;
  window.localStorage.setItem(EDITS_KEY, JSON.stringify(edits));
}
