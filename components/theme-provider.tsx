"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { useBackButtonHandler } from "@/lib/useBackButton";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  useBackButtonHandler();
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
