import { ThemeToggle } from "./ThemeToggle";
import { useNavigate, Link } from "react-router-dom";
import logoImage from "@/assets/logo-skn.png";
import { getCategoryIcon } from "@/lib/navigation";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function Header() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

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

  const MORE_CATS = [
    { key: "automotive", label: "Automotive", to: "/automotive" },
    { key: "construction", label: "Construction", to: "/construction" },
    { key: "electrical", label: "Electrical", to: "/electrical" },
    { key: "everyday", label: "Everyday Life", to: "/everyday" },
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
          <img src={logoImage} alt="Smart Kit Now Logo" className="h-9 w-auto block" />
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

      <nav className="container mx-auto px-4 pb-2 overflow-x-hidden">
        <ul className="skn-cat-menu flex items-center justify-start gap-4 text-sm whitespace-nowrap w-full">
          <li className="flex items-center">
            <Link to="/recipes" className="text-primary hover:text-primary/80 transition-colors inline-flex items-center">
              <span className="mr-1" aria-hidden>{getCategoryIcon("recipes")}</span>
              Recipes
            </Link>
          </li>
          <li className="flex items-center">
            <Link to="/smart-tips" className="text-primary hover:text-primary/80 transition-colors inline-flex items-center">
              <span className="mr-1" aria-hidden>{getCategoryIcon("smart-tips")}</span>
              Smart Tips
            </Link>
          </li>
          <li className="flex items-center">
            <Link to="/daily-quotes" className="text-primary hover:text-primary/80 transition-colors inline-flex items-center">
              <span className="mr-1" aria-hidden>{getCategoryIcon("daily-quotes")}</span>
              Daily Quotes
            </Link>
          </li>

          {PRIMARY_CATS.map((cat) => (
            <li key={cat.key} className="flex items-center">
              <Link to={cat.to} className="text-primary hover:text-primary/80 transition-colors inline-flex items-center">
                <span className="mr-1" aria-hidden>{getCategoryIcon(cat.key)}</span>
                {cat.label}
              </Link>
            </li>
          ))}

          <li className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-primary hover:text-primary/80 transition-colors inline-flex items-center px-2">
                  More
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="bottom" align="start" className="min-w-[220px]">
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
