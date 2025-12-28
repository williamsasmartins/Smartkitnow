import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Zap,
  BookOpen,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

type ColorCode = {
  color: string;
  digit?: number;
  multiplier?: number;
  tolerance?: number;
  tempCoeff?: number;
};

const colorCodes: ColorCode[] = [
  { color: "Black", digit: 0, multiplier: 1 },
  { color: "Brown", digit: 1, multiplier: 10, tolerance: 1, tempCoeff: 100 },
  { color: "Red", digit: 2, multiplier: 100, tolerance: 2, tempCoeff: 50 },
  { color: "Orange", digit: 3, multiplier: 1_000, tempCoeff: 15 },
  { color: "Yellow", digit: 4, multiplier: 10_000, tempCoeff: 25 },
  { color: "Green", digit: 5, multiplier: 100_000, tolerance: 0.5 },
  { color: "Blue", digit: 6, multiplier: 1_000_000, tolerance: 0.25, tempCoeff: 10 },
  { color: "Violet", digit: 7, multiplier: 10_000_000, tolerance: 0.1, tempCoeff: 5 },
  { color: "Gray", digit: 8, multiplier: 100_000_000, tolerance: 0.05 },
  { color: "White", digit: 9, multiplier: 1_000_000_000 },
  { color: "Gold", multiplier: 0.1, tolerance: 5 },
  { color: "Silver", multiplier: 0.01, tolerance: 10 },
];

function formatResistance(value: number): string {
  if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(2) + " GΩ";
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(2) + " MΩ";
  if (value >= 1_000) return (value / 1_000).toFixed(2) + " kΩ";
  if (value < 1) return (value * 1000).toFixed(2) + " mΩ";
  return value.toFixed(2) + " Ω";
}

