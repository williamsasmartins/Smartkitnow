import { useMemo } from "react";

type Props = {
  url?: string; // default: window.location.href (client-side)
  title?: string; // default: document.title (client-side)
  className?: string;
};

export default function ShareThisPageBox({ url, title, className = "" }: Props) {
  const href = useMemo(() => url ?? (typeof window !== "undefined" ? window.location.href : ""), [url]);
  const pageTitle = useMemo(() => title ?? (typeof document !== "undefined" ? document.title : "Calculator"), [title]);

  function copyLink() {
    if (href) navigator.clipboard?.writeText(href);
  }
  function copyEmbed() {
    const snippet = `<iframe src="${href}" title="${pageTitle}" style="width:100%;min-height:650px;border:0;" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
    navigator.clipboard?.writeText(snippet);
  }

  return (
    <div className={`rounded-2xl border border-gray-200 bg-gray-50/40 p-4 dark:border-gray-800 dark:bg-gray-900/40 ${className}`}>
      <h3 className="text-lg font-semibold">Share this page</h3>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          className="rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-medium text-white"
          onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(href)}&text=${encodeURIComponent(pageTitle)}`, "_blank")}
        >
          X / Twitter
        </button>
        <button
          className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white"
          onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(href)}`, "_blank")}
        >
          Facebook
        </button>
        <button
          className="rounded-md bg-sky-600 px-3 py-1.5 text-sm font-medium text-white"
          onClick={() => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(href)}&title=${encodeURIComponent(pageTitle)}`, "_blank")}
        >
          LinkedIn
        </button>
        <button
          className="rounded-md bg-red-500 px-3 py-1.5 text-sm font-medium text-white"
          onClick={() => window.open(`https://www.reddit.com/submit?url=${encodeURIComponent(href)}&title=${encodeURIComponent(pageTitle)}`, "_blank")}
        >
          Reddit
        </button>
        <button
          className="rounded-md bg-green-600 px-3 py-1.5 text-sm font-medium text-white"
          onClick={() => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(pageTitle + " " + href)}`, "_blank")}
        >
          WhatsApp
        </button>

        <button className="rounded-md border px-3 py-1.5 text-sm" onClick={copyLink}>Copy link</button>
      </div>

      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between">
          <h4 className="font-medium">Embed</h4>
          <button className="rounded-md border px-2 py-1 text-xs" onClick={copyEmbed}>Copy embed</button>
        </div>
        <textarea
          className="h-28 w-full rounded-md border border-gray-300 bg-white p-2 text-xs dark:border-gray-700 dark:bg-gray-950"
          readOnly
          value={`<iframe src="${href}" title="${pageTitle}" style="width:100%;min-height:650px;border:0;" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`}
        />
      </div>
    </div>
  );
}