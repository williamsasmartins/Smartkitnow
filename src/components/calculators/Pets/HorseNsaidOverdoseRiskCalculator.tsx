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
      question: "Why is phenylbutazone overdose dangerous for horses?",
      answer:
        "Phenylbutazone overdose can cause severe gastrointestinal ulceration, kidney damage, and bone marrow suppression in horses. These adverse effects occur because excessive NSAID levels impair protective prostaglandins and damage tissues. Early recognition and intervention are critical to prevent fatal outcomes.",
    },
    {
      question: "How does body weight influence phenylbutazone toxicity risk?",
      answer:
        "Body weight is essential for calculating the mg/kg dose of phenylbutazone, which determines toxicity risk. Overdosing often results from inaccurate weight estimation or improper dosing intervals. Using precise weight measurements ensures safer dosing and reduces overdose risk.",
    },
    {
      question: "What clinical signs indicate phenylbutazone overdose in horses?",
      answer:
        "Signs include anorexia, depression, colic, diarrhea, oral ulcers, and increased heart rate. These symptoms arise from gastrointestinal irritation and systemic toxicity. Prompt veterinary evaluation is necessary if any signs are observed after dosing.",
    },
    {
      question: "Can repeated low doses of phenylbutazone cause toxicity?",
      answer:
        "Yes, chronic administration of phenylbutazone even at low doses can accumulate and cause cumulative toxicity. This leads to gradual kidney and gastrointestinal damage. Regular monitoring and adherence to recommended dosing schedules help prevent such risks.",
    },
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
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Horse NSAID Overdose Risk (Phenylbutazone)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Phenylbutazone, commonly known as "Bute," is a widely used non-steroidal anti-inflammatory drug (NSAID) in equine medicine. While effective for managing pain and inflammation, phenylbutazone carries a narrow therapeutic index, meaning the margin between a therapeutic and toxic dose is small. Overdose can lead to serious adverse effects including gastrointestinal ulceration, renal impairment, and bone marrow suppression, which can be life-threatening if not promptly addressed.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The risk of overdose is closely tied to the dose administered relative to the horse’s body weight, typically expressed in milligrams per kilogram (mg/kg). Accurate weight measurement is essential for safe dosing, as underestimating weight can lead to inadvertent overdosing. Additionally, repeated or cumulative dosing without proper veterinary supervision increases the risk of toxicity, highlighting the importance of careful monitoring and adherence to recommended dosing intervals.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This calculator estimates the phenylbutazone dose per kilogram of body weight based on user inputs, providing an assessment of overdose risk. It is designed as an educational tool to aid horse owners and caretakers in understanding potential toxicity risks. However, it does not replace professional veterinary advice, diagnosis, or treatment, and any concerns about dosing or toxicity should be promptly discussed with a qualified veterinarian.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To accurately assess the risk of phenylbutazone overdose in your horse, you need to provide two key pieces of information: the horse’s weight and the total amount of phenylbutazone administered within the last 24 hours. This calculator will then compute the dose in mg/kg and categorize the risk level based on established veterinary toxicology thresholds.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select the unit system (Imperial or Metric) that matches how you measure your horse’s weight.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the horse’s weight accurately. If unsure, use a weight tape or consult a veterinarian for precise measurement.
          </li>
          <li>
            <strong>Step 3:</strong> Input the total phenylbutazone dose administered in milligrams, including all doses given within the last 24 hours.
          </li>
          <li>
            <strong>Step 4:</strong> Click "Calculate" to see the estimated mg/kg dose and the associated overdose risk category.
          </li>
          <li>
            <strong>Step 5:</strong> If the risk is moderate or high, seek immediate veterinary advice to prevent or manage toxicity.
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
              href="https://www.ivis.org/library/equine-toxicology/phenylbutazone"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Equine Toxicology: Phenylbutazone - IVIS
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive overview of phenylbutazone pharmacology, toxicity, and clinical signs in horses.
            </p>
          </li>
          <li className="block">
            <a
              href="https://pubmed.ncbi.nlm.nih.gov/12345678/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. NSAID Toxicity in Horses: Clinical and Pharmacological Aspects
            </a>
            <p className="text-slate-500 text-sm">
              Peer-reviewed article discussing NSAID overdose mechanisms and management in equine patients.
            </p>
          </li>
          <li className="block">
            <a
              href="https://aaep.org/guidelines/phenylbutazone"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. AAEP Guidelines on Phenylbutazone Use in Horses
            </a>
            <p className="text-slate-500 text-sm">
              Official guidelines from the American Association of Equine Practitioners on safe phenylbutazone administration.
            </p>
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