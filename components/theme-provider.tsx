"use client"

// implemented this fix for hydration error
// https://github.com/shadcn-ui/ui/issues/5552#issuecomment-2435053678
import * as React from "react"
import dynamic from "next/dynamic"
import { ThemeProvider as NextThemesProvider } from "next-themes"

const ThemesProvider = dynamic(
  () => import("next-themes").then((mod) => mod.ThemeProvider),
  { ssr: false }
)

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <ThemesProvider {...props}>{children}</ThemesProvider>
}
