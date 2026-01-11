import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import { useWeightUnitPreference } from "@/hooks/useWeightUnitPreference";
import { kgToWeight, weightToKg } from "@/lib/utils";

export default function SmallMammalHayPelletIntakeCalculator() {
  // 1. STATE
  // Default unit system is imperial (lbs)
  const { unit, setUnit } = useWeightUnitPreference();

  // Inputs: weight and desired pellet % of total dry matter intake
  const [inputs, setInputs] = useState({
    weight: "",
    pelletPercent: "",
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    const pelletPercentRaw = parseFloat(inputs.pelletPercent);

    if (
      isNaN(weightRaw) ||
      weightRaw <= 0 ||
      isNaN(pelletPercentRaw) ||
      pelletPercentRaw < 0 ||
      pelletPercentRaw > 100
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    const weightKg = weightToKg(weightRaw, unit);

    // Total dry matter intake (DMI) for small herbivores (rabbits, guinea pigs) ~ 4% of body weight (kg)
    // Hay intake = (100 - pelletPercent)% of total DMI
    // Pellet intake = pelletPercent% of total DMI
    // Output in grams and lbs for clarity

    const totalDmiGrams = weightKg * 40; // 4% = 0.04 * 1000g = 40g/kg
    const pelletIntakeGrams = (pelletPercentRaw / 100) * totalDmiGrams;
    const hayIntakeGrams = totalDmiGrams - pelletIntakeGrams;

    const hayIntakeDisplay =
      unit === "lb"
        ? kgToWeight(hayIntakeGrams / 1000, "lb").toFixed(2) + " lbs"
        : hayIntakeGrams.toFixed(1) + " g";
    const pelletIntakeDisplay =
      unit === "lb"
        ? kgToWeight(pelletIntakeGrams / 1000, "lb").toFixed(2) + " lbs"
        : pelletIntakeGrams.toFixed(1) + " g";

    return {
      value: `${hayIntakeDisplay} hay / ${pelletIntakeDisplay} pellets`,
      label: "Daily Hay & Pellet Intake",
      subtext:
        "Based on 4% of body weight dry matter intake with your selected pellet ratio.",
      warning:
        pelletPercentRaw > 50
          ? "Pellet intake above 50% may increase risk of digestive upset. Consult your veterinarian."
          : null,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is dry matter intake set at 4% of body weight for small herbivores?",
      answer:
        "Dry matter intake (DMI) at approximately 4% of body weight is a well-established nutritional guideline for small herbivores like rabbits and guinea pigs. This percentage ensures they receive adequate fiber and nutrients to maintain gut motility and overall health. Feeding below this threshold can lead to gastrointestinal stasis, while exceeding it may cause obesity or digestive issues.",
    },
    {
      question: "How does the pellet percentage affect my pet’s health?",
      answer:
        "Pellet percentage determines the proportion of concentrated feed versus fibrous hay in your pet’s diet. Higher pellet intake can provide essential vitamins and minerals but may reduce fiber consumption, which is critical for digestive health. Balancing pellets and hay helps prevent obesity, dental problems, and gastrointestinal disorders by ensuring sufficient fiber and nutrient intake.",
    },
    {
      question: "Can I use this calculator for other herbivorous small mammals?",
      answer:
        "This calculator is primarily designed for rabbits and guinea pigs, whose nutritional needs and dry matter intake percentages are well-studied. While it may provide a rough estimate for similar small herbivores, species-specific dietary requirements can vary significantly. Always consult a veterinarian familiar with your pet’s species for precise feeding recommendations.",
    },
    {
      question: "Why is it important to convert weights to kilograms internally?",
      answer:
        "Converting weights to kilograms internally standardizes calculations, as veterinary nutritional formulas are typically based on metric units. This ensures accuracy and consistency regardless of the user’s preferred unit system. It also simplifies the logic by using a single unit base, reducing errors in the final intake estimations.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Unit selector */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select value={unit} onValueChange={setUnit}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lb">Imperial (lbs)</SelectItem>
              <SelectItem value="kg">Metric (kg)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Weight ({unit === "lb" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            type="number"
            min="0"
            step="any"
            placeholder={`Enter weight in ${unit === "lb" ? "lbs" : "kg"}`}
            value={inputs.weight}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, weight: e.target.value }))
            }
          />
        </div>
        <div>
          <Label htmlFor="pelletPercent" className="text-slate-700 dark:text-slate-300">
            Pellet Percentage (% of total dry matter intake)
          </Label>
          <Input
            id="pelletPercent"
            type="number"
            min="0"
            max="100"
            step="any"
            placeholder="Enter pellet % (0-100)"
            value={inputs.pelletPercent}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, pelletPercent: e.target.value }))
            }
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating state (already handled by useMemo)
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", pelletPercent: "" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Estimated Result
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
                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 rounded-lg flex items-start gap-3 text-left">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    {results.warning}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex gap-3">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a
              vet for diagnosis.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Hay & Pellet Intake Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Hay & Pellet Intake Calculator is a specialized veterinary tool designed
          to estimate the ideal daily intake of hay and pellets for small herbivorous
          mammals such as rabbits and guinea pigs. These animals require a delicate
          balance of fibrous hay and nutrient-dense pellets to maintain optimal digestive
          health and overall well-being. This calculator uses scientifically supported
          nutritional guidelines to provide tailored feeding recommendations based on
          your pet’s weight and desired pellet proportion.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Proper fiber intake from hay is critical for promoting gut motility and
          preventing gastrointestinal stasis, a common and potentially life-threatening
          condition in small herbivores. Meanwhile, pellets supply concentrated
          nutrients, vitamins, and minerals necessary for growth, maintenance, and
          immune function. By inputting your pet’s weight and preferred pellet ratio,
          this tool calculates the corresponding daily amounts of hay and pellets,
          helping you optimize your pet’s diet for long-term health.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this calculator is straightforward and requires just two key inputs:
          your pet’s body weight and the percentage of pellets you want to include in
          their daily dry matter intake. The calculator assumes a total dry matter
          intake of approximately 4% of body weight, a standard nutritional guideline
          for rabbits and guinea pigs. Once you enter these values, the tool will
          compute the recommended daily amounts of hay and pellets in your preferred
          unit system.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select the unit system (Imperial or Metric) that
            matches how you measure your pet’s weight.
          </li>
          <li>
            <strong>Step 2:</strong> Enter your pet’s weight accurately in pounds or
            kilograms.
          </li>
          <li>
            <strong>Step 3:</strong> Specify the desired pellet percentage of the total
            dry matter intake, keeping in mind that higher pellet ratios may increase
            digestive risks.
          </li>
          <li>
            <strong>Step 4:</strong> Click “Calculate” to view the recommended daily
            hay and pellet amounts. Use the “Reset” button to clear inputs and start
            over.
          </li>
        </ul>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Frequently Asked Questions
        </h2>
        <ul className="space-y-6">
          {faqs.map((item, i) => (
            <li key={i} className="border-b border-slate-200 dark:border-slate-800 pb-4 last:border-0">
              <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-2">
                {item.question}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.answer}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Veterinary References
        </h2>
        <ul className="space-y-4">
          <li className="block">
            <a
              href="https://www.merckvetmanual.com/exotic-and-laboratory-animals/rabbits/nutrition-of-rabbits"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Merck Veterinary Manual: Nutrition of Rabbits
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive overview of dietary requirements and feeding management for
              rabbits, emphasizing fiber and pellet balance.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aav.org/Resources/Small-Mammal-Nutrition"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Association of Avian Veterinarians: Small Mammal Nutrition Guidelines
            </a>
            <p className="text-slate-500 text-sm">
              Authoritative guidelines on feeding small herbivores, including recommended
              dry matter intake percentages and pellet-to-hay ratios.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6520897/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. National Institutes of Health: Dietary Fiber and Gut Health in Rabbits
            </a>
            <p className="text-slate-500 text-sm">
              Research article detailing the critical role of fiber in maintaining rabbit
              gastrointestinal health and preventing stasis.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Hay & Pellet Intake Calculator"
      description="Calculate the ideal daily ratio and total amount of hay vs. pellets for herbivores like rabbits and guinea pigs."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Total DMI (g) = 40 × Body Weight (kg); Hay Intake = Total DMI × (1 - Pellet %)",
        variables: [
          { symbol: "Body Weight (kg)", description: "Animal's body weight in kilograms" },
          { symbol: "Pellet %", description: "Desired pellet proportion of total dry matter intake" },
          { symbol: "Total DMI", description: "Total dry matter intake in grams (4% of body weight)" },
          { symbol: "Hay Intake", description: "Daily hay intake in grams" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 4 lb (1.81 kg) rabbit with a desired pellet intake of 25% of total dry matter.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kg if needed (4 lb ≈ 1.81 kg). Calculate total dry matter intake: 40 × 1.81 = 72.4 g.",
          },
          {
            label: "2",
            explanation:
              "Calculate pellet intake: 25% of 72.4 g = 18.1 g. Calculate hay intake: 72.4 g - 18.1 g = 54.3 g.",
          },
          {
            label: "3",
            explanation:
              "Convert to preferred units if needed (e.g., grams to lbs). Result: 0.12 lbs hay and 0.04 lbs pellets daily.",
          },
        ],
        result:
          "Recommended daily intake: approximately 54.3 g hay and 18.1 g pellets, balancing fiber and nutrients.",
      }}
      relatedCalculators={[
        {
          title: "Electrolyte Powder Mixing Calculator",
          url: "/pets/horse-electrolyte-powder-mixing",
          icon: "🐾",
        },
        {
          title: "Calcium-to-Phosphorus Ratio Calculator",
          url: "/pets/reptile-calcium-to-phosphorus-ratio",
          icon: "🐶",
        },
        {
          title: "Feather Plucking & Stress Risk Index",
          url: "/pets/bird-feather-plucking-stress-risk-index",
          icon: "🐱",
        },
        {
          title: "Weight Maintenance vs. Gain/Loss Planner",
          url: "/pets/small-mammal-weight-maintenance-gain-loss-planner",
          icon: "🍖",
        },
        {
          title: "Daily Water Requirement per Weight",
          url: "/pets/bird-daily-water-requirement-per-weight",
          icon: "💉",
        },
        {
          title: "Horse Colic Risk Assessment (Feeding & Management)",
          url: "/pets/horse-colic-risk-assessment",
          icon: "🐎",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Hay & Pellet Intake Calculator" },
        { id: "how-to-use", label: "How to Use This Calculator" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "Veterinary References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}
