import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BirdHandFeedingFormulaAmountChicksCalculator() {
  // 1. STATE
  // Unit system: imperial (lbs) or metric (kg)
  const [unit, setUnit] = useState("imperial");

  // Inputs: weight (lbs or kg), age (days)
  const [inputs, setInputs] = useState({
    weight: "",
    age: "",
  });

  // 2. LOGIC ENGINE
  // Formula source: Hand-feeding formula amount (ml) = 10% of body weight (g) per feeding, frequency depends on age.
  // Convert weight to grams internally.
  // Volume per feeding (ml) = 0.1 * weight (g)
  // Frequency (feedings/day) varies by age:
  // 0-7 days: 6-8 feedings/day (use 8)
  // 8-14 days: 5-6 feedings/day (use 6)
  // 15-21 days: 4-5 feedings/day (use 5)
  // >21 days: 3-4 feedings/day (use 4)
  // Total daily volume = volume per feeding * frequency

  const results = useMemo(() => {
    const weightNum = parseFloat(inputs.weight);
    const ageNum = parseInt(inputs.age);

    if (isNaN(weightNum) || weightNum <= 0 || isNaN(ageNum) || ageNum < 0) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: "Please enter valid positive numbers for weight and age.",
      };
    }

    // Convert weight to grams
    const weightGrams = unit === "imperial" ? weightNum * 453.592 : weightNum * 1000;

    // Volume per feeding in ml = 10% of body weight in grams
    const volumePerFeeding = 0.1 * weightGrams;

    // Determine feedings per day based on age
    let feedingsPerDay = 4; // default for >21 days
    if (ageNum <= 7) feedingsPerDay = 8;
    else if (ageNum <= 14) feedingsPerDay = 6;
    else if (ageNum <= 21) feedingsPerDay = 5;

    // Total daily volume in ml
    const totalDailyVolume = volumePerFeeding * feedingsPerDay;

    // Round results to 1 decimal place
    const volumePerFeedingRounded = Math.round(volumePerFeeding * 10) / 10;
    const totalDailyVolumeRounded = Math.round(totalDailyVolume * 10) / 10;

    return {
      value: volumePerFeedingRounded,
      label: `Volume per Feeding (ml)`,
      subtext: `Feed ${feedingsPerDay} times per day for a total of ${totalDailyVolumeRounded} ml daily.`,
      warning: null,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is it important to calculate the correct hand-feeding formula amount for chicks?",
      answer:
        "Calculating the correct formula amount ensures that chicks receive adequate nutrition without overfeeding, which can cause digestive issues or aspiration pneumonia. Proper feeding supports healthy growth and development during this critical stage. It also helps prevent dehydration and malnutrition by matching the chick’s metabolic needs precisely.",
    },
    {
      question: "How does a chick’s age affect the feeding frequency and amount?",
      answer:
        "Younger chicks have higher metabolic rates and smaller stomach capacities, requiring more frequent but smaller feedings to avoid overloading their digestive system. As chicks grow, their feeding frequency decreases while the volume per feeding increases to accommodate their larger size and energy needs. This gradual adjustment helps optimize nutrient absorption and growth.",
    },
    {
      question: "What risks are associated with incorrect hand-feeding volumes?",
      answer:
        "Feeding too much formula can lead to aspiration pneumonia, where food enters the lungs causing infection and respiratory distress. Underfeeding can cause malnutrition, stunted growth, and weakened immunity. Accurate volume calculation minimizes these risks by ensuring chicks receive balanced nutrition tailored to their size and age.",
    },
    {
      question: "Can this calculator be used for all bird species’ chicks?",
      answer:
        "While this calculator provides general guidelines based on common avian physiology, specific species may have unique nutritional requirements or feeding behaviors. It is important to consult species-specific veterinary resources or an avian veterinarian for specialized care. This tool is best used as a baseline for common poultry and pet bird chicks.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 4. UI HANDLERS
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  }

  // 5. WIDGET JSX
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
            Chick Weight ({unit === "imperial" ? "lbs" : "kg"})
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
          />
        </div>
        <div>
          <Label htmlFor="age" className="text-slate-700 dark:text-slate-300">
            Chick Age (days)
          </Label>
          <Input
            id="age"
            name="age"
            type="number"
            min="0"
            step="1"
            placeholder="Enter age in days"
            value={inputs.age}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by setting inputs (already reactive)
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", age: "" })}
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

  // 6. EDITORIAL CONTENT
  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Hand-Feeding Formula Amount (Chicks)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Hand-feeding baby chicks requires precise calculation of formula amounts to ensure optimal growth and health. The nutritional needs of chicks vary significantly with their weight and age, making it essential to tailor feeding volumes accordingly. Overfeeding or underfeeding can lead to serious health complications, including digestive upset or malnutrition, which can compromise survival rates in these vulnerable animals.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The general veterinary guideline recommends feeding chicks approximately 10% of their body weight in formula per feeding, with the frequency of feedings decreasing as the chick matures. This approach balances the chick’s metabolic demands with their digestive capacity, promoting efficient nutrient absorption and steady development. Understanding these principles helps caregivers provide appropriate care during this critical growth phase.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Additionally, the formula’s temperature, consistency, and hygiene are crucial factors influencing feeding success. Proper preparation and administration techniques reduce the risk of aspiration and infection. This calculator integrates these veterinary recommendations into a simple tool to assist caregivers in delivering scientifically informed feeding volumes tailored to each chick’s unique needs.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To accurately determine the hand-feeding formula amount for your chick, input the chick’s current weight and age in days. Select the appropriate unit system (imperial or metric) to match your measurement tools. Once entered, click “Calculate” to receive the recommended volume per feeding and the suggested daily feeding frequency based on veterinary guidelines.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter the chick’s weight in pounds or kilograms depending on your selected unit system.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the chick’s age in days to determine the appropriate feeding frequency.
          </li>
          <li>
            <strong>Step 3:</strong> Click the “Calculate” button to view the recommended volume per feeding and total daily volume.
          </li>
          <li>
            <strong>Step 4:</strong> Use the results to guide your feeding schedule, adjusting as the chick grows and ages.
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
              href="https://www.merckvetmanual.com/exotic-and-laboratory-animals/birds/hand-rearing-birds"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Merck Veterinary Manual - Hand-Rearing Birds
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive guide on nutritional requirements and feeding techniques for hand-rearing avian species.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7070405/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Avian Nutrition and Feeding Practices - NCBI
            </a>
            <p className="text-slate-500 text-sm">
              Scientific article detailing metabolic needs and feeding protocols for young birds in captivity.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aav.org/page/avian-nutrition"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Association of Avian Veterinarians - Avian Nutrition
            </a>
            <p className="text-slate-500 text-sm">
              Authoritative resource on avian dietary requirements and best practices for hand-feeding chicks.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Hand-Feeding Formula Amount (Chicks)"
      description="Calculate the correct volume and frequency for hand-feeding formula for baby chicks and fledglings."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Volume per Feeding (ml) = 0.1 × Body Weight (g)",
        variables: [
          { symbol: "Volume per Feeding", description: "Amount of formula in milliliters per feeding" },
          { symbol: "Body Weight", description: "Chick's weight in grams" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 10-day-old chick weighing 0.5 lbs (226.8 g) requires hand-feeding formula. Determine the volume per feeding and daily total volume.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to grams: 0.5 lbs × 453.592 = 226.8 g. Calculate volume per feeding: 0.1 × 226.8 = 22.7 ml.",
          },
          {
            label: "2",
            explanation:
              "Determine feedings per day for 10 days old chick: 6 feedings/day. Calculate total daily volume: 22.7 ml × 6 = 136.2 ml.",
          },
        ],
        result: "Feed the chick approximately 22.7 ml per feeding, 6 times daily, totaling 136.2 ml per day.",
      }}
      relatedCalculators={[
        { title: "Ambient Temperature Safe Zone Calculator", url: "/pets/bird-ambient-temperature-safe-zone", icon: "🐾" },
        { title: "Exercise Time Planner (Run Time per Day)", url: "/pets/small-mammal-exercise-time-planner", icon: "🐶" },
        { title: "Omega-3 Supplement Planner (EPA/DHA per kg)", url: "/pets/horse-omega-3-supplement-planner", icon: "🐱" },
        { title: "Dehydration Signs Estimator", url: "/pets/bird-dehydration-signs-estimator", icon: "🍖" },
        { title: "Dog Crate Size Finder", url: "/pets/dog-crate-size-finder", icon: "🐶" },
        { title: "Egg Binding Risk Estimator", url: "/pets/bird-egg-binding-risk-estimator", icon: "💧" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Hand-Feeding Formula Amount (Chicks)" },
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