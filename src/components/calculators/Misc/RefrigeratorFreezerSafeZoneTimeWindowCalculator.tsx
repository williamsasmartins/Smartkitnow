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

export default function RefrigeratorFreezerSafeZoneTimeWindowCalculator() {
  const [inputs, setInputs] = useState({
    applianceType: "refrigerator",
    powerOutageDuration: "",
    ambientTemperature: "room",
    freezerFullness: "full",
  });
  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  /**
   * Logic Explanation:
   * The safe time window for food in refrigerators and freezers during power outages depends on several factors:
   * - Appliance type (refrigerator or freezer)
   * - Duration of power outage (input by user)
   * - Ambient temperature (room temp, warm, cold)
   * - Freezer fullness (full/freezer retains cold longer)
   * 
   * Based on USDA and CDC guidelines:
   * - Refrigerator: Food is safe up to 4 hours without power if unopened.
   * - Freezer: If full and unopened, food can remain safe for up to 48 hours.
   * - If freezer is half-full, safe time reduces to about 24 hours.
   * - Higher ambient temperature reduces safe time.
   * 
   * This calculator estimates the safe time window and warns if the outage duration exceeds safe limits.
   */

  const safeTimes = useMemo(() => {
    // Base safe times in hours
    const baseSafeTimes = {
      refrigerator: 4,
      freezer: 48,
    };

    // Adjustments based on fullness for freezer
    const fullnessAdjustment = {
      full: 1,
      half: 0.5,
      quarter: 0.25,
    };

    // Ambient temperature adjustment factor
    // Room temp ~ 70°F (21°C), warm ~ 85°F (29°C), cold ~ 60°F (15°C)
    const ambientAdjustment = {
      room: 1,
      warm: 0.75,
      cold: 1.25,
    };

    const appliance = inputs.applianceType || "refrigerator";
    const fullness = inputs.freezerFullness || "full";
    const ambient = inputs.ambientTemperature || "room";

    let safeTime = baseSafeTimes[appliance];

    if (appliance === "freezer") {
      safeTime = safeTime * (fullnessAdjustment[fullness] ?? 1);
    }

    safeTime = safeTime * (ambientAdjustment[ambient] ?? 1);

    return safeTime;
  }, [inputs.applianceType, inputs.freezerFullness, inputs.ambientTemperature]);

  const results = useMemo(() => {
    const outageHours = parseFloat(inputs.powerOutageDuration);
    if (isNaN(outageHours) || outageHours < 0) {
      return {
        value: null,
        label: "",
        subtext: "Please enter a valid power outage duration in hours.",
        warning: null,
        formulaUsed: "",
      };
    }
    const safeTime = safeTimes;

    let value = "";
    let label = "";
    let warning = null;

    if (outageHours <= safeTime) {
      value = `Safe (up to ${safeTime.toFixed(1)} hrs)`;
      label = `Your food is likely safe during this outage duration.`;
    } else {
      value = `Unsafe (exceeds ${safeTime.toFixed(1)} hrs)`;
      label = `Food safety risk detected. Consider discarding perishable items.`;
      warning = (
        <div className="flex items-center justify-center text-red-700 dark:text-red-400 gap-2 font-semibold">
          <AlertTriangle className="w-5 h-5" /> Food safety warning
        </div>
      );
    }

    return {
      value,
      label,
      subtext: `Based on appliance type, fullness, and ambient temperature.`,
      warning,
      formulaUsed:
        "Safe Time = Base Safe Time × Freezer Fullness Factor × Ambient Temperature Factor",
    };
  }, [inputs.powerOutageDuration, safeTimes]);

  const faqs = [
    {
      question: "How long can food stay safe in a refrigerator without power?",
      answer:
        "According to USDA guidelines, food in a refrigerator can generally stay safe for up to 4 hours during a power outage if the door remains closed. Beyond this, the risk of bacterial growth increases significantly.",
    },
    {
      question: "Does freezer fullness affect food safety during power outages?",
      answer:
        "Yes, a full freezer retains cold temperatures longer than a half-full or nearly empty freezer. A full freezer can keep food safe for up to 48 hours without power, while a half-full freezer may only keep food safe for about 24 hours.",
    },
    {
      question: "How does ambient temperature impact food safety during outages?",
      answer:
        "Higher ambient temperatures cause the refrigerator or freezer to warm up faster during a power outage, reducing the safe time window. Cooler ambient temperatures help maintain safe food temperatures longer.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="applianceType" className="mb-1 font-semibold flex items-center gap-1">
                Appliance Type <Utensils className="w-4 h-4 text-blue-600" />
              </Label>
              <Select
                value={inputs.applianceType}
                onValueChange={(v) => handleInputChange("applianceType", v)}
                id="applianceType"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select appliance type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="refrigerator">Refrigerator</SelectItem>
                  <SelectItem value="freezer">Freezer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {inputs.applianceType === "freezer" && (
              <div>
                <Label htmlFor="freezerFullness" className="mb-1 font-semibold flex items-center gap-1">
                  Freezer Fullness <Scale className="w-4 h-4 text-blue-600" />
                </Label>
                <Select
                  value={inputs.freezerFullness}
                  onValueChange={(v) => handleInputChange("freezerFullness", v)}
                  id="freezerFullness"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select fullness level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Full</SelectItem>
                    <SelectItem value="half">Half-Full</SelectItem>
                    <SelectItem value="quarter">Quarter-Full</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label htmlFor="ambientTemperature" className="mb-1 font-semibold flex items-center gap-1">
                Ambient Temperature <Sun className="w-4 h-4 text-yellow-500" />
              </Label>
              <Select
                value={inputs.ambientTemperature}
                onValueChange={(v) => handleInputChange("ambientTemperature", v)}
                id="ambientTemperature"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select ambient temperature" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cold">Cold (~60°F / 15°C)</SelectItem>
                  <SelectItem value="room">Room (~70°F / 21°C)</SelectItem>
                  <SelectItem value="warm">Warm (~85°F / 29°C)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="powerOutageDuration" className="mb-1 font-semibold flex items-center gap-1">
                Power Outage Duration (hours) <Calendar className="w-4 h-4 text-blue-600" />
              </Label>
              <Input
                type="number"
                min={0}
                step={0.1}
                id="powerOutageDuration"
                value={inputs.powerOutageDuration}
                onChange={(e) => handleInputChange("powerOutageDuration", e.target.value)}
                placeholder="Enter outage duration in hours"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {
            // No special calculation needed, results update automatically
          }}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
        >
          <Home className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              applianceType: "refrigerator",
              powerOutageDuration: "",
              ambientTemperature: "room",
              freezerFullness: "full",
            })
          }
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-4xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="mt-2 text-lg font-semibold text-blue-800 dark:text-blue-300">{results.label}</p>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">{results.subtext}</p>
            {results.warning}
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Refrigerator/Freezer Safe Zone Time Window
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The "Safe Zone Time Window" refers to the estimated duration during which perishable food remains safe to consume in your refrigerator or freezer during a power outage. This window is influenced by the appliance type, how full the freezer is, the ambient temperature surrounding the appliance, and how long the power has been out. Maintaining the cold chain is critical to prevent bacterial growth that can cause foodborne illnesses. Understanding these factors helps you make informed decisions about food safety during emergencies or unexpected outages.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Refrigerators typically keep food safe for about 4 hours without power if unopened, while freezers can maintain safe temperatures for up to 48 hours when full and unopened. However, these times decrease with higher ambient temperatures or if the freezer is less full. This calculator provides an authoritative estimate based on these variables to help you protect your food and health.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To accurately estimate the safe time window for your refrigerator or freezer during a power outage, input the relevant details about your appliance and environment. This includes selecting whether you have a refrigerator or freezer, specifying how full your freezer is (if applicable), choosing the ambient temperature around your appliance, and entering the duration of the power outage in hours. The calculator will then provide an estimate of how long your food is likely to remain safe.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select your appliance type (Refrigerator or Freezer).
          </li>
          <li>
            <strong>Step 2:</strong> If you selected Freezer, choose how full it is (Full, Half-Full, Quarter-Full).
          </li>
          <li>
            <strong>Step 3:</strong> Choose the ambient temperature around your appliance (Cold, Room, Warm).
          </li>
          <li>
            <strong>Step 4:</strong> Enter the duration of the power outage in hours.
          </li>
          <li>
            <strong>Step 5:</strong> Click "Calculate" to see if your food is still safe or if there is a risk.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Professional Tips & Safety</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To maximize food safety during power outages, keep refrigerator and freezer doors closed as much as possible to maintain cold temperatures. Use appliance thermometers to monitor internal temperatures; food is safe as long as the refrigerator stays below 40°F (4°C) and the freezer stays below 0°F (-18°C). If you anticipate a prolonged outage, consider transferring perishable items to a cooler with ice packs. Always err on the side of caution—when in doubt, discard food that has been above safe temperatures for extended periods to prevent foodborne illness.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Additionally, regularly maintaining your appliances ensures optimal insulation and cooling efficiency, which can extend safe time windows during outages. Labeling foods with purchase or freeze dates can help you prioritize consumption and reduce waste. Stay informed with official food safety guidelines from trusted sources during emergencies.
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
              href="https://www.cdc.gov/foodsafety/keep-food-safe.html"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              CDC - Food Safety and Power Outages <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Official guidelines from the Centers for Disease Control and Prevention on keeping food safe during power outages.
            </p>
          </li>
          <li>
            <a
              href="https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/food-safety-during-power-outage"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              USDA FSIS - Food Safety During Power Outages <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              The United States Department of Agriculture's Food Safety and Inspection Service provides detailed advice on food safety during power interruptions.
            </p>
          </li>
          <li>
            <a
              href="https://extension.umn.edu/food-safety-0/food-safety-during-power-outages"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              University of Minnesota Extension - Food Safety During Power Outages <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Extension service providing practical tips and scientific background on maintaining food safety during electrical outages.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Refrigerator/Freezer Safe Zone Time Window"
      description="Track food safety during power outages. Estimate how long food stays safe in your refrigerator or freezer without power."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Methodology",
        formula: "Safe Time = Base Safe Time × Freezer Fullness Factor × Ambient Temperature Factor",
        variables: [
          { symbol: "Base Safe Time", description: "Standard safe duration for appliance type (4 hrs for refrigerator, 48 hrs for freezer)" },
          { symbol: "Freezer Fullness Factor", description: "Multiplier based on how full the freezer is (1 for full, 0.5 for half, 0.25 for quarter)" },
          { symbol: "Ambient Temperature Factor", description: "Adjustment based on surrounding temperature (1 for room temp, <1 for warm, >1 for cold)" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "You have a full freezer at room temperature and experience a power outage lasting 30 hours. You want to know if your food is still safe.",
        steps: [
          {
            label: "Step 1",
            explanation: "Select 'Freezer' as appliance type.",
          },
          {
            label: "Step 2",
            explanation: "Choose 'Full' for freezer fullness.",
          },
          {
            label: "Step 3",
            explanation: "Select 'Room' for ambient temperature.",
          },
          {
            label: "Step 4",
            explanation: "Enter '30' for power outage duration in hours.",
          },
          {
            label: "Step 5",
            explanation: "Calculate to see the safe time window and risk assessment.",
          },
        ],
        result:
          "The calculator indicates that food is likely safe since 30 hours is less than the adjusted safe time of 48 hours for a full freezer at room temperature.",
      }}
      relatedCalculators={[
        { title: "Life Expectancy Calculator", url: "/everyday/life-expectancy", icon: "💡" },
        { title: "Water Heater Recovery Time Estimator", url: "/everyday/water-heater-recovery-time", icon: "💧" },
        { title: "Lawn Mowing Time & Fuel Planner", url: "/everyday/lawn-mowing-time-fuel", icon: "💡" },
        { title: "Garden Soil/Compost Volume Calculator", url: "/everyday/garden-soil-compost-volume", icon: "🌿" },
        { title: "Cleaning Dilution Ratio Calculator", url: "/everyday/cleaning-dilution-ratio", icon: "🏠" },
        { title: "Fertilizer Application Calculator", url: "/everyday/fertilizer-application-calculator", icon: "💡" },
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