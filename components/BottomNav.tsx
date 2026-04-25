"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  {
    href: "/",
    label: "Home",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.7}>
        <path d="M3 9.5L11 3l8 6.5V19a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" strokeLinejoin="round"/>
        <path d="M8 20v-8h6v8" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    href: "/chat",
    label: "Chat",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.7}>
        <path d="M4 4h14a1 1 0 011 1v9a1 1 0 01-1 1H8l-4 3V5a1 1 0 011-1z" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    href: "/directory",
    label: "Help",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.7}>
        <path d="M11 2C7.7 2 5 4.7 5 8c0 4.8 6 12 6 12s6-7.2 6-12c0-3.3-2.7-6-6-6z" strokeLinejoin="round"/>
        <circle cx="11" cy="8" r="2.2"/>
      </svg>
    ),
  },
] as const;

// Hide on chat page — it has its own full-screen UI with header nav
const HIDDEN_ON = ["/chat"];

export default function BottomNav() {
  const pathname = usePathname();
  if (HIDDEN_ON.includes(pathname)) return null;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 border-t border-gray-200"
      style={{ backgroundColor: "#fff", paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-stretch max-w-lg mx-auto">
        {TABS.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex-1 flex flex-col items-center justify-center gap-1 py-2.5 transition-colors"
              style={{ color: active ? "#0D7377" : "#9CA3AF" }}
              aria-current={active ? "page" : undefined}
            >
              {tab.icon(active)}
              <span
                className="text-[10px] font-medium leading-none"
                style={{ color: active ? "#0D7377" : "#9CA3AF" }}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
