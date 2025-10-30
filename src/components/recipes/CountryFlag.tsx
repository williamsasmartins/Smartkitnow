import React, { memo } from "react";

type Props = {
  code?: string; // ISO 3166-1 alpha-2 (e.g., "it")
  flag?: string; // emoji fallback (e.g., "🇮🇹")
  size?: number;
  className?: string;
  alt?: string;
};

function CountryFlag({ code, flag, size = 28, className = "", alt = "Flag" }: Props) {
  const normalized = (code || "").trim().toLowerCase();

  if (normalized) {
    const src = `/flags/${normalized}.svg`;
    return (
      <img
        src={src}
        width={size}
        height={size}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={`inline-block rounded-full border bg-card ${className}`}
      />
    );
  }

  // Fallback to emoji rendering if no code provided
  return (
    <span
      className={`inline-grid place-items-center rounded-full border bg-card ${className}`}
      style={{ width: size, height: size }}
      role={alt ? "img" : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
    >
      <span style={{ fontSize: Math.floor(size * 0.7) }}>{flag}</span>
    </span>
  );
}

export default memo(CountryFlag);