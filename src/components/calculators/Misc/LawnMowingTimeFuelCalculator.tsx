import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ FULL ICON IMPORT
import { Home, Heart, Utensils, Leaf, Calendar, DollarSign, Droplets, Activity, Moon, Sun, Users, Paintbrush, Wrench, Info, RotateCcw, AlertTriangle, FlaskConical, Scale, Waves, Zap, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function LawnMowingTimeFuelCalculator() {
  /**
   * Inputs:
   * - lawnArea: number (sq ft)
   * - mowerWidth: number (inches)
   * - mowerSpeed: number (mph)
   * - fuelEfficiency: number (gallons per hour)
   * - fuelPrice: number (optional, $ per gallon)
   */

  const [inputs, setInputs] = useState({
    lawnArea: "",
    mowerWidth: "",
    mowerSpeed: "",
    fuelEfficiency: "",
    fuelPrice: "",
  });

  const handleInputChange = useCallback((name, value) => {
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  /**
   * Calculation logic:
   * 1. Convert mower width from inches to feet.
   * 2. Calculate the area mowed per hour:
   *    mowerSpeed (mph) * mowerWidth (ft) * 5280 (ft per mile) = sq ft per hour
   * 3. Calculate mowing time = lawnArea / area mowed per hour (hours)
   * 4. Calculate fuel used = mowing time * fuelEfficiency (gallons)
   * 5. Calculate fuel cost = fuel used * fuelPrice (if provided)
   */

  const results = useMemo(() => {
    const lawnArea = parseFloat(inputs.lawnArea);
    const mowerWidthInches = parseFloat(inputs.mowerWidth);
    const mowerSpeedMph = parseFloat(inputs.mowerSpeed);
    const fuelEfficiencyGph = parseFloat(inputs.fuelEfficiency);
    const fuelPricePerGallon = parseFloat(inputs.fuelPrice);

    // Validate inputs
    if (
      !lawnArea ||
      !mowerWidthInches ||
      !mowerSpeedMph ||
      !fuelEfficiencyGph ||
      lawnArea <= 0 ||
      mowerWidthInches <= 0 ||
      mowerSpeedMph <= 0 ||
      fuelEfficiencyGph <= 0
    ) {
      return {
        value: null,
        label: "",
        subtext: "Please enter valid positive numbers for all required fields.",
        warning: "Incomplete or invalid inputs",
        formulaUsed: "",
      };
    }

    // Convert mower width to feet
    const mowerWidthFeet = mowerWidthInches / 12;

    // Calculate area mowed per hour (sq ft/hr)
    // mowerSpeed (miles/hr) * mowerWidth (ft) * 5280 (ft/mile)
    const areaPerHour = mowerSpeedMph * mowerWidthFeet * 5280;

    // Calculate mowing time in hours
    const mowingTimeHours = lawnArea / areaPerHour;

    // Calculate fuel used in gallons
    const fuelUsedGallons = mowingTimeHours * fuelEfficiencyGph;

    // Calculate fuel cost if price provided
    const fuelCost = fuelPricePerGallon && fuelPricePerGallon > 0 ? fuelUsedGallons * fuelPricePerGallon : null;

    // Format results
    const timeHoursRounded = mowingTimeHours < 0.01 ? "< 1 min" : `${(mowingTimeHours * 60).toFixed(0)} min`;
    const fuelUsedRounded = fuelUsedGallons.toFixed(3);
    const fuelCostRounded = fuelCost ? fuelCost.toFixed(2) : null;

    return {
      value: (
        <div className="space-y-2">
          <p className="text-3xl font-semibold text-blue-900 dark:text-white">
            Estimated Mowing Time: <span className="font-extrabold">{timeHoursRounded}</span>
          </p>
          <p className="text-xl text-blue-800 dark:text-blue-300">
            Fuel Required: <span className="font-semibold">{fuelUsedRounded} gallons</span>
          </p>
          {fuelCostRounded && (
            <p className="text-lg text-blue-700 dark:text-blue-400">
              Estimated Fuel Cost: <span className="font-semibold">${fuelCostRounded}</span>
            </p>
          )}
        </div>
      ),
      label: "Calculation Results",
      subtext: "Based on your inputs, here is the estimated time and fuel consumption for mowing your lawn.",
      warning: null,
      formulaUsed:
        "Mowing Time (hrs) = Lawn Area (sq ft) / (Mower Speed (mph) × Mower Width (ft) × 5280 ft/mile); Fuel Used (gal) = Mowing Time × Fuel Efficiency (gal/hr)",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "How does mower width affect mowing time?",
      answer:
        "Mower width directly impacts how much ground you can cover in a single pass. A wider mower cuts more grass per pass, reducing the total time needed to mow your lawn. However, wider mowers may be less maneuverable in tight spaces.",
    },
    {
      question: "Why is fuel efficiency important in planning?",
      answer:
        "Fuel efficiency determines how much fuel your mower consumes per hour of operation. Knowing this helps estimate fuel costs and ensures you have enough fuel to complete mowing without interruptions.",
    },
    {
      question: "Can I use this calculator for electric mowers?",
      answer:
        "This calculator is primarily designed for gas-powered mowers where fuel consumption is a factor. For electric mowers, you can estimate mowing time similarly but fuel calculations would not apply; instead, consider battery capacity and runtime.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="lawnArea" className="flex items-center gap-2">
                <Leaf className="w-4 h-4 text-green-600" /> Lawn Area (sq ft)
              </Label>
              <Input
                id="lawnArea"
                type="text"
                placeholder="e.g., 5000"
                value={inputs.lawnArea}
                onChange={(e) => handleInputChange("lawnArea", e.target.value)}
                aria-describedby="lawnAreaHelp"
              />
              <p id="lawnAreaHelp" className="text-xs text-slate-500 mt-1">
                Enter the total area of your lawn in square feet.
              </p>
            </div>

            <div>
              <Label htmlFor="mowerWidth" className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-blue-600" /> Mower Cutting Width (inches)
              </Label>
              <Input
                id="mowerWidth"
                type="text"
                placeholder="e.g., 22"
                value={inputs.mowerWidth}
                onChange={(e) => handleInputChange("mowerWidth", e.target.value)}
                aria-describedby="mowerWidthHelp"
              />
              <p id="mowerWidthHelp" className="text-xs text-slate-500 mt-1">
                Typical mower widths range from 20 to 30 inches.
              </p>
            </div>

            <div>
              <Label htmlFor="mowerSpeed" className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-red-600" /> Mower Speed (mph)
              </Label>
              <Input
                id="mowerSpeed"
                type="text"
                placeholder="e.g., 3"
                value={inputs.mowerSpeed}
                onChange={(e) => handleInputChange("mowerSpeed", e.target.value)}
                aria-describedby="mowerSpeedHelp"
              />
              <p id="mowerSpeedHelp" className="text-xs text-slate-500 mt-1">
                Average walking speed with mower is 2-4 mph.
              </p>
            </div>

            <div>
              <Label htmlFor="fuelEfficiency" className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-yellow-600" /> Fuel Consumption (gallons/hr)
              </Label>
              <Input
                id="fuelEfficiency"
                type="text"
                placeholder="e.g., 0.5"
                value={inputs.fuelEfficiency}
                onChange={(e) => handleInputChange("fuelEfficiency", e.target.value)}
                aria-describedby="fuelEfficiencyHelp"
              />
              <p id="fuelEfficiencyHelp" className="text-xs text-slate-500 mt-1">
                Typical small mowers use 0.3 to 0.7 gallons per hour.
              </p>
            </div>

            <div>
              <Label htmlFor="fuelPrice" className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-700" /> Fuel Price ($/gallon) (optional)
              </Label>
              <Input
                id="fuelPrice"
                type="text"
                placeholder="e.g., 3.50"
                value={inputs.fuelPrice}
                onChange={(e) => handleInputChange("fuelPrice", e.target.value)}
                aria-describedby="fuelPriceHelp"
              />
              <p id="fuelPriceHelp" className="text-xs text-slate-500 mt-1">
                Enter current fuel price to estimate cost.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // Trigger recalculation by updating inputs state (noop here since useMemo depends on inputs)
            setInputs((p) => ({ ...p }));
          }}
          aria-label="Calculate mowing time and fuel"
        >
          <Home className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              lawnArea: "",
              mowerWidth: "",
              mowerSpeed: "",
              fuelEfficiency: "",
              fuelPrice: "",
            })
          }
          className="flex-1 h-11"
          aria-label="Reset all inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            {results.warning && (
              <p className="text-red-600 font-semibold mb-4 flex items-center justify-center gap-2">
                <AlertTriangle className="w-5 h-5" /> {results.warning}
              </p>
            )}
            {results.value}
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-400 italic">{results.subtext}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Lawn Mowing Time & Fuel Planner
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Efficient lawn maintenance requires careful planning, especially when estimating how long it will take to mow your yard and how much fuel your mower will consume. This planner helps you calculate these critical factors by considering your lawn's size, mower specifications, and fuel consumption rates. By understanding these variables, you can optimize your mowing schedule, reduce fuel costs, and ensure your equipment is used effectively. Whether you have a small residential lawn or a larger property, this tool provides tailored insights to help you manage your mowing tasks with confidence.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To get accurate estimates, input the relevant details about your lawn and mower. This includes the total lawn area in square feet, the cutting width of your mower in inches, your typical mowing speed in miles per hour, and your mower’s fuel consumption rate in gallons per hour. Optionally, you can enter the current fuel price per gallon to estimate your fuel costs. After entering these values, click "Calculate" to see your estimated mowing time and fuel usage.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Measure your lawn area accurately using a tape measure or property survey.
          </li>
          <li>
            <strong>Step 2:</strong> Check your mower’s cutting width, usually specified in the user manual or on the mower deck.
          </li>
          <li>
            <strong>Step 3:</strong> Estimate your average mowing speed; walking speed with a mower is typically between 2 to 4 mph.
          </li>
          <li>
            <strong>Step 4:</strong> Determine your mower’s fuel consumption rate, which can be found in the mower’s specifications or estimated based on engine size.
          </li>
          <li>
            <strong>Step 5:</strong> Input all values and optionally the fuel price, then press "Calculate" to view results.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Professional Tips & Safety</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To maximize efficiency and safety during mowing, always ensure your mower is well-maintained, including sharp blades and proper tire pressure. Mowing at a consistent pace helps maintain uniform grass height and reduces fuel consumption. Avoid mowing wet grass to prevent clumping and mower strain. Additionally, wear appropriate protective gear such as gloves, eye protection, and sturdy footwear. Keep children and pets away from the mowing area to prevent accidents. Planning your mowing during cooler parts of the day can also improve comfort and reduce heat stress.
        </p>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <ul className="space-y-6">
          {faqs.map((item, i) => (
            <li key={i} className="border-b border-slate-200 dark:border-slate-800 pb-4 last:border-0">
              <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-2">{item.question}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.answer}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* NEW RICH REFERENCES SECTION */}
      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References & Additional Resources</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
          For further reading and verification, please refer to these authoritative sources:
        </p>
        <ul className="space-y-4">
          <li>
            <a
              href="https://www.epa.gov/greenvehicles/greenhouse-gas-emissions-typical-passenger-vehicle"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              EPA - Greenhouse Gas Emissions from a Typical Passenger Vehicle <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Provides detailed information on fuel consumption and emissions, useful for understanding mower fuel impacts.
            </p>
          </li>
          <li>
            <a
              href="https://extension.umd.edu/resource/lawn-mowing-tips"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              University of Maryland Extension - Lawn Mowing Tips <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Offers expert advice on efficient mowing practices and lawn care management.
            </p>
          </li>
          <li>
            <a
              href="https://www.energy.gov/eere/vehicles/articles/fuel-economy"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              U.S. Department of Energy - Fuel Economy <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Explains fuel consumption metrics and efficiency, applicable to small engines like lawn mowers.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Lawn Mowing Time & Fuel Planner"
      description="Estimate lawn mowing time. Calculate how long it takes to mow your yard and the fuel required based on mower size."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Methodology",
        formula:
          "Mowing Time (hours) = Lawn Area (sq ft) / (Mower Speed (mph) × Mower Width (ft) × 5280 ft/mile); Fuel Used (gallons) = Mowing Time × Fuel Consumption Rate (gallons/hour)",
        variables: [
          { symbol: "Lawn Area", description: "Total lawn size in square feet" },
          { symbol: "Mower Speed", description: "Speed of mower in miles per hour" },
          { symbol: "Mower Width", description: "Cutting width of mower in feet" },
          { symbol: "Fuel Consumption Rate", description: "Fuel used by mower in gallons per hour" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "You have a 5,000 sq ft lawn, a mower with a 22-inch cutting width, mow at 3 mph, and your mower consumes 0.5 gallons of fuel per hour. Fuel costs $3.50 per gallon.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert mower width to feet: 22 inches ÷ 12 = 1.83 ft.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate area mowed per hour: 3 mph × 1.83 ft × 5280 ft/mile = 28,972 sq ft/hr.",
          },
          {
            label: "Step 3",
            explanation:
              "Calculate mowing time: 5,000 sq ft ÷ 28,972 sq ft/hr ≈ 0.1725 hours (about 10.35 minutes).",
          },
          {
            label: "Step 4",
            explanation:
              "Calculate fuel used: 0.1725 hr × 0.5 gal/hr = 0.086 gallons.",
          },
          {
            label: "Step 5",
            explanation:
              "Calculate fuel cost: 0.086 gal × $3.50/gal = $0.30.",
          },
        ],
        result: "Estimated mowing time is approximately 10 minutes, using about 0.086 gallons of fuel costing around 30 cents.",
      }}
      relatedCalculators={[
        { title: "Garden Soil/Compost Volume Calculator", url: "/everyday-life/garden-soil-compost-volume", icon: "🌿" },
        { title: "Propane Tank Burn Time Estimator", url: "/everyday-life/propane-tank-burn-time", icon: "💡" },
        { title: "Hose Runtime vs Flow Rate Calculator", url: "/everyday-life/hose-runtime-flow-rate", icon: "💡" },
        { title: "Room Air Changes per Hour (ACH) Calculator", url: "/everyday-life/room-air-changes-ach", icon: "💡" },
        { title: "Leftovers Cooling & Reheat Time", url: "/everyday-life/leftovers-cooling-reheat-time", icon: "💡" },
        { title: "Refrigerator/Freezer Safe Zone Time Window", url: "/everyday-life/refrigerator-freezer-safe-zone-time-window", icon: "💡" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding" },
        { id: "how-to", label: "How to Use" },
        { id: "tips", label: "Pro Tips" },
        { id: "faq", label: "FAQ" },
        { id: "references", label: "References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}