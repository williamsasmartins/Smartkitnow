import React from 'react';
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";

export default function EvHybridMaintenanceSavingsCalculator() {
  return (
    <CalculatorVerticalLayout
      title="EV Maintenance Savings vs Hybrid Calculator"
      description="Compare long-term maintenance and repair costs between EVs and hybrids, factoring in fewer moving parts, brake regeneration, and no oil changes."
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
          <p>Compare long-term maintenance and repair costs between EVs and hybrids, factoring in fewer moving parts, brake regeneration, and no oil changes.</p>
          <p>We are working hard to bring you this tool. It will help you compare long-term maintenance and repair costs between evs and hybrids, factoring in fewer moving parts, brake regeneration, and no oil changes.</p>
        </div>
      }
    />
  );
}
