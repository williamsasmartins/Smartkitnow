import React from 'react';
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";

export default function EvFastChargingDegradationCalculator() {
  return (
    <CalculatorVerticalLayout
      title="EV Fast Charging Impact on Battery Life Calculator"
      description="Estimate battery degradation acceleration from frequent DC fast charging vs slower AC charging, based on usage patterns and temperature."
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
          <p>Estimate battery degradation acceleration from frequent DC fast charging vs slower AC charging, based on usage patterns and temperature.</p>
          <p>We are working hard to bring you this tool. It will help you estimate battery degradation acceleration from frequent dc fast charging vs slower ac charging, based on usage patterns and temperature.</p>
        </div>
      }
    />
  );
}
