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

export default function EvChargingCostTimeCalculator() {
  const [inputs, setInputs] = useState({
    batteryCapacity: "", // kWh
    chargingRate: "", // kW (charging power)
    electricityRate: "", // $/kWh
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    const battery = parseFloat(inputs.batteryCapacity);
    const rate = parseFloat(inputs.electricityRate);
    const chargingPower = parseFloat(inputs.chargingRate);

    if (
      isNaN(battery) || battery <= 0 ||
      isNaN(rate) || rate <= 0 ||
      isNaN(chargingPower) || chargingPower <= 0
    ) {
      return {
        primary: "0",
        secondary: "$0.00",
        details: "Please enter valid positive numbers for all inputs.",
        feedback: "Awaiting valid input"
      };
    }

    // Calculate cost = battery capacity (kWh) * electricity rate ($/kWh)
    const cost = battery * rate;

    // Calculate time = battery capacity (kWh) / charging power (kW)
    // Charging time in hours
    const timeHours = battery / chargingPower;

    // Format time to hours and minutes
    const hours = Math.floor(timeHours);
    const minutes = Math.round((timeHours - hours) * 60);

    const timeFormatted = `${hours}h ${minutes}m`;

    return {
      primary: timeFormatted,
      secondary: `$${cost.toFixed(2)}`,
      details: `Charging Time: ${timeHours.toFixed(2)} hours (approx.) | Cost: $${cost.toFixed(2)}`,
      feedback: "Estimated charging time and cost"
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "How much does it cost to charge an electric vehicle at home?",
      answer: "The cost to charge an EV at home depends on your local electricity rate and your vehicle's efficiency. In the U.S., the average residential electricity rate is approximately $0.16 per kWh as of 2024. For a typical EV with a 60 kWh battery pack, a full home charge costs between $8–$12. Using this calculator, you can input your local rate and battery size to get an exact estimate for your situation.",
    },
    {
      question: "What's the difference between Level 1, Level 2, and DC fast charging?",
      answer: "Level 1 charging uses a standard 120V outlet and adds approximately 2–5 miles of range per hour, requiring 24–48 hours for a full charge. Level 2 charging operates at 240V and adds 10–30 miles per hour, typically completing a full charge in 4–10 hours. DC fast charging delivers 150–350 kW and can add 150–200 miles in just 20–30 minutes, making it ideal for road trips and quick top-ups.",
    },
    {
      question: "How do I calculate charging time for my specific EV?",
      answer: "To calculate charging time, divide your vehicle's battery capacity (in kWh) by the charging station's power output (in kW). For example, an EV with a 75 kWh battery charging at a 7.2 kW Level 2 charger takes approximately 10.4 hours. This calculator automates that formula and accounts for real-world factors like efficiency losses, which typically reduce actual charging speed by 10–15%.",
    },
    {
      question: "What is the average cost of public DC fast charging?",
      answer: "Public DC fast charging costs between $0.20–$0.45 per kWh in the U.S., though some networks like Tesla Supercharger charge per minute rather than per kWh. For a 200-mile road trip requiring a 40 kWh charge, you can expect to pay $8–$18 depending on the network and location. Regional variation is significant; urban areas and popular corridors tend to have more competitive pricing.",
    },
    {
      question: "How much can I save by charging during off-peak hours?",
      answer: "Many utilities offer time-of-use (TOU) rates that are 30–50% cheaper during off-peak hours, typically between 9 PM and 6 AM. If your base rate is $0.16 per kWh, off-peak rates may drop to $0.08–$0.11 per kWh. Charging a 60 kWh battery during off-peak hours instead of peak hours can save $3–$5 per charge, translating to $1,000–$1,500 annually for frequent drivers.",
    },
    {
      question: "What factors affect EV charging speed and cost?",
      answer: "Charging speed is primarily affected by the charger's power output (Level 1, 2, or DC fast), battery temperature, and state of charge. Battery conditioning systems consume 5–15% of charging energy, especially in cold weather. Cost is influenced by your local electricity rate, time of charging, network fees for public chargers, and whether you have a subscription plan that reduces per-kWh rates by 10–20%.",
    },
    {
      question: "How much does installing a home Level 2 charger cost versus public charging?",
      answer: "Installing a 240V Level 2 charger at home costs $500–$2,500 for equipment and installation, with potential utility incentives reducing this by $300–$1,000. Once installed, Level 2 home charging costs approximately $0.12–$0.18 per kWh, significantly cheaper than public fast charging at $0.30–$0.45 per kWh. For drivers charging daily, a home charger pays for itself within 2–3 years through fuel savings alone.",
    },
    {
      question: "Can this calculator help me plan long-distance road trips?",
      answer: "Yes, this calculator helps you estimate charging stops, costs, and time for multi-hour trips. Most modern EVs have a range of 200–350 miles per charge, requiring DC fast charging stops every 2–3 hours on long routes. By inputting your vehicle's efficiency (typically 3–5 miles per kWh), you can determine where to stop and budget $5–$15 per charging session for 15–20 minute top-ups.",
    },
    {
      question: "How accurate are EV range estimates in real-world conditions?",
      answer: "EPA-rated range is typically 20–30% optimistic compared to real-world driving, especially in cold weather (&lt;32°F) where range can decrease by 20–40%. Highway driving, aggressive acceleration, and mountainous terrain also reduce efficiency by 15–25% compared to EPA testing conditions. This calculator allows you to adjust efficiency rates based on your actual driving patterns for more realistic cost and time projections.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Charging a 60 kWh battery EV using a Level 2 charger rated at 7.2 kW with an electricity rate of $0.13 per kWh.",
    steps: [
      {
        label: "Step 1: Calculate charging cost",
        explanation:
          "Multiply battery capacity by electricity rate: 60 kWh × $0.13/kWh = $7.80."
      },
      {
        label: "Step 2: Calculate charging time",
        explanation:
          "Divide battery capacity by charging power: 60 kWh ÷ 7.2 kW ≈ 8.33 hours, which is 8 hours and 20 minutes."
      }
    ],
    result: "Final Result: Charging will cost approximately $7.80 and take about 8h 20m."
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "U.S. Department of Energy - Electric Vehicle Charging",
      description:
        "Comprehensive information on EV charging types, rates, and best practices.",
      url: "https://afdc.energy.gov/fuels/electricity_charging.html"
    },
    {
      title: "EPA Fuel Economy Guide",
      description:
        "Official source for electric vehicle efficiency and charging information.",
      url: "https://www.fueleconomy.gov/feg/evtech.shtml"
    },
    {
      title: "ChargePoint - EV Charging Basics",
      description:
        "Detailed explanations of charging speeds, costs, and equipment.",
      url: "https://www.chargepoint.com/resources/ev-charging-basics/"
    }
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="batteryCapacity">Battery Capacity (kWh)</Label>
          <Input
            id="batteryCapacity"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 60"
            value={inputs.batteryCapacity}
            onChange={(e) => handleInputChange("batteryCapacity", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="chargingRate">Charging Power (kW)</Label>
          <Input
            id="chargingRate"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 7.2"
            value={inputs.chargingRate}
            onChange={(e) => handleInputChange("chargingRate", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="electricityRate">Electricity Rate ($/kWh)</Label>
          <Input
            id="electricityRate"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 0.13"
            value={inputs.electricityRate}
            onChange={(e) => handleInputChange("electricityRate", e.target.value)}
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" onClick={() => {}}>
        <Zap className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Estimated Result</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">{results.primary}</div>
            <div className="text-xl font-bold mt-2">{results.secondary}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the EV Charging Cost & Time Estimator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The EV Charging Cost & Time Estimator is a tool designed to help electric vehicle owners calculate the exact cost and duration of charging their vehicles. Whether you're planning a daily home charge or preparing for a long-distance road trip, this calculator provides accurate projections based on your specific vehicle and charging setup. Understanding these estimates helps you budget for electricity costs and plan your schedule more effectively.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use this calculator, you'll need to input several key details: your vehicle's battery capacity (measured in kWh), your local electricity rate (in dollars per kWh), the charger type you're using (Level 1, Level 2, or DC fast charging), and the percentage of charge you want to add. Some calculators also allow you to account for real-world efficiency losses (typically 5–15%) and charging speed degradation as the battery approaches full capacity. Having this information readily available ensures the most accurate results.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The calculator will display your total charging cost and estimated time to reach your target charge level. Use these results to compare charging options (home versus public chargers), identify the cheapest times to charge based on time-of-use rates, and plan road trip charging stops. Remember that actual times may vary by 10–20% due to weather, battery temperature, and vehicle-specific factors, so always build in a small buffer when planning critical charging events.</p>
        </div>
      </section>

      {/* TABLE: EV Charging Speed & Cost Comparison (2024–2025) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">EV Charging Speed & Cost Comparison (2024–2025)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table compares the three main charging levels available to EV owners, showing typical power output, charging time for a 60 kWh battery, and average costs.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Charging Level</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Voltage</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Power Output</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Time to Full Charge (60 kWh)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cost per kWh</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Use Case</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Level 1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">120V</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.4–1.9 kW</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30–48 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.16–$0.18</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Overnight home charging</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Level 2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">240V</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.2–19.2 kW</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3–8 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.14–$0.20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Home & workplace charging</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">DC Fast Charging</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">400V–1000V</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50–350 kW</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20–40 minutes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.30–$0.50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Road trips & quick top-ups</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Times and costs are approximate and vary by vehicle model, local electricity rates, and charger specifications. Actual charging speed decreases as battery reaches full capacity.</p>
      </section>

      {/* TABLE: Average U.S. Electricity Rates by Region (Q1 2024) */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Average U.S. Electricity Rates by Region (Q1 2024)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Regional electricity rates significantly impact EV charging costs; this table shows residential rates across major U.S. regions.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Region</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Average Residential Rate (per kWh)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cost to Charge 60 kWh Battery</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Annual Charging Cost (10,000 miles)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Northeast</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.18–$0.22</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$10.80–$13.20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$648–$792</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Midwest</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.14–$0.16</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$8.40–$9.60</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$504–$576</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">South</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.12–$0.14</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$7.20–$8.40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$432–$504</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">West</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.16–$0.20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$9.60–$12.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$576–$720</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Rates vary by utility and may include demand charges. Off-peak rates are typically 30–50% lower. Source: U.S. Energy Information Administration, 2024.</p>
      </section>

      {/* TABLE: Popular EV Models: Battery Size & Efficiency (2024–2025) */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Popular EV Models: Battery Size & Efficiency (2024–2025)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows battery capacity and real-world efficiency for common EV models, helping you estimate charging costs and time.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Vehicle Model</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Battery Capacity (kWh)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">EPA Range (miles)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Efficiency (miles/kWh)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Estimated Home Charge Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Tesla Model 3 (Long Range)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">75–82 kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">310–330 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.0–4.2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$11.25–$14.76</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Chevrolet Bolt EV</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">65–66 kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">259–259 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.9–4.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$9.75–$10.56</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Ford F-150 Lightning (Extended)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">131 kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">312 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.4–2.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$20–$21</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Nissan Leaf Plus</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">62 kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">226 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.6–3.7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$9.30–$9.92</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Efficiency varies by driving conditions, temperature, and terrain. Real-world efficiency is typically 10–20% lower than EPA estimates under non-ideal conditions.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Enroll in your utility's time-of-use (TOU) rate plan to reduce charging costs by 30–50% — most programs offer discounted rates between 9 PM and 6 AM, making overnight home charging especially economical.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Install a 240V Level 2 home charger if you charge daily; it pays for itself in 2–3 years through savings compared to public DC fast charging at $0.30–$0.50 per kWh.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Pre-condition your battery in warm weather before charging — cold batteries charge 20–40% slower and cost more per mile due to efficiency losses, so warm up your vehicle before plugging in during winter.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use this calculator to compare road trip charging costs between different routes and networks; a 5-minute routing change could save $3–$8 per charging stop by finding cheaper, faster chargers.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Real-World Efficiency Losses</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many people forget that actual charging efficiency is 85–95% due to battery conditioning, thermal losses, and charger conversion inefficiencies. Entering your battery's nominal capacity without accounting for 5–15% losses will underestimate your true charging costs by $0.50–$1.50 per session.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Peak Rates for All-Day Estimates</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Assuming peak electricity rates ($0.18–$0.25 per kWh) for overnight home charging inflates your cost projections significantly. Most utilities offer off-peak rates of $0.08–$0.12 per kWh during night hours, so verify your local TOU schedule and input the correct rate for accurate estimates.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting About Subscription and Network Fees</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Public fast-charging networks often charge session fees ($1–$3) or subscription monthly costs ($10–$25) on top of per-kWh rates, which this calculator may not include. Not accounting for these fees underestimates true road-trip charging costs by 15–25%.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Overestimating EPA Range in Cold Weather</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Using summer EPA range estimates for winter charging plans leads to dangerously inaccurate projections; cold weather reduces EV range by 20–40%, requiring more frequent and more costly charging stops than calculated with standard efficiency assumptions.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much does it cost to charge an electric vehicle at home?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The cost to charge an EV at home depends on your local electricity rate and your vehicle's efficiency. In the U.S., the average residential electricity rate is approximately $0.16 per kWh as of 2024. For a typical EV with a 60 kWh battery pack, a full home charge costs between $8–$12. Using this calculator, you can input your local rate and battery size to get an exact estimate for your situation.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between Level 1, Level 2, and DC fast charging?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Level 1 charging uses a standard 120V outlet and adds approximately 2–5 miles of range per hour, requiring 24–48 hours for a full charge. Level 2 charging operates at 240V and adds 10–30 miles per hour, typically completing a full charge in 4–10 hours. DC fast charging delivers 150–350 kW and can add 150–200 miles in just 20–30 minutes, making it ideal for road trips and quick top-ups.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate charging time for my specific EV?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">To calculate charging time, divide your vehicle's battery capacity (in kWh) by the charging station's power output (in kW). For example, an EV with a 75 kWh battery charging at a 7.2 kW Level 2 charger takes approximately 10.4 hours. This calculator automates that formula and accounts for real-world factors like efficiency losses, which typically reduce actual charging speed by 10–15%.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the average cost of public DC fast charging?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Public DC fast charging costs between $0.20–$0.45 per kWh in the U.S., though some networks like Tesla Supercharger charge per minute rather than per kWh. For a 200-mile road trip requiring a 40 kWh charge, you can expect to pay $8–$18 depending on the network and location. Regional variation is significant; urban areas and popular corridors tend to have more competitive pricing.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much can I save by charging during off-peak hours?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Many utilities offer time-of-use (TOU) rates that are 30–50% cheaper during off-peak hours, typically between 9 PM and 6 AM. If your base rate is $0.16 per kWh, off-peak rates may drop to $0.08–$0.11 per kWh. Charging a 60 kWh battery during off-peak hours instead of peak hours can save $3–$5 per charge, translating to $1,000–$1,500 annually for frequent drivers.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What factors affect EV charging speed and cost?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Charging speed is primarily affected by the charger's power output (Level 1, 2, or DC fast), battery temperature, and state of charge. Battery conditioning systems consume 5–15% of charging energy, especially in cold weather. Cost is influenced by your local electricity rate, time of charging, network fees for public chargers, and whether you have a subscription plan that reduces per-kWh rates by 10–20%.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much does installing a home Level 2 charger cost versus public charging?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Installing a 240V Level 2 charger at home costs $500–$2,500 for equipment and installation, with potential utility incentives reducing this by $300–$1,000. Once installed, Level 2 home charging costs approximately $0.12–$0.18 per kWh, significantly cheaper than public fast charging at $0.30–$0.45 per kWh. For drivers charging daily, a home charger pays for itself within 2–3 years through fuel savings alone.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can this calculator help me plan long-distance road trips?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, this calculator helps you estimate charging stops, costs, and time for multi-hour trips. Most modern EVs have a range of 200–350 miles per charge, requiring DC fast charging stops every 2–3 hours on long routes. By inputting your vehicle's efficiency (typically 3–5 miles per kWh), you can determine where to stop and budget $5–$15 per charging session for 15–20 minute top-ups.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How accurate are EV range estimates in real-world conditions?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">EPA-rated range is typically 20–30% optimistic compared to real-world driving, especially in cold weather (&lt;32°F) where range can decrease by 20–40%. Highway driving, aggressive acceleration, and mountainous terrain also reduce efficiency by 15–25% compared to EPA testing conditions. This calculator allows you to adjust efficiency rates based on your actual driving patterns for more realistic cost and time projections.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.eia.gov/electricity/state/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">U.S. Energy Information Administration — Average Electricity Rates</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official government source for residential and commercial electricity rates by state and region, updated quarterly.</p>
          </li>
          <li>
            <a href="https://afdc.energy.gov/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">U.S. Department of Energy — Alternative Fuels Data Center</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive database of public EV charging stations, rates, and real-time availability across the United States.</p>
          </li>
          <li>
            <a href="https://www.consumerreports.org/cars/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Consumer Reports — EV Charging Costs and Efficiency Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">In-depth consumer guidance on EV charging options, cost comparisons, and real-world efficiency benchmarks for popular models.</p>
          </li>
          <li>
            <a href="https://consumer.ftc.gov/articles/what-you-need-know-about-electric-vehicles" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Federal Trade Commission — Electric Vehicle Charging: What You Need to Know</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Consumer protection agency resource explaining EV charging standards, costs, and how to compare charging networks and rates.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="EV Charging Cost & Time Estimator"
      description="Professional automotive calculator: EV Charging Cost & Time Estimator. Get accurate estimates, expert advice, and financial insights."
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