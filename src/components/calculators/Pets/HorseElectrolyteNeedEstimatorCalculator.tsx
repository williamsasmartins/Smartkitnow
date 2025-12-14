import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function HorseElectrolyteNeedEstimatorCalculator() {
  // 1. STATE
  // Unit system: Imperial (lbs) or Metric (kg)
  const [unit, setUnit] = useState("imperial");

  // Inputs:
  // weight: horse body weight (lbs or kg)
  // exerciseDuration: duration of exercise in minutes
  // ambientTemp: ambient temperature in °F or °C
  // sweatRate: estimated sweat rate in L/hr (optional, default average)
  const [inputs, setInputs] = useState({
    weight: "",
    exerciseDuration: "",
    ambientTemp: "",
    sweatRate: "",
  });

  // Helper: convert lbs to kg
  const toKg = (val: number) => val / 2.20462;
  // Convert °F to °C
  const fToC = (f: number) => (f - 32) * (5 / 9);

  // 2. LOGIC ENGINE
  // Electrolyte need estimation based on:
  // - Weight (kg)
  // - Exercise duration (hr)
  // - Ambient temperature (°C)
  // - Sweat rate (L/hr) - if not provided, use average 10 L/hr for moderate exercise
  //
  // Electrolyte loss (g) = Sweat Rate (L/hr) * Exercise Duration (hr) * Electrolyte Concentration (g/L)
  // Electrolyte Concentration varies with heat and exercise intensity; typical values:
  // Sodium (Na): ~7 g/L, Potassium (K): ~2 g/L, Chloride (Cl): ~7 g/L
  // Total electrolytes ~16 g/L sweat
  //
  // Adjust sweat rate by ambient temperature:
  // If ambientTemp > 25°C, increase sweat rate by 20%
  //
  // Final electrolyte need (grams) = Adjusted Sweat Rate * Duration * 16 g/L
  //
  // Output: Total electrolyte need in grams for the exercise session

  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    const durationRaw = parseFloat(inputs.exerciseDuration);
    const tempRaw = parseFloat(inputs.ambientTemp);
    const sweatRateRaw = parseFloat(inputs.sweatRate);

    if (
      isNaN(weightRaw) ||
      isNaN(durationRaw) ||
      isNaN(tempRaw) ||
      weightRaw <= 0 ||
      durationRaw <= 0
    ) {
      return {
        value: 0,
        label: "Please enter valid positive numbers for weight, exercise duration, and ambient temperature.",
        subtext: null,
        warning: null,
      };
    }

    // Convert inputs to metric for calculation
    const weightKg = unit === "imperial" ? toKg(weightRaw) : weightRaw;
    const ambientC = unit === "imperial" ? fToC(tempRaw) : tempRaw;
    const durationHr = durationRaw / 60; // minutes to hours

    // Default sweat rate if not provided or invalid
    // Average sweat rate for moderate exercise ~10 L/hr for 500 kg horse
    // Scale sweat rate linearly with weight (typical horse ~500 kg)
    const baseSweatRatePerKg = 10 / 500; // L/hr per kg
    let sweatRateLhr =
      !isNaN(sweatRateRaw) && sweatRateRaw > 0
        ? sweatRateRaw
        : baseSweatRatePerKg * weightKg;

    // Adjust sweat rate for heat stress: +20% if ambient > 25°C
    if (ambientC > 25) {
      sweatRateLhr *= 1.2;
    }

    // Electrolyte concentration in sweat (g/L)
    // Total ~16 g/L (Na + K + Cl)
    const electrolyteConcentration = 16;

    // Total electrolyte need (grams)
    const totalElectrolytes = sweatRateLhr * durationHr * electrolyteConcentration;

    // Round to 1 decimal place
    const totalRounded = Math.round(totalElectrolytes * 10) / 10;

    // Contextual label
    const label = `Estimated total electrolyte loss during exercise`;

    // Warning if inputs are extreme
    let warning = null;
    if (durationHr > 4) {
      warning =
        "Exercise duration exceeds 4 hours. Prolonged electrolyte loss may require veterinary supervision.";
    } else if (ambientC > 35) {
      warning =
        "High ambient temperature detected. Ensure adequate hydration and electrolyte replacement.";
    }

    return {
      value: totalRounded,
      label,
      subtext: "grams of electrolytes lost (Na, K, Cl combined)",
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is electrolyte supplementation important for horses during exercise and heat?",
      answer:
        "Electrolytes such as sodium, potassium, and chloride are essential for maintaining fluid balance, nerve function, and muscle contractions in horses. During exercise and exposure to heat, horses lose significant amounts of these electrolytes through sweat, risking dehydration and muscle fatigue. Supplementation helps restore these vital minerals, supporting optimal performance and preventing heat-related illnesses.",
    },
    {
      question: "How does ambient temperature affect a horse's electrolyte needs?",
      answer:
        "Higher ambient temperatures increase a horse's sweat rate as the body works harder to cool itself, leading to greater electrolyte loss. This elevated loss means horses require more electrolyte replacement during hot weather to maintain hydration and physiological balance. Ignoring this can result in dehydration, colic, or heat stroke, emphasizing the need to adjust supplementation based on temperature.",
    },
    {
      question: "Can I use this calculator if I don’t know my horse’s exact sweat rate?",
      answer:
        "Yes, the calculator provides a default sweat rate based on average values for horses of similar weight during moderate exercise. While individual sweat rates vary, this estimate offers a practical baseline for electrolyte needs. For more precise supplementation, measuring your horse’s sweat rate or consulting a veterinarian is recommended, especially for intense or prolonged activities.",
    },
    {
      question: "What are the risks of over-supplementing electrolytes in horses?",
      answer:
        "Excessive electrolyte supplementation can disrupt the horse’s natural mineral balance, potentially causing gastrointestinal upset, dehydration, or kidney strain. Over-supplementation may also reduce water intake if the horse finds the electrolyte solution unpalatable. It is crucial to balance electrolyte replacement with adequate water and follow veterinary guidance to avoid adverse effects.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Widget input handlers
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    // Allow only numbers and decimal point
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
              <SelectItem value="imperial">Imperial (lbs, °F)</SelectItem>
              <SelectItem value="metric">Metric (kg, °C)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Horse Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            name="weight"
            type="text"
            inputMode="decimal"
            placeholder={unit === "imperial" ? "e.g. 1100" : "e.g. 500"}
            value={inputs.weight}
            onChange={handleInputChange}
            aria-describedby="weight-desc"
          />
          <p id="weight-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter your horse’s body weight to estimate electrolyte loss accurately.
          </p>
        </div>

        <div>
          <Label htmlFor="exerciseDuration" className="text-slate-700 dark:text-slate-300">
            Exercise Duration (minutes)
          </Label>
          <Input
            id="exerciseDuration"
            name="exerciseDuration"
            type="text"
            inputMode="decimal"
            placeholder="e.g. 60"
            value={inputs.exerciseDuration}
            onChange={handleInputChange}
            aria-describedby="duration-desc"
          />
          <p id="duration-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Duration of exercise or activity causing sweating.
          </p>
        </div>

        <div>
          <Label htmlFor="ambientTemp" className="text-slate-700 dark:text-slate-300">
            Ambient Temperature ({unit === "imperial" ? "°F" : "°C"})
          </Label>
          <Input
            id="ambientTemp"
            name="ambientTemp"
            type="text"
            inputMode="decimal"
            placeholder={unit === "imperial" ? "e.g. 85" : "e.g. 29"}
            value={inputs.ambientTemp}
            onChange={handleInputChange}
            aria-describedby="temp-desc"
          />
          <p id="temp-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Ambient temperature during exercise impacts sweat rate and electrolyte loss.
          </p>
        </div>

        <div>
          <Label htmlFor="sweatRate" className="text-slate-700 dark:text-slate-300">
            Sweat Rate (L/hr) <span className="text-slate-400">(optional)</span>
          </Label>
          <Input
            id="sweatRate"
            name="sweatRate"
            type="text"
            inputMode="decimal"
            placeholder="Leave blank for average"
            value={inputs.sweatRate}
            onChange={handleInputChange}
            aria-describedby="sweat-desc"
          />
          <p id="sweat-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter if known; otherwise, average sweat rate is used based on weight and conditions.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Force re-calculation by updating inputs state (no-op)
            setInputs((prev) => ({ ...prev }));
          }}
          aria-label="Calculate electrolyte need"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", exerciseDuration: "", ambientTemp: "", sweatRate: "" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" role="region" aria-live="polite">
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
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a veterinarian for diagnosis and tailored advice.
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
          Understanding Horse Electrolyte Need Estimator (Exercise & Heat)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Electrolytes are minerals critical to a horse’s physiological functions, including nerve transmission, muscle contraction, and fluid balance. During exercise, especially in hot conditions, horses lose substantial amounts of electrolytes through sweat, which can lead to dehydration, muscle cramps, and decreased performance if not adequately replaced. This estimator calculates the approximate electrolyte loss based on your horse’s weight, exercise duration, ambient temperature, and sweat rate, providing a practical guide for supplementation.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The tool integrates veterinary science principles by considering how heat stress elevates sweat rates and electrolyte depletion. It uses average electrolyte concentrations found in equine sweat to estimate total losses, helping owners and trainers make informed decisions about hydration and supplementation strategies. By understanding these needs, caretakers can better support their horses’ health, prevent heat-related illnesses, and optimize recovery after exercise.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To estimate your horse’s electrolyte needs, input the horse’s weight, the duration of exercise in minutes, and the ambient temperature during the activity. Optionally, provide a known sweat rate if available; otherwise, the calculator will estimate it based on weight and conditions. After entering the data, press “Calculate” to receive an estimate of total electrolyte loss in grams, which can guide supplementation.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select your preferred unit system (Imperial or Metric) to match your measurements.
          </li>
          <li>
            <strong>Step 2:</strong> Enter your horse’s weight accurately to ensure precise calculations.
          </li>
          <li>
            <strong>Step 3:</strong> Input the exercise duration in minutes and the ambient temperature during the activity.
          </li>
          <li>
            <strong>Step 4:</strong> Optionally, enter a sweat rate if you have measured it; otherwise, leave blank for an average estimate.
          </li>
          <li>
            <strong>Step 5:</strong> Click “Calculate” to view the estimated electrolyte loss and consider appropriate supplementation.
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
              href="https://aaep.org/guidelines/equine-heat-illness"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. AAEP Guidelines on Equine Heat Illness
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive guidelines from the American Association of Equine Practitioners on managing heat stress and electrolyte balance in horses.
            </p>
          </li>
          <li className="block">
            <a
              href="https://pubmed.ncbi.nlm.nih.gov/15072594/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Sweat Electrolyte Losses in Exercising Horses (Journal of Equine Veterinary Science, 2004)
            </a>
            <p className="text-slate-500 text-sm">
              A scientific study quantifying electrolyte concentrations in equine sweat and implications for supplementation during exercise.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vetmed.ucdavis.edu/sites/g/files/dgvnsk5741/files/inline-files/Equine%20Electrolyte%20Balance%20-%20UC%20Davis.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Equine Electrolyte Balance - UC Davis Veterinary Medicine
            </a>
            <p className="text-slate-500 text-sm">
              Educational resource explaining electrolyte physiology in horses and practical supplementation advice.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Horse Electrolyte Need Estimator (Exercise & Heat)"
      description="Estimate necessary electrolyte supplementation based on ambient heat and intensity of exercise/sweating."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Electrolyte Need (g) = Sweat Rate (L/hr) × Exercise Duration (hr) × Electrolyte Concentration (g/L)",
        variables: [
          { symbol: "Sweat Rate (L/hr)", description: "Volume of sweat lost per hour, adjusted for heat and weight" },
          { symbol: "Exercise Duration (hr)", description: "Length of exercise or sweating period in hours" },
          { symbol: "Electrolyte Concentration (g/L)", description: "Average grams of electrolytes lost per liter of sweat (~16 g/L)" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 1100 lb (500 kg) horse exercises for 90 minutes in 85°F (29°C) weather with an estimated sweat rate of 10 L/hr.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert exercise duration to hours: 90 minutes = 1.5 hours.",
          },
          {
            label: "2",
            explanation:
              "Adjust sweat rate for heat: 10 L/hr × 1.2 (20% increase) = 12 L/hr.",
          },
          {
            label: "3",
            explanation:
              "Calculate electrolyte loss: 12 L/hr × 1.5 hr × 16 g/L = 288 grams.",
          },
        ],
        result:
          "The horse requires approximately 288 grams of electrolytes to replace losses during this exercise session.",
      }}
      relatedCalculators={[
        { title: "Whelping Countdown & Stage Timeline", url: "/pets/dog-whelping-countdown-stage-timeline", icon: "🐾" },
        { title: "Resting vs. Active Hours Balance Tracker (owner input)", url: "/pets/cat-resting-active-hours-balance-tracker", icon: "🐶" },
        { title: "Cat Onion/Garlic Toxicity Calculator", url: "/pets/cat-onion-garlic-toxicity", icon: "🐱" },
        { title: "Dog Treat Calories & Daily Allowance Calculator", url: "/pets/dog-treat-calories-daily-allowance", icon: "🐶" },
        { title: "Parasite Treatment Dose Reference", url: "/pets/small-mammal-parasite-treatment-dose-reference", icon: "💉" },
        { title: "Caffeine Toxicity Risk for Cats", url: "/pets/cat-caffeine-toxicity", icon: "🐱" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Horse Electrolyte Need Estimator (Exercise & Heat)" },
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