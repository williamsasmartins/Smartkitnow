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

    return (
        <CommandDialog open={open} onOpenChange={onOpenChange} {...props}>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>

                <CommandGroup heading="Pages">
                    <CommandItem
                        onSelect={() => runCommand(() => navigate("/"))}
                    >
                        <Home className="mr-2 h-4 w-4" />
                        <span>Home</span>
                    </CommandItem>
                    <CommandItem
                        onSelect={() => runCommand(() => navigate("/search"))}
                    >
                        <Search className="mr-2 h-4 w-4" />
                        <span>Search Page</span>
                    </CommandItem>
                    <CommandItem
                        onSelect={() => runCommand(() => navigate("/about"))}
                    >
                        <FileText className="mr-2 h-4 w-4" />
                        <span>About</span>
                    </CommandItem>
                    <CommandItem
                        onSelect={() => runCommand(() => navigate("/financial"))}
                    >
                        <LayoutGrid className="mr-2 h-4 w-4" />
                        <span>Financial Tools</span>
                    </CommandItem>
                </CommandGroup>

                <CommandSeparator />

                <CommandGroup heading="Tools & Calculators">
                    {calculatorRegistry.slice(0, 10).map((calc) => (
                        <CommandItem
                            key={calc.slug}
                            onSelect={() => runCommand(() => navigate(`/${calc.category}/${calc.slug}`))}
                            value={calc.title}
                        >
                            <Calculator className="mr-2 h-4 w-4" />
                            <span>{calc.title}</span>
                        </CommandItem>
                    ))}
                    <CommandItem
                        onSelect={() => runCommand(() => navigate("/search"))}
                        className="text-muted-foreground"
                    >
                        <Search className="mr-2 h-4 w-4" />
                        <span>Search all calculators...</span>
                    </CommandItem>
                </CommandGroup>

                <CommandSeparator />

                <CommandGroup heading="Games">
                    {GAMES.slice(0, 5).map((game) => (
                        <CommandItem
                            key={game.slug}
                            onSelect={() => runCommand(() => navigate(`/games/${game.slug}`))}
                            value={game.title}
                        >
                            <Gamepad2 className="mr-2 h-4 w-4" />
                            <span>{game.title}</span>
                        </CommandItem>
                    ))}
                </CommandGroup>

            </CommandList>
        </CommandDialog>
    );
}
