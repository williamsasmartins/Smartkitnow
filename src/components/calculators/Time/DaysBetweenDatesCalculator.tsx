import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertTriangle, BookOpen, Clock, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function DaysBetweenDatesCalculator() {
  // State for start and end dates
  const [inputs, setInputs] = useState({
    startDate: "",
    endDate: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Calculate difference in days between two dates
  const results = useMemo(() => {
    const { startDate, endDate } = inputs;
    if (!startDate || !endDate) {
      return {
        primary: "-",
        secondary: "Please enter both dates",
        details: "",
        feedback: "",
      };
    }

    try {
      // Parse dates as UTC to avoid timezone issues
      const start = new Date(startDate + "T00:00:00Z");
      const end = new Date(endDate + "T00:00:00Z");

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return {
          primary: "-",
          secondary: "Invalid date format",
          details: "",
          feedback: "",
        };
      }

      if (end < start) {
        return {
          primary: "-",
          secondary: "End date must be after start date",
          details: "",
          feedback: "",
        };
      }

      // Calculate difference in milliseconds
      const diffMs = end.getTime() - start.getTime();

      // Convert ms to days (1 day = 86400000 ms)
      const diffDays = diffMs / (1000 * 60 * 60 * 24);

      // Also calculate business days (exclude Sat/Sun)
      let businessDays = 0;
      for (
        let d = new Date(start);
        d <= end;
        d.setUTCDate(d.getUTCDate() + 1)
      ) {
        const day = d.getUTCDay();
        if (day !== 0 && day !== 6) businessDays++;
      }

      return {
        primary: diffDays.toString(),
        secondary: `${diffDays} total days`,
        details: `${businessDays} business days (Mon-Fri)`,
        feedback:
          "Note: This calculation assumes dates are in UTC and excludes time components.",
      };
    } catch (error) {
      return {
        primary: "-",
        secondary: "Error calculating difference",
        details: "",
        feedback: "",
      };
    }
  }, [inputs]);

  const faqs = [
    {
      question: "How does this calculator handle leap years?",
      answer:
        "This calculator uses JavaScript's Date object which automatically accounts for leap years when calculating the difference between dates. Leap days (February 29) are included in the total day count if they fall within the date range.",
    },
    {
      question: "Why do I get different results if I change my time zone?",
      answer:
        "The calculator treats input dates as UTC dates at midnight to avoid discrepancies caused by time zones or daylight saving time changes. If you input dates without times, the calculation remains consistent regardless of your local time zone.",
    },
    {
      question: "Can I calculate business days only?",
      answer:
        "Yes, the calculator provides the number of business days (Monday through Friday) between the two dates, excluding weekends. However, it does not currently exclude public holidays.",
    },
    {
      question: "What happens if the end date is before the start date?",
      answer:
        "The calculator will notify you that the end date must be after the start date and will not perform the calculation until valid dates are entered.",
    },
    {
      question: "Does the calculator consider time components like hours and minutes?",
      answer:
        "No, this calculator only considers full days by treating both dates as starting at midnight UTC. Time components are ignored to provide a clear day count between dates.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "Planning a software development project from January 1st, 2024 to March 15th, 2024, you want to know how many total and business days are available for scheduling tasks and milestones.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Enter the project start date as 2024-01-01 in the Start Date field.",
      },
      {
        label: "Step 2",
        explanation:
          "Enter the project end date as 2024-03-15 in the End Date field.",
      },
      {
        label: "Step 3",
        explanation:
          "Click the Calculate button to see the total days and business days between these dates.",
      },
    ],
    result:
      "The calculator will show 74 total days and 53 business days, helping you plan your project timeline effectively.",
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
        "Comprehensive documentation on JavaScript's Date object and its methods.",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date",
    },
    {
      title: "Time Zone and Daylight Saving Time",
      description:
        "Explanation of time zones and daylight saving time effects on date and time calculations.",
      url: "https://www.timeanddate.com/time/dst/",
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
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="date"
            value={inputs.endDate}
            onChange={(e) => handleInputChange("endDate", e.target.value)}
          />
        </div>
      </div>

      <Button
        className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg"
        onClick={() => {}}
        aria-label="Calculate days between dates"
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
            <p className="text-sm text-slate-600 mt-1">{results.details}</p>
            <p className="text-xs text-slate-500 mt-2">{results.feedback}</p>
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
          <li>Enter the start date of your period in the Start Date field.</li>
          <li>Enter the end date of your period in the End Date field.</li>
          <li>
            Click the "Calculate" button to compute the total number of days
            between the two dates.
          </li>
          <li>
            Review the results showing total days and business days (Monday to
            Friday).
          </li>
          <li>
            Use this information for scheduling, planning projects, or tracking
            durations.
          </li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Days Between Dates (date duration)
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Calculating the number of days between two dates is a common task in
            project management, scheduling, and time tracking. This calculator
            uses the JavaScript Date object to accurately determine the duration
            between your selected start and end dates. It treats dates as UTC
            midnight times to avoid discrepancies caused by time zones or
            daylight saving time (DST) changes.
          </p>
          <p>
            <strong>Leap Years:</strong> Leap years add an extra day (February
            29) every four years, which this calculator automatically accounts
            for by relying on the Date object’s internal logic. If your date
            range includes a leap day, it will be included in the total count.
          </p>
          <p>
            <strong>Time Zones and UTC:</strong> Time zones can cause confusion
            when calculating date differences because the same moment in time
            can correspond to different local dates. To avoid this, the
            calculator treats all dates as UTC dates at midnight, ensuring
            consistent results regardless of your local time zone.
          </p>
          <p>
            <strong>Daylight Saving Time (DST):</strong> DST shifts clocks
            forward or backward by one hour, which can cause errors if time
            components are considered. Since this calculator ignores time of
            day and focuses on full days, DST changes do not affect the results.
          </p>
          <p>
            <strong>Business Days:</strong> The calculator also provides the
            count of business days, excluding Saturdays and Sundays. This is
            useful for work-related planning but does not exclude public
            holidays, which vary by region.
          </p>
          <p>
            By understanding these concepts, you can confidently use this tool
            for accurate date duration calculations in a variety of contexts.
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
            1-hour errors if time components are included. This calculator
            avoids this by using UTC midnight times.
          </p>
          <p>
            <strong>Incorrect Date Formats:</strong> Enter dates in the
            standard YYYY-MM-DD format. Other formats may cause parsing errors.
          </p>
          <p>
            <strong>End Date Before Start Date:</strong> Ensure the end date is
            not earlier than the start date to get a valid result.
          </p>
          <p>
            <strong>Ignoring Time Zones:</strong> Calculations assume UTC dates
            to avoid discrepancies. Local time zone differences can affect
            results if times are included.
          </p>
          <p>
            <strong>Expecting Holidays Excluded:</strong> Business days exclude
            weekends only; public holidays are not accounted for.
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
      title="Days Between Dates (date duration)"
      description="Professional time calculator: Days Between Dates (date duration). Precise calculations, time zone handling, and scheduling tools."
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