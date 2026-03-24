"use client";

import React, { useState } from "react";
import { CalculatorLayout } from "@/components/calculators/shared/CalculatorLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ChurnRate() {
  const [lostCustomers, setLostCustomers] = useState("");
  const [totalCustomersStart, setTotalCustomersStart] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const l = parseFloat(lostCustomers);
    const t = parseFloat(totalCustomersStart);
    
    if (!isNaN(l) && !isNaN(t) && t > 0) {
      const churnRate = (l / t) * 100;
      setResult(churnRate);
    }
  };

  return (
    <CalculatorLayout
      title="Churn Rate Calculator"
      description="Calculate the percentage of customers who stopped using your product or service during a given time period."
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="lostCustomers">Customers Lost During Period</Label>
            <Input
              id="lostCustomers"
              type="number"
              placeholder="e.g., 50"
              value={lostCustomers}
              onChange={(e) => setLostCustomers(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="totalCustomersStart">Total Customers at Start of Period</Label>
            <Input
              id="totalCustomersStart"
              type="number"
              placeholder="e.g., 1000"
              value={totalCustomersStart}
              onChange={(e) => setTotalCustomersStart(e.target.value)}
            />
          </div>
        </div>

        <Button onClick={calculate} className="w-full">
          Calculate Churn Rate
        </Button>

        {result !== null && (
          <Card className="mt-6 bg-muted/50">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Churn Rate</div>
                <div className="text-4xl font-bold text-destructive">
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
