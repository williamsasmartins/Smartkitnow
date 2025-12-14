import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, RotateCcw, Info, AlertTriangle, Calendar } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function HorseGestationDueDateCalculator() {
  // 1. STATE
  // No unit selector needed because inputs are date-based
  const [inputs, setInputs] = useState({
    breedingDate: "",
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    if (!inputs.breedingDate) {
      return {
        value: "",
        label: "",
        subtext: "",
        warning: null,
      };
    }

    // Horse average gestation length: 340 days (range 320-370 days)
    // Calculate due date by adding 340 days to breeding date
    const breeding = new Date(inputs.breedingDate);
    if (isNaN(breeding.getTime())) {
      return {
        value: "",
        label: "",
        subtext: "",
        warning: "Invalid breeding date entered.",
      };
    }

    const dueDate = new Date(breeding);
    dueDate.setDate(dueDate.getDate() + 340);

    // Format due date as YYYY-MM-DD for display
    const dueDateStr = dueDate.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return {
      value: dueDateStr,
      label: "Estimated Foaling (Due) Date",
      subtext:
        "Based on an average gestation period of 340 days from the breeding date.",
      warning: null,
    };
  }, [inputs]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is the horse gestation period considered to be around 340 days?",
      answer:
        "The average gestation period for horses is approximately 340 days, although it can range from 320 to 370 days depending on the mare and environmental factors. This average is derived from extensive veterinary research and breeding records. Understanding this timeframe helps breeders and veterinarians predict foaling dates accurately and prepare for the mare’s delivery.",
    },
    {
      question: "Can the foaling date vary significantly from the calculated due date?",
      answer:
        "Yes, the actual foaling date can vary by several days or even weeks from the estimated due date because gestation length is influenced by genetics, mare health, and environmental conditions. While the calculator provides an average estimate, close monitoring of the mare’s physical signs and veterinary check-ups are essential for precise timing. This variability is why breeders should always prepare for a window around the predicted date.",
    },
    {
      question: "How does this calculator improve breeding management for horse owners?",
      answer:
        "This calculator offers a reliable estimate of the foaling date based on the breeding date, enabling horse owners and veterinarians to plan appropriate care and monitoring. By knowing the expected delivery window, they can ensure the mare receives optimal nutrition, veterinary attention, and a safe environment for foaling. This proactive approach reduces risks associated with premature or delayed births.",
    },
    {
      question: "What should I do if I don’t know the exact breeding date?",
      answer:
        "If the exact breeding date is unknown, it becomes challenging to predict the foaling date accurately using this calculator. In such cases, veterinarians may use ultrasound examinations and hormonal assays to estimate fetal development stages and approximate gestation length. Regular veterinary monitoring is crucial to manage the pregnancy and anticipate delivery safely.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Input for breeding date */}
      <div className="space-y-4">
        <div className="flex flex-col">
          <Label htmlFor="breedingDate" className="text-slate-700 dark:text-slate-300">
            Breeding Date (Date of Conception)
          </Label>
          <Input
            id="breedingDate"
            type="date"
            value={inputs.breedingDate}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, breedingDate: e.target.value }))
            }
            placeholder="Select breeding date"
            className="max-w-xs"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No extra calculation needed, results update automatically
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ breedingDate: "" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value && (
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
              vet for diagnosis.
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
          Understanding Horse Gestation (Due Date) Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Horse Gestation (Due Date) Calculator is a specialized veterinary tool
          designed to estimate the expected foaling date of a pregnant mare based on
          the date of conception or breeding. Gestation in horses typically lasts
          around 340 days, but this period can vary due to individual mare factors,
          environmental conditions, and breed differences. This calculator provides a
          scientifically grounded estimate to help breeders and veterinarians plan
          appropriate prenatal care and prepare for the foaling event.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Accurate prediction of the foaling date is crucial for ensuring the health
          and safety of both the mare and the foal. By inputting the breeding date,
          this tool calculates the approximate due date by adding the average
          gestation length, allowing caretakers to monitor the mare closely as the
          delivery window approaches. This proactive approach supports timely
          veterinary interventions and optimal management of the mare’s nutrition and
          environment.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using the Horse Gestation (Due Date) Calculator is straightforward and
          requires only the date when the mare was bred or conceived. This date acts
          as the starting point for calculating the estimated foaling date by adding
          the average gestation period of 340 days. The tool then displays the
          predicted delivery date in a clear, easy-to-read format.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter the exact breeding date (date of
            conception) using the date picker input.
          </li>
          <li>
            <strong>Step 2:</strong> Click the “Calculate” button to generate the
            estimated foaling date.
          </li>
          <li>
            <strong>Step 3:</strong> Review the displayed due date and plan
            veterinary care and monitoring accordingly.
          </li>
          <li>
            <strong>Step 4:</strong> Use the “Reset” button to clear inputs and
            start a new calculation if needed.
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
              href="https://www.merckvetmanual.com/reproductive-system/pregnancy-in-the-mare/gestation-and-parturition-in-the-mare"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Merck Veterinary Manual: Gestation and Parturition in the Mare
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive veterinary resource detailing normal gestation lengths,
              factors affecting pregnancy, and foaling management in horses.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ivis.org/library/equine-reproduction/equine-gestation"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. IVIS Equine Reproduction: Equine Gestation
            </a>
            <p className="text-slate-500 text-sm">
              In-depth scientific overview of equine pregnancy, fetal development, and
              gestational timing used by veterinary professionals worldwide.
            </p>
          </li>
          <li className="block">
            <a
              href="https://aaep.org/horsehealth/gestation-and-parturition"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. American Association of Equine Practitioners: Gestation and Parturition
            </a>
            <p className="text-slate-500 text-sm">
              Authoritative guidelines on monitoring pregnant mares, expected gestation
              lengths, and best practices for foaling preparation.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Horse Gestation (Due Date) Calculator"
      description="Calculate the expected **foaling (birth) date** for a pregnant mare."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Estimated Foaling Date = Breeding Date + 340 days",
        variables: [
          {
            symbol: "Breeding Date",
            description: "The date the mare was bred or conceived",
          },
          {
            symbol: "340 days",
            description:
              "Average gestation length for horses, used to estimate foaling date",
          },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A mare was bred on March 1, 2024. The owner wants to know the expected foaling date to prepare accordingly.",
        steps: [
          {
            label: "1",
            explanation:
              "Input the breeding date (March 1, 2024) into the calculator.",
          },
          {
            label: "2",
            explanation:
              "The calculator adds 340 days to the breeding date to estimate the due date.",
          },
          {
            label: "3",
            explanation:
              "The estimated foaling date is January 5, 2025, allowing the owner to plan care.",
          },
        ],
        result: "Estimated Foaling Date: January 5, 2025",
      }}
      relatedCalculators={[
        {
          title: "Horse Electrolyte Need Estimator (Exercise & Heat)",
          url: "/pets/horse-electrolyte-need-estimator",
          icon: "🐎",
        },
        {
          title: "Dog Step-Goal & Activity Time Planner",
          url: "/pets/dog-step-goal-activity-time-planner",
          icon: "🐶",
        },
        {
          title: "Dog Chocolate Toxicity Calculator",
          url: "/pets/dog-chocolate-toxicity",
          icon: "🐶",
        },
        {
          title: "Puppy Adult Size Predictor (Weight Curve)",
          url: "/pets/puppy-adult-size-predictor-weight-curve",
          icon: "🍖",
        },
        {
          title: "Ideal Weight & Target Calories for Cats",
          url: "/pets/cat-ideal-weight-target-calories",
          icon: "🐱",
        },
        {
          title: "Thermal Gradient Maintenance Power Estimator",
          url: "/pets/reptile-thermal-gradient-maintenance-power",
          icon: "💧",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Horse Gestation (Due Date) Calculator" },
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