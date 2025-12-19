import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ FULL ICON IMPORT
import { Home, Heart, Utensils, Leaf, Calendar, DollarSign, Droplets, Activity, Moon, Sun, Users, Paintbrush, Wrench, Info, RotateCcw, AlertTriangle, FlaskConical, Scale, Waves, Zap } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CaffeineMaxPerDayCalculator() {
  // Inputs: weight (kg or lbs), age group (optional for safety notes), sensitivity level (optional)
  const [inputs, setInputs] = useState({
    weight: "",
    weightUnit: "kg",
    sensitivity: "normal",
  });
  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  /**
   * Calculation logic:
   * The general guideline for caffeine intake is up to 3-6 mg per kg of body weight per day for most adults.
   * The FDA suggests up to 400 mg/day for healthy adults.
   * For sensitive individuals or certain age groups, the limit is lower.
   * 
   * We'll use:
   * - Normal sensitivity: 6 mg/kg (max)
   * - Moderate sensitivity: 4 mg/kg
   * - High sensitivity: 2 mg/kg
   * 
   * We'll also cap the max at 400 mg/day for adults.
   * 
   * Weight input can be in kg or lbs, convert lbs to kg (1 lb = 0.453592 kg).
   */

  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    if (!weightRaw || weightRaw <= 0) {
      return {
        value: null,
        label: "",
        subtext: "Please enter a valid positive weight.",
        warning: null,
        formulaUsed: "",
      };
    }

    // Convert weight to kg if needed
    const weightKg = inputs.weightUnit === "lbs" ? weightRaw * 0.453592 : weightRaw;

    // Sensitivity multiplier
    let mgPerKg = 6;
    let sensitivityLabel = "Normal sensitivity";

    if (inputs.sensitivity === "moderate") {
      mgPerKg = 4;
      sensitivityLabel = "Moderate sensitivity";
    } else if (inputs.sensitivity === "high") {
      mgPerKg = 2;
      sensitivityLabel = "High sensitivity";
    }

    // Calculate max caffeine mg/day
    let maxCaffeineMg = weightKg * mgPerKg;

    // Cap at FDA recommended max 400 mg/day for adults
    if (maxCaffeineMg > 400) maxCaffeineMg = 400;

    // Round to nearest whole number
    maxCaffeineMg = Math.round(maxCaffeineMg);

    // Warning if weight is extremely low or high
    let warning = null;
    if (weightKg < 30) {
      warning = "For individuals under 30 kg, consult a healthcare professional for personalized caffeine limits.";
    } else if (weightKg > 150) {
      warning = "For individuals over 150 kg, caffeine metabolism may vary; consider consulting a healthcare professional.";
    }

    return {
      value: `${maxCaffeineMg} mg`,
      label: `Maximum caffeine intake per day (${sensitivityLabel})`,
      subtext: `Based on your weight of ${weightRaw} ${inputs.weightUnit} (${weightKg.toFixed(1)} kg).`,
      warning,
      formulaUsed: `Max caffeine (mg) = Body weight (kg) × ${mgPerKg} mg/kg, capped at 400 mg/day`,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the safe daily caffeine limit for adults?",
      answer:
        "The generally accepted safe daily caffeine limit for healthy adults is up to 400 mg, which is roughly equivalent to four to five cups of brewed coffee. This limit helps avoid adverse effects such as jitteriness, insomnia, increased heart rate, and anxiety. However, individual tolerance varies based on factors like body weight, metabolism, and sensitivity.",
    },
    {
      question: "How does body weight affect caffeine tolerance?",
      answer:
        "Body weight influences caffeine tolerance because caffeine dosage recommendations are often based on milligrams per kilogram of body weight. Heavier individuals typically metabolize caffeine differently and may tolerate higher amounts safely. This calculator uses weight-based calculations to personalize caffeine limits, ensuring safer consumption tailored to your body.",
    },
    {
      question: "What does caffeine sensitivity mean?",
      answer:
        "Caffeine sensitivity refers to how strongly your body reacts to caffeine. People with high sensitivity may experience side effects like nervousness, rapid heartbeat, or sleep disturbances even at low doses. Sensitivity can be influenced by genetics, age, medication, and overall health. This calculator adjusts limits based on sensitivity levels to help you avoid negative effects.",
    },
    {
      question: "Can children and teenagers consume caffeine safely?",
      answer:
        "Children and teenagers have lower caffeine tolerance than adults. The American Academy of Pediatrics recommends limiting caffeine intake for adolescents to no more than 100 mg per day, roughly equivalent to one cup of coffee or two cans of soda. For younger children, caffeine consumption should be minimal or avoided. Always consult a pediatrician for personalized advice.",
    },
    {
      question: "Why is there a maximum cap of 400 mg even if my weight suggests more?",
      answer:
        "While weight-based calculations provide a personalized estimate, the 400 mg cap aligns with FDA guidelines for healthy adults to prevent excessive caffeine intake. Consuming more than this amount increases the risk of adverse health effects, regardless of body weight. This cap ensures safety by adhering to established medical recommendations.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-slate-900 dark:to-slate-950 border-yellow-300 shadow-lg">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div>
            <Label htmlFor="weight" className="font-semibold text-yellow-900 dark:text-yellow-300">
              Body Weight
            </Label>
            <Input
              id="weight"
              type="number"
              min={0}
              step="any"
              placeholder="Enter your weight"
              value={inputs.weight}
              onChange={(e) => handleInputChange("weight", e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="weightUnit" className="font-semibold text-yellow-900 dark:text-yellow-300">
              Weight Unit
            </Label>
            <Select
              onValueChange={(v) => handleInputChange("weightUnit", v)}
              value={inputs.weightUnit}
              id="weightUnit"
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kg">Kilograms (kg)</SelectItem>
                <SelectItem value="lbs">Pounds (lbs)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="sensitivity" className="font-semibold text-yellow-900 dark:text-yellow-300">
              Caffeine Sensitivity
            </Label>
            <Select
              onValueChange={(v) => handleInputChange("sensitivity", v)}
              value={inputs.sensitivity}
              id="sensitivity"
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select sensitivity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-6">
          <Button
            onClick={() => {
              // No special calculation trigger needed, results update automatically
              // But we can force re-render by resetting inputs to same values if needed
              setInputs((p) => ({ ...p }));
            }}
            className="flex-1 h-11 bg-yellow-600 hover:bg-yellow-700 text-white shadow-md"
          >
            <Zap className="mr-2 h-4 w-4" /> Calculate
          </Button>
          <Button
            variant="outline"
            onClick={() => setInputs({ weight: "", weightUnit: "kg", sensitivity: "normal" })}
            className="flex-1 h-11"
          >
            <RotateCcw className="mr-2 h-4 w-4" /> Reset
          </Button>
        </div>
      </Card>

      {/* Results */}
      {results.value && (
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-slate-900 dark:to-slate-950 border-yellow-300 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-yellow-900 dark:text-yellow-100">{results.value}</p>
            <p className="mt-2 text-lg font-medium text-yellow-800 dark:text-yellow-300">{results.label}</p>
            <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-400">{results.subtext}</p>
            {results.warning && (
              <p className="mt-4 text-sm font-semibold text-red-700 dark:text-red-400 flex items-center justify-center gap-2">
                <AlertTriangle className="w-5 h-5" /> {results.warning}
              </p>
            )}
            <p className="mt-6 text-xs italic text-yellow-600 dark:text-yellow-500">{results.formulaUsed}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding the Basics</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Caffeine is a natural stimulant found in coffee, tea, chocolate, and many energy drinks and medications. It works by stimulating the central nervous system, helping to increase alertness and reduce fatigue. While moderate caffeine consumption can improve focus and mood, excessive intake can lead to unwanted side effects such as jitteriness, insomnia, increased heart rate, and anxiety.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The amount of caffeine that is safe to consume varies widely between individuals due to factors like body weight, metabolism, age, and sensitivity. Health authorities generally recommend a maximum daily intake of 400 mg for healthy adults, but this limit is lower for children, pregnant women, and those with certain medical conditions. This calculator helps you estimate a personalized daily caffeine limit based on your body weight and sensitivity level to promote safe consumption.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To accurately calculate your maximum recommended caffeine intake per day, follow these detailed steps. This ensures you understand how your body weight and sensitivity affect your caffeine tolerance and helps you avoid adverse effects.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter your current body weight in the input field. You can choose to input your weight in kilograms (kg) or pounds (lbs) using the dropdown selector next to the input.
          </li>
          <li>
            <strong>Step 2:</strong> Select your caffeine sensitivity level from the options: Normal, Moderate, or High. This reflects how your body typically reacts to caffeine and adjusts the recommended limit accordingly.
          </li>
          <li>
            <strong>Step 3:</strong> Click the <em>Calculate</em> button to see your personalized maximum caffeine intake per day displayed below the inputs. The result is shown in milligrams (mg), along with explanatory notes.
          </li>
          <li>
            <strong>Step 4:</strong> If needed, use the <em>Reset</em> button to clear all inputs and start a new calculation.
          </li>
          <li>
            <strong>Step 5:</strong> Use the result to monitor your daily caffeine consumption from all sources such as coffee, tea, energy drinks, and medications to stay within safe limits.
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
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Caffeine Max per Day Calculator"
      description="Monitor your caffeine intake. Calculate your daily limit based on body weight and sensitivity to enjoy coffee safely without the jitters."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Methodology",
        formula: "Max caffeine (mg) = Body weight (kg) × Sensitivity factor (mg/kg), capped at 400 mg/day",
        variables: [
          { symbol: "Body weight (kg)", description: "Your weight converted to kilograms" },
          { symbol: "Sensitivity factor (mg/kg)", description: "6 for normal, 4 for moderate, 2 for high sensitivity" },
          { symbol: "400 mg/day", description: "Maximum recommended caffeine intake for healthy adults" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "Imagine a person weighing 70 kg with normal caffeine sensitivity wants to know their safe daily caffeine limit.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Input the weight as 70 and select kilograms (kg) as the unit.",
          },
          {
            label: "Step 2",
            explanation:
              "Choose 'Normal' for caffeine sensitivity since this person does not experience adverse effects easily.",
          },
          {
            label: "Step 3",
            explanation:
              "Click 'Calculate' to get the result. The calculator multiplies 70 kg by 6 mg/kg, resulting in 420 mg. Since 420 mg exceeds the 400 mg cap, the final recommended maximum is 400 mg per day.",
          },
        ],
        result:
          "The safe maximum caffeine intake for this person is 400 mg per day, which aligns with FDA guidelines and helps avoid negative side effects.",
      }}
      relatedCalculators={[
        { title: "Garden Soil/Compost Volume Calculator", url: "/everyday-life/garden-soil-compost-volume", icon: "🌿" },
        { title: "Sleep Debt & Ideal Bedtime Planner", url: "/everyday-life/sleep-debt-ideal-bedtime", icon: "💡" },
        { title: "Cleaning Dilution Ratio Calculator", url: "/everyday-life/cleaning-dilution-ratio", icon: "🏠" },
        { title: "Room Air Changes per Hour (ACH) Calculator", url: "/everyday-life/room-air-changes-ach", icon: "💡" },
        { title: "Buffet Serving Pan Capacity & Count", url: "/everyday-life/buffet-pan-capacity-count", icon: "💡" },
        { title: "Body Mass Index (BMI) Calculator", url: "/everyday-life/bmi-calculator", icon: "❤️" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding" },
        { id: "how-to", label: "How to Use" },
        { id: "faq", label: "FAQ" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}