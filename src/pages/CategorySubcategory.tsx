import { Link, useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import AdRailLayout from "@/components/layouts/AdRailLayout";
import {
  listByCategorySubcategory,
  SUBCATEGORY_TITLES,
} from "@/data/calculatorRegistry";
import { PALETTE } from "@/components/theme/palette";

export default function CategorySubcategory() {
  const navigate = useNavigate();
  const { category = "", subcategory = "" } = useParams<{ category: string; subcategory: string }>();

  const calculators = listByCategorySubcategory(category, subcategory);

  const prettySubcat =
    SUBCATEGORY_TITLES[subcategory] ??
    subcategory.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());

  const subtitle =
    subcategory === "wall-ceiling-calculators"
      ? "Choose a calculator below to get started."
      : "Professional construction calculators for accurate project planning and material estimation.";

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Header />
      <main className="pt-20">
        <AdRailLayout
          titleBlock={
            <div>
              {/* Back to the LEFT (blue) */}
              <button
                onClick={() => navigate(`/${category}`)}
                className="mb-4 inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-white hover:brightness-110 transition-colors"
                style={{ backgroundColor: PALETTE.brand.button }}
                aria-label={`Back to ${category}`}
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>

              {/* Título/Subtítulo CENTRALIZADOS */}
              <div className="text-center">
                <h1 className="text-4xl font-bold mb-3" style={{ color: PALETTE.brand.title }}>
                  {prettySubcat}
                </h1>
                <p className="text-lg max-w-3xl mx-auto" style={{ color: PALETTE.brand.text }}>
                  {subtitle}
                </p>
              </div>
            </div>
          }
        >
          {calculators.length === 0 ? (
            <p className="text-center" style={{ color: PALETTE.brand.text }}>
              No calculators found.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {calculators.map((calc) => {
                const url = `/${category}/${calc.subcategory}/${calc.slug}`;
                return (
                  <Card
                    key={calc.slug}
                    className="bg-card border-border/50 hover:shadow-soft transition-all"
                  >
                    <CardHeader>
                      <CardTitle
                        className="text-lg font-semibold text-center"
                        style={{ color: PALETTE.brand.title }}
                      >
                        <Link to={url} className="hover:underline">
                          {calc.title}
                        </Link>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-center" style={{ color: PALETTE.brand.text }}>
                        {calc.description || "Open the calculator"}
                      </p>
                      <div className="mt-4 flex justify-center">
                        <Link to={url}>
                          <Button
                            className="text-white"
                            style={{ backgroundColor: PALETTE.brand.button }}
                          >
                            Use Calculator
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
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
