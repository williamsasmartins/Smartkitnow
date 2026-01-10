import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Heart, Sparkles, Star } from "lucide-react";

type ZodiacSign =
  | "aries"
  | "taurus"
  | "gemini"
  | "cancer"
  | "leo"
  | "virgo"
  | "libra"
  | "scorpio"
  | "sagittarius"
  | "capricorn"
  | "aquarius"
  | "pisces";

type HoroscopeBlock = {
  general: string;
  love: string;
  career: string;
  luckyNumbers: string;
};

type DailyHoroscopeJson = {
  date: string;
} & Record<ZodiacSign, HoroscopeBlock>;

const SIGNS: Array<{ key: ZodiacSign; label: string; emoji: string }> = [
  { key: "aries", label: "Aries", emoji: "♈" },
  { key: "taurus", label: "Taurus", emoji: "♉" },
  { key: "gemini", label: "Gemini", emoji: "♊" },
  { key: "cancer", label: "Cancer", emoji: "♋" },
  { key: "leo", label: "Leo", emoji: "♌" },
  { key: "virgo", label: "Virgo", emoji: "♍" },
  { key: "libra", label: "Libra", emoji: "♎" },
  { key: "scorpio", label: "Scorpio", emoji: "♏" },
  { key: "sagittarius", label: "Sagittarius", emoji: "♐" },
  { key: "capricorn", label: "Capricorn", emoji: "♑" },
  { key: "aquarius", label: "Aquarius", emoji: "♒" },
  { key: "pisces", label: "Pisces", emoji: "♓" },
];

const FALLBACK: DailyHoroscopeJson = {
  date: "Today",
  aries: {
    general: "A fresh chapter is opening. Keep your focus simple and your energy steady.",
    love: "Lead with warmth. A small, honest message can shift the mood in your favor.",
    career: "Prioritize the one task that unlocks everything else. Momentum will follow.",
    luckyNumbers: "3, 11, 27",
  },
  taurus: {
    general: "Slow progress is still progress. Choose comfort that supports your goals.",
    love: "Consistency speaks louder than intensity. Show up in a practical way.",
    career: "A reliable routine will protect your time and improve your output.",
    luckyNumbers: "4, 18, 22",
  },
  gemini: {
    general: "Curiosity pays off. Ask better questions and the day becomes easier.",
    love: "Keep it light but sincere. A playful moment can create real closeness.",
    career: "Communicate your plan clearly, then execute with speed and precision.",
    luckyNumbers: "5, 9, 33",
  },
  cancer: {
    general: "Your intuition is sharp. Trust the feeling that something needs care.",
    love: "Choose softness over defense. Vulnerability can strengthen your bond.",
    career: "Protect deep work time. Small interruptions are the biggest threat today.",
    luckyNumbers: "2, 16, 28",
  },
  leo: {
    general: "Confidence returns when you act. Take one bold step and commit to it.",
    love: "Be generous with praise. Your attention is the spark someone needs.",
    career: "Visibility helps. Share an update or results with the right people.",
    luckyNumbers: "1, 10, 29",
  },
  virgo: {
    general: "Clarity comes from simplifying. Remove one unnecessary obligation.",
    love: "Kind honesty works best. Speak plainly and listen without fixing everything.",
    career: "Details matter, but don’t over-polish. Ship the draft and iterate.",
    luckyNumbers: "6, 14, 26",
  },
  libra: {
    general: "Balance is possible, but it requires boundaries. Say no without guilt.",
    love: "A thoughtful gesture lands well. Keep it elegant and straightforward.",
    career: "Align stakeholders early. A quick check-in prevents rework later.",
    luckyNumbers: "7, 12, 24",
  },
  scorpio: {
    general: "Your focus is intense. Use it on what matters, not what irritates you.",
    love: "Depth beats drama. Choose intimacy, not tests.",
    career: "Investigate before deciding. The hidden detail is the real lever.",
    luckyNumbers: "8, 13, 31",
  },
  sagittarius: {
    general: "Adventure can be small. Change your route, your pace, or your perspective.",
    love: "Honesty plus humor is magnetic. Keep it real and optimistic.",
    career: "Aim higher, then break it down. A bold goal needs a simple plan.",
    luckyNumbers: "9, 15, 21",
  },
  capricorn: {
    general: "Discipline pays. Your future self benefits from today’s structure.",
    love: "Support can be quiet. Do something useful and meaningful.",
    career: "Lead with competence. A calm, clear decision sets the tone.",
    luckyNumbers: "10, 20, 30",
  },
  aquarius: {
    general: "Original ideas are flowing. Capture them, then pick one to build.",
    love: "Give space, then reconnect. A shared interest brings you closer.",
    career: "Experiment with a new approach. Measure results and refine fast.",
    luckyNumbers: "11, 17, 25",
  },
  pisces: {
    general: "Sensitivity is a strength today. Create a calm environment and protect it.",
    love: "Romance is in the details. A gentle surprise can feel magical.",
    career: "Trust your creative instincts, but anchor them with a small checklist.",
    luckyNumbers: "12, 19, 32",
  },
};

