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

export default function LeftoversCoolingReheatTimeCalculator() {
  const [inputs, setInputs] = useState({
    portionSize: "",
    foodType: "",
    coolingMethod: "",
    reheatMethod: "",
  });
  const handleInputChange = useCallback((n, v) => setInputs(p => ({ ...p, [n]: v })), []);

  /**
   * Cooling time estimation logic:
   * - According to USDA and CDC, leftovers should be cooled from 140°F to 70°F within 2 hours,
   *   and from 70°F to 40°F within an additional 4 hours.
   * - Cooling method affects speed: shallow containers cool faster than deep ones.
   * - Portion size impacts cooling time: larger portions take longer.
   * 
   * Reheat time estimation:
   * - USDA recommends reheating leftovers to 165°F to ensure safety.
   * - Reheat time depends on method (microwave, oven, stovetop).
   * 
   * This calculator estimates safe cooling and reheating times based on inputs.
   */

  const coolingTimeByPortion = {
    small: 2, // hours to cool to 70°F
    medium: 3,
    large: 4,
  };

  const coolingMethodModifier = {
    shallow: 0.8,
    deep: 1.2,
    fridge: 1,
  };

  const reheatTimeByMethod = {
    microwave: 3, // minutes average
    oven: 15,
    stovetop: 10,
  };

  const foodTypeSafetyNote = {
    meat: "Meat and poultry leftovers require strict cooling and reheating to prevent bacterial growth.",
    vegetable: "Vegetable leftovers cool faster but still require proper handling to avoid spoilage.",
    dairy: "Dairy-based leftovers are highly perishable and should be cooled and reheated promptly.",
    mixed: "Mixed dishes require careful cooling and reheating to ensure all components are safe.",
  };

  const results = useMemo(() => {
    const portion = inputs.portionSize;
    const coolingMethod = inputs.coolingMethod;
    const reheatMethod = inputs.reheatMethod;
    const foodType = inputs.foodType;

    if (!portion || !coolingMethod || !reheatMethod || !foodType) {
      return { value: "", label: "", subtext: "", warning: null, formulaUsed: "" };
    }

    // Estimate cooling time to 70°F
    const baseCoolingHours = coolingTimeByPortion[portion] || 3;
    const coolingModifier = coolingMethodModifier[coolingMethod] || 1;
    const coolingHours = baseCoolingHours * coolingModifier;

    // Total cooling time to 40°F (additional 4 hours standard)
    const totalCoolingHours = coolingHours + 4;

    // Reheat time in minutes
    const reheatMinutes = reheatTimeByMethod[reheatMethod] || 10;

    // Safety warning if cooling time exceeds recommended max (6 hours total)
    const warning = totalCoolingHours > 6 ? "Warning: Cooling time exceeds USDA recommended 6 hours total. Risk of bacterial growth increases." : null;

    return {
      value: `${totalCoolingHours.toFixed(1)} hours cooling + ${reheatMinutes} minutes reheating`,
      label: "Estimated Safe Cooling & Reheat Time",
      subtext: foodTypeSafetyNote[foodType] || "",
      warning,
      formulaUsed: `Cooling Time = Base Portion Cooling Time × Cooling Method Modifier + 4 hours (to 40°F)
Reheat Time based on method`,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "Why is it important to cool leftovers quickly?",
      answer:
        "Rapid cooling of leftovers is crucial to prevent the growth of harmful bacteria. The USDA recommends cooling food from 140°F to 70°F within 2 hours, and then to 40°F within an additional 4 hours to minimize foodborne illness risks.",
    },
    {
      question: "Can I reheat leftovers multiple times?",
      answer:
        "It is not recommended to reheat leftovers more than once, as repeated heating and cooling cycles increase the risk of bacterial contamination and food spoilage. Always reheat only the portion you plan to consume.",
    },
    {
      question: "What is the safest way to reheat leftovers?",
      answer:
        "The safest reheating methods are those that heat food evenly to an internal temperature of 165°F, such as microwaving, oven baking, or stovetop heating. Use a food thermometer to ensure proper temperature is reached.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="portionSize" className="mb-1 flex items-center gap-1">
                Portion Size <Scale className="w-4 h-4 text-blue-600" />
              </Label>
              <Select
                value={inputs.portionSize}
                onValueChange={(v) => handleInputChange("portionSize", v)}
                id="portionSize"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select portion size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small (single serving)</SelectItem>
                  <SelectItem value="medium">Medium (family size)</SelectItem>
                  <SelectItem value="large">Large (party size)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="foodType" className="mb-1 flex items-center gap-1">
                Food Type <Utensils className="w-4 h-4 text-green-600" />
              </Label>
              <Select
                value={inputs.foodType}
                onValueChange={(v) => handleInputChange("foodType", v)}
                id="foodType"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select food type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="meat">Meat & Poultry</SelectItem>
                  <SelectItem value="vegetable">Vegetables</SelectItem>
                  <SelectItem value="dairy">Dairy-based</SelectItem>
                  <SelectItem value="mixed">Mixed Dishes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="coolingMethod" className="mb-1 flex items-center gap-1">
                Cooling Method <Droplets className="w-4 h-4 text-cyan-600" />
              </Label>
              <Select
                value={inputs.coolingMethod}
                onValueChange={(v) => handleInputChange("coolingMethod", v)}
                id="coolingMethod"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select cooling method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="shallow">Shallow Container</SelectItem>
                  <SelectItem value="deep">Deep Container</SelectItem>
                  <SelectItem value="fridge">Direct Refrigeration</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="reheatMethod" className="mb-1 flex items-center gap-1">
                Reheat Method <FlaskConical className="w-4 h-4 text-red-600" />
              </Label>
              <Select
                value={inputs.reheatMethod}
                onValueChange={(v) => handleInputChange("reheatMethod", v)}
                id="reheatMethod"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select reheat method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="microwave">Microwave</SelectItem>
                  <SelectItem value="oven">Oven</SelectItem>
                  <SelectItem value="stovetop">Stovetop</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {}}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          aria-label="Calculate cooling and reheat time"
        >
          <Home className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ portionSize: "", foodType: "", coolingMethod: "", reheatMethod: "" })}
          className="flex-1 h-11"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            {results.subtext && (
              <p className="mt-3 text-lg text-blue-800 dark:text-blue-300">{results.subtext}</p>
            )}
            {results.warning && (
              <p className="mt-4 text-sm text-red-700 dark:text-red-400 font-semibold flex items-center justify-center gap-2">
                <AlertTriangle className="w-5 h-5" /> {results.warning}
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding Leftovers Cooling & Reheat Time</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Proper handling of leftovers is essential to prevent foodborne illnesses caused by bacterial growth. When food is left at unsafe temperatures for too long, bacteria such as Clostridium perfringens and Salmonella can multiply rapidly. The cooling process must be swift to bring the temperature down from the danger zone (between 140°F and 40°F) within the recommended time frames. Additionally, reheating leftovers to the correct internal temperature ensures that any bacteria present are effectively destroyed, making the food safe to consume again.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This calculator helps estimate the safe cooling and reheating times based on portion size, food type, and methods used. By following these guidelines, you can minimize the risk of spoilage and foodborne illness, ensuring your leftovers remain safe and enjoyable.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To get an accurate estimate of the safe cooling and reheating times for your leftovers, provide the following information in the input fields below. This calculator uses established food safety standards and scientific data to provide reliable guidance.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li><strong>Step 1:</strong> Select the portion size of your leftovers. Smaller portions cool faster, while larger portions require more time.</li>
          <li><strong>Step 2:</strong> Choose the type of food you are storing, such as meat, vegetables, dairy-based dishes, or mixed meals, as perishability varies.</li>
          <li><strong>Step 3:</strong> Indicate the cooling method you will use. Shallow containers and refrigeration speed up cooling compared to deep containers.</li>
          <li><strong>Step 4:</strong> Select your reheating method. Different methods require varying times to reach the safe internal temperature.</li>
          <li><strong>Step 5:</strong> Click "Calculate" to see the recommended cooling and reheating times along with safety notes.</li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Professional Tips & Safety</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Food safety experts emphasize the importance of rapid cooling and thorough reheating to prevent foodborne illnesses. Always divide large portions into smaller, shallow containers to accelerate cooling. Avoid leaving leftovers at room temperature for extended periods, as this promotes bacterial growth. Use a food thermometer to verify that reheated leftovers reach at least 165°F internally. Additionally, never reheat leftovers more than once, and discard any food left out for more than two hours.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Proper storage and handling not only protect your health but also reduce food waste by extending the safe consumption window of your meals. Following these guidelines ensures your leftovers remain safe, tasty, and nutritious.
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
              href="https://www.cdc.gov/foodsafety/keep-food-safe.html"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              CDC - Food Safety (https://www.cdc.gov/foodsafety/keep-food-safe.html) <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Comprehensive guidelines on safe food handling, cooling, and reheating to prevent foodborne illnesses.
            </p>
          </li>
          <li>
            <a
              href="https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/leftovers-and-food-safety"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              USDA FSIS - Leftovers and Food Safety (https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/leftovers-and-food-safety) <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Official USDA guidelines on how to properly cool, store, and reheat leftovers to ensure safety.
            </p>
          </li>
          <li>
            <a
              href="https://extension.umn.edu/food-safety-0/safe-cooling-and-reheating-leftovers"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              University of Minnesota Extension - Safe Cooling and Reheating Leftovers (https://extension.umn.edu/food-safety-0/safe-cooling-and-reheating-leftovers) <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Educational resource detailing best practices for cooling and reheating leftovers safely at home.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Leftovers Cooling & Reheat Time"
      description="Handle leftovers safely. Estimate cooling times and safe reheating duration to prevent food spoilage after big meals."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Methodology",
        formula:
          "Cooling Time = Base Portion Cooling Time × Cooling Method Modifier + 4 hours (to 40°F)\nReheat Time based on method",
        variables: [
          { name: "Base Portion Cooling Time", description: "Hours needed to cool portion to 70°F based on size" },
          { name: "Cooling Method Modifier", description: "Factor adjusting cooling time based on container type" },
          { name: "4 hours", description: "Standard time to cool from 70°F to 40°F" },
          { name: "Reheat Time", description: "Minutes required to reheat leftovers to 165°F based on method" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "You have a medium-sized portion of meat leftovers stored in a shallow container and plan to reheat them in the microwave.",
        steps: [
          {
            label: "Step 1",
            explanation: "Select 'Medium' for portion size, 'Meat & Poultry' for food type, 'Shallow Container' for cooling method, and 'Microwave' for reheating.",
          },
          {
            label: "Step 2",
            explanation: "Click 'Calculate' to get the recommended cooling and reheating times.",
          },
          {
            label: "Step 3",
            explanation:
              "The calculator estimates approximately 5.6 hours total cooling time (3 hours base × 0.8 modifier + 4 hours) and 3 minutes reheating time.",
          },
        ],
        result: "Cool leftovers within 5.6 hours and reheat thoroughly for at least 3 minutes to 165°F before consumption.",
      }}
      relatedCalculators={[
        { title: "Propane Tank Burn Time Estimator", url: "/everyday-life/propane-tank-burn-time", icon: "💡" },
        { title: "Party Food & Drinks Planner", url: "/everyday-life/party-food-drinks-planner", icon: "🎉" },
        { title: "Hydration Reminder Interval Planner", url: "/everyday-life/hydration-reminder-interval", icon: "💡" },
        { title: "Home Renovation Cost Estimator", url: "/everyday-life/home-renovation-cost-estimator", icon: "🏠" },
        { title: "Event Budget Calculator", url: "/everyday-life/event-budget-calculator", icon: "💡" },
        { title: "Light Bulb Cost per Year Calculator", url: "/everyday-life/light-bulb-cost-per-year", icon: "🏠" },
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