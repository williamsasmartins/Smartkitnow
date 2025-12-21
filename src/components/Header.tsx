import { ThemeToggle } from "./ThemeToggle";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import logoImage from "@/assets/logo-skn.png";
import { getCategoryIcon } from "@/lib/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, lazy, Suspense, useEffect } from "react";
import { CATEGORIES } from "@/data/categoryMeta";

const HeaderMoreMenu = lazy(() => import("./HeaderMoreMenu"));

export function Header() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [isMenuLoaded, setIsMenuLoaded] = useState(false);
  const [forceOpen, setForceOpen] = useState(false);

  // Sync query with URL params
  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  const prefetchMenu = () => setIsMenuLoaded(true);
  const loadAndOpenMenu = () => {
    setIsMenuLoaded(true);
    setForceOpen(true);
  };

  const PRIMARY_CATS = [
    { key: "financial", label: "Financial", to: "/financial" },
    { key: "health", label: "Health", to: "/health" },
    { key: "cooking", label: "Cooking", to: "/cooking" },
    { key: "conversion", label: "Conversion", to: "/conversion" },
    { key: "math", label: "Math", to: "/math" },
    { key: "pets", label: "Pet Care", to: "/pets" },
    { key: "games", label: "Free Games", to: "/games" },
    { key: "qr-code", label: "Free QR Code Generator", to: "/everyday-life/qr-code-generator" },
    { key: "sports", label: "Sports", to: "/sports" },
  ];

  // Compute visible keys (those already shown in the header) so "More" only contains the rest
  const PRE_RENDERED_KEYS = ["construction", "automotive"];
  const VISIBLE_KEYS = [...PRE_RENDERED_KEYS, ...PRIMARY_CATS.map((c) => c.key)];

  // All known category keys (from CATEGORIES) plus some expected extras
  const EXTRA_KEYS = ["games", "smart-tips", "daily-quotes", "everyday"];
  const ALL_KEYS = Array.from(new Set([...Object.keys(CATEGORIES), ...EXTRA_KEYS]));

  const MORE_CATS = ALL_KEYS
    .filter((k) => !VISIBLE_KEYS.includes(k))
    .map((k) => {
      const meta = CATEGORIES[k];
      const label = meta?.display ?? k.replace(/-/g, " ").replace(/\b\w/g, (s) => s.toUpperCase());
      const to = `/${meta?.path ?? k}`;
      return { key: k, label, to };
    });

  const handleHomeClick = () => navigate("/");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <header className="fixed top-0 w-full bg-background/95 backdrop-blur-md z-[10000] border-b border-border/50">
      <div className="container mx-auto px-4 py-2 max-w-7xl grid grid-cols-1 sm:grid-cols-3 items-center gap-3">
        <div
          className="flex items-center cursor-pointer hover:opacity-80 transition-opacity justify-self-start"
          onClick={handleHomeClick}
        >
          <picture>
            <source srcSet="/logo-smartkitnow.webp" type="image/webp" />
            <img
              src={logoImage}
              alt="Smart Kit Now Logo"
              width={1000}
              height={300}
              decoding="async"
              // @ts-ignore
              fetchpriority="high"
              sizes="(max-width: 640px) 120px, 150px"
              className="h-9 w-auto block"
              style={{ height: "2.25rem", width: "auto", aspectRatio: "1000/300" }}
            />
          </picture>
        </div>

        <div className="w-full justify-self-center">
          <form onSubmit={handleSearchSubmit} className="mx-auto w-full max-w-lg flex items-center gap-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search calculators, tips, recipes…"
              className="h-9 w-full"
            />
            <Button type="submit" className="h-9">Search</Button>
          </form>
        </div>

        <div className="justify-self-end">
          <ThemeToggle />
        </div>
      </div>

      <nav className="container mx-auto px-4 pb-2">
        <ul className="skn-cat-menu flex flex-nowrap items-center justify-start gap-3 text-sm whitespace-nowrap w-full overflow-x-auto">
          <li className="flex items-center">
            <Link to="/construction" className="text-primary hover:text-primary transition-colors inline-flex items-center">
              <span className="mr-1" aria-hidden>{getCategoryIcon("construction")}</span>
              Construction
            </Link>
          </li>
          <li className="flex items-center">
            <Link to="/automotive" className="text-primary hover:text-primary transition-colors inline-flex items-center">
              <span className="mr-1" aria-hidden>{getCategoryIcon("automotive")}</span>
              Automotive
            </Link>
          </li>
          {PRIMARY_CATS.map((cat) => (
            <li key={cat.key} className="flex items-center">
              <Link to={cat.to} className="text-primary hover:text-primary transition-colors inline-flex items-center">
                <span className="mr-1" aria-hidden>{getCategoryIcon(cat.key)}</span>
                {cat.label}
              </Link>
            </li>
          ))}
          <li className="flex items-center">
            {!isMenuLoaded ? (
              <button
                className="text-primary hover:text-primary transition-colors inline-flex items-center px-2"
                onMouseEnter={prefetchMenu}
                onClick={loadAndOpenMenu}
              >
                More
              </button>
            ) : (
              <Suspense
                fallback={
                  <button className="text-primary hover:text-primary transition-colors inline-flex items-center px-2">
                    More
                  </button>
                }
              >
                <HeaderMoreMenu categories={MORE_CATS} defaultOpen={forceOpen} />
              </Suspense>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}