function formatLocalDate(value: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(value);
}

function mergeWithFallback(raw: unknown): DailyHoroscopeJson {
  const base = FALLBACK;
  const obj = (raw && typeof raw === "object" ? raw : {}) as Partial<DailyHoroscopeJson>;

  return {
    ...base,
    date: typeof obj.date === "string" && obj.date.trim() ? obj.date : base.date,
    aries: { ...base.aries, ...(obj.aries ?? {}) },
    taurus: { ...base.taurus, ...(obj.taurus ?? {}) },
    gemini: { ...base.gemini, ...(obj.gemini ?? {}) },
    cancer: { ...base.cancer, ...(obj.cancer ?? {}) },
    leo: { ...base.leo, ...(obj.leo ?? {}) },
    virgo: { ...base.virgo, ...(obj.virgo ?? {}) },
    libra: { ...base.libra, ...(obj.libra ?? {}) },
    scorpio: { ...base.scorpio, ...(obj.scorpio ?? {}) },
    sagittarius: { ...base.sagittarius, ...(obj.sagittarius ?? {}) },
    capricorn: { ...base.capricorn, ...(obj.capricorn ?? {}) },
    aquarius: { ...base.aquarius, ...(obj.aquarius ?? {}) },
    pisces: { ...base.pisces, ...(obj.pisces ?? {}) },
  };
}

