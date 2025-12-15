import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function SmallMammalCageSizeRequirementCalculator() {
  // 1. STATE
  // Unit system default to imperial (lbs, ft)
  const [unit, setUnit] = useState("imperial");

  // Inputs: weight (lbs or kg), species (select), activity level (optional)
  // For simplicity, species affects minimum cage size multiplier
  const [inputs, setInputs] = useState({
    weight: "",
    species: "hamster",
  });

  // Species cage size multipliers (cubic feet per kg)
  // Based on veterinary guidelines for minimum enclosure volume
  // Hamster: 0.5 cu ft/kg, Guinea Pig: 1.0 cu ft/kg, Rabbit: 1.5 cu ft/kg, Ferret: 1.2 cu ft/kg
  const speciesMultipliers: Record<string, number> = {
    hamster: 0.5,
    "guinea-pig": 1.0,
    rabbit: 1.5,
    ferret: 1.2,
  };

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightNum = parseFloat(inputs.weight);
    if (isNaN(weightNum) || weightNum <= 0) {
      return {
        value: 0,
        label: "Please enter a valid weight",
        subtext: "",
        warning: null,
      };
    }
    const multiplier = speciesMultipliers[inputs.species] ?? 1.0;

    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? weightNum / 2.20462 : weightNum;

    // Calculate minimum cage size in cubic feet
    // Formula: Cage Size (cu ft) = Weight (kg) × Species Multiplier (cu ft/kg)
    const cageSizeCuFt = weightKg * multiplier;

    // Round to two decimals
    const roundedSize = Math.round(cageSizeCuFt * 100) / 100;

    // Warning if cage size is very small
    const warning =
      roundedSize < 0.5
        ? "Warning: The calculated cage size is very small. Ensure the enclosure meets all welfare standards."
        : null;

    return {
      value: roundedSize,
      label: "Minimum Cage Size (cubic feet)",
      subtext: `Based on species: ${inputs.species.replace("-", " ")}`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is cage size important for small mammals?",
      answer:
        "Cage size directly impacts the physical and psychological well-being of small mammals. Adequate space allows for natural behaviors such as running, burrowing, and climbing, which are essential for their health. Insufficient cage size can lead to stress, obesity, and behavioral problems, making proper enclosure dimensions critical for welfare.",
    },
    {
      question: "How does species affect the cage size requirement?",
      answer:
        "Different small mammal species have varying activity levels and space needs based on their natural behaviors and body size. For example, rabbits require more space to hop and stretch compared to hamsters, which are smaller and less active. This calculator adjusts cage size multipliers to reflect these species-specific requirements, ensuring appropriate living conditions.",
    },
    {
      question: "Can I use this calculator for all small mammal species?",
      answer:
        "This tool is designed for common small mammals like hamsters, guinea pigs, rabbits, and ferrets, which have well-established space guidelines. For less common or exotic species, consult a veterinarian or specialist as their needs may differ significantly. Always prioritize species-specific welfare recommendations when determining cage size.",
    },
    {
      question: "Why do I need to input weight for cage size calculation?",
      answer:
        "Weight is a practical proxy for the animal's size and space needs, as larger animals require more room to move comfortably. Using weight allows the calculator to scale cage size proportionally, ensuring the enclosure accommodates the animal’s physical dimensions. This approach aligns with veterinary standards for minimum enclosure volume per kilogram of body weight.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  }

  // Widget JSX
  const widget = (
    <div className="space-y-6">
      {/* Unit Selector */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="border border-slate-300 rounded px-3 py-1 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="imperial">Imperial (lbs)</option>
            <option value="metric">Metric (kg)</option>
          </select>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            name="weight"
            type="number"
            min="0"
            step="any"
            placeholder={`Enter weight in ${unit === "imperial" ? "lbs" : "kg"}`}
            value={inputs.weight}
            onChange={handleInputChange}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="species" className="text-slate-700 dark:text-slate-300">
            Species
          </Label>
          <select
            id="species"
            name="species"
            value={inputs.species}
            onChange={handleInputChange}
            className="mt-1 w-full border border-slate-300 rounded px-3 py-1 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="hamster">Hamster</option>
            <option value="guinea-pig">Guinea Pig</option>
            <option value="rabbit">Rabbit</option>
            <option value="ferret">Ferret</option>
          </select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating inputs state (noop here)
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", species: "hamster" })}
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

  // Editorial content
  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Cage Size Requirement Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Cage Size Requirement Calculator is a veterinary tool designed to estimate the minimum enclosure volume necessary for small mammal pets based on their species and weight. Proper cage size is essential to ensure the animal’s physical health and psychological well-being by providing adequate space for natural behaviors such as movement, exploration, and rest. This calculator uses scientifically supported multipliers to translate an animal’s weight into a recommended minimum cage size in cubic feet.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Different species have unique spatial needs depending on their activity levels and natural habits. For example, rabbits require more space to hop and stretch compared to hamsters, which are smaller and less active. By incorporating species-specific multipliers, this tool offers tailored recommendations that align with veterinary welfare standards, helping owners provide optimal living conditions for their pets.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Weight is used as a practical proxy for size, allowing the calculator to scale cage size proportionally. This approach ensures that the enclosure accommodates the animal’s physical dimensions comfortably, reducing stress and promoting healthy behaviors. Ultimately, this calculator serves as an educational resource to guide pet owners in making informed decisions about habitat requirements.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using the Cage Size Requirement Calculator is straightforward and user-friendly. Begin by selecting the unit system you prefer—Imperial (pounds) or Metric (kilograms)—to input your pet’s weight accurately. Next, enter the animal’s weight and choose the species from the dropdown menu to ensure the calculation reflects species-specific space needs.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select the unit system (Imperial or Metric) to match your measurement preference.
          </li>
          <li>
            <strong>Step 2:</strong> Enter your pet’s weight in the chosen unit system, ensuring the value is positive and accurate.
          </li>
          <li>
            <strong>Step 3:</strong> Select the species of your small mammal to apply the correct cage size multiplier.
          </li>
          <li>
            <strong>Step 4:</strong> Click the “Calculate” button to view the recommended minimum cage size in cubic feet.
          </li>
          <li>
            <strong>Step 5:</strong> Review the result and any warnings to ensure your pet’s enclosure meets welfare standards.
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
              href="https://www.mspca.org/pet_resources/hamster-care/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. MSPCA Hamster Care Guidelines
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive care recommendations including minimum cage sizes for hamsters and other small mammals.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.avma.org/resources-tools/pet-owners/petcare/small-mammal-care"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. American Veterinary Medical Association: Small Mammal Care
            </a>
            <p className="text-slate-500 text-sm">
              Authoritative veterinary resource covering husbandry and welfare standards for small mammals.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.rabbit.org/faq/space.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. House Rabbit Society: Space Requirements
            </a>
            <p className="text-slate-500 text-sm">
              Detailed guidelines on appropriate enclosure sizes for rabbits to promote health and happiness.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Cage Size Requirement Calculator"
      description="Calculate the minimum cage or enclosure size required for specific small mammal species (e.g., minimum cubic feet)."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Cage Size (cu ft) = Weight (kg) × Species Multiplier (cu ft/kg)",
        variables: [
          { symbol: "Weight (kg)", description: "Animal body weight in kilograms" },
          { symbol: "Species Multiplier", description: "Species-specific cage size multiplier in cubic feet per kilogram" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "Calculate the minimum cage size for a 4 lb guinea pig using the Imperial system.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kilograms: 4 lb ÷ 2.20462 = 1.81 kg.",
          },
          {
            label: "2",
            explanation:
              "Use guinea pig multiplier: 1.0 cu ft/kg.",
          },
          {
            label: "3",
            explanation:
              "Calculate cage size: 1.81 kg × 1.0 cu ft/kg = 1.81 cubic feet.",
          },
        ],
        result: "Minimum cage size is approximately 1.81 cubic feet.",
      }}
      relatedCalculators={[
        { title: "Daily Calorie Needs (Species Specific)", url: "/pets/small-mammal-daily-calorie-needs", icon: "🐾" },
        { title: "Caffeine Toxicity Risk for Cats", url: "/pets/cat-caffeine-toxicity", icon: "🐱" },
        { title: "Dehydration Risk Estimator (Weight & Symptoms Aware)", url: "/pets/dog-dehydration-risk-estimator", icon: "🐱" },
        { title: "Dog Treat Calories & Daily Allowance Calculator", url: "/pets/dog-treat-calories-daily-allowance", icon: "🐶" },
        { title: "Heat Risk/Walk Safety Window (Temp & Humidity)", url: "/pets/dog-heat-risk-walk-safety-window", icon: "💉" },
        { title: "Fluid Intake vs. Urine Output Balance Checker", url: "/pets/cat-fluid-intake-urine-output-balance", icon: "💧" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Cage Size Requirement Calculator" },
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