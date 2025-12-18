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

export default function LaundryDetergentDosageCalculator() {
  const [inputs, setInputs] = useState({
    loadSize: "",
    detergentType: "",
    waterHardness: "",
    soilLevel: "",
  });
  const handleInputChange = useCallback((n, v) => setInputs(p => ({ ...p, [n]: v })), []);

  /*
   * Dosage logic:
   * Base dosage (ml) depends on load size:
   * - Small (2-3 kg): 30 ml
   * - Medium (4-5 kg): 50 ml
   * - Large (6-7 kg): 70 ml
   * - Extra Large (8+ kg): 90 ml
   *
   * Adjust dosage based on detergent type:
   * - Liquid: base dosage (no change)
   * - Powder: +10% (powder tends to be less concentrated)
   * - Pods: fixed dosage (1 pod per load regardless of size, but we show ml equivalent)
   *
   * Adjust dosage based on water hardness:
   * - Soft: -10% dosage (less detergent needed)
   * - Medium: no change
   * - Hard: +20% dosage (more detergent needed)
   *
   * Adjust dosage based on soil level:
   * - Light: -10%
   * - Normal: no change
   * - Heavy: +25%
   *
   * Pods dosage is fixed at 1 pod, equivalent to 50 ml detergent.
   */

  const results = useMemo(() => {
    const { loadSize, detergentType, waterHardness, soilLevel } = inputs;

    if (!loadSize || !detergentType || !waterHardness || !soilLevel) {
      return { value: "", label: "", subtext: "", warning: null, formulaUsed: "" };
    }

    // Base dosage by load size in ml
    let baseDosageMl = 0;
    switch (loadSize) {
      case "small":
        baseDosageMl = 30;
        break;
      case "medium":
        baseDosageMl = 50;
        break;
      case "large":
        baseDosageMl = 70;
        break;
      case "extraLarge":
        baseDosageMl = 90;
        break;
      default:
        baseDosageMl = 50;
    }

    // Detergent type adjustment
    let typeMultiplier = 1;
    let podEquivalent = false;
    if (detergentType === "liquid") {
      typeMultiplier = 1;
    } else if (detergentType === "powder") {
      typeMultiplier = 1.1; // +10%
    } else if (detergentType === "pods") {
      podEquivalent = true;
      // Pods fixed dosage 1 pod = 50 ml equivalent
    }

    // Water hardness adjustment
    let hardnessMultiplier = 1;
    if (waterHardness === "soft") {
      hardnessMultiplier = 0.9; // -10%
    } else if (waterHardness === "medium") {
      hardnessMultiplier = 1;
    } else if (waterHardness === "hard") {
      hardnessMultiplier = 1.2; // +20%
    }

    // Soil level adjustment
    let soilMultiplier = 1;
    if (soilLevel === "light") {
      soilMultiplier = 0.9; // -10%
    } else if (soilLevel === "normal") {
      soilMultiplier = 1;
    } else if (soilLevel === "heavy") {
      soilMultiplier = 1.25; // +25%
    }

    if (podEquivalent) {
      // Pods fixed dosage
      return {
        value: "1 Pod",
        label: "Recommended Dosage",
        subtext:
          "Pods are pre-measured for convenience. Use one pod per load regardless of size. Equivalent to approximately 50 ml of detergent.",
        warning: null,
        formulaUsed:
          "Fixed dosage: 1 pod per load (approx. 50 ml equivalent). Adjustments not applicable.",
      };
    }

    // Calculate final dosage
    let dosage = baseDosageMl * typeMultiplier * hardnessMultiplier * soilMultiplier;

    // Round to nearest 1 ml
    dosage = Math.round(dosage);

    // Warning if dosage is unusually high or low
    let warning = null;
    if (dosage &lt; 20) {
      warning = "Dosage is quite low; ensure your detergent is concentrated enough for effective cleaning.";
    } else if (dosage &gt; 100) {
      warning = "Dosage is high; avoid overdosing to prevent residue buildup and fabric damage.";
    }

    return {
      value: `${dosage} ml`,
      label: "Recommended Dosage",
      subtext:
        "This dosage is tailored to your load size, detergent type, water hardness, and soil level for optimal cleaning and fabric care.",
      warning,
      formulaUsed:
        "Dosage = Base Dosage × Detergent Type Multiplier × Water Hardness Multiplier × Soil Level Multiplier",
    };
  }, [inputs]);

  // RICH FAQs
  const faqs = [
    {
      question: "Why does water hardness affect laundry detergent dosage?",
      answer:
        "Water hardness refers to the concentration of minerals like calcium and magnesium in your water supply. Hard water reduces the effectiveness of detergents because these minerals bind with the detergent molecules, preventing them from properly cleaning fabrics. Therefore, in hard water areas, increasing detergent dosage compensates for this reduced efficiency, ensuring your clothes come out clean. Conversely, in soft water areas, less detergent is needed because the detergent can work more effectively without interference from minerals."
    },
    {
      question: "How does soil level influence the amount of detergent I should use?",
      answer:
        "The soil level indicates how dirty your laundry is before washing. Lightly soiled clothes require less detergent because there are fewer stains and residues to remove. Normal soil levels correspond to everyday wear and require standard detergent amounts. Heavily soiled laundry, such as sportswear or work clothes, demands more detergent to break down tough stains and grime effectively. Adjusting detergent dosage based on soil level helps optimize cleaning performance while avoiding waste or fabric damage."
    },
    {
      question: "Are laundry pods always the best choice for detergent dosage?",
      answer:
        "Laundry pods offer convenience by providing pre-measured detergent doses, eliminating guesswork. However, they are typically designed for average load sizes and soil levels. For very small or very large loads, or heavily soiled clothes, pods may not provide the optimal amount of detergent. Additionally, pods can be more expensive per wash compared to liquid or powder detergents. While pods simplify dosing and reduce overdosing risks, understanding your laundry needs can help you decide if pods or adjustable detergents better suit your washing habits."
    },
    {
      question: "What are the risks of using too much or too little detergent?",
      answer:
        "Using too much detergent can lead to residue buildup on clothes and inside your washing machine, causing odors, fabric stiffness, and potential skin irritation. It also wastes money and harms the environment due to excess chemicals entering wastewater. On the other hand, using too little detergent may result in insufficient cleaning, leaving stains, odors, and bacteria on your clothes. Proper dosing ensures effective cleaning, fabric longevity, and environmental responsibility, making it essential to follow recommended detergent amounts based on your laundry conditions."
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="loadSize" className="mb-1 flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
            Load Size <Scale className="inline-block h-4 w-4 text-blue-600" />
          </Label>
          <Select value={inputs.loadSize} onValueChange={v => handleInputChange("loadSize", v)} id="loadSize">
            <SelectTrigger>
              <SelectValue placeholder="Select load size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small (2-3 kg)</SelectItem>
              <SelectItem value="medium">Medium (4-5 kg)</SelectItem>
              <SelectItem value="large">Large (6-7 kg)</SelectItem>
              <SelectItem value="extraLarge">Extra Large (8+ kg)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="detergentType" className="mb-1 flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
            Detergent Type <Droplets className="inline-block h-4 w-4 text-blue-600" />
          </Label>
          <Select value={inputs.detergentType} onValueChange={v => handleInputChange("detergentType", v)} id="detergentType">
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
          <Label htmlFor="waterHardness" className="mb-1 flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
            Water Hardness <Waves className="inline-block h-4 w-4 text-blue-600" />
          </Label>
          <Select value={inputs.waterHardness} onValueChange={v => handleInputChange("waterHardness", v)} id="waterHardness">
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

        <div>
          <Label htmlFor="soilLevel" className="mb-1 flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
            Soil Level <Paintbrush className="inline-block h-4 w-4 text-blue-600" />
          </Label>
          <Select value={inputs.soilLevel} onValueChange={v => handleInputChange("soilLevel", v)} id="soilLevel">
            <SelectTrigger>
              <SelectValue placeholder="Select soil level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="heavy">Heavy</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {}}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          aria-label="Calculate detergent dosage"
        >
          <Home className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ loadSize: "", detergentType: "", waterHardness: "", soilLevel: "" })}
          className="flex-1 h-11"
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
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
              <p className="mt-2 text-lg font-medium text-blue-800 dark:text-blue-300">{results.label}</p>
              <p className="mt-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{results.subtext}</p>
              {results.warning && (
                <p className="mt-4 text-sm text-red-700 dark:text-red-400 font-semibold flex items-center justify-center gap-2">
                  <AlertTriangle className="h-5 w-5" /> {results.warning}
                </p>
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding Laundry Detergent Dosage by Load Size</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Laundry detergent dosage is a critical factor in achieving clean, fresh-smelling clothes while preserving fabric quality and minimizing environmental impact. The amount of detergent required depends on several variables, including the size of the laundry load, the type of detergent used, the hardness of the water, and the level of soil or dirt on the clothes. Using too little detergent can result in ineffective cleaning, leaving stains and odors behind, whereas overdosing can cause residue buildup, fabric damage, and unnecessary chemical waste.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Load size is one of the primary determinants of detergent dosage. Smaller loads require less detergent, while larger loads need more to ensure all fabrics are properly cleaned. However, the relationship is not always linear because other factors such as detergent concentration and water quality influence how much detergent is effective. Understanding these nuances helps you optimize detergent use, saving money and reducing environmental footprint without compromising laundry results.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Detergent types vary widely in concentration and formulation. Liquid detergents are typically concentrated and easy to measure, powders may require slightly more due to their composition, and pods offer pre-measured convenience but may not be ideal for all load sizes or soil levels. Water hardness affects detergent performance because minerals in hard water bind with detergent molecules, reducing their cleaning power. Adjusting dosage based on water hardness ensures effective stain removal and fabric care.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Finally, soil level or how dirty your clothes are before washing influences how much detergent is necessary. Lightly soiled clothes need less detergent, while heavily soiled items require more to break down tough stains and grime. By considering all these factors together, you can determine the optimal detergent dosage for each load, ensuring your laundry is clean, your fabrics are protected, and you avoid wasting detergent or harming the environment.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Step-by-Step Guide</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Calculating the correct laundry detergent dosage involves assessing your laundry load and adjusting for various factors to ensure optimal cleaning. Begin by determining the size of your laundry load, which is typically measured in kilograms or pounds. Most washing machines have load size recommendations, so use these as a guide to classify your load as small, medium, large, or extra large. This classification forms the baseline for your detergent dosage.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300 mb-4">
          <li>
            <strong>Step 1:</strong> Identify your load size by weighing your laundry or estimating based on your washing machine’s capacity. For example, a small load might be 2-3 kg, while an extra-large load exceeds 8 kg.
          </li>
          <li>
            <strong>Step 2:</strong> Choose your detergent type. Liquid detergents are usually concentrated, powders may require slightly more, and pods are pre-measured for convenience but may not suit all load sizes.
          </li>
          <li>
            <strong>Step 3:</strong> Assess your water hardness. If you live in an area with hard water, you will need to increase detergent dosage to compensate for mineral interference. Soft water requires less detergent.
          </li>
          <li>
            <strong>Step 4:</strong> Evaluate the soil level of your laundry. Lightly soiled clothes need less detergent, while heavily soiled items require more to effectively remove dirt and stains.
          </li>
          <li>
            <strong>Step 5:</strong> Use the calculator to input these factors. The tool will compute the recommended detergent dosage by applying multipliers for detergent type, water hardness, and soil level to the base dosage determined by load size.
          </li>
          <li>
            <strong>Step 6:</strong> Measure the detergent accordingly using a measuring cup or the detergent’s dosing cap. For pods, use one pod per load as recommended.
          </li>
          <li>
            <strong>Step 7:</strong> Add the detergent to your washing machine’s detergent compartment or directly into the drum as per the detergent manufacturer’s instructions.
          </li>
          <li>
            <strong>Step 8:</strong> Run your washing machine on the appropriate cycle for your laundry type and soil level.
          </li>
        </ul>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Following these steps ensures that you use the right amount of detergent for each wash, optimizing cleaning performance, protecting your fabrics, and minimizing environmental impact.
        </p>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Professional Tips & Safety</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To maximize laundry results and maintain safety, always read and follow the detergent manufacturer’s instructions carefully. Use the recommended dosage to avoid fabric damage and residue buildup inside your washing machine. Overdosing detergent can cause excessive suds, which may lead to poor rinsing and mechanical issues in your machine. Under-dosing, on the other hand, can leave clothes dirty and cause odors.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          When handling detergents, especially powders and liquids, keep them out of reach of children and pets to prevent accidental ingestion or skin contact. Wear gloves if you have sensitive skin or allergies. Store detergents in a cool, dry place away from direct sunlight to preserve their effectiveness. For pods, avoid touching them with wet hands as they can dissolve prematurely, and never puncture or cut them.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Consider using eco-friendly detergents that are biodegradable and phosphate-free to reduce environmental impact. Regularly clean your washing machine to prevent buildup of detergent residues and mold, which can affect laundry quality and machine longevity. Finally, adjust detergent dosage seasonally if needed, as water hardness and soil levels may vary with weather and activities.
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
        title: "Methodology",
        formula:
          "Dosage = Base Dosage × Detergent Type Multiplier × Water Hardness Multiplier × Soil Level Multiplier",
        variables: [
          { symbol: "Base Dosage", description: "Standard detergent amount based on load size (ml)" },
          { symbol: "Detergent Type Multiplier", description: "Adjustment factor based on detergent form (liquid, powder, pods)" },
          { symbol: "Water Hardness Multiplier", description: "Adjustment factor based on water mineral content" },
          { symbol: "Soil Level Multiplier", description: "Adjustment factor based on how dirty the laundry is" },
        ],
      }}
      example={{
        title: "Real World Example",
        scenario:
          "Imagine you have a medium-sized laundry load (4-5 kg) consisting of everyday clothes that are moderately soiled. You use a powder detergent, live in an area with hard water, and want to ensure your clothes come out clean without wasting detergent.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Identify the load size as medium, which corresponds to a base dosage of 50 ml detergent.",
          },
          {
            label: "Step 2",
            explanation:
              "Select powder detergent, which requires a 10% increase in dosage due to its formulation.",
          },
          {
            label: "Step 3",
            explanation:
              "Account for hard water by increasing the dosage by 20% to overcome mineral interference.",
          },
          {
            label: "Step 4",
            explanation:
              "Since the soil level is normal, no adjustment is needed for soil.",
          },
          {
            label: "Step 5",
            explanation:
              "Calculate the final dosage: 50 ml × 1.1 (powder) × 1.2 (hard water) × 1 (normal soil) = 66 ml.",
          },
          {
            label: "Step 6",
            explanation:
              "Measure approximately 66 ml of powder detergent for this load to achieve optimal cleaning.",
          },
        ],
        result:
          "By following these steps, you ensure your laundry is cleaned effectively without overdosing detergent, protecting your fabrics and saving money.",
      }}
      relatedCalculators={[
        { title: "Garden Soil/Compost Volume Calculator", url: "/everyday-life/garden-soil-compost-volume", icon: "🌿" },
        { title: "Body Fat Percentage Calculator", url: "/everyday-life/body-fat-percentage", icon: "💡" },
        { title: "Ice Quantity for Beverages Calculator", url: "/everyday-life/ice-quantity-beverages", icon: "💡" },
        { title: "Event Capacity Calculator", url: "/everyday-life/event-capacity-calculator", icon: "💡" },
        { title: "Square Footage Calculator", url: "/everyday-life/square-footage-calculator", icon: "💡" },
        { title: "Screen Time Budget / Pomodoro Planner", url: "/everyday-life/screen-time-pomodoro-planner", icon: "💡" },
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