import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RotateCcw, Calculator, AlertTriangle, Info } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function HorseGestationDueDateCalculator() {
  // 1. STATE
  // No unit selector needed because this is date/time based only
  // Inputs: Last breeding date (date input)
  const [inputs, setInputs] = useState<{ lastBreedDate: string }>({
    lastBreedDate: "",
  });

  // 2. LOGIC ENGINE
  // Horse gestation length average: 340 days (range 320-370 days)
  // Formula: Estimated Foaling Date = Last Breeding Date + 340 days
  const results = useMemo(() => {
    if (!inputs.lastBreedDate) {
      return {
        value: "",
        label: "",
        subtext: "",
        warning: null,
      };
    }
    const breedDate = new Date(inputs.lastBreedDate);
    if (isNaN(breedDate.getTime())) {
      return {
        value: "",
        label: "",
        subtext: "",
        warning: "Please enter a valid date.",
      };
    }
    // Add 340 days
    const gestationDays = 340;
    const dueDate = new Date(breedDate);
    dueDate.setDate(dueDate.getDate() + gestationDays);

    // Format date as YYYY-MM-DD for display
    const formattedDueDate = dueDate.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return {
      value: formattedDueDate,
      label: "Estimated Foaling Date",
      subtext:
        "Based on an average gestation period of 340 days from the last breeding date.",
      warning: null,
    };
  }, [inputs.lastBreedDate]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is the gestation period for horses approximately 340 days?",
      answer:
        "The average gestation period of a horse is about 340 days due to the species-specific developmental timeline required for a foal to mature sufficiently in utero. This period allows for proper organ development, musculoskeletal growth, and preparation for life outside the womb. Variations can occur based on breed, mare health, and environmental factors, but 340 days is widely accepted as the standard average.",
    },
    {
      question: "Can the foaling date vary significantly from the calculated due date?",
      answer:
        "Yes, the actual foaling date can vary by up to 10-20 days before or after the estimated due date because gestation length is influenced by factors such as mare age, nutrition, and environmental conditions. While the calculator provides a reliable estimate, veterinarians monitor mares closely as the due date approaches to detect signs of impending labor. This variability is normal and should be anticipated in breeding management.",
    },
    {
      question: "How does the last breeding date affect the accuracy of the due date calculation?",
      answer:
        "The last breeding date is critical because it marks the approximate conception date from which gestation length is measured. If multiple breedings occur, the last successful breeding is used to estimate the due date, but uncertainty can arise if exact breeding dates are unknown. Accurate record-keeping of breeding events improves the precision of due date predictions and helps veterinarians plan appropriate prenatal care.",
    },
    {
      question: "Why is it important to estimate the foaling date accurately?",
      answer:
        "Accurately estimating the foaling date allows caretakers and veterinarians to prepare for the birth, ensuring the mare receives appropriate monitoring and intervention if necessary. It helps in scheduling vaccinations, nutritional adjustments, and arranging a safe foaling environment. Early preparation reduces risks associated with dystocia, premature birth, or neonatal complications, ultimately supporting the health of both mare and foal.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Input: Last Breeding Date */}
      <div className="space-y-4">
        <Label htmlFor="lastBreedDate" className="text-slate-700 dark:text-slate-300">
          Last Breeding Date
        </Label>
        <Input
          type="date"
          id="lastBreedDate"
          value={inputs.lastBreedDate}
          onChange={(e) =>
            setInputs((prev) => ({ ...prev, lastBreedDate: e.target.value }))
          }
          placeholder="Select the last breeding date"
          className="max-w-xs"
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 max-w-xs">
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
          onClick={() => setInputs({ lastBreedDate: "" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 max-w-xs">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Estimated Result
              </p>
              <p className="text-4xl font-extrabold text-blue-900 dark:text-white">
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
    <div className="space-y-12 max-w-3xl">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Horse Gestation (Due Date) Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Horse Gestation (Due Date) Calculator is a specialized veterinary tool
          designed to estimate the expected foaling date for a pregnant mare based on
          the last known breeding date. Gestation in horses typically lasts around 340
          days, although this can vary slightly depending on individual mare factors
          and breed. This calculator helps breeders and veterinarians anticipate the
          birth window, enabling better preparation and monitoring during the final
          stages of pregnancy.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Accurate prediction of the foaling date is crucial for ensuring the health
          and safety of both the mare and the foal. By inputting the last breeding
          date, this tool adds the average gestation length to provide a reliable
          estimate of when the mare is likely to give birth. This allows caretakers
          to plan veterinary check-ups, nutritional adjustments, and foaling
          environment preparations well in advance.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          While the calculator provides an average estimate, it is important to
          remember that natural variation in gestation length can occur. Factors such
          as mare age, health status, and environmental conditions may influence the
          timing of foaling. Therefore, this tool should be used as a guide alongside
          professional veterinary advice and regular pregnancy monitoring.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using the Horse Gestation (Due Date) Calculator is straightforward and
          requires only one key piece of information: the date of the mare's last
          successful breeding. This date serves as the starting point for calculating
          the expected foaling date by adding the average gestation period of 340
          days. Follow the steps below to obtain an accurate estimate.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter the last breeding date using the date
            picker input. Ensure the date is accurate and corresponds to the most
            recent successful breeding.
          </li>
          <li>
            <strong>Step 2:</strong> Click the "Calculate" button to process the
            input. The calculator will add 340 days to the entered date to estimate
            the foaling date.
          </li>
          <li>
            <strong>Step 3:</strong> Review the displayed estimated foaling date.
            Use this information to plan veterinary care, nutrition, and foaling
            environment preparations.
          </li>
          <li>
            <strong>Step 4:</strong> If needed, reset the form using the "Reset"
            button to enter a new breeding date for another calculation.
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
              Comprehensive overview of equine pregnancy, gestation length, and
              factors affecting foaling dates.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ivis.org/library/equine-reproduction/equine-gestation"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. IVIS: Equine Gestation
            </a>
            <p className="text-slate-500 text-sm">
              Detailed scientific insights into the physiology and timing of horse
              gestation.
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
              Practical guidelines for managing pregnant mares and predicting foaling
              dates.
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
        formula: "Estimated Foaling Date = Last Breeding Date + 340 days",
        variables: [
          {
            symbol: "Last Breeding Date",
            description: "The date of the mare's last successful breeding",
          },
          {
            symbol: "340 days",
            description:
              "Average gestation length for horses, representing the typical pregnancy duration",
          },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A mare was last bred on March 1, 2024. The breeder wants to know the expected foaling date to prepare accordingly.",
        steps: [
          {
            label: "1",
            explanation:
              "Input the last breeding date (March 1, 2024) into the calculator.",
          },
          {
            label: "2",
            explanation:
              "The calculator adds 340 days to March 1, 2024, resulting in an estimated foaling date.",
          },
          {
            label: "3",
            explanation:
              "The estimated foaling date is January 5, 2025, allowing the breeder to plan veterinary care and foaling preparations.",
          },
        ],
        result: "Estimated Foaling Date: January 5, 2025",
      }}
      relatedCalculators={[
        {
          title: "Gabapentin Dose Calculator for Cats",
          url: "/pets/cat-gabapentin-dose",
          icon: "🐱",
        },
        {
          title: "Horse Calorie & Energy Requirement Calculator (DE / TDN)",
          url: "/pets/horse-calorie-energy-requirement-de-tdn",
          icon: "🐎",
        },
        {
          title: "Environmental Enrichment Planner (per room)",
          url: "/pets/cat-environmental-enrichment-planner",
          icon: "🐱",
        },
        {
          title: "Fluid Intake vs. Urine Output Balance Checker",
          url: "/pets/cat-fluid-intake-urine-output-balance",
          icon: "🍖",
        },
        {
          title: "Xylitol Exposure Risk for Cats (rare but educational)",
          url: "/pets/cat-xylitol-exposure-risk",
          icon: "🐱",
        },
        {
          title: "Horse Toxic Plant Exposure Risk (Ragwort, Yew, etc.)",
          url: "/pets/horse-toxic-plant-exposure-risk",
          icon: "🐎",
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