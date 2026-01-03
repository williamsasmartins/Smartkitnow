import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertTriangle, BookOpen, Clock, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

function doomsday(year: number): number {
  // Calculate the Doomsday for the given year using the Doomsday algorithm
  // Returns the weekday number (0=Sunday,...6=Saturday)
  const anchorDays = [2, 0, 5, 3]; // For centuries: 1800s=Friday(5), 1900s=Wednesday(3), 2000s=Tuesday(2), 2100s=Sunday(0)
  const century = Math.floor(year / 100);
  const anchor = (() => {
    switch (century % 4) {
      case 0: return 2; // 2000s Tuesday
      case 1: return 0; // 2100s Sunday (0)
      case 2: return 5; // 2200s Friday (5)
      case 3: return 3; // 1900s Wednesday (3)
      default: return 2;
    }
  })();

  const y = year % 100;
  const a = Math.floor(y / 12);
  const b = y % 12;
  const c = Math.floor(b / 4);
  const d = (a + b + c + anchor) % 7;
  return d;
}

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

function getDoomsdayMonthDay(month: number, leap: boolean): number {
  // Returns the "Doomsday" date for the given month
  // Reference: https://en.wikipedia.org/wiki/Doomsday_rule
  switch (month) {
    case 1: return leap ? 4 : 3; // Jan
    case 2: return leap ? 29 : 28; // Feb
    case 3: return 14;
    case 4: return 4;
    case 5: return 9;
    case 6: return 6;
    case 7: return 11;
    case 8: return 8;
    case 9: return 5;
    case 10: return 10;
    case 11: return 7;
    case 12: return 12;
    default: return 0;
  }
}

function dayOfWeekDoomsday(date: Date): string {
  // Calculate day of week using Doomsday algorithm
  // 0=Sunday, 1=Monday,...6=Saturday
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const leap = isLeapYear(year);
  const doomsdayWeekday = doomsday(year);

  const doomsdayMonthDay = getDoomsdayMonthDay(month, leap);

  // Calculate difference between the date and the doomsday date for the month
  const diff = day - doomsdayMonthDay;

  // Calculate weekday
  let weekday = (doomsdayWeekday + diff) % 7;
  if (weekday < 0) weekday += 7;

  return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][weekday];
}

function dateDiffInDays(start: Date, end: Date): number {
  // Calculate difference in days between two dates (end - start)
  const msPerDay = 1000 * 60 * 60 * 24;
  const utcStart = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  const utcEnd = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
  return Math.floor((utcEnd - utcStart) / msPerDay);
}

function businessDaysBetween(start: Date, end: Date): number {
  // Calculate business days between two dates (excluding Sat/Sun)
  let count = 0;
  const current = new Date(start);
  while (current <= end) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) count++;
    current.setDate(current.getDate() + 1);
  }
  return count;
}

