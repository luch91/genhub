import { auth }                from "@/lib/auth"
import { LandingNavbar }      from "@/components/landing/navbar"
import { HeroSection }         from "@/components/landing/hero-section"
import { ProofStrip }          from "@/components/landing/proof-strip"
import { FeaturesSection }     from "@/components/landing/features-section"
import { HowItWorksSection }   from "@/components/landing/how-it-works"
import { ShowcaseSection }     from "@/components/landing/showcase-section"
import { FaqSection }          from "@/components/landing/faq-section"
import { CTABanner }           from "@/components/landing/cta-banner"
import { LandingFooter }       from "@/components/landing/landing-footer"

export default async function HomePage() {
  const session = await auth()
  const user = session?.user ?? null
  return (
    <>
      <LandingNavbar user={user} />
      <main id="main-content">
        <HeroSection />
        <ProofStrip />
        <FeaturesSection />
        <HowItWorksSection />
        <ShowcaseSection />
        <FaqSection />
        <CTABanner />
      </main>
      <LandingFooter />
    </>
  )
}
