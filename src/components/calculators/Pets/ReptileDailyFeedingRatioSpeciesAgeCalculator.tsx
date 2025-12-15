import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

const speciesOptions = [
  { label: "Bearded Dragon", value: "bearded_dragon" },
  { label: "Leopard Gecko", value: "leopard_gecko" },
  { label: "Corn Snake", value: "corn_snake" },
  { label: "Ball Python", value: "ball_python" },
];

const ageGroups = [
  { label: "Juvenile (<1 year)", value: "juvenile" },
  { label: "Adult (1-5 years)", value: "adult" },
  { label: "Senior (>5 years)", value: "senior" },
];

// Feeding ratio data (percentage of body weight per day) by species and age group
// Values are typical veterinary guidelines for daily feeding ratio (as % of body weight)
const feedingRatios = {
  bearded_dragon: {
    juvenile: 0.05, // 5%
    adult: 0.03, // 3%
    senior: 0.02, // 2%
  },
  leopard_gecko: {
    juvenile: 0.06,
    adult: 0.04,
    senior: 0.03,
  },
  corn_snake: {
    juvenile: 0.07,
    adult: 0.05,
    senior: 0.03,
  },
  ball_python: {
    juvenile: 0.06,
    adult: 0.04,
    senior: 0.03,
  },
};

