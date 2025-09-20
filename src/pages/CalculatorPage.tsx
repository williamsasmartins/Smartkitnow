import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CalculatorFooter } from "@/components/CalculatorFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calculator } from "lucide-react";

const CalculatorPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const calculator = location.state?.calculator;
  const subCategory = location.state?.subCategory;

  if (!calculator) {
    navigate('/automotive');
    return null;
  }

  const handleGoBack = () => {
    // If we have subCategory data, navigate to the subcategory page
    if (subCategory && typeof subCategory === 'object' && subCategory.title) {
      const subCategorySlug = subCategory.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const category = calculator?.category?.toLowerCase() || 'automotive';
      navigate(`/${category}/${subCategorySlug}`, { 
        state: { 
          subCategory: subCategory
        } 
      });
    } else {
      // Fallback: go back to category main page
      const category = calculator?.category?.toLowerCase() || 'automotive';
      navigate(`/${category}`);
    }
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
              onClick={handleGoBack}
              className="flex items-center space-x-2 mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 rounded-lg bg-primary/10">
                <Calculator className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  {calculator.name}
                </h1>
                <p className="text-muted-foreground mt-2 text-lg">
                  Category: {subCategory?.title || calculator.category}
                </p>
              </div>
            </div>
          </div>
          
          <Card className="bg-card border-border/50">
            <CardContent className="p-8">
              <div className="bg-muted/30 rounded-lg p-8 text-center">
                <Calculator className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Calculator Interface
                </h3>
                <p className="text-muted-foreground">
                  The calculator interface for "{calculator.name}" will be implemented here
                </p>
                <div className="mt-6 p-4 bg-background/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    This is a placeholder for the actual calculator functionality. 
                    Each calculator will have its specific input fields, calculations, and results display.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Calculator Footer */}
          <CalculatorFooter
            calculatorName={calculator.name}
            description={`This calculator uses a proven mathematical formula to determine ${calculator.name.toLowerCase()} values. The calculation takes into account multiple variables and provides accurate results based on industry standards.`}
            formula="Result = (Variable1 × Variable2) / Constant"
            sources={[
              { title: "SAE International Standards", url: "https://www.sae.org" },
              { title: "ASME Engineering Standards", url: "https://www.asme.org" },
              { title: "Automotive Engineering Handbook", url: "https://www.sae.org/publications" },
              { title: "NIST Engineering Standards", url: "https://www.nist.gov" }
            ]}
          />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CalculatorPage;