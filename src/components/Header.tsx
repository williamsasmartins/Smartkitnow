import { ThemeToggle } from "./ThemeToggle";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function Header() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleHomeClick = () => {
    navigate("/");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // Here you can add search logic or debounced search
    console.log("Searching for:", e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Navigate to search results or filter current page
      console.log("Search submitted:", searchTerm);
    }
  };

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/90">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Project Title */}
          <div 
            className="flex items-center space-x-2 flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleHomeClick}
          >
            <div className="h-8 w-8 rounded-lg bg-gradient-primary animate-glow"></div>
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Smart Kit Now
            </h1>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-2xl mx-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for a calculator"
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 bg-muted/50 border-border/60 focus:border-primary/40 transition-all duration-300"
            />
          </form>

          {/* Dark Mode Toggle */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}