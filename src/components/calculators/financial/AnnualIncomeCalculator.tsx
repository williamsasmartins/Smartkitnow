import React, { useState } from 'react';
import { CalculatorLayout } from "@/components/calculators/common/CalculatorLayout";
import { InputGroup } from "@/components/calculators/common/InputGroup";
import { ResultCard } from "@/components/calculators/common/ResultCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const AnnualIncomeCalculator = () => {
  const [hourlyRate, setHourlyRate] = useState('');
  const [hoursPerWeek, setHoursPerWeek] = useState('');
  const [weeksPerYear, setWeeksPerYear] = useState('52');
  const [activeTab, setActiveTab] = useState('hourly');
  const [annualIncome, setAnnualIncome] = useState<number | null>(null);

  const calculateFromHourly = () => {
    const rate = parseFloat(hourlyRate);
    const hours = parseFloat(hoursPerWeek);
    const weeks = parseFloat(weeksPerYear);
    if (rate > 0 && hours > 0 && weeks > 0) {
      setAnnualIncome(rate * hours * weeks);
    }
  };

  const handleReset = () => {
    setHourlyRate('');
    setHoursPerWeek('');
    setWeeksPerYear('52');
    setAnnualIncome(null);
  };

  return (
    <CalculatorLayout
      title="Annual Income Calculator"
      description="Calculate annual income from hourly rate and hours worked."
      formula="Annual Income = Hourly Rate × Hours per Week × Weeks per Year"
      example="Hourly $20, 40 hours/week, 52 weeks = $41,600/year"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="hourly">From Hourly Rate</TabsTrigger>
        </TabsList>

        <TabsContent value="hourly" className="space-y-4">
          <InputGroup
            label="Hourly Rate ($)"
            id="hourlyRate"
            type="number"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
            placeholder="20"
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
          <InputGroup
            label="Weeks per Year"
            id="weeksPerYear"
            type="number"
            value={weeksPerYear}
            onChange={(e) => setWeeksPerYear(e.target.value)}
            placeholder="52"
            required
          />
        </TabsContent>
      </Tabs>

      <div className="flex gap-4">
        <Button onClick={calculateFromHourly} className="flex-1">Calculate</Button>
        <Button variant="outline" onClick={handleReset}>Reset</Button>
      </div>

      {annualIncome !== null && (
        <>
          <Separator />
          <ResultCard
            title="Annual Income"
            value={annualIncome.toFixed(2)}
            suffix="$"
            colorClass="text-primary"
          />
        </>
      )}
    </CalculatorLayout>
  );
};