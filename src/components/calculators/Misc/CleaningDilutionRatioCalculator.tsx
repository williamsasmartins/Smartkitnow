import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ IMPORT ALL ICONS
import { Home, Heart, Utensils, Leaf, Calendar, DollarSign, Droplets, Activity, Moon, Sun, Users, Paintbrush, Wrench, Info, RotateCcw, AlertTriangle, FlaskConical, Scale, Waves, Zap } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CleaningDilutionRatioCalculator() {
  const [inputs, setInputs] = useState({
    concentrateAmount: "",
    concentrateUnit: "ml",
    dilutionRatio: "",
    finalVolumeUnit: "ml",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Conversion factors to milliliters for volume units
  const volumeUnitToMl = {
    ml: 1,
    l: 1000,
    oz: 29.5735,
    gal: 3785.41,
  };

  // Validate inputs and parse numbers
  const concentrateAmountNum = parseFloat(inputs.concentrateAmount);
  const dilutionRatioNum = parseFloat(inputs.dilutionRatio);

  // Calculation logic:
  // Given concentrate amount and dilution ratio (e.g. 1:10 means 1 part concentrate + 10 parts water),
  // Calculate the amount of water needed and total final volume.
  // Formula:
  // Water volume = Concentrate volume * dilution ratio
  // Final volume = Concentrate volume + Water volume

  const results = useMemo(() => {
    if (
      isNaN(concentrateAmountNum) ||
      concentrateAmountNum <= 0 ||
      isNaN(dilutionRatioNum) ||
      dilutionRatioNum <= 0
    ) {
      return {
        value: null,
        label: "",
        subtext: "",
        warning: "Please enter valid positive numbers for concentrate amount and dilution ratio.",
        formulaUsed: "",
      };
    }

    // Convert concentrate amount to ml
    const concentrateMl = concentrateAmountNum * (volumeUnitToMl[inputs.concentrateUnit] || 1);

    // Calculate water volume in ml
    const waterMl = concentrateMl * dilutionRatioNum;

    // Calculate final volume in ml
    const finalVolumeMl = concentrateMl + waterMl;

    // Convert final volume to desired unit
    const finalVolumeConverted =
      finalVolumeMl / (volumeUnitToMl[inputs.finalVolumeUnit] || 1);

    // Convert water volume to desired unit
    const waterVolumeConverted =
      waterMl / (volumeUnitToMl[inputs.finalVolumeUnit] || 1);

    // Format numbers to 2 decimals
    const formatNum = (num) => Number.parseFloat(num).toFixed(2);

    return {
      value: `${formatNum(waterVolumeConverted)} ${inputs.finalVolumeUnit}`,
      label: `Water needed to dilute ${formatNum(concentrateAmountNum)} ${inputs.concentrateUnit} of concentrate at a ${dilutionRatioNum}:1 ratio`,
      subtext: `Total final volume will be approximately ${formatNum(finalVolumeConverted)} ${inputs.finalVolumeUnit}.`,
      warning: null,
      formulaUsed: `Water Volume = Concentrate Volume × Dilution Ratio`,
    };
  }, [concentrateAmountNum, dilutionRatioNum, inputs.concentrateUnit, inputs.finalVolumeUnit]);

  // RICH FAQs
  const faqs = [
    {
      question: "What is a cleaning dilution ratio and why is it important?",
      answer:
        "A cleaning dilution ratio represents the proportion of concentrate cleaner to water used in a cleaning solution. For example, a 1:10 ratio means one part concentrate to ten parts water. Understanding and using the correct dilution ratio is crucial because it ensures the cleaning solution is effective without wasting chemicals or causing damage. Overly concentrated solutions can be hazardous or leave residues, while overly diluted mixtures may not clean properly, leading to ineffective sanitation and potential health risks.",
    },
    {
      question: "How do I determine the correct dilution ratio for different cleaning tasks?",
      answer:
        "The correct dilution ratio depends on the type of cleaning task, the strength of the concentrate, and manufacturer recommendations. Heavy-duty cleaning, such as degreasing or disinfecting, often requires stronger concentrations (lower dilution ratios), while light cleaning or maintenance tasks use higher dilution ratios (more water). Always consult product labels or safety data sheets for guidance. Additionally, consider the surface material and environmental factors, as some surfaces may require gentler solutions to avoid damage.",
    },
    {
      question: "Can I use any unit of measurement for the concentrate and water?",
      answer:
        "Yes, you can use various units such as milliliters (ml), liters (l), ounces (oz), or gallons (gal) when measuring both concentrate and water. However, consistency is key: ensure you convert all measurements to the same unit system before mixing. This calculator supports multiple units and converts them internally to provide accurate results. Using consistent units prevents errors in dilution, which could compromise cleaning effectiveness or safety.",
    },
    {
      question: "What safety precautions should I take when mixing cleaning solutions?",
      answer:
        "When mixing cleaning solutions, always wear appropriate personal protective equipment such as gloves and eye protection to prevent skin and eye irritation. Work in a well-ventilated area to avoid inhaling fumes. Never mix different chemical concentrates unless specified safe by the manufacturer, as this can cause dangerous reactions. Measure accurately using proper tools, and add concentrate to water rather than water to concentrate to minimize splashing. Store mixed solutions safely and label them clearly to avoid misuse.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="concentrateAmount" className="mb-1 flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-blue-600" /> Concentrate Amount
          </Label>
          <div className="flex gap-2">
            <Input
              id="concentrateAmount"
              type="number"
              min="0"
              step="any"
              placeholder="e.g. 100"
              value={inputs.concentrateAmount}
              onChange={(e) => handleInputChange("concentrateAmount", e.target.value)}
              aria-describedby="concentrateAmountHelp"
            />
            <Select
              value={inputs.concentrateUnit}
              onValueChange={(v) => handleInputChange("concentrateUnit", v)}
            >
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ml">ml</SelectItem>
                <SelectItem value="l">l</SelectItem>
                <SelectItem value="oz">oz</SelectItem>
                <SelectItem value="gal">gal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p id="concentrateAmountHelp" className="text-sm text-slate-500 mt-1">
            Enter the volume of the cleaning concentrate you plan to use.
          </p>
        </div>

        <div>
          <Label htmlFor="dilutionRatio" className="mb-1 flex items-center gap-2">
            <Droplets className="w-5 h-5 text-blue-600" /> Dilution Ratio (Water : Concentrate)
          </Label>
          <Input
            id="dilutionRatio"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 10"
            value={inputs.dilutionRatio}
            onChange={(e) => handleInputChange("dilutionRatio", e.target.value)}
            aria-describedby="dilutionRatioHelp"
          />
          <p id="dilutionRatioHelp" className="text-sm text-slate-500 mt-1">
            Enter the ratio of water to concentrate (e.g., 10 means 10 parts water per 1 part concentrate).
          </p>
        </div>

        <div>
          <Label htmlFor="finalVolumeUnit" className="mb-1 flex items-center gap-2">
            <Scale className="w-5 h-5 text-blue-600" /> Desired Output Unit
          </Label>
          <Select
            id="finalVolumeUnit"
            value={inputs.finalVolumeUnit}
            onValueChange={(v) => handleInputChange("finalVolumeUnit", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ml">ml</SelectItem>
              <SelectItem value="l">l</SelectItem>
              <SelectItem value="oz">oz</SelectItem>
              <SelectItem value="gal">gal</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-slate-500 mt-1">
            Choose the unit for the calculated water volume and final solution volume.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {
            // No special action needed, calculation is reactive
          }}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          aria-label="Calculate dilution"
        >
          <Home className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              concentrateAmount: "",
              concentrateUnit: "ml",
              dilutionRatio: "",
              finalVolumeUnit: "ml",
            })
          }
          className="flex-1 h-11"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value && !results.warning && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" role="region" aria-live="polite">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
              <p className="mt-2 text-lg text-blue-800 dark:text-blue-300">{results.label}</p>
              <p className="mt-1 text-sm text-blue-700 dark:text-blue-400 italic">{results.subtext}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Warning */}
      {results.warning && (
        <div
          className="flex items-center gap-2 text-red-700 bg-red-100 border border-red-300 rounded-md p-4 mt-4"
          role="alert"
        >
          <AlertTriangle className="w-6 h-6" />
          <p>{results.warning}</p>
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
          The Cleaning Dilution Ratio Calculator is an essential tool designed to help you accurately mix cleaning solutions by determining the precise amount of water needed to dilute a concentrate. Cleaning concentrates are often highly potent and require dilution to ensure they are safe and effective for use on various surfaces. Using the correct dilution ratio not only optimizes cleaning performance but also minimizes chemical waste and reduces environmental impact. This calculator simplifies the process by converting your inputs into actionable measurements, ensuring you achieve the perfect balance every time.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Dilution ratios are typically expressed as the amount of water per unit of concentrate, such as 10:1, meaning ten parts water to one part concentrate. Understanding these ratios is crucial because different cleaning tasks require different strengths of solutions. For example, disinfecting a heavily soiled surface may require a stronger solution than routine cleaning. This calculator supports multiple units of measurement, allowing you to input your concentrate volume and desired dilution ratio in units you are comfortable with, and it will convert and calculate the necessary water volume accordingly.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Step-by-Step Guide</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use the Cleaning Dilution Ratio Calculator effectively, start by measuring the volume of your cleaning concentrate. This can be in milliliters, liters, ounces, or gallons, depending on your preference or the packaging of the product. Next, input this volume into the calculator along with the dilution ratio recommended by the manufacturer or based on your cleaning needs. The dilution ratio represents how many parts water you need to add per part concentrate. For example, a 10 means ten parts water for every one part concentrate.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            Enter the volume of concentrate you have or plan to use, selecting the appropriate unit from the dropdown menu.
          </li>
          <li>
            Input the dilution ratio as a number representing parts water per one part concentrate.
          </li>
          <li>
            Choose the unit you want the final water volume and total solution volume to be displayed in.
          </li>
          <li>
            Click the Calculate button to see the exact amount of water you need to add to your concentrate.
          </li>
          <li>
            Review the results carefully and prepare your cleaning solution accordingly, ensuring safety and accuracy.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Professional Tips & Safety</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          When preparing cleaning solutions, precision and safety are paramount. Always use calibrated measuring tools such as graduated cylinders or measuring cups to ensure accurate volumes. Add concentrate to water rather than water to concentrate to minimize splashing and chemical reactions. Wear appropriate personal protective equipment, including gloves and eye protection, especially when handling strong chemicals. Work in a well-ventilated area to avoid inhaling fumes. Never mix different cleaning chemicals unless explicitly stated safe, as this can cause dangerous reactions. Store mixed solutions in clearly labeled containers and use them within recommended timeframes to maintain effectiveness.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Additionally, always follow manufacturer instructions and local regulations regarding chemical use and disposal. Keep cleaning solutions out of reach of children and pets. If you are unsure about the correct dilution ratio or safety precautions, consult product safety data sheets or contact the manufacturer. Proper dilution not only protects your health but also extends the life of surfaces and equipment by preventing damage caused by overly strong chemicals. By following these professional tips, you ensure effective cleaning while maintaining a safe environment.
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
        formula: "Water Volume = Concentrate Volume × Dilution Ratio",
        variables: [
          { symbol: "Water Volume", description: "Amount of water to add" },
          { symbol: "Concentrate Volume", description: "Amount of cleaning concentrate" },
          { symbol: "Dilution Ratio", description: "Parts of water per one part concentrate" },
        ],
      }}
      example={{
        title: "Real World Example",
        scenario:
          "Imagine you have 200 ml of a cleaning concentrate and the manufacturer recommends a dilution ratio of 1:15 (one part concentrate to fifteen parts water) for general cleaning. You want to prepare the solution in milliliters.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Input the concentrate amount as 200 and select 'ml' as the unit since you have 200 milliliters of concentrate.",
          },
          {
            label: "Step 2",
            explanation:
              "Enter the dilution ratio as 15, representing fifteen parts water per one part concentrate.",
          },
          {
            label: "Step 3",
            explanation:
              "Choose 'ml' as the desired output unit to get the water volume and final solution volume in milliliters.",
          },
          {
            label: "Step 4",
            explanation:
              "Click Calculate. The calculator will multiply 200 ml by 15 to find that you need 3000 ml of water. The total solution volume will be 200 ml + 3000 ml = 3200 ml.",
          },
        ],
        result:
          "You should add 3000 ml of water to your 200 ml concentrate to achieve the recommended dilution. This will yield a total of 3200 ml of cleaning solution, perfectly balanced for effective and safe cleaning.",
      }}
      relatedCalculators={[
        { title: "Water Heater Recovery Time Estimator", url: "/everyday-life/water-heater-recovery-time", icon: "💡" },
        { title: "Leftovers Cooling & Reheat Time", url: "/everyday-life/leftovers-cooling-reheat-time", icon: "💡" },
        { title: "Wine/Beer/Soft Drink Mix Estimator", url: "/everyday-life/beverage-mix-estimator", icon: "💡" },
        { title: "Refrigerator/Freezer Safe Zone Time Window", url: "/everyday-life/refrigerator-freezer-safe-zone-time-window", icon: "💡" },
        { title: "Home Renovation Cost Estimator", url: "/everyday-life/home-renovation-cost-estimator", icon: "🏠" },
        { title: "Garden Soil/Compost Volume Calculator", url: "/everyday-life/garden-soil-compost-volume", icon: "🌿" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding" },
        { id: "how-to", label: "Step-by-Step Guide" },
        { id: "tips", label: "Pro Tips & Safety" },
        { id: "faq", label: "FAQ" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}