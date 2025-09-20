import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Calculator, RotateCcw } from "lucide-react";
import { useState } from "react";

interface ConversionData {
  title: string;
  fromUnit: string;
  toUnit: string;
  formula: string;
  factor: number;
  description: string;
  howToConvert: string;
  examples: { input: string; output: string; }[];
  educationalText: string;
}

const conversionData: Record<string, ConversionData> = {
  "deg-to-rad": {
    title: "Degrees to Radians",
    fromUnit: "degrees",
    toUnit: "radians", 
    formula: "radians = degrees × π/180",
    factor: Math.PI / 180,
    description: "Convert angle measurements from degrees to radians.",
    howToConvert: "To convert degrees to radians, multiply the degree value by π/180 (approximately 0.0174533).",
    examples: [
      { input: "90°", output: "1.5708 rad" },
      { input: "180°", output: "3.1416 rad" },
      { input: "360°", output: "6.2832 rad" }
    ],
    educationalText: "Radians are the standard unit of angular measure in mathematics. One radian is the angle subtended at the center of a circle by an arc equal in length to the radius. There are 2π radians in a complete circle, which equals 360 degrees."
  },
  "rad-to-deg": {
    title: "Radians to Degrees",
    fromUnit: "radians",
    toUnit: "degrees",
    formula: "degrees = radians × 180/π",
    factor: 180 / Math.PI,
    description: "Convert angle measurements from radians to degrees.",
    howToConvert: "To convert radians to degrees, multiply the radian value by 180/π (approximately 57.2958).",
    examples: [
      { input: "π/2 rad", output: "90°" },
      { input: "π rad", output: "180°" },
      { input: "2π rad", output: "360°" }
    ],
    educationalText: "Degrees are a common unit for measuring angles, where a full circle is divided into 360 degrees. This system dates back to ancient Babylonian mathematics and is widely used in navigation, engineering, and everyday applications."
  },
  "in-to-cm": {
    title: "Inches to Centimeters",
    fromUnit: "inches",
    toUnit: "centimeters",
    formula: "centimeters = inches × 2.54",
    factor: 2.54,
    description: "Convert length measurements from inches to centimeters.",
    howToConvert: "To convert inches to centimeters, multiply the inch value by 2.54.",
    examples: [
      { input: "1 inch", output: "2.54 cm" },
      { input: "12 inches", output: "30.48 cm" },
      { input: "36 inches", output: "91.44 cm" }
    ],
    educationalText: "The inch is an imperial unit of length, while the centimeter is a metric unit. The conversion factor 2.54 is exact by definition, as it was established by international agreement to standardize the relationship between imperial and metric systems."
  },
  "cm-to-in": {
    title: "Centimeters to Inches",
    fromUnit: "centimeters",
    toUnit: "inches",
    formula: "inches = centimeters ÷ 2.54",
    factor: 1 / 2.54,
    description: "Convert length measurements from centimeters to inches.",
    howToConvert: "To convert centimeters to inches, divide the centimeter value by 2.54.",
    examples: [
      { input: "2.54 cm", output: "1 inch" },
      { input: "30.48 cm", output: "12 inches" },
      { input: "91.44 cm", output: "36 inches" }
    ],
    educationalText: "Centimeters are part of the metric system, which is used by most countries worldwide. The metric system is based on powers of 10, making calculations easier than the imperial system used primarily in the United States."
  },
  "f-to-c": {
    title: "Fahrenheit to Celsius",
    fromUnit: "°F",
    toUnit: "°C",
    formula: "°C = (°F - 32) × 5/9",
    factor: 0, // Special case - needs custom calculation
    description: "Convert temperature from Fahrenheit to Celsius.",
    howToConvert: "To convert Fahrenheit to Celsius, subtract 32 from the Fahrenheit temperature, then multiply by 5/9.",
    examples: [
      { input: "32°F", output: "0°C" },
      { input: "68°F", output: "20°C" },
      { input: "100°F", output: "37.78°C" }
    ],
    educationalText: "The Fahrenheit scale was developed by Daniel Gabriel Fahrenheit in 1724. Water freezes at 32°F and boils at 212°F. The Celsius scale, developed by Anders Celsius, uses 0°C for water's freezing point and 100°C for its boiling point at standard atmospheric pressure."
  },
  "c-to-f": {
    title: "Celsius to Fahrenheit", 
    fromUnit: "°C",
    toUnit: "°F",
    formula: "°F = (°C × 9/5) + 32",
    factor: 0, // Special case - needs custom calculation
    description: "Convert temperature from Celsius to Fahrenheit.",
    howToConvert: "To convert Celsius to Fahrenheit, multiply the Celsius temperature by 9/5, then add 32.",
    examples: [
      { input: "0°C", output: "32°F" },
      { input: "20°C", output: "68°F" },
      { input: "37.78°C", output: "100°F" }
    ],
    educationalText: "Celsius is the primary temperature scale used in the metric system and by most countries worldwide. It's based on the freezing and boiling points of water at standard atmospheric pressure, making it intuitive for everyday use."
  },
  "lbs-to-kg": {
    title: "Pounds to Kilograms",
    fromUnit: "pounds",
    toUnit: "kilograms",
    formula: "kilograms = pounds ÷ 2.20462",
    factor: 1 / 2.20462,
    description: "Convert weight from pounds to kilograms.",
    howToConvert: "To convert pounds to kilograms, divide the pound value by 2.20462.",
    examples: [
      { input: "1 lb", output: "0.454 kg" },
      { input: "10 lbs", output: "4.536 kg" },
      { input: "150 lbs", output: "68.04 kg" }
    ],
    educationalText: "The pound is an imperial unit of weight commonly used in the United States, while the kilogram is the base unit of mass in the metric system. One kilogram is approximately equal to 2.20462 pounds."
  },
  "kg-to-lbs": {
    title: "Kilograms to Pounds",
    fromUnit: "kilograms", 
    toUnit: "pounds",
    formula: "pounds = kilograms × 2.20462",
    factor: 2.20462,
    description: "Convert weight from kilograms to pounds.",
    howToConvert: "To convert kilograms to pounds, multiply the kilogram value by 2.20462.",
    examples: [
      { input: "0.454 kg", output: "1 lb" },
      { input: "4.536 kg", output: "10 lbs" },
      { input: "68.04 kg", output: "150 lbs" }
    ],
    educationalText: "The kilogram is defined by the International System of Units (SI) and is based on fundamental physical constants. It's the only SI base unit still defined by a physical artifact, though this changed in 2019 when it was redefined using Planck's constant."
  },
  "mph-to-kmh": {
    title: "Miles per Hour to Kilometers per Hour",
    fromUnit: "mph",
    toUnit: "km/h",
    formula: "km/h = mph × 1.60934",
    factor: 1.60934,
    description: "Convert speed from miles per hour to kilometers per hour.",
    howToConvert: "To convert mph to km/h, multiply the mph value by 1.60934.",
    examples: [
      { input: "30 mph", output: "48.28 km/h" },
      { input: "60 mph", output: "96.56 km/h" },
      { input: "70 mph", output: "112.65 km/h" }
    ],
    educationalText: "Miles per hour is commonly used in the United States and United Kingdom for measuring vehicle speeds, while kilometers per hour is used in most other countries. The conversion factor comes from the relationship between miles and kilometers (1 mile = 1.60934 kilometers)."
  },
  "kmh-to-mph": {
    title: "Kilometers per Hour to Miles per Hour",
    fromUnit: "km/h",
    toUnit: "mph",
    formula: "mph = km/h ÷ 1.60934",
    factor: 1 / 1.60934,
    description: "Convert speed from kilometers per hour to miles per hour.",
    howToConvert: "To convert km/h to mph, divide the km/h value by 1.60934.",
    examples: [
      { input: "48.28 km/h", output: "30 mph" },
      { input: "96.56 km/h", output: "60 mph" },
      { input: "112.65 km/h", output: "70 mph" }
    ],
    educationalText: "Speed limits and vehicle speedometers in metric countries display kilometers per hour. This unit is part of the metric system's consistency, where distances are measured in kilometers and time in hours, making calculations straightforward."
  }
};

