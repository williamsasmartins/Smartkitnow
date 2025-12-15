import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BreedingTankVolumePlannerCalculator() {
  // 1. STATE
  // Unit system: Imperial (gallons, inches) or Metric (liters, cm)
  const [unit, setUnit] = useState("imperial");

  // Inputs: length, width, height of tank (breeding tank dimensions)
  // and number of breeding pairs (to estimate volume per pair)
  const [inputs, setInputs] = useState({
    length: "",
    width: "",
    height: "",
    breedingPairs: "",
  });

  // 2. LOGIC ENGINE
  // Calculate tank volume based on dimensions and unit system
  // Imperial: volume in gallons = (L * W * H) / 231 (cubic inches to gallons)
  // Metric: volume in liters = (L * W * H) / 1000 (cubic cm to liters)
  // Also calculate recommended minimum volume per breeding pair (e.g. 5 gallons per pair)
  // Provide warning if actual volume < recommended volume

  const results = useMemo(() => {
    const length = parseFloat(inputs.length);
    const width = parseFloat(inputs.width);
    const height = parseFloat(inputs.height);
    const breedingPairs = parseInt(inputs.breedingPairs);

    if (
      isNaN(length) ||
      isNaN(width) ||
      isNaN(height) ||
      isNaN(breedingPairs) ||
      length <= 0 ||
      width <= 0 ||
      height <= 0 ||
      breedingPairs <= 0
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    let volume = 0;
    let volumeUnit = "";
    let recommendedVolumePerPair = 5; // gallons per pair (imperial)
    if (unit === "imperial") {
      // volume in gallons
      volume = (length * width * height) / 231;
      volumeUnit = "gallons";
    } else {
      // metric: volume in liters
      volume = (length * width * height) / 1000;
      volumeUnit = "liters";
      recommendedVolumePerPair = 18.9; // ~5 gallons in liters
    }

    const recommendedVolume = recommendedVolumePerPair * breedingPairs;

    let warning = null;
    if (volume < recommendedVolume) {
      warning = `The current tank volume (${volume.toFixed(
        2
      )} ${volumeUnit}) is below the recommended minimum volume of ${recommendedVolume.toFixed(
        2
      )} ${volumeUnit} for ${breedingPairs} breeding pair(s). Consider increasing tank size to ensure optimal breeding conditions.`;
    }

    return {
      value: volume.toFixed(2),
      label: `Estimated Tank Volume (${volumeUnit})`,
      subtext: `Recommended minimum volume for ${breedingPairs} breeding pair(s): ${recommendedVolume.toFixed(
        2
      )} ${volumeUnit}`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is tank volume important for breeding fish?",
      answer:
        "Tank volume plays a crucial role in breeding success because it directly affects water quality, space for territorial behavior, and fry development. Larger volumes dilute waste products and stabilize water parameters, reducing stress and disease risk. Adequate space also allows breeding pairs to establish territories and reduces aggression, promoting healthier offspring.",
    },
    {
      question: "How do I determine the ideal tank dimensions for breeding?",
      answer:
        "Ideal tank dimensions depend on the species, number of breeding pairs, and breeding behavior. This calculator helps estimate volume based on length, width, and height, but consider species-specific needs such as hiding spots or substrate. Generally, providing at least 5 gallons (or 18.9 liters) per breeding pair ensures sufficient space and water quality for successful breeding.",
    },
    {
      question: "Can I use this planner for fry grow-out tanks?",
      answer:
        "Yes, this planner is suitable for both breeding and fry grow-out tanks. Fry require stable water conditions and adequate space to reduce competition and cannibalism. By calculating volume accurately, you can ensure the tank supports healthy fry growth and development until they are ready for transfer to larger systems or sale.",
    },
    {
      question: "Why does the calculator provide warnings about recommended volume?",
      answer:
        "Warnings highlight when the tank volume is insufficient for the number of breeding pairs, which can lead to poor water quality and increased stress. Insufficient volume may cause aggressive behavior and reduce breeding success. These alerts encourage users to optimize tank size, promoting healthier fish and better reproductive outcomes.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Widget UI
  const widget = (
    <div className="space-y-6">
      {/* Unit selector */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="border rounded px-3 py-1 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="imperial">Imperial (inches, gallons)</option>
            <option value="metric">Metric (cm, liters)</option>
          </select>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="length" className="text-slate-700 dark:text-slate-300">
            Tank Length ({unit === "imperial" ? "inches" : "cm"})
          </Label>
          <Input
            id="length"
            type="number"
            min={0}
            step="any"
            value={inputs.length}
            onChange={(e) => setInputs({ ...inputs, length: e.target.value })}
            placeholder={`Enter tank length in ${unit === "imperial" ? "inches" : "cm"}`}
          />
        </div>
        <div>
          <Label htmlFor="width" className="text-slate-700 dark:text-slate-300">
            Tank Width ({unit === "imperial" ? "inches" : "cm"})
          </Label>
          <Input
            id="width"
            type="number"
            min={0}
            step="any"
            value={inputs.width}
            onChange={(e) => setInputs({ ...inputs, width: e.target.value })}
            placeholder={`Enter tank width in ${unit === "imperial" ? "inches" : "cm"}`}
          />
        </div>
        <div>
          <Label htmlFor="height" className="text-slate-700 dark:text-slate-300">
            Tank Height ({unit === "imperial" ? "inches" : "cm"})
          </Label>
          <Input
            id="height"
            type="number"
            min={0}
            step="any"
            value={inputs.height}
            onChange={(e) => setInputs({ ...inputs, height: e.target.value })}
            placeholder={`Enter tank height in ${unit === "imperial" ? "inches" : "cm"}`}
          />
        </div>
        <div>
          <Label htmlFor="breedingPairs" className="text-slate-700 dark:text-slate-300">
            Number of Breeding Pairs
          </Label>
          <Input
            id="breedingPairs"
            type="number"
            min={1}
            step={1}
            value={inputs.breedingPairs}
            onChange={(e) => setInputs({ ...inputs, breedingPairs: e.target.value })}
            placeholder="Enter number of breeding pairs"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating state (already reactive)
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              length: "",
              width: "",
              height: "",
              breedingPairs: "",
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

  // Editorial content
  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Breeding Tank Volume Planner
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Breeding Tank Volume Planner is a specialized tool designed to help aquarists and veterinary professionals estimate the ideal volume of a dedicated breeding or fry grow-out tank. Proper tank volume is essential to maintain optimal water quality, provide adequate space for breeding pairs, and ensure the health and survival of offspring. This planner calculates volume based on tank dimensions and the number of breeding pairs, offering a scientifically grounded recommendation.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Breeding tanks require careful consideration of space because overcrowding can lead to increased aggression, stress, and poor water parameters, all of which negatively impact reproductive success. By using this planner, users can avoid common pitfalls such as undersized tanks that compromise fish welfare. The tool supports both imperial and metric units, making it accessible for a global audience of fish breeders and veterinary specialists.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use the Breeding Tank Volume Planner, simply input the tank’s length, width, and height in your preferred unit system—either inches and gallons or centimeters and liters. Next, enter the number of breeding pairs you plan to house in the tank. The calculator will then estimate the tank’s volume and compare it to the recommended minimum volume based on breeding pair count, providing warnings if the tank is undersized.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select your preferred unit system (Imperial or Metric) from the dropdown menu.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the tank dimensions accurately, ensuring all measurements are in the selected unit.
          </li>
          <li>
            <strong>Step 3:</strong> Input the number of breeding pairs you intend to keep in the tank.
          </li>
          <li>
            <strong>Step 4:</strong> Click “Calculate” to view the estimated tank volume and recommendations.
          </li>
          <li>
            <strong>Step 5:</strong> Review any warnings and adjust tank size or breeding pair numbers accordingly for optimal breeding conditions.
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
              href="https://www.aquaticcommunity.com/fish/breedingtank.php"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Aquatic Community: Breeding Tank Setup Guidelines
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive guide on tank sizing, water parameters, and breeding conditions for various fish species.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7151213/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Veterinary Clinics of North America: Fish Husbandry and Breeding
            </a>
            <p className="text-slate-500 text-sm">
              Peer-reviewed article discussing best practices in fish breeding and tank management from a veterinary perspective.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aquariumcoop.com/blogs/aquarium/breeding-tank-setup"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Aquarium Co-Op: Setting Up a Breeding Tank
            </a>
            <p className="text-slate-500 text-sm">
              Practical advice on tank dimensions, filtration, and environmental conditions to optimize breeding success.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Breeding Tank Volume Planner"
      description="Calculate the ideal volume and dimensions for a dedicated fish breeding or fry grow-out tank."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Tank Volume = (Length × Width × Height) / Conversion Factor",
        variables: [
          { symbol: "Length", description: "Tank length (inches or cm)" },
          { symbol: "Width", description: "Tank width (inches or cm)" },
          { symbol: "Height", description: "Tank height (inches or cm)" },
          {
            symbol: "Conversion Factor",
            description:
              "231 for cubic inches to gallons (imperial), 1000 for cubic cm to liters (metric)",
          },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A breeder wants to house 3 pairs of fish in a tank measuring 24 inches long, 12 inches wide, and 16 inches high. They want to ensure the tank volume is adequate for breeding success.",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate the tank volume in cubic inches: 24 × 12 × 16 = 4608 cubic inches.",
          },
          {
            label: "2",
            explanation:
              "Convert cubic inches to gallons: 4608 / 231 ≈ 19.95 gallons.",
          },
          {
            label: "3",
            explanation:
              "Calculate recommended volume: 5 gallons × 3 pairs = 15 gallons minimum.",
          },
          {
            label: "4",
            explanation:
              "Since 19.95 gallons > 15 gallons, the tank volume is sufficient for 3 breeding pairs.",
          },
        ],
        result: "The breeder can confidently use this tank for 3 breeding pairs with adequate volume.",
      }}
      relatedCalculators={[
        {
          title: "Vitamin D3 Requirement (Supplemental)",
          url: "/pets/reptile-vitamin-d3-requirement",
          icon: "🐾",
        },
        {
          title: "Benadryl (Diphenhydramine) Dose Calculator for Dogs",
          url: "/pets/dog-benadryl-diphenhydramine-dose",
          icon: "🐶",
        },
        {
          title: "Horse Calorie & Energy Requirement Calculator (DE / TDN)",
          url: "/pets/horse-calorie-energy-requirement-de-tdn",
          icon: "🐎",
        },
        {
          title: "Dog Weight Loss Planner",
          url: "/pets/dog-weight-loss-planner",
          icon: "🐶",
        },
        {
          title: "Prednisolone Dose Calculator for Cats",
          url: "/pets/cat-prednisolone-dose",
          icon: "🐱",
        },
        {
          title: "Meloxicam/Metacam Dose Calculator for Dogs",
          url: "/pets/dog-meloxicam-metacam-dose",
          icon: "🐶",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Breeding Tank Volume Planner" },
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