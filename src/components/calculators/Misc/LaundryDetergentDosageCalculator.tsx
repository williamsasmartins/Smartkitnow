import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ FULL ICON IMPORT
import { Home, Heart, Utensils, Leaf, Calendar, DollarSign, Droplets, Activity, Moon, Sun, Users, Paintbrush, Wrench, Info, RotateCcw, AlertTriangle, FlaskConical, Scale, Waves, Zap } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function LaundryDetergentDosageCalculator() {
  // Inputs: load size (small, medium, large), detergent concentration (standard, high-efficiency), detergent type (liquid, powder, pods)
  // Optional: water hardness (soft, medium, hard)
  const [inputs, setInputs] = useState({
    loadSize: "",
    detergentType: "",
    detergentConcentration: "",
    waterHardness: "",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Dosage guidelines (in ounces or pods count)
  // Source: Typical manufacturer recommendations and EPA guidelines
  // For pods, dosage is number of pods per load size
  // For liquids and powders, dosage is fluid ounces or scoops

  // Dosage base values (standard concentration, medium water hardness)
  // Small load: 1/4 cup (2 fl oz) liquid or powder, 1 pod
  // Medium load: 1/3 cup (2.7 fl oz), 1 pod
  // Large load: 1/2 cup (4 fl oz), 2 pods

  // Adjustments:
  // High-efficiency detergent: reduce dosage by 25%
  // Water hardness:
  //   Soft: reduce dosage by 10%
  //   Medium: no change
  //   Hard: increase dosage by 15%

  // Pods do not change dosage by concentration or water hardness (fixed count)

  const results = useMemo(() => {
    const { loadSize, detergentType, detergentConcentration, waterHardness } = inputs;

    if (!loadSize || !detergentType || !detergentConcentration) {
      return {
        value: null,
        label: "",
        subtext: "Please select all required options to calculate dosage.",
        warning: null,
        formulaUsed: "",
      };
    }

    // Base dosage in fluid ounces or pods count
    let baseDosage = 0;
    let dosageUnit = "fl oz";
    let warning = null;

    // Define base dosage by load size and detergent type
    // Pods dosage is integer count, liquids and powders are fluid ounces
    if (detergentType === "pods") {
      dosageUnit = "pods";
      switch (loadSize) {
        case "small":
          baseDosage = 1;
          break;
        case "medium":
          baseDosage = 1;
          break;
        case "large":
          baseDosage = 2;
          break;
        default:
          baseDosage = 1;
      }
    } else {
      // liquid or powder
      dosageUnit = "fl oz";
      switch (loadSize) {
        case "small":
          baseDosage = 2.0; // 1/4 cup
          break;
        case "medium":
          baseDosage = 2.7; // 1/3 cup
          break;
        case "large":
          baseDosage = 4.0; // 1/2 cup
          break;
        default:
          baseDosage = 2.7;
      }
    }

    // Adjust dosage for concentration (only for liquid and powder)
    let adjustedDosage = baseDosage;
    if (detergentType !== "pods") {
      if (detergentConcentration === "high-efficiency") {
        adjustedDosage = adjustedDosage * 0.75; // reduce by 25%
      }
    }

    // Adjust dosage for water hardness (only for liquid and powder)
    if (detergentType !== "pods") {
      switch (waterHardness) {
        case "soft":
          adjustedDosage = adjustedDosage * 0.9; // reduce by 10%
          break;
        case "medium":
          // no change
          break;
        case "hard":
          adjustedDosage = adjustedDosage * 1.15; // increase by 15%
          break;
        default:
          // no change if not selected
          break;
      }
    }

    // Round dosage sensibly
    if (detergentType === "pods") {
      adjustedDosage = Math.round(adjustedDosage);
      if (adjustedDosage < 1) adjustedDosage = 1;
    } else {
      adjustedDosage = Math.round(adjustedDosage * 10) / 10; // 1 decimal place
      if (adjustedDosage < 0.5) adjustedDosage = 0.5;
    }

    // Warning if large load with small dosage or missing water hardness
    if (loadSize === "large" && detergentType !== "pods" && (!waterHardness || waterHardness === "")) {
      warning = "For large loads, selecting water hardness improves dosage accuracy.";
    }

    // Formula explanation
    const formulaUsed = detergentType === "pods"
      ? "Dosage = Fixed pod count based on load size"
      : "Dosage = Base dosage × Concentration factor × Water hardness factor";

    return {
      value: `${adjustedDosage} ${dosageUnit}`,
      label: "Recommended Detergent Dosage",
      subtext: warning ? warning : `Calculated dosage for a ${loadSize} load using ${detergentConcentration} ${detergentType} detergent.`,
      warning,
      formulaUsed,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "Why does detergent dosage vary by load size?",
      answer:
        "Detergent dosage varies by load size because larger loads contain more clothes and soil, requiring more cleaning agents to effectively remove dirt and stains. Using the correct amount ensures optimal cleaning performance without wasting detergent or causing residue buildup on clothes. Overdosing can also harm fabrics and the environment, while underdosing may leave clothes unclean.",
    },
    {
      question: "How does water hardness affect detergent dosage?",
      answer:
        "Water hardness refers to the concentration of minerals like calcium and magnesium in water. Hard water reduces detergent effectiveness because minerals bind with detergent molecules, requiring higher detergent amounts to achieve the same cleaning power. Conversely, soft water requires less detergent. Adjusting dosage based on water hardness improves cleaning results and prevents detergent waste.",
    },
    {
      question: "What is the difference between standard and high-efficiency detergents?",
      answer:
        "Standard detergents are formulated for traditional washing machines with higher water volumes, requiring larger dosages. High-efficiency (HE) detergents are concentrated and designed for HE machines that use less water. HE detergents produce fewer suds and require smaller dosages to clean effectively, saving detergent and reducing environmental impact.",
    },
    {
      question: "Can I use pods for all load sizes?",
      answer:
        "Laundry detergent pods are pre-measured and convenient but may not be ideal for all load sizes. Typically, one pod is sufficient for small to medium loads, while large or heavily soiled loads may require two pods. Using more pods than necessary can waste detergent and increase residue on clothes. Always follow manufacturer recommendations for pod usage.",
    },
    {
      question: "What happens if I use too much detergent?",
      answer:
        "Using too much detergent can cause excessive suds that interfere with washing machine performance, leading to poor rinsing and detergent residue on clothes. This residue can cause skin irritation, fabric damage, and unpleasant odors. Overuse also wastes detergent and increases environmental pollution due to excess chemicals in wastewater.",
    },
    {
      question: "How can I measure detergent accurately?",
      answer:
        "Accurate detergent measurement can be done using the dosing cap or scoop provided with the detergent. For liquids and powders, use measuring cups or spoons to ensure correct amounts. For pods, use the recommended number per load size. Avoid guessing or eyeballing to prevent under- or overdosing, ensuring optimal cleaning and fabric care.",
    },
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
        <div className="space-y-4">
          <div>
            <Label htmlFor="loadSize" className="font-semibold text-slate-900 dark:text-slate-100">
              Load Size <span className="text-red-600">*</span>
            </Label>
            <Select
              value={inputs.loadSize || ""}
              onValueChange={(v) => handleInputChange("loadSize", v)}
              aria-label="Select load size"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select load size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small (up to 3 kg / 6.6 lbs)</SelectItem>
                <SelectItem value="medium">Medium (3-5 kg / 6.6-11 lbs)</SelectItem>
                <SelectItem value="large">Large (5-7 kg / 11-15.4 lbs)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="detergentType" className="font-semibold text-slate-900 dark:text-slate-100">
              Detergent Type <span className="text-red-600">*</span>
            </Label>
            <Select
              value={inputs.detergentType || ""}
              onValueChange={(v) => handleInputChange("detergentType", v)}
              aria-label="Select detergent type"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select detergent type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="liquid">Liquid</SelectItem>
                <SelectItem value="powder">Powder</SelectItem>
                <SelectItem value="pods">Pods</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="detergentConcentration" className="font-semibold text-slate-900 dark:text-slate-100">
              Detergent Concentration <span className="text-red-600">*</span>
            </Label>
            <Select
              value={inputs.detergentConcentration || ""}
              onValueChange={(v) => handleInputChange("detergentConcentration", v)}
              aria-label="Select detergent concentration"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select detergent concentration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="high-efficiency">High-Efficiency (HE)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {inputs.detergentType !== "pods" && (
            <div>
              <Label htmlFor="waterHardness" className="font-semibold text-slate-900 dark:text-slate-100">
                Water Hardness (optional)
              </Label>
              <Select
                value={inputs.waterHardness || ""}
                onValueChange={(v) => handleInputChange("waterHardness", v)}
                aria-label="Select water hardness"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select water hardness" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="soft">Soft</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-6">
          <Button
            className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
            onClick={() => {
              // No special action needed, calculation is reactive
            }}
            aria-label="Calculate detergent dosage"
          >
            <Scale className="mr-2 h-4 w-4" /> Calculate
          </Button>
          <Button
            variant="outline"
            onClick={() => setInputs({ loadSize: "", detergentType: "", detergentConcentration: "", waterHardness: "" })}
            className="flex-1 h-11"
            aria-label="Reset inputs"
          >
            <RotateCcw className="mr-2 h-4 w-4" /> Reset
          </Button>
        </div>
      </Card>

      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg mt-6">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="mt-2 text-lg font-semibold text-blue-800 dark:text-blue-300">{results.label}</p>
            {results.subtext && (
              <p className="mt-1 text-sm text-blue-700 dark:text-blue-400 italic">{results.subtext}</p>
            )}
            {results.warning && (
              <p className="mt-3 text-sm text-red-700 dark:text-red-400 font-semibold flex items-center justify-center gap-2">
                <AlertTriangle className="h-4 w-4" /> {results.warning}
              </p>
            )}
            <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">{results.formulaUsed}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding the Basics</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Laundry detergent dosage is a critical factor in achieving clean clothes while preserving fabric quality and minimizing environmental impact. The amount of detergent needed depends primarily on the size of the laundry load, the type and concentration of detergent used, and the hardness of the water. Using too little detergent can result in poorly cleaned clothes, while too much can cause residue buildup and damage fabrics.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Different detergents have varying concentrations and formulations designed for specific washing machines and water conditions. For example, high-efficiency (HE) detergents are concentrated and formulated for HE machines that use less water, requiring smaller dosages. Additionally, water hardness affects detergent effectiveness, as minerals in hard water bind with detergent molecules, necessitating dosage adjustments. Understanding these factors helps optimize detergent use for cleaner, fresher laundry.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator helps you determine the precise amount of laundry detergent needed based on your load size, detergent type, concentration, and optionally, water hardness. Follow these detailed steps to get an accurate dosage recommendation:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select your <em>load size</em> from the options: small, medium, or large. This corresponds to the weight or volume of laundry you typically wash.
          </li>
          <li>
            <strong>Step 2:</strong> Choose the <em>detergent type</em> you use: liquid, powder, or pods. This affects how dosage is measured (fluid ounces or pod count).
          </li>
          <li>
            <strong>Step 3:</strong> Select the <em>detergent concentration</em>, either standard or high-efficiency (HE). HE detergents are more concentrated and require less product.
          </li>
          <li>
            <strong>Step 4 (Optional):</strong> If you know your <em>water hardness</em> level (soft, medium, or hard), select it to refine the dosage. Hard water requires more detergent for effective cleaning.
          </li>
          <li>
            <strong>Step 5:</strong> Click the <em>Calculate</em> button to see the recommended detergent dosage displayed below the inputs.
          </li>
          <li>
            <strong>Step 6:</strong> Use the dosage recommendation to measure your detergent accurately using the provided scoop, cap, or pods.
          </li>
          <li>
            <strong>Step 7:</strong> For best results, adjust dosage slightly based on soil level or washing machine instructions, but avoid excessive detergent use.
          </li>
        </ul>
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
        title: "Methodology",
        formula:
          "Dosage = Base dosage × Concentration adjustment × Water hardness adjustment (for liquid/powder detergents). Pods dosage is fixed per load size.",
        variables: [
          { symbol: "Base dosage", description: "Standard detergent amount for load size" },
          { symbol: "Concentration adjustment", description: "0.75 for HE detergents, 1 for standard" },
          { symbol: "Water hardness adjustment", description: "0.9 for soft, 1 for medium, 1.15 for hard water" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "You have a medium-sized laundry load and use a high-efficiency liquid detergent. Your water is hard. You want to know how much detergent to use for optimal cleaning.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Select 'Medium' as the load size because your laundry load weighs between 3-5 kg (6.6-11 lbs).",
          },
          {
            label: "Step 2",
            explanation: "Choose 'Liquid' as your detergent type since you use liquid detergent.",
          },
          {
            label: "Step 3",
            explanation:
              "Select 'High-Efficiency' for detergent concentration because your detergent is HE.",
          },
          {
            label: "Step 4",
            explanation: "Select 'Hard' for water hardness to account for mineral content in your water.",
          },
          {
            label: "Step 5",
            explanation:
              "Click 'Calculate' to get the recommended dosage. The calculator applies the formula: Base dosage (2.7 fl oz) × 0.75 (HE) × 1.15 (hard water) = approximately 2.3 fl oz.",
          },
        ],
        result: "You should use about 2.3 fluid ounces of your HE liquid detergent for this medium, hard water load.",
      }}
      relatedCalculators={[
        { title: "Home Paint Touch-Up Estimator", url: "/everyday-life/home-paint-touch-up", icon: "🏠" },
        { title: "Cleaning Dilution Ratio Calculator", url: "/everyday-life/cleaning-dilution-ratio", icon: "🏠" },
        { title: "Planting Calendar & Frost Date Finder", url: "/everyday-life/planting-calendar-frost-date", icon: "🌿" },
        { title: "Garden Soil/Compost Volume Calculator", url: "/everyday-life/garden-soil-compost-volume", icon: "🌿" },
        { title: "Basal Metabolic Rate (BMR) Calculator", url: "/everyday-life/bmr-calculator", icon: "💡" },
        { title: "Steps → Distance Converter", url: "/everyday-life/steps-to-distance-converter", icon: "💡" },
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