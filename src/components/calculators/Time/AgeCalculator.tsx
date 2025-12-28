import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Clock, BookOpen, AlertTriangle, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

function calculateAge(startDate: Date, endDate: Date) {
  if (endDate < startDate) return null;

  let years = endDate.getFullYear() - startDate.getFullYear();
  let months = endDate.getMonth() - startDate.getMonth();
  let days = endDate.getDate() - startDate.getDate();

  if (days < 0) {
    // Borrow days from previous month
    const prevMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0);
    days += prevMonth.getDate();
    months -= 1;
  }
  if (months < 0) {
    months += 12;
    years -= 1;
  }

  return { years, months, days };
}

const example = {
  title: "Real World Example",
  scenario:
    "Calculating the exact age of a child born on 2015-04-10 as of today 2024-06-15 to determine eligibility for a school program.",
  steps: [
    {
      label: "Step 1",
      explanation: "Enter the child's birth date as the Start Date (2015-04-10).",
    },
    {
      label: "Step 2",
      explanation: "Enter today's date as the End Date (2024-06-15).",
    },
    {
      label: "Step 3",
      explanation:
        "Click Calculate to get the precise age in years, months, and days.",
    },
  ],
  result: "The child is 9 years, 2 months, and 5 days old as of 2024-06-15.",
};

