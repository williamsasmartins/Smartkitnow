"use client";
import React, { ReactNode } from "react";

/**
 * CalculatorLayoutStrict
 * Layout RÍGIDO com linha vermelha (1200px)
 * - 7fr (editorial) | 5fr (widget sticky) | 3fr (ads)
 * - Nada vaza do container
 * - Mobile: empilha tudo
 */
export default function CalculatorLayoutStrict({
  title,
  editorial,
  widget,
  adSlot,
}: {
  title: string;
  editorial: ReactNode;
  widget: ReactNode;
  adSlot?: ReactNode;
}) {
  return (
    <>
      {/* CSS CRÍTICO - LINHA VERMELHA 1200px */}
      <style>{`
        :root {
          --max-w: 1200px;
          --gap: 32px;
          --gap-sm: 20px;
          --col-editorial: 7fr;
          --col-widget: 5fr;
          --col-ad: 3fr;
        }

        .strict-container {
          width: 100%;
          max-width: var(--max-w);
          margin: 0 auto;
          padding: 2rem 1rem;
          box-sizing: border-box;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .strict-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--gap-sm);
          align-items: start;
        }

        .strict-main {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--gap-sm);
        }

        .strict-editorial {
          font-size: 1.05rem;
          line-height: 1.7;
          color: #374151;
        }

        .strict-editorial h1 {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 0.5rem;
        }

        .strict-editorial h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 2rem 0 1rem;
          color: #1f2937;
        }

        .strict-widget {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          position: sticky;
          top: 100px;
          z-index: 10;
        }

        .strict-ad {
          background: #f9fafb;
          border: 1px dashed #d1d5db;
          border-radius: 12px;
          padding: 1.5rem;
          text-align: center;
          font-size: 0.875rem;
          color: #6b7280;
          min-height: 250px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        /* Tablet: 2 colunas (editorial + widget) */
        @media (min-width: 768px) {
          .strict-main {
            grid-template-columns: var(--col-editorial) var(--col-widget);
            gap: var(--gap);
          }
          .strict-grid {
            grid-template-columns: 1fr;
          }
        }

        /* Desktop: 3 colunas */
        @media (min-width: 1024px) {
          .strict-grid {
            grid-template-columns: 1fr var(--col-ad);
            gap: var(--gap);
          }
          .strict-main {
            grid-column: 1;
          }
          .strict-ad {
            grid-column: 2;
            grid-row: 1;
            position: sticky;
            top: 100px;
          }
        }

        /* Ultrawide: mantém 1200px */
        @media (min-width: 1440px) {
          .strict-container {
            padding-left: 2rem;
            padding-right: 2rem;
          }
        }

        /* Mobile pequeno */
        @media (max-width: 480px) {
          .strict-container {
            padding: 1.5rem 0.75rem;
          }
        }
      `}</style>

      <div className="strict-container">
        <div className="strict-grid">
          {/* MAIN: Editorial (7) + Widget (5) */}
          <div className="strict-main">
            {/* EDITORIAL */}
            <article className="strict-editorial">
              <h1>{title}</h1>
              {editorial}
            </article>

            {/* WIDGET STICKY */}
            <aside className="strict-widget">
              {widget}
            </aside>
          </div>

          {/* ADS (3 colunas) */}
          {adSlot !== undefined && (
            <aside className="strict-ad">
              {adSlot || (
                <>
                  <p className="font-medium mb-2">Advertisement</p>
                  <div style={{
                    width: '100%',
                    height: '250px',
                    background: '#f3f4f6',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#9ca3af',
                    fontSize: '0.875rem'
                  }}>
                    300×250 Ad Unit
                  </div>
                </>
              )}
            </aside>
          )}
        </div>
      </div>
    </>
  );
}