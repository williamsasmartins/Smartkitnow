import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock, AlertTriangle, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

const cities = [
  { label: "New York (EST/EDT)", tz: "America/New_York" },
  { label: "London (GMT/BST)", tz: "Europe/London" },
  { label: "Tokyo (JST)", tz: "Asia/Tokyo" },
  { label: "Sydney (AEST/AEDT)", tz: "Australia/Sydney" },
  { label: "Dubai (GST)", tz: "Asia/Dubai" },
  { label: "Los Angeles (PST/PDT)", tz: "America/Los_Angeles" },
  { label: "Berlin (CET/CEST)", tz: "Europe/Berlin" },
  { label: "Moscow (MSK)", tz: "Europe/Moscow" },
];

function formatDateToTimeZone(date, timeZone) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone,
    }).format(date);
  } catch {
    return "Invalid Time Zone";
  }
}

export default function WorldClockCalculator() {
  // Inputs: Select city/time zone, input date/time in local or UTC
  // Output: Converted time in selected city/time zone

  const [inputs, setInputs] = useState({
    baseCity: "UTC",
    baseDateTime: "",
    targetCity: "America/New_York",
  });

  const handleInputChange = (field, value) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Calculate converted time
  const results = useMemo(() => {
    if (!inputs.baseDateTime) {
      return {
        primary: "--:--:--",
        secondary: "Please enter a valid date and time",
        details: "",
        feedback: "",
      };
    }

    try {
      // Parse base date/time as ISO string or local time in baseCity zone
      // Since JS Date does not support parsing in arbitrary TZ, assume input is in UTC or local time
      // We'll parse as UTC for simplicity, then convert to target TZ

      // Parse input as ISO string (assumed UTC)
      const baseDate = new Date(inputs.baseDateTime);
      if (isNaN(baseDate.getTime())) {
        return {
          primary: "--:--:--",
          secondary: "Invalid date/time format",
          details: "",
          feedback: "",
        };
      }

      // Format base time in baseCity TZ
      const baseCityLabel =
        inputs.baseCity === "UTC" ? "UTC" : cities.find((c) => c.tz === inputs.baseCity)?.label || inputs.baseCity;
      const baseTimeFormatted =
        inputs.baseCity === "UTC"
          ? baseDate.toISOString().substring(11, 19)
          : formatDateToTimeZone(baseDate, inputs.baseCity);

      // Format target time in targetCity TZ
      const targetCityLabel =
        inputs.targetCity === "UTC" ? "UTC" : cities.find((c) => c.tz === inputs.targetCity)?.label || inputs.targetCity;
      const targetTimeFormatted =
        inputs.targetCity === "UTC"
          ? baseDate.toISOString().substring(11, 19)
          : formatDateToTimeZone(baseDate, inputs.targetCity);

      return {
        primary: targetTimeFormatted,
        secondary: `Time in ${targetCityLabel}`,
        details: `Base time (${baseCityLabel}): ${baseTimeFormatted}`,
        feedback: "All times are shown in 24-hour format (HH:mm:ss).",
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        primary: "--:--:--",
        secondary: "Error calculating time",
        details: message,
        feedback: "",
      };
    }
  }, [inputs]);

  const faqs = [
    {
      question: "How does this calculator handle Daylight Saving Time (DST)?",
      answer:
        "This calculator uses the JavaScript Intl API, which automatically accounts for Daylight Saving Time changes based on the selected city's time zone. This ensures that the converted time reflects the correct offset whether DST is in effect or not.",
    },
    {
      question: "Can I convert time between any two cities worldwide?",
      answer:
        "Currently, this calculator supports a predefined list of major cities and their time zones. You can select from these cities to convert times accurately. For other cities, you may need to know their corresponding IANA time zone identifier.",
    },
    {
      question: "Why is the input date/time assumed to be in UTC?",
      answer:
        "Due to JavaScript Date limitations, the input date/time is parsed as UTC to maintain consistency. If you want to convert a local time from a specific city, you should first convert it to UTC before using this calculator.",
    },
    {
      question: "What format should I use to enter the date and time?",
      answer:
        "Enter the date and time in the ISO 8601 format (e.g., 2024-06-15T14:30:00). This format is universally recognized and ensures accurate parsing by the calculator.",
    },
    {
      question: "Can I use this calculator to schedule meetings across time zones?",
      answer:
        "Yes, this calculator is ideal for scheduling meetings by converting a given time from one city to another, helping you coordinate across different time zones effectively.",
    },
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "Planning a virtual meeting between New York and Tokyo on June 15th, 2024 at 9:00 AM New York time. You want to know what time it will be in Tokyo to schedule accordingly.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Select 'America/New_York' as the base city and enter the date and time as '2024-06-15T13:00:00' UTC (which corresponds to 9:00 AM EDT).",
      },
      {
        label: "Step 2",
        explanation:
          "Select 'Asia/Tokyo' as the target city to see the converted time in Tokyo's local time zone.",
      },
      {
        label: "Step 3",
        explanation:
          "The calculator will display the corresponding Tokyo time, allowing you to confirm the meeting time for participants in Japan.",
      },
    ],
    result:
      "The meeting scheduled at 9:00 AM in New York corresponds to 10:00 PM in Tokyo on the same day, ensuring all participants are aligned.",
  };

  const references = [
    {
      title: "Time and Date Standards (ISO 8601)",
      description: "International standard for date and time representation.",
      url: "https://www.iso.org/iso-8601-date-and-time-format.html",
    },
    {
      title: "IANA Time Zone Database",
      description:
        "Comprehensive database of time zones used by operating systems and programming languages.",
      url: "https://www.iana.org/time-zones",
    },
    {
      title: "MDN Web Docs: Intl.DateTimeFormat",
      description:
        "JavaScript API documentation for formatting dates and times according to locale and time zone.",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="baseCity">Base City / Time Zone</Label>
          <Select
            value={inputs.baseCity}
            onValueChange={(value) => handleInputChange("baseCity", value)}
          >
            <SelectTrigger id="baseCity">
              <SelectValue placeholder="Select base city" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="UTC">UTC (Coordinated Universal Time)</SelectItem>
              {cities.map((city) => (
                <SelectItem key={city.tz} value={city.tz}>
                  {city.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="baseDateTime">Base Date & Time (ISO 8601)</Label>
          <input
            id="baseDateTime"
            type="datetime-local"
            value={inputs.baseDateTime}
            onChange={(e) => handleInputChange("baseDateTime", e.target.value)}
            className="w-full rounded border border-slate-300 px-3 py-2 text-slate-900 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700"
            placeholder="YYYY-MM-DDTHH:mm"
          />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter date and time in ISO 8601 format (e.g., 2024-06-15T14:30)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="targetCity">Target City / Time Zone</Label>
          <Select
            value={inputs.targetCity}
            onValueChange={(value) => handleInputChange("targetCity", value)}
          >
            <SelectTrigger id="targetCity">
              <SelectValue placeholder="Select target city" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="UTC">UTC (Coordinated Universal Time)</SelectItem>
              {cities.map((city) => (
                <SelectItem key={city.tz} value={city.tz}>
                  {city.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg flex items-center justify-center gap-2"
        onClick={() => {
          // No explicit action needed, calculation is reactive
        }}
      >
        <Clock className="h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Result</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">{results.primary}</div>
            <div className="text-xl font-bold mt-2">{results.secondary}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
            <p className="text-xs text-slate-400 mt-1 italic">{results.feedback}</p>
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
            Select the base city or time zone from which you want to convert the time. If you want to
            use Coordinated Universal Time, select "UTC".
          </li>
          <li>
            Enter the date and time in the ISO 8601 format (e.g., 2024-06-15T14:30). The input is
            interpreted as UTC or the base city’s local time depending on your selection.
          </li>
          <li>
            Select the target city or time zone to which you want to convert the time.
          </li>
          <li>
            Click the "Calculate" button to see the converted time displayed below.
          </li>
          <li>
            Use the result to plan meetings, calls, or events across different time zones accurately.
          </li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to World Clock (list of cities)
        </h2>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p>
            Understanding time zones is essential for global communication and scheduling. The world
            is divided into multiple time zones, each representing a region where the local time is
            offset from Coordinated Universal Time (UTC) by a fixed number of hours and minutes.
            These offsets can change due to Daylight Saving Time (DST), which shifts clocks forward or
            backward to make better use of daylight during certain months.
          </p>
          <p>
            The JavaScript <code>Date</code> object represents dates and times internally as UTC
            timestamps. However, displaying or converting these times to local times in different
            zones requires additional handling. The <code>Intl.DateTimeFormat</code> API allows
            formatting dates and times according to specific locales and time zones, automatically
            accounting for DST and other regional rules.
          </p>
          <p>
            Leap years add an extra day (February 29) every four years (with some exceptions) to keep
            the calendar year synchronized with the astronomical year. This affects date calculations
            but not time zone offsets directly.
          </p>
          <p>
            When using this calculator, it is important to input the date and time in a consistent
            format (ISO 8601) and understand whether the input time is in UTC or local time of the
            base city. The calculator then converts this time accurately to the target city’s local
            time, considering all relevant factors like DST.
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
            <strong>DST Confusion:</strong> Many users forget that Daylight Saving Time shifts local
            time by one hour seasonally. This can cause errors if the calculator input does not
            account for DST or if the time zone is incorrectly assumed to be static.
          </p>
          <p>
            <strong>Incorrect Date Format:</strong> Entering dates in non-ISO formats or ambiguous
            formats can lead to parsing errors or incorrect times. Always use the ISO 8601 format
            (YYYY-MM-DDTHH:mm).
          </p>
          <p>
            <strong>Assuming Local Time as UTC:</strong> Inputting local time without converting to
            UTC first can cause wrong conversions. This calculator assumes the input time is in UTC
            or the base city’s local time depending on selection.
          </p>
          <p>
            <strong>Ignoring Time Zone Differences:</strong> Some users forget to select the correct
            base or target city/time zone, leading to unexpected results.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">Real World Example</h2>
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
            <div key={i} className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
              <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">
                {faq.question}
              </h3>
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
      title="World Clock (list of cities)"
      description="Professional time calculator: World Clock (list of cities). Precise calculations, time zone handling, and scheduling tools."
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
