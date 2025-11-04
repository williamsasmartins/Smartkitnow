import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import QualityOfLifeScale, { computeQOLScore, QOLInputs } from "./QualityOfLifeScale";

const PetQualityOfLifeCalculator: React.FC = () => {
  const [values, setValues] = React.useState<QOLInputs | null>(null);
  const [score, setScore] = React.useState<number | null>(null);

  const onComputeFromChild = (vals: QOLInputs) => {
    setValues(vals);
    setScore(computeQOLScore(vals));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">Pet Quality of Life Planner</h1>
        <p className="text-lg text-muted-foreground">Use the HHHHHMM scale to evaluate and plan supportive care for your pet.</p>
      </div>

      {/* Embedding the scale component; we rely on its own UI and scoring */}
      <QualityOfLifeScale />

      {/* Optional: A simple block that would react to the score if exposed via callback in future */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Care Plan Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">Consider the following supportive measures based on your pet's needs:</p>
          <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-2">
            <li>Pain management and comfort measures (soft bedding, gentle handling).</li>
            <li>Nutrition adjustments (palatable foods, small frequent meals).</li>
            <li>Hydration support (fresh water access, vet-guided subcutaneous fluids if indicated).</li>
            <li>Hygiene and grooming assistance (clean coat, trimmed nails, assisted toileting).</li>
            <li>Enrichment and gentle social time (favorite toys, calm interaction).</li>
            <li>Mobility aids (ramps, orthotics, assisted walking time).</li>
            <li>Daily tracking of good vs. bad days; keep a simple journal to notice trends.</li>
          </ul>
          <Separator />
          <p className="text-xs text-muted-foreground">This planner provides general guidance only and is not a substitute for veterinary care. Discuss any major changes with your veterinarian.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PetQualityOfLifeCalculator;