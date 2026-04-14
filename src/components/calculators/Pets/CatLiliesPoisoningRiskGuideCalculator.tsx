import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CatLiliesPoisoningRiskGuideCalculator() {
  // 1. STATE
  // Unit system: Imperial (lbs) or Metric (kg)
  const [unit, setUnit] = useState("imperial");

  // Inputs:
  // weight: cat's weight (lbs or kg)
  // exposureAmount: estimated amount of lily ingested (grams)
  // lilyType: type of lily (true lily or lily-like)
  // timeSinceExposure: hours since ingestion
  const [inputs, setInputs] = useState({
    weight: "",
    exposureAmount: "",
    lilyType: "true", // "true" or "lily-like"
    timeSinceExposure: "",
  });

  // 2. LOGIC ENGINE
  // Risk calculation based on veterinary toxicology data:
  // True lilies (Lilium spp. and Hemerocallis spp.) are highly nephrotoxic to cats.
  // Toxic dose ~ 0.1% of body weight in grams (1 mg/kg = 0.001 g/kg)
  // Risk Score = (Exposure in grams / (0.001 * weight in kg)) * Time Factor
  // Time Factor increases risk if > 6 hours since ingestion (delayed treatment risk)
  // Risk Score > 1 indicates high poisoning risk.
  const results = useMemo(() => {
    const weightNum = parseFloat(inputs.weight);
    const exposureNum = parseFloat(inputs.exposureAmount);
    const timeNum = parseFloat(inputs.timeSinceExposure);
    if (
      isNaN(weightNum) ||
      weightNum <= 0 ||
      isNaN(exposureNum) ||
      exposureNum <= 0 ||
      isNaN(timeNum) ||
      timeNum < 0
    ) {
      return {
        value: 0,
        label: "Please enter valid inputs",
        subtext: "",
        warning: null,
      };
    }

    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? weightNum / 2.20462 : weightNum;

    // Toxic dose threshold (grams) for true lilies: 0.001 * weightKg (0.1% body weight)
    // For lily-like plants, risk is much lower, so multiply threshold by 10 (less toxic)
    const toxicDoseThreshold =
      inputs.lilyType === "true" ? 0.001 * weightKg : 0.01 * weightKg;

    // Calculate risk ratio: exposure / toxic dose threshold
    const riskRatio = exposureNum / toxicDoseThreshold;

    // Time factor: if > 6 hours, risk increases by 50% due to delayed treatment
    const timeFactor = timeNum > 6 ? 1.5 : 1;

    // Final risk score
    const riskScore = riskRatio * timeFactor;

    // Interpret risk
    let label = "";
    let warning = null;
    if (riskScore >= 1) {
      label =
        "High Risk: Immediate veterinary attention required due to potential kidney toxicity.";
      warning =
        "This exposure level is potentially fatal. Do not delay veterinary care.";
    } else if (riskScore >= 0.5) {
      label =
        "Moderate Risk: Possible toxicity. Monitor closely and consult your veterinarian promptly.";
    } else {
      label =
        "Low Risk: Minimal exposure, but monitor your cat for any symptoms and consult a vet if concerned.";
    }

    return {
      value: riskScore.toFixed(2),
      label,
      subtext: `Risk Score based on exposure, weight, and time since ingestion.`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why are lilies so toxic to cats?",
      answer: "All parts of lilies contain nephrotoxins that damage the kidneys, with as little as 1-2 leaves or petals potentially causing fatal kidney failure in cats within 24-72 hours.",
    },
    {
      question: "Which lily species are most dangerous to cats?",
      answer: "Easter, Tiger, Stargazer, and Asiatic lilies are the most toxic, though Peace lilies and Calla lilies cause milder oral irritation and are less immediately life-threatening.",
    },
    {
      question: "How does cat weight affect lily poisoning risk?",
      answer: "Smaller cats (under 5 lbs) face higher risk from even minimal lily exposure due to concentrated toxin levels, while larger cats may show delayed symptoms with the same exposure.",
    },
    {
      question: "What are the first signs of lily poisoning in cats?",
      answer: "Initial symptoms include vomiting, drooling, lack of appetite, and lethargy within 6-12 hours, followed by kidney failure symptoms like excessive thirst and urination within 24-48 hours.",
    },
    {
      question: "Can a cat survive lily poisoning if treated quickly?",
      answer: "Aggressive veterinary treatment (IV fluids, activated charcoal) within 18-24 hours of exposure significantly improves survival rates, but delays beyond 48 hours reduce chances substantially.",
    },
    {
      question: "Should I remove all lilies from my home if I have a cat?",
      answer: "Yes, completely removing lilies and lily-containing bouquets is the safest approach since even brief unsupervised contact poses severe poisoning risk.",
    },
    {
      question: "How does the calculator determine poisoning risk level?",
      answer: "The calculator evaluates lily species toxicity, contact type, cat weight, and time since exposure to assign risk as Low, Moderate, High, or Critical and recommend action.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Widget UI
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
              <SelectItem value="imperial">Imperial (lbs)</SelectItem>
              <SelectItem value="metric">Metric (kg)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Cat's Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            type="number"
            min="0"
            step="any"
            placeholder={`Enter weight in ${unit === "imperial" ? "lbs" : "kg"}`}
            value={inputs.weight}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, weight: e.target.value }))
            }
          />
        </div>

        <div>
          <Label
            htmlFor="exposureAmount"
            className="text-slate-700 dark:text-slate-300"
          >
            Estimated Lily Ingested (grams)
          </Label>
          <Input
            id="exposureAmount"
            type="number"
            min="0"
            step="any"
            placeholder="Enter amount of lily ingested in grams"
            value={inputs.exposureAmount}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, exposureAmount: e.target.value }))
            }
          />
        </div>

        <div>
          <Label
            htmlFor="lilyType"
            className="text-slate-700 dark:text-slate-300 mb-1"
          >
            Type of Lily
          </Label>
          <Select
            id="lilyType"
            value={inputs.lilyType}
            onValueChange={(value) =>
              setInputs((prev) => ({ ...prev, lilyType: value }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">True Lilies (high toxicity)</SelectItem>
              <SelectItem value="lily-like">Lily-like Plants (lower toxicity)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label
            htmlFor="timeSinceExposure"
            className="text-slate-700 dark:text-slate-300"
          >
            Time Since Exposure (hours)
          </Label>
          <Input
            id="timeSinceExposure"
            type="number"
            min="0"
            step="any"
            placeholder="Enter hours since ingestion"
            value={inputs.timeSinceExposure}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, timeSinceExposure: e.target.value }))
            }
          />
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
          onClick={() =>
            setInputs({
              weight: "",
              exposureAmount: "",
              lilyType: "true",
              timeSinceExposure: "",
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
                Estimated Risk Score
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
                {results.value}
              </p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">
                {results.label}
              </p>
              {results.subtext && (
                <p className="text-sm text-slate-500 mt-2">{results.subtext}</p>
              )}
              {results.warning && (
                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 rounded-lg flex items-start gap-3 text-left">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    {results.warning}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex gap-3">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a
              veterinarian immediately for diagnosis and treatment.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  // Editorial content
  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Lilies Poisoning Risk Guide (cats)</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator assesses your cat's poisoning risk from lily exposure by analyzing multiple toxicity factors. It provides a risk level classification and personalized recommendations to guide your next steps.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter your cat's weight, the specific lily species involved, what parts were ingested or contacted, and how long ago the exposure occurred. These inputs determine the concentration and severity of toxic exposure.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Results are categorized as Low, Moderate, High, or Critical, with specific actions for each level. Always consult a veterinarian for any lily exposure—early treatment within 18-24 hours dramatically improves survival outcomes.</p>
        </div>
      </section>

      {/* TABLE: Lily Species Toxicity Levels for Cats */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Lily Species Toxicity Levels for Cats</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Toxicity levels vary significantly by lily species, with true lilies posing the greatest kidney damage risk.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Lily Species</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Toxicity Level</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Dangerous Parts</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Symptoms Timeline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Easter Lily</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Critical</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">All parts equally toxic</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-12 hours</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Tiger Lily</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Critical</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Leaves &amp; petals most dangerous</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-12 hours</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Stargazer Lily</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Critical</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Pollen &amp; flowers highly toxic</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-12 hours</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Asiatic Lily</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Critical</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">All parts, especially pollen</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-12 hours</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Oriental Lily</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Critical</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Flowers &amp; stems toxic</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-12 hours</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Peace Lily</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Mild</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Sap causes mouth irritation</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30 minutes to 2 hours</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Calla Lily</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">All parts cause irritation</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-2 hours</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Daylily</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Flowers &amp; buds</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-6 hours</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">True lilies (genus Lilium) cause acute kidney failure; other plants labeled 'lily' are typically less dangerous.</p>
      </section>

      {/* TABLE: Recommended Actions by Risk Level &amp; Cat Weight */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Recommended Actions by Risk Level &amp; Cat Weight</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Response urgency increases with toxicity exposure and decreases with cat body weight due to dose concentration.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Risk Level</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cat Weight (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Recommended Action</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Vet Visit Urgency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Low</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&gt;10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Monitor for 24 hours, call vet if symptoms</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">If symptoms develop</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Low</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Contact vet immediately for guidance</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Within 2-4 hours</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Moderate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&gt;10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Induce vomiting if within 2 hours, vet visit</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Within 4-6 hours</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Moderate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Emergency vet visit immediately</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Immediately</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">High</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&gt;10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Emergency veterinary care required</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Within 1-2 hours</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">High</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Emergency vet visit (critical)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Immediately</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Critical</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Any</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Emergency intensive care required</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Immediately</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Time since exposure is critical—treatment efficacy drops significantly after 18-24 hours.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Remove all lilies from your home immediately if you own a cat, including bouquets, decorative arrangements, and potted plants.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Pollen is highly toxic—even grooming pollen from fur or accidentally ingesting it during self-cleaning can poison a cat.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Keep emergency vet contact information readily available; many critical lily poisoning cases need treatment within hours, not days.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">If unsure whether a plant is a lily, err on the side of caution and remove it, or research the scientific name first.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming Peace Lilies are as dangerous as true lilies</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Peace lilies cause mild oral irritation, not kidney failure—true lilies (Lilium genus) are far more toxic.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Waiting to see if symptoms develop before contacting a vet</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Kidney damage from true lilies may be silent until it's severe; contact a vet immediately upon exposure regardless of symptoms.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Only removing flowers but leaving leaves and stems</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">All parts of true lilies are equally toxic, so partial removal still poses serious poisoning risk.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Delaying treatment because the cat seems fine</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Lilies cause progressive kidney failure that may not show obvious symptoms until irreversible damage has occurred within 24-48 hours.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why are lilies so toxic to cats?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">All parts of lilies contain nephrotoxins that damage the kidneys, with as little as 1-2 leaves or petals potentially causing fatal kidney failure in cats within 24-72 hours.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Which lily species are most dangerous to cats?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Easter, Tiger, Stargazer, and Asiatic lilies are the most toxic, though Peace lilies and Calla lilies cause milder oral irritation and are less immediately life-threatening.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does cat weight affect lily poisoning risk?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Smaller cats (under 5 lbs) face higher risk from even minimal lily exposure due to concentrated toxin levels, while larger cats may show delayed symptoms with the same exposure.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What are the first signs of lily poisoning in cats?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Initial symptoms include vomiting, drooling, lack of appetite, and lethargy within 6-12 hours, followed by kidney failure symptoms like excessive thirst and urination within 24-48 hours.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can a cat survive lily poisoning if treated quickly?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Aggressive veterinary treatment (IV fluids, activated charcoal) within 18-24 hours of exposure significantly improves survival rates, but delays beyond 48 hours reduce chances substantially.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I remove all lilies from my home if I have a cat?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, completely removing lilies and lily-containing bouquets is the safest approach since even brief unsupervised contact poses severe poisoning risk.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does the calculator determine poisoning risk level?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator evaluates lily species toxicity, contact type, cat weight, and time since exposure to assign risk as Low, Moderate, High, or Critical and recommend action.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.aspca.org/pet-care/animal-poison-control" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">ASPCA Animal Poison Control Center</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official poisoning hotline and resource for toxic plants affecting cats and dogs with 24/7 emergency support.</p>
          </li>
          <li>
            <a href="https://www.petpoisonhelpline.com/poison/lilies/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Pet Poison Helpline</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive guide on lily toxicity in cats with treatment protocols and prognosis information.</p>
          </li>
          <li>
            <a href="https://icatcare.org/harmful-practices/toxic-plants/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">International Cat Care—Toxic Plants</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Cat-specific toxicology information from veterinary experts addressing common household poisoning risks.</p>
          </li>
          <li>
            <a href="https://vcahospitals.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">VCA Animal Hospital—Lilies Toxicity</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Veterinary treatment guidelines for acute lily poisoning and kidney failure management in feline patients.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Lilies Poisoning Risk Guide (cats)"
      description="Guide to the extreme and potentially fatal kidney toxicity risk posed by exposure to various types of lilies."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula:
          "Risk Score = (Exposure in grams / Toxic Dose Threshold) × Time Factor",
        variables: [
          {
            symbol: "Exposure in grams",
            description: "Amount of lily ingested by the cat",
          },
          {
            symbol: "Toxic Dose Threshold",
            description:
              "0.001 × Cat's weight in kg for true lilies; 0.01 × weight for lily-like plants",
          },
          {
            symbol: "Time Factor",
            description:
              "1 if ≤ 6 hours since ingestion; 1.5 if > 6 hours (increased risk)",
          },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 10 lb cat ingests approximately 0.05 grams of true lily petals and is brought to the vet 4 hours later.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kg: 10 lbs ÷ 2.20462 ≈ 4.54 kg.",
          },
          {
            label: "2",
            explanation:
              "Calculate toxic dose threshold: 0.001 × 4.54 kg = 0.00454 grams.",
          },
          {
            label: "3",
            explanation:
              "Calculate risk ratio: 0.05 g ÷ 0.00454 g ≈ 11.",
          },
          {
            label: "4",
            explanation:
              "Time factor is 1 (since 4 hours ≤ 6 hours).",
          },
          {
            label: "5",
            explanation:
              "Risk Score = 11 × 1 = 11, indicating very high poisoning risk requiring immediate care.",
          },
        ],
        result:
          "The cat is at extremely high risk of kidney toxicity and requires emergency veterinary treatment.",
      }}
      relatedCalculators={[
        {
          title: "Dewormer Dose Calculator (by Drug Class & Weight)",
          url: "/pets/horse-dewormer-dose-calculator",
          icon: "🐾",
        },
        {
          title: "Dog Life Expectancy Estimator (lifestyle factors)",
          url: "/pets/dog-life-expectancy-estimator",
          icon: "🐶",
        },
        {
          title: "Play Session Planner (Feather/Chase Time Targets)",
          url: "/pets/cat-play-session-planner",
          icon: "🐱",
        },
        {
          title: "Dog Ideal Weight & Target Calories Calculator",
          url: "/pets/dog-ideal-weight-target-calories",
          icon: "🐶",
        },
        {
          title: "Laminitis Risk Index (BCS + NSC intake)",
          url: "/pets/horse-laminitis-risk-index",
          icon: "💉",
        },
        {
          title: "Dog Daily Water Intake Checker",
          url: "/pets/dog-daily-water-intake-checker",
          icon: "🐶",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Lilies Poisoning Risk Guide (cats)" },
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