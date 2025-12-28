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

const hemisphereOptions = [
  { value: "northern", label: "Northern Hemisphere" },
  { value: "southern", label: "Southern Hemisphere" },
];

const seasonDatesNorthern = {
  spring: { month: 3, day: 20 }, // March 20 - Spring Equinox
  summer: { month: 6, day: 21 }, // June 21 - Summer Solstice
  autumn: { month: 9, day: 22 }, // Sept 22 - Autumn Equinox
  winter: { month: 12, day: 21 }, // Dec 21 - Winter Solstice
};

const seasonDatesSouthern = {
  spring: { month: 9, day: 22 }, // Sept 22 - Spring Equinox (Southern)
  summer: { month: 12, day: 21 }, // Dec 21 - Summer Solstice (Southern)
  autumn: { month: 3, day: 20 }, // March 20 - Autumn Equinox (Southern)
  winter: { month: 6, day: 21 }, // June 21 - Winter Solstice (Southern)
};

function getSeason(date: Date, hemisphere: "northern" | "southern") {
  // Determine season based on date and hemisphere using approximate astronomical dates
  // Dates are approximate and do not account for leap seconds or exact times.

  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1; // JS months 0-11
  const day = date.getUTCDate();

  // Helper to create UTC date for comparison
  function utcDate(m: number, d: number) {
    return Date.UTC(year, m - 1, d);
  }

  const seasons =
    hemisphere === "northern" ? seasonDatesNorthern : seasonDatesSouthern;

  const springStart = utcDate(seasons.spring.month, seasons.spring.day);
  const summerStart = utcDate(seasons.summer.month, seasons.summer.day);
  const autumnStart = utcDate(seasons.autumn.month, seasons.autumn.day);
  const winterStart = utcDate(seasons.winter.month, seasons.winter.day);

  const current = Date.UTC(year, month - 1, day);

  // Seasons run from equinox/solstice to next equinox/solstice
  // Northern Hemisphere example:
  // Winter: Dec 21 - Mar 19
  // Spring: Mar 20 - Jun 20
  // Summer: Jun 21 - Sep 21
  // Autumn: Sep 22 - Dec 20

  // We will check ranges accordingly:
  if (
    (current >= winterStart && current < springStart) ||
    (current < springStart && current >= winterStart)
  ) {
    // Winter spans end of year to next year start
    // Handle year wrap
    if (current >= winterStart) return "Winter";
    else return "Winter";
  }
  if (current >= springStart && current < summerStart) return "Spring";
  if (current >= summerStart && current < autumnStart) return "Summer";
  if (current >= autumnStart && current < winterStart) return "Autumn";

  // If none matched, fallback (should not happen)
  return "Unknown";
}

const example = {
  title: "Real World Example",
  scenario:
    "Planning a gardening project in Sydney, Australia, starting on September 15th, 2024, and wanting to know the current season and upcoming season changes.",
  steps: [
    {
      label: "Step 1",
      explanation:
        "Select the start date as September 15th, 2024, and choose 'Southern Hemisphere' since Sydney is in Australia.",
    },
    {
      label: "Step 2",
      explanation:
        "Click 'Calculate' to determine the current astronomical season based on the date and hemisphere.",
    },
    {
      label: "Step 3",
      explanation:
        "Review the result showing the current season and the next upcoming season with approximate start dates.",
    },
  ],
  result:
    "The calculator shows that September 15th, 2024, in the Southern Hemisphere is late Winter, approaching Spring starting on September 22nd, 2024.",
};

