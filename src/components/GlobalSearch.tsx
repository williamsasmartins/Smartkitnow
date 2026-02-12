import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Calculator,
    FileText,
    Gamepad2,
    Home,
    LayoutGrid,
    Search,
    Settings,
    Wrench,
    BookOpen
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
import { calculatorRegistry } from "@/data/calculatorRegistry";
import { GAMES } from "@/data/gamesRegistry";
import { DialogProps } from "@radix-ui/react-dialog";

interface GlobalSearchProps extends DialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function GlobalSearch({
    open,
    onOpenChange,
    ...props
}: GlobalSearchProps) {
    const navigate = useNavigate();

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

    // 1. Build the master list of all searchable items
    const searchItems = [
        // --- Static Pages ---
        { title: "Home", href: "/", category: "Pages", icon: Home },
        { title: "Search Page", href: "/search", category: "Pages", icon: Search },
        { title: "About Us", href: "/about", category: "Pages", icon: FileText },
        { title: "Contact", href: "/contact", category: "Pages", icon: FileText },
        { title: "Privacy Policy", href: "/privacy", category: "Pages", icon: FileText },
        { title: "Terms of Service", href: "/terms", category: "Pages", icon: FileText },

        // --- Categories ---
        { title: "Financial Tools", href: "/financial", category: "Categories", icon: LayoutGrid },
        { title: "Health Calculators", href: "/health", category: "Categories", icon: LayoutGrid },
        { title: "Cooking", href: "/cooking", category: "Categories", icon: LayoutGrid },
        { title: "Math Solvers", href: "/math", category: "Categories", icon: LayoutGrid },

        // --- Calculators (Dynamic) ---
        ...calculatorRegistry.map(calc => ({
            title: calc.title,
            href: `/${calc.category}/${calc.slug}`,
            category: "Calculators",
            icon: Calculator,
            keywords: [calc.category, calc.subcategory || "", ...(calc.description?.split(" ") || [])]
        })),

        // --- Games (Dynamic) ---
        ...GAMES.map(game => ({
            title: game.title,
            href: `/games/${game.slug}`,
            category: "Games",
            icon: Gamepad2,
            keywords: ["game", "play", "free"]
        }))
    ];

    // Group items for rendering
    const pages = searchItems.filter(i => i.category === "Pages");
    const categories = searchItems.filter(i => i.category === "Categories");
    const calculators = searchItems.filter(i => i.category === "Calculators");
    const games = searchItems.filter(i => i.category === "Games");

    return (
        <CommandDialog open={open} onOpenChange={onOpenChange} {...props}>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>

                <CommandGroup heading="Pages">
                    {pages.map((item) => (
                        <CommandItem
                            key={item.href}
                            onSelect={() => runCommand(() => navigate(item.href))}
                            value={item.title}
                        >
                            <item.icon className="mr-2 h-4 w-4" />
                            <span>{item.title}</span>
                        </CommandItem>
                    ))}
                </CommandGroup>

                <CommandSeparator />

                <CommandGroup heading="Categories">
                    {categories.map((item) => (
                        <CommandItem
                            key={item.href}
                            onSelect={() => runCommand(() => navigate(item.href))}
                            value={item.title}
                        >
                            <item.icon className="mr-2 h-4 w-4" />
                            <span>{item.title}</span>
                        </CommandItem>
                    ))}
                </CommandGroup>

                <CommandSeparator />

                <CommandGroup heading="Calculators">
                    {calculators.map((item) => (
                        <CommandItem
                            key={item.href}
                            onSelect={() => runCommand(() => navigate(item.href))}
                            value={item.title}
                            keywords={item.keywords}
                        >
                            <item.icon className="mr-2 h-4 w-4" />
                            <span>{item.title}</span>
                        </CommandItem>
                    ))}
                </CommandGroup>

                <CommandSeparator />

                <CommandGroup heading="Games">
                    {games.map((item) => (
                        <CommandItem
                            key={item.href}
                            onSelect={() => runCommand(() => navigate(item.href))}
                            value={item.title}
                            keywords={item.keywords}
                        >
                            <item.icon className="mr-2 h-4 w-4" />
                            <span>{item.title}</span>
                        </CommandItem>
                    ))}
                </CommandGroup>

            </CommandList>
        </CommandDialog>
    );
}
