import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Privacy() {
  const updated = "September 20, 2025";
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: {updated}</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p>
            At <strong>Smart Kit Now</strong>, your privacy matters. This policy explains what we
            collect, how we use it, and your choices.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Information We Collect</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2">
            <li>Usage data via Google Analytics (pages visited, device, location).</li>
            <li>Contact info only if you share it with us (email, form submissions).</li>
            <li>Cookies and similar technologies to remember preferences.</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How We Use Information</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2">
            <li>To improve calculators and user experience.</li>
            <li>To monitor site performance.</li>
            <li>To respond to inquiries or feedback.</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Third-Party Services</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            We may use trusted providers like Google Analytics and Google AdSense. These have their
            own privacy policies.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Rights</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2">
            <li>You may disable cookies in your browser.</li>
            <li>You may request access or deletion of personal data.</li>
            <li>
              Contact us at{" "}
              <a className="underline" href="mailto:contact@smartkitnow.com">
                contact@smartkitnow.com
              </a>
              .
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
