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
  { label: "Hatha Yoga (Light Intensity)", met: 2.5 },
  { label: "Vinyasa Yoga (Moderate Intensity)", met: 4.0 },
  { label: "Bikram/Hot Yoga (High Intensity)", met: 5.5 },
  { label: "Power Yoga (High Intensity)", met: 6.0 },
  { label: "Restorative Yoga (Very Light)", met: 1.5 },
];

export default function YogaCaloriesBurnedCalculator() {
  const [inputs, setInputs] = useState({
    weight: "",
    duration: "",
    yogaType: yogaTypes[0].label,
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Calculate calories burned using MET formula:
  // Calories burned = MET × weight (kg) × duration (hours)
  // MET values differ by yoga type intensity
  const results = useMemo(() => {
    const weight = parseFloat(inputs.weight);
    const duration = parseFloat(inputs.duration);
    const yoga = yogaTypes.find((y) => y.label === inputs.yogaType);

    if (!weight || !duration || !yoga) {
      return {
        value: null,
        label: "",
        subtext: "",
        warning: "Please enter valid weight, duration, and yoga type.",
        formulaUsed: "",
      };
    }

    // Duration in hours
    const durationHours = duration / 60;
    const caloriesBurned = yoga.met * weight * durationHours;

    return {
      value: caloriesBurned.toFixed(2),
      label: "Calories Burned (kcal)",
      subtext: `Based on ${inputs.yogaType} for ${duration} minutes at ${weight} kg`,
      warning: null,
      formulaUsed: `Calories = MET × Weight (kg) × Duration (hours) = ${yoga.met} × ${weight} × ${durationHours.toFixed(2)}`,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "How accurate is the Yoga Calories Burned Calculator?",
      answer:
        "The calculator provides an estimate based on MET values, which are averages derived from scientific studies. Individual calorie burn can vary due to factors like age, gender, fitness level, and exercise intensity. For more precise measurements, consider using wearable devices that monitor heart rate and oxygen consumption.",
    },
    {
      question: "Why does the type of yoga affect calories burned?",
      answer:
        "Different yoga styles vary in intensity and physical demand. For example, Hatha yoga is generally slower and less intense, resulting in fewer calories burned, while Vinyasa or Power yoga involve continuous movement and strength, increasing energy expenditure. The calculator adjusts for these differences using MET values.",
    },
    {
      question: "Can I use this calculator if I practice yoga at home without an instructor?",
      answer:
        "Yes, you can use this calculator regardless of where you practice yoga. Just select the yoga type that best matches your session's intensity and input your weight and duration. The calculator estimates calories burned based on these inputs, helping you track your energy expenditure effectively.",
    },
    {
      question: "How can I increase calories burned during yoga sessions?",
      answer:
        "Increasing session duration, choosing more vigorous yoga styles like Power or Bikram yoga, and incorporating strength-building poses can elevate calorie burn. Additionally, maintaining proper form and minimizing rest between poses helps sustain heart rate and energy expenditure.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="weight" className="flex items-center gap-1">
                <Scale className="w-4 h-4" /> Weight (kg)
              </Label>
              <Input
                id="weight"
                type="number"
                min="1"
                step="0.1"
                placeholder="e.g., 70"
                value={inputs.weight}
                onChange={(e) => handleInputChange("weight", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="duration" className="flex items-center gap-1">
                <Timer className="w-4 h-4" /> Duration (minutes)
              </Label>
              <Input
                id="duration"
                type="number"
                min="1"
                step="1"
                placeholder="e.g., 60"
                value={inputs.duration}
                onChange={(e) => handleInputChange("duration", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="yogaType" className="flex items-center gap-1">
                <Activity className="w-4 h-4" /> Yoga Type
              </Label>
              <Select
                value={inputs.yogaType}
                onValueChange={(v) => handleInputChange("yogaType", v)}
              >
                <SelectTrigger id="yogaType" className="w-full">
                  <SelectValue placeholder="Select yoga type" />
                </SelectTrigger>
                <SelectContent>
                  {yogaTypes.map((yoga) => (
                    <SelectItem key={yoga.label} value={yoga.label}>
                      {yoga.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No special action needed, calculation is reactive
          }}
        >
          <Trophy className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", duration: "", yogaType: yogaTypes[0].label })}
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value && !results.warning && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="text-xl font-semibold text-blue-800 dark:text-blue-300">{results.label}</p>
            <p className="mt-2 text-sm text-blue-700 dark:text-blue-400">{results.subtext}</p>
            <p className="mt-4 text-xs italic text-slate-600 dark:text-slate-400">{results.formulaUsed}</p>
          </CardContent>
        </Card>
      )}

      {results.warning && (
        <Card className="border border-red-400 bg-red-50 dark:bg-red-900 dark:border-red-700">
          <CardContent className="text-center text-red-700 dark:text-red-300">
            <AlertTriangle className="mx-auto mb-2 w-8 h-8" />
            {results.warning}
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
          Yoga is a holistic practice that combines physical postures, breathing techniques, and meditation to improve overall health and wellbeing. While traditionally viewed as a low-impact activity, many styles of yoga can provide significant cardiovascular and muscular benefits, contributing to calorie expenditure and weight management.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Yoga Calories Burned Calculator estimates the energy you expend during a yoga session by considering your body weight, the duration of your practice, and the specific style of yoga performed. Different yoga styles vary widely in intensity, from gentle restorative sessions to vigorous power yoga flows, which is why the calculator uses MET (Metabolic Equivalent of Task) values to adjust for these differences.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          MET values represent the ratio of the work metabolic rate to the resting metabolic rate. For example, a MET of 1 means you are at rest, while higher METs indicate greater energy expenditure. By multiplying the MET value by your weight and duration, the calculator provides a scientifically grounded estimate of calories burned.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Understanding your calorie burn during yoga can help you tailor your fitness and nutrition plans, track progress, and set realistic goals. This calculator serves as an authoritative tool to support your health journey with accurate and actionable insights.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using the Yoga Calories Burned Calculator is straightforward and designed for accuracy. Begin by entering your body weight in kilograms, which is essential for calculating energy expenditure relative to your mass. If you know your weight in pounds, convert it to kilograms by dividing by 2.205.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Next, input the duration of your yoga session in minutes. This should reflect the actual time spent actively practicing yoga, excluding breaks or rest periods. Accurate duration helps the calculator estimate total calories burned during your workout.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Finally, select the type of yoga you performed from the dropdown menu. Each yoga style has a corresponding MET value that reflects its intensity. For example, Hatha yoga is less intense than Power yoga, so it has a lower MET value. Choosing the correct style ensures the calorie estimate matches your actual effort.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>Step 1: Enter your weight in kilograms (kg).</li>
          <li>Step 2: Enter the duration of your yoga session in minutes.</li>
          <li>Step 3: Select the yoga style that best matches your practice intensity.</li>
          <li>Step 4: Click "Calculate" to see your estimated calories burned.</li>
          <li>Step 5: Use the results to inform your fitness and nutrition planning.</li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips & Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To maximize the benefits of your yoga practice and increase calorie burn, consider incorporating a variety of yoga styles into your routine. Combining gentle sessions like Hatha or Restorative yoga with more dynamic styles such as Vinyasa or Power yoga can improve flexibility, strength, and cardiovascular fitness.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Consistency is key. Aim to practice yoga regularly, ideally 3-5 times per week, to build endurance and improve metabolic rate. Gradually increase session duration and intensity as your fitness improves to continue challenging your body and burning more calories.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Pay attention to your form and breathing techniques, as proper alignment and controlled breathing enhance muscle engagement and oxygen delivery, boosting calorie expenditure. Additionally, consider supplementing yoga with strength training and cardiovascular exercises for a balanced fitness program.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Finally, track your progress using this calculator and adjust your training and nutrition strategies accordingly. Monitoring your calorie burn helps you stay motivated and make informed decisions to reach your health and fitness goals.
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

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References & Additional Resources</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
          For more information, consult these sources:
        </p>
        <ul className="space-y-4">
          <li>
            <a href="https://sites.google.com/site/compendiumofphysicalactivities/Activity-Categories/yoga" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
              Compendium of Physical Activities <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              The authoritative source for MET values of various physical activities, including detailed data on different yoga styles.
            </p>
          </li>
          <li>
            <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3193654/" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
              "Energy expenditure during yoga practice" - PubMed Central <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              A peer-reviewed study analyzing the caloric cost of various yoga postures and sequences, providing scientific validation for MET-based calculations.
            </p>
          </li>
          <li>
            <a href="https://www.acefitness.org/education-and-resources/lifestyle/blog/6596/how-many-calories-does-yoga-burn/" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
              ACE Fitness: How Many Calories Does Yoga Burn? <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Expert insights from the American Council on Exercise about the calorie-burning potential of different yoga styles and tips for maximizing benefits.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Yoga Calories Burned Calculator"
      description="Estimate calories burned during yoga. Calculate energy expenditure for Hatha, Vinyasa, Bikram, and other yoga sessions."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Calories Burned Formula",
        formula: "Calories = MET × Weight (kg) × Duration (hours)",
        variables: [
          { symbol: "MET", description: "Metabolic Equivalent of Task for yoga style" },
          { symbol: "Weight (kg)", description: "Your body weight in kilograms" },
          { symbol: "Duration (hours)", description: "Length of yoga session in hours" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "A 70 kg person practices Vinyasa yoga for 60 minutes. Vinyasa yoga has a MET value of 4.0.",
        steps: [
          { label: "Step 1", explanation: "Convert duration to hours: 60 minutes ÷ 60 = 1 hour." },
          { label: "Step 2", explanation: "Use the formula: Calories = 4.0 × 70 × 1 = 280 kcal." },
          { label: "Step 3", explanation: "The person burns approximately 280 calories during the session." },
        ],
        result: "Calories burned = 280 kcal",
      }}
      relatedCalculators={[
        { title: "Plank / Hold Time Progression", url: "/sports/plank-hold-progression", icon: "🏆" },
        { title: "Calorie Deficit / Surplus Calculator", url: "/sports/calorie-deficit-surplus", icon: "🔥" },
        { title: "Target Heart Rate / RPE Zones", url: "/sports/target-heart-rate-rpe-zones", icon: "🏆" },
        { title: "Fitness Age Calculator", url: "/sports/fitness-age-calculator", icon: "🏆" },
        { title: "Body Fat Percentage Calculator (Athletes)", url: "/sports/body-fat-percentage", icon: "🔥" },
        { title: "Running Pace / Split / Finish Time Calculator", url: "/sports/running-pace-split-finish-time", icon: "🏃" },
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