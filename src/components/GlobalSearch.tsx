import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
    Calculator,
    FileText,
    Gamepad2,
    Home,
    LayoutGrid,
    Search,
    TrendingUp,
} from "lucide-react";

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import { calculatorRegistry, calcLink } from "@/data/calculatorRegistry";
import { GAME_REGISTRY } from "@/data/gameRegistry";
import { DialogProps } from "@radix-ui/react-dialog";

// ---------------------------------------------------------------------------
// CATEGORY SYNONYMS
// Baked into each item's `value` string so cmdk's built-in filter can match
// associated words. "money" → finds Financial Tools / Loan Calculator, etc.
// ---------------------------------------------------------------------------
const CATEGORY_SYNONYMS: Record<string, string> = {
    financial:    "money finance loan mortgage budget savings investment debt credit tax interest pay salary wage income retirement pension",
    health:       "calories diet weight bmi body mass fitness exercise medical doctor nutrition wellness burn fat lose gain",
    cooking:      "cook food recipe bake kitchen oven temperature cup gram ounce tablespoon ingredient serving scale measure",
    math:         "calculate algebra geometry percentage percent fraction equation area volume square root prime number factor",
    conversion:   "convert unit metric imperial length temperature speed currency exchange weight volume celsius fahrenheit miles km",
    construction: "build concrete lumber wood paint roof floor tile fence wall drywall insulation hvac stair deck material estimate",
    automotive:   "car vehicle fuel gas mpg efficiency speed distance tire wheel depreciation oil maintenance",
    electrical:   "electric power voltage watts amps energy kwh solar ohm circuit wiring current consumption",
    science:      "physics chemistry biology element periodic formula mole solution concentration gravity force velocity",
    sports:       "sport fitness running pace distance calories swim cycling marathon race training",
    pets:         "pet dog cat animal food age weight breed calorie veterinary vet",
    time:         "clock hours minutes date age countdown timezone calendar duration deadline schedule when",
    everyday:     "tip discount split bill qr code password random generator gratuity restaurant percent sale",
    funny:        "fun humor joke silly entertainment weird random",
    marketing:    "roi campaign conversion funnel ads traffic seo social media email click engagement",
    video:        "video frame aspect ratio resolution bitrate encoding fps duration render export",
    // subcategories
    loans:        "loan borrow amortization payment monthly installment debt mortgage credit interest rate",
    investments:  "invest roi return compound interest portfolio stocks savings retirement",
    taxes:        "tax income deduction irs vat gst salary paycheck withholding",
    nutrition:    "food calories protein fat carbs diet meal macro nutrient",
    geometry:     "area volume circle triangle square perimeter radius diameter shape",
    percentage:   "percent discount tip increase decrease change markup",
    bmi:          "body weight height mass index obesity overweight underweight ideal",
};

interface GlobalSearchProps extends DialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function GlobalSearch({ open, onOpenChange, ...props }: GlobalSearchProps) {
    const navigate = useNavigate();

