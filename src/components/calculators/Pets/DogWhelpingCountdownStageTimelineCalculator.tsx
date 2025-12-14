import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RotateCcw, Calculator, AlertTriangle, Info } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function DogWhelpingCountdownStageTimelineCalculator() {
  // 1. STATE
  // Whelping countdown is purely time/date based, so no unit switcher needed.
  // Inputs: Date of breeding (mating), optionally last progesterone test date & value (optional advanced)
  // For simplicity, we use only Date of breeding.
  const [inputs, setInputs] = useState<{ breedingDate: string }>({
    breedingDate: "",
  });

  // 2. LOGIC ENGINE
  // Gestation length for dogs: average 63 days (range 58-68)
  // Stages of labor:
  // Stage 1: 6-12 hours (up to 24h in some cases)
  // Stage 2: 3-6 hours (delivery of puppies)
  // Stage 3: up to 15 minutes after each puppy (placenta delivery)
  // We will calculate:
  // - Estimated whelping date (breedingDate + 63 days)
  // - Days remaining until whelping
  // - Timeline for stages relative to estimated whelping date/time

  const results = useMemo(() => {
    if (!inputs.breedingDate) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    const breeding = new Date(inputs.breedingDate);
    if (isNaN(breeding.getTime())) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: "Invalid breeding date entered.",
      };
    }

    // Estimated whelping date = breedingDate + 63 days
    const gestationDays = 63;
    const msPerDay = 1000 * 60 * 60 * 24;
    const estimatedWhelpingDate = new Date(breeding.getTime() + gestationDays * msPerDay);

    // Calculate days remaining from today
    const today = new Date();
    const diffMs = estimatedWhelpingDate.getTime() - today.getTime();
    const daysRemaining = Math.ceil(diffMs / msPerDay);

    // Warnings for overdue or too early
    let warning: string | null = null;
    if (daysRemaining < -5) {
      warning = "Whelping date passed over 5 days ago. Consult your veterinarian immediately.";
    } else if (daysRemaining < 0) {
      warning = "Whelping date has passed. Monitor your dog closely for signs of labor.";
    } else if (daysRemaining > 70) {
      warning = "Breeding date is too far in the future or invalid. Please verify.";
    }

    // Format estimated whelping date string
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    const estDateStr = estimatedWhelpingDate.toLocaleDateString(undefined, options);

    // Stage timeline summary (static text)
    // We will show this in subtext for quick reference
    const stageTimeline =
      "Stage 1: 6-12 hours (nesting, restlessness)\n" +
      "Stage 2: 3-6 hours (delivery of puppies)\n" +
      "Stage 3: Placenta delivery after each puppy, up to 15 minutes each";

    return {
      value: estDateStr,
      label: "Estimated Whelping Date",
      subtext: `Days remaining: ${daysRemaining >= 0 ? daysRemaining : 0}\n\n${stageTimeline}`,
      warning,
    };
  }, [inputs]);

  // 3. FAQS (DETAILED)
  const faqs = [
    {
      question: "How accurate is the estimated whelping date?",
      answer:
        "The estimated whelping date is based on an average gestation period of 63 days from the breeding date. However, individual dogs may vary, with normal gestation ranging from 58 to 68 days. Factors such as breed, litter size, and health can influence timing, so always monitor your dog closely as the date approaches and consult your veterinarian for precise assessment.",
    },
    {
      question: "What are the signs that labor is starting in my dog?",
      answer:
        "Early signs of labor include nesting behavior, restlessness, panting, shivering, and a drop in body temperature. Stage 1 labor can last 6 to 12 hours, during which the cervix dilates. If your dog shows prolonged distress or no progression to Stage 2 labor, contact your veterinarian immediately for guidance.",
    },
    {
      question: "What should I do if my dog goes past the estimated whelping date?",
      answer:
        "If your dog is more than 24 hours past the estimated whelping date without signs of labor, it is important to consult your veterinarian. Prolonged gestation can indicate complications such as fetal distress or uterine inertia. Timely veterinary evaluation ensures the health and safety of both the mother and puppies.",
    },
    {
      question: "Can I predict the exact time my dog will start whelping?",
      answer:
        "Exact timing of whelping is difficult to predict due to natural variation. While the countdown provides an estimated date, labor onset depends on hormonal and physiological changes unique to each dog. Close observation of behavioral and physical signs is essential for timely preparation and intervention if needed.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 4. JSX WIDGET (No unit selector since time-based)
  const widget = (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-col">
          <Label htmlFor="breedingDate" className="text-slate-700 dark:text-slate-300 mb-1">
            Date of Breeding (Mating)
          </Label>
          <Input
            id="breedingDate"
            type="date"
            value={inputs.breedingDate}
            onChange={(e) => setInputs({ breedingDate: e.target.value })}
            placeholder="Select breeding date"
            max={new Date().toISOString().split("T")[0]} // max today to avoid future date
            aria-describedby="breedingDateHelp"
          />
          <p id="breedingDateHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter the date your dog was bred or mated.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No special calculation trigger needed, results update automatically
            // But we keep button for UX consistency
          }}
          type="button"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ breedingDate: "" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          type="button"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 whitespace-pre-line">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Estimated Result
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">{results.label}</p>
              {results.subtext && (
                <p className="text-sm text-slate-500 mt-4 whitespace-pre-line">{results.subtext}</p>
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

  // 5. EDITORIAL CONTENT
  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Whelping Countdown & Stage Timeline
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Whelping, the process of a dog giving birth, is a critical time that requires careful monitoring and preparation. The gestation period for dogs typically lasts around 63 days from the date of breeding, though it can vary between 58 and 68 days depending on breed, litter size, and individual health factors. Understanding this timeline helps owners anticipate and prepare for labor.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Labor in dogs is divided into three stages. Stage 1 involves cervical dilation and can last from 6 to 12 hours, during which the dog may show nesting behavior, restlessness, and a drop in body temperature. Stage 2 is the active delivery of puppies, typically lasting 3 to 6 hours. Stage 3 involves the expulsion of placentas after each puppy, usually within 15 minutes.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Accurate tracking of the whelping countdown and understanding the stage timeline allows owners and veterinarians to recognize normal labor progression and identify potential complications early. This knowledge is essential for ensuring the health and safety of both the mother and her puppies during this vulnerable period.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator estimates your dog's expected whelping date based on the date of breeding you provide. It also outlines the typical timeline for each stage of labor to help you prepare accordingly.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter the exact date your dog was bred or mated using the date picker.
          </li>
          <li>
            <strong>Step 2:</strong> Click "Calculate" to see the estimated whelping date and days remaining.
          </li>
          <li>
            <strong>Step 3:</strong> Review the stage timeline summary to understand labor progression.
          </li>
          <li>
            <strong>Step 4:</strong> Monitor your dog closely as the estimated date approaches and consult your veterinarian if you notice any unusual signs or delays.
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
              href="https://www.merckvetmanual.com/reproductive-system/parturition-in-small-animals/parturition-in-dogs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Merck Veterinary Manual - Parturition in Dogs
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive veterinary resource detailing canine gestation, labor stages, and whelping management.
            </p>
          </li>
          <li className="block">
            <a
              href="https://vcahospitals.com/know-your-pet/labor-and-delivery-in-dogs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. VCA Hospitals - Labor and Delivery in Dogs
            </a>
            <p className="text-slate-500 text-sm">
              Practical guide for dog owners on recognizing labor signs and caring for whelping dogs.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aaha.org/globalassets/02-guidelines/parturition-guidelines.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. American Animal Hospital Association - Canine Parturition Guidelines
            </a>
            <p className="text-slate-500 text-sm">
              Veterinary clinical guidelines for managing canine labor and delivery.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Whelping Countdown & Stage Timeline"
      description="Track the countdown to whelping (birth) and estimate the timeline for each stage of labor."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: `Estimated Whelping Date = Date of Breeding + 63 days

Stages of Labor Timeline:
- Stage 1: 6-12 hours (cervical dilation, nesting)
- Stage 2: 3-6 hours (delivery of puppies)
- Stage 3: Up to 15 minutes after each puppy (placenta delivery)`,
        variables: [
          { symbol: "Date of Breeding", description: "The date the dog was bred or mated" },
          { symbol: "63 days", description: "Average canine gestation period" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A Labrador Retriever was bred on March 1st. The owner wants to know the expected whelping date and labor timeline.",
        steps: [
          {
            label: "1",
            explanation:
              "Enter the breeding date (March 1st) into the calculator's date input field.",
          },
          {
            label: "2",
            explanation:
              "Calculate to find the estimated whelping date by adding 63 days, resulting in April 3rd.",
          },
          {
            label: "3",
            explanation:
              "Review the labor stages timeline to prepare for the expected duration and signs of each stage.",
          },
        ],
        result:
          "Estimated whelping date: April 3rd. Stage 1 labor expected to last 6-12 hours, followed by 3-6 hours of puppy delivery, and placenta delivery after each puppy.",
      }}
      relatedCalculators={[
        {
          title: "Dehydration Risk Estimator (Symptoms + Intake)",
          url: "/pets/cat-dehydration-risk-estimator",
          icon: "🐾",
        },
        {
          title: "Dog Harness Size & Fit Guide",
          url: "/pets/dog-harness-size-fit-guide",
          icon: "🐶",
        },
        {
          title: "Dog Step-Goal & Activity Time Planner",
          url: "/pets/dog-step-goal-activity-time-planner",
          icon: "🐶",
        },
        {
          title: "Cage Size Requirement Calculator",
          url: "/pets/small-mammal-cage-size-requirement",
          icon: "🍖",
        },
        {
          title: "Dog Life Expectancy Estimator (lifestyle factors)",
          url: "/pets/dog-life-expectancy-estimator",
          icon: "🐶",
        },
        {
          title: "Dog BMI/Body Index (educational)",
          url: "/pets/dog-bmi-body-index-educational",
          icon: "🐶",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Whelping Countdown & Stage Timeline" },
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