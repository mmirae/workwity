import type { WorkTICode } from "@/data/workti/worktiData";

/**
 * Path to a Work-TI type's illustrated character image. Files live at
 * `public/workti-characters/{CODE}.png` (see the README there) — swap in
 * the real artwork by dropping a file at that exact path, no code changes
 * needed. Until the real file exists, WorkTICharacterImage falls back to
 * the type's `characterIcon` emoji.
 */
export function getCharacterImageSrc(code: WorkTICode): string {
  return `/workti-characters/${code}.png`;
}
