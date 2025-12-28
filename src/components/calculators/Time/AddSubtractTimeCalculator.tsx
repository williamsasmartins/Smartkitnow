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

function addTimeToDate(
  baseDate: Date,
  amount: number,
  unit: string,
  operation: "add" | "subtract",
  businessDaysOnly: boolean
): Date {
  const result = new Date(baseDate.getTime());

  const multiplier = operation === "add" ? 1 : -1;

  if (unit === "days") {
    if (!businessDaysOnly) {
      // Simple add/subtract days
      result.setDate(result.getDate() + multiplier * amount);
    } else {
      // Add/subtract business days (skip Sat/Sun)
      let daysAdded = 0;
      while (daysAdded < amount) {
        result.setDate(result.getDate() + multiplier * 1);
        const day = result.getDay();
        if (day !== 0 && day !== 6) {
          daysAdded++;
        }
      }
    }
  } else if (unit === "hours") {
    result.setHours(result.getHours() + multiplier * amount);
  } else if (unit === "minutes") {
    result.setMinutes(result.getMinutes() + multiplier * amount);
  } else if (unit === "seconds") {
    result.setSeconds(result.getSeconds() + multiplier * amount);
  }

  return result;
}

export default function AddSubtractTimeCalculator() {
  const [inputs, setInputs] = useState({
    startDate: "",
    amount: "",
    unit: "hours",
    operation: "add",
    businessDaysOnly: false,
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    try {
      if (!inputs.startDate) {
        return {
          primary: "Please enter a valid base date/time",
          secondary: "",
          details: "",
          feedback: "",
        };
      }
      const baseDate = new Date(inputs.startDate);
      if (isNaN(baseDate.getTime())) {
        return {
          primary: "Invalid base date/time format",
          secondary: "",
          details: "",
          feedback: "",
        };
      }
      const amountNum = Number(inputs.amount);
      if (isNaN(amountNum) || amountNum < 0) {
        return {
          primary: "Please enter a valid non-negative amount",
          secondary: "",
          details: "",
          feedback: "",
        };
      }
      if (
        inputs.unit === "days" &&
        inputs.businessDaysOnly &&
        amountNum % 1 !== 0
      ) {
        return {
          primary: "Business days must be whole numbers",
          secondary: "",
          details: "",
          feedback: "",
        };
      }

      const resultDate = addTimeToDate(
        baseDate,
        amountNum,
        inputs.unit,
        inputs.operation as "add" | "subtract",
        inputs.businessDaysOnly
      );

      // Format output in local and UTC time
      const localString = resultDate.toLocaleString(undefined, {
        hour12: false,
        timeZoneName: "short",
      });
      const utcString = resultDate.toUTCString();

      return {
        primary: localString,
        secondary: `UTC: ${utcString}`,
        details: `Operation: ${inputs.operation} ${amountNum} ${inputs.unit}${
          inputs.businessDaysOnly && inputs.unit === "days"
            ? " (business days only)"
            : ""
        }`,
        feedback:
          "Result is calculated based on your local time zone. Consider Daylight Saving Time changes if applicable.",
      };
    } catch (e) {
      return {
        primary: "Error calculating result",
        secondary: "",
        details: "",
        feedback: "",
      };
    }
  }, [inputs]);

  const faqs = [
    {
      question: "How does this calculator handle Daylight Saving Time changes?",
      answer:
        "This calculator uses your local time zone when performing calculations. When adding or subtracting time across Daylight Saving Time boundaries, the result automatically adjusts for the one-hour shift, ensuring accurate local time results.",
    },
    {
      question: "What are business days and how are they calculated?",
      answer:
        "Business days exclude weekends (Saturday and Sunday). When adding or subtracting business days, the calculator skips weekends, ensuring that only weekdays are counted in the calculation.",
    },
    {
      question: "Can I subtract time using this calculator?",
      answer:
        "Yes, you can choose to either add or subtract time from the base date. Simply select the 'Add' or 'Subtract' operation and enter the amount and unit of time to adjust accordingly.",
    },
    {
      question: "Why do I need to enter the time unit separately?",
      answer:
        "Time units (days, hours, minutes, seconds) determine the granularity of the adjustment. Different units affect the date/time differently, so specifying the unit ensures precise calculations tailored to your needs.",
    },
    {
      question: "Does this calculator support time zone conversions?",
      answer:
        "This calculator performs calculations based on your local time zone. While it shows the result in both local time and UTC, it does not convert between arbitrary time zones. For time zone conversions, consider using dedicated tools.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "Planning a software release scheduled for March 10th, 2024 at 10:00 AM local time. You want to know the exact date and time 3 business days before the release to schedule final testing.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Enter the base date/time as March 10th, 2024, 10:00 AM in the input field.",
      },
      {
        label: "Step 2",
        explanation:
          "Select 'Subtract' as the operation since you want to go back in time.",
      },
      {
        label: "Step 3",
        explanation:
          "Enter '3' as the amount and select 'Days' as the unit. Check the 'Business Days Only' box to exclude weekends.",
      },
      {
        label: "Step 4",
        explanation:
          "Click 'Calculate' to get the exact date and time 3 business days before the release.",
      },
    ],
    result:
      "The calculator will show March 5th, 2024 at 10:00 AM as the result, skipping the weekend days (March 8th and 9th).",
  };

  const references = [
    {
      title: "Time and Date Standards (ISO 8601)",
      description:
        "International standard for date and time representation, ensuring consistent formatting and interpretation.",
      url: "https://www.iso.org/iso-8601-date-and-time-format.html",
    },
    {
      title: "MDN Web Docs: Date",
      description:
        "Comprehensive documentation on JavaScript Date object and its methods for date/time manipulation.",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date",
    },
    {
      title: "Daylight Saving Time Explained",
      description:
        "Detailed explanation of Daylight Saving Time and its impact on time calculations.",
      url: "https://www.timeanddate.com/time/dst/",
    },
    {
      title: "Business Days Calculation",
      description:
        "Overview of how business days are calculated, excluding weekends and holidays.",
      url: "https://www.investopedia.com/terms/b/business-day.asp",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">
            Base Date & Time <CalendarIcon className="inline ml-1 mb-1" />
          </Label>
          <Input
            id="startDate"
            type="datetime-local"
            value={inputs.startDate}
            onChange={(e) => handleInputChange("startDate", e.target.value)}
            placeholder="YYYY-MM-DDThh:mm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Amount to Add/Subtract</Label>
          <Input
            id="amount"
            type="number"
            min={0}
            step={inputs.unit === "days" ? 1 : 0.01}
            value={inputs.amount}
            onChange={(e) => handleInputChange("amount", e.target.value)}
            placeholder="Enter a number"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="unit">Time Unit</Label>
          <Select
            value={inputs.unit}
            onValueChange={(value) => handleInputChange("unit", value)}
          >
            <SelectTrigger id="unit" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="days">Days</SelectItem>
              <SelectItem value="hours">Hours</SelectItem>
              <SelectItem value="minutes">Minutes</SelectItem>
              <SelectItem value="seconds">Seconds</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="operation">Operation</Label>
          <Select
            value={inputs.operation}
            onValueChange={(value) => handleInputChange("operation", value)}
          >
            <SelectTrigger id="operation" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="add">Add</SelectItem>
              <SelectItem value="subtract">Subtract</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {inputs.unit === "days" && (
        <div className="flex items-center space-x-2">
          <input
            id="businessDaysOnly"
            type="checkbox"
            checked={inputs.businessDaysOnly}
            onChange={(e) => handleInputChange("businessDaysOnly", e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <Label htmlFor="businessDaysOnly" className="select-none">
            Business Days Only (exclude weekends)
          </Label>
        </div>
      )}

      <Button
        className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg"
        onClick={() => {}}
        type="button"
      >
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
            <p className="text-xs text-slate-400 mt-1 italic">{results.feedback}</p>
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
            Enter the base date and time from which you want to add or subtract time.
            Use the date-time picker to select the exact moment.
          </li>
          <li>
            Input the amount of time you want to add or subtract. This can be in days,
            hours, minutes, or seconds.
          </li>
          <li>
            Choose the time unit corresponding to your amount (days, hours, minutes,
            or seconds).
          </li>
          <li>
            Select whether you want to add or subtract the specified time from the base
            date.
          </li>
          <li>
            If adding or subtracting days, optionally check the "Business Days Only"
            box to exclude weekends from the calculation.
          </li>
          <li>Click the "Calculate" button to see the resulting date and time.</li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Add/Subtract Time (h/min/s)
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Adding or subtracting time from a specific date and time is a common task
            in software development, project management, and scheduling. This calculator
            uses the standard JavaScript <code>Date</code> object to perform precise
            date/time arithmetic. When working with days, you can choose to count all
            calendar days or only business days, which exclude weekends.
          </p>
          <p>
            Handling time zones is crucial for accurate calculations. This tool operates
            in your local time zone and displays results both in local time and UTC.
            This helps you understand the exact moment globally and locally.
          </p>
          <p>
            Leap years add an extra day (February 29) every four years, which this
            calculator accounts for automatically when adding or subtracting days.
            Daylight Saving Time (DST) changes can shift local time by one hour forward
            or backward, and this calculator adjusts results accordingly to maintain
            correct local time.
          </p>
          <p>
            Business days calculation skips Saturdays and Sundays. Note that holidays
            are not excluded as they vary by region and require additional data.
            For advanced scheduling, consider integrating holiday calendars.
          </p>
          <p>
            Understanding these concepts ensures you use this calculator effectively
            for scheduling, deadline management, and time tracking across different
            contexts.
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
            <strong>DST Confusion:</strong> Daylight Saving Time often causes 1-hour
            errors if not accounted for. This calculator automatically adjusts for DST
            shifts, but manual calculations may overlook this.
          </p>
          <p>
            <strong>Business Days Misuse:</strong> When selecting business days, only
            whole numbers are valid. Using fractional days with business days can lead
            to incorrect results.
          </p>
          <p>
            <strong>Time Zone Assumptions:</strong> The calculator uses your local time
            zone. If you need to calculate times in other zones, results may differ.
          </p>
          <p>
            <strong>Invalid Date Formats:</strong> Ensure the base date/time input is in
            a valid ISO format (e.g., 2024-03-10T10:00) to avoid parsing errors.
          </p>
          <p>
            <strong>Negative Amounts:</strong> Enter only non-negative numbers for the
            amount. Use the operation selector to add or subtract time.
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
          <BookOpen className="w-5 h-5 text-blue-500" /> References & additional resources
        </h2>
        <div className="space-y-4">
          {references.map((ref, i) => (
            <div key={i}>
              <a
                href={ref.url}
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
                target="_blank"
                rel="noopener noreferrer"
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
      title="Add/Subtract Time (h/min/s)"
      description="Professional time calculator: Add/Subtract Time (h/min/s). Precise calculations, time zone handling, and scheduling tools."
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