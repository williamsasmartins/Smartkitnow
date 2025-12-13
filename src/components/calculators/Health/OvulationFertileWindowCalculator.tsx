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
      question: "What is the Ovulation & Fertile Window Estimator?",
      answer:
        "This estimator predicts your most fertile days based on your menstrual cycle length and the first day of your last period. Ovulation typically occurs about 14 days before your next period, and the fertile window includes the five days leading up to ovulation plus the day of ovulation itself. Tracking this window can help maximize chances of conception.",
    },
    {
      question: "How accurate is this ovulation prediction?",
      answer:
        "While this estimator uses average cycle data, individual cycles can vary due to stress, illness, or hormonal changes. Ovulation may not always occur exactly 14 days before the next period, especially in irregular cycles. For higher accuracy, combining this method with basal body temperature tracking or ovulation predictor kits is recommended.",
    },
    {
      question: "Can this calculator be used for irregular menstrual cycles?",
      answer:
        "This tool is optimized for regular menstrual cycles between 21 and 35 days. If your cycles are irregular or outside this range, predictions may be less reliable. Consulting a healthcare provider or using additional ovulation tracking methods is advisable for irregular cycles.",
    },
    {
      question: "Why is the fertile window longer than just the ovulation day?",
      answer:
        "Sperm can survive inside the female reproductive tract for up to five days, while the egg remains viable for about 12-24 hours after ovulation. Therefore, the fertile window includes the days leading up to ovulation to account for sperm longevity, increasing the chance of fertilization.",
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
      {/* MANDATORY "WHAT IS" SECTION */}
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          What is the Ovulation & Fertile Window Estimator?
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Ovulation & Fertile Window Estimator is a specialized tool designed to help individuals predict their most fertile days within their menstrual cycle. By inputting the average length of your menstrual cycle and the first day of your last period, this calculator estimates the day of ovulation and the fertile window when conception is most likely to occur. Understanding this timing is crucial for those trying to conceive or avoid pregnancy naturally.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Ovulation typically occurs about 14 days before the start of the next menstrual period. The fertile window includes the day of ovulation and the five days preceding it, accounting for the lifespan of both sperm and the egg. This window represents the days when sexual intercourse is most likely to result in pregnancy. The estimator uses well-established reproductive health principles to provide a personalized prediction based on your cycle data.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          While this tool offers a scientifically grounded estimate, it is important to remember that menstrual cycles can vary due to numerous factors such as stress, illness, or hormonal imbalances. Therefore, the estimator should be used as a guide rather than a definitive prediction. For individuals with irregular cycles or specific health concerns, consulting a healthcare provider or using additional ovulation tracking methods is recommended.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This estimator empowers users with knowledge about their reproductive health, helping them make informed decisions. It is especially valuable in the context of family planning and fertility awareness, supporting users in maximizing their chances of conception or effectively managing fertility.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using the Ovulation & Fertile Window Estimator is straightforward and requires just two key pieces of information. Follow these steps to get your personalized fertile window:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Average Menstrual Cycle Length:</strong> Enter the typical number of days in your menstrual cycle, counting from the first day of one period to the first day of the next. Most cycles range between 21 and 35 days.
          </li>
          <li>
            <strong>First Day of Last Menstrual Period:</strong> Input the date when your most recent period began. This date anchors the calculation of your ovulation and fertile window.
          </li>
        </ul>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
          After entering these inputs, click the "Calculate" button to see your estimated ovulation date and fertile window. If you wish to start over, use the "Reset" button to clear your inputs. Remember, this tool provides an estimate and should be used alongside other fertility awareness methods for best results.
        </p>
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
              href="https://www.acog.org/womens-health/faqs/your-menstrual-cycle"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. American College of Obstetricians and Gynecologists (ACOG)
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Comprehensive information on menstrual cycles, ovulation, and fertility awareness.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.cdc.gov/reproductivehealth/infertility/index.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Centers for Disease Control and Prevention (CDC) - Infertility
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Authoritative resource on reproductive health and factors affecting fertility.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.nichd.nih.gov/health/topics/infertility/conditioninfo/treatment/fertility-awareness"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Eunice Kennedy Shriver National Institute of Child Health and Human Development (NICHD)
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Detailed explanations on fertility awareness methods and ovulation tracking.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.mayoclinic.org/tests-procedures/ovulation-prediction-kit/about/pac-20385255"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              4. Mayo Clinic - Ovulation Prediction Kits
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Trusted guidance on ovulation detection and fertility tracking tools.
            </p>
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