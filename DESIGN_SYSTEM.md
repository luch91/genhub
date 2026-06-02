# GenHub Design System

> Version 1.0 — covers all app-shell pages and components. The landing page (`/`) uses the separate cyber-minimalist aesthetic defined in `src/components/landing/`.

---

## Table of Contents

1. [Design Principles](#1-design-principles)
2. [Color System](#2-color-system)
3. [Typography](#3-typography)
4. [Spacing](#4-spacing)
5. [Elevation & Shadows](#5-elevation--shadows)
6. [Border Radius](#6-border-radius)
7. [Motion & Transitions](#7-motion--transitions)
8. [Design Tokens](#8-design-tokens)
9. [Component Library](#9-component-library)
10. [Page Layouts](#10-page-layouts)
11. [Interaction Patterns](#11-interaction-patterns)
12. [Responsive Breakpoints](#12-responsive-breakpoints)
13. [Visual Style Guide](#13-visual-style-guide)
14. [Accessibility](#14-accessibility)

---

## 1. Design Principles

**Precise.** Information density is high — builders are technical. Every element earns its space.

**Trustworthy.** The review gate and reputation system make quality the promise. The UI reinforces that with clear states, honest feedback, and no dark patterns.

**Alive.** Activity feeds, live stats, build logs, and notifications make the platform feel like a place where things happen, not a static directory.

**Minimal decoration.** Decoration comes from content — project covers, avatars, code snippets — not ornamental UI flourishes.

---

## 2. Color System

### 2.1 Raw Palette

```
Space:      #050505   — landing page only
Gray-950:   #080B14
Gray-900:   #0D1117   ← primary background
Gray-850:   #111827
Gray-800:   #161B22   ← card/surface background
Gray-750:   #1C2128
Gray-700:   #21262D   ← borders
Gray-600:   #30363D
Gray-500:   #484F58
Gray-400:   #8B949E   ← secondary text
Gray-300:   #B1BAC4
Gray-200:   #C9D1D9
Gray-100:   #E6EDF3   ← primary text

Violet-950: #1C0A46
Violet-900: #2E1065
Violet-700: #6D28D9
Violet-600: #7C3AED   ← primary interactive
Violet-500: #8B5CF6   ← primary hover
Violet-400: #A78BFA
Violet-300: #C4B5FD

Emerald-950: #022C22
Emerald-900: #064E3B
Emerald-700: #047857
Emerald-600: #059669
Emerald-500: #10B981  ← success
Emerald-400: #34D399

Red-950:    #450A0A
Red-900:    #7F1D1D
Red-700:    #B91C1C
Red-600:    #DC2626
Red-500:    #EF4444   ← danger
Red-400:    #F87171

Amber-950:  #451A03
Amber-900:  #78350F
Amber-600:  #D97706
Amber-500:  #F59E0B   ← warning
Amber-400:  #FBBF24

Cyan-600:   #0891B2
Cyan-500:   #06B6D4   ← info / breakthrough
Cyan-400:   #22D3EE
Cyan-300:   #67E8F9
```

### 2.2 Semantic Color Mapping

#### Surfaces
| Token | Value | Usage |
|-------|-------|-------|
| `--bg-base` | `#0D1117` | Page background |
| `--bg-surface` | `#161B22` | Cards, panels |
| `--bg-elevated` | `#1C2128` | Dropdowns, modals, popovers |
| `--bg-overlay` | `rgba(13,17,23,0.80)` | Modal scrims |
| `--bg-inset` | `#111827` | Code blocks, terminal areas, inset wells |

#### Borders
| Token | Value | Usage |
|-------|-------|-------|
| `--border-subtle` | `rgba(255,255,255,0.05)` | Very subtle dividers |
| `--border-default` | `rgba(255,255,255,0.08)` | Card borders, section dividers |
| `--border-emphasis` | `rgba(255,255,255,0.14)` | Focused inputs, highlighted cards |
| `--border-strong` | `rgba(255,255,255,0.20)` | Active selection borders |

#### Text
| Token | Value | Usage |
|-------|-------|-------|
| `--text-primary` | `#E6EDF3` | Headings, primary content |
| `--text-secondary` | `#8B949E` | Supporting content, labels |
| `--text-tertiary` | `#484F58` | Timestamps, hints, disabled |
| `--text-disabled` | `#30363D` | Truly disabled, placeholder |
| `--text-link` | `#A78BFA` | Inline links |
| `--text-link-hover` | `#C4B5FD` | Link hover |
| `--text-inverse` | `#0D1117` | Text on light backgrounds |
| `--text-on-primary` | `#FFFFFF` | Text on violet buttons |

#### Interactive (Primary)
| Token | Value | Usage |
|-------|-------|-------|
| `--interactive-primary` | `#7C3AED` | Primary buttons, CTA |
| `--interactive-primary-hover` | `#8B5CF6` | Hover |
| `--interactive-primary-active` | `#6D28D9` | Active/pressed |
| `--interactive-primary-subtle` | `rgba(124,58,237,0.12)` | Subtle highlight areas |
| `--interactive-primary-border` | `rgba(124,58,237,0.30)` | Focus rings, highlighted borders |

#### Status Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--status-success` | `#10B981` | Published, approved, on-chain verified |
| `--status-success-subtle` | `rgba(16,185,129,0.12)` | Background tint |
| `--status-success-border` | `rgba(16,185,129,0.25)` | Border tint |
| `--status-warning` | `#F59E0B` | Pending review, blocker updates |
| `--status-warning-subtle` | `rgba(245,158,11,0.12)` | Background tint |
| `--status-warning-border` | `rgba(245,158,11,0.25)` | Border tint |
| `--status-danger` | `#EF4444` | Rejected, error states |
| `--status-danger-subtle` | `rgba(239,68,68,0.12)` | Background tint |
| `--status-danger-border` | `rgba(239,68,68,0.25)` | Border tint |
| `--status-info` | `#06B6D4` | Breakthrough updates, informational |
| `--status-info-subtle` | `rgba(6,182,212,0.12)` | Background tint |
| `--status-info-border` | `rgba(6,182,212,0.25)` | Border tint |
| `--status-neutral` | `#484F58` | General/draft/archived |
| `--status-neutral-subtle` | `rgba(72,79,88,0.20)` | Background tint |

### 2.3 Update Type → Color Mapping

| Update Type | Badge Background | Badge Text | Icon |
|-------------|-----------------|------------|------|
| Milestone | `violet-900/50` | `violet-300` | 🎯 |
| Blocker | `red-900/50` | `red-300` | 🔴 |
| Breakthrough | `emerald-900/50` | `emerald-300` | 💡 |
| General | `gray-800` | `gray-400` | 📝 |

### 2.4 Project Status → Color Mapping

| Status | Badge Style | Description |
|--------|-------------|-------------|
| DRAFT | gray border, gray text | Not yet submitted |
| PENDING_REVIEW | amber border, amber text | Awaiting community review |
| PUBLISHED | emerald border, emerald text | Live in gallery |
| ARCHIVED | gray/dim, strikethrough-ish | Removed from gallery |

### 2.5 Discussion Category → Color Mapping

| Category | Pill Background | Pill Text |
|----------|-----------------|-----------|
| General | `gray-800` | `gray-400` |
| Help | `blue-900/50` | `blue-300` |
| Ideas | `amber-900/50` | `amber-300` |
| Showcase | `violet-900/50` | `violet-300` |

---

## 3. Typography

### 3.1 Font Stack

```
--font-sans: "Inter", "system-ui", "-apple-system", sans-serif
--font-mono: "JetBrains Mono", "Fira Code", "monospace"
```

### 3.2 Type Scale

| Name | Size | Line Height | Weight | Usage |
|------|------|-------------|--------|-------|
| `text-xs` | 12px | 16px | 400 | Timestamps, hints, badges |
| `text-sm` | 14px | 20px | 400 | Body text, labels, card content |
| `text-base` | 16px | 24px | 400 | Default body text |
| `text-lg` | 18px | 28px | 600 | Card titles, section subheadings |
| `text-xl` | 20px | 28px | 600 | Page subheadings |
| `text-2xl` | 24px | 32px | 700 | Page headings |
| `text-3xl` | 30px | 36px | 700 | Hero subheadings |
| `text-4xl` | 36px | 40px | 700 | Section headings |
| `text-5xl` | 48px | 48px | 900 | Hero display |
| `text-6xl` | 60px | 60px | 900 | Landing hero |

### 3.3 Semantic Usage

```
Page title (h1):        text-2xl / text-3xl, font-bold, text-primary
Section heading (h2):   text-xl, font-semibold, text-primary
Card heading (h3):      text-base / text-lg, font-semibold, text-primary
Label:                  text-sm, font-medium, text-secondary
Body:                   text-sm, font-normal, text-secondary (slate-400)
Caption / hint:         text-xs, font-normal, text-tertiary (slate-600)
Code / address:         font-mono, text-sm, text-primary
Badge text:             text-xs, font-medium, uppercase tracking-wide (optional)
Button (sm):            text-sm, font-medium
Button (md):            text-sm, font-medium
Button (lg):            text-base, font-semibold
```

---

## 4. Spacing

### 4.1 Base Grid: 4px

All spacing is multiples of 4px. Critical component-level spacing:

```
Component internal padding:
  Card:            p-6   (24px)
  Card sm:         p-4   (16px)
  Button sm:       py-1.5 px-3   (6px, 12px)
  Button md:       py-2 px-4     (8px, 16px)
  Button lg:       py-2.5 px-5   (10px, 20px)
  Input:           py-2 px-3     (8px, 12px)
  Badge:           py-0.5 px-2   (2px, 8px)
  Avatar + text gap: gap-2       (8px)

Component external spacing:
  Section vertical padding: py-12 md:py-16 lg:py-24 (48/64/96px)
  Card grid gap:   gap-4   (16px)
  Feed item gap:   gap-3   (12px)
  Form field gap:  gap-5   (20px)
  Nav item gap:    gap-1   (4px)
```

### 4.2 Page Layout Margins

```
Mobile:   px-4   (16px each side)
Tablet:   px-6   (24px each side)
Desktop:  px-6 with max-w-6xl auto center
```

### 4.3 Max Widths

```
Landing hero content:   max-w-5xl   (1024px)
Main gallery page:      max-w-6xl   (1152px)
Project detail:         max-w-4xl   (896px) — detail + sidebar grid
Builder profile:        max-w-4xl   (896px)
Discussion thread:      max-w-3xl   (768px)
Feed:                   max-w-2xl   (672px)
Submit form:            max-w-2xl   (672px)
Notification page:      max-w-2xl   (672px)
```

---

## 5. Elevation & Shadows

Three-tier surface system on a very dark background:

```
Base background:       #0D1117  — page bg, no shadow
Surface (cards):       #161B22  + box-shadow-1
Elevated (dropdowns):  #1C2128  + box-shadow-2
Overlay (modals):      #1C2128  + box-shadow-3 + scrim
```

### Shadow Tokens

```css
--shadow-sm:  0 1px 2px rgba(0,0,0,0.5);
--shadow-md:  0 2px 8px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.4);
--shadow-lg:  0 8px 24px rgba(0,0,0,0.6), 0 3px 8px rgba(0,0,0,0.4);
--shadow-xl:  0 16px 40px rgba(0,0,0,0.7), 0 6px 16px rgba(0,0,0,0.5);

/* Glow shadows for status */
--shadow-glow-primary: 0 0 16px rgba(124,58,237,0.3);
--shadow-glow-success: 0 0 16px rgba(16,185,129,0.3);
--shadow-glow-warning: 0 0 16px rgba(245,158,11,0.3);
--shadow-glow-danger:  0 0 16px rgba(239,68,68,0.3);
```

---

## 6. Border Radius

```
--radius-xs:   4px    (rounded)      — badges, small inline elements
--radius-sm:   6px    (rounded-md)   — inputs, small buttons
--radius-md:   8px    (rounded-lg)   — buttons, form controls
--radius-lg:   12px   (rounded-xl)   — cards, panels
--radius-xl:   16px   (rounded-2xl)  — large cards, modals
--radius-pill: 9999px (rounded-full) — pills, avatars, tags
```

---

## 7. Motion & Transitions

### 7.1 Duration Scale

```
--duration-fast:   100ms  — color/opacity hover changes
--duration-base:   200ms  — most component interactions
--duration-slow:   300ms  — panels sliding in, modals
--duration-slower: 500ms  — page-level transitions
```

### 7.2 Easing Curves

```
--ease-default:  cubic-bezier(0.4, 0, 0.2, 1)   — standard (Material ease)
--ease-in:       cubic-bezier(0.4, 0, 1, 1)      — elements leaving screen
--ease-out:      cubic-bezier(0, 0, 0.2, 1)      — elements entering screen
--ease-spring:   cubic-bezier(0.34, 1.56, 0.64, 1) — bounce for toasts, badges
```

### 7.3 Standard Transitions

```css
/* Clickable elements (buttons, cards, links) */
transition: color 100ms ease, background-color 100ms ease,
            border-color 100ms ease, box-shadow 200ms ease;

/* Dropdown / popover open */
transition: opacity 200ms ease, transform 200ms cubic-bezier(0, 0, 0.2, 1);
transform: translateY(-4px) → translateY(0); /* enter from slightly above */

/* Modal backdrop */
transition: opacity 300ms ease;

/* Skeleton shimmer */
animation: shimmer 1.5s ease-in-out infinite;

/* Progress bar fill */
transition: width 800ms cubic-bezier(0, 0, 0.2, 1);

/* Number counter */
transition: uses framer-motion animate() with duration 2.5s, ease-out

/* Notification badge */
animation: badge-pulse 2s ease-in-out infinite; /* gentle pulse when > 0 */
```

### 7.4 Reduced Motion

All complex animations (parallax, terminal scroll, marquee) are disabled via `@media (prefers-reduced-motion: reduce)`. Simple opacity/color transitions remain.

---

## 8. Design Tokens

### 8.1 CSS Variable Reference Table

Paste into `globals.css` `:root {}`:

```css
/* Surfaces */
--bg-base:          #0D1117;
--bg-surface:       #161B22;
--bg-elevated:      #1C2128;
--bg-overlay:       rgba(13, 17, 23, 0.80);
--bg-inset:         #111827;

/* Borders */
--border-subtle:    rgba(255, 255, 255, 0.05);
--border-default:   rgba(255, 255, 255, 0.08);
--border-emphasis:  rgba(255, 255, 255, 0.14);
--border-strong:    rgba(255, 255, 255, 0.22);

/* Text */
--text-primary:     #E6EDF3;
--text-secondary:   #8B949E;
--text-tertiary:    #484F58;
--text-disabled:    #30363D;
--text-link:        #A78BFA;
--text-on-primary:  #FFFFFF;

/* Interactive */
--interactive-primary:        #7C3AED;
--interactive-primary-hover:  #8B5CF6;
--interactive-primary-active: #6D28D9;
--interactive-primary-subtle: rgba(124, 58, 237, 0.12);
--interactive-primary-border: rgba(124, 58, 237, 0.30);

/* Status */
--status-success:         #10B981;
--status-success-subtle:  rgba(16, 185, 129, 0.12);
--status-success-border:  rgba(16, 185, 129, 0.25);
--status-warning:         #F59E0B;
--status-warning-subtle:  rgba(245, 158, 11, 0.12);
--status-warning-border:  rgba(245, 158, 11, 0.25);
--status-danger:          #EF4444;
--status-danger-subtle:   rgba(239, 68, 68, 0.12);
--status-danger-border:   rgba(239, 68, 68, 0.25);
--status-info:            #06B6D4;
--status-info-subtle:     rgba(6, 182, 212, 0.12);
--status-info-border:     rgba(6, 182, 212, 0.25);
--status-neutral:         #484F58;
--status-neutral-subtle:  rgba(72, 79, 88, 0.20);

/* Shadows */
--shadow-sm:  0 1px 2px rgba(0, 0, 0, 0.5);
--shadow-md:  0 2px 8px rgba(0, 0, 0, 0.5), 0 1px 3px rgba(0, 0, 0, 0.4);
--shadow-lg:  0 8px 24px rgba(0, 0, 0, 0.6), 0 3px 8px rgba(0, 0, 0, 0.4);
--shadow-xl:  0 16px 40px rgba(0, 0, 0, 0.7), 0 6px 16px rgba(0, 0, 0, 0.5);
--shadow-glow-primary: 0 0 16px rgba(124, 58, 237, 0.30);
--shadow-glow-success: 0 0 16px rgba(16, 185, 129, 0.30);
--shadow-glow-warning: 0 0 16px rgba(245, 158, 11, 0.30);
--shadow-glow-danger:  0 0 16px rgba(239, 68, 68, 0.30);

/* Radius */
--radius-xs:   4px;
--radius-sm:   6px;
--radius-md:   8px;
--radius-lg:   12px;
--radius-xl:   16px;
--radius-pill: 9999px;

/* Motion */
--duration-fast:   100ms;
--duration-base:   200ms;
--duration-slow:   300ms;
--ease-default:    cubic-bezier(0.4, 0, 0.2, 1);
--ease-out:        cubic-bezier(0, 0, 0.2, 1);
--ease-spring:     cubic-bezier(0.34, 1.56, 0.64, 1);
```

### 8.2 Tailwind Class Mapping

| Design Token | Tailwind Class | Usage |
|-------------|---------------|-------|
| `--bg-base` | `bg-[#0D1117]` or `bg-gray-950` | Page background |
| `--bg-surface` | `bg-slate-900` | Cards |
| `--bg-elevated` | `bg-slate-800` | Dropdowns |
| `--border-default` | `border-slate-800` or `border-white/[0.08]` | Card borders |
| `--border-emphasis` | `border-slate-700` | Focused inputs |
| `--text-primary` | `text-slate-100` | Main text |
| `--text-secondary` | `text-slate-400` | Supporting text |
| `--text-tertiary` | `text-slate-600` | Hints/timestamps |
| `--interactive-primary` | `bg-violet-600` | Primary button bg |
| `--interactive-primary-hover` | `hover:bg-violet-500` | Primary button hover |
| `--status-success` | `text-emerald-400` / `bg-emerald-500` | Success indicators |
| `--status-warning` | `text-amber-400` / `bg-amber-500` | Warning indicators |
| `--status-danger` | `text-red-400` / `bg-red-500` | Danger indicators |
| `--status-info` | `text-cyan-400` / `bg-cyan-500` | Info indicators |

---

## 9. Component Library

### 9.1 Button

**Variants:**

```
Primary     bg-violet-600  text-white         hover:bg-violet-500  — main CTA
Secondary   bg-slate-800   text-slate-200      hover:bg-slate-700   — supporting action
Danger      bg-red-700     text-white          hover:bg-red-600     — destructive action
Ghost       transparent    text-slate-400      hover:bg-slate-800   — nav items, subtle
Success     bg-emerald-700 text-white          hover:bg-emerald-600 — confirm approval
Link        transparent    text-violet-400     hover:text-violet-300 underline — inline
```

**Sizes:**

```
sm:  h-8   py-1.5 px-3   text-xs   rounded-md   — badges in dropdowns, inline
md:  h-9   py-2   px-4   text-sm   rounded-lg   — default
lg:  h-11  py-2.5 px-5   text-base rounded-xl   — primary CTAs
```

**States:**

```
Default:   as defined per variant
Hover:     color shift (100ms)
Active:    slightly darker + slight scale(0.98)
Focus:     ring-2 ring-violet-500 ring-offset-2 ring-offset-[--bg-base]
Disabled:  opacity-40 cursor-not-allowed pointer-events-none
Loading:   spinner icon (16px) + opacity-75 + pointer-events-none
```

**Icon + text button:** `gap-2`, icon is 16px (h-4 w-4).

---

### 9.2 Project Card

```
Dimensions:  min-height 200px, width fills grid column (1/1, 1/2, 1/3 at breakpoints)
Background:  --bg-surface (slate-900)
Border:      1px solid --border-default, transitions to --border-emphasis on hover
Radius:      --radius-xl (16px)
Padding:     p-5 (20px)
Shadow:      --shadow-sm; hover: --shadow-md
```

**Anatomy (top to bottom):**

```
┌─────────────────────────────────────┐
│ [Cover Image 16:9, h-36, rounded-t] │  optional
├─────────────────────────────────────┤
│ [Tag] [Tag] [Tag+]          [Status]│  status badge: draft/pending/published
│                                     │  top-right corner, xs badge
│ Project Title                       │  text-base, font-semibold, text-primary
│ Tagline text truncated to 2 lines   │  text-sm, text-secondary, line-clamp-2
│                                     │
│ ───────────────────────────────     │  mt-auto divider line subtle
│ [●avatar] author name    ↑12  •5u  │  text-xs, text-tertiary
└─────────────────────────────────────┘
```

**Status Badge (top-right):**

```
DRAFT:         bg: gray-800/80,   text: gray-500,   border: gray-700
PENDING:       bg: amber-900/40,  text: amber-400,  border: amber-800/50
PUBLISHED:     hidden (default state, no badge)
ARCHIVED:      bg: gray-900,      text: gray-600,   border: gray-800
VERIFIED (✓):  small emerald dot next to title (not a badge)
```

**Hover behavior:**
- Border lifts: `--border-default` → `--border-emphasis`
- Shadow lifts: `--shadow-sm` → `--shadow-md`
- Cover image: `scale-105` (300ms ease)
- Title: `text-slate-100` → `text-white`
- Cursor: `pointer`
- Transform: no scale on the card itself (avoid jank), only border/shadow

---

### 9.3 Review Progress Bar

Displayed on project pages, review queue cards, and the pending review banner.

```
Container:   w-full, space-y-2
Height:      h-2 (8px) for compact, h-3 (12px) for prominent
Radius:      rounded-full
Track:       bg-slate-800
```

**Anatomy:**

```
Approvals:   X / 3
[████░░]  ← emerald-500 fill
────────────────────────
Rejections:  Y / 3
[██░░░░]  ← red-500 fill

Below bar:
"X approval(s) · Y rejection(s)"   text-xs text-tertiary
```

**Segment fills:**

```
0/3  →  width: 0%    opacity: 0.3
1/3  →  width: 33%
2/3  →  width: 66%
3/3  →  width: 100%  + glow-shadow matching color
```

**Transition:** `width 800ms cubic-bezier(0,0,0.2,1)` — animates when value changes.

**On hover (in review queue cards):** show tooltip "X of 3 approvals needed"

---

### 9.4 Feed Item

```
Background:  --bg-surface
Border:      1px solid --border-default
Radius:      --radius-xl
Padding:     p-5
Gap:         space-y-3
```

**Anatomy:**

```
┌──────────────────────────────────────────────────┐
│ [avatar 28px] author → project name    [TYPE] 2h │
│                                                   │
│ Update content text…                              │
│ Multiple lines, whitespace preserved,             │
│ text-sm text-secondary                            │
│                                                   │
│ 💬 3 comments                  [↑ Upvote project]│
└──────────────────────────────────────────────────┘
```

**Type badge sizing:**

```
All types:  py-0.5 px-2, text-xs, font-medium, rounded-full
```

**Type badge colors:**

```
Milestone:    bg-violet-900/50  text-violet-300
Blocker:      bg-red-900/50     text-red-300
Breakthrough: bg-emerald-900/50 text-emerald-300
General:      bg-slate-800      text-slate-400
```

**Hover:** card border lifts to `--border-emphasis`. Comment count becomes a link.

---

### 9.5 Builder Card

```
Background:  --bg-surface
Border:      1px solid --border-default
Radius:      --radius-xl
Padding:     p-5
```

**Anatomy:**

```
┌──────────────────────────────────────┐
│ [avatar 40px]  Name                  │
│                @username             │
│                                      │
│ Bio snippet, max 2 lines, text-sm    │
│                                      │
│ [12 projects] [48 updates]  [Follow] │
└──────────────────────────────────────┘
```

**Avatar:** 40px circle, `object-cover`, fallback = `bg-slate-700` circle with initials.

**Follow button:** right-aligned, `btn-secondary` size sm by default. When following: shows "Following" (btn-secondary), hover shows "Unfollow" with red text. See Follow Button spec below.

**Hover:** border lifts, name becomes `text-white`.

---

### 9.6 Follow Button

```
Not following:  btn-primary  size-sm  "Follow"
Following:      btn-secondary size-sm "Following" → hover: "Unfollow" (text-red-400)
Loading:        spinner + opacity-75
Not signed in:  renders as <a> to /login
```

**Transition on text swap:** `opacity` fade 150ms.

---

### 9.7 Notification Bell

**Trigger (in header):**

```
Icon:   custom bell SVG, 20px, text-slate-400
Badge:  absolute -top-1 -right-1
        min-w: 16px, h: 16px
        bg-violet-600, text-white, text-[10px], font-bold
        rounded-full
        content: count (max "9+")
        pulse animation when count > 0
```

**Dropdown panel:**

```
Width:      320px
Max-height: 420px overflow-y-auto
Position:   right-0 top-full mt-2
Background: --bg-elevated (slate-800)
Border:     1px solid --border-default
Radius:     --radius-xl
Shadow:     --shadow-xl
Z-index:    50
```

**Panel anatomy:**

```
┌────────────────────────────────────┐
│ Notifications          [Mark all ✓]│  border-b, px-4 py-3
├────────────────────────────────────┤
│ TODAY                              │  text-xs text-tertiary px-4 py-2
│ ──────────────────────────────     │
│ [icon] Message text          2m ●  │  ● = unread dot, violet-500
│ [icon] Message text          1h    │  read = no dot, dimmer
├────────────────────────────────────┤
│ YESTERDAY                          │
│ [icon] Message text         12h    │
├────────────────────────────────────┤
│        View all notifications →    │  border-t, text-xs text-tertiary
└────────────────────────────────────┘
```

**Notification icons by type:**

```
FOLLOW:            👤  (or person-add icon)
PROJECT_REVIEW:    👀  (or eye icon)
PROJECT_PUBLISHED: ✅  (or checkmark icon)
PROJECT_REJECTED:  ↩️  (or arrow-return icon)
NEW_PROJECT:       🚀  (or upload icon)
NEW_UPDATE:        📝  (or document icon)
COMMENT:           💬  (or chat-bubble icon)
DISCUSSION_REPLY:  ↩   (or reply icon)
```

**Unread item style:** `bg-violet-950/20`, left border `border-l-2 border-l-violet-500`

**Read item style:** default, text slightly dimmer

**Click behavior:** marks as read, navigates to `notification.link`, closes dropdown.

**Close:** click outside, Escape key.

**Enter animation:** `opacity: 0 → 1`, `translateY(-4px) → 0`, 200ms ease-out.

---

### 9.8 Comment Section

**Thread anatomy:**

```
┌─────────────────────────────────────────┐
│ Comments (5)                            │  section-heading
├─────────────────────────────────────────┤
│ [avatar 28px]  author name   2h ago    │
│               Comment content text…    │
│               [Delete]  ← own comment  │
│                                         │
│ [avatar 28px]  author name   45m ago   │
│               Comment content…         │
├─────────────────────────────────────────┤
│ [textarea — "Write a comment…"]        │
│                              [Post →]  │
│ ← not signed in: "Sign in to comment"  │
└─────────────────────────────────────────┘
```

**Delete button:** `text-slate-700`, appears on `hover` of the comment row, `hover:text-red-400`. Requires confirmation only for own comment with >0 replies (show inline "Are you sure? [Delete] [Cancel]").

**Form:** `flex gap-3`, textarea fills, button is `btn-primary size-sm` aligned to bottom of textarea.

---

### 9.9 Form Elements

**Input:**

```
Height:       h-9 (36px)
Padding:      py-2 px-3
Background:   --bg-surface (slate-800)
Border:       1px solid --border-emphasis (slate-700)
Radius:       --radius-md (8px)
Text:         text-sm text-primary
Placeholder:  text-slate-500

Focus:        border-violet-500 + ring-1 ring-violet-500
Error:        border-red-500 + ring-1 ring-red-500
Disabled:     opacity-50 cursor-not-allowed
```

**Textarea:**

```
Same as input, resize-none
Default rows: 3 (short), 5 (medium), 8 (long description)
```

**Label:**

```
display: block
text-sm font-medium text-slate-300
margin-bottom: 6px (mb-1.5)
```

**Error message:**

```
text-xs text-red-400
mt-1.5
prefix with "⚠ " or just red text
```

**Hint / helper text:**

```
text-xs text-slate-600
mt-1
```

**Tag multi-select:**

```
Display as pill buttons: [DeFi] [AI Oracle] [Gaming] …
Selected:    bg-violet-600 text-white border-transparent
Unselected:  bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-600
Max:         5 selected, remaining greyed out after max
```

**Field group:**

```
space-y-1.5   (label + input + error/hint)
```

**Form section separator:**

```
border-t border-slate-800 pt-6 mt-2
section label: text-sm font-medium text-slate-500 uppercase tracking-wider mb-4
```

---

### 9.10 Discussion Card

```
Background:  --bg-surface
Border:      1px solid --border-default
Radius:      --radius-xl
Padding:     p-5
```

**Anatomy:**

```
┌─────────────────────────────────────────────────┐
│ [GENERAL]  📌 Pinned                            │  badges row
│                                                  │
│ Discussion title text                            │  text-base font-semibold
│ Content preview, max 2 lines, text-secondary     │  text-sm
│                                                  │
│ [●avatar] author · 3h ago          12 replies ↗ │  text-xs text-tertiary
└─────────────────────────────────────────────────┘
```

**Pinned state:** `📌 Pinned` indicator in top row (text-xs text-amber-400). Card gets a faint left border accent: `border-l-2 border-l-amber-500`.

**Reply count:** right-aligned, text-xs, text-tertiary. Arrow ↗ becomes visible on hover.

**Hover:** border lifts, title `text-white`, reply count `text-violet-400`.

---

### 9.11 Review Form

```
Container:   card, space-y-4
```

**Anatomy:**

```
┌─────────────────────────────────────────┐
│ Your review                             │  section-heading
│                                         │
│ [    Approve    ] [    Reject    ]      │  two large toggle buttons
│                                         │
│ Feedback (optional / required *)        │  appears after selection
│ [                                    ]  │  textarea 4 rows
│ [                                    ]  │
│ [                                    ]  │  error if reject + empty
│                                         │
│            [Submit rejection ▸]         │  colored button
└─────────────────────────────────────────┘
```

**Approve button (selected):**

```
border border-emerald-500 bg-emerald-900/30 text-emerald-300
```

**Reject button (selected):**

```
border border-red-500 bg-red-900/30 text-red-300
```

**Unselected state for both:**

```
border border-slate-700 bg-slate-800 text-slate-400
hover: Approve → border-emerald-700 text-emerald-400
hover: Reject  → border-red-700 text-red-400
```

**Submit button:**

```
Approve selected: bg-emerald-700 text-white hover:bg-emerald-600
Reject selected:  bg-red-700 text-white hover:bg-red-600
Loading state:    spinner + "Submitting…" + disabled
```

**Feedback textarea:**

```
Appears with animate: opacity 0→1, height 0→auto (200ms)
"Feedback (optional)" when approve
"Feedback (required *)" when reject
```

---

### 9.12 Avatar

```
Sizes:
  xxs: h-4 w-4   (16px)  — inline in text
  xs:  h-5 w-5   (20px)  — card footer
  sm:  h-7 w-7   (28px)  — feed items, comments
  md:  h-9 w-9   (36px)  — compact profiles
  lg:  h-10 w-10 (40px)  — builder cards, standard profile
  xl:  h-12 w-12 (48px)  — notification list
  2xl: h-16 w-16 (64px)  — large profile references
  3xl: h-20 w-20 (80px)  — builder profile header

Shape: rounded-full, object-cover

Fallback (no image):
  bg-slate-700 rounded-full
  centered initials (1-2 chars), text-xs font-semibold text-slate-400
  OR a generic person SVG icon in text-slate-600
```

---

### 9.13 Badge / Tag / Status Pill

```
Base:       inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium

Project tag:
  border border-slate-700 bg-slate-800 text-slate-500
  hover (when clickable): border-slate-600 text-slate-300

Status badge (project):
  DRAFT:    border-slate-700   bg-slate-800/50 text-slate-500
  PENDING:  border-amber-800   bg-amber-900/40 text-amber-400
  LIVE:     border-emerald-800 bg-emerald-900/40 text-emerald-400

Update type badge:
  See 9.4 Feed Item

Category badge (discussion):
  See 2.5 Discussion Category
```

---

### 9.14 Skeleton / Loading State

```
Base element:  bg-slate-800 rounded animate-pulse
Animation:     pulse 1.5s ease-in-out infinite

Skeleton shapes:
  Text line:   h-3 rounded-full   (different widths: 60%, 80%, 40%)
  Avatar:      h-7 w-7 rounded-full
  Card:        h-48 rounded-xl
  Button:      h-9 w-24 rounded-lg
  Badge:       h-5 w-16 rounded-full
```

**Project Card Skeleton:**

```
┌───────────────────────────────────┐
│ [██████████ cover skeleton ██████]│  h-36 (if showing cover)
│ [██] [████] [███]                 │  tag skeletons
│ [██████████████████]              │  title
│ [████████████████████████]        │  tagline line 1
│ [███████████████]                 │  tagline line 2
│                                   │
│ [●] [██████████]    [███] [██]   │  footer
└───────────────────────────────────┘
```

---

### 9.15 Toast / Success Feedback

```
Position:    fixed bottom-6 right-6 (above sound toggle: bottom-16)
Width:       max-w-sm w-full
Background:  --bg-elevated
Border:      1px solid --border-default
Radius:      --radius-xl
Padding:     p-4
Shadow:      --shadow-xl
Z-index:     60

Enter:  translateX(110%) → translateX(0), opacity 0→1, 300ms ease-out
Exit:   translateX(110%) + opacity 0, 250ms ease-in

Auto-dismiss: 4s (default), 6s (with action)
```

**Variants:**

```
Success: border-l-4 border-l-emerald-500  [✅] message
Error:   border-l-4 border-l-red-500      [✗]  message
Info:    border-l-4 border-l-violet-500   [ℹ]  message
Warning: border-l-4 border-l-amber-500    [⚠]  message
```

---

### 9.16 Empty State

Used when a list/grid has no items.

```
Container:  rounded-xl border border-dashed border-slate-800 py-16 text-center
Icon:       36px, text-slate-700 (relevant emoji or icon)
Title:      text-base font-semibold text-slate-600 mt-3
Body:       text-sm text-slate-700 mt-2 max-w-xs mx-auto
Action:     btn-primary mt-5 (optional)
```

**Contextual messaging:**

```
No projects:      "No projects yet — be the first to submit."
                  [Submit a project]
No notifications: "You're all caught up."
                  [Explore projects]
No builders:      "No builders found."
No discussion:    "Start the conversation."
                  [New discussion]
No feed updates:  "No updates yet. Projects can post milestones,
                   blockers, and breakthroughs here."
No followers:     "No followers yet."
No results:       "No results for this filter."
                  [Clear filters]
```

---

### 9.17 Upvote Button

```
Unvoted:   bg-slate-800 border-slate-700 text-slate-400   "↑ 12"
Voted:     bg-violet-900/50 border-violet-600 text-violet-300  "↑ 13"
Hover:     border-violet-600 text-violet-400 (when unvoted)
Animation: number increments with spring animation (scale 1→1.3→1)
Not signed in: redirects to /login on click
```

---

## 10. Page Layouts

### Header (Global)

```
Height:  56px (h-14)
Style:   sticky top-0, backdrop-blur, border-b border-slate-800
         bg-[--bg-base]/80

┌────────────────────────────────────────────────────────────┐
│ [GL] Builders Hub  Projects  Builders  Feed  Discuss       │
│                                   Review?  [🔔] [Submit] [▾]│
└────────────────────────────────────────────────────────────┘

Mobile (< 640px):
  Logo + hamburger menu icon
  Slide-in drawer with nav links + auth state
```

---

### 10.1 Landing Page (/)

```
┌──────────────────────────────────────────────────────────────┐
│ HEADER (transparent overlay, no border)                      │
├──────────────────────────────────────────────────────────────┤
│                    HERO SECTION                              │
│              min-h-screen, dark bg with parallax             │
│                                                              │
│   [Pill: Quality-Gated · Builder-Centric · On-Chain]        │
│   "The Quality-Gated Home for GenLayer Builders"            │
│   Subtitle: Submit. Build in public. Get reviewed.          │
│                                                              │
│   [Start Building →]   [Explore Projects]                   │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                  BENTO GRID (Features)                       │
│   py-24                                                      │
│   ┌────────────────────┬────────────┐                        │
│   │ Review Gate card   │ Terminal   │                        │
│   │ (2 cols)           │ card       │                        │
│   ├──────────┬─────────┤ (1 col     │                        │
│   │ Credits  │         │ row-span-2)│                        │
│   │ card     │         │            │                        │
│   ├──────────┴─────────┴────────────┤                        │
│   │ Builder Network card (3 cols)   │                        │
│   └─────────────────────────────────┘                        │
├──────────────────────────────────────────────────────────────┤
│              HOW IT WORKS (horizontal scroll)                │
│   [01 Submit] → [02 Review] → [03 Approvals] → [04 Live]   │
├──────────────────────────────────────────────────────────────┤
│                   LIVE STATS                                 │
│   [Projects+] [Builders+] [Upvotes+]                        │
├──────────────────────────────────────────────────────────────┤
│                  TECH MARQUEE                                │
├──────────────────────────────────────────────────────────────┤
│                   FINAL CTA                                  │
│   "Ready to build high-signal Intelligent Contracts?"        │
│   [Submit your project →]  [Join the discussion]            │
├──────────────────────────────────────────────────────────────┤
│ FOOTER                                                       │
└──────────────────────────────────────────────────────────────┘
```

---

### 10.2 Project Gallery (/projects)

```
┌──────────────────────────────────────────────────────────────┐
│ HEADER                                                       │
├──────────────────────────────────────────────────────────────┤
│ max-w-6xl px-6 py-12                                         │
│                                                              │
│ Projects                            [Submit project ▶]       │
│ 24 projects built on GenLayer                                │
│                                                              │
│ ┌──────────────────────────────────────────────────────┐    │
│ │ [All] [DeFi] [AI Oracle] [Gaming] [Social] [Tooling] │    │
│ │ [Infrastructure] [NFT] [DAO] [Identity] [Data]       │    │
│ └──────────────────────────────────────────────────────┘    │
│                                                              │
│ Sort: [Newest] [Most upvoted] [Most active]      [▦] [▤]   │
│                                                              │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐          │
│ │ ProjectCard  │ │ ProjectCard  │ │ ProjectCard  │          │
│ └──────────────┘ └──────────────┘ └──────────────┘          │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐          │
│ │ ProjectCard  │ │ ProjectCard  │ │ ProjectCard  │          │
│ └──────────────┘ └──────────────┘ └──────────────┘          │
│                                                              │
│ [← Prev]  Page 1 of 4  [Next →]                             │
├──────────────────────────────────────────────────────────────┤
│ FOOTER                                                       │
└──────────────────────────────────────────────────────────────┘

Mobile (< 640px): 1-column grid, filter pills wrap, sort above grid
Tablet (640–1024px): 2-column grid
Desktop (>1024px): 3-column grid
```

---

### 10.3 Individual Project (/projects/[slug])

```
┌──────────────────────────────────────────────────────────────┐
│ HEADER                                                       │
├──────────────────────────────────────────────────────────────┤
│ max-w-4xl px-6 py-12                                         │
│                                                              │
│ [PENDING_REVIEW banner — amber, if applicable]               │
│                                                              │
│ ┌──────────────────────────────┬─────────────────────┐       │
│ │ MAIN CONTENT                 │ SIDEBAR             │       │
│ │                              │                     │       │
│ │ [Tag] [Tag] [Tag]            │ ┌─────────────────┐ │       │
│ │ # Project Title              │ │ ↑ 24  Updates  │ │       │
│ │   Tagline text               │ │ [Upvote]        │ │       │
│ │                              │ └─────────────────┘ │       │
│ │ [Cover Image — full width]   │                     │       │
│ │                              │ Review Progress:    │       │
│ │ About                        │ [░░░░░░] 2/3 appr  │       │
│ │ Description text…            │ [░░░░░░] 0/3 rejct │       │
│ │                              │                     │       │
│ │ ┌──────────────────────────┐ │ Builder             │       │
│ │ │ Why only GenLayer?       │ │ [●] alice.eth       │       │
│ │ │ (violet accent section)  │ │                     │       │
│ │ └──────────────────────────┘ │ Links               │       │
│ │                              │ Contract: 0x12…     │       │
│ │ Build Log                    │ Repo: View →        │       │
│ │ ┌──────────────────────────┐ │ Demo: Try it →      │       │
│ │ │ [Milestone] 2h ago       │ │                     │       │
│ │ │ Update content…          │ │ Submitted           │       │
│ │ └──────────────────────────┘ │ June 1, 2026        │       │
│ │                              │                     │       │
│ │ Comments (3)                 │                     │       │
│ │ [CommentSection]             │                     │       │
│ └──────────────────────────────┴─────────────────────┘       │
├──────────────────────────────────────────────────────────────┤
│ FOOTER                                                       │
└──────────────────────────────────────────────────────────────┘

Mobile: sidebar stacks above main content as a compact card
Tablet: same as desktop at 768px+
```

**"Why only GenLayer?" section:**

```
Background: violet-950/20
Border:     border border-violet-500/30
Radius:     --radius-xl
Padding:    p-6
Heading:    text-xs font-semibold uppercase tracking-wider text-violet-400
Content:    text-sm text-slate-300 whitespace-pre-wrap
```

---

### 10.4 Builder Profile (/builders/[username])

```
┌──────────────────────────────────────────────────────────────┐
│ HEADER                                                       │
├──────────────────────────────────────────────────────────────┤
│ max-w-4xl px-6 py-12                                         │
│                                                              │
│ ┌──────────────────────────────────────────────────────┐    │
│ │ [avatar 80px]   Alice Chen        [24 followers]     │    │
│ │                 @alicechen        [Follow]           │    │
│ │                 Builder at GenLayer                  │    │
│ │                                                      │    │
│ │                 Bio text, max 2–3 lines              │    │
│ │                                                      │    │
│ │ Twitter  GitHub  Website  Joined June 2026           │    │
│ └──────────────────────────────────────────────────────┘    │
│                                                              │
│ ┌──────────────┐ ┌──────────────┐                           │
│ │ 3 Projects   │ │ 12 Updates   │   (stat cards)            │
│ └──────────────┘ └──────────────┘                           │
│                                                              │
│ Projects                                                     │
│ ┌──────────────┐ ┌──────────────┐                           │
│ │ ProjectCard  │ │ ProjectCard  │                           │
│ └──────────────┘ └──────────────┘                           │
├──────────────────────────────────────────────────────────────┤
│ FOOTER                                                       │
└──────────────────────────────────────────────────────────────┘

Own profile view: hides Follow button, shows [Edit profile] instead
```

**Stat card:**

```
Background: --bg-surface
Border:     --border-default
Radius:     --radius-xl
Padding:    px-6 py-4
Value:      text-2xl font-bold text-primary
Label:      text-xs text-tertiary mt-1
```

---

### 10.5 Review Queue (/review)

```
┌──────────────────────────────────────────────────────────────┐
│ HEADER                                                       │
├──────────────────────────────────────────────────────────────┤
│ max-w-3xl px-6 py-12                                         │
│                                                              │
│ Review Queue                                                 │
│ 5 projects waiting — 3 approvals to publish, 3 to reject     │
│                                                              │
│ ┌────────────────────────────────────────────────────────┐  │
│ │ [Tag] [Tag]                          [Review →]        │  │
│ │ Project Title                                          │  │
│ │ Tagline text                                           │  │
│ │ ─────────────────────────────────────────────────────  │  │
│ │ [●avatar] author · 3h ago                              │  │
│ │ ░░░░░░░ 2/3 approvals  ░░░░░░░ 1/3 rejections         │  │
│ └────────────────────────────────────────────────────────┘  │
│                                                              │
│ ┌────────────────────────────────────────────────────────┐  │
│ │ [repeat]                                               │  │
│ └────────────────────────────────────────────────────────┘  │
│                                                              │
│ [Empty state if no projects]                                 │
├──────────────────────────────────────────────────────────────┤
│ FOOTER                                                       │
└──────────────────────────────────────────────────────────────┘

Not-eligible state:
  Centered message: "You need at least one published project to review others."
  [Submit your first project →]
```

**Individual Review (/review/[id]):**

```
← Back to queue

┌──────────────────────────────┬─────────────────────┐
│ MAIN: Project details         │ SIDEBAR             │
│ - Tags + Title + Tagline      │ Review Progress     │
│ - Description                 │ [Approval bar]      │
│ - Why only GenLayer?          │ [Rejection bar]     │
│ - Links                       │                     │
│                               │ Submitted by        │
│                               │ [avatar] name + date│
│                               │                     │
│                               │ Reviewer feedback   │
│                               │ (from prior reviews)│
│                               │                     │
│                               │ Your Review         │
│                               │ [ReviewForm]        │
└──────────────────────────────┴─────────────────────┘
```

---

### 10.6 Notifications (/notifications)

```
┌──────────────────────────────────────────────────────────────┐
│ HEADER                                                       │
├──────────────────────────────────────────────────────────────┤
│ max-w-2xl px-6 py-12                                         │
│                                                              │
│ Notifications                                                │
│                                                              │
│ TODAY                                                        │
│ ┌────────────────────────────────────────────────────────┐  │
│ │ 👤 Alice started following you              2m    ●    │  │
│ │ ────────────────────────────────────────────────────── │  │
│ │ ✅ Your project "Oracle v2" is now live!    1h         │  │
│ │ ────────────────────────────────────────────────────── │  │
│ │ 💬 Bob commented on your project            3h    ●    │  │
│ └────────────────────────────────────────────────────────┘  │
│                                                              │
│ YESTERDAY                                                    │
│ ┌────────────────────────────────────────────────────────┐  │
│ │ 👀 Your project received a new review       12h        │  │
│ └────────────────────────────────────────────────────────┘  │
│                                                              │
│ OLDER                                                        │
│ ┌────────────────────────────────────────────────────────┐  │
│ │ 🚀 alice.eth submitted "AI DAO Voting"      3d         │  │
│ └────────────────────────────────────────────────────────┘  │
├──────────────────────────────────────────────────────────────┤
│ FOOTER                                                       │
└──────────────────────────────────────────────────────────────┘

Unread row:  bg-violet-950/10, left border-l-2 border-l-violet-500
Clicking:    navigates to notification.link, marks as read
```

---

### 10.7 Discussion Board (/discuss)

```
┌──────────────────────────────────────────────────────────────┐
│ HEADER                                                       │
├──────────────────────────────────────────────────────────────┤
│ max-w-3xl px-6 py-12                                         │
│                                                              │
│ Discuss                      [New discussion (auth only)]    │
│ Ask questions, share ideas, connect with builders.           │
│                                                              │
│ [All] [General] [Help] [Ideas] [Showcase]                   │
│                                                              │
│ ┌────────────────────────────────────────────────────────┐  │
│ │ 📌 [GENERAL] Pinned                                    │  │
│ │ Pinned discussion title                                │  │
│ │ Preview of content...                                  │  │
│ │ [●] alice · 3h ago                       24 replies ↗ │  │
│ └────────────────────────────────────────────────────────┘  │
│                                                              │
│ ┌────────────────────────────────────────────────────────┐  │
│ │ [HELP] Discussion title                                │  │
│ │ Preview content...                                     │  │
│ │ [●] bob · 1h ago                          8 replies ↗ │  │
│ └────────────────────────────────────────────────────────┘  │
│                                                              │
│ [Repeat DiscussionCards…]                                    │
├──────────────────────────────────────────────────────────────┤
│ FOOTER                                                       │
└──────────────────────────────────────────────────────────────┘
```

**Individual Thread (/discuss/[id]):**

```
← Back to discussions

┌────────────────────────────────────────────────────────────┐
│ [CATEGORY]                                                  │
│ # Discussion Title                                          │
│ Original post content…                                      │
│                                                             │
│ ─────────────────────────────────────────────────────────  │
│ [● avatar] alice   |   June 1, 2026                        │
└────────────────────────────────────────────────────────────┘

12 replies
─────────────
┌──────────────────────────────────────────────────────────┐
│ [avatar] author   2h                                     │
│ ┌───────────────────────────────────────────────────┐   │
│ │ Reply content…                                     │   │
│ └───────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────┘

[repeat replies]

Write a reply  (or "Sign in to reply")
┌──────────────────────────────────────────────────────────┐
│ [textarea, 3 rows]                                       │
│                                              [Reply →]   │
└──────────────────────────────────────────────────────────┘
```

---

### 10.8 Build-in-Public Feed (/feed)

```
┌──────────────────────────────────────────────────────────────┐
│ HEADER                                                       │
├──────────────────────────────────────────────────────────────┤
│ max-w-2xl px-6 py-12                                         │
│                                                              │
│ Building in Public                                           │
│ Live updates from GenLayer builders.                         │
│                                                              │
│ [All] [Milestones] [Breakthroughs] [Blockers] [Updates]     │
│                                                              │
│ ┌────────────────────────────────────────────────────────┐  │
│ │ [●] alice → Oracle v2      [MILESTONE] 2h              │  │
│ │                                                        │  │
│ │ Shipped v0.3. Accuracy up 40% on our test set.        │  │
│ │                                                        │  │
│ │ 💬 3 comments                                         │  │
│ └────────────────────────────────────────────────────────┘  │
│                                                              │
│ ┌────────────────────────────────────────────────────────┐  │
│ │ [●] bob → Dev Toolkit       [BLOCKER] 5h               │  │
│ │ Running into nondeterminism issues…                    │  │
│ └────────────────────────────────────────────────────────┘  │
│                                                              │
│ [load more]   or infinite scroll                            │
├──────────────────────────────────────────────────────────────┤
│ FOOTER                                                       │
└──────────────────────────────────────────────────────────────┘
```

---

### 10.9 Submit Project (/projects/submit)

```
┌──────────────────────────────────────────────────────────────┐
│ HEADER                                                       │
├──────────────────────────────────────────────────────────────┤
│ max-w-2xl px-6 py-12                                         │
│                                                              │
│ Submit a project                                             │
│ Share what you've built on GenLayer with the community.      │
│                                                              │
│ [Credit balance: 2 ↗]  ← amber if 1, red if 0              │
│                                                              │
│ ┌────────────────────────────────────────────────────────┐  │
│ │ Project title *                                        │  │
│ │ [input]                                                │  │
│ │                                                        │  │
│ │ Tagline *                                              │  │
│ │ [input]  One sentence                                  │  │
│ │                                                        │  │
│ │ Description *                                          │  │
│ │ [textarea 6 rows]  Markdown supported                  │  │
│ │                                                        │  │
│ │ ┌──────────────────────────────────────────────────┐  │  │
│ │ │ Why only GenLayer? *                             │  │  │
│ │ │ [textarea 4 rows] — violet-bordered section      │  │  │
│ │ └──────────────────────────────────────────────────┘  │  │
│ │                                                        │  │
│ │ Tags *  (1–5)                                         │  │
│ │ [DeFi] [AI Oracle] [Gaming] [Social] [Tooling] …     │  │
│ │                                                        │  │
│ │ ─── Optional links ───────────────────────────────   │  │
│ │ Contract address                                      │  │
│ │ [input, monospace]                                    │  │
│ │ Repository URL                                        │  │
│ │ [input]                                               │  │
│ │ Demo URL                                              │  │
│ │ [input]                                               │  │
│ │                                                        │  │
│ │               [Submit project →]                      │  │
│ └────────────────────────────────────────────────────────┘  │
├──────────────────────────────────────────────────────────────┤
│ FOOTER                                                       │
└──────────────────────────────────────────────────────────────┘

0 credits: form is locked, shows amber warning
  "You have no submission credits remaining. Earn them back by
  publishing a project that reaches 5 upvotes."
```

---

## 11. Interaction Patterns

### 11.1 Loading States

**Button loading:** replace label with `[spinner] Loading…`, disabled, opacity-75.

**Page skeleton:** render skeleton structure matching final layout, shown while data fetches.

**List append (Load more):** spinner at bottom of list, new items fade in from `opacity-0 translateY(8px)` → natural, staggered 50ms per item.

**Optimistic UI:**
- Upvote: immediately toggle visual state, revert on API error with a toast.
- Follow: immediately flip button state, revert on error.
- Comment post: append to list instantly with "pending" styling, confirm when API returns.

### 11.2 Error States

**API error:** toast with error message. For form submissions: inline error above submit button `text-red-400 text-sm`.

**Validation errors:** per-field, appears on blur or on submit attempt. Red border + `text-red-400 text-xs mt-1.5`.

**Network error:** toast "Something went wrong. Please try again." with retry link.

**Not found (404):** centered empty state in page body. "Page not found." [Go home].

**Unauthorized (401):** redirect to `/login` with `?from=[current-path]` for post-login redirect.

**Forbidden (403):** inline message within the affected component, not a page redirect.

### 11.3 Confirmation Flows

**Delete comment:** inline prompt on hover click — "Are you sure? [Delete] [Cancel]" — no modal. 

**Reject project (review form):** feedback textarea required, submit button changes to "Submit rejection" with red color. Explicit two-step intent: select Reject → write feedback → submit.

**No confirmation needed:** upvote, follow, mark-as-read (all reversible or low-stakes).

### 11.4 Navigation Feedback

**Active nav link:** `text-slate-100` (brighter), no underline, no background.

**Active filter tab:** `bg-violet-600 text-white` or `text-violet-400 font-medium` depending on context.

**Active sort option:** `font-medium text-violet-400`, no background.

**Breadcrumb / back link:** `← Back to [context]`, `text-slate-500 hover:text-slate-300`, `text-sm`, no arrow background.

### 11.5 Follow Flow

```
1. Unauthenticated user clicks Follow → redirected to /login
2. Authenticated click Follow → optimistic "Following" + API call
3. Success → notification sent to target user
4. Error → revert to "Follow", toast error
5. Click Following → hover reveals "Unfollow" (red) → click → revert to "Follow"
```

### 11.6 Review Submission Flow

```
1. Reviewer arrives at /review/[id]
2. Reads project details and existing feedback
3. Selects Approve or Reject (highlight selected)
4. If Reject: feedback textarea expands (required)
5. Click submit → button shows spinner "Submitting…"
6. Success → toast "[Approved/Rejected]", redirected to /review queue
7. If 3rd approval: toast "Project published! 🚀"
8. If 3rd rejection: toast "Project sent back for revision."
9. Error → inline error message, stay on page
```

### 11.7 Submission Credit Display

- Show credit balance on `/projects/submit` page, near the submit button.
- `2 credits` — white/neutral
- `1 credit` — amber warning
- `0 credits` — red, form locked with contextual message
- On profile page: show as a subtle stat under the builder's name (only visible to self).

---

## 12. Responsive Breakpoints

### Breakpoint Scale

```
xs:  < 400px    — very small phones (no specific design, just flex/stack)
sm:  640px+     — phones landscape / small tablets
md:  768px+     — tablets
lg:  1024px+    — desktops, laptop
xl:  1280px+    — wide desktop (max-w-6xl constrains, rarely needed)
```

### Behavior per page

| Page | Mobile (< 640px) | Tablet (640–1024px) | Desktop (1024px+) |
|------|------------------|---------------------|-------------------|
| Project Gallery | 1 col grid, filters wrap | 2 col grid | 3 col grid |
| Project Detail | Single column (sidebar stacks first) | 2-col layout | 2-col layout |
| Builder Profile | Single column | Single column | Single column (centered max-w-4xl) |
| Review Queue | Single column cards | Single column | Single column (centered max-w-3xl) |
| Feed | Full width cards | max-w-2xl centered | max-w-2xl centered |
| Discussion Board | Full width | max-w-3xl centered | max-w-3xl centered |
| Submit Form | Full width | max-w-2xl centered | max-w-2xl centered |
| Header | Logo + hamburger | Full nav (truncated) | Full nav |
| Notification Bell dropdown | Full-width bottom sheet | 320px dropdown | 320px dropdown |

### Header Mobile Behavior

```
< 640px:
  Logo left | Hamburger right
  Hamburger opens full-height drawer from right (300px)
  Drawer contains: nav links stacked, auth state, theme/sound controls
  Backdrop: semi-transparent overlay, click to close
```

### Card Grid Responsive

```
mobile:  grid-cols-1
sm:      grid-cols-2 (640px+)
lg:      grid-cols-3 (1024px+)
gap:     gap-4 (16px) at all sizes
```

### Typography Responsive

```
Page headings:
  Mobile:   text-2xl (24px)
  Desktop:  text-3xl (30px)

Hero headings (landing):
  Mobile:   text-4xl (36px)
  Desktop:  text-6xl (60px)

Card titles: text-base at all sizes (no change needed)
```

---

## 13. Visual Style Guide

### 13.1 Photography & Imagery

**Project covers (optional):**
- Recommended: screenshots of the running Intelligent Contract UI, code editor, or terminal output
- Size: 16:9 ratio, minimum 800×450px
- Style: dark-background screenshots look native; no bright white UI screenshots
- If none provided: show no cover (tags + content fill the card naturally)

**Avatars:**
- OAuth avatars (GitHub/Google profile photos) — displayed as-is
- Round crop via `border-radius: 50%`
- Fallback: slate-700 circle + white initials (1–2 chars)
- No fake/generated avatars

**No decorative illustrations.** The platform is data-forward. Content is the visual.

### 13.2 Icon System

Use a single consistent icon library. **Recommendation: Heroicons (outline style)**

- All icons: 20px (h-5 w-5) in most contexts, 16px (h-4 w-4) in compact contexts
- Navigation: outline style
- Status indicators: can use solid (filled) for stronger signal
- Update type icons: emoji are acceptable here (🎯 📝 💡 🔴) — adds human warmth to the feed

**Custom icon exceptions:**
- GenHub "GL" logomark: custom letter mark in violet
- Upvote arrow: custom simple ↑ or triangle

### 13.3 Microcopy Tone

**Voice:** precise, peer-to-peer, no fluff. Builders talk to builders.

**Patterns:**

```
Empty states:
  ✓ "No projects yet — be the first to submit."
  ✗ "Oops! Looks like there's nothing here yet 🙁"

Errors:
  ✓ "Feedback is required when rejecting a project."
  ✗ "Whoops! You forgot to add feedback!"

Success:
  ✓ "Project published."
  ✗ "Congratulations! Your project is now live! 🎉🎊"

Button labels:
  ✓ "Submit project"     ✗ "Submit my project"
  ✓ "Mark all read"      ✗ "Mark everything as read"
  ✓ "Start Building"     ✗ "Get Started Today!"
  ✓ "Following"          ✗ "You are following"

Status descriptions:
  ✓ "3 approvals to go live"
  ✗ "Your project is currently under community review pending approval"
```

**Capitalization:**
- Page headings: Sentence case ("Review queue", not "Review Queue")
- Buttons: Title Case for primary CTAs ("Start Building"), sentence case for secondary ("Mark all read")
- Badges: ALL CAPS for update types (MILESTONE, BLOCKER), Title Case for categories (General, Help)

### 13.4 Animation Principles

1. **Purpose first.** Every animation communicates something — state change, hierarchy, direction. No decorative motion.
2. **Fast.** Interactive feedback should be near-instant (100–200ms). Larger transitions (300ms max) only for spatial movements.
3. **Respect system settings.** All complex animations gate on `prefers-reduced-motion`.
4. **No loops in the app shell.** Looping animations (marquee, terminal scroll) are landing page only. The app shell is calm.

---

## 14. Accessibility

### 14.1 Color Contrast

All text/background combinations target **WCAG AA (4.5:1 for normal text, 3:1 for large text):**

| Combination | Contrast | Pass |
|-------------|----------|------|
| `text-slate-100` on `bg-slate-900` | ~13:1 | ✅ AAA |
| `text-slate-400` on `bg-slate-900` | ~4.8:1 | ✅ AA |
| `text-violet-400` on `bg-slate-900` | ~5.6:1 | ✅ AA |
| `text-emerald-400` on `bg-slate-900` | ~6.2:1 | ✅ AA |
| `text-amber-400` on `bg-slate-900` | ~7.1:1 | ✅ AA |
| `text-red-400` on `bg-slate-900` | ~5.2:1 | ✅ AA |
| `text-slate-600` on `bg-slate-900` | ~2.1:1 | ⚠ AA fail (timestamps only — supplemented by position) |

`text-slate-600` is used only for supplemental content (timestamps, hints) where color is not the sole conveyor of meaning.

### 14.2 Focus Management

```
Focus ring: ring-2 ring-violet-500 ring-offset-2 ring-offset-[--bg-base]
All interactive elements: must be keyboard reachable and show focus ring
Skip link: "Skip to main content" as first focusable element (visually hidden until focused)
```

### 14.3 Keyboard Navigation

```
Tab:          move forward through interactive elements
Shift+Tab:    move backward
Enter/Space:  activate buttons, toggle checkboxes
Escape:       close dropdowns, modals, notification panel
Arrow keys:   navigate within dropdowns, tab groups (category filters)
```

### 14.4 Semantic Structure

```html
<header role="banner">
  <nav aria-label="Main navigation">
<main id="main-content">
  <h1> — one per page, describes the page
  <section aria-labelledby="section-heading-id">
<footer role="contentinfo">

<!-- Lists for repeated items -->
<ul aria-label="Projects"> <li> ProjectCard </li>
<ul aria-label="Notifications"> <li> ... </li>

<!-- Forms -->
<label for="input-id">
<input id="input-id" aria-describedby="hint-id error-id">
<p id="error-id" role="alert">  ← role="alert" for validation errors
```

### 14.5 ARIA Labels for Ambiguous Elements

```
Notification bell:  aria-label="Notifications (5 unread)"
Upvote button:      aria-label="Upvote project (12 upvotes)"
Follow button:      aria-label="Follow alice.eth" / "Unfollow alice.eth"
Avatar:             alt="alice.eth's avatar"
Project cover:      alt="[Project title] cover image"
Type badge:         aria-label="Update type: Milestone"
```

### 14.6 Motion Safety

```css
@media (prefers-reduced-motion: reduce) {
  .animate-marquee,
  .animate-terminal-scroll,
  .animate-float,
  .animate-mesh {
    animation: none !important;
  }
  /* Keep opacity/color transitions — they're low-impact */
  /* Remove transform-based entrance animations */
}
```

---

*GenHub Design System v1.0 — maintained alongside `CLAUDE.md`.*
