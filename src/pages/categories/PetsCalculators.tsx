import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";

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

export default function PetsCalculators() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return petsData;
    
    const filtered: Partial<typeof petsData> = {};
    Object.entries(petsData).forEach(([key, category]) => {
      const filteredCalculators = category.calculators.filter(calc =>
        calc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        calc.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      if (filteredCalculators.length > 0) {
        filtered[key as keyof typeof petsData] = {
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
            Pet Care Calculators
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Use our pet calculators to calculate the age, weight, nutrition, and habitat requirements for your best friends.
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
                      to={`/pets/calculator/${calculator.key}`}
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