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

  // Conversion helpers
  const convertHeightToMeters = (height, unit) => {
    if (!height || isNaN(height) || height <= 0) return null;
    switch (unit) {
      case "cm":
        return height / 100;
      case "m":
        return height;
      case "in":
        return height * 0.0254;
      case "ft":
        return height * 0.3048;
      default:
        return null;
    }
  };

  const convertWeightToKg = (weight, unit) => {
    if (!weight || isNaN(weight) || weight <= 0) return null;
    switch (unit) {
      case "kg":
        return weight;
      case "lb":
        return weight * 0.45359237;
      case "st":
        return weight * 6.35029318;
      default:
        return null;
    }
  };

  const results = useMemo(() => {
    const heightMeters = convertHeightToMeters(
      parseFloat(inputs.height),
      inputs.heightUnit
    );
    const weightKg = convertWeightToKg(
      parseFloat(inputs.weight),
      inputs.weightUnit
    );

    if (heightMeters === null || weightKg === null) {
      return {
        value: null,
        label: null,
        subtext: "Please enter valid positive numbers for height and weight.",
        warning: "Invalid input",
        formulaUsed: "BMI = weight (kg) / (height (m))²",
      };
    }

    const bmiValue = weightKg / (heightMeters * heightMeters);
    const bmiRounded = Math.round(bmiValue * 10) / 10;

    // BMI classification based on WHO standards
    let label = "";
    let subtext = "";
    let warning = null;

    if (bmiRounded < 16) {
      label = "Severe Thinness";
      subtext =
        "Your BMI indicates severe thinness. It is important to consult a healthcare provider to assess your nutritional status and overall health.";
      warning = "Severe Thinness";
    } else if (bmiRounded >= 16 && bmiRounded < 17) {
      label = "Moderate Thinness";
      subtext =
        "Your BMI falls into moderate thinness category. Consider evaluating your diet and lifestyle, and seek medical advice if necessary.";
      warning = "Moderate Thinness";
    } else if (bmiRounded >= 17 && bmiRounded < 18.5) {
      label = "Mild Thinness";
      subtext =
        "Your BMI is slightly below the normal range. A balanced diet and healthy lifestyle can help you reach a healthier weight.";
      warning = "Mild Thinness";
    } else if (bmiRounded >= 18.5 && bmiRounded < 25) {
      label = "Normal";
      subtext =
        "Your BMI is within the normal range, indicating a healthy weight relative to your height. Maintain your current lifestyle for optimal health.";
    } else if (bmiRounded >= 25 && bmiRounded < 30) {
      label = "Overweight";
      subtext =
        "Your BMI indicates overweight status. Consider lifestyle changes such as diet and exercise to reduce health risks.";
      warning = "Overweight";
    } else if (bmiRounded >= 30 && bmiRounded < 35) {
      label = "Obese Class I (Moderate)";
      subtext =
        "Your BMI falls into Obese Class I. It is advisable to consult healthcare professionals for guidance on weight management.";
      warning = "Obese Class I";
    } else if (bmiRounded >= 35 && bmiRounded < 40) {
      label = "Obese Class II (Severe)";
      subtext:
        "Your BMI indicates severe obesity. This condition increases risk for many health problems. Medical intervention is strongly recommended.";
      warning = "Obese Class II";
    } else if (bmiRounded >= 40) {
      label = "Obese Class III (Very Severe or Morbid)";
      subtext =
        "Your BMI is in the very severe or morbid obesity range. Immediate medical attention and comprehensive weight management are critical.";
      warning = "Obese Class III";
    } else {
      label = "Unknown";
      subtext = "Unable to classify BMI.";
    }

    return {
      value: bmiRounded.toFixed(1),
      label,
      subtext,
      warning,
      formulaUsed: "BMI = weight (kg) / (height (m))²",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is Body Mass Index (BMI) and why is it important?",
      answer:
        "Body Mass Index (BMI) is a numerical value derived from an individual's weight and height, used as a screening tool to categorize weight status and assess potential health risks. It helps identify whether a person is underweight, normal weight, overweight, or obese. While BMI is a useful general indicator, it does not directly measure body fat or account for muscle mass, bone density, or distribution of fat, so it should be interpreted alongside other health assessments.",
    },
    {
      question: "Can BMI accurately reflect my health status?",
      answer:
        "BMI provides a quick and easy way to estimate weight categories that may lead to health problems, but it has limitations. It does not distinguish between muscle and fat mass, so athletes or muscular individuals may have a high BMI but low body fat. Additionally, BMI does not consider fat distribution, which is important for cardiovascular risk. Therefore, BMI should be used as a screening tool rather than a diagnostic measure, and further evaluation may be necessary for a comprehensive health assessment.",
    },
    {
      question: "How do I convert my height and weight to the units used in this calculator?",
      answer:
        "This calculator supports multiple units for height (centimeters, meters, inches, feet) and weight (kilograms, pounds, stones). To convert height, 1 inch equals 2.54 centimeters, and 1 foot equals 12 inches or 30.48 centimeters. For weight, 1 pound equals approximately 0.4536 kilograms, and 1 stone equals 14 pounds or about 6.35 kilograms. Select your preferred units from the dropdown menus and enter your measurements accordingly for accurate BMI calculation.",
    },
    {
      question: "What should I do if my BMI is outside the normal range?",
      answer:
        "If your BMI falls below or above the normal range (18.5 to 24.9), it is advisable to consult a healthcare professional for personalized advice. Being underweight may indicate nutritional deficiencies or underlying health issues, while overweight and obesity increase the risk of chronic diseases such as diabetes, heart disease, and hypertension. A healthcare provider can help develop a safe and effective plan involving diet, exercise, and lifestyle changes tailored to your needs.",
    },
    {
      question: "Is BMI calculation suitable for children and elderly people?",
      answer:
        "BMI interpretation differs for children and elderly individuals. For children and adolescents, BMI percentiles adjusted for age and sex are used instead of fixed cutoffs. Elderly people may have changes in body composition that affect BMI accuracy. Therefore, specialized growth charts and clinical assessments are recommended for these groups. Always consult a healthcare provider for appropriate evaluation and guidance.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card className="p-6 bg-white dark:bg-slate-800 shadow-md rounded-md">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="height" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
              Height
            </Label>
            <div className="flex gap-2">
              <Input
                id="height"
                type="number"
                min={0}
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
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cm">cm</SelectItem>
                  <SelectItem value="m">m</SelectItem>
                  <SelectItem value="in">in</SelectItem>
                  <SelectItem value="ft">ft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="weight" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
              Weight
            </Label>
            <div className="flex gap-2">
              <Input
                id="weight"
                type="number"
                min={0}
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
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">kg</SelectItem>
                  <SelectItem value="lb">lb</SelectItem>
                  <SelectItem value="st">st</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No special action needed, calculation is reactive
          }}
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
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white" aria-live="polite" aria-atomic="true">
              {results.value}
            </p>
            <p className="text-2xl font-semibold text-blue-800 dark:text-blue-300 mt-2">{results.label}</p>
            <p className="text-sm text-blue-700 dark:text-blue-400 mt-2 max-w-xl mx-auto leading-relaxed">{results.subtext}</p>
            {results.warning && (
              <p className="mt-4 text-red-700 dark:text-red-400 font-semibold">
                <AlertTriangle className="inline-block mr-1 h-5 w-5 align-text-bottom" />
                Warning: {results.warning}
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding the Basics</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Body Mass Index (BMI) is a widely used metric that helps individuals and healthcare professionals assess whether a person’s weight is appropriate for their height. It is calculated by dividing a person’s weight in kilograms by the square of their height in meters (kg/m²). This simple calculation provides a numerical value that categorizes individuals into different weight status groups, such as underweight, normal weight, overweight, and various classes of obesity.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          While BMI is a useful screening tool for identifying potential health risks related to body weight, it does not directly measure body fat percentage or distribution. Factors such as muscle mass, bone density, age, sex, and ethnicity can influence BMI interpretation. Therefore, BMI should be considered alongside other assessments and clinical evaluations to get a comprehensive understanding of an individual’s health status.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This BMI calculator allows you to input your height and weight in various units to accommodate different measurement preferences. Follow the detailed steps below to accurately calculate your BMI and understand your weight category:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter your height in the input field. Use the dropdown menu next to it to select the unit of measurement you are using (centimeters, meters, inches, or feet). Ensure the value is a positive number.
          </li>
          <li>
            <strong>Step 2:</strong> Enter your weight in the corresponding input field. Select the appropriate unit (kilograms, pounds, or stones) from the dropdown menu. Again, make sure the value is positive and realistic.
          </li>
          <li>
            <strong>Step 3:</strong> Click the <em>Calculate</em> button to compute your BMI. The result will be displayed prominently, along with your BMI category and a detailed explanation of what it means for your health.
          </li>
          <li>
            <strong>Step 4:</strong> If you want to clear the inputs and start over, click the <em>Reset</em> button. This will clear all fields and reset units to their defaults.
          </li>
          <li>
            <strong>Step 5:</strong> Use the information provided to understand your weight status. If your BMI falls outside the normal range, consider consulting a healthcare professional for personalized advice.
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
      title="Body Mass Index (BMI) Calculator"
      description="Calculate Body Mass Index (BMI) quickly. A simple everyday tool to check if your weight falls within a healthy range."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Methodology",
        formula: "BMI = weight (kg) / (height (m))²",
        variables: [
          { symbol: "weight", description: "Your body weight in kilograms (kg)" },
          { symbol: "height", description: "Your height in meters (m)" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "Imagine Jane, who is 5 feet 6 inches tall and weighs 150 pounds, wants to know her BMI to understand her health status better.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Jane enters her height as 5.5 feet (or 66 inches) and selects 'ft' or 'in' as the unit. The calculator converts this to meters internally.",
          },
          {
            label: "Step 2",
            explanation:
              "She inputs her weight as 150 and selects 'lb' for pounds. The calculator converts this to kilograms.",
          },
          {
            label: "Step 3",
            explanation:
              "Upon clicking 'Calculate', the calculator computes her BMI using the formula BMI = weight (kg) / (height (m))² and displays the result along with her BMI category.",
          },
        ],
        result:
          "Jane’s BMI is approximately 24.2, which falls within the 'Normal' weight range, indicating a healthy weight relative to her height.",
      }}
      relatedCalculators={[
        { title: "Garden Soil/Compost Volume Calculator", url: "/everyday-life/garden-soil-compost-volume", icon: "🌿" },
        { title: "Coffee Urn Yield & Strength Calculator", url: "/everyday-life/coffee-urn-yield-strength", icon: "💡" },
        { title: "Home Renovation Cost Estimator", url: "/everyday-life/home-renovation-cost-estimator", icon: "🏠" },
        { title: "Home Paint Touch-Up Estimator", url: "/everyday-life/home-paint-touch-up", icon: "🏠" },
        { title: "Buffet Serving Pan Capacity & Count", url: "/everyday-life/buffet-pan-capacity-count", icon: "💡" },
        { title: "Plant Spacing Calculator", url: "/everyday-life/plant-spacing-calculator", icon: "🌿" },
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