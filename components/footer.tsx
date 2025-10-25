"use client"

import * as React from "react"
import Link from "next/link"

import { ThemeToggle } from "@/components/theme-toggle"

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row md:py-0">
          <div className="flex items-center gap-4 md:flex-row md:gap-6">
            <p className="text-muted-foreground text-center text-sm leading-loose md:text-left">
              Built with <span className="text-red-500">❤️</span>
            </p>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  )
}
