import React, { useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export type OmniNumberInput = {
  key: string;
  label: string;
  type: "number";
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  default?: number;
};

export type OmniSelectInput = {
  key: string;
  label: string;
  type: "select";
  options: { value: string; label: string }[];
  default?: string;
};

export type OmniUnitInput = {
  key: string;
  label: string;
  type: "unit";
  options: string[];
  default?: string;
};

export type OmniInput = OmniNumberInput | OmniSelectInput | OmniUnitInput;

export type OmniMetric = { label: string; value: string | number };
export type OmniCTA = { label: string; href: string };

export type OmniDisplaySection = { title: string; content: string };
export type OmniDisplayTable = {
  title: string;
  headers: string[];
  rows: (string | number)[][];
  notes?: string[];
};

export type PetCalcOmniConfig = {
  id?: string;
  title: string;
  description?: string;
  shortDescription?: string;
  strongDisclaimer?: string;
  tags?: string[];
  showTopAd?: boolean;
  showRightAd?: boolean;
  inputs: OmniInput[];
  calculate: (inputs: Record<string, unknown>) => {
    metrics?: OmniMetric[];
    riskBand?: "none" | "mild" | "moderate" | "severe" | string;
    cta?: OmniCTA;
  };
  display?: {
    sections?: OmniDisplaySection[];
    tables?: OmniDisplayTable[];
  };
  faqs?: { question: string; answer: string }[];
  sources?: { label: string; href: string }[];
};

type Props = { config: PetCalcOmniConfig };

function getDefaultValues(inputs: OmniInput[]): Record<string, unknown> {
  const acc: Record<string, unknown> = {};
  for (const input of inputs) {
    if (input.type === "number") {
      acc[input.key] = input.default ?? 0;
    } else if (input.type === "select") {
      acc[input.key] = input.default ?? (input.options[0]?.value ?? "");
    } else if (input.type === "unit") {
      acc[input.key] = input.default ?? (input.options[0] ?? "");
    }
  }
  return acc;
}

export default function PetCalcOmniTemplate({ config }: Props) {
  const { title, description, inputs, display } = config;
  const [values, setValues] = useState<Record<string, unknown>>(
    () => getDefaultValues(inputs)
  );
  const [metrics, setMetrics] = useState<OmniMetric[] | undefined>(undefined);
  const [riskBand, setRiskBand] = useState<string | undefined>(undefined);
  const [cta, setCTA] = useState<OmniCTA | undefined>(undefined);

  const onCalculate = () => {
    const result = config.calculate(values);
    setMetrics(result.metrics);
    setRiskBand(result.riskBand);
    setCTA(result.cta);
  };

  const sectionCards = useMemo(() => display?.sections ?? [], [display]);
  const tables = useMemo(() => display?.tables ?? [], [display]);

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-muted-foreground mt-2">{description}</p>
        )}
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Inputs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inputs.map((input) => {
              if (input.type === "number") {
                const ni = input as OmniNumberInput;
                const val = (values[ni.key] as number) ?? ni.default ?? 0;
                return (
                  <div key={ni.key} className="flex flex-col gap-2">
                    <Label htmlFor={ni.key}>{ni.label}{ni.unit ? ` (${ni.unit})` : ""}</Label>
                    <Input
                      id={ni.key}
                      type="number"
                      min={ni.min}
                      max={ni.max}
                      step={ni.step}
                      value={val}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const next = e.target.value === "" ? undefined : Number(e.target.value);
                        setValues((prev) => ({ ...prev, [ni.key]: next }));
                      }}
                    />
                  </div>
                );
              }

              if (input.type === "select") {
                const si = input as OmniSelectInput;
                const val = (values[si.key] as string) ?? si.default ?? si.options[0]?.value ?? "";
                return (
                  <div key={si.key} className="flex flex-col gap-2">
                    <Label>{si.label}</Label>
                    <Select
                      value={val}
                      onValueChange={(v: string) => {
                        setValues((prev) => ({ ...prev, [si.key]: v }));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {si.options.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                );
              }

              // unit behaves like select with string options
              const ui = input as OmniUnitInput;
              const val = (values[ui.key] as string) ?? ui.default ?? ui.options[0] ?? "";
              return (
                <div key={ui.key} className="flex flex-col gap-2">
                  <Label>{ui.label}</Label>
                  <Select
                    value={val}
                    onValueChange={(v: string) => {
                      setValues((prev) => ({ ...prev, [ui.key]: v }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {ui.options.map((opt) => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              );
            })}
          </div>

          <div className="mt-4">
            <Button onClick={onCalculate}>Calculate</Button>
          </div>
        </CardContent>
      </Card>

      {(metrics || riskBand || cta) && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Results</CardTitle>
          </CardHeader>
          <CardContent>
            {metrics && metrics.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {metrics.map((m, idx) => (
                  <div key={idx} className="p-3 border rounded">
                    <div className="text-sm text-muted-foreground">{m.label}</div>
                    <div className="text-lg font-semibold">{m.value}</div>
                  </div>
                ))}
              </div>
            )}
            {riskBand && (
              <div className="mb-2">Risk band: <span className="font-medium">{riskBand}</span></div>
            )}
            {cta && (
              <div className="mt-2">
                <a href={cta.href} target="_blank" rel="noopener noreferrer">
                  <Button variant="secondary">{cta.label}</Button>
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {sectionCards.length > 0 && (
        <div className="grid grid-cols-1 gap-4 mb-6">
          {sectionCards.map((s, idx) => (
            <Card key={idx}>
              <CardHeader>
                <CardTitle>{s.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{s.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {tables.length > 0 && (
        <div className="grid grid-cols-1 gap-4">
          {tables.map((t, idx) => (
            <Card key={idx}>
              <CardHeader>
                <CardTitle>{t.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr>
                        {t.headers.map((h, i) => (
                          <th key={i} className="text-left p-2 border-b">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {t.rows.map((row, rIdx) => (
                        <tr key={rIdx}>
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="p-2 border-b">{String(cell)}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {t.notes && t.notes.length > 0 && (
                  <ul className="mt-3 list-disc pl-5 text-xs text-muted-foreground">
                    {t.notes.map((n, nIdx) => (
                      <li key={nIdx}>{n}</li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}