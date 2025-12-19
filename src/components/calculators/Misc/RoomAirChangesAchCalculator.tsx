import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ FULL ICON IMPORT
import { Home, Heart, Utensils, Leaf, Calendar, DollarSign, Droplets, Activity, Moon, Sun, Users, Paintbrush, Wrench, Info, RotateCcw, AlertTriangle, FlaskConical, Scale, Waves, Zap, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function RoomAirChangesAchCalculator() {
  const [inputs, setInputs] = useState({
    length: "",
    width: "",
    height: "",
    ventilationRate: "",
    ventilationUnit: "CFM",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  /**
   * Calculation logic:
   * ACH = (Q × 60) / V
   * Where:
   * Q = volumetric airflow rate (cubic feet per minute, CFM)
   * V = room volume (cubic feet)
   * 60 = minutes per hour (to convert CFM to cubic feet per hour)
   *
   * If ventilation rate is given in other units (e.g., m³/h), convert accordingly.
   */

  const results = useMemo(() => {
    const length = parseFloat(inputs.length);
    const width = parseFloat(inputs.width);
    const height = parseFloat(inputs.height);
    const ventilationRate = parseFloat(inputs.ventilationRate);
    const ventilationUnit = inputs.ventilationUnit;

    if (
      isNaN(length) ||
      isNaN(width) ||
      isNaN(height) ||
      isNaN(ventilationRate) ||
      length <= 0 ||
      width <= 0 ||
      height <= 0 ||
      ventilationRate <= 0
    ) {
      return {
        value: null,
        label: null,
        subtext: null,
        warning: "Please enter valid positive numbers for all fields.",
        formulaUsed: null,
      };
    }

    // Calculate room volume in cubic feet
    const volumeCubicFeet = length * width * height;

    // Convert ventilation rate to CFM if needed
    // Supported units: CFM (cubic feet per minute), m³/h (cubic meters per hour)
    let ventilationCFM = ventilationRate;
    if (ventilationUnit === "m3h") {
      // 1 cubic meter = 35.3147 cubic feet
      // ventilationRate is in m³/h, convert to CFM:
      // (m³/h) * (35.3147 ft³/m³) / 60 (min/h) = CFM
      ventilationCFM = (ventilationRate * 35.3147) / 60;
    }

    // ACH calculation
    const ach = (ventilationCFM * 60) / volumeCubicFeet;

    return {
      value: ach.toFixed(2),
      label: "Air Changes per Hour (ACH)",
      subtext: `Calculated using room volume of ${volumeCubicFeet.toFixed(
        2
      )} ft³ and ventilation rate of ${ventilationRate} ${
        ventilationUnit === "CFM" ? "CFM" : "m³/h"
      }.`,
      warning: null,
      formulaUsed:
        "ACH = (Ventilation Rate (CFM) × 60) / Room Volume (cubic feet)",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is Air Changes per Hour (ACH)?",
      answer:
        "Air Changes per Hour (ACH) is a measure of how many times the air within a defined space is replaced in one hour. It is a critical metric for assessing ventilation effectiveness, indoor air quality, and controlling airborne contaminants.",
    },
    {
      question: "Why is ACH important for indoor air quality?",
      answer:
        "ACH helps determine how effectively fresh air is circulated and stale air is removed from a room. Higher ACH values generally indicate better ventilation, which reduces the concentration of pollutants, allergens, and pathogens, improving occupant health and comfort.",
    },
    {
      question: "Can I use this calculator for any room size?",
      answer:
        "Yes, this calculator is designed to work for any enclosed space where you know the dimensions and ventilation airflow rate. Accurate inputs ensure reliable ACH estimations for residential, commercial, or industrial settings.",
    },
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="length" className="mb-1 flex items-center gap-1">
              <Home className="w-4 h-4 text-blue-600" /> Room Length (feet)
            </Label>
            <Input
              id="length"
              type="number"
              min="0"
              step="any"
              value={inputs.length}
              onChange={(e) => handleInputChange("length", e.target.value)}
              placeholder="e.g., 20"
            />
          </div>
          <div>
            <Label htmlFor="width" className="mb-1 flex items-center gap-1">
              <Home className="w-4 h-4 text-blue-600" /> Room Width (feet)
            </Label>
            <Input
              id="width"
              type="number"
              min="0"
              step="any"
              value={inputs.width}
              onChange={(e) => handleInputChange("width", e.target.value)}
              placeholder="e.g., 15"
            />
          </div>
          <div>
            <Label htmlFor="height" className="mb-1 flex items-center gap-1">
              <Home className="w-4 h-4 text-blue-600" /> Room Height (feet)
            </Label>
            <Input
              id="height"
              type="number"
              min="0"
              step="any"
              value={inputs.height}
              onChange={(e) => handleInputChange("height", e.target.value)}
              placeholder="e.g., 8"
            />
          </div>
          <div>
            <Label htmlFor="ventilationRate" className="mb-1 flex items-center gap-1">
              <Wrench className="w-4 h-4 text-green-600" /> Ventilation Rate
            </Label>
            <div className="flex gap-2">
              <Input
                id="ventilationRate"
                type="number"
                min="0"
                step="any"
                value={inputs.ventilationRate}
                onChange={(e) => handleInputChange("ventilationRate", e.target.value)}
                placeholder="e.g., 100"
                className="flex-1"
              />
              <Select
                value={inputs.ventilationUnit}
                onValueChange={(v) => handleInputChange("ventilationUnit", v)}
              >
                <SelectTrigger className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CFM">CFM (ft³/min)</SelectItem>
                  <SelectItem value="m3h">m³/h (m³/hr)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {}}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          aria-label="Calculate ACH"
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
              ventilationRate: "",
              ventilationUnit: "CFM",
            })
          }
          className="flex-1 h-11"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.warning && (
        <Card className="bg-yellow-50 border-yellow-300 dark:bg-yellow-900 dark:border-yellow-700">
          <CardContent className="text-yellow-800 dark:text-yellow-300 text-center font-semibold">
            <AlertTriangle className="mx-auto mb-2 w-6 h-6" />
            {results.warning}
          </CardContent>
        </Card>
      )}

      {results.value && !results.warning && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="mt-2 text-lg font-semibold text-blue-800 dark:text-blue-300">{results.label}</p>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">{results.subtext}</p>
            <p className="mt-3 text-xs italic text-slate-600 dark:text-slate-400">{results.formulaUsed}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Room Air Changes per Hour (ACH) Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Room Air Changes per Hour (ACH) Calculator is a vital tool for assessing the ventilation efficiency of any enclosed space. ACH quantifies how many times the entire volume of air in a room is replaced with fresh air in one hour. This metric is crucial for maintaining healthy indoor air quality, reducing airborne contaminants, and ensuring occupant comfort. By inputting the room dimensions and ventilation airflow rate, this calculator provides an accurate ACH value, helping building managers, HVAC professionals, and homeowners make informed decisions about ventilation improvements.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Proper ventilation is essential not only for comfort but also for health, especially in environments where airborne pathogens or pollutants are a concern. This calculator supports inputs in both cubic feet per minute (CFM) and cubic meters per hour (m³/h), accommodating common ventilation measurement units worldwide.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To accurately calculate the Air Changes per Hour (ACH) for your room, you need to provide precise measurements of the room’s dimensions and the ventilation airflow rate. This calculator requires the length, width, and height of the room in feet, as well as the ventilation rate, which can be entered in either cubic feet per minute (CFM) or cubic meters per hour (m³/h). Once all inputs are entered, simply press the Calculate button to obtain the ACH value.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Measure the length, width, and height of the room in feet. Use a tape measure for accuracy.
          </li>
          <li>
            <strong>Step 2:</strong> Determine the ventilation airflow rate. This is often provided by HVAC system specifications or measured using airflow meters.
          </li>
          <li>
            <strong>Step 3:</strong> Select the unit of the ventilation rate (CFM or m³/h) from the dropdown menu.
          </li>
          <li>
            <strong>Step 4:</strong> Click the Calculate button to compute the ACH. The result will display how many times the air in the room is replaced per hour.
          </li>
          <li>
            <strong>Step 5:</strong> Use the ACH value to evaluate if your ventilation meets recommended standards for your specific application.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Professional Tips & Safety</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          When using this calculator, ensure that your room measurements are as accurate as possible, including any alcoves or irregular shapes that might affect total volume. Ventilation rates should ideally be measured or obtained from reliable HVAC system data rather than estimates. Remember that recommended ACH values vary depending on room use; for example, healthcare facilities require significantly higher ACH than residential spaces. Always consult local building codes and health guidelines to determine appropriate ventilation targets.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Additionally, consider that ventilation effectiveness depends not only on ACH but also on air distribution patterns, filtration, and maintenance of HVAC systems. Regularly inspect and maintain ventilation equipment to ensure consistent performance and indoor air quality. In spaces with high occupancy or specific contamination risks, increasing ACH beyond minimum standards can provide added safety and comfort.
        </p>
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

      {/* NEW RICH REFERENCES SECTION */}
      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References & Additional Resources</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
          For further reading and verification, please refer to these authoritative sources:
        </p>
        <ul className="space-y-4">
          <li>
            <a
              href="https://www.cdc.gov/coronavirus/2019-ncov/community/ventilation.html"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              CDC: Ventilation in Buildings <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Comprehensive guidance on improving ventilation to reduce airborne transmission of viruses in indoor spaces.
            </p>
          </li>
          <li>
            <a
              href="https://www.epa.gov/indoor-air-quality-iaq/air-cleaners-and-air-filters-home"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              EPA: Air Cleaners and Air Filters in the Home <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Information on ventilation, air filtration, and maintaining indoor air quality for healthier living environments.
            </p>
          </li>
          <li>
            <a
              href="https://www.energy.gov/energysaver/ventilation"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Energy.gov: Ventilation <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Detailed explanations of ventilation types, calculations, and energy-efficient strategies for indoor air quality.
            </p>
          </li>
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
        formula: "ACH = (Ventilation Rate (CFM) × 60) / Room Volume (cubic feet)",
        variables: [
          { symbol: "ACH", description: "Air Changes per Hour" },
          { symbol: "Ventilation Rate (CFM)", description: "Volumetric airflow rate in cubic feet per minute" },
          { symbol: "Room Volume", description: "Room volume in cubic feet (Length × Width × Height)" },
          { symbol: "60", description: "Conversion factor from minutes to hours" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "Calculate the ACH for a conference room measuring 20 feet long, 15 feet wide, and 8 feet high, with a ventilation system supplying 120 CFM.",
        steps: [
          {
            label: "Step 1",
            explanation: "Calculate the room volume: 20 ft × 15 ft × 8 ft = 2400 cubic feet.",
          },
          {
            label: "Step 2",
            explanation: "Use the formula: ACH = (120 CFM × 60) / 2400 ft³ = 3 ACH.",
          },
          {
            label: "Step 3",
            explanation: "Interpret the result: The air in the room is replaced 3 times per hour.",
          },
        ],
        result: "The conference room has an ACH of 3, which is suitable for general office spaces but may be low for healthcare or laboratory environments.",
      }}
      relatedCalculators={[
        { title: "Event Capacity Calculator", url: "/everyday-life/event-capacity-calculator", icon: "💡" },
        { title: "Home Renovation Cost Estimator", url: "/everyday-life/home-renovation-cost-estimator", icon: "🏠" },
        { title: "Event Budget Calculator", url: "/everyday-life/event-budget-calculator", icon: "💡" },
        { title: "Water Heater Recovery Time Estimator", url: "/everyday-life/water-heater-recovery-time", icon: "💧" },
        { title: "Steps → Distance Converter", url: "/everyday-life/steps-to-distance-converter", icon: "💡" },
        { title: "Rainwater Barrel Days of Supply", url: "/everyday-life/rainwater-barrel-days-supply", icon: "💧" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding" },
        { id: "how-to", label: "How to Use" },
        { id: "tips", label: "Pro Tips" },
        { id: "faq", label: "FAQ" },
        { id: "references", label: "References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}