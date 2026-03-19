// components/SEOHead.jsx
// Gerado automaticamente pelo script de implementação SEO

import Head from 'next/head';
import seoConfig from '@/config/seo.json';

export default function SEOHead({ slug, customTitle, customDescription }) {
  const seo = seoConfig[slug] || {};
  
  const title = customTitle || seo.title || 'SmartKitNow - Free Online Calculators';
  const description = customDescription || seo.description || 'Free online calculators for every need.';
  const schemas = seo.schema || {};
  
  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={seo.url || ''} />
      <meta property="og:site_name" content="SmartKitNow" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      
      {/* Schema.org JSON-LD - WebApplication */}
      {schemas.webApp && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.webApp) }}
        />
      )}
      
      {/* Schema.org JSON-LD - FAQ */}
      {schemas.faq && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.faq) }}
        />
      )}
    </Head>
  );
}

export function useSEO(slug) {
  return seoConfig[slug] || null;
}
