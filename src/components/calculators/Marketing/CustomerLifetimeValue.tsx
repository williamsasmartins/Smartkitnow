"use client";

import React, { useState } from "react";
import { CalculatorLayout } from "@/components/calculators/shared/CalculatorLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function CustomerLifetimeValue() {
  const [avgPurchaseValue, setAvgPurchaseValue] = useState("");
  const [avgPurchaseFreq, setAvgPurchaseFreq] = useState("");
  const [avgLifespan, setAvgLifespan] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const v = parseFloat(avgPurchaseValue);
    const f = parseFloat(avgPurchaseFreq);
    const l = parseFloat(avgLifespan);
    
    if (!isNaN(v) && !isNaN(f) && !isNaN(l)) {
      const clv = v * f * l;
      setResult(clv);
    }
  };

  return (
    <CalculatorLayout
      title="Customer Lifetime Value (CLV) Calculator"
      description="Estimate the total revenue a business can reasonably expect from a single customer account."
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="avgPurchaseValue">Average Purchase Value ($)</Label>
            <Input
              id="avgPurchaseValue"
              type="number"
              placeholder="e.g., 50"
              value={avgPurchaseValue}
              onChange={(e) => setAvgPurchaseValue(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="avgPurchaseFreq">Avg. Purchase Frequency (per year)</Label>
            <Input
              id="avgPurchaseFreq"
              type="number"
              placeholder="e.g., 4"
              value={avgPurchaseFreq}
              onChange={(e) => setAvgPurchaseFreq(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="avgLifespan">Average Customer Lifespan (years)</Label>
            <Input
              id="avgLifespan"
              type="number"
              placeholder="e.g., 3"
              value={avgLifespan}
              onChange={(e) => setAvgLifespan(e.target.value)}
            />
          </div>
        </div>

        <Button onClick={calculate} className="w-full">
          Calculate CLV
        </Button>

        {result !== null && (
          <Card className="mt-6 bg-muted/50">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Customer Lifetime Value (CLV)</div>
                <div className="text-4xl font-bold text-primary">
                  ${result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-sm text-balance text-muted-foreground mt-2">
                  Total revenue over the customer lifecycle
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </CalculatorLayout>
  );
}
