import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertTriangle, BookOpen, Clock, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CountdownTimerCalculator() {
  // ADAPT STATE BASED ON DATE DURATION. Inputs: Start Date, End Date. Logic: Date diff.
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
        return {
          primary: "",
          secondary: "",
          details: "Please enter both start and end dates.",
          feedback: "",
        };
      }

      const start = new Date(inputs.startDate);
      const end = new Date(inputs.endDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return {
          primary: "",
          secondary: "",
          details: "Invalid date format. Please use YYYY-MM-DD.",
          feedback: "",
        };
      }

      if (end < start) {
        return {
          primary: "",
          secondary: "",
          details: "End date must be after start date.",
          feedback: "",
        };
      }

      // Calculate difference in milliseconds
      const diffMs = end.getTime() - start.getTime();

      // Calculate days, hours, minutes, seconds
      const totalSeconds = Math.floor(diffMs / 1000);
      const days = Math.floor(totalSeconds / (3600 * 24));
      const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      // Business days calculation (exclude Sat/Sun)
      let businessDays = 0;
      for (
        let d = new Date(start);
        d <= end;
        d.setDate(d.getDate() + 1)
      ) {
        const day = d.getDay();
        if (day !== 0 && day !== 6) businessDays++;
      }

      return {
        primary: `${days}d ${hours}h ${minutes}m ${seconds}s`,
        secondary: `Total duration`,
        details: `Includes ${businessDays} business day${businessDays !== 1 ? "s" : ""} between the dates.`,
        feedback: "",
      };
    } catch (error) {
      return {
        primary: "",
        secondary: "",
        details: "An error occurred while calculating. Please check your inputs.",
        feedback: "",
      };
    }
  }, [inputs]);

  const faqs = [
    {
      question: "How does this countdown timer calculate the difference between two dates?",
      answer:
        "This countdown timer calculates the difference by converting the start and end dates into JavaScript Date objects, then computing the difference in milliseconds. It then converts this difference into days, hours, minutes, and seconds to provide a precise countdown duration.",
    },
    {
      question: "Does the calculator consider time zones or daylight saving time?",
      answer:
        "The calculator uses the local time zone of the user's browser when parsing dates. It does not automatically adjust for different time zones or daylight saving time changes, so results may vary if dates are entered from different zones or during DST transitions.",
    },
    {
      question: "What are business days and how are they calculated here?",
      answer:
        "Business days refer to weekdays excluding weekends (Saturday and Sunday). This calculator counts the number of weekdays between the start and end dates, excluding Saturdays and Sundays, to provide a business day count.",
    },
    {
      question: "Can I use this calculator for countdowns including time of day?",
      answer:
        "Currently, the calculator accepts only dates (YYYY-MM-DD) without specific times. For countdowns including hours, minutes, and seconds, you would need to extend the input fields to accept time values as well.",
    },
    {
      question: "What happens if the end date is before the start date?",
      answer:
        "If the end date is before the start date, the calculator will notify you that the end date must be after the start date and will not perform the countdown calculation.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "Planning a software development project starting on January 1st, 2024, and ending on March 15th, 2024. You want to know the total countdown duration and how many business days are available for work.",
    steps: [
      {
        label: "Step 1",
        explanation: "Enter the project start date as 2024-01-01.",
      },
      {
        label: "Step 2",
        explanation: "Enter the project end date as 2024-03-15.",
      },
      {
        label: "Step 3",
        explanation:
          "Click the Calculate button to see the total countdown duration and business days.",
      },
    ],
    result:
      "The countdown timer shows 74 days, 0 hours, 0 minutes, and 0 seconds, with 53 business days available for project work.",
  };

  const references = [
    {
      title: "Time and Date Standards (ISO 8601)",
      description:
        "International standard for date and time representation, ensuring consistent formatting and interpretation.",
      url: "https://www.iso.org/iso-8601-date-and-time-format.html",
    },
    {
      title: "JavaScript Date Object - MDN",
      description:
        "Comprehensive documentation on JavaScript's Date object and its methods for date/time manipulation.",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date",
    },
    {
      title: "Daylight Saving Time and Time Zones",
      description:
        "Explanation of how daylight saving time and time zones affect date and time calculations.",
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
            aria-describedby="startDateHelp"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="date"
            value={inputs.endDate}
            onChange={(e) => handleInputChange("endDate", e.target.value)}
            aria-describedby="endDateHelp"
          />
        </div>
      </div>

      <Button
        className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg"
        onClick={() => {}}
        aria-label="Calculate countdown timer"
      >
        <Clock className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results.primary && (
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

      {!results.primary && results.details && (
        <p className="text-center text-sm text-red-600 mt-4">{results.details}</p>
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
          <li>Enter the start date of your countdown in the "Start Date" field.</li>
          <li>Enter the end date of your countdown in the "End Date" field.</li>
          <li>Click the "Calculate" button to compute the time difference.</li>
          <li>
            View the result showing the total days, hours, minutes, and seconds between the two dates.
          </li>
          <li>
            Review the additional information about business days included in the countdown.
          </li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Countdown Timer (until a date/time)
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            The countdown timer calculates the duration between two specified dates using the JavaScript Date object. It measures the difference in milliseconds and converts it into days, hours, minutes, and seconds for easy interpretation. When working with dates, it is important to consider factors such as leap years, which add an extra day (February 29) every four years to keep the calendar year synchronized with the astronomical year. This can affect the total day count in long durations.
          </p>
          <p>
            Time zones also play a crucial role in date calculations. The JavaScript Date object uses the local time zone of the user's environment by default, which means that the same date string can represent different moments in time depending on the user's location. Daylight Saving Time (DST) further complicates this by shifting clocks forward or backward by one hour during certain periods of the year, potentially causing one-hour discrepancies in calculations if not handled carefully.
          </p>
          <p>
            This calculator currently assumes dates without specific times and uses local time for calculations. For more precise countdowns involving time zones or exact times, additional inputs and logic would be necessary. Business days are calculated by excluding weekends (Saturday and Sunday), which is useful for project planning and work schedules. Understanding these concepts helps ensure accurate and meaningful countdown calculations.
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
            <strong>DST Confusion:</strong> Daylight Saving Time transitions can cause unexpected one-hour differences in countdowns if times are included or if dates cross DST boundaries. Always verify if your dates fall within DST periods.
          </p>
          <p>
            <strong>Incorrect Date Formats:</strong> Using non-standard or locale-specific date formats can lead to parsing errors. Always use the ISO 8601 format (YYYY-MM-DD) to ensure consistent results.
          </p>
          <p>
            <strong>End Date Before Start Date:</strong> Entering an end date that is earlier than the start date will produce invalid results. The calculator requires the end date to be the same or later than the start date.
          </p>
          <p>
            <strong>Ignoring Time Zones:</strong> This calculator uses local time zones and does not adjust for differences between time zones. For cross-time-zone countdowns, additional handling is required.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Real World Example
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            <strong>Scenario:</strong> Planning a software development project starting on January 1st, 2024, and ending on March 15th, 2024. You want to know the total countdown duration and how many business days are available for work.
          </p>
          <ol>
            <li>Enter the project start date as 2024-01-01.</li>
            <li>Enter the project end date as 2024-03-15.</li>
            <li>Click the Calculate button to see the total countdown duration and business days.</li>
          </ol>
          <p>
            <strong>Result:</strong> The countdown timer shows 74 days, 0 hours, 0 minutes, and 0 seconds, with 53 business days available for project work.
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
      title="Countdown Timer (until a date/time)"
      description="Professional time calculator: Countdown Timer (until a date/time). Precise calculations, time zone handling, and scheduling tools."
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