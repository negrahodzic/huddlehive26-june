"use client";

import { useState } from "react";

export default function ShareButton({
  label = "Share",
  title = "Notice",
  text = "What's being built near here",
  className,
}: {
  label?: string;
  title?: string;
  text?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function share() {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    // Native share sheet on mobile, clipboard elsewhere.
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch {
        /* user cancelled — fall through to copy */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  }

  return (
    <button
      onClick={share}
      className={
        className ??
        "inline-flex items-center gap-1.5 rounded-xl border border-stone-300 bg-white px-3.5 py-2 text-xs font-semibold text-stone-600 shadow-sm transition hover:border-brand-300 hover:text-brand-600"
      }
    >
      {copied ? "Link copied ✓" : `🔗 ${label}`}
    </button>
  );
}
