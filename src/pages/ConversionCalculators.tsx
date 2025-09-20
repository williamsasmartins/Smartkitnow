import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

const ConversionCalculators = () => {
  const navigate = useNavigate();

  const subCategories = [
    {
      title: "Popular Converters",
      icon: "fa-solid fa-star",
      calculators: [
        // Angle
        { key: "deg-to-rad", name: "deg to rad" },
        { key: "rad-to-deg", name: "rad to deg" },
        { key: "deg-to-mrad", name: "deg to mrad" },
        { key: "mrad-to-deg", name: "mrad to deg" },
        // Area
        { key: "sq-ft-to-sq-m", name: "sq ft to sq m" },
        { key: "sq-m-to-sq-ft", name: "sq m to sq ft" },
        { key: "sq-mi-to-sq-km", name: "sq mi to sq km" },
        { key: "sq-km-to-sq-mi", name: "sq km to sq mi" },
        // Cooking
        { key: "g-to-ml", name: "g to mL" },
        { key: "ml-to-g", name: "mL to g" },
        { key: "mg-to-ml", name: "mg to mL" },
        { key: "ml-to-mg", name: "mL to mg" },
        // Electrical
        { key: "kohm-to-ohm", name: "kΩ to Ω" },
        { key: "mohm-to-ohm", name: "MΩ to Ω" },
        { key: "ohm-to-kohm", name: "Ω to kΩ" },
        { key: "mohm-to-ohm-small", name: "mΩ to Ω" },
        // Energy
        { key: "kcal-to-cal", name: "kcal to cal" },
        { key: "mj-to-kwh", name: "MJ to kWh" },
        { key: "mwh-to-kwh", name: "MWh to kWh" },
        { key: "mmbtu-to-mwh", name: "MMBTU to MWh" },
        // Fuel Economy
        { key: "mpg-to-km-l", name: "mpg to km/L" },
        { key: "km-l-to-mpg", name: "km/L to mpg" },
        { key: "mpg-to-l-100km", name: "mpg to L/100km" },
        { key: "l-100km-to-mpg", name: "L/100km to mpg" },
        // Length
        { key: "in-to-cm", name: "in to cm" },
        { key: "cm-to-in", name: "cm to in" },
        { key: "ft-to-m", name: "ft to m" },
        { key: "m-to-ft", name: "m to ft" },
        // Speed
        { key: "mph-to-km-h", name: "mph to km/h" },
        { key: "km-h-to-mph", name: "km/h to mph" },
        { key: "ft-s-to-mph", name: "ft/s to mph" },
        { key: "mph-to-m-s", name: "mph to m/s" },
        // Temperature
        { key: "f-to-c", name: "°F to °C" },
        { key: "c-to-f", name: "°C to °F" },
        { key: "f-to-k", name: "°F to K" },
        { key: "c-to-k", name: "°C to K" },
        // Time
        { key: "sec-to-min", name: "sec to min" },
        { key: "min-to-sec", name: "min to sec" },
        { key: "sec-to-hr", name: "sec to hr" },
        { key: "hr-to-sec", name: "hr to sec" },
        // Volume
        { key: "tbsp-to-cups", name: "tbsp to cups" },
        { key: "cm3-to-m3", name: "cm³ to m³" },
        { key: "gal-to-l", name: "gal to L" },
        { key: "tsp-to-ml", name: "tsp to mL" },
        // Weight
        { key: "lbs-to-kg", name: "lbs to kg" },
        { key: "kg-to-lbs", name: "kg to lbs" },
        { key: "oz-to-g", name: "oz to g" },
        { key: "g-to-oz", name: "g to oz" }
      ]
    },
    {
      title: "Commonly Used Converters",
      icon: "fa-solid fa-arrows-rotate",
      calculators: [
        { key: "conversion-calculator", name: "Conversion Calculator" },
        { key: "angle-conversion", name: "Angle Conversion" },
        { key: "area-conversion", name: "Area Conversion" },
        { key: "length-conversion", name: "Length Conversion" },
        { key: "pressure-conversion", name: "Pressure Conversion" },
        { key: "speed-conversion", name: "Speed Conversion" },
        { key: "temperature-conversion", name: "Temperature Conversion" },
        { key: "time-conversion", name: "Time Conversion" },
        { key: "volume-conversion", name: "Volume Conversion" },
        { key: "weight-conversion", name: "Weight Conversion" }
      ]
    },
    {
      title: "Cooking & Baking Converters",
      icon: "fa-solid fa-utensils",
      calculators: [
        { key: "cooking-ingredient-conversion", name: "Cooking Ingredient Conversion" },
        { key: "beer-conversion", name: "Beer Conversion" },
        { key: "butter-conversion", name: "Butter Conversion" },
        { key: "flour-conversion", name: "Flour Conversion" },
        { key: "salt-conversion", name: "Salt Conversion" },
        { key: "sugar-conversion", name: "Sugar Conversion" }
      ]
    },
    {
      title: "Electrical Converters",
      icon: "fa-solid fa-bolt",
      calculators: [
        { key: "capacitance-conversion", name: "Capacitance Conversion" },
        { key: "electric-charge-conversion", name: "Electric Charge Conversion" },
        { key: "electric-current-conversion", name: "Electric Current Conversion" },
        { key: "electrical-conductance-conversion", name: "Electrical Conductance Conversion" },
        { key: "electrical-inductance-conversion", name: "Electrical Inductance Conversion" },
        { key: "electrical-resistance-conversion", name: "Electrical Resistance Conversion" },
        { key: "energy-conversion", name: "Energy Conversion" },
        { key: "mixed-electrical-unit-conversion", name: "Mixed Electrical Unit Conversion" },
        { key: "power-conversion", name: "Power Conversion" },
        { key: "voltage-conversion", name: "Voltage Conversion" }
      ]
    },
    {
      title: "More Converters",
      icon: "fa-solid fa-plus",
      calculators: [
        { key: "data-storage-conversion", name: "Data Storage Conversion" },
        { key: "data-transfer-conversion", name: "Data Transfer Conversion" },
        { key: "electric-car-efficiency-conversion", name: "Electric Car Efficiency Conversion" },
        { key: "force-conversion", name: "Force Conversion" },
        { key: "frequency-conversion", name: "Frequency Conversion" },
        { key: "fuel-economy-conversion", name: "Fuel Economy Conversion" },
        { key: "number-system-conversion", name: "Number System Conversion" },
        { key: "torque-conversion", name: "Torque Conversion" }
      ]
    }
  ];

  const handleSubCategoryClick = (subCategory: any) => {
    const slug = subCategory.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    navigate(`/conversion/${slug}`, { state: { subCategory } });
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Header />
      
      <main className="pt-20">
        <section className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <div className="mb-6">
            <button 
              onClick={() => navigate('/')} 
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
          </div>

          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
              Conversion Calculators
            </h1>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Unit conversion is the process of converting a measurement from one unit to another, for instance, converting your height from inches to centimeters. Convert nearly any measurement using one of the conversion calculators below.
            </p>
          </div>

          {/* Sub Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subCategories.map((subCategory, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-soft transition-all duration-300 hover:-translate-y-1 bg-card border-border/50 cursor-pointer"
                onClick={() => handleSubCategoryClick(subCategory)}
              >
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20 group-hover:bg-primary/10 transition-colors">
                      <i className={`${subCategory.icon} text-green-600 text-lg`}></i>
                    </div>
                    <span>{subCategory.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-muted-foreground text-sm mb-3">
                      {subCategory.calculators.length} converters available
                    </p>
                    <div className="space-y-1">
                      {subCategory.calculators.slice(0, 3).map((calc, idx) => (
                        <p key={idx} className="text-sm text-muted-foreground">
                          • {calc.name}
                        </p>
                      ))}
                      {subCategory.calculators.length > 3 && (
                        <p className="text-sm text-muted-foreground font-medium">
                          + {subCategory.calculators.length - 3} more...
                        </p>
                      )}
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

export default ConversionCalculators;