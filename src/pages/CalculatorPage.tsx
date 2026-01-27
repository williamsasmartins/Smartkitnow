import React, { Suspense } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getEntry, FRIENDLY_TITLES, SUBCATEGORY_TITLES } from "@/data/calculatorRegistry";
import JsonLd from "@/components/seo/JsonLd";
import SEOHead from "@/components/SEOHead";

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

  // --- A MUDANÇA MÁGICA ---
  // Antes: Só era "Wide" se fosse financeiro.
  // Agora: É SEMPRE "Wide". Isso garante o fundo azul em tela cheia para TODOS.
  const isWide = true;
  // ------------------------

  const entry = calcSlug ? getEntry(calcSlug) : null;

  if (!entry) {
    return (
      <div className="mx-auto max-w-3xl px-4 lg:px-6 py-10">
        <SEOHead title="Calculator Not Found - Smart Kit Now" robots="noindex, nofollow" />
        <h1 className="text-2xl font-bold text-[#5c82ee]">Calculator not found</h1>
        <p className="mt-2 text-muted-foreground">We couldn't find this calculator. Please use the site menu.</p>
      </div>
    );
  }

  const LazyCalc = createLazyFromLoader(entry.loader, entry.namedExport);

  // Container Classes: Sempre usamos o padrão simétrico (Wide)
  // O controle de margem superior (padding-top) agora é responsabilidade exclusiva 
  // do componente CalculatorVerticalLayout, evitando duplicação de espaços.
  const containerClasses = "w-full px-4 md:px-8 lg:px-10";

  // Build BreadcrumbList JSON-LD
  const origin = "https://www.smartkitnow.com";
  const catSlug = entry.category;
  const subSlug = entry.subcategory;
  const catName = FRIENDLY_TITLES[catSlug] || catSlug;
  const subName = (subSlug && SUBCATEGORY_TITLES[catSlug]?.[subSlug]) || subSlug;

  const itemListElement = [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": `${origin}/`
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": catName,
      "item": `${origin}/${catSlug}`
    }
  ];

  let canonicalPath = `/${catSlug}`;

  if (subSlug) {
    itemListElement.push({
      "@type": "ListItem",
      "position": 3,
      "name": subName || subSlug,
      "item": `${origin}/${catSlug}/${subSlug}`
    });
    itemListElement.push({
      "@type": "ListItem",
      "position": 4,
      "name": entry.title,
      "item": `${origin}/${catSlug}/${subSlug}/${entry.slug}`
    });
    canonicalPath += `/${subSlug}/${entry.slug}`;
  } else {
    itemListElement.push({
      "@type": "ListItem",
      "position": 3,
      "name": entry.title,
      "item": `${origin}/${catSlug}/${entry.slug}`
    });
    canonicalPath += `/${entry.slug}`;
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": itemListElement
  };

  return (
    <div className={containerClasses}>
      <SEOHead
        title={`${entry.title} - Smart Kit Now`}
        description={entry.description || `Use our ${entry.title} to calculate results quickly and easily.`}
        canonical={`${origin}${canonicalPath}`}
      />
      <JsonLd data={breadcrumbJsonLd} />
      {/* max-w-none permite que o CalculatorVerticalLayout controle a largura interna */}
      <div className="max-w-none">
        <Suspense fallback={<div className="py-10 text-muted-foreground text-center">Loading Calculator...</div>}>
          <main className="min-w-0">
            <LazyCalc />
          </main>
        </Suspense>
      </div>
    </div>
  );
}
