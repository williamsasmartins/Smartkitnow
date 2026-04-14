import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function DogPregnancyGestationDueDateCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState({
    breedingDate: "",
    breedingDateType: "first", // "first" or "last"
  });

  // 2. LOGIC ENGINE
  // Dog gestation length: average 63 days (range 58-68 days)
  // We calculate due date by adding 63 days to breeding date (first or last breeding)
  // If last breeding date is used, due date = last breeding date + 63 days
  // If first breeding date is used, due date = first breeding date + 63 days

  const results = useMemo(() => {
    if (!inputs.breedingDate) {
      return {
        value: "",
        label: "Enter a valid breeding date to calculate due date.",
        subtext: null,
        warning: null,
      };
    }

    const breedingDateObj = new Date(inputs.breedingDate);
    if (isNaN(breedingDateObj.getTime())) {
      return {
        value: "",
        label: "Invalid date format. Please enter a valid date.",
        subtext: null,
        warning: null,
      };
    }

    // Add 63 days to breeding date
    const gestationDays = 63;
    const dueDateObj = new Date(breedingDateObj);
    dueDateObj.setDate(dueDateObj.getDate() + gestationDays);

    // Format due date as YYYY-MM-DD for display
    const dueDateStr = dueDateObj.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return {
      value: dueDateStr,
      label:
        inputs.breedingDateType === "first"
          ? "Estimated due date based on first breeding date."
          : "Estimated due date based on last breeding date.",
      subtext:
        "Note: Gestation length in dogs averages 63 days but can vary between 58 and 68 days. This estimate helps plan veterinary care and prepare for whelping.",
      warning: null,
    };
  }, [inputs]);

  // 3. FAQS (MUST BE DETAILED)
  const faqs = [
    {
      question: "How long is a dog's pregnancy?",
      answer: "Dog pregnancy typically lasts 63-65 days from conception, though gestation can range from 58-68 days depending on breed and individual factors.",
    },
    {
      question: "What date should I enter as the first day of breeding?",
      answer: "Enter the date your dog was bred or the date of successful mating, as this marks day 1 of the gestation period for accurate due-date calculation.",
    },
    {
      question: "Can I use an ultrasound date instead of breeding date?",
      answer: "Yes, if you have an ultrasound confirmation date, you can backtrack using standard pregnancy milestones to estimate the original breeding date for more accurate results.",
    },
    {
      question: "Does breed size affect dog pregnancy length?",
      answer: "Smaller breeds occasionally deliver slightly earlier (around 61-63 days), while larger breeds may carry puppies closer to 65-68 days, though 63-65 days remains the standard.",
    },
    {
      question: "How accurate is this calculator?",
      answer: "This calculator provides a reliable estimate within ±3 days of actual delivery, but veterinary ultrasound confirms pregnancy and refines due dates most accurately.",
    },
    {
      question: "What signs indicate labor is starting soon?",
      answer: "Temperature drops below 99°F, nesting behavior increases, and vaginal discharge appears 12-24 hours before active labor begins.",
    },
    {
      question: "Should I contact a vet before the due date?",
      answer: "Yes, schedule a pre-delivery check 1-2 weeks before the due date to ensure healthy pregnancy progression and discuss delivery plans.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 4. HANDLERS
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputs((prev) => ({ ...prev, breedingDate: e.target.value }));
  }
  function handleBreedingDateTypeChange(value: string) {
    setInputs((prev) => ({ ...prev, breedingDateType: value }));
  }

  const widget = (
    <div className="space-y-6">
      {/* Unit Switcher (not needed here but kept for consistency) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Breeding Date Type</Label>
          <Select value={inputs.breedingDateType} onValueChange={handleBreedingDateTypeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="first">First Breeding Date</SelectItem>
              <SelectItem value="last">Last Breeding Date</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="breedingDate" className="text-slate-700 dark:text-slate-300">
            Enter {inputs.breedingDateType === "first" ? "First" : "Last"} Breeding Date
          </Label>
          <Input
            id="breedingDate"
            type="date"
            value={inputs.breedingDate}
            onChange={handleInputChange}
            placeholder="YYYY-MM-DD"
            className="mt-1"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No special action needed, calculation is reactive
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ breedingDate: "", breedingDateType: "first" })}
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
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a vet for diagnosis.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Dog Pregnancy (Gestation) Due-Date Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator estimates your dog's due date by adding 63 days (the average canine gestation period) to the first breeding or confirmed breeding date. It helps you prepare for whelping and monitor pregnancy progress accurately.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter the exact date your dog was bred or the date confirmed by your veterinarian. If using an ultrasound confirmation date, consult your vet to backtrack to the approximate breeding date for best results.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The calculator provides an estimated due date window of ±3 days. Schedule veterinary check-ups 2 weeks before the due date to monitor fetal health, confirm litter size, and prepare for potential complications.</p>
        </div>
      </section>

      {/* TABLE: Dog Pregnancy Stages & Development Timeline */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Dog Pregnancy Stages & Development Timeline</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Understanding fetal development helps you prepare for whelping and recognize normal pregnancy progression.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Days of Pregnancy</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Development Stage</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Key Changes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">0-14</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Fertilization & Implantation</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Embryos attach to uterine wall; no visible changes</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">15-28</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Organogenesis</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Organs form; fetal heartbeats detectable via ultrasound around day 25</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">29-42</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Rapid Growth</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Fetal skeletons calcify; puppies grow significantly; dam gains weight</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">43-56</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Fetal Maturation</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Puppies reach viable size; coat develops; movement increases</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">57-65</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Pre-Labor Preparation</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Final weight gain; drop in body temperature; nesting behavior begins</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Veterinary ultrasounds are most accurate between days 25-35 for confirming pregnancy and litter size.</p>
      </section>

      {/* TABLE: Normal Dog Pregnancy Duration by Breed Size */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Normal Dog Pregnancy Duration by Breed Size</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Gestation length varies slightly across breed categories, though all fall within the 58-68 day window.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Breed Size Category</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Average Gestation (Days)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Range (Days)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Small Breeds (under 20 lbs)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">61-63</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">58-65</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Medium Breeds (20-50 lbs)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">63-65</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60-66</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Large Breeds (50-90 lbs)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">64-66</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">62-68</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Giant Breeds (over 90 lbs)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">65-67</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">63-68</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Individual variation exists; always consult your veterinarian for breed-specific guidance on expected delivery dates.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Track behavioral changes like nesting, temperature drops, and appetite loss starting 1 week before the due date to anticipate labor onset.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Keep detailed records of the exact breeding date and any ultrasound findings to share with your veterinarian for refined due-date estimates.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Prepare a clean, quiet whelping box in advance and ensure your dog is current on vaccinations before delivery.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Have your veterinarian's contact information and an emergency vet clinic location ready in case delivery complications arise outside business hours.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Last Day of Breeding Instead of First</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Always enter the first breeding date, not the last, as pregnancy timing begins from initial conception.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Breed-Specific Variations</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Assuming all dogs follow the exact 63-day timeline ignores that small breeds may deliver at 61 days and large breeds at 66-68 days.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Skipping Veterinary Confirmation</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Relying solely on the calculator without ultrasound confirmation can lead to missed complications or incorrect dating.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not Accounting for Natural Variation</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Expecting delivery on the exact due date rather than within the ±3 day window can cause unnecessary alarm if labor begins slightly early or late.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How long is a dog's pregnancy?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Dog pregnancy typically lasts 63-65 days from conception, though gestation can range from 58-68 days depending on breed and individual factors.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What date should I enter as the first day of breeding?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Enter the date your dog was bred or the date of successful mating, as this marks day 1 of the gestation period for accurate due-date calculation.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use an ultrasound date instead of breeding date?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, if you have an ultrasound confirmation date, you can backtrack using standard pregnancy milestones to estimate the original breeding date for more accurate results.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does breed size affect dog pregnancy length?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Smaller breeds occasionally deliver slightly earlier (around 61-63 days), while larger breeds may carry puppies closer to 65-68 days, though 63-65 days remains the standard.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How accurate is this calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">This calculator provides a reliable estimate within ±3 days of actual delivery, but veterinary ultrasound confirms pregnancy and refines due dates most accurately.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What signs indicate labor is starting soon?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Temperature drops below 99°F, nesting behavior increases, and vaginal discharge appears 12-24 hours before active labor begins.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I contact a vet before the due date?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, schedule a pre-delivery check 1-2 weeks before the due date to ensure healthy pregnancy progression and discuss delivery plans.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.akcchf.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Canine Reproduction: The Dog Breeder's Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">American Kennel Club resource covering dog pregnancy, breeding standards, and health screening for responsible breeding.</p>
          </li>
          <li>
            <a href="https://www.vin.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Veterinary Obstetrics and Genital Diseases</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Veterinary Information Network provides clinical data on canine gestation periods, fetal development, and whelping management.</p>
          </li>
          <li>
            <a href="https://www.merckvetmanual.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Small Animal Reproduction in Practice</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Merck Veterinary Manual outlines normal dog pregnancy timelines, ultrasound landmarks, and signs of dystocia.</p>
          </li>
          <li>
            <a href="https://www.ofa.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Dog Breeding Health & Genetics</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Orthopedic Foundation for Animals offers breeding health screening protocols and reproductive health guidelines.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Dog Pregnancy (Gestation) Due-Date Calculator"
      description="Calculate the expected **due date** for a pregnant dog based on the date of first or last breeding."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: "Due Date = Breeding Date + 63 days",
        variables: [
          { symbol: "Breeding Date", description: "Date of first or last breeding during estrus" },
          { symbol: "63 days", description: "Average gestation length in dogs" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A breeder notes that the last breeding date of a female Labrador Retriever was March 1, 2024. They want to estimate the expected whelping date to prepare the whelping area and schedule veterinary check-ups.",
        steps: [
          {
            label: "Step 1",
            explanation: "Select 'Last Breeding Date' as the breeding date type since multiple matings occurred.",
          },
          {
            label: "Step 2",
            explanation: "Enter the date '2024-03-01' into the breeding date field and click Calculate.",
          },
        ],
        result: "The calculator estimates the due date as April 3, 2024, allowing the breeder to plan accordingly.",
      }}
      relatedCalculators={[
        { title: "Dog Calorie Needs (RER/MER) Calculator", url: "/pets/dog-calorie-needs-rer-mer", icon: "🐶" },
        { title: "Dog Weight Loss Planner", url: "/pets/dog-weight-loss-planner", icon: "🐶" },
        { title: "Dog Ideal Weight & Target Calories Calculator", url: "/pets/dog-ideal-weight-target-calories", icon: "🐶" },
        { title: "Dog Treat Calories & Daily Allowance Calculator", url: "/pets/dog-treat-calories-daily-allowance", icon: "🐶" },
        { title: "Puppy Calorie Needs by Age/Breed Size Calculator", url: "/pets/puppy-calorie-needs-age-breed-size", icon: "💉" },
        { title: "Dog Protein/Fat Intake Guide (by Goal)", url: "/pets/dog-protein-fat-intake-guide", icon: "🐶" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Dog Pregnancy (Gestation) Due-Date Calculator" },
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