function SkeletonCard({ title }: { title: string }) {
  return (
    <Card className="bg-muted/40 border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center justify-between">
          <span>{title}</span>
          <div className="h-4 w-4 rounded-full bg-muted animate-pulse" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="h-3 w-11/12 rounded bg-muted animate-pulse" />
          <div className="h-3 w-10/12 rounded bg-muted animate-pulse" />
          <div className="h-3 w-9/12 rounded bg-muted animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function DailyHoroscopeWidget({ showNavigation = false }: { showNavigation?: boolean }) {
  const [data, setData] = useState<DailyHoroscopeJson>(FALLBACK);
  const [selectedSign, setSelectedSign] = useState<ZodiacSign>("aries");
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const [today, setToday] = useState(() => formatLocalDate(new Date()));

  useEffect(() => {
    const controller = new AbortController();
    const run = async () => {
      try {
        setLoading(true);
        setUsingFallback(false);
        const res = await fetch(
          "https://raw.githubusercontent.com/williamsasmartins/smartkit-onepage-wonder/main/public/daily_horoscope.json",
          { cache: "no-store", signal: controller.signal }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as unknown;
        setData(mergeWithFallback(json));
      } catch (err) {
        if ((err as { name?: string } | undefined)?.name === "AbortError") return;
        setUsingFallback(true);
        setData(FALLBACK);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    void run();
    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    let intervalId: number | undefined;
    const now = new Date();
    const nextMidnight = new Date(now);
    nextMidnight.setHours(24, 0, 0, 0);
    const msUntilMidnight = Math.max(0, nextMidnight.getTime() - now.getTime());

    const timeoutId = window.setTimeout(() => {
      setToday(formatLocalDate(new Date()));
      intervalId = window.setInterval(() => {
        setToday(formatLocalDate(new Date()));
      }, 60_000);
    }, msUntilMidnight + 250);

    return () => {
      window.clearTimeout(timeoutId);
      if (intervalId) window.clearInterval(intervalId);
    };
  }, []);

  const selected = useMemo(() => data[selectedSign], [data, selectedSign]);
  const selectedMeta = useMemo(
    () => SIGNS.find((s) => s.key === selectedSign) ?? SIGNS[0],
    [selectedSign]
  );

  return (
    <div className="space-y-6">
      {showNavigation ? (
        <nav
          aria-label="Daily Quotes navigation"
          className="rounded-2xl border border-border bg-card/80 backdrop-blur px-3 py-3"
        >
          <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap py-1">
            <a
              href="#zodiac-grid"
              aria-current="page"
              className="inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-colors"
            >
              Horoscope
            </a>
            <a
              href="#how-to-read"
              className="inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold bg-muted text-foreground hover:bg-muted/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-colors"
            >
              How to read
            </a>
            <a
              href="#zodiac-curiosities"
              className="inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold bg-muted text-foreground hover:bg-muted/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-colors"
            >
              Zodiac curiosities
            </a>
            <a
              href="#sign-guide"
              className="inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold bg-muted text-foreground hover:bg-muted/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-colors"
            >
              Zodiac signs guide
            </a>
          </div>
        </nav>
      ) : null}

      <div
        id="zodiac-grid"
        className="rounded-2xl p-6 border border-border bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-background"
      >
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-muted-foreground">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="text-xs font-semibold tracking-widest uppercase">Horoscope</span>
            </div>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Choose your sign
            </h2>
            <p className="mt-1 text-muted-foreground text-sm">
              Local date: <span className="font-semibold text-foreground">{today}</span>
            </p>
          </div>
          <div className="text-xs text-muted-foreground sm:text-right">
            {loading ? "Consulting the stars…" : usingFallback ? "Showing fallback forecast" : "Updated automatically"}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {SIGNS.map((sign) => {
            const isActive = selectedSign === sign.key;
            return (
              <Button
                key={sign.key}
                type="button"
                variant="secondary"
                onClick={() => setSelectedSign(sign.key)}
                aria-pressed={isActive}
                className={[
                  "w-full min-w-0 h-auto py-3 px-3 flex-col items-center justify-center text-center gap-1 bg-card hover:bg-accent text-foreground border border-border sm:flex-row sm:justify-start sm:text-left sm:gap-2",
                  isActive ? "ring-2 ring-primary/40" : "",
                ].join(" ")}
              >
                <span className="text-xl leading-none">{sign.emoji}</span>
                <span className="text-[11px] sm:text-sm font-semibold leading-tight whitespace-normal break-words">
                  {sign.label}
                </span>
              </Button>
            );
          })}
        </div>
      </div>

      <Card className="border border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2">
              <span className="text-xl">{selectedMeta.emoji}</span>
              <span className="text-lg sm:text-xl font-extrabold">{selectedMeta.label}</span>
            </span>
            <span className="text-xs font-semibold text-muted-foreground bg-muted border border-border px-3 py-1 rounded-full">
              Love • Career • General
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2">
              <SkeletonCard title="General" />
              <SkeletonCard title="Love" />
              <SkeletonCard title="Career" />
              <SkeletonCard title="Lucky Numbers" />
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="bg-muted/30 border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    General
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-foreground leading-relaxed">{selected.general}</CardContent>
              </Card>

              <Card className="bg-muted/30 border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Heart className="h-4 w-4 text-primary" />
                    Love
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-foreground leading-relaxed">{selected.love}</CardContent>
              </Card>

              <Card className="bg-muted/30 border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-primary" />
                    Career
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-foreground leading-relaxed">{selected.career}</CardContent>
              </Card>

              <Card className="bg-muted/30 border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Star className="h-4 w-4 text-primary" />
                    Lucky Numbers
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-foreground leading-relaxed">{selected.luckyNumbers}</CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

