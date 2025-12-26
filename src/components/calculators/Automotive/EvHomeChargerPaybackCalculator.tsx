import React from 'react';
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";

export default function EvHomeChargerPaybackCalculator() {
  return (
    <CalculatorVerticalLayout
      title="Home Charger Installation Cost & Payback Calculator"
      description="Estimate installation cost for a Level 2 charger and payback period through savings vs public charging."
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
          <p>Estimate installation cost for a Level 2 charger and payback period through savings vs public charging.</p>
          <p>We are working hard to bring you this tool. It will help you estimate installation cost for a level 2 charger and payback period through savings vs public charging.</p>
        </div>
      }
    />
  );
}
