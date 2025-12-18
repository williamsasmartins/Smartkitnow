import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// ⚠️ IMPORT ALL USED ICONS
import {
  Home,
  AlertTriangle,
  RotateCcw,
  Info,
  Droplets,
  FlaskConical,
  Scale,
  Waves,
  Zap,
  Leaf,
  Utensils,
  Heart,
  Calendar,
  DollarSign,
  Activity,
  Moon,
  Sun,
  Users,
  Paintbrush,
  Wrench
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

const LOAD_SIZES = [
  { label: "Small (up to 3 kg)", value: "small", dosage: 30 },
  { label: "Medium (3 - 6 kg)", value: "medium", dosage: 60 },
  { label: "Large (6 - 9 kg)", value: "large", dosage: 90 },
  { label: "Extra Large (9+ kg)", value: "xlarge", dosage: 120 },
];

export default function LaundryDetergentDosageCalculator() {
  const [inputs, setInputs] = useState({
    loadSize: "",
    detergentConcentration: "standard",
  });

  const handleInputChange = useCallback((name: string, value: string) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  const results = useMemo(() => {
    const { loadSize, detergentConcentration } = inputs;

    if (!loadSize) {
      return {
        value: "",
        label: "",
        subtext: "",
        warning: "Please select a load size to calculate dosage.",
        formulaUsed: null,
      };
    }

    const concentrationFactors: Record<string, number> = {
      standard: 1,
      concentrated: 0.7,
      ultraConcentrated: 0.5,
    };

    if (
      !detergentConcentration ||
      !(detergentConcentration in concentrationFactors)
    ) {
      return {
        value: "",
        label: "",
        subtext: "",
        warning:
          "Please select a valid detergent concentration type to calculate dosage.",
        formulaUsed: null,
      };
    }

    const baseDosage = LOAD_SIZES.find((l) => l.value === loadSize)?.dosage;

    if (!baseDosage) {
      return {
        value: "",
        label: "",
        subtext: "",
        warning: "Invalid load size selected.",
        formulaUsed: null,
      };
    }

    // Dosage calculation: base dosage * concentration factor
    const factor = concentrationFactors[detergentConcentration];
    const dosageMl = Math.round(baseDosage * factor);

    // Warning for very small or very large dosages
    let warning = null;
    // FIX: Use standard < and > operators for logic, NOT HTML entities
    if (dosageMl < 10) {
      warning =
        "Dosage is very low; ensure detergent is suitable for small loads to avoid residue.";
    }
    if (dosageMl > 150) {
      warning =
        "Dosage is quite high; consider splitting the load or using a more concentrated detergent.";
    }

    return {
      value: `${dosageMl} ml`,
      label: "Recommended Detergent Dosage",
      subtext:
        "Dosage is adjusted based on load size and detergent concentration.",
      warning,
      formulaUsed:
        "Dosage (ml) = Base Dosage × Concentration Factor",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "How do I know which load size to select?",
      answer:
        "Load size refers to the weight of laundry you put into your washing machine. Small loads are typically up to 3 kg, medium loads range from 3 to 6 kg, large loads from 6 to 9 kg, and extra large loads are over 9 kg. Weighing your laundry or estimating based on machine capacity helps select the correct size.",
    },
    {
      question: "What is detergent concentration and why does it matter?",
      answer:
        "Detergent concentration indicates how strong or diluted your detergent is. Standard detergents require more volume, while concentrated or ultra-concentrated detergents need less. Using the right dosage prevents residue buildup and ensures effective cleaning.",
    },
    {
      question: "Can I use this calculator for all types of detergents?",
      answer:
        "This calculator is designed for liquid detergents with standard, concentrated, or ultra-concentrated formulations. For powders or pods, follow manufacturer instructions. Always check detergent labels for best results.",
    },
    {
      question: "What if my washing machine has a different capacity?",
      answer:
        "This tool uses general load size categories. If your machine capacity differs, adjust the load size selection accordingly. For example, if your machine holds 8 kg, consider selecting 'Large' or 'Extra Large' based on actual laundry weight.",
    },
    {
      question: "Why is it important to avoid overdosing detergent?",
      answer:
        "Overdosing detergent can cause excessive suds, residue on clothes, and damage to your washing machine. It also wastes detergent and money. Using the recommended dosage ensures optimal cleaning and fabric care.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div>
        <Label htmlFor="loadSize" className="mb-2 inline-block font-semibold">
          Select Load Size
        </Label>
        <Select
          value={inputs.loadSize}
          onValueChange={(value) => handleInputChange("loadSize", value)}
          id="loadSize"
          aria-label="Select laundry load size"
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose load size" />
          </SelectTrigger>
          <SelectContent>
            {LOAD_SIZES.map(({ label, value }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label
          htmlFor="detergentConcentration"
          className="mb-2 inline-block font-semibold"
        >
          Detergent Concentration
          <Info className="inline ml-1 h-4 w-4 text-blue-600" />
        </Label>
        <Select
          value={inputs.detergentConcentration}
          onValueChange={(value) =>
            handleInputChange("detergentConcentration", value)
          }
          id="detergentConcentration"
          aria-label="Select detergent concentration"
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose detergent concentration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="standard">Standard</SelectItem>
            <SelectItem value="concentrated">Concentrated</SelectItem>
            <SelectItem value="ultraConcentrated">Ultra-Concentrated</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm text-slate-500 mt-1">
          Standard: typical liquid detergent. Concentrated: requires less dosage.
          Ultra-Concentrated: highly potent, use sparingly.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {}}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          aria-label="Calculate detergent dosage"
        >
          <Home className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ loadSize: "", detergentConcentration: "standard" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value && results.value !== "" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              {results.formulaUsed && (
                <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                  {results.formulaUsed}
                </p>
              )}
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
                {results.value}
              </p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">
                {results.label}
              </p>
              {results.subtext && (
                <p className="text-sm text-slate-500 mt-2">{results.subtext}</p>
              )}
              {results.warning && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-950 border border-red-200 rounded-lg flex items-start gap-3 text-left">
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800 dark:text-red-200">
                    {results.warning}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding the Basics
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Laundry detergent dosage is essential for effective cleaning and fabric
          care. Using too little detergent may leave clothes dirty, while too much
          can cause residue buildup, damage fabrics, and harm your washing machine.
          Detergent dosage depends primarily on the size of your laundry load and
          the concentration of the detergent you use. Load size is typically
          measured by weight, with categories such as small, medium, large, and
          extra large loads. Detergent concentration varies from standard to
          ultra-concentrated formulas, affecting the amount needed per wash.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator helps you determine the right amount of liquid detergent
          in milliliters (ml) based on your load size and detergent concentration.
          By following the recommended dosage, you save money, protect your clothes,
          and maintain your washing machine’s performance. Always check your
          detergent’s label for specific instructions and adjust dosage if you have
          heavily soiled clothes or hard water.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Remember, the goal is to use just enough detergent to clean effectively
          without waste. This calculator provides a practical guideline to help you
          achieve that balance with ease and confidence.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Start by selecting the load size that best matches the weight of your
          laundry. If unsure, weigh your clothes or estimate based on your washing
          machine’s capacity. Next, choose the detergent concentration type you are
          using: standard, concentrated, or ultra-concentrated. This affects how
          much detergent is needed per load.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Once both inputs are selected, click the “Calculate” button to see the
          recommended detergent dosage in milliliters. The result includes a clear
          label and notes on the calculation method. If your dosage is unusually
          low or high, a warning message will appear with practical advice.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Use the “Reset” button to clear inputs and start a new calculation. This
          tool is designed for liquid detergents and general load sizes; always
          consider manufacturer instructions for specific detergents or washing
          machines.
        </p>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Professional Tips & Safety
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          <strong>Tip 1:</strong> Always measure your detergent using the cap provided or a measuring cup. Estimating by eye often leads to overdosing.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          <strong>Tip 2:</strong> If you have hard water, you may need slightly more detergent. Conversely, for soft water, you might need less. Check your detergent bottle for specific hard water instructions.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          <strong>Safety:</strong> Keep laundry detergents out of reach of children and pets. In case of contact with eyes, rinse immediately with plenty of water.
        </p>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Frequently Asked Questions
        </h2>
        <ul className="space-y-6">
          {faqs.map((item, i) => (
            <li
              key={i}
              className="border-b border-slate-200 dark:border-slate-800 pb-4 last:border-0"
            >
              <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-2">
                {item.question}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.answer}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Laundry Detergent Dosage by Load Size"
      description="Determine the right laundry detergent dosage. Calculate the exact amount needed per load size to save money and protect clothes."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Methodology / Formula",
        formula: "Dosage (ml) = Base Dosage × Concentration Factor",
        variables: [
          {
            symbol: "Base Dosage",
            description:
              "Standard detergent amount in ml based on load size (small to extra large)",
          },
          {
            symbol: "Concentration Factor",
            description:
              "Adjustment multiplier based on detergent concentration: standard (1), concentrated (0.7), ultra-concentrated (0.5)",
          },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "You have a medium load (4.5 kg) and use a concentrated detergent.",
        steps: [
          {
            label: "1",
            explanation:
              "Select 'Medium (3 - 6 kg)' as load size and 'Concentrated' as detergent concentration.",
          },
          {
            label: "2",
            explanation:
              "Base dosage for medium load is 60 ml. Concentrated detergent factor is 0.7.",
          },
          {
            label: "3",
            explanation:
              "Calculate dosage: 60 ml × 0.7 = 42 ml recommended detergent.",
          },
        ],
        result: "Use 42 ml of detergent for your medium load with concentrated detergent.",
      }}
      relatedCalculators={[
        {
          title: "Screen Time Budget / Pomodoro Planner",
          url: "/everyday-life/screen-time-pomodoro-planner",
          icon: "Activity",
        },
        {
          title: "Planting Calendar & Frost Date Finder",
          url: "/everyday-life/planting-calendar-frost-date",
          icon: "Leaf",
        },
        {
          title: "Water Heater Recovery Time Estimator",
          url: "/everyday-life/water-heater-recovery-time",
          icon: "Droplets",
        },
        {
          title: "Wine/Beer/Soft Drink Mix Estimator",
          url: "/everyday-life/beverage-mix-estimator",
          icon: "Utensils",
        },
        {
          title: "Steps → Distance Converter",
          url: "/everyday-life/steps-to-distance-converter",
          icon: "Users",
        },
        {
          title: "Grass Seed Quantity Calculator",
          url: "/everyday-life/grass-seed-quantity",
          icon: "Leaf",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding the Basics" },
        { id: "how-to", label: "How to Use This Calculator" },
        { id: "tips", label: "Pro Tips & Safety" },
        { id: "faq", label: "Frequently Asked Questions" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}
