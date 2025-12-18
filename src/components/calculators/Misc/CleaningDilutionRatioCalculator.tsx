import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ IMPORT ALL ICONS TO BE SAFE
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

export default function CleaningDilutionRatioCalculator() {
  /*
  Inputs:
    - Chemical amount (ml or oz)
    - Water amount (ml or oz)
  Output:
    - Dilution ratio (e.g. 1:10 means 1 part chemical to 10 parts water)
  */

  // Store inputs as strings to allow empty input and validation
  const [inputs, setInputs] = useState({
    chemicalAmount: "",
    chemicalUnit: "ml",
    waterAmount: "",
    waterUnit: "ml",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Conversion factors to ml
  const unitToMl = useMemo(
    () => ({
      ml: 1,
      oz: 29.5735,
    }),
    []
  );

  const results = useMemo(() => {
    const chemRaw = inputs.chemicalAmount.trim();
    const waterRaw = inputs.waterAmount.trim();
    const chemUnit = inputs.chemicalUnit;
    const waterUnit = inputs.waterUnit;

    // Validate inputs: must be positive numbers
    const chemNum = Number(chemRaw);
    const waterNum = Number(waterRaw);

    if (
      !chemRaw ||
      !waterRaw ||
      Number.isNaN(chemNum) ||
      Number.isNaN(waterNum) ||
      chemNum <= 0 ||
      waterNum <= 0
    ) {
      return {
        value: "",
        label: "",
        subtext: null,
        warning: "Please enter valid positive numbers for chemical and water amounts.",
        formulaUsed: "",
      };
    }

    // Convert both to ml for ratio calculation
    const chemMl = chemNum * (unitToMl[chemUnit] ?? 1);
    const waterMl = waterNum * (unitToMl[waterUnit] ?? 1);

    if (waterMl <= chemMl) {
      return {
        value: "",
        label: "",
        subtext: null,
        warning: "Water amount should be greater than chemical amount for dilution.",
        formulaUsed: "",
      };
    }

    // Calculate ratio: 1 : X where X = water / chemical
    const ratio = waterMl / chemMl;

    // Format ratio to 2 decimals max, but show integer if close
    const ratioFormatted =
      Math.abs(ratio - Math.round(ratio)) &lt; 0.01
        ? Math.round(ratio)
        : ratio.toFixed(2);

    return {
      value: `1 : ${ratioFormatted}`,
      label: "Dilution Ratio",
      subtext: `Mix 1 part chemical with ${ratioFormatted} parts water.`,
      warning: null,
      formulaUsed: "Dilution Ratio = Water Amount ÷ Chemical Amount",
    };
  }, [inputs, unitToMl]);

  const faqs = [
    {
      question: "What is a cleaning dilution ratio?",
      answer:
        "A cleaning dilution ratio indicates how much water to mix with a chemical cleaner to achieve a safe and effective solution.",
    },
    {
      question: "Why is it important to follow the dilution ratio?",
      answer:
        "Using the correct dilution ratio ensures cleaning effectiveness while preventing damage to surfaces and reducing chemical exposure risks.",
    },
    {
      question: "Can I use different units for chemical and water?",
      answer:
        "Yes, you can input chemical and water amounts in milliliters or ounces. The calculator will convert units automatically.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Chemical Amount */}
        <div>
          <Label htmlFor="chemicalAmount" className="mb-1 block font-semibold">
            Chemical Amount
          </Label>
          <div className="flex gap-2">
            <Input
              id="chemicalAmount"
              type="number"
              min="0"
              step="any"
              placeholder="e.g. 50"
              value={inputs.chemicalAmount}
              onChange={(e) => handleInputChange("chemicalAmount", e.target.value)}
              aria-describedby="chemicalAmountHelp"
            />
            <Select
              value={inputs.chemicalUnit}
              onValueChange={(v) => handleInputChange("chemicalUnit", v)}
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ml">ml</SelectItem>
                <SelectItem value="oz">oz</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p id="chemicalAmountHelp" className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Amount of cleaning chemical to use
          </p>
        </div>

        {/* Water Amount */}
        <div>
          <Label htmlFor="waterAmount" className="mb-1 block font-semibold">
            Water Amount
          </Label>
          <div className="flex gap-2">
            <Input
              id="waterAmount"
              type="number"
              min="0"
              step="any"
              placeholder="e.g. 500"
              value={inputs.waterAmount}
              onChange={(e) => handleInputChange("waterAmount", e.target.value)}
              aria-describedby="waterAmountHelp"
            />
            <Select
              value={inputs.waterUnit}
              onValueChange={(v) => handleInputChange("waterUnit", v)}
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ml">ml</SelectItem>
                <SelectItem value="oz">oz</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p id="waterAmountHelp" className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Amount of water to mix with chemical
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No special action needed, calculation is automatic
          }}
          type="button"
          aria-label="Calculate dilution ratio"
        >
          <Home className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              chemicalAmount: "",
              chemicalUnit: "ml",
              waterAmount: "",
              waterUnit: "ml",
            })
          }
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          type="button"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.warning && (
        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900 dark:to-red-950 border-red-200 shadow-lg">
          <CardContent className="p-6 text-center text-red-800 dark:text-red-300 font-semibold">
            <AlertTriangle className="mx-auto mb-2 h-6 w-6" />
            {results.warning}
          </CardContent>
        </Card>
      )}

      {results.value && !results.warning && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            {results.subtext && (
              <p className="mt-2 text-lg font-medium text-blue-800 dark:text-blue-300">{results.subtext}</p>
            )}
            {results.formulaUsed && (
              <p className="mt-4 text-sm italic text-blue-700 dark:text-blue-400">{results.formulaUsed}</p>
            )}
          </CardContent>
        </Card>
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
          The cleaning dilution ratio is a simple way to express how much water should be mixed with a cleaning chemical to achieve an effective and safe cleaning solution. For example, a ratio of 1:10 means 1 part chemical to 10 parts water.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Using the correct dilution ratio ensures that the cleaning solution is strong enough to clean effectively without wasting chemicals or causing damage to surfaces or health risks.
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
        formula: "Dilution Ratio = Water Amount ÷ Chemical Amount",
        variables: [
          { symbol: "Water Amount", description: "Volume of water used in the mixture" },
          { symbol: "Chemical Amount", description: "Volume of cleaning chemical used" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "You want to mix 50 ml of cleaning chemical with water to prepare a cleaning solution.",
        steps: [
          "Enter 50 ml as the chemical amount.",
          "Enter 500 ml as the water amount.",
          "The calculator will compute the dilution ratio as 1 : 10.",
        ],
        result: "This means you mix 1 part chemical with 10 parts water.",
      }}
      relatedCalculators={[
        { title: "Ice Quantity for Beverages Calculator", url: "/everyday-life/ice-quantity-beverages", icon: "💡" },
        { title: "Propane Tank Burn Time Estimator", url: "/everyday-life/propane-tank-burn-time", icon: "💡" },
        { title: "Appliance Energy Consumption Calculator", url: "/everyday-life/appliance-energy-consumption", icon: "💡" },
        { title: "Plant Spacing Calculator", url: "/everyday-life/plant-spacing-calculator", icon: "🌿" },
        { title: "Room Air Changes per Hour (ACH) Calculator", url: "/everyday-life/room-air-changes-ach", icon: "💡" },
        { title: "Body Mass Index (BMI) Calculator", url: "/everyday-life/bmi-calculator", icon: "❤️" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding" },
        { id: "faq", label: "FAQ" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}