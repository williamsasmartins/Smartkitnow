import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function Contact() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Contact Us</h1>
        <p className="text-muted-foreground">
          Questions, suggestions, or feedback? We’d love to hear from you.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>How to Reach Us</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
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

      <Card>
        <CardHeader>
          <CardTitle>Send a Message</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
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
  );
}
