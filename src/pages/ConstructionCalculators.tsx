import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

const ConstructionCalculators = () => {
  const navigate = useNavigate();

  const subCategories = [
    {
      title: "Carpentry & Trim Calculators",
      icon: "fa-solid fa-hammer",
      calculators: [
        { key: "board-batten-layout", name: "Board and Batten Layout Calculator" },
        { key: "board-foot", name: "Board Foot Calculator" },
        { key: "framing", name: "Framing Calculator" },
        { key: "lumber-hardwood-weight", name: "Lumber and Hardwood Weight Calculator" },
        { key: "plywood", name: "Plywood Calculator" },
        { key: "rafter-length", name: "Rafter Length Calculator" },
        { key: "raised-panel-cabinet", name: "Raised Panel Cabinet Door Calculator" },
        { key: "trim-molding", name: "Trim and Molding Calculator" },
        { key: "wainscoting-layout", name: "Wainscoting Layout Calculator" }
      ]
    },
    {
      title: "Concrete & Masonry Calculators",
      icon: "fa-solid fa-cubes",
      calculators: [
        { key: "block-mortar", name: "Block Mortar Calculator" },
        { key: "concrete-block", name: "Concrete Block Calculator" },
        { key: "concrete-block-fill", name: "Concrete Block Fill Calculator" },
        { key: "concrete", name: "Concrete Calculator" },
        { key: "concrete-footing", name: "Concrete Footing Calculator" },
        { key: "concrete-mix", name: "Concrete Mix Calculator" },
        { key: "concrete-reinforcing-mesh", name: "Concrete Reinforcing Mesh Calculator" },
        { key: "concrete-steps", name: "Concrete Steps Calculator" },
        { key: "concrete-weight", name: "Concrete Weight Calculator" },
        { key: "rebar-material", name: "Rebar Material Calculator" },
        { key: "rebar-weight-size", name: "Rebar Weight and Size Calculator" }
      ]
    },
    {
      title: "Deck & Patio Calculators",
      icon: "fa-solid fa-square",
      calculators: [
        { key: "baluster", name: "Baluster Calculator" },
        { key: "deck-board-material", name: "Deck Board Material Calculator" },
        { key: "deck-stain", name: "Deck Stain Calculator" },
        { key: "paver-base", name: "Paver Base Calculator" },
        { key: "paver", name: "Paver Calculator and Price Estimator" },
        { key: "polymeric-sand", name: "Polymeric Sand Calculator" }
      ]
    },
    {
      title: "Driveway Calculators",
      icon: "fa-solid fa-road",
      calculators: [
        { key: "asphalt", name: "Asphalt Calculator" },
        { key: "asphalt-sealer", name: "Asphalt Sealer Calculator" },
        { key: "concrete-driveway", name: "Concrete Driveway Calculator" },
        { key: "gravel-driveway", name: "Gravel Driveway Calculator" }
      ]
    },
    {
      title: "Fence Calculators",
      icon: "fa-solid fa-fence",
      calculators: [
        { key: "fence", name: "Fence Calculator" },
        { key: "fence-stain", name: "Fence Stain Calculator" },
        { key: "post-hole-concrete", name: "Post Hole Concrete Calculator" },
        { key: "vinyl-fence", name: "Vinyl Fence Calculator" }
      ]
    },
    {
      title: "Flooring Calculators",
      icon: "fa-solid fa-layer-group",
      calculators: [
        { key: "carpet", name: "Carpet Calculator and Price Estimator" },
        { key: "flooring", name: "Flooring Calculator" },
        { key: "linear-feet-square-feet", name: "Linear Feet to Square Feet Calculator" },
        { key: "tile", name: "Tile Calculator and Cost Estimator" }
      ]
    },
    {
      title: "Lawn & Landscaping Calculators",
      icon: "fa-solid fa-seedling",
      calculators: [
        { key: "acreage", name: "Acreage Calculator" },
        { key: "elevation-grade", name: "Elevation Grade Calculator" },
        { key: "grass-seed", name: "Grass Seed Calculator" },
        { key: "gravel", name: "Gravel Calculator" },
        { key: "lawn-mowing", name: "Lawn Mowing Calculator" },
        { key: "mulch", name: "Mulch Calculator" },
        { key: "plant-flower", name: "Plant and Flower Calculator" },
        { key: "pool-volume", name: "Pool Volume Calculator" },
        { key: "retaining-wall", name: "Retaining Wall Calculator" },
        { key: "sand", name: "Sand Calculator" },
        { key: "sod", name: "Sod Calculator" },
        { key: "sod-weight", name: "Sod Weight Calculator" },
        { key: "soil", name: "Soil Calculator" },
        { key: "stone", name: "Stone Calculator" }
      ]
    },
    {
      title: "Measurement Calculators",
      icon: "fa-solid fa-ruler",
      calculators: [
        { key: "cubic-feet", name: "Cubic Feet Calculator" },
        { key: "cubic-inches", name: "Cubic Inches Calculator" },
        { key: "cubic-meters", name: "Cubic Meters Calculator" },
        { key: "cubic-yards", name: "Cubic Yards Calculator" },
        { key: "cylinder-cubic-footage", name: "Cylinder Cubic Footage Calculator" },
        { key: "cylinder-cubic-yardage", name: "Cylinder Cubic Yardage Calculator" },
        { key: "feet-inches-length", name: "Feet and Inches Length Calculator" },
        { key: "inch-fraction", name: "Inch Fraction Calculator" },
        { key: "scale-conversion", name: "Scale Conversion Calculator" },
        { key: "square-feet-cubic-feet", name: "Square Feet to Cubic Feet Calculator" },
        { key: "square-feet-cubic-yards", name: "Square Feet to Cubic Yards Calculator" },
        { key: "square-footage", name: "Square Footage Calculator" },
        { key: "square-inches", name: "Square Inches Calculator" },
        { key: "square-meters", name: "Square Meters Calculator" },
        { key: "square-yards", name: "Square Yards Calculator" },
        { key: "tank-volume", name: "Tank Volume Calculator" },
        { key: "inch-unit", name: "Inch – Unit of Measurement Definition" }
      ]
    },
    {
      title: "Plumbing & HVAC Calculators",
      icon: "fa-solid fa-wrench",
      calculators: [
        { key: "cfm", name: "CFM Calculator" },
        { key: "flow-rate", name: "Flow Rate Calculator" },
        { key: "furnace-btu", name: "Furnace BTU Calculator" },
        { key: "pipe-volume", name: "Pipe Volume Calculator" },
        { key: "refrigerant-line-charge", name: "Refrigerant Line Charge Calculator" },
        { key: "water-velocity", name: "Water Velocity Calculator" },
        { key: "window-ac-size", name: "Window Air Conditioner Size Calculator" }
      ]
    },
    {
      title: "Roofing Calculators",
      icon: "fa-solid fa-roof",
      calculators: [
        { key: "ice-water-shield", name: "Ice & Water Shield Calculator" },
        { key: "metal-roofing", name: "Metal Roofing Calculator" },
        { key: "plywood-sheathing", name: "Plywood Sheathing Calculator" },
        { key: "roof-pitch", name: "Roof Pitch Calculator" },
        { key: "roof-snow-load", name: "Roof Snow Load Calculator" },
        { key: "roofing-material", name: "Roofing Material Calculator" }
      ]
    },
    {
      title: "Siding Calculators",
      icon: "fa-solid fa-building",
      calculators: [
        { key: "board-batten-siding", name: "Board and Batten Siding Calculator" },
        { key: "brick", name: "Brick Calculator" },
        { key: "clapboard-lap-board", name: "Clapboard and Lap Board Siding Calculator" },
        { key: "siding-material", name: "Siding Material Calculator" },
        { key: "vinyl-siding", name: "Vinyl Siding Calculator" }
      ]
    },
    {
      title: "Wall & Ceiling Calculators",
      icon: "fa-solid fa-paint-roller",
      calculators: [
        { key: "drywall-area-sheets", name: "Drywall - Area & Sheets" },
        { key: "paint", name: "Paint Calculator" },
        { key: "wallpaper", name: "Wallpaper Calculator" }
      ]
    }
  ];

  const handleSubCategoryClick = (subCategory: any) => {
    const slug = subCategory.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    navigate(`/construction/${slug}`, { state: { subCategory } });
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
              Construction Calculators
            </h1>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Comprehensive construction calculators for building materials, measurements, costs, and project planning. From concrete and lumber to roofing and flooring calculations.
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
                    <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/20 group-hover:bg-primary/10 transition-colors">
                      <i className={`${subCategory.icon} text-orange-600 text-lg`}></i>
                    </div>
                    <span>{subCategory.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-muted-foreground text-sm mb-3">
                      {subCategory.calculators.length} calculators available
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

export default ConstructionCalculators;
