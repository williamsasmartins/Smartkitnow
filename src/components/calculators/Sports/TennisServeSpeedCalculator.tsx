import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ FULL ICON IMPORT
import { Activity, Timer, TrendingUp, Dumbbell, Trophy, Medal, Flag, Flame, Zap, Heart, Scale, Calculator, Info, RotateCcw, AlertTriangle, BookOpen, ExternalLink, Waves, Gauge } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function TennisServeSpeedCalculator() {
  const [inputs, setInputs] = useState({
    distance: "", // meters
    time: "", // seconds
  });
  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  /**
   * Tennis serve speed is calculated by dividing the distance the ball travels by the time it takes.
   * Speed (m/s) = Distance (m) / Time (s)
   * To convert to km/h, multiply by 3.6.
   * 
   * Typical tennis serve speeds range from 160 km/h (club level) to 250 km/h+ (professional men’s serve).
   */
  const results = useMemo(() => {
    const distance = parseFloat(inputs.distance);
    const time = parseFloat(inputs.time);

    if (!distance || !time || distance <= 0 || time <= 0) {
      return {
        value: null,
        label: "",
        subtext: null,
        warning: "Please enter valid positive numbers for distance and time.",
        formulaUsed: "Speed = Distance / Time",
      };
    }

    const speedMetersPerSecond = distance / time;
    const speedKmPerHour = speedMetersPerSecond * 3.6;

    let subtext = `Calculated serve speed is approximately ${speedKmPerHour.toFixed(1)} km/h (${speedMetersPerSecond.toFixed(2)} m/s).`;
    let warning = null;

    // Warning if speed is unrealistic
    if (speedKmPerHour < 50) {
      warning = "Warning: This serve speed is unusually slow for competitive tennis.";
    } else if (speedKmPerHour > 250) {
      warning = "Warning: This serve speed exceeds typical professional serve speeds and may be inaccurate.";
    }

    return {
      value: `${speedKmPerHour.toFixed(1)} km/h`,
      label: "Estimated Serve Speed",
      subtext,
      warning,
      formulaUsed: "Speed (m/s) = Distance (m) / Time (s); Speed (km/h) = Speed (m/s) × 3.6",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "How accurate is this tennis serve speed calculator?",
      answer:
        "This calculator estimates serve speed based on the distance the ball travels and the time it takes to reach the opponent’s side. While it provides a good approximation, factors such as ball spin, air resistance, and measurement precision can affect accuracy. For precise measurements, radar guns or high-speed cameras are recommended.",
    },
    {
      question: "What is a typical serve speed for professional tennis players?",
      answer:
        "Professional male tennis players often serve between 190 km/h and 230 km/h, with the fastest recorded serves exceeding 250 km/h. Female professionals typically serve between 160 km/h and 190 km/h. Serve speed depends on technique, strength, and equipment.",
    },
    {
      question: "Can I use this calculator to improve my serve?",
      answer:
        "Yes, by measuring your serve speed regularly, you can track improvements over time. Combining speed data with video analysis and strength training can help optimize your serve mechanics and power.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="distance" className="flex items-center gap-2">
                <Waves className="w-5 h-5 text-blue-600" /> Distance (meters)
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
              <p id="distance-desc" className="text-sm text-slate-500 mt-1">
                Distance ball travels from serve impact to bounce (approx. court length is 18.3m).
              </p>
            </div>
            <div>
              <Label htmlFor="time" className="flex items-center gap-2">
                <Timer className="w-5 h-5 text-blue-600" /> Time (seconds)
              </Label>
              <Input
                id="time"
                type="number"
                min="0"
                step="0.001"
                placeholder="e.g. 0.25"
                value={inputs.time}
                onChange={(e) => handleInputChange("time", e.target.value)}
                aria-describedby="time-desc"
              />
              <p id="time-desc" className="text-sm text-slate-500 mt-1">
                Time taken from ball impact to bounce on opponent’s side.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No special action needed, calculation is reactive
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

      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="mt-2 text-lg text-blue-800 dark:text-blue-300">{results.subtext}</p>
            {results.warning && (
              <p className="mt-3 text-sm text-red-600 dark:text-red-400 font-semibold flex items-center justify-center gap-2">
                <AlertTriangle className="w-4 h-4" /> {results.warning}
              </p>
            )}
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
          The tennis serve speed calculator estimates the velocity of a tennis serve by using the distance the ball travels and the time it takes to reach the opponent’s side of the court. This method is grounded in basic physics principles, where speed equals distance divided by time. By inputting accurate measurements, players and coaches can gain valuable insights into serve performance without needing expensive radar equipment.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Serve speed is a critical metric in tennis as it directly impacts the effectiveness and difficulty of returns for the opponent. High serve speeds often correlate with aggressive playing styles and can be a decisive factor in match outcomes. However, serve speed alone does not guarantee success; factors like placement, spin, and consistency also play vital roles.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This calculator is designed to be accessible for players at all levels, providing a reliable estimate to track progress and tailor training programs accordingly. It also serves as an educational tool to understand the biomechanics and physics behind tennis serves.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use the tennis serve speed calculator effectively, you need two key measurements: the distance the ball travels from the point of serve impact to where it bounces on the opponent’s side, and the time it takes for the ball to cover that distance. Accurate timing can be achieved using high-speed cameras or precise stopwatch methods.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Measure or estimate the distance the ball travels. The standard tennis court baseline-to-baseline distance is 23.77 meters, but the ball often lands closer to the service box, approximately 18.3 meters.
          </li>
          <li>
            <strong>Step 2:</strong> Record the time in seconds from the moment the ball leaves the racket until it bounces on the opponent’s side. Use a stopwatch or video frame analysis for accuracy.
          </li>
          <li>
            <strong>Step 3:</strong> Enter the distance and time values into the calculator inputs and press "Calculate" to obtain the estimated serve speed in kilometers per hour.
          </li>
          <li>
            <strong>Step 4:</strong> Analyze the results and compare them with typical serve speeds to assess performance or track improvements.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips & Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Improving serve speed requires a combination of technical skill, physical conditioning, and biomechanical efficiency. Focus on developing explosive leg drive, core rotation, and shoulder flexibility to maximize racket head speed. Strength training targeting the shoulder girdle, forearm, and wrist can enhance power and control.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Incorporate plyometric exercises and medicine ball throws to improve dynamic power transfer through the kinetic chain. Video analysis can help identify mechanical inefficiencies and optimize serve technique. Remember, consistency and placement are as important as speed for an effective serve.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Regularly measuring serve speed with this calculator can motivate progress and help tailor training programs. Combine speed data with endurance and agility drills to develop a well-rounded game.
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

      {/* REFERENCES SECTION */}
      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References & Additional Resources</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
          For more information on tennis biomechanics, serve speed analysis, and sports science principles, consult the following authoritative sources:
        </p>
        <ul className="space-y-4">
          <li>
            <a
              href="https://www.acsm.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              American College of Sports Medicine <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Global leader in sports medicine and exercise science research, providing evidence-based guidelines for athletic performance.
            </p>
          </li>
          <li>
            <a
              href="https://www.itftennis.com/en/about-us/tennis-tech/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              International Tennis Federation (ITF) Tennis Tech <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Official tennis governing body offering insights into tennis technology, biomechanics, and performance standards.
            </p>
          </li>
          <li>
            <a
              href="https://journals.humankinetics.com/view/journals/ijspp/ijspp-overview.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              International Journal of Sports Physiology and Performance <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Peer-reviewed journal publishing cutting-edge research on sports performance, including tennis biomechanics and serve speed analysis.
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
        formula: "Speed = Distance / Time; Speed (km/h) = Speed (m/s) × 3.6",
        variables: [
          { symbol: "Speed", description: "Serve speed" },
          { symbol: "Distance", description: "Distance ball travels (meters)" },
          { symbol: "Time", description: "Time taken (seconds)" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "A player serves the ball, and it travels approximately 18.3 meters to the opponent’s service box in 0.25 seconds. What is the estimated serve speed?",
        steps: [
          {
            label: "Step 1",
            explanation: "Input the distance as 18.3 meters and the time as 0.25 seconds into the calculator.",
          },
          {
            label: "Step 2",
            explanation: "Calculate speed in meters per second: 18.3 / 0.25 = 73.2 m/s.",
          },
          {
            label: "Step 3",
            explanation: "Convert speed to km/h: 73.2 × 3.6 = 263.5 km/h (which is unusually high and likely due to measurement error).",
          },
          {
            label: "Step 4",
            explanation:
              "Reassess measurements for accuracy. Typical serve speeds range between 160-230 km/h for professional players.",
          },
        ],
        result: "Estimated serve speed is approximately 263.5 km/h, indicating a need to verify input data for accuracy.",
      }}
      relatedCalculators={[
        { title: "FINA Points Calculator", url: "/sports/fina-points-calculator", icon: "🏊" },
        { title: "Running Pace / Split / Finish Time Calculator", url: "/sports/running-pace-split-finish-time", icon: "🏃" },
        { title: "Body Fat Percentage Calculator (Athletes)", url: "/sports/body-fat-percentage", icon: "🔥" },
        { title: "Race Time Predictor (Riegel Formula)", url: "/sports/race-time-predictor-riegel", icon: "🏆" },
        { title: "Hydration / Sweat Rate Calculator", url: "/sports/hydration-sweat-rate", icon: "🏆" },
        { title: "TDEE Calculator (Sports)", url: "/sports/tdee-calculator", icon: "🔥" },
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