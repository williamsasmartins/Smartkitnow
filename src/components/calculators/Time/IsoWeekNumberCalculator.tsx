import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Clock, BookOpen, AlertTriangle, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

function getISOWeekNumber(date: Date) {
  // Copy date so don't modify original
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  // Set to nearest Thursday: current date + 4 - current day number (Monday=1, Sunday=7)
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  // Year of the Thursday
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  // Calculate full weeks to nearest Thursday
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return { year: d.getUTCFullYear(), week: weekNo };
}

function getISOWeekStartDate(year: number, week: number) {
  // ISO weeks start on Monday
  const simple = new Date(Date.UTC(year, 0, 1 + (week - 1) * 7));
  const day = simple.getUTCDay() || 7;
  if (day <= 4) simple.setUTCDate(simple.getUTCDate() - day + 1);
  else simple.setUTCDate(simple.getUTCDate() + 8 - day);
  return simple;
}

function formatDateISO(date: Date) {
  return date.toISOString().slice(0, 10);
}

export default function IsoWeekNumberCalculator() {
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

      // If endDate empty, just show week number of startDate
      if (!inputs.endDate) {
        const { year, week } = getISOWeekNumber(start);
        return {
          primary: `Week ${week}`,
          secondary: `ISO Week Number for ${formatDateISO(start)}`,
          details: `The date ${formatDateISO(start)} falls in ISO week number ${week} of year ${year}.`,
          feedback: "",
        };
      }

      const end = new Date(inputs.endDate);
      if (isNaN(end.getTime())) return null;

      if (end < start) {
        return {
          primary: "Invalid Range",
          secondary: "End date is before start date",
          details: "Please select an end date that is the same or after the start date.",
          feedback: "",
        };
      }

      // Calculate difference in days
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

      // Calculate difference in weeks (ISO weeks)
      // Find ISO week for start and end
      const startISO = getISOWeekNumber(start);
      const endISO = getISOWeekNumber(end);

      // Calculate week difference considering year change
      let weekDiff = 0;
      if (startISO.year === endISO.year) {
        weekDiff = endISO.week - startISO.week + 1;
      } else if (endISO.year > startISO.year) {
        // Weeks in start year
        const lastWeekOfStartYear = getISOWeekNumber(new Date(Date.UTC(startISO.year, 11, 31))).week;
        weekDiff = lastWeekOfStartYear - startISO.week + 1 + endISO.week;
      } else {
        // Should not happen as end >= start
        weekDiff = 0;
      }

      return {
        primary: `${diffDays} day${diffDays !== 1 ? "s" : ""}`,
        secondary: `${weekDiff} ISO week${weekDiff !== 1 ? "s" : ""} between selected dates`,
        details: `From ${formatDateISO(start)} (Week ${startISO.week}, ${startISO.year}) to ${formatDateISO(end)} (Week ${endISO.week}, ${endISO.year}).`,
        feedback: "Note: Weeks are calculated according to ISO 8601 standard where weeks start on Monday.",
      };
    } catch {
      return null;
    }
  }, [inputs]);

  const faqs = [
    {
      question: "What is an ISO week number?",
      answer:
        "An ISO week number is a standardized way to number weeks in a year, defined by the ISO 8601 standard. Weeks start on Monday, and the first week of the year is the one containing the first Thursday. This system ensures consistent week numbering across years and countries.",
    },
    {
      question: "How does this calculator handle leap years?",
      answer:
        "Leap years add an extra day (February 29) every four years to keep the calendar aligned with Earth's orbit. This calculator uses JavaScript's Date object, which automatically accounts for leap years when calculating date differences and week numbers.",
    },
    {
      question: "Can I calculate the week number for a single date?",
      answer:
        "Yes, if you provide only a start date and leave the end date empty, the calculator will return the ISO week number for that single date. This helps you quickly identify which week of the year a specific date falls into.",
    },
    {
      question: "Why do weeks sometimes span two different years?",
      answer:
        "ISO weeks can span two calendar years because the first and last weeks of a year are defined by the presence of Thursdays. For example, January 1st might belong to the last week of the previous year if it falls before the first Thursday.",
    },
    {
      question: "Does this calculator consider time zones or daylight saving time?",
      answer:
        "This calculator uses UTC-based calculations to avoid errors caused by time zones or daylight saving time changes. It focuses on date components only, ensuring consistent and reliable week number and duration calculations.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "Planning a project from January 1st to March 15th, you want to know the total duration in days and how many ISO weeks the project spans.",
    steps: [
      {
        label: "Step 1",
        explanation: "Enter the project start date as 2024-01-01 in the Start Date field.",
      },
      {
        label: "Step 2",
        explanation: "Enter the project end date as 2024-03-15 in the End Date field.",
      },
      {
        label: "Step 3",
        explanation: "Click the Calculate button to see the total days and ISO weeks covered by the project.",
      },
    ],
    result:
      "The calculator shows the project lasts 75 days and spans 11 ISO weeks, helping you plan resources and milestones effectively.",
  };

  const references = [
    {
      title: "Time and Date Standards (ISO 8601)",
      description: "International standard for date and time representation.",
      url: "https://www.iso.org/iso-8601-date-and-time-format.html",
    },
    {
      title: "Understanding ISO Week Dates",
      description: "Detailed explanation of ISO week date system.",
      url: "https://en.wikipedia.org/wiki/ISO_week_date",
    },
    {
      title: "JavaScript Date Object",
      description: "Official MDN documentation for JavaScript Date methods.",
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
            {results.feedback && <p className="mt-1 text-xs italic text-slate-400">{results.feedback}</p>}
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
          <li>Enter the start date in the "Start Date" field using the YYYY-MM-DD format.</li>
          <li>
            Optionally, enter the end date in the "End Date" field. If left empty, the calculator will show the ISO week
            number for the start date only.
          </li>
          <li>Click the "Calculate" button to compute the duration and ISO week numbers.</li>
          <li>
            Review the results displayed below, which include the total days between dates and the ISO week numbers for
            each date.
          </li>
          <li>Use this information for scheduling, planning, or understanding week-based timelines.</li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Week Number & ISO Week Finder
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            The ISO week date system is an international standard (ISO 8601) for representing weeks and dates. Unlike the
            traditional calendar, ISO weeks start on Monday and are numbered from 1 to 52 or 53, depending on the year.
            The first week of the year is the one that contains the first Thursday, ensuring consistency across years.
          </p>
          <p>
            Leap years, occurring every four years, add an extra day (February 29) to keep the calendar aligned with the
            Earth's orbit around the Sun. JavaScript's Date object automatically accounts for leap years in calculations,
            so you don't need to handle them manually.
          </p>
          <p>
            Daylight Saving Time (DST) can cause confusion in time calculations due to clock shifts. This calculator uses
            UTC-based date calculations to avoid errors caused by DST or time zone differences. It focuses solely on date
            components, ensuring accurate week number and duration results.
          </p>
          <p>
            Understanding ISO weeks is essential for businesses and projects that rely on week-based scheduling, reporting,
            or planning. This calculator helps you quickly find the ISO week number for any date and calculate the duration
            between two dates in days and weeks.
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
            <strong>DST Confusion:</strong> Daylight Saving Time changes can cause 1-hour discrepancies in time-based
            calculations. This calculator avoids this by using UTC dates, but users sometimes input local times causing
            confusion.
          </p>
          <p>
            <strong>Incorrect Date Formats:</strong> Always use the YYYY-MM-DD format for date inputs. Other formats may
            lead to parsing errors or unexpected results.
          </p>
          <p>
            <strong>End Date Before Start Date:</strong> Ensure the end date is the same or after the start date. Otherwise,
            the calculator will show an invalid range.
          </p>
          <p>
            <strong>Misunderstanding ISO Weeks:</strong> ISO weeks start on Monday, not Sunday. Some users expect Sunday as
            the first day, leading to confusion about week numbers.
          </p>
          <p>
            <strong>Ignoring Leap Years:</strong> Leap years add an extra day, but the JavaScript Date object handles this
            automatically. Manual adjustments are unnecessary and may cause errors.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">Real World Example</h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            <strong>Scenario:</strong> {example.scenario}
          </p>
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

      <section id="faq" className="scroll-mt-24">
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

      <section id="references" className="scroll-mt-24">
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
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{ref.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Week Number & ISO Week Finder"
      description="Professional time calculator: Week Number & ISO Week Finder. Precise calculations, time zone handling, and scheduling tools."
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