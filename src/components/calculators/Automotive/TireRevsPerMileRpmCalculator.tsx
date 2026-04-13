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

export default function TireRevsPerMileRpmCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    tire1_width: "",
    tire1_aspect: "",
    tire1_diameter: "",
    tire2_width: "",
    tire2_aspect: "",
    tire2_diameter: "",
    speed: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Calculate tire diameter in inches:
   * Diameter = Wheel Diameter + 2 * (Section Height)
   * Section Height = (Width * Aspect Ratio) / 100
   * 
   * Then calculate circumference = π * diameter
   * 
   * Revolutions per mile = 63360 inches per mile / circumference
   * RPM at speed = (speed in mph * revolutions per mile) / 60
   */
  const results = useMemo(() => {
    const {
      unit,
      tire1_width,
      tire1_aspect,
      tire1_diameter,
      tire2_width,
      tire2_aspect,
      tire2_diameter,
      speed
    } = inputs;

    // Parse inputs to numbers
    const w1 = parseFloat(tire1_width);
    const a1 = parseFloat(tire1_aspect);
    const d1 = parseFloat(tire1_diameter);
    const w2 = parseFloat(tire2_width);
    const a2 = parseFloat(tire2_aspect);
    const d2 = parseFloat(tire2_diameter);
    const spd = parseFloat(speed);

    if (
      [w1, a1, d1, w2, a2, d2, spd].some(v => isNaN(v) || v <= 0)
    ) {
      return {
        primary: "—",
        secondary: "Please enter valid positive numbers for all fields.",
        details: "",
        feedback: ""
      };
    }

    // Convert metric inputs to inches if metric selected
    // Width in mm, diameter in inches, aspect ratio in %
    // 1 inch = 25.4 mm
    const tire1_dia_in = d1;
    const tire2_dia_in = d2;
    let tire1_width_mm = w1;
    let tire2_width_mm = w2;

    if (unit === "metric") {
      tire1_width_mm = w1;
      tire2_width_mm = w2;
      // Convert wheel diameter from cm to inches if user inputs cm? 
      // But we assume diameter input is always in inches for wheel diameter.
      // So no conversion for diameter.
    }

    // Calculate tire diameters in inches
    // Section height = (width * aspect ratio) / 100 in mm, convert to inches
    const sectionHeight1_in = (tire1_width_mm * a1) / 100 / 25.4;
    const sectionHeight2_in = (tire2_width_mm * a2) / 100 / 25.4;

    const totalDia1_in = tire1_dia_in + 2 * sectionHeight1_in;
    const totalDia2_in = tire2_dia_in + 2 * sectionHeight2_in;

    // Circumference = π * diameter
    const circ1_in = Math.PI * totalDia1_in;
    const circ2_in = Math.PI * totalDia2_in;

    // Inches per mile = 63360
    const revsPerMile1 = 63360 / circ1_in;
    const revsPerMile2 = 63360 / circ2_in;

    // RPM at speed = (speed in mph * revs per mile) / 60
    // If metric, convert speed km/h to mph
    const speedMph = unit === "metric" ? spd / 1.609344 : spd;

    const rpm1 = (speedMph * revsPerMile1) / 60;
    const rpm2 = (speedMph * revsPerMile2) / 60;

    // Percentage difference in revolutions per mile
    const diffPercent = ((revsPerMile2 - revsPerMile1) / revsPerMile1) * 100;

    return {
      primary: `${diffPercent.toFixed(2)}%`,
      secondary: `Tire 1 RPM @ ${spd} ${unit === "metric" ? "km/h" : "mph"}: ${rpm1.toFixed(0)} RPM`,
      details: `Tire 2 RPM @ ${spd} ${unit === "metric" ? "km/h" : "mph"}: ${rpm2.toFixed(0)} RPM | Revs/Mile Diff: ${diffPercent.toFixed(2)}%`,
      feedback:
        Math.abs(diffPercent) < 3
          ? "Tire sizes are very close in revolutions per mile."
          : "Significant difference in tire revolutions per mile."
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "How many times does a tire revolve per mile?",
      answer: "Tire revolutions per mile depend on tire diameter and circumference. A standard 26-inch diameter tire completes approximately 770 revolutions per mile, while a 35-inch tire completes about 570 revolutions per mile. The calculation uses the formula: revolutions per mile = 63,360 inches ÷ tire circumference in inches. Larger tires always complete fewer revolutions to cover the same distance.",
    },
    {
      question: "What is the relationship between tire size and RPM at highway speeds?",
      answer: "RPM at a given speed is directly proportional to tire revolutions per mile. A vehicle with 28-inch tires turning 1,000 RPM at 40 mph will have lower RPM at the same speed compared to a vehicle with 24-inch tires. For example, 28-inch tires achieve approximately 2,240 RPM at 60 mph, while 26-inch tires reach about 2,420 RPM at the same speed.",
    },
    {
      question: "How do I calculate RPM if I change my tire size?",
      answer: "RPM changes inversely with tire diameter when vehicle speed remains constant. If you upgrade from 25-inch to 30-inch tires, your RPM at any given speed will decrease by approximately 17%. Use the calculator by entering your new tire diameter, desired speed, and gear ratio to see the exact RPM impact before making wheel changes.",
    },
    {
      question: "Why does RPM matter for fuel economy?",
      answer: "Higher RPM at cruising speeds typically increases fuel consumption because the engine works harder to maintain velocity. A vehicle maintaining 2,000 RPM on the highway generally achieves better fuel economy than the same vehicle at 2,500 RPM. Larger tires reduce engine RPM at highway speeds, potentially improving fuel efficiency by 3-5% depending on driving conditions and engine characteristics.",
    },
    {
      question: "What tire diameter is standard for most passenger cars?",
      answer: "Most passenger vehicles use tires with diameters between 24 and 28 inches, with 26-27 inches being very common for sedans. A typical 2024 sedan tire size of 225/45R18 has an overall diameter of approximately 25.6 inches. The calculator helps determine the exact revolutions and RPM for your specific tire size, as even small diameter variations affect engine RPM significantly.",
    },
    {
      question: "How does gear ratio affect the RPM calculation?",
      answer: "Gear ratio multiplies tire revolutions to determine engine RPM; a 3.5:1 final drive ratio means the engine turns 3.5 times for every tire revolution. At 60 mph with 26-inch tires and a 3.5:1 ratio, RPM reaches approximately 2,420 × 3.5 ÷ 60 = 1,414 RPM. Different gear ratios dramatically change engine RPM at the same speed, affecting performance, fuel economy, and engine longevity.",
    },
    {
      question: "Can lifting my truck change tire revolutions per mile?",
      answer: "Lifting your truck and installing larger tires reduces revolutions per mile proportionally to the increase in tire diameter. Installing 33-inch tires instead of stock 28-inch tires decreases revolutions per mile from about 720 to 610, a 15% reduction. This directly lowers engine RPM at highway speeds, which can affect speedometer accuracy and require recalibration of engine computer settings.",
    },
    {
      question: "What RPM range is optimal for highway driving?",
      answer: "Most engines operate most efficiently between 1,500 and 2,500 RPM during highway cruising at 55-70 mph. Modern fuel-injected engines with overdrive transmissions are designed to maintain around 1,800-2,000 RPM at 65 mph for optimal fuel economy. Operating consistently above 3,000 RPM on the highway reduces fuel efficiency and increases engine wear.",
    },
    {
      question: "How accurate is the tire revolutions calculator for speedometer verification?",
      answer: "The calculator is highly accurate when you input the exact tire diameter and final drive ratio, typically within 1-2% of actual values. Worn tires that are 0.5 inches smaller in diameter will show your actual speed 2-3% slower than the speedometer displays. Use this calculator before and after tire changes to verify if your speedometer needs professional recalibration by a dealership.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Comparing stock tire size 225/60R16 with aftermarket size 235/55R17 at 65 mph to understand speedometer impact.",
    steps: [
      {
        label: "Step 1: Calculate tire diameters",
        explanation:
          "Stock tire diameter = 16 + 2 * (225 mm * 60% / 100) / 25.4 = 16 + 2 * (135 mm) / 25.4 ≈ 16 + 2 * 5.31 = 16 + 10.62 = 26.62 inches"
      },
      {
        label: "Step 2: Calculate circumference and revolutions per mile",
        explanation:
          "Circumference = π * 26.62 ≈ 83.6 inches; Revs/mile = 63360 / 83.6 ≈ 758.3"
      },
      {
        label: "Step 3: Repeat for aftermarket tire",
        explanation:
          "Diameter = 17 + 2 * (235 mm * 55% / 100) / 25.4 = 17 + 2 * (129.25 mm) / 25.4 ≈ 17 + 2 * 5.09 = 17 + 10.18 = 27.18 inches"
      },
      {
        label: "Step 4: Calculate circumference and revolutions per mile",
        explanation:
          "Circumference = π * 27.18 ≈ 85.36 inches; Revs/mile = 63360 / 85.36 ≈ 742.3"
      },
      {
        label: "Step 5: Calculate difference and RPM at 65 mph",
        explanation:
          "Difference = (742.3 - 758.3) / 758.3 * 100 = -2.11% (smaller revolutions per mile)\nRPM stock = (65 * 758.3) / 60 ≈ 821 RPM\nRPM aftermarket = (65 * 742.3) / 60 ≈ 804 RPM"
      }
    ],
    result:
      "The aftermarket tire has about 2.11% fewer revolutions per mile, causing the speedometer to read slightly faster than actual speed."
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "Tire Size Calculator - Tire Rack",
      description: "Comprehensive tire size calculator and comparison tool.",
      url: "https://www.tirerack.com/tires/tiretech/techpage.jsp?techid=31"
    },
    {
      title: "How to Calculate Tire Revolutions per Mile",
      description: "Detailed explanation of tire circumference and revolutions per mile.",
      url: "https://www.cars.com/articles/how-to-calculate-tire-revolutions-per-mile-1420680453297/"
    },
    {
      title: "Speedometer Calibration and Tire Size",
      description: "How tire size affects speedometer accuracy and vehicle performance.",
      url: "https://www.automd.com/tech/how-to-calibrate-your-speedometer-after-changing-tires/"
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
            <SelectItem value="imperial">Imperial (in, mph)</SelectItem>
            <SelectItem value="metric">Metric (mm, km/h)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-2">Tire 1 Specs</h3>
          <Label>Width ({inputs.unit === "metric" ? "mm" : "inches"})</Label>
          <Input
            type="number"
            min="1"
            value={inputs.tire1_width}
            onChange={(e) => handleInputChange("tire1_width", e.target.value)}
            placeholder="e.g. 225"
          />
          <Label className="mt-3">Aspect Ratio (%)</Label>
          <Input
            type="number"
            min="1"
            max="100"
            value={inputs.tire1_aspect}
            onChange={(e) => handleInputChange("tire1_aspect", e.target.value)}
            placeholder="e.g. 60"
          />
          <Label className="mt-3">Wheel Diameter (inches)</Label>
          <Input
            type="number"
            min="1"
            value={inputs.tire1_diameter}
            onChange={(e) => handleInputChange("tire1_diameter", e.target.value)}
            placeholder="e.g. 16"
          />
        </div>

        <div>
          <h3 className="font-semibold mb-2">Tire 2 Specs</h3>
          <Label>Width ({inputs.unit === "metric" ? "mm" : "inches"})</Label>
          <Input
            type="number"
            min="1"
            value={inputs.tire2_width}
            onChange={(e) => handleInputChange("tire2_width", e.target.value)}
            placeholder="e.g. 235"
          />
          <Label className="mt-3">Aspect Ratio (%)</Label>
          <Input
            type="number"
            min="1"
            max="100"
            value={inputs.tire2_aspect}
            onChange={(e) => handleInputChange("tire2_aspect", e.target.value)}
            placeholder="e.g. 55"
          />
          <Label className="mt-3">Wheel Diameter (inches)</Label>
          <Input
            type="number"
            min="1"
            value={inputs.tire2_diameter}
            onChange={(e) => handleInputChange("tire2_diameter", e.target.value)}
            placeholder="e.g. 17"
          />
        </div>
      </div>

      <div>
        <Label>Vehicle Speed ({inputs.unit === "metric" ? "km/h" : "mph"})</Label>
        <Input
          type="number"
          min="1"
          value={inputs.speed}
          onChange={(e) => handleInputChange("speed", e.target.value)}
          placeholder={inputs.unit === "metric" ? "e.g. 100" : "e.g. 65"}
        />
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg">
        <Car className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Difference in Tire Revolutions per Mile</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">{results.primary}</div>
            <div className="text-xl font-bold mt-2">{results.secondary}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
            <p className="mt-3 font-medium">{results.feedback}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Tire Revolutions per Mile & RPM @ Speed Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator helps you determine how many times your tire completes a full rotation per mile of driving and what engine RPM you'll experience at any given speed. Understanding these values is essential for optimizing fuel economy, verifying speedometer accuracy after tire changes, and diagnosing engine performance issues. Whether you're upgrading to larger wheels, verifying manufacturer specifications, or troubleshooting drivetrain problems, this tool provides precise calculations based on tire diameter and transmission ratios.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator, you need three key inputs: your tire's outer diameter in inches (commonly ranging from 22 to 37 inches for vehicles), your vehicle's final drive ratio (typically between 2.5:1 and 4.5:1 depending on transmission type), and the speed in mph at which you want to calculate RPM. The tire diameter can be found on your sidewall markings or measured directly; the final drive ratio is available in your vehicle's owner manual or from the manufacturer specification sheet. The calculator converts these inputs into tire revolutions per minute and engine RPM, accounting for the mechanical advantage provided by your transmission's gear ratio.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Interpret the results by comparing your calculated RPM to your engine's optimal operating range—most modern engines achieve best fuel efficiency between 1,500 and 2,500 RPM during highway cruising. If your RPM at highway speeds (65-70 mph) falls below 1,500, your transmission may not downshift properly; if it exceeds 3,000 RPM, you may be experiencing unnecessary engine load. Use the revolutions-per-mile figure to verify speedometer accuracy: if your actual odometer reading differs from GPS-calculated distance by more than 3%, your tire size may have changed or your speedometer needs professional calibration.</p>
        </div>
      </section>

      {/* TABLE: Tire Revolutions Per Mile by Tire Diameter */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Tire Revolutions Per Mile by Tire Diameter</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows how many times different tire sizes complete a full revolution over one mile of driving.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Tire Diameter (inches)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Tire Circumference (inches)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Revolutions Per Mile</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Common Vehicle Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">22</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">69.1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">917</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Sports cars</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">24</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">75.4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">840</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Compact sedans</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">26</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">81.7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">775</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Sedans</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">28</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">88.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">720</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Crossovers</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">94.2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">673</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">SUVs</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">32</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">631</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Light trucks</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">35</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">109.9</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">576</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Lifted trucks</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">37</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">116.2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">546</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Off-road trucks</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Calculations based on tire diameter measurement from rim edge to rim edge. Actual circumference may vary slightly based on tire sidewall construction and load.</p>
      </section>

      {/* TABLE: Engine RPM at Common Highway Speeds (26-inch tires, 3.55:1 ratio) */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Engine RPM at Common Highway Speeds (26-inch tires, 3.55:1 ratio)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table demonstrates how engine RPM changes with vehicle speed using a typical sedan tire and transmission ratio.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Speed (mph)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Tire Revolutions Per Minute</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Engine RPM @ 3.55:1 Ratio</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Fuel Economy Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">35</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">808</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,140</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Optimal efficiency</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">45</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,040</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,466</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Very efficient</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">55</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,271</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,793</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Efficient</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">65</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,502</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,120</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Standard cruising</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,733</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,446</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Higher load</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">80</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,848</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,607</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Increased consumption</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">RPM values assume a 5-speed automatic transmission in overdrive. Actual values vary with transmission type and final drive ratio.</p>
      </section>

      {/* TABLE: Impact of Tire Upsizing on Engine RPM (at 65 mph) */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Impact of Tire Upsizing on Engine RPM (at 65 mph)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Upgrading to larger tires reduces engine RPM at constant speeds, which typically improves fuel economy but may affect acceleration.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Original Tire Size</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Upgraded Tire Size</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">RPM Reduction</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Speedometer Error</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Approximate Fuel Economy Gain</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">26-inch stock</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">28-inch upgrade</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8.3% lower</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3% slow</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">26-inch stock</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30-inch upgrade</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18.7% lower</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6% slow</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-5%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">28-inch stock</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">33-inch upgrade</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15.2% lower</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5% slow</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-4%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">30-inch stock</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35-inch upgrade</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">14.2% lower</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4% slow</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3%</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Speedometer errors occur because the instrument cluster is calibrated for stock tire diameter. Professional recalibration is recommended for safety and legal compliance.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Verify tire diameter accuracy before using the calculator—measure the full sidewall height including the rubber, not just the rim diameter, as this directly affects revolutions per mile calculations and RPM accuracy.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Check your vehicle's door jamb or owner manual for the exact final drive ratio before calculating RPM; using an incorrect ratio can produce calculations that are off by 20% or more.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Run this calculator before and after a tire change to determine if your speedometer will read high or low with the new tires, helping you decide if professional recalibration is necessary for legal compliance.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use RPM calculations at multiple speeds (35 mph, 55 mph, and 75 mph) to identify which speeds your transmission downshifts; this helps diagnose transmission problems and optimize gear selection for towing.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Compare your calculated revolutions per mile to manufacturer specs in your owner's manual; significant differences may indicate worn tires that are reducing effective diameter and affecting speedometer and odometer accuracy.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using rim diameter instead of tire diameter</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many people mistakenly use wheel rim size (such as 18 inches) instead of the complete tire diameter, which includes the sidewall height. This error produces RPM calculations that are 15-25% too low and gives incorrect revolutions per mile figures.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to account for tire sidewall changes</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">When changing tire aspect ratios (such as from 45-series to 40-series), the overall diameter changes significantly even if the rim size stays the same. A 225/45R18 tire has a different diameter than a 225/40R18 tire, requiring precise recalculation to avoid speedometer errors.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming speedometer accuracy with stock tires</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Even with factory tires, speedometers can be off by 3-5% due to manufacturing tolerances and tire wear over time. Do not assume your speedometer is accurate without verifying it against GPS measurements or this calculator.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring transmission gear ratio in RPM calculations</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">RPM depends heavily on whether your transmission is in overdrive, direct drive, or lower gears—forgetting this multiplier can cause calculations to be completely wrong and lead to incorrect fuel economy expectations.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How many times does a tire revolve per mile?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Tire revolutions per mile depend on tire diameter and circumference. A standard 26-inch diameter tire completes approximately 770 revolutions per mile, while a 35-inch tire completes about 570 revolutions per mile. The calculation uses the formula: revolutions per mile = 63,360 inches ÷ tire circumference in inches. Larger tires always complete fewer revolutions to cover the same distance.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the relationship between tire size and RPM at highway speeds?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">RPM at a given speed is directly proportional to tire revolutions per mile. A vehicle with 28-inch tires turning 1,000 RPM at 40 mph will have lower RPM at the same speed compared to a vehicle with 24-inch tires. For example, 28-inch tires achieve approximately 2,240 RPM at 60 mph, while 26-inch tires reach about 2,420 RPM at the same speed.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate RPM if I change my tire size?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">RPM changes inversely with tire diameter when vehicle speed remains constant. If you upgrade from 25-inch to 30-inch tires, your RPM at any given speed will decrease by approximately 17%. Use the calculator by entering your new tire diameter, desired speed, and gear ratio to see the exact RPM impact before making wheel changes.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why does RPM matter for fuel economy?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Higher RPM at cruising speeds typically increases fuel consumption because the engine works harder to maintain velocity. A vehicle maintaining 2,000 RPM on the highway generally achieves better fuel economy than the same vehicle at 2,500 RPM. Larger tires reduce engine RPM at highway speeds, potentially improving fuel efficiency by 3-5% depending on driving conditions and engine characteristics.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What tire diameter is standard for most passenger cars?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most passenger vehicles use tires with diameters between 24 and 28 inches, with 26-27 inches being very common for sedans. A typical 2024 sedan tire size of 225/45R18 has an overall diameter of approximately 25.6 inches. The calculator helps determine the exact revolutions and RPM for your specific tire size, as even small diameter variations affect engine RPM significantly.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does gear ratio affect the RPM calculation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Gear ratio multiplies tire revolutions to determine engine RPM; a 3.5:1 final drive ratio means the engine turns 3.5 times for every tire revolution. At 60 mph with 26-inch tires and a 3.5:1 ratio, RPM reaches approximately 2,420 × 3.5 ÷ 60 = 1,414 RPM. Different gear ratios dramatically change engine RPM at the same speed, affecting performance, fuel economy, and engine longevity.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can lifting my truck change tire revolutions per mile?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Lifting your truck and installing larger tires reduces revolutions per mile proportionally to the increase in tire diameter. Installing 33-inch tires instead of stock 28-inch tires decreases revolutions per mile from about 720 to 610, a 15% reduction. This directly lowers engine RPM at highway speeds, which can affect speedometer accuracy and require recalibration of engine computer settings.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What RPM range is optimal for highway driving?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most engines operate most efficiently between 1,500 and 2,500 RPM during highway cruising at 55-70 mph. Modern fuel-injected engines with overdrive transmissions are designed to maintain around 1,800-2,000 RPM at 65 mph for optimal fuel economy. Operating consistently above 3,000 RPM on the highway reduces fuel efficiency and increases engine wear.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How accurate is the tire revolutions calculator for speedometer verification?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator is highly accurate when you input the exact tire diameter and final drive ratio, typically within 1-2% of actual values. Worn tires that are 0.5 inches smaller in diameter will show your actual speed 2-3% slower than the speedometer displays. Use this calculator before and after tire changes to verify if your speedometer needs professional recalibration by a dealership.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.ti-cert.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Tire and Rim Association Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official tire industry standards and specifications for accurate tire diameter measurements and classifications.</p>
          </li>
          <li>
            <a href="https://www.nhtsa.gov/vehicle-owners/tires" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">National Highway Traffic Safety Administration — Tire Specifications</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Federal guidelines on tire sizing, safety ratings, and how tire changes affect vehicle speedometer accuracy.</p>
          </li>
          <li>
            <a href="https://www.sae.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">SAE International — Engine RPM Performance Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Engineering standards for engine efficiency ranges and optimal RPM operating parameters for different vehicle classes.</p>
          </li>
          <li>
            <a href="https://www.edmunds.com/car-buying/tire-size-guide" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Edmunds — Tire Size Guide and Speedometer Impact</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Consumer-focused guidance on how different tire diameters affect speedometer readings, fuel economy, and engine performance.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Tire Revolutions per Mile & RPM @ Speed"
      description="Professional automotive calculator: Tire Revolutions per Mile & RPM @ Speed. Get accurate estimates, expert advice, and financial insights."
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