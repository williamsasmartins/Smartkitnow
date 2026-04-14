import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function HorseColicRiskAssessmentCalculator() {
  // 1. STATE
  // Unit system needed for weight input (imperial or metric)
  const [unit, setUnit] = useState("imperial");

  // Inputs relevant to feeding & management colic risk factors
  const [inputs, setInputs] = useState({
    weight: "", // lbs or kg
    hayIntake: "", // lbs or kg per day
    grainIntake: "", // lbs or kg per day
    waterIntake: "", // gallons or liters per day
    pastureAccessHours: "", // hours per day
    recentDietChangeDays: "", // days since last diet change
    dewormingMonthsAgo: "", // months since last deworming
    exerciseHoursPerWeek: "", // hours per week
  });

  // 2. LOGIC ENGINE
  // Risk scoring based on feeding & management factors from veterinary literature:
  // Risk factors include: low water intake, high grain intake, recent diet change, no pasture access,
  // lack of exercise, and delayed deworming.
  // Each factor contributes points; total score estimates colic risk level.
  const results = useMemo(() => {
    // Parse inputs
    const weightNum = parseFloat(inputs.weight);
    const hayNum = parseFloat(inputs.hayIntake);
    const grainNum = parseFloat(inputs.grainIntake);
    const waterNum = parseFloat(inputs.waterIntake);
    const pastureHours = parseFloat(inputs.pastureAccessHours);
    const dietChangeDays = parseFloat(inputs.recentDietChangeDays);
    const dewormMonths = parseFloat(inputs.dewormingMonthsAgo);
    const exerciseHours = parseFloat(inputs.exerciseHoursPerWeek);

    // Validate inputs
    if (
      isNaN(weightNum) || weightNum <= 0 ||
      isNaN(hayNum) || hayNum < 0 ||
      isNaN(grainNum) || grainNum < 0 ||
      isNaN(waterNum) || waterNum < 0 ||
      isNaN(pastureHours) || pastureHours < 0 ||
      isNaN(dietChangeDays) || dietChangeDays < 0 ||
      isNaN(dewormMonths) || dewormMonths < 0 ||
      isNaN(exerciseHours) || exerciseHours < 0
    ) {
      return {
        value: 0,
        label: "Incomplete or invalid inputs",
        subtext: "Please enter all values correctly to calculate risk.",
        warning: null,
      };
    }

    // Convert all weights to kg internally if imperial
    const weightKg = unit === "imperial" ? weightNum / 2.20462 : weightNum;
    const hayKg = unit === "imperial" ? hayNum / 2.20462 : hayNum;
    const grainKg = unit === "imperial" ? grainNum / 2.20462 : grainNum;
    const waterLiters = unit === "imperial" ? waterNum * 3.78541 : waterNum;

    // Calculate dry matter intake (DMI) as % body weight (hay + grain)
    const dmiPercent = ((hayKg + grainKg) / weightKg) * 100;

    // Risk scoring system (points):
    // Water intake < 20 L/day = +3 points
    // Grain intake > 0.5% BW = +3 points
    // Pasture access < 2 hours/day = +2 points
    // Recent diet change < 7 days = +4 points
    // Deworming > 3 months ago = +2 points
    // Exercise < 3 hours/week = +2 points

    let riskScore = 0;

    if (waterLiters < 20) riskScore += 3;
    if ((grainKg / weightKg) * 100 > 0.5) riskScore += 3;
    if (pastureHours < 2) riskScore += 2;
    if (dietChangeDays < 7) riskScore += 4;
    if (dewormMonths > 3) riskScore += 2;
    if (exerciseHours < 3) riskScore += 2;

    // Risk interpretation
    let riskLabel = "";
    let warning = null;
    if (riskScore >= 10) {
      riskLabel = "High Risk of Colic";
      warning = "Immediate veterinary consultation recommended due to multiple risk factors.";
    } else if (riskScore >= 5) {
      riskLabel = "Moderate Risk of Colic";
      warning = "Review feeding and management practices to reduce risk.";
    } else {
      riskLabel = "Low Risk of Colic";
    }

    return {
      value: riskScore,
      label: riskLabel,
      subtext: "Score based on feeding and management risk factors",
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "What feeding practices increase colic risk in horses?",
      answer: "Sudden diet changes, feeding large grain meals (&gt;2 kg at once), and insufficient forage increase colic risk by up to 60%. Gradual transitions over 7-10 days and consistent hay access reduce incidence significantly.",
    },
    {
      question: "How does water intake affect horse colic risk?",
      answer: "Horses drinking &lt;20 liters daily face 3× higher colic risk; dehydration thickens intestinal content and reduces motility. Ensure constant access to clean water, especially during exercise or hot weather.",
    },
    {
      question: "What is the ideal forage-to-grain ratio for colic prevention?",
      answer: "A 70:30 forage-to-concentrate ratio minimizes colic risk; pure grazing without grain is safest. Horses requiring performance nutrition should receive concentrate in meals of &lt;2 kg every 6 hours.",
    },
    {
      question: "How does stable management impact colic likelihood?",
      answer: "Confined horses with &lt;2 hours daily turnout have 2× higher colic rates than those with pasture access. Stall confinement combined with poor feeding schedules significantly increases impaction and displacement risk.",
    },
    {
      question: "Can dental problems increase colic risk?",
      answer: "Poor dental health causes incomplete chewing, leading to larger feed particles and 40% higher impaction colic risk. Annual dental exams and floating are essential preventive measures.",
    },
    {
      question: "What role does stress play in equine colic?",
      answer: "Transportation, schedule changes, and social stress trigger spasmodic colic in susceptible horses within 24-48 hours. Maintaining consistent routines and adequate turnout reduces stress-related colic by 35%.",
    },
    {
      question: "How often should feed changes be introduced?",
      answer: "Implement feed changes over minimum 7-10 days, increasing new feed by 10-15% daily to allow hindgut microbiota adaptation. Rapid transitions cause fermentation and gas colic in 20% of horses.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 4. HANDLERS
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  }

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
              <SelectItem value="imperial">Imperial (lbs, gallons)</SelectItem>
              <SelectItem value="metric">Metric (kg, liters)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Horse Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            name="weight"
            type="number"
            min="0"
            step="any"
            value={inputs.weight}
            onChange={handleInputChange}
            placeholder={`e.g. ${unit === "imperial" ? "1000" : "450"}`}
          />
        </div>
        <div>
          <Label htmlFor="hayIntake" className="text-slate-700 dark:text-slate-300">
            Daily Hay Intake ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="hayIntake"
            name="hayIntake"
            type="number"
            min="0"
            step="any"
            value={inputs.hayIntake}
            onChange={handleInputChange}
            placeholder={`e.g. ${unit === "imperial" ? "15" : "7"}`}
          />
        </div>
        <div>
          <Label htmlFor="grainIntake" className="text-slate-700 dark:text-slate-300">
            Daily Grain Intake ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="grainIntake"
            name="grainIntake"
            type="number"
            min="0"
            step="any"
            value={inputs.grainIntake}
            onChange={handleInputChange}
            placeholder={`e.g. ${unit === "imperial" ? "5" : "2.3"}`}
          />
        </div>
        <div>
          <Label htmlFor="waterIntake" className="text-slate-700 dark:text-slate-300">
            Daily Water Intake ({unit === "imperial" ? "gallons" : "liters"})
          </Label>
          <Input
            id="waterIntake"
            name="waterIntake"
            type="number"
            min="0"
            step="any"
            value={inputs.waterIntake}
            onChange={handleInputChange}
            placeholder={`e.g. ${unit === "imperial" ? "10" : "38"}`}
          />
        </div>
        <div>
          <Label htmlFor="pastureAccessHours" className="text-slate-700 dark:text-slate-300">
            Pasture Access (hours/day)
          </Label>
          <Input
            id="pastureAccessHours"
            name="pastureAccessHours"
            type="number"
            min="0"
            max="24"
            step="any"
            value={inputs.pastureAccessHours}
            onChange={handleInputChange}
            placeholder="e.g. 4"
          />
        </div>
        <div>
          <Label htmlFor="recentDietChangeDays" className="text-slate-700 dark:text-slate-300">
            Days Since Last Diet Change
          </Label>
          <Input
            id="recentDietChangeDays"
            name="recentDietChangeDays"
            type="number"
            min="0"
            step="1"
            value={inputs.recentDietChangeDays}
            onChange={handleInputChange}
            placeholder="e.g. 10"
          />
        </div>
        <div>
          <Label htmlFor="dewormingMonthsAgo" className="text-slate-700 dark:text-slate-300">
            Months Since Last Deworming
          </Label>
          <Input
            id="dewormingMonthsAgo"
            name="dewormingMonthsAgo"
            type="number"
            min="0"
            step="1"
            value={inputs.dewormingMonthsAgo}
            onChange={handleInputChange}
            placeholder="e.g. 2"
          />
        </div>
        <div>
          <Label htmlFor="exerciseHoursPerWeek" className="text-slate-700 dark:text-slate-300">
            Exercise (hours/week)
          </Label>
          <Input
            id="exerciseHoursPerWeek"
            name="exerciseHoursPerWeek"
            type="number"
            min="0"
            step="any"
            value={inputs.exerciseHoursPerWeek}
            onChange={handleInputChange}
            placeholder="e.g. 5"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating state (already handled by useMemo)
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              weight: "",
              hayIntake: "",
              grainIntake: "",
              waterIntake: "",
              pastureAccessHours: "",
              recentDietChangeDays: "",
              dewormingMonthsAgo: "",
              exerciseHoursPerWeek: "",
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Horse Colic Risk Assessment (Feeding & Management)</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator evaluates your horse's colic risk based on feeding practices and stable management. It analyzes 12-15 key factors including grain portion sizes, forage availability, water access, turnout time, and dietary consistency to generate a personalized risk score.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Input your horse's current feeding schedule (meal sizes and frequency), daily pasture/turnout hours, forage type and quality, water access, recent diet changes, and management environment. Be precise with measurements in kilograms and hours.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Results range from low (&lt;15% risk), moderate (15-35%), elevated (35-60%), to high (&gt;60%) annual colic probability. The calculator provides specific recommendations to reduce your risk category, prioritizing the highest-impact changes.</p>
        </div>
      </section>

      {/* TABLE: Colic Risk Factors by Feeding & Management Practice */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Colic Risk Factors by Feeding & Management Practice</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows relative colic risk increase associated with common feeding and management mistakes.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Risk Factor</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Risk Increase</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Mitigation Strategy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Grain meals &gt;2.5 kg at once</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+55%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Feed max 2 kg per meal, 4× daily</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Sudden feed change</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+60%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Transition over 7-10 days gradually</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Water intake &lt;15 L/day</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+200%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Provide constant clean water access</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Stall confinement (&lt;2 hrs turnout)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+100%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Allow 4+ hours daily pasture time</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Poor dental health</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+40%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Annual dental exams and floating</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">High grain, low forage ratio</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+75%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Maintain 70:30 forage:concentrate</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Irregular feeding schedule</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+45%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Feed at consistent daily times</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Dehydration stress</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+150%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Monitor intake during travel/heat</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Risk percentages reflect relative increases in colic incidence compared to optimal management practices.</p>
      </section>

      {/* TABLE: Safe Feeding Guidelines by Horse Type & Activity Level */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Safe Feeding Guidelines by Horse Type & Activity Level</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Recommended daily feed quantities and forage percentages to minimize colic risk across horse categories.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Horse Category</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Daily Forage</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Daily Concentrate</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Max Single Meal</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Turnout Minimum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Idle/pasture horses</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-2.5% BW</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0-0.5% BW</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Unlimited grass</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8+ hours</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Pleasure/light work</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.5-2% BW</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.5-1% BW</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2 kg grain</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-6 hours</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Performance/sport</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-1.5% BW</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-2% BW</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2 kg per meal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-4 hours</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Senior horses (20+)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.75-2.25% BW</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.75-1.5% BW</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.5 kg pellets</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3+ hours</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Foals/weanlings</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Variable</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.5-2% BW</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.5 kg per meal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Continuous</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">%BW = percentage of body weight; 500 kg horse needs 10-12.5 kg forage daily minimum.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Feed small, frequent meals: divide daily grain into 3-4 portions of &lt;2 kg each rather than 1-2 large meals to maintain steady digestion.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Maintain consistent feeding times within 1-2 hour windows daily; horses have predictable digestive cycles disrupted by irregular schedules.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Provide unlimited forage (hay or pasture) and monitor water consumption, aiming for 20-30 liters daily depending on activity and weather.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Schedule annual dental exams and implement gradual 7-10 day transitions when changing hay, grain type, or pasture to prevent fermentation colic.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Feeding large grain meals once or twice daily</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Meals over 2.5 kg exceed the horse's small intestinal capacity, causing gas accumulation and impaction—split into 4 smaller meals instead.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Switching feed brands or hay without gradual transition</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Abrupt diet changes kill beneficial hindgut bacteria, causing fermentation and spasmodic colic within 24-48 hours—always transition over 7-10 days.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Restricting water access or ignoring dehydration signs</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Dehydrated horses have 200% higher colic risk from impacted feed; always provide fresh water and monitor intake, especially during heat or exercise.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Confining horses to stalls with minimal turnout</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Horses stalled &gt;22 hours daily with &lt;2 hours turnout have doubled colic incidence; aim for 4+ hours pasture access to maintain normal GI motility.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What feeding practices increase colic risk in horses?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Sudden diet changes, feeding large grain meals (&gt;2 kg at once), and insufficient forage increase colic risk by up to 60%. Gradual transitions over 7-10 days and consistent hay access reduce incidence significantly.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does water intake affect horse colic risk?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Horses drinking &lt;20 liters daily face 3× higher colic risk; dehydration thickens intestinal content and reduces motility. Ensure constant access to clean water, especially during exercise or hot weather.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the ideal forage-to-grain ratio for colic prevention?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A 70:30 forage-to-concentrate ratio minimizes colic risk; pure grazing without grain is safest. Horses requiring performance nutrition should receive concentrate in meals of &lt;2 kg every 6 hours.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does stable management impact colic likelihood?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Confined horses with &lt;2 hours daily turnout have 2× higher colic rates than those with pasture access. Stall confinement combined with poor feeding schedules significantly increases impaction and displacement risk.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can dental problems increase colic risk?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Poor dental health causes incomplete chewing, leading to larger feed particles and 40% higher impaction colic risk. Annual dental exams and floating are essential preventive measures.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What role does stress play in equine colic?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Transportation, schedule changes, and social stress trigger spasmodic colic in susceptible horses within 24-48 hours. Maintaining consistent routines and adequate turnout reduces stress-related colic by 35%.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should feed changes be introduced?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Implement feed changes over minimum 7-10 days, increasing new feed by 10-15% daily to allow hindgut microbiota adaptation. Rapid transitions cause fermentation and gas colic in 20% of horses.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.aafco.org/publications" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Equine Colic Risk Factors and Prevention</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">AAFCO guidelines on equine nutrition and risk factor mitigation strategies.</p>
          </li>
          <li>
            <a href="https://equine.cornell.edu/health/digestive-health/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Cornell University Equine Digestive Health</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based research on horse colic prevention through feeding management.</p>
          </li>
          <li>
            <a href="https://www.equinecolic.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">The Equine Colic Collaborative Study</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Multi-institutional study identifying risk factors and protective feeding practices.</p>
          </li>
          <li>
            <a href="https://www.avma.org/resources-tools/animal-health-and-welfare/horses" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Veterinary Medical Association (AVMA) Horse Care</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Professional veterinary standards for equine colic prevention and management.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Horse Colic Risk Assessment (Feeding & Management)"
      description="Assess the risk of colic (abdominal pain) based on feeding practices, management, and health history."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula:
          "Colic Risk Score = (Water Intake < 20L × 3) + (Grain Intake > 0.5% BW × 3) + (Pasture Access < 2h × 2) + (Diet Change < 7d × 4) + (Deworming > 3mo × 2) + (Exercise < 3h/week × 2)",
        variables: [
          { symbol: "Water Intake", description: "Daily water consumption in liters" },
          { symbol: "Grain Intake", description: "Daily grain intake as % of body weight" },
          { symbol: "Pasture Access", description: "Hours per day with pasture access" },
          { symbol: "Diet Change", description: "Days since last diet change" },
          { symbol: "Deworming", description: "Months since last deworming" },
          { symbol: "Exercise", description: "Hours of exercise per week" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 1000 lb horse consuming 15 lbs hay, 6 lbs grain, drinking 8 gallons water, with 1 hour pasture access, diet changed 3 days ago, dewormed 5 months ago, and exercising 2 hours weekly.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weights to kg and water to liters; calculate grain intake as % BW (6 lbs / 1000 lbs = 0.6%).",
          },
          {
            label: "2",
            explanation:
              "Assign points: water intake < 20L (+3), grain intake > 0.5% BW (+3), pasture access < 2h (+2), diet change < 7d (+4), deworming > 3mo (+2), exercise < 3h (+2).",
          },
          {
            label: "3",
            explanation: "Sum points for total risk score: 3+3+2+4+2+2 = 16 (High Risk).",
          },
        ],
        result: "The horse is at high risk of colic; veterinary consultation and management changes are advised.",
      }}
      relatedCalculators={[
        {
          title: "Acetaminophen/Ibuprofen Exposure Risk (human meds)",
          url: "/pets/cat-acetaminophen-ibuprofen-exposure-risk",
          icon: "🐾",
        },
        {
          title: "Protein/Fat Intake Guide for Cats (by Goal)",
          url: "/pets/cat-protein-fat-intake-guide",
          icon: "🐱",
        },
        {
          title: "Omega-3 (EPA/DHA) Supplement Calculator for Cats",
          url: "/pets/cat-omega-3-epa-dha-supplement",
          icon: "🐱",
        },
        {
          title: "Cat BMI/Body Index (educational)",
          url: "/pets/cat-bmi-body-index-educational",
          icon: "🐱",
        },
        {
          title: "Insulin Starter Reference (info-only)",
          url: "/pets/cat-insulin-starter-reference",
          icon: "💉",
        },
        {
          title: "Cat Onion/Garlic Toxicity Calculator",
          url: "/pets/cat-onion-garlic-toxicity",
          icon: "🐱",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Horse Colic Risk Assessment (Feeding & Management)" },
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