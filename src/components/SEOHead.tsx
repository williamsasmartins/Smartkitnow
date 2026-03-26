import { Helmet } from 'react-helmet-async';
import seoConfig from '@/config/seo.json';

interface OgProps {
  type?: string;
  url?: string;
  siteName?: string;
  image?: string;
}

interface TwitterProps {
  card?: string;
  image?: string;
}

interface ExtraMeta {
  name?: string;
  property?: string;
  content: string;
}

interface SEOHeadProps {
  slug?: string;
  title?: string;
  description?: string;
  canonical?: string;
  /** robots meta content, e.g. "index,follow" or "noindex, follow" */
  robots?: string;
  /** Open Graph overrides */
  og?: OgProps;
  /** Twitter Card overrides */
  twitter?: TwitterProps;
  /** Additional arbitrary <meta> tags */
  extra?: ExtraMeta[];
}

export default function SEOHead({
  slug,
  title,
  description,
  canonical,
  robots,
  og,
  twitter,
  extra,
}: SEOHeadProps) {
  const seoData = slug ? (seoConfig as Record<string, any>)[slug] : null;

  const finalTitle = title || seoData?.title || 'SmartKitNow - Free Online Calculators';
  const finalDescription = description || seoData?.description || 'Free online calculators for every need.';
  const finalCanonical = canonical || seoData?.url || '';
  const schemas = seoData?.schema || {};

  const ogType = og?.type || 'website';
  const ogUrl = og?.url || finalCanonical;
  const ogSiteName = og?.siteName || 'SmartKitNow';

  const twitterCard = twitter?.card || 'summary_large_image';

  return (
    <Helmet>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      {robots && <meta name="robots" content={robots} />}
      {finalCanonical && <link rel="canonical" href={finalCanonical} />}

      {/* Open Graph */}
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:type" content={ogType} />
      {ogUrl && <meta property="og:url" content={ogUrl} />}
      <meta property="og:site_name" content={ogSiteName} />
      {og?.image && <meta property="og:image" content={og.image} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      {twitter?.image && <meta name="twitter:image" content={twitter.image} />}

      {/* Extra arbitrary meta tags (keywords, etc.) */}
      {extra?.map((m, i) =>
        m.name ? (
          <meta key={i} name={m.name} content={m.content} />
        ) : m.property ? (
          <meta key={i} property={m.property} content={m.content} />
        ) : null
      )}

      {/* JSON-LD from seo.json config */}
      {schemas.webApp && (
        <script type="application/ld+json">
          {JSON.stringify(schemas.webApp)}
        </script>
      )}
      {/* schemas.faq omitted: FAQ JSON-LD is emitted by each calculator
          via useFaqJsonLd → CalculatorVerticalLayout jsonLd prop. Emitting it
          here too causes duplicate FAQPage errors in Google Search Console. */}
    </Helmet>
  );
}

