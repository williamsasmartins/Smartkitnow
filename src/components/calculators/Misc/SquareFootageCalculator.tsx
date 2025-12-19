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
      question: "What is square footage and why is it important?",
      answer:
        "Square footage is a measurement of area expressed in square feet, commonly used to quantify the size of a space such as a room, lawn, or garden. It is essential for planning construction, landscaping, or purchasing materials to ensure accurate estimates and budgeting.",
    },
    {
      question: "How do I measure irregularly shaped areas?",
      answer:
        "For irregular shapes, break down the area into simpler shapes like rectangles, triangles, and circles, calculate each area separately, then sum them up. This approach increases accuracy and helps in precise material estimation.",
    },
    {
      question: "Can this calculator handle units other than feet?",
      answer:
        "This calculator is designed for measurements in feet. If you have measurements in other units like meters or inches, convert them to feet before inputting to ensure accurate results.",
    },
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
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding Square Footage Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Square footage is a fundamental measurement used in construction, landscaping, and real estate to quantify the size of a given area. This calculator helps you determine the total square footage of various shapes commonly found in outdoor spaces such as lawns, gardens, patios, or rooms. By accurately measuring and calculating square footage, you can estimate material needs, costs, and project scope with confidence. This tool supports multiple shapes including rectangles, circles, and triangles, reflecting the diversity of real-world spaces.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this calculator is straightforward and designed for accuracy. First, select the shape that best matches the area you want to measure. Then, input the required dimensions in feet, such as length and width for rectangles or radius for circles. After entering your measurements, click the "Calculate" button to see the total square footage. If you make a mistake or want to start over, use the "Reset" button to clear all inputs.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Choose the shape of your area (Rectangle, Circle, or Triangle).
          </li>
          <li>
            <strong>Step 2:</strong> Enter the dimensions in feet. Ensure values are positive numbers.
          </li>
          <li>
            <strong>Step 3:</strong> Click "Calculate" to get the square footage.
          </li>
          <li>
            <strong>Step 4:</strong> Use the result to plan materials, costs, or project scope.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Professional Tips & Safety</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          For the most accurate square footage calculations, always measure your space carefully using a reliable tape measure or laser distance measurer. When measuring irregular areas, break them down into simpler shapes and calculate each separately before summing. Double-check your measurements to avoid costly errors in material ordering. Additionally, consider safety when measuring outdoor spaces—wear appropriate footwear and be cautious of uneven terrain or obstacles. Finally, keep in mind that square footage calculations are estimates and may vary slightly due to measurement precision.
        </p>
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References & Additional Resources</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
          For further reading and verification, please refer to these authoritative sources:
        </p>
        <ul className="space-y-4">
          <li>
            <a
              href="https://www.energy.gov/eere/buildings/articles/how-calculate-square-footage-your-home"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              How to Calculate Square Footage of Your Home - Energy.gov <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Official guidelines from the U.S. Department of Energy on measuring square footage for homes, including tips for accuracy and common pitfalls.
            </p>
          </li>
          <li>
            <a
              href="https://extension.umn.edu/yard-and-garden-news/how-measure-your-yard"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              How to Measure Your Yard - University of Minnesota Extension <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              A comprehensive guide on measuring outdoor spaces accurately for landscaping and gardening projects.
            </p>
          </li>
          <li>
            <a
              href="https://www.epa.gov/green-infrastructure/green-infrastructure-site-assessment"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Green Infrastructure Site Assessment - EPA <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Environmental Protection Agency resource detailing site measurement and assessment techniques for sustainable landscaping.
            </p>
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
        { title: "Room Air Changes per Hour (ACH) Calculator", url: "/everyday-life/room-air-changes-ach", icon: "💡" },
        { title: "Wine/Beer/Soft Drink Mix Estimator", url: "/everyday-life/beverage-mix-estimator", icon: "🎉" },
        { title: "Rainwater Barrel Days of Supply", url: "/everyday-life/rainwater-barrel-days-supply", icon: "💧" },
        { title: "MyPlate Daily Calorie/Nutrient Planner", url: "/everyday-life/myplate-daily-calorie-nutrient", icon: "❤️" },
        { title: "Refrigerator/Freezer Safe Zone Time Window", url: "/everyday-life/refrigerator-freezer-safe-zone-time-window", icon: "💡" },
        { title: "Home Paint Touch-Up Estimator", url: "/everyday-life/home-paint-touch-up", icon: "🏠" },
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