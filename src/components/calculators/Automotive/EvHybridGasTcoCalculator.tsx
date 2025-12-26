import React from 'react';
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";

export default function EvHybridGasTcoCalculator() {
  return (
    <CalculatorVerticalLayout
      title="EV vs Hybrid vs Gas TCO Calculator"
      description="Compare total cost of ownership over 5-10 years, including purchase price, fuel/electricity, maintenance, incentives, and depreciation."
      widget={
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">This calculator is currently under development. Please check back soon!</p>
          </CardContent>
        </Card>
      }
      editorial={
        <div className="prose dark:prose-invert max-w-none">
          <h2>About this calculator</h2>
          <p>Compare total cost of ownership over 5-10 years, including purchase price, fuel/electricity, maintenance, incentives, and depreciation.</p>
          <p>We are working hard to bring you this tool. It will help you compare total cost of ownership over 5-10 years, including purchase price, fuel/electricity, maintenance, incentives, and depreciation.</p>
        </div>
      }
    />
  );
}
