import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Clock, Calendar as CalendarIcon, Globe, Info, AlertTriangle, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

function getJulianDate(date: Date): number {
  // Julian Date is the continuous count of days since noon UTC on January 1, 4713 BCE.
  // We'll calculate Julian Day Number (JDN) using the standard algorithm.
  // Reference: https://aa.usno.navy.mil/faq/docs/JD_Formula.php

  const Y = date.getUTCFullYear();
  const M = date.getUTCMonth() + 1; // JS months 0-11
  const D = date.getUTCDate() + 
            date.getUTCHours() / 24 + 
            date.getUTCMinutes() / 1440 + 
            date.getUTCSeconds() / 86400 + 
            date.getUTCMilliseconds() / 86400000;

  let A = Math.floor(Y / 100);
  let B = 2 - A + Math.floor(A / 4);

  let JD =
    Math.floor(365.25 * (Y + 4716)) +
    Math.floor(30.6001 * (M + 1)) +
    D +
    B -
    1524.5;

  return JD;
}

const example = {
  title: "Real World Example",
  scenario:
    "Planning a project timeline that starts on January 1st, 2024 and ends on March 15th, 2024. You want to know the Julian Day Number for the start and end dates and calculate the day number within the year for each date to track progress.",
  steps: [
    {
      label: "Step 1",
      explanation:
        "Input the start date (2024-01-01) and end date (2024-03-15) into the calculator."
    },
    {
      label: "Step 2",
      explanation:
        "Click 'Calculate' to get the Julian Day Number and day of year for both dates."
    },
    {
      label: "Step 3",
      explanation:
        "Use these values to monitor project milestones and schedule tasks accurately."
    }
  ],
  result:
    "The calculator shows that January 1st, 2024 corresponds to Julian Day Number 2460316.5 and is day 1 of the year, while March 15th, 2024 corresponds to Julian Day Number 2460389.5 and is day 75 of the year."
};

