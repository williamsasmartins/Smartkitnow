import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowLeft, Monitor, DollarSign, BookOpen } from "lucide-react";
import { useState, useMemo } from "react";
import CalculatorLink from "@/components/common/CalculatorLink";

export default function TVSubCategory() {
  const { subcategory } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const categories = {
    "tv-video": {
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
    "cost-guides": {
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
    "resources": {
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
  };

  const currentCategory = categories[subcategory as keyof typeof categories];

  const filteredCalculators = useMemo(() => {
    if (!currentCategory) return [];
    if (!searchTerm.trim()) return currentCategory.calculators;
    return currentCategory.calculators.filter(calc => 
      calc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      calc.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, currentCategory]);

  const handleCalculatorClick = (calculatorKey: string) => {
    navigate(`/tv/calculator/${calculatorKey}`);
  };

  if (!currentCategory) {
    return (
      <div className="min-h-screen bg-gradient-subtle pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Category Not Found</h1>
            <p className="text-muted-foreground mb-8">The requested category does not exist.</p>
-            <Button onClick={() => navigate("/tv")}>Back to TV & Video Calculators</Button>
+            <Button onClick={() => navigate("/tv")}>Back to TV & Video Calculators</Button>
          </div>
        </div>
      </div>
    );
  }

  const Icon = currentCategory.icon;

  return (
    <div className="min-h-screen bg-gradient-subtle pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/tv")}
            className="hover:bg-primary/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to TV & Video Calculators
          </Button>
        </div>

        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Icon className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              {currentCategory.title}
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {currentCategory.description}
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search calculators..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 py-3 text-lg bg-background/80 backdrop-blur-sm border-border/60 focus:border-primary/40 transition-all duration-300"
            />
          </div>
        </div>

        {/* Calculators Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCalculators.map((calculator) => (
            <Card 
              key={calculator.key}
              className="cursor-pointer hover:shadow-elegant transition-all duration-300 hover:scale-105 bg-background/80 backdrop-blur-sm border-border/60"
              onClick={() => handleCalculatorClick(calculator.key)}
            >
              <CardHeader>
                <CardTitle className="text-xl">
                  <CalculatorLink to={`/tv/calculator/${calculator.key}`}>{calculator.name}</CalculatorLink>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{calculator.description}</p>
                <Button className="w-full">
                  Use Calculator
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCalculators.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No calculators found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}