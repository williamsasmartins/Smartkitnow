import React, { useState } from 'react';
import { CalculatorLayout } from "@/components/common/CalculatorLayout";
import { InputGroup } from "@/components/common/InputGroup";
import { ResultCard } from "@/components/common/ResultCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const InvestmentReturnCalculator = () => {
  const [initialAmount, setInitialAmount] = useState('');
  const [monthlyContribution, setMonthlyContribution] = useState('');
  const [annualReturn, setAnnualReturn] = useState('');
  const [years, setYears] = useState('');
  const [result, setResult] = useState<{
    futureValue: number;
    totalContributions: number;
    totalEarnings: number;
    totalReturn: number;
  } | null>(null);

  const calculateReturn = () => {
    const initial = parseFloat(initialAmount);
    const monthly = parseFloat(monthlyContribution) || 0;
    const rate = parseFloat(annualReturn) / 100 / 12;
    const periods = parseFloat(years) * 12;

    if (initial >= 0 && rate >= 0 && periods > 0) {
      // Future value of initial investment
      const fvInitial = initial * Math.pow(1 + rate, periods);
      
      // Future value of monthly contributions (annuity)
      let fvMonthly = 0;
      if (monthly > 0 && rate > 0) {
        fvMonthly = monthly * ((Math.pow(1 + rate, periods) - 1) / rate);
      } else if (monthly > 0) {
        fvMonthly = monthly * periods;
      }
      
      const futureValue = fvInitial + fvMonthly;
      const totalContributions = initial + (monthly * periods);
      const totalEarnings = futureValue - totalContributions;
      const totalReturn = totalContributions > 0 ? (totalEarnings / totalContributions) * 100 : 0;

      setResult({
        futureValue: Math.round(futureValue * 100) / 100,
        totalContributions: Math.round(totalContributions * 100) / 100,
        totalEarnings: Math.round(totalEarnings * 100) / 100,
        totalReturn: Math.round(totalReturn * 100) / 100
      });
    }
  };

  const handleReset = () => {
    setInitialAmount('');
    setMonthlyContribution('');
    setAnnualReturn('');
    setYears('');
    setResult(null);
  };

  return (
    <CalculatorLayout
      title="Investment Return Calculator"
      description="Calculate future value of investments with regular contributions and compound returns."
      formula="FV = PV(1+r)^n + PMT[((1+r)^n - 1) / r]"
      example="$10,000 + $500/month at 8% for 10 years = $183,696"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputGroup
          label="Initial Investment"
          id="initialAmount"
          type="number"
          value={initialAmount}
          onChange={setInitialAmount}
          placeholder="10000"
          required
        />
        <InputGroup
          label="Monthly Contribution"
          id="monthlyContribution"
          type="number"
          value={monthlyContribution}
          onChange={setMonthlyContribution}
          placeholder="500"
        />
        <InputGroup
          label="Annual Return Rate (%)"
          id="annualReturn"
          type="number"
          value={annualReturn}
          onChange={setAnnualReturn}
          placeholder="8"
          step="0.1"
          required
        />
        <InputGroup
          label="Investment Period (years)"
          id="years"
          type="number"
          value={years}
          onChange={setYears}
          placeholder="10"
          required
        />
      </div>

      <div className="flex gap-4">
        <Button onClick={calculateReturn} className="flex-1">
          Calculate Returns
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
              title="Future Value"
              value={result.futureValue}
              prefix="$"
              colorClass="text-primary"
            />
            <ResultCard
              title="Total Contributions"
              value={result.totalContributions}
              prefix="$"
              colorClass="text-blue-600"
            />
            <ResultCard
              title="Total Earnings"
              value={result.totalEarnings}
              prefix="$"
              colorClass="text-green-600"
            />
            <ResultCard
              title="Total Return"
              value={result.totalReturn}
              suffix="%"
              colorClass="text-purple-600"
            />
          </div>
        </>
      )}
    </CalculatorLayout>
  );
};
