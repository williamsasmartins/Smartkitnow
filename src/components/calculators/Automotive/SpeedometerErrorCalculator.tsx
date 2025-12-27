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

export default function SpeedometerErrorCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    tire1Diameter: "",
    tire2Diameter: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Calculation Logic:
   * Speedometer error (%) = ((Diameter of Tire 2 - Diameter of Tire 1) / Diameter of Tire 1) * 100
   * 
   * Tire diameters must be in the same unit (inches or mm).
   * Tire diameter = (Tire section height * 2) + Wheel diameter
   * 
   * Inputs:
   * - Tire 1 diameter (inches or mm)
   * - Tire 2 diameter (inches or mm)
   * 
   * Output:
   * - Speedometer error percentage (positive means speedometer reads higher than actual)
   */

  const results = useMemo(() => {
    const d1 = parseFloat(inputs.tire1Diameter);
    const d2 = parseFloat(inputs.tire2Diameter);

    if (isNaN(d1) || isNaN(d2) || d1 <= 0) {
      return {
        primary: "N/A",
        secondary: "",
        details: "Please enter valid positive diameters for both tires.",
        feedback: "Invalid input"
      };
    }

    // Calculate percentage difference
    const diffPercent = ((d2 - d1) / d1) * 100;

    // Feedback based on typical speedometer error ranges
    let feedback = "";
    if (Math.abs(diffPercent) < 1) {
      feedback = "Speedometer error is minimal.";
    } else if (Math.abs(diffPercent) < 3) {
      feedback = "Speedometer error is within acceptable range.";
    } else {
      feedback = "Speedometer error is significant and may affect speed readings.";
    }

    return {
      primary: diffPercent.toFixed(2) + "%",
      secondary: diffPercent > 0
        ? "Speedometer reads faster than actual speed"
        : "Speedometer reads slower than actual speed",
      details: `Diameter Tire 1: ${d1.toFixed(2)} | Diameter Tire 2: ${d2.toFixed(2)}`,
      feedback
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "What causes speedometer error?",
      answer:
        "Speedometer error is primarily caused by differences in tire diameter between the original tires the vehicle was calibrated for and the tires currently fitted. Changes in tire size affect the rotation speed of the wheels, causing the speedometer to over- or under-report the actual speed."
    },
    {
      question: "How do I measure tire diameter correctly?",
      answer:
        "Tire diameter can be calculated by doubling the tire's sidewall height and adding the wheel diameter. The sidewall height is derived from the tire's aspect ratio and section width. Accurate measurements are essential to calculate speedometer error precisely."
    },
    {
      question: "Can speedometer error affect fuel economy readings?",
      answer:
        "Yes, since fuel economy calculations often rely on speed and distance data from the vehicle's sensors, an incorrect speedometer reading can lead to inaccurate fuel economy estimates."
    },
    {
      question: "Is it safe to drive with a speedometer error?",
      answer:
        "Minor speedometer errors are common and generally safe, but significant errors can lead to speeding unknowingly or driving too slowly, which may be unsafe or illegal. It's advisable to correct large discrepancies."
    },
    {
      question: "How can I correct speedometer error?",
      answer:
        "Speedometer error can be corrected by recalibrating the vehicle's speedometer, usually done via the vehicle's onboard computer or by installing a speedometer correction device. Alternatively, fitting tires that match the original specifications will minimize error."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "A driver replaces their original tires (diameter 26.0 inches) with larger tires (diameter 27.5 inches). They want to know the speedometer error caused by this change.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Identify the original tire diameter: 26.0 inches."
      },
      {
        label: "Step 2",
        explanation:
          "Identify the new tire diameter: 27.5 inches."
      },
      {
        label: "Step 3",
        explanation:
          "Calculate the difference: 27.5 - 26.0 = 1.5 inches."
      },
      {
        label: "Step 4",
        explanation:
          "Calculate the percentage difference: (1.5 / 26.0) * 100 = 5.77%."
      },
      {
        label: "Step 5",
        explanation:
          "Interpretation: The speedometer will read approximately 5.77% faster than the actual speed."
      }
    ],
    result:
      "Speedometer error = +5.77%. This means when the speedometer shows 60 mph, the actual speed is about 56.6 mph."
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "How Tire Size Affects Speedometer Accuracy",
      description:
        "An in-depth article explaining the relationship between tire size and speedometer readings.",
      url: "https://www.tirerack.com/tires/tiretech/techpage.jsp?techid=38"
    },
    {
      title: "Understanding Speedometer Error",
      description:
        "Technical guide on speedometer calibration and error sources.",
      url: "https://www.cars.com/articles/what-is-speedometer-error-1420680458704/"
    },
    {
      title: "Tire Size Calculator and Speedometer Correction",
      description:
        "Tool and explanation for calculating tire size differences and speedometer correction.",
      url: "https://www.1010tires.com/Tire-Size-Calculator"
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
            <SelectItem value="imperial">Imperial (inches)</SelectItem>
            <SelectItem value="metric">Metric (mm)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Tire 1 Diameter ({inputs.unit === "imperial" ? "inches" : "mm"})</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={inputs.tire1Diameter}
            onChange={(e) => handleInputChange("tire1Diameter", e.target.value)}
            placeholder="e.g. 26.0"
          />
        </div>
        <div className="space-y-2">
          <Label>Tire 2 Diameter ({inputs.unit === "imperial" ? "inches" : "mm"})</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={inputs.tire2Diameter}
            onChange={(e) => handleInputChange("tire2Diameter", e.target.value)}
            placeholder="e.g. 27.5"
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
            <p className="mt-2 italic text-sm text-slate-700 dark:text-slate-400">{results.feedback}</p>
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
            <strong>Step 1:</strong> Select your preferred unit system (Imperial for inches or Metric for millimeters).
          </li>
          <li>
            <strong>Step 2:</strong> Enter the diameter of your original tire (Tire 1) in the chosen unit.
          </li>
          <li>
            <strong>Step 3:</strong> Enter the diameter of the new or comparison tire (Tire 2) in the same unit.
          </li>
          <li>
            <strong>Step 4:</strong> Click the "Calculate" button to see the speedometer error percentage and interpretation.
          </li>
          <li>
            <strong>Step 5:</strong> Use the results to understand how your speedometer reading may be affected by tire size changes.
          </li>
        </ol>
      </section>

      {/* 2. COMPLETE GUIDE */}
      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to Speedometer Error
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Speedometer error occurs when the actual distance traveled by a vehicle differs from the distance assumed by the speedometer. This discrepancy is most commonly caused by changes in tire diameter. The speedometer is calibrated based on the original tire size specified by the manufacturer. When tires with a different diameter are installed, the number of wheel rotations per mile changes, leading to inaccurate speed readings.
          </p>
          <p>
            To calculate speedometer error, you need to know the diameters of both the original tire and the new tire. Tire diameter can be measured directly or calculated using the tire's specifications: section width, aspect ratio, and wheel diameter. The formula for tire diameter is: Diameter = (Section Height × 2) + Wheel Diameter. Section height is derived from the aspect ratio and section width. Once you have both diameters, the percentage difference between them indicates the speedometer error.
          </p>
          <p>
            A positive speedometer error means the speedometer reads faster than the actual speed, causing you to drive slower than the speedometer indicates. Conversely, a negative error means the speedometer reads slower, which can lead to unintentionally speeding. Understanding and correcting speedometer error is important for safety, legal compliance, and accurate fuel economy readings. If the error is significant, recalibration or tire size adjustment is recommended.
          </p>
          <p>
            This calculator simplifies the process by allowing you to input tire diameters directly and instantly see the speedometer error percentage. Whether you are upgrading tires, changing wheel sizes, or just curious, this tool provides a quick and reliable estimate to help you make informed decisions.
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
            <strong>1. Mixing units:</strong> Entering tire diameters in different units (e.g., Tire 1 in inches and Tire 2 in millimeters) will produce incorrect results. Always ensure both diameters are in the same unit system.
          </p>
          <p>
            <strong>2. Using tire width or aspect ratio instead of diameter:</strong> This calculator requires the overall tire diameter, not just width or aspect ratio. Use a tire size calculator if you only have tire specs.
          </p>
          <p>
            <strong>3. Ignoring tire wear and inflation:</strong> Actual tire diameter can vary due to wear, inflation pressure, and load. Measurements should be taken when tires are properly inflated and in good condition.
          </p>
          <p>
            <strong>4. Assuming speedometer error is always negative or positive:</strong> Depending on tire size changes, speedometer error can be either positive or negative. Always calculate to know the exact effect.
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
      title="Speedometer Error"
      description="Professional automotive calculator: Speedometer Error. Get accurate estimates, expert advice, and financial insights."
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