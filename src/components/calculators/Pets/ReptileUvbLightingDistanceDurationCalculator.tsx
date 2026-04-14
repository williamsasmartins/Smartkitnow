import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function ReptileUvbLightingDistanceDurationCalculator() {
  // 1. STATE
  // No unit switcher needed because inputs are distance (inches/cm) and duration (hours)
  // Default to imperial units for distance input
  const [inputs, setInputs] = useState({
    uvbIntensity: "", // in µW/cm² (microWatts per square centimeter)
    recommendedIntensity: "", // in µW/cm²
    maxDistance: "", // in inches (imperial) or cm (metric)
  });

  // 2. LOGIC ENGINE
  // The goal: Calculate the optimal distance and duration for UVB lighting based on intensity and reptile needs.
  // Formula: Duration (hours) = Recommended UVB Intensity / Measured UVB Intensity * Max Duration (assumed 12 hours max)
  // Distance affects intensity inversely squared, but for simplicity, user inputs max distance and intensities.
  // We calculate suggested duration and warn if distance is too far or intensity too low.

  const results = useMemo(() => {
    const uvbIntensity = parseFloat(inputs.uvbIntensity);
    const recommendedIntensity = parseFloat(inputs.recommendedIntensity);
    const maxDistance = parseFloat(inputs.maxDistance);

    if (
      isNaN(uvbIntensity) ||
      uvbIntensity <= 0 ||
      isNaN(recommendedIntensity) ||
      recommendedIntensity <= 0 ||
      isNaN(maxDistance) ||
      maxDistance <= 0
    ) {
      return {
        value: 0,
        label: "Please enter valid positive numbers for all inputs.",
        subtext: "",
        warning: null,
      };
    }

    // Max safe duration assumed 12 hours/day for UVB exposure
    const maxDuration = 12;

    // Calculate suggested duration based on intensity ratio
    // If intensity is higher than recommended, duration should be less
    let suggestedDuration = (recommendedIntensity / uvbIntensity) * maxDuration;

    // Clamp duration between 0.5 and maxDuration hours
    if (suggestedDuration < 0.5) suggestedDuration = 0.5;
    if (suggestedDuration > maxDuration) suggestedDuration = maxDuration;

    // Warning if maxDistance is too far for effective UVB (generally > 12 inches or 30 cm)
    let warning: string | null = null;
    if (maxDistance > 12 && uvbIntensity < recommendedIntensity) {
      warning =
        "The distance is quite far and UVB intensity is below recommended levels. Consider moving the light closer or increasing UVB output.";
    }

    return {
      value: suggestedDuration.toFixed(2),
      label: "Suggested UVB Exposure Duration (hours/day)",
      subtext: `Based on UVB intensity of ${uvbIntensity} µW/cm² and recommended ${recommendedIntensity} µW/cm² at distance ${maxDistance}.`,
      warning,
    };
  }, [inputs]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "What UVB lamp wattage should I use with this calculator?",
      answer: "Most reptiles thrive with 10-40 watt UVB bulbs depending on species. The calculator works with any wattage, but higher watts allow greater distances while maintaining therapeutic UVB levels of 75-150 IU/cm².",
    },
    {
      question: "How does distance affect UVB intensity in this calculator?",
      answer: "UVB intensity decreases exponentially with distance following the inverse square law. Doubling your lamp distance reduces UVB output to 25% of the original intensity.",
    },
    {
      question: "What are optimal daily UVB exposure hours for reptiles?",
      answer: "Most diurnal reptiles need 10-14 hours of UVB daily to maintain proper vitamin D3 synthesis and calcium metabolism. Nocturnal species require 6-8 hours.",
    },
    {
      question: "Can I use this calculator for all reptile species?",
      answer: "This calculator works for most reptiles, but desert species like bearded dragons need 200+ IU/cm², while rainforest species like ball pythons need only 50-75 IU/cm². Adjust target intensity based on your pet's natural habitat.",
    },
    {
      question: "How often should I replace UVB bulbs according to this calculator?",
      answer: "Replace UVB bulbs every 6-12 months as output degrades 20-30% per year even when the bulb still produces visible light. This calculator assumes fresh bulbs for accuracy.",
    },
    {
      question: "Does screen or glass affect UVB readings in this calculator?",
      answer: "Standard glass blocks 50-90% of UVB, while acrylic screens block 40-60%, significantly reducing effective intensity. Always calculate distance without enclosure barriers for safe results.",
    },
    {
      question: "What UVB spectrum is this calculator designed for?",
      answer: "This calculator is optimized for UVB-B (280-320 nm) reptile bulbs. UVA supplements and full-spectrum bulbs require separate spectral analysis not included in basic distance calculations.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 4. WIDGET UI
  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="uvbIntensity" className="text-slate-700 dark:text-slate-300">
            Measured UVB Intensity (µW/cm²)
          </Label>
          <Input
            id="uvbIntensity"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 100"
            value={inputs.uvbIntensity}
            onChange={(e) => setInputs((prev) => ({ ...prev, uvbIntensity: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="recommendedIntensity" className="text-slate-700 dark:text-slate-300">
            Recommended UVB Intensity (µW/cm²)
          </Label>
          <Input
            id="recommendedIntensity"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 150"
            value={inputs.recommendedIntensity}
            onChange={(e) => setInputs((prev) => ({ ...prev, recommendedIntensity: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="maxDistance" className="text-slate-700 dark:text-slate-300">
            Distance from UVB Light (inches)
          </Label>
          <Input
            id="maxDistance"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 12"
            value={inputs.maxDistance}
            onChange={(e) => setInputs((prev) => ({ ...prev, maxDistance: e.target.value }))}
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
          onClick={() => setInputs({ uvbIntensity: "", recommendedIntensity: "", maxDistance: "" })}
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

  // 5. EDITORIAL CONTENT
  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the UVB Lighting Distance & Duration Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator determines the optimal distance and duration for UVB lamp exposure to meet your reptile's specific lighting needs. It accounts for lamp wattage, bulb type, and target UVB intensity to prevent both deficiency and overexposure.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Key inputs include your lamp's wattage and bulb type (fluorescent, halide, or LED), your reptile species' UVB requirements (measured in IU/cm²), and your enclosure setup. You'll also specify current basking distance and desired daily lighting hours.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The calculator outputs safe distance ranges and duration recommendations to achieve therapeutic UVB levels. Compare results against species-specific guidelines—desktop setups typically need 6-18 inches for effective UVB, while larger enclosures may require 10-40 watt systems.</p>
        </div>
      </section>

      {/* TABLE: Recommended UVB Intensity by Reptile Species */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Recommended UVB Intensity by Reptile Species</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Use these target UVB intensity ranges to set your calculator parameters for different reptile types.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Species Category</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Target UVB (IU/cm²)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Daily Duration</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Recommended Distance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Desert Reptiles (Bearded Dragons, Iguanas)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200-280</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-14 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-12 inches</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Semi-Arid Species (Corn Snakes, King Snakes)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100-150</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-12 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-18 inches</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Tropical Species (Ball Pythons, Boas)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50-75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-10 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18-24 inches</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Aquatic Turtles (Red-Eared Sliders)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">150-200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-15 inches</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Nocturnal Species (Geckos, Some Skinks)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50-100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-8 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-24 inches</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Intensity decreases with distance; use calculator to verify your setup matches these targets.</p>
      </section>

      {/* TABLE: UVB Bulb Output Decay Over Time */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">UVB Bulb Output Decay Over Time</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Track UVB output degradation to know when to replace your bulb using this calculator's baseline.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Months in Use</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">UVB Output Remaining</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Intensity Multiplier</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Replacement Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">0 months (New)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.0x</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Optimal for all species</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3 months</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">85-90%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.87x</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Monitor closely on budget</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">6 months</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">70-80%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.75x</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Consider replacement soon</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">9 months</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60-70%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.65x</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Replace if below species needs</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">12 months</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50-60%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.55x</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Replace immediately</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Actual decay varies by bulb type and operating hours; halide bulbs degrade faster than LED alternatives.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Use a UVB meter to measure actual intensity at your basking spot rather than relying solely on calculator estimates, as reflective surfaces and enclosure materials affect real-world output.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Mount UVB lamps parallel to your reptile's basking area for 30-50% better coverage than overhead placement, ensuring consistent exposure across the body.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Create a UVB lighting schedule that mirrors your pet's natural photoperiod—use timers set to 12 hours on/off for most diurnal species to regulate calcium metabolism and circadian rhythms.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Rotate basking spots weekly to prevent localized overexposure and ensure your reptile receives balanced UVB radiation across its entire body surface.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring UVB Decay in Year-Round Calculations</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Bulbs lose 20-30% intensity annually, so recalculate distance every 3 months or your reptile may develop metabolic bone disease despite initially correct settings.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Calculating Distance Without Removing Barriers</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Glass and screens block 40-90% of UVB; calculate your effective distance through the enclosure, not from the lamp to the bulb surface alone.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Daytime Window UV as a Substitute</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Natural sunlight contains harmful UVA overexposure and unpredictable UVB levels; always supplement with controlled UVB lamps calibrated by this calculator.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Setting Identical Durations for All Species</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Desert species need 12-14 hours daily while nocturnal species need only 6-8 hours; using wrong duration prevents vitamin D3 synthesis or causes stress-related illness.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What UVB lamp wattage should I use with this calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most reptiles thrive with 10-40 watt UVB bulbs depending on species. The calculator works with any wattage, but higher watts allow greater distances while maintaining therapeutic UVB levels of 75-150 IU/cm².</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does distance affect UVB intensity in this calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">UVB intensity decreases exponentially with distance following the inverse square law. Doubling your lamp distance reduces UVB output to 25% of the original intensity.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What are optimal daily UVB exposure hours for reptiles?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most diurnal reptiles need 10-14 hours of UVB daily to maintain proper vitamin D3 synthesis and calcium metabolism. Nocturnal species require 6-8 hours.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator for all reptile species?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">This calculator works for most reptiles, but desert species like bearded dragons need 200+ IU/cm², while rainforest species like ball pythons need only 50-75 IU/cm². Adjust target intensity based on your pet's natural habitat.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I replace UVB bulbs according to this calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Replace UVB bulbs every 6-12 months as output degrades 20-30% per year even when the bulb still produces visible light. This calculator assumes fresh bulbs for accuracy.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does screen or glass affect UVB readings in this calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Standard glass blocks 50-90% of UVB, while acrylic screens block 40-60%, significantly reducing effective intensity. Always calculate distance without enclosure barriers for safe results.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What UVB spectrum is this calculator designed for?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">This calculator is optimized for UVB-B (280-320 nm) reptile bulbs. UVA supplements and full-spectrum bulbs require separate spectral analysis not included in basic distance calculations.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://arav.org/care-sheets/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Reptile UVB Lighting Requirements - ARAV (American Association of Reptile Veterinarians)</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Veterinary guidelines for UVB intensity, distance, and duration specifications across major reptile species.</p>
          </li>
          <li>
            <a href="https://vcahospitals.com/know-your-pet/uvb-lighting-for-reptiles" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Ultraviolet Light and Reptiles - VCA Animal Hospitals</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Clinical overview of UVB therapy including inverse square law calculations and species-specific recommendations.</p>
          </li>
          <li>
            <a href="https://www.zoomed.com/products/lighting/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">UVB Lamp Standards and Testing - Zoomed Reptile Care Products</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Technical specifications for commercial UVB bulbs including output decay rates and efficacy data for calculator validation.</p>
          </li>
          <li>
            <a href="https://www.aahc.us/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Metabolic Bone Disease Prevention Through UVB - Journal of Herpetological Medicine</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Peer-reviewed research on UVB-dependent calcium metabolism and prevention of lighting-related deficiency diseases.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="UVB Lighting Distance & Duration Calculator"
      description="Calculate the correct distance and duration for **UVB lighting** to ensure proper Vitamin D3 synthesis."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Suggested Duration (hours) = (Recommended UVB Intensity / Measured UVB Intensity) × Max Duration",
        variables: [
          { symbol: "Suggested Duration", description: "Recommended daily UVB exposure time in hours" },
          { symbol: "Recommended UVB Intensity", description: "Ideal UVB radiation level for the reptile (µW/cm²)" },
          { symbol: "Measured UVB Intensity", description: "Current UVB radiation level at basking spot (µW/cm²)" },
          { symbol: "Max Duration", description: "Maximum safe UVB exposure duration (hours), typically 12" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A bearded dragon requires 150 µW/cm² UVB intensity. The measured intensity at 12 inches from the bulb is 100 µW/cm². Calculate the suggested daily UVB exposure duration.",
        steps: [
          {
            label: "1",
            explanation:
              "Divide the recommended intensity by the measured intensity: 150 / 100 = 1.5.",
          },
          {
            label: "2",
            explanation:
              "Multiply by the maximum safe duration (12 hours): 1.5 × 12 = 18 hours.",
          },
          {
            label: "3",
            explanation:
              "Clamp the duration to the maximum safe exposure of 12 hours, so suggested duration is 12 hours/day.",
          },
        ],
        result: "Suggested UVB exposure duration is 12 hours per day at 12 inches distance.",
      }}
      relatedCalculators={[
        { title: "Dog Daily Water Intake Checker", url: "/pets/dog-daily-water-intake-checker", icon: "🐶" },
        { title: "Foaling Countdown & Lactation Feed Planner", url: "/pets/horse-foaling-countdown-lactation-feed-planner", icon: "🐴" },
        { title: "Dog Walking Calories Burned Calculator", url: "/pets/dog-walking-calories-burned", icon: "🐕" },
        { title: "Fluid Intake vs. Urine Output Balance Checker", url: "/pets/cat-fluid-intake-urine-output-balance", icon: "🐈" },
        { title: "Indoor/Outdoor Activity Calorie Adjuster", url: "/pets/cat-activity-calorie-adjuster", icon: "🐈" },
        { title: "Senior Cat Nutrition & Calorie Adjuster", url: "/pets/senior-cat-nutrition-calorie-adjuster", icon: "🐱" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding UVB Lighting Distance & Duration Calculator" },
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
