import { useMemo } from "react";
import CategoryPageTemplate from "@/components/layouts/CategoryPageTemplate";
import { buildSectionsForCategory } from "@/data/categorySections";

export default function SportsCalculators() {
  const sections = useMemo(
    () =>
      buildSectionsForCategory("sports", {
        shortPaths: true,
        subcategoryIconMap: {
          "running-endurance-calculators": "🏃",
          "strength-gym-calculators": "🏋️",
          "team-sports-calculators": "⚽",
          "nutrition-recovery-calculators": "🥤",
          "general": "🎯",
        },
      }),
    []
  );

  const intro = (
    <div className="space-y-3">
      <p>
        Training, performance, and fitness calculators for athletes and enthusiasts.
      </p>
      <p>
        Explore upcoming tools for running pace, splits, VO2 estimates, strength training percentages, team sports planning, and recovery.
      </p>
    </div>
  );

  return (
    <CategoryPageTemplate
      title="Sports Calculators"
      intro={intro}
      sections={sections}
      showTopBanner={true}
      showRightRail={true}
      contentBackgroundColor="#0c1324"
      recommendedFooter={(
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card/40 border border-border/50 rounded-lg p-5 shadow-sm">
              <h2 className="text-xl font-semibold" style={{ color: "#1f2937" }}>Running & Endurance</h2>
              <p className="mt-2 text-sm text-muted-foreground">Pace, splits, VO2 estimates, race predictions — coming soon.</p>
            </div>
            <div className="bg-card/40 border border-border/50 rounded-lg p-5 shadow-sm">
              <h2 className="text-xl font-semibold" style={{ color: "#1f2937" }}>Strength & Gym</h2>
              <p className="mt-2 text-sm text-muted-foreground">1RM, lifting percentages, volume trackers — coming soon.</p>
            </div>
            <div className="bg-card/40 border border-border/50 rounded-lg p-5 shadow-sm">
              <h2 className="text-xl font-semibold" style={{ color: "#1f2937" }}>Team Sports</h2>
              <p className="mt-2 text-sm text-muted-foreground">Training zones, drills counters, load monitoring — coming soon.</p>
            </div>
            <div className="bg-card/40 border border-border/50 rounded-lg p-5 shadow-sm">
              <h2 className="text-xl font-semibold" style={{ color: "#1f2937" }}>Nutrition & Recovery</h2>
              <p className="mt-2 text-sm text-muted-foreground">Macros, hydration, sleep, recovery windows — coming soon.</p>
            </div>
          </div>
        </div>
      )}
    />
  );
}