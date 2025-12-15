import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function AquariumWaterChangeVolumePlannerCalculator() {
  // 1. STATE
  // Unit system is relevant because volume input can be in gallons or liters
  const [unit, setUnit] = useState("imperial");

  // Inputs: Current tank volume, current nitrate level, target nitrate level
  const [inputs, setInputs] = useState({
    tankVolume: "",
    currentNitrate: "",
    targetNitrate: "",
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const tankVolume = parseFloat(inputs.tankVolume);
    const currentNitrate = parseFloat(inputs.currentNitrate);
    const targetNitrate = parseFloat(inputs.targetNitrate);

    if (
      isNaN(tankVolume) ||
      isNaN(currentNitrate) ||
      isNaN(targetNitrate) ||
      tankVolume <= 0 ||
      currentNitrate <= 0 ||
      targetNitrate < 0 ||
      targetNitrate >= currentNitrate
    ) {
      return {
        value: 0,
        label: "Invalid input values",
        subtext: "Please ensure all inputs are positive and target nitrate is less than current nitrate.",
        warning: null,
      };
    }

    // Formula: Volume to change = Tank Volume * (1 - Target Nitrate / Current Nitrate)
    // This calculates the volume of water to replace to achieve the target nitrate concentration.
    const volumeChange = tankVolume * (1 - targetNitrate / currentNitrate);

    // Round to 2 decimals
    const roundedVolumeChange = Math.round(volumeChange * 100) / 100;

    return {
      value: roundedVolumeChange,
      label:
        unit === "imperial"
          ? "Gallons of water to change"
          : "Liters of water to change",
      subtext:
        "This volume will reduce nitrate concentration to your target level.",
      warning: null,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is it important to plan water change volume based on nitrate levels?",
      answer:
        "Planning water changes based on nitrate levels helps maintain a healthy aquatic environment by preventing toxic buildup. Excess nitrates can stress fish and promote harmful algae growth. By calculating the exact volume needed, you avoid unnecessary water waste and ensure optimal water quality for your aquatic pets.",
    },
    {
      question: "How does the nitrate concentration affect the volume of water to change?",
      answer:
        "The volume of water to change is directly related to the difference between current and target nitrate concentrations. A higher current nitrate level or a lower target level increases the volume needed to dilute nitrates effectively. This calculation ensures that water changes are efficient and tailored to your aquarium’s specific needs.",
    },
    {
      question: "Can I use this calculator for other water parameters besides nitrates?",
      answer:
        "While this calculator is designed for nitrate reduction, the underlying principle applies to other soluble parameters that dilute proportionally with water changes. However, some parameters may require different approaches due to chemical interactions or biological factors. Always consult veterinary or aquatic specialist advice for complex water chemistry issues.",
    },
    {
      question: "What should I do if my target nitrate level is very low or zero?",
      answer:
        "Setting a target nitrate level near zero may require very large or complete water changes, which can stress aquatic life. It’s generally safer to aim for a realistic target based on species tolerance and tank conditions. Gradual reductions with partial water changes help maintain stability and prevent sudden environmental shifts.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Unit selector */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="border rounded px-3 py-1 dark:bg-slate-800 dark:text-slate-100"
          >
            <option value="imperial">Imperial (Gallons)</option>
            <option value="metric">Metric (Liters)</option>
          </select>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="tankVolume" className="text-slate-700 dark:text-slate-300">
            Current Tank Volume ({unit === "imperial" ? "Gallons" : "Liters"})
          </Label>
          <Input
            id="tankVolume"
            type="number"
            min="0"
            step="any"
            placeholder={unit === "imperial" ? "e.g. 50" : "e.g. 190"}
            value={inputs.tankVolume}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, tankVolume: e.target.value }))
            }
          />
        </div>
        <div>
          <Label htmlFor="currentNitrate" className="text-slate-700 dark:text-slate-300">
            Current Nitrate Level (ppm)
          </Label>
          <Input
            id="currentNitrate"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 40"
            value={inputs.currentNitrate}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, currentNitrate: e.target.value }))
            }
          />
        </div>
        <div>
          <Label htmlFor="targetNitrate" className="text-slate-700 dark:text-slate-300">
            Target Nitrate Level (ppm)
          </Label>
          <Input
            id="targetNitrate"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 20"
            value={inputs.targetNitrate}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, targetNitrate: e.target.value }))
            }
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating state (already reactive)
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ tankVolume: "", currentNitrate: "", targetNitrate: "" })}
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
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">{results.label}</p>
              {results.subtext && <p className="text-sm text-slate-500 mt-2">{results.subtext}</p>}
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

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Water Change Volume Planner
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Maintaining optimal water quality is essential for the health and wellbeing of aquatic animals. One of the primary concerns in aquarium management is controlling nitrate levels, which accumulate as a byproduct of fish waste and organic decomposition. Elevated nitrates can cause stress, disease susceptibility, and poor growth in aquatic species, making regular water changes a critical maintenance task.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Water Change Volume Planner is a veterinary-grade tool designed to calculate the precise volume of water that needs to be replaced to achieve a desired reduction in nitrate concentration. By inputting your tank’s current volume and nitrate levels, along with your target nitrate concentration, this calculator provides an evidence-based recommendation to optimize water changes without unnecessary water waste or stress to aquatic life.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This approach ensures that water changes are both effective and efficient, promoting a stable and healthy aquatic environment. It also helps hobbyists and professionals alike to make informed decisions based on scientific principles rather than guesswork, ultimately supporting better animal care and sustainability in aquarium management.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this calculator is straightforward and designed to provide accurate water change volume recommendations quickly. Begin by selecting your preferred unit system—Imperial for gallons or Metric for liters—to match your aquarium setup. Then, enter the current total volume of your tank, the current nitrate concentration measured in parts per million (ppm), and your target nitrate concentration after the water change.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Measure or estimate your aquarium’s total water volume accurately.
          </li>
          <li>
            <strong>Step 2:</strong> Test your water to determine the current nitrate concentration using reliable test kits.
          </li>
          <li>
            <strong>Step 3:</strong> Decide on a safe and realistic target nitrate level based on species requirements and water quality guidelines.
          </li>
          <li>
            <strong>Step 4:</strong> Input these values into the calculator and press “Calculate” to receive the recommended volume of water to change.
          </li>
          <li>
            <strong>Step 5:</strong> Perform the water change gradually to avoid stressing your aquatic animals, and retest nitrate levels regularly.
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
              href="https://www.aquaticcommunity.com/aquariumwater/nitrate.php"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Aquatic Community: Understanding Nitrate in Aquariums
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive overview of nitrate sources, effects on aquatic life, and water change strategies to maintain healthy aquarium conditions.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vetmed.ucdavis.edu/hospital/small-animal/clinical-pathology/aquatic-animal-medicine"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. UC Davis Veterinary Medicine: Aquatic Animal Medicine
            </a>
            <p className="text-slate-500 text-sm">
              Veterinary insights into aquatic animal health, emphasizing water quality parameters and their impact on disease prevention and management.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aquariumcarebasics.com/water-changes/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Aquarium Care Basics: Water Changes and Nitrate Control
            </a>
            <p className="text-slate-500 text-sm">
              Practical guidelines for aquarium water changes, nitrate reduction, and maintaining stable aquatic environments for hobbyists and professionals.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Water Change Volume Planner"
      description="Plan the exact volume of water to be changed to achieve a target percentage reduction in nitrates or other parameters."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Volume to Change = Tank Volume × (1 - Target Nitrate / Current Nitrate)",
        variables: [
          { symbol: "Tank Volume", description: "Total volume of aquarium water" },
          { symbol: "Current Nitrate", description: "Current nitrate concentration (ppm)" },
          { symbol: "Target Nitrate", description: "Desired nitrate concentration after water change (ppm)" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "An aquarium has 50 gallons of water with a current nitrate level of 40 ppm. The target nitrate level is 20 ppm to maintain optimal fish health.",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate the fraction of water to change: 1 - (20 / 40) = 0.5, meaning 50% of the water needs to be replaced.",
          },
          {
            label: "2",
            explanation:
              "Multiply by tank volume: 50 gallons × 0.5 = 25 gallons. Therefore, changing 25 gallons will reduce nitrate to the target level.",
          },
        ],
        result: "Change 25 gallons of water to achieve the target nitrate concentration of 20 ppm.",
      }}
      relatedCalculators={[
        {
          title: "Horse Electrolyte Need Estimator (Exercise & Heat)",
          url: "/pets/horse-electrolyte-need-estimator",
          icon: "🐎",
        },
        {
          title: "Horse Colic Risk Assessment (Feeding & Management)",
          url: "/pets/horse-colic-risk-assessment",
          icon: "🐎",
        },
        {
          title: "Fluid Replacement Volume Calculator",
          url: "/pets/reptile-fluid-replacement-volume",
          icon: "🐱",
        },
        {
          title: "Hand-Feeding Formula Amount (Chicks)",
          url: "/pets/bird-hand-feeding-formula-amount-chicks",
          icon: "🍖",
        },
        {
          title: "Electrolyte Powder Mixing Calculator",
          url: "/pets/horse-electrolyte-powder-mixing",
          icon: "💉",
        },
        {
          title: "Horse Feeding Rate Calculator (Forage + Concentrate)",
          url: "/pets/horse-feeding-rate-forage-concentrate",
          icon: "🐎",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Water Change Volume Planner" },
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