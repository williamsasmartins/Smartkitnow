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

export default function BmrCalculator() {
  const [inputs, setInputs] = useState({
    age: "",
    gender: "",
    height: "",
    weight: "",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Helper: Validate inputs
  const isValidInput = useMemo(() => {
    const ageNum = Number(inputs.age);
    const heightNum = Number(inputs.height);
    const weightNum = Number(inputs.weight);
    return (
      inputs.gender &&
      !isNaN(ageNum) && ageNum > 0 && ageNum < 120 &&
      !isNaN(heightNum) && heightNum > 30 && heightNum < 300 &&
      !isNaN(weightNum) && weightNum > 2 && weightNum < 700
    );
  }, [inputs]);

  // BMR calculation using Mifflin-St Jeor Equation (most accurate and widely recommended)
  // Men: BMR = (10 × weight in kg) + (6.25 × height in cm) − (5 × age in years) + 5
  // Women: BMR = (10 × weight in kg) + (6.25 × height in cm) − (5 × age in years) − 161
  const results = useMemo(() => {
    if (!isValidInput) {
      return {
        value: null,
        label: "",
        subtext: "Please enter valid inputs to calculate your BMR.",
        warning: null,
        formulaUsed: "Mifflin-St Jeor Equation",
      };
    }

    const age = Number(inputs.age);
    const height = Number(inputs.height);
    const weight = Number(inputs.weight);
    const gender = inputs.gender;

    let bmr = 0;
    if (gender === "male") {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else if (gender === "female") {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    // Round to nearest whole number
    const roundedBmr = Math.round(bmr);

    return {
      value: `${roundedBmr} kcal/day`,
      label: "Your Basal Metabolic Rate",
      subtext:
        "This is the estimated number of calories your body needs at rest to maintain vital functions such as breathing, circulation, and cell production.",
      warning: null,
      formulaUsed: "Mifflin-St Jeor Equation",
    };
  }, [inputs, isValidInput]);

  const faqs = [
    {
      question: "What is Basal Metabolic Rate (BMR)?",
      answer:
        "Basal Metabolic Rate (BMR) is the number of calories your body requires to maintain basic physiological functions while at complete rest. It excludes calories burned from physical activity or digestion, representing the minimum energy expenditure necessary to sustain life.",
    },
    {
      question: "Why is the Mifflin-St Jeor Equation used for BMR calculation?",
      answer:
        "The Mifflin-St Jeor Equation is widely regarded as the most accurate formula for estimating BMR in healthy adults. It was developed in 1990 and has been validated across diverse populations, outperforming older formulas like Harris-Benedict in precision.",
    },
    {
      question: "How can I use my BMR to manage my weight?",
      answer:
        "Knowing your BMR helps you understand your baseline calorie needs. To maintain weight, consume calories equal to your total daily energy expenditure (TDEE), which includes BMR plus calories burned through activity. To lose or gain weight, adjust your calorie intake accordingly, but always consult a healthcare professional for personalized advice.",
    },
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="age">Age (years)</Label>
              <Input
                id="age"
                type="number"
                min={1}
                max={120}
                placeholder="e.g., 30"
                value={inputs.age}
                onChange={(e) => handleInputChange("age", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="gender">Gender</Label>
              <Select
                onValueChange={(v) => handleInputChange("gender", v)}
                value={inputs.gender}
                aria-label="Select gender"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">
                    Male <MaleIcon />
                  </SelectItem>
                  <SelectItem value="female">
                    Female <FemaleIcon />
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                min={30}
                max={300}
                placeholder="e.g., 170"
                value={inputs.height}
                onChange={(e) => handleInputChange("height", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                min={2}
                max={700}
                placeholder="e.g., 65"
                value={inputs.weight}
                onChange={(e) => handleInputChange("weight", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            if (!isValidInput) {
              alert(
                "Please enter valid inputs for age, gender, height, and weight before calculating."
              );
            }
          }}
        >
          <Scale className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              age: "",
              gender: "",
              height: "",
              weight: "",
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
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
              {results.value}
            </p>
            <p className="mt-2 text-lg font-medium text-blue-800 dark:text-blue-300">
              {results.label}
            </p>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-400 max-w-md mx-auto">
              {results.subtext}
            </p>
            <p className="mt-4 text-xs italic text-slate-500 dark:text-slate-400">
              Formula used: {results.formulaUsed}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Basal Metabolic Rate (BMR) Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Basal Metabolic Rate (BMR) represents the minimum number of calories your
          body requires to sustain essential physiological functions such as breathing,
          blood circulation, cell regeneration, and maintaining body temperature while
          at complete rest. This metric is fundamental in understanding your body's
          energy needs before factoring in any physical activity or digestion processes.
          Accurately estimating your BMR is crucial for developing effective nutrition
          and fitness plans tailored to your individual metabolism and lifestyle.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This calculator uses the Mifflin-St Jeor Equation, which is currently the most
          validated and widely accepted formula for estimating BMR in adults. It takes
          into account your age, gender, height, and weight to provide a personalized
          calorie baseline. Understanding your BMR empowers you to make informed
          decisions about calorie intake, weight management, and overall health.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To obtain an accurate Basal Metabolic Rate estimate, you need to provide four
          key pieces of information: your age in years, biological gender, height in
          centimeters, and weight in kilograms. These inputs allow the calculator to
          apply the Mifflin-St Jeor Equation precisely. Once you enter valid values,
          simply click the "Calculate" button to see your BMR displayed in calories
          per day.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter your age in years. Ensure it is a realistic
            number between 1 and 120.
          </li>
          <li>
            <strong>Step 2:</strong> Select your biological gender (male or female),
            as the formula differs slightly between genders.
          </li>
          <li>
            <strong>Step 3:</strong> Input your height in centimeters. Accurate
            measurement improves precision.
          </li>
          <li>
            <strong>Step 4:</strong> Input your weight in kilograms. Use your most
            recent and accurate weight.
          </li>
          <li>
            <strong>Step 5:</strong> Click "Calculate" to view your Basal Metabolic
            Rate in kcal/day.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Professional Tips & Safety
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          While BMR provides a foundational estimate of your body's resting energy needs,
          it does not account for calories burned through physical activity, digestion,
          or other lifestyle factors. To get a comprehensive picture of your daily energy
          expenditure, consider calculating your Total Daily Energy Expenditure (TDEE),
          which includes activity multipliers based on your lifestyle.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Always use BMR and related calculations as guides rather than absolute values.
          Individual metabolic rates can vary due to genetics, hormonal balance, health
          conditions, and more. For personalized nutrition or weight management plans,
          consult with a registered dietitian, nutritionist, or healthcare professional.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Additionally, avoid drastic calorie restrictions based solely on BMR calculations,
          as this can lead to nutrient deficiencies and metabolic slowdown. Balanced,
          sustainable approaches to diet and exercise are key to long-term health.
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

      {/* NEW RICH REFERENCES SECTION */}
      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          References & Additional Resources
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
          For further reading and verification, please refer to these authoritative
          sources:
        </p>
        <ul className="space-y-4">
          <li>
            <a
              href="https://www.cdc.gov/healthyweight/assessing/bmr.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Centers for Disease Control and Prevention (CDC) - Basal Metabolic Rate{" "}
              <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Official CDC resource explaining BMR, its importance, and how it relates to
              healthy weight management.
            </p>
          </li>
          <li>
            <a
              href="https://www.niddk.nih.gov/health-information/weight-management/basal-metabolic-rate"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              National Institute of Diabetes and Digestive and Kidney Diseases (NIDDK) - BMR{" "}
              <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Comprehensive overview of BMR, including factors affecting metabolism and
              tips for weight management.
            </p>
          </li>
          <li>
            <a
              href="https://www.energy.gov/eere/vehicles/articles/fotw-1168-january-24-2022-mifflin-st-jeor-equation-most-accurate-basal-metabolic-rate"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              U.S. Department of Energy - Mifflin-St Jeor Equation Accuracy{" "}
              <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Analysis and validation of the Mifflin-St Jeor Equation as the most accurate
              method for estimating BMR in adults.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  // Icons for gender select items (simple SVG inline for accessibility)
  function MaleIcon() {
    return <Male className="inline-block ml-1 w-4 h-4 text-blue-600" />;
  }
  function FemaleIcon() {
    return <Users className="inline-block ml-1 w-4 h-4 text-pink-600" />;
  }

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
          "For men: BMR = (10 × weight in kg) + (6.25 × height in cm) − (5 × age in years) + 5; For women: BMR = (10 × weight in kg) + (6.25 × height in cm) − (5 × age in years) − 161",
        variables: [
          { symbol: "weight", description: "Your weight in kilograms" },
          { symbol: "height", description: "Your height in centimeters" },
          { symbol: "age", description: "Your age in years" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "A 35-year-old female who weighs 68 kg and is 165 cm tall wants to know her BMR.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Input age as 35, select gender as female, height as 165 cm, and weight as 68 kg.",
          },
          {
            label: "Step 2",
            explanation:
              "Click 'Calculate' to compute BMR using the Mifflin-St Jeor Equation.",
          },
          {
            label: "Step 3",
            explanation:
              "The calculator returns a BMR of approximately 1460 kcal/day, indicating the calories needed at rest.",
          },
        ],
        result:
          "This means the woman requires about 1460 calories daily to maintain vital bodily functions at rest.",
      }}
      relatedCalculators={[
        {
          title: "Refrigerator/Freezer Safe Zone Time Window",
          url: "/everyday-life/refrigerator-freezer-safe-zone-time-window",
          icon: "💡",
        },
        {
          title: "Room Air Changes per Hour (ACH) Calculator",
          url: "/everyday-life/room-air-changes-ach",
          icon: "💡",
        },
        {
          title: "Coffee Urn Yield & Strength Calculator",
          url: "/everyday-life/coffee-urn-yield-strength",
          icon: "💡",
        },
        {
          title: "Buffet Serving Pan Capacity & Count",
          url: "/everyday-life/buffet-pan-capacity-count",
          icon: "💡",
        },
        {
          title: "Cleaning Dilution Ratio Calculator",
          url: "/everyday-life/cleaning-dilution-ratio",
          icon: "🏠",
        },
        {
          title: "Hydration Reminder Interval Planner",
          url: "/everyday-life/hydration-reminder-interval",
          icon: "💡",
        },
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