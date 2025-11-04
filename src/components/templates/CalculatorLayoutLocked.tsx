'use client';

import React, { ReactNode } from "react";

export default function CalculatorLayoutLocked({
  title,
  box1,
  box2,
  stickyTopPx = 120,
}: {
  title: string;
  box1: ReactNode;
  box2: ReactNode;
  stickyTopPx?: number;
}) {
  return (
    <>
            <style>{`
        .calc-wrapper { max-width: 1200px; margin: 0 auto; padding: 2rem 1rem; }
        .calc-grid { display: grid; gap: 2rem; grid-template-columns: 1fr; }
        @media (min-width: 768px) { .calc-grid { grid-template-columns: 7fr 5fr; } }
        @media (min-width: 1024px) { .calc-grid { grid-template-columns: 1fr 380px 300px; } }

        /* <<< A LINHA MÁGICA QUE FALTAVA >>> */
        .calc-sticky {
          position: -webkit-sticky; /* Safari */
          position: sticky;
          top: ${stickyTopPx}px !important;
          z-index: 50 !important;
          align-self: start !important;
        }
        /* <<< FIM DA LINHA MÁGICA >>> */

        .calc-ad { background: #111; border: 2px dashed #333; border-radius: 1rem; height: 250px; display: flex; align-items: center; justify-content: center; color: #666; }
      `}</style>

      <div className="calc-wrapper">
        <div className="calc-grid">
          <article className="text-gray-200">
            <h1 className="text-4xl font-bold text-[#5c82ee] mb-8">{title}</h1>
            {box1}

            <div className="my-8 p-6 rounded-2xl bg-amber-900/30 border border-amber-700/50">
              <strong className="text-amber-300">Important — Not Financial Advice</strong>
              <p className="text-sm mt-2">This tool is for educational purposes only. Always consult a professional.</p>
            </div>

            <div className="my-8 p-6 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="font-bold mb-4">Share this page</h3>
              <div className="flex flex-wrap gap-2">
                {["X", "Facebook", "LinkedIn", "Reddit", "WhatsApp"].map(s => (
                  <button key={s} className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition">
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="my-8 p-6 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="font-bold mb-3">Send a suggestion</h3>
              <input placeholder="Your name" className="w-full mb-2 p-3 bg-black/30 rounded border border-white/10" />
              <input placeholder="email@ex.com" className="w-full mb-2 p-3 bg-black/30 rounded border border-white/10" />
              <textarea rows={3} placeholder="Your idea..." className="w-full mb-3 p-3 bg-black/30 rounded border border-white/10"></textarea>
              <button className="w-full py-3 bg-[#5c82ee] rounded-lg font-bold hover:bg-[#4a6bc7]">
                Send
              </button>
            </div>
          </article>

          <aside className="calc-sticky">
            {box2}
          </aside>

          <aside className="calc-ad">
            <p>Advertisement</p>
            <div className="mt-2 w-full h-32 bg-gray-800 rounded" />
          </aside>
        </div>
      </div>
    </>
  );
}