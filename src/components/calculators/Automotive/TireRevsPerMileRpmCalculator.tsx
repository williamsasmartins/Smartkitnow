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
    let tire1_dia_in = d1;
    let tire2_dia_in = d2;
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
      question: "How do tire revolutions per mile affect vehicle speedometer accuracy?",
      answer:
        "Tire revolutions per mile directly influence the accuracy of your vehicle's speedometer and odometer. If you change tire sizes, the number of revolutions per mile changes, causing your speedometer to read faster or slower than your actual speed. This calculator helps you understand the difference so you can adjust or recalibrate your speedometer accordingly."
    },
    {
      question: "Why is RPM at speed important for tire comparison?",
      answer:
        "RPM at a given speed indicates how many times the tire rotates per minute when the vehicle is moving at that speed. Comparing RPMs between two tires helps assess how the change in tire size affects engine load, gearing, and speedometer readings, which is crucial for performance tuning and vehicle safety."
    },
    {
      question: "Can I use this calculator for metric and imperial units?",
      answer:
        "Yes, the calculator supports both metric and imperial units. Enter tire width in millimeters and speed in km/h for metric, or width in inches and speed in mph for imperial. The calculator automatically converts measurements to provide accurate comparisons."
    },
    {
      question: "What inputs do I need to provide for each tire?",
      answer:
        "You need to input three key specifications for each tire: the width (in mm or inches), the aspect ratio (percentage of width), and the wheel diameter (in inches). Additionally, input the vehicle speed to calculate RPM at that speed."
    },
    {
      question: "What does a large percentage difference in revolutions per mile indicate?",
      answer:
        "A large percentage difference means the two tires have significantly different diameters, which can affect vehicle handling, speedometer accuracy, and transmission performance. It's generally recommended to keep tire size differences within 3% to avoid adverse effects."
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
      {/* 1. HOW TO USE */}
      <section id="how-to-use" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to use this calculator</h2>
        <ol className="list-decimal pl-5 space-y-3 text-slate-600 dark:text-slate-400">
          <li>
            <strong>Step 1:</strong> Select your preferred unit system: Imperial (inches, mph) or Metric (millimeters, km/h).
          </li>
          <li>
            <strong>Step 2:</strong> Enter the tire specifications for Tire 1: width, aspect ratio, and wheel diameter.
          </li>
          <li>
            <strong>Step 3:</strong> Enter the tire specifications for Tire 2 in the same units.
          </li>
          <li>
            <strong>Step 4:</strong> Input the vehicle speed at which you want to calculate the RPM.
          </li>
          <li>
            <strong>Step 5:</strong> Click the "Calculate" button to see the percentage difference in revolutions per mile and RPM values.
          </li>
        </ol>
      </section>

      {/* 2. COMPLETE GUIDE */}
      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to Tire Revolutions per Mile & RPM @ Speed
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Understanding tire revolutions per mile is crucial for vehicle performance, speedometer accuracy, and overall driving experience. The number of revolutions a tire makes per mile depends on its circumference, which is determined by the tire's diameter. The diameter itself is a combination of the wheel diameter and the tire's sidewall height, which is calculated from the tire width and aspect ratio.
          </p>
          <p>
            This calculator allows you to compare two different tire sizes by calculating their revolutions per mile and the RPM at a given speed. By inputting the tire width, aspect ratio, and wheel diameter for each tire, the calculator computes the overall diameter and circumference, then determines how many times the tire rotates per mile. It also calculates the RPM at your specified speed, which helps you understand how changing tire sizes affects engine and drivetrain behavior.
          </p>
          <p>
            When changing tire sizes, even small differences in diameter can lead to significant changes in speedometer readings and vehicle dynamics. A difference greater than 3% in revolutions per mile can cause inaccurate speedometer readings and may affect transmission shift points or ABS system calibration. This tool helps you quantify those differences so you can make informed decisions about tire upgrades or replacements.
          </p>
          <p>
            Additionally, the calculator supports both imperial and metric units, making it versatile for users worldwide. By understanding these calculations, automotive enthusiasts and professionals can ensure optimal vehicle performance and safety.
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
            <strong>1. Mixing units:</strong> Entering tire width in millimeters but wheel diameter in centimeters or inches without conversion leads to incorrect results. Always ensure consistent units based on the selected system.
          </p>
          <p>
            <strong>2. Ignoring aspect ratio:</strong> The aspect ratio is critical for calculating sidewall height. Omitting or entering incorrect values will skew diameter and circumference calculations.
          </p>
          <p>
            <strong>3. Using tire diameter instead of wheel diameter:</strong> The wheel diameter is the rim size, not the overall tire diameter. Using the wrong value will produce inaccurate revolutions per mile.
          </p>
          <p>
            <strong>4. Not considering speed units:</strong> Speed must be entered in mph for imperial or km/h for metric. Incorrect speed units will affect RPM calculations.
          </p>
          <p>
            <strong>5. Large tire size differences:</strong> Installing tires with more than 3% difference in revolutions per mile can cause speedometer errors and affect vehicle safety systems.
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
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
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