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

  /**
   * Dyno Correction Factor Calculation Logic:
   * 
   * The dyno correction factor adjusts measured power output to standard atmospheric conditions.
   * Common standards:
   * - SAE J1349 (SAE): 29.23 inHg, 77°F, 0% humidity
   * - STD (DIN): 29.92 inHg, 59°F, 0% humidity
   * 
   * Formula (simplified):
   * CF = (Pstd / Pactual) * (Tactual / Tstd)
   * 
   * More accurate SAE correction factor formula:
   * CF = ( (Pstd / Patm) * (Tactual + 459.67) / (Tstd + 459.67) ) ^ 0.5
   * 
   * For humidity, correction is often neglected or minor.
   * 
   * For this calculator, we will use SAE J1349 correction factor formula:
   * CF = ( (Pstd / Patm) * ((Tactual + 459.67) / (Tstd + 459.67)) ) ^ 0.5
   * 
   * Where:
   * - Pstd = 29.23 inHg (SAE) or 29.92 inHg (STD)
   * - Tstd = 77°F (SAE) or 59°F (STD)
   * - Patm = input atmospheric pressure
   * - Tactual = input temperature
   * 
   * Units:
   * - Pressure: inHg (imperial) or kPa (metric) [1 inHg = 3.38639 kPa]
   * - Temperature: °F (imperial) or °C (metric)
   */

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
    // Humidity effect is minor and often neglected in dyno correction factor calculations,
    // but we can apply a small adjustment: reduce CF by 0.1% per 10% humidity as approximation.

    const TactualRankine = tempF + 459.67;
    const TstdRankine = Tstd + 459.67;

    let correctionFactor = Math.sqrt((Pstd / patmInHg) * (TactualRankine / TstdRankine));

    // Apply humidity correction (approximate)
    const humidityCorrection = 1 - (humRaw * 0.001); // 0.1% per 10% humidity
    correctionFactor *= humidityCorrection;

    // Clamp correction factor to reasonable range (0.7 to 1.3)
    correctionFactor = Math.min(Math.max(correctionFactor, 0.7), 1.3);

    return {
      primary: correctionFactor.toFixed(3),
      secondary: `Correction Factor (${correctionFactorType})`,
      details: `Based on atmospheric pressure: ${patmInHg.toFixed(2)} inHg, temperature: ${tempF.toFixed(1)}°F, humidity: ${humRaw.toFixed(1)}%`,
      feedback: correctionFactor >= 0.95 && correctionFactor <= 1.05 ? "Standard range" : "Adjusted for conditions"
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "What is a dyno correction factor and why is it important?",
      answer:
        "A dyno correction factor is a multiplier used to adjust measured engine power outputs to standardized atmospheric conditions. This adjustment accounts for variations in temperature, pressure, and humidity that affect engine performance. Using a correction factor ensures that dyno results are comparable regardless of environmental differences, providing a fair baseline for tuning and performance evaluation."
    },
    {
      question: "What are the common standards for dyno correction factors?",
      answer:
        "The most common standards are SAE J1349 (SAE) and STD (DIN). SAE standard conditions are 29.23 inHg atmospheric pressure, 77°F temperature, and 0% humidity, while STD uses 29.92 inHg, 59°F, and 0% humidity. Each standard uses slightly different baseline conditions, so it’s important to select the correct one for your dyno or tuning environment."
    },
    {
      question: "How does humidity affect the dyno correction factor?",
      answer:
        "Humidity affects air density and combustion efficiency, but its impact on dyno correction factors is relatively minor compared to temperature and pressure. Typically, humidity corrections reduce the correction factor slightly, around 0.1% per 10% humidity. Many dyno operators neglect humidity due to its small effect, but including it can improve accuracy."
    },
    {
      question: "Can I use this calculator for both imperial and metric units?",
      answer:
        "Yes, this calculator supports both imperial and metric units. Atmospheric pressure can be entered in inches of mercury (inHg) or kilopascals (kPa), and temperature in Fahrenheit or Celsius. The calculator automatically converts metric inputs to imperial units internally for consistent calculations."
    },
    {
      question: "Why might my dyno correction factor be outside the typical range?",
      answer:
        "If your correction factor is significantly above 1.05 or below 0.95, it usually indicates unusual atmospheric conditions such as very low or high pressure, extreme temperatures, or incorrect input values. It’s important to verify sensor accuracy and input correctness to ensure reliable results."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "A performance tuner is testing a car on a dynamometer on a hot summer day. The atmospheric pressure is 28.50 inHg, temperature is 95°F, and humidity is 40%. They want to calculate the SAE correction factor to adjust the measured power output to standard conditions.",
    steps: [
      {
        label: "Step 1: Identify standard conditions for SAE",
        explanation: "Pstd = 29.23 inHg, Tstd = 77°F"
      },
      {
        label: "Step 2: Convert temperatures to Rankine",
        explanation: "Tactual = 95 + 459.67 = 554.67 R, Tstd = 77 + 459.67 = 536.67 R"
      },
      {
        label: "Step 3: Calculate base correction factor",
        explanation:
          "CF_base = sqrt((29.23 / 28.50) * (554.67 / 536.67)) = sqrt(1.0253 * 1.0336) = sqrt(1.059) = 1.029"
      },
      {
        label: "Step 4: Apply humidity correction",
        explanation: "Humidity = 40%, correction = 1 - (0.001 * 40) = 0.96; CF = 1.029 * 0.96 = 0.987"
      },
      {
        label: "Step 5: Final correction factor",
        explanation: "Correction Factor = 0.987 (rounded to 0.987)"
      }
    ],
    result: "The dyno correction factor is approximately 0.987, meaning the measured power should be multiplied by 0.987 to estimate power at standard SAE conditions."
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "SAE J1349 Engine Power Test Code",
      description: "Official SAE standard describing engine power measurement and correction factors.",
      url: "https://www.sae.org/standards/content/j1349_201104/"
    },
    {
      title: "Dynojet Correction Factors Explained",
      description: "Detailed explanation of dyno correction factors by Dynojet Research.",
      url: "https://dynojet.com/support/dyno-correction-factors/"
    },
    {
      title: "Understanding Atmospheric Pressure and Engine Performance",
      description: "Technical article on how atmospheric conditions affect engine output.",
      url: "https://www.enginebuildermag.com/2019/07/understanding-atmospheric-pressure-engine-performance/"
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
          <Label>Atmospheric Pressure ({inputs.unit === "imperial" ? "inHg" : "kPa"})</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={inputs.atmosphericPressure}
            onChange={(e) => handleInputChange("atmosphericPressure", e.target.value)}
            placeholder={inputs.unit === "imperial" ? "e.g. 29.23" : "e.g. 98.7"}
          />
        </div>
        <div className="space-y-2">
          <Label>Ambient Temperature ({inputs.unit === "imperial" ? "°F" : "°C"})</Label>
          <Input
            type="number"
            step="0.1"
            value={inputs.temperature}
            onChange={(e) => handleInputChange("temperature", e.target.value)}
            placeholder={inputs.unit === "imperial" ? "e.g. 77" : "e.g. 25"}
          />
        </div>
        <div className="space-y-2">
          <Label>Relative Humidity (%)</Label>
          <Input
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={inputs.humidity}
            onChange={(e) => handleInputChange("humidity", e.target.value)}
            placeholder="e.g. 40"
          />
        </div>
        <div className="space-y-2">
          <Label>Correction Factor Type</Label>
          <Select
            value={inputs.correctionFactorType}
            onValueChange={(v) => handleInputChange("correctionFactorType", v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SAE">SAE J1349</SelectItem>
              <SelectItem value="STD">STD (DIN)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" onClick={() => {}}>
        <Zap className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Estimated Result</span>
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
      {/* 1. HOW TO USE */}
      <section id="how-to-use" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to use this calculator</h2>
        <ol className="list-decimal pl-5 space-y-3 text-slate-600 dark:text-slate-400">
          <li>
            <strong>Step 1:</strong> Select your preferred unit system (Imperial or Metric) from the top-right dropdown.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the current atmospheric pressure. Use inHg for Imperial or kPa for Metric units.
          </li>
          <li>
            <strong>Step 3:</strong> Input the ambient temperature in °F (Imperial) or °C (Metric).
          </li>
          <li>
            <strong>Step 4:</strong> Provide the relative humidity percentage (0-100%). This helps refine the correction factor.
          </li>
          <li>
            <strong>Step 5:</strong> Choose the correction factor standard: SAE J1349 or STD (DIN).
          </li>
          <li>
            <strong>Step 6:</strong> Click the <em>Calculate</em> button to get the dyno correction factor based on your inputs.
          </li>
        </ol>
      </section>

      {/* 2. COMPLETE GUIDE */}
      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to Dyno Correction Factor Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            A dynamometer (dyno) measures engine power output, but the results are influenced by atmospheric conditions such as pressure, temperature, and humidity. These environmental factors affect air density and combustion efficiency, causing variations in measured power. To compare dyno results fairly or to estimate engine performance under standard conditions, a correction factor is applied.
          </p>
          <p>
            The dyno correction factor adjusts the raw measured power to a baseline defined by recognized standards, most commonly SAE J1349 or STD (DIN). SAE standard conditions are 29.23 inches of mercury (inHg) atmospheric pressure, 77°F temperature, and 0% humidity, while STD uses 29.92 inHg, 59°F, and 0% humidity. These standards provide a consistent reference for tuning and performance benchmarking.
          </p>
          <p>
            The correction factor is calculated using a formula that accounts for the ratio of standard to actual atmospheric pressure and the ratio of actual to standard temperature (converted to absolute temperature scales like Rankine). Humidity has a smaller effect but is included as a minor adjustment to improve accuracy. The resulting factor is typically close to 1, where values above 1 indicate denser air (better performance) and below 1 indicate thinner air (reduced performance).
          </p>
          <p>
            This calculator allows you to input your local atmospheric conditions and select the correction standard to compute the appropriate dyno correction factor. It supports both imperial and metric units, automatically converting inputs for internal calculations. Using this tool helps ensure your dyno results are accurately normalized, enabling better tuning decisions and reliable performance comparisons.
          </p>
        </div>
      </section>

      {/* 3. COMMON MISTAKES */}
      <section
        id="mistakes"
        className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900"
      >
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" /> Common Mistakes
        </h3>
        <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <p>
            <strong>1. Incorrect Units:</strong> Entering atmospheric pressure or temperature in the wrong units (e.g., kPa instead of inHg) will lead to erroneous correction factors. Always verify your unit selection matches your input values.
          </p>
          <p>
            <strong>2. Ignoring Humidity:</strong> While humidity has a smaller effect, neglecting it entirely can cause slight inaccuracies, especially in very humid or dry conditions. Inputting realistic humidity values improves precision.
          </p>
          <p>
            <strong>3. Using Outdated or Wrong Standards:</strong> Ensure you select the correct correction factor standard (SAE or STD) that matches your dyno or tuning protocol. Mixing standards can cause inconsistent results.
          </p>
          <p>
            <strong>4. Not Calibrating Sensors:</strong> Atmospheric pressure and temperature sensors must be accurate. Faulty or uncalibrated sensors will produce misleading correction factors.
          </p>
          <p>
            <strong>5. Extreme Conditions:</strong> Very low or high pressures and temperatures outside typical ranges can produce correction factors outside normal limits. Double-check inputs and consider environmental anomalies.
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
      title="Dyno Correction Factor Calculator"
      description="Professional automotive calculator: Dyno Correction Factor Calculator. Get accurate estimates, expert advice, and financial insights."
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