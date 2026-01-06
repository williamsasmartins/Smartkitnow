import React, { useState, useEffect } from "react";
import { MessageSquare, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SuggestionBox() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPage(window.location.pathname);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!suggestion.trim()) {
      alert("Please enter a suggestion");
      return;
    }

    setIsSubmitting(true);

    // Envia para Formspree (mesmo endpoint usado nos outros formulários do site)
    try {
      const data = new FormData();
      // Campos padrão
      if (name.trim()) data.append("name", name.trim());
      if (email.trim()) data.append("email", email.trim());
      data.append("message", suggestion.trim());
      // Contexto adicional
      if (page) data.append("page", page);
      data.append("_subject", "New Smart Kit Now suggestion");

      const res = await fetch("https://formspree.io/f/xanpypnb", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        setIsSubmitted(true);
        setName("");
        setEmail("");
        setSuggestion("");
        // Oculta mensagem de sucesso após alguns segundos
        setTimeout(() => setIsSubmitted(false), 4000);
      } else {
        const j = await res.json().catch(() => null);
        setError(j?.errors?.[0]?.message || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="my-8 p-8 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-2 border-purple-200 dark:border-purple-800 shadow-lg">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <span className="text-3xl">✅</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Thank You!
          </h3>
          <p className="text-gray-700 dark:text-gray-300">
            Your suggestion has been received. We appreciate your feedback!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-8 p-6 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-2 border-purple-200 dark:border-purple-800 shadow-lg">
      {/* Header */}
      <div className="mb-5">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          Send Us a Suggestion
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          Have an idea? We'd love to hear from you!
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name & Email - Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label 
              htmlFor="suggestion-name" 
              className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block"
            >
              Name <span className="text-gray-500">(optional)</span>
            </Label>
            <Input
              id="suggestion-name"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              name="name"
              className="bg-white dark:bg-gray-900 border-purple-200 dark:border-purple-700 focus:border-purple-500 dark:focus:border-purple-400"
            />
          </div>

          <div>
            <Label 
              htmlFor="suggestion-email" 
              className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block"
            >
              Email <span className="text-gray-500">(optional)</span>
            </Label>
            <Input
              id="suggestion-email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              name="email"
              className="bg-white dark:bg-gray-900 border-purple-200 dark:border-purple-700 focus:border-purple-500 dark:focus:border-purple-400"
            />
          </div>
        </div>

        {/* Suggestion Textarea */}
        <div>
          <Label 
            htmlFor="suggestion-text" 
            className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block"
          >
            Your Suggestion <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="suggestion-text"
            placeholder="Tell us what you'd like to see improved or added..."
            value={suggestion}
            onChange={(e) => setSuggestion(e.target.value)}
            rows={4}
            required
            name="message"
            className="bg-white dark:bg-gray-900 border-purple-200 dark:border-purple-700 focus:border-purple-500 dark:focus:border-purple-400 resize-none"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {suggestion.length} / 500 characters
          </p>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting || !suggestion.trim()}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 dark:from-purple-500 dark:to-pink-500 dark:hover:from-purple-600 dark:hover:to-pink-600 text-white font-semibold py-3 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Sending...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Send Suggestion
            </>
          )}
        </Button>
        {error && (
          <p className="text-xs text-center text-red-600 dark:text-red-400 mt-3" aria-live="polite">
            {error}
          </p>
        )}
      </form>

      {/* Footer Note */}
      <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
        💡 Your feedback helps us improve SmartKitNow for everyone
      </p>
    </div>
  );
}
