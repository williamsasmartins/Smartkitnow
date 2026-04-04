"use client";

import React, { useState } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

const faqs = [
  {
    question: "What is a good engagement rate by platform?",
    answer:
      "Benchmarks vary significantly by platform and account size. General 2024 benchmarks: Instagram — 1–3% is average, 5%+ is excellent; TikTok — 4–8% average (higher due to algorithmic reach); Facebook — 0.5–1% average (organic reach has declined sharply); LinkedIn — 2–5% for company pages; Twitter/X — 0.5–1% average. Smaller accounts consistently show higher rates; as following grows, engagement rate typically declines.",
  },
  {
    question: "Should I calculate engagement rate by followers or by reach?",
    answer:
      "Both metrics serve different purposes. Engagement Rate by Followers (ERF) measures how much of your audience actively engages — useful for evaluating audience quality. Engagement Rate by Reach (ERR) measures how compelling the content is to people who actually saw it — useful for testing content effectiveness. ERR is more meaningful for accounts with variable organic reach (like those using paid promotion). When benchmarking against competitors, use ERF since you rarely know their reach data.",
  },
  {
    question: "Does engagement rate affect algorithm reach?",
    answer:
      "Yes, on every major platform. Instagram, TikTok, LinkedIn, and Facebook algorithms all use engagement signals to determine how widely to distribute a post beyond your initial followers. A post that generates strong saves, comments, and shares in the first 30–60 minutes is pushed to non-followers. This creates a compounding effect: high engagement → more reach → more potential engagement. Focus on content that generates saves and comments over passive likes, which the algorithms weight more heavily.",
  },
  {
    question: "What interactions should I count for engagement?",
    answer:
      "Typically: likes/reactions, comments, shares/retweets, saves (Instagram/Pinterest), clicks (for link-heavy content), and video views beyond 3 seconds (for video content). Saves are particularly valuable — they indicate the content is reference-worthy. Avoid counting profile visits and impressions as engagements, as these are passive exposures rather than active responses.",
  },
  {
    question: "Why did my engagement rate drop while follower count grew?",
    answer:
      "This is one of the most common patterns in social media growth. As follower count increases, organic reach as a percentage of followers typically decreases (platforms throttle distribution to encourage paid promotion). Additionally, large followings often contain more passive or dormant accounts. To reverse the trend: post more interactive content (polls, questions, challenges), engage with comments quickly to signal activity to the algorithm, and consider removing highly inactive followers if the platform allows it.",
  },
];

