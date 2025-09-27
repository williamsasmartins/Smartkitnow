// /src/pages/calculatorPages/GenericCalculatorPage.tsx
import { Suspense, lazy, useMemo } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { calculatorRegistry } from "@/data/calculatorRegistry";
import { Button } from "@/components/ui/button";
import NotFound from "@/pages/NotFound";
import Seo from "@/components/Seo";
import Breadcrumbs from "@/components/Breadcrumbs";

function capitalizeSlug(slug: string) {
  return slug
    .split("-")
    .map((s) => (s ? s[0].toUpperCase() + s.slice(1) : s))
    .join(" ");
}

export default function GenericCalculatorPage() {
  const { base, subcategory, calculator } = useParams<{
    base: string;
    subcategory?: string;
    calculator: string;
  }>();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const entry = useMemo(() => {
    if (!base || !calculator) return null;
    return calculatorRegistry[base]?.[calculator] ?? null;
  }, [base, calculator]);

  if (!base || !calculator || !entry) return <NotFound />;

  const Comp = useMemo(
    () =>
      lazy(async () => {
        const mod = await entry.loader();
        const resolved = (mod && (mod.default ?? (entry.exportName ? mod[entry.exportName] : undefined))) as any;
        if (!resolved) {
          console.error(`Calc component not found for ${base}/${calculator}. Tried default and export: ${entry.exportName ?? "(none)"}`);
          return { default: () => <div className="p-6">Component not found for this calculator.</div> };
        }
        return { default: resolved };
      }),
    [entry, base, calculator]
  );

  const pageTitle = entry.title ?? capitalizeSlug(calculator);
  const description =
    entry.description ||
    `Use this ${capitalizeSlug(calculator)} on Smart Kit Now for quick and reliable results.`;

  const canonical =
    typeof window !== "undefined"
      ? `${window.location.origin}${pathname}`
      : `https://smartkitnow.com${pathname}`;

  const crumbs = [
    { label: "Home", href: "/" },
    { label: capitalizeSlug(base), href: `/${base}` },
    ...(subcategory ? [{ label: capitalizeSlug(subcategory), href: `/${base}/${subcategory}` }] : []),
    { label: pageTitle },
  ];

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: c.label,
      item: c.href ? `https://smartkitnow.com${c.href}` : canonical,
    })),
  };

  const appLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    applicationCategory: entry.appCategory || "CalculatorApplication",
    name: pageTitle,
    description,
    operatingSystem: "Web",
    url: canonical,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", ratingCount: "128" },
    publisher: { "@type": "Organization", name: "Smart Kit Now", url: "https://smartkitnow.com" },
  };

  const jsonLd = [breadcrumbLd, appLd];
  const backHref = `/${base}${subcategory ? `/${subcategory}` : ""}`;

  return (
    <div className="container mx-auto px-4 py-8">
      <Seo title={`${pageTitle} - Smart Kit Now`} description={description} canonical={canonical} jsonLd={jsonLd} />
      <Breadcrumbs items={crumbs} />

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Button variant="outline" onClick={() => navigate(backHref)}>← Back</Button>
        <h1 className="text-2xl font-bold">{pageTitle}</h1>
      </div>

      <Suspense fallback={<div className="mx-auto max-w-2xl py-10">Loading calculator…</div>}>
        <Comp />
      </Suspense>

      <div className="mt-10 text-sm text-muted-foreground flex flex-wrap gap-3">
        <Link to={`/${base}`} className="underline underline-offset-2 hover:text-foreground">
          More in {capitalizeSlug(base)}
        </Link>
        {subcategory && (
          <>
            <span>·</span>
            <Link to={`/${base}/${subcategory}`} className="underline underline-offset-2 hover:text-foreground">
              {capitalizeSlug(subcategory)} overview
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
