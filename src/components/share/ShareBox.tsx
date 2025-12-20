import * as React from "react";

function usePageUrl(fallback: string = "") {
  if (typeof window === "undefined") return fallback;
  const { origin, pathname } = window.location;
  return `${origin}${pathname}`;
}

function IconX(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path
        d="M18.36 2H21l-6.54 7.47L22.5 22h-6.27l-4.9-6.4-5.6 6.4H2l7.02-8.03L1.8 2h6.36l4.46 5.86L18.36 2Z"
        fill="currentColor"
      />
    </svg>
  );
}
function IconFacebook(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path
        d="M22 12.06C22 6.48 17.52 2 11.94 2 6.48 2 2 6.48 2 12.06c0 4.99 3.66 9.12 8.44 9.94v-7.03H7.9v-2.9h2.54V9.41c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.9h-2.34V22C18.34 21.18 22 17.05 22 12.06z"
        fill="currentColor"
      />
    </svg>
  );
}
function IconLinkedIn(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM0 8.98h5V24H0V8.98zM8.98 8.98h4.78v2.05h.07c.66-1.25 2.28-2.56 4.69-2.56 5.01 0 5.93 3.3 5.93 7.58V24h-5v-6.86c0-1.64-.03-3.75-2.29-3.75-2.29 0-2.64 1.79-2.64 3.64V24h-5V8.98z" fill="currentColor"/>
    </svg>
  );
}
function IconReddit(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path d="M12 2c.55 0 1 .45 1 1v1.09c1.52.1 2.9.55 4 .97l.73-1.69a1 1 0 011.83.8l-.7 1.6c1.02.5 1.86 1.06 2.44 1.6.4.36.43.98.06 1.38a.98.98 0 01-1.38.07c-.42-.38-1.12-.83-2.02-1.24-.15 1.1-.46 2.1-.98 2.97C17.97 12.3 19 13.57 19 15c0 2.76-3.13 5-7 5s-7-2.24-7-5c0-1.43 1.03-2.7 2.32-3.65-.52-.8-.83-1.7-.98-2.8-.9.4-1.6.86-2.02 1.24a.98.98 0 01-1.38-.07c-.37-.4-.34-1.02.06-1.38.58-.54 1.42-1.1 2.44-1.6l-.7-1.6a1 1 0 011.83-.8l.73 1.69c1.1-.42 2.48-.87 4-.97V3c0-.55.45-1 1-1z" fill="currentColor"/>
    </svg>
  );
}
function IconWhatsApp(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path d="M20.5 3.5A10.5 10.5 0 006.2 19.5L2 22l2.6-4.1A10.5 10.5 0 1020.5 3.5zM7 18.1c4.3 2.6 9.9 1.2 12.5-3 2.6-4.3 1.2-9.9-3-12.5-4.3-2.6-9.9-1.2-12.5 3A9.5 9.5 0 007 18.1zm9.4-4.4c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.6.1-.2.2-.7.8-.8 1-.1.2-.3.2-.5.1-1-.5-2-1.2-2.7-2.1-.2-.2-.2-.4 0-.6.1-.2.2-.4.3-.6.2-.2.2-.4.1-.6-.1-.2-.7-1.4-.8-1.6-.2-.2-.4-.3-.6-.2-.2 0-.4.1-.5.3-.2.2-.9 1-1 2.2-.1 1.3.8 2.6 1.9 3.5 1.1 1 2.4 1.5 3.7 1.4 1.2-.1 2-.8 2.2-1 .2-.2.2-.4 0-.6z" fill="currentColor"/>
    </svg>
  );
}
function IconMail(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path d="M20 4H4a2 2 0 00-2 2v.4l10 6.6 10-6.6V6a2 2 0 00-2-2zm0 4.3l-8.6 5.7a1 1 0 01-1.1 0L2 8.3V18a2 2 0 002 2h16a2 2 0 002-2V8.3z" fill="currentColor"/>
    </svg>
  );
}

export default function ShareBox({
  className = "",
  title = "Share this page",
  url,
}: {
  className?: string;
  title?: string;
  url?: string;
}) {
  const currentUrl = usePageUrl("");
  const pageUrl = url ?? currentUrl;
  const encoded = encodeURIComponent(pageUrl);

  const shareTargets = [
    { name: "X / Twitter", href: `https://twitter.com/intent/tweet?url=${encoded}`, bg: "bg-[#000000]", Icon: IconX },
    { name: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`, bg: "bg-[#1877F2]", Icon: IconFacebook },
    { name: "LinkedIn", href: `https://www.linkedin.com/shareArticle?mini=true&url=${encoded}`, bg: "bg-[#0A66C2]", Icon: IconLinkedIn },
    { name: "Reddit", href: `https://www.reddit.com/submit?url=${encoded}`, bg: "bg-[#FF4500]", Icon: IconReddit },
    { name: "WhatsApp", href: `https://api.whatsapp.com/send?text=${encoded}`, bg: "bg-[#25D366]", Icon: IconWhatsApp },
    { name: "Email", href: `mailto:?subject=Smart Kit Now&body=${encoded}`, bg: "bg-[#EA4335]", Icon: IconMail },
  ] as const;

  const onNativeShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: document.title, url: pageUrl });
      }
    } catch {
      // ignore
    }
  };

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // ignore
    }
  };

  const embedCode = `<iframe src="${pageUrl}" title="Calculator" style="width:100%;min-height:650px;border:0;" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;

  return (
    <div className={`border rounded-xl p-4 bg-card ${className}`}>
      <h3 className="text-lg font-semibold text-primary mb-3">{title}</h3>

      {/* Linha de ações principais */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <button
          onClick={onNativeShare}
          className="px-3 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Share
        </button>
        <button
          onClick={() => copy(pageUrl)}
          className="px-3 py-2 rounded-md border text-sm hover:bg-accent/40"
        >
          Copy link
        </button>
        <span className="text-sm text-muted-foreground truncate">{pageUrl}</span>
      </div>

      {/* Botões com logos oficiais coloridos */}
      <div className="flex flex-wrap gap-2 mb-4">
        {shareTargets.map(({ name, href, bg, Icon }) => (
          <a
            key={name}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-white ${bg} hover:brightness-110 transition`}
            aria-label={`Share on ${name}`}
            title={`Share on ${name}`}
          >
            <Icon className="w-5 h-5 text-white" />
            <span className="text-sm">{name}</span>
          </a>
        ))}
      </div>

      {/* EMBED (mantido) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium">Embed</span>
          <button
            onClick={() => copy(embedCode)}
            className="px-2 py-1 rounded-md border text-xs hover:bg-accent/40"
          >
            Copy embed
          </button>
        </div>
        <textarea
          readOnly
          className="w-full h-28 rounded-md bg-background border p-2 text-xs"
          value={embedCode}
        />
        <p className="mt-2 text-xs text-muted-foreground">
          Paste this snippet into your page to embed this calculator.
        </p>
      </div>
    </div>
  );
}