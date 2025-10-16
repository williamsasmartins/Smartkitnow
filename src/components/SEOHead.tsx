import { useEffect } from "react";

type OpenGraph = {
  type?: "website" | "article";
  image?: string;
  url?: string;
  siteName?: string;
};

type Twitter = {
  card?: "summary_large_image" | "summary";
  image?: string;
  site?: string;    // @handle
  creator?: string; // @handle
};

type LegacyProps = {
  ogType?: "website" | "article";
  ogImage?: string;
};

type Props = {
  title: string;
  description?: string;
  canonical?: string;
  robots?: string; // e.g., "index,follow" or "noindex,follow"
  og?: OpenGraph;
  twitter?: Twitter;
  // Additional meta if ever needed
  extra?: Array<{ name?: string; property?: string; content: string }>;
} & LegacyProps;

export default function SeoHead({ title, description, canonical, robots = "index,follow", og, twitter, extra, ogType, ogImage }: Props) {
  useEffect(() => {
    // <title>
    document.title = title;

    const setMeta = (sel: string, newEl: () => HTMLElement, set: (el: HTMLElement) => void) => {
      let el = document.head.querySelector(sel) as HTMLElement | null;
      if (!el) {
        el = newEl();
        document.head.appendChild(el);
      }
      set(el);
    };

    // robots
    setMeta('meta[name="robots"]',
      () => {
        const m = document.createElement("meta");
        m.setAttribute("name", "robots");
        return m;
      },
      (el) => el.setAttribute("content", robots)
    );

    // description
    if (description) {
      setMeta('meta[name="description"]',
        () => {
          const m = document.createElement("meta");
          m.setAttribute("name", "description");
          return m;
        },
        (el) => el.setAttribute("content", description)
      );
    }

    // canonical
    if (canonical) {
      setMeta('link[rel="canonical"]',
        () => {
          const l = document.createElement("link");
          l.setAttribute("rel", "canonical");
          return l;
        },
        (el) => (el as HTMLLinkElement).setAttribute("href", canonical)
      );

      // alternates (basic en and x-default)
      const upsertAlternate = (hreflang: string, href: string) => {
        const sel = `link[rel="alternate"][hreflang="${hreflang}"]`;
        let el = document.head.querySelector<HTMLLinkElement>(sel);
        if (!el) {
          el = document.createElement("link");
          el.setAttribute("rel", "alternate");
          el.setAttribute("hreflang", hreflang);
          document.head.appendChild(el);
        }
        el.setAttribute("href", href);
      };
      upsertAlternate("en", canonical);
      upsertAlternate("x-default", canonical);
    }

    // Open Graph
    const ogDefaults: OpenGraph = { type: ogType || "article", siteName: "Smart Kit Now", url: canonical, image: ogImage };
    const ogData = { ...ogDefaults, ...(og || {}) };
    const setOG = (property: string, content?: string) => {
      if (!content) return;
      setMeta(`meta[property="${property}"]`,
        () => {
          const m = document.createElement("meta");
          m.setAttribute("property", property);
          return m;
        },
        (el) => el.setAttribute("content", content)
      );
    };
    setOG("og:title", title);
    setOG("og:description", description);
    setOG("og:type", ogData.type);
    setOG("og:url", ogData.url);
    setOG("og:site_name", ogData.siteName);
    if (ogData.image) setOG("og:image", ogData.image);

    // Twitter
    const twDefaults: Twitter = { card: "summary_large_image", image: ogData.image };
    const tw = { ...twDefaults, ...(twitter || {}) };
    const setTW = (name: string, content?: string) => {
      if (!content) return;
      setMeta(`meta[name="${name}"]`,
        () => {
          const m = document.createElement("meta");
          m.setAttribute("name", name);
          return m;
        },
        (el) => el.setAttribute("content", content)
      );
    };
    setTW("twitter:card", tw.card);
    setTW("twitter:title", title);
    if (description) setTW("twitter:description", description);
    if (tw.image) setTW("twitter:image", tw.image);
    if (tw.site) setTW("twitter:site", tw.site);
    if (tw.creator) setTW("twitter:creator", tw.creator);

    // Extra meta
    if (Array.isArray(extra)) {
      extra.forEach(({ name, property, content }) => {
        if (!content) return;
        if (name) {
          setMeta(`meta[name="${name}"]`,
            () => {
              const m = document.createElement("meta");
              m.setAttribute("name", name);
              return m;
            },
            (el) => el.setAttribute("content", content)
          );
        } else if (property) {
          setMeta(`meta[property="${property}"]`,
            () => {
              const m = document.createElement("meta");
              m.setAttribute("property", property);
              return m;
            },
            (el) => el.setAttribute("content", content)
          );
        }
      });
    }
  }, [title, description, canonical, robots, og, twitter, extra, ogType, ogImage]);

  return null;
}
