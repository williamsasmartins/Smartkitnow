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

const PROPANE_DENSITY_LB_PER_GAL = 4.24; // Propane density in pounds per gallon (liquid)
const PROPANE_BTU_PER_LB = 21_548; // Approximate energy content per pound of propane (BTU)
const PROPANE_LB_PER_CUBIC_FT = 0.116; // Propane weight per cubic foot (gas)
const PROPANE_GAL_TO_LB = PROPANE_DENSITY_LB_PER_GAL; // For liquid propane gallons to pounds

export default function PropaneTankBurnTimeCalculator() {
  const [inputs, setInputs] = useState({
    tankSize: "", // in gallons
    btuUsage: "", // in BTU/hr
    applianceType: "Grill",
  });
  const handleInputChange = useCallback((n, v) => setInputs(p => ({ ...p, [n]: v })), []);

  // Calculate burn time in hours
  // Formula: Burn Time (hours) = (Tank Size in gallons * Propane density lb/gal * BTU/lb) / Appliance BTU/hr
  // Explanation: Total BTUs in tank divided by appliance consumption rate
  const results = useMemo(() => {
    const tankSize = parseFloat(inputs.tankSize);
    const btuUsage = parseFloat(inputs.btuUsage);

    if (!tankSize || tankSize <= 0) {
      return {
        value: null,
        label: null,
        subtext: "Please enter a valid propane tank size in gallons.",
        warning: null,
        formulaUsed: null,
      };
    }
    if (!btuUsage || btuUsage <= 0) {
      return {
        value: null,
        label: null,
        subtext: "Please enter a valid appliance BTU usage per hour.",
        warning: null,
        formulaUsed: null,
      };
    }

    // Calculate total BTUs in tank
    const totalBTUs = tankSize * PROPANE_DENSITY_LB_PER_GAL * PROPANE_BTU_PER_LB;
    const burnTimeHours = totalBTUs / btuUsage;

    // Warn if burn time is very short or very long (arbitrary thresholds)
    let warning = null;
    if (burnTimeHours < 0.1) {
      warning = "Warning: Burn time is very short. Check your inputs.";
    } else if (burnTimeHours > 1000) {
      warning = "Warning: Burn time is unusually long. Verify appliance BTU usage.";
    }

    return {
      value: burnTimeHours.toFixed(2) + " hours",
      label: `Estimated Burn Time for your ${inputs.applianceType}`,
      subtext: `Based on a ${tankSize} gallon tank and ${btuUsage.toLocaleString()} BTU/hr appliance consumption.`,
      warning,
      formulaUsed: `Burn Time = (Tank Size × ${PROPANE_DENSITY_LB_PER_GAL} lb/gal × ${PROPANE_BTU_PER_LB.toLocaleString()} BTU/lb) ÷ Appliance BTU/hr`,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What factors affect propane tank burn time?",
      answer:
        "Propane tank burn time depends primarily on the tank size and the appliance's BTU consumption rate. Environmental factors such as temperature can also affect pressure and flow rate, but the main calculation is based on energy content and usage rate.",
    },
    {
      question: "Can I use this calculator for any propane appliance?",
      answer:
        "Yes, this calculator works for any propane appliance as long as you know its BTU consumption per hour. Common appliances include grills, heaters, generators, and stoves. Always verify the appliance's BTU rating from the manufacturer for accurate estimates.",
    },
    {
      question: "Why is propane density important in this calculation?",
      answer:
        "Propane density (weight per gallon) is crucial because the energy content is measured per pound of propane. Knowing how many pounds of propane are in a gallon allows us to convert tank volume into total energy available, which is then divided by appliance consumption to estimate burn time.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="tankSize" className="mb-1 flex items-center gap-1">
              Propane Tank Size (gallons) <Droplets className="w-4 h-4 text-blue-600" />
            </Label>
            <Input
              id="tankSize"
              type="number"
              min={0}
              step="any"
              placeholder="e.g., 20"
              value={inputs.tankSize}
              onChange={e => handleInputChange("tankSize", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="btuUsage" className="mb-1 flex items-center gap-1">
              Appliance BTU Usage per Hour <Zap className="w-4 h-4 text-yellow-600" />
            </Label>
            <Input
              id="btuUsage"
              type="number"
              min={0}
              step="any"
              placeholder="e.g., 30000"
              value={inputs.btuUsage}
              onChange={e => handleInputChange("btuUsage", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="applianceType" className="mb-1 flex items-center gap-1">
              Appliance Type <Utensils className="w-4 h-4 text-green-600" />
            </Label>
            <Select
              value={inputs.applianceType}
              onValueChange={v => handleInputChange("applianceType", v)}
              id="applianceType"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select appliance type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Grill">Grill</SelectItem>
                <SelectItem value="Heater">Heater</SelectItem>
                <SelectItem value="Generator">Generator</SelectItem>
                <SelectItem value="Stove">Stove</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // Trigger recalculation by setting inputs (no-op here since useMemo depends on inputs)
            setInputs(p => ({ ...p }));
          }}
        >
          <Home className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ tankSize: "", btuUsage: "", applianceType: "Grill" })}
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="text-lg font-semibold text-blue-800 dark:text-blue-300 mt-2">{results.label}</p>
            <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">{results.subtext}</p>
            {results.warning && (
              <p className="mt-3 text-sm text-red-600 dark:text-red-400 flex items-center justify-center gap-1">
                <AlertTriangle className="w-4 h-4" /> {results.warning}
              </p>
            )}
            <p className="mt-4 text-xs italic text-slate-600 dark:text-slate-400">{results.formulaUsed}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Propane Tank Burn Time Estimator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Propane is a widely used fuel source for outdoor grills, heaters, generators, and other appliances due to its portability and high energy content. Estimating how long a propane tank will last under continuous use is essential for planning and safety. This calculator uses the tank size in gallons and the appliance's BTU consumption rate to estimate the total burn time in hours. The calculation is grounded in the energy content of propane, which is approximately 21,548 BTUs per pound, and the density of liquid propane, roughly 4.24 pounds per gallon.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          By understanding these parameters, users can avoid running out of fuel unexpectedly and optimize their propane usage for efficiency and cost savings. This tool is designed to be the most authoritative and user-friendly propane burn time estimator available online.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this calculator is straightforward and requires only two key inputs: the size of your propane tank in gallons and the BTU consumption rate of your appliance. The appliance type selector helps contextualize your inputs but does not affect the calculation directly. Follow these steps to get an accurate estimate:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter the propane tank size in gallons. Common sizes include 20 lb tanks (~4.7 gallons) or larger tanks for home heating.
          </li>
          <li>
            <strong>Step 2:</strong> Input your appliance’s BTU usage per hour. This information is typically found on the appliance label or in the user manual.
          </li>
          <li>
            <strong>Step 3:</strong> Select the appliance type to help you keep track of your calculation context.
          </li>
          <li>
            <strong>Step 4:</strong> Click the Calculate button to see the estimated burn time in hours.
          </li>
          <li>
            <strong>Step 5:</strong> Review the results and any warnings to ensure your inputs are reasonable.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Professional Tips & Safety</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          When working with propane, safety is paramount. Always ensure your propane tanks are stored upright and in well-ventilated areas away from ignition sources. Regularly inspect hoses and connections for leaks using soapy water or approved leak detection solutions. Additionally, keep in mind that colder temperatures can reduce propane pressure, potentially affecting appliance performance and burn time.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          For longer burn times, consider using larger tanks or multiple tanks with proper switching systems. Always follow manufacturer guidelines for your specific appliances and never attempt to modify tanks or regulators. Proper maintenance and usage not only extend the life of your equipment but also ensure your safety and efficiency.
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
              href="https://www.energy.gov/eere/fuelcells/propane"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              U.S. Department of Energy - Propane (Energy.gov) <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Comprehensive information on propane as a fuel source, including energy content and usage considerations.
            </p>
          </li>
          <li>
            <a
              href="https://extension.uga.edu/publications/detail.html?number=C1000"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              University of Georgia Extension - Propane Fuel Facts <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Detailed facts about propane properties, storage, and safety from a trusted university extension program.
            </p>
          </li>
          <li>
            <a
              href="https://www.cdc.gov/niosh/topics/propane/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              CDC NIOSH - Propane Safety and Health Information <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Authoritative guidance on propane safety, health risks, and best practices from the Centers for Disease Control and Prevention.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Propane Tank Burn Time Estimator"
      description="Estimate propane tank burn time. Calculate how long your grill, heater, or generator will run based on tank size and BTU usage."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Methodology",
        formula:
          `Burn Time (hours) = (Tank Size (gallons) × Propane Density (lb/gal) × Energy Content (BTU/lb)) ÷ Appliance BTU Usage per Hour`,
        variables: [
          { symbol: "Tank Size", description: "Propane tank volume in gallons" },
          { symbol: "Propane Density", description: "Weight of propane per gallon (approx. 4.24 lb/gal)" },
          { symbol: "Energy Content", description: "Energy content of propane per pound (approx. 21,548 BTU/lb)" },
          { symbol: "Appliance BTU Usage", description: "Appliance fuel consumption rate in BTU per hour" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "You have a 20-gallon propane tank connected to a grill that consumes 30,000 BTU per hour. You want to know how long the grill will run before the tank is empty.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Calculate total BTUs in the tank: 20 gallons × 4.24 lb/gal × 21,548 BTU/lb = 1,828,390 BTUs approximately.",
          },
          {
            label: "Step 2",
            explanation:
              "Divide total BTUs by appliance consumption: 1,828,390 BTUs ÷ 30,000 BTU/hr = 60.95 hours.",
          },
          {
            label: "Step 3",
            explanation: "The grill will run for approximately 61 hours on a full 20-gallon tank.",
          },
        ],
        result: "Estimated burn time: ~61 hours.",
      }}
      relatedCalculators={[
        { title: "Appliance Energy Consumption Calculator", url: "/everyday/appliance-energy-consumption", icon: "💡" },
        { title: "Sleep Debt & Ideal Bedtime Planner", url: "/everyday/sleep-debt-ideal-bedtime", icon: "💡" },
        { title: "Wine/Beer/Soft Drink Mix Estimator", url: "/everyday/beverage-mix-estimator", icon: "🎉" },
        { title: "Plant Spacing Calculator", url: "/everyday/plant-spacing-calculator", icon: "🌿" },
        { title: "Body Mass Index (BMI) Calculator", url: "/everyday/bmi-calculator", icon: "❤️" },
        { title: "Caffeine Max per Day Calculator", url: "/everyday/caffeine-max-per-day", icon: "💡" },
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