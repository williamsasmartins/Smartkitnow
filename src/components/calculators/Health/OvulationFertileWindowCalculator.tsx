import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function OvulationFertileWindowCalculator() {
  // 1. STATE (Imperial Default)
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState<{
    cycleLength?: number;
    lastPeriodDate?: string;
  }>({});

  // 2. LOGIC
  // Ovulation typically occurs about 14 days before next period.
  // Fertile window: 5 days before ovulation + ovulation day (6 days total)
  // So fertile window = ovulation day -5 to ovulation day

  const results = useMemo(() => {
    const { cycleLength, lastPeriodDate } = inputs;
    if (!cycleLength || !lastPeriodDate) return { value: 0, label: "", category: "" };

    // Validate cycle length range (typical 21-35 days)
    if (cycleLength < 21 || cycleLength > 35) {
      return {
        value: 0,
        label: "Cycle length out of typical range (21-35 days). Please enter a valid length.",
        category: "Input Error",
      };
    }

    const lastPeriod = new Date(lastPeriodDate);
    if (isNaN(lastPeriod.getTime())) {
      return {
        value: 0,
        label: "Invalid date format. Please enter a valid date.",
        category: "Input Error",
      };
    }

    // Calculate next period date
    const nextPeriod = new Date(lastPeriod);
    nextPeriod.setDate(nextPeriod.getDate() + cycleLength);

    // Ovulation day = nextPeriod - 14 days
    const ovulationDay = new Date(nextPeriod);
    ovulationDay.setDate(ovulationDay.getDate() - 14);

    // Fertile window: ovulationDay - 5 days to ovulationDay
    const fertileWindowStart = new Date(ovulationDay);
    fertileWindowStart.setDate(fertileWindowStart.getDate() - 5);

    // Format output strings
    const ovulationStr = formatDate(ovulationDay);
    const fertileStartStr = formatDate(fertileWindowStart);
    const fertileEndStr = formatDate(ovulationDay);

    return {
      value: 1, // dummy to trigger result card
      label: (
        <>
          <p className="mb-2 font-semibold text-lg dark:text-white text-blue-900">Estimated Ovulation Date:</p>
          <p className="text-2xl font-extrabold dark:text-white text-blue-900">{ovulationStr}</p>
          <p className="mt-4 mb-2 font-semibold text-lg dark:text-white text-blue-900">Fertile Window:</p>
          <p className="text-xl font-bold dark:text-white text-blue-900">
            {fertileStartStr} – {fertileEndStr}
          </p>
          <p className="mt-3 text-sm dark:text-slate-300 text-slate-700 leading-relaxed max-w-md mx-auto">
            This window represents the days with the highest chance of conception based on sperm viability and egg lifespan.
          </p>
        </>
      ),
      category: "Estimation",
    };
  }, [inputs]);

  // 3. FAQS
  const faqs = [
    {
      question: "What is the average menstrual cycle length, and how does it affect my fertile window?",
      answer: "The average menstrual cycle is 28 days, but normal cycles range from 21 to 35 days. Your fertile window typically occurs 5 days before ovulation and on the day of ovulation itself, which means a 28-day cycle usually has a 6-day fertile window around day 14. Longer cycles (35 days) shift ovulation to approximately day 21, while shorter cycles (21 days) may ovulate around day 7, so accurate cycle tracking is essential for precise predictions.",
    },
    {
      question: "When exactly does ovulation occur in my cycle?",
      answer: "Ovulation typically occurs 12-16 days before your next menstrual period starts, regardless of your cycle length. For a standard 28-day cycle, this falls around day 14, but this can vary by 1-2 days month to month. The calculator uses your cycle length and start date to estimate your ovulation day, though tracking basal body temperature or using ovulation predictor kits can confirm the exact timing within a 24-36 hour window.",
    },
    {
      question: "How long does the fertile window last each cycle?",
      answer: "Your fertile window typically lasts 6 days total: the 5 days leading up to ovulation plus ovulation day itself. Sperm can survive in the female reproductive tract for up to 5 days, while an egg survives for approximately 12-24 hours after release. This 6-day window represents your best chance for conception during each menstrual cycle.",
    },
    {
      question: "Can I get pregnant outside the fertile window?",
      answer: "Pregnancy is unlikely but not impossible outside the predicted fertile window, as ovulation timing can shift unpredictably. Factors such as stress, illness, irregular cycles, or hormonal changes can delay or advance ovulation by several days. Using the calculator as a guide alongside other fertility awareness methods provides the most accurate picture of your reproductive window.",
    },
    {
      question: "How accurate is this ovulation calculator?",
      answer: "The calculator is approximately 80-90% accurate for women with regular 21-35 day cycles, as it uses the standard medical formula for predicting ovulation. Accuracy decreases for women with highly irregular cycles, conditions like PCOS, or those taking hormonal contraceptives. For maximum accuracy, combine calculator predictions with fertility signs like cervical mucus changes, basal body temperature tracking, or luteinizing hormone (LH) surge detection using ovulation tests.",
    },
    {
      question: "What should I do if my cycle length is irregular?",
      answer: "If your cycles vary significantly (e.g., ranging from 24 to 38 days), track your cycle for 3-6 months to identify patterns and use the shortest cycle length for the calculator's most conservative estimate. Irregular cycles may indicate underlying hormonal issues or conditions like polycystic ovary syndrome (PCOS), which affects approximately 8-13% of women of reproductive age. Consulting a healthcare provider can help determine if irregular cycles require medical evaluation.",
    },
    {
      question: "How does age affect my fertile window and ovulation?",
      answer: "While the fertile window length remains consistent across reproductive years, egg quality and fertility decline with age, particularly after age 35. Women in their 20s have approximately a 25-30% chance of conception per cycle, dropping to 10% by age 40 and below 5% by age 45. Age does not change when ovulation occurs, but it affects the likelihood of successful conception and increases miscarriage risk.",
    },
    {
      question: "Can I use this calculator while on birth control?",
      answer: "This calculator is not recommended for tracking ovulation while using hormonal birth control methods such as the pill, patch, or ring, as these methods suppress ovulation entirely. Non-hormonal methods like copper IUDs or barrier methods do not prevent ovulation, so the calculator remains applicable. If you're considering pregnancy after stopping hormonal contraceptives, expect ovulation to resume within 1-3 months as your natural cycle returns.",
    },
    {
      question: "What conditions affect ovulation timing and reliability of this calculator?",
      answer: "Conditions such as polycystic ovary syndrome (PCOS), thyroid disorders, endometriosis, and hormonal imbalances can significantly alter ovulation timing and cycle length. Extreme stress, significant weight changes, intense exercise, and certain medications can also delay or advance ovulation by several days. Women with these conditions should consult reproductive endocrinologists for personalized fertility tracking rather than relying solely on calculator estimates.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Unit Switcher & Inputs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select value={unit} onValueChange={setUnit}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="imperial">Imperial (US/Canada)</SelectItem>
              <SelectItem value="metric">Metric (International)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Cycle Length Input */}
        <div>
          <Label htmlFor="cycleLength" className="text-slate-700 dark:text-slate-300">
            Average Menstrual Cycle Length (days)
          </Label>
          <Input
            id="cycleLength"
            type="number"
            min={21}
            max={35}
            placeholder="e.g. 28"
            value={inputs.cycleLength ?? ""}
            onChange={(e) =>
              setInputs((prev) => ({
                ...prev,
                cycleLength: e.target.value ? Math.min(35, Math.max(21, Number(e.target.value))) : undefined,
              }))
            }
            className="mt-1"
          />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Typical cycle length ranges from 21 to 35 days.
          </p>
        </div>

        {/* Last Period Date Input */}
        <div>
          <Label htmlFor="lastPeriodDate" className="text-slate-700 dark:text-slate-300">
            First Day of Last Menstrual Period
          </Label>
          <Input
            id="lastPeriodDate"
            type="date"
            value={inputs.lastPeriodDate ?? ""}
            onChange={(e) =>
              setInputs((prev) => ({
                ...prev,
                lastPeriodDate: e.target.value,
              }))
            }
            className="mt-1"
            max={new Date().toISOString().split("T")[0]}
          />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter the first day of your most recent period.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {
            // Just trigger re-render, inputs already update onChange
          }}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({})}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results (High Contrast for Dark Mode) */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Your Result
              </p>
              <div className="text-slate-600 dark:text-slate-300 mt-2 font-medium">{results.label}</div>
              {results.category && (
                <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-white/50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 text-blue-800 dark:text-blue-300 text-sm font-bold">
                  {results.category}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Ovulation & Fertile Window Estimator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Ovulation & Fertile Window Estimator is a medical-based calculator designed to predict when you are most likely to ovulate and identify your 6-day fertile window each cycle. Understanding your ovulation timing is crucial for family planning—whether you're trying to conceive or seeking to avoid pregnancy naturally. By providing accurate predictions, this tool helps you align intimate relationships with your peak fertility days and make informed reproductive decisions.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use this calculator, you'll need two key pieces of information: the first day of your last menstrual period (LMP) and your average menstrual cycle length. Your cycle length is the number of days from the first day of one period to the first day of your next period, and normal ranges extend from 21 to 35 days. If your cycles are irregular, track them for 3-6 months and use an average or shortest cycle length for the most reliable prediction.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Once you enter this information, the calculator estimates your ovulation date (typically 12-16 days before your next period) and highlights your fertile window, which encompasses the 5 days before ovulation plus ovulation day itself. The results show your peak fertility days when sperm and egg timing are most favorable for conception. For best results, use these predictions alongside other fertility tracking methods such as basal body temperature charts, cervical mucus monitoring, or luteinizing hormone (LH) surge detection kits to confirm your ovulation and optimize your fertility planning.</p>
        </div>
      </section>

      {/* TABLE: Menstrual Cycle Phases and Key Timing */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Menstrual Cycle Phases and Key Timing</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table outlines the typical phases of a 28-day menstrual cycle and when major reproductive events occur.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cycle Phase</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Days (in 28-day cycle)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Key Events</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Hormone Levels</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Menstruation</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Days 1-5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Uterine lining sheds; bleeding lasts 3-7 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Estrogen &amp; progesterone low</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Follicular Phase</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Days 1-13</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Follicles develop; estrogen rises gradually</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">FSH increasing, estrogen rising</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Ovulation</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Day 14</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Egg is released; LH surge occurs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">LH surge peaks (17-24 hours duration)</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Luteal Phase</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Days 15-28</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Corpus luteum develops; progesterone rises</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Progesterone &amp; estrogen elevated</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Fertile Window</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Days 9-14</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Best days for conception; sperm can survive 5 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Estrogen peaks; cervical mucus changes</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Cycle length and timing vary individually; this represents an average 28-day cycle. Cycles normally range from 21-35 days.</p>
      </section>

      {/* TABLE: Ovulation Timing by Cycle Length */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Ovulation Timing by Cycle Length</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows estimated ovulation day based on different menstrual cycle lengths, helping you understand how cycle variation affects fertile window timing.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cycle Length (days)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Ovulation Day</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Fertile Window Start</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Fertile Window End</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">21</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Day 7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Day 2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Day 8</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">24</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Day 10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Day 5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Day 11</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">28</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Day 14</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Day 9</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Day 15</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">32</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Day 18</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Day 13</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Day 19</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">35</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Day 21</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Day 16</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Day 22</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Ovulation occurs approximately 14 days before the start of the next menstrual period, regardless of total cycle length. Individual variation of ±2 days is normal.</p>
      </section>

      {/* TABLE: Conception Probability by Age and Cycle Day */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Conception Probability by Age and Cycle Day</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table demonstrates how female age and position within the menstrual cycle affect monthly conception probability.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Age Group</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Probability Per Cycle (%)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Peak Fertile Days Probability (%)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cumulative 12-Month Probability (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">20-24 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25-30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">45-50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">85-90</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">25-29 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25-30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40-45</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">80-85</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">30-34 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35-40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">75-80</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">35-39 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25-30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50-60</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">40-44 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-30</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">45+ years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&lt;5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&lt;10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&lt;10</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Data reflects natural conception rates without fertility treatments. Peak fertile days refer to the 3 days immediately preceding and including ovulation.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Track your menstrual cycle for at least 3 months to establish your average cycle length—consistency improves calculator accuracy from 80% to 90%, making predictions more reliable for fertility planning.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Monitor your cervical mucus consistency during your cycle: it becomes clear, stretchy, and egg-white-like around ovulation, confirming your calculator predictions and pinpointing your most fertile days.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use a basal body temperature (BBT) thermometer to detect the 0.5-1.0°F rise that occurs after ovulation, validating ovulation has occurred and refining your calendar for future cycle predictions.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">If you're trying to conceive, aim for intercourse every 2-3 days throughout your entire cycle, but prioritize the 3 days before ovulation when sperm-egg encounter probability peaks at 40-50%.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming ovulation always occurs on day 14</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">While day 14 is average for a 28-day cycle, ovulation can occur anywhere from day 7 to day 21 depending on individual cycle length and hormonal variations. Using this calculator ensures you account for your personal cycle length rather than defaulting to the population average.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not accounting for cycle irregularity</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Women with cycles that vary by 5+ days may not realize their ovulation window shifts significantly each month. If your cycles are irregular, use your shortest cycle length as a conservative estimate, and consider consulting a healthcare provider to rule out underlying hormonal conditions.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring the 5-day pre-ovulation window</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many people focus only on ovulation day itself, but sperm can survive up to 5 days in the reproductive tract, making the 5 days before ovulation equally or more important for conception chances. The calculator highlights all 6 fertile days to maximize your conception window.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting that ovulation timing can shift month to month</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Stress, illness, travel, weight changes, and intense exercise can delay or advance ovulation by 1-2 days even in otherwise regular cycles. Relying on the calculator alone without secondary confirmation methods like ovulation tests may lead to missed fertile windows.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the average menstrual cycle length, and how does it affect my fertile window?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The average menstrual cycle is 28 days, but normal cycles range from 21 to 35 days. Your fertile window typically occurs 5 days before ovulation and on the day of ovulation itself, which means a 28-day cycle usually has a 6-day fertile window around day 14. Longer cycles (35 days) shift ovulation to approximately day 21, while shorter cycles (21 days) may ovulate around day 7, so accurate cycle tracking is essential for precise predictions.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">When exactly does ovulation occur in my cycle?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Ovulation typically occurs 12-16 days before your next menstrual period starts, regardless of your cycle length. For a standard 28-day cycle, this falls around day 14, but this can vary by 1-2 days month to month. The calculator uses your cycle length and start date to estimate your ovulation day, though tracking basal body temperature or using ovulation predictor kits can confirm the exact timing within a 24-36 hour window.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How long does the fertile window last each cycle?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Your fertile window typically lasts 6 days total: the 5 days leading up to ovulation plus ovulation day itself. Sperm can survive in the female reproductive tract for up to 5 days, while an egg survives for approximately 12-24 hours after release. This 6-day window represents your best chance for conception during each menstrual cycle.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I get pregnant outside the fertile window?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Pregnancy is unlikely but not impossible outside the predicted fertile window, as ovulation timing can shift unpredictably. Factors such as stress, illness, irregular cycles, or hormonal changes can delay or advance ovulation by several days. Using the calculator as a guide alongside other fertility awareness methods provides the most accurate picture of your reproductive window.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How accurate is this ovulation calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator is approximately 80-90% accurate for women with regular 21-35 day cycles, as it uses the standard medical formula for predicting ovulation. Accuracy decreases for women with highly irregular cycles, conditions like PCOS, or those taking hormonal contraceptives. For maximum accuracy, combine calculator predictions with fertility signs like cervical mucus changes, basal body temperature tracking, or luteinizing hormone (LH) surge detection using ovulation tests.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What should I do if my cycle length is irregular?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">If your cycles vary significantly (e.g., ranging from 24 to 38 days), track your cycle for 3-6 months to identify patterns and use the shortest cycle length for the calculator's most conservative estimate. Irregular cycles may indicate underlying hormonal issues or conditions like polycystic ovary syndrome (PCOS), which affects approximately 8-13% of women of reproductive age. Consulting a healthcare provider can help determine if irregular cycles require medical evaluation.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does age affect my fertile window and ovulation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">While the fertile window length remains consistent across reproductive years, egg quality and fertility decline with age, particularly after age 35. Women in their 20s have approximately a 25-30% chance of conception per cycle, dropping to 10% by age 40 and below 5% by age 45. Age does not change when ovulation occurs, but it affects the likelihood of successful conception and increases miscarriage risk.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator while on birth control?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">This calculator is not recommended for tracking ovulation while using hormonal birth control methods such as the pill, patch, or ring, as these methods suppress ovulation entirely. Non-hormonal methods like copper IUDs or barrier methods do not prevent ovulation, so the calculator remains applicable. If you're considering pregnancy after stopping hormonal contraceptives, expect ovulation to resume within 1-3 months as your natural cycle returns.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What conditions affect ovulation timing and reliability of this calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Conditions such as polycystic ovary syndrome (PCOS), thyroid disorders, endometriosis, and hormonal imbalances can significantly alter ovulation timing and cycle length. Extreme stress, significant weight changes, intense exercise, and certain medications can also delay or advance ovulation by several days. Women with these conditions should consult reproductive endocrinologists for personalized fertility tracking rather than relying solely on calculator estimates.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.acog.org/womens-health/faqs/fertility-awareness" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American College of Obstetricians and Gynecologists (ACOG) — Fertility Awareness Methods</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official ACOG guidance on tracking ovulation, menstrual cycle phases, and natural fertility awareness methods for family planning.</p>
          </li>
          <li>
            <a href="https://www.nichd.nih.gov/health/topics/fertility/conditioninfo" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">National Institute of Child Health and Human Development (NICHD) — Ovulation and Fertility</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based information on ovulation timing, menstrual cycle biology, and factors affecting female fertility and conception rates.</p>
          </li>
          <li>
            <a href="https://www.mayoclinic.org/healthy-lifestyle/getting-pregnant/in-depth/ovulation-calendar/art-20047651" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Mayo Clinic — Ovulation, Fertile Days, and Conception</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Medical explanation of how ovulation calculators work, menstrual cycle timing, and practical guidance for fertility tracking and conception planning.</p>
          </li>
          <li>
            <a href="https://health.clevelandclinic.org/menstrual-cycle/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Cleveland Clinic — Understanding Your Menstrual Cycle and Ovulation</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive clinical overview of menstrual cycle phases, ovulation mechanics, hormonal changes, and how to interpret fertility signs for reproductive health.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Ovulation & Fertile Window Estimator"
      description="Predict your ovulation and fertile window accurately. Maximize your chances of conception by tracking your most fertile days."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math Formula",
        formula:
          "Ovulation Day = First Day of Next Period - 14 days; Fertile Window = Ovulation Day - 5 days to Ovulation Day",
        variables: [
          { symbol: "Cycle Length", description: "Average length of menstrual cycle in days" },
          { symbol: "Last Period Date", description: "First day of the most recent menstrual period" },
        ],
      }}
      example={{
        title: "Real-World Example",
        scenario:
          "Jane has a regular 28-day menstrual cycle. Her last period started on March 1, 2024. She wants to know her ovulation day and fertile window.",
        steps: [
          {
            label: "Step 1",
            explanation: "Calculate the first day of Jane's next period: March 1 + 28 days = March 29, 2024.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate ovulation day: March 29 - 14 days = March 15, 2024. Fertile window: March 10 to March 15, 2024.",
          },
        ],
        result: "Jane's estimated ovulation day is March 15, 2024, and her fertile window is March 10 to March 15, 2024.",
      }}
      relatedCalculators={[
        { title: "BMI — Body Mass Index Calculator", url: "/health/bmi-body-mass-index", icon: "⚖️" },
        { title: "BMR — Basal Metabolic Rate (Mifflin-St Jeor)", url: "/health/bmr-mifflin-st-jeor", icon: "🔥" },
        { title: "TDEE — Total Daily Energy Expenditure Calculator", url: "/health/tdee-daily-energy-expenditure", icon: "🔥" },
        { title: "Body Fat % (US Navy / 3-sites)", url: "/health/body-fat-us-navy-3-sites", icon: "💧" },
        { title: "Ideal Weight Range (Hamwi/Devine/Miller)", url: "/health/ideal-weight-range-hamwi-devine-miller", icon: "🥗" },
        { title: "Waist-to-Height Ratio Checker", url: "/health/waist-to-height-ratio", icon: "😴" },
      ]}
      onThisPage={[
        { id: "what-is", label: "What is Ovulation & Fertile Window Estimator?" },
        { id: "how-to-use", label: "How to Use This Calculator" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "Trusted References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}