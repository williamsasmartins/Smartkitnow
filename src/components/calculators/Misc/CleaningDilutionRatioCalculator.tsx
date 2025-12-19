import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ FULL ICON IMPORT (+ BookOpen for references)
import { Home, Heart, Utensils, Leaf, Calendar, DollarSign, Droplets, Activity, Moon, Sun, Users, Paintbrush, Wrench, Info, RotateCcw, AlertTriangle, FlaskConical, Scale, Waves, Zap, BookOpen } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CleaningDilutionRatioCalculator() {
  const [inputs, setInputs] = useState({
    concentrateAmount: "",
    concentrateUnit: "ml",
    waterAmount: "",
    waterUnit: "ml",
    desiredDilutionRatio: "",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Helper: convert input amounts to milliliters for consistent calculation
  const unitToMl = {
    ml: 1,
    l: 1000,
    oz: 29.5735,
    gal: 3785.41,
  };

  // Calculate dilution ratio or required water amount based on inputs
  const results = useMemo(() => {
    const cAmt = parseFloat(inputs.concentrateAmount);
    const wAmt = parseFloat(inputs.waterAmount);
    const ratio = parseFloat(inputs.desiredDilutionRatio);

    // Validate inputs
    if (
      (isNaN(cAmt) || cAmt <= 0) &&
      (isNaN(wAmt) || wAmt <= 0) &&
      (isNaN(ratio) || ratio <= 0)
    ) {
      return {
        value: "",
        label: "",
        subtext: "",
        warning: null,
        formulaUsed: "",
      };
    }

    // Convert concentrate and water amounts to ml
    const cMl = !isNaN(cAmt) && cAmt > 0 ? cAmt * unitToMl[inputs.concentrateUnit] : null;
    const wMl = !isNaN(wAmt) && wAmt > 0 ? wAmt * unitToMl[inputs.waterUnit] : null;

    // Logic:
    // If concentrate and water amounts provided, calculate dilution ratio
    if (cMl !== null && wMl !== null) {
      const dilutionRatio = (wMl / cMl).toFixed(2);
      return {
        value: `1:${dilutionRatio}`,
        label: "Calculated Dilution Ratio",
        subtext: `Based on ${cAmt} ${inputs.concentrateUnit} concentrate mixed with ${wAmt} ${inputs.waterUnit} water.`,
        warning: null,
        formulaUsed: "Dilution Ratio = Volume of Water ÷ Volume of Concentrate",
      };
    }

    // If concentrate amount and desired dilution ratio provided, calculate required water amount
    if (cMl !== null && !isNaN(ratio) && ratio > 0) {
      const requiredWaterMl = (cMl * ratio).toFixed(2);
      return {
        value: `${requiredWaterMl} ml`,
        label: "Required Water Volume",
        subtext: `To achieve a 1:${ratio} dilution ratio with ${cAmt} ${inputs.concentrateUnit} concentrate.`,
        warning: null,
        formulaUsed: "Water Volume = Concentrate Volume × Dilution Ratio",
      };
    }

    // If water amount and desired dilution ratio provided, calculate required concentrate amount
    if (wMl !== null && !isNaN(ratio) && ratio > 0) {
      const requiredConcentrateMl = (wMl / ratio).toFixed(2);
      return {
        value: `${requiredConcentrateMl} ml`,
        label: "Required Concentrate Volume",
        subtext: `To achieve a 1:${ratio} dilution ratio with ${wAmt} ${inputs.waterUnit} water.`,
        warning: null,
        formulaUsed: "Concentrate Volume = Water Volume ÷ Dilution Ratio",
      };
    }

    return {
      value: "",
      label: "",
      subtext: "Please provide at least two inputs to calculate the third.",
      warning: null,
      formulaUsed: "",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is a cleaning dilution ratio and why is it important?",
      answer:
        "A cleaning dilution ratio represents the proportion of concentrate cleaner to water used in a cleaning solution. It is crucial because the correct ratio ensures effective cleaning while maintaining safety and cost efficiency. Over-concentrated solutions can be hazardous and wasteful, while under-concentrated ones may not clean effectively.",
    },
    {
      question: "How do I know which units to use for measurements?",
      answer:
        "Common units for measuring cleaning solutions include milliliters (ml), liters (l), ounces (oz), and gallons (gal). Choose units that you are comfortable with or that match your cleaning product's packaging. This calculator converts all units internally to milliliters for accurate computation.",
    },
    {
      question: "Can I use this calculator for any type of cleaning chemical?",
      answer:
        "Yes, this calculator is designed to work with any liquid cleaning concentrate and water. However, always follow the manufacturer's recommended dilution ratios and safety guidelines for specific chemicals, as some may require special handling or dilution methods.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="concentrateAmount" className="mb-1">
                Concentrate Amount
              </Label>
              <div className="flex gap-2">
                <Input
                  id="concentrateAmount"
                  type="number"
                  min="0"
                  step="any"
                  placeholder="e.g. 50"
                  value={inputs.concentrateAmount}
                  onChange={(e) => handleInputChange("concentrateAmount", e.target.value)}
                />
                <Select
                  value={inputs.concentrateUnit}
                  onValueChange={(v) => handleInputChange("concentrateUnit", v)}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ml">ml</SelectItem>
                    <SelectItem value="l">l</SelectItem>
                    <SelectItem value="oz">oz</SelectItem>
                    <SelectItem value="gal">gal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="waterAmount" className="mb-1">
                Water Amount
              </Label>
              <div className="flex gap-2">
                <Input
                  id="waterAmount"
                  type="number"
                  min="0"
                  step="any"
                  placeholder="e.g. 950"
                  value={inputs.waterAmount}
                  onChange={(e) => handleInputChange("waterAmount", e.target.value)}
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
                    <SelectItem value="l">l</SelectItem>
                    <SelectItem value="oz">oz</SelectItem>
                    <SelectItem value="gal">gal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="desiredDilutionRatio" className="mb-1">
                Desired Dilution Ratio (1:x)
              </Label>
              <Input
                id="desiredDilutionRatio"
                type="number"
                min="0"
                step="any"
                placeholder="e.g. 19"
                value={inputs.desiredDilutionRatio}
                onChange={(e) => handleInputChange("desiredDilutionRatio", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No special action needed, calculation is reactive
          }}
        >
          <Home className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              concentrateAmount: "",
              concentrateUnit: "ml",
              waterAmount: "",
              waterUnit: "ml",
              desiredDilutionRatio: "",
            })
          }
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="mt-2 text-lg font-semibold text-blue-800 dark:text-blue-300">{results.label}</p>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">{results.subtext}</p>
            {results.warning && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center justify-center gap-1">
                <AlertTriangle className="w-4 h-4" /> {results.warning}
              </p>
            )}
            {results.formulaUsed && (
              <p className="mt-4 text-xs italic text-slate-600 dark:text-slate-400">
                <BookOpen className="inline-block w-4 h-4 mr-1" />
                <span>{results.formulaUsed}</span>
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Cleaning Dilution Ratio Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Cleaning dilution ratios are essential for preparing effective and safe cleaning solutions by mixing a concentrated cleaner with water. This ratio indicates how many parts of water are mixed with one part of concentrate, ensuring the solution is neither too strong nor too weak. Using the correct dilution ratio not only maximizes cleaning efficiency but also minimizes chemical waste and potential hazards to users and surfaces. This calculator helps you determine the precise amounts of concentrate and water needed for your cleaning tasks, accommodating various units of measurement for convenience.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this calculator effectively, input any two of the following: the amount of concentrate, the amount of water, or the desired dilution ratio. The calculator will then compute the missing value for you. You can specify the units for both concentrate and water, including milliliters, liters, ounces, or gallons, and the calculator will handle the conversions automatically. This flexibility allows you to work with the measurements most convenient for your cleaning products and containers.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter the amount of cleaning concentrate you have or plan to use, selecting the appropriate unit.
          </li>
          <li>
            <strong>Step 2:</strong> Enter either the amount of water you want to mix or the desired dilution ratio (e.g., 1:19 means one part concentrate to 19 parts water).
          </li>
          <li>
            <strong>Step 3:</strong> Click "Calculate" to see the missing value, whether it is the required water volume, concentrate volume, or the dilution ratio based on your inputs.
          </li>
          <li>
            <strong>Step 4:</strong> Adjust inputs as needed to achieve the perfect cleaning solution for your task.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Professional Tips & Safety</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Always follow the manufacturer's instructions and safety guidelines when handling cleaning concentrates. Use protective gloves and eyewear if recommended, and ensure proper ventilation in the cleaning area. Avoid mixing different chemical concentrates unless explicitly stated safe, as this can cause dangerous reactions. When measuring, use accurate tools such as graduated cylinders or measuring cups to ensure precise dilution. Store concentrates and prepared solutions safely out of reach of children and pets. Remember, the correct dilution ratio not only ensures cleaning effectiveness but also protects surfaces and prolongs the life of your cleaning tools.
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

      {/* NEW REFERENCES SECTION */}
      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References & Additional Resources</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          For more information on cleaning dilution ratios, chemical safety, and best practices, consult the following reputable sources:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>Centers for Disease Control and Prevention (CDC) – Guidelines on cleaning and disinfecting</li>
          <li>U.S. Environmental Protection Agency (EPA) – Chemical safety and dilution instructions</li>
          <li>University Agricultural Extensions – Best practices for chemical mixing and application</li>
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
        formula: "Dilution Ratio = Volume of Water ÷ Volume of Concentrate",
        variables: [
          { symbol: "Dilution Ratio", description: "Ratio of water volume to concentrate volume" },
          { symbol: "Volume of Water", description: "Amount of water used in the solution" },
          { symbol: "Volume of Concentrate", description: "Amount of cleaning concentrate used" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "You have 50 ml of a cleaning concentrate and want to prepare a solution with a 1:19 dilution ratio. How much water do you need to add?",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Identify the concentrate volume (50 ml) and the desired dilution ratio (1:19).",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate the required water volume by multiplying the concentrate volume by the dilution ratio: 50 ml × 19 = 950 ml.",
          },
          {
            label: "Step 3",
            explanation:
              "Mix 50 ml of concentrate with 950 ml of water to achieve the desired cleaning solution.",
          },
        ],
        result: "You need to add 950 ml of water to 50 ml of concentrate to get a 1:19 dilution ratio.",
      }}
      relatedCalculators={[
        { title: "Sleep Debt & Ideal Bedtime Planner", url: "/everyday-life/sleep-debt-ideal-bedtime", icon: "💡" },
        { title: "Life Expectancy Calculator", url: "/everyday-life/life-expectancy", icon: "💡" },
        { title: "Coffee Urn Yield & Strength Calculator", url: "/everyday-life/coffee-urn-yield-strength", icon: "💡" },
        { title: "Hydration Reminder Interval Planner", url: "/everyday-life/hydration-reminder-interval", icon: "💡" },
        { title: "Square Footage Calculator", url: "/everyday-life/square-footage-calculator", icon: "💡" },
        { title: "Planting Calendar & Frost Date Finder", url: "/everyday-life/planting-calendar-frost-date", icon: "🌿" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding" },
        { id: "how-to", label: "How to Use" },
        { id: "tips", label: "Pro Tips" },
        { id: "faq", label: "FAQ" },
        { id: "references", label: "References" }, // <--- ADDED TO MENU
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}