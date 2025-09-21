import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car, HardHat, RotateCcw, ChefHat, Zap, DollarSign, Heart, Calculator, Dog, Atom, Clock, Video, BookOpen, Lightbulb, Quote, Home, Dumbbell, Smile, Star, TrendingUp, ArrowLeft } from "lucide-react";
const Index = () => {
  const navigate = useNavigate();

  // Categories with detailed automotive and construction structures
  const categories = {
    automotivo: {
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
      color: "text-orange-600",
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
      }]
    },
    financial: {
      name: "Financial Calculators",
      icon: DollarSign,
      color: "text-emerald-600",
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
      color: "text-pink-600",
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
  const calculatorCategories = [categories.financial, categories.health, categories.cooking, categories.conversion, {
    name: "Math & Algebra Calculators",
    icon: Calculator,
    color: "text-purple-600",
    description: "Mathematical calculations from basic arithmetic to advanced algebra, geometry, statistics, and trigonometry."
  }, {
    name: "Pet Care Calculators",
    icon: Dog,
    color: "text-amber-600",
    description: "Pet health, nutrition, and care calculators for dogs, cats, and aquariums."
  }, {
    name: "Science Calculators",
    icon: Atom,
    color: "text-cyan-600",
    description: "Chemistry, physics, and density calculations for scientific applications."
  }, {
    name: "Time & Date Calculators",
    icon: Clock,
    color: "text-indigo-600",
    description: "Age calculations, countdowns, date arithmetic, and time conversions."
  }, {
    name: "Video Calculators",
    icon: Video,
    color: "text-violet-600"
  }, {
    name: "Recipes",
    icon: BookOpen,
    color: "text-teal-600"
  }, {
    name: "Smart Tips",
    icon: Lightbulb,
    color: "text-yellow-500"
  }, {
    name: "Daily Quotes",
    icon: Quote,
    color: "text-slate-600"
  }, {
    name: "Every day Life Calculators",
    icon: Home,
    color: "text-blue-500"
  }, {
    name: "Sports",
    icon: Dumbbell,
    color: "text-orange-500"
  }, {
    name: "Funny Calculators",
    icon: Smile,
    color: "text-pink-500"
  },
  // Restored categories
  categories.automotivo, categories.construction, categories.electrical];

  // Featured Calculators Data
  const featuredCalculators = [{
    name: "BMI Calculator",
    description: "Calculate your Body Mass Index",
    icon: Heart
  }, {
    name: "Loan Calculator",
    description: "Calculate monthly payments",
    icon: DollarSign
  }, {
    name: "Tip Calculator",
    description: "Calculate tips and split bills",
    icon: Calculator
  }, {
    name: "Unit Converter",
    description: "Convert between units",
    icon: RotateCcw
  }, {
    name: "Calorie Calculator",
    description: "Calculate daily calories",
    icon: ChefHat
  }, {
    name: "Grade Calculator",
    description: "Calculate your GPA",
    icon: Star
  }];
  return <div className="min-h-screen bg-gradient-soft">
      {/* Fixed Header */}
      <Header />

      {/* Main Content Area - Add top padding to account for fixed header */}
      <main className="pt-20">
        {/* Categories Section */}
        <section className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4 py-[10px]">
              Calculator Categories
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Explore our comprehensive collection of calculators organized by category
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
            {calculatorCategories.map((category, index) => {
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
            const handleClick = () => {
              console.log("Category clicked:", category.name);
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
            };
            return <Card key={index} className="group hover:shadow-soft transition-all duration-300 hover:-translate-y-1 bg-card border-border/50 cursor-pointer" onClick={handleClick}>
                  <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
                    <div className="p-3 rounded-lg bg-muted/50 group-hover:bg-primary/10 transition-colors">
                      <IconComponent className={`h-6 w-6 ${category.color} group-hover:text-primary transition-colors`} />
                    </div>
                    <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                  </CardContent>
                </Card>;
          })}
          </div>

          {/* Discover More Button */}
          <div className="text-center">
            <Button className="bg-primary hover:bg-primary-glow text-primary-foreground shadow-soft transition-all duration-300 hover:shadow-glow">
              <TrendingUp className="mr-2 h-4 w-4" />
              Discover More Calculators
            </Button>
          </div>
        </section>

        {/* Featured Section */}
        <section className="container mx-auto px-4 py-16 bg-muted/20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Featured Calculators</h3>
            <p className="text-muted-foreground text-lg">
              Essential calculation tools trusted by millions of professionals, students, and DIY enthusiasts worldwide
            </p>
          </div>

          {/* Featured Calculators Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCalculators.map((calc, index) => {
            const IconComponent = calc.icon;
            return <Card key={index} className="group hover:shadow-soft transition-all duration-300 hover:-translate-y-1 bg-card border-border/50 cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-primary-soft/20 group-hover:bg-primary-soft/30 transition-colors">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {calc.name}
                        </CardTitle>
                        <CardDescription>{calc.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      Use Calculator
                    </Button>
                  </CardContent>
                </Card>;
          })}
          </div>
        </section>

        {/* About Us Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">About Smart Kit Now</h2>
              <p className="text-muted-foreground text-lg">
                Your trusted companion for accurate calculations and conversions
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-primary" />
                    Precision & Reliability
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Every calculator on Smart Kit Now is built with precision in mind. Our formulas are extensively tested 
                    and validated to ensure you get accurate results every time, whether you're planning a construction project, 
                    managing finances, or converting units.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    Easy to Use
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We believe powerful tools should be simple to use. Our intuitive interface makes complex calculations 
                    accessible to everyone, from professionals to DIY enthusiasts. No complicated software or downloads required.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="prose prose-slate max-w-none">
              <h3 className="text-2xl font-semibold text-foreground mb-4">Why Choose Smart Kit Now?</h3>
              <p className="text-muted-foreground mb-6">
                Smart Kit Now has become the go-to platform for millions of users worldwide who need reliable calculation tools. 
                Our comprehensive suite of calculators covers everything from basic math operations to specialized industry calculations, 
                making us your one-stop solution for all computational needs.
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary-soft/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Star className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Trusted by Millions</h4>
                  <p className="text-sm text-muted-foreground">Over 5 million calculations performed monthly</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary-soft/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Dumbbell className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Professional Grade</h4>
                  <p className="text-sm text-muted-foreground">Used by engineers, contractors, and professionals</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary-soft/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Always Free</h4>
                  <p className="text-sm text-muted-foreground">No subscriptions, no hidden fees, completely free</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Our Calculators Matter Section */}
        <section className="container mx-auto px-4 py-16 bg-muted/20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              Empowering Better Decisions Through Accurate Calculations
            </h2>

            <div className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">For Professionals & Contractors</h3>
                  <p className="text-muted-foreground mb-4">
                    Construction professionals rely on Smart Kit Now for accurate material estimates, cost calculations, 
                    and project planning. Our construction calculators help you minimize waste, stay within budget, and 
                    deliver projects on time. From concrete volume to lumber calculations, we've got you covered.
                  </p>
                  <ul className="text-muted-foreground space-y-2">
                    <li>• Reduce material waste by up to 15% with accurate estimates</li>
                    <li>• Save time on complex calculations</li>
                    <li>• Improve project profitability through better planning</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">For Health & Fitness Enthusiasts</h3>
                  <p className="text-muted-foreground mb-4">
                    Take control of your health journey with our comprehensive health calculators. Whether you're tracking 
                    your BMI, calculating daily calorie needs, or monitoring your fitness progress, our tools provide 
                    the insights you need to make informed decisions about your health and wellness.
                  </p>
                  <ul className="text-muted-foreground space-y-2">
                    <li>• Track your health metrics accurately</li>
                    <li>• Set realistic fitness and nutrition goals</li>
                    <li>• Monitor progress over time</li>
                  </ul>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">For Financial Planning</h3>
                  <p className="text-muted-foreground mb-4">
                    Make smarter financial decisions with our suite of financial calculators. From loan payments and 
                    mortgage calculations to investment returns and retirement planning, we help you understand the 
                    financial impact of your decisions before you make them.
                  </p>
                  <ul className="text-muted-foreground space-y-2">
                    <li>• Compare loan options and payment schedules</li>
                    <li>• Plan for major purchases and investments</li>
                    <li>• Understand compound interest and growth</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">For Students & Educators</h3>
                  <p className="text-muted-foreground mb-4">
                    Students and teachers use Smart Kit Now to verify homework answers, explore mathematical concepts, 
                    and solve real-world problems. Our calculators serve as both learning tools and practical resources 
                    for academic success across multiple subjects and grade levels.
                  </p>
                  <ul className="text-muted-foreground space-y-2">
                    <li>• Verify calculations and check homework</li>
                    <li>• Learn through interactive examples</li>
                    <li>• Explore mathematical relationships</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Commitment Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-6">Our Commitment to Excellence</h2>
            <p className="text-lg text-muted-foreground mb-8">
              At Smart Kit Now, we're committed to providing you with the most accurate, reliable, and user-friendly 
              calculators available online. We continuously update our tools based on user feedback and industry 
              standards to ensure you always have access to the best calculation resources.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 rounded-lg bg-card border border-border/50">
                <BookOpen className="h-8 w-8 text-primary mx-auto mb-3" />
                <h4 className="font-semibold text-foreground mb-2">Continuous Learning</h4>
                <p className="text-sm text-muted-foreground">
                  We regularly add new calculators and improve existing ones based on user needs and industry developments.
                </p>
              </div>
              
              <div className="p-6 rounded-lg bg-card border border-border/50">
                <Smile className="h-8 w-8 text-primary mx-auto mb-3" />
                <h4 className="font-semibold text-foreground mb-2">User-Centric Design</h4>
                <p className="text-sm text-muted-foreground">
                  Every feature we build is designed with our users in mind, ensuring maximum usability and efficiency.
                </p>
              </div>
              
              <div className="p-6 rounded-lg bg-card border border-border/50">
                <Quote className="h-8 w-8 text-primary mx-auto mb-3" />
                <h4 className="font-semibold text-foreground mb-2">Transparency</h4>
                <p className="text-sm text-muted-foreground">
                  We provide clear explanations of our formulas and methodologies so you understand exactly how results are calculated.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Section */}
      <Footer />
    </div>;
};
export default Index;