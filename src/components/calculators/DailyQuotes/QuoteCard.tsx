import { useCallback, useMemo } from "react";
import { Heart, Copy, Share2 } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";

export type DailyQuoteItem = {
  id: number;
  text: string;
  author: string | null;
  tags: string[];
};

export default function QuoteCard({
  item,
  categoryLabel,
  isLiked,
  onToggleLike,
  tone = "default",
}: {
  item: DailyQuoteItem;
  categoryLabel: string;
  isLiked: boolean;
  onToggleLike: (id: number) => void;
  tone?: "default" | "tech";
}) {
  const displayText = useMemo(() => item.text.trim(), [item.text]);
  const shareText = useMemo(() => {
    const author = item.author?.trim();
    return author ? `${displayText}\n— ${author}` : displayText;
  }, [displayText, item.author]);

  const handleCopy = useCallback(async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareText);
      } else {
        const el = document.createElement("textarea");
        el.value = shareText;
        el.setAttribute("readonly", "true");
        el.style.position = "absolute";
        el.style.left = "-9999px";
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
      }
      toast("Copied to clipboard!");
    } catch {
      toast("Copy failed. Please try again.");
    }
  }, [shareText]);

  const handleShare = useCallback(async () => {
    try {
      if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
        await navigator.share({ text: shareText });
        return;
      }
      await handleCopy();
    } catch {
      toast("Share failed. Please try again.");
    }
  }, [handleCopy, shareText]);

  return (
    <Card className="bg-card text-card-foreground border-border">
      <CardContent className="p-6 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <Badge variant="secondary" className="shrink-0">
            {categoryLabel}
          </Badge>
          {item.tags?.length ? (
            <div className="flex flex-wrap justify-end gap-1">
              {item.tags.slice(0, 3).map((t) => (
                <Badge key={t} variant="outline" className="text-xs">
                  {t}
                </Badge>
              ))}
            </div>
          ) : null}
        </div>

        <p className={["text-base leading-relaxed", tone === "tech" ? "font-mono" : ""].join(" ")}>
          {displayText}
        </p>

        {item.author ? <p className="text-sm text-muted-foreground">— {item.author}</p> : null}
      </CardContent>

      <CardFooter className="px-6 pb-6 pt-0 flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          className="px-2"
          onClick={() => onToggleLike(item.id)}
          aria-pressed={isLiked}
        >
          <Heart className={["h-4 w-4 mr-2", isLiked ? "fill-current" : ""].join(" ")} />
          <span className="text-sm">{isLiked ? "Liked" : "Like"}</span>
        </Button>

        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="icon" onClick={handleCopy} aria-label="Copy to clipboard">
            <Copy className="h-4 w-4" />
          </Button>
          <Button type="button" variant="outline" size="icon" onClick={handleShare} aria-label="Share">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

