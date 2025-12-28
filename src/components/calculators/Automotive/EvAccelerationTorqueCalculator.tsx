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

  /**
   * Logic Explanation:
   * 
   * This calculator estimates the acceleration time (0-60 mph or 0-100 km/h) and torque delivery based on:
   * - Battery capacity (kWh)
   * - Electricity rate ($/kWh)
   * - Vehicle weight (lbs or kg)
   * - Motor power (kW)
   * 
   * Assumptions:
   * - Motor power directly relates to torque and acceleration capability.
   * - Battery capacity affects how long the vehicle can sustain power delivery.
   * - Vehicle weight affects acceleration time.
   * 
   * Formulas:
   * - Torque (Nm) ≈ (Motor Power (kW) * 9550) / Motor RPM (assumed 4000 RPM for EV motor)
   * - Acceleration time (0-60 mph or 0-100 km/h) ≈ (Vehicle Weight / Motor Power) * constant factor
   * 
   * Cost to fully charge = Battery Capacity (kWh) * Rate ($/kWh)
   * 
   * Output:
   * - Estimated 0-60 mph (or 0-100 km/h) acceleration time in seconds
   * - Estimated torque in Nm
   * - Cost to fully charge battery
   */

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
    // Empirical factor: For EVs, 0-60 mph time roughly proportional to weight/power ratio * 2.5
    // This is a rough estimate for typical EVs.
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
    },
    {
      title: "Electric Vehicle Basics - U.S. Department of Energy",
      description: "Fundamental concepts and technical details about EVs."
    },
    {
      title: "SAE International - Electric Vehicle Powertrain",
      description: "Technical papers and standards on EV motor and battery performance."
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
            <strong>Step 1:</strong> Select your preferred unit system (Imperial or Metric) from the dropdown at the top right.
          </li>
          <li>
            <strong>Step 2:</strong> Enter your electric vehicle's battery capacity in kilowatt-hours (kWh).
          </li>
          <li>
            <strong>Step 3:</strong> Input the current electricity rate you pay per kWh in dollars.
          </li>
          <li>
            <strong>Step 4:</strong> Provide your vehicle's weight in pounds (lbs) if using Imperial or kilograms (kg) if using Metric.
          </li>
          <li>
            <strong>Step 5:</strong> Enter the motor power rating in kilowatts (kW), typically found in your vehicle specifications.
          </li>
          <li>
            <strong>Step 6:</strong> Click the "Calculate" button to see your estimated acceleration time, torque delivery, and charging cost.
          </li>
        </ol>
      </section>

      {/* 2. COMPLETE GUIDE */}
      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to EV Acceleration & Torque Delivery Estimator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Electric vehicles (EVs) are revolutionizing the automotive industry by offering instant torque and smooth acceleration. Understanding how your EV's battery capacity, motor power, and vehicle weight influence acceleration and torque delivery is essential for both enthusiasts and professionals. This calculator provides a practical tool to estimate these performance metrics alongside the cost to fully charge your battery.
          </p>
          <p>
            The battery capacity, measured in kilowatt-hours (kWh), indicates how much energy your EV can store. A larger battery generally means longer driving range but also affects the vehicle's weight. Motor power, expressed in kilowatts (kW), directly relates to the torque output and acceleration capability. The vehicle's weight plays a crucial role in determining how quickly it can accelerate; heavier vehicles require more power to achieve the same acceleration as lighter ones.
          </p>
          <p>
            By inputting these parameters, the calculator estimates the torque using a standard formula that relates power and motor speed, assuming a typical motor RPM for EVs. The acceleration time estimate is derived from an empirical relationship between weight and power, providing a reasonable approximation of 0-60 mph or 0-100 km/h times. Additionally, the calculator computes the cost to fully charge your EV battery based on your local electricity rate, helping you understand the financial aspect of EV ownership.
          </p>
          <p>
            While this tool offers valuable insights, keep in mind that actual vehicle performance can vary due to factors like drivetrain efficiency, tire conditions, and environmental influences. For precise performance data, consult manufacturer specifications or professional testing results.
          </p>
        </div>
      </section>

      {/* 3. COMMON MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" /> Common Mistakes
        </h3>
        <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <p>
            <strong>1. Incorrect Units:</strong> Mixing metric and imperial units can lead to inaccurate results. Always ensure you select the correct unit system and input values accordingly.
          </p>
          <p>
            <strong>2. Ignoring Motor Power:</strong> Leaving motor power blank or entering unrealistic values will skew acceleration and torque estimates. Use manufacturer specs for accuracy.
          </p>
          <p>
            <strong>3. Overlooking Vehicle Weight:</strong> Vehicle weight significantly impacts acceleration. Using outdated or incorrect weight values can misrepresent performance.
          </p>
          <p>
            <strong>4. Assuming Exact Results:</strong> This calculator provides estimates based on simplified formulas. Real-world performance depends on many additional factors.
          </p>
          <p>
            <strong>5. Not Updating Electricity Rates:</strong> Electricity costs vary by location and time. Use current rates to get accurate charging cost estimates.
          </p>
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
              <a
                href="#"
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                {ref.title} <ExternalLink className="w-3 h-3" />
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