import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Clock, BookOpen, AlertTriangle, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function WorkdayWorkweekPlannerCalculator() {
  // State for inputs: startDate, endDate, and option for calculation type
  const [inputs, setInputs] = useState({
    startDate: "",
    endDate: "",
    option: "totalDays", // options: totalDays, businessDays, totalWeeks, businessWeeks
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Helper: Check if a date is weekend
  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // Sunday=0, Saturday=6
  };

  // Calculate difference in days excluding weekends (business days)
  const calculateBusinessDays = (start: Date, end: Date) => {
    let count = 0;
    let current = new Date(start);
    while (current <= end) {
      if (!isWeekend(current)) count++;
      current.setDate(current.getDate() + 1);
    }
    return count;
  };

  // Calculate difference in total days (inclusive)
  const calculateTotalDays = (start: Date, end: Date) => {
    const msPerDay = 1000 * 60 * 60 * 24;
    // +1 to include both start and end dates
    return Math.floor((end.getTime() - start.getTime()) / msPerDay) + 1;
  };

  // Calculate total weeks (rounded to 2 decimals)
  const calculateTotalWeeks = (totalDays: number) => {
    return +(totalDays / 7).toFixed(2);
  };

  // Calculate business weeks (rounded to 2 decimals)
  const calculateBusinessWeeks = (businessDays: number) => {
    return +(businessDays / 5).toFixed(2);
  };

  const results = useMemo(() => {
    try {
      if (!inputs.startDate || !inputs.endDate) {
        return {
          primary: "-",
          secondary: "Please enter both start and end dates.",
          details: "",
          feedback: "",
        };
      }
      const start = new Date(inputs.startDate);
      const end = new Date(inputs.endDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return {
          primary: "-",
          secondary: "Invalid date format.",
          details: "",
          feedback: "",
        };
      }
      if (end < start) {
        return {
          primary: "-",
          secondary: "End date must be after or equal to start date.",
          details: "",
          feedback: "",
        };
      }

      const totalDays = calculateTotalDays(start, end);
      const businessDays = calculateBusinessDays(start, end);
      const totalWeeks = calculateTotalWeeks(totalDays);
      const businessWeeks = calculateBusinessWeeks(businessDays);

      switch (inputs.option) {
        case "totalDays":
          return {
            primary: totalDays.toString(),
            secondary: "Total Days (inclusive)",
            details: `From ${inputs.startDate} to ${inputs.endDate}, there are ${totalDays} total days including weekends.`,
            feedback: "",
          };
        case "businessDays":
          return {
            primary: businessDays.toString(),
            secondary: "Business Days (Mon-Fri)",
            details: `From ${inputs.startDate} to ${inputs.endDate}, excluding weekends, there are ${businessDays} business days.`,
            feedback: "Note: Holidays are not excluded in this calculation.",
          };
        case "totalWeeks":
          return {
            primary: totalWeeks.toString(),
            secondary: "Total Weeks (7 days/week)",
            details: `From ${inputs.startDate} to ${inputs.endDate}, there are approximately ${totalWeeks} weeks.`,
            feedback: "",
          };
        case "businessWeeks":
          return {
            primary: businessWeeks.toString(),
            secondary: "Business Weeks (5 days/week)",
            details: `From ${inputs.startDate} to ${inputs.endDate}, there are approximately ${businessWeeks} business weeks.`,
            feedback: "Note: Holidays are not excluded in this calculation.",
          };
        default:
          return {
            primary: "-",
            secondary: "Select a valid calculation option.",
            details: "",
            feedback: "",
          };
      }
    } catch (error) {
      return {
        primary: "-",
        secondary: "Error in calculation.",
        details: "",
        feedback: "",
      };
    }
  }, [inputs]);

  const faqs = [
    {
      question: "How does this calculator handle weekends?",
      answer:
        "This calculator excludes Saturdays and Sundays when calculating business days and business weeks. Total days and total weeks calculations include all days regardless of weekends. This helps you plan work schedules accurately by distinguishing between calendar days and working days.",
    },
    {
      question: "Are public holidays considered in business day calculations?",
      answer:
        "No, this calculator does not account for public holidays or company-specific non-working days. It only excludes weekends (Saturday and Sunday). For more precise planning, you may need to manually adjust for holidays.",
    },
    {
      question: "Can I use this calculator for planning across different time zones?",
      answer:
        "This calculator uses local dates without time zone conversion. For cross-time zone planning, consider the local date differences and daylight saving time changes separately, as this tool focuses on date duration rather than exact time calculations.",
    },
    {
      question: "Why does the calculator add one day in total days calculation?",
      answer:
        "The calculator counts both the start and end dates inclusively. For example, from January 1 to January 3 is counted as 3 days, not 2, to reflect the full span of the period.",
    },
    {
      question: "How accurate are the week calculations?",
      answer:
        "Week calculations are based on dividing the total or business days by 7 or 5 respectively and rounded to two decimal places. This provides an approximate number of weeks to help with planning but may not reflect exact calendar weeks.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "Planning a software development sprint from March 1st, 2024 to March 31st, 2024, excluding weekends to estimate actual working days.",
    steps: [
      {
        label: "Step 1",
        explanation: "Enter the start date as 2024-03-01 and the end date as 2024-03-31.",
      },
      {
        label: "Step 2",
        explanation: "Select 'Business Days (Mon-Fri)' to calculate the number of working days excluding weekends.",
      },
      {
        label: "Step 3",
        explanation:
          "Click 'Calculate' to see the total business days and use this to plan sprint tasks and deadlines effectively.",
      },
    ],
    result:
      "The calculator shows 21 business days in March 2024, helping the team allocate work evenly across available working days.",
  };

  const references = [
    {
      title: "Time and Date Standards (ISO 8601)",
      description: "International standard for date and time representation.",
      url: "https://www.iso.org/iso-8601-date-and-time-format.html",
    },
    {
      title: "MDN Web Docs: Date",
      description: "Comprehensive guide to JavaScript Date object and methods.",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date",
    },
    {
      title: "Business Days Calculation - Wikipedia",
      description:
        "Overview of business days and their importance in scheduling and planning.",
      url: "https://en.wikipedia.org/wiki/Business_day",
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
        <div className="space-y-2">
          <Label htmlFor="option">Calculation Type</Label>
          <select
            id="option"
            className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100"
            value={inputs.option}
            onChange={(e) => handleInputChange("option", e.target.value)}
          >
            <option value="totalDays">Total Days (inclusive)</option>
            <option value="businessDays">Business Days (Mon-Fri)</option>
            <option value="totalWeeks">Total Weeks (7 days/week)</option>
            <option value="businessWeeks">Business Weeks (5 days/week)</option>
          </select>
        </div>
      </div>

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
            {results.feedback && (
              <p className="mt-2 text-sm italic text-slate-600 dark:text-slate-400">
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
          <li>
            Enter the <strong>Start Date</strong> of your planned period using
            the date picker.
          </li>
          <li>
            Enter the <strong>End Date</strong> of your planned period.
          </li>
          <li>
            Select the type of calculation you want: total days, business days,
            total weeks, or business weeks.
          </li>
          <li>
            Click the <strong>Calculate</strong> button to see the results.
          </li>
          <li>
            Review the results and use the details and feedback to assist your
            planning.
          </li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Workday/Workweek Planner (customized)
        </h2>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p>
            Calculating the duration between two dates is a fundamental task in
            project management, scheduling, and time tracking. This calculator
            helps you determine the number of days or weeks between two dates,
            with options to exclude weekends for business day calculations.
          </p>
          <p>
            <strong>Leap Years:</strong> Leap years add an extra day (February
            29) every four years, which this calculator accounts for naturally
            by using JavaScript's Date object. This ensures accurate day counts
            even across leap years.
          </p>
          <p>
            <strong>UTC and Time Zones:</strong> This calculator works with
            local dates without time zone conversions. When planning across
            time zones, be aware that date boundaries may differ. For precise
            time zone handling, additional tools or APIs are recommended.
          </p>
          <p>
            <strong>Daylight Saving Time (DST):</strong> Since this calculator
            focuses on whole dates rather than hours, DST changes do not affect
            the day count. However, for hourly calculations, DST can cause
            shifts that need special handling.
          </p>
          <p>
            <strong>Business Days:</strong> Business days exclude Saturdays and
            Sundays by default. Public holidays are not excluded, so manual
            adjustments may be necessary for accurate workday planning.
          </p>
          <p>
            Using this tool, you can efficiently plan projects, calculate
            deadlines, and manage work schedules with clarity on the actual
            working time available.
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
            <strong>DST Confusion:</strong> Daylight Saving Time changes do not
            affect date duration calculations here, but confusion can arise if
            you mix date and time calculations without proper handling.
          </p>
          <p>
            <strong>Inclusive vs Exclusive Dates:</strong> Forgetting that the
            calculator counts both start and end dates inclusively can lead to
            off-by-one errors in planning.
          </p>
          <p>
            <strong>Ignoring Weekends:</strong> Using total days instead of
            business days when planning work schedules can overestimate
            available working time.
          </p>
          <p>
            <strong>Not Accounting for Holidays:</strong> This tool excludes
            weekends but not public holidays, so manual adjustments are needed
            for precise business day planning.
          </p>
          <p>
            <strong>Invalid Date Inputs:</strong> Entering invalid or reversed
            dates (end date before start date) will result in errors or no
            results.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Real World Example
        </h2>
        <div className="prose prose-slate dark:prose-invert max-w-none">
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
      title="Workday/Workweek Planner (customized)"
      description="Professional time calculator: Workday/Workweek Planner (customized). Precise calculations, time zone handling, and scheduling tools."
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