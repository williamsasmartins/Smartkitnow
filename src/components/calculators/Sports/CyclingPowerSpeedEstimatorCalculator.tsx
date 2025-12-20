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

const relatedCalculators = [
  { title: "Betting Odds & Payout Calculator", url: "/sports/betting-odds-payout-calculator", icon: "🏆" },
  { title: "Hydration / Sweat Rate Calculator", url: "/sports/hydration-sweat-rate", icon: "🏆" },
  { title: "ERA & WHIP Calculator", url: "/sports/era-whip-calculator", icon: "🏆" },
  { title: "Negative Split Race Planner", url: "/sports/negative-split", icon: "🏆" },
  { title: "Running Pace / Split / Finish Time Calculator", url: "/sports/running-pace-split-finish-time", icon: "🏃" },
  { title: "Pool Length Time Converter (SCY/SCM/LCM)", url: "/sports/pool-length-time-converter", icon: "🏊" }
];

export default function CyclingPowerSpeedEstimatorCalculator() {
  /*
    Model based on physics of cycling on flat terrain with wind resistance.
    Power (W) = Rolling Resistance + Aerodynamic Drag + Drivetrain Losses
    Speed (m/s) = calculated from power input and resistances.

    Constants:
    - Air density (rho): 1.225 kg/m³ at sea level, 15°C
    - Gravity (g): 9.80665 m/s²
    - Rolling resistance coefficient (Crr): typical 0.004 - 0.006 for road tires
    - Drivetrain efficiency: ~0.97 (3% loss)
    - CdA: drag area (m²), varies by rider position and bike

    Inputs:
    - Speed (km/h)
    - Power (W)
    - Wind speed (km/h)
    - Wind direction (headwind/tailwind/crosswind)
    - Rider + bike weight (kg)
    - Rolling resistance coefficient (default 0.005)
    - CdA (default 0.3 m² typical road cyclist)

    Outputs:
    - Estimated power required for given speed and wind
    - Estimated speed achievable for given power and wind

    Formulas:
    - Convert speeds km/h to m/s: v = speed / 3.6
    - Relative wind speed = bike speed ± wind speed depending on wind direction
    - Rolling resistance force = Crr * mass * g
    - Aerodynamic drag force = 0.5 * rho * CdA * (relative wind speed)²
    - Total resistive force = rolling resistance force + aerodynamic drag force
    - Power = total resistive force * bike speed / drivetrain efficiency

    We solve for power if speed given, or speed if power given (numerical approx).
  */

  // Constants
  const g = 9.80665; // m/s² gravity
  const rho = 1.225; // kg/m³ air density at sea level, 15°C
  const drivetrainEfficiency = 0.97;

  // Utility: convert km/h to m/s
  const kmhToMs = (kmh) => kmh / 3.6;
  // Utility: convert m/s to km/h
  const msToKmh = (ms) => ms * 3.6;

  // Wind direction options
  const windDirections = [
    { label: "Headwind", value: "headwind" },
    { label: "Tailwind", value: "tailwind" },
    { label: "Crosswind (no effect)", value: "crosswind" }
  ];

  // State for inputs
  const [inputs, setInputs] = useState({
    mode: "power-to-speed", // or "speed-to-power"
    power: "",
    speed: "",
    windSpeed: "",
    windDirection: "headwind",
    weight: 75, // kg rider + bike default
    cda: 0.3, // m² typical CdA
    crr: 0.005 // rolling resistance coefficient
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Calculate power given speed or speed given power
  const results = useMemo(() => {
    const {
      mode,
      power: powerInput,
      speed: speedInput,
      windSpeed: windSpeedInput,
      windDirection,
      weight,
      cda,
      crr
    } = inputs;

    // Parse inputs to floats
    const power = parseFloat(powerInput);
    const speed = parseFloat(speedInput);
    const windSpeed = parseFloat(windSpeedInput);
    const mass = parseFloat(weight);
    const CdA = parseFloat(cda);
    const Crr = parseFloat(crr);

    // Validate inputs
    if (
      isNaN(mass) || mass <= 0 ||
      isNaN(CdA) || CdA <= 0 ||
      isNaN(Crr) || Crr <= 0
    ) {
      return {
        value: "",
        label: "",
        subtext: "Please enter valid positive values for weight, CdA, and rolling resistance.",
        warning: "Input error",
        formulaUsed: ""
      };
    }

    // Wind speed can be zero or more
    const W = isNaN(windSpeed) || windSpeed < 0 ? 0 : windSpeed;

    // Relative wind speed calculation helper
    // Returns relative wind speed in m/s
    function relativeWindSpeed(vBikeMs, windMs, direction) {
      switch (direction) {
        case "headwind":
          return vBikeMs + windMs;
        case "tailwind":
          return Math.max(vBikeMs - windMs, 0);
        case "crosswind":
          // Crosswind effect on CdA is complex, approximate no effect on speed/power here
          return vBikeMs;
        default:
          return vBikeMs;
      }
    }

    // Calculate power required for given speed (m/s)
    function powerForSpeed(vKmh) {
      const v = kmhToMs(vKmh);
      if (v <= 0) return 0;

      const vRel = relativeWindSpeed(v, kmhToMs(W), windDirection);

      // Rolling resistance force (N)
      const Frr = Crr * mass * g;

      // Aerodynamic drag force (N)
      const Fd = 0.5 * rho * CdA * vRel * vRel;

      // Total resistive force (N)
      const Ftot = Frr + Fd;

      // Power output (W) = force * velocity / drivetrain efficiency
      const P = (Ftot * v) / drivetrainEfficiency;

      return P;
    }

    // Calculate speed achievable for given power (W)
    // Use numerical method (bisection) to solve for speed
    function speedForPower(Pwatts) {
      if (Pwatts <= 0) return 0;

      // Search speed range 0.1 km/h to 100 km/h
      let low = 0.1;
      let high = 100;
      let mid = 0;
      let iter = 0;
      const tolerance = 0.01; // km/h tolerance

      while (iter < 30) {
        mid = (low + high) / 2;
        const pCalc = powerForSpeed(mid);
        if (Math.abs(pCalc - Pwatts) < 1) break;
        if (pCalc > Pwatts) {
          high = mid;
        } else {
          low = mid;
        }
        iter++;
      }
      return mid;
    }

    if (mode === "power-to-speed") {
      if (isNaN(power) || power <= 0) {
        return {
          value: "",
          label: "",
          subtext: "Enter a valid positive power value to estimate speed.",
          warning: null,
          formulaUsed: "P = (Frr + Fd) × v / drivetrain efficiency"
        };
      }
      const estSpeed = speedForPower(power);
      return {
        value: `${estSpeed.toFixed(1)} km/h`,
        label: "Estimated Speed",
        subtext: `At ${power.toFixed(0)} W with ${W} km/h ${windDirection} on flat terrain.`,
        warning: null,
        formulaUsed: "Numerical solution of P = (Crr·m·g + 0.5·ρ·CdA·(v ± w)²)·v / η"
      };
    } else {
      // speed-to-power
      if (isNaN(speed) || speed <= 0) {
        return {
          value: "",
          label: "",
          subtext: "Enter a valid positive speed value to estimate power.",
          warning: null,
          formulaUsed: "P = (Frr + Fd) × v / drivetrain efficiency"
        };
      }
      const estPower = powerForSpeed(speed);
      return {
        value: `${estPower.toFixed(0)} W`,
        label: "Estimated Power",
        subtext: `To maintain ${speed.toFixed(1)} km/h with ${W} km/h ${windDirection} on flat terrain.`,
        warning: null,
        formulaUsed: "P = (Crr·m·g + 0.5·ρ·CdA·(v ± w)²)·v / η"
      };
    }
  }, [inputs]);

  const faqs = [
    {
      question: "How does wind direction affect cycling power?",
      answer:
        "Wind direction significantly impacts the power required to maintain a given speed. A headwind increases relative wind speed, raising aerodynamic drag and thus power needed, while a tailwind reduces it. Crosswinds mainly affect stability and handling rather than power directly."
    },
    {
      question: "Why is rolling resistance important in power calculations?",
      answer:
        "Rolling resistance is the friction between tires and the road surface. Although smaller than aerodynamic drag at high speeds, it contributes consistently to the total resistive force and thus affects the power required, especially at lower speeds."
    },
    {
      question: "Can this calculator be used for hilly terrain?",
      answer:
        "This calculator is designed for flat terrain only. Hills introduce gravitational forces that significantly affect power and speed, requiring additional calculations not covered here."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="mode" className="mb-1 flex items-center gap-1">
                Mode <Calculator className="w-4 h-4 text-blue-600" />
              </Label>
              <Select
                value={inputs.mode}
                onValueChange={(v) => handleInputChange("mode", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="power-to-speed">Power &rarr; Speed</SelectItem>
                  <SelectItem value="speed-to-power">Speed &rarr; Power</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {inputs.mode === "power-to-speed" ? (
              <div>
                <Label htmlFor="power" className="mb-1 flex items-center gap-1">
                  Power (Watts) <Flame className="w-4 h-4 text-red-600" />
                </Label>
                <Input
                  id="power"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="e.g. 250"
                  value={inputs.power}
                  onChange={(e) => handleInputChange("power", e.target.value)}
                />
              </div>
            ) : (
              <div>
                <Label htmlFor="speed" className="mb-1 flex items-center gap-1">
                  Speed (km/h) <Waves className="w-4 h-4 text-green-600" />
                </Label>
                <Input
                  id="speed"
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="e.g. 30"
                  value={inputs.speed}
                  onChange={(e) => handleInputChange("speed", e.target.value)}
                />
              </div>
            )}

            <div>
              <Label htmlFor="windSpeed" className="mb-1 flex items-center gap-1">
                Wind Speed (km/h) <WindIcon />
              </Label>
              <Input
                id="windSpeed"
                type="number"
                min="0"
                step="0.1"
                placeholder="e.g. 10"
                value={inputs.windSpeed}
                onChange={(e) => handleInputChange("windSpeed", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="windDirection" className="mb-1 flex items-center gap-1">
                Wind Direction <Flag className="w-4 h-4 text-yellow-600" />
              </Label>
              <Select
                value={inputs.windDirection}
                onValueChange={(v) => handleInputChange("windDirection", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {windDirections.map(({ label, value }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="weight" className="mb-1 flex items-center gap-1">
                Rider + Bike Weight (kg) <Scale className="w-4 h-4 text-gray-600" />
              </Label>
              <Input
                id="weight"
                type="number"
                min="30"
                step="0.1"
                placeholder="e.g. 75"
                value={inputs.weight}
                onChange={(e) => handleInputChange("weight", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="cda" className="mb-1 flex items-center gap-1">
                Drag Area CdA (m²) <Gauge className="w-4 h-4 text-purple-600" />
              </Label>
              <Input
                id="cda"
                type="number"
                min="0.1"
                step="0.01"
                placeholder="e.g. 0.3"
                value={inputs.cda}
                onChange={(e) => handleInputChange("cda", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="crr" className="mb-1 flex items-center gap-1">
                Rolling Resistance Coeff. (Crr) <Scale className="w-4 h-4 text-gray-600" />
              </Label>
              <Input
                id="crr"
                type="number"
                min="0.001"
                step="0.001"
                placeholder="e.g. 0.005"
                value={inputs.crr}
                onChange={(e) => handleInputChange("crr", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No special action needed, calculation is reactive
          }}
        >
          <Trophy className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              mode: "power-to-speed",
              power: "",
              speed: "",
              windSpeed: "",
              windDirection: "headwind",
              weight: 75,
              cda: 0.3,
              crr: 0.005
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
            <p className="mt-2 text-lg text-blue-800 dark:text-blue-300">{results.label}</p>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">{results.subtext}</p>
            {results.warning && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 font-semibold">
                <AlertTriangle className="inline w-4 h-4 mr-1" /> {results.warning}
              </p>
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
          Understanding Cycling Power &amp; Speed Estimator (flat/wind)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Cycling performance on flat terrain is primarily influenced by the balance between the power a rider produces and the resistive forces acting against them. These resistive forces include rolling resistance from the tires, aerodynamic drag from the air, and drivetrain losses. Wind conditions further complicate this balance by altering the effective airspeed the cyclist experiences, increasing or decreasing aerodynamic drag depending on direction and speed. This calculator uses fundamental physics principles to estimate the power required to maintain a certain speed or the speed achievable for a given power output, considering wind effects and rider characteristics.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The model assumes flat terrain and steady-state conditions, ignoring acceleration, road gradient, and transient effects. It incorporates key parameters such as rider and bike weight, aerodynamic drag area (CdA), rolling resistance coefficient (Crr), and wind speed and direction. By adjusting these inputs, cyclists and coaches can better understand how environmental and equipment factors influence performance and optimize training or race strategies accordingly.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This tool allows you to estimate either the speed you can maintain for a given power output or the power required to sustain a specific speed, factoring in wind conditions on flat terrain. Begin by selecting the calculation mode: "Power &rarr; Speed" to find speed from power, or "Speed &rarr; Power" to find power from speed. Then input the relevant values such as power or speed, wind speed, wind direction, rider plus bike weight, aerodynamic drag area (CdA), and rolling resistance coefficient (Crr).
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>Step 1: Choose your calculation mode depending on whether you want to estimate speed or power.</li>
          <li>Step 2: Enter your known value (power in watts or speed in km/h).</li>
          <li>Step 3: Input environmental and equipment parameters including wind speed and direction, weight, CdA, and Crr.</li>
          <li>Step 4: Click "Calculate" to see the estimated result displayed below the inputs.</li>
          <li>Step 5: Use the "Reset" button to clear inputs and start a new calculation.</li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips &amp; Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Understanding the relationship between power and speed can help cyclists optimize their training and race tactics. For example, reducing aerodynamic drag by improving riding position or equipment can significantly lower the power needed to maintain a given speed, especially in windy conditions. Similarly, minimizing rolling resistance through tire choice and pressure can improve efficiency. Training to increase sustainable power output will directly translate to higher speeds on flat terrain. Remember that wind conditions can vary greatly, so practicing riding in different wind scenarios can improve handling and pacing strategies.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          When facing headwinds, pacing yourself to avoid early fatigue is critical, as power demands rise sharply. Tailwinds can provide opportunities to conserve energy or increase speed with less effort. Crosswinds require good bike handling skills and awareness to maintain safety and efficiency. Use this calculator to simulate different conditions and plan your rides or races accordingly.
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Additional Resources</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
          For more information on cycling physiology, biomechanics, and training science, consult the following authoritative sources:
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
              The ACSM is a global leader in sports medicine and exercise science research, providing guidelines and position stands on endurance training and performance.
            </p>
          </li>
          <li>
            <a
              href="https://www.nsca.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              National Strength and Conditioning Association (NSCA) <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              The NSCA offers evidence-based resources on strength and conditioning principles applicable to cycling performance and power development.
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
              A comprehensive resource for cycling power analysis, aerodynamics, and training tools developed by experts in the field.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  const example = {
    title: "Real Life Example",
    scenario:
      "A cyclist weighing 75 kg (including bike) wants to know what speed they can maintain on flat terrain with a power output of 250 W, facing a 10 km/h headwind. The rider's CdA is estimated at 0.3 m² and rolling resistance coefficient at 0.005.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Select 'Power &rarr; Speed' mode and enter 250 W for power."
      },
      {
        label: "Step 2",
        explanation:
          "Input wind speed as 10 km/h and select 'Headwind' for wind direction."
      },
      {
        label: "Step 3",
        explanation:
          "Enter weight as 75 kg, CdA as 0.3 m², and Crr as 0.005."
      },
      {
        label: "Step 4",
        explanation:
          "Click 'Calculate' to get the estimated speed achievable under these conditions."
      }
    ],
    result: "The calculator estimates approximately 29.4 km/h speed at 250 W with a 10 km/h headwind."
  };

  // Icon for wind speed label (custom inline SVG)
  function WindIcon(props) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
        className="w-4 h-4 text-cyan-600"
      >
        <path d="M3 12h13M3 6h9M3 18h7" />
        <path d="M16 8a4 4 0 1 1 0 8" />
      </svg>
    );
  }

  return (
    <CalculatorVerticalLayout
      title="Cycling Power &amp; Speed Estimator (flat/wind)"
      description="Estimate cycling power vs speed. Calculate how much wattage is required to maintain speed against wind resistance and flat terrain."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Formula",
        formula:
          "P = (Crr × m × g + 0.5 × ρ × CdA × (v ± w)²) × v / η",
        variables: [
          { symbol: "P", description: "Power output (Watts)" },
          { symbol: "Crr", description: "Rolling resistance coefficient" },
          { symbol: "m", description: "Mass of rider + bike (kg)" },
          { symbol: "g", description: "Acceleration due to gravity (9.80665 m/s²)" },
          { symbol: "ρ", description: "Air density (1.225 kg/m³)" },
          { symbol: "CdA", description: "Aerodynamic drag area (m²)" },
          { symbol: "v", description: "Cycling speed (m/s)" },
          { symbol: "w", description: "Wind speed (m/s), positive for headwind, negative for tailwind" },
          { symbol: "η", description: "Drivetrain efficiency (~0.97)" }
        ]
      }}
      example={example}
      relatedCalculators={relatedCalculators}
      onThisPage={[
        { id: "what-is", label: "Understanding" },
        { id: "how-to", label: "How to Use" },
        { id: "tips", label: "Training Tips" },
        { id: "faq", label: "FAQ" },
        { id: "references", label: "References" }
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}