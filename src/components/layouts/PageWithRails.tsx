import React from "react";

/**
 * PageWithRails
 * - Título opcional no topo (titleBlock)
 * - Coluna principal (children)
 * - Rail direito opcional (rightRail) e "colante" (sticky) no desktop
 * - NUNCA aplica overflow no contêiner (para não quebrar sticky)
 * - Compensação do header fixo com pt-20 (ajuste se seu header tiver outra altura)
 */
export default function PageWithRails({
  titleBlock,
  children,
  rightRail,
  showRails = true,
  className = "",
}: {
  titleBlock?: React.ReactNode;
  children: React.ReactNode;
  rightRail?: React.ReactNode;
  showRails?: boolean;
  className?: string;
}) {
  return (
    <div className={`pt-20 ${className}`}>
      <div className="container mx-auto max-w-7xl px-4">
        {titleBlock ? <div className="mb-6">{titleBlock}</div> : null}

        <div
          className={
            showRails
              ? "grid gap-6 lg:grid-cols-[1fr_320px]"
              : "grid gap-6 grid-cols-1"
          }
        >
          {/* Coluna principal */}
          <section className="min-w-0">{children}</section>

          {/* Rail direito sticky (desktop) */}
          {showRails && rightRail ? (
            <aside className="hidden lg:block">
              {/* Ajuste o top[…] conforme a altura real do seu header */}
              <div className="lg:sticky lg:top-[88px]">
                {rightRail}
              </div>
            </aside>
          ) : null}
        </div>
      </div>
    </div>
  );
}

// O que esse layout garante
//
// Nada de overflow em wrappers (sticky exige isso).
//
// Grid de 2 colunas no desktop e rail com sticky.
//
// top-[88px] compensa header fixo (mude para top-[80px] se o seu header for menor).
