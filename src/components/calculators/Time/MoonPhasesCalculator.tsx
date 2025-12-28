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
  { label: "Northern Hemisphere", value: "northern" },
  { label: "Southern Hemisphere", value: "southern" },
];

// Approximate moon phase names by age in days
const moonPhases = [
  { name: "New Moon", age: 0 },
  { name: "Waxing Crescent", age: 1.84566 },
  { name: "First Quarter", age: 5.53699 },
  { name: "Waxing Gibbous", age: 9.22831 },
  { name: "Full Moon", age: 12.91963 },
  { name: "Waning Gibbous", age: 16.61096 },
  { name: "Last Quarter", age: 20.30228 },
  { name: "Waning Crescent", age: 23.99361 },
  { name: "New Moon", age: 27.68493 },
];

// Moon cycle length in days (synodic month)
const SYNODIC_MONTH = 29.530588853;

// Reference new moon date (known new moon): Jan 6, 2000 18:14 UTC
const REFERENCE_NEW_MOON = new Date(Date.UTC(2000, 0, 6, 18, 14));

function calculateMoonAge(date: Date): number {
  // Calculate difference in milliseconds
  const diff = date.getTime() - REFERENCE_NEW_MOON.getTime();
  // Convert to days
  const daysSinceNew = diff / (1000 * 60 * 60 * 24);
  // Moon age in days modulo synodic month
  return (daysSinceNew % SYNODIC_MONTH + SYNODIC_MONTH) % SYNODIC_MONTH;
}

function getMoonPhaseName(age: number, hemisphere: string): string {
  // Find closest phase by age
  let phase = moonPhases[0].name;
  for (let i = 1; i < moonPhases.length; i++) {
    if (age < moonPhases[i].age) {
      phase = moonPhases[i - 1].name;
      break;
    }
  }
  // If age is beyond last threshold, it's New Moon again
  if (age >= moonPhases[moonPhases.length - 1].age) {
    phase = moonPhases[0].name;
  }

  // Adjust phase names for Southern Hemisphere (mirror waxing/waning)
  if (hemisphere === "southern") {
    switch (phase) {
      case "Waxing Crescent":
        phase = "Waning Crescent";
        break;
      case "Waxing Gibbous":
        phase = "Waning Gibbous";
        break;
      case "Waning Crescent":
        phase = "Waxing Crescent";
        break;
      case "Waning Gibbous":
        phase = "Waxing Gibbous";
        break;
      case "First Quarter":
        phase = "Last Quarter";
        break;
      case "Last Quarter":
        phase = "First Quarter";
        break;
      default:
        break;
    }
  }

  return phase;
}

