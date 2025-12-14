import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

type SpeciesOption = "Bearded Dragon" | "Leopard Gecko" | "Corn Snake" | "Ball Python";

const speciesAgeFeedingRatios: Record<
  SpeciesOption,
  { juvenile: number; adult: number }
> = {
  "Bearded Dragon": { juvenile: 0.10, adult: 0.05 }, // % of body weight per day
  "Leopard Gecko": { juvenile: 0.15, adult: 0.07 },
  "Corn Snake": { juvenile: 0.08, adult: 0.04 },
  "Ball Python": { juvenile: 0.06, adult: 0.03 },
};

export default function ReptileDailyFeedingRatioSpeciesAgeCalculator() {
  // 1. STATE
  // Unit system: Imperial (lbs) or Metric (kg)
  const [unit, setUnit] = useState<"imperial" | "metric">("imperial");

  // Inputs: species, age category, weight
  const [inputs, setInputs] = useState<{
    species?: SpeciesOption;
    ageCategory?: "juvenile" | "adult";
    weight?: string;
  }>({});

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    if (
      !inputs.species ||
      !inputs.ageCategory ||
      !inputs.weight ||
      Number(inputs.weight) <= 0
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    const weightNum = parseFloat(inputs.weight);
    if (isNaN(weightNum) || weightNum <= 0) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: "Please enter a valid positive number for weight.",
      };
    }

    // Convert weight to kg internally if imperial
    const weightKg = unit === "imperial" ? weightNum / 2.20462 : weightNum;

    // Get feeding ratio for species and age
    const ratio = speciesAgeFeedingRatios[inputs.species][inputs.ageCategory];

    // Daily feeding amount in grams = ratio * weightKg * 1000
    const dailyFeedingGrams = ratio * weightKg * 1000;

    // Format result depending on unit preference
    let displayValue = "";
    let displayLabel = "";
    if (unit === "imperial") {
      // Convert grams to ounces (1 oz = 28.3495 g)
      const ounces = dailyFeedingGrams / 28.3495;
      displayValue = ounces.toFixed(2);
      displayLabel = "Daily Feeding Amount (oz)";
    } else {
      displayValue = dailyFeedingGrams.toFixed(1);
      displayLabel = "Daily Feeding Amount (g)";
    }

    return {
      value: displayValue,
      label: displayLabel,
      subtext: `Based on a ${inputs.ageCategory} ${inputs.species} weighing ${weightNum} ${
        unit === "imperial" ? "lbs" : "kg"
      }.`,
      warning: null,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why does the daily feeding ratio vary by species and age?",
      answer:
        "Different reptile species have unique metabolic rates and dietary needs that change as they grow. Juveniles generally require a higher percentage of their body weight in food to support rapid growth and development, while adults need less to maintain their body condition. Understanding these differences ensures proper nutrition and prevents overfeeding or underfeeding, which can lead to health issues.",
    },
    {
      question: "How is the daily feeding ratio calculated for reptiles?",
      answer:
        "The daily feeding ratio is typically expressed as a percentage of the reptile’s body weight, adjusted for species-specific metabolism and age. This percentage is multiplied by the animal’s weight to estimate the amount of food required daily. This method helps standardize feeding recommendations across different sizes and species, ensuring balanced nutrition.",
    },
    {
      question: "Can I feed my reptile the same amount every day regardless of age?",
      answer:
        "Feeding the same amount daily without considering age can lead to nutritional imbalances. Juvenile reptiles need more frequent and larger feedings relative to their size to support growth, whereas adults require maintenance levels to avoid obesity. Adjusting feeding amounts based on age helps maintain optimal health and prevents metabolic disorders.",
    },
    {
      question: "What should I do if my reptile refuses the calculated feeding amount?",
      answer:
        "If your reptile refuses the recommended feeding amount, it’s important to observe its behavior and health closely. Appetite can vary due to stress, environmental factors, or illness. Consult a veterinarian to rule out health problems and consider adjusting feeding frequency or prey type to encourage eating while ensuring nutritional needs are met.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Unit Selector */}
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

      {/* Species Selector */}
      <div className="space-y-2">
        <Label htmlFor="species" className="text-slate-700 dark:text-slate-300">
          Species
        </Label>
        <Select
          id="species"
          value={inputs.species}
          onValueChange={(value) =>
            setInputs((prev) => ({ ...prev, species: value as SpeciesOption }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select species" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(speciesAgeFeedingRatios).map((spec) => (
              <SelectItem key={spec} value={spec}>
                {spec}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Age Category Selector */}
      <div className="space-y-2">
        <Label htmlFor="ageCategory" className="text-slate-700 dark:text-slate-300">
          Age Category
        </Label>
        <Select
          id="ageCategory"
          value={inputs.ageCategory}
          onValueChange={(value) =>
            setInputs((prev) => ({
              ...prev,
              ageCategory: value as "juvenile" | "adult",
            }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select age category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="juvenile">Juvenile</SelectItem>
            <SelectItem value="adult">Adult</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Weight Input */}
      <div className="space-y-2">
        <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
          Weight ({unit === "imperial" ? "lbs" : "kg"})
        </Label>
        <Input
          id="weight"
          type="number"
          min={0}
          step="any"
          placeholder={`Enter weight in ${unit === "imperial" ? "lbs" : "kg"}`}
          value={inputs.weight ?? ""}
          onChange={(e) =>
            setInputs((prev) => ({ ...prev, weight: e.target.value }))
          }
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No special action needed, calculation is reactive
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({})}
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
          Understanding Daily Feeding Ratio (by Species & Age)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The daily feeding ratio is a critical metric used in reptile husbandry to
          determine the appropriate amount of food an animal requires based on its
          species and age. Different reptile species have varying metabolic rates,
          digestive efficiencies, and nutritional needs, which evolve as they mature.
          Juvenile reptiles typically require a higher percentage of their body weight
          in food to support rapid growth and development, whereas adults need less
          to maintain their health and energy balance.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This ratio is expressed as a percentage of the reptile’s body weight and
          helps caretakers provide balanced nutrition without overfeeding or
          underfeeding. Overfeeding can lead to obesity and related health problems,
          while underfeeding may cause malnutrition and stunted growth. By tailoring
          feeding amounts to species-specific and age-specific requirements, owners
          can optimize their pet’s wellbeing and longevity.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Additionally, understanding these feeding ratios supports better dietary
          planning, ensuring that reptiles receive the right balance of prey items,
          vegetables, or supplements as needed. This knowledge is essential for both
          novice and experienced reptile keepers aiming to provide high-quality care
          aligned with veterinary best practices.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator estimates the daily feeding amount for your reptile based
          on its species, age category, and weight. Begin by selecting the species
          from the dropdown menu, then choose whether your reptile is juvenile or
          adult. Enter the current weight of your reptile in the selected unit system
          (pounds or kilograms).
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select the reptile species from the available
            options.
          </li>
          <li>
            <strong>Step 2:</strong> Choose the age category that best describes your
            reptile’s developmental stage.
          </li>
          <li>
            <strong>Step 3:</strong> Input the weight of your reptile accurately.
          </li>
          <li>
            <strong>Step 4:</strong> Click “Calculate” to view the recommended daily
            feeding amount.
          </li>
          <li>
            <strong>Step 5:</strong> Use the result as a guideline to plan your
            reptile’s feeding schedule and portion sizes.
          </li>
        </ul>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Frequently Asked Questions
        </h2>
        <ul className="space-y-6">
          {faqs.map((item, i) => (
            <li
              key={i}
              className="border-b border-slate-200 dark:border-slate-800 pb-4 last:border-0"
            >
              <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-2">
                {item.question}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.answer}
              </p>
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
              href="https://www.vetmed.ucdavis.edu/clinical-sciences/clinical-services/exotic-animal-medicine"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. UC Davis Veterinary Medicine - Exotic Animal Medicine
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive resource on reptile nutrition and husbandry practices
              provided by a leading veterinary institution.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6073407/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Nutritional Requirements of Reptiles - NCBI PMC Article
            </a>
            <p className="text-slate-500 text-sm">
              Peer-reviewed article detailing species-specific dietary needs and
              feeding strategies for captive reptiles.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aav.org/page/ExoticPetNutrition"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. American Association of Veterinary Nutrition - Exotic Pet Nutrition
            </a>
            <p className="text-slate-500 text-sm">
              Guidelines and best practices for feeding exotic pets, including reptiles,
              emphasizing age and species considerations.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Daily Feeding Ratio (by Species & Age)"
      description="Determine the optimal feeding frequency and ratio of prey/vegetables based on the reptile's species and age."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Daily Feeding Amount = Feeding Ratio × Body Weight",
        variables: [
          {
            symbol: "Feeding Ratio",
            description:
              "Species- and age-specific percentage of body weight to feed daily",
          },
          { symbol: "Body Weight", description: "Weight of the reptile in kg or lbs" },
          {
            symbol: "Daily Feeding Amount",
            description: "Amount of food to feed daily in grams or ounces",
          },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A juvenile Bearded Dragon weighing 1.5 lbs requires calculation of daily feeding amount.",
        steps: [
          {
            label: "1",
            explanation:
              "Identify feeding ratio for juvenile Bearded Dragon: 10% (0.10) of body weight.",
          },
          {
            label: "2",
            explanation:
              "Convert weight to kg: 1.5 lbs ÷ 2.20462 = 0.68 kg approximately.",
          },
          {
            label: "3",
            explanation:
              "Calculate daily feeding amount: 0.10 × 0.68 kg = 0.068 kg = 68 grams.",
          },
        ],
        result:
          "Feed approximately 68 grams (2.4 ounces) of appropriate food daily to the juvenile Bearded Dragon.",
      }}
      relatedCalculators={[
        {
          title: "Dog Walking Calories Burned Calculator",
          url: "/pets/dog-walking-calories-burned",
          icon: "🐶",
        },
        {
          title: "Heavy Metal (Lead/Zinc) Exposure Risk",
          url: "/pets/bird-heavy-metal-exposure-risk",
          icon: "🐶",
        },
        {
          title: "Safe Vegetables & Fruits Portion Calculator",
          url: "/pets/small-mammal-safe-vegetables-fruits-portion",
          icon: "🐱",
        },
        {
          title: "Dewormer Dose Calculator (by Drug Class & Weight)",
          url: "/pets/horse-dewormer-dose-calculator",
          icon: "🍖",
        },
        {
          title: "Horse Water Intake by Temperature & Weight",
          url: "/pets/horse-water-intake-temperature-weight",
          icon: "🐎",
        },
        {
          title: "Feeder Insect Gut-Loading Ratio",
          url: "/pets/reptile-feeder-insect-gut-loading-ratio",
          icon: "💧",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Daily Feeding Ratio (by Species & Age)" },
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