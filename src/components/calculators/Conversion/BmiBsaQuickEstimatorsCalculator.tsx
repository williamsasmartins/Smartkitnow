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
import {
  ArrowRightLeft,
  Calculator,
  RotateCcw,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

const BMI_UNITS = [
  { value: "kg/m2", label: "kg/m² (BMI)" },
  { value: "lb/ft2", label: "lb/ft² (BMI)" },
];

const BSA_UNITS = [
  { value: "m2", label: "m² (BSA)" },
  { value: "ft2", label: "ft² (BSA)" },
  { value: "cm2", label: "cm² (BSA)" },
];

const ALL_UNITS = [...BMI_UNITS, ...BSA_UNITS];

function roundTo(value: number, decimals = 4) {
  return Number(value.toFixed(decimals));
}

function convertBMI(value: number, fromUnit: string, toUnit: string): number {
  // BMI units: kg/m² and lb/ft²
  // Conversion factor: 1 kg/m² = 0.204816 lb/ft²
  if (fromUnit === toUnit) return value;
  if (fromUnit === "kg/m2" && toUnit === "lb/ft2") {
    return value * 0.204816;
  }
  if (fromUnit === "lb/ft2" && toUnit === "kg/m2") {
    return value / 0.204816;
  }
  return NaN;
}

function convertBSA(value: number, fromUnit: string, toUnit: string): number {
  // BSA units: m², ft², cm²
  // 1 m² = 10.7639 ft²
  // 1 m² = 10,000 cm²
  if (fromUnit === toUnit) return value;

  // Convert from fromUnit to m² first
  let valueInM2: number;
  switch (fromUnit) {
    case "m2":
      valueInM2 = value;
      break;
    case "ft2":
      valueInM2 = value / 10.7639;
      break;
    case "cm2":
      valueInM2 = value / 10000;
      break;
    default:
      return NaN;
  }

  // Convert from m² to toUnit
  switch (toUnit) {
    case "m2":
      return valueInM2;
    case "ft2":
      return valueInM2 * 10.7639;
    case "cm2":
      return valueInM2 * 10000;
    default:
      return NaN;
  }
}

function isBMIUnit(unit: string) {
  return BMI_UNITS.some((u) => u.value === unit);
}

function isBSAUnit(unit: string) {
  return BSA_UNITS.some((u) => u.value === unit);
}

export default function BmiBsaQuickEstimatorsCalculator() {
  // 1. STATE
  const [val, setVal] = useState("");
  // Default units: BMI kg/m² to lb/ft²
  const [fromUnit, setFromUnit] = useState("kg/m2");
  const [toUnit, setToUnit] = useState("lb/ft2");

  // 2. LOGIC
  const results = useMemo(() => {
    const num = parseFloat(val);
    if (isNaN(num)) {
      return {
        value: 0,
        label: "Enter a valid number...",
        formula: "Select units",
      };
    }
    // Check if units are BMI or BSA and compatible
    if (
      (isBMIUnit(fromUnit) && isBMIUnit(toUnit)) ||
      (isBSAUnit(fromUnit) && isBSAUnit(toUnit))
    ) {
      let result = NaN;
      let formulaText = "";

      if (isBMIUnit(fromUnit)) {
        result = convertBMI(num, fromUnit, toUnit);
        if (fromUnit === toUnit) {
          formulaText = `1 ${fromUnit} = 1 ${toUnit}`;
        } else if (fromUnit === "kg/m2" && toUnit === "lb/ft2") {
          formulaText = `1 kg/m² = 0.204816 lb/ft²`;
        } else if (fromUnit === "lb/ft2" && toUnit === "kg/m2") {
          formulaText = `1 lb/ft² = 4.887 kg/m²`;
        }
      } else if (isBSAUnit(fromUnit)) {
        result = convertBSA(num, fromUnit, toUnit);
        if (fromUnit === toUnit) {
          formulaText = `1 ${fromUnit} = 1 ${toUnit}`;
        } else {
          // Provide formula text for common conversions
          if (fromUnit === "m2" && toUnit === "ft2") {
            formulaText = `1 m² = 10.7639 ft²`;
          } else if (fromUnit === "ft2" && toUnit === "m2") {
            formulaText = `1 ft² = 0.092903 m²`;
          } else if (fromUnit === "m2" && toUnit === "cm2") {
            formulaText = `1 m² = 10,000 cm²`;
          } else if (fromUnit === "cm2" && toUnit === "m2") {
            formulaText = `1 cm² = 0.0001 m²`;
          } else if (fromUnit === "ft2" && toUnit === "cm2") {
            formulaText = `1 ft² = 929.03 cm²`;
          } else if (fromUnit === "cm2" && toUnit === "ft2") {
            formulaText = `1 cm² = 0.001076 ft²`;
          } else {
            formulaText = `Conversion factor from ${fromUnit} to ${toUnit}`;
          }
        }
      } else {
        return {
          value: 0,
          label: "Incompatible units selected",
          formula: "Please select compatible units (BMI or BSA)",
        };
      }

      if (isNaN(result)) {
        return {
          value: 0,
          label: "Conversion error",
          formula: "Invalid conversion",
        };
      }

      return {
        value: roundTo(result).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 4,
        }),
        label: `Result in ${toUnit}`,
        formula: formulaText,
      };
    } else {
      return {
        value: 0,
        label: "Incompatible units selected",
        formula: "Please select compatible units (BMI or BSA)",
      };
    }
  }, [val, fromUnit, toUnit]);

  // 3. FAQS
  const faqs = [
    {
      question: "What is BMI and why is it important?",
      answer:
        "Body Mass Index (BMI) is a numerical value derived from an individual's weight and height, used to categorize underweight, normal weight, overweight, and obesity. It is important because it provides a quick and easy method to assess potential health risks related to body fat. However, BMI does not directly measure body fat and may not be accurate for all populations, such as athletes or elderly individuals.",
    },
    {
      question: "How is Body Surface Area (BSA) used in medical practice?",
      answer:
        "Body Surface Area (BSA) is a measurement of the total surface area of the human body and is commonly used in medical settings to calculate drug dosages, especially for chemotherapy and other treatments. It provides a more accurate dosing metric than body weight alone because it accounts for the patient's size and metabolic mass. BSA is also used to assess physiological functions such as cardiac output and renal function.",
    },
    {
      question: "Why can't I convert BMI units to BSA units in this tool?",
      answer:
        "BMI and BSA represent fundamentally different physiological measurements and use different units; BMI is a ratio of mass to height squared, while BSA is an area measurement of the body's surface. Because of this, their units are not directly convertible or compatible. This tool restricts conversions to within BMI units or within BSA units to ensure meaningful and accurate results.",
    },
    {
      question: "How accurate are these quick estimators for clinical use?",
      answer:
        "These quick estimators provide approximate conversions based on standard formulas and conversion factors, suitable for general health assessments and educational purposes. However, for clinical decision-making, more precise measurements and calculations tailored to individual patient characteristics are recommended. Always consult healthcare professionals for accurate diagnosis and treatment planning.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="mb-2 block text-slate-700 dark:text-slate-300">
            Value
          </Label>
          <Input
            type="number"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            placeholder="Enter number..."
            min="0"
            step="any"
          />
        </div>

        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Label className="mb-2 block text-slate-700 dark:text-slate-300">
              From
            </Label>
            <Select
              value={fromUnit}
              onValueChange={(v) => {
                setFromUnit(v);
                // Auto-switch to compatible toUnit if incompatible
                if (
                  (isBMIUnit(v) && !isBMIUnit(toUnit)) ||
                  (isBSAUnit(v) && !isBSAUnit(toUnit))
                ) {
                  // Pick default compatible toUnit
                  if (isBMIUnit(v)) setToUnit("lb/ft2");
                  else if (isBSAUnit(v)) setToUnit("ft2");
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                {ALL_UNITS.map((unit) => (
                  <SelectItem key={unit.value} value={unit.value}>
                    {unit.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <ArrowRightLeft className="mb-3 text-slate-400" />
          <div className="flex-1">
            <Label className="mb-2 block text-slate-700 dark:text-slate-300">
              To
            </Label>
            <Select value={toUnit} onValueChange={setToUnit}>
              <SelectTrigger>
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                {ALL_UNITS.map((unit) => (
                  <SelectItem key={unit.value} value={unit.value}>
                    {unit.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No action needed, conversion is live
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Convert
        </Button>
        <Button
          variant="outline"
          onClick={() => setVal("")}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Converted Result
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
                {results.value}
              </p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">
                {results.label}
              </p>
              <p className="text-xs text-slate-500 mt-4 font-mono bg-white/50 dark:bg-black/20 inline-block px-3 py-1 rounded">
                Factor: {results.formula}
              </p>
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
          Understanding BMI & BSA quick estimators
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Body Mass Index (BMI) and Body Surface Area (BSA) are two important
          health metrics used to assess body composition and physiological
          characteristics. BMI is a simple calculation using weight and height to
          categorize individuals into weight status groups, while BSA estimates
          the total surface area of the human body, which is critical for medical
          dosing and physiological assessments. This tool provides quick and
          accurate estimations and conversions between common units used for BMI
          and BSA.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          By understanding these estimators, users can better interpret health
          data and make informed decisions regarding their wellness or clinical
          care. The estimators use standardized formulas and conversion factors
          to ensure precision and ease of use. This calculator supports unit
          conversions within BMI and BSA categories to maintain meaningful and
          accurate results.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Converter
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Enter the numeric value you wish to convert in the input field. Then,
          select the appropriate units for the value you have (From) and the
          units you want to convert to (To) from the dropdown menus. The tool
          supports conversions within BMI units or within BSA units but does not
          allow cross-category conversions to ensure accuracy.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          After entering the value and selecting units, click the Convert button
          to see the converted result displayed below. You can reset the input at
          any time using the Reset button. This intuitive interface ensures quick
          and precise estimations for your health metrics.
        </p>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Frequently Asked Questions
        </h2>
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

      <section id="factors" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Common Conversion Factors
        </h2>
        <ul className="space-y-4">
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              BMI Units
            </p>
            <p className="text-slate-500 text-sm">
              1 kg/m² = 0.204816 lb/ft² &nbsp;|&nbsp; 1 lb/ft² = 4.887 kg/m²
            </p>
          </li>
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              BSA Units
            </p>
            <p className="text-slate-500 text-sm">
              1 m² = 10.7639 ft² &nbsp;|&nbsp; 1 m² = 10,000 cm² &nbsp;|&nbsp; 1
              ft² = 929.03 cm²
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="BMI & BSA quick estimators"
      description="Quickly estimate Body Mass Index (BMI) and Body Surface Area (BSA) using standard conversion formulas for health checks."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ FIX: VARIABLES MUST NOT BE EMPTY
      formula={{
        title: "Conversion Formula",
        formula: results.formula || "Select units",
        variables: [
          {
            symbol: "Input",
            description: `Value in ${fromUnit.includes("m2") ? fromUnit.replace("m2", "m²") : fromUnit.replace("ft2", "ft²")}`,
          },
          {
            symbol: "Result",
            description: `Value converted to ${toUnit.includes("m2") ? toUnit.replace("m2", "m²") : toUnit.replace("ft2", "ft²")}`,
          },
        ],
      }}
      example={{
        title: "Example Calculation",
        scenario:
          "Convert a BMI value of 25 kg/m² to lb/ft² to understand the equivalent measurement in imperial units.",
        steps: [
          {
            label: "1",
            explanation:
              "Identify the input value and units: 25 kg/m² (BMI).",
          },
          {
            label: "2",
            explanation:
              "Use the conversion factor: 1 kg/m² = 0.204816 lb/ft².",
          },
          {
            label: "3",
            explanation:
              "Multiply 25 by 0.204816 to get 5.1204 lb/ft² as the converted BMI value.",
          },
        ],
        result: "25 kg/m² = 5.1204 lb/ft²",
      }}
      relatedCalculators={[
        {
          title: "Mass: kg ↔ lb ↔ oz",
          url: "/conversion/mass-kg-lb-oz",
          icon: "⚖️",
        },
        {
          title: "Area: m² ↔ ft²",
          url: "/conversion/area-m2-ft2",
          icon: "📏",
        },
        {
          title: "Cooking: tsp/tbsp/cup ↔ mL",
          url: "/conversion/cooking-tsp-tbsp-cup-ml",
          icon: "⚖️",
        },
        {
          title: "Bytes: B ↔ kB ↔ MB ↔ GB ↔ TB",
          url: "/conversion/bytes-b-kb-mb-gb-tb",
          icon: "💾",
        },
        {
          title: "Temperature: °C ↔ °F ↔ K",
          url: "/conversion/temperature-c-f-k",
          icon: "🌡️",
        },
        {
          title: "Speed: m/s ↔ km/h ↔ mph",
          url: "/conversion/speed-mps-kmph-mph",
          icon: "⏱️",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Conversion" },
        { id: "how-to-use", label: "How to Use" },
        { id: "faq", label: "FAQ" },
        { id: "factors", label: "Common Factors" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}