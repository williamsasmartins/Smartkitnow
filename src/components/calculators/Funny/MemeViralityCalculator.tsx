import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ FULL ICON IMPORT
import { Smile, Frown, Meh, Ghost, Skull, Coffee, Utensils, Gamepad2, Cat, Dog, Zap, Heart, Calculator, Info, RotateCcw, AlertTriangle, BookOpen, ExternalLink, Flame, Clock, Ticket, Plane, Globe, Sparkles, Lightbulb } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function MemeViralityCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric",
    shares: "",
    likes: "",
    comments: "",
    memeAge: "",
    followers: "",
  });
  const handleInputChange = useCallback((n, v) => setInputs(p => ({ ...p, [n]: v })), []);

  /**
   * Meme Virality Score Logic:
   * Virality is a complex beast, but for fun, let's estimate it by combining:
   * - Shares (weighted heavily, as sharing spreads memes)
   * - Likes (engagement indicator)
   * - Comments (interaction depth)
   * - Meme Age (fresh memes tend to be more viral, so older memes get a penalty)
   * - Followers (audience size; bigger audience can boost virality)
   * 
   * Formula (simplified):
   * Score = ((shares * 5) + (likes * 2) + (comments * 3)) * (followersFactor) / (memeAgeFactor)
   * where followersFactor = 1 + log10(followers + 1)
   * and memeAgeFactor = 1 + (memeAge in days / 7)
   * 
   * The score is normalized to a 0-100 scale for fun interpretation.
   */

  const results = useMemo(() => {
    const shares = Number(inputs.shares);
    const likes = Number(inputs.likes);
    const comments = Number(inputs.comments);
    const memeAge = Number(inputs.memeAge);
    const followers = Number(inputs.followers);

    if (
      isNaN(shares) || shares < 0 ||
      isNaN(likes) || likes < 0 ||
      isNaN(comments) || comments < 0 ||
      isNaN(memeAge) || memeAge < 0 ||
      isNaN(followers) || followers < 0
    ) {
      return {
        value: "",
        label: "",
        subtext: "",
        color: "",
        icon: null,
      };
    }

    // Followers factor: logarithmic scale to reflect diminishing returns of audience size
    const followersFactor = 1 + Math.log10(followers + 1);

    // Meme age factor: older memes get penalized, assuming viral window is about a week
    const memeAgeFactor = 1 + (memeAge / 7);

    // Raw score calculation
    const rawScore = ((shares * 5) + (likes * 2) + (comments * 3)) * followersFactor / memeAgeFactor;

    // Normalize score to 0-100 scale (arbitrary max raw score ~10000 for scaling)
    let normalizedScore = Math.min(100, Math.round((rawScore / 10000) * 100));

    // Determine label and icon based on score
    let label = "";
    let color = "";
    let icon = null;
    let subtext = "";

    if (normalizedScore >= 80) {
      label = "Meme Legend";
      color = "text-green-600";
      icon = <Flame className="mx-auto h-12 w-12" />;
      subtext = "Your meme is blazing through the internet like wildfire! Prepare for fame.";
    } else if (normalizedScore >= 50) {
      label = "Viral Contender";
      color = "text-blue-600";
      icon = <Zap className="mx-auto h-12 w-12" />;
      subtext = "Strong engagement! Your meme has a solid chance to go viral soon.";
    } else if (normalizedScore >= 20) {
      label = "Casual Meme";
      color = "text-yellow-600";
      icon = <Meh className="mx-auto h-12 w-12" />;
      subtext = "Decent traction, but it might need a little more spice to catch fire.";
    } else if (normalizedScore > 0) {
      label = "Quiet Meme";
      color = "text-gray-600";
      icon = <Ghost className="mx-auto h-12 w-12" />;
      subtext = "Your meme is lurking in the shadows. Maybe tweak it for more oomph!";
    } else {
      label = "No Buzz";
      color = "text-red-600";
      icon = <Frown className="mx-auto h-12 w-12" />;
      subtext = "No engagement detected. Time to rethink your meme strategy!";
    }

    return {
      value: normalizedScore.toString(),
      label,
      subtext,
      color,
      icon,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What makes a meme go viral?",
      answer:
        "Virality is a fascinating mix of timing, relatability, and shareability. Memes that tap into current trends or universal emotions tend to spread faster because people feel compelled to share them with their circles. Additionally, the size and engagement level of the original audience play a crucial role in kickstarting the viral chain reaction.",
    },
    {
      question: "Why does meme age affect virality?",
      answer:
        "Memes have a surprisingly short shelf life in internet culture, often peaking within days or weeks. As a meme ages, it loses novelty, and audiences move on to fresher content. This calculator accounts for meme age to reflect how newer memes generally have a higher chance of catching viral momentum compared to older ones.",
    },
    {
      question: "How does follower count influence meme success?",
      answer:
        "A larger follower base increases the initial exposure of a meme, giving it more opportunities to be shared and liked. However, the relationship isn't linear; after a point, each additional follower contributes less to virality due to audience overlap and engagement saturation. That's why this calculator uses a logarithmic scale to model diminishing returns.",
    },
    {
      question: "Can this calculator predict meme virality accurately?",
      answer:
        "While this tool offers a fun and insightful estimate, meme virality is inherently unpredictable and influenced by countless intangible factors like cultural context and timing. Think of this calculator as a playful guide rather than a crystal ball. It helps you understand key engagement metrics that contribute to a meme's spread.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Unit Selector */}
      <div className="flex justify-end">
        <Select value={inputs.unit} onValueChange={(v) => handleInputChange("unit", v)}>
          <SelectTrigger className="w-[140px]">
            <Globe className="mr-2 h-4 w-4" /> <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="metric">Metric</SelectItem>
            <SelectItem value="imperial">Imperial</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="shares">Number of Shares</Label>
          <Input
            id="shares"
            type="number"
            min={0}
            placeholder="e.g. 500"
            value={inputs.shares}
            onChange={(e) => handleInputChange("shares", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="likes">Number of Likes</Label>
          <Input
            id="likes"
            type="number"
            min={0}
            placeholder="e.g. 1500"
            value={inputs.likes}
            onChange={(e) => handleInputChange("likes", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="comments">Number of Comments</Label>
          <Input
            id="comments"
            type="number"
            min={0}
            placeholder="e.g. 300"
            value={inputs.comments}
            onChange={(e) => handleInputChange("comments", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="memeAge">
            Meme Age ({inputs.unit === "metric" ? "days" : "days"})
          </Label>
          <Input
            id="memeAge"
            type="number"
            min={0}
            placeholder="e.g. 3"
            value={inputs.memeAge}
            onChange={(e) => handleInputChange("memeAge", e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="followers">Number of Followers (Audience Size)</Label>
          <Input
            id="followers"
            type="number"
            min={0}
            placeholder="e.g. 10000"
            value={inputs.followers}
            onChange={(e) => handleInputChange("followers", e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // Trigger recalculation by updating state (already handled by useMemo)
          }}
        >
          <Sparkles className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({ unit: "metric", shares: "", likes: "", comments: "", memeAge: "", followers: "" })
          }
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value && (
        <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 border-slate-200 shadow-lg animate-in fade-in slide-in-from-bottom-4">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-4">{results.icon}</div>
            <p className={`text-5xl font-extrabold ${results.color}`}>{results.value}</p>
            <p className="mt-2 text-lg font-medium text-slate-600 dark:text-slate-300">{results.label}</p>
            <p className="mt-2 text-sm italic text-slate-500">{results.subtext}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding Meme Virality Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Meme Virality Calculator is a playful yet insightful tool designed to estimate the viral potential of your meme based on key engagement metrics. It combines shares, likes, comments, audience size, and meme age to produce a score that reflects how likely your meme is to spread like wildfire across the internet. By understanding these factors, you can better tailor your content to maximize reach and impact. After all, virality is part art, part science, and a sprinkle of internet magic.
        </p>

        {/* TRIVIA BOX */}
        <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 my-6">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">Did You Know?</h3>
          </div>
          <p className="text-slate-700 dark:text-slate-300">
            The concept of memes predates the internet and was coined by evolutionary biologist Richard Dawkins in 1976. He described memes as cultural genes that propagate ideas, behaviors, or styles from person to person. Today, internet memes are the digital descendants of this idea, evolving rapidly and sometimes vanishing overnight, much like viral infections in biology.
          </p>
        </div>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Simply input the number of shares, likes, comments, the age of your meme in days, and your follower count to get an estimated virality score. The calculator uses these inputs to weigh the importance of each factor, considering that shares spread the meme, likes indicate popularity, and comments show engagement depth. Remember, the meme's age influences freshness, while your audience size affects initial exposure. Hit calculate and watch your meme's viral potential come to life!
        </p>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <ul className="space-y-6">
          {faqs.map((item, i) => (
            <li key={i} className="border-b border-slate-200 dark:border-slate-800 pb-4 last:border-0">
              <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-2">{item.question}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.answer}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References & Fun Reads</h2>
        <ul className="space-y-4">
          <li>
            <a href="https://en.wikipedia.org/wiki/Meme" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
              Wikipedia: Meme <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              A comprehensive overview of the origin, evolution, and cultural impact of memes, including internet memes.
            </p>
          </li>
          <li>
            <a href="https://www.nytimes.com/2021/05/10/style/memes.html" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
              The New York Times: The Science of Memes <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              An insightful article exploring how memes spread and why some become viral sensations.
            </p>
          </li>
          <li>
            <a href="https://www.scientificamerican.com/article/why-do-some-memes-go-viral/" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
              Scientific American: Why Do Some Memes Go Viral? <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              A scientific look at the psychological and social factors behind meme virality.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Meme Virality Calculator"
      description="Predict meme success. A tongue-in-cheek calculator to estimate the viral potential of your latest internet creation."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math",
        formula:
          "Virality Score = ((Shares × 5) + (Likes × 2) + (Comments × 3)) × (1 + log₁₀(Followers + 1)) ÷ (1 + Meme Age (days) ÷ 7)",
        variables: [
          { symbol: "Shares", description: "Number of times your meme was shared" },
          { symbol: "Likes", description: "Number of likes your meme received" },
          { symbol: "Comments", description: "Number of comments on your meme" },
          { symbol: "Followers", description: "Your audience size" },
          { symbol: "Meme Age", description: "Age of the meme in days" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Imagine you posted a meme 3 days ago. It has 500 shares, 1500 likes, 300 comments, and you have 10,000 followers.",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate the weighted engagement: (500 × 5) + (1500 × 2) + (300 × 3) = 2500 + 3000 + 900 = 6400",
          },
          {
            label: "2",
            explanation:
              "Calculate followers factor: 1 + log₁₀(10,000 + 1) ≈ 1 + 4 = 5",
          },
          {
            label: "3",
            explanation:
              "Calculate meme age factor: 1 + (3 ÷ 7) ≈ 1.43",
          },
          {
            label: "4",
            explanation:
              "Compute raw score: 6400 × 5 ÷ 1.43 ≈ 22377",
          },
          {
            label: "5",
            explanation:
              "Normalize to 0-100 scale: min(100, (22377 ÷ 10000) × 100) = 100 (max score)",
          },
        ],
        result: "Your meme scores 100, making it a Meme Legend blazing through the internet!",
      }}
      relatedCalculators={[
        { title: "Calculator Word Generator (Upside-Down)", url: "/funny/calculator-word-generator-upside-down", icon: "🤪" },
        { title: "Penguin Slap Power Calculator", url: "/funny/penguin-slap-power", icon: "🐈" },
        { title: "Drake Equation Calculator", url: "/funny/drake-equation-calculator", icon: "🤪" },
        { title: "Pizza Size/Price Comparison Calculator", url: "/funny/pizza-size-price-comparison", icon: "🍕" },
        { title: "Dog Zoomies Energy Release Meter", url: "/funny/dog-zoomies-energy-meter", icon: "🐈" },
        { title: "Pizza Slices per Person & Regret Index", url: "/funny/pizza-slices-per-person-regret-index", icon: "🍕" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding" },
        { id: "how-to", label: "How to Use" },
        { id: "faq", label: "FAQ" },
        { id: "references", label: "References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}