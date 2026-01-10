// src/pages/DailyQuotesPage.tsx
import { useState, useEffect } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import QuoteTabs, { DailyDataPacket } from "@/components/calculators/DailyQuotes/QuoteTabs";
import DailyHoroscopeWidget from "@/components/calculators/DailyQuotes/DailyHoroscopeWidget";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

// --- MOCK DATA (Temporário até o n8n ser atualizado) ---
const MOCK_DATA: DailyDataPacket = {
  date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
  heroQuote: {
    text: "The code you write today is the legacy you leave for tomorrow.",
    author: "Anonymous Dev",
    category: "Tech",
  },
  content: {
    motivation: [
      { id: 1, text: "Do it for your future self.", author: "Unknown", tags: ["gym", "focus"] },
      { id: 2, text: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln", tags: ["success"] },
    ],
    captions: [
      { id: 3, text: "Sweater weather & coffee thoughts. ☕", author: null, tags: ["cozy", "autumn"] },
      { id: 4, text: "Main character energy only.", author: null, tags: ["vibes"] },
    ],
    tech_humor: [
      { id: 5, text: "There are 10 types of people in the world: those who understand binary, and those who don't.", author: null, tags: ["nerd"] },
      { id: 6, text: "My code doesn't work, I have no idea why. My code works, I have no idea why.", author: null, tags: ["developer"] },
    ],
    faith: [
      { id: 7, text: "For I know the plans I have for you, declares the Lord.", author: "Jeremiah 29:11", tags: ["hope"] },
      { id: 8, text: "Faith moves mountains.", author: "Matthew 17:20", tags: ["strength"] },
    ],
    sarcasm: [
      { id: 9, text: "I’m not arguing, I’m just explaining why I’m right.", author: null, tags: ["witty"] },
    ],
    wisdom: [
      { id: 10, text: "The only true wisdom is in knowing you know nothing.", author: "Socrates", tags: ["philosophy"] },
    ],
  },
};

export default function DailyQuotesPage() {
  // No futuro, aqui faremos o fetch do JSON do n8n
  const [data, setData] = useState<DailyDataPacket>(MOCK_DATA);

  const handleShareHero = async () => {
    const text = `"${data.heroQuote.text}" — ${data.heroQuote.author}\n\nGet your daily inspiration at SmartKitNow.com`;
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ text });
      } else {
        await navigator.clipboard.writeText(text);
        toast("Copied to clipboard!");
      }
    } catch {
      // Ignore abort errors
    }
  };

  const heroSection = (
    <div className="relative rounded-2xl overflow-hidden p-8 md:p-12 text-center bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-background border border-border mb-8">
      <div className="relative z-10 max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-2">
          Quote of the Day • {data.date}
        </div>
        <h1 className="text-2xl md:text-4xl font-extrabold text-foreground leading-tight">
          "{data.heroQuote.text}"
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground font-medium">
          — {data.heroQuote.author}
        </p>
        <div className="pt-4">
          <Button onClick={handleShareHero} size="lg" className="rounded-full gap-2">
            <Share2 className="w-4 h-4" />
            Share Today's Vibe
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Daily Inspiration Hub"
      description="Start your day right with your horoscope, daily motivation, Instagram captions, and tech humor. Updated every single day."
      // O layout vertical espera um 'widget', vamos passar o Hero + Tabs
      widget={
        <div className="space-y-8">
          {heroSection}
          <QuoteTabs
            data={data}
            // Passamos o widget antigo de horóscopo como "conteúdo" da aba de horóscopo
            horoscope={<DailyHoroscopeWidget showNavigation={false} />}
          />
        </div>
      }
      showTopBanner
      showSidebar
      showBottomBanner
      hideLegalDisclaimer
    />
  );
}
