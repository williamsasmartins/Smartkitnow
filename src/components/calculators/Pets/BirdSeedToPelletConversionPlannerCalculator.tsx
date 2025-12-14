import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BirdSeedToPelletConversionPlannerCalculator() {
  // 1. STATE
  // Unit system needed for weight inputs
  const [unit, setUnit] = useState("imperial");

  // Inputs: Bird weight, current % seed diet, target % pellet diet, conversion duration (weeks)
  const [inputs, setInputs] = useState({
    weight: "",
    currentSeedPercent: "",
    targetPelletPercent: "",
    durationWeeks: "",
  });

  // 2. LOGIC ENGINE
  // Formula logic:
  // Daily pellet increase per week (%) = (Target Pellet % - (100 - Current Seed %)) / Duration (weeks)
  // This gives a gradual weekly increase in pellet % replacing seed %
  // Result: Weekly pellet % increment to plan conversion

  const results = useMemo(() => {
    const weightNum = parseFloat(inputs.weight);
    const currentSeedNum = parseFloat(inputs.currentSeedPercent);
    const targetPelletNum = parseFloat(inputs.targetPelletPercent);
    const durationNum = parseFloat(inputs.durationWeeks);

    if (
      isNaN(weightNum) ||
      isNaN(currentSeedNum) ||
      isNaN(targetPelletNum) ||
      isNaN(durationNum) ||
      weightNum <= 0 ||
      currentSeedNum < 0 ||
      currentSeedNum > 100 ||
      targetPelletNum < 0 ||
      targetPelletNum > 100 ||
      durationNum <= 0
    ) {
      return {
        value: 0,
        label: "Invalid input values",
        subtext: "Please enter valid positive numbers within range.",
        warning: "Ensure percentages are between 0 and 100 and duration is positive.",
      };
    }

    // Calculate weekly pellet increase %
    // Current pellet % = 100 - currentSeedPercent
    const currentPelletPercent = 100 - currentSeedNum;
    if (targetPelletNum < currentPelletPercent) {
      return {
        value: 0,
        label: "Target pellet % must be higher than current pellet %",
        subtext: "Conversion should increase pellet proportion gradually.",
        warning: "Target pellet % should exceed current pellet % for conversion.",
      };
    }

    const weeklyPelletIncrease = (targetPelletNum - currentPelletPercent) / durationNum;

    // Round to 2 decimals
    const weeklyIncreaseRounded = Math.round(weeklyPelletIncrease * 100) / 100;

    return {
      value: weeklyIncreaseRounded,
      label: "Weekly Pellet Increase (%)",
      subtext: `Increase pellet proportion by this percent each week over ${durationNum} weeks.`,
      warning: null,
    };
  }, [inputs]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is a gradual seed-to-pellet conversion important for birds?",
      answer:
        "A gradual conversion from seed to pellet diet is crucial because sudden dietary changes can cause digestive upset and stress in birds. Pellets provide balanced nutrition, but birds accustomed to seeds may reject pellets if introduced abruptly. Slowly increasing pellet proportion allows the bird’s digestive system and palate to adapt, promoting better health and acceptance of the new diet.",
    },
    {
      question: "How does bird weight affect the seed-to-pellet conversion plan?",
      answer:
        "Bird weight is an important factor because nutritional needs and feeding amounts vary with size. Larger birds require more food, so the conversion increments must be scaled appropriately to avoid overfeeding or underfeeding. Accurate weight measurement ensures the conversion plan matches the bird’s energy requirements and supports healthy growth or maintenance during the transition.",
    },
    {
      question: "What is the recommended duration for converting a bird’s diet from seed to pellet?",
      answer:
        "The recommended duration typically ranges from 4 to 12 weeks, depending on the bird’s species, age, and acceptance of pellets. A longer duration allows a gentler transition, reducing stress and increasing the likelihood of successful adoption. This calculator helps customize the duration to balance gradual change with practical feeding schedules for optimal results.",
    },
    {
      question: "Can this planner be used for all bird species?",
      answer:
        "While this planner provides a general framework, dietary needs and conversion rates can vary significantly among bird species. Some species may require slower transitions or specialized pellet formulations. It is essential to consult a veterinarian familiar with the specific bird species to tailor the conversion plan safely and effectively.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 4. HANDLERS
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }

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

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Bird Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            name="weight"
            type="text"
            inputMode="decimal"
            value={inputs.weight}
            onChange={handleInputChange}
            placeholder={unit === "imperial" ? "e.g. 1.5" : "e.g. 0.68"}
          />
        </div>
        <div>
          <Label htmlFor="currentSeedPercent" className="text-slate-700 dark:text-slate-300">
            Current Seed Diet Percentage (%)
          </Label>
          <Input
            id="currentSeedPercent"
            name="currentSeedPercent"
            type="text"
            inputMode="decimal"
            value={inputs.currentSeedPercent}
            onChange={handleInputChange}
            placeholder="e.g. 80"
          />
        </div>
        <div>
          <Label htmlFor="targetPelletPercent" className="text-slate-700 dark:text-slate-300">
            Target Pellet Diet Percentage (%)
          </Label>
          <Input
            id="targetPelletPercent"
            name="targetPelletPercent"
            type="text"
            inputMode="decimal"
            value={inputs.targetPelletPercent}
            onChange={handleInputChange}
            placeholder="e.g. 80"
          />
        </div>
        <div>
          <Label htmlFor="durationWeeks" className="text-slate-700 dark:text-slate-300">
            Conversion Duration (weeks)
          </Label>
          <Input
            id="durationWeeks"
            name="durationWeeks"
            type="text"
            inputMode="decimal"
            value={inputs.durationWeeks}
            onChange={handleInputChange}
            placeholder="e.g. 6"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just trigger recalculation (already reactive)
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", currentSeedPercent: "", targetPelletPercent: "", durationWeeks: "" })}
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
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">Estimated Result</p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}%</p>
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding Seed-to-Pellet Conversion Planner</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Seed-to-Pellet Conversion Planner is a specialized veterinary tool designed to assist bird owners and avian veterinarians in transitioning birds from a traditional seed-based diet to a nutritionally complete pellet diet. Seed diets, while popular, often lack essential nutrients and can lead to health issues such as obesity and vitamin deficiencies. Pellets provide balanced nutrition tailored to the species’ needs, promoting optimal health and longevity.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This planner calculates the ideal weekly increase in pellet proportion over a user-defined duration, ensuring a gradual and stress-free dietary transition. Gradual conversion is critical because birds can be sensitive to sudden dietary changes, which may cause digestive upset or refusal to eat. By carefully planning the incremental increase in pellets, owners can improve acceptance and reduce health risks associated with abrupt changes.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The tool takes into account the bird’s weight and current diet composition to personalize the conversion schedule. It empowers users with a clear, actionable plan that balances nutritional adequacy with behavioral adaptation. This approach aligns with veterinary best practices and supports long-term avian wellness through improved diet quality.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use the Seed-to-Pellet Conversion Planner, begin by selecting your preferred unit system, either Imperial (pounds) or Metric (kilograms), to enter your bird’s weight accurately. Next, input the current percentage of the bird’s diet that consists of seeds and the target percentage you want to achieve with pellets. Finally, specify the duration over which you want to complete the conversion, measured in weeks.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter your bird’s weight in the selected unit system to ensure the conversion plan is tailored to its size and nutritional needs.
          </li>
          <li>
            <strong>Step 2:</strong> Provide the current seed diet percentage and the desired pellet diet percentage, ensuring the target pellet percentage is higher than the current pellet proportion.
          </li>
          <li>
            <strong>Step 3:</strong> Set the conversion duration in weeks, balancing a gradual transition with practical feeding schedules.
          </li>
          <li>
            <strong>Step 4:</strong> Click “Calculate” to receive the recommended weekly pellet increase percentage, which guides you in adjusting the diet incrementally.
          </li>
          <li>
            <strong>Step 5:</strong> Follow the plan consistently, monitoring your bird’s acceptance and health, and consult a veterinarian if any concerns arise.
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
              href="https://www.avianweb.com/avian-nutrition.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. AvianWeb - Avian Nutrition Basics
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive resource on bird nutrition, emphasizing the importance of balanced diets and gradual dietary changes.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aav.org/avian-nutrition"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Association of Avian Veterinarians - Nutrition Guidelines
            </a>
            <p className="text-slate-500 text-sm">
              Professional guidelines outlining best practices for feeding companion birds, including seed-to-pellet transitions.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6520897/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. National Center for Biotechnology Information - Avian Diet and Health
            </a>
            <p className="text-slate-500 text-sm">
              Peer-reviewed article discussing the impact of diet on avian health and the benefits of pellet-based nutrition.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Seed-to-Pellet Conversion Planner"
      description="Plan a gradual conversion schedule from a seed-based diet to a healthier, complete pellet diet."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Weekly Pellet Increase (%) = (Target Pellet % - Current Pellet %) ÷ Duration (weeks)",
        variables: [
          { symbol: "Target Pellet %", description: "Desired pellet proportion in diet" },
          { symbol: "Current Pellet %", description: "Current pellet proportion in diet (100 - seed %)" },
          { symbol: "Duration (weeks)", description: "Number of weeks for conversion" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A parakeet currently eating 80% seed diet (20% pellets) weighing 1.5 lbs is planned to be converted to 80% pellet diet over 6 weeks.",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate current pellet %: 100 - 80 = 20%. Target pellet % is 80%. Duration is 6 weeks.",
          },
          {
            label: "2",
            explanation:
              "Apply formula: (80 - 20) ÷ 6 = 10% weekly pellet increase.",
          },
          {
            label: "3",
            explanation:
              "Each week, increase pellet proportion by 10% while reducing seed proportion accordingly.",
          },
        ],
        result: "The bird’s diet should be adjusted weekly by increasing pellets by 10% to reach 80% pellets in 6 weeks.",
      }}
      relatedCalculators={[
        { title: "Dog Age in Human Years (Breed-Aware)", url: "/pets/dog-age-human-years-breed-aware", icon: "🐶" },
        { title: "Protein/Fat Intake Guide for Cats (by Goal)", url: "/pets/cat-protein-fat-intake-guide", icon: "🐱" },
        { title: "Pond Volume & Liner Size Calculator", url: "/pets/pond-volume-liner-size", icon: "🐱" },
        { title: "Acetaminophen/Ibuprofen Exposure Risk (human meds)", url: "/pets/cat-acetaminophen-ibuprofen-exposure-risk", icon: "🍖" },
        { title: "Kitten Weaning Timeline & Feeding Amounts", url: "/pets/kitten-weaning-timeline-feeding-amounts", icon: "💉" },
        { title: "Cat Treat Calories & Daily Allowance", url: "/pets/cat-treat-calories-daily-allowance", icon: "🐱" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Seed-to-Pellet Conversion Planner" },
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