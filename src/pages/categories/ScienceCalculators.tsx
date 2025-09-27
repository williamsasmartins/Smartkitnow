import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";

const scienceData = {
  "chemistry": {
    title: "Chemistry Calculators",
    description: "Chemical calculations for molarity, pH, molecular mass, and reactions",
    calculators: [
      { key: "molar-mass", name: "Molar Mass Calculator", description: "Calculate molecular weight of compounds" },
      { key: "molarity", name: "Molarity Calculator", description: "Calculate solution concentration" },
      { key: "ph", name: "pH Calculator", description: "Calculate pH from H+ concentration" },
      { key: "percent-yield", name: "Percent Yield Calculator", description: "Calculate reaction efficiency" },
      { key: "grams-to-moles", name: "Grams to Moles Calculator", description: "Convert mass to moles" },
      { key: "atoms-to-moles", name: "Atoms to Moles Calculator", description: "Convert atoms to moles using Avogadro's number" },
      { key: "liters-to-moles", name: "Liters to Moles Calculator", description: "Convert gas volume to moles at STP" },
      { key: "ppm", name: "PPM Calculator", description: "Calculate parts per million concentration" },
      { key: "mg-l-to-ppm", name: "mg/L to PPM Converter", description: "Convert milligrams per liter to PPM" },
      { key: "theoretical-yield", name: "Theoretical Yield Calculator", description: "Calculate maximum possible product yield" }
    ]
  },
  "density": {
    title: "Density Calculators",
    description: "Density and weight calculations for various materials",
    calculators: [
      { key: "density", name: "Density Calculator", description: "Calculate density from mass and volume" },
      { key: "water-weight", name: "Water Weight Calculator", description: "Calculate weight of water by volume" },
      { key: "metal-weight", name: "Metal Weight Calculator", description: "Calculate weight of metal objects" }
    ]
  },
  "physics": {
    title: "Physics Calculators",
    description: "Physics calculations for mechanics, waves, and thermodynamics",
    calculators: [
      { key: "force", name: "Force Calculator", description: "Calculate force using Newton's second law" },
      { key: "acceleration", name: "Acceleration Calculator", description: "Calculate acceleration from velocity change" },
      { key: "velocity", name: "Velocity Calculator", description: "Calculate velocity from displacement and time" },
      { key: "speed", name: "Speed Calculator", description: "Calculate speed from distance and time" },
      { key: "momentum", name: "Momentum Calculator", description: "Calculate momentum from mass and velocity" },
      { key: "gravitational-force", name: "Gravitational Force Calculator", description: "Calculate gravitational attraction" },
      { key: "frequency", name: "Frequency Calculator", description: "Calculate wave frequency" },
      { key: "wavelength", name: "Wavelength Calculator", description: "Calculate wavelength from frequency" },
      { key: "specific-heat", name: "Specific Heat Calculator", description: "Calculate heat capacity of materials" },
      { key: "spring-constant", name: "Spring Constant Calculator", description: "Calculate spring constant from Hooke's law" }
    ]
  }
};

export default function ScienceCalculators() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return scienceData;
    
    const filtered: Partial<typeof scienceData> = {};
    Object.entries(scienceData).forEach(([key, category]) => {
      const filteredCalculators = category.calculators.filter(calc =>
        calc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        calc.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      if (filteredCalculators.length > 0) {
        filtered[key as keyof typeof scienceData] = {
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
            Science Calculators
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Comprehensive science calculators for chemistry, physics, and density calculations. Perfect for students, researchers, and professionals.
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
                      to={`/science/calculator/${calculator.key}`}
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
