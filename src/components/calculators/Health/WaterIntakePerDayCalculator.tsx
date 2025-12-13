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
  CheckCircle2,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

const activityLevels = [
  { value: "sedentary", label: "Sedentary (little or no exercise)", multiplier: 1.0 },
  { value: "light", label: "Lightly active (light exercise 1-3 days/week)", multiplier: 1.1 },
  { value: "moderate", label: "Moderately active (moderate exercise 3-5 days/week)", multiplier: 1.25 },
  { value: "active", label: "Very active (hard exercise 6-7 days/week)", multiplier: 1.4 },
  { value: "extra", label: "Extra active (very hard exercise & physical job)", multiplier: 1.6 },
];

const climates = [
  { value: "temperate", label: "Temperate (mild climate)", multiplier: 1.0 },
  { value: "hot", label: "Hot climate", multiplier: 1.2 },
  { value: "cold", label: "Cold climate", multiplier: 1.1 },
  { value: "high-altitude", label: "High altitude (> 8,000 ft / 2,400 m)", multiplier: 1.15 },
];

export default function WaterIntakePerDayCalculator() {
  // 1. STATE (Imperial Default)
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState({
    weight: "",
    activity: "sedentary",
    climate: "temperate",
  });

  // 2. LOGIC
  /**
   * Calculation logic:
   * Base water intake: 0.5 oz per lb of body weight (US National Academies recommendation ~3.7L men, 2.7L women)
   * Adjusted by activity multiplier (increased water loss from sweat)
   * Adjusted by climate multiplier (hot, cold, altitude affect hydration needs)
   *
   * Formula:
   * Water Intake (oz) = Weight (lbs) * 0.5 * ActivityMultiplier * ClimateMultiplier
   *
   * For metric:
   * Weight in kg * 35 ml * ActivityMultiplier * ClimateMultiplier
   * (35 ml per kg is a common baseline)
   */

  const results = useMemo(() => {
    const weightNum = parseFloat(inputs.weight);
    if (!weightNum || weightNum <= 0) return { value: 0, label: "", category: "" };

    const activityObj = activityLevels.find((a) => a.value === inputs.activity);
    const climateObj = climates.find((c) => c.value === inputs.climate);

    if (!activityObj || !climateObj) return { value: 0, label: "", category: "" };

    let waterOz = 0;
    let label = "";
    if (unit === "imperial") {
      // oz calculation
      waterOz = weightNum * 0.5 * activityObj.multiplier * climateObj.multiplier;
      label = "Fluid Ounces per Day";
      // Round to nearest whole oz for simplicity
      waterOz = Math.round(waterOz);
      return { value: waterOz, label, category: "" };
    } else {
      // metric: ml
      // 35 ml per kg baseline
      const weightKg = weightNum;
      let waterMl = weightKg * 35 * activityObj.multiplier * climateObj.multiplier;
      waterMl = Math.round(waterMl);
      label = "Milliliters per Day";
      return { value: waterMl, label, category: "" };
    }
  }, [inputs, unit]);

  // 3. FAQS
  const faqs = [
    {
      question:
        "How does body weight influence daily water intake recommendations?",
      answer:
        "Body weight is a primary factor in determining hydration needs because water distributes throughout body tissues. Larger individuals generally require more water to maintain proper hydration levels. The baseline recommendation of approximately 0.5 fluid ounces per pound of body weight reflects this relationship, ensuring that water intake scales appropriately with size.",
    },
    {
      question:
        "Why do activity level and climate affect how much water I should drink?",
      answer:
        "Physical activity increases water loss through sweat and respiration, necessitating higher fluid intake to compensate. Similarly, hot climates cause increased sweating, while cold climates can increase respiratory water loss. High altitudes also promote dehydration due to lower humidity and increased breathing rates. Adjusting water intake for these factors helps maintain optimal hydration and physiological function.",
    },
    {
      question:
        "Are there limitations to using this calculator for everyone?",
      answer:
        "Yes. This calculator provides general guidelines based on average physiological responses. Individual hydration needs can vary due to factors like age, health conditions (e.g., kidney disease, heart failure), medications, pregnancy, and breastfeeding. Always consult a healthcare professional for personalized advice, especially if you have specific medical concerns.",
    },
    {
      question:
        "Can drinking too much water be harmful?",
      answer:
        "Yes, excessive water intake can lead to a condition called hyponatremia, where blood sodium levels become dangerously low. This is rare and usually occurs with extreme overhydration. It's important to balance water intake with electrolyte consumption and listen to your body's thirst signals. This calculator aims to provide safe, evidence-based intake estimates.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Unit Switcher & Inputs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select value={unit} onValueChange={setUnit}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="imperial">Imperial (US/Canada)</SelectItem>
              <SelectItem value="metric">Metric (International)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Weight Input */}
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300 mb-1 block font-semibold">
            Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            type="number"
            min={0}
            step="any"
            placeholder={unit === "imperial" ? "e.g. 150" : "e.g. 68"}
            value={inputs.weight}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, weight: e.target.value }))
            }
            aria-describedby="weight-desc"
          />
          <p id="weight-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter your body weight in {unit === "imperial" ? "pounds (lbs)" : "kilograms (kg)"}
          </p>
        </div>

        {/* Activity Level Select */}
        <div>
          <Label htmlFor="activity" className="text-slate-700 dark:text-slate-300 mb-1 block font-semibold">
            Activity Level
          </Label>
          <Select
            id="activity"
            value={inputs.activity}
            onValueChange={(value) =>
              setInputs((prev) => ({ ...prev, activity: value }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {activityLevels.map((level) => (
                <SelectItem key={level.value} value={level.value}>
                  {level.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Select your typical daily activity level.
          </p>
        </div>

        {/* Climate Select */}
        <div>
          <Label htmlFor="climate" className="text-slate-700 dark:text-slate-300 mb-1 block font-semibold">
            Climate
          </Label>
          <Select
            id="climate"
            value={inputs.climate}
            onValueChange={(value) =>
              setInputs((prev) => ({ ...prev, climate: value }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {climates.map((climate) => (
                <SelectItem key={climate.value} value={climate.value}>
                  {climate.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Select the climate you live in or are exposed to most often.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No special action needed, calculation is reactive
          }}
          aria-label="Calculate water intake"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              weight: "",
              activity: "sedentary",
              climate: "temperate",
            })
          }
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results (High Contrast for Dark Mode) */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" role="region" aria-live="polite">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Your Result
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
                {results.value.toLocaleString()}
              </p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">
                {results.label}
              </p>
              {results.category && (
                <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-white/50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 text-blue-800 dark:text-blue-300 text-sm font-bold">
                  {results.category}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      {/* MANDATORY "WHAT IS" SECTION */}
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          What is the Water Intake per Day (by weight/activity/climate)?
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Water intake per day is the amount of fluid an individual needs to
          consume to maintain optimal hydration, which is essential for
          physiological functions such as temperature regulation, joint
          lubrication, and nutrient transport. This calculator estimates daily
          water needs by considering three critical factors: body weight,
          physical activity level, and environmental climate. These factors
          influence how much water the body loses and therefore how much must
          be replenished.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Body weight is a foundational determinant because water distributes
          throughout body tissues, and larger bodies require more fluid to
          maintain balance. Physical activity increases water loss through
          sweat and respiration, necessitating higher intake to prevent
          dehydration. Climate impacts hydration needs as well; hot or humid
          environments increase sweat rates, cold climates can increase water
          loss via respiration, and high altitudes promote dehydration through
          increased breathing and lower humidity.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This calculator uses evidence-based multipliers to adjust baseline
          water intake recommendations, providing a personalized estimate that
          helps users stay properly hydrated in their unique circumstances.
          While it offers a scientifically grounded guideline, individual needs
          may vary based on health status, age, and other factors. Always
          consult healthcare professionals for tailored advice.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To estimate your daily water intake, follow these simple steps using
          the inputs provided. This tool defaults to imperial units (pounds,
          fluid ounces) but can be switched to metric (kilograms, milliliters)
          for international users. Enter your current body weight, select your
          typical activity level, and choose the climate that best describes
          your environment.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Weight:</strong> Enter your body weight in pounds (lbs) or
            kilograms (kg) depending on the selected unit system.
          </li>
          <li>
            <strong>Activity Level:</strong> Choose the activity level that
            most closely matches your daily routine, from sedentary to extra
            active.
          </li>
          <li>
            <strong>Climate:</strong> Select the climate you live in or spend
            most of your time in, as this affects hydration needs.
          </li>
          <li>
            <strong>Calculate:</strong> Click the calculate button to see your
            personalized daily water intake recommendation.
          </li>
          <li>
            <strong>Reset:</strong> Use the reset button to clear inputs and
            start over.
          </li>
        </ul>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Frequently Asked Questions
        </h2>
        <ul className="space-y-6">
          {faqs.map((item, i) => (
            <li
              key={i}
              className="border-b border-slate-200 dark:border-slate-800 pb-4 last:border-0"
            >
              <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-2">
                {item.question}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.answer}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Trusted References
        </h2>
        <ul className="space-y-4">
          <li className="block">
            <a
              href="https://www.nap.edu/read/10925/chapter/1"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. National Academies of Sciences, Engineering, and Medicine (2004)
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Dietary Reference Intakes for Water, Potassium, Sodium, Chloride,
              and Sulfate. Comprehensive guidelines on water intake for health.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.cdc.gov/nutrition/data-statistics/plain-water-the-healthier-choice.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Centers for Disease Control and Prevention (CDC)
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Plain Water Consumption and Hydration: Importance and Recommendations.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.hydrationforhealth.com/en/hydration-facts/hydration-and-physical-activity/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Hydration for Health (European Hydration Institute)
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Effects of Physical Activity and Climate on Hydration Needs.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/expert-answers/water/faq-20058345"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              4. Mayo Clinic
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Water: How much should you drink every day? Practical hydration advice.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Water Intake per Day (by weight/activity/climate)"
      description="Calculate your daily water intake requirements. Stay hydrated by adjusting for body weight, activity level, and climate conditions."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math Formula",
        formula:
          "Water Intake = Weight × Base Intake per Unit Weight × Activity Multiplier × Climate Multiplier",
        variables: [
          {
            symbol: "Weight",
            description:
              "Your body weight in pounds (lbs) or kilograms (kg) depending on unit system",
          },
          {
            symbol: "Base Intake per Unit Weight",
            description:
              "0.5 fluid ounces per pound (imperial) or 35 milliliters per kilogram (metric)",
          },
          {
            symbol: "Activity Multiplier",
            description:
              "Factor based on your physical activity level (ranges from 1.0 to 1.6)",
          },
          {
            symbol: "Climate Multiplier",
            description:
              "Factor based on environmental climate (ranges from 1.0 to 1.2)",
          },
        ],
      }}
      example={{
        title: "Real-World Example",
        scenario:
          "A 180 lb moderately active person living in a hot climate wants to know their daily water intake.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Start with base intake: 180 lbs × 0.5 oz = 90 oz",
          },
          {
            label: "Step 2",
            explanation:
              "Apply activity multiplier: 90 oz × 1.25 (moderate activity) = 112.5 oz",
          },
          {
            label: "Step 3",
            explanation:
              "Apply climate multiplier: 112.5 oz × 1.2 (hot climate) = 135 oz",
          },
          {
            label: "Result",
            explanation:
              "Recommended daily water intake is approximately 135 fluid ounces.",
          },
        ],
        result: "135 fluid ounces per day",
      }}
      relatedCalculators={[
        {
          title: "BMI — Body Mass Index Calculator",
          url: "/health/bmi-body-mass-index",
          icon: "⚖️",
        },
        {
          title: "BMR — Basal Metabolic Rate (Mifflin-St Jeor)",
          url: "/health/bmr-mifflin-st-jeor",
          icon: "🔥",
        },
        {
          title: "TDEE — Total Daily Energy Expenditure Calculator",
          url: "/health/tdee-daily-energy-expenditure",
          icon: "🔥",
        },
        {
          title: "Body Fat % (US Navy / 3-sites)",
          url: "/health/body-fat-us-navy-3-sites",
          icon: "💧",
        },
        {
          title: "Ideal Weight Range (Hamwi/Devine/Miller)",
          url: "/health/ideal-weight-range-hamwi-devine-miller",
          icon: "🥗",
        },
        {
          title: "Waist-to-Height Ratio Checker",
          url: "/health/waist-to-height-ratio",
          icon: "😴",
        },
      ]}
      onThisPage={[
        {
          id: "what-is",
          label: "What is Water Intake per Day (by weight/activity/climate)?",
        },
        { id: "how-to-use", label: "How to Use This Calculator" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "Trusted References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}