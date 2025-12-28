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
  BookOpen,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

const cities = [
  { label: "New York (EST/EDT)", tz: "America/New_York" },
  { label: "London (GMT/BST)", tz: "Europe/London" },
  { label: "Tokyo (JST)", tz: "Asia/Tokyo" },
  { label: "Sydney (AEST/AEDT)", tz: "Australia/Sydney" },
  { label: "Los Angeles (PST/PDT)", tz: "America/Los_Angeles" },
  { label: "Dubai (GST)", tz: "Asia/Dubai" },
  { label: "Berlin (CET/CEST)", tz: "Europe/Berlin" },
];

function formatDateTime(date: Date, timeZone: string) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone,
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      weekday: "short",
    }).format(date);
  } catch {
    return "Invalid Date";
  }
}

export default function MeetingPlannerTimeZonesCalculator() {
  // Inputs: Meeting date & time in primary city, select 2nd city to convert time
  const [inputs, setInputs] = useState({
    meetingDate: "", // yyyy-mm-dd
    meetingTime: "", // HH:mm 24h
    primaryCity: "America/New_York",
    secondaryCity: "Europe/London",
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    const { meetingDate, meetingTime, primaryCity, secondaryCity } = inputs;
    if (!meetingDate || !meetingTime || !primaryCity || !secondaryCity) {
      return {
        primary: "—",
        secondary: "Please fill all inputs",
        details: "",
        feedback: "",
      };
    }

    try {
      // Parse input date and time as if in primaryCity timezone
      // Since JS Date does not support direct timezone parsing, parse as UTC then adjust
      // We'll create a Date object in UTC from the input date/time, then convert to target zones

      // Split date/time parts
      const [year, month, day] = meetingDate.split("-").map(Number);
      const [hour, minute] = meetingTime.split(":").map(Number);

      // Create a Date object in UTC with the input values as if they were in primaryCity timezone
      // To do this, we get the offset of primaryCity at that date/time, then subtract it to get UTC time

      // Get offset in minutes for primaryCity at that date/time
      const dateForOffset = new Date(Date.UTC(year, month - 1, day, hour, minute));
      const primaryOffset = -getTimezoneOffsetMinutes(dateForOffset, primaryCity);

      // UTC time = local time - offset
      const utcDate = new Date(
        Date.UTC(year, month - 1, day, hour, minute) - primaryOffset * 60000
      );

      // Format for primary city (should match input)
      const primaryFormatted = formatDateTime(utcDate, primaryCity);

      // Format for secondary city
      const secondaryFormatted = formatDateTime(utcDate, secondaryCity);

      return {
        primary: primaryFormatted,
        secondary: secondaryFormatted,
        details: `Meeting time in ${getCityLabel(primaryCity)} and ${getCityLabel(
          secondaryCity
        )}`,
        feedback:
          "Times are adjusted for Daylight Saving Time automatically based on the selected date.",
      };
    } catch (e) {
      return {
        primary: "Error",
        secondary: "Invalid input or date",
        details: "",
        feedback: "",
      };
    }
  }, [inputs]);

  // Helper: get offset in minutes for a timezone at a given date
  // Uses Intl.DateTimeFormat().formatToParts to get offset
  function getTimezoneOffsetMinutes(date: Date, timeZone: string) {
    // Format date in timeZone with hourCycle=24 and get offset by comparing with UTC
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

    // Construct a date string in local time zone
    const localDateStr = `${map.year}-${map.month}-${map.day}T${map.hour}:${map.minute}:${map.second}`;
    const localDate = new Date(localDateStr + "Z"); // treat as UTC

    // Offset in minutes = (localDate - date) / 60000
    return (localDate.getTime() - date.getTime()) / 60000;
  }

  function getCityLabel(tz: string) {
    const city = cities.find((c) => c.tz === tz);
    return city ? city.label : tz;
  }

  const faqs = [
    {
      question: "How does this calculator handle Daylight Saving Time (DST)?",
      answer:
        "This calculator automatically adjusts for Daylight Saving Time based on the selected date and the time zones of the chosen cities. It uses the JavaScript Intl API, which incorporates DST rules for each time zone, ensuring accurate conversions even during DST transitions.",
    },
    {
      question: "Can I plan meetings across multiple time zones with this tool?",
      answer:
        "Yes, by selecting the primary city and the secondary city, you can see the equivalent meeting time in both locations. This helps in finding a common time that works for participants in different time zones.",
    },
    {
      question: "Why do some time zone conversions differ by an hour during certain months?",
      answer:
        "This difference is due to Daylight Saving Time, where clocks are set forward or backward by one hour during specific periods of the year. The calculator accounts for these changes automatically based on the date you select.",
    },
    {
      question: "What if my city is not listed in the options?",
      answer:
        "Currently, the calculator supports a set of major cities/time zones. If your city is not listed, you can select the closest major city in the same time zone. Future updates may include more cities or allow custom time zone input.",
    },
    {
      question: "Is the time shown in 24-hour or 12-hour format?",
      answer:
        "The calculator displays time in 24-hour format to avoid ambiguity, especially important for international meetings. This format clearly distinguishes morning and evening hours.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "You are scheduling a project kickoff meeting on July 15th, 2024, at 9:00 AM New York time, and you want to know what time it will be in London to coordinate with your UK team.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Select 'New York' as the primary city and enter the meeting date as 2024-07-15 and time as 09:00.",
      },
      {
        label: "Step 2",
        explanation: "Select 'London' as the secondary city to see the corresponding time.",
      },
      {
        label: "Step 3",
        explanation:
          "Click 'Calculate' to view the meeting time in both New York and London, accounting for DST differences.",
      },
    ],
    result:
      "The meeting time will show as 09:00 in New York and 14:00 in London, reflecting the 5-hour time difference during July when DST is active in both locations.",
  };

  const references = [
    {
      title: "Time and Date Standards (ISO 8601)",
      description:
        "International standard for date and time representation, ensuring consistency across systems.",
      url: "https://www.iso.org/iso-8601-date-and-time-format.html",
    },
    {
      title: "MDN Web Docs: Intl.DateTimeFormat",
      description:
        "Comprehensive guide on JavaScript's Intl.DateTimeFormat API used for time zone conversions.",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat",
    },
    {
      title: "Time Zone Database (IANA TZ Database)",
      description:
        "Authoritative source for time zone and daylight saving time data used by most operating systems and programming languages.",
      url: "https://www.iana.org/time-zones",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="meetingDate">Meeting Date</Label>
          <Input
            id="meetingDate"
            type="date"
            value={inputs.meetingDate}
            onChange={(e) => handleInputChange("meetingDate", e.target.value)}
            placeholder="YYYY-MM-DD"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="meetingTime">Meeting Time (24-hour)</Label>
          <Input
            id="meetingTime"
            type="time"
            value={inputs.meetingTime}
            onChange={(e) => handleInputChange("meetingTime", e.target.value)}
            placeholder="HH:mm"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="primaryCity">Primary City / Time Zone</Label>
          <Select
            value={inputs.primaryCity}
            onValueChange={(value) => handleInputChange("primaryCity", value)}
          >
            <SelectTrigger id="primaryCity" aria-label="Primary City">
              <SelectValue placeholder="Select primary city" />
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
          <Label htmlFor="secondaryCity">Secondary City / Time Zone</Label>
          <Select
            value={inputs.secondaryCity}
            onValueChange={(value) => handleInputChange("secondaryCity", value)}
          >
            <SelectTrigger id="secondaryCity" aria-label="Secondary City">
              <SelectValue placeholder="Select secondary city" />
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
        onClick={() => {
          // No extra action needed, results update automatically
        }}
        aria-label="Calculate meeting time"
      >
        <Clock className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">
              Result
            </span>
            <div className="text-3xl font-extrabold text-blue-600 my-3">
              {results.primary}
            </div>
            <div className="text-3xl font-extrabold text-blue-600 my-3">
              {results.secondary}
            </div>
            <div className="text-xl font-bold mt-2">{results.details}</div>
            <p className="text-xs text-slate-500 mt-2">{results.feedback}</p>
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
            Select the meeting date using the date picker. Ensure the format is
            correct (YYYY-MM-DD).
          </li>
          <li>
            Enter the meeting time in 24-hour format (HH:mm) corresponding to the
            primary city/time zone.
          </li>
          <li>
            Choose the primary city/time zone where the meeting time is initially
            set.
          </li>
          <li>
            Choose the secondary city/time zone to see the equivalent meeting time
            there.
          </li>
          <li>
            Click the "Calculate" button to view the meeting time in both selected
            time zones, adjusted for any Daylight Saving Time differences.
          </li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Meeting Planner (common time across time zones)
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Scheduling meetings across different time zones can be challenging due
            to the complexities of time zone offsets, Daylight Saving Time (DST),
            and calendar differences. This calculator helps you find a common time
            by converting a meeting time from one city/time zone to another
            accurately.
          </p>
          <p>
            <strong>UTC (Coordinated Universal Time)</strong> is the primary time
            standard by which the world regulates clocks and time. Time zones are
            defined as offsets from UTC, such as UTC-5 for Eastern Standard Time
            (EST).
          </p>
          <p>
            <strong>Daylight Saving Time (DST)</strong> is the practice of setting
            clocks forward by one hour during warmer months to extend evening
            daylight. Not all regions observe DST, and the start/end dates vary,
            which can cause confusion in scheduling.
          </p>
          <p>
            <strong>Leap Years</strong> add an extra day (February 29) every four
            years to keep the calendar year synchronized with the astronomical
            year. This affects date calculations but not time zone offsets directly.
          </p>
          <p>
            This calculator uses the JavaScript Intl API to handle time zone
            conversions, which incorporates the latest time zone and DST rules,
            ensuring your meeting times are accurate and reliable.
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
            one-hour errors if not accounted for. Always verify the date to ensure
            DST is correctly applied.
          </p>
          <p>
            <strong>Wrong Time Format:</strong> Entering time in 12-hour format
            without specifying AM/PM can lead to incorrect conversions. Use 24-hour
            format as required.
          </p>
          <p>
            <strong>Incorrect Time Zone Selection:</strong> Selecting the wrong city
            or time zone can cause misleading results. Choose the closest major
            city if your exact location is not listed.
          </p>
          <p>
            <strong>Ignoring Leap Years:</strong> While leap years don't affect
            time zones, scheduling on February 29 requires special attention.
          </p>
          <p>
            <strong>Assuming Fixed Offsets:</strong> Time zone offsets can change
            due to political decisions or DST rules. Always use updated tools for
            scheduling.
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
      title="Meeting Planner (common time across time zones)"
      description="Professional time calculator: Meeting Planner (common time across time zones). Precise calculations, time zone handling, and scheduling tools."
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