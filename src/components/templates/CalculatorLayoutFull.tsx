"use client";
import React, { ReactNode } from "react";

/**
 * CalculatorLayoutFull
 * - Linha vermelha 1200px
 * - Editorial | Widget (sticky) | Ad
 * - + 3 blocos padrão (aviso, share, suggestion)
 */
export default function CalculatorLayoutFull({
  title,
  editorial,
  widget,
  adContent,
}: {
  title: string;
  editorial: ReactNode;
  widget: ReactNode;
  adContent?: ReactNode;
}) {
  return (
    <>
      {/* CSS CRÍTICO - LINHA VERMELHA 1200px */}
      <style>{`
        :root {
          --container-max: 1200px;
          --gap: 32px;
          --gap-mobile: 20px;
          --blue: #5c82ee;
        }

        .full-container {
          width: 100%;
          max-width: var(--container-max);
          margin: 0 auto;
          padding: 0 16px;
          box-sizing: border-box;
          font-family: system-ui, -apple-system, sans-serif;
        }

        .full-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--gap-mobile);
          align-items: start;
        }

        .full-editorial h1 {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--blue);
          margin: 0 0 1.5rem;
        }

        .full-editorial h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 2rem 0 1rem;
          color: #fff;
        }

        .full-editorial p, .full-editorial li {
          color: #e5e7eb;
          line-height: 1.7;
        }

        .full-widget {
          background: rgba(30, 30, 50, 0.8);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 1.5rem;
          position: sticky;
          top: 100px;
          z-index: 10;
        }

        .full-ad {
          min-height: 250px;
          background: rgba(30, 30, 50, 0.6);
          border: 1px dashed rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          padding: 1.5rem;
          text-align: center;
          color: #9ca3af;
          font-size: 0.875rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        /* Blocos padrão */
        .full-warning, .full-share, .full-suggestion {
          background: rgba(30, 30, 50, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 1.25rem;
          margin-bottom: 1.5rem;
          color: #e5e7eb;
          font-size: 0.925rem;
        }

        .full-warning strong { color: #fbbf24; }

        .full-share-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin: 1rem 0;
        }

        .full-share-btn {
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .full-embed {
          background: #111;
          color: #ccc;
          padding: 1rem;
          border-radius: 8px;
          font-family: monospace;
          font-size: 0.8rem;
          margin-top: 1rem;
          overflow-x: auto;
        }

        .full-suggestion input, .full-suggestion textarea {
          width: 100%;
          padding: 0.75rem;
          margin: 0.5rem 0;
          background: #111;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          color: #fff;
        }

        .full-suggestion button {
          background: #5c82ee;
          color: white;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
        }

        /* Tablet */
        @media (min-width: 768px) {
          .full-grid {
            grid-template-columns: 7fr 5fr;
            gap: var(--gap);
          }
          .full-ad { display: none; }
        }

        /* Desktop: 3 colunas */
        @media (min-width: 1024px) {
          .full-grid {
            grid-template-columns: 1fr 350px 300px;
            gap: var(--gap);
          }
          .full-editorial { grid-column: 1; }
          .full-widget { grid-column: 2; grid-row: 1; }
          .full-ad { grid-column: 3; grid-row: 1; display: flex; }
        }

        @media (min-width: 1440px) {
          .full-container { padding: 0 32px; }
        }
      `}</style>

      <div className="full-container py-8">
        <div className="full-grid">
          {/* EDITORIAL + BLOCOS PADRÃO */}
          <article className="full-editorial">
            <h1>{title}</h1>
            {editorial}

            {/* === 1. AVISO === */}
            <div className="full-warning">
              <p>
                <strong>Important — Not Financial Advice</strong><br />
                This tool is for general information and educational purposes only and does not constitute financial, tax, or investment advice. Results are estimates and may not reflect your specific situation. Always consult a qualified professional before making decisions.<br />
                <em>Smart Kit Now is not responsible for actions taken based on these estimates.</em>
              </p>
            </div>

            {/* === 2. SHARE === */}
            <div className="full-share">
              <h3 style={{ margin: "0 0 1rem", color: "#fff" }}>Share this page</h3>
              <div className="full-share-buttons">
                <button className="full-share-btn" style={{ background: "#1da1f2", color: "white" }}>X / Twitter</button>
                <button className="full-share-btn" style={{ background: "#1877f2", color: "white" }}>Facebook</button>
                <button className="full-share-btn" style={{ background: "#0077b5", color: "white" }}>LinkedIn</button>
                <button className="full-share-btn" style={{ background: "#e1306c", color: "white" }}>Reddit</button>
                <button className="full-share-btn" style={{ background: "#25d366", color: "white" }}>WhatsApp</button>
                <button className="full-share-btn" style={{ background: "#6b7280", color: "white" }}>Copy link</button>
              </div>
              <p><strong>Embed</strong> <button style={{ marginLeft: "0.5rem", fontSize: "0.8rem" }}>Copy embed</button></p>
              <div className="full-embed">
                &lt;iframe src="http://localhost:3000/financial/loan-payment" title="Smart Kit Now - Loan Payment" style="width:100%;min-height:650px;border:0;" loading="lazy" referrerpolicy="no-referrer-when-downgrade"&gt;&lt;/iframe&gt;
              </div>
            </div>

            {/* === 3. SUGGESTION === */}
            <div className="full-suggestion">
              <h3 style={{ margin: "0 0 1rem", color: "#fff" }}>Send a suggestion</h3>
              <p style={{ margin: "0 0 1rem", fontSize: "0.9rem" }}>
                Missing a calculator? Suggest a new tool or improvement and we'll prioritize popular requests.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                <input type="text" placeholder="Your name" />
                <input type="email" placeholder="you@example.com" />
              </div>
              <textarea rows={3} placeholder="Tell us which calculator you'd like, or improvements to existing tools."></textarea>
              <button>Send</button>
              <p style={{ fontSize: "0.8rem", marginTop: "0.5rem", opacity: 0.7 }}>
                We'll only use your email to follow up about this suggestion.
              </p>
            </div>
          </article>

          {/* WIDGET STICKY */}
          <aside className="full-widget">
            {widget}
          </aside>

          {/* ANÚNCIO */}
          <aside className="full-ad">
            {adContent || (
              <>
                <p className="font-medium mb-2">Advertisement</p>
                <div style={{
                  width: "100%",
                  height: "250px",
                  background: "#1a1a2e",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#4b5563"
                }}>
                  300×250 Ad Unit
                </div>
              </>
            )}
          </aside>
        </div>
      </div>
    </>
  );
}