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
    let warning = null;

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
      question: "Why is it important to track the foaling countdown accurately?",
      answer:
        "Accurately tracking the foaling countdown allows veterinarians and caretakers to prepare for the mare’s delivery, ensuring timely intervention if complications arise. It helps optimize nutrition and management strategies in the final weeks to support fetal development and mare health. Additionally, it reduces stress and improves outcomes for both mare and foal by anticipating critical care needs.",
    },
    {
      question: "How does lactation affect a mare’s nutritional requirements?",
      answer:
        "Lactation significantly increases a mare’s energy and nutrient demands, often doubling maintenance requirements during peak milk production. This is because producing milk is metabolically expensive and requires additional calories, protein, vitamins, and minerals. Proper feed planning during lactation supports milk yield, foal growth, and maintains the mare’s body condition and health.",
    },
    {
      question: "What factors influence the variation in lactation feed requirements?",
      answer:
        "Lactation feed requirements vary based on the mare’s body weight, milk production level, stage of lactation, and overall health status. Early lactation (first 90 days) demands the highest energy intake, which gradually decreases as the foal begins to consume solid feed. Environmental conditions, exercise, and breed differences also impact nutritional needs during this period.",
    },
    {
      question: "How can this calculator assist in managing mare and foal health?",
      answer:
        "This calculator provides a practical tool to estimate the days remaining until foaling and plan appropriate feed intake during lactation based on scientific guidelines. By quantifying dry matter intake and energy needs, it helps caretakers adjust rations to prevent underfeeding or overfeeding. This proactive approach supports optimal mare recovery and foal growth, reducing risks of metabolic or developmental issues.",
    },
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
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Foaling Countdown & Lactation Feed Planner
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The foaling countdown is a critical period in equine reproductive management, marking the final days before a mare gives birth to her foal. This phase requires close monitoring to ensure the mare’s health and readiness for delivery, as well as to anticipate any complications that may arise during parturition. Accurate tracking of the foaling date allows veterinarians and caretakers to optimize care, prepare the foaling environment, and implement timely interventions if necessary.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Following foaling, the lactation period demands significant adjustments in the mare’s nutritional regimen. Milk production is metabolically demanding, increasing the mare’s energy and nutrient requirements substantially above maintenance levels. Proper feed planning during lactation supports optimal milk yield, promotes healthy foal growth, and helps maintain the mare’s body condition and overall well-being.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This tool integrates both the foaling countdown and lactation feed planning to provide a comprehensive veterinary resource. By estimating the days remaining until foaling and calculating the increased feed intake needed during lactation, it empowers caretakers to make informed decisions. This holistic approach enhances mare and foal health outcomes through scientifically grounded nutritional management.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To effectively utilize this calculator, input the expected foaling date, the current date, and the mare’s body weight in pounds. Optionally, enter the number of days post-foaling to receive tailored lactation feed recommendations. The calculator will then provide the number of days remaining until foaling or indicate how many days have passed since foaling, alongside an estimate of the mare’s dry matter intake and energy requirements during lactation.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter the expected foaling date based on veterinary assessment or breeding records.
          </li>
          <li>
            <strong>Step 2:</strong> Confirm or adjust the current date to reflect the day of calculation.
          </li>
          <li>
            <strong>Step 3:</strong> Input the mare’s body weight in pounds to enable accurate feed and energy requirement calculations.
          </li>
          <li>
            <strong>Step 4:</strong> Optionally, specify the days post-foaling to receive lactation feed planning tailored to the mare’s stage of milk production.
          </li>
          <li>
            <strong>Step 5:</strong> Click “Calculate” to view the countdown and feed plan results, then adjust management accordingly.
          </li>
        </ul>
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Veterinary References</h2>
        <ul className="space-y-4">
          <li className="block">
            <a
              href="https://www.nrc-equines.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. National Research Council (NRC) Nutrient Requirements of Horses, 6th Edition
            </a>
            <p className="text-slate-500 text-sm">
              Authoritative guidelines on equine nutrition, including energy and feed requirements during gestation and lactation.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ivis.org/library/equine-reproduction"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Equine Reproduction, 2nd Edition, McKinnon & Voss
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive resource on mare reproductive physiology, foaling management, and neonatal care.
            </p>
          </li>
          <li className="block">
            <a
              href="https://aaep.org/guidelines"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. American Association of Equine Practitioners (AAEP) Guidelines
            </a>
            <p className="text-slate-500 text-sm">
              Clinical guidelines for equine practitioners on foaling management and nutritional support during lactation.
            </p>
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