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
      question: "How long is a cat's pregnancy?",
      answer: "Cat pregnancy lasts approximately 63-65 days from conception, though it can range from 58-70 days depending on the individual cat and breed.",
    },
    {
      question: "What date do I enter into the calculator?",
      answer: "Enter the date of mating or the first day your cat showed signs of estrus; the calculator will add 63-65 days to estimate the due date.",
    },
    {
      question: "Can I use this calculator if I don't know the exact mating date?",
      answer: "You can estimate based on when your cat entered heat; a veterinary ultrasound (days 10-20) provides the most accurate confirmation of pregnancy and due date.",
    },
    {
      question: "How many kittens will my cat have?",
      answer: "This calculator estimates due date only; litter size typically ranges from 2-8 kittens but varies by breed, age, and individual cat genetics.",
    },
    {
      question: "What should I do one week before the due date?",
      answer: "Prepare a clean, quiet nesting box, monitor for labor signs like restlessness and loss of appetite, and contact your vet if delivery doesn't begin within 24 hours of the due date.",
    },
    {
      question: "Is my cat pregnant if she's eating less?",
      answer: "Reduced appetite can indicate early pregnancy, but only a veterinary examination or ultrasound confirms pregnancy; appetite changes occur around weeks 3-4.",
    },
    {
      question: "What if kittens aren't born by the due date?",
      answer: "Contact your veterinarian immediately if labor hasn't started 24 hours after the due date, as this may indicate complications requiring medical intervention.",
    }
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

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Cat Pregnancy (Gestation) Due-Date Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator estimates your cat's due date by taking the mating date and adding the standard 63-65 day feline gestation period. It helps you prepare for labor and delivery by providing an expected timeframe for kitten arrival.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter the date your cat was bred or first showed estrus signs (heat). If unsure of the exact date, veterinary ultrasound between days 10-20 provides accurate pregnancy confirmation and more precise due-date estimation.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The calculator displays an estimated due date range; labor typically begins within 12-24 hours of this date. Monitor for labor signs like restlessness, panting, and loss of appetite starting one week before the due date, and contact your vet if delivery doesn't start within 24 hours.</p>
        </div>
      </section>

      {/* TABLE: Cat Pregnancy Timeline by Week */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Cat Pregnancy Timeline by Week</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Track physical and behavioral changes throughout your cat's gestation period.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Week</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Gestation Days</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Physical Changes</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Behavioral Signs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1-2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-14</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Minimal external changes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Possible increased affection or appetite</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3-4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-28</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Nipples enlarge and darken</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Nausea, reduced appetite, nesting behavior begins</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5-6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">29-42</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Visible abdominal enlargement</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Weight gain 1-2 lbs, increased lethargy</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">7-8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">43-56</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Kittens palpable in abdomen</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Restlessness, frequent grooming, seeking quiet spaces</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">9</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">57-65</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Obvious pregnancy, kitten movement visible</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Labor signs: loss of appetite, panting, nesting intensifies</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Timing varies by individual; veterinary ultrasound confirms pregnancy by day 14-21.</p>
      </section>

      {/* TABLE: Expected Litter Size by Cat Age and Breed */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Expected Litter Size by Cat Age and Breed</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Average kitten counts vary based on maternal age and breed type.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cat Age</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Average Litter Size</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Healthy Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Under 2 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-4 kittens</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">First pregnancies often smaller</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2-6 years (Prime)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-6 kittens</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Peak reproductive years, larger litters</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">7-10 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-5 kittens</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Gradually declining litter size</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Over 10 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3 kittens</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Fertility decreases significantly</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Large breeds (Maine Coon)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-8 kittens</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Larger cats typically have larger litters</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Small breeds (Siamese)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-5 kittens</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Smaller cats generally have fewer kittens</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Litter size depends on genetics, nutrition, health, and prior pregnancies.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Set a reminder 1-2 weeks before the due date to prepare a comfortable, quiet nesting box in a low-traffic area of your home.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Keep your veterinarian's emergency contact number handy in case your cat needs assistance during labor or shows signs of distress.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Document your cat's weight gain and behavioral changes throughout pregnancy to identify potential complications early.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Ensure your cat receives proper prenatal nutrition with increased calories and high-quality protein starting in week 6 of pregnancy.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using the wrong mating date</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Entering an incorrect date can shift the due date by weeks; confirm mating date from veterinary records or estrus observation notes.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming all pregnancies last exactly 63 days</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Normal feline gestation ranges 58-70 days; use the calculator's due date as an estimate, not an absolute cutoff for veterinary concern.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring pre-labor signs</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Restlessness, panting, and temperature drops occur 6-24 hours before labor; missing these signs may delay recognition of complications.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not preparing a nesting box in advance</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Pregnant cats may deliver in unsafe locations if no suitable nesting box is provided; set one up by week 7 of gestation.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How long is a cat's pregnancy?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Cat pregnancy lasts approximately 63-65 days from conception, though it can range from 58-70 days depending on the individual cat and breed.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What date do I enter into the calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Enter the date of mating or the first day your cat showed signs of estrus; the calculator will add 63-65 days to estimate the due date.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator if I don't know the exact mating date?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">You can estimate based on when your cat entered heat; a veterinary ultrasound (days 10-20) provides the most accurate confirmation of pregnancy and due date.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How many kittens will my cat have?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">This calculator estimates due date only; litter size typically ranges from 2-8 kittens but varies by breed, age, and individual cat genetics.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What should I do one week before the due date?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Prepare a clean, quiet nesting box, monitor for labor signs like restlessness and loss of appetite, and contact your vet if delivery doesn't begin within 24 hours of the due date.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Is my cat pregnant if she's eating less?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Reduced appetite can indicate early pregnancy, but only a veterinary examination or ultrasound confirms pregnancy; appetite changes occur around weeks 3-4.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What if kittens aren't born by the due date?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Contact your veterinarian immediately if labor hasn't started 24 hours after the due date, as this may indicate complications requiring medical intervention.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.aafponline.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">The Feline Reproduction Handbook</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">American Association of Feline Practitioners resource on cat pregnancy, labor, and postpartum care.</p>
          </li>
          <li>
            <a href="https://www.aspca.org/pet-care/cat-care/pregnancy-birth-and-kitten-care" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Cat Pregnancy and Birth Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">ASPCA guide covering pregnancy timeline, labor signs, and when to contact a veterinarian.</p>
          </li>
          <li>
            <a href="https://www.vin.com/members/cms/project/defaultadv1.aspx?id=3846651" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Feline Obstetrics and Neonatology</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Veterinary Information Network resource on cat pregnancy complications and emergency protocols.</p>
          </li>
          <li>
            <a href="https://www.humanesociety.org/resources/cats-heat-and-pregnancy" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Understanding Cat Heat Cycles and Pregnancy</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Humane Society guide on estrus cycles, mating signs, and accurate pregnancy dating methods.</p>
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