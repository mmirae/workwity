"use client";

import { useState } from "react";
import type { WorkTICode } from "@/data/workti/worktiData";
import { getCharacterImageSrc } from "@/lib/workti/characterImage";
import { cn } from "@/lib/cn";

interface WorkTICharacterImageProps {
  code: WorkTICode;
  /** Emoji shown until the real illustration exists at /public/workti-characters, or if it fails to load. */
  fallbackIcon: string;
  /** Box size in px for the default framed variant; also used to scale the fallback emoji in `frameless` mode. */
  size?: number;
  className?: string;
  /** Overrides the default `"{code} 캐릭터"` alt text — e.g. for a standalone preview that needs more context. */
  alt?: string;
  /**
   * Hero-illustration mode: no border/gradient/rounded frame — the image (or
   * emoji fallback) just fills its parent element via `object-contain`, so
   * the parent controls the actual box size/aspect (e.g. `absolute inset-0`
   * inside a sized wrapper). Used for the big Hero-band illustration; the
   * default (non-frameless) variant is unchanged and still used by the
   * share card / any other compact usage.
   */
  frameless?: boolean;
}

/**
 * Illustrated character for one Work-TI type. Looks for a real image at
 * `/workti-characters/{code}.png` first; if that file hasn't been added
 * yet (or fails to load), it falls back to the type's emoji inside the same
 * frame so the layout never shows a broken-image icon. Dropping in the real
 * .png files later requires no code change.
 */
export function WorkTICharacterImage({
  code,
  fallbackIcon,
  size = 128,
  className,
  frameless = false,
  alt,
}: WorkTICharacterImageProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const resolvedAlt = alt ?? `${code} 캐릭터`;

  if (frameless) {
    if (imageFailed) {
      return (
        <span
          className={cn("flex size-full items-center justify-center", className)}
          style={{ fontSize: size * 0.55 }}
          aria-hidden="true"
        >
          {fallbackIcon}
        </span>
      );
    }

    return (
      // eslint-disable-next-line @next/next/no-img-element -- local /public asset with a runtime emoji fallback; next/image's hard load-error UI doesn't fit that.
      <img
        src={getCharacterImageSrc(code)}
        alt={resolvedAlt}
        className={cn("size-full object-contain", className)}
        onError={() => setImageFailed(true)}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-primary-100 bg-gradient-to-br from-primary-50 to-primary-100",
        className
      )}
      style={{ width: size, height: size }}
    >
      {imageFailed ? (
        <span style={{ fontSize: size * 0.5 }} aria-hidden="true">
          {fallbackIcon}
        </span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element -- local /public asset with a runtime emoji fallback; next/image's hard load-error UI doesn't fit that.
        <img
          src={getCharacterImageSrc(code)}
          alt={resolvedAlt}
          width={size}
          height={size}
          className="size-full object-contain"
          onError={() => setImageFailed(true)}
        />
      )}
    </div>
  );
}
