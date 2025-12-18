import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ IMPORT ALL USED ICONS
import {
  Home,
  AlertTriangle,
  RotateCcw,
  Droplets,
  Info,
  FlaskConical,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

const dilutionOptions = [
  { label: "1:5 (Strong)", ratio: 5 },
  { label: "1:10 (Medium)", ratio: 10 },
  { label: "1:20 (Light)", ratio: 20 },
  { label: "Custom", ratio: null },
];

export default function CleaningDilutionRatioCalculator() {
  const [inputs, setInputs] = useState({
    chemicalAmount: "", // in ml or grams (user decides)
    dilutionRatio: "10", // default 1:10
    totalSolutionVolume: "", // in ml or liters (user decides)
    unit: "ml", // ml or liters
  });

  const handleInputChange = useCallback((name, value) => {
    // Sanitize inputs: allow only numbers and dot for decimals
    if (
      ["chemicalAmount", "totalSolutionVolume", "dilutionRatio"].includes(name)
    ) {
      // Allow empty string for clearing input
      if (value === "") {
        setInputs((prev) => ({ ...prev, [name]: "" }));
        return;
      }
      // Validate numeric input
      if (/^\d*\.?\d*$/.test(value)) {
        setInputs((prev) => ({ ...prev, [name]: value }));
      }
      return;
    }
    if (name === "unit") {
      setInputs((prev) => ({ ...prev, unit: value }));
      return;
    }
  }, []);

  // Calculate results based on inputs
  const results = useMemo(() => {
    const chemicalAmountNum = parseFloat(inputs.chemicalAmount);
    const totalSolutionVolumeNum = parseFloat(inputs.totalSolutionVolume);
    const unit = inputs.unit;

    // dilutionRatio can be from select or custom input
    let dilutionRatioNum = null;
    if (inputs.dilutionRatio === "custom") {
      dilutionRatioNum = null;
    } else {
      dilutionRatioNum = Number(inputs.dilutionRatio);
      if (isNaN(dilutionRatioNum) || dilutionRatioNum <= 0) dilutionRatioNum = null;
    }

    // Validation warnings
    if (
      (inputs.chemicalAmount !== "" && (chemicalAmountNum <= 0 || isNaN(chemicalAmountNum))) ||
      (inputs.totalSolutionVolume !== "" && (totalSolutionVolumeNum <= 0 || isNaN(totalSolutionVolumeNum)))
    ) {
      return {
        value: null,
        label: null,
        subtext: null,
        warning: "Please enter positive numeric values for amounts.",
        formulaUsed: null,
      };
    }

    if (dilutionRatioNum === null && inputs.dilutionRatio !== "custom") {
      return {
        value: null,
        label: null,
        subtext: null,
        warning: "Please select or enter a valid dilution ratio &gt; 0.",
        formulaUsed: null,
      };
    }

    // If custom ratio selected, user must input ratio manually
    if (inputs.dilutionRatio === "custom") {
      // We expect user to input ratio in chemicalAmount or totalSolutionVolume
      // But better to ask user to input ratio manually in dilutionRatio input
      // So here we just prompt user to enter ratio
      return {
        value: null,
        label: null,
        subtext: null,
        warning:
          "Please enter a valid dilution ratio (e.g., 15 for 1:15) in the dilution ratio field.",
        formulaUsed: null,
      };
    }

    // Calculation logic:
    // Given chemicalAmount and dilutionRatio, calculate total solution volume needed
    // OR given totalSolutionVolume and dilutionRatio, calculate chemical amount needed
    // If both chemicalAmount and totalSolutionVolume are given, check if they match dilution ratio

    // Units: ml or liters. Convert liters to ml for calculation
    const unitFactor = unit === "liters" ? 1000 : 1;

    // If chemicalAmount and dilutionRatio given, calculate total solution volume:
    if (chemicalAmountNum && dilutionRatioNum && !totalSolutionVolumeNum) {
      const totalVolume = chemicalAmountNum * dilutionRatioNum; // in ml or grams * ratio
      const displayVolume = unit === "liters" ? totalVolume / 1000 : totalVolume;
      return {
        value: `${displayVolume.toFixed(2)} ${unit}`,
        label: `Total solution volume to prepare`,
        subtext: `Using ${chemicalAmountNum} ${unit} chemical at 1:${dilutionRatioNum} dilution`,
        warning: null,
        formulaUsed: "Total Volume = Chemical Amount × Dilution Ratio",
      };
    }

    // If totalSolutionVolume and dilutionRatio given, calculate chemical amount needed:
    if (totalSolutionVolumeNum && dilutionRatioNum && !chemicalAmountNum) {
      const totalVolumeMl = totalSolutionVolumeNum * unitFactor;
      const chemicalAmount = totalVolumeMl / dilutionRatioNum;
      const displayChemicalAmount = unit === "liters" ? chemicalAmount / 1000 : chemicalAmount;
      return {
        value: `${displayChemicalAmount.toFixed(2)} ${unit}`,
        label: `Chemical amount needed`,
        subtext: `To prepare ${totalSolutionVolumeNum} ${unit} at 1:${dilutionRatioNum} dilution`,
        warning: null,
        formulaUsed: "Chemical Amount = Total Volume ÷ Dilution Ratio",
      };
    }

    // If both chemicalAmount and totalSolutionVolume given, check ratio:
    if (chemicalAmountNum && totalSolutionVolumeNum && dilutionRatioNum) {
      const totalVolumeMl = totalSolutionVolumeNum * unitFactor;
      const actualRatio = totalVolumeMl / chemicalAmountNum;
      const diffPercent = Math.abs(actualRatio - dilutionRatioNum) / dilutionRatioNum;

      let warning = null;
      if (diffPercent > 0.1) {
        warning =
          "Warning: The chemical amount and total solution volume do not match the selected dilution ratio.";
      }

      return {
        value: `1:${actualRatio.toFixed(2)}`,
        label: `Actual dilution ratio`,
        subtext: `Based on entered chemical amount and total solution volume`,
        warning,
        formulaUsed: "Actual Ratio = Total Volume ÷ Chemical Amount",
      };
    }

    // If none or insufficient inputs:
    return {
      value: null,
      label: null,
      subtext: null,
      warning: null,
      formulaUsed: null,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is a cleaning dilution ratio?",
      answer:
        "A cleaning dilution ratio indicates how much water to mix with a cleaning chemical. For example, 1:10 means 1 part chemical to 10 parts water.",
    },
    {
      question: "Why is it important to follow the dilution ratio?",
      answer:
        "Using the correct dilution ratio ensures effective cleaning while preventing damage or waste of cleaning chemicals.",
    },
    {
      question: "Can I use liters and milliliters interchangeably?",
      answer:
        "Yes, but be consistent. This calculator allows you to select your preferred unit and converts accordingly.",
    },
    {
      question: "What if I want a custom dilution ratio?",
      answer:
        "Select 'Custom' in the dilution ratio dropdown and enter your desired ratio manually in the dilution ratio input field.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="chemicalAmount" className="flex items-center gap-2 mb-1 font-semibold text-slate-700 dark:text-slate-300">
            <FlaskConical className="w-4 h-4 text-blue-600" /> Chemical Amount
          </Label>
          <Input
            id="chemicalAmount"
            type="text"
            placeholder="e.g. 50"
            value={inputs.chemicalAmount}
            onChange={(e) => handleInputChange("chemicalAmount", e.target.value)}
            aria-describedby="chemicalAmountHelp"
          />
          <p id="chemicalAmountHelp" className="text-xs text-slate-500 mt-1">
            Enter the amount of cleaning chemical (in selected unit).
          </p>
        </div>

        <div>
          <Label htmlFor="dilutionRatio" className="flex items-center gap-2 mb-1 font-semibold text-slate-700 dark:text-slate-300">
            <Droplets className="w-4 h-4 text-blue-600" /> Dilution Ratio (1 : X)
          </Label>
          <Select
            value={inputs.dilutionRatio}
            onValueChange={(val) => {
              if (val === "custom") {
                handleInputChange("dilutionRatio", "custom");
              } else {
                handleInputChange("dilutionRatio", val);
              }
            }}
          >
            <SelectTrigger aria-label="Select dilution ratio" className="w-full">
              <SelectValue placeholder="Select ratio" />
            </SelectTrigger>
            <SelectContent>
              {dilutionOptions.map((opt) => (
                <SelectItem key={opt.label} value={opt.ratio ? String(opt.ratio) : "custom"}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {inputs.dilutionRatio === "custom" && (
            <Input
              type="text"
              placeholder="Enter custom ratio (e.g. 15)"
              value={inputs.customRatio || ""}
              onChange={(e) => {
                const val = e.target.value;
                if (/^\d*\.?\d*$/.test(val) || val === "") {
                  handleInputChange("dilutionRatio", val);
                }
              }}
              className="mt-2"
              aria-label="Custom dilution ratio input"
            />
          )}
          <p className="text-xs text-slate-500 mt-1">
            Select or enter the dilution ratio (parts water per 1 part chemical).
          </p>
        </div>

        <div>
          <Label htmlFor="totalSolutionVolume" className="flex items-center gap-2 mb-1 font-semibold text-slate-700 dark:text-slate-300">
            <Info className="w-4 h-4 text-blue-600" /> Total Solution Volume
          </Label>
          <Input
            id="totalSolutionVolume"
            type="text"
            placeholder="e.g. 500"
            value={inputs.totalSolutionVolume}
            onChange={(e) => handleInputChange("totalSolutionVolume", e.target.value)}
            aria-describedby="totalSolutionVolumeHelp"
          />
          <p id="totalSolutionVolumeHelp" className="text-xs text-slate-500 mt-1">
            Enter the total volume of cleaning solution you want to prepare.
          </p>
        </div>

        <div>
          <Label htmlFor="unit" className="flex items-center gap-2 mb-1 font-semibold text-slate-700 dark:text-slate-300">
            <Scale className="w-4 h-4 text-blue-600" /> Unit
          </Label>
          <Select
            value={inputs.unit}
            onValueChange={(val) => handleInputChange("unit", val)}
          >
            <SelectTrigger aria-label="Select unit" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ml">Milliliters (ml)</SelectItem>
              <SelectItem value="liters">Liters (liters)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-slate-500 mt-1">
            Choose the unit for amounts entered.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No special action needed, calculation is reactive
          }}
          aria-label="Calculate dilution"
        >
          <Home className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              chemicalAmount: "",
              dilutionRatio: "10",
              totalSolutionVolume: "",
              unit: "ml",
            })
          }
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                {results.formulaUsed || "Result"}
              </p>
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
          A cleaning dilution ratio indicates how much water to mix with a
          cleaning chemical to achieve effective and safe cleaning. For example,
          a ratio of 1:10 means 1 part chemical to 10 parts water. Proper
          dilution ensures the cleaning solution is strong enough to clean but
          not so strong that it wastes product or damages surfaces. Always follow
          manufacturer guidelines and safety instructions.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Enter either the amount of cleaning chemical you have or the total
          solution volume you want to prepare. Select the desired dilution ratio
          or enter a custom ratio. Choose your preferred unit (milliliters or
          liters). Click Calculate to see the required amounts or verify your
          mixture. Use the Reset button to clear inputs and start over.
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
      title="Cleaning Dilution Ratio Calculator"
      description="Calculate the perfect cleaning dilution ratio. Mix chemicals and water safely and effectively for household cleaning tasks."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Methodology",
        formula: "Total Volume = Chemical Amount × Dilution Ratio",
        variables: [
          { symbol: "Chemical Amount", description: "Amount of cleaning chemical" },
          { symbol: "Dilution Ratio", description: "Parts water per 1 part chemical" },
          { symbol: "Total Volume", description: "Total cleaning solution volume" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "You have 50 ml of cleaning chemical and want to prepare a solution at 1:10 dilution.",
        steps: [
          {
            label: "1",
            explanation:
              "Enter 50 in Chemical Amount and select 1:10 as Dilution Ratio.",
          },
          {
            label: "2",
            explanation:
              "Leave Total Solution Volume empty to calculate it automatically.",
          },
          {
            label: "3",
            explanation: "Click Calculate to see you need 500 ml total solution.",
          },
        ],
        result: "Use 50 ml chemical mixed with 450 ml water to make 500 ml solution.",
      }}
      relatedCalculators={[
        {
          title: "Event Budget Calculator",
          url: "/everyday-life/event-budget-calculator",
          icon: "🎉",
        },
        {
          title: "Light Bulb Cost per Year Calculator",
          url: "/everyday-life/light-bulb-cost-per-year",
          icon: "🏠",
        },
        {
          title: "Basal Metabolic Rate (BMR) Calculator",
          url: "/everyday-life/bmr-calculator",
          icon: "❤️",
        },
        {
          title: "Laundry Detergent Dosage by Load Size",
          url: "/everyday-life/laundry-detergent-dosage",
          icon: "🏠",
        },
        {
          title: "Mulch Coverage & Bag Count Calculator",
          url: "/everyday-life/mulch-coverage-bag-count",
          icon: "🌿",
        },
        {
          title: "Home Paint Touch-Up Estimator",
          url: "/everyday-life/home-paint-touch-up",
          icon: "🏠",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding the Basics" },
        { id: "how-to", label: "How to Use This Calculator" },
        { id: "faq", label: "Frequently Asked Questions" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}