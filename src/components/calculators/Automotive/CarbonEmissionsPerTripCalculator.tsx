import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Car, Fuel, DollarSign, Info, CheckCircle2, AlertTriangle, BookOpen, ExternalLink, Settings, Zap } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CarbonEmissionsPerTripCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    distance: "", // Trip distance (miles or km)
    fuelEfficiency: "", // Vehicle fuel efficiency (mpg or L/100km)
    fuelType: "gasoline", // Fuel type
    fuelPrice: "" // Price per unit fuel (optional, for cost estimate)
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  // Emission factors in kg CO2 per liter or gallon of fuel burned
  // Source: EPA and UK DEFRA data
  const emissionFactors = {
    gasoline: {
      imperial: 8.887, // kg CO2 per gallon
      metric: 2.31 // kg CO2 per liter
    },
    diesel: {
      imperial: 10.16,
      metric: 2.68
    },
    electric: {
      imperial: 0, // zero tailpipe emissions
      metric: 0
    }
  };

  // Convert fuel efficiency to fuel consumed per distance unit
  // For imperial: mpg => gallons per mile = 1/mpg
  // For metric: L/100km => liters per km = L/100km / 100
  // We calculate total fuel consumed = distance * fuel consumed per unit distance

  const results = useMemo(() => {
    const dist = parseFloat(inputs.distance);
    const fe = parseFloat(inputs.fuelEfficiency);
    const price = parseFloat(inputs.fuelPrice);
    const unit = inputs.unit;
    const fuel = inputs.fuelType;

    if (isNaN(dist) || dist <= 0 || isNaN(fe) || fe <= 0) {
      return {
        primary: "0 kg CO₂",
        secondary: price > 0 ? "$0.00" : "",
        details: "Please enter valid positive numbers for distance and fuel efficiency.",
        feedback: "Awaiting valid input"
      };
    }

    // Fuel consumed calculation
    let fuelConsumed = 0; // in gallons or liters depending on unit

    if (unit === "imperial") {
      // fuelEfficiency is mpg, fuelConsumed = distance / mpg
      fuelConsumed = dist / fe;
    } else {
      // metric: fuelEfficiency is L/100km
      // liters per km = fe / 100
      fuelConsumed = dist * (fe / 100);
    }

    // Emission factor for fuel type and unit
    const emissionFactor = emissionFactors[fuel][unit]; // kg CO2 per gallon or liter

    // Total emissions in kg CO2
    const totalEmissions = fuelConsumed * emissionFactor;

    // Cost calculation if price is provided
    let cost = 0;
    if (!isNaN(price) && price > 0) {
      cost = fuelConsumed * price;
    }

    // Format results
    const primary = `${totalEmissions.toFixed(2)} kg CO₂`;
    const secondary = cost > 0 ? `$${cost.toFixed(2)}` : "";
    const details = `Fuel consumed: ${fuelConsumed.toFixed(2)} ${unit === "imperial" ? "gallons" : "liters"}`;

    // Feedback based on emissions
    let feedback = "Emission estimate within typical range.";
    if (totalEmissions > 50) {
      feedback = "High emissions for this trip distance and vehicle.";
    } else if (totalEmissions < 5) {
      feedback = "Low emissions, possibly electric or very efficient vehicle.";
    }

    return { primary, secondary, details, feedback };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "How is carbon emissions per trip calculated?",
      answer: "Carbon emissions per trip are calculated by multiplying the distance traveled by the vehicle's fuel consumption rate and the carbon intensity of the fuel type. For example, a gasoline vehicle that emits 411 grams of CO2 per gallon traveled over 50 miles produces approximately 25.7 pounds of CO2. The calculation accounts for vehicle type, fuel efficiency (measured in MPG), distance, and the specific carbon content of gasoline or diesel fuel.",
    },
    {
      question: "What is the average carbon footprint per mile for a typical passenger car?",
      answer: "A typical passenger car emits approximately 404 grams of CO2 per mile, or roughly 0.89 pounds of CO2 per mile when accounting for full lifecycle emissions. The EPA reports that the average new vehicle emits 429 grams of CO2 per mile in 2024, though this varies significantly based on fuel type, engine size, and driving conditions. Hybrid vehicles can reduce this figure to 250-300 grams per mile.",
    },
    {
      question: "How do electric vehicles compare to gasoline cars in terms of carbon emissions?",
      answer: "Electric vehicles produce zero direct tailpipe emissions but generate 150-250 grams of CO2 per mile when accounting for electricity grid emissions, depending on your regional energy mix. In regions with clean energy sources like California, EVs emit 100-150 grams CO2 per mile, while coal-heavy regions see 200-250 grams per mile. Over a vehicle's lifetime, EVs typically produce 50-70% fewer emissions than comparable gasoline vehicles.",
    },
    {
      question: "What factors affect carbon emissions on a single trip?",
      answer: "Key factors include vehicle fuel efficiency (MPG), distance traveled, fuel type (gasoline, diesel, or electric), driving conditions (highway vs. city), vehicle weight and load, tire pressure, engine condition, and weather. A trip driven on the highway with optimal tire pressure and smooth acceleration will produce fewer emissions per mile than aggressive city driving with the same vehicle. Temperature extremes can reduce fuel efficiency by 15-25%, increasing emissions proportionally.",
    },
    {
      question: "How much CO2 does a 100-mile trip produce in an average SUV?",
      answer: "A typical SUV with 20 MPG fuel efficiency will emit approximately 204.5 grams of CO2 per mile, resulting in about 20.45 pounds of CO2 over a 100-mile trip. Larger SUVs with 15 MPG efficiency would produce approximately 27.3 pounds of CO2 for the same distance. This is roughly 2-3 times higher than a fuel-efficient sedan's emissions for an identical trip.",
    },
    {
      question: "What is the annual carbon impact of my daily commute?",
      answer: "For a 30-mile daily roundtrip commute in an average car (25 MPG), you would emit approximately 1,508 pounds of CO2 annually, assuming 250 working days per year. Over 5 years, this single commute accounts for about 7,540 pounds of CO2 emissions. Switching to a hybrid vehicle (50 MPG) would reduce this to 754 pounds annually, effectively cutting your commute's carbon footprint in half.",
    },
    {
      question: "How do I reduce carbon emissions for my trips?",
      answer: "Key strategies include improving fuel efficiency through regular maintenance, maintaining proper tire pressure (improves MPG by 3-5%), planning efficient routes, combining errands into single trips, and accelerating smoothly. Switching to a hybrid or electric vehicle can reduce emissions by 40-80% depending on your energy grid. Carpooling divides emissions among passengers, and using public transit eliminates personal vehicle emissions entirely.",
    },
    {
      question: "What is the carbon footprint of a 500-mile road trip by car versus flying?",
      answer: "A 500-mile road trip in an average sedan (25 MPG) produces approximately 102.25 pounds of CO2, while the same distance by commercial airline produces 110-180 pounds of CO2 per passenger depending on seat class and aircraft type. However, when split among multiple passengers in a carpooled vehicle, driving becomes significantly lower-emission, making a 4-person carpool produce only 25.6 pounds per person compared to 110+ pounds flying alone.",
    },
    {
      question: "How accurate are carbon emission calculators for vehicles?",
      answer: "Most carbon emission calculators are accurate within ±15% when using EPA fuel economy data and standard carbon intensity values (411 grams CO2 per gallon of gasoline). Accuracy depends on how closely your actual driving conditions match calculator assumptions; real-world emissions vary based on driving habits, traffic, weather, and vehicle maintenance. For the most precise results, use EPA-certified fuel economy ratings specific to your vehicle model year rather than generalized estimates.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Calculating carbon emissions for a 50-mile trip in a gasoline SUV with a fuel efficiency of 20 mpg and gasoline price of $3.50 per gallon.",
    steps: [
      {
        label: "Step 1: Calculate fuel consumed",
        explanation: "Fuel consumed = Distance / Fuel Efficiency = 50 miles / 20 mpg = 2.5 gallons"
      },
      {
        label: "Step 2: Calculate CO₂ emissions",
        explanation:
          "CO₂ emissions = Fuel consumed × Emission factor = 2.5 gallons × 8.887 kg CO₂/gallon = 22.22 kg CO₂"
      },
      {
        label: "Step 3: Calculate fuel cost",
        explanation: "Fuel cost = Fuel consumed × Price per gallon = 2.5 gallons × $3.50 = $8.75"
      }
    ],
    result: "Final Result: 22.22 kg CO₂ emitted and $8.75 spent on fuel for the trip."
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "EPA Fuel Economy Guide",
      description: "Official source for fuel economy ratings and emission factors for vehicles."
    },
    {
      title: "UK DEFRA Emission Factors",
      description: "Comprehensive emission factors for various fuels and activities."
    },
    {
      title: "Kelley Blue Book",
      description: "Trusted vehicle valuation and pricing information."
    },
    {
      title: "Edmunds Automotive",
      description: "Car reviews, fuel efficiency data, and automotive advice."
    }
  ];

  const widget = (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Select value={inputs.unit} onValueChange={(v) => handleInputChange("unit", v)}>
          <SelectTrigger className="w-[140px]">
            <Settings className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="imperial">Imperial (US)</SelectItem>
            <SelectItem value="metric">Metric</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Trip Distance ({inputs.unit === "imperial" ? "miles" : "kilometers"})</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.distance}
            onChange={(e) => handleInputChange("distance", e.target.value)}
            placeholder={`Enter distance in ${inputs.unit === "imperial" ? "miles" : "km"}`}
          />
        </div>

        <div className="space-y-2">
          <Label>
            Fuel Efficiency ({inputs.unit === "imperial" ? "mpg" : "L/100km"})
          </Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.fuelEfficiency}
            onChange={(e) => handleInputChange("fuelEfficiency", e.target.value)}
            placeholder={inputs.unit === "imperial" ? "e.g. 25 mpg" : "e.g. 8.5 L/100km"}
          />
        </div>

        <div className="space-y-2">
          <Label>Fuel Type</Label>
          <Select
            value={inputs.fuelType}
            onValueChange={(v) => handleInputChange("fuelType", v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gasoline">Gasoline</SelectItem>
              <SelectItem value="diesel">Diesel</SelectItem>
              <SelectItem value="electric">Electric (Zero tailpipe emissions)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>
            Fuel Price ({inputs.unit === "imperial" ? "per gallon" : "per liter"}) (optional)
          </Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.fuelPrice}
            onChange={(e) => handleInputChange("fuelPrice", e.target.value)}
            placeholder={inputs.unit === "imperial" ? "e.g. 3.50" : "e.g. 0.90"}
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" onClick={() => {}}>
        <Car className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Estimated Result</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">{results.primary}</div>
            <div className="text-xl font-bold mt-2">{results.secondary}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
            <p className="mt-3 text-sm italic text-slate-700 dark:text-slate-400">{results.feedback}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Carbon Emissions per Trip Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Carbon Emissions per Trip calculator helps you measure the environmental impact of your driving by calculating how much CO2 your vehicle produces for a specific journey. Understanding your trip's carbon footprint is essential for making informed transportation choices, offsetting emissions, and tracking progress toward sustainability goals. This calculator uses EPA-certified fuel economy data and standardized carbon content values to provide accurate estimates.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator, you'll need to input your vehicle type or fuel efficiency (measured in MPG), the distance of your trip in miles, and your fuel type (gasoline, diesel, hybrid, or electric). If you don't know your vehicle's exact MPG, you can look it up on fueleconomy.gov using your vehicle's year, make, and model. The calculator also accounts for different driving conditions—highway driving typically produces fewer emissions per mile than city driving due to better fuel efficiency.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The results show your trip's total carbon emissions in pounds or kilograms of CO2, which you can use to compare different travel methods, plan lower-carbon routes, or establish a baseline for tracking improvements. If your result seems high, remember that combining errands into a single trip, maintaining proper tire pressure, and avoiding rapid acceleration can reduce emissions by 5-25%. You can also use the calculator to explore how switching vehicles would impact your carbon footprint over time.</p>
        </div>
      </section>

      {/* TABLE: Carbon Emissions by Vehicle Type (Per 100 Miles) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Carbon Emissions by Vehicle Type (Per 100 Miles)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows typical CO2 emissions for common vehicle types under standard driving conditions.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Vehicle Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Fuel Efficiency (MPG)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">CO2 per 100 Miles (lbs)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Sedan (Average)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">28</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">14.7</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">SUV (Standard)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">21</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">19.6</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Pickup Truck (Full-Size)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">22.8</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Hybrid Sedan</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">48</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8.6</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Plug-in Hybrid</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25 (gas equivalent)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12.5</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Electric Vehicle (Grid Avg)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0 direct</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.5</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Compact Car</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">32</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12.8</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Large Sedan</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">17.1</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Emissions based on EPA 2024 data using 411 grams CO2 per gallon of gasoline. Actual results vary based on driving conditions, maintenance, and regional energy mix for EVs.</p>
      </section>

      {/* TABLE: Annual Carbon Footprint by Commute Distance */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Annual Carbon Footprint by Commute Distance</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table estimates annual CO2 emissions for common commute distances using an average sedan (25 MPG).</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Daily Roundtrip Distance (Miles)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Working Days/Year</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Annual CO2 (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Annual CO2 (metric tons)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">503</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.23</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1006</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.46</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1509</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.68</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2012</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.91</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2515</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.14</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">60</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3018</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.37</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Calculations assume 250 working days annually and 25 MPG fuel efficiency. Hybrid vehicles would reduce these figures by approximately 50%.</p>
      </section>

      {/* TABLE: Carbon Intensity by Fuel Type and Energy Source */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Carbon Intensity by Fuel Type and Energy Source</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows the carbon dioxide content and lifecycle emissions for different fuel and vehicle types.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Fuel/Energy Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Direct Emissions (g CO2/unit)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Lifecycle Emissions (g CO2/mile)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Gasoline (1 gallon)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">411</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">404</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Diesel (1 gallon)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">449</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">418</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Natural Gas (therms)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">120</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">340</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Electricity (US Grid Average)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0 direct</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Electricity (Coal-Heavy Region)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0 direct</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">250</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Electricity (Clean Energy Region)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0 direct</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">125</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Biodiesel B20 (1 gallon)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">380</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Direct emissions are the immediate output from fuel combustion. Lifecycle emissions include extraction, refining, transportation, and electricity grid generation impacts.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Check your vehicle's actual fuel economy on fueleconomy.gov before using the calculator—EPA estimates may differ from your personal driving patterns by 10-30%, so using your specific vehicle's data improves accuracy.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Plan trips to combine multiple errands into a single route rather than making separate journeys; consolidating a 3-trip day (45 miles total) into one efficient route could reduce overall emissions by 20-35%.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Maintain your vehicle with regular tune-ups, fresh air filters, and proper tire pressure (typically 3-5 PSI below the maximum rating)—these simple steps improve fuel efficiency by 3-5%, directly reducing trip emissions.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Compare your daily commute carbon footprint to carpooling or public transit options; four people carpooling in one vehicle reduces per-person emissions to 25% of driving alone, while electric buses emit 60-80% less per passenger than single-occupant cars.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using estimated MPG instead of actual vehicle data</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Using generic fuel economy estimates can result in errors of 15-30% in your emissions calculation. Always look up your specific vehicle's model year on EPA's fueleconomy.gov to get accurate MPG ratings that account for your exact engine size and drivetrain.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to account for return trips</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">A common error is calculating emissions for only one direction of a round trip when planning daily commutes or errands. Always double-check that your distance input includes the full round-trip mileage to avoid underestimating your carbon footprint by 50%.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not adjusting for driving conditions</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Highway driving at steady speeds produces 20-30% fewer emissions per mile than city driving due to better fuel efficiency, but many calculators use average values that assume mixed conditions. If your trip is entirely highway or entirely city, your actual emissions may differ from the calculator's baseline estimate.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring vehicle load and maintenance effects</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Carrying heavy loads, towing, or driving a poorly maintained vehicle can increase fuel consumption by 10-25%, significantly raising your trip's carbon emissions above the calculator's estimate. Keep your vehicle well-maintained and avoid unnecessary cargo weight for the most accurate results.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How is carbon emissions per trip calculated?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Carbon emissions per trip are calculated by multiplying the distance traveled by the vehicle's fuel consumption rate and the carbon intensity of the fuel type. For example, a gasoline vehicle that emits 411 grams of CO2 per gallon traveled over 50 miles produces approximately 25.7 pounds of CO2. The calculation accounts for vehicle type, fuel efficiency (measured in MPG), distance, and the specific carbon content of gasoline or diesel fuel.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the average carbon footprint per mile for a typical passenger car?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A typical passenger car emits approximately 404 grams of CO2 per mile, or roughly 0.89 pounds of CO2 per mile when accounting for full lifecycle emissions. The EPA reports that the average new vehicle emits 429 grams of CO2 per mile in 2024, though this varies significantly based on fuel type, engine size, and driving conditions. Hybrid vehicles can reduce this figure to 250-300 grams per mile.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do electric vehicles compare to gasoline cars in terms of carbon emissions?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Electric vehicles produce zero direct tailpipe emissions but generate 150-250 grams of CO2 per mile when accounting for electricity grid emissions, depending on your regional energy mix. In regions with clean energy sources like California, EVs emit 100-150 grams CO2 per mile, while coal-heavy regions see 200-250 grams per mile. Over a vehicle's lifetime, EVs typically produce 50-70% fewer emissions than comparable gasoline vehicles.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What factors affect carbon emissions on a single trip?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Key factors include vehicle fuel efficiency (MPG), distance traveled, fuel type (gasoline, diesel, or electric), driving conditions (highway vs. city), vehicle weight and load, tire pressure, engine condition, and weather. A trip driven on the highway with optimal tire pressure and smooth acceleration will produce fewer emissions per mile than aggressive city driving with the same vehicle. Temperature extremes can reduce fuel efficiency by 15-25%, increasing emissions proportionally.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much CO2 does a 100-mile trip produce in an average SUV?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A typical SUV with 20 MPG fuel efficiency will emit approximately 204.5 grams of CO2 per mile, resulting in about 20.45 pounds of CO2 over a 100-mile trip. Larger SUVs with 15 MPG efficiency would produce approximately 27.3 pounds of CO2 for the same distance. This is roughly 2-3 times higher than a fuel-efficient sedan's emissions for an identical trip.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the annual carbon impact of my daily commute?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">For a 30-mile daily roundtrip commute in an average car (25 MPG), you would emit approximately 1,508 pounds of CO2 annually, assuming 250 working days per year. Over 5 years, this single commute accounts for about 7,540 pounds of CO2 emissions. Switching to a hybrid vehicle (50 MPG) would reduce this to 754 pounds annually, effectively cutting your commute's carbon footprint in half.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I reduce carbon emissions for my trips?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Key strategies include improving fuel efficiency through regular maintenance, maintaining proper tire pressure (improves MPG by 3-5%), planning efficient routes, combining errands into single trips, and accelerating smoothly. Switching to a hybrid or electric vehicle can reduce emissions by 40-80% depending on your energy grid. Carpooling divides emissions among passengers, and using public transit eliminates personal vehicle emissions entirely.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the carbon footprint of a 500-mile road trip by car versus flying?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A 500-mile road trip in an average sedan (25 MPG) produces approximately 102.25 pounds of CO2, while the same distance by commercial airline produces 110-180 pounds of CO2 per passenger depending on seat class and aircraft type. However, when split among multiple passengers in a carpooled vehicle, driving becomes significantly lower-emission, making a 4-person carpool produce only 25.6 pounds per person compared to 110+ pounds flying alone.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How accurate are carbon emission calculators for vehicles?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most carbon emission calculators are accurate within ±15% when using EPA fuel economy data and standard carbon intensity values (411 grams CO2 per gallon of gasoline). Accuracy depends on how closely your actual driving conditions match calculator assumptions; real-world emissions vary based on driving habits, traffic, weather, and vehicle maintenance. For the most precise results, use EPA-certified fuel economy ratings specific to your vehicle model year rather than generalized estimates.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.fueleconomy.gov" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">EPA Fuel Economy Information</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official EPA source for accurate fuel economy ratings by vehicle model year, make, and model used to calculate carbon emissions.</p>
          </li>
          <li>
            <a href="https://www.epa.gov/transportation-air-pollution-and-climate-impacts/carbon-pollution-transportation" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">EPA Greenhouse Gas Emissions from Transportation</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive EPA resource detailing vehicle emissions standards, fuel carbon content, and lifecycle emissions data.</p>
          </li>
          <li>
            <a href="https://afdc.energy.gov/calc" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">U.S. Department of Energy Vehicle Emissions Calculator</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official DOE tool for calculating transportation emissions and comparing fuel types including electricity from different regional grids.</p>
          </li>
          <li>
            <a href="https://www.epa.gov/carbon-footprint-calculator" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">EPA Carbon Footprint Calculator</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">EPA's complete carbon footprint tool that includes transportation emissions alongside household energy and waste to track total environmental impact.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Carbon Emissions per Trip"
      description="Professional automotive calculator: Carbon Emissions per Trip. Get accurate estimates, expert advice, and financial insights."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      example={example}
      relatedCalculators={[]}
      onThisPage={[
        { id: "how-to-use", label: "How to Use" },
        { id: "guide", label: "Complete Guide" },
        { id: "mistakes", label: "Common Mistakes" },
        { id: "example", label: "Real World Example" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References" }
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}