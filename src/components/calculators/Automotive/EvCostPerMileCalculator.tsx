import React from 'react';
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";

export default function EvCostPerMileCalculator() {
  return (
    <CalculatorVerticalLayout
      title="EV Cost Per Mile Calculator"
      description="Calculate the exact cost per mile or km for an EV based on efficiency (kWh/100mi) and local electricity prices."
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
          <p>Calculate the exact cost per mile or km for an EV based on efficiency (kWh/100mi) and local electricity prices.</p>
          <p>We are working hard to bring you this tool. It will help you calculate the exact cost per mile or km for an ev based on efficiency (kwh/100mi) and local electricity prices.</p>
        </div>
      }
    />
  );
}
