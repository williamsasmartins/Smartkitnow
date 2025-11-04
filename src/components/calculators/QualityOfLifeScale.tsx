/* eslint-disable react-refresh/only-export-components */
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";

export type QOLInputs = {
  hurt: number;
  hunger: number;
  hydration: number;
  hygiene: number;
  happiness: number;
  mobility: number;
  moreGoodDays: number;
};

export function computeQOLScore(values: QOLInputs): number {
  const { hurt, hunger, hydration, hygiene, happiness, mobility, moreGoodDays } = values;
  const nums = [hurt, hunger, hydration, hygiene, happiness, mobility, moreGoodDays];
  return nums.reduce((sum, n) => sum + (isFinite(n) ? n : 0), 0);
}

const Domain: React.FC<{
  id: keyof QOLInputs;
  label: string;
  value: number;
  onChange: (v: number) => void;
  description?: string;
}> = ({ id, label, value, onChange, description }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={id}>{label}</Label>
        <span className="text-sm text-muted-foreground">{value}</span>
      </div>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      <Slider
        id={id}
        value={[value]}
        onValueChange={(arr) => onChange(arr[0] ?? 0)}
        min={0}
        max={10}
        step={1}
      />
    </div>
  );
};

const QualityOfLifeScale: React.FC = () => {
  const [values, setValues] = useState<QOLInputs>({
    hurt: 5,
    hunger: 5,
    hydration: 5,
    hygiene: 5,
    happiness: 5,
    mobility: 5,
    moreGoodDays: 5,
  });
  const [score, setScore] = useState<number | null>(null);
  const [advice, setAdvice] = useState<string>("");

  const update = (key: keyof QOLInputs) => (v: number) => {
    setValues((prev) => ({ ...prev, [key]: v }));
  };

  const compute = () => {
    const s = computeQOLScore(values);
    setScore(s);
    // Basic guidance: >= 35 often considered acceptable; 25-34 monitor closely; < 25 consider palliative/hospice; < 20 poor
    let msg = "";
    if (s >= 50) msg = "Quality of life appears strong. Continue current care and monitoring.";
    else if (s >= 35) msg = "Generally acceptable quality of life. Keep tracking trends over time.";
    else if (s >= 25) msg = "Borderline quality of life. Consider adjustments in pain control, nutrition, hydration, and enrichment.";
    else if (s >= 20) msg = "Low quality of life. Discuss palliative options with your veterinarian.";
    else msg = "Very low quality of life. Seek immediate veterinary guidance for compassionate care options.";
    setAdvice(msg);
  };

  const reset = () => {
    setValues({ hurt: 5, hunger: 5, hydration: 5, hygiene: 5, happiness: 5, mobility: 5, moreGoodDays: 5 });
    setScore(null);
    setAdvice("");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">Pet Quality of Life — HHHHHMM Scale</h1>
        <p className="text-lg text-muted-foreground">Rate each domain from 0 (poor) to 10 (excellent) to assess overall quality of life.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quality of Life Scale</CardTitle>
          <CardDescription>Hurt, Hunger, Hydration, Hygiene, Happiness, Mobility, and More Good Days than Bad.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Domain id="hurt" label="Hurt" value={values.hurt} onChange={update("hurt")} description="Pain control and comfort." />
            <Domain id="hunger" label="Hunger" value={values.hunger} onChange={update("hunger")} description="Appetite and adequate nutrition." />
            <Domain id="hydration" label="Hydration" value={values.hydration} onChange={update("hydration")} description="Fluid intake and hydration status." />
            <Domain id="hygiene" label="Hygiene" value={values.hygiene} onChange={update("hygiene")} description="Cleanliness, grooming, and skin/coat care." />
            <Domain id="happiness" label="Happiness" value={values.happiness} onChange={update("happiness")} description="Interest in activities, social engagement, enrichment." />
            <Domain id="mobility" label="Mobility" value={values.mobility} onChange={update("mobility")} description="Ability to move, walk, and get comfortable." />
            <Domain id="moreGoodDays" label="More Good Days than Bad" value={values.moreGoodDays} onChange={update("moreGoodDays")} description="Overall trend of good vs. bad days." />
          </div>

          <Separator />
          <div className="flex gap-2">
            <Button variant="calculate" onClick={compute}>Compute Score</Button>
            <Button variant="reset" onClick={reset}>Reset</Button>
          </div>

          {score !== null && (
            <div className="mt-6 space-y-3">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">Total Score: {score} / 70</div>
                <p className="text-muted-foreground">Higher scores generally indicate better quality of life.</p>
              </div>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-2">Guidance</h3>
                <p className="text-sm text-muted-foreground">{advice}</p>
              </div>
              <Separator />
              <p className="text-xs text-muted-foreground">This tool is for educational purposes and does not replace veterinary advice. Always consult your veterinarian for decisions regarding your pet's care.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QualityOfLifeScale;