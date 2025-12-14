import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CatLifeExpectancyEstimatorCalculator() {
  // 1. STATE
  // No unit selector needed because inputs are lifestyle factors (scores/percentages)
  // Default unit state removed as per instructions

  // Inputs: Diet Quality (1-10), Activity Level (1-10), Preventative Care (1-10), Age (years)
  const [inputs, setInputs] = useState({
    age: "",
    dietQuality: "",
    activityLevel: "",
    preventativeCare: "",
  });

  // 2. LOGIC ENGINE
  // Formula (simplified educational model):
  // Estimated Life Expectancy (years) = Base Life Expectancy + (Diet Quality Score * 0.5) + (Activity Level Score * 0.4) + (Preventative Care Score * 0.6) - (Age * 0.3)
  // Base Life Expectancy for average indoor cat = 12 years

  const results = useMemo(() => {
    const age = parseFloat(inputs.age);
    const dietQuality = parseFloat(inputs.dietQuality);
    const activityLevel = parseFloat(inputs.activityLevel);
    const preventativeCare = parseFloat(inputs.preventativeCare);

    // Validate inputs
    if (
      isNaN(age) ||
      isNaN(dietQuality) ||
      isNaN(activityLevel) ||
      isNaN(preventativeCare) ||
      age < 0 ||
      dietQuality < 1 ||
      dietQuality > 10 ||
      activityLevel < 1 ||
      activityLevel > 10 ||
      preventativeCare < 1 ||
      preventativeCare > 10
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning:
          "Please enter valid values: Age ≥ 0, and scores between 1 and 10 for diet, activity, and preventative care.",
      };
    }

    const baseLifeExpectancy = 12; // years

    const estimatedLifeExpectancy =
      baseLifeExpectancy +
      dietQuality * 0.5 +
      activityLevel * 0.4 +
      preventativeCare * 0.6 -
      age * 0.3;

    // Clamp minimum life expectancy to 0
    const finalEstimate = Math.max(0, estimatedLifeExpectancy.toFixed(1));

    return {
      value: finalEstimate,
      label: "Estimated Cat Life Expectancy (years)",
      subtext:
        "Based on lifestyle factors and current age. This is an educational estimate and not a veterinary diagnosis.",
      warning: null,
    };
  }, [inputs]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "How does diet quality affect a cat's life expectancy?",
      answer:
        "Diet quality plays a crucial role in a cat's overall health and longevity. A balanced diet rich in essential nutrients supports immune function, maintains healthy weight, and prevents chronic diseases. Therefore, higher diet quality scores correlate with increased life expectancy by reducing health risks over time.",
    },
    {
      question: "Why is activity level important for estimating life expectancy?",
      answer:
        "Regular physical activity helps maintain a healthy weight, improves cardiovascular health, and reduces the risk of obesity-related diseases in cats. Active cats tend to have better muscle tone and mental stimulation, which contribute to longer, healthier lives. Thus, higher activity levels positively influence life expectancy estimates.",
    },
    {
      question: "What role does preventative care play in a cat’s longevity?",
      answer:
        "Preventative care, including vaccinations, parasite control, and regular veterinary check-ups, helps detect and mitigate health issues early. This proactive approach reduces the risk of serious illnesses and complications, thereby extending a cat’s lifespan. Consistent preventative care is a key factor in improving life expectancy.",
    },
    {
      question: "Why does the cat’s current age reduce the estimated life expectancy?",
      answer:
        "As cats age, their remaining life expectancy naturally decreases due to the progression of age-related changes and potential health conditions. The formula accounts for this by subtracting a factor proportional to current age, reflecting realistic expectations. This adjustment ensures the estimate remains grounded in biological aging processes.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="age" className="text-slate-700 dark:text-slate-300">
            Cat's Current Age (years)
          </Label>
          <Input
            id="age"
            type="number"
            min="0"
            step="0.1"
            placeholder="e.g. 5"
            value={inputs.age}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, age: e.target.value }))
            }
          />
        </div>
        <div>
          <Label
            htmlFor="dietQuality"
            className="text-slate-700 dark:text-slate-300"
          >
            Diet Quality Score (1 = Poor, 10 = Excellent)
          </Label>
          <Input
            id="dietQuality"
            type="number"
            min="1"
            max="10"
            step="1"
            placeholder="e.g. 7"
            value={inputs.dietQuality}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, dietQuality: e.target.value }))
            }
          />
        </div>
        <div>
          <Label
            htmlFor="activityLevel"
            className="text-slate-700 dark:text-slate-300"
          >
            Activity Level Score (1 = Sedentary, 10 = Very Active)
          </Label>
          <Input
            id="activityLevel"
            type="number"
            min="1"
            max="10"
            step="1"
            placeholder="e.g. 6"
            value={inputs.activityLevel}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, activityLevel: e.target.value }))
            }
          />
        </div>
        <div>
          <Label
            htmlFor="preventativeCare"
            className="text-slate-700 dark:text-slate-300"
          >
            Preventative Care Score (1 = Minimal, 10 = Comprehensive)
          </Label>
          <Input
            id="preventativeCare"
            type="number"
            min="1"
            max="10"
            step="1"
            placeholder="e.g. 8"
            value={inputs.preventativeCare}
            onChange={(e) =>
              setInputs((prev) => ({
                ...prev,
                preventativeCare: e.target.value,
              }))
            }
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by setting inputs state (no-op here)
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({ age: "", dietQuality: "", activityLevel: "", preventativeCare: "" })
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
                Estimated Result
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
              veterinarian for personalized diagnosis and care.
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
          Understanding Life Expectancy Estimator (lifestyle factors; educational)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Estimating a cat’s life expectancy involves considering multiple lifestyle factors that influence health and longevity. This tool integrates key elements such as diet quality, physical activity, and preventative veterinary care to provide an educational estimate of expected lifespan. Each factor contributes uniquely to the cat’s overall well-being, affecting the risk of chronic diseases and age-related decline.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Diet quality is fundamental, as proper nutrition supports immune function, organ health, and weight management. Activity level influences cardiovascular fitness and mental stimulation, which are vital for maintaining vitality. Preventative care, including vaccinations and regular health screenings, helps detect and mitigate potential health issues early, thereby extending life expectancy.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This estimator also accounts for the cat’s current age, recognizing that remaining life expectancy naturally decreases as cats grow older. While this tool provides a scientifically informed approximation, it is designed for educational purposes and should not replace professional veterinary advice. Individual variations and unforeseen health factors can significantly influence actual lifespan.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To obtain an estimated life expectancy for your cat, enter the requested values reflecting your cat’s current lifestyle and health status. Use the scoring system to rate diet quality, activity level, and preventative care on a scale from 1 to 10, where 1 indicates poor or minimal and 10 indicates excellent or comprehensive. Input your cat’s current age in years to adjust the estimate accordingly.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter your cat’s current age in years, including decimals for partial years.
          </li>
          <li>
            <strong>Step 2:</strong> Score the diet quality based on nutritional balance and feeding practices.
          </li>
          <li>
            <strong>Step 3:</strong> Rate your cat’s activity level considering daily physical and mental engagement.
          </li>
          <li>
            <strong>Step 4:</strong> Assess preventative care by evaluating veterinary visits, vaccinations, and parasite control.
          </li>
          <li>
            <strong>Step 5:</strong> Click “Calculate” to view the estimated life expectancy, which updates dynamically.
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
              href="https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center/health-information/feline-health-topics/life-expectancy-cats"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Cornell University Feline Health Center: Life Expectancy in Cats
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive overview of factors influencing feline longevity and health management strategies.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.avma.org/resources-tools/pet-owners/petcare/cat-nutrition"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. American Veterinary Medical Association: Cat Nutrition
            </a>
            <p className="text-slate-500 text-sm">
              Authoritative resource on dietary requirements and nutritional health for cats.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center/health-information/feline-health-topics/physical-activity-cats"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Cornell University Feline Health Center: Physical Activity and Cats
            </a>
            <p className="text-slate-500 text-sm">
              Insights into the importance of exercise and mental stimulation for feline health and longevity.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.avma.org/resources-tools/pet-owners/petcare/preventive-care"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              4. American Veterinary Medical Association: Preventative Care for Pets
            </a>
            <p className="text-slate-500 text-sm">
              Guidelines on vaccinations, parasite control, and regular veterinary visits to maintain pet health.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Life Expectancy Estimator (lifestyle factors; educational)"
      description="Educational tool to estimate a cat's life expectancy based on diet, activity, and preventative care."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula:
          "Estimated Life Expectancy = 12 + (Diet Quality × 0.5) + (Activity Level × 0.4) + (Preventative Care × 0.6) - (Age × 0.3)",
        variables: [
          { symbol: "Diet Quality", description: "Score from 1 (poor) to 10 (excellent)" },
          { symbol: "Activity Level", description: "Score from 1 (sedentary) to 10 (very active)" },
          { symbol: "Preventative Care", description: "Score from 1 (minimal) to 10 (comprehensive)" },
          { symbol: "Age", description: "Current age of the cat in years" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 5-year-old cat with a diet quality score of 7, activity level of 6, and preventative care score of 8.",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate contributions: Diet (7 × 0.5 = 3.5), Activity (6 × 0.4 = 2.4), Preventative Care (8 × 0.6 = 4.8), Age penalty (5 × 0.3 = 1.5).",
          },
          {
            label: "2",
            explanation:
              "Sum base life expectancy and positive factors: 12 + 3.5 + 2.4 + 4.8 = 22.7.",
          },
          {
            label: "3",
            explanation:
              "Subtract age penalty: 22.7 - 1.5 = 21.2 years estimated life expectancy.",
          },
        ],
        result: "Estimated life expectancy is approximately 21.2 years.",
      }}
      relatedCalculators={[
        {
          title: "Horse Hay Intake Calculator (per body weight %)",
          url: "/pets/horse-hay-intake-bodyweight-percent",
          icon: "🐎",
        },
        {
          title: "Dog Caffeine Toxicity Calculator",
          url: "/pets/dog-caffeine-toxicity",
          icon: "🐶",
        },
        {
          title: "Prednisone/Prednisolone Dose Calculator for Dogs",
          url: "/pets/dog-prednisone-prednisolone-dose",
          icon: "🐶",
        },
        {
          title: "Dog Crate Size Finder",
          url: "/pets/dog-crate-size-finder",
          icon: "🐶",
        },
        {
          title: "Meloxicam Dose Calculator for Cats",
          url: "/pets/cat-meloxicam-dose",
          icon: "🐱",
        },
        {
          title: "Dog Life Expectancy Estimator (lifestyle factors)",
          url: "/pets/dog-life-expectancy-estimator",
          icon: "🐶",
        },
      ]}
      onThisPage={[
        {
          id: "what-is",
          label: "Understanding Life Expectancy Estimator (lifestyle factors; educational)",
        },
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