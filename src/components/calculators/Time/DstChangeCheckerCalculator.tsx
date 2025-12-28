import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Clock, BookOpen, AlertTriangle, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function DstChangeCheckerCalculator() {
  // State for input dates and timezone selection
  const [inputs, setInputs] = useState({
    startDate: "",
    endDate: "",
    timeZone: "America/New_York",
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Helper: Check if DST change occurs between two dates in a given timezone
  // Returns an object with info about DST changes and time difference
  const checkDstChange = (start: Date, end: Date, timeZone: string) => {
    // We will check the offset at start and end dates using Intl.DateTimeFormat
    // and detect if offset changes (indicating DST change)
    try {
      const getOffset = (date: Date) => {
        // Format date to parts to get offset in minutes
        const dtf = new Intl.DateTimeFormat("en-US", {
          timeZone,
          timeZoneName: "shortOffset",
          hour12: false,
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        });
        const parts = dtf.formatToParts(date);
        // Extract offset string like GMT-4 or GMT+1
        const tzName = parts.find((p) => p.type === "timeZoneName")?.value || "";
        // Parse offset hours and minutes from string
        // Format is usually GMT±H or GMT±HHMM
        const match = tzName.match(/GMT([+-])(\d{1,2})(?::?(\d{2}))?/);
        if (!match) return 0;
        const sign = match[1] === "+" ? 1 : -1;
        const hours = parseInt(match[2], 10);
        const minutes = match[3] ? parseInt(match[3], 10) : 0;
        return sign * (hours * 60 + minutes);
      };

      const startOffset = getOffset(start);
      const endOffset = getOffset(end);

      const offsetDiff = endOffset - startOffset; // in minutes

      // If offsetDiff !== 0, DST change occurred between dates
      // We can try to find the exact DST change date by binary search
      if (offsetDiff === 0) {
        return {
          dstChanged: false,
          offsetDiff,
          message: `No DST change detected between ${start.toDateString()} and ${end.toDateString()} in ${timeZone}.`,
        };
      }

      // Binary search to find DST change date
      let low = start.getTime();
      let high = end.getTime();
      let mid = 0;
      let changeDate = null;

      while (low <= high) {
        mid = Math.floor((low + high) / 2);
        const midDate = new Date(mid);
        const midOffset = getOffset(midDate);

        if (midOffset === startOffset) {
          low = mid + 1;
        } else {
          changeDate = midDate;
          high = mid - 1;
        }
      }

      // Format changeDate nicely
      const changeDateStr = changeDate ? changeDate.toLocaleString("en-US", { timeZone }) : "Unknown";

      const direction = offsetDiff > 0 ? "clocks moved forward (spring forward)" : "clocks moved backward (fall back)";

      return {
        dstChanged: true,
        offsetDiff,
        changeDate,
        message: `DST change detected on ${changeDateStr} in ${timeZone}. The ${direction} by ${Math.abs(offsetDiff)} minutes.`,
      };
    } catch (error) {
      return {
        dstChanged: false,
        offsetDiff: 0,
        message: "Error detecting DST change. Please check your inputs.",
      };
    }
  };

  const results = useMemo(() => {
    if (!inputs.startDate || !inputs.endDate) {
      return null;
    }
    try {
      const start = new Date(inputs.startDate + "T00:00:00");
      const end = new Date(inputs.endDate + "T23:59:59");
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return {
          primary: "Invalid dates",
          secondary: "Please enter valid start and end dates.",
          details: "",
          feedback: "",
        };
      }
      if (start > end) {
        return {
          primary: "Invalid range",
          secondary: "Start date must be before or equal to end date.",
          details: "",
          feedback: "",
        };
      }

      const { dstChanged, offsetDiff, changeDate, message } = checkDstChange(start, end, inputs.timeZone);

      return {
        primary: dstChanged ? "DST Change Detected" : "No DST Change",
        secondary: message,
        details: dstChanged
          ? `Time offset changed by ${offsetDiff} minutes on ${changeDate?.toLocaleString("en-US", {
              timeZone: inputs.timeZone,
            })}.`
          : "The time offset remained constant during this period.",
        feedback:
          "Use this information to adjust schedules, meetings, or time calculations that span DST changes.",
      };
    } catch (e) {
      return {
        primary: "Error",
        secondary: "An unexpected error occurred during calculation.",
        details: "",
        feedback: "",
      };
    }
  }, [inputs]);

  const faqs = [
    {
      question: "What is Daylight Saving Time (DST) and why does it change?",
      answer:
        "Daylight Saving Time (DST) is the practice of setting clocks forward by one hour during warmer months to extend evening daylight. It typically starts in spring and ends in fall, causing clocks to move forward or backward by one hour. This change affects time calculations and scheduling, especially across different time zones.",
    },
    {
      question: "How does this calculator detect DST changes?",
      answer:
        "This calculator compares the UTC offset of the start and end dates in the selected time zone. If the offset differs, it means a DST change occurred between those dates. It then uses a binary search approach to approximate the exact date and time when the DST change happened.",
    },
    {
      question: "Can I use this tool for any time zone?",
      answer:
        "You can select from a list of major time zones supported by the Intl API. The calculator uses the JavaScript Intl.DateTimeFormat to determine offsets and DST changes. For unsupported or custom time zones, results may not be accurate.",
    },
    {
      question: "Why is it important to check for DST changes in scheduling?",
      answer:
        "DST changes can cause one-hour shifts in local time, which may lead to missed meetings, incorrect deadlines, or errors in time-sensitive applications. Checking for DST changes ensures accurate time calculations and helps avoid confusion in international or long-term scheduling.",
    },
    {
      question: "What if my dates do not include a DST change?",
      answer:
        "If your selected date range does not include a DST change, the calculator will confirm that no DST transition occurred. This means the UTC offset remained constant, and no adjustment is needed for time calculations within that period.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "Planning a virtual conference scheduled from March 10th to March 20th, 2024, for participants in New York (Eastern Time). The organizer wants to know if a DST change affects the event timing.",
    steps: [
      {
        label: "Step 1",
        explanation: "Enter the start date (2024-03-10) and end date (2024-03-20).",
      },
      {
        label: "Step 2",
        explanation: "Select the time zone as America/New_York.",
      },
      {
        label: "Step 3",
        explanation:
          "Click Calculate to check if a DST change occurs during this period in New York.",
      },
    ],
    result:
      "The calculator detects a DST change on March 10th, 2024, when clocks move forward by 60 minutes. The organizer should adjust the schedule accordingly to avoid confusion.",
  };

  const references = [
    {
      title: "Time and Date Standards (ISO 8601)",
      description: "International standard for date and time representation.",
      url: "https://www.iso.org/iso-8601-date-and-time-format.html",
    },
    {
      title: "Daylight Saving Time - Wikipedia",
      description: "Comprehensive overview of DST history and implementation worldwide.",
      url: "https://en.wikipedia.org/wiki/Daylight_saving_time",
    },
    {
      title: "Intl.DateTimeFormat - MDN Web Docs",
      description:
        "JavaScript API documentation for formatting dates and times with time zone support.",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat",
    },
    {
      title: "Time Zone Database (IANA)",
      description:
        "The IANA Time Zone Database provides time zone and DST rules used by many operating systems and programming languages.",
      url: "https://www.iana.org/time-zones",
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
            placeholder="YYYY-MM-DD"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="date"
            value={inputs.endDate}
            onChange={(e) => handleInputChange("endDate", e.target.value)}
            placeholder="YYYY-MM-DD"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="timeZone">Time Zone</Label>
          <select
            id="timeZone"
            className="w-full rounded-md border border-slate-300 dark:border-slate-700 px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
            value={inputs.timeZone}
            onChange={(e) => handleInputChange("timeZone", e.target.value)}
          >
            <option value="America/New_York">America/New_York (Eastern Time)</option>
            <option value="Europe/London">Europe/London (GMT/BST)</option>
            <option value="Europe/Paris">Europe/Paris (CET/CEST)</option>
            <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
            <option value="Australia/Sydney">Australia/Sydney (AEST/AEDT)</option>
            <option value="UTC">UTC (No DST)</option>
          </select>
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" onClick={() => {}}>
        <Clock className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Result</span>
            <div className="text-4xl font-extrabold text-blue-600 my-3">{results.primary}</div>
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
          <li>Enter the start date of your period in the "Start Date" field using the YYYY-MM-DD format.</li>
          <li>Enter the end date of your period in the "End Date" field, ensuring it is the same or after the start date.</li>
          <li>Select the relevant time zone from the dropdown menu where you want to check for DST changes.</li>
          <li>Click the "Calculate" button to analyze if a Daylight Saving Time change occurs between the two dates.</li>
          <li>Review the results displayed below, which will indicate if and when a DST change happens and the offset difference.</li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to DST Change Checker (time changes)
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Daylight Saving Time (DST) is a seasonal adjustment of clocks, typically advancing them by one hour in spring and reverting in fall, to extend evening daylight. This practice varies by country and region, and not all locations observe DST. The JavaScript <code>Date</code> object represents dates and times in local time or UTC, but does not directly expose DST transitions. To detect DST changes, this calculator uses the <code>Intl.DateTimeFormat</code> API to determine the UTC offset for specific dates in a given time zone. By comparing offsets at the start and end of a period, it identifies if a DST change occurred. If a change is detected, a binary search algorithm approximates the exact transition date. Understanding DST is crucial for scheduling, programming, and international communication to avoid errors caused by time shifts.
          </p>
          <p>
            Leap years, which add an extra day (February 29), affect date calculations but do not impact DST transitions directly. UTC (Coordinated Universal Time) is a time standard that does not change with seasons, unlike local times affected by DST. This calculator helps you identify when local time shifts occur relative to UTC, enabling accurate time management across regions and periods.
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
            <strong>DST Confusion:</strong> Many users forget that DST changes cause clocks to move forward or backward by one hour, leading to errors in time calculations if not accounted for.
          </p>
          <p>
            <strong>Incorrect Date Formats:</strong> Entering dates in formats other than YYYY-MM-DD can cause parsing errors and inaccurate results.
          </p>
          <p>
            <strong>Ignoring Time Zones:</strong> DST changes vary by time zone; assuming a universal DST change can lead to mistakes when scheduling across regions.
          </p>
          <p>
            <strong>Start Date After End Date:</strong> Always ensure the start date is before or equal to the end date to avoid invalid range errors.
          </p>
          <p>
            <strong>Assuming DST Applies Everywhere:</strong> Some regions do not observe DST; always verify if your selected time zone uses DST before relying on results.
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
      title="DST Change Checker (time changes)"
      description="Professional time calculator: DST Change Checker (time changes). Precise calculations, time zone handling, and scheduling tools."
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