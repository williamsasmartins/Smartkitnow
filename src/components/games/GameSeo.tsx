import SEOHead from "@/components/SEOHead";
import { safeJsonLd } from "@/lib/utils";

interface GameSeoProps {
  title: string;
  description: string;
  /** Game slug, e.g. "neon-snake" — used to build the canonical URL. */
  slug: string;
  category: string;
}

/**
 * Per-game <head> tags: unique title, description, canonical and VideoGame
 * JSON-LD.
 *
 * Extracted so BOTH game rendering paths share one source of truth:
 *   - games rendered through GamePageLayout, and
 *   - games with `useCustomLayout: true`, which render their own page component
 *     and previously emitted NO SEOHead at all. Those ~70 pages therefore
 *     inherited the generic index.html title ("Smart Kit Now - Your Ultimate
 *     Smart Tools Collection") and description, leaving Google with dozens of
 *     byte-identical titles — a direct cause of "Crawled - currently not
 *     indexed" in Search Console.
 */
export default function GameSeo({ title, description, slug, category }: GameSeoProps) {
  const canonicalUrl = `https://www.smartkitnow.com/games/${slug}`;

  return (
    <>
      <SEOHead
        title={`${title} - Play Free Online | Smart Kit Now`}
        description={description}
        canonical={canonicalUrl}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd({
            "@context": "https://schema.org",
            "@type": "VideoGame",
            name: title,
            description,
            genre: category,
            playMode: "SinglePlayer",
            url: canonicalUrl,
            inLanguage: "en",
          }),
        }}
      />
    </>
  );
}
