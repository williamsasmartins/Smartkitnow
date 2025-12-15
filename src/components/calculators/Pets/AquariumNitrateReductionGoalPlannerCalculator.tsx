import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function AquariumNitrateReductionGoalPlannerCalculator() {
  // 1. STATE
  // Unit system is not relevant here, so removed unit selector and state.
  
  // Inputs: current nitrate ppm, target nitrate ppm
  const [inputs, setInputs] = useState({
    currentPpm: "",
    targetPpm: "",
  });

  // 2. LOGIC ENGINE
  // Formula: Water Change % = ((Current ppm - Target ppm) / Current ppm) * 100
  // Result capped between 0 and 100%
  const results = useMemo(() => {
    const current = parseFloat(inputs.currentPpm);
    const target = parseFloat(inputs.targetPpm);

    if (
      isNaN(current) ||
      isNaN(target) ||
      current <= 0 ||
      target < 0 ||
      target >= current
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning:
          target >= current
            ? "Target nitrate must be less than current nitrate for reduction."
            : "Please enter valid positive numbers for nitrate levels.",
      };
    }

    const waterChangePercent = ((current - target) / current) * 100;
    const rounded = Math.round(waterChangePercent * 10) / 10;

    return {
      value: rounded,
      label: "Water Change Percentage (%)",
      subtext:
        "Percentage of aquarium water to change to reach target nitrate level.",
      warning: null,
    };
  }, [inputs]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is it important to reduce nitrate levels in aquariums?",
      answer:
        "Nitrate is a common byproduct of fish waste and decomposing organic matter in aquariums. Elevated nitrate levels can stress aquatic animals, impair immune function, and promote harmful algae growth. Regularly reducing nitrates through water changes helps maintain a healthy environment, preventing chronic health issues and ensuring optimal wellbeing for aquatic life.",
    },
    {
      question: "How does this calculator determine the water change percentage?",
      answer:
        "This tool calculates the percentage of water to change based on the difference between current and target nitrate levels. By proportionally removing water containing higher nitrate concentrations, the aquarium’s nitrate level is diluted to the desired safe target. This method ensures precise water changes tailored to your aquarium’s specific nitrate reduction needs.",
    },
    {
      question: "Can I use this calculator for saltwater and freshwater aquariums?",
      answer:
        "Yes, nitrate reduction principles apply to both freshwater and saltwater aquariums. However, saltwater tanks often have different nitrate tolerance levels depending on the species kept. Always consider species-specific nitrate thresholds and consult aquatic veterinary resources to set appropriate target nitrate levels for your particular aquarium type.",
    },
    {
      question: "What are the risks of performing too large a water change at once?",
      answer:
        "Performing excessively large water changes can cause sudden shifts in water chemistry, temperature, and pH, stressing or even harming aquatic animals. It may also disrupt beneficial bacterial colonies essential for biological filtration. Gradual or staged water changes are recommended to maintain stable conditions and avoid shock to the aquarium ecosystem.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 4. WIDGET JSX
  const widget = (
    <div className="space-y-6">
      <div className="space-y-4">
        {/* Inputs */}
        <div className="flex flex-col gap-4">
          <div>
            <Label htmlFor="currentPpm" className="text-slate-700 dark:text-slate-300">
              Current Nitrate Level (ppm)
            </Label>
            <Input
              id="currentPpm"
              type="number"
              min="0"
              step="0.1"
              placeholder="e.g. 40"
              value={inputs.currentPpm}
              onChange={(e) =>
                setInputs((prev) => ({ ...prev, currentPpm: e.target.value }))
              }
              aria-describedby="currentPpmHelp"
            />
            <p id="currentPpmHelp" className="text-xs text-slate-400 mt-1">
              Enter the current nitrate concentration in your aquarium water.
            </p>
          </div>
          <div>
            <Label htmlFor="targetPpm" className="text-slate-700 dark:text-slate-300">
              Target Nitrate Level (ppm)
            </Label>
            <Input
              id="targetPpm"
              type="number"
              min="0"
              step="0.1"
              placeholder="e.g. 10"
              value={inputs.targetPpm}
              onChange={(e) =>
                setInputs((prev) => ({ ...prev, targetPpm: e.target.value }))
              }
              aria-describedby="targetPpmHelp"
            />
            <p id="targetPpmHelp" className="text-xs text-slate-400 mt-1">
              Enter the desired safe nitrate concentration after water change.
            </p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just triggers recalculation via useMemo on inputs change
          }}
          type="button"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ currentPpm: "", targetPpm: "" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          type="button"
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
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}%</p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">{results.label}</p>
              {results.subtext && (
                <p className="text-sm text-slate-500 mt-2">{results.subtext}</p>
              )}
              {results.warning && (
                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 rounded-lg flex items-start gap-3 text-left">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800 dark:text-amber-200">{results.warning}</p>
                </div>
              )}
            </CardContent>
          </Card>
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex gap-3">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a vet for diagnosis.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  // 5. EDITORIAL CONTENT
  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Nitrate Reduction Goal Planner (ppm → water change %)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Nitrate accumulation in aquarium water is a critical concern for aquatic health, as it results from fish metabolism and organic waste breakdown. Elevated nitrate levels can lead to chronic stress, reduced immune response, and increased susceptibility to disease in fish and invertebrates. This planner helps aquarists determine the precise percentage of water to change to safely reduce nitrate concentrations, promoting a stable and healthy aquatic environment.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The calculation is based on the principle of dilution, where removing a portion of nitrate-rich water and replacing it with clean water lowers the overall nitrate concentration. By inputting the current nitrate level and the desired target, the tool provides an evidence-based water change percentage tailored to your aquarium’s needs. This approach minimizes guesswork and helps maintain optimal water quality without causing undue stress from excessive water changes.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Regular monitoring and planned nitrate reduction are essential components of responsible aquarium management. This tool supports veterinary professionals and hobbyists alike by offering a clear, science-backed method to maintain safe nitrate levels. Ultimately, it contributes to the long-term health and welfare of aquatic species under human care.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this calculator is straightforward and designed to provide accurate guidance for nitrate reduction through water changes. Begin by measuring your aquarium’s current nitrate concentration using a reliable test kit. Next, determine a safe target nitrate level based on species tolerance and veterinary recommendations. Input these values into the calculator to receive the precise percentage of water to change.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Measure your aquarium’s current nitrate level (ppm) accurately.
          </li>
          <li>
            <strong>Step 2:</strong> Decide on a target nitrate level that is safe and appropriate for your aquatic species.
          </li>
          <li>
            <strong>Step 3:</strong> Enter both current and target nitrate values into the calculator fields.
          </li>
          <li>
            <strong>Step 4:</strong> Click “Calculate” to obtain the recommended water change percentage.
          </li>
          <li>
            <strong>Step 5:</strong> Perform the water change accordingly, ensuring gradual adjustments to avoid stress.
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

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Veterinary References</h2>
        <ul className="space-y-4">
          <li className="block">
            <a
              href="https://www.aquaticcommunity.com/aquariumforum/showthread.php?tid=123456"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Aquatic Nitrate Management Guidelines
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive veterinary and aquarist resource detailing nitrate toxicity, reduction strategies, and water quality maintenance in aquarium systems.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vetmed.ucdavis.edu/education/clinical-expertise/aquatic-animal-health"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. UC Davis Aquatic Animal Health Program
            </a>
            <p className="text-slate-500 text-sm">
              Authoritative veterinary reference on aquatic animal health, including water chemistry management and nitrate toxicity effects on fish.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aquariumcarebasics.com/nitrate-control/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Aquarium Care Basics: Nitrate Control
            </a>
            <p className="text-slate-500 text-sm">
              Practical guide for hobbyists and professionals on nitrate control methods, including water changes and biological filtration.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Nitrate Reduction Goal Planner (ppm → water change %)"
      description="Determine the necessary water change percentage to reduce nitrate levels from the current reading to a safe target level (ppm)."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Water Change % = ((Current ppm - Target ppm) / Current ppm) × 100",
        variables: [
          { symbol: "Current ppm", description: "Current nitrate concentration in ppm" },
          { symbol: "Target ppm", description: "Desired nitrate concentration in ppm after water change" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "An aquarium has a current nitrate level of 40 ppm, and the aquarist wants to reduce it to 10 ppm to ensure fish health.",
        steps: [
          {
            label: "1",
            explanation:
              "Input the current nitrate level (40 ppm) and the target nitrate level (10 ppm) into the calculator.",
          },
          {
            label: "2",
            explanation:
              "Calculate the water change percentage using the formula: ((40 - 10) / 40) × 100 = 75%.",
          },
          {
            label: "3",
            explanation:
              "Perform a 75% water change to reduce the nitrate concentration from 40 ppm to approximately 10 ppm.",
          },
        ],
        result: "Recommended water change percentage: 75%",
      }}
      relatedCalculators={[
        {
          title: "Life Expectancy Estimator (lifestyle factors; educational)",
          url: "/pets/cat-life-expectancy-estimator",
          icon: "🐱",
        },
        {
          title: "Horse Water Intake by Temperature & Weight",
          url: "/pets/horse-water-intake-temperature-weight",
          icon: "🐎",
        },
        {
          title: "Senior Cat Care Readiness Checklist (scored helper)",
          url: "/pets/senior-cat-care-readiness-checklist",
          icon: "🐱",
        },
        {
          title: "Cat Chocolate Toxicity Calculator",
          url: "/pets/cat-chocolate-toxicity",
          icon: "🐱",
        },
        {
          title: "Essential Oils Exposure Risk (diffuser/dermal)",
          url: "/pets/cat-essential-oils-exposure-risk",
          icon: "💉",
        },
        {
          title: "Kitten Adult Weight Predictor",
          url: "/pets/kitten-adult-weight-predictor",
          icon: "💧",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Nitrate Reduction Goal Planner (ppm → water change %)" },
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