import React from 'react';
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";

export default function EvHomePublicChargingCostTimeCalculator() {
  return (
    <CalculatorVerticalLayout
      title="EV Home vs Public Charging Cost & Time Calculator"
      description="Estimate charging time and cost at home (Level 2) versus public stations, including electricity rates and charger power."
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
          <p>Estimate charging time and cost at home (Level 2) versus public stations, including electricity rates and charger power.</p>
          <p>We are working hard to bring you this tool. It will help you estimate charging time and cost at home (level 2) versus public stations, including electricity rates and charger power.</p>
        </div>
      }
    />
  );
}
