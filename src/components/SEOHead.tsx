import { useEffect } from "react";

type Props = {
  title: string;
  description?: string;
  canonical?: string;
  ogType?: string;
  ogImage?: string;
};

export default function SeoHead({ title, description, canonical, ogType = "website", ogImage }: Props) {
  useEffect(() => {
    document.title = title;

    const setMeta = (name: string, content?: string, attr: "name" | "property" = "name") => {
      if (!content) return;
      let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    const setLink = (rel: string, href?: string) => {
      if (!href) return;
      let el = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
      if (!el) {
        el = document.createElement("link");
        el.setAttribute("rel", rel);
        document.head.appendChild(el);
      }
      el.setAttribute("href", href);
    };

    const setAlternate = (href?: string, hreflang?: string) => {
      if (!href || !hreflang) return;
      let el = document.querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${hreflang}"]`);
      if (!el) {
        el = document.createElement("link");
        el.setAttribute("rel", "alternate");
        el.setAttribute("hreflang", hreflang);
        document.head.appendChild(el);
      }
      el.setAttribute("href", href);
    };

    setMeta("description", description);
    setMeta("og:title", title, "property");
    setMeta("og:description", description, "property");
    setMeta("og:type", ogType, "property");
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    if (ogImage) {
      setMeta("og:image", ogImage, "property");
      setMeta("twitter:image", ogImage);
    }
    setLink("canonical", canonical);
    setAlternate(canonical, "en");
    setAlternate(canonical, "x-default");
  }, [title, description, canonical, ogType, ogImage]);

  return null;
}
