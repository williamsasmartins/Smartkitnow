import { Helmet } from 'react-helmet-async';
import seoConfig from '@/config/seo.json';

interface SEOHeadProps {
  slug?: string;
  title?: string;
  description?: string;
  canonical?: string;
}

export default function SEOHead({ slug, title, description, canonical }: SEOHeadProps) {
  const seoData = slug ? (seoConfig as Record<string, any>)[slug] : null;
  
  const finalTitle = title || seoData?.title || 'SmartKitNow - Free Online Calculators';
  const finalDescription = description || seoData?.description || 'Free online calculators for every need.';
  const finalCanonical = canonical || seoData?.url || '';
  const schemas = seoData?.schema || {};

  return (
    <Helmet>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      {finalCanonical && <link rel="canonical" href={finalCanonical} />}
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:type" content="website" />
      {finalCanonical && <meta property="og:url" content={finalCanonical} />}
      <meta property="og:site_name" content="SmartKitNow" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      {schemas.webApp && (
        <script type="application/ld+json">
          {JSON.stringify(schemas.webApp)}
        </script>
      )}
      {schemas.faq && (
        <script type="application/ld+json">
          {JSON.stringify(schemas.faq)}
        </script>
      )}
    </Helmet>
  );
}
