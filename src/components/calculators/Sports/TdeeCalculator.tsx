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

const activityLevels = [
  { label: "Sedentary (little or no exercise)", value: 1.2 },
  { label: "Lightly active (light exercise 1-3 days/week)", value: 1.375 },
  { label: "Moderately active (moderate exercise 3-5 days/week)", value: 1.55 },
  { label: "Very active (hard exercise 6-7 days/week)", value: 1.725 },
  { label: "Extra active (very hard exercise & physical job)", value: 1.9 },
];

const sportSpecificAdjustments = [
  { label: "Endurance athlete (e.g., marathon, triathlon)", multiplier: 1.1 },
  { label: "Strength athlete (e.g., weightlifting, bodybuilding)", multiplier: 1.05 },
  { label: "Team sports (e.g., soccer, basketball)", multiplier: 1.08 },
  { label: "Mixed training (crossfit, functional fitness)", multiplier: 1.07 },
  { label: "None / General population", multiplier: 1.0 },
];

export default function TdeeCalculator() {
  const [inputs, setInputs] = useState({
    age: "",
    sex: "",
    weight: "",
    height: "",
    activityLevel: "",
    sportAdjustment: "",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Basal Metabolic Rate (BMR) calculation using Mifflin-St Jeor Equation
  // Male: BMR = 10*weight(kg) + 6.25*height(cm) - 5*age + 5
  // Female: BMR = 10*weight(kg) + 6.25*height(cm) - 5*age - 161
  // Then multiply by activity factor and sport-specific multiplier

  const results = useMemo(() => {
    const age = Number(inputs.age);
    const weight = Number(inputs.weight);
    const height = Number(inputs.height);
    const sex = inputs.sex;
    const activityFactor = Number(inputs.activityLevel);
    const sportMultiplier = Number(inputs.sportAdjustment);

    if (
      !age ||
      !weight ||
      !height ||
      !sex ||
      !activityFactor ||
      !sportMultiplier ||
      age < 10 ||
      age > 80 ||
      weight < 30 ||
      weight > 300 ||
      height < 100 ||
      height > 250
    ) {
      return {
        value: null,
        label: null,
        subtext: "Please enter valid inputs within realistic ranges.",
        warning: "Invalid or incomplete input detected.",
        formulaUsed: "",
      };
    }

    let bmr = 0;
    if (sex === "male") {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else if (sex === "female") {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    } else {
      return {
        value: null,
        label: null,
        subtext: "Sex must be selected as male or female.",
        warning: "Invalid sex input.",
        formulaUsed: "",
      };
    }

    // Total Daily Energy Expenditure (TDEE)
    const tdee = bmr * activityFactor * sportMultiplier;

    return {
      value: `${Math.round(tdee)} kcal/day`,
      label: "Estimated Total Daily Energy Expenditure",
      subtext:
        "This estimate accounts for basal metabolism, daily activity, and sport-specific training demands.",
      warning: null,
      formulaUsed:
        "TDEE = BMR × Activity Factor × Sport-Specific Multiplier",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is TDEE and why is it important for athletes?",
      answer:
        "Total Daily Energy Expenditure (TDEE) represents the total calories an individual burns in a day, including basal metabolic rate, physical activity, and exercise. For athletes, accurately estimating TDEE is crucial to optimize nutrition, recovery, and performance by matching energy intake to expenditure.",
    },
    {
      question: "How does sport-specific training affect calorie needs?",
      answer:
        "Different sports impose varying metabolic demands. Endurance athletes typically require higher carbohydrate intake and slightly elevated calorie needs, while strength athletes may need more protein and moderate calorie increases. This calculator adjusts TDEE based on sport-specific multipliers to reflect these nuances.",
    },
    {
      question: "Can I use this calculator if I have an irregular training schedule?",
      answer:
        "This calculator provides an average daily estimate based on typical activity levels. For irregular schedules, consider recalculating TDEE on training vs. rest days or consulting a sports nutritionist for personalized guidance.",
    },
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="age" className="flex items-center gap-1">
                Age (years) <Activity className="w-4 h-4 text-blue-600" />
              </Label>
              <Input
                id="age"
                type="number"
                min={10}
                max={80}
                placeholder="e.g. 25"
                value={inputs.age}
                onChange={(e) => handleInputChange("age", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="sex" className="flex items-center gap-1">
                Sex <Flag className="w-4 h-4 text-blue-600" />
              </Label>
              <Select
                onValueChange={(v) => handleInputChange("sex", v)}
                value={inputs.sex}
                id="sex"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select sex" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="weight" className="flex items-center gap-1">
                Weight (kg) <Scale className="w-4 h-4 text-blue-600" />
              </Label>
              <Input
                id="weight"
                type="number"
                min={30}
                max={300}
                placeholder="e.g. 70"
                value={inputs.weight}
                onChange={(e) => handleInputChange("weight", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="height" className="flex items-center gap-1">
                Height (cm) <RulerIcon className="w-4 h-4 text-blue-600" />
              </Label>
              <Input
                id="height"
                type="number"
                min={100}
                max={250}
                placeholder="e.g. 175"
                value={inputs.height}
                onChange={(e) => handleInputChange("height", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="activityLevel" className="flex items-center gap-1">
                Activity Level <Flame className="w-4 h-4 text-blue-600" />
              </Label>
              <Select
                onValueChange={(v) => handleInputChange("activityLevel", v)}
                value={inputs.activityLevel}
                id="activityLevel"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select activity level" />
                </SelectTrigger>
                <SelectContent>
                  {activityLevels.map(({ label, value }) => (
                    <SelectItem key={value} value={value.toString()}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="sportAdjustment" className="flex items-center gap-1">
                Sport-Specific Adjustment <Dumbbell className="w-4 h-4 text-blue-600" />
              </Label>
              <Select
                onValueChange={(v) => handleInputChange("sportAdjustment", v)}
                value={inputs.sportAdjustment}
                id="sportAdjustment"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select sport type" />
                </SelectTrigger>
                <SelectContent>
                  {sportSpecificAdjustments.map(({ label, multiplier }) => (
                    <SelectItem key={multiplier} value={multiplier.toString()}>
                      {label}
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
            // Just trigger re-render by setting inputs to current inputs
            setInputs((p) => ({ ...p }));
          }}
        >
          <Trophy className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              age: "",
              sex: "",
              weight: "",
              height: "",
              activityLevel: "",
              sportAdjustment: "",
            })
          }
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="mt-2 text-lg font-medium text-blue-700 dark:text-blue-300">{results.label}</p>
            <p className="mt-1 text-sm text-blue-600 dark:text-blue-400">{results.subtext}</p>
            {results.warning && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center justify-center gap-1">
                <AlertTriangle className="w-4 h-4" /> {results.warning}
              </p>
            )}
            {results.formulaUsed && (
              <p className="mt-4 text-xs italic text-slate-600 dark:text-slate-400">
                <Calculator className="inline w-4 h-4 mr-1" />
                <strong>Formula used:</strong> {results.formulaUsed}
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
          Understanding TDEE Calculator (Sports)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Total Daily Energy Expenditure (TDEE) is the total number of calories an individual burns in a day,
          encompassing basal metabolic rate (BMR), physical activity, and exercise. For athletes, understanding
          TDEE is essential to tailor nutrition plans that support training demands, recovery, and performance
          goals. This calculator uses the scientifically validated Mifflin-St Jeor equation to estimate BMR,
          then adjusts for activity level and sport-specific energy demands to provide a precise calorie
          requirement estimate.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The inclusion of sport-specific multipliers reflects the unique metabolic demands of different
          athletic disciplines, such as endurance sports requiring sustained energy output or strength sports
          emphasizing muscle repair and growth. By integrating these factors, this tool offers a comprehensive
          and authoritative estimate of energy needs for athletes at various training intensities.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To obtain an accurate TDEE estimate, input your age, sex, weight, and height using metric units.
          Select your typical daily activity level based on your training frequency and intensity. Then,
          choose the sport-specific adjustment that best matches your primary athletic discipline. This
          adjustment accounts for the additional energy demands unique to your sport.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter your age in years (10-80), sex (male or female), weight in kilograms,
            and height in centimeters.
          </li>
          <li>
            <strong>Step 2:</strong> Select your general activity level reflecting your daily exercise routine.
          </li>
          <li>
            <strong>Step 3:</strong> Choose the sport-specific multiplier that aligns with your primary training
            focus to adjust for specialized energy needs.
          </li>
          <li>
            <strong>Step 4:</strong> Click "Calculate" to view your estimated Total Daily Energy Expenditure.
          </li>
          <li>
            <strong>Step 5:</strong> Use this estimate to guide your daily calorie intake for optimal performance
            and recovery.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips & Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Monitoring your TDEE regularly is vital, especially during periods of increased training volume or
          intensity. Adjust your calorie intake accordingly to avoid energy deficits that can impair recovery
          and performance. Incorporate nutrient timing strategies, such as consuming carbohydrates before and
          after training sessions, to maximize glycogen replenishment and muscle repair.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Additionally, consider consulting with a sports dietitian to personalize your nutrition plan based
          on your specific goals, body composition, and metabolic responses. Remember that hydration, sleep,
          and stress management also play critical roles in optimizing energy balance and athletic output.
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
          For more information on training science and nutrition guidelines, consult the following authoritative sources:
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
              The ACSM is a global leader in sports medicine and exercise science research, providing evidence-based guidelines for athletes.
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
              The NSCA offers comprehensive resources on strength training, conditioning, and athlete performance optimization.
            </p>
          </li>
          <li>
            <a
              href="https://www.runnersworld.com/nutrition-weight-loss/a20865688/how-to-calculate-your-tdee/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Runner's World: How to Calculate Your TDEE <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              A practical guide explaining TDEE calculation with considerations for athletes and endurance training.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  // Example scenario demonstrating calculation
  const example = {
    title: "Real Life Example",
    scenario:
      "A 28-year-old male endurance runner, weighing 68 kg and 175 cm tall, trains 6 days a week with high intensity.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Input age (28), sex (male), weight (68 kg), and height (175 cm).",
      },
      {
        label: "Step 2",
        explanation:
          "Select 'Very active' for activity level (1.725) reflecting intense training frequency.",
      },
      {
        label: "Step 3",
        explanation:
          "Choose 'Endurance athlete' sport adjustment multiplier (1.1) to account for increased metabolic demands.",
      },
      {
        label: "Step 4",
        explanation:
          "Calculate: BMR = 10*68 + 6.25*175 - 5*28 + 5 = 1663 kcal. Then TDEE = 1663 × 1.725 × 1.1 ≈ 3158 kcal/day.",
      },
    ],
    result:
      "The athlete's estimated TDEE is approximately 3158 kcal/day, guiding appropriate daily calorie intake for performance and recovery.",
  };

  return (
    <CalculatorVerticalLayout
      title="TDEE Calculator (Sports)"
      description="Calculate Total Daily Energy Expenditure for athletes. Estimate calorie needs based on high activity levels and training volume."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Formula",
        formula: "TDEE = BMR × Activity Factor × Sport-Specific Multiplier",
        variables: [
          "BMR = Basal Metabolic Rate (Mifflin-St Jeor Equation)",
          "Activity Factor = Multiplier based on daily activity level",
          "Sport-Specific Multiplier = Adjustment for sport training demands",
        ],
      }}
      example={example}
      relatedCalculators={[
        {
          title: "Heart-Rate Zones Calculator (Karvonen Method)",
          url: "/sports/heart-rate-zones-karvonen",
          icon: "Flame",
        },
        {
          title: "Race Time Predictor (Riegel Formula)",
          url: "/sports/race-time-predictor-riegel",
          icon: "Trophy",
        },
        {
          title: "Swim Interval Pace Calculator",
          url: "/sports/swim-interval-pace",
          icon: "Activity",
        },
        {
          title: "Target Heart Rate / RPE Zones",
          url: "/sports/target-heart-rate-rpe-zones",
          icon: "Trophy",
        },
        {
          title: "FINA Points Calculator",
          url: "/sports/fina-points-calculator",
          icon: "Waves",
        },
        {
          title: "Swimming Power Points Calculator",
          url: "/sports/swimming-power-points",
          icon: "Waves",
        },
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

// Helper icon for height input (not in lucide-react, so create inline SVG)
function RulerIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <path d="M3 21v-18h18v18z" />
      <path d="M7 7v10M11 7v10M15 7v10" />
    </svg>
  );
}