    // Cmd+K toggle
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                onOpenChange(!open);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, [onOpenChange, open]);

    const runCommand = (command: () => void) => {
        onOpenChange(false);
        command();
    };

    // Build calculator items once — enrich value with category synonyms
    const calculatorItems = useMemo(() =>
        calculatorRegistry.map(calc => {
            const descWords = (calc.description ?? "").split(/\s+/).slice(0, 20).join(" ");
            const catSyns   = CATEGORY_SYNONYMS[calc.category] ?? "";
            const subSyns   = calc.subcategory ? (CATEGORY_SYNONYMS[calc.subcategory] ?? "") : "";
            const value = [
                calc.title,
                calc.category,
                calc.subcategory ?? "",
                calc.seoTitle ?? "",
                descWords,
                catSyns,
                subSyns,
            ].join(" ").toLowerCase().replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
            return { title: calc.title, href: calcLink(calc), value };
        }),
    []);

    const gameItems = useMemo(() =>
        GAME_REGISTRY.map(game => ({
            title: game.title,
            href: `/games/${game.slug}`,
            value: `${game.title} game play free games ${(game as any).description ?? ""}`.toLowerCase(),
        })),
    []);

    const POPULAR = [
        { label: "BMI Calculator",   href: "/health/bmi-calculator" },
        { label: "Loan Calculator",  href: "/financial/loan-calculator" },
        { label: "Unit Converter",   href: "/conversion/unit-converter" },
        { label: "Tip Calculator",   href: "/everyday/tip-calculator" },
        { label: "Concrete Volume",  href: "/construction/concrete-slab-volume" },
    ];

    return (
        <CommandDialog open={open} onOpenChange={onOpenChange} {...props}>
            <CommandInput placeholder="Search calculators, tools, games…" />

            <CommandList>
                {/* Empty state */}
                <CommandEmpty>
                    <div className="py-6 text-center">
                        <Search className="mx-auto mb-3 h-8 w-8 text-muted-foreground/30" />
                        <p className="text-sm font-medium text-muted-foreground">No results found</p>
                        <p className="mt-1 text-xs text-muted-foreground/60">
                            Try different words — e.g. "money", "calories", "concrete"
                        </p>
                    </div>
                </CommandEmpty>

                {/* Popular — shown only when no query (cmdk hides groups when nothing matches) */}
                <CommandGroup heading="Popular">
                    {POPULAR.map(p => (
                        <CommandItem
                            key={p.href}
                            value={`popular ${p.label.toLowerCase()}`}
                            onSelect={() => runCommand(() => navigate(p.href))}
                        >
                            <TrendingUp className="mr-2 h-4 w-4 text-teal-500" />
                            <span>{p.label}</span>
                        </CommandItem>
                    ))}
                </CommandGroup>

                <CommandSeparator />

                {/* Categories */}
                <CommandGroup heading="Categories">
                    {[
                        { title: "Financial Tools",    href: "/financial",    v: "financial money loan mortgage budget savings investment debt credit tax interest salary income retirement" },
                        { title: "Health Calculators", href: "/health",       v: "health calories diet weight bmi fitness exercise medical nutrition wellness" },
                        { title: "Cooking & Baking",   href: "/cooking",      v: "cooking cook food recipe bake kitchen oven temperature cup gram ounce" },
                        { title: "Math Solvers",       href: "/math",         v: "math calculate algebra geometry percentage fraction equation area volume" },
                        { title: "Unit Conversion",    href: "/conversion",   v: "conversion convert unit metric imperial temperature length weight speed currency" },
                        { title: "Construction",       href: "/construction", v: "construction build concrete lumber wood paint roof floor tile fence wall drywall" },
                        { title: "Automotive",         href: "/automotive",   v: "automotive car vehicle fuel gas mpg speed distance tire depreciation" },
                        { title: "Electrical",         href: "/electrical",   v: "electrical electric power voltage watts amps energy kwh solar" },
                        { title: "Science",            href: "/science",      v: "science physics chemistry biology element formula periodic" },
                        { title: "Sports & Fitness",   href: "/sports",       v: "sports sport fitness running pace calories swim cycling marathon" },
                        { title: "Pet Care",           href: "/pets",         v: "pets pet dog cat animal food age weight breed" },
                        { title: "Time & Date",        href: "/time",         v: "time date clock hours minutes age countdown timezone calendar" },
                        { title: "Everyday Tools",     href: "/everyday",     v: "everyday tip discount split bill qr code password random generator" },
                    ].map(cat => (
                        <CommandItem
                            key={cat.href}
                            value={cat.v}
                            onSelect={() => runCommand(() => navigate(cat.href))}
                        >
                            <LayoutGrid className="mr-2 h-4 w-4" />
                            <span>{cat.title}</span>
                        </CommandItem>
                    ))}
                </CommandGroup>

                <CommandSeparator />

                {/* Pages */}
                <CommandGroup heading="Pages">
                    {[
                        { title: "Home",           href: "/",        v: "home start main" },
                        { title: "About Us",       href: "/about",   v: "about us team info" },
                        { title: "Contact",        href: "/contact", v: "contact support help" },
                        { title: "Smart Tips",     href: "/smart-tips", v: "tips advice smart guide" },
                        { title: "Daily Quotes",   href: "/daily-quotes", v: "quotes inspiration daily horoscope" },
                    ].map(p => (
                        <CommandItem
                            key={p.href}
                            value={p.v}
                            onSelect={() => runCommand(() => navigate(p.href))}
                        >
                            <Home className="mr-2 h-4 w-4" />
                            <span>{p.title}</span>
                        </CommandItem>
                    ))}
                </CommandGroup>

                <CommandSeparator />

                {/* Calculators — cmdk limits visible items via internal filtering */}
                <CommandGroup heading="Calculators">
                    {calculatorItems.map(item => (
                        <CommandItem
                            key={item.href}
                            value={item.value}
                            onSelect={() => runCommand(() => navigate(item.href))}
                        >
                            <Calculator className="mr-2 h-4 w-4" />
                            <span>{item.title}</span>
                        </CommandItem>
                    ))}
                </CommandGroup>

                <CommandSeparator />

                {/* Games */}
                <CommandGroup heading="Games">
                    {gameItems.map(item => (
                        <CommandItem
                            key={item.href}
                            value={item.value}
                            onSelect={() => runCommand(() => navigate(item.href))}
                        >
                            <Gamepad2 className="mr-2 h-4 w-4" />
                            <span>{item.title}</span>
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    );
}
