// components/SEOHead.tsx
// Componente SEO para Vite + React usando react-helmet-async
// Uso: <SEOHead slug="dog-calorie-calculator" />

import { Helmet } from 'react-helmet-async';
import seoConfig from '@/config/seo.json';

interface SEOHeadProps {
  slug?: string;
  customTitle?: string;
  customDescription?: string;
}

export default function SEOHead({ slug, customTitle, customDescription }: SEOHeadProps) {
  const seo = slug ? (seoConfig as Record<string, any>)[slug] : null;

  const title = customTitle || seo?.title || 'SmartKitNow - Free Online Calculators';
  const description = customDescription || seo?.description || 'Free online calculators for every need.';
  const schemas = seo?.schema || {};
  const url = seo?.url || '';

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="SmartKitNow" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />

      {/* Schema.org JSON-LD - WebApplication */}
      {schemas.webApp && (
        <script type="application/ld+json">
          {JSON.stringify(schemas.webApp)}
        </script>
      )}

      {/* Schema.org JSON-LD - FAQ */}
      {schemas.faq && (
        <script type="application/ld+json">
          {JSON.stringify(schemas.faq)}
        </script>
      )}
    </Helmet>
  );
}

export function useSEO(slug: string) {
  return (seoConfig as Record<string, any>)[slug] || null;
}
