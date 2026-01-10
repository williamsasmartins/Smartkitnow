import { useEffect, useMemo, useState } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
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

  const merged: DailyHoroscopeJson = {
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

  return merged;
}

function SkeletonCard({ title }: { title: string }) {
  return (
    <Card className="bg-white/5 border-white/10 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center justify-between">
          <span>{title}</span>
          <div className="h-4 w-4 rounded-full bg-white/20 animate-pulse" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="h-3 w-11/12 rounded bg-white/15 animate-pulse" />
          <div className="h-3 w-10/12 rounded bg-white/15 animate-pulse" />
          <div className="h-3 w-9/12 rounded bg-white/15 animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function DailyHoroscopeCalculator() {
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
        // Use o link RAW do seu repositório para não depender de rebuilds do Vercel
const res = await fetch("https://raw.githubusercontent.com/williamsasmartins/smartkit-onepage-wonder/main/public/daily_horoscope.json", { cache: "no-store", signal: controller.signal });
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

  const widget = (
    <div className="space-y-6">
      <nav
        aria-label="Daily Quotes navigation"
        className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur px-3 py-3"
      >
        <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap py-1">
          <a
            href="#zodiac-grid"
            aria-current="page"
            className="inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900 transition-colors"
          >
            Horoscope
          </a>
          <a
            href="#how-to-read"
            className="inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900 transition-colors"
          >
            How to read
          </a>
          <a
            href="#zodiac-curiosities"
            className="inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900 transition-colors"
          >
            Zodiac curiosities
          </a>
          <a
            href="#sign-guide"
            className="inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900 transition-colors"
          >
            Zodiac signs guide
          </a>
        </div>
      </nav>
      <div
        id="zodiac-grid"
        className="rounded-2xl p-6 border border-indigo-500/20 bg-gradient-to-br from-indigo-950 via-violet-950 to-slate-950 text-white shadow-2xl shadow-indigo-500/10"
      >
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-indigo-200">
              <Sparkles className="h-5 w-5" />
              <span className="text-xs font-semibold tracking-widest uppercase">Horoscope</span>
            </div>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight">
              Choose your sign
            </h2>
            <p className="mt-1 text-indigo-200/90 text-sm">
              Local date: <span className="font-semibold text-indigo-100">{today}</span>
            </p>
          </div>
          <div className="text-xs text-indigo-200/80 sm:text-right">
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
                  "w-full min-w-0 h-auto py-3 px-3 flex-col items-center justify-center text-center gap-1 bg-white/10 hover:bg-white/15 text-white border border-white/10 sm:flex-row sm:justify-start sm:text-left sm:gap-2",
                  isActive ? "ring-2 ring-indigo-300/70 bg-white/15" : "",
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

      <Card className="border border-indigo-200 dark:border-indigo-900 bg-gradient-to-br from-white to-indigo-50 dark:from-slate-900 dark:to-indigo-950">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2">
              <span className="text-xl">{selectedMeta.emoji}</span>
              <span className="text-lg sm:text-xl font-extrabold">{selectedMeta.label}</span>
            </span>
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/40 border border-indigo-200 dark:border-indigo-800 px-3 py-1 rounded-full">
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
              <Card className="bg-white/70 dark:bg-white/5 border-indigo-200/60 dark:border-white/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
                    General
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                  {selected.general}
                </CardContent>
              </Card>

              <Card className="bg-white/70 dark:bg-white/5 border-indigo-200/60 dark:border-white/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Heart className="h-4 w-4 text-pink-600 dark:text-pink-300" />
                    Love
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                  {selected.love}
                </CardContent>
              </Card>

              <Card className="bg-white/70 dark:bg-white/5 border-indigo-200/60 dark:border-white/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-amber-700 dark:text-amber-300" />
                    Career
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                  {selected.career}
                </CardContent>
              </Card>

              <Card className="bg-white/70 dark:bg-white/5 border-indigo-200/60 dark:border-white/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-600 dark:text-yellow-300" />
                    Lucky Numbers
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                  <span className="font-semibold">{selected.luckyNumbers}</span>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const editorial = (
    <div className="space-y-10">
      <section id="about" className="rounded-2xl border border-indigo-200 dark:border-indigo-900 bg-white dark:bg-slate-900 p-6">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Daily Horoscope — What you’ll find here</h2>
        <div className="mt-3 text-slate-700 dark:text-slate-300 leading-relaxed">
          This page brings you a clean, fast way to read your daily horoscope by zodiac sign. Tap a sign to see a focused
          forecast across <span className="font-semibold">general energy</span>, <span className="font-semibold">love</span>,{" "}
          <span className="font-semibold">career</span>, and{" "}
          <span className="font-semibold">lucky numbers</span>—then use the notes below to interpret the message with more
          clarity and less fluff.
        </div>
        <div className="mt-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Astrology is a cultural and symbolic system. Use this content for reflection and entertainment, not for medical,
          legal, or financial decisions.
        </div>
      </section>

      <section id="how-to-read" className="rounded-2xl border border-indigo-200 dark:border-indigo-900 bg-white dark:bg-slate-900 p-6">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">How to read a daily horoscope</h2>
        <div className="mt-3 text-slate-700 dark:text-slate-300 leading-relaxed">
          A good daily horoscope is less about “prediction” and more about{" "}
          <span className="font-semibold">pattern recognition</span>. Think of it as a short prompt to help you choose your
          focus. Here are simple ways to get more value from your reading:
        </div>
        <ul className="mt-4 list-disc pl-6 text-slate-700 dark:text-slate-300">
          <li>
            Read your <span className="font-semibold">Sun sign</span> first (the one most people know), then compare with
            your <span className="font-semibold">Rising/Ascendant</span> if you follow astrology more deeply.
          </li>
          <li>
            Treat “love” as <span className="font-semibold">connection</span> (relationships, friendships, social tone), and
            “career” as <span className="font-semibold">direction</span> (work, projects, decisions, reputation).
          </li>
          <li>
            Turn one sentence into an action: a boundary to set, a message to send, or a task to finish.
          </li>
          <li>
            Use the theme for the day, not every detail. If it doesn’t resonate, skip it—tomorrow’s tone will be different.
          </li>
        </ul>
      </section>

      <section id="zodiac-curiosities" className="rounded-2xl border border-indigo-200 dark:border-indigo-900 bg-white dark:bg-slate-900 p-6">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Zodiac curiosities (quick, useful, and surprisingly fun)</h2>
        <div className="mt-3 text-slate-700 dark:text-slate-300 leading-relaxed">
          The zodiac is a 12-part map traditionally linked to the Sun’s apparent path through the sky across the year.
          Different traditions exist (including Western and Vedic astrology), and even when people read “just for fun,” the
          zodiac remains one of the most recognizable symbolic systems in the world. If you’re here for a daily horoscope,
          these bite-sized curiosities add context—and make your reading feel more grounded.
        </div>
        <h3 className="mt-6 text-xl font-extrabold text-slate-900 dark:text-white">Elements: Fire, Earth, Air, Water</h3>
        <div className="mt-2 text-slate-700 dark:text-slate-300 leading-relaxed">
          Each sign belongs to an element, which describes the “style” of energy:
          <span className="font-semibold"> Fire</span> (Aries, Leo, Sagittarius) leans bold and action-oriented,
          <span className="font-semibold"> Earth</span> (Taurus, Virgo, Capricorn) favors stability and results,
          <span className="font-semibold"> Air</span> (Gemini, Libra, Aquarius) thrives on ideas and social flow, and
          <span className="font-semibold"> Water</span> (Cancer, Scorpio, Pisces) is intuitive and emotionally attuned.
        </div>
        <h3 className="mt-6 text-xl font-extrabold text-slate-900 dark:text-white">Modalities: Cardinal, Fixed, Mutable</h3>
        <div className="mt-2 text-slate-700 dark:text-slate-300 leading-relaxed">
          Modalities describe how a sign moves through change:
          <span className="font-semibold"> Cardinal</span> signs initiate (Aries, Cancer, Libra, Capricorn),
          <span className="font-semibold"> Fixed</span> signs sustain (Taurus, Leo, Scorpio, Aquarius), and
          <span className="font-semibold"> Mutable</span> signs adapt (Gemini, Virgo, Sagittarius, Pisces). If your daily
          horoscope feels “pushy,” “stubborn,” or “flexible,” modality often explains the flavor.
        </div>
        <h3 className="mt-6 text-xl font-extrabold text-slate-900 dark:text-white">Why horoscopes feel accurate sometimes</h3>
        <div className="mt-2 text-slate-700 dark:text-slate-300 leading-relaxed">
          Many people use horoscopes as reflective prompts. When a theme matches your current season of life, it can feel
          uncannily specific. The key is to use the forecast to improve your day: notice patterns, set intention, and make
          kinder choices—not to outsource responsibility to the stars.
        </div>
      </section>

      <section id="sign-guide" className="rounded-2xl border border-indigo-200 dark:border-indigo-900 bg-white dark:bg-slate-900 p-6">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Zodiac signs guide (traits people recognize instantly)</h2>
        <div className="mt-3 text-slate-700 dark:text-slate-300 leading-relaxed">
          Looking for a fast personality snapshot? These are common, modern associations—useful when you want to interpret a
          daily horoscope quickly and understand why the wording differs from sign to sign.
        </div>
        <ul className="mt-4 grid gap-3 md:grid-cols-2 text-slate-700 dark:text-slate-300">
          <li><span className="font-semibold">Aries:</span> bold starts, courage, direct action, competitive spark.</li>
          <li><span className="font-semibold">Taurus:</span> comfort, loyalty, patience, building something lasting.</li>
          <li><span className="font-semibold">Gemini:</span> curiosity, communication, variety, quick connections.</li>
          <li><span className="font-semibold">Cancer:</span> care, home, intuition, emotional protection.</li>
          <li><span className="font-semibold">Leo:</span> confidence, creativity, visibility, generous leadership.</li>
          <li><span className="font-semibold">Virgo:</span> improvement, detail, service, practical problem-solving.</li>
          <li><span className="font-semibold">Libra:</span> balance, relationships, harmony, refined decision-making.</li>
          <li><span className="font-semibold">Scorpio:</span> depth, focus, transformation, truth-seeking.</li>
          <li><span className="font-semibold">Sagittarius:</span> adventure, optimism, learning, big-picture vision.</li>
          <li><span className="font-semibold">Capricorn:</span> discipline, ambition, structure, long-term strategy.</li>
          <li><span className="font-semibold">Aquarius:</span> originality, community, innovation, future-thinking.</li>
          <li><span className="font-semibold">Pisces:</span> compassion, imagination, intuition, artistic flow.</li>
        </ul>
        <div className="mt-4 text-slate-700 dark:text-slate-300 leading-relaxed">
          Tip: if you’re comparing signs, look at the element first (style), then the modality (movement). That two-step
          lens makes horoscope language click faster.
        </div>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Horoscope"
      description="A clean, fast way to read your daily horoscope by zodiac sign. Tap a sign to see focused insights across general energy, love, career, and lucky numbers—then use the notes below to interpret the message with more clarity and less fluff."
      widget={widget}
      editorial={editorial}
      showTopBanner
      showSidebar
      showBottomBanner
      hideLegalDisclaimer
    />
  );
}
