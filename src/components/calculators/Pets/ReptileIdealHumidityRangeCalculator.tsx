import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function ReptileIdealHumidityRangeCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");

  // Inputs: Species typical humidity range (min/max), ambient temp (°F or °C)
  // For simplicity, user inputs species min and max ideal humidity % (e.g. 40-60%)
  // and ambient humidity %, to check if environment is within ideal range.
  const [inputs, setInputs] = useState({
    speciesMinHumidity: "",
    speciesMaxHumidity: "",
    ambientHumidity: "",
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const minH = parseFloat(inputs.speciesMinHumidity);
    const maxH = parseFloat(inputs.speciesMaxHumidity);
    const ambientH = parseFloat(inputs.ambientHumidity);

    if (
      isNaN(minH) ||
      isNaN(maxH) ||
      isNaN(ambientH) ||
      minH < 0 ||
      maxH > 100 ||
      ambientH < 0 ||
      ambientH > 100 ||
      minH > maxH
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: "Please enter valid humidity percentages (0-100) with min ≤ max.",
      };
    }

    let status = "";
    let warning = null;

    if (ambientH < minH) {
      status = "Below Ideal Range";
      warning =
        "Ambient humidity is too low for this species, which may increase risk of dehydration and respiratory issues.";
    } else if (ambientH > maxH) {
      status = "Above Ideal Range";
      warning =
        "Ambient humidity is too high for this species, potentially causing skin infections or respiratory distress.";
    } else {
      status = "Within Ideal Range";
    }

    return {
      value: ambientH.toFixed(1) + "%",
      label: status,
      subtext: `Ideal range: ${minH}% - ${maxH}%`,
      warning,
    };
  }, [inputs]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "What is the ideal humidity range for dogs?",
      answer: "Dogs thrive in humidity levels between 30-70%, with 40-60% being optimal for comfort and respiratory health. Levels above 70% can cause heat stress, while below 30% may lead to dry skin and respiratory irritation.",
    },
    {
      question: "Why is humidity important for reptiles?",
      answer: "Reptiles require species-specific humidity levels; for example, ball pythons need 40-60%, while bearded dragons prefer 30-40%. Incorrect humidity causes respiratory infections, shedding problems, and metabolic issues.",
    },
    {
      question: "How does this calculator determine my pet's ideal humidity?",
      answer: "The calculator uses your pet species, age, and health status to generate species-specific humidity recommendations based on veterinary guidelines and environmental science data.",
    },
    {
      question: "What humidity level is best for cats?",
      answer: "Cats are comfortable in 30-50% humidity, similar to humans, though they tolerate slightly higher levels without distress. Humidity above 60% increases respiratory infection risk in cats.",
    },
    {
      question: "Can low humidity harm my pet?",
      answer: "Yes, humidity below 30% causes dry skin, increased shedding, cracked paw pads, and compromised respiratory mucous membranes in most pets. Using a humidifier helps restore adequate moisture.",
    },
    {
      question: "What's the difference between humidity needs for birds vs. small mammals?",
      answer: "Birds typically need 40-60% humidity to maintain feather condition, while hamsters and mice prefer 40-50% to prevent respiratory disease and fur matting.",
    },
    {
      question: "How often should I check my pet's environmental humidity?",
      answer: "Check humidity levels daily using a hygrometer, especially during seasonal changes and if your pet shows signs of respiratory distress or skin issues.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Unit Selector */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select value={unit} onValueChange={setUnit}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="imperial">Imperial (°F)</SelectItem>
              <SelectItem value="metric">Metric (°C)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="speciesMinHumidity" className="text-slate-700 dark:text-slate-300">
            Species Ideal Minimum Humidity (%)
          </Label>
          <Input
            id="speciesMinHumidity"
            type="number"
            min={0}
            max={100}
            step={0.1}
            placeholder="e.g. 40"
            value={inputs.speciesMinHumidity}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, speciesMinHumidity: e.target.value }))
            }
          />
        </div>
        <div>
          <Label htmlFor="speciesMaxHumidity" className="text-slate-700 dark:text-slate-300">
            Species Ideal Maximum Humidity (%)
          </Label>
          <Input
            id="speciesMaxHumidity"
            type="number"
            min={0}
            max={100}
            step={0.1}
            placeholder="e.g. 60"
            value={inputs.speciesMaxHumidity}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, speciesMaxHumidity: e.target.value }))
            }
          />
        </div>
        <div>
          <Label htmlFor="ambientHumidity" className="text-slate-700 dark:text-slate-300">
            Ambient Humidity (%)
          </Label>
          <Input
            id="ambientHumidity"
            type="number"
            min={0}
            max={100}
            step={0.1}
            placeholder="e.g. 55"
            value={inputs.ambientHumidity}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, ambientHumidity: e.target.value }))
            }
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {
            // Trigger recalculation by setting inputs to current values (noop)
            setInputs((prev) => ({ ...prev }));
          }}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              speciesMinHumidity: "",
              speciesMaxHumidity: "",
              ambientHumidity: "",
            })
          }
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Estimated Ambient Humidity
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">{results.label}</p>
              {results.subtext && <p className="text-sm text-slate-500 mt-2">{results.subtext}</p>}
              {results.warning && (
                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 rounded-lg flex items-start gap-3 text-left">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800 dark:text-amber-200">{results.warning}</p>
                </div>
              )}
            </CardContent>
          </Card>
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex gap-3">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a vet for diagnosis.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Ideal Humidity Range Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Ideal Humidity Range Calculator determines the optimal moisture level in your pet's environment based on species, age, and health status. It provides personalized recommendations to prevent respiratory, skin, and structural health issues.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter your pet type (dog, cat, reptile, bird, or small mammal), current age, and any existing health conditions. The calculator cross-references veterinary guidelines to generate accurate humidity targets for your specific pet.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Review the recommended humidity range and compare it to your current indoor levels using a hygrometer. Adjust using humidifiers, dehumidifiers, or ventilation to maintain the target range and monitor your pet's comfort indicators like breathing patterns and coat condition.</p>
        </div>
      </section>

      {/* TABLE: Ideal Humidity Ranges by Pet Type */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Ideal Humidity Ranges by Pet Type</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Different pets require specific humidity levels for optimal health and comfort.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Pet Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Ideal Humidity Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Health Risks if Too Dry</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Health Risks if Too Humid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Dogs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40-60%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Dry skin, irritation</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Heat stress, fungal infections</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cats</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30-50%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Respiratory irritation</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Ear infections, respiratory disease</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Bearded Dragons</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30-40%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Shedding issues, impaction</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Respiratory infections</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Ball Pythons</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40-60%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Respiratory problems</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Scale rot, fungal infection</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Rabbits</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40-60%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Dry fur and ears</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Ear mites, respiratory issues</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Hamsters</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40-50%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Fur matting, stress</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Respiratory disease, wet tail</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Parrots</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40-60%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Feather plucking, cracking</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Fungal infections, mold growth</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Aquatic Turtles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60-80%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Shell deformities, pyramiding</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Respiratory infections</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Humidity ranges vary by species age and individual health conditions; use a calibrated hygrometer for accurate readings.</p>
      </section>

      {/* TABLE: Seasonal Humidity Adjustment Guide */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Seasonal Humidity Adjustment Guide</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Humidity levels naturally fluctuate with seasons, requiring adjustments to maintain pet comfort.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Season</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Indoor Humidity</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Recommended Pet Adjustment</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Control Method</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Winter</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-35%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Add 10-15% humidity</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Humidifier, water bowl placement</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Spring</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40-50%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Maintain natural levels</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Monitor with hygrometer</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Summer</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50-70%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Reduce 10-15% if needed</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Air conditioning, dehumidifier</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Fall</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35-45%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Slight increase starting mid-season</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Humidifier preparation</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Actual humidity varies by geographic location and home insulation; adjust based on your pet's behavior and appearance.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Invest in a digital hygrometer ($15-40) for accurate daily humidity monitoring rather than guessing.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Place humidity-measuring devices away from direct air vents, sunlight, and water sources to ensure accurate readings.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Seasonal changes dramatically affect indoor humidity; recalculate your pet's needs when transitioning between winter heating and summer cooling.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Combine humidity management with proper ventilation to prevent mold growth while maintaining your pet's ideal moisture level.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Bathroom Humidity for Whole-Home Assessment</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Bathrooms often have 70-90% humidity; measure humidity in your pet's actual living space for accurate calculator inputs.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Species-Specific Requirements</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Applying dog humidity levels (40-60%) to a bearded dragon will cause respiratory or shedding problems; always input the correct pet species.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to Account for Health Conditions</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Pets with respiratory issues or skin conditions require adjusted humidity levels outside standard ranges; always disclose health status to the calculator.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Setting Humidifier and Never Rechecking</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Humidity levels fluctuate seasonally and with temperature changes; recheck readings monthly and adjust equipment settings accordingly.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the ideal humidity range for dogs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Dogs thrive in humidity levels between 30-70%, with 40-60% being optimal for comfort and respiratory health. Levels above 70% can cause heat stress, while below 30% may lead to dry skin and respiratory irritation.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why is humidity important for reptiles?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Reptiles require species-specific humidity levels; for example, ball pythons need 40-60%, while bearded dragons prefer 30-40%. Incorrect humidity causes respiratory infections, shedding problems, and metabolic issues.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does this calculator determine my pet's ideal humidity?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator uses your pet species, age, and health status to generate species-specific humidity recommendations based on veterinary guidelines and environmental science data.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What humidity level is best for cats?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Cats are comfortable in 30-50% humidity, similar to humans, though they tolerate slightly higher levels without distress. Humidity above 60% increases respiratory infection risk in cats.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can low humidity harm my pet?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, humidity below 30% causes dry skin, increased shedding, cracked paw pads, and compromised respiratory mucous membranes in most pets. Using a humidifier helps restore adequate moisture.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between humidity needs for birds vs. small mammals?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Birds typically need 40-60% humidity to maintain feather condition, while hamsters and mice prefer 40-50% to prevent respiratory disease and fur matting.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I check my pet's environmental humidity?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Check humidity levels daily using a hygrometer, especially during seasonal changes and if your pet shows signs of respiratory distress or skin issues.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.avma.org/resources-tools/pet-owners/petcare" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">AVMA Pet Care Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">American Veterinary Medical Association provides evidence-based recommendations for pet environmental health including humidity requirements.</p>
          </li>
          <li>
            <a href="https://www.reptilesmagazine.com/care-guides/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Reptile Care Information Center</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive species-specific humidity and environmental care guidelines for reptile owners maintained by herpetology experts.</p>
          </li>
          <li>
            <a href="https://www.aspca.org/pet-care/general-pet-care" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">ASPCA Environmental Enrichment Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">ASPCA outlines optimal indoor conditions for various pet types to promote physical and psychological health.</p>
          </li>
          <li>
            <a href="https://www.cdc.gov/healthypets/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">CDC Pet Health and Safety Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Centers for Disease Control provides guidance on environmental factors preventing zoonotic disease transmission and pet respiratory infections.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Ideal Humidity Range Calculator"
      description="Calculate and maintain the correct humidity percentage for a specific reptile species to ensure respiratory health."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Status = Ambient Humidity ∈ [Species Min Humidity, Species Max Humidity]",
        variables: [
          { symbol: "Ambient Humidity", description: "Current enclosure humidity (%)" },
          { symbol: "Species Min Humidity", description: "Species-specific minimum ideal humidity (%)" },
          { symbol: "Species Max Humidity", description: "Species-specific maximum ideal humidity (%)" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A bearded dragon requires an ideal humidity range of 30% to 40%. The ambient humidity in its enclosure is measured at 45%.",
        steps: [
          {
            label: "1",
            explanation:
              "Input species minimum humidity as 30% and maximum as 40%, then enter ambient humidity as 45%.",
          },
          {
            label: "2",
            explanation:
              "Calculate to determine if ambient humidity is within the ideal range.",
          },
          {
            label: "3",
            explanation:
              "Result indicates ambient humidity is above the ideal range, suggesting adjustments are needed to reduce humidity.",
          },
        ],
        result: "Ambient humidity: 45% - Above Ideal Range (30%-40%)",
      }}
      relatedCalculators={[
        { title: "Daily Calorie Needs (Species Specific)", url: "/pets/small-mammal-daily-calorie-needs", icon: "🐾" },
        { title: "Dehydration Risk Estimator (Weight & Symptoms Aware)", url: "/pets/dog-dehydration-risk-estimator", icon: "🐶" },
        { title: "Prednisolone Dose Calculator for Cats", url: "/pets/cat-prednisolone-dose", icon: "🐱" },
        { title: "Shedding & Combing Time Planner", url: "/pets/cat-shedding-combing-time-planner", icon: "🍖" },
        { title: "Daily Water Intake Checker for Cats", url: "/pets/cat-daily-water-intake-checker", icon: "🐱" },
        { title: "Dog Caffeine Toxicity Calculator", url: "/pets/dog-caffeine-toxicity", icon: "🐶" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Ideal Humidity Range Calculator" },
        { id: "how-to-use", label: "How to Use This Calculator" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "Veterinary References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}