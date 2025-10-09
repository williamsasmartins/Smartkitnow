import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function DailyQuotesPage() {
  const quotes = [
    {
      text: "The best time to plant a tree was 20 years ago. The second best time is now.",
      author: "Chinese Proverb",
    },
    {
      text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      author: "Winston Churchill",
    },
    {
      text: "What we think, we become.",
      author: "Buddha",
    },
  ];

  const today = new Date();
  const index = (today.getFullYear() + today.getMonth() + today.getDate()) % quotes.length;
  const quote = quotes[index];

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Header />
      <main className="pt-20">
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-3" style={{ color: "#1f2937" }}>Daily Quotes</h1>
            <p className="text-lg mb-8 text-muted-foreground">Inspiration to brighten your day and spark a positive mindset.</p>

            <div className="bg-card/50 border border-border/60 rounded-lg p-6 shadow-sm">
              <blockquote className="text-2xl leading-relaxed" style={{ color: "#0f172a" }}>
                “{quote.text}”
              </blockquote>
              <p className="mt-3 text-sm text-muted-foreground">— {quote.author}</p>
            </div>

            <p className="mt-6 text-sm text-muted-foreground">New categories and quote sources coming soon.</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}