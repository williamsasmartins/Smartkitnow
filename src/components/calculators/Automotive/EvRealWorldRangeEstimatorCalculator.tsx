import React from 'react';
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";

export default function EvRealWorldRangeEstimatorCalculator() {
  return (
    <CalculatorVerticalLayout
      title="EV Real-World Range Estimator"
      description="Adjust official EV range for real-world factors like temperature, speed, AC use, and driving style."
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
          <p>Adjust official EV range for real-world factors like temperature, speed, AC use, and driving style.</p>
          <p>We are working hard to bring you this tool. It will help you adjust official ev range for real-world factors like temperature, speed, ac use, and driving style.</p>
        </div>
      }
    />
  );
}
