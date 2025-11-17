"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  if (!mounted) {
    return (
      <button
        aria-label="Toggle theme"
        className="rounded-full border border-zinc-200/20 px-3 py-2 text-sm text-zinc-400 transition hover:border-zinc-500/50"
      >
        …
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex items-center gap-2 rounded-full border border-zinc-200/30 px-4 py-2 text-xs font-medium uppercase tracking-wide text-zinc-600 transition hover:border-teal-400/60 hover:text-teal-300 dark:border-zinc-700 dark:text-zinc-300"
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
      {isDark ? "Light" : "Dark"}
    </button>
  );
}
