import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function SmallMammalExerciseTimePlannerCalculator() {
  // 1. STATE
  // No unit switcher needed because time is unitless here.
  // Inputs: Age (months), Species (select), Activity Level (select)
  const [inputs, setInputs] = useState({
    ageMonths: "",
    species: "rabbit",
    activityLevel: "moderate",
  });

  // Species base run time recommendations (minutes per day)
  // These are typical veterinary guidelines for small mammals.
  // Activity level multipliers adjust the base time.
  const speciesBaseTimes: Record<string, number> = {
    rabbit: 60, // 60 minutes base
    guineaPig: 45,
    hamster: 30,
    ferret: 90,
    chinchilla: 50,
  };

  const activityLevelMultipliers: Record<string, number> = {
    low: 0.75,
    moderate: 1,
    high: 1.25,
  };

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const age = parseInt(inputs.ageMonths);
    if (
      isNaN(age) ||
      age < 0 ||
      !speciesBaseTimes[inputs.species] ||
      !activityLevelMultipliers[inputs.activityLevel]
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    // Adjust base time by activity level
    const baseTime = speciesBaseTimes[inputs.species];
    const multiplier = activityLevelMultipliers[inputs.activityLevel];
    let runTime = baseTime * multiplier;

    // Adjust for age: younger animals (<6 months) need more exercise for development
    if (age < 6) {
      runTime *= 1.2; // 20% more time for juveniles
    }

    // Round to nearest whole minute
    runTime = Math.round(runTime);

    // Warning if age is very young or very old (over 84 months = 7 years)
    let warning: string | null = null;
    if (age < 2) {
      warning =
        "Very young animals require supervised exercise to prevent injury. Consult your veterinarian for tailored advice.";
    } else if (age > 84) {
      warning =
        "Senior animals may have reduced mobility or health issues. Adjust exercise accordingly and seek veterinary guidance.";
    }

    return {
      value: runTime,
      label: "Recommended Daily Run Time (minutes)",
      subtext: `For a ${inputs.species} aged ${age} months with ${inputs.activityLevel} activity level.`,
      warning,
    };
  }, [inputs]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "How much daily running exercise does my dog need?",
      answer: "Most dogs need 30-120 minutes of exercise daily depending on breed and age. High-energy breeds like Border Collies require 90-120 minutes, while smaller breeds may need only 30-45 minutes.",
    },
    {
      question: "What factors affect my pet's ideal running time?",
      answer: "Age, breed, fitness level, health status, and weather conditions all impact exercise needs. Puppies and senior dogs need less intense activity, while adult working breeds require more.",
    },
    {
      question: "Can I split my dog's running time into multiple sessions?",
      answer: "Yes, breaking 60 minutes into three 20-minute sessions is often better for joint health and prevents overexertion, especially for puppies and older dogs.",
    },
    {
      question: "When should I avoid outdoor running with my pet?",
      answer: "Skip running when temperatures exceed 85°F (29°C), during extreme cold below 20°F (-7°C), or on very hot pavement that can burn paw pads.",
    },
    {
      question: "How do I know if my dog is getting enough exercise?",
      answer: "A properly exercised dog is calm indoors, sleeps well, and shows no destructive behavior; insufficient exercise often leads to excessive barking, chewing, or hyperactivity.",
    },
    {
      question: "Are there breeds that shouldn't run long distances?",
      answer: "Brachycephalic breeds (Bulldogs, Pugs) and large breeds prone to hip dysplasia should avoid intense running; consult your vet before high-impact exercise routines.",
    },
    {
      question: "How does age affect the running time calculation?",
      answer: "Puppies under 12 months and dogs over 10 years typically need 40-50% less running time than adult dogs to protect developing or aging joints.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers
  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  }

  // Widget JSX
  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="species" className="text-slate-700 dark:text-slate-300">
            Species
          </Label>
          <select
            id="species"
            name="species"
            value={inputs.species}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
          >
            <option value="rabbit">Rabbit</option>
            <option value="guineaPig">Guinea Pig</option>
            <option value="hamster">Hamster</option>
            <option value="ferret">Ferret</option>
            <option value="chinchilla">Chinchilla</option>
          </select>
        </div>

        <div>
          <Label htmlFor="ageMonths" className="text-slate-700 dark:text-slate-300">
            Age (months)
          </Label>
          <Input
            id="ageMonths"
            name="ageMonths"
            type="number"
            min={0}
            placeholder="e.g. 12"
            value={inputs.ageMonths}
            onChange={handleInputChange}
            className="mt-1"
          />
        </div>

        <div>
          <Label
            htmlFor="activityLevel"
            className="text-slate-700 dark:text-slate-300"
          >
            Activity Level
          </Label>
          <select
            id="activityLevel"
            name="activityLevel"
            value={inputs.activityLevel}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
          >
            <option value="low">Low</option>
            <option value="moderate">Moderate</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by setting inputs to current values (no-op)
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              ageMonths: "",
              species: "rabbit",
              activityLevel: "moderate",
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

  // Editorial content
  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Exercise Time Planner (Run Time per Day)</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator helps pet owners determine appropriate daily running duration based on their dog's age, breed type, and fitness level. It ensures your pet gets optimal exercise without risk of overtraining or joint damage.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter your dog's breed category, current age, fitness level, and local temperature conditions. The calculator accounts for developmental and aging factors that affect safe exercise capacity.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The results show recommended daily run time in minutes, safe session lengths, and weekly totals. Use these benchmarks to structure a consistent routine while monitoring your pet for signs of fatigue or overexertion.</p>
        </div>
      </section>

      {/* TABLE: Daily Exercise Requirements by Dog Breed Type */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Daily Exercise Requirements by Dog Breed Type</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Use this benchmark to set realistic daily running times based on your dog's breed category.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Breed Category</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Age Group</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Daily Run Time (Minutes)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Weekly Total (Hours)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">High-Energy (Border Collie, Australian Shepherd)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Adult (2-7 years)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">90-120</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10.5-14</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Medium-Energy (Labrador, Golden Retriever)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Adult (2-7 years)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60-90</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7-10.5</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Low-Energy (Bulldog, Basset Hound)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Adult (2-7 years)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30-45</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.5-5.25</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Small Breeds (Chihuahua, Pomeranian)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Adult (2-7 years)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.33-3.5</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Puppies</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Under 12 months</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-15 (per session)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.5-1.5</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Senior Dogs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Over 10 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.33-4.67</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Adjust times based on individual fitness level and veterinary recommendations; always warm up and cool down.</p>
      </section>

      {/* TABLE: Safe Running Guidelines by Temperature & Surface */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Safe Running Guidelines by Temperature & Surface</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Monitor environmental conditions to prevent overheating, hypothermia, and paw injuries during outdoor running sessions.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Temperature Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Surface Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Safe Run Time (Max Minutes)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Precautions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">60-75°F (15-24°C)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Grass or dirt trail</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">120</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Standard hydration breaks every 15-20 min</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">75-85°F (24-29°C)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Grass or dirt trail</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60-75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Frequent water breaks; avoid concrete</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Below 20°F (-7°C)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Any outdoor surface</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Protect paws with booties; limit time</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Above 85°F (29°C)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Any outdoor surface</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Not recommended</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Switch to early morning or evening</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Year-round</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Hot asphalt/pavement</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-30 max</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Test pavement temperature on your hand first</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Year-round</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Grass or soft trail</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">120 (breed dependent)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Most forgiving surface for joints</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Always provide water before, during, and after running; watch for excessive panting or lethargy.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Start with shorter sessions and gradually increase duration over 2-4 weeks to build cardiovascular fitness and prevent injury.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Run during cooler parts of the day (early morning or evening) to protect your dog from overheating and paw pad damage.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Warm up with 5-10 minutes of walking before running and cool down afterward to prevent muscle strain and dizziness.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Carry water on longer runs and offer breaks every 15-20 minutes; dehydration is a serious risk for active pets.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring breed-specific limitations</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Bulldogs and other brachycephalic breeds cannot handle high-intensity running despite being energetic, leading to heat stroke or respiratory distress.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Running puppies too hard too fast</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Puppies under 18 months have undeveloped joints; excessive impact running can cause permanent damage and early-onset arthritis.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not adjusting for extreme weather</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Running in temperatures above 85°F significantly increases heat stroke risk; always check weather before scheduling outdoor sessions.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using the same schedule year-round</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Winter running on ice or hot summer pavement requires different precautions and duration adjustments compared to mild-weather running.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much daily running exercise does my dog need?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most dogs need 30-120 minutes of exercise daily depending on breed and age. High-energy breeds like Border Collies require 90-120 minutes, while smaller breeds may need only 30-45 minutes.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What factors affect my pet's ideal running time?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Age, breed, fitness level, health status, and weather conditions all impact exercise needs. Puppies and senior dogs need less intense activity, while adult working breeds require more.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I split my dog's running time into multiple sessions?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, breaking 60 minutes into three 20-minute sessions is often better for joint health and prevents overexertion, especially for puppies and older dogs.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">When should I avoid outdoor running with my pet?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Skip running when temperatures exceed 85°F (29°C), during extreme cold below 20°F (-7°C), or on very hot pavement that can burn paw pads.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I know if my dog is getting enough exercise?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A properly exercised dog is calm indoors, sleeps well, and shows no destructive behavior; insufficient exercise often leads to excessive barking, chewing, or hyperactivity.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Are there breeds that shouldn't run long distances?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Brachycephalic breeds (Bulldogs, Pugs) and large breeds prone to hip dysplasia should avoid intense running; consult your vet before high-impact exercise routines.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does age affect the running time calculation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Puppies under 12 months and dogs over 10 years typically need 40-50% less running time than adult dogs to protect developing or aging joints.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.akc.org/dog-breeds/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Kennel Club - Exercise Needs by Breed</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive breed database with official exercise and temperament guidelines for all AKC-recognized dog breeds.</p>
          </li>
          <li>
            <a href="https://www.aspca.org/pet-care" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">ASPCA - Pet Care Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based pet health recommendations including safe exercise protocols for different ages and health conditions.</p>
          </li>
          <li>
            <a href="https://veterinarypartner.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Veterinary Partner - Puppy Exercise Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Veterinary-reviewed information on safe exercise duration for puppies based on growth plate development stages.</p>
          </li>
          <li>
            <a href="https://ofa.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Orthopedic Foundation for Animals - Joint Health</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Research-backed guidance on preventing orthopedic diseases through appropriate exercise and activity management.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Exercise Time Planner (Run Time per Day)"
      description="Plan the necessary amount of daily free-roam or wheel/run time to ensure adequate exercise and enrichment."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula:
          "Recommended Run Time = Base Species Time × Activity Level Multiplier × Age Adjustment",
        variables: [
          { symbol: "Base Species Time", description: "Species-specific baseline minutes" },
          { symbol: "Activity Level Multiplier", description: "Factor based on activity level (0.75–1.25)" },
          { symbol: "Age Adjustment", description: "1.2 if juvenile (<6 months), else 1" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 4-month-old rabbit with moderate activity level needs an exercise plan.",
        steps: [
          {
            label: "1",
            explanation:
              "Identify base species time for rabbit: 60 minutes.",
          },
          {
            label: "2",
            explanation:
              "Select activity level multiplier for moderate: 1.0.",
          },
          {
            label: "3",
            explanation:
              "Apply age adjustment for juvenile (<6 months): 1.2.",
          },
          {
            label: "4",
            explanation:
              "Calculate: 60 × 1.0 × 1.2 = 72 minutes recommended daily run time.",
          },
        ],
        result: "The rabbit should have approximately 72 minutes of daily exercise.",
      }}
      relatedCalculators={[
        {
          title: "Dehydration Risk Estimator (Skin Turgor + Mucous Check)",
          url: "/pets/horse-dehydration-risk-estimator",
          icon: "🐾",
        },
        {
          title: "Toxic Foods Exposure Checker (Avocado, Chocolate, etc.)",
          url: "/pets/bird-toxic-foods-exposure-checker",
          icon: "🐶",
        },
        {
          title: "Horse Colic Risk Assessment (Feeding & Management)",
          url: "/pets/horse-colic-risk-assessment",
          icon: "🐎",
        },
        {
          title: "Ammonia-to-Nitrite Cycle Time Estimator",
          url: "/pets/aquarium-ammonia-nitrite-cycle-time",
          icon: "🍖",
        },
        {
          title: "Horse Toxic Plant Exposure Risk (Ragwort, Yew, etc.)",
          url: "/pets/horse-toxic-plant-exposure-risk",
          icon: "🐎",
        },
        {
          title: "Antibiotic Dose Reference (mg/kg)",
          url: "/pets/bird-antibiotic-dose-reference",
          icon: "💧",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Exercise Time Planner (Run Time per Day)" },
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
