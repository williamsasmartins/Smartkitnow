// /src/components/Seo.tsx
import { useEffect } from "react";

type SeoProps = {
  title?: string;
  description?: string;
  canonical?: string;
  noindex?: boolean;
  jsonLd?: Record<string, any> | Record<string, any>[];
};

function upsertTag<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  attrs: Record<string, string>,
  parent: HTMLElement = document.head
) {
  const selector = Object.entries(attrs)
    .map(([k, v]) => `[${k}="${v}"]`)
    .join("");
  let el = parent.querySelector<HTMLElementTagNameMap[K]>(`${tagName}${selector}`);
  if (!el) {
    el = document.createElement(tagName) as HTMLElementTagNameMap[K];
    Object.entries(attrs).forEach(([k, v]) => el!.setAttribute(k, v));
    parent.appendChild(el);
  }
  return el!;
}

export default function Seo({ title, description, canonical, noindex, jsonLd }: SeoProps) {
  useEffect(() => {
    const prevTitle = document.title;
    if (title) document.title = title;

    let metaDesc: HTMLMetaElement | null = null;
    if (description) {
      metaDesc = upsertTag("meta", { name: "description" }) as HTMLMetaElement;
      metaDesc.setAttribute("content", description);
    }

    let linkCanon: HTMLLinkElement | null = null;
    if (canonical) {
      linkCanon = upsertTag("link", { rel: "canonical" }) as HTMLLinkElement;
      linkCanon.setAttribute("href", canonical);
    }

    let metaRobots: HTMLMetaElement | null = null;
    if (noindex) {
      metaRobots = upsertTag("meta", { name: "robots" }) as HTMLMetaElement;
      metaRobots.setAttribute("content", "noindex,nofollow");
    }

    // JSON-LD
    let jsonLdEl: HTMLScriptElement | null = null;
    if (jsonLd) {
      jsonLdEl = document.createElement("script");
      jsonLdEl.type = "application/ld+json";
      jsonLdEl.text = JSON.stringify(jsonLd);
      document.head.appendChild(jsonLdEl);
    }

    return () => {
      if (title) document.title = prevTitle;
      if (metaDesc && !description) metaDesc.remove();
      if (linkCanon && !canonical) linkCanon.remove();
      if (metaRobots && !noindex) metaRobots.remove();
      if (jsonLdEl) jsonLdEl.remove();
    };
  }, [title, description, canonical, noindex, jsonLd]);

  return null;
}