export default function ReptileDailyFeedingRatioSpeciesAgeCalculator() {
  // 1. STATE
  // Unit system for weight input (imperial default)
  const [unit, setUnit] = useState("imperial");

  // Inputs: species, age group, weight
  const [inputs, setInputs] = useState({
    species: "",
    ageGroup: "",
    weight: "",
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const { species, ageGroup, weight } = inputs;
    if (!species || !ageGroup || !weight) {
      return {
        value: 0,
        label: "Please fill all inputs",
        subtext: "",
        warning: null,
      };
    }
    const weightNum = parseFloat(weight);
    if (isNaN(weightNum) || weightNum <= 0) {
      return {
        value: 0,
        label: "Invalid weight entered",
        subtext: "",
        warning: null,
      };
    }

    // Convert weight to kg internally if imperial
    const weightKg = unit === "imperial" ? weightNum / 2.20462 : weightNum;

    // Get feeding ratio (as fraction)
    const ratio = feedingRatios[species]?.[ageGroup];
    if (ratio === undefined) {
      return {
        value: 0,
        label: "Feeding ratio data unavailable",
        subtext: "",
        warning: null,
      };
    }

    // Calculate daily food amount in grams
    // weightKg * 1000 (g/kg) * ratio
    const dailyFoodGrams = weightKg * 1000 * ratio;

    // Convert result to preferred unit for display
    // Display in grams if metric, ounces if imperial
    const displayValue =
      unit === "imperial"
        ? (dailyFoodGrams / 28.3495).toFixed(2) + " oz"
        : dailyFoodGrams.toFixed(1) + " g";

    return {
      value: displayValue,
      label: `Daily Feeding Amount (${unit === "imperial" ? "ounces" : "grams"})`,
      subtext: `Based on species: ${speciesOptions.find((s) => s.value === species)?.label}, age group: ${
        ageGroups.find((a) => a.value === ageGroup)?.label
      }, and weight: ${weightNum} ${unit === "imperial" ? "lbs" : "kg"}.`,
      warning: null,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why does the daily feeding ratio vary by species and age?",
      answer:
        "Different reptile species have unique metabolic rates, digestive systems, and nutritional needs that influence their daily feeding requirements. Additionally, age significantly impacts metabolism; juveniles require more frequent and higher feeding ratios to support growth, while adults and seniors need less to maintain health and avoid obesity. Understanding these differences ensures optimal nutrition and prevents health complications.",
    },
    {
      question: "How is the daily feeding ratio calculated for reptiles?",
      answer:
        "The daily feeding ratio is typically expressed as a percentage of the reptile’s body weight, reflecting how much food should be offered daily. This percentage is derived from veterinary research and clinical experience, considering species-specific metabolism and age-related energy demands. By multiplying the animal’s weight by this ratio, caretakers can estimate an appropriate daily food amount to maintain health.",
    },
    {
      question: "Can I feed my reptile more or less than the recommended daily feeding ratio?",
      answer:
        "While the recommended feeding ratio provides a general guideline, individual reptiles may have varying appetites and activity levels that require adjustments. Overfeeding can lead to obesity and related health issues, whereas underfeeding may cause malnutrition and lethargy. Regular monitoring of body condition and consultation with a veterinarian are essential to tailor feeding amounts appropriately.",
    },
    {
      question: "How often should I feed my reptile based on this daily feeding ratio?",
      answer:
        "Feeding frequency depends on species, age, and lifestyle; juveniles often require daily feeding to support rapid growth, while adults may be fed every 2-3 days. The daily feeding ratio helps determine the total amount of food needed per day, which can be divided into multiple feedings or offered in one meal depending on the reptile’s natural habits. Consistency and observation of feeding behavior are key to successful nutrition management.",
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
              <SelectItem value="imperial">Imperial (lbs)</SelectItem>
              <SelectItem value="metric">Metric (kg)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Species selector */}
      <div className="space-y-1">
        <Label htmlFor="species" className="text-slate-700 dark:text-slate-300">
          Species
        </Label>
        <Select
          id="species"
          value={inputs.species}
          onValueChange={(value) => setInputs((prev) => ({ ...prev, species: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select species" />
          </SelectTrigger>
          <SelectContent>
            {speciesOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Age group selector */}
      <div className="space-y-1">
        <Label htmlFor="ageGroup" className="text-slate-700 dark:text-slate-300">
          Age Group
        </Label>
        <Select
          id="ageGroup"
          value={inputs.ageGroup}
          onValueChange={(value) => setInputs((prev) => ({ ...prev, ageGroup: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select age group" />
          </SelectTrigger>
          <SelectContent>
            {ageGroups.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Weight input */}
      <div className="space-y-1">
        <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
          Weight ({unit === "imperial" ? "lbs" : "kg"})
        </Label>
        <Input
          id="weight"
          type="number"
          min="0"
          step="any"
          placeholder={`Enter weight in ${unit === "imperial" ? "pounds" : "kilograms"}`}
          value={inputs.weight}
          onChange={(e) => setInputs((prev) => ({ ...prev, weight: e.target.value }))}
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
          onClick={() => setInputs({ species: "", ageGroup: "", weight: "" })}
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
          Understanding Daily Feeding Ratio (by Species & Age)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The daily feeding ratio is a critical metric in reptile husbandry that determines the optimal amount of food a reptile should consume relative to its body weight. This ratio varies significantly between species due to differences in metabolism, digestive physiology, and natural dietary habits. Additionally, age plays a pivotal role; younger reptiles require higher feeding ratios to support rapid growth and development, whereas older reptiles need less to maintain health and avoid obesity.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Veterinarians and experienced herpetologists use these ratios to guide caretakers in providing balanced nutrition tailored to each reptile’s unique needs. Feeding too much can lead to obesity, liver disease, and other metabolic disorders, while underfeeding can cause malnutrition, stunted growth, and weakened immune function. Therefore, understanding and applying the correct daily feeding ratio is essential for promoting longevity and well-being in captive reptiles.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This calculator integrates species-specific and age-related feeding guidelines to estimate the appropriate daily food quantity. By inputting your reptile’s species, age group, and weight, you receive a scientifically grounded recommendation that supports optimal health. This tool serves as a valuable resource for both novice and experienced reptile keepers aiming to enhance their animal care practices.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To accurately determine the daily feeding amount for your reptile, begin by selecting the species from the dropdown menu. Next, choose the appropriate age group that best describes your reptile’s life stage. Finally, enter the current weight of your reptile in the selected unit system, either pounds or kilograms. Once all inputs are provided, click the calculate button to receive the recommended daily food quantity.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select your reptile’s species to ensure species-specific metabolic differences are accounted for.
          </li>
          <li>
            <strong>Step 2:</strong> Choose the age group to adjust feeding ratios according to growth or maintenance needs.
          </li>
          <li>
            <strong>Step 3:</strong> Input the reptile’s weight accurately in the preferred unit system.
          </li>
          <li>
            <strong>Step 4:</strong> Press “Calculate” to view the daily feeding amount, displayed in grams or ounces depending on your unit choice.
          </li>
          <li>
            <strong>Step 5:</strong> Use this information as a guideline and monitor your reptile’s condition regularly, adjusting feeding as necessary.
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
              href="https://www.vetmed.ucdavis.edu/clinical-expertise/exotic-animal-medicine/reptile-nutrition"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. UC Davis Veterinary Medicine - Reptile Nutrition
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive guidelines on reptile dietary requirements and feeding strategies from a leading veterinary institution.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.merckvetmanual.com/exotic-and-laboratory-animals/reptiles/nutrition-in-reptiles"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Merck Veterinary Manual - Nutrition in Reptiles
            </a>
            <p className="text-slate-500 text-sm">
              Authoritative resource detailing nutritional needs, feeding ratios, and metabolic considerations for various reptile species.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aav.org/resources/nutrition/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Association of Avian Veterinarians - Nutrition Resources
            </a>
            <p className="text-slate-500 text-sm">
              While focused on avian species, this resource provides insights into age-related feeding adjustments applicable to reptiles.
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
        formula: "Daily Feeding Amount (g) = Body Weight (kg) × Feeding Ratio (%) × 1000",
        variables: [
          { symbol: "Body Weight (kg)", description: "Reptile's body weight in kilograms" },
          { symbol: "Feeding Ratio (%)", description: "Species and age-specific daily feeding percentage of body weight" },
          { symbol: "Daily Feeding Amount (g)", description: "Recommended daily food amount in grams" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 1.5 kg adult bearded dragon requires a daily feeding amount based on its species and age-specific feeding ratio.",
        steps: [
          {
            label: "1",
            explanation:
              "Identify the feeding ratio for an adult bearded dragon: 3% (0.03) of body weight per day.",
          },
          {
            label: "2",
            explanation:
              "Multiply the body weight by the feeding ratio and convert to grams: 1.5 kg × 0.03 × 1000 = 45 grams.",
          },
          {
            label: "3",
            explanation:
              "The recommended daily feeding amount is 45 grams of appropriate food items.",
          },
        ],
        result: "Daily Feeding Amount = 45 grams",
      }}
      relatedCalculators={[
        { title: "Cat Chocolate Toxicity Calculator", url: "/pets/cat-chocolate-toxicity", icon: "🐱" },
        { title: "Fish Food Feeding Rate Calculator", url: "/pets/fish-food-feeding-rate", icon: "🐶" },
        { title: "Antibiotic Dose Reference (mg/kg)", url: "/pets/bird-antibiotic-dose-reference", icon: "🐱" },
        { title: "Horse Colic Risk Assessment (Feeding & Management)", url: "/pets/horse-colic-risk-assessment", icon: "🐎" },
        { title: "Vitamin A Requirement Calculator", url: "/pets/bird-vitamin-a-requirement", icon: "💉" },
        { title: "Foaling Countdown & Lactation Feed Planner", url: "/pets/horse-foaling-countdown-lactation-feed-planner", icon: "💧" },
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