export default function ResistorColorCodeCalculator() {
  /*
    Inputs:
    val1: Band 1 color (digit)
    val2: Band 2 color (digit)
    val3: Band 3 color (multiplier)
    val4: Band 4 color (tolerance) - optional
    val5: Band 5 color (temp coefficient) - optional (not implemented here)
  */

  // We'll use select inputs for colors for each band.
  // For simplicity, val1, val2, val3, val4 are strings representing color names.

  const [inputs, setInputs] = useState({
    band1: "",
    band2: "",
    multiplier: "",
    tolerance: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Helper to get digit from color name
  const getDigit = (color: string) =>
    colorCodes.find((c) => c.color.toLowerCase() === color.toLowerCase())?.digit;

  // Helper to get multiplier from color name
  const getMultiplier = (color: string) =>
    colorCodes.find((c) => c.color.toLowerCase() === color.toLowerCase())?.multiplier;

  // Helper to get tolerance from color name
  const getTolerance = (color: string) =>
    colorCodes.find((c) => c.color.toLowerCase() === color.toLowerCase())?.tolerance;

  const results = useMemo(() => {
    const { band1, band2, multiplier, tolerance } = inputs;

    if (!band1 || !band2 || !multiplier) {
      return {
        primary: "-",
        secondary: "",
        details: "Please select colors for Band 1, Band 2, and Multiplier.",
        feedback: "",
      };
    }

    const d1 = getDigit(band1);
    const d2 = getDigit(band2);
    const mul = getMultiplier(multiplier);
    const tol = getTolerance(tolerance);

    if (d1 === undefined || d2 === undefined || mul === undefined) {
      return {
        primary: "-",
        secondary: "",
        details: "Invalid color selection. Please check your inputs.",
        feedback: "",
      };
    }

    // Calculate resistance value
    const resistanceValue = ((d1 * 10) + d2) * mul;

    // Format resistance string
    const resistanceStr = formatResistance(resistanceValue);

    // Tolerance string
    const toleranceStr = tol !== undefined ? `±${tol}%` : "±20% (default)";

    return {
      primary: resistanceStr,
      secondary: `Resistance ${toleranceStr}`,
      details: `Calculated from colors: ${band1}, ${band2}, ${multiplier}` + (tolerance ? `, ${tolerance}` : ""),
      feedback: "",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "How do I read the resistor color code bands?",
      answer:
        "Resistor color codes use colored bands to indicate resistance value and tolerance. The first two bands represent the first two digits of the resistance value, the third band is the multiplier, and the fourth band (if present) indicates tolerance. By decoding these colors, you can determine the resistor's resistance and accuracy.",
    },
    {
      question: "What if my resistor has only 4 bands?",
      answer:
        "A 4-band resistor typically has two bands for digits, one for multiplier, and one for tolerance. This is the most common type. If the tolerance band is missing, the resistor usually has a default tolerance of ±20%. Always verify with a multimeter if unsure.",
    },
    {
      question: "Can I use this calculator for 5 or 6 band resistors?",
      answer:
        "This calculator currently supports decoding 4-band resistor color codes. Five and six-band resistors include an additional digit and sometimes a temperature coefficient band. For those, specialized calculators or charts should be used to ensure accuracy.",
    },
    {
      question: "Why is tolerance important in resistors?",
      answer:
        "Tolerance indicates how much the actual resistance can vary from the nominal value. A lower tolerance means higher precision. For critical circuits, choosing resistors with tighter tolerance ensures better performance and reliability.",
    },
    {
      question: "What are common mistakes when decoding resistor colors?",
      answer:
        "Common mistakes include misreading colors under poor lighting, confusing similar colors like brown and red, or ignoring the tolerance band. Always double-check colors and use a multimeter to verify resistance if possible.",
    },
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "You have a resistor with color bands: Red, Violet, Yellow, and Gold. You want to find its resistance value and tolerance.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Identify the colors of the first two bands: Red (2) and Violet (7). These form the first two digits: 27.",
      },
      {
        label: "Step 2",
        explanation:
          "Identify the third band (multiplier): Yellow corresponds to 10,000 (10^4). Multiply 27 by 10,000 to get 270,000 Ω or 270 kΩ.",
      },
      {
        label: "Step 3",
        explanation:
          "Identify the fourth band (tolerance): Gold corresponds to ±5%. This means the actual resistance can vary by 5% above or below 270 kΩ.",
      },
    ],
    result: "The resistor value is 270 kΩ with a tolerance of ±5%.",
  };

  const references = [
    {
      title: "Resistor Color Code - Wikipedia",
      description:
        "Comprehensive explanation of resistor color codes, including tables and examples.",
      url: "https://en.wikipedia.org/wiki/Resistor_color_code",
    },
    {
      title: "All About Circuits - Resistor Color Codes",
      description:
        "Detailed guide on reading resistor color codes and practical tips for engineers.",
      url: "https://www.allaboutcircuits.com/tools/resistor-color-code-calculator/",
    },
    {
      title: "Electronics Tutorials - Resistor Color Code",
      description:
        "Step-by-step tutorial on resistor color codes with interactive examples.",
      url: "https://www.electronics-tutorials.ws/resistor/res_3.html",
    },
  ];

  const colorOptions = colorCodes
    .filter((c) => c.digit !== undefined || c.multiplier !== undefined)
    .map((c) => c.color);

  // For tolerance, only colors with tolerance property
  const toleranceOptions = colorCodes
    .filter((c) => c.tolerance !== undefined)
    .map((c) => c.color);

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Band 1 (1st Digit)</Label>
          <select
            className="w-full rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-2"
            value={inputs.band1}
            onChange={(e) => handleInputChange("band1", e.target.value)}
          >
            <option value="">Select Color</option>
            {colorOptions
              .filter((color) => getDigit(color) !== undefined)
              .map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label>Band 2 (2nd Digit)</Label>
          <select
            className="w-full rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-2"
            value={inputs.band2}
            onChange={(e) => handleInputChange("band2", e.target.value)}
          >
            <option value="">Select Color</option>
            {colorOptions
              .filter((color) => getDigit(color) !== undefined)
              .map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label>Multiplier (3rd Band)</Label>
          <select
            className="w-full rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-2"
            value={inputs.multiplier}
            onChange={(e) => handleInputChange("multiplier", e.target.value)}
          >
            <option value="">Select Color</option>
            {colorOptions
              .filter((color) => getMultiplier(color) !== undefined)
              .map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label>Tolerance (4th Band, optional)</Label>
          <select
            className="w-full rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-2"
            value={inputs.tolerance}
            onChange={(e) => handleInputChange("tolerance", e.target.value)}
          >
            <option value="">Select Color (default ±20%)</option>
            {toleranceOptions.map((color) => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" onClick={() => {}}>
        <Zap className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Result</span>
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
      <section id="how-to-use" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to use this calculator</h2>
        <ol className="list-decimal pl-5 space-y-3 text-slate-600 dark:text-slate-400">
          <li>
            Select the color of the first band (Band 1) which represents the first digit of the resistor value.
          </li>
          <li>
            Select the color of the second band (Band 2) which represents the second digit.
          </li>
          <li>
            Select the color of the third band (Multiplier) which represents the multiplier factor.
          </li>
          <li>
            Optionally, select the color of the fourth band (Tolerance) to specify the resistor's tolerance. If left blank, ±20% is assumed.
          </li>
          <li>
            Click the "Calculate" button to decode the resistor value and tolerance.
          </li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to Resistor Color Code Decoder
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Resistors are fundamental components in electrical circuits used to limit current and divide voltages. Their resistance value is often indicated by colored bands painted on their bodies, known as the resistor color code.
          </p>
          <p>
            The most common resistor color code uses four bands: the first two bands represent the first two digits of the resistance value, the third band is the multiplier, and the fourth band indicates tolerance. For example, a resistor with bands Red, Violet, Yellow, and Gold corresponds to 27 × 10,000 Ω = 270,000 Ω or 270 kΩ with ±5% tolerance.
          </p>
          <p>
            Understanding how to decode these colors is essential for engineers and technicians to identify resistor values quickly and accurately without needing additional measuring tools.
          </p>
        </div>
      </section>

      {/* FIXED CSS FOR READABILITY */}
      <section
        id="mistakes"
        className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900"
      >
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" /> Safety & Common Mistakes
        </h3>
        <div className="space-y-2 text-sm text-amber-900 dark:text-amber-100">
          <p>
            <strong>Warning:</strong> Always ensure you correctly identify resistor colors under good lighting conditions. Misreading colors can lead to incorrect resistor selection, potentially damaging your circuit or causing malfunction.
          </p>
          <p>
            Avoid confusing similar colors such as brown and red or orange and yellow. When in doubt, use a multimeter to verify resistance values before installation.
          </p>
          <p>
            Remember that tolerance affects circuit performance; using resistors with inappropriate tolerance can cause instability or failure in sensitive applications.
          </p>
          <p>
            Never rely solely on color codes for critical or high-precision circuits; always cross-check with datasheets or measurement tools.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">{example.title}</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4">{example.scenario}</p>
        <ol className="list-decimal pl-5 space-y-3 text-slate-600 dark:text-slate-400">
          {example.steps.map((step, i) => (
            <li key={i}>
              <strong>{step.label}:</strong> {step.explanation}
            </li>
          ))}
        </ol>
        <p className="mt-4 font-semibold text-slate-900 dark:text-slate-100">{example.result}</p>
      </section>

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
      title="Resistor Color Code Decoder"
      description="Professional electrical calculator: Resistor Color Code Decoder. Accurate engineering formulas, NEC compliance tips, and safety guidelines."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      example={example}
      relatedCalculators={[]}
      onThisPage={[
        { id: "how-to-use", label: "How to Use" },
        { id: "guide", label: "Complete Guide" },
        { id: "mistakes", label: "Safety & Mistakes" },
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