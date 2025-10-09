import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function SportsCalculators() {
  return (
    <div className="min-h-screen bg-gradient-soft">
      <Header />
      <main className="pt-20">
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-3" style={{ color: "#1f2937" }}>Sports Calculators</h1>
            <p className="text-lg mb-6 text-muted-foreground">Training, performance, and fitness calculators for athletes and enthusiasts.</p>

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
        </section>
      </main>
      <Footer />
    </div>
  );
}