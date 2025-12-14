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

  // Inputs: Weight (lbs or kg), Total Phenylbutazone Dose Administered (mg)
  const [inputs, setInputs] = useState({
    weight: "",
    doseMg: "",
  });

  // 2. LOGIC ENGINE
  // Phenylbutazone toxic dose threshold ~8 mg/kg/day (varies by source)
  // Calculate mg/kg dose and risk level
  const results = useMemo(() => {
    const weightNum = parseFloat(inputs.weight);
    const doseMgNum = parseFloat(inputs.doseMg);

    if (
      isNaN(weightNum) ||
      weightNum <= 0 ||
      isNaN(doseMgNum) ||
      doseMgNum <= 0
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
    const doseMgPerKg = doseMgNum / weightKg;

    // Risk assessment based on dose
    // <4 mg/kg/day = Low risk
    // 4-8 mg/kg/day = Moderate risk
    // >8 mg/kg/day = High risk (potential overdose)
    let riskLabel = "";
    let warning = null;

    if (doseMgPerKg < 4) {
      riskLabel = "Low overdose risk. Dose is within safe therapeutic range.";
    } else if (doseMgPerKg >= 4 && doseMgPerKg <= 8) {
      riskLabel =
        "Moderate overdose risk. Monitor horse closely for adverse effects.";
      warning =
        "Phenylbutazone doses approaching 8 mg/kg/day increase risk of toxicity. Consult your veterinarian immediately if adverse signs appear.";
    } else {
      riskLabel =
        "High overdose risk! Dose exceeds safe limits and may cause severe toxicity.";
      warning =
        "Immediate veterinary intervention is recommended. Phenylbutazone overdose can cause serious gastrointestinal and renal damage.";
    }

    return {
      value: doseMgPerKg.toFixed(2) + " mg/kg",
      label: riskLabel,
      subtext: `Calculated dose based on weight (${weightKg.toFixed(1)} kg) and total administered dose.`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is phenylbutazone overdose dangerous for horses?",
      answer:
        "Phenylbutazone overdose is dangerous because it can cause severe gastrointestinal ulceration, kidney damage, and bone marrow suppression in horses. These adverse effects occur due to the drug’s narrow therapeutic index and its impact on prostaglandin synthesis, which protects the stomach lining and renal blood flow. Early recognition and dose adjustment are critical to prevent life-threatening complications.",
    },
    {
      question: "How does body weight affect phenylbutazone dosing in horses?",
      answer:
        "Body weight directly influences the appropriate phenylbutazone dose since dosing is calculated on a mg/kg basis to ensure safety and efficacy. Overestimating or underestimating weight can lead to underdosing, reducing therapeutic benefit, or overdosing, increasing toxicity risk. Accurate weight measurement is essential for precise dosing and minimizing overdose risk.",
    },
    {
      question: "What clinical signs indicate phenylbutazone toxicity in horses?",
      answer:
        "Clinical signs of phenylbutazone toxicity include anorexia, depression, colic, diarrhea, oral ulcers, and excessive thirst or urination. These symptoms reflect gastrointestinal irritation, renal impairment, and systemic toxicity. Prompt veterinary evaluation is necessary if these signs develop after phenylbutazone administration to mitigate damage.",
    },
    {
      question: "Can phenylbutazone overdose effects be reversed or treated?",
      answer:
        "Treatment of phenylbutazone overdose focuses on supportive care, including intravenous fluids to protect kidney function and medications to reduce gastrointestinal ulceration. While some effects can be managed if caught early, severe overdose may cause irreversible damage. Therefore, prevention through accurate dosing and monitoring is paramount.",
    },
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

  // 5. WIDGET JSX
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
            placeholder={unit === "imperial" ? "e.g. 1100" : "e.g. 500"}
            value={inputs.weight}
            onChange={handleInputChange}
            inputMode="decimal"
            aria-describedby="weight-desc"
          />
          <p id="weight-desc" className="text-xs text-slate-400 mt-1">
            Enter the horse's current body weight.
          </p>
        </div>

        <div>
          <Label htmlFor="doseMg" className="text-slate-700 dark:text-slate-300">
            Total Phenylbutazone Dose Administered (mg)
          </Label>
          <Input
            id="doseMg"
            name="doseMg"
            type="text"
            placeholder="e.g. 4000"
            value={inputs.doseMg}
            onChange={handleInputChange}
            inputMode="decimal"
            aria-describedby="dose-desc"
          />
          <p id="dose-desc" className="text-xs text-slate-400 mt-1">
            Enter the total amount of phenylbutazone given in milligrams.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just trigger recalculation by updating inputs state (no-op here)
            setInputs((prev) => ({ ...prev }));
          }}
          aria-label="Calculate overdose risk"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", doseMg: "" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" role="region" aria-live="polite">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Estimated Phenylbutazone Dose
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">{results.label}</p>
              {results.subtext && (
                <p className="text-sm text-slate-500 mt-2">{results.subtext}</p>
              )}
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
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a veterinarian for diagnosis and treatment recommendations.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  // 6. EDITORIAL CONTENT
  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Horse NSAID Overdose Risk (Phenylbutazone)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Phenylbutazone, commonly known as "Bute," is a widely used non-steroidal anti-inflammatory drug (NSAID) in equine medicine. It effectively reduces pain and inflammation associated with musculoskeletal disorders, colic, and other conditions. However, its therapeutic window is narrow, meaning the difference between an effective dose and a toxic dose is small, making overdose a significant concern in horses.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Overdosing phenylbutazone can lead to severe adverse effects such as gastrointestinal ulceration, renal toxicity, and bone marrow suppression. These complications arise because phenylbutazone inhibits prostaglandin synthesis, which normally protects the stomach lining and maintains kidney blood flow. Therefore, careful dosing based on accurate body weight and clinical monitoring is essential to minimize overdose risk and ensure horse safety.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This calculator estimates the phenylbutazone dose per kilogram of body weight based on the total administered dose and the horse's weight. By comparing the calculated dose to established toxicity thresholds, it provides an assessment of overdose risk. This tool is intended to support veterinary decision-making and promote safe NSAID use in equine patients.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this calculator, enter the horse's current body weight and the total amount of phenylbutazone administered in milligrams. Select the appropriate unit system (Imperial or Metric) for weight input. After entering valid values, click "Calculate" to see the estimated dose per kilogram and the associated overdose risk level.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Measure or obtain the horse's accurate body weight in pounds or kilograms.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the total phenylbutazone dose given to the horse in milligrams.
          </li>
          <li>
            <strong>Step 3:</strong> Click "Calculate" to receive the mg/kg dose and risk assessment.
          </li>
          <li>
            <strong>Step 4:</strong> Review the results carefully and consult a veterinarian if the dose approaches or exceeds toxic thresholds.
          </li>
        </ul>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Frequently Asked Questions
        </h2>
        <ul className="space-y-6">
          {faqs.map((item, i) => (
            <li
              key={i}
              className="border-b border-slate-200 dark:border-slate-800 pb-4 last:border-0"
            >
              <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-2">
                {item.question}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.answer}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Veterinary References
        </h2>
        <ul className="space-y-4">
          <li className="block">
            <a
              href="https://www.merckvetmanual.com/pharmacology/nonsteroidal-anti-inflammatory-drugs-nsaids/phenylbutazone"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Merck Veterinary Manual: Phenylbutazone
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive overview of phenylbutazone pharmacology, dosing, and toxicity in horses.
            </p>
          </li>
          <li className="block">
            <a
              href="https://pubmed.ncbi.nlm.nih.gov/14686891/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Equine Veterinary Journal: NSAID Toxicity in Horses
            </a>
            <p className="text-slate-500 text-sm">
              Peer-reviewed article discussing clinical signs and management of NSAID overdose in equine patients.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ivis.org/library/equine-therapeutics/phenylbutazone"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. IVIS: Phenylbutazone Use and Safety
            </a>
            <p className="text-slate-500 text-sm">
              Detailed veterinary resource on phenylbutazone dosing guidelines and adverse effects.
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
        formula: "Dose (mg/kg) = Total Phenylbutazone Dose (mg) ÷ Horse Weight (kg)",
        variables: [
          { symbol: "Dose (mg/kg)", description: "Phenylbutazone dose per kilogram of body weight" },
          { symbol: "Total Phenylbutazone Dose (mg)", description: "Total amount of phenylbutazone administered in milligrams" },
          { symbol: "Horse Weight (kg)", description: "Horse body weight in kilograms" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 1100 lb horse was administered 4000 mg of phenylbutazone in one day. The owner wants to know if this dose is safe or poses an overdose risk.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kilograms: 1100 lb ÷ 2.20462 = 499 kg (approx).",
          },
          {
            label: "2",
            explanation:
              "Calculate mg/kg dose: 4000 mg ÷ 499 kg = 8.02 mg/kg.",
          },
          {
            label: "3",
            explanation:
              "Compare to toxicity threshold: 8.02 mg/kg exceeds the 8 mg/kg/day limit, indicating high overdose risk.",
          },
        ],
        result:
          "The horse is at high risk of phenylbutazone toxicity and requires immediate veterinary evaluation.",
      }}
      relatedCalculators={[
        { title: "Koi Feed Planner (Temp + Weight)", url: "/pets/koi-feed-planner-temp-weight", icon: "🐾" },
        { title: "Daily Calorie Needs by Body Weight", url: "/pets/bird-daily-calorie-needs-body-weight", icon: "🐶" },
        { title: "Dehydration Risk Estimator (Skin Turgor + Mucous Check)", url: "/pets/horse-dehydration-risk-estimator", icon: "🐱" },
        { title: "Horse Body Condition Score Helper (Henneke 1–9)", url: "/pets/horse-body-condition-score-henneke", icon: "🐎" },
        { title: "Whelping Countdown & Stage Timeline", url: "/pets/dog-whelping-countdown-stage-timeline", icon: "💉" },
        { title: "Indoor/Outdoor Activity Calorie Adjuster", url: "/pets/cat-activity-calorie-adjuster", icon: "💧" },
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