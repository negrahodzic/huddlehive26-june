"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Logo from "./Logo";
import { loadWatches } from "@/lib/watches";

export default function TopBar() {
  const [alertCount, setAlertCount] = useState(0);
  const pathname = usePathname();
  useEffect(() => setAlertCount(loadWatches().length), [pathname]);

  const isHome = pathname === "/";
  const isAlerts = pathname === "/alerts";

  const link = (active: boolean) =>
    `text-sm font-semibold transition ${
      active ? "text-brand-700" : "text-stone-500 hover:text-stone-800"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/70 bg-[#faf6ee]/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl flex-nowrap items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex shrink-0 items-center gap-2" title="Home">
          <Logo size={26} />
          <span className="font-display text-lg font-extrabold tracking-tight text-stone-800">Notice</span>
        </Link>

        <nav className="flex items-center gap-5">
          <Link href="/" className={link(isHome)} aria-current={isHome ? "page" : undefined}>
            Home
          </Link>
          <Link
            href="/alerts"
            className={`inline-flex items-center gap-1.5 ${link(isAlerts)}`}
            aria-current={isAlerts ? "page" : undefined}
          >
            My alerts
            {alertCount > 0 && (
              <span className="rounded-full bg-brand-500 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
                {alertCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
