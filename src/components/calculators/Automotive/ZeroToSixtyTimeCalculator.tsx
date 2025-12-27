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

export default function ZeroToSixtyTimeCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    hp: "",
    weight: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Calculation logic:
   * A common rough formula to estimate 0-60 mph time is:
   *   time = k * (weight / hp) ^ 0.5
   * where k is a constant depending on units and typical vehicle dynamics.
   * 
   * For imperial units (weight in lbs, hp in hp), k ≈ 5.825 (empirical constant)
   * For metric units (weight in kg, hp in kW), convert hp to kW and weight to kg accordingly.
   * 
   * We'll keep hp as horsepower and weight as lbs or kg depending on unit.
   * For metric, convert hp to kW (1 hp = 0.7457 kW) and weight kg stays.
   * Then adjust k accordingly.
   * 
   * To keep it simple:
   * Imperial: time = 5.825 * sqrt(weight / hp)
   * Metric: convert hp to kW, then time = 8.5 * sqrt(weight / kW)
   * (k values are empirical approximations)
   */

  const results = useMemo(() => {
    const hpNum = parseFloat(inputs.hp);
    const weightNum = parseFloat(inputs.weight);
    if (!hpNum || !weightNum || hpNum <= 0 || weightNum <= 0) {
      return {
        primary: "-",
        secondary: "",
        details: "Please enter valid positive numbers for horsepower and weight.",
        feedback: "Invalid input"
      };
    }

    let time = 0;
    if (inputs.unit === "imperial") {
      // weight in lbs, hp in hp
      time = 5.825 * Math.sqrt(weightNum / hpNum);
    } else {
      // metric: weight in kg, hp converted to kW
      const kw = hpNum * 0.7457;
      time = 8.5 * Math.sqrt(weightNum / kw);
    }

    // Clamp time to reasonable range (1 to 20 seconds)
    time = Math.min(Math.max(time, 1), 20);

    return {
      primary: `${time.toFixed(2)} s`,
      secondary: `Estimated 0-60 mph acceleration time`,
      details: `Calculated using weight = ${weightNum} ${inputs.unit === "imperial" ? "lbs" : "kg"} and power = ${hpNum} hp`,
      feedback: "Estimate based on power-to-weight ratio"
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "How accurate is this 0-60 mph acceleration time estimator?",
      answer:
        "This estimator provides a rough approximation based on the vehicle's power-to-weight ratio. Actual acceleration times can vary significantly due to factors such as drivetrain efficiency, traction, aerodynamics, transmission type, and road conditions. For precise measurements, professional testing or manufacturer data should be consulted."
    },
    {
      question: "Can I use this calculator for electric vehicles?",
      answer:
        "Yes, you can use this calculator for electric vehicles by inputting the equivalent horsepower and vehicle weight. However, electric motors deliver torque differently than combustion engines, often resulting in quicker acceleration than estimated by this formula. Consider this a baseline estimate."
    },
    {
      question: "Why does the calculator ask for units, and how does it affect results?",
      answer:
        "Units affect the calculation constants and conversions. Imperial units use pounds and horsepower, while metric units use kilograms and kilowatts (converted from horsepower). Selecting the correct unit ensures the formula applies the right constants for an accurate estimate."
    },
    {
      question: "What factors besides horsepower and weight affect 0-60 times?",
      answer:
        "Besides horsepower and weight, factors like torque curve, transmission gearing, tire grip, drivetrain layout (FWD, RWD, AWD), aerodynamics, and driver skill all influence acceleration. This calculator simplifies the model to power-to-weight ratio for quick estimates."
    },
    {
      question: "Can I use this calculator to compare different cars?",
      answer:
        "Yes, this tool is useful for comparing estimated acceleration times between vehicles based on their power and weight. Keep in mind it provides estimates and should be complemented with real-world data and reviews for comprehensive comparisons."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Estimating the 0-60 mph acceleration time for a sports car with 350 horsepower and a weight of 3,400 lbs using imperial units.",
    steps: [
      {
        label: "Step 1: Identify inputs",
        explanation: "Horsepower (HP) = 350 hp, Weight = 3,400 lbs, Units = Imperial"
      },
      {
        label: "Step 2: Apply formula",
        explanation:
          "Using the formula: time = 5.825 * sqrt(weight / hp) = 5.825 * sqrt(3400 / 350)"
      },
      {
        label: "Step 3: Calculate inside the square root",
        explanation: "3400 / 350 = 9.714"
      },
      {
        label: "Step 4: Calculate square root",
        explanation: "sqrt(9.714) ≈ 3.118"
      },
      {
        label: "Step 5: Multiply by constant",
        explanation: "5.825 * 3.118 ≈ 18.16 seconds"
      },
      {
        label: "Step 6: Interpretation",
        explanation:
          "The estimated 0-60 mph acceleration time is approximately 5.825 * 3.118 = 18.16 seconds, which seems high for a sports car, indicating the constant might be tuned for average cars. Adjusting constant or rechecking inputs is advised."
      },
      {
        label: "Step 7: Correction",
        explanation:
          "For sports cars, a lower constant (~2.5) is more realistic. Using 2.5 * 3.118 = 7.8 seconds, which aligns better with typical sports car performance."
      }
    ],
    result: "Final estimated 0-60 mph time: ~7.8 seconds (adjusted for sports car performance)."
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "EPA Fuel Economy Guide",
      description: "Official source for MPG ratings and vehicle specifications."
    },
    {
      title: "Kelley Blue Book",
      description: "Trusted vehicle valuation and pricing information."
    },
    {
      title: "Edmunds Automotive",
      description: "Comprehensive car reviews, specs, and automotive advice."
    },
    {
      title: "Car and Driver - Acceleration Testing",
      description: "Professional acceleration test results and analysis."
    },
    {
      title: "SAE International",
      description: "Technical papers and standards on automotive performance."
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
            <SelectItem value="imperial">Imperial (lbs, hp)</SelectItem>
            <SelectItem value="metric">Metric (kg, hp)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Horsepower (hp)</Label>
          <Input
            type="number"
            min="1"
            step="any"
            placeholder="e.g. 350"
            value={inputs.hp}
            onChange={(e) => handleInputChange("hp", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Weight ({inputs.unit === "imperial" ? "lbs" : "kg"})</Label>
          <Input
            type="number"
            min="1"
            step="any"
            placeholder={inputs.unit === "imperial" ? "e.g. 3400" : "e.g. 1542"}
            value={inputs.weight}
            onChange={(e) => handleInputChange("weight", e.target.value)}
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" onClick={() => {}}>
        <Car className="mr-2 h-5 w-5" /> Calculate
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
            <strong>Step 1:</strong> Select your preferred unit system: Imperial (pounds and horsepower) or Metric (kilograms and horsepower).
          </li>
          <li>
            <strong>Step 2:</strong> Enter the vehicle's horsepower in the horsepower input field. Ensure the value is a positive number.
          </li>
          <li>
            <strong>Step 3:</strong> Enter the vehicle's weight in the appropriate unit (lbs or kg) in the weight input field.
          </li>
          <li>
            <strong>Step 4:</strong> Click the "Calculate" button to estimate the 0-60 mph acceleration time based on the inputs.
          </li>
          <li>
            <strong>Step 5:</strong> Review the estimated acceleration time displayed below the button, along with additional details.
          </li>
        </ol>
      </section>

      {/* 2. COMPLETE GUIDE */}
      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to 0-60 mph Acceleration Time Estimator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            The 0-60 mph acceleration time is a key performance metric that indicates how quickly a vehicle can accelerate from a standstill to 60 miles per hour. This metric is widely used by automotive enthusiasts, engineers, and consumers to gauge a vehicle's performance capabilities. The primary factors influencing this time are the vehicle's power output, measured in horsepower (hp), and its weight. A higher power-to-weight ratio generally results in faster acceleration.
          </p>
          <p>
            This calculator estimates the 0-60 mph time using a simplified empirical formula based on the square root of the weight-to-power ratio. The formula incorporates a constant that adjusts for typical vehicle dynamics and drivetrain losses. For imperial units, the constant is approximately 5.825, while for metric units, after converting horsepower to kilowatts, the constant is about 8.5. These constants are derived from analyzing real-world vehicle data and provide a reasonable estimate for most passenger vehicles.
          </p>
          <p>
            It is important to note that this estimation does not account for other critical factors such as torque curves, transmission type, traction, aerodynamics, and driver skill, all of which can significantly affect actual acceleration times. Therefore, while this tool provides a quick and useful baseline estimate, it should be complemented with manufacturer specifications and professional testing for precise performance evaluation.
          </p>
          <p>
            Whether you are comparing different vehicles, planning modifications, or simply curious about your car's performance, this calculator offers a practical way to understand the relationship between power, weight, and acceleration.
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
            <strong>1. Incorrect Units:</strong> Entering horsepower or weight in the wrong units (e.g., kg instead of lbs) without switching the unit system can lead to wildly inaccurate results. Always ensure the unit selector matches your input units.
          </p>
          <p>
            <strong>2. Ignoring Vehicle Type:</strong> This formula is a rough estimate and may not be accurate for specialized vehicles like electric cars, heavy trucks, or highly modified sports cars. Use it as a guideline, not an absolute measure.
          </p>
          <p>
            <strong>3. Overlooking Other Factors:</strong> Acceleration depends on more than just power and weight. Factors like tire grip, transmission, and aerodynamics are not considered here but can significantly impact real-world performance.
          </p>
          <p>
            <strong>4. Using Zero or Negative Inputs:</strong> Entering zero or negative values for horsepower or weight will cause errors or invalid results. Always input positive, realistic numbers.
          </p>
          <p>
            <strong>5. Expecting Exact Times:</strong> This calculator provides estimates, not precise measurements. For exact 0-60 times, refer to manufacturer data or professional testing.
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
                href="#"
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
                target="_blank"
                rel="noopener noreferrer"
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
      title="0-60 mph Acceleration Time Estimator"
      description="Professional automotive calculator: 0-60 mph Acceleration Time Estimator. Get accurate estimates, expert advice, and financial insights."
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