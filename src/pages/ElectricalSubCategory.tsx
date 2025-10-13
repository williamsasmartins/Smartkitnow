import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Zap, Calculator } from "lucide-react";

const ElectricalSubCategory = () => {
  const { subcategory } = useParams();
  const navigate = useNavigate();

  const electricalCategories = {
    "electrical-conversion-calculators": {
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
        { key: "capacitance-to-charge", name: "Capacitance to Charge Conversion Calculator", description: "Convert capacitance to electrical charge" },
        { key: "hp-to-amps", name: "Horsepower to Amps Calculator", description: "Convert horsepower to electric current" },
        { key: "hp-to-kva", name: "Horsepower to Kilovolt-Amps (kVA) Conversion Calculator", description: "Convert horsepower to kilovolt-amps" },
        { key: "joules-to-volts", name: "Joules to Volts Conversion Calculator", description: "Convert energy to voltage" },
        { key: "joules-to-watts", name: "Joules to Watts Conversion Calculator", description: "Convert energy to power" },
        { key: "kva-to-amps", name: "Kilovolt-Amps (kVA) to Amps Conversion Calculator", description: "Convert kilovolt-amps to amps" },
        { key: "kva-to-hp", name: "Kilovolt-Amps (kVA) to Horsepower Conversion Calculator", description: "Convert kilovolt-amps to horsepower" },
        { key: "kva-to-kw", name: "Kilovolt-Amps (kVA) to Kilowatts (kW) Conversion Calculator", description: "Convert kilovolt-amps to kilowatts" },
        { key: "kva-to-va", name: "Kilovolt-Amps (kVA) to Volt-Amps (VA) Conversion Calculator", description: "Convert kilovolt-amps to volt-amps" },
        { key: "kva-to-watts", name: "Kilovolt-Amps (kVA) to Watts Conversion Calculator", description: "Convert kilovolt-amps to watts" },
        { key: "kwh-to-ah", name: "Kilowatt-Hours (kWh) to Amp-Hours (Ah) Conversion Calculator", description: "Convert kilowatt-hours to amp-hours" },
        { key: "kwh-to-kw", name: "Kilowatt-Hours (kWh) to Kilowatts (kW) Conversion Calculator", description: "Convert kilowatt-hours to kilowatts" },
        { key: "kwh-to-watts", name: "Kilowatt-Hours (kWh) to Watts Conversion Calculator", description: "Convert kilowatt-hours to watts" },
        { key: "kw-to-amps", name: "Kilowatts (kW) to Amps Conversion Calculator", description: "Convert kilowatts to amps" },
        { key: "kw-to-kva", name: "Kilowatts (kW) to Kilovolt-Amps (kVA) Conversion Calculator", description: "Convert kilowatts to kilovolt-amps" },
        { key: "kw-to-kwh", name: "Kilowatts (kW) to Kilowatt-Hours (kWh) Conversion Calculator", description: "Convert kilowatts to kilowatt-hours" },
        { key: "kw-to-va", name: "Kilowatts (kW) to Volt-Amps (VA) Conversion Calculator", description: "Convert kilowatts to volt-amps" },
        { key: "mah-to-wh", name: "Milliamp-Hours (mAh) to Watt-Hours (Wh) Conversion Calculator", description: "Convert milliamp-hours to watt-hours" },
        { key: "va-to-amps", name: "Volt-amps (VA) to Amps Conversion Calculator", description: "Convert volt-amps to amps" },
        { key: "va-to-kva", name: "Volt-Amps (VA) to Kilovolt-Amps (kVA) Conversion Calculator", description: "Convert volt-amps to kilovolt-amps" },
        { key: "va-to-kw", name: "Volt-amps (VA) to Kilowatts (kW) Conversion Calculator", description: "Convert volt-amps to kilowatts" },
        { key: "volts-to-amps", name: "Volts to Amps Conversion Calculator", description: "Convert voltage to current" },
        { key: "volts-to-joules", name: "Volts to Joules Conversion Calculator", description: "Convert voltage to energy" },
        { key: "volts-to-watts", name: "Volts to Watts Conversion Calculator", description: "Convert voltage to power" },
        { key: "wh-to-ah", name: "Watt-Hours (Wh) to Amp-Hours (Ah) Conversion Calculator", description: "Convert watt-hours to amp-hours" },
        { key: "wh-to-mah", name: "Watt-Hours (Wh) to Milliamp-Hours (mAh) Conversion Calculator", description: "Convert watt-hours to milliamp-hours" },
        { key: "watts-to-amps", name: "Watts to Amps Conversion Calculator", description: "Convert power to current" },
        { key: "watts-to-joules", name: "Watts to Joules Conversion Calculator", description: "Convert power to energy" },
        { key: "watts-to-kva", name: "Watts to Kilovolt-Amps (kVA) Conversion Calculator", description: "Convert watts to kilovolt-amps" },
        { key: "watts-to-kwh", name: "Watts to Kilowatt-Hours (kWh) Conversion Calculator", description: "Convert watts to kilowatt-hours" },
        { key: "watts-to-volts", name: "Watts to Volts Conversion Calculator", description: "Convert power to voltage" }
      ]
    },
    "electrical-calculators": {
      title: "Electrical Calculators",
      icon: "fa-solid fa-calculator",
      description: "Practical electrical calculators for projects, installations, and calculations",
      calculators: [
        { key: "electricity-cost", name: "2025 Electricity Cost Calculator", description: "Calculate electricity costs and usage" },
        { key: "lighting-energy-cost", name: "2025 Lighting Energy Cost Calculator", description: "Calculate lighting energy costs" },
        { key: "capacitance", name: "Capacitance Calculator", description: "Calculate capacitance values" },
        { key: "coulombs-law", name: "Coulomb's Law Charge Calculator", description: "Calculate electrostatic force and charge" },
        { key: "current-calculator", name: "Current Calculator", description: "Calculate electrical current" },
        { key: "led-resistor", name: "LED Resistor Calculator", description: "Calculate resistor values for LED circuits" },
        { key: "ohms-law", name: "Ohm's Law Calculator", description: "Calculate voltage, current, resistance, and power" },
        { key: "parallel-plate-capacitance", name: "Parallel Plate Capacitance Calculator", description: "Calculate parallel plate capacitor values" },
        { key: "parallel-resistor", name: "Parallel Resistor Calculator", description: "Calculate parallel resistance values" },
        { key: "peak-voltage", name: "Peak Voltage Calculator", description: "Calculate peak voltage values" },
        { key: "peak-to-peak-voltage", name: "Peak-to-Peak Voltage Calculator", description: "Calculate peak-to-peak voltage" },
        { key: "power-factor", name: "Power Factor Calculator", description: "Calculate electrical power factor" },
        { key: "resistance", name: "Resistance Calculator", description: "Calculate electrical resistance" },
        { key: "resistor-capacitor", name: "Resistor Capacitor Circuit Calculator", description: "Calculate RC circuit values" },
        { key: "rlc-impedance", name: "RLC Impedance Calculator", description: "Calculate impedance of RLC circuits" },
        { key: "rms-voltage", name: "RMS Voltage Calculator", description: "Calculate RMS voltage values" },
        { key: "series-parallel-capacitor", name: "Series and Parallel Capacitor Calculator", description: "Calculate series and parallel capacitor values" },
        { key: "series-resistor", name: "Series Resistor Calculator", description: "Calculate series resistance values" },
        { key: "voltage-calculator", name: "Voltage Calculator", description: "Calculate electrical voltage" },
        { key: "voltage-divider", name: "Voltage Divider Calculator", description: "Calculate voltage divider circuit values" },
        { key: "voltage-drop", name: "Voltage Drop Calculator", description: "Calculate voltage drop across circuits" },
        { key: "wattage", name: "Wattage Calculator", description: "Calculate electrical power consumption" },
        { key: "wire-ampacity", name: "Wire Ampacity Calculator", description: "Calculate wire current carrying capacity" },
        { key: "wire-size", name: "Wire Size Calculator", description: "Determine proper wire gauge for electrical projects" }
      ]
    },
    "additional-resources": {
      title: "Additional Resources",
      icon: "fa-solid fa-tools",
      description: "More specialized electrical conversion calculators organized by type",
      calculators: [
        { key: "capacitance-conversion", name: "Capacitance Conversion Calculators", description: "Convert capacitance units" },
        { key: "charge-conversion", name: "Charge Conversion Calculators", description: "Convert electrical charge units" },
        { key: "conductance-conversion", name: "Conductance Conversion Calculators", description: "Convert conductance units" },
        { key: "current-conversion", name: "Current Conversion Calculators", description: "Convert electrical current units" },
        { key: "energy-conversion", name: "Energy Conversion Calculators", description: "Convert energy units" },
        { key: "force-conversion", name: "Force Conversion Calculators", description: "Convert force units" },
        { key: "frequency-conversion", name: "Frequency Conversion Calculators", description: "Convert frequency units" },
        { key: "inductance-conversion", name: "Inductance Conversion Calculators", description: "Convert inductance units" },
        { key: "power-conversion", name: "Power Conversion Calculators", description: "Convert power units" },
        { key: "resistance-conversion", name: "Resistance Conversion Calculators", description: "Convert resistance units" },
        { key: "voltage-conversion", name: "Voltage Conversion Calculators", description: "Convert voltage units" }
      ]
    }
  };

  const category = subcategory ? electricalCategories[subcategory as keyof typeof electricalCategories] : null;

  const handleCalculatorClick = (calculatorKey: string) => {
    navigate(`/electrical/${subcategory}/${calculatorKey}`);
  };

  const handleBackClick = () => {
    navigate("/electrical");
  };

  if (!category) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-subtle pt-20 pb-8">
          <div className="container mx-auto px-4 py-8 max-w-4xl text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">Category Not Found</h1>
            <p className="text-muted-foreground mb-8">The electrical category you're looking for doesn't exist.</p>
            <Button onClick={() => navigate("/electrical")}>
              Back to Electrical Calculators
            </Button>
          </div>
        </main>
        
      </>
    );
  }

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
            Back to Electrical Calculators
          </Button>

          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center animate-glow">
                <i className={`${category.icon} text-xl text-white`}></i>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                {category.title}
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {category.description}
            </p>
          </div>

          {/* Calculators Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {category.calculators.map((calculator) => (
              <Card 
                key={calculator.key}
                className="group/card cursor-pointer transition-all duration-300 hover:shadow-elegant border-border/60 bg-card/50 backdrop-blur-sm hover:bg-card/80"
                onClick={() => handleCalculatorClick(calculator.key)}
              >
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-3 p-2 rounded-lg bg-gradient-primary/10 group-hover/card:bg-gradient-primary/20 transition-colors w-fit">
                    <Calculator className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg font-bold group-hover/card:text-primary transition-colors">
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
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ElectricalSubCategory;