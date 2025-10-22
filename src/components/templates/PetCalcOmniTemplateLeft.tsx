// src/components/templates/PetCalcOmniTemplateLeft.tsx
import React from "react";
import clsx from "clsx";
import CalculatorFeedbackShare from "../calculators/CalculatorFeedbackShare";

// Tipos base — mantenha o que você já usa
export type PetCalcOmniConfig<I = any> = {
  slug: string;
  hero: { title: string; description?: string };
  form: {
    initial: I;
    fields: any[];
    compute: (inputs: I) => { metrics: Record<string, number>; riskKey?: string };
    metricsOrder?: string[];
    riskMap?: Record<string, { label: string; color: string; message: string }>;
    cta?: { primary?: { label: string; to: string }; secondary?: { label: string; to: string } };
    strongDisclaimer?: string;
  };
  editorial: {
    howToUse: { title: string; steps: string[] };
    howItWorks: { title: string; intro: string; formula?: string; variables?: { symbol: string; meaning: string }[]; notes?: string[] };
    tables?: { title: string; caption?: string; columns: string[]; rows: (string | number)[][]; footnotes?: string[] }[];
    faqs?: { q: string; a: string }[];
    sources?: string[];
  };
  seo?: any;
  eeat?: { showAtBottomOnce?: boolean; text?: string };

  // ✅ NOVO: slots de anúncios
  ads?: {
    top?: React.ReactNode;    // banner topo (renderiza acima do hero)
    right?: React.ReactNode;  // rail direito (sticky)
  };
};

export interface PetCalcOmniTemplateProps<I = any> {
  config: PetCalcOmniConfig<I>;
  className?: string;
  // ✅ offset do sticky (ajuste se o Header mudar de altura)
  stickyOffsetPx?: number; // default 88
}

/**
 * Layout âncora à ESQUERDA, igual às páginas /pets:
 * - usamos um gutter esquerdo fixo
 * - conteúdo principal tem largura limitada (igual aos boxes inferiores)
 * - rail direito de anúncio NÃO altera a largura do conteúdo (fica fora)
 */
const LEFT_GUTTER = "pl-4 pr-4 md:pl-8 lg:pl-10 xl:pl-14"; // mesmo recuo das páginas de categoria
const CONTENT_MAX = "max-w-[864px]"; // mesma largura dos boxes “Questions/Share”; ajuste se quiser

export function PetCalcOmniTemplate<I = any>({
  config,
  className,
  stickyOffsetPx = 88,
}: PetCalcOmniTemplateProps<I>) {
  return (
    <div
      className={clsx("w-full overflow-visible", className)}
      style={{ transform: "none" }} // evita quebrar sticky
    >
      {/* ======= TOP AD (opcional) — âncora à esquerda ======= */}
      {config.ads?.top ? (
        <div className={clsx("w-full", LEFT_GUTTER, "pt-3")}>
          <div className={CONTENT_MAX}>{config.ads.top}</div>
        </div>
      ) : null}

      {/* ======= HERO — âncora à esquerda ======= */}
      <section className={clsx("w-full", LEFT_GUTTER, "pt-6 pb-4")}>
        <div className={CONTENT_MAX}>
          <h1 className="text-3xl font-bold text-[#5c82ee]">{config.hero.title}</h1>
          {config.hero.description ? (
            <p className="mt-2 text-sm text-muted-foreground">{config.hero.description}</p>
          ) : null}
        </div>
      </section>

      {/* ======= MAIN ROW: conteúdo + (opcional) right rail =======
          Usamos FLEX para manter o conteúdo principal com largura fixa e o rail à direita sem empurrar nada.
      */}
      <div className={clsx("w-full", LEFT_GUTTER)} style={{ overflow: "visible", transform: "none" }}>
        <div className="flex gap-6">
          {/* ======= COLUNA PRINCIPAL (texto + calculadora sticky) ======= */}
          <div className={clsx(CONTENT_MAX, "min-w-0")}>
            {/* GRID 2 colunas (como Omni): texto mais largo + calculadora */}
            <div
              className={clsx(
                "grid gap-6 pb-12",
                "grid-cols-1 md:[grid-template-columns:minmax(0,340px)_minmax(0,1fr)]"
              )}
              style={{ overflow: "visible" }}
            >
              {/* LEFT — editorial */}
              <aside className="hidden md:block overflow-visible pt-1">
                <EditorialBlock config={config} />
              </aside>

              {/* CENTER — calculadora sticky */}
              <main className="min-w-0 md:sticky self-start" style={{ top: stickyOffsetPx }}>
                <CalculatorPanel config={config} />
              </main>
            </div>

            {/* EEAT (opcional) — mesma régua do conteúdo */}
            {config?.eeat?.showAtBottomOnce && config?.eeat?.text ? (
              <div className="mt-8">
                <div className="rounded-xl border bg-card p-4 text-sm text-muted-foreground">
                  {config.eeat.text}
                </div>
              </div>
            ) : null}

            {/* Feedback + Share — mesma régua + respiro antes do rodapé */}
            <div className="mt-8 mb-16">
              <CalculatorFeedbackShare />
            </div>
          </div>

          {/* ======= RIGHT RAIL AD (opcional) — sticky à direita, fora do CONTENT_MAX ======= */}
          {config.ads?.right ? (
            <aside
              className="hidden xl:block w-[280px] md:sticky self-start"
              style={{ top: stickyOffsetPx }}
            >
              {config.ads.right}
            </aside>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/* ================== Renderizadores de exemplo ==================
   Substitua pelos seus componentes reais. Não há CTA flutuante aqui.
*/
function EditorialBlock({ config }: { config: PetCalcOmniConfig }) {
  const e = config.editorial;
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-lg font-semibold">{e.howToUse.title}</h2>
        <ol className="mt-2 list-decimal pl-5 space-y-1 text-sm">
          {e.howToUse.steps.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
      </section>
      <section>
        <h2 className="text-lg font-semibold">{e.howItWorks.title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{e.howItWorks.intro}</p>
        {e.howItWorks.formula && (
          <pre className="mt-2 rounded bg-muted p-3 text-xs whitespace-pre-wrap">
            {e.howItWorks.formula}
          </pre>
        )}
      </section>
    </div>
  );
}

function CalculatorPanel({ config }: { config: PetCalcOmniConfig }) {
  // Troque pelo seu renderer real do formulário + métricas
  return (
    <div className="rounded-2xl border bg-card p-4 shadow-sm">
      <div className="text-sm text-muted-foreground">Calculator UI goes here…</div>
    </div>
  );
}