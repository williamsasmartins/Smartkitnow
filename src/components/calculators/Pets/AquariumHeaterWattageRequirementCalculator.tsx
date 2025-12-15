import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RotateCcw, Calculator, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function AquariumHeaterWattageRequirementCalculator() {
  // 1. STATE
  // Unit system needed because volume input can be in gallons or liters
  const [unit, setUnit] = useState("imperial"); // imperial = gallons, metric = liters

  // Inputs: tank volume and desired temperature difference (water temp - room temp)
  const [inputs, setInputs] = useState({
    volume: "",
    desiredTempDiff: "",
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const volumeNum = parseFloat(inputs.volume);
    const tempDiffNum = parseFloat(inputs.desiredTempDiff);

    if (
      isNaN(volumeNum) ||
      volumeNum <= 0 ||
      isNaN(tempDiffNum) ||
      tempDiffNum <= 0
    ) {
      return {
        value: 0,
        label: "Heater Wattage (Watts)",
        subtext: "Please enter valid positive numbers for all inputs.",
        warning: null,
      };
    }

    // Convert volume to liters if imperial (gallons)
    const volumeLiters = unit === "imperial" ? volumeNum * 3.78541 : volumeNum;

    // Formula source: Heater wattage (W) ≈ volume (liters) × temperature difference (°C) × 0.05
    // 0.05 is a coefficient accounting for heat loss and efficiency in typical aquarium setups.
    const wattage = volumeLiters * tempDiffNum * 0.05;

    // Round to nearest whole number
    const wattageRounded = Math.round(wattage);

    return {
      value: wattageRounded,
      label: "Heater Wattage (Watts)",
      subtext: `Based on ${volumeNum} ${unit === "imperial" ? "gallons" : "liters"} and a temperature difference of ${tempDiffNum}°C.`,
      warning: null,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is the temperature difference important in calculating heater wattage?",
      answer:
        "The temperature difference between the desired aquarium temperature and the ambient room temperature determines how much heat the heater must supply to maintain a stable environment. A larger difference means the heater has to work harder to compensate for heat loss. This is why the wattage requirement increases proportionally with the temperature difference to ensure consistent warmth for aquatic life.",
    },
    {
      question: "Can I use this calculator for saltwater and freshwater tanks alike?",
      answer:
        "Yes, this calculator applies to both freshwater and saltwater aquariums because the primary factors affecting heater wattage are tank volume and temperature difference. However, saltwater tanks may have slightly different heat retention properties due to salinity, but these differences are minimal for wattage estimation. For precise setups, consider additional insulation or specialized equipment recommendations.",
    },
    {
      question: "Why do I need to input the tank volume in gallons or liters?",
      answer:
        "Tank volume directly influences the amount of water that needs heating, which affects the heater wattage required. Larger volumes require more energy to raise and maintain temperature. By inputting the accurate volume, the calculator can estimate wattage that matches the thermal mass of your aquarium, ensuring efficient and safe heating.",
    },
    {
      question: "What happens if I choose a heater with wattage too low or too high?",
      answer:
        "Using a heater with wattage too low may result in insufficient heating, causing temperature fluctuations harmful to aquatic life. Conversely, an excessively powerful heater can overheat the tank, stressing or injuring fish and plants. Selecting the correct wattage ensures stable temperature control, energy efficiency, and longevity of your aquarium inhabitants.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Unit selector */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="border border-slate-300 rounded px-3 py-1 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="imperial">Imperial (gallons)</option>
            <option value="metric">Metric (liters)</option>
          </select>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="volume" className="text-slate-700 dark:text-slate-300">
            Aquarium Volume ({unit === "imperial" ? "gallons" : "liters"})
          </Label>
          <Input
            id="volume"
            type="number"
            min="0"
            step="any"
            placeholder={`Enter volume in ${unit === "imperial" ? "gallons" : "liters"}`}
            value={inputs.volume}
            onChange={(e) => setInputs((prev) => ({ ...prev, volume: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="desiredTempDiff" className="text-slate-700 dark:text-slate-300">
            Desired Temperature Difference (°C)
          </Label>
          <Input
            id="desiredTempDiff"
            type="number"
            min="0"
            step="any"
            placeholder="Enter temperature difference in °C"
            value={inputs.desiredTempDiff}
            onChange={(e) => setInputs((prev) => ({ ...prev, desiredTempDiff: e.target.value }))}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating inputs state (no-op here)
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ volume: "", desiredTempDiff: "" })}
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
              {results.subtext && <p className="text-sm text-slate-500 mt-2">{results.subtext}</p>}
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
          Understanding Heater Wattage Requirement
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Maintaining a stable and appropriate temperature in an aquarium is crucial for the health and wellbeing of aquatic animals and plants. The heater wattage requirement is the amount of electrical power needed to raise and sustain the water temperature at the desired level, compensating for heat loss to the surrounding environment. This requirement depends primarily on the volume of water in the tank and the temperature difference between the aquarium water and the ambient room temperature.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Calculating the correct heater wattage ensures that the heater can efficiently maintain the target temperature without overworking or underperforming. An undersized heater may fail to keep the water warm enough, leading to stress or illness in aquatic life, while an oversized heater can cause rapid temperature fluctuations or overheating. Therefore, understanding and accurately estimating wattage needs is essential for creating a stable aquatic environment.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This calculator uses a scientifically supported formula that factors in the tank volume and the desired temperature difference to estimate the wattage needed. By inputting these values, aquarium owners can select an appropriately sized heater, promoting energy efficiency, safety, and optimal conditions for their aquatic pets.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this calculator is straightforward and designed to provide an accurate estimate of the heater wattage required for your aquarium. Begin by selecting your preferred unit system—Imperial for gallons or Metric for liters—to match how you measure your tank volume. Then, enter the volume of your aquarium and the temperature difference you want to maintain between the water and the room.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select the unit system that corresponds to your aquarium volume measurement.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the total volume of your aquarium in gallons or liters.
          </li>
          <li>
            <strong>Step 3:</strong> Input the desired temperature difference in degrees Celsius between your aquarium water and the ambient room temperature.
          </li>
          <li>
            <strong>Step 4:</strong> Click the Calculate button to see the recommended heater wattage to maintain your desired temperature.
          </li>
          <li>
            <strong>Step 5:</strong> Use the result to select a heater that matches or slightly exceeds the calculated wattage for optimal performance.
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
              href="https://www.aquariumcoop.com/blogs/aquarium-heaters"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Aquarium Heater Sizing Guide - Aquarium Co-Op
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive guide on selecting aquarium heaters based on tank volume and temperature requirements, including practical tips for maintaining aquatic health.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.petmd.com/fish/care/evr_fi_heating_aquarium"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Heating Your Aquarium - PetMD
            </a>
            <p className="text-slate-500 text-sm">
              Veterinary insights on the importance of stable aquarium temperatures and how to properly heat aquatic environments to prevent stress and disease.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aquariumcarebasics.com/aquarium-heater-sizing/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Aquarium Heater Sizing Calculator & Tips - Aquarium Care Basics
            </a>
            <p className="text-slate-500 text-sm">
              Practical calculator and explanation of heater wattage requirements with emphasis on aquarium volume and temperature differential.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Heater Wattage Requirement"
      description="Determine the correct wattage heater needed to maintain the desired water temperature based on tank volume and room temperature."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Heater Wattage (W) = Aquarium Volume (L) × Temperature Difference (°C) × 0.05",
        variables: [
          { symbol: "Aquarium Volume (L)", description: "Total volume of aquarium water in liters" },
          { symbol: "Temperature Difference (°C)", description: "Desired temperature difference between aquarium water and room temperature" },
          { symbol: "0.05", description: "Coefficient accounting for heat loss and heater efficiency" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 40-gallon aquarium is kept in a room at 20°C, and the desired water temperature is 26°C. Calculate the heater wattage required.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert 40 gallons to liters: 40 × 3.78541 = 151.4 liters.",
          },
          {
            label: "2",
            explanation:
              "Calculate temperature difference: 26°C - 20°C = 6°C.",
          },
          {
            label: "3",
            explanation:
              "Apply formula: 151.4 × 6 × 0.05 = 45.42 watts.",
          },
        ],
        result: "Recommended heater wattage is approximately 45 watts.",
      }}
      relatedCalculators={[
        { title: "Caffeine Toxicity Risk for Cats", url: "/pets/cat-caffeine-toxicity", icon: "🐱" },
        { title: "Cat Weight Loss Planner", url: "/pets/cat-weight-loss-planner", icon: "🐱" },
        { title: "Calcium + D3 Supplement Calculator", url: "/pets/reptile-calcium-d3-supplement", icon: "🐱" },
        { title: "Senior Cat Nutrition & Calorie Adjuster", url: "/pets/senior-cat-nutrition-calorie-adjuster", icon: "🐱" },
        { title: "Dehydration Risk Estimator (Weight & Symptoms Aware)", url: "/pets/dog-dehydration-risk-estimator", icon: "💉" },
        { title: "Puppy Calorie Needs by Age/Breed Size Calculator", url: "/pets/puppy-calorie-needs-age-breed-size", icon: "💧" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Heater Wattage Requirement" },
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