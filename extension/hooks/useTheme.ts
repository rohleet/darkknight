import { useEffect, useState } from "react";

export type Theme = "dark" | "light";

const STORAGE_KEY = "pg-theme";

/**
 * Applies the theme as a data-theme attribute on <body> (styles/tokens.css
 * reads this) and keeps it in state. Persisting to chrome.storage.local is
 * a follow-up — for now it just resets to `defaultTheme` on each mount.
 */
export function useTheme(defaultTheme: Theme = "dark") {
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return { theme, setTheme, toggleTheme };
}

export { STORAGE_KEY };
