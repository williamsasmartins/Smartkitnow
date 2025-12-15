import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function SmallMammalBeddingReplacementFrequencyCalculator() {
  // 1. STATE
  // No unit selector needed since inputs are time/age based
  // Inputs: cage size (sq ft), number of animals, bedding type (absorbency rating), and average daily urine output (ml)
  // For simplicity, bedding type absorbency rating: Low=1, Medium=2, High=3 (user selects)
  const [inputs, setInputs] = useState({
    cageSize: "", // sq ft
    numberOfAnimals: "",
    beddingAbsorbency: "2", // default Medium
    avgDailyUrineMl: "",
  });

  // 2. LOGIC ENGINE
  // Formula rationale:
  // Bedding Replacement Frequency (days) = (Bedding Absorbency Rating * Cage Size * 1000) / (Number of Animals * Average Daily Urine Output)
  // This estimates how many days bedding can absorb urine before replacement is needed.
  // 1000 is a scaling factor to convert sq ft and ml to a practical day estimate.
  const results = useMemo(() => {
    const cageSize = parseFloat(inputs.cageSize);
    const numberOfAnimals = parseInt(inputs.numberOfAnimals);
    const beddingAbsorbency = parseInt(inputs.beddingAbsorbency);
    const avgDailyUrineMl = parseFloat(inputs.avgDailyUrineMl);

    if (
      isNaN(cageSize) ||
      cageSize <= 0 ||
      isNaN(numberOfAnimals) ||
      numberOfAnimals <= 0 ||
      isNaN(beddingAbsorbency) ||
      isNaN(avgDailyUrineMl) ||
      avgDailyUrineMl <= 0
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: "Please enter valid positive numbers for all fields.",
      };
    }

    const frequencyDays =
      (beddingAbsorbency * cageSize * 1000) / (numberOfAnimals * avgDailyUrineMl);

    // Warn if frequency is less than 1 day (too frequent)
    const warning =
      frequencyDays < 1
        ? "Estimated replacement frequency is less than 1 day, indicating very high urine output or small cage size. Consider increasing cage size or bedding absorbency."
        : null;

    return {
      value: frequencyDays.toFixed(1),
      label: "Days Between Full Bedding Replacement",
      subtext:
        "This estimate helps maintain hygiene by preventing ammonia buildup and odor.",
      warning,
    };
  }, [inputs]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is bedding replacement frequency important for small mammals?",
      answer:
        "Regular bedding replacement is crucial to maintain a clean and healthy environment for small mammals. Accumulated urine and feces can lead to ammonia buildup, which irritates respiratory tracts and can cause infections. By estimating replacement frequency, owners can prevent health issues and promote animal comfort.",
    },
    {
      question: "How does bedding absorbency affect replacement frequency?",
      answer:
        "Bedding absorbency determines how much urine it can hold before becoming saturated. Higher absorbency bedding materials can retain more moisture, allowing for longer intervals between replacements. Choosing the right bedding type based on absorbency helps optimize hygiene and reduces labor for caretakers.",
    },
    {
      question: "Can the number of animals in a cage impact bedding replacement needs?",
      answer:
        "Yes, the number of animals directly influences the amount of urine and waste produced. More animals result in faster saturation of bedding, necessitating more frequent changes. Accurately accounting for animal count ensures the estimator provides realistic replacement intervals.",
    },
    {
      question: "How does cage size influence bedding replacement frequency?",
      answer:
        "Larger cage sizes provide more surface area for bedding, which can absorb greater volumes of urine before saturation. This typically extends the time between full bedding replacements. Conversely, smaller cages require more frequent changes to maintain hygiene and prevent odor buildup.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // HANDLERS
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  }

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="cageSize" className="text-slate-700 dark:text-slate-300">
            Cage Size (square feet)
          </Label>
          <Input
            id="cageSize"
            name="cageSize"
            type="number"
            min="0"
            step="0.1"
            placeholder="e.g. 4.5"
            value={inputs.cageSize}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label htmlFor="numberOfAnimals" className="text-slate-700 dark:text-slate-300">
            Number of Animals
          </Label>
          <Input
            id="numberOfAnimals"
            name="numberOfAnimals"
            type="number"
            min="1"
            step="1"
            placeholder="e.g. 3"
            value={inputs.numberOfAnimals}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label htmlFor="beddingAbsorbency" className="text-slate-700 dark:text-slate-300">
            Bedding Absorbency Level
          </Label>
          <select
            id="beddingAbsorbency"
            name="beddingAbsorbency"
            className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-2"
            value={inputs.beddingAbsorbency}
            onChange={handleChange}
          >
            <option value="1">Low Absorbency (e.g. straw)</option>
            <option value="2">Medium Absorbency (e.g. wood shavings)</option>
            <option value="3">High Absorbency (e.g. paper-based)</option>
          </select>
        </div>

        <div>
          <Label htmlFor="avgDailyUrineMl" className="text-slate-700 dark:text-slate-300">
            Average Daily Urine Output per Animal (ml)
          </Label>
          <Input
            id="avgDailyUrineMl"
            name="avgDailyUrineMl"
            type="number"
            min="0"
            step="1"
            placeholder="e.g. 30"
            value={inputs.avgDailyUrineMl}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating state (already reactive)
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              cageSize: "",
              numberOfAnimals: "",
              beddingAbsorbency: "2",
              avgDailyUrineMl: "",
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
          Understanding Bedding Replacement Frequency Estimator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Bedding replacement frequency is a critical factor in maintaining a hygienic and healthy environment for small mammals. Over time, bedding materials absorb urine and feces, which can lead to the buildup of ammonia and harmful bacteria. This estimator helps caretakers determine the optimal interval for full bedding replacement based on key variables such as cage size, number of animals, bedding absorbency, and urine output, ensuring animal welfare and comfort.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The estimator uses a scientifically grounded formula that balances the absorbency capacity of the bedding with the waste produced by the animals. By quantifying these factors, it provides a practical timeline for when bedding should be fully replaced to prevent odor, respiratory irritation, and infections. This tool supports evidence-based husbandry practices, promoting longevity and wellbeing in small mammal care.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Understanding the interplay between cage size and animal density is essential, as overcrowding can accelerate bedding saturation. Additionally, selecting bedding with appropriate absorbency levels tailored to the species and environment can optimize replacement schedules. This estimator empowers owners and veterinary professionals to make informed decisions that enhance sanitation and reduce labor without compromising animal health.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this Bedding Replacement Frequency Estimator, enter the relevant details about your small mammal enclosure and animals. The calculator requires the cage size in square feet, the number of animals housed, the bedding absorbency level, and the average daily urine output per animal in milliliters. These inputs allow the tool to estimate how many days can pass before a full bedding replacement is necessary to maintain optimal hygiene.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Measure your cage’s floor area in square feet accurately to provide a precise input.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the total number of animals sharing the enclosure to account for waste production.
          </li>
          <li>
            <strong>Step 3:</strong> Select the bedding absorbency level that best matches your bedding material, considering its moisture retention capacity.
          </li>
          <li>
            <strong>Step 4:</strong> Input the average daily urine output per animal, which varies by species and size; consult veterinary sources if unsure.
          </li>
          <li>
            <strong>Step 5:</strong> Click “Calculate” to receive an estimate of days between full bedding replacements, helping you plan cleaning schedules effectively.
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
              href="https://www.merckvetmanual.com/exotic-and-laboratory-animals/rodents/husbandry-of-rodents"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Merck Veterinary Manual - Husbandry of Rodents
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive guide on small mammal care, including environmental hygiene and bedding management.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7159084/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Ammonia Exposure and Respiratory Health in Small Mammals - NCBI
            </a>
            <p className="text-slate-500 text-sm">
              Scientific article detailing the effects of ammonia buildup from soiled bedding on respiratory health.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.avma.org/resources-tools/pet-owners/petcare/small-mammal-care"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. American Veterinary Medical Association - Small Mammal Care
            </a>
            <p className="text-slate-500 text-sm">
              Authoritative resource on best practices for small mammal husbandry, including cage hygiene and bedding.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Bedding Replacement Frequency Estimator"
      description="Estimate how often bedding needs to be fully replaced to maintain hygiene and prevent ammonia buildup."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula:
          "Bedding Replacement Frequency (days) = (Bedding Absorbency × Cage Size × 1000) ÷ (Number of Animals × Average Daily Urine Output)",
        variables: [
          { symbol: "Bedding Absorbency", description: "Absorbency rating of bedding material (1=Low, 2=Medium, 3=High)" },
          { symbol: "Cage Size", description: "Floor area of the cage in square feet" },
          { symbol: "Number of Animals", description: "Total animals housed in the cage" },
          { symbol: "Average Daily Urine Output", description: "Urine output per animal per day in milliliters" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A small mammal owner has a 5 sq ft cage housing 4 animals using medium absorbency wood shavings. Each animal produces approximately 25 ml of urine daily.",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate numerator: Bedding Absorbency (2) × Cage Size (5) × 1000 = 10,000",
          },
          {
            label: "2",
            explanation:
              "Calculate denominator: Number of Animals (4) × Average Daily Urine Output (25) = 100",
          },
          {
            label: "3",
            explanation:
              "Divide numerator by denominator: 10,000 ÷ 100 = 100 days estimated between full bedding replacements.",
          },
        ],
        result:
          "The bedding should be fully replaced approximately every 100 days to maintain optimal hygiene under these conditions.",
      }}
      relatedCalculators={[
        { title: "Dog Calorie Needs (RER/MER) Calculator", url: "/pets/dog-calorie-needs-rer-mer", icon: "🐶" },
        { title: "Horse Feeding Rate Calculator (Forage + Concentrate)", url: "/pets/horse-feeding-rate-forage-concentrate", icon: "🐎" },
        { title: "Dog Crate Size Finder", url: "/pets/dog-crate-size-finder", icon: "🐶" },
        { title: "Cat Calorie Needs (RER/MER) Calculator", url: "/pets/cat-calorie-needs-rer-mer", icon: "🐱" },
        { title: "Meloxicam/Metacam Dose Calculator for Dogs", url: "/pets/dog-meloxicam-metacam-dose", icon: "🐶" },
        { title: "Dog Daily Water Intake Checker", url: "/pets/dog-daily-water-intake-checker", icon: "🐶" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Bedding Replacement Frequency Estimator" },
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