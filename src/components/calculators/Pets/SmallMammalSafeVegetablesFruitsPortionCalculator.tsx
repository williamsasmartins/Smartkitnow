import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function SmallMammalSafeVegetablesFruitsPortionCalculator() {
  // 1. STATE
  // Unit system default to imperial (lbs)
  const [unit, setUnit] = useState("imperial");

  // Inputs: weight (lbs or kg), vegetable/fruit type (to adjust max safe %), optional age group (adult/juvenile)
  // For simplicity, we assume a fixed safe percentage of body weight for veggies/fruits (e.g. 5%)
  // Some vegetables/fruits have different safe max % due to fiber or sugar content.
  const [inputs, setInputs] = useState({
    weight: "",
    produceType: "general",
    ageGroup: "adult",
  });

  // Safe portion percentages by produce type (as % of body weight)
  // These are conservative veterinary guidelines for small mammals (e.g. rabbits, guinea pigs)
  const safePortionPercentages: Record<string, number> = {
    general: 0.05, // 5% of body weight
    leafyGreens: 0.07, // 7% for leafy greens (safe and high fiber)
    rootVegetables: 0.03, // 3% for root vegetables (higher sugar/starch)
    fruits: 0.02, // 2% for fruits (higher sugar content)
  };

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightNum = parseFloat(inputs.weight);
    if (isNaN(weightNum) || weightNum <= 0) {
      return {
        value: 0,
        label: "Invalid weight input",
        subtext: "Please enter a valid positive number for weight.",
        warning: null,
      };
    }

    // Convert weight to kg internally for veterinary standard calculations
    const weightKg = unit === "imperial" ? weightNum / 2.20462 : weightNum;

    // Get safe portion percentage based on produce type
    const portionPercent = safePortionPercentages[inputs.produceType] ?? safePortionPercentages.general;

    // Adjust portion for juvenile animals (reduce by 20% due to sensitive digestion)
    const ageAdjustment = inputs.ageGroup === "juvenile" ? 0.8 : 1;

    // Calculate safe portion in grams: portionPercent * weightKg * 1000g/kg * ageAdjustment
    const safePortionGrams = portionPercent * weightKg * 1000 * ageAdjustment;

    // Convert back to ounces if imperial
    const safePortion = unit === "imperial" ? safePortionGrams / 28.3495 : safePortionGrams;

    // Format result to 1 decimal place
    const displayValue = safePortion.toFixed(1);

    return {
      value: displayValue,
      label: `Maximum safe daily portion (${unit === "imperial" ? "oz" : "g"})`,
      subtext:
        "This estimate helps prevent digestive upset by limiting vegetable and fruit intake based on body weight and type of produce.",
      warning:
        portionPercent < 0.05
          ? "Caution: This produce type has a lower safe portion due to higher sugar or starch content.",
          // No warning if portionPercent >= 0.05
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is it important to limit the portion size of vegetables and fruits for small mammals?",
      answer:
        "Small mammals have sensitive digestive systems that can be easily upset by excessive fiber, sugar, or starch intake. Overfeeding vegetables or fruits can lead to diarrhea, bloating, or nutritional imbalances. Limiting portion sizes ensures a balanced diet that supports healthy digestion and overall well-being.",
    },
    {
      question: "How does the type of vegetable or fruit affect the safe portion size?",
      answer:
        "Different vegetables and fruits vary in fiber, sugar, and starch content, which influence how much is safe to feed. Leafy greens are generally safer and can be offered in larger amounts, while root vegetables and fruits contain more sugars and should be limited. This calculator adjusts portion sizes accordingly to prevent digestive issues.",
    },
    {
      question: "Why does the calculator reduce portion sizes for juvenile animals?",
      answer:
        "Juvenile small mammals have developing digestive systems that are more sensitive to dietary changes and imbalances. Feeding them smaller portions of vegetables and fruits helps avoid gastrointestinal distress and supports proper growth. The calculator applies a conservative reduction to promote safe feeding practices for young animals.",
    },
    {
      question: "Can I use this calculator for all small mammals like rabbits, guinea pigs, and hamsters?",
      answer:
        "This calculator is designed primarily for common small herbivorous mammals such as rabbits and guinea pigs, which have similar dietary needs. While it can provide general guidance for other small mammals, species-specific dietary requirements may vary. Always consult a veterinarian for tailored advice for your pet’s species.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Widget UI
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
              <SelectItem value="imperial">Imperial (lbs, oz)</SelectItem>
              <SelectItem value="metric">Metric (kg, g)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Body Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            type="number"
            min="0"
            step="any"
            placeholder={`Enter weight in ${unit === "imperial" ? "lbs" : "kg"}`}
            value={inputs.weight}
            onChange={(e) => setInputs((prev) => ({ ...prev, weight: e.target.value }))}
          />
        </div>

        <div>
          <Label htmlFor="produceType" className="text-slate-700 dark:text-slate-300">
            Vegetable/Fruit Type
          </Label>
          <Select
            id="produceType"
            value={inputs.produceType}
            onValueChange={(value) => setInputs((prev) => ({ ...prev, produceType: value }))}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General Vegetables & Fruits</SelectItem>
              <SelectItem value="leafyGreens">Leafy Greens (e.g. kale, spinach)</SelectItem>
              <SelectItem value="rootVegetables">Root Vegetables (e.g. carrot, beet)</SelectItem>
              <SelectItem value="fruits">Fruits (e.g. apple, berries)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="ageGroup" className="text-slate-700 dark:text-slate-300">
            Age Group
          </Label>
          <Select
            id="ageGroup"
            value={inputs.ageGroup}
            onValueChange={(value) => setInputs((prev) => ({ ...prev, ageGroup: value }))}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="adult">Adult</SelectItem>
              <SelectItem value="juvenile">Juvenile</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating inputs state (noop here since useMemo depends on inputs)
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              weight: "",
              produceType: "general",
              ageGroup: "adult",
            })
          }
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

  // Editorial content with rich paragraphs
  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Safe Vegetables & Fruits Portion Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Safe Vegetables & Fruits Portion Calculator is a veterinary-informed tool designed to estimate the maximum daily amount of vegetables and fruits that can be safely fed to small mammals such as rabbits and guinea pigs. These animals have delicate digestive systems that require careful dietary management to avoid gastrointestinal upset. By calculating portions based on body weight and produce type, this tool helps pet owners provide balanced nutrition without risking overfeeding.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Different vegetables and fruits vary widely in fiber, sugar, and starch content, which directly impact their safety and suitability for small mammals. Leafy greens, for example, are generally safe in larger quantities due to their high fiber and low sugar, whereas root vegetables and fruits contain more sugars and should be limited. This calculator incorporates these differences by adjusting portion recommendations accordingly, ensuring a tailored feeding plan that supports digestive health.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Additionally, the calculator accounts for the age of the animal, recognizing that juvenile small mammals have more sensitive digestive systems and require smaller portions to prevent distress. By integrating these veterinary principles into a simple, user-friendly interface, this tool empowers pet owners to make informed feeding decisions that promote longevity and well-being in their small mammal companions.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using the Safe Vegetables & Fruits Portion Calculator is straightforward and requires only a few inputs. Begin by selecting the unit system you prefer—Imperial or Metric—and enter your pet’s current body weight. Next, choose the type of vegetable or fruit you plan to feed, as this affects the safe portion size due to varying nutritional content. Finally, specify whether your pet is an adult or juvenile to adjust the recommendation accordingly.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter your pet’s weight accurately in pounds or kilograms depending on your selected unit system.
          </li>
          <li>
            <strong>Step 2:</strong> Select the vegetable or fruit category that best matches what you intend to feed your pet.
          </li>
          <li>
            <strong>Step 3:</strong> Choose the age group of your pet to ensure the portion size is appropriate for their digestive maturity.
          </li>
          <li>
            <strong>Step 4:</strong> Click “Calculate” to view the maximum safe daily portion size, displayed in ounces or grams.
          </li>
          <li>
            <strong>Step 5:</strong> Use the result as a guideline to portion your pet’s fresh produce, and consult your veterinarian for personalized advice.
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
              href="https://www.merckvetmanual.com/exotic-and-laboratory-animals/rabbits/nutrition-of-rabbits"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Merck Veterinary Manual - Nutrition of Rabbits
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive guide on the dietary needs and safe feeding practices for rabbits, including vegetable and fruit intake recommendations.
            </p>
          </li>
          <li className="block">
            <a
              href="https://vcahospitals.com/know-your-pet/feeding-your-guinea-pig"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. VCA Hospitals - Feeding Your Guinea Pig
            </a>
            <p className="text-slate-500 text-sm">
              Expert advice on the appropriate types and amounts of vegetables and fruits safe for guinea pigs, emphasizing fiber and sugar considerations.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aaha.org/globalassets/02-guidelines/2019-exotic-animal-nutrition-guidelines.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. AAHA Exotic Animal Nutrition Guidelines (2019)
            </a>
            <p className="text-slate-500 text-sm">
              Authoritative guidelines on nutrition for exotic small mammals, including safe feeding portions and dietary management strategies.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Safe Vegetables & Fruits Portion Calculator"
      description="Calculate the maximum safe daily portion of various vegetables and fruits to prevent digestive upset."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Safe Portion (g) = Body Weight (kg) × Safe Percentage × Age Adjustment",
        variables: [
          { symbol: "Body Weight (kg)", description: "Pet's body weight in kilograms" },
          { symbol: "Safe Percentage", description: "Recommended safe portion percentage based on produce type" },
          { symbol: "Age Adjustment", description: "Factor reducing portion for juveniles (0.8) or adults (1)" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 4 lb adult rabbit owner wants to feed leafy greens safely. Using the calculator, they input 4 lbs, select 'Leafy Greens', and 'Adult'.",
        steps: [
          { label: "1", explanation: "Convert 4 lbs to 1.81 kg." },
          { label: "2", explanation: "Leafy greens safe portion is 7% of body weight." },
          { label: "3", explanation: "Age adjustment for adult is 1." },
          { label: "4", explanation: "Calculate: 1.81 × 0.07 × 1 = 0.127 kg (127 grams)." },
          { label: "5", explanation: "Convert 127 grams to 4.48 ounces." },
        ],
        result: "Maximum safe daily portion is approximately 4.5 oz of leafy greens.",
      }}
      relatedCalculators={[
        { title: "Dog Weight Loss Planner", url: "/pets/dog-weight-loss-planner", icon: "🐶" },
        { title: "Heat Risk/Walk Safety Window (Temp & Humidity)", url: "/pets/dog-heat-risk-walk-safety-window", icon: "🐶" },
        { title: "Kitten Calorie Needs by Age/Size", url: "/pets/kitten-calorie-needs-age-size", icon: "🐱" },
        { title: "Dog BMI/Body Index (educational)", url: "/pets/dog-bmi-body-index-educational", icon: "🐶" },
        { title: "Dog Treat Calories & Daily Allowance Calculator", url: "/pets/dog-treat-calories-daily-allowance", icon: "🐶" },
        { title: "Dog Calorie Needs (RER/MER) Calculator", url: "/pets/dog-calorie-needs-rer-mer", icon: "🐶" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Safe Vegetables & Fruits Portion Calculator" },
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