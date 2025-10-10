import CategoryPageTemplate from "@/components/layouts/CategoryPageTemplate";
import { buildSectionsForCategory } from "@/data/categorySections";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function EverydayLifeCalculators() {
  const navigate = useNavigate();

  const intro = (
    <div className="space-y-3">
      <p>
        Handy tools for household budgeting, time planning, chores, and daily life management.
      </p>
      <p>
        Explore future helpers for organizing your home, planning routines, and tracking everyday tasks.
      </p>
    </div>
  );

  const sections = buildSectionsForCategory("everyday-life", {
    shortPaths: true,
    subcategoryIconMap: {
      "household-budgets": "🏠",
      "time-planning": "⏱️",
      "home-organization": "🧺",
      "travel-errands": "🧭",
      "general": "🔧",
    },
    subcategoryTitle: (key: string) => {
      const k = key.trim().toLowerCase().replace(/\s+/g, "-");
      if (k === "household-budgets") return "Household & Budgets";
      if (k === "time-planning") return "Time Planning";
      if (k === "home-organization") return "Home Organization";
      if (k === "travel-errands") return "Travel & Errands";
      // fallback default titleization
      const clean = key.replace(/[-_]+/g, " ").trim();
      if (!clean) return "General";
      return clean
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    },
  });

  const recommendedFooter = (
    <div className="space-y-8">
      <div className="flex items-center mb-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/")}
          className="flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card/40 border border-border/50 rounded-lg p-5 shadow-sm">
          <h2 className="text-xl font-semibold">Household & Budgets</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Monthly budget planner, grocery cost estimator, utility trackers — coming soon.
          </p>
        </div>
        <div className="bg-card/40 border border-border/50 rounded-lg p-5 shadow-sm">
          <h2 className="text-xl font-semibold">Time Planning</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Chore schedules, time-blocking helpers, productivity counters — coming soon.
          </p>
        </div>
        <div className="bg-card/40 border border-border/50 rounded-lg p-5 shadow-sm">
          <h2 className="text-xl font-semibold">Home Organization</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Room decluttering guides, storage calculators, cleaning plans — coming soon.
          </p>
        </div>
        <div className="bg-card/40 border border-border/50 rounded-lg p-5 shadow-sm">
          <h2 className="text-xl font-semibold">Travel & Errands</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Packing lists, route planning, cost estimators — coming soon.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <CategoryPageTemplate
      title="Everyday Life Calculators"
      intro={intro}
      sections={sections}
      showTopBanner={true}
      showRightRail={true}
      contentBackgroundColor="#0c1324"
      recommendedFooter={recommendedFooter}
    />
  );
}