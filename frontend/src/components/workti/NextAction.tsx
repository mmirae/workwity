import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface ActionSpec {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface NextActionProps {
  description: string;
  primary: ActionSpec;
  secondary: ActionSpec;
  textCta?: ActionSpec;
}

function ActionButton({ action, variant }: { action: ActionSpec; variant: "primary" | "secondary" }) {
  if (action.href) {
    return (
      <Button variant={variant} size="md" href={action.href}>
        {action.label}
      </Button>
    );
  }
  return (
    <Button variant={variant} size="md" onClick={action.onClick}>
      {action.label}
    </Button>
  );
}

/**
 * Shared "다음으로 해볼 것" closing band. `primary`/`secondary` split "결과
 * 활용" (share/save-image on the seeker report, apply/retake on the company
 * report) from job-browsing/navigation actions, which live in `textCta`.
 */
export function NextAction({ description, primary, secondary, textCta }: NextActionProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-10 text-center">
      <span className="text-code-sm text-primary-600">NEXT ACTION</span>
      <h2 className="text-heading-3 text-gray-950">다음으로 해볼 것</h2>
      <p className="max-w-[440px] text-body-sm text-gray-500">{description}</p>
      <div className="mt-2 flex flex-col gap-2.5 sm:flex-row">
        <ActionButton action={primary} variant="primary" />
        <ActionButton action={secondary} variant="secondary" />
      </div>
      {textCta &&
        (textCta.href ? (
          <Link href={textCta.href} className="mt-1 text-body-sm font-semibold text-gray-500 hover:text-primary-600">
            {textCta.label}
          </Link>
        ) : (
          <button
            type="button"
            onClick={textCta.onClick}
            className="mt-1 text-body-sm font-semibold text-gray-500 hover:text-primary-600"
          >
            {textCta.label}
          </button>
        ))}
    </div>
  );
}
