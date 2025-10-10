import React, { ReactNode } from "react";
import CalculatorListBlue from "@/components/common/CalculatorListBlue";
import SiteFeedbackForm from "@/components/forms/SiteFeedbackForm";
import ShareThisCalculator from "@/components/share/ShareThisCalculator";

// Data contracts
export type CategoryItem = { title: string; to: string };
export type CategorySection = { icon?: ReactNode; title?: string; heading?: ReactNode; items: CategoryItem[] };

export type CategoryPageTemplateProps = {
  title: string;
  description?: ReactNode; // accept ReactNode to stay compatible with existing pages
  sections: CategorySection[];     // rendered as 2-col lists
  headerSlot?: ReactNode;          // optional banner/breadcrumb
  railSlot?: ReactNode;            // optional right rail content (default: none)
  minContentScore?: number;        // provided for PageWithRails gating; not enforced here
  // Backward-compatible props used by existing pages (optional)
  intro?: ReactNode;
  showTopBanner?: boolean;         // ignored here; ads are controlled by PageWithRails
  showRightRail?: boolean;         // ignored here; ads are controlled by PageWithRails
  recommendedFooter?: ReactNode;
  contentBackgroundColor?: string;
  additionalItemCount?: number;
};

// Page meta exported for PageWithRails to read. This template does NOT enforce gating.
export const defaultPageMeta = { allowAds: true, minContentScore: 3 };

export default function CategoryPageTemplate({
  title,
  description,
  sections,
  headerSlot,
  railSlot,
  minContentScore = 3,
  // Backward-compatible props
  intro,
  showTopBanner = false,
  showRightRail = true,
  recommendedFooter,
  contentBackgroundColor,
  additionalItemCount = 0,
}: CategoryPageTemplateProps) {
  return (
    <div className="mx-auto max-w-6xl px-4 md:px-6 py-8" style={contentBackgroundColor ? { backgroundColor: contentBackgroundColor } : undefined}>
      {headerSlot ? (
        <div className="mb-8">{headerSlot}</div>
      ) : (
        <header className="mb-8 space-y-2">
          <h1 className="text-[28px] md:text-[32px] font-bold leading-tight tracking-[-0.01em] text-[#5c82ee]">
            {title}
          </h1>
          {(description || intro) && (
            <div className="text-[15px] md:text-[16px] leading-[1.65] text-[#747886]">
              {description ?? intro}
            </div>
          )}
        </header>
      )}

      {/* grid: content + rail */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_auto] gap-8">
        {/* content */}
        <main className="space-y-8">
          {sections.map((sec, idx) => {
            const half = Math.ceil(sec.items.length / 2);
            const left = sec.items.slice(0, half);
            const right = sec.items.slice(half);
            return (
              <section key={String(sec.title ?? (typeof sec.heading === "string" ? sec.heading : idx))} className="space-y-3">
                <h2 className="text-[22px] md:text-[24px] font-semibold leading-snug tracking-[-0.005em] text-[#5c82ee]">
                  {sec.icon ? <span className="mr-2 align-middle" aria-hidden>{sec.icon}</span> : null}
                  {sec.title ?? sec.heading}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <CalculatorListBlue items={left} />
                  <CalculatorListBlue items={right} />
                </div>
              </section>
            );
          })}

          {/* Bottom utilities: feedback + share */}
          <section className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            <SiteFeedbackForm title="Questions or suggestions?" />
            <ShareThisCalculator />
          </section>

          {recommendedFooter && (
            <section className="mt-4">
              {recommendedFooter}
            </section>
          )}
        </main>

        {/* rail: sticky container with optional slot; no direct ads rendered here */}
        <aside className="hidden xl:block">
          <div className="sticky top-24 w-[160px] space-y-4">
            {railSlot ?? null}
          </div>
        </aside>
      </div>
    </div>
  );
}