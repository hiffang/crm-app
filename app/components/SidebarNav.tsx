"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/leads", label: "Leads" },
  { href: "/settings", label: "Settings" },
];

export default function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-2 text-sm">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center justify-between rounded-xl px-4 py-3 transition ${
              isActive
                ? "bg-slate-800 text-white"
                : "text-slate-300 hover:bg-slate-900 hover:text-white"
            }`}
          >
            <span className="font-medium tracking-wide">{item.label}</span>
            {isActive ? (
              <span className="h-2 w-2 rounded-full bg-amber-400" />
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
