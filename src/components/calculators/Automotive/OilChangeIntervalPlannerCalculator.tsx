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

export default function OilChangeIntervalPlannerCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    currentMileage: "",
    lastOilChangeMileage: "",
    recommendedInterval: "",
    oilChangeCost: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    const {
      currentMileage,
      lastOilChangeMileage,
      recommendedInterval,
      oilChangeCost,
      unit
    } = inputs;

    // Parse inputs to numbers
    const currMile = parseFloat(currentMileage);
    const lastMile = parseFloat(lastOilChangeMileage);
    const recInterval = parseFloat(recommendedInterval);
    const cost = parseFloat(oilChangeCost);

    // Validation
    if (
      isNaN(currMile) || currMile < 0 ||
      isNaN(lastMile) || lastMile < 0 ||
      isNaN(recInterval) || recInterval <= 0 ||
      isNaN(cost) || cost < 0 ||
      lastMile > currMile
    ) {
      return {
        primary: "Invalid input",
        secondary: "",
        details: "Please enter valid positive numbers. Last oil change mileage must be less than or equal to current mileage.",
        feedback: "Error"
      };
    }

    // Calculate miles/kilometers since last oil change
    const distanceSinceLastChange = currMile - lastMile;

    // Calculate remaining distance until next oil change
    const remainingDistance = recInterval - distanceSinceLastChange;

    // Calculate percentage of interval used
    const percentUsed = (distanceSinceLastChange / recInterval) * 100;

    // Calculate estimated cost per mile/km for oil changes
    // Assuming cost per interval = oilChangeCost, cost per mile = oilChangeCost / recInterval
    const costPerDistance = cost / recInterval;

    // Calculate estimated cost until next oil change
    const estimatedCostUntilNextChange = remainingDistance > 0 ? costPerDistance * remainingDistance : 0;

    // Format numbers
    const formatDistance = (val: number) => {
      if (unit === "imperial") return `${val.toFixed(0)} miles`;
      else return `${val.toFixed(0)} km`;
    };

    const formatCurrency = (val: number) => {
      return `$${val.toFixed(2)}`;
    };

    // Feedback message based on usage
    let feedback = "Standard range";
    if (percentUsed < 50) feedback = "You can wait longer before next oil change.";
    else if (percentUsed >= 50 && percentUsed < 90) feedback = "Approaching recommended oil change interval.";
    else if (percentUsed >= 90 && remainingDistance > 0) feedback = "Oil change due soon.";
    else if (remainingDistance <= 0) feedback = "Oil change overdue! Please change immediately.";

    return {
      primary: remainingDistance > 0 ? formatDistance(remainingDistance) : "0",
      secondary: formatCurrency(estimatedCostUntilNextChange),
      details: `Distance since last oil change: ${formatDistance(distanceSinceLastChange)}. Recommended interval: ${formatDistance(recInterval)}.`,
      feedback
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "What is the recommended oil change interval for modern vehicles?",
      answer: "Most modern vehicles with synthetic oil can go 7,500 to 10,000 miles between oil changes, while some newer models can extend to 15,000 miles or more. Conventional oil typically requires changes every 3,000 to 5,000 miles. Always consult your vehicle's owner manual for the manufacturer's specific recommendations, as intervals vary based on engine type, driving conditions, and oil quality.",
    },
    {
      question: "How does driving habit affect my oil change schedule?",
      answer: "Severe driving conditions—such as frequent short trips, towing, idling, or driving in dusty environments—can reduce oil change intervals by 25% to 50%. If you frequently drive in these conditions, consider changing your oil every 3,000 to 5,000 miles even with synthetic oil. The Oil Change Interval Planner accounts for these factors to provide a personalized schedule based on your driving patterns.",
    },
    {
      question: "What's the difference between synthetic and conventional oil intervals?",
      answer: "Synthetic oil typically lasts 2 to 3 times longer than conventional oil due to superior heat resistance and oxidation stability. Conventional oil breaks down faster and loses effectiveness around 3,000 to 5,000 miles, while synthetic oil can maintain protection for 7,500 to 15,000 miles or more. Synthetic blends offer a middle ground, usually lasting 5,000 to 7,500 miles between changes.",
    },
    {
      question: "Can I extend my oil change interval if I use premium synthetic oil?",
      answer: "Yes, premium synthetic oils like PAO (polyalphaolefin) or Group III synthetics can extend intervals to 12,000 to 15,000 miles under normal driving conditions. However, severe conditions, high-mileage vehicles, or manufacturer specifications may still require shorter intervals. Always verify your vehicle's maximum recommended interval before extending beyond the owner's manual guidelines.",
    },
    {
      question: "How do temperature and climate impact oil change frequency?",
      answer: "Cold climates increase engine stress during startup, which can shorten oil life by 10% to 20%, while extreme heat accelerates oil degradation and requires more frequent changes. Hot climates may reduce intervals by 500 to 1,000 miles compared to moderate climates. The Oil Change Interval Planner factors in your local temperature range to adjust recommendations accordingly.",
    },
    {
      question: "What happens if I skip or delay an oil change?",
      answer: "Skipping scheduled oil changes allows sludge and contaminants to accumulate, increasing engine wear and reducing performance. Delaying changes by just 1,000 miles can reduce engine protection by 15% to 25%, potentially leading to costly repairs or engine failure. Regular oil changes are the cheapest form of preventive maintenance, costing $30 to $75 per change versus thousands for engine damage.",
    },
    {
      question: "How do I know if my vehicle uses 4, 5, or 6 quarts of oil?",
      answer: "Check your vehicle's owner manual under 'Fluid Capacities' or 'Specifications'—this is the most accurate source. Most compact cars use 4 to 5 quarts, sedans use 5 to 6 quarts, and SUVs/trucks often require 6 to 8 quarts. You can also check the dipstick markings or ask your mechanic; using the correct amount ensures proper lubrication and engine protection.",
    },
    {
      question: "Should high-mileage vehicles follow a different oil change schedule?",
      answer: "Vehicles with &gt;75,000 miles should typically use high-mileage oil formulas and follow intervals at the shorter end of the manufacturer's recommendation, usually every 5,000 to 7,500 miles. High-mileage oils contain additives that reduce leaks and restore seals in aging engines. Switching to synthetic high-mileage oil can extend intervals to 7,500 to 10,000 miles while providing better protection against wear.",
    },
    {
      question: "How often should I check my oil level between changes?",
      answer: "Check your oil level every 2 to 4 weeks or before long road trips, regardless of your oil change interval. Modern engines can consume 500 to 1,000 miles worth of oil between changes due to normal combustion and evaporation. Monitoring levels helps catch leaks or burning oil early, preventing engine damage and ensuring you maintain adequate lubrication.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "John owns a 2018 sedan and wants to plan his next oil change. His current mileage is 45,000 miles, and his last oil change was at 40,000 miles. The manufacturer recommends an oil change every 5,000 miles. Each oil change costs him $50.",
    steps: [
      {
        label: "Step 1: Calculate miles since last oil change",
        explanation: "45,000 miles (current) - 40,000 miles (last) = 5,000 miles driven since last oil change."
      },
      {
        label: "Step 2: Calculate remaining miles until next oil change",
        explanation: "5,000 miles (recommended interval) - 5,000 miles (driven) = 0 miles remaining; oil change is due now."
      },
      {
        label: "Step 3: Calculate estimated cost until next oil change",
        explanation: "Since the oil change is due now, estimated cost until next oil change is $0."
      }
    ],
    result: "John should perform an oil change immediately to maintain engine health and avoid damage."
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "EPA Fuel Economy Guide",
      description: "Official source for MPG ratings and vehicle maintenance tips."
    },
    {
      title: "Kelley Blue Book",
      description: "Trusted vehicle valuation and pricing, including maintenance cost estimates."
    },
    {
      title: "Edmunds Automotive",
      description: "Car reviews, maintenance advice, and automotive calculators."
    },
    {
      title: "Your Vehicle Owner's Manual",
      description: "Manufacturer's recommended maintenance schedule and oil change intervals."
    },
    {
      title: "Car Care Council",
      description: "Nonprofit organization providing vehicle maintenance education and tips."
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
            <SelectItem value="imperial">Imperial (miles)</SelectItem>
            <SelectItem value="metric">Metric (km)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Current Mileage</Label>
          <Input
            type="number"
            min="0"
            value={inputs.currentMileage}
            onChange={(e) => handleInputChange("currentMileage", e.target.value)}
            placeholder={inputs.unit === "imperial" ? "e.g. 45000 miles" : "e.g. 72000 km"}
          />
        </div>
        <div className="space-y-2">
          <Label>Last Oil Change Mileage</Label>
          <Input
            type="number"
            min="0"
            value={inputs.lastOilChangeMileage}
            onChange={(e) => handleInputChange("lastOilChangeMileage", e.target.value)}
            placeholder={inputs.unit === "imperial" ? "e.g. 40000 miles" : "e.g. 64000 km"}
          />
        </div>
        <div className="space-y-2">
          <Label>Recommended Oil Change Interval</Label>
          <Input
            type="number"
            min="1"
            value={inputs.recommendedInterval}
            onChange={(e) => handleInputChange("recommendedInterval", e.target.value)}
            placeholder={inputs.unit === "imperial" ? "e.g. 5000 miles" : "e.g. 8000 km"}
          />
        </div>
        <div className="space-y-2">
          <Label>Cost per Oil Change</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={inputs.oilChangeCost}
            onChange={(e) => handleInputChange("oilChangeCost", e.target.value)}
            placeholder="$50.00"
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg">
        <Car className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Estimated Remaining Distance</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">{results.primary}</div>
            <div className="text-xl font-bold mt-2">Estimated Cost Until Next Oil Change: {results.secondary}</div>
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Oil Change Interval Planner</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Oil Change Interval Planner is a personalized scheduling tool that calculates when you should change your oil based on your specific vehicle, driving habits, and environmental conditions. Regular oil changes are essential to engine longevity, fuel efficiency, and performance—they remove contaminants and maintain proper lubrication. This calculator takes the guesswork out of maintenance planning and helps you avoid costly engine damage from missed services.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the planner, input key information: your vehicle's make, model, and year; the type of oil your manufacturer recommends (conventional, synthetic blend, or full synthetic); your average monthly mileage; and your typical driving conditions (normal, severe, or mixed). The calculator also considers climate factors like average temperature and weather patterns in your region. These inputs allow the tool to generate an accurate, personalized oil change schedule tailored to your unique driving situation.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The results show your recommended oil change date and mileage milestone, along with a visual timeline for upcoming maintenance windows. Use this schedule to set calendar reminders or integrate the dates into your vehicle maintenance log. The planner also highlights cost estimates and explains why your interval differs from the standard recommendation, helping you make informed decisions about oil quality and maintenance budgeting.</p>
        </div>
      </section>

      {/* TABLE: Oil Change Intervals by Oil Type and Driving Conditions */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Oil Change Intervals by Oil Type and Driving Conditions</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows recommended oil change intervals in miles for different oil types under normal and severe driving conditions.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Oil Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Normal Driving</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Severe Driving</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Highway Driving</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Conventional (Mineral)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,000–5,000 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,500–3,500 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4,000–5,000 miles</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Synthetic Blend</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5,000–7,500 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,500–5,000 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6,000–7,500 miles</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Full Synthetic</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7,500–10,000 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5,000–7,500 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8,000–12,000 miles</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Premium Full Synthetic (PAO)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10,000–15,000 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7,500–10,000 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12,000–15,000 miles</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">High-Mileage Oil (&gt;75K miles)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5,000–7,500 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,000–5,000 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6,000–8,000 miles</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Severe driving includes frequent short trips, towing, idling, dusty conditions, and cold starts. Always consult your vehicle's owner manual for manufacturer-recommended intervals.</p>
      </section>

      {/* TABLE: Engine Oil Viscosity Grades and Temperature Ranges */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Engine Oil Viscosity Grades and Temperature Ranges</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows common SAE oil viscosity grades and their optimal operating temperature ranges.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Oil Grade</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cold Temperature Performance</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Hot Temperature Performance</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Best Use</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">0W-20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&lt;-40°F startup</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100°C flow at moderate temps</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Modern fuel-efficient engines</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">0W-30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&lt;-35°F startup</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100°C flow at higher temps</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Some turbocharged engines</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5W-30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&lt;-25°F startup</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100°C flow at moderate temps</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Most common grade, 4-cylinder engines</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5W-40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&lt;-25°F startup</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100°C flow at high temps</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High-performance and diesel engines</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10W-40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&lt;-15°F startup</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100°C flow at high temps</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Older vehicles, warm climates</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">The 'W' (Winter) rating indicates cold-start viscosity. Always use the SAE grade specified in your vehicle's owner manual.</p>
      </section>

      {/* TABLE: Annual Oil Change Costs by Oil Type */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Annual Oil Change Costs by Oil Type</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table estimates annual maintenance costs based on typical oil change intervals and prices per service.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Oil Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cost Per Change</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Interval (Miles)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Est. Annual Cost (15K miles/year)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Conventional</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$30–$45</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5,000 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$90–$135</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Synthetic Blend</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$50–$65</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7,500 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$100–$130</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Full Synthetic</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$65–$85</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10,000 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$97.50–$127.50</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Premium Full Synthetic</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$85–$110</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12,500 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$102–$132</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">High-Mileage Synthetic</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$75–$95</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7,500 miles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$150–$190</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Costs vary by location, vehicle model, and service provider. These estimates include oil and filter replacement only.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Set phone reminders 500 miles before your scheduled oil change to allow adequate planning time and avoid running past your interval, which can compromise engine protection.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Keep a maintenance log documenting each oil change date, mileage, oil type used, and the service provider—this record helps verify warranty claims and proves regular maintenance to potential buyers.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Consider upgrading to full synthetic oil if you drive in severe conditions, tow frequently, or experience extreme temperatures, as the extended intervals save money despite higher per-service costs.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Replace your oil filter every time you change oil without exception; a clogged filter restricts flow and reduces the protective properties of even premium synthetic oil by 30% to 50%.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring manufacturer recommendations in favor of online advice</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Your vehicle's owner manual contains the only interval guarantee recognized by manufacturers and may void warranty claims if ignored. Generic online recommendations don't account for your specific engine type, transmission, or climate conditions.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Confusing oil change intervals with tire rotation or filter replacement</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Oil changes, tire rotations, and filter replacements are separate maintenance tasks with different intervals. Oil changes are typically due every 5,000 to 15,000 miles, while tire rotations occur every 6,000 to 8,000 miles and cabin air filters every 12,000 to 15,000 miles.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using the wrong oil viscosity grade for your engine</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Using 10W-40 in an engine that requires 0W-20 can reduce fuel efficiency by 3% to 5% and compromise cold-start protection in winter. Always match the exact SAE viscosity grade specified in your owner manual.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Extending intervals beyond manufacturer limits based on oil quality alone</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Even premium synthetic oils have maximum interval limits set by manufacturers to ensure engine protection and emission control system health. Pushing beyond these limits increases wear rates and can damage catalytic converters.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the recommended oil change interval for modern vehicles?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most modern vehicles with synthetic oil can go 7,500 to 10,000 miles between oil changes, while some newer models can extend to 15,000 miles or more. Conventional oil typically requires changes every 3,000 to 5,000 miles. Always consult your vehicle's owner manual for the manufacturer's specific recommendations, as intervals vary based on engine type, driving conditions, and oil quality.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does driving habit affect my oil change schedule?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Severe driving conditions—such as frequent short trips, towing, idling, or driving in dusty environments—can reduce oil change intervals by 25% to 50%. If you frequently drive in these conditions, consider changing your oil every 3,000 to 5,000 miles even with synthetic oil. The Oil Change Interval Planner accounts for these factors to provide a personalized schedule based on your driving patterns.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between synthetic and conventional oil intervals?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Synthetic oil typically lasts 2 to 3 times longer than conventional oil due to superior heat resistance and oxidation stability. Conventional oil breaks down faster and loses effectiveness around 3,000 to 5,000 miles, while synthetic oil can maintain protection for 7,500 to 15,000 miles or more. Synthetic blends offer a middle ground, usually lasting 5,000 to 7,500 miles between changes.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I extend my oil change interval if I use premium synthetic oil?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, premium synthetic oils like PAO (polyalphaolefin) or Group III synthetics can extend intervals to 12,000 to 15,000 miles under normal driving conditions. However, severe conditions, high-mileage vehicles, or manufacturer specifications may still require shorter intervals. Always verify your vehicle's maximum recommended interval before extending beyond the owner's manual guidelines.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do temperature and climate impact oil change frequency?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Cold climates increase engine stress during startup, which can shorten oil life by 10% to 20%, while extreme heat accelerates oil degradation and requires more frequent changes. Hot climates may reduce intervals by 500 to 1,000 miles compared to moderate climates. The Oil Change Interval Planner factors in your local temperature range to adjust recommendations accordingly.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What happens if I skip or delay an oil change?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Skipping scheduled oil changes allows sludge and contaminants to accumulate, increasing engine wear and reducing performance. Delaying changes by just 1,000 miles can reduce engine protection by 15% to 25%, potentially leading to costly repairs or engine failure. Regular oil changes are the cheapest form of preventive maintenance, costing $30 to $75 per change versus thousands for engine damage.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I know if my vehicle uses 4, 5, or 6 quarts of oil?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Check your vehicle's owner manual under 'Fluid Capacities' or 'Specifications'—this is the most accurate source. Most compact cars use 4 to 5 quarts, sedans use 5 to 6 quarts, and SUVs/trucks often require 6 to 8 quarts. You can also check the dipstick markings or ask your mechanic; using the correct amount ensures proper lubrication and engine protection.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should high-mileage vehicles follow a different oil change schedule?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Vehicles with &gt;75,000 miles should typically use high-mileage oil formulas and follow intervals at the shorter end of the manufacturer's recommendation, usually every 5,000 to 7,500 miles. High-mileage oils contain additives that reduce leaks and restore seals in aging engines. Switching to synthetic high-mileage oil can extend intervals to 7,500 to 10,000 miles while providing better protection against wear.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I check my oil level between changes?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Check your oil level every 2 to 4 weeks or before long road trips, regardless of your oil change interval. Modern engines can consume 500 to 1,000 miles worth of oil between changes due to normal combustion and evaporation. Monitoring levels helps catch leaks or burning oil early, preventing engine damage and ensuring you maintain adequate lubrication.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.fueleconomy.gov/feg/maintain.shtml" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Your Car's Maintenance Schedule</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official U.S. EPA resource explaining the importance of following manufacturer maintenance schedules and how proper oil changes affect fuel economy.</p>
          </li>
          <li>
            <a href="https://www.consumerreports.org/cars/car-maintenance/motor-oil-selection-and-use/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Motor Oil Selection and Use</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Consumer Reports comprehensive guide covering oil types, viscosity grades, and how to choose the right oil for your vehicle.</p>
          </li>
          <li>
            <a href="https://www.aaa.com/automotive/articles/motor-oil-101" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Guide to Motor Oil Maintenance</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">AAA's detailed explanation of oil types, change intervals, and common misconceptions about automotive lubrication.</p>
          </li>
          <li>
            <a href="https://www.sae.org/standards/content/j183_202301/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Engine Oil Specifications and Performance Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Society of Automotive Engineers official standard defining SAE viscosity grades and oil performance classifications used worldwide.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Oil Change Interval Planner"
      description="Professional automotive calculator: Oil Change Interval Planner. Get accurate estimates, expert advice, and financial insights."
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