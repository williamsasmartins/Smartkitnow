import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ChevronRight, Ruler, Map, ChefHat, Zap, Battery, Fuel, Move, Gauge, Thermometer, Clock, Volume2, Weight } from "lucide-react";

const ConversionCalculators = () => {
  const navigate = useNavigate();

  const popularConverters = [
    {
      title: "Angle",
      icon: <Ruler className="h-5 w-5" />,
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      conversions: [
        { from: "deg", to: "rad", key: "deg-to-rad" },
        { from: "rad", to: "deg", key: "rad-to-deg" },
        { from: "deg", to: "mrad", key: "deg-to-mrad" },
        { from: "mrad", to: "deg", key: "mrad-to-deg" }
      ]
    },
    {
      title: "Area",
      icon: <Map className="h-5 w-5" />,
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      conversions: [
        { from: "sq ft", to: "sq m", key: "sq-ft-to-sq-m" },
        { from: "sq m", to: "sq ft", key: "sq-m-to-sq-ft" },
        { from: "sq mi", to: "sq km", key: "sq-mi-to-sq-km" },
        { from: "sq km", to: "sq mi", key: "sq-km-to-sq-mi" }
      ]
    },
    {
      title: "Cooking",
      icon: <ChefHat className="h-5 w-5" />,
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      conversions: [
        { from: "g", to: "mL", key: "g-to-ml" },
        { from: "mL", to: "g", key: "ml-to-g" },
        { from: "mg", to: "mL", key: "mg-to-ml" },
        { from: "mL", to: "mg", key: "ml-to-mg" }
      ]
    },
    {
      title: "Electrical",
      icon: <Zap className="h-5 w-5" />,
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      conversions: [
        { from: "kΩ", to: "Ω", key: "kohm-to-ohm" },
        { from: "MΩ", to: "Ω", key: "mohm-to-ohm" },
        { from: "Ω", to: "kΩ", key: "ohm-to-kohm" },
        { from: "mΩ", to: "Ω", key: "mohm-to-ohm-small" }
      ]
    },
    {
      title: "Energy",
      icon: <Battery className="h-5 w-5" />,
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      conversions: [
        { from: "kcal", to: "cal", key: "kcal-to-cal" },
        { from: "MJ", to: "kWh", key: "mj-to-kwh" },
        { from: "MWh", to: "kWh", key: "mwh-to-kwh" },
        { from: "MMBTU", to: "MWh", key: "mmbtu-to-mwh" }
      ]
    },
    {
      title: "Fuel Economy",
      icon: <Fuel className="h-5 w-5" />,
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      conversions: [
        { from: "mpg", to: "km/L", key: "mpg-to-kml" },
        { from: "km/L", to: "mpg", key: "kml-to-mpg" },
        { from: "mpg", to: "L/100km", key: "mpg-to-l100km" },
        { from: "L/100km", to: "mpg", key: "l100km-to-mpg" }
      ]
    },
    {
      title: "Length",
      icon: <Move className="h-5 w-5" />,
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      conversions: [
        { from: "in", to: "cm", key: "in-to-cm" },
        { from: "cm", to: "in", key: "cm-to-in" },
        { from: "ft", to: "m", key: "ft-to-m" },
        { from: "m", to: "ft", key: "m-to-ft" }
      ]
    },
    {
      title: "Speed",
      icon: <Gauge className="h-5 w-5" />,
      color: "text-red-500",
      bgColor: "bg-red-900/20",
      conversions: [
        { from: "mph", to: "km/h", key: "mph-to-kmh" },
        { from: "km/h", to: "mph", key: "kmh-to-mph" },
        { from: "ft/s", to: "mph", key: "fts-to-mph" },
        { from: "mph", to: "m/s", key: "mph-to-ms" }
      ]
    },
    {
      title: "Temperature",
      icon: <Thermometer className="h-5 w-5" />,
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      conversions: [
        { from: "°F", to: "°C", key: "f-to-c" },
        { from: "°C", to: "°F", key: "c-to-f" },
        { from: "°F", to: "K", key: "f-to-k" },
        { from: "°C", to: "K", key: "c-to-k" }
      ]
    },
    {
      title: "Time",
      icon: <Clock className="h-5 w-5" />,
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      conversions: [
        { from: "sec", to: "min", key: "sec-to-min" },
        { from: "min", to: "sec", key: "min-to-sec" },
        { from: "sec", to: "hr", key: "sec-to-hr" },
        { from: "hr", to: "sec", key: "hr-to-sec" }
      ]
    },
    {
      title: "Volume",
      icon: <Volume2 className="h-5 w-5" />,
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      conversions: [
        { from: "tbsp", to: "cups", key: "tbsp-to-cups" },
        { from: "cm³", to: "m³", key: "cm3-to-m3" },
        { from: "gal", to: "L", key: "gal-to-l" },
        { from: "tsp", to: "mL", key: "tsp-to-ml" }
      ]
    },
    {
      title: "Weight",
      icon: <Weight className="h-5 w-5" />,
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      conversions: [
        { from: "lbs", to: "kg", key: "lbs-to-kg" },
        { from: "kg", to: "lbs", key: "kg-to-lbs" },
        { from: "oz", to: "g", key: "oz-to-g" },
        { from: "g", to: "oz", key: "g-to-oz" }
      ]
    }
  ];

  const subCategories = [
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

          {/* Popular Converters Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8 text-foreground">Popular Converters</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {popularConverters.map((category, index) => (
                <Card key={index} className="border border-border/50 hover:shadow-soft transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center space-x-2 text-lg">
                      <div className={`p-2 rounded-lg ${category.bgColor}`}>
                        <div className={category.color}>
                          {category.icon}
                        </div>
                      </div>
                      <span className="text-foreground">{category.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      {category.conversions.map((conversion, idx) => (
                        <div 
                          key={idx}
                          className="flex items-center justify-between py-1 px-2 rounded hover:bg-muted/50 cursor-pointer group transition-colors"
                          onClick={() => navigate(`/calculator/${conversion.key}`)}
                        >
                          <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                            {conversion.from} to {conversion.to}
                          </span>
                          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
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
