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
      question: "Why is maintaining the ideal humidity range important for reptiles?",
      answer:
        "Reptiles rely on specific humidity levels to regulate their hydration, skin health, and respiratory function. Too low humidity can lead to dehydration and shedding problems, while too high humidity increases the risk of bacterial and fungal infections. Maintaining the ideal range supports their natural physiological processes and overall well-being.",
    },
    {
      question: "How does ambient humidity affect respiratory health in reptiles?",
      answer:
        "Ambient humidity directly influences the moisture in a reptile's respiratory tract. Low humidity dries out mucous membranes, making reptiles more susceptible to respiratory infections. Conversely, excessive humidity can promote pathogen growth, leading to respiratory distress and illness. Proper humidity balance is essential for healthy lung function.",
    },
    {
      question: "Can the ideal humidity range vary between reptile species?",
      answer:
        "Yes, different reptile species have evolved to thrive in distinct environmental conditions, including humidity. Desert species typically require lower humidity levels, while tropical species need higher humidity to mimic their natural habitats. Understanding species-specific humidity needs is crucial for proper husbandry and health maintenance.",
    },
    {
      question: "How can I accurately measure and control humidity in my reptile’s enclosure?",
      answer:
        "Using a reliable hygrometer is essential to monitor enclosure humidity accurately. Control methods include misting, water bowls, substrate choice, and humidifiers or dehumidifiers depending on needs. Regular monitoring and adjustments ensure the environment stays within the ideal range, promoting optimal reptile health.",
    },
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
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Ideal Humidity Range Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Ideal Humidity Range Calculator is a specialized veterinary tool designed to help reptile owners and caretakers determine whether the ambient humidity in an enclosure falls within the optimal range for a specific reptile species. Proper humidity levels are critical for maintaining respiratory health, skin hydration, and overall physiological balance in reptiles. This calculator simplifies the process by allowing users to input species-specific humidity requirements alongside current ambient humidity, providing immediate feedback on environmental suitability.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Reptiles are ectothermic animals whose health and behavior are heavily influenced by their environment. Humidity affects processes such as shedding, hydration, and respiratory function. Deviations from the ideal humidity range can lead to serious health complications, including dehydration, respiratory infections, and skin disorders. This calculator empowers users to maintain an environment that closely mimics natural habitat conditions, thereby promoting optimal health and longevity for their reptiles.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          By integrating veterinary science with practical husbandry, this tool serves as a high-authority resource for reptile care. It emphasizes the importance of precise environmental control and educates users on the consequences of improper humidity levels. The calculator’s clean interface and clear results make it accessible to both novice and experienced reptile enthusiasts, supporting informed decision-making and proactive health management.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To effectively use the Ideal Humidity Range Calculator, begin by gathering accurate data about your reptile species’ preferred humidity range, which can often be found in care sheets or veterinary literature. Next, measure the current ambient humidity in your reptile’s enclosure using a reliable hygrometer. Input these values into the calculator to receive an immediate assessment of whether the environment is suitable or requires adjustment.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter the species’ ideal minimum humidity percentage, ensuring it reflects veterinary-recommended ranges.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the species’ ideal maximum humidity percentage to define the upper limit of the range.
          </li>
          <li>
            <strong>Step 3:</strong> Input the current ambient humidity percentage measured inside the enclosure.
          </li>
          <li>
            <strong>Step 4:</strong> Click “Calculate” to determine if the ambient humidity is within the ideal range, and review any warnings or recommendations provided.
          </li>
          <li>
            <strong>Step 5:</strong> Adjust the enclosure’s humidity as needed using methods such as misting, substrate changes, or humidifiers to maintain optimal conditions.
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
              href="https://www.vetmed.ucdavis.edu/hospital/small-exotics/reptiles"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. UC Davis Veterinary Medicine - Reptile Care
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive resource on reptile husbandry including environmental parameters such as humidity and temperature critical for health.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.merckvetmanual.com/exotic-and-laboratory-animals/reptiles/environmental-management"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Merck Veterinary Manual - Environmental Management of Reptiles
            </a>
            <p className="text-slate-500 text-sm">
              Authoritative guide detailing the impact of environmental factors like humidity on reptile physiology and disease prevention.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7159452/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. NCBI - Respiratory Diseases in Reptiles: Role of Environmental Humidity
            </a>
            <p className="text-slate-500 text-sm">
              Peer-reviewed article exploring how humidity levels influence respiratory health and infection risks in captive reptiles.
            </p>
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