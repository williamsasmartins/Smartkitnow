import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import PageWithRails from "@/components/layouts/PageWithRails";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Divide as DivideIcon } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import BackButton from "@/components/BackButton";

const CARDS = [
  {
    to: "/math/fractions/fraction-reducer",
    title: "Fraction Reducer",
    caption: "Open tool",
    bg: "rgba(59,130,246,0.12)",
    fg: "#3b82f6",
  },
  {
    to: "/math/fractions/fraction-to-decimal",
    title: "Fraction → Decimal",
    caption: "Open tool",
    bg: "rgba(16,185,129,0.12)",
    fg: "#10b981",
  },
  {
    to: "/math/fractions/decimal-to-fraction",
    title: "Decimal → Fraction",
    caption: "Open tool",
    bg: "rgba(245,158,11,0.15)",
    fg: "#f59e0b",
  },
  {
    to: "/math/fractions/percent-to-fraction",
    title: "Percent ↔ Fraction",
    caption: "Open tool",
    bg: "rgba(139,92,246,0.14)",
    fg: "#8b5cf6",
  },
];

export default function FractionsCalculators() {
  return (
    <div className="min-h-screen bg-gradient-soft">
      <SEOHead
        title="Fractions & Ratios · Smart Kit Now"
        description="Work with fractions fast: reduce/simplify, convert fraction ↔ decimal and percent."
        breadcrumbs={[
          { name: "Home", url: "https://www.smartkitnow.com/" },
          { name: "Math & Algebra Calculators", url: "https://www.smartkitnow.com/math" },
          { name: "Fractions & Ratios", url: "https://www.smartkitnow.com/math/fractions" },
        ]}
        schema={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Fractions & Ratios",
          url: "https://www.smartkitnow.com/math/fractions",
          description:
            "Reduce fractions and convert to decimal or percent with professional, SEO-first tools.",
        }}
      />

      <Header />

      <main className="pt-20">
        <PageWithRails
          titleBlock={
            <div>
              {/* Back azul alinhado à esquerda */}
              <div className="mb-6 flex justify-start">
                <BackButton fallback="/math" className="!px-3 !py-1.5" />
              </div>

              {/* Título e subtítulo centralizados com cores padrão SKN */}
              <div className="text-center">
                <div className="flex flex-col items-center gap-3">
                  <span
                    className="inline-flex items-center justify-center rounded-xl"
                    style={{
                      width: 44,
                      height: 44,
                      backgroundColor: "rgba(59,130,246,0.14)",
                      color: "#3b82f6",
                    }}
                    aria-hidden="true"
                  >
                    <DivideIcon className="h-5 w-5" />
                  </span>

                  <h1 className="skn-title text-4xl font-bold">Fractions & Ratios</h1>

                  <p className="skn-sub text-lg max-w-2xl mx-auto">
                    Reduce fractions and convert between fraction, decimal and percent — clean UI, fast results.
                  </p>
                </div>
              </div>
            </div>
          }
          showRails
          showTopBanner
          showBottomBanner
        >
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {CARDS.map((c) => (
              <Link key={c.to} to={c.to} className="group">
                <Card className="hover:shadow-soft transition-all duration-300 hover:-translate-y-1 bg-card border-border/50 h-full">
                  <CardHeader className="flex flex-row items-center gap-3">
                    <span
                      className="inline-flex items-center justify-center rounded-xl"
                      style={{ width: 40, height: 40, backgroundColor: c.bg, color: c.fg }}
                      aria-hidden="true"
                    >
                      <DivideIcon className="h-5 w-5" />
                    </span>
                    <CardTitle className="text-lg font-bold" style={{ color: c.fg }}>
                      {c.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 pb-6 px-6">
                    <p className="text-sm text-muted-foreground">{c.caption}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </PageWithRails>
      </main>

      <Footer />
    </div>
  );
}
