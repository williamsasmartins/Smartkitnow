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
  // Inputs: concentrate volume, concentrate unit, dilution ratio (1:X), desired diluted volume, diluted volume unit
  // We'll allow user to input either dilution ratio or desired diluted volume, but dilution ratio is primary.
  // Units for volume: milliliters (mL), liters (L), fluid ounces (fl oz), gallons (gal)

  const [inputs, setInputs] = useState({
    concentrateVolume: "",
    concentrateUnit: "mL",
    dilutionRatio: "",
    desiredDilutedVolume: "",
    dilutedVolumeUnit: "mL",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Conversion factors to milliliters
  const volumeToMl = {
    mL: 1,
    L: 1000,
    "fl oz": 29.5735,
    gal: 3785.41,
  };

  // Validate inputs and calculate results
  const results = useMemo(() => {
    const {
      concentrateVolume,
      concentrateUnit,
      dilutionRatio,
      desiredDilutedVolume,
      dilutedVolumeUnit,
    } = inputs;

    // Parse numbers
    const concVolNum = parseFloat(concentrateVolume);
    const dilRatioNum = parseFloat(dilutionRatio);
    const desiredDilVolNum = parseFloat(desiredDilutedVolume);

    // Validation flags and messages
    if (
      isNaN(concVolNum) ||
      concVolNum <= 0 ||
      !volumeToMl[concentrateUnit] ||
      (dilutionRatio === "" && desiredDilutedVolume === "")
    ) {
      return {
        value: "",
        label: "",
        subtext: "",
        warning:
          "Please enter a valid concentrate volume & unit, and either a dilution ratio or desired diluted volume.",
        formulaUsed: null,
      };
    }

    if (
      dilutionRatio !== "" &&
      (isNaN(dilRatioNum) || dilRatioNum <= 0 || dilRatioNum < 1)
    ) {
      return {
        value: "",
        label: "",
        subtext: "",
        warning:
          "Dilution ratio must be a number &ge; 1 (e.g., 10 means 1:10 dilution).",
        formulaUsed: null,
      };
    }

    if (
      desiredDilutedVolume !== "" &&
      (isNaN(desiredDilVolNum) || desiredDilVolNum <= 0)
    ) {
      return {
        value: "",
        label: "",
        subtext: "",
        warning: "Desired diluted volume must be a positive number.",
        formulaUsed: null,
      };
    }

    // Convert concentrate volume to mL
    const concVolMl = concVolNum * volumeToMl[concentrateUnit];

    // If dilution ratio provided, calculate total diluted volume and water volume
    if (dilutionRatio !== "") {
      // Total diluted volume = concentrate volume * dilution ratio
      // Dilution ratio is 1:X, so total volume = concentrate volume * X
      const totalDilutedVolumeMl = concVolMl * dilRatioNum;

      // Water volume = total diluted volume - concentrate volume
      const waterVolumeMl = totalDilutedVolumeMl - concVolMl;

      // Convert results to user's desired diluted volume unit for display
      const totalDilutedVolumeDisplay =
        totalDilutedVolumeMl / volumeToMl[dilutedVolumeUnit];
      const waterVolumeDisplay = waterVolumeMl / volumeToMl[dilutedVolumeUnit];

      return {
        value: `${totalDilutedVolumeDisplay.toFixed(2)} ${dilutedVolumeUnit}`,
        label: "Total Diluted Volume",
        subtext: `Add ${waterVolumeDisplay.toFixed(
          2
        )} ${dilutedVolumeUnit} of water to ${concVolNum} ${concentrateUnit} of concentrate for a 1:${dilRatioNum} dilution.`,
        warning: null,
        formulaUsed:
          "Total Diluted Volume = Concentrate Volume × Dilution Ratio (1:X)",
      };
    }

    // If desired diluted volume provided, calculate required dilution ratio and water volume
    if (desiredDilutedVolume !== "") {
      // Convert desired diluted volume to mL
      const desiredDilutedVolumeMl = desiredDilVolNum * volumeToMl[dilutedVolumeUnit];

      if (desiredDilutedVolumeMl < concVolMl) {
        return {
          value: "",
          label: "",
          subtext: "",
          warning:
            "Desired diluted volume must be greater than or equal to the concentrate volume.",
          formulaUsed: null,
        };
      }

      // Dilution ratio = total diluted volume / concentrate volume
      const dilutionRatioCalc = desiredDilutedVolumeMl / concVolMl;

      // Water volume = total diluted volume - concentrate volume
      const waterVolumeMl = desiredDilutedVolumeMl - concVolMl;

      return {
        value: `1:${dilutionRatioCalc.toFixed(2)}`,
        label: "Dilution Ratio",
        subtext: `Add ${waterVolumeMl.toFixed(
          2
        )} mL of water to ${concVolNum} ${concentrateUnit} of concentrate to make ${desiredDilVolNum} ${dilutedVolumeUnit} of diluted solution.`,
        warning: null,
        formulaUsed:
          "Dilution Ratio (1:X) = Total Diluted Volume ÷ Concentrate Volume",
      };
    }

    return {
      value: "",
      label: "",
      subtext: "",
      warning: "Please provide either dilution ratio or desired diluted volume.",
      formulaUsed: null,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is a cleaning dilution ratio and why is it important?",
      answer:
        "A cleaning dilution ratio indicates how much water should be mixed with a concentrate to achieve an effective cleaning solution. Using the correct ratio ensures safety, optimizes cleaning performance, and prevents waste or damage caused by overly strong or weak mixtures.",
    },
    {
      question: "Can I use any units for volume in this calculator?",
      answer:
        "Yes, this calculator supports milliliters (mL), liters (L), fluid ounces (fl oz), and gallons (gal). Ensure you select the correct units for both concentrate and diluted volumes to get accurate results.",
    },
    {
      question: "What if I only know the desired diluted volume but not the dilution ratio?",
      answer:
        "You can enter the desired diluted volume along with the concentrate volume and units. The calculator will then compute the required dilution ratio and the amount of water needed to achieve that volume safely.",
    },
    {
      question: "Why must the dilution ratio be &ge; 1?",
      answer:
        "A dilution ratio less than 1 would imply more concentrate than water, which is typically unsafe or ineffective for cleaning. Ratios &ge; 1 ensure the concentrate is properly diluted with water.",
    },
    {
      question: "How do I measure the concentrate and water accurately?",
      answer:
        "Use appropriate measuring tools such as graduated cylinders, measuring cups, or scales for liquids. Accurate measurement ensures the cleaning solution is effective and safe to use.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="concentrateVolume" className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-blue-600" />
            Concentrate Volume
          </Label>
          <div className="flex gap-2 mt-1">
            <Input
              id="concentrateVolume"
              type="number"
              min="0"
              step="any"
              placeholder="e.g., 100"
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
              <SelectTrigger aria-label="Concentrate volume unit" className="w-24">
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mL">mL</SelectItem>
                <SelectItem value="L">L</SelectItem>
                <SelectItem value="fl oz">fl oz</SelectItem>
                <SelectItem value="gal">gal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p
            id="concentrateVolumeHelp"
            className="text-xs text-slate-500 mt-1"
          >
            Enter the volume of the cleaning concentrate.
          </p>
        </div>

        <div>
          <Label htmlFor="dilutionRatio" className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-green-600" />
            Dilution Ratio (1:X)
          </Label>
          <Input
            id="dilutionRatio"
            type="number"
            min="1"
            step="any"
            placeholder="e.g., 10"
            value={inputs.dilutionRatio}
            onChange={(e) => {
              handleInputChange("dilutionRatio", e.target.value);
              // Clear desired diluted volume if dilution ratio entered
              if (e.target.value !== "") {
                handleInputChange("desiredDilutedVolume", "");
              }
            }}
            aria-describedby="dilutionRatioHelp"
          />
          <p id="dilutionRatioHelp" className="text-xs text-slate-500 mt-1">
            Enter the dilution ratio (e.g., 10 means 1 part concentrate to 10 parts total).
          </p>
        </div>

        <div>
          <Label htmlFor="desiredDilutedVolume" className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-purple-600" />
            Desired Diluted Volume
          </Label>
          <div className="flex gap-2 mt-1">
            <Input
              id="desiredDilutedVolume"
              type="number"
              min="0"
              step="any"
              placeholder="e.g., 1000"
              value={inputs.desiredDilutedVolume}
              onChange={(e) => {
                handleInputChange("desiredDilutedVolume", e.target.value);
                // Clear dilution ratio if desired diluted volume entered
                if (e.target.value !== "") {
                  handleInputChange("dilutionRatio", "");
                }
              }}
              aria-describedby="desiredDilutedVolumeHelp"
            />
            <Select
              value={inputs.dilutedVolumeUnit}
              onValueChange={(value) =>
                handleInputChange("dilutedVolumeUnit", value)
              }
            >
              <SelectTrigger aria-label="Diluted volume unit" className="w-24">
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mL">mL</SelectItem>
                <SelectItem value="L">L</SelectItem>
                <SelectItem value="fl oz">fl oz</SelectItem>
                <SelectItem value="gal">gal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p
            id="desiredDilutedVolumeHelp"
            className="text-xs text-slate-500 mt-1"
          >
            Enter the total volume of diluted solution you want to prepare.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No explicit action needed, calculation is reactive
          }}
          aria-label="Calculate dilution"
        >
          <Home className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              concentrateVolume: "",
              concentrateUnit: "mL",
              dilutionRatio: "",
              desiredDilutedVolume: "",
              dilutedVolumeUnit: "mL",
            })
          }
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
          Cleaning dilution ratios are essential guidelines that indicate how much
          water should be mixed with a cleaning concentrate to achieve an effective
          and safe cleaning solution. The ratio is typically expressed as 1:X, where
          1 represents one part concentrate and X represents the total parts of the
          final solution. Proper dilution ensures the cleaning agent works efficiently
          without causing damage to surfaces or posing health risks.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Different cleaning tasks require different dilution ratios depending on
          the strength of the concentrate and the nature of the dirt or contamination.
          Overly concentrated mixtures can be hazardous and wasteful, while overly
          diluted solutions may be ineffective. Understanding and applying the correct
          dilution ratio is key to achieving optimal cleaning results.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This calculator helps you determine the right amount of water to add to your
          concentrate or, alternatively, the dilution ratio needed to prepare a specific
          volume of cleaning solution. It supports multiple units for convenience and
          accuracy.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Begin by entering the volume of your cleaning concentrate along with its unit.
          Then, you have two options: either input the dilution ratio (1:X) recommended
          for your cleaning task or specify the total volume of diluted solution you want
          to prepare.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          If you enter the dilution ratio, the calculator will compute the total diluted
          volume and the amount of water needed. If you enter the desired diluted volume,
          it will calculate the required dilution ratio and water volume.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Use the Calculate button to view your results. The Reset button clears all
          inputs so you can start fresh. Always double-check your measurements and
          units before mixing.
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
        formula:
          "Total Diluted Volume = Concentrate Volume × Dilution Ratio (1:X) or Dilution Ratio = Total Diluted Volume ÷ Concentrate Volume",
        variables: [
          {
            symbol: "Concentrate Volume",
            description: "Volume of cleaning concentrate (in mL, L, fl oz, or gal)",
          },
          {
            symbol: "Dilution Ratio (1:X)",
            description:
              "Ratio of concentrate to total solution volume (X &ge; 1, e.g., 10 means 1 part concentrate to 9 parts water)",
          },
          {
            symbol: "Total Diluted Volume",
            description: "Final volume of diluted cleaning solution",
          },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "You have 100 mL of a cleaning concentrate and want to prepare a 1:10 dilution solution.",
        steps: [
          {
            label: "1",
            explanation:
              "Enter 100 as the concentrate volume and select mL as the unit.",
          },
          {
            label: "2",
            explanation:
              "Enter 10 as the dilution ratio (1:10) and leave desired diluted volume empty.",
          },
          {
            label: "3",
            explanation:
              "Click Calculate to find the total diluted volume and amount of water needed.",
          },
        ],
        result:
          "Total diluted volume will be 1000 mL, so add 900 mL of water to 100 mL concentrate.",
      }}
      relatedCalculators={[
        {
          title: "Party Food & Drinks Planner",
          url: "/everyday/party-food-drinks-planner",
          icon: "🎉",
        },
        {
          title: "Water Heater Recovery Time Estimator",
          url: "/everyday/water-heater-recovery-time",
          icon: "💡",
        },
        {
          title: "Hose Runtime vs Flow Rate Calculator",
          url: "/everyday/hose-runtime-flow-rate",
          icon: "💡",
        },
        {
          title: "Coffee Urn Yield & Strength Calculator",
          url: "/everyday/coffee-urn-yield-strength",
          icon: "🎉",
        },
        {
          title: "Event Budget Calculator",
          url: "/everyday/event-budget-calculator",
          icon: "🎉",
        },
        {
          title: "Life Expectancy Calculator",
          url: "/everyday/life-expectancy",
          icon: "❤️",
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