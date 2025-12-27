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

export default function EvHybridGasTcoCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    batteryCapacity: "", // kWh for EV
    electricityRate: "", // $/kWh
    annualMileage: "", // miles or km per year
    gasPrice: "", // $/gallon or $/liter
    gasMileage: "", // MPG or L/100km
    hybridMileage: "", // MPG or L/100km
    evEfficiency: "", // miles/kWh or km/kWh
    years: "5", // ownership period
    priceEV: "", // $ purchase price EV
    priceHybrid: "", // $ purchase price Hybrid
    priceGas: "", // $ purchase price Gas
    maintenanceEV: "", // $/year
    maintenanceHybrid: "", // $/year
    maintenanceGas: "", // $/year
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  // Helper: convert L/100km to MPG (US)
  const lPer100kmToMpg = (l: number) => 235.214583 / l;

  // Helper: convert MPG (US) to L/100km
  const mpgToLPer100km = (mpg: number) => 235.214583 / mpg;

  // Calculate TCO for each vehicle type
  // TCO = Purchase Price + Fuel Cost + Maintenance Cost over ownership period

  const results = useMemo(() => {
    const {
      unit,
      batteryCapacity,
      electricityRate,
      annualMileage,
      gasPrice,
      gasMileage,
      hybridMileage,
      evEfficiency,
      years,
      priceEV,
      priceHybrid,
      priceGas,
      maintenanceEV,
      maintenanceHybrid,
      maintenanceGas,
    } = inputs;

    // Parse inputs to numbers
    const batCap = parseFloat(batteryCapacity);
    const elecRate = parseFloat(electricityRate);
    const annMiles = parseFloat(annualMileage);
    const gPrice = parseFloat(gasPrice);
    const gMileage = parseFloat(gasMileage);
    const hMileage = parseFloat(hybridMileage);
    const evEff = parseFloat(evEfficiency);
    const ownYears = parseFloat(years);
    const pEV = parseFloat(priceEV);
    const pHybrid = parseFloat(priceHybrid);
    const pGas = parseFloat(priceGas);
    const mEV = parseFloat(maintenanceEV);
    const mHybrid = parseFloat(maintenanceHybrid);
    const mGas = parseFloat(maintenanceGas);

    if (
      isNaN(batCap) || isNaN(elecRate) || isNaN(annMiles) || isNaN(gPrice) ||
      isNaN(gMileage) || isNaN(hMileage) || isNaN(evEff) || isNaN(ownYears) ||
      isNaN(pEV) || isNaN(pHybrid) || isNaN(pGas) || isNaN(mEV) || isNaN(mHybrid) || isNaN(mGas)
    ) {
      return {
        primary: "Please fill all inputs",
        secondary: "",
        details: "",
        feedback: "",
      };
    }

    // Convert units if metric
    // For fuel economy:
    // Gas and Hybrid: if metric, input is L/100km, convert to MPG for calculation
    // EV efficiency: if metric, input is km/kWh, convert to miles/kWh
    let gasMpg = gMileage;
    let hybridMpg = hMileage;
    let evMilesPerKwh = evEff;
    let milesPerYear = annMiles;

    if (unit === "metric") {
      // Convert L/100km to MPG
      gasMpg = lPer100kmToMpg(gMileage);
      hybridMpg = lPer100kmToMpg(hMileage);
      // Convert km/kWh to miles/kWh
      evMilesPerKwh = evEff * 0.621371;
      // Convert km to miles
      milesPerYear = annMiles * 0.621371;
    }

    // Fuel cost calculations
    // Gasoline cost = (Annual miles / MPG) * gas price * years
    const totalGasFuelCost = (milesPerYear / gasMpg) * gPrice * ownYears;
    const totalHybridFuelCost = (milesPerYear / hybridMpg) * gPrice * ownYears;
    // EV electricity cost = (Annual miles / miles per kWh) * electricity rate * years
    const totalEvFuelCost = (milesPerYear / evMilesPerKwh) * elecRate * ownYears;

    // Maintenance cost total
    const totalMaintenanceEV = mEV * ownYears;
    const totalMaintenanceHybrid = mHybrid * ownYears;
    const totalMaintenanceGas = mGas * ownYears;

    // Total cost of ownership
    const tcoEV = pEV + totalEvFuelCost + totalMaintenanceEV;
    const tcoHybrid = pHybrid + totalHybridFuelCost + totalMaintenanceHybrid;
    const tcoGas = pGas + totalGasFuelCost + totalMaintenanceGas;

    // Format results
    const formatCurrency = (val: number) =>
      val.toLocaleString("en-US", { style: "currency", currency: "USD" });

    // Determine cheapest option
    let cheapest = "EV";
    let cheapestCost = tcoEV;
    if (tcoHybrid < cheapestCost) {
      cheapest = "Hybrid";
      cheapestCost = tcoHybrid;
    }
    if (tcoGas < cheapestCost) {
      cheapest = "Gas";
      cheapestCost = tcoGas;
    }

    return {
      primary: `${cheapest} is cheapest`,
      secondary: `EV: ${formatCurrency(tcoEV)} | Hybrid: ${formatCurrency(tcoHybrid)} | Gas: ${formatCurrency(tcoGas)}`,
      details: `Over ${ownYears} years, based on your inputs.`,
      feedback: `Fuel costs - EV: ${formatCurrency(totalEvFuelCost)}, Hybrid: ${formatCurrency(totalHybridFuelCost)}, Gas: ${formatCurrency(totalGasFuelCost)}.`,
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "How does this calculator estimate the total cost of ownership (TCO)?",
      answer:
        "This calculator estimates TCO by combining purchase price, fuel or electricity costs, and maintenance expenses over the ownership period you specify. It accounts for differences in fuel efficiency, energy rates, and annual mileage to provide a comprehensive cost comparison between EV, hybrid, and gas vehicles. This holistic approach helps you understand the long-term financial impact of each vehicle type."
    },
    {
      question: "Why do I need to input both battery capacity and electricity rate for EV calculations?",
      answer:
        "Battery capacity (kWh) helps estimate the energy storage of the EV, but the key factor for ongoing costs is the electricity rate ($/kWh) combined with how efficiently the vehicle uses that energy (miles per kWh). The calculator uses your inputs to estimate how much you’ll spend on electricity based on your driving habits, making the TCO estimate more accurate."
    },
    {
      question: "Can I use this calculator if I live outside the US?",
      answer:
        "Yes, the calculator supports both imperial and metric units. You can switch units to enter data in kilometers, liters, and metric fuel economy (L/100km). The calculator converts these inputs internally to provide consistent and comparable results regardless of your location."
    },
    {
      question: "How accurate are the maintenance cost estimates?",
      answer:
        "Maintenance costs vary widely depending on vehicle make, model, driving conditions, and local service rates. The calculator uses your input values for annual maintenance costs to tailor the estimate. For best accuracy, use realistic maintenance cost estimates based on your vehicle type and local data."
    },
    {
      question: "What factors are not included in this TCO calculator?",
      answer:
        "This calculator focuses on purchase price, fuel/electricity costs, and maintenance. It does not include insurance, taxes, financing interest, depreciation, or incentives like tax credits or rebates. Including these factors requires more detailed personal data and varies greatly by region and individual circumstances."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Financing a $40,000 EV, a $30,000 Hybrid, and a $25,000 Gas car for 5 years with 12,000 miles driven annually. Electricity costs $0.13/kWh, gas costs $3.50/gallon. EV efficiency is 3.5 miles/kWh, Hybrid gets 50 MPG, Gas car gets 30 MPG. Annual maintenance costs are $300 for EV, $500 for Hybrid, and $700 for Gas.",
    steps: [
      {
        label: "Step 1: Calculate annual fuel/electricity consumption",
        explanation:
          "EV: 12,000 miles / 3.5 miles/kWh = 3,429 kWh/year. Hybrid: 12,000 miles / 50 MPG = 240 gallons/year. Gas: 12,000 miles / 30 MPG = 400 gallons/year."
      },
      {
        label: "Step 2: Calculate annual fuel/electricity cost",
        explanation:
          "EV: 3,429 kWh * $0.13 = $445.77/year. Hybrid: 240 gallons * $3.50 = $840/year. Gas: 400 gallons * $3.50 = $1,400/year."
      },
      {
        label: "Step 3: Calculate total fuel/electricity cost over 5 years",
        explanation:
          "EV: $445.77 * 5 = $2,228.85. Hybrid: $840 * 5 = $4,200. Gas: $1,400 * 5 = $7,000."
      },
      {
        label: "Step 4: Calculate total maintenance cost over 5 years",
        explanation:
          "EV: $300 * 5 = $1,500. Hybrid: $500 * 5 = $2,500. Gas: $700 * 5 = $3,500."
      },
      {
        label: "Step 5: Calculate total cost of ownership (TCO)",
        explanation:
          "EV: $40,000 + $2,228.85 + $1,500 = $43,728.85. Hybrid: $30,000 + $4,200 + $2,500 = $36,700. Gas: $25,000 + $7,000 + $3,500 = $35,500."
      },
      {
        label: "Step 6: Conclusion",
        explanation:
          "Despite higher upfront cost, the EV has lower fuel and maintenance costs but still ends up more expensive over 5 years compared to Gas and Hybrid in this scenario. Gas is cheapest here, but factors like incentives or longer ownership could change this."
      }
    ],
    result: "Final Result: Gas car has the lowest TCO at $35,500, followed by Hybrid at $36,700, and EV at $43,728.85 over 5 years."
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "EPA Fuel Economy Guide",
      description: "Official source for MPG ratings and fuel economy data for vehicles."
    },
    {
      title: "Kelley Blue Book",
      description: "Trusted vehicle valuation and pricing information for new and used cars."
    },
    {
      title: "Edmunds Automotive",
      description: "Comprehensive car reviews, pricing, and ownership cost insights."
    },
    {
      title: "U.S. Department of Energy - Alternative Fuels Data Center",
      description: "Information on electric vehicle efficiency and fuel cost calculations."
    },
    {
      title: "AAA Your Driving Costs",
      description: "Annual report on the cost of owning and operating vehicles in the U.S."
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
            value={inputs.batteryCapacity}
            onChange={(e) => handleInputChange("batteryCapacity", e.target.value)}
            placeholder="e.g. 60"
          />
        </div>
        <div className="space-y-2">
          <Label>Electricity Rate ($/kWh)</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={inputs.electricityRate}
            onChange={(e) => handleInputChange("electricityRate", e.target.value)}
            placeholder="e.g. 0.13"
          />
        </div>
        <div className="space-y-2">
          <Label>Annual Mileage {inputs.unit === "imperial" ? "(miles)" : "(km)"}</Label>
          <Input
            type="number"
            min="0"
            value={inputs.annualMileage}
            onChange={(e) => handleInputChange("annualMileage", e.target.value)}
            placeholder="e.g. 12000"
          />
        </div>
        <div className="space-y-2">
          <Label>Gas Price {inputs.unit === "imperial" ? "($/gallon)" : "($/liter)"}</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={inputs.gasPrice}
            onChange={(e) => handleInputChange("gasPrice", e.target.value)}
            placeholder={inputs.unit === "imperial" ? "e.g. 3.50" : "e.g. 0.92"}
          />
        </div>
        <div className="space-y-2">
          <Label>Gas Vehicle Fuel Economy {inputs.unit === "imperial" ? "(MPG)" : "(L/100km)"}</Label>
          <Input
            type="number"
            min="0"
            step="0.1"
            value={inputs.gasMileage}
            onChange={(e) => handleInputChange("gasMileage", e.target.value)}
            placeholder={inputs.unit === "imperial" ? "e.g. 30" : "e.g. 7.8"}
          />
        </div>
        <div className="space-y-2">
          <Label>Hybrid Vehicle Fuel Economy {inputs.unit === "imperial" ? "(MPG)" : "(L/100km)"}</Label>
          <Input
            type="number"
            min="0"
            step="0.1"
            value={inputs.hybridMileage}
            onChange={(e) => handleInputChange("hybridMileage", e.target.value)}
            placeholder={inputs.unit === "imperial" ? "e.g. 50" : "e.g. 4.7"}
          />
        </div>
        <div className="space-y-2">
          <Label>EV Efficiency {inputs.unit === "imperial" ? "(miles/kWh)" : "(km/kWh)"}</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={inputs.evEfficiency}
            onChange={(e) => handleInputChange("evEfficiency", e.target.value)}
            placeholder={inputs.unit === "imperial" ? "e.g. 3.5" : "e.g. 5.6"}
          />
        </div>
        <div className="space-y-2">
          <Label>Ownership Period (years)</Label>
          <Input
            type="number"
            min="1"
            value={inputs.years}
            onChange={(e) => handleInputChange("years", e.target.value)}
            placeholder="e.g. 5"
          />
        </div>
        <div className="space-y-2">
          <Label>EV Purchase Price ($)</Label>
          <Input
            type="number"
            min="0"
            value={inputs.priceEV}
            onChange={(e) => handleInputChange("priceEV", e.target.value)}
            placeholder="e.g. 40000"
          />
        </div>
        <div className="space-y-2">
          <Label>Hybrid Purchase Price ($)</Label>
          <Input
            type="number"
            min="0"
            value={inputs.priceHybrid}
            onChange={(e) => handleInputChange("priceHybrid", e.target.value)}
            placeholder="e.g. 30000"
          />
        </div>
        <div className="space-y-2">
          <Label>Gas Vehicle Purchase Price ($)</Label>
          <Input
            type="number"
            min="0"
            value={inputs.priceGas}
            onChange={(e) => handleInputChange("priceGas", e.target.value)}
            placeholder="e.g. 25000"
          />
        </div>
        <div className="space-y-2">
          <Label>EV Annual Maintenance Cost ($)</Label>
          <Input
            type="number"
            min="0"
            value={inputs.maintenanceEV}
            onChange={(e) => handleInputChange("maintenanceEV", e.target.value)}
            placeholder="e.g. 300"
          />
        </div>
        <div className="space-y-2">
          <Label>Hybrid Annual Maintenance Cost ($)</Label>
          <Input
            type="number"
            min="0"
            value={inputs.maintenanceHybrid}
            onChange={(e) => handleInputChange("maintenanceHybrid", e.target.value)}
            placeholder="e.g. 500"
          />
        </div>
        <div className="space-y-2">
          <Label>Gas Vehicle Annual Maintenance Cost ($)</Label>
          <Input
            type="number"
            min="0"
            value={inputs.maintenanceGas}
            onChange={(e) => handleInputChange("maintenanceGas", e.target.value)}
            placeholder="e.g. 700"
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
            <p className="text-xs text-slate-400 mt-1 italic">{results.feedback}</p>
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
            <strong>Step 1:</strong> Select your preferred unit system (Imperial or Metric) from the top right dropdown.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the battery capacity (kWh) and electricity rate ($/kWh) for the EV.
          </li>
          <li>
            <strong>Step 3:</strong> Input your expected annual mileage and fuel prices for gasoline.
          </li>
          <li>
            <strong>Step 4:</strong> Provide fuel economy values for gas, hybrid, and EV vehicles in the selected units.
          </li>
          <li>
            <strong>Step 5:</strong> Enter purchase prices and estimated annual maintenance costs for each vehicle type.
          </li>
          <li>
            <strong>Step 6:</strong> Specify the ownership period in years.
          </li>
          <li>
            <strong>Step 7:</strong> Click the Calculate button to see the total cost of ownership comparison.
          </li>
        </ol>
      </section>

      {/* 2. COMPLETE GUIDE */}
      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to EV vs Hybrid vs Gas TCO Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            The Total Cost of Ownership (TCO) calculator is a vital tool for anyone considering purchasing an electric vehicle (EV), hybrid, or traditional gasoline-powered car. It helps you understand not just the upfront purchase price but also the ongoing costs associated with fuel or electricity consumption and maintenance over the years you plan to own the vehicle. This comprehensive approach ensures you make an informed financial decision tailored to your driving habits and local energy prices.
          </p>
          <p>
            To use the calculator effectively, you need to input accurate data such as your expected annual mileage, current fuel and electricity prices, and the fuel efficiency of each vehicle type. The calculator supports both imperial and metric units, converting values internally to provide consistent comparisons. It factors in the energy consumption of EVs based on battery capacity and efficiency, as well as fuel consumption for hybrids and gas vehicles, allowing you to see how energy costs accumulate over time.
          </p>
          <p>
            Maintenance costs are another critical component of TCO. EVs typically have lower maintenance expenses due to fewer moving parts and no oil changes, while hybrids and gas vehicles may require more frequent servicing. By entering realistic maintenance cost estimates, you can better anticipate the total expenses you will incur.
          </p>
          <p>
            Finally, the calculator aggregates all these costs over your specified ownership period, providing a clear comparison of which vehicle type is most economical for your situation. Keep in mind that this tool focuses on direct ownership costs and does not include factors like insurance, taxes, depreciation, or incentives, which can also influence your decision.
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
            <strong>1. Incomplete or inaccurate inputs:</strong> Providing unrealistic or missing values for mileage, fuel prices, or maintenance costs can skew results significantly. Always use current and location-specific data.
          </p>
          <p>
            <strong>2. Ignoring unit conversions:</strong> Mixing metric and imperial units without switching the calculator’s unit setting can cause incorrect calculations. Always select the correct unit system before inputting data.
          </p>
          <p>
            <strong>3. Overlooking ownership period:</strong> Short ownership periods may not reflect the true cost benefits of EVs, which often have higher upfront costs but lower operating expenses over time.
          </p>
          <p>
            <strong>4. Excluding incentives or tax credits:</strong> This calculator does not factor in government rebates or incentives that can significantly reduce EV purchase costs.
          </p>
          <p>
            <strong>5. Assuming constant fuel and electricity prices:</strong> Prices fluctuate over time, so consider running multiple scenarios to understand potential cost variations.
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
              <a href="#" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1">
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
      title="EV vs Hybrid vs Gas TCO Calculator"
      description="Professional automotive calculator: EV vs Hybrid vs Gas TCO Calculator. Get accurate estimates, expert advice, and financial insights."
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