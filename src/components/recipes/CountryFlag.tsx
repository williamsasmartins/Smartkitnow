import React from "react";

export default function CountryFlag({
  flag,
  size = 28,
  className = "",
}: { flag: string; size?: number; className?: string }) {
  return (
    <span
      className={`inline-grid place-items-center rounded-full border bg-card ${className}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <span style={{ fontSize: Math.floor(size * 0.7) }}>{flag}</span>
    </span>
  );
}