export default function DayOfWeekForDateCalculator() {
  const [inputs, setInputs] = useState({
    startDate: "",
    endDate: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    try {
      if (!inputs.startDate) return null;

      const start = new Date(inputs.startDate);
      if (isNaN(start.getTime())) return null;

      const startDay = dayOfWeekDoomsday(start);

      if (!inputs.endDate) {
        return {
          primary: startDay,
          secondary: `Day of week for ${inputs.startDate}`,
          details: `Using the Doomsday rule, ${inputs.startDate} falls on a ${startDay}.`,
          feedback: "",
        };
      }

      const end = new Date(inputs.endDate);
      if (isNaN(end.getTime())) return {
        primary: startDay,
        secondary: `Day of week for ${inputs.startDate}`,
        details: `Using the Doomsday rule, ${inputs.startDate} falls on a ${startDay}.`,
        feedback: "",
      };

      if (end < start) {
        return {
          primary: "Invalid range",
          secondary: "End date is before start date",
          details: "Please select an end date that is the same or after the start date.",
          feedback: "",
        };
      }

      const endDay = dayOfWeekDoomsday(end);
      const diffDays = dateDiffInDays(start, end);
      const businessDays = businessDaysBetween(start, end);

      return {
        primary: `${diffDays} day${diffDays !== 1 ? "s" : ""}`,
        secondary: `From ${startDay} to ${endDay}`,
        details: `Total days: ${diffDays}. Business days (Mon-Fri): ${businessDays}.`,
        feedback: `Start date (${inputs.startDate}) is a ${startDay}. End date (${inputs.endDate}) is a ${endDay}.`,
      };
    } catch {
      return {
        primary: "Error",
        secondary: "Invalid input",
        details: "Please enter valid dates in the correct format.",
        feedback: "",
      };
    }
  }, [inputs]);

  const faqs = [
    {
      question: "What is the Doomsday rule and how does it work?",
      answer:
        "The Doomsday rule is a mental algorithm to quickly determine the day of the week for any given date. It uses a fixed 'doomsday' for each year, which is a weekday that certain dates fall on, and calculates the offset from these known dates to find the weekday of any date. This method is efficient and requires only simple arithmetic.",
    },
    {
      question: "How does this calculator handle leap years?",
      answer:
        "Leap years are years where February has 29 days instead of 28, occurring generally every 4 years except for years divisible by 100 but not by 400. This calculator accounts for leap years in the Doomsday rule by adjusting the anchor dates for January and February accordingly, ensuring accurate day of week calculations.",
    },
    {
      question: "Why might the day of week differ if I use different time zones?",
      answer:
        "The day of week can differ across time zones because the local date may shift depending on the offset from UTC. This calculator uses the local date as input without time zone conversion, so for precise time zone-aware calculations, additional adjustments are necessary. Time zones and daylight saving time can affect the perceived day.",
    },
    {
      question: "Can I calculate the number of business days between two dates?",
      answer:
        "Yes, this calculator includes the logic to count business days (Monday through Friday) between two dates, excluding weekends. This is useful for project planning and scheduling where only working days are considered. Holidays are not accounted for and would require additional data.",
    },
    {
      question: "What happens if the end date is before the start date?",
      answer:
        "If the end date is before the start date, the calculator will notify you that the date range is invalid. It requires the end date to be the same or later than the start date to compute the difference and day of week correctly.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "Planning a project from January 1st, 2024 to March 15th, 2024, you want to know the day of the week for both dates and the total duration including business days.",
    steps: [
      {
        label: "Step 1",
        explanation: "Enter the start date as 2024-01-01 and the end date as 2024-03-15.",
      },
      {
        label: "Step 2",
        explanation:
          "Click 'Calculate' to see the day of the week for both dates, the total number of days, and the number of business days excluding weekends.",
      },
      {
        label: "Step 3",
        explanation:
          "Use this information to schedule meetings, deadlines, and resource allocation effectively.",
      },
    ],
    result:
      "January 1st, 2024 is a Monday, March 15th, 2024 is a Friday, with a total of 74 days and 53 business days in between.",
  };

  const references = [
    {
      title: "Time and Date Standards (ISO 8601)",
      description: "International standard for date and time representation.",
      url: "https://www.iso.org/iso-8601-date-and-time-format.html",
    },
    {
      title: "Doomsday Rule - Wikipedia",
      description: "Detailed explanation of the Doomsday algorithm for calculating weekdays.",
      url: "https://en.wikipedia.org/wiki/Doomsday_rule",
    },
    {
      title: "Leap Year - Wikipedia",
      description: "Information about leap years and their rules.",
      url: "https://en.wikipedia.org/wiki/Leap_year",
    },
    {
      title: "MDN Web Docs - Date",
      description: "JavaScript Date object reference and usage.",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Start Date</Label>
          <Input
            type="date"
            value={inputs.startDate}
            onChange={(e) => handleInputChange("startDate", e.target.value)}
            placeholder="YYYY-MM-DD"
          />
        </div>
        <div className="space-y-2">
          <Label>End Date (optional)</Label>
          <Input
            type="date"
            value={inputs.endDate}
            onChange={(e) => handleInputChange("endDate", e.target.value)}
            placeholder="YYYY-MM-DD"
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" onClick={() => {}}>
        <Clock className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Result</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">{results.primary}</div>
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to use this calculator</h2>
        <ol className="list-decimal pl-5 space-y-3 text-slate-600 dark:text-slate-400">
          <li>Enter the start date in the first input field using the YYYY-MM-DD format.</li>
          <li>
            Optionally, enter an end date in the second input field to calculate the duration and business days between the two dates.
          </li>
          <li>Click the "Calculate" button to see the day of the week for the start date, and if provided, the day of the week for the end date along with the date difference.</li>
          <li>Review the results displayed below the button, including total days and business days (Monday to Friday) if an end date is provided.</li>
          <li>Use this information for scheduling, planning, or understanding date-related queries accurately.</li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Day of Week for Any Date (includes Doomsday rule)
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Calculating the day of the week for any given date can be done efficiently using the Doomsday rule, a mental algorithm developed by John Conway. The core idea is to find a specific weekday, called the "Doomsday," for each year, which serves as an anchor point. From this anchor, you calculate the offset to the target date to determine its weekday.
          </p>
          <p>
            Leap years, which add an extra day in February, affect the calculation by shifting the anchor dates for January and February. Leap years occur every 4 years, except for years divisible by 100 but not by 400, ensuring calendar accuracy over centuries. This calculator accounts for leap years to maintain precision.
          </p>
          <p>
            Time zones and Daylight Saving Time (DST) can influence the perceived day of the week because the local date may differ depending on the offset from Coordinated Universal Time (UTC). This tool uses the local date input without converting time zones, so for time zone-specific calculations, additional adjustments are necessary.
          </p>
          <p>
            When calculating durations between two dates, it's important to consider whether you want total days or business days. Business days exclude weekends (Saturday and Sunday) and are commonly used in work and project planning. This calculator provides both total and business day counts for your convenience.
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
            <strong>DST Confusion:</strong> Daylight Saving Time often causes 1-hour errors when calculating dates and times, but since this calculator uses only dates without time, DST does not affect the day of week result.
          </p>
          <p>
            <strong>Incorrect Date Formats:</strong> Entering dates in formats other than YYYY-MM-DD can cause parsing errors. Always use the ISO format to ensure accurate results.
          </p>
          <p>
            <strong>End Date Before Start Date:</strong> Providing an end date earlier than the start date will result in an invalid range error. Ensure the end date is the same or after the start date.
          </p>
          <p>
            <strong>Ignoring Leap Years:</strong> Not accounting for leap years can shift day calculations by one day in January and February. This calculator automatically adjusts for leap years.
          </p>
          <p>
            <strong>Assuming Holidays as Business Days:</strong> Business days exclude weekends but do not account for public holidays, which may affect scheduling in real-world scenarios.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">Real World Example</h2>
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
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently asked questions</h2>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
              <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">{faq.question}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{faq.answer}</p>
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
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
              >
                {ref.title} <ExternalLink className="w-3 h-3" />
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{ref.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Day of Week for Any Date (includes Doomsday rule)"
      description="Professional time calculator: Day of Week for Any Date (includes Doomsday rule). Precise calculations, time zone handling, and scheduling tools."
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