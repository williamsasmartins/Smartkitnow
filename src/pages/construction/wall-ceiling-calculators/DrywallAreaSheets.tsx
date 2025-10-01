// src/pages/construction/wall-ceiling-calculators/DrywallAreaSheets.tsx
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
// 👉 Usa a SUA calculadora já pronta:
import DrywallEstimator from "@/components/calculators/DrywallEstimator";

export default function DrywallAreaSheets() {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Drywall Area & Sheets Calculator · Smart Kit Now"
        description="Estimate drywall area, sheets, openings, ceilings and total cost."
        breadcrumbs={[
          { name: "Home", url: "https://www.smartkitnow.com/" },
          { name: "Construction Calculators", url: "https://www.smartkitnow.com/construction" },
          { name: "Wall & Ceiling Calculators", url: "https://www.smartkitnow.com/construction/wall-ceiling-calculators" },
          { name: "Drywall Area & Sheets", url: "https://www.smartkitnow.com/construction/wall-ceiling-calculators/drywall-area-sheets" },
        ]}
        schema={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Drywall Area & Sheets Calculator",
          applicationCategory: "Calculator",
          operatingSystem: "Any",
        }}
      />

      <Header />
      <main className="pt-20">
        <div className="container mx-auto px-4">
          {/* SUA calculadora funcionando, sem alterar nada nela */}
          <DrywallEstimator />
        </div>
      </main>
      <Footer />
    </div>
  );
}
