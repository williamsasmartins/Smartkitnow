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

export default function EvAccelerationTorqueCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    batteryCapacity: "", // kWh
    ratePerKWh: "", // $/kWh
    vehicleWeight: "", // lbs or kg
    motorPower: "" // kW
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    const battery = parseFloat(inputs.batteryCapacity);
    const rate = parseFloat(inputs.ratePerKWh);
    const weight = parseFloat(inputs.vehicleWeight);
    const power = parseFloat(inputs.motorPower);

    if (
      isNaN(battery) || battery <= 0 ||
      isNaN(rate) || rate <= 0 ||
      isNaN(weight) || weight <= 0 ||
      isNaN(power) || power <= 0
    ) {
      return {
        primary: "—",
        secondary: "Enter valid inputs",
        details: "",
        feedback: "Please fill all fields with positive numbers."
      };
    }

    // Convert weight to kg if imperial
    const weightKg = inputs.unit === "imperial" ? weight * 0.453592 : weight;

    // Motor RPM assumption for torque calculation
    const motorRPM = 4000;

    // Torque (Nm) = (Power (kW) * 9550) / RPM
    const torqueNm = (power * 9550) / motorRPM;

    // Acceleration time estimate (seconds)
    const accelTimeSec = (weightKg / power) * 2.5;

    // Cost to fully charge battery
    const costToCharge = battery * rate;

    // Format outputs
    const accelFormatted = accelTimeSec.toFixed(2) + (inputs.unit === "imperial" ? " sec (0-60 mph)" : " sec (0-100 km/h)");
    const torqueFormatted = torqueNm.toFixed(1) + " Nm";
    const costFormatted = "$" + costToCharge.toFixed(2);

    return {
      primary: accelFormatted,
      secondary: `Torque: ${torqueFormatted}`,
      details: `Full charge cost: ${costFormatted}`,
      feedback: "Estimated acceleration and torque based on inputs."
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "How accurate is the acceleration time estimate?",
      answer:
        "The acceleration time estimate is a rough approximation based on the ratio of vehicle weight to motor power, multiplied by an empirical factor. Actual acceleration depends on many factors including drivetrain efficiency, tire grip, aerodynamics, and battery power delivery. This calculator provides a baseline estimate useful for comparison but should not replace detailed vehicle testing."
    },
    {
      question: "Why do I need to input vehicle weight and motor power?",
      answer:
        "Vehicle weight and motor power are critical factors influencing acceleration and torque delivery. Heavier vehicles require more power to accelerate quickly, while higher motor power enables faster acceleration and greater torque. Including these inputs allows the calculator to provide more realistic and personalized estimates."
    },
    {
      question: "Can I use this calculator for both metric and imperial units?",
      answer:
        "Yes, the calculator supports both metric and imperial units. When using imperial units, vehicle weight should be entered in pounds (lbs), and acceleration time is estimated for 0-60 mph. For metric units, weight is in kilograms (kg), and acceleration time corresponds to 0-100 km/h."
    },
    {
      question: "How is the torque value calculated?",
      answer:
        "Torque is estimated using the formula Torque (Nm) = (Power (kW) × 9550) / Motor RPM. We assume a typical motor speed of 4000 RPM for electric motors. This provides an approximate torque output useful for understanding the motor's capability to deliver force to the wheels."
    },
    {
      question: "What does the cost output represent?",
      answer:
        "The cost output represents the estimated expense to fully charge the EV battery from empty, calculated by multiplying the battery capacity (in kWh) by the electricity rate per kWh. This helps users understand the financial aspect of charging their electric vehicle."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Calculating acceleration, torque, and charging cost for a 75 kWh battery EV with a 150 kW motor, weighing 4,000 lbs, charged at $0.13 per kWh.",
    steps: [
      {
        label: "Step 1: Convert vehicle weight to kilograms",
        explanation: "4000 lbs × 0.453592 = 1814.37 kg"
      },
      {
        label: "Step 2: Calculate torque",
        explanation: "Torque = (150 kW × 9550) / 4000 RPM = 358.13 Nm"
      },
      {
        label: "Step 3: Estimate acceleration time",
        explanation: "Acceleration time = (1814.37 kg / 150 kW) × 2.5 = 30.24 seconds (0-60 mph estimate)"
      },
      {
        label: "Step 4: Calculate charging cost",
        explanation: "Charging cost = 75 kWh × $0.13/kWh = $9.75"
      }
    ],
    result:
      "Estimated 0-60 mph acceleration time: 30.24 seconds, Torque: 358.1 Nm, Full charge cost: $9.75"
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "EPA Fuel Economy Guide",
      description: "Official source for electric vehicle efficiency and performance data."
    },
    {
      title: "Kelley Blue Book",
      description: "Trusted vehicle valuation and pricing, including EV specifications."
    },
    {
      title: "Edmunds Automotive",
      description: "Comprehensive car reviews and expert advice on electric vehicles."
    }
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
            <SelectItem value="imperial">Imperial (US)</SelectItem>
            <SelectItem value="metric">Metric</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Battery Capacity (kWh)</Label>
          <Input
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 75"
            value={inputs.batteryCapacity}
            onChange={(e) => handleInputChange("batteryCapacity", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Electricity Rate ($/kWh)</Label>
          <Input
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 0.13"
            value={inputs.ratePerKWh}
            onChange={(e) => handleInputChange("ratePerKWh", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Vehicle Weight ({inputs.unit === "imperial" ? "lbs" : "kg"})</Label>
          <Input
            type="number"
            min="0"
            step="any"
            placeholder={inputs.unit === "imperial" ? "e.g. 4000" : "e.g. 1814"}
            value={inputs.vehicleWeight}
            onChange={(e) => handleInputChange("vehicleWeight", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Motor Power (kW)</Label>
          <Input
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 150"
            value={inputs.motorPower}
            onChange={(e) => handleInputChange("motorPower", e.target.value)}
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" onClick={() => {}}>
        <Car className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Estimated Result</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">{results.primary}</div>
            <div className="text-xl font-bold mt-2">{results.secondary}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
            <p className="text-sm mt-3 text-slate-700 dark:text-slate-300">{results.feedback}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      {/* 1. HOW TO USE */}
      <section id="how-to-use" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to use this calculator</h2>
        <ol className="list-decimal pl-5 space-y-3 text-slate-600 dark:text-slate-400">
          <li>
            <strong>Step 1:</strong> Select your preferred unit system (Imperial or Metric).
          </li>
          <li>
            <strong>Step 2:</strong> Enter your electric vehicle's battery capacity in kWh.
          </li>
          <li>
            <strong>Step 3:</strong> Input the current electricity rate per kWh.
          </li>
          <li>
            <strong>Step 4:</strong> Provide your vehicle's weight.
          </li>
          <li>
            <strong>Step 5:</strong> Enter the motor power rating in kW.
          </li>
          <li>
            <strong>Step 6:</strong> Click "Calculate" to see acceleration, torque, and cost.
          </li>
        </ol>
      </section>

      {/* 2. COMPLETE GUIDE */}
      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to EV Acceleration & Torque
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Electric vehicles (EVs) offer instant torque and smooth acceleration. Understanding how battery capacity, motor power, and vehicle weight influence performance is essential. This calculator estimates these metrics along with charging costs.
          </p>
          <p>
            Battery capacity (kWh) determines range and weight. Motor power (kW) dictates torque and acceleration. Weight is crucial; heavier cars need more power. This tool uses standard formulas to estimate torque and empirical data for acceleration times.
          </p>
        </div>
      </section>

      {/* 3. COMMON MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" /> Common Mistakes
        </h3>
        <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <p><strong>1. Incorrect Units:</strong> Mixing metric/imperial inputs leads to errors.</p>
          <p><strong>2. Ignoring Weight:</strong> Vehicle weight heavily impacts acceleration.</p>
        </div>
      </section>

      {/* 4. FAQ */}
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

      {/* 5. REFERENCES */}
      <section id="references">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-5 h-5 text-blue-500" /> References & additional resources
        </h2>
        <div className="space-y-4">
          {references.map((ref, i) => (
            <div key={i}>
              <p className="text-blue-600 dark:text-blue-400 font-semibold">{ref.title}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{ref.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="EV Acceleration & Torque Delivery Estimator"
      description="Professional automotive calculator: EV Acceleration & Torque Delivery Estimator. Get accurate estimates, expert advice, and financial insights."
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
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}
