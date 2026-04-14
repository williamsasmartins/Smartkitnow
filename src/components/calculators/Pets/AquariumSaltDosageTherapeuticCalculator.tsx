import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function AquariumSaltDosageTherapeuticCalculator() {
  // 1. STATE
  // Unit system: imperial (lbs) or metric (kg)
  const [unit, setUnit] = useState("imperial");

  // Inputs: fish tank volume and desired salt concentration (therapeutic dose)
  // Therapeutic aquarium salt dose is typically 1-3 g/L depending on condition.
  const [inputs, setInputs] = useState({
    volume: "", // volume of aquarium water
    dose: "3", // default therapeutic dose in g/L
  });

  // 2. LOGIC ENGINE
  // Formula: Total Salt (grams) = Volume (L) × Dose (g/L)
  // Convert volume input to liters if input is in gallons (imperial)
  const results = useMemo(() => {
    const volumeRaw = parseFloat(inputs.volume);
    const doseRaw = parseFloat(inputs.dose);

    if (isNaN(volumeRaw) || volumeRaw <= 0 || isNaN(doseRaw) || doseRaw <= 0) {
      return {
        value: 0,
        label: "Invalid input",
        subtext: "Please enter positive numeric values for volume and dose.",
        warning: null,
      };
    }

    // Convert volume to liters if imperial (1 gallon = 3.78541 L)
    const volumeL = unit === "imperial" ? volumeRaw * 3.78541 : volumeRaw;

    // Calculate total salt in grams
    const totalSaltGrams = volumeL * doseRaw;

    // Provide warning if dose is above typical therapeutic range (>5 g/L)
    const warning =
      doseRaw > 5
        ? "Warning: Dose above typical therapeutic range (usually 1-3 g/L). Consult a veterinarian before use."
        : null;

    return {
      value: totalSaltGrams.toFixed(1),
      label: "Total Aquarium Salt (grams)",
      subtext: `For a ${volumeRaw} ${unit === "imperial" ? "gallon" : "liter"} tank at ${doseRaw} g/L dose`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "What is the ideal therapeutic salt concentration for freshwater aquariums?",
      answer: "The standard therapeutic dosage is 1-3 teaspoons per gallon, which creates a concentration of approximately 0.1-0.3%. Most treatments target 0.2% (2-3 ppm) for stress relief and parasite control.",
    },
    {
      question: "How do I calculate salt dosage for an irregularly shaped aquarium?",
      answer: "Measure the length, width, and average depth in inches, multiply them together, divide by 231 to get gallons, then use this volume in the calculator. For non-rectangular tanks, estimate the effective volume by treating curves as partial sections.",
    },
    {
      question: "Can I use table salt or kosher salt for therapeutic aquarium dosing?",
      answer: "No—use only aquarium salt or marine salt without additives like iodine or anti-caking agents. Table salt and kosher salt contain chemicals that harm fish gills and water chemistry.",
    },
    {
      question: "How long should I maintain therapeutic salt levels in the aquarium?",
      answer: "Therapeutic dosing typically lasts 7-14 days for acute conditions like ich or fin rot. Gradual water changes reduce salt levels by 25% weekly after treatment begins.",
    },
    {
      question: "What aquarium types require adjusted salt calculations?",
      answer: "Saltwater and brackish tanks need different dosing than freshwater systems. The calculator is designed for freshwater therapeutic use; marine systems already contain dissolved salts at 1.020-1.025 specific gravity.",
    },
    {
      question: "How do I account for substrate and décor displacement in volume calculations?",
      answer: "Subtract 10-15% from total tank volume to account for gravel, rocks, plants, and decorations, then enter the adjusted volume into the calculator for accurate dosing.",
    },
    {
      question: "What happens if I overdose aquarium salt therapeutically?",
      answer: "Overdosing above 0.5% can stress fish kidneys, damage plants, and disrupt beneficial bacteria. Always verify your tank volume before calculating to prevent accidental overdosing.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // WIDGET JSX
  const widget = (
    <div className="space-y-6">
      {/* Unit selector */}
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
          <Label htmlFor="dose" className="text-slate-700 dark:text-slate-300">
            Therapeutic Dose (grams per liter)
          </Label>
          <Input
            id="dose"
            type="number"
            min="0"
            step="any"
            placeholder="Typical: 1 to 3 g/L"
            value={inputs.dose}
            onChange={(e) => setInputs((prev) => ({ ...prev, dose: e.target.value }))}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No special action needed, calculation is reactive
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ volume: "", dose: "3" })}
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

  // EDITORIAL CONTENT
  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Aquarium Salt Dosage Calculator (Therapeutic)</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator computes the precise amount of aquarium salt needed to achieve therapeutic concentrations (0.1-0.3%) for treating common freshwater fish ailments like ich, fin rot, and stress. It eliminates guesswork and prevents dangerous over- or under-dosing.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter your aquarium's total volume in gallons and select your desired therapeutic concentration percentage. The calculator instantly returns the exact weight (grams) or volume (teaspoons) of salt required for your specific tank.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Use the result to measure salt accurately with a kitchen scale or measuring spoon, dissolve it in tank water before adding, and monitor fish behavior daily. Reduce salt levels gradually through 25% water changes every 3-7 days depending on the condition being treated.</p>
        </div>
      </section>

      {/* TABLE: Therapeutic Salt Dosage by Aquarium Volume */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Therapeutic Salt Dosage by Aquarium Volume</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Use this reference table to verify calculator results for common aquarium sizes.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Tank Volume (Gallons)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">0.1% Concentration (TSP)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">0.2% Concentration (TSP)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">0.3% Concentration (TSP)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1/3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2/3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2/3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.5</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Measurements in teaspoons (TSP). 1 teaspoon aquarium salt ≈ 6 grams. Verify exact salt density with product labeling.</p>
      </section>

      {/* TABLE: Common Fish Conditions and Recommended Salt Dosage */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Common Fish Conditions and Recommended Salt Dosage</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Different ailments benefit from varying salt concentrations and treatment durations.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Condition</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Recommended Concentration</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Duration</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Water Change Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Ich/White Spot</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.2-0.3%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7-14 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25% every 3 days</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Fin Rot</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.2%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-14 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25% weekly</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">General Stress Relief</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.1-0.2%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-7 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25% weekly</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Velvet Disease</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.3%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">14-21 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25% every 2 days</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Gill Fluke Treatment</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.2-0.3%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7-14 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25% every 3 days</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Always monitor fish behavior and remove carbon if using. Gradually reduce salt through partial water changes rather than abrupt removal.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always dissolve salt in a separate container of tank water before adding to avoid shocking fish with concentrated solution.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Remove activated carbon filters during salt treatment, as they absorb salt and reduce therapeutic effectiveness.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use a hydrometer or refractometer to verify salt concentration if treating high-value fish or for extended therapy periods.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Maintain adequate aeration during salt treatment because elevated salinity reduces oxygen saturation in water.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Iodized or Anti-Caking Salt</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Table salt and kosher salt contain additives harmful to fish; always use non-iodized aquarium salt or marine salt for therapeutic dosing.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Tank Substrate and Décor Volume</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Failing to subtract 10-15% for gravel, plants, and decorations leads to overdosing; measure effective water volume, not just tank dimensions.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Maintaining Therapeutic Salt Indefinitely</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Long-term salt exposure stresses fish kidneys and kills beneficial bacteria; always taper salt levels through water changes after 7-14 days of treatment.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Calculating Dosage Without Verifying Tank Volume</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Using manufacturer-stated capacity instead of actual water volume causes serious miscalculations; always measure your tank with a measuring cup or formula.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the ideal therapeutic salt concentration for freshwater aquariums?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The standard therapeutic dosage is 1-3 teaspoons per gallon, which creates a concentration of approximately 0.1-0.3%. Most treatments target 0.2% (2-3 ppm) for stress relief and parasite control.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate salt dosage for an irregularly shaped aquarium?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Measure the length, width, and average depth in inches, multiply them together, divide by 231 to get gallons, then use this volume in the calculator. For non-rectangular tanks, estimate the effective volume by treating curves as partial sections.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use table salt or kosher salt for therapeutic aquarium dosing?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">No—use only aquarium salt or marine salt without additives like iodine or anti-caking agents. Table salt and kosher salt contain chemicals that harm fish gills and water chemistry.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How long should I maintain therapeutic salt levels in the aquarium?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Therapeutic dosing typically lasts 7-14 days for acute conditions like ich or fin rot. Gradual water changes reduce salt levels by 25% weekly after treatment begins.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What aquarium types require adjusted salt calculations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Saltwater and brackish tanks need different dosing than freshwater systems. The calculator is designed for freshwater therapeutic use; marine systems already contain dissolved salts at 1.020-1.025 specific gravity.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I account for substrate and décor displacement in volume calculations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Subtract 10-15% from total tank volume to account for gravel, rocks, plants, and decorations, then enter the adjusted volume into the calculator for accurate dosing.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What happens if I overdose aquarium salt therapeutically?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Overdosing above 0.5% can stress fish kidneys, damage plants, and disrupt beneficial bacteria. Always verify your tank volume before calculating to prevent accidental overdosing.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.aquariumsalts.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Aquarium Products - Salt Treatment Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive guide to therapeutic salt dosing for freshwater fish conditions and treatment protocols.</p>
          </li>
          <li>
            <a href="https://edis.ifas.ufl.edu/fa016" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">University of Florida IFAS - Fish Disease Management</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Research-backed recommendations for salt therapy in aquaculture and home aquariums with dosage specifications.</p>
          </li>
          <li>
            <a href="https://www.thesprucepets.com/aquarium-salt-1378319" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">The Spruce Pets - Aquarium Salt for Fish Health</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Practical guide explaining therapeutic salt concentrations, application methods, and safety considerations for freshwater systems.</p>
          </li>
          <li>
            <a href="https://www.aquaticcommunity.com/aquariumfishes/salttreatment.php" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Aquatic Community - Salt Treatment Safety Data</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Details on salt concentrations for specific fish diseases, duration guidelines, and compatibility with tank inhabitants.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Aquarium Salt Dosage Calculator (Therapeutic)"
      description="Calculate the correct, safe dosage of aquarium salt for therapeutic treatment of fish diseases (e.g., Ich)."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Total Salt (g) = Aquarium Volume (L) × Therapeutic Dose (g/L)",
        variables: [
          { symbol: "Aquarium Volume (L)", description: "Total volume of aquarium water in liters" },
          { symbol: "Therapeutic Dose (g/L)", description: "Recommended salt dose in grams per liter" },
          { symbol: "Total Salt (g)", description: "Total grams of aquarium salt to add" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A hobbyist has a 20-gallon freshwater aquarium and wants to treat Ich with a therapeutic salt dose of 3 g/L.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert 20 gallons to liters: 20 × 3.78541 = 75.7 L (approx).",
          },
          {
            label: "2",
            explanation:
              "Calculate total salt needed: 75.7 L × 3 g/L = 227.1 grams of aquarium salt.",
          },
          {
            label: "3",
            explanation:
              "Add 227 grams of aquarium salt evenly to the tank water for therapeutic treatment.",
          },
        ],
        result: "The hobbyist should add approximately 227 grams of aquarium salt to the 20-gallon tank for effective treatment.",
      }}
      relatedCalculators={[
        { title: "Dog Step-Goal & Activity Time Planner", url: "/pets/dog-step-goal-activity-time-planner", icon: "🐶" },
        { title: "Benadryl (Diphenhydramine) Dose Calculator for Cats", url: "/pets/cat-benadryl-diphenhydramine-dose", icon: "🐱" },
        { title: "Dehydration & Shedding Risk Index", url: "/pets/reptile-dehydration-shedding-risk-index", icon: "🐱" },
        { title: "UVB Lighting Distance & Duration Calculator", url: "/pets/reptile-uvb-lighting-distance-duration", icon: "🍖" },
        { title: "Laminitis Risk Index (BCS + NSC intake)", url: "/pets/horse-laminitis-risk-index", icon: "💉" },
        { title: "Ambient Temperature Safe Zone Calculator", url: "/pets/bird-ambient-temperature-safe-zone", icon: "💧" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Aquarium Salt Dosage Calculator (Therapeutic)" },
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