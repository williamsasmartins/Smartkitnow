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

export default function SquareFootageCalculator() {
  /**
   * State holds dimensions input by user.
   * keys: length, width, shape (rectangle, circle, triangle, custom)
   * For custom shapes, user can input multiple segments (not implemented here for simplicity).
   */
  const [inputs, setInputs] = useState({
    shape: "rectangle",
    length: "",
    width: "",
    radius: "",
    base: "",
    height: "",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  /**
   * Calculate square footage based on shape and inputs.
   * Rectangle: length * width
   * Circle: π * radius²
   * Triangle: 0.5 * base * height
   * Returns value in square feet rounded to 2 decimals.
   */
  const results = useMemo(() => {
    const shape = inputs.shape;
    let sqft = 0;
    let warning = null;
    let formulaUsed = "";

    const parseNum = (val) => {
      const n = parseFloat(val);
      return isNaN(n) || n < 0 ? null : n;
    };

    if (shape === "rectangle") {
      const length = parseNum(inputs.length);
      const width = parseNum(inputs.width);
      if (length === null || width === null) {
        warning = "Please enter valid positive numbers for length and width.";
      } else {
        sqft = length * width;
        formulaUsed = "Square Footage = Length × Width";
      }
    } else if (shape === "circle") {
      const radius = parseNum(inputs.radius);
      if (radius === null) {
        warning = "Please enter a valid positive number for radius.";
      } else {
        sqft = Math.PI * radius * radius;
        formulaUsed = "Square Footage = π × Radius²";
      }
    } else if (shape === "triangle") {
      const base = parseNum(inputs.base);
      const height = parseNum(inputs.height);
      if (base === null || height === null) {
        warning = "Please enter valid positive numbers for base and height.";
      } else {
        sqft = 0.5 * base * height;
        formulaUsed = "Square Footage = 0.5 × Base × Height";
      }
    } else {
      warning = "Unsupported shape selected.";
    }

    const value = sqft > 0 ? sqft.toFixed(2) + " sq ft" : null;

    return { value, label: "Total Square Footage", subtext: formulaUsed, warning, formulaUsed };
  }, [inputs]);

  const faqs = [
    {
      question: "How do I calculate square footage for irregular shaped rooms?",
      answer: "Divide the irregular space into smaller rectangles, calculate each section separately, then add all areas together for total square footage.",
    },
    {
      question: "What's the difference between gross and net square footage?",
      answer: "Gross square footage includes all enclosed space, while net square footage excludes walls, mechanical rooms, and common areas.",
    },
    {
      question: "Can this calculator convert between square feet and square meters?",
      answer: "Yes, multiply square feet by 0.092903 to convert to square meters, or divide square meters by 0.092903 to get square feet.",
    },
    {
      question: "How accurate do my measurements need to be for this calculator?",
      answer: "Measurements within 0.5 inches are typically sufficient for most projects; professional real estate requires precision to 0.1 inches.",
    },
    {
      question: "Does this calculator account for angled or vaulted ceilings?",
      answer: "No, this calculator measures floor area only; angled ceilings require separate calculations based on actual wall heights.",
    },
    {
      question: "What units can I use when entering measurements?",
      answer: "Most square footage calculators accept feet and inches, or decimals of feet; verify your calculator's input format before starting.",
    },
    {
      question: "How do I calculate square footage for multiple rooms at once?",
      answer: "Calculate each room separately, then add all individual square footages together for total property square footage.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <div>
        <Label htmlFor="shape" className="mb-1 font-semibold flex items-center gap-1">
          Select Shape <Info className="w-4 h-4 text-blue-600" />
        </Label>
        <Select
          value={inputs.shape}
          onValueChange={(v) => setInputs({ shape: v, length: "", width: "", radius: "", base: "", height: "" })}
          aria-label="Shape selector"
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select shape" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rectangle">
              <Home className="mr-2 h-4 w-4 inline" />
              Rectangle
            </SelectItem>
            <SelectItem value="circle">
              <CircleIcon />
              Circle
            </SelectItem>
            <SelectItem value="triangle">
              <TriangleIcon />
              Triangle
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {inputs.shape === "rectangle" && (
        <>
          <div>
            <Label htmlFor="length" className="mb-1 font-semibold">
              Length (feet)
            </Label>
            <Input
              id="length"
              type="number"
              min={0}
              step="any"
              value={inputs.length}
              onChange={(e) => handleInputChange("length", e.target.value)}
              placeholder="Enter length in feet"
            />
          </div>
          <div>
            <Label htmlFor="width" className="mb-1 font-semibold">
              Width (feet)
            </Label>
            <Input
              id="width"
              type="number"
              min={0}
              step="any"
              value={inputs.width}
              onChange={(e) => handleInputChange("width", e.target.value)}
              placeholder="Enter width in feet"
            />
          </div>
        </>
      )}

      {inputs.shape === "circle" && (
        <div>
          <Label htmlFor="radius" className="mb-1 font-semibold">
            Radius (feet)
          </Label>
          <Input
            id="radius"
            type="number"
            min={0}
            step="any"
            value={inputs.radius}
            onChange={(e) => handleInputChange("radius", e.target.value)}
            placeholder="Enter radius in feet"
          />
        </div>
      )}

      {inputs.shape === "triangle" && (
        <>
          <div>
            <Label htmlFor="base" className="mb-1 font-semibold">
              Base (feet)
            </Label>
            <Input
              id="base"
              type="number"
              min={0}
              step="any"
              value={inputs.base}
              onChange={(e) => handleInputChange("base", e.target.value)}
              placeholder="Enter base length in feet"
            />
          </div>
          <div>
            <Label htmlFor="height" className="mb-1 font-semibold">
              Height (feet)
            </Label>
            <Input
              id="height"
              type="number"
              min={0}
              step="any"
              value={inputs.height}
              onChange={(e) => handleInputChange("height", e.target.value)}
              placeholder="Enter height in feet"
            />
          </div>
        </>
      )}

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // Trigger recalculation by setting inputs (no-op here as useMemo depends on inputs)
            setInputs((p) => ({ ...p }));
          }}
          aria-label="Calculate square footage"
        >
          <Home className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              shape: "rectangle",
              length: "",
              width: "",
              radius: "",
              base: "",
              height: "",
            })
          }
          className="flex-1 h-11"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.warning && (
        <Card className="border border-red-400 bg-red-50 dark:bg-red-900 dark:border-red-700 p-4">
          <CardContent className="text-center text-red-700 dark:text-red-300 font-semibold">
            <AlertTriangle className="mx-auto mb-2 h-6 w-6" />
            {results.warning}
          </CardContent>
        </Card>
      )}

      {results.value && !results.warning && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="mt-2 text-sm italic text-blue-700 dark:text-blue-300">{results.subtext}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Square Footage Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Square Footage Calculator helps you quickly determine the area of rectangular or square spaces by multiplying length times width. This tool is essential for home renovation, real estate valuation, flooring installation, and property assessment.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Start by measuring the length and width of your space in feet, or convert inches to decimals (e.g., 6 inches = 0.5 feet). Input both measurements into the calculator, selecting your preferred units from the dropdown menu.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The calculator instantly displays total square footage, which you can use for cost estimation, material ordering, or listing comparisons. For irregularly shaped areas, divide the space into rectangles, calculate each section, and add results together.</p>
        </div>
      </section>

      {/* TABLE: Average Room Square Footage by Type */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Average Room Square Footage by Type</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">These are typical residential room sizes used for estimation and planning purposes.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Room Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Range (sq ft)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Common Size (sq ft)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Master Bedroom</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200-400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">300</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Secondary Bedroom</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">120-200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">150</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Kitchen</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">150-300</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">220</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Living Room</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">250-450</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">350</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Bathroom</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35-100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Dining Room</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">180-300</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">240</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Garage (2-car)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">400-500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">450</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Laundry Room</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50-100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">75</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Actual sizes vary by home, region, and era of construction.</p>
      </section>

      {/* TABLE: Square Footage Requirements by Building Type */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Square Footage Requirements by Building Type</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Minimum square footage standards vary by building codes and zoning regulations.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Building Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Minimum (sq ft)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Recommended (sq ft)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Single-Family Home</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">900</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1500-2500</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Studio Apartment</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">300-400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">500</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1-Bedroom Apartment</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">600-750</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">850</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2-Bedroom Apartment</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">900-1100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1200</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Commercial Office</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">500 per person</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">150-200</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Retail Space</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1000 minimum</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2000-5000</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Warehouse</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5000 minimum</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10000-50000</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Restaurant</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2000 minimum</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3500-5000</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Requirements vary by local building codes and jurisdiction.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Measure from inside corner to inside corner to get usable square footage rather than exterior wall-to-wall measurements.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Round measurements to the nearest inch for residential projects, but use 0.1-inch precision for commercial real estate transactions.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Take measurements at multiple points along each wall since older homes may have slightly uneven walls that affect total area.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Photograph your measurements with a date stamp to verify calculations later and maintain records for contractors or appraisers.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Measuring Exterior Instead of Interior</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Always measure inside wall-to-wall dimensions to get accurate usable square footage; exterior measurements include wall thickness.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to Convert Inches to Decimals</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Convert inches to feet using decimals (e.g., 9 inches = 0.75 feet) rather than entering mixed units that the calculator cannot process.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Including Non-Livable Spaces</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Exclude wall cavities, mechanical closets, and crawl spaces from residential square footage calculations unless they are finished rooms.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Approximate Measurements</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Eyeballing distances or using room dimensions from listing documents instead of measuring yourself can lead to significant calculation errors.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate square footage for irregular shaped rooms?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Divide the irregular space into smaller rectangles, calculate each section separately, then add all areas together for total square footage.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between gross and net square footage?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Gross square footage includes all enclosed space, while net square footage excludes walls, mechanical rooms, and common areas.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can this calculator convert between square feet and square meters?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, multiply square feet by 0.092903 to convert to square meters, or divide square meters by 0.092903 to get square feet.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How accurate do my measurements need to be for this calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Measurements within 0.5 inches are typically sufficient for most projects; professional real estate requires precision to 0.1 inches.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does this calculator account for angled or vaulted ceilings?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">No, this calculator measures floor area only; angled ceilings require separate calculations based on actual wall heights.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What units can I use when entering measurements?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most square footage calculators accept feet and inches, or decimals of feet; verify your calculator's input format before starting.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate square footage for multiple rooms at once?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Calculate each room separately, then add all individual square footages together for total property square footage.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.ansi.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">ANSI Z765 Standard for Square Footage</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official American National Standards Institute guidelines for measuring residential square footage in real estate applications.</p>
          </li>
          <li>
            <a href="https://www.nar.realtor" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">National Association of REALTORS® Square Footage Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Industry standard practices for calculating and reporting square footage in property listings and appraisals.</p>
          </li>
          <li>
            <a href="https://www.iccsafe.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">International Building Code (IBC) Floor Area Requirements</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Building code standards that specify minimum square footage requirements for residential and commercial occupancies.</p>
          </li>
          <li>
            <a href="https://www.epa.gov" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">EPA Guidelines for Commercial Building Space Planning</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Federal guidelines covering square footage allocation per person for office, retail, and industrial building types.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  // Icons for shape selector (custom inline SVGs for circle and triangle)
  function CircleIcon() {
    return (
      <svg className="mr-2 h-4 w-4 inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
      </svg>
    );
  }
  function TriangleIcon() {
    return (
      <svg className="mr-2 h-4 w-4 inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2 L22 20 H2 Z" />
      </svg>
    );
  }

  return (
    <CalculatorVerticalLayout
      title="Square Footage Calculator"
      description="Calculate square footage for lawns and gardens. Measure the total area of your outdoor space for landscaping projects."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Methodology",
        formula:
          "Rectangle: Length × Width; Circle: π × Radius²; Triangle: 0.5 × Base × Height",
        variables: [
          { symbol: "Length", description: "Length of the rectangle in feet" },
          { symbol: "Width", description: "Width of the rectangle in feet" },
          { symbol: "Radius", description: "Radius of the circle in feet" },
          { symbol: "Base", description: "Base length of the triangle in feet" },
          { symbol: "Height", description: "Height of the triangle in feet" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "You want to calculate the square footage of a rectangular garden bed that measures 15 feet long and 10 feet wide.",
        steps: [
          {
            label: "Step 1",
            explanation: "Select 'Rectangle' as the shape in the calculator.",
          },
          {
            label: "Step 2",
            explanation: "Enter 15 for length and 10 for width in feet.",
          },
          {
            label: "Step 3",
            explanation: "Click 'Calculate' to get the total square footage.",
          },
        ],
        result: "The calculator will display 150.00 sq ft, which is the area of your garden bed.",
      }}
      relatedCalculators={[
        { title: "Room Air Changes per Hour (ACH) Calculator", url: "/everyday/room-air-changes-ach", icon: "💡" },
        { title: "Wine/Beer/Soft Drink Mix Estimator", url: "/everyday/beverage-mix-estimator", icon: "🎉" },
        { title: "Rainwater Barrel Days of Supply", url: "/everyday/rainwater-barrel-days-supply", icon: "💧" },
        { title: "MyPlate Daily Calorie/Nutrient Planner", url: "/everyday/myplate-daily-calorie-nutrient", icon: "❤️" },
        { title: "Refrigerator/Freezer Safe Zone Time Window", url: "/everyday/refrigerator-freezer-safe-zone-time-window", icon: "💡" },
        { title: "Home Paint Touch-Up Estimator", url: "/everyday/home-paint-touch-up", icon: "🏠" },
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