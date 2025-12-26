import React from 'react';
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";

export default function EvTripCostPlannerCalculator() {
  return (
    <CalculatorVerticalLayout
      title="EV Trip Cost & Charging Planner"
      description="Calculate total cost and required charging stops for a specific road trip in an EV."
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
          <p>Calculate total cost and required charging stops for a specific road trip in an EV.</p>
          <p>We are working hard to bring you this tool. It will help you calculate total cost and required charging stops for a specific road trip in an ev.</p>
        </div>
      }
    />
  );
}
