import { useNavigate, useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const ConversionSubCategory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { subCategory } = location.state || {};

  if (!subCategory) {
    navigate('/conversion');
    return null;
  }

  const handleCalculatorClick = (calculator: any) => {
    navigate(`/conversion/${subCategory.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}/${calculator.key}`, {
      state: { 
        calculator: {
          ...calculator,
          category: "Conversion",
          description: `Convert ${calculator.name.toLowerCase().replace(' conversion', '')} units quickly and accurately.`,
          formula: "Converted Value = Input Value × Conversion Factor",
          sources: [
            { title: "International System of Units (SI)", url: "https://example.com" },
            { title: "NIST Reference Standards", url: "https://example.com" },
            { title: "Measurement Standards", url: "https://example.com" }
          ]
        },
        subCategory 
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Header />
      
      <main className="pt-20">
        <section className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <div className="mb-6">
            <button 
              onClick={() => navigate('/conversion')} 
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
          </div>

          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
              {subCategory.title}
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Accurate unit conversion tools for precise measurements and calculations.
            </p>
          </div>

          {/* Calculators Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subCategory.calculators.map((calculator: any, index: number) => (
              <Card 
                key={index} 
                className="group hover:shadow-soft transition-all duration-300 hover:-translate-y-1 bg-card border-border/50"
              >
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {calculator.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => handleCalculatorClick(calculator)}
                    className="w-full bg-primary hover:bg-primary-glow text-primary-foreground"
                  >
                    Use Converter
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

export default ConversionSubCategory;
