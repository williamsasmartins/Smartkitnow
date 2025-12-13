import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calculator,
  RotateCcw,
  Info,
  AlertTriangle,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function DogDehydrationRiskEstimatorCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");
  // Inputs: Current Weight, Weight 24h ago, Symptoms severity (scale 0-10)
  const [inputs, setInputs] = useState({
    currentWeight: "",
    weight24hAgo: "",
    symptomSeverity: "",
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const currentWeightRaw = parseFloat(inputs.currentWeight);
    const weight24hAgoRaw = parseFloat(inputs.weight24hAgo);
    const symptomSeverityRaw = parseFloat(inputs.symptomSeverity);

    // Safety Check
    if (
      !currentWeightRaw ||
      currentWeightRaw <= 0 ||
      !weight24hAgoRaw ||
      weight24hAgoRaw <= 0 ||
      symptomSeverityRaw === undefined ||
      symptomSeverityRaw < 0 ||
      symptomSeverityRaw > 10
    )
      return {
        value: 0,
        label: "Enter valid details above to estimate risk",
        subtext: null,
        warning: null,
      };

    // Convert weights to kg if imperial
    const currentWeightKg =
      unit === "imperial" ? currentWeightRaw / 2.20462 : currentWeightRaw;
    const weight24hAgoKg =
      unit === "imperial" ? weight24hAgoRaw / 2.20462 : weight24hAgoRaw;

    // Calculate % weight loss in 24h (indicator of fluid loss)
    const weightLossKg = weight24hAgoKg - currentWeightKg;
    const weightLossPercent = (weightLossKg / weight24hAgoKg) * 100;

    // Calculate Resting Energy Requirement (RER)
    // RER = 70 * (weight_kg ^ 0.75)
    const rer = 70 * Math.pow(currentWeightKg, 0.75);

    // Maintenance Energy Requirement (MER) multiplier for dehydration stress
    // Dehydration increases metabolic demand; use 1.2x RER as stress factor
    const mer = rer * 1.2;

    // Dehydration risk score calculation:
    // Base risk from % weight loss + symptom severity weighted
    // Weight loss > 5% in 24h is critical dehydration
    // Symptom severity scale 0-10 (0 = none, 10 = severe)
    // Risk score = (weightLossPercent * 4) + (symptomSeverityRaw * 10)
    // Normalize risk score to 0-100 scale capped at 100
    let riskScore = weightLossPercent * 4 + symptomSeverityRaw * 10;
    if (riskScore > 100) riskScore = 100;
    if (riskScore < 0) riskScore = 0;

    // Risk categories
    let riskLabel = "";
    let warning = null;
    if (riskScore >= 70) {
      riskLabel = "High Risk of Dehydration";
      warning =
        "Immediate veterinary attention is recommended. Severe dehydration can be life-threatening.";
    } else if (riskScore >= 40) {
      riskLabel = "Moderate Risk of Dehydration";
      warning =
        "Monitor your pet closely and consult your veterinarian soon to prevent worsening.";
    } else if (riskScore > 0) {
      riskLabel = "Low Risk of Dehydration";
      warning = null;
    } else {
      riskLabel = "Minimal Risk of Dehydration";
      warning = null;
    }

    // Display weight loss in user's unit system
    const weightLossDisplay =
      unit === "imperial"
        ? (weightLossKg * 2.20462).toFixed(2) + " lbs"
        : weightLossKg.toFixed(2) + " kg";

    return {
      value: riskScore.toFixed(0) + "%",
      label: riskLabel,
      subtext: `Estimated weight loss in last 24h: ${weightLossDisplay}. Symptom severity: ${symptomSeverityRaw}/10.`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (Rich Content)
  const faqs = [
    {
      question:
        "Why is monitoring weight changes important in assessing dehydration risk in dogs?",
      answer:
        "Monitoring weight changes is crucial because rapid weight loss, especially over 5% within 24 hours, often indicates significant fluid loss rather than fat loss. This fluid deficit can impair vital organ function and requires prompt veterinary intervention to prevent serious complications.",
    },
    {
      question:
        "How do physical symptoms correlate with dehydration severity in pets?",
      answer:
        "Physical symptoms such as lethargy, dry gums, sunken eyes, and skin tenting directly reflect the body's hydration status. The severity of these symptoms helps veterinarians estimate the degree of dehydration, guiding treatment urgency and fluid replacement strategies.",
    },
    {
      question:
        "What role does the Resting Energy Requirement (RER) play in understanding dehydration?",
      answer:
        "The Resting Energy Requirement (RER) represents the baseline caloric needs of a pet at rest. During dehydration and illness, metabolic demands increase, often requiring adjustments in nutrition and fluid therapy. Understanding RER helps tailor supportive care to maintain energy balance during recovery.",
    },
    {
      question:
        "Why should pet owners consult a veterinarian even if dehydration risk appears low?",
      answer:
        "Even low dehydration risk can progress rapidly if underlying causes like illness or inadequate water intake persist. Early veterinary consultation ensures accurate diagnosis, prevents complications, and provides guidance on hydration management tailored to your pet’s specific needs.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

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

        {/* Current Weight */}
        <div>
          <Label htmlFor="currentWeight" className="text-slate-700 dark:text-slate-300">
            Current Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="currentWeight"
            type="number"
            min={0}
            step="any"
            value={inputs.currentWeight}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, currentWeight: e.target.value }))
            }
            placeholder={`Enter current weight in ${unit === "imperial" ? "lbs" : "kg"}`}
          />
        </div>

        {/* Weight 24h Ago */}
        <div>
          <Label htmlFor="weight24hAgo" className="text-slate-700 dark:text-slate-300">
            Weight 24 Hours Ago ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight24hAgo"
            type="number"
            min={0}
            step="any"
            value={inputs.weight24hAgo}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, weight24hAgo: e.target.value }))
            }
            placeholder={`Enter weight 24 hours ago in ${unit === "imperial" ? "lbs" : "kg"}`}
          />
        </div>

        {/* Symptom Severity */}
        <div>
          <Label htmlFor="symptomSeverity" className="text-slate-700 dark:text-slate-300">
            Symptom Severity (0 = None, 10 = Severe)
          </Label>
          <Input
            id="symptomSeverity"
            type="number"
            min={0}
            max={10}
            step="1"
            value={inputs.symptomSeverity}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, symptomSeverity: e.target.value }))
            }
            placeholder="Rate symptoms from 0 to 10"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by setting state (already reactive)
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({ currentWeight: "", weight24hAgo: "", symptomSeverity: "" })
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
                Estimated Dehydration Risk
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
              <strong>Veterinary Disclaimer:</strong> This tool is for educational
              purposes. Consult your veterinarian for a specific diagnosis and
              treatment plan tailored to your pet’s condition.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      {/* WHAT IS SECTION */}
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Dehydration Risk Estimator (Weight & Symptoms Aware)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The <strong>Dehydration Risk Estimator</strong> is a specialized veterinary
          tool designed to assess the likelihood of dehydration in dogs by analyzing
          recent weight changes alongside physical symptom severity. Dehydration in
          pets can develop rapidly due to illness, heat exposure, or inadequate fluid
          intake, making early detection critical for effective treatment and
          recovery. This estimator integrates both objective data (weight loss) and
          subjective clinical signs to provide a comprehensive risk assessment.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Weight loss over a short period, especially within 24 hours, often
          reflects fluid loss rather than fat or muscle depletion. By calculating the
          percentage of weight lost and combining it with symptom severity scores,
          this tool estimates the metabolic and physiological stress on the animal.
          The inclusion of the <strong>Resting Energy Requirement (RER)</strong> and
          its adjustment for stress (MER) helps contextualize the pet’s energy needs
          during dehydration, which is vital for planning nutritional and fluid
          therapy.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Using this estimator allows pet owners and veterinarians to identify early
          signs of dehydration risk, prioritize veterinary care, and tailor fluid
          replacement strategies. It emphasizes the importance of monitoring both
          quantitative changes (weight) and qualitative symptoms, ensuring a
          holistic approach to pet health management. Early intervention guided by
          such tools can significantly improve outcomes and reduce the risk of
          complications associated with dehydration.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To accurately estimate your dog’s dehydration risk, begin by selecting the
          unit system that matches your measurement preference—Imperial (pounds) or
          Metric (kilograms). Then, input your dog’s current weight and their weight
          from 24 hours ago. This comparison helps detect rapid fluid loss. Next,
          assess and enter the severity of dehydration symptoms your dog is
          exhibiting on a scale from 0 (no symptoms) to 10 (severe symptoms).
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Current Weight:</strong> Measure your dog’s weight as accurately
            as possible using a reliable scale. This value is essential for
            calculating recent weight loss.
          </li>
          <li>
            <strong>Weight 24 Hours Ago:</strong> Use a previous weight measurement
            taken approximately 24 hours earlier. If unavailable, estimate based on
            recent records or veterinary visits.
          </li>
          <li>
            <strong>Symptom Severity:</strong> Evaluate physical signs such as dry
            gums, lethargy, sunken eyes, and skin elasticity. Rate the overall
            severity on a 0-10 scale to reflect how affected your dog appears.
          </li>
          <li>
            <strong>Calculate and Interpret:</strong> Click “Calculate” to receive
            an estimated dehydration risk percentage, a risk category, and any
            warnings or recommendations for veterinary care.
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
              href="https://www.merckvetmanual.com/generalized-conditions/dehydration-and-fluid-therapy/dehydration"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Merck Veterinary Manual - Dehydration and Fluid Therapy
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Comprehensive overview of dehydration pathophysiology, clinical signs,
              and treatment protocols in veterinary medicine.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aaha.org/globalassets/02-guidelines/dehydration-and-fluid-therapy-guidelines.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. American Animal Hospital Association (AAHA) - Fluid Therapy Guidelines
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Evidence-based guidelines for assessing and managing dehydration in
              small animals.
            </p>
          </li>
          <li className="block">
            <a
              href="https://vetnutrition.tufts.edu/2015/07/energy-requirements-of-dogs-and-cats/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Tufts Veterinary Nutrition - Energy Requirements of Dogs and Cats
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Detailed explanation of Resting Energy Requirement (RER) and Maintenance
              Energy Requirement (MER) in companion animals.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7149736/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              4. National Center for Biotechnology Information (NCBI) - Clinical
              Assessment of Dehydration in Dogs
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Research article discussing clinical signs and assessment methods for
              dehydration in veterinary patients.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Dehydration Risk Estimator (Weight & Symptoms Aware)"
      description="Estimate the risk of dehydration by inputting weight changes and physical symptoms for veterinary attention."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Veterinary Formula",
        formula: "RER = 70 × (Weight in kg)^0.75",
        variables: [
          {
            symbol: "RER",
            description: "Resting Energy Requirement (Calories at rest)",
          },
          {
            symbol: "MER",
            description: "Maintenance Energy Requirement (Activity Multiplier)",
          },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 20 kg dog has lost 1.2 kg in the last 24 hours and shows moderate lethargy and dry gums.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Calculate RER: 70 × (20)^0.75 ≈ 70 × 10.6 = 742 calories/day.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate weight loss percentage: (1.2 / 21.2) × 100 ≈ 5.66%.",
          },
          {
            label: "Step 3",
            explanation:
              "Symptom severity rated at 5/10. Risk score = (5.66 × 4) + (5 × 10) = 22.64 + 50 = 72.64%.",
          },
          {
            label: "Step 4",
            explanation:
              "Risk category: High Risk of Dehydration. Immediate veterinary care advised.",
          },
        ],
        result:
          "The dog is at high risk of dehydration and requires prompt veterinary intervention.",
      }}
      relatedCalculators={[
        {
          title: "Dog Calorie Needs (RER/MER) Calculator",
          url: "/pets/dog-calorie-needs-rer-mer",
          icon: "🐶",
        },
        {
          title: "Dog Weight Loss Planner",
          url: "/pets/dog-weight-loss-planner",
          icon: "🐶",
        },
        {
          title: "Dog Ideal Weight & Target Calories Calculator",
          url: "/pets/dog-ideal-weight-target-calories",
          icon: "🐶",
        },
        {
          title: "Dog Treat Calories & Daily Allowance Calculator",
          url: "/pets/dog-treat-calories-daily-allowance",
          icon: "🐶",
        },
        {
          title: "Puppy Calorie Needs by Age/Breed Size Calculator",
          url: "/pets/puppy-calorie-needs-age-breed-size",
          icon: "💉",
        },
        {
          title: "Dog Protein/Fat Intake Guide (by Goal)",
          url: "/pets/dog-protein-fat-intake-guide",
          icon: "🐶",
        },
      ]}
      onThisPage={[
        {
          id: "what-is",
          label: "Understanding Dehydration Risk Estimator (Weight & Symptoms Aware)",
        },
        { id: "how-to-use", label: "How to Use" },
        { id: "faq", label: "FAQ" },
        { id: "references", label: "References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}