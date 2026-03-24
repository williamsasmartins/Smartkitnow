"use client";

import React, { useState } from "react";
import { CalculatorLayout } from "@/components/calculators/shared/CalculatorLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ConversionRate() {
  const [conversions, setConversions] = useState("");
  const [visitors, setVisitors] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const c = parseFloat(conversions);
    const v = parseFloat(visitors);
    
    if (!isNaN(c) && !isNaN(v) && v > 0) {
      const conversionRate = (c / v) * 100;
      setResult(conversionRate);
    }
  };

  return (
    <CalculatorLayout
      title="Conversion Rate Calculator"
      description="Calculate the percentage of visitors who completed a desired action (conversion)."
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="conversions">Total Conversions</Label>
            <Input
              id="conversions"
              type="number"
              placeholder="e.g., 250"
              value={conversions}
              onChange={(e) => setConversions(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="visitors">Total Visitors or Clicks</Label>
            <Input
              id="visitors"
              type="number"
              placeholder="e.g., 10000"
              value={visitors}
              onChange={(e) => setVisitors(e.target.value)}
            />
          </div>
        </div>

        <Button onClick={calculate} className="w-full">
          Calculate Conversion Rate
        </Button>

        {result !== null && (
          <Card className="mt-6 bg-muted/50">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Conversion Rate</div>
                <div className="text-4xl font-bold text-primary">
                  {result.toFixed(2)}%
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </CalculatorLayout>
  );
}
