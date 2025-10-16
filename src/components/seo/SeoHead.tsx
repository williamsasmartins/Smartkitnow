import React from "react";
import { Helmet } from "react-helmet-async";

export type SeoConfig = {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  keywords?: string[];
};

type PropsDirect = SeoConfig;
type PropsConfig = { config: SeoConfig };

export default function SeoHead(props: PropsDirect | PropsConfig) {
  const site = "Smart Kit Now";
  const cfg: SeoConfig = "config" in props
    ? props.config
    : {
        title: props.title,
        description: props.description,
        canonical: props.canonical,
        ogImage: props.ogImage,
        keywords: props.keywords,
      };

  const twitterCard = cfg.ogImage ? "summary_large_image" : "summary";

  return (
    <Helmet>
      <title>
        {cfg.title} | {site}
      </title>
      <meta name="description" content={cfg.description} />
      {cfg.keywords?.length ? (
        <meta name="keywords" content={cfg.keywords.join(", ")} />
      ) : null}
      {cfg.canonical && <link rel="canonical" href={cfg.canonical} />}
      {cfg.canonical && (
        <>
          <link rel="alternate" href={cfg.canonical} hrefLang="en" />
          <link rel="alternate" href={cfg.canonical} hrefLang="x-default" />
        </>
      )}

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={site} />
      <meta property="og:title" content={cfg.title} />
      <meta property="og:description" content={cfg.description} />
      {cfg.canonical && <meta property="og:url" content={cfg.canonical} />}
      {cfg.ogImage && <meta property="og:image" content={cfg.ogImage} />}

      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={cfg.title} />
      <meta name="twitter:description" content={cfg.description} />
      {cfg.ogImage && <meta name="twitter:image" content={cfg.ogImage} />}
    </Helmet>
  );
}