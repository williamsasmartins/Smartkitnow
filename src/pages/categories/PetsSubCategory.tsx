import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowLeft } from "lucide-react";
import { useState, useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

const petsData = {
  "dog": {
    title: "Dog Calculators",
    description: "Health, nutrition, and care calculators for dogs",
    calculators: [
      { key: "dog-age", name: "Dog Age Calculator", description: "Convert dog age to human years" },
      { key: "dog-calorie", name: "Dog Calorie Calculator", description: "Calculate daily calorie needs for your dog" },
      { key: "dog-chocolate-toxicity", name: "Dog Chocolate Toxicity Calculator", description: "Assess chocolate poisoning risk" },
      { key: "dog-pregnancy", name: "Dog Pregnancy Calculator", description: "Calculate due date and pregnancy stages" },
      { key: "dog-water-intake", name: "Dog Water Intake Calculator", description: "Calculate daily water requirements" },
      { key: "dog-weight", name: "Dog Weight Calculator", description: "Assess if your dog is at ideal weight" }
    ]
  },
  "cat": {
    title: "Cat Calculators",
    description: "Health and care calculators for cats",
    calculators: [
      { key: "cat-age", name: "Cat Age Calculator", description: "Convert cat age to human years" },
      { key: "cat-calorie", name: "Cat Calorie Calculator", description: "Calculate daily calorie needs for your cat" },
      { key: "cat-water-intake", name: "Cat Water Intake Calculator", description: "Calculate daily water requirements" },
      { key: "cat-weight", name: "Cat Weight Calculator", description: "Assess if your cat is at ideal weight" },
      { key: "cat-litter", name: "Cat Litter Calculator", description: "Calculate litter box requirements" }
    ]
  },
  "aquarium": {
    title: "Aquarium Calculators",
    description: "Tank setup and maintenance calculators for aquariums",
    calculators: [
      { key: "aquarium-volume", name: "Aquarium Tank Volume Calculator", description: "Calculate tank volume and water capacity" },
      { key: "aquarium-weight", name: "Aquarium Tank Weight Calculator", description: "Calculate total weight with water and decorations" },
      { key: "fish-tank-filter", name: "Fish Tank Filter Calculator", description: "Calculate filtration requirements" },
      { key: "aquarium-heater", name: "Aquarium Heater Calculator", description: "Calculate heater wattage needed" },
      { key: "fish-stocking", name: "Fish Stocking Calculator", description: "Calculate fish capacity for your tank" }
    ]
  },
  "general": {
    title: "General Pet Calculators",
    description: "Multi-pet and general pet care calculators",
    calculators: [
      { key: "pet-age", name: "Pet Age Calculator", description: "Convert various pet ages to human years" },
      { key: "pet-medication", name: "Pet Medication Dosage Calculator", description: "Calculate medication dosages by weight" },
      { key: "pet-travel-cost", name: "Pet Travel Cost Calculator", description: "Calculate costs for traveling with pets" },
      { key: "pet-food-cost", name: "Pet Food Cost Calculator", description: "Calculate monthly and yearly food costs" },
      { key: "pet-insurance", name: "Pet Insurance Calculator", description: "Calculate potential insurance savings" }
    ]
  }
};

export default function PetsSubCategory() {
  const { subcategory } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const categoryData = subcategory ? petsData[subcategory as keyof typeof petsData] : null;

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
            <p className="text-muted-foreground mb-8">The requested pet calculator category does not exist.</p>
            <Button onClick={() => navigate("/pets")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Pet Calculators
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
          onClick={() => navigate("/pets")}
          className="mb-6 hover:bg-muted/80"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to All Pet Calculators
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
              <Link to={`/pets/calculator/${calculator.key}`} className="block h-full">
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