import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ FULL ICON IMPORT
import { Activity, Timer, TrendingUp, Dumbbell, Trophy, Medal, Flag, Flame, Zap, Heart, Scale, Calculator, Info, RotateCcw, AlertTriangle, BookOpen, ExternalLink, Waves, Gauge } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

const AIR_DENSITY = 1.225; // kg/m³ at sea level, 15°C
const GRAVITY = 9.80665; // m/s²

export default function CyclingPowerSpeedEstimatorCalculator() {
  const [inputs, setInputs] = useState({
    speed: "", // km/h
    power: "", // watts
    riderWeight: "", // kg
    bikeWeight: "", // kg
    cda: "", // m² (drag area)
    crr: "", // rolling resistance coefficient
    windSpeed: "", // km/h
    windAngle: "", // degrees (0 = headwind, 180 = tailwind)
  });
  const handleInputChange = useCallback((n, v) => setInputs(p => ({ ...p, [n]: v })), []);

  /**
   * Core physics model:
   * Power = Rolling Resistance + Aerodynamic Drag + Drive Train Losses (ignored here for simplicity)
   * Rolling Resistance Force = mass * g * crr
   * Aerodynamic Drag Force = 0.5 * airDensity * cda * relativeWindSpeed²
   * relativeWindSpeed = speed ± windSpeed * cos(windAngle)
   * Power = Force * velocity (m/s)
   */

  const results = useMemo(() => {
    // Parse inputs
    const speedKmh = parseFloat(inputs.speed);
    const powerInput = parseFloat(inputs.power);
    const riderWeight = parseFloat(inputs.riderWeight);
    const bikeWeight = parseFloat(inputs.bikeWeight);
    const cda = parseFloat(inputs.cda);
    const crr = parseFloat(inputs.crr);
    const windSpeedKmh = parseFloat(inputs.windSpeed);
    const windAngleDeg = parseFloat(inputs.windAngle);

    // Validate inputs
    if (
      (isNaN(speedKmh) && isNaN(powerInput)) ||
      isNaN(riderWeight) || isNaN(bikeWeight) ||
      isNaN(cda) || isNaN(crr) ||
      isNaN(windSpeedKmh) || isNaN(windAngleDeg)
    ) {
      return {
        value: null,
        label: "",
        subtext: "Please fill in all fields with valid numbers.",
        warning: null,
        formulaUsed: "",
      };
    }

    // Convert units
    const speedMs = speedKmh / 3.6;
    const windSpeedMs = windSpeedKmh / 3.6;
    const totalMass = riderWeight + bikeWeight;

    // Calculate relative wind speed vector
    // windAngle: 0° = headwind, 180° = tailwind
    // Relative wind speed magnitude = sqrt(v² + w² + 2vw cos θ)
    // But for power, we need the component of wind opposing motion:
    // Effective wind speed = speedMs + windSpeedMs * cos(windAngle)
    // Positive windAngle means wind from behind (tailwind)
    const windAngleRad = (windAngleDeg * Math.PI) / 180;
    const relativeWindSpeed = speedMs + windSpeedMs * Math.cos(windAngleRad);

    // Forces
    const rollingResistanceForce = totalMass * GRAVITY * crr; // Newtons
    const aerodynamicDragForce = 0.5 * AIR_DENSITY * cda * relativeWindSpeed * relativeWindSpeed; // Newtons

    // Total force opposing motion
    const totalForce = rollingResistanceForce + aerodynamicDragForce;

    // Calculate power from speed (W = F * v)
    const powerFromSpeed = totalForce * speedMs;

    // Calculate speed from power (solve quadratic for speed)
    // power = rollingResistanceForce * v + 0.5 * airDensity * cda * v_rel² * v
    // v_rel = v + windSpeedMs * cos(windAngle)
    // This is a cubic in v, solved numerically here by iteration:

    function speedFromPower(powerTarget) {
      if (powerTarget <= 0) return 0;
      let vLow = 0;
      let vHigh = 50 / 3.6; // 50 km/h in m/s upper bound
      let vMid = 0;
      for (let i = 0; i < 30; i++) {
        vMid = (vLow + vHigh) / 2;
        const vRel = vMid + windSpeedMs * Math.cos(windAngleRad);
        const force = rollingResistanceForce + 0.5 * AIR_DENSITY * cda * vRel * vRel;
        const powerCalc = force * vMid;
        if (powerCalc > powerTarget) vHigh = vMid;
        else vLow = vMid;
      }
      return vMid * 3.6; // return km/h
    }

    let outputValue = null;
    let outputLabel = "";
    let outputSubtext = "";
    let formulaUsed = "";

    if (!isNaN(powerInput) && powerInput > 0 && (isNaN(speedKmh) || speedKmh === 0)) {
      // Calculate speed from power
      const estimatedSpeed = speedFromPower(powerInput);
      outputValue = estimatedSpeed.toFixed(1) + " km/h";
      outputLabel = "Estimated Speed";
      outputSubtext = `At ${powerInput} watts, considering wind and flat terrain.`;
      formulaUsed = "Power = (Rolling Resistance + Aerodynamic Drag) × Speed";
    } else if (!isNaN(speedKmh) && speedKmh > 0 && (isNaN(powerInput) || powerInput === 0)) {
      // Calculate power from speed
      outputValue = powerFromSpeed.toFixed(0) + " watts";
      outputLabel = "Estimated Power";
      outputSubtext = `To maintain ${speedKmh} km/h on flat terrain with wind considered.`;
      formulaUsed = "Power = (Rolling Resistance + Aerodynamic Drag) × Speed";
    } else if (!isNaN(speedKmh) && !isNaN(powerInput) && speedKmh > 0 && powerInput > 0) {
      outputValue = `Power: ${powerFromSpeed.toFixed(0)} W | Speed: ${speedKmh.toFixed(1)} km/h`;
      outputLabel = "Calculated Power & Speed";
      outputSubtext = "Both inputs provided; power calculated from speed for reference.";
      formulaUsed = "Power = (Rolling Resistance + Aerodynamic Drag) × Speed";
    } else {
      outputValue = null;
      outputLabel = "";
      outputSubtext = "Please provide either speed or power to estimate the other.";
      formulaUsed = "";
    }

    return {
      value: outputValue,
      label: outputLabel,
      subtext: outputSubtext,
      warning: null,
      formulaUsed,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "How does wind direction affect cycling power and speed?",
      answer:
        "Wind direction significantly influences cycling performance. A headwind increases the relative wind speed, thus increasing aerodynamic drag and required power to maintain speed. Conversely, a tailwind reduces relative wind speed, decreasing power demands. Crosswinds affect stability and drag differently depending on angle, which this calculator approximates by the cosine of the wind angle.",
    },
    {
      question: "What are typical values for CdA and rolling resistance?",
      answer:
        "CdA (drag area) typically ranges from 0.2 to 0.35 m² for road cyclists, depending on position and equipment. Rolling resistance coefficient (Crr) usually ranges from 0.002 to 0.005 for high-quality road tires on smooth asphalt. Accurate inputs improve estimation precision.",
    },
    {
      question: "Can this calculator be used for hilly terrain?",
      answer:
        "This calculator is optimized for flat terrain and wind effects only. It does not account for gravitational forces on inclines or declines. For hilly terrain, additional calculations including slope and elevation changes are necessary to estimate power or speed accurately.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="speed">Speed (km/h)</Label>
              <Input
                id="speed"
                type="number"
                min="0"
                step="0.1"
                placeholder="Enter speed or leave blank"
                value={inputs.speed}
                onChange={e => handleInputChange("speed", e.target.value)}
                aria-describedby="speed-desc"
              />
              <p id="speed-desc" className="text-xs text-slate-500 mt-1">
                Leave blank if you want to calculate speed from power.
              </p>
            </div>
            <div>
              <Label htmlFor="power">Power (watts)</Label>
              <Input
                id="power"
                type="number"
                min="0"
                step="1"
                placeholder="Enter power or leave blank"
                value={inputs.power}
                onChange={e => handleInputChange("power", e.target.value)}
                aria-describedby="power-desc"
              />
              <p id="power-desc" className="text-xs text-slate-500 mt-1">
                Leave blank if you want to calculate power from speed.
              </p>
            </div>
            <div>
              <Label htmlFor="riderWeight">Rider Weight (kg)</Label>
              <Input
                id="riderWeight"
                type="number"
                min="30"
                max="200"
                step="0.1"
                placeholder="e.g. 70"
                value={inputs.riderWeight}
                onChange={e => handleInputChange("riderWeight", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="bikeWeight">Bike Weight (kg)</Label>
              <Input
                id="bikeWeight"
                type="number"
                min="5"
                max="20"
                step="0.1"
                placeholder="e.g. 8"
                value={inputs.bikeWeight}
                onChange={e => handleInputChange("bikeWeight", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="cda">CdA (drag area, m²)</Label>
              <Input
                id="cda"
                type="number"
                min="0.1"
                max="0.5"
                step="0.01"
                placeholder="e.g. 0.3"
                value={inputs.cda}
                onChange={e => handleInputChange("cda", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="crr">Rolling Resistance Coefficient (Crr)</Label>
              <Input
                id="crr"
                type="number"
                min="0.001"
                max="0.01"
                step="0.0001"
                placeholder="e.g. 0.004"
                value={inputs.crr}
                onChange={e => handleInputChange("crr", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="windSpeed">Wind Speed (km/h)</Label>
              <Input
                id="windSpeed"
                type="number"
                min="0"
                max="50"
                step="0.1"
                placeholder="e.g. 10"
                value={inputs.windSpeed}
                onChange={e => handleInputChange("windSpeed", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="windAngle">Wind Angle (°)</Label>
              <Input
                id="windAngle"
                type="number"
                min="0"
                max="360"
                step="1"
                placeholder="0 = headwind, 180 = tailwind"
                value={inputs.windAngle}
                onChange={e => handleInputChange("windAngle", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // Trigger recalculation by updating state (already reactive)
          }}
        >
          <Trophy className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              speed: "",
              power: "",
              riderWeight: "",
              bikeWeight: "",
              cda: "",
              crr: "",
              windSpeed: "",
              windAngle: "",
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
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="text-lg font-semibold text-blue-700 dark:text-blue-300 mt-2">{results.label}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{results.subtext}</p>
            {results.formulaUsed && (
              <p className="text-xs italic text-slate-500 dark:text-slate-600 mt-2">{results.formulaUsed}</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Cycling Power ↔ Speed Estimator (flat/wind)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Cycling performance on flat terrain is primarily influenced by the balance between the cyclist's power output and the resistive forces acting against motion. These forces include rolling resistance from the tires and aerodynamic drag caused by air resistance, which is further affected by wind speed and direction. This calculator estimates the power required to maintain a given speed or the speed achievable at a given power output by modeling these forces using fundamental physics principles. It incorporates rider and bike weight, aerodynamic drag area (CdA), rolling resistance coefficient (Crr), and wind conditions to provide a comprehensive and realistic estimation.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The aerodynamic drag force increases with the square of the relative wind speed, which is the vector sum of the cyclist's speed and the wind speed projected along the direction of travel. Rolling resistance is proportional to the total weight and the rolling resistance coefficient, which depends on tire type and surface. By combining these forces, the calculator derives the power needed to overcome them at a given speed or inversely estimates speed from power output, helping cyclists optimize training and pacing strategies.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this calculator effectively, you must provide either the speed or the power output, along with the other required parameters describing your cycling setup and environmental conditions. If you input speed, the calculator estimates the power required to maintain that speed under the specified conditions. Conversely, if you input power, it estimates the speed you can expect to achieve. Ensure all inputs are accurate for the best results.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter your current or target speed in km/h or your power output in watts. Leave one blank to calculate it.
          </li>
          <li>
            <strong>Step 2:</strong> Input your rider and bike weight in kilograms to account for rolling resistance.
          </li>
          <li>
            <strong>Step 3:</strong> Provide your aerodynamic drag area (CdA) and rolling resistance coefficient (Crr). Typical values are provided as placeholders.
          </li>
          <li>
            <strong>Step 4:</strong> Enter wind speed and wind angle (0° for headwind, 180° for tailwind) to factor in environmental effects.
          </li>
          <li>
            <strong>Step 5:</strong> Click "Calculate" to see the estimated power or speed based on your inputs.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips & Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Understanding the relationship between power and speed is crucial for effective cycling training and race strategy. Use this calculator to identify how changes in position, equipment, or environmental conditions affect your power demands. For example, reducing your CdA by adopting a more aerodynamic position or upgrading to aero wheels can significantly reduce power requirements at a given speed. Similarly, minimizing rolling resistance by selecting high-quality tires and maintaining proper tire pressure can improve efficiency.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Incorporate wind conditions into your training plans by practicing riding in various wind scenarios to improve handling and pacing. Use power meters to monitor your output and compare it against the calculator's estimates to validate your performance and adjust your training zones accordingly. Remember, consistent training and data-driven adjustments will yield the best improvements in cycling efficiency and endurance.
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

      {/* REFERENCES SECTION */}
      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References & Additional Resources</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
          For more information on cycling physiology, aerodynamics, and training science, consult the following authoritative sources:
        </p>
        <ul className="space-y-4">
          <li>
            <a
              href="https://www.acsm.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              American College of Sports Medicine <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Global leader in sports medicine and exercise science research, providing evidence-based guidelines for endurance training and performance.
            </p>
          </li>
          <li>
            <a
              href="https://www.usacycling.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              USA Cycling <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              The national governing body for cycling in the United States, offering resources on training, biomechanics, and competitive standards.
            </p>
          </li>
          <li>
            <a
              href="https://www.cyclingpowerlab.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Cycling Power Lab <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              A comprehensive resource for cycling power analysis, aerodynamics, and performance modeling.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Cycling Power ↔ Speed Estimator (flat/wind)"
      description="Estimate cycling power vs speed. Calculate how much wattage is required to maintain speed against wind resistance and flat terrain."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Core Formula",
        formula:
          "Power = (Rolling Resistance + Aerodynamic Drag) × Speed\n" +
          "where Rolling Resistance = mass × g × Crr\n" +
          "and Aerodynamic Drag = 0.5 × air density × CdA × (relative wind speed)²",
        variables: [
          { symbol: "Power", description: "Power output in watts (W)" },
          { symbol: "mass", description: "Total mass of rider + bike (kg)" },
          { symbol: "g", description: "Acceleration due to gravity (9.81 m/s²)" },
          { symbol: "Crr", description: "Rolling resistance coefficient (unitless)" },
          { symbol: "CdA", description: "Aerodynamic drag area (m²)" },
          { symbol: "relative wind speed", description: "Speed adjusted for wind (m/s)" },
          { symbol: "Speed", description: "Cyclist speed (m/s)" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "A cyclist weighing 70 kg with an 8 kg bike wants to know the power needed to maintain 30 km/h with a 10 km/h headwind (wind angle 0°). The cyclist's CdA is 0.3 m² and rolling resistance coefficient is 0.004.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert speeds to m/s: 30 km/h = 8.33 m/s, 10 km/h = 2.78 m/s. Calculate relative wind speed: 8.33 + 2.78 × cos(0°) = 11.11 m/s.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate rolling resistance force: (70 + 8) × 9.81 × 0.004 = 3.07 N.",
          },
          {
            label: "Step 3",
            explanation:
              "Calculate aerodynamic drag force: 0.5 × 1.225 × 0.3 × (11.11)² = 22.7 N.",
          },
          {
            label: "Step 4",
            explanation:
              "Sum forces: 3.07 + 22.7 = 25.77 N. Calculate power: 25.77 × 8.33 = 214.7 W.",
          },
        ],
        result: "The cyclist needs approximately 215 watts to maintain 30 km/h with the given wind conditions.",
      }}
      relatedCalculators={[
        { title: "Training Weight Percentage Calculator", url: "/sports/training-weight-percentage", icon: "🏆" },
        { title: "Body Fat Percentage Calculator (Athletes)", url: "/sports/body-fat-percentage", icon: "🔥" },
        { title: "Cycling Cadence Calculator", url: "/sports/cycling-cadence", icon: "🏆" },
        { title: "Calorie Deficit / Surplus Calculator", url: "/sports/calorie-deficit-surplus", icon: "🔥" },
        { title: "Golf Expected Putts per Round", url: "/sports/golf-expected-putts-per-round", icon: "⛳" },
        { title: "Betting Odds & Payout Calculator", url: "/sports/betting-odds-payout-calculator", icon: "🏆" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding" },
        { id: "how-to", label: "How to Use" },
        { id: "tips", label: "Training Tips" },
        { id: "faq", label: "FAQ" },
        { id: "references", label: "References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}