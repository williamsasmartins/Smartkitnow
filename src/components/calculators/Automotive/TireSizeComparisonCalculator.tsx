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

export default function TireSizeComparisonCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    tire1_width: "",
    tire1_aspect: "",
    tire1_diameter: "",
    tire2_width: "",
    tire2_aspect: "",
    tire2_diameter: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Tire size format: Width / Aspect Ratio R Diameter
   * Example: 225/45R17
   * 
   * Calculation of overall tire diameter (in inches):
   * Diameter = Wheel Diameter + 2 * Sidewall Height
   * Sidewall Height = (Width * Aspect Ratio) / 100
   * Width is in mm, convert sidewall height to inches: 1 inch = 25.4 mm
   * 
   * Overall Diameter (inches) = Wheel Diameter + 2 * (Width * Aspect Ratio / 100) / 25.4
   */

  const results = useMemo(() => {
    const {
      tire1_width,
      tire1_aspect,
      tire1_diameter,
      tire2_width,
      tire2_aspect,
      tire2_diameter,
    } = inputs;

    // Validate inputs
    if (
      !tire1_width || !tire1_aspect || !tire1_diameter ||
      !tire2_width || !tire2_aspect || !tire2_diameter
    ) {
      return {
        primary: "0%",
        details: "Please enter all tire specs.",
        feedback: "Incomplete input"
      };
    }

    const w1 = parseFloat(tire1_width);
    const a1 = parseFloat(tire1_aspect);
    const d1 = parseFloat(tire1_diameter);

    const w2 = parseFloat(tire2_width);
    const a2 = parseFloat(tire2_aspect);
    const d2 = parseFloat(tire2_diameter);

    if (
      isNaN(w1) || isNaN(a1) || isNaN(d1) ||
      isNaN(w2) || isNaN(a2) || isNaN(d2) ||
      w1 <= 0 || a1 <= 0 || d1 <= 0 ||
      w2 <= 0 || a2 <= 0 || d2 <= 0
    ) {
      return {
        primary: "0%",
        details: "Invalid input values.",
        feedback: "Check inputs"
      };
    }

    // Calculate overall diameter for Tire 1
    const sidewall1 = (w1 * a1) / 100 / 25.4; // inches
    const overallDiameter1 = d1 + 2 * sidewall1;

    // Calculate overall diameter for Tire 2
    const sidewall2 = (w2 * a2) / 100 / 25.4; // inches
    const overallDiameter2 = d2 + 2 * sidewall2;

    // Calculate percentage difference (Tire 2 relative to Tire 1)
    const diffPercent = ((overallDiameter2 - overallDiameter1) / overallDiameter1) * 100;

    // Feedback based on difference
    let feedback = "Standard range";
    const absDiff = Math.abs(diffPercent);
    if (absDiff > 5) {
      feedback = "Significant size difference - may affect speedometer and handling";
    } else if (absDiff > 3) {
      feedback = "Moderate size difference - check vehicle compatibility";
    }

    return {
      primary: `${diffPercent.toFixed(2)}%`,
      details: `Tire 1 Diameter: ${overallDiameter1.toFixed(2)} in, Tire 2 Diameter: ${overallDiameter2.toFixed(2)} in`,
      feedback
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "What does tire size comparison tell me about my vehicle's performance?",
      answer: "A tire size comparison calculator helps you understand how changing tire dimensions affects your vehicle's speedometer accuracy, fuel economy, and handling characteristics. By comparing your current tire size to alternatives, you can see exact differences in rolling circumference, which directly impacts your vehicle's speed readings and odometer accuracy. For example, upgrading from 205/55R16 to 215/55R16 increases your rolling circumference by approximately 1.5%, meaning your actual speed is 1.5% faster than your speedometer indicates.",
    },
    {
      question: "How do tire width and aspect ratio affect the comparison results?",
      answer: "Tire width (the first number in the tire code) and aspect ratio (the second number) are the primary factors that determine overall tire diameter and rolling circumference. The aspect ratio represents the sidewall height as a percentage of the tire width; for instance, a 225/65R17 has a sidewall height of 65% of 225mm. When comparing a 225/65R17 to a 225/55R17, the aspect ratio difference creates a tire diameter variance of approximately 1.6 inches, significantly affecting speedometer readings and fuel efficiency.",
    },
    {
      question: "What is rolling circumference and why does it matter in tire comparison?",
      answer: "Rolling circumference is the distance your tire travels in one complete rotation, measured in inches or millimeters. This measurement directly affects your vehicle's speedometer, odometer, and transmission shift points; a tire with a larger circumference travels farther per rotation, causing your speedometer to read lower than your actual speed. For example, a tire with a 75-inch circumference versus a 72-inch circumference will cause approximately 4% speed reading differences.",
    },
    {
      question: "How much larger can I go with tire size without affecting my vehicle's warranty?",
      answer: "Most vehicle manufacturers allow tire size changes within a 3% variance of the original equipment tire's overall diameter without voiding the drivetrain warranty. A common guideline permits staying within a ±0.5-inch diameter difference from the factory tire size. Exceeding this threshold may void warranties and can cause transmission issues, suspension problems, and speedometer inaccuracies; always consult your vehicle's manual before upsizing.",
    },
    {
      question: "Does increasing tire size improve fuel economy?",
      answer: "Increasing tire size typically worsens fuel economy because larger tires have higher rolling resistance and increased weight. Upgrading from a 205/55R16 (approximately 24.9 inches in diameter) to a 225/65R17 (approximately 27.4 inches in diameter) can reduce fuel efficiency by 2-5% due to increased rotational mass and rolling resistance. Conversely, properly inflated tires at the manufacturer's recommended pressure improve fuel economy by 3-5%.",
    },
    {
      question: "What's the difference between load index and speed rating in tire size comparisons?",
      answer: "The load index is a numerical code representing the maximum weight a tire can support at its maximum recommended pressure, while the speed rating (a letter code like H, V, or Z) indicates the maximum speed the tire is safely rated for. For example, a tire with a load index of 91 can carry 1,356 pounds, and a V-rated tire is safe up to 149 mph. When comparing tire sizes, you must ensure the new tire's load and speed ratings meet or exceed your vehicle manufacturer's specifications to maintain safety and warranty coverage.",
    },
    {
      question: "How does changing tire size affect my speedometer accuracy?",
      answer: "Your speedometer is calibrated to your factory tire size's rolling circumference; larger tires cause your speedometer to read lower than your actual speed, while smaller tires cause it to read higher. A 5% increase in tire diameter (like switching from 215/60R16 to 225/60R17) results in approximately 5% speedometer error; at 60 mph, you'd actually be traveling about 63 mph. This inaccuracy can lead to unintentional speeding, affecting both safety and legal compliance.",
    },
    {
      question: "Can I use different tire sizes on my vehicle if I have all-wheel drive?",
      answer: "All-wheel drive (AWD) vehicles are more sensitive to tire size differences than two-wheel drive vehicles because mismatched tire diameters cause binding and increased stress on the differential and transfer case. Most manufacturers recommend that all four tires have matching sizes and tread depths within 2/32 inch of each other; a diameter variance exceeding 0.5 inches can damage AWD components and void warranty coverage. Always use identical tire sizes on AWD vehicles to prevent mechanical damage.",
    },
    {
      question: "What does the load index number mean when comparing tire sizes?",
      answer: "The load index is a two or three-digit number (typically ranging from 75 to 126+) that indicates the maximum weight capacity of a tire at its rated pressure. For example, a load index of 95 supports 1,521 pounds per tire, while a 105 rating supports 2,039 pounds per tire. When upgrading tire sizes, confirm the new tire's load index matches or exceeds the vehicle manufacturer's requirement, which is printed on the driver's side doorjamb; insufficient load rating can cause tire failure and safety hazards.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "A car owner wants to compare their current tires sized 205/55R16 with a potential upgrade to 225/50R17 to understand the size difference and its impact.",
    steps: [
      {
        label: "Step 1: Calculate Tire 1 overall diameter",
        explanation:
          "Sidewall height = (205 mm * 55%) / 100 = 112.75 mm. Convert to inches: 112.75 / 25.4 = 4.44 inches. Overall diameter = 16 inches + 2 * 4.44 inches = 24.88 inches."
      },
      {
        label: "Step 2: Calculate Tire 2 overall diameter",
        explanation:
          "Sidewall height = (225 mm * 50%) / 100 = 112.5 mm. Convert to inches: 112.5 / 25.4 = 4.43 inches. Overall diameter = 17 inches + 2 * 4.43 inches = 25.86 inches."
      },
      {
        label: "Step 3: Calculate percentage difference",
        explanation:
          "Difference = ((25.86 - 24.88) / 24.88) * 100 = 3.95%. This means Tire 2 is approximately 3.95% larger in diameter than Tire 1."
      }
    ],
    result:
      "The 3.95% increase in tire diameter may slightly affect speedometer accuracy and vehicle handling. It is within a moderate range but should be checked for compatibility."
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "Tire Size Calculator - Tire Rack",
      description: "Comprehensive tool for tire size comparison and vehicle fitment.",
      url: "https://www.tirerack.com/tires/tiretech/techpage.jsp?techid=1"
    },
    {
      title: "Understanding Tire Sizes - Bridgestone",
      description: "Official guide explaining tire size notation and measurements.",
      url: "https://www.bridgestonetire.com/tread-and-trend/drivers-ed/tire-sizing"
    },
    {
      title: "How to Calculate Tire Diameter - ThoughtCo",
      description: "Step-by-step explanation of tire diameter calculation.",
      url: "https://www.thoughtco.com/how-to-calculate-tire-diameter-534813"
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Tire 1 Width (mm)</Label>
          <Input
            type="number"
            min={1}
            value={inputs.tire1_width}
            onChange={(e) => handleInputChange("tire1_width", e.target.value)}
            placeholder="e.g. 225"
          />
          <Label>Tire 1 Aspect Ratio (%)</Label>
          <Input
            type="number"
            min={1}
            max={100}
            value={inputs.tire1_aspect}
            onChange={(e) => handleInputChange("tire1_aspect", e.target.value)}
            placeholder="e.g. 45"
          />
          <Label>Tire 1 Wheel Diameter (inches)</Label>
          <Input
            type="number"
            min={1}
            value={inputs.tire1_diameter}
            onChange={(e) => handleInputChange("tire1_diameter", e.target.value)}
            placeholder="e.g. 17"
          />
        </div>

        <div className="space-y-2">
          <Label>Tire 2 Width (mm)</Label>
          <Input
            type="number"
            min={1}
            value={inputs.tire2_width}
            onChange={(e) => handleInputChange("tire2_width", e.target.value)}
            placeholder="e.g. 235"
          />
          <Label>Tire 2 Aspect Ratio (%)</Label>
          <Input
            type="number"
            min={1}
            max={100}
            value={inputs.tire2_aspect}
            onChange={(e) => handleInputChange("tire2_aspect", e.target.value)}
            placeholder="e.g. 40"
          />
          <Label>Tire 2 Wheel Diameter (inches)</Label>
          <Input
            type="number"
            min={1}
            value={inputs.tire2_diameter}
            onChange={(e) => handleInputChange("tire2_diameter", e.target.value)}
            placeholder="e.g. 18"
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" onClick={() => {}}>
        <Car className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Estimated Difference</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">{results.primary}</div>
            <p className="text-sm font-semibold mt-2">{results.feedback}</p>
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Tire Size Comparison Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The tire size comparison calculator is a powerful tool that allows you to evaluate how changing your vehicle's tires affects critical performance metrics including speedometer accuracy, rolling circumference, overall diameter, and fuel efficiency. This calculator helps you make informed decisions before purchasing new tires, ensuring that your upgrade choices comply with manufacturer specifications and maintain your vehicle's warranty coverage. Understanding these metrics is essential for maintaining safety, legal compliance with speed limits, and optimal vehicle performance.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator, input your original tire size (found on your doorjamb placard, owner's manual, or current tire sidewall) and your desired replacement tire size using the standard tire code format (width/aspect ratio/diameter). The calculator processes the load index, speed rating, and dimensional data to generate precise comparisons. These inputs determine the rolling circumference, which is the foundation for all other comparison metrics including speedometer error calculations and odometer accuracy projections.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The results display your tire diameter change in inches, circumference change in inches, and the resulting speedometer error percentage at various speeds (typically 30, 60, and 80 mph). Use these results to determine if the size change falls within your vehicle manufacturer's acceptable variance range (usually ±0.5 inches for standard vehicles, ±0.25 inches for AWD). If your comparison shows excessive variance, consider alternative tire sizes that better match your original equipment specifications to maintain warranty coverage and optimal vehicle performance.</p>
        </div>
      </section>

      {/* TABLE: Common Tire Size Conversions and Diameter Changes */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Common Tire Size Conversions and Diameter Changes</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows how common tire size upgrades affect overall tire diameter and rolling circumference.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Original Size</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">New Size</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Diameter Change (inches)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Circumference Change (inches)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Speedometer Error at 60 mph</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">205/55R16</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">215/55R16</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+0.39</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+1.22</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+0.4 mph</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">225/60R17</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">235/60R17</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+0.39</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+1.22</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+0.4 mph</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">205/60R15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">215/65R15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+0.97</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+3.05</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+1.0 mph</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">235/65R17</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">245/70R17</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+1.18</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+3.71</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+1.2 mph</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">225/55R18</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">235/55R18</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+0.39</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+1.22</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+0.4 mph</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">195/65R15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">205/75R15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+1.77</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+5.56</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+1.8 mph</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">245/60R18</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">255/60R18</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+0.39</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+1.22</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+0.4 mph</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Speedometer error calculations based on standard tire pressure and construction. Always verify fitment with your vehicle manufacturer's specifications before purchasing new tires.</p>
      </section>

      {/* TABLE: Tire Load Index and Speed Rating Reference Chart */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Tire Load Index and Speed Rating Reference Chart</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This reference shows how load index numbers and speed ratings relate to tire weight capacity and maximum safe speeds.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Load Index</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Maximum Weight (lbs per tire)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Speed Rating</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Maximum Speed (mph)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">853</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">L</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">75</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">82</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,047</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">S</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">112</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">91</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,356</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">H</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">130</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">95</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,521</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">T</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">118</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,764</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">V</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">149</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">105</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,039</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">W</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">168</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">110</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,337</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Y</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">186</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">120</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,086</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Z</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">149+</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Load index and speed rating are always marked on the tire's sidewall. Ensure replacement tires meet or exceed the original equipment specifications found on your vehicle's doorjamb placard.</p>
      </section>

      {/* TABLE: Tire Size Variance Limits by Vehicle Type */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Tire Size Variance Limits by Vehicle Type</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows the manufacturer-recommended maximum tire diameter variance for different vehicle configurations.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Vehicle Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Maximum Diameter Variance</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Rolling Circumference Variance</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Warranty Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Two-Wheel Drive (FWD/RWD)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">±0.5 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">±3% circumference</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Generally covered</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">All-Wheel Drive (AWD)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">±0.25 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">±1.5% circumference</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">May void drivetrain warranty</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Four-Wheel Drive (4WD)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">±0.5 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">±3% circumference</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Generally covered if matched</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Luxury/Performance Vehicles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">±0.3 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">±2% circumference</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Often stricter than standard</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Always consult your vehicle's owner's manual and doorjamb placard for specific tire size approval. Exceeding manufacturer variance limits can affect speedometer accuracy, fuel economy, and transmission programming.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always verify the load index and speed rating of your replacement tires match or exceed the factory specifications listed on your driver's side doorjamb placard; insufficient ratings can cause tire failure and safety hazards.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use the calculator to stay within the manufacturer's recommended ±3% diameter variance for two-wheel drive vehicles and ±1.5% for all-wheel drive vehicles to avoid warranty issues and transmission recalibration needs.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Consider sidewall appearance and comfort when comparing tire sizes; larger diameter tires with lower aspect ratios (like 225/45R18) provide sportier handling but a harsher ride compared to sizes with higher aspect ratios (like 225/65R17).</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Recalibrate your vehicle's speedometer after an extreme tire size change exceeding ±5%; many modern vehicles store speedometer corrections that may need adjustment at your dealership if you significantly change tire dimensions.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Check clearance with your wheel and suspension components before purchasing plus-sized tires; a 1-inch diameter increase may cause rubbing on the suspension, fenders, or bumper at full lock turns.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Load Index Requirements</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many drivers upgrade to larger tire sizes without confirming the load index meets their vehicle's weight requirements, risking tire failure and blowouts. Always match or exceed the load index specification from your doorjamb placard to maintain safety and warranty coverage.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Exceeding Manufacturer Diameter Variance</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Changing tire diameter by more than 3% on standard vehicles or 1.5% on AWD vehicles can void drivetrain warranties, cause transmission shift point errors, and damage the differential. Use the calculator to ensure your size change stays within recommended tolerances.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming All-Wheel Drive Tolerates Size Mismatches</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">AWD vehicles are significantly more sensitive to tire diameter differences than two-wheel drive vehicles because mismatches cause differential binding and accelerated wear. Always use identical tire sizes on AWD vehicles, even if FWD vehicles would tolerate slight variations.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Neglecting Speedometer Accuracy Impact</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Larger tires cause your speedometer to read lower than your actual speed; upgrading from a 205/55R16 to a 225/60R17 can result in actual speeds 2-3% faster than displayed. This can inadvertently cause speeding violations and safety issues, so account for speedometer error in your comparison.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What does tire size comparison tell me about my vehicle's performance?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A tire size comparison calculator helps you understand how changing tire dimensions affects your vehicle's speedometer accuracy, fuel economy, and handling characteristics. By comparing your current tire size to alternatives, you can see exact differences in rolling circumference, which directly impacts your vehicle's speed readings and odometer accuracy. For example, upgrading from 205/55R16 to 215/55R16 increases your rolling circumference by approximately 1.5%, meaning your actual speed is 1.5% faster than your speedometer indicates.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do tire width and aspect ratio affect the comparison results?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Tire width (the first number in the tire code) and aspect ratio (the second number) are the primary factors that determine overall tire diameter and rolling circumference. The aspect ratio represents the sidewall height as a percentage of the tire width; for instance, a 225/65R17 has a sidewall height of 65% of 225mm. When comparing a 225/65R17 to a 225/55R17, the aspect ratio difference creates a tire diameter variance of approximately 1.6 inches, significantly affecting speedometer readings and fuel efficiency.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is rolling circumference and why does it matter in tire comparison?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Rolling circumference is the distance your tire travels in one complete rotation, measured in inches or millimeters. This measurement directly affects your vehicle's speedometer, odometer, and transmission shift points; a tire with a larger circumference travels farther per rotation, causing your speedometer to read lower than your actual speed. For example, a tire with a 75-inch circumference versus a 72-inch circumference will cause approximately 4% speed reading differences.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much larger can I go with tire size without affecting my vehicle's warranty?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most vehicle manufacturers allow tire size changes within a 3% variance of the original equipment tire's overall diameter without voiding the drivetrain warranty. A common guideline permits staying within a ±0.5-inch diameter difference from the factory tire size. Exceeding this threshold may void warranties and can cause transmission issues, suspension problems, and speedometer inaccuracies; always consult your vehicle's manual before upsizing.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does increasing tire size improve fuel economy?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Increasing tire size typically worsens fuel economy because larger tires have higher rolling resistance and increased weight. Upgrading from a 205/55R16 (approximately 24.9 inches in diameter) to a 225/65R17 (approximately 27.4 inches in diameter) can reduce fuel efficiency by 2-5% due to increased rotational mass and rolling resistance. Conversely, properly inflated tires at the manufacturer's recommended pressure improve fuel economy by 3-5%.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between load index and speed rating in tire size comparisons?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The load index is a numerical code representing the maximum weight a tire can support at its maximum recommended pressure, while the speed rating (a letter code like H, V, or Z) indicates the maximum speed the tire is safely rated for. For example, a tire with a load index of 91 can carry 1,356 pounds, and a V-rated tire is safe up to 149 mph. When comparing tire sizes, you must ensure the new tire's load and speed ratings meet or exceed your vehicle manufacturer's specifications to maintain safety and warranty coverage.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does changing tire size affect my speedometer accuracy?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Your speedometer is calibrated to your factory tire size's rolling circumference; larger tires cause your speedometer to read lower than your actual speed, while smaller tires cause it to read higher. A 5% increase in tire diameter (like switching from 215/60R16 to 225/60R17) results in approximately 5% speedometer error; at 60 mph, you'd actually be traveling about 63 mph. This inaccuracy can lead to unintentional speeding, affecting both safety and legal compliance.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use different tire sizes on my vehicle if I have all-wheel drive?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">All-wheel drive (AWD) vehicles are more sensitive to tire size differences than two-wheel drive vehicles because mismatched tire diameters cause binding and increased stress on the differential and transfer case. Most manufacturers recommend that all four tires have matching sizes and tread depths within 2/32 inch of each other; a diameter variance exceeding 0.5 inches can damage AWD components and void warranty coverage. Always use identical tire sizes on AWD vehicles to prevent mechanical damage.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What does the load index number mean when comparing tire sizes?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The load index is a two or three-digit number (typically ranging from 75 to 126+) that indicates the maximum weight capacity of a tire at its rated pressure. For example, a load index of 95 supports 1,521 pounds per tire, while a 105 rating supports 2,039 pounds per tire. When upgrading tire sizes, confirm the new tire's load index matches or exceeds the vehicle manufacturer's requirement, which is printed on the driver's side doorjamb; insufficient load rating can cause tire failure and safety hazards.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.nhtsa.gov/vehicle-owners/tires" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">National Highway Traffic Safety Administration (NHTSA) Tire Specification Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official NHTSA resource providing tire safety standards, load index regulations, and speed rating requirements for all vehicle types.</p>
          </li>
          <li>
            <a href="https://www.tireandrimmassociation.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Tire and Rim Association Official Yearbook</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">The authoritative source for standardized tire dimensions, load indices, speed ratings, and manufacturer specifications used in tire engineering.</p>
          </li>
          <li>
            <a href="https://www.consumerreports.org/tires/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Consumer Reports Tire Buying Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive guide to tire selection, sizing considerations, and performance impacts of tire upgrades on vehicle safety and efficiency.</p>
          </li>
          <li>
            <a href="https://www.ftc.gov/business-guidance/resources/fueled-facts-ftc-act-tire-fuel-efficiency-labeling-rule" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Federal Trade Commission (FTC) Tire Labeling Requirements</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">FTC regulations governing tire labeling standards, including treadwear ratings, traction grades, and temperature resistance classifications.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Tire Size Comparison"
      description="Professional automotive calculator: Tire Size Comparison. Get accurate estimates, expert advice, and financial insights."
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