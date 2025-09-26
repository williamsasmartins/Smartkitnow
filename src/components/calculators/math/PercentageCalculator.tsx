import React, { useState } from 'react';
import { CalculatorLayout } from "@/components/calculators/common/CalculatorLayout";
import { InputGroup } from "@/components/calculators/common/InputGroup";
import { ResultCard } from "@/components/calculators/common/ResultCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const PercentageCalculator = () => {
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('');
  const [percentage, setPercentage] = useState('');
  const [activeTab, setActiveTab] = useState('percentage-of');
  const [result, setResult] = useState<number | null>(null);

  const calculatePercentageOf = () => {
    const percent = parseFloat(percentage);
    const value = parseFloat(value1);
    if (percent >= 0 && value >= 0) {
      setResult((percent / 100) * value);
    }
  };

  const calculateWhatPercent = () => {
    const part = parseFloat(value1);
    const whole = parseFloat(value2);
    if (part >= 0 && whole > 0) {
      setResult((part / whole) * 100);
    }
  };

  const calculatePercentChange = () => {
    const oldValue = parseFloat(value1);
    const newValue = parseFloat(value2);
    if (oldValue > 0) {
      setResult(((newValue - oldValue) / oldValue) * 100);
    }
  };

  const handleReset = () => {
    setValue1('');
    setValue2('');
    setPercentage('');
    setResult(null);
  };

  const getCalculateFunction = () => {
    switch (activeTab) {
      case 'percentage-of': return calculatePercentageOf;
      case 'what-percent': return calculateWhatPercent;
      case 'percent-change': return calculatePercentChange;
      default: return calculatePercentageOf;
    }
  };

  const getResultLabel = () => {
    switch (activeTab) {
      case 'percentage-of': return 'Result';
      case 'what-percent': return 'Percentage';
      case 'percent-change': return 'Percent Change';
      default: return 'Result';
    }
  };

  const getResultSuffix = () => {
    return activeTab === 'percentage-of' ? '' : '%';
  };

  return (
    <CalculatorLayout
      title="Percentage Calculator"
      description="Calculate percentages, percent changes, and find what percent one number is of another."
      formula="Percentage = (Part ÷ Whole) × 100%"
      example="25% of 200 = 50, or 50 is 25% of 200"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="percentage-of">X% of Y</TabsTrigger>
          <TabsTrigger value="what-percent">X is what % of Y</TabsTrigger>
          <TabsTrigger value="percent-change">% Change</TabsTrigger>
        </TabsList>

        <TabsContent value="percentage-of" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup
              label="Percentage (%)"
              id="percentage"
              type="number"
              value={percentage}
              onChange={setPercentage}
              placeholder="25"
              required
            />
            <InputGroup
              label="Of Value"
              id="value1"
              type="number"
              value={value1}
              onChange={setValue1}
              placeholder="200"
              required
            />
          </div>
        </TabsContent>

        <TabsContent value="what-percent" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup
              label="Part (X)"
              id="value1"
              type="number"
              value={value1}
              onChange={setValue1}
              placeholder="50"
              required
            />
            <InputGroup
              label="Whole (Y)"
              id="value2"
              type="number"
              value={value2}
              onChange={setValue2}
              placeholder="200"
              required
            />
          </div>
        </TabsContent>

        <TabsContent value="percent-change" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup
              label="Original Value"
              id="value1"
              type="number"
              value={value1}
              onChange={setValue1}
              placeholder="100"
              required
            />
            <InputGroup
              label="New Value"
              id="value2"
              type="number"
              value={value2}
              onChange={setValue2}
              placeholder="125"
              required
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex gap-4">
        <Button onClick={getCalculateFunction()} className="flex-1">
          Calculate
        </Button>
        <Button variant="outline" onClick={handleReset}>
          Reset
        </Button>
      </div>

      {result !== null && (
        <>
          <Separator />
          <ResultCard
            title={getResultLabel()}
            value={Math.round(result * 100) / 100}
            suffix={getResultSuffix()}
            colorClass="text-primary"
          />
        </>
      )}
    </CalculatorLayout>
  );
};