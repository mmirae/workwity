import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
}

type ButtonAsButton = ButtonBaseProps & {
  href?: undefined;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className">;

type ButtonAsLink = ButtonBaseProps & {
  href: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "href">;

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-3.5 text-[14px] gap-1.5",
  md: "h-11 px-[18px] text-[15px] gap-2",
  lg: "h-13 px-6 text-[16px] gap-2",
};

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 disabled:hover:bg-primary-600",
  secondary:
    "bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 active:bg-gray-100 disabled:hover:bg-white",
  ghost: "bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200 disabled:hover:bg-transparent",
};

const baseStyles =
  "inline-flex items-center justify-center rounded-md font-semibold whitespace-nowrap transition-colors duration-150 cursor-pointer " +
  "focus-visible:outline-none focus-visible:shadow-focus disabled:opacity-50 disabled:cursor-not-allowed";

function Spinner() {
  return (
    <span
      aria-hidden="true"
      className="size-4 shrink-0 rounded-full border-2 border-current border-t-transparent animate-spin"
    />
  );
}

export function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    loading = false,
    fullWidth = false,
    className,
    children,
    href,
    ...rest
  } = props;

  const classes = cn(
    baseStyles,
    sizeStyles[size],
    variantStyles[variant],
    fullWidth && "w-full",
    className
  );

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        aria-disabled={loading || undefined}
        {...(rest as Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "href">)}
      >
        {loading && <Spinner />}
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={classes}
      disabled={loading || (rest as ButtonHTMLAttributes<HTMLButtonElement>).disabled}
      {...(rest as Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className">)}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}
