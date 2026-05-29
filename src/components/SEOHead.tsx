import { Helmet } from 'react-helmet-async';
import seoConfig from '@/config/seo.json';
import { safeJsonLd } from '@/lib/utils';

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
  const BASE = 'https://www.smartkitnow.com';
  const rawCanonical = canonical || seoData?.url || '';
  const finalCanonical = rawCanonical && !rawCanonical.startsWith('http')
    ? `${BASE}${rawCanonical.startsWith('/') ? rawCanonical : '/' + rawCanonical}`
    : rawCanonical;
  const schemas = seoData?.schema || {};

  const CATEGORY_OG_IMAGES: Record<string, string> = {
    financial: '/og-financial.png',
    health: '/og-health.png',
    cooking: '/og-cooking.png',
    conversion: '/og-conversion.png',
    math: '/og-math.png',
    science: '/og-science.png',
    time: '/og-time.png',
    pets: '/og-pets.png',
    automotive: '/og-automotive.png',
    construction: '/og-construction.png',
    electrical: '/og-electrical.png',
    everyday: '/og-everyday.png',
    sports: '/og-sports.png',
    funny: '/og-funny.png',
    video: '/og-video.png',
    marketing: '/og-marketing.png',
    games: '/og-games.png',
  };

  let categorySlug = '';
  if (finalCanonical) {
    try {
      categorySlug = new URL(finalCanonical).pathname.split('/').filter(Boolean)[0] ?? '';
    } catch {
      // invalid URL — fall through
    }
  }
  const categoryOgImage = categorySlug && CATEGORY_OG_IMAGES[categorySlug]
    ? `${BASE}${CATEGORY_OG_IMAGES[categorySlug]}`
    : `${BASE}/og-image.png`;

  const ogType = og?.type || 'website';
  const ogUrl = og?.url || finalCanonical;
  const ogSiteName = og?.siteName || 'SmartKitNow';
  const ogImage = og?.image || categoryOgImage;

  const twitterCard = twitter?.card || 'summary_large_image';
  const twitterImage = twitter?.image || ogImage;

  return (
    <Helmet>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      {robots && <meta name="robots" content={robots} />}
      {finalCanonical && <link rel="canonical" href={finalCanonical} />}
      {finalCanonical && <link rel="alternate" href={finalCanonical} hrefLang="en" />}
      {finalCanonical && <link rel="alternate" href={finalCanonical} hrefLang="x-default" />}

      {/* Open Graph */}
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:type" content={ogType} />
      {ogUrl && <meta property="og:url" content={ogUrl} />}
      <meta property="og:site_name" content={ogSiteName} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={twitterImage} />

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
          {safeJsonLd(schemas.webApp)}
        </script>
      )}
      {/* schemas.faq omitted: FAQ JSON-LD is emitted by each calculator
          via useFaqJsonLd → CalculatorVerticalLayout jsonLd prop. Emitting it
          here too causes duplicate FAQPage errors in Google Search Console. */}
    </Helmet>
  );
}

