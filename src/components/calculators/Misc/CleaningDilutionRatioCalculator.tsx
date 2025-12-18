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
// ⚠️ SAFE ICONS ONLY - Check the list above
import {
  Home,
  Droplets,
  RotateCcw,
  AlertTriangle,
  Info,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CleaningDilutionRatioCalculator() {
  // Inputs:
  // - Concentrate Amount (ml or oz)
  // - Concentrate Unit (ml or oz)
  // - Water Amount (ml or oz)
  // - Water Unit (ml or oz)
  // OR alternatively, user can input concentrate volume and desired dilution ratio (e.g., 1:10)
  // For simplicity, let's do:
  // Inputs:
  // 1) Concentrate volume (number + unit)
  // 2) Water volume (number + unit)
  // Output:
  // - Dilution ratio (e.g., 1:10)
  // - Total solution volume
  // - Practical advice (e.g., "Add 1 part concentrate to 10 parts water")

  // Units supported: milliliters (ml), ounces (oz)
  // Conversion: 1 oz = 29.5735 ml

  const [inputs, setInputs] = useState({
    concentrateVolume: "",
    concentrateUnit: "ml",
    waterVolume: "",
    waterUnit: "ml",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Helper: convert input volume to ml for calculation
  const convertToMl = (value, unit) => {
    const valNum = Number(value);
    if (isNaN(valNum) || valNum < 0) return null;
    if (unit === "ml") return valNum;
    if (unit === "oz") return valNum * 29.5735;
    return null;
  };

  const results = useMemo(() => {
    const concentrateMl = convertToMl(
      inputs.concentrateVolume,
      inputs.concentrateUnit
    );
    const waterMl = convertToMl(inputs.waterVolume, inputs.waterUnit);

    // Validation
    if (
      concentrateMl === null ||
      waterMl === null ||
      concentrateMl === 0 ||
      waterMl === 0
    ) {
      return {
        value: "Waiting...",
        label: "Enter valid volumes",
        subtext: "",
        warning: null,
        formulaUsed: null,
      };
    }

    // Prevent negative or zero values
    if (concentrateMl < 0 || waterMl < 0) {
      return {
        value: "Invalid input",
        label: "Volumes must be zero or positive",
        subtext: "",
        warning: "Negative volumes are not possible.",
        formulaUsed: null,
      };
    }

    // Calculate dilution ratio: ratio = water volume / concentrate volume
    // Express as 1 : X (rounded to 1 decimal)
    const ratio = waterMl / concentrateMl;

    // Total solution volume
    const totalVolumeMl = concentrateMl + waterMl;

    // Format ratio string
    const ratioStr =
      ratio >= 1
        ? `1 : ${ratio.toFixed(1)}`
        : `1 : ${ratio.toFixed(2)}`; // if ratio < 1, show 2 decimals for clarity

    // Format total volume in user preferred unit (default ml)
    // Let's show total volume in ml and oz both for clarity
    const totalVolumeOz = totalVolumeMl / 29.5735;

    // Practical advice
    const advice = `Mix 1 part concentrate with ${ratio.toFixed(
      1
    )} parts water to get ${totalVolumeMl.toFixed(0)} ml (${totalVolumeOz.toFixed(
      2
    )} oz) of cleaning solution.`;

    return {
      value: ratioStr,
      label: "Dilution Ratio (Concentrate : Water)",
      subtext: advice,
      warning: null,
      formulaUsed: "Dilution Ratio = Water Volume ÷ Concentrate Volume",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "Why is the cleaning dilution ratio important?",
      answer:
        "The cleaning dilution ratio ensures that cleaning solutions are mixed safely and effectively. Using the correct ratio prevents damage to surfaces, ensures proper disinfection, and avoids wasting cleaning chemicals. It also helps protect your health by reducing exposure to overly concentrated chemicals.",
    },
    {
      question: "Can I use different units for concentrate and water?",
      answer:
        "Yes, this calculator supports milliliters (ml) and ounces (oz) for both concentrate and water. It automatically converts units to calculate the correct dilution ratio, so you can mix solutions accurately regardless of the units you use.",
    },
    {
      question: "What if I want a specific dilution ratio instead of entering volumes?",
      answer:
        "This calculator focuses on calculating the dilution ratio based on volumes you input. For specific dilution ratios, you can adjust the volumes accordingly. For example, for a 1:10 ratio, use 1 part concentrate and 10 parts water by volume.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="concentrateVolume" className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-blue-600" />
            Concentrate Volume
          </Label>
          <div className="flex gap-2 mt-1">
            <Input
              id="concentrateVolume"
              type="number"
              min={0}
              step="any"
              placeholder="e.g. 50"
              value={inputs.concentrateVolume}
              onChange={(e) =>
                handleInputChange("concentrateVolume", e.target.value)
              }
              aria-describedby="concentrateVolumeHelp"
            />
            <Select
              value={inputs.concentrateUnit}
              onValueChange={(value) => handleInputChange("concentrateUnit", value)}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ml">ml</SelectItem>
                <SelectItem value="oz">oz</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p
            id="concentrateVolumeHelp"
            className="text-xs text-slate-500 mt-1"
          >
            Enter the volume of cleaning concentrate.
          </p>
        </div>

        <div>
          <Label htmlFor="waterVolume" className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-blue-600" />
            Water Volume
          </Label>
          <div className="flex gap-2 mt-1">
            <Input
              id="waterVolume"
              type="number"
              min={0}
              step="any"
              placeholder="e.g. 500"
              value={inputs.waterVolume}
              onChange={(e) => handleInputChange("waterVolume", e.target.value)}
              aria-describedby="waterVolumeHelp"
            />
            <Select
              value={inputs.waterUnit}
              onValueChange={(value) => handleInputChange("waterUnit", value)}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ml">ml</SelectItem>
                <SelectItem value="oz">oz</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p id="waterVolumeHelp" className="text-xs text-slate-500 mt-1">
            Enter the volume of water to dilute the concentrate.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just trigger recalculation by setting state to current inputs
            setInputs((prev) => ({ ...prev }));
          }}
          aria-label="Calculate dilution ratio"
        >
          <Droplets className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              concentrateVolume: "",
              concentrateUnit: "ml",
              waterVolume: "",
              waterUnit: "ml",
            })
          }
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== "Waiting..." && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" role="region" aria-live="polite">
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
          Understanding Cleaning Dilution Ratio Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The cleaning dilution ratio calculator is a practical tool designed to
          help you mix cleaning solutions safely and effectively. Proper dilution
          ensures that cleaning agents work efficiently without causing damage to
          surfaces or posing health risks. By calculating the exact ratio of
          concentrate to water, you avoid wasting chemicals and achieve optimal
          cleaning performance. Whether you are cleaning your home, office, or
          garden tools, knowing the right dilution ratio is essential for safety
          and effectiveness.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator supports common volume units like milliliters and ounces,
          converting them seamlessly to provide accurate ratios. It is especially
          useful for household cleaning tasks where manufacturers specify dilution
          ratios on product labels. Using this tool helps you follow those
          instructions precisely, ensuring the best results every time.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use & Formula
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use the calculator, enter the volume of the cleaning concentrate and
          the volume of water you plan to mix. Select the appropriate units (ml or
          oz) for each input. Once you click calculate, the tool computes the
          dilution ratio by dividing the water volume by the concentrate volume.
          This ratio is expressed as 1 part concentrate to X parts water.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The formula used is:
        </p>
        <p className="text-slate-700 dark:text-slate-300 font-mono bg-slate-100 dark:bg-slate-800 p-3 rounded mb-4">
          Dilution Ratio = Water Volume ÷ Concentrate Volume
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The calculator also provides the total volume of the cleaning solution,
          helping you prepare the exact amount needed for your cleaning task.
          Always follow manufacturer guidelines and safety instructions when
          handling cleaning chemicals.
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
        formula: "Dilution Ratio = Water Volume ÷ Concentrate Volume",
        variables: [
          {
            symbol: "Water Volume",
            description: "Volume of water used for dilution (ml or oz)",
          },
          {
            symbol: "Concentrate Volume",
            description: "Volume of cleaning concentrate (ml or oz)",
          },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "You have 50 ml of cleaning concentrate and want to dilute it with 500 ml of water.",
        steps: [
          {
            label: "1",
            explanation:
              "Enter 50 ml as the concentrate volume and 500 ml as the water volume.",
          },
          {
            label: "2",
            explanation:
              "Click Calculate to find the dilution ratio and total solution volume.",
          },
          {
            label: "3",
            explanation:
              "The calculator shows a dilution ratio of 1 : 10 and total volume of 550 ml.",
          },
        ],
        result:
          "Mix 1 part concentrate with 10 parts water to get 550 ml of cleaning solution.",
      }}
      relatedCalculators={[
        {
          title: "Room Air Changes per Hour (ACH) Calculator",
          url: "/everyday/room-air-changes-ach",
          icon: "Activity",
        },
        {
          title: "Light Bulb Cost per Year Calculator",
          url: "/everyday/light-bulb-cost-per-year",
          icon: "Home",
        },
        {
          title: "Caffeine Max per Day Calculator",
          url: "/everyday/caffeine-max-per-day",
          icon: "Heart",
        },
        {
          title: "Home Paint Touch-Up Estimator",
          url: "/everyday/home-paint-touch-up",
          icon: "Paintbrush",
        },
        {
          title: "Basal Metabolic Rate (BMR) Calculator",
          url: "/everyday/bmr-calculator",
          icon: "Heart",
        },
        {
          title: "Laundry Detergent Dosage by Load Size",
          url: "/everyday/laundry-detergent-dosage",
          icon: "Wrench",
        },
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