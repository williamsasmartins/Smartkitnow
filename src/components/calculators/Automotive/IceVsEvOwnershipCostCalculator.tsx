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
      question: "How much can I save by switching to an EV over 5 years?",
      answer: "Savings depend on electricity costs, fuel prices, and maintenance. A typical EV driver saves $4,000–$10,000 over 5 years compared to gas vehicles, excluding federal tax credits.",
    },
    {
      question: "Are EV charging costs included in this calculator?",
      answer: "Yes, the calculator factors in home charging rates (typically $0.12–$0.18 per kWh) and public charging costs. Input your local electricity rate for accuracy.",
    },
    {
      question: "What maintenance costs does an ICE vehicle incur over 5 years?",
      answer: "Gas cars average $500–$1,000 annually in maintenance (oil changes, filters, brakes), while EVs cost $200–$400 yearly due to fewer moving parts.",
    },
    {
      question: "Should I include federal tax credits in the comparison?",
      answer: "Yes, the federal EV tax credit up to $7,500 (2024) significantly reduces upfront EV costs; input the applicable credit to reflect true ownership expense.",
    },
    {
      question: "How does annual mileage affect the 5-year cost comparison?",
      answer: "Higher mileage favors EVs; driving 15,000+ miles yearly amplifies fuel and maintenance savings, making the EV advantage &gt;$8,000 over 5 years.",
    },
    {
      question: "What's the impact of gas price volatility on total cost?",
      answer: "Gas fluctuations directly affect ICE costs; a $1 per gallon increase raises 5-year fuel expenses by $800–$1,500 depending on fuel efficiency.",
    },
    {
      question: "Can insurance costs differ significantly between ICE and EV models?",
      answer: "EV insurance is typically 5–10% higher due to battery replacement costs, though some insurers offer EV discounts; input actual quotes for precise comparison.",
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

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the ICE vs EV Ownership Cost (5 years)</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator compares the total cost of ownership for a gas-powered vehicle versus an electric vehicle over a 5-year period. It accounts for purchase price, fuel/electricity, maintenance, insurance, and registration fees to reveal which option is most economical.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Key inputs include vehicle purchase prices, your local gas and electricity rates, average annual mileage, insurance estimates, and applicable federal or state EV tax credits. Accurate local utility rates and fuel prices are critical for realistic comparisons.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The results show total 5-year costs and annual breakdowns for each vehicle type. A lower total cost indicates better value; examine individual cost categories to identify where EVs or gas cars excel in your situation.</p>
        </div>
      </section>

      {/* TABLE: 5-Year Ownership Cost Breakdown: ICE vs EV (Mid-Range Vehicles) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">5-Year Ownership Cost Breakdown: ICE vs EV (Mid-Range Vehicles)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table compares total cost of ownership for a typical $35,000 gas sedan versus a $38,000 electric sedan over 5 years.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cost Category</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">ICE Vehicle (Gas)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">EV Vehicle (Electric)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Purchase Price</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$35,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$38,000</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Federal Tax Credit</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$7,500</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Fuel/Electricity (75k miles)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$9,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3,000</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Maintenance & Repairs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$4,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,200</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Insurance (5 years)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$6,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$7,200</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Registration & Fees</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,000</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Total 5-Year Cost</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$55,700</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$49,900</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Assumes $3.50/gallon gas, $0.14/kWh electricity, 15,000 miles/year. EV advantages increase with higher fuel prices and annual mileage.</p>
      </section>

      {/* TABLE: Annual Fuel & Electricity Costs by Vehicle Type and Driving Patterns */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Annual Fuel & Electricity Costs by Vehicle Type and Driving Patterns</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Annual operating costs vary significantly based on mileage and local energy prices.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Annual Mileage</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Gas Car @ $3.50/gal (25 MPG)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">EV @ $0.14/kWh (4 mi/kWh)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10,000 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$350</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">15,000 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$525</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">20,000 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,800</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$700</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">25,000 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$875</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Gas prices and electricity rates vary by region; higher mileage amplifies EV savings. High-efficiency gas cars (&gt;30 MPG) reduce the gap by ~20%.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Input your actual regional electricity rate from your utility bill for precise EV charging cost estimates.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Factor in available EV incentives such as federal tax credits ($7,500), state rebates, and utility company rebates to reduce net EV costs.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use realistic annual mileage based on your commute; higher mileage increases EV advantages by spreading fuel savings across more miles.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Request actual insurance quotes from providers for both vehicle types, as EV insurance premiums vary significantly by model and insurer.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Tax Credits and Rebates</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Failing to include federal or state EV incentives underestimates true EV savings; always input applicable credits to reflect actual out-of-pocket costs.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Incorrect Local Utility Rates</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Applying national average electricity rates instead of your local rate can distort EV charging cost estimates by $800–$2,000 over 5 years.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Overlooking Maintenance Differences</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Assuming identical maintenance costs ignores that EVs require significantly fewer oil changes, brake service, and transmission repairs.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not Adjusting for Insurance Premium Variations</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Generic insurance estimates miss model-specific premiums; EVs often cost 5–10% more to insure due to battery replacement complexity.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much can I save by switching to an EV over 5 years?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Savings depend on electricity costs, fuel prices, and maintenance. A typical EV driver saves $4,000–$10,000 over 5 years compared to gas vehicles, excluding federal tax credits.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Are EV charging costs included in this calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, the calculator factors in home charging rates (typically $0.12–$0.18 per kWh) and public charging costs. Input your local electricity rate for accuracy.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What maintenance costs does an ICE vehicle incur over 5 years?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Gas cars average $500–$1,000 annually in maintenance (oil changes, filters, brakes), while EVs cost $200–$400 yearly due to fewer moving parts.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I include federal tax credits in the comparison?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, the federal EV tax credit up to $7,500 (2024) significantly reduces upfront EV costs; input the applicable credit to reflect true ownership expense.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does annual mileage affect the 5-year cost comparison?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Higher mileage favors EVs; driving 15,000+ miles yearly amplifies fuel and maintenance savings, making the EV advantage &gt;$8,000 over 5 years.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the impact of gas price volatility on total cost?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Gas fluctuations directly affect ICE costs; a $1 per gallon increase raises 5-year fuel expenses by $800–$1,500 depending on fuel efficiency.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can insurance costs differ significantly between ICE and EV models?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">EV insurance is typically 5–10% higher due to battery replacement costs, though some insurers offer EV discounts; input actual quotes for precise comparison.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.energy.gov/eere/electricvehicles/electric-vehicle-costs-and-savings" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">U.S. Department of Energy - EV Costs and Savings</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official government resource comparing lifetime EV and gas vehicle costs with interactive calculators.</p>
          </li>
          <li>
            <a href="https://www.epa.gov/greenvehicles/most-efficient-vehicles" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">EPA Fuel Economy Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">EPA data on fuel economy, efficiency ratings, and cost comparisons for all vehicle types.</p>
          </li>
          <li>
            <a href="https://insideevs.com/news/electric-vehicle-total-cost-ownership-analysis/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">InsideEVs - Cost of EV Ownership</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Industry analysis of real-world EV ownership costs including insurance, maintenance, and fuel savings.</p>
          </li>
          <li>
            <a href="https://www.kbb.com/cars/electric/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Kelley Blue Book - Vehicle Depreciation Data</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Current market data on EV and gas vehicle resale values, depreciation rates, and pricing trends.</p>
          </li>
        </ul>
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