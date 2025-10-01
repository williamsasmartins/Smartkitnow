import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowLeft } from "lucide-react";
import { useState, useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

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

export default function ScienceSubCategory() {
  const { subcategory } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const categoryData = subcategory ? scienceData[subcategory as keyof typeof scienceData] : null;

  const filteredCalculators = useMemo(() => {
    if (!categoryData) return [];
    if (!searchTerm.trim()) return categoryData.calculators;
    
    return categoryData.calculators.filter(calc =>
      calc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      calc.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categoryData, searchTerm]);

  if (!categoryData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <Header />
        <main className="container mx-auto px-4 pt-24 pb-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Category Not Found</h1>
            <p className="text-muted-foreground mb-8">The requested science calculator category does not exist.</p>
            <Button onClick={() => navigate("/science")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Science Calculators
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate("/science")}
          className="mb-6 hover:bg-muted/80"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to All Science Calculators
        </Button>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            {categoryData.title}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            {categoryData.description}
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search calculators..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background/80 border-border/60 focus:border-primary/40"
            />
          </div>
        </div>

        {/* Calculator Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCalculators.map((calculator) => (
            <Card 
              key={calculator.key} 
              className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
            >
              <Link to={`/science/calculator/${calculator.key}`} className="block h-full">
                <CardHeader className="bg-gradient-subtle group-hover:bg-gradient-primary/10 transition-colors duration-300">
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {calculator.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <CardDescription className="text-base">
                    {calculator.description}
                  </CardDescription>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>

        {filteredCalculators.length === 0 && (
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