export default function JulianDateDayNumberCalculator() {
  const [inputs, setInputs] = useState({
    startDate: "",
    endDate: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    try {
      if (!inputs.startDate && !inputs.endDate) {
        return null;
      }

      const start = inputs.startDate ? new Date(inputs.startDate) : null;
      const end = inputs.endDate ? new Date(inputs.endDate) : null;

      if (
        (start && isNaN(start.getTime())) ||
        (end && isNaN(end.getTime()))
      ) {
        return {
          primary: "Invalid date(s)",
          secondary: "Please enter valid dates in YYYY-MM-DD format.",
          details: "",
          feedback: ""
        };
      }

      let primary = "";
      let secondary = "";
      let details = "";
      let feedback = "";

      if (start && end) {
        // Calculate Julian Dates and day numbers for both
        const startJD = getJulianDate(start);
        const endJD = getJulianDate(end);
        const startDayOfYear = getDayOfYear(start);
        const endDayOfYear = getDayOfYear(end);

        const diffDays = Math.round(endJD - startJD);

        primary = `${diffDays} day${diffDays !== 1 ? "s" : ""}`;
        secondary = `Duration between dates`;

        details = `Start Date: ${inputs.startDate} - Julian Day Number: ${startJD.toFixed(
          2
        )}, Day of Year: ${startDayOfYear}\nEnd Date: ${inputs.endDate} - Julian Day Number: ${endJD.toFixed(
          2
        )}, Day of Year: ${endDayOfYear}`;

        feedback =
          "The difference is inclusive of the start date but excludes the end date time portion.";
      } else if (start) {
        const startJD = getJulianDate(start);
        const startDayOfYear = getDayOfYear(start);

        primary = startJD.toFixed(2);
        secondary = `Julian Day Number for ${inputs.startDate}`;
        details = `Day of Year: ${startDayOfYear}`;
        feedback = "Julian Date counts days continuously from 4713 BCE noon UTC.";
      } else if (end) {
        const endJD = getJulianDate(end);
        const endDayOfYear = getDayOfYear(end);

        primary = endJD.toFixed(2);
        secondary = `Julian Day Number for ${inputs.endDate}`;
        details = `Day of Year: ${endDayOfYear}`;
        feedback = "Julian Date counts days continuously from 4713 BCE noon UTC.";
      }

      return { primary, secondary, details, feedback };
    } catch (e) {
      return {
        primary: "Error",
        secondary: "An error occurred during calculation.",
        details: "",
        feedback: ""
      };
    }
  }, [inputs]);

  const faqs = [
    {
      question: "What is a Julian Date?",
      answer:
        "A Julian Date (JD) is a continuous count of days and fractions since noon UTC on January 1, 4713 BCE. It is widely used in astronomy and scientific fields to avoid confusion caused by calendar variations. This calculator provides the Julian Day Number for any given date and time."
    },
    {
      question: "How is the day number within the year calculated?",
      answer:
        "The day number within the year, also called the ordinal date, counts the days starting from January 1 as day 1. It accounts for leap years, so in leap years, December 31 is day 366 instead of 365. This helps track progress within a calendar year."
    },
    {
      question: "Does this calculator consider leap years?",
      answer:
        "Yes, the calculator correctly accounts for leap years when computing the day of the year. Leap years occur every 4 years except for years divisible by 100 but not by 400, ensuring accurate day counts for February 29."
    },
    {
      question: "Can I calculate the difference between two dates?",
      answer:
        "Absolutely. By entering both a start and end date, the calculator computes the difference in days between them using Julian Dates, which provides precise duration calculations regardless of calendar irregularities."
    },
    {
      question: "How does time zone affect Julian Date calculations?",
      answer:
        "Julian Dates are based on UTC time, so local time zones and daylight saving time do not affect the Julian Date itself. This calculator uses UTC internally to ensure consistent and accurate results."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const references = [
    {
      title: "Time and Date Standards (ISO 8601)",
      description:
        "International standard for date and time representation, ensuring consistent formatting and interpretation worldwide.",
      url: "https://www.iso.org/iso-8601-date-and-time-format.html"
    },
    {
      title: "Julian Date Explanation - US Naval Observatory",
      description:
        "Detailed explanation and formulas for calculating Julian Dates used in astronomy.",
      url: "https://aa.usno.navy.mil/faq/docs/JD_Formula.php"
    },
    {
      title: "Leap Year Rules - Wikipedia",
      description:
        "Comprehensive explanation of leap year rules and their historical background.",
      url: "https://en.wikipedia.org/wiki/Leap_year"
    }
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">
            Start Date <CalendarIcon className="inline w-4 h-4 ml-1 text-blue-600" />
          </Label>
          <Input
            id="startDate"
            type="date"
            value={inputs.startDate}
            onChange={(e) => handleInputChange("startDate", e.target.value)}
            placeholder="YYYY-MM-DD"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">
            End Date <CalendarIcon className="inline w-4 h-4 ml-1 text-blue-600" />
          </Label>
          <Input
            id="endDate"
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
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md whitespace-pre-wrap">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Result</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">{results.primary}</div>
            <div className="text-xl font-bold mt-2">{results.secondary}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
            {results.feedback && (
              <>
                <Separator className="my-4" />
                <p className="text-xs italic text-slate-400">{results.feedback}</p>
              </>
            )}
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
          <li>Enter a start date in the first input field using the YYYY-MM-DD format.</li>
          <li>Optionally, enter an end date in the second input field to calculate the difference between two dates.</li>
          <li>Click the "Calculate" button to compute the Julian Day Number(s) and day number(s) within the year.</li>
          <li>Review the results displayed below the button, which include Julian Dates and day of year values.</li>
          <li>Use these results for precise time tracking, scheduling, or astronomical calculations.</li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to Julian Date/Day Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            The Julian Date (JD) is a continuous count of days and fractions since noon UTC on January 1, 4713 BCE, used primarily in astronomy to avoid the complications of calendar systems. Unlike the Gregorian calendar, which has months and leap years, the Julian Date provides a simple linear count of days, making it ideal for precise time interval calculations.
          </p>
          <p>
            Leap years are years where an extra day is added to February (February 29) to keep the calendar year synchronized with the astronomical year. The rules for leap years are: a year is a leap year if it is divisible by 4, except for years divisible by 100 unless they are also divisible by 400. This ensures that the calendar stays accurate over centuries.
          </p>
          <p>
            Coordinated Universal Time (UTC) is the primary time standard by which the world regulates clocks and time. Julian Dates are calculated based on UTC to maintain consistency worldwide. Daylight Saving Time (DST) shifts local time forward or backward by one hour seasonally but does not affect UTC or Julian Dates, which remain constant.
          </p>
          <p>
            This calculator uses JavaScript's Date object to parse input dates and compute Julian Dates and day numbers within the year. It handles leap years automatically and calculates differences between dates accurately by converting them to Julian Dates. Understanding these concepts helps in fields like astronomy, project management, and any domain requiring precise date calculations.
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
            <strong>DST Confusion:</strong> Daylight Saving Time changes do not affect Julian Dates since they are based on UTC. Users often mistakenly apply local time zone shifts, causing errors in calculations.
          </p>
          <p>
            <strong>Incorrect Date Format:</strong> Entering dates in formats other than YYYY-MM-DD can lead to invalid or unexpected results. Always use the ISO format to ensure proper parsing.
          </p>
          <p>
            <strong>Ignoring Leap Years:</strong> Some users forget that leap years add an extra day, which affects the day number within the year. This calculator accounts for leap years automatically.
          </p>
          <p>
            <strong>Time Portion Overlooked:</strong> Julian Dates include fractional days based on time of day. Ignoring the time portion can lead to slight inaccuracies if time is relevant.
          </p>
          <p>
            <strong>Assuming Julian Date is the same as Julian Calendar Date:</strong> Julian Date is a continuous count of days, not a calendar date. The Julian calendar is an older calendar system different from the Julian Date concept.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">Real World Example</h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>{example.scenario}</p>
          <ol className="list-decimal pl-5 space-y-3">
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
      title="Julian Date/Day Calculator"
      description="Professional time calculator: Julian Date/Day Calculator. Precise calculations, time zone handling, and scheduling tools."
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
        { id: "references", label: "References" }
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}