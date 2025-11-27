import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calculator, DollarSign, TrendingUp } from "lucide-react";

export default function undefinedCalculator() {
  const [inputs, setInputs] = useState({ field1: "", field2: "" });
  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const calculations = useMemo(() => {
    const field1Value = parseFloat(inputs.field1) || 0;
    if (field1Value <= 0) return { mainResult: 0, result2: 0, result3: 0, result4: 0, scheduleData: [] };
    const mainResult = field1Value * 1.05;
    const result2 = mainResult * 0.5;
    const result3 = mainResult * 0.3;
    const result4 = mainResult * 0.2;
    const scheduleData = Array.from({ length: 24 }, (_, i) => ({
      col1: `Month ${i + 1}`,
      col2: mainResult / 24,
    }));
    return { mainResult, result2, result3, result4, scheduleData };
  }, [inputs]);

  const handleCalculate = () => {
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleReset = () => setInputs({ field1: "", field2: "" });

  return (
    <CalculatorVerticalLayout
      onThisPage={[
        { label: "How to Calculate", id: "how-to-calculate" },
        { label: "Formula", id: "formula" },
        { label: "Factors", id: "factors" },
        { label: "Types", id: "types" },
        { label: "FAQ", id: "faq" },
      ]}
      formula={{
        formula: "MainResult = Field1 × 1.05",
        variables: [
          { symbol: "Field1", description: "Initial input value" },
          { symbol: "MainResult", description: "Calculated main result" },
        ],
        title: "Formula for Calculating Main Result",
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have an initial value of $5000.",
        steps: [
          { label: "Step 1", calculation: "5000 × 1.05 = 5250", explanation: "Multiply the initial value by 1.05." },
          { label: "Step 2", calculation: "5250 × 0.5 = 2625", explanation: "Calculate 50% of the main result." },
          { label: "Step 3", calculation: "5250 × 0.3 = 1575", explanation: "Calculate 30% of the main result." },
        ],
        result: "The final result is $5,250",
      }}
      relatedCalculators={[
        { title: "Calculator 1", url: "/financial/calc1", icon: "📊" },
        { title: "Calculator 2", url: "/financial/calc2", icon: "💰" },
        { title: "Calculator 3", url: "/financial/calc3", icon: "🏦" },
        { title: "Calculator 4", url: "/financial/calc4", icon: "📈" },
        { title: "Calculator 5", url: "/financial/calc5", icon: "💵" },
        { title: "Calculator 6", url: "/financial/calc6", icon: "🔢" },
      ]}
    >
      <Card className="p-6 bg-gray-800/50 border-gray-700">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Field 1 Label
              </Label>
              <Input
                type="number"
                placeholder="e.g., 5000"
                value={inputs.field1}
                onChange={(e) => setInputs({ ...inputs, field1: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Field 2 Label
              </Label>
              <Input
                type="number"
                placeholder="e.g., 1000"
                value={inputs.field2}
                onChange={(e) => setInputs({ ...inputs, field2: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <Button onClick={handleCalculate} className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700">
            <Calculator className="mr-2 h-4 w-4" /> Calculate
          </Button>
          <Button onClick={handleReset} variant="outline">
            Reset
          </Button>
        </div>
      </Card>

      {calculations.mainResult > 0 && (
        <div ref={resultsRef} className="space-y-6 mt-8">
          <h3 className="text-2xl font-bold">Results</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 col-span-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Main Result Label</p>
                  <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mt-2">
                    {formatCurrency(calculations.mainResult)}
                  </p>
                </div>
                <DollarSign className="w-12 h-12 text-blue-600 dark:text-blue-400 opacity-50" />
              </div>
            </Card>

            <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Result 2 Label</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                    {formatCurrency(calculations.result2)}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-gray-400" />
              </div>
            </Card>

            <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Result 3 Label</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-2">
                    {formatCurrency(calculations.result3)}
                  </p>
                </div>
                <Calculator className="w-8 h-8 text-gray-400" />
              </div>
            </Card>
          </div>
        </div>
      )}

      {calculations.scheduleData && calculations.scheduleData.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Schedule Table</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="p-3 text-left">Column 1</th>
                  <th className="p-3 text-left">Column 2</th>
                </tr>
              </thead>
              <tbody>
                {calculations.scheduleData
                  .slice(0, showFullSchedule ? undefined : 12)
                  .map((row, idx) => (
                    <tr key={idx} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="p-3">{row.col1}</td>
                      <td className="p-3">{formatCurrency(row.col2)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          {calculations.scheduleData.length > 12 && (
            <Button
              onClick={() => setShowFullSchedule(!showFullSchedule)}
              variant="outline"
              className="mt-4"
            >
              {showFullSchedule ? "Show Less" : `Show All ${calculations.scheduleData.length} Rows`}
            </Button>
          )}
        </div>
      )}
    </CalculatorVerticalLayout>
  );
}