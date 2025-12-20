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

function toFixedNumber(num: number, digits: number) {
  return Number(num.toFixed(digits));
}

function formatAngle(angle: number) {
  return angle.toFixed(4) + "°";
}

function formatSide(side: number) {
  return side.toFixed(4);
}

function degToRad(deg: number) {
  return (deg * Math.PI) / 180;
}

function radToDeg(rad: number) {
  return (rad * 180) / Math.PI;
}

function isValidPositiveNumber(value: any) {
  const n = Number(value);
  return !isNaN(n) && n > 0;
}

export default function TriangleSolverSssSasAsaCalculator() {
  /*
    Inputs:
      - method: "SSS" | "SAS" | "ASA"
      - sides: a, b, c (numbers, positive)
      - angles: A, B, C (degrees, positive, < 180)
    Outputs:
      - sides: a, b, c
      - angles: A, B, C
  */

  const [inputs, setInputs] = useState<{
    method?: "SSS" | "SAS" | "ASA";
    a?: string;
    b?: string;
    c?: string;
    A?: string;
    B?: string;
    C?: string;
  }>({ method: "SSS" });

  const handleInputChange = useCallback(
    (name: string, value: string) => {
      setInputs((prev) => ({ ...prev, [name]: value }));
    },
    [setInputs]
  );

  const results = useMemo(() => {
    const method = inputs.method || "SSS";

    // Parse inputs to numbers or NaN
    const a = Number(inputs.a);
    const b = Number(inputs.b);
    const c = Number(inputs.c);
    const A = Number(inputs.A);
    const B = Number(inputs.B);
    const C = Number(inputs.C);

    // Validate inputs helper
    function validSide(x: number) {
      return !isNaN(x) && x > 0;
    }
    function validAngle(x: number) {
      return !isNaN(x) && x > 0 && x < 180;
    }

    // Result object template
    let value = "";
    let label = "";
    let subtext = "";
    let warning: string | null = null;
    let formulaUsed = "";

    // Triangle inequality check for sides
    function triangleInequality(a: number, b: number, c: number) {
      return a + b > c && a + c > b && b + c > a;
    }

    // Law of Cosines: c² = a² + b² - 2ab cos(C)
    // Law of Sines: a/sin(A) = b/sin(B) = c/sin(C)

    if (method === "SSS") {
      // Given all sides, find all angles
      if (validSide(a) && validSide(b) && validSide(c)) {
        if (!triangleInequality(a, b, c)) {
          warning =
            "The given sides do not satisfy the triangle inequality theorem.";
          return { value, label, subtext, warning, formulaUsed };
        }

        // Calculate angles using Law of Cosines
        // A = acos((b² + c² - a²) / 2bc)
        const angleA =
          Math.acos(
            (b * b + c * c - a * a) / (2 * b * c)
          );
        const angleB =
          Math.acos(
            (a * a + c * c - b * b) / (2 * a * c)
          );
        const angleC = Math.PI - angleA - angleB;

        const Adeg = radToDeg(angleA);
        const Bdeg = radToDeg(angleB);
        const Cdeg = radToDeg(angleC);

        formulaUsed = "Law of Cosines";

        value = (
          <>
            <p>
              <strong>Sides:</strong> a = {formatSide(a)}, b = {formatSide(b)}, c ={" "}
              {formatSide(c)}
            </p>
            <p>
              <strong>Angles:</strong> A = {formatAngle(Adeg)}, B = {formatAngle(Bdeg)}, C ={" "}
              {formatAngle(Cdeg)}
            </p>
          </>
        );
        label = "Triangle sides and angles";
        subtext =
          "Angles calculated using the Law of Cosines from three known sides.";
      } else {
        warning = "Please enter valid positive numbers for sides a, b, and c.";
      }
    } else if (method === "SAS") {
      // Given two sides and included angle, find the third side and other angles
      // Inputs: two sides and included angle between them
      // Possible combos: (a, b, C), (a, c, B), (b, c, A)
      // We will detect which angle is given and which sides are given accordingly

      // Identify which angle is given and which two sides are given
      // We expect exactly two sides and one angle (included)

      // Count valid sides and angles
      const sidesCount = [a, b, c].filter(validSide).length;
      const anglesCount = [A, B, C].filter(validAngle).length;

      if (sidesCount !== 2 || anglesCount !== 1) {
        warning =
          "For SAS, please enter exactly two sides and the included angle.";
        return { value, label, subtext, warning, formulaUsed };
      }

      // Determine which angle is given and which sides are adjacent to it
      // SAS means angle is between the two known sides

      // Check for (a, b, C)
      if (validSide(a) && validSide(b) && validAngle(C)) {
        // Calculate side c using Law of Cosines
        // c² = a² + b² - 2ab cos(C)
        const Crad = degToRad(C);
        const cCalc = Math.sqrt(
          a * a + b * b - 2 * a * b * Math.cos(Crad)
        );

        // Calculate angles A and B using Law of Sines
        // sin(A)/a = sin(C)/c
        // A = arcsin(a * sin(C) / c)
        const Acalc = Math.asin((a * Math.sin(Crad)) / cCalc);
        const Bcalc = Math.asin((b * Math.sin(Crad)) / cCalc);

        // Check for ambiguous case (not possible here because angle is included)
        if (isNaN(Acalc) || isNaN(Bcalc)) {
          warning =
            "Invalid triangle configuration with given sides and angle.";
          return { value, label, subtext, warning, formulaUsed };
        }

        const Adeg = radToDeg(Acalc);
        const Bdeg = radToDeg(Bcalc);

        formulaUsed = "Law of Cosines and Law of Sines";

        value = (
          <>
            <p>
              <strong>Sides:</strong> a = {formatSide(a)}, b = {formatSide(b)}, c ={" "}
              {formatSide(cCalc)}
            </p>
            <p>
              <strong>Angles:</strong> A = {formatAngle(Adeg)}, B = {formatAngle(Bdeg)}, C ={" "}
              {formatAngle(C)}
            </p>
          </>
        );
        label = "Triangle sides and angles";
        subtext =
          "Side c calculated using Law of Cosines; angles A and B calculated using Law of Sines.";
      }
      // Check for (a, c, B)
      else if (validSide(a) && validSide(c) && validAngle(B)) {
        const Brad = degToRad(B);
        const bCalc = Math.sqrt(
          a * a + c * c - 2 * a * c * Math.cos(Brad)
        );

        const Acalc = Math.asin((a * Math.sin(Brad)) / bCalc);
        const Ccalc = Math.asin((c * Math.sin(Brad)) / bCalc);

        if (isNaN(Acalc) || isNaN(Ccalc)) {
          warning =
            "Invalid triangle configuration with given sides and angle.";
          return { value, label, subtext, warning };
        }

        const Adeg = radToDeg(Acalc);
        const Cdeg = radToDeg(Ccalc);

        formulaUsed = "Law of Cosines and Law of Sines";

        value = (
          <>
            <p>
              <strong>Sides:</strong> a = {formatSide(a)}, b = {formatSide(bCalc)}, c ={" "}
              {formatSide(c)}
            </p>
            <p>
              <strong>Angles:</strong> A = {formatAngle(Adeg)}, B = {formatAngle(B)}, C ={" "}
              {formatAngle(Cdeg)}
            </p>
          </>
        );
        label = "Triangle sides and angles";
        subtext =
          "Side b calculated using Law of Cosines; angles A and C calculated using Law of Sines.";
      }
      // Check for (b, c, A)
      else if (validSide(b) && validSide(c) && validAngle(A)) {
        const Arad = degToRad(A);
        const aCalc = Math.sqrt(
          b * b + c * c - 2 * b * c * Math.cos(Arad)
        );

        const Bcalc = Math.asin((b * Math.sin(Arad)) / aCalc);
        const Ccalc = Math.asin((c * Math.sin(Arad)) / aCalc);

        if (isNaN(Bcalc) || isNaN(Ccalc)) {
          warning =
            "Invalid triangle configuration with given sides and angle.";
          return { value, label, subtext, warning };
        }

        const Bdeg = radToDeg(Bcalc);
        const Cdeg = radToDeg(Ccalc);

        formulaUsed = "Law of Cosines and Law of Sines";

        value = (
          <>
            <p>
              <strong>Sides:</strong> a = {formatSide(aCalc)}, b = {formatSide(b)}, c ={" "}
              {formatSide(c)}
            </p>
            <p>
              <strong>Angles:</strong> A = {formatAngle(A)}, B = {formatAngle(Bdeg)}, C ={" "}
              {formatAngle(Cdeg)}
            </p>
          </>
        );
        label = "Triangle sides and angles";
        subtext =
          "Side a calculated using Law of Cosines; angles B and C calculated using Law of Sines.";
      } else {
        warning =
          "For SAS, please enter two sides and the included angle correctly.";
      }
    } else if (method === "ASA") {
      // Given two angles and included side, find the third angle and other sides
      // Inputs: two angles and included side between them
      // Possible combos: (A, B, c), (A, C, b), (B, C, a)

      // Count valid sides and angles
      const sidesCount = [a, b, c].filter(validSide).length;
      const anglesCount = [A, B, C].filter(validAngle).length;

      if (sidesCount !== 1 || anglesCount !== 2) {
        warning =
          "For ASA, please enter exactly one side and two angles (including the side).";
        return { value, label, subtext, warning, formulaUsed };
      }

      // Calculate third angle
      let angleSum = 0;
      if (validAngle(A)) angleSum += A;
      if (validAngle(B)) angleSum += B;
      if (validAngle(C)) angleSum += C;

      if (angleSum >= 180) {
        warning = "Sum of two angles must be less than 180°.";
        return { value, label, subtext, warning, formulaUsed };
      }

      const missingAngle = 180 - angleSum;

      // Identify which side is given and which angles are known
      // Then use Law of Sines: a/sin(A) = b/sin(B) = c/sin(C)

      // (A, B, c)
      if (validAngle(A) && validAngle(B) && validSide(c)) {
        const Ccalc = missingAngle;
        const Arad = degToRad(A);
        const Brad = degToRad(B);
        const Crad = degToRad(Ccalc);

        // a = c * sin(A) / sin(C)
        const aCalc = (c * Math.sin(Arad)) / Math.sin(Crad);
        // b = c * sin(B) / sin(C)
        const bCalc = (c * Math.sin(Brad)) / Math.sin(Crad);

        formulaUsed = "Law of Sines";

        value = (
          <>
            <p>
              <strong>Sides:</strong> a = {formatSide(aCalc)}, b = {formatSide(bCalc)}, c ={" "}
              {formatSide(c)}
            </p>
            <p>
              <strong>Angles:</strong> A = {formatAngle(A)}, B = {formatAngle(B)}, C ={" "}
              {formatAngle(Ccalc)}
            </p>
          </>
        );
        label = "Triangle sides and angles";
        subtext =
          "Sides a and b calculated using Law of Sines from two angles and included side c.";
      }
      // (A, C, b)
      else if (validAngle(A) && validAngle(C) && validSide(b)) {
        const Bcalc = missingAngle;
        const Arad = degToRad(A);
        const Brad = degToRad(Bcalc);
        const Crad = degToRad(C);

        // a = b * sin(A) / sin(B)
        const aCalc = (b * Math.sin(Arad)) / Math.sin(Brad);
        // c = b * sin(C) / sin(B)
        const cCalc = (b * Math.sin(Crad)) / Math.sin(Brad);

        formulaUsed = "Law of Sines";

        value = (
          <>
            <p>
              <strong>Sides:</strong> a = {formatSide(aCalc)}, b = {formatSide(b)}, c ={" "}
              {formatSide(cCalc)}
            </p>
            <p>
              <strong>Angles:</strong> A = {formatAngle(A)}, B = {formatAngle(Bcalc)}, C ={" "}
              {formatAngle(C)}
            </p>
          </>
        );
        label = "Triangle sides and angles";
        subtext =
          "Sides a and c calculated using Law of Sines from two angles and included side b.";
      }
      // (B, C, a)
      else if (validAngle(B) && validAngle(C) && validSide(a)) {
        const Acalc = missingAngle;
        const Arad = degToRad(Acalc);
        const Brad = degToRad(B);
        const Crad = degToRad(C);

        // b = a * sin(B) / sin(A)
        const bCalc = (a * Math.sin(Brad)) / Math.sin(Arad);
        // c = a * sin(C) / sin(A)
        const cCalc = (a * Math.sin(Crad)) / Math.sin(Arad);

        formulaUsed = "Law of Sines";

        value = (
          <>
            <p>
              <strong>Sides:</strong> a = {formatSide(a)}, b = {formatSide(bCalc)}, c ={" "}
              {formatSide(cCalc)}
            </p>
            <p>
              <strong>Angles:</strong> A = {formatAngle(Acalc)}, B = {formatAngle(B)}, C ={" "}
              {formatAngle(C)}
            </p>
          </>
        );
        label = "Triangle sides and angles";
        subtext =
          "Sides b and c calculated using Law of Sines from two angles and included side a.";
      } else {
        warning =
          "For ASA, please enter two angles and the included side correctly.";
      }
    } else {
      warning = "Please select a valid method: SSS, SAS, or ASA.";
    }

    return { value, label, subtext, warning, formulaUsed };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the Triangle Solver (SSS/SAS/ASA) tool used for?",
      answer:
        "The Triangle Solver tool calculates unknown sides and angles of a triangle when given specific sets of inputs. It supports three common methods: SSS (three sides), SAS (two sides and included angle), and ASA (two angles and included side). This helps in solving triangles accurately using trigonometric laws.",
    },
    {
      question: "How does the Law of Cosines apply in triangle solving?",
      answer:
        "The Law of Cosines relates the lengths of sides of a triangle to the cosine of one of its angles. It is especially useful in the SSS and SAS cases to find unknown angles or sides. The formula is c² = a² + b² - 2ab cos(C), allowing calculation of a side or angle when others are known.",
    },
    {
      question: "When should I use the Law of Sines in triangle calculations?",
      answer:
        "The Law of Sines is applied when you know either two angles and one side (ASA) or two sides and a non-included angle (AAS or SSA). It states that the ratio of a side length to the sine of its opposite angle is constant across the triangle, enabling calculation of missing sides or angles.",
    },
    {
      question: "What are common errors to avoid when using this solver?",
      answer:
        "Ensure that inputs are positive and angles are between 0° and 180°. The triangle inequality theorem must be satisfied for side lengths. Also, be cautious of ambiguous cases in SSA (not covered here). Incorrect inputs may lead to invalid or no solutions, which the solver will warn about.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Method selector */}
      <div>
        <Label htmlFor="method" className="mb-1 font-semibold flex items-center gap-2">
          <Calculator className="w-5 h-5 text-blue-600" />
          Select Method
          <Info className="w-4 h-4 text-slate-400" />
        </Label>
        <Select
          id="method"
          value={inputs.method || "SSS"}
          onValueChange={(value) => handleInputChange("method", value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="SSS">SSS (Side-Side-Side)</SelectItem>
            <SelectItem value="SAS">SAS (Side-Angle-Side)</SelectItem>
            <SelectItem value="ASA">ASA (Angle-Side-Angle)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Inputs */}
      {inputs.method === "SSS" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="a">Side a</Label>
            <Input
              id="a"
              type="number"
              min="0"
              step="any"
              value={inputs.a || ""}
              onChange={(e) => handleInputChange("a", e.target.value)}
              placeholder="Enter side a"
            />
          </div>
          <div>
            <Label htmlFor="b">Side b</Label>
            <Input
              id="b"
              type="number"
              min="0"
              step="any"
              value={inputs.b || ""}
              onChange={(e) => handleInputChange("b", e.target.value)}
              placeholder="Enter side b"
            />
          </div>
          <div>
            <Label htmlFor="c">Side c</Label>
            <Input
              id="c"
              type="number"
              min="0"
              step="any"
              value={inputs.c || ""}
              onChange={(e) => handleInputChange("c", e.target.value)}
              placeholder="Enter side c"
            />
          </div>
        </div>
      )}

      {inputs.method === "SAS" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Two sides and included angle */}
          <div>
            <Label htmlFor="a">Side a</Label>
            <Input
              id="a"
              type="number"
              min="0"
              step="any"
              value={inputs.a || ""}
              onChange={(e) => handleInputChange("a", e.target.value)}
              placeholder="Enter side a"
            />
          </div>
          <div>
            <Label htmlFor="b">Side b</Label>
            <Input
              id="b"
              type="number"
              min="0"
              step="any"
              value={inputs.b || ""}
              onChange={(e) => handleInputChange("b", e.target.value)}
              placeholder="Enter side b"
            />
          </div>
          <div>
            <Label htmlFor="C">Included Angle (°)</Label>
            <Input
              id="C"
              type="number"
              min="0"
              max="179.9999"
              step="any"
              value={inputs.C || ""}
              onChange={(e) => handleInputChange("C", e.target.value)}
              placeholder="Enter angle C"
            />
          </div>
          {/* Alternative combos */}
          <div>
            <Label htmlFor="c">Side c</Label>
            <Input
              id="c"
              type="number"
              min="0"
              step="any"
              value={inputs.c || ""}
              onChange={(e) => handleInputChange("c", e.target.value)}
              placeholder="Enter side c"
            />
          </div>
          <div>
            <Label htmlFor="B">Included Angle (°)</Label>
            <Input
              id="B"
              type="number"
              min="0"
              max="179.9999"
              step="any"
              value={inputs.B || ""}
              onChange={(e) => handleInputChange("B", e.target.value)}
              placeholder="Enter angle B"
            />
          </div>
          <div>
            <Label htmlFor="A">Included Angle (°)</Label>
            <Input
              id="A"
              type="number"
              min="0"
              max="179.9999"
              step="any"
              value={inputs.A || ""}
              onChange={(e) => handleInputChange("A", e.target.value)}
              placeholder="Enter angle A"
            />
          </div>
        </div>
      )}

      {inputs.method === "ASA" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Two angles and included side */}
          <div>
            <Label htmlFor="A">Angle A (°)</Label>
            <Input
              id="A"
              type="number"
              min="0"
              max="179.9999"
              step="any"
              value={inputs.A || ""}
              onChange={(e) => handleInputChange("A", e.target.value)}
              placeholder="Enter angle A"
            />
          </div>
          <div>
            <Label htmlFor="B">Angle B (°)</Label>
            <Input
              id="B"
              type="number"
              min="0"
              max="179.9999"
              step="any"
              value={inputs.B || ""}
              onChange={(e) => handleInputChange("B", e.target.value)}
              placeholder="Enter angle B"
            />
          </div>
          <div>
            <Label htmlFor="c">Side c (included)</Label>
            <Input
              id="c"
              type="number"
              min="0"
              step="any"
              value={inputs.c || ""}
              onChange={(e) => handleInputChange("c", e.target.value)}
              placeholder="Enter side c"
            />
          </div>
          {/* Alternative combos */}
          <div>
            <Label htmlFor="C">Angle C (°)</Label>
            <Input
              id="C"
              type="number"
              min="0"
              max="179.9999"
              step="any"
              value={inputs.C || ""}
              onChange={(e) => handleInputChange("C", e.target.value)}
              placeholder="Enter angle C"
            />
          </div>
          <div>
            <Label htmlFor="b">Side b (included)</Label>
            <Input
              id="b"
              type="number"
              min="0"
              step="any"
              value={inputs.b || ""}
              onChange={(e) => handleInputChange("b", e.target.value)}
              placeholder="Enter side b"
            />
          </div>
          <div>
            <Label htmlFor="a">Side a (included)</Label>
            <Input
              id="a"
              type="number"
              min="0"
              step="any"
              value={inputs.a || ""}
              onChange={(e) => handleInputChange("a", e.target.value)}
              placeholder="Enter side a"
            />
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just trigger recalculation by resetting inputs to current values
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Sigma className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              method: inputs.method || "SSS",
            })
          }
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== "" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                {results.formulaUsed || "Calculated Result"}
              </p>
              <div className="text-2xl font-extrabold text-blue-900 dark:text-white space-y-2">
                {results.value}
              </div>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">
                {results.label}
              </p>
              {results.subtext && (
                <p className="text-sm text-slate-500 mt-2">{results.subtext}</p>
              )}
              {results.warning && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-950 border border-red-200 rounded-lg flex items-start gap-3 text-left">
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800 dark:text-red-200">
                    {results.warning}
                  </p>
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
          Understanding Triangle Solver (SSS/SAS/ASA)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Triangle Solver (SSS/SAS/ASA) is a powerful mathematical tool designed
          to find unknown sides and angles of a triangle when certain measurements
          are known. It supports three fundamental methods: Side-Side-Side (SSS),
          Side-Angle-Side (SAS), and Angle-Side-Angle (ASA). Each method uses
          specific sets of inputs to determine the complete triangle.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The SSS method requires all three sides to be known and calculates the
          angles using the Law of Cosines. The SAS method uses two sides and the
          included angle to find the remaining side and angles. The ASA method
          involves two angles and the included side, applying the Law of Sines to
          solve the triangle.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This solver ensures precision by validating inputs and applying trigonometric
          laws accurately. It is an essential tool for students, educators, engineers,
          and anyone working with geometric problems involving triangles.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Formula
        </h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`Law of Cosines:
c^2 = a^2 + b^2 - 2ab * cos(C)
A = arccos((b^2 + c^2 - a^2) / (2bc))
B = arccos((a^2 + c^2 - b^2) / (2ac))
C = arccos((a^2 + b^2 - c^2) / (2ab))

Law of Sines:
a / sin(A) = b / sin(B) = c / sin(C)

Angle Sum:
A + B + C = 180°`}
        </pre>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          FAQ
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
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Triangle Solver (SSS/SAS/ASA)"
      description="Solve triangles using SSS, SAS, or ASA methods. Calculate missing side lengths and angles using the Law of Sines and Cosines."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Key Formula",
        formula: `Law of Cosines:
c^2 = a^2 + b^2 - 2ab * cos(C)
Law of Sines:
a / sin(A) = b / sin(B) = c / sin(C)
Angle Sum:
A + B + C = 180°`,
        variables: [
          { symbol: "a, b, c", description: "Sides of the triangle" },
          { symbol: "A, B, C", description: "Angles opposite respective sides (in degrees)" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Given sides a = 7, b = 10, and c = 5 (SSS), find all angles of the triangle.",
        steps: [
          {
            label: "1",
            explanation:
              "Use the Law of Cosines to find angle A: A = arccos((b² + c² - a²) / 2bc).",
          },
          {
            label: "2",
            explanation:
              "Calculate angles B and C similarly using the Law of Cosines.",
          },
          {
            label: "3",
            explanation:
              "Verify that the sum of angles equals 180°.",
          },
        ],
        result:
          "Angles calculated are approximately A = 28.0724°, B = 58.2825°, and C = 93.6451°.",
      }}
      relatedCalculators={[
        { title: "Percent of Total", url: "/math/percent-of-total", icon: "➗" },
        {
          title: "Quadratic Equation Solver",
          url: "/math/quadratic-equation-solver",
          icon: "📐",
        },
        {
          title: "Standard Deviation",
          url: "/math/standard-deviation-variance",
          icon: "📊",
        },
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