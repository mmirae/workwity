import { BONUS_CATEGORY_LABEL, BONUS_CATEGORY_ORDER } from "@/lib/workti/bonusCategoryMeta";

interface CommunicationBadge {
  category: string;
  badgeTag: string;
}

interface CommunicationGridProps {
  badges: CommunicationBadge[];
}

/**
 * Real 6-badge communication-culture grid — category label + the actual
 * result badge, not a flat hashtag list. 3 columns on desktop (3×2), stacks
 * to 1 column on mobile. Shared by the seeker's "나의 커뮤니케이션 성향"
 * sub-section and the company's "우리 팀의 커뮤니케이션 문화" section, since
 * both datasets produce the same 6 category keys.
 */
export function CommunicationGrid({ badges }: CommunicationGridProps) {
  const byCategory = new Map(badges.map((badge) => [badge.category, badge]));
  const ordered = BONUS_CATEGORY_ORDER.map((category) => byCategory.get(category)).filter(
    (badge): badge is CommunicationBadge => Boolean(badge)
  );

  if (ordered.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-gray-200 bg-gray-200 sm:grid-cols-3">
      {ordered.map((badge) => (
        <div key={badge.category} className="flex flex-col gap-1.5 bg-white p-5">
          <span className="text-caption font-semibold text-gray-400">
            {BONUS_CATEGORY_LABEL[badge.category] ?? badge.category}
          </span>
          <span className="text-body-md font-bold text-primary-600">{badge.badgeTag}</span>
        </div>
      ))}
    </div>
  );
}
