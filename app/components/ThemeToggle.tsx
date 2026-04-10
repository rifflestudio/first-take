"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === "dark" : false;

  return (
    <button
      type="button"
      aria-pressed={isDark}
      aria-label="Toggle light and dark mode"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative flex flex-col items-center gap-2 transition-all",
        className
      )}
    >
      <Sun
        size={14}
        className={cn(
          "transition-colors",
          !isDark ? "text-primary" : "text-muted"
        )}
      />
      <span className="relative flex h-11 w-6 items-start justify-center rounded-full border border-soft bg-surface py-0.5">
        <span
          className={cn(
            "h-4 w-4 rounded-full transition-transform duration-200 ease-out"
          )}
          style={{
            backgroundColor: isDark
              ? "var(--accent-highlight)"
              : "var(--accent-deep)",
            transform: isDark ? "translateY(24px)" : "translateY(0)",
          }}
        />
      </span>
      <Moon
        size={14}
        className={cn("transition-colors", isDark ? "text-primary" : "text-muted")}
      />
    </button>
  );
}


