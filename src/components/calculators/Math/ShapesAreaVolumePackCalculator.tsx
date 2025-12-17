import { useState, useMemo, useCallback } from "react";
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
import {
  Sigma,
  Calculator,
  RotateCcw,
  Info,
  AlertTriangle,
  FunctionSquare,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

const SHAPES = [
  {
    key: "square",
    label: "Square (2D)",
    inputs: [{ name: "side", label: "Side Length", unit: "units" }],
    formulas: {
      area: (side: number) => side * side,
      volume: null,
      formulaUsed: "Area = side²",
    },
  },
  {
    key: "rectangle",
    label: "Rectangle (2D)",
    inputs: [
      { name: "length", label: "Length", unit: "units" },
      { name: "width", label: "Width", unit: "units" },
    ],
    formulas: {
      area: (length: number, width: number) => length * width,
      volume: null,
      formulaUsed: "Area = length × width",
    },
  },
  {
    key: "circle",
    label: "Circle (2D)",
    inputs: [{ name: "radius", label: "Radius", unit: "units" }],
    formulas: {
      area: (radius: number) => Math.PI * radius * radius,
      volume: null,
      formulaUsed: "Area = π × radius²",
    },
  },
  {
    key: "triangle",
    label: "Triangle (2D)",
    inputs: [
      { name: "base", label: "Base", unit: "units" },
      { name: "height", label: "Height", unit: "units" },
    ],
    formulas: {
      area: (base: number, height: number) => 0.5 * base * height,
      volume: null,
      formulaUsed: "Area = ½ × base × height",
    },
  },
  {
    key: "cube",
    label: "Cube (3D)",
    inputs: [{ name: "side", label: "Side Length", unit: "units" }],
    formulas: {
      area: (side: number) => 6 * side * side,
      volume: (side: number) => side * side * side,
      formulaUsed: "Surface Area = 6 × side², Volume = side³",
    },
  },
  {
    key: "cylinder",
    label: "Cylinder (3D)",
    inputs: [
      { name: "radius", label: "Radius", unit: "units" },
      { name: "height", label: "Height", unit: "units" },
    ],
    formulas: {
      area: (radius: number, height: number) =>
        2 * Math.PI * radius * (radius + height),
      volume: (radius: number, height: number) =>
        Math.PI * radius * radius * height,
      formulaUsed:
        "Surface Area = 2πr(r + h), Volume = πr²h",
    },
  },
  {
    key: "sphere",
    label: "Sphere (3D)",
    inputs: [{ name: "radius", label: "Radius", unit: "units" }],
    formulas: {
      area: (radius: number) => 4 * Math.PI * radius * radius,
      volume: (radius: number) => (4 / 3) * Math.PI * radius * radius * radius,
      formulaUsed:
        "Surface Area = 4πr², Volume = (4/3)πr³",
    },
  },
  {
    key: "cone",
    label: "Cone (3D)",
    inputs: [
      { name: "radius", label: "Radius", unit: "units" },
      { name: "height", label: "Height", unit: "units" },
      { name: "slantHeight", label: "Slant Height", unit: "units" },
    ],
    formulas: {
      area: (radius: number, height: number, slantHeight: number) =>
        Math.PI * radius * (radius + slantHeight),
      volume: (radius: number, height: number) =>
        (1 / 3) * Math.PI * radius * radius * height,
      formulaUsed:
        "Surface Area = πr(r + l), Volume = (1/3)πr²h",
    },
  },
];

function isValidNumber(value: any) {
  if (value === undefined || value === null) return false;
  if (typeof value === "string" && value.trim() === "") return false;
  const num = Number(value);
  return !isNaN(num) && isFinite(num) && num >= 0;
}

export default function ShapesAreaVolumePackCalculator() {
  const [shapeKey, setShapeKey] = useState("square");
  const [inputs, setInputs] = useState<Record<string, string>>({});

  const handleInputChange = useCallback((name: string, value: string) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  const selectedShape = useMemo(() => {
    return SHAPES.find((s) => s.key === shapeKey) || SHAPES[0];
  }, [shapeKey]);

  const parsedInputs = useMemo(() => {
    const parsed: Record<string, number> = {};
    for (const input of selectedShape.inputs) {
      const val = inputs[input.name];
      parsed[input.name] = isValidNumber(val) ? Number(val) : NaN;
    }
    return parsed;
  }, [inputs, selectedShape]);

  const results = useMemo(() => {
    // Validate inputs
    const invalidInputs = selectedShape.inputs.filter(
      (input) => !isValidNumber(inputs[input.name])
    );
    if (invalidInputs.length > 0) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: `Please enter valid non-negative numbers for all inputs.`,
        formulaUsed: "",
      };
    }

    // Extract values for formulas
    const vals = selectedShape.inputs.map((input) => parsedInputs[input.name]);

    // Calculate area and volume if possible
    let area: number | null = null;
    let volume: number | null = null;

    try {
      if (selectedShape.formulas.area) {
        area = selectedShape.formulas.area(...vals);
      }
      if (selectedShape.formulas.volume) {
        volume = selectedShape.formulas.volume(...vals);
      }
    } catch {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: "Calculation error. Please check your inputs.",
        formulaUsed: "",
      };
    }

    // Format results with precision
    const areaStr =
      area !== null && !isNaN(area)
        ? area.toFixed(4)
        : null;
    const volumeStr =
      volume !== null && !isNaN(volume)
        ? volume.toFixed(4)
        : null;

    // Compose result label and value
    let value = "";
    let label = "";
    let subtext = "";
    if (areaStr && volumeStr) {
      value = `${areaStr} units² / ${volumeStr} units³`;
      label = "Surface Area / Volume";
      subtext = "Units squared for area, units cubed for volume.";
    } else if (areaStr) {
      value = `${areaStr} units²`;
      label = "Area";
    } else if (volumeStr) {
      value = `${volumeStr} units³`;
      label = "Volume";
    } else {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: "Unable to calculate area or volume with given inputs.",
        formulaUsed: "",
      };
    }

    return {
      value,
      label,
      subtext,
      warning: null,
      formulaUsed: selectedShape.formulas.formulaUsed,
    };
  }, [inputs, parsedInputs, selectedShape]);

  const faqs = [
    {
      question: "How do I calculate the area of a circle?",
      answer:
        "To calculate the area of a circle, use the formula Area = π × radius². Measure the radius of the circle, square it, then multiply by the constant π (approximately 3.1416). This gives the total surface area enclosed by the circle.",
    },
    {
      question: "What is the difference between surface area and volume?",
      answer:
        "Surface area measures the total area covering the outside of a 3D shape, expressed in square units. Volume measures the amount of space inside the shape, expressed in cubic units. For example, a cube's surface area is the sum of all its faces, while its volume is the space it occupies.",
    },
    {
      question: "Why do some shapes require slant height for surface area?",
      answer:
        "Shapes like cones have curved surfaces. The slant height is the distance from the base edge to the apex along the side, which helps calculate the lateral surface area accurately. Without the slant height, the curved surface area cannot be determined precisely.",
    },
    {
      question: "Can I use this tool for irregular shapes?",
      answer:
        "This calculator is designed for standard 2D and 3D shapes with known formulas. For irregular shapes, you may need to break them down into simpler shapes or use specialized methods not covered here.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Shape Selector */}
      <div>
        <Label htmlFor="shape-select" className="mb-2 font-semibold flex items-center gap-2">
          <FunctionSquare className="w-5 h-5 text-blue-600" />
          Select Shape
        </Label>
        <Select
          id="shape-select"
          value={shapeKey}
          onValueChange={(val) => {
            setShapeKey(val);
            setInputs({});
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a shape" />
          </SelectTrigger>
          <SelectContent>
            {SHAPES.map((shape) => (
              <SelectItem key={shape.key} value={shape.key}>
                {shape.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {selectedShape.inputs.map(({ name, label, unit }) => (
          <div key={name}>
            <Label htmlFor={name} className="mb-1 font-medium flex items-center gap-1">
              {label} ({unit})
              <Info className="w-4 h-4 text-slate-400" />
            </Label>
            <Input
              id={name}
              type="number"
              min="0"
              step="any"
              value={inputs[name] || ""}
              onChange={(e) => handleInputChange(name, e.target.value)}
              placeholder={`Enter ${label.toLowerCase()}`}
              aria-label={label}
            />
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just triggers recalculation via state update, no extra logic needed
            setInputs((prev) => ({ ...prev }));
          }}
          aria-label="Calculate"
        >
          <Sigma className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({})}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" role="region" aria-live="polite">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                {results.formulaUsed || "Calculated Result"}
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">{results.label}</p>
              {results.subtext && <p className="text-sm text-slate-500 mt-2">{results.subtext}</p>}
              {results.warning && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-950 border border-red-200 rounded-lg flex items-start gap-3 text-left">
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800 dark:text-red-200">{results.warning}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding 2D/3D Shapes Area & Volume Pack
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Geometry is a fundamental branch of mathematics that deals with shapes, sizes, and the properties of space. Understanding the area and volume of various 2D and 3D shapes is essential in fields ranging from architecture to engineering and everyday problem-solving. This tool provides a comprehensive calculator for common shapes such as squares, rectangles, circles, cubes, cylinders, spheres, and cones.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The area represents the amount of space enclosed within a 2D shape, measured in square units (units²). Volume, on the other hand, quantifies the space occupied by a 3D object, measured in cubic units (units³). Accurate calculation of these properties is crucial for tasks such as material estimation, design, and analysis.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator ensures precision by using well-established mathematical formulas and constants like π (Math.PI). It also enforces input validation to avoid errors and provides clear results with four decimal places for accuracy. Whether you are a student, educator, or professional, this tool serves as a reliable resource for geometric calculations.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`// 2D Shapes Area
Square: Area = side²
Rectangle: Area = length × width
Circle: Area = π × radius²
Triangle: Area = ½ × base × height

// 3D Shapes Surface Area and Volume
Cube:
  Surface Area = 6 × side²
  Volume = side³

Cylinder:
  Surface Area = 2πr(r + h)
  Volume = πr²h

Sphere:
  Surface Area = 4πr²
  Volume = (4/3)πr³

Cone:
  Surface Area = πr(r + l) where l = slant height
  Volume = (1/3)πr²h
`}
        </pre>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">FAQ</h2>
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
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="2D/3D Shapes Area & Volume Pack"
      description="Calculate area and volume for 2D and 3D shapes. Comprehensive tool for cubes, cylinders, spheres, cones, and more."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Key Formula",
        formula: `// Example: Cylinder Surface Area and Volume
Surface Area = 2πr(r + h)
Volume = πr²h`,
        variables: [
          { symbol: "r", description: "Radius of the base" },
          { symbol: "h", description: "Height of the shape" },
          { symbol: "l", description: "Slant height (for cones)" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Calculate the surface area and volume of a cylinder with radius 3 units and height 5 units.",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate surface area using formula: 2πr(r + h) = 2 × π × 3 × (3 + 5) = 150.7964 units²",
          },
          {
            label: "2",
            explanation:
              "Calculate volume using formula: πr²h = π × 3² × 5 = 141.3717 units³",
          },
        ],
        result:
          "Surface Area = 150.7964 units², Volume = 141.3717 units³",
      }}
      relatedCalculators={[
        {
          title: "Standard Deviation",
          url: "/math/standard-deviation-variance",
          icon: "📊",
        },
        {
          title: "Quadratic Equation Solver",
          url: "/math/quadratic-equation-solver",
          icon: "📐",
        },
        { title: "Percent of Total", url: "/math/percent-of-total", icon: "➗" },
        {
          title: "Linear Equation Solver",
          url: "/math/linear-equation-solver",
          icon: "📈",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding" },
        { id: "formula", label: "Formula" },
        { id: "faq", label: "FAQ" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}