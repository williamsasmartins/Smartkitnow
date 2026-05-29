import JsonLd from "@/components/seo/JsonLd";
import SEOHead from "@/components/SEOHead";

export default function HomeSEO(): JSX.Element {
  return (
    <>
      <SEOHead
        title="Smart Kit Now - Your Ultimate Smart Tools Collection"
        description="Free online calculators for finance, health, cooking, math, and more. Fast, accurate tools for everyday calculations — no signup required."
        canonical="https://www.smartkitnow.com/"
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Smart Kit Now",
          url: "https://www.smartkitnow.com",
          logo: "https://www.smartkitnow.com/logo-smartkitnow.webp",
          sameAs: [],
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          url: "https://www.smartkitnow.com",
          name: "Smart Kit Now",
          potentialAction: {
            "@type": "SearchAction",
            target: "https://www.smartkitnow.com/search?q={q}",
            "query-input": "required name=q",
          },
        }}
      />
    </>
  );
}
