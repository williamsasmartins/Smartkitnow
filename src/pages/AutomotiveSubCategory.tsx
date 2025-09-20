import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calculator } from "lucide-react";

const AutomotiveSubCategory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const subCategory = location.state?.subCategory;

  if (!subCategory) {
    navigate('/automotive');
    return null;
  }

  const handleCalculatorClick = (calculator: any) => {
    const slug = calculator.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    navigate(`/automotive/calculator/${slug}`, { 
      state: { 
        calculator, 
        subCategory: subCategory.title 
      } 
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
              onClick={() => navigate('/automotive')}
              className="flex items-center space-x-2 mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 rounded-lg bg-primary/10">
                <i className={`${subCategory.icon} text-primary text-2xl`}></i>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  {subCategory.title}
                </h1>
                <p className="text-muted-foreground mt-2 text-lg">
                  Choose from {subCategory.calculators.length} specialized calculators in this category
                </p>
              </div>
            </div>
          </div>
          
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

export default AutomotiveSubCategory;