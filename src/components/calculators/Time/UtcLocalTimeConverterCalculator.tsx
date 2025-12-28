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
import { Separator } from "@/components/ui/separator";
import {
  Clock,
  Calendar as CalendarIcon,
  Globe,
  Info,
  AlertTriangle,
  BookOpen,
  ExternalLink,
  Timer,
  Sun,
  Moon,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

const timeZones = [
  { label: "UTC", zone: "UTC" },
  { label: "New York (EST/EDT)", zone: "America/New_York" },
  { label: "London (GMT/BST)", zone: "Europe/London" },
  { label: "Tokyo (JST)", zone: "Asia/Tokyo" },
  { label: "Sydney (AEST/AEDT)", zone: "Australia/Sydney" },
  { label: "Los Angeles (PST/PDT)", zone: "America/Los_Angeles" },
  { label: "Berlin (CET/CEST)", zone: "Europe/Berlin" },
];

function formatDateToZone(date: Date, timeZone: string) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(date);
  } catch {
    return "Invalid Date/Time";
  }
}

export default function UtcLocalTimeConverterCalculator() {
  // Inputs:
  // 1. Date & time input (local or UTC)
  // 2. Select input zone (source)
  // 3. Select output zone (target)
  // 4. Direction toggle: UTC → Local or Local → UTC

  const [inputs, setInputs] = useState({
    datetime: "", // ISO string input (date + time)
    fromZone: "UTC",
    toZone: "America/New_York",
    direction: "UTC→Local", // or "Local→UTC"
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Conversion logic:
  // If direction is UTC→Local:
  //   Parse datetime as UTC, convert to target zone
  // If direction is Local→UTC:
  //   Parse datetime as local (fromZone), convert to UTC

  const results = useMemo(() => {
    if (!inputs.datetime || !inputs.fromZone || !inputs.toZone) {
      return {
        primary: "-",
        secondary: "Please enter all inputs",
        details: "",
        feedback: "",
      };
    }

    try {
      // Parse input datetime string as ISO (assumed local time in fromZone)
      // We need to get the timestamp in UTC for conversion.

      // To parse a datetime string as if it is in a specific time zone,
      // we can use Intl.DateTimeFormat with timeZone option to get offset,
      // but JS Date does not support parsing with time zone directly.
      // So we do a workaround:

      // 1. Parse input datetime as if it is in fromZone.
      // 2. Convert to UTC timestamp.
      // 3. Convert UTC timestamp to toZone.

      // Helper: get offset in minutes for a zone at a given date
      function getOffsetMinutes(date: Date, timeZone: string) {
        // Format date in the target timeZone with hour and minute
        const dtf = new Intl.DateTimeFormat("en-US", {
          hour12: false,
          timeZone,
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
        const parts = dtf.formatToParts(date);
        const map: Record<string, string> = {};
        parts.forEach(({ type, value }) => {
          map[type] = value;
        });

        // Construct a date string in ISO format for the timeZone
        const asString = `${map.year}-${map.month}-${map.day}T${map.hour}:${map.minute}:${map.second}`;
        const asDate = new Date(asString + "Z"); // treat as UTC

        // offset in ms = local time - UTC time
        return (date.getTime() - asDate.getTime()) / 60000;
      }

      // Parse input datetime string as local time (no timezone info)
      // e.g. "2024-06-01T15:30"
      const inputDateLocal = new Date(inputs.datetime);
      if (isNaN(inputDateLocal.getTime())) {
        return {
          primary: "Invalid Date",
          secondary: "Please enter a valid date and time",
          details: "",
          feedback: "",
        };
      }

      // Get offset of fromZone at inputDateLocal
      const offsetFrom = getOffsetMinutes(inputDateLocal, inputs.fromZone);

      // Calculate UTC timestamp from input local time in fromZone
      // UTC time = local time - offset
      const utcTimestamp =
        inputDateLocal.getTime() - offsetFrom * 60 * 1000;

      const utcDate = new Date(utcTimestamp);

      // Get offset of toZone at utcDate
      const offsetTo = getOffsetMinutes(utcDate, inputs.toZone);

      // Calculate target time in toZone
      // target time = UTC + offsetTo
      const targetTimestamp = utcTimestamp + offsetTo * 60 * 1000;
      const targetDate = new Date(targetTimestamp);

      // Format results
      const fromFormatted = formatDateToZone(inputDateLocal, inputs.fromZone);
      const toFormatted = formatDateToZone(targetDate, inputs.toZone);
      const utcFormatted = formatDateToZone(utcDate, "UTC");

      return {
        primary:
          inputs.direction === "UTC→Local"
            ? toFormatted
            : utcFormatted,
        secondary:
          inputs.direction === "UTC→Local"
            ? `Time in ${inputs.toZone}`
            : "Time in UTC",
        details:
          inputs.direction === "UTC→Local"
            ? `Input UTC time: ${fromFormatted}`
            : `Input local time (${inputs.fromZone}): ${fromFormatted}`,
        feedback:
          "Note: This conversion accounts for Daylight Saving Time automatically.",
      };
    } catch (e) {
      return {
        primary: "Error",
        secondary: "Failed to convert time",
        details: "",
        feedback: "",
      };
    }
  }, [inputs]);

  const faqs = [
    {
      question: "What is UTC and why is it important?",
      answer:
        "UTC (Coordinated Universal Time) is the primary time standard by which the world regulates clocks and time. It is essential for synchronizing time across different regions and systems, ensuring consistency in communication, travel, and computing. Unlike local times, UTC does not change with Daylight Saving Time, making it a stable reference point.",
    },
    {
      question: "How does Daylight Saving Time affect time conversion?",
      answer:
        "Daylight Saving Time (DST) shifts local time forward or backward by one hour during certain periods of the year to extend evening daylight. This can cause confusion when converting between UTC and local times, as the offset changes. Our calculator automatically accounts for DST based on the selected time zone and date, ensuring accurate conversions.",
    },
    {
      question: "Can I convert times between any two cities?",
      answer:
        "This calculator supports a selection of major cities/time zones for demonstration purposes. Each city corresponds to a recognized IANA time zone identifier. For other cities, you may need to know their time zone or use specialized tools. The underlying logic can be extended to support more zones if needed.",
    },
    {
      question: "Why do some time conversions show unexpected results?",
      answer:
        "Unexpected results often stem from incorrect input formats, misunderstanding of time zones, or DST transitions. For example, entering a local time during the hour skipped by DST can cause invalid or ambiguous results. Always ensure your input time and selected zones are correct and consider DST effects.",
    },
    {
      question: "How accurate is this calculator for historical or future dates?",
      answer:
        "The calculator uses the JavaScript Intl API, which relies on the host environment's time zone database. While generally accurate for recent and near-future dates, historical time zone rules or far future changes may not be fully reflected. For critical applications, consult official time zone databases or services.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "Planning a virtual meeting between New York and Tokyo on June 10th, 2024, at 9:00 AM New York time, and needing to know the corresponding Tokyo local time.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Select 'Local→UTC' direction since you start with New York local time.",
      },
      {
        label: "Step 2",
        explanation:
          "Input the date and time as '2024-06-10T09:00' and select 'America/New_York' as the source time zone.",
      },
      {
        label: "Step 3",
        explanation:
          "Select 'UTC' as the target time zone and calculate to find the UTC equivalent.",
      },
      {
        label: "Step 4",
        explanation:
          "Then switch direction to 'UTC→Local', input the UTC time from Step 3, select 'Asia/Tokyo' as the target zone, and calculate to get Tokyo local time.",
      },
    ],
    result:
      "The meeting at 9:00 AM in New York corresponds to 10:00 PM the same day in Tokyo, accounting for the 13-hour time difference and DST.",
  };

  const references = [
    {
      title: "Time and Date Standards (ISO 8601)",
      description:
        "International standard for date and time representation, ensuring consistency across systems.",
      url: "https://www.iso.org/iso-8601-date-and-time-format.html",
    },
    {
      title: "IANA Time Zone Database",
      description:
        "The authoritative source for time zone and daylight saving time data worldwide.",
      url: "https://www.iana.org/time-zones",
    },
    {
      title: "MDN Web Docs: Intl.DateTimeFormat",
      description:
        "Documentation on JavaScript's internationalization API for date and time formatting.",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat",
    },
    {
      title: "World Time Buddy",
      description:
        "Popular online tool for comparing time zones and scheduling meetings.",
      url: "https://www.worldtimebuddy.com/",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="datetime">
            Date & Time (ISO format: YYYY-MM-DDThh:mm)
          </Label>
          <Input
            id="datetime"
            type="datetime-local"
            value={inputs.datetime}
            onChange={(e) => handleInputChange("datetime", e.target.value)}
            placeholder="2024-06-01T15:30"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fromZone">From Time Zone</Label>
          <Select
            value={inputs.fromZone}
            onValueChange={(value) => handleInputChange("fromZone", value)}
          >
            <SelectTrigger id="fromZone" className="w-full">
              <SelectValue placeholder="Select source time zone" />
            </SelectTrigger>
            <SelectContent>
              {timeZones.map((tz) => (
                <SelectItem key={tz.zone} value={tz.zone}>
                  {tz.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="toZone">To Time Zone</Label>
          <Select
            value={inputs.toZone}
            onValueChange={(value) => handleInputChange("toZone", value)}
          >
            <SelectTrigger id="toZone" className="w-full">
              <SelectValue placeholder="Select target time zone" />
            </SelectTrigger>
            <SelectContent>
              {timeZones.map((tz) => (
                <SelectItem key={tz.zone} value={tz.zone}>
                  {tz.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="direction">Conversion Direction</Label>
          <Select
            value={inputs.direction}
            onValueChange={(value) => handleInputChange("direction", value)}
          >
            <SelectTrigger id="direction" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="UTC→Local">UTC → Local Time</SelectItem>
              <SelectItem value="Local→UTC">Local Time → UTC</SelectItem>
            </SelectContent>
          </Select>
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
            <p className="mt-2 text-sm italic text-slate-600 dark:text-slate-400">
              {results.feedback}
            </p>
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
            Enter the date and time you want to convert using the datetime-local
            input. Use the format YYYY-MM-DDThh:mm (e.g., 2024-06-01T15:30).
          </li>
          <li>
            Select the source time zone ("From Time Zone") that corresponds to
            the input time.
          </li>
          <li>
            Select the target time zone ("To Time Zone") to which you want to
            convert the time.
          </li>
          <li>
            Choose the conversion direction: "UTC → Local Time" if your input is
            in UTC and you want local time, or "Local Time → UTC" if your input
            is local time and you want UTC.
          </li>
          <li>Click the Calculate button to see the converted time and details.</li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to UTC ↔ Local Time Converter
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Coordinated Universal Time (UTC) is the global time standard used to
            synchronize clocks worldwide. Unlike local times, UTC does not change
            with seasons or daylight saving adjustments, making it a reliable
            reference point. Local times vary by geographic location and may
            observe Daylight Saving Time (DST), which shifts clocks forward or
            backward by one hour during certain periods to maximize daylight
            usage.
          </p>
          <p>
            Leap years are years with an extra day (February 29) added to keep
            calendars aligned with Earth's revolutions around the Sun. This
            adjustment ensures that seasonal events occur at roughly the same time
            each year. Leap seconds are occasionally added to UTC to compensate for
            Earth's slowing rotation, but these are not handled by this calculator.
          </p>
          <p>
            Time zone conversions require careful handling of offsets and DST rules.
            The JavaScript Intl API provides robust support for these conversions
            by using the IANA time zone database, which contains historical and
            current rules for time zones worldwide. This calculator leverages these
            capabilities to provide accurate conversions between UTC and local
            times for selected cities.
          </p>
          <p>
            When converting times, always consider the direction of conversion and
            the time zone context of your input. For example, converting a local
            time to UTC requires knowing the local time zone offset at that date,
            including any DST adjustments. Conversely, converting UTC to local time
            applies the target zone's offset and DST rules.
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
            one-hour errors if not accounted for properly. Always verify if the
            date falls within DST period for the selected time zone.
          </p>
          <p>
            <strong>Incorrect Input Format:</strong> Using an invalid or ambiguous
            date/time format can lead to wrong conversions. Use the provided
            datetime-local input to ensure correct ISO format.
          </p>
          <p>
            <strong>Wrong Direction:</strong> Mixing up the conversion direction
            (UTC→Local vs Local→UTC) can produce unexpected results. Double-check
            your selection before calculating.
          </p>
          <p>
            <strong>Unsupported Time Zones:</strong> This calculator supports a
            limited set of major time zones. Using unsupported zones may cause
            errors or inaccurate results.
          </p>
          <p>
            <strong>Ignoring Leap Seconds:</strong> Leap seconds are not handled by
            this calculator and can cause minor discrepancies in precise timing
            applications.
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
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
                target="_blank"
                rel="noopener noreferrer"
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
      title="UTC ↔ Local Time Converter"
      description="Professional time calculator: UTC ↔ Local Time Converter. Precise calculations, time zone handling, and scheduling tools."
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