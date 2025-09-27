import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";

const mathData = {
  "basic": {
    title: "Basic Calculators",
    description: "Essential mathematical calculation tools",
    calculators: [
      { key: "scientific", name: "Scientific Calculator", description: "Advanced mathematical functions and operations" },
      { key: "basic", name: "Basic Calculator", description: "Simple arithmetic operations and calculations" }
    ]
  },
  "percentage": {
    title: "Percentage Calculators",
    description: "Calculate percentages, increases, decreases and conversions",
    calculators: [
      { key: "percentage", name: "Percentage Calculator", description: "Calculate percentages and ratios" },
      { key: "percent-increase", name: "Percent Increase Calculator", description: "Calculate percentage increase between values" },
      { key: "percent-decrease", name: "Percent Decrease Calculator", description: "Calculate percentage decrease between values" },
      { key: "percent-change", name: "Percent Change Calculator", description: "Calculate percentage change between values" },
      { key: "percent-to-decimal", name: "Percent to Decimal Calculator", description: "Convert percentages to decimal values" },
      { key: "percent-to-fraction", name: "Percent to Fraction Calculator", description: "Convert percentages to fractions" }
    ]
  },
  "grade": {
    title: "Grade Calculators",
    description: "Academic grade calculations and GPA tools",
    calculators: [
      { key: "gpa", name: "GPA Calculator", description: "Calculate your Grade Point Average" },
      { key: "college-gpa", name: "College GPA Calculator", description: "Calculate college-level GPA with credits" },
      { key: "final-grade", name: "Final Grade Calculator", description: "Calculate required final exam score" },
      { key: "weighted-grade", name: "Weighted Grade Calculator", description: "Calculate weighted grades and averages" }
    ]
  },
  "fraction": {
    title: "Fraction Calculators",
    description: "Fraction operations and conversions",
    calculators: [
      { key: "fraction-to-decimal", name: "Fraction to Decimal Calculator", description: "Convert fractions to decimal numbers" },
      { key: "decimal-to-fraction", name: "Decimal to Fraction Calculator", description: "Convert decimal numbers to fractions" },
      { key: "fraction-to-percent", name: "Fraction to Percent Calculator", description: "Convert fractions to percentages" },
      { key: "fraction-simplifier", name: "Fraction Simplifier / Reducer", description: "Simplify and reduce fractions" },
      { key: "mixed-number", name: "Mixed Number ↔ Improper Fraction", description: "Convert between mixed numbers and improper fractions" }
    ]
  },
  "geometry": {
    title: "Geometry Calculators",
    description: "Area, volume, perimeter and geometric calculations",
    calculators: [
      { key: "area", name: "Area Calculator", description: "Calculate area of various shapes" },
      { key: "volume", name: "Volume Calculator", description: "Calculate volume of 3D shapes" },
      { key: "perimeter", name: "Perimeter Calculator", description: "Calculate perimeter of shapes" },
      { key: "circumference", name: "Circumference Calculator", description: "Calculate circle circumference" }
    ]
  },
  "number-conversion": {
    title: "Number Conversion Calculators",
    description: "Convert between different number systems",
    calculators: [
      { key: "decimal-to-binary", name: "Decimal to Binary Converter", description: "Convert decimal numbers to binary" },
      { key: "binary-to-decimal", name: "Binary to Decimal Converter", description: "Convert binary numbers to decimal" },
      { key: "decimal-to-hex", name: "Decimal to Hexadecimal Converter", description: "Convert decimal to hexadecimal" },
      { key: "base-converter", name: "Base Converter", description: "Convert between different number bases" }
    ]
  },
  "slope-line": {
    title: "Slope and Line Calculators",
    description: "Linear equation and coordinate geometry tools",
    calculators: [
      { key: "slope", name: "Slope Calculator", description: "Calculate slope between two points" },
      { key: "distance", name: "Distance Between Two Points Calculator", description: "Calculate distance between coordinates" }
    ]
  },
  "statistics": {
    title: "Statistics Calculators",
    description: "Statistical analysis and probability tools",
    calculators: [
      { key: "mean-median-mode", name: "Mean, Median, Mode Calculator", description: "Calculate central tendency measures" },
      { key: "standard-deviation", name: "Standard Deviation Calculator", description: "Calculate standard deviation and variance" },
      { key: "z-score", name: "Z-Score Calculator", description: "Calculate z-scores and probabilities" },
      { key: "probability", name: "Probability Calculator", description: "Calculate probability and combinations" }
    ]
  },
  "trigonometry": {
    title: "Triangle & Trigonometry",
    description: "Triangular calculations and trigonometric functions",
    calculators: [
      { key: "pythagorean", name: "Pythagorean Theorem Calculator", description: "Calculate triangle sides using Pythagorean theorem" },
      { key: "right-triangle", name: "Right Triangle Calculator", description: "Calculate right triangle properties" },
      { key: "trigonometric", name: "Sine, Cosine, Tangent Calculators", description: "Calculate trigonometric functions" },
      { key: "unit-circle", name: "Unit Circle Calculator", description: "Unit circle values and calculations" }
    ]
  }
};

export default function MathCalculators() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return mathData;
    
    const filtered: Partial<typeof mathData> = {};
    Object.entries(mathData).forEach(([key, category]) => {
      const filteredCalculators = category.calculators.filter(calc =>
        calc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        calc.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      if (filteredCalculators.length > 0) {
        filtered[key as keyof typeof mathData] = {
          ...category,
          calculators: filteredCalculators
        };
      }
    });
    
    return filtered;
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Math & Algebra Calculators
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Use our math and algebra calculators for mathematical operations, conversions, and academic calculations. From basic arithmetic to advanced trigonometry.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for a calculator"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background/80 border-border/60 focus:border-primary/40"
            />
          </div>
        </div>

        {/* Calculator Categories */}
        <div className="grid gap-8">
          {Object.entries(filteredData).map(([key, category]) => (
            <Card key={key} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="bg-gradient-subtle">
                <CardTitle className="text-2xl">{category.title}</CardTitle>
                <CardDescription className="text-base">
                  {category.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {category.calculators.map((calculator) => (
                    <Link
                      key={calculator.key}
                      to={`/math/calculator/${calculator.key}`}
                      className="block p-4 rounded-lg border border-border/60 hover:border-primary/40 hover:bg-muted/50 transition-all duration-200 group"
                    >
                      <h3 className="font-semibold group-hover:text-primary transition-colors">
                        {calculator.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-2">
                        {calculator.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {Object.keys(filteredData).length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No calculators found matching "{searchTerm}"
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}