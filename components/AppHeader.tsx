"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Chat", href: "/chat" },
];

export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="flex h-14 items-center justify-between border-b border-foreground/10 px-6">
      <div className="flex items-center gap-8">
        <Link href="/" className="font-semibold">
          Acme Analytics
        </Link>
        <nav className="flex gap-1">
          {NAV_ITEMS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={`rounded-md px-3 py-1.5 text-sm ${
                pathname === href
                  ? "bg-foreground/10 font-medium"
                  : "text-foreground/60 hover:text-foreground"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
      {/* No session exists yet, so "Sign out" just returns to the landing page. */}
      <Link href="/" className="text-sm text-foreground/60 hover:text-foreground">
        Sign out
      </Link>
    </header>
  );
}
