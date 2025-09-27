import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car, ArrowLeft } from "lucide-react";

const AutomotiveCalculators = () => {
  const navigate = useNavigate();

  const subCategories = [
    {
      title: "Engine & Horsepower Calculators",
      icon: "fa-solid fa-car-battery",
      calculators: [
        { key: "carburetor-cfm", name: "Carburetor CFM Calculator" },
        { key: "lb-cc-converter", name: "Convert lb/hr to cc/min & cc/min to lb/hr" },
        { key: "engine-compression", name: "Engine Compression Ratio Calculator" },
        { key: "engine-displacement", name: "Engine Displacement Calculator" },
        { key: "horsepower", name: "Engine Horsepower Calculator" },
        { key: "engine-torque", name: "Engine Torque Calculator" }
      ]
    },
    {
      title: "Fuel & Fuel Economy Calculators",
      icon: "fa-solid fa-gas-pump",
      calculators: [
        { key: "ev-charging-cost", name: "Electric Vehicle Charging Cost Calculator" },
        { key: "ev-charging-time", name: "Electric Vehicle Charging Time Calculator" },
        { key: "ev-fuel-savings", name: "Electric Vehicle Fuel Savings Calculator" },
        { key: "fuel-cost", name: "Fuel Cost Calculator" },
        { key: "fuel-injector-flow", name: "Fuel Injector Flow Rate Calculator" },
        { key: "fuel-savings", name: "Fuel Savings Calculator" },
        { key: "gas-mileage", name: "Gas Mileage Calculator" },
        { key: "km-per-liter", name: "Kilometers Per Liter Fuel Economy Calculator" },
        { key: "liters-per-100km", name: "Liters Per 100 Kilometers Fuel Consumption Calculator" }
      ]
    },
    {
      title: "Unit Conversion Calculators",
      icon: "fa-solid fa-arrows-left-right-to-line",
      calculators: [
        { key: "ev-efficiency", name: "Electric Car Efficiency Unit Conversions" },
        { key: "fuel-economy-unit", name: "Fuel Economy Unit Conversions" },
        { key: "sae-metric", name: "SAE to Metric Calculator & Metric to Standard" },
        { key: "speed-unit", name: "Speed Unit Conversions" },
        { key: "torque-unit", name: "Torque Unit Conversions" }
      ]
    },
    {
      title: "Vehicle Loan Calculators",
      icon: "fa-solid fa-sack-dollar",
      calculators: [
        { key: "atv-loan", name: "ATV Loan Calculator" },
        { key: "auto-loan", name: "Auto Loan Calculator" },
        { key: "boat-loan", name: "Boat Loan Calculator" },
        { key: "car-lease", name: "Car Lease Calculator" },
        { key: "lease-vs-buy", name: "Lease vs. Buy Car Calculator" },
        { key: "motorcycle-loan", name: "Motorcycle Loan Calculator" },
        { key: "rv-loan", name: "RV Loan Calculator" }
      ]
    },
    {
      title: "Wheels & Tires Calculators",
      icon: "fa-solid fa-fan",
      calculators: [
        { key: "speedometer-error", name: "Speedometer Error Calculator" },
        { key: "speedometer-gear", name: "Speedometer Gear Calculator" },
        { key: "tire-size", name: "Tire Size Calculator" },
        { key: "tire-size-comparison", name: "Tire Size Comparison Calculator" },
        { key: "tire-size-conversion", name: "Tire Size Conversion Calculator" },
        { key: "wheel-offset", name: "Wheel Offset Calculator" }
      ]
    }
  ];

  const handleSubCategoryClick = (subCategory: any) => {
    const slug = subCategory.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    navigate(`/automotive/${slug}`, { state: { subCategory } });
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
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            
            <div className="flex flex-col items-center text-center space-y-3 mb-6">
              <div className="p-3 rounded-lg bg-primary/10">
                <Car className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Automotive Calculators
                </h1>
                <p className="text-muted-foreground mt-2 text-lg">
                  We have automotive calculators and resources for engine performance tuning, day to day mechanics, and other vehicle applications. From estimating horsepower to estimating your monthly payment, we have the resources for you.
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subCategories.map((subCategory, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-soft transition-all duration-300 hover:-translate-y-1 bg-card border-border/50 cursor-pointer"
                onClick={() => handleSubCategoryClick(subCategory)}
              >
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <i className={`${subCategory.icon} text-primary text-lg`}></i>
                    </div>
                    <div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {subCategory.title}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {subCategory.calculators.length} calculators available
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {subCategory.calculators.slice(0, 3).map((calc, calcIndex) => (
                      <p key={calcIndex} className="text-xs text-muted-foreground">
                        • {calc.name}
                      </p>
                    ))}
                    {subCategory.calculators.length > 3 && (
                      <p className="text-xs text-muted-foreground font-medium">
                        + {subCategory.calculators.length - 3} more calculators
                      </p>
                    )}
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

export default AutomotiveCalculators;
