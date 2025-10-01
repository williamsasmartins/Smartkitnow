// src/components/ThemeProvider.tsx
import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

type Props = {
  children: React.ReactNode;
  /** use "class" para Tailwind darkMode:'class' */
  attribute?: "class" | "data-theme";
  /** "system" mantém claro/escuro do SO como padrão */
  defaultTheme?: "light" | "dark" | "system";
  /** evita FOUC em SSR / hidratação */
  enableSystem?: boolean;
  /** chave de storage para persistir preferências */
  storageKey?: string;
};

export function ThemeProvider({
  children,
  attribute = "class",
  defaultTheme = "system",
  enableSystem = true,
  storageKey = "skn-theme",
}: Props) {
  return (
    <NextThemesProvider
      attribute={attribute}
      defaultTheme={defaultTheme}
      enableSystem={enableSystem}
      storageKey={storageKey}
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
