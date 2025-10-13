import React, { useMemo, useState } from "react";
import PetCalculatorPageLayout from "@/components/layouts/PetCalculatorPageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CalculatorFeedbackShare from "@/components/calculators/CalculatorFeedbackShare";

type Unit = "kg" | "lb" | "g" | "oz";
type SelectOption = { value: string; label: string };

type RiskBand = { id: string; label: string; tone: string; message: string };

type Metric = {
  key: string;
  label: string;
  format?: (v: number) => string;
};

type FieldConfig =
  | { type: "number"; key: string; label: string; min?: number; step?: number; default?: number }
  | { type: "select"; key: string; label: string; options: SelectOption[]; default?: string }
  | { type: "unit"; key: string; label: string; options: Unit[]; default: Unit };

export type PetCalcOmniConfig = {
  title: string;
  shortDescription: string;
  strongDisclaimer?: string;
  showTopAd?: boolean;
  showRightAd?: boolean;

  // Inputs e cálculo
  inputs: FieldConfig[];
  compute: (s: Record<string, any> & { toKg: (v: number, u: Unit) => number; toGrams: (v: number, u: Unit) => number }) => {
    metrics: Record<string, number>;
    riskKey?: string; // deve bater com alguma band.id
  };
  metricsDisplay?: Metric[];
  riskBands?: RiskBand[];
  cta?: { label: string; href?: string; tel?: string };

  // Conteúdo editorial (esquerda)
  howToUse?: string[];
  howItWorks?: { intro?: string; formula?: string; variables?: string[] };
  tables?: Array<{ title: string; headers: string[]; rows: Array<(string | number)[]>; notes?: string[] }>;
  faqs?: Array<{ question: string; answer: string }>;
  sources?: Array<{ label: string; href: string; note?: string }>;
};

const fmt1 = (v: number) => (Number.isFinite(v) ? v.toFixed(1) : "-");
const toKg = (v: number, u: Unit) => (u === "lb" ? v * 0.45359237 : v);
const toGrams = (v: number, u: Unit) => (u === "oz" ? v * 28.349523125 : v);

