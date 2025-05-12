"use client";
import { useEffect, useState } from "react";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<string | null>(null);

  useEffect(() => {
    // Всё, что связано с window/localStorage — только на клиенте
    let initial = "light";
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      initial = saved || (prefersDark ? "dark" : "light");
      document.documentElement.setAttribute("data-theme", initial);
    }
    setTheme(initial);
  }, []);

  useEffect(() => {
    if (theme && typeof window !== "undefined") {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

import { createContext } from "react";
export const ThemeContext = createContext<{ theme: string | null; setTheme: (t: string) => void }>({ theme: null, setTheme: () => {} }); 