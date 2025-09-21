import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";

export default function Terms() {
  const navigate = useNavigate();
  const updated = "September 20, 2025";
  return (
    <>
      <Header />
      <div className="mx-auto max-w-3xl px-4 py-10 space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Home
        </Button>
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Terms of Use</h1>
        <p className="text-muted-foreground">Last updated: {updated}</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Acceptance of Terms</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            By using Smart Kit Now, you agree to these Terms. If you do not agree, please stop using
            the site.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Use of Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2">
            <li>Calculators are for informational and educational purposes only.</li>
            <li>
              Results are not guaranteed. Always verify before financial, medical, or construction
              decisions.
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Intellectual Property</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            All content, design, and code on Smart Kit Now are the property of Smart Kit Now and
            cannot be reused without permission.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Third-Party Links</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Our site may link to external resources. We are not responsible for their content or
            practices.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Limitation of Liability</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Smart Kit Now is not liable for any losses or damages resulting from the use of our
            site.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Changes</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            We may update these Terms at any time. By continuing to use the site, you accept the
            revised Terms.
          </p>
        </CardContent>
      </Card>
      </div>
    </>
  );
}
