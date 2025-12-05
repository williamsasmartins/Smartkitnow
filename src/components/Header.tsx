import { ThemeToggle } from "./ThemeToggle";
import { useNavigate, Link } from "react-router-dom";
import logoImage from "@/assets/logo-skn.png";
import { useAssetAvailable } from "@/hooks/useAssetAvailable";
import { getCategoryIcon } from "@/lib/navigation";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function Header() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const webpAvailable = useAssetAvailable("/logo-skn.webp");

  const PRIMARY_CATS = [
    { key: "financial", label: "Financial", to: "/financial" },
    { key: "health", label: "Health", to: "/health" },
    { key: "cooking", label: "Cooking", to: "/cooking" },
    { key: "conversion", label: "Conversion", to: "/conversion" },
    { key: "math", label: "Math & Algebra", to: "/math" },
    { key: "pets", label: "Pet Care", to: "/pets" },
    { key: "science", label: "Science", to: "/science" },
    { key: "time", label: "Time & Date", to: "/time" },
  ];

  const MORE_CATS = [    { key: "recipes", label: "Recipes", to: "/recipes" },
    { key: "smart-tips", label: "Smart Tips", to: "/smart-tips" },
    { key: "daily-quotes", label: "Daily Quotes", to: "/daily-quotes" },{ key: "everyday", label: "Everyday Life", to: "/everyday" },
    { key: "sports", label: "Sports", to: "/sports" },
    { key: "funny", label: "Funny", to: "/funny" },
    { key: "video", label: "Video", to: "/video" },
  ];

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
          {webpAvailable ? (
            <picture>
              <source srcSet="/logo-skn.webp" type="image/webp" />
              <img
                src={logoImage}
                alt="Smart Kit Now Logo"
                width={1000}
                height={300}
                decoding="async"
                className="h-9 w-auto block"
              />
            </picture>
          ) : (
            <img
              src={logoImage}
              alt="Smart Kit Now Logo"
              width={1000}
              height={300}
              decoding="async"
              className="h-9 w-auto block"
            />
          )}
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

      <nav className="container mx-auto px-4 pb-2 overflow-x-auto">
        <ul className="skn-cat-menu flex items-center justify-start gap-4 text-sm whitespace-nowrap w-full">
                    <li className="flex items-center">
            <Link to="/construction" className="text-primary hover:text-primary transition-colors inline-flex items-center">
              <span className="mr-1" aria-hidden>{getCategoryIcon("construction")}</span>
              Construction
            </Link>
          </li>
                    <li className="flex items-center">
            <Link to="/electrical" className="text-primary hover:text-primary transition-colors inline-flex items-center">
              <span className="mr-1" aria-hidden>{getCategoryIcon("electrical")}</span>
              Electrical
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-primary hover:text-primary transition-colors inline-flex items-center px-2">
                  More
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="bottom" align="start" className="min-w-[220px] animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 duration-150 ease-out">
                {MORE_CATS.map((cat) => (
                  <DropdownMenuItem key={cat.key} asChild>
                    <Link to={cat.to} className="inline-flex items-center gap-2">
                      <span className="text-[16px]" aria-hidden>{getCategoryIcon(cat.key)}</span>
                      <span>{cat.label}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        </ul>
      </nav>
    </header>
  );
}


