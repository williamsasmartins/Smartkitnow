import React, { useMemo, useState, useEffect } from "react";
import PetCalculatorPageLayout from "@/components/layouts/PetCalculatorPageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CalculatorFeedbackShare from "../calculators/CalculatorFeedbackShare";
import SeoHead from "@/components/seo/SeoHead";
import JsonLd from "@/components/seo/JsonLd";

type Unit = "kg" | "lb" | "g" | "oz";
type SelectOption = { value: string; label: string };

type RiskBand = { id: string; label: string; tone: string; message: string };

type Metric = { 
  key: string; 
  label: string; 
  format?: (v: number) => string; 
}; 

type NumberField = { type: "number"; key: string; label: string; min?: number; step?: number; default?: number }; 
type SelectField = { type: "select"; key: string; label: string; options: SelectOption[]; default?: string }; 
type UnitField = { type: "unit"; key: string; label: string; options: Unit[]; default?: Unit }; 

type FieldConfig = NumberField | SelectField | UnitField; 

export type PetCalcOmniConfig = { 
  title: string; 
  shortDescription: string; 
  strongDisclaimer?: string; 
  updatedAt?: string;
  showTopAd?: boolean; 
  showRightAd?: boolean; 

  // E-E-A-T: Reviewer metadata (object expected by calculators)
  reviewedBy?:
    | string
    | {
        name: string;
        credentials?: string; 
        role?: string;        
        date?: string;        
        bioUrl?: string;      
        avatarUrl?: string;   
      };

  // E-E-A-T: Author metadata (object expected by calculators)
  authoredBy?: {
    name: string;
    role?: string;        
    date?: string;        
    bioUrl?: string;
    avatarUrl?: string;
  };

  inputs: FieldConfig[]; 
  compute: ( 
    s: Record<string, any> & { toKg: (v: number, u: Unit) => number; toGrams: (v: number, u: Unit) => number } 
  ) => { 
    metrics: Record<string, number>; 
    riskKey?: string; 
  }; 
  metricsDisplay?: Metric[]; 
  riskBands?: RiskBand[]; 
  cta?: { label: string; href?: string; tel?: string }; 
  stickyCta?: { whenRiskIn?: string[]; label: string; href?: string; tel?: string };

  // editorial content
  professionalAdviceNote?: string; 
  howToUse?: string[]; 
  howItWorks?: { intro?: string; formula?: string; variables?: string[] }; 
  tables?: Array<{ title: string; headers: string[]; rows: Array<(string | number)[]>; notes?: string[] }>; 
  faqs?: Array<{ question: string; answer: string }>; 
  sources?: Array<{ label: string; href: string; note?: string }>; 
  relatedLinks?: Array<{ href: string; label: string }>; 
  glossary?: Array<{ term: string; def: string }>;
  reviewedByBlock?: { text: string };

  // Optional SEO/JSON-LD handled by template when provided
  seo?: { title: string; description?: string; canonical?: string; keywords?: string[]; ogImage?: string };
  jsonLd?: {
    webpage?: Record<string, any>;
    breadcrumbs?: { items: Array<{ name: string; item: string }> };
    faq?: Array<{ q: string; a: string }>;
  };
}; 

const fmt1 = (v: number) => (Number.isFinite(v) ? v.toFixed(1) : "-"); 
const toKg = (v: number, u: Unit) => (u === "lb" ? v * 0.45359237 : v); 
const toGrams = (v: number, u: Unit) => (u === "oz" ? v * 28.349523125 : v); 

