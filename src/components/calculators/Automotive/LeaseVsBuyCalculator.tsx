import React, { useState } from 'react';
import { CalculatorLayout } from '@/components/calculators/CalculatorLayout';
import { Card, CardTitle, CardHeader, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function LeaseVsBuyCalculator() {
  const [result, setResult] = useState<string | null>(null);

  const handleCalculate = () => {
    // TODO: Implement calculation logic
    setResult("Calculation implemented soon!");
  };

  return (
    <CalculatorLayout
      title="Lease vs Buy Calculator"
      description="Calculate and estimate values for Lease vs Buy Calculator."
    >
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Input Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="param1">Parameter 1</Label>
              <Input id="param1" placeholder="Enter value" />
            </div>
            <Button onClick={handleCalculate} className="w-full">
              Calculate
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {result ? (
              <div className="p-4 bg-muted rounded-lg text-center">
                <span className="text-2xl font-bold">{result}</span>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                Enter parameters to see results
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </CalculatorLayout>
  );
}
