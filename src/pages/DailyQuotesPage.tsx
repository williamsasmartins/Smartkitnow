import CategoryPageTemplate from "@/components/layouts/CategoryPageTemplate";

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

  const intro = (
    <div className="space-y-3">
      <p>
        Inspiration to brighten your day and spark a positive mindset.
      </p>
      <p>
        Come back daily for thoughtful words and timeless wisdom selected to motivate and encourage.
      </p>
    </div>
  );

  return (
    <CategoryPageTemplate
      title="Daily Quotes"
      intro={intro}
      sections={[]}
      showTopBanner={true}
      showRightRail={true}
      contentBackgroundColor="#0c1324"
      recommendedFooter={(
        <div className="space-y-6">
          <div className="bg-card/50 border border-border/60 rounded-lg p-6 shadow-sm text-center max-w-3xl">
            <blockquote className="text-2xl leading-relaxed" style={{ color: "#0f172a" }}>
              “{quote.text}”
            </blockquote>
            <p className="mt-3 text-sm text-muted-foreground">— {quote.author}</p>
          </div>
          <p className="text-sm text-muted-foreground text-center">New categories and quote sources coming soon.</p>
        </div>
      )}
    />
  );
}