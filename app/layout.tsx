import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

// can't import css until they update to tailwind v4
import "@coinbase/onchainkit/styles.css"
import "./globals.css"

import { Toaster } from "@/components/ui/sonner"
import { Footer } from "@/components/footer"
import { MainNav } from "@/components/navigation/main-nav"
import { Providers } from "@/components/providers"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Losa",
  description: "Seller dashboard for Losa",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}
      >
        <Providers>
          <header className="border-b">
            <MainNav />
          </header>
          <main className="container mx-auto flex-1 px-4">{children}</main>
          <Footer />
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
