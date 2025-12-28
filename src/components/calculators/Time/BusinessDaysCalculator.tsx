import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertTriangle, BookOpen, Clock, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BusinessDaysCalculator() {
  // State for inputs: startDate and endDate as ISO strings (yyyy-mm-dd)
  const [inputs, setInputs] = useState({
    startDate: "",
    endDate: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Helper: Check if a date is weekend
  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // Sunday=0, Saturday=6
  };

  // For simplicity, mock a fixed list of holidays (month/day) - US Federal Holidays example (no year)
  // In real app, holidays should be dynamic or user-provided
  const holidays = [
    "01-01", // New Year's Day
    "07-04", // Independence Day
    "12-25", // Christmas Day
    "11-11", // Veterans Day
    "12-31", // New Year's Eve (optional)
  ];

  // Check if date is a holiday (month-day match)
  const isHoliday = (date: Date) => {
    const mmdd = date.toISOString().slice(5, 10);
    return holidays.includes(mmdd);
  };

  // Calculate business days excluding weekends and holidays
  const calculateBusinessDays = (start: Date, end: Date) => {
    if (end < start) return 0;

    let count = 0;
    let current = new Date(start);
    current.setHours(0, 0, 0, 0);
    const endDate = new Date(end);
    endDate.setHours(0, 0, 0, 0);

    while (current <= endDate) {
      if (!isWeekend(current) && !isHoliday(current)) {
        count++;
      }
      current.setDate(current.getDate() + 1);
    }
    return count;
  };

  const results = useMemo(() => {
    try {
      if (!inputs.startDate || !inputs.endDate) {
        return {
          primary: "-",
          secondary: "Please enter both dates",
          details: "",
          feedback: "",
        };
      }

      const start = new Date(inputs.startDate);
      const end = new Date(inputs.endDate);

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

      const businessDays = calculateBusinessDays(start, end);

      return {
        primary: businessDays.toString(),
        secondary: `Business days between ${inputs.startDate} and ${inputs.endDate}`,
        details:
          "Excludes weekends (Saturday and Sunday) and fixed-date holidays (New Year's Day, Independence Day, Veterans Day, Christmas Day, New Year's Eve).",
        feedback:
          "Note: Holidays are fixed-date and do not account for observed days or regional holidays.",
      };
    } catch (error) {
      return {
        primary: "-",
        secondary: "Error calculating business days",
        details: "",
        feedback: "",
      };
    }
  }, [inputs]);

  const faqs = [
    {
      question: "What are business days and why exclude weekends and holidays?",
      answer:
        "Business days typically refer to weekdays (Monday through Friday) when most businesses operate. Weekends (Saturday and Sunday) and public holidays are excluded because they are non-working days for many organizations. Calculating business days helps in project planning, payroll, and legal deadlines to reflect actual working time.",
    },
    {
      question: "How does this calculator handle holidays?",
      answer:
        "This calculator excludes a fixed set of common US federal holidays by matching month and day, regardless of the year. It does not account for holidays that fall on weekends and are observed on weekdays, nor does it include regional or company-specific holidays. For precise results, customize the holiday list accordingly.",
    },
    {
      question: "Does the calculator consider time zones or daylight saving time?",
      answer:
        "No, this calculator uses local dates without time zone adjustments or daylight saving time considerations. It calculates full calendar days and excludes weekends and holidays based on date only. For time zone sensitive calculations, additional logic or APIs would be required.",
    },
    {
      question: "Can I enter the start date after the end date?",
      answer:
        "No, the calculator requires the start date to be on or before the end date. If the start date is after the end date, it will show an error message prompting you to correct the input. This ensures meaningful and accurate business day calculations.",
    },
    {
      question: "How do leap years affect the calculation?",
      answer:
        "Leap years add an extra day (February 29) to the calendar every four years. This calculator counts all calendar days including leap days. Since weekends and holidays are excluded based on day of week and fixed dates, leap years do not affect the logic beyond adding that extra day if it falls within the date range.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "Planning a project from January 1st to March 15th, 2024, you want to know how many business days are available for work excluding weekends and major holidays.",
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
          "Click Calculate to find the number of business days excluding weekends and fixed holidays.",
      },
    ],
    result:
      "The calculator will return the total business days between these dates, helping you plan work schedules and deadlines effectively.",
  };

  const references = [
    {
      title: "Time and Date Standards (ISO 8601)",
      description: "International standard for date and time representation.",
      url: "https://www.iso.org/iso-8601-date-and-time-format.html",
    },
    {
      title: "US Federal Holidays",
      description:
        "Official list and dates of US federal holidays, useful for holiday exclusion.",
      url: "https://www.opm.gov/policy-data-oversight/pay-leave/federal-holidays/",
    },
    {
      title: "MDN Web Docs: Date",
      description:
        "Comprehensive documentation on JavaScript Date object and methods.",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date",
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
        onClick={() => {
          /* No explicit action needed, calculation is reactive */
        }}
        aria-label="Calculate business days"
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
              <p className="mt-1 text-xs italic text-slate-400">
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
          <li>Enter the project or task start date in the Start Date field.</li>
          <li>Enter the project or task end date in the End Date field.</li>
          <li>
            Click the "Calculate" button to compute the number of business days
            between the two dates.
          </li>
          <li>
            Review the result which excludes weekends (Saturday and Sunday) and
            fixed-date holidays.
          </li>
          <li>
            Use this information to plan schedules, deadlines, or resource
            allocation effectively.
          </li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Business Days Calculator (exclude weekends/holidays)
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Calculating business days between two dates is essential for accurate
            project planning, payroll processing, and legal compliance. Business
            days typically exclude weekends (Saturday and Sunday) and public
            holidays when most businesses are closed. This calculator uses the
            standard JavaScript Date object to iterate through each day in the
            range, counting only those days that are weekdays and not listed as
            holidays.
          </p>
          <p>
            <strong>Leap Years:</strong> Leap years add an extra day (February 29)
            every four years to keep the calendar year synchronized with the
            astronomical year. This calculator counts all days including leap days,
            so the presence of a leap year within the range will increase the total
            number of days accordingly.
          </p>
          <p>
            <strong>Time Zones and UTC:</strong> This calculator operates on local
            dates without time zone conversions. The JavaScript Date object uses
            the local time zone of the user's environment. For applications
            requiring precise time zone handling, additional logic or APIs would be
            necessary.
          </p>
          <p>
            <strong>Daylight Saving Time (DST):</strong> DST changes the local time
            by one hour during certain periods of the year. Since this calculator
            counts whole calendar days and excludes weekends and holidays by date,
            DST does not affect the calculation.
          </p>
          <p>
            <strong>Holidays:</strong> The calculator excludes a fixed set of common
            holidays by matching month and day. It does not account for holidays
            that shift when falling on weekends or regional holidays. For more
            accurate results, customize the holiday list or integrate with a
            holiday API.
          </p>
        </div>
      </section>

      <section
        id="mistakes"
        className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900"
      >
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" />
          Common Mistakes
        </h3>
        <div className="space-y-2 text-sm text-amber-900 dark:text-amber-100">
          <p>
            <strong>DST Confusion:</strong> Daylight Saving Time often causes
            confusion with time calculations. However, since this calculator
            operates on whole dates and excludes weekends/holidays by date, DST
            does not affect the business day count.
          </p>
          <p>
            <strong>Incorrect Date Order:</strong> Entering an end date before the
            start date will result in errors or zero results. Always ensure the
            start date is on or before the end date.
          </p>
          <p>
            <strong>Ignoring Holidays:</strong> The calculator uses a fixed holiday
            list and does not account for observed holidays or regional variations.
            For precise business day counts, customize the holiday list accordingly.
          </p>
          <p>
            <strong>Time Zone Assumptions:</strong> The calculator assumes local
            time zone dates and does not convert between time zones. For global
            projects, consider time zone differences separately.
          </p>
          <p>
            <strong>Using Non-Date Inputs:</strong> Ensure inputs are valid dates in
            the format yyyy-mm-dd. Invalid inputs will cause calculation errors.
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
          <BookOpen className="w-5 h-5 text-blue-500" />
          References & additional resources
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
      title="Business Days Calculator (exclude weekends/holidays)"
      description="Professional time calculator: Business Days Calculator (exclude weekends/holidays). Precise calculations, time zone handling, and scheduling tools."
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