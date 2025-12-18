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
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function LaundryDetergentDosageCalculator() {
  // Load size options and their typical detergent dosage in ml
  const loadSizes = [
    { label: "Small Load (up to 3 kg)", value: "small", dosageMl: 30 },
    { label: "Medium Load (3-6 kg)", value: "medium", dosageMl: 60 },
    { label: "Large Load (6-9 kg)", value: "large", dosageMl: 90 },
    { label: "Extra Large Load (9+ kg)", value: "extraLarge", dosageMl: 120 },
  ];

  // Detergent concentration options (ml per scoop)
  const detergentTypes = [
    { label: "Standard Concentration", value: "standard", mlPerScoop: 60 },
    { label: "High Concentration", value: "high", mlPerScoop: 40 },
    { label: "Ultra Concentration", value: "ultra", mlPerScoop: 30 },
  ];

  // State for inputs
  const [inputs, setInputs] = useState({
    loadSize: "",
    detergentType: "standard",
    numberOfLoads: "1",
  });

  // Handle input changes safely
  const handleInputChange = useCallback((name: string, value: string) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Calculate dosage results
  const results = useMemo(() => {
    const loadSizeObj = loadSizes.find((l) => l.value === inputs.loadSize);
    const detergentObj = detergentTypes.find(
      (d) => d.value === inputs.detergentType
    );

    // Validate inputs
    if (!loadSizeObj) {
      return {
        value: "Waiting...",
        label: "Select a load size",
        subtext: "",
        warning: null,
        formulaUsed: null,
      };
    }

    if (!detergentObj) {
      return {
        value: "Waiting...",
        label: "Select detergent concentration",
        subtext: "",
        warning: null,
        formulaUsed: null,
      };
    }

    // Validate number of loads - must be positive integer
    const loadsNum = Number(inputs.numberOfLoads);
    if (
      isNaN(loadsNum) ||
      loadsNum < 1 ||
      !Number.isInteger(loadsNum)
    ) {
      return {
        value: "Waiting...",
        label: "Enter a valid number of loads (≥ 1)",
        subtext: "",
        warning: null,
        formulaUsed: null,
      };
    }

    // Dosage per load in ml (from load size)
    const baseDosageMl = loadSizeObj.dosageMl;

    // Adjust dosage based on detergent concentration ml per scoop
    // We calculate how many scoops needed per load:
    // scoops = baseDosageMl / mlPerScoop
    // Total scoops = scoops * numberOfLoads

    const scoopsPerLoad = baseDosageMl / detergentObj.mlPerScoop;

    // Round scoops per load to 1 decimal place for user clarity
    const scoopsPerLoadRounded = Math.round(scoopsPerLoad * 10) / 10;

    // Total scoops for all loads
    const totalScoops = scoopsPerLoad * loadsNum;

    // Round total scoops up to nearest 0.1 scoop (practical)
    const totalScoopsRounded = Math.ceil(totalScoops * 10) / 10;

    // Total detergent volume in ml
    const totalDetergentMl = baseDosageMl * loadsNum;

    // Format output strings
    const value = `${totalScoopsRounded} scoop${totalScoopsRounded !== 1 ? "s" : ""}`;
    const label = `Detergent needed for ${loadsNum} load${loadsNum !== 1 ? "s" : ""}`;
    const subtext = `Each load requires about ${scoopsPerLoadRounded} scoop${scoopsPerLoadRounded !== 1 ? "s" : ""} (${baseDosageMl} ml)`;

    return {
      value,
      label,
      subtext,
      warning: null,
      formulaUsed:
        "Dosage per load (ml) ÷ Detergent ml per scoop × Number of loads",
    };
  }, [inputs, loadSizes, detergentTypes]);

  // FAQs
  const faqs = [
    {
      question: "Why is it important to measure laundry detergent dosage accurately?",
      answer:
        "Using the correct amount of laundry detergent ensures your clothes get properly cleaned without residue buildup. Overuse can cause skin irritation, damage fabrics, and waste money, while underuse may leave clothes dirty or smelly.",
    },
    {
      question: "Can I use the same detergent dosage for all load sizes?",
      answer:
        "No, detergent dosage should be adjusted based on the load size. Small loads require less detergent, while larger loads need more to effectively clean the clothes without wasting detergent.",
    },
    {
      question: "How does detergent concentration affect dosage?",
      answer:
        "More concentrated detergents require smaller dosages per load. This calculator adjusts dosage based on detergent concentration to help you use the right amount and avoid overuse.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Widget JSX
  const widget = (
    <div className="space-y-6">
      {/* Load Size Select */}
      <div>
        <Label htmlFor="loadSize" className="mb-1 font-semibold flex items-center gap-1">
          <Droplets className="w-4 h-4 text-blue-600" /> Load Size
        </Label>
        <Select
          value={inputs.loadSize}
          onValueChange={(value) => handleInputChange("loadSize", value)}
          id="loadSize"
          aria-label="Select load size"
        >
          <SelectTrigger>
            <SelectValue placeholder="Select load size" />
          </SelectTrigger>
          <SelectContent>
            {loadSizes.map((load) => (
              <SelectItem key={load.value} value={load.value}>
                {load.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Detergent Concentration Select */}
      <div>
        <Label htmlFor="detergentType" className="mb-1 font-semibold flex items-center gap-1">
          <Leaf className="w-4 h-4 text-green-600" /> Detergent Concentration
        </Label>
        <Select
          value={inputs.detergentType}
          onValueChange={(value) => handleInputChange("detergentType", value)}
          id="detergentType"
          aria-label="Select detergent concentration"
        >
          <SelectTrigger>
            <SelectValue placeholder="Select detergent concentration" />
          </SelectTrigger>
          <SelectContent>
            {detergentTypes.map((det) => (
              <SelectItem key={det.value} value={det.value}>
                {det.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Number of Loads Input */}
      <div>
        <Label htmlFor="numberOfLoads" className="mb-1 font-semibold flex items-center gap-1">
          <Calendar className="w-4 h-4 text-purple-600" /> Number of Loads
        </Label>
        <Input
          id="numberOfLoads"
          type="number"
          min={1}
          step={1}
          value={inputs.numberOfLoads}
          onChange={(e) => {
            const val = e.target.value;
            // Prevent negative or zero values
            if (val === "" || /^[1-9]\d*$/.test(val)) {
              handleInputChange("numberOfLoads", val);
            }
          }}
          placeholder="Enter number of loads"
          aria-describedby="numberOfLoadsHelp"
        />
        <p id="numberOfLoadsHelp" className="text-sm text-slate-500 mt-1">
          Enter the number of laundry loads you want to calculate for.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just trigger recalculation by setting state to current inputs
            setInputs((prev) => ({ ...prev }));
          }}
          aria-label="Calculate detergent dosage"
        >
          <Home className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ loadSize: "", detergentType: "standard", numberOfLoads: "1" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== "Waiting..." && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" aria-live="polite">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                {results.formulaUsed || "Result"}
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">{results.label}</p>
              {results.subtext && <p className="text-sm text-slate-500 mt-2">{results.subtext}</p>}
              {results.warning && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-950 border border-red-200 rounded-lg flex items-start gap-3 text-left">
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800 dark:text-red-200">{results.warning}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  // Editorial content
  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Laundry Detergent Dosage by Load Size
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Proper laundry detergent dosage is essential for effective cleaning and fabric care. Using too much detergent can leave residue on clothes, cause skin irritation, and harm your washing machine over time. Conversely, too little detergent may not clean clothes thoroughly, leaving stains and odors behind. By adjusting detergent amounts based on load size, you optimize cleaning performance while saving money and protecting your garments.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Load size refers to the weight or volume of laundry you put in the washing machine. Small loads require less detergent, while larger loads need more to ensure all fabrics are cleaned evenly. This calculator helps you determine the right detergent dosage for your specific load size and detergent concentration, making laundry day simpler and more efficient.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Whether you use standard or concentrated detergent, this tool guides you to measure the correct amount, preventing waste and protecting your clothes. Accurate dosing also benefits the environment by reducing excess chemicals entering wastewater systems.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use &amp; Formula</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this calculator, select your laundry load size based on the weight of clothes you typically wash. Then choose your detergent concentration type, which affects how much detergent is dispensed per scoop. Finally, enter the number of loads you want to calculate for.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The formula used is: <br />
          <strong>Dosage per load (ml) ÷ Detergent ml per scoop × Number of loads</strong>. <br />
          This calculates how many scoops of detergent you need in total. The dosage per load is based on typical recommendations for each load size, adjusted for detergent concentration.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This method ensures you use just the right amount of detergent, avoiding waste and improving washing results. Remember to always follow your detergent manufacturer's instructions as well.
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
      title="Laundry Detergent Dosage by Load Size"
      description="Determine the right laundry detergent dosage. Calculate the exact amount needed per load size to save money and protect clothes."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Methodology / Formula",
        formula: "Dosage per load (ml) ÷ Detergent ml per scoop × Number of loads",
        variables: [
          { symbol: "Dosage per load (ml)", description: "Recommended detergent volume for selected load size" },
          { symbol: "Detergent ml per scoop", description: "Volume of detergent per scoop based on concentration" },
          { symbol: "Number of loads", description: "Total laundry loads to wash" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "You have a medium load of laundry (about 5 kg) and use a standard concentration detergent with 60 ml per scoop. You want to wash 3 loads today.",
        steps: [
          {
            label: "1",
            explanation:
              "Select 'Medium Load (3-6 kg)' and 'Standard Concentration' in the calculator.",
          },
          {
            label: "2",
            explanation: "Enter '3' for the number of loads.",
          },
          {
            label: "3",
            explanation:
              "The calculator shows you need 3 scoops total (1 scoop per load × 3 loads).",
          },
        ],
        result: "Use 3 scoops (180 ml) of detergent in total for your 3 medium loads.",
      }}
      relatedCalculators={[
        { title: "Hose Runtime vs Flow Rate Calculator", url: "/everyday/hose-runtime-flow-rate", icon: "💡" },
        { title: "Water Heater Recovery Time Estimator", url: "/everyday/water-heater-recovery-time", icon: "💡" },
        { title: "Event Budget Calculator", url: "/everyday/event-budget-calculator", icon: "🎉" },
        { title: "Basal Metabolic Rate (BMR) Calculator", url: "/everyday/bmr-calculator", icon: "❤️" },
        { title: "Ice Quantity for Beverages Calculator", url: "/everyday/ice-quantity-beverages", icon: "💡" },
        { title: "Buffet Serving Pan Capacity & Count", url: "/everyday/buffet-pan-capacity-count", icon: "🎉" },
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