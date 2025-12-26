import React from 'react';
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";

export default function EvBatteryDegradationCalculator() {
  return (
    <CalculatorVerticalLayout
      title="EV Battery Degradation & Long-Term Range Estimator"
      description="Predict battery capacity loss over years and impact on range, based on usage and charging habits."
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
          <p>Predict battery capacity loss over years and impact on range, based on usage and charging habits.</p>
          <p>We are working hard to bring you this tool. It will help you predict battery capacity loss over years and impact on range, based on usage and charging habits.</p>
        </div>
      }
    />
  );
}
