import React, { memo, useEffect, useMemo, useState } from "react";

type Props = {
  flag: string; // emoji flag string (e.g., "🇮🇹")
  size?: number;
  className?: string;
  alt?: string;
  renderAs?: "emoji" | "svg"; // default emoji; svg uses CDN + cache
};

const FLAG_CACHE = new Map<string, string>(); // slug -> objectURL
const CDN_BASE = "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg";

function emojiToSlug(emoji: string): string {
  const cps = Array.from(emoji).map((c) => c.codePointAt(0)?.toString(16)).filter(Boolean) as string[];
  return cps.join("-");
}

function CountryFlag({ flag, size = 28, className = "", alt = "Flag", renderAs = "emoji" }: Props) {
  const slug = useMemo(() => (renderAs === "svg" ? emojiToSlug(flag) : null), [flag, renderAs]);
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    if (renderAs !== "svg" || !slug) return;
    const url = `${CDN_BASE}/${slug}.svg`;

    if (FLAG_CACHE.has(slug)) {
      setSrc(FLAG_CACHE.get(slug)!);
      return;
    }

    let cancelled = false;
    fetch(url, { cache: "force-cache", mode: "cors" })
      .then((res) => {
        if (!res.ok) throw new Error("Flag fetch failed");
        return res.blob();
      })
      .then((blob) => {
        if (cancelled) return;
        const objectUrl = URL.createObjectURL(blob);
        FLAG_CACHE.set(slug, objectUrl);
        setSrc(objectUrl);
      })
      .catch(() => {
        setSrc(null);
      });

    return () => {
      cancelled = true;
    };
  }, [slug, renderAs]);

  if (renderAs === "svg" && src) {
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