export default function AgeCalculator() {
  const [inputs, setInputs] = useState({
    startDate: "",
    endDate: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    try {
      if (!inputs.startDate || !inputs.endDate) {
        return null;
      }
      const start = new Date(inputs.startDate + "T00:00:00");
      const end = new Date(inputs.endDate + "T00:00:00");

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return {
          primary: "Invalid date(s)",
          secondary: "",
          details: "Please enter valid start and end dates.",
          feedback: "",
        };
      }

      if (end < start) {
        return {
          primary: "End date before start date",
          secondary: "",
          details: "End Date must be the same or after Start Date.",
          feedback: "",
        };
      }

      const age = calculateAge(start, end);
      if (!age) {
        return {
          primary: "Error",
          secondary: "",
          details: "Could not calculate age difference.",
          feedback: "",
        };
      }

      const { years, months, days } = age;

      const primary = `${years} year${years !== 1 ? "s" : ""}, ${months} month${
        months !== 1 ? "s" : ""
      }, ${days} day${days !== 1 ? "s" : ""}`;

      const secondary = `From ${inputs.startDate} to ${inputs.endDate}`;

      const details = `Total duration is ${years} full year${
        years !== 1 ? "s" : ""
      }, ${months} full month${months !== 1 ? "s" : ""}, and ${days} day${
        days !== 1 ? "s" : ""
      }.`;

      const feedback =
        "This calculation accounts for varying month lengths and leap years by using calendar arithmetic.";

      return { primary, secondary, details, feedback };
    } catch {
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
        "This calculator uses calendar arithmetic based on JavaScript Date objects, which inherently account for leap years. When calculating the difference between two dates, it correctly includes February 29 in leap years, ensuring accurate age calculations even when the period spans multiple leap years.",
    },
    {
      question: "Can I calculate age if the end date is before the start date?",
      answer:
        "No, the calculator requires the end date to be the same as or after the start date. If the end date is earlier, the calculator will display an error message prompting you to correct the input. This ensures meaningful and logical age or duration results.",
    },
    {
      question: "Does the calculator consider time zones or daylight saving time?",
      answer:
        "This calculator uses dates without specific times (midnight UTC) to avoid complications from time zones or daylight saving time changes. It focuses on full calendar days, so time zone differences or DST shifts do not affect the age calculation.",
    },
    {
      question: "Why does the calculator sometimes show fewer days than expected?",
      answer:
        "The calculator uses calendar-based subtraction, which can result in fewer days if the end date's day of the month is earlier than the start date's day. It borrows days from the previous month to keep the calculation accurate, reflecting real-world calendar differences rather than a simple day count.",
    },
    {
      question: "Can this calculator be used for durations longer than a year?",
      answer:
        "Yes, the calculator is designed to handle durations of any length, from a single day to multiple years. It breaks down the total duration into years, months, and days, providing a clear and precise representation of the time elapsed between the two dates.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

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
        "Comprehensive documentation on JavaScript Date object and its methods used for date manipulation.",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date",
    },
    {
      title: "Understanding Leap Years",
      description:
        "Detailed explanation of leap years and their impact on calendar calculations.",
      url: "https://www.timeanddate.com/date/leapyear.html",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={inputs.startDate}
            onChange={(e) => handleInputChange("startDate", e.target.value)}
            max={inputs.endDate || undefined}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="date"
            value={inputs.endDate}
            onChange={(e) => handleInputChange("endDate", e.target.value)}
            min={inputs.startDate || undefined}
          />
        </div>
      </div>

      <Button
        className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg"
        onClick={() => {
          // No extra action needed, calculation is reactive
        }}
        disabled={!inputs.startDate || !inputs.endDate}
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
            {results.feedback && (
              <p className="text-xs text-slate-400 mt-1 italic">
                {results.feedback}
              </p>
            )}
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
          <li>Enter the Start Date (e.g., birth date or project start date).</li>
          <li>Enter the End Date (e.g., current date or project end date).</li>
          <li>
            Click the "Calculate" button to compute the exact difference in
            years, months, and days.
          </li>
          <li>
            Review the result displayed below, which shows the precise age or
            duration.
          </li>
          <li>
            Use this information for planning, eligibility checks, or time
            management purposes.
          </li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Age Calculator (years/months/days)
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Calculating the precise age or duration between two dates requires
            understanding how calendar arithmetic works. The JavaScript Date
            object provides built-in methods to handle dates, including leap
            years and varying month lengths. Leap years occur every four years,
            adding an extra day (February 29) to keep the calendar aligned with
            the Earth's orbit. This calculator accounts for leap years by using
            the Date object’s native handling of dates.
          </p>
          <p>
            Time zones and Daylight Saving Time (DST) can complicate date
            calculations. However, this calculator uses dates without specific
            times (midnight UTC) to avoid errors caused by time zone shifts or
            DST changes. This ensures that the difference is calculated purely
            in calendar days, months, and years.
          </p>
          <p>
            The calculation logic subtracts years, months, and days separately,
            borrowing days from the previous month when necessary. This method
            reflects how humans typically measure age and durations, rather than
            simply counting total days. The result is a clear and intuitive
            representation of elapsed time.
          </p>
          <p>
            This tool is useful for many real-world applications such as
            determining a person's exact age for legal or medical purposes,
            calculating project durations, or planning events. Understanding the
            underlying concepts helps avoid common mistakes and ensures accurate
            results.
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
            1-hour errors when calculating durations with time components. This
            calculator avoids this by using date-only inputs without times.
          </p>
          <p>
            <strong>Invalid Date Order:</strong> Entering an end date before the
            start date will produce errors or nonsensical results. Always ensure
            the end date is the same or later than the start date.
          </p>
          <p>
            <strong>Ignoring Leap Years:</strong> Some manual calculations
            overlook leap days, causing off-by-one errors in age or duration.
            This tool accounts for leap years automatically.
          </p>
          <p>
            <strong>Assuming Fixed Month Lengths:</strong> Months vary from 28
            to 31 days. This calculator uses calendar months, not fixed day
            counts, for accuracy.
          </p>
          <p>
            <strong>Time Zone Effects:</strong> Calculations involving local
            times can be skewed by time zone differences. Using date-only inputs
            prevents this issue.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Real World Example
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>{example.scenario}</p>
          <ol className="list-decimal pl-5 space-y-2">
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

      <section id="faq" className="scroll-mt-24">
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

      <section id="references" className="scroll-mt-24">
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
      title="Age Calculator (years/months/days)"
      description="Professional time calculator: Age Calculator (years/months/days). Precise calculations, time zone handling, and scheduling tools."
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