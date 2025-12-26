import React from 'react';
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";

export default function EvSolarChargingSavingsCalculator() {
  return (
    <CalculatorVerticalLayout
      title="EV Solar Charging Savings Calculator"
      description="Calculate cost savings and payback when charging an EV with home solar panels, including excess energy credits and reduced grid reliance."
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
          <p>Calculate cost savings and payback when charging an EV with home solar panels, including excess energy credits and reduced grid reliance.</p>
          <p>We are working hard to bring you this tool. It will help you calculate cost savings and payback when charging an ev with home solar panels, including excess energy credits and reduced grid reliance.</p>
        </div>
      }
    />
  );
}
