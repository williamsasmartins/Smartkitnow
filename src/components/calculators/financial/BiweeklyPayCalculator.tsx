import React, { useState } from 'react';
import { CalculatorLayout } from "@/components/calculators/common/CalculatorLayout";
import { InputGroup } from "@/components/calculators/common/InputGroup";
import { ResultCard } from "@/components/calculators/common/ResultCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const BiweeklyPayCalculator = () => {
  const [annualSalary, setAnnualSalary] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [hoursPerWeek, setHoursPerWeek] = useState('');
  const [activeTab, setActiveTab] = useState('salary');
  const [biweeklyPay, setBiweeklyPay] = useState<number | null>(null);

  const calculateFromSalary = () => {
    const salary = parseFloat(annualSalary);
    if (salary > 0) {
      setBiweeklyPay(salary / 26);
    }
  };

  const calculateFromHourly = () => {
    const rate = parseFloat(hourlyRate);
    const hours = parseFloat(hoursPerWeek);
    if (rate > 0 && hours > 0) {
      setBiweeklyPay(rate * hours * 2);
    }
  };

  const handleReset = () => {
    setAnnualSalary('');
    setHourlyRate('');
    setHoursPerWeek('');
    setBiweeklyPay(null);
  };

  const getCalculateFunction = () => {
    return activeTab === 'salary' ? calculateFromSalary : calculateFromHourly;
  };

  return (
    <CalculatorLayout
      title="Biweekly Pay Calculator"
      description="Calculate your biweekly pay based on annual salary or hourly rate."
      formula="Biweekly Pay = Annual Salary / 26 or Hourly Rate × Hours per Week × 2"
      example="Annual $52,000 = $2,000 biweekly"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="salary">From Salary</TabsTrigger>
          <TabsTrigger value="hourly">From Hourly Rate</TabsTrigger>
        </TabsList>

        <TabsContent value="salary" className="space-y-4">
          <InputGroup
            label="Annual Salary ($)"
            id="annualSalary"
            type="number"
            value={annualSalary}
            onChange={(e) => setAnnualSalary(e.target.value)}
            placeholder="52000"
            required
          />
        </TabsContent>

        <TabsContent value="hourly" className="space-y-4">
          <InputGroup
            label="Hourly Rate ($)"
            id="hourlyRate"
            type="number"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
            placeholder="25"
            required
          />
          <InputGroup
            label="Hours per Week"
            id="hoursPerWeek"
            type="number"
            value={hoursPerWeek}
            onChange={(e) => setHoursPerWeek(e.target.value)}
            placeholder="40"
            required
          />
        </TabsContent>
      </Tabs>

      <div className="flex gap-4">
        <Button onClick={getCalculateFunction()} className="flex-1">Calculate</Button>
        <Button variant="outline" onClick={handleReset}>Reset</Button>
      </div>

      {biweeklyPay !== null && (
        <>
          <Separator />
          <ResultCard
            title="Biweekly Pay"
            value={Math.round(biweeklyPay * 100) / 100}
            suffix="$"
            colorClass="text-primary"
          />
        </>
      )}
    </CalculatorLayout>
  );
};