import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Search, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SEOHead from "@/components/SEOHead";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <SEOHead
        title="404 - Page Not Found | Smart Kit Now"
        description="The page you are looking for does not exist or has been moved."
        robots="noindex, follow"
      />

      <div className="w-full max-w-md text-center space-y-8 animate-in fade-in zoom-in duration-500">
        {/* Visual Element */}
        <div className="relative mx-auto w-24 h-24 mb-6">
          <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse" />
          <div className="relative flex items-center justify-center w-full h-full">
            <AlertCircle className="w-12 h-12 text-primary" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Oops! Page Not Found
          </h1>
          <p className="text-lg text-muted-foreground">
            We couldn't find the calculator or page you're looking for. It might have been moved or deleted.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Button
            variant="default"
            onClick={() => navigate("/")}
            className="w-full h-12 text-base font-medium transition-all hover:scale-[1.02]"
          >
            <Home className="mr-2 h-5 w-5" />
            Go to Home
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/search")}
            className="w-full h-12 text-base font-medium transition-all hover:scale-[1.02]"
          >
            <Search className="mr-2 h-5 w-5" />
            Search Tools
          </Button>
        </div>

        <div className="pt-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go back to previous page
          </Button>
        </div>

        {/* Decorative background element */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl opacity-50" />
        </div>
      </div>
    </div>
  );
}
