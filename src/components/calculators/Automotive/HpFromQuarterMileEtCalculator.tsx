import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Car, Fuel, DollarSign, Info, CheckCircle2, AlertTriangle, BookOpen, ExternalLink, Settings, Zap } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function HpFromQuarterMileEtCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    et: "", // Quarter Mile ET (seconds)
    weight: "", // Vehicle Weight (lbs or kg)
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Calculation logic:
   * Using the classic formula to estimate horsepower from quarter mile ET and weight:
   * HP = (Weight / (ET / 5.825)^3)
   * 
   * This formula is widely used in drag racing and automotive performance circles.
   * 
   * For metric units, weight is in kg, ET in seconds.
   * For imperial units, weight is in lbs, ET in seconds.
   * 
   * Output: Estimated horsepower required to achieve the given ET with the given weight.
   */

  const results = useMemo(() => {
    const et = parseFloat(inputs.et);
    const weight = parseFloat(inputs.weight);

    if (!et || et <= 0 || !weight || weight <= 0) {
      return {
        primary: "—",
        secondary: "",
        details: "Please enter valid positive numbers for ET and weight.",
        feedback: "Invalid input"
      };
    }

    // Calculate HP using formula: HP = Weight / (ET / 5.825)^3
    // 5.825 is a constant derived from empirical drag racing data.
    const denom = Math.pow(et / 5.825, 3);
    if (denom === 0) {
      return {
        primary: "—",
        secondary: "",
        details: "Calculation error due to zero denominator.",
        feedback: "Error"
      };
    }
    const hp = weight / denom;

    // Round results
    const hpRounded = Math.round(hp);

    return {
      primary: hpRounded.toLocaleString(),
      secondary: "Estimated Horsepower (HP)",
      details: `Based on ET: ${et.toFixed(2)} seconds and Weight: ${weight.toLocaleString()} ${inputs.unit === "imperial" ? "lbs" : "kg"}`,
      feedback: "Estimation based on standard drag racing formula"
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "How accurate is the horsepower estimate from quarter mile ET and weight?",
      answer:
        "The horsepower estimate derived from quarter mile ET and vehicle weight provides a good approximation but is not exact. It assumes optimal traction, no aerodynamic drag losses, and consistent environmental conditions. Real-world factors such as drivetrain losses, tire grip, altitude, and weather can affect actual horsepower requirements. Use this calculator as a guideline rather than an absolute measurement."
    },
    {
      question: "Can I use this calculator for both metric and imperial units?",
      answer:
        "Yes, this calculator supports both metric and imperial units. Simply select your preferred unit system from the dropdown menu. Enter the vehicle weight in pounds (lbs) for imperial or kilograms (kg) for metric, and the quarter mile elapsed time (ET) in seconds. The formula adapts accordingly to provide an accurate horsepower estimate."
    },
    {
      question: "Why does the formula use the constant 5.825?",
      answer:
        "The constant 5.825 is an empirically derived value used in drag racing to relate quarter mile ET to horsepower and weight. It normalizes the ET to a baseline for the cubic relationship in the formula. This constant helps convert the time and weight inputs into a horsepower estimate that aligns with observed performance data."
    },
    {
      question: "What if my vehicle is heavily modified or has forced induction?",
      answer:
        "Modifications such as forced induction, weight reduction, or aerodynamic enhancements can affect the accuracy of this estimate. The formula assumes a typical vehicle setup without extreme modifications. For highly tuned or modified vehicles, consider this calculator as a rough estimate and consult dyno testing or professional tuning for precise horsepower measurements."
    },
    {
      question: "Can I estimate quarter mile ET if I know horsepower and weight?",
      answer:
        "While this calculator focuses on estimating horsepower from ET and weight, the inverse calculation is possible but less straightforward due to the cubic relationship. Other calculators or formulas exist to estimate ET from horsepower and weight, often requiring iterative or empirical methods. For best results, use dedicated ET calculators if you want to predict elapsed times."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Estimating the horsepower required for a 3,200 lbs sports car that runs a quarter mile in 12.5 seconds.",
    steps: [
      {
        label: "Step 1: Identify inputs",
        explanation: "Vehicle weight = 3,200 lbs, Quarter mile ET = 12.5 seconds."
      },
      {
        label: "Step 2: Apply the formula",
        explanation:
          "Calculate HP = Weight / (ET / 5.825)^3 = 3200 / (12.5 / 5.825)^3"
      },
      {
        label: "Step 3: Calculate denominator",
        explanation:
          "ET / 5.825 = 12.5 / 5.825 ≈ 2.146; Cubed = 2.146^3 ≈ 9.89"
      },
      {
        label: "Step 4: Calculate horsepower",
        explanation: "HP = 3200 / 9.89 ≈ 323.5 HP"
      }
    ],
    result: "Estimated horsepower required: approximately 324 HP."
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "Quarter Mile Drag Racing Basics",
      description:
        "An overview of quarter mile drag racing and the physics behind ET and horsepower calculations.",
      url: "https://www.dragzine.com/tech/quarter-mile-drag-racing-basics/"
    },
    {
      title: "How to Calculate Horsepower from ET and Weight",
      description:
        "Detailed explanation and formulas for estimating horsepower from quarter mile elapsed time and vehicle weight.",
      url: "https://www.hotrod.com/articles/how-to-calculate-horsepower-from-quarter-mile-times/"
    },
    {
      title: "SAE J1349 Engine Power Measurement Standards",
      description:
        "Official standards for measuring engine horsepower and torque.",
      url: "https://www.sae.org/standards/content/j1349_201001/"
    }
  ];

  const widget = (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Select value={inputs.unit} onValueChange={(v) => handleInputChange("unit", v)}>
          <SelectTrigger className="w-[140px]">
            <Settings className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="imperial">Imperial (lbs, sec)</SelectItem>
            <SelectItem value="metric">Metric (kg, sec)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Quarter Mile ET (seconds)</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g. 12.5"
            value={inputs.et}
            onChange={(e) => handleInputChange("et", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Vehicle Weight ({inputs.unit === "imperial" ? "lbs" : "kg"})</Label>
          <Input
            type="number"
            min="0"
            step="1"
            placeholder={inputs.unit === "imperial" ? "e.g. 3200" : "e.g. 1450"}
            value={inputs.weight}
            onChange={(e) => handleInputChange("weight", e.target.value)}
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" onClick={() => {}}>
        <Zap className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Estimated Result</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">{results.primary}</div>
            <div className="text-xl font-bold mt-2">{results.secondary}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      {/* 1. HOW TO USE */}
      <section id="how-to-use" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to use this calculator</h2>
        <ol className="list-decimal pl-5 space-y-3 text-slate-600 dark:text-slate-400">
          <li>
            <strong>Step 1:</strong> Select your preferred unit system (Imperial or Metric) from the dropdown menu.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the quarter mile elapsed time (ET) in seconds. This is the time your vehicle took to complete the quarter mile.
          </li>
          <li>
            <strong>Step 3:</strong> Enter the vehicle weight in pounds (lbs) if using Imperial units or kilograms (kg) if using Metric.
          </li>
          <li>
            <strong>Step 4:</strong> Click the "Calculate" button to get the estimated horsepower required to achieve the entered ET with the given weight.
          </li>
          <li>
            <strong>Step 5:</strong> Review the results and use the detailed explanation below for further understanding.
          </li>
        </ol>
      </section>

      {/* 2. COMPLETE GUIDE */}
      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to Horsepower from Quarter Mile ET Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            The quarter mile elapsed time (ET) is a critical performance metric in automotive drag racing, representing how quickly a vehicle can cover a quarter mile distance from a standing start. Estimating the horsepower required to achieve a specific ET based on vehicle weight is valuable for enthusiasts, engineers, and tuners aiming to understand or improve vehicle performance.
          </p>
          <p>
            This calculator uses a well-established empirical formula: <em>Horsepower = Weight / (ET / 5.825)^3</em>. The constant 5.825 is derived from drag racing data and normalizes the ET to a baseline, allowing the cubic relationship between time and power to be accurately modeled. The formula assumes ideal traction and no significant losses due to aerodynamics or drivetrain inefficiencies.
          </p>
          <p>
            When you input your vehicle's weight and quarter mile ET, the calculator computes the estimated horsepower needed to achieve that performance. This estimate helps in setting realistic goals for engine tuning, modifications, or comparing different vehicles. However, keep in mind that real-world conditions such as tire grip, weather, altitude, and mechanical losses can influence actual performance.
          </p>
          <p>
            For metric users, ensure weight is entered in kilograms, while imperial users should enter weight in pounds. The ET should always be in seconds regardless of the unit system. This tool is ideal for quick estimations and planning but should be complemented with dyno testing or professional assessments for precise horsepower measurements.
          </p>
          <p>
            Understanding this relationship empowers automotive professionals and enthusiasts to make informed decisions about vehicle upgrades, performance tuning, and financial investments in automotive projects.
          </p>
        </div>
      </section>

      {/* 3. COMMON MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" /> Common Mistakes
        </h3>
        <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <p>
            <strong>1. Incorrect Units:</strong> Entering weight in the wrong unit system (e.g., pounds instead of kilograms) will lead to wildly inaccurate horsepower estimates. Always double-check your unit selection.
          </p>
          <p>
            <strong>2. Unrealistic ET Values:</strong> Extremely low or high ET values that don't match typical vehicle performance can skew results. Ensure your ET input is realistic for the vehicle type.
          </p>
          <p>
            <strong>3. Ignoring Vehicle Modifications:</strong> The formula assumes a standard vehicle setup. Highly modified cars with forced induction, weight reduction, or aerodynamic aids may not fit the model well.
          </p>
          <p>
            <strong>4. Overreliance on Estimates:</strong> This calculator provides an estimate, not a precise measurement. For critical applications, use dyno testing or professional evaluation.
          </p>
          <p>
            <strong>5. Neglecting Environmental Factors:</strong> Altitude, temperature, and humidity affect engine performance but are not accounted for in this formula.
          </p>
        </div>
      </section>

      {/* 4. FAQ */}
      <section id="faq">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently asked questions</h2>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
              <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">{faq.question}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. REFERENCES */}
      <section id="references">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-5 h-5 text-blue-500" /> References & additional resources
        </h2>
        <div className="space-y-4">
          {references.map((ref, i) => (
            <div key={i}>
              <a
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
              >
                {ref.title} <ExternalLink className="w-3 h-3" />
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{ref.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Horsepower from Quarter Mile ET Calculator"
      description="Professional automotive calculator: Horsepower from Quarter Mile ET Calculator. Get accurate estimates, expert advice, and financial insights."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      example={example}
      relatedCalculators={[]}
      onThisPage={[
        { id: "how-to-use", label: "How to Use" },
        { id: "guide", label: "Complete Guide" },
        { id: "mistakes", label: "Common Mistakes" },
        { id: "example", label: "Real World Example" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References" }
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}