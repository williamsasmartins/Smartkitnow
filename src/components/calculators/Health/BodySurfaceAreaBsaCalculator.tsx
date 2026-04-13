import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Activity,
  Calculator,
  RotateCcw,
  Info,
  CheckCircle2,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BodySurfaceAreaBsaCalculator() {
  // 1. STATE (Imperial Default)
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState<{
    weightLbs?: number;
    heightFt?: number;
    heightIn?: number;
    weightKg?: number;
    heightCm?: number;
  }>({});

  // 2. LOGIC
  // Use Mosteller formula (widely accepted, simple, and accurate)
  // BSA (m²) = sqrt([height(cm) x weight(kg)] / 3600)
  // Convert imperial inputs to metric for calculation

  const results = useMemo(() => {
    let weightKg: number | undefined;
    let heightCm: number | undefined;

    if (unit === "imperial") {
      if (
        inputs.weightLbs === undefined ||
        inputs.heightFt === undefined ||
        inputs.heightIn === undefined
      )
        return { value: 0, label: "", category: "" };
      weightKg = inputs.weightLbs * 0.45359237;
      heightCm = (inputs.heightFt * 12 + inputs.heightIn) * 2.54;
    } else {
      if (inputs.weightKg === undefined || inputs.heightCm === undefined)
        return { value: 0, label: "", category: "" };
      weightKg = inputs.weightKg;
      heightCm = inputs.heightCm;
    }

    if (weightKg <= 0 || heightCm <= 0)
      return { value: 0, label: "", category: "" };

    const bsa = Math.sqrt((heightCm * weightKg) / 3600);

    // Round to 2 decimals
    const bsaRounded = Math.round(bsa * 100) / 100;

    return {
      value: bsaRounded,
      label: "Body Surface Area (m²)",
      category: "",
    };
  }, [inputs, unit]);

  // 3. FAQS
  const faqs = [
    {
      question: "What is Body Surface Area (BSA) and why is it important in medicine?",
      answer: "Body Surface Area (BSA) is the total outer surface area of the human body, measured in square meters (m²), and is used by healthcare providers to calculate appropriate medication dosages, particularly for chemotherapy and other potent drugs. BSA is more accurate than body weight alone because it accounts for both height and weight proportions. A typical adult has a BSA between 1.5 and 2.0 m², with variations based on age, sex, and body composition.",
    },
    {
      question: "Which BSA formula does this calculator use?",
      answer: "This calculator uses the Mosteller formula, which is the most widely used and recommended method in clinical practice: BSA (m²) = √[Height (cm) × Weight (kg) / 3600]. The Mosteller formula provides accurate results for both adults and children, with a typical margin of error of less than 5% when compared to water displacement measurements.",
    },
    {
      question: "What is the normal BSA range for adults and children?",
      answer: "Normal BSA ranges vary by age and body size. For adults, typical BSA ranges from 1.5 to 2.0 m², with men generally having slightly higher values than women due to greater average height and weight. For children, BSA is much lower, ranging from 0.3 m² for newborns to 1.5 m² for teenagers, and increases progressively with age and growth.",
    },
    {
      question: "How does BSA affect chemotherapy dosing?",
      answer: "Chemotherapy dosages are often calculated based on BSA because drug toxicity correlates better with body surface area than with body weight alone. A typical chemotherapy dose might be expressed as 1,500 to 2,000 mg/m², meaning a patient with a BSA of 1.8 m² would receive a dose of 2,700 to 3,600 mg total. Using BSA-based dosing helps prevent overdosing in obese patients and underdosing in very lean patients.",
    },
    {
      question: "Can BSA be used for calculating drug dosages in children?",
      answer: "Yes, BSA is actually the preferred method for calculating pediatric drug dosages for most medications, as it accounts for differences in body composition and metabolic rates between children and adults. Many pediatric formulations are dosed at a lower rate per m² than adult formulations, such as 50 mg/m² instead of 75 mg/m², to reflect developmental differences in drug metabolism.",
    },
    {
      question: "What is the difference between BSA and BMI?",
      answer: "BMI (Body Mass Index) is a measure of weight relative to height and does not account for body composition, while BSA is the actual surface area of the body and is more physiologically relevant for drug dosing. A person with high muscle mass might have a high BMI but still have an appropriate BSA for their height and weight. BSA is more accurate for medical purposes like medication dosing, whereas BMI is primarily a screening tool for weight categories.",
    },
    {
      question: "How accurate is the Mosteller BSA formula compared to other methods?",
      answer: "The Mosteller formula is highly accurate, with measured values typically within 5% of actual BSA determined by water displacement or 3D imaging methods. When compared to older formulas like the DuBois formula, the Mosteller method produces results that are generally within 1-3% variation for most adults. It is considered the gold standard for clinical use and is recommended by major medical organizations including the American Society of Clinical Oncology.",
    },
    {
      question: "Does BSA change with weight loss or weight gain?",
      answer: "Yes, BSA changes proportionally with significant changes in body weight, though the relationship is not linear—a 10% weight gain typically results in a 5-7% increase in BSA rather than a 10% increase. For patients undergoing chemotherapy, BSA should be recalculated if weight changes by more than 10-15 pounds, as this could affect drug dosing accuracy. Healthcare providers typically reassess BSA at least annually or whenever there are significant body composition changes.",
    },
    {
      question: "Are there different BSA formulas for different populations?",
      answer: "While the Mosteller formula works well for most populations, specialized formulas exist for specific groups—such as the Crawford formula for pediatric patients under 30 kg, which may provide more accurate results in very young children. The Boyd formula and DuBois formula are older methods that are still occasionally used but are generally considered less accurate than Mosteller for contemporary clinical practice. For most healthcare settings, the Mosteller formula is recommended across all age groups from infants to elderly adults.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers for inputs
  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) {
    const value = e.target.value;
    setInputs((prev) => ({
      ...prev,
      [field]: value === "" ? undefined : Number(value),
    }));
  }

  // Reset inputs
  function resetInputs() {
    setInputs({});
  }

  // Calculate button triggers no special action because calculation is dynamic on input change
  // But we keep the button for UX consistency

  const widget = (
    <div className="space-y-6">
      {/* Unit Switcher & Inputs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select
            value={unit}
            onValueChange={(value) => {
              // Convert inputs when switching units
              if (value === unit) return;
              if (value === "metric") {
                // Convert imperial to metric if possible
                if (
                  inputs.weightLbs !== undefined &&
                  inputs.heightFt !== undefined &&
                  inputs.heightIn !== undefined
                ) {
                  const weightKg = inputs.weightLbs * 0.45359237;
                  const heightCm = (inputs.heightFt * 12 + inputs.heightIn) * 2.54;
                  setInputs({
                    weightKg: Math.round(weightKg * 100) / 100,
                    heightCm: Math.round(heightCm * 100) / 100,
                  });
                } else {
                  setInputs({});
                }
              } else {
                // Convert metric to imperial if possible
                if (
                  inputs.weightKg !== undefined &&
                  inputs.heightCm !== undefined
                ) {
                  const weightLbs = inputs.weightKg / 0.45359237;
                  const totalInches = inputs.heightCm / 2.54;
                  const heightFt = Math.floor(totalInches / 12);
                  const heightIn = Math.round(totalInches - heightFt * 12);
                  setInputs({
                    weightLbs: Math.round(weightLbs * 100) / 100,
                    heightFt,
                    heightIn,
                  });
                } else {
                  setInputs({});
                }
              }
              setUnit(value);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="imperial">Imperial (US/Canada)</SelectItem>
              <SelectItem value="metric">Metric (International)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Inputs */}
        {unit === "imperial" ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="weightLbs" className="text-slate-700 dark:text-slate-300">
                Weight (lbs)
              </Label>
              <Input
                id="weightLbs"
                type="number"
                min={0}
                step="any"
                placeholder="e.g. 150"
                value={inputs.weightLbs ?? ""}
                onChange={(e) => handleInputChange(e, "weightLbs")}
                aria-describedby="weightHelp"
              />
              <p id="weightHelp" className="text-xs text-slate-400 mt-1">
                Enter your weight in pounds.
              </p>
            </div>
            <div>
              <Label htmlFor="heightFt" className="text-slate-700 dark:text-slate-300">
                Height (ft)
              </Label>
              <Input
                id="heightFt"
                type="number"
                min={0}
                step="1"
                placeholder="e.g. 5"
                value={inputs.heightFt ?? ""}
                onChange={(e) => handleInputChange(e, "heightFt")}
                aria-describedby="heightHelp"
              />
            </div>
            <div>
              <Label htmlFor="heightIn" className="text-slate-700 dark:text-slate-300">
                Height (in)
              </Label>
              <Input
                id="heightIn"
                type="number"
                min={0}
                max={11}
                step="any"
                placeholder="e.g. 8"
                value={inputs.heightIn ?? ""}
                onChange={(e) => handleInputChange(e, "heightIn")}
                aria-describedby="heightHelp"
              />
              <p id="heightHelp" className="text-xs text-slate-400 mt-1">
                Enter remaining inches (0-11).
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="weightKg" className="text-slate-700 dark:text-slate-300">
                Weight (kg)
              </Label>
              <Input
                id="weightKg"
                type="number"
                min={0}
                step="any"
                placeholder="e.g. 68"
                value={inputs.weightKg ?? ""}
                onChange={(e) => handleInputChange(e, "weightKg")}
                aria-describedby="weightKgHelp"
              />
              <p id="weightKgHelp" className="text-xs text-slate-400 mt-1">
                Enter your weight in kilograms.
              </p>
            </div>
            <div>
              <Label htmlFor="heightCm" className="text-slate-700 dark:text-slate-300">
                Height (cm)
              </Label>
              <Input
                id="heightCm"
                type="number"
                min={0}
                step="any"
                placeholder="e.g. 173"
                value={inputs.heightCm ?? ""}
                onChange={(e) => handleInputChange(e, "heightCm")}
                aria-describedby="heightCmHelp"
              />
              <p id="heightCmHelp" className="text-xs text-slate-400 mt-1">
                Enter your height in centimeters.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No special action needed, calculation is live
          }}
          aria-label="Calculate Body Surface Area"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={resetInputs}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results (High Contrast for Dark Mode) */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Your Result
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
                {results.value}
              </p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">
                {results.label}
              </p>
              {results.category && (
                <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-white/50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 text-blue-800 dark:text-blue-300 text-sm font-bold">
                  {results.category}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Body Surface Area (BSA) Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Body Surface Area (BSA) Calculator determines your total outer body surface area in square meters, a critical measurement used in clinical medicine for calculating appropriate medication dosages, especially chemotherapy and other potent drugs. Unlike body weight alone, BSA accounts for both height and weight proportions, making it a more accurate measure for determining safe and effective drug doses. This calculator is used by healthcare providers, oncologists, and pharmacists in hospitals, cancer centers, and clinical settings worldwide.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use this calculator, you will need to input two key measurements: your height (in centimeters or inches) and your weight (in kilograms or pounds). The calculator will automatically convert between measurement units and apply the Mosteller formula, which is the most widely accepted and recommended method in clinical practice. Make sure your measurements are accurate and up-to-date, as even small variations in height or weight can affect the final BSA calculation.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Once you receive your BSA result in square meters (m²), you can interpret it by comparing it to normal ranges for your age and sex. A typical adult BSA ranges from 1.5 to 2.0 m², with men generally having slightly higher values than women. If you are undergoing medical treatment that requires BSA-based dosing, share your calculated BSA with your healthcare provider to ensure accurate medication dosing and optimal treatment outcomes.</p>
        </div>
      </section>

      {/* TABLE: Normal BSA Values by Age and Sex */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Normal BSA Values by Age and Sex</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows typical Body Surface Area ranges based on age groups and biological sex for reference.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Age Group</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Male BSA Range (m²)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Female BSA Range (m²)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Average BSA (m²)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Newborn (0-1 month)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.25-0.35</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.24-0.34</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.30</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Infant (1-12 months)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.35-0.60</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.33-0.58</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.47</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Toddler (1-3 years)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.60-0.95</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.58-0.92</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.77</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Preschool (3-6 years)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.95-1.30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.92-1.27</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.12</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">School-age (6-12 years)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.30-1.75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.27-1.70</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.53</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Adolescent (12-18 years)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.75-2.10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.55-1.85</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.83</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Adult (18-65 years)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.80-2.20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.50-1.95</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.87</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Older adult (65+ years)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.70-2.10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.45-1.85</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.77</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Values are approximate and may vary based on individual body composition, ethnicity, and health status. BSA should be calculated individually for accurate medical dosing.</p>
      </section>

      {/* TABLE: Common Chemotherapy Dosing by BSA */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Common Chemotherapy Dosing by BSA</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table provides examples of typical chemotherapy drug dosages expressed in mg/m² as used in clinical oncology.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Chemotherapy Drug</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Dose (mg/m²)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Frequency</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Clinical Use</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Doxorubicin</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60-90</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 3 weeks</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Breast, lung, lymphoma</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cisplatin</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">75-100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 3-4 weeks</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Ovarian, testicular, lung cancer</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Paclitaxel</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">175-250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 3 weeks or weekly</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Breast, ovarian, lung cancer</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5-Fluorouracil (5-FU)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">400-500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Daily for 5 days, repeated</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Colorectal, gastric cancers</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cyclophosphamide</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">600-1000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 3-4 weeks</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Multiple cancer types, lymphoma</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Gemcitabine</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1000-1250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Weekly or every 3 weeks</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Pancreatic, lung, bladder cancer</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Methotrexate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1000-12000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Varies by protocol</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Leukemia, lymphoma, breast cancer</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Carboplatin</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">AUC 5-6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 3-4 weeks</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Ovarian, lung cancer</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Dosages are illustrative examples and actual doses are determined by oncologists based on specific protocols, patient factors, and drug interactions. AUC = Area Under the Curve, a pharmacokinetic measure.</p>
      </section>

      {/* TABLE: BSA Calculation Examples with Real Numbers */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">BSA Calculation Examples with Real Numbers</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table demonstrates BSA calculations using the Mosteller formula for various patient profiles.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Patient Profile</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Height (cm)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Weight (kg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Calculated BSA (m²)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Clinical Context</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Adult female (average)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">165</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">65</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.73</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Typical adult woman</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Adult male (average)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">180</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">82</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.98</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Typical adult man</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Obese adult</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">175</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">130</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.33</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Higher dose requirements</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Pediatric child</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">120</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.94</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">School-age child</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Tall adult</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">195</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">90</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.27</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Above-average height</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Petite adult</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">155</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Below-average stature</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Infant toddler</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.52</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Early childhood</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Adolescent</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">170</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">70</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.83</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Teenage years</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Formula used: BSA (m²) = √[Height (cm) × Weight (kg) / 3600]. These are calculated examples; actual BSA may vary slightly based on body composition.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Measure your height and weight accurately using a calibrated scale and measuring tape—even small measurement errors can affect BSA calculations, particularly in pediatric patients where precision is critical for safe drug dosing.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Recalculate your BSA if your weight changes significantly (more than 10-15 pounds), as this affects medication dosages for ongoing treatments like chemotherapy or immunosuppressive therapy.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Keep a record of your calculated BSA if you have a chronic condition requiring medication adjustments, as you may need to reference it during medical appointments or when switching healthcare providers.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Understand that BSA is more accurate than body weight for predicting drug metabolism and toxicity, which is why oncologists and pediatricians prefer BSA-based dosing over simple weight-based dosing for serious medications.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Confusing BSA with BMI</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">BSA and BMI are different measurements with different clinical purposes. BMI measures weight relative to height and is used for general health screening, while BSA measures actual body surface area and is used for precise medication dosing. Using BMI when BSA is required can result in incorrect drug doses.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Failing to Update BSA for Weight Changes</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Significant weight loss or gain changes BSA proportionally, which means chemotherapy or other BSA-based medications may become incorrectly dosed if BSA is not recalculated. Healthcare providers should reassess BSA whenever a patient's weight changes by &gt;10% or after major weight loss surgery.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Outdated or Inaccurate Height Measurements</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Using a height measurement from years ago can lead to incorrect BSA calculations, particularly in children who are growing or in elderly adults who may have lost height due to osteoporosis or spinal compression. Always use current measurements for medical dosing purposes.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming One Formula Works for All Populations</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">While the Mosteller formula is accurate for most people, specialized formulas may be more appropriate for very young children (&lt;30 kg) or patients with unusual body compositions. Always verify with a healthcare provider which formula is most appropriate for your specific situation.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is Body Surface Area (BSA) and why is it important in medicine?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Body Surface Area (BSA) is the total outer surface area of the human body, measured in square meters (m²), and is used by healthcare providers to calculate appropriate medication dosages, particularly for chemotherapy and other potent drugs. BSA is more accurate than body weight alone because it accounts for both height and weight proportions. A typical adult has a BSA between 1.5 and 2.0 m², with variations based on age, sex, and body composition.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Which BSA formula does this calculator use?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">This calculator uses the Mosteller formula, which is the most widely used and recommended method in clinical practice: BSA (m²) = √[Height (cm) × Weight (kg) / 3600]. The Mosteller formula provides accurate results for both adults and children, with a typical margin of error of less than 5% when compared to water displacement measurements.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the normal BSA range for adults and children?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Normal BSA ranges vary by age and body size. For adults, typical BSA ranges from 1.5 to 2.0 m², with men generally having slightly higher values than women due to greater average height and weight. For children, BSA is much lower, ranging from 0.3 m² for newborns to 1.5 m² for teenagers, and increases progressively with age and growth.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does BSA affect chemotherapy dosing?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Chemotherapy dosages are often calculated based on BSA because drug toxicity correlates better with body surface area than with body weight alone. A typical chemotherapy dose might be expressed as 1,500 to 2,000 mg/m², meaning a patient with a BSA of 1.8 m² would receive a dose of 2,700 to 3,600 mg total. Using BSA-based dosing helps prevent overdosing in obese patients and underdosing in very lean patients.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can BSA be used for calculating drug dosages in children?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, BSA is actually the preferred method for calculating pediatric drug dosages for most medications, as it accounts for differences in body composition and metabolic rates between children and adults. Many pediatric formulations are dosed at a lower rate per m² than adult formulations, such as 50 mg/m² instead of 75 mg/m², to reflect developmental differences in drug metabolism.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the difference between BSA and BMI?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">BMI (Body Mass Index) is a measure of weight relative to height and does not account for body composition, while BSA is the actual surface area of the body and is more physiologically relevant for drug dosing. A person with high muscle mass might have a high BMI but still have an appropriate BSA for their height and weight. BSA is more accurate for medical purposes like medication dosing, whereas BMI is primarily a screening tool for weight categories.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How accurate is the Mosteller BSA formula compared to other methods?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The Mosteller formula is highly accurate, with measured values typically within 5% of actual BSA determined by water displacement or 3D imaging methods. When compared to older formulas like the DuBois formula, the Mosteller method produces results that are generally within 1-3% variation for most adults. It is considered the gold standard for clinical use and is recommended by major medical organizations including the American Society of Clinical Oncology.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does BSA change with weight loss or weight gain?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, BSA changes proportionally with significant changes in body weight, though the relationship is not linear—a 10% weight gain typically results in a 5-7% increase in BSA rather than a 10% increase. For patients undergoing chemotherapy, BSA should be recalculated if weight changes by more than 10-15 pounds, as this could affect drug dosing accuracy. Healthcare providers typically reassess BSA at least annually or whenever there are significant body composition changes.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Are there different BSA formulas for different populations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">While the Mosteller formula works well for most populations, specialized formulas exist for specific groups—such as the Crawford formula for pediatric patients under 30 kg, which may provide more accurate results in very young children. The Boyd formula and DuBois formula are older methods that are still occasionally used but are generally considered less accurate than Mosteller for contemporary clinical practice. For most healthcare settings, the Mosteller formula is recommended across all age groups from infants to elderly adults.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.cancer.gov/about-cancer/treatment/drugs" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">National Cancer Institute - Chemotherapy Drug Information</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive resource from the National Cancer Institute providing information on chemotherapy drugs, dosing, and clinical use in cancer treatment.</p>
          </li>
          <li>
            <a href="https://www.asco.org/about-asco/educational-resources/tools-resources" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Society of Clinical Oncology (ASCO) - Cancer Treatment Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">ASCO provides evidence-based clinical guidelines and resources for oncology professionals regarding appropriate medication dosing and treatment protocols.</p>
          </li>
          <li>
            <a href="https://www.ncbi.nlm.nih.gov/pmc/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">PubMed Central - Body Surface Area Formulas and Clinical Applications</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Free access to peer-reviewed medical literature on BSA calculations, formula comparisons, and clinical applications in various medical specialties.</p>
          </li>
          <li>
            <a href="https://www.fda.gov/drugs/development-resources/oncology-hematologic-malignancies" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">FDA - Oncology (Cancer) & Hematologic Malignancies Drug Information</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official FDA resource for information on approved oncology drugs, including dosing recommendations and clinical efficacy data.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Body Surface Area (BSA) Calculator"
      description="Calculate Body Surface Area (BSA) accurately. Essential for determining medical dosages and assessing metabolic parameters."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math Formula",
        formula: "BSA (m²) = √([Height(cm) × Weight(kg)] / 3600)",
        variables: [
          {
            symbol: "Height(cm)",
            description: "Height in centimeters",
          },
          {
            symbol: "Weight(kg)",
            description: "Weight in kilograms",
          },
        ],
      }}
      example={{
        title: "Real-World Example",
        scenario:
          "A 5 ft 8 in (68 inches) tall adult weighing 150 lbs wants to calculate their BSA.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert height to centimeters: 68 inches × 2.54 = 172.72 cm.",
          },
          {
            label: "Step 2",
            explanation:
              "Convert weight to kilograms: 150 lbs × 0.45359237 = 68.04 kg.",
          },
          {
            label: "Step 3",
            explanation:
              "Apply the Mosteller formula: √((172.72 × 68.04) / 3600) ≈ √(3,717.5 / 3600) ≈ √1.0326 ≈ 1.02 m².",
          },
        ],
        result: "The individual's estimated BSA is approximately 1.02 m².",
      }}
      relatedCalculators={[
        {
          title: "BMI — Body Mass Index Calculator",
          url: "/health/bmi-body-mass-index",
          icon: "⚖️",
        },
        {
          title: "BMR — Basal Metabolic Rate (Mifflin-St Jeor)",
          url: "/health/bmr-mifflin-st-jeor",
          icon: "🔥",
        },
        {
          title: "TDEE — Total Daily Energy Expenditure Calculator",
          url: "/health/tdee-daily-energy-expenditure",
          icon: "🔥",
        },
        {
          title: "Body Fat % (US Navy / 3-sites)",
          url: "/health/body-fat-us-navy-3-sites",
          icon: "💧",
        },
        {
          title: "Ideal Weight Range (Hamwi/Devine/Miller)",
          url: "/health/ideal-weight-range-hamwi-devine-miller",
          icon: "🥗",
        },
        {
          title: "Waist-to-Height Ratio Checker",
          url: "/health/waist-to-height-ratio",
          icon: "😴",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "What is Body Surface Area (BSA) Calculator?" },
        { id: "how-to-use", label: "How to Use This Calculator" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "Trusted References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}