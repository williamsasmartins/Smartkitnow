import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function HorseWaterIntakeTemperatureWeightCalculator() {
  // 1. STATE
  // Unit selector needed for weight input (lbs or kg)
  const [unit, setUnit] = useState("imperial");

  // Inputs: weight and ambient temperature
  const [inputs, setInputs] = useState({
    weight: "",
    temperature: "",
  });

  // 2. LOGIC ENGINE
  // Formula source: 
  // Typical water intake for horses is approx 50 ml/kg/day at moderate temps (~20°C).
  // Intake increases by ~10% for each 5°C increase above 20°C.
  // Intake decreases slightly below 20°C but minimum maintained ~40 ml/kg.
  // Reference: National Research Council, Equine Nutrition.

  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    const tempRaw = parseFloat(inputs.temperature);

    if (isNaN(weightRaw) || weightRaw <= 0 || isNaN(tempRaw)) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? weightRaw / 2.20462 : weightRaw;

    // Base intake at 20°C = 50 ml/kg/day
    // For every 5°C above 20, increase intake by 10%
    // For temps below 20°C, intake minimum 40 ml/kg/day

    let baseIntakePerKg = 50; // ml/kg/day

    if (tempRaw < 20) {
      baseIntakePerKg = 40; // minimum intake below 20°C
    } else if (tempRaw > 20) {
      const increments = Math.floor((tempRaw - 20) / 5);
      baseIntakePerKg = 50 * (1 + 0.10 * increments);
    }

    // Total intake in liters/day
    const intakeMl = baseIntakePerKg * weightKg;
    const intakeLiters = intakeMl / 1000;

    // Convert back to gallons if imperial
    const intakeImperial = intakeLiters * 0.264172;

    return {
      value: unit === "imperial" ? intakeImperial.toFixed(2) : intakeLiters.toFixed(2),
      label: unit === "imperial" ? "Gallons per day" : "Liters per day",
      subtext: `Based on weight of ${weightRaw} ${unit === "imperial" ? "lbs" : "kg"} and ambient temperature of ${tempRaw}°C`,
      warning:
        weightRaw < 200
          ? "Warning: Weight below typical adult horse range; results may be less accurate."
          : null,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why does temperature affect a horse's water intake?",
      answer:
        "Temperature influences a horse's hydration needs because higher temperatures increase sweating and respiratory water loss. As ambient temperature rises, horses lose more fluids to maintain body temperature, requiring increased water intake to prevent dehydration. Conversely, cooler temperatures reduce water loss, but horses still need adequate hydration for metabolic functions.",
    },
    {
      question: "How does a horse's weight impact its daily water requirements?",
      answer:
        "A horse's weight directly correlates with its water needs since larger animals have greater body mass and metabolic activity. Water intake is typically calculated per kilogram of body weight to ensure proportional hydration. Underestimating weight can lead to insufficient water provision, risking dehydration and health complications.",
    },
    {
      question: "Can this calculator be used for all horse breeds and ages?",
      answer:
        "This calculator provides estimates primarily for adult horses of average breed sizes. Foals, ponies, and draft breeds may have different hydration requirements due to metabolic and physiological differences. For specialized cases, consulting a veterinarian is recommended to tailor water intake accurately.",
    },
    {
      question: "What are signs of inadequate water intake in horses?",
      answer:
        "Signs of insufficient water intake include dry mucous membranes, decreased urine output, lethargy, and concentrated urine. Prolonged dehydration can cause colic, kidney issues, and impaired thermoregulation. Monitoring water consumption and providing fresh water are essential preventive measures.",
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
            Horse Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            type="number"
            min={0}
            step="any"
            placeholder={`Enter weight in ${unit === "imperial" ? "lbs" : "kg"}`}
            value={inputs.weight}
            onChange={(e) => setInputs((prev) => ({ ...prev, weight: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="temperature" className="text-slate-700 dark:text-slate-300">
            Ambient Temperature (°C)
          </Label>
          <Input
            id="temperature"
            type="number"
            step="any"
            placeholder="Enter ambient temperature in °C"
            value={inputs.temperature}
            onChange={(e) => setInputs((prev) => ({ ...prev, temperature: e.target.value }))}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating inputs state (no-op here)
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", temperature: "" })}
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

  // Editorial content
  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Horse Water Intake by Temperature & Weight
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Horses require adequate water intake daily to maintain hydration, support metabolic processes, and regulate body temperature. The amount of water a horse drinks is influenced significantly by its body weight, as larger horses have greater metabolic demands and fluid volume. Additionally, environmental temperature plays a crucial role; as temperatures rise, horses lose more water through sweating and respiration, increasing their hydration needs.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          At moderate temperatures around 20°C, horses typically consume about 50 milliliters of water per kilogram of body weight each day. However, for every 5°C increase above this baseline, their water requirements increase by approximately 10% to compensate for additional fluid loss. Conversely, in cooler conditions, water intake decreases but should not fall below a minimum threshold to ensure physiological functions remain optimal.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Understanding these variables helps caretakers provide sufficient water to prevent dehydration, which can lead to serious health issues such as colic, kidney dysfunction, and impaired thermoregulation. This calculator integrates weight and temperature to estimate daily water needs, offering a practical tool for horse owners and veterinarians to optimize hydration management.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator estimates the minimum daily water intake required for a horse based on its weight and the ambient temperature. Begin by selecting the unit system that matches your measurement preference—Imperial (pounds) or Metric (kilograms). Then, enter the horse’s weight and the current ambient temperature in Celsius. After inputting these values, click the calculate button to receive an estimate of the daily water volume your horse should consume.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select the unit system (Imperial or Metric) to match your weight measurement.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the horse’s weight accurately to ensure precise calculation.
          </li>
          <li>
            <strong>Step 3:</strong> Input the ambient temperature in degrees Celsius to adjust water needs for environmental conditions.
          </li>
          <li>
            <strong>Step 4:</strong> Click “Calculate” to view the estimated daily water intake in gallons or liters.
          </li>
          <li>
            <strong>Step 5:</strong> Use the result as a guideline and consult a veterinarian for specific health considerations.
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
              href="https://www.nap.edu/catalog/11653/nutrient-requirements-of-horses-sixth-revised-edition"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Nutrient Requirements of Horses, 6th Edition - National Research Council (2007)
            </a>
            <p className="text-slate-500 text-sm">
              Authoritative guidelines on equine nutrition including water requirements relative to weight and environmental factors.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.extension.org/pages/Water-Requirements-for-Horses"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Water Requirements for Horses - Extension.org
            </a>
            <p className="text-slate-500 text-sm">
              Practical insights into how temperature and activity influence hydration needs in horses.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.merckvetmanual.com/management-and-nutrition/nutrition-of-horses/water-requirements"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Water Requirements - Merck Veterinary Manual
            </a>
            <p className="text-slate-500 text-sm">
              Veterinary reference detailing physiological water needs and factors affecting equine hydration.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Horse Water Intake by Temperature & Weight"
      description="Estimate the minimum daily water intake required for a horse based on its weight and ambient air temperature."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula:
          "Daily Water Intake (ml) = Weight (kg) × Base Intake (ml/kg) × Temperature Adjustment Factor",
        variables: [
          { symbol: "Weight (kg)", description: "Horse body weight in kilograms" },
          {
            symbol: "Base Intake (ml/kg)",
            description: "Baseline water intake at 20°C (50 ml per kg body weight)",
          },
          {
            symbol: "Temperature Adjustment Factor",
            description:
              "Multiplier increasing intake by 10% for every 5°C above 20°C; minimum intake at cooler temps",
          },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 1100 lb horse is kept in an environment with an ambient temperature of 30°C. Calculate the estimated daily water intake.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kilograms: 1100 lbs ÷ 2.20462 = 499 kg (approx).",
          },
          {
            label: "2",
            explanation:
              "Calculate temperature increments above 20°C: (30 - 20) ÷ 5 = 2 increments.",
          },
          {
            label: "3",
            explanation:
              "Calculate intake per kg: 50 ml × (1 + 0.10 × 2) = 60 ml/kg.",
          },
          {
            label: "4",
            explanation:
              "Calculate total intake: 499 kg × 60 ml = 29,940 ml = 29.94 liters.",
          },
        ],
        result:
          "The horse should consume approximately 29.94 liters (7.91 gallons) of water daily under these conditions.",
      }}
      relatedCalculators={[
        {
          title: "Puppy Calorie Needs by Age/Breed Size Calculator",
          url: "/pets/puppy-calorie-needs-age-breed-size",
          icon: "🐾",
        },
        {
          title: "Dewormer Dose Calculator (by Drug Class & Weight)",
          url: "/pets/horse-dewormer-dose-calculator",
          icon: "🐶",
        },
        {
          title: "Egg Binding Risk Estimator",
          url: "/pets/bird-egg-binding-risk-estimator",
          icon: "🐱",
        },
        {
          title: "Vitamin D3 Requirement (Supplemental)",
          url: "/pets/reptile-vitamin-d3-requirement",
          icon: "🍖",
        },
        {
          title: "Dog Treat Calories & Daily Allowance Calculator",
          url: "/pets/dog-treat-calories-daily-allowance",
          icon: "🐶",
        },
        {
          title: "Puppy Adult Size Predictor (Weight Curve)",
          url: "/pets/puppy-adult-size-predictor-weight-curve",
          icon: "💧",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Horse Water Intake by Temperature & Weight" },
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