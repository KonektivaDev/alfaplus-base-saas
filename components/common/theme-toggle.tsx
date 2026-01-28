"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Switch } from "../ui/switch";
import { MoonIcon, SunIcon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || theme === undefined) {
    return null;
  }

  const isDark = theme === "dark";

  return (
    <div className="flex items-center gap-2">
      {isDark ? (
        <MoonIcon
          size={16}
          className="transition-opacity"
          aria-hidden="true"
        />
      ) : (
        <SunIcon
          size={16}
          className="transition-opacity"
          aria-hidden="true"
        />
      )}
      <Switch
        checked={isDark}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        aria-label="Przełącz motyw"
      />
    </div>
  );
}