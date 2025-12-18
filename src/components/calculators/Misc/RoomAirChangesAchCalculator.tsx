import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ FULL ICON IMPORT
import { Home, Heart, Utensils, Leaf, Calendar, DollarSign, Droplets, Activity, Moon, Sun, Users, Paintbrush, Wrench, Info, RotateCcw, AlertTriangle, FlaskConical, Scale, Waves, Zap } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function RoomAirChangesAchCalculator() {
  const [inputs, setInputs] = useState({
    length: "",
    width: "",
    height: "",
    airflowRate: "",
    airflowUnit: "CFM",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  /**
   * Calculation logic:
   * ACH = (Q * 60) / V
   * where:
   * Q = airflow rate (cubic feet per minute, CFM)
   * V = room volume (cubic feet)
   * 60 = minutes per hour (to convert CFM to cubic feet per hour)
   *
   * If airflow unit is in m³/h, convert to CFM first:
   * 1 m³/h = 0.588578 CFM
   */

  const results = useMemo(() => {
    const length = parseFloat(inputs.length);
    const width = parseFloat(inputs.width);
    const height = parseFloat(inputs.height);
    const airflowRateRaw = parseFloat(inputs.airflowRate);
    const airflowUnit = inputs.airflowUnit;

    if (
      isNaN(length) || length <= 0 ||
      isNaN(width) || width <= 0 ||
      isNaN(height) || height <= 0 ||
      isNaN(airflowRateRaw) || airflowRateRaw <= 0
    ) {
      return {
        value: null,
        label: null,
        subtext: null,
        warning: "Please enter valid positive numbers for all inputs.",
        formulaUsed: null,
      };
    }

    // Calculate room volume in cubic feet
    const volume = length * width * height; // ft³

    // Convert airflow rate to CFM if needed
    let airflowCFM = airflowRateRaw;
    if (airflowUnit === "m3h") {
      airflowCFM = airflowRateRaw * 0.588578;
    }

    // Calculate ACH
    const ach = (airflowCFM * 60) / volume;

    // Round to 2 decimals
    const achRounded = Math.round(ach * 100) / 100;

    // Provide warnings for typical ACH ranges
    let warning = null;
    if (achRounded < 0.5) {
      warning = "Warning: ACH is very low, indicating poor ventilation.";
    } else if (achRounded > 15) {
      warning = "Warning: ACH is very high, which may indicate excessive ventilation or measurement error.";
    }

    return {
      value: achRounded.toFixed(2),
      label: "Air Changes per Hour (ACH)",
      subtext: `Calculated using room volume ${volume.toFixed(2)} ft³ and airflow rate ${airflowRateRaw} ${airflowUnit === "CFM" ? "CFM" : "m³/h"}.`,
      warning,
      formulaUsed: "ACH = (Airflow Rate × 60) / Room Volume",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is Air Changes per Hour (ACH) and why is it important?",
      answer:
        "Air Changes per Hour (ACH) is a measure of how many times the air within a defined space is replaced in one hour. It is a critical metric for assessing ventilation efficiency, indoor air quality, and occupant comfort. Proper ACH levels help reduce airborne contaminants, control humidity, and maintain a healthy environment, especially in residential, commercial, and healthcare settings.",
    },
    {
      question: "How do I measure the airflow rate for this calculator?",
      answer:
        "Airflow rate is typically measured in cubic feet per minute (CFM) or cubic meters per hour (m³/h) using specialized instruments such as anemometers or airflow meters. In HVAC systems, airflow can also be obtained from system specifications or manufacturer data. Accurate airflow measurement is essential for reliable ACH calculations and ventilation assessments.",
    },
    {
      question: "Can this calculator be used for rooms with irregular shapes?",
      answer:
        "This calculator assumes a rectangular or box-shaped room for volume calculation by multiplying length, width, and height. For irregularly shaped rooms, estimate the volume by dividing the space into simpler shapes, calculating each volume separately, and summing them. Alternatively, use architectural drawings or 3D scanning tools to obtain an accurate volume measurement.",
    },
    {
      question: "What are typical ACH values for different types of rooms?",
      answer:
        "Typical ACH values vary by room type and usage. For example, residential living spaces usually require 0.35 to 1 ACH, offices and classrooms around 4 to 6 ACH, and hospital operating rooms may require 15 to 25 ACH. These values ensure adequate ventilation to maintain air quality and occupant health. Always consult local codes and standards for specific requirements.",
    },
    {
      question: "Why might my ACH result be unusually high or low?",
      answer:
        "Unusually high or low ACH results can stem from inaccurate input data, such as incorrect room dimensions or airflow rates. Measurement errors, leaks, or obstructions in ventilation systems can also affect airflow. Additionally, very high ACH might indicate excessive ventilation causing energy inefficiency, while very low ACH suggests poor air exchange, risking stale air buildup.",
    },
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card className="p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="length" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
              Room Length (feet)
            </Label>
            <Input
              id="length"
              type="number"
              min={0}
              step="any"
              placeholder="e.g., 20"
              value={inputs.length}
              onChange={(e) => handleInputChange("length", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="width" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
              Room Width (feet)
            </Label>
            <Input
              id="width"
              type="number"
              min={0}
              step="any"
              placeholder="e.g., 15"
              value={inputs.width}
              onChange={(e) => handleInputChange("width", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="height" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
              Room Height (feet)
            </Label>
            <Input
              id="height"
              type="number"
              min={0}
              step="any"
              placeholder="e.g., 8"
              value={inputs.height}
              onChange={(e) => handleInputChange("height", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="airflowRate" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
              Airflow Rate
            </Label>
            <div className="flex gap-2">
              <Input
                id="airflowRate"
                type="number"
                min={0}
                step="any"
                placeholder="e.g., 500"
                value={inputs.airflowRate}
                onChange={(e) => handleInputChange("airflowRate", e.target.value)}
              />
              <Select
                value={inputs.airflowUnit}
                onValueChange={(v) => handleInputChange("airflowUnit", v)}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CFM">CFM</SelectItem>
                  <SelectItem value="m3h">m³/h</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // Just triggers recalculation by state update (inputs already set)
            setInputs((p) => ({ ...p }));
          }}
        >
          <Home className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              length: "",
              width: "",
              height: "",
              airflowRate: "",
              airflowUnit: "CFM",
            })
          }
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value !== null && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="text-lg font-semibold text-blue-800 dark:text-blue-300">{results.label}</p>
            <p className="mt-2 text-sm text-blue-700 dark:text-blue-400">{results.subtext}</p>
            {results.warning && (
              <p className="mt-4 text-sm font-semibold text-red-700 dark:text-red-400 flex items-center justify-center gap-2">
                <AlertTriangle className="w-5 h-5" /> {results.warning}
              </p>
            )}
            <p className="mt-6 text-xs italic text-slate-600 dark:text-slate-400">{results.formulaUsed}</p>
          </CardContent>
        </Card>
      )}

      {results.value === null && results.warning && (
        <Card className="bg-yellow-50 dark:bg-yellow-900 border-yellow-300 dark:border-yellow-700 shadow-md p-4 text-center">
          <p className="text-yellow-800 dark:text-yellow-300 font-semibold">{results.warning}</p>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding the Basics</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Air Changes per Hour (ACH) is a fundamental metric used to quantify the ventilation rate of a room or enclosed space. It represents the number of times the entire volume of air within that space is replaced with fresh air in one hour. This measurement is crucial for ensuring adequate indoor air quality, controlling humidity, and reducing the concentration of airborne contaminants such as dust, allergens, and pathogens.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Calculating ACH involves understanding both the volume of the room and the airflow rate supplied or exhausted by the ventilation system. The room volume is typically calculated by multiplying the length, width, and height of the space, while the airflow rate is measured in cubic feet per minute (CFM) or cubic meters per hour (m³/h). By combining these values, ACH provides a clear picture of how effectively air is circulated and refreshed in the environment.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Maintaining appropriate ACH levels is vital across various settings, from residential homes to commercial buildings and healthcare facilities. Proper ventilation not only enhances comfort but also plays a critical role in health and safety by mitigating the spread of airborne diseases and controlling indoor pollutants.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator helps you determine the Air Changes per Hour (ACH) for any room by using simple inputs related to the room's dimensions and the ventilation airflow rate. Follow these detailed steps to ensure accurate results:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Measure the <em>length</em>, <em>width</em>, and <em>height</em> of the room in feet. Use a tape measure or laser distance meter for precision. If the room has an irregular shape, approximate the volume by dividing it into smaller rectangular sections and summing their volumes.
          </li>
          <li>
            <strong>Step 2:</strong> Determine the airflow rate of the ventilation system supplying or exhausting air from the room. This value is usually given in cubic feet per minute (CFM) or cubic meters per hour (m³/h). If you do not have this data, consult your HVAC system specifications or use an airflow meter.
          </li>
          <li>
            <strong>Step 3:</strong> Enter the measured room dimensions and airflow rate into the respective input fields. Select the correct unit for airflow rate (CFM or m³/h) from the dropdown.
          </li>
          <li>
            <strong>Step 4:</strong> Click the <em>Calculate</em> button to compute the ACH. The result will display the number of air changes per hour, along with notes and warnings if the value is unusually low or high.
          </li>
          <li>
            <strong>Step 5:</strong> Use the ACH value to assess ventilation adequacy. Compare it against recommended standards for your room type to determine if ventilation improvements are necessary.
          </li>
        </ul>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <ul className="space-y-6">
          {faqs.map((item, i) => (
            <li key={i} className="border-b border-slate-200 dark:border-slate-800 pb-4 last:border-0">
              <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-2">{item.question}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.answer}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Room Air Changes per Hour (ACH) Calculator"
      description="Calculate Air Changes per Hour (ACH). Measure ventilation efficiency and air quality turnover rates for any room size."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Methodology",
        formula: "ACH = (Airflow Rate × 60) / Room Volume",
        variables: [
          { symbol: "ACH", description: "Air Changes per Hour (times per hour)" },
          { symbol: "Airflow Rate", description: "Ventilation airflow rate (cubic feet per minute, CFM)" },
          { symbol: "Room Volume", description: "Volume of the room (cubic feet)" },
          { symbol: "60", description: "Conversion factor from minutes to hours" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "Imagine you want to calculate the ACH for a conference room that measures 25 feet long, 20 feet wide, and 10 feet high. The ventilation system supplies air at a rate of 800 CFM.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Calculate the room volume by multiplying length × width × height: 25 ft × 20 ft × 10 ft = 5000 cubic feet.",
          },
          {
            label: "Step 2",
            explanation:
              "Use the formula ACH = (Airflow Rate × 60) / Room Volume. Plugging in values: ACH = (800 CFM × 60) / 5000 ft³ = 9.6 air changes per hour.",
          },
        ],
        result: "The conference room has an ACH of 9.6, indicating that the air inside is replaced nearly 10 times every hour, which is suitable for a meeting space.",
      }}
      relatedCalculators={[
        { title: "MyPlate Daily Calorie/Nutrient Planner", url: "/everyday-life/myplate-daily-calorie-nutrient", icon: "💡" },
        { title: "Coffee Urn Yield & Strength Calculator", url: "/everyday-life/coffee-urn-yield-strength", icon: "💡" },
        { title: "Light Bulb Cost per Year Calculator", url: "/everyday-life/light-bulb-cost-per-year", icon: "🏠" },
        { title: "Ice Quantity for Beverages Calculator", url: "/everyday-life/ice-quantity-beverages", icon: "💡" },
        { title: "Screen Time Budget / Pomodoro Planner", url: "/everyday-life/screen-time-pomodoro-planner", icon: "💡" },
        { title: "Leftovers Cooling & Reheat Time", url: "/everyday-life/leftovers-cooling-reheat-time", icon: "💡" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding" },
        { id: "how-to", label: "How to Use" },
        { id: "faq", label: "FAQ" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}