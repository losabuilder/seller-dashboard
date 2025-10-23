"use client"

import * as React from "react"
import { OnchainKitProvider } from "@coinbase/onchainkit"
import { PrivyProvider } from "@privy-io/react-auth"
import { SmartWalletsProvider } from "@privy-io/react-auth/smart-wallets"
import { WagmiProvider } from "@privy-io/wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useTheme } from "next-themes"
import { baseSepolia } from "viem/chains"

import { hslToHex } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"
import { wagmiConfig } from "@/app/contracts/config/wagmi-config"

type ProviderProps = {
  children: React.ReactNode
}

// Separate component for Privy to access theme context
const PrivyProviderWithTheme = ({ children }: ProviderProps) => {
  const { theme: nextTheme } = useTheme()
  const [accentColor, setAccentColor] = React.useState<`#${string}`>("#000000")

  React.useEffect(() => {
    try {
      const root = window.document.documentElement
      const computedStyle = getComputedStyle(root)
      const accent = computedStyle.getPropertyValue("--primary").trim()

      // Parse HSL values
      const [h, s, l] = accent
        .split(" ")
        .map((v) => parseFloat(v.replace("%", "")))
      const hexColor = hslToHex(h, s, l)
      setAccentColor(hexColor)
    } catch (error) {
      console.error("Error setting accent color:", error)
    }
  }, []) // Only run once on mount since we're accessing DOM APIs

  // Map next-themes values to Privy theme values
  const privyTheme = nextTheme === "dark" ? "dark" : "light"

  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        loginMethods: ["email", "wallet", "farcaster", "google", "apple"],
        defaultChain: baseSepolia,
        supportedChains: [baseSepolia],
        embeddedWallets: {
          createOnLogin: "all-users",
          showWalletUIs: false,
        },
        appearance: {
          theme: privyTheme,
          accentColor: accentColor,
          showWalletLoginFirst: false,
        },
      }}
    >
      <SmartWalletsProvider>{children}</SmartWalletsProvider>
    </PrivyProvider>
  )
}

export function Providers({ children }: ProviderProps) {
  const [mounted, setMounted] = React.useState(false)

  const queryClient = new QueryClient()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Avoid hydration mismatch
  if (!mounted) {
    return (
      <ThemeProvider
        key="unmounted"
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <QueryClientProvider client={queryClient}>
          <WagmiProvider config={wagmiConfig}>
            <OnchainKitProvider
              apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
              chain={baseSepolia}
            >
              {children}
            </OnchainKitProvider>
          </WagmiProvider>
        </QueryClientProvider>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider
      key="mounted"
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <PrivyProviderWithTheme>
        <QueryClientProvider client={queryClient}>
          <WagmiProvider config={wagmiConfig}>
            <OnchainKitProvider
              apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
              chain={baseSepolia}
            >
              {children}
            </OnchainKitProvider>
          </WagmiProvider>
        </QueryClientProvider>
      </PrivyProviderWithTheme>
    </ThemeProvider>
  )
}
