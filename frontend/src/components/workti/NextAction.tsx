import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface ActionSpec {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface NextActionProps {
  eyebrow?: string;
  title?: string;
  description: string;
  primary: ActionSpec;
  /** Single demoted action, rendered next to `primary`. Superseded by `secondaryActions` when both are given. */
  secondary?: ActionSpec;
  /** Multiple demoted actions, rendered below `primary` instead of alongside it. */
  secondaryActions?: ActionSpec[];
  textCta?: ActionSpec;
}

function ActionButton({
  action,
  variant,
  size = "md",
  fullWidth,
  className,
}: {
  action: ActionSpec;
  variant: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  className?: string;
}) {
  if (action.href) {
    return (
      <Button variant={variant} size={size} href={action.href} fullWidth={fullWidth} className={className}>
        {action.label}
      </Button>
    );
  }
  return (
    <Button variant={variant} size={size} onClick={action.onClick} fullWidth={fullWidth} className={className}>
      {action.label}
    </Button>
  );
}

/**
 * Shared closing CTA band. `primary` is the emphasized action; `secondary`
 * (single, inline) or `secondaryActions` (multiple, stacked below `primary`
 * at a lower visual weight) hold everything else — e.g. share/save-image on
 * the seeker report, apply/retake on the company report.
 */
export function NextAction({
  eyebrow = "NEXT ACTION",
  title = "다음으로 해볼 것",
  description,
  primary,
  secondary,
  secondaryActions,
  textCta,
}: NextActionProps) {
  const isGroupedLayout = Boolean(secondaryActions);

  return (
    <div
      className={
        isGroupedLayout
          ? "flex flex-col items-center gap-2.5 rounded-lg border border-gray-200 bg-gray-50 p-8 text-center"
          : "flex flex-col items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-10 text-center"
      }
    >
      <span className="text-code-sm text-primary-600">{eyebrow}</span>
      <h2 className="text-heading-3 text-gray-950">{title}</h2>
      <p className="max-w-[440px] text-body-sm text-gray-500">{description}</p>

      {secondaryActions ? (
        <div className="mt-2 flex w-full max-w-[360px] flex-col gap-2.5">
          <ActionButton action={primary} variant="primary" size="md" fullWidth />
          <div className="flex gap-2.5">
            {secondaryActions.map((action) => (
              <ActionButton key={action.label} action={action} variant="secondary" size="md" className="flex-1" />
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-2 flex flex-col gap-2.5 sm:flex-row">
          <ActionButton action={primary} variant="primary" />
          {secondary && <ActionButton action={secondary} variant="secondary" />}
        </div>
      )}

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
