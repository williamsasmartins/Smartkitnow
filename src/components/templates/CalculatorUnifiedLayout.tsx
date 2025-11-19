import { ReactNode } from "react";
import ShareThisPageBox from "@/components/ShareThisPageBox";
import SuggestionBox from "@/components/SuggestionBox";
import LegalDisclaimer from "@/components/LegalDisclaimer";

type Props = {
  title: string;
  editorial: ReactNode; // texto, fórmulas, exemplos
  widget: ReactNode;    // calculadora (card da direita)
  railRight?: ReactNode | null;
  showTitle?: boolean;
  jsonLd?: object | object[];
  showTopBanner?: boolean;
  topBannerHeight?: number;
};

export default function CalculatorUnifiedLayout({
  title,
  editorial,
  widget,
  railRight = null,
  showTitle = true,
  jsonLd,
  showTopBanner = true,
  topBannerHeight = 90,
}: Props) {
  return (
    <div className="w-full">
      {/* JSON-LD */}
      {jsonLd ? (
        <script type="application/ld+json" suppressHydrationWarning>
          {JSON.stringify(jsonLd)}
        </script>
      ) : null}

      {/* Empurra abaixo do header fixo */}
      <div className="h-16 md:h-20" aria-hidden />

      {/* Layout principal limitado a 1200px, centralizado */}
      <div className="mx-auto max-w-[1200px] px-4 pb-16">
        {/* Banner superior opcional */}
        {showTopBanner && (
          <div
            aria-hidden
            className="mb-6 rounded-xl border border-white/10 bg-white/5 dark:border-white/5 dark:bg-white/5"
            style={{ height: topBannerHeight }}
          />
        )}

        {/* GRID 12 COLUNAS: esquerda = conteúdo, direita = widget */}
        <div className="grid grid-cols-12 gap-8">
          {/* COLUNA ESQUERDA (até a linha amarela) */}
          <section className="col-span-12 lg:col-span-7">
            {showTitle && (
              <h1
                className="mb-4 text-3xl font-bold"
                style={{ color: "#5c82ee" }}
              >
                {title}
              </h1>
            )}

            {/* Conteúdo principal */}
            <div className="space-y-6">
              <div>{editorial}</div>

              {/* DISCLAIMER — retângulo roxo (mesma largura da coluna) */}
              <LegalDisclaimer
                kind="financial"
                locale="en"
                note="Smart Kit Now is not responsible for actions taken based on these estimates."
                className="w-full rounded-2xl border border-gray-200 bg-white/5 p-4 dark:border-gray-800 dark:bg-gray-900/50"
              />

              {/* SHARE + SUGGESTION — dois boxes verdes dentro da coluna */}
              <div className="grid gap-6 md:grid-cols-2">
                <ShareThisPageBox className="h-full w-full" />
                <SuggestionBox className="h-full w-full" />
              </div>
            </div>
          </section>

          {/* COLUNA DIREITA: WIDGET STICKY (calculadora) */}
          <aside className="col-span-12 lg:col-span-5">
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* Card da calculadora */}
              <div>{widget}</div>

              {/* Right rail opcional (ads, etc) */}
              {railRight && <div>{railRight}</div>}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
