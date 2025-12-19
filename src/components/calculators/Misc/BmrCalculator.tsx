import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ FULL ICON IMPORT
import {
  Home,
  Heart,
  Utensils,
  Leaf,
  Calendar,
  DollarSign,
  Droplets,
  Activity,
  Moon,
  Sun,
  Users,
  Paintbrush,
  Wrench,
  Info,
  RotateCcw,
  AlertTriangle,
  FlaskConical,
  Scale,
  Waves,
  Zap,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BmrCalculator() {
  // Inputs: age (years), gender (male/female), weight (kg or lbs), height (cm or inches)
  const [inputs, setInputs] = useState({
    age: "",
    gender: "",
    weight: "",
    weightUnit: "kg",
    height: "",
    heightUnit: "cm",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Helper: convert lbs to kg, inches to cm
  const lbsToKg = (lbs) => lbs * 0.45359237;
  const inchesToCm = (inch) => inch * 2.54;

  // Calculate BMR using Mifflin-St Jeor Equation (most accurate for modern populations)
  // Male: BMR = 10*weight(kg) + 6.25*height(cm) - 5*age + 5
  // Female: BMR = 10*weight(kg) + 6.25*height(cm) - 5*age - 161
  // We will also show Harris-Benedict for comparison.

  const results = useMemo(() => {
    const age = Number(inputs.age);
    const gender = inputs.gender;
    let weight = Number(inputs.weight);
    let height = Number(inputs.height);

    if (
      !age ||
      age <= 0 ||
      !gender ||
      (gender !== "male" && gender !== "female") ||
      !weight ||
      weight <= 0 ||
      !height ||
      height <= 0
    ) {
      return {
        value: null,
        label: null,
        subtext: null,
        warning: "Please enter valid positive numbers for all fields.",
        formulaUsed: null,
        bmrMifflin: null,
        bmrHarris: null,
      };
    }

    // Convert units if needed
    if (inputs.weightUnit === "lbs") {
      weight = lbsToKg(weight);
    }
    if (inputs.heightUnit === "in") {
      height = inchesToCm(height);
    }

    // Mifflin-St Jeor Equation
    let bmrMifflin = 10 * weight + 6.25 * height - 5 * age;
    if (gender === "male") {
      bmrMifflin += 5;
    } else {
      bmrMifflin -= 161;
    }
    bmrMifflin = Math.round(bmrMifflin);

    // Harris-Benedict Equation (Revised 1984)
    // Male: 88.362 + (13.397 × weight in kg) + (4.799 × height in cm) − (5.677 × age in years)
    // Female: 447.593 + (9.247 × weight in kg) + (3.098 × height in cm) − (4.330 × age in years)
    let bmrHarris = 0;
    if (gender === "male") {
      bmrHarris = 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
    } else {
      bmrHarris = 447.593 + 9.247 * weight + 3.098 * height - 4.330 * age;
    }
    bmrHarris = Math.round(bmrHarris);

    return {
      value: `${bmrMifflin} kcal/day`,
      label: "Basal Metabolic Rate (Mifflin-St Jeor)",
      subtext:
        "This is the estimated number of calories your body needs at rest to maintain vital functions, excluding any physical activity.",
      warning: null,
      formulaUsed:
        "Mifflin-St Jeor Equation: BMR = 10 × weight(kg) + 6.25 × height(cm) − 5 × age(years) + 5 (male) or −161 (female)",
      bmrMifflin,
      bmrHarris,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is Basal Metabolic Rate (BMR) and why is it important?",
      answer:
        "Basal Metabolic Rate (BMR) represents the minimum number of calories your body requires to maintain essential physiological functions such as breathing, circulation, and cell production while at complete rest. Understanding your BMR is crucial because it forms the foundation for determining your total daily energy expenditure (TDEE), which helps in planning diets, weight management, and fitness goals. Knowing your BMR allows you to tailor calorie intake to maintain, lose, or gain weight effectively.",
    },
    {
      question: "How accurate are BMR calculators and which formula should I trust?",
      answer:
        "BMR calculators provide estimates based on population averages and formulas derived from scientific studies. The Mifflin-St Jeor equation is currently considered the most accurate for modern populations due to its updated data and methodology. However, individual variations such as muscle mass, genetics, and metabolic health can affect actual BMR. For precise measurements, clinical methods like indirect calorimetry are used. Use BMR calculators as a reliable starting point but adjust based on your personal experience and goals.",
    },
    {
      question: "Can BMR change over time or with lifestyle changes?",
      answer:
        "Yes, BMR is dynamic and can change due to several factors. Aging typically lowers BMR because of muscle mass loss and hormonal changes. Increasing muscle mass through strength training can raise BMR since muscle tissue burns more calories at rest than fat. Additionally, illness, hormonal imbalances, and drastic calorie restriction can also impact your metabolic rate. Regularly reassessing your BMR as your body composition and lifestyle evolve ensures your calorie needs remain accurate.",
    },
    {
      question: "Why do I need to input my height and weight in specific units?",
      answer:
        "Height and weight are essential variables in BMR formulas and must be in consistent units for accurate calculation. Most scientific equations use metric units (kilograms for weight and centimeters for height). This calculator allows you to input values in either metric or imperial units and converts them internally to maintain precision. Providing accurate measurements in the correct units ensures the calculator outputs a reliable estimate of your basal metabolic rate.",
    },
    {
      question: "How does BMR differ from Total Daily Energy Expenditure (TDEE)?",
      answer:
        "BMR measures the calories your body needs at complete rest to sustain vital functions, while Total Daily Energy Expenditure (TDEE) accounts for all calories burned in a day, including physical activity, digestion, and non-exercise movements. TDEE is calculated by multiplying BMR by an activity factor that reflects your lifestyle. Understanding both helps you balance calorie intake with energy output for effective weight management or athletic performance.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Widget UI with inputs and buttons
  const widget = (
    <div className="space-y-6">
      <Card className="p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="age" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
              Age (years)
            </Label>
            <Input
              id="age"
              type="number"
              min={0}
              max={120}
              placeholder="e.g., 30"
              value={inputs.age}
              onChange={(e) => handleInputChange("age", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="gender" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
              Gender
            </Label>
            <Select
              value={inputs.gender}
              onValueChange={(v) => handleInputChange("gender", v)}
            >
              <SelectTrigger id="gender" className="w-full">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="weight" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
              Weight
            </Label>
            <div className="flex gap-2">
              <Input
                id="weight"
                type="number"
                min={0}
                placeholder="e.g., 70"
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
            <Label htmlFor="height" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
              Height
            </Label>
            <div className="flex gap-2">
              <Input
                id="height"
                type="number"
                min={0}
                placeholder="e.g., 175"
                value={inputs.height}
                onChange={(e) => handleInputChange("height", e.target.value)}
              />
              <Select
                value={inputs.heightUnit}
                onValueChange={(v) => handleInputChange("heightUnit", v)}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cm">cm</SelectItem>
                  <SelectItem value="in">in</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {
            // No special action needed, calculation is reactive
          }}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
        >
          <Home className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              age: "",
              gender: "",
              weight: "",
              weightUnit: "kg",
              height: "",
              heightUnit: "cm",
            })
          }
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.warning && (
        <Card className="bg-red-50 dark:bg-red-900 border-red-300 dark:border-red-700 shadow-md">
          <CardContent className="p-6 text-center text-red-700 dark:text-red-300 font-semibold">
            <AlertTriangle className="mx-auto mb-2 h-6 w-6" />
            {results.warning}
          </CardContent>
        </Card>
      )}

      {results.value && !results.warning && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="mt-2 text-lg font-semibold text-blue-800 dark:text-blue-300">{results.label}</p>
            <p className="mt-2 text-sm text-blue-700 dark:text-blue-400 max-w-xl mx-auto leading-relaxed">
              {results.subtext}
            </p>
            <hr className="my-6 border-blue-300 dark:border-blue-700" />
            <p className="text-sm italic text-slate-700 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
              Formula used: {results.formulaUsed}
            </p>
            <hr className="my-6 border-blue-300 dark:border-blue-700" />
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              For comparison, Harris-Benedict Equation estimates your BMR as{" "}
              <span className="font-extrabold">{results.bmrHarris} kcal/day</span>.
            </p>
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
          Basal Metabolic Rate (BMR) is the number of calories your body needs to perform its most basic life-sustaining functions while at complete rest. These functions include breathing, circulating blood, regulating body temperature, cell growth, brain and nerve function, and muscle contraction. BMR accounts for the largest portion of your total daily energy expenditure, often making up 60-75% of the calories you burn each day.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Understanding your BMR is essential for managing your weight and overall health. It provides a baseline for how many calories your body requires before factoring in any physical activity or digestion. By knowing your BMR, you can better tailor your diet and exercise plans to meet your personal goals, whether that’s losing fat, gaining muscle, or maintaining your current weight.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator estimates your Basal Metabolic Rate (BMR) using your age, gender, weight, and height. To get the most accurate result, follow these detailed steps:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter your age in years. Use your current age as BMR changes with age due to metabolic and physiological changes.
          </li>
          <li>
            <strong>Step 2:</strong> Select your biological gender (male or female). This is important because BMR formulas account for physiological differences between genders.
          </li>
          <li>
            <strong>Step 3:</strong> Input your weight. You can enter your weight in kilograms (kg) or pounds (lbs). If you choose pounds, the calculator will convert it internally to kilograms for accuracy.
          </li>
          <li>
            <strong>Step 4:</strong> Input your height. You can enter your height in centimeters (cm) or inches (in). If you choose inches, the calculator will convert it internally to centimeters.
          </li>
          <li>
            <strong>Step 5:</strong> Click the <em>Calculate</em> button. The calculator will display your estimated BMR in calories per day, showing how many calories your body needs at rest.
          </li>
          <li>
            <strong>Step 6:</strong> Use the result as a baseline for your daily calorie needs. Remember, this number does not include calories burned through physical activity or digestion.
          </li>
          <li>
            <strong>Step 7:</strong> If you want to start over or correct any inputs, click the <em>Reset</em> button to clear all fields.
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
      title="Basal Metabolic Rate (BMR) Calculator"
      description="Calculate everyday BMR. Find out the minimum calories your body needs to function before adding any physical activity."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Methodology",
        formula:
          "Mifflin-St Jeor Equation: BMR = 10 × weight(kg) + 6.25 × height(cm) − 5 × age(years) + 5 (male) or −161 (female)",
        variables: [
          { symbol: "weight", description: "Your body weight in kilograms (kg)" },
          { symbol: "height", description: "Your height in centimeters (cm)" },
          { symbol: "age", description: "Your age in years" },
          { symbol: "gender", description: "Biological sex: male or female" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "Consider a 28-year-old female who weighs 140 lbs and is 5 feet 5 inches tall. She wants to know her basal metabolic rate to plan her diet and fitness routine.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert weight from pounds to kilograms: 140 lbs × 0.45359237 = 63.5 kg (approx).",
          },
          {
            label: "Step 2",
            explanation:
              "Convert height from feet and inches to centimeters: 5 ft 5 in = 65 inches × 2.54 = 165.1 cm.",
          },
          {
            label: "Step 3",
            explanation:
              "Apply the Mifflin-St Jeor formula for females: BMR = 10 × 63.5 + 6.25 × 165.1 − 5 × 28 − 161.",
          },
          {
            label: "Step 4",
            explanation:
              "Calculate: (10 × 63.5) = 635, (6.25 × 165.1) = 1031.9, (5 × 28) = 140. Sum: 635 + 1031.9 − 140 − 161 = 1365.9 kcal/day.",
          },
          {
            label: "Step 5",
            explanation:
              "Interpretation: She needs approximately 1366 calories per day at rest to maintain vital bodily functions.",
          },
        ],
        result: "The calculated BMR is approximately 1366 kcal/day, which serves as a baseline for her daily calorie needs.",
      }}
      relatedCalculators={[
        { title: "Leftovers Cooling & Reheat Time", url: "/everyday-life/leftovers-cooling-reheat-time", icon: "💡" },
        { title: "Refrigerator/Freezer Safe Zone Time Window", url: "/everyday-life/refrigerator-freezer-safe-zone-time-window", icon: "💡" },
        { title: "Room Air Changes per Hour (ACH) Calculator", url: "/everyday-life/room-air-changes-ach", icon: "💡" },
        { title: "Coffee Urn Yield & Strength Calculator", url: "/everyday-life/coffee-urn-yield-strength", icon: "💡" },
        { title: "Steps → Distance Converter", url: "/everyday-life/steps-to-distance-converter", icon: "💡" },
        { title: "Lawn Mowing Time & Fuel Planner", url: "/everyday-life/lawn-mowing-time-fuel", icon: "💡" },
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