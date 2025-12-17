import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ SAFE ICONS ONLY
import { Atom, Scale, Info, RotateCcw, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function DensitySpecificGravityCalculator() {
  // Inputs: mass (kg or g), volume (m³ or cm³ or L), fluid density for specific gravity (optional)
  const [inputs, setInputs] = useState({
    mass: "",
    massUnit: "kg",
    volume: "",
    volumeUnit: "m3",
    fluidDensity: "",
    fluidDensityUnit: "kg/m3",
  });

  const handleInputChange = useCallback((name: string, value: string) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Constants
  const G = 9.81; // m/s², not directly needed here but scientific constant example

  // Unit conversion helpers
  const convertMassToKg = (mass: number, unit: string) => {
    switch (unit) {
      case "kg":
        return mass;
      case "g":
        return mass / 1000;
      default:
        return mass;
    }
  };

  const convertVolumeToM3 = (volume: number, unit: string) => {
    switch (unit) {
      case "m3":
        return volume;
      case "cm3":
        return volume / 1e6; // 1 cm³ = 1e-6 m³
      case "L":
        return volume / 1000; // 1 L = 0.001 m³
      default:
        return volume;
    }
  };

  const convertDensityToKgPerM3 = (density: number, unit: string) => {
    switch (unit) {
      case "kg/m3":
        return density;
      case "g/cm3":
        return density * 1000; // 1 g/cm³ = 1000 kg/m³
      default:
        return density;
    }
  };

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    // Parse inputs
    const massNum = parseFloat(inputs.mass);
    const volumeNum = parseFloat(inputs.volume);
    const fluidDensityNum = parseFloat(inputs.fluidDensity);

    // Validation
    if (
      isNaN(massNum) ||
      massNum <= 0 ||
      isNaN(volumeNum) ||
      volumeNum <= 0
    ) {
      return {
        value: "Waiting...",
        label: "Enter valid positive mass and volume",
        subtext: "",
        warning: null,
        formulaUsed: null,
      };
    }

    // Convert inputs to SI units
    const massKg = convertMassToKg(massNum, inputs.massUnit);
    const volumeM3 = convertVolumeToM3(volumeNum, inputs.volumeUnit);

    // Calculate density (ρ = m / V)
    const density = massKg / volumeM3; // kg/m³

    // Specific gravity (SG = ρ_object / ρ_fluid)
    let specificGravity: number | null = null;
    let warning: string | null = null;
    if (!isNaN(fluidDensityNum) && fluidDensityNum > 0) {
      const fluidDensityKgM3 = convertDensityToKgPerM3(
        fluidDensityNum,
        inputs.fluidDensityUnit
      );
      specificGravity = density / fluidDensityKgM3;
      if (specificGravity <= 0) {
        warning = "Specific Gravity must be positive.";
      }
    }

    // Formatting results
    const formatValue = (val: number, unit: string) => {
      if (val >= 10000 || val < 0.001) {
        return `${val.toExponential(4)} ${unit}`;
      }
      return `${val.toFixed(4)} ${unit}`;
    };

    const densityDisplay = formatValue(density, "kg/m³");
    const specificGravityDisplay =
      specificGravity !== null
        ? specificGravity.toFixed(4)
        : "N/A (Enter fluid density)";

    return {
      value: densityDisplay,
      label: "Density",
      subtext: specificGravity !== null ? `Specific Gravity: ${specificGravityDisplay} (unitless)` : "Enter fluid density to calculate Specific Gravity",
      warning,
      formulaUsed: "Density (ρ) = Mass (m) / Volume (V)",
    };
  }, [inputs]);

  // 3. FAQS
  const faqs = [
    {
      question: "What is density and why is it important?",
      answer:
        "Density is the mass per unit volume of a substance, typically expressed in kilograms per cubic meter (kg/m³). It is a fundamental physical property that helps identify materials and predict their behavior in different environments. Engineers, scientists, and manufacturers use density to design structures, select materials, and ensure safety and efficiency in applications ranging from aerospace to food production.",
    },
    {
      question: "How is specific gravity different from density?",
      answer:
        "Specific gravity is a dimensionless quantity that compares the density of a substance to the density of a reference fluid, usually water at 4°C. Unlike density, which has units, specific gravity is unitless and indicates whether a substance will float or sink in the reference fluid. It is widely used in industries such as petroleum, mining, and hydrometry to characterize liquids and solids.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="mass" className="flex items-center gap-1 font-semibold">
            <Scale className="w-4 h-4 text-blue-600" /> Mass
          </Label>
          <div className="flex gap-2 mt-1">
            <Input
              id="mass"
              type="number"
              min="0"
              step="any"
              placeholder="e.g. 500"
              value={inputs.mass}
              onChange={(e) => handleInputChange("mass", e.target.value)}
              aria-describedby="mass-help"
            />
            <Select
              value={inputs.massUnit}
              onValueChange={(val) => handleInputChange("massUnit", val)}
              aria-label="Mass unit"
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kg">kg</SelectItem>
                <SelectItem value="g">g</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p id="mass-help" className="text-xs text-slate-500 mt-1">
            Enter mass of the object.
          </p>
        </div>

        <div>
          <Label htmlFor="volume" className="flex items-center gap-1 font-semibold">
            <Scale className="w-4 h-4 text-blue-600" /> Volume
          </Label>
          <div className="flex gap-2 mt-1">
            <Input
              id="volume"
              type="number"
              min="0"
              step="any"
              placeholder="e.g. 0.002"
              value={inputs.volume}
              onChange={(e) => handleInputChange("volume", e.target.value)}
              aria-describedby="volume-help"
            />
            <Select
              value={inputs.volumeUnit}
              onValueChange={(val) => handleInputChange("volumeUnit", val)}
              aria-label="Volume unit"
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="m3">m³</SelectItem>
                <SelectItem value="cm3">cm³</SelectItem>
                <SelectItem value="L">L</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p id="volume-help" className="text-xs text-slate-500 mt-1">
            Enter volume of the object.
          </p>
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="fluidDensity" className="flex items-center gap-1 font-semibold">
            <Scale className="w-4 h-4 text-blue-600" /> Fluid Density (for Specific Gravity)
          </Label>
          <div className="flex gap-2 mt-1 max-w-xs">
            <Input
              id="fluidDensity"
              type="number"
              min="0"
              step="any"
              placeholder="e.g. 1000"
              value={inputs.fluidDensity}
              onChange={(e) => handleInputChange("fluidDensity", e.target.value)}
              aria-describedby="fluidDensity-help"
            />
            <Select
              value={inputs.fluidDensityUnit}
              onValueChange={(val) => handleInputChange("fluidDensityUnit", val)}
              aria-label="Fluid density unit"
            >
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kg/m3">kg/m³</SelectItem>
                <SelectItem value="g/cm3">g/cm³</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p id="fluidDensity-help" className="text-xs text-slate-500 mt-1">
            Optional: Enter fluid density to calculate specific gravity.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No explicit action needed, calculation is reactive
          }}
          aria-label="Calculate density and specific gravity"
        >
          <Atom className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              mass: "",
              massUnit: "kg",
              volume: "",
              volumeUnit: "m3",
              fluidDensity: "",
              fluidDensityUnit: "kg/m3",
            })
          }
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== "Waiting..." && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                {results.formulaUsed || "Calculated Result"}
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
                {results.value}
              </p>
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

          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex gap-3">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong>Science Fact:</strong> Always check your units (e.g., convert grams to kg and cm³ to m³) to ensure accurate density calculations.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Density / Specific Gravity Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Density is a fundamental physical property defined as the mass of an object divided by its volume. It quantifies how compact or concentrated matter is within a given space. Specific gravity, on the other hand, is a ratio comparing the density of a substance to the density of a reference fluid, typically water at 4°C. This calculator helps determine these values precisely by allowing you to input mass and volume in various units and optionally compare with fluid density to find specific gravity.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          These concepts are essential in many scientific and engineering fields. For example, in material science, density helps identify substances and assess purity. In civil engineering, it informs the choice of materials for construction to ensure stability and safety. Specific gravity is widely used in hydrometry, petroleum industry, and quality control to characterize liquids and solids.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Accurate density and specific gravity measurements are critical for designing equipment, predicting behavior under different conditions, and ensuring compliance with safety standards. This tool provides a reliable and educational way to perform these calculations with clear unit handling and scientific rigor.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Formula & Variables
        </h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`Density (ρ) = Mass (m) / Volume (V)

Where:
  ρ = Density (kg/m³)
  m = Mass (kg)
  V = Volume (m³)

Specific Gravity (SG) = ρ_object / ρ_fluid

Where:
  SG = Specific Gravity (unitless)
  ρ_object = Density of the object (kg/m³)
  ρ_fluid = Density of the reference fluid (kg/m³)`}
        </pre>
      </section>

      <section id="example" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Step-by-Step Example
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Let's solve a real-world problem to calculate the density and specific gravity of a metal sample.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Given:</strong> Mass = 500 g, Volume = 200 cm³, Fluid density (water) = 1 g/cm³
          </li>
          <li>
            <strong>Step 1:</strong> Convert mass to kilograms: 500 g = 0.5 kg. Convert volume to cubic meters: 200 cm³ = 0.0002 m³.
          </li>
          <li>
            <strong>Step 2:</strong> Calculate density: ρ = 0.5 kg / 0.0002 m³ = 2500 kg/m³.
          </li>
          <li>
            <strong>Step 3:</strong> Convert fluid density to kg/m³: 1 g/cm³ = 1000 kg/m³.
          </li>
          <li>
            <strong>Step 4:</strong> Calculate specific gravity: SG = 2500 / 1000 = 2.5 (unitless).
          </li>
          <li>
            <strong>Result:</strong> Density = 2500 kg/m³, Specific Gravity = 2.5.
          </li>
        </ul>
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
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Density / Specific Gravity Calculator"
      description="Calculate Density and Specific Gravity. Determine the mass-to-volume ratio of solids, liquids, and gases."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: `Density (ρ) = Mass (m) / Volume (V)\nSpecific Gravity (SG) = ρ_object / ρ_fluid`,
        variables: [
          { symbol: "ρ", description: "Density (kg/m³)" },
          { symbol: "m", description: "Mass (kg)" },
          { symbol: "V", description: "Volume (m³)" },
          { symbol: "SG", description: "Specific Gravity (unitless)" },
          { symbol: "ρ_fluid", description: "Density of reference fluid (kg/m³)" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Calculate the density and specific gravity of a metal sample with mass 500 g and volume 200 cm³, using water as the reference fluid.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert mass to kilograms and volume to cubic meters: 500 g = 0.5 kg, 200 cm³ = 0.0002 m³.",
          },
          {
            label: "2",
            explanation: "Calculate density: ρ = 0.5 kg / 0.0002 m³ = 2500 kg/m³.",
          },
          {
            label: "3",
            explanation:
              "Convert fluid density (water) to kg/m³: 1 g/cm³ = 1000 kg/m³.",
          },
          {
            label: "4",
            explanation: "Calculate specific gravity: SG = 2500 / 1000 = 2.5.",
          },
        ],
        result: "Density = 2500 kg/m³, Specific Gravity = 2.5 (unitless).",
      }}
      relatedCalculators={[
        { title: "Snell's Law", url: "/science/snells-law", icon: "🌈" },
        { title: "Orbital Period", url: "/science/orbital-period", icon: "🪐" },
        { title: "Kinematics Equations (SUVAT)", url: "/science/kinematics-equations", icon: "🚀" },
        { title: "Molarity Calculator", url: "/science/molarity-calculator", icon: "🧪" },
        { title: "Photon Energy", url: "/science/photon-energy", icon: "⚡" },
        { title: "Ideal Gas Law", url: "/science/ideal-gas-law", icon: "🎈" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding" },
        { id: "formula", label: "Formula" },
        { id: "example", label: "Example" },
        { id: "faq", label: "FAQ" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}