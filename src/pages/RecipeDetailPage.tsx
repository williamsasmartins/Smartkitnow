import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { getCuisine, getRecipe } from "@/data/recipes/cuisines";
import SeoHead from "@/components/SEOHead";
import { getEntry } from "@/data/calculatorRegistry";

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
  return [
    `Ultra realistic food photography of ${dish}`,
    `${cuisine} cuisine`,
    "served on rustic ceramic plate or wooden board",
    "natural daylight, shallow depth of field, 50mm lens",
    "high detail, appetizing, vibrant colors, professional food styling",
    "no text, no watermark, no logo, no extra objects",
  ].join(", ");
}

function createLazyFromLoader(loader: () => Promise<any>, namedExport?: string) {
  const Lazy = React.lazy(async () => {
    const mod = await loader();
    return { default: namedExport ? mod[namedExport] : (mod.default ?? Object.values(mod)[0]) };
  });
  return Lazy;
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

  if (!c || !r) return <Navigate to="/recipes" replace />;

  const origin = "https://www.smartkitnow.com";
  const canonicalUrl = `${origin}/recipes/${c.key}/${r.slug}`;
  const entry = recipe ? getEntry(recipe) : undefined;
  const LazyCalc = entry ? createLazyFromLoader(entry.loader, entry.namedExport) : null;

  if (entry && LazyCalc) {
    return (
      <div className="w-full px-4 md:px-8 lg:px-10">
        <SeoHead
          title={`${entry.title} - Smart Kit Now`}
          description={entry.description || `See ingredients and instructions for ${entry.title}.`}
          canonical={canonicalUrl}
        />
        <Suspense fallback={<div className="py-10 text-muted-foreground text-center">Loading…</div>}>
          <main className="min-w-0">
            <LazyCalc />
          </main>
        </Suspense>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 lg:px-6 py-10">
      <SeoHead title={`${r.title} - Smart Kit Now`} canonical={canonical ?? canonicalUrl} />
      <nav aria-label="Breadcrumb" className="text-sm mb-3 text-muted-foreground">
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
      <h1 className="text-2xl font-semibold text-primary">{r.title}</h1>
      <p className="mt-2 text-muted-foreground">
        Esta receita ainda está sendo preparada para exibição completa.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link to={`/recipes/${c.key}`} className="text-primary hover:underline">
          Voltar para {c.name}
        </Link>
        <Link to="/recipes" className="text-primary hover:underline">
          Ver todas as cozinhas
        </Link>
      </div>
    </div>
  );
}
