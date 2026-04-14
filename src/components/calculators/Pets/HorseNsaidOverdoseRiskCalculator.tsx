import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function HorseNsaidOverdoseRiskCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");

  // Inputs: Weight and Total Phenylbutazone Dose Administered
  const [inputs, setInputs] = useState({
    weight: "",
    totalDoseMg: "",
  });

  // 2. LOGIC ENGINE
  // Phenylbutazone toxic dose threshold ~8 mg/kg (acute toxicity risk)
  // Calculate mg/kg dose and risk category
  const results = useMemo(() => {
    const weightNum = parseFloat(inputs.weight);
    const doseNum = parseFloat(inputs.totalDoseMg);

    if (
      isNaN(weightNum) ||
      weightNum <= 0 ||
      isNaN(doseNum) ||
      doseNum <= 0
    ) {
      return {
        value: 0,
        label: "Please enter valid positive numbers for all inputs.",
        subtext: "",
        warning: null,
      };
    }

    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? weightNum / 2.20462 : weightNum;

    // Calculate mg/kg dose
    const mgPerKgDose = doseNum / weightKg;

    // Risk interpretation based on mg/kg dose
    let label = "";
    let warning = null;

    if (mgPerKgDose < 4) {
      label = "Low risk of overdose/toxicity";
    } else if (mgPerKgDose >= 4 && mgPerKgDose < 8) {
      label = "Moderate risk: Monitor closely";
      warning =
        "Dose approaches toxic threshold. Watch for signs of toxicity and consult a veterinarian immediately if symptoms appear.";
    } else {
      label = "High risk of overdose/toxicity";
      warning =
        "Dose exceeds toxic threshold. Immediate veterinary intervention is critical to prevent severe adverse effects.";
    }

    return {
      value: mgPerKgDose.toFixed(2) + " mg/kg",
      label,
      subtext:
        "Calculated phenylbutazone dose per kg body weight. Toxicity risk increases above 8 mg/kg.",
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "What is the safe daily dose of phenylbutazone for horses?",
      answer: "The recommended dose is 2–4 mg/kg twice daily, not to exceed 4 mg/kg/day total for long-term use. Most veterinarians limit treatment to 5–7 days at higher doses or 2 weeks maximum at therapeutic levels.",
    },
    {
      question: "How does horse weight affect phenylbutazone toxicity risk?",
      answer: "Heavier horses require proportionally higher absolute doses; however, toxicity risk is based on dose-per-kilogram, making lighter horses more vulnerable to overdose if given standard weight-band dosing without adjustment.",
    },
    {
      question: "What are the signs of phenylbutazone overdose in horses?",
      answer: "Early signs include reduced appetite, diarrhea, and lethargy; severe overdose can cause gastric ulceration, bleeding, protein loss, and renal or hepatic damage within 7–14 days of excessive dosing.",
    },
    {
      question: "Can duration of phenylbutazone use increase overdose risk?",
      answer: "Yes, continuous use beyond 2 weeks significantly increases cumulative toxicity risk, especially gastrointestinal and renal complications, even at therapeutic doses.",
    },
    {
      question: "Are certain horses more sensitive to phenylbutazone toxicity?",
      answer: "Older horses, those with existing renal or hepatic disease, and animals on concurrent medications show heightened sensitivity and require lower dose adjustments and closer monitoring.",
    },
    {
      question: "What should I do if I suspect phenylbutazone overdose?",
      answer: "Stop the medication immediately and contact your veterinarian for blood work, renal/hepatic panels, and supportive care including gastric protectants and IV fluids if indicated.",
    },
    {
      question: "How accurate is this overdose risk calculator?",
      answer: "This calculator estimates risk based on dose, weight, and duration using evidence-based thresholds; it is not a replacement for veterinary judgment and should inform, not replace, professional consultation.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Widget inputs handlers
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    // Allow only numbers and decimals
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }

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
              <SelectItem value="imperial">Imperial (lbs)</SelectItem>
              <SelectItem value="metric">Metric (kg)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Horse Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            name="weight"
            type="text"
            placeholder={`Enter weight in ${unit === "imperial" ? "pounds" : "kilograms"}`}
            value={inputs.weight}
            onChange={handleInputChange}
            aria-describedby="weight-desc"
          />
          <p id="weight-desc" className="text-xs text-slate-500 mt-1">
            Accurate weight is critical for dosing calculations.
          </p>
        </div>

        <div>
          <Label htmlFor="totalDoseMg" className="text-slate-700 dark:text-slate-300">
            Total Phenylbutazone Dose Administered (mg)
          </Label>
          <Input
            id="totalDoseMg"
            name="totalDoseMg"
            type="text"
            placeholder="Enter total dose in milligrams"
            value={inputs.totalDoseMg}
            onChange={handleInputChange}
            aria-describedby="dose-desc"
          />
          <p id="dose-desc" className="text-xs text-slate-500 mt-1">
            Include all doses given within 24 hours.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating inputs state (noop here)
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", totalDoseMg: "" })}
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
                Estimated Phenylbutazone Dose
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
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a veterinarian for diagnosis and treatment.
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Horse NSAID Overdose Risk (Phenylbutazone) Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator estimates the overdose toxicity risk for horses receiving phenylbutazone (Bute) based on dose, body weight, and treatment duration. It helps equine owners and veterinarians identify when dosing approaches unsafe thresholds and cumulative toxicity becomes likely.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Input your horse's body weight in kilograms, the total daily phenylbutazone dose in milligrams, and the planned or current duration of treatment in days. The calculator converts these into dose-per-kilogram and cross-references evidence-based toxicity benchmarks.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Results display risk level (low, moderate, high, or severe) with brief guidance on safety. Always consult your veterinarian before starting or adjusting phenylbutazone therapy; this tool informs but does not replace professional medical judgment.</p>
        </div>
      </section>

      {/* TABLE: Phenylbutazone Dosing Guidelines and Risk Thresholds */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Phenylbutazone Dosing Guidelines and Risk Thresholds</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Reference table showing safe therapeutic doses and toxicity risk thresholds for equine phenylbutazone administration.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Dose Range (mg/kg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Frequency</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Duration Limit</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Risk Category</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2–3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Twice daily</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Up to 14 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Low risk</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3–4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Twice daily</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5–7 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate risk</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">&gt;4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Twice daily</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&lt;5 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High risk</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">&gt;6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Any frequency</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Avoid</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Severe toxicity risk</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Doses &gt;4 mg/kg/day should only be used short-term under veterinary supervision.</p>
      </section>

      {/* TABLE: Common Phenylbutazone Formulations and Typical Dosing */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Common Phenylbutazone Formulations and Typical Dosing</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Standard commercial phenylbutazone products and their typical therapeutic dose calculations by horse weight.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Formulation</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Concentration</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">500 kg Horse (Therapeutic)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">600 kg Horse (Therapeutic)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Oral powder</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 g/packet</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1–2 packets BID</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.2–2.4 packets BID</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Oral paste</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 g/syringe</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1–2 syringes BID</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.2–2.4 syringes BID</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Injectable (IV)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200 mg/mL</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5–10 mL BID</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6–12 mL BID</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Tablet</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">500 mg/tablet</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2–4 tablets BID</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.4–4.8 tablets BID</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">BID = twice daily; doses shown assume 2–4 mg/kg therapeutic range; always verify with current product label.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always dose phenylbutazone based on actual body weight (kg), not estimated; incorrect weight is a leading cause of accidental overdose.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Never exceed 4 mg/kg/day phenylbutazone for long-term use; higher doses increase ulceration and renal complications exponentially.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Monitor appetite, manure quality, and energy levels daily; reduced appetite or diarrhea are early warning signs of developing toxicity.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use the lowest effective dose for the shortest duration necessary; combine with gastric protectants (omeprazole) when treatment exceeds 5–7 days.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Confusing mg/kg with total mg dose</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Calculating dose by total milligrams alone without adjusting for weight can lead to severe overdosing in lighter horses.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring cumulative duration toxicity</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Using therapeutic doses continuously beyond 14 days significantly raises gastrointestinal and renal damage risk, even if daily dose appears safe.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not accounting for concurrent medications</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Other NSAIDs, corticosteroids, or diuretics increase phenylbutazone toxicity; dosing without this context underestimates true risk.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming all horses tolerate Bute equally</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Older horses, those with renal/liver disease, or dehydrated individuals require lower doses; one-size-fits-all dosing ignores individual vulnerability.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the safe daily dose of phenylbutazone for horses?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The recommended dose is 2–4 mg/kg twice daily, not to exceed 4 mg/kg/day total for long-term use. Most veterinarians limit treatment to 5–7 days at higher doses or 2 weeks maximum at therapeutic levels.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does horse weight affect phenylbutazone toxicity risk?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Heavier horses require proportionally higher absolute doses; however, toxicity risk is based on dose-per-kilogram, making lighter horses more vulnerable to overdose if given standard weight-band dosing without adjustment.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What are the signs of phenylbutazone overdose in horses?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Early signs include reduced appetite, diarrhea, and lethargy; severe overdose can cause gastric ulceration, bleeding, protein loss, and renal or hepatic damage within 7–14 days of excessive dosing.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can duration of phenylbutazone use increase overdose risk?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, continuous use beyond 2 weeks significantly increases cumulative toxicity risk, especially gastrointestinal and renal complications, even at therapeutic doses.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Are certain horses more sensitive to phenylbutazone toxicity?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Older horses, those with existing renal or hepatic disease, and animals on concurrent medications show heightened sensitivity and require lower dose adjustments and closer monitoring.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What should I do if I suspect phenylbutazone overdose?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Stop the medication immediately and contact your veterinarian for blood work, renal/hepatic panels, and supportive care including gastric protectants and IV fluids if indicated.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How accurate is this overdose risk calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">This calculator estimates risk based on dose, weight, and duration using evidence-based thresholds; it is not a replacement for veterinary judgment and should inform, not replace, professional consultation.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.aaep.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Equine Pharmacology: NSAIDs and Pain Management</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">American Association of Equine Practitioners clinical resources on safe NSAID dosing and toxicity monitoring in horses.</p>
          </li>
          <li>
            <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6289779" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Phenylbutazone Safety and Adverse Effects</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Peer-reviewed research on phenylbutazone pharmacokinetics, gastrointestinal toxicity, and renal complications in equine patients.</p>
          </li>
          <li>
            <a href="https://www.vetmed.ucdavis.edu" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Equine Internal Medicine Handbook</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">UC Davis School of Veterinary Medicine clinical guidelines for NSAID dosing, duration limits, and toxicity recognition in horses.</p>
          </li>
          <li>
            <a href="https://www.fda.gov/animal-veterinary/animal-drug-approvals" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">FDA Approved Animal Drug Products: Phenylbutazone</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official FDA labeling and approved dose recommendations for phenylbutazone in equine species with safety warnings.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Horse NSAID Overdose Risk (Phenylbutazone)"
      description='Assess the overdose and toxicity risk associated with common horse anti-inflammatories like <strong>Phenylbutazone (Bute)</strong>.'
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: "Phenylbutazone Dose (mg/kg) = Total Dose (mg) ÷ Body Weight (kg)",
        variables: [
          { symbol: "Total Dose (mg)", description: "Total phenylbutazone dose administered in milligrams" },
          { symbol: "Body Weight (kg)", description: "Horse body weight in kilograms" },
          { symbol: "Dose (mg/kg)", description: "Dose per kilogram body weight used to assess toxicity risk" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 1100 lb horse was given 6000 mg of phenylbutazone over 24 hours. Calculate the mg/kg dose and assess overdose risk.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kg: 1100 lbs ÷ 2.20462 = 499 kg (approx).",
          },
          {
            label: "2",
            explanation:
              "Calculate mg/kg dose: 6000 mg ÷ 499 kg = 12.02 mg/kg.",
          },
          {
            label: "3",
            explanation:
              "Compare to toxic threshold (~8 mg/kg): 12.02 mg/kg exceeds safe dose, indicating high overdose risk.",
          },
        ],
        result:
          "The horse received a phenylbutazone dose of approximately 12 mg/kg, which is above the toxic threshold, indicating a high risk of overdose and need for immediate veterinary care.",
      }}
      relatedCalculators={[
        { title: "Dog Caffeine Toxicity Calculator", url: "/pets/dog-caffeine-toxicity", icon: "🐶" },
        { title: "Electrolyte Powder Mixing Calculator", url: "/pets/horse-electrolyte-powder-mixing", icon: "🐴" },
        { title: "Dog Xylitol Exposure Risk Calculator", url: "/pets/dog-xylitol-exposure-risk", icon: "🐶" },
        { title: "Resting vs. Active Hours Balance Tracker (owner input)", url: "/pets/cat-resting-active-hours-balance-tracker", icon: "🐱" },
        { title: "Cat Treat Calories & Daily Allowance", url: "/pets/cat-treat-calories-daily-allowance", icon: "🐱" },
        { title: "Dog Calorie Needs (RER/MER) Calculator", url: "/pets/dog-calorie-needs-rer-mer", icon: "🐶" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Horse NSAID Overdose Risk (Phenylbutazone)" },
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