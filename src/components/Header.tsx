import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Project Title */}
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-primary animate-glow"></div>
          <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Smart Kit Now
          </h1>
        </div>

        {/* Dark Mode Toggle */}
        <ThemeToggle />
      </div>
    </header>
  );
}