// src/components/templates/GamePageLayout.tsx
import { useCallback } from "react";
import type { ReactNode } from "react";

type OnThisPageItem = { id: string; label: string };

type Props = {
  title: string;
  description?: string;
  children: ReactNode;
  onThisPage?: OnThisPageItem[];
  below?: ReactNode;
  rightRail?: ReactNode;

  showTopBannerPlaceholder?: boolean;
  showBottomBannerPlaceholder?: boolean;
};

export default function GamePageLayout({
  title,
  description,
  children,
  onThisPage = [],
  below,
  rightRail,
  showTopBannerPlaceholder = true,
  showBottomBannerPlaceholder = true,
}: Props) {
  const handleAnchor = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 120; // header offset
    window.scrollTo({ top: y, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8 lg:px-10 pb-10 pt-28">
        {/* TOP BANNER PLACEHOLDER */}
        {showTopBannerPlaceholder && (
          <div className="mb-8">
            <div className="h-[90px] w-full rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-900/40 flex items-center justify-center text-sm text-slate-500 dark:text-slate-400">
              Top Banner Placeholder (970×90 / 728×90 / 320×100)
            </div>
          </div>
        )}

        {/* HEADER */}
        <header className="mb-6">
          <h1 className="text-4xl font-extrabold tracking-tight text-[#5c82ee]">{title}</h1>
          {description && (
            <p className="mt-2 max-w-3xl text-base text-slate-600 dark:text-slate-300">
              {description}
            </p>
          )}
        </header>

        {/* MAIN */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
          {/* CONTENT */}
          <div className="space-y-8">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-4 md:p-6">
              {children}
            </div>

            {below && (
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6">
                {below}
              </div>
            )}

            {/* BOTTOM BANNER PLACEHOLDER */}
            {showBottomBannerPlaceholder && (
              <div className="mt-8">
                <div className="h-[90px] w-full rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-900/40 flex items-center justify-center text-sm text-slate-500 dark:text-slate-400">
                  Bottom Banner Placeholder (970×90 / 728×90 / 320×100)
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="space-y-6">
            {onThisPage.length > 0 && (
              <div className="sticky top-28 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-5">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  On this page
                </h3>
                <ul className="mt-3 space-y-2 text-sm">
                  {onThisPage.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => handleAnchor(item.id)}
                        className="text-left text-slate-700 dark:text-slate-300 hover:text-[#5c82ee] hover:underline"
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {rightRail ?? (
              <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-900/40 p-5 text-sm text-slate-500 dark:text-slate-400">
                Right Rail Placeholder (ads / related games / tips)
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
