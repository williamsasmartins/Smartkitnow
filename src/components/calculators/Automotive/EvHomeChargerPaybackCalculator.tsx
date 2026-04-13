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

export default function EvHomeChargerPaybackCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    dailyMiles: "", // Average daily miles driven
    electricityRate: "", // Cost per kWh in $
    chargerCost: "", // Total home charger installation cost in $
    evEfficiency: "", // EV efficiency in miles per kWh
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    const dailyMiles = parseFloat(inputs.dailyMiles);
    const electricityRate = parseFloat(inputs.electricityRate);
    const chargerCost = parseFloat(inputs.chargerCost);
    const evEfficiency = parseFloat(inputs.evEfficiency);

    if (
      isNaN(dailyMiles) || dailyMiles <= 0 ||
      isNaN(electricityRate) || electricityRate <= 0 ||
      isNaN(chargerCost) || chargerCost < 0 ||
      isNaN(evEfficiency) || evEfficiency <= 0
    ) {
      return {
        primary: "—",
        secondary: "$0.00",
        details: "Please enter valid positive numbers for all inputs.",
        feedback: "Invalid input"
      };
    }

    // Calculate daily energy consumption (kWh)
    const dailyKWh = dailyMiles / evEfficiency;

    // Calculate daily charging cost
    const dailyCost = dailyKWh * electricityRate;

    // Calculate annual charging cost
    const annualCost = dailyCost * 365;

    // Assume average gasoline cost per mile for comparison (e.g., $0.12/mile)
    // This is a rough average for a gasoline vehicle (fuel + maintenance)
    const gasCostPerMile = 0.12;

    // Annual gasoline cost for same miles
    const annualGasCost = dailyMiles * 365 * gasCostPerMile;

    // Annual savings by using EV charger at home
    const annualSavings = annualGasCost - annualCost;

    // Payback period in years
    const paybackYears = annualSavings > 0 ? (chargerCost / annualSavings) : Infinity;

    return {
      primary: paybackYears === Infinity ? "N/A" : paybackYears.toFixed(1) + " years",
      secondary: `$${annualSavings.toFixed(2)} saved per year`,
      details: `Annual EV charging cost: $${annualCost.toFixed(2)} vs Gasoline cost: $${annualGasCost.toFixed(2)}. Charger cost: $${chargerCost.toFixed(2)}.`,
      feedback: annualSavings > 0 ? "Good investment" : "No savings with current inputs"
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "What is the average cost to install a Level 2 home EV charger in 2025?",
      answer: "The average cost to install a Level 2 home charger ranges from $500 to $2,500, with equipment typically costing $400–$900 and installation labor running $100–$1,600 depending on electrical panel upgrades needed. Most homeowners with existing 200-amp service pay closer to $800–$1,200 total. Installation complexity increases significantly if your home requires panel upgrades, new circuits, or conduit runs exceeding 50 feet.",
    },
    {
      question: "How long does it take to recoup the cost of a home EV charger through fuel savings?",
      answer: "Payback periods typically range from 3 to 7 years for most EV owners, assuming average annual mileage of 12,000–15,000 miles and local electricity costs of $0.14–$0.16 per kWh. A Tesla Model 3 charging at home costs approximately $3–$4 per 100 miles, versus $10–$12 for gasoline vehicles at $3.50 per gallon. Federal tax credits up to $500 for charger installation can reduce payback periods by 6–12 months.",
    },
    {
      question: "Am I eligible for the federal EV charger tax credit in 2025?",
      answer: "Yes, the federal Inflation Reduction Act provides up to a $500 tax credit for qualified residential Level 2 charger installation through December 31, 2032. You must own the home where the charger is installed, and the charger must be for a vehicle weighing less than 14,000 pounds. Income limits apply: &lt;$200,000 for individual filers and &lt;$400,000 for joint filers; over these limits, the credit phases out.",
    },
    {
      question: "What factors most impact the total installation cost of a home charger?",
      answer: "The four largest cost factors are: (1) electrical panel upgrades ($500–$3,000 if a new 200-amp or larger service is needed), (2) distance from panel to charger location (roughly $100–$200 per 10 feet for conduit and wiring), (3) local labor rates ($50–$150 per hour), and (4) permitting and inspection fees ($100–$500 depending on your jurisdiction). A charger placed 100+ feet from the panel can add $1,000+ to installation costs.",
    },
    {
      question: "How much money will I save annually by charging at home versus buying gasoline?",
      answer: "Annual savings depend on your electricity rate and vehicle efficiency, but a typical EV owner saves $600–$1,200 per year compared to a gasoline vehicle driving 12,000 miles annually. At $0.15 per kWh and 25 MPGe (miles per gallon equivalent), home charging costs roughly $540 annually, versus $1,680 for a gasoline vehicle at $3.50 per gallon. These savings increase in regions with lower electricity rates and higher fuel prices.",
    },
    {
      question: "Should I install a Level 1 or Level 2 charger at home?",
      answer: "Level 2 chargers (240V) are recommended for most EV owners because they add 25–30 miles of range per hour, versus only 2–3 miles per hour for Level 1 (120V). Level 1 chargers cost $300–$600 and require no installation, making them suitable only for hybrid owners or secondary residences. Level 2 installation costs $800–$2,500 but provides near-full overnight charging for typical daily commutes, eliminating the need for public charging infrastructure.",
    },
    {
      question: "What permits and inspections are required for home charger installation?",
      answer: "Most jurisdictions require an electrical permit ($100–$500) and a final inspection to verify the installation meets National Electrical Code (NEC) Article 625 standards. Some municipalities bundle this into a single process, while others may require separate inspections for panel work and charger installation. Licensed electricians typically handle permitting as part of their service; failure to obtain permits can result in fines and void your homeowner's insurance coverage for electrical claims.",
    },
    {
      question: "Can I install a home EV charger myself to save money?",
      answer: "DIY installation is not recommended and may be illegal in your jurisdiction; most areas require a licensed electrician for any work on or near the electrical panel. Improper installation can create fire hazards, void manufacturer warranties, disqualify you from tax credits, and violate local electrical codes. Unless you hold an active electrician's license, hiring a professional is both the safest and most cost-effective approach to ensure proper installation and compliance.",
    },
    {
      question: "How does my local electricity rate affect the payback period calculation?",
      answer: "Electricity rates directly determine your per-mile charging cost; a 1¢ per kWh difference changes annual charging costs by roughly $100–$150 for typical EV owners driving 12,000–15,000 miles yearly. Regions with rates above $0.18 per kWh may see payback periods extended to 8–10 years, while areas with rates below $0.12 per kWh can achieve payback in 2–4 years. The calculator should account for local rates, seasonal rate variations, and any off-peak charging discounts your utility offers.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Financing a $1,500 Level 2 home charger installation for an EV owner who drives 30 miles daily, with an electricity rate of $0.13 per kWh and an EV efficiency of 3.5 miles per kWh.",
    steps: [
      {
        label: "Step 1: Calculate daily energy consumption",
        explanation: "30 miles ÷ 3.5 miles/kWh = 8.57 kWh per day"
      },
      {
        label: "Step 2: Calculate daily charging cost",
        explanation: "8.57 kWh × $0.13/kWh = $1.11 per day"
      },
      {
        label: "Step 3: Calculate annual charging cost",
        explanation: "$1.11 × 365 days = $405.15 per year"
      },
      {
        label: "Step 4: Calculate annual gasoline cost for same miles",
        explanation: "30 miles × 365 days × $0.12/mile = $1,314 per year"
      },
      {
        label: "Step 5: Calculate annual savings",
        explanation: "$1,314 - $405.15 = $908.85 saved per year"
      },
      {
        label: "Step 6: Calculate payback period",
        explanation: "$1,500 ÷ $908.85 ≈ 1.65 years to recoup installation cost"
      }
    ],
    result: "Final Result: The home charger installation will pay for itself in approximately 1.7 years through fuel savings."
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "EPA Fuel Economy Guide",
      description: "Official source for vehicle efficiency ratings and fuel economy data.",
      url: "https://www.fueleconomy.gov/"
    },
    {
      title: "U.S. Energy Information Administration (EIA)",
      description: "Provides current electricity rates and energy consumption statistics.",
      url: "https://www.eia.gov/"
    },
    {
      title: "Department of Energy - Electric Vehicle Charging",
      description: "Comprehensive information on EV charging types, costs, and installation.",
      url: "https://afdc.energy.gov/fuels/electricity_infrastructure.html"
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
          <Label>Average Daily Miles Driven</Label>
          <Input
            type="number"
            min="0"
            step="0.1"
            placeholder="e.g. 30"
            value={inputs.dailyMiles}
            onChange={(e) => handleInputChange("dailyMiles", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Electricity Rate ($ per kWh)</Label>
          <Input
            type="number"
            min="0"
            step="0.001"
            placeholder="e.g. 0.13"
            value={inputs.electricityRate}
            onChange={(e) => handleInputChange("electricityRate", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Home Charger Installation Cost ($)</Label>
          <Input
            type="number"
            min="0"
            step="1"
            placeholder="e.g. 1500"
            value={inputs.chargerCost}
            onChange={(e) => handleInputChange("chargerCost", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>EV Efficiency (miles per kWh)</Label>
          <Input
            type="number"
            min="0"
            step="0.1"
            placeholder="e.g. 3.5"
            value={inputs.evEfficiency}
            onChange={(e) => handleInputChange("evEfficiency", e.target.value)}
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg">
        <Zap className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Estimated Payback Period</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">{results.primary}</div>
            <div className="text-xl font-bold mt-2">{results.secondary}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
            <p className="mt-1 text-sm font-medium text-green-700 dark:text-green-400">{results.feedback}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Home Charger Installation Cost & Payback Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Home Charger Installation Cost &amp; Payback Calculator helps EV owners estimate the total cost of installing a Level 2 home charger and calculate how long it will take to recoup that investment through fuel savings. This calculator is essential for anyone evaluating whether home charging is financially viable and for understanding the true lifetime value of a residential EV charging installation. By comparing installation costs against projected energy savings, you can make an informed decision about the right time and charger type for your household.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The calculator's key inputs include your current electricity rate (per kWh), estimated annual EV mileage, the proposed charger location relative to your electrical panel, your current electrical service capacity, and any anticipated panel upgrades. Each input directly impacts the final installation cost and the annual savings calculation—for example, a charger installed 150 feet from your panel costs significantly more than one placed 20 feet away. Understanding these variables helps you optimize your installation plan before receiving contractor quotes.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The results provide a clear breakdown of equipment costs, labor, permits, and any necessary electrical work, followed by a payback period calculation that shows how many years until your fuel savings offset the total installation investment. A payback period of 3–5 years is typical for most homeowners; periods shorter than 2 years suggest very favorable electricity rates and high mileage, while periods exceeding 7 years may warrant comparing Level 1 alternatives or waiting for potential future incentives. Use these results to negotiate with installers, identify tax credit opportunities, and determine the optimal timing for your charger purchase.</p>
        </div>
      </section>

      {/* TABLE: Average Home EV Charger Installation Costs by Component (2025) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Average Home EV Charger Installation Costs by Component (2025)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table breaks down typical cost components for a Level 2 home charger installation across standard residential scenarios.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cost Component</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Low End</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">High End</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Charger Equipment (240V Level 2)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$900</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Brands: Tesla, Leviton, Clipper Creek, Siemens</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Wiring & Conduit (Per 50 ft)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Copper wire (6 or 8 AWG) + PVC/metal conduit</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Panel Upgrade / Circuit Installation</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,600</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">New dedicated 40–60A circuit; panel upgrade if full service needed</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Labor (4–8 hours typical)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$300</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Regional variation; $75–$150 per hour average</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Permits & Inspections</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Varies by municipality; required in most jurisdictions</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Total Range (Typical Install)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$4,700</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Most homeowners pay $800–$2,500 for standard 200A service</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Costs exclude any major electrical panel replacements (&gt;$3,000) or distances &gt;100 feet from existing panel.</p>
      </section>

      {/* TABLE: Annual EV Charging Cost vs. Gasoline (12,000 Miles/Year) */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Annual EV Charging Cost vs. Gasoline (12,000 Miles/Year)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table compares annual fuel costs between home EV charging and traditional gasoline vehicles across different electricity and fuel price scenarios.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Electricity Rate (per kWh)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">EV Annual Cost</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Gasoline Annual Cost (@ $3.50/gal)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Annual Savings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$0.12 per kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$432</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,680</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,248</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$0.15 per kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$540</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,680</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,140</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$0.18 per kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$648</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,680</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,032</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$0.21 per kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$756</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,680</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$924</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Calculations assume EV efficiency of 25 MPGe and gasoline vehicle efficiency of 25 MPG. Savings increase proportionally with annual mileage and decrease with higher electricity rates.</p>
      </section>

      {/* TABLE: Estimated Payback Periods by Installation Cost & Annual Savings */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Estimated Payback Periods by Installation Cost & Annual Savings</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows payback periods in years for different total installation costs and annual savings scenarios.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Installation Cost</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Annual Savings ($1,000)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Annual Savings ($1,200)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Annual Savings ($1,400)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$1,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.0 year</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.8 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.7 years</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$1,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.5 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.3 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.1 years</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$2,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.0 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.7 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.4 years</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$2,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.5 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.1 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.8 years</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$3,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.0 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.5 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.1 years</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Payback periods assume consistent annual savings; federal tax credits up to $500 reduce these figures by 6–12 months.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Obtain quotes from at least three licensed electricians before committing to installation, as labor costs vary significantly by region and contractor expertise. Request itemized estimates that break down equipment, labor, permits, and any panel work separately—this transparency helps you compare true installation costs and identify potential cost-saving opportunities like choosing a standard-capacity charger or optimizing conduit routing.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Verify your home's electrical service capacity before installation; homes with older 100-amp service or those powering large HVAC systems may require a full panel upgrade ($2,000–$4,000), which can dramatically increase total costs. Consulting with a licensed electrician during the planning phase helps identify these issues early and prevents costly surprises after purchase.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Take full advantage of available tax credits and incentives: the federal $500 charger tax credit, your state's EV incentive programs, and any local utility rebates that may reduce your net installation cost by $500–$1,500. The calculator should account for these reductions to provide accurate payback periods—check the IRS website and your state's energy office for the latest qualification requirements and income limits.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Plan your charger location strategically to minimize conduit runs and electrical work; placing the charger on the same wall as your panel or garage wall closest to the house electrical entry can save $500–$1,000 in labor and materials. If you're planning a renovation or already have an electrician working on your home, bundling EV charger installation into that project may reduce per-hour labor rates and permitting hassles.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to account for electrical panel upgrades</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many homeowners underestimate installation costs by failing to include potential panel upgrades or new circuit costs. If your home has older 100-amp or 125-amp service, or if your panel is already heavily loaded, you may need a full upgrade that doubles or triples the installation expense.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using national average electricity rates instead of your local rate</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">The payback period calculation is highly sensitive to electricity costs; using a national average of $0.15 per kWh instead of your actual local rate of $0.22 per kWh significantly underestimates your payback period. Always input your specific utility rate from your electricity bill to get an accurate calculation.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring permitting and inspection requirements</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Skipping permits and hiring unlicensed installers to save $200–$400 can result in fines, voided insurance coverage, disqualification from tax credits, and safety hazards. Permits and inspections are mandatory in most jurisdictions and are essential to protect your home and maximize your investment.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Overestimating annual mileage to inflate fuel savings</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">The calculator's accuracy depends on realistic mileage projections; inflating your annual mileage estimate by 30–50% to show shorter payback periods creates false expectations. Use your actual historical mileage or conservative estimates (&lt;15,000 miles/year for typical commuters) to avoid disappointment.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the average cost to install a Level 2 home EV charger in 2025?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The average cost to install a Level 2 home charger ranges from $500 to $2,500, with equipment typically costing $400–$900 and installation labor running $100–$1,600 depending on electrical panel upgrades needed. Most homeowners with existing 200-amp service pay closer to $800–$1,200 total. Installation complexity increases significantly if your home requires panel upgrades, new circuits, or conduit runs exceeding 50 feet.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How long does it take to recoup the cost of a home EV charger through fuel savings?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Payback periods typically range from 3 to 7 years for most EV owners, assuming average annual mileage of 12,000–15,000 miles and local electricity costs of $0.14–$0.16 per kWh. A Tesla Model 3 charging at home costs approximately $3–$4 per 100 miles, versus $10–$12 for gasoline vehicles at $3.50 per gallon. Federal tax credits up to $500 for charger installation can reduce payback periods by 6–12 months.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Am I eligible for the federal EV charger tax credit in 2025?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, the federal Inflation Reduction Act provides up to a $500 tax credit for qualified residential Level 2 charger installation through December 31, 2032. You must own the home where the charger is installed, and the charger must be for a vehicle weighing less than 14,000 pounds. Income limits apply: &lt;$200,000 for individual filers and &lt;$400,000 for joint filers; over these limits, the credit phases out.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What factors most impact the total installation cost of a home charger?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The four largest cost factors are: (1) electrical panel upgrades ($500–$3,000 if a new 200-amp or larger service is needed), (2) distance from panel to charger location (roughly $100–$200 per 10 feet for conduit and wiring), (3) local labor rates ($50–$150 per hour), and (4) permitting and inspection fees ($100–$500 depending on your jurisdiction). A charger placed 100+ feet from the panel can add $1,000+ to installation costs.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much money will I save annually by charging at home versus buying gasoline?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Annual savings depend on your electricity rate and vehicle efficiency, but a typical EV owner saves $600–$1,200 per year compared to a gasoline vehicle driving 12,000 miles annually. At $0.15 per kWh and 25 MPGe (miles per gallon equivalent), home charging costs roughly $540 annually, versus $1,680 for a gasoline vehicle at $3.50 per gallon. These savings increase in regions with lower electricity rates and higher fuel prices.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I install a Level 1 or Level 2 charger at home?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Level 2 chargers (240V) are recommended for most EV owners because they add 25–30 miles of range per hour, versus only 2–3 miles per hour for Level 1 (120V). Level 1 chargers cost $300–$600 and require no installation, making them suitable only for hybrid owners or secondary residences. Level 2 installation costs $800–$2,500 but provides near-full overnight charging for typical daily commutes, eliminating the need for public charging infrastructure.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What permits and inspections are required for home charger installation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most jurisdictions require an electrical permit ($100–$500) and a final inspection to verify the installation meets National Electrical Code (NEC) Article 625 standards. Some municipalities bundle this into a single process, while others may require separate inspections for panel work and charger installation. Licensed electricians typically handle permitting as part of their service; failure to obtain permits can result in fines and void your homeowner's insurance coverage for electrical claims.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I install a home EV charger myself to save money?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">DIY installation is not recommended and may be illegal in your jurisdiction; most areas require a licensed electrician for any work on or near the electrical panel. Improper installation can create fire hazards, void manufacturer warranties, disqualify you from tax credits, and violate local electrical codes. Unless you hold an active electrician's license, hiring a professional is both the safest and most cost-effective approach to ensure proper installation and compliance.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does my local electricity rate affect the payback period calculation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Electricity rates directly determine your per-mile charging cost; a 1¢ per kWh difference changes annual charging costs by roughly $100–$150 for typical EV owners driving 12,000–15,000 miles yearly. Regions with rates above $0.18 per kWh may see payback periods extended to 8–10 years, while areas with rates below $0.12 per kWh can achieve payback in 2–4 years. The calculator should account for local rates, seasonal rate variations, and any off-peak charging discounts your utility offers.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.irs.gov/credits-deductions/energy-efficient-home-improvement-credit" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">IRS Residential Clean Energy Credit (Form 8908)</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official IRS guidance on the $500 federal tax credit for residential EV charger installation, including eligibility requirements and income limitations.</p>
          </li>
          <li>
            <a href="https://www.energy.gov/eere/electricvehicles/charging-home" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">U.S. Department of Energy – Home EV Charging Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive guide on home EV charger types, installation considerations, and cost factors from the federal Department of Energy.</p>
          </li>
          <li>
            <a href="https://www.nfpa.org/codes-and-standards/all-codes-and-standards/list-of-codes-and-standards/detail?code=70" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">National Electrical Code Article 625 (EV Charging Systems)</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">NFPA's technical standards for safe EV charger installation, compliance requirements, and electrical safety specifications.</p>
          </li>
          <li>
            <a href="https://afdc.energy.gov/fuels/electricity-home.html" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Alternative Fuels Data Center – Charging Station Locator & Cost Database</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">U.S. Department of Energy resource providing regional electricity rates, home charging cost comparisons, and state incentive information.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Home Charger Installation Cost & Payback Calculator"
      description="Professional automotive calculator: Home Charger Installation Cost & Payback Calculator. Get accurate estimates, expert advice, and financial insights."
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