export default function PetCalcOmniTemplate({ config }: { config: PetCalcOmniConfig }) {
  // estado inicial dos inputs
  const initial: Record<string, any> = {};
  for (const f of config.inputs) {
    if ("default" in f && f.default !== undefined) initial[f.key] = f.default;
    else if (f.type === "unit") initial[f.key] = f.options[0];
    else initial[f.key] = "";
  }
  const [state, setState] = useState<Record<string, any>>(initial);

  const computeOut = useMemo(() => config.compute({ ...state, toKg, toGrams }), [state, config]);

  const risk = useMemo(() => {
    if (!config.riskBands || !computeOut.riskKey) return null;
    return config.riskBands.find((b) => b.id === computeOut.riskKey) ?? null;
  }, [computeOut.riskKey, config.riskBands]);

  // ===================== colunas =====================
  const center = (
    <div className="w-full">
      <Card className="w-full bg-card border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">{config.title}</CardTitle>
          <CardDescription>{config.shortDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {config.inputs.map((f) => {
              if (f.type === "number") {
                return (
                  <div key={f.key}>
                    <Label htmlFor={f.key}>{f.label}</Label>
                    <Input
                      id={f.key}
                      type="number"
                      min={f.min ?? 0}
                      step={f.step ?? 0.1}
                      className="mt-2"
                      value={state[f.key] ?? ""}
                      onChange={(e) => setState((s) => ({ ...s, [f.key]: e.target.value }))}
                    />
                  </div>
                );
              }
              if (f.type === "select") {
                return (
                  <div key={f.key}>
                    <Label>{f.label}</Label>
                    <Select value={state[f.key] ?? f.default ?? ""} onValueChange={(v) => setState((s) => ({ ...s, [f.key]: v }))}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {f.options.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {o.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                );
              }
              // unit
              return (
                <div key={f.key}>
                  <Label>{f.label}</Label>
                  <Select value={state[f.key] ?? f.default ?? ""} onValueChange={(v) => setState((s) => ({ ...s, [f.key]: v }))}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {f.options.map((o) => (
                        <SelectItem key={o} value={o}>
                          {o}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              );
            })}
          </div>

          {/* Metrics */}
          {config.metricsDisplay?.length ? (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {config.metricsDisplay.map((m) => (
                <div key={m.key} className="rounded-md border border-border/50 bg-muted/20 p-3">
                  <div className="text-xs text-muted-foreground">{m.label}</div>
                  <div className="text-lg font-semibold">{m.format(computeOut.metrics[m.key])}</div>
                </div>
              ))}
            </div>
          ) : null}

          {/* Risk band */}
          {risk ? (
            <div className="mt-6">
              <div className={`rounded-md p-3 text-white ${risk.tone}`}>
                <div className="font-semibold">{risk.label} risk</div>
                <p className="text-sm mt-1">{risk.message}</p>
              </div>
            </div>
          ) : null}

          {/* Call to action */}
          {config.cta ? (
            <div className="mt-6">
              <Button className="w-full" variant="destructive">
                {config.cta.label}
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );

  const left = (
    <article>
      <h1 className="text-3xl font-bold" style={{ color: "#5c82ee" }}>{config.title}</h1>
      <p className="text-muted-foreground mt-2">{config.shortDescription}</p>

      {config.howToUse?.length ? (
        <section className="mt-8">
          <h2 className="text-xl font-semibold" style={{ color: "#5c82ee" }}>How to use</h2>
          <ul className="list-disc pl-6 mt-2 text-muted-foreground">
            {config.howToUse.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {config.howItWorks && (config.howItWorks.intro || config.howItWorks.formula || config.howItWorks.variables?.length) ? (
        <section className="mt-8">
          <h2 className="text-xl font-semibold" style={{ color: "#5c82ee" }}>How the calculation works</h2>
          {config.howItWorks.intro && <p className="mt-2 text-muted-foreground">{config.howItWorks.intro}</p>}
          {config.howItWorks.formula && (
            <pre className="mt-3 bg-muted/50 text-sm p-3 rounded-md overflow-auto">
              <code>{config.howItWorks.formula}</code>
            </pre>
          )}
          {config.howItWorks.variables?.length ? (
            <ul className="list-disc pl-6 mt-2 text-muted-foreground">
              {config.howItWorks.variables.map((v, i) => (
                <li key={i}>{v}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {config.tables?.length
        ? config.tables.map((t, idx) => (
            <section key={idx} className="mt-8">
              <h2 className="text-xl font-semibold" style={{ color: "#5c82ee" }}>{t.title}</h2>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-left">
                    <tr>{t.headers.map((h, i) => <th key={i} className="py-2 pr-4">{h}</th>)}</tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    {t.rows.map((r, i) => (
                      <tr key={i} className="border-t border-border/50">
                        {r.map((c, j) => (
                          <td key={j} className="py-2 pr-4">{c}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {t.notes?.length ? (
                <ul className="list-disc pl-6 mt-2 text-xs text-muted-foreground">
                  {t.notes.map((n, i) => (
                    <li key={i}>{n}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))
        : null}

      {config.faqs?.length ? (
        <section className="mt-8">
          <h2 className="text-xl font-semibold" style={{ color: "#5c82ee" }}>FAQs</h2>
          <div className="mt-2 space-y-4">
            {config.faqs.map((f, i) => (
              <details key={i} className="rounded-md border border-border/50 p-3 bg-card">
                <summary className="cursor-pointer font-medium">{f.question}</summary>
                <p className="mt-2 text-muted-foreground">{f.answer}</p>
              </details>
            ))}
          </div>
        </section>
      ) : null}

      {config.sources?.length ? (
        <section className="mt-8">
          <h2 className="text-xl font-semibold" style={{ color: "#5c82ee" }}>Formula & Sources</h2>
          <ul className="list-disc pl-6 mt-2 text-sm text-muted-foreground">
            {config.sources.map((s, i) => (
              <li key={i}>
                <a className="underline" href={s.href} target="_blank" rel="noreferrer">
                  {s.label}
                </a>
                {s.note ? ` — ${s.note}` : ""}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );

  return (
    <>
      <PetCalculatorPageLayout
        left={left}
        center={center}
        showTopAd={config.showTopAd}
      />
      <div className="w-screen max-w-none mx-0 px-2 sm:px-4 md:pl-6 md:pr-4">
        <CalculatorFeedbackShare />
      </div>
    </>
  );
}