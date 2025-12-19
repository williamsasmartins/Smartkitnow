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

export default function FertilizerApplicationCalculator() {
  // Inputs:
  // area: number (in square feet or square meters)
  // areaUnit: "sqft" | "sqm"
  // fertilizerN: percentage of Nitrogen in fertilizer (e.g., 10 for 10%)
  // fertilizerP: percentage of Phosphorus (P2O5) in fertilizer
  // fertilizerK: percentage of Potassium (K2O) in fertilizer
  // desiredN: desired application rate of Nitrogen in lbs/acre or kg/ha
  // desiredP: desired application rate of Phosphorus in lbs/acre or kg/ha
  // desiredK: desired application rate of Potassium in lbs/acre or kg/ha
  // unitSystem: "imperial" or "metric"

  const [inputs, setInputs] = useState({
    area: "",
    areaUnit: "sqft",
    fertilizerN: "",
    fertilizerP: "",
    fertilizerK: "",
    desiredN: "",
    desiredP: "",
    desiredK: "",
    unitSystem: "imperial",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Conversion constants
  const SQFT_PER_ACRE = 43560;
  const SQM_PER_HA = 10000;
  const LBS_TO_KG = 0.453592;

  // Calculation logic:
  // Step 1: Convert area to acres or hectares depending on unit system
  // Step 2: Calculate total fertilizer needed for each nutrient:
  // fertilizer needed (lbs or kg) = (desired nutrient application rate * area) / (fertilizer nutrient % / 100)
  // Step 3: Sum fertilizer amounts for N, P, K to get total fertilizer needed

  const results = useMemo(() => {
    const {
      area,
      areaUnit,
      fertilizerN,
      fertilizerP,
      fertilizerK,
      desiredN,
      desiredP,
      desiredK,
      unitSystem,
    } = inputs;

    // Validate inputs
    if (
      !area ||
      !fertilizerN ||
      !fertilizerP ||
      !fertilizerK ||
      !desiredN ||
      !desiredP ||
      !desiredK
    ) {
      return {
        value: null,
        label: "",
        subtext: "",
        warning: "Please fill in all input fields to calculate.",
        formulaUsed: "",
      };
    }

    const areaNum = parseFloat(area);
    const fertN = parseFloat(fertilizerN);
    const fertP = parseFloat(fertilizerP);
    const fertK = parseFloat(fertilizerK);
    const desN = parseFloat(desiredN);
    const desP = parseFloat(desiredP);
    const desK = parseFloat(desiredK);

    if (
      isNaN(areaNum) ||
      isNaN(fertN) ||
      isNaN(fertP) ||
      isNaN(fertK) ||
      isNaN(desN) ||
      isNaN(desP) ||
      isNaN(desK)
    ) {
      return {
        value: null,
        label: "",
        subtext: "",
        warning: "Invalid numeric input detected. Please check your entries.",
        formulaUsed: "",
      };
    }

    // Convert area to acres or hectares
    let areaInUnits = 0;
    if (unitSystem === "imperial") {
      // Convert area to acres
      if (areaUnit === "sqft") {
        areaInUnits = areaNum / SQFT_PER_ACRE;
      } else if (areaUnit === "sqm") {
        // Convert sqm to sqft then to acres
        areaInUnits = (areaNum * 10.7639) / SQFT_PER_ACRE;
      }
    } else {
      // metric system: convert area to hectares
      if (areaUnit === "sqm") {
        areaInUnits = areaNum / SQM_PER_HA;
      } else if (areaUnit === "sqft") {
        // Convert sqft to sqm then to hectares
        areaInUnits = (areaNum * 0.092903) / SQM_PER_HA;
      }
    }

    if (areaInUnits <= 0) {
      return {
        value: null,
        label: "",
        subtext: "",
        warning: "Area must be greater than zero.",
        formulaUsed: "",
      };
    }

    // Calculate fertilizer needed for each nutrient
    // fertilizer needed = (desired nutrient rate * area) / (fertilizer nutrient % / 100)
    // Units: lbs or kg depending on unit system

    // Protect against zero fertilizer nutrient %
    if (fertN <= 0 || fertP <= 0 || fertK <= 0) {
      return {
        value: null,
        label: "",
        subtext: "",
        warning: "Fertilizer nutrient percentages must be greater than zero.",
        formulaUsed: "",
      };
    }

    const fertNeededN = (desN * areaInUnits) / (fertN / 100);
    const fertNeededP = (desP * areaInUnits) / (fertP / 100);
    const fertNeededK = (desK * areaInUnits) / (fertK / 100);

    // Total fertilizer needed is the max of the three (to meet all nutrient needs)
    // Because fertilizer is applied as a single product, the limiting nutrient determines total amount
    const totalFertilizerNeeded = Math.max(fertNeededN, fertNeededP, fertNeededK);

    // Format results with units
    const unitLabel = unitSystem === "imperial" ? "lbs" : "kg";

    // Detailed subtext explaining the calculation
    const subtext = `To apply ${desN.toFixed(2)} ${unitLabel} of Nitrogen, ${desP.toFixed(2)} ${unitLabel} of Phosphorus (P₂O₅), and ${desK.toFixed(2)} ${unitLabel} of Potassium (K₂O) per ${unitSystem === "imperial" ? "acre" : "hectare"}, you need approximately ${totalFertilizerNeeded.toFixed(2)} ${unitLabel} of fertilizer over your specified area. This calculation assumes uniform distribution and fertilizer nutrient percentages as entered.`;

    const formulaUsed = `Total Fertilizer Needed = max(
      (Desired N × Area) / (Fertilizer N% / 100),
      (Desired P × Area) / (Fertilizer P% / 100),
      (Desired K × Area) / (Fertilizer K% / 100)
    )`;

    return {
      value: `${totalFertilizerNeeded.toFixed(2)} ${unitLabel}`,
      label: "Total Fertilizer Required",
      subtext,
      warning: null,
      formulaUsed,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "Why do I need to know the nutrient percentages in my fertilizer?",
      answer:
        "Knowing the nutrient percentages (N-P-K) in your fertilizer is essential because it determines how much fertilizer you need to apply to meet your crop or lawn nutrient requirements. Fertilizers vary widely in nutrient content, and applying too little or too much can lead to poor plant growth or environmental harm.",
    },
    {
      question: "Can I use this calculator for any crop or lawn type?",
      answer:
        "Yes, this calculator provides a general method to estimate fertilizer amounts based on nutrient needs and fertilizer composition. However, nutrient requirements vary by crop type, soil conditions, and growth stage. For precise recommendations, consult local agricultural extension services or soil tests.",
    },
    {
      question: "What units should I use for area and nutrient rates?",
      answer:
        "You can input area in square feet or square meters and select your preferred unit system (imperial or metric). Nutrient application rates should correspond to the unit system: pounds per acre for imperial, kilograms per hectare for metric. Consistency ensures accurate calculations.",
    },
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="area">Area to Fertilize</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="area"
                  type="number"
                  min={0}
                  step="any"
                  placeholder="e.g., 5000"
                  value={inputs.area}
                  onChange={(e) => handleInputChange("area", e.target.value)}
                />
                <Select
                  value={inputs.areaUnit}
                  onValueChange={(v) => handleInputChange("areaUnit", v)}
                >
                  <SelectTrigger aria-label="Select area unit" className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sqft">sq ft</SelectItem>
                    <SelectItem value="sqm">sq m</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="unitSystem">Unit System</Label>
              <Select
                id="unitSystem"
                value={inputs.unitSystem}
                onValueChange={(v) => handleInputChange("unitSystem", v)}
              >
                <SelectTrigger aria-label="Select unit system" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="imperial">Imperial (lbs, acres)</SelectItem>
                  <SelectItem value="metric">Metric (kg, hectares)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="fertilizerN">Fertilizer Nitrogen (N) %</Label>
              <Input
                id="fertilizerN"
                type="number"
                min={0}
                max={100}
                step="any"
                placeholder="e.g., 10"
                value={inputs.fertilizerN}
                onChange={(e) => handleInputChange("fertilizerN", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="fertilizerP">Fertilizer Phosphorus (P₂O₅) %</Label>
              <Input
                id="fertilizerP"
                type="number"
                min={0}
                max={100}
                step="any"
                placeholder="e.g., 5"
                value={inputs.fertilizerP}
                onChange={(e) => handleInputChange("fertilizerP", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="fertilizerK">Fertilizer Potassium (K₂O) %</Label>
              <Input
                id="fertilizerK"
                type="number"
                min={0}
                max={100}
                step="any"
                placeholder="e.g., 10"
                value={inputs.fertilizerK}
                onChange={(e) => handleInputChange("fertilizerK", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="desiredN">Desired Nitrogen (N) Rate</Label>
              <Input
                id="desiredN"
                type="number"
                min={0}
                step="any"
                placeholder={inputs.unitSystem === "imperial" ? "lbs/acre" : "kg/ha"}
                value={inputs.desiredN}
                onChange={(e) => handleInputChange("desiredN", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="desiredP">Desired Phosphorus (P₂O₅) Rate</Label>
              <Input
                id="desiredP"
                type="number"
                min={0}
                step="any"
                placeholder={inputs.unitSystem === "imperial" ? "lbs/acre" : "kg/ha"}
                value={inputs.desiredP}
                onChange={(e) => handleInputChange("desiredP", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="desiredK">Desired Potassium (K₂O) Rate</Label>
              <Input
                id="desiredK"
                type="number"
                min={0}
                step="any"
                placeholder={inputs.unitSystem === "imperial" ? "lbs/acre" : "kg/ha"}
                value={inputs.desiredK}
                onChange={(e) => handleInputChange("desiredK", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {
            // Trigger recalculation by updating state (already reactive)
          }}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          aria-label="Calculate fertilizer application"
        >
          <Leaf className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              area: "",
              areaUnit: "sqft",
              fertilizerN: "",
              fertilizerP: "",
              fertilizerK: "",
              desiredN: "",
              desiredP: "",
              desiredK: "",
              unitSystem: "imperial",
            })
          }
          className="flex-1 h-11"
          aria-label="Reset all inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.warning && (
        <Card className="border border-yellow-400 bg-yellow-50 dark:bg-yellow-900 dark:border-yellow-700">
          <CardContent className="text-yellow-800 dark:text-yellow-300 text-center font-semibold">
            <AlertTriangle className="inline-block mr-2 h-5 w-5" />
            {results.warning}
          </CardContent>
        </Card>
      )}

      {results.value && !results.warning && (
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-slate-900 dark:to-slate-950 border-green-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-green-900 dark:text-white">{results.value}</p>
            <p className="mt-2 text-lg font-semibold text-green-800 dark:text-green-300">{results.label}</p>
            <p className="mt-4 text-sm text-green-700 dark:text-green-400 max-w-xl mx-auto leading-relaxed">{results.subtext}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Fertilizer Application Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Fertilizer application is a critical component of successful crop and lawn management, ensuring plants receive the essential nutrients they need for optimal growth. This calculator helps you determine the precise amount of fertilizer required based on your area size, the nutrient content of your fertilizer, and the desired nutrient application rates. By accurately calculating fertilizer needs, you can avoid over-application, which can harm the environment, and under-application, which can reduce yield and plant health. This tool supports sustainable and efficient fertilization practices by providing clear, science-based guidance.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this calculator effectively, you need to input the size of the area you intend to fertilize, select the unit system that corresponds with your measurements, and enter the nutrient percentages of your fertilizer product. Additionally, specify the desired application rates for nitrogen (N), phosphorus (P₂O₅), and potassium (K₂O) based on soil test recommendations or agronomic guidelines. The calculator will then compute the total amount of fertilizer required to meet these nutrient needs over your specified area.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter the area size and select the correct unit (square feet or square meters).
          </li>
          <li>
            <strong>Step 2:</strong> Choose your preferred unit system (imperial or metric) to match your nutrient application rates.
          </li>
          <li>
            <strong>Step 3:</strong> Input the nutrient percentages (N-P-K) from your fertilizer label.
          </li>
          <li>
            <strong>Step 4:</strong> Enter the desired nutrient application rates per acre or hectare.
          </li>
          <li>
            <strong>Step 5:</strong> Click "Calculate" to see the total fertilizer amount required.
          </li>
          <li>
            <strong>Step 6:</strong> Use the results to guide your fertilizer purchase and application planning.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Professional Tips & Safety</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Applying fertilizer correctly is not only about quantity but also timing, method, and safety. Always perform a soil test before fertilizing to understand your soil’s nutrient status and avoid unnecessary applications. Apply fertilizer during periods when plants can uptake nutrients efficiently, typically during active growth phases. Use protective equipment such as gloves and masks to avoid skin contact and inhalation of fertilizer dust. Store fertilizers in a cool, dry place away from children and pets, and follow local regulations for fertilizer use to protect water quality and the environment.
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

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References & Additional Resources</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
          For further reading and verification, please refer to these authoritative sources:
        </p>
        <ul className="space-y-4">
          <li>
            <a
              href="https://extension.psu.edu/fertilizer-application-rates-and-methods"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Penn State Extension: Fertilizer Application Rates and Methods <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Comprehensive guidelines on calculating and applying fertilizer rates effectively for various crops and soils.
            </p>
          </li>
          <li>
            <a
              href="https://www.nrcs.usda.gov/wps/portal/nrcs/detailfull/national/technical/nra/rca/?cid=nrcs143_014203"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              USDA NRCS: Nutrient Management <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Official resource on nutrient management planning, including fertilizer application calculations and environmental stewardship.
            </p>
          </li>
          <li>
            <a
              href="https://www.epa.gov/nutrient-policy-data/fertilizer-management"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              EPA: Fertilizer Management and Environmental Protection <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Information on best practices for fertilizer use to minimize environmental impacts such as nutrient runoff and water pollution.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Fertilizer Application Calculator"
      description="Calculate fertilizer application rates. Determine the correct amount of nitrogen, phosphorus, and potassium for your lawn or crop area."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Calculation Methodology",
        formula:
          "Total Fertilizer Needed = max((Desired N × Area) / (Fertilizer N% / 100), (Desired P × Area) / (Fertilizer P% / 100), (Desired K × Area) / (Fertilizer K% / 100))",
        variables: [
          { symbol: "Desired N", description: "Desired nitrogen application rate (lbs/acre or kg/ha)" },
          { symbol: "Desired P", description: "Desired phosphorus application rate (lbs/acre or kg/ha)" },
          { symbol: "Desired K", description: "Desired potassium application rate (lbs/acre or kg/ha)" },
          { symbol: "Area", description: "Area to fertilize (acres or hectares)" },
          { symbol: "Fertilizer N%", description: "Percentage of nitrogen in fertilizer" },
          { symbol: "Fertilizer P%", description: "Percentage of phosphorus (P₂O₅) in fertilizer" },
          { symbol: "Fertilizer K%", description: "Percentage of potassium (K₂O) in fertilizer" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "You have a 10,000 square foot lawn and want to apply fertilizer containing 10% nitrogen, 5% phosphorus, and 10% potassium. Your soil test recommends applying 1.5 lbs of nitrogen, 0.5 lbs of phosphorus (P₂O₅), and 1.0 lb of potassium (K₂O) per 1,000 square feet.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert the lawn area to acres: 10,000 sq ft ÷ 43,560 sq ft/acre ≈ 0.23 acres.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate fertilizer needed for nitrogen: (1.5 lbs × 0.23 acres) ÷ (10 / 100) = 3.45 lbs fertilizer.",
          },
          {
            label: "Step 3",
            explanation:
              "Calculate fertilizer needed for phosphorus: (0.5 lbs × 0.23 acres) ÷ (5 / 100) = 2.3 lbs fertilizer.",
          },
          {
            label: "Step 4",
            explanation:
              "Calculate fertilizer needed for potassium: (1.0 lb × 0.23 acres) ÷ (10 / 100) = 2.3 lbs fertilizer.",
          },
          {
            label: "Step 5",
            explanation:
              "Select the largest fertilizer amount to meet all nutrient needs: max(3.45, 2.3, 2.3) = 3.45 lbs fertilizer.",
          },
        ],
        result:
          "You should apply approximately 3.45 lbs of this fertilizer to your 10,000 sq ft lawn to meet the nutrient requirements.",
      }}
      relatedCalculators={[
        { title: "Room Air Changes per Hour (ACH) Calculator", url: "/everyday-life/room-air-changes-ach", icon: "💡" },
        { title: "Lawn Mowing Time & Fuel Planner", url: "/everyday-life/lawn-mowing-time-fuel", icon: "💡" },
        { title: "Home Renovation Cost Estimator", url: "/everyday-life/home-renovation-cost-estimator", icon: "🏠" },
        { title: "Hydration Reminder Interval Planner", url: "/everyday-life/hydration-reminder-interval", icon: "💡" },
        { title: "Buffet Serving Pan Capacity & Count", url: "/everyday-life/buffet-pan-capacity-count", icon: "💡" },
        { title: "Planting Calendar & Frost Date Finder", url: "/everyday-life/planting-calendar-frost-date", icon: "🌿" },
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