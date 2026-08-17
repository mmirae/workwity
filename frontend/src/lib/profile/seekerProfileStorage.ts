export interface SeekerProfile {
  resumeUrl?: string;
  portfolioUrl?: string;
}

const KEY = "workwity:seeker-profile";

export function getSeekerProfile(): SeekerProfile {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "{}") as SeekerProfile;
  } catch {
    return {};
  }
}

export function saveSeekerProfile(profile: SeekerProfile): void {
  window.localStorage.setItem(KEY, JSON.stringify(profile));
}
