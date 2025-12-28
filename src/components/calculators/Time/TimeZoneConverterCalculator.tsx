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
import { Separator } from "@/components/ui/separator";
import {
  Clock,
  BookOpen,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

const cities = [
  { label: "New York, USA (Eastern Time)", tz: "America/New_York" },
  { label: "London, UK (Greenwich Mean Time)", tz: "Europe/London" },
  { label: "Tokyo, Japan (Japan Standard Time)", tz: "Asia/Tokyo" },
  { label: "Sydney, Australia (Australian Eastern Time)", tz: "Australia/Sydney" },
  { label: "Dubai, UAE (Gulf Standard Time)", tz: "Asia/Dubai" },
  { label: "Los Angeles, USA (Pacific Time)", tz: "America/Los_Angeles" },
  { label: "Berlin, Germany (Central European Time)", tz: "Europe/Berlin" },
];

function formatDateInTimeZone(date, timeZone) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone,
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZoneName: "short",
    }).format(date);
  } catch {
    return "Invalid Date/Time";
  }
}

export default function TimeZoneConverterCalculator() {
  const [inputs, setInputs] = useState({
    date: "",
    time: "",
    fromCity: "",
    toCity: "",
  });

  const handleInputChange = (field, value) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    const { date, time, fromCity, toCity } = inputs;
    if (!date || !time || !fromCity || !toCity) {
      return null;
    }

    try {
      // Compose ISO string in fromCity timezone by parsing date and time as local in fromCity tz
      // Since JS Date does not support direct timezone parsing, we parse as if local and then convert
      // We'll parse date + time as if in fromCity tz by creating a Date object from UTC and offsetting

      // Step 1: Parse date and time as if in fromCity timezone
      // We use Intl.DateTimeFormat to get offset at that time in fromCity tz

      const fromTz = cities.find((c) => c.tz === fromCity)?.tz;
      const toTz = cities.find((c) => c.tz === toCity)?.tz;
      if (!fromTz || !toTz) return null;

      // Create a Date object in UTC from the input date/time as if it were in fromTz
      // To do this, we create a Date object from the input date/time string as if it were UTC,
      // then subtract the offset of fromTz at that time to get the actual UTC time.

      // Parse input date/time string "YYYY-MM-DD" and "HH:mm"
      const [year, month, day] = date.split("-").map(Number);
      const [hour, minute] = time.split(":").map(Number);
      if (
        !year ||
        !month ||
        !day ||
        hour === undefined ||
        minute === undefined ||
        isNaN(year) ||
        isNaN(month) ||
        isNaN(day) ||
        isNaN(hour) ||
        isNaN(minute)
      )
        return null;

      // Create a Date object in UTC at the same Y/M/D H:M:00
      const utcDate = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));

      // Get offset in minutes for fromTz at that date/time
      const getOffset = (date, timeZone) => {
        // Offset in minutes from UTC (positive means ahead of UTC)
        const dtf = new Intl.DateTimeFormat("en-US", {
          timeZone,
          timeZoneName: "shortOffset",
          hour12: false,
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
        const parts = dtf.formatToParts(date);
        // Extract offset string like GMT+2 or GMT-5
        const tzNamePart = parts.find((p) =>
          p.type === "timeZoneName" || p.type === "literal"
        );
        // Unfortunately, "shortOffset" is not widely supported, fallback:
        // We'll use getTimezoneOffset trick below instead.

        // Use getTimezoneOffset for offset in minutes (negative means ahead of UTC)
        return -date.getTimezoneOffset();
      };

      // Because getTimezoneOffset is local time based, we need a workaround:
      // We'll use Intl.DateTimeFormat to get the offset by comparing formatted times.

      // Helper to get offset in minutes for a timezone at a given UTC date
      function getTimezoneOffsetMinutes(date, timeZone) {
        const dtf = new Intl.DateTimeFormat("en-US", {
          timeZone,
          hour12: false,
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
        const local = dtf.format(date);
        // Parse local time parts
        const [m, d, y, hh, mm, ss] = local.match(/\d+/g).map(Number);
        // Create a date in local time zone with those parts
        const asLocal = new Date(y, m - 1, d, hh, mm, ss);
        // Offset in minutes = (asLocal - date) / 60000
        return (asLocal.getTime() - date.getTime()) / 60000;
      }

      const offsetFrom = getTimezoneOffsetMinutes(utcDate, fromTz);
      // Adjust utcDate by subtracting offsetFrom to get the actual UTC time of the input date/time in fromTz
      const actualUtcTime = new Date(utcDate.getTime() - offsetFrom * 60000);

      // Now convert actualUtcTime to toTz time string
      const convertedTime = formatDateInTimeZone(actualUtcTime, toTz);

      return {
        primary: convertedTime,
        secondary: `Time in ${cities.find((c) => c.tz === toCity)?.label}`,
        details: `Converted from ${cities.find((c) => c.tz === fromCity)?.label} time (${date} ${time})`,
        feedback: `Note: Conversion accounts for Daylight Saving Time and UTC offsets.`,
      };
    } catch {
      return {
        primary: "Invalid input",
        secondary: "Please check your inputs",
        details: "",
        feedback: "",
      };
    }
  }, [inputs]);

  const faqs = [
    {
      question: "How does this calculator handle Daylight Saving Time (DST)?",
      answer:
        "This calculator uses the Intl.DateTimeFormat API, which automatically accounts for Daylight Saving Time changes based on the selected cities' time zones. This ensures that the converted time reflects the correct local time, whether DST is in effect or not, preventing common errors related to manual DST calculations.",
    },
    {
      question: "Can I convert time between any cities worldwide?",
      answer:
        "Currently, this calculator supports a predefined list of major cities with their respective time zones. This list can be extended, but for now, you can select from cities like New York, London, Tokyo, Sydney, Dubai, Los Angeles, and Berlin. This ensures accurate and reliable conversions without relying on external APIs.",
    },
    {
      question: "Why do I need to input both date and time?",
      answer:
        "Time zone offsets can vary depending on the date due to Daylight Saving Time and historical changes. Providing both date and time allows the calculator to accurately determine the correct offset for the specific moment you want to convert, ensuring precise results.",
    },
    {
      question: "What happens if I enter an invalid date or time?",
      answer:
        "If the input date or time is invalid or incomplete, the calculator will not perform the conversion and will prompt you to check your inputs. This prevents incorrect or misleading results and helps maintain accuracy.",
    },
    {
      question: "Is the converted time displayed in 24-hour or 12-hour format?",
      answer:
        "The converted time is displayed in a 24-hour format with seconds and the time zone abbreviation for clarity. This format avoids ambiguity between AM and PM and provides precise time information.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "You are coordinating a virtual meeting between your New York office and your Tokyo branch on July 15th, 2024, at 9:00 AM New York time. You need to know what time this corresponds to in Tokyo to schedule the meeting appropriately.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Select 'New York, USA (Eastern Time)' as the 'From City' and 'Tokyo, Japan (Japan Standard Time)' as the 'To City'.",
      },
      {
        label: "Step 2",
        explanation: "Enter the date '2024-07-15' and time '09:00' for the New York time.",
      },
      {
        label: "Step 3",
        explanation:
          "Click 'Calculate' to see the corresponding time in Tokyo, which will account for the time zone difference and any DST adjustments.",
      },
    ],
    result:
      "The calculator shows that 9:00 AM in New York on July 15th, 2024, corresponds to 10:00 PM in Tokyo on the same day, allowing you to schedule your meeting accurately.",
  };

  const references = [
    {
      title: "Time and Date Standards (ISO 8601)",
      description: "International standard for date and time representation.",
      url: "https://www.iso.org/iso-8601-date-and-time-format.html",
    },
    {
      title: "MDN Web Docs: Intl.DateTimeFormat",
      description:
        "Comprehensive documentation on the Intl.DateTimeFormat API used for time zone conversions.",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat",
    },
    {
      title: "Time Zone Database (IANA TZ Database)",
      description:
        "The authoritative database of time zone and daylight saving time information.",
      url: "https://www.iana.org/time-zones",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="date">Date (YYYY-MM-DD)</Label>
          <input
            id="date"
            type="date"
            value={inputs.date}
            onChange={(e) => handleInputChange("date", e.target.value)}
            className="w-full border border-slate-300 rounded px-3 py-2"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="time">Time (24-hour HH:mm)</Label>
          <input
            id="time"
            type="time"
            value={inputs.time}
            onChange={(e) => handleInputChange("time", e.target.value)}
            className="w-full border border-slate-300 rounded px-3 py-2"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fromCity">From City / Time Zone</Label>
          <Select
            onValueChange={(value) => handleInputChange("fromCity", value)}
            value={inputs.fromCity}
          >
            <SelectTrigger id="fromCity" className="w-full">
              <SelectValue placeholder="Select city/time zone" />
            </SelectTrigger>
            <SelectContent>
              {cities.map((city) => (
                <SelectItem key={city.tz} value={city.tz}>
                  {city.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="toCity">To City / Time Zone</Label>
          <Select
            onValueChange={(value) => handleInputChange("toCity", value)}
            value={inputs.toCity}
          >
            <SelectTrigger id="toCity" className="w-full">
              <SelectValue placeholder="Select city/time zone" />
            </SelectTrigger>
            <SelectContent>
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
            Select the date you want to convert the time for using the date picker.
          </li>
          <li>
            Enter the time in 24-hour format (HH:mm) corresponding to the "From City"
            time zone.
          </li>
          <li>
            Choose the "From City / Time Zone" from the dropdown list where your input
            time is based.
          </li>
          <li>
            Choose the "To City / Time Zone" from the dropdown list to which you want
            to convert the time.
          </li>
          <li>
            Click the "Calculate" button to see the converted time displayed below,
            including time zone abbreviations and details.
          </li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Time Zone Converter (between cities)
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Time zones are regions of the Earth that have the same standard time. They
            are usually defined by their offset from Coordinated Universal Time (UTC),
            which is the primary time standard by which the world regulates clocks and
            time. For example, New York operates on UTC-5 during standard time and UTC-4
            during Daylight Saving Time (DST).
          </p>
          <p>
            Daylight Saving Time is the practice of setting clocks forward by one hour
            during warmer months to extend evening daylight. This shift affects the UTC
            offset of a time zone temporarily, which is why accurate time zone
            conversions must consider the date to determine if DST is in effect.
          </p>
          <p>
            Leap years add an extra day (February 29) every four years to keep the
            calendar year synchronized with the astronomical year. While leap years do
            not directly affect time zone conversions, they are important for date
            calculations and scheduling.
          </p>
          <p>
            This calculator leverages the JavaScript Intl.DateTimeFormat API, which
            provides robust support for internationalization, including time zone
            conversions and DST adjustments. By inputting a date and time in one city’s
            time zone, the calculator accurately converts it to the corresponding time
            in another city’s time zone.
          </p>
          <p>
            Understanding these concepts helps avoid scheduling errors, especially in
            global communications, travel planning, and project management where
            precise timing is critical.
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
            <strong>DST Confusion:</strong> Many users forget to consider Daylight
            Saving Time changes, leading to errors of one hour in conversions. This
            calculator automatically adjusts for DST based on the date and city.
          </p>
          <p>
            <strong>Incorrect Date or Time Format:</strong> Inputting invalid or
            incomplete dates and times can cause inaccurate results or no output.
            Always use the provided date and time pickers or follow the specified
            formats.
          </p>
          <p>
            <strong>Assuming Fixed Offsets:</strong> Time zone offsets can change due
            to political decisions or DST. Avoid assuming fixed hour differences
            between cities.
          </p>
          <p>
            <strong>Ignoring Time Zone Selection:</strong> Ensure you select the correct
            'From' and 'To' cities/time zones. Mixing these up will produce incorrect
            conversions.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Real World Example
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>{example.scenario}</p>
          <ol className="list-decimal pl-5 space-y-2">
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
          <BookOpen className="w-5 h-5 text-blue-500" />
          References & additional resources
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
      title="Time Zone Converter (between cities)"
      description="Professional time calculator: Time Zone Converter (between cities). Precise calculations, time zone handling, and scheduling tools."
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