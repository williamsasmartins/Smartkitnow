import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ FULL ICON IMPORT
import {
  Home,
  Heart,
  Utensils,
  Leaf,
  Calendar,
  DollarSign,
  Droplets,
  Activity,
  Moon,
  Sun,
  Users,
  Paintbrush,
  Wrench,
  Info,
  RotateCcw,
  AlertTriangle,
  FlaskConical,
  Scale,
  Waves,
  Zap,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function HomeRenovationCostEstimatorCalculator() {
  // Inputs: square footage, renovation type, quality level, labor cost per hour, estimated labor hours, contingency %
  const [inputs, setInputs] = useState({
    squareFootage: "",
    renovationType: "",
    qualityLevel: "",
    laborCostPerHour: "",
    laborHours: "",
    contingencyPercent: "10",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Base material cost per sqft by renovation type and quality level (USD)
  const materialCosts = {
    kitchen: { low: 100, medium: 175, high: 300 },
    bathroom: { low: 80, medium: 140, high: 250 },
    flooring: { low: 5, medium: 10, high: 20 },
    painting: { low: 2, medium: 4, high: 6 },
    roofing: { low: 50, medium: 90, high: 150 },
    general: { low: 30, medium: 60, high: 100 },
  };

  // Labor cost calculation: laborCostPerHour * laborHours
  // Contingency: percentage added on top of subtotal (materials + labor)

  const results = useMemo(() => {
    const sqft = parseFloat(inputs.squareFootage);
    const laborCostPerHour = parseFloat(inputs.laborCostPerHour);
    const laborHours = parseFloat(inputs.laborHours);
    const contingencyPercent = parseFloat(inputs.contingencyPercent);
    const renovationType = inputs.renovationType;
    const qualityLevel = inputs.qualityLevel;

    if (
      !sqft ||
      sqft <= 0 ||
      !laborCostPerHour ||
      laborCostPerHour <= 0 ||
      !laborHours ||
      laborHours < 0 ||
      !contingencyPercent ||
      contingencyPercent < 0 ||
      !renovationType ||
      !qualityLevel
    ) {
      return {
        value: null,
        label: "",
        subtext: "",
        warning: "Please fill in all fields with valid positive numbers.",
        formulaUsed: "",
      };
    }

    // Determine material cost per sqft
    const materialCostPerSqft =
      materialCosts[renovationType]?.[qualityLevel] ?? materialCosts.general[qualityLevel];

    // Calculate material cost
    const materialCost = sqft * materialCostPerSqft;

    // Calculate labor cost
    const laborCost = laborCostPerHour * laborHours;

    // Subtotal before contingency
    const subtotal = materialCost + laborCost;

    // Contingency amount
    const contingencyAmount = (subtotal * contingencyPercent) / 100;

    // Total estimated cost
    const totalCost = subtotal + contingencyAmount;

    return {
      value: `$${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      label: "Estimated Total Renovation Cost",
      subtext: `Includes materials, labor, and a ${contingencyPercent}% contingency buffer.`,
      warning: null,
      formulaUsed: `Total Cost = (Square Footage × Material Cost per Sqft) + (Labor Cost per Hour × Labor Hours) + Contingency`,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What factors influence the cost of home renovation projects?",
      answer:
        "Home renovation costs are influenced by several key factors including the size of the area being renovated, the type of renovation (kitchen, bathroom, flooring, etc.), the quality of materials selected, labor costs in your region, and any unforeseen issues that may arise during construction. Additionally, project complexity and the need for permits or specialized contractors can significantly impact the overall budget.",
    },
    {
      question: "How accurate is this renovation cost estimator?",
      answer:
        "This estimator provides a detailed approximation based on typical material and labor costs for various renovation types and quality levels. However, actual costs can vary due to regional price differences, contractor rates, project scope changes, and unexpected complications. It is recommended to use this as a budgeting tool and consult with professionals for precise quotes tailored to your specific project.",
    },
    {
      question: "Why should I include a contingency percentage in my renovation budget?",
      answer:
        "Including a contingency percentage in your renovation budget is essential to cover unexpected expenses such as hidden damage, price increases in materials, or additional labor requirements. Renovation projects often encounter surprises that can increase costs, so setting aside a contingency (commonly 10-20%) helps ensure you have financial flexibility to handle these without derailing your project.",
    },
    {
      question: "Can I use this calculator for multiple renovation types in one project?",
      answer:
        "This calculator is designed to estimate costs for a single renovation type at a time. For projects involving multiple renovation types (e.g., kitchen and bathroom), it is best to run separate calculations for each area and then sum the results to get a comprehensive budget estimate. This approach ensures more accurate cost breakdowns and better project planning.",
    },
    {
      question: "How do labor costs affect the total renovation budget?",
      answer:
        "Labor costs can constitute a significant portion of your renovation budget, often ranging from 30% to 50% of total expenses depending on the complexity of the work and local wage rates. Accurately estimating labor hours and hourly rates is crucial because underestimating labor can lead to budget overruns. This calculator allows you to input your expected labor costs to tailor the estimate to your situation.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card className="p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="squareFootage" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
              Total Renovation Area (Square Feet)
            </Label>
            <Input
              id="squareFootage"
              type="number"
              min={0}
              step={1}
              placeholder="e.g., 1200"
              value={inputs.squareFootage}
              onChange={(e) => handleInputChange("squareFootage", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="renovationType" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
              Renovation Type
            </Label>
            <Select
              value={inputs.renovationType}
              onValueChange={(v) => handleInputChange("renovationType", v)}
              id="renovationType"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kitchen">
                  Kitchen <Utensils className="inline ml-1 mb-0.5" size={14} />
                </SelectItem>
                <SelectItem value="bathroom">
                  Bathroom <Droplets className="inline ml-1 mb-0.5" size={14} />
                </SelectItem>
                <SelectItem value="flooring">
                  Flooring <Scale className="inline ml-1 mb-0.5" size={14} />
                </SelectItem>
                <SelectItem value="painting">
                  Painting <Paintbrush className="inline ml-1 mb-0.5" size={14} />
                </SelectItem>
                <SelectItem value="roofing">
                  Roofing <Wrench className="inline ml-1 mb-0.5" size={14} />
                </SelectItem>
                <SelectItem value="general">
                  General Renovation <Home className="inline ml-1 mb-0.5" size={14} />
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="qualityLevel" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
              Quality Level of Materials
            </Label>
            <Select
              value={inputs.qualityLevel}
              onValueChange={(v) => handleInputChange("qualityLevel", v)}
              id="qualityLevel"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select quality" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">
                  Low <AlertTriangle className="inline ml-1 mb-0.5" size={14} />
                </SelectItem>
                <SelectItem value="medium">
                  Medium <Info className="inline ml-1 mb-0.5" size={14} />
                </SelectItem>
                <SelectItem value="high">
                  High <Heart className="inline ml-1 mb-0.5" size={14} />
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="laborCostPerHour" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
              Labor Cost per Hour (USD)
            </Label>
            <Input
              id="laborCostPerHour"
              type="number"
              min={0}
              step={0.01}
              placeholder="e.g., 50"
              value={inputs.laborCostPerHour}
              onChange={(e) => handleInputChange("laborCostPerHour", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="laborHours" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
              Estimated Labor Hours
            </Label>
            <Input
              id="laborHours"
              type="number"
              min={0}
              step={1}
              placeholder="e.g., 100"
              value={inputs.laborHours}
              onChange={(e) => handleInputChange("laborHours", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="contingencyPercent" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
              Contingency Percentage (%)
            </Label>
            <Input
              id="contingencyPercent"
              type="number"
              min={0}
              step={1}
              placeholder="e.g., 10"
              value={inputs.contingencyPercent}
              onChange={(e) => handleInputChange("contingencyPercent", e.target.value)}
            />
          </div>
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // Just trigger recalculation by updating state (already done on input change)
          }}
        >
          <Home className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              squareFootage: "",
              renovationType: "",
              qualityLevel: "",
              laborCostPerHour: "",
              laborHours: "",
              contingencyPercent: "10",
            })
          }
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="mt-2 text-lg font-medium text-blue-800 dark:text-blue-300">{results.label}</p>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">{results.subtext}</p>
            {results.warning && (
              <p className="mt-3 text-sm text-red-600 dark:text-red-400 font-semibold">{results.warning}</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding the Basics</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Home renovation is a complex process that involves upgrading or improving various parts of your living space.
          Whether you are remodeling a kitchen, bathroom, flooring, or the entire house, understanding the cost components
          is crucial for effective budgeting. Renovation costs typically include materials, labor, permits, and unexpected
          expenses that can arise during the project.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The cost per square foot varies widely depending on the renovation type and the quality of materials chosen.
          Labor costs also fluctuate based on project complexity and regional wage differences. Additionally, it is
          important to include a contingency buffer in your budget to accommodate unforeseen issues such as structural
          repairs or design changes. This calculator helps you estimate these costs by allowing you to input key variables
          and providing a comprehensive cost estimate.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This Home Renovation Cost Estimator is designed to give you a detailed and realistic estimate of your renovation
          expenses. To get the most accurate results, carefully enter the required information about your project. Follow
          these steps to use the calculator effectively:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter the total square footage of the area you plan to renovate. This is the
            measurable size of the space in square feet.
          </li>
          <li>
            <strong>Step 2:</strong> Select the type of renovation you are undertaking, such as kitchen, bathroom,
            flooring, painting, roofing, or general renovation. This selection helps determine the base material costs.
          </li>
          <li>
            <strong>Step 3:</strong> Choose the quality level of materials you intend to use: low, medium, or high.
            Higher quality materials generally cost more but may offer better durability and aesthetics.
          </li>
          <li>
            <strong>Step 4:</strong> Input the labor cost per hour based on quotes or average rates in your area.
            Labor costs can vary significantly depending on location and contractor expertise.
          </li>
          <li>
            <strong>Step 5:</strong> Estimate the total number of labor hours required to complete the renovation.
            If unsure, consult with a contractor or use industry averages for your renovation type.
          </li>
          <li>
            <strong>Step 6:</strong> Specify a contingency percentage to cover unexpected costs. A typical range is
            10-20%, but you can adjust based on your risk tolerance.
          </li>
          <li>
            <strong>Step 7:</strong> Click the <em>Calculate</em> button to see your estimated total renovation cost,
            which includes materials, labor, and contingency.
          </li>
          <li>
            <strong>Step 8:</strong> Review the results and adjust inputs as needed to explore different scenarios or
            budgets.
          </li>
        </ul>
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
          "Total Cost = (Square Footage × Material Cost per Sqft) + (Labor Cost per Hour × Labor Hours) + Contingency",
        variables: [
          {
            symbol: "Square Footage",
            description: "The total area in square feet that will be renovated.",
          },
          {
            symbol: "Material Cost per Sqft",
            description:
              "Cost of materials per square foot, varying by renovation type and quality level.",
          },
          {
            symbol: "Labor Cost per Hour",
            description: "Hourly rate paid to laborers or contractors.",
          },
          {
            symbol: "Labor Hours",
            description: "Estimated total hours of labor required for the project.",
          },
          {
            symbol: "Contingency",
            description:
              "Additional percentage added to cover unexpected expenses during renovation.",
          },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "Suppose you want to renovate a 1,200 square foot kitchen with medium quality materials. Labor costs are $60 per hour, and you estimate 100 labor hours. You decide to include a 10% contingency to cover unforeseen expenses.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Calculate material costs: 1,200 sqft × $175 (medium quality kitchen materials) = $210,000.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate labor costs: $60/hour × 100 hours = $6,000.",
          },
          {
            label: "Step 3",
            explanation:
              "Calculate subtotal: $210,000 + $6,000 = $216,000.",
          },
          {
            label: "Step 4",
            explanation:
              "Calculate contingency: 10% of $216,000 = $21,600.",
          },
          {
            label: "Step 5",
            explanation:
              "Calculate total estimated cost: $216,000 + $21,600 = $237,600.",
          },
        ],
        result: "The estimated total renovation cost for this kitchen project is $237,600, including materials, labor, and contingency.",
      }}
      relatedCalculators={[
        { title: "MyPlate Daily Calorie/Nutrient Planner", url: "/everyday-life/myplate-daily-calorie-nutrient", icon: "💡" },
        { title: "Caffeine Max per Day Calculator", url: "/everyday-life/caffeine-max-per-day", icon: "💡" },
        { title: "Plant Spacing Calculator", url: "/everyday-life/plant-spacing-calculator", icon: "🌿" },
        { title: "Body Fat Percentage Calculator", url: "/everyday-life/body-fat-percentage", icon: "❤️" },
        { title: "Cleaning Dilution Ratio Calculator", url: "/everyday-life/cleaning-dilution-ratio", icon: "🏠" },
        { title: "Grass Seed Quantity Calculator", url: "/everyday-life/grass-seed-quantity", icon: "🌿" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding" },
        { id: "how-to", label: "How to Use" },
        { id: "faq", label: "FAQ" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}