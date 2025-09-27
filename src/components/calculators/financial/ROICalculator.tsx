import React, { useState } from 'react';
import { CalculatorLayout } from "@/components/common/CalculatorLayout";
import { InputGroup } from "@/components/common/InputGroup";
import { ResultCard } from "@/components/common/ResultCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const ROICalculator = () => {
  const [initialInvestment, setInitialInvestment] = useState('');
  const [finalValue, setFinalValue] = useState('');
  const [timePeriod, setTimePeriod] = useState('');
  const [result, setResult] = useState<{
    roi: number;
    roiPercentage: number;
    gainLoss: number;
    annualizedROI: number;
  } | null>(null);

  const calculateROI = () => {
    const initial = parseFloat(initialInvestment);
    const final = parseFloat(finalValue);
    const time = parseFloat(timePeriod) || 1;

    if (initial > 0 && final > 0) {
      const gainLoss = final - initial;
      const roi = gainLoss / initial;
      const roiPercentage = roi * 100;
      const annualizedROI = time > 0 ? (Math.pow(final / initial, 1 / time) - 1) * 100 : roiPercentage;

      setResult({
        roi: Math.round(roi * 10000) / 10000,
        roiPercentage: Math.round(roiPercentage * 100) / 100,
        gainLoss: Math.round(gainLoss * 100) / 100,
        annualizedROI: Math.round(annualizedROI * 100) / 100
      });
    }
  };

  const handleReset = () => {
    setInitialInvestment('');
    setFinalValue('');
    setTimePeriod('');
    setResult(null);
  };

  return (
    <CalculatorLayout
      title="ROI Calculator"
      description="Calculate return on investment percentage and gain/loss on your investments."
      formula="ROI = (Final Value - Initial Investment) ÷ Initial Investment × 100%"
      example="($1,200 - $1,000) ÷ $1,000 × 100% = 20% ROI"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputGroup
          label="Initial Investment"
          id="initialInvestment"
          type="number"
          value={initialInvestment}
          onChange={setInitialInvestment}
          placeholder="1000"
          required
        />
        <InputGroup
          label="Final Value"
          id="finalValue"
          type="number"
          value={finalValue}
          onChange={setFinalValue}
          placeholder="1200"
          required
        />
        <InputGroup
          label="Time Period (years)"
          id="timePeriod"
          type="number"
          value={timePeriod}
          onChange={setTimePeriod}
          placeholder="1"
          step="0.1"
        />
      </div>

      <div className="flex gap-4">
        <Button onClick={calculateROI} className="flex-1">
          Calculate ROI
        </Button>
        <Button variant="outline" onClick={handleReset}>
          Reset
        </Button>
      </div>

      {result && (
        <>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ResultCard
              title="ROI Percentage"
              value={result.roiPercentage}
              suffix="%"
              colorClass="text-primary"
            />
            <ResultCard
              title="Gain/Loss"
              value={result.gainLoss}
              prefix="$"
              colorClass={result.gainLoss >= 0 ? "text-green-600" : "text-red-600"}
            />
            <ResultCard
              title="ROI Ratio"
              value={result.roi}
              colorClass="text-blue-600"
            />
            <ResultCard
              title="Annualized ROI"
              value={result.annualizedROI}
              suffix="%"
              colorClass="text-purple-600"
            />
          </div>
        </>
      )}
    </CalculatorLayout>
  );
};
