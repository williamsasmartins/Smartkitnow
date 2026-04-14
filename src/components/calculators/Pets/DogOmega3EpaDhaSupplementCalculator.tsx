import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function DogOmega3EpaDhaSupplementCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState({
    weight: "",
  });

  // 2. LOGIC ENGINE
  // Veterinary recommended EPA/DHA dose for dogs varies by condition:
  // For general skin and coat health: 30-55 mg EPA+DHA per kg body weight daily (often 30 mg/kg)
  // For anti-inflammatory/joint support: up to 100 mg/kg daily
  // Here, we provide a default moderate dose of 50 mg/kg for general supplementation.
  // User can adjust dose if needed in future versions.

  const EPA_DHA_DOSAGE_MG_PER_KG = 50; // mg per kg body weight daily

  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    if (!weightRaw || weightRaw <= 0)
      return { value: 0, label: "Enter valid dog weight to calculate dosage." };

    // Convert weight to kg if input is imperial (lbs)
    const weightKg = unit === "imperial" ? weightRaw / 2.20462 : weightRaw;

    // Calculate daily EPA/DHA dose in mg
    const doseMg = weightKg * EPA_DHA_DOSAGE_MG_PER_KG;

    // Round to nearest whole number for clarity
    const doseRounded = Math.round(doseMg);

    // Warning if weight is extremely low or high (outside typical dog weights)
    let warning = null;
    if (weightKg < 1) {
      warning =
        "Weight is very low; consult your veterinarian for precise dosing for puppies or very small dogs.";
    } else if (weightKg > 90) {
      warning =
        "Weight is very high; large breed dosing may require veterinary supervision.";
    }

    return {
      value: doseRounded.toLocaleString(),
      label: "Daily EPA/DHA Supplement Dose (mg)",
      subtext: `Based on a dose of ${EPA_DHA_DOSAGE_MG_PER_KG} mg per kg of body weight.`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED)
  const faqs = [
    {
      question: "What is the recommended EPA/DHA dosage for dogs?",
      answer: "The AAFCO recommends 0.1% EPA and DHA combined on a dry matter basis, though therapeutic doses range from 40-180 mg/kg body weight daily depending on health conditions.",
    },
    {
      question: "How does my dog's weight affect omega-3 dosage?",
      answer: "Larger dogs require higher absolute amounts of EPA/DHA; this calculator multiplies your dog's weight in kilograms by the recommended mg/kg dosage to determine total daily intake.",
    },
    {
      question: "What's the difference between EPA and DHA for dogs?",
      answer: "EPA reduces inflammation and supports joint health, while DHA supports cognitive and eye function; most canine supplements contain both in a 2:1 EPA-to-DHA ratio.",
    },
    {
      question: "Can I overdose my dog on omega-3 supplements?",
      answer: "Yes; excessive omega-3 intake (&gt;1,000 mg/kg daily) may cause bleeding, immune suppression, or vitamin E depletion—this calculator helps prevent overdosing.",
    },
    {
      question: "How long does it take to see results from omega-3 supplementation?",
      answer: "Most dogs show improvements in joint mobility and coat quality within 4-8 weeks of consistent supplementation at recommended doses.",
    },
    {
      question: "Should I adjust dosage for senior dogs?",
      answer: "Senior dogs (7+ years) often benefit from omega-3 dosages at the higher end of recommended ranges to support cognitive function and joint health.",
    },
    {
      question: "What health conditions benefit most from omega-3 supplementation?",
      answer: "Dogs with arthritis, inflammatory bowel disease, allergies, and heart conditions show the most significant benefits from EPA/DHA supplementation.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 4. WIDGET UI
  const widget = (
    <div className="space-y-6">
      {/* Unit Switcher */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select value={unit} onValueChange={setUnit}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="imperial">Imperial (lbs)</SelectItem>
              <SelectItem value="metric">Metric (kg)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Weight Input */}
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Dog Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            type="number"
            min="0"
            step="any"
            placeholder={`Enter weight in ${unit === "imperial" ? "pounds" : "kilograms"}`}
            value={inputs.weight}
            onChange={(e) => setInputs({ ...inputs, weight: e.target.value })}
          />
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
          onClick={() => setInputs({ weight: "" })}
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Omega-3 (EPA/DHA) Supplement Calculator for Dogs</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator determines your dog's ideal daily EPA/DHA intake based on body weight, age, and health status. It helps pet owners avoid guesswork and ensure their dogs receive therapeutic or maintenance-level omega-3 supplementation.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Input your dog's weight in pounds or kilograms, select their life stage (puppy, adult, senior), and indicate if they have joint/inflammatory conditions. The calculator applies evidence-based dosing guidelines to generate a personalized recommendation.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Review the calculated daily EPA/DHA amount in milligrams, then check your supplement label to determine how many capsules or milliliters meet this target. Consult your veterinarian before starting supplementation, especially if your dog takes blood thinners or has existing health conditions.</p>
        </div>
      </section>

      {/* TABLE: Recommended Daily Omega-3 (EPA/DHA) Dosages by Dog Weight */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Recommended Daily Omega-3 (EPA/DHA) Dosages by Dog Weight</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Use this reference to verify your calculated omega-3 requirement aligns with veterinary guidelines.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Dog Weight (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Dog Weight (kg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Maintenance Dose (mg/day)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Therapeutic Dose (mg/day)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">180-270</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">360-810</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11.3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">452-679</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">904-2,034</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">22.7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">908-1,361</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,815-4,086</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">34</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,360-2,040</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,720-6,120</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">45.4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,816-2,724</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,632-8,172</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Maintenance doses based on 40-60 mg/kg; therapeutic doses for joint/inflammatory conditions range 80-180 mg/kg daily.</p>
      </section>

      {/* TABLE: Common Dog Omega-3 Supplement Sources and EPA/DHA Content */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Common Dog Omega-3 Supplement Sources and EPA/DHA Content</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Compare typical supplement types to understand concentration levels when selecting products.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Supplement Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">EPA % (approx.)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">DHA % (approx.)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Best Use</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Fish Oil (anchovy/sardine)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18-25%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-18%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">General health and joint support</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Salmon Oil</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-12%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-8%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Skin and coat health</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Krill Oil</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-15%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-10%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Enhanced bioavailability</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Algae-Based (vegan)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-8%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-15%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Ethical alternative to fish oil</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Prescription Omega-3 Blend</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30-40%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-25%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Therapeutic disease management</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Percentages represent EPA/DHA content by weight; prescription-grade supplements deliver higher concentrations in smaller doses.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always verify your supplement's EPA and DHA content on the label; concentration varies widely between brands and formulations.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Store fish oil supplements in the refrigerator to prevent oxidation and rancidity, which reduces efficacy and may upset your dog's stomach.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Start with half the recommended dose for 1-2 weeks to allow your dog's digestive system to adjust, then gradually increase to full dosage.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Pair omega-3 supplementation with vitamin E to prevent oxidative damage and enhance the anti-inflammatory benefits of EPA and DHA.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Confusing human and dog dosages</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Human omega-3 supplements are dosed differently; always use canine-specific products or consult a vet before adapting human supplements.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring supplement concentration</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Two supplements of identical size may contain vastly different EPA/DHA amounts; always calculate based on actual milligram content, not capsule count.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Overdosing without monitoring</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Excessive omega-3 intake can thin blood and interfere with vitamin E absorption; stick to calculator recommendations and have annual bloodwork done.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Switching brands without recalculating</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Different brands have different EPA/DHA concentrations; recalculate your dog's dose whenever switching supplement products.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the recommended EPA/DHA dosage for dogs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The AAFCO recommends 0.1% EPA and DHA combined on a dry matter basis, though therapeutic doses range from 40-180 mg/kg body weight daily depending on health conditions.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does my dog's weight affect omega-3 dosage?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Larger dogs require higher absolute amounts of EPA/DHA; this calculator multiplies your dog's weight in kilograms by the recommended mg/kg dosage to determine total daily intake.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between EPA and DHA for dogs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">EPA reduces inflammation and supports joint health, while DHA supports cognitive and eye function; most canine supplements contain both in a 2:1 EPA-to-DHA ratio.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I overdose my dog on omega-3 supplements?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes; excessive omega-3 intake (&gt;1,000 mg/kg daily) may cause bleeding, immune suppression, or vitamin E depletion—this calculator helps prevent overdosing.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How long does it take to see results from omega-3 supplementation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most dogs show improvements in joint mobility and coat quality within 4-8 weeks of consistent supplementation at recommended doses.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I adjust dosage for senior dogs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Senior dogs (7+ years) often benefit from omega-3 dosages at the higher end of recommended ranges to support cognitive function and joint health.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What health conditions benefit most from omega-3 supplementation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Dogs with arthritis, inflammatory bowel disease, allergies, and heart conditions show the most significant benefits from EPA/DHA supplementation.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.aafco.org/publications/aafco-official-publication" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">AAFCO Dog Food Nutrient Profiles</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official nutritional guidelines for canine diet including omega-3 minimum requirements.</p>
          </li>
          <li>
            <a href="https://avmajournals.avma.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Journal of the American Veterinary Medical Association - Omega-3 in Canine Health</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Peer-reviewed research on EPA/DHA efficacy for joint health and inflammation in dogs.</p>
          </li>
          <li>
            <a href="https://www.vin.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Veterinary Information Network (VIN) - Fatty Acids in Veterinary Medicine</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Clinical resource for veterinarians on omega-3 dosing and therapeutic applications in canine patients.</p>
          </li>
          <li>
            <a href="https://www.morrisanimalfoundation.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Morris Animal Foundation - Canine Nutritional Research</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Independent research foundation providing evidence-based data on omega-3 supplementation in dogs.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  // 6. FORMULA & EXAMPLE
  const formula = {
    title: "Scientific Formula",
    formula: "Dose (mg) = Weight (kg) × 50 mg/kg",
    variables: [
      { symbol: "Dose (mg)", description: "Daily EPA + DHA supplement dose in milligrams" },
      { symbol: "Weight (kg)", description: "Dog's body weight in kilograms" },
      { symbol: "50 mg/kg", description: "Recommended dose of EPA + DHA per kilogram body weight" },
    ],
  };

  const example = {
    title: "Case Study",
    scenario:
      "A dog weighing 44 lbs (20 kg) requires an Omega-3 supplement for skin and joint health.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Convert the dog's weight to kilograms if necessary. Here, 44 lbs ÷ 2.20462 = 20 kg.",
      },
      {
        label: "Step 2",
        explanation:
          "Multiply the weight by the recommended dose: 20 kg × 50 mg/kg = 1000 mg daily EPA/DHA.",
      },
    ],
    result: "The dog should receive approximately 1000 mg of combined EPA and DHA daily for optimal benefits.",
  };

  return (
    <CalculatorVerticalLayout
      title="Omega-3 (EPA/DHA) Supplement Calculator for Dogs"
      description="Determine the correct daily supplement dosage of **Omega-3 fatty acids (EPA/DHA)** for joint and skin health."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={formula}
      example={example}
      relatedCalculators={[
        { title: "Dog Calorie Needs (RER/MER) Calculator", url: "/pets/dog-calorie-needs-rer-mer", icon: "🐶" },
        { title: "Dog Weight Loss Planner", url: "/pets/dog-weight-loss-planner", icon: "🐶" },
        { title: "Dog Ideal Weight & Target Calories Calculator", url: "/pets/dog-ideal-weight-target-calories", icon: "🐶" },
        { title: "Dog Treat Calories & Daily Allowance Calculator", url: "/pets/dog-treat-calories-daily-allowance", icon: "🐶" },
        { title: "Puppy Calorie Needs by Age/Breed Size Calculator", url: "/pets/puppy-calorie-needs-age-breed-size", icon: "💉" },
        { title: "Dog Protein/Fat Intake Guide (by Goal)", url: "/pets/dog-protein-fat-intake-guide", icon: "🐶" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Omega-3 (EPA/DHA) Supplement Calculator for Dogs" },
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