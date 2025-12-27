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

export default function EvHybridBreakEvenCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    batteryCapacity: "", // kWh
    electricityRate: "", // $/kWh
    hybridFuelEfficiency: "", // MPG or L/100km
    fuelPrice: "", // $/gallon or $/liter
    annualMileage: "", // miles or km per year
    evPricePremium: "" // $ difference between EV and Hybrid upfront cost
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    const {
      unit,
      batteryCapacity,
      electricityRate,
      hybridFuelEfficiency,
      fuelPrice,
      annualMileage,
      evPricePremium
    } = inputs;

    // Parse inputs to numbers
    const batCap = parseFloat(batteryCapacity);
    const elecRate = parseFloat(electricityRate);
    const hybridEff = parseFloat(hybridFuelEfficiency);
    const fuelP = parseFloat(fuelPrice);
    const mileage = parseFloat(annualMileage);
    const pricePremium = parseFloat(evPricePremium);

    if (
      isNaN(batCap) || batCap <= 0 ||
      isNaN(elecRate) || elecRate <= 0 ||
      isNaN(hybridEff) || hybridEff <= 0 ||
      isNaN(fuelP) || fuelP <= 0 ||
      isNaN(mileage) || mileage <= 0 ||
      isNaN(pricePremium) || pricePremium < 0
    ) {
      return {
        primary: "—",
        secondary: "Please enter valid positive numbers in all fields.",
        details: "",
        feedback: ""
      };
    }

    // Constants for unit conversions
    // 1 gallon = 3.78541 liters
    // 1 mile = 1.60934 km
    // We will convert all to imperial internally for consistency

    // Convert inputs to imperial if metric
    let mileageMiles = mileage;
    let fuelPriceGal = fuelP;
    let hybridMpg = hybridEff;

    if (unit === "metric") {
      mileageMiles = mileage / 1.60934; // km to miles
      fuelPriceGal = fuelP * 3.78541; // $/liter to $/gallon
      hybridMpg = 235.214583 / hybridEff; // L/100km to MPG (235.214583 is constant)
    }

    // Calculate annual fuel cost for hybrid
    // Fuel consumed = mileage / mpg
    const annualFuelGallons = mileageMiles / hybridMpg;
    const annualFuelCost = annualFuelGallons * fuelPriceGal;

    // Calculate annual electricity cost for EV
    // Assume EV efficiency: 3.5 miles per kWh (typical average)
    // EV energy consumption = mileage / efficiency
    const evEfficiency = 3.5; // miles per kWh
    const annualKwh = mileageMiles / evEfficiency;
    const annualElectricityCost = annualKwh * elecRate;

    // Calculate annual savings by using EV vs Hybrid
    const annualSavings = annualFuelCost - annualElectricityCost;

    if (annualSavings <= 0) {
      return {
        primary: "N/A",
        secondary: "EV operating cost is not cheaper than Hybrid with current inputs.",
        details: `Annual Fuel Cost: $${annualFuelCost.toFixed(2)}, Annual Electricity Cost: $${annualElectricityCost.toFixed(2)}`,
        feedback: "Consider revising inputs or fuel/electricity prices."
      };
    }

    // Calculate break-even time in years
    const breakEvenYears = pricePremium / annualSavings;

    return {
      primary: breakEvenYears.toFixed(2),
      secondary: `$${annualSavings.toFixed(2)} annual savings`,
      details: `Annual Fuel Cost: $${annualFuelCost.toFixed(2)}, Annual Electricity Cost: $${annualElectricityCost.toFixed(2)}`,
      feedback: "Estimated years to recover EV price premium through fuel savings."
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "What does the break-even point mean in this calculator?",
      answer:
        "The break-even point represents the number of years it takes for the fuel savings of driving an electric vehicle (EV) compared to a hybrid vehicle to offset the higher upfront cost of the EV. It factors in your annual mileage, fuel and electricity prices, and vehicle efficiencies to provide a realistic estimate of when your investment in an EV pays off."
    },
    {
      question: "Why do I need to input the battery capacity for this calculator?",
      answer:
        "Battery capacity helps estimate the EV's energy consumption and charging costs. While the calculator uses a standard EV efficiency value, knowing your battery size and electricity rate allows for a more accurate calculation of annual electricity costs, which directly impacts the break-even analysis."
    },
    {
      question: "How does unit selection affect the results?",
      answer:
        "Selecting imperial or metric units adjusts the inputs and calculations accordingly. For example, fuel efficiency is entered as miles per gallon (MPG) in imperial units and liters per 100 kilometers (L/100km) in metric. The calculator converts these internally to ensure consistent and accurate results."
    },
    {
      question: "Can this calculator account for maintenance or tax incentives?",
      answer:
        "This calculator focuses solely on fuel and electricity cost comparisons and the upfront price difference between EV and hybrid vehicles. It does not include maintenance costs, tax incentives, or other financial factors, which can further influence the overall cost-effectiveness of EV ownership."
    },
    {
      question: "What if my annual savings are negative or zero?",
      answer:
        "If the calculator shows negative or zero annual savings, it means that, based on your inputs, the EV does not save you money on fuel costs compared to the hybrid. This could be due to high electricity rates, low fuel prices, or low annual mileage. Adjusting inputs or considering other factors may provide a clearer picture."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Financing a $40,000 electric SUV with a $5,000 price premium over a comparable hybrid model. You drive 12,000 miles annually, pay $0.13 per kWh for electricity, and $3.50 per gallon for gasoline. The hybrid gets 35 MPG, and the EV has a 75 kWh battery.",
    steps: [
      {
        label: "Step 1: Calculate annual fuel cost for hybrid",
        explanation:
          "Annual fuel consumption = 12,000 miles / 35 MPG = 342.86 gallons. Annual fuel cost = 342.86 gallons × $3.50/gallon = $1,200.00."
      },
      {
        label: "Step 2: Calculate annual electricity cost for EV",
        explanation:
          "EV efficiency assumed at 3.5 miles/kWh. Annual electricity consumption = 12,000 miles / 3.5 = 3,428.57 kWh. Annual electricity cost = 3,428.57 kWh × $0.13/kWh = $445.71."
      },
      {
        label: "Step 3: Calculate annual savings",
        explanation:
          "Annual savings = $1,200.00 (fuel) - $445.71 (electricity) = $754.29."
      },
      {
        label: "Step 4: Calculate break-even time",
        explanation:
          "Price premium = $5,000. Break-even time = $5,000 / $754.29 ≈ 6.63 years."
      }
    ],
    result: "Final Result: It will take approximately 6.63 years to recover the EV price premium through fuel savings."
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "EPA Fuel Economy Guide",
      description: "Official source for MPG ratings and fuel economy data for vehicles."
    },
    {
      title: "Kelley Blue Book",
      description: "Trusted vehicle valuation and pricing information."
    },
    {
      title: "Edmunds Automotive",
      description: "Comprehensive car reviews, pricing, and ownership cost insights."
    },
    {
      title: "U.S. Department of Energy - Alternative Fuels Data Center",
      description: "Information on electric vehicle efficiency and charging costs."
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
          <Label>Battery Capacity (kWh)</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.batteryCapacity}
            onChange={(e) => handleInputChange("batteryCapacity", e.target.value)}
            placeholder="e.g. 75"
          />
        </div>
        <div className="space-y-2">
          <Label>Electricity Rate ($/kWh)</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.electricityRate}
            onChange={(e) => handleInputChange("electricityRate", e.target.value)}
            placeholder="e.g. 0.13"
          />
        </div>
        <div className="space-y-2">
          <Label>{inputs.unit === "imperial" ? "Hybrid Fuel Efficiency (MPG)" : "Hybrid Fuel Efficiency (L/100km)"}</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.hybridFuelEfficiency}
            onChange={(e) => handleInputChange("hybridFuelEfficiency", e.target.value)}
            placeholder={inputs.unit === "imperial" ? "e.g. 35" : "e.g. 6.7"}
          />
        </div>
        <div className="space-y-2">
          <Label>{inputs.unit === "imperial" ? "Fuel Price ($/gallon)" : "Fuel Price ($/liter)"}</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.fuelPrice}
            onChange={(e) => handleInputChange("fuelPrice", e.target.value)}
            placeholder={inputs.unit === "imperial" ? "e.g. 3.50" : "e.g. 0.92"}
          />
        </div>
        <div className="space-y-2">
          <Label>{inputs.unit === "imperial" ? "Annual Mileage (miles)" : "Annual Mileage (km)"}</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.annualMileage}
            onChange={(e) => handleInputChange("annualMileage", e.target.value)}
            placeholder={inputs.unit === "imperial" ? "e.g. 12000" : "e.g. 19300"}
          />
        </div>
        <div className="space-y-2">
          <Label>EV Price Premium ($)</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.evPricePremium}
            onChange={(e) => handleInputChange("evPricePremium", e.target.value)}
            placeholder="e.g. 5000"
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" onClick={() => {}}>
        <Car className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Estimated Break-Even Time (years)</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">{results.primary}</div>
            <div className="text-xl font-bold mt-2">{results.secondary}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
            <p className="mt-2 italic text-sm text-slate-600 dark:text-slate-400">{results.feedback}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      {/* 1. HOW TO USE */}
      <section id="how-to-use" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to use this calculator</h2>
        <ol className="list-decimal pl-5 space-y-3 text-slate-600 dark:text-slate-400">
          <li>
            <strong>Enter your vehicle's battery capacity</strong> in kilowatt-hours (kWh). This helps estimate the EV's energy consumption.
          </li>
          <li>
            <strong>Input your local electricity rate</strong> in dollars per kWh to calculate charging costs.
          </li>
          <li>
            <strong>Provide your hybrid vehicle's fuel efficiency</strong> — miles per gallon (MPG) if using imperial units, or liters per 100 kilometers (L/100km) for metric.
          </li>
          <li>
            <strong>Enter the current fuel price</strong> per gallon or liter depending on your unit system.
          </li>
          <li>
            <strong>Specify your annual driving distance</strong> in miles or kilometers.
          </li>
          <li>
            <strong>Input the price premium</strong> you pay upfront for the EV compared to a similar hybrid model.
          </li>
          <li>
            <strong>Click Calculate</strong> to see the estimated number of years it will take to recover the EV price premium through fuel savings.
          </li>
        </ol>
      </section>

      {/* 2. COMPLETE GUIDE */}
      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to EV vs Hybrid Break-Even Point Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            The transition from hybrid vehicles to fully electric vehicles (EVs) is accelerating as technology improves and environmental concerns grow. However, one of the most common questions consumers face is whether the higher upfront cost of an EV is justified by the savings in fuel and maintenance over time. This calculator helps you estimate the break-even point where the total cost of owning an EV becomes equal to or less than that of a comparable hybrid vehicle.
          </p>
          <p>
            To perform this calculation, the tool requires inputs such as battery capacity, electricity rate, hybrid fuel efficiency, fuel price, annual mileage, and the EV price premium. The battery capacity and electricity rate help estimate the annual electricity cost for charging the EV. The hybrid fuel efficiency and fuel price determine the annual fuel cost for the hybrid vehicle. By comparing these annual operating costs, the calculator finds the yearly savings of driving an EV.
          </p>
          <p>
            The break-even point is then calculated by dividing the EV's higher upfront cost by the annual savings. This gives you the number of years it will take for the fuel savings to offset the initial price difference. It is important to note that this calculator focuses solely on fuel and electricity costs and does not include other factors such as maintenance, insurance, tax incentives, or resale value, which can also impact the total cost of ownership.
          </p>
          <p>
            Additionally, the calculator supports both imperial and metric units, converting inputs internally to ensure accurate comparisons. Understanding your personal driving habits, local energy prices, and vehicle efficiencies will help you make an informed decision about whether an EV or hybrid vehicle is the better financial choice for you.
          </p>
        </div>
      </section>

      {/* 3. COMMON MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" /> Common Mistakes
        </h3>
        <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <p>
            <strong>1. Ignoring unit consistency:</strong> Mixing imperial and metric units without proper conversion can lead to inaccurate results. Always select the correct unit system and enter values accordingly.
          </p>
          <p>
            <strong>2. Using outdated or inaccurate fuel and electricity prices:</strong> Energy prices fluctuate frequently. Using current local rates ensures the break-even calculation reflects your real costs.
          </p>
          <p>
            <strong>3. Overlooking annual mileage:</strong> The break-even time heavily depends on how much you drive. Underestimating mileage can underestimate savings and break-even time.
          </p>
          <p>
            <strong>4. Not accounting for other ownership costs:</strong> This calculator focuses on fuel and electricity costs only. Maintenance, insurance, incentives, and resale value can significantly affect total cost of ownership.
          </p>
          <p>
            <strong>5. Assuming fixed EV efficiency:</strong> EV efficiency varies by model, driving style, and conditions. The calculator uses an average value, so consider this when interpreting results.
          </p>
        </div>
      </section>

      {/* 4. FAQ */}
      <section id="faq">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently asked questions</h2>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
              <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">{faq.question}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. REFERENCES */}
      <section id="references">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-5 h-5 text-blue-500" /> References & additional resources
        </h2>
        <div className="space-y-4">
          {references.map((ref, i) => (
            <div key={i}>
              <a
                href="#"
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                {ref.title} <ExternalLink className="w-3 h-3" />
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{ref.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="EV vs Hybrid Break-Even Point Calculator"
      description="Professional automotive calculator: EV vs Hybrid Break-Even Point Calculator. Get accurate estimates, expert advice, and financial insights."
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