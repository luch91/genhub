import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { Providers } from "./providers"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { LenisProvider } from "@/providers/lenis-provider"
import { SoundToggle } from "@/components/landing/sound-toggle"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: {
    default: "GenHub",
    template: "%s | GenHub",
  },
  description:
    "The quality-gated home for GenLayer builders. Submit Intelligent Contract projects, build in public, and connect with the community.",
  openGraph: {
    title: "GenHub",
    description:
      "The quality-gated home for GenLayer builders. Submit Intelligent Contract projects, build in public, and connect with the community.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="flex min-h-screen flex-col">
        <Providers>
          <LenisProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <SoundToggle />
          </LenisProvider>
        </Providers>
      </body>
    </html>
  )
}
