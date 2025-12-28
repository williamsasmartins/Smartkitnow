import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Clock, BookOpen, AlertTriangle, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function LeapYearCheckerCalculator() {
  // State for year input
  const [inputs, setInputs] = useState({
    year: "",
  });

  const handleInputChange = (field: string, value: string) => {
    // Allow only digits and max 4 chars for year input
    if (field === "year") {
      if (/^\d{0,4}$/.test(value)) {
        setInputs((prev) => ({ ...prev, [field]: value }));
      }
    } else {
      setInputs((prev) => ({ ...prev, [field]: value }));
    }
  };

  // Leap year logic:
  // A year is leap if:
  // - divisible by 4 AND
  // - not divisible by 100 unless also divisible by 400
  const isLeapYear = (year: number): boolean => {
    if (year % 4 !== 0) return false;
    if (year % 100 !== 0) return true;
    if (year % 400 === 0) return true;
    return false;
  };

  const results = useMemo(() => {
    const yearNum = Number(inputs.year);
    if (!inputs.year || isNaN(yearNum) || yearNum < 1 || yearNum > 9999) {
      return {
        primary: "—",
        secondary: "Please enter a valid year (1-9999).",
        details: "Enter a year to check if it is a leap year.",
        feedback: "",
      };
    }

    const leap = isLeapYear(yearNum);
    return {
      primary: leap ? "Yes" : "No",
      secondary: leap
        ? `${yearNum} is a leap year.`
        : `${yearNum} is not a leap year.`,
      details: leap
        ? "This year has 366 days, with February 29 included."
        : "This year has 365 days, with February 28 as the last day of February.",
      feedback:
        "Leap years help keep our calendar year synchronized with the astronomical year.",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What exactly is a leap year?",
      answer:
        "A leap year is a year that contains an extra day, February 29, making the year 366 days long instead of the usual 365. This adjustment is made to keep the calendar year synchronized with the Earth's orbit around the Sun, which takes approximately 365.2425 days. Leap years occur every 4 years, with exceptions for years divisible by 100 but not by 400.",
    },
    {
      question: "Why do we have exceptions for years divisible by 100 and 400?",
      answer:
        "The Gregorian calendar refines the leap year rule to improve accuracy. While most years divisible by 4 are leap years, years divisible by 100 are not leap years unless they are also divisible by 400. This correction accounts for the fact that the Earth's orbit is slightly less than 365.25 days, preventing calendar drift over centuries.",
    },
    {
      question: "Does the leap year affect time zones or daylight saving time?",
      answer:
        "Leap years themselves do not directly affect time zones or daylight saving time (DST). However, because they add an extra day, scheduling and time calculations around February 29 must consider this additional day. DST changes are governed by local laws and typically occur on fixed calendar dates regardless of leap years.",
    },
    {
      question: "Can I use this calculator for years before 1582?",
      answer:
        "This calculator uses the Gregorian calendar rules, which were introduced in 1582. For years before 1582, the Julian calendar was used, which has a simpler leap year rule (every 4 years). Therefore, leap year calculations for dates before 1582 may not be accurate with this tool.",
    },
    {
      question: "How can I programmatically check for leap years in JavaScript?",
      answer:
        "You can check for leap years in JavaScript by applying the leap year rules: a year divisible by 4 is a leap year unless it is divisible by 100 but not by 400. For example: `const isLeap = (y) => (y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0));`. This simple function returns true if the year is leap, false otherwise.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "Planning a software release scheduled for February 28, 2024, and you want to know if the next day will be February 29 or March 1.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Input the year 2024 into the Leap Year Checker to determine if it is a leap year.",
      },
      {
        label: "Step 2",
        explanation:
          "The calculator confirms 2024 is a leap year, meaning February 29 exists.",
      },
      {
        label: "Step 3",
        explanation:
          "Plan your release and testing schedules accordingly, accounting for the extra day.",
      },
    ],
    result:
      "Knowing 2024 is a leap year helps avoid scheduling errors and ensures accurate date handling in your project timeline.",
  };

  const references = [
    {
      title: "Time and Date Standards (ISO 8601)",
      description:
        "International standard for date and time representation, including leap year rules.",
      url: "https://www.iso.org/iso-8601-date-and-time-format.html",
    },
    {
      title: "Leap Year - Wikipedia",
      description:
        "Comprehensive article about leap years, their history, and calculation rules.",
      url: "https://en.wikipedia.org/wiki/Leap_year",
    },
    {
      title: "MDN Web Docs: Date",
      description:
        "JavaScript Date object documentation with examples on date manipulation.",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="year-input">Enter Year</Label>
          <Input
            id="year-input"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="e.g. 2024"
            value={inputs.year}
            onChange={(e) => handleInputChange("year", e.target.value)}
            maxLength={4}
          />
        </div>
      </div>

      <Button
        className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg"
        onClick={() => {}}
        aria-label="Calculate leap year"
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
          <li>Enter the year you want to check in the input field.</li>
          <li>
            Click the "Calculate" button to determine if the year is a leap
            year.
          </li>
          <li>
            View the result displayed below, which indicates whether the year
            is leap or not.
          </li>
          <li>
            Use the information to plan schedules, projects, or date-sensitive
            events accurately.
          </li>
          <li>
            Refer to the Complete Guide section for detailed explanations about
            leap years and related concepts.
          </li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Leap Year Checker
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Leap years are an essential part of our calendar system designed to
            keep our civil calendar aligned with the Earth's revolutions around
            the Sun. A solar year—the time it takes Earth to orbit the Sun—is
            approximately 365.2425 days. Since our calendar year is 365 days,
            this discrepancy accumulates over time, causing seasons to shift if
            uncorrected.
          </p>
          <p>
            To fix this, the Gregorian calendar adds an extra day every four
            years—February 29—known as a leap day. However, because the solar
            year is not exactly 365.25 days, the calendar refines this rule by
            excluding years divisible by 100 unless they are also divisible by
            400. For example, 1900 was not a leap year, but 2000 was.
          </p>
          <p>
            Coordinated Universal Time (UTC) is the primary time standard by
            which the world regulates clocks and time. Leap seconds, which are
            occasionally added to UTC, are different from leap days and are used
            to adjust for irregularities in Earth's rotation.
          </p>
          <p>
            Daylight Saving Time (DST) shifts clocks forward or backward by one
            hour during certain periods of the year to extend evening daylight.
            DST changes are independent of leap years but require careful
            consideration when scheduling across time zones.
          </p>
          <p>
            This calculator uses the standard Gregorian leap year rules to
            determine if a given year is leap. It helps developers, planners,
            and anyone working with dates to avoid errors related to leap years.
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
            1-hour errors in time calculations but does not affect leap year
            determination. Mixing these concepts can lead to scheduling errors.
          </p>
          <p>
            <strong>Incorrect Year Input:</strong> Entering invalid years such
            as negative numbers, zero, or non-numeric values will produce
            incorrect results. Always input a valid year between 1 and 9999.
          </p>
          <p>
            <strong>Julian vs Gregorian Calendar:</strong> Using Gregorian leap
            year rules for dates before 1582 (when the Gregorian calendar was
            introduced) can cause inaccuracies. Historical date calculations
            require calendar-specific logic.
          </p>
          <p>
            <strong>Assuming Every 4 Years is Leap:</strong> Not all years
            divisible by 4 are leap years due to the century rule. For example,
            1900 was not a leap year.
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
      title="Leap Year Checker"
      description="Professional time calculator: Leap Year Checker. Precise calculations, time zone handling, and scheduling tools."
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