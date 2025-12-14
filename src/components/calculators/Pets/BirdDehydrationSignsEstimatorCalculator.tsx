import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BirdDehydrationSignsEstimatorCalculator() {
  // 1. STATE
  // No unit switcher needed because inputs are % and clinical signs (numeric)
  // Inputs: Skin pinch time (seconds), Capillary refill time (seconds), Mucous membrane dryness (scale 0-3), Sunken eyes (scale 0-3)
  const [inputs, setInputs] = useState({
    skinPinchSec: "",
    capillaryRefillSec: "",
    mucousMembraneDryness: "",
    sunkenEyes: "",
  });

  // 2. LOGIC ENGINE
  // Formula: Hydration Score = Skin Pinch Time (sec) + Capillary Refill Time (sec) + Mucous Membrane Dryness Score + Sunken Eyes Score
  // Interpretation:
  // 0-2: Normal hydration
  // 3-5: Mild dehydration
  // 6-8: Moderate dehydration
  // 9+: Severe dehydration
  const results = useMemo(() => {
    const skinPinch = parseFloat(inputs.skinPinchSec);
    const capRefill = parseFloat(inputs.capillaryRefillSec);
    const mucousDry = parseInt(inputs.mucousMembraneDryness);
    const sunkenEye = parseInt(inputs.sunkenEyes);

    if (
      isNaN(skinPinch) ||
      isNaN(capRefill) ||
      isNaN(mucousDry) ||
      isNaN(sunkenEye) ||
      skinPinch < 0 ||
      capRefill < 0 ||
      mucousDry < 0 ||
      mucousDry > 3 ||
      sunkenEye < 0 ||
      sunkenEye > 3
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: "Please enter valid values within the specified ranges.",
      };
    }

    const hydrationScore = skinPinch + capRefill + mucousDry + sunkenEye;

    let label = "";
    let warning = null;

    if (hydrationScore <= 2) {
      label = "Normal Hydration";
    } else if (hydrationScore <= 5) {
      label = "Mild Dehydration";
      warning = "Monitor closely and provide fluids if possible.";
    } else if (hydrationScore <= 8) {
      label = "Moderate Dehydration";
      warning = "Seek veterinary care promptly.";
    } else {
      label = "Severe Dehydration";
      warning = "Emergency veterinary intervention required immediately.";
    }

    return {
      value: hydrationScore.toFixed(1),
      label,
      subtext: "Higher scores indicate more severe dehydration.",
      warning,
    };
  }, [inputs]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is skin pinch time important in assessing dehydration?",
      answer:
        "Skin pinch time measures the skin's elasticity and hydration status, which decreases with dehydration. When dehydrated, the skin loses turgor and takes longer to return to its normal position after being pinched. This delay helps veterinarians estimate the severity of fluid loss and guides treatment decisions.",
    },
    {
      question: "How does capillary refill time reflect hydration status?",
      answer:
        "Capillary refill time (CRT) assesses blood flow and peripheral perfusion, which can be compromised during dehydration. A prolonged CRT indicates poor circulation often caused by reduced blood volume. Monitoring CRT helps identify circulatory shock and the urgency of fluid therapy in birds.",
    },
    {
      question: "What does mucous membrane dryness indicate in birds?",
      answer:
        "Mucous membrane dryness reflects the moisture level of tissues inside the mouth and eyes, which decreases with dehydration. Dry or tacky membranes suggest fluid deficits affecting the bird's overall hydration. Evaluating this sign alongside others improves accuracy in dehydration assessment.",
    },
    {
      question: "Why are sunken eyes a sign of dehydration?",
      answer:
        "Sunken eyes occur when fluid loss causes the tissues around the eyes to shrink, making the eyes appear recessed. This physical change is a visible indicator of moderate to severe dehydration in birds. Recognizing this sign early can prompt timely veterinary intervention to prevent complications.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="skinPinchSec" className="text-slate-700 dark:text-slate-300">
            Skin Pinch Time (seconds)
          </Label>
          <Input
            id="skinPinchSec"
            type="number"
            min="0"
            step="0.1"
            placeholder="e.g. 1.5"
            value={inputs.skinPinchSec}
            onChange={(e) => setInputs((prev) => ({ ...prev, skinPinchSec: e.target.value }))}
          />
          <p className="text-xs text-slate-400 mt-1">Time for skin to return after pinch; normal ≤ 2 sec.</p>
        </div>

        <div>
          <Label htmlFor="capillaryRefillSec" className="text-slate-700 dark:text-slate-300">
            Capillary Refill Time (seconds)
          </Label>
          <Input
            id="capillaryRefillSec"
            type="number"
            min="0"
            step="0.1"
            placeholder="e.g. 1.0"
            value={inputs.capillaryRefillSec}
            onChange={(e) => setInputs((prev) => ({ ...prev, capillaryRefillSec: e.target.value }))}
          />
          <p className="text-xs text-slate-400 mt-1">Time for color to return after pressing gum; normal ≤ 2 sec.</p>
        </div>

        <div>
          <Label htmlFor="mucousMembraneDryness" className="text-slate-700 dark:text-slate-300">
            Mucous Membrane Dryness (0-3)
          </Label>
          <Input
            id="mucousMembraneDryness"
            type="number"
            min="0"
            max="3"
            step="1"
            placeholder="0 = moist, 3 = very dry"
            value={inputs.mucousMembraneDryness}
            onChange={(e) => setInputs((prev) => ({ ...prev, mucousMembraneDryness: e.target.value }))}
          />
          <p className="text-xs text-slate-400 mt-1">0 = moist, 1 = slightly dry, 2 = dry, 3 = very dry.</p>
        </div>

        <div>
          <Label htmlFor="sunkenEyes" className="text-slate-700 dark:text-slate-300">
            Sunken Eyes (0-3)
          </Label>
          <Input
            id="sunkenEyes"
            type="number"
            min="0"
            max="3"
            step="1"
            placeholder="0 = normal, 3 = severely sunken"
            value={inputs.sunkenEyes}
            onChange={(e) => setInputs((prev) => ({ ...prev, sunkenEyes: e.target.value }))}
          />
          <p className="text-xs text-slate-400 mt-1">0 = normal, 1 = mild, 2 = moderate, 3 = severe sunken eyes.</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {
            // Just trigger recalculation by updating state (already handled by useMemo)
            setInputs((prev) => ({ ...prev }));
          }}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              skinPinchSec: "",
              capillaryRefillSec: "",
              mucousMembraneDryness: "",
              sunkenEyes: "",
            })
          }
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
                Estimated Hydration Score
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
          Understanding Dehydration Signs Estimator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Dehydration in birds can be challenging to detect early because their signs are often subtle and easily overlooked. This estimator combines key clinical indicators such as skin pinch time, capillary refill time, mucous membrane dryness, and sunken eyes to provide a composite hydration score. Each parameter reflects a physiological change caused by fluid loss, helping caregivers and veterinarians assess the bird’s hydration status more accurately. Early identification of dehydration is critical to prevent serious complications and improve treatment outcomes.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Birds have a high metabolic rate and limited capacity to conserve water, making them particularly vulnerable to dehydration. The skin pinch test evaluates skin elasticity, which diminishes as fluid volume decreases. Capillary refill time assesses peripheral circulation, which slows with reduced blood volume. Mucous membrane dryness and sunken eyes are visible signs indicating fluid deficits affecting tissue hydration. By integrating these signs, this tool offers a practical and evidence-based approach to estimate dehydration severity in avian patients.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this dehydration signs estimator, carefully observe and measure the bird’s clinical signs as accurately as possible. Input the time in seconds for the skin pinch test and capillary refill test, then rate mucous membrane dryness and sunken eyes on a scale from 0 to 3. The calculator will then compute a hydration score that reflects the bird’s overall hydration status. This score helps guide decisions about fluid therapy urgency and the need for veterinary evaluation.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Perform the skin pinch test by gently pinching the skin and timing how long it takes to return to normal.
          </li>
          <li>
            <strong>Step 2:</strong> Measure capillary refill time by pressing the bird’s gum or mucous membrane and timing color return.
          </li>
          <li>
            <strong>Step 3:</strong> Assess mucous membrane dryness and sunken eyes visually, rating each from 0 (normal) to 3 (severe).
          </li>
          <li>
            <strong>Step 4:</strong> Enter all values into the calculator and press Calculate to receive the hydration score and interpretation.
          </li>
          <li>
            <strong>Step 5:</strong> Follow the guidance provided by the score, and seek veterinary care if moderate or severe dehydration is indicated.
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
              href="https://www.merckvetmanual.com/exotic-and-laboratory-animals/birds/dehydration-in-birds"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Merck Veterinary Manual: Dehydration in Birds
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive overview of dehydration signs, diagnosis, and treatment in avian species.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7151181/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Clinical Assessment of Dehydration in Birds - NCBI
            </a>
            <p className="text-slate-500 text-sm">
              Research article detailing clinical parameters and their relevance in assessing dehydration severity.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aav.org/page/avianemergency"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Association of Avian Veterinarians: Emergency Care Guidelines
            </a>
            <p className="text-slate-500 text-sm">
              Guidelines for recognizing and managing dehydration and shock in avian emergencies.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Dehydration Signs Estimator"
      description="Tool to help owners identify early signs of dehydration in birds, which can be subtle."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Hydration Score = Skin Pinch Time + Capillary Refill Time + Mucous Membrane Dryness + Sunken Eyes",
        variables: [
          { symbol: "Skin Pinch Time", description: "Seconds for skin to return after pinch" },
          { symbol: "Capillary Refill Time", description: "Seconds for gum color to return after pressure" },
          { symbol: "Mucous Membrane Dryness", description: "Score 0 (moist) to 3 (very dry)" },
          { symbol: "Sunken Eyes", description: "Score 0 (normal) to 3 (severely sunken)" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A parakeet presents with a skin pinch time of 2.5 seconds, capillary refill time of 2 seconds, mucous membrane dryness scored as 1, and sunken eyes scored as 2.",
        steps: [
          { label: "1", explanation: "Sum the values: 2.5 + 2 + 1 + 2 = 7.5" },
          { label: "2", explanation: "Interpret score: 7.5 indicates moderate dehydration." },
          { label: "3", explanation: "Recommend prompt veterinary care and fluid therapy." },
        ],
        result: "Hydration Score = 7.5 → Moderate Dehydration; urgent intervention advised.",
      }}
      relatedCalculators={[
        { title: "Ideal Humidity Range Calculator", url: "/pets/reptile-ideal-humidity-range", icon: "🐾" },
        { title: "Cat Chocolate Toxicity Calculator", url: "/pets/cat-chocolate-toxicity", icon: "🐱" },
        { title: "Benadryl (Diphenhydramine) Dose Calculator for Dogs", url: "/pets/dog-benadryl-diphenhydramine-dose", icon: "🐶" },
        { title: "Cat Calorie Needs (RER/MER) Calculator", url: "/pets/cat-calorie-needs-rer-mer", icon: "🐱" },
        { title: "Dog Harness Size & Fit Guide", url: "/pets/dog-harness-size-fit-guide", icon: "🐶" },
        { title: "Life Expectancy Estimator (lifestyle factors; educational)", url: "/pets/cat-life-expectancy-estimator", icon: "🐱" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Dehydration Signs Estimator" },
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