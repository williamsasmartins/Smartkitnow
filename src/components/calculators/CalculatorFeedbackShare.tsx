import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import SocialShareButtons from "@/components/common/SocialShareButtons";

export default function CalculatorFeedbackShare() {
  const [url, setUrl] = useState<string>("");
  const embed = useMemo(() => {
    const u = url || "https://www.smartkitnow.com";
    return `<iframe src="${u}" width="100%" height="600" frameborder="0" style="border:0;" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
  }, [url]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUrl(window.location.href);
    }
  }, []);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {}
  };

  const shareWeb = async () => {
    if (navigator.share) {
      try { await navigator.share({ url, title: document.title }); } catch {}
    } else {
      copy(url);
    }
  };

  return (
    <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* Questions / Suggestions */}
      <Card className="bg-card border-border/60">
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Questions or suggestions?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label htmlFor="q-email">Email</Label>
            <Input id="q-email" placeholder="you@example.com" />
          </div>
          <div>
            <Label htmlFor="q-name">Your name</Label>
            <Input id="q-name" placeholder="John Doe" />
          </div>
          <div>
            <Label htmlFor="q-msg">Message</Label>
            <Textarea id="q-msg" placeholder="How can we help?" rows={4} />
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <input id="q-consent" type="checkbox" className="h-4 w-4 rounded border-border/60" />
            <label htmlFor="q-consent">I agree to the processing of my data for contact purposes.</label>
          </div>
          <Button>Send</Button>
        </CardContent>
      </Card>

      {/* Share */}
      <Card className="bg-card border-border/60">
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Share this calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>URL</Label>
            <div className="mt-1 flex gap-2">
              <Input readOnly value={url} />
              <Button variant="secondary" onClick={() => copy(url)}><Copy className="h-4 w-4 mr-1" />Copy</Button>
              <Button onClick={shareWeb}>Share</Button>
            </div>
          </div>
          <div>
            <Label>Embed this calculator</Label>
            <Textarea readOnly value={embed} rows={4} />
            <div className="mt-2">
              <Button variant="secondary" onClick={() => copy(embed)}><Copy className="h-4 w-4 mr-1" />Copy embed code</Button>
            </div>
          </div>
          <div className="pt-2">
            <SocialShareButtons url={url} title={typeof document !== "undefined" ? document.title : "Smart Kit Now"} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}