import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CatPlaySessionPlannerCalculator() {
  // 1. STATE
  // No unit switcher needed since inputs are time and age based
  const [inputs, setInputs] = useState({
    ageMonths: "",
    dailyFeatherPlayMinutes: "",
    dailyChasePlayMinutes: "",
  });

  // 2. LOGIC ENGINE
  // Goal: Calculate recommended total daily playtime target (minutes) based on age and current playtime inputs.
  // Formula (simplified): 
  // Recommended Total Playtime (min) = BasePlaytime + AgeAdjustment
  // Where BasePlaytime = dailyFeatherPlayMinutes + dailyChasePlayMinutes
  // AgeAdjustment = (12 - ageMonths) * 2 (younger cats need more play)
  // Minimum recommended total playtime = 20 minutes/day for adult cats
  const results = useMemo(() => {
    const age = parseFloat(inputs.ageMonths);
    const feather = parseFloat(inputs.dailyFeatherPlayMinutes);
    const chase = parseFloat(inputs.dailyChasePlayMinutes);

    if (
      isNaN(age) ||
      age < 2 ||
      age > 240 || // 20 years max
      isNaN(feather) ||
      feather < 0 ||
      isNaN(chase) ||
      chase < 0
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: "Please enter valid positive numbers. Age should be between 2 months and 20 years.",
      };
    }

    // Base playtime is current total playtime
    const basePlaytime = feather + chase;

    // Age adjustment: younger cats (under 12 months) need more play
    // For kittens under 12 months, add 2 minutes per month under 12
    const ageAdjustment = age < 12 ? (12 - age) * 2 : 0;

    // Minimum recommended total playtime for adult cats is 20 minutes/day
    const minRecommended = 20;

    // Calculate recommended total playtime
    const recommendedPlaytime = Math.max(minRecommended, basePlaytime + ageAdjustment);

    // Calculate difference to target
    const deficit = recommendedPlaytime - basePlaytime;

    return {
      value: recommendedPlaytime.toFixed(1),
      label: "Recommended Total Daily Playtime (minutes)",
      subtext:
        deficit > 0
          ? `Increase playtime by at least ${deficit.toFixed(
              1
            )} minutes to meet your cat's enrichment needs.`
          : "Your cat's current playtime meets or exceeds the recommended target.",
      warning: null,
    };
  }, [inputs]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is playtime important for cats?",
      answer:
        "Playtime is essential for cats to maintain physical health, mental stimulation, and emotional well-being. It mimics natural hunting behaviors, which helps reduce stress and prevent obesity. Regular interactive play also strengthens the bond between cats and their owners, promoting a happier, healthier pet.",
    },
    {
      question: "How does a cat's age affect its playtime needs?",
      answer:
        "Kittens and young cats have higher energy levels and require more frequent and longer play sessions to support their growth and development. As cats age, their activity levels typically decrease, so playtime can be adjusted accordingly. However, maintaining regular play is crucial at all life stages to prevent cognitive decline and maintain muscle tone.",
    },
    {
      question: "What types of play are best for cats?",
      answer:
        "Interactive play involving toys that mimic prey, such as feather wands or laser pointers, encourages natural hunting instincts. Chase play helps improve agility and cardiovascular health. A combination of both feather and chase play provides balanced physical exercise and mental enrichment, which is vital for overall feline health.",
    },
    {
      question: "How can I tell if my cat is getting enough playtime?",
      answer:
        "Signs your cat is getting sufficient play include a healthy weight, good muscle tone, and a calm demeanor when not playing. Cats that are bored or under-stimulated may exhibit destructive behavior or excessive vocalization. Using a play session planner helps ensure your cat receives adequate daily activity tailored to their age and current play habits.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 4. HANDLERS
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    // Allow only numbers and decimals
    if (/^\d*\.?\d*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="ageMonths" className="text-slate-700 dark:text-slate-300">
            Cat's Age (months)
          </Label>
          <Input
            id="ageMonths"
            name="ageMonths"
            type="text"
            placeholder="e.g. 6"
            value={inputs.ageMonths}
            onChange={handleInputChange}
            aria-describedby="ageHelp"
          />
          <p id="ageHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter your cat's age in months (2 to 240).
          </p>
        </div>

        <div>
          <Label htmlFor="dailyFeatherPlayMinutes" className="text-slate-700 dark:text-slate-300">
            Daily Feather Play Time (minutes)
          </Label>
          <Input
            id="dailyFeatherPlayMinutes"
            name="dailyFeatherPlayMinutes"
            type="text"
            placeholder="e.g. 10"
            value={inputs.dailyFeatherPlayMinutes}
            onChange={handleInputChange}
            aria-describedby="featherHelp"
          />
          <p id="featherHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Time spent playing with feather toys daily.
          </p>
        </div>

        <div>
          <Label htmlFor="dailyChasePlayMinutes" className="text-slate-700 dark:text-slate-300">
            Daily Chase Play Time (minutes)
          </Label>
          <Input
            id="dailyChasePlayMinutes"
            name="dailyChasePlayMinutes"
            type="text"
            placeholder="e.g. 8"
            value={inputs.dailyChasePlayMinutes}
            onChange={handleInputChange}
            aria-describedby="chaseHelp"
          />
          <p id="chaseHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Time spent playing chase games daily.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating inputs state (noop here since useMemo depends on inputs)
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              ageMonths: "",
              dailyFeatherPlayMinutes: "",
              dailyChasePlayMinutes: "",
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

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Play Session Planner (Feather/Chase Time Targets)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Play is a fundamental aspect of feline health, serving not only as physical exercise but also as mental enrichment. The Play Session Planner focuses on two primary types of interactive play: feather play, which stimulates a cat’s predatory instincts through light, fluttering movements, and chase play, which encourages vigorous activity and cardiovascular fitness. Together, these play styles help maintain a cat’s agility, coordination, and emotional well-being.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Cats’ play needs vary significantly with age, energy levels, and individual personality. Kittens and young cats require more frequent and longer play sessions to support their rapid growth and high energy, while adult and senior cats benefit from consistent but potentially shorter sessions to maintain muscle tone and cognitive function. This planner helps owners tailor daily playtime targets by considering these factors, ensuring cats receive adequate stimulation to prevent boredom and behavioral issues.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          By quantifying playtime goals, this tool empowers cat owners to create structured, achievable daily routines that promote healthy activity levels. It emphasizes the importance of balancing different play types to mimic natural hunting behaviors, which is crucial for a cat’s psychological health. Ultimately, this planner supports the holistic care of cats by integrating veterinary insights into practical, everyday enrichment strategies.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator helps you estimate the optimal total daily playtime for your cat by considering their age and current play habits. Begin by entering your cat’s age in months, which allows the tool to adjust recommendations based on developmental needs. Then, input the average daily minutes spent playing with feather toys and chase activities to assess current activity levels.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter your cat’s age in months (between 2 months and 20 years) to tailor playtime recommendations.
          </li>
          <li>
            <strong>Step 2:</strong> Input the average daily minutes your cat spends playing with feather toys, which stimulate stalking and pouncing instincts.
          </li>
          <li>
            <strong>Step 3:</strong> Enter the average daily minutes spent in chase play, encouraging vigorous movement and cardiovascular health.
          </li>
          <li>
            <strong>Step 4:</strong> Click “Calculate” to view the recommended total daily playtime target and see if your cat’s current playtime meets this goal.
          </li>
          <li>
            <strong>Step 5:</strong> Use the results to adjust your cat’s daily play sessions, increasing or balancing activities as needed to promote optimal health.
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
              href="https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center/health-information/feline-health-topics/play-and-enrichment"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Cornell Feline Health Center: Play and Enrichment
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive guide on the importance of play for feline health and behavior, emphasizing enrichment strategies.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vetmed.wsu.edu/outreach/Pet-Health-Topics/categories/behavior-enrichment"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Washington State University: Behavior and Enrichment
            </a>
            <p className="text-slate-500 text-sm">
              Veterinary insights into behavioral enrichment and how structured play benefits cats of all ages.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aaha.org/globalassets/02-guidelines/canine-physical-activity-guidelines.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. American Animal Hospital Association: Canine and Feline Physical Activity Guidelines
            </a>
            <p className="text-slate-500 text-sm">
              Evidence-based recommendations for daily physical activity in pets, including playtime targets for cats.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Play Session Planner (Feather/Chase Time Targets)"
      description="Plan optimal daily playtime sessions (duration and intensity) to meet your cat's exercise and enrichment needs."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Recommended Playtime = max(20, FeatherPlay + ChasePlay + (12 - AgeMonths) × 2 if AgeMonths < 12)",
        variables: [
          { symbol: "FeatherPlay", description: "Daily feather playtime in minutes" },
          { symbol: "ChasePlay", description: "Daily chase playtime in minutes" },
          { symbol: "AgeMonths", description: "Cat's age in months" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 6-month-old kitten currently plays 10 minutes with feather toys and 8 minutes chasing daily. The owner wants to know the recommended total daily playtime.",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate age adjustment: (12 - 6) × 2 = 12 minutes additional playtime recommended for kitten.",
          },
          {
            label: "2",
            explanation:
              "Sum current playtime: 10 + 8 = 18 minutes.",
          },
          {
            label: "3",
            explanation:
              "Add age adjustment: 18 + 12 = 30 minutes recommended total daily playtime.",
          },
        ],
        result: "The kitten should have approximately 30 minutes of total daily playtime combining feather and chase activities.",
      }}
      relatedCalculators={[
        { title: "Metabolic Bone Disease Risk Estimator", url: "/pets/reptile-metabolic-bone-disease-risk", icon: "🐾" },
        { title: "Dehydration Risk Checker", url: "/pets/small-mammal-dehydration-risk-checker", icon: "🐶" },
        { title: "Dog Calorie Needs (RER/MER) Calculator", url: "/pets/dog-calorie-needs-rer-mer", icon: "🐶" },
        { title: "Aquarium Volume Calculator (Rectangular / Cylindrical / Bowfront)", url: "/pets/aquarium-volume-rectangular-cylindrical-bowfront", icon: "🍖" },
        { title: "Phosphorus per Meal Estimator (diet label helper)", url: "/pets/cat-phosphorus-per-meal-estimator", icon: "💉" },
        { title: "Dog Alcohol/Ethanol Exposure Risk Calculator", url: "/pets/dog-alcohol-ethanol-exposure-risk", icon: "🐶" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Play Session Planner (Feather/Chase Time Targets)" },
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