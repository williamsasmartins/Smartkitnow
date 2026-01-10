import { useCallback, useEffect, useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import QuoteCard, { DailyQuoteItem } from "@/components/calculators/DailyQuotes/QuoteCard";

export type DailyDataPacket = {
  date: string;
  heroQuote: {
    text: string;
    author: string;
    category: string;
  };
  content: {
    motivation: DailyQuoteItem[];
    captions: DailyQuoteItem[];
    tech_humor: DailyQuoteItem[];
    faith: DailyQuoteItem[];
    sarcasm: DailyQuoteItem[];
    wisdom: DailyQuoteItem[];
  };
};

type TabKey =
  | "horoscope"
  | "motivation"
  | "captions"
  | "tech_humor"
  | "faith"
  | "sarcasm"
  | "wisdom";

const LS_KEY = "skn:daily_quotes:liked";

function readLiked(): Set<number> {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return new Set<number>();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set<number>();
    return new Set<number>((parsed as unknown[]).filter((v) => typeof v === "number") as number[]);
  } catch {
    return new Set<number>();
  }
}

function writeLiked(set: Set<number>) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(Array.from(set)));
  } catch {
    return;
  }
}

export default function QuoteTabs({
  data,
  horoscope,
}: {
  data: DailyDataPacket;
  horoscope: React.ReactNode;
}) {
  const [active, setActive] = useState<TabKey>("horoscope");
  const [liked, setLiked] = useState<Set<number>>(() => readLiked());

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === LS_KEY) setLiked(readLiked());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const toggleLike = useCallback((id: number) => {
    setLiked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      writeLiked(next);
      return next;
    });
  }, []);

  const tabs = useMemo(
    () =>
      [
        { key: "horoscope" as const, label: "♈ Horoscope" },
        { key: "motivation" as const, label: "🚀 Motivation" },
        { key: "captions" as const, label: "📸 Social Captions" },
        { key: "tech_humor" as const, label: "💻 Tech & Geek" },
        { key: "faith" as const, label: "🙏 Faith & Verses" },
        { key: "sarcasm" as const, label: "😂 Fun & Sarcasm" },
        { key: "wisdom" as const, label: "🧠 Wisdom" },
      ] as const,
    []
  );

  const section = useMemo(() => {
    if (active === "motivation") return { label: "Motivation", items: data.content.motivation, tone: "default" as const };
    if (active === "captions") return { label: "Social Caption", items: data.content.captions, tone: "default" as const };
    if (active === "tech_humor") return { label: "Tech & Geek", items: data.content.tech_humor, tone: "tech" as const };
    if (active === "faith") return { label: "Faith & Verses", items: data.content.faith, tone: "default" as const };
    if (active === "sarcasm") return { label: "Fun & Sarcasm", items: data.content.sarcasm, tone: "default" as const };
    if (active === "wisdom") return { label: "Wisdom", items: data.content.wisdom, tone: "default" as const };
    return null;
  }, [active, data.content]);

  return (
    <Tabs value={active} onValueChange={(v) => setActive(v as TabKey)}>
      <div className="sticky top-24 z-20 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 bg-background/85 backdrop-blur border-b border-border">
        <ScrollArea className="w-full">
          <TabsList className="w-max">
            {tabs.map((t) => (
              <TabsTrigger key={t.key} value={t.key} className="whitespace-nowrap">
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </ScrollArea>
      </div>

      <TabsContent value="horoscope" className="mt-6">
        {horoscope}
      </TabsContent>

      {(["motivation", "captions", "tech_humor", "faith", "sarcasm", "wisdom"] as const).map((k) => (
        <TabsContent key={k} value={k} className="mt-6">
          {section?.items ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {section.items.map((item) => (
                <QuoteCard
                  key={item.id}
                  item={item}
                  categoryLabel={section.label}
                  isLiked={liked.has(item.id)}
                  onToggleLike={toggleLike}
                  tone={k === "tech_humor" ? "tech" : "default"}
                />
              ))}
            </div>
          ) : null}
        </TabsContent>
      ))}
    </Tabs>
  );
}

