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
import { Clock, Calendar as CalendarIcon, Globe, Info, AlertTriangle, BookOpen, ExternalLink, Sun, Moon } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

const hemisphereOptions = [
  { value: "northern", label: "Northern Hemisphere" },
  { value: "southern", label: "Southern Hemisphere" },
];

const locationOptions = [
  { value: "new_york", label: "New York, USA (UTC-5/UTC-4 DST)", lat: 40.7128, lon: -74.006 },
  { value: "london", label: "London, UK (UTC+0/UTC+1 DST)", lat: 51.5074, lon: -0.1278 },
  { value: "sydney", label: "Sydney, Australia (UTC+10/UTC+11 DST)", lat: -33.8688, lon: 151.2093 },
  { value: "tokyo", label: "Tokyo, Japan (UTC+9, no DST)", lat: 35.6762, lon: 139.6503 },
  { value: "cape_town", label: "Cape Town, South Africa (UTC+2, no DST)", lat: -33.9249, lon: 18.4241 },
];

// Helper: Convert degrees to radians
const degToRad = (deg: number) => (deg * Math.PI) / 180;
// Helper: Convert radians to degrees
const radToDeg = (rad: number) => (rad * 180) / Math.PI;

// Calculate approximate sunrise and sunset times using simplified solar calculations
// Source: NOAA Solar Calculator simplified formula
// Returns times in UTC decimal hours (0-24)
function calculateSunriseSunsetUTC(
  date: Date,
  latitude: number,
  longitude: number
): { sunriseUTC: number; sunsetUTC: number } | null {
  try {
    // Julian day
    const J1970 = 2440588;
    const J2000 = 2451545;

    // Days since J2000
    const toJulian = (d: Date) =>
      d.valueOf() / 86400000 - 0.5 + J1970;
    const toDays = (d: Date) => toJulian(d) - J2000;

    const days = toDays(date);

    // Mean solar noon
    const lw = -longitude * Math.PI / 180;
    const n = Math.round(days - 0.0009 - lw / (2 * Math.PI));
    const Jnoon = 2451545 + 0.0009 + lw / (2 * Math.PI) + n;

    // Solar mean anomaly
    const M = (357.5291 + 0.98560028 * (Jnoon - J2000)) % 360;
    const Mrad = degToRad(M);

    // Equation of center
    const C =
      1.9148 * Math.sin(Mrad) +
      0.0200 * Math.sin(2 * Mrad) +
      0.0003 * Math.sin(3 * Mrad);

    // Ecliptic longitude
    const lambda = (M + C + 180 + 102.9372) % 360;
    const lambdarad = degToRad(lambda);

    // Solar transit (J2000)
    const Jtransit =
      J2000 +
      0.0009 +
      (lw / (2 * Math.PI)) +
      n +
      0.0053 * Math.sin(Mrad) -
      0.0069 * Math.sin(2 * lambdarad);

    // Sun declination
    const delta = Math.asin(
      Math.sin(lambdarad) * Math.sin(degToRad(23.44))
    );

    // Hour angle
    const latRad = degToRad(latitude);
    const cos_omega =
      (Math.sin(degToRad(-0.83)) - Math.sin(latRad) * Math.sin(delta)) /
      (Math.cos(latRad) * Math.cos(delta));

    if (cos_omega > 1) {
      // Sun always below horizon (polar night)
      return null;
    } else if (cos_omega < -1) {
      // Sun always above horizon (midnight sun)
      return null;
    }

    const omega = Math.acos(cos_omega);

    // Sunrise and sunset (J2000)
    const Jrise = Jtransit - omega / (2 * Math.PI);
    const Jset = Jtransit + omega / (2 * Math.PI);

    // Convert Julian day to UTC hours
    const fromJulian = (j: number) =>
      (j + 0.5 - J1970) * 86400000;

    const sunriseDate = new Date(fromJulian(Jrise));
    const sunsetDate = new Date(fromJulian(Jset));

    const sunriseUTC = sunriseDate.getUTCHours() + sunriseDate.getUTCMinutes() / 60;
    const sunsetUTC = sunsetDate.getUTCHours() + sunsetDate.getUTCMinutes() / 60;

    return { sunriseUTC, sunsetUTC };
  } catch {
    return null;
  }
}

