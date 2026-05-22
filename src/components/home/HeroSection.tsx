import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import logoImage from "@/assets/logo-skn-new.svg";
import { POPULAR_PILLS } from "@/data/home/popularPills";

interface HeroSectionProps {
  onOpenSearch: () => void;
}

export default function HeroSection({ onOpenSearch }: HeroSectionProps): JSX.Element {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-teal-50 via-white to-white dark:from-teal-950/25 dark:via-background dark:to-background">
      <div className="absolute inset-0 pointer-events-none select-none" aria-hidden>
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[360px] rounded-full bg-teal-200/30 dark:bg-teal-500/8 blur-3xl" />
      </div>
      <div className="relative container mx-auto px-4 pt-10 sm:pt-14 pb-12 text-center max-w-3xl">
        <div className="flex justify-center mb-5">
          <picture>
            <source srcSet="/logo-skn-new.svg" type="image/svg+xml" />
            <img
              src={logoImage}
              alt="Smart Kit Now Logo"
              width={1000}
              height={300}
              decoding="async"
              // @ts-expect-error fetchpriority is not yet in React types
              fetchpriority="high"
              sizes="(max-width: 768px) 100vw, 266px"
              className="h-16 sm:h-20 w-auto block mix-blend-multiply dark:mix-blend-normal"
              style={{ height: undefined, width: "auto", aspectRatio: "1000/300" }}
            />
          </picture>
        </div>

        <p className="text-xs font-mono tracking-[0.18em] uppercase text-teal-600 dark:text-teal-400 mb-3">
          720+ Free Calculators
        </p>

        <h1 className="text-3xl sm:text-5xl font-bold text-foreground tracking-tight leading-tight mb-3">
          Every answer,{" "}
          <span className="text-teal-600 dark:text-teal-400">instantly.</span>
        </h1>

        <p className="text-muted-foreground text-base sm:text-lg max-w-md mx-auto mb-7 leading-relaxed">
          Math, money, health, cooking, construction &amp; more — all free.
        </p>

        <button
          className="mx-auto flex items-center gap-3 w-full max-w-md bg-background border border-border rounded-2xl px-5 py-3.5 text-left shadow-sm hover:border-teal-400 hover:shadow-md transition-all duration-200 cursor-text"
          onClick={onOpenSearch}
          aria-label="Search calculators"
        >
          <Search className="w-5 h-5 text-teal-500 shrink-0" />
          <span className="flex-1 text-muted-foreground text-sm sm:text-base">
            What do you need to calculate?
          </span>
          <kbd className="hidden sm:inline-flex items-center px-2 py-1 text-[10px] font-mono border border-border rounded-md bg-muted text-muted-foreground">
            ⌘K
          </kbd>
        </button>

        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {POPULAR_PILLS.map(({ label, path }) => (
            <button
              key={label}
              onClick={() => navigate(path)}
              className="px-3 py-1.5 text-xs font-medium text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/50 rounded-full border border-teal-200 dark:border-teal-800 hover:bg-teal-100 dark:hover:bg-teal-900/50 transition-colors"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
