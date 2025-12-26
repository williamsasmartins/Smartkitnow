import React from 'react';
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";

export default function AnnualEvHybridCostCalculator() {
  return (
    <CalculatorVerticalLayout
      title="Annual Fuel/Electricity Cost: EV vs Hybrid"
      description="Compare yearly operating costs for EV, hybrid, and gas vehicles based on annual mileage and local rates."
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
          <p>Compare yearly operating costs for EV, hybrid, and gas vehicles based on annual mileage and local rates.</p>
          <p>We are working hard to bring you this tool. It will help you compare yearly operating costs for ev, hybrid, and gas vehicles based on annual mileage and local rates.</p>
        </div>
      }
    />
  );
}
