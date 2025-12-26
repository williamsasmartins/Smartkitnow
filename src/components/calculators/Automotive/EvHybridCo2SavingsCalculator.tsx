import React from 'react';
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";

export default function EvHybridCo2SavingsCalculator() {
  return (
    <CalculatorVerticalLayout
      title="CO2 Emissions Savings: EV vs Hybrid"
      description="Estimate carbon emissions reduction when switching from hybrid/gas to EV, based on mileage and grid cleanliness."
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
          <p>Estimate carbon emissions reduction when switching from hybrid/gas to EV, based on mileage and grid cleanliness.</p>
          <p>We are working hard to bring you this tool. It will help you estimate carbon emissions reduction when switching from hybrid/gas to ev, based on mileage and grid cleanliness.</p>
        </div>
      }
    />
  );
}
