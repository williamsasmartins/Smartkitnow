import { useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import {
  FRIENDLY_TITLES,
  SUBCATEGORY_TITLES,
  listByCategorySubcategory,
} from "@/data/calculatorRegistry";

export default function ConstructionSubCategory() {
  const navigate = useNavigate();
  const { subcategory = "" } = useParams<{ subcategory: string }>();

  // Busca todas as calculadoras dessa subcategoria a partir do registry
  const calculators = listByCategorySubcategory("construction", subcategory);

  // Título bonito a partir do slug
  const title =
    SUBCATEGORY_TITLES[subcategory] ||
    subcategory.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());

  const handleUseCalc = (cat: string, sub: string, slug: string) => {
    navigate(`/${cat}/${sub}/${slug}`);
  };

  const handleBack = () => {
    navigate("/construction");
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Header />

      <main className="pt-20">
        <section className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
          </div>

          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
              {title}
            </h1>
            <p className="text-muted-foreground text-base">
              Category: {FRIENDLY_TITLES["construction"] || "Construction Calculators"}
            </p>
          </div>

          {/* Se não houver nada no registry, mostra aviso amigável */}
          {calculators.length === 0 ? (
            <div className="text-center text-muted-foreground">
              <p>No calculators found for this subcategory.</p>
              <div className="mt-6">
                <Button onClick={handleBack}>Back to Construction</Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {calculators.map((calc) => (
                <Card
                  key={calc.slug}
                  className="group hover:shadow-soft transition-all duration-300 hover:-translate-y-1 bg-card border-border/50"
                >
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                      {calc.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      {calc.description || "Open calculator"}
                    </p>
                    <Button
                      onClick={() =>
                        handleUseCalc(calc.category, calc.subcategory || subcategory, calc.slug)
                      }
                      className="w-full bg-primary hover:bg-primary-glow text-primary-foreground"
                    >
                      Use Calculator
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
