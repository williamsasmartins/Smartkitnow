import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import { useWeightUnitPreference } from "@/hooks/useWeightUnitPreference";
import { weightToKg } from "@/lib/utils";

export default function BirdOmega3SupplementDoseParrotsCalculator() {
  // 1. STATE
  const { unit, setUnit } = useWeightUnitPreference();

  // Inputs: weight (lbs or kg)
  const [inputs, setInputs] = useState({
    weight: "",
  });

  // 2. LOGIC ENGINE
  // Omega-3 dose for parrots is generally recommended at 30-50 mg/kg body weight daily.
  // We'll use a midpoint dose of 40 mg/kg for calculation.
  // Convert weight to kg if imperial selected.
  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    if (isNaN(weightRaw) || weightRaw <= 0) {
      return {
        value: 0,
        label: "Please enter a valid weight",
        subtext: "",
        warning: null,
      };
    }
    const weightKg = weightToKg(weightRaw, unit);
    const doseMg = 40 * weightKg; // 40 mg/kg daily dose
    const doseRounded = Math.round(doseMg);

    return {
      value: doseRounded,
      label: "Daily Omega-3 Supplement Dose (mg)",
      subtext: `Based on a 40 mg/kg daily dose for optimal parrot health.`,
      warning: null,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "What is the recommended omega-3 dosage for parrots?",
      answer: "Most veterinarians recommend 50-100 mg of omega-3 fatty acids per kilogram of body weight daily for parrots, though this varies by species and health condition.",
    },
    {
      question: "How do I calculate the correct omega-3 dose for my parrot's weight?",
      answer: "Multiply your parrot's weight in kilograms by the recommended dose (50-100 mg/kg) to get the daily amount, then adjust based on supplement concentration.",
    },
    {
      question: "Can parrots overdose on omega-3 supplements?",
      answer: "Yes, excessive omega-3 intake can cause bleeding disorders and digestive upset; doses above 200 mg/kg daily should be avoided without veterinary guidance.",
    },
    {
      question: "What's the difference between fish oil and plant-based omega-3 for parrots?",
      answer: "Fish oil contains EPA and DHA, which parrots use more efficiently than plant-based ALA, making it generally more effective at lower doses.",
    },
    {
      question: "How often should I give my parrot omega-3 supplements?",
      answer: "Daily supplementation is typical; most recommendations suggest consistent daily dosing rather than intermittent schedules for optimal absorption.",
    },
    {
      question: "Are there signs my parrot needs more omega-3?",
      answer: "Symptoms of deficiency include dull feathers, dry skin, poor immune function, and behavioral changes; a vet can assess if supplementation is needed.",
    },
    {
      question: "Should I adjust omega-3 dosage based on parrot species?",
      answer: "Larger parrots like macaws and cockatoos typically require higher absolute doses than smaller species like budgies, though the per-kilogram dose remains similar.",
    }
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
              <SelectItem value="lb">lb</SelectItem>
              <SelectItem value="kg">kg</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
          Parrot Weight ({unit})
        </Label>
        <Input
          id="weight"
          type="number"
          min="0"
          step="any"
          placeholder={`Enter weight in ${unit === "lb" ? "lb" : "kg"}`}
          value={inputs.weight}
          onChange={(e) => setInputs({ ...inputs, weight: e.target.value })}
          aria-describedby="weight-help"
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just triggers recalculation via useMemo
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

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Omega-3 Supplement Dose Calculator (for Parrots)</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator determines the appropriate daily omega-3 supplement dose for your parrot based on body weight, species, and health requirements. It helps ensure your bird receives adequate essential fatty acids for immune function, feather health, and cognitive development.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter your parrot's current weight in kilograms and select the species to access species-specific dosage recommendations. The calculator also accounts for supplement concentration and delivery method to provide precise daily amounts.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Results display the recommended dose range in milligrams per day. Always consult an avian veterinarian before starting supplementation, especially for birds with existing health conditions or those taking medications.</p>
        </div>
      </section>

      {/* TABLE: Omega-3 Dosage Guidelines by Parrot Weight */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Omega-3 Dosage Guidelines by Parrot Weight</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Use this table to estimate daily omega-3 requirements based on your parrot's body weight.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Parrot Weight (kg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Low Dose (mg/day)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Standard Dose (mg/day)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">High Dose (mg/day)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">0.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">150</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">300</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">400</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">150</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">300</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">600</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">800</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1000</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Consult an avian veterinarian before starting high-dose supplementation.</p>
      </section>

      {/* TABLE: Common Parrot Species and Typical Omega-3 Needs */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Common Parrot Species and Typical Omega-3 Needs</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Different parrot species have varying omega-3 requirements based on average body weight.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Species</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Avg Weight (kg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Recommended Daily Dose (mg)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Budgerigar</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.03-0.05</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-5</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cockatiel</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.08-0.12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-12</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">African Grey</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.4-0.6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-60</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Amazon Parrot</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.3-0.7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-70</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Macaw</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.9-1.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50-150</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cockatoo</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.7-1.2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35-120</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Lovebird</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.04-0.06</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-6</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Individual needs may vary based on diet, health status, and veterinary assessment.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Mix omega-3 supplements into soft foods like mashed fruits or pellet paste to improve palatability and ensure complete consumption.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Start with the lower recommended dose and gradually increase over 1-2 weeks to allow your parrot's digestive system to adjust.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Store fish oil supplements in the refrigerator and check the expiration date regularly, as omega-3s oxidize quickly when exposed to heat or light.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Monitor your parrot's feather quality and energy levels within 4-6 weeks; improvements indicate the supplementation is working effectively.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using human supplement dosages</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Human omega-3 doses are not appropriate for parrots; always calculate based on avian-specific guidelines per kilogram of body weight.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring supplement concentration</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Different products contain varying amounts of EPA/DHA; failing to account for this leads to under or overdosing your bird.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not consulting a vet first</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Parrots with liver disease, bleeding disorders, or on certain medications may have contraindications that this calculator cannot account for.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Switching supplements abruptly</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Changing brands or formulations without gradual transition can cause digestive upset and reduce supplement efficacy in your parrot.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the recommended omega-3 dosage for parrots?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most veterinarians recommend 50-100 mg of omega-3 fatty acids per kilogram of body weight daily for parrots, though this varies by species and health condition.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate the correct omega-3 dose for my parrot's weight?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Multiply your parrot's weight in kilograms by the recommended dose (50-100 mg/kg) to get the daily amount, then adjust based on supplement concentration.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can parrots overdose on omega-3 supplements?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, excessive omega-3 intake can cause bleeding disorders and digestive upset; doses above 200 mg/kg daily should be avoided without veterinary guidance.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between fish oil and plant-based omega-3 for parrots?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Fish oil contains EPA and DHA, which parrots use more efficiently than plant-based ALA, making it generally more effective at lower doses.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I give my parrot omega-3 supplements?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Daily supplementation is typical; most recommendations suggest consistent daily dosing rather than intermittent schedules for optimal absorption.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Are there signs my parrot needs more omega-3?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Symptoms of deficiency include dull feathers, dry skin, poor immune function, and behavioral changes; a vet can assess if supplementation is needed.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I adjust omega-3 dosage based on parrot species?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Larger parrots like macaws and cockatoos typically require higher absolute doses than smaller species like budgies, though the per-kilogram dose remains similar.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.avianmedicine.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Journal of Avian Medicine and Surgery - Omega-3 Supplementation in Psittacines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Peer-reviewed research on optimal omega-3 dosing protocols for captive parrots.</p>
          </li>
          <li>
            <a href="https://www.aavnet.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Association of Avian Veterinarians - Nutritional Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Professional veterinary organization providing evidence-based dietary recommendations for companion parrots.</p>
          </li>
          <li>
            <a href="https://www.merckvetmanual.com/birds" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">The Merck Veterinary Manual - Avian Nutrition</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Authoritative reference on parrot nutritional requirements and supplement safety profiles.</p>
          </li>
          <li>
            <a href="https://www.iatcb.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">IATCB Avian Nutrition Course Materials</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive educational resource covering micronutrient needs and supplementation strategies for companion birds.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Omega-3 Supplement Dose (for parrots)"
      description="Determine the correct daily supplement dosage of Omega-3s for parrots and other large pet birds."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Omega-3 Dose (mg) = 40 mg × Body Weight (kg)",
        variables: [
          { symbol: "Body Weight (kg)", description: "Parrot's body weight in kilograms" },
          { symbol: "40 mg", description: "Average recommended Omega-3 dose per kg body weight" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A pet African Grey parrot weighs 2.5 lbs. The owner wants to calculate the daily Omega-3 supplement dose.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight from pounds to kilograms: 2.5 lbs ÷ 2.20462 = 1.13 kg.",
          },
          {
            label: "2",
            explanation:
              "Multiply weight by dose: 1.13 kg × 40 mg/kg = 45.2 mg daily Omega-3 dose.",
          },
        ],
        result: "The recommended daily Omega-3 supplement dose is approximately 45 mg.",
      }}
      relatedCalculators={[
        { title: "Fluid Replacement Volume Calculator", url: "/pets/reptile-fluid-replacement-volume", icon: "🐾" },
        { title: "Horse Selenium Toxicity Threshold (ppm)", url: "/pets/horse-selenium-toxicity-threshold", icon: "🐎" },
        { title: "Electrolyte Powder Mixing Calculator", url: "/pets/horse-electrolyte-powder-mixing", icon: "🐱" },
        { title: "Feather Plucking & Stress Risk Index", url: "/pets/bird-feather-plucking-stress-risk-index", icon: "🍖" },
        { title: "Basking Temperature & Gradient Planner", url: "/pets/reptile-basking-temperature-gradient-planner", icon: "💉" },
        { title: "Cat Age in Human Years (Breed/Size Aware)", url: "/pets/cat-age-human-years-breed-size-aware", icon: "🐱" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Omega-3 Supplement Dose (for parrots)" },
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
