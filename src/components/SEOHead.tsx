import { Helmet } from "react-helmet-async";

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

export default function SEOHead({ title, description, canonical, robots = "index,follow", og, twitter, extra, ogType, ogImage }: Props) {
  // Logic to build canonical if not provided
  // It removes query strings (?...) by using window.location.origin + window.location.pathname
  // Note: structured canonical passed via props should take precedence.
  const effectiveCanonical = canonical || (
    typeof window !== 'undefined'
      ? window.location.origin + window.location.pathname
      : undefined
  );

  const ogDefaults: OpenGraph = { type: ogType || "article", siteName: "Smart Kit Now", url: effectiveCanonical, image: ogImage };
  const ogData = { ...ogDefaults, ...(og || {}) };

  const twDefaults: Twitter = { card: "summary_large_image", image: ogData.image };
  const tw = { ...twDefaults, ...(twitter || {}) };

  return (
    <Helmet>
      {/* Basic */}
      <title>{title}</title>
      <meta name="robots" content={robots} />
      {description && <meta name="description" content={description} />}
      {effectiveCanonical && <link rel="canonical" href={effectiveCanonical} />}

      {/* Alternates (Example: Just self-referencing en/x-default for now as per previous logic) */}
      {effectiveCanonical && <link rel="alternate" href={effectiveCanonical} hrefLang="en" />}
      {effectiveCanonical && <link rel="alternate" href={effectiveCanonical} hrefLang="x-default" />}

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:type" content={ogData.type} />
      {ogData.url && <meta property="og:url" content={ogData.url} />}
      {ogData.siteName && <meta property="og:site_name" content={ogData.siteName} />}
      {ogData.image && <meta property="og:image" content={ogData.image} />}

      {/* Twitter */}
      <meta name="twitter:card" content={tw.card} />
      <meta name="twitter:title" content={title} />
      {description && <meta name="twitter:description" content={description} />}
      {tw.image && <meta name="twitter:image" content={tw.image} />}
      {tw.site && <meta name="twitter:site" content={tw.site} />}
      {tw.creator && <meta name="twitter:creator" content={tw.creator} />}

      {/* Extra */}
      {extra?.map((item, idx) => (
        <meta key={idx} {...item} />
      ))}
    </Helmet>
  );
}
