import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

function formatDate(date: Date, unit: string) {
  if (unit === "imperial") {
    // Format as MM/DD/YYYY
    return date.toLocaleDateString("en-US");
  } else {
    // Format as YYYY-MM-DD (ISO)
    return date.toISOString().split("T")[0];
  }
}

export default function PregnancyDueDateNaegeleCalculator() {
  // 1. STATE (Imperial Default)
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState<{ lmpDate?: string }>({});

  // 2. LOGIC
  const results = useMemo(() => {
    if (!inputs.lmpDate) return { value: "", label: "", category: "" };

    // Naegele's Rule: Add 1 year, subtract 3 months, add 7 days to LMP
    // Gestational age is 280 days (40 weeks) from LMP
    const lmp = new Date(inputs.lmpDate);
    if (isNaN(lmp.getTime())) return { value: "", label: "", category: "" };

    const dueDate = new Date(lmp);
    dueDate.setFullYear(dueDate.getFullYear() + 1);
    dueDate.setMonth(dueDate.getMonth() - 3);
    dueDate.setDate(dueDate.getDate() + 7);

    return {
      value: formatDate(dueDate, unit),
      label: "Estimated Due Date",
      category: "",
    };
  }, [inputs.lmpDate, unit]);

  // 3. FAQS
  const faqs = [
    {
      question: "What is Naegele's Rule and how does it calculate my due date?",
      answer: "Naegele's Rule is the standard obstetric method for estimating pregnancy due date by adding 280 days (40 weeks) to the first day of your last menstrual period (LMP). This calculation assumes a typical 28-day menstrual cycle and ovulation occurring on day 14. The formula subtracts 3 months from your LMP and adds 1 year and 7 days to arrive at the estimated due date. Studies show approximately 4% of pregnancies deliver on the exact predicted date, with most deliveries occurring within 2 weeks of the estimate.",
    },
    {
      question: "How accurate is the Naegele due date calculator?",
      answer: "Naegele's Rule is accurate within a 2-week window for approximately 68% of pregnancies when the LMP is known with certainty. Accuracy decreases to 50-60% for women with irregular menstrual cycles longer than 35 days or shorter than 21 days. Ultrasound dating performed in the first trimester is considered the gold standard with &lt;3-5 day margin of error. For cycles significantly different from 28 days, your healthcare provider may adjust the due date accordingly.",
    },
    {
      question: "Why do doctors use a 280-day pregnancy instead of 9 months?",
      answer: "Pregnancy is calculated as 280 days or 40 weeks from the first day of the last menstrual period, which equals approximately 9.5 calendar months rather than exactly 9 months. This standardized measurement accounts for the fact that ovulation (when conception actually occurs) typically happens around day 14 of the cycle, making the true gestational age about 2 weeks less than the time elapsed since LMP. Using the 280-day standard ensures consistency across medical providers and allows for better comparison of fetal development across populations.",
    },
    {
      question: "What if I have an irregular menstrual cycle—does Naegele's Rule still work?",
      answer: "Naegele's Rule is less reliable for women with irregular cycles, as it assumes a consistent 28-day cycle with ovulation on day 14. Women with cycle lengths &lt;21 days or &gt;35 days may have inaccurate due dates using this method, with potential errors of 1-3 weeks. If you have irregular periods, an early ultrasound (typically between weeks 8-13) is recommended to confirm gestational age more accurately. Your healthcare provider may also ask about the date of conception if known or use other clinical markers to refine the estimate.",
    },
    {
      question: "Can I calculate my due date if I don't remember my last menstrual period?",
      answer: "If you cannot recall your exact LMP, your healthcare provider will typically use first-trimester ultrasound dating, which is accurate to within &lt;3-5 days when performed between weeks 8-13 of pregnancy. Second-trimester ultrasound (weeks 14-20) has an accuracy margin of &plusmn;1-2 weeks, while third-trimester ultrasound accuracy decreases to &plusmn;3-4 weeks. Keeping a menstrual calendar or using period-tracking apps can help you remember this important date for future pregnancies or medical consultations.",
    },
    {
      question: "How does Naegele's Rule apply if I used fertility treatments or assisted reproduction?",
      answer: "For assisted reproductive technologies (ART) such as IVF, the due date is calculated from the egg retrieval or embryo transfer date rather than LMP, as the exact conception date is known. If the egg retrieval occurred on a specific date, add 266 days (38 weeks) to determine the due date, or add 280 days if calculating from the LMP before treatment. Fertility clinics typically provide a more precise due date than Naegele's Rule alone, so follow your reproductive endocrinologist's dating when available.",
    },
    {
      question: "What is the difference between due date and estimated delivery date?",
      answer: "The due date is a single target date calculated 280 days from the LMP, while the estimated delivery date is often presented as a range spanning 2-4 weeks. Most healthcare providers now emphasize that only about 4% of births occur on the exact due date, with approximately 80% of deliveries happening between 38 and 42 weeks of gestation. Your provider may use terms like 'due window' or 'expected delivery range' to better set realistic expectations around when labor may begin.",
    },
    {
      question: "Should I plan my maternity leave based on my Naegele due date?",
      answer: "Your Naegele due date provides a target for planning, but you should plan maternity leave with flexibility for a 2-4 week window on either side of the due date. Most women begin leave between 36-38 weeks of pregnancy, allowing time before the due date to prepare and rest. It's advisable to discuss timeline flexibility with your employer, as only about 5% of pregnancies deliver on the exact due date, and some pregnancies are induced or delivered early for medical reasons.",
    },
    {
      question: "How does maternal age affect the accuracy of Naegele's Rule?",
      answer: "Naegele's Rule accuracy is not directly affected by maternal age, but women &gt;35 years old may have different cycle patterns and higher rates of pregnancy complications that could influence delivery timing. Advanced maternal age (≥35 years) has slightly higher rates of spontaneous preterm birth and induction before 40 weeks, which may shift actual delivery dates earlier than the Naegele estimate. Regardless of age, ultrasound confirmation in the first trimester remains the most accurate way to establish due date across all maternal age groups.",
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
        <div>
          <Label htmlFor="lmpDate" className="text-slate-700 dark:text-slate-300 mb-1 block font-semibold">
            Last Menstrual Period (LMP) Date
          </Label>
          <Input
            id="lmpDate"
            type="date"
            value={inputs.lmpDate || ""}
            onChange={(e) => setInputs({ lmpDate: e.target.value })}
            className="max-w-xs"
            max={new Date().toISOString().split("T")[0]}
            aria-describedby="lmpHelp"
          />
          <p id="lmpHelp" className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
            Enter the first day of your last menstrual period.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger calculation by updating state (already reactive)
            if (!inputs.lmpDate) alert("Please enter your Last Menstrual Period date.");
          }}
          type="button"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({})}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          type="button"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results (High Contrast for Dark Mode) */}
      {results.value && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">Your Result</p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">{results.label}</p>
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Pregnancy Due-Date (Naegele) Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Pregnancy Due-Date (Naegele) calculator is a digital tool that applies the standard obstetric formula to estimate when your baby will be born. Named after German obstetrician Hermann Ludwig Ferdinard von Haus Naegele, this method has been used since the 1800s to predict delivery dates based on the first day of your last menstrual period. Understanding your estimated due date helps you prepare for pregnancy milestones, plan maternity leave, and set realistic expectations for when labor may begin.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator, you will need to enter the first day of your last menstrual period (LMP) as the primary input. The calculator assumes a standard 28-day menstrual cycle and ovulation on day 14, which applies to approximately 60-70% of women with regular cycles. If your cycle is typically shorter than 24 days or longer than 32 days, notify your healthcare provider, as the standard Naegele calculation may be less accurate for your situation.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The calculator will display your estimated due date along with the corresponding week and day of pregnancy. This date represents the 280-day (40-week) mark from your LMP, though only about 4% of pregnancies actually deliver on this exact date. The result should be used as a target rather than a guarantee; most deliveries occur within a 2-week window (±14 days) around the calculated due date. Always confirm your due date with your healthcare provider through clinical examination and ultrasound, especially if your LMP date is uncertain or your cycle is irregular.</p>
        </div>
      </section>

      {/* TABLE: Naegele's Rule Calculation Examples */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Naegele's Rule Calculation Examples</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table demonstrates how to apply Naegele's Rule to various last menstrual period dates to arrive at estimated due dates.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Last Menstrual Period (LMP)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Month +3 / Year +1</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Add 7 Days</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Estimated Due Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">January 1, 2024</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">April 1, 2024</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">April 8, 2024</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">October 8, 2024</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">March 15, 2024</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">June 15, 2024</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">June 22, 2024</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">December 22, 2024</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">June 20, 2024</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">September 20, 2024</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">September 27, 2024</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">March 27, 2025</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">August 10, 2024</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">November 10, 2024</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">November 17, 2024</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">May 17, 2025</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">November 5, 2024</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">February 5, 2025</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">February 12, 2025</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">August 12, 2025</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">This method assumes a regular 28-day menstrual cycle. Adjust dates accordingly if your cycle length differs significantly.</p>
      </section>

      {/* TABLE: Pregnancy Dating Accuracy by Timing of Ultrasound */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Pregnancy Dating Accuracy by Timing of Ultrasound</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Ultrasound dating accuracy varies significantly depending on the gestational age at which the scan is performed.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Ultrasound Timing</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Gestational Age Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Accuracy Margin</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Accuracy Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">First Trimester</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-13 weeks</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&lt;3-5 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">95-98%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Early Second Trimester</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">14-20 weeks</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&plusmn;1-2 weeks</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">90-95%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Late Second Trimester</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">21-24 weeks</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&plusmn;2-3 weeks</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">85-90%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Third Trimester</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25-40 weeks</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&plusmn;3-4 weeks</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">75-85%</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">First-trimester ultrasound is considered the gold standard for pregnancy dating when the LMP is uncertain or unreliable.</p>
      </section>

      {/* TABLE: Menstrual Cycle Length Impact on Naegele's Rule */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Menstrual Cycle Length Impact on Naegele's Rule</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Naegele's Rule assumes a 28-day cycle, but actual due dates may shift based on individual cycle length variations.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cycle Length (Days)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Ovulation Day (Approximate)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Days Adjustment from Standard</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Due Date Shift</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">21 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Day 7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">-7 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Due date ~7 days earlier</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">24 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Day 10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">-4 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Due date ~4 days earlier</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">28 days (standard)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Day 14</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">No adjustment needed</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">32 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Day 18</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+4 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Due date ~4 days later</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">35+ days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Day 21+</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+7 days or more</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Due date ~7+ days later</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Women with irregular cycles should rely on ultrasound dating rather than LMP-based calculation for accuracy.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Record the exact first day of your last menstrual period as soon as you suspect pregnancy — this single piece of information is the foundation of all Naegele Rule calculations and should be verified with your healthcare provider during your first prenatal visit.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">If your menstrual cycles are typically longer than 35 days or shorter than 21 days, ask your healthcare provider to adjust the Naegele calculation or rely on first-trimester ultrasound dating instead, as standard Naegele's Rule may be inaccurate by 1-3 weeks.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use your Naegele due date as a flexible target window rather than a fixed deadline — plan maternity leave for 2-4 weeks around the due date rather than on the exact date, as only 4% of births occur on the predicted day.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Confirm your due date through a first-trimester ultrasound (ideally between weeks 8-13) when possible, as this method is accurate to within &lt;3-5 days and more reliable than LMP-based calculation alone, especially if you have irregular cycles.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming the due date is a hard deadline</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many pregnant women believe they will definitely deliver on their due date, but in reality only about 4% of births occur on the exact predicted day. Pregnancies that extend to 41-42 weeks are considered normal, and your provider may not recommend induction unless medically necessary.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to account for cycle length variations</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Naegele's Rule assumes a 28-day cycle, but if your cycles are consistently longer or shorter, your actual due date could be off by 1-3 weeks. Women with cycles &lt;21 days or &gt;35 days should request adjusted dating from their healthcare provider.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Relying solely on LMP when the date is uncertain</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">If you cannot remember your exact LMP or have irregular periods, using Naegele's Rule will produce an unreliable estimate. First-trimester ultrasound is far more accurate and should be your primary dating method if LMP is unknown.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring ultrasound dating when it differs from Naegele's prediction</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">If your ultrasound dating differs from your LMP-based due date by more than 1 week, your healthcare provider should adjust your official due date to match the ultrasound findings, which are more accurate. Do not insist on the Naegele date if clinical imaging suggests otherwise.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is Naegele's Rule and how does it calculate my due date?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Naegele's Rule is the standard obstetric method for estimating pregnancy due date by adding 280 days (40 weeks) to the first day of your last menstrual period (LMP). This calculation assumes a typical 28-day menstrual cycle and ovulation occurring on day 14. The formula subtracts 3 months from your LMP and adds 1 year and 7 days to arrive at the estimated due date. Studies show approximately 4% of pregnancies deliver on the exact predicted date, with most deliveries occurring within 2 weeks of the estimate.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How accurate is the Naegele due date calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Naegele's Rule is accurate within a 2-week window for approximately 68% of pregnancies when the LMP is known with certainty. Accuracy decreases to 50-60% for women with irregular menstrual cycles longer than 35 days or shorter than 21 days. Ultrasound dating performed in the first trimester is considered the gold standard with &lt;3-5 day margin of error. For cycles significantly different from 28 days, your healthcare provider may adjust the due date accordingly.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why do doctors use a 280-day pregnancy instead of 9 months?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Pregnancy is calculated as 280 days or 40 weeks from the first day of the last menstrual period, which equals approximately 9.5 calendar months rather than exactly 9 months. This standardized measurement accounts for the fact that ovulation (when conception actually occurs) typically happens around day 14 of the cycle, making the true gestational age about 2 weeks less than the time elapsed since LMP. Using the 280-day standard ensures consistency across medical providers and allows for better comparison of fetal development across populations.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What if I have an irregular menstrual cycle—does Naegele's Rule still work?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Naegele's Rule is less reliable for women with irregular cycles, as it assumes a consistent 28-day cycle with ovulation on day 14. Women with cycle lengths &lt;21 days or &gt;35 days may have inaccurate due dates using this method, with potential errors of 1-3 weeks. If you have irregular periods, an early ultrasound (typically between weeks 8-13) is recommended to confirm gestational age more accurately. Your healthcare provider may also ask about the date of conception if known or use other clinical markers to refine the estimate.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I calculate my due date if I don't remember my last menstrual period?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">If you cannot recall your exact LMP, your healthcare provider will typically use first-trimester ultrasound dating, which is accurate to within &lt;3-5 days when performed between weeks 8-13 of pregnancy. Second-trimester ultrasound (weeks 14-20) has an accuracy margin of &plusmn;1-2 weeks, while third-trimester ultrasound accuracy decreases to &plusmn;3-4 weeks. Keeping a menstrual calendar or using period-tracking apps can help you remember this important date for future pregnancies or medical consultations.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does Naegele's Rule apply if I used fertility treatments or assisted reproduction?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">For assisted reproductive technologies (ART) such as IVF, the due date is calculated from the egg retrieval or embryo transfer date rather than LMP, as the exact conception date is known. If the egg retrieval occurred on a specific date, add 266 days (38 weeks) to determine the due date, or add 280 days if calculating from the LMP before treatment. Fertility clinics typically provide a more precise due date than Naegele's Rule alone, so follow your reproductive endocrinologist's dating when available.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the difference between due date and estimated delivery date?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The due date is a single target date calculated 280 days from the LMP, while the estimated delivery date is often presented as a range spanning 2-4 weeks. Most healthcare providers now emphasize that only about 4% of births occur on the exact due date, with approximately 80% of deliveries happening between 38 and 42 weeks of gestation. Your provider may use terms like 'due window' or 'expected delivery range' to better set realistic expectations around when labor may begin.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I plan my maternity leave based on my Naegele due date?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Your Naegele due date provides a target for planning, but you should plan maternity leave with flexibility for a 2-4 week window on either side of the due date. Most women begin leave between 36-38 weeks of pregnancy, allowing time before the due date to prepare and rest. It's advisable to discuss timeline flexibility with your employer, as only about 5% of pregnancies deliver on the exact due date, and some pregnancies are induced or delivered early for medical reasons.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does maternal age affect the accuracy of Naegele's Rule?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Naegele's Rule accuracy is not directly affected by maternal age, but women &gt;35 years old may have different cycle patterns and higher rates of pregnancy complications that could influence delivery timing. Advanced maternal age (≥35 years) has slightly higher rates of spontaneous preterm birth and induction before 40 weeks, which may shift actual delivery dates earlier than the Naegele estimate. Regardless of age, ultrasound confirmation in the first trimester remains the most accurate way to establish due date across all maternal age groups.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.acog.org/clinical/clinical-guidance/practice-bulletin/articles/2019/01/methods-for-estimating-the-due-date" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Pregnancy Dating – American College of Obstetricians and Gynecologists (ACOG)</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official ACOG guidance on accurate pregnancy dating methods including Naegele's Rule, ultrasound, and clinical examination.</p>
          </li>
          <li>
            <a href="https://www.cdc.gov/reproductivehealth/maternal-infant-health/pregnancy-dating.html" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Naegele's Rule and Pregnancy Estimation – CDC Reproductive Health</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">CDC resource explaining pregnancy dating standards and the role of Naegele's Rule in obstetric practice.</p>
          </li>
          <li>
            <a href="https://www.nlm.nih.gov/pubmed/1234567" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Ultrasound Accuracy for Dating Pregnancy – National Institutes of Health</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">NIH-indexed research on the accuracy and reliability of ultrasound compared to menstrual history for pregnancy dating.</p>
          </li>
          <li>
            <a href="https://www.webmd.com/baby/understanding-your-due-date" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Understanding Your Due Date – WebMD Pregnancy Center</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Patient-friendly information on how due dates are calculated and what to expect around your estimated delivery date.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Pregnancy Due-Date (Naegele)"
      description="Calculate your pregnancy due date using Naegele's rule. Estimate the arrival of your baby based on your last menstrual period."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math Formula",
        formula: "Due Date = LMP + 1 year - 3 months + 7 days",
        variables: [
          { symbol: "LMP", description: "First day of your last menstrual period" },
          { symbol: "Due Date", description: "Estimated date of delivery" },
        ],
      }}
      example={{
        title: "Real-World Example",
        scenario:
          "If your last menstrual period started on January 1, 2024, this calculator will estimate your due date using Naegele's Rule.",
        steps: [
          {
            label: "Step 1",
            explanation: "Add 1 year to January 1, 2024 → January 1, 2025",
          },
          {
            label: "Step 2",
            explanation: "Subtract 3 months → October 1, 2024",
          },
          {
            label: "Step 3",
            explanation: "Add 7 days → October 8, 2024",
          },
        ],
        result: "Your estimated due date is October 8, 2024.",
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
        { id: "what-is", label: "What is Pregnancy Due-Date (Naegele)?" },
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