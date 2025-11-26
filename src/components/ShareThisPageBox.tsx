import React from "react";
import { Share2 } from "lucide-react";

export default function ShareThisPageBox() {
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const pageTitle = typeof document !== "undefined" ? document.title : "";

  const shareLinks = [
    {
      name: "Facebook",
      icon: "📘",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
      color: "hover:bg-blue-100 dark:hover:bg-blue-900",
    },
    {
      name: "Twitter",
      icon: "🐦",
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(pageTitle)}`,
      color: "hover:bg-sky-100 dark:hover:bg-sky-900",
    },
    {
      name: "LinkedIn",
      icon: "💼",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
      color: "hover:bg-blue-100 dark:hover:bg-blue-900",
    },
    {
      name: "WhatsApp",
      icon: "💬",
      url: `https://wa.me/?text=${encodeURIComponent(pageTitle + " " + currentUrl)}`,
      color: "hover:bg-green-100 dark:hover:bg-green-900",
    },
    {
      name: "Email",
      icon: "✉️",
      url: `mailto:?subject=${encodeURIComponent(pageTitle)}&body=${encodeURIComponent(currentUrl)}`,
      color: "hover:bg-gray-100 dark:hover:bg-gray-800",
    },
  ];

  const handleShare = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer,width=600,height=400");
  };

  const handleCopyLink = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="my-8 p-6 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-2 border-purple-200 dark:border-purple-800 shadow-lg">
      {/* Header */}
      <div className="mb-5">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Share2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          Share This Calculator
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Help others by sharing this calculator
        </p>
      </div>

      {/* Share Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-4">
        {shareLinks.map((link) => (
          <button
            key={link.name}
            onClick={() => handleShare(link.url)}
            className={`flex flex-col items-center justify-center gap-2 p-4 bg-white dark:bg-gray-900 rounded-lg transition-all hover:shadow-md ${link.color} group`}
            aria-label={`Share on ${link.name}`}
          >
            <span className="text-3xl">{link.icon}</span>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100">
              {link.name}
            </span>
          </button>
        ))}
      </div>

      {/* Copy Link */}
      <button
        onClick={handleCopyLink}
        className="w-full flex items-center justify-center gap-2 p-3 bg-white dark:bg-gray-900 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900 transition-all border border-purple-200 dark:border-purple-700 group"
      >
        <span className="text-lg">🔗</span>
        <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-purple-700 dark:group-hover:text-purple-300">
          Copy Link to Clipboard
        </span>
      </button>
    </div>
  );
}
