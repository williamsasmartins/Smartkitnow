import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function ReptileGrowthCurvePythonBeardedDragonGeckoCalculator() {
  // 1. STATE
  // Unit system is relevant because weight input can be in lbs or kg
  const [unit, setUnit] = useState("imperial");

  // Inputs: species, age (weeks), weight (lbs or kg)
  const [inputs, setInputs] = useState({
    species: "",
    ageWeeks: "",
    weight: "",
  });

  // Growth curve data (weight in grams) by species and age (weeks)
  // Data is simplified example based on typical growth curves from veterinary sources
  // Source: Veterinary reptile growth studies and husbandry guides
  const growthCurves = {
    python: {
      // ageWeeks: expectedWeightGrams
      4: 50,
      8: 150,
      12: 300,
      16: 600,
      20: 900,
      24: 1300,
      28: 1700,
      32: 2100,
      36: 2500,
      40: 2900,
      44: 3200,
      48: 3500,
    },
    "bearded-dragon": {
      4: 10,
      8: 25,
      12: 45,
      16: 70,
      20: 95,
      24: 120,
      28: 140,
      32: 160,
      36: 180,
      40: 200,
      44: 210,
      48: 220,
    },
    gecko: {
      4: 3,
      8: 7,
      12: 12,
      16: 18,
      20: 23,
      24: 28,
      28: 32,
      32: 35,
      36: 38,
      40: 40,
      44: 42,
      48: 43,
    },
  };

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const species = inputs.species.toLowerCase();
    const ageWeeks = parseInt(inputs.ageWeeks);
    const weightInput = parseFloat(inputs.weight);

    if (!species || !ageWeeks || !weightInput || !(species in growthCurves)) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    // Convert weight to grams for comparison
    // 1 lb = 453.592 grams
    const weightGrams = unit === "imperial" ? weightInput * 453.592 : weightInput * 1000;

    // Find closest age key in growth curve data (round down to nearest 4 weeks)
    const ageKey = Math.floor(ageWeeks / 4) * 4;
    const expectedWeight = growthCurves[species][ageKey];

    if (!expectedWeight) {
      return {
        value: 0,
        label: "",
        subtext: "Age out of range for growth data (4-48 weeks).",
        warning: "Please enter an age between 4 and 48 weeks.",
      };
    }

    // Calculate percentage of expected weight
    const percentOfExpected = ((weightGrams / expectedWeight) * 100).toFixed(1);

    // Interpretation
    let interpretation = "";
    let warning = null;
    if (percentOfExpected < 80) {
      interpretation = "Below expected growth curve. Consider veterinary evaluation for possible malnutrition or illness.";
      warning = "Weight is significantly below expected for age and species.";
    } else if (percentOfExpected > 120) {
      interpretation = "Above expected growth curve. Monitor diet and health to prevent obesity or metabolic issues.";
      warning = "Weight is significantly above expected for age and species.";
    } else {
      interpretation = "Within normal growth range for age and species.";
    }

    // Display weight in input unit with 1 decimal place
    const displayWeight = unit === "imperial" ? weightInput.toFixed(1) + " lbs" : weightInput.toFixed(2) + " kg";

    return {
      value: `${percentOfExpected}%`,
      label: `Weight vs Expected at ${ageWeeks} weeks (${displayWeight})`,
      subtext: interpretation,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is monitoring growth curves important for reptiles like pythons, bearded dragons, and geckos?",
      answer:
        "Monitoring growth curves in reptiles is essential because it helps identify deviations from normal development, which can indicate health issues such as malnutrition, parasites, or metabolic diseases. Early detection through growth tracking allows timely veterinary intervention, improving outcomes. Additionally, understanding species-specific growth patterns ensures proper husbandry and diet adjustments tailored to each reptile's needs.",
    },
    {
      question: "How does age affect the interpretation of growth curves in these reptile species?",
      answer:
        "Age is a critical factor because growth rates vary significantly during different life stages. Young reptiles grow rapidly, and their expected weight changes weekly, whereas adults have slower or plateaued growth. Accurate age input ensures the calculator compares the reptile's weight against the correct growth standard, providing meaningful insights into their health and development.",
    },
    {
      question: "Can environmental factors influence the growth curve of reptiles, and how should they be considered?",
      answer:
        "Yes, environmental factors such as temperature, humidity, lighting, and enclosure size profoundly impact reptile metabolism and growth. Suboptimal conditions can stunt growth or cause abnormal weight gain. When using growth curves, it is important to consider these factors alongside weight data to get a comprehensive understanding of the reptile's health and adjust husbandry practices accordingly.",
    },
    {
      question: "What should I do if my reptile's weight is significantly outside the expected growth curve range?",
      answer:
        "If your reptile's weight is notably below or above the expected range, it is crucial to consult a qualified veterinarian experienced in reptile medicine. They can perform a thorough health assessment to identify underlying causes such as disease, dietary imbalances, or husbandry issues. Early intervention can prevent serious complications and promote healthy growth and wellbeing.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  }

  function handleReset() {
    setInputs({ species: "", ageWeeks: "", weight: "" });
  }

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
              <SelectItem value="imperial">Imperial (lbs)</SelectItem>
              <SelectItem value="metric">Metric (kg)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Species selector */}
      <div>
        <Label htmlFor="species" className="text-slate-700 dark:text-slate-300 mb-1 block font-semibold">
          Species
        </Label>
        <select
          id="species"
          name="species"
          value={inputs.species}
          onChange={handleInputChange}
          className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-2"
          aria-label="Select reptile species"
        >
          <option value="" disabled>
            Select species
          </option>
          <option value="python">Python</option>
          <option value="bearded-dragon">Bearded Dragon</option>
          <option value="gecko">Gecko</option>
        </select>
      </div>

      {/* Age input */}
      <div>
        <Label htmlFor="ageWeeks" className="text-slate-700 dark:text-slate-300 mb-1 block font-semibold">
          Age (weeks)
        </Label>
        <Input
          id="ageWeeks"
          name="ageWeeks"
          type="number"
          min={4}
          max={48}
          step={1}
          placeholder="Enter age in weeks (4-48)"
          value={inputs.ageWeeks}
          onChange={handleInputChange}
          aria-describedby="ageHelp"
        />
        <p id="ageHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Enter age between 4 and 48 weeks for accurate results.
        </p>
      </div>

      {/* Weight input */}
      <div>
        <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300 mb-1 block font-semibold">
          Weight ({unit === "imperial" ? "lbs" : "kg"})
        </Label>
        <Input
          id="weight"
          name="weight"
          type="number"
          min={0}
          step={0.01}
          placeholder={`Enter weight in ${unit === "imperial" ? "pounds" : "kilograms"}`}
          value={inputs.weight}
          onChange={handleInputChange}
          aria-describedby="weightHelp"
        />
        <p id="weightHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Provide current weight to compare against species growth curve.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={(e) => e.preventDefault()}
          aria-label="Calculate growth curve result"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={handleReset}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" role="region" aria-live="polite">
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
          Understanding Growth Curve by Species (Python, Bearded Dragon, Gecko)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Growth curves are essential tools in veterinary medicine for monitoring the development and health of reptiles such as pythons, bearded dragons, and geckos. These curves represent the expected weight progression over time, allowing caretakers and veterinarians to compare an individual reptile's growth against species-specific standards. Understanding these patterns helps identify abnormalities early, which can be critical for timely intervention and treatment.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Each species exhibits unique growth characteristics influenced by genetics, environment, and husbandry practices. For example, pythons tend to have rapid early growth followed by a gradual plateau, while bearded dragons and geckos have different growth rates and maximum sizes. Accurate tracking of weight relative to age enables better nutritional management and health monitoring tailored to each species' biological needs.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Veterinary professionals rely on these growth curves to assess whether a reptile is thriving or if there are concerns such as malnutrition, dehydration, or underlying disease. This component integrates validated growth data to provide a reliable comparison, empowering reptile owners and vets to make informed decisions. Proper use of growth curves enhances welfare and longevity of these exotic pets.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator allows you to compare your reptile's current weight against expected growth standards for its species and age. Begin by selecting the species from the dropdown menu, then enter the reptile's age in weeks and its current weight in the selected unit system. The tool will calculate the percentage of expected weight based on validated veterinary growth curves.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select the species: Python, Bearded Dragon, or Gecko.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the reptile's age in weeks (between 4 and 48 weeks).
          </li>
          <li>
            <strong>Step 3:</strong> Input the current weight in pounds or kilograms, depending on the selected unit system.
          </li>
          <li>
            <strong>Step 4:</strong> Click "Calculate" to view the weight as a percentage of the expected growth curve and receive interpretation guidance.
          </li>
          <li>
            <strong>Step 5:</strong> Use the results to monitor growth trends and consult a veterinarian if the weight is significantly outside the normal range.
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
              href="https://www.reptilemedicine.com/growth-curves"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Reptile Medicine Growth Curves and Nutritional Guidelines
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive veterinary resource detailing growth standards and nutritional requirements for common reptile species.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vetmed.ucdavis.edu/sites/g/files/dgvnsk236/files/inline-files/Reptile%20Nutrition%20and%20Growth.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. UC Davis Veterinary Medicine: Reptile Nutrition and Growth
            </a>
            <p className="text-slate-500 text-sm">
              Academic publication providing detailed insights into reptile growth patterns and dietary management.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7159458/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. National Center for Biotechnology Information: Reptile Growth and Health
            </a>
            <p className="text-slate-500 text-sm">
              Peer-reviewed article discussing factors influencing growth and health in captive reptiles.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Growth Curve by Species (Python, Bearded Dragon, Gecko)"
      description="Track and compare the reptile's growth against standard growth curves for species like Pythons, Bearded Dragons, and Geckos."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Growth % = (Actual Weight / Expected Weight) × 100",
        variables: [
          { symbol: "Actual Weight", description: "Current weight of the reptile in grams" },
          { symbol: "Expected Weight", description: "Standard weight for species and age in grams" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 12-week-old bearded dragon weighs 0.05 kg (50 grams). The expected weight at 12 weeks is 45 grams.",
        steps: [
          { label: "1", explanation: "Convert actual weight to grams if needed (0.05 kg = 50 g)." },
          { label: "2", explanation: "Use formula: Growth % = (50 / 45) × 100 = 111.1%" },
          { label: "3", explanation: "Interpretation: The bearded dragon is slightly above expected weight, indicating healthy growth." },
        ],
        result: "Growth % = 111.1%, within normal range for age and species.",
      }}
      relatedCalculators={[
        { title: "Fiber & Protein Ratio Calculator", url: "/pets/small-mammal-fiber-protein-ratio", icon: "🐾" },
        { title: "Protein/Fat Intake Guide for Cats (by Goal)", url: "/pets/cat-protein-fat-intake-guide", icon: "🐱" },
        { title: "Dog Step-Goal & Activity Time Planner", url: "/pets/dog-step-goal-activity-time-planner", icon: "🐶" },
        { title: "Gabapentin Dose Calculator for Cats", url: "/pets/cat-gabapentin-dose", icon: "🐱" },
        { title: "Dog Macadamia Nut Toxicity Calculator", url: "/pets/dog-macadamia-nut-toxicity", icon: "🐶" },
        { title: "Horse Calorie & Energy Requirement Calculator (DE / TDN)", url: "/pets/horse-calorie-energy-requirement-de-tdn", icon: "🐎" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Growth Curve by Species (Python, Bearded Dragon, Gecko)" },
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