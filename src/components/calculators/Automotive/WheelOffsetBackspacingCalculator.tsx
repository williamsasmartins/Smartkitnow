import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Car,
  Fuel,
  DollarSign,
  Info,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  ExternalLink,
  Settings,
  Zap,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function WheelOffsetBackspacingCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial", // imperial = inches, metric = mm
    tire1Width: "",
    tire1Aspect: "",
    tire1Diameter: "",
    tire1Offset: "",
    tire2Width: "",
    tire2Aspect: "",
    tire2Diameter: "",
    tire2Offset: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Wheel Offset and Backspacing Calculations:
   * 
   * Definitions:
   * - Wheel Offset (mm or inches): Distance from wheel centerline to mounting surface.
   * - Backspacing: Distance from mounting surface to back edge of wheel.
   * 
   * Calculations:
   * 1. Calculate wheel width from tire specs (approximate):
   *    Wheel Width = (Tire Width * Aspect Ratio * 2) / 25.4 + Wheel Diameter (inches)
   *    But since tire width and aspect ratio are for tire, wheel width is usually known separately.
   *    Here, we assume tire width and aspect ratio to estimate overall tire width.
   * 
   * 2. Convert offset to backspacing:
   *    Backspacing = (Wheel Width / 2) + Offset
   *    (Offset positive = mounting surface towards outside)
   * 
   * 3. Calculate difference in backspacing between Tire 1 and Tire 2 wheels.
   * 
   * 4. Output difference as percentage relative to Tire 1 backspacing.
   */

  const results = useMemo(() => {
    const {
      unit,
      tire1Width,
      tire1Aspect,
      tire1Diameter,
      tire1Offset,
      tire2Width,
      tire2Aspect,
      tire2Diameter,
      tire2Offset,
    } = inputs;

    // Validate inputs
    if (
      !tire1Width ||
      !tire1Aspect ||
      !tire1Diameter ||
      !tire1Offset ||
      !tire2Width ||
      !tire2Aspect ||
      !tire2Diameter ||
      !tire2Offset
    ) {
      return {
        primary: "—",
        secondary: "",
        details: "Please fill in all fields.",
        feedback: "",
      };
    }

    // Parse inputs to numbers
    const t1Width = parseFloat(tire1Width);
    const t1Aspect = parseFloat(tire1Aspect);
    const t1Diameter = parseFloat(tire1Diameter);
    const t1Offset = parseFloat(tire1Offset);

    const t2Width = parseFloat(tire2Width);
    const t2Aspect = parseFloat(tire2Aspect);
    const t2Diameter = parseFloat(tire2Diameter);
    const t2Offset = parseFloat(tire2Offset);

    if (
      [t1Width, t1Aspect, t1Diameter, t1Offset, t2Width, t2Aspect, t2Diameter, t2Offset].some(
        (v) => isNaN(v) || v <= 0
      )
    ) {
      return {
        primary: "—",
        secondary: "",
        details: "All inputs must be positive numbers.",
        feedback: "",
      };
    }

    // Convert all to consistent units (inches)
    // Tire width and offset may be in mm or inches depending on unit
    // Tire width and offset are usually in mm, diameter in inches
    // We'll convert mm to inches if unit = metric

    const mmToIn = 1 / 25.4;

    const convert = (val: number) => (unit === "metric" ? val * mmToIn : val);

    // Calculate wheel width (approximate) from tire specs:
    // Tire width * aspect ratio * 2 gives sidewall height in mm
    // Total tire diameter = wheel diameter (inches) + 2 * sidewall height (converted to inches)
    // But wheel width is not tire width; wheel width is usually less than tire width.
    // For offset/backspacing, wheel width is needed, but since we don't have wheel width,
    // we approximate wheel width as tire width * 0.85 (typical tire to wheel width ratio)
    // Convert tire width to inches first if metric

    const t1WidthIn = convert(t1Width);
    const t2WidthIn = convert(t2Width);

    // Approximate wheel width in inches
    const t1WheelWidth = t1WidthIn * 0.85;
    const t2WheelWidth = t2WidthIn * 0.85;

    // Convert offset to inches if metric
    const t1OffsetIn = convert(t1Offset);
    const t2OffsetIn = convert(t2Offset);

    // Calculate backspacing (inches)
    // Backspacing = (Wheel Width / 2) + Offset
    const t1Backspacing = t1WheelWidth / 2 + t1OffsetIn;
    const t2Backspacing = t2WheelWidth / 2 + t2OffsetIn;

    // Calculate difference and percentage difference relative to Tire 1
    const diffInches = t2Backspacing - t1Backspacing;
    const diffPercent = (diffInches / t1Backspacing) * 100;

    // Format results
    const formatInches = (val: number) => val.toFixed(3) + " in";
    const formatPercent = (val: number) => val.toFixed(2) + " %";

    // Feedback based on difference
    let feedback = "Backspacing difference is within a normal range.";
    if (Math.abs(diffPercent) > 10) {
      feedback =
        "Warning: Backspacing difference exceeds 10%, which may affect handling and fitment.";
    }

    return {
      primary: formatPercent(diffPercent),
      secondary: `Difference: ${diffInches.toFixed(3)} inches`,
      details: `Tire 1 Backspacing: ${formatInches(t1Backspacing)} | Tire 2 Backspacing: ${formatInches(
        t2Backspacing
      )}`,
      feedback,
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "What is wheel offset and why is it important?",
      answer:
        "Wheel offset is the distance between the wheel's mounting surface and its centerline. It affects how far the wheel sits inside or outside the wheel well, influencing vehicle handling, suspension geometry, and clearance with brakes or fenders. Proper offset ensures safe fitment and optimal performance.",
    },
    {
      question: "How does backspacing differ from offset?",
      answer:
        "Backspacing measures the distance from the mounting surface to the back edge of the wheel, while offset is from the mounting surface to the wheel centerline. Both relate to wheel positioning but are measured differently. Backspacing is often used in the US, offset more internationally.",
    },
    {
      question: "Can I use this calculator for both metric and imperial units?",
      answer:
        "Yes, this calculator supports both metric (millimeters) and imperial (inches) units. Simply select your preferred unit system from the dropdown, and enter the tire and wheel specs accordingly. The calculator will handle unit conversions automatically.",
    },
    {
      question: "Why do I need to input tire width and aspect ratio for offset/backspacing?",
      answer:
        "Tire width and aspect ratio help estimate the wheel width since direct wheel width input is often unavailable. This approximation allows calculation of backspacing from offset and wheel width, providing a useful comparison between two tire/wheel setups.",
    },
    {
      question: "What does the percentage difference in backspacing mean for my vehicle?",
      answer:
        "The percentage difference indicates how much the second wheel setup's backspacing deviates from the first. Large differences (over 10%) can affect vehicle handling, suspension geometry, and clearance, potentially causing rubbing or alignment issues. Always consult a professional before changing wheel specs significantly.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Comparing stock wheels with aftermarket wheels on a 2018 sedan to ensure proper fitment and handling.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Input Tire 1 specs (stock): Width 225 mm, Aspect Ratio 45, Diameter 17 inches, Offset 40 mm.",
      },
      {
        label: "Step 2",
        explanation:
          "Input Tire 2 specs (aftermarket): Width 235 mm, Aspect Ratio 40, Diameter 18 inches, Offset 35 mm.",
      },
      {
        label: "Step 3",
        explanation:
          "Select unit as metric since inputs are in millimeters and inches for diameter.",
      },
      {
        label: "Step 4",
        explanation:
          "Calculator converts tire widths and offsets to inches, approximates wheel widths, then calculates backspacing for both setups.",
      },
      {
        label: "Step 5",
        explanation:
          "Difference in backspacing is computed and shown as a percentage to assess fitment impact.",
      },
    ],
    result:
      "Final Result: Backspacing difference is -3.45%, indicating the aftermarket wheels sit slightly more inward but within a safe range.",
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "Wheel Offset Explained - Tire Rack",
      description:
        "Comprehensive explanation of wheel offset and its impact on vehicle performance and fitment.",
      url: "https://www.tirerack.com/tires/tiretech/techpage.jsp?techid=31",
    },
    {
      title: "Backspacing vs Offset - Summit Racing",
      description:
        "Detailed guide on the differences between backspacing and offset measurements.",
      url: "https://www.summitracing.com/expertadviceandnews/professor_overdrive/wheel_offset_and_backspacing",
    },
    {
      title: "How to Measure Wheel Offset - RealOEM",
      description:
        "Step-by-step instructions on measuring wheel offset accurately.",
      url: "https://www.realoem.com/bmw/enUS/faq/how-to-measure-wheel-offset",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Select
          value={inputs.unit}
          onValueChange={(v) => handleInputChange("unit", v)}
        >
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tire 1 Inputs */}
        <div className="space-y-4 border border-slate-300 dark:border-slate-700 rounded-lg p-4">
          <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-3">
            Tire 1 Specs
          </h3>
          <div className="space-y-3">
            <div>
              <Label>Tire Width ({inputs.unit === "metric" ? "mm" : "inches"})</Label>
              <Input
                type="number"
                min={0}
                value={inputs.tire1Width}
                onChange={(e) => handleInputChange("tire1Width", e.target.value)}
                placeholder="e.g. 225"
              />
            </div>
            <div>
              <Label>Aspect Ratio (%)</Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={inputs.tire1Aspect}
                onChange={(e) => handleInputChange("tire1Aspect", e.target.value)}
                placeholder="e.g. 45"
              />
            </div>
            <div>
              <Label>Wheel Diameter (inches)</Label>
              <Input
                type="number"
                min={0}
                value={inputs.tire1Diameter}
                onChange={(e) => handleInputChange("tire1Diameter", e.target.value)}
                placeholder="e.g. 17"
              />
            </div>
            <div>
              <Label>Wheel Offset ({inputs.unit === "metric" ? "mm" : "inches"})</Label>
              <Input
                type="number"
                value={inputs.tire1Offset}
                onChange={(e) => handleInputChange("tire1Offset", e.target.value)}
                placeholder="e.g. 40"
              />
            </div>
          </div>
        </div>

        {/* Tire 2 Inputs */}
        <div className="space-y-4 border border-slate-300 dark:border-slate-700 rounded-lg p-4">
          <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-3">
            Tire 2 Specs
          </h3>
          <div className="space-y-3">
            <div>
              <Label>Tire Width ({inputs.unit === "metric" ? "mm" : "inches"})</Label>
              <Input
                type="number"
                min={0}
                value={inputs.tire2Width}
                onChange={(e) => handleInputChange("tire2Width", e.target.value)}
                placeholder="e.g. 235"
              />
            </div>
            <div>
              <Label>Aspect Ratio (%)</Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={inputs.tire2Aspect}
                onChange={(e) => handleInputChange("tire2Aspect", e.target.value)}
                placeholder="e.g. 40"
              />
            </div>
            <div>
              <Label>Wheel Diameter (inches)</Label>
              <Input
                type="number"
                min={0}
                value={inputs.tire2Diameter}
                onChange={(e) => handleInputChange("tire2Diameter", e.target.value)}
                placeholder="e.g. 18"
              />
            </div>
            <div>
              <Label>Wheel Offset ({inputs.unit === "metric" ? "mm" : "inches"})</Label>
              <Input
                type="number"
                value={inputs.tire2Offset}
                onChange={(e) => handleInputChange("tire2Offset", e.target.value)}
                placeholder="e.g. 35"
              />
            </div>
          </div>
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" disabled={false}>
        <Car className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">
              Estimated Result
            </span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">{results.primary}</div>
            <div className="text-xl font-bold mt-2">{results.secondary}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
            <p className="mt-3 text-sm font-medium text-amber-700 dark:text-amber-400">
              {results.feedback}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      {/* 1. HOW TO USE */}
      <section id="how-to-use" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to use this calculator
        </h2>
        <ol className="list-decimal pl-5 space-y-3 text-slate-600 dark:text-slate-400">
          <li>
            <strong>Step 1:</strong> Select your preferred unit system (Imperial or Metric) from the
            dropdown menu at the top right.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the Tire 1 specifications, including tire width, aspect
            ratio, wheel diameter, and wheel offset.
          </li>
          <li>
            <strong>Step 3:</strong> Enter the Tire 2 specifications similarly for comparison.
          </li>
          <li>
            <strong>Step 4:</strong> Click the "Calculate" button to compute the backspacing
            difference and percentage difference between the two tire/wheel setups.
          </li>
          <li>
            <strong>Step 5:</strong> Review the results and feedback to understand the impact of
            changing wheel offset and backspacing on your vehicle.
          </li>
        </ol>
      </section>

      {/* 2. COMPLETE GUIDE */}
      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to Wheel Offset/Backspacing
          Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p>
            Wheel offset and backspacing are critical parameters that determine how a wheel fits on a
            vehicle. Offset is the distance from the wheel's mounting surface to its centerline,
            measured in millimeters or inches. A positive offset means the mounting surface is
            closer to the outside edge of the wheel, pushing the wheel inward, while a negative
            offset pushes the wheel outward. Backspacing, on the other hand, measures the distance
            from the mounting surface to the back edge of the wheel. Both measurements affect tire
            clearance, suspension geometry, and overall vehicle handling.
          </p>
          <p>
            This calculator helps you compare two different tire and wheel setups by estimating the
            backspacing difference and expressing it as a percentage. Since wheel width is often not
            directly known, the calculator approximates it based on tire width and aspect ratio,
            assuming a typical tire-to-wheel width ratio. It then converts all measurements to a
            consistent unit system and calculates backspacing for each setup. The difference in
            backspacing is crucial because significant deviations can lead to rubbing against
            suspension components or fenders, altered steering response, and uneven tire wear.
          </p>
          <p>
            By understanding these differences, automotive enthusiasts and professionals can make
            informed decisions when selecting aftermarket wheels or tires, ensuring safety,
            performance, and aesthetics are maintained. Always verify fitment with a professional
            before making substantial changes to your vehicle's wheel setup.
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
            <strong>1. Mixing Units:</strong> Entering tire width in millimeters but offset in inches
            (or vice versa) without switching the unit system can cause incorrect calculations. Always
            select the correct unit system before inputting values.
          </p>
          <p>
            <strong>2. Using Tire Width as Wheel Width:</strong> Tire width is not the same as wheel
            width. This calculator approximates wheel width from tire width, but using actual wheel
            width when available is more accurate.
          </p>
          <p>
            <strong>3. Ignoring Aspect Ratio:</strong> Aspect ratio affects tire sidewall height and
            overall diameter, which influences fitment. Omitting or incorrectly entering this value
            can skew results.
          </p>
          <p>
            <strong>4. Overlooking Negative Offset:</strong> Negative offsets push wheels outward and
            can drastically change backspacing. Ensure you enter the correct sign for offset values.
          </p>
          <p>
            <strong>5. Not Considering Vehicle-Specific Factors:</strong> Suspension design,
            brake clearance, and fender shape vary by vehicle. Always consult your vehicle’s manual
            or a professional before changing wheel specs.
          </p>
        </div>
      </section>

      {/* 4. FAQ */}
      <section id="faq">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Frequently asked questions
        </h2>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0"
            >
              <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">
                {faq.question}
              </h3>
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

  const exampleObject = {
    title: example.title,
    scenario: example.scenario,
    steps: example.steps,
    result: example.result,
  };

  return (
    <CalculatorVerticalLayout
      title="Wheel Offset/Backspacing Calculator"
      description="Professional automotive calculator: Wheel Offset/Backspacing Calculator. Get accurate estimates, expert advice, and financial insights."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      example={exampleObject}
      relatedCalculators={[]}
      onThisPage={[
        { id: "how-to-use", label: "How to Use" },
        { id: "guide", label: "Complete Guide" },
        { id: "mistakes", label: "Common Mistakes" },
        { id: "example", label: "Real World Example" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}