export default function AstronomicalSeasonsCalculator() {
  // Inputs: Date, Hemisphere
  const [inputs, setInputs] = useState({
    date: "",
    hemisphere: "northern",
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    if (!inputs.date || !inputs.hemisphere) {
      return null;
    }
    try {
      // Parse date as UTC to avoid local timezone confusion
      const dateParts = inputs.date.split("-");
      if (dateParts.length !== 3) throw new Error("Invalid date format");
      const year = parseInt(dateParts[0], 10);
      const month = parseInt(dateParts[1], 10);
      const day = parseInt(dateParts[2], 10);
      const date = new Date(Date.UTC(year, month - 1, day));

      if (isNaN(date.getTime())) throw new Error("Invalid date");

      const hemisphere = inputs.hemisphere as "northern" | "southern";

      const currentSeason = getSeason(date, hemisphere);

      // Determine next season and its start date
      const seasons =
        hemisphere === "northern" ? seasonDatesNorthern : seasonDatesSouthern;

      // Order of seasons for Northern Hemisphere
      const seasonOrder = ["Winter", "Spring", "Summer", "Autumn"];
      // For Southern Hemisphere, seasons are shifted accordingly
      // But we keep order same and map names accordingly

      // Map season names to dates for current year
      const seasonStartDates = {
        Winter: new Date(Date.UTC(year, seasons.winter.month - 1, seasons.winter.day)),
        Spring: new Date(Date.UTC(year, seasons.spring.month - 1, seasons.spring.day)),
        Summer: new Date(Date.UTC(year, seasons.summer.month - 1, seasons.summer.day)),
        Autumn: new Date(Date.UTC(year, seasons.autumn.month - 1, seasons.autumn.day)),
      };

      // Find next season start date after current date
      let nextSeason = "";
      let nextSeasonDate: Date | null = null;

      // Sort seasons by date ascending, considering year wrap for Winter
      const sortedSeasons = seasonOrder
        .map((s) => ({
          name: s,
          date: seasonStartDates[s],
        }))
        .sort((a, b) => a.date.getTime() - b.date.getTime());

      // Find next season start date after current date
      for (let i = 0; i < sortedSeasons.length; i++) {
        if (date.getTime() < sortedSeasons[i].date.getTime()) {
          nextSeason = sortedSeasons[i].name;
          nextSeasonDate = sortedSeasons[i].date;
          break;
        }
      }
      // If none found, next season is first season next year
      if (!nextSeasonDate) {
        nextSeason = sortedSeasons[0].name;
        nextSeasonDate = new Date(
          Date.UTC(year + 1, seasons[nextSeason.toLowerCase() as keyof typeof seasons].month - 1,
            seasons[nextSeason.toLowerCase() as keyof typeof seasons].day)
        );
      }

      // Format next season date as YYYY-MM-DD
      const nextSeasonDateStr = nextSeasonDate.toISOString().slice(0, 10);

      return {
        primary: currentSeason,
        secondary: `Current season on ${inputs.date}`,
        details: `Next season: ${nextSeason} starting approximately on ${nextSeasonDateStr} (UTC)`,
        feedback:
          "Note: Dates are approximate astronomical season start dates and may vary by a day depending on year and location.",
      };
    } catch (error) {
      return {
        primary: "Invalid input",
        secondary: "Please enter a valid date and select a hemisphere.",
        details: "",
        feedback: "",
      };
    }
  }, [inputs]);

  const faqs = [
    {
      question: "What are astronomical seasons?",
      answer:
        "Astronomical seasons are defined by Earth's position relative to the Sun, marked by equinoxes and solstices. These dates approximate when the Sun crosses the celestial equator or reaches its highest or lowest point in the sky, signaling the start of spring, summer, autumn, or winter. Unlike meteorological seasons, astronomical seasons vary slightly each year.",
    },
    {
      question: "Why do seasons differ between hemispheres?",
      answer:
        "Seasons differ between the Northern and Southern Hemispheres because Earth is tilted on its axis by about 23.5 degrees. When one hemisphere is tilted toward the Sun, it experiences summer, while the opposite hemisphere, tilted away, experiences winter. This tilt causes opposite seasons in each hemisphere at the same time.",
    },
    {
      question: "How accurate are the season start dates in this calculator?",
      answer:
        "The calculator uses approximate fixed dates for equinoxes and solstices based on average astronomical data. Actual dates can vary by a day or so each year due to Earth's elliptical orbit and leap years. For precise times, astronomical almanacs or observatories should be consulted.",
    },
    {
      question: "Does this calculator consider Daylight Saving Time (DST)?",
      answer:
        "No, this calculator uses UTC dates to avoid confusion caused by local time changes like Daylight Saving Time. Since astronomical seasons are based on Earth's position relative to the Sun, they are independent of local clock changes.",
    },
    {
      question: "Can I use this calculator for locations near the equator?",
      answer:
        "Yes, but near the equator, seasonal changes are less pronounced and may not follow the typical four-season pattern. This calculator still provides astronomical season estimates based on hemisphere, but local climate and weather patterns might differ significantly.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const references = [
    {
      title: "Time and Date Standards (ISO 8601)",
      description: "International standard for date and time representation.",
      url: "https://www.iso.org/iso-8601-date-and-time-format.html",
    },
    {
      title: "NASA: Seasons and Equinoxes",
      description:
        "Detailed explanation of Earth's seasons, equinoxes, and solstices by NASA.",
      url: "https://solarsystem.nasa.gov/news/1212/what-are-the-seasons/",
    },
    {
      title: "US Naval Observatory: Astronomical Applications",
      description:
        "Official data and explanations about astronomical phenomena including equinoxes and solstices.",
      url: "https://aa.usno.navy.mil/data/docs/EarthSeasons.php",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date-input">Select Date</Label>
          <Input
            id="date-input"
            type="date"
            value={inputs.date}
            onChange={(e) => handleInputChange("date", e.target.value)}
            max="2100-12-31"
            min="1900-01-01"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hemisphere-select">Select Hemisphere</Label>
          <Select
            value={inputs.hemisphere}
            onValueChange={(value) => handleInputChange("hemisphere", value)}
          >
            <SelectTrigger id="hemisphere-select" className="w-full">
              <SelectValue placeholder="Select hemisphere" />
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
      </div>

      <Button
        className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg"
        onClick={() => {
          // Just trigger re-render by updating state (already handled by inputs)
        }}
        disabled={!inputs.date || !inputs.hemisphere}
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
            Select the date for which you want to determine the astronomical
            season. Use the date picker to choose the year, month, and day.
          </li>
          <li>
            Choose the hemisphere where your location is situated: Northern or
            Southern Hemisphere. This affects the season calculation since
            seasons are opposite in each hemisphere.
          </li>
          <li>
            Click the "Calculate" button to process the inputs and determine
            the current astronomical season for the selected date and
            hemisphere.
          </li>
          <li>
            Review the result displayed below, which shows the current season,
            the date, and the next upcoming season with its approximate start
            date.
          </li>
          <li>
            Use this information for planning activities, understanding climate
            patterns, or educational purposes related to Earth's seasons.
          </li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Seasons Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            The Seasons Calculator estimates the current astronomical season
            based on the date and hemisphere you provide. Astronomical seasons
            are defined by Earth's orbit around the Sun and marked by
            equinoxes and solstices. The four key dates are the Spring
            Equinox, Summer Solstice, Autumn Equinox, and Winter Solstice.
          </p>
          <p>
            These dates are not fixed to the calendar but generally fall around
            March 20, June 21, September 22, and December 21 each year. Because
            Earth's orbit is elliptical and affected by leap years, the exact
            time of these events can shift slightly annually.
          </p>
          <p>
            This calculator uses UTC (Coordinated Universal Time) to avoid
            confusion caused by local time zones and Daylight Saving Time
            (DST). DST can shift local clocks forward or backward by one hour,
            but astronomical events are based on Earth's position relative to
            the Sun, independent of local time changes.
          </p>
          <p>
            Leap years, which add an extra day (February 29) every four years,
            help keep our calendar aligned with Earth's orbit. This is why
            season start dates can vary slightly year to year.
          </p>
          <p>
            By selecting your hemisphere, the calculator adjusts for the fact
            that seasons are opposite in the Northern and Southern
            Hemispheres. For example, when it is summer in the Northern
            Hemisphere, it is winter in the Southern Hemisphere.
          </p>
          <p>
            This tool is useful for educational purposes, planning seasonal
            activities, gardening, or understanding climate patterns based on
            astronomical seasons.
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
            <strong>DST Confusion:</strong> Many users mistakenly assume local
            Daylight Saving Time affects the start of seasons. This calculator
            uses UTC to avoid such errors, as astronomical seasons are based on
            Earth's position, not local clock changes.
          </p>
          <p>
            <strong>Equinox/Solstice Date Variability:</strong> The exact date
            and time of equinoxes and solstices can vary by a day or so each
            year. This calculator uses approximate fixed dates for simplicity,
            so minor discrepancies are normal.
          </p>
          <p>
            <strong>Ignoring Hemisphere Selection:</strong> Selecting the wrong
            hemisphere will yield incorrect season results since seasons are
            opposite between hemispheres.
          </p>
          <p>
            <strong>Using Local Time Instead of UTC:</strong> Inputting dates
            without considering time zones can cause confusion. This tool
            treats dates as UTC to maintain consistency.
          </p>
          <p>
            <strong>Assuming Meteorological Seasons:</strong> Meteorological
            seasons are based on calendar months and differ from astronomical
            seasons. This calculator focuses on astronomical definitions.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Real World Example
        </h2>
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
          <BookOpen className="w-5 h-5 text-blue-500" /> References &amp;
          additional resources
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
      title="Seasons Calculator"
      description="Professional time calculator: Seasons Calculator. Precise calculations, time zone handling, and scheduling tools."
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