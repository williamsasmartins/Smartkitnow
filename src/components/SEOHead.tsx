// src/components/SEOHead.tsx
import React from "react";
import { Helmet } from "react-helmet";

type Crumb = { name: string; url: string };

export type SEOHeadProps = {
  /** <title> da página */
  title: string;
  /** meta description (opcional) */
  description?: string;
  /** meta keywords (opcional) */
  keywords?: string[];
  /** breadcrumbs para JSON-LD (opcional) */
  breadcrumbs?: Crumb[];
  /** objeto Schema.org para JSON-LD (opcional) */
  schema?: Record<string, any>;
  /** link rel="canonical" (opcional) */
  canonical?: string;
  /** children opcionais */
  children?: React.ReactNode;
};

function buildBreadcrumbLD(bcs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: bcs.map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: b.name,
      item: b.url,
    })),
  };
}

const siteName = "SmartKitNow";

const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  breadcrumbs,
  schema,
  canonical,
  children,
}) => {
  // Tenta inferir URL atual para OG/twitter se canonical não vier
  const currentUrl =
    typeof window !== "undefined" ? window.location.href : undefined;
  const canonicalUrl = canonical || currentUrl;
  const ogUrl = canonicalUrl;

  // JSON-LD (schema + breadcrumbs)
  const ldJson: any[] = [];
  if (breadcrumbs && breadcrumbs.length > 0) {
    ldJson.push(buildBreadcrumbLD(breadcrumbs));
  }
  if (schema) {
    ldJson.push(schema);
  }

  return (
    <>
      <Helmet>
        {/* Title */}
        <title>{title}</title>

        {/* Meta básicos */}
        {description && (
          <meta name="description" content={description} />
        )}
        {keywords && keywords.length > 0 && (
          <meta name="keywords" content={keywords.join(", ")} />
        )}

        {/* Canonical */}
        {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

        {/* Open Graph */}
        <meta property="og:site_name" content={siteName} />
        <meta property="og:title" content={title} />
        {description && (
          <meta property="og:description" content={description} />
        )}
        {ogUrl && <meta property="og:url" content={ogUrl} />}
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        {description && (
          <meta name="twitter:description" content={description} />
        )}
        {ogUrl && <meta name="twitter:url" content={ogUrl} />}

        {/* JSON-LD */}
        {ldJson.length > 0 && (
          <script type="application/ld+json">
            {JSON.stringify(ldJson)}
          </script>
        )}
      </Helmet>

      {children}
    </>
  );
};

export default SEOHead;
