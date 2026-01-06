// src/data/mathCatalog.ts
import React from "react";
import {
  Calculator,
  Shapes,
  Sigma,
  Binary,
  Percent,
  Divide,
  LineChart,
  Triangle,
  Pi,
  Braces,
  Library,
} from "lucide-react";

export type MathItem = { label: string; slug: string };
export type MathGroup = { title: string; items: MathItem[] };
export type MathSubcat = {
  slug: string;
  title: string;
  icon: React.ReactNode;
  colorBg: string;
  colorFg: string;
  groups: MathGroup[];
};

// tiny helper para slug
const s = (t: string) =>
  t
    .toLowerCase()
    .replace(/–|—/g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const MATH_SUBCATS: MathSubcat[] = [
  {
    slug: "basic-arithmetic",
    title: "Arithmetic & Basic Math",
    icon: <Calculator className="h-5 w-5" />,
    colorBg: "rgba(92,130,238,0.16)",
    colorFg: "#5c82ee",
    groups: [
      {
        title: "Core Tools",
        items: [
          { label: "Basic Calculator", slug: s("Basic Calculator") },
          { label: "Scientific Calculator", slug: s("Scientific Calculator") },
          { label: "Order of Operations (PEMDAS)", slug: s("Order of Operations") },
          { label: "Exponent & Power", slug: s("Exponent Calculator") },
          { label: "Factorial (n!)", slug: s("Factorial Calculator") },
          { label: "Standard Form", slug: s("Standard Form Calculator") },
          { label: "Scientific Notation", slug: s("Scientific Notation Calculator and Converter") },
          { label: "Significant Figures (Sig Fig)", slug: s("Sig Fig Calculator (Significant Figures)") },
          { label: "Rounding", slug: s("Rounding Calculator") },
          { label: "Round to Nearest Cent", slug: s("Round to the Nearest Cent Calculator") },
          { label: "Long Division", slug: s("Long Division Calculator") },
          { label: "Numbers to Words", slug: s("Numbers to Words Converter") },
          { label: "Least to Greatest", slug: s("Least to Greatest Calculator") },
          { label: "Average Rate of Change", slug: s("Average Rate of Change Calculator") },
          { label: "Unit Rate", slug: s("Unit Rate Calculator") },
          { label: "Remainder", slug: s("Remainder Calculator") },
        ],
      },
    ],
  },

  {
    slug: "fractions-ratios",
    title: "Fractions & Ratios",
    icon: <Divide className="h-5 w-5" />,
    colorBg: "rgba(60,131,246,0.16)",
    colorFg: "#3c83f6",
    groups: [
      {
        title: "Fractions",
        items: [
          { label: "Fraction Calculator", slug: s("Fraction Calculator") },
          { label: "Add Fractions", slug: s("Adding Fractions Calculator") },
          { label: "Subtract Fractions", slug: s("Subtracting Fractions Calculator") },
          { label: "Compare Fractions", slug: s("Comparing Fractions Calculator") },
          { label: "Decimal ↔ Fraction", slug: s("Decimal to Fraction Calculator") },
          { label: "Fraction Simplifier / Reducer", slug: s("Fraction Simplifier – Fraction Reducer") },
          { label: "Fraction ↔ Decimal", slug: s("Fraction to Decimal Calculator") },
          { label: "Fraction ↔ Percent", slug: s("Fraction to Percent Calculator") },
          { label: "Fraction ↔ Ratio", slug: s("Fraction to Ratio Calculator") },
          { label: "Improper ↔ Mixed", slug: s("Improper Fraction to Mixed Number Calculator") },
          { label: "Mixed ↔ Improper", slug: s("Mixed Number to Improper Fraction Calculator") },
          { label: "Mixed Number Calculator", slug: s("Mixed Number Calculator") },
          { label: "Solve for Unknown Fraction", slug: s("Solve For Unknown Fraction Calculator") },
          { label: "Inch Fraction", slug: s("Inch Fraction Calculator") },
          { label: "LCD / Least Common Denominator", slug: s("Least Common Denominator Calculator") },
        ],
      },
      {
        title: "Guides & Charts",
        items: [
          { label: "Common Fraction ↔ Percent Equivalents", slug: s("Common Fraction and Percent Equivalents") },
          { label: "Common Fractions with Decimal Equivalents", slug: s("Common Fractions with Decimal Equivalents") },
          { label: "Equivalent Fractions Chart", slug: s("Equivalent Fractions Chart") },
        ],
      },
      {
        title: "Ratios",
        items: [
          { label: "Ratio Calculator", slug: s("Ratio Calculator") },
          { label: "Ratio Simplifier", slug: s("Ratio Simplifier") },
          { label: "Ratio ↔ Decimal", slug: s("Ratio to Decimal Calculator") },
          { label: "Ratio ↔ Fraction", slug: s("Ratio to Fraction Calculator") },
          { label: "Ratio ↔ Percentage", slug: s("Ratio to Percentage Calculator") },
          { label: "Decimal ↔ Ratio", slug: s("Decimal to Ratio Calculator") },
        ],
      },
    ],
  },

  {
    slug: "geometry",
    title: "Geometry Calculators",
    icon: <Shapes className="h-5 w-5" />,
    colorBg: "rgba(16,185,129,0.14)",
    colorFg: "#10b981",
    groups: [
      {
        title: "Area & Perimeter",
        items: [
          { label: "Area (Multi-shape)", slug: s("Area Calculator") },
          { label: "Perimeter (Multi-shape)", slug: s("Perimeter Calculator") },
          { label: "Rectangle Calculator", slug: s("Rectangle Calculator") },
          { label: "Parallelogram Area", slug: s("Parallelogram Area Calculator") },
          { label: "Rhombus Calculator", slug: s("Rhombus Calculator") },
          { label: "Trapezoid Area", slug: s("Trapezoid Area Calculator") },
          { label: "Polygon Calculator", slug: s("Polygon Calculator") },
          { label: "Hexagon Calculator", slug: s("Hexagon Calculator") },
          { label: "Octagon Calculator", slug: s("Octagon Calculator") },
          { label: "Sector Area", slug: s("Sector Area Calculator") },
          { label: "Segment Area", slug: s("Segment Area Calculator") },
        ],
      },
      {
        title: "Circle & Arc",
        items: [
          { label: "Circle Calculator", slug: s("Circle Calculator") },
          { label: "Circumference", slug: s("Circumference Calculator") },
          { label: "Circumference → Diameter", slug: s("Circumference to Diameter Calculator") },
          { label: "Radius", slug: s("Radius Calculator") },
          { label: "Area of a Circle", slug: s("Area of a Circle Calculator") },
          { label: "Arc Length", slug: s("Arc Length Calculator") },
          { label: "Ellipse", slug: s("Ellipse Calculator") },
        ],
      },
      {
        title: "Surface Area & Volume",
        items: [
          { label: "Volume (Multi-shape)", slug: s("Volume Calculator - Find Volume") },
          { label: "Surface Area (Multi-shape)", slug: s("Surface Area Calculator") },
          { label: "Cone Volume", slug: s("Cone Volume Calculator") },
          { label: "Barrel Volume / Capacity", slug: s("Barrel Volume and Capacity Calculator") },
        ],
      },
      {
        title: "Unit Converters",
        items: [
          { label: "Angle Unit Converter", slug: s("Angle Unit Conversion - Convert Angle") },
          { label: "Area Unit Converter", slug: s("Area Unit Conversion - Convert Area") },
          { label: "Volume Unit Converter", slug: s("Volume Unit Conversion - Convert Volume") },
        ],
      },
    ],
  },

  {
    slug: "grades-gpa",
    title: "Grades & GPA",
    icon: <Library className="h-5 w-5" />,
    colorBg: "rgba(74,222,128,0.16)",
    colorFg: "#16a34a",
    groups: [
      {
        title: "Grade & GPA",
        items: [
          { label: "Grade Calculator", slug: s("Grade Calculator") },
          { label: "Final Grade Calculator", slug: s("Final Grade Calculator") },
          { label: "Test Grade Calculator", slug: s("Test Grade Calculator") },
          { label: "Weighted Grade Calculator", slug: s("Weighted Grade Calculator") },
          { label: "Marks Percentage Calculator", slug: s("Marks Percentage Calculator") },
          { label: "GPA Calculator", slug: s("GPA Calculator") },
          { label: "High School GPA", slug: s("High School GPA Calculator") },
          { label: "College GPA", slug: s("College GPA Calculator") },
          { label: "GPA ↔ Letter Grade", slug: s("GPA to Letter Grade Calculator") },
          { label: "Letter Grade ↔ GPA", slug: s("Letter Grade to GPA Calculator") },
          { label: "Semester Grade Calculator", slug: s("Semester Grade Calculator") },
        ],
      },
    ],
  },

  {
    slug: "number-systems",
    title: "Number Systems & Conversions",
    icon: <Binary className="h-5 w-5" />,
    colorBg: "rgba(249,115,22,0.14)",
    colorFg: "#f97316",
    groups: [
      {
        title: "Base Converters",
        items: [
          { label: "Base Converter (2/8/10/16)", slug: s("Base Converter") },
          { label: "Binary Calculator & Converter", slug: s("Binary Calculator & Converter") },
          { label: "Decimal ↔ Binary", slug: s("Decimal to Binary Converter") },
          { label: "Binary ↔ Decimal", slug: s("Binary to Decimal Converter") },
          { label: "Hexadecimal Calculator & Converter", slug: s("Hexadecimal Calculator & Converter") },
          { label: "Decimal ↔ Hexadecimal", slug: s("Decimal to Hexadecimal Converter") },
          { label: "Hexadecimal ↔ Decimal", slug: s("Hexadecimal to Decimal Converter") },
          { label: "Octal Calculator & Converter", slug: s("Octal Calculator & Converter") },
          { label: "Decimal ↔ Octal", slug: s("Decimal to Octal Converter") },
          { label: "Octal ↔ Decimal", slug: s("Octal to Decimal Converter") },
          { label: "Binary ↔ Hex", slug: s("Binary to Hexadecimal Converter") },
          { label: "Hex ↔ Binary", slug: s("Hexadecimal to Binary Converter") },
          { label: "Binary ↔ Octal", slug: s("Binary to Octal Converter") },
          { label: "Octal ↔ Binary", slug: s("Octal to Binary Converter") },
          { label: "Hex ↔ Octal", slug: s("Hexadecimal to Octal Converter") },
          { label: "Octal ↔ Hex", slug: s("Octal to Hexadecimal Converter") },
          { label: "Base Calculator", slug: s("Base Calculator") },
        ],
      },
    ],
  },

  {
    slug: "percentages",
    title: "Percentage Calculators",
    icon: <Percent className="h-5 w-5" />,
    colorBg: "rgba(250,204,21,0.18)",
    colorFg: "#ca8a04",
    groups: [
      {
        title: "Percent",
        items: [
          { label: "Percentage Calculator", slug: s("Percentage Calculator") },
          { label: "Percent Change", slug: s("Percent Change Calculator") },
          { label: "Percent Increase", slug: s("Percent Increase Calculator") },
          { label: "Percent Decrease", slug: s("Percent Decrease Calculator") },
          { label: "Percent Difference", slug: s("Percent Difference Calculator") },
          { label: "Percent Error", slug: s("Percent Error Calculator") },
          { label: "Percent of a Percent", slug: s("Percent of a Percent Calculator") },
          { label: "Percent ↔ Decimal", slug: s("Percent to Decimal Calculator") },
          { label: "Decimal ↔ Percent", slug: s("Decimal to Percent Calculator") },
          { label: "Percent ↔ Fraction", slug: s("Percent to Fraction Calculator") },
          { label: "Percent ↔ Ratio", slug: s("Percent to Ratio Calculator") },
          { label: "Percent to Total", slug: s("Percent to Total Calculator") },
        ],
      },
    ],
  },

  {
    slug: "ratios",
    title: "Ratio Calculators",
    icon: <Divide className="h-5 w-5" />,
    colorBg: "rgba(14,165,233,0.16)",
    colorFg: "#0ea5e9",
    groups: [
      {
        title: "Ratios",
        items: [
          { label: "Ratio Calculator", slug: s("Ratio Calculator") },
          { label: "Ratio Simplifier", slug: s("Ratio Simplifier") },
          { label: "Ratio ↔ Decimal", slug: s("Ratio to Decimal Calculator") },
          { label: "Ratio ↔ Fraction", slug: s("Ratio to Fraction Calculator") },
          { label: "Ratio ↔ Percentage", slug: s("Ratio to Percentage Calculator") },
          { label: "Decimal ↔ Ratio", slug: s("Decimal to Ratio Calculator") },
        ],
      },
    ],
  },

  {
    slug: "slope-lines-vectors",
    title: "Lines, Slope & Vectors",
    icon: <LineChart className="h-5 w-5" />,
    colorBg: "rgba(147,197,253,0.18)",
    colorFg: "#2563eb",
    groups: [
      {
        title: "Lines & Slope",
        items: [
          { label: "Slope Calculator", slug: s("Slope Calculator") },
          { label: "Rise over Run → % & Degrees", slug: s("Rise Over Run to Percent Slope Calculator") },
          { label: "Rise over Run → Degrees", slug: s("Rise Over Run to Degrees Calculator") },
          { label: "Point-Slope Form", slug: s("Point-Slope Form Calculator") },
          { label: "Slope-Intercept Form", slug: s("Slope-Intercept Form Calculator") },
          { label: "Equation of a Line", slug: s("Equation of a Line Calculator") },
          { label: "X & Y Intercepts", slug: s("X and Y Intercept Calculator") },
          { label: "Midpoint", slug: s("Midpoint Calculator") },
          { label: "Endpoint", slug: s("Endpoint Calculator") },
          { label: "Distance Between Two Points", slug: s("Distance Between Two Points Calculator") },
          { label: "Degrees ↔ DMS", slug: s("Degrees, Minutes, Seconds to Decimal Calculator") },
          { label: "DMS ↔ Degrees", slug: s("Degrees to Degrees, Minutes, Seconds Calculator") },
        ],
      },
      {
        title: "Vectors",
        items: [
          { label: "Vector Calculator (components)", slug: s("Vector Calculator") },
          { label: "Vector Addition", slug: s("Vector Addition Calculator") },
          { label: "Vector Subtraction", slug: s("Vector Subtraction Calculator") },
          { label: "Dot Product", slug: s("Dot Product Calculator") },
          { label: "Cross Product", slug: s("Cross Product Calculator") },
          { label: "Unit Vector", slug: s("Unit Vector Calculator") },
          { label: "Vector Magnitude / Norm", slug: s("Vector Magnitude Calculator") },
          { label: "Vector Projection", slug: s("Vector Projection Calculator") },
          { label: "Angle Between Two Vectors", slug: s("Angle Between Two Vectors Calculator") },
        ],
      },
    ],
  },

  {
    slug: "statistics-probability",
    title: "Statistics & Probability",
    icon: <Sigma className="h-5 w-5" />,
    colorBg: "rgba(234,179,8,0.18)",
    colorFg: "#ca8a04",
    groups: [
      {
        title: "Descriptive Statistics",
        items: [
          { label: "Mean / Median / Mode", slug: s("Mean, Median, Mode Calculator") },
          { label: "Mean", slug: s("Mean Calculator") },
          { label: "Median", slug: s("Median Calculator") },
          { label: "Mode", slug: s("Mode Calculator") },
          { label: "Range", slug: s("Range Calculator") },
          { label: "Midrange", slug: s("Midrange Calculator") },
          { label: "Quartiles / IQR", slug: s("Quartile Calculator – IQR Calculator") },
          { label: "Weighted Average", slug: s("Weighted Average Calculator") },
          { label: "Mean Absolute Deviation", slug: s("Mean Absolute Deviation Calculator") },
          { label: "Coefficient of Variation", slug: s("Coefficient of Variation Calculator") },
          { label: "Sum of Squares", slug: s("Sum of Squares Calculator") },
          { label: "Standard Error", slug: s("Standard Error Calculator") },
          { label: "Relative Standard Deviation", slug: s("Relative Standard Deviation Calculator") },
        ],
      },
      {
        title: "Inference & Distributions",
        items: [
          { label: "Standard Deviation & Variance", slug: s("Standard Deviation Calculator") },
          { label: "Variance", slug: s("Variance Calculator") },
          { label: "Z-Score", slug: s("Z-Score Calculator") },
          { label: "Percentile", slug: s("Percentile Calculator") },
          { label: "Confidence Interval", slug: s("Confidence Interval Calculator") },
          { label: "Margin of Error", slug: s("Margin of Error Calculator") },
          { label: "t-Test", slug: s("T-Test Calculator") },
          { label: "p-Value", slug: s("P-Value Calculator") },
          { label: "Normal Distribution", slug: s("Normal Distribution Calculator") },
          { label: "Binomial Distribution", slug: s("Binomial Distribution Calculator") },
          { label: "Poisson Distribution", slug: s("Poisson Distribution Calculator") },
          { label: "Probability Calculator", slug: s("Probability Calculator") },
          { label: "Probability Distributions", slug: s("Probability Distribution Calculator") },
          { label: "Central Limit Theorem", slug: s("Central Limit Theorem Calculator") },
          { label: "Empirical Rule", slug: s("Empirical Rule Calculator") },
          { label: "Bayes’ Theorem", slug: s("Bayes’ Theorem Calculator") },
          { label: "Outlier", slug: s("Outlier Calculator") },
        ],
      },
      {
        title: "Tables & Extras",
        items: [
          { label: "Z Table", slug: s("Z Table") },
          { label: "T Table", slug: s("T Table") },
          { label: "Winning Percentage", slug: s("Winning Percentage Calculator") },
          { label: "Statistics Calculator", slug: s("Statistics Calculator") },
        ],
      },
    ],
  },

  {
    slug: "triangles",
    title: "Triangle Calculators",
    icon: <Triangle className="h-5 w-5" />,
    colorBg: "rgba(251,191,36,0.16)",
    colorFg: "#f59e0b",
    groups: [
      {
        title: "Triangles",
        items: [
          { label: "Triangle Calculator", slug: s("Triangle Calculator") },
          { label: "Triangle Area", slug: s("Triangle Area Calculator") },
          { label: "Triangle Perimeter", slug: s("Triangle Perimeter Calculator") },
          { label: "Triangle Height", slug: s("Triangle Height Calculator") },
          { label: "Right Triangle / Hypotenuse", slug: s("Right Triangle Calculator") },
          { label: "Pythagorean Theorem", slug: s("Pythagorean Theorem Calculator") },
          { label: "Equilateral Triangle", slug: s("Equilateral Triangle Calculator") },
          { label: "Isosceles Triangle", slug: s("Isosceles Triangle Calculator") },
          { label: "30-60-90 Triangle", slug: s("30 60 90 Triangle Calculator") },
          { label: "45-45-90 Triangle", slug: s("45 45 90 Triangle Calculator") },
          { label: "Heron’s Formula", slug: s("Heron’s Formula Calculator") },
          { label: "SOHCAHTOA", slug: s("SOHCAHTOA Calculator") },
          { label: "Law of Sines", slug: s("Law of Sines Calculator") },
          { label: "Law of Cosines", slug: s("Law of Cosines Calculator") },
        ],
      },
    ],
  },

  {
    slug: "trigonometry",
    title: "Trigonometry Calculators",
    icon: <Pi className="h-5 w-5" />,
    colorBg: "rgba(99,102,241,0.14)",
    colorFg: "#6366f1",
    groups: [
      {
        title: "Trig Functions & Angles",
        items: [
          { label: "Trigonometry Calculator", slug: s("Trigonometry Calculator") },
          { label: "Sine / Cosine / Tangent", slug: s("Sine Calculator – Calculate sin(x)") },
          { label: "Inverse Sine (arcsin)", slug: s("Inverse Sine Calculator – Calculate arcsin(x)") },
          { label: "Cosine / Secant", slug: s("Cosine Calculator – Calculate cos(x)") },
          { label: "Inverse Cosine (arccos)", slug: s("Inverse Cosine Calculator – Calculate arccos(x)") },
          { label: "Tangent / Cotangent", slug: s("Tangent Calculator – Calculate tan(x)") },
          { label: "Inverse Tangent (arctan)", slug: s("Inverse Tangent Calculator – Calculate arctan(x)") },
          { label: "Secant (sec)", slug: s("Secant Calculator – Calculate sec(x)") },
          { label: "Cosecant (csc)", slug: s("Cosecant Calculator – Calculate csc(x)") },
          { label: "Cotangent (cot)", slug: s("Cotangent Calculator – Calculate cot(x)") },
          { label: "Double Angle", slug: s("Double Angle Calculator") },
          { label: "Half Angle", slug: s("Half Angle Calculator") },
          { label: "Coterminal Angle", slug: s("Coterminal Angle Calculator") },
          { label: "Reference Angle", slug: s("Reference Angle Calculator") },
          { label: "Unit Circle", slug: s("Unit Circle Calculator") },
          { label: "Angle of Elevation", slug: s("Angle of Elevation Calculator") },
          { label: "Angle of Depression", slug: s("Angle of Depression Calculator") },
        ],
      },
      {
        title: "Angle Converters",
        items: [
          { label: "Degrees ↔ Radians ↔ Mrad", slug: s("Angle Unit Conversion - Convert Angle") },
          { label: "Degrees ↔ DMS", slug: s("Degrees, Minutes, Seconds to Decimal Calculator") },
          { label: "DMS ↔ Degrees", slug: s("Degrees to Degrees, Minutes, Seconds Calculator") },
        ],
      },
    ],
  },

  {
    slug: "more-math",
    title: "More Math Calculators",
    icon: <Braces className="h-5 w-5" />,
    colorBg: "rgba(148,163,184,0.16)",
    colorFg: "#334155",
    groups: [
      {
        title: "Algebra & Growth",
        items: [
          { label: "Quadratic Formula", slug: s("Quadratic Formula Calculator") },
          { label: "Greatest Common Factor", slug: s("Greatest Common Factor Calculator") },
          { label: "Least Common Multiple", slug: s("Least Common Multiple Calculator") },
          { label: "Prime Factorization", slug: s("Prime Factorization Calculator") },
          { label: "Exponential Growth", slug: s("Exponential Growth Calculator") },
          { label: "Exponential Decay", slug: s("Exponential Decay Calculator") },
          { label: "Doubling Time", slug: s("Doubling Time Calculator") },
          { label: "Fibonacci Sequence", slug: s("Fibonacci Sequence Calculator") },
          { label: "Golden Ratio", slug: s("Golden Ratio Calculator") },
          { label: "Euclidean Algorithm", slug: s("Euclidean Algorithm Calculator") },
          { label: "Vertex Form", slug: s("Vertex Form Calculator") },
          { label: "Standard Form", slug: s("Standard Form Calculator") },
        ],
      },
    ],
  },

  {
    slug: "resources",
    title: "Printable & Learning Resources",
    icon: <Library className="h-5 w-5" />,
    colorBg: "rgba(234,88,12,0.14)",
    colorFg: "#ea580c",
    groups: [
      {
        title: "Guides & Printables",
        items: [
          { label: "Interactive Analog Clock", slug: s("Interactive Analog Clock") },
          { label: "How to Use a Protractor", slug: s("How to Use a Protractor") },
          { label: "Ruler: Info & Types", slug: s("Ruler Information, Uses, and Types") },
          { label: "Printable Protractor", slug: s("Printable Protractor") },
          { label: "Printable Rulers (12\")", slug: s("Printable Rulers – Free 12″ Rulers") },
          { label: "Printable Tape Measure (60\")", slug: s("Printable Tape Measure – Free 60″ Measuring Tape") },
          { label: "How to Read a Ruler", slug: s("How to Read a Ruler") },
        ],
      },
    ],
  },
];

// helpers
export const getMathSubcat = (slug?: string) =>
  MATH_SUBCATS.find((c) => c.slug === slug);

export const getMathCounts = () =>
  MATH_SUBCATS.map((c) => ({
    slug: c.slug,
    title: c.title,
    count: c.groups.reduce((acc, g) => acc + g.items.length, 0),
    icon: c.icon,
    colorBg: c.colorBg,
    colorFg: c.colorFg,
  }));
