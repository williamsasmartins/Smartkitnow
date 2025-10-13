import React from "react";
import { Mail } from "lucide-react";
import { siX, siWhatsapp, siFacebook, siLinkedin, siTelegram } from "simple-icons";

type Props = { url: string; title?: string };

export default function SocialShareButtons({ url, title }: Props) {
  const encoded = encodeURIComponent(url);
  const text = encodeURIComponent(title || "Check out this calculator");

  const tw = `https://twitter.com/intent/tweet?url=${encoded}&text=${text}`;
  const wa = `https://wa.me/?text=${text}%20${encoded}`;
  const fb = `https://www.facebook.com/sharer/sharer.php?u=${encoded}`;
  const li = `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`;
  const tg = `https://t.me/share/url?url=${encoded}&text=${text}`;
  const em = `mailto:?subject=${title || "Check out this calculator"}&body=${url}`;

  return (
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
      <a aria-label="Share on Telegram" href={tg} target="_blank" rel="noreferrer" className="inline-flex h-9 w-9 items-center justify-center rounded-md text-white hover:opacity-85 transition" style={{ backgroundColor: `#${siTelegram.hex}` }}>
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
          <path d={siTelegram.path} />
        </svg>
      </a>
      <a aria-label="Share via Email" href={em} target="_blank" rel="noreferrer" className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-[#3c83f6] text-white hover:opacity-85 transition">
        <Mail className="h-5 w-5" aria-hidden="true" />
      </a>
    </div>
  );
}