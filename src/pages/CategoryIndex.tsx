import { Link, useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import AdRailLayout from "@/components/layouts/AdRailLayout";
import {
  FRIENDLY_TITLES,
  listSubcategoriesOfCategory,
  listByCategorySubcategory,
} from "@/data/calculatorRegistry";
import { PALETTE } from "@/components/theme/palette";

export default function CategoryIndex() {
  const navigate = useNavigate();
  const { category = "" } = useParams<{ category: string }>();

  const title =
    FRIENDLY_TITLES[category] ??
    category.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
  const subcats = listSubcategoriesOfCategory(category);

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Header />
      <main className="pt-20">
        <AdRailLayout
          titleBlock={
  <div>
    {/* Back à ESQUERDA (azul) */}
    <button
      onClick={() => navigate("/")}
      className="mb-4 inline-flex items-center gap-2 rounded-md px-3 py-1.5 transition-colors skn-back"
      aria-label="Back to Home"
    >
      <ArrowLeft className="h-4 w-4" />
      <span>Back</span>
    </button>

    {/* Título/Subtítulo CENTRALIZADOS */}
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-3 skn-title">
        {title}
      </h1>
      <p className="text-lg max-w-4xl mx-auto skn-sub">
        Comprehensive {title.toLowerCase()} for materials, measurements, costs, and planning.
      </p>
    </div>
  </div>
}

        >
          {subcats.length === 0 ? (
            <p className="text-center" style={{ color: PALETTE.brand.text }}>
              No subcategories found.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subcats.map((sc) => {
                const calculators = listByCategorySubcategory(category, sc.slug);
                const preview = calculators.slice(0, 3);

                return (
                  <Link key={sc.slug} to={`/${category}/${sc.slug}`}>
                    <Card className="group hover:shadow-soft transition-all duration-300 hover:-translate-y-1 bg-card border-border/50 cursor-pointer">
                      <CardHeader>
                        <CardTitle
                          className="text-xl font-bold text-center group-hover:opacity-90"
                          style={{ color: PALETTE.brand.title }}
                        >
                          {sc.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-center mb-3" style={{ color: PALETTE.brand.text }}>
                          {sc.count} calculators available
                        </p>
                        <div className="space-y-1 text-center">
                          {preview.map((calc) => (
                            <p key={calc.slug} className="text-sm" style={{ color: PALETTE.brand.text }}>
                              • {calc.name}
                            </p>
                          ))}
                          {sc.count > 3 && (
                            <p className="text-sm font-medium" style={{ color: PALETTE.brand.text }}>
                              + {sc.count - 3} more…
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </AdRailLayout>
      </main>
      <Footer />
    </div>
  );
}
