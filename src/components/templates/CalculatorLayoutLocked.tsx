import React, { ReactNode } from "react";

/**
 * CalculatorLayoutLocked
 * - Conteúdo "dentro da linha vermelha": Main (9 col) + Right rail (3 col)
 * - Dentro do Main: Editorial (7) + Widget sticky (5)
 * - Sticky apenas no Widget; Editorial e Rail rolam
 * - Guard rails anti-overflow + media queries explícitas
 */
export default function CalculatorLayoutLocked({
  title,
  editorial,
  widget,
  railRight = null,
  showTitle = true,
  stickyTopPx = 120, // ajuste se seu header for maior
}: {
  title: string;
  editorial: ReactNode;
  widget: ReactNode;
  railRight?: ReactNode;
  showTitle?: boolean;
  stickyTopPx?: number;
}) {
  return (
    <>
      {/* CSS crítico inline para independer de Tailwind e impedir overflow */}
      <style>{`
        :root{
          --container-w: 1200px;  /* MESMO valor da /financial */
          --gap: 24px;            /* gap desktop (24px == gap-6) */
          --gap-lg: 32px;         /* gap desktop grande (32px == gap-8) */
          --rail-w: 3fr;          /* Right rail = 3 colunas */
          --main-w: 9fr;          /* Main = 9 colunas */
          --inner-left: 7fr;      /* Editorial */
          --inner-widget: 5fr;    /* Widget */
          --safe: 0px;            /* margem de segurança intra-container (0 para encostar) */
        }

        /* CONTÊINER CENTRAL: alinha com /financial (linha vermelha) */
        .locked__container{
          box-sizing: border-box;
          width: 100%;
          max-width: var(--container-w);
          margin: 0 auto;
          padding: 96px 16px 40px;  /* pt-24 ~96px (abaixo do header), laterais 16px */
          overflow: visible;        /* não bloquear sticky */
        }

        /* GRID EXTERNO: Main (9) + Rail (3) */
        .locked__outer{
          display: grid;
          grid-template-columns: var(--main-w) var(--rail-w);
          gap: var(--gap-lg);
        }
        .locked__outer > * { min-width: 0; }

        /* GRID INTERNO do Main: Editorial (7) + Widget (5) */
        .locked__mainInner{
          display: grid;
          grid-template-columns: var(--inner-left) var(--inner-widget);
          gap: var(--gap-lg);
          align-items: start;
        }
        .locked__mainInner > * { min-width: 0; }

        /* Guard rails anti-overflow: nada sai do limite do Main */
        .locked__guard, .locked__guard *{
          box-sizing: border-box;
          max-width: 100%;
        }
        .locked__guard{
          overflow: hidden;       /* corta eventuais vazamentos horizontais */
        }
        .locked__tableWrap{       /* tabelas com rolagem horizontal controlada */
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }

        /* Widget sticky */
        .locked__sticky{
          position: sticky;
          top: ${/* não usar var aqui pq vem via prop */""}${0}px; /* será sobrescrito inline */
        }

        /* Boxes de engajamento: mesmas bordas/padding e NUNCA passam a linha */
        .locked__card{
          border: 1px solid rgba(120,120,140,0.25);
          border-radius: 16px;
          padding: 16px;
          background: rgba(255,255,255,0.04);
        }

        /* MEDIA QUERIES — pedidas por você */
        /* Mobile: 320–767px */
        @media (max-width: 767px){
          .locked__container{ padding: 88px 12px 32px; }
          .locked__outer{ grid-template-columns: 1fr; gap: 20px; }
          .locked__mainInner{ grid-template-columns: 1fr; gap: 20px; }
          .locked__sticky{ position: static; top: auto; } /* sem sticky no mobile */
        }

        /* Tablet: 768–1023px */
        @media (min-width: 768px) and (max-width: 1023px){
          .locked__container{ padding: 96px 16px 36px; }
          .locked__outer{ grid-template-columns: 1fr; gap: var(--gap); }
          .locked__mainInner{ grid-template-columns: 7fr 5fr; gap: var(--gap); }
          .locked__sticky{ top: 104px; }
        }

        /* Desktop: 1024–1439px */
        @media (min-width: 1024px) and (max-width: 1439px){
          .locked__container{ padding-top: 104px; }
          .locked__outer{ grid-template-columns: var(--main-w) var(--rail-w); gap: var(--gap-lg); }
          .locked__mainInner{ grid-template-columns: var(--inner-left) var(--inner-widget); gap: var(--gap-lg); }
        }

        /* Ultrawide: 1440px+ */
        @media (min-width: 1440px){
          .locked__container{ padding-top: 112px; }
          .locked__outer{ gap: var(--gap-lg); }
          /* Mantemos container-w para bater exatamente com a linha vermelha */
        }

        /* Fallbacks e zoom: se viewport for menor que 320px, evitar quebrar */
        @media (max-width: 319px){
          .locked__container{ padding: 84px 8px 28px; }
        }
      `}</style>

      <div className="locked__container">
        {/* OUTER GRID: Main (9) + Rail (3) */}
        <div className="locked__outer">
          {/* MAIN (alinhado à linha vermelha) */}
          <main className="locked__guard">
            {/* INNER GRID: Editorial + Widget */}
            <div className="locked__mainInner">
              {/* LEFT — editorial */}
              <article>
                {showTitle && (
                  <h1 className="text-3xl font-bold" style={{ color: "#5c82ee" }}>
                    {title}
                  </h1>
                )}
                {editorial}
              </article>

              {/* CENTER — widget sticky (único sticky) */}
              <aside
                className="locked__sticky"
                aria-label="Calculator widget"
                style={{ top: `${stickyTopPx}px` }}
              >
                {widget}
              </aside>
            </div>
          </main>

          {/* RIGHT RAIL — rola normal; serve só de espaço/ads */}
          <aside aria-label="Right rail">
            {railRight}
          </aside>
        </div>
      </div>
    </>
  );
}