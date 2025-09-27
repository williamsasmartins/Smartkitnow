import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calculator } from "lucide-react";

const FinancialSubCategory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const subCategory = location.state?.subCategory as
    | { title: string; icon?: string; calculators: any[] }
    | undefined;

  // Se ninguém passou a subcategoria via state, voltamos para a lista de Financial.
  if (!subCategory) {
    navigate("/financial");
    return null;
  }

  // Utilitário para gerar slug (igual ao que você já usa em outras páginas)
  const slugify = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleCalculatorClick = (calculator: any) => {
    const calculatorSlug = slugify(calculator.name);
    const subcategorySlug = slugify(subCategory.title);

    // >>> HIERARQUIA AJUSTADA <<<
    // /financial/:subcategory/calculator/:calculator
    navigate(`/financial/${subcategorySlug}/calculator/${calculatorSlug}`, {
      state: {
        calculator,
        subCategory: subCategory.title,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Header />

      <main className="pt-20">
        <section className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/financial")}
              className="flex items-center space-x-2 mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>

            <div className="flex flex-col items-center text-center space-y-3 mb-6">
              <div className="p-3 rounded-lg bg-primary/10">
                {subCategory.icon ? (
                  <i className={`${subCategory.icon} text-primary text-2xl`} />
                ) : (
                  <Calculator className="h-8 w-8 text-primary" />
                )}
              </div>
              <div>
                {/* Título dinâmico com o nome da subcategoria */}
                <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  {subCategory.title}
                </h1>
                <p className="text-muted-foreground mt-2 text-lg">
                  Explore calculadoras desta subcategoria para obter resultados
                  precisos e rápidos.
                </p>
              </div>
            </div>
          </div>

          {/* Lista de calculadoras */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subCategory.calculators.map((calculator: any, index: number) => (
              <Card
                key={index}
                className="group hover:shadow-soft transition-all duration-300 hover:-translate-y-1 bg-card border-border/50 cursor-pointer"
                onClick={() => handleCalculatorClick(calculator)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Calculator className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                        {calculator.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Specialized calculator for precise calculations
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3 w-full"
                        onClick={(e) => {
                          e.stopPropagation(); // evita disparar o onClick do Card
                          handleCalculatorClick(calculator);
                        }}
                      >
                        Use Calculator
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default FinancialSubCategory;
