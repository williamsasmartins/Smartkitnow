"use client";

import React, { useState } from "react";
import { CalculatorLayout } from "@/components/calculators/shared/CalculatorLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function CustomerAcquisitionCost() {
  const [marketingCost, setMarketingCost] = useState("");
  const [salesCost, setSalesCost] = useState("");
  const [newCustomers, setNewCustomers] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const m = parseFloat(marketingCost) || 0;
    const s = parseFloat(salesCost) || 0;
    const c = parseFloat(newCustomers);
    
    if (!isNaN(c) && c > 0) {
      const cac = (m + s) / c;
      setResult(cac);
    }
  };

  return (
    <CalculatorLayout
      title="Customer Acquisition Cost (CAC) Calculator"
      description="Calculate how much it costs to acquire a new customer."
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="marketingCost">Total Marketing Cost ($)</Label>
            <Input
              id="marketingCost"
              type="number"
              placeholder="e.g., 5000"
              value={marketingCost}
              onChange={(e) => setMarketingCost(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="salesCost">Total Sales Cost ($)</Label>
            <Input
              id="salesCost"
              type="number"
              placeholder="e.g., 2000"
              value={salesCost}
              onChange={(e) => setSalesCost(e.target.value)}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="newCustomers">Number of New Customers Acquired</Label>
            <Input
              id="newCustomers"
              type="number"
              placeholder="e.g., 100"
              value={newCustomers}
              onChange={(e) => setNewCustomers(e.target.value)}
            />
          </div>
        </div>

        <Button onClick={calculate} className="w-full">
          Calculate CAC
        </Button>

        {result !== null && (
          <Card className="mt-6 bg-muted/50">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Customer Acquisition Cost (CAC)</div>
                <div className="text-4xl font-bold text-primary">
                  ${result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-sm text-balance text-muted-foreground mt-2">
                  per new customer
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </CalculatorLayout>
  );
}
