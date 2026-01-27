import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SEOHead from "@/components/SEOHead";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <SEOHead title="Page Not Found - Smart Kit Now" robots="noindex, nofollow" />
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      <div className="rounded-2xl border border-border/60 bg-card p-8 text-center">
        <div className="text-2xl font-semibold text-foreground mb-2">Calculator not found</div>
        <p className="text-muted-foreground mb-6">
          We couldn’t find this calculator. Please go back and choose another one.
        </p>
        <Button onClick={() => navigate("/")}>Go to Home</Button>
      </div>
    </div>
  );
}
