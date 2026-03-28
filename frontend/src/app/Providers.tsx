"use client";

import { FilterProvider } from "@/context/FilterContext";
import { ThemeProvider } from "@/context/ThemeContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <FilterProvider>{children}</FilterProvider>
    </ThemeProvider>
  );
}
