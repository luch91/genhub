# GenHub Landing Page — Product Requirements Document

**Product:** GenHub — A Home for GenLayer Builders
**Tagline:** *A home for genlayer builders*
**Version:** 1.0
**Status:** Ready for Build
**Last Updated:** June 2026

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Design System Spec](#2-design-system-spec)
3. [Animation Spec](#3-animation-spec)
4. [Component Inventory](#4-component-inventory)
5. [Page Section Breakdown](#5-page-section-breakdown)
6. [Responsive Behavior](#6-responsive-behavior)
7. [Performance Constraints](#7-performance-constraints)
8. [Accessibility](#8-accessibility)
9. [Tech Stack Decisions](#9-tech-stack-decisions)
10. [Open Questions](#10-open-questions)

---

## 1. Executive Summary

### 1.1 Product Vision

GenHub is the central community hub for the GenLayer builder ecosystem. It is the place where developers, researchers, and contributors meet, share ideas, showcase projects, and collectively shape the future of GenLayer's Intelligent Contract infrastructure.

The landing page is not a marketing afterthought. It is the front door to an active, creative, technical community. It must immediately communicate three things:

- This is a serious builder community — not a hype site.
- This is warm, human, and creative — not a cold protocol dashboard.
- This is *alive* — projects are being submitted, upvoted, and discussed right now.

### 1.2 Target User

| Segment | Description | Primary Need |
|---|---|---|
| **Active GenLayer Builder** | Shipped at least one Intelligent Contract or ecosystem tool | A place to share work, get feedback, find collaborators |
| **Curious Developer** | Web3-native, heard of GenLayer, evaluating the ecosystem | Social proof, project showcase, low-friction entry point |
| **Ecosystem Researcher** | Tracks L1/L2 ecosystems, protocol adoption | Activity signals, builder quality, community health |
| **GenLayer Foundation** | Ecosystem stewards | Builder visibility, grant discovery, contribution tracking |

### 1.3 Core Value Proposition

> GenHub is where GenLayer builders meet, share ideas, submit projects for peer review, and get community recognition through upvotes. One place. All the builders. Real work.

### 1.4 Success Metrics (Landing Page)

| Metric | Target |
|---|---|
| Bounce rate | < 45% |
| Time on page | > 2 min |
| CTA click-through ("Join the Community") | > 12% |
| Project submissions in first 30 days | 25+ |
| Community sign-ups from landing | 500 in month 1 |

---

## 2. Design System Spec

### 2.1 Brand Foundation

The GenHub visual identity is derived directly from the mosaic portrait logo — a pixel-art human figure assembled from rounded square tiles. This tile motif is the central recurring design element across the entire page. Every color decision traces back to the logo's three zones.

### 2.2 Color Palette

```css
/* ── BRAND TOKENS ── */
:root {
  /* HEAD ZONE — Amber / Gold (energy, creativity, warmth) */
  --amber-200: #fde68a;
  --amber-400: #fbbf24;   /* PRIMARY BRAND AMBER */
  --amber-500: #f59e0b;

  /* FACE ZONE — Deep Navy (depth, intelligence, precision) */
  --navy-950: #1a1a2e;    /* NEAR-BLACK BASE */

  /* BODY ZONE — Indigo to Lavender (community, trust, tech) */
  --indigo-600: #4f46e5;  /* PRIMARY BRAND INDIGO */
  --indigo-500: #6366f1;
  --indigo-400: #818cf8;
  --indigo-300: #a5b4fc;
  --indigo-100: #e0e7ff;

  /* SURFACE */
  --cream:      #f5f0e8;  /* LIGHT MODE BASE */
  --deep-navy:  #0d0d18;  /* FOOTER / DARK SECTIONS */

  /* GLASS SURFACES */
  --glass-light:  rgba(255, 255, 255, 0.05);
  --glass-indigo: rgba(79, 70, 229, 0.08);
  --glass-amber:  rgba(251, 191, 36, 0.06);
  --glass-border: rgba(255, 255, 255, 0.12);
}
```

**Color usage rules:**
- Amber is reserved for: logo, highlights, "Most Popular" badge, CTA accents, light-source bleeds on glass surfaces. Never use amber as a background fill.
- Indigo-600 is the primary interactive color: buttons, links, active states, checkmarks.
- Cream is the base page background for all non-footer sections.
- Deep Navy is exclusively the footer and any dark-mode overlays.
- Navy-950 appears only in the logo face zone and as deep text color.

### 2.3 Typography

| Role | Font | Weight | Usage |
|---|---|---|---|
| Display | Unbounded | 900 | Hero headline, section mega-labels |
| UI Title | Syne | 700 | Section headings (H2, H3), navbar links |
| UI Regular | Syne | 400 | Subheadings, card titles |
| Body | DM Sans | 400 | Paragraphs, feature descriptions |
| Body Light | DM Sans | 300 | Captions, secondary text |
| Mono | Space Mono | 400/700 | Tags, labels, code snippets, step numbers |

**Type scale (desktop):**

```css
--text-hero:    clamp(48px, 7vw, 88px);   /* Hero headline */
--text-display: clamp(32px, 4vw, 52px);   /* Section titles */
--text-title:   clamp(20px, 2.5vw, 28px); /* Card headings */
--text-body:    18px;                      /* Paragraphs */
--text-small:   14px;                      /* Captions, labels */
--text-mono:    12px;                      /* Tags, badges */
```

**Google Fonts import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@900&family=Syne:wght@400;700&family=DM+Sans:wght@300;400&family=Space+Mono:wght@400;700&display=swap');
```

### 2.4 Spacing System

8px base grid. All spacing values must be multiples of 8.

```css
--space-1:   8px;
--space-2:  16px;
--space-3:  24px;
--space-4:  32px;
--space-6:  48px;
--space-8:  64px;
--space-10: 80px;
--space-15: 120px;  /* Section vertical padding — desktop */
--space-8:  64px;   /* Section vertical padding — mobile */
```

### 2.5 Border Radius

```css
--radius-tile:  4px;   /* Mosaic tiles */
--radius-badge: 6px;   /* Small badges */
--radius-card:  16px;  /* Feature cards, pricing cards */
--radius-pill:  50px;  /* Buttons, nav items, tags */
```

### 2.6 Chromatic Glass System

The glass aesthetic is **chromatic** — not standard frosted white. Light refracts through these surfaces like a prism, casting spectral color splits from the amber and indigo brand colors.

**Base glass card token:**
```css
.glass-card {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.06),
    rgba(79, 70, 229, 0.06)
  );
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: var(--radius-card);
  box-shadow:
    0 4px 24px rgba(79, 70, 229, 0.08),
    0 1px 0 rgba(255, 255, 255, 0.15) inset;
}
```

**Chromatic aberration edge effect:**
```css
.glass-card::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  background: linear-gradient(
    135deg,
    rgba(251, 191, 36, 0.15),   /* amber bleed — top-left */
    transparent 40%,
    rgba(79, 70, 229, 0.15)     /* indigo bleed — bottom-right */
  );
  z-index: -1;
}
```

**Amber light-source bleed (used in hero and CTA sections):**
```css
.amber-glow {
  background: radial-gradient(
    ellipse 600px 400px at 20% 50%,
    rgba(251, 191, 36, 0.12) 0%,
    transparent 70%
  );
}
```

### 2.7 Mosaic Tile Component

The mosaic tile is a reusable primitive used across icons, patterns, step nodes, and decorative elements.

```css
.tile {
  width: 20px;
  height: 20px;
  border-radius: var(--radius-tile);
  display: inline-block;
}

.tile-grid {
  display: grid;
  gap: 3px;
}

.tile-grid-3 { grid-template-columns: repeat(3, 20px); }
.tile-grid-5 { grid-template-columns: repeat(5, 20px); }
```

**Tile color variants:**
```css
.tile-amber    { background: #fbbf24; }
.tile-amber-lt { background: #fde68a; }
.tile-navy     { background: #1a1a2e; }
.tile-indigo   { background: #4f46e5; }
.tile-indigo-m { background: #6366f1; }
.tile-indigo-l { background: #818cf8; }
.tile-lavender { background: #a5b4fc; }
.tile-mist     { background: #e0e7ff; }
```

### 2.8 Component Library Choices & Rationale

| Library | Role | Rationale |
|---|---|---|
| **shadcn/ui** | Base component layer (Button, Card, Badge, Dialog, Avatar) | Headless, fully Tailwind-compatible, zero style conflict with custom glass system. Copy-paste model means no black-box overrides. |
| **Aceternity UI** | Hero effects: AuroraBackground, BackgroundBeams, SparklesCore | Pre-built GPU-accelerated canvas effects that would take weeks to build from scratch. AuroraBackground is a direct match for the chromatic drift requirement. |
| **Magic UI** | Marquee (social proof), ShimmerButton, AuroraText, SparklesText | Best-in-class animated text and scroll components, Tailwind-native, MIT licensed. |
| **Framer Motion** | All scroll-driven animations, page transitions, staggered reveals, tile assembles | Industry standard for React animation. useScroll + useTransform enables the glass parallax system. |
| **Tailwind CSS v3** | Utility styling | Speeds token application by 10x vs raw CSS. JIT mode ships zero unused styles. |

---

## 3. Animation Spec

All animations must respect `prefers-reduced-motion`. See Section 8 for fallback behavior.

| ID | Name | Trigger | Component | Duration | Easing | Library |
|---|---|---|---|---|---|---|
| A1 | **Mosaic Reveal** | Page load | Hero tile grid | 800ms total, 8ms/tile stagger | easeOut | Framer Motion |
| A2 | **Aurora Drift** | Continuous | Hero background | 12s loop | linear | Aceternity AuroraBackground |
| A3 | **Glass Parallax** | Scroll | Feature cards | Real-time (useScroll) | spring(80, 20) | Framer Motion |
| A4 | **Shimmer Tiles** | Hover | Any tile-grid element | 600ms sweep | easeInOut | Magic UI Shimmer |
| A5 | **Chromatic Edge Pulse** | Continuous | Section dividers, Pro card border | 4s loop | ease | CSS @keyframes |
| A6 | **Scroll Reveal** | Scroll into view | All section content | 500ms, 80ms stagger | easeOut | Framer Motion |
| A7 | **Nav Darken** | Scroll > 60px | Navbar | 300ms | ease | Framer Motion |
| A8 | **Dashed Path Draw** | Scroll into view | How It Works timeline | 1.2s | easeInOut | Framer Motion pathLength |
| A9 | **Floating Particles** | Continuous | CTA banner | 6–14s per particle, random | linear | Framer Motion |
| A10 | **Card Hover Scale** | Hover | Feature cards, member cards | 200ms | ease | CSS transform |

### 3.1 Mosaic Reveal Implementation (A1)

```tsx
// Hero tile grid — bottom-up cascade
const tiles = Array.from({ length: rows * cols }, (_, i) => i);

const tileVariants = {
  hidden: { opacity: 0, scale: 0.6 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: i * 0.008,        // 8ms per tile
      duration: 0.3,
      ease: "easeOut",
    },
  }),
};
```

### 3.2 Glass Parallax Implementation (A3)

```tsx
const { scrollYProgress } = useScroll();
const y = useTransform(scrollYProgress, [0, 1], [0, -40]);
const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.02]);

<motion.div style={{ y, scale }} className="glass-card">
  {/* feature content */}
</motion.div>
```

### 3.3 Chromatic Edge Pulse (A5)

```css
@keyframes chromatic-pulse {
  0%   { box-shadow: 0 0 0 1px rgba(79, 70, 229, 0.4); }
  33%  { box-shadow: 0 0 0 2px rgba(251, 191, 36, 0.4); }
  66%  { box-shadow: 0 0 0 2px rgba(165, 180, 252, 0.4); }
  100% { box-shadow: 0 0 0 1px rgba(79, 70, 229, 0.4); }
}

.chromatic-pulse {
  animation: chromatic-pulse 4s ease infinite;
}
```

---

## 4. Component Inventory

### 4.1 Shared / Global

| Component | Source | Notes |
|---|---|---|
| `<MosaicTile />` | Custom | Single tile primitive. Props: `color`, `size`, `animated` |
| `<TileGrid />` | Custom | Renders n×m mosaic grid. Props: `pattern`, `cols`, `rows`, `opacity` |
| `<GlassCard />` | Custom + shadcn Card | Applies chromatic glass tokens. Props: `glow?: 'amber' \| 'indigo'` |
| `<GlassButton />` | shadcn Button variant | Ghost glass style for secondary CTAs |
| `<PrimaryButton />` | shadcn Button | Indigo-600 fill, pill radius, hover glow |
| `<ChromaticBadge />` | Custom | Mosaic tile badge with Space Mono label |

### 4.2 Navbar

| Component | Source | Notes |
|---|---|---|
| `<NavBar />` | Custom | Sticky, scroll-aware, glass morphic |
| `<NavLogo />` | Custom SVG | Mosaic portrait mark, 40px height |
| `<NavLink />` | Custom | Syne 400, hover: indigo-400 underline |
| `<NavCTA />` | PrimaryButton | "Join the Community" |

### 4.3 Hero Section

| Component | Source | Notes |
|---|---|---|
| `<HeroSection />` | Custom layout | Full-viewport, position: relative |
| `<AuroraBackground />` | Aceternity UI | indigo + amber gradient mesh, 12s |
| `<HeroTileTexture />` | TileGrid | 10% opacity, absolute-positioned behind headline |
| `<HeroHeadline />` | Custom | Unbounded 900, AuroraText on "GenLayer Builders" |
| `<HeroSub />` | Custom | DM Sans 18px, indigo-300 |
| `<HeroMosaicFigure />` | Custom SVG + Framer | Animated tile-assemble on load (A1) |
| `<ScrollChevron />` | Custom | Animated bounce, links to #features |

### 4.4 Social Proof Strip

| Component | Source | Notes |
|---|---|---|
| `<ProofStrip />` | Custom layout | Glass pill container |
| `<Marquee />` | Magic UI | Infinite scroll, 30s duration, pauseOnHover |
| `<BuilderAvatar />` | shadcn Avatar | With amber glow ring on active state |
| `<ProofLabel />` | Custom | Space Mono, "X builders and counting" |

### 4.5 Features Section

| Component | Source | Notes |
|---|---|---|
| `<FeaturesSection />` | Custom layout | Max-width 1200px, centered |
| `<BentoGrid />` | Custom grid | CSS Grid, asymmetric: 2 large + 4 small |
| `<FeatureCard />` | GlassCard | Scroll reveal (A6), hover scale (A10), parallax (A3) |
| `<TileIcon />` | TileGrid 3×3 | Mosaic icon per feature in amber/indigo pattern |
| `<FeatureTitle />` | Custom | Syne 700, 20px |
| `<FeatureBody />` | Custom | DM Sans 400, 15px, indigo-600/70 |

**6 Feature Cards:**

| # | Title | Tile Icon Colors | Size |
|---|---|---|---|
| 1 | Submit Your Project | Amber + indigo | Large |
| 2 | Community Upvotes | Amber + amber-lt | Large |
| 3 | Builder Profiles | Indigo + lavender | Small |
| 4 | Idea Threads | Indigo + mist | Small |
| 5 | Peer Review Requests | Navy + indigo | Small |
| 6 | Ecosystem Missions | Amber + navy | Small |

### 4.6 How It Works

| Component | Source | Notes |
|---|---|---|
| `<HowItWorksSection />` | Custom layout | |
| `<StepTimeline />` | Custom | Horizontal desktop / vertical mobile |
| `<StepNode />` | TileGrid 3×3 | Color-coded mosaic cluster per step |
| `<StepConnector />` | Custom SVG | Animated dashed stroke (A8) |
| `<StepCard />` | GlassCard | Amber number badge, step title, description |
| `<AmberBadge />` | ChromaticBadge | "01", "02", "03" in Space Mono |

**3 Steps:**

| Step | Node Colors | Title | Description |
|---|---|---|---|
| 01 | Amber tiles | Join the Hub | Create your builder profile. Connect your wallet. Tell us what you're building. |
| 02 | Indigo tiles | Share Your Work | Submit a project, post an idea, or open a review request. The community is watching. |
| 03 | Amber + indigo mixed | Get Recognized | Community upvotes surface the best work. Top projects get ecosystem visibility and foundation attention. |

### 4.7 Community Showcase

| Component | Source | Notes |
|---|---|---|
| `<ShowcaseSection />` | Custom layout | |
| `<MasonryGrid />` | Custom CSS columns | 3-col desktop, 2-col tablet, 1-col mobile |
| `<MemberCard />` | GlassCard | Chromatic edge pulse on hover (A5) |
| `<MemberAvatar />` | shadcn Avatar | 48px, ring: indigo-300 |
| `<MemberName />` | Syne 700, 15px | |
| `<MemberRole />` | Space Mono, indigo-400 | e.g. "Intelligent Contract Builder" |
| `<ProjectTag />` | ChromaticBadge | Latest project submission tag |
| `<SectionTilePattern />` | TileGrid | Indigo at 8% opacity, absolute background |

### 4.8 Pricing

| Component | Source | Notes |
|---|---|---|
| `<PricingSection />` | Custom layout | 3-column flex, centered |
| `<PricingCard />` | GlassCard | |
| `<PricingCardPro />` | GlassCard | Amber-gold border glow (chromatic pulse A5) |
| `<MostPopularBadge />` | TileGrid 2×2 | Mosaic-styled badge: "Most Popular" |
| `<PriceDisplay />` | Custom | Unbounded 900, large |
| `<FeatureList />` | Custom list | Indigo checkmark SVG, DM Sans 400 |
| `<PricingCTA />` | PrimaryButton / GlassButton | Per tier |

**3 Tiers:**

| Tier | Price | Border | CTA |
|---|---|---|---|
| Free | $0 | Glass standard | "Get Started" (glass) |
| Pro | $X/mo | Amber-gold chromatic glow | "Join Pro" (indigo filled) |
| Enterprise | Custom | Glass standard + indigo tint | "Contact Us" (glass) |

### 4.9 CTA Banner

| Component | Source | Notes |
|---|---|---|
| `<CTABanner />` | Custom layout | Full-width, aurora background |
| `<AuroraBackground />` | Aceternity UI | Reused, amber-dominant for warmth |
| `<FloatingTiles />` | Custom | Randomized mosaic tiles drifting (A9) |
| `<CTAHeadline />` | Unbounded 900 | "Ready to Build in Public?" |
| `<CTAButton />` | PrimaryButton | "Join the Community" |

### 4.10 Footer

| Component | Source | Notes |
|---|---|---|
| `<Footer />` | Custom layout | Background: deep-navy #0d0d18 |
| `<FooterTileStrip />` | TileGrid | Decorative 1-row strip at top edge, indigo/amber tiles |
| `<FooterLogo />` | NavLogo | White-adjusted version |
| `<FooterNav />` | Custom | 4 columns: Product, Community, Ecosystem, Legal |
| `<SocialIcons />` | Custom SVGs | Twitter/X, GitHub, Discord, Farcaster |
| `<FooterTagline />` | DM Sans 300 | "A home for GenLayer builders." indigo-300 |

---

## 5. Page Section Breakdown

### 5.1 Navbar

**Purpose:** Persistent orientation and primary conversion entry.

| Element | Content | Interaction |
|---|---|---|
| Logo | GenHub mosaic SVG mark | Click → scroll to top |
| Nav links | Features · How It Works · Community · Pricing | Click → smooth scroll to section |
| CTA | "Join the Community" | Click → sign-up / auth flow |
| Scroll behavior | Glass tint shifts from `rgba(245,240,232,0.4)` to `rgba(245,240,232,0.85)` at 60px scroll | Framer Motion (A7) |

**Z-index:** 100. Must sit above aurora canvas and all section content.

---

### 5.2 Hero Section

**Purpose:** Immediate brand impression + dual conversion path.

**Content:**
- Pre-headline: `Space Mono · GENLAYER BUILDERS HUB` (amber, 11px, letter-spaced)
- Headline: `A Home for GenLayer Builders` — AuroraText shimmer on "GenLayer Builders"
- Subheadline: `Meet the builders shaping the future of Intelligent Contracts. Share projects. Get upvoted. Build in public.`
- CTA Primary: `Join the Community` → auth/sign-up
- CTA Secondary: `Explore Projects` → scroll to showcase
- Hero asset: Animated mosaic portrait figure (tile assemble, A1)
- Background: AuroraBackground (indigo 60% + amber 30% + lavender 10%)
- Texture: TileGrid at 10% opacity behind headline

**Layout:** Two-column on desktop (text left, mosaic figure right). Single column on mobile (text above, figure below, figure scales to 60%).

---

### 5.3 Social Proof Strip

**Purpose:** Rapid trust signal. Show real community activity.

**Content:**
- Label: `Trusted by X GenLayer builders`
- Marquee: 12–16 builder avatars + GitHub handles, slow rightward scroll
- Item: `[Avatar] @handle · Project Name`
- Active item: amber glow ring on avatar

**Background:** Glass pill, `rgba(255,255,255,0.06)` on cream base.

---

### 5.4 Features Section

**Purpose:** Communicate the six core platform capabilities without a bulleted list.

**Layout:** CSS Grid `bento` pattern.
```
[ Large card 1    ][ Small card 3 ][ Small card 4 ]
[ Large card 2    ][ Small card 5 ][ Small card 6 ]
```

Each card entrance: scroll-triggered stagger (A6), 80ms delay per card.

**Section header:**
- Pre-label: `Space Mono · WHAT YOU CAN DO HERE`
- Title: `Built for Builders. By Builders.`
- Body: `Everything you need to share your work, find collaborators, and move the GenLayer ecosystem forward.`

---

### 5.5 How It Works

**Purpose:** Reduce friction for first-time visitors. Explain the core loop in 3 steps.

**Layout:** Horizontal timeline on ≥ 768px. Vertical stacked on mobile.

**Animation sequence:**
1. Section enters viewport → Step 1 card reveals (A6)
2. 400ms delay → dashed connector path draws (A8)
3. 400ms delay → Step 2 card reveals
4. Repeat for Step 3

**Section header:**
- Pre-label: `Space Mono · THE LOOP`
- Title: `How GenHub Works`

---

### 5.6 Community Showcase

**Purpose:** Social proof through actual member work. Make the community feel real and active.

**Content per card:**
- Builder avatar (48px)
- Builder name (Syne 700)
- Role tag (Space Mono, e.g. "Intelligent Contract Dev")
- Latest project title
- Project upvote count (indigo pill)
- Date submitted

**Background:** Subtle mosaic TileGrid (indigo, 8% opacity) as absolute-positioned section bg.

**Section header:**
- Pre-label: `Space Mono · WHO'S BUILDING`
- Title: `Meet the GenLayer Builder Community`
- Sub: `Real projects. Real builders. All building in public.`

---

### 5.7 Pricing

**Purpose:** Convert passive visitors to committed community members.

**Note:** If GenHub is fully free, this section becomes "Community Tiers" (Free / Contributor / Verified Builder) based on engagement level, not payment. Confirm in Open Questions.

**Section header:**
- Pre-label: `Space Mono · PLANS`
- Title: `Pick Your Builder Level`

---

### 5.8 CTA Banner

**Purpose:** Final conversion moment for users who scrolled through the full page.

**Content:**
- Headline: `Ready to Build in Public?`
- Sub: `Join hundreds of GenLayer builders sharing work, getting feedback, and shaping the ecosystem.`
- CTA: `Join the Community` (large, indigo, pill)
- Background: Aurora (amber-dominant warmth, A2)
- Floating mosaic tile particles drift slowly (A9)

---

### 5.9 Footer

**Purpose:** Navigation, trust signals, and ecosystem anchoring.

**Nav columns:**

| Column | Links |
|---|---|
| Product | Features · How It Works · Pricing · Changelog |
| Community | Submit a Project · Browse Projects · Builder Profiles · Upvote Board |
| Ecosystem | GenLayer Docs · Shipyard · GenScope · Foundation |
| Legal | Privacy Policy · Terms · Cookie Policy |

**Social:** Twitter/X · GitHub · Discord · Farcaster

---

## 6. Responsive Behavior

### 6.1 Breakpoints

```css
/* Tailwind custom breakpoints */
screens: {
  'sm':  '480px',   /* Large mobile */
  'md':  '768px',   /* Tablet */
  'lg':  '1024px',  /* Desktop */
  'xl':  '1280px',  /* Wide desktop */
  '2xl': '1536px',  /* Ultra wide */
}
```

### 6.2 Section-by-Section Responsive Rules

| Section | Desktop (≥ 1024px) | Tablet (768–1023px) | Mobile (< 768px) |
|---|---|---|---|
| Navbar | Full links + CTA | Links hidden → hamburger menu | Hamburger menu, logo centered |
| Hero | 2-column (text + figure) | 2-column, figure smaller | 1-column, figure 60% width below text |
| Proof Strip | Marquee full width | Marquee full width | Marquee full width, smaller avatars |
| Features | Bento 3-col grid | 2-col grid | 1-col stacked |
| How It Works | Horizontal timeline | Horizontal timeline | Vertical stacked |
| Showcase | 3-col masonry | 2-col masonry | 1-col |
| Pricing | 3-col flex | 3-col flex (compressed) | 1-col stacked, Pro first |
| CTA Banner | Full-width, large type | Full-width, medium type | Full-width, type scales down |
| Footer | 4-col nav grid | 2-col nav grid | 1-col stacked |

### 6.3 Typography Scaling

All display text uses `clamp()` — never fixed px on mobile.

```css
.hero-headline {
  font-size: clamp(36px, 7vw, 88px);
  line-height: 1.05;
  letter-spacing: -0.03em;
}

.section-title {
  font-size: clamp(28px, 4vw, 52px);
  line-height: 1.1;
}
```

### 6.4 Animation Behavior on Mobile

- Mosaic Reveal (A1): Tile count reduced to 50% on mobile (performance). Bottom-up cascade preserved.
- Glass Parallax (A3): Disabled on mobile. Cards appear static.
- Aurora Drift (A2): Canvas size reduced on mobile, animation continues.
- Floating Particles (A9): Particle count halved on mobile.

---

## 7. Performance Constraints

### 7.1 Core Web Vitals Targets

| Metric | Target | Notes |
|---|---|---|
| LCP (Largest Contentful Paint) | < 2.5s | Hero headline is LCP candidate — preload Unbounded font |
| FID / INP | < 100ms | Avoid heavy JS on main thread during aurora init |
| CLS (Cumulative Layout Shift) | < 0.1 | Reserve space for mosaic figure before tiles render |
| FCP (First Contentful Paint) | < 1.5s | Navbar + above-fold text must render in first paint |

### 7.2 Animation Budget

| Zone | Budget | Rule |
|---|---|---|
| Above fold (Hero) | 16ms/frame max | Aurora runs on canvas, not DOM |
| Scroll animations | 16ms/frame | Use CSS transform/opacity only — no layout-triggering props |
| Hover effects | < 8ms | CSS-only where possible (shimmer, scale, glow) |
| Total JS animation threads | Max 2 concurrent | Aurora + one Framer Motion instance |

### 7.3 Asset Rules

- Mosaic logo SVG: inline in `<head>` as `<symbol>` — zero HTTP request.
- Fonts: preload critical weights (Unbounded 900, DM Sans 400) in `<head>`.
- Aurora canvas: lazy-init. Only mount after `document.readyState === 'complete'`.
- Member avatars: lazy-load with `loading="lazy"` + blur placeholder.
- All section content below fold: use Framer Motion `LazyMotion` with `domAnimation` features bundle only.

```tsx
// Lazy load Framer features
import { LazyMotion, domAnimation } from "framer-motion";

<LazyMotion features={domAnimation}>
  {/* All animated content */}
</LazyMotion>
```

### 7.4 Bundle Size Rules

| Library | Max size (gzipped) | Strategy |
|---|---|---|
| Framer Motion | ~45KB | Import `domAnimation` only, not full `dom` |
| Aceternity UI | Per-component | Copy-paste model — only import used components |
| Magic UI | Per-component | Same — no global import |
| shadcn/ui | Per-component | Same |

---

## 8. Accessibility

### 8.1 Reduced Motion

Every animation must check `prefers-reduced-motion: reduce`. Provide static fallbacks.

```tsx
// Global hook
const prefersReduced = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

// Usage in Framer Motion
const animProps = prefersReduced
  ? {}
  : { initial: "hidden", animate: "visible", variants };
```

| Animation | Reduced-Motion Fallback |
|---|---|
| Mosaic Reveal (A1) | Tiles appear instantly, no stagger |
| Aurora Drift (A2) | Static gradient background, no animation |
| Glass Parallax (A3) | Cards render static |
| Shimmer Tiles (A4) | Hover shows mild opacity change only |
| Chromatic Pulse (A5) | Static indigo border, no animation |
| Dashed Path Draw (A8) | Path appears fully drawn immediately |
| Floating Particles (A9) | No particles |

### 8.2 Contrast Ratios

All text must meet WCAG 2.1 AA (4.5:1 for body text, 3:1 for large text).

| Text color | Background | Ratio | Pass? |
|---|---|---|---|
| `#1a1a2e` on `#f5f0e8` | Navy on cream | 14.2:1 | ✅ AAA |
| `#4f46e5` on `#f5f0e8` | Indigo on cream | 5.1:1 | ✅ AA |
| `#ffffff` on `#4f46e5` | White on indigo button | 5.8:1 | ✅ AA |
| `#a5b4fc` on `#0d0d18` | Lavender on deep navy | 7.3:1 | ✅ AAA |
| `#fbbf24` on `#0d0d18` | Amber on deep navy | 8.9:1 | ✅ AAA |
| ⚠️ `#fbbf24` on `#f5f0e8` | Amber on cream | 2.1:1 | ❌ — Never use amber for text on cream |

**Rule:** Amber is never used as body text. Amber-on-cream fails contrast. Amber is decoration, icons, borders, and glows only.

### 8.3 Semantic HTML & ARIA

| Element | Implementation |
|---|---|
| Page landmark | `<main>`, `<nav>`, `<footer>` — explicit landmarks |
| Hero headline | `<h1>` — one per page |
| Section headings | `<h2>` per section, `<h3>` for card titles |
| Mosaic tile decorations | `aria-hidden="true"` on all decorative TileGrid instances |
| Marquee | `aria-label="Community members"`, `role="marquee"` |
| Pricing cards | `role="group"` with `aria-label="Free plan"` etc. |
| CTA buttons | Descriptive `aria-label` — not just "Join" |
| Aurora canvas | `aria-hidden="true"` |

### 8.4 Keyboard Navigation

- All interactive elements reachable via Tab in logical order.
- Focus rings: `outline: 2px solid #4f46e5; outline-offset: 3px` — visible on all backgrounds.
- Hamburger menu: fully keyboard operable with Escape to close.
- Skip link: `<a href="#main-content" className="sr-only focus:not-sr-only">` at top of DOM.

---

## 9. Tech Stack Decisions

### 9.1 Framework: Next.js 14 (App Router)

**Why Next.js 14:**
- App Router enables React Server Components — navbar, footer, and static sections render server-side, dramatically improving LCP.
- Built-in image optimization (`next/image`) handles all builder avatars with automatic WebP conversion and lazy loading.
- Font optimization (`next/font`) for Google Fonts — inlined CSS, no flash of unstyled text, preloaded automatically.
- Edge-ready — GenHub can deploy to Vercel Edge Network with zero config for global performance.

**Why App Router specifically:**
- Streaming HTML allows the hero to render progressively while below-fold data (projects, members) loads.
- Layout system enables persistent navbar without re-mounting on navigation.

### 9.2 Styling: Tailwind CSS v3

**Why Tailwind:**
- Design tokens (colors, spacing, radius) map 1:1 to CSS variables defined in Section 2.
- JIT mode ensures zero dead CSS in production.
- `tailwind.config.js` extends the default theme with GenHub's exact color palette — no manual color string duplication.

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          amber:    '#fbbf24',
          'amber-lt': '#fde68a',
          indigo:   '#4f46e5',
          navy:     '#1a1a2e',
          cream:    '#f5f0e8',
          'deep-navy': '#0d0d18',
        }
      },
      fontFamily: {
        display: ['Unbounded', 'sans-serif'],
        ui:      ['Syne', 'sans-serif'],
        body:    ['DM Sans', 'sans-serif'],
        mono:    ['Space Mono', 'monospace'],
      },
      borderRadius: {
        tile: '4px',
        card: '16px',
        pill: '50px',
      }
    }
  }
}
```

### 9.3 Animation: Framer Motion

**Why Framer Motion over GSAP:**
- Native React integration — no imperative DOM manipulation, no `useEffect` ref gymnastics.
- `useScroll` + `useTransform` is the cleanest API for scroll-driven glass parallax.
- `LazyMotion` with `domAnimation` keeps the bundle tight (~45KB gzipped vs GSAP's ~60KB+).
- `AnimatePresence` handles page transition exits cleanly with App Router.

### 9.4 Hero Effects: Aceternity UI

**Why Aceternity UI:**
- `AuroraBackground` is a GPU-accelerated canvas implementation — not CSS gradients. This is critical for the multi-color drift effect (12s loop) not causing paint recalculations.
- `BackgroundBeams` and `SparklesCore` are copy-paste components — no package lock-in, full customization.
- MIT licensed for commercial use.

### 9.5 Motion Components: Magic UI

**Why Magic UI for Marquee + Shimmer:**
- `<Marquee />` is the most performant marquee implementation available — CSS animation only, no JS scroll polling.
- `<AuroraText />` + `<ShimmerButton />` are polished, Tailwind-native, and take < 30 minutes to integrate.
- Magic UI Pro has 50+ additional blocks if GenHub needs to expand quickly.

### 9.6 Component Base: shadcn/ui

**Why shadcn/ui over Radix directly or Chakra:**
- Copy-paste model means components live in `/components/ui` — full ownership, no version conflicts.
- Radix primitives underneath ensure accessibility (dialogs, dropdowns, tooltips) without custom ARIA work.
- Zero style opinions — the chromatic glass system applies cleanly with no overrides needed.

---

## 10. Open Questions

These decisions must be resolved before development begins.

| # | Question | Owner | Impact if Unresolved |
|---|---|---|---|
| Q1 | **Is GenHub free?** Is there a paid tier, or is it contribution-based (Free / Contributor / Verified)? | Product | Determines entire Pricing section content and CTA copy |
| Q2 | **Auth provider?** Wallet-only (RainbowKit), social login, or both? | Engineering | Affects CTA flow — "Connect Wallet" vs "Sign Up" |
| Q3 | **Real data on launch?** Will the Community Showcase show real builders at launch, or placeholder data? | Content | Affects masonry grid design and fallback states |
| Q4 | **Project submission flow** — does it live on GenHub or link to an external form/repo? | Product | Affects CTA destinations and section copy |
| Q5 | **Upvote mechanic** — is upvoting wallet-gated, email-gated, or open? | Product | Affects trust and social proof copy |
| Q6 | **App name confirmed?** "GenHub" is assumed from brief. Is this finalized? | Brand | Affects all copy, domain, OG meta |
| Q7 | **Mobile-first or desktop-first?** Given builder audience, likely desktop-dominant. Confirm analytics assumption. | Product | Affects breakpoint priority in development |
| Q8 | **CMS for community members?** Are member cards static (hardcoded) or pulled from a CMS/API at build time? | Engineering | Affects whether `next/image` remote patterns need configuring |
| Q9 | **Pricing numbers** — if paid tier exists, are prices confirmed? | Product | Pricing section cannot be built without this |
| Q10 | **OG image and favicon** — will the mosaic portrait mark be the favicon, or a wordmark version? | Brand | Needed before any deployment |

---

## Appendix A: File Structure

```
/app
  layout.tsx          ← Fonts, metadata, navbar, footer
  page.tsx            ← Landing page (all sections)
  globals.css         ← CSS variables, glass tokens, animations

/components
  /ui                 ← shadcn/ui primitives (Button, Card, Avatar, Badge)
  /brand
    MosaicTile.tsx
    TileGrid.tsx
    GlassCard.tsx
    MosaicFigure.tsx
  /sections
    NavBar.tsx
    HeroSection.tsx
    ProofStrip.tsx
    FeaturesSection.tsx
    HowItWorks.tsx
    ShowcaseSection.tsx
    PricingSection.tsx
    CTABanner.tsx
    Footer.tsx
  /motion
    ScrollReveal.tsx   ← Reusable scroll-triggered reveal wrapper
    FloatingTiles.tsx  ← CTA banner particle system

/lib
  animations.ts       ← Shared Framer Motion variants
  tokens.ts           ← Design token constants (TS version of CSS vars)
```

## Appendix B: OG & SEO Meta

```tsx
// app/layout.tsx
export const metadata = {
  title: "GenHub — A Home for GenLayer Builders",
  description:
    "The central community hub for GenLayer builders. Share projects, get upvoted, find collaborators, and shape the future of Intelligent Contracts.",
  openGraph: {
    title: "GenHub",
    description: "A home for GenLayer builders.",
    url: "https://genhub.xyz",
    siteName: "GenHub",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GenHub — A Home for GenLayer Builders",
    description: "Share. Upvote. Build in public.",
    images: ["/og-image.png"],
  },
};
```

---

*Document prepared for GenHub v1.0 landing page build. All design decisions are intentional, traceable to the brand identity, and defensible in design review.*
