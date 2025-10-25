import React from "react";

export default function EmojiIcon({
  symbol,
  size = 34,
  className = "",
  label,
}: {
  symbol: string;
  size?: number;
  className?: string;
  label?: string;
}) {
  return (
    <span
      role="img"
      aria-label={label ?? "icon"}
      className={`select-none leading-none align-middle ${className}`}
      style={{ fontSize: `${size}px` }}
    >
      {symbol}
    </span>
  );
}