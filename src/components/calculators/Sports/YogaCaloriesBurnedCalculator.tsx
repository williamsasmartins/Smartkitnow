import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ FULL ICON IMPORT
import { Activity, Timer, TrendingUp, Dumbbell, Trophy, Medal, Flag, Flame, Zap, Heart, Scale, Calculator, Info, RotateCcw, AlertTriangle, BookOpen, ExternalLink, Waves, Gauge } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

const yogaTypes = [
  { label: "Hatha Yoga (Light Intensity)", mets: 2.5 },
  { label: "Vinyasa Yoga (Moderate Intensity)", mets: 4.0 },
  { label: "Bikram/Hot Yoga (High Intensity)", mets: 5.5 },
];

export default function YogaCaloriesBurnedCalculator() {
  const [inputs, setInputs] = useState({
    weight: "",
    duration: "",
    yogaType: yogaTypes[0].mets.toString(),
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Calculate calories burned using METs formula:
  // Calories burned = METs × weight (kg) × duration (hours)
  // Source: ACSM metabolic calculations
  const results = useMemo(() => {
    const weight = parseFloat(inputs.weight);
    const duration = parseFloat(inputs.duration);
    const mets = parseFloat(inputs.yogaType);

    if (!weight || weight <= 0) {
      return {
        value: null,
        label: "Invalid Weight",
        subtext: "Please enter a valid weight in kilograms.",
        warning: true,
        formulaUsed: "",
      };
    }
    if (!duration || duration <= 0) {
      return {
        value: null,
        label: "Invalid Duration",
        subtext: "Please enter a valid duration in minutes.",
        warning: true,
        formulaUsed: "",
      };
    }
    if (!mets || mets <= 0) {
      return {
        value: null,
        label: "Invalid Yoga Type",
        subtext: "Please select a valid yoga intensity type.",
        warning: true,
        formulaUsed: "",
      };
    }

    // Convert duration from minutes to hours
    const durationHours = duration / 60;

    // Calculate calories burned
    const caloriesBurned = mets * weight * durationHours;

    return {
      value: caloriesBurned.toFixed(2) + " kcal",
      label: "Estimated Calories Burned",
      subtext: `Based on MET value of ${mets}, weight ${weight} kg, and duration ${duration} minutes.`,
      warning: null,
      formulaUsed: `Calories = METs × Weight (kg) × Duration (hours) = ${mets} × ${weight} × ${durationHours.toFixed(
        2
      )}`,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is a MET and why is it used in this calculator?",
      answer:
        "MET stands for Metabolic Equivalent of Task, a unit that estimates the energy expenditure of physical activities compared to resting metabolism. It allows standardized comparison of calorie burn across different activities and intensities, making it ideal for calculating calories burned during yoga sessions.",
    },
    {
      question: "Does this calculator account for different yoga styles?",
      answer:
        "Yes, this calculator includes MET values for common yoga styles such as Hatha (light intensity), Vinyasa (moderate intensity), and Bikram/Hot Yoga (high intensity). These values reflect the varying energy demands of each style, providing a more accurate calorie burn estimate.",
    },
    {
      question: "Can I use this calculator if I practice yoga at home without a class?",
      answer:
        "Absolutely. The calculator estimates calories burned based on your weight, session duration, and yoga intensity, regardless of location. Just select the yoga style that best matches your practice intensity for accurate results.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="weight" className="flex items-center gap-1">
              <Scale className="w-4 h-4 text-blue-600" /> Body Weight (kg)
            </Label>
            <Input
              id="weight"
              type="number"
              min="1"
              step="any"
              placeholder="e.g. 70"
              value={inputs.weight}
              onChange={(e) => handleInputChange("weight", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="duration" className="flex items-center gap-1">
              <Timer className="w-4 h-4 text-blue-600" /> Duration (minutes)
            </Label>
            <Input
              id="duration"
              type="number"
              min="1"
              step="any"
              placeholder="e.g. 60"
              value={inputs.duration}
              onChange={(e) => handleInputChange("duration", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="yogaType" className="flex items-center gap-1">
              <Activity className="w-4 h-4 text-blue-600" /> Yoga Style / Intensity
            </Label>
            <Select
              value={inputs.yogaType}
              onValueChange={(v) => handleInputChange("yogaType", v)}
            >
              <SelectTrigger id="yogaType" aria-label="Select Yoga Style">
                <SelectValue placeholder="Select Yoga Style" />
              </SelectTrigger>
              <SelectContent>
                {yogaTypes.map((type) => (
                  <SelectItem key={type.mets} value={type.mets.toString()}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No extra action needed, calculation is reactive
          }}
          aria-label="Calculate Calories Burned"
        >
          <Trophy className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", duration: "", yogaType: yogaTypes[0].mets.toString() })}
          className="flex-1 h-11"
          aria-label="Reset Inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            {results.warning ? (
              <p className="text-xl font-semibold text-red-600 dark:text-red-400">{results.label}</p>
            ) : (
              <>
                <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
                <p className="mt-2 text-sm text-blue-700 dark:text-blue-300">{results.subtext}</p>
                <p className="mt-1 text-xs italic text-slate-600 dark:text-slate-400">
                  Formula used: {results.formulaUsed}
                </p>
              </>
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
          Understanding Yoga Calories Burned Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator estimates the number of calories burned during a yoga session by using the Metabolic Equivalent of Task (MET) values specific to different yoga styles. MET is a standardized unit that quantifies the energy cost of physical activities relative to resting metabolic rate. By inputting your body weight, session duration, and selecting the yoga style, the calculator applies the formula: Calories burned = MET × weight (kg) × duration (hours). This approach provides a scientifically grounded estimate of energy expenditure tailored to your practice intensity.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Different yoga styles vary significantly in their physical demands. For example, Hatha yoga is generally a low-intensity practice focusing on gentle postures and breathing, while Vinyasa involves continuous flow and moderate exertion. Bikram or Hot Yoga, performed in heated rooms, increases cardiovascular strain and calorie burn. This calculator incorporates these variations by using MET values validated by exercise physiology research, ensuring accurate and personalized results.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To estimate your calories burned during yoga, simply enter your body weight in kilograms and the duration of your yoga session in minutes. Then, select the yoga style that best matches your practice intensity from the dropdown menu. Once all inputs are provided, click the "Calculate" button to see your estimated calorie expenditure.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter your body weight in kilograms. Accurate weight input is crucial as calorie burn is directly proportional to body mass.
          </li>
          <li>
            <strong>Step 2:</strong> Input the total duration of your yoga session in minutes. The calculator converts this to hours internally for the formula.
          </li>
          <li>
            <strong>Step 3:</strong> Select your yoga style/intensity (Hatha, Vinyasa, or Bikram/Hot Yoga) to apply the correct MET value.
          </li>
          <li>
            <strong>Step 4:</strong> Click "Calculate" to view your estimated calories burned, along with the formula used for transparency.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips & Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To maximize the benefits of your yoga practice and optimize calorie burn, consider incorporating a mix of yoga styles. For instance, combining gentle Hatha sessions with more dynamic Vinyasa flows can improve flexibility and cardiovascular fitness simultaneously. Bikram or Hot Yoga sessions can further increase calorie expenditure due to the elevated temperature and intensity, but ensure proper hydration and acclimatization to heat.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Consistency is key: regular yoga practice not only burns calories but also enhances muscular endurance, balance, and mental well-being. Tracking your calorie burn over time can help you adjust session length and intensity to meet your fitness goals. Remember to complement yoga with other forms of exercise and a balanced diet for holistic health.
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

      {/* REFERENCES SECTION */}
      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References & Additional Resources</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
          For more information on exercise physiology, energy expenditure, and yoga training science, consult the following authoritative sources:
        </p>
        <ul className="space-y-4">
          <li>
            <a
              href="https://www.acsm.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              American College of Sports Medicine <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              The ACSM is a global leader in sports medicine and exercise science research, providing evidence-based guidelines on physical activity and energy expenditure.
            </p>
          </li>
          <li>
            <a
              href="https://www.nsca.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              National Strength and Conditioning Association (NSCA) <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              The NSCA offers comprehensive resources on strength training, conditioning, and metabolic calculations relevant to sports performance and fitness.
            </p>
          </li>
          <li>
            <a
              href="https://www.runnersworld.com/health-injuries/a20865688/how-many-calories-does-yoga-burn/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Runner's World - How Many Calories Does Yoga Burn? <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              A practical article discussing calorie burn across various yoga styles, providing MET values and real-world insights.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Yoga Calories Burned Calculator"
      description="Estimate calories burned during yoga. Calculate energy expenditure for Hatha, Vinyasa, or Bikram yoga sessions."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Calories Burned Formula",
        formula: "Calories = MET × Weight (kg) × Duration (hours)",
        variables: [
          { symbol: "MET", description: "Metabolic Equivalent of Task for the yoga style" },
          { symbol: "Weight (kg)", description: "Your body weight in kilograms" },
          { symbol: "Duration (hours)", description: "Duration of the yoga session in hours" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "A 70 kg individual practices Vinyasa yoga for 60 minutes. Vinyasa has a MET value of 4.0, representing moderate intensity.",
        steps: [
          {
            label: "Step 1",
            explanation: "Convert duration from minutes to hours: 60 minutes ÷ 60 = 1 hour.",
          },
          {
            label: "Step 2",
            explanation: "Apply the formula: Calories = 4.0 × 70 × 1 = 280 kcal.",
          },
          {
            label: "Step 3",
            explanation: "The individual burns approximately 280 calories during the session.",
          },
        ],
        result: "Estimated Calories Burned: 280 kcal",
      }}
      relatedCalculators={[
        { title: "VO2max Estimator (Cooper/Rockport Test)", url: "/sports/vo2max-estimator-cooper-rockport", icon: "🏆" },
        { title: "Fitness Age Calculator", url: "/sports/fitness-age-calculator", icon: "🏆" },
        { title: "Soccer League Table: Points & GD", url: "/sports/soccer-league-table-points-gd", icon: "⚽" },
        { title: "Swimming Power Points Calculator", url: "/sports/swimming-power-points", icon: "🏊" },
        { title: "Rowing Split (500m) ↔ Pace", url: "/sports/rowing-split-500m-pace", icon: "🏃" },
        { title: "Plate Loading Calculator", url: "/sports/plate-loading", icon: "🏋️" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding" },
        { id: "how-to", label: "How to Use" },
        { id: "tips", label: "Training Tips" },
        { id: "faq", label: "FAQ" },
        { id: "references", label: "References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}