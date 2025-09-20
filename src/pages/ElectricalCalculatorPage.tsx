import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CalculatorFooter } from "@/components/CalculatorFooter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Zap } from "lucide-react";
import OhmsLawCalculator from "@/components/calculators/OhmsLawCalculator";
import ElectricalConversionCalculator from "@/components/calculators/ElectricalConversionCalculator";
import WireSizeCalculator from "@/components/calculators/WireSizeCalculator";

const ElectricalCalculatorPage = () => {
  const { calculator, subcategory } = useParams();
  const navigate = useNavigate();

  const calculatorComponents = {
    'ohms-law': {
      component: OhmsLawCalculator,
      name: "Ohm's Law Calculator",
      description: 'Calculate voltage, current, resistance, and power using the fundamental electrical relationships defined by Ohms Law.'
    },
    'amps-to-watts': {
      component: ElectricalConversionCalculator,
      name: 'Amps to Watts Conversion Calculator',
      description: 'Convert electrical current (amps) to power (watts) using voltage and power factor calculations.'
    },
    'watts-to-amps': {
      component: ElectricalConversionCalculator,
      name: 'Watts to Amps Conversion Calculator',
      description: 'Convert electrical power (watts) to current (amps) using voltage and power factor calculations.'
    },
    'volts-to-amps': {
      component: ElectricalConversionCalculator,
      name: 'Volts to Amps Conversion Calculator',
      description: 'Convert voltage to current using resistance or power calculations.'
    },
    'amps-to-volts': {
      component: ElectricalConversionCalculator,
      name: 'Amps to Volts Conversion Calculator',
      description: 'Convert current to voltage using resistance or power calculations.'
    },
    'volts-to-watts': {
      component: ElectricalConversionCalculator,
      name: 'Volts to Watts Conversion Calculator',
      description: 'Convert voltage to power using current calculations.'
    },
    'watts-to-volts': {
      component: ElectricalConversionCalculator,
      name: 'Watts to Volts Conversion Calculator',
      description: 'Convert power to voltage using current calculations.'
    },
    'kw-to-kva': {
      component: ElectricalConversionCalculator,
      name: 'Kilowatts (kW) to Kilovolt-Amps (kVA) Conversion Calculator',
      description: 'Convert real power to apparent power using power factor calculations.'
    },
    'kva-to-kw': {
      component: ElectricalConversionCalculator,
      name: 'Kilovolt-Amps (kVA) to Kilowatts (kW) Conversion Calculator',
      description: 'Convert apparent power to real power using power factor calculations.'
    },
    'wire-size': {
      component: WireSizeCalculator,
      name: 'Wire Size Calculator',
      description: 'Determine the proper wire gauge for electrical projects based on current load, length, and voltage drop requirements.'
    },
    'voltage-drop': {
      component: ElectricalConversionCalculator,
      name: 'Voltage Drop Calculator',
      description: 'Calculate voltage drop across electrical circuits and wire runs.'
    },
    'wire-ampacity': {
      component: ElectricalConversionCalculator,
      name: 'Wire Ampacity Calculator',
      description: 'Calculate the current carrying capacity of electrical wire based on gauge and installation conditions.'
    },
    'power-factor': {
      component: ElectricalConversionCalculator,
      name: 'Power Factor Calculator',
      description: 'Calculate electrical power factor and related electrical parameters.'
    },
    'led-resistor': {
      component: ElectricalConversionCalculator,
      name: 'LED Resistor Calculator',
      description: 'Calculate the proper resistor value for LED circuits to prevent damage.'
    },
    'voltage-divider': {
      component: ElectricalConversionCalculator,
      name: 'Voltage Divider Calculator',
      description: 'Calculate resistor values for voltage divider circuits.'
    },
    'parallel-resistor': {
      component: ElectricalConversionCalculator,
      name: 'Parallel Resistor Calculator',
      description: 'Calculate the equivalent resistance of resistors connected in parallel.'
    },
    'series-resistor': {
      component: ElectricalConversionCalculator,
      name: 'Series Resistor Calculator',
      description: 'Calculate the equivalent resistance of resistors connected in series.'
    },
    'electricity-cost': {
      component: ElectricalConversionCalculator,
      name: '2025 Electricity Cost Calculator',
      description: 'Calculate electricity usage costs and estimate monthly electrical bills.'
    },
    'lighting-energy-cost': {
      component: ElectricalConversionCalculator,
      name: '2025 Lighting Energy Cost Calculator',
      description: 'Calculate the energy cost of different lighting options including LED, CFL, and incandescent bulbs.'
    }
  };

  const currentCalculator = calculator ? calculatorComponents[calculator as keyof typeof calculatorComponents] : null;

  const handleGoBack = () => {
    if (subcategory) {
      navigate(`/electrical/${subcategory}`);
    } else {
      navigate('/electrical');
    }
  };

  if (!currentCalculator) {
    return (
      <div className="min-h-screen bg-gradient-soft">
        <Header />
        <main className="pt-20">
          <section className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-foreground mb-4">Calculator Not Found</h1>
              <p className="text-muted-foreground mb-8">The calculator you're looking for doesn't exist.</p>
              <Button onClick={() => navigate("/electrical")}>
                Back to Electrical Calculators
              </Button>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  const CalculatorComponent = currentCalculator.component;

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
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  {currentCalculator.name}
                </h1>
                <p className="text-muted-foreground mt-2 text-lg">
                  Electrical Engineering Tools
                </p>
              </div>
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <CalculatorComponent />
          </div>
          
          {/* Calculator Footer */}
          <CalculatorFooter
            calculatorName={currentCalculator.name}
            description={currentCalculator.description}
            formula="Calculation based on electrical engineering principles"
            sources={[
              { title: "National Electrical Code (NEC)", url: "https://www.nfpa.org/codes-and-standards/all-codes-and-standards/list-of-codes-and-standards/detail?code=70" },
              { title: "IEEE Electrical Standards", url: "https://www.ieee.org/" },
              { title: "Electrical Engineering Portal", url: "https://electrical-engineering-portal.com/" },
              { title: "NIST Electrical Standards", url: "https://www.nist.gov/" }
            ]}
          />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ElectricalCalculatorPage;