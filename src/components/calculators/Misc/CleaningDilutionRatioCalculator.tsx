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
// ⚠️ SAFE ICONS ONLY
import {
  Home,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CleaningDilutionRatioCalculator() {
  // Inputs:
  // - Concentrate volume (ml)
  // - Concentrate dilution ratio (e.g. 1:10 means 1 part concentrate + 10 parts water)
  // - Desired total volume (ml) (optional, if user wants to know how much concentrate to use for a given total volume)
  // We will calculate:
  // - Amount of water needed (ml)
  // - Final dilution ratio (parts concentrate : parts water)
  // - Warning if inputs are invalid or inconsistent

  const [inputs, setInputs] = useState({
    concentrateVolume: "", // ml
    dilutionRatioPart: "10", // default 1:10 (parts water)
    desiredTotalVolume: "", // ml (optional)
  });

  const handleInputChange = useCallback((name: string, value: string) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  const results = useMemo(() => {
    const concentrateVolumeNum = Number(inputs.concentrateVolume);
    const dilutionRatioPartNum = Number(inputs.dilutionRatioPart);
    const desiredTotalVolumeNum = Number(inputs.desiredTotalVolume);

    // Validate inputs
    if (
      isNaN(concentrateVolumeNum) ||
      concentrateVolumeNum <= 0 ||
      isNaN(dilutionRatioPartNum) ||
      dilutionRatioPartNum <= 0
    ) {
      return {
        value: null,
        label: "",
        subtext: "",
        warning:
          "Please enter valid positive numbers for concentrate volume and dilution ratio.",
        formulaUsed: "",
      };
    }

    // Calculate water volume needed for given concentrate volume and dilution ratio
    // Dilution ratio 1:X means 1 part concentrate + X parts water
    // Water volume = concentrateVolume * dilutionRatioPartNum
    const waterVolume = concentrateVolumeNum * dilutionRatioPartNum;

    // Calculate total volume = concentrate + water
    const totalVolume = concentrateVolumeNum + waterVolume;

    // If desired total volume is provided, calculate required concentrate volume and water volume
    if (
      !isNaN(desiredTotalVolumeNum) &&
      desiredTotalVolumeNum > 0
    ) {
      if (desiredTotalVolumeNum <= concentrateVolumeNum) {
        return {
          value: null,
          label: "",
          subtext: "",
          warning:
            "Desired total volume must be greater than concentrate volume.",
          formulaUsed: "",
        };
      }
      // Calculate concentrate volume needed to achieve desired total volume at given dilution ratio
      // totalVolume = concentrateVolume + (concentrateVolume * dilutionRatioPartNum)
      // => concentrateVolume = totalVolume / (1 + dilutionRatioPartNum)
      const requiredConcentrateVolume =
        desiredTotalVolumeNum / (1 + dilutionRatioPartNum);
      const requiredWaterVolume =
        desiredTotalVolumeNum - requiredConcentrateVolume;

      return {
        value: (
          <>
            <div>
              <strong>{requiredConcentrateVolume.toFixed(2)} ml</strong> concentrate
            </div>
            <div>
              <strong>{requiredWaterVolume.toFixed(2)} ml</strong> water
            </div>
            <div>
              <strong>{desiredTotalVolumeNum.toFixed(2)} ml</strong> total solution
            </div>
          </>
        ),
        label: "Volumes to mix for desired total solution",
        subtext: `Dilution ratio used: 1 : ${dilutionRatioPartNum.toFixed(2)}`,
        warning: null,
        formulaUsed:
          "Concentrate Volume = Total Volume / (1 + Dilution Ratio Part)",
      };
    }

    // Otherwise, just show water volume needed for given concentrate volume and dilution ratio
    return {
      value: (
        <>
          <div>
            <strong>{waterVolume.toFixed(2)} ml</strong> water
          </div>
          <div>
            <strong>{totalVolume.toFixed(2)} ml</strong> total solution
          </div>
          <div>
            Dilution ratio: <strong>1 : {dilutionRatioPartNum.toFixed(2)}</strong>
          </div>
        </>
      ),
      label: "Water volume and total solution volume",
      subtext: "Mix concentrate with water as per dilution ratio",
      warning: null,
      formulaUsed: "Water Volume = Concentrate Volume × Dilution Ratio Part",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is a cleaning dilution ratio?",
      answer:
        "A cleaning dilution ratio indicates how much water should be mixed with a cleaning concentrate. For example, a 1:10 ratio means 1 part concentrate to 10 parts water. This ensures safe and effective cleaning without wasting product or causing damage.",
    },
    {
      question: "Why is it important to follow the dilution ratio?",
      answer:
        "Following the recommended dilution ratio ensures the cleaning solution is effective and safe. Too concentrated solutions can damage surfaces or be hazardous, while too diluted solutions may not clean properly. This calculator helps you mix the right proportions every time.",
    },
    {
      question: "Can I calculate how much concentrate I need for a specific total volume?",
      answer:
        "Yes, by entering your desired total solution volume along with the dilution ratio, the calculator will tell you exactly how much concentrate and water to mix to achieve that volume.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="concentrateVolume" className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-blue-600" />
            Concentrate Volume (ml)
          </Label>
          <Input
            id="concentrateVolume"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 100"
            value={inputs.concentrateVolume}
            onChange={(e) => handleInputChange("concentrateVolume", e.target.value)}
            aria-describedby="concentrateVolumeHelp"
          />
          <p id="concentrateVolumeHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter the volume of cleaning concentrate you have.
          </p>
        </div>

        <div>
          <Label htmlFor="dilutionRatioPart" className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-green-600" />
            Dilution Ratio (1 : X)
          </Label>
          <Input
            id="dilutionRatioPart"
            type="number"
            min="0.1"
            step="any"
            placeholder="e.g. 10"
            value={inputs.dilutionRatioPart}
            onChange={(e) => handleInputChange("dilutionRatioPart", e.target.value)}
            aria-describedby="dilutionRatioHelp"
          />
          <p id="dilutionRatioHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter the parts of water per 1 part concentrate (e.g., 10 means 1:10).
          </p>
        </div>

        <div>
          <Label htmlFor="desiredTotalVolume" className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-purple-600" />
            Desired Total Solution Volume (ml) (optional)
          </Label>
          <Input
            id="desiredTotalVolume"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 1100"
            value={inputs.desiredTotalVolume}
            onChange={(e) => handleInputChange("desiredTotalVolume", e.target.value)}
            aria-describedby="desiredTotalVolumeHelp"
          />
          <p id="desiredTotalVolumeHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter total solution volume you want to prepare (optional).
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {
            // Just trigger recalculation by setting inputs to current values (no-op)
            setInputs((prev) => ({ ...prev }));
          }}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          aria-label="Calculate dilution"
        >
          <Home className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              concentrateVolume: "",
              dilutionRatioPart: "10",
              desiredTotalVolume: "",
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
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" aria-live="polite">
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
          Cleaning dilution ratios are essential guidelines that specify how much
          water should be mixed with a concentrated cleaning product to achieve
          optimal cleaning performance. These ratios are usually expressed as 1:X,
          where 1 part is the concentrate and X parts are water. Proper dilution
          ensures the cleaning solution is effective, safe for surfaces, and
          economical by preventing waste. Using too much concentrate can damage
          surfaces or pose health risks, while too little may not clean effectively.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator helps you determine the exact volumes of concentrate and
          water needed based on your available concentrate volume or desired total
          solution volume. It supports practical household and professional cleaning
          tasks, making mixing safe and straightforward.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Always follow manufacturer instructions and safety guidelines when handling
          cleaning chemicals. Proper dilution not only protects your health and
          surfaces but also maximizes the value of your cleaning products.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Start by entering the volume of cleaning concentrate you have in milliliters.
          Next, input the dilution ratio part, which is the amount of water to mix
          per 1 part concentrate (for example, 10 for a 1:10 ratio). Optionally, you
          can enter the total volume of cleaning solution you want to prepare.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Click the Calculate button to see the required volumes of water and total
          solution volume. If you provided a desired total volume, the calculator
          will tell you how much concentrate and water to mix to achieve that volume
          at the specified dilution ratio.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Use the Reset button to clear all inputs and start fresh. Always double-check
          your measurements and follow safety instructions on your cleaning product.
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
        title: "Methodology / Formula",
        formula: "Water Volume = Concentrate Volume × Dilution Ratio Part",
        variables: [
          { symbol: "Concentrate Volume", description: "Volume of cleaning concentrate (ml)" },
          { symbol: "Dilution Ratio Part", description: "Parts of water per 1 part concentrate" },
          { symbol: "Water Volume", description: "Volume of water to add (ml)" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "You have 100 ml of cleaning concentrate and want to dilute it at a 1:10 ratio.",
        steps: [
          {
            label: "1",
            explanation:
              "Enter 100 ml as the concentrate volume and 10 as the dilution ratio part.",
          },
          {
            label: "2",
            explanation:
              "Click Calculate to find out you need 1000 ml of water to mix with your concentrate.",
          },
          {
            label: "3",
            explanation:
              "The total solution volume will be 1100 ml, ready for safe and effective cleaning.",
          },
        ],
        result:
          "Mix 100 ml concentrate with 1000 ml water to prepare 1100 ml of cleaning solution at 1:10 dilution.",
      }}
      relatedCalculators={[
        {
          title: "Appliance Energy Consumption Calculator",
          url: "/everyday/appliance-energy-consumption",
          icon: "Home",
        },
        {
          title: "Wine/Beer/Soft Drink Mix Estimator",
          url: "/everyday/beverage-mix-estimator",
          icon: "Utensils",
        },
        {
          title: "Caffeine Max per Day Calculator",
          url: "/everyday/caffeine-max-per-day",
          icon: "Activity",
        },
        {
          title: "Grass Seed Quantity Calculator",
          url: "/everyday/grass-seed-quantity",
          icon: "Leaf",
        },
        {
          title: "Garden Soil/Compost Volume Calculator",
          url: "/everyday/garden-soil-compost-volume",
          icon: "Leaf",
        },
        {
          title: "Screen Time Budget / Pomodoro Planner",
          url: "/everyday/screen-time-pomodoro-planner",
          icon: "Activity",
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