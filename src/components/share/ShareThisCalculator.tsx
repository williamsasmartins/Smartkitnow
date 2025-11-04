import { useEffect, useState } from "react";
import { siX, siWhatsapp, siFacebook, siLinkedin, siReddit, siTelegram } from "simple-icons";
import { Mail } from "lucide-react";

export default function ShareThisCalculator() {
  const [url, setUrl] = useState<string>("");
  const [title, setTitle] = useState<string>("Smart Kit Now");
  const [copied, setCopied] = useState(false);
  const [embedCopied, setEmbedCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUrl(window.location.href);
      setTitle(document.title || "Smart Kit Now");
    }
  }, []);

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const embedCode = `<iframe src="${url}" width="100%" height="600" frameborder="0" style="border:0;" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;

  const copyEmbed = async () => {
    await navigator.clipboard.writeText(embedCode);
    setEmbedCopied(true);
    setTimeout(() => setEmbedCopied(false), 2000);
  };

  const tw = `https://twitter.com/intent/tweet?text=${encodeURIComponent("Check this calculator:")}&url=${encodeURIComponent(url)}`;
  const wa = `https://wa.me/?text=${encodeURIComponent("Check this calculator: " + url)}`;
  const fb = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  const li = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
  const rd = `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
  const tg = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
  const em = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent("Check this calculator: " + url)}`;

  return (
    <section className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 space-y-3">
      <h3 className="text-[#5c82ee] text-lg font-semibold">Share this calculator</h3>
      <div className="flex items-center gap-2">
        <input value={url} readOnly className="flex-1 rounded-md border border-neutral-300 dark:border-neutral-700 bg-background px-3 py-2 text-sm" />
        <button onClick={copy} className="rounded-md px-3 py-2 text-sm bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700">
          {copied ? "Copied!" : "Copy"}
        </button>
        <button onClick={share} className="rounded-md px-3 py-2 text-sm bg-[#224691] hover:bg-[#1D4ED8] text-white">
          Share
        </button>
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <a aria-label="Share on X" href={tw} target="_blank" rel="noreferrer" className="inline-flex h-9 w-9 items-center justify-center rounded-md text-white hover:opacity-85 transition" style={{ backgroundColor: `#${siX.hex}` }}>
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
            <path d={siX.path} />
          </svg>
        </a>
        <a aria-label="Share on WhatsApp" href={wa} target="_blank" rel="noreferrer" className="inline-flex h-9 w-9 items-center justify-center rounded-md text-white hover:opacity-85 transition" style={{ backgroundColor: `#${siWhatsapp.hex}` }}>
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
            <path d={siWhatsapp.path} />
          </svg>
        </a>
        <a aria-label="Share on Facebook" href={fb} target="_blank" rel="noreferrer" className="inline-flex h-9 w-9 items-center justify-center rounded-md text-white hover:opacity-85 transition" style={{ backgroundColor: `#${siFacebook.hex}` }}>
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
            <path d={siFacebook.path} />
          </svg>
        </a>
        <a aria-label="Share on LinkedIn" href={li} target="_blank" rel="noreferrer" className="inline-flex h-9 w-9 items-center justify-center rounded-md text-white hover:opacity-85 transition" style={{ backgroundColor: `#${siLinkedin.hex}` }}>
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
            <path d={siLinkedin.path} />
          </svg>
        </a>
        <a aria-label="Share on Reddit" href={rd} target="_blank" rel="noreferrer" className="inline-flex h-9 w-9 items-center justify-center rounded-md text-white hover:opacity-85 transition" style={{ backgroundColor: `#${siReddit.hex}` }}>
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
            <path d={siReddit.path} />
          </svg>
        </a>
        <a aria-label="Share on Telegram" href={tg} target="_blank" rel="noreferrer" className="inline-flex h-9 w-9 items-center justify-center rounded-md text-white hover:opacity-85 transition" style={{ backgroundColor: `#${siTelegram.hex}` }}>
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
            <path d={siTelegram.path} />
          </svg>
        </a>
        <a aria-label="Share via Email" href={em} target="_blank" rel="noreferrer" className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-[#3c83f6] text-white hover:opacity-85 transition">
          <Mail className="h-5 w-5" aria-hidden="true" />
        </a>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-[#5c82ee]">Embed this calculator</h4>
        <textarea value={embedCode} readOnly rows={3} className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-background px-3 py-2 text-xs" />
        <button onClick={copyEmbed} className="rounded-md px-3 py-2 text-sm bg-[#224691] hover:bg-[#1D4ED8] text-white">
          {embedCopied ? "Copied!" : "Copy embed code"}
        </button>
      </div>
    </section>
  );
}