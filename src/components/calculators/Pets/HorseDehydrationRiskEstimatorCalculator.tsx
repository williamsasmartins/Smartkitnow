import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function HorseDehydrationRiskEstimatorCalculator() {
  // 1. STATE
  // Unit system is imperial by default, but weight is not needed here.
  // Inputs: Skin Turgor Score (seconds), Mucous Membrane Capillary Refill Time (seconds)
  // Both are numeric inputs.

  const [inputs, setInputs] = useState({
    skinTurgorSeconds: "",
    mucousRefillSeconds: "",
  });

  // 2. LOGIC ENGINE
  // Dehydration risk scoring based on veterinary clinical signs:
  // Skin Turgor: Normal < 2 sec, Mild 2-4 sec, Moderate 4-6 sec, Severe >6 sec
  // Mucous Membrane Capillary Refill Time (CRT): Normal < 2 sec, Delayed > 2 sec
  // We assign points to each and sum for a risk score.
  // Risk Score = Skin Turgor Score + Mucous CRT Score
  // Skin Turgor Score: 0 (normal), 2 (mild), 4 (moderate), 6 (severe)
  // Mucous CRT Score: 0 (normal), 3 (delayed)
  // Total Risk Score max = 9
  // Interpretation:
  // 0-2: Low risk, 3-5: Moderate risk, 6-9: High risk dehydration

  const results = useMemo(() => {
    const st = parseFloat(inputs.skinTurgorSeconds);
    const muc = parseFloat(inputs.mucousRefillSeconds);

    if (isNaN(st) || isNaN(muc) || st < 0 || muc < 0) {
      return {
        value: 0,
        label: "Invalid input",
        subtext: "Please enter valid positive numbers for both inputs.",
        warning: null,
      };
    }

    // Skin Turgor Score
    let skinTurgorScore = 0;
    if (st < 2) skinTurgorScore = 0;
    else if (st >= 2 && st < 4) skinTurgorScore = 2;
    else if (st >= 4 && st < 6) skinTurgorScore = 4;
    else if (st >= 6) skinTurgorScore = 6;

    // Mucous Membrane CRT Score
    const mucousScore = muc <= 2 ? 0 : 3;

    const totalScore = skinTurgorScore + mucousScore;

    let label = "";
    let subtext = "";
    let warning = null;

    if (totalScore <= 2) {
      label = "Low Dehydration Risk";
      subtext = "Clinical signs suggest minimal dehydration. Monitor hydration status regularly.";
    } else if (totalScore <= 5) {
      label = "Moderate Dehydration Risk";
      subtext =
        "Signs indicate moderate dehydration. Consider fluid therapy and veterinary consultation.";
      warning =
        "Moderate dehydration can progress quickly; prompt intervention is advised.";
    } else {
      label = "High Dehydration Risk";
      subtext =
        "Severe clinical signs of dehydration detected. Immediate veterinary care is critical.";
      warning =
        "High risk dehydration is life-threatening and requires urgent medical attention.";
    }

    return {
      value: totalScore,
      label,
      subtext,
      warning,
    };
  }, [inputs]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why are skin turgor and mucous membrane checks important for dehydration assessment?",
      answer:
        "Skin turgor and mucous membrane assessments provide rapid, non-invasive indicators of hydration status in animals. Skin turgor reflects the elasticity of the skin, which decreases with fluid loss, while mucous membrane capillary refill time indicates circulatory efficiency affected by dehydration. Together, these signs help veterinarians estimate dehydration severity and guide treatment decisions effectively.",
    },
    {
      question: "How does delayed capillary refill time relate to dehydration severity?",
      answer:
        "Delayed capillary refill time (CRT) suggests poor peripheral perfusion, often caused by decreased blood volume due to dehydration. When the body loses fluids, blood circulation slows, prolonging the time for color to return to mucous membranes after pressure is applied. This delay is a critical clinical sign indicating moderate to severe dehydration requiring prompt intervention.",
    },
    {
      question: "Can this estimator replace professional veterinary diagnosis?",
      answer:
        "No, this estimator is designed as an educational and preliminary assessment tool to help identify dehydration risk based on observable clinical signs. It cannot replace comprehensive veterinary examination, diagnostics, or treatment plans. Always consult a qualified veterinarian for accurate diagnosis and appropriate care for your animal.",
    },
    {
      question: "How often should dehydration risk be assessed in at-risk animals?",
      answer:
        "Animals at risk of dehydration, such as those with illness, heat stress, or limited water access, should be assessed frequently—ideally multiple times daily. Regular monitoring of skin turgor and mucous membrane status allows early detection of fluid loss and timely intervention. Consistent assessment helps prevent progression to severe dehydration and associated complications.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="skinTurgorSeconds" className="text-slate-700 dark:text-slate-300">
            Skin Turgor Return Time (seconds)
          </Label>
          <Input
            id="skinTurgorSeconds"
            type="number"
            min="0"
            step="0.1"
            placeholder="e.g. 3.5"
            value={inputs.skinTurgorSeconds}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, skinTurgorSeconds: e.target.value }))
            }
            aria-describedby="skinTurgorHelp"
          />
          <p id="skinTurgorHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Time for skin to return to normal after pinch. Normal is under 2 seconds.
          </p>
        </div>

        <div>
          <Label htmlFor="mucousRefillSeconds" className="text-slate-700 dark:text-slate-300">
            Mucous Membrane Capillary Refill Time (seconds)
          </Label>
          <Input
            id="mucousRefillSeconds"
            type="number"
            min="0"
            step="0.1"
            placeholder="e.g. 2.5"
            value={inputs.mucousRefillSeconds}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, mucousRefillSeconds: e.target.value }))
            }
            aria-describedby="mucousRefillHelp"
          />
          <p id="mucousRefillHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Time for color to return after pressing gums. Normal is under 2 seconds.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just trigger recalculation by updating state (already done on input change)
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ skinTurgorSeconds: "", mucousRefillSeconds: "" })}
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
                Estimated Dehydration Risk Score
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
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Dehydration Risk Estimator (Skin Turgor + Mucous Check)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Dehydration is a critical condition in animals that can rapidly deteriorate health if not identified early. The skin turgor test measures the elasticity of the skin by timing how quickly it returns to normal after being pinched, reflecting fluid loss in the interstitial spaces. Meanwhile, the mucous membrane capillary refill time (CRT) assesses circulatory efficiency by measuring how fast color returns to the gums after pressure is applied, indicating blood volume and perfusion status.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Combining these two clinical signs provides a reliable, quick, and non-invasive method to estimate dehydration severity in veterinary practice. Skin turgor delays and prolonged CRT are hallmark signs of fluid deficits affecting both the skin and circulatory system. This estimator quantifies these observations into a risk score, helping caregivers and veterinarians prioritize treatment urgency and fluid therapy needs.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Understanding these parameters is essential for early intervention, as dehydration can lead to organ dysfunction, shock, and death if untreated. This tool supports clinical judgment by translating observable signs into actionable risk categories, promoting better outcomes through timely veterinary care and hydration management.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To accurately estimate dehydration risk using this tool, first perform the skin turgor test by gently pinching the animal’s skin and timing how long it takes to return to its original position. Next, assess the mucous membrane capillary refill time by pressing on the gums and measuring the seconds until color returns. Enter these times in seconds into the respective input fields below.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Measure skin turgor return time in seconds using a stopwatch or timer.
          </li>
          <li>
            <strong>Step 2:</strong> Measure mucous membrane capillary refill time in seconds by pressing the gums and timing color return.
          </li>
          <li>
            <strong>Step 3:</strong> Input both values into the calculator and click “Calculate” to receive the dehydration risk score and interpretation.
          </li>
          <li>
            <strong>Step 4:</strong> Use the risk category to guide urgency of veterinary consultation and fluid therapy decisions.
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
              href="https://www.merckvetmanual.com/emergency-medicine/fluid-therapy/dehydration"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Merck Veterinary Manual - Dehydration and Fluid Therapy
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive overview of dehydration assessment and fluid therapy protocols in veterinary medicine.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vetmed.ucdavis.edu/sites/g/files/dgvnsk5741/files/inline-files/Dehydration%20Assessment%20in%20Large%20Animals.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. UC Davis Veterinary Medicine - Dehydration Assessment in Large Animals
            </a>
            <p className="text-slate-500 text-sm">
              Detailed guide on clinical signs including skin turgor and mucous membrane evaluation for dehydration.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7151197/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. NCBI - Clinical Assessment of Dehydration in Veterinary Patients
            </a>
            <p className="text-slate-500 text-sm">
              Peer-reviewed article discussing clinical dehydration markers and their diagnostic value in veterinary practice.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Dehydration Risk Estimator (Skin Turgor + Mucous Check)"
      description="Assess dehydration risk using the skin pinch (turgor) test and capillary refill time (mucous checks)."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Dehydration Risk Score = Skin Turgor Score + Mucous Membrane CRT Score",
        variables: [
          { symbol: "Skin Turgor Score", description: "Points assigned based on skin turgor return time" },
          { symbol: "Mucous Membrane CRT Score", description: "Points assigned based on capillary refill time" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A horse presents with a skin turgor return time of 4.5 seconds and a mucous membrane capillary refill time of 3 seconds.",
        steps: [
          {
            label: "1",
            explanation:
              "Assign Skin Turgor Score: 4.5 seconds falls in moderate category, score = 4 points.",
          },
          {
            label: "2",
            explanation:
              "Assign Mucous Membrane CRT Score: 3 seconds is delayed, score = 3 points.",
          },
          {
            label: "3",
            explanation:
              "Calculate total risk score: 4 + 3 = 7 points indicating high dehydration risk.",
          },
        ],
        result:
          "The horse is at high risk of dehydration and requires immediate veterinary intervention and fluid therapy.",
      }}
      relatedCalculators={[
        {
          title: "Play Session Planner (Feather/Chase Time Targets)",
          url: "/pets/cat-play-session-planner",
          icon: "🐾",
        },
        {
          title: "Growth Curve by Species (Python, Bearded Dragon, Gecko)",
          url: "/pets/reptile-growth-curve-python-bearded-dragon-gecko",
          icon: "🐶",
        },
        {
          title: "Daily Calorie Needs by Body Weight",
          url: "/pets/bird-daily-calorie-needs-body-weight",
          icon: "🐱",
        },
        {
          title: "Dog Human-Medication Exposure Alert (Ibuprofen/Acetaminophen)",
          url: "/pets/dog-human-medication-exposure-alert",
          icon: "🐶",
        },
        {
          title: "Protein/Fat Intake Guide for Cats (by Goal)",
          url: "/pets/cat-protein-fat-intake-guide",
          icon: "🐱",
        },
        {
          title: "Dog Onion/Garlic (Allium) Exposure Risk Calculator",
          url: "/pets/dog-onion-garlic-exposure-risk",
          icon: "🐶",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Dehydration Risk Estimator (Skin Turgor + Mucous Check)" },
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