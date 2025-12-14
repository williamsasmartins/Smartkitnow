import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, RotateCcw, Info, AlertTriangle, Clock } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CatRestingActiveHoursBalanceTrackerCalculator() {
  // 1. STATE
  // No unit selector needed since inputs are time-based (hours)
  const [inputs, setInputs] = useState({
    restingHours: "",
    activeHours: "",
  });

  // 2. LOGIC ENGINE
  // Calculate balance ratio = Active Hours / Resting Hours
  // Ideal balance is roughly 1:1 to 1:2 active to resting for healthy cats
  const results = useMemo(() => {
    const resting = parseFloat(inputs.restingHours);
    const active = parseFloat(inputs.activeHours);

    if (
      isNaN(resting) ||
      isNaN(active) ||
      resting <= 0 ||
      active < 0 ||
      resting > 24 ||
      active > 24
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning:
          "Please enter valid hours between 0 and 24. Resting hours must be greater than 0.",
      };
    }

    // Calculate ratio
    const ratio = active / resting;

    // Interpret balance
    let label = "";
    let subtext = "";
    let warning = null;

    if (ratio < 0.3) {
      label = "Low Activity Balance";
      subtext =
        "Your cat is resting significantly more than it is active. This may indicate lethargy or health issues.";
      warning =
        "Consult your veterinarian if your cat shows prolonged low activity to rule out medical concerns.";
    } else if (ratio >= 0.3 && ratio <= 0.7) {
      label = "Moderate Activity Balance";
      subtext =
        "Your cat has a balanced resting and active period, which is typical for healthy adult cats.";
    } else if (ratio > 0.7 && ratio <= 1.2) {
      label = "High Activity Balance";
      subtext =
        "Your cat is quite active relative to resting time, which can be normal in playful or young cats.";
    } else {
      label = "Very High Activity Balance";
      subtext =
        "Your cat is very active compared to resting hours. Ensure your cat is not overstressed or anxious.";
      warning =
        "Excessive activity with little rest can lead to fatigue or stress. Monitor behavior closely.";
    }

    return {
      value: ratio.toFixed(2),
      label,
      subtext,
      warning,
    };
  }, [inputs]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question:
        "Why is it important to balance resting and active hours for cats?",
      answer:
        "Cats require a healthy balance between resting and active hours to maintain optimal physical and mental health. Resting allows for tissue repair and energy conservation, while active hours promote muscle tone, cardiovascular health, and mental stimulation. An imbalance can indicate stress, illness, or behavioral issues that may require veterinary attention.",
    },
    {
      question:
        "How can owners accurately track their cat's resting and active hours?",
      answer:
        "Owners can observe their cat's daily routine by noting periods of sleep, rest, and play or movement throughout the day. Using a journal or digital tracker helps record these hours consistently over several days to identify patterns. Accurate tracking is essential to detect deviations from normal behavior that might signal health problems.",
    },
    {
      question:
        "What does a low active to resting hours ratio indicate in cats?",
      answer:
        "A low ratio suggests the cat is spending much more time resting than being active, which could be a sign of lethargy, pain, or underlying illness. While cats naturally sleep a lot, significant decreases in activity warrant a veterinary evaluation to rule out medical or environmental causes. Early detection helps improve outcomes through timely intervention.",
    },
    {
      question:
        "Can a very high active to resting hours ratio be harmful to cats?",
      answer:
        "Yes, excessive activity with insufficient rest can lead to fatigue, stress, and increased risk of injury in cats. While young or playful cats may have higher activity levels, sustained imbalance may indicate anxiety or environmental stressors. Monitoring and providing a calm environment with adequate rest opportunities is crucial for wellbeing.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="restingHours" className="text-slate-700 dark:text-slate-300">
            Resting Hours (per 24-hour period)
          </Label>
          <Input
            id="restingHours"
            type="number"
            min={0}
            max={24}
            step={0.1}
            placeholder="e.g. 16"
            value={inputs.restingHours}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, restingHours: e.target.value }))
            }
            aria-describedby="restingHelp"
          />
          <p id="restingHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter the average number of hours your cat rests or sleeps daily.
          </p>
        </div>

        <div>
          <Label htmlFor="activeHours" className="text-slate-700 dark:text-slate-300">
            Active Hours (per 24-hour period)
          </Label>
          <Input
            id="activeHours"
            type="number"
            min={0}
            max={24}
            step={0.1}
            placeholder="e.g. 6"
            value={inputs.activeHours}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, activeHours: e.target.value }))
            }
            aria-describedby="activeHelp"
          />
          <p id="activeHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter the average number of hours your cat is active, playing, or moving.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger calculation by updating inputs state (already reactive)
          }}
          aria-label="Calculate Resting vs Active Hours Balance"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ restingHours: "", activeHours: "" })}
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
                Estimated Active to Resting Hours Ratio
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
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a veterinarian for diagnosis and personalized advice.
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
          Understanding Resting vs. Active Hours Balance Tracker (owner input)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Cats are known for their unique activity patterns, alternating between extended periods of rest and bursts of activity. Monitoring the balance between resting and active hours is crucial for understanding a cat’s overall health and wellbeing. This tracker allows owners to input observed resting and active hours to assess whether their cat maintains a healthy lifestyle or if there might be underlying concerns requiring attention.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Resting hours encompass sleep and calm inactivity, which are essential for tissue repair, immune function, and energy conservation. Active hours include play, exploration, and movement, which stimulate cardiovascular health, muscle tone, and mental engagement. An imbalance in these hours can indicate stress, illness, or behavioral issues, making this tracker a valuable tool for early detection and intervention.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          By regularly tracking and evaluating the ratio of active to resting hours, owners can better understand their cat’s daily routine and identify deviations from normal behavior. This proactive approach supports timely veterinary consultations and tailored care plans, ultimately promoting a longer, healthier life for feline companions.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator helps you determine the balance between your cat’s resting and active hours based on your observations. To use it effectively, you should monitor your cat’s behavior over a typical 24-hour period, noting the time spent resting and the time spent active. Input these values into the respective fields and click “Calculate” to receive an interpretation of the balance ratio.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Observe your cat for a full day, recording the hours spent resting (sleeping or calm inactivity).
          </li>
          <li>
            <strong>Step 2:</strong> Record the hours your cat spends active, including playing, exploring, and moving around.
          </li>
          <li>
            <strong>Step 3:</strong> Enter the recorded resting and active hours into the calculator inputs.
          </li>
          <li>
            <strong>Step 4:</strong> Click “Calculate” to view the active to resting hours ratio and interpret the results.
          </li>
          <li>
            <strong>Step 5:</strong> Use the insights to monitor your cat’s health and consult a veterinarian if the balance indicates potential concerns.
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
              href="https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center/health-information/feline-health-topics/cat-behavior"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Cornell University College of Veterinary Medicine - Cat Behavior
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive resource on feline behavior patterns including activity and rest cycles.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vetmed.ucdavis.edu/clinical-sciences/behavioral-medicine"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. UC Davis Veterinary Medicine - Behavioral Medicine
            </a>
            <p className="text-slate-500 text-sm">
              Insights into feline activity, rest, and behavioral health assessments.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.avma.org/resources-tools/pet-owners/petcare/cat-behavior-and-training"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. American Veterinary Medical Association - Cat Behavior and Training
            </a>
            <p className="text-slate-500 text-sm">
              Guidelines on understanding and managing cat activity and rest for optimal health.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Resting vs. Active Hours Balance Tracker (owner input)"
      description="Tool for owners to track and assess the balance between their cat's resting and active hours."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Balance Ratio = Active Hours ÷ Resting Hours",
        variables: [
          { symbol: "Active Hours", description: "Total hours cat is active per day" },
          { symbol: "Resting Hours", description: "Total hours cat is resting per day" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "An owner observes their cat resting for 16 hours and being active for 6 hours in a 24-hour period.",
        steps: [
          {
            label: "1",
            explanation:
              "Input resting hours as 16 and active hours as 6 into the calculator.",
          },
          {
            label: "2",
            explanation:
              "Calculate the balance ratio: 6 ÷ 16 = 0.375, indicating moderate activity balance.",
          },
          {
            label: "3",
            explanation:
              "Interpret the result as typical for a healthy adult cat with balanced rest and activity.",
          },
        ],
        result: "Balance Ratio = 0.38 (Moderate Activity Balance)",
      }}
      relatedCalculators={[
        {
          title: "Cat Carrier Size & Fit Guide",
          url: "/pets/cat-carrier-size-fit-guide",
          icon: "🐱",
        },
        {
          title: "Whelping Countdown & Stage Timeline",
          url: "/pets/dog-whelping-countdown-stage-timeline",
          icon: "🐶",
        },
        {
          title: "Dog Crate Size Finder",
          url: "/pets/dog-crate-size-finder",
          icon: "🐶",
        },
        {
          title: "Dog Treat Calories & Daily Allowance Calculator",
          url: "/pets/dog-treat-calories-daily-allowance",
          icon: "🐶",
        },
        {
          title: "Cat Calorie Needs (RER/MER) Calculator",
          url: "/pets/cat-calorie-needs-rer-mer",
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
          label: "Understanding Resting vs. Active Hours Balance Tracker (owner input)",
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