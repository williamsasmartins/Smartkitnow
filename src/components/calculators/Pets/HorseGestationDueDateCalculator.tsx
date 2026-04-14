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
      question: "What is the average gestation period for horses?",
      answer: "The average horse gestation period is approximately 330-345 days, with 340 days being the typical standard. Mares can deliver healthy foals anywhere within the 320-365 day range.",
    },
    {
      question: "How accurate is the Horse Gestation Calculator?",
      answer: "The calculator provides an estimated due date based on the average 340-day gestation period. Actual delivery dates may vary by 10-14 days, so it's best used as a general guide alongside veterinary monitoring.",
    },
    {
      question: "What information do I need to use this calculator?",
      answer: "You need the date your mare was bred or inseminated. If you don't know the exact date, your veterinarian can perform an ultrasound to estimate conception date within a few days of accuracy.",
    },
    {
      question: "Can I calculate gestation for artificially inseminated mares?",
      answer: "Yes, the calculator works for both naturally bred and artificially inseminated mares. Use the date of insemination or breeding for the most accurate due date estimation.",
    },
    {
      question: "Why do some mares carry foals longer than 345 days?",
      answer: "Variations in gestation length are normal and influenced by genetics, foal sex, mare age, and breed. Male foals typically gestate 2-6 days longer than female foals.",
    },
    {
      question: "Should I rely solely on the calculator for foaling preparations?",
      answer: "No, combine the calculator results with veterinary ultrasounds and physical signs like udder development and relaxation of pelvic ligaments for a comprehensive foaling timeline.",
    },
    {
      question: "How does breed affect horse gestation length?",
      answer: "Different breeds have slight variations, with draft horses sometimes carrying foals 3-5 days longer than lighter breeds, though 330-345 days remains the general standard across most breeds.",
    }
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
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Horse Gestation (Due Date) Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Horse Gestation Calculator estimates your mare's foaling date based on the standard 340-day equine gestation period. Simply enter the breeding or insemination date to generate a predicted due date and key timeline milestones.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The calculator requires only the date your mare was bred or artificially inseminated. If the exact date is uncertain, work with your veterinarian to perform an ultrasound, which can pinpoint conception within 3-5 days of accuracy during early pregnancy.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The resulting due date is an estimate with a typical variation range of plus or minus 10-14 days. Use this information to schedule veterinary check-ups, prepare foaling facilities, and monitor physical signs of approaching labor rather than relying solely on the calculated date.</p>
        </div>
      </section>

      {/* TABLE: Horse Gestation Timeline by Days */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Horse Gestation Timeline by Days</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows key developmental milestones during a horse's pregnancy from conception to birth.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Days Post-Conception</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Gestation Stage</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Key Development</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1-14</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Early Embryonic</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Embryo enters uterus and begins attachment</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">15-30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Organogenesis</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Major organ systems forming</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">60-90</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Fetal Development</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Sex organs differentiate, fetal movement begins</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">180</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Mid-Pregnancy</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Fetus reaches approximately 50% of birth weight</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">270-300</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Late Gestation</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Rapid weight gain, fetal positioning for birth</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">320-365</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Expected Delivery Range</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Normal foaling window with 340 days average</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Variations occur based on mare age, breed, foal sex, and environmental factors.</p>
      </section>

      {/* TABLE: Pre-Foaling Signs and Timeline */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Pre-Foaling Signs and Timeline</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Recognize these physical indicators that foaling is approaching within the final weeks of gestation.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Sign</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Timeline Before Foaling</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Severity Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Udder development and filling</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-6 weeks prior</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Relaxation of pelvic ligaments</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-4 weeks prior</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Waxing of teats</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24-48 hours prior</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Milk dripping or streaming</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-24 hours prior</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Restlessness and sweating</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-12 hours prior</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Critical</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Lying down and rising repeatedly</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-4 hours prior</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Critical</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Monitor your mare closely when multiple signs appear simultaneously.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Record the exact breeding date immediately to ensure calculator accuracy and reliable foaling predictions.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Schedule ultrasounds at 14-16 days and 30 days post-breeding to confirm pregnancy and refine your due date estimate.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Monitor udder development and waxing of teats during the final 2-4 weeks as these are more reliable indicators than the calculated date alone.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Keep your veterinarian's contact information readily available during the expected foaling window in case complications arise during labor.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Estimated Breeding Date</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Entering an approximate or guessed breeding date significantly reduces calculator accuracy; always verify the exact date with breeding records or veterinary documentation.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Breed and Individual Variations</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Assuming all mares follow the exact 340-day average overlooks that individual mares may gestate 10-25 days longer or shorter based on genetics and breed.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Neglecting Veterinary Ultrasounds</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Relying solely on the calculator without ultrasound confirmation can miss pregnancy complications, twins, or misdiagnosis of conception date.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Missing Pre-Foaling Physical Signs</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Focusing only on the calculator date while ignoring udder development and ligament relaxation may cause you to miss impending labor by several days.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the average gestation period for horses?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The average horse gestation period is approximately 330-345 days, with 340 days being the typical standard. Mares can deliver healthy foals anywhere within the 320-365 day range.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How accurate is the Horse Gestation Calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator provides an estimated due date based on the average 340-day gestation period. Actual delivery dates may vary by 10-14 days, so it's best used as a general guide alongside veterinary monitoring.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What information do I need to use this calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">You need the date your mare was bred or inseminated. If you don't know the exact date, your veterinarian can perform an ultrasound to estimate conception date within a few days of accuracy.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I calculate gestation for artificially inseminated mares?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, the calculator works for both naturally bred and artificially inseminated mares. Use the date of insemination or breeding for the most accurate due date estimation.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why do some mares carry foals longer than 345 days?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Variations in gestation length are normal and influenced by genetics, foal sex, mare age, and breed. Male foals typically gestate 2-6 days longer than female foals.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I rely solely on the calculator for foaling preparations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">No, combine the calculator results with veterinary ultrasounds and physical signs like udder development and relaxation of pelvic ligaments for a comprehensive foaling timeline.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does breed affect horse gestation length?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Different breeds have slight variations, with draft horses sometimes carrying foals 3-5 days longer than lighter breeds, though 330-345 days remains the general standard across most breeds.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.vetmed.ucdavis.edu/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Equine Reproduction - UC Davis Veterinary Medicine</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Authoritative resource on horse reproduction, gestation periods, and foaling management from a leading veterinary institution.</p>
          </li>
          <li>
            <a href="https://aaep.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Association of Equine Practitioners (AAEP)</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Professional organization providing guidelines on equine reproduction, pregnancy monitoring, and pre-foaling care standards.</p>
          </li>
          <li>
            <a href="https://www.thehorse.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">The Horse - Foaling and Neonatal Foal Care</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive articles on mare gestation, foaling timelines, physical signs of labor, and newborn foal health management.</p>
          </li>
          <li>
            <a href="https://www.merckvetmanual.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Merck Veterinary Manual - Equine Reproduction</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Clinical reference detailing normal gestation length, pregnancy complications, and management of pregnant mares.</p>
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