// Format decimal hours to HH:MM string
function formatTime(decimalHours: number) {
  if (decimalHours === null || isNaN(decimalHours)) return "N/A";
  let hours = Math.floor(decimalHours);
  let minutes = Math.round((decimalHours - hours) * 60);
  if (minutes === 60) {
    minutes = 0;
    hours += 1;
  }
  if (hours >= 24) hours -= 24;
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
}

// Adjust UTC time to local time with DST consideration (mocked)
function utcToLocalTime(
  utcHours: number,
  date: Date,
  timezoneOffset: number,
  dstOffset: number
) {
  let local = utcHours + timezoneOffset + dstOffset;
  if (local < 0) local += 24;
  if (local >= 24) local -= 24;
  return local;
}

// Mock DST rules for selected locations (simplified)
function isDST(date: Date, location: string) {
  const year = date.getUTCFullYear();
  switch (location) {
    case "new_york": {
      const march = new Date(Date.UTC(year, 2, 1));
      const nov = new Date(Date.UTC(year, 10, 1));
      const secondSundayMarch = 7 + (7 - march.getUTCDay()) % 7 + 7;
      const firstSundayNov = 1 + (7 - nov.getUTCDay()) % 7;
      const dstStart = new Date(Date.UTC(year, 2, secondSundayMarch, 2));
      const dstEnd = new Date(Date.UTC(year, 10, firstSundayNov, 2));
      return date >= dstStart && date < dstEnd;
    }
    case "london": {
      const lastSunday = (month: number) => {
        const lastDay = new Date(Date.UTC(year, month + 1, 0));
        return lastDay.getUTCDate() - lastDay.getUTCDay();
      };
      const dstStartLondon = new Date(Date.UTC(year, 2, lastSunday(2), 1));
      const dstEndLondon = new Date(Date.UTC(year, 9, lastSunday(9), 1));
      return date >= dstStartLondon && date < dstEndLondon;
    }
    case "sydney": {
      const firstSunday = (month: number) => {
        const firstDay = new Date(Date.UTC(year, month, 1));
        return 1 + ((7 - firstDay.getUTCDay()) % 7);
      };
      const dstStartSydney = new Date(Date.UTC(year, 9, firstSunday(9), 16));
      const dstEndSydney = new Date(Date.UTC(year, 3, firstSunday(3), 16));
      return date >= dstStartSydney || date < dstEndSydney;
    }
    default:
      return false;
  }
}

