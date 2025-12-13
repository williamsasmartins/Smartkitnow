import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BmiBodyMassIndexCalculator() {
  // 1. STATE (Imperial Default)
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState({
    weight: "",
    heightFt: "",
    heightIn: "",
    heightCm: "",
  });

  // 2. LOGIC
  const results = useMemo(() => {
    let bmiValue = 0;
    if (unit === "imperial") {
      const weightLbs = parseFloat(inputs.weight);
      const heightFeet = parseFloat(inputs.heightFt);
      const heightInches = parseFloat(inputs.heightIn);
      if (
        !isNaN(weightLbs) &&
        weightLbs > 0 &&
        !isNaN(heightFeet) &&
        heightFeet >= 0 &&
        !isNaN(heightInches) &&
        heightInches >= 0
      ) {
        const totalInches = heightFeet * 12 + heightInches;
        if (totalInches > 0) {
          bmiValue = (weightLbs / (totalInches * totalInches)) * 703;
        }
      }
    } else {
      const weightKg = parseFloat(inputs.weight);
      const heightCm = parseFloat(inputs.heightCm);
      if (
        !isNaN(weightKg) &&
        weightKg > 0 &&
        !isNaN(heightCm) &&
        heightCm > 0
      ) {
        const heightM = heightCm / 100;
        bmiValue = weightKg / (heightM * heightM);
      }
    }

    bmiValue = Math.round(bmiValue * 10) / 10; // Round to 1 decimal place

    let label = "Invalid input";
    let category = "";

    if (bmiValue > 0) {
      label = bmiValue.toFixed(1);
      if (bmiValue < 18.5) {
        category = "Underweight";
      } else if (bmiValue < 25) {
        category = "Normal weight";
      } else if (bmiValue < 30) {
        category = "Overweight";
      } else {
        category = "Obesity";
      }
    }

    return { value: bmiValue, label, category };
  }, [inputs, unit]);

  // 3. FAQS (Must be detailed)
  const faqs = [
    {
      question: "What does the BMI — Body Mass Index Calculator measure?",
      answer:
        "The BMI — Body Mass Index Calculator measures the ratio of a person's weight to their height squared, providing a numerical value that helps assess whether an individual is underweight, normal weight, overweight, or obese. It is a widely used screening tool to categorize weight status and potential health risks associated with body fat. However, BMI does not directly measure body fat percentage or distribution, so it should be interpreted alongside other health indicators.",
    },
    {
      question: "Why is BMI important in health assessments?",
      answer:
        "BMI is important because it offers a quick, standardized method to identify individuals who may be at risk for health problems related to weight, such as cardiovascular disease, diabetes, and hypertension. It is used by healthcare professionals and public health organizations to monitor population health trends and guide interventions. While it is not a diagnostic tool, BMI provides valuable context when combined with other clinical assessments and lifestyle factors.",
    },
    {
      question: "How should I interpret my BMI result from this calculator?",
      answer:
        "BMI results fall into categories that indicate weight status: underweight (BMI less than 18.5), normal weight (18.5 to 24.9), overweight (25 to 29.9), and obesity (30 or greater). These categories help identify potential health risks but do not account for muscle mass, bone density, or fat distribution. Therefore, individuals such as athletes or older adults may have misleading BMI results, and further evaluation may be necessary.",
    },
    {
      question: "What are the limitations of the BMI — Body Mass Index Calculator?",
      answer:
        "The BMI calculator has limitations because it does not differentiate between fat and lean body mass, nor does it consider fat distribution or ethnic variations in body composition. It may misclassify muscular individuals as overweight or obese and underestimate fatness in older adults with muscle loss. Additionally, BMI does not directly assess health or fitness levels, so it should be used as one component of a comprehensive health evaluation.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
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

        {/* Inputs */}
        {unit === "imperial" ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
                Weight (lbs)
              </Label>
              <Input
                id="weight"
                type="number"
                min={0}
                step="any"
                placeholder="e.g. 150"
                value={inputs.weight}
                onChange={(e) => handleInputChange("weight", e.target.value)}
                className="text-slate-900"
              />
            </div>
            <div>
              <Label htmlFor="heightFt" className="text-slate-700 dark:text-slate-300">
                Height (ft)
              </Label>
              <Input
                id="heightFt"
                type="number"
                min={0}
                step="1"
                placeholder="e.g. 5"
                value={inputs.heightFt}
                onChange={(e) => handleInputChange("heightFt", e.target.value)}
                className="text-slate-900"
              />
            </div>
            <div>
              <Label htmlFor="heightIn" className="text-slate-700 dark:text-slate-300">
                Height (in)
              </Label>
              <Input
                id="heightIn"
                type="number"
                min={0}
                max={11}
                step="any"
                placeholder="e.g. 8"
                value={inputs.heightIn}
                onChange={(e) => handleInputChange("heightIn", e.target.value)}
                className="text-slate-900"
              />
            </div>
          </div>
        ) : (
          <div>
            <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
              Weight (kg)
            </Label>
            <Input
              id="weight"
              type="number"
              min={0}
              step="any"
              placeholder="e.g. 68"
              value={inputs.weight}
              onChange={(e) => handleInputChange("weight", e.target.value)}
              className="text-slate-900 mb-4"
            />
            <Label htmlFor="heightCm" className="text-slate-700 dark:text-slate-300">
              Height (cm)
            </Label>
            <Input
              id="heightCm"
              type="number"
              min={0}
              step="any"
              placeholder="e.g. 173"
              value={inputs.heightCm}
              onChange={(e) => handleInputChange("heightCm", e.target.value)}
              className="text-slate-900"
            />
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {
            // Trigger recalculation by updating state (already handled by useMemo)
            setInputs((prev) => ({ ...prev }));
          }}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              weight: "",
              heightFt: "",
              heightIn: "",
              heightCm: "",
            })
          }
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results (Blue Gradient) */}
      {results.value !== 0 && results.label !== "Invalid input" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Your Result
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-blue-50">{results.label}</p>
              <p className="text-slate-600 mt-2 font-medium">{results.category}</p>
              {results.category && (
                <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-white/50 border border-blue-200 text-blue-800 text-sm font-bold">
                  {results.category}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
      {results.label === "Invalid input" && (
        <p className="text-red-600 font-semibold mt-4 text-center">Please enter valid positive numbers for all required fields.</p>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      {/* MANDATORY "WHAT IS" SECTION */}
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          What is the BMI — Body Mass Index Calculator?
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Body Mass Index (BMI) Calculator is a tool designed to estimate an individual's body fat based on their weight relative to their height. BMI is calculated by dividing a person's weight by the square of their height, resulting in a numerical value that categorizes weight status. This index serves as a quick and accessible screening method to assess whether a person is underweight, within a healthy weight range, overweight, or obese. It is widely used in clinical and public health settings due to its simplicity and correlation with health risks.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          While BMI does not directly measure body fat percentage or distribution, it provides a useful proxy for identifying individuals who may be at increased risk for chronic conditions such as cardiovascular disease, type 2 diabetes, and certain cancers. The calculator supports both imperial units (pounds, feet, and inches) and metric units (kilograms and centimeters), accommodating the measurement preferences common in Canada and the United States. Understanding BMI helps individuals and healthcare providers make informed decisions about health management and lifestyle interventions.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          It is important to note that BMI is a screening tool rather than a diagnostic measure. Factors such as muscle mass, bone density, age, sex, and ethnicity can influence BMI results. Therefore, BMI should be interpreted in conjunction with other clinical assessments and health indicators to provide a comprehensive evaluation of an individual's health status.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this BMI calculator is straightforward and requires only basic measurements of your weight and height. First, select your preferred unit system: Imperial (pounds, feet, and inches) or Metric (kilograms and centimeters). Then, enter your weight and height values accurately into the corresponding input fields. Once all required fields are filled, click the "Calculate" button to obtain your BMI value and its associated weight category.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Weight:</strong> Enter your current body weight. Use pounds if you selected Imperial units or kilograms if you selected Metric units. Ensure the value is positive and realistic.
          </li>
          <li>
            <strong>Height:</strong> For Imperial units, input your height in feet and inches separately to improve accuracy. For Metric units, enter your height in centimeters. Avoid leaving any height fields blank.
          </li>
          <li>
            <strong>Calculate:</strong> After entering your measurements, press the "Calculate" button. The calculator will compute your BMI and display the result along with the corresponding weight category, helping you understand your weight status.
          </li>
          <li>
            <strong>Reset:</strong> Use the "Reset" button to clear all inputs and start a new calculation if needed.
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

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Trusted References</h2>
        <ul className="space-y-4">
          <li className="block">
            <a
              href="https://www.cdc.gov/healthyweight/assessing/bmi/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Centers for Disease Control and Prevention (CDC) - BMI Information
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Comprehensive resource on BMI calculation, interpretation, and its role in health assessment.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.canada.ca/en/public-health/services/health-promotion/healthy-living/your-health/bmi.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Government of Canada - Body Mass Index (BMI)
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Official Canadian guidelines and explanations on BMI and healthy weight ranges.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.nhlbi.nih.gov/health/educational/lose_wt/BMI/bmicalc.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. National Heart, Lung, and Blood Institute (NHLBI) - BMI Calculator
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Authoritative source providing BMI calculation tools and health risk information.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.investopedia.com/terms/b/body-mass-index-bmi.asp"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              4. Investopedia - Body Mass Index (BMI) Explained
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Detailed explanation of BMI, its calculation, and practical implications in health and finance.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="BMI — Body Mass Index Calculator"
      description="Calculate your Body Mass Index (BMI) instantly. Determine if you are in a healthy weight range based on your height and weight."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math Formula",
        formula:
          "BMI = (Weight ÷ Height²) × Conversion Factor",
        variables: [
          {
            symbol: "Weight",
            description:
              "Your body weight in pounds (lbs) for Imperial units or kilograms (kg) for Metric units.",
          },
          {
            symbol: "Height",
            description:
              "Your height in inches (Imperial) or meters (Metric). For Imperial, height in feet and inches is converted to total inches.",
          },
          {
            symbol: "Conversion Factor",
            description:
              "703 for Imperial units to adjust for pounds and inches; 1 for Metric units (kg/m²).",
          },
        ],
      }}
      example={{
        title: "Real-World Example",
        scenario:
          "A person weighs 180 lbs and is 5 feet 10 inches tall. They want to calculate their BMI using the Imperial system.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert height to total inches: (5 × 12) + 10 = 70 inches.",
          },
          {
            label: "Step 2",
            explanation:
              "Apply the BMI formula: BMI = (180 ÷ 70²) × 703 = (180 ÷ 4900) × 703 ≈ 25.8.",
          },
        ],
        result:
          "The BMI is approximately 25.8, which falls into the 'Overweight' category.",
      }}
      relatedCalculators={[
        { title: "BMR — Basal Metabolic Rate (Mifflin-St Jeor)", url: "/health/bmr-mifflin-st-jeor", icon: "⚖️" },
        { title: "TDEE — Total Daily Energy Expenditure Calculator", url: "/health/tdee-daily-energy-expenditure", icon: "🔥" },
        { title: "Body Fat % (US Navy / 3-sites)", url: "/health/body-fat-us-navy-3-sites", icon: "❤️" },
        { title: "Ideal Weight Range (Hamwi/Devine/Miller)", url: "/health/ideal-weight-range-hamwi-devine-miller", icon: "💧" },
        { title: "Waist-to-Height Ratio Checker", url: "/health/waist-to-height-ratio", icon: "🥗" },
        { title: "Body Surface Area (BSA) Calculator", url: "/health/body-surface-area-bsa", icon: "😴" },
      ]}
      onThisPage={[
        { id: "what-is", label: "What is BMI — Body Mass Index Calculator?" },
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