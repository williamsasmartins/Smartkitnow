import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RotateCcw, Calculator, Info, AlertTriangle, Calendar } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CatPregnancyGestationDueDateCalculator() {
  // 1. STATE
  // No unit selector needed because calculation is date based only.
  // Input: Date of breeding (mating)
  const [inputs, setInputs] = useState<{ breedingDate: string }>({ breedingDate: "" });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    if (!inputs.breedingDate) {
      return { value: "", label: "", subtext: "", warning: null };
    }
    const breedingDateObj = new Date(inputs.breedingDate);
    if (isNaN(breedingDateObj.getTime())) {
      return { value: "", label: "", subtext: "", warning: "Please enter a valid breeding date." };
    }

    // Average cat gestation period: 63 days (range 58-67 days)
    // Calculate due date by adding 63 days to breeding date
    const dueDateObj = new Date(breedingDateObj);
    dueDateObj.setDate(dueDateObj.getDate() + 63);

    // Format due date as YYYY-MM-DD for display
    const dueDateStr = dueDateObj.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return {
      value: dueDateStr,
      label: "Estimated Due Date",
      subtext:
        "This date is an estimate based on the average gestation period of 63 days. Actual delivery may vary between 58 and 67 days depending on the individual cat.",
      warning: null,
    };
  }, [inputs]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "How accurate is the cat pregnancy due-date calculator?",
      answer:
        "The calculator provides an estimated due date based on the average gestation period of 63 days for cats. However, individual cats may deliver anywhere between 58 and 67 days after breeding, so the exact date can vary. Factors such as breed, health, and timing of fertilization can influence gestation length, making veterinary monitoring essential for precise predictions.",
    },
    {
      question: "Why is knowing the due date important for a pregnant cat?",
      answer:
        "Knowing the estimated due date helps cat owners and veterinarians prepare for the birth and ensure the queen receives appropriate prenatal care. It allows for timely monitoring of the cat’s health and early detection of any complications. Additionally, it helps in planning a safe and comfortable environment for the delivery and postnatal care of the kittens.",
    },
    {
      question: "Can the due date change after initial calculation?",
      answer:
        "Yes, the due date is an estimate and can shift based on the queen’s health and development of the fetuses. Ultrasound examinations during pregnancy can provide more accurate information about fetal age and expected delivery time. Regular veterinary check-ups are recommended to adjust care plans and anticipate any changes in the gestation timeline.",
    },
    {
      question: "What signs indicate that a cat is close to giving birth?",
      answer:
        "As the due date approaches, a pregnant cat may exhibit nesting behavior, restlessness, decreased appetite, and a drop in body temperature. These signs typically occur within 24 to 48 hours before labor begins. Understanding these indicators helps owners provide timely assistance and seek veterinary care if complications arise during delivery.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 4. WIDGET JSX
  const widget = (
    <div className="space-y-6">
      {/* Input: Breeding Date */}
      <div className="space-y-4">
        <div className="flex flex-col">
          <Label htmlFor="breedingDate" className="text-slate-700 dark:text-slate-300">
            Date of Breeding (Mating)
          </Label>
          <Input
            id="breedingDate"
            type="date"
            value={inputs.breedingDate}
            onChange={(e) => setInputs({ breedingDate: e.target.value })}
            max={new Date().toISOString().split("T")[0]}
            placeholder="Select breeding date"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No special calculation trigger needed; calculation is reactive.
            if (!inputs.breedingDate) {
              alert("Please enter the date of breeding to calculate the due date.");
            }
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
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a veterinarian for diagnosis and personalized care.
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
          Understanding Cat Pregnancy (Gestation) Due-Date Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Cat Pregnancy (Gestation) Due-Date Calculator is a specialized veterinary tool designed to estimate the expected delivery date of a pregnant cat, also known as a queen. This calculator uses the date of breeding (mating) as the primary input and applies the average gestation period of cats, which is approximately 63 days. By providing an estimated due date, it helps cat owners and veterinarians prepare for the birth and ensure appropriate prenatal care.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Gestation length in cats can vary slightly, typically ranging from 58 to 67 days depending on factors such as breed, health status, and timing of fertilization. This variability means the calculator’s output is an estimate rather than an exact date. Regular veterinary check-ups and monitoring are essential to track the queen’s health and fetal development throughout pregnancy.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Using this calculator can improve the management of feline pregnancies by providing timely information that supports decision-making for nutrition, environment, and veterinary interventions. It also helps owners recognize when labor is imminent and when to seek veterinary assistance if complications arise. Overall, it is a valuable tool in promoting the health and welfare of both the queen and her kittens.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator is simple and user-friendly, requiring only the date when the cat was bred or mated. Once you enter the breeding date, the tool automatically calculates the estimated due date by adding the average gestation period of 63 days. This estimate helps you plan for the arrival of the kittens and monitor the queen’s pregnancy progress.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter the exact date of breeding or mating in the date input field. Ensure the date is accurate for the best estimate.
          </li>
          <li>
            <strong>Step 2:</strong> Click the "Calculate" button to generate the estimated due date. The result will display below the input.
          </li>
          <li>
            <strong>Step 3:</strong> Use the estimated due date to prepare for the queen’s delivery, including scheduling veterinary check-ups and creating a safe nesting area.
          </li>
          <li>
            <strong>Step 4:</strong> Reset the calculator if you need to enter a new breeding date for another pregnancy.
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
              href="https://www.merckvetmanual.com/reproductive-system/pregnancy-in-cats-and-dogs/pregnancy-in-cats"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Merck Veterinary Manual: Pregnancy in Cats
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive veterinary resource detailing feline pregnancy, gestation periods, and care recommendations.
            </p>
          </li>
          <li className="block">
            <a
              href="https://vcahospitals.com/know-your-pet/pregnancy-in-cats"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. VCA Hospitals: Pregnancy in Cats
            </a>
            <p className="text-slate-500 text-sm">
              Expert guidance on feline pregnancy stages, signs of labor, and prenatal care from a leading veterinary hospital network.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.petmd.com/cat/conditions/reproductive/c_ct_pregnancy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. PetMD: Cat Pregnancy Overview
            </a>
            <p className="text-slate-500 text-sm">
              Educational article covering the basics of cat pregnancy, including gestation length and common pregnancy symptoms.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Cat Pregnancy (Gestation) Due-Date Calculator"
      description="Calculate the expected **due date** for a pregnant cat (queen) based on the date of breeding."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Estimated Due Date = Date of Breeding + 63 days",
        variables: [
          { symbol: "Date of Breeding", description: "The date when the cat was bred or mated" },
          { symbol: "63 days", description: "Average gestation period for cats" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A cat was bred on March 1st. Using the calculator, we want to estimate her expected delivery date.",
        steps: [
          {
            label: "1",
            explanation:
              "Enter March 1st as the date of breeding in the calculator’s input field.",
          },
          {
            label: "2",
            explanation:
              "Add 63 days to March 1st to calculate the estimated due date.",
          },
          {
            label: "3",
            explanation:
              "The calculator outputs May 3rd as the estimated due date for the queen’s delivery.",
          },
        ],
        result: "Estimated Due Date: May 3rd",
      }}
      relatedCalculators={[
        { title: "Cat Chocolate Toxicity Calculator", url: "/pets/cat-chocolate-toxicity", icon: "🐱" },
        { title: "Dog Calorie Needs (RER/MER) Calculator", url: "/pets/dog-calorie-needs-rer-mer", icon: "🐶" },
        { title: "Cat Calorie Needs (RER/MER) Calculator", url: "/pets/cat-calorie-needs-rer-mer", icon: "🐱" },
        { title: "Laminitis Risk Index (BCS + NSC intake)", url: "/pets/horse-laminitis-risk-index", icon: "🍖" },
        { title: "Meloxicam/Metacam Dose Calculator for Dogs", url: "/pets/dog-meloxicam-metacam-dose", icon: "🐶" },
        { title: "Ideal Weight & Target Calories for Cats", url: "/pets/cat-ideal-weight-target-calories", icon: "🐱" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Cat Pregnancy (Gestation) Due-Date Calculator" },
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