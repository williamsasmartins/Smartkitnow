import React, { useEffect, useMemo, useState } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import AdBannerTop from "@/components/ads/AdBannerTop";
import AdSidebarRight from "@/components/ads/AdSidebarRight";
import ShareThisPageBox from "@/components/ShareThisPageBox";
import SuggestionBox from "@/components/SuggestionBox";
import { getCuisine, getRecipe } from "@/data/recipes/cuisines";
import SeoHead from "@/components/SEOHead";
import JsonLd from "@/components/JsonLd";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Heart, Printer, Timer, ChefHat } from "lucide-react";

type PollinationsImageOptions = {
  width: number;
  height: number;
  seed: number;
  model?: string;
  safe?: boolean;
  enhance?: boolean;
  nologo?: boolean;
  referrer?: string;
};

type PollinationsCacheEntry = {
  url: string;
  status: "ok" | "error";
  updatedAt: number;
};

const POLLINATIONS_CACHE_KEY = "skn:pollinations:image-cache:v2";
const POLLINATIONS_OK_TTL_MS = 1000 * 60 * 60 * 24 * 30;
const POLLINATIONS_ERROR_TTL_MS = 1000 * 60 * 30;

function fnv1a32(input: string) {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function pollinationsImageUrl(prompt: string, opts: PollinationsImageOptions) {
  const base = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;
  const params = new URLSearchParams();
  params.set("width", String(opts.width));
  params.set("height", String(opts.height));
  params.set("seed", String(opts.seed));
  if (opts.model) params.set("model", opts.model);
  if (opts.safe != null) params.set("safe", String(opts.safe));
  if (opts.enhance != null) params.set("enhance", String(opts.enhance));
  if (opts.nologo != null) params.set("nologo", String(opts.nologo));
  if (opts.referrer) params.set("referrer", opts.referrer);
  return `${base}?${params.toString()}`;
}

function readPollinationsCache(): Record<string, PollinationsCacheEntry> {
  try {
    const raw = localStorage.getItem(POLLINATIONS_CACHE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    return parsed as Record<string, PollinationsCacheEntry>;
  } catch {
    return {};
  }
}

function writePollinationsCache(next: Record<string, PollinationsCacheEntry>) {
  try {
    localStorage.setItem(POLLINATIONS_CACHE_KEY, JSON.stringify(next));
  } catch {
    return;
  }
}

function getPollinationsCacheEntry(cacheId: string) {
  const cache = readPollinationsCache();
  const entry = cache[cacheId];
  if (!entry) return null;
  const ttl = entry.status === "ok" ? POLLINATIONS_OK_TTL_MS : POLLINATIONS_ERROR_TTL_MS;
  if (Date.now() - entry.updatedAt > ttl) return null;
  return entry;
}

function setPollinationsCacheEntry(cacheId: string, entry: PollinationsCacheEntry) {
  const cache = readPollinationsCache();
  cache[cacheId] = entry;
  writePollinationsCache(cache);
}

function buildFoodPhotoPrompt(dish: string, cuisine: string) {
  if (/bruschetta/i.test(dish)) {
    return [
      "Ultra realistic food photography",
      "Italian bruschetta",
      "toasted baguette slices topped with diced ripe tomatoes, fresh basil leaves, extra-virgin olive oil, garlic",
      "served on rustic wooden board, minimal styling",
      "natural window light, shallow depth of field, 50mm lens, high detail, appetizing, vibrant colors",
      "photorealistic, not illustration, not cartoon",
      "no text, no watermark, no logo, no QR code, no characters, no poster, no UI",
    ].join(", ");
  }
  return [
    `Ultra realistic food photography of ${dish}`,
    `${cuisine} cuisine`,
    "served on rustic ceramic plate or wooden board",
    "natural daylight, shallow depth of field, 50mm lens",
    "high detail, appetizing, vibrant colors, professional food styling",
    "no text, no watermark, no logo, no extra objects",
  ].join(", ");
}

function AiDishImage({
  cacheId,
  dish,
  cuisine,
  alt,
  width,
  height,
  className,
  loading,
  fallbackSrc,
}: {
  cacheId: string;
  dish: string;
  cuisine: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  loading?: "eager" | "lazy";
  fallbackSrc?: string;
}) {
  const prompt = useMemo(() => buildFoodPhotoPrompt(dish, cuisine), [dish, cuisine]);
  const seed = useMemo(() => fnv1a32(cacheId), [cacheId]);
  const urls = useMemo(() => {
    const common: Omit<PollinationsImageOptions, "model"> = {
      width,
      height,
      seed,
      safe: true,
      enhance: true,
      nologo: true,
      referrer: "smartkitnow.com",
    };
    return [
      pollinationsImageUrl(prompt, { ...common, model: "flux" }),
      pollinationsImageUrl(prompt, { ...common, model: "turbo" }),
    ];
  }, [prompt, seed, width, height]);

  type AiImageState = {
    candidateIndex: number;
    retryCount: number;
    cooldownUntil: number | null;
  };

  const [disabled, setDisabled] = useState(false);
  const [cachedOkUrl, setCachedOkUrl] = useState<string | null>(null);
  const [state, setState] = useState<AiImageState>({
    candidateIndex: 0,
    retryCount: 0,
    cooldownUntil: null,
  });

  useEffect(() => {
    const entry = getPollinationsCacheEntry(cacheId);
    if (entry?.status === "ok") setCachedOkUrl(entry.url);
    if (entry?.status === "error") setDisabled(true);
  }, [cacheId]);

  useEffect(() => {
    if (state.cooldownUntil == null) return;
    const timeoutId = window.setTimeout(
      () => setState((s) => ({ ...s, cooldownUntil: null })),
      Math.max(0, state.cooldownUntil - Date.now())
    );
    return () => window.clearTimeout(timeoutId);
  }, [state.cooldownUntil]);

  const isCoolingDown = state.cooldownUntil != null && Date.now() < state.cooldownUntil;

  if (!cachedOkUrl && (disabled || isCoolingDown) && !fallbackSrc) {
    return (
      <div
        className={["h-full w-full bg-muted", className].filter(Boolean).join(" ")}
        role="img"
        aria-label={alt}
      />
    );
  }

  const src = cachedOkUrl ?? (disabled || isCoolingDown ? fallbackSrc : urls[state.candidateIndex]!);

  const handleFailure = () => {
    const exhausted = state.candidateIndex + 1 >= urls.length;
    const canRetry = state.retryCount < 1;

    if (exhausted && !canRetry) {
      setPollinationsCacheEntry(cacheId, { url: src ?? "", status: "error", updatedAt: Date.now() });
      setDisabled(true);
      return;
    }

    setState((prev) => {
      const nextIndex = prev.candidateIndex + 1;
      if (nextIndex < urls.length) return { ...prev, candidateIndex: nextIndex };
      if (prev.retryCount >= 1) return prev;
      return { candidateIndex: 0, retryCount: prev.retryCount + 1, cooldownUntil: Date.now() + 15000 };
    });
  };

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      decoding="async"
      onLoad={(e) => {
        if (disabled || isCoolingDown) return;
        if (!src) return;
        const img = e.currentTarget;
        const naturalW = img.naturalWidth || 0;
        const naturalH = img.naturalHeight || 0;
        const expectedRatio = width / height;
        const actualRatio = naturalH ? naturalW / naturalH : 0;

        const ratioOff = actualRatio ? Math.abs(actualRatio - expectedRatio) : 1;
        const tooSmall = naturalW < width * 0.8 || naturalH < height * 0.8;

        if (tooSmall || ratioOff > 0.05) {
          if (cachedOkUrl) setCachedOkUrl(null);
          handleFailure();
          return;
        }

        setPollinationsCacheEntry(cacheId, { url: src, status: "ok", updatedAt: Date.now() });
      }}
      onError={() => {
        if (cachedOkUrl) setCachedOkUrl(null);
        if (disabled || isCoolingDown) return;
        handleFailure();
      }}
    />
  );
}

export default function RecipeDetailPage() {
  const { cuisine, recipe } = useParams<{ cuisine: string; recipe: string }>();
  const c = cuisine ? getCuisine(cuisine) : undefined;
  const r = cuisine && recipe ? getRecipe(cuisine, recipe) : undefined;
  const isBruschetta = c?.key === "italian" && r?.slug === "tomato-and-basil-bruschetta";

  const canonical = typeof window !== "undefined" ? window.location.href : undefined;

  const LS_KEY = "skn:favorite_recipes";
  const favoriteId = c && r ? `${c.key}:${r.slug}` : "";
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return;
      setIsFavorite(parsed.includes(favoriteId));
    } catch {
      return;
    }
  }, [favoriteId]);

  function toggleFavorite() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      const arr: string[] = Array.isArray(parsed) ? parsed : [];
      const next = new Set(arr);
      if (next.has(favoriteId)) next.delete(favoriteId);
      else next.add(favoriteId);
      const nextArr = Array.from(next);
      localStorage.setItem(LS_KEY, JSON.stringify(nextArr));
      setIsFavorite(next.has(favoriteId));
    } catch {
      return;
    }
  }

  const related = useMemo(() => {
    if (!c || !isBruschetta) return [];
    const preferred = [
      "Caprese Salad",
      "Garlic and Herb Crostini",
      "Italian Bread Salad (Panzanella)",
      "Antipasto Platter (Cured Meats, Cheese, Olives)",
    ];
    const map = new Map(c.recipes.map((x) => [x.title, x]));
    return preferred.flatMap((t) => {
      const item = map.get(t);
      return item ? [item] : [];
    }).slice(0, 4);
  }, [c, isBruschetta]);

  const faqs = useMemo(() => {
    if (!isBruschetta) return [];
    return [
      {
        question: "Can I make bruschetta ahead of time?",
        answer:
          "You can prep the tomato mixture up to 4 hours ahead and keep it chilled. Toast the bread and assemble right before serving to keep it crisp.",
      },
      {
        question: "Is this bruschetta vegan?",
        answer:
          "Yes, if you skip cheese or use a plant-based topping. The classic tomato-and-basil version is naturally vegan.",
      },
      {
        question: "How do I make it gluten-free?",
        answer:
          "Use gluten-free baguette or crostini. Toast as usual and assemble right before serving.",
      },
      {
        question: "How should I store leftovers?",
        answer:
          "Store the tomato topping in an airtight container up to 24 hours. Keep bread separate and toast fresh for best texture.",
      },
    ];
  }, [isBruschetta]);

  const faqJsonLd = useFaqJsonLd(faqs);

  const bruschettaFallbackImage =
    "https://images.unsplash.com/photo-1622896784083-cc051313dbb6?auto=format&fit=crop&w=1600&q=80";

  const bruschettaHeroCacheId = "recipes:italian:tomato-and-basil-bruschetta:hero";
  const bruschettaHeroImages = useMemo(() => {
    const prompt = buildFoodPhotoPrompt("Tomato and Basil Bruschetta", "Italian");
    const seed = fnv1a32(bruschettaHeroCacheId);
    const common: Omit<PollinationsImageOptions, "model"> = {
      width: 1600,
      height: 900,
      seed,
      safe: true,
      enhance: true,
      nologo: true,
      referrer: "smartkitnow.com",
    };
    return [
      pollinationsImageUrl(prompt, { ...common, model: "flux" }),
      pollinationsImageUrl(prompt, { ...common, model: "turbo" }),
      bruschettaFallbackImage,
    ];
  }, []);

  const recipeJsonLd = useMemo(() => {
    if (!isBruschetta) return null;

    const image = bruschettaHeroImages;

    return {
      "@context": "https://schema.org",
      "@type": "Recipe",
      name: "Tomato and Basil Bruschetta",
      description:
        "Classic Italian tomato and basil bruschetta: crisp toasted bread topped with ripe tomatoes, fresh basil, extra-virgin olive oil, and a hint of garlic—simple, bright, and perfect as an antipasto or appetizer.",
      image,
      recipeYield: "6 servings (about 12 small toasts)",
      prepTime: "PT15M",
      cookTime: "PT8M",
      totalTime: "PT23M",
      recipeCategory: "Starters & Small Plates",
      recipeCuisine: "Italian",
      keywords: ["bruschetta", "italian", "antipasto", "tomato", "basil"],
      recipeIngredient: [
        "1 baguette or ciabatta (about 250 g / 9 oz), sliced 1/2–3/4 inch (1.5 cm)",
        "450 g / 1 lb ripe tomatoes (San Marzano, Roma, or sweet cherry tomatoes), diced small",
        "A generous handful of fresh basil leaves (about 20 g), torn by hand",
        "1–2 garlic cloves, halved (for rubbing the toast)",
        "45 ml (3 Tbsp) extra-virgin olive oil, plus more to finish",
        "15 ml (1 Tbsp) balsamic vinegar, optional",
        "1 tsp fine sea salt (adjust to taste)",
        "Freshly ground black pepper",
      ],
      recipeInstructions: [
        {
          "@type": "HowToStep",
          name: "Toast the bread",
          text: "Heat the oven to 425°F / 220°C. Arrange bread slices on a sheet pan and toast for 6–8 minutes, flipping halfway, until golden and crisp.",
        },
        {
          "@type": "HowToStep",
          name: "Make the tomato topping",
          text: "Mix tomatoes, basil, olive oil, salt, pepper, and optional balsamic. Let sit for 10 minutes to macerate.",
        },
        {
          "@type": "HowToStep",
          name: "Season the toast",
          text: "Lightly rub the warm toast with the cut garlic clove. Drizzle with a little olive oil.",
        },
        {
          "@type": "HowToStep",
          name: "Assemble and serve",
          text: "Spoon the tomato topping over the toasts, finish with more basil and olive oil, and serve immediately.",
        },
      ],
      nutrition: {
        "@type": "NutritionInformation",
        calories: "165 kcal",
        carbohydrateContent: "22 g",
        proteinContent: "4 g",
        fatContent: "7 g",
        fiberContent: "2.5 g",
        sodiumContent: "320 mg",
      },
    };
  }, [bruschettaHeroImages, isBruschetta]);

  if (!c || !r) return <Navigate to="/recipes" replace />;

  return (
    <div className="min-h-screen">
      <div className="h-16 md:h-20" aria-hidden />
      <AdBannerTop />

      <main className="mx-auto max-w-7xl px-4 pb-16 lg:pr-[65px]">
        {isBruschetta ? (
          <>
            <SeoHead
              title="Tomato and Basil Bruschetta"
              description="Tomato and basil bruschetta is a classic Italian antipasto made with crisp toasted bread, ripe tomatoes, fresh basil, extra-virgin olive oil, and garlic. Learn pro techniques, nutrition, and easy variations."
              canonical={canonical}
              ogType="article"
              ogImage="https://images.unsplash.com/photo-1622896784083-cc051313dbb6?auto=format&fit=crop&w=1600&q=80"
            />

            <JsonLd data={[recipeJsonLd, faqJsonLd].filter(Boolean)} />

            <div className="grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-9 pr-[15px]">
                <header className="py-6">
                  <nav aria-label="Breadcrumb" className="text-sm mb-2 text-muted-foreground">
                    <Link to="/" className="hover:underline">
                      Home
                    </Link>
                    <span> &gt; </span>
                    <Link to="/recipes" className="hover:underline">
                      Recipes
                    </Link>
                    <span> &gt; </span>
                    <Link to={`/recipes/${c.key}`} className="hover:underline">
                      {c.name}
                    </Link>
                    <span> &gt; </span>
                    <span>{r.title}</span>
                  </nav>

                  <div className="flex flex-col gap-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline">Italian</Badge>
                      <Badge variant="outline">Starters & Small Plates</Badge>
                      <Badge variant="outline">Vegetarian</Badge>
                    </div>

                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h1 className="text-3xl md:text-4xl font-semibold text-primary">
                          Tomato and Basil Bruschetta
                        </h1>
                        <p className="mt-2 text-base text-muted-foreground max-w-3xl">
                          Crisp toast topped with juicy tomatoes, fragrant basil, extra-virgin olive oil, and a hint of garlic.
                          This tomato basil bruschetta recipe focuses on texture and balance: macerate the tomatoes for flavor,
                          keep the bread crunchy, and assemble at the last minute.
                        </p>
                      </div>

                      <div className="flex shrink-0 flex-col gap-2">
                        <Button variant="outline" className="gap-2" onClick={() => window.print()}>
                          <Printer className="h-4 w-4" />
                          Print
                        </Button>
                        <Button
                          variant={isFavorite ? "default" : "outline"}
                          className="gap-2"
                          onClick={toggleFavorite}
                        >
                          <Heart className="h-4 w-4" />
                          {isFavorite ? "Saved" : "Save"}
                        </Button>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-semibold flex items-center gap-2">
                            <Timer className="h-4 w-4" />
                            Time & difficulty
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground space-y-1">
                          <div className="flex justify-between gap-3">
                            <span>Prep</span>
                            <span className="text-foreground font-medium">15 min</span>
                          </div>
                          <div className="flex justify-between gap-3">
                            <span>Toast</span>
                            <span className="text-foreground font-medium">6–8 min</span>
                          </div>
                          <div className="flex justify-between gap-3">
                            <span>Total</span>
                            <span className="text-foreground font-medium">23 min</span>
                          </div>
                          <div className="flex justify-between gap-3">
                            <span>Difficulty</span>
                            <span className="text-foreground font-medium">Easy</span>
                          </div>
                          <div className="flex justify-between gap-3">
                            <span>Yield</span>
                            <span className="text-foreground font-medium">6 servings</span>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="md:col-span-2 overflow-hidden">
                        <div className="aspect-[16/9] w-full bg-muted">
                          <AiDishImage
                            cacheId="recipes:italian:tomato-and-basil-bruschetta:hero"
                            dish="Tomato and Basil Bruschetta"
                            cuisine="Italian"
                            alt="Tomato and Basil Bruschetta"
                            width={1600}
                            height={900}
                            className="h-full w-full object-cover"
                            loading="eager"
                            fallbackSrc={bruschettaFallbackImage}
                          />
                        </div>
                      </Card>
                    </div>
                  </div>
                </header>

                <article className="space-y-10">
                  <section className="space-y-3">
                    <h2 className="text-xl md:text-2xl font-semibold text-primary">Overview</h2>
                    <div className="space-y-3 text-muted-foreground">
                      <p>
                        Tomato and basil bruschetta is a timeless Italian appetizer: toasted bread topped with ripe tomatoes,
                        fresh basil, extra-virgin olive oil, and garlic. It’s quick, seasonal, and built on the same idea that
                        drives many Italian recipes—simple ingredients handled with care.
                      </p>
                      <p>
                        The key technique is maceration: salting the tomatoes and letting them rest so their juices mingle with
                        olive oil and aromatics. Then you assemble at the last moment to keep the bread crisp and the topping
                        bright.
                      </p>
                      <p>
                        Use this recipe for parties, summer dinners, or as an antipasto alongside charcuterie and cheese. It
                        also works as a light lunch with a salad or as a side for grilled fish.
                      </p>
                    </div>
                  </section>

                  <section className="space-y-3">
                    <h2 className="text-xl md:text-2xl font-semibold text-primary">Ingredients</h2>
                    <p className="text-muted-foreground">
                      Ingredient quality is everything here: choose peak-season tomatoes, a fruity extra-virgin olive oil, and
                      bread with a sturdy crumb and crisp crust so it stays crunchy under the topping.
                    </p>

                    <div className="grid gap-4 md:grid-cols-2">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">Core ingredients (6 servings)</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm">
                          <ul className="list-disc pl-5 space-y-2">
                            <li>1 baguette or ciabatta (about 250 g / 9 oz), sliced 1/2–3/4 inch (1.5 cm)</li>
                            <li>450 g / 1 lb ripe tomatoes (San Marzano, Roma, or sweet cherry tomatoes), finely diced</li>
                            <li>Fresh basil (about 20 g), torn by hand</li>
                            <li>45 ml (3 Tbsp) extra-virgin olive oil, plus more to finish</li>
                            <li>1–2 garlic cloves, halved (to rub the toast)</li>
                            <li>Fine sea salt and freshly ground black pepper</li>
                            <li>15 ml (1 Tbsp) balsamic vinegar, optional</li>
                          </ul>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">Seasonal swaps & alternatives</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground space-y-3">
                          <div>
                            <div className="font-medium text-foreground">Out-of-season tomatoes</div>
                            <div>
                              Use sweet cherry tomatoes, or roast halved tomatoes at 400°F / 200°C for 20–25 minutes to
                              concentrate flavor.
                            </div>
                          </div>
                          <div>
                            <div className="font-medium text-foreground">Bread</div>
                            <div>
                              Swap in rustic Italian bread, sourdough, or store-bought crostini (quickly re-toast to refresh
                              texture).
                            </div>
                          </div>
                          <div>
                            <div className="font-medium text-foreground">Finishing touches</div>
                            <div>
                              Add lemon zest, fresh oregano, or a tiny pinch of chili flakes for extra lift.
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </section>

                  <Separator />

                  <section className="space-y-4">
                    <h2 className="text-xl md:text-2xl font-semibold text-primary">Instructions</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">Recommended tools</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                          Large sheet pan, sharp knife, mixing bowl, fine-mesh strainer (optional), and tongs/spatula.
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">Pro technique</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                          Salt the tomatoes and let them macerate for 10 minutes. If the mixture is very watery, briefly strain
                          so the toast stays crisp.
                        </CardContent>
                      </Card>
                    </div>

                    <ol className="space-y-3">
                      <li className="rounded-lg border p-4">
                        <div className="font-semibold">1) Toast the bread (6–8 minutes)</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Heat the oven to 425°F / 220°C. Toast until golden, flipping halfway. For extra crunch, lightly brush
                          with olive oil first.
                        </div>
                      </li>
                      <li className="rounded-lg border p-4">
                        <div className="font-semibold">2) Make the topping (10 minutes + 1 minute)</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Mix tomatoes, basil, olive oil, salt, pepper, and optional balsamic. Rest 10 minutes. Taste and
                          adjust salt at the end.
                        </div>
                      </li>
                      <li className="rounded-lg border p-4">
                        <div className="font-semibold">3) Season and assemble (2–3 minutes)</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Rub warm toast with garlic. Assemble right before serving. Finish with a drizzle of olive oil and a
                          few basil leaves.
                        </div>
                      </li>
                      <li className="rounded-lg border p-4">
                        <div className="font-semibold">4) Presentation</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Serve on a wide platter without stacking. For extra aroma, finish with a fruity olive oil right at
                          the table.
                        </div>
                      </li>
                    </ol>
                  </section>

                  <Separator />

                  <section className="space-y-4">
                    <h2 className="text-xl md:text-2xl font-semibold text-primary">Nutrition Facts</h2>
                    <p className="text-sm text-muted-foreground">
                      Approximate values per serving (about 2 small toasts). Numbers vary by bread size and olive oil amount.
                    </p>

                    <Card>
                      <CardContent className="pt-6">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Nutrient</TableHead>
                              <TableHead className="text-right">Per serving</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell>Calories</TableCell>
                              <TableCell className="text-right">165 kcal</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Carbohydrates</TableCell>
                              <TableCell className="text-right">22 g</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Protein</TableCell>
                              <TableCell className="text-right">4 g</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Total fat</TableCell>
                              <TableCell className="text-right">7 g</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Fiber</TableCell>
                              <TableCell className="text-right">2.5 g</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Sugars</TableCell>
                              <TableCell className="text-right">3 g</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Sodium</TableCell>
                              <TableCell className="text-right">320 mg</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Potassium</TableCell>
                              <TableCell className="text-right">280 mg</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Vitamin C</TableCell>
                              <TableCell className="text-right">12 mg</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Vitamin A</TableCell>
                              <TableCell className="text-right">55 µg</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Calcium</TableCell>
                              <TableCell className="text-right">40 mg</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Iron</TableCell>
                              <TableCell className="text-right">1.2 mg</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>

                    <div className="grid gap-4 md:grid-cols-3">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">Vegetarian</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                          The base recipe is vegetarian. For a classic upgrade, add shaved Parmigiano-Reggiano.
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">Vegan</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                          Keep it cheese-free or add a plant-based topping. Use a fruity olive oil to add richness.
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">Gluten-free</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                          Use gluten-free baguette or crostini. Toast well and assemble right before serving.
                        </CardContent>
                      </Card>
                    </div>
                  </section>

                  <Separator />

                  <section className="space-y-4">
                    <h2 className="text-xl md:text-2xl font-semibold text-primary">Make-ahead, storage, and variations</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">Make-ahead & storage</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground space-y-2">
                          <div>Make the tomato topping up to 4 hours ahead and refrigerate.</div>
                          <div>Keep toast separate and assemble just before serving for best crunch.</div>
                          <div>Leftover topping keeps up to 24 hours; drain briefly before using again.</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">Easy variations</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground space-y-2">
                          <div>Caprese-style: add mozzarella or burrata and a touch of balsamic.</div>
                          <div>Prosciutto: add a thin ribbon of prosciutto for a salty, savory note.</div>
                          <div>Roasted tomatoes: roast for deeper sweetness when tomatoes aren’t perfect.</div>
                        </CardContent>
                      </Card>
                    </div>
                  </section>

                  <Separator />

                  <section className="space-y-4">
                    <h2 className="text-xl md:text-2xl font-semibold text-primary">FAQ</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                      {faqs.map((f) => (
                        <Card key={f.question}>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-base">{f.question}</CardTitle>
                          </CardHeader>
                          <CardContent className="text-sm text-muted-foreground">{f.answer}</CardContent>
                        </Card>
                      ))}
                    </div>
                  </section>

                  <Separator />

                  <section className="space-y-4">
                    <h2 className="text-xl md:text-2xl font-semibold text-primary">Michelin-level chef tips</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base flex items-center gap-2">
                            <ChefHat className="h-4 w-4" />
                            Techniques to elevate the dish
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground space-y-2">
                          <div>
                            After maceration, briefly strain the tomatoes and use just a little juice to lightly “paint” the
                            toast—flavor without sogginess.
                          </div>
                          <div>
                            For extra aroma, finish with basil-infused olive oil (30–60 minutes) and freshly cracked pepper.
                          </div>
                          <div>
                            For a creamy variation, add a thin layer of stracciatella or burrata under the tomatoes.
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">Wine pairings</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground space-y-2">
                          <div>Whites: Vermentino, Verdicchio, or Pinot Grigio (bright acidity for tomatoes and olive oil).</div>
                          <div>
                            Light reds: young Chianti or Barbera (especially if you add cheese or prosciutto).
                          </div>
                          <div>No-alcohol: sparkling water with lemon to refresh the palate.</div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">A quick origin note</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm text-muted-foreground">
                        “Bruschetta” comes from the Italian verb <span className="italic">bruscare</span>, meaning “to toast over
                        coals”. Traditionally, it was a way to taste new-season olive oil with toasted bread and garlic—especially
                        in central Italy.
                      </CardContent>
                    </Card>
                  </section>

                  <Separator />

                  <section className="space-y-4">
                    <h2 className="text-xl md:text-2xl font-semibold text-primary">Related recipes</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                      {related.map((rr) => (
                        <Link key={rr.slug} to={`/recipes/${c.key}/${rr.slug}`} className="group">
                          <Card className="h-full transition-colors group-hover:border-primary/50">
                            <div className="aspect-[16/9] w-full bg-muted overflow-hidden">
                              <AiDishImage
                                cacheId={`recipes:${c.key}:${rr.slug}:card`}
                                dish={rr.title}
                                cuisine={c.name}
                                alt={rr.title}
                                width={1200}
                                height={675}
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                                loading="lazy"
                              />
                            </div>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base">{rr.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                              Explore another Italian classic with the same simple-ingredients approach.
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {c.name} —{" "}
                      <Link to={`/recipes/${c.key}`} className="text-primary hover:underline">
                        see all {c.name} recipes
                      </Link>
                    </div>
                  </section>
                </article>

                <div className="mt-14 space-y-6">
                  <ShareThisPageBox />
                  <SuggestionBox />
                </div>
              </div>

              <aside className="hidden lg:block lg:col-span-3">
                <div className="sticky pr-[65px]" style={{ top: "var(--skn-rail-top)" }}>
                  <AdSidebarRight topOffset={0} />
                </div>
              </aside>
            </div>
          </>
        ) : (
          <div className="grid gap-8 lg:grid-cols-12">
            <header className="lg:col-span-9 py-6 pr-[15px]">
              <nav aria-label="Breadcrumb" className="text-sm mb-2 text-muted-foreground">
                <Link to="/" className="hover:underline">
                  Home
                </Link>
                <span> &gt; </span>
                <Link to="/recipes" className="hover:underline">
                  Recipes
                </Link>
                <span> &gt; </span>
                <Link to={`/recipes/${c.key}`} className="hover:underline">
                  {c.name}
                </Link>
                <span> &gt; </span>
                <span>{r.title}</span>
              </nav>
              <h1 className="text-3xl md:text-4xl font-semibold text-primary">{r.title}</h1>
              <p className="mt-2 text-sm">
                {c.name} —{" "}
                <Link to={`/recipes/${c.key}`} className="text-primary hover:underline">
                  see all {c.name} recipes
                </Link>
              </p>
            </header>
            <aside className="hidden lg:block lg:col-span-3">
              <div className="sticky pr-[65px]" style={{ top: "var(--skn-rail-top)" }}>
                <AdSidebarRight topOffset={0} />
              </div>
            </aside>
            <div className="lg:col-span-9 pr-[15px]">
              <div className="mt-6 space-y-6">
                <ShareThisPageBox />
                <SuggestionBox />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
