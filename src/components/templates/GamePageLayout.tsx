import React from "react";

type OnThisPageItem = {
  id: string;
  label: string;
};

type Props = {
  title: string;
  description?: string;

  /** Optional “On This Page” anchors */
  onThisPage?: OnThisPageItem[];

  /** Main content (your game UI) */
  children: React.ReactNode;

  /** Optional sections rendered below the game (How to play, etc.) */
  below?: React.ReactNode;

  /** Future-proof placeholders (no ad network code) */
  showTopBannerPlaceholder?: boolean;
  showRightSidebarPlaceholder?: boolean;
  showBottomBannerPlaceholder?: boolean;
};

export default function GamePageLayout({
  title,
  description,
  onThisPage = [],
  children,
  below,
  showTopBannerPlaceholder = false,
  showRightSidebarPlaceholder = false,
  showBottomBannerPlaceholder = false,
}: Props) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="mx-auto pb-10 pt-32 lg:pt-40" style={{ maxWidth: 1200 }}>
        {showTopBannerPlaceholder && (
          <div className="mx-auto mb-8 px-4 sm:px-6">
            <div className="h-[90px] w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center text-sm text-slate-500 dark:text-slate-400">
              Top Banner Placeholder (future)
            </div>
          </div>
        )}

        <div className="relative xl:flex xl:justify-center xl:gap-12">
          {/* Main */}
          <div className="w-full max-w-5xl mx-auto xl:mx-0 px-4 sm:px-6 min-w-0">
            <header className="mb-8">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-[#5c82ee] mb-4 leading-tight tracking-tight">
                {title}
              </h1>
              {description ? (
                <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
                  {description}
                </p>
              ) : null}
            </header>

            {onThisPage.length > 0 && (
              <div className="mb-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
                <p className="font-semibold text-slate-900 dark:text-slate-100 mb-3">On This Page</p>
                <div className="flex flex-wrap gap-2">
                  {onThisPage.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="text-sm px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-900 transition"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Game surface */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden">
              <div className="p-4 sm:p-6">{children}</div>
            </div>

            {below ? <div className="mt-10">{below}</div> : null}

            {showBottomBannerPlaceholder && (
              <div className="mt-10">
                <div className="h-[90px] w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center text-sm text-slate-500 dark:text-slate-400">
                  Bottom Banner Placeholder (future)
                </div>
              </div>
            )}
          </div>

          {/* Right sidebar placeholder */}
          {showRightSidebarPlaceholder && (
            <aside className="hidden xl:block w-[320px] shrink-0">
              <div className="sticky top-32 space-y-4">
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 text-sm text-slate-500 dark:text-slate-400">
                  Right Sidebar Placeholder (future)
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
