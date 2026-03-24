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
      question: "What is the safe daily caffeine limit for adults?",
      answer:
        "For most healthy adults, up to 400 mg of caffeine per day is considered safe by the FDA — roughly four 8-ounce cups of brewed coffee. Individual tolerance varies based on body weight, genetics, and health status. Sensitive individuals may experience side effects at much lower doses.",
    },
    {
      question: "How much caffeine is in a cup of coffee?",
      answer:
        "An 8-oz cup of brewed coffee contains approximately 80–100 mg of caffeine (average 95 mg). Espresso has about 63 mg per 1-oz shot. Instant coffee typically has 30–90 mg per cup. Cold brew can contain 150–200 mg depending on brew strength and cup size.",
    },
    {
      question: "How long does caffeine stay in your system?",
      answer:
        "Caffeine has a half-life of about 5–6 hours in most adults, meaning half of it is still in your system 5–6 hours after consumption. It can take up to 10 hours to fully clear. Consuming caffeine after 2–3 PM can disrupt sleep in people sensitive to it.",
    },
    {
      question: "What happens if you drink too much caffeine?",
      answer:
        "Excessive caffeine (above 400–600 mg/day) commonly causes jitteriness, rapid heartbeat, anxiety, headaches, and insomnia. Very high doses (above 1,200 mg) can cause seizures or cardiac arrhythmia. Chronic overconsumption can lead to dependence and withdrawal symptoms like fatigue and headaches when stopping.",
    },
    {
      question: "Is 400 mg of caffeine too much?",
      answer:
        "400 mg is the upper safe limit recommended by the FDA for healthy adults. Whether it's too much depends on your body weight, tolerance, and health conditions. A 60 kg person's limit is about 240 mg (4 mg/kg), so 400 mg would exceed their threshold. Use this calculator to find your personal limit.",
    },
    {
      question: "Can caffeine cause anxiety?",
      answer:
        "Yes. Caffeine stimulates the central nervous system and can trigger or worsen anxiety, especially in people with anxiety disorders or low tolerance. Doses above 200 mg can cause palpitations and nervousness in sensitive individuals. Switching to lower-caffeine options like green tea may help.",
    },
    {
      question: "How much caffeine is safe during pregnancy?",
      answer:
        "The American College of Obstetricians and Gynecologists (ACOG) recommends limiting caffeine to under 200 mg per day during pregnancy — about one 12-oz cup of coffee. Higher intake is associated with increased risk of low birth weight and pregnancy loss.",
    },
    {
      question: "What time should I stop drinking coffee to sleep well?",
      answer:
        "Most sleep experts recommend stopping caffeine intake at least 6 hours before bedtime. For a 10 PM bedtime, stop by 4 PM. People with slower caffeine metabolism (certain genetic variants) may need to cut off even earlier, around 2 PM.",
    },
    {
      question: "How much caffeine does tea have compared to coffee?",
      answer:
        "Black tea has 40–70 mg per 8-oz cup, compared to coffee's 80–100 mg. Green tea has 20–45 mg. White tea has 15–30 mg. Herbal teas are typically caffeine-free. Matcha is surprisingly high at 70–140 mg per cup depending on preparation.",
    },
    {
      question: "Can you build a tolerance to caffeine?",
      answer:
        "Yes. Regular caffeine use leads to tolerance, where the same dose produces less effect over time. This typically develops within 1–4 days of consistent use. Tolerance resets after 1–2 weeks of abstinence. Cycling caffeine (e.g., only on weekdays) helps preserve its effectiveness.",
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
          What Is a Safe Daily Caffeine Limit?
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Caffeine is the world's most widely consumed psychoactive substance, found naturally in coffee beans, tea leaves, cacao, and guarana. The FDA recommends a maximum of <strong>400 mg per day</strong> for healthy adults — roughly four 8-oz cups of brewed coffee. However, that's a general ceiling, not a target. Your personal safe limit depends on body weight, age, medications, and health conditions.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator uses the <strong>4 mg per kg of body weight</strong> guideline — the same benchmark used by sports nutrition researchers and the European Food Safety Authority (EFSA). A 70 kg (154 lb) adult has a daily limit of roughly 280 mg. A 50 kg person's limit drops to 200 mg. Enter your details above to get your personal number.
        </p>
      </section>

      <section id="caffeine-table" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Caffeine Content by Beverage</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Knowing how much caffeine is in each drink helps you track intake accurately. Amounts vary by brand, brew strength, and serving size.
        </p>
        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-200">Beverage</th>
                <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-200">Serving Size</th>
                <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-200">Caffeine (mg)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {[
                ["Brewed Coffee", "8 oz (240 ml)", "80–100 mg"],
                ["Espresso", "1 oz (30 ml) shot", "60–65 mg"],
                ["Cold Brew Coffee", "8 oz (240 ml)", "150–200 mg"],
                ["Instant Coffee", "8 oz (240 ml)", "30–90 mg"],
                ["Black Tea", "8 oz (240 ml)", "40–70 mg"],
                ["Green Tea", "8 oz (240 ml)", "20–45 mg"],
                ["Matcha (prepared)", "8 oz (240 ml)", "70–140 mg"],
                ["Cola Soda", "12 oz (355 ml)", "34–46 mg"],
                ["Energy Drink (Red Bull)", "8.4 oz (250 ml)", "80 mg"],
                ["Energy Drink (Monster)", "16 oz (473 ml)", "160 mg"],
                ["Dark Chocolate", "1 oz (28 g)", "12–25 mg"],
                ["Decaf Coffee", "8 oz (240 ml)", "2–15 mg"],
              ].map(([bev, size, mg]) => (
                <tr key={bev} className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800">
                  <td className="px-4 py-2 text-slate-700 dark:text-slate-300 font-medium">{bev}</td>
                  <td className="px-4 py-2 text-slate-600 dark:text-slate-400">{size}</td>
                  <td className="px-4 py-2 text-blue-700 dark:text-blue-400 font-semibold">{mg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <ol className="list-decimal pl-5 space-y-3 text-slate-700 dark:text-slate-300">
          <li><strong>Enter your body weight</strong> in kg or lbs. This is the primary factor in your caffeine limit.</li>
          <li><strong>Add your age</strong> (optional). Under 18? The limit drops to 2.5 mg/kg following AAP guidelines.</li>
          <li><strong>Select pregnancy status.</strong> Pregnant? The ACOG recommends staying under 200 mg/day regardless of weight.</li>
          <li><strong>Note any heart conditions.</strong> Heart issues trigger a 25% reduction in your calculated limit.</li>
          <li><strong>Log your daily beverages</strong> using the serving counters. The calculator totals your intake and shows remaining safe allowance.</li>
        </ol>
        <p className="mt-4 text-slate-600 dark:text-slate-400 text-sm">
          Example: A 75 kg healthy adult who drank 2 coffees (190 mg) and 1 energy drink (80 mg) has consumed 270 mg out of a 300 mg limit — leaving 30 mg of safe headroom.
        </p>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Tips for Managing Caffeine Intake</h2>
        <ul className="list-disc pl-5 space-y-3 text-slate-700 dark:text-slate-300">
          <li><strong>Stop caffeine 6+ hours before bed.</strong> Caffeine's half-life is 5–6 hours. A 4 PM coffee is half-strength at 10 PM.</li>
          <li><strong>Track hidden sources.</strong> Pre-workout supplements, some pain relievers (Excedrin = 65 mg/tablet), and protein bars contain caffeine.</li>
          <li><strong>Don't use caffeine to mask fatigue.</strong> It blocks adenosine receptors but doesn't replenish energy — only sleep does.</li>
          <li><strong>Cycle your intake.</strong> Tolerance builds in 1–4 days. Taking 1–2 caffeine-free days per week maintains sensitivity.</li>
          <li><strong>Stay hydrated.</strong> Caffeine has a mild diuretic effect. Drink an extra glass of water for every 2 cups of coffee.</li>
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
        { title: "Grass Seed Quantity Calculator", url: "/everyday/grass-seed-quantity", icon: "💡" },
        { title: "Event Budget Calculator", url: "/everyday/event-budget-calculator", icon: "💡" },
        { title: "Light Bulb Cost per Year Calculator", url: "/everyday/light-bulb-cost-per-year", icon: "🏠" },
        { title: "Life Expectancy Calculator", url: "/everyday/life-expectancy", icon: "💡" },
        { title: "Square Footage Calculator", url: "/everyday/square-footage-calculator", icon: "💡" },
        { title: "Buffet Serving Pan Capacity & Count", url: "/everyday/buffet-pan-capacity-count", icon: "💡" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Safe Daily Limit" },
        { id: "caffeine-table", label: "Caffeine by Beverage" },
        { id: "how-to", label: "How to Use" },
        { id: "tips", label: "Tips" },
        { id: "faq", label: "FAQ" },
        { id: "references", label: "References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}
