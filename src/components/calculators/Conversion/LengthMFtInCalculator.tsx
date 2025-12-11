import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, Info, TrendingUp, Activity, Scale, AlertCircle, Check } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

type UnitSystem = "metric" | "imperial";
type LengthUnit = "m" | "ft" | "in";

interface Inputs {
  lengthValue: string;
  lengthUnit: LengthUnit;
  unitSystem: UnitSystem;
  wastagePercent: string; // Construction factor: extra length allowance
  gender: "male" | "female" | "";
  age: string; // years
}

export default function LengthMFtInCalculator() {
  // --- STATE ---
  const [inputs, setInputs] = useState<Inputs>({
    lengthValue: "",
    lengthUnit: "m",
    unitSystem: "metric",
    wastagePercent: "0",
    gender: "",
    age: "",
  });

  // --- LOGIC ---
  const results = useMemo(() => {
    // Parse inputs safely
    const valRaw = inputs.lengthValue.trim();
    const wastageRaw = inputs.wastagePercent.trim();
    const ageRaw = inputs.age.trim();

    if (!valRaw || isNaN(Number(valRaw))) return null;
    if (isNaN(Number(wastageRaw))) return null;
    if (ageRaw && (isNaN(Number(ageRaw)) || Number(ageRaw) < 0)) return null;

    const lengthVal = Number(valRaw);
    const wastagePercent = Math.max(0, Math.min(100, Number(wastageRaw)));
    const ageNum = ageRaw ? Number(ageRaw) : null;

    // Normalize length to meters internally
    // Conversion factors:
    // 1 ft = 0.3048 m
    // 1 in = 0.0254 m
    // 1 m = 1 m
    let lengthMeters = 0;
    switch (inputs.lengthUnit) {
      case "m":
        lengthMeters = lengthVal;
        break;
      case "ft":
        lengthMeters = lengthVal * 0.3048;
        break;
      case "in":
        lengthMeters = lengthVal * 0.0254;
        break;
      default:
        lengthMeters = lengthVal;
    }

    // Apply wastage (construction factor)
    const lengthWithWastage = lengthMeters * (1 + wastagePercent / 100);

    // Advanced logic: interpret length with human factors (gender, age)
    // While length conversion is straightforward, we add advisory notes:
    // - For children (age < 18), length might be height, so mention growth considerations.
    // - For adults, mention typical height ranges by gender.
    // - If wastage > 10%, warn about excessive wastage.

    // Prepare advisory status and color coding
    let status = "";
    let colorClass = "text-slate-900 dark:text-slate-50";

    // Basic length sanity checks (human height range approx 0.5m to 2.5m)
    // If length is outside typical human height range, mark as neutral (conversion only)
    // Else provide contextual info

    // We'll consider lengthMeters as height if gender and age provided
    const isHumanHeightContext = inputs.gender !== "" && ageNum !== null;

    if (isHumanHeightContext) {
      if (ageNum < 0) {
        status = "Invalid age";
        colorClass = "text-rose-600 dark:text-rose-400";
      } else if (ageNum < 18) {
        status = `Child (${inputs.gender === "male" ? "Boy" : "Girl"}), length may vary with growth.`;
        colorClass = "text-blue-600 dark:text-blue-400";
      } else {
        // Adult typical height ranges (approximate)
        // Male: 1.65m - 1.85m
        // Female: 1.5m - 1.75m
        const minHeight = inputs.gender === "male" ? 1.65 : 1.5;
        const maxHeight = inputs.gender === "male" ? 1.85 : 1.75;
        if (lengthMeters < minHeight) {
          status = `Below average height for an adult ${inputs.gender}.`;
          colorClass = "text-amber-600 dark:text-amber-400";
        } else if (lengthMeters > maxHeight) {
          status = `Above average height for an adult ${inputs.gender}.`;
          colorClass = "text-emerald-600 dark:text-emerald-400";
        } else {
          status = `Average height for an adult ${inputs.gender}.`;
          colorClass = "text-emerald-600 dark:text-emerald-400";
        }
      }
    } else {
      status = "Length conversion only.";
      colorClass = "text-slate-700 dark:text-slate-300";
    }

    // Wastage advisory
    let wastageWarning = "";
    if (wastagePercent > 10) {
      wastageWarning = "⚠️ High wastage percentage may lead to material overuse.";
    }

    // Convert lengthWithWastage back to all units for display
    const meters = lengthWithWastage;
    const feet = meters / 0.3048;
    const inches = meters / 0.0254;

    // Format numbers nicely (2 decimals)
    const fmt = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 2 });

    return {
      mainValue: `${fmt(meters)} m`,
      color: colorClass,
      status,
      wastageWarning,
      details: {
        meters: fmt(meters),
        feet: fmt(feet),
        inches: fmt(inches),
        inputUnit: inputs.lengthUnit,
        inputValue: lengthVal,
        wastagePercent,
        gender: inputs.gender,
        age: ageNum,
      },
    };
  }, [inputs]);

  // --- FAQ SCHEMA ---
  const faqs = [
    {
      question: "How do I convert meters to feet and inches?",
      answer:
        "Enter your length value and select the unit. The calculator will convert it to meters, feet, and inches automatically, including any wastage percentage you specify.",
    },
    {
      question: "What is wastage percentage and why is it important?",
      answer:
        "Wastage percentage accounts for extra material needed due to cutting, fitting, or errors, commonly used in construction. Adding wastage ensures you purchase enough material.",
    },
    {
      question: "Why do I need to enter gender and age?",
      answer:
        "If you are using the calculator to interpret human height, gender and age help provide context and advisory notes about typical height ranges and growth considerations.",
    },
    {
      question: "Can I switch between metric and imperial units?",
      answer:
        "Yes, you can toggle between metric and imperial unit systems. The calculator will adjust input units accordingly and convert values precisely.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET ---
  const widget = (
    <div className="space-y-6">
      <Card className="border-0 shadow-none">
        <CardHeader className="p-0 pb-4">
          <CardTitle className="text-lg font-semibold flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <Calculator className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Calculator Inputs
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 space-y-4">
          {/* Unit System Toggle */}
          <div className="flex gap-4 items-center">
            <Label htmlFor="unitSystem" className="font-semibold text-slate-800 dark:text-slate-200">
              Unit System
            </Label>
            <div className="flex gap-2">
              <Button
                variant={inputs.unitSystem === "metric" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  // When switching unit system, adjust length unit accordingly
                  setInputs((prev) => {
                    let newLengthUnit: LengthUnit = prev.lengthUnit;
                    if (prev.unitSystem === "imperial" && prev.unitSystem !== "metric") {
                      // imperial -> metric default unit: m
                      newLengthUnit = "m";
                    } else if (prev.unitSystem === "metric" && prev.unitSystem !== "imperial") {
                      // metric -> imperial default unit: ft
                      newLengthUnit = "ft";
                    }
                    return { ...prev, unitSystem: "metric", lengthUnit: newLengthUnit };
                  });
                }}
              >
                Metric
              </Button>
              <Button
                variant={inputs.unitSystem === "imperial" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setInputs((prev) => {
                    let newLengthUnit: LengthUnit = prev.lengthUnit;
                    if (prev.unitSystem === "metric" && prev.unitSystem !== "imperial") {
                      // metric -> imperial default unit: ft
                      newLengthUnit = "ft";
                    } else if (prev.unitSystem === "imperial" && prev.unitSystem !== "metric") {
                      // imperial -> metric default unit: m
                      newLengthUnit = "m";
                    }
                    return { ...prev, unitSystem: "imperial", lengthUnit: newLengthUnit };
                  });
                }}
              >
                Imperial
              </Button>
            </div>
          </div>

          {/* Length Input */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <Label htmlFor="lengthValue" className="flex-1 font-semibold text-slate-800 dark:text-slate-200">
              Length Value
            </Label>
            <Input
              id="lengthValue"
              type="number"
              min="0"
              step="any"
              placeholder="Enter length"
              value={inputs.lengthValue}
              onChange={(e) => setInputs((prev) => ({ ...prev, lengthValue: e.target.value }))}
              className="flex-1"
            />
            <select
              aria-label="Length Unit"
              className="max-w-[6rem] rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              value={inputs.lengthUnit}
              onChange={(e) => setInputs((prev) => ({ ...prev, lengthUnit: e.target.value as LengthUnit }))}
            >
              {inputs.unitSystem === "metric" ? (
                <>
                  <option value="m">Meters (m)</option>
                </>
              ) : (
                <>
                  <option value="ft">Feet (ft)</option>
                  <option value="in">Inches (in)</option>
                </>
              )}
            </select>
          </div>

          {/* Wastage % Input */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <Label htmlFor="wastagePercent" className="flex-1 font-semibold text-slate-800 dark:text-slate-200">
              Wastage Percentage (%)
              <Info className="inline ml-1 h-4 w-4 text-blue-500" title="Extra material allowance for construction" />
            </Label>
            <Input
              id="wastagePercent"
              type="number"
              min="0"
              max="100"
              step="any"
              placeholder="e.g. 10"
              value={inputs.wastagePercent}
              onChange={(e) => setInputs((prev) => ({ ...prev, wastagePercent: e.target.value }))}
              className="flex-1 max-w-[6rem]"
            />
          </div>

          {/* Gender Select */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <Label htmlFor="gender" className="flex-1 font-semibold text-slate-800 dark:text-slate-200">
              Gender (for height context)
            </Label>
            <select
              id="gender"
              aria-label="Gender"
              className="flex-1 max-w-[10rem] rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              value={inputs.gender}
              onChange={(e) => setInputs((prev) => ({ ...prev, gender: e.target.value as Inputs["gender"] }))}
            >
              <option value="">None</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          {/* Age Input */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <Label htmlFor="age" className="flex-1 font-semibold text-slate-800 dark:text-slate-200">
              Age (years)
            </Label>
            <Input
              id="age"
              type="number"
              min="0"
              step="1"
              placeholder="e.g. 25"
              value={inputs.age}
              onChange={(e) => setInputs((prev) => ({ ...prev, age: e.target.value }))}
              className="flex-1 max-w-[6rem]"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          className="flex-1 h-11 text-base font-semibold"
          onClick={() => {
            // Trigger recalculation by updating inputs state with same values (noop)
            setInputs((prev) => ({ ...prev }));
          }}
          disabled={!inputs.lengthValue || isNaN(Number(inputs.lengthValue))}
        >
          Calculate
        </Button>
        <Button
          variant="outline"
          className="flex-1 h-11 text-base font-medium"
          onClick={() =>
            setInputs({
              lengthValue: "",
              lengthUnit: inputs.unitSystem === "metric" ? "m" : "ft",
              unitSystem: inputs.unitSystem,
              wastagePercent: "0",
              gender: "",
              age: "",
            })
          }
        >
          Reset
        </Button>
      </div>

      {results && (
        <div className="space-y-6 mt-6">
          {/* MAIN RESULT - EXACT FINTECH GRADIENT */}
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 border border-blue-200 dark:border-indigo-800 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Result
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
                {results.mainValue}
              </p>
              <p className={"mt-2 text-lg font-medium " + (results.color || "text-slate-700 dark:text-slate-300")}>
                {results.status}
              </p>
              {results.wastageWarning && (
                <p className="mt-1 text-sm font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {results.wastageWarning}
                </p>
              )}
            </CardContent>
          </Card>

          {/* SECONDARY RESULTS / TABLE */}
          <Card className="border border-slate-300 dark:border-slate-700 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Scale className="h-4 w-4" />
                Equivalent Lengths (including wastage)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Unit</TableHead>
                    <TableHead>Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Meters (m)</TableCell>
                    <TableCell>{results.details.meters}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Feet (ft)</TableCell>
                    <TableCell>{results.details.feet}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Inches (in)</TableCell>
                    <TableCell>{results.details.inches}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  // --- EDITORIAL (DEEP CONTENT) ---
  const editorial = (
    <div className="space-y-12">
      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="mb-4 text-slate-700 dark:text-slate-300 leading-relaxed">
          This calculator converts length values between meters, feet, and inches with precision. Select your preferred unit system (metric or imperial) and enter the length value.
          <br />
          <br />
          For construction projects, you can specify a wastage percentage to account for extra material needed due to cutting, fitting, or errors. This ensures you purchase enough material.
          <br />
          <br />
          If you are using this calculator to interpret human height, provide gender and age to receive contextual information about typical height ranges and growth considerations.
          <br />
          <br />
          Click "Calculate" to see the converted values and advisory notes. Use "Reset" to clear inputs and start fresh.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32 border-t border-slate-200 dark:border-slate-800 pt-10">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula Used</h2>
        <p className="mb-4 text-slate-700 dark:text-slate-300 leading-relaxed">
          The calculator normalizes all inputs to meters internally, then converts to feet and inches using the following formulas:
        </p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Conversion</TableHead>
              <TableHead>Formula</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Feet to meters</TableCell>
              <TableCell>m = ft × 0.3048</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Inches to meters</TableCell>
              <TableCell>m = in × 0.0254</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Meters to feet</TableCell>
              <TableCell>ft = m ÷ 0.3048</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Meters to inches</TableCell>
              <TableCell>in = m ÷ 0.0254</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Wastage adjustment</TableCell>
              <TableCell>Adjusted Length = Length × (1 + Wastage % / 100)</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>

      <section id="example" className="scroll-mt-32 border-t border-slate-200 dark:border-slate-800 pt-10">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Example Calculation</h2>
        <p className="mb-4 text-slate-700 dark:text-slate-300 leading-relaxed">
          Suppose you want to convert 10 feet to meters and inches, including a 10% wastage for a construction project.
        </p>
        <ol className="list-decimal list-inside space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            Convert feet to meters: 10 ft × 0.3048 = 3.048 m
          </li>
          <li>
            Apply wastage: 3.048 m × (1 + 10/100) = 3.3528 m
          </li>
          <li>
            Convert adjusted meters to inches: 3.3528 m ÷ 0.0254 ≈ 132.01 in
          </li>
        </ol>
        <p className="mt-4 font-semibold text-slate-900 dark:text-slate-100">
          Result: 3.35 meters (including wastage), approximately 10.99 feet, or 132.01 inches.
        </p>
      </section>

      <section id="faq" className="scroll-mt-32 border-t border-slate-200 dark:border-slate-800 pt-10">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {faqs.map((f, i) => (
            <div key={i}>
              <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">{f.question}</h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{f.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="references" className="scroll-mt-32 border-t border-slate-200 dark:border-slate-800 pt-10 mt-12">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References & Resources</h2>
        <ul className="space-y-4">
          <li className="leading-relaxed">
            <a
              href="https://www.nist.gov/pml/weights-and-measures/metric-si/length"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              NIST - Length Units and Conversion
            </a>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Official standards and definitions for length units and conversion factors.
            </p>
          </li>
          <li className="leading-relaxed">
            <a
              href="https://www.engineeringtoolbox.com/length-conversion-d_1184.html"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Engineering Toolbox - Length Conversion
            </a>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Practical length conversion tables and formulas for engineering and construction.
            </p>
          </li>
          <li className="leading-relaxed">
            <a
              href="https://www.cdc.gov/nchs/fastats/body-measurements.htm"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              CDC - Body Measurements and Growth Charts
            </a>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Information on human height ranges by age and gender for health context.
            </p>
          </li>
          <li className="leading-relaxed">
            <a
              href="https://www.constructionknowledge.net/material-wastage/"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Construction Knowledge - Material Wastage
            </a>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Guidelines on calculating and accounting for material wastage in construction projects.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  // --- FINAL RENDER ---
  return (
    <CalculatorVerticalLayout
      title="Length: m ↔ ft ↔ in"
      description="Convert length units instantly. Quickly transform meters to feet, inches to centimeters, and handle both metric and imperial measurements with precision."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: "how-to-use", label: "How to Use This Calculator" },
        { id: "formula", label: "Formula Used" },
        { id: "example", label: "Example Calculation" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" },
      ]}
      formula={{
        title: "Formula Used",
        formula:
          "m = ft × 0.3048 = in × 0.0254; ft = m ÷ 0.3048; in = m ÷ 0.0254; Adjusted Length = Length × (1 + Wastage % / 100)",
        variables: [
          { symbol: "m", description: "Length in meters" },
          { symbol: "ft", description: "Length in feet" },
          { symbol: "in", description: "Length in inches" },
          { symbol: "Wastage %", description: "Extra material percentage for wastage" },
        ],
      }}
      example={{
        title: "Example Calculation",
        scenario: "Convert 10 feet to meters and inches including 10% wastage for construction.",
        steps: [
          { step: 1, description: "Convert feet to meters", calculation: "10 ft × 0.3048 = 3.048 m" },
          { step: 2, description: "Apply wastage", calculation: "3.048 m × 1.10 = 3.3528 m" },
          { step: 3, description: "Convert meters to inches", calculation: "3.3528 m ÷ 0.0254 ≈ 132.01 in" },
        ],
        result: "3.35 meters (including wastage), approx. 10.99 feet, or 132.01 inches.",
      }}
      relatedCalculators={[
        { title: "Area: m² ↔ ft²", url: "/conversion/area-m2-ft2", icon: "🧮" },
        { title: "Volume: L ↔ mL ↔ gal ↔ oz", url: "/conversion/volume-l-ml-gal-oz", icon: "🧮" },
        { title: "Mass: kg ↔ lb ↔ oz", url: "/conversion/mass-kg-lb-oz", icon: "🧮" },
        { title: "Temperature: °C ↔ °F ↔ K", url: "/conversion/temperature-c-f-k", icon: "🧮" },
        { title: "Density: g/mL ↔ kg/m³", url: "/conversion/density-g-per-ml-kg-per-m3", icon: "🧮" },
        { title: "Angle: deg ↔ rad", url: "/conversion/angle-deg-rad", icon: "🧮" },
      ]}
      showTopBanner={true}
      showSidebar={true}
      showBottomBanner={true}
    />
  );
}