import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function About() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">About Smart Kit Now</h1>
        <p className="text-muted-foreground">
          Smart Kit Now is your hub for fast, reliable, easy-to-use calculators.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Our Mission</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p>
            We help people make better decisions with clear, accurate tools for everyday tasks —
            from <strong>construction estimating</strong> and <strong>financial planning</strong>,
            to <strong>health & fitness</strong> and <strong>unit conversions</strong>.
          </p>
          <p>
            Each calculator is designed for clarity: clean UI, sensible defaults, and formulas you
            can understand.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>What You’ll Find Here</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <ul className="list-disc pl-5 space-y-2">
            <li>Accurate formulas with transparent explanations and examples.</li>
            <li>Responsive design that works great on mobile and desktop.</li>
            <li>Continuous improvements based on real user feedback.</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Who We Serve</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p>
            Students, DIYers, contractors, small businesses, and anyone who wants quick,
            trustworthy results without the headache.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
