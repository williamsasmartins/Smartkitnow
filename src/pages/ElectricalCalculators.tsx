import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Zap, Calculator } from "lucide-react";

const ElectricalCalculators = () => {
  const navigate = useNavigate();

  const electricalCategories = [
    {
      id: "electrical-conversion-calculators",
      title: "Electrical Conversion Calculators",
      description: "Convert between different electrical units",
      calculators: [
        { key: "amps-to-watts", name: "Amps to Watts Calculator" },
        { key: "watts-to-amps", name: "Watts to Amps Calculator" },
        { key: "volts-to-amps", name: "Volts to Amps Calculator" },
        { key: "amps-to-volts", name: "Amps to Volts Calculator" }
      ]
    },
    {
      id: "electrical-calculators",
      title: "Electrical Calculators", 
      description: "Practical electrical calculators",
      calculators: [
        { key: "ohms-law", name: "Ohm's Law Calculator" },
        { key: "wire-size", name: "Wire Size Calculator" },
        { key: "voltage-drop", name: "Voltage Drop Calculator" },
        { key: "power-factor", name: "Power Factor Calculator" }
      ]
    }
  ];

  const handleCalculatorClick = (categoryId: string, calculatorKey: string) => {
    navigate(`/electrical/${categoryId}/${calculatorKey}`);
  };

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/electrical/${categoryId}`);
  };

  const handleBackClick = () => {
    navigate("/");
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-subtle pt-20 pb-8">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={handleBackClick}
            className="mb-6 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>

          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center animate-glow">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Electrical Calculators
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Our electrical calculators convert between different electrical units of power, current, frequency, and more.
            </p>
          </div>

          {/* Categories Grid */}
          <div className="space-y-12">
            {electricalCategories.map((category) => (
              <div key={category.id}>
                <Card className="bg-card/30 border-border/30 mb-6">
                  <CardHeader 
                    className="cursor-pointer group"
                    onClick={() => handleCategoryClick(category.id)}
                  >
                    <CardTitle className="flex items-center gap-3 text-2xl group-hover:text-primary transition-colors">
                      <div className="p-2 rounded-lg bg-gradient-primary/10">
                        <Zap className="h-5 w-5 text-primary" />
                      </div>
                      {category.title}
                      <ArrowLeft className="h-5 w-5 rotate-180 group-hover:translate-x-1 transition-transform" />
                    </CardTitle>
                    <CardDescription className="text-base">
                      {category.description}
                    </CardDescription>
                  </CardHeader>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.calculators.map((calculator) => (
                    <Card 
                      key={calculator.key}
                      className="group cursor-pointer transition-all duration-300 hover:shadow-elegant border-border/60 bg-card/50 backdrop-blur-sm hover:bg-card/80"
                      onClick={() => handleCalculatorClick(category.id, calculator.key)}
                    >
                      <CardHeader className="text-center pb-4">
                        <div className="mx-auto mb-3 p-2 rounded-lg bg-gradient-primary/10 group-hover:bg-gradient-primary/20 transition-colors w-fit">
                          <Calculator className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors leading-tight">
                          {calculator.name}
                        </CardTitle>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ElectricalCalculators;