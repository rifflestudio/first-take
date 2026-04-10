"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const NAV_ITEMS = [
  { href: "/queue", label: "queue" },
  { href: "/teams", label: "people" },
  { href: "/join", label: "sign up" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around px-6 md:hidden"
      style={{
        backgroundColor: isDark
          ? "rgba(21, 21, 22, 0.95)"
          : "rgba(244, 243, 241, 0.95)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(21,21,22,0.08)"}`,
        paddingTop: "12px",
        paddingBottom: "max(12px, env(safe-area-inset-bottom))",
      }}
    >
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center justify-center px-5 py-1"
            style={{
              fontFamily: "var(--font-triplex-1mm)",
              fontSize: "10px",
              fontWeight: 600,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: isActive
                ? "#d0ff54"
                : isDark
                  ? "rgba(255,255,255,0.40)"
                  : "rgba(21,21,22,0.40)",
              textDecoration: "none",
            }}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
