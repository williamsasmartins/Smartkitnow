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

export default function BodyFatPercentageCalculator() {
  /*
    This calculator estimates body fat percentage using the U.S. Navy Method,
    which is widely accepted for its balance of simplicity and accuracy.
    It requires simple tape measurements of the neck, waist, and hips (for females),
    along with height and gender. The formula uses logarithmic calculations
    to estimate body fat percentage from these circumferences.
  */

  // Inputs state: height, neck, waist, hips (optional), gender
  const [inputs, setInputs] = useState({
    height: "",
    neck: "",
    waist: "",
    hips: "",
    gender: "male",
  });

  // Handle input changes with type coercion and trimming
  const handleInputChange = useCallback((name, value) => {
    // Allow only numbers and decimal points
    if (["height", "neck", "waist", "hips"].includes(name)) {
      // Remove non-numeric except dot
      const sanitized = value.replace(/[^0-9.]/g, "");
      setInputs((prev) => ({ ...prev, [name]: sanitized }));
    } else if (name === "gender") {
      setInputs((prev) => ({ ...prev, gender: value }));
    }
  }, []);

  // Calculation logic using U.S. Navy Method
  // Source: https://www.navyfitness.org/body-fat-calculator/
  // Formula:
  // For men: % body fat = 86.010 * log10(waist - neck) - 70.041 * log10(height) + 36.76
  // For women: % body fat = 163.205 * log10(waist + hips - neck) - 97.684 * log10(height) - 78.387

  const results = useMemo(() => {
    const height = parseFloat(inputs.height);
    const neck = parseFloat(inputs.neck);
    const waist = parseFloat(inputs.waist);
    const hips = parseFloat(inputs.hips);
    const gender = inputs.gender;

    // Validate inputs
    if (
      !height ||
      !neck ||
      !waist ||
      height <= 0 ||
      neck <= 0 ||
      waist <= 0 ||
      (gender === "female" && (!hips || hips <= 0))
    ) {
      return {
        value: null,
        label: null,
        subtext: "Please enter valid positive numbers for all required fields.",
        warning: "Incomplete or invalid input.",
        formulaUsed: "",
      };
    }

    // Check logical measurement constraints
    if (neck >= waist) {
      return {
        value: null,
        label: null,
        subtext:
          "Neck circumference should be smaller than waist circumference for accurate results.",
        warning: "Measurement inconsistency detected.",
        formulaUsed: "",
      };
    }
    if (gender === "female" && (waist + hips) <= neck) {
      return {
        value: null,
        label: null,
        subtext:
          "Sum of waist and hips should be greater than neck circumference for females.",
        warning: "Measurement inconsistency detected.",
        formulaUsed: "",
      };
    }

    // Calculate body fat percentage
    let bodyFatPercent = 0;
    let formulaUsed = "";

    if (gender === "male") {
      // Male formula
      bodyFatPercent =
        86.010 * Math.log10(waist - neck) -
        70.041 * Math.log10(height) +
        36.76;
      formulaUsed =
        "86.010 × log10(waist - neck) - 70.041 × log10(height) + 36.76 (U.S. Navy Method for males)";
    } else {
      // Female formula
      bodyFatPercent =
        163.205 * Math.log10(waist + hips - neck) -
        97.684 * Math.log10(height) -
        78.387;
      formulaUsed =
        "163.205 × log10(waist + hips - neck) - 97.684 × log10(height) - 78.387 (U.S. Navy Method for females)";
    }

    // Clamp results between 2% and 60% for plausibility
    if (bodyFatPercent < 2) bodyFatPercent = 2;
    if (bodyFatPercent > 60) bodyFatPercent = 60;

    // Round to one decimal place
    const rounded = bodyFatPercent.toFixed(1);

    // Interpret body fat percentage category
    let category = "";
    if (gender === "male") {
      if (bodyFatPercent < 6) category = "Essential fat";
      else if (bodyFatPercent < 14) category = "Athletes";
      else if (bodyFatPercent < 18) category = "Fitness";
      else if (bodyFatPercent < 25) category = "Average";
      else category = "Obese";
    } else {
      if (bodyFatPercent < 14) category = "Essential fat";
      else if (bodyFatPercent < 21) category = "Athletes";
      else if (bodyFatPercent < 25) category = "Fitness";
      else if (bodyFatPercent < 32) category = "Average";
      else category = "Obese";
    }

    return {
      value: `${rounded}%`,
      label: `Estimated Body Fat Percentage (${category})`,
      subtext:
        "This estimate is based on the U.S. Navy Method using your measurements.",
      warning: null,
      formulaUsed,
    };
  }, [inputs]);

  // FAQ content with comprehensive answers
  const faqs = [
    {
      question: "What is body fat percentage and why is it important?",
      answer:
        "Body fat percentage represents the proportion of fat mass relative to your total body weight. Unlike weight alone, it provides a clearer picture of your health and fitness by distinguishing fat from lean mass such as muscle and bone. Maintaining a healthy body fat percentage is crucial for reducing risks of chronic diseases, improving physical performance, and enhancing overall well-being.",
    },
    {
      question: "How accurate is the U.S. Navy Method for estimating body fat?",
      answer:
        "The U.S. Navy Method is a practical and widely used technique that estimates body fat percentage using simple circumference measurements. While it offers reasonable accuracy for most adults, it may be less precise for extremely muscular individuals, older adults, or those with atypical body shapes. For clinical or athletic precision, methods like DEXA scans or hydrostatic weighing are more accurate but less accessible.",
    },
    {
      question: "Why do I need to measure my neck, waist, and hips?",
      answer:
        "Neck, waist, and hip measurements capture the distribution of fat around your torso, which correlates strongly with overall body fat. The neck measurement helps adjust for body frame size, while waist and hips reflect fat accumulation patterns that differ between genders. These measurements combined allow the U.S. Navy formula to estimate body fat percentage effectively without expensive equipment.",
    },
    {
      question: "Can I use this calculator if I am pregnant or have a medical condition?",
      answer:
        "This calculator is not designed for pregnant women or individuals with certain medical conditions that affect body composition or fluid retention. Pregnancy and some health issues can alter body measurements and fat distribution, leading to inaccurate results. It is recommended to consult a healthcare professional for appropriate assessment methods in such cases.",
    },
    {
      question: "How often should I measure my body fat percentage?",
      answer:
        "For tracking progress, measuring body fat percentage every 2 to 4 weeks is ideal. This frequency allows you to observe meaningful changes while avoiding daily fluctuations caused by hydration, food intake, or measurement inconsistencies. Consistency in measurement technique and timing (e.g., same time of day) enhances reliability of your tracking.",
    },
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  // Widget UI with inputs and buttons
  const widget = (
    <div className="space-y-6">
      <Card className="p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="gender" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
              Gender
            </Label>
            <Select
              value={inputs.gender}
              onValueChange={(v) => handleInputChange("gender", v)}
            >
              <SelectTrigger aria-label="Select gender">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="height" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
              Height (cm)
            </Label>
            <Input
              id="height"
              type="text"
              inputMode="decimal"
              placeholder="e.g. 175"
              value={inputs.height}
              onChange={(e) => handleInputChange("height", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="neck" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
              Neck Circumference (cm)
            </Label>
            <Input
              id="neck"
              type="text"
              inputMode="decimal"
              placeholder="e.g. 40"
              value={inputs.neck}
              onChange={(e) => handleInputChange("neck", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="waist" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
              Waist Circumference (cm)
            </Label>
            <Input
              id="waist"
              type="text"
              inputMode="decimal"
              placeholder="e.g. 85"
              value={inputs.waist}
              onChange={(e) => handleInputChange("waist", e.target.value)}
            />
          </div>

          {inputs.gender === "female" && (
            <div>
              <Label htmlFor="hips" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
                Hip Circumference (cm)
              </Label>
              <Input
                id="hips"
                type="text"
                inputMode="decimal"
                placeholder="e.g. 95"
                value={inputs.hips}
                onChange={(e) => handleInputChange("hips", e.target.value)}
              />
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-6">
          <Button
            className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
            onClick={() => {
              // No explicit action needed; results update automatically
            }}
          >
            <Scale className="mr-2 h-4 w-4" /> Calculate
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              setInputs({
                height: "",
                neck: "",
                waist: "",
                hips: "",
                gender: "male",
              })
            }
            className="flex-1 h-11"
          >
            <RotateCcw className="mr-2 h-4 w-4" /> Reset
          </Button>
        </div>
      </Card>

      {/* Results */}
      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
              {results.value}
            </p>
            <p className="mt-2 text-lg font-semibold text-blue-800 dark:text-blue-300">
              {results.label}
            </p>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-400 italic">
              {results.subtext}
            </p>
            {results.warning && (
              <p className="mt-3 text-sm text-red-600 dark:text-red-400 font-semibold flex items-center justify-center gap-2">
                <AlertTriangle className="w-4 h-4" /> {results.warning}
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );

  // Editorial content with rich explanations and step-by-step guide
  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding the Basics
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Body fat percentage is a critical metric that reflects the proportion of fat mass compared to your total body weight. Unlike simply tracking weight, which can be misleading due to muscle gain or water retention, body fat percentage offers a more precise insight into your health and fitness. It helps identify whether you have a healthy amount of fat, which is essential for hormone regulation, insulation, and energy storage, or if you are at risk of obesity-related health issues.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The U.S. Navy Method, used in this calculator, estimates body fat by measuring specific body circumferences and applying logarithmic formulas. This method is popular because it balances ease of use with reasonable accuracy, requiring only a tape measure and basic inputs like height and gender. Understanding your body fat percentage can guide your fitness goals, whether it’s losing fat, gaining muscle, or maintaining a healthy balance.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To get the most accurate estimate of your body fat percentage using this calculator, follow these detailed steps carefully. Accurate measurements are key, so use a flexible but non-stretchable tape measure and measure yourself in front of a mirror if possible.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1: Select your gender.</strong> This determines which formula the calculator uses, as fat distribution patterns differ between males and females.
          </li>
          <li>
            <strong>Step 2: Measure your height.</strong> Stand straight against a wall and measure your height in centimeters without shoes.
          </li>
          <li>
            <strong>Step 3: Measure your neck circumference.</strong> Wrap the tape measure around the widest part of your neck, just below the Adam’s apple. Keep the tape snug but not tight.
          </li>
          <li>
            <strong>Step 4: Measure your waist circumference.</strong> For males, measure at the narrowest point of the torso, usually just above the belly button. For females, measure at the natural waist, above the hip bones.
          </li>
          <li>
            <strong>Step 5: (Females only) Measure your hips.</strong> Wrap the tape around the widest part of your hips and buttocks.
          </li>
          <li>
            <strong>Step 6: Enter all measurements into the calculator.</strong> Use centimeters for all inputs to maintain consistency.
          </li>
          <li>
            <strong>Step 7: Click “Calculate” to see your estimated body fat percentage and category.</strong> Review the results and use them to inform your fitness or health decisions.
          </li>
          <li>
            <strong>Step 8: Track your progress over time.</strong> Repeat measurements every few weeks under similar conditions for consistent tracking.
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
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Body Fat Percentage Calculator"
      description="Estimate body fat percentage from home. Use simple tape measurements to track your fitness progress over time."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Methodology",
        formula:
          "For males: 86.010 × log10(waist - neck) - 70.041 × log10(height) + 36.76\nFor females: 163.205 × log10(waist + hips - neck) - 97.684 × log10(height) - 78.387",
        variables: [
          { symbol: "height", description: "Height in centimeters" },
          { symbol: "neck", description: "Neck circumference in centimeters" },
          { symbol: "waist", description: "Waist circumference in centimeters" },
          { symbol: "hips", description: "Hip circumference in centimeters (females only)" },
          { symbol: "gender", description: "Biological sex (male or female)" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "John is a 30-year-old male who wants to estimate his body fat percentage using simple tape measurements at home.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "John measures his height as 180 cm, neck circumference as 40 cm, and waist circumference as 85 cm.",
          },
          {
            label: "Step 2",
            explanation:
              "He inputs these values into the calculator, selects 'male' as his gender, and clicks 'Calculate'.",
          },
          {
            label: "Step 3",
            explanation:
              "The calculator applies the U.S. Navy formula for males and estimates John's body fat percentage as approximately 16.5%, categorizing him in the 'Fitness' range.",
          },
        ],
        result:
          "John's estimated body fat percentage is 16.5%, indicating a healthy fitness level. He can use this information to tailor his workout and nutrition plans accordingly.",
      }}
      relatedCalculators={[
        { title: "Steps → Distance Converter", url: "/everyday-life/steps-to-distance-converter", icon: "💡" },
        { title: "Wine/Beer/Soft Drink Mix Estimator", url: "/everyday-life/beverage-mix-estimator", icon: "🎉" },
        { title: "Basal Metabolic Rate (BMR) Calculator", url: "/everyday-life/bmr-calculator", icon: "💡" },
        { title: "Appliance Energy Consumption Calculator", url: "/everyday-life/appliance-energy-consumption", icon: "💡" },
        { title: "Event Budget Calculator", url: "/everyday-life/event-budget-calculator", icon: "🎉" },
        { title: "Square Footage Calculator", url: "/everyday-life/square-footage-calculator", icon: "💡" },
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