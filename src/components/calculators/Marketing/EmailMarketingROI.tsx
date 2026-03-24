"use client";

import React, { useState } from "react";
import { CalculatorLayout } from "@/components/calculators/shared/CalculatorLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function EmailMarketingROI() {
  const [revenue, setRevenue] = useState("");
  const [cost, setCost] = useState("");
  const [result, setResult] = useState<{ roi: number; profit: number } | null>(null);

  const calculate = () => {
    const r = parseFloat(revenue);
    const c = parseFloat(cost);
    if (!isNaN(r) && !isNaN(c) && c > 0) {
      const profit = r - c;
      const roi = (profit / c) * 100;
      setResult({ roi, profit });
    }
  };

  return (
    <CalculatorLayout
      title="Email Marketing ROI Calculator"
      description="Calculate the return on investment for your email marketing campaigns."
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="revenue">Revenue from Email Campaign ($)</Label>
            <Input
              id="revenue"
              type="number"
              placeholder="e.g., 20000"
              value={revenue}
              onChange={(e) => setRevenue(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cost">Cost of Email Campaign ($)</Label>
            <Input
              id="cost"
              type="number"
              placeholder="e.g., 500"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
            />
          </div>
        </div>

        <Button onClick={calculate} className="w-full">
          Calculate ROI
        </Button>

        {result && (
          <Card className="mt-6 bg-muted/50">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Email Marketing ROI</div>
                <div className="text-4xl font-bold text-primary">
                  {result.roi.toFixed(2)}%
                </div>
                <div className="text-sm text-balance text-muted-foreground mt-2">
                  Net Profit: ${result.profit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </CalculatorLayout>
  );
}
