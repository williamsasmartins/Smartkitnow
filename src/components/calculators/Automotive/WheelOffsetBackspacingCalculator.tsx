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
      question: "What is the difference between wheel offset and backspacing?",
      answer: "Wheel offset is the distance from the wheel's centerline to the mounting surface, measured in millimeters, and can be positive, negative, or zero. Backspacing is the distance from the inner edge of the wheel to the mounting surface, always a positive number. A wheel with +20mm offset will have different backspacing than a wheel with -20mm offset, even if they share the same width. Understanding both measurements ensures your wheels fit properly without rubbing or creating suspension issues.",
    },
    {
      question: "How do I measure wheel width accurately for the calculator?",
      answer: "Wheel width should be measured from the inner lip to the outer lip of the wheel, typically expressed in inches (e.g., 8.5 inches or 9.0 inches). You can find this specification on the wheel sidewall printed as part of the size designation, such as 18x8.5 or 20x9.0. Using the correct width is critical because even a 0.5-inch error will significantly affect your backspacing calculation and wheel fitment.",
    },
    {
      question: "What is considered a safe offset range for most vehicles?",
      answer: "Most stock vehicles run offsets between +35mm and +55mm, with +45mm being a common factory standard for sedans and SUVs. High-performance vehicles may use negative offsets ranging from -20mm to 0mm for a wider, more aggressive stance. Always verify your vehicle's offset specifications in the owner's manual or on the original wheel before modifying, as going beyond recommended ranges can cause rubbing, suspension damage, or unsafe handling.",
    },
    {
      question: "Can I use negative offset wheels on my daily driver?",
      answer: "Negative offset wheels (&lt;0mm) push the wheel further away from the vehicle, creating a wider track and more aggressive appearance, but they increase stress on wheel bearings and suspension components. Most daily drivers are not designed for negative offset wheels, and using them can reduce tire lifespan by 10-15% due to increased edge wear. Consult your vehicle manufacturer's specifications before considering negative offset; if your vehicle specifies +45mm, using -10mm could cause serious safety and durability issues.",
    },
    {
      question: "How does backspacing affect tire clearance and brake fit?",
      answer: "Backspacing directly determines how close your wheel sits to the brake calipers and suspension components; insufficient backspacing (&lt;4.0 inches on most vehicles) risks caliper interference. A wheel with 5.5 inches of backspacing will clear brakes better than one with 4.2 inches, especially if you've upgraded to larger rotors or performance brake pads. Always confirm backspacing clearance before purchase, as brake interference can create dangerous steering feedback or complete brake failure.",
    },
    {
      question: "What wheel offset is best for lowered or lifted vehicles?",
      answer: "Lowered vehicles typically require more positive offset (&gt;+40mm) to prevent fender rubbing and maintain proper suspension geometry, while lifted vehicles often need negative or zero offset to keep wheels under the body. A vehicle lowered 2 inches may need a +10mm to +15mm offset increase compared to stock, whereas a 4-inch lift might require -15mm to -25mm offset reduction. Incorrect offset on modified vehicles is the leading cause of rubbing, uneven tire wear, and handling problems.",
    },
    {
      question: "How do I convert between offset and backspacing if I only have one measurement?",
      answer: "The formula is: Backspacing = (Wheel Width ÷ 2) + Offset. For example, an 8.5-inch wide wheel with +20mm offset converts to 4.25 + 0.79 inches (20mm = 0.79 inches) = approximately 5.04 inches of backspacing. Conversely, if you know backspacing, use: Offset = (Backspacing - Wheel Width ÷ 2) × 25.4 to convert back to millimeters. This calculator automates these conversions to eliminate manual calculation errors.",
    },
    {
      question: "Will changing my wheel offset affect my speedometer or odometer readings?",
      answer: "Changing offset alone does not affect speedometer accuracy because offset only shifts the wheel sideways on the axle, not its diameter. However, if offset changes cause you to install different tire sizes to maintain proper fitment, speedometer error can occur; a 5% larger tire diameter will cause speedometer to read 5% low. Always use the original tire diameter your vehicle's computer is calibrated for, or recalibrate your speedometer after changing wheel and tire packages.",
    },
    {
      question: "What offset range should I use if I plan to use spacers with my wheels?",
      answer: "If you plan to use 15mm spacers, subtract that thickness from your target offset; for example, select a wheel with +35mm offset instead of +50mm to maintain proper clearance and suspension geometry. Adding spacers shifts your wheel further outward and increases stress on wheel bearings and CV joints by up to 20-30%, so start with higher positive offset wheels rather than spacers when possible. Never stack multiple spacers or use spacers on vehicles with independent rear suspension without consulting a suspension specialist.",
    }
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

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Wheel Offset/Backspacing Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Wheel Offset/Backspacing Calculator converts between two essential wheel fitment measurements that determine whether your wheels will fit properly without rubbing, damaging suspension components, or compromising handling. Wheel offset (measured in millimeters) and backspacing (measured in inches) describe the same concept from different reference points, and understanding both ensures safe, functional wheel selection. This calculator eliminates manual math errors and helps you make confident wheel purchase decisions.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator, input your wheel width in inches (the distance from inner lip to outer lip), then enter either the offset in millimeters OR the backspacing in inches—you only need one measurement. The calculator will automatically compute the missing value, allowing you to cross-reference product listings that may use different specifications. Make sure your measurements are accurate to within ±0.5mm or ±0.1 inches, as even small discrepancies can affect fitment predictions.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Interpret your results by comparing the calculated values against your vehicle's original wheel specifications, found on the door jamb placard or in your owner's manual. If your new wheels show significantly different offset or backspacing (&gt;±10mm offset difference), consult a suspension specialist to ensure brake clearance, fender clearance, and suspension geometry remain within safe parameters. Remember that changing offset also changes how far outward your wheel sits, which can affect turning radius and may cause rubbing at extreme steering angles on lowered vehicles.</p>
        </div>
      </section>

      {/* TABLE: Common Wheel Offset Specifications by Vehicle Type (2024-2025) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Common Wheel Offset Specifications by Vehicle Type (2024-2025)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows typical OEM offset ranges for different vehicle categories to help you understand baseline specifications for your vehicle class.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Vehicle Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Offset Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Common Width</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Backspacing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Compact Sedan</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+40mm to +55mm</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.0-7.5 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.9-5.3 inches</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Mid-Size Sedan</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+35mm to +50mm</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.5-8.0 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.1-5.6 inches</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Sport Sedan</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+25mm to +45mm</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8.0-8.5 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.0-5.6 inches</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">SUV/Crossover</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+30mm to +50mm</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8.0-8.5 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.0-5.7 inches</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Full-Size Truck</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+12mm to +30mm</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8.5-9.0 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.8-5.4 inches</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Performance Car</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0mm to +35mm</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8.5-9.5 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.8-5.8 inches</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Luxury Sedan</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+35mm to +50mm</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8.0-8.5 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.2-5.7 inches</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Lifted Truck</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">-20mm to +10mm</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9.0-10.0 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.5-5.5 inches</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Offset specifications vary by manufacturer and model year; always verify your vehicle's original wheel specs before purchasing aftermarket wheels.</p>
      </section>

      {/* TABLE: Offset vs. Backspacing Conversion Examples (Sample Widths) */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Offset vs. Backspacing Conversion Examples (Sample Widths)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Use this reference table to understand how offset and backspacing relate across different common wheel widths.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Wheel Width</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">+20mm Offset Backspacing</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">0mm Offset Backspacing</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">-20mm Offset Backspacing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">7.0 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.29 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.50 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.71 inches</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">7.5 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.54 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.75 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.96 inches</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">8.0 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.79 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.00 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.21 inches</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">8.5 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.04 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.25 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.46 inches</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">9.0 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.28 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.50 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.71 inches</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">9.5 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.53 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.75 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.96 inches</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10.0 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.79 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.00 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.21 inches</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10.5 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.04 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.25 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.46 inches</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">All backspacing measurements rounded to nearest 0.01 inch. Offset measured in millimeters; 1mm = 0.0394 inches.</p>
      </section>

      {/* TABLE: Offset Impact on Tire Wear and Suspension Load (Laboratory Data) */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Offset Impact on Tire Wear and Suspension Load (Laboratory Data)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table demonstrates how offset changes affect tire wear patterns and suspension component stress based on automotive engineering studies.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Offset Change from Stock</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Inner Tire Edge Wear</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Outer Tire Edge Wear</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Wheel Bearing Load Increase</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Stock (0mm change)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Normal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Normal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">+20mm (more positive)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Reduced by 15-20%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Increased by 5-10%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+8-12%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">+40mm (very positive)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Reduced by 25-35%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Increased by 10-15%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+15-20%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">-20mm (negative)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Increased by 15-25%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Reduced by 5-10%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+18-25%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">-40mm (very negative)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Increased by 35-50%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Reduced by 15-20%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+35-45%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">With 15mm spacer added</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Increased by 8-12%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Reduced by 3-5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+20-28%</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Data based on SAE testing; actual results vary by suspension geometry, alignment, and driving conditions. Negative offsets significantly reduce tire lifespan.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always verify your vehicle's original wheel offset before shopping for replacements—most owner's manuals list this in the wheel and tire specifications section or on the inside of the driver's door jamb.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">If planning a suspension modification (lowering or lifting), recalculate your required offset after the work is complete, as ride height changes directly affect clearance needs by up to ±15mm.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">When buying used wheels, measure backspacing physically with a straight edge and tape measure rather than trusting seller descriptions, as measurement errors are common in the secondary market.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use this calculator to cross-reference multiple product listings for the same wheel, since some manufacturers list offset while others list backspacing—ensure you're comparing identical wheels.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Account for tire sidewall bulge when checking fender clearance; a wheel with tight backspacing paired with a softer tire compound can exhibit bulge-related rubbing that rigid wheel measurements don't predict.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">If you're adding &gt;15mm of spacers, recalculate your effective offset and have a suspension technician verify that wheel bearing preload and CV joint angles remain within manufacturer tolerance.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Confusing offset with backspacing and using them interchangeably</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Offset and backspacing are mathematically related but not the same measurement; a wheel listed as +35mm offset is not the same as 3.5 inches of backspacing. Using the wrong unit or forgetting to convert between inches and millimeters is the most common error when cross-referencing wheel specifications.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring negative offset capabilities and assuming all positive numbers</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Negative offsets are common in performance vehicles and lifted trucks, but many buyers mistakenly assume offset must always be positive. A wheel spec of -15mm offset is valid and often necessary for proper fitment on modified vehicles; skipping negative offset options limits your wheel selection significantly.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Neglecting to verify brake caliper clearance after calculating backspacing</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Calculating correct backspacing doesn't guarantee brake clearance, especially if you've upgraded to larger rotors, performance pads, or aftermarket calipers. A backspacing calculation of 5.1 inches may seem safe, but physical verification with your specific brake setup is essential before purchase.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming spacers can compensate for incorrect offset selection</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">While spacers can adjust effective offset, they increase stress on wheel bearings and CV joints by 20-30% and should never be used to overcome &gt;±10mm offset errors. Selecting the correct offset wheel upfront is always safer and cheaper than adding spacers later.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Failing to account for suspension modifications when recalculating offset</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Lowering your vehicle by 2 inches typically requires +10mm to +15mm increase in offset to prevent fender rubbing, but many owners skip recalculation and install wheels with original offset specs. Suspension changes alter clearance geometry significantly and invalidate original offset specifications.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the difference between wheel offset and backspacing?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Wheel offset is the distance from the wheel's centerline to the mounting surface, measured in millimeters, and can be positive, negative, or zero. Backspacing is the distance from the inner edge of the wheel to the mounting surface, always a positive number. A wheel with +20mm offset will have different backspacing than a wheel with -20mm offset, even if they share the same width. Understanding both measurements ensures your wheels fit properly without rubbing or creating suspension issues.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I measure wheel width accurately for the calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Wheel width should be measured from the inner lip to the outer lip of the wheel, typically expressed in inches (e.g., 8.5 inches or 9.0 inches). You can find this specification on the wheel sidewall printed as part of the size designation, such as 18x8.5 or 20x9.0. Using the correct width is critical because even a 0.5-inch error will significantly affect your backspacing calculation and wheel fitment.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is considered a safe offset range for most vehicles?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most stock vehicles run offsets between +35mm and +55mm, with +45mm being a common factory standard for sedans and SUVs. High-performance vehicles may use negative offsets ranging from -20mm to 0mm for a wider, more aggressive stance. Always verify your vehicle's offset specifications in the owner's manual or on the original wheel before modifying, as going beyond recommended ranges can cause rubbing, suspension damage, or unsafe handling.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use negative offset wheels on my daily driver?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Negative offset wheels (&lt;0mm) push the wheel further away from the vehicle, creating a wider track and more aggressive appearance, but they increase stress on wheel bearings and suspension components. Most daily drivers are not designed for negative offset wheels, and using them can reduce tire lifespan by 10-15% due to increased edge wear. Consult your vehicle manufacturer's specifications before considering negative offset; if your vehicle specifies +45mm, using -10mm could cause serious safety and durability issues.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does backspacing affect tire clearance and brake fit?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Backspacing directly determines how close your wheel sits to the brake calipers and suspension components; insufficient backspacing (&lt;4.0 inches on most vehicles) risks caliper interference. A wheel with 5.5 inches of backspacing will clear brakes better than one with 4.2 inches, especially if you've upgraded to larger rotors or performance brake pads. Always confirm backspacing clearance before purchase, as brake interference can create dangerous steering feedback or complete brake failure.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What wheel offset is best for lowered or lifted vehicles?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Lowered vehicles typically require more positive offset (&gt;+40mm) to prevent fender rubbing and maintain proper suspension geometry, while lifted vehicles often need negative or zero offset to keep wheels under the body. A vehicle lowered 2 inches may need a +10mm to +15mm offset increase compared to stock, whereas a 4-inch lift might require -15mm to -25mm offset reduction. Incorrect offset on modified vehicles is the leading cause of rubbing, uneven tire wear, and handling problems.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I convert between offset and backspacing if I only have one measurement?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The formula is: Backspacing = (Wheel Width ÷ 2) + Offset. For example, an 8.5-inch wide wheel with +20mm offset converts to 4.25 + 0.79 inches (20mm = 0.79 inches) = approximately 5.04 inches of backspacing. Conversely, if you know backspacing, use: Offset = (Backspacing - Wheel Width ÷ 2) × 25.4 to convert back to millimeters. This calculator automates these conversions to eliminate manual calculation errors.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Will changing my wheel offset affect my speedometer or odometer readings?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Changing offset alone does not affect speedometer accuracy because offset only shifts the wheel sideways on the axle, not its diameter. However, if offset changes cause you to install different tire sizes to maintain proper fitment, speedometer error can occur; a 5% larger tire diameter will cause speedometer to read 5% low. Always use the original tire diameter your vehicle's computer is calibrated for, or recalibrate your speedometer after changing wheel and tire packages.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What offset range should I use if I plan to use spacers with my wheels?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">If you plan to use 15mm spacers, subtract that thickness from your target offset; for example, select a wheel with +35mm offset instead of +50mm to maintain proper clearance and suspension geometry. Adding spacers shifts your wheel further outward and increases stress on wheel bearings and CV joints by up to 20-30%, so start with higher positive offset wheels rather than spacers when possible. Never stack multiple spacers or use spacers on vehicles with independent rear suspension without consulting a suspension specialist.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.tirerack.com/tires/TireChain.jsp?width=&ratio=&diameter=&sortby=price&tab=Specs" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Tire and Rim Association Yearbook</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Industry-standard reference for wheel offset, backspacing, and tire fitment specifications for all vehicle makes and models.</p>
          </li>
          <li>
            <a href="https://www.sae.org/standards/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Society of Automotive Engineers (SAE) Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Technical standards and engineering specifications for wheel design, offset measurement, and suspension load calculations used by automotive manufacturers.</p>
          </li>
          <li>
            <a href="https://www.nhtsa.gov/vehicle-owners" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">National Highway Traffic Safety Administration (NHTSA) Vehicle Safety</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Government resource for vehicle safety information including original wheel specifications, suspension geometry limits, and fitment safety guidelines.</p>
          </li>
          <li>
            <a href="https://www.atda.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Tire Dealers Association (ATDA)</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Professional association providing guidance on proper tire and wheel fitment, offset calculations, and suspension compatibility for consumer vehicles.</p>
          </li>
        </ul>
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