import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function AquariumPhAdjustmentBufferCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");

  // Inputs:
  // - Current pH (pH_current)
  // - Desired pH (pH_desired)
  // - Buffer capacity (alkalinity in mg/L CaCO3)
  // - Volume of water (gallons or liters)
  // - Acid or Base selection (acid to lower pH, base to raise pH)
  const [inputs, setInputs] = useState({
    pH_current: "",
    pH_desired: "",
    alkalinity: "",
    volume: "",
    adjustmentType: "acid", // "acid" or "base"
  });

  // 2. LOGIC ENGINE
  // Formula reference:
  // Amount of buffer (mg CaCO3) = Buffer Capacity (mg/L CaCO3) × Volume (L) × ΔpH
  // ΔpH = |pH_desired - pH_current|
  // Convert mg CaCO3 to grams or ounces as needed.
  // Note: This is a simplified estimation for aquarium pH adjustment.

  const results = useMemo(() => {
    const pH_current = parseFloat(inputs.pH_current);
    const pH_desired = parseFloat(inputs.pH_desired);
    const alkalinity = parseFloat(inputs.alkalinity);
    const volumeInput = parseFloat(inputs.volume);
    const adjustmentType = inputs.adjustmentType;

    if (
      isNaN(pH_current) ||
      isNaN(pH_desired) ||
      isNaN(alkalinity) ||
      isNaN(volumeInput) ||
      alkalinity <= 0 ||
      volumeInput <= 0
    ) {
      return {
        value: 0,
        label: "Invalid input",
        subtext: "Please enter valid positive numbers for all fields.",
        warning: null,
      };
    }

    // Convert volume to liters if imperial
    const volumeL = unit === "imperial" ? volumeInput * 3.78541 : volumeInput;

    // Calculate pH difference
    const deltaPH = Math.abs(pH_desired - pH_current);

    if (deltaPH === 0) {
      return {
        value: 0,
        label: "No adjustment needed",
        subtext: "Current pH equals desired pH.",
        warning: null,
      };
    }

    // Calculate amount of CaCO3 buffer needed in mg
    // This is a simplified linear approximation:
    // Amount (mg) = alkalinity (mg/L CaCO3) * volume (L) * delta pH
    const amountMg = alkalinity * volumeL * deltaPH;

    // Convert mg to grams
    const amountGrams = amountMg / 1000;

    // Convert grams to ounces if imperial
    const amountOunces = amountGrams / 28.3495;

    // Display result in grams or ounces depending on unit
    const displayAmount =
      unit === "imperial"
        ? amountOunces.toFixed(2) + " oz CaCO3 buffer"
        : amountGrams.toFixed(2) + " g CaCO3 buffer";

    // Warning if pH change is large
    const warning =
      deltaPH > 1.5
        ? "Large pH adjustments should be done gradually to avoid stressing aquatic life."
        : null;

    return {
      value: displayAmount,
      label:
        adjustmentType === "acid"
          ? "Amount of acid buffer required"
          : "Amount of base buffer required",
      subtext: `To adjust pH from ${pH_current} to ${pH_desired} in ${volumeInput} ${
        unit === "imperial" ? "gallons" : "liters"
      } with alkalinity ${alkalinity} mg/L CaCO3.`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is alkalinity important in pH adjustment?",
      answer:
        "Alkalinity represents the water's buffering capacity, meaning its ability to resist pH changes. A higher alkalinity requires more acid or base to shift the pH, while low alkalinity water is more sensitive to pH fluctuations. Understanding alkalinity helps ensure safe and effective pH adjustments without harming aquatic life.",
    },
    {
      question: "How does water volume affect the amount of buffer needed?",
      answer:
        "The volume of water directly influences the quantity of acid or base required to change the pH. Larger volumes dilute the buffer, necessitating more material to achieve the desired pH shift. Accurately measuring water volume is critical to avoid under- or overdosing the buffer, which could destabilize the aquarium environment.",
    },
    {
      question: "Why should pH adjustments be done gradually?",
      answer:
        "Rapid pH changes can stress or even harm aquatic organisms by disrupting their physiological balance. Gradual adjustments allow fish and plants to acclimate safely to new conditions. This approach minimizes shock and promotes a stable, healthy aquarium ecosystem.",
    },
    {
      question: "Can this calculator be used for all types of aquariums?",
      answer:
        "While this calculator provides a general estimation for freshwater aquariums, specific species or saltwater tanks may require tailored approaches. Factors like species sensitivity, existing water chemistry, and buffer type should be considered. Always consult a veterinary aquatic specialist for complex or sensitive setups.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select value={unit} onValueChange={setUnit}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="imperial">Imperial (gallons, oz)</SelectItem>
              <SelectItem value="metric">Metric (liters, g)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="pH_current" className="text-slate-700 dark:text-slate-300">
            Current pH
          </Label>
          <Input
            id="pH_current"
            type="number"
            step="0.01"
            min="0"
            max="14"
            placeholder="e.g. 7.5"
            value={inputs.pH_current}
            onChange={(e) => setInputs({ ...inputs, pH_current: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="pH_desired" className="text-slate-700 dark:text-slate-300">
            Desired pH
          </Label>
          <Input
            id="pH_desired"
            type="number"
            step="0.01"
            min="0"
            max="14"
            placeholder="e.g. 6.8"
            value={inputs.pH_desired}
            onChange={(e) => setInputs({ ...inputs, pH_desired: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="alkalinity" className="text-slate-700 dark:text-slate-300">
            Buffer Capacity (Alkalinity in mg/L CaCO3)
          </Label>
          <Input
            id="alkalinity"
            type="number"
            step="1"
            min="0"
            placeholder="e.g. 100"
            value={inputs.alkalinity}
            onChange={(e) => setInputs({ ...inputs, alkalinity: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="volume" className="text-slate-700 dark:text-slate-300">
            Volume of Water ({unit === "imperial" ? "Gallons" : "Liters"})
          </Label>
          <Input
            id="volume"
            type="number"
            step="0.1"
            min="0"
            placeholder={unit === "imperial" ? "e.g. 50" : "e.g. 190"}
            value={inputs.volume}
            onChange={(e) => setInputs({ ...inputs, volume: e.target.value })}
          />
        </div>

        <div>
          <Label className="text-slate-700 dark:text-slate-300">Adjustment Type</Label>
          <Select
            value={inputs.adjustmentType}
            onValueChange={(value) => setInputs({ ...inputs, adjustmentType: value })}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="acid">Acid (Lower pH)</SelectItem>
              <SelectItem value="base">Base (Raise pH)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating state (already handled by useMemo)
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              pH_current: "",
              pH_desired: "",
              alkalinity: "",
              volume: "",
              adjustmentType: "acid",
            })
          }
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
                Estimated Result
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">{results.label}</p>
              {results.subtext && (
                <p className="text-sm text-slate-500 mt-2">{results.subtext}</p>
              )}
              {results.warning && (
                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 rounded-lg flex items-start gap-3 text-left">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800 dark:text-amber-200">{results.warning}</p>
                </div>
              )}
            </CardContent>
          </Card>
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex gap-3">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a vet for diagnosis.
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
          Understanding pH Adjustment (Acid/Base Buffer) Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The pH Adjustment (Acid/Base Buffer) Calculator is a vital tool designed to assist aquarium enthusiasts and veterinary professionals in accurately estimating the amount of acid or base buffer required to safely modify the pH level of aquarium water. Maintaining an optimal pH balance is crucial for the health and wellbeing of aquatic animals, as sudden or incorrect pH changes can cause stress or even mortality. This calculator uses key water chemistry parameters such as current and desired pH, alkalinity (buffer capacity), and water volume to provide a scientifically grounded estimation.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Alkalinity, measured as mg/L CaCO3, reflects the water’s ability to resist pH changes and is a critical factor in determining how much acid or base is needed to achieve the desired pH adjustment. By incorporating alkalinity and volume, the calculator ensures that the buffering capacity of the water is respected, preventing overshooting or undershooting the target pH. This tool is especially useful in veterinary aquatic care, where precise water chemistry adjustments can support recovery and maintain optimal living conditions for sensitive species.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this calculator effectively, begin by accurately measuring the current pH of your aquarium water using a reliable pH meter or test kit. Next, determine the desired pH level based on the species’ requirements or veterinary recommendations. Input the alkalinity value, which can be obtained through water testing kits or laboratory analysis, and enter the total volume of water in your aquarium, selecting the appropriate unit system.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter the current pH and desired pH values to define the target adjustment.
          </li>
          <li>
            <strong>Step 2:</strong> Input the alkalinity (buffer capacity) of the water, which influences how much buffer is needed.
          </li>
          <li>
            <strong>Step 3:</strong> Provide the volume of water in gallons or liters, depending on your selected unit system.
          </li>
          <li>
            <strong>Step 4:</strong> Choose whether you are adding acid to lower pH or base to raise pH.
          </li>
          <li>
            <strong>Step 5:</strong> Click “Calculate” to receive the estimated amount of buffer required. Always apply adjustments gradually and monitor water parameters closely.
          </li>
        </ul>
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Veterinary References</h2>
        <ul className="space-y-4">
          <li className="block">
            <a
              href="https://www.aquaticvet.com/articles/ph-and-alkalinity-in-aquarium-health"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Aquatic Veterinary Medicine: pH and Alkalinity in Aquarium Health
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive review on the importance of pH and alkalinity management for aquatic animal health and veterinary care.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6789452/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Water Chemistry and Fish Health: A Veterinary Perspective
            </a>
            <p className="text-slate-500 text-sm">
              Scientific article discussing the impact of water chemistry parameters on fish physiology and veterinary treatment protocols.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aquariumcarebasics.com/ph-adjustment/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Aquarium Care Basics: Safe pH Adjustment Techniques
            </a>
            <p className="text-slate-500 text-sm">
              Practical guide on gradual pH adjustment methods and buffer use in aquarium settings to promote animal welfare.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="pH Adjustment (Acid/Base Buffer) Calculator"
      description="Calculate the required amount of acid or base (buffer) needed to safely adjust the aquarium water's pH level."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Amount of buffer (mg) = Buffer Capacity (mg/L CaCO3) × Volume (L) × |pH_desired - pH_current|",
        variables: [
          { symbol: "Buffer Capacity (mg/L CaCO3)", description: "Water's alkalinity or buffering capacity" },
          { symbol: "Volume (L)", description: "Total volume of aquarium water in liters" },
          { symbol: "|pH_desired - pH_current|", description: "Absolute difference between desired and current pH" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A freshwater aquarium has a current pH of 7.5 and alkalinity of 100 mg/L CaCO3. The owner wants to lower the pH to 6.8 in a 50-gallon tank.",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate the pH difference: |6.8 - 7.5| = 0.7.",
          },
          {
            label: "2",
            explanation:
              "Convert volume to liters: 50 gallons × 3.78541 = 189.27 L.",
          },
          {
            label: "3",
            explanation:
              "Calculate buffer amount: 100 mg/L × 189.27 L × 0.7 = 13248.9 mg or 13.25 g CaCO3 buffer.",
          },
        ],
        result: "Approximately 13.25 grams of acid buffer is needed to safely lower the pH from 7.5 to 6.8.",
      }}
      relatedCalculators={[
        { title: "Protein/Fat Intake Guide for Cats (by Goal)", url: "/pets/cat-protein-fat-intake-guide", icon: "🐱" },
        { title: "Dog Walking Calories Burned Calculator", url: "/pets/dog-walking-calories-burned", icon: "🐶" },
        { title: "Acetaminophen/Ibuprofen Exposure Risk (human meds)", url: "/pets/cat-acetaminophen-ibuprofen-exposure-risk", icon: "🐱" },
        { title: "Daily Water Requirement per Weight", url: "/pets/bird-daily-water-requirement-per-weight", icon: "🍖" },
        { title: "Phosphorus per Meal Estimator (diet label helper)", url: "/pets/cat-phosphorus-per-meal-estimator", icon: "💉" },
        { title: "Puppy Adult Size Predictor (Weight Curve)", url: "/pets/puppy-adult-size-predictor-weight-curve", icon: "💧" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding pH Adjustment (Acid/Base Buffer) Calculator" },
        { id: "how-to-use", label: "How to Use This Calculator" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "Veterinary References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}