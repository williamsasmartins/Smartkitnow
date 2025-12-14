import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CatNailTrimIntervalPlannerCalculator() {
  // 1. STATE
  // No unit switcher needed as inputs are categorical/time based
  // Inputs: Activity Level (1-5), Scratching Surface Quality (1-5)
  const [inputs, setInputs] = useState({
    activityLevel: "",
    surfaceQuality: "",
  });

  // 2. LOGIC ENGINE
  // Formula: Recommended Interval (weeks) = 8 - (Activity Level * 1.2) - (Surface Quality * 0.8)
  // Minimum interval capped at 2 weeks
  const results = useMemo(() => {
    const activity = parseInt(inputs.activityLevel);
    const surface = parseInt(inputs.surfaceQuality);

    if (
      isNaN(activity) ||
      isNaN(surface) ||
      activity < 1 ||
      activity > 5 ||
      surface < 1 ||
      surface > 5
    ) {
      return {
        value: 0,
        label: "Please enter valid inputs",
        subtext: null,
        warning: null,
      };
    }

    let interval = 8 - activity * 1.2 - surface * 0.8;
    if (interval < 2) interval = 2;

    return {
      value: interval.toFixed(1),
      label: "Recommended Nail Trim Interval (weeks)",
      subtext:
        "Based on your cat's activity level and available scratching surfaces.",
      warning: null,
    };
  }, [inputs]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question:
        "Why does a cat's activity level affect the recommended nail trim interval?",
      answer:
        "Cats with higher activity levels tend to wear down their nails more naturally through frequent movement and scratching. This natural abrasion reduces the need for frequent trims. Conversely, less active cats may require more frequent trims to prevent overgrowth and associated problems.",
    },
    {
      question:
        "How does the quality of scratching surfaces influence nail trim frequency?",
      answer:
        "High-quality scratching surfaces help cats maintain nail length by providing effective abrasion. When cats regularly use these surfaces, their nails stay shorter and healthier. Poor or insufficient scratching surfaces mean nails grow longer faster, necessitating more frequent trims.",
    },
    {
      question:
        "What are the risks of trimming a cat's nails too frequently or infrequently?",
      answer:
        "Trimming nails too frequently can cause discomfort or injury if done improperly, potentially leading to bleeding or infection. On the other hand, infrequent trims can result in overgrown nails that may curl into the paw pads, causing pain and mobility issues. Proper timing balances nail health and cat comfort.",
    },
    {
      question:
        "Can this planner replace regular veterinary check-ups for nail health?",
      answer:
        "While this planner provides a scientifically informed guideline, it does not replace professional veterinary advice. Regular vet visits ensure comprehensive health assessments, including nail condition. Always consult your veterinarian if you notice abnormalities or behavioral changes related to nail health.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 4. WIDGET JSX
  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="activityLevel" className="text-slate-700 dark:text-slate-300">
            Activity Level (1 = Very Low, 5 = Very High)
          </Label>
          <Input
            id="activityLevel"
            type="number"
            min={1}
            max={5}
            step={1}
            value={inputs.activityLevel}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, activityLevel: e.target.value }))
            }
            placeholder="Enter activity level (1-5)"
            aria-describedby="activityLevelHelp"
          />
          <p id="activityLevelHelp" className="text-xs text-slate-500 mt-1">
            Rate your cat's daily activity level on a scale from 1 to 5.
          </p>
        </div>

        <div>
          <Label htmlFor="surfaceQuality" className="text-slate-700 dark:text-slate-300">
            Scratching Surface Quality (1 = Poor, 5 = Excellent)
          </Label>
          <Input
            id="surfaceQuality"
            type="number"
            min={1}
            max={5}
            step={1}
            value={inputs.surfaceQuality}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, surfaceQuality: e.target.value }))
            }
            placeholder="Enter surface quality (1-5)"
            aria-describedby="surfaceQualityHelp"
          />
          <p id="surfaceQualityHelp" className="text-xs text-slate-500 mt-1">
            Rate the quality and availability of your cat's scratching surfaces.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by setting inputs to current values (no-op)
            setInputs((prev) => ({ ...prev }));
          }}
          aria-label="Calculate nail trim interval"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ activityLevel: "", surfaceQuality: "" })}
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

  // 5. EDITORIAL JSX
  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Nail Trim Interval Planner (activity/surface based)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Nail health is a critical aspect of feline wellness, directly impacting mobility and comfort. The Nail Trim Interval Planner uses two primary factors—activity level and scratching surface quality—to estimate the optimal frequency for nail trims. Cats with higher activity levels naturally wear down their nails through movement and scratching, reducing the need for frequent trims. Conversely, less active cats or those with poor scratching surfaces may experience faster nail overgrowth, necessitating more regular maintenance.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Scratching surfaces play a vital role in maintaining nail length and health. High-quality, accessible scratching posts or pads provide effective abrasion, helping cats shed the outer nail layers naturally. This reduces the risk of painful overgrowth or ingrown nails. The planner balances these factors scientifically to recommend a personalized nail trim interval, promoting optimal feline paw health and preventing common complications associated with improper nail care.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This tool is designed to empower cat owners with evidence-based guidance, complementing regular veterinary care. It emphasizes the importance of environmental enrichment and physical activity in nail maintenance. By understanding and applying these principles, owners can ensure their cats maintain healthy nails, enhancing overall quality of life and preventing avoidable injuries or infections.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator estimates the recommended nail trim interval for your cat based on two key inputs: activity level and scratching surface quality. Both inputs should be rated on a scale from 1 to 5, where 1 represents the lowest and 5 the highest level. The tool then applies a veterinary-informed formula to provide a personalized interval in weeks, helping you plan nail trims effectively.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Assess your cat's daily activity level honestly, considering playtime, movement, and general liveliness.
          </li>
          <li>
            <strong>Step 2:</strong> Evaluate the quality and availability of your cat's scratching surfaces, including posts, pads, or furniture.
          </li>
          <li>
            <strong>Step 3:</strong> Enter these ratings into the respective fields and click "Calculate" to receive your recommended nail trim interval.
          </li>
          <li>
            <strong>Step 4:</strong> Use the result to schedule nail trims, adjusting as needed based on your cat's behavior and nail condition.
          </li>
        </ul>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Frequently Asked Questions
        </h2>
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Veterinary References
        </h2>
        <ul className="space-y-4">
          <li className="block">
            <a
              href="https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center/health-information/feline-health-topics/cat-nail-care"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Cornell University Feline Health Center - Cat Nail Care
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive guide on feline nail health, trimming techniques, and the importance of scratching surfaces.
            </p>
          </li>
          <li className="block">
            <a
              href="https://vcahospitals.com/know-your-pet/cat-nail-trimming"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. VCA Hospitals - Cat Nail Trimming Guidelines
            </a>
            <p className="text-slate-500 text-sm">
              Veterinary insights on nail trimming frequency, risks of improper trimming, and behavioral considerations.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.petmd.com/cat/care/evr_ct_how_trim_cat_nails"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. PetMD - How to Trim Your Cat's Nails Safely
            </a>
            <p className="text-slate-500 text-sm">
              Practical advice on nail care routines, including the role of activity and environmental enrichment.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Nail Trim Interval Planner (activity/surface based)"
      description="Determine the best frequency for nail trims based on the cat's activity level and available scratching surfaces."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Recommended Interval (weeks) = 8 - (Activity Level × 1.2) - (Surface Quality × 0.8)",
        variables: [
          { symbol: "Activity Level", description: "Cat's daily activity rating (1-5)" },
          { symbol: "Surface Quality", description: "Quality of scratching surfaces (1-5)" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A moderately active cat (Activity Level 3) with good scratching surfaces (Surface Quality 4) needs a nail trim schedule.",
        steps: [
          {
            label: "1",
            explanation:
              "Input Activity Level = 3 and Surface Quality = 4 into the calculator.",
          },
          {
            label: "2",
            explanation:
              "Calculate: 8 - (3 × 1.2) - (4 × 0.8) = 8 - 3.6 - 3.2 = 1.2 weeks, but minimum interval capped at 2 weeks.",
          },
          {
            label: "3",
            explanation:
              "Recommended nail trim interval is 2 weeks to maintain optimal nail health.",
          },
        ],
        result: "The cat should have nail trims approximately every 2 weeks.",
      }}
      relatedCalculators={[
        {
          title: "Laminitis Risk Index (BCS + NSC intake)",
          url: "/pets/horse-laminitis-risk-index",
          icon: "🐾",
        },
        {
          title: "Dehydration Risk Checker",
          url: "/pets/small-mammal-dehydration-risk-checker",
          icon: "🐶",
        },
        {
          title: "Horse Salt & Mineral Balance Checker",
          url: "/pets/horse-salt-mineral-balance-checker",
          icon: "🐎",
        },
        {
          title: "Calcium Supplement Dosage (Breeding Females)",
          url: "/pets/bird-calcium-supplement-dosage-breeding-females",
          icon: "🍖",
        },
        {
          title: "Ambient Temperature Safe Zone Calculator",
          url: "/pets/bird-ambient-temperature-safe-zone",
          icon: "💉",
        },
        {
          title: "Phenylbutazone / Flunixin Dose Calculator",
          url: "/pets/horse-phenylbutazone-flunixin-dose",
          icon: "💧",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Nail Trim Interval Planner (activity/surface based)" },
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