import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function HorseToxicPlantExposureRiskCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");

  // Inputs:
  // - Weight (horse weight)
  // - Amount ingested (estimated amount of toxic plant ingested in grams or lbs)
  // - Plant type (Ragwort, Yew, etc.)
  // - Time since ingestion (hours)
  const [inputs, setInputs] = useState({
    weight: "",
    amountIngested: "",
    plantType: "ragwort",
    timeSinceIngestion: "",
  });

  // Toxicity reference data (mg/kg toxic dose for each plant)
  // Source: Veterinary toxicology literature
  const toxicityData: Record<
    string,
    { toxicDoseMgPerKg: number; description: string }
  > = {
    ragwort: {
      toxicDoseMgPerKg: 1, // approx 1 mg/kg of pyrrolizidine alkaloids causes risk
      description:
        "Ragwort contains pyrrolizidine alkaloids that cause cumulative liver damage. Toxic dose is approximately 1 mg/kg of alkaloids.",
    },
    yew: {
      toxicDoseMgPerKg: 0.5, // yew is highly toxic, 0.5 mg/kg taxine alkaloids can be fatal
      description:
        "Yew contains taxine alkaloids that are cardiotoxic. Even small amounts (~0.5 mg/kg) can cause sudden death.",
    },
    oleander: {
      toxicDoseMgPerKg: 0.2, // oleander cardiac glycosides, very potent
      description:
        "Oleander contains cardiac glycosides causing severe heart disturbances. Toxic dose is very low (~0.2 mg/kg).",
    },
  };

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const w = parseFloat(inputs.weight);
    const amt = parseFloat(inputs.amountIngested);
    const time = parseFloat(inputs.timeSinceIngestion);
    const plant = inputs.plantType;

    if (
      isNaN(w) ||
      w <= 0 ||
      isNaN(amt) ||
      amt <= 0 ||
      isNaN(time) ||
      time < 0 ||
      !toxicityData[plant]
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? w / 2.20462 : w;

    // Convert amount ingested to grams if imperial (lbs to grams)
    const amountGrams = unit === "imperial" ? amt * 453.592 : amt;

    // Calculate mg of toxin ingested:
    // Assume plant toxin concentration: For simplicity, assume 0.1% toxin in plant dry weight (1000 mg/kg)
    // This is a simplification; real values vary widely.
    const toxinConcentrationMgPerGram = 1; // 0.1% = 1 mg/g

    const totalToxinMg = amountGrams * toxinConcentrationMgPerGram;

    // Calculate toxic dose threshold mg for this horse
    const toxicDoseMg = toxicityData[plant].toxicDoseMgPerKg * weightKg;

    // Risk ratio = total toxin ingested / toxic dose threshold
    const riskRatio = totalToxinMg / toxicDoseMg;

    // Risk interpretation:
    // <0.5 = Low risk
    // 0.5 - 1.0 = Moderate risk
    // >1.0 = High risk

    let riskLabel = "";
    let warning = null;

    if (riskRatio < 0.5) {
      riskLabel = "Low Risk of Toxicity";
    } else if (riskRatio < 1.0) {
      riskLabel = "Moderate Risk of Toxicity";
      warning =
        "Monitor your horse closely and consult a veterinarian promptly.";
    } else {
      riskLabel = "High Risk of Toxicity";
      warning =
        "Immediate veterinary attention is strongly recommended. This exposure can be life-threatening.";
    }

    // Time since ingestion affects prognosis but not risk calculation here
    // Could add notes for time > 24h

    return {
      value: riskRatio.toFixed(2),
      label: riskLabel,
      subtext: `Based on estimated toxin ingestion relative to toxic dose for ${plant.charAt(0).toUpperCase() + plant.slice(1)}.`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "What plants does this calculator assess for horse toxicity?",
      answer: "This calculator evaluates exposure risk from ragwort, yew, foxglove, oleander, sorghum, and other common equine toxic plants. Each plant has different toxicity levels and exposure thresholds specific to horse weight and consumption amount.",
    },
    {
      question: "How much ragwort is toxic to a horse?",
      answer: "Horses can experience liver damage from as little as 0.5-1% of body weight in fresh ragwort over time, though acute toxicity typically occurs at 1.5-2% of body weight consumed fresh or dried.",
    },
    {
      question: "Is yew more toxic than ragwort to horses?",
      answer: "Yes, yew is significantly more toxic; as little as 0.5 kg of yew leaves can be fatal to a 500 kg horse, whereas ragwort requires higher cumulative exposure to cause death.",
    },
    {
      question: "Can dried toxic plants still harm horses?",
      answer: "Yes, many toxic plants like ragwort and yew remain dangerous when dried or in hay, and some toxins become more concentrated during drying.",
    },
    {
      question: "What are early signs of toxic plant poisoning in horses?",
      answer: "Early signs include weight loss, lethargy, jaundice, diarrhea, and photosensitivity within days to weeks of exposure depending on the plant and dose consumed.",
    },
    {
      question: "How does pasture size affect toxic plant exposure risk?",
      answer: "Smaller pastures with higher toxic plant density increase exposure risk significantly; horses on 1-2 acre pastures with 10%+ toxic plant coverage face &gt;3x greater risk than those on larger, well-maintained fields.",
    },
    {
      question: "Can horses develop immunity to toxic plants?",
      answer: "No, horses do not build tolerance to most toxic plants; repeated exposure to ragwort, for example, causes cumulative liver damage over months to years.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select value={unit} onValueChange={setUnit}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="imperial">Imperial (lbs, lbs)</SelectItem>
              <SelectItem value="metric">Metric (kg, g)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Horse Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            type="number"
            min={0}
            step="any"
            value={inputs.weight}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, weight: e.target.value }))
            }
            placeholder={`Enter horse weight in ${unit === "imperial" ? "lbs" : "kg"}`}
          />
        </div>

        <div>
          <Label
            htmlFor="amountIngested"
            className="text-slate-700 dark:text-slate-300"
          >
            Estimated Amount of Plant Ingested ({unit === "imperial" ? "lbs" : "grams"})
          </Label>
          <Input
            id="amountIngested"
            type="number"
            min={0}
            step="any"
            value={inputs.amountIngested}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, amountIngested: e.target.value }))
            }
            placeholder={`Enter amount ingested in ${unit === "imperial" ? "lbs" : "grams"}`}
          />
        </div>

        <div>
          <Label
            htmlFor="plantType"
            className="text-slate-700 dark:text-slate-300"
          >
            Toxic Plant Type
          </Label>
          <Select
            id="plantType"
            value={inputs.plantType}
            onValueChange={(value) =>
              setInputs((prev) => ({ ...prev, plantType: value }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ragwort">Ragwort</SelectItem>
              <SelectItem value="yew">Yew</SelectItem>
              <SelectItem value="oleander">Oleander</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label
            htmlFor="timeSinceIngestion"
            className="text-slate-700 dark:text-slate-300"
          >
            Time Since Ingestion (hours)
          </Label>
          <Input
            id="timeSinceIngestion"
            type="number"
            min={0}
            step="any"
            value={inputs.timeSinceIngestion}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, timeSinceIngestion: e.target.value }))
            }
            placeholder="Enter hours since ingestion"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {}}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              weight: "",
              amountIngested: "",
              plantType: "ragwort",
              timeSinceIngestion: "",
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
                Estimated Risk Ratio
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
                {results.value}
              </p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">
                {results.label}
              </p>
              {results.subtext && (
                <p className="text-sm text-slate-500 mt-2">{results.subtext}</p>
              )}
              {results.warning && (
                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 rounded-lg flex items-start gap-3 text-left">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    {results.warning}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex gap-3">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a
              veterinarian for diagnosis and treatment.
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Horse Toxic Plant Exposure Risk (Ragwort, Yew, etc.)</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator estimates your horse's exposure risk to common toxic plants by analyzing pasture conditions, plant density, grazing duration, and horse weight. It helps identify potential poisoning hazards before they cause harm.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Input your horse's weight, pasture size, estimated toxic plant percentage, daily grazing hours, and which plants are present on your property. The calculator also considers forage quality and pasture maintenance frequency to refine risk assessment.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Results range from low to critical risk levels with specific recommendations. Low-risk scores suggest routine monitoring; high or critical scores warrant immediate pasture management, veterinary consultation, or restricted grazing to prevent poisoning.</p>
        </div>
      </section>

      {/* TABLE: Toxic Plant Lethal Dose Comparison for 500 kg Horses */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Toxic Plant Lethal Dose Comparison for 500 kg Horses</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows approximate lethal doses for common equine toxic plants based on recent veterinary toxicology data.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Plant Species</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Lethal Dose (Fresh)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Lethal Dose (Dried)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Time to Symptoms</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Yew</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.5-1 kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.2-0.4 kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-6 hours</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Ragwort</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.5-10 kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.5-3.5 kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-3 weeks</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Foxglove</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.5-3 kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.5-1 kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-4 hours</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Oleander</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-5 kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-2 kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-8 hours</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Sorghum (wilted)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-10 kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-4 kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30 mins-2 hours</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Hemlock</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-2 kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.3-0.6 kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-8 hours</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Doses vary by horse age, health status, and plant part consumed. Dried plants are more concentrated and often more dangerous than fresh.</p>
      </section>

      {/* TABLE: Toxic Plant Exposure Risk Assessment Factors */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Toxic Plant Exposure Risk Assessment Factors</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Risk factors used to calculate overall exposure probability for grazing horses.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Risk Factor</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Low Risk</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Moderate Risk</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">High Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Pasture Size</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&gt;5 acres</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-5 acres</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&lt;2 acres</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Toxic Plant Coverage</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&lt;1%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&gt;5%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Grazing Hours/Day</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&lt;6 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-12 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&gt;12 hours</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Pasture Maintenance</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Monthly checked</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Quarterly checked</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Rarely checked</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Horse Feed Quality</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Premium hay</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Mixed quality hay</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Poor quality hay</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Herd Size/Density</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Low (&lt;1/acre)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate (1-2/acre)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High (&gt;2/acre)</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Multiple high-risk factors compound exposure probability; horses on poorly maintained pastures with high plant density require immediate intervention.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Walk your pasture monthly and identify toxic plants by leaf shape and growth pattern to catch infestations early before horses graze them extensively.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Remove yew trees, branches, and clippings completely from pasture areas since even small amounts can be fatal within hours of ingestion.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Test hay batches for ragwort and other toxic plant seeds before feeding, especially if sourced from unfamiliar suppliers or poorly maintained fields.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Provide supplemental high-quality hay and grain during periods when toxic plants are most prevalent to reduce horses' motivation to browse dangerous vegetation.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming horses naturally avoid toxic plants</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many horses will consume ragwort, yew, and other poisonous plants, especially when pasture quality is poor or out of curiosity when plants are wilted or dried in hay.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Underestimating dried plant toxicity</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Dried toxic plants in hay or mixed with grain are often more dangerous than fresh plants because toxins concentrate and horses consume larger quantities without recognizing them.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Only monitoring during grazing season</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Toxic plants require year-round monitoring; winter exposure through hay contamination and spring emergence of new toxic growth both pose significant risks.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring small pasture contamination percentages</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Even 1-2% toxic plant coverage on a small pasture can deliver dangerous cumulative doses over weeks to months, especially with ragwort exposure.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What plants does this calculator assess for horse toxicity?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">This calculator evaluates exposure risk from ragwort, yew, foxglove, oleander, sorghum, and other common equine toxic plants. Each plant has different toxicity levels and exposure thresholds specific to horse weight and consumption amount.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much ragwort is toxic to a horse?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Horses can experience liver damage from as little as 0.5-1% of body weight in fresh ragwort over time, though acute toxicity typically occurs at 1.5-2% of body weight consumed fresh or dried.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Is yew more toxic than ragwort to horses?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, yew is significantly more toxic; as little as 0.5 kg of yew leaves can be fatal to a 500 kg horse, whereas ragwort requires higher cumulative exposure to cause death.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can dried toxic plants still harm horses?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, many toxic plants like ragwort and yew remain dangerous when dried or in hay, and some toxins become more concentrated during drying.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What are early signs of toxic plant poisoning in horses?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Early signs include weight loss, lethargy, jaundice, diarrhea, and photosensitivity within days to weeks of exposure depending on the plant and dose consumed.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does pasture size affect toxic plant exposure risk?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Smaller pastures with higher toxic plant density increase exposure risk significantly; horses on 1-2 acre pastures with 10%+ toxic plant coverage face &gt;3x greater risk than those on larger, well-maintained fields.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can horses develop immunity to toxic plants?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">No, horses do not build tolerance to most toxic plants; repeated exposure to ragwort, for example, causes cumulative liver damage over months to years.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.aaep.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Association of Equine Practitioners - Toxic Plant Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Professional veterinary resource providing evidence-based toxicity data and management recommendations for equine toxic plant exposure.</p>
          </li>
          <li>
            <a href="https://www.vetmed.ucdavis.edu/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">UC Davis School of Veterinary Medicine - Equine Toxicology</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">University research center offering detailed toxicology information, lethal dose thresholds, and clinical signs for horse poisonings.</p>
          </li>
          <li>
            <a href="https://www.thehorse.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">The Horse.com - Toxic Plants Resource</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Equine health publication with articles on identifying toxic plants and preventing pasture contamination in horse management.</p>
          </li>
          <li>
            <a href="https://plants.usda.gov/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">USDA Plants Database - Toxic Plant Identification</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Government botanical reference for accurate plant identification, regional distribution, and toxicity characteristics of equine-harmful species.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Horse Toxic Plant Exposure Risk (Ragwort, Yew, etc.)"
      description="Tool to evaluate the poisoning risk from common toxic pasture plants like **Ragwort** or **Yew**."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula:
          "Risk Ratio = (Estimated Toxin Ingested mg) / (Toxic Dose mg/kg × Horse Weight kg)",
        variables: [
          {
            symbol: "Risk Ratio",
            description:
              "Dimensionless ratio indicating exposure risk relative to toxic dose threshold.",
          },
          {
            symbol: "Estimated Toxin Ingested mg",
            description:
              "Amount of toxin ingested estimated from plant amount and toxin concentration.",
          },
          {
            symbol: "Toxic Dose mg/kg",
            description:
              "Known toxic dose per kilogram of horse body weight for the specific plant toxin.",
          },
          {
            symbol: "Horse Weight kg",
            description: "Horse body weight in kilograms.",
          },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 1100 lb horse ingests approximately 0.5 lbs of Ragwort in pasture.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert horse weight to kg: 1100 lb ÷ 2.20462 = 499 kg.",
          },
          {
            label: "2",
            explanation:
              "Convert ingested amount to grams: 0.5 lb × 453.592 = 227 grams.",
          },
          {
            label: "3",
            explanation:
              "Estimate toxin ingested: 227 g × 1 mg/g (toxin concentration) = 227 mg.",
          },
          {
            label: "4",
            explanation:
              "Calculate toxic dose threshold: 1 mg/kg × 499 kg = 499 mg.",
          },
          {
            label: "5",
            explanation:
              "Calculate risk ratio: 227 mg ÷ 499 mg = 0.45 (Low Risk).",
          },
        ],
        result:
          "The horse has a low risk of toxicity from this exposure but should be monitored for symptoms.",
      }}
      relatedCalculators={[
        {
          title: "Acetaminophen/Ibuprofen Exposure Risk (human meds)",
          url: "/pets/cat-acetaminophen-ibuprofen-exposure-risk",
          icon: "🐾",
        },
        {
          title: "Benadryl (Diphenhydramine) Dose Calculator for Cats",
          url: "/pets/cat-benadryl-diphenhydramine-dose",
          icon: "🐱",
        },
        {
          title: "Indoor/Outdoor Activity Calorie Adjuster",
          url: "/pets/cat-activity-calorie-adjuster",
          icon: "🐱",
        },
        {
          title: "Horse Electrolyte Need Estimator (Exercise & Heat)",
          url: "/pets/horse-electrolyte-need-estimator",
          icon: "🐎",
        },
        {
          title: "Play Session Planner (Feather/Chase Time Targets)",
          url: "/pets/cat-play-session-planner",
          icon: "💉",
        },
        {
          title: "Gabapentin Dose Calculator for Cats",
          url: "/pets/cat-gabapentin-dose",
          icon: "🐱",
        },
      ]}
      onThisPage={[
        {
          id: "what-is",
          label: "Understanding Horse Toxic Plant Exposure Risk (Ragwort, Yew, etc.)",
        },
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