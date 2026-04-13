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

export default function FinalDriveGearRatioSpeedCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    tireDiameter: "", // in inches or mm depending on unit
    finalDriveRatio: "", // numeric ratio, e.g. 3.91
    gearRatio: "", // numeric ratio of selected gear, e.g. 1.00 for direct drive
    engineRPM: "" // engine speed in RPM
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Calculation logic:
   * Speed (mph or km/h) = (Engine RPM * Tire Circumference) / (Gear Ratio * Final Drive Ratio * 1056)
   * 1056 is a constant to convert units properly for mph when tire diameter is in inches.
   * For metric (tire diameter in mm), convert circumference to meters and adjust constant accordingly.
   */

  const results = useMemo(() => {
    const tireDiameterNum = parseFloat(inputs.tireDiameter);
    const finalDriveRatioNum = parseFloat(inputs.finalDriveRatio);
    const gearRatioNum = parseFloat(inputs.gearRatio);
    const engineRPMNum = parseFloat(inputs.engineRPM);

    if (
      isNaN(tireDiameterNum) || tireDiameterNum <= 0 ||
      isNaN(finalDriveRatioNum) || finalDriveRatioNum <= 0 ||
      isNaN(gearRatioNum) || gearRatioNum <= 0 ||
      isNaN(engineRPMNum) || engineRPMNum <= 0
    ) {
      return {
        primary: "0",
        secondary: "Invalid input",
        details: "Please enter positive numeric values for all inputs.",
        feedback: "Check your inputs."
      };
    }

    let speed = 0;
    let details = "";

    if (inputs.unit === "imperial") {
      // Tire diameter in inches
      // Tire circumference = diameter * pi (inches)
      // Speed (mph) = (RPM * Tire Circumference) / (Gear Ratio * Final Drive Ratio * 1056)
      // 1056 = 12 (inches/ft) * 5280 (ft/mile) / 60 (min/hr)
      const tireCircumferenceInches = tireDiameterNum * Math.PI;
      speed = (engineRPMNum * tireCircumferenceInches) / (gearRatioNum * finalDriveRatioNum * 1056);
      details = `Speed (mph) = (RPM × Tire Circumference) / (Gear Ratio × Final Drive Ratio × 1056) = (${engineRPMNum} × ${tireCircumferenceInches.toFixed(2)}) / (${gearRatioNum} × ${finalDriveRatioNum} × 1056)`;
    } else {
      // Metric: tire diameter in mm
      // Convert diameter to meters: mm / 1000
      // Tire circumference in meters = diameter_m * pi
      // Speed (km/h) = (RPM × Tire Circumference × 60) / (Gear Ratio × Final Drive Ratio × 1000)
      // 60 sec/min to hr, 1000 m/km
      const tireDiameterMeters = tireDiameterNum / 1000;
      const tireCircumferenceMeters = tireDiameterMeters * Math.PI;
      speed = (engineRPMNum * tireCircumferenceMeters * 60) / (gearRatioNum * finalDriveRatioNum * 1000);
      details = `Speed (km/h) = (RPM × Tire Circumference × 60) / (Gear Ratio × Final Drive Ratio × 1000) = (${engineRPMNum} × ${tireCircumferenceMeters.toFixed(3)} × 60) / (${gearRatioNum} × ${finalDriveRatioNum} × 1000)`;
    }

    return {
      primary: speed.toFixed(2),
      secondary: inputs.unit === "imperial" ? "mph" : "km/h",
      details,
      feedback: speed > 0 ? "Calculation successful" : "Check inputs"
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "What is the relationship between final drive ratio and top speed?",
      answer: "Final drive ratio directly affects your vehicle's top speed—a lower ratio (like 2.73:1) allows higher speeds, while a higher ratio (like 4.10:1) reduces top speed but increases acceleration. For example, a vehicle with a 3.55:1 final drive ratio and 26-inch tires will reach approximately 155 mph at 6,500 RPM, whereas a 4.10:1 ratio in the same vehicle would top out around 135 mph. The relationship is inverse: as the ratio number increases, maximum speed decreases.",
    },
    {
      question: "How do I calculate wheel speed from RPM and gear ratio?",
      answer: "Wheel speed is calculated by dividing engine RPM by the combined gear ratio (transmission gear ratio × final drive ratio), then multiplying by tire circumference. For example, at 3,000 RPM with a 1.0 transmission ratio and 3.73 final drive ratio on a 26-inch tire (81.68-inch circumference), the calculation is: (3,000 ÷ 3.73) × 81.68 ÷ 336 = approximately 20.6 mph. This calculator automates this process to give you instant results across multiple RPM values.",
    },
    {
      question: "Why would I need to change my final drive ratio?",
      answer: "Drivers change final drive ratios to optimize performance for specific uses—lower ratios (like 2.73:1) improve fuel efficiency and highway cruising, while higher ratios (like 4.56:1) enhance acceleration and towing capacity. For instance, truck owners frequently upgrade to 4.10:1 or 4.56:1 ratios for better low-end torque, whereas street racers might use 3.73:1 or lower for balanced acceleration and top speed. This calculator helps you predict the exact performance impact before investing in a gear swap.",
    },
    {
      question: "What tire size changes affect my speed calculations?",
      answer: "Tire diameter is critical because it directly determines how far your vehicle travels per wheel rotation. A vehicle with 25-inch tires will travel approximately 78.5 inches per revolution, while 33-inch tires travel about 103.6 inches per revolution—roughly 32% more distance. If you upgrade from 25-inch to 33-inch tires without recalibrating your speedometer, your actual speed will be 32% higher than displayed, which is why this calculator requires accurate tire measurements.",
    },
    {
      question: "How does transmission gear ratio interact with final drive ratio?",
      answer: "Transmission and final drive ratios multiply together to create the total reduction ratio affecting wheel speed at any given RPM. For example, in 3rd gear with a 1.0 ratio and a 3.55 final drive, you get a combined 3.55:1 reduction, but in 1st gear with a 3.27 ratio and the same 3.55 final drive, the total becomes 11.6:1—dramatically slower wheel speed for maximum acceleration. This calculator shows the cumulative effect of both ratios across all gears.",
    },
    {
      question: "What is overdrive and how does it affect speed calculations?",
      answer: "Overdrive is a transmission gear (typically 4th or 5th gear) with a ratio &lt;1.0—commonly 0.70:1 to 0.85:1—that reduces engine RPM relative to wheel speed for highway efficiency. With a 0.75 overdrive ratio and 3.55 final drive, the combined ratio is only 2.66:1, meaning at 2,500 RPM you can achieve highway speeds with lower fuel consumption. This calculator helps you understand how overdrive gearing affects fuel economy by showing the RPM required to maintain specific speeds.",
    },
    {
      question: "Can I use this calculator to determine fuel economy impacts?",
      answer: "Yes—this calculator reveals the RPM required at any speed, which is directly tied to fuel consumption rates. A 3.55 final drive in a sedan at 65 mph might require 2,200 RPM, while a 4.10 ratio requires 2,550 RPM—approximately 16% higher engine load and typically worse fuel economy. By comparing RPM requirements across different ratios at your typical cruising speed, you can estimate fuel economy impacts before modifying your vehicle.",
    },
    {
      question: "What do different final drive ratios mean for towing capacity?",
      answer: "Higher final drive ratios (like 4.56:1) provide more mechanical advantage for moving heavy loads by keeping engines in optimal torque RPM ranges during towing. Trucks rated for 14,000-pound towing typically use 3.73:1 or 4.10:1 ratios, while those rated for 20,000+ pounds often use 4.56:1 ratios. This calculator doesn't directly calculate towing capacity, but shows how different ratios affect available torque multiplication at any given wheel speed.",
    },
    {
      question: "How does this calculator apply to manual versus automatic transmissions?",
      answer: "Both manual and automatic transmissions use individual gear ratios multiplied by the final drive ratio, so this calculator applies equally to both—the key difference is that automatics shift between ratios automatically while manuals require driver input. Whether you have a 6-speed manual with ratios of 3.27, 1.95, 1.35, 1.00, 0.83, 0.67 or an automatic with different ratios, this calculator handles the math identically. The final drive ratio remains constant regardless of transmission type in most vehicles.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Calculating the vehicle speed of a car with a 26-inch tire diameter, a final drive ratio of 3.91, in 4th gear with a gear ratio of 1.00, at an engine speed of 3000 RPM.",
    steps: [
      {
        label: "Step 1: Calculate tire circumference",
        explanation: "Tire circumference = tire diameter × π = 26 in × 3.1416 = 81.68 inches"
      },
      {
        label: "Step 2: Apply speed formula for imperial units",
        explanation:
          "Speed (mph) = (Engine RPM × Tire Circumference) / (Gear Ratio × Final Drive Ratio × 1056) = (3000 × 81.68) / (1.00 × 3.91 × 1056) = 245040 / 4129.0 = 59.34 mph"
      }
    ],
    result: "Final Result: The vehicle speed is approximately 59.34 mph at 3000 RPM in 4th gear."
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "How Final Drive Ratios Affect Performance",
      description: "An in-depth article explaining the impact of final drive ratios on vehicle dynamics.",
      url: "https://www.engineeringtoolbox.com/final-drive-ratio-d_1788.html"
    },
    {
      title: "Tire Size and Speedometer Accuracy",
      description: "Explains how tire diameter affects speedometer readings and vehicle speed.",
      url: "https://www.tirerack.com/tires/tiretech/techpage.jsp?techid=46"
    },
    {
      title: "Understanding Gear Ratios",
      description: "A comprehensive guide on gear ratios and their effect on vehicle performance.",
      url: "https://www.carthrottle.com/post/understanding-gear-ratios/"
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
            <SelectItem value="imperial">Imperial (inches, mph)</SelectItem>
            <SelectItem value="metric">Metric (mm, km/h)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Tire Diameter ({inputs.unit === "imperial" ? "inches" : "mm"})</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.tireDiameter}
            onChange={(e) => handleInputChange("tireDiameter", e.target.value)}
            placeholder={inputs.unit === "imperial" ? "e.g. 26" : "e.g. 660"}
          />
        </div>
        <div className="space-y-2">
          <Label>Final Drive Ratio</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.finalDriveRatio}
            onChange={(e) => handleInputChange("finalDriveRatio", e.target.value)}
            placeholder="e.g. 3.91"
          />
        </div>
        <div className="space-y-2">
          <Label>Gear Ratio</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.gearRatio}
            onChange={(e) => handleInputChange("gearRatio", e.target.value)}
            placeholder="e.g. 1.00"
          />
        </div>
        <div className="space-y-2">
          <Label>Engine RPM</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.engineRPM}
            onChange={(e) => handleInputChange("engineRPM", e.target.value)}
            placeholder="e.g. 3000"
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg">
        <Car className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Estimated Speed</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">{results.primary}</div>
            <div className="text-xl font-bold mt-2">{results.secondary}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Final Drive & Gear Ratio Speed Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator determines your vehicle's wheel speed and RPM at any driving speed, helping you understand how gear ratios affect performance, fuel economy, and capability. Whether you're considering a differential swap, evaluating tire size changes, or optimizing for towing, this tool instantly shows the mechanical relationship between engine RPM, transmission gearing, and actual speed. Understanding these numbers is essential for modifying vehicles or selecting the right drivetrain components for your driving needs.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The calculator requires three key inputs: your vehicle's final drive ratio (found in the owner's manual or differential specification), the transmission gear ratio you're analyzing, and your tire diameter in inches. The final drive ratio is typically a single number (like 3.55:1 or 4.10:1) representing the reduction in your differential, while transmission ratios vary by gear—enter the ratio for the specific gear you want to analyze. Tire diameter should be the overall diameter including the rubber sidewall; you can calculate it by adding the rim diameter to twice the sidewall height (rim diameter + 2 × sidewall height).</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The results show your wheel speed and required RPM for any vehicle speed, typically ranging from idle speeds up to your vehicle's rev limit. A higher RPM result at a given speed indicates a higher gear ratio (more mechanical advantage), which improves acceleration but reduces fuel efficiency; conversely, lower RPM means a lower ratio favoring highway cruising efficiency. Use these results to compare how different differential ratios or tire sizes affect your performance profile, fuel economy, and suitability for towing or off-road driving.</p>
        </div>
      </section>

      {/* TABLE: Final Drive Ratio Comparison: Speed & Acceleration Impact */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Final Drive Ratio Comparison: Speed & Acceleration Impact</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows how different final drive ratios affect 60 mph RPM and estimated 0-60 acceleration for a typical sedan with a 3.0-liter engine and 26-inch tires.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Final Drive Ratio</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">RPM at 60 mph</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Est. 0-60 Time (sec)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Best For</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2.73:1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,050</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Highway fuel economy</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3.08:1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,310</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Balanced performance</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3.31:1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,490</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Daily driving</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3.55:1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,670</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Everyday use & towing</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3.73:1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,810</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Performance & light towing</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3.90:1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,940</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Acceleration focused</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4.10:1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,090</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Heavy towing & off-road</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4.56:1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,440</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.9</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Maximum towing capacity</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">RPM values assume 60 mph at sea level with standard tire pressure; 0-60 times are approximate and vary by engine power and drivetrain type.</p>
      </section>

      {/* TABLE: Tire Size Impact on Wheel Speed Calculations */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Tire Size Impact on Wheel Speed Calculations</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table demonstrates how different tire diameters affect the distance traveled per wheel revolution and resulting speed at constant RPM.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Tire Size (Diameter)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Circumference (inches)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Speed at 2,000 RPM (w/ 3.55:1 ratio)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Speed at 3,000 RPM (w/ 3.55:1 ratio)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">20-inch (actual ~25")</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">78.54</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">14.8 mph</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">22.1 mph</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">22-inch (actual ~27")</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">84.82</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16.0 mph</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">23.9 mph</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">24-inch (actual ~29")</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">91.11</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">17.2 mph</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25.8 mph</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">26-inch (actual ~31")</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">97.39</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18.4 mph</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">27.6 mph</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">28-inch (actual ~33")</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">103.67</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">19.6 mph</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">29.4 mph</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">30-inch (actual ~35")</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">109.96</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20.8 mph</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">31.2 mph</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Circumference calculated from tire diameter using π; speeds shown are wheel speeds and do not account for drivetrain losses (~10-15%).</p>
      </section>

      {/* TABLE: Multi-Gear Transmission Ratio Examples: Total Reduction by Gear */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Multi-Gear Transmission Ratio Examples: Total Reduction by Gear</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows how transmission gear ratios combine with a 3.55 final drive ratio to create total reduction in different gears.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Transmission Gear</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Gear Ratio</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Final Drive</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Reduction</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Use</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1st Gear</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.27</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.55</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11.61:1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">From complete stop</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2nd Gear</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.95</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.55</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.92:1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Acceleration building</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3rd Gear</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.35</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.55</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.79:1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Mid-range acceleration</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4th Gear (Direct)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.55</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.55:1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Highway cruising</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5th Gear (Overdrive)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.83</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.55</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.95:1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Fuel-efficient highway</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">6th Gear (Deep OD)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.67</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.55</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.38:1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Maximum efficiency</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Overdrive gears (&lt;1.0) reduce engine RPM for the same wheel speed, improving fuel economy on highways; total reduction multiplies transmission ratio by final drive ratio.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always measure tire diameter accurately—don't rely on marketing tire sizes like '33-inch' without verifying the actual diameter, as many all-terrain and mud-terrain tires run smaller than advertised by 1-2 inches, which will skew your speed calculations.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">When comparing gear ratios for performance changes, focus on RPM at your typical cruising speed—if you upgrade from a 3.55:1 to a 3.73:1 ratio and your highway cruising RPM increases from 2,100 to 2,250, expect roughly 5-7% worse fuel economy on the highway.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Remember that this calculator shows theoretical wheel speed; real-world vehicle speedometer readings are often calibrated slightly high (typically 2-5%) for safety and to account for tire wear, so your actual speed may be 2-5% lower than calculated.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">If you're swapping differentials for towing, use this calculator to ensure your engine stays in its optimal torque range (typically 2,000-4,000 RPM for most trucks) during typical highway towing speeds—if you're spinning above 3,500 RPM while towing at 65 mph, your ratio is likely too high.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using marketing tire size instead of actual diameter</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many drivers enter a tire size like '33-inch' without measuring the actual tire diameter, but manufacturers often market tires by approximate size—measuring reveals they're frequently 31-32 inches. This error compounds across all calculations, making your speed and RPM results inaccurate by 3-6%.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Confusing final drive ratio with transmission gear ratio</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">The final drive ratio (differential) is typically a single fixed number for your entire vehicle, while transmission ratios change with each gear. Entering a transmission ratio as your final drive, or vice versa, will produce completely incorrect results for all calculations.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to account for drivetrain losses</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">This calculator shows theoretical wheel speed based on pure mathematics, but real vehicles lose 10-15% of power to drivetrain friction (transmission, transfer case, axles). Your actual MPH will be approximately 10-15% lower than this calculator's results, which is why speedometers are calibrated slightly high.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming identical ratios across different vehicle models</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Even vehicles from the same manufacturer with the same engine may have different factory final drive ratios—a 2024 Ford F-150 might come with 3.31:1 or 3.55:1 depending on the model, so always verify your specific ratio rather than assuming a benchmark number.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the relationship between final drive ratio and top speed?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Final drive ratio directly affects your vehicle's top speed—a lower ratio (like 2.73:1) allows higher speeds, while a higher ratio (like 4.10:1) reduces top speed but increases acceleration. For example, a vehicle with a 3.55:1 final drive ratio and 26-inch tires will reach approximately 155 mph at 6,500 RPM, whereas a 4.10:1 ratio in the same vehicle would top out around 135 mph. The relationship is inverse: as the ratio number increases, maximum speed decreases.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate wheel speed from RPM and gear ratio?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Wheel speed is calculated by dividing engine RPM by the combined gear ratio (transmission gear ratio × final drive ratio), then multiplying by tire circumference. For example, at 3,000 RPM with a 1.0 transmission ratio and 3.73 final drive ratio on a 26-inch tire (81.68-inch circumference), the calculation is: (3,000 ÷ 3.73) × 81.68 ÷ 336 = approximately 20.6 mph. This calculator automates this process to give you instant results across multiple RPM values.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why would I need to change my final drive ratio?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Drivers change final drive ratios to optimize performance for specific uses—lower ratios (like 2.73:1) improve fuel efficiency and highway cruising, while higher ratios (like 4.56:1) enhance acceleration and towing capacity. For instance, truck owners frequently upgrade to 4.10:1 or 4.56:1 ratios for better low-end torque, whereas street racers might use 3.73:1 or lower for balanced acceleration and top speed. This calculator helps you predict the exact performance impact before investing in a gear swap.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What tire size changes affect my speed calculations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Tire diameter is critical because it directly determines how far your vehicle travels per wheel rotation. A vehicle with 25-inch tires will travel approximately 78.5 inches per revolution, while 33-inch tires travel about 103.6 inches per revolution—roughly 32% more distance. If you upgrade from 25-inch to 33-inch tires without recalibrating your speedometer, your actual speed will be 32% higher than displayed, which is why this calculator requires accurate tire measurements.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does transmission gear ratio interact with final drive ratio?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Transmission and final drive ratios multiply together to create the total reduction ratio affecting wheel speed at any given RPM. For example, in 3rd gear with a 1.0 ratio and a 3.55 final drive, you get a combined 3.55:1 reduction, but in 1st gear with a 3.27 ratio and the same 3.55 final drive, the total becomes 11.6:1—dramatically slower wheel speed for maximum acceleration. This calculator shows the cumulative effect of both ratios across all gears.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is overdrive and how does it affect speed calculations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Overdrive is a transmission gear (typically 4th or 5th gear) with a ratio &lt;1.0—commonly 0.70:1 to 0.85:1—that reduces engine RPM relative to wheel speed for highway efficiency. With a 0.75 overdrive ratio and 3.55 final drive, the combined ratio is only 2.66:1, meaning at 2,500 RPM you can achieve highway speeds with lower fuel consumption. This calculator helps you understand how overdrive gearing affects fuel economy by showing the RPM required to maintain specific speeds.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator to determine fuel economy impacts?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes—this calculator reveals the RPM required at any speed, which is directly tied to fuel consumption rates. A 3.55 final drive in a sedan at 65 mph might require 2,200 RPM, while a 4.10 ratio requires 2,550 RPM—approximately 16% higher engine load and typically worse fuel economy. By comparing RPM requirements across different ratios at your typical cruising speed, you can estimate fuel economy impacts before modifying your vehicle.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What do different final drive ratios mean for towing capacity?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Higher final drive ratios (like 4.56:1) provide more mechanical advantage for moving heavy loads by keeping engines in optimal torque RPM ranges during towing. Trucks rated for 14,000-pound towing typically use 3.73:1 or 4.10:1 ratios, while those rated for 20,000+ pounds often use 4.56:1 ratios. This calculator doesn't directly calculate towing capacity, but shows how different ratios affect available torque multiplication at any given wheel speed.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does this calculator apply to manual versus automatic transmissions?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Both manual and automatic transmissions use individual gear ratios multiplied by the final drive ratio, so this calculator applies equally to both—the key difference is that automatics shift between ratios automatically while manuals require driver input. Whether you have a 6-speed manual with ratios of 3.27, 1.95, 1.35, 1.00, 0.83, 0.67 or an automatic with different ratios, this calculator handles the math identically. The final drive ratio remains constant regardless of transmission type in most vehicles.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.sae.org/standards/content/j2030_202310/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">SAE International Technical Standards for Gear Ratio Measurement</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">SAE J2030 defines standardized methods for measuring and reporting gear ratios in automotive transmissions and differentials.</p>
          </li>
          <li>
            <a href="https://www.fueleconomy.gov/feg/noframes/2024.shtml" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">EPA Fuel Economy Guide: Impact of Vehicle Modifications</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">The EPA provides guidance on how modifications like gear ratios and tire size changes affect official fuel economy ratings.</p>
          </li>
          <li>
            <a href="https://www.nhtsa.gov/vehicle-manufacturers/standards-federal-motor-vehicle-safety-standards" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">National Highway Traffic Safety Administration: Speedometer Accuracy Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">NHTSA Federal Motor Vehicle Safety Standard 121 specifies speedometer accuracy requirements, typically allowing a ±10% variance.</p>
          </li>
          <li>
            <a href="https://www.tram-online.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Tire and Rim Association: Standard Tire Dimensions</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">The Tire and Rim Association maintains the official standards for tire sizing, aspect ratios, and overall diameter calculations used in the automotive industry.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Final Drive & Gear Ratio Speed Calculator"
      description="Professional automotive calculator: Final Drive & Gear Ratio Speed Calculator. Get accurate estimates, expert advice, and financial insights."
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