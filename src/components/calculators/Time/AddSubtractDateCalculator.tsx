import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Clock,
  Calendar as CalendarIcon,
  Globe,
  Info,
  AlertTriangle,
  BookOpen,
  ExternalLink,
  Timer,
  Sun,
  Moon,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

function isValidDate(d: Date) {
  return d instanceof Date && !isNaN(d.getTime());
}

function addBusinessDays(date: Date, days: number) {
  let result = new Date(date);
  let addedDays = 0;
  const step = days < 0 ? -1 : 1;
  while (addedDays !== days) {
    result.setDate(result.getDate() + step);
    // Skip weekends
    if (result.getDay() !== 0 && result.getDay() !== 6) {
      addedDays += step;
    }
  }
  return result;
}

export default function AddSubtractDateCalculator() {
  // Inputs: Base Date, Amount, Unit, Operation (Add/Subtract), Business Days toggle
  const [inputs, setInputs] = useState({
    baseDate: "",
    amount: "",
    unit: "days",
    operation: "add",
    businessDaysOnly: false,
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    try {
      if (!inputs.baseDate || !inputs.amount) {
        return null;
      }
      const base = new Date(inputs.baseDate);
      if (!isValidDate(base)) {
        return {
          primary: "Invalid Date",
          secondary: "",
          details: "Please enter a valid base date.",
          feedback: "",
        };
      }
      const amountNum = Number(inputs.amount);
      if (isNaN(amountNum)) {
        return {
          primary: "Invalid Amount",
          secondary: "",
          details: "Please enter a valid number for amount.",
          feedback: "",
        };
      }
      const opMultiplier = inputs.operation === "add" ? 1 : -1;

      let resultDate = new Date(base);

      switch (inputs.unit) {
        case "days":
          if (inputs.businessDaysOnly) {
            resultDate = addBusinessDays(resultDate, opMultiplier * amountNum);
          } else {
            resultDate.setDate(resultDate.getDate() + opMultiplier * amountNum);
          }
          break;
        case "months":
          {
            const targetMonth = resultDate.getMonth() + opMultiplier * amountNum;
            const targetYear =
              resultDate.getFullYear() + Math.floor(targetMonth / 12);
            const modMonth = ((targetMonth % 12) + 12) % 12;
            // Handle month overflow (e.g., Feb 30)
            const day = Math.min(
              resultDate.getDate(),
              new Date(targetYear, modMonth + 1, 0).getDate()
            );
            resultDate = new Date(targetYear, modMonth, day, resultDate.getHours(), resultDate.getMinutes(), resultDate.getSeconds(), resultDate.getMilliseconds());
          }
          break;
        case "years":
          {
            const targetYear = resultDate.getFullYear() + opMultiplier * amountNum;
            // Handle Feb 29 on non-leap years
            const day = Math.min(
              resultDate.getDate(),
              new Date(targetYear, resultDate.getMonth() + 1, 0).getDate()
            );
            resultDate = new Date(targetYear, resultDate.getMonth(), day, resultDate.getHours(), resultDate.getMinutes(), resultDate.getSeconds(), resultDate.getMilliseconds());
          }
          break;
        case "hours":
          resultDate.setHours(resultDate.getHours() + opMultiplier * amountNum);
          break;
        default:
          return {
            primary: "Invalid Unit",
            secondary: "",
            details: "Please select a valid unit.",
            feedback: "",
          };
      }

      // Format result date in ISO string with local timezone offset
      const formattedResult = resultDate.toLocaleString(undefined, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      return {
        primary: formattedResult,
        secondary: `Base Date: ${new Date(base).toLocaleString()}`,
        details: `Operation: ${inputs.operation} ${inputs.amount} ${inputs.unit}${
          inputs.businessDaysOnly && inputs.unit === "days" ? " (business days only)" : ""
        }`,
        feedback:
          "Result is calculated based on local time zone and standard calendar rules.",
      };
    } catch (e) {
      return {
        primary: "Error",
        secondary: "",
        details: "An unexpected error occurred during calculation.",
        feedback: "",
      };
    }
  }, [inputs]);

  const faqs = [
    {
      question: "How does this calculator handle leap years?",
      answer:
        "This calculator correctly accounts for leap years when adding or subtracting years or months. For example, adding one year to February 29, 2020, results in February 28, 2021, since 2021 is not a leap year. It uses JavaScript's Date object which internally manages leap year logic.",
    },
    {
      question: "What is the difference between adding days and business days?",
      answer:
        "Adding days includes all calendar days, including weekends and holidays. Adding business days excludes Saturdays and Sundays, so the result skips weekends. This is useful for work-related scheduling where only weekdays count.",
    },
    {
      question: "How does the calculator handle Daylight Saving Time changes?",
      answer:
        "When adding or subtracting hours or days, the calculator uses the local time zone and JavaScript Date methods, which automatically adjust for Daylight Saving Time changes. However, adding days may sometimes shift the time by an hour if a DST transition occurs.",
    },
    {
      question: "Can I subtract months or years from a date?",
      answer:
        "Yes, by selecting the 'Subtract' operation and choosing months or years as the unit, you can subtract these from the base date. The calculator handles edge cases like month length differences and leap years automatically.",
    },
    {
      question: "Why does adding months sometimes change the day?",
      answer:
        "Months have varying lengths (28 to 31 days). If the original day does not exist in the target month (e.g., adding one month to January 31), the calculator adjusts to the last valid day of the target month (e.g., February 28 or 29). This behavior follows standard date arithmetic rules.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "Planning a software development sprint starting on March 1, 2024, and you want to find the end date after adding 15 business days.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Set the base date to March 1, 2024, using the date picker.",
      },
      {
        label: "Step 2",
        explanation: "Enter 15 as the amount to add.",
      },
      {
        label: "Step 3",
        explanation: "Select 'days' as the unit and check 'Business Days Only'.",
      },
      {
        label: "Step 4",
        explanation: "Choose 'Add' as the operation.",
      },
      {
        label: "Step 5",
        explanation:
          "Click 'Calculate' to get the resulting date, which excludes weekends.",
      },
    ],
    result:
      "The calculator returns March 22, 2024, as the sprint end date, correctly skipping weekends.",
  };

  const references = [
    {
      title: "Time and Date Standards (ISO 8601)",
      description:
        "International standard for date and time representation, widely used in computing and data exchange.",
      url: "https://www.iso.org/iso-8601-date-and-time-format.html",
    },
    {
      title: "MDN Web Docs: Date",
      description:
        "Comprehensive documentation on JavaScript Date object and its methods.",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date",
    },
    {
      title: "Understanding Daylight Saving Time",
      description:
        "Explanation of DST and its impact on time calculations.",
      url: "https://www.timeanddate.com/time/dst/",
    },
    {
      title: "Business Day Calculations",
      description:
        "Overview of how business days are calculated excluding weekends and holidays.",
      url: "https://en.wikipedia.org/wiki/Business_day",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="baseDate">Base Date and Time</Label>
          <Input
            id="baseDate"
            type="datetime-local"
            value={inputs.baseDate}
            onChange={(e) => handleInputChange("baseDate", e.target.value)}
            placeholder="Select base date and time"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="amount">Amount to Add/Subtract</Label>
          <Input
            id="amount"
            type="number"
            min="0"
            value={inputs.amount}
            onChange={(e) => handleInputChange("amount", e.target.value)}
            placeholder="Enter amount"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="unit">Unit</Label>
          <Select
            value={inputs.unit}
            onValueChange={(val) => handleInputChange("unit", val)}
          >
            <SelectTrigger id="unit" className="w-full">
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="days">Days</SelectItem>
              <SelectItem value="businessDays">Business Days</SelectItem>
              <SelectItem value="months">Months</SelectItem>
              <SelectItem value="years">Years</SelectItem>
              <SelectItem value="hours">Hours</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="operation">Operation</Label>
          <Select
            value={inputs.operation}
            onValueChange={(val) => handleInputChange("operation", val)}
          >
            <SelectTrigger id="operation" className="w-full">
              <SelectValue placeholder="Select operation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="add">Add</SelectItem>
              <SelectItem value="subtract">Subtract</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Business days checkbox only enabled if unit is days */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="businessDaysOnly"
          checked={inputs.businessDaysOnly}
          disabled={inputs.unit !== "days"}
          onChange={(e) => handleInputChange("businessDaysOnly", e.target.checked)}
          className="cursor-pointer"
        />
        <Label htmlFor="businessDaysOnly" className={inputs.unit !== "days" ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}>
          Business Days Only (excludes Sat & Sun)
        </Label>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" onClick={() => {}}>
        <Clock className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">
              Result
            </span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">
              {results.primary}
            </div>
            <div className="text-xl font-bold mt-2">{results.secondary}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="how-to-use" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to use this calculator
        </h2>
        <ol className="list-decimal pl-5 space-y-3 text-slate-600 dark:text-slate-400">
          <li>
            Select the base date and time from which you want to add or subtract.
          </li>
          <li>Enter the amount of time units to add or subtract.</li>
          <li>
            Choose the unit of time: days, business days, months, years, or hours.
          </li>
          <li>
            Select whether you want to add or subtract the specified amount.
          </li>
          <li>
            If you selected "days" as the unit, optionally check "Business Days
            Only" to exclude weekends.
          </li>
          <li>Click the Calculate button to see the resulting date and time.</li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Add/Subtract Date (days/months/years)
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Date and time calculations are fundamental in scheduling, planning,
            and time management. When adding or subtracting days, months, or
            years, it is important to consider calendar rules such as leap years,
            varying month lengths, and Daylight Saving Time (DST) transitions.
          </p>
          <p>
            Leap years occur every four years, adding February 29 to the calendar.
            This affects calculations involving years and months, especially when
            the base date is February 29. The JavaScript Date object automatically
            handles leap years when performing date arithmetic.
          </p>
          <p>
            Daylight Saving Time shifts clocks forward or backward by one hour,
            usually in spring and fall. When adding or subtracting hours or days,
            DST changes can cause the resulting time to shift unexpectedly by an
            hour. This calculator uses local time zone settings, so it accounts
            for DST automatically.
          </p>
          <p>
            Business days exclude weekends (Saturday and Sunday) and are commonly
            used in work-related scheduling. When adding business days, weekends
            are skipped to provide an accurate workday count.
          </p>
          <p>
            Time zones can complicate date calculations, especially when working
            with international dates and times. This calculator uses the local
            time zone of the user's device. For advanced time zone handling,
            external APIs or libraries may be required.
          </p>
        </div>
      </section>

      <section
        id="mistakes"
        className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900"
      >
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" /> Common Mistakes
        </h3>
        <div className="space-y-2 text-sm text-amber-900 dark:text-amber-100">
          <p>
            <strong>DST Confusion:</strong> Daylight Saving Time often causes
            unexpected 1-hour shifts when adding days or hours. Always verify
            results around DST transition dates.
          </p>
          <p>
            <strong>Month Overflow:</strong> Adding months to dates like January
            31 can result in unexpected days (e.g., February 28). The calculator
            adjusts to the last valid day of the target month.
          </p>
          <p>
            <strong>Business Days Misuse:</strong> Business days exclude weekends
            but not public holidays. This calculator does not account for
            holidays, so manual adjustment may be necessary.
          </p>
          <p>
            <strong>Invalid Inputs:</strong> Ensure the base date is valid and the
            amount is a positive number. Invalid inputs will cause errors or
            unexpected results.
          </p>
          <p>
            <strong>Time Zone Assumptions:</strong> The calculator uses your
            device's local time zone. Results may differ if you work across
            multiple time zones.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Real World Example
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>{example.scenario}</p>
          <ol>
            {example.steps.map((step, i) => (
              <li key={i}>
                <strong>{step.label}:</strong> {step.explanation}
              </li>
            ))}
          </ol>
          <p>
            <strong>Result:</strong> {example.result}
          </p>
        </div>
      </section>

      <section id="faq">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Frequently asked questions
        </h2>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0"
            >
              <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">
                {faq.question}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="references">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-5 h-5 text-blue-500" /> References & additional
          resources
        </h2>
        <div className="space-y-4">
          {references.map((ref, i) => (
            <div key={i}>
              <a
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
              >
                {ref.title} <ExternalLink className="w-3 h-3" />
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {ref.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Add/Subtract Date (days/months/years)"
      description="Professional time calculator: Add/Subtract Date (days/months/years). Precise calculations, time zone handling, and scheduling tools."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      example={example}
      relatedCalculators={[]}
      onThisPage={[
        { id: "how-to-use", label: "How to Use" },
        { id: "guide", label: "Complete Guide" },
        { id: "mistakes", label: "Common Mistakes" },
        { id: "example", label: "Real World Example" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}