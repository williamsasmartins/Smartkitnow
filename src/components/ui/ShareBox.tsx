import * as React from "react";
import { Facebook, Twitter, Linkedin, MessageCircle, Mail } from "lucide-react";

type ShareBoxProps = {
  title?: string;
  url?: string;
  className?: string;
};

export default function ShareBox({
  title = "Share this page",
  url = typeof window !== "undefined" ? window.location.href : "",
  className,
}: ShareBoxProps) {
  const encoded = encodeURIComponent(url);
  const share = [
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
      Icon: Facebook,
      bg: "bg-[#1877F2]/15",
      fg: "text-[#1877F2]",
    },
    {
      name: "Twitter",
      href: `https://twitter.com/intent/tweet?url=${encoded}`,
      Icon: Twitter,
      bg: "bg-[#1DA1F2]/15",
      fg: "text-[#1DA1F2]",
    },
    {
      name: "LinkedIn",
      href: `https://www.linkedin.com/shareArticle?mini=true&url=${encoded}`,
      Icon: Linkedin,
      bg: "bg-[#0A66C2]/15",
      fg: "text-[#0A66C2]",
    },
    {
      name: "WhatsApp",
      href: `https://api.whatsapp.com/send?text=${encoded}`,
      Icon: MessageCircle,
      bg: "bg-[#25D366]/15",
      fg: "text-[#25D366]",
    },
    {
      name: "Email",
      href: `mailto:?subject=Smart Kit Now&body=${encoded}`,
      Icon: Mail,
      bg: "bg-[#EA4335]/15",
      fg: "text-[#EA4335]",
    },
  ];

  return (
    <div
      className={[
        "p-4 rounded-2xl border border-white/10 bg-white/5",
        className ?? "",
      ].join(" ")}
    >
      <h3 className="text-lg font-semibold text-[#5c82ee] mb-3">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {share.map(({ name, href, Icon, bg, fg }) => (
          <a
            key={name}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={[
              "inline-flex items-center gap-2 px-3 py-2 rounded-xl",
              "border border-white/10 hover:border-white/20 transition",
              bg,
            ].join(" ")}
            aria-label={`Share on ${name}`}
          >
            <Icon className={["w-5 h-5", fg].join(" ")} />
            <span className="text-sm text-white/90">{name}</span>
          </a>
        ))}
      </div>
    </div>
  );
}