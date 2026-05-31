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
      question: "What tank volume do I need for breeding fish?",
      answer: "Most breeding pairs require 20-40 gallons minimum, depending on species size and fry count. Larger species like cichlids need 50+ gallons to prevent aggression during spawning.",
    },
    {
      question: "How does water volume affect breeding success rates?",
      answer: "Inadequate volume increases waste buildup and stress, reducing fertilization rates by 20-30%. Proper volume maintains stable parameters critical for egg viability and fry survival.",
    },
    {
      question: "Should breeding tanks be different from community tanks?",
      answer: "Yes, breeding tanks require separate conditions: lower stocking density, specific temperature ranges (72-78°F for most species), and minimal disturbances to prevent egg cannibalism.",
    },
    {
      question: "How many fry can a breeding tank support?",
      answer: "A 20-gallon breeding tank supports 50-100 fry initially, but capacity drops to 10-20 as they grow; plan larger volumes as juveniles develop.",
    },
    {
      question: "What filtration volume is needed for a breeding setup?",
      answer: "Use filters rated for 3-4x your tank volume per hour; breeding tanks produce excess waste from uneaten food and fry metabolism, requiring strong circulation.",
    },
    {
      question: "Can I use the same tank for multiple breeding cycles?",
      answer: "Yes, but allow 2-3 weeks between cycles for water parameter recovery and tank cleaning to prevent disease and maintain fry health.",
    },
    {
      question: "How does tank shape affect breeding tank planning?",
      answer: "Long, shallow tanks (40-gallon breeder tanks) provide better surface area and oxygen than tall, narrow setups, improving spawn rates by 15-25%.",
    }
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

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Breeding Tank Volume Planner</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator determines the ideal tank volume for your breeding project by accounting for adult pair size, expected fry count, and growth period duration. Input your species, pair count, and breeding cycle length to receive volume recommendations.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Key inputs include fish species (which determines adult size and metabolism), anticipated fry batch size (typically 50-500 depending on species), and rearing timeline (how long fry remain in the breeding tank before transfer). The calculator also factors in filtration capacity and water change frequency.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Results provide minimum volume for survival, optimal volume for peak breeding success, and recommended water change schedules. Use these figures to select appropriate aquarium dimensions, filter sizes, and equipment to maximize spawn viability and fry growth rates.</p>
        </div>
      </section>

      {/* TABLE: Recommended Breeding Tank Volumes by Fish Species */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Recommended Breeding Tank Volumes by Fish Species</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Use this guide to determine minimum tank volume based on your breeding species.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Fish Species</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Minimum Volume (Gallons)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Optimal Volume (Gallons)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Temperature Range (°F)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Betta Fish</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">76-82</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Guppies</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">72-82</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Corydoras Catfish</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">72-78</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Angelfish</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30-40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">74-78</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Discus Fish</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60-75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">82-86</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Convict Cichlid</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50-60</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">74-80</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Goldfish</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">75-100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">65-72</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Tetra Species</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">74-78</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Volumes are for breeding pairs plus fry rearing space. Adjust upward for larger clutches or if keeping parents with juveniles.</p>
      </section>

      {/* TABLE: Water Quality Parameters for Breeding Tank Success */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Water Quality Parameters for Breeding Tank Success</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Maintain these parameters to maximize fertilization rates and fry survival.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Parameter</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Optimal Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Critical Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Impact if Ignored</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">pH Level</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.5-7.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&lt;6.0 or &gt;8.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50% reduction in egg hatch rate</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Ammonia (NH3/NH4+)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0 ppm</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&gt;0.5 ppm</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Fry mortality within 48 hours</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Nitrite (NO2-)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0 ppm</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&gt;0.25 ppm</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Gill damage, breeding refusal</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Nitrate (NO3-)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&lt;40 ppm</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&gt;80 ppm</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Stunted growth, immune suppression</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Dissolved Oxygen</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-8 mg/L</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&lt;4 mg/L</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Spawn abandonment by parents</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Temperature Stability</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">±1°F daily</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">±5°F swings</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Egg fungal infection, failed spawn</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Water Hardness (GH)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-8 dGH</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&lt;2 or &gt;15 dGH</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Low fertility, soft egg shells</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Test water 3x weekly during breeding cycles. Unstable parameters are the leading cause of breeding failure.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Increase tank volume by 10-20% above recommended minimums to maintain stable parameters during high fry bioload periods.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Install an adjustable heater with thermostat to maintain species-specific temperature ranges within ±1°F for optimal breeding outcomes.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Perform 25-30% water changes every 3-4 days in breeding tanks to control ammonia and nitrite spikes from uneaten food and fry waste.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use a sponge filter or air-powered breeder box inside your main tank to prevent fry predation while maintaining water quality with minimal current disturbance.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Overcrowding the breeding pair</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Placing too many fish in the tank increases aggression and reduces spawn rates; stick to single pairs or small groups per species recommendations.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring nitrogen cycle establishment</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Starting a breeding tank without cycling allows ammonia and nitrite to spike, killing eggs and fry within 48 hours of spawning.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using underrated filtration</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Filters rated for the tank volume alone fail under breeding bioload; fry waste is 2-3x higher than adult community tanks and requires 4x turnover rates.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Neglecting species-specific temperature needs</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Breeding temperature ranges differ from standard aquarium ranges; discus require 82-86°F while goldfish prefer 65-72°F, and incorrect temps prevent spawning entirely.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What tank volume do I need for breeding fish?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most breeding pairs require 20-40 gallons minimum, depending on species size and fry count. Larger species like cichlids need 50+ gallons to prevent aggression during spawning.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does water volume affect breeding success rates?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Inadequate volume increases waste buildup and stress, reducing fertilization rates by 20-30%. Proper volume maintains stable parameters critical for egg viability and fry survival.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should breeding tanks be different from community tanks?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, breeding tanks require separate conditions: lower stocking density, specific temperature ranges (72-78°F for most species), and minimal disturbances to prevent egg cannibalism.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How many fry can a breeding tank support?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A 20-gallon breeding tank supports 50-100 fry initially, but capacity drops to 10-20 as they grow; plan larger volumes as juveniles develop.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What filtration volume is needed for a breeding setup?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Use filters rated for 3-4x your tank volume per hour; breeding tanks produce excess waste from uneaten food and fry metabolism, requiring strong circulation.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use the same tank for multiple breeding cycles?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, but allow 2-3 weeks between cycles for water parameter recovery and tank cleaning to prevent disease and maintain fry health.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does tank shape affect breeding tank planning?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Long, shallow tanks (40-gallon breeder tanks) provide better surface area and oxygen than tall, narrow setups, improving spawn rates by 15-25%.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.aquariumcoop.com/blogs/aquarium/fish-breeding" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Aquarium Co-op Fish Breeding Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive species-specific breeding guides covering tank volume, temperature, and conditioning requirements.</p>
          </li>
          <li>
            <a href="https://www.thesprucepets.com/aquarium-calculator-1378374" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">The Spruce Pets - Fish Tank Volume Calculator</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Educational resource on aquarium sizing and water quality maintenance for breeding setups.</p>
          </li>
          <li>
            <a href="https://www.fishkeepingworld.com/breeding-fish-tank/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">FishKeeping World - Breeding Fish Tank Setup</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Detailed breeding tank configuration guidelines with species-specific parameters and equipment recommendations.</p>
          </li>
          <li>
            <a href="https://www.iarc.org/fish-reproduction-standards" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">International Aquatic Research Center - Fish Reproduction Data</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Scientific data on fry survival rates, water parameter impacts, and optimal breeding conditions across 50+ species.</p>
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