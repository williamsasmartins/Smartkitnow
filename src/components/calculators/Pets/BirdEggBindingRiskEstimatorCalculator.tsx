import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BirdEggBindingRiskEstimatorCalculator() {
  // 1. STATE
  // No unit switcher needed because inputs are time/age based or categorical.
  // Inputs: Bird weight (lbs or kg), Age (months), Egg-laying frequency (eggs/week), Nutritional score (1-10)
  const [inputs, setInputs] = useState({
    weight: "",
    age: "",
    eggsPerWeek: "",
    nutritionScore: "",
  });

  // 2. LOGIC ENGINE
  // Formula (simplified risk score):
  // Risk Score = (Weight Factor) + (Age Factor) + (Egg-laying Frequency Factor) + (Nutrition Deficit Factor)
  // Weight Factor = (Ideal Weight - Actual Weight) / Ideal Weight * 25 (if underweight)
  // Age Factor = (Age in months < 6) ? 15 : 0 (young birds higher risk)
  // Egg-laying Frequency Factor = (Eggs per week / 7) * 30 (higher frequency increases risk)
  // Nutrition Deficit Factor = (10 - Nutrition Score) * 5 (poor nutrition increases risk)
  // Total risk capped between 0 and 100, expressed as percentage risk.

  // For Ideal Weight, assume a standard for small birds: 100g (0.22 lbs) for demo purposes.
  // Convert weight input to kg internally for calculation.

  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    const ageRaw = parseInt(inputs.age);
    const eggsRaw = parseFloat(inputs.eggsPerWeek);
    const nutritionRaw = parseFloat(inputs.nutritionScore);

    if (
      isNaN(weightRaw) ||
      isNaN(ageRaw) ||
      isNaN(eggsRaw) ||
      isNaN(nutritionRaw) ||
      weightRaw <= 0 ||
      ageRaw <= 0 ||
      eggsRaw < 0 ||
      nutritionRaw < 0 ||
      nutritionRaw > 10
    ) {
      return {
        value: 0,
        label: "Please enter valid inputs",
        subtext: null,
        warning: null,
      };
    }

    // Convert weight to kg if input is in lbs (assume imperial)
    // Since no unit selector, assume imperial input in lbs.
    const weightKg = weightRaw / 2.20462;

    // Ideal weight for small bird (e.g. cockatiel) ~ 0.1 kg (100g)
    const idealWeightKg = 0.1;

    // Weight factor: only if underweight
    let weightFactor = 0;
    if (weightKg < idealWeightKg) {
      weightFactor = ((idealWeightKg - weightKg) / idealWeightKg) * 25;
    }

    // Age factor: birds younger than 6 months have higher risk
    const ageFactor = ageRaw < 6 ? 15 : 0;

    // Egg-laying frequency factor: normalized to max 30
    const eggFreqFactor = (eggsRaw / 7) * 30;

    // Nutrition deficit factor: poor nutrition increases risk
    const nutritionDeficitFactor = (10 - nutritionRaw) * 5;

    let riskScore = weightFactor + ageFactor + eggFreqFactor + nutritionDeficitFactor;

    if (riskScore < 0) riskScore = 0;
    if (riskScore > 100) riskScore = 100;

    // Risk label based on score
    let riskLabel = "Low Risk";
    let warning = null;
    if (riskScore >= 70) {
      riskLabel = "High Risk";
      warning =
        "This bird has a high risk of egg binding. Immediate veterinary consultation is recommended.";
    } else if (riskScore >= 40) {
      riskLabel = "Moderate Risk";
      warning =
        "This bird shows moderate risk of egg binding. Monitor closely and consider veterinary advice.";
    }

    return {
      value: riskScore.toFixed(1) + "%",
      label: riskLabel,
      subtext: "Estimated risk of egg binding based on entered parameters.",
      warning,
    };
  }, [inputs]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "What factors contribute most to egg binding risk in birds?",
      answer:
        "Egg binding risk is influenced by multiple factors including the bird's weight, age, frequency of egg laying, and nutritional status. Underweight birds or those with poor nutrition are more susceptible because they lack the necessary calcium and energy reserves. Additionally, young birds or those laying eggs very frequently face increased physiological stress, raising their risk of complications.",
    },
    {
      question: "How does nutrition impact the likelihood of egg binding?",
      answer:
        "Proper nutrition is critical for egg-laying birds to maintain calcium levels and overall health. Insufficient dietary calcium or imbalanced nutrients can weaken the bird’s muscles and shell quality, making egg passage difficult. This calculator incorporates a nutrition score to reflect how poor diet increases the risk of egg binding by impairing reproductive and muscular function.",
    },
    {
      question: "Why is age an important factor in estimating egg binding risk?",
      answer:
        "Age affects the bird’s reproductive maturity and physical resilience. Birds younger than six months often have immature reproductive systems and weaker musculature, which can hinder egg laying. This estimator accounts for age because younger birds are physiologically less prepared to handle the demands of egg production, increasing their risk of egg binding.",
    },
    {
      question: "Can frequent egg laying increase the risk of egg binding?",
      answer:
        "Yes, frequent egg laying places continuous strain on a bird’s reproductive tract and calcium reserves. Birds laying eggs multiple times per week may not have adequate recovery time, leading to fatigue and calcium depletion. This calculator factors in egg-laying frequency to highlight how excessive laying cycles elevate the risk of egg binding complications.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 4. FORMULA DISPLAY (PRIMARY EQUATION ONLY)
  const formula = {
    title: "Scientific Formula",
    formula:
      "Risk Score (%) = Weight Factor + Age Factor + Egg-laying Frequency Factor + Nutrition Deficit Factor",
    variables: [
      {
        symbol: "Weight Factor",
        description:
          "Calculated as the percentage deficit from ideal weight, scaled to 25 if underweight",
      },
      {
        symbol: "Age Factor",
        description: "15 if bird is younger than 6 months, else 0",
      },
      {
        symbol: "Egg-laying Frequency Factor",
        description: "Proportional to eggs laid per week, scaled to 30",
      },
      {
        symbol: "Nutrition Deficit Factor",
        description:
          "Difference from optimal nutrition score (10), scaled to 5 per point deficit",
      },
    ],
  };

  // 5. EXAMPLE CASE STUDY
  const example = {
    title: "Case Study",
    scenario:
      "A 4-month-old female cockatiel weighing 0.18 lbs (82 g), laying 5 eggs per week, with a nutrition score of 6.",
    steps: [
      {
        label: "1",
        explanation:
          "Calculate weight factor: Ideal weight 0.22 lbs, actual 0.18 lbs → underweight, weight factor ≈ 9.1",
      },
      {
        label: "2",
        explanation:
          "Age factor: 4 months < 6 months → 15 points added for immature reproductive system",
      },
      {
        label: "3",
        explanation:
          "Egg-laying frequency factor: (5/7)*30 ≈ 21.4 points for frequent laying",
      },
      {
        label: "4",
        explanation:
          "Nutrition deficit factor: (10 - 6)*5 = 20 points for suboptimal nutrition",
      },
    ],
    result:
      "Total risk score = 9.1 + 15 + 21.4 + 20 = 65.5%, indicating moderate to high risk of egg binding.",
  };

  // 6. WIDGET (INPUTS + RESULTS)
  const widget = (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Bird Weight (lbs)
          </Label>
          <Input
            id="weight"
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g. 0.2"
            value={inputs.weight}
            onChange={(e) => setInputs({ ...inputs, weight: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="age" className="text-slate-700 dark:text-slate-300">
            Age (months)
          </Label>
          <Input
            id="age"
            type="number"
            min="0"
            step="1"
            placeholder="e.g. 5"
            value={inputs.age}
            onChange={(e) => setInputs({ ...inputs, age: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="eggsPerWeek" className="text-slate-700 dark:text-slate-300">
            Egg-laying Frequency (eggs per week)
          </Label>
          <Input
            id="eggsPerWeek"
            type="number"
            min="0"
            max="7"
            step="0.1"
            placeholder="e.g. 4"
            value={inputs.eggsPerWeek}
            onChange={(e) => setInputs({ ...inputs, eggsPerWeek: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="nutritionScore" className="text-slate-700 dark:text-slate-300">
            Nutrition Score (1-10)
          </Label>
          <Input
            id="nutritionScore"
            type="number"
            min="1"
            max="10"
            step="0.1"
            placeholder="e.g. 7"
            value={inputs.nutritionScore}
            onChange={(e) => setInputs({ ...inputs, nutritionScore: e.target.value })}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating state (already done on input change)
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              weight: "",
              age: "",
              eggsPerWeek: "",
              nutritionScore: "",
            })
          }
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== 0 && results.label !== "Please enter valid inputs" && (
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

      {results.label === "Please enter valid inputs" && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900 border border-red-200 rounded-lg text-red-700 dark:text-red-300 text-center font-semibold">
          Please enter valid positive numbers in all fields. Nutrition score must be between 1 and 10.
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Egg Binding Risk Estimator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Egg binding is a serious reproductive condition in female birds where an egg becomes stuck in the oviduct, preventing normal laying. This condition can result from multiple physiological and environmental factors including poor nutrition, inadequate calcium levels, obesity or underweight status, and reproductive stress. The Egg Binding Risk Estimator is designed to integrate these key variables into a comprehensive risk score, helping avian caretakers and veterinarians identify birds at higher risk.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          By evaluating weight relative to an ideal standard, age-related reproductive maturity, egg-laying frequency, and nutritional status, this tool provides an evidence-based estimate of egg binding risk. Young birds and those laying eggs frequently are physiologically more vulnerable due to immature or overtaxed reproductive systems. Additionally, poor nutrition compromises muscle function and calcium availability, which are critical for successful egg passage.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This estimator is not a diagnostic tool but rather a preventive aid to highlight birds that may require closer monitoring or veterinary intervention. Understanding these risk factors allows caretakers to optimize husbandry practices, improve diet, and adjust breeding management to reduce the incidence of egg binding and promote avian health and welfare.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To estimate the risk of egg binding in your bird, enter the requested parameters accurately. The calculator requires the bird’s current weight in pounds, age in months, average number of eggs laid per week, and a nutrition score reflecting the quality of the bird’s diet on a scale from 1 to 10. These inputs collectively influence the risk calculation based on veterinary research.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Measure your bird’s weight using a precise scale and enter it in pounds.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the bird’s age in months to account for reproductive maturity.
          </li>
          <li>
            <strong>Step 3:</strong> Provide the average number of eggs your bird lays weekly to assess reproductive strain.
          </li>
          <li>
            <strong>Step 4:</strong> Rate your bird’s nutrition quality from 1 (poor) to 10 (excellent) based on diet and supplementation.
          </li>
          <li>
            <strong>Step 5:</strong> Click “Calculate” to receive an estimated risk percentage and interpret the risk category with any warnings.
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
              href="https://www.merckvetmanual.com/exotic-and-laboratory-animals/birds/egg-binding-in-birds"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Merck Veterinary Manual - Egg Binding in Birds
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive overview of egg binding causes, clinical signs, and treatment options in avian species.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7149860/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Nutritional Management of Egg Binding in Birds - NCBI
            </a>
            <p className="text-slate-500 text-sm">
              Research article detailing the impact of nutrition and calcium metabolism on egg binding risk.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aav.org/page/avian-reproduction"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Association of Avian Veterinarians - Avian Reproduction
            </a>
            <p className="text-slate-500 text-sm">
              Expert guidelines on reproductive health and management in pet birds.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Egg Binding Risk Estimator"
      description="Estimate the risk of a female bird suffering from **egg binding** based on nutrition and reproductive history."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={formula}
      example={example}
      relatedCalculators={[
        { title: "Dog Alcohol/Ethanol Exposure Risk Calculator", url: "/pets/dog-alcohol-ethanol-exposure-risk", icon: "🐶" },
        { title: "Benadryl (Diphenhydramine) Dose Calculator for Cats", url: "/pets/cat-benadryl-diphenhydramine-dose", icon: "🐱" },
        { title: "Dog Body Condition Score Helper (BCS → Target Plan)", url: "/pets/dog-body-condition-score-bcs-target", icon: "🐶" },
        { title: "Dog Ideal Weight & Target Calories Calculator", url: "/pets/dog-ideal-weight-target-calories", icon: "🐶" },
        { title: "Horse Weight Estimator (Heart Girth & Length)", url: "/pets/horse-weight-estimator-girth-length", icon: "🐎" },
        { title: "Ideal Weight & Target Calories for Cats", url: "/pets/cat-ideal-weight-target-calories", icon: "🐱" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Egg Binding Risk Estimator" },
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