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

const activities = [
  { label: "Running (6 mph / 10 km/h)", met: 9.8 },
  { label: "Walking (3 mph / 4.8 km/h)", met: 3.5 },
  { label: "Cycling (12-14 mph / 19-22 km/h)", met: 8.0 },
  { label: "Swimming (moderate effort)", met: 6.0 },
  { label: "Yoga", met: 2.5 },
  { label: "Weightlifting (general)", met: 6.0 },
  { label: "Basketball (game)", met: 8.0 },
  { label: "Dancing (general)", met: 5.5 },
  { label: "Hiking (moderate effort)", met: 6.0 },
  { label: "Jumping Rope", met: 12.3 },
];

export default function CaloriesBurnedMetCalculator() {
  // 1. STATE (Imperial Default)
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState({
    weight: "",
    weightMetric: "", // kg
    heightFeet: "",
    heightInches: "",
    heightCm: "",
    duration: "", // minutes
    activityMet: activities[0].met,
  });

  // 2. LOGIC
  // Convert height to meters (not used directly in MET calc but kept for completeness)
  const heightMeters = useMemo(() => {
    if (unit === "imperial") {
      const feet = parseFloat(inputs.heightFeet) || 0;
      const inches = parseFloat(inputs.heightInches) || 0;
      return (feet * 12 + inches) * 0.0254;
    } else {
      return parseFloat(inputs.heightCm) / 100 || 0;
    }
  }, [inputs.heightFeet, inputs.heightInches, inputs.heightCm, unit]);

  // Convert weight to kg
  const weightKg = useMemo(() => {
    if (unit === "imperial") {
      const lbs = parseFloat(inputs.weight) || 0;
      return lbs * 0.45359237;
    } else {
      return parseFloat(inputs.weightMetric) || 0;
    }
  }, [inputs.weight, inputs.weightMetric, unit]);

  // Duration in hours
  const durationHours = useMemo(() => {
    const mins = parseFloat(inputs.duration) || 0;
    return mins / 60;
  }, [inputs.duration]);

  // Calculate calories burned using MET formula:
  // Calories burned = MET × weight (kg) × duration (hours)
  const caloriesBurned = useMemo(() => {
    if (
      weightKg > 0 &&
      durationHours > 0 &&
      inputs.activityMet > 0
    ) {
      const cal = inputs.activityMet * weightKg * durationHours;
      return Math.round(cal);
    }
    return 0;
  }, [weightKg, durationHours, inputs.activityMet]);

  const results = useMemo(() => {
    if (caloriesBurned === 0) {
      return { value: 0, label: "", category: "" };
    }
    let category = "";
    if (caloriesBurned < 100) category = "Low Calorie Burn";
    else if (caloriesBurned < 300) category = "Moderate Calorie Burn";
    else category = "High Calorie Burn";

    return {
      value: caloriesBurned.toLocaleString(),
      label: "Calories Burned",
      category,
    };
  }, [caloriesBurned]);

  // 3. FAQS
  const faqs = [
    {
      question: "What is the Calories Burned by Activity (MET-based) calculation?",
      answer:
        "The Calories Burned by Activity calculator estimates the energy expenditure during physical activities using the Metabolic Equivalent of Task (MET) values. MET is a standardized unit that represents the energy cost of physical activities as multiples of resting metabolic rate. By inputting your weight, activity type, and duration, this calculator provides an estimate of calories burned, helping you understand your exercise impact.",
    },
    {
      question: "How should I interpret the calorie burn results?",
      answer:
        "The calorie burn result represents the approximate number of kilocalories (kcal) your body expends during the selected activity and duration. Higher values indicate greater energy expenditure. This information can guide weight management, fitness planning, and nutritional needs. Remember, individual variations exist based on metabolism, fitness level, and exercise intensity.",
    },
    {
      question: "What are the limitations of using MET values for calorie estimation?",
      answer:
        "While MET values provide a useful standardized approach, they are averages and may not capture individual differences such as age, sex, fitness level, or exercise intensity variations. Additionally, MET tables often represent typical activity intensities, so actual energy expenditure may differ. For precise measurements, specialized equipment like indirect calorimetry is required.",
    },
    {
      question: "Can I use this calculator for all types of physical activities?",
      answer:
        "This calculator includes common activities with established MET values. For activities not listed, you can find MET values from trusted sources like the Compendium of Physical Activities. Always choose the closest matching activity to get a reasonable estimate. For highly variable or mixed activities, consider using a fitness tracker or professional assessment.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers for inputs
  const handleInputChange = (field: string, value: string | number) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Reset inputs
  const resetInputs = () => {
    setInputs({
      weight: "",
      weightMetric: "",
      heightFeet: "",
      heightInches: "",
      heightCm: "",
      duration: "",
      activityMet: activities[0].met,
    });
  };

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
        {unit === "imperial" ? (
          <div>
            <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
              Weight (lbs)
            </Label>
            <Input
              id="weight"
              type="number"
              min={1}
              step={0.1}
              placeholder="e.g., 150"
              value={inputs.weight}
              onChange={(e) => handleInputChange("weight", e.target.value)}
              aria-describedby="weight-desc"
            />
            <p id="weight-desc" className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Enter your body weight in pounds.
            </p>
          </div>
        ) : (
          <div>
            <Label htmlFor="weightMetric" className="text-slate-700 dark:text-slate-300">
              Weight (kg)
            </Label>
            <Input
              id="weightMetric"
              type="number"
              min={1}
              step={0.1}
              placeholder="e.g., 68"
              value={inputs.weightMetric}
              onChange={(e) => handleInputChange("weightMetric", e.target.value)}
              aria-describedby="weightMetric-desc"
            />
            <p id="weightMetric-desc" className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Enter your body weight in kilograms.
            </p>
          </div>
        )}

        {/* Height Input (optional, educational) */}
        {unit === "imperial" ? (
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="heightFeet" className="text-slate-700 dark:text-slate-300">
                Height (feet)
              </Label>
              <Input
                id="heightFeet"
                type="number"
                min={0}
                step={1}
                placeholder="e.g., 5"
                value={inputs.heightFeet}
                onChange={(e) => handleInputChange("heightFeet", e.target.value)}
                aria-describedby="height-desc"
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="heightInches" className="text-slate-700 dark:text-slate-300">
                Height (inches)
              </Label>
              <Input
                id="heightInches"
                type="number"
                min={0}
                max={11}
                step={1}
                placeholder="e.g., 10"
                value={inputs.heightInches}
                onChange={(e) => handleInputChange("heightInches", e.target.value)}
                aria-describedby="height-desc"
              />
            </div>
          </div>
        ) : (
          <div>
            <Label htmlFor="heightCm" className="text-slate-700 dark:text-slate-300">
              Height (cm)
            </Label>
            <Input
              id="heightCm"
              type="number"
              min={0}
              step={0.1}
              placeholder="e.g., 178"
              value={inputs.heightCm}
              onChange={(e) => handleInputChange("heightCm", e.target.value)}
              aria-describedby="height-desc"
            />
          </div>
        )}
        <p id="height-desc" className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Height is optional and not used in calorie calculation but useful for context.
        </p>

        {/* Activity Selector */}
        <div>
          <Label htmlFor="activity" className="text-slate-700 dark:text-slate-300">
            Activity Type
          </Label>
          <Select
            id="activity"
            value={inputs.activityMet.toString()}
            onValueChange={(val) => handleInputChange("activityMet", parseFloat(val))}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {activities.map((act, i) => (
                <SelectItem key={i} value={act.met.toString()}>
                  {act.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Select the physical activity you performed.
          </p>
        </div>

        {/* Duration Input */}
        <div>
          <Label htmlFor="duration" className="text-slate-700 dark:text-slate-300">
            Duration (minutes)
          </Label>
          <Input
            id="duration"
            type="number"
            min={1}
            step={1}
            placeholder="e.g., 30"
            value={inputs.duration}
            onChange={(e) => handleInputChange("duration", e.target.value)}
            aria-describedby="duration-desc"
          />
          <p id="duration-desc" className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Enter how long you performed the activity.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {}}
          aria-label="Calculate calories burned"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={resetInputs}
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
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">{results.label}</p>
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
          What is the Calories Burned by Activity (MET-based)?
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Calories Burned by Activity calculator uses the Metabolic Equivalent of Task (MET) system to estimate the energy expenditure during various physical activities. MET values represent the ratio of the work metabolic rate to the resting metabolic rate. One MET is defined as the energy cost of sitting quietly, equivalent to approximately 1 kcal/kg/hour. By multiplying the MET value of an activity by your body weight and the duration of the activity, you can estimate the total calories burned.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This method is widely used in exercise physiology and public health to quantify physical activity intensity and energy expenditure. It provides a standardized way to compare different activities and their impact on calorie burn. The MET values used in this calculator are derived from the Compendium of Physical Activities, a comprehensive resource developed by researchers to classify activities by their energy cost.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Understanding calories burned during exercise is essential for weight management, fitness planning, and overall health. This calculator helps individuals estimate how much energy they expend during common activities such as running, cycling, swimming, and more. It is especially useful for tailoring exercise routines to meet specific goals, whether for weight loss, maintenance, or performance enhancement.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          While the MET-based calculation provides a good estimate, it is important to recognize that individual factors such as age, sex, fitness level, and exercise intensity can influence actual calorie burn. Therefore, results should be interpreted as approximate values rather than exact measurements.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To accurately estimate the calories you burn during physical activity using this calculator, follow these steps carefully. The calculator defaults to the Imperial system (lbs, feet, inches) but can be switched to Metric units (kg, cm) as needed.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Input Your Weight:</strong> Enter your body weight in pounds (lbs) if using Imperial units or kilograms (kg) if using Metric. This is a critical factor as calorie burn is directly proportional to body mass.
          </li>
          <li>
            <strong>Select Your Activity:</strong> Choose the physical activity you performed from the dropdown list. Each activity has an associated MET value representing its intensity.
          </li>
          <li>
            <strong>Enter Duration:</strong> Specify the total time you spent performing the activity in minutes. The calculator converts this to hours for the calculation.
          </li>
          <li>
            <strong>Optional Height Input:</strong> While height is not used in the calorie calculation, you can enter it for additional context or future reference.
          </li>
          <li>
            <strong>Calculate:</strong> Click the Calculate button to see your estimated calories burned. Use the Reset button to clear inputs and start a new calculation.
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
              href="https://sites.google.com/site/compendiumofphysicalactivities/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. The Compendium of Physical Activities
            </a>
            <p className="text-slate-500 text-sm mt-1">
              A comprehensive resource providing MET values for hundreds of physical activities. Widely used in research and clinical settings.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.cdc.gov/physicalactivity/basics/measuring/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Centers for Disease Control and Prevention (CDC) - Measuring Physical Activity
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Official guidance on measuring physical activity and understanding energy expenditure for health promotion.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.heart.org/en/healthy-living/fitness/fitness-basics/target-heart-rates"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. American Heart Association - Fitness Basics
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Educational content on exercise intensity, calorie burn, and heart health.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4241367/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              4. Ainsworth BE et al., 2011 - 2011 Compendium of Physical Activities
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Peer-reviewed article updating MET values and methodology for physical activity classification.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Calories Burned by Activity (MET-based)"
      description="Estimate calories burned during exercise. Use MET values to calculate energy expenditure for running, cycling, swimming, and more."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math Formula",
        formula: "Calories Burned = MET × Weight (kg) × Duration (hours)",
        variables: [
          {
            symbol: "MET",
            description:
              "Metabolic Equivalent of Task, a unit representing the energy cost of an activity relative to resting.",
          },
          {
            symbol: "Weight (kg)",
            description: "Your body weight in kilograms.",
          },
          {
            symbol: "Duration (hours)",
            description: "Time spent performing the activity, converted to hours.",
          },
        ],
      }}
      example={{
        title: "Real-World Example",
        scenario:
          "A 150 lb (68 kg) person runs at 6 mph (MET = 9.8) for 30 minutes.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert weight to kilograms: 150 lbs × 0.453592 = 68 kg.",
          },
          {
            label: "Step 2",
            explanation:
              "Convert duration to hours: 30 minutes ÷ 60 = 0.5 hours.",
          },
          {
            label: "Step 3",
            explanation:
              "Calculate calories burned: 9.8 × 68 × 0.5 = 333.2 kcal.",
          },
        ],
        result: "The person burns approximately 333 calories during the run.",
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
        { id: "what-is", label: "What is Calories Burned by Activity (MET-based)?" },
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