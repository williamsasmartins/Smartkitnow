import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function AquariumSafeStockingDensityFishPerLitreCalculator() {
  // 1. STATE
  // Unit system is relevant because fish length input can be in cm or inches.
  const [unit, setUnit] = useState("imperial");

  // Inputs: number of fish, average fish length (cm or inches), tank volume (litres)
  const [inputs, setInputs] = useState({
    numberOfFish: "",
    avgFishLength: "",
    tankVolume: "",
  });

  // 2. LOGIC ENGINE
  // Formula for safe stocking density (Fish/cm per Litre):
  // Safe Stocking Density = (Number of Fish × Average Fish Length) / Tank Volume
  // This gives fish length per litre, which should not exceed recommended limits.
  // We'll calculate the stocking density and provide a warning if it exceeds 0.1 cm/Litre (a common conservative guideline).
  const results = useMemo(() => {
    const nFish = parseFloat(inputs.numberOfFish);
    let fishLength = parseFloat(inputs.avgFishLength);
    const volume = parseFloat(inputs.tankVolume);

    if (
      isNaN(nFish) ||
      isNaN(fishLength) ||
      isNaN(volume) ||
      nFish <= 0 ||
      fishLength <= 0 ||
      volume <= 0
    ) {
      return {
        value: 0,
        label: "Please enter valid positive numbers for all inputs.",
        subtext: "",
        warning: null,
      };
    }

    // Convert fish length to cm if input is imperial (inches)
    if (unit === "imperial") {
      fishLength = fishLength * 2.54;
    }

    // Calculate stocking density (cm of fish per litre)
    const stockingDensity = (nFish * fishLength) / volume;

    // Round to 3 decimals for display
    const roundedDensity = Math.round(stockingDensity * 1000) / 1000;

    // Warning threshold (conservative): > 0.1 cm/Litre may cause stress and poor water quality
    const warning =
      roundedDensity > 0.1
        ? "Warning: Stocking density exceeds recommended safe limits, which can lead to stress, poor water quality, and increased disease risk."
        : null;

    return {
      value: roundedDensity,
      label: "Fish Length per Litre (cm/L)",
      subtext:
        "A value above 0.1 cm/L indicates potential overstocking. Maintain lower values for healthier aquatic environments.",
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "What is the 1 inch per gallon rule for fish stocking?",
      answer: "The 1 inch per gallon rule is a general guideline suggesting 1 inch of fish length per gallon of water, or approximately 0.1 cm of fish per litre. This rule works for small community fish but underestimates needs for larger or more active species.",
    },
    {
      question: "How do I calculate safe stocking density for my aquarium?",
      answer: "Divide the total length of all fish (in cm) by your tank volume (in litres). Safe densities typically range from 0.5–1.5 cm per litre depending on species, filtration, and tank shape.",
    },
    {
      question: "Why does fish size matter in stocking density calculations?",
      answer: "Larger fish produce more waste and require more oxygen, so they need proportionally more space. A 10 cm fish demands more resources than two 5 cm fish despite having equal total length.",
    },
    {
      question: "What stocking density is safe for goldfish?",
      answer: "Goldfish require 0.5–0.75 cm per litre due to high bioload and oxygen demand. A single 15 cm goldfish needs at least 20–30 litres to thrive.",
    },
    {
      question: "Can filtration increase safe stocking density limits?",
      answer: "Stronger filtration and aeration allow slightly higher densities, but cannot eliminate the need for adequate space. Even with excellent filtration, exceeding 2 cm per litre risks stress and disease.",
    },
    {
      question: "How do tank shape and water circulation affect stocking density?",
      answer: "Tall, narrow tanks have less surface area for gas exchange than long, shallow tanks of equal volume. Better water circulation supports higher densities by improving oxygen distribution.",
    },
    {
      question: "What happens if I overstock my aquarium?",
      answer: "Overstocking causes poor water quality, oxygen depletion, increased ammonia and nitrite, and higher disease risk. Fish become stressed, stop eating, and may die within days or weeks.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 4. HANDLERS
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }

  const widget = (
    <div className="space-y-6">
      {/* Unit Selector */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select value={unit} onValueChange={setUnit}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="imperial">Imperial (inches)</SelectItem>
              <SelectItem value="metric">Metric (cm)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="numberOfFish" className="text-slate-700 dark:text-slate-300">
            Number of Fish
          </Label>
          <Input
            id="numberOfFish"
            name="numberOfFish"
            type="text"
            inputMode="decimal"
            placeholder="e.g. 10"
            value={inputs.numberOfFish}
            onChange={handleInputChange}
            aria-describedby="numberOfFish-desc"
          />
          <p id="numberOfFish-desc" className="text-xs text-slate-400 mt-1">
            Enter the total number of fish in the aquarium.
          </p>
        </div>

        <div>
          <Label htmlFor="avgFishLength" className="text-slate-700 dark:text-slate-300">
            Average Fish Length ({unit === "imperial" ? "inches" : "cm"})
          </Label>
          <Input
            id="avgFishLength"
            name="avgFishLength"
            type="text"
            inputMode="decimal"
            placeholder={unit === "imperial" ? "e.g. 3.5" : "e.g. 9"}
            value={inputs.avgFishLength}
            onChange={handleInputChange}
            aria-describedby="avgFishLength-desc"
          />
          <p id="avgFishLength-desc" className="text-xs text-slate-400 mt-1">
            Enter the average length of your fish.
          </p>
        </div>

        <div>
          <Label htmlFor="tankVolume" className="text-slate-700 dark:text-slate-300">
            Tank Volume (Litres)
          </Label>
          <Input
            id="tankVolume"
            name="tankVolume"
            type="text"
            inputMode="decimal"
            placeholder="e.g. 100"
            value={inputs.tankVolume}
            onChange={handleInputChange}
            aria-describedby="tankVolume-desc"
          />
          <p id="tankVolume-desc" className="text-xs text-slate-400 mt-1">
            Enter the total volume of your aquarium in litres.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No special action needed, calculation is reactive
          }}
          type="button"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ numberOfFish: "", avgFishLength: "", tankVolume: "" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          type="button"
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

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Safe Stocking Density (Fish/cm per Litre) Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator determines whether your aquarium is safely stocked by comparing total fish length to tank volume. It helps prevent overstocking, which causes poor water quality, stress, disease, and premature death.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter your tank volume in litres and the total body length of all fish in centimetres. The calculator computes density (cm/L) and compares it against species-specific safe ranges to indicate if your stock is appropriate.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Results &lt; 0.75 cm/L are conservative (extra safe); 0.75–1.5 cm/L is ideal for most community tanks; &gt; 1.5 cm/L risks problems unless you have exceptional filtration and maintenance.</p>
        </div>
      </section>

      {/* TABLE: Recommended Stocking Density Ranges by Fish Type */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Recommended Stocking Density Ranges by Fish Type</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">These benchmarks help determine safe cm-per-litre limits based on species characteristics.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Fish Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Stocking Density (cm/L)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Example Species</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Small community fish</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.0–1.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Neon tetras, guppies, danios</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Medium community fish</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.75–1.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Corydoras, mollies, platies</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Large active fish</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.5–0.75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Goldfish, plecos, cichlids</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Bottom dwellers</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.75–1.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Loaches, catfish, kuhli loaches</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Aggressive species</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.25–0.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Oscars, large cichlids, piranhas</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Values assume good filtration, regular water changes, and appropriate tank dimensions. Adjust downward for poor filtration or high bioload species.</p>
      </section>

      {/* TABLE: Tank Volume and Maximum Fish Length Capacity */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Tank Volume and Maximum Fish Length Capacity</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Quick reference for maximum total fish length at recommended safe densities.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Tank Volume (L)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Safe Capacity at 1.0 cm/L</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Safe Capacity at 0.75 cm/L</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Safe Capacity at 0.5 cm/L</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20 cm total</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15 cm total</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10 cm total</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40 cm total</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30 cm total</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20 cm total</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">60</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60 cm total</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">45 cm total</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30 cm total</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100 cm total</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">75 cm total</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50 cm total</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200 cm total</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">150 cm total</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100 cm total</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">These figures represent total body length of all fish combined. Account for growth; juveniles will exceed these limits as they mature.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Account for future growth when stocking juveniles; many fish double or triple in size within 1–2 years.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Measure fish from the tip of the mouth to the end of the tail fin for accurate total length.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Combine stocking density with 25–30% weekly water changes and appropriate filtration to maintain water quality.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Research each species' bioload; some fish (goldfish, plecos) produce more waste than length alone suggests.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring future growth</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Stocking based on juvenile size causes overstocking within months when fish reach adult length.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Relying solely on the 1 inch per gallon rule</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">This oversimplified guideline doesn't account for species differences; goldfish need far more space than neon tetras.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming excellent filtration eliminates space needs</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Even premium filters cannot replace the natural space and surface area fish require for comfort and health.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Neglecting tank shape differences</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">A 40 L tall cube is less suitable for stocking than a 40 L long, shallow tank due to reduced surface area.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the 1 inch per gallon rule for fish stocking?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The 1 inch per gallon rule is a general guideline suggesting 1 inch of fish length per gallon of water, or approximately 0.1 cm of fish per litre. This rule works for small community fish but underestimates needs for larger or more active species.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate safe stocking density for my aquarium?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Divide the total length of all fish (in cm) by your tank volume (in litres). Safe densities typically range from 0.5–1.5 cm per litre depending on species, filtration, and tank shape.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why does fish size matter in stocking density calculations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Larger fish produce more waste and require more oxygen, so they need proportionally more space. A 10 cm fish demands more resources than two 5 cm fish despite having equal total length.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What stocking density is safe for goldfish?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Goldfish require 0.5–0.75 cm per litre due to high bioload and oxygen demand. A single 15 cm goldfish needs at least 20–30 litres to thrive.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can filtration increase safe stocking density limits?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Stronger filtration and aeration allow slightly higher densities, but cannot eliminate the need for adequate space. Even with excellent filtration, exceeding 2 cm per litre risks stress and disease.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do tank shape and water circulation affect stocking density?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Tall, narrow tanks have less surface area for gas exchange than long, shallow tanks of equal volume. Better water circulation supports higher densities by improving oxygen distribution.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What happens if I overstock my aquarium?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Overstocking causes poor water quality, oxygen depletion, increased ammonia and nitrite, and higher disease risk. Fish become stressed, stop eating, and may die within days or weeks.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.fishbase.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">FishBase – Fish Biology and Ecology Database</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive species profiles including bioload, oxygen requirements, and minimum space recommendations.</p>
          </li>
          <li>
            <a href="https://www.americanaquariumproducts.com/Stocking.html" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Aquarium Products – Stocking Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Detailed stocking density benchmarks and species-specific care requirements.</p>
          </li>
          <li>
            <a href="https://www.thesprucepets.com/aquarium-stocking-guide-4768378" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">The Spruce Pets – Aquarium Stocking Calculator Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Expert guidance on calculating safe stocking levels and common stocking mistakes.</p>
          </li>
          <li>
            <a href="https://www.aquariumcoop.com/blogs/aquarium/nitrogen-cycle" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Aquarium Co-operative – Aquarium Nitrogen Cycle</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Explains how bioload and water quality relate to fish stocking and tank capacity.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Safe Stocking Density (Fish/cm per Litre)"
      description="Determine the safe number or length of fish that can be kept in a tank, preventing overstocking and stress."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Safe Stocking Density = (Number of Fish × Average Fish Length) / Tank Volume",
        variables: [
          { symbol: "Number of Fish", description: "Total fish count in the aquarium" },
          { symbol: "Average Fish Length", description: "Mean length of fish in cm" },
          { symbol: "Tank Volume", description: "Total aquarium volume in litres" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "An aquarist has 15 fish with an average length of 5 cm in a 100-litre tank and wants to know if the stocking density is safe.",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate total fish length: 15 fish × 5 cm = 75 cm total fish length.",
          },
          {
            label: "2",
            explanation:
              "Divide total fish length by tank volume: 75 cm ÷ 100 litres = 0.75 cm/L.",
          },
          {
            label: "3",
            explanation:
              "Compare with recommended limit (0.1 cm/L). 0.75 cm/L exceeds safe stocking density, indicating overstocking.",
          },
        ],
        result:
          "The aquarist should reduce fish numbers or increase tank size to maintain a healthy environment.",
      }}
      relatedCalculators={[
        { title: "Prednisone/Prednisolone Dose Calculator for Dogs", url: "/pets/dog-prednisone-prednisolone-dose", icon: "🐶" },
        { title: "Parasite Treatment Dose Reference", url: "/pets/small-mammal-parasite-treatment-dose-reference", icon: "🐶" },
        { title: "Cat Age in Human Years (Breed/Size Aware)", url: "/pets/cat-age-human-years-breed-size-aware", icon: "🐱" },
        { title: "Dehydration Risk Estimator (Weight & Symptoms Aware)", url: "/pets/dog-dehydration-risk-estimator", icon: "🍖" },
        { title: "Meloxicam/Metacam Dose Calculator for Dogs", url: "/pets/dog-meloxicam-metacam-dose", icon: "🐶" },
        { title: "Cat Grape/Raisin Exposure Risk (educational)", url: "/pets/cat-grape-raisin-exposure-risk", icon: "🐱" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Safe Stocking Density (Fish/cm per Litre)" },
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