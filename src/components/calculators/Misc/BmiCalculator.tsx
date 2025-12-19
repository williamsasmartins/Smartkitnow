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

export default function BmiCalculator() {
  const [inputs, setInputs] = useState({
    height: "",
    heightUnit: "cm",
    weight: "",
    weightUnit: "kg",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // BMI calculation logic
  // BMI = weight (kg) / (height (m))^2
  // Support units: height in cm or inches, weight in kg or lbs
  const results = useMemo(() => {
    const heightRaw = parseFloat(inputs.height);
    const weightRaw = parseFloat(inputs.weight);
    if (
      isNaN(heightRaw) ||
      isNaN(weightRaw) ||
      heightRaw <= 0 ||
      weightRaw <= 0
    ) {
      return {
        value: null,
        label: "",
        subtext: "",
        warning: "Please enter valid positive numbers for height and weight.",
        formulaUsed:
          "BMI = weight (kg) / [height (m)]², with unit conversions applied as needed.",
      };
    }

    // Convert height to meters
    let heightMeters = 0;
    if (inputs.heightUnit === "cm") {
      heightMeters = heightRaw / 100;
    } else if (inputs.heightUnit === "in") {
      heightMeters = heightRaw * 0.0254;
    }

    // Convert weight to kilograms
    let weightKg = 0;
    if (inputs.weightUnit === "kg") {
      weightKg = weightRaw;
    } else if (inputs.weightUnit === "lb") {
      weightKg = weightRaw * 0.45359237;
    }

    if (heightMeters === 0) {
      return {
        value: null,
        label: "",
        subtext: "",
        warning: "Height cannot be zero.",
        formulaUsed:
          "BMI = weight (kg) / [height (m)]², with unit conversions applied as needed.",
      };
    }

    const bmi = weightKg / (heightMeters * heightMeters);
    const bmiRounded = Math.round(bmi * 10) / 10;

    // BMI categories based on CDC guidelines
    let category = "";
    let note = "";
    let warning = null;

    if (bmi < 18.5) {
      category = "Underweight";
      note =
        "Your BMI indicates you are underweight. Consider consulting a healthcare provider for advice.";
    } else if (bmi >= 18.5 && bmi < 25) {
      category = "Normal weight";
      note = "Your BMI is within the healthy range. Maintain your current lifestyle.";
    } else if (bmi >= 25 && bmi < 30) {
      category = "Overweight";
      note =
        "Your BMI indicates overweight. Consider lifestyle changes and consult a healthcare provider.";
    } else if (bmi >= 30) {
      category = "Obesity";
      note =
        "Your BMI falls within the obesity range. It is advisable to seek medical advice.";
      warning = (
        <AlertTriangle className="inline-block w-5 h-5 text-red-600 mr-1" />
      );
    }

    return {
      value: bmiRounded.toFixed(1),
      label: category,
      subtext: note,
      warning,
      formulaUsed:
        "BMI = weight (kg) / [height (m)]², with unit conversions applied as needed.",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is Body Mass Index (BMI)?",
      answer:
        "Body Mass Index (BMI) is a numerical value derived from an individual's weight and height. It is used as a screening tool to categorize weight status and assess potential health risks associated with underweight, overweight, and obesity. However, it does not directly measure body fat percentage or distribution.",
    },
    {
      question: "Are there limitations to using BMI?",
      answer:
        "Yes, BMI does not differentiate between muscle and fat mass, so very muscular individuals may be classified as overweight or obese. It also may not accurately reflect health risks for certain ethnic groups, older adults, or children. Always consult healthcare professionals for comprehensive assessments.",
    },
    {
      question: "How often should I check my BMI?",
      answer:
        "It is generally sufficient to check your BMI periodically, such as during annual health check-ups or when making significant lifestyle changes. Frequent daily or weekly measurements are unnecessary and may lead to undue concern over minor fluctuations.",
    },
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="height" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
            Height
          </Label>
          <div className="flex gap-2">
            <Input
              id="height"
              type="number"
              min="0"
              step="any"
              placeholder="Enter height"
              value={inputs.height}
              onChange={(e) => handleInputChange("height", e.target.value)}
              aria-describedby="height-unit"
            />
            <Select
              value={inputs.heightUnit}
              onValueChange={(v) => handleInputChange("heightUnit", v)}
              aria-label="Select height unit"
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cm">cm</SelectItem>
                <SelectItem value="in">inches</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="weight" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
            Weight
          </Label>
          <div className="flex gap-2">
            <Input
              id="weight"
              type="number"
              min="0"
              step="any"
              placeholder="Enter weight"
              value={inputs.weight}
              onChange={(e) => handleInputChange("weight", e.target.value)}
              aria-describedby="weight-unit"
            />
            <Select
              value={inputs.weightUnit}
              onValueChange={(v) => handleInputChange("weightUnit", v)}
              aria-label="Select weight unit"
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kg">kg</SelectItem>
                <SelectItem value="lb">lbs</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {
            // No special action needed, calculation is reactive
          }}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          aria-label="Calculate BMI"
        >
          <Scale className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({ height: "", heightUnit: "cm", weight: "", weightUnit: "kg" })
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
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white flex justify-center items-center gap-2">
              {results.warning}
              {results.value}
            </p>
            <p className="text-xl font-semibold text-blue-800 dark:text-blue-300 mt-2">{results.label}</p>
            <p className="text-sm text-slate-700 dark:text-slate-400 mt-3 max-w-xl mx-auto leading-relaxed">
              {results.subtext}
            </p>
          </CardContent>
        </Card>
      )}

      {results.warning && !results.value && (
        <p className="text-red-600 font-semibold flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" /> {results.warning}
        </p>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Body Mass Index (BMI) Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Body Mass Index (BMI) is a widely used metric that helps estimate a person's body fat based on their weight relative to their height. It serves as a quick screening tool to categorize individuals into weight status groups such as underweight, normal weight, overweight, and obesity. While BMI does not directly measure body fat percentage or distribution, it provides a useful indicator for assessing potential health risks associated with weight. This calculator allows you to input your height and weight in various units, converting them appropriately to provide an accurate BMI value.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The BMI categories are based on guidelines from health authorities such as the Centers for Disease Control and Prevention (CDC) and the World Health Organization (WHO). These categories help identify individuals who may be at increased risk for health problems related to their weight, such as cardiovascular disease, diabetes, and certain cancers. However, it is important to remember that BMI is only one aspect of health assessment and should be considered alongside other factors.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this BMI calculator is straightforward and user-friendly. You simply need to enter your height and weight, selecting the appropriate units for each measurement. The calculator supports centimeters and inches for height, and kilograms and pounds for weight. Once you input your data, click the "Calculate" button to see your BMI value along with the corresponding weight category and health notes.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter your height in the input field and select the unit (cm or inches) from the dropdown.
          </li>
          <li>
            <strong>Step 2:</strong> Enter your weight in the input field and select the unit (kg or lbs) from the dropdown.
          </li>
          <li>
            <strong>Step 3:</strong> Click the <em>Calculate</em> button to compute your BMI.
          </li>
          <li>
            <strong>Step 4:</strong> Review your BMI result, category, and health notes displayed below the inputs.
          </li>
          <li>
            <strong>Step 5:</strong> Use the <em>Reset</em> button to clear inputs and start a new calculation if needed.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Professional Tips & Safety
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          While BMI is a valuable screening tool, it is essential to interpret the results within the broader context of your overall health. Individuals with high muscle mass, such as athletes, may have elevated BMI values without excess body fat. Conversely, older adults may have normal BMI but higher body fat percentages. Always consider other health indicators such as waist circumference, diet, physical activity, and family history. If your BMI falls outside the normal range, consult a healthcare professional for personalized advice and comprehensive evaluation.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Additionally, avoid using BMI as the sole determinant for health decisions. It is a screening tool, not a diagnostic measure. Regular physical activity, balanced nutrition, and routine medical check-ups remain the cornerstone of maintaining healthy body weight and overall wellness.
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
          For further reading and verification, please refer to these authoritative sources:
        </p>
        <ul className="space-y-4">
          <li>
            <a
              href="https://www.cdc.gov/healthyweight/assessing/bmi/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              CDC - About Adult BMI <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              The Centers for Disease Control and Prevention provides comprehensive guidelines on BMI calculation, interpretation, and its role in health assessment.
            </p>
          </li>
          <li>
            <a
              href="https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              World Health Organization - Obesity and Overweight <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              The WHO provides global perspectives on obesity, overweight, and the use of BMI as a public health tool.
            </p>
          </li>
          <li>
            <a
              href="https://www.nhlbi.nih.gov/health/educational/lose_wt/BMI/bmicalc.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              National Heart, Lung, and Blood Institute - BMI Calculator and Guidelines <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              This resource offers detailed explanations on BMI, its calculation, and implications for cardiovascular health.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Body Mass Index (BMI) Calculator"
      description="Calculate Body Mass Index (BMI) quickly. A simple everyday tool to check if your weight falls within a healthy range."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Methodology",
        formula: "BMI = weight (kg) / [height (m)]²",
        variables: [
          { symbol: "weight", description: "Your weight in kilograms (kg)" },
          { symbol: "height", description: "Your height in meters (m)" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "Suppose a person weighs 70 kilograms and is 175 centimeters tall. They want to know their BMI to assess their weight status.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert height from centimeters to meters: 175 cm = 1.75 m.",
          },
          {
            label: "Step 2",
            explanation:
              "Apply the BMI formula: BMI = 70 / (1.75 × 1.75) = 22.86.",
          },
          {
            label: "Step 3",
            explanation:
              "Interpret the result: A BMI of 22.9 falls within the normal weight range (18.5 - 24.9).",
          },
        ],
        result:
          "The person’s BMI is approximately 22.9, indicating a healthy weight status.",
      }}
      relatedCalculators={[
        { title: "Steps → Distance Converter", url: "/everyday-life/steps-to-distance-converter", icon: "💡" },
        { title: "Wine/Beer/Soft Drink Mix Estimator", url: "/everyday-life/beverage-mix-estimator", icon: "🎉" },
        { title: "Event Capacity Calculator", url: "/everyday-life/event-capacity-calculator", icon: "💡" },
        { title: "Garden Soil/Compost Volume Calculator", url: "/everyday-life/garden-soil-compost-volume", icon: "🌿" },
        { title: "Event Budget Calculator", url: "/everyday-life/event-budget-calculator", icon: "💡" },
        { title: "Rainwater Barrel Days of Supply", url: "/everyday-life/rainwater-barrel-days-supply", icon: "💧" },
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