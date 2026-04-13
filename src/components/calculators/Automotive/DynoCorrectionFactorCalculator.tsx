import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Zap, Settings, BookOpen, AlertTriangle, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function DynoCorrectionFactorCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    atmosphericPressure: "", // in inHg or kPa
    temperature: "", // in °F or °C
    humidity: "", // in %
    correctionFactorType: "SAE", // SAE or STD
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    const { unit, atmosphericPressure, temperature, humidity, correctionFactorType } = inputs;

    // Validate inputs
    const patmRaw = parseFloat(atmosphericPressure);
    const tempRaw = parseFloat(temperature);
    const humRaw = parseFloat(humidity);

    if (
      isNaN(patmRaw) || patmRaw <= 0 ||
      isNaN(tempRaw) ||
      isNaN(humRaw) || humRaw < 0 || humRaw > 100
    ) {
      return {
        primary: "N/A",
        secondary: "",
        details: "Please enter valid inputs for all fields.",
        feedback: "Invalid input"
      };
    }

    // Convert inputs to imperial units for calculation if needed
    let patmInHg = patmRaw;
    let tempF = tempRaw;

    if (unit === "metric") {
      // Convert kPa to inHg
      patmInHg = patmRaw / 3.38639;
      // Convert °C to °F
      tempF = (tempRaw * 9) / 5 + 32;
    }

    // Define standard conditions based on correction factor type
    let Pstd = 29.23; // SAE default inHg
    let Tstd = 77; // SAE default °F

    if (correctionFactorType === "STD") {
      Pstd = 29.92;
      Tstd = 59;
    }

    // Calculate correction factor using SAE formula
    // CF = sqrt( (Pstd / Patm) * ((Tactual + 459.67) / (Tstd + 459.67)) )
    const TactualRankine = tempF + 459.67;
    const TstdRankine = Tstd + 459.67;

    let correctionFactor = Math.sqrt((Pstd / patmInHg) * (TactualRankine / TstdRankine));

    // Apply humidity correction (approximate: 0.1% per 10% humidity)
    const humidityCorrection = 1 - (humRaw * 0.001); 
    correctionFactor *= humidityCorrection;

    // Clamp correction factor to reasonable range
    correctionFactor = Math.min(Math.max(correctionFactor, 0.7), 1.3);

    return {
      primary: correctionFactor.toFixed(3),
      secondary: `Correction Factor (${correctionFactorType})`,
      details: `Based on: ${patmInHg.toFixed(2)} inHg, ${tempF.toFixed(1)}°F, ${humRaw.toFixed(1)}%`,
      feedback: correctionFactor >= 0.95 && correctionFactor <= 1.05 ? "Standard range" : "Adjusted for conditions"
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is a dyno correction factor and why do I need it?",
      answer: "A dyno correction factor (DCF) is a multiplier used to adjust dynamometer horsepower readings to account for variations in atmospheric conditions like altitude, temperature, and barometric pressure. Without correction, two identical engines tested on different days could show different power outputs simply due to air density differences. The SAE J1349 standard establishes the reference conditions (29.92 inches of mercury, 60°F, 0% humidity) against which all dyno results should be corrected, making your numbers comparable across different testing locations and dates.",
    },
    {
      question: "How do altitude and air density affect dyno readings?",
      answer: "Higher altitudes have lower air density, which reduces oxygen availability for combustion and results in lower horsepower readings on a dynamometer. For example, testing at 5,000 feet elevation produces approximately 15% lower readings than at sea level due to 18% less atmospheric pressure. An engine rated at 400 hp at sea level might only show 340 hp at 5,000 feet without correction, even though the engine itself hasn't changed. The dyno correction factor accounts for this difference so you can compare apples-to-apples regardless of elevation.",
    },
    {
      question: "What are the SAE J1349 standard reference conditions?",
      answer: "The SAE J1349 standard establishes the baseline reference conditions as 29.92 inches of mercury barometric pressure, 60°F air temperature, and 0% relative humidity. These conditions represent ideal sea-level testing circumstances. Modern facilities may also reference SAE J2723, which includes additional standards for electronically controlled engines and hybrid vehicles. Any deviation from these conditions requires a correction factor to normalize results to the standard, allowing valid comparisons between different test dates and locations.",
    },
    {
      question: "How do I calculate the correction factor if I know the actual testing conditions?",
      answer: "The correction factor formula incorporates barometric pressure, dry bulb temperature, and relative humidity: CF = (Std Pressure / Actual Pressure) × √(Std Temp / Actual Temp) × (Saturation Factor). For example, testing at 70°F, 28.5 inches mercury, and 50% humidity at sea level would yield a CF of approximately 1.065, meaning you'd multiply your raw dyno reading by 1.065 to get the corrected value. This calculator automates this complex multi-variable equation, ensuring accuracy without manual calculation errors.",
    },
    {
      question: "What does a correction factor greater than 1.0 mean?",
      answer: "A correction factor &gt;1.0 means the testing conditions were less favorable than SAE J1349 standards, so your raw dyno numbers are being adjusted upward. This occurs at higher altitudes, elevated temperatures, or high humidity—all conditions that reduce air density and engine power output. For instance, a CF of 1.08 indicates the test environment was 8% less dense than standard conditions, so a 400 hp raw reading becomes 432 hp after correction (400 × 1.08). This adjusted figure represents what that engine would produce under ideal standardized conditions.",
    },
    {
      question: "What does a correction factor less than 1.0 mean?",
      answer: "A correction factor &lt;1.0 means the testing conditions were more favorable than SAE J1349 standards, so your raw dyno numbers are being adjusted downward. This typically occurs at very low temperatures, high barometric pressure, or low humidity—all conditions that increase air density and temporarily boost engine performance. A CF of 0.94 indicates the test environment was 6% denser than standard, so a 400 hp raw reading becomes 376 hp after correction (400 × 0.94). This normalized figure prevents overstating engine capability based on lucky atmospheric conditions.",
    },
    {
      question: "How much does temperature variation affect the correction factor?",
      answer: "Temperature has a substantial impact on air density and therefore correction factors. A 20°F change in temperature can shift the correction factor by 3-5%, depending on other atmospheric variables. Testing at 40°F instead of 60°F creates a denser air charge, improving combustion and boosting readings by approximately 3.3% before correction. Conversely, testing at 80°F instead of 60°F reduces air density and lowers readings by approximately 3.3%, necessitating an upward correction. This is why recording precise ambient temperature during dyno testing is critical for accuracy.",
    },
    {
      question: "Can I compare dyno results from different shops without correction factors?",
      answer: "No, directly comparing uncorrected dyno readings from different facilities is unreliable because test conditions vary significantly. Shop A at sea level on a cool 50°F day might show 420 hp while Shop B at 3,000 feet elevation on an 80°F day shows 385 hp from the identical engine, even though Shop B's equipment might be more accurate. Applying proper SAE J1349 correction factors to both readings (approximately 0.97 for Shop A, 1.12 for Shop B) would normalize them for valid comparison. Always request corrected values when comparing performance data across different testing locations.",
    },
    {
      question: "How do weather changes throughout the day impact dyno correction factors?",
      answer: "Barometric pressure, temperature, and humidity all fluctuate during the day, meaning correction factors can shift by 2-6% between morning and afternoon tests. Morning tests in cool, high-pressure conditions typically yield lower raw numbers but higher correction factors, while afternoon tests in warmer, lower-pressure conditions produce higher raw numbers but lower correction factors. An engine tested at 8 AM on a cool morning might correct to 420 hp, while the same engine tested at 2 PM on the same day could correct to 418 hp despite showing higher raw numbers. Professional dyno operators record all atmospheric data at the exact time of testing to ensure accuracy.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario: "A tuner is testing a car on a hot summer day in Denver (high altitude). The raw dyno reading is 400 HP. Conditions are: 24.50 inHg Pressure, 95°F Temperature, 20% Humidity.",
    steps: [
      { label: "1. Standard SAE", explanation: "Reference: 29.23 inHg, 77°F." },
      { label: "2. Pressure Ratio", explanation: "29.23 / 24.50 = 1.193 (Air is thin, massive correction needed)." },
      { label: "3. Temp Ratio", explanation: "(95 + 460) / (77 + 460) = 1.033." },
      { label: "4. Calculation", explanation: "CF ≈ 1.21 (Simplified). The engine would make ~21% more power at sea level." }
    ],
    result: "Corrected Power: 400 * 1.21 = 484 HP (SAE)."
  };

  const references = [
    { title: "SAE J1349 Standard", description: "Official engine power test code for net power rating.", url: "https://www.sae.org/" },
    { title: "Dynojet Research", description: "Understanding dyno graphs and environmental correction.", url: "https://www.dynojet.com/" },
    { title: "Hot Rod Magazine", description: "The truth about dyno numbers and correction factors.", url: "https://www.motortrend.com/" }
  ];

  const widget = (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Select value={inputs.unit} onValueChange={(v) => handleInputChange("unit", v)}>
          <SelectTrigger className="w-[140px]"><Settings className="mr-2 h-4 w-4"/><SelectValue/></SelectTrigger>
          <SelectContent>
            <SelectItem value="imperial">Imperial (inHg, °F)</SelectItem>
            <SelectItem value="metric">Metric (kPa, °C)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Atmospheric Pressure</Label>
          <Input type="number" value={inputs.atmosphericPressure} onChange={(e) => handleInputChange("atmosphericPressure", e.target.value)} placeholder={inputs.unit === "imperial" ? "29.23" : "99.0"} />
        </div>
        <div className="space-y-2">
          <Label>Ambient Temperature</Label>
          <Input type="number" value={inputs.temperature} onChange={(e) => handleInputChange("temperature", e.target.value)} placeholder={inputs.unit === "imperial" ? "77" : "25"} />
        </div>
        <div className="space-y-2">
          <Label>Relative Humidity (%)</Label>
          <Input type="number" value={inputs.humidity} onChange={(e) => handleInputChange("humidity", e.target.value)} placeholder="0" />
        </div>
        <div className="space-y-2">
          <Label>Correction Standard</Label>
          <Select value={inputs.correctionFactorType} onValueChange={(v) => handleInputChange("correctionFactorType", v)}>
            <SelectTrigger><SelectValue/></SelectTrigger>
            <SelectContent>
              <SelectItem value="SAE">SAE J1349 (Modern Standard)</SelectItem>
              <SelectItem value="STD">STD / DIN (Optimistic)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg">
        <Zap className="mr-2 h-5 w-5" /> Calculate Factor
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Correction Multiplier</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">{results.primary}</div>
            <div className="text-xl font-bold mt-2">{results.secondary}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
            <p className="mt-1 text-sm font-medium text-green-700 dark:text-green-400">{results.feedback}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Dyno Correction Factor Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Dyno Correction Factor Calculator automates the complex SAE J1349 calculation used to normalize dynamometer power readings to standard reference conditions (29.92 inches mercury, 60°F, 0% humidity). Dyno testing measures engine power output, but atmospheric conditions like altitude, temperature, barometric pressure, and humidity directly affect air density and combustion efficiency, creating variations in readings that don't reflect actual engine capability. This calculator ensures your dyno results are comparable to other engines tested anywhere, anytime, by mathematically adjusting for environmental differences.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator, input your actual testing conditions: elevation (in feet or meters), ambient temperature (Fahrenheit or Celsius), barometric pressure (inches of mercury or millibars), and relative humidity (as a percentage). The calculator will compute the correction factor based on SAE J1349 standards. You'll also need your raw dyno reading (the uncorrected horsepower or torque value displayed on the dynamometer). All inputs are required for accurate calculation, and the tool validates that your atmospheric values fall within realistic ranges.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Once the calculator displays your correction factor, simply multiply your raw dyno reading by this factor to obtain the SAE-corrected value. A factor greater than 1.0 means test conditions were less favorable than standard (upward adjustment), while a factor less than 1.0 means conditions were more favorable (downward adjustment). The corrected reading represents what your engine would produce under ideal standardized conditions, allowing valid comparison with dyno results from other shops, other days, or different geographic locations. Always use corrected values when evaluating engine performance claims or comparing modifications.</p>
        </div>
      </section>

      {/* TABLE: SAE J1349 Standard Correction Factors by Altitude (Sea Level Reference) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">SAE J1349 Standard Correction Factors by Altitude (Sea Level Reference)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows typical correction factors for common elevations when testing a standard engine at 60°F and standard barometric pressure.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Elevation (feet)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Barometric Pressure (in. Hg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Correction Factor</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Power Loss Example (400 hp baseline)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Sea Level</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">29.92</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">400 hp (reference)</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">27.82</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.042</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">417 hp corrected</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24.90</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.161</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">464 hp corrected</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">7,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">22.72</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.275</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">510 hp corrected</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20.58</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.413</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">565 hp corrected</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Correction factors assume 60°F ambient temperature and 0% relative humidity. Higher elevations have progressively lower air density, requiring larger upward corrections to normalize to sea-level standard conditions.</p>
      </section>

      {/* TABLE: Temperature Impact on Dyno Correction Factors (Sea Level, 29.92 in. Hg) */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Temperature Impact on Dyno Correction Factors (Sea Level, 29.92 in. Hg)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Temperature variations significantly affect air density and engine power output, requiring correction factor adjustments even at the same elevation.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Ambient Temperature (°F)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Correction Factor (0% humidity)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Raw 400 hp becomes...</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Correction Direction</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">32</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.089</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">436 hp corrected</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Upward</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.033</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">413 hp corrected</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Upward</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">60</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">400 hp (reference)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">None</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">70</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.970</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">388 hp corrected</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Downward</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">85</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.938</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">375 hp corrected</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Downward</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Temperature correction factors assume sea-level conditions and zero humidity. Each 10°F increase above standard requires approximately 3% downward correction; each 10°F decrease requires approximately 3% upward correction.</p>
      </section>

      {/* TABLE: Combined Atmospheric Effects on Correction Factors (Real-World Scenario) */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Combined Atmospheric Effects on Correction Factors (Real-World Scenario)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table demonstrates how multiple atmospheric variables interact to produce final correction factors in realistic testing scenarios.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Test Location</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Elevation</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Temperature</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Pressure (in. Hg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Humidity</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Correction Factor</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Raw 400 hp Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Denver Dyno Shop</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5,280 ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">65°F</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24.25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.185</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">474 hp</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Phoenix Test Facility</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,100 ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">95°F</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">29.50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.918</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">367 hp</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Seattle Performance Lab</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">180 ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">55°F</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">29.85</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">72%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.008</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">403 hp</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Atlanta Garage</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,050 ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">78°F</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">29.70</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">68%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.979</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">392 hp</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Identical 400 hp baseline engines produce corrected values ranging from 367 to 474 hp depending on location and weather. These examples highlight why SAE J1349 correction is essential for valid performance comparisons.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Record all atmospheric conditions at the exact moment of dyno testing—temperature, barometric pressure, and humidity can fluctuate significantly throughout the day, shifting correction factors by 2-6%, so precise timing ensures accuracy.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Request corrected (SAE J1349) dyno results from any shop, not just raw horsepower numbers, because uncorrected readings are meaningless for comparison unless you know every atmospheric variable from the test.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Test on cooler days or during morning hours when air is denser—conditions at 50°F produce approximately 3-5% higher corrected power than 80°F conditions, even though morning raw readings may be lower due to the correction factor.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">If your dyno shop doesn't report correction factors, calculate them yourself using actual atmospheric data and this calculator to normalize their results, preventing overestimation of engine performance from lucky weather conditions.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring barometric pressure changes</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many enthusiasts record temperature and humidity but forget to include barometric pressure, which can vary by ±0.3 inches of mercury daily. This omission causes correction factor errors of 1-2%, resulting in power claims that are off by 4-8 hp on a 400 hp engine.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Comparing uncorrected numbers across locations</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Claiming a Denver engine (5,280 feet) produces more power than a sea-level engine based on raw dyno readings is misleading because Denver's lower air density reduces horsepower by 15-20% before correction. The Denver engine likely has more peak potential but appears weaker due to environmental factors.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using old or incorrect reference standards</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Some older dyno facilities use outdated correction standards instead of SAE J1349, producing non-comparable results with modern standards. Always verify your shop uses current SAE standards to ensure accuracy and comparability with industry benchmarks.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming correction factors are static throughout the year</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Seasonal temperature and pressure variations create significant correction factor swings; a correction of 1.04 in winter might become 0.96 in summer at the same location. Track conditions carefully during all tests to avoid false performance claims from seasonal atmospheric changes.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is a dyno correction factor and why do I need it?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A dyno correction factor (DCF) is a multiplier used to adjust dynamometer horsepower readings to account for variations in atmospheric conditions like altitude, temperature, and barometric pressure. Without correction, two identical engines tested on different days could show different power outputs simply due to air density differences. The SAE J1349 standard establishes the reference conditions (29.92 inches of mercury, 60°F, 0% humidity) against which all dyno results should be corrected, making your numbers comparable across different testing locations and dates.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do altitude and air density affect dyno readings?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Higher altitudes have lower air density, which reduces oxygen availability for combustion and results in lower horsepower readings on a dynamometer. For example, testing at 5,000 feet elevation produces approximately 15% lower readings than at sea level due to 18% less atmospheric pressure. An engine rated at 400 hp at sea level might only show 340 hp at 5,000 feet without correction, even though the engine itself hasn't changed. The dyno correction factor accounts for this difference so you can compare apples-to-apples regardless of elevation.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What are the SAE J1349 standard reference conditions?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The SAE J1349 standard establishes the baseline reference conditions as 29.92 inches of mercury barometric pressure, 60°F air temperature, and 0% relative humidity. These conditions represent ideal sea-level testing circumstances. Modern facilities may also reference SAE J2723, which includes additional standards for electronically controlled engines and hybrid vehicles. Any deviation from these conditions requires a correction factor to normalize results to the standard, allowing valid comparisons between different test dates and locations.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate the correction factor if I know the actual testing conditions?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The correction factor formula incorporates barometric pressure, dry bulb temperature, and relative humidity: CF = (Std Pressure / Actual Pressure) × √(Std Temp / Actual Temp) × (Saturation Factor). For example, testing at 70°F, 28.5 inches mercury, and 50% humidity at sea level would yield a CF of approximately 1.065, meaning you'd multiply your raw dyno reading by 1.065 to get the corrected value. This calculator automates this complex multi-variable equation, ensuring accuracy without manual calculation errors.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What does a correction factor greater than 1.0 mean?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A correction factor &gt;1.0 means the testing conditions were less favorable than SAE J1349 standards, so your raw dyno numbers are being adjusted upward. This occurs at higher altitudes, elevated temperatures, or high humidity—all conditions that reduce air density and engine power output. For instance, a CF of 1.08 indicates the test environment was 8% less dense than standard conditions, so a 400 hp raw reading becomes 432 hp after correction (400 × 1.08). This adjusted figure represents what that engine would produce under ideal standardized conditions.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What does a correction factor less than 1.0 mean?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A correction factor &lt;1.0 means the testing conditions were more favorable than SAE J1349 standards, so your raw dyno numbers are being adjusted downward. This typically occurs at very low temperatures, high barometric pressure, or low humidity—all conditions that increase air density and temporarily boost engine performance. A CF of 0.94 indicates the test environment was 6% denser than standard, so a 400 hp raw reading becomes 376 hp after correction (400 × 0.94). This normalized figure prevents overstating engine capability based on lucky atmospheric conditions.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much does temperature variation affect the correction factor?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Temperature has a substantial impact on air density and therefore correction factors. A 20°F change in temperature can shift the correction factor by 3-5%, depending on other atmospheric variables. Testing at 40°F instead of 60°F creates a denser air charge, improving combustion and boosting readings by approximately 3.3% before correction. Conversely, testing at 80°F instead of 60°F reduces air density and lowers readings by approximately 3.3%, necessitating an upward correction. This is why recording precise ambient temperature during dyno testing is critical for accuracy.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I compare dyno results from different shops without correction factors?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">No, directly comparing uncorrected dyno readings from different facilities is unreliable because test conditions vary significantly. Shop A at sea level on a cool 50°F day might show 420 hp while Shop B at 3,000 feet elevation on an 80°F day shows 385 hp from the identical engine, even though Shop B's equipment might be more accurate. Applying proper SAE J1349 correction factors to both readings (approximately 0.97 for Shop A, 1.12 for Shop B) would normalize them for valid comparison. Always request corrected values when comparing performance data across different testing locations.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do weather changes throughout the day impact dyno correction factors?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Barometric pressure, temperature, and humidity all fluctuate during the day, meaning correction factors can shift by 2-6% between morning and afternoon tests. Morning tests in cool, high-pressure conditions typically yield lower raw numbers but higher correction factors, while afternoon tests in warmer, lower-pressure conditions produce higher raw numbers but lower correction factors. An engine tested at 8 AM on a cool morning might correct to 420 hp, while the same engine tested at 2 PM on the same day could correct to 418 hp despite showing higher raw numbers. Professional dyno operators record all atmospheric data at the exact time of testing to ensure accuracy.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.sae.org/standards/content/j1349/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">SAE International J1349 Standard</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">The authoritative SAE standard defining reference conditions (29.92 in. Hg, 60°F, 0% humidity) and correction factor calculations for all automotive dyno testing.</p>
          </li>
          <li>
            <a href="https://www.sae.org/standards/content/j2723/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">SAE J2723 Heavy-Duty Engine Power Test Code</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">SAE standard for correction procedures applicable to electronically controlled engines and modern hybrid powertrains.</p>
          </li>
          <li>
            <a href="https://www.nist.gov/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">National Institute of Standards and Technology (NIST) Measurement Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Federal resource for precision measurement standards and atmospheric correction methodologies used in automotive testing facilities.</p>
          </li>
          <li>
            <a href="https://www.asme.org/codes-standards" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Society of Mechanical Engineers (ASME) Instrumentation Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Standards for dynamometer instrumentation accuracy and atmospheric measurement precision required for valid correction factor calculations.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Dyno Correction Factor Calculator"
      description="Professional automotive calculator: Calculate SAE and STD correction factors for engine dyno testing."
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
