import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Settings,
  RotateCcw,
  Info,
  Gauge,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function FuelEconomyConverterCalculator() {
  // State handles unit system and input value
  // val1: fuel economy value (mpg or L/100km depending on unit)
  const [inputs, setInputs] = useState({ unit: "imperial", val1: "" });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Conversion formulas:
  // MPG to L/100km: L/100km = 235.214583 / MPG
  // L/100km to MPG: MPG = 235.214583 / L/100km
  // 235.214583 is derived from (100 km / 1 mile) * (1 gallon / 3.785411784 liters)
  // 100 km = 62.1371 miles, 1 gallon = 3.785411784 liters
  // So: 235.214583 = 100 * 3.785411784 / 1.609344 (miles per km)
  // This constant ensures precise engineering conversion.

  const results = useMemo(() => {
    if (!inputs.val1) return null;
    const val = parseFloat(inputs.val1);
    if (isNaN(val) || val <= 0) return null;

    if (inputs.unit === "imperial") {
      // Input is MPG, convert to L/100km
      // L/100km = 235.214583 / MPG
      const lPer100km = 235.214583 / val;
      // Annual fuel consumption projection assuming 15,000 miles/year
      // Convert miles to km: 15,000 * 1.609344 = 24,140.16 km
      // Fuel used = (L/100km) * (km driven / 100)
      const annualFuelLiters = (lPer100km * 24140.16) / 100;
      // Approximate cost assuming $4.00/gallon and 3.785411784 L/gallon
      const gallonsUsed = 15000 / val;
      const annualCostUSD = gallonsUsed * 4.0;

      // Feedback based on mpg thresholds (typical for passenger cars)
      let feedback = "";
      let color = "text-blue-600";
      if (val < 15) {
        feedback =
          "Poor fuel economy: High fuel consumption increases operating costs and emissions.";
        color = "text-red-600";
      } else if (val < 25) {
        feedback =
          "Average fuel economy: Typical for older or larger vehicles with moderate efficiency.";
        color = "text-yellow-600";
      } else {
        feedback =
          "Good fuel economy: Efficient use of fuel reduces environmental impact and cost.";
        color = "text-green-600";
      }

      return {
        primary: val.toFixed(2) + " MPG",
        label: "Fuel Economy (Imperial)",
        secondary:
          annualFuelLiters.toFixed(0) +
          " L/year (~$" +
          annualCostUSD.toFixed(0) +
          " annual fuel cost)",
        feedback,
        color,
        converted: lPer100km.toFixed(2) + " L/100 km",
      };
    } else {
      // Input is L/100km, convert to MPG
      // MPG = 235.214583 / L/100km
      const mpg = 235.214583 / val;
      // Annual fuel consumption assuming 24,140.16 km/year
      const annualFuelLiters = (val * 24140.16) / 100;
      // Gallons used = liters / 3.785411784
      const gallonsUsed = annualFuelLiters / 3.785411784;
      const annualCostUSD = gallonsUsed * 4.0;

      // Feedback based on L/100km thresholds (lower is better)
      let feedback = "";
      let color = "text-blue-600";
      if (val > 15) {
        feedback =
          "Poor fuel economy: High fuel consumption increases operating costs and emissions.";
        color = "text-red-600";
      } else if (val > 8) {
        feedback =
          "Average fuel economy: Typical for older or larger vehicles with moderate efficiency.";
        color = "text-yellow-600";
      } else {
        feedback =
          "Good fuel economy: Efficient use of fuel reduces environmental impact and cost.";
        color = "text-green-600";
      }

      return {
        primary: val.toFixed(2) + " L/100 km",
        label: "Fuel Economy (Metric)",
        secondary:
          annualFuelLiters.toFixed(0) +
          " L/year (~$" +
          annualCostUSD.toFixed(0) +
          " annual fuel cost)",
        feedback,
        color,
        converted: mpg.toFixed(2) + " MPG",
      };
    }
  }, [inputs]);

  // FAQs with technical depth
  const faqs = [
    {
      question:
        "Why does the EPA fuel economy rating often differ from real-world driving?",
      answer:
        "EPA ratings are derived from standardized laboratory tests under controlled conditions, which do not fully replicate real-world variables such as ambient temperature, terrain, driving style, aerodynamic drag changes, rolling resistance, and accessory loads. Factors like aggressive acceleration, high speeds, and additional vehicle weight increase fuel consumption beyond EPA estimates.",
    },
    {
      question: "How does tire pressure influence fuel economy calculations?",
      answer:
        "Underinflated tires increase rolling resistance, requiring more engine power to maintain speed, thus reducing fuel economy. Rolling resistance losses can increase by 3-5% for every 10% drop in tire pressure. This effect is not directly reflected in static fuel economy conversions but impacts actual consumption and should be considered for precise efficiency assessments.",
    },
    {
      question: "Does changing wheel size affect transmission shift points and fuel economy?",
      answer:
        "Yes. Larger or smaller wheels alter the effective rolling diameter, changing the final drive ratio and speedometer calibration. This can cause the transmission control unit to shift at different engine speeds, potentially impacting fuel efficiency and drivability. Accurate tire diameter ensures correct ABS and traction control function and optimal transmission behavior.",
    },
    {
      question:
        "Why is fuel economy expressed as MPG in the US but L/100 km internationally?",
      answer:
        "MPG (miles per gallon) measures distance per unit volume, emphasizing how far a vehicle travels per gallon of fuel. L/100 km measures volume per distance, focusing on fuel consumed over a fixed distance. The difference reflects regional measurement preferences and engineering communication styles: MPG is intuitive for distance-focused users, while L/100 km aligns with metric system conventions and emphasizes consumption efficiency.",
    },
    {
      question:
        "How do aerodynamic drag and vehicle speed affect fuel economy beyond the conversion?",
      answer:
        "Aerodynamic drag force increases with the square of vehicle speed, significantly impacting fuel consumption at highway speeds. Drag coefficient (Cd) and frontal area determine drag magnitude. Higher speeds require exponentially more engine power to overcome drag, reducing fuel economy. Conversion formulas do not account for speed-dependent drag losses but are essential for understanding real-world fuel efficiency variations.",
    },
    {
      question:
        "Can fuel economy conversions account for different fuel types and energy densities?",
      answer:
        "Standard conversions assume gasoline with a typical energy density (~34.2 MJ/L). Alternative fuels like diesel, ethanol blends, or LPG have different energy contents and combustion characteristics, affecting thermal efficiency and consumption. While the conversion between MPG and L/100 km remains mathematically consistent, interpreting fuel economy across fuel types requires adjusting for energy density and engine efficiency differences.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200">
          Configuration
        </h3>
        <Select
          value={inputs.unit}
          onValueChange={(v) => handleInputChange("unit", v)}
        >
          <SelectTrigger className="w-[140px]">
            <Settings className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="imperial">Imperial (US)</SelectItem>
            <SelectItem value="metric">Metric (EU/World)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Input for fuel economy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label>
            {inputs.unit === "imperial"
              ? "Fuel Economy (Miles Per Gallon - MPG)"
              : "Fuel Economy (Liters per 100 Kilometers - L/100 km)"}
          </Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            placeholder={
              inputs.unit === "imperial" ? "e.g. 25.00" : "e.g. 8.50"
            }
            value={inputs.val1}
            onChange={(e) => handleInputChange("val1", e.target.value)}
          />
          <p className="text-xs text-slate-500">
            {inputs.unit === "imperial"
              ? "Enter your vehicle's fuel economy in miles per gallon (MPG)."
              : "Enter your vehicle's fuel consumption in liters per 100 kilometers (L/100 km)."}
          </p>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          className="flex-1 bg-blue-600 hover:bg-blue-700"
          onClick={() => {
            /* No explicit action needed, calculation is reactive */
          }}
        >
          Calculate
        </Button>
        <Button
          variant="ghost"
          onClick={() => setInputs({ ...inputs, val1: "" })}
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results && (
        <Card className="mt-6 border-l-4 border-l-blue-600 shadow-md bg-slate-50 dark:bg-slate-900">
          <CardContent className="p-6">
            <div className="text-center">
              <span className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                {results.label}
              </span>
              <div className={`text-4xl font-extrabold my-2 ${results.color}`}>
                {results.primary}
              </div>
              <p className="text-slate-600 dark:text-slate-400">{results.feedback}</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Converted: {results.converted}
              </p>
            </div>
            <Separator className="my-4" />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-500">Annual Projection</span>
                <p className="font-semibold">{results.secondary}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12 max-w-3xl mx-auto">
      <section id="understanding" className="scroll-mt-24">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Info className="w-6 h-6 text-blue-500" />
          Understanding Fuel Economy Converter (mpg ↔ L/100 km)
        </h2>
        <div className="prose prose-slate dark:prose-invert leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            Fuel economy metrics quantify how efficiently a vehicle converts fuel energy into distance traveled. The two dominant units—Miles Per Gallon (MPG) and Liters per 100 Kilometers (L/100 km)—represent inverse perspectives: MPG measures distance per unit volume of fuel, while L/100 km measures fuel volume per fixed distance. This duality reflects regional measurement conventions and engineering communication preferences.
          </p>
          <p>
            Accurate conversion between these units requires understanding the exact relationship between miles and kilometers, and gallons and liters. The constant 235.214583 encapsulates these unit ratios, derived from 100 kilometers per mile and liters per gallon. This precision is critical for engineers and car owners who analyze fuel consumption with respect to vehicle design factors such as engine thermal efficiency, rolling resistance, and aerodynamic drag.
          </p>
        </div>
      </section>

      <section
        id="technical-details"
        className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800"
      >
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
          <Gauge className="w-5 h-5 text-indigo-500" />
          Technical Insight
        </h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          The conversion formula between MPG and L/100 km is:
          <br />
          <code>L/100 km = 235.214583 / MPG</code> and <code>MPG = 235.214583 / L/100 km</code>.
          <br />
          This constant is derived from the exact unit conversions: 1 mile = 1.609344 km, 1 US gallon = 3.785411784 liters. The formula's inverse relationship means that small changes in MPG at low values correspond to large changes in L/100 km, highlighting the nonlinear sensitivity of fuel consumption metrics. This is crucial when interpreting efficiency improvements or degradations in vehicle performance.
        </p>
      </section>

      <section id="faq">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="border border-slate-200 dark:border-slate-800 rounded-lg p-5 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
            >
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span> {faq.question}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm pl-4">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="did-you-know"
        className="mt-12 bg-slate-100 dark:bg-slate-800 p-6 rounded-lg border border-slate-300 dark:border-slate-700"
      >
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-yellow-600">
          Did You Know?
        </h3>
        <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
          The constant 235.214583 used in fuel economy conversions was first popularized in the 1970s during the oil crisis, when engineers needed a precise and easy-to-use factor to compare fuel consumption internationally. It encapsulates the exact ratio of miles to kilometers and gallons to liters, enabling consistent communication across markets with different measurement systems. This constant remains a cornerstone in automotive engineering and regulatory testing worldwide.
        </p>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Fuel Economy Converter (mpg ↔ L/100 km)"
      description="Convert fuel consumption instantly. Switch between Miles Per Gallon (MPG) and Liters per 100 kilometers (L/100 km) for international travel."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      relatedCalculators={[
        { title: "Trip Fuel Cost", url: "/automotive/trip-fuel-cost-calculator", icon: "⛽" },
      ]}
      onThisPage={[
        { id: "understanding", label: "Overview" },
        { id: "technical-details", label: "Technical Insight" },
        { id: "faq", label: "FAQ" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}