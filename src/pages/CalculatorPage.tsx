import React, { Suspense } from "react";
import { useParams } from "react-router-dom";
import { getEntry } from "@/data/calculatorRegistry";
import JsonLd from "@/components/seo/JsonLd";
import SEOHead from "@/components/SEOHead";
import NotFound from "./NotFound";
import RelatedCalculators from "@/components/RelatedCalculators";

function createLazyFromLoader(loader: () => Promise<any>, namedExport?: string) {
  const Lazy = React.lazy(async () => {
    const mod = await loader();
    return { default: namedExport ? mod[namedExport] : (mod.default ?? Object.values(mod)[0]) };
  });
  return Lazy;
}

interface CalculatorPageProps {
  activeSlug?: string;
}

export default function CalculatorPage({ activeSlug }: CalculatorPageProps) {
  const { calculator, slug } = useParams();

  const calcSlug = (activeSlug ?? calculator ?? slug ?? "").toLowerCase();

  const entry = calcSlug ? getEntry(calcSlug) : null;

  if (!entry) {
    // Render NotFound inline to prevent client-side redirect loops
    // and better SEO handling for missing entries natively.
    return <NotFound />;
  }

  const LazyCalc = createLazyFromLoader(entry.loader, entry.namedExport);

  // Container Classes: Sempre usamos o padrão simétrico (Wide)
  // O controle de margem superior (padding-top) agora é responsabilidade exclusiva 
  // do componente CalculatorVerticalLayout, evitando duplicação de espaços.
  const containerClasses = "w-full px-4 md:px-8 lg:px-10";

  const catSlug = entry.category;
  const subSlug = entry.subcategory;

  const origin = "https://www.smartkitnow.com";

  // Decide actual link structure based on entry options
  // (Logic matched with src/data/calculatorRegistry.ts -> calcLink)
  const isFlat = entry.urlStyle === "flat";
  // If explicitly flat, OR if there's no subcategory (common default)
  const useNested = !isFlat && subSlug && subSlug !== "general";

  let calculatedPath = "";

  if (useNested) {
    calculatedPath = `/${catSlug}/${subSlug}/${entry.slug}`;
  } else {
    calculatedPath = `/${catSlug}/${entry.slug}`;
  }

  const seoTitle = entry.seoTitle
    ? `${entry.seoTitle} | Smart Kit Now`
    : `${entry.title} — Free Online Calculator | Smart Kit Now`;

  const seoDescription = entry.seoDescription || entry.description
    || `Use our free ${entry.title} online. Fast, accurate, and mobile-friendly.`;

  const softwareAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": entry.title,
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "url": `${origin}${calculatedPath}`
  };

  return (
    <div className={containerClasses}>
      <SEOHead
        slug={entry.slug}
        title={seoTitle}
        description={seoDescription}
        canonical={`${origin}${calculatedPath}`}
      />
      <JsonLd data={softwareAppJsonLd} />
      {/* max-w-none permite que o CalculatorVerticalLayout controle a largura interna */}
      <div className="max-w-none">
        <Suspense fallback={<div className="py-10 text-muted-foreground text-center">Loading Calculator...</div>}>
          <main className="min-w-0">
            <LazyCalc />
          </main>
        </Suspense>
        <RelatedCalculators
          currentSlug={entry.slug}
          category={entry.category}
          subcategory={entry.subcategory}
        />
      </div>
    </div>
  );
}
