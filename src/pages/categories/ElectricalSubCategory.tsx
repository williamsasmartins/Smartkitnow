import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Zap, Calculator } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const ElectricalSubCategory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { subcategory } = useParams<{ subcategory: string }>();

  // Mesmo slugify usado em ElectricalCalculators
  const slugify = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  // Catálogo local para fallback (igual ao de ElectricalCalculators)
  const catalog = [
    {
      title: "Electrical Conversion Calculators",
      description: "Convert between different electrical units",
      calculators: [
        { key: "amps-to-watts", name: "Amps to Watts Calculator" },
        { key: "watts-to-amps", name: "Watts to Amps Calculator" },
        { key: "volts-to-amps", name: "Volts to Amps Calculator" },
        { key: "amps-to-volts", name: "Amps to Volts Calculator" },
      ],
    },
    {
      title: "Electrical Calculators",
      description: "Practical electrical calculators",
      calculators: [
        { key: "ohms-law", name: "Ohm's Law Calculator" },
        { key: "wire-size", name: "Wire Size Calculator" },
        { key: "voltage-drop", name: "Voltage Drop Calculator" },
        { key: "power-factor", name: "Power Factor Calculator" },
      ],
    },
  ];

  // 1) Tenta ler do state (quando veio clicando da lista de categorias)
  const stateSub = location.state?.subCategory as
    | { title: string; calculators: { key: string; name: string }[] }
    | undefined;

  // 2) Se não tiver state, tenta descobrir pelo slug da URL
  let resolved = stateSub;
  if (!resolved && subcategory) {
    resolved = catalog.find((c) => slugify(c.title) === subcategory);
  }

  // 3) Se ainda não achou, volta para /electrical
  if (!resolved) {
    navigate("/electrical");
    return null;
  }

  const handleBackClick = () => navigate("/electrical");

  const handleCalculatorClick = (calc: { key: string; name: string }) => {
    const subSlug = slugify(resolved!.title);
    const calcSlug = slugify(calc.name);
    navigate(`/electrical/${subSlug}/calculator/${calcSlug}`, {
      state: {
        calculator: calc,
        subCategory: resolved!.title,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />

      <main className="pt-20">
        <section className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Back */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackClick}
            className="mb-6 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Electrical
          </Button>

          {/* Título da subcategoria */}
          <div className="flex flex-col items-center text-center space-y-3 mb-8">
            <div className="p-3 rounded-lg bg-primary/10">
              <Zap className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                {resolved.title}
              </h1>
              <p className="text-muted-foreground mt-2 text-lg max-w-2xl">
                Selecione uma calculadora abaixo para continuar.
              </p>
            </div>
            <Badge variant="secondary">{resolved.calculators.length} tools</Badge>
          </div>

          {/* Lista de calculadoras */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resolved.calculators.map((calculator) => (
              <Card
                key={calculator.key}
                className="group hover:shadow-soft transition-all duration-300 hover:-translate-y-1 bg-card border-border/60 cursor-pointer"
                onClick={() => handleCalculatorClick(calculator)}
              >
                <CardHeader className="pb-2">
                  <div className="mx-auto mb-3 p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors w-fit">
                    <Calculator className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg font-semibold text-center group-hover:text-primary transition-colors">
                    {calculator.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground text-center">
                    Specialized calculator for precise calculations
                  </p>
                  <Button variant="outline" className="w-full mt-4">
                    Use Calculator
                  </Button>
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

export default ElectricalSubCategory;
