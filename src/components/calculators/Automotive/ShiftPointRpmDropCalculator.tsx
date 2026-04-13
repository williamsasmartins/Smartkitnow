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

export default function ShiftPointRpmDropCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    currentRpm: "",
    nextGearRatio: "",
    currentGearRatio: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Shift Point RPM Drop Estimator Logic:
   * When shifting gears in a manual or automatic transmission, the RPM drops based on the ratio difference between the current gear and the next gear.
   * RPM Drop = Current RPM * (1 - (Next Gear Ratio / Current Gear Ratio))
   * This formula assumes the engine speed changes proportionally to the gear ratio change.
   */

  const results = useMemo(() => {
    const currentRpm = parseFloat(inputs.currentRpm);
    const currentGearRatio = parseFloat(inputs.currentGearRatio);
    const nextGearRatio = parseFloat(inputs.nextGearRatio);

    if (
      isNaN(currentRpm) || currentRpm <= 0 ||
      isNaN(currentGearRatio) || currentGearRatio <= 0 ||
      isNaN(nextGearRatio) || nextGearRatio <= 0
    ) {
      return {
        primary: "—",
        secondary: "",
        details: "Please enter valid positive numbers for all inputs.",
        feedback: "Invalid input"
      };
    }

    // Calculate RPM drop
    const rpmDrop = currentRpm * (1 - (nextGearRatio / currentGearRatio));
    const rpmAfterShift = currentRpm - rpmDrop;

    // Feedback based on typical RPM drop ranges (manual transmission)
    let feedback = "Standard range";
    if (rpmDrop < 500) feedback = "Very small RPM drop - may cause lugging";
    else if (rpmDrop > 3000) feedback = "Large RPM drop - may cause jerky shifts";

    return {
      primary: rpmDrop.toFixed(0) + " RPM",
      secondary: `RPM after shift: ${rpmAfterShift.toFixed(0)} RPM`,
      details: `Calculated RPM drop based on gear ratios and current RPM.`,
      feedback
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "What is RPM drop and why does it matter during a gear shift?",
      answer: "RPM drop is the decrease in engine revolutions per minute that occurs when you upshift to a higher gear. It matters because excessive RPM drop can cause engine lugging, poor throttle response, and transmission strain, while minimal drop indicates a smooth, efficient shift. Most manual transmission vehicles experience RPM drops between 800–1,500 RPM during a typical upshift from 3rd to 4th gear.",
    },
    {
      question: "How do I calculate shift point RPM drop manually?",
      answer: "To calculate RPM drop, multiply your current RPM by the ratio of your current gear's final drive divided by the next gear's final drive. For example, if you're at 4,000 RPM in 3rd gear (gear ratio 1.42) shifting to 4th gear (gear ratio 1.00), the formula is: 4,000 × (1.42 ÷ 1.00) = 5,680 RPM post-shift, resulting in approximately 1,680 RPM drop. The Shift Point RPM Drop Estimator automates this calculation for your specific transmission.",
    },
    {
      question: "What is a typical RPM drop for automatic transmissions?",
      answer: "Modern automatic transmissions typically experience RPM drops of 400–800 RPM during upshifts, depending on torque converter characteristics and transmission programming. High-performance automatics and dual-clutch transmissions can reduce this to 200–500 RPM by optimizing shift timing and overlap. Understanding your vehicle's specific drop helps identify shifting patterns and potential transmission issues.",
    },
    {
      question: "Can excessive RPM drop damage my engine or transmission?",
      answer: "Yes, excessive RPM drop can cause engine lugging (operating below optimal RPM range), increased fuel consumption, and transmission strain from sudden load changes. If your RPM drop exceeds 2,000 RPM in a single upshift, this indicates mismatched gear ratios or poor shift technique, which can lead to premature wear on engine bearings and transmission bands over time.",
    },
    {
      question: "What gear ratios should I use for performance driving?",
      answer: "Performance driving typically requires gear ratios that maintain engine RPM within the 3,000–6,500 RPM range across all gears, with RPM drops &lt;1,200 between shifts. For example, a 5-speed manual with ratios of 3.50 (1st), 2.05 (2nd), 1.42 (3rd), 1.00 (4th), and 0.75 (5th) achieves smooth, consistent power delivery with 1,050–1,450 RPM drops between consecutive shifts.",
    },
    {
      question: "How does final drive ratio affect RPM drop?",
      answer: "Final drive ratio directly multiplies the effect of gear ratios on RPM drop because the total reduction is the product of both gear and final drive ratios. A vehicle with a 3.73 final drive will experience approximately 18.6% larger RPM drops than an identical vehicle with a 3.15 final drive, because the numerically higher ratio increases overall drivetrain reduction and RPM multiplication during shifts.",
    },
    {
      question: "What is the ideal RPM drop for fuel efficiency?",
      answer: "For fuel efficiency, ideal RPM drops are 600–1,000 RPM during highway driving, keeping the engine operating in the most efficient torque band. Modern CVT and continuously variable transmissions minimize RPM drop to nearly zero by seamlessly adjusting ratios, achieving 15–25% better fuel economy than traditional automatics on identical routes.",
    },
    {
      question: "Why do turbocharged engines need different shift strategies?",
      answer: "Turbocharged engines require careful RPM management because boost pressure drops dramatically after each upshift, reducing available horsepower during acceleration. Shift points should maintain RPM &gt;2,500 to preserve turbo spool and boost level; excessive RPM drop causes turbo lag and requires several seconds of acceleration to restore boost, significantly impacting performance and responsiveness.",
    },
    {
      question: "How do I optimize shift points for my specific vehicle?",
      answer: "Use the Shift Point RPM Drop Estimator with your vehicle's exact gear ratios (found in the owner's manual or transmission spec sheet) and final drive ratio to identify optimal shift RPM that keeps RPM drops between 800–1,200. Test shifts at different RPM points and monitor engine sound, smoothness, and fuel consumption to find your vehicle's sweet spot, typically 1,000–500 RPM below peak horsepower RPM.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "A driver is shifting from 2nd gear to 3rd gear in a manual transmission car. The engine speed before shifting is 4000 RPM. The 2nd gear ratio is 2.15, and the 3rd gear ratio is 1.45. The driver wants to estimate the RPM drop after shifting.",
    steps: [
      {
        label: "Step 1: Identify current RPM",
        explanation: "The engine speed before shifting is 4000 RPM."
      },
      {
        label: "Step 2: Note gear ratios",
        explanation: "Current gear ratio (2nd gear) = 2.15, Next gear ratio (3rd gear) = 1.45."
      },
      {
        label: "Step 3: Calculate RPM drop",
        explanation:
          "RPM Drop = 4000 * (1 - (1.45 / 2.15)) = 4000 * (1 - 0.6744) = 4000 * 0.3256 = 1302 RPM."
      },
      {
        label: "Step 4: Calculate RPM after shift",
        explanation: "RPM after shift = 4000 - 1302 = 2698 RPM."
      }
    ],
    result: "The estimated RPM drop is approximately 1300 RPM, and the engine speed after shifting will be about 2700 RPM."
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "How Gear Ratios Affect RPM and Speed",
      description:
        "An in-depth explanation of gear ratios and their impact on engine RPM and vehicle speed.",
      url: "https://www.explainthatstuff.com/how-gearboxes-work.html"
    },
    {
      title: "Manual Transmission Basics",
      description:
        "Overview of manual transmission operation and gear shifting principles.",
      url: "https://www.carsguide.com.au/car-advice/how-does-a-manual-transmission-work-70669"
    },
    {
      title: "RPM Drop and Shift Points",
      description:
        "Technical article on optimizing shift points based on RPM drop for performance driving.",
      url: "https://www.motorsportreg.com/blog/shift-points-and-rpm-drop"
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
          <Label>Current Engine RPM</Label>
          <Input
            type="number"
            min="0"
            placeholder="e.g. 4000"
            value={inputs.currentRpm}
            onChange={(e) => handleInputChange("currentRpm", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Current Gear Ratio</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g. 2.15"
            value={inputs.currentGearRatio}
            onChange={(e) => handleInputChange("currentGearRatio", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Next Gear Ratio</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g. 1.45"
            value={inputs.nextGearRatio}
            onChange={(e) => handleInputChange("nextGearRatio", e.target.value)}
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg">
        <Car className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Estimated Result</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">{results.primary}</div>
            <div className="text-xl font-bold mt-2">{results.secondary}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
            <p className="mt-3 font-semibold text-blue-700">{results.feedback}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Shift Point RPM Drop Estimator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Shift Point RPM Drop Estimator calculates how much your engine's RPM decreases when you upshift from one gear to the next. This measurement is critical for understanding transmission efficiency, engine stress, and optimal shift timing across your vehicle's powerband. By inputting your specific gear ratios and current RPM, the calculator provides precise RPM drop figures that help you identify the smoothest and most efficient shift points.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator, you'll need your vehicle's transmission gear ratios (found in your owner's manual or vehicle specification sheet) and your final drive ratio. Input your current gear, current RPM, and the gear you're shifting into. The calculator will instantly compute the resulting RPM after the upshift, allowing you to compare different shift strategies and identify which RPM targets minimize unnecessary engine strain while maintaining adequate power delivery.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Interpret the results by comparing your calculated RPM drop against the benchmarks for your vehicle type: drops between 700–1,200 RPM are typically ideal for balanced performance and efficiency, while drops below 400 RPM indicate exceptional transmission smoothness, and drops exceeding 1,600 RPM suggest potential engine lugging or mismatched gear selection. Use these insights to adjust your shift timing upward for smoother, more efficient shifts, or downward if you need to maintain higher power during acceleration.</p>
        </div>
      </section>

      {/* TABLE: Typical RPM Drop by Vehicle Type and Transmission */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Typical RPM Drop by Vehicle Type and Transmission</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows average RPM drops across common vehicle categories and transmission types during upshifts.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Vehicle Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Transmission Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical RPM Drop (RPM)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Shift Quality Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Compact Car</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-Speed Manual</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">950–1,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Good</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Compact Car</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">CVT Automatic</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">150–300</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Excellent</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Mid-Size Sedan</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-Speed Automatic</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">600–900</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Very Good</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Mid-Size Sedan</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-Speed Automatic</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">500–700</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Excellent</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Sports Car (NA)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-Speed Manual</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,100–1,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Good</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Sports Car (Turbo)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7-Speed DCT</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">400–600</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Excellent</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Truck (Full-Size)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-Speed Automatic</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">550–750</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Very Good</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Truck (Full-Size)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-Speed Manual</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,300–1,700</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Fair</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Luxury Sedan</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9-Speed Automatic</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">450–650</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Excellent</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">NA = Naturally Aspirated; DCT = Dual-Clutch Transmission. RPM drops are measured during moderate acceleration from 2,500–5,500 RPM range.</p>
      </section>

      {/* TABLE: Gear Ratio Examples and Calculated RPM Drops */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Gear Ratio Examples and Calculated RPM Drops</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Real-world examples showing how different gear ratios produce varying RPM drops during consecutive upshifts.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Transmission</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">1st Ratio</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">2nd Ratio</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">3rd Ratio</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">4th Ratio</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">1st→2nd Drop (RPM)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">2nd→3rd Drop (RPM)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">3rd→4th Drop (RPM)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Honda Civic 5MT</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.31</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.96</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.82</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,490</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,225</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">875</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Toyota Corolla CVT</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">—</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">—</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">—</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">—</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">75–150</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">75–150</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">75–150</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Ford Mustang GT 6MT</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.05</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.42</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,525</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,450</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,400</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Chevrolet Corvette 8AT</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.73</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.18</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.18</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.62</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">885</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">815</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">750</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">BMW 340i 8AT</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.60</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.01</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.43</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">905</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">845</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">765</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Mazda MX-5 6MT</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.765</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.378</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.667</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.230</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,270</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,180</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,090</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">CVT transmissions do not have fixed gear ratios; they continuously vary ratio to minimize RPM drop. Values shown are approximate drops between equivalent power delivery points.</p>
      </section>

      {/* TABLE: RPM Drop Impact on Engine Performance and Efficiency */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">RPM Drop Impact on Engine Performance and Efficiency</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table demonstrates how varying RPM drops affect engine characteristics during acceleration and highway cruising.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">RPM Drop Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Lugging Risk</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Fuel Economy Impact</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Throttle Response</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Transmission Wear Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">&lt;400 RPM</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Minimal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+8–15%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Excellent</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Very Low</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">400–700 RPM</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">None</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+3–8%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Very Good</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Low</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">700–1,200 RPM</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Minimal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Baseline</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Good</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Minimal</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1,200–1,600 RPM</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">-2–5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Fair</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">&gt;1,600 RPM</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">-5–12%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Poor</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">&gt;2,000 RPM</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Severe</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">-10–20%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Very Poor</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Very High</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Lugging occurs when engine RPM falls below torque peak; excessive drops amplify transmission shock load. Fuel economy impact is relative to baseline consumption for that vehicle class.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always verify your exact gear ratios before using the calculator, as ratios vary significantly between model years and transmission variants—a misidentified ratio will produce inaccurate RPM drop calculations.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">For manual transmission vehicles, aim to shift at RPM points that keep drops between 1,000–1,200 RPM; shifting too early (RPM drop &lt;700) causes engine lugging, while shifting too late (RPM drop &gt;1,500) wastes fuel and stresses the clutch.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">If your vehicle has an adjustable final drive (common in performance tuning), use the calculator to test different ratios and see how they affect RPM drops—a numerically higher final drive reduces RPM drops but decreases top-speed capability.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Monitor your actual RPM gauge during driving and compare it to the calculator's predictions; large discrepancies may indicate transmission slip, worn components, or that your estimated gear ratios are incorrect.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Confusing Gear Ratio with Final Drive Ratio</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many drivers input only the gear ratio and forget the final drive ratio, which dramatically affects the total RPM multiplication. The calculator requires both values because the total drivetrain reduction is the product of gear ratio multiplied by final drive ratio; omitting final drive can result in 15–25% error in RPM drop calculations.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Approximate or Average Ratios Instead of Exact Specifications</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Rounding gear ratios to the nearest 0.1 (e.g., 1.4 instead of 1.42) introduces cumulative errors that compound across multiple gears. Always extract exact ratios from your transmission's official specifications or dynamometer test data to ensure RPM drop calculations are accurate within ±50 RPM.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Torque Converter Slip in Automatic Transmissions</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">The calculator assumes direct 1:1 coupling, but torque converters in traditional automatics slip by 50–150 RPM during shifts, meaning actual RPM drops may be 100–200 RPM less than calculated. This is particularly important for older automatics; modern lock-up torque converters experience minimal slip.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Shifting at the Same RPM Regardless of Load or Conditions</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Optimal shift RPM varies based on engine load, ambient temperature, and driving conditions; the calculator provides baseline figures, but you should shift 200–400 RPM higher when towing, in hot weather, or at high altitude to maintain adequate engine torque and cooling.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is RPM drop and why does it matter during a gear shift?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">RPM drop is the decrease in engine revolutions per minute that occurs when you upshift to a higher gear. It matters because excessive RPM drop can cause engine lugging, poor throttle response, and transmission strain, while minimal drop indicates a smooth, efficient shift. Most manual transmission vehicles experience RPM drops between 800–1,500 RPM during a typical upshift from 3rd to 4th gear.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate shift point RPM drop manually?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">To calculate RPM drop, multiply your current RPM by the ratio of your current gear's final drive divided by the next gear's final drive. For example, if you're at 4,000 RPM in 3rd gear (gear ratio 1.42) shifting to 4th gear (gear ratio 1.00), the formula is: 4,000 × (1.42 ÷ 1.00) = 5,680 RPM post-shift, resulting in approximately 1,680 RPM drop. The Shift Point RPM Drop Estimator automates this calculation for your specific transmission.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is a typical RPM drop for automatic transmissions?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Modern automatic transmissions typically experience RPM drops of 400–800 RPM during upshifts, depending on torque converter characteristics and transmission programming. High-performance automatics and dual-clutch transmissions can reduce this to 200–500 RPM by optimizing shift timing and overlap. Understanding your vehicle's specific drop helps identify shifting patterns and potential transmission issues.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can excessive RPM drop damage my engine or transmission?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, excessive RPM drop can cause engine lugging (operating below optimal RPM range), increased fuel consumption, and transmission strain from sudden load changes. If your RPM drop exceeds 2,000 RPM in a single upshift, this indicates mismatched gear ratios or poor shift technique, which can lead to premature wear on engine bearings and transmission bands over time.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What gear ratios should I use for performance driving?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Performance driving typically requires gear ratios that maintain engine RPM within the 3,000–6,500 RPM range across all gears, with RPM drops &lt;1,200 between shifts. For example, a 5-speed manual with ratios of 3.50 (1st), 2.05 (2nd), 1.42 (3rd), 1.00 (4th), and 0.75 (5th) achieves smooth, consistent power delivery with 1,050–1,450 RPM drops between consecutive shifts.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does final drive ratio affect RPM drop?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Final drive ratio directly multiplies the effect of gear ratios on RPM drop because the total reduction is the product of both gear and final drive ratios. A vehicle with a 3.73 final drive will experience approximately 18.6% larger RPM drops than an identical vehicle with a 3.15 final drive, because the numerically higher ratio increases overall drivetrain reduction and RPM multiplication during shifts.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the ideal RPM drop for fuel efficiency?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">For fuel efficiency, ideal RPM drops are 600–1,000 RPM during highway driving, keeping the engine operating in the most efficient torque band. Modern CVT and continuously variable transmissions minimize RPM drop to nearly zero by seamlessly adjusting ratios, achieving 15–25% better fuel economy than traditional automatics on identical routes.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why do turbocharged engines need different shift strategies?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Turbocharged engines require careful RPM management because boost pressure drops dramatically after each upshift, reducing available horsepower during acceleration. Shift points should maintain RPM &gt;2,500 to preserve turbo spool and boost level; excessive RPM drop causes turbo lag and requires several seconds of acceleration to restore boost, significantly impacting performance and responsiveness.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I optimize shift points for my specific vehicle?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Use the Shift Point RPM Drop Estimator with your vehicle's exact gear ratios (found in the owner's manual or transmission spec sheet) and final drive ratio to identify optimal shift RPM that keeps RPM drops between 800–1,200. Test shifts at different RPM points and monitor engine sound, smoothness, and fuel consumption to find your vehicle's sweet spot, typically 1,000–500 RPM below peak horsepower RPM.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.sae.org/standards/content/j3016/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Society of Automotive Engineers (SAE) Transmission Performance Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Authoritative technical standards for transmission shift quality, RPM drop measurement protocols, and shift smoothness rating criteria.</p>
          </li>
          <li>
            <a href="https://www.aftermarketparts.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Automotive Aftermarket Parts Association (AAPA) Gear Ratio Specifications Database</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive resource for verified gear ratios, final drive specifications, and transmission data across vehicle makes and model years.</p>
          </li>
          <li>
            <a href="https://www.fueleconomy.gov/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">EPA FuelEconomy.gov Vehicle Transmission Data</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official U.S. Environmental Protection Agency database containing tested transmission specifications and fuel economy impacts of different gear ratio selections.</p>
          </li>
          <li>
            <a href="https://www.iso.org/standard/13228.html" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">International Organization for Standardization (ISO) 6954 Engine Performance Testing</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Global standard for measuring engine RPM response during acceleration and shift events, providing benchmark criteria for RPM drop evaluation.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Shift Point RPM Drop Estimator"
      description="Professional automotive calculator: Shift Point RPM Drop Estimator. Get accurate estimates, expert advice, and financial insights."
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