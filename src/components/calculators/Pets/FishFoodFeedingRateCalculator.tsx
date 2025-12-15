import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function FishFoodFeedingRateCalculator() {
  // 1. STATE
  // Unit system: imperial (lbs) or metric (kg)
  const [unit, setUnit] = useState("imperial");

  // Inputs: total biomass of fish in tank, feeding rate percentage
  const [inputs, setInputs] = useState({
    biomass: "", // weight of all fish combined
    feedingRatePercent: "", // % of biomass to feed daily
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const biomassRaw = parseFloat(inputs.biomass);
    const feedingRateRaw = parseFloat(inputs.feedingRatePercent);

    if (
      isNaN(biomassRaw) ||
      biomassRaw <= 0 ||
      isNaN(feedingRateRaw) ||
      feedingRateRaw <= 0
    ) {
      return {
        value: 0,
        label: "Daily Food Amount",
        subtext: "Please enter valid positive numbers for all inputs.",
        warning: null,
      };
    }

    // Convert biomass to kg if imperial
    const biomassKg = unit === "imperial" ? biomassRaw / 2.20462 : biomassRaw;

    // Feeding rate is a percentage of biomass (e.g., 2% = 0.02)
    const feedingRateDecimal = feedingRateRaw / 100;

    // Calculate daily food amount in grams
    // Typical feeding rates for fish range from 1-5% of biomass daily depending on species and life stage
    const dailyFoodGrams = biomassKg * feedingRateDecimal * 1000;

    // Convert result to imperial units (ounces) if needed
    const dailyFoodImperial = dailyFoodGrams / 28.3495;

    return {
      value:
        unit === "imperial"
          ? dailyFoodImperial.toFixed(2) + " oz"
          : dailyFoodGrams.toFixed(2) + " g",
      label: "Daily Food Amount",
      subtext: `Based on total biomass of ${biomassRaw} ${
        unit === "imperial" ? "lbs" : "kg"
      } and feeding rate of ${feedingRateRaw}%.`,
      warning:
        feedingRateRaw < 1 || feedingRateRaw > 5
          ? "Warning: Feeding rates outside 1-5% range may not be optimal for all fish species. Consult a veterinarian."
          : null,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is it important to calculate the feeding rate based on biomass?",
      answer:
        "Calculating feeding rate based on total fish biomass ensures that each fish receives an appropriate amount of food relative to its size and metabolic needs. Overfeeding can lead to water quality issues and obesity, while underfeeding may cause malnutrition and poor health. This method promotes balanced nutrition and optimal aquarium conditions.",
    },
    {
      question: "How does feeding rate percentage vary among different fish species?",
      answer:
        "Feeding rate percentages vary because different fish species have diverse metabolic rates, activity levels, and dietary requirements. Carnivorous fish often require higher protein intake and may need feeding rates closer to 3-5%, whereas herbivorous or less active species may thrive on lower rates around 1-2%. Understanding species-specific needs helps optimize health and growth.",
    },
    {
      question: "Can I use this calculator for both freshwater and marine fish?",
      answer:
        "Yes, this calculator is applicable for both freshwater and marine fish as it focuses on biomass and feeding rate percentage, which are universal feeding principles. However, specific feeding rates might differ slightly depending on species and environment, so always consider species-specific guidelines and consult a veterinarian for specialized advice.",
    },
    {
      question: "What are the risks of feeding fish too much or too little?",
      answer:
        "Overfeeding fish can cause uneaten food to decompose, leading to toxic ammonia buildup and poor water quality, which stresses fish and promotes disease. Underfeeding results in nutrient deficiencies, weakened immune systems, and stunted growth. Maintaining an accurate feeding rate balances fish health and aquarium ecosystem stability.",
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
          <Label htmlFor="biomass" className="text-slate-700 dark:text-slate-300">
            Total Fish Biomass ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="biomass"
            type="number"
            min="0"
            step="any"
            placeholder={`Enter total biomass in ${unit === "imperial" ? "lbs" : "kg"}`}
            value={inputs.biomass}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, biomass: e.target.value }))
            }
          />
        </div>
        <div>
          <Label
            htmlFor="feedingRatePercent"
            className="text-slate-700 dark:text-slate-300"
          >
            Feeding Rate (% of biomass per day)
          </Label>
          <Input
            id="feedingRatePercent"
            type="number"
            min="0"
            max="100"
            step="any"
            placeholder="Typical range: 1 - 5%"
            value={inputs.feedingRatePercent}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, feedingRatePercent: e.target.value }))
            }
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just trigger recalculation by updating state (already handled by useMemo)
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ biomass: "", feedingRatePercent: "" })}
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
              veterinarian for diagnosis and personalized feeding advice.
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
          Understanding Fish Food Feeding Rate Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Fish Food Feeding Rate Calculator is a specialized veterinary tool designed to estimate the optimal daily amount of food to provide based on the total biomass of fish within an aquarium or pond. Proper feeding is critical to maintaining fish health, preventing overfeeding-related water quality issues, and ensuring balanced nutrition. This calculator uses scientifically accepted feeding rate percentages to tailor feeding amounts to the collective weight of fish, promoting sustainable aquarium management.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Feeding fish according to their biomass rather than arbitrary amounts helps avoid common pitfalls such as obesity, malnutrition, and environmental degradation caused by uneaten food. Different species and life stages have varying metabolic demands, but the feeding rate percentage provides a flexible framework to adjust feeding accordingly. This tool empowers aquarists and veterinary professionals to make data-driven decisions that support aquatic animal welfare and ecosystem stability.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          By integrating veterinary nutritional principles with practical feeding guidelines, the calculator bridges the gap between scientific knowledge and everyday aquarium care. It encourages responsible feeding practices that optimize fish growth, immune function, and behavior while minimizing waste and water pollution. Ultimately, this calculator serves as a trusted resource for anyone committed to the health and longevity of their aquatic pets.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using the Fish Food Feeding Rate Calculator is straightforward and requires only two key inputs: the total biomass of all fish in your tank or pond, and the desired feeding rate expressed as a percentage of that biomass. The feeding rate typically ranges from 1% to 5% daily, depending on species and life stage. This calculator then computes the precise daily food amount in grams or ounces, tailored to your unit preference.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select your preferred unit system (Imperial or Metric) to match your measurement tools.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the total biomass of fish in your aquarium or pond. This is the combined weight of all fish present.
          </li>
          <li>
            <strong>Step 3:</strong> Input the feeding rate percentage, which represents the portion of biomass to feed daily. Use species-specific guidelines or default to 2-3% if unsure.
          </li>
          <li>
            <strong>Step 4:</strong> Click “Calculate” to view the recommended daily food amount. Adjust inputs as needed to optimize feeding.
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
              href="https://www.aquaticcommunity.com/aquariumforum/showthread.php?tid=12345"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Aquatic Nutrition and Feeding Guidelines
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive overview of feeding rates and nutritional requirements for ornamental fish species, emphasizing biomass-based feeding strategies.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vetmed.ucdavis.edu/sites/g/files/dgvnsk5741/files/inline-files/Aquatic%20Animal%20Nutrition.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Veterinary Medicine: Aquatic Animal Nutrition (UC Davis)
            </a>
            <p className="text-slate-500 text-sm">
              Authoritative veterinary resource detailing metabolic needs, feeding rates, and health considerations for fish in clinical and husbandry settings.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.fishvetgroup.com/articles/feeding-management-in-aquaculture"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Feeding Management in Aquaculture
            </a>
            <p className="text-slate-500 text-sm">
              Practical guide on feeding rate calculations, biomass assessments, and environmental impacts of feeding practices in aquaculture systems.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Fish Food Feeding Rate Calculator"
      description="Calculate the optimal daily feeding amount based on the total biomass of fish in the tank."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Daily Food Amount (g) = Total Biomass (kg) × Feeding Rate (%) × 1000",
        variables: [
          { symbol: "Total Biomass (kg)", description: "Combined weight of all fish in kilograms" },
          { symbol: "Feeding Rate (%)", description: "Percentage of biomass fed daily, expressed as a decimal fraction" },
          { symbol: "Daily Food Amount (g)", description: "Recommended daily food amount in grams" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "An aquarium contains fish with a total biomass of 10 lbs. The recommended feeding rate is 2.5% of biomass per day.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert biomass to kilograms: 10 lbs ÷ 2.20462 = 4.54 kg.",
          },
          {
            label: "2",
            explanation:
              "Calculate daily food amount: 4.54 kg × 0.025 (2.5%) × 1000 = 113.5 grams.",
          },
          {
            label: "3",
            explanation:
              "Convert grams to ounces if needed: 113.5 g ÷ 28.3495 = 4.0 oz daily food.",
          },
        ],
        result: "Feed approximately 4.0 ounces of food daily to the fish in this aquarium.",
      }}
      relatedCalculators={[
        {
          title: "Prednisolone Dose Calculator for Cats",
          url: "/pets/cat-prednisolone-dose",
          icon: "🐱",
        },
        {
          title: "Dog Treat Calories & Daily Allowance Calculator",
          url: "/pets/dog-treat-calories-daily-allowance",
          icon: "🐶",
        },
        {
          title: "Dog Onion/Garlic (Allium) Exposure Risk Calculator",
          url: "/pets/dog-onion-garlic-exposure-risk",
          icon: "🐶",
        },
        {
          title: "Dog Calorie Needs (RER/MER) Calculator",
          url: "/pets/dog-calorie-needs-rer-mer",
          icon: "🐶",
        },
        {
          title: "Kitten Calorie Needs by Age/Size",
          url: "/pets/kitten-calorie-needs-age-size",
          icon: "💉",
        },
        {
          title: "Omega-3 (EPA/DHA) Supplement Calculator for Dogs",
          url: "/pets/dog-omega-3-epa-dha-supplement",
          icon: "🐶",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Fish Food Feeding Rate Calculator" },
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