export default function SocialMediaEngagementRate() {
  const [interactions, setInteractions] = useState("");
  const [followers, setFollowers] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const faqJsonLd = useFaqJsonLd(faqs);

  const calculate = () => {
    const i = parseFloat(interactions);
    const f = parseFloat(followers);
    if (!isNaN(i) && !isNaN(f) && f > 0) {
      setResult((i / f) * 100);
    }
  };

  const getBenchmarkLabel = (rate: number) => {
    if (rate >= 6) return "Excellent — top 10% for most platforms";
    if (rate >= 3) return "Above average — strong audience connection";
    if (rate >= 1) return "Average — room to improve with content mix";
    return "Below average — review content strategy and posting frequency";
  };

  const editorial = (
    <div className="space-y-8">
      <section id="what-is">
        <h2 className="text-2xl font-bold mb-3">What Is Social Media Engagement Rate?</h2>
        <p className="text-muted-foreground leading-relaxed">
          Engagement rate (ER) measures the percentage of an audience that actively
          interacts with content — through likes, comments, shares, saves, or clicks —
          relative to total followers or reach. It is a more meaningful metric than raw
          follower count because it indicates how much your audience actually cares about
          your content, not just whether they once pressed Follow.
        </p>
        <p className="text-muted-foreground leading-relaxed mt-3">
          A 10,000-follower account with 5% engagement (500 interactions per post) is more
          valuable to most brands than a 100,000-follower account with 0.2% engagement
          (200 interactions). Influencer marketers and brand partnerships increasingly
          require minimum engagement rate thresholds before entering agreements.
        </p>
      </section>

      <section id="benchmarks">
        <h2 className="text-2xl font-bold mb-3">Engagement Rate Benchmarks by Platform (2024)</h2>
        <ul className="space-y-2 text-muted-foreground list-disc ml-6">
          <li><strong>Instagram:</strong> 1–3% average; 5%+ excellent; Reels typically 2× Stories</li>
          <li><strong>TikTok:</strong> 4–8% average (higher algorithmic amplification)</li>
          <li><strong>LinkedIn:</strong> 2–5% for company pages; thought-leadership posts higher</li>
          <li><strong>Facebook (organic):</strong> 0.5–1% (paid reach required for scale)</li>
          <li><strong>Twitter/X:</strong> 0.5–1%; text + media outperforms text-only</li>
          <li><strong>Pinterest:</strong> 2–5% (save-heavy; high intent audience)</li>
        </ul>
        <p className="text-muted-foreground leading-relaxed mt-3">
          These benchmarks apply to mid-sized accounts (10K–100K followers). Micro-accounts
          (under 10K) typically see 2–3× higher rates; accounts above 1M typically see
          rates under 1%.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-3">Engagement Rate and Campaign ROI</h2>
        <p className="text-muted-foreground leading-relaxed">
          High engagement rate is a prerequisite for effective social media monetization.
          Whether you are running organic campaigns or measuring influencer partnerships,
          engagement rate predicts how well content will drive clicks and conversions.
          Combine engagement metrics with your{" "}
          <a href="/marketing/conversion-rate" className="text-primary hover:underline">
            Conversion Rate
          </a>{" "}
          and{" "}
          <a href="/marketing/marketing-roi" className="text-primary hover:underline">
            Marketing ROI
          </a>{" "}
          to build a complete picture of social media channel performance.
        </p>
      </section>

      <section id="faq">
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        <ul className="space-y-6">
          {faqs.map((item, i) => (
            <li key={i} className="border-b border-slate-200 dark:border-slate-800 pb-4 last:border-0">
              <h3 className="font-bold text-lg mb-2">{item.question}</h3>
              <p className="text-muted-foreground leading-relaxed">{item.answer}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Social Media Engagement Rate Calculator"
      description="Calculate the engagement rate of your social media posts or profiles. Benchmark against platform averages for Instagram, TikTok, LinkedIn, and Facebook to identify improvement opportunities."
      formula={{
        formula: "Engagement Rate = (Total Interactions ÷ Followers) × 100",
        variables: [
          { symbol: "Total Interactions", description: "Sum of likes, comments, shares, saves, and meaningful clicks on a post or within a period" },
          { symbol: "Followers", description: "Total followers at time of measurement (or use Reach for engagement-by-reach variant)" },
        ],
        title: "Engagement Rate Formula",
      }}
      editorial={editorial}
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: "calculator", label: "Calculator" },
        { id: "what-is", label: "What Is Engagement Rate?" },
        { id: "benchmarks", label: "Platform Benchmarks" },
        { id: "faq", label: "FAQ" },
      ]}
      relatedCalculators={[
        { title: "Conversion Rate Calculator", url: "/marketing/conversion-rate", icon: "🎯" },
        { title: "Marketing ROI Calculator", url: "/marketing/marketing-roi", icon: "📈" },
        { title: "ROAS Calculator", url: "/marketing/roas", icon: "📊" },
        { title: "Customer Acquisition Cost", url: "/marketing/customer-acquisition-cost", icon: "💰" },
      ]}
    >
      <section id="calculator" className="scroll-mt-24">
        <Card className="border-slate-200 dark:border-slate-700 shadow-sm">
          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="interactions">Total Interactions</Label>
                <p className="text-xs text-muted-foreground">Likes, comments, shares, saves</p>
                <Input
                  id="interactions"
                  type="number"
                  placeholder="e.g., 500"
                  value={interactions}
                  onChange={(e) => setInteractions(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="followers">Total Followers (or Reach)</Label>
                <p className="text-xs text-muted-foreground">Follower count or post reach</p>
                <Input
                  id="followers"
                  type="number"
                  placeholder="e.g., 10000"
                  value={followers}
                  onChange={(e) => setFollowers(e.target.value)}
                />
              </div>
            </div>

            <Button onClick={calculate} className="w-full">
              Calculate Engagement Rate
            </Button>

            {result !== null && (
              <div className="rounded-xl bg-muted/50 p-6 text-center space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Engagement Rate</p>
                <p className="text-4xl font-bold text-primary">{result.toFixed(2)}%</p>
                <p className="text-sm text-muted-foreground mt-1">{getBenchmarkLabel(result)}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </CalculatorVerticalLayout>
  );
}
