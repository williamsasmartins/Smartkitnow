import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Car, Settings, BookOpen, AlertTriangle, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function ZeroToSixtySpeedVsGearRpmCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    gearRatio: "",
    tireDiameter: "",
    rpm: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    const gearRatio = parseFloat(inputs.gearRatio);
    const tireDiameter = parseFloat(inputs.tireDiameter);
    const rpm = parseFloat(inputs.rpm);
    const unit = inputs.unit;

    if (!gearRatio || !tireDiameter || !rpm || gearRatio <= 0 || tireDiameter <= 0 || rpm <= 0) {
      return {
        primary: "0",
        secondary: unit === "imperial" ? "mph" : "km/h",
        details: "Please enter valid positive numbers.",
        feedback: "Awaiting input"
      };
    }

    let speed = 0;
    if (unit === "imperial") {
      // Speed (mph) = (RPM * Diameter * PI) / (Gear Ratio * 1056)
      speed = (rpm * tireDiameter * Math.PI) / (gearRatio * 1056);
    } else {
      // Speed (km/h) = (RPM * Diameter(mm) * PI) / (Gear Ratio * 30000)
      speed = (rpm * tireDiameter * Math.PI) / (gearRatio * 30000);
    }

    return {
      primary: speed.toFixed(2),
      secondary: unit === "imperial" ? "mph" : "km/h",
      details: `At ${rpm} RPM with ${gearRatio} gear ratio`,
      feedback: "Calculated theoretical speed based on gearing."
    };
  }, [inputs]);

  const faqs = [
    {
      question: "How does gear ratio affect vehicle speed?",
      answer: "The gear ratio determines the relationship between engine revolutions and wheel rotations. A lower numerical gear ratio (e.g., 0.70:1 overdrive) allows the wheels to turn faster than the engine, resulting in higher top speeds at lower RPMs. Conversely, a higher numerical ratio (e.g., 3.73:1) increases torque multiplication for better acceleration but requires higher engine RPM to maintain the same speed."
    },
    {
      question: "Why is accurate tire diameter important for this calculation?",
      answer: "Tire diameter directly impacts the distance a vehicle travels with each wheel rotation. A larger tire covers more ground per revolution, which effectively 'tallies' the gearing and increases actual speed relative to engine RPM. Using the rim size instead of the full rolling diameter (rim + sidewall) will lead to significant errors in the speed estimation."
    },
    {
      question: "Can this calculator determine my actual top speed?",
      answer: "This tool calculates the 'theoretical' top speed limited by gearing and engine redline (drag limited speed). However, in the real world, a vehicle's top speed is often limited by aerodynamic drag (wind resistance) and available engine power. Just because your gearing allows for 200 mph doesn't mean the engine has enough power to push the car through the air at that speed."
    },
    {
      question: "What is the difference between final drive ratio and gear ratio?",
      answer: "The 'gear ratio' usually refers to the specific ratio selected in the transmission (e.g., 3rd gear). The 'final drive ratio' (or axle ratio) is a fixed reduction in the differential. To calculate overall speed accurately, you technically multiply the transmission gear ratio by the final drive ratio. This calculator asks for the specific gear ratio, but you can input the 'total combined ratio' if you wish."
    },
    {
      question: "Does this calculator account for transmission slip?",
      answer: "No, this calculator assumes a rigid mechanical connection, like a manual transmission with the clutch fully engaged or an automatic with the torque converter locked. In automatic transmissions without lockup, there is some fluid slip (typically 2-5%) that would make the actual speed slightly lower than the calculated theoretical speed."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario: "A driver wants to know their speed in 4th gear (1.00 ratio) at 3,000 RPM. They have a final drive of 3.55 (so effective gear ratio is 3.55) and 26-inch tires.",
    steps: [
      { label: "1. Determine Ratio", explanation: "Transmission (1.00) * Final Drive (3.55) = 3.55 total ratio." },
      { label: "2. Identify Inputs", explanation: "RPM = 3000, Tire = 26 inches, Ratio = 3.55." },
      { label: "3. Apply Formula", explanation: "Speed = (3000 * 26 * 3.1416) / (3.55 * 1056)." },
      { label: "4. Calculate", explanation: "Numerator: 245,044. Denominator: 3,748. Result: 65.38." }
    ],
    result: "The vehicle speed is approx 65.38 mph."
  };

  const references = [
    { title: "Engineering Toolbox: Vehicle Speed RPM", description: "Formulas for calculating speed from gear ratios.", url: "https://www.engineeringtoolbox.com/" },
    { title: "Tremec Gear Ratio Calculator", description: "Official transmission gear calculator tool.", url: "https://www.tremec.com/" },
    { title: "Tire Rack: Tire Tech", description: "Understanding tire diameter and revs per mile.", url: "https://www.tirerack.com/" }
  ];

  const widget = (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Select value={inputs.unit} onValueChange={(v) => handleInputChange("unit", v)}>
          <SelectTrigger className="w-[180px]"><Settings className="mr-2 h-4 w-4"/><SelectValue/></SelectTrigger>
          <SelectContent>
            <SelectItem value="imperial">Imperial (mph / inches)</SelectItem>
            <SelectItem value="metric">Metric (km/h / mm)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Gear Ratio (e.g. 3.55)</Label>
          <Input type="number" value={inputs.gearRatio} onChange={(e) => handleInputChange("gearRatio", e.target.value)} placeholder="3.55" />
        </div>
        <div className="space-y-2">
          <Label>Tire Diameter ({inputs.unit === "imperial" ? "in" : "mm"})</Label>
          <Input type="number" value={inputs.tireDiameter} onChange={(e) => handleInputChange("tireDiameter", e.target.value)} placeholder={inputs.unit === "imperial" ? "26" : "660"} />
        </div>
        <div className="space-y-2">
          <Label>Engine RPM</Label>
          <Input type="number" value={inputs.rpm} onChange={(e) => handleInputChange("rpm", e.target.value)} placeholder="3000" />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg"><Car className="mr-2 h-5 w-5"/> Calculate Speed</Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Theoretical Speed</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">{results.primary} {results.secondary}</div>
            <p className="text-sm text-slate-600">{results.details}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="how-to-use" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to use this calculator</h2>
        <ol className="list-decimal pl-5 space-y-3 text-slate-600 dark:text-slate-400">
          <li><strong>Step 1:</strong> Choose your unit system (Imperial for mph/inches, Metric for km/h/mm).</li>
          <li><strong>Step 2:</strong> Enter the <strong>Gear Ratio</strong>. This is often the final drive ratio (axle ratio) if you are calculating top speed in a 1:1 transmission gear.</li>
          <li><strong>Step 3:</strong> Enter the <strong>Tire Diameter</strong>. Use the full rolling height of the tire.</li>
          <li><strong>Step 4:</strong> Enter the <strong>Engine RPM</strong> you wish to check.</li>
          <li><strong>Step 5:</strong> Click Calculate to see the speed.</li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500"/> Complete Guide to Speed vs Gear/RPM
        </h2>
        <div className="prose prose-slate dark:prose-invert leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            Understanding the mechanical relationship between your engine, transmission, and wheels is fundamental to automotive performance tuning. This calculator uses pure physics to determine how fast your vehicle moves for every revolution of the engine. It eliminates variables like wind resistance and friction to give you the "gearing limited" speed.
          </p>
          <p>
            This tool is particularly useful for re-gearing projects (changing differential gears), upsizing tires for off-road vehicles, or setting up a track car's transmission ratios to ensure you don't run out of RPM before the end of a straightaway.
          </p>
        </div>
      </section>

      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5"/> Common Mistakes
        </h3>
        <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
          <p><strong>1. Using Rim Size instead of Tire Diameter:</strong> A 17-inch rim does not mean a 17-inch tire. A typical tire on a 17-inch rim might be 25 or 26 inches tall. Using the wrong number will skew results significantly.</p>
          <p><strong>2. Ignoring Final Drive Ratio:</strong> If you input the transmission gear ratio (e.g., 1.00) but forget to multiply it by the axle ratio (e.g., 3.73), the calculator will think your car is geared for 600 mph.</p>
        </div>
      </section>

      <section id="faq">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently asked questions</h2>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
              <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">{faq.question}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="references">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-5 h-5 text-blue-500"/> References & additional resources
        </h2>
        <div className="space-y-4">
          {references.map((ref, i) => (
            <div key={i}>
              <a href={ref.url} className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1">
                {ref.title} <ExternalLink className="w-3 h-3"/>
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
      title="0–60 Speed vs Gear/RPM Calculator"
      description="Professional automotive calculator: Estimate theoretical vehicle speed based on gear ratio, tire size, and engine RPM."
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
         { id: "references", label: "References" }
      ]}
      showTopBanner showSidebar showBottomBanner
    />
  );
}
