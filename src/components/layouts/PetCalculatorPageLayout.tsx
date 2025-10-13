import React from "react";

type Props = {
  left: React.ReactNode;   // editorial (canto esquerdo)
  center: React.ReactNode; // calculadora (coluna central, sticky)
  showTopAd?: boolean;     // banner topo opcional
  showRightAd?: boolean;   // rail direito opcional
  right?: React.ReactNode; // conteúdo custom da rail (senão placeholder)
};

export default function PetCalculatorPageLayout({
  left,
  center,
  showTopAd = true,
  showRightAd = true,
  right,
}: Props) {
  // Largura total, ancorado à esquerda, com paddings leves iguais ao /pets
  return (
    <div className="w-screen max-w-none mx-0 pl-4 md:pl-8 pr-2 md:pr-4 py-6">
      {/* Top banner (placeholder de ad) */}
      {showTopAd && (
        <div className="mb-4 rounded-md border border-dashed border-border/60 bg-muted/30 p-3 text-center text-xs text-muted-foreground">
          Ad — Top Banner (placeholder)
        </div>
      )}

      {/* Grade de 3 colunas:
          - esquerda: texto mais estreito, parecido com /pets (até ~560px)
          - centro: calculadora fixa, 440–520px (mais estreita)
          - direita: rail de ads 120–160px
      */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(200px,400px)_minmax(400px,440px)_minmax(180px,220px)]">
        {/* ESQUERDA */}
        <section className="order-2 md:order-1">
          {left}
        </section>

        {/* CENTRO (calculadora) */}
        <aside className="order-1 md:order-2">
          <div className="md:sticky md:top-16">
            {center}
          </div>
        </aside>

        {/* DIREITA (rail) */}
        <aside className="order-3 hidden md:block">
          {showRightAd ? (
            right ?? (
              <div className="sticky top-16 h-[600px] rounded-md border border-dashed border-border/60 bg-muted/30 p-2 text-center text-[10px] text-muted-foreground">
                Ad — Right Rail (placeholder)
              </div>
            )
          ) : null}
        </aside>
      </div>
    </div>
  );
}