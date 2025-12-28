import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Clock, BookOpen, AlertTriangle, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function EpochUnixTimeConverterCalculator() {
  // Inputs: Either a Unix timestamp (seconds or milliseconds) or a date string
  const [inputs, setInputs] = useState({
    timestamp: "",
    dateString: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Helper: Check if string is numeric
  const isNumeric = (str: string) => {
    if (typeof str != "string") return false;
    return !isNaN(str as any) && !isNaN(parseFloat(str));
  };

  // Convert timestamp (seconds or ms) to Date
  const timestampToDate = (ts: number) => {
    // If timestamp length <= 10 digits, treat as seconds, else ms
    if (ts.toString().length <= 10) {
      return new Date(ts * 1000);
    }
    return new Date(ts);
  };

  // Convert Date to Unix timestamp (seconds)
  const dateToTimestamp = (date: Date) => Math.floor(date.getTime() / 1000);

  // Format Date to ISO string with timezone info
  const formatDate = (date: Date) => {
    if (isNaN(date.getTime())) return "Invalid Date";
    return date.toISOString();
  };

  // Format Date to local string with timezone name (mocked for major cities)
  const formatLocalDateWithTZ = (date: Date, city: string) => {
    try {
      // Use Intl.DateTimeFormat with timeZone option
      const timeZones: Record<string, string> = {
        "New York": "America/New_York",
        London: "Europe/London",
        Tokyo: "Asia/Tokyo",
        Sydney: "Australia/Sydney",
        UTC: "UTC",
      };
      const tz = timeZones[city] || "UTC";
      return new Intl.DateTimeFormat("en-US", {
        timeZone: tz,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZoneName: "short",
      }).format(date);
    } catch {
      return date.toLocaleString();
    }
  };

  // Main calculation logic
  const results = useMemo(() => {
    let primary = "";
    let secondary = "";
    let details = "";
    let feedback = "";

    // Priority: If timestamp input is given, convert to date string
    if (inputs.timestamp.trim()) {
      if (!isNumeric(inputs.timestamp.trim())) {
        feedback = "Timestamp must be a valid number.";
        return { primary, secondary, details, feedback };
      }
      const tsNum = Number(inputs.timestamp.trim());
      const date = timestampToDate(tsNum);
      if (isNaN(date.getTime())) {
        feedback = "Invalid timestamp input.";
        return { primary, secondary, details, feedback };
      }
      primary = formatDate(date);
      secondary = `ISO 8601 UTC Date String`;
      details = `Timestamp ${tsNum} converted to UTC date/time.`;
      feedback = `Note: Input timestamp is interpreted as ${
        tsNum.toString().length <= 10 ? "seconds" : "milliseconds"
      } since Unix epoch (Jan 1, 1970 UTC).`;
      return { primary, secondary, details, feedback };
    }

    // Else if date string input is given, convert to timestamp
    if (inputs.dateString.trim()) {
      const date = new Date(inputs.dateString.trim());
      if (isNaN(date.getTime())) {
        feedback = "Invalid date string input.";
        return { primary, secondary, details, feedback };
      }
      const ts = dateToTimestamp(date);
      primary = ts.toString();
      secondary = `Unix Timestamp (seconds since Jan 1, 1970 UTC)`;
      details = `Date string "${inputs.dateString.trim()}" converted to timestamp.`;
      feedback = `Note: Date string is parsed in local time or ISO format if specified.`;
      return { primary, secondary, details, feedback };
    }

    feedback = "Please enter either a Unix timestamp or a date string.";
    return { primary, secondary, details, feedback };
  }, [inputs]);

  const faqs = [
    {
      question: "What is Unix/Epoch time?",
      answer:
        "Unix or Epoch time is the number of seconds that have elapsed since January 1, 1970 (midnight UTC/GMT), not counting leap seconds. It is widely used in computing systems to represent time in a simple, consistent format. This calculator helps convert between Unix timestamps and human-readable date strings.",
    },
    {
      question: "Why are some timestamps 10 digits and others 13 digits?",
      answer:
        "A 10-digit timestamp represents seconds since the Unix epoch, while a 13-digit timestamp includes milliseconds. Many systems use milliseconds for higher precision, so this calculator detects the length to convert accordingly.",
    },
    {
      question: "How does time zone affect date string parsing?",
      answer:
        "Date strings without explicit time zone information are usually interpreted in the local time zone of the environment running the code. This can cause discrepancies if you expect UTC or another time zone. Always specify time zone or use ISO 8601 format with 'Z' for UTC to avoid confusion.",
    },
    {
      question: "Can this calculator handle daylight saving time (DST)?",
      answer:
        "Yes, when converting date strings, the JavaScript Date object automatically accounts for daylight saving time based on the local time zone or specified time zone in the string. However, Unix timestamps are always in UTC and unaffected by DST.",
    },
    {
      question: "What happens if I enter an invalid date string or timestamp?",
      answer:
        "The calculator will notify you that the input is invalid and prompt you to enter a correct Unix timestamp or date string. This prevents incorrect conversions and ensures accurate results.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "Planning a software deployment scheduled for March 15, 2024, at 14:30 UTC, you want to convert this date and time into a Unix timestamp to configure automated scripts.",
    steps: [
      {
        label: "Step 1",
        explanation:
          'Enter the date string "2024-03-15T14:30:00Z" into the date string input field. The "Z" indicates UTC time zone.',
      },
      {
        label: "Step 2",
        explanation:
          "Click the Calculate button to convert the date string into a Unix timestamp.",
      },
      {
        label: "Step 3",
        explanation:
          "Use the resulting timestamp in your deployment scripts to schedule the event precisely at the intended UTC time.",
      },
    ],
    result:
      "The calculator outputs the Unix timestamp 1710397800, representing March 15, 2024, 14:30:00 UTC.",
  };

  const references = [
    {
      title: "Time and Date Standards (ISO 8601)",
      description: "International standard for date and time representation.",
      url: "https://www.iso.org/iso-8601-date-and-time-format.html",
    },
    {
      title: "Unix Time - Wikipedia",
      description:
        "Comprehensive explanation of Unix time, its history, and usage.",
      url: "https://en.wikipedia.org/wiki/Unix_time",
    },
    {
      title: "MDN Web Docs: Date",
      description:
        "JavaScript Date object documentation and examples for parsing and formatting dates.",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date",
    },
    {
      title: "Intl.DateTimeFormat - MDN",
      description:
        "Guide to formatting dates and times with time zone support in JavaScript.",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="timestamp">Unix Timestamp (seconds or milliseconds)</Label>
          <Input
            id="timestamp"
            type="text"
            placeholder="e.g. 1680000000 or 1680000000000"
            value={inputs.timestamp}
            onChange={(e) => {
              handleInputChange("timestamp", e.target.value);
              handleInputChange("dateString", "");
            }}
            spellCheck={false}
            autoComplete="off"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dateString">Date String (ISO 8601 or local)</Label>
          <Input
            id="dateString"
            type="text"
            placeholder="e.g. 2023-03-15T14:30:00Z or March 15, 2023 14:30"
            value={inputs.dateString}
            onChange={(e) => {
              handleInputChange("dateString", e.target.value);
              handleInputChange("timestamp", "");
            }}
            spellCheck={false}
            autoComplete="off"
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" onClick={() => {}}>
        <Clock className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {(results.primary || results.feedback) && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            {results.primary && (
              <>
                <span className="text-sm font-semibold text-slate-500 uppercase">Result</span>
                <div className="text-5xl font-extrabold text-blue-600 my-3">{results.primary}</div>
                <div className="text-xl font-bold mt-2">{results.secondary}</div>
                <p className="text-xs text-slate-500 mt-2">{results.details}</p>
              </>
            )}
            {results.feedback && (
              <p className="mt-4 text-sm text-slate-600 dark:text-slate-400 italic">{results.feedback}</p>
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
          <li>Enter a Unix timestamp (seconds or milliseconds) in the first input field to convert it to a human-readable date string in UTC.</li>
          <li>Alternatively, enter a date string in ISO 8601 format or a common date format in the second input field to convert it to a Unix timestamp (seconds since epoch).</li>
          <li>Click the Calculate button to perform the conversion. Only one input should be filled at a time to avoid conflicts.</li>
          <li>Review the output result displayed below the inputs, including additional details and notes about the conversion.</li>
          <li>Use the converted values for scheduling, logging, or programming tasks requiring precise time representation.</li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to Epoch/Unix Time Converter
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Unix time, also known as Epoch time, counts the number of seconds that have elapsed since January 1, 1970, at midnight UTC, excluding leap seconds. It is a widely adopted standard in computing for representing points in time as a single integer value. This simplicity allows for easy storage, comparison, and arithmetic operations on dates.
          </p>
          <p>
            When converting Unix timestamps to human-readable dates, it is important to consider time zones. Unix timestamps are always in UTC, so converting them to local time requires applying the appropriate time zone offset. JavaScript's Date object handles this automatically when creating date instances.
          </p>
          <p>
            Leap years add an extra day (February 29) every four years, except for years divisible by 100 but not by 400. This adjustment keeps the calendar year synchronized with the astronomical year. The JavaScript Date object accounts for leap years internally, so conversions remain accurate.
          </p>
          <p>
            Daylight Saving Time (DST) shifts clocks forward or backward by one hour during certain periods of the year to extend evening daylight. This can cause confusion when converting date strings without explicit time zone information. Always specify time zones or use UTC to avoid errors.
          </p>
          <p>
            When entering date strings, ISO 8601 format (e.g., "2023-03-15T14:30:00Z") is recommended because it is unambiguous and includes time zone information. Other formats may be interpreted differently depending on the environment's locale settings.
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
            <strong>DST Confusion:</strong> Daylight Saving Time often causes 1-hour errors when converting date strings without explicit time zone info. Always specify time zones or use UTC to avoid this.
          </p>
          <p>
            <strong>Milliseconds vs Seconds:</strong> Unix timestamps can be in seconds (10 digits) or milliseconds (13 digits). Inputting the wrong unit leads to incorrect dates by a factor of 1000.
          </p>
          <p>
            <strong>Invalid Date Strings:</strong> Using ambiguous or locale-specific date formats can cause parsing errors or unexpected results. Prefer ISO 8601 format for consistency.
          </p>
          <p>
            <strong>Mixing Inputs:</strong> Filling both timestamp and date string inputs simultaneously can cause conflicts. Use only one input at a time.
          </p>
          <p>
            <strong>Ignoring Time Zones:</strong> Not accounting for time zones when converting can lead to off-by-several-hours errors. Always clarify the time zone context.
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
      title="Epoch/Unix Time Converter"
      description="Professional time calculator: Epoch/Unix Time Converter. Precise calculations, time zone handling, and scheduling tools."
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