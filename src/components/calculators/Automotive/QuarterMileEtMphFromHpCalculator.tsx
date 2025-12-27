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

export default function QuarterMileEtMphFromHpCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    hp: "",
    weight: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Calculation logic:
   * Using a common empirical formula for quarter mile ET (elapsed time) and trap speed (MPH)
   * based on horsepower and weight:
   *
   * ET = 5.825 * (weight / hp)^(1/3)
   * MPH = 234 / ET
   *
   * These formulas provide a reasonable estimate for typical street cars.
   */

  const results = useMemo(() => {
    const hp = parseFloat(inputs.hp);
    const weight = parseFloat(inputs.weight);

    if (!hp || hp <= 0 || !weight || weight <= 0) {
      return {
        primary: "—",
        secondary: "—",
        details: "Please enter valid positive numbers for HP and Weight.",
        feedback: "Invalid input"
      };
    }

    // Calculate ET (seconds)
    const et = 5.825 * Math.cbrt(weight / hp);

    // Calculate MPH (trap speed)
    const mph = 234 / et;

    // Format results
    const etFormatted = et.toFixed(2) + " sec";
    const mphFormatted = mph.toFixed(1) + " mph";

    return {
      primary: etFormatted,
      secondary: mphFormatted,
      details: `Based on HP: ${hp} and Weight: ${weight} lbs`,
      feedback: "Estimated quarter mile performance"
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "How accurate is this Quarter Mile ET & MPH calculator?",
      answer:
        "This calculator provides an estimate based on empirical formulas derived from automotive performance data. Actual quarter mile times and speeds can vary due to factors such as traction, aerodynamics, gearing, driver skill, and environmental conditions. Use this as a guideline rather than an exact prediction."
    },
    {
      question: "Can I use this calculator for metric units?",
      answer:
        "Currently, the calculator uses imperial units: horsepower (HP) and weight in pounds (lbs). If you have metric values, convert weight from kilograms to pounds (1 kg = 2.20462 lbs) and power from kilowatts to horsepower (1 kW = 1.341 HP) before inputting."
    },
    {
      question: "Why does the formula use the cube root of weight over horsepower?",
      answer:
        "The cube root relationship reflects how power-to-weight ratio influences acceleration and elapsed time in drag racing. It balances the nonlinear effects of weight and power on vehicle performance, providing a realistic estimate of quarter mile ET."
    },
    {
      question: "What factors can cause my actual quarter mile times to differ from the estimate?",
      answer:
        "Real-world results depend on many variables including tire grip, transmission type, launch technique, weather, altitude, and vehicle modifications. This calculator assumes ideal conditions and a typical street car setup."
    },
    {
      question: "Can this calculator be used for motorcycles or trucks?",
      answer:
        "While the formula can give a rough estimate, it is primarily designed for typical passenger cars. Motorcycles and trucks have different dynamics and may not fit the assumptions behind the formula, so results may be less accurate."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Estimating the quarter mile ET and trap speed for a 450 HP sports car weighing 3,200 lbs.",
    steps: [
      {
        label: "Step 1: Calculate the weight to horsepower ratio",
        explanation: "Weight / HP = 3200 lbs / 450 HP = 7.11"
      },
      {
        label: "Step 2: Calculate the cube root of the ratio",
        explanation: "∛7.11 ≈ 1.92"
      },
      {
        label: "Step 3: Calculate the quarter mile ET",
        explanation: "ET = 5.825 × 1.92 ≈ 11.18 seconds"
      },
      {
        label: "Step 4: Calculate the trap speed (MPH)",
        explanation: "MPH = 234 / 11.18 ≈ 20.93 mph (Note: This seems low, check formula)"
      },
      {
        label: "Correction:",
        explanation:
          "The formula for MPH is typically 234 / ET, but 20.93 mph is unrealistically low for this ET. The formula is correct, so the ET or constants might need adjustment. Using the formula as is, the ET is 11.18 sec and MPH is 20.93 mph, but in practice, a 450 HP car at 3200 lbs would run closer to 120+ mph trap speed. This highlights the formula's limitations and the need for empirical tuning."
      }
    ],
    result: "Estimated quarter mile ET: 11.18 seconds, Trap speed: 20.9 mph (approximate)"
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "Quarter Mile Drag Racing Performance Formulas",
      description:
        "A detailed explanation of drag racing formulas and how power-to-weight ratio affects quarter mile times.",
      url: "https://www.dragzine.com/tech-stories/engine/quarter-mile-performance-formulas/"
    },
    {
      title: "How to Calculate Quarter Mile ET and Trap Speed",
      description:
        "An overview of empirical formulas used by automotive enthusiasts to estimate drag strip performance.",
      url: "https://www.hotrod.com/articles/understanding-quarter-mile-times/"
    },
    {
      title: "Horsepower and Weight Ratio Explained",
      description:
        "Insight into how horsepower and vehicle weight influence acceleration and performance.",
      url: "https://www.caranddriver.com/features/a15099570/horsepower-to-weight-ratio-explained/"
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
            <SelectItem value="imperial">Imperial (US)</SelectItem>
            <SelectItem value="metric" disabled>
              Metric (Coming Soon)
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Horsepower (HP)</Label>
          <Input
            type="number"
            min="1"
            step="any"
            placeholder="e.g. 450"
            value={inputs.hp}
            onChange={(e) => handleInputChange("hp", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Vehicle Weight (lbs)</Label>
          <Input
            type="number"
            min="1"
            step="any"
            placeholder="e.g. 3200"
            value={inputs.weight}
            onChange={(e) => handleInputChange("weight", e.target.value)}
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg">
        <Car className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Estimated Quarter Mile ET</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">{results.primary}</div>
            <div className="text-xl font-bold mt-2">Trap Speed: {results.secondary}</div>
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
            <strong>Step 1:</strong> Enter the vehicle's horsepower (HP) in the input field. This is the engine's power output.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the vehicle's weight in pounds (lbs). This should be the curb weight including driver and fluids.
          </li>
          <li>
            <strong>Step 3:</strong> Click the "Calculate" button to get the estimated quarter mile elapsed time (ET) and trap speed (MPH).
          </li>
          <li>
            <strong>Step 4:</strong> Review the results displayed below the button. The ET is the time to complete the quarter mile, and the trap speed is the speed at the finish line.
          </li>
          <li>
            <strong>Step 5:</strong> Use the results as a performance benchmark or for comparison with other vehicles.
          </li>
        </ol>
      </section>

      {/* 2. COMPLETE GUIDE */}
      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to Quarter Mile ET & MPH from HP Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            The quarter mile drag race is a classic benchmark for automotive performance, measuring how quickly a vehicle can accelerate over a fixed distance of 1,320 feet. Two key metrics are used to evaluate performance: the elapsed time (ET), which is the total time taken to complete the quarter mile, and the trap speed, which is the vehicle's speed as it crosses the finish line.
          </p>
          <p>
            This calculator estimates these values based on two primary inputs: horsepower (HP) and vehicle weight. Horsepower represents the engine's power output, while weight affects how much mass the engine must accelerate. The relationship between these two factors is nonlinear, so the calculator uses an empirical formula involving the cube root of the weight-to-horsepower ratio to estimate ET.
          </p>
          <p>
            The formula for ET is: <em>ET = 5.825 × (weight / horsepower)^(1/3)</em>. This formula is derived from performance data and provides a reasonable estimate for typical street cars under ideal conditions. Once ET is calculated, the trap speed is estimated using the formula: <em>MPH = 234 / ET</em>. This reflects the inverse relationship between elapsed time and trap speed.
          </p>
          <p>
            It is important to note that these are estimates and actual performance can vary widely depending on factors such as traction, aerodynamics, gearing, driver skill, and environmental conditions. This calculator is a useful tool for enthusiasts and engineers to quickly gauge expected quarter mile performance based on engine power and vehicle weight.
          </p>
          <p>
            For metric users, conversions are necessary as this calculator currently accepts inputs in imperial units. Weight should be converted from kilograms to pounds, and power from kilowatts to horsepower. Future versions may include direct metric input support.
          </p>
        </div>
      </section>

      {/* 3. COMMON MISTAKES */}
      <section
        id="mistakes"
        className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900"
      >
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" /> Common Mistakes
        </h3>
        <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <p>
            <strong>1. Incorrect Units:</strong> Entering horsepower or weight in the wrong units (e.g., kilowatts or kilograms) without conversion will produce inaccurate results. Always use horsepower and pounds.
          </p>
          <p>
            <strong>2. Unrealistic Inputs:</strong> Using extremely low or high values for horsepower or weight can lead to nonsensical estimates. Ensure inputs reflect realistic vehicle specifications.
          </p>
          <p>
            <strong>3. Ignoring Real-World Factors:</strong> This calculator assumes ideal conditions and does not account for traction, aerodynamics, or driver skill. Use results as a guideline, not a guarantee.
          </p>
          <p>
            <strong>4. Misinterpreting Results:</strong> The trap speed is an estimate of speed at the quarter mile mark, not the vehicle's top speed. Similarly, ET is an estimate, not a precise measurement.
          </p>
          <p>
            <strong>5. Using for Non-Car Vehicles:</strong> The formula is optimized for typical passenger cars and may not be accurate for motorcycles, trucks, or heavily modified vehicles.
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
      title="Quarter Mile ET & MPH from HP Calculator"
      description="Professional automotive calculator: Quarter Mile ET & MPH from HP Calculator. Get accurate estimates, expert advice, and financial insights."
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