const ConversionPage = () => {
  const { conversionKey } = useParams();
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState("");

  if (!conversionKey || !conversionData[conversionKey]) {
    navigate('/conversion');
    return null;
  }

  const data = conversionData[conversionKey];

  const handleConversion = () => {
    const input = parseFloat(inputValue);
    if (isNaN(input)) {
      setResult("Please enter a valid number");
      return;
    }

    let convertedValue: number;
    
    // Special cases for temperature conversions
    if (conversionKey === "f-to-c") {
      convertedValue = (input - 32) * 5/9;
    } else if (conversionKey === "c-to-f") {
      convertedValue = (input * 9/5) + 32;
    } else {
      convertedValue = input * data.factor;
    }

    setResult(convertedValue.toFixed(4));
  };

  const handleReset = () => {
    setInputValue("");
    setResult("");
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
              onClick={() => navigate('/conversion')}
              className="flex items-center space-x-2 mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Conversions</span>
            </Button>
            
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 rounded-lg bg-primary/10">
                <Calculator className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  {data.title}
                </h1>
                <p className="text-muted-foreground mt-2 text-lg">
                  {data.description}
                </p>
              </div>
            </div>
          </div>
          
          {/* Calculator Interface */}
          <Card className="bg-card border-border/50 mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">Convert {data.fromUnit} to {data.toUnit}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="input" className="text-sm font-medium">
                    Enter value in {data.fromUnit}
                  </Label>
                  <Input
                    id="input"
                    type="number"
                    placeholder={`Enter ${data.fromUnit}`}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="text-lg"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Result in {data.toUnit}
                  </Label>
                  <div className="p-3 bg-muted rounded-md text-lg font-mono">
                    {result || "0"}
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button onClick={handleConversion} className="flex-1">
                  <Calculator className="h-4 w-4 mr-2" />
                  Convert
                </Button>
                <Button variant="outline" onClick={handleReset}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>

              <div className="bg-muted/30 rounded-lg p-4">
                <h4 className="font-semibold text-foreground mb-2">Formula:</h4>
                <code className="text-sm bg-background px-2 py-1 rounded font-mono">
                  {data.formula}
                </code>
              </div>
            </CardContent>
          </Card>

          {/* How to Convert Section */}
          <Card className="bg-card border-border/50 mb-8">
            <CardHeader>
              <CardTitle className="text-xl text-foreground">How to Convert {data.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{data.howToConvert}</p>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">Examples:</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {data.examples.map((example, index) => (
                    <div key={index} className="bg-muted/30 rounded-lg p-3">
                      <div className="text-sm text-foreground font-medium">{example.input}</div>
                      <div className="text-sm text-muted-foreground">= {example.output}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Educational Content */}
          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle className="text-xl text-foreground">About {data.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {data.educationalText}
              </p>
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ConversionPage;