import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ FULL ICON IMPORT
import {
  Activity,
  Timer,
  TrendingUp,
  Dumbbell,
  Trophy,
  Medal,
  Flag,
  Flame,
  Zap,
  Heart,
  Scale,
  Calculator,
  Info,
  RotateCcw,
  AlertTriangle,
  BookOpen,
  ExternalLink,
  Waves,
  Gauge,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function TennisServeSpeedCalculator() {
  // Inputs: distance (m), time (s)
  const [inputs, setInputs] = useState({ distance: "", time: "" });
  const handleInputChange = useCallback((n, v) => setInputs((p) => ({ ...p, [n]: v })), []);

  // Calculation logic:
  // Speed (m/s) = distance / time
  // Convert m/s to km/h: multiply by 3.6
  // Validate inputs: distance > 0, time > 0
  const results = useMemo(() => {
    const distance = parseFloat(inputs.distance);
    const time = parseFloat(inputs.time);

    if (isNaN(distance) || isNaN(time) || distance <= 0 || time <= 0) {
      return {
        value: null,
        label: "",
        subtext: null,
        warning: "Please enter valid positive numbers for distance and time.",
        formulaUsed: "Speed = Distance &divide; Time",
      };
    }

    const speedMetersPerSecond = distance / time;
    const speedKmPerHour = speedMetersPerSecond * 3.6;

    return {
      value: speedKmPerHour.toFixed(2) + " km/h",
      label: "Estimated Serve Speed",
      subtext:
        "Calculated by dividing the distance the ball traveled by the time it took to travel that distance, then converting to km/h.",
      warning: null,
      formulaUsed: "Speed (km/h) = (Distance (m) &divide; Time (s)) &times; 3.6",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "How accurate is the Tennis Serve Speed Calculator?",
      answer:
        "The calculator provides an estimate based on the distance the ball travels and the time it takes to cover that distance. While it gives a good approximation of serve speed, factors like ball spin, air resistance, and measurement precision can affect accuracy. For professional-level precision, radar guns or high-speed cameras are recommended.",
    },
    {
      question: "Can I use this calculator for other tennis shots besides serves?",
      answer:
        "Yes, you can use this calculator to estimate the speed of any tennis shot as long as you know the distance the ball traveled and the time it took. However, serves typically have the highest speeds and more consistent trajectories, so results for other shots may vary more due to spin and ball bounce effects.",
    },
    {
      question: "What units should I use for distance and time inputs?",
      answer:
        "Distance should be entered in meters (m), representing the straight-line distance from the point of serve impact to where the ball first bounces. Time should be entered in seconds (s), representing the duration from ball impact to bounce. Using consistent units ensures accurate speed calculations.",
    },
    {
      question: "Why does the calculator convert speed to km/h?",
      answer:
        "Kilometers per hour (km/h) is the standard unit used in tennis and many sports to express ball speed. It is more intuitive for players and coaches to understand serve velocities in km/h rather than meters per second, which is why the calculator converts the raw speed to km/h.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="distance" className="flex items-center gap-1 mb-1 font-semibold text-slate-700 dark:text-slate-300">
            <Flag className="w-4 h-4" /> Distance (meters)
          </Label>
          <Input
            id="distance"
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g. 18.3"
            value={inputs.distance}
            onChange={(e) => handleInputChange("distance", e.target.value)}
            aria-describedby="distance-desc"
          />
          <p id="distance-desc" className="text-xs text-slate-500 mt-1">
            Enter the straight-line distance from serve impact to ball bounce.
          </p>
        </div>
        <div>
          <Label htmlFor="time" className="flex items-center gap-1 mb-1 font-semibold text-slate-700 dark:text-slate-300">
            <Timer className="w-4 h-4" /> Time (seconds)
          </Label>
          <Input
            id="time"
            type="number"
            min="0"
            step="0.001"
            placeholder="e.g. 0.35"
            value={inputs.time}
            onChange={(e) => handleInputChange("time", e.target.value)}
            aria-describedby="time-desc"
          />
          <p id="time-desc" className="text-xs text-slate-500 mt-1">
            Enter the time elapsed from serve impact to ball bounce.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // Just triggers recalculation by updating state with current inputs
            setInputs((p) => ({ ...p }));
          }}
          aria-label="Calculate serve speed"
        >
          <Trophy className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ distance: "", time: "" })}
          className="flex-1 h-11"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.warning && (
        <p className="text-red-600 dark:text-red-400 font-semibold mt-2 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" /> {results.warning}
        </p>
      )}

      {results.value && !results.warning && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="mt-2 text-lg font-medium text-blue-800 dark:text-blue-400">{results.label}</p>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">{results.subtext}</p>
            <p className="mt-4 text-xs italic text-slate-600 dark:text-slate-400">Formula used: {results.formulaUsed}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Tennis Serve Speed Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Tennis Serve Speed Calculator is a specialized tool designed to estimate the velocity of a tennis serve by using two fundamental measurements: the distance the ball travels from the point of impact to the first bounce, and the time taken to cover that distance. Serve speed is a critical metric in tennis, influencing the effectiveness of the serve and the player&apos;s ability to dominate points.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          By inputting the distance in meters and the time in seconds, the calculator applies basic physics principles to compute the average speed of the serve. This speed is then converted into kilometers per hour (km/h), the standard unit used in tennis to express ball velocity. Understanding serve speed helps players and coaches analyze performance, develop training strategies, and compare serve effectiveness across different matches or players.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          It is important to note that this calculator provides an estimate of average speed between impact and bounce. It does not account for factors such as ball spin, air resistance, or changes in velocity during flight. Nevertheless, it remains a valuable and accessible tool for players at all levels to gain insights into their serving performance without the need for expensive equipment.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The simplicity and scientific basis of this calculator make it an authoritative resource for tennis enthusiasts, coaches, and sports scientists seeking to quantify serve speed quickly and accurately using minimal data.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using the Tennis Serve Speed Calculator is straightforward and requires only two inputs: the distance the ball traveled and the time it took to travel that distance. These measurements can be obtained using video analysis, stopwatch timing, or radar equipment. Accurate measurement is key to obtaining reliable results.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          First, measure the straight-line distance in meters from the point where the ball was struck to where it first bounced on the court. This distance should be as precise as possible, ideally measured on the court or using video frame analysis tools. Next, measure the time in seconds from the moment the ball leaves the racket until it hits the ground.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Once you have these values, enter them into the respective fields in the calculator. Press the &quot;Calculate&quot; button to compute the estimated serve speed. The result will be displayed in kilometers per hour (km/h), along with the formula used for transparency. If invalid inputs are detected, the calculator will prompt you to correct them.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Measure the distance (in meters) from serve impact to ball bounce.
          </li>
          <li>
            <strong>Step 2:</strong> Measure the time (in seconds) from serve impact to ball bounce.
          </li>
          <li>
            <strong>Step 3:</strong> Enter the distance and time values into the calculator inputs.
          </li>
          <li>
            <strong>Step 4:</strong> Click &quot;Calculate&quot; to see the estimated serve speed in km/h.
          </li>
          <li>
            <strong>Step 5:</strong> Use the &quot;Reset&quot; button to clear inputs and perform new calculations.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips &amp; Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Improving serve speed requires a combination of technical skill, physical conditioning, and strategic practice. One of the most effective ways to increase serve velocity is to focus on proper biomechanics, including a fluid toss, optimal racket acceleration, and efficient weight transfer from the legs through the torso to the arm.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Strength training, particularly targeting the core, shoulders, and legs, can significantly enhance power generation during the serve. Exercises such as medicine ball throws, plyometrics, and rotational strength drills help develop explosive movements essential for fast serves. Flexibility and mobility work also reduce injury risk and improve range of motion.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Regularly using the Tennis Serve Speed Calculator during practice sessions allows players to track progress objectively and adjust training intensity accordingly. Combining speed training with accuracy drills ensures that increased velocity does not come at the expense of serve placement and consistency.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Finally, mental focus and routine play a crucial role in serve performance. Visualization, breathing techniques, and consistent pre-serve rituals can help players maintain confidence and deliver powerful serves under pressure.
        </p>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <ul className="space-y-6">
          {faqs.map((item, i) => (
            <li key={i} className="border-b border-slate-200 dark:border-slate-800 pb-4 last:border-0">
              <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-2">{item.question}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.answer}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Additional Resources</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
          For more information, consult these sources:
        </p>
        <ul className="space-y-4">
          <li>
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3761736/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Biomechanics of the Tennis Serve <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              A comprehensive study published by the National Institutes of Health detailing the biomechanics involved in tennis serves and factors affecting serve speed.
            </p>
          </li>
          <li>
            <a
              href="https://www.itftennis.com/en/news-and-media/articles/tennis-serve-speed-how-to-improve-your-serve/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              ITF Tennis: How to Improve Your Serve Speed <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              The International Tennis Federation provides expert advice and training tips for increasing serve speed effectively and safely.
            </p>
          </li>
          <li>
            <a
              href="https://www.sportsci.org/jour/9804/wilson.html"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Physics of Tennis Ball Speed <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              An article exploring the physics principles behind tennis ball speed, including factors influencing velocity and measurement techniques.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Tennis Serve Speed Calculator"
      description="Calculate tennis serve speed. Estimate velocity based on the distance and time between impact and bounce."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Formula",
        formula: "Speed (km/h) = (Distance (m) ÷ Time (s)) × 3.6",
        variables: [
          { symbol: "Distance (m)", description: "Straight-line distance from serve impact to ball bounce in meters" },
          { symbol: "Time (s)", description: "Time elapsed from serve impact to ball bounce in seconds" },
          { symbol: "Speed (km/h)", description: "Estimated average serve speed in kilometers per hour" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "A player serves the ball, and the ball travels 18.3 meters before bouncing. The time from impact to bounce is measured as 0.35 seconds. Calculate the serve speed.",
        steps: [
          { label: "Step 1", explanation: "Measure the distance: 18.3 meters." },
          { label: "Step 2", explanation: "Measure the time: 0.35 seconds." },
          { label: "Step 3", explanation: "Apply the formula: Speed = (18.3 ÷ 0.35) × 3.6." },
          { label: "Step 4", explanation: "Calculate: 52.29 × 3.6 = 188.24 km/h." },
        ],
        result: "The estimated serve speed is approximately 188.24 km/h.",
      }}
      relatedCalculators={[
        { title: "Race Time Predictor (Riegel Formula)", url: "/sports/race-time-predictor-riegel", icon: "🏆" },
        { title: "Tennis ELO / Rating Progress", url: "/sports/tennis-elo-rating-progress", icon: "🏆" },
        { title: "Fantasy Team Points Projections Calculator", url: "/sports/fantasy-team-points-projections", icon: "🏆" },
        { title: "Wilks Coefficient Calculator", url: "/sports/wilks-coefficient", icon: "🏆" },
        { title: "Basketball Pace & ORtg/DRtg", url: "/sports/basketball-pace-ortg-drtg", icon: "🏃" },
        { title: "BABIP Calculator", url: "/sports/babip-calculator", icon: "🏆" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding" },
        { id: "how-to", label: "How to Use" },
        { id: "tips", label: "Training Tips" },
        { id: "faq", label: "FAQ" },
        { id: "references", label: "References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}