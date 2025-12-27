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

export default function TireSizeComparisonCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    tire1_width: "",
    tire1_aspect: "",
    tire1_diameter: "",
    tire2_width: "",
    tire2_aspect: "",
    tire2_diameter: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Tire size format: Width / Aspect Ratio R Diameter
   * Example: 225/45R17
   * 
   * Calculation of overall tire diameter (in inches):
   * Diameter = Wheel Diameter + 2 * Sidewall Height
   * Sidewall Height = (Width * Aspect Ratio) / 100
   * Width is in mm, convert sidewall height to inches: 1 inch = 25.4 mm
   * 
   * Overall Diameter (inches) = Wheel Diameter + 2 * (Width * Aspect Ratio / 100) / 25.4
   */

  const results = useMemo(() => {
    const {
      tire1_width,
      tire1_aspect,
      tire1_diameter,
      tire2_width,
      tire2_aspect,
      tire2_diameter,
    } = inputs;

    // Validate inputs
    if (
      !tire1_width || !tire1_aspect || !tire1_diameter ||
      !tire2_width || !tire2_aspect || !tire2_diameter
    ) {
      return {
        primary: "0%",
        details: "Please enter all tire specs.",
        feedback: "Incomplete input"
      };
    }

    const w1 = parseFloat(tire1_width);
    const a1 = parseFloat(tire1_aspect);
    const d1 = parseFloat(tire1_diameter);

    const w2 = parseFloat(tire2_width);
    const a2 = parseFloat(tire2_aspect);
    const d2 = parseFloat(tire2_diameter);

    if (
      isNaN(w1) || isNaN(a1) || isNaN(d1) ||
      isNaN(w2) || isNaN(a2) || isNaN(d2) ||
      w1 <= 0 || a1 <= 0 || d1 <= 0 ||
      w2 <= 0 || a2 <= 0 || d2 <= 0
    ) {
      return {
        primary: "0%",
        details: "Invalid input values.",
        feedback: "Check inputs"
      };
    }

    // Calculate overall diameter for Tire 1
    const sidewall1 = (w1 * a1) / 100 / 25.4; // inches
    const overallDiameter1 = d1 + 2 * sidewall1;

    // Calculate overall diameter for Tire 2
    const sidewall2 = (w2 * a2) / 100 / 25.4; // inches
    const overallDiameter2 = d2 + 2 * sidewall2;

    // Calculate percentage difference (Tire 2 relative to Tire 1)
    const diffPercent = ((overallDiameter2 - overallDiameter1) / overallDiameter1) * 100;

    // Feedback based on difference
    let feedback = "Standard range";
    const absDiff = Math.abs(diffPercent);
    if (absDiff > 5) {
      feedback = "Significant size difference - may affect speedometer and handling";
    } else if (absDiff > 3) {
      feedback = "Moderate size difference - check vehicle compatibility";
    }

    return {
      primary: `${diffPercent.toFixed(2)}%`,
      details: `Tire 1 Diameter: ${overallDiameter1.toFixed(2)} in, Tire 2 Diameter: ${overallDiameter2.toFixed(2)} in`,
      feedback
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "How do I interpret the percentage difference in tire size?",
      answer:
        "The percentage difference represents how much larger or smaller the overall diameter of Tire 2 is compared to Tire 1. A positive value means Tire 2 is larger, while a negative value means it is smaller. Differences beyond 3-5% can affect your vehicle's speedometer accuracy, handling, and clearance."
    },
    {
      question: "Why is it important to compare tire sizes before changing tires?",
      answer:
        "Tire size affects vehicle dynamics, speedometer readings, and safety. Using tires with significantly different diameters can cause inaccurate speed readings, affect ABS and traction control systems, and potentially cause rubbing or clearance issues. Always ensure new tires are compatible with your vehicle."
    },
    {
      question: "Can I mix tire sizes on the front and rear wheels?",
      answer:
        "Mixing tire sizes is common in performance or staggered setups but should be done carefully. The difference in diameter should be minimal to avoid handling issues. Always consult your vehicle manufacturer or a tire professional before mixing sizes."
    },
    {
      question: "What units are used in this calculator?",
      answer:
        "This calculator uses tire width in millimeters, aspect ratio as a percentage, and wheel diameter in inches, which is the standard tire size notation (e.g., 225/45R17). The output diameter is in inches for easy comparison."
    },
    {
      question: "How can I use this calculator for metric or imperial units?",
      answer:
        "Tire sizes are standardized globally with width in millimeters and diameter in inches. This calculator assumes this standard format. If you have tire sizes in other units, convert width to millimeters and diameter to inches before using the calculator."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "A car owner wants to compare their current tires sized 205/55R16 with a potential upgrade to 225/50R17 to understand the size difference and its impact.",
    steps: [
      {
        label: "Step 1: Calculate Tire 1 overall diameter",
        explanation:
          "Sidewall height = (205 mm * 55%) / 100 = 112.75 mm. Convert to inches: 112.75 / 25.4 = 4.44 inches. Overall diameter = 16 inches + 2 * 4.44 inches = 24.88 inches."
      },
      {
        label: "Step 2: Calculate Tire 2 overall diameter",
        explanation:
          "Sidewall height = (225 mm * 50%) / 100 = 112.5 mm. Convert to inches: 112.5 / 25.4 = 4.43 inches. Overall diameter = 17 inches + 2 * 4.43 inches = 25.86 inches."
      },
      {
        label: "Step 3: Calculate percentage difference",
        explanation:
          "Difference = ((25.86 - 24.88) / 24.88) * 100 = 3.95%. This means Tire 2 is approximately 3.95% larger in diameter than Tire 1."
      }
    ],
    result:
      "The 3.95% increase in tire diameter may slightly affect speedometer accuracy and vehicle handling. It is within a moderate range but should be checked for compatibility."
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "Tire Size Calculator - Tire Rack",
      description: "Comprehensive tool for tire size comparison and vehicle fitment.",
      url: "https://www.tirerack.com/tires/tiretech/techpage.jsp?techid=1"
    },
    {
      title: "Understanding Tire Sizes - Bridgestone",
      description: "Official guide explaining tire size notation and measurements.",
      url: "https://www.bridgestonetire.com/tread-and-trend/drivers-ed/tire-sizing"
    },
    {
      title: "How to Calculate Tire Diameter - ThoughtCo",
      description: "Step-by-step explanation of tire diameter calculation.",
      url: "https://www.thoughtco.com/how-to-calculate-tire-diameter-534813"
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
            <SelectItem value="metric">Metric</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Tire 1 Width (mm)</Label>
          <Input
            type="number"
            min={1}
            value={inputs.tire1_width}
            onChange={(e) => handleInputChange("tire1_width", e.target.value)}
            placeholder="e.g. 225"
          />
          <Label>Tire 1 Aspect Ratio (%)</Label>
          <Input
            type="number"
            min={1}
            max={100}
            value={inputs.tire1_aspect}
            onChange={(e) => handleInputChange("tire1_aspect", e.target.value)}
            placeholder="e.g. 45"
          />
          <Label>Tire 1 Wheel Diameter (inches)</Label>
          <Input
            type="number"
            min={1}
            value={inputs.tire1_diameter}
            onChange={(e) => handleInputChange("tire1_diameter", e.target.value)}
            placeholder="e.g. 17"
          />
        </div>

        <div className="space-y-2">
          <Label>Tire 2 Width (mm)</Label>
          <Input
            type="number"
            min={1}
            value={inputs.tire2_width}
            onChange={(e) => handleInputChange("tire2_width", e.target.value)}
            placeholder="e.g. 235"
          />
          <Label>Tire 2 Aspect Ratio (%)</Label>
          <Input
            type="number"
            min={1}
            max={100}
            value={inputs.tire2_aspect}
            onChange={(e) => handleInputChange("tire2_aspect", e.target.value)}
            placeholder="e.g. 40"
          />
          <Label>Tire 2 Wheel Diameter (inches)</Label>
          <Input
            type="number"
            min={1}
            value={inputs.tire2_diameter}
            onChange={(e) => handleInputChange("tire2_diameter", e.target.value)}
            placeholder="e.g. 18"
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" onClick={() => {}}>
        <Car className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Estimated Difference</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">{results.primary}</div>
            <p className="text-sm font-semibold mt-2">{results.feedback}</p>
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
            <strong>Step 1:</strong> Enter the tire width (in millimeters), aspect ratio (percentage), and wheel diameter (in inches) for Tire 1.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the same specifications for Tire 2 that you want to compare against Tire 1.
          </li>
          <li>
            <strong>Step 3:</strong> Click the "Calculate" button to see the percentage difference in overall tire diameter.
          </li>
          <li>
            <strong>Step 4:</strong> Review the results and feedback to understand if the size difference is within a safe and recommended range.
          </li>
        </ol>
      </section>

      {/* 2. COMPLETE GUIDE */}
      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to Tire Size Comparison
        </h2>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p>
            Tire size comparison is a crucial step when considering new tires for your vehicle. Tires are typically specified by three key numbers: width, aspect ratio, and wheel diameter. The width is the tire's cross-sectional width in millimeters, the aspect ratio is the height of the sidewall expressed as a percentage of the width, and the wheel diameter is the size of the wheel the tire fits, measured in inches. Understanding these numbers helps you calculate the overall diameter of the tire, which affects your vehicle's speedometer accuracy, handling, and clearance.
          </p>
          <p>
            To calculate the overall tire diameter, you add the wheel diameter to twice the sidewall height (since the tire has sidewalls on both top and bottom). The sidewall height is derived by multiplying the tire width by the aspect ratio and converting from millimeters to inches. This calculation provides a direct comparison between two tire sizes, allowing you to see how much larger or smaller one tire is relative to another.
          </p>
          <p>
            When the diameter difference exceeds 3-5%, it can lead to issues such as inaccurate speedometer readings, altered gear ratios, and potential rubbing against the vehicle’s body or suspension components. Therefore, it is essential to use this calculator to ensure that any new tire size you consider is compatible with your vehicle’s specifications and driving safety.
          </p>
          <p>
            This calculator is designed for standard tire size notation and assumes inputs in millimeters for width and aspect ratio, and inches for wheel diameter. Always consult your vehicle’s manual or a tire professional if you are unsure about changing tire sizes, especially if the difference is significant.
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
            <strong>1. Ignoring the aspect ratio:</strong> Many users only compare wheel diameters or widths, forgetting that the aspect ratio significantly affects the overall tire diameter.
          </p>
          <p>
            <strong>2. Mixing units:</strong> Tire width is in millimeters, but wheel diameter is in inches. Mixing these units without proper conversion leads to incorrect calculations.
          </p>
          <p>
            <strong>3. Overlooking vehicle compatibility:</strong> Even if the size difference seems small, it may not fit your vehicle due to clearance or suspension limitations.
          </p>
          <p>
            <strong>4. Assuming all tires with the same diameter are equal:</strong> Different tire brands and models may have slight variations in actual size despite identical nominal sizes.
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
      title="Tire Size Comparison"
      description="Professional automotive calculator: Tire Size Comparison. Get accurate estimates, expert advice, and financial insights."
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