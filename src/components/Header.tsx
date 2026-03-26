import { ThemeToggle } from "./ThemeToggle";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import logoImage from "@/assets/logo-skn-new.svg";
import { getCategoryIcon } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { GlobalSearch } from "./GlobalSearch";
import { useState, lazy, Suspense, useEffect, useRef } from "react";
import { CATEGORIES } from "@/data/categoryMeta";
import { Search, Menu, X } from "lucide-react";


const HeaderMoreMenu = lazy(() => import("./HeaderMoreMenu"));

export function Header() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isMenuLoaded, setIsMenuLoaded] = useState(false);
  const [forceOpen, setForceOpen] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close drawer on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [mobileMenuOpen]);

  // Close drawer on route change
  const searchParamsStr = searchParams.toString();
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [searchParamsStr]);

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
    { key: "qr-code", label: "Free QR Code", to: "/everyday/qr-code-generator" },
    { key: "sports", label: "Sports", to: "/sports" },
  ];

  const ALL_NAV_CATS = [
    { key: "construction", label: "Construction", to: "/construction" },
    { key: "automotive", label: "Automotive", to: "/automotive" },
    ...PRIMARY_CATS,
  ];

  const PRE_RENDERED_KEYS = ["construction", "automotive"];
  const VISIBLE_KEYS = [...PRE_RENDERED_KEYS, ...PRIMARY_CATS.map((c) => c.key)];
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

  return (
    <header
      ref={drawerRef}
      className="fixed top-0 w-full bg-background/95 backdrop-blur-md z-[10000] border-b border-border/50"
    >
      {/* ── MOBILE ROW (< sm): logo + search icon + hamburger ── */}
      <div className="flex sm:hidden items-center justify-between px-4 h-14">
        <div onClick={handleHomeClick} className="cursor-pointer hover:opacity-80 transition-opacity">
          <picture>
            <source srcSet="/logo-skn-new.svg" type="image/svg+xml" />
            <img
              src={logoImage}
              alt="Smart Kit Now"
              width={1000}
              height={300}
              decoding="async"
              className="h-8 w-auto block mix-blend-multiply dark:mix-blend-normal dark:brightness-0 dark:invert"
              style={{ height: "2rem", width: "auto", aspectRatio: "1000/300" }}
            />
          </picture>
        </div>

        <div className="flex items-center gap-1">
          <button
            className="p-2 rounded-md hover:bg-muted transition-colors"
            onClick={() => setOpenSearch(true)}
            aria-label="Search"
          >
            <Search className="w-5 h-5 text-muted-foreground" />
          </button>
          <ThemeToggle />
          <button
            className="p-2 rounded-md hover:bg-muted transition-colors"
            onClick={() => setMobileMenuOpen((o) => !o)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-muted-foreground" />
            ) : (
              <Menu className="w-5 h-5 text-muted-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* ── MOBILE DRAWER: categories ── */}
      {mobileMenuOpen && (
        <nav className="sm:hidden border-t border-border/50 bg-background/98 shadow-lg">
          <ul className="px-4 py-3 grid grid-cols-2 gap-2">
            {ALL_NAV_CATS.map((cat) => (
              <li key={cat.key}>
                <Link
                  to={cat.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-primary hover:bg-muted rounded-lg transition-colors"
                >
                  <span aria-hidden>{getCategoryIcon(cat.key)}</span>
                  {cat.label}
                </Link>
              </li>
            ))}
            {MORE_CATS.slice(0, 6).map((cat) => (
              <li key={cat.key}>
                <Link
                  to={cat.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-primary hover:bg-muted rounded-lg transition-colors"
                >
                  <span aria-hidden>{getCategoryIcon(cat.key)}</span>
                  {cat.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {/* ── DESKTOP ROW (≥ sm): 3-column grid ── */}
      <div className="hidden sm:grid container mx-auto px-4 py-2 max-w-7xl grid-cols-3 items-center gap-3">
        <div
          className="flex items-center cursor-pointer hover:opacity-80 transition-opacity justify-self-start"
          onClick={handleHomeClick}
        >
          <picture>
            <source srcSet="/logo-skn-new.svg" type="image/svg+xml" />
            <img
              src={logoImage}
              alt="Smart Kit Now Logo"
              width={1000}
              height={300}
              decoding="async"
              // @ts-expect-error fetchpriority is a new attribute
              fetchpriority="high"
              sizes="(max-width: 640px) 120px, 150px"
              className="h-9 w-auto block mix-blend-multiply dark:mix-blend-normal dark:brightness-0 dark:invert"
              style={{ height: "2.25rem", width: "auto", aspectRatio: "1000/300" }}
            />
          </picture>
        </div>

        <div className="w-full justify-self-center">
          <Button
            variant="outline"
            className="relative h-9 w-full max-w-lg justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
            onClick={() => setOpenSearch(true)}
          >
            <span className="hidden lg:inline-flex">Search calculators...</span>
            <span className="inline-flex lg:hidden">Search...</span>
            <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
        </div>

        <div className="justify-self-end">
          <ThemeToggle />
        </div>
      </div>

      {/* ── DESKTOP NAV: horizontal category bar (≥ sm) ── */}
      <nav className="hidden sm:block container mx-auto px-4 pb-2 relative">
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

      <GlobalSearch open={openSearch} onOpenChange={setOpenSearch} />
    </header>
  );
}
