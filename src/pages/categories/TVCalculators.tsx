import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Monitor, DollarSign, BookOpen } from "lucide-react";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function TVCalculators() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    {
      id: "tv-video",
      title: "TV & Video Calculators",
      description: "Calculate TV sizes, distances, mounting positions, and display specifications",
      icon: Monitor,
      calculators: [
        {
          key: "aspect-ratio",
          name: "Aspect Ratio Calculator",
          description: "Calculate aspect ratios for screens and videos"
        },
        {
          key: "ppi-dpi",
          name: "PPI Calculator / DPI Calculator", 
          description: "Calculate pixels per inch and dots per inch for displays"
        },
        {
          key: "projector",
          name: "Projector Calculator",
          description: "Calculate projector distance, screen size, and throw ratio"
        },
        {
          key: "screen-size",
          name: "Screen Size Calculator",
          description: "Calculate screen dimensions from diagonal measurements"
        },
        {
          key: "tv-height",
          name: "TV Height Calculator",
          description: "Calculate optimal TV mounting height for viewing"
        },
        {
          key: "tv-viewing-distance",
          name: "TV Size and Viewing Distance Calculator",
          description: "Calculate optimal viewing distance based on TV size"
        }
      ]
    },
    {
      id: "cost-guides",
      title: "Cost Calculators & Price Guides",
      description: "Calculate installation costs and price estimates",
      icon: DollarSign,
      calculators: [
        {
          key: "tv-mounting-cost",
          name: "TV Mounting and Installation Cost Guide",
          description: "Calculate TV mounting and installation costs"
        }
      ]
    },
    {
      id: "resources",
      title: "Additional Resources",
      description: "Reference guides and charts for TV specifications",
      icon: BookOpen,
      calculators: [
        {
          key: "tv-dimensions-chart",
          name: "16:9 TV Dimensions – Screen Size Chart",
          description: "Reference chart for standard TV dimensions"
        },
        {
          key: "video-resolutions",
          name: "Common Video Display Resolutions and Aspect Ratios",
          description: "Guide to standard video formats and resolutions"
        },
        {
          key: "tv-viewing-ranges",
          name: "TV Size and Viewing Distance Ranges",
          description: "Recommended viewing distances for different TV sizes"
        }
      ]
    }
  ];

  const allCalculators = useMemo(() => {
    return categories.flatMap(category => 
      category.calculators.map(calc => ({
        ...calc,
        category: category.id,
        categoryTitle: category.title
      }))
    );
  }, []);

  const filteredCalculators = useMemo(() => {
    if (!searchTerm.trim()) return allCalculators;
    return allCalculators.filter(calc => 
      calc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      calc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      calc.categoryTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, allCalculators]);

  const handleCalculatorClick = (calculator: any) => {
    navigate(`/tv/calculator/${calculator.key}`);
  };

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/tv/${categoryId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            TV & Video Calculators
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Use our TV resources to learn more about TV installation, including how big of a TV to install, 
            how far away to sit from the TV, how high to mount a TV, how much it costs to install a TV, 
            and common TV sizes and aspect ratios.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for a calculator"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 py-3 text-lg bg-background/80 backdrop-blur-sm border-border/60 focus:border-primary/40 transition-all duration-300"
            />
          </div>
        </div>

        {/* Search Results */}
        {searchTerm && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Search Results</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredCalculators.map((calculator) => (
                <Card 
                  key={calculator.key}
                  className="cursor-pointer hover:shadow-elegant transition-all duration-300 hover:scale-105 bg-background/80 backdrop-blur-sm border-border/60"
                  onClick={() => handleCalculatorClick(calculator)}
                >
                  <CardHeader>
                    <CardTitle className="text-lg">{calculator.name}</CardTitle>
                    <CardDescription className="text-sm text-primary">
                      {calculator.categoryTitle}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{calculator.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            {filteredCalculators.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No calculators found matching your search.</p>
              </div>
            )}
          </div>
        )}

        {/* Categories */}
        {!searchTerm && (
          <div className="space-y-12">
            {categories.map((category) => (
              <div key={category.id}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <category.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold">{category.title}</h2>
                      <p className="text-muted-foreground">{category.description}</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => handleCategoryClick(category.id)}
                    className="hover:bg-primary/10"
                  >
                    View All
                  </Button>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {category.calculators.map((calculator) => (
                    <Card 
                      key={calculator.key}
                      className="cursor-pointer hover:shadow-elegant transition-all duration-300 hover:scale-105 bg-background/80 backdrop-blur-sm border-border/60"
                      onClick={() => handleCalculatorClick(calculator)}
                    >
                      <CardHeader>
                        <CardTitle className="text-lg">{calculator.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{calculator.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}