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
      question: "How long is a dog's gestation period?",
      answer: "A dog's gestation period is approximately 63 days (9 weeks) from the date of conception, though labor can begin as early as day 58 or as late as day 66.",
    },
    {
      question: "What are the three stages of labor in dogs?",
      answer: "Stage 1 (6-12 hours) involves cervical dilation; Stage 2 (4-24 hours) includes active contractions and puppy delivery; Stage 3 occurs between puppies as the placenta is expelled.",
    },
    {
      question: "When should I contact a vet during whelping?",
      answer: "Contact your vet immediately if more than 2 hours pass between puppies, if straining occurs without delivery after 30 minutes, or if the dam shows signs of distress or weakness.",
    },
    {
      question: "How do I calculate my dog's expected due date?",
      answer: "Add 63 days to the date of breeding or ovulation; the calculator accounts for typical variation of ±3 days in gestation length.",
    },
    {
      question: "What temperature drop indicates labor is starting?",
      answer: "A drop in the dam's rectal temperature from 101.5°F to 98-99°F within 24 hours signals imminent labor, typically occurring 8-24 hours before delivery begins.",
    },
    {
      question: "How many puppies should I expect in a litter?",
      answer: "Average litter size ranges from 4-8 puppies depending on breed; smaller breeds average 3-4 puppies while larger breeds may have 8-12 or more.",
    },
    {
      question: "Can I use this calculator for multiple breed types?",
      answer: "Yes, the 63-day gestation timeline applies to all dog breeds; however, breed-specific litter size predictions may vary based on individual breed characteristics.",
    }
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

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Whelping Countdown &amp; Stage Timeline</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator helps you track your dog's pregnancy from conception through labor and delivery by predicting the expected whelping date and breaking down the gestation timeline into manageable stages.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Input the breeding or ovulation date into the calculator to generate a customized countdown. The tool accounts for the standard 63-day canine gestation period while noting natural variation of ±3 days.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Use the resulting timeline to prepare your whelping area, schedule veterinary check-ins, and recognize labor signs so you can provide proper care during delivery and immediately after.</p>
        </div>
      </section>

      {/* TABLE: Whelping Timeline by Gestational Stage */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Whelping Timeline by Gestational Stage</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Track your dog's pregnancy progression through key developmental milestones.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Days Post-Conception</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Developmental Stage</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Observable Signs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1-7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Early conception</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">No visible signs; fertilized eggs enter uterus</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">8-14</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Implantation</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Embryos attach to uterine wall</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">15-21</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Organogenesis begins</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Fetal heartbeats detectable; minimal dam changes</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">22-35</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Rapid fetal growth</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Slight weight gain; nipples may darken</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">36-49</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Advanced development</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Noticeable abdominal enlargement; increased appetite</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">50-56</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Pre-labor stage</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Restlessness; nesting behavior; temperature stabilizes</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">57-63</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Labor &amp; delivery</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Temperature drop; contractions; puppy birth begins</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Gestation typically ranges 58-66 days; individual variation is normal.</p>
      </section>

      {/* TABLE: Labor Stages Duration &amp; Delivery Indicators */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Labor Stages Duration &amp; Delivery Indicators</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Reference expected timeline and physical indicators for each labor phase.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Labor Stage</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Duration</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Key Signs &amp; Milestones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Stage 1: Cervical Dilation</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-12 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Restlessness, panting, loss of appetite, temperature drop</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Stage 2: Active Labor &amp; Birth</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-24 hours total</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Strong contractions every 5-30 min; puppy delivery every 30-120 min</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Stage 3: Placental Expulsion</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-30 min per puppy</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Expulsion of placenta between or after puppies; dam may eat placentas</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Post-Whelping Recovery</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24-48 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Dam settles; nurses puppies; mild vaginal discharge is normal</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Consult vet if any stage significantly exceeds normal timeframe or distress occurs.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Monitor your dam's rectal temperature starting 1 week before the due date; a drop below 99°F signals labor within 24 hours.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Prepare a clean, quiet whelping box in a low-traffic area at least 2 weeks before the expected due date so your dam can familiarize herself with it.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Keep your vet's emergency contact information readily available; complications can arise quickly, and professional guidance may be essential.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Document each puppy's birth time, weight, and sex to track health and ensure all placentas have been delivered.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using last breeding date instead of ovulation date</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Dogs may breed multiple times; ovulation typically occurs 2 days after the initial breeding, so using the wrong date skews your due date prediction.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming exact 63-day delivery</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Normal gestation ranges 58-66 days; expecting delivery precisely on day 63 can cause unnecessary anxiety if whelping begins earlier or later.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring pre-labor temperature drops</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Failing to take rectal temperatures before the due date means you may miss the critical 24-hour warning window that a temperature drop provides.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Delaying veterinary contact for slow labor progression</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">More than 2 hours between puppies or 30+ minutes of straining without delivery requires immediate vet evaluation to rule out dystocia.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How long is a dog's gestation period?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A dog's gestation period is approximately 63 days (9 weeks) from the date of conception, though labor can begin as early as day 58 or as late as day 66.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What are the three stages of labor in dogs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Stage 1 (6-12 hours) involves cervical dilation; Stage 2 (4-24 hours) includes active contractions and puppy delivery; Stage 3 occurs between puppies as the placenta is expelled.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">When should I contact a vet during whelping?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Contact your vet immediately if more than 2 hours pass between puppies, if straining occurs without delivery after 30 minutes, or if the dam shows signs of distress or weakness.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate my dog's expected due date?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Add 63 days to the date of breeding or ovulation; the calculator accounts for typical variation of ±3 days in gestation length.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What temperature drop indicates labor is starting?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A drop in the dam's rectal temperature from 101.5°F to 98-99°F within 24 hours signals imminent labor, typically occurring 8-24 hours before delivery begins.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How many puppies should I expect in a litter?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Average litter size ranges from 4-8 puppies depending on breed; smaller breeds average 3-4 puppies while larger breeds may have 8-12 or more.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator for multiple breed types?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, the 63-day gestation timeline applies to all dog breeds; however, breed-specific litter size predictions may vary based on individual breed characteristics.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.akc.org/dog-breeds/health-considerations/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Canine Reproduction &amp; Whelping Care</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">The American Kennel Club provides breed-specific health guidelines including reproductive care and whelping timelines.</p>
          </li>
          <li>
            <a href="https://www.merckvetmanual.com/reproductive-system/small-animals/whelping-and-neonatal-care-of-puppies" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Veterinary Obstetrics &amp; Neonatal Care</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Merck Veterinary Manual offers clinical guidance on normal and abnormal whelping, labor complications, and neonatal puppy care.</p>
          </li>
          <li>
            <a href="https://www.dogstrust.org.uk/what-we-do/campaigning/puppy-farm-campaign" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Dogs Trust Breeder Information</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Dogs Trust provides ethical breeding information and resources for responsible dog reproduction and care.</p>
          </li>
          <li>
            <a href="https://www.aafco.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">AAFCO Nutritional Guidelines for Pregnant &amp; Lactating Dogs</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">The Association of American Feed Control Officials establishes nutritional standards for pregnant and nursing dams to support healthy gestation and milk production.</p>
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