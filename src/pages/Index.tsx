import { useNavigate } from "react-router-dom";
import { lazy, Suspense, useState } from "react";
import logoImage from "@/assets/logo-skn.png";
import JsonLd from "@/components/seo/JsonLd";
import SEOHead from "@/components/SEOHead";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCategoryIcon } from "@/lib/navigation";
import { GlowCard } from "@/components/ui/spotlight-card";
import { Car, HardHat, RotateCcw, ChefHat, Zap, DollarSign, Heart, Calculator, Dog, Atom, Clock, Video, BookOpen, Lightbulb, Quote, Home, Dumbbell, Smile, Star, TrendingUp, ArrowLeft, QrCode, Moon, PieChart, Globe2, Search } from "lucide-react";
import { GlobalSearch } from "@/components/GlobalSearch";

const FeaturedCalculatorsSection = lazy(() => import("@/components/home/FeaturedCalculatorsSection"));
const AboutSection = lazy(() => import("@/components/home/AboutSection"));
const EmpowermentSection = lazy(() => import("@/components/home/EmpowermentSection"));
const CommitmentSection = lazy(() => import("@/components/home/CommitmentSection"));

const Index = () => {
  const navigate = useNavigate();
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);

  // Categories with detailed automotive and construction structures
  const categories = {
    automotive: {
      name: "Automotive Calculators",
      icon: Car,
      color: "text-blue-600",
      description: "We have automotive calculators and resources for engine performance tuning, day to day mechanics, and other vehicle applications. From estimating horsepower to estimating your monthly payment, we have the resources for you.",
      subCategories: [{
        title: "Engine & Horsepower Calculators",
        icon: "fa-solid fa-car-battery",
        calculators: [{
          key: "carburetor-cfm",
          name: "Carburetor CFM Calculator"
        }, {
          key: "lb-cc-converter",
          name: "Convert lb/hr to cc/min & cc/min to lb/hr"
        }, {
          key: "engine-compression",
          name: "Engine Compression Ratio Calculator"
        }, {
          key: "engine-displacement",
          name: "Engine Displacement Calculator"
        }, {
          key: "horsepower",
          name: "Engine Horsepower Calculator"
        }, {
          key: "engine-torque",
          name: "Engine Torque Calculator"
        }]
      }, {
        title: "Fuel & Fuel Economy Calculators",
        icon: "fa-solid fa-gas-pump",
        calculators: [{
          key: "ev-charging-cost",
          name: "Electric Vehicle Charging Cost Calculator"
        }, {
          key: "ev-charging-time",
          name: "Electric Vehicle Charging Time Calculator"
        }, {
          key: "ev-fuel-savings",
          name: "Electric Vehicle Fuel Savings Calculator"
        }, {
          key: "fuel-cost",
          name: "Fuel Cost Calculator"
        }, {
          key: "fuel-injector-flow",
          name: "Fuel Injector Flow Rate Calculator"
        }, {
          key: "fuel-savings",
          name: "Fuel Savings Calculator"
        }, {
          key: "gas-mileage",
          name: "Gas Mileage Calculator"
        }, {
          key: "km-per-liter",
          name: "Kilometers Per Liter Fuel Economy Calculator"
        }, {
          key: "liters-per-100km",
          name: "Liters Per 100 Kilometers Fuel Consumption Calculator"
        }]
      }, {
        title: "Unit Conversion Calculators",
        icon: "fa-solid fa-arrows-left-right-to-line",
        calculators: [{
          key: "ev-efficiency",
          name: "Electric Car Efficiency Unit Conversions"
        }, {
          key: "fuel-economy-unit",
          name: "Fuel Economy Unit Conversions"
        }, {
          key: "sae-metric",
          name: "SAE to Metric Calculator & Metric to Standard"
        }, {
          key: "speed-unit",
          name: "Speed Unit Conversions"
        }, {
          key: "torque-unit",
          name: "Torque Unit Conversions"
        }]
      }, {
        title: "Vehicle Loan Calculators",
        icon: "fa-solid fa-sack-dollar",
        calculators: [{
          key: "atv-loan",
          name: "ATV Loan Calculator"
        }, {
          key: "auto-loan",
          name: "Auto Loan Calculator"
        }, {
          key: "boat-loan",
          name: "Boat Loan Calculator"
        }, {
          key: "car-lease",
          name: "Car Lease Calculator"
        }, {
          key: "lease-vs-buy",
          name: "Lease vs. Buy Car Calculator"
        }, {
          key: "motorcycle-loan",
          name: "Motorcycle Loan Calculator"
        }, {
          key: "rv-loan",
          name: "RV Loan Calculator"
        }]
      }, {
        title: "Wheels & Tires Calculators",
        icon: "fa-solid fa-fan",
        calculators: [{
          key: "speedometer-error",
          name: "Speedometer Error Calculator"
        }, {
          key: "speedometer-gear",
          name: "Speedometer Gear Calculator"
        }, {
          key: "tire-size",
          name: "Tire Size Calculator"
        }, {
          key: "tire-size-comparison",
          name: "Tire Size Comparison Calculator"
        }, {
          key: "tire-size-conversion",
          name: "Tire Size Conversion Calculator"
        }, {
          key: "wheel-offset",
          name: "Wheel Offset Calculator"
        }]
      }]
    },
    construction: {
      name: "Construction Calculators",
      icon: HardHat,
      color: "text-yellow-600",
      description: "Comprehensive construction calculators for building materials, measurements, costs, and project planning. From concrete and lumber to roofing and flooring calculations.",
      subCategories: [{
        title: "Carpentry & Trim Calculators",
        icon: "fa-solid fa-hammer",
        calculators: [{
          key: "board-batten-layout",
          name: "Board and Batten Layout Calculator"
        }, {
          key: "board-foot",
          name: "Board Foot Calculator"
        }, {
          key: "framing",
          name: "Framing Calculator"
        }, {
          key: "lumber-hardwood-weight",
          name: "Lumber and Hardwood Weight Calculator"
        }, {
          key: "plywood",
          name: "Plywood Calculator"
        }, {
          key: "rafter-length",
          name: "Rafter Length Calculator"
        }, {
          key: "raised-panel-cabinet",
          name: "Raised Panel Cabinet Door Calculator"
        }, {
          key: "trim-molding",
          name: "Trim and Molding Calculator"
        }, {
          key: "wainscoting-layout",
          name: "Wainscoting Layout Calculator"
        }]
      }, {
        title: "Concrete & Masonry Calculators",
        icon: "fa-solid fa-cubes",
        calculators: [{
          key: "block-mortar",
          name: "Block Mortar Calculator"
        }, {
          key: "concrete-block",
          name: "Concrete Block Calculator"
        }, {
          key: "concrete-block-fill",
          name: "Concrete Block Fill Calculator"
        }, {
          key: "concrete",
          name: "Concrete Calculator"
        }, {
          key: "concrete-footing",
          name: "Concrete Footing Calculator"
        }, {
          key: "concrete-mix",
          name: "Concrete Mix Calculator"
        }, {
          key: "concrete-reinforcing-mesh",
          name: "Concrete Reinforcing Mesh Calculator"
        }, {
          key: "concrete-steps",
          name: "Concrete Steps Calculator"
        }, {
          key: "concrete-weight",
          name: "Concrete Weight Calculator"
        }, {
          key: "rebar-material",
          name: "Rebar Material Calculator"
        }, {
          key: "rebar-weight-size",
          name: "Rebar Weight and Size Calculator"
        }]
      }, {
        title: "Deck & Patio Calculators",
        icon: "fa-solid fa-square",
        calculators: [{
          key: "baluster",
          name: "Baluster Calculator"
        }, {
          key: "deck-board-material",
          name: "Deck Board Material Calculator"
        }, {
          key: "deck-stain",
          name: "Deck Stain Calculator"
        }, {
          key: "paver-base",
          name: "Paver Base Calculator"
        }, {
          key: "paver",
          name: "Paver Calculator and Price Estimator"
        }, {
          key: "polymeric-sand",
          name: "Polymeric Sand Calculator"
        }]
      }, {
        title: "Driveway Calculators",
        icon: "fa-solid fa-road",
        calculators: [{
          key: "asphalt",
          name: "Asphalt Calculator"
        }, {
          key: "asphalt-sealer",
          name: "Asphalt Sealer Calculator"
        }, {
          key: "concrete-driveway",
          name: "Concrete Driveway Calculator"
        }, {
          key: "gravel-driveway",
          name: "Gravel Driveway Calculator"
        }]
      }, {
        title: "Fence Calculators",
        icon: "fa-solid fa-fence",
        calculators: [{
          key: "fence",
          name: "Fence Calculator"
        }, {
          key: "fence-stain",
          name: "Fence Stain Calculator"
        }, {
          key: "post-hole-concrete",
          name: "Post Hole Concrete Calculator"
        }, {
          key: "vinyl-fence",
          name: "Vinyl Fence Calculator"
        }]
      }, {
        title: "Flooring Calculators",
        icon: "fa-solid fa-layer-group",
        calculators: [{
          key: "carpet",
          name: "Carpet Calculator and Price Estimator"
        }, {
          key: "flooring",
          name: "Flooring Calculator"
        }, {
          key: "linear-feet-square-feet",
          name: "Linear Feet to Square Feet Calculator"
        }, {
          key: "tile",
          name: "Tile Calculator and Cost Estimator"
        }]
      }, {
        title: "Lawn & Landscaping Calculators",
        icon: "fa-solid fa-seedling",
        calculators: [{
          key: "acreage",
          name: "Acreage Calculator"
        }, {
          key: "elevation-grade",
          name: "Elevation Grade Calculator"
        }, {
          key: "grass-seed",
          name: "Grass Seed Calculator"
        }, {
          key: "gravel",
          name: "Gravel Calculator"
        }, {
          key: "lawn-mowing",
          name: "Lawn Mowing Calculator"
        }, {
          key: "mulch",
          name: "Mulch Calculator"
        }, {
          key: "plant-flower",
          name: "Plant and Flower Calculator"
        }, {
          key: "pool-volume",
          name: "Pool Volume Calculator"
        }, {
          key: "retaining-wall",
          name: "Retaining Wall Calculator"
        }, {
          key: "sand",
          name: "Sand Calculator"
        }, {
          key: "sod",
          name: "Sod Calculator"
        }, {
          key: "sod-weight",
          name: "Sod Weight Calculator"
        }, {
          key: "soil",
          name: "Soil Calculator"
        }, {
          key: "stone",
          name: "Stone Calculator"
        }]
      }, {
        title: "Measurement Calculators",
        icon: "fa-solid fa-ruler",
        calculators: [{
          key: "cubic-feet",
          name: "Cubic Feet Calculator"
        }, {
          key: "cubic-inches",
          name: "Cubic Inches Calculator"
        }, {
          key: "cubic-meters",
          name: "Cubic Meters Calculator"
        }, {
          key: "cubic-yards",
          name: "Cubic Yards Calculator"
        }, {
          key: "cylinder-cubic-footage",
          name: "Cylinder Cubic Footage Calculator"
        }, {
          key: "cylinder-cubic-yardage",
          name: "Cylinder Cubic Yardage Calculator"
        }, {
          key: "feet-inches-length",
          name: "Feet and Inches Length Calculator"
        }, {
          key: "inch-fraction",
          name: "Inch Fraction Calculator"
        }, {
          key: "scale-conversion",
          name: "Scale Conversion Calculator"
        }, {
          key: "square-feet-cubic-feet",
          name: "Square Feet to Cubic Feet Calculator"
        }, {
          key: "square-feet-cubic-yards",
          name: "Square Feet to Cubic Yards Calculator"
        }, {
          key: "square-footage",
          name: "Square Footage Calculator"
        }, {
          key: "square-inches",
          name: "Square Inches Calculator"
        }, {
          key: "square-meters",
          name: "Square Meters Calculator"
        }, {
          key: "square-yards",
          name: "Square Yards Calculator"
        }, {
          key: "tank-volume",
          name: "Tank Volume Calculator"
        }, {
          key: "inch-unit",
          name: "Inch – Unit of Measurement Definition"
        }]
      }, {
        title: "Plumbing & HVAC Calculators",
        icon: "fa-solid fa-wrench",
        calculators: [{
          key: "cfm",
          name: "CFM Calculator"
        }, {
          key: "flow-rate",
          name: "Flow Rate Calculator"
        }, {
          key: "furnace-btu",
          name: "Furnace BTU Calculator"
        }, {
          key: "pipe-volume",
          name: "Pipe Volume Calculator"
        }, {
          key: "refrigerant-line-charge",
          name: "Refrigerant Line Charge Calculator"
        }, {
          key: "water-velocity",
          name: "Water Velocity Calculator"
        }, {
          key: "window-ac-size",
          name: "Window Air Conditioner Size Calculator"
        }]
      }, {
        title: "Roofing Calculators",
        icon: "fa-solid fa-roof",
        calculators: [{
          key: "ice-water-shield",
          name: "Ice & Water Shield Calculator"
        }, {
          key: "metal-roofing",
          name: "Metal Roofing Calculator"
        }, {
          key: "plywood-sheathing",
          name: "Plywood Sheathing Calculator"
        }, {
          key: "roof-pitch",
          name: "Roof Pitch Calculator"
        }, {
          key: "roof-snow-load",
          name: "Roof Snow Load Calculator"
        }, {
          key: "roofing-material",
          name: "Roofing Material Calculator"
        }]
      }, {
        title: "Siding Calculators",
        icon: "fa-solid fa-building",
        calculators: [{
          key: "board-batten-siding",
          name: "Board and Batten Siding Calculator"
        }, {
          key: "brick",
          name: "Brick Calculator"
        }, {
          key: "clapboard-lap-board",
          name: "Clapboard and Lap Board Siding Calculator"
        }, {
          key: "siding-material",
          name: "Siding Material Calculator"
        }, {
          key: "vinyl-siding",
          name: "Vinyl Siding Calculator"
        }]
      }, {
        title: "Wall & Ceiling Calculators",
        icon: "fa-solid fa-paint-roller",
        calculators: [{
          key: "drywall",
          name: "Drywall Calculator"
        }, {
          key: "paint",
          name: "Paint Calculator"
        }, {
          key: "wallpaper",
          name: "Wallpaper Calculator"
        }]
      }]
    },
    conversion: {
      name: "Conversion Calculators",
      icon: RotateCcw,
      color: "text-green-600",
      description: "Unit conversion is the process of converting a measurement from one unit to another, for instance, converting your height from inches to centimeters. Convert nearly any measurement using one of the conversion calculators below.",
      subCategories: [{
        title: "Commonly Used Converters",
        icon: "fa-solid fa-arrows-rotate",
        calculators: [{
          key: "conversion-calculator",
          name: "Conversion Calculator"
        }, {
          key: "angle-conversion",
          name: "Angle Conversion"
        }, {
          key: "area-conversion",
          name: "Area Conversion"
        }, {
          key: "length-conversion",
          name: "Length Conversion"
        }, {
          key: "pressure-conversion",
          name: "Pressure Conversion"
        }, {
          key: "speed-conversion",
          name: "Speed Conversion"
        }, {
          key: "temperature-conversion",
          name: "Temperature Conversion"
        }, {
          key: "time-conversion",
          name: "Time Conversion"
        }, {
          key: "volume-conversion",
          name: "Volume Conversion"
        }, {
          key: "weight-conversion",
          name: "Weight Conversion"
        }]
      }, {
        title: "Cooking & Baking Converters",
        icon: "fa-solid fa-utensils",
        calculators: [{
          key: "cooking-ingredient-conversion",
          name: "Cooking Ingredient Conversion"
        }, {
          key: "beer-conversion",
          name: "Beer Conversion"
        }, {
          key: "butter-conversion",
          name: "Butter Conversion"
        }, {
          key: "flour-conversion",
          name: "Flour Conversion"
        }, {
          key: "salt-conversion",
          name: "Salt Conversion"
        }, {
          key: "sugar-conversion",
          name: "Sugar Conversion"
        }]
      }, {
        title: "Electrical Converters",
        icon: "fa-solid fa-bolt",
        calculators: [{
          key: "capacitance-conversion",
          name: "Capacitance Conversion"
        }, {
          key: "electric-charge-conversion",
          name: "Electric Charge Conversion"
        }, {
          key: "electric-current-conversion",
          name: "Electric Current Conversion"
        }, {
          key: "electrical-conductance-conversion",
          name: "Electrical Conductance Conversion"
        }, {
          key: "electrical-inductance-conversion",
          name: "Electrical Inductance Conversion"
        }, {
          key: "electrical-resistance-conversion",
          name: "Electrical Resistance Conversion"
        }, {
          key: "energy-conversion",
          name: "Energy Conversion"
        }, {
          key: "mixed-electrical-unit-conversion",
          name: "Mixed Electrical Unit Conversion"
        }, {
          key: "power-conversion",
          name: "Power Conversion"
        }, {
          key: "voltage-conversion",
          name: "Voltage Conversion"
        }]
      }, {
        title: "More Converters",
        icon: "fa-solid fa-plus",
        calculators: [{
          key: "data-storage-conversion",
          name: "Data Storage Conversion"
        }, {
          key: "data-transfer-conversion",
          name: "Data Transfer Conversion"
        }, {
          key: "electric-car-efficiency-conversion",
          name: "Electric Car Efficiency Conversion"
        }, {
          key: "force-conversion",
          name: "Force Conversion"
        }, {
          key: "frequency-conversion",
          name: "Frequency Conversion"
        }, {
          key: "fuel-economy-conversion",
          name: "Fuel Economy Conversion"
        }, {
          key: "number-system-conversion",
          name: "Number System Conversion"
        }, {
          key: "torque-conversion",
          name: "Torque Conversion"
        }]
      }]
    },
    cooking: {
      name: "Cooking Calculators",
      icon: ChefHat,
      color: "text-red-600",
      description: "Our cooking and baking calculators and resources help you prepare the perfect dish by simplifying recipes and converting ingredients from one measurement to another.",
      subCategories: [{
        title: "Cooking & Baking Calculators",
        icon: "fa-solid fa-utensils",
        calculators: [{
          key: "cake",
          name: "Cake Calculator"
        }, {
          key: "cooking-conversion",
          name: "Cooking Conversion Calculator"
        }, {
          key: "ham-cooking-time",
          name: "Ham Cooking Time Calculator"
        }, {
          key: "ham-size",
          name: "Ham Size Calculator"
        }, {
          key: "milk-weight",
          name: "Milk Weight Calculator"
        }, {
          key: "oven-temperature-conversion",
          name: "Oven Temperature Conversion Calculator & Chart"
        }, {
          key: "oven-air-fryer-conversion",
          name: "Oven to Air Fryer Conversion Calculator"
        }, {
          key: "pizza",
          name: "Pizza Calculator"
        }, {
          key: "recipe-scale-conversion",
          name: "Recipe Scale Conversion Calculator"
        }, {
          key: "timer",
          name: "Timer"
        }, {
          key: "turkey-cooking-time",
          name: "Turkey Cooking Time Calculator"
        }, {
          key: "turkey-size",
          name: "Turkey Size Calculator"
        }, {
          key: "turkey-thawing-time",
          name: "Turkey Thawing Time Calculator"
        }]
      }, {
        title: "Cooking Measurements",
        icon: "fa-solid fa-measuring-cup",
        calculators: [{
          key: "ounces-half-cup",
          name: "How Many Ounces In 1/2 Cup?"
        }, {
          key: "ounces-third-cup",
          name: "How Many Ounces In 1/3 Cup?"
        }, {
          key: "ounces-quarter-cup",
          name: "How Many Ounces In 1/4 Cup?"
        }, {
          key: "ounces-cup",
          name: "How Many Ounces In a Cup?"
        }, {
          key: "tablespoons-cup",
          name: "How Many Tablespoons In 1 Cup?"
        }, {
          key: "tablespoons-half-cup",
          name: "How Many Tablespoons In 1/2 Cup?"
        }, {
          key: "tablespoons-third-cup",
          name: "How Many Tablespoons In 1/3 Cup?"
        }, {
          key: "tablespoons-quarter-cup",
          name: "How Many Tablespoons In 1/4 Cup?"
        }, {
          key: "tablespoons-eighth-cup",
          name: "How Many Tablespoons In 1/8 Cup?"
        }, {
          key: "tablespoons-two-thirds-cup",
          name: "How Many Tablespoons In 2/3 Cup?"
        }, {
          key: "tablespoons-three-quarters-cup",
          name: "How Many Tablespoons In 3/4 Cup?"
        }, {
          key: "teaspoons-third-cup",
          name: "How Many Teaspoons In 1/3 Cup?"
        }, {
          key: "teaspoons-quarter-cup",
          name: "How Many Teaspoons In 1/4 Cup?"
        }, {
          key: "teaspoons-eighth-cup",
          name: "How Many Teaspoons In 1/8 Cup?"
        }, {
          key: "teaspoons-tablespoon",
          name: "How Many Teaspoons In a Tablespoon?"
        }, {
          key: "teaspoons-half-tablespoon",
          name: "How Many Teaspoons In Half a Tablespoon?"
        }]
      }, {
        title: "Unit Conversion Calculators",
        icon: "fa-solid fa-arrows-rotate",
        calculators: [{
          key: "beer-volume-conversions",
          name: "Beer Volume Conversions"
        }, {
          key: "butter-unit-conversions",
          name: "Butter Unit Conversions"
        }, {
          key: "cups-to-grams",
          name: "Cups to Grams Converter"
        }, {
          key: "cups-to-ml",
          name: "Cups to mL Converter"
        }, {
          key: "cups-to-tablespoons",
          name: "Cups to Tablespoons Converter"
        }, {
          key: "flour-volume-weight",
          name: "Flour Volume & Weight Conversions"
        }, {
          key: "grams-to-cups",
          name: "Grams to Cups Converter"
        }, {
          key: "grams-to-ml",
          name: "Grams to mL Converter"
        }, {
          key: "grams-to-ounces",
          name: "Grams to Ounces Converter"
        }, {
          key: "grams-to-tablespoons",
          name: "Grams to Tablespoons Converter"
        }, {
          key: "grams-to-teaspoons",
          name: "Grams to Teaspoons Converter"
        }, {
          key: "mg-to-ml",
          name: "mg to mL Converter"
        }, {
          key: "ml-to-grams",
          name: "mL to Grams Converter"
        }, {
          key: "ml-to-mg",
          name: "mL to mg Converter"
        }, {
          key: "ounces-to-grams",
          name: "Ounces to Grams Converter"
        }, {
          key: "salt-volume-weight",
          name: "Salt Volume & Weight Conversions"
        }, {
          key: "sugar-volume-weight",
          name: "Sugar Volume & Weight Conversions"
        }, {
          key: "tablespoons-to-cups",
          name: "Tablespoons to Cups Converter"
        }, {
          key: "tablespoons-to-grams",
          name: "Tablespoons to Grams Converter"
        }, {
          key: "teaspoons-to-grams",
          name: "Teaspoons to Grams Converter"
        }, {
          key: "volume-unit-conversions",
          name: "Volume Unit Conversions"
        }, {
          key: "weight-unit-conversions",
          name: "Weight Unit Conversions"
        }]
      }]
    },
    electrical: {
      name: "Electrical Calculators",
      icon: Zap,
      color: "text-yellow-600",
      description: "Our electrical calculators convert between different electrical units of power, current, frequency, and more, help estimate the electrical usage and cost of lighting and household appliances, estimate wire sizes for electrical project work, estimate circuit components, and perform physics calculations.",
      subCategories: [{
        title: "Electrical Conversion Calculators",
        icon: "fa-solid fa-bolt",
        calculators: [{
          key: "amp-hours-to-kwh",
          name: "Amp-Hours (Ah) to Kilowatt-Hours (kWh) Conversion Calculator"
        }, {
          key: "amp-hours-to-wh",
          name: "Amp-Hours (Ah) to Watt-Hours (Wh) Conversion Calculator"
        }, {
          key: "amps-to-horsepower",
          name: "Amps to Horsepower Calculator"
        }, {
          key: "amps-to-kva",
          name: "Amps to Kilovolt-Amps (kVA) Conversion Calculator"
        }, {
          key: "amps-to-kw",
          name: "Amps to Kilowatts (kW) Conversion Calculator"
        }, {
          key: "amps-to-va",
          name: "Amps to Volt-Amps (VA) Conversion Calculator"
        }, {
          key: "amps-to-volts",
          name: "Amps to Volts Conversion Calculator"
        }, {
          key: "amps-to-watts",
          name: "Amps to Watts Conversion Calculator"
        }, {
          key: "capacitance-to-charge",
          name: "Capacitance to Charge Conversion Calculator"
        }, {
          key: "horsepower-to-amps",
          name: "Horsepower to Amps Calculator"
        }, {
          key: "horsepower-to-kva",
          name: "Horsepower to Kilovolt-Amps (kVA) Conversion Calculator"
        }, {
          key: "joules-to-volts",
          name: "Joules to Volts Conversion Calculator"
        }, {
          key: "joules-to-watts",
          name: "Joules to Watts Conversion Calculator"
        }, {
          key: "kva-to-amps",
          name: "Kilovolt-Amps (kVA) to Amps Conversion Calculator"
        }, {
          key: "kva-to-horsepower",
          name: "Kilovolt-Amps (kVA) to Horsepower Conversion Calculator"
        }, {
          key: "kva-to-kw",
          name: "Kilovolt-Amps (kVA) to Kilowatts (kW) Conversion Calculator"
        }, {
          key: "kva-to-va",
          name: "Kilovolt-Amps (kVA) to Volt-Amps (VA) Conversion Calculator"
        }, {
          key: "kva-to-watts",
          name: "Kilovolt-Amps (kVA) to Watts Conversion Calculator"
        }, {
          key: "kwh-to-ah",
          name: "Kilowatt-Hours (kWh) to Amp-Hours (Ah) Conversion Calculator"
        }, {
          key: "kwh-to-kw",
          name: "Kilowatt-Hours (kWh) to Kilowatts (kW) Conversion Calculator"
        }, {
          key: "kwh-to-watts",
          name: "Kilowatt-Hours (kWh) to Watts Conversion Calculator"
        }, {
          key: "kw-to-amps",
          name: "Kilowatts (kW) to Amps Conversion Calculator"
        }, {
          key: "kw-to-kva",
          name: "Kilowatts (kW) to Kilovolt-Amps (kVA) Conversion Calculator"
        }, {
          key: "kw-to-kwh",
          name: "Kilowatts (kW) to Kilowatt-Hours (kWh) Conversion Calculator"
        }, {
          key: "kw-to-va",
          name: "Kilowatts (kW) to Volt-Amps (VA) Conversion Calculator"
        }, {
          key: "mah-to-wh",
          name: "Milliamp-Hours (mAh) to Watt-Hours (Wh) Conversion Calculator"
        }, {
          key: "va-to-amps",
          name: "Volt-amps (VA) to Amps Conversion Calculator"
        }, {
          key: "va-to-kva",
          name: "Volt-Amps (VA) to Kilovolt-Amps (kVA) Conversion Calculator"
        }, {
          key: "va-to-kw",
          name: "Volt-amps (VA) to Kilowatts (kW) Conversion Calculator"
        }, {
          key: "volts-to-amps",
          name: "Volts to Amps Conversion Calculator"
        }, {
          key: "volts-to-joules",
          name: "Volts to Joules Conversion Calculator"
        }, {
          key: "volts-to-watts",
          name: "Volts to Watts Conversion Calculator"
        }, {
          key: "wh-to-ah",
          name: "Watt-Hours (Wh) to Amp-Hours (Ah) Conversion Calculator"
        }, {
          key: "wh-to-mah",
          name: "Watt-Hours (Wh) to Milliamp-Hours (mAh) Conversion Calculator"
        }, {
          key: "watts-to-amps",
          name: "Watts to Amps Conversion Calculator"
        }, {
          key: "watts-to-joules",
          name: "Watts to Joules Conversion Calculator"
        }, {
          key: "watts-to-kva",
          name: "Watts to Kilovolt-Amps (kVA) Conversion Calculator"
        }, {
          key: "watts-to-kwh",
          name: "Watts to Kilowatt-Hours (kWh) Conversion Calculator"
        }, {
          key: "watts-to-volts",
          name: "Watts to Volts Conversion Calculator"
        }]
      }, {
        title: "Electrical Calculators",
        icon: "fa-solid fa-calculator",
        calculators: [{
          key: "electricity-cost-2025",
          name: "2025 Electricity Cost Calculator"
        }, {
          key: "lighting-energy-cost-2025",
          name: "2025 Lighting Energy Cost Calculator"
        }, {
          key: "capacitance",
          name: "Capacitance Calculator"
        }, {
          key: "coulombs-law-charge",
          name: "Coulomb's Law Charge Calculator"
        }, {
          key: "current",
          name: "Current Calculator"
        }, {
          key: "led-resistor",
          name: "LED Resistor Calculator"
        }, {
          key: "ohms-law",
          name: "Ohm's Law Calculator"
        }, {
          key: "parallel-plate-capacitance",
          name: "Parallel Plate Capacitance Calculator"
        }, {
          key: "parallel-resistor",
          name: "Parallel Resistor Calculator"
        }, {
          key: "peak-voltage",
          name: "Peak Voltage Calculator"
        }, {
          key: "peak-to-peak-voltage",
          name: "Peak-to-Peak Voltage Calculator"
        }, {
          key: "power-factor",
          name: "Power Factor Calculator"
        }, {
          key: "resistance",
          name: "Resistance Calculator"
        }, {
          key: "resistor-capacitor-circuit",
          name: "Resistor Capacitor Circuit Calculator"
        }, {
          key: "rlc-impedance",
          name: "RLC Impedance Calculator"
        }, {
          key: "rms-voltage",
          name: "RMS Voltage Calculator"
        }, {
          key: "series-parallel-capacitor",
          name: "Series and Parallel Capacitor Calculator"
        }, {
          key: "series-resistor",
          name: "Series Resistor Calculator"
        }, {
          key: "voltage",
          name: "Voltage Calculator"
        }, {
          key: "voltage-divider",
          name: "Voltage Divider Calculator"
        }, {
          key: "voltage-drop",
          name: "Voltage Drop Calculator"
        }, {
          key: "wattage",
          name: "Wattage Calculator"
        }, {
          key: "wire-ampacity",
          name: "Wire Ampacity Calculator"
        }, {
          key: "wire-size",
          name: "Wire Size Calculator"
        }]
      },
      {
        title: "Featured Calculators",
        icon: "fa-solid fa-utensils",
        calculators: [{
          key: "cake",
          name: "Cake Calculator"
        }, {
          key: "cooking-conversion",
          name: "Cooking Conversion Calculator"
        }, {
          key: "ham-cooking-time",
          name: "Ham Cooking Time Calculator"
        }, {
          key: "ham-size",
          name: "Ham Size Calculator"
        }, {
          key: "milk-weight",
          name: "Milk Weight Calculator"
        }, {
          key: "oven-temperature-conversion",
          name: "Oven Temperature Conversion Calculator & Chart"
        }, {
          key: "oven-air-fryer-conversion",
          name: "Oven to Air Fryer Conversion Calculator"
        }, {
          key: "pizza",
          name: "Pizza Calculator"
        }, {
          key: "recipe-scale-conversion",
          name: "Recipe Scale Conversion Calculator"
        }, {
          key: "timer",
          name: "Timer"
        }, {
          key: "turkey-cooking-time",
          name: "Turkey Cooking Time Calculator"
        }, {
          key: "turkey-size",
          name: "Turkey Size Calculator"
        }, {
          key: "turkey-thawing-time",
          name: "Turkey Thawing Time Calculator"
        }]
      }, {
        title: "Cooking Measurements",
        icon: "fa-solid fa-measuring-cup",
        calculators: [{
          key: "ounces-half-cup",
          name: "How Many Ounces In 1/2 Cup?"
        }, {
          key: "ounces-third-cup",
          name: "How Many Ounces In 1/3 Cup?"
        }, {
          key: "ounces-quarter-cup",
          name: "How Many Ounces In 1/4 Cup?"
        }, {
          key: "ounces-cup",
          name: "How Many Ounces In a Cup?"
        }, {
          key: "tablespoons-cup",
          name: "How Many Tablespoons In 1 Cup?"
        }, {
          key: "tablespoons-half-cup",
          name: "How Many Tablespoons In 1/2 Cup?"
        }, {
          key: "tablespoons-third-cup",
          name: "How Many Tablespoons In 1/3 Cup?"
        }, {
          key: "tablespoons-quarter-cup",
          name: "How Many Tablespoons In 1/4 Cup?"
        }, {
          key: "tablespoons-eighth-cup",
          name: "How Many Tablespoons In 1/8 Cup?"
        }, {
          key: "tablespoons-two-thirds-cup",
          name: "How Many Tablespoons In 2/3 Cup?"
        }, {
          key: "tablespoons-three-quarters-cup",
          name: "How Many Tablespoons In 3/4 Cup?"
        }, {
          key: "teaspoons-third-cup",
          name: "How Many Teaspoons In 1/3 Cup?"
        }, {
          key: "teaspoons-quarter-cup",
          name: "How Many Teaspoons In 1/4 Cup?"
        }, {
          key: "teaspoons-eighth-cup",
          name: "How Many Teaspoons In 1/8 Cup?"
        }, {
          key: "teaspoons-tablespoon",
          name: "How Many Teaspoons In a Tablespoon?"
        }, {
          key: "teaspoons-half-tablespoon",
          name: "How Many Teaspoons In Half a Tablespoon?"
        }]
      }, {
        title: "Unit Conversion Calculators",
        icon: "fa-solid fa-arrows-rotate",
        calculators: [{
          key: "beer-volume-conversions",
          name: "Beer Volume Conversions"
        }, {
          key: "butter-unit-conversions",
          name: "Butter Unit Conversions"
        }, {
          key: "cups-to-grams",
          name: "Cups to Grams Converter"
        }, {
          key: "cups-to-ml",
          name: "Cups to mL Converter"
        }, {
          key: "cups-to-tablespoons",
          name: "Cups to Tablespoons Converter"
        }, {
          key: "flour-volume-weight",
          name: "Flour Volume & Weight Conversions"
        }, {
          key: "grams-to-cups",
          name: "Grams to Cups Converter"
        }, {
          key: "grams-to-ml",
          name: "Grams to mL Converter"
        }, {
          key: "grams-to-ounces",
          name: "Grams to Ounces Converter"
        }, {
          key: "grams-to-tablespoons",
          name: "Grams to Tablespoons Converter"
        }, {
          key: "grams-to-teaspoons",
          name: "Grams to Teaspoons Converter"
        }, {
          key: "mg-to-ml",
          name: "mg to mL Converter"
        }, {
          key: "ml-to-grams",
          name: "mL to Grams Converter"
        }, {
          key: "ml-to-mg",
          name: "mL to mg Converter"
        }, {
          key: "ounces-to-grams",
          name: "Ounces to Grams Converter"
        }, {
          key: "salt-volume-weight",
          name: "Salt Volume & Weight Conversions"
        }, {
          key: "sugar-volume-weight",
          name: "Sugar Volume & Weight Conversions"
        }, {
          key: "tablespoons-to-cups",
          name: "Tablespoons to Cups Converter"
        }, {
          key: "tablespoons-to-grams",
          name: "Tablespoons to Grams Converter"
        }, {
          key: "teaspoons-to-grams",
          name: "Teaspoons to Grams Converter"
        }, {
          key: "volume-unit-conversions",
          name: "Volume Unit Conversions"
        }, {
          key: "weight-unit-conversions",
          name: "Weight Unit Conversions"
        }]
      }]
    },
    financial: {
      name: "Financial Calculators",
      icon: DollarSign,
      color: "text-purple-600",
      description: "Use one of our financial calculators to plan investments, calculate interest, or estimate savings on a purchase. Each calculator includes a wealth of financial information about the topic, along with the process and formulas to do the calculation.",
      subCategories: [{
        title: "Business Finance Calculators",
        icon: "fa-solid fa-briefcase",
        calculators: [{
          key: "appreciation",
          name: "Appreciation Calculator"
        }, {
          key: "cagr",
          name: "CAGR Calculator"
        }, {
          key: "commission",
          name: "Commission Calculator"
        }, {
          key: "roi",
          name: "ROI Calculator"
        }, {
          key: "margin",
          name: "Margin Calculator"
        }, {
          key: "markup",
          name: "Markup Calculator"
        }]
      }, {
        title: "Interest and Loan Calculators",
        icon: "fa-solid fa-percent",
        calculators: [{
          key: "compound-interest",
          name: "Compound Interest Calculator"
        }, {
          key: "loan-payment",
          name: "Loan Payment Calculator"
        }, {
          key: "mortgage-payoff",
          name: "Mortgage Calculator"
        }, {
          key: "simple-interest",
          name: "Simple Interest Calculator"
        }, {
          key: "future-value",
          name: "Future Value Calculator"
        }, {
          key: "present-value",
          name: "Present Value Calculator"
        }]
      }, {
        title: "Personal Finance Calculators",
        icon: "fa-solid fa-wallet",
        calculators: [{
          key: "tip",
          name: "Tip Calculator"
        }, {
          key: "discount",
          name: "Discount Calculator"
        }, {
          key: "salary-to-hourly",
          name: "Salary to Hourly Calculator"
        }, {
          key: "hourly-to-salary",
          name: "Hourly to Salary Calculator"
        }, {
          key: "overtime",
          name: "Overtime Calculator"
        }, {
          key: "net-worth",
          name: "Net Worth Calculator"
        }]
      }]
    },
    health: {
      name: "Health & Fitness Calculators",
      icon: Heart,
      color: "text-green-600",
      description: "Use our health and fitness calculators for measurements and conversions for various exercise, fitness, nutritional, dietary, and body measurement applications.",
      subCategories: [{
        title: "Body Measurement Calculators",
        icon: "fa-solid fa-user",
        calculators: [{
          key: "bmi",
          name: "BMI Calculator"
        }, {
          key: "body-fat",
          name: "Body Fat Calculator"
        }, {
          key: "ideal-body-weight",
          name: "Ideal Body Weight Calculator"
        }, {
          key: "lean-body-mass",
          name: "Lean Body Mass Calculator"
        }, {
          key: "waist-to-hip-ratio",
          name: "Waist-to-Hip Ratio Calculator"
        }, {
          key: "height-converter",
          name: "Height Converter"
        }]
      }, {
        title: "Dietary and Nutrition Calculators",
        icon: "fa-solid fa-apple-whole",
        calculators: [{
          key: "bmr",
          name: "BMR Calculator"
        }, {
          key: "tdee",
          name: "TDEE Calculator"
        }, {
          key: "calorie-intake",
          name: "Calorie Intake Calculator"
        }, {
          key: "macro",
          name: "Macro Calculator"
        }, {
          key: "water-intake",
          name: "Water Intake Calculator"
        }, {
          key: "protein-intake",
          name: "Protein Intake Calculator"
        }]
      }, {
        title: "Fitness Calculators",
        icon: "fa-solid fa-dumbbell",
        calculators: [{
          key: "calories-burned",
          name: "Calories Burned Calculator"
        }, {
          key: "one-rep-max",
          name: "One-Rep Max Calculator"
        }, {
          key: "target-heart-rate",
          name: "Target Heart Rate Calculator"
        }, {
          key: "steps-to-calories",
          name: "Steps to Calories Calculator"
        }, {
          key: "pace-distance",
          name: "Pace and Distance Calculator"
        }, {
          key: "bench-press",
          name: "Bench Press Calculator"
        }]
      }]
    }
  };

  // Calculator Categories Data (ordered by popularity - most popular first)
  const calculatorCategories = [
    { ...categories.financial, key: "financial" },
    { ...categories.health, key: "health" },
    { ...categories.cooking, key: "cooking" },
    { ...categories.conversion, key: "conversion" },
    {
      key: "math",
      name: "Math & Algebra Calculators",
      icon: Calculator,
      color: "text-purple-600",
      description: "Mathematical calculations from basic arithmetic to advanced algebra, geometry, statistics, and trigonometry."
    }, {
      key: "pet",
      name: "Pet Care Calculators",
      icon: Dog,
      color: "text-amber-600",
      description: "Pet health, nutrition, and care calculators for dogs, cats, and aquariums."
    }, {
      key: "science",
      name: "Science Calculators",
      icon: Atom,
      color: "text-cyan-600",
      description: "Chemistry, physics, and density calculations for scientific applications."
    }, {
      key: "time",
      name: "Time & Date Calculators",
      icon: Clock,
      color: "text-indigo-600",
      description: "Age calculations, countdowns, date arithmetic, and time conversions."
    }, {
      key: "video",
      name: "Video Calculators",
      icon: Video,
      color: "text-violet-600",
      path: "/video",
      description: "Optimize your home theater setup: find ideal TV viewing distance, screen size, and speaker placement for immersive video experiences."

    }, {
      key: "tips",
      name: "Smart Tips",
      icon: Lightbulb,
      color: "text-yellow-500",
      path: "/smart-tips",
      description: "Actionable life hacks and practical guidance, from home organization and cleaning to travel planning and more."
    }, {
      key: "quotes",
      name: "Daily Quotes",
      icon: Quote,
      color: "text-slate-600",
      path: "/daily-quotes",
      description: "Inspirational and motivational quotes to brighten your day and spark a positive mindset."
    }, {
      key: "everyday",
      name: "Every day Life Calculators",
      icon: Home,
      color: "text-blue-500",
      path: "/everyday",
      description: "Handy everyday calculators for household budgeting, time planning, chores, and daily life management."
    }, {
      key: "sports",
      name: "Sports",
      icon: Dumbbell,
      color: "text-orange-500",
      path: "/sports",
      description: "Training, performance, and fitness calculators for athletes and enthusiasts across multiple sports."
    }, {
      key: "funny",
      name: "Funny Calculators",
      icon: Smile,
      color: "text-pink-500",
      path: "/funny",
      description: "Lighthearted tools for fun estimations, playful math, and humorous calculations to share with friends."
    }, {
      key: "marketing",
      name: "Marketing Calculators",
      icon: TrendingUp,
      color: "text-emerald-500",
      path: "/marketing",
      description: "Essential calculators for digital marketers, including CPM, ROAS, ROI, and conversion rates to optimize campaigns."
    },
    // New squares
    {
      key: "games",
      name: "Free Games",
      icon: Video,
      color: "text-blue-600",
      path: "/games",
      description: "Play curated arcade, puzzle, word, board and more. Free."
    },
    {
      key: "qr",
      name: "Free QR Code Generator",
      icon: QrCode,
      color: "text-blue-600",
      path: "/everyday/qr-code-generator",
      description: "Generate QR codes for URLs and text in PNG/SVG."
    },
    // Adding requested single utility cards
    {
      key: "word",
      name: "Word Counter",
      icon: BookOpen,
      color: "text-indigo-500",
      path: "/word-counter",
      description: "Count words, track speed, proofread, and format texts."
    },
    {
      key: "worldclock",
      name: "World Clock",
      icon: Globe2,
      color: "text-blue-500",
      path: "/time/world-clock",
      description: "Real-time world clock and timezone converter."
    },
    // Restored categories
    { ...categories.automotive, key: "automotive" },
    { ...categories.construction, key: "construction" },
    { ...categories.electrical, key: "electrical" }
  ];

  // Featured Calculators Data
  const featuredCalculators = [
    {
      name: "Free QR Code Generator",
      description: "Generate QR Codes for URLs and text",
      icon: QrCode,
      path: "/everyday/qr-code-generator",
      ctaLabel: "Generate QR Code"
    },
    {
      name: "Free Games",
      description: "Play curated arcade, puzzle, word, and board games",
      icon: Video,
      path: "/games",
      ctaLabel: "Play Now"
    },
    {
      name: "BMI Calculator",
      description: "Calculate your Body Mass Index",
      icon: Heart,
      path: "/health/bmi-body-mass-index",
      ctaLabel: "Check My BMI"
    },
    {
      name: "Loan Calculator",
      description: "Calculate monthly payments",
      icon: DollarSign,
      path: "/financial/loan-payment",
      ctaLabel: "Calculate My Payment"
    },
    {
      name: "Tip Calculator",
      description: "Calculate tips and split bills",
      icon: Calculator,
      path: "/financial/tip-split-bill",
      ctaLabel: "Split the Bill"
    },
    {
      name: "Unit Converter",
      description: "Convert between units",
      icon: RotateCcw,
      path: "/conversion",
      ctaLabel: "Convert Units"
    },
    {
      name: "Calorie Calculator",
      description: "Calculate daily calories",
      icon: ChefHat,
      path: "/health/daily-calorie-needs-goal",
      ctaLabel: "Find My Calories"
    },
    {
      name: "Grade Calculator",
      description: "Calculate your GPA",
      icon: Star,
      path: "/math/gpa-calculator",
      ctaLabel: "Calculate My GPA"
    },
    {
      name: "Dream Interpreter",
      description: "Discover the hidden meanings in your dreams with AI",
      icon: Moon,
      path: "/daily-quotes/dream",
      ctaLabel: "Interpret Dream"
    }
  ];
  return (
    <div className="min-h-screen skn-home-page font-sans selection:bg-teal-100 selection:text-teal-900 dark:selection:bg-teal-900/40 dark:selection:text-teal-100">
      <SEOHead
        title="Smart Kit Now - Your Ultimate Smart Tools Collection"
        description="Discover powerful smart tools and utilities designed to enhance your productivity and streamline your workflow. Your ultimate collection awaits."
        canonical="https://www.smartkitnow.com/"
      />
      {/* JSON-LD: Organization and WebSite with Sitelinks Search */}
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Smart Kit Now",
        url: "https://www.smartkitnow.com",
        logo: "https://www.smartkitnow.com/logo-smartkitnow.webp",
        sameAs: []
      }} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        url: "https://www.smartkitnow.com",
        name: "Smart Kit Now",
        potentialAction: {
          "@type": "SearchAction",
          target: "https://www.smartkitnow.com/search?q={q}",
          "query-input": "required name=q"
        }
      }} />
      {/* Main Content Area */}
      <GlobalSearch open={openSearch} onOpenChange={setOpenSearch} />
      <main className="pt-16 sm:pt-28">

        {/* ── HERO SECTION ──────────────────────────────────── */}
        <section className="skn-hero-dots relative overflow-hidden">
          <div className="container mx-auto px-4 pt-10 sm:pt-14 pb-10 text-center relative z-10 max-w-4xl">

            {/* Logo — small, above headline */}
            <div className="flex justify-center mb-6">
              <picture>
                <source srcSet="/logo-smartkitnow.webp" type="image/webp" />
                <img
                  src={logoImage}
                  alt="Smart Kit Now"
                  width={1000}
                  height={300}
                  decoding="async"
                  // @ts-expect-error fetchpriority
                  fetchpriority="high"
                  sizes="(max-width: 640px) 140px, 180px"
                  className="h-10 sm:h-12 w-auto block opacity-90"
                  style={{ height: "2.75rem", width: "auto", aspectRatio: "1000/300" }}
                />
              </picture>
            </div>

            {/* Eyebrow badge */}
            <div className="flex justify-center mb-5">
              <span className="skn-eyebrow">
                <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80 animate-pulse" />
                720+ Free Calculators
              </span>
            </div>

            {/* Display headline — Lora serif */}
            <h1 className="skn-display text-[2.6rem] sm:text-[3.75rem] font-bold tracking-tight text-slate-900 dark:text-white leading-[1.08] mb-5">
              Every tool
              <br />
              <em className="not-italic text-teal-600 dark:text-teal-400">you need.</em>
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8 leading-relaxed">
              Fast, accurate, and free calculators for health, finance, science, and everyday life.
            </p>

            {/* Search CTA */}
            <div className="flex justify-center">
              <button
                className="skn-hero-search"
                onClick={() => setOpenSearch(true)}
                aria-label="Search calculators"
              >
                <Search className="w-4 h-4 text-teal-500 shrink-0" />
                <span className="flex-1 text-left">Search 720+ calculators…</span>
                <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono border border-border rounded bg-muted text-muted-foreground">
                  ⌘K
                </kbd>
              </button>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="container mx-auto px-4 py-8 md:py-10 cv-auto">

          {/* SPOTLIGHT SECTION — Featured tools */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14 max-w-7xl px-4 mx-auto">

            {/* Spotlight 1: Auto Loan */}
            <div
              className="skn-spotlight-accent group relative overflow-hidden rounded-2xl border border-border bg-background hover:-translate-y-1 transition-all duration-200 hover:shadow-lg cursor-pointer flex flex-col"
              onClick={() => navigate('/financial/auto-loan')}
              role="button" tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate('/financial/auto-loan')}
            >
              <div className="absolute top-3 right-3 opacity-[0.07] group-hover:opacity-[0.11] transition-opacity pointer-events-none select-none">
                <Car className="w-20 h-20" />
              </div>
              <div className="p-5 flex flex-col gap-3 flex-1">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 flex items-center justify-center text-teal-600 dark:text-teal-400 border border-teal-100 dark:border-teal-800">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 rounded-full">New Charts</span>
                </div>
                <div>
                  <h3 className="font-semibold text-base text-foreground mb-1">Auto Loan Calculator</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    Visualize monthly payments and interest costs with interactive breakdown charts.
                  </p>
                </div>
                <div className="mt-auto flex items-center gap-1 text-xs font-medium text-teal-600 dark:text-teal-400 group-hover:underline pt-1">
                  Calculate Now <TrendingUp className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Spotlight 2: Investment Growth */}
            <div
              className="skn-spotlight-accent group relative overflow-hidden rounded-2xl border border-border bg-background hover:-translate-y-1 transition-all duration-200 hover:shadow-lg cursor-pointer flex flex-col"
              onClick={() => navigate('/financial/future-value')}
              role="button" tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate('/financial/future-value')}
            >
              <div className="absolute top-3 right-3 opacity-[0.07] group-hover:opacity-[0.11] transition-opacity pointer-events-none select-none">
                <TrendingUp className="w-20 h-20" />
              </div>
              <div className="p-5 flex flex-col gap-3 flex-1">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-full">Updated</span>
                </div>
                <div>
                  <h3 className="font-semibold text-base text-foreground mb-1">Investment Growth</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    Project your future wealth with our advanced compound interest visualizer.
                  </p>
                </div>
                <div className="mt-auto flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 group-hover:underline pt-1">
                  Start Investing <TrendingUp className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Spotlight 3: Neon Snake */}
            <div
              className="skn-spotlight-accent group relative overflow-hidden rounded-2xl border border-border bg-background hover:-translate-y-1 transition-all duration-200 hover:shadow-lg cursor-pointer flex flex-col"
              onClick={() => navigate('/games/neon-snake')}
              role="button" tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate('/games/neon-snake')}
            >
              <div className="absolute top-3 right-3 opacity-[0.07] group-hover:opacity-[0.11] transition-opacity pointer-events-none select-none">
                <Smile className="w-20 h-20" />
              </div>
              <div className="p-5 flex flex-col gap-3 flex-1">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950/60 flex items-center justify-center text-violet-600 dark:text-violet-400 border border-violet-100 dark:border-violet-800">
                    <Video className="w-5 h-5" />
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-950/60 border border-violet-200 dark:border-violet-800 rounded-full">New Game</span>
                </div>
                <div>
                  <h3 className="font-semibold text-base text-foreground mb-1">Neon Snake</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    Classic snake action reimagined with neon glow graphics and smooth controls.
                  </p>
                </div>
                <div className="mt-auto flex items-center gap-1 text-xs font-medium text-violet-600 dark:text-violet-400 group-hover:underline pt-1">
                  Play Now <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                </div>
              </div>
            </div>

            {/* Spotlight 4: World Clock */}
            <div
              className="skn-spotlight-accent group relative overflow-hidden rounded-2xl border border-border bg-background hover:-translate-y-1 transition-all duration-200 hover:shadow-lg cursor-pointer flex flex-col"
              onClick={() => navigate('/time/world-clock')}
              role="button" tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate('/time/world-clock')}
            >
              <div className="absolute top-3 right-3 opacity-[0.07] group-hover:opacity-[0.11] transition-opacity pointer-events-none select-none">
                <Globe2 className="w-20 h-20" />
              </div>
              <div className="p-5 flex flex-col gap-3 flex-1">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/60 flex items-center justify-center text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-sky-800">
                    <Globe2 className="w-5 h-5" />
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 rounded-full">New App</span>
                </div>
                <div>
                  <h3 className="font-semibold text-base text-foreground mb-1">World Clock</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    Track real-time digital clocks across popular cities and global timezones.
                  </p>
                </div>
                <div className="mt-auto flex items-center gap-1 text-xs font-medium text-sky-600 dark:text-sky-400 group-hover:underline pt-1">
                  View Time <ArrowLeft className="w-4 h-4 ml-1 rotate-180" />
                </div>
              </div>
            </div>
          </div>
          {/* Categories Grid */}
          <div className="grid grid-cols-1 min-[425px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-4">
            {calculatorCategories.slice(0, 8).map((category, index) => {
              const IconComponent = category.icon;
              const isAutomotive = category.name === "Automotive Calculators";
              const isConstruction = category.name === "Construction Calculators";
              const isConversion = category.name === "Conversion Calculators";
              const isCooking = category.name === "Cooking Calculators";
              const isElectrical = category.name === "Electrical Calculators";
              const isFinancial = category.name === "Financial Calculators";
              const isHealth = category.name === "Health & Fitness Calculators";
              const isMath = category.name === "Math & Algebra Calculators";
              const isPets = category.name === "Pet Care Calculators";
              const isScience = category.name === "Science Calculators";
              const isTime = category.name === "Time & Date Calculators";

              const isSmartTips = category.name === "Smart Tips";
              const handleClick = () => {
                if (import.meta.env.DEV) {
                  console.log("Category clicked:", category.name);
                }
                // Prefer explicit path if provided on the category object
                if ((category as any).path) {
                  navigate((category as any).path);
                  return;
                }
                // Fallbacks for legacy categories without explicit paths
                if (isAutomotive) navigate('/automotive');
                if (isConstruction) navigate('/construction');
                if (isConversion) navigate('/conversion');
                if (isCooking) navigate('/cooking');
                if (isElectrical) navigate('/electrical');
                if (isFinancial) navigate('/financial');
                if (isHealth) navigate('/health');
                if (isMath) navigate('/math');
                if (isPets) navigate('/pets');
                if (isScience) navigate('/science');
                if (isTime) navigate('/time');

                if (isSmartTips) navigate('/smart-tips');
              };
              return <GlowCard key={index} className="skn-card group/card hover:shadow-soft transition-all duration-300 hover:-translate-y-1 cursor-pointer" onClick={handleClick} customSize glowColor={isFinancial ? 'green' : isHealth ? 'red' : isPets ? 'orange' : isConversion ? 'blue' : isElectrical ? 'orange' : isConstruction ? 'orange' : isCooking ? 'orange' : isMath ? 'purple' : isScience ? 'blue' : isTime ? 'blue' : 'blue'}>
                <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
                  <span className="text-[20px] leading-none select-none">
                    {getCategoryIcon((category as any).key)}
                  </span>
                  <h3 className="skn-home-title text-[14px] md:text-[15px] font-semibold tracking-[-0.01em]">
                    {(category as any).title ?? category.name}
                  </h3>
                </CardContent>
              </GlowCard>;
            })}
          </div>

          {/* Collapsible extra categories */}
          {showAllCategories && (
            <div className="grid grid-cols-1 min-[425px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-4">
              {calculatorCategories.slice(8).map((category, index) => {
                const isFinancial = category.name === "Financial Calculators";
                const isHealth = category.name === "Health & Fitness Calculators";
                const isPets = category.name === "Pet Care Calculators";
                const isConversion = category.name === "Conversion Calculators";
                const isElectrical = category.name === "Electrical Calculators";
                const isConstruction = category.name === "Construction Calculators";
                const isCooking = category.name === "Cooking Calculators";
                const isMath = category.name === "Math & Algebra Calculators";
                const isScience = category.name === "Science Calculators";
                const isTime = category.name === "Time & Date Calculators";
                const handleClick = () => {
                  if ((category as any).path) { navigate((category as any).path); return; }
                  if (isFinancial) navigate('/financial');
                  else if (isHealth) navigate('/health');
                  else if (isCooking) navigate('/cooking');
                  else if (isConversion) navigate('/conversion');
                  else if (isElectrical) navigate('/electrical');
                  else if (isMath) navigate('/math');
                  else if (isPets) navigate('/pets');
                  else if (isScience) navigate('/science');
                  else if (isTime) navigate('/time');
                  else if (isConstruction) navigate('/construction');
                };
                return (
                  <GlowCard key={index} className="skn-card group/card hover:shadow-soft transition-all duration-300 hover:-translate-y-1 cursor-pointer" onClick={handleClick} customSize glowColor={isFinancial ? 'green' : isHealth ? 'red' : isPets ? 'orange' : isConversion ? 'blue' : isElectrical ? 'orange' : isConstruction ? 'orange' : isCooking ? 'orange' : isMath ? 'purple' : isScience ? 'blue' : isTime ? 'blue' : 'blue'}>
                    <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
                      <span className="text-[20px] leading-none select-none">{getCategoryIcon((category as any).key)}</span>
                      <h3 className="skn-home-title text-[14px] md:text-[15px] font-semibold tracking-[-0.01em]">
                        {(category as any).title ?? category.name}
                      </h3>
                    </CardContent>
                  </GlowCard>
                );
              })}
            </div>
          )}

          {/* Browse All / Show Less toggle */}
          <div className="text-center mb-6">
            <button
              onClick={() => setShowAllCategories((v) => !v)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:bg-muted rounded-lg transition-colors border border-border"
            >
              {showAllCategories ? (
                <>Show Less <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg></>
              ) : (
                <>Browse All {calculatorCategories.length} Categories <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg></>
              )}
            </button>
          </div>

          {/* Discover More Button */}
          <div className="text-center">
            <Button
              onClick={() => document.getElementById('featured-calculators')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-[#5c82ee] hover:bg-[#4a6fe0] text-white shadow-soft transition-all duration-300 hover:shadow-glow"
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              Discover More Calculators
            </Button>
          </div>
        </section>

        {/* Featured Section */}
        <div id="featured-calculators">
          <Suspense fallback={<div className="h-96 flex items-center justify-center">Loading Featured Calculators...</div>}>
            <FeaturedCalculatorsSection title="Featured Calculators and More" featuredCalculators={featuredCalculators} />
          </Suspense>
        </div>

        {/* Gradient Divider Between Sections */}
        {/* removed per user request */}

        {/* About Us Section */}
        <Suspense fallback={<div className="h-96 flex items-center justify-center">Loading About Section...</div>}>
          <AboutSection />
        </Suspense>

        {/* Why Our Calculators Matter Section */}
        {/* removed per user request */}

        <Suspense fallback={<div className="h-96 flex items-center justify-center">Loading Empowerment Section...</div>}>
          <EmpowermentSection />
        </Suspense>

        {/* Our Commitment Section */}
        <Suspense fallback={<div className="h-96 flex items-center justify-center">Loading Commitment Section...</div>}>
          <CommitmentSection />
        </Suspense>

        {/* removed per user request */}

      </main>
    </div>);
};
export default Index;
