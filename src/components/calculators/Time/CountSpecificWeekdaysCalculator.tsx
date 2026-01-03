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
import { Clock, BookOpen, AlertTriangle, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

const weekdays = [
  { label: "Sunday", value: 0 },
  { label: "Monday", value: 1 },
  { label: "Tuesday", value: 2 },
  { label: "Wednesday", value: 3 },
  { label: "Thursday", value: 4 },
  { label: "Friday", value: 5 },
  { label: "Saturday", value: 6 },
];

export default function CountSpecificWeekdaysCalculator() {
  // State for inputs: startDate, endDate, selected weekday
  const [inputs, setInputs] = useState({
    startDate: "",
    endDate: "",
    option: "5", // Default to Friday (5)
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Core logic: count how many times the selected weekday occurs between start and end dates inclusive
  const results = useMemo(() => {
    const { startDate, endDate, option } = inputs;
    if (!startDate || !endDate || option === "") {
      return {
        primary: "-",
        secondary: "Please enter all inputs",
        details: "",
        feedback: "",
      };
    }

    let start: Date;
    let end: Date;
    try {
      start = new Date(startDate);
      end = new Date(endDate);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new Error("Invalid date");
      }
    } catch {
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
        secondary: "End date must be after or equal to start date",
        details: "",
        feedback: "",
      };
    }

    const targetWeekday = Number(option);
    if (isNaN(targetWeekday) || targetWeekday < 0 || targetWeekday > 6) {
      return {
        primary: "-",
        secondary: "Invalid weekday selected",
        details: "",
        feedback: "",
      };
    }

    // Calculate total days difference inclusive
    const oneDayMs = 24 * 60 * 60 * 1000;
    const totalDays = Math.floor((end.getTime() - start.getTime()) / oneDayMs) + 1;

    // Find the first occurrence of the target weekday on or after start date
    const startWeekday = start.getDay();
    const daysToAdd = (targetWeekday - startWeekday + 7) % 7;
    // If the start date itself is the target weekday, daysToAdd = 0

    const firstOccurrence = new Date(start.getTime() + daysToAdd * oneDayMs);
    if (firstOccurrence > end) {
      // No occurrences in range
      return {
        primary: "0",
        secondary: `Number of ${weekdays[targetWeekday].label}s`,
        details: `No ${weekdays[targetWeekday].label}s found between ${startDate} and ${endDate}.`,
        feedback: "",
      };
    }

    // Count how many weeks fit between firstOccurrence and end date
    const diffMs = end.getTime() - firstOccurrence.getTime();
    const weeksCount = Math.floor(diffMs / (7 * oneDayMs)) + 1;

    return {
      primary: weeksCount.toString(),
      secondary: `Number of ${weekdays[targetWeekday].label}s`,
      details: `Between ${startDate} and ${endDate}, there are ${weeksCount} ${weekdays[targetWeekday].label}${
        weeksCount > 1 ? "s" : ""
      }.`,
      feedback: "",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "How does this calculator count specific weekdays between two dates?",
      answer:
        "This calculator counts the number of times a selected weekday (e.g., Friday) occurs between two given dates, inclusive. It calculates the first occurrence of the weekday on or after the start date, then counts how many full weeks fit until the end date. This method ensures accurate counts regardless of the date range length.",
    },
    {
      question: "Does the calculator consider time zones or daylight saving time?",
      answer:
        "The calculator uses JavaScript's standard Date object which operates in the local time zone of the user's device. It counts days based on calendar dates without adjusting for daylight saving time changes, as these do not affect the weekday count between dates.",
    },
    {
      question: "Can I count multiple weekdays at once with this tool?",
      answer:
        "Currently, the calculator supports counting one specific weekday at a time. To count multiple weekdays, you can run separate calculations for each desired weekday and sum the results manually.",
    },
    {
      question: "What happens if the end date is before the start date?",
      answer:
        "If the end date is earlier than the start date, the calculator will show an error message prompting you to enter a valid date range where the end date is the same or after the start date.",
    },
    {
      question: "Are leap years considered in the calculation?",
      answer:
        "Yes, leap years are inherently accounted for because the calculator works with actual calendar dates. The presence of February 29th in leap years does not affect the counting of weekdays between dates.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "Planning a weekly team meeting every Friday from January 1, 2024, to March 15, 2024. You want to know how many Fridays fall within this period to schedule all meetings.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Enter the start date as 2024-01-01 and the end date as 2024-03-15 in the calculator.",
      },
      {
        label: "Step 2",
        explanation:
          "Select 'Friday' from the weekday dropdown menu to specify which weekday to count.",
      },
      {
        label: "Step 3",
        explanation:
          "Click the Calculate button to get the total number of Fridays between these dates.",
      },
    ],
    result:
      "The calculator will show that there are 11 Fridays between January 1, 2024, and March 15, 2024, inclusive.",
  };

  const references = [
    {
      title: "Time and Date Standards (ISO 8601)",
      description: "International standard for date and time representation.",
      url: "https://www.iso.org/iso-8601-date-and-time-format.html",
    },
    {
      title: "MDN Web Docs - Date",
      description:
        "Comprehensive documentation on JavaScript Date object and methods.",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date",
    },
    {
      title: "Understanding Daylight Saving Time",
      description:
        "Explanation of daylight saving time and its impact on time calculations.",
      url: "https://www.timeanddate.com/time/dst/",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        <div className="space-y-2">
          <Label htmlFor="weekday">Select Weekday</Label>
          <Select
            value={inputs.option}
            onValueChange={(value) => handleInputChange("option", value)}
          >
            <SelectTrigger id="weekday" className="w-full">
              <SelectValue placeholder="Select a weekday" />
            </SelectTrigger>
            <SelectContent>
              {weekdays.map((day) => (
                <SelectItem key={day.value} value={day.value.toString()}>
                  {day.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" disabled={!inputs.startDate || !inputs.endDate || inputs.option === ""}>
        <Clock className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && results.primary !== "-" && (
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

      {results && results.primary === "-" && (
        <Card className="mt-6 bg-amber-50 border border-amber-400 shadow-md">
          <CardContent className="p-4 text-center text-amber-900 font-semibold">
            {results.secondary}
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
          <li>Enter the start date of your date range in the first input field.</li>
          <li>Enter the end date of your date range in the second input field.</li>
          <li>Select the specific weekday you want to count from the dropdown menu.</li>
          <li>Click the "Calculate" button to compute how many times that weekday occurs between the dates.</li>
          <li>Review the result displayed below the button, which shows the total count and details.</li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Count Specific Weekdays Between Dates (e.g., all Fridays)
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Counting specific weekdays between two dates is a common requirement in project planning, scheduling, and time management. This calculator uses the standard JavaScript Date object to handle date parsing and arithmetic. It calculates the first occurrence of the chosen weekday on or after the start date, then counts how many full weeks fit until the end date, inclusive. This approach ensures accuracy even across long date ranges.
          </p>
          <p>
            Leap years are naturally accounted for because the calculation works with actual calendar dates. February 29th in leap years does not affect the count of weekdays since the method counts occurrences based on the day of the week rather than total days. Time zones and daylight saving time (DST) changes do not impact the count because the calculator operates on calendar dates without considering time offsets or hours.
          </p>
          <p>
            The JavaScript Date object internally uses the local time zone of the user's device. While this can affect exact time calculations, counting weekdays between dates is unaffected by time zone differences or DST transitions because it only considers the day component. For global applications, it is recommended to use UTC dates or normalize inputs to avoid confusion, but for most use cases, local dates suffice.
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
            <strong>DST Confusion:</strong> Daylight Saving Time changes do not affect the count of weekdays between dates, but users sometimes expect time-based shifts to impact results. This calculator counts calendar days only.
          </p>
          <p>
            <strong>Incorrect Date Order:</strong> Entering an end date before the start date will cause errors or invalid results. Always ensure the end date is the same or after the start date.
          </p>
          <p>
            <strong>Time Zone Assumptions:</strong> The calculator uses local dates. If you input dates from different time zones without normalization, results may be inconsistent.
          </p>
          <p>
            <strong>Counting Multiple Weekdays:</strong> This tool counts one weekday at a time. Attempting to count multiple weekdays simultaneously requires multiple calculations.
          </p>
          <p>
            <strong>Off-by-One Errors:</strong> Remember that the calculation is inclusive of both start and end dates. Excluding either date will change the count.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Real World Example
        </h2>
        <article className="prose prose-slate dark:prose-invert max-w-none">
          <p>
            Suppose you are planning weekly team meetings every Friday starting from January 1, 2024, through March 15, 2024. You want to know how many Fridays fall within this period to schedule all meetings.
          </p>
          <ol>
            <li>Enter the start date as 2024-01-01 and the end date as 2024-03-15.</li>
            <li>Select "Friday" from the weekday dropdown menu.</li>
            <li>Click the Calculate button.</li>
          </ol>
          <p>
            The calculator will display that there are 11 Fridays between these dates, inclusive. This helps you plan the exact number of meetings without missing or double-counting any.
          </p>
        </article>
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
      title="Count Specific Weekdays Between Dates (e.g., all Fridays)"
      description="Professional time calculator: Count Specific Weekdays Between Dates (e.g., all Fridays). Precise calculations, time zone handling, and scheduling tools."
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