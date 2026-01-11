import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ FULL ICON IMPORT
import { Home, Heart, Utensils, Leaf, Calendar, DollarSign, Droplets, Activity, Moon, Sun, Users, Paintbrush, Wrench, Info, RotateCcw, AlertTriangle, FlaskConical, Scale, Waves, Zap, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import { useWeightUnitPreference } from "@/hooks/useWeightUnitPreference";
import { convertWeight, formatNumberForInput, LB_PER_KG, weightToKg } from "@/lib/utils";

const CAFFEINE_MG_PER_UNIT = {
  coffee: 95, // average mg per 8 oz cup brewed coffee
  espresso: 63, // mg per 1 oz shot
  tea: 47, // mg per 8 oz cup black tea
  soda: 40, // mg per 12 oz can cola
  energyDrink: 80, // mg per 8.4 oz can
  chocolate: 12, // mg per 1 oz dark chocolate
};

export default function CaffeineMaxPerDayCalculator() {
  const { unit: preferredWeightUnit, setUnit: setPreferredWeightUnit } = useWeightUnitPreference();
  // Inputs: weight, unit (kg or lbs), optional age, pregnancy, health conditions
  const [inputs, setInputs] = useState(() => ({
    weight: "",
    weightUnit: preferredWeightUnit === "lb" ? "lbs" : "kg",
    age: "",
    pregnant: "no",
    healthCondition: "none",
    caffeineSources: {
      coffee: "",
      espresso: "",
      tea: "",
      soda: "",
      energyDrink: "",
      chocolate: "",
    },
  }));

  const handleInputChange = useCallback((name, value) => {
    if (name === "weightUnit") {
      const nextUnit = value === "lbs" ? "lbs" : "kg";
      setInputs((prev) => {
        const currentUnit = prev.weightUnit === "lbs" ? "lbs" : "kg";
        if (currentUnit === nextUnit) return prev;
        const num = parseFloat(prev.weight);
        const fromUnit = currentUnit === "lbs" ? "lb" : "kg";
        const toUnit = nextUnit === "lbs" ? "lb" : "kg";
        const nextWeight =
          !prev.weight || Number.isNaN(num) || num <= 0 ? prev.weight : formatNumberForInput(convertWeight(num, fromUnit, toUnit), 2);
        return { ...prev, weightUnit: nextUnit, weight: nextWeight };
      });
      setPreferredWeightUnit(nextUnit === "lbs" ? "lb" : "kg");
      return;
    }
    if (name.startsWith("caffeineSources.")) {
      const key = name.split(".")[1];
      setInputs((prev) => ({
        ...prev,
        caffeineSources: {
          ...prev.caffeineSources,
          [key]: value,
        },
      }));
    } else {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, [setPreferredWeightUnit]);

  // Calculation logic:
  // Step 1: Convert weight to kg if needed
  // Step 2: Calculate max recommended caffeine mg per day based on weight and health factors
  // Step 3: Sum current caffeine intake from sources
  // Step 4: Calculate remaining safe caffeine intake

  const results = useMemo(() => {
    const weightNum = parseFloat(inputs.weight);
    if (!weightNum || weightNum <= 0) {
      return {
        value: null,
        label: "",
        subtext: "Please enter a valid body weight.",
        warning: null,
        formulaUsed: "",
      };
    }

    // Convert weight to kg if input is in lbs
    const weightKg = weightToKg(weightNum, inputs.weightUnit === "lbs" ? "lb" : "kg");

    // Base max caffeine mg per kg body weight (general safe limit)
    // According to FDA and other sources, 3-5 mg/kg is safe for most adults.
    // We'll use 4 mg/kg as a balanced average.
    const baseMaxMg = weightKg * 4;

    // Adjust max caffeine for special conditions:
    // Pregnancy: max 200 mg/day recommended by ACOG
    // Adolescents: max 2.5 mg/kg recommended by American Academy of Pediatrics
    // Health conditions (e.g., heart issues): reduce by 25%
    let adjustedMaxMg = baseMaxMg;
    let warning = null;

    const ageNum = parseInt(inputs.age);
    if (!isNaN(ageNum) && ageNum > 0 && ageNum < 18) {
      adjustedMaxMg = weightKg * 2.5;
      warning = "As a minor, your recommended caffeine intake is lower.";
    }

    if (inputs.pregnant === "yes") {
      adjustedMaxMg = Math.min(adjustedMaxMg, 200);
      warning = "Pregnant individuals should limit caffeine to 200 mg per day.";
    }

    if (inputs.healthCondition === "heart") {
      adjustedMaxMg = adjustedMaxMg * 0.75;
      warning = "Due to heart conditions, caffeine intake should be reduced.";
    }

    // Sum current caffeine intake from sources
    const caffeineIntakeMg = Object.entries(inputs.caffeineSources).reduce((sum, [key, val]) => {
      const amount = parseFloat(val);
      if (!amount || amount <= 0) return sum;
      // For coffee, tea, soda, energyDrink, chocolate, amount is number of servings
      // Multiply by mg per serving
      return sum + amount * (CAFFEINE_MG_PER_UNIT[key] || 0);
    }, 0);

    const remainingMg = adjustedMaxMg - caffeineIntakeMg;

    return {
      value: `${adjustedMaxMg.toFixed(0)} mg`,
      label: "Maximum Recommended Caffeine Intake per Day",
      subtext: caffeineIntakeMg > 0
        ? `You have consumed approximately ${caffeineIntakeMg.toFixed(0)} mg caffeine. Remaining safe intake: ${remainingMg > 0 ? remainingMg.toFixed(0) + " mg" : "0 mg (limit reached or exceeded)"}`
        : "Enter your caffeine consumption to see remaining safe intake.",
      warning,
      formulaUsed:
        inputs.weightUnit === "lbs"
          ? `Max caffeine (mg) = Body weight (lb) × ${(4 / LB_PER_KG).toFixed(2)} mg/lb (adjusted for age, pregnancy, health)`
          : "Max caffeine (mg) = Body weight (kg) × 4 mg/kg (adjusted for age, pregnancy, health)",
      remainingMg: remainingMg > 0 ? remainingMg : 0,
      caffeineIntakeMg,
      adjustedMaxMg,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the safe daily caffeine limit?",
      answer:
        "For most healthy adults, up to 400 mg of caffeine per day is considered safe, which is roughly equivalent to four 8-ounce cups of brewed coffee. However, individual tolerance varies, and certain groups such as pregnant women and adolescents should consume less.",
    },
    {
      question: "How does body weight affect caffeine tolerance?",
      answer:
        "Caffeine metabolism and tolerance are influenced by body weight, with recommendations often given in mg per kilogram of body weight. This calculator uses 4 mg/kg as a general guideline for adults to estimate a safe maximum daily intake.",
    },
    {
      question: "Can caffeine cause health problems?",
      answer:
        "Excessive caffeine intake can lead to side effects such as insomnia, nervousness, increased heart rate, and digestive issues. People with heart conditions or pregnant individuals should limit their intake to reduce risks.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="weight" className="mb-1 flex items-center gap-1">
                Body Weight
                <Scale className="w-4 h-4 text-blue-600" />
              </Label>
              <div className="flex gap-2">
                <Input
                  id="weight"
                  type="number"
                  min={1}
                  step="any"
                  placeholder="Enter your weight"
                  value={inputs.weight}
                  onChange={(e) => handleInputChange("weight", e.target.value)}
                />
                <Select
                  value={inputs.weightUnit}
                  onValueChange={(v) => handleInputChange("weightUnit", v)}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="lbs">lbs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="age" className="mb-1 flex items-center gap-1">
                Age
                <Users className="w-4 h-4 text-blue-600" />
              </Label>
              <Input
                id="age"
                type="number"
                min={1}
                placeholder="Optional"
                value={inputs.age}
                onChange={(e) => handleInputChange("age", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="pregnant" className="mb-1 flex items-center gap-1">
                Pregnant?
                <Heart className="w-4 h-4 text-pink-600" />
              </Label>
              <Select
                id="pregnant"
                value={inputs.pregnant}
                onValueChange={(v) => handleInputChange("pregnant", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no">No</SelectItem>
                  <SelectItem value="yes">Yes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="healthCondition" className="mb-1 flex items-center gap-1">
                Health Condition
                <AlertTriangle className="w-4 h-4 text-red-600" />
              </Label>
              <Select
                id="healthCondition"
                value={inputs.healthCondition}
                onValueChange={(v) => handleInputChange("healthCondition", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="heart">Heart Condition</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" /> Enter Your Daily Caffeine Intake
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Input the number of servings you consume daily for each caffeine source.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {Object.entries(CAFFEINE_MG_PER_UNIT).map(([key, mg]) => (
                <div key={key}>
                  <Label htmlFor={`caffeine-${key}`} className="mb-1 capitalize">
                    {key === "energyDrink" ? "Energy Drink (8.4 oz)" : key === "espresso" ? "Espresso (1 oz shot)" : key === "chocolate" ? "Dark Chocolate (1 oz)" : key.charAt(0).toUpperCase() + key.slice(1) + (key === "soda" ? " (12 oz)" : " (8 oz)")}
                  </Label>
                  <Input
                    id={`caffeine-${key}`}
                    type="number"
                    min={0}
                    step="any"
                    placeholder="0"
                    value={inputs.caffeineSources[key]}
                    onChange={(e) => handleInputChange(`caffeineSources.${key}`, e.target.value)}
                  />
                  <p className="text-xs text-slate-500 mt-0.5">{mg} mg per serving</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {}}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          aria-label="Calculate maximum caffeine intake"
        >
          <Home className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              weight: "",
              weightUnit: "kg",
              age: "",
              pregnant: "no",
              healthCondition: "none",
              caffeineSources: {
                coffee: "",
                espresso: "",
                tea: "",
                soda: "",
                energyDrink: "",
                chocolate: "",
              },
            })
          }
          className="flex-1 h-11"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="mt-2 text-lg font-medium text-blue-800 dark:text-blue-300">{results.label}</p>
            <p className="mt-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{results.subtext}</p>
            {results.warning && (
              <p className="mt-3 text-sm text-red-600 font-semibold flex items-center justify-center gap-2">
                <AlertTriangle className="w-4 h-4" /> {results.warning}
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Caffeine Max per Day Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Caffeine is a widely consumed stimulant found in coffee, tea, sodas, energy drinks, and chocolate. While moderate caffeine consumption can enhance alertness and cognitive function, excessive intake may lead to adverse health effects such as insomnia, increased heart rate, anxiety, and digestive discomfort. This calculator estimates your maximum safe daily caffeine intake based on your body weight and personal health factors, aligning with recommendations from leading health authorities. By inputting your weight, age, pregnancy status, and health conditions, you receive a personalized caffeine limit to help you enjoy your favorite beverages safely.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To accurately calculate your maximum recommended caffeine intake, follow these steps carefully. First, enter your current body weight and select the appropriate unit (kilograms or pounds). Next, provide your age, as caffeine tolerance varies between adults and minors. Indicate if you are pregnant or have any heart-related health conditions, as these factors influence safe caffeine limits. Finally, input the number of servings you consume daily from various caffeine sources to understand your current intake and remaining safe allowance.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>Step 1: Enter your body weight and select the unit (kg or lbs).</li>
          <li>Step 2: Provide your age to adjust recommendations for minors.</li>
          <li>Step 3: Indicate pregnancy status and any heart conditions.</li>
          <li>Step 4: Input your daily caffeine consumption from coffee, tea, soda, energy drinks, espresso, and chocolate.</li>
          <li>Step 5: Click "Calculate" to see your personalized maximum caffeine intake and remaining safe allowance.</li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Professional Tips & Safety</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          While caffeine can be part of a healthy lifestyle, it is essential to consume it responsibly. Always listen to your body's signals; symptoms like jitteriness, rapid heartbeat, or insomnia may indicate excessive intake. Pregnant individuals should strictly limit caffeine to 200 mg per day to avoid risks to fetal development. Adolescents and people with heart conditions should consult healthcare providers for personalized advice. Remember that caffeine content varies widely between products, so always check labels and consider the cumulative effect of all sources throughout your day.
        </p>
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

      {/* NEW RICH REFERENCES SECTION */}
      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References & Additional Resources</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
          For further reading and verification, please refer to these authoritative sources:
        </p>
        <ul className="space-y-4">
          <li>
            <a
              href="https://www.fda.gov/food/food-additives-petitions/caffeine"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              U.S. Food & Drug Administration (FDA) - Caffeine Information <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Official FDA guidelines and safety information regarding caffeine consumption and its effects.
            </p>
          </li>
          <li>
            <a
              href="https://www.acog.org/womens-health/faqs/caffeine-during-pregnancy"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              American College of Obstetricians and Gynecologists (ACOG) - Caffeine During Pregnancy <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Evidence-based recommendations on caffeine intake limits for pregnant individuals to ensure fetal health.
            </p>
          </li>
          <li>
            <a
              href="https://www.cdc.gov/nutrition/data-statistics/know-your-limit-for-caffeine.html"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Centers for Disease Control and Prevention (CDC) - Know Your Limit for Caffeine <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Comprehensive overview of caffeine consumption guidelines and health considerations from the CDC.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Caffeine Max per Day Calculator"
      description="Monitor your caffeine intake. Calculate your daily limit based on body weight to enjoy coffee safely without the jitters."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Methodology",
        formula: "Max caffeine (mg) = Body weight (kg) × 4 mg/kg (adjusted for age, pregnancy, and health conditions)",
        variables: [
          { symbol: "Body weight (kg)", description: "Your weight in kilograms" },
          { symbol: "4 mg/kg", description: "General safe caffeine limit per kilogram of body weight" },
          { symbol: "Adjustments", description: "Reductions based on age, pregnancy, and health conditions" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "A 70 kg healthy adult wants to know their maximum caffeine intake and how much caffeine they have left after drinking 2 cups of coffee and 1 energy drink.",
        steps: [
          {
            label: "Step 1",
            explanation: "Calculate base max caffeine: 70 kg × 4 mg/kg = 280 mg",
          },
          {
            label: "Step 2",
            explanation: "Calculate caffeine consumed: (2 cups coffee × 95 mg) + (1 energy drink × 80 mg) = 270 mg",
          },
          {
            label: "Step 3",
            explanation: "Calculate remaining safe intake: 280 mg - 270 mg = 10 mg",
          },
        ],
        result: "The user can safely consume up to 280 mg caffeine per day and has about 10 mg remaining after current intake.",
      }}
      relatedCalculators={[
        { title: "Grass Seed Quantity Calculator", url: "/everyday-life/grass-seed-quantity", icon: "💡" },
        { title: "Event Budget Calculator", url: "/everyday-life/event-budget-calculator", icon: "💡" },
        { title: "Light Bulb Cost per Year Calculator", url: "/everyday-life/light-bulb-cost-per-year", icon: "🏠" },
        { title: "Life Expectancy Calculator", url: "/everyday-life/life-expectancy", icon: "💡" },
        { title: "Square Footage Calculator", url: "/everyday-life/square-footage-calculator", icon: "💡" },
        { title: "Buffet Serving Pan Capacity & Count", url: "/everyday-life/buffet-pan-capacity-count", icon: "💡" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding" },
        { id: "how-to", label: "How to Use" },
        { id: "tips", label: "Pro Tips" },
        { id: "faq", label: "FAQ" },
        { id: "references", label: "References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}
