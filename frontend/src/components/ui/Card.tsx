"use client";

import type { HTMLAttributes, KeyboardEvent, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type CardVariant = "base" | "featured" | "interactive";

interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, "className"> {
  variant?: CardVariant;
  className?: string;
  children: ReactNode;
}

const variantStyles: Record<CardVariant, string> = {
  base: "bg-white border border-gray-200 rounded-md p-6",
  featured: "bg-white border border-primary-100 rounded-lg p-7 shadow-sm",
  interactive:
    "bg-white border border-gray-200 rounded-md p-6 cursor-pointer transition-all duration-150 " +
    "hover:border-gray-300 hover:shadow-sm active:bg-primary-50 " +
    "focus-visible:outline-none focus-visible:shadow-focus",
};

export function Card({ variant = "base", className, children, onClick, ...rest }: CardProps) {
  const isInteractive = variant === "interactive" && typeof onClick === "function";

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!isInteractive) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick?.(event as unknown as React.MouseEvent<HTMLDivElement>);
    }
  };

  return (
    <div
      className={cn(variantStyles[variant], className)}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      {...rest}
    >
      {children}
    </div>
  );
}
