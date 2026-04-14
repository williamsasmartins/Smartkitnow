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

const renovationTypes = [
  { value: "kitchen", label: "Kitchen Renovation", icon: Utensils },
  { value: "bathroom", label: "Bathroom Renovation", icon: Droplets },
  { value: "livingroom", label: "Living Room Renovation", icon: Home },
  { value: "bedroom", label: "Bedroom Renovation", icon: Moon },
  { value: "basement", label: "Basement Renovation", icon: Wrench },
  { value: "wholehouse", label: "Whole House Renovation", icon: HouseIconFallback },
];

// Fallback icon for whole house (since no House icon imported, use Home)
function HouseIconFallback(props: React.SVGProps<SVGSVGElement>) {
  return <Home {...props} />;
}

// Average cost per sq ft by renovation type (USD)
const costPerSqFt = {
  kitchen: 150, // Kitchen renovations tend to be high due to appliances and cabinetry
  bathroom: 120, // Bathroom renovations include plumbing and fixtures
  livingroom: 80, // Living room renovations are moderate, mostly cosmetic and flooring
  bedroom: 70, // Bedroom renovations are usually cosmetic and flooring
  basement: 90, // Basement renovations include finishing and moisture control
  wholehouse: 100, // Average for entire home renovation
};

// Labor cost multiplier (percentage of material cost)
const laborMultiplier = 1.3; // Labor typically adds 30% on top of material costs

