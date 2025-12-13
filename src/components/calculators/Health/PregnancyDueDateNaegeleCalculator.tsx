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
      question: "What is Naegele's Rule and how accurate is it?",
      answer:
        "Naegele's Rule is a standard method used to estimate a pregnancy's due date based on the first day of the last menstrual period (LMP). It assumes a 28-day menstrual cycle and a 280-day gestation period (40 weeks). While it provides a useful estimate, actual delivery can vary by up to two weeks before or after the due date due to individual differences in cycle length and fetal development.",
    },
    {
      question: "Can this calculator be used if I have irregular menstrual cycles?",
      answer:
        "Naegele's Rule is most accurate for women with regular 28-day cycles. For those with irregular cycles, the estimated due date may be less precise. In such cases, ultrasound measurements during the first trimester are often used to provide a more accurate estimate.",
    },
    {
      question: "What are the limitations of using the last menstrual period to calculate due date?",
      answer:
        "Using the LMP assumes accurate recall of the date and a regular menstrual cycle. Factors such as irregular cycles, recent hormonal contraceptive use, or bleeding during early pregnancy can affect accuracy. Additionally, ovulation and conception may not occur exactly 14 days after LMP, leading to variability in gestational age estimates.",
    },
    {
      question: "How does this calculator handle different unit systems?",
      answer:
        "This calculator primarily requires a date input (LMP) and outputs a date (due date), so unit systems (imperial or metric) mainly affect date formatting. The default is imperial (MM/DD/YYYY) for US/Canada users, while metric users see the ISO format (YYYY-MM-DD).",
    },
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
      {/* MANDATORY "WHAT IS" SECTION */}
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">What is the Pregnancy Due-Date (Naegele)?</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Pregnancy Due-Date, commonly calculated using Naegele's Rule, is an estimate of when a pregnant person is expected to deliver their baby. Naegele's Rule calculates this date by adding one year, subtracting three months, and adding seven days to the first day of the last menstrual period (LMP). This method assumes a regular 28-day menstrual cycle and a gestation period of approximately 280 days or 40 weeks.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This due date serves as a guideline for healthcare providers and expectant parents to monitor fetal development and plan prenatal care. However, it is important to understand that only about 5% of babies are born exactly on their due date; most deliveries occur within a two-week window before or after this date. The due date is a tool for tracking pregnancy progress rather than a precise prediction.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The calculation is widely used in Canada, the United States, and internationally, providing a standardized approach to estimate delivery timing. It is especially useful in early pregnancy when ultrasound dating may not yet be available. However, factors such as irregular menstrual cycles, inaccurate recall of LMP, or variations in ovulation timing can affect the accuracy of this estimate.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Modern obstetric care often combines Naegele's Rule with ultrasound measurements and clinical assessments to refine due date estimates. Despite its limitations, Naegele's Rule remains a foundational tool in prenatal care due to its simplicity and ease of use.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator uses Naegele's Rule to estimate your pregnancy due date based on the first day of your last menstrual period (LMP). Follow these simple steps to get your estimated due date:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Input the LMP Date:</strong> Select the first day of your last menstrual period using the date picker. This date is critical as it forms the basis of the calculation.
          </li>
          <li>
            <strong>Choose Unit System:</strong> Select your preferred date format system. Imperial (MM/DD/YYYY) is default for US and Canada, while Metric (YYYY-MM-DD) is common internationally.
          </li>
          <li>
            <strong>Calculate:</strong> Click the "Calculate" button to see your estimated due date displayed prominently.
          </li>
          <li>
            <strong>Reset:</strong> Use the "Reset" button to clear inputs and start over if needed.
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Trusted References</h2>
        <ul className="space-y-4">
          <li className="block">
            <a
              href="https://www.acog.org/womens-health/faqs/estimated-due-date"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. American College of Obstetricians and Gynecologists (ACOG)
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Authoritative guidelines on estimating due dates and prenatal care.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.cdc.gov/ncbddd/birthdefects/features/pregnancy-due-date.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Centers for Disease Control and Prevention (CDC)
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Information on pregnancy dating and fetal development.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.nhs.uk/pregnancy/your-pregnancy-care/your-due-date/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. National Health Service (NHS) UK
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Practical advice on calculating due dates and pregnancy milestones.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.who.int/news-room/fact-sheets/detail/pregnancy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              4. World Health Organization (WHO)
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Global standards and recommendations for pregnancy care.
            </p>
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