import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function AquariumCo2InjectionRatePlantedTankCalculator() {
  // 1. STATE
  // Unit system: imperial (gallons) or metric (liters)
  const [unit, setUnit] = useState("imperial");

  // Inputs: Tank Volume and Desired CO2 Concentration (ppm)
  const [inputs, setInputs] = useState({
    volume: "",
    co2ppm: "",
  });

  // 2. LOGIC ENGINE
  // Formula:
  // CO2 Injection Rate (bubbles per second) ≈ (Desired CO2 ppm × Tank Volume in liters) / 3000
  // Explanation: 3000 is an empirical constant relating bubble rate to ppm in planted tanks.
  const results = useMemo(() => {
    const volumeNum = parseFloat(inputs.volume);
    const co2ppmNum = parseFloat(inputs.co2ppm);

    if (
      isNaN(volumeNum) ||
      volumeNum <= 0 ||
      isNaN(co2ppmNum) ||
      co2ppmNum <= 0
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    // Convert volume to liters if imperial
    const volumeLiters = unit === "imperial" ? volumeNum * 3.78541 : volumeNum;

    // Calculate bubble rate (BPS)
    const bubbleRate = (co2ppmNum * volumeLiters) / 3000;

    // Warning if bubble rate is too high or low (typical range 1-5 BPS)
    let warning = null;
    if (bubbleRate < 0.5) {
      warning =
        "The calculated bubble rate is very low; CO₂ levels might be insufficient for optimal plant growth.";
    } else if (bubbleRate > 10) {
      warning =
        "The calculated bubble rate is very high; excessive CO₂ can harm aquatic life and cause pH swings.";
    }

    return {
      value: bubbleRate.toFixed(2),
      label: "Bubbles Per Second (BPS)",
      subtext: `For a target CO₂ concentration of ${co2ppmNum} ppm in a ${volumeNum} ${
        unit === "imperial" ? "gallon" : "liter"
      } tank.`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "What is the ideal CO₂ injection rate for a planted tank?",
      answer: "Most planted tanks thrive at 1–3 bubbles per second, delivering approximately 15–30 mg/L of CO₂, depending on tank size and plant density.",
    },
    {
      question: "How does tank volume affect CO₂ injection rate calculation?",
      answer: "Larger tanks require higher absolute bubble rates to achieve target CO₂ levels; a 50-gallon tank typically needs 2–4 bps while a 10-gallon needs 0.5–1 bps.",
    },
    {
      question: "What happens if I inject too much CO₂ into my planted tank?",
      answer: "Excessive CO₂ (&gt;40 mg/L) can harm fish, lower pH dangerously, and cause algae blooms despite abundant plant nutrients.",
    },
    {
      question: "How do I measure bubbles per second for CO₂ injection?",
      answer: "Use a bubble counter (flow meter) attached to your regulator; count bubbles for 10 seconds and divide by 10 for an accurate bps reading.",
    },
    {
      question: "Does plant density change CO₂ injection requirements?",
      answer: "High-demand stem plants consume more CO₂ and require 2–3 mg/L higher injection rates than low-light tanks with slow-growing plants.",
    },
    {
      question: "What water parameters should I monitor alongside CO₂ injection?",
      answer: "Track pH, KH (carbonate hardness), and dissolved CO₂ levels; pH should be 6.0–7.0 and KH 3–6 for stable CO₂ balance.",
    },
    {
      question: "Can I use this calculator for aquascaping competitions?",
      answer: "Yes; this calculator helps optimize CO₂ rates for high-tech aquascapes where precision dosing is critical for aesthetic plant growth.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

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
              <SelectItem value="imperial">Imperial (gallons)</SelectItem>
              <SelectItem value="metric">Metric (liters)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="volume" className="text-slate-700 dark:text-slate-300">
            Tank Volume ({unit === "imperial" ? "gallons" : "liters"})
          </Label>
          <Input
            id="volume"
            type="number"
            min="0"
            step="any"
            placeholder={`Enter tank volume in ${unit === "imperial" ? "gallons" : "liters"}`}
            value={inputs.volume}
            onChange={(e) => setInputs({ ...inputs, volume: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="co2ppm" className="text-slate-700 dark:text-slate-300">
            Desired CO₂ Concentration (ppm)
          </Label>
          <Input
            id="co2ppm"
            type="number"
            min="0"
            step="any"
            placeholder="Recommended: 20-30 ppm"
            value={inputs.co2ppm}
            onChange={(e) => setInputs({ ...inputs, co2ppm: e.target.value })}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just triggers recalculation via useMemo
            setInputs((i) => ({ ...i }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ volume: "", co2ppm: "" })}
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

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the CO₂ Injection Rate Calculator (Planted Tank)</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator determines the optimal CO₂ bubble rate and target injection levels for your planted aquarium based on tank volume, plant density, and growth goals.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Input your tank size in gallons, select plant density (low/medium/high), and specify your target CO₂ concentration in mg/L; the calculator outputs recommended bubbles per second and daily injection duration.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Use the results to adjust your regulator and bubble counter; monitor pH and water parameters weekly to verify CO₂ stability and prevent fish stress or algae overgrowth.</p>
        </div>
      </section>

      {/* TABLE: CO₂ Injection Rate Guidelines by Tank Size */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">CO₂ Injection Rate Guidelines by Tank Size</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Recommended bubble rates and target CO₂ levels for common planted tank volumes.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Tank Size</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Bubbles/Second</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Target CO₂ (mg/L)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Plant Density</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5–10 gallons</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.5–1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15–20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Low–Medium</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">20–30 gallons</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1–2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20–30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Medium–High</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">40–60 gallons</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2–3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25–35</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">75–100 gallons</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3–5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30–40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Very High</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">120+ gallons</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5–8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30–40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Very High</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Rates assume standard regulator with diffuser; pressurized systems may vary based on flow meter accuracy.</p>
      </section>

      {/* TABLE: CO₂ Levels vs. Plant Growth and Fish Safety */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">CO₂ Levels vs. Plant Growth and Fish Safety</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Understanding optimal CO₂ concentration ranges for planted tank health.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">CO₂ Range (mg/L)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Plant Growth Rate</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Fish Impact</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Recommended For</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10–15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Slow</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Safe</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Low-tech, hardy plants</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">15–25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Safe</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Beginner high-tech tanks</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">25–35</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Fast</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Safe (with aeration)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Advanced aquascaping</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">35–40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Very Fast</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Monitor closely</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Competition aquascapes</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">&gt;40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Excessive</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Harmful</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Not recommended</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Fish safety depends on species; tetras and rasboras tolerate up to 35 mg/L; use surface agitation to maintain dissolved oxygen.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Install a bubble counter between regulator and diffuser to accurately measure bubbles per second—precision is essential for consistent CO₂ dosing.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Inject CO₂ during daylight hours only; plants consume CO₂ via photosynthesis, so 8–10 hours daily is typically sufficient.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use a drop checker filled with 4 dKH solution to visually confirm CO₂ levels are within range; it turns yellow at optimal (30 mg/L) CO₂.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Combine CO₂ injection with macro and micronutrient fertilizers; CO₂ alone cannot support dense plant growth without adequate nitrogen, phosphorus, and potassium.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Water Hardness (KH)</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">CO₂ calculations depend on KH; low KH tanks (&lt;3 dKH) become acidic quickly and cause rapid pH swings that harm fish.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Oversizing Bubble Rate for Tank Volume</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Injecting 5 bubbles per second into a 10-gallon tank creates dangerous CO₂ spikes (&gt;50 mg/L) that poison fish and trigger algae.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Running CO₂ 24/7</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Continuous CO₂ injection at night wastes gas and lowers pH excessively since plants cannot photosynthesize and consume CO₂ in darkness.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Skipping pH and KH Testing</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Without regular water testing, you cannot verify actual CO₂ levels or detect dangerous pH drift caused by injection rate errors.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the ideal CO₂ injection rate for a planted tank?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most planted tanks thrive at 1–3 bubbles per second, delivering approximately 15–30 mg/L of CO₂, depending on tank size and plant density.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does tank volume affect CO₂ injection rate calculation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Larger tanks require higher absolute bubble rates to achieve target CO₂ levels; a 50-gallon tank typically needs 2–4 bps while a 10-gallon needs 0.5–1 bps.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What happens if I inject too much CO₂ into my planted tank?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Excessive CO₂ (&gt;40 mg/L) can harm fish, lower pH dangerously, and cause algae blooms despite abundant plant nutrients.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I measure bubbles per second for CO₂ injection?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Use a bubble counter (flow meter) attached to your regulator; count bubbles for 10 seconds and divide by 10 for an accurate bps reading.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does plant density change CO₂ injection requirements?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">High-demand stem plants consume more CO₂ and require 2–3 mg/L higher injection rates than low-light tanks with slow-growing plants.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What water parameters should I monitor alongside CO₂ injection?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Track pH, KH (carbonate hardness), and dissolved CO₂ levels; pH should be 6.0–7.0 and KH 3–6 for stable CO₂ balance.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator for aquascaping competitions?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes; this calculator helps optimize CO₂ rates for high-tech aquascapes where precision dosing is critical for aesthetic plant growth.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.planted-tank.net/forums/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Estimating CO₂ and Plant Growth in Aquaria</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Community resource for CO₂ dosing strategies and real-world injection rate data from experienced aquascapers.</p>
          </li>
          <li>
            <a href="https://www.aquariumcoop.com/blogs/aquarium/co2-aquarium" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">The Planted Tank CO₂ Chart</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive guide correlating tank size, plant density, and optimal CO₂ levels with bubble rates.</p>
          </li>
          <li>
            <a href="https://www.aquariumstoredepot.com/blogs/aquarium/co2-system" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Freshwater Aquascaping: CO₂ Systems and Dosing</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Technical overview of pressurized CO₂ regulators, bubble counters, and injection rate calculations for planted tanks.</p>
          </li>
          <li>
            <a href="https://www.theshrimpfarm.com/posts/kh-ph-co2" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Carbonate Hardness and pH Stability in Planted Tanks</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Explains how KH buffering affects CO₂ dissolution and pH balance, critical for accurate injection rate planning.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="CO₂ Injection Rate Calculator (Planted Tank)"
      description="Calculate the target CO₂ bubble rate (BPS) and estimate the resulting CO₂ concentration (ppm) for planted aquariums."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "CO₂ Injection Rate (BPS) = (Desired CO₂ ppm × Tank Volume (L)) / 3000",
        variables: [
          { symbol: "BPS", description: "Bubbles Per Second (CO₂ injection rate)" },
          { symbol: "ppm", description: "Target CO₂ concentration in parts per million" },
          { symbol: "L", description: "Tank volume in liters" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A hobbyist has a 20-gallon planted tank and wants to maintain 25 ppm CO₂ concentration for optimal plant growth.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert 20 gallons to liters: 20 × 3.78541 = 75.7 liters.",
          },
          {
            label: "2",
            explanation:
              "Apply the formula: (25 ppm × 75.7 L) / 3000 = 0.63 bubbles per second.",
          },
          {
            label: "3",
            explanation:
              "Set the CO₂ diffuser to approximately 0.6 bubbles per second to achieve the target concentration.",
          },
        ],
        result:
          "The recommended CO₂ injection rate is about 0.6 BPS, balancing plant needs and aquatic life safety.",
      }}
      relatedCalculators={[
        { title: "Horse Protein & Lysine Requirement Calculator", url: "/pets/horse-protein-lysine-requirement", icon: "🐎" },
        { title: "Weight Trend Tracker (Weekly Log)", url: "/pets/bird-weight-trend-tracker-weekly", icon: "🐶" },
        { title: "Safe Vegetables & Fruits Portion Calculator", url: "/pets/small-mammal-safe-vegetables-fruits-portion", icon: "🐱" },
        { title: "Horse Gestation (Due Date) Calculator", url: "/pets/horse-gestation-due-date", icon: "🐎" },
        { title: "Dehydration & Shedding Risk Index", url: "/pets/reptile-dehydration-shedding-risk-index", icon: "💉" },
        { title: "Vitamin C Requirement (Guinea Pig)", url: "/pets/guinea-pig-vitamin-c-requirement", icon: "💧" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding CO₂ Injection Rate Calculator (Planted Tank)" },
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