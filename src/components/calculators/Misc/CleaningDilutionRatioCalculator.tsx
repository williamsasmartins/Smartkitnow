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

export default function CleaningDilutionRatioCalculator() {
  /**
   * Inputs:
   * - concentrateAmount: number (amount of concentrate chemical)
   * - concentrateUnit: string (ml, oz, liters)
   * - waterAmount: number (amount of water)
   * - waterUnit: string (ml, oz, liters)
   * 
   * Output:
   * - dilutionRatio: string (e.g., 1:10)
   * - totalVolume: string (in chosen unit)
   */

  // State for inputs
  const [inputs, setInputs] = useState({
    concentrateAmount: "",
    concentrateUnit: "ml",
    waterAmount: "",
    waterUnit: "ml",
  });

  // Handle input changes
  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Unit conversion helper (to milliliters)
  const unitToMl = (value, unit) => {
    if (isNaN(value) || value <= 0) return null;
    switch (unit) {
      case "ml":
        return value;
      case "oz":
        return value * 29.5735;
      case "l":
        return value * 1000;
      default:
        return null;
    }
  };

  // Unit conversion helper (from milliliters)
  const mlToUnit = (value, unit) => {
    if (value === null) return null;
    switch (unit) {
      case "ml":
        return value;
      case "oz":
        return value / 29.5735;
      case "l":
        return value / 1000;
      default:
        return null;
    }
  };

  // Calculate dilution ratio and total volume
  const results = useMemo(() => {
    const cAmt = parseFloat(inputs.concentrateAmount);
    const wAmt = parseFloat(inputs.waterAmount);
    if (!cAmt || !wAmt) {
      return {
        value: null,
        label: null,
        subtext: null,
        warning: "Please enter valid positive numbers for both concentrate and water amounts.",
        formulaUsed: null,
      };
    }

    const cMl = unitToMl(cAmt, inputs.concentrateUnit);
    const wMl = unitToMl(wAmt, inputs.waterUnit);

    if (cMl === null || wMl === null) {
      return {
        value: null,
        label: null,
        subtext: null,
        warning: "Invalid unit or amount entered. Please check your inputs.",
        formulaUsed: null,
      };
    }

    if (cMl === 0) {
      return {
        value: null,
        label: null,
        subtext: null,
        warning: "Concentrate amount cannot be zero.",
        formulaUsed: null,
      };
    }

    // Dilution ratio = water : concentrate (simplified)
    // For example, if concentrate = 100 ml, water = 900 ml, ratio = 1:9
    // We express ratio as 1:x where x = water/concentrate rounded to 2 decimals

    const ratioValue = wMl / cMl;
    const ratioRounded = Math.round(ratioValue * 100) / 100;

    // Total volume in ml
    const totalVolumeMl = cMl + wMl;

    // Display total volume in concentrate unit for consistency
    const totalVolumeInConcentrateUnit = mlToUnit(totalVolumeMl, inputs.concentrateUnit);

    // Format values nicely
    const ratioString = `1 : ${ratioRounded}`;
    const totalVolumeString =
      inputs.concentrateUnit === "ml"
        ? `${totalVolumeInConcentrateUnit.toFixed(0)} ml`
        : inputs.concentrateUnit === "oz"
        ? `${totalVolumeInConcentrateUnit.toFixed(2)} oz`
        : `${totalVolumeInConcentrateUnit.toFixed(3)} liters`;

    return {
      value: ratioString,
      label: "Dilution Ratio (Water : Concentrate)",
      subtext: `Total mixed volume: ${totalVolumeString}`,
      warning: null,
      formulaUsed: "Dilution Ratio = Water Volume / Concentrate Volume",
    };
  }, [inputs]);

  // FAQs for JSON-LD and display
  const faqs = [
    {
      question: "What is a cleaning dilution ratio?",
      answer:
        "A cleaning dilution ratio represents the proportion of water to cleaning concentrate used to prepare a cleaning solution. It ensures the chemical is diluted correctly for safe and effective use.",
    },
    {
      question: "Why is it important to use the correct dilution ratio?",
      answer:
        "Using the correct dilution ratio maximizes cleaning efficiency while minimizing chemical waste and potential hazards. Over-concentration can damage surfaces or pose health risks, while under-concentration may reduce cleaning effectiveness.",
    },
    {
      question: "Can I use different units for concentrate and water?",
      answer:
        "Yes, this calculator supports mixing different units such as milliliters, ounces, and liters. It automatically converts them to calculate the accurate dilution ratio.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Widget UI
  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="concentrateAmount" className="mb-1 flex items-center gap-1">
                <FlaskConical className="w-4 h-4 text-blue-600" /> Concentrate Amount
              </Label>
              <div className="flex gap-2">
                <Input
                  id="concentrateAmount"
                  type="number"
                  min={0}
                  step="any"
                  placeholder="e.g., 100"
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
                    <SelectItem value="oz">oz</SelectItem>
                    <SelectItem value="l">liters</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="waterAmount" className="mb-1 flex items-center gap-1">
                <Droplets className="w-4 h-4 text-blue-600" /> Water Amount
              </Label>
              <div className="flex gap-2">
                <Input
                  id="waterAmount"
                  type="number"
                  min={0}
                  step="any"
                  placeholder="e.g., 900"
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
                    <SelectItem value="oz">oz</SelectItem>
                    <SelectItem value="l">liters</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Buttons */}
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
            })
          }
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value && !results.warning && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="mt-2 text-lg font-medium text-blue-800 dark:text-blue-300">{results.label}</p>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">{results.subtext}</p>
          </CardContent>
        </Card>
      )}

      {/* Warning */}
      {results.warning && (
        <Card className="border border-red-400 bg-red-50 dark:bg-red-900 dark:border-red-700 shadow-md">
          <CardContent className="text-center text-red-700 dark:text-red-300 flex items-center justify-center gap-2">
            <AlertTriangle className="w-5 h-5" /> {results.warning}
          </CardContent>
        </Card>
      )}
    </div>
  );

  // Editorial content with rich paragraphs and examples
  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Cleaning Dilution Ratio Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The cleaning dilution ratio calculator is an essential tool designed to help users accurately mix cleaning chemicals with water to achieve the optimal concentration for effective cleaning. Dilution ratios indicate how much water should be combined with a concentrate to create a safe and efficient cleaning solution. Using the correct dilution ratio ensures that the cleaning agent performs as intended without causing damage to surfaces or posing health risks to users. This calculator simplifies the process by allowing inputs in various units and automatically computing the precise ratio and total volume.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Whether you are a professional cleaner, a facility manager, or a homeowner, understanding and applying the correct dilution ratio is critical for safety, cost-effectiveness, and environmental responsibility. Over-diluting can reduce cleaning efficacy, while under-diluting can lead to chemical waste and potential hazards. This tool empowers you to mix solutions confidently and correctly every time.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this calculator is straightforward and intuitive. Begin by entering the amount of cleaning concentrate you plan to use, selecting the appropriate unit of measurement. Next, input the amount of water you intend to mix with the concentrate, again choosing the correct unit. The calculator will then compute the dilution ratio, expressed as the proportion of water to concentrate, and display the total volume of the mixed solution.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter the volume of the cleaning concentrate (e.g., 100 ml).
          </li>
          <li>
            <strong>Step 2:</strong> Enter the volume of water to mix with the concentrate (e.g., 900 ml).
          </li>
          <li>
            <strong>Step 3:</strong> Select the units for both inputs (milliliters, ounces, or liters).
          </li>
          <li>
            <strong>Step 4:</strong> Click the "Calculate" button to view the dilution ratio and total volume.
          </li>
          <li>
            <strong>Step 5:</strong> Use the dilution ratio to prepare your cleaning solution safely and effectively.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Professional Tips & Safety</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          When preparing cleaning solutions, always wear appropriate personal protective equipment such as gloves and eye protection to prevent chemical exposure. Ensure you mix chemicals in a well-ventilated area and never mix different cleaning agents unless explicitly recommended by the manufacturer, as this can produce hazardous reactions. Use clean, calibrated measuring tools to maintain accuracy in your dilutions. Additionally, always label your mixed solutions with the dilution ratio and date of preparation to maintain safety and compliance.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Store concentrates and diluted solutions separately and out of reach of children and pets. Follow manufacturer guidelines for disposal of unused chemicals and containers to minimize environmental impact. Regularly review and update your dilution practices to align with the latest safety standards and regulations.
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
              href="https://www.epa.gov/pesticide-worker-safety/understanding-pesticide-labels"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              EPA - Understanding Pesticide Labels <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Official guidelines from the Environmental Protection Agency on interpreting chemical labels and dilution instructions for safe use.
            </p>
          </li>
          <li>
            <a
              href="https://www.cdc.gov/niosh/topics/cleaning/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              CDC - Cleaning and Disinfection <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Centers for Disease Control and Prevention resources on effective cleaning and disinfection practices, including dilution recommendations.
            </p>
          </li>
          <li>
            <a
              href="https://extension.oregonstate.edu/gardening/techniques/how-mix-pesticides-safely"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Oregon State University Extension - How to Mix Pesticides Safely <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Comprehensive guide on measuring and mixing chemicals safely, emphasizing correct dilution ratios and safety precautions.
            </p>
          </li>
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
        formula: "Dilution Ratio = Water Volume / Concentrate Volume",
        variables: [
          { symbol: "Water Volume", description: "Amount of water used in the mixture" },
          { symbol: "Concentrate Volume", description: "Amount of cleaning concentrate used" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "You have 100 ml of a cleaning concentrate and want to dilute it with water to prepare a cleaning solution.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Enter 100 as the concentrate amount and select 'ml' as the unit.",
          },
          {
            label: "Step 2",
            explanation:
              "Enter 900 as the water amount and select 'ml' as the unit.",
          },
          {
            label: "Step 3",
            explanation:
              "Click 'Calculate' to find the dilution ratio, which will be 1:9, meaning 1 part concentrate to 9 parts water.",
          },
        ],
        result:
          "The total volume of the mixed solution will be 1000 ml, and the dilution ratio is 1:9 (water to concentrate).",
      }}
      relatedCalculators={[
        { title: "MyPlate Daily Calorie/Nutrient Planner", url: "/everyday-life/myplate-daily-calorie-nutrient", icon: "❤️" },
        { title: "Body Fat Percentage Calculator", url: "/everyday-life/body-fat-percentage", icon: "💡" },
        { title: "Laundry Detergent Dosage by Load Size", url: "/everyday-life/laundry-detergent-dosage", icon: "💡" },
        { title: "Party Food & Drinks Planner", url: "/everyday-life/party-food-drinks-planner", icon: "🎉" },
        { title: "Basal Metabolic Rate (BMR) Calculator", url: "/everyday-life/bmr-calculator", icon: "💡" },
        { title: "Home Paint Touch-Up Estimator", url: "/everyday-life/home-paint-touch-up", icon: "🏠" },
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