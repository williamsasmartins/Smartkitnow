// src/pages/Search.tsx
import React from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get("q") || "";

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Header />
      <main className="pt-24 container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-4">Search</h1>
        <p className="text-muted-foreground mb-6">You searched for: <strong>{q}</strong></p>
        <p className="text-sm text-muted-foreground">
          (Optional) You can render results aqui, mas como usamos o dropdown do Header,
          normalmente o usuário já navega direto para a calculadora.
        </p>
        <div className="mt-6">
          <Link to="/" className="text-primary underline">Back to Home</Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
