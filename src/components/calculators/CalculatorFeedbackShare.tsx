import React, { useEffect, useMemo, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import SocialShareButtons from "@/components/common/SocialShareButtons";

export default function CalculatorFeedbackShare() {
  const [url, setUrl] = useState<string>("");
  const urlInputRef = useRef<HTMLInputElement | null>(null);
  const embedRef = useRef<HTMLTextAreaElement | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  const embed = useMemo(() => {
    const u = url || (typeof window !== "undefined" ? window.location.href : "https://www.smartkitnow.com");
    return `<iframe src="${u}" width="100%" height="600" frameborder="0" style="border:0;" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
  }, [url]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUrl(window.location.href);
    }
  }, []);

  const copy = async (text: string, fallbackEl?: HTMLTextAreaElement | HTMLInputElement | null) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback para navegadores sem Clipboard API disponível
      if (fallbackEl) {
        try {
          fallbackEl.focus();
          // @ts-ignore
          fallbackEl.select?.();
          const ok = document.execCommand("copy");
          // Limpa seleção para não ficar marcado
          // @ts-ignore
          fallbackEl.setSelectionRange?.(0, 0);
          return ok;
        } catch {
          return false;
        }
      }
      return false;
    }
  };

  const shareWeb = async () => {
    if (navigator.share) {
      try { await navigator.share({ url, title: document.title }); } catch {}
    } else {
      await copy(url, urlInputRef.current);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 1500);
    }
  };

  const handleCopyUrl = async () => {
    await copy(url, urlInputRef.current);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 1500);
  };

  const handleCopyEmbed = async () => {
    await copy(embed, embedRef.current);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 1500);
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
            <div className="mt-1 flex items-center gap-2">
              <Input ref={urlInputRef} readOnly value={url} onFocus={(e) => e.currentTarget.select()} />
              <Button variant="secondary" onClick={handleCopyUrl}><Copy className="h-4 w-4 mr-1" />Copy</Button>
              {copiedUrl && <span className="text-xs text-muted-foreground">Copied!</span>}
              <Button onClick={shareWeb}>Share</Button>
            </div>
          </div>
          <div>
            <Label>Embed this calculator</Label>
            <Textarea ref={embedRef} readOnly value={embed} rows={4} onFocus={(e) => e.currentTarget.select()} />
            <div className="mt-2 flex items-center gap-2">
              <Button variant="secondary" onClick={handleCopyEmbed}><Copy className="h-4 w-4 mr-1" />Copy embed code</Button>
              {copiedEmbed && <span className="text-xs text-muted-foreground">Copied!</span>}
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