export default function SunriseSunsetTimesCalculator() {
  const [inputs, setInputs] = useState({
    date: "",
    hemisphere: "northern",
    location: "new_york",
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    if (!inputs.date || !inputs.location) return null;
    try {
      const date = new Date(inputs.date + "T12:00:00Z"); // Noon UTC to avoid date shift

      // Find location data
      const loc = locationOptions.find((l) => l.value === inputs.location);
      if (!loc) return null;

      // Calculate sunrise/sunset UTC times
      const sunTimes = calculateSunriseSunsetUTC(date, loc.lat, loc.lon);
      if (!sunTimes) {
        return {
          primary: "No Sunrise/Sunset",
          secondary: "Polar Day or Night",
          details:
            "The sun does not rise or set on this date at the selected location due to polar day/night phenomena.",
          feedback: "",
        };
      }

      // Determine DST offset in hours
      const dst = isDST(date, inputs.location) ? 1 : 0;

      // Timezone offset in hours (standard time)
      // Mocked from location label info
      let tzOffset = 0;
      switch (inputs.location) {
        case "new_york":
          tzOffset = -5;
          break;
        case "london":
          tzOffset = 0;
          break;
        case "sydney":
          tzOffset = 10;
          break;
        case "tokyo":
          tzOffset = 9;
          break;
        case "cape_town":
          tzOffset = 2;
          break;
        default:
          tzOffset = 0;
      }

      // Convert UTC to local time with DST
      const sunriseLocal = utcToLocalTime(
        sunTimes.sunriseUTC,
        date,
        tzOffset,
        dst
      );
      const sunsetLocal = utcToLocalTime(
        sunTimes.sunsetUTC,
        date,
        tzOffset,
        dst
      );

      return {
        primary: `${formatTime(sunriseLocal)} / ${formatTime(sunsetLocal)}`,
        secondary: "Sunrise / Sunset (Local Time)",
        details: `Date: ${date.toDateString()} | Location: ${loc.label} | DST: ${
          dst ? "Yes (+1h)" : "No"
        }`,
        feedback:
          "Times are approximate and calculated using simplified solar position formulas. Actual times may vary slightly due to atmospheric conditions and elevation.",
      };
    } catch {
      return {
        primary: "Invalid Input",
        secondary: "Please check your date and location selections.",
        details: "",
        feedback: "",
      };
    }
  }, [inputs]);

  const faqs = [
    {
      question: "How accurate are the sunrise and sunset times?",
      answer:
        "The times provided are approximate estimations based on simplified solar position formulas. They do not account for atmospheric refraction, elevation, or local terrain, which can affect actual sunrise and sunset times by several minutes. For precise times, specialized astronomical software or local observatories should be consulted.",
    },
    {
      question: "Why do sunrise and sunset times change throughout the year?",
      answer:
        "Sunrise and sunset times vary due to Earth's axial tilt and its elliptical orbit around the Sun. These factors cause the Sun's apparent position in the sky to shift daily, resulting in longer days in summer and shorter days in winter for each hemisphere.",
    },
    {
      question: "How does Daylight Saving Time (DST) affect sunrise and sunset times?",
      answer:
        "Daylight Saving Time shifts the clock forward by one hour during certain months to extend evening daylight. This means sunrise and sunset times appear one hour later on the clock during DST periods, even though the Sun's position remains unchanged.",
    },
    {
      question: "What is the difference between UTC and local time?",
      answer:
        "UTC (Coordinated Universal Time) is the primary time standard by which the world regulates clocks and time. Local time is adjusted from UTC by a time zone offset and may include Daylight Saving Time adjustments, reflecting the time used by people in a specific region.",
    },
    {
      question: "Why might there be no sunrise or sunset on some days?",
      answer:
        "In polar regions during summer or winter, the Sun can remain continuously above or below the horizon for 24 hours, known as the Midnight Sun or Polar Night. During these periods, sunrise or sunset does not occur on certain days.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "Planning a photography session in New York City on June 21st, the summer solstice, to capture the sunrise and sunset.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Select the date June 21st in the date input field.",
      },
      {
        label: "Step 2",
        explanation:
          "Choose 'New York, USA' from the location dropdown to get local sunrise and sunset times.",
      },
      {
        label: "Step 3",
        explanation:
          "Click the 'Calculate' button to view the approximate sunrise and sunset times in local time, considering DST if applicable.",
      },
    ],
    result:
      "The calculator shows sunrise at approximately 05:25 and sunset at 20:30 local time, helping you schedule your photography session accordingly.",
  };

  const references = [
    {
      title: "NOAA Solar Calculator",
      description:
        "National Oceanic and Atmospheric Administration's solar calculations and algorithms.",
      url: "https://gml.noaa.gov/grad/solcalc/solareqns.PDF",
    },
    {
      title: "Time and Date Standards (ISO 8601)",
      description:
        "International standard for date and time representation.",
      url: "https://www.iso.org/iso-8601-date-and-time-format.html",
    },
    {
      title: "Daylight Saving Time Explained",
      description:
        "Comprehensive explanation of DST and its effects on timekeeping.",
      url: "https://www.timeanddate.com/time/dst/",
    },
    {
      title: "Astronomical Algorithms by Jean Meeus",
      description:
        "A widely used reference book for precise astronomical calculations.",
      url: "https://www.willbell.com/math/mc1.htm",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">
            <CalendarIcon className="inline mr-1" /> Date
          </Label>
          <Input
            id="date"
            type="date"
            value={inputs.date}
            onChange={(e) => handleInputChange("date", e.target.value)}
            max={new Date().toISOString().slice(0, 10)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hemisphere">
            <Globe className="inline mr-1" /> Hemisphere
          </Label>
          <Select
            id="hemisphere"
            value={inputs.hemisphere}
            onValueChange={(val) => handleInputChange("hemisphere", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Hemisphere" />
            </SelectTrigger>
            <SelectContent>
              {hemisphereOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">
            <Info className="inline mr-1" /> Location
          </Label>
          <Select
            id="location"
            value={inputs.location}
            onValueChange={(val) => handleInputChange("location", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Location" />
            </SelectTrigger>
            <SelectContent>
              {locationOptions
                .filter((loc) =>
                  inputs.hemisphere === "northern"
                    ? loc.lat >= 0
                    : loc.lat < 0
                )
                .map((loc) => (
                  <SelectItem key={loc.value} value={loc.value}>
                    {loc.label}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg">
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
              <p className="mt-3 text-sm italic text-slate-600 dark:text-slate-400">
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
            Select the date for which you want to calculate sunrise and sunset
            times using the date picker.
          </li>
          <li>
            Choose your hemisphere (Northern or Southern) to filter relevant
            locations.
          </li>
          <li>
            Select your location from the dropdown menu. Locations are grouped
            by hemisphere for convenience.
          </li>
          <li>
            Click the "Calculate" button to compute approximate sunrise and
            sunset times in your local time, accounting for time zone and
            daylight saving time.
          </li>
          <li>
            Review the results displayed below, which show sunrise and sunset
            times formatted as HH:MM in local time.
          </li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Sunrise and Sunset Times
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Sunrise and sunset times depend on the Earth's rotation, axial tilt,
            and orbit around the Sun. The Earth is tilted about 23.44 degrees
            relative to its orbital plane, causing the Sun's apparent position
            in the sky to change throughout the year. This tilt results in
            varying day lengths and changing sunrise and sunset times.
          </p>
          <p>
            Leap years are introduced every four years (with exceptions) to
            keep our calendar aligned with Earth's orbit. This affects date
            calculations but has minimal direct impact on sunrise and sunset
            times.
          </p>
          <p>
            Coordinated Universal Time (UTC) is the global time standard.
            Local times are derived from UTC by applying time zone offsets and
            daylight saving time (DST) adjustments. DST shifts clocks forward
            by one hour during warmer months to extend evening daylight,
            affecting the clock times of sunrise and sunset.
          </p>
          <p>
            This calculator uses simplified astronomical formulas to estimate
            sunrise and sunset times based on latitude, longitude, and date.
            While accurate for general use, it does not consider atmospheric
            refraction, elevation, or local topography, which can cause minor
            variations.
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
            <strong>DST Confusion:</strong> Forgetting to account for Daylight
            Saving Time can cause sunrise and sunset times to be off by one
            hour. Always verify if DST is in effect for your selected date and
            location.
          </p>
          <p>
            <strong>Incorrect Time Zone:</strong> Using the wrong time zone or
            ignoring time zone differences leads to inaccurate local times.
            This calculator mocks common time zones but may not cover all
            regions.
          </p>
          <p>
            <strong>Polar Day/Night:</strong> In polar regions, the sun may
            not rise or set for extended periods. Expect "No Sunrise/Sunset"
            results during these times.
          </p>
          <p>
            <strong>Date Format Errors:</strong> Ensure the date input is valid
            and in the correct format (YYYY-MM-DD) to avoid calculation errors.
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
      title="Sunrise and Sunset Times"
      description="Professional time calculator: Sunrise and Sunset Times. Precise calculations, time zone handling, and scheduling tools."
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
