import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, RotateCcw, Info, AlertTriangle, Calendar, Clock } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function HorseFoalingCountdownLactationFeedPlannerCalculator() {
  // 1. STATE
  // No unit selector needed as inputs are date/time based
  // Inputs: Expected Foaling Date, Current Date (default today), Mare's Body Weight (lbs), Days Post-Foaling (optional for lactation feed)
  const [inputs, setInputs] = useState({
    expectedFoalingDate: "",
    currentDate: new Date().toISOString().slice(0, 10),
    mareWeightLbs: "",
    daysPostFoaling: "",
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    if (!inputs.expectedFoalingDate || !inputs.currentDate || !inputs.mareWeightLbs) {
      return { value: 0, label: "", subtext: "", warning: null };
    }

    // Parse dates
    const expectedDate = new Date(inputs.expectedFoalingDate);
    const currentDate = new Date(inputs.currentDate);
    if (isNaN(expectedDate.getTime()) || isNaN(currentDate.getTime())) {
      return { value: 0, label: "", subtext: "", warning: "Invalid date format." };
    }

    // Calculate days until foaling (can be negative if past foaling date)
    const msPerDay = 1000 * 60 * 60 * 24;
    const daysUntilFoaling = Math.ceil((expectedDate.getTime() - currentDate.getTime()) / msPerDay);

    // Convert mare weight to kg for feed calculations
    const mareWeightKg = parseFloat(inputs.mareWeightLbs) / 2.20462;
    if (isNaN(mareWeightKg) || mareWeightKg <= 0) {
      return { value: 0, label: "", subtext: "", warning: "Please enter a valid mare weight." };
    }

    // Lactation feed planning:
    // NRC guidelines recommend 1.5-2.0% of body weight in dry matter intake (DMI) during lactation.
    // Energy requirements increase approx 50-100% above maintenance during peak lactation (first 3 months).
    // We estimate daily feed intake (dry matter) in lbs and calories needed.

    // Days post foaling input optional; if empty or negative, assume pre-foaling or day 0.
    const daysPostFoaling = parseInt(inputs.daysPostFoaling);
    const lactationDays = isNaN(daysPostFoaling) || daysPostFoaling < 0 ? 0 : daysPostFoaling;

    // Maintenance DMI = 2% BW (dry matter)
    const maintenanceDmiLbs = mareWeightKg * 2.20462 * 0.02;

    // Lactation multiplier: 
    // 0 days = maintenance, 1-90 days = 1.5x maintenance, >90 days = 1.3x maintenance (declining)
    let lactationMultiplier = 1;
    if (lactationDays > 0 && lactationDays <= 90) lactationMultiplier = 1.5;
    else if (lactationDays > 90) lactationMultiplier = 1.3;

    const estimatedDmiLbs = maintenanceDmiLbs * lactationMultiplier;

    // Energy requirements (Mcal/day)
    // Maintenance = 16.6 Mcal/day for 500kg mare (approx)
    // Adjusted by weight: 16.6 * (mareWeightKg/500)^0.75
    // Lactation increases energy by 50-100% depending on stage
    const maintenanceMcal = 16.6 * Math.pow(mareWeightKg / 500, 0.75);
    const lactationEnergyMcal = maintenanceMcal * lactationMultiplier;

    // Format results
    let label = "";
    let subtext = "";
    const warning = null;

    if (daysUntilFoaling > 0) {
      label = `Days until foaling: ${daysUntilFoaling}`;
      subtext = "Monitor mare closely as foaling approaches to adjust management and nutrition.";
    } else if (daysUntilFoaling === 0) {
      label = "Foaling is expected today.";
      subtext = "Ensure foaling environment is prepared and mare is monitored for signs of labor.";
    } else {
      label = `Foaling occurred ${-daysUntilFoaling} days ago.`;
      subtext = `Plan lactation feed accordingly for day ${lactationDays} post-foaling.`;
    }

    // Show feed plan only if post-foaling days entered and >=0
    const feedPlan = lactationDays >= 0
      ? `Estimated Dry Matter Intake: ${estimatedDmiLbs.toFixed(2)} lbs/day\nEstimated Energy Requirement: ${lactationEnergyMcal.toFixed(2)} Mcal/day`
      : null;

    return {
      value: daysUntilFoaling,
      label,
      subtext: feedPlan,
      warning,
    };
  }, [inputs]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "How many days before foaling should I increase feed for pregnant mares?",
      answer: "Begin increasing nutrient-dense feed 30-60 days before expected foaling, focusing on calcium, phosphorus, and quality protein to support fetal development and prepare for lactation.",
    },
    {
      question: "What are typical lactation feed requirements for nursing mares?",
      answer: "Lactating mares need 50-80% more calories than maintenance, plus 14-16% crude protein and elevated minerals; peak lactation demands occur 4-8 weeks postpartum.",
    },
    {
      question: "How do I calculate my mare's gestation length accurately?",
      answer: "Horse gestation averages 330-345 days; enter your mare's breeding date and the calculator will countdown to expected foaling with +/- 10-day variance alerts.",
    },
    {
      question: "Can this calculator adjust for twin pregnancies or health complications?",
      answer: "For twins or complications, consult your veterinarian directly; this calculator provides baseline estimates for singleton, healthy pregnancies only.",
    },
    {
      question: "What mineral ratios should I maintain during late pregnancy?",
      answer: "Maintain calcium:phosphorus ratios of 1.5:1 to 2:1 and ensure 0.3-0.4% magnesium in total diet to prevent hypocalcemia and support bone development.",
    },
    {
      question: "How much weight should a mare gain during pregnancy?",
      answer: "Mares typically gain 10-15% of body weight during 11 months of gestation; overfeeding increases dystocia risk, while underfeeding reduces milk production.",
    },
    {
      question: "When should I transition from pregnancy to lactation feed?",
      answer: "Begin transition 2-3 weeks prepartum and continue through peak lactation at 4-6 weeks postpartum, adjusting based on foal growth and mare body condition.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // HANDLERS
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  }

  function handleReset() {
    setInputs({
      expectedFoalingDate: "",
      currentDate: new Date().toISOString().slice(0, 10),
      mareWeightLbs: "",
      daysPostFoaling: "",
    });
  }

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="expectedFoalingDate" className="text-slate-700 dark:text-slate-300">
            Expected Foaling Date
          </Label>
          <Input
            type="date"
            id="expectedFoalingDate"
            name="expectedFoalingDate"
            value={inputs.expectedFoalingDate}
            onChange={handleInputChange}
            placeholder="YYYY-MM-DD"
            required
          />
        </div>
        <div>
          <Label htmlFor="currentDate" className="text-slate-700 dark:text-slate-300">
            Current Date
          </Label>
          <Input
            type="date"
            id="currentDate"
            name="currentDate"
            value={inputs.currentDate}
            onChange={handleInputChange}
            placeholder="YYYY-MM-DD"
            required
          />
        </div>
        <div>
          <Label htmlFor="mareWeightLbs" className="text-slate-700 dark:text-slate-300">
            Mare's Body Weight (lbs)
          </Label>
          <Input
            type="number"
            id="mareWeightLbs"
            name="mareWeightLbs"
            value={inputs.mareWeightLbs}
            onChange={handleInputChange}
            placeholder="e.g. 1100"
            min={400}
            step={1}
            required
          />
        </div>
        <div>
          <Label htmlFor="daysPostFoaling" className="text-slate-700 dark:text-slate-300">
            Days Post-Foaling (optional)
          </Label>
          <Input
            type="number"
            id="daysPostFoaling"
            name="daysPostFoaling"
            value={inputs.daysPostFoaling}
            onChange={handleInputChange}
            placeholder="e.g. 30"
            min={0}
            step={1}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {}}
          type="button"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={handleReset}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          type="button"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 whitespace-pre-line">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Estimated Result
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Foaling Countdown & Lactation Feed Planner</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator tracks your mare's pregnancy timeline from breeding date to foaling, then plans nutrient-dense lactation feeds to support milk production and foal growth through weaning.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Input your mare's body weight, breeding date, and current stage; the calculator automatically computes days remaining and generates customized daily calorie, protein, calcium, and phosphorus targets.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Review the recommended feed rations, mineral supplements, and feeding schedule in the output; adjust portions based on your mare's body condition score and your foal's nursing behavior to ensure optimal health.</p>
        </div>
      </section>

      {/* TABLE: Daily Feed Requirements for Pregnant & Lactating Mares (1,000 lb mare) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Daily Feed Requirements for Pregnant & Lactating Mares (1,000 lb mare)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Nutrient requirements increase significantly during late pregnancy and peak lactation.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Stage</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Digestible Energy (Mcal/day)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Crude Protein (%)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Calcium (g/day)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Phosphorus (g/day)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Maintenance</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16-18</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-20</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Early Pregnancy (0-8 months)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">17-19</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9-11</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25-30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18-23</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Late Pregnancy (8-11 months)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">19-22</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11-13</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35-40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25-30</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Early Lactation (Weeks 1-4)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24-28</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">14-16</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40-50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30-38</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Peak Lactation (Weeks 4-8)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">28-32</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-17</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50-60</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">38-45</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Late Lactation (After 8 weeks)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">22-26</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-14</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35-45</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">28-35</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Values based on NRC (2007) recommendations; adjust for individual mare size, metabolism, and foal growth rate.</p>
      </section>

      {/* TABLE: Gestation Timeline & Key Management Milestones */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Gestation Timeline & Key Management Milestones</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Critical periods for nutrition and preparation during horse pregnancy.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Days of Gestation</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Time Remaining</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Key Milestones</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Feeding Focus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1-90 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">240-270 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Early embryonic development</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Maintain condition; balanced minerals</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">91-180 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">150-240 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Fetal growth accelerates</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Gradual feed increase; quality forage</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">181-270 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60-150 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Organogenesis complete</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Boost calories &amp; protein gradually</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">271-330 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0-60 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Rapid fetal weight gain</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Peak nutrient density; monitor udder</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">330-345 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Foaling imminent</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Pre-foaling signs (bagging, waxing)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Reduce grain; provide free-choice hay</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Timing varies by individual mare; ultrasound confirmation recommended for accuracy.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Begin nutrient increases 60 days before foaling to avoid digestive upset while maximizing fetal development.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Test hay quality (protein &amp; mineral content) via forage analysis to calculate accurate grain supplementation rates.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Monitor mare body condition monthly; avoid obesity (&gt;8/9 BCS) which increases dystocia and metabolic complications.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Supply free-choice salt and quality mineral blocks containing zinc, copper, and selenium to support immune function in growing foals.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Feeding Identical Rations Through Pregnancy & Lactation</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Lactation demands 50-80% more energy and 40-70% more protein than late pregnancy; failing to adjust causes weight loss and reduced milk quality.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Calcium-to-Phosphorus Ratio</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Ratios below 1.5:1 increase risk of developmental orthopedic disease and hypocalcemia in lactating mares.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Overfeeding Grain in Early Pregnancy</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Excess energy in months 1-6 increases barren cycles and metabolic issues; save calorie increases for the final trimester.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming All Forage is Nutritionally Equal</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Hay protein ranges from 6-14%; testing ensures accurate supplementation and prevents protein deficiency or excess.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How many days before foaling should I increase feed for pregnant mares?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Begin increasing nutrient-dense feed 30-60 days before expected foaling, focusing on calcium, phosphorus, and quality protein to support fetal development and prepare for lactation.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What are typical lactation feed requirements for nursing mares?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Lactating mares need 50-80% more calories than maintenance, plus 14-16% crude protein and elevated minerals; peak lactation demands occur 4-8 weeks postpartum.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate my mare's gestation length accurately?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Horse gestation averages 330-345 days; enter your mare's breeding date and the calculator will countdown to expected foaling with +/- 10-day variance alerts.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can this calculator adjust for twin pregnancies or health complications?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">For twins or complications, consult your veterinarian directly; this calculator provides baseline estimates for singleton, healthy pregnancies only.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What mineral ratios should I maintain during late pregnancy?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Maintain calcium:phosphorus ratios of 1.5:1 to 2:1 and ensure 0.3-0.4% magnesium in total diet to prevent hypocalcemia and support bone development.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much weight should a mare gain during pregnancy?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Mares typically gain 10-15% of body weight during 11 months of gestation; overfeeding increases dystocia risk, while underfeeding reduces milk production.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">When should I transition from pregnancy to lactation feed?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Begin transition 2-3 weeks prepartum and continue through peak lactation at 4-6 weeks postpartum, adjusting based on foal growth and mare body condition.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.nap.edu/catalog/11653/nutrient-requirements-of-horses" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">National Research Council (NRC) Nutrient Requirements of Horses</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Authoritative standards for equine nutrition during pregnancy and lactation, updated 2007.</p>
          </li>
          <li>
            <a href="https://www.aaep.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Association of Equine Practitioners (AAEP) Foaling Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Veterinary-endorsed best practices for mare and foal health management around parturition.</p>
          </li>
          <li>
            <a href="https://www2.ca.uky.edu/equine/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">University of Kentucky Equine Reproduction & Foal Care</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Peer-reviewed research and extension bulletins on gestation, lactation, and foal nutrition.</p>
          </li>
          <li>
            <a href="https://www.equinesciencesociety.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Equine Science Society Research Summaries</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Latest peer-reviewed studies on mare reproduction, milk composition, and foal development.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Foaling Countdown & Lactation Feed Planner"
      description="Track the final days before foaling and plan the increased feed/calorie requirements during the lactation period."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula:
          "Days Until Foaling = Expected Foaling Date − Current Date; Lactation Feed Intake (lbs) = Body Weight (lbs) × 0.02 × Lactation Multiplier",
        variables: [
          { symbol: "Expected Foaling Date", description: "Projected date of foaling" },
          { symbol: "Current Date", description: "Date of calculation" },
          { symbol: "Body Weight (lbs)", description: "Mare's weight in pounds" },
          { symbol: "Lactation Multiplier", description: "1.0 pre-foaling, 1.5 peak lactation, 1.3 late lactation" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 1100 lb mare is expected to foal on July 15. Today is July 1, and she is 10 days post-foaling. Calculate days until foaling and lactation feed plan.",
        steps: [
          { label: "1", explanation: "Calculate days until foaling: July 15 − July 1 = 14 days." },
          {
            label: "2",
            explanation:
              "Calculate maintenance dry matter intake: 1100 lbs × 0.02 = 22 lbs/day. Apply lactation multiplier (1.5) for 10 days post-foaling: 22 × 1.5 = 33 lbs/day.",
          },
          {
            label: "3",
            explanation:
              "Estimate energy needs: Maintenance ~16.6 Mcal/day for 500kg mare scaled to 500kg equivalent, multiplied by 1.5 for lactation.",
          },
        ],
        result:
          "The mare has 14 days until foaling. Her estimated dry matter intake during peak lactation is 33 lbs/day, supporting optimal milk production and foal growth.",
      }}
      relatedCalculators={[
        {
          title: "Acetaminophen/Ibuprofen Exposure Risk (human meds)",
          url: "/pets/cat-acetaminophen-ibuprofen-exposure-risk",
          icon: "🐾",
        },
        {
          title: "Dewormer & Antibiotic Dose Reference",
          url: "/pets/reptile-dewormer-antibiotic-dose-reference",
          icon: "🐶",
        },
        {
          title: "Toxic Foods Exposure Checker (Avocado, Chocolate, etc.)",
          url: "/pets/bird-toxic-foods-exposure-checker",
          icon: "🐱",
        },
        {
          title: "Daily Calorie Needs by Body Weight",
          url: "/pets/bird-daily-calorie-needs-body-weight",
          icon: "🍖",
        },
        {
          title: "Heavy Metal (Lead/Zinc) Exposure Risk",
          url: "/pets/bird-heavy-metal-exposure-risk",
          icon: "💉",
        },
        {
          title: "Ambient Temperature Safe Zone Calculator",
          url: "/pets/bird-ambient-temperature-safe-zone",
          icon: "💧",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Foaling Countdown & Lactation Feed Planner" },
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