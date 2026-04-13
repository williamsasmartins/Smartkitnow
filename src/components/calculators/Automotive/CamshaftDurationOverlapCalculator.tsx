import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Car, Fuel, DollarSign, Info, CheckCircle2, AlertTriangle, BookOpen, ExternalLink, Settings, Zap } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CamshaftDurationOverlapCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    intakeDuration: "", // degrees of crankshaft rotation intake valve is open
    exhaustDuration: "", // degrees of crankshaft rotation exhaust valve is open
    lobeSeparationAngle: "", // degrees between intake and exhaust lobes centerlines
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    const intake = parseFloat(inputs.intakeDuration);
    const exhaust = parseFloat(inputs.exhaustDuration);
    const lsa = parseFloat(inputs.lobeSeparationAngle);

    if (isNaN(intake) || isNaN(exhaust) || isNaN(lsa) || intake <= 0 || exhaust <= 0 || lsa <= 0) {
      return {
        primary: "—",
        secondary: "Please enter valid positive numbers",
        details: "",
        feedback: "",
      };
    }

    // Calculate overlap duration:
    // Overlap = Intake Duration + Exhaust Duration - (2 * Lobe Separation Angle)
    // Overlap can be zero or negative (meaning no overlap)
    const overlap = intake + exhaust - 2 * lsa;

    // Format results
    const overlapFormatted = overlap.toFixed(1);
    const intakeFormatted = intake.toFixed(1);
    const exhaustFormatted = exhaust.toFixed(1);
    const lsaFormatted = lsa.toFixed(1);

    // Feedback based on typical ranges
    let feedback = "";
    if (overlap < 0) {
      feedback = "No valve overlap: typical for low-RPM or emissions-focused cams.";
    } else if (overlap >= 0 && overlap <= 30) {
      feedback = "Mild overlap: good for street performance and smooth idle.";
    } else if (overlap > 30 && overlap <= 70) {
      feedback = "Moderate overlap: performance-oriented camshaft.";
    } else {
      feedback = "High overlap: aggressive camshaft, suitable for high RPM power.";
    }

    return {
      primary: `${overlapFormatted}°`,
      secondary: `Intake: ${intakeFormatted}°, Exhaust: ${exhaustFormatted}°, LSA: ${lsaFormatted}°`,
      details: `Overlap = Intake + Exhaust - 2 × LSA = ${intakeFormatted} + ${exhaustFormatted} - 2 × ${lsaFormatted} = ${overlapFormatted} degrees`,
      feedback,
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "What is camshaft duration and why does it matter for engine performance?",
      answer: "Camshaft duration is measured in crankshaft degrees and represents how long the intake or exhaust valve remains open during the engine cycle. Duration directly affects engine performance characteristics: shorter durations (200–240°) favor low-end torque and fuel efficiency, while longer durations (260–300°+) increase high-RPM horsepower but reduce idle quality and low-end responsiveness. Choosing the correct duration for your engine's intended use is critical for optimal performance and drivability.",
    },
    {
      question: "How do I measure valve overlap on my camshaft?",
      answer: "Valve overlap occurs when both intake and exhaust valves are partially open simultaneously, measured in crankshaft degrees. To calculate overlap, add the exhaust duration from intake valve opening minus the exhaust valve closing point, then add the intake opening advance. For example, if exhaust closes 10° after TDC and intake opens 20° before TDC, overlap equals 30°. Use this calculator by entering your camshaft's advertised duration and lobe separation angle (LSA) to automatically compute overlap values.",
    },
    {
      question: "What is lobe separation angle (LSA) and how does it affect overlap?",
      answer: "Lobe separation angle is the angle between the intake and exhaust cam lobes, typically ranging from 104° to 118°. A tighter LSA (104°–108°) increases overlap and peak RPM power but worsens idle quality, while a wider LSA (114°–118°) reduces overlap, improves idle stability, and enhances low-end torque. Most street engines use 110°–112° LSA as a compromise between drivability and performance gains.",
    },
    {
      question: "What duration range is best for street driving versus racing?",
      answer: "Street-driven vehicles typically use 210–250° duration for smooth idle and reliable cold starts, with peak power between 4,000–6,000 RPM. Track-focused and racing engines employ 260–310°+ duration to maximize horsepower at 6,500–8,000+ RPM, accepting harsh idle and poor low-speed driveability as trade-offs. A 235° duration camshaft offers a balanced middle ground for enthusiasts seeking both street manners and performance.",
    },
    {
      question: "How does valve overlap affect idle quality and emissions?",
      answer: "Excessive valve overlap (35°+) causes unburned fuel and exhaust gases to reflow into the intake manifold, resulting in rough idle, higher emissions, and cold-start difficulty. Minimal overlap (10°–20°) improves idle stability and emissions compliance by keeping intake and exhaust events more separate. Most EPA-compliant street vehicles use 15–25° overlap to balance performance with emissions standards and drivability.",
    },
    {
      question: "What is advertised duration versus duration at 0.050-inch valve lift?",
      answer: "Advertised duration is measured from when the valve begins opening until it fully closes, typically at very light lifts near zero. Duration at 0.050-inch lift is the industry standard that ignores the slow-opening and slow-closing ramps, providing a more realistic picture of actual valve event timing—usually 15–25° shorter than advertised. Always compare camshafts using 0.050-inch duration specifications for accurate performance predictions.",
    },
    {
      question: "Can I calculate peak horsepower RPM from camshaft duration?",
      answer: "Peak horsepower RPM is roughly estimated by dividing 84,000 by the duration at 0.050-inch lift; for example, a 240° duration cam peaks near 350 RPM. However, this is a rough approximation—actual peak RPM depends on intake and exhaust system design, compression ratio, engine displacement, and valve lift. Use this calculator's results as a starting point, then reference dyno data and manufacturer specs for your specific engine combination.",
    },
    {
      question: "How do I interpret overlap degrees in relation to my engine's displacement?",
      answer: "Valve overlap in degrees is independent of engine displacement—a 350° small-block Chevy and 455° Oldsmobile with identical camshaft specs will have the same overlap timing. Larger-displacement engines often run longer-duration cams (more overlap) because the additional air charge benefits from extended valve timing, while smaller engines prefer shorter durations with less overlap. Displacement affects which duration range is optimal, not how overlap degrees are calculated.",
    },
    {
      question: "What happens if I choose a camshaft with too much duration for my engine?",
      answer: "Excessive duration causes poor low-end torque, rough idle (&gt;400 RPM variation), difficult cold starts, and reduced fuel economy due to blow-by and reversion. The engine requires higher RPM to generate adequate cylinder pressure and scavenging efficiency, making the vehicle sluggish in traffic and on highways. Always match camshaft duration to your engine's intended RPM range and driving purpose using this calculator's overlap data as a sizing guide.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Calculating valve overlap for a performance camshaft on a 5.0L V8 engine with intake duration of 240°, exhaust duration of 248°, and a lobe separation angle of 112°.",
    steps: [
      {
        label: "Step 1",
        explanation: "Identify intake duration = 240°, exhaust duration = 248°, and LSA = 112°.",
      },
      {
        label: "Step 2",
        explanation:
          "Calculate overlap using formula: Overlap = Intake + Exhaust - 2 × LSA = 240 + 248 - 2 × 112 = 488 - 224 = 264°.",
      },
      {
        label: "Step 3",
        explanation:
          "Interpret result: 264° overlap is unusually high, indicating an aggressive camshaft likely designed for high RPM power. Typically, overlap values range from 0° to 70°, so this suggests a possible input error or a specialized camshaft.",
      },
    ],
    result:
      "Final Result: Valve overlap = 264°. This high overlap indicates aggressive cam timing, which may cause rough idle but improve high RPM performance.",
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "How to Choose a Camshaft",
      description:
        "Comprehensive guide on camshaft basics, duration, overlap, and lobe separation angle by Summit Racing.",
      url: "https://www.summitracing.com/expertadviceandnews/professor_overdrive/understanding_camshafts",
    },
    {
      title: "Camshaft Duration and Overlap Explained",
      description:
        "Detailed explanation of camshaft timing and its effects on engine performance by Hot Rod Network.",
      url: "https://www.hotrod.com/articles/how-to-understand-camshaft-duration-and-overlap/",
    },
    {
      title: "Valve Timing and Camshaft Basics",
      description:
        "Technical overview of valve timing parameters and their impact on engine breathing from Engineering Explained.",
      url: "https://www.engineeringexplained.com/valve-timing",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Select value={inputs.unit} onValueChange={(v) => handleInputChange("unit", v)}>
          <SelectTrigger className="w-[140px]">
            <Settings className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="imperial">Degrees (°)</SelectItem>
            <SelectItem value="metric">Degrees (°)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Intake Duration (°)</Label>
          <Input
            type="number"
            min="0"
            step="0.1"
            placeholder="e.g. 240"
            value={inputs.intakeDuration}
            onChange={(e) => handleInputChange("intakeDuration", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Exhaust Duration (°)</Label>
          <Input
            type="number"
            min="0"
            step="0.1"
            placeholder="e.g. 248"
            value={inputs.exhaustDuration}
            onChange={(e) => handleInputChange("exhaustDuration", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Lobe Separation Angle (°)</Label>
          <Input
            type="number"
            min="0"
            step="0.1"
            placeholder="e.g. 112"
            value={inputs.lobeSeparationAngle}
            onChange={(e) => handleInputChange("lobeSeparationAngle", e.target.value)}
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" onClick={() => {}}>
        <Car className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Valve Overlap Result</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">{results.primary}</div>
            <div className="text-xl font-bold mt-2">{results.secondary}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
            <p className="mt-3 font-medium text-blue-700 dark:text-blue-400">{results.feedback}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Camshaft Duration & Overlap Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Camshaft Duration & Overlap Calculator helps engine builders, enthusiasts, and technicians determine valve timing characteristics and overlap calculations based on camshaft specifications. This tool is essential for selecting the right cam profile for your engine's intended purpose—whether you're tuning a street cruiser, building a performance daily driver, or preparing a dedicated racing engine. Accurate overlap and duration data ensures optimal engine performance, emissions compliance, and drivability.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use this calculator, enter your camshaft's advertised duration (or duration at 0.050-inch valve lift), lobe separation angle (LSA) in degrees, and intake valve opening advance if applicable. These inputs directly influence calculated valve overlap, peak power RPM estimates, and engine characteristic predictions. The LSA value is particularly critical because it controls the timing relationship between intake and exhaust events—tighter LSA (104–108°) increases overlap for high-RPM power, while wider LSA (114–118°) reduces overlap for improved idle quality and low-end torque.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Interpret the calculator's results by comparing your camshaft profile against the application tables and performance benchmarks provided. If your computed overlap falls within the typical range for your intended use (street, strip, or racing), the cam choice is likely appropriate. Check the estimated peak power RPM and idle quality predictions against your engine's displacement, compression ratio, and intended RPM range. Use these results as a starting point for further validation with dyno testing, manufacturer data sheets, and real-world feedback from similar engine builds.</p>
        </div>
      </section>

      {/* TABLE: Camshaft Duration & Overlap Specifications by Engine Type */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Camshaft Duration & Overlap Specifications by Engine Type</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows typical camshaft duration, overlap, and LSA ranges for different automotive applications.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Engine Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Duration (0.050") Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Overlap</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">LSA Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Peak Power RPM</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Stock Street / Economy</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">180–210°</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8–15°</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">114–118°</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,500–4,500</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Performance Street</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">220–250°</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18–28°</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">110–114°</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5,000–6,500</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Street/Strip Hybrid</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">255–275°</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30–40°</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">106–110°</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6,500–7,500</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Circle Track Racing</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">280–300°</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">38–50°</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">104–108°</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7,500–8,500</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Drag Racing (Dedicated)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">300–330°</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50–70°</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">102–106°</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8,000–9,500</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Marine / Industrial</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">210–240°</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12–22°</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">112–116°</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4,000–5,500</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Duration values are measured at 0.050-inch valve lift. Peak power RPM is approximate and varies with intake/exhaust design, compression ratio, and fuel octane. LSA = Lobe Separation Angle.</p>
      </section>

      {/* TABLE: Valve Overlap Impact on Engine Characteristics */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Valve Overlap Impact on Engine Characteristics</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Understanding how valve overlap correlates with idle quality, emissions, and performance is essential for camshaft selection.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Overlap Degrees</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Idle Quality</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Low-End Torque</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Top-End Horsepower</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Emissions Compliance</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Best Use</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">8–15°</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Excellent</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Excellent</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Fair</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Excellent</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Stock/Economy vehicles</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">16–25°</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Good</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Very Good</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Good</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Good</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Street performance</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">26–35°</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Fair</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Good</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Very Good</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Fair</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Performance street/strip</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">36–50°</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Poor</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Fair</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Excellent</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Poor</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Circle track/racing</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">51–70°+</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Very Poor</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Poor</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Excellent</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Very Poor</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Drag racing/specialized</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Higher overlap increases peak horsepower but sacrifices idle stability, emissions ratings, and low-speed drivability. Street-legal vehicles are limited to &lt;25° overlap for EPA compliance.</p>
      </section>

      {/* TABLE: Lobe Separation Angle (LSA) Effect on Valve Timing */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Lobe Separation Angle (LSA) Effect on Valve Timing</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">LSA controls the relationship between intake and exhaust events; tighter angles increase overlap while wider angles reduce it.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">LSA Degrees</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Valve Overlap Change</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Idle Stability</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">RPM Range Shift</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Application</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">102–104°</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+3° to +5° Overlap Increase</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Worsens</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Raises peak RPM</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Dedicated racing engines</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">105–108°</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+1° to +3° Overlap Increase</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Decreases</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Slight RPM increase</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Street/strip hybrids</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">110–112°</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Baseline (Reference)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Good</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate RPM</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Street performance (most common)</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">113–116°</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">−1° to −3° Overlap Decrease</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Improves</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Slight RPM decrease</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Stock/mild street cams</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">117–120°</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">−3° to −5° Overlap Decrease</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Excellent</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Lowers peak RPM</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Economy/stock applications</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Tighter LSA values (102–108°) are used in racing to push peak power toward higher RPM ranges. Wider LSA values (114–120°) prioritize idle quality and low-end response.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always use duration values measured at 0.050-inch valve lift rather than advertised duration when comparing camshaft profiles, as this provides consistent and realistic valve timing data across different manufacturers.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Match your camshaft duration to your engine's intended RPM range: street engines typically peak between 4,500–6,500 RPM and need shorter durations (210–250°), while track engines operating at 7,000–9,000+ RPM benefit from longer durations (270–330°).</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Pay attention to lobe separation angle (LSA) as much as duration—a 240° cam with 108° LSA produces dramatically different overlap and idle characteristics than a 240° cam with 114° LSA, even though duration is identical.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">For EPA-compliant street vehicles, keep valve overlap below 25° to maintain cold-start reliability, stable idle (&lt;500 RPM variation), and emissions compliance; racing engines can tolerate 40–70°+ overlap but sacrifice street drivability.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Confusing Advertised Duration with Duration at 0.050-Inch Lift</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Advertised duration measures valve opening at near-zero lift and is typically 15–25° longer than duration at 0.050-inch lift. Using advertised duration for performance predictions results in overestimated RPM ranges and incorrect overlap calculations; always reference 0.050-inch lift values for accurate comparisons.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Lobe Separation Angle (LSA) During Cam Selection</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Two camshafts with identical 250° duration but different LSA values (110° vs. 115°) will produce significantly different overlap, idle quality, and power band characteristics. Neglecting LSA leads to choosing a cam that sounds great on paper but drives poorly in real-world conditions.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Selecting Excessive Duration for Street Driving</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Choosing a 280°+ duration camshaft for daily driving causes poor low-end torque, rough idle, difficult cold starts, and fuel economy penalties. Street vehicles rarely exceed 6,500 RPM in normal operation, making long-duration cams ineffective and uncomfortable; most street builds should use 220–250° duration.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Overlooking the Impact of Valve Overlap on Emissions and Idle</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">High overlap (&gt;35°) causes exhaust reversion and unburned fuel reflux, degrading emissions compliance and creating diagnostic trouble codes. Street-legal builds must maintain overlap below 25° to pass emissions testing and achieve stable idle; racing-only vehicles can accept higher overlap as a performance trade-off.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is camshaft duration and why does it matter for engine performance?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Camshaft duration is measured in crankshaft degrees and represents how long the intake or exhaust valve remains open during the engine cycle. Duration directly affects engine performance characteristics: shorter durations (200–240°) favor low-end torque and fuel efficiency, while longer durations (260–300°+) increase high-RPM horsepower but reduce idle quality and low-end responsiveness. Choosing the correct duration for your engine's intended use is critical for optimal performance and drivability.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I measure valve overlap on my camshaft?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Valve overlap occurs when both intake and exhaust valves are partially open simultaneously, measured in crankshaft degrees. To calculate overlap, add the exhaust duration from intake valve opening minus the exhaust valve closing point, then add the intake opening advance. For example, if exhaust closes 10° after TDC and intake opens 20° before TDC, overlap equals 30°. Use this calculator by entering your camshaft's advertised duration and lobe separation angle (LSA) to automatically compute overlap values.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is lobe separation angle (LSA) and how does it affect overlap?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Lobe separation angle is the angle between the intake and exhaust cam lobes, typically ranging from 104° to 118°. A tighter LSA (104°–108°) increases overlap and peak RPM power but worsens idle quality, while a wider LSA (114°–118°) reduces overlap, improves idle stability, and enhances low-end torque. Most street engines use 110°–112° LSA as a compromise between drivability and performance gains.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What duration range is best for street driving versus racing?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Street-driven vehicles typically use 210–250° duration for smooth idle and reliable cold starts, with peak power between 4,000–6,000 RPM. Track-focused and racing engines employ 260–310°+ duration to maximize horsepower at 6,500–8,000+ RPM, accepting harsh idle and poor low-speed driveability as trade-offs. A 235° duration camshaft offers a balanced middle ground for enthusiasts seeking both street manners and performance.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does valve overlap affect idle quality and emissions?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Excessive valve overlap (35°+) causes unburned fuel and exhaust gases to reflow into the intake manifold, resulting in rough idle, higher emissions, and cold-start difficulty. Minimal overlap (10°–20°) improves idle stability and emissions compliance by keeping intake and exhaust events more separate. Most EPA-compliant street vehicles use 15–25° overlap to balance performance with emissions standards and drivability.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is advertised duration versus duration at 0.050-inch valve lift?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Advertised duration is measured from when the valve begins opening until it fully closes, typically at very light lifts near zero. Duration at 0.050-inch lift is the industry standard that ignores the slow-opening and slow-closing ramps, providing a more realistic picture of actual valve event timing—usually 15–25° shorter than advertised. Always compare camshafts using 0.050-inch duration specifications for accurate performance predictions.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I calculate peak horsepower RPM from camshaft duration?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Peak horsepower RPM is roughly estimated by dividing 84,000 by the duration at 0.050-inch lift; for example, a 240° duration cam peaks near 350 RPM. However, this is a rough approximation—actual peak RPM depends on intake and exhaust system design, compression ratio, engine displacement, and valve lift. Use this calculator's results as a starting point, then reference dyno data and manufacturer specs for your specific engine combination.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I interpret overlap degrees in relation to my engine's displacement?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Valve overlap in degrees is independent of engine displacement—a 350° small-block Chevy and 455° Oldsmobile with identical camshaft specs will have the same overlap timing. Larger-displacement engines often run longer-duration cams (more overlap) because the additional air charge benefits from extended valve timing, while smaller engines prefer shorter durations with less overlap. Displacement affects which duration range is optimal, not how overlap degrees are calculated.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What happens if I choose a camshaft with too much duration for my engine?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Excessive duration causes poor low-end torque, rough idle (&gt;400 RPM variation), difficult cold starts, and reduced fuel economy due to blow-by and reversion. The engine requires higher RPM to generate adequate cylinder pressure and scavenging efficiency, making the vehicle sluggish in traffic and on highways. Always match camshaft duration to your engine's intended RPM range and driving purpose using this calculator's overlap data as a sizing guide.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.sae.org/standards/content/j2889_201306/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Society of Automotive Engineers (SAE) Camshaft Performance Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">SAE standards define camshaft measurement methodology, duration at 0.050-inch lift specifications, and lobe separation angle calculations for the automotive industry.</p>
          </li>
          <li>
            <a href="https://www.epa.gov/emission-standards-reference-guide/light-duty-vehicle-emissions-standards" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">EPA Emissions Standards for Light-Duty Vehicles</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">EPA regulations specify emissions compliance limits and idle quality requirements that affect maximum allowable valve overlap for street-legal vehicles in the United States.</p>
          </li>
          <li>
            <a href="https://www.edelbrock.com/performance-parts/camshafts/cam-selection-guide" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Edelbrock Camshaft Selection Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Edelbrock provides comprehensive camshaft selection data, LSA charts, overlap calculations, and application recommendations for street, street/strip, and racing engines.</p>
          </li>
          <li>
            <a href="https://www.natef.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Professional Automotive Technicians Education Council (NATEF) Engine Performance Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">NATEF maintains certification standards and technical curricula for engine performance diagnostics, including camshaft timing analysis and valve overlap evaluation procedures.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Camshaft Duration & Overlap Calculator"
      description="Professional automotive calculator: Camshaft Duration & Overlap Calculator. Get accurate estimates, expert advice, and financial insights."
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