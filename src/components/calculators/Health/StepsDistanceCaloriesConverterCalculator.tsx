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
import { useWeightUnitPreference } from "@/hooks/useWeightUnitPreference";
import { convertWeight } from "@/lib/utils";

export default function StepsDistanceCaloriesConverterCalculator() {
  // 1. STATE (Imperial Default)
  const { unit: preferredWeightUnit, setUnit: setPreferredWeightUnit } = useWeightUnitPreference();
  const [unit, setUnit] = useState<"imperial" | "metric">(() => (preferredWeightUnit === "lb" ? "imperial" : "metric"));
  const [inputs, setInputs] = useState<{
    steps?: number;
    distance?: number;
    weight?: number;
  }>({});

  // Constants for conversions and calculations
  // Average step length varies by height and gender but commonly:
  // Imperial: ~2.5 feet per step (30 inches)
  // Metric: ~0.762 meters per step
  // Calories burned per step depends on weight and step length.
  // Approximate formula for calories burned walking:
  // Calories = Weight (lbs) * Distance (miles) * 0.57 (approximate factor)
  // Source: Harvard Health Publishing

  // 2. LOGIC
  const results = useMemo(() => {
    const steps = inputs.steps ?? 0;
    const distanceInput = inputs.distance ?? 0;
    const weight = inputs.weight ?? 0;

    // Validate inputs
    if (
      (steps === 0 && distanceInput === 0) ||
      weight === 0 ||
      weight === undefined
    ) {
      return { value: 0, label: "", category: "" };
    }

    // Step length assumptions
    // Imperial: 2.5 feet per step (average adult)
    // Metric: 0.762 meters per step (2.5 feet)
    const stepLengthFeet = 2.5;
    const stepLengthMeters = 0.762;

    // Conversion constants
    const feetPerMile = 5280;
    const metersPerKm = 1000;
    const lbsToKg = 0.453592;

    // Calculate distance from steps if steps provided
    let distanceMiles = 0;
    let distanceKm = 0;
    if (steps > 0) {
      if (unit === "imperial") {
        const totalFeet = steps * stepLengthFeet;
        distanceMiles = totalFeet / feetPerMile;
        distanceKm = distanceMiles * 1.60934;
      } else {
        const totalMeters = steps * stepLengthMeters;
        distanceKm = totalMeters / metersPerKm;
        distanceMiles = distanceKm / 1.60934;
      }
    } else if (distanceInput > 0) {
      // Distance input given, convert to miles and km
      if (unit === "imperial") {
        distanceMiles = distanceInput;
        distanceKm = distanceInput * 1.60934;
      } else {
        distanceKm = distanceInput;
        distanceMiles = distanceKm / 1.60934;
      }
    }

    // Calculate steps from distance if steps not provided
    let calculatedSteps = steps;
    if (steps === 0 && distanceInput > 0) {
      if (unit === "imperial") {
        const totalFeet = distanceInput * feetPerMile;
        calculatedSteps = Math.round(totalFeet / stepLengthFeet);
      } else {
        const totalMeters = distanceInput * metersPerKm;
        calculatedSteps = Math.round(totalMeters / stepLengthMeters);
      }
    }

    // Calculate calories burned
    // Calories burned walking formula:
    // Calories = Weight (lbs) * Distance (miles) * 0.57
    // For metric, convert weight to lbs first
    let weightLbs = weight;
    if (unit === "metric") {
      weightLbs = weight / lbsToKg;
    }
    const caloriesBurned = +(weightLbs * distanceMiles * 0.57).toFixed(2);

    // Format results for display
    const formattedDistance =
      unit === "imperial"
        ? `${distanceMiles.toFixed(2)} miles`
        : `${distanceKm.toFixed(2)} km`;
    const formattedSteps = calculatedSteps.toLocaleString();
    const formattedCalories = `${caloriesBurned.toLocaleString()} kcal`;

    return {
      value: 0,
      label: "",
      category: "",
      steps: formattedSteps,
      distance: formattedDistance,
      calories: formattedCalories,
    };
  }, [inputs, unit]);

  // 3. FAQS
  const faqs = [
    {
      question: "What factors influence the accuracy of this converter?",
      answer:
        "The accuracy of the Steps ↔ Distance ↔ Calories Converter depends on several factors including individual step length, walking speed, terrain, and body weight. Step length varies by height, gender, and walking style, which can affect distance calculations. Additionally, calories burned depend on weight and walking intensity. This tool uses average values to provide estimates but individual results may vary.",
    },
    {
      question: "How should I interpret the calories burned result?",
      answer:
        "The calories burned estimate represents the approximate energy expenditure from walking the calculated distance based on your weight. It uses a standard metabolic equivalent (MET) value for walking at a moderate pace. Remember, actual calories burned can vary due to factors like walking speed, incline, metabolism, and fitness level. Use this as a guideline rather than an exact measurement.",
    },
    {
      question: "Can I use this calculator if I only know my steps or distance?",
      answer:
        "Yes, you can input either your number of steps or the distance walked. The calculator will estimate the missing value based on average step length assumptions. For the most accurate calorie calculation, you should also provide your body weight. If you only input steps or distance without weight, the calorie calculation will not be performed.",
    },
    {
      question: "Why does the calculator default to imperial units?",
      answer:
        "This calculator defaults to imperial units (feet, miles, pounds) to align with common usage in the US and Canada, where these units are standard for daily activity tracking. However, you can easily switch to metric units (meters, kilometers, kilograms) using the unit selector to suit your preference or regional standards.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers for inputs
  function handleInputChange(
    field: "steps" | "distance" | "weight",
    value: string
  ) {
    const num = Number(value);
    if (isNaN(num) || num < 0) return;
    setInputs((prev) => ({ ...prev, [field]: num }));
  }

  const widget = (
    <div className="space-y-6">
      {/* Unit Switcher & Inputs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select
            value={unit}
            onValueChange={(next) => {
              if (next !== "imperial" && next !== "metric") return;
              setInputs((prev) => {
                if (next === unit) return prev;
                if (prev.weight === undefined || prev.weight <= 0) return prev;
                const nextWeight = convertWeight(prev.weight, unit === "imperial" ? "lb" : "kg", next === "imperial" ? "lb" : "kg");
                return { ...prev, weight: +nextWeight.toFixed(2) };
              });
              setUnit(next);
              setPreferredWeightUnit(next === "imperial" ? "lb" : "kg");
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="imperial">Imperial (US/Canada)</SelectItem>
              <SelectItem value="metric">Metric (International)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Steps Input */}
        <div>
          <Label htmlFor="steps" className="text-slate-700 dark:text-slate-300">
            Steps Walked
          </Label>
          <Input
            id="steps"
            type="number"
            min={0}
            placeholder="e.g. 5000"
            value={inputs.steps ?? ""}
            onChange={(e) => handleInputChange("steps", e.target.value)}
            aria-describedby="steps-help"
          />
          <p
            id="steps-help"
            className="text-sm text-slate-500 dark:text-slate-400 mt-1"
          >
            Enter the number of steps you walked.
          </p>
        </div>

        {/* Distance Input */}
        <div>
          <Label htmlFor="distance" className="text-slate-700 dark:text-slate-300">
            Distance Walked ({unit === "imperial" ? "miles" : "kilometers"})
          </Label>
          <Input
            id="distance"
            type="number"
            min={0}
            step="0.01"
            placeholder={unit === "imperial" ? "e.g. 2.5" : "e.g. 4.0"}
            value={inputs.distance ?? ""}
            onChange={(e) => handleInputChange("distance", e.target.value)}
            aria-describedby="distance-help"
          />
          <p
            id="distance-help"
            className="text-sm text-slate-500 dark:text-slate-400 mt-1"
          >
            Enter the distance you walked. Leave blank if you entered steps.
          </p>
        </div>

        {/* Weight Input */}
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Body Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            type="number"
            min={0}
            step="0.1"
            placeholder={unit === "imperial" ? "e.g. 150" : "e.g. 68"}
            value={inputs.weight ?? ""}
            onChange={(e) => handleInputChange("weight", e.target.value)}
            aria-describedby="weight-help"
          />
          <p
            id="weight-help"
            className="text-sm text-slate-500 dark:text-slate-400 mt-1"
          >
            Enter your body weight for calorie calculation.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by resetting inputs to current values (no-op)
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({})}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results (High Contrast for Dark Mode) */}
      {(results.steps || results.distance || results.calories) && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Your Result
              </p>
              <p className="text-3xl font-extrabold text-blue-900 dark:text-white mb-2">
                Steps:{" "}
                <span className="text-5xl dark:text-white">{results.steps}</span>
              </p>
              <p className="text-3xl font-extrabold text-blue-900 dark:text-white mb-2">
                Distance:{" "}
                <span className="text-5xl dark:text-white">{results.distance}</span>
              </p>
              <p className="text-3xl font-extrabold text-blue-900 dark:text-white">
                Calories Burned:{" "}
                <span className="text-5xl dark:text-white">{results.calories}</span>
              </p>
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
          What is the Steps ↔ Distance ↔ Calories Converter?
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Steps ↔ Distance ↔ Calories Converter is a specialized tool designed
          to help individuals estimate the relationship between the number of steps
          they take, the distance they cover, and the calories they burn during
          walking activities. By inputting any two of these variables—steps, distance,
          or body weight—the calculator provides an estimate of the third, enabling
          users to better understand their physical activity and its impact on their
          health and fitness goals.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This converter uses average step length assumptions and scientifically
          supported formulas to translate steps into distance and calories burned.
          It accounts for differences in unit systems, defaulting to imperial units
          (feet, miles, pounds) commonly used in the US and Canada, but also supports
          metric units for international users. The tool is particularly useful for
          those tracking daily walking activity with pedometers or fitness trackers,
          providing a clearer picture of their energy expenditure.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Understanding the interplay between steps, distance, and calories burned
          is essential for effective fitness planning and weight management. Walking
          is a low-impact, accessible form of exercise that contributes significantly
          to cardiovascular health, weight control, and overall well-being. This
          converter empowers users with actionable insights to optimize their walking
          routines and achieve personalized health outcomes.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using the Steps ↔ Distance ↔ Calories Converter is straightforward and
          intuitive. Begin by selecting your preferred unit system—Imperial (feet,
          miles, pounds) or Metric (meters, kilometers, kilograms). Then, enter your
          known values in the input fields. You can provide either the number of
          steps you walked or the distance covered. Additionally, input your body
          weight to enable calorie burn estimation.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Steps Walked:</strong> Enter the total number of steps taken. If
            unknown, leave blank and provide distance instead.
          </li>
          <li>
            <strong>Distance Walked:</strong> Enter the distance you walked in miles
            or kilometers, depending on your selected unit system. Leave blank if you
            entered steps.
          </li>
          <li>
            <strong>Body Weight:</strong> Input your current weight to calculate
            calories burned accurately. This field is required for calorie
            estimation.
          </li>
        </ul>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
          After entering your data, click the "Calculate" button to see your results.
          The calculator will display the estimated steps, distance, and calories
          burned based on your inputs. Use the "Reset" button to clear all fields
          and start a new calculation.
        </p>
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
              href="https://www.cdc.gov/physicalactivity/basics/measuring/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Centers for Disease Control and Prevention (CDC) - Measuring Physical Activity
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Comprehensive guidelines on measuring physical activity including steps and distance.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.health.harvard.edu/diet-and-weight-loss/calories-burned-in-30-minutes-of-leisure-and-routine-activities"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Harvard Health Publishing - Calories Burned in 30 Minutes of Leisure and Routine Activities
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Authoritative source on calorie expenditure during walking and other activities.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4241367/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. National Institutes of Health - Step Length and Walking Speed Variability
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Research article discussing step length variability and its impact on distance estimation.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.who.int/news-room/fact-sheets/detail/physical-activity"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              4. World Health Organization - Physical Activity Fact Sheet
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Global recommendations and health benefits of physical activity including walking.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Steps ↔ Distance ↔ Calories Converter"
      description="Convert steps into distance and calories burned. Track your daily walking activity and visualize its impact on your fitness goals."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math Formula",
        formula:
          "Calories Burned = Weight (lbs) × Distance (miles) × 0.57",
        variables: [
          {
            symbol: "Weight (lbs)",
            description: "Your body weight in pounds (or converted from kg).",
          },
          {
            symbol: "Distance (miles)",
            description:
              "Distance walked in miles, calculated from steps and average step length.",
          },
          {
            symbol: "0.57",
            description:
              "Average calories burned per pound per mile walked (approximate factor).",
          },
        ],
      }}
      example={{
        title: "Real-World Example",
        scenario:
          "John weighs 180 lbs and walked 6,000 steps today. He wants to know how far he walked and how many calories he burned.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Calculate distance: 6,000 steps × 2.5 feet/step = 15,000 feet. Convert to miles: 15,000 ÷ 5,280 = 2.84 miles.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate calories burned: 180 lbs × 2.84 miles × 0.57 = approximately 291 calories burned.",
          },
        ],
        result:
          "John walked approximately 2.84 miles and burned around 291 calories.",
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
        { id: "what-is", label: "What is Steps ↔ Distance ↔ Calories Converter?" },
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
