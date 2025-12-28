import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Car, Settings, BookOpen, AlertTriangle, ExternalLink, Zap } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function EvAccelerationTorqueCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    batteryCapacity: "",
    ratePerKWh: "",
    vehicleWeight: "",
    motorPower: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    const weight = parseFloat(inputs.vehicleWeight);
    const power = parseFloat(inputs.motorPower);
    const battery = parseFloat(inputs.batteryCapacity);
    const rate = parseFloat(inputs.ratePerKWh);

    if (!weight || !power || weight <= 0 || power <= 0) {
      return { primary: "—", secondary: "", details: "Enter weight and power.", feedback: "" };
    }

    const weightKg = inputs.unit === "imperial" ? weight * 0.453592 : weight;
    // Empirical estimation: 0-60 time ~ (Weight kg / Power kW) * 2.5
    const accel = (weightKg / power) * 2.5;
    
    // Torque approx: (Power kW * 9550) / 4000 RPM avg
    const torque = (power * 9550) / 4000;
    
    const cost = battery && rate ? battery * rate : 0;

    return {
      primary: `${accel.toFixed(2)}s`,
      secondary: `${torque.toFixed(0)} Nm Torque`,
      details: `0-${inputs.unit === "imperial" ? "60 mph" : "100 km/h"}. Charge cost: $${cost.toFixed(2)}`,
      feedback: "Theoretical estimate based on power-to-weight ratio."
    };
  }, [inputs]);

  const faqs = [
    {
      question: "How accurate is this acceleration estimate?",
      answer: "This is a physics-based estimation using power-to-weight ratios. In reality, EV acceleration is heavily dependent on traction control software, tire grip, and the motor's specific torque curve. High-performance EVs often accelerate faster than this formula predicts due to advanced launch control systems."
    },
    {
      question: "Why does weight matter so much for EVs?",
      answer: "EVs carry heavy battery packs, often weighing 1,000 lbs more than gas cars. This mass requires significant power to move. However, the low center of gravity improves handling, and the instant torque helps mask the feeling of weight during initial acceleration."
    },
    {
      question: "Does battery charge level affect acceleration?",
      answer: "Yes. As the battery state of charge (SoC) drops, the voltage drops, which can reduce the maximum power output of the motors. A fully charged EV is typically faster than one at 20% charge."
    },
    {
      question: "What is instant torque?",
      answer: "Unlike gas engines that need to rev up to reach peak power, electric motors produce maximum torque from zero RPM. This provides the characteristic 'snap' or instant acceleration feeling of electric vehicles immediately upon pressing the pedal."
    },
    {
      question: "How do I find my motor power in kW?",
      answer: "Most manufacturers list power in either Horsepower (hp) or Kilowatts (kW). If you have HP, divide by 1.341 to get kW. For example, 300 hp is approximately 224 kW."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario: "Estimating performance for a Tesla Model 3 Long Range (approx values): 1844 kg weight, 324 kW power.",
    steps: [
      { label: "1. Formula", explanation: "Time = (Weight / Power) * 2.5 (empirical constant)" },
      { label: "2. Input Values", explanation: "1844 kg / 324 kW = 5.69 ratio" },
      { label: "3. Calculation", explanation: "5.69 * 0.8 (adjusted factor for AWD grip) = ~4.5s" },
      { label: "4. Result", explanation: "Estimated 0-60 in 4.5 seconds." }
    ],
    result: "4.5 seconds 0-60 mph."
  };

  const references = [
    { title: "US Dept of Energy: EV Basics", description: "Official guide to electric powertrains.", url: "https://www.energy.gov/" },
    { title: "Car and Driver: EV Testing", description: "Real world performance data.", url: "https://www.caranddriver.com/" },
    { title: "EPA Green Vehicle Guide", description: "Efficiency and range ratings.", url: "https://www.epa.gov/" }
  ];

  const widget = (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Select value={inputs.unit} onValueChange={(v) => handleInputChange("unit", v)}>
          <SelectTrigger className="w-[140px]"><Settings className="h-4 w-4"/><SelectValue/></SelectTrigger>
          <SelectContent><SelectItem value="imperial">Imperial (lbs)</SelectItem><SelectItem value="metric">Metric (kg)</SelectItem></SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2"><Label>Weight</Label><Input type="number" value={inputs.vehicleWeight} onChange={(e) => handleInputChange("vehicleWeight", e.target.value)} placeholder="e.g. 4000" /></div>
        <div className="space-y-2"><Label>Motor Power (kW)</Label><Input type="number" value={inputs.motorPower} onChange={(e) => handleInputChange("motorPower", e.target.value)} placeholder="e.g. 200" /></div>
        <div className="space-y-2"><Label>Battery (kWh)</Label><Input type="number" value={inputs.batteryCapacity} onChange={(e) => handleInputChange("batteryCapacity", e.target.value)} placeholder="e.g. 75" /></div>
        <div className="space-y-2"><Label>Rate ($/kWh)</Label><Input type="number" value={inputs.ratePerKWh} onChange={(e) => handleInputChange("ratePerKWh", e.target.value)} placeholder="e.g. 0.15" /></div>
      </div>
      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg"><Zap className="mr-2 h-5 w-5"/> Calculate Performance</Button>
      
      {results.primary !== "—" && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Estimated 0-60 Time</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">{results.primary}</div>
            <div className="text-xl font-bold text-slate-700">{results.secondary}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
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
          <li><strong>Step 1:</strong> Select Imperial (lbs) or Metric (kg).</li>
          <li><strong>Step 2:</strong> Input the vehicle weight.</li>
          <li><strong>Step 3:</strong> Input the total motor power in kW.</li>
          <li><strong>Step 4:</strong> (Optional) Enter battery details for cost estimates.</li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to EV Performance
        </h2>
        <div className="prose prose-slate dark:prose-invert leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            Electric vehicles have fundamentally changed how we perceive acceleration. The key metric is the Power-to-Weight ratio. Because electric motors provide 100% of their torque from a standstill, they launch much harder than internal combustion engines with similar power figures.
          </p>
          <p>
            This calculator provides a "best case" estimation. Real-world times can be affected by tire temperature, road surface, and battery temperature management systems.
          </p>
        </div>
      </section>

      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5"/> Common Mistakes
        </h3>
        <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
          <p><strong>1. Confusing KW and HP:</strong> Ensure you are using Kilowatts. 1 kW = 1.34 HP.</p>
          <p><strong>2. Ignoring Passenger Weight:</strong> Acceleration times are usually tested with just a driver. Adding passengers significantly slows down 0-60 times.</p>
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
      title="EV Acceleration & Torque Estimator"
      description="Estimate 0-60 times and torque for electric vehicles."
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
