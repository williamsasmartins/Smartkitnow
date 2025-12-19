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
      question: "How accurate is this home renovation cost estimator?",
      answer:
        "This estimator provides a general approximation based on average costs per square foot and common multipliers for labor and quality. Actual costs can vary depending on specific project details, local market conditions, and unforeseen issues during renovation.",
    },
    {
      question: "What factors can cause renovation costs to increase?",
      answer:
        "Costs can increase due to factors such as structural repairs, permits, high-end materials, custom designs, changes in project scope, and regional labor rates. It's important to budget for contingencies and consult with professionals for detailed quotes.",
    },
    {
      question: "Can I use this calculator for commercial renovations?",
      answer:
        "This calculator is designed specifically for residential home renovations. Commercial projects often have different requirements, codes, and cost structures, so a specialized estimator should be used for commercial renovations.",
    },
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
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Home Renovation Cost Estimator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Home renovation projects can vary widely in scope, materials, labor, and location, making cost estimation a complex task.
          This Home Renovation Cost Estimator is designed to provide a comprehensive, data-driven approximation of your renovation expenses
          by factoring in the renovation type, area size, material quality, and local cost adjustments. By combining average cost per square foot
          data with multipliers for labor and quality, this tool helps homeowners create realistic budgets and plan their projects effectively.
          Understanding these components empowers you to make informed decisions and avoid unexpected expenses during your renovation journey.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this calculator is straightforward and intuitive. Begin by selecting the type of renovation you plan to undertake, such as kitchen,
          bathroom, or whole house renovation. Next, enter the total area in square feet that will be renovated. Choose the quality level of materials
          and finishes you intend to use, ranging from economy to premium. Finally, adjust the location cost factor to reflect your area's typical
          construction costs relative to the national average. Once all inputs are set, click Calculate to receive an estimated total renovation cost.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select the renovation type that best matches your project scope.
          </li>
          <li>
            <strong>Step 2:</strong> Input the total square footage of the area you plan to renovate.
          </li>
          <li>
            <strong>Step 3:</strong> Choose the desired quality level for materials and finishes.
          </li>
          <li>
            <strong>Step 4:</strong> Enter a location cost adjustment factor to account for regional price differences.
          </li>
          <li>
            <strong>Step 5:</strong> Click the Calculate button to view your estimated renovation cost.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Professional Tips & Safety</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          When planning a home renovation, it is crucial to allocate a contingency budget of at least 10-20% to cover unexpected expenses such as
          structural repairs or code compliance upgrades. Always obtain multiple quotes from licensed contractors and verify their credentials
          to ensure quality workmanship and fair pricing. Prioritize safety by ensuring all electrical, plumbing, and structural work complies with
          local building codes and regulations. Additionally, consider energy-efficient upgrades that can reduce long-term utility costs and increase
          your home's value. Proper planning and professional guidance will help you achieve a successful renovation within your budget.
        </p>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <ul className="space-y-6">
          {faqs.map((item, i) => (
            <li key={i} className="border-b border-slate-200 dark:border-slate-800 pb-4 last:border-0">
              <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-2">{item.question}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.answer}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* NEW RICH REFERENCES SECTION */}
      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References & Additional Resources</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
          For further reading and verification, please refer to these authoritative sources:
        </p>
        <ul className="space-y-4">
          <li>
            <a
              href="https://www.homeadvisor.com/r/home-renovation-costs/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              HomeAdvisor: Home Renovation Costs <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Comprehensive data on average renovation costs by project type and region, helping homeowners budget effectively.
            </p>
          </li>
          <li>
            <a
              href="https://www.energy.gov/energysaver/home-improvement-projects"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Energy.gov: Home Improvement Projects <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Guidance on energy-efficient renovations and upgrades that can reduce costs and improve home comfort.
            </p>
          </li>
          <li>
            <a
              href="https://extension.psu.edu/home-renovation-budgeting"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Penn State Extension: Home Renovation Budgeting <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Educational resource offering detailed budgeting strategies and cost considerations for home renovations.
            </p>
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
        { title: "Room Air Changes per Hour (ACH) Calculator", url: "/everyday-life/room-air-changes-ach", icon: "💡" },
        { title: "Screen Time Budget / Pomodoro Planner", url: "/everyday-life/screen-time-pomodoro-planner", icon: "💡" },
        { title: "Garden Soil/Compost Volume Calculator", url: "/everyday-life/garden-soil-compost-volume", icon: "🌿" },
        { title: "Fertilizer Application Calculator", url: "/everyday-life/fertilizer-application-calculator", icon: "💡" },
        { title: "Hydration Reminder Interval Planner", url: "/everyday-life/hydration-reminder-interval", icon: "💡" },
        { title: "Water Heater Recovery Time Estimator", url: "/everyday-life/water-heater-recovery-time", icon: "💧" },
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