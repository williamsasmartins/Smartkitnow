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

export default function EvHomePublicChargingCostTimeCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    batteryCapacity: "", // kWh
    homeRate: "", // $/kWh
    publicRate: "", // $/kWh
    homeChargePower: "", // kW (charging speed at home)
    publicChargePower: "", // kW (charging speed at public station)
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    const battery = parseFloat(inputs.batteryCapacity);
    const homeRate = parseFloat(inputs.homeRate);
    const publicRate = parseFloat(inputs.publicRate);
    const homePower = parseFloat(inputs.homeChargePower);
    const publicPower = parseFloat(inputs.publicChargePower);

    if (
      isNaN(battery) || battery <= 0 ||
      isNaN(homeRate) || homeRate <= 0 ||
      isNaN(publicRate) || publicRate <= 0 ||
      isNaN(homePower) || homePower <= 0 ||
      isNaN(publicPower) || publicPower <= 0
    ) {
      return {
        primary: "—",
        secondary: "Please enter valid positive numbers for all inputs.",
        details: "",
        feedback: ""
      };
    }

    // Calculate cost to fully charge at home and public
    const homeCost = battery * homeRate;
    const publicCost = battery * publicRate;

    // Calculate time to fully charge at home and public (hours)
    // Time = Battery Capacity (kWh) / Charging Power (kW)
    const homeTime = battery / homePower;
    const publicTime = battery / publicPower;

    return {
      primary: `Home: ${homeTime.toFixed(2)} hrs | Public: ${publicTime.toFixed(2)} hrs`,
      secondary: `Cost - Home: $${homeCost.toFixed(2)} | Public: $${publicCost.toFixed(2)}`,
      details: `Charging ${battery} kWh battery at ${homePower} kW (home) and ${publicPower} kW (public).`,
      feedback: `Home charging is ${homeCost < publicCost ? "cheaper" : "more expensive"} and ${homeTime < publicTime ? "faster" : "slower"} than public charging.`
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "How much does it cost to charge an EV at home versus at a public charging station?",
      answer: "Home charging typically costs $0.03–$0.05 per mile using residential electricity rates averaging $0.14–$0.16 per kWh, while public Level 2 chargers cost $0.07–$0.12 per mile and DC fast chargers range from $0.15–$0.30 per mile. A typical EV with a 60 kWh battery costs roughly $8–$10 to fully charge at home, compared to $15–$25 at public Level 2 stations and $20–$35 at DC fast chargers. Home charging is typically 40–60% cheaper for routine daily charging.",
    },
    {
      question: "How long does it take to charge an EV at home compared to public chargers?",
      answer: "A Level 1 home charger (120V) adds 2–5 miles of range per hour and requires 24–48 hours for a full charge, while a Level 2 home charger (240V) adds 25–30 miles per hour and fully charges in 6–10 hours. Public Level 2 chargers provide similar speeds (25–30 miles/hour), while DC fast chargers deliver 150–200 miles in 20–30 minutes. For overnight home charging, you'll wake up with a full battery; for road trips, public DC fast chargers are necessary.",
    },
    {
      question: "What is the break-even point for installing a home EV charger?",
      answer: "A Level 2 home charger installation costs $500–$2,500 depending on electrical upgrades required. At typical usage of 12,000 miles annually, home charging saves $300–$600 per year compared to public charging, meaning the break-even occurs in 2–8 years. Federal tax credits of up to $1,000 and state incentives can accelerate this timeline by 1–2 years.",
    },
    {
      question: "How do time-of-use electricity rates affect home charging costs?",
      answer: "Time-of-use (TOU) rates vary by utility, typically offering off-peak rates of $0.08–$0.12 per kWh (usually 9 PM–6 AM) versus peak rates of $0.18–$0.25 per kWh. Charging during off-peak hours can reduce home charging costs by 30–50% compared to peak charging. Many EV owners can save $200–$400 annually by scheduling charging during off-peak windows using scheduled departure features.",
    },
    {
      question: "What is the difference between Level 1, Level 2, and DC fast charging?",
      answer: "Level 1 uses standard 120V outlets (2–5 miles/hour, found at home), Level 2 uses 240V circuits (25–30 miles/hour, at home or public locations), and DC fast charging uses 400V–900V systems (150–200 miles in 20–30 minutes, exclusively at public stations). Level 1 is free to install but impractical for regular use; Level 2 is ideal for home and daily commuting; DC fast is essential for long-distance travel. Most EV owners rely on home Level 2 for 80% of charging and public stations for occasional rapid top-ups.",
    },
    {
      question: "How do subscription and membership plans at public charging networks compare to pay-per-use?",
      answer: "Pay-per-use public charging averages $0.25–$0.50 per kWh or $3–$5 per session, while membership plans like EVgo or Electrify America cost $10–$50 monthly and reduce per-kWh rates to $0.15–$0.35. For users charging publicly &lt;5 times monthly, pay-per-use is cheaper; for &gt;10 public charges monthly, a $20–$30 monthly membership typically saves $100–$200 annually. Many workplace and multi-unit home charging networks offer free or subsidized charging, eliminating this decision entirely.",
    },
    {
      question: "What percentage of EV charging happens at home versus public stations?",
      answer: "Studies show 70–85% of EV charging occurs at home, while 15–30% happens at work, destination, or public chargers. This distribution heavily favors home charging because most daily driving is &lt;50 miles, easily covered by overnight home charging. Public charging is reserved for road trips, emergency top-ups, and situations where home charging is unavailable.",
    },
    {
      question: "How do ambient temperature and battery condition affect charging time and cost?",
      answer: "Cold temperatures (&lt;32°F) reduce charging efficiency by 10–20% and extend charging times by 5–15% due to battery preconditioning requirements. Hot temperatures (&gt;85°F) can trigger thermal management systems that slightly reduce charging speed but have minimal cost impact. Battery degradation over 5–10 years reduces capacity by 5–10%, slightly extending charging times but not significantly affecting per-mile costs on modern EVs with 200+ mile ranges.",
    },
    {
      question: "What hidden costs should I consider when comparing home versus public charging?",
      answer: "Home charging hidden costs include increased electricity consumption ($30–$100 annually), potential electrical panel upgrades ($800–$3,000), and circuit breaker additions. Public charging hidden costs include membership fees ($10–$50 monthly), session surcharges ($1–$3), and idle fees ($0.50–$1.00 per minute after charging completes). Additionally, public charging is less convenient for daily use and may incur parking or access fees at some locations.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Financing a 60 kWh electric SUV with a home electricity rate of $0.13/kWh and public charging rate of $0.30/kWh. Home charger power is 7 kW, and public fast charger power is 50 kW.",
    steps: [
      {
        label: "Step 1: Calculate home charging cost",
        explanation: "60 kWh battery × $0.13/kWh = $7.80"
      },
      {
        label: "Step 2: Calculate public charging cost",
        explanation: "60 kWh battery × $0.30/kWh = $18.00"
      },
      {
        label: "Step 3: Calculate home charging time",
        explanation: "60 kWh ÷ 7 kW = 8.57 hours"
      },
      {
        label: "Step 4: Calculate public charging time",
        explanation: "60 kWh ÷ 50 kW = 1.20 hours"
      },
      {
        label: "Result",
        explanation:
          "Charging at home costs $7.80 and takes about 8.57 hours, while public charging costs $18.00 and takes about 1.20 hours."
      }
    ],
    result: "Home charging is significantly cheaper but slower compared to public charging."
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "U.S. Department of Energy - Alternative Fuels Data Center",
      description: "Comprehensive data on electric vehicle charging and costs.",
      url: "https://afdc.energy.gov/fuels/electricity_cost.html"
    },
    {
      title: "EPA Fuel Economy Guide",
      description: "Official source for electric vehicle efficiency and charging info.",
      url: "https://www.fueleconomy.gov/feg/evtech.shtml"
    },
    {
      title: "ChargePoint - EV Charging Network",
      description: "Information on public charging stations and pricing.",
      url: "https://www.chargepoint.com/"
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
            step="0.1"
            placeholder="e.g. 60"
            value={inputs.batteryCapacity}
            onChange={(e) => handleInputChange("batteryCapacity", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Home Electricity Rate ($/kWh)</Label>
          <Input
            type="number"
            min="0"
            step="0.001"
            placeholder="e.g. 0.13"
            value={inputs.homeRate}
            onChange={(e) => handleInputChange("homeRate", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Public Charging Rate ($/kWh)</Label>
          <Input
            type="number"
            min="0"
            step="0.001"
            placeholder="e.g. 0.30"
            value={inputs.publicRate}
            onChange={(e) => handleInputChange("publicRate", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Home Charging Power (kW)</Label>
          <Input
            type="number"
            min="0"
            step="0.1"
            placeholder="e.g. 7"
            value={inputs.homeChargePower}
            onChange={(e) => handleInputChange("homeChargePower", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Public Charging Power (kW)</Label>
          <Input
            type="number"
            min="0"
            step="0.1"
            placeholder="e.g. 50"
            value={inputs.publicChargePower}
            onChange={(e) => handleInputChange("publicChargePower", e.target.value)}
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg">
        <Zap className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Estimated Result</span>
            <div className="text-3xl font-extrabold text-blue-600 my-3">{results.primary}</div>
            <div className="text-xl font-bold mt-2">{results.secondary}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
            <p className="mt-3 italic text-sm text-slate-700 dark:text-slate-400">{results.feedback}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the EV Home vs Public Charging Cost & Time Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The EV Home vs Public Charging Cost & Time Calculator helps you compare the total cost and charging duration of powering your electric vehicle at home versus using public charging networks. This tool is essential for EV owners and prospective buyers who want to understand long-term ownership costs, determine the financial viability of home charger installation, and optimize their charging strategy based on driving patterns and electricity rates.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use this calculator, input your vehicle's battery capacity (typically 40–100 kWh), your home electricity rate (found on your utility bill), local public charging rates (Level 2 and DC fast prices from networks in your area), your annual mileage, and the percentage of charging you expect to do at home versus public stations. The calculator will also ask for home charger installation costs if you haven't yet installed one, allowing you to see the break-even timeline.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The results display your annual home charging cost, public charging cost, total charging expenditure, and annual savings by choosing home charging. The calculator also projects payback periods for home charger installation and shows charging time comparisons for different scenarios. Use these insights to decide whether to install a home charger, adjust your charging behavior, or negotiate workplace charging access to minimize overall EV ownership costs.</p>
        </div>
      </section>

      {/* TABLE: Charging Cost Comparison by Type (2024-2025 Benchmarks) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Charging Cost Comparison by Type (2024-2025 Benchmarks)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Real-world charging costs per mile and full-charge scenarios across home Level 1, home Level 2, public Level 2, and DC fast charging options.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Charger Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cost Per Mile</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cost Per kWh</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Full Charge Cost (60 kWh)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Speed (Miles/Hour)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Home Level 1 (120V)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.03–$0.04</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.14–$0.16</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$8.40–$9.60</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2–5</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Home Level 2 (240V)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.03–$0.05</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.14–$0.16</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$8.40–$9.60</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25–30</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Public Level 2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.07–$0.12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.22–$0.35</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$13.20–$21.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25–30</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">DC Fast Charging</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.15–$0.30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.35–$0.65</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$21.00–$39.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">150–200</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Workplace Charging (Free)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6–20</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Costs based on national average residential electricity ($0.14–$0.16/kWh) and public network rates. DC fast charging prices vary significantly by network and region; Electrify America, EVgo, and Tesla Supercharger rates range $0.30–$0.65/kWh as of 2025.</p>
      </section>

      {/* TABLE: Annual Charging Cost Scenarios by Daily Commute Distance */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Annual Charging Cost Scenarios by Daily Commute Distance</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Total annual charging costs for different daily commute patterns using home Level 2 versus public charging, assuming 12,000–15,000 annual miles.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Annual Miles</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Home Level 2 Cost (7 days/week)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Public Level 2 (50% of charging)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">DC Fast (20% of charging)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Public Cost</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Annual Savings (Home vs. Public)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">12,000 (33 mi/day)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$504–$576</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$396–$648</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$216–$432</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$612–$1,080</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$108–$504</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">15,000 (41 mi/day)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$630–$720</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$495–$810</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$270–$540</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$765–$1,350</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$135–$720</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">20,000 (55 mi/day)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$840–$960</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$660–$1,080</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$360–$720</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,020–$1,800</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$180–$960</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">25,000 (68 mi/day)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,050–$1,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$825–$1,350</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$450–$900</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,275–$2,250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$225–$1,200</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Assumes home Level 2 at $0.14–$0.16/kWh, public Level 2 at $0.22–$0.35/kWh, and DC fast at $0.35–$0.65/kWh. Public charging mix reflects 80% Level 2 and 20% DC fast for longer occasional trips.</p>
      </section>

      {/* TABLE: Home Charger Installation Costs and ROI Timeline */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Home Charger Installation Costs and ROI Timeline</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Typical home Level 2 charger installation costs, federal incentives, and payback periods based on annual charging savings.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Component</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cost Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Level 2 Charger Unit (240V)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$400–$800</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Brands: Tesla Wall Connector, Clipper Creek, ChargePoint Home</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Electrical Installation & Labor</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$100–$1,700</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Costs vary by home; upgraded panel may add $800–$3,000</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Total Installation (Standard)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$500–$2,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Assumes existing 200A service panel, &lt;50 feet from panel</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Total Installation (Major Upgrade)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,000–$4,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Includes panel upgrade, trenching, or new circuit breaker</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Federal Tax Credit (IRA 2024–2025)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Up to $1,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30% of installation costs, capped at $1,000 per charger</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">State/Utility Rebates</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0–$2,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">California, New York, Illinois, and others offer additional incentives</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Payback Period (with incentives)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2–6 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Based on $300–$600 annual savings and $1,000 tax credit</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Installation costs vary significantly by state, local electrical codes, and distance from service panel. Always obtain multiple quotes before installation. Federal IRA tax credits are available through 2032 and reduce taxable income.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Enable time-of-use (TOU) electricity rates with your utility provider and schedule all home charging during off-peak hours (typically 9 PM–6 AM) to reduce costs by 30–50% compared to peak rates.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Install a 240V Level 2 home charger if you drive &gt;30 miles daily or charge more than twice weekly; the $500–$2,500 installation pays for itself in 2–6 years through savings versus public charging.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Combine home charging with public DC fast charging only for road trips &gt;200 miles; using DC fast chargers for routine daily charging wastes $3–$10 per charge compared to home charging.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Apply for federal IRA tax credits (up to $1,000), state rebates (varies $0–$2,000), and utility incentives before installing a home charger to reduce net installation costs and accelerate payback to 1–3 years.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Time-of-Use Electricity Rates</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many EV owners charge at peak hours without realizing they're paying 50–100% more per kWh than off-peak rates. Switching to TOU rates and charging between 9 PM–6 AM can save $200–$400 annually with zero additional effort if you use scheduled departure features.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Overestimating Public Charging Convenience</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Public charging involves finding available stations, parking fees, idle charges after charging completes, and time delays (20–30 minutes for DC fast, 1–3 hours for Level 2). Home charging is &gt;10x more convenient for daily use and costs 50–70% less, making it the default choice for 80–90% of EV charging.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Excluding Hidden Installation Costs in Break-Even Analysis</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Home charger installation costs extend far beyond the $400–$800 unit price; electrical panel upgrades ($800–$3,000), trenching, and labor can double or triple total costs. Always obtain multiple quotes and factor in federal credits and state rebates before calculating payback periods.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming All DC Fast Chargers Cost the Same</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">DC fast charger networks vary dramatically in pricing: Tesla Superchargers ($0.30–$0.45/kWh), Electrify America ($0.35–$0.65/kWh), and EVgo ($0.40–$0.70/kWh) have different pricing strategies, membership discounts, and regional surcharges. Always compare rates in your specific area before assuming road trip costs.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much does it cost to charge an EV at home versus at a public charging station?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Home charging typically costs $0.03–$0.05 per mile using residential electricity rates averaging $0.14–$0.16 per kWh, while public Level 2 chargers cost $0.07–$0.12 per mile and DC fast chargers range from $0.15–$0.30 per mile. A typical EV with a 60 kWh battery costs roughly $8–$10 to fully charge at home, compared to $15–$25 at public Level 2 stations and $20–$35 at DC fast chargers. Home charging is typically 40–60% cheaper for routine daily charging.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How long does it take to charge an EV at home compared to public chargers?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A Level 1 home charger (120V) adds 2–5 miles of range per hour and requires 24–48 hours for a full charge, while a Level 2 home charger (240V) adds 25–30 miles per hour and fully charges in 6–10 hours. Public Level 2 chargers provide similar speeds (25–30 miles/hour), while DC fast chargers deliver 150–200 miles in 20–30 minutes. For overnight home charging, you'll wake up with a full battery; for road trips, public DC fast chargers are necessary.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the break-even point for installing a home EV charger?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A Level 2 home charger installation costs $500–$2,500 depending on electrical upgrades required. At typical usage of 12,000 miles annually, home charging saves $300–$600 per year compared to public charging, meaning the break-even occurs in 2–8 years. Federal tax credits of up to $1,000 and state incentives can accelerate this timeline by 1–2 years.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do time-of-use electricity rates affect home charging costs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Time-of-use (TOU) rates vary by utility, typically offering off-peak rates of $0.08–$0.12 per kWh (usually 9 PM–6 AM) versus peak rates of $0.18–$0.25 per kWh. Charging during off-peak hours can reduce home charging costs by 30–50% compared to peak charging. Many EV owners can save $200–$400 annually by scheduling charging during off-peak windows using scheduled departure features.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the difference between Level 1, Level 2, and DC fast charging?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Level 1 uses standard 120V outlets (2–5 miles/hour, found at home), Level 2 uses 240V circuits (25–30 miles/hour, at home or public locations), and DC fast charging uses 400V–900V systems (150–200 miles in 20–30 minutes, exclusively at public stations). Level 1 is free to install but impractical for regular use; Level 2 is ideal for home and daily commuting; DC fast is essential for long-distance travel. Most EV owners rely on home Level 2 for 80% of charging and public stations for occasional rapid top-ups.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do subscription and membership plans at public charging networks compare to pay-per-use?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Pay-per-use public charging averages $0.25–$0.50 per kWh or $3–$5 per session, while membership plans like EVgo or Electrify America cost $10–$50 monthly and reduce per-kWh rates to $0.15–$0.35. For users charging publicly &lt;5 times monthly, pay-per-use is cheaper; for &gt;10 public charges monthly, a $20–$30 monthly membership typically saves $100–$200 annually. Many workplace and multi-unit home charging networks offer free or subsidized charging, eliminating this decision entirely.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What percentage of EV charging happens at home versus public stations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Studies show 70–85% of EV charging occurs at home, while 15–30% happens at work, destination, or public chargers. This distribution heavily favors home charging because most daily driving is &lt;50 miles, easily covered by overnight home charging. Public charging is reserved for road trips, emergency top-ups, and situations where home charging is unavailable.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do ambient temperature and battery condition affect charging time and cost?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Cold temperatures (&lt;32°F) reduce charging efficiency by 10–20% and extend charging times by 5–15% due to battery preconditioning requirements. Hot temperatures (&gt;85°F) can trigger thermal management systems that slightly reduce charging speed but have minimal cost impact. Battery degradation over 5–10 years reduces capacity by 5–10%, slightly extending charging times but not significantly affecting per-mile costs on modern EVs with 200+ mile ranges.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What hidden costs should I consider when comparing home versus public charging?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Home charging hidden costs include increased electricity consumption ($30–$100 annually), potential electrical panel upgrades ($800–$3,000), and circuit breaker additions. Public charging hidden costs include membership fees ($10–$50 monthly), session surcharges ($1–$3), and idle fees ($0.50–$1.00 per minute after charging completes). Additionally, public charging is less convenient for daily use and may incur parking or access fees at some locations.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.eia.gov/electricity/state/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">U.S. Energy Information Administration (EIA) – Average Electricity Rates by State</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official government data on residential electricity rates across all U.S. states, updated monthly and used to calculate home charging costs.</p>
          </li>
          <li>
            <a href="https://www.irs.gov/credits-deductions/individuals/alternative-fuel-vehicle-refueling-property-credit" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">IRS Alternative Fuel Vehicle Refueling Property Credit</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Federal tax credit information for EV charger installation, including the 30% credit up to $1,000 available through 2032 under the Inflation Reduction Act.</p>
          </li>
          <li>
            <a href="https://afdc.energy.gov/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">U.S. Department of Energy – Electric Vehicle Charging Station Locator (Alternative Fuels Data Center)</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official government database of public EV charging stations with real-time pricing, availability, and network information for cost comparisons.</p>
          </li>
          <li>
            <a href="https://www.consumerreports.org/cars/new-electric-cars/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Consumer Reports – EV Charging Costs & Infrastructure Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Independent consumer guidance on EV ownership costs, charging options, and total cost of ownership comparisons for electric vehicles.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="EV Home vs Public Charging Cost & Time Calculator"
      description="Professional automotive calculator: EV Home vs Public Charging Cost & Time Calculator. Get accurate estimates, expert advice, and financial insights."
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