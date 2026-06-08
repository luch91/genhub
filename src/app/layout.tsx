import type { Metadata } from "next"
import { Inter, JetBrains_Mono, Unbounded, Syne, DM_Sans, Space_Mono } from "next/font/google"
import { Providers } from "./providers"
import { LenisProvider } from "@/providers/lenis-provider"
import { ConditionalShell } from "@/components/layout/conditional-shell"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { SoundToggle } from "@/components/landing/sound-toggle"
import { PresencePing } from "@/components/layout/presence-ping"
import "./globals.css"

const inter        = Inter({ subsets: ["latin"], variable: "--font-inter" })
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" })
const unbounded    = Unbounded({ subsets: ["latin"], weight: ["900"], variable: "--font-unbounded" })
const syne         = Syne({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-syne" })
const dmSans       = DM_Sans({ subsets: ["latin"], weight: ["300", "400"], variable: "--font-dm-sans" })
const spaceMono    = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-space-mono" })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default: "GenHub — A Home for GenLayer Builders",
    template: "%s | GenHub",
  },
  description:
    "The central community hub for GenLayer builders. Share projects, get upvoted, find collaborators, and shape the future of Intelligent Contracts.",
  openGraph: {
    title: "GenHub — A Home for GenLayer Builders",
    description: "A home for GenLayer builders.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GenHub — A Home for GenLayer Builders",
    description: "A home for GenLayer builders.",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const fontVars = [
    inter.variable,
    jetbrainsMono.variable,
    unbounded.variable,
    syne.variable,
    dmSans.variable,
    spaceMono.variable,
  ].join(" ")

  return (
    <html lang="en" className={fontVars}>
      <body>
        <Providers>
          <PresencePing />
          <LenisProvider>
            <ConditionalShell
              header={<Header />}
              footer={<Footer />}
              soundToggle={<SoundToggle />}
            >
              {children}
            </ConditionalShell>
          </LenisProvider>
        </Providers>
      </body>
    </html>
  )
}
