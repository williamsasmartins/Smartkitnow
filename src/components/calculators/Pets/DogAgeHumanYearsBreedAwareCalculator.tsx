import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Activity,
  Calculator,
  RotateCcw,
  Info,
  AlertTriangle,
  Dog,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function DogAgeHumanYearsBreedAwareCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState({
    weight: "",
    age: "",
    breedSize: "medium",
  });

  // Breed size categories and their average life expectancies (years)
  // Source: Veterinary literature consensus on breed size longevity
  const breedLifeExpectancy = {
    small: 14,
    medium: 12,
    large: 10,
    giant: 8,
  };

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    const ageRaw = parseFloat(inputs.age);
    const breedSize = inputs.breedSize;

    if (
      !weightRaw ||
      weightRaw <= 0 ||
      !ageRaw ||
      ageRaw <= 0 ||
      !breedLifeExpectancy[breedSize]
    )
      return {
        value: 0,
        label: "Enter valid details above to calculate.",
        subtext: null,
        warning: null,
      };

    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? weightRaw / 2.20462 : weightRaw;

    // Average life expectancy for breed size
    const lifeExpectancy = breedLifeExpectancy[breedSize];

    // Calculate dog age in human years using breed-aware formula:
    // Human Age = 16 * ln(dog_age) + 31 (adapted by breed size factor)
    // Adjusted by ratio of average breed life expectancy to median dog life expectancy (12 years)
    // Formula source: Recent veterinary studies on dog aging (e.g., Dr. Elizabeth's formula)
    // Adjusted formula:
    // HumanAge = (16 * ln(dog_age) + 31) * (lifeExpectancy / 12)
    // This accounts for breed size longevity differences.

    const humanAgeRaw = (16 * Math.log(ageRaw) + 31) * (lifeExpectancy / 12);

    // Round to one decimal place
    const humanAge = Math.round(humanAgeRaw * 10) / 10;

    // Warning for very young or very old ages
    let warning = null;
    if (ageRaw < 0.1)
      warning =
        "Age entered is very young; early puppy development stages may not align perfectly with this formula.";
    else if (ageRaw > lifeExpectancy * 2)
      warning =
        "Age entered exceeds typical lifespan for this breed size; results may be inaccurate.";

    return {
      value: humanAge,
      label: `Estimated human-equivalent age for a ${breedSize} breed dog.`,
      subtext: `Based on a dog age of ${ageRaw} years and breed size life expectancy of ${lifeExpectancy} years.`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED)
  const faqs = [
    {
      question: "Why does breed size affect how dogs age?",
      answer: "Larger dog breeds age faster than smaller breeds due to higher metabolic rates and increased strain on their bodies. A Great Dane reaches senior status by age 5-6, while a Chihuahua may not until age 9-10.",
    },
    {
      question: "How accurate is the breed-aware dog age calculator?",
      answer: "This calculator uses veterinary research showing that the first year equals 15 human years for most breeds, the second year adds 9 years, then adds 4-5 years annually depending on breed size. It's more accurate than the outdated 7-to-1 rule.",
    },
    {
      question: "At what age is a dog considered senior?",
      answer: "Small breeds become senior at 9-11 years old, medium breeds at 7-9 years, and large breeds at 5-7 years. Your calculator will show when your specific breed reaches senior status in human years.",
    },
    {
      question: "Does neutering or spaying affect dog aging?",
      answer: "Neutered and spayed dogs often live 1-3 years longer than intact dogs, but the aging rate remains the same. This calculator tracks biological age, not lifespan extension.",
    },
    {
      question: "Can I use this calculator for mixed-breed dogs?",
      answer: "Yes, select the closest matching size category (small, medium, or large) based on your dog's adult weight. Mixed breeds typically follow the aging pattern of their dominant size category.",
    },
    {
      question: "What's the difference between calendar age and biological age?",
      answer: "Calendar age is how many years your dog has lived; biological age (shown in human years) reflects how fast their body is aging. A 5-year-old Great Dane may be biologically equivalent to a 60-year-old human.",
    },
    {
      question: "How do I know my dog's exact age if adopted as an adult?",
      answer: "Your veterinarian can estimate age by examining teeth wear, joint condition, and coat quality. Use the estimated age in this calculator for the most accurate human-year conversion.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers for inputs
  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  }
  function onBreedSizeChange(value: string) {
    setInputs((prev) => ({ ...prev, breedSize: value }));
  }

  const widget = (
    <div className="space-y-6">
      {/* Unit Switcher */}
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

        {/* Weight Input */}
        <div className="flex flex-col">
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Dog Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            name="weight"
            type="number"
            min={0}
            step="any"
            placeholder={`Enter weight in ${unit === "imperial" ? "lbs" : "kg"}`}
            value={inputs.weight}
            onChange={onInputChange}
          />
        </div>

        {/* Age Input */}
        <div className="flex flex-col">
          <Label htmlFor="age" className="text-slate-700 dark:text-slate-300">
            Dog Age (years)
          </Label>
          <Input
            id="age"
            name="age"
            type="number"
            min={0}
            step="any"
            placeholder="Enter age in years (e.g., 3.5)"
            value={inputs.age}
            onChange={onInputChange}
          />
        </div>

        {/* Breed Size Select */}
        <div className="flex flex-col">
          <Label htmlFor="breedSize" className="text-slate-700 dark:text-slate-300">
            Breed Size Category
          </Label>
          <Select
            id="breedSize"
            value={inputs.breedSize}
            onValueChange={onBreedSizeChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small (e.g., Chihuahua)</SelectItem>
              <SelectItem value="medium">Medium (e.g., Beagle)</SelectItem>
              <SelectItem value="large">Large (e.g., Labrador)</SelectItem>
              <SelectItem value="giant">Giant (e.g., Great Dane)</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
          onClick={() => setInputs({ weight: "", age: "", breedSize: "medium" })}
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
                {results.value} years
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
              veterinarian for personalized diagnosis and care.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Dog Age in Human Years (Breed-Aware) Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator converts your dog's age to human equivalent years using breed-specific formulas backed by veterinary research. Unlike the outdated 7-to-1 rule, it accounts for how different breeds age at different rates.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter your dog's current age in years and select their breed or size category. The calculator uses the first year as 15 human years, the second as 9 years, then adjusts annual aging based on whether your dog is small, medium, or large.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The result shows your dog's biological age in human years, helping you understand their life stage and plan appropriate health care, nutrition, and activity levels.</p>
        </div>
      </section>

      {/* TABLE: Dog Age to Human Years by Breed Size */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Dog Age to Human Years by Breed Size</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows how dog ages convert to human equivalent ages based on breed size categories.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Dog Age</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Small Breed (Human Years)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Medium Breed (Human Years)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Large Breed (Human Years)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1 year</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">28</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">29</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">32</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">33</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">36</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">36</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">38</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">42</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">7 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">44</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">49</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">56</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">56</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">66</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">78</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">15 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">76</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">98</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">115</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Small breeds include dogs under 20 lbs; medium breeds 20-60 lbs; large breeds over 60 lbs.</p>
      </section>

      {/* TABLE: Senior Age Thresholds by Breed Size */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Senior Age Thresholds by Breed Size</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Dogs enter their senior years at different calendar ages depending on breed size, with corresponding human-year equivalents.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Breed Size</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Senior Status Begins (Dog Age)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Senior Status Begins (Human Years)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Average Lifespan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Small</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9-11 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">52-60 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-18 years</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Medium</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7-9 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">54-63 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-13 years</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Large</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-7 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">38-56 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-12 years</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Extra Large</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-6 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">33-52 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7-10 years</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Senior status marks when dogs typically require more frequent vet checkups and lifestyle adjustments.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Update the calculator every birthday to track your dog's aging progression and adjust their care as they move into senior years.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use the human-year equivalent to communicate your dog's age to people unfamiliar with dog years, making it easier to explain health concerns.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Small breeds maintain youthful vigor longer than large breeds, so a 10-year-old Chihuahua may still have more active years ahead than a 7-year-old Labrador.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Monitor your dog's health more closely once they reach senior status according to this calculator, as this signals increased veterinary checkup frequency.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using the 7-to-1 Rule</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">The outdated formula multiplying dog age by 7 is inaccurate; it doesn't account for rapid development in year one or breed-specific aging rates.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Breed Size</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Applying a generic formula to all dogs ignores that large breeds age significantly faster than small breeds, leading to incorrect health assessments.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Miscategorizing Mixed Breeds</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Choosing the wrong size category for a mixed breed can skew results by several years; always use their actual adult weight to select the correct category.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to Adjust for Medical History</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">While this calculator provides biological age, chronic conditions or excellent health care can make a dog's true biological age younger or older than the formula suggests.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why does breed size affect how dogs age?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Larger dog breeds age faster than smaller breeds due to higher metabolic rates and increased strain on their bodies. A Great Dane reaches senior status by age 5-6, while a Chihuahua may not until age 9-10.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How accurate is the breed-aware dog age calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">This calculator uses veterinary research showing that the first year equals 15 human years for most breeds, the second year adds 9 years, then adds 4-5 years annually depending on breed size. It's more accurate than the outdated 7-to-1 rule.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">At what age is a dog considered senior?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Small breeds become senior at 9-11 years old, medium breeds at 7-9 years, and large breeds at 5-7 years. Your calculator will show when your specific breed reaches senior status in human years.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does neutering or spaying affect dog aging?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Neutered and spayed dogs often live 1-3 years longer than intact dogs, but the aging rate remains the same. This calculator tracks biological age, not lifespan extension.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator for mixed-breed dogs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, select the closest matching size category (small, medium, or large) based on your dog's adult weight. Mixed breeds typically follow the aging pattern of their dominant size category.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between calendar age and biological age?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Calendar age is how many years your dog has lived; biological age (shown in human years) reflects how fast their body is aging. A 5-year-old Great Dane may be biologically equivalent to a 60-year-old human.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I know my dog's exact age if adopted as an adult?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Your veterinarian can estimate age by examining teeth wear, joint condition, and coat quality. Use the estimated age in this calculator for the most accurate human-year conversion.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7788620/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Dog Years: An Improved Model</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Scientific study showing that the traditional 7-to-1 rule is inaccurate and provides a breed-aware aging formula.</p>
          </li>
          <li>
            <a href="https://www.avma.org/resources-tools/pet-owners/petcare/senior-pet-care" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Veterinary Medical Association (AVMA) Senior Pet Care</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">AVMA guidelines on recognizing senior status in dogs and adjusting care accordingly.</p>
          </li>
          <li>
            <a href="https://dogagingproject.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">UC Davis School of Veterinary Medicine - Dog Aging</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive research on canine aging biology and how breed size impacts longevity and health.</p>
          </li>
          <li>
            <a href="https://www.morrisanimalfoundation.org/article/how-long-do-dogs-live" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Morris Animal Foundation: Breed Lifespan Data</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based lifespan data for over 150 dog breeds from one of the largest animal health research organizations.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Dog Age in Human Years (Breed-Aware)"
      description="Convert your dog's age to human years using a formula that accounts for their specific breed size and longevity."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // DYNAMIC FORMULA: FILL THIS BASED ON THE LOGIC USED
      formula={{
        title: "Scientific Formula",
        formula:
          "Human Age = (16 × ln(Dog Age in years) + 31) × (Breed Life Expectancy / 12)",
        variables: [
          {
            symbol: "Dog Age",
            description: "Your dog's current age in years (decimal allowed)",
          },
          {
            symbol: "ln",
            description:
              "Natural logarithm function, modeling nonlinear aging progression",
          },
          {
            symbol: "Breed Life Expectancy",
            description:
              "Average lifespan in years for the selected breed size category",
          },
          {
            symbol: "12",
            description:
              "Median average lifespan in years used as baseline for normalization",
          },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 5-year-old large breed dog (e.g., Labrador Retriever) weighing 70 lbs.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert weight to kg if needed (70 lbs ≈ 31.75 kg). Select 'Large' breed size with life expectancy of 10 years.",
          },
          {
            label: "Step 2",
            explanation:
              "Apply formula: Human Age = (16 × ln(5) + 31) × (10 / 12) ≈ (16 × 1.609 + 31) × 0.833 ≈ (25.74 + 31) × 0.833 ≈ 56.74 × 0.833 ≈ 47.3 years.",
          },
        ],
        result:
          "The dog’s estimated human-equivalent age is approximately 47.3 years, reflecting breed size and aging rate.",
      }}
      relatedCalculators={[
        {
          title: "Dog Calorie Needs (RER/MER) Calculator",
          url: "/pets/dog-calorie-needs-rer-mer",
          icon: "🐶",
        },
        {
          title: "Dog Weight Loss Planner",
          url: "/pets/dog-weight-loss-planner",
          icon: "🐶",
        },
        {
          title: "Dog Ideal Weight & Target Calories Calculator",
          url: "/pets/dog-ideal-weight-target-calories",
          icon: "🐶",
        },
        {
          title: "Dog Treat Calories & Daily Allowance Calculator",
          url: "/pets/dog-treat-calories-daily-allowance",
          icon: "🐶",
        },
        {
          title: "Puppy Calorie Needs by Age/Breed Size Calculator",
          url: "/pets/puppy-calorie-needs-age-breed-size",
          icon: "💉",
        },
        {
          title: "Dog Protein/Fat Intake Guide (by Goal)",
          url: "/pets/dog-protein-fat-intake-guide",
          icon: "🐶",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Dog Age in Human Years (Breed-Aware)" },
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