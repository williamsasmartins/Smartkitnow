// src/pages/Contact.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import SiteFeedbackForm from "@/components/forms/SiteFeedbackForm";


export default function Contact() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-soft">
      <SEOHead
        title="Contact · SmartKitNow"
        description="Contact SmartKitNow — questions, feedback, and partnerships."
        canonical="https://www.smartkitnow.com/contact"
      />

      <Header />

      <main className="pt-20">
        <div className="mx-auto max-w-3xl px-4 py-10 space-y-6">
          <div className="mb-2">
            <Button
              variant="default"
              onClick={() => navigate("/")}
              className="flex items-center gap-2"
              style={{ backgroundColor: "#3c83f6", color: "#ffffff" }}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>

          <header className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight" style={{ color: "#5c82ee" }}>
              Contact Us
            </h1>
            <p className="text-lg" style={{ color: "#747886" }}>
              Questions, suggestions, or feedback? We’d love to hear from you.
            </p>
          </header>

          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle>How to Reach Us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-foreground/90">
              <p>
                <strong>Email:</strong>{" "}
                <a className="underline" href="mailto:contact@smartkitnow.com">
                  contact@smartkitnow.com
                </a>
              </p>
              <p>
                <strong>Business Hours:</strong> Monday–Friday, 9:00–17:00 (PST)
              </p>
              <p>
                <strong>Location:</strong> Burnaby, British Columbia, Canada
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle>Send a Message</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 text-foreground/90">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Your name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="contact@smartkitnow.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="How can we help?" />
              </div>
              <Button type="button" disabled>
                Submit (please email us directly for now)
              </Button>
            </CardContent>
          </Card>
        </div>
        <section className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <SiteFeedbackForm title="Questions or suggestions?" />
          
        </section>
      </main>

      <Footer />
    </div>
  );
}

export const pageMeta = { allowAds: false, minContentScore: 1 };