// Deep sanitize helper: strips backticks from all string values and trims whitespace
const stripGrave = (s: any): any => (typeof s === "string" ? s.replace(/`/g, "").trim() : s);
const deepSanitizeStrings = (value: any): any => {
  if (value == null) return value;
  if (typeof value === "string") return stripGrave(value);
  if (Array.isArray(value)) return value.map(deepSanitizeStrings);
  if (typeof value === "object") {
    const out: any = {};
    for (const [k, v] of Object.entries(value)) out[k] = deepSanitizeStrings(v);
    return out;
  }
  return value;
};

export default function PetCalcOmniTemplate({ config }: { config: PetCalcOmniConfig }) { 
  useEffect(() => {
    console.log("PetCalcOmniTemplate — ATIVO");
  }, []);
  // ======= estado inicial com narrowing correto do union ======= 
  const initial = useMemo(() => { 
    const acc: Record<string, any> = {}; 
    for (const f of config.inputs) { 
      switch (f.type) { 
        case "number": 
          acc[f.key] = f.default ?? ""; 
          break; 
        case "select": 
          acc[f.key] = f.default ?? f.options[0]?.value ?? ""; 
          break; 
        case "unit": 
          acc[f.key] = f.default ?? f.options[0]; 
          break; 
      } 
    } 
    return acc; 
  }, [config.inputs]); 

  const [state, setState] = useState<Record<string, any>>(initial); 

  const computeOut = useMemo(() => config.compute({ ...state, toKg, toGrams }), [state, config]); 

  const risk = useMemo(() => { 
    if (!config.riskBands || !computeOut.riskKey) return null; 
    return config.riskBands.find((b) => b.id === computeOut.riskKey) ?? null; 
  }, [computeOut.riskKey, config.riskBands]); 

  // Allow sticky CTA when risk matches (or no filter provided)
  const stickyCtaAllowed = !!config.stickyCta && (
    !config.stickyCta.whenRiskIn ||
    (computeOut.riskKey != null && config.stickyCta.whenRiskIn?.includes(computeOut.riskKey))
  );

  // ===================== colunas ===================== 
  const center = ( 
    <div className="w-full"> 
      <Card className="w-full bg-card border-border/50 shadow-sm"> 
        <CardHeader> 
          <CardTitle className="text-[15px] md:text-[16px]">{config.title}</CardTitle> 
          <CardDescription className="text-[13px] md:text-[14px]">{config.shortDescription}</CardDescription> 
        </CardHeader> 
        <CardContent> 
          {/* Inputs */} 
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4"> 
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
                  <div className="text-base md:text-lg font-semibold"> 
                    {(m.format ?? fmt1)(computeOut.metrics[m.key])} 
                  </div> 
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
    <article className="text-[14px] md:text-[15px] leading-relaxed"> 
      <h1 className="text-xl md:text-2xl font-bold mb-1" style={{ color: "#5c82ee" }}> 
        {config.title} 
      </h1> 
      <p className="text-sm md:text-[15px] text-muted-foreground">{config.shortDescription}</p> 

      {/* Reviewed by block */}
      {config.reviewedBy ? (
        <section className="mt-4">
          {typeof config.reviewedBy === "string" ? (
            <div className="rounded-md border border-border/50 bg-card p-3 text-[13px] md:text-[14px]">
              <div className="font-medium">✅ {config.reviewedBy}</div>
            </div>
          ) : (
            <div className="flex items-start gap-3 rounded-md border border-border/50 bg-card p-3">
              {config.reviewedBy.avatarUrl ? (
                <img
                  src={config.reviewedBy.avatarUrl}
                  alt={config.reviewedBy.name}
                  className="h-10 w-10 rounded-full object-cover"
                  loading="lazy"
                />
              ) : null}
              <div className="text-[13px] md:text-[14px]">
                <div className="font-medium">
                  Reviewed by{" "}
                  {config.reviewedBy.bioUrl ? (
                    <a href={config.reviewedBy.bioUrl} target="_blank" rel="noreferrer" className="underline">
                      {config.reviewedBy.name}
                    </a>
                  ) : (
                    config.reviewedBy.name
                  )}
                  {config.reviewedBy.credentials ? `, ${config.reviewedBy.credentials}` : ""}
                  {config.reviewedBy.role ? ` — ${config.reviewedBy.role}` : ""}
                </div>
                {config.reviewedBy.date ? (
                  <div className="text-xs text-muted-foreground">Last reviewed: {config.reviewedBy.date}</div>
                ) : null}
              </div>
            </div>
          )}
        </section>
      ) : null}

      {/* Optional professional advice note */}
      {config.professionalAdviceNote ? (
        <div className="mt-3 rounded-md border border-border/50 bg-muted/20 p-3 text-[13px] text-muted-foreground">
          {config.professionalAdviceNote}
        </div>
      ) : null}

      {config.howToUse?.length ? ( 
        <section className="mt-8"> 
          <h2 className="text-lg md:text-xl font-semibold" style={{ color: "#5c82ee" }}> 
            How to use 
          </h2> 
          <ul className="list-disc pl-6 mt-2 text-muted-foreground"> 
            {config.howToUse.map((t, i) => ( 
              <li key={i}>{t}</li> 
            ))} 
          </ul> 
        </section> 
      ) : null} 

      {config.howItWorks && (config.howItWorks.intro || config.howItWorks.formula || config.howItWorks.variables?.length) ? ( 
        <section className="mt-8"> 
          <h2 className="text-lg md:text-xl font-semibold" style={{ color: "#5c82ee" }}> 
            How the calculation works 
          </h2> 
          {config.howItWorks.intro && <p className="mt-2 text-muted-foreground">{config.howItWorks.intro}</p>} 
          {config.howItWorks.formula && ( 
            <pre className="mt-3 bg-muted/50 text-xs md:text-sm p-3 rounded-md overflow-auto"> 
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
              <h2 className="text-lg md:text-xl font-semibold" style={{ color: "#5c82ee" }}> 
                {t.title} 
              </h2> 
              <div className="mt-3 overflow-x-auto"> 
                <table className="w-full text-xs md:text-sm"> 
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
                <ul className="list-disc pl-6 mt-2 text-[11px] md:text-xs text-muted-foreground"> 
                  {t.notes.map((n, i) => ( 
                    <li key={i}>{n}</li> 
                  ))} 
                </ul> 
              ) : null} 
            </section> 
          )) 
        : null} 

      {config.glossary?.length ? (
        <section className="mt-8">
          <h2 className="text-lg md:text-xl font-semibold" style={{ color: "#5c82ee" }}>
            Glossary
          </h2>
          <ul className="mt-2 space-y-2 text-muted-foreground">
            {config.glossary.map((g, i) => (
              <li key={i}>
                <span className="font-medium text-foreground">{g.term}:</span> {g.def}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {config.faqs?.length ? ( 
        <section className="mt-8"> 
          <h2 className="text-lg md:text-xl font-semibold" style={{ color: "#5c82ee" }}> 
            FAQs 
          </h2> 
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

      {config.relatedLinks?.length ? (
        <section className="mt-8">
          <h2 className="text-lg md:text-xl font-semibold" style={{ color: "#5c82ee" }}>
            Related calculators
          </h2>
          <ul className="list-disc pl-6 mt-2 text-muted-foreground">
            {config.relatedLinks.map((l, i) => (
              <li key={i}>
                <a className="underline" href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {config.sources?.length ? ( 
        <section className="mt-8"> 
          <h2 className="text-lg md:text-xl font-semibold" style={{ color: "#5c82ee" }}> 
            Formula & Sources 
          </h2> 
          <ul className="list-disc pl-6 mt-2 text-sm text-muted-foreground"> 
            {config.sources.map((s, i) => ( 
              <li key={i}> 
                <a className="underline" href={s.href.replace(/`/g, "").trim()} target="_blank" rel="noreferrer"> 
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
      {config.seo ? (
        <SeoHead
          config={{
            ...config.seo,
            canonical: config.seo.canonical ? stripGrave(config.seo.canonical) : undefined,
          }}
        />
      ) : null}
      {config.jsonLd?.webpage ? (
        <JsonLd data={{ "@context": "https://schema.org", ...deepSanitizeStrings(config.jsonLd.webpage) }} />
      ) : null}
      {config.jsonLd?.breadcrumbs?.items?.length ? (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: config.jsonLd.breadcrumbs.items.map((it, idx) => ({
              "@type": "ListItem",
              position: idx + 1,
              name: it.name,
              item: it.item.replace(/`/g, "").trim(),
            })),
          }}
        />
      ) : null}
      {config.jsonLd?.faq?.length ? (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: config.jsonLd.faq.map((qa) => ({
              "@type": "Question",
              name: stripGrave(qa.q),
              acceptedAnswer: { "@type": "Answer", text: stripGrave(qa.a) },
            })),
          }}
        />
      ) : null}
      <PetCalculatorPageLayout 
        left={left} 
        center={center} 
        showTopAd={config.showTopAd} 
        showRightAd={config.showRightAd} 
      /> 
      <div className="mt-6 pl-4 md:pl-8 pr-2 md:pr-4"> 
        <div className="max-w-[560px] md:max-w-[864px]"> 
          {/* Reviewed block + professional note + strong disclaimer */}
          {(config.reviewedBy || config.professionalAdviceNote || config.reviewedByBlock || config.strongDisclaimer) && (
            <div className="mb-6 rounded-md border border-border/50 bg-muted/20 p-3 text-[13px] text-muted-foreground">
              {config.reviewedBy ? (
                typeof config.reviewedBy === "string" ? (
                  <div className="font-medium">✅ {config.reviewedBy}</div>
                ) : (
                  <div className="font-medium">
                    ✅ Reviewed by {config.reviewedBy.name}
                    {config.reviewedBy.credentials ? `, ${config.reviewedBy.credentials}` : ""}
                    {config.reviewedBy.role ? ` — ${config.reviewedBy.role}` : ""}
                    {config.reviewedBy.date ? ` (Last reviewed: ${config.reviewedBy.date})` : ""}
                  </div>
                )
              ) : null}
              {config.professionalAdviceNote ? <div className="mt-1">{config.professionalAdviceNote}</div> : null}
              {config.reviewedByBlock?.text ? <div className="mt-2">{config.reviewedByBlock.text}</div> : null}
              {config.strongDisclaimer ? (
                <div className="text-xs text-muted-foreground mt-2">{config.strongDisclaimer}</div>
              ) : null}
            </div>
          )}
          <CalculatorFeedbackShare /> 
        </div> 
      </div> 
      {stickyCtaAllowed ? (
        <div className="fixed bottom-4 right-4 z-50">
          <Button variant="destructive" asChild className="shadow-lg">
            <a
              href={config.stickyCta!.tel ? `tel:${config.stickyCta!.tel}` : config.stickyCta!.href ?? "#"}
              target={config.stickyCta!.href ? "_blank" : undefined}
              rel={config.stickyCta!.href ? "noreferrer" : undefined}
            >
              {config.stickyCta!.label}
            </a>
          </Button>
        </div>
      ) : null}
    </> 
  ); 
}