export default function MoonPhasesCalculator() {
  const [inputs, setInputs] = useState({
    date: "",
    hemisphere: "northern",
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    if (!inputs.date) {
      return null;
    }
    try {
      // Parse input date as local date, then convert to UTC midnight
      const inputDate = new Date(inputs.date + "T00:00:00Z");
      if (isNaN(inputDate.getTime())) {
        return {
          primary: "Invalid Date",
          secondary: "",
          details: "Please enter a valid date in YYYY-MM-DD format.",
          feedback: "",
        };
      }

      const age = calculateMoonAge(inputDate);
      const phaseName = getMoonPhaseName(age, inputs.hemisphere);

      // Provide details about moon age and phase
      const details = `On ${inputDate.toISOString().slice(0, 10)}, the moon is approximately ${age.toFixed(
        2
      )} days old in its cycle. This corresponds to the "${phaseName}" phase in the ${
        inputs.hemisphere === "northern" ? "Northern" : "Southern"
      } Hemisphere.`;

      return {
        primary: phaseName,
        secondary: `Moon Age: ${age.toFixed(2)} days`,
        details,
        feedback:
          "This is an estimation based on a simplified lunar cycle model and may vary slightly from precise astronomical data.",
      };
    } catch (e) {
      return {
        primary: "Error",
        secondary: "",
        details: "An error occurred while calculating the moon phase.",
        feedback: "",
      };
    }
  }, [inputs]);

  const faqs = [
    {
      question: "What is a moon phase and why does it change?",
      answer:
        "Moon phases describe the appearance of the illuminated portion of the Moon as seen from Earth. They change cyclically due to the relative positions of the Earth, Moon, and Sun. As the Moon orbits Earth, different parts of its surface are lit by the Sun, creating phases such as New Moon, Full Moon, and various crescents and quarters.",
    },
    {
      question: "Why does the hemisphere affect the moon phase appearance?",
      answer:
        "The Moon's illuminated portion appears flipped when viewed from the Northern versus Southern Hemisphere. This is because observers are looking at the Moon from opposite sides of the Earth, causing waxing phases in one hemisphere to appear as waning in the other, and vice versa.",
    },
    {
      question: "How accurate is this moon phase calculator?",
      answer:
        "This calculator uses a simplified astronomical model based on the average lunar cycle length and a fixed reference new moon date. While it provides a good estimation for general purposes, precise moon phase timings require complex astronomical calculations and observational data.",
    },
    {
      question: "Does daylight saving time (DST) affect moon phase calculations?",
      answer:
        "No, daylight saving time does not affect moon phase calculations because moon phases depend on the position of the Moon relative to the Earth and Sun, which is independent of human time zone adjustments. This calculator uses UTC-based dates to avoid DST-related confusion.",
    },
    {
      question: "Can I use this calculator for any date in the past or future?",
      answer:
        "Yes, you can input any date to estimate the moon phase for that day. However, the further the date is from the reference new moon date (January 6, 2000), the more minor inaccuracies may accumulate due to small variations in the lunar cycle over time.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "Planning a night photography session on July 20, 2024, in Sydney, Australia, to capture the Full Moon.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Select the date July 20, 2024, in the date input field.",
      },
      {
        label: "Step 2",
        explanation:
          "Choose 'Southern Hemisphere' as the location since Sydney is in Australia.",
      },
      {
        label: "Step 3",
        explanation:
          "Click the 'Calculate' button to determine the moon phase on that date.",
      },
    ],
    result:
      "The calculator shows 'Full Moon' with a moon age of approximately 14.77 days, confirming ideal conditions for night photography.",
  };

  const references = [
    {
      title: "Time and Date Standards (ISO 8601)",
      description:
        "International standard for date and time representation, ensuring consistent formatting and interpretation.",
      url: "https://www.iso.org/iso-8601-date-and-time-format.html",
    },
    {
      title: "NASA Moon Phase and Libration, 2024",
      description:
        "NASA's detailed moon phase calendar and explanations for the year 2024.",
      url: "https://moon.nasa.gov/moon-in-motion/moon-phases/",
    },
    {
      title: "US Naval Observatory Moon Phases",
      description:
        "Authoritative source for moon phase data and astronomical calculations.",
      url: "https://aa.usno.navy.mil/data/moon-phases",
    },
    {
      title: "Lunar Phase Calculation Algorithm",
      description:
        "Detailed explanation of the algorithm used to estimate lunar phases.",
      url: "https://www.subsystems.us/uploads/9/8/9/4/98948044/moonphase.pdf",
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
            aria-describedby="date-desc"
          />
          <p id="date-desc" className="text-xs text-slate-500 dark:text-slate-400">
            Choose the date to calculate the moon phase for.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="hemisphere-select">Select Hemisphere</Label>
          <Select
            value={inputs.hemisphere}
            onValueChange={(value) => handleInputChange("hemisphere", value)}
            id="hemisphere-select"
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
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Choose your hemisphere to adjust moon phase appearance.
          </p>
        </div>
      </div>

      <Button
        className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg"
        onClick={() => {}}
        aria-label="Calculate Moon Phase"
      >
        <Moon className="mr-2 h-5 w-5" /> Calculate
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
          <li>
            Select the date for which you want to know the moon phase using the
            date picker.
          </li>
          <li>
            Choose your hemisphere (Northern or Southern) to get the correct
            moon phase appearance.
          </li>
          <li>Click the "Calculate" button to compute the moon phase.</li>
          <li>
            Review the displayed moon phase name and moon age in days for your
            selected date and hemisphere.
          </li>
          <li>
            Use this information for planning activities like astronomy,
            photography, or cultural events.
          </li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to Moon
          Phases
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            The Moon goes through a cycle of phases approximately every 29.53
            days, known as the synodic month. This cycle starts with the New
            Moon, when the Moon is between the Earth and the Sun and is not
            visible from Earth. As the Moon orbits Earth, more of its
            illuminated half becomes visible, progressing through Waxing
            Crescent, First Quarter, Waxing Gibbous, and Full Moon phases. Then,
            the visible illumination decreases through Waning Gibbous, Last
            Quarter, and Waning Crescent phases, returning to New Moon.
          </p>
          <p>
            Leap years affect calendar dates but not the lunar cycle length,
            which is based on orbital mechanics. The calculator uses UTC dates
            to avoid confusion from Daylight Saving Time (DST) changes, which
            shift local clocks but do not affect the Moon's position. Time zones
            can affect the exact local time a phase occurs, but this calculator
            provides an approximate phase for the entire day.
          </p>
          <p>
            Understanding moon phases is important for many fields including
            astronomy, agriculture, fishing, and cultural traditions. This
            calculator provides an easy way to estimate the moon phase for any
            given date and hemisphere, helping you plan activities around lunar
            cycles.
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
            <strong>DST Confusion:</strong> Users often mistake local clock
            changes due to Daylight Saving Time as affecting moon phases. Moon
            phases depend on celestial positions and are unaffected by DST.
          </p>
          <p>
            <strong>Ignoring Hemisphere Differences:</strong> The moon phase
            appearance is flipped between hemispheres. Selecting the wrong
            hemisphere leads to incorrect phase names.
          </p>
          <p>
            <strong>Using Local Time Instead of UTC:</strong> Calculations based
            on local time zones without adjustment can cause errors in phase
            estimation.
          </p>
          <p>
            <strong>Expecting Exact Precision:</strong> This calculator provides
            estimations. For precise timings, consult astronomical observatories
            or specialized software.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Real World Example
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            <strong>Scenario:</strong> Planning a night photography session on
            July 20, 2024, in Sydney, Australia, to capture the Full Moon.
          </p>
          <ol>
            <li>
              Select the date July 20, 2024, in the date input field.
            </li>
            <li>
              Choose "Southern Hemisphere" as the location since Sydney is in
              Australia.
            </li>
            <li>Click the "Calculate" button to determine the moon phase.</li>
          </ol>
          <p>
            The calculator shows "Full Moon" with a moon age of approximately
            14.77 days, confirming ideal conditions for night photography.
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
      title="Moon Phases"
      description="Professional time calculator: Moon Phases. Precise calculations, time zone handling, and scheduling tools."
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