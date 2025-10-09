import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function EverydayLifeCalculators() {
  return (
    <div className="min-h-screen bg-gradient-soft">
      <Header />
      <main className="pt-20">
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-3" style={{ color: "#1f2937" }}>Everyday Life Calculators</h1>
            <p className="text-lg mb-6 text-muted-foreground">Handy tools for household budgeting, time planning, chores, and daily life management.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card/40 border border-border/50 rounded-lg p-5 shadow-sm">
                <h2 className="text-xl font-semibold" style={{ color: "#1f2937" }}>Household & Budgets</h2>
                <p className="mt-2 text-sm text-muted-foreground">Monthly budget planner, grocery cost estimator, utility trackers — coming soon.</p>
              </div>
              <div className="bg-card/40 border border-border/50 rounded-lg p-5 shadow-sm">
                <h2 className="text-xl font-semibold" style={{ color: "#1f2937" }}>Time Planning</h2>
                <p className="mt-2 text-sm text-muted-foreground">Chore schedules, time-blocking helpers, productivity counters — coming soon.</p>
              </div>
              <div className="bg-card/40 border border-border/50 rounded-lg p-5 shadow-sm">
                <h2 className="text-xl font-semibold" style={{ color: "#1f2937" }}>Home Organization</h2>
                <p className="mt-2 text-sm text-muted-foreground">Room decluttering guides, storage calculators, cleaning plans — coming soon.</p>
              </div>
              <div className="bg-card/40 border border-border/50 rounded-lg p-5 shadow-sm">
                <h2 className="text-xl font-semibold" style={{ color: "#1f2937" }}>Travel & Errands</h2>
                <p className="mt-2 text-sm text-muted-foreground">Packing lists, route planning, cost estimators — coming soon.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}