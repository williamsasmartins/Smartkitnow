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

export default function BodyFatPercentageCalculator() {
  const [inputs, setInputs] = useState({
    gender: "",
    age: "",
    weight: "",
    height: "",
    neck: "",
    waist: "",
    hip: "",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Body Fat % calculation using U.S. Navy Method (most common tape measure method)
  // Source: https://www.navyfitness.org/body-fat-calculator/
  // Formula:
  // For men: %BF = 86.010 * log10(waist - neck) - 70.041 * log10(height) + 36.76
  // For women: %BF = 163.205 * log10(waist + hip - neck) - 97.684 * log10(height) - 78.387

  const results = useMemo(() => {
    const { gender, age, weight, height, neck, waist, hip } = inputs;

    // Validate inputs presence and numeric
    if (
      !gender ||
      !age ||
      !weight ||
      !height ||
      !neck ||
      !waist ||
      (gender === "female" && !hip)
    ) {
      return {
        value: null,
        label: "",
        subtext: "Please fill in all required fields to calculate body fat percentage.",
        warning: null,
        formulaUsed: "",
      };
    }

    // Convert inputs to numbers
    const ageNum = Number(age);
    const weightNum = Number(weight);
    const heightNum = Number(height);
    const neckNum = Number(neck);
    const waistNum = Number(waist);
    const hipNum = gender === "female" ? Number(hip) : 0;

    if (
      [ageNum, weightNum, heightNum, neckNum, waistNum].some(
        (v) => isNaN(v) || v <= 0
      ) ||
      (gender === "female" && (isNaN(hipNum) || hipNum <= 0))
    ) {
      return {
        value: null,
        label: "",
        subtext: "All numeric inputs must be positive numbers.",
        warning: null,
        formulaUsed: "",
      };
    }

    // Height, neck, waist, hip in cm or inches? We'll assume inches for formula.
    // If user inputs cm, we can add a note or convert, but for simplicity, assume inches.

    // Calculate body fat percentage using U.S. Navy method
    // Use Math.log10 for log base 10

    let bodyFat = null;
    let formulaUsed = "";

    if (gender === "male") {
      // Men formula
      // %BF = 86.010 * log10(waist - neck) - 70.041 * log10(height) + 36.76
      if (waistNum <= neckNum) {
        return {
          value: null,
          label: "",
          subtext:
            "Waist measurement must be larger than neck measurement for calculation.",
          warning: "Input error",
          formulaUsed: "",
        };
      }
      bodyFat =
        86.010 * Math.log10(waistNum - neckNum) -
        70.041 * Math.log10(heightNum) +
        36.76;
      formulaUsed =
        "%BF = 86.010 × log10(waist - neck) - 70.041 × log10(height) + 36.76";
    } else if (gender === "female") {
      // Women formula
      // %BF = 163.205 * log10(waist + hip - neck) - 97.684 * log10(height) - 78.387
      if (waistNum + hipNum <= neckNum) {
        return {
          value: null,
          label: "",
          subtext:
            "Sum of waist and hip measurements must be larger than neck measurement for calculation.",
          warning: "Input error",
          formulaUsed: "",
        };
      }
      bodyFat =
        163.205 * Math.log10(waistNum + hipNum - neckNum) -
        97.684 * Math.log10(heightNum) -
        78.387;
      formulaUsed =
        "%BF = 163.205 × log10(waist + hip - neck) - 97.684 × log10(height) - 78.387";
    } else {
      return {
        value: null,
        label: "",
        subtext: "Please select a valid gender.",
        warning: null,
        formulaUsed: "",
      };
    }

    // Clamp body fat % between 2% and 60% for sanity
    if (bodyFat < 2) bodyFat = 2;
    if (bodyFat > 60) bodyFat = 60;

    // Round to 1 decimal place
    const bfRounded = bodyFat.toFixed(1);

    // Interpretation based on American Council on Exercise (ACE) body fat categories
    // Source: https://www.acefitness.org/resources/everyone/blog/6645/ace-s-body-fat-percentage-chart/
    let category = "";
    if (gender === "male") {
      if (bodyFat < 6) category = "Essential fat";
      else if (bodyFat < 14) category = "Athletes";
      else if (bodyFat < 18) category = "Fitness";
      else if (bodyFat < 25) category = "Average";
      else category = "Obese";
    } else {
      if (bodyFat < 14) category = "Essential fat";
      else if (bodyFat < 21) category = "Athletes";
      else if (bodyFat < 25) category = "Fitness";
      else if (bodyFat < 32) category = "Average";
      else category = "Obese";
    }

    return {
      value: `${bfRounded}%`,
      label: `Estimated Body Fat Percentage (${category})`,
      subtext:
        "This estimate is based on the U.S. Navy circumference method and provides a practical way to track body composition changes over time.",
      warning: null,
      formulaUsed,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is body fat percentage and why is it important?",
      answer:
        "Body fat percentage represents the proportion of fat in your body compared to your total weight. It is a crucial indicator of health and fitness because it provides more insight than weight alone, helping to assess risk for diseases related to excess fat or insufficient fat.",
    },
    {
      question: "How accurate is the U.S. Navy body fat calculator?",
      answer:
        "The U.S. Navy method is a widely used and validated tape measurement technique that estimates body fat percentage with reasonable accuracy for most adults. However, it may be less accurate for very muscular individuals or those with atypical body shapes. For clinical precision, methods like DEXA scans or hydrostatic weighing are preferred.",
    },
    {
      question: "Can I use this calculator if I measure in centimeters?",
      answer:
        "This calculator assumes all measurements are in inches. If you measure in centimeters, convert them to inches by dividing by 2.54 before entering the values to ensure accurate results.",
    },
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="gender" className="mb-1 flex items-center gap-1">
                Gender <Users className="w-4 h-4 text-blue-600" />
              </Label>
              <Select
                value={inputs.gender}
                onValueChange={(v) => handleInputChange("gender", v)}
                id="gender"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="age" className="mb-1 flex items-center gap-1">
                Age (years) <Calendar className="w-4 h-4 text-blue-600" />
              </Label>
              <Input
                id="age"
                type="number"
                min={10}
                max={120}
                placeholder="e.g., 30"
                value={inputs.age}
                onChange={(e) => handleInputChange("age", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="weight" className="mb-1 flex items-center gap-1">
                Weight (lbs) <Scale className="w-4 h-4 text-blue-600" />
              </Label>
              <Input
                id="weight"
                type="number"
                min={50}
                max={1000}
                placeholder="e.g., 180"
                value={inputs.weight}
                onChange={(e) => handleInputChange("weight", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="height" className="mb-1 flex items-center gap-1">
                Height (inches) <Activity className="w-4 h-4 text-blue-600" />
              </Label>
              <Input
                id="height"
                type="number"
                min={36}
                max={96}
                placeholder="e.g., 70"
                value={inputs.height}
                onChange={(e) => handleInputChange("height", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="neck" className="mb-1 flex items-center gap-1">
                Neck Circumference (inches) <Wrench className="w-4 h-4 text-blue-600" />
              </Label>
              <Input
                id="neck"
                type="number"
                min={8}
                max={30}
                placeholder="e.g., 15"
                value={inputs.neck}
                onChange={(e) => handleInputChange("neck", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="waist" className="mb-1 flex items-center gap-1">
                Waist Circumference (inches) <Scale className="w-4 h-4 text-blue-600" />
              </Label>
              <Input
                id="waist"
                type="number"
                min={20}
                max={70}
                placeholder="e.g., 34"
                value={inputs.waist}
                onChange={(e) => handleInputChange("waist", e.target.value)}
              />
            </div>

            {inputs.gender === "female" && (
              <div>
                <Label htmlFor="hip" className="mb-1 flex items-center gap-1">
                  Hip Circumference (inches) <Scale className="w-4 h-4 text-blue-600" />
                </Label>
                <Input
                  id="hip"
                  type="number"
                  min={30}
                  max={70}
                  placeholder="e.g., 38"
                  value={inputs.hip}
                  onChange={(e) => handleInputChange("hip", e.target.value)}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {}}
          aria-label="Calculate body fat percentage"
        >
          <Scale className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              gender: "",
              age: "",
              weight: "",
              height: "",
              neck: "",
              waist: "",
              hip: "",
            })
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
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
              {results.value}
            </p>
            <p className="mt-2 text-lg font-semibold text-blue-800 dark:text-blue-300">
              {results.label}
            </p>
            <p className="mt-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-xl mx-auto">
              {results.subtext}
            </p>
            {results.warning && (
              <p className="mt-3 text-red-600 font-semibold flex items-center justify-center gap-2">
                <AlertTriangle className="w-5 h-5" /> {results.warning}
              </p>
            )}
            {results.formulaUsed && (
              <p className="mt-4 text-xs italic text-slate-500 dark:text-slate-400">
                Formula used: {results.formulaUsed}
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
          Understanding Body Fat Percentage Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Body fat percentage is a vital metric that quantifies the proportion of fat
          mass relative to total body weight. Unlike the traditional body mass index
          (BMI), which only considers weight and height, body fat percentage provides
          a more precise insight into an individual's health and fitness level. This
          calculator employs the U.S. Navy circumference method, a scientifically
          validated approach that uses simple tape measurements to estimate body fat
          percentage accurately. By understanding your body fat percentage, you can
          better assess your risk for chronic diseases, optimize fitness goals, and
          track changes in body composition over time.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To obtain an accurate estimate of your body fat percentage, you will need to
          provide several key measurements. These include your gender, age, weight,
          height, and specific body circumferences such as neck, waist, and for women,
          hip measurements. It is essential to use a flexible measuring tape and take
          measurements snugly but without compressing the skin. Ensure all values are
          entered in inches and pounds as specified. Once all inputs are provided,
          simply click the Calculate button to receive your estimated body fat
          percentage along with a classification based on recognized health standards.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select your gender to determine the appropriate
            formula.
          </li>
          <li>
            <strong>Step 2:</strong> Enter your age in years to contextualize results.
          </li>
          <li>
            <strong>Step 3:</strong> Input your weight in pounds and height in inches.
          </li>
          <li>
            <strong>Step 4:</strong> Measure and enter neck and waist circumferences in
            inches. For females, also include hip circumference.
          </li>
          <li>
            <strong>Step 5:</strong> Click the Calculate button to view your body fat
            percentage and category.
          </li>
          <li>
            <strong>Step 6:</strong> Use the Reset button to clear inputs and start a
            new calculation.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Professional Tips & Safety
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          For the most reliable results, take your measurements at the same time of day,
          preferably in the morning before eating or exercising, to reduce variability.
          Use a flexible, non-stretchable tape measure and ensure it is level around the
          body part being measured. Avoid pulling the tape too tight or leaving it too
          loose. Remember that this calculator provides an estimate and should not
          replace professional body composition assessments if precise data is required.
          Always consult a healthcare or fitness professional if you have concerns about
          your body fat or overall health. Tracking your body fat percentage over time
          can be a powerful motivator and indicator of progress toward your fitness goals.
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
              href="https://www.cdc.gov/healthyweight/assessing/bmi/adult_bmi/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Centers for Disease Control and Prevention (CDC) - Adult BMI Calculator{" "}
              <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Official guidelines and tools for assessing body composition and health
              risks related to body fat.
            </p>
          </li>
          <li>
            <a
              href="https://www.navyfitness.org/body-fat-calculator/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              U.S. Navy Body Fat Calculator Method{" "}
              <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Detailed explanation of the Navy circumference method for estimating body
              fat percentage.
            </p>
          </li>
          <li>
            <a
              href="https://www.acefitness.org/education-and-resources/lifestyle/tools-calculators/body-fat-percentage-calculator/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              American Council on Exercise (ACE) Body Fat Percentage Chart{" "}
              <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Comprehensive body fat percentage categories and health implications.
            </p>
          </li>
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
          "For men: %BF = 86.010 × log10(waist - neck) - 70.041 × log10(height) + 36.76; For women: %BF = 163.205 × log10(waist + hip - neck) - 97.684 × log10(height) - 78.387",
        variables: [
          { symbol: "waist", description: "Waist circumference in inches" },
          { symbol: "neck", description: "Neck circumference in inches" },
          { symbol: "hip", description: "Hip circumference in inches (women only)" },
          { symbol: "height", description: "Height in inches" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "John is a 30-year-old male who weighs 180 lbs and is 70 inches tall. He measures his neck at 16 inches and his waist at 34 inches. Using these measurements, he wants to estimate his body fat percentage.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Select 'Male' for gender and enter age as 30, weight as 180 lbs, and height as 70 inches.",
          },
          {
            label: "Step 2",
            explanation:
              "Input neck circumference as 16 inches and waist circumference as 34 inches.",
          },
          {
            label: "Step 3",
            explanation:
              "Click Calculate to get the estimated body fat percentage based on the U.S. Navy method.",
          },
        ],
        result:
          "John's estimated body fat percentage is approximately 16.5%, which falls into the 'Fitness' category for males.",
      }}
      relatedCalculators={[
        { title: "Body Mass Index (BMI) Calculator", url: "/everyday/bmi-calculator", icon: "Heart" },
        { title: "Light Bulb Cost per Year Calculator", url: "/everyday/light-bulb-cost-per-year", icon: "Home" },
        { title: "MyPlate Daily Calorie/Nutrient Planner", url: "/everyday/myplate-daily-calorie-nutrient", icon: "Heart" },
        { title: "Laundry Detergent Dosage by Load Size", url: "/everyday/laundry-detergent-dosage", icon: "DollarSign" },
        { title: "Lawn Mowing Time & Fuel Planner", url: "/everyday/lawn-mowing-time-fuel", icon: "DollarSign" },
        { title: "Propane Tank Burn Time Estimator", url: "/everyday/propane-tank-burn-time", icon: "DollarSign" },
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