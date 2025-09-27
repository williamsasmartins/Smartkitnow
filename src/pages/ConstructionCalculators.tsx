import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import {
  listSubcategoriesOfCategory,
  listByCategorySubcategory,
} from "@/data/calculatorRegistry";

export default function ConstructionCalculators() {
  const navigate = useNavigate();

  // Monta os cards de subcategoria dinamicamente a partir do registry
  const subcats = listSubcategoriesOfCategory("construction")
    // remove pseudo categoria interna caso exista
    .filter((s) => s.slug !== "_uncategorized");

  const handleOpenSubcategory = (slug: string) => {
    navigate(`/construction/${slug}`);
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Header />

      <main className="pt-20">
        <section className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={() => navigate("/")}
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
          </div>

          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
              Construction Calculators
            </h1>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Comprehensive construction calculators for building materials, measurements, costs,
              and project planning.
            </p>
          </div>

          {/* Subcategories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subcats.map((sub) => {
              // pega até 3 exemplos de calculadoras dessa subcategoria
              const examples = listByCategorySubcategory("construction", sub.slug).slice(0, 3);
              return (
                <Card
                  key={sub.slug}
                  className="group hover:shadow-soft transition-all duration-300 hover:-translate-y-1 bg-card border-border/50 cursor-pointer"
                  onClick={() => handleOpenSubcategory(sub.slug)}
                >
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {sub.title}{" "}
                      <span className="text-muted-foreground font-normal">({sub.count})</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      {examples.map((c) => (
                        <p key={c.slug} className="text-sm text-muted-foreground">
                          • {c.name}
                        </p>
                      ))}
                      {sub.count > 3 && (
                        <p className="text-sm text-muted-foreground font-medium">
                          + {sub.count - 3} more…
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
