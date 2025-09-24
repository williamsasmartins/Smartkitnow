import { ThemeToggle } from "./ThemeToggle";
import { useNavigate } from "react-router-dom";
import logoImage from "@/assets/logo-skn.png";

export function Header() {
  const navigate = useNavigate();

  const handleHomeClick = () => navigate("/");

  return (
    <header className="fixed top-0 w-full border-b border-border/40 bg-background/95 backdrop-blur-md z-[10000]">
      <div className="container mx-auto px-4 py-3 max-w-7xl flex items-center justify-between">
        <div 
          className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
          onClick={handleHomeClick}
        >
          {logoImage ? (
            <img 
              src={logoImage} 
              alt="Smart Kit Now Logo" 
              className="h-8 w-auto block"
            />
          ) : (
            <span className="text-lg font-bold">Smart Kit Now</span>
          )}
        </div>
        
        <div className="flex items-center mr-3 sm:mr-4 md:mr-6">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}