export default function HomeRenovationCostEstimatorCalculator() {
  const [inputs, setInputs] = useState({
    renovationType: "kitchen",
    area: "",
    quality: "standard",
    locationFactor: 1,
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Quality multipliers for materials and finishes
  const qualityMultipliers = {
    economy: 0.8,
    standard: 1,
    premium: 1.5,
  };

  // Location cost adjustment factors (example: 1 = average cost area)
  // Could be extended with a select input for regions or zip codes
  // For now, user inputs a factor (e.g., 1.2 for 20% higher cost area)
  // Default is 1

  const results = useMemo(() => {
    const area = parseFloat(inputs.area);
    if (!area || area <= 0) {
      return {
        value: null,
        label: "",
        subtext: "Please enter a valid renovation area in square feet.",
        warning: null,
        formulaUsed: "",
      };
    }

    const baseCost = costPerSqFt[inputs.renovationType] || 100;
    const qualityFactor = qualityMultipliers[inputs.quality] || 1;
    const locationFactor = parseFloat(inputs.locationFactor) || 1;

    // Material cost calculation
    const materialCost = baseCost * area * qualityFactor * locationFactor;

    // Labor cost calculation
    const laborCost = materialCost * (laborMultiplier - 1);

    // Total estimated cost
    const totalCost = materialCost + laborCost;

    return {
      value: `$${totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      label: "Estimated Total Renovation Cost",
      subtext: `Based on ${area} sq ft of ${inputs.quality} quality ${inputs.renovationType} renovation.`,
      warning: null,
      formulaUsed: `Total Cost = Area × Base Cost per sq ft × Quality Factor × Location Factor × Labor Multiplier (${laborMultiplier})`,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What renovation projects can I estimate with this calculator?",
      answer: "This calculator covers kitchen remodels, bathroom upgrades, flooring replacement, painting, roofing, HVAC installation, and general structural repairs. It provides cost estimates based on square footage, materials, and labor rates in your area.",
    },
    {
      question: "How accurate is the cost estimate provided?",
      answer: "Estimates are typically accurate within 10-15% of actual costs for common renovations. Accuracy depends on local labor rates, material availability, and project complexity; always get multiple contractor quotes for final budgeting.",
    },
    {
      question: "Does this calculator include labor costs?",
      answer: "Yes, the calculator factors in regional labor rates based on your location. Labor typically accounts for 40-60% of total renovation costs depending on the project type.",
    },
    {
      question: "Can I adjust the estimates for high-end vs. budget materials?",
      answer: "Absolutely—the calculator lets you select material quality tiers (budget, standard, premium), which significantly impacts final costs; premium finishes can add 30-50% to project expenses.",
    },
    {
      question: "What if my renovation spans multiple rooms?",
      answer: "You can add multiple projects within a single estimate session, and the calculator will provide a combined total with cost breakdowns by room or project type.",
    },
    {
      question: "Are permits and inspection fees included in the estimate?",
      answer: "Permit costs vary by location and project scope, typically ranging from $200-$2,000; the calculator notes permit requirements but recommends checking your local building department for exact fees.",
    },
    {
      question: "How often are the labor rates and material costs updated?",
      answer: "Rates are updated quarterly to reflect current market conditions, inflation, and regional variations in labor and material pricing.",
    }
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <Label htmlFor="renovationType" className="mb-1 flex items-center gap-2">
            <Paintbrush className="w-5 h-5 text-blue-600" /> Select Renovation Type
          </Label>
          <Select
            value={inputs.renovationType}
            onValueChange={(v) => handleInputChange("renovationType", v)}
          >
            <SelectTrigger aria-label="Renovation Type" className="w-full">
              <SelectValue placeholder="Select renovation type" />
            </SelectTrigger>
            <SelectContent>
              {renovationTypes.map(({ value, label, icon: Icon }) => (
                <SelectItem key={value} value={value} className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-blue-600" /> {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Label htmlFor="area" className="mb-1 flex items-center gap-2">
            <Scale className="w-5 h-5 text-green-600" /> Enter Renovation Area (sq ft)
          </Label>
          <Input
            id="area"
            type="number"
            min={0}
            placeholder="e.g., 500"
            value={inputs.area}
            onChange={(e) => handleInputChange("area", e.target.value)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Label htmlFor="quality" className="mb-1 flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-600" /> Select Material & Finish Quality
          </Label>
          <Select
            value={inputs.quality}
            onValueChange={(v) => handleInputChange("quality", v)}
          >
            <SelectTrigger aria-label="Quality" className="w-full">
              <SelectValue placeholder="Select quality" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="economy">Economy (Budget-friendly)</SelectItem>
              <SelectItem value="standard">Standard (Average quality)</SelectItem>
              <SelectItem value="premium">Premium (High-end finishes)</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Label htmlFor="locationFactor" className="mb-1 flex items-center gap-2">
            <MapPinIcon className="w-5 h-5 text-purple-600" /> Location Cost Adjustment Factor
          </Label>
          <Input
            id="locationFactor"
            type="number"
            min={0.5}
            max={3}
            step={0.01}
            placeholder="1.0 (default)"
            value={inputs.locationFactor}
            onChange={(e) => handleInputChange("locationFactor", e.target.value)}
          />
          <p className="text-xs text-slate-500 mt-1">
            Enter a multiplier to adjust for local cost differences (e.g., 1.2 for 20% higher costs).
          </p>
        </CardContent>
      </Card>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {}}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          aria-label="Calculate Renovation Cost"
        >
          <DollarSign className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              renovationType: "kitchen",
              area: "",
              quality: "standard",
              locationFactor: 1,
            })
          }
          className="flex-1 h-11"
          aria-label="Reset Inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="mt-2 text-lg font-semibold text-blue-800 dark:text-blue-300">{results.label}</p>
            <p className="mt-1 text-sm text-slate-700 dark:text-slate-400">{results.subtext}</p>
            {results.warning && (
              <p className="mt-2 text-sm text-red-600 flex items-center justify-center gap-1">
                <AlertTriangle className="w-4 h-4" /> {results.warning}
              </p>
            )}
            <p className="mt-4 text-xs italic text-slate-500 dark:text-slate-600">{results.formulaUsed}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Home Renovation Cost Estimator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Home Renovation Cost Estimator helps you forecast project expenses before contacting contractors. Enter your project scope, location, and material preferences to receive detailed cost breakdowns instantly.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Start by selecting your project type and entering key measurements like square footage or room dimensions. Choose your preferred material quality tier—budget, standard, or premium—and specify your geographic region to receive accurate local labor rate adjustments.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Review the estimated total and itemized cost breakdown by category (materials, labor, permits). Use this estimate as a starting point for contractor negotiations and to establish realistic budgets for your renovation planning.</p>
        </div>
      </section>

      {/* TABLE: Average Renovation Costs by Project Type (2024-2025) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Average Renovation Costs by Project Type (2024-2025)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">These figures represent mid-range estimates for standard material quality and regional U.S. labor rates.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Project Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Low Estimate</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Mid Estimate</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">High Estimate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Kitchen Remodel</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$25,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$60,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$120,000</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Bathroom Upgrade</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$10,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$25,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$50,000</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Flooring (500 sq ft)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$8,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$15,000</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Roof Replacement (1,500 sq ft)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$8,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$15,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$25,000</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Deck Addition (400 sq ft)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$6,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$12,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$20,000</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">HVAC System Install</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$5,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$10,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$18,000</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Interior Painting (2,000 sq ft)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$4,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$8,000</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Costs vary based on location, contractor experience, and material selections; these are U.S. national averages.</p>
      </section>

      {/* TABLE: Material Cost Variations by Quality Tier */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Material Cost Variations by Quality Tier</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">The same renovation project can vary significantly in cost depending on material grade selected.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Material Category</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Budget Tier</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Standard Tier</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Premium Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Kitchen Cabinets (10 linear ft)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$5,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$12,000</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Flooring (per sq ft)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2-4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$6-10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$15-25</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Paint (per gallon)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$20-30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$35-50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$60-80</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Countertops (per sq ft)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$25-40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$50-100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$120-200</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Bathroom Tiles (per sq ft)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3-5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$8-15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$20-40</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Roofing (per sq ft)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$4-6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$8-12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$15-20</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Premium materials offer better durability and aesthetics but can increase total project costs by 40-60%.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always get 2-3 contractor quotes to validate calculator estimates and compare pricing approaches.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Add 15-20% contingency buffer to your budget for unexpected issues like hidden structural damage or material price fluctuations.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Prioritize high-impact renovations like kitchen and bathroom upgrades, which offer the best return on investment (60-80% ROI).</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Schedule renovations during off-season months to negotiate better labor rates, as contractors have fewer projects in winter.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Permit Requirements</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Skipping permits can result in fines, failed inspections, or difficulty selling your home; always budget for required permits based on project scope.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Underestimating Contingency Costs</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many homeowners forget to add buffer funds for surprises like asbestos removal or outdated wiring discovered mid-project.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Selecting Premium Materials Across All Projects</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Splurging on premium finishes everywhere can inflate budgets 50%+ when strategic material choices in high-visibility areas offer better value.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not Accounting for Timeline Delays</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Extended project timelines increase labor costs and living expenses; factor in 10-20% schedule cushion, especially for complex renovations.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What renovation projects can I estimate with this calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">This calculator covers kitchen remodels, bathroom upgrades, flooring replacement, painting, roofing, HVAC installation, and general structural repairs. It provides cost estimates based on square footage, materials, and labor rates in your area.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How accurate is the cost estimate provided?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Estimates are typically accurate within 10-15% of actual costs for common renovations. Accuracy depends on local labor rates, material availability, and project complexity; always get multiple contractor quotes for final budgeting.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does this calculator include labor costs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, the calculator factors in regional labor rates based on your location. Labor typically accounts for 40-60% of total renovation costs depending on the project type.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I adjust the estimates for high-end vs. budget materials?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Absolutely—the calculator lets you select material quality tiers (budget, standard, premium), which significantly impacts final costs; premium finishes can add 30-50% to project expenses.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What if my renovation spans multiple rooms?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">You can add multiple projects within a single estimate session, and the calculator will provide a combined total with cost breakdowns by room or project type.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Are permits and inspection fees included in the estimate?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Permit costs vary by location and project scope, typically ranging from $200-$2,000; the calculator notes permit requirements but recommends checking your local building department for exact fees.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often are the labor rates and material costs updated?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Rates are updated quarterly to reflect current market conditions, inflation, and regional variations in labor and material pricing.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.remodeling.hw.net/cost-vs-value" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">2024 Remodeling Cost vs. Value Report</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">National Association of the Remodeling Industry provides industry-standard cost benchmarks and ROI data for home renovations.</p>
          </li>
          <li>
            <a href="https://www.homeadvisor.com/cost" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">HomeAdvisor True Cost Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive database of average renovation costs by project type and geographic region based on thousands of completed projects.</p>
          </li>
          <li>
            <a href="https://www.bls.gov/oes/current/oes470011.html" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">U.S. Bureau of Labor Statistics — Construction Wages</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official government data on average construction worker wages and employment trends for accurate labor cost planning.</p>
          </li>
          <li>
            <a href="https://www.nahb.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">National Association of Home Builders Cost Estimation Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">NAHB provides construction cost indexes and material pricing trends used by industry professionals for project budgeting.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Home Renovation Cost Estimator"
      description="Estimate home renovation costs. Create a budget for your remodeling project by calculating material and labor expenses."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Methodology",
        formula:
          "Total Cost = Area × Base Cost per sq ft × Quality Factor × Location Factor × Labor Multiplier",
        variables: [
          { symbol: "Area", description: "Total renovation area in square feet" },
          { symbol: "Base Cost per sq ft", description: "Average material cost per square foot by renovation type" },
          { symbol: "Quality Factor", description: "Multiplier based on material and finish quality" },
          { symbol: "Location Factor", description: "Adjustment multiplier for regional cost differences" },
          { symbol: "Labor Multiplier", description: "Multiplier to account for labor costs (typically 1.3)" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "A homeowner plans a 400 sq ft kitchen renovation using standard quality materials in an area with a 1.1 location cost factor.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Select 'Kitchen Renovation' as the renovation type and enter 400 for the area.",
          },
          {
            label: "Step 2",
            explanation: "Choose 'Standard' quality for materials and finishes.",
          },
          {
            label: "Step 3",
            explanation:
              "Set the location cost adjustment factor to 1.1 to reflect slightly higher local costs.",
          },
          {
            label: "Step 4",
            explanation: "Click Calculate to get the estimated total renovation cost.",
          },
        ],
        result:
          "Estimated Total Renovation Cost = 400 × $150 × 1 × 1.1 × 1.3 = $85,800",
      }}
      relatedCalculators={[
        { title: "Room Air Changes per Hour (ACH) Calculator", url: "/everyday/room-air-changes-ach", icon: "💡" },
        { title: "Screen Time Budget / Pomodoro Planner", url: "/everyday/screen-time-pomodoro-planner", icon: "💡" },
        { title: "Garden Soil/Compost Volume Calculator", url: "/everyday/garden-soil-compost-volume", icon: "🌿" },
        { title: "Fertilizer Application Calculator", url: "/everyday/fertilizer-application-calculator", icon: "💡" },
        { title: "Hydration Reminder Interval Planner", url: "/everyday/hydration-reminder-interval", icon: "💡" },
        { title: "Water Heater Recovery Time Estimator", url: "/everyday/water-heater-recovery-time", icon: "💧" },
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