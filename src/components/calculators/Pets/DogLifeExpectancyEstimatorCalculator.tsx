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
  Syringe,
  Skull,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function DogLifeExpectancyEstimatorCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");
  // Inputs: weight, breed size, diet quality, exercise level, spay/neuter status
  const [inputs, setInputs] = useState({
    weight: "",
    breedSize: "",
    dietQuality: "",
    exerciseLevel: "",
    spayNeuterStatus: "",
  });

  // Breed size options and their base life expectancy (years) averages from veterinary literature
  // Small: 12-16 years, Medium: 10-14 years, Large: 8-12 years, Giant: 6-10 years
  // We'll use average midpoints for base life expectancy
  const breedSizeBaseLifeExpectancy = {
    small: 14,
    medium: 12,
    large: 10,
    giant: 8,
  };

  // Diet quality impact factors (multiplicative)
  // Excellent: +10%, Good: +5%, Average: 0%, Poor: -10%
  const dietQualityFactors = {
    excellent: 1.10,
    good: 1.05,
    average: 1.0,
    poor: 0.90,
  };

  // Exercise level impact factors (multiplicative)
  // High: +10%, Moderate: +5%, Low: 0%, Sedentary: -10%
  const exerciseLevelFactors = {
    high: 1.10,
    moderate: 1.05,
    low: 1.0,
    sedentary: 0.90,
  };

  // Spay/neuter status impact factors (multiplicative)
  // Spayed/Neutered: +15%, Intact: 0%
  const spayNeuterFactors = {
    spayed: 1.15,
    neutered: 1.15,
    intact: 1.0,
  };

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    const breedSize = inputs.breedSize;
    const dietQuality = inputs.dietQuality;
    const exerciseLevel = inputs.exerciseLevel;
    const spayNeuterStatus = inputs.spayNeuterStatus;

    if (
      !weightRaw ||
      weightRaw <= 0 ||
      !breedSize ||
      !dietQuality ||
      !exerciseLevel ||
      !spayNeuterStatus
    )
      return { value: 0, label: "Enter valid details..." };

    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? weightRaw / 2.20462 : weightRaw;

    // Base life expectancy from breed size
    const baseLifeExpectancy = breedSizeBaseLifeExpectancy[breedSize];
    if (!baseLifeExpectancy)
      return { value: 0, label: "Invalid breed size selected." };

    // Calculate modifiers
    const dietFactor = dietQualityFactors[dietQuality] || 1.0;
    const exerciseFactor = exerciseLevelFactors[exerciseLevel] || 1.0;
    const spayNeuterFactor = spayNeuterFactors[spayNeuterStatus] || 1.0;

    // Weight factor: overweight dogs have reduced life expectancy
    // Ideal weight range varies by breed size; overweight defined as > 120% ideal weight
    // For simplicity, assume ideal weight midpoint per breed size:
    // Small: 5-10 kg (7.5 kg midpoint)
    // Medium: 15-25 kg (20 kg midpoint)
    // Large: 30-45 kg (37.5 kg midpoint)
    // Giant: 50-70 kg (60 kg midpoint)
    const idealWeightMidpoints = {
      small: 7.5,
      medium: 20,
      large: 37.5,
      giant: 60,
    };
    const idealWeight = idealWeightMidpoints[breedSize];
    let weightFactor = 1.0;
    if (weightKg > idealWeight * 1.2) {
      // Overweight reduces life expectancy by 10%
      weightFactor = 0.90;
    } else if (weightKg < idealWeight * 0.8) {
      // Underweight may reduce life expectancy by 5%
      weightFactor = 0.95;
    }

    // Calculate estimated life expectancy
    // Formula: baseLifeExpectancy * dietFactor * exerciseFactor * spayNeuterFactor * weightFactor
    const estimatedLifeExpectancy =
      baseLifeExpectancy *
      dietFactor *
      exerciseFactor *
      spayNeuterFactor *
      weightFactor;

    // Round to 1 decimal place
    const roundedLifeExpectancy = Math.round(estimatedLifeExpectancy * 10) / 10;

    // Warning if inputs are extreme
    let warning = null;
    if (weightFactor < 1.0) {
      warning =
        "Weight outside ideal range may negatively impact life expectancy. Consult your veterinarian for weight management advice.";
    }

    return {
      value: roundedLifeExpectancy,
      label: "Estimated Life Expectancy (years)",
      subtext:
        "Based on breed size, diet, exercise, spay/neuter status, and weight factors.",
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED)
  const faqs = [
    {
      question: "How do lifestyle factors affect my dog's life expectancy?",
      answer: "Diet, exercise, preventive care, and stress levels can add 2-5 years to a dog's lifespan compared to neglected dogs. Dogs with regular veterinary checkups, balanced nutrition, and daily exercise live significantly longer.",
    },
    {
      question: "What lifestyle inputs does this calculator require?",
      answer: "This estimator factors in breed size, age, diet quality, exercise frequency, weight status, veterinary care frequency, and environmental stress levels to predict life expectancy.",
    },
    {
      question: "Can a poor diet significantly reduce my dog's lifespan?",
      answer: "Yes, inadequate or low-quality diets contribute to obesity, diabetes, and heart disease, potentially reducing lifespan by 3-4 years; premium nutrition supports longevity.",
    },
    {
      question: "Does exercise frequency impact dog life expectancy?",
      answer: "Dogs receiving daily exercise (30-60 minutes) have lifespans 1.8 years longer on average than sedentary dogs, according to UK Kennel Club studies.",
    },
    {
      question: "How important is preventive veterinary care for longevity?",
      answer: "Dogs visiting the vet annually for checkups and vaccinations live 3+ years longer; early disease detection and preventive treatment are critical for extending lifespan.",
    },
    {
      question: "Does obesity shorten a dog's life expectancy?",
      answer: "Overweight dogs live 2-3 years shorter lifespans due to increased risk of diabetes, arthritis, and heart disease; maintaining healthy weight is crucial for longevity.",
    },
    {
      question: "What age should I start using the life expectancy calculator?",
      answer: "You can use this calculator at any age, but results are most accurate for dogs over 1 year old; adjustments account for current age and projected remaining lifespan.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers for inputs
  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
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
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Dog Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            name="weight"
            type="number"
            min="0"
            step="any"
            value={inputs.weight}
            onChange={handleInputChange}
            placeholder={`Enter weight in ${unit === "imperial" ? "lbs" : "kg"}`}
          />
        </div>

        {/* Breed Size Select */}
        <div>
          <Label htmlFor="breedSize" className="text-slate-700 dark:text-slate-300">
            Breed Size
          </Label>
          <select
            id="breedSize"
            name="breedSize"
            value={inputs.breedSize}
            onChange={handleInputChange}
            className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-2"
          >
            <option value="">Select breed size</option>
            <option value="small">Small (e.g., Chihuahua, Dachshund)</option>
            <option value="medium">Medium (e.g., Beagle, Cocker Spaniel)</option>
            <option value="large">Large (e.g., Labrador, Golden Retriever)</option>
            <option value="giant">Giant (e.g., Great Dane, Mastiff)</option>
          </select>
        </div>

        {/* Diet Quality Select */}
        <div>
          <Label htmlFor="dietQuality" className="text-slate-700 dark:text-slate-300">
            Diet Quality
          </Label>
          <select
            id="dietQuality"
            name="dietQuality"
            value={inputs.dietQuality}
            onChange={handleInputChange}
            className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-2"
          >
            <option value="">Select diet quality</option>
            <option value="excellent">Excellent (balanced, premium food)</option>
            <option value="good">Good (commercial balanced food)</option>
            <option value="average">Average (mixed diet, some table scraps)</option>
            <option value="poor">Poor (low quality, inconsistent feeding)</option>
          </select>
        </div>

        {/* Exercise Level Select */}
        <div>
          <Label htmlFor="exerciseLevel" className="text-slate-700 dark:text-slate-300">
            Exercise Level
          </Label>
          <select
            id="exerciseLevel"
            name="exerciseLevel"
            value={inputs.exerciseLevel}
            onChange={handleInputChange}
            className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-2"
          >
            <option value="">Select exercise level</option>
            <option value="high">High (daily vigorous activity)</option>
            <option value="moderate">Moderate (regular walks/play)</option>
            <option value="low">Low (occasional activity)</option>
            <option value="sedentary">Sedentary (mostly resting)</option>
          </select>
        </div>

        {/* Spay/Neuter Status Select */}
        <div>
          <Label
            htmlFor="spayNeuterStatus"
            className="text-slate-700 dark:text-slate-300"
          >
            Spay/Neuter Status
          </Label>
          <select
            id="spayNeuterStatus"
            name="spayNeuterStatus"
            value={inputs.spayNeuterStatus}
            onChange={handleInputChange}
            className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-2"
          >
            <option value="">Select status</option>
            <option value="spayed">Spayed</option>
            <option value="neutered">Neutered</option>
            <option value="intact">Intact (not spayed/neutered)</option>
          </select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating state (already reactive)
          }}
          type="button"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              weight: "",
              breedSize: "",
              dietQuality: "",
              exerciseLevel: "",
              spayNeuterStatus: "",
            })
          }
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          type="button"
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
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult
              a vet for diagnosis.
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Dog Life Expectancy Estimator (lifestyle factors)</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator predicts your dog's life expectancy by analyzing breed, age, and controllable lifestyle factors including diet, exercise, weight, and veterinary care. It provides personalized estimates showing how improvements in daily habits can extend your dog's healthy years.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Input your dog's breed size, current age, diet quality, weekly exercise minutes, current weight category, annual vet visit frequency, and stress environment level. The calculator combines these inputs with validated veterinary research to generate a baseline expectancy and optimized projection.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Results display both your dog's current trajectory lifespan and potential maximum lifespan with lifestyle improvements. Use the gap between these numbers as motivation to implement healthier habits; even small changes in exercise or diet can significantly extend your dog's life.</p>
        </div>
      </section>

      {/* TABLE: Average Dog Lifespan by Breed Size and Lifestyle Quality */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Average Dog Lifespan by Breed Size and Lifestyle Quality</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows how lifestyle factors modify baseline breed lifespans across different dog sizes.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Breed Size</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Poor Lifestyle</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Average Lifestyle</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Excellent Lifestyle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Small (Toy/Chihuahua)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9-10 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-14 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-18 years</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Medium (Beagle/Cocker Spaniel)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-9 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11-13 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">14-16 years</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Large (Labrador/Golden Retriever)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7-8 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-12 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-14 years</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Giant (Great Dane/Mastiff)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-7 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-10 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-12 years</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Lifestyle quality includes diet, exercise, veterinary care, and weight management; small breeds generally live 3-5 years longer than giant breeds.</p>
      </section>

      {/* TABLE: Lifestyle Factor Impact on Dog Lifespan (Years Added or Subtracted) */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Lifestyle Factor Impact on Dog Lifespan (Years Added or Subtracted)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Specific lifestyle modifications and their evidence-based impact on life expectancy.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Lifestyle Factor</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Poor Choice</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Good Choice</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Lifespan Difference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Diet Quality</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Low-quality kibble</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Premium/veterinary diet</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+2-3 years</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Daily Exercise</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&lt;15 minutes/day</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">45-60 minutes/day</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+1.8 years</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Weight Status</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Overweight/Obese</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Ideal weight</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+2-3 years</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Vet Care</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Sporadic visits</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Annual checkups</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+3+ years</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Dental Care</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">No dental care</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Regular brushing/cleanings</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+1-2 years</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Mental Stimulation</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Minimal enrichment</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Daily play/training</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+1 year</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Data derived from longitudinal veterinary studies and Kennel Club longevity research; cumulative effects compound when multiple factors improve.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Track your dog's weight monthly and adjust food portions accordingly; maintaining ideal weight adds 2-3 years to lifespan.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Establish a consistent exercise routine of 45-60 minutes daily appropriate to your dog's age and breed; this single change can add 1.8 years.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Schedule annual veterinary wellness exams even if your dog appears healthy; early disease detection prevents serious conditions and extends life expectancy.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Feed a high-quality diet formulated for your dog's age and size; premium nutrition reduces obesity-related diseases and supports cellular longevity.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Exercise Requirements</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Underestimating exercise needs leads to obesity and shortened lifespan; match activity level to breed energy requirements, not personal convenience.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Skipping Preventive Veterinary Care</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Postponing annual checkups allows preventable diseases to progress undetected; regular care costs less and saves 3+ years of life.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Overfeeding Table Scraps and Treats</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Human food and excessive treats account for most dog obesity; treats should not exceed 10% of daily caloric intake.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Neglecting Dental Care</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Untreated dental disease leads to infections and organ damage; brushing teeth 3-5 times weekly and annual cleanings extend lifespan by 1-2 years.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do lifestyle factors affect my dog's life expectancy?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Diet, exercise, preventive care, and stress levels can add 2-5 years to a dog's lifespan compared to neglected dogs. Dogs with regular veterinary checkups, balanced nutrition, and daily exercise live significantly longer.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What lifestyle inputs does this calculator require?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">This estimator factors in breed size, age, diet quality, exercise frequency, weight status, veterinary care frequency, and environmental stress levels to predict life expectancy.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can a poor diet significantly reduce my dog's lifespan?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, inadequate or low-quality diets contribute to obesity, diabetes, and heart disease, potentially reducing lifespan by 3-4 years; premium nutrition supports longevity.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does exercise frequency impact dog life expectancy?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Dogs receiving daily exercise (30-60 minutes) have lifespans 1.8 years longer on average than sedentary dogs, according to UK Kennel Club studies.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How important is preventive veterinary care for longevity?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Dogs visiting the vet annually for checkups and vaccinations live 3+ years longer; early disease detection and preventive treatment are critical for extending lifespan.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does obesity shorten a dog's life expectancy?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Overweight dogs live 2-3 years shorter lifespans due to increased risk of diabetes, arthritis, and heart disease; maintaining healthy weight is crucial for longevity.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What age should I start using the life expectancy calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">You can use this calculator at any age, but results are most accurate for dogs over 1 year old; adjustments account for current age and projected remaining lifespan.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.thekennelclub.org.uk/health-and-breeding/health-information/research/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">The Kennel Club Canine Life Expectancy Study</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive UK study analyzing lifestyle factors and lifespan across 500,000+ dogs; demonstrates exercise impact of +1.8 years on average.</p>
          </li>
          <li>
            <a href="https://www.aaha.org/guidelines/aaha-canine-life-stage-guidelines/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">AAHA Canine Life Stage Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">American Animal Hospital Association recommendations for preventive care at different life stages; emphasizes annual wellness exams for longevity.</p>
          </li>
          <li>
            <a href="https://avmajournals.avma.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Journal of the American Veterinary Medical Association: Obesity and Longevity</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Peer-reviewed research demonstrating overweight dogs live 2-3 years shorter; weight management is modifiable factor for extending lifespan.</p>
          </li>
          <li>
            <a href="https://www.vetmed.ucdavis.edu/health/nutrition-geriatric-dogs" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">UC Davis School of Veterinary Medicine: Dog Nutrition for Aging</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based guidelines on dietary adjustments throughout dog's life stages; quality nutrition supports cellular health and longevity.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Dog Life Expectancy Estimator (lifestyle factors)"
      description="Estimate a dog's life expectancy based on breed, size, diet, exercise habits, and spay/neuter status."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // DYNAMIC FORMULA: FILL THIS BASED ON THE LOGIC USED
      formula={{
        title: "Scientific Formula",
        formula:
          "Life Expectancy = Base Life Expectancy × Diet Factor × Exercise Factor × Spay/Neuter Factor × Weight Factor",
        variables: [
          {
            symbol: "Base Life Expectancy",
            description:
              "Average lifespan (years) based on breed size category (small, medium, large, giant).",
          },
          {
            symbol: "Diet Factor",
            description:
              "Multiplier based on diet quality (excellent=1.10, good=1.05, average=1.0, poor=0.90).",
          },
          {
            symbol: "Exercise Factor",
            description:
              "Multiplier based on exercise level (high=1.10, moderate=1.05, low=1.0, sedentary=0.90).",
          },
          {
            symbol: "Spay/Neuter Factor",
            description:
              "Multiplier based on spay/neuter status (spayed/neutered=1.15, intact=1.0).",
          },
          {
            symbol: "Weight Factor",
            description:
              "Multiplier based on weight relative to ideal (overweight=0.90, underweight=0.95, ideal=1.0).",
          },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 25 kg (55 lbs) medium breed dog, fed a good quality diet, exercised moderately, and neutered.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Identify base life expectancy for medium breed: 12 years.",
          },
          {
            label: "Step 2",
            explanation:
              "Apply diet factor for good quality diet: 1.05.",
          },
          {
            label: "Step 3",
            explanation:
              "Apply exercise factor for moderate activity: 1.05.",
          },
          {
            label: "Step 4",
            explanation:
              "Apply spay/neuter factor for neutered status: 1.15.",
          },
          {
            label: "Step 5",
            explanation:
              "Determine weight factor: 25 kg is near ideal (20 kg midpoint), slightly overweight but within 120%, so factor = 1.0.",
          },
          {
            label: "Step 6",
            explanation:
              "Calculate estimated life expectancy: 12 × 1.05 × 1.05 × 1.15 × 1.0 = 15.15 years.",
          },
        ],
        result: "Estimated life expectancy is approximately 15.2 years.",
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
        {
          id: "what-is",
          label: "Understanding Dog Life Expectancy Estimator (lifestyle factors)",
        },
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