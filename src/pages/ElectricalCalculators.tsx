import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Zap, Calculator, Lightbulb } from "lucide-react";
import { useState } from "react";

const ElectricalCalculators = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const electricalCategories = [
    {
      id: "electrical-conversion-calculators",
      title: "Electrical Conversion Calculators",
      icon: "fa-solid fa-bolt",
      description: "Convert between different electrical units of power, current, voltage, and more",
      calculators: [
        { key: "ah-to-kwh", name: "Amp-Hours (Ah) to Kilowatt-Hours (kWh) Conversion Calculator", description: "Convert amp-hours to kilowatt-hours" },
        { key: "ah-to-wh", name: "Amp-Hours (Ah) to Watt-Hours (Wh) Conversion Calculator", description: "Convert amp-hours to watt-hours" },
        { key: "amps-to-hp", name: "Amps to Horsepower Calculator", description: "Convert electric current to horsepower" },
        { key: "amps-to-kva", name: "Amps to Kilovolt-Amps (kVA) Conversion Calculator", description: "Convert amps to kilovolt-amps" },
        { key: "amps-to-kw", name: "Amps to Kilowatts (kW) Conversion Calculator", description: "Convert amps to kilowatts" },
        { key: "amps-to-va", name: "Amps to Volt-Amps (VA) Conversion Calculator", description: "Convert amps to volt-amps" },
        { key: "amps-to-volts", name: "Amps to Volts Conversion Calculator", description: "Convert current to voltage" },
        { key: "amps-to-watts", name: "Amps to Watts Conversion Calculator", description: "Convert amps to watts" },
        { key: "volts-to-amps", name: "Volts to Amps Conversion Calculator", description: "Convert voltage to current" },
        { key: "volts-to-watts", name: "Volts to Watts Conversion Calculator", description: "Convert voltage to power" },
        { key: "watts-to-amps", name: "Watts to Amps Conversion Calculator", description: "Convert power to current" },
        { key: "watts-to-volts", name: "Watts to Volts Conversion Calculator", description: "Convert power to voltage" },
        { key: "kw-to-kva", name: "Kilowatts (kW) to Kilovolt-Amps (kVA) Conversion Calculator", description: "Convert kilowatts to kilovolt-amps" },
        { key: "kva-to-kw", name: "Kilovolt-Amps (kVA) to Kilowatts (kW) Conversion Calculator", description: "Convert kilovolt-amps to kilowatts" }
      ]
    },
    {
      id: "electrical-calculators",
      title: "Electrical Calculators",
      icon: "fa-solid fa-calculator",
      description: "Practical electrical calculators for projects, installations, and calculations",
      calculators: [
        { key: "electricity-cost", name: "2025 Electricity Cost Calculator", description: "Calculate electricity costs and usage" },
        { key: "lighting-energy-cost", name: "2025 Lighting Energy Cost Calculator", description: "Calculate lighting energy costs" },
        { key: "ohms-law", name: "Ohm's Law Calculator", description: "Calculate voltage, current, resistance, and power" },
        { key: "voltage-drop", name: "Voltage Drop Calculator", description: "Calculate voltage drop across circuits" },
        { key: "wire-size", name: "Wire Size Calculator", description: "Determine proper wire gauge for electrical projects" },
        { key: "wire-ampacity", name: "Wire Ampacity Calculator", description: "Calculate wire current carrying capacity" },
        { key: "power-factor", name: "Power Factor Calculator", description: "Calculate electrical power factor" },
        { key: "led-resistor", name: "LED Resistor Calculator", description: "Calculate resistor values for LED circuits" },
        { key: "voltage-divider", name: "Voltage Divider Calculator", description: "Calculate voltage divider circuit values" },
        { key: "parallel-resistor", name: "Parallel Resistor Calculator", description: "Calculate parallel resistance values" },
        { key: "series-resistor", name: "Series Resistor Calculator", description: "Calculate series resistance values" },
        { key: "capacitance", name: "Capacitance Calculator", description: "Calculate capacitance values" },
        { key: "rlc-impedance", name: "RLC Impedance Calculator", description: "Calculate impedance of RLC circuits" }
      ]
    },
    {
      id: "additional-resources",
      title: "Additional Resources",
      icon: "fa-solid fa-tools",
      description: "More specialized electrical conversion calculators organized by type",
      calculators: [
        { key: "capacitance-conversion", name: "Capacitance Conversion Calculators", description: "Convert capacitance units" },
        { key: "charge-conversion", name: "Charge Conversion Calculators", description: "Convert electrical charge units" },
        { key: "conductance-conversion", name: "Conductance Conversion Calculators", description: "Convert conductance units" },
        { key: "current-conversion", name: "Current Conversion Calculators", description: "Convert electrical current units" },
        { key: "energy-conversion", name: "Energy Conversion Calculators", description: "Convert energy units" },
        { key: "frequency-conversion", name: "Frequency Conversion Calculators", description: "Convert frequency units" },
        { key: "inductance-conversion", name: "Inductance Conversion Calculators", description: "Convert inductance units" },
        { key: "power-conversion", name: "Power Conversion Calculators", description: "Convert power units" },
        { key: "resistance-conversion", name: "Resistance Conversion Calculators", description: "Convert resistance units" },
        { key: "voltage-conversion", name: "Voltage Conversion Calculators", description: "Convert voltage units" }
      ]
    }
  ];

  const allCalculators = electricalCategories.flatMap(category => 
    category.calculators.map(calc => ({ ...calc, category: category.id, categoryTitle: category.title }))
  );

  const filteredCalculators = allCalculators.filter(calculator =>
    calculator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    calculator.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              Our electrical calculators convert between different electrical units of power, current, frequency, and more, 
              help estimate the electrical usage and cost of lighting and household appliances, estimate wire sizes for electrical 
              project work, estimate circuit components, and perform physics calculations.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-12">
            <div className="relative max-w-md mx-auto">
              <Input
                type="text"
                placeholder="Search for a calculator"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 w-full rounded-lg border-border/50 bg-card/50 backdrop-blur-sm"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <svg className="h-5 w-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Search Results */}
          {searchTerm && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Search Results ({filteredCalculators.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCalculators.map((calculator) => (
                  <Card 
                    key={calculator.key}
                    className="group cursor-pointer transition-all duration-300 hover:shadow-elegant border-border/60 bg-card/50 backdrop-blur-sm hover:bg-card/80"
                    onClick={() => handleCalculatorClick(calculator.category, calculator.key)}
                  >
                    <CardHeader className="text-center pb-3">
                      <div className="mx-auto mb-2 p-2 rounded-lg bg-gradient-primary/10 group-hover:bg-gradient-primary/20 transition-colors w-fit">
                        <Calculator className="h-4 w-4 text-primary" />
                      </div>
                      <CardTitle className="text-sm font-semibold group-hover:text-primary transition-colors leading-tight">
                        {calculator.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <CardDescription className="text-center text-xs text-muted-foreground">
                        {calculator.description}
                      </CardDescription>
                      <div className="mt-2 text-center">
                        <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                          {calculator.categoryTitle}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

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
                        <i className={`${category.icon} text-lg text-primary`}></i>
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
                  {category.calculators.slice(0, 6).map((calculator) => (
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
                      <CardContent className="pt-0">
                        <CardDescription className="text-center text-muted-foreground">
                          {calculator.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {category.calculators.length > 6 && (
                  <div className="text-center mt-6">
                    <Button 
                      variant="outline" 
                      onClick={() => handleCategoryClick(category.id)}
                      className="bg-card/50 hover:bg-card border-border/50"
                    >
                      View All {category.calculators.length} {category.title}
                      <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                    </Button>
                  </div>
                )}
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