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

export default function IceVsEvOwnershipCostCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    batteryCapacity: "", // kWh
    electricityRate: "", // $/kWh
    iceFuelEconomy: "", // MPG or L/100km
    iceFuelPrice: "", // $/gallon or $/liter
    annualMileage: "", // miles or km
    evPrice: "", // $ purchase price EV
    icePrice: "", // $ purchase price ICE
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    // Parse inputs
    const batteryCapacity = parseFloat(inputs.batteryCapacity);
    const electricityRate = parseFloat(inputs.electricityRate);
    const iceFuelEconomy = parseFloat(inputs.iceFuelEconomy);
    const iceFuelPrice = parseFloat(inputs.iceFuelPrice);
    const annualMileage = parseFloat(inputs.annualMileage);
    const evPrice = parseFloat(inputs.evPrice);
    const icePrice = parseFloat(inputs.icePrice);
    const years = 5;

    if (
      isNaN(batteryCapacity) || batteryCapacity <= 0 ||
      isNaN(electricityRate) || electricityRate <= 0 ||
      isNaN(iceFuelEconomy) || iceFuelEconomy <= 0 ||
      isNaN(iceFuelPrice) || iceFuelPrice <= 0 ||
      isNaN(annualMileage) || annualMileage <= 0 ||
      isNaN(evPrice) || evPrice <= 0 ||
      isNaN(icePrice) || icePrice <= 0
    ) {
      return {
        primary: "—",
        secondary: "Please enter valid positive numbers for all inputs.",
        details: "",
        feedback: ""
      };
    }

    // Calculate total electricity cost for EV over 5 years
    // Assume EV efficiency: 3 miles/kWh (imperial) or 5 km/kWh (metric)
    // This is a typical average efficiency for EVs
    let evEfficiency; // miles/kWh or km/kWh
    if (inputs.unit === "imperial") {
      evEfficiency = 3; // miles per kWh
    } else {
      evEfficiency = 5; // km per kWh
    }

    // Total kWh consumed over 5 years
    const totalKWh = (annualMileage * years) / evEfficiency;
    const totalElectricityCost = totalKWh * electricityRate;

    // Calculate total fuel cost for ICE over 5 years
    // Fuel consumed = total distance / fuel economy
    // Fuel economy is MPG (miles per gallon) or L/100km (liters per 100 km)
    let totalFuelConsumed;
    if (inputs.unit === "imperial") {
      totalFuelConsumed = (annualMileage * years) / iceFuelEconomy; // gallons
    } else {
      // Convert L/100km to fuel consumed in liters
      // fuel consumed (L) = (distance (km) * L/100km) / 100
      totalFuelConsumed = (annualMileage * years * iceFuelEconomy) / 100;
    }
    const totalFuelCost = totalFuelConsumed * iceFuelPrice;

    // Total ownership cost = purchase price + fuel/electricity cost
    const evTotalCost = evPrice + totalElectricityCost;
    const iceTotalCost = icePrice + totalFuelCost;

    // Difference
    const costDifference = iceTotalCost - evTotalCost;
    const costDifferenceFormatted = costDifference >= 0
      ? `Save $${costDifference.toFixed(2)} with EV`
      : `Spend $${Math.abs(costDifference).toFixed(2)} more with EV`;

    return {
      primary: inputs.unit === "imperial" ? `${totalElectricityCost.toFixed(2)} USD` : `${totalElectricityCost.toFixed(2)} USD`,
      secondary: `EV Total Cost: $${evTotalCost.toFixed(2)} | ICE Total Cost: $${iceTotalCost.toFixed(2)}`,
      details: `Electricity used: ${totalKWh.toFixed(1)} kWh, Fuel used: ${totalFuelConsumed.toFixed(1)} ${inputs.unit === "imperial" ? "gallons" : "liters"}`,
      feedback: costDifferenceFormatted
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "How does electricity rate affect EV ownership cost?",
      answer:
        "Electricity rate directly impacts the total cost of charging an electric vehicle. Higher rates increase the cost per kWh, raising the overall operating expenses of an EV. Conversely, lower electricity rates make EVs more economical to operate compared to internal combustion engine vehicles. It's important to use your local electricity rate for accurate calculations."
    },
    {
      question: "Why do I need to input both EV and ICE purchase prices?",
      answer:
        "The calculator compares total ownership costs over 5 years, which includes both the initial purchase price and ongoing fuel or electricity expenses. Including both prices provides a comprehensive comparison, helping you understand the true financial difference between owning an EV versus an ICE vehicle."
    },
    {
      question: "What is the assumed EV efficiency in this calculator?",
      answer:
        "This calculator assumes an average EV efficiency of about 3 miles per kWh for imperial units and 5 kilometers per kWh for metric units. These values represent typical real-world driving conditions but can vary based on vehicle model, driving habits, and terrain."
    },
    {
      question: "Can I use this calculator for both miles and kilometers?",
      answer:
        "Yes, the calculator supports both imperial (miles, gallons) and metric (kilometers, liters) units. Make sure to select the correct unit system and input all values consistently to ensure accurate results."
    },
    {
      question: "Does this calculator include maintenance and other ownership costs?",
      answer:
        "No, this calculator focuses on purchase price and fuel/electricity costs over 5 years. Maintenance, insurance, taxes, and other expenses are not included but can significantly affect total ownership cost. EVs typically have lower maintenance costs, which may further improve their cost advantage."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Financing a $40,000 electric vehicle versus a $30,000 gasoline car, driving 12,000 miles per year with local electricity at $0.13/kWh and gasoline at $3.50/gallon, and an ICE fuel economy of 25 MPG.",
    steps: [
      {
        label: "Step 1: Calculate EV electricity consumption",
        explanation:
          "EV efficiency assumed at 3 miles/kWh. Total miles over 5 years = 12,000 × 5 = 60,000 miles. Electricity used = 60,000 miles ÷ 3 miles/kWh = 20,000 kWh."
      },
      {
        label: "Step 2: Calculate EV electricity cost",
        explanation:
          "Electricity cost = 20,000 kWh × $0.13/kWh = $2,600."
      },
      {
        label: "Step 3: Calculate ICE fuel consumption",
        explanation:
          "Fuel consumed = 60,000 miles ÷ 25 MPG = 2,400 gallons."
      },
      {
        label: "Step 4: Calculate ICE fuel cost",
        explanation:
          "Fuel cost = 2,400 gallons × $3.50/gallon = $8,400."
      },
      {
        label: "Step 5: Calculate total ownership costs",
        explanation:
          "EV total cost = $40,000 + $2,600 = $42,600. ICE total cost = $30,000 + $8,400 = $38,400."
      },
      {
        label: "Step 6: Compare costs",
        explanation:
          "EV costs $4,200 more over 5 years in this scenario."
      }
    ],
    result: "In this example, the EV has higher total ownership cost by $4,200 over 5 years, mainly due to the higher purchase price despite lower fuel costs."
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
      title: "U.S. Energy Information Administration (EIA)",
      description: "Data on electricity rates and energy consumption."
    },
    {
      title: "Alternative Fuels Data Center (AFDC)",
      description: "Information on electric vehicle efficiency and fuel costs."
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
          <Label>{inputs.unit === "imperial" ? "ICE Fuel Economy (MPG)" : "ICE Fuel Economy (L/100km)"}</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.iceFuelEconomy}
            onChange={(e) => handleInputChange("iceFuelEconomy", e.target.value)}
            placeholder={inputs.unit === "imperial" ? "e.g. 25" : "e.g. 9.4"}
          />
        </div>
        <div className="space-y-2">
          <Label>{inputs.unit === "imperial" ? "Fuel Price ($/gallon)" : "Fuel Price ($/liter)"}</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.iceFuelPrice}
            onChange={(e) => handleInputChange("iceFuelPrice", e.target.value)}
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
            placeholder={inputs.unit === "imperial" ? "e.g. 12000" : "e.g. 20000"}
          />
        </div>
        <div className="space-y-2">
          <Label>EV Purchase Price ($)</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.evPrice}
            onChange={(e) => handleInputChange("evPrice", e.target.value)}
            placeholder="e.g. 40000"
          />
        </div>
        <div className="space-y-2">
          <Label>ICE Purchase Price ($)</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.icePrice}
            onChange={(e) => handleInputChange("icePrice", e.target.value)}
            placeholder="e.g. 30000"
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" onClick={() => { }}>
        <Car className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Estimated Result</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">{results.primary}</div>
            <div className="text-xl font-bold mt-2">{results.secondary}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
            <p className="mt-3 font-semibold text-blue-700">{results.feedback}</p>
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
            <strong>Step 1:</strong> Select your preferred unit system (Imperial or Metric) at the top right to ensure all inputs are consistent.
          </li>
          <li>
            <strong>Step 2:</strong> Enter your electric vehicle's battery capacity in kilowatt-hours (kWh) and your local electricity rate per kWh.
          </li>
          <li>
            <strong>Step 3:</strong> Input your internal combustion engine (ICE) vehicle's fuel economy and fuel price according to the selected unit system.
          </li>
          <li>
            <strong>Step 4:</strong> Provide your estimated annual mileage and the purchase prices for both the EV and ICE vehicles.
          </li>
          <li>
            <strong>Step 5:</strong> Click the Calculate button to see a detailed comparison of the total ownership costs over 5 years, including fuel/electricity expenses and purchase price.
          </li>
        </ol>
      </section>

      {/* 2. COMPLETE GUIDE */}
      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to ICE vs EV Ownership Cost (5 years)
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Comparing the total cost of ownership between internal combustion engine (ICE) vehicles and electric vehicles (EVs) is essential for making informed purchasing decisions. This calculator helps you estimate and compare these costs over a 5-year period, considering both the upfront purchase price and ongoing fuel or electricity expenses. By inputting your vehicle specifications, local fuel and electricity prices, and driving habits, you can gain a clear financial picture of which option is more economical for you.
          </p>
          <p>
            The calculator assumes average EV efficiency values (3 miles per kWh for imperial units and 5 km per kWh for metric) to estimate electricity consumption. For ICE vehicles, it uses your provided fuel economy (MPG or L/100km) and fuel price to calculate fuel costs. The total ownership cost is the sum of the purchase price and the fuel or electricity cost over 5 years. This approach allows you to see not only the operational savings of EVs but also how the initial purchase price impacts overall affordability.
          </p>
          <p>
            Keep in mind that this calculator does not include maintenance, insurance, taxes, or incentives, which can also affect ownership costs. EVs often have lower maintenance costs and may qualify for government incentives, further improving their cost-effectiveness. Use this tool as a baseline financial comparison and consider other factors such as driving range, charging infrastructure, and personal preferences when choosing between an ICE and an EV.
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
            <strong>1. Mixing units:</strong> Entering inputs in inconsistent units (e.g., miles with liters or kilometers with gallons) will produce inaccurate results. Always select the correct unit system and input values accordingly.
          </p>
          <p>
            <strong>2. Ignoring purchase price differences:</strong> Comparing only fuel or electricity costs without considering the vehicle purchase price can mislead the total cost comparison.
          </p>
          <p>
            <strong>3. Using outdated fuel or electricity prices:</strong> Fuel and electricity rates fluctuate over time. Use current local rates for the most accurate estimate.
          </p>
          <p>
            <strong>4. Overlooking EV efficiency variations:</strong> EV efficiency varies by model, driving style, and conditions. The calculator uses average values, so adjust inputs if you have specific data.
          </p>
          <p>
            <strong>5. Not accounting for incentives or maintenance:</strong> This calculator excludes government incentives, tax credits, and maintenance costs, which can significantly affect ownership cost.
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
              <a href="#" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1" target="_blank" rel="noopener noreferrer">
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
      title="ICE vs EV Ownership Cost (5 years)"
      description="Professional automotive calculator: ICE vs EV Ownership Cost (5 years). Get accurate estimates, expert advice, and financial insights."
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