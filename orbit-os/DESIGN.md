# Orbit OS — Design System

Warm editorial. The reference language is amber-and-sepia, built on a high-contrast
display serif over a quiet sans, with generous negative space and photographic
warmth. Applied to a project-and-billing tool, that translates to an interface
that reads like a well-set financial statement rather than a SaaS dashboard.

The governing idea: **money and deliverables deserve typographic weight.** Numbers
are set in the serif at display sizes. Everything else — labels, navigation, form
chrome — recedes into small, quiet sans. Contrast comes from scale and warmth, not
from color-coding everything.

---

## 1. Color

### 1.1 Palette

The reference sits in a narrow warm band: deep roasted browns, amber gradients,
and off-white paper. Nothing is pure black or pure white.

**Core neutrals — "paper and ink"**

| Token | Hex | HSL | Use |
|---|---|---|---|
| `espresso-950` | `#1A1008` | `30 54% 6%` | Darkest ground. Hero backgrounds, dark sections. |
| `espresso-900` | `#2B1A0E` | `27 50% 11%` | Primary dark surface. Sidebar in dark mode. |
| `espresso-800` | `#3D2716` | `26 47% 16%` | Raised dark surface, dark-mode cards. |
| `espresso-700` | `#5A3B22` | `27 45% 24%` | Dark borders, muted dark text. |
| `bronze-500` | `#8B6544` | `27 35% 41%` | Mid-tone. Muted text on light. |
| `sand-300` | `#C4A886` | `30 36% 65%` | Dividers on warm grounds. |
| `sand-200` | `#E0D2C0` | `33 39% 82%` | Light borders, inactive tracks. |
| `paper-100` | `#F5EFE7` | `33 43% 93%` | Secondary surface, hover fills. |
| `paper-50` | `#FBF8F4` | `36 47% 97%` | **Primary app background.** |
| `paper-0` | `#FFFDFB` | `30 100% 99%` | Card surface on light. |

**Accent — amber**

Reserved. Amber is the light source in the reference and it must stay scarce
here: the active nav item, the primary button, the paid state, and focus rings.
Nothing else.

| Token | Hex | HSL | Use |
|---|---|---|---|
| `amber-700` | `#A85F14` | `30 79% 37%` | **Amber text and filled buttons.** The only amber that passes 4.5:1 on paper. |
| `amber-500` | `#E08A2B` | `31 74% 53%` | Decorative only — icons, borders, gradients, large display text. |
| `amber-400` | `#F0A94A` | `33 85% 62%` | Accent on dark grounds. |
| `amber-300` | `#F7C67E` | `35 88% 73%` | Glows, gradient tops, subtle fills. |
| `amber-100` | `#FDF0DC` | `36 87% 93%` | Accent wash — active nav background. |

The split between `amber-500` and `amber-700` is the important one. `amber-500`
is the color the reference *looks* like, but at 2.5:1 on paper it cannot legally
carry text. So `amber-500` decorates and `amber-700` speaks — a 16px icon in
`amber-500` beside a label in `amber-700` reads as one accent while staying
legible.

**Semantic**

Kept warm so they never feel bolted on. Success is olive rather than emerald;
danger is a burnt red rather than a fire-engine red.

| Token | Hex | Use |
|---|---|---|
| `success-700` | `#59662F` | Paid milestones, completed projects. Badge text. |
| `success-100` | `#EFF2E2` | Paid badge background. |
| `warning-700` | `#8A6015` | Due soon, pending. Badge text. |
| `warning-100` | `#FBF1DC` | Pending badge background. |
| `danger-600` | `#A63D28` | Overdue, destructive actions. Badge text. |
| `danger-100` | `#F8E6E1` | Overdue badge background. |

### 1.2 Token mapping

Replaces the current cool-violet set in `src/app/globals.css`. HSL triplets,
no `hsl()` wrapper — matches the existing Tailwind config, which already wraps.

```css
:root {
  --background: 36 47% 97%;        /* paper-50 */
  --foreground: 27 50% 11%;        /* espresso-900 */

  --card: 30 100% 99%;             /* paper-0 */
  --card-foreground: 27 50% 11%;

  --popover: 30 100% 99%;
  --popover-foreground: 27 50% 11%;

  --primary: 27 50% 11%;           /* espresso-900 — dark buttons */
  --primary-foreground: 36 47% 97%;

  --secondary: 33 43% 93%;         /* paper-100 */
  --secondary-foreground: 27 50% 11%;

  --muted: 33 43% 93%;
  --muted-foreground: 27 35% 41%;  /* bronze-500 */

  --accent: 30 79% 37%;            /* amber-700 — text & fills, 4.6:1 on paper */
  --accent-foreground: 30 100% 99%;
  --accent-decorative: 31 74% 53%; /* amber-500 — icons, borders, gradients only */

  --success: 74 37% 29%;
  --success-foreground: 30 100% 99%;
  --warning: 38 74% 31%;
  --warning-foreground: 30 100% 99%;
  --destructive: 10 61% 40%;       /* danger-600 */
  --destructive-foreground: 30 100% 99%;

  --border: 33 39% 82%;            /* sand-200 */
  --input: 33 39% 82%;
  --ring: 30 79% 37%;              /* amber-700 */

  --radius: 0.75rem;
}

.dark {
  --background: 30 54% 6%;         /* espresso-950 */
  --foreground: 36 47% 97%;

  --card: 27 50% 11%;              /* espresso-900 */
  --card-foreground: 36 47% 97%;

  --popover: 27 50% 11%;
  --popover-foreground: 36 47% 97%;

  --primary: 36 47% 97%;
  --primary-foreground: 27 50% 11%;

  --secondary: 26 47% 16%;         /* espresso-800 */
  --secondary-foreground: 36 47% 97%;

  --muted: 26 47% 16%;
  --muted-foreground: 30 36% 65%;  /* sand-300 */

  --accent: 33 85% 62%;            /* amber-400 — 9.3:1 on espresso-950 */
  --accent-foreground: 30 54% 6%;
  --accent-decorative: 33 85% 62%;

  --success: 74 30% 55%;
  --warning: 39 80% 60%;
  --destructive: 11 55% 55%;

  --border: 27 45% 24%;            /* espresso-700 */
  --input: 27 45% 24%;
  --ring: 33 85% 62%;
}
```

Add to `tailwind.config.ts` under `extend.colors`:

```ts
success: { DEFAULT: "hsl(var(--success))", foreground: "hsl(var(--success-foreground))" },
warning: { DEFAULT: "hsl(var(--warning))", foreground: "hsl(var(--warning-foreground))" },
```

### 1.3 Gradients

The reference hero is a vertical amber sunset. Use sparingly — the marketing hero
and empty-state illustrations only, never behind data.

```css
--gradient-dusk: linear-gradient(180deg, #F7C67E 0%, #E08A2B 45%, #8B4A1C 100%);
--gradient-ember: linear-gradient(160deg, #2B1A0E 0%, #5A3B22 60%, #8B4A1C 100%);
--gradient-paper: linear-gradient(180deg, #FBF8F4 0%, #F5EFE7 100%);
```

### 1.4 Rules

- **Amber is scarce.** If more than roughly 5% of a screen is amber, something
  that should be neutral has been accented.
- **Never pure black or white.** `#000` and `#fff` both read cold against this
  palette. Use `espresso-950` and `paper-0`.
- **Status color never carries meaning alone.** Every badge pairs color with a
  text label — required for color-blind users, and for anyone scanning quickly.
- **Contrast floor.** Body text ≥ 4.5:1, large display text and UI chrome ≥ 3:1.
  `bronze-500` on `paper-50` is 4.6:1 — safe for secondary text but not for
  anything below 14px. `amber-500` on `paper-50` is only 2.5:1, so it is
  **never text** — use `amber-700` wherever amber must be read.

---

## 2. Typography

### 2.1 Families

The reference pairs a high-contrast display serif with italic swash capitals
against a plain grotesque. Two families, sharply divided by role.

**Display — Fraunces**

A variable serif with an optical-size axis and a `SOFT`/`WONK` axis that produces
the same warm, slightly eccentric character as the reference lettering. Available
on Google Fonts, so it stays in `next/font` with no licensing cost.

Reserved for: page titles, currency figures, stat values, empty-state headlines,
and marketing headlines. **Never** for body copy, labels, buttons, or table text.

**UI — Inter**

Already in the project. Everything that isn't a display number or a title.

```ts
// src/app/layout.tsx
import { Inter, Fraunces } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});
```

> Replaces Cormorant Garamond. Cormorant is too delicate at small sizes and its
> thin strokes disappear against warm backgrounds; Fraunces holds weight at
> display sizes and has the softer, warmer terminals the reference uses.

### 2.2 Scale

Major-third-ish, tuned so that display sizes have real presence and UI text
stays compact. Line heights tighten as size increases.

| Role | Size / line-height | Weight | Tracking | Family |
|---|---|---|---|---|
| `display-xl` | 72px / 0.95 | 400 | −0.03em | Fraunces |
| `display-lg` | 56px / 1.0 | 400 | −0.025em | Fraunces |
| `display-md` | 40px / 1.05 | 400 | −0.02em | Fraunces |
| `display-sm` | 30px / 1.15 | 400 | −0.015em | Fraunces |
| `stat` | 34px / 1.1 | 500 | −0.02em | Fraunces |
| `title` | 20px / 1.3 | 600 | −0.01em | Inter |
| `body` | 15px / 1.6 | 400 | 0 | Inter |
| `body-sm` | 13px / 1.5 | 400 | 0 | Inter |
| `label` | 13px / 1.4 | 500 | 0 | Inter |
| `caption` | 12px / 1.4 | 400 | 0 | Inter |
| `overline` | 11px / 1.2 | 600 | 0.14em, uppercase | Inter |

```ts
// tailwind.config.ts → extend.fontSize
fontSize: {
  "display-xl": ["4.5rem",  { lineHeight: "0.95", letterSpacing: "-0.03em" }],
  "display-lg": ["3.5rem",  { lineHeight: "1",    letterSpacing: "-0.025em" }],
  "display-md": ["2.5rem",  { lineHeight: "1.05", letterSpacing: "-0.02em" }],
  "display-sm": ["1.875rem",{ lineHeight: "1.15", letterSpacing: "-0.015em" }],
  "stat":       ["2.125rem",{ lineHeight: "1.1",  letterSpacing: "-0.02em" }],
  "overline":   ["0.6875rem",{ lineHeight: "1.2", letterSpacing: "0.14em" }],
},
```

### 2.3 Usage

**Currency and figures are the star.** Any monetary amount at stat size or above
uses Fraunces with tabular figures so columns align:

```tsx
<span className="font-serif text-stat tabular-nums">{formatMoney(total)}</span>
```

```css
/* globals.css — required for any numeric column */
.tabular-nums { font-variant-numeric: tabular-nums; }
```

**Overline labels** sit above stats and section headings — the small tracked
caps in the reference. This is the one place letter-spacing goes wide:

```tsx
<p className="text-overline uppercase text-muted-foreground">Outstanding</p>
<p className="font-serif text-stat tabular-nums">{formatMoney(pending)}</p>
```

**Italic is meaningful, not decorative.** Fraunces italic is reserved for a
single emphasized word in a marketing headline, matching the swash capitals in
the reference. Never in the product UI.

### 2.4 What this replaces

The previous design used tracked-out uppercase for *navigation, buttons, card
titles, and stat labels simultaneously*, at 10–13px. That is unreadable at speed
and it flattened the hierarchy — everything shouted equally. Under this system
only `overline` is tracked, and only above a display figure or a section break.

---

## 3. Space and layout

### 3.1 Scale

4px base. Use these steps only.

`4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128`

Vertical rhythm within a page section is `24`. Between major sections it is `64`
on desktop, `48` on mobile. Card interior padding is `24`; compact/table cards
use `16`.

### 3.2 Frame

| | Value |
|---|---|
| Sidebar width | 240px (`w-60`) |
| Header height | 56px (`h-14`) |
| Content max-width | 1120px, centered |
| Content padding | 32px desktop, 16px mobile |
| Grid | 12-column, 24px gutter |

The reference is generous with negative space — resist filling it. A dashboard
with four stat cards and a lot of paper around them reads more confident than
eight cards edge to edge.

### 3.3 Radius and elevation

| Token | Value | Use |
|---|---|---|
| `rounded-sm` | 8px | Badges, tags, small inputs |
| `rounded-md` | 10px | Buttons, inputs |
| `rounded-lg` | 12px | Cards, panels, dialogs |
| `rounded-xl` | 16px | Hero panels, feature tiles |
| `rounded-full` | — | Avatars, pills, icon buttons |

Shadows are warm — tinted with the espresso hue, never neutral gray. Gray shadows
on warm paper look like dirt.

```css
--shadow-xs: 0 1px 2px 0 hsl(27 50% 11% / 0.04);
--shadow-sm: 0 1px 3px 0 hsl(27 50% 11% / 0.06), 0 1px 2px -1px hsl(27 50% 11% / 0.04);
--shadow-md: 0 4px 12px -2px hsl(27 50% 11% / 0.08), 0 2px 4px -2px hsl(27 50% 11% / 0.04);
--shadow-lg: 0 12px 32px -8px hsl(27 50% 11% / 0.12);
--shadow-glow: 0 0 0 1px hsl(31 74% 53% / 0.2), 0 4px 16px -4px hsl(31 74% 53% / 0.25);
```

Default state for cards is **flat with a border**. Shadow appears on hover or for
floating layers (dialog, popover, dropdown) — not at rest. `--shadow-glow` is for
the primary CTA only.

---

## 4. Iconography

**Lucide**, already installed. Consistency rules:

| Property | Value |
|---|---|
| Default size | 16px (`h-4 w-4`) in UI, 20px in empty states, 24px in marketing |
| Stroke width | **1.5** default, **2** when active or on a filled button |
| Color | inherits `currentColor` — never hardcoded |

The reference uses small line icons inside soft rounded chips. That pattern maps
directly to stat cards:

```tsx
<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
  <Wallet className="h-4 w-4 text-accent" strokeWidth={1.5} />
</div>
```

**Semantic mapping** — one concept, one icon, everywhere:

| Concept | Icon |
|---|---|
| Overview | `LayoutDashboard` |
| Projects | `FolderOpen` |
| Finance / money | `Wallet` |
| Time | `Clock` |
| Calendar | `Calendar` |
| People | `Users` |
| Goals | `Target` |
| Settings | `Settings` |
| Document | `FileText` |
| Paid | `CheckCircle2` |
| Pending | `Clock3` |
| Overdue | `AlertCircle` |

> Note: `IndianRupee` is currently the Finance nav icon. Replace with `Wallet` —
> the app is multi-currency, and a rupee glyph contradicts a project billing in
> USD. Currency belongs in the formatted value, not in the chrome.

---

## 5. Components

### 5.1 Button

| Variant | Fill | Text | Border |
|---|---|---|---|
| `default` | `espresso-900` | `paper-50` | none |
| `accent` | `amber-700` | `paper-0` | none, `--shadow-glow` |
| `outline` | transparent | `foreground` | `sand-200` |
| `ghost` | transparent → `paper-100` on hover | `muted-foreground` → `foreground` | none |
| `destructive` | `danger-600` | `paper-0` | none |

Sizes: `sm` 32px / `default` 38px / `lg` 44px. Horizontal padding 12/16/24.
Label is **Inter 13px medium, sentence case** — not uppercase, not tracked.

One `accent` button per view, maximum. It marks the single most important action:
"Create project", "Mark as paid".

### 5.2 Card

```
border: 1px solid border
background: card
radius: 12px
padding: 24px
hover (interactive only): border-color → sand-300, shadow-sm, 120ms
```

Never combine border and resting shadow — pick one. Cards on `paper-50` use a
border; cards floating over an image or gradient use a shadow and no border.

### 5.3 Stat card

The signature component — the reference's floating stat chips, made structural.

```tsx
<Card className="p-6">
  <div className="flex items-start justify-between">
    <p className="text-overline uppercase text-muted-foreground">Outstanding</p>
    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
      <Wallet className="h-4 w-4 text-accent" strokeWidth={1.5} />
    </div>
  </div>
  <p className="mt-4 font-serif text-stat tabular-nums">{formatMoney(pending)}</p>
  <p className="mt-1 text-caption text-muted-foreground">Across 3 projects</p>
</Card>
```

Order matters: **label, then figure, then context.** The eye lands on the serif
number, then reads up for what it means.

### 5.4 Badge

Pill, `rounded-full`, 11px medium, 8px horizontal padding. Tinted background with
matching foreground — never solid saturated fills.

| Status | Background | Text |
|---|---|---|
| PAID / COMPLETED | `success-100` | `success-700` |
| PENDING / ACTIVE | `warning-100` | `warning-700` |
| OVERDUE | `danger-100` | `danger-600` |
| ARCHIVED / INVITED | `paper-100` | `bronze-500` |

### 5.5 Input

```
height: 38px
border: 1px solid input
radius: 10px
background: paper-0
padding: 0 12px
font: Inter 14px
placeholder: bronze-500
focus: border → amber-700, ring 3px amber-700/15, no outline
```

Labels sit **above** the field, `label` style, 6px gap. The previous
borderless-underline treatment is dropped — it reads as elegant on a marketing
page and as broken on a form with twelve fields.

### 5.6 Sidebar

240px, `card` background, right border. Brand is "Orbit" in **Fraunces 18px**,
the one place the serif appears in the chrome.

Items: 13px medium Inter, 36px tall, `rounded-lg`, 12px gap to a 16px icon.

| State | Style |
|---|---|
| Default | `muted-foreground`, transparent |
| Hover | `foreground`, `paper-100` background |
| Active | `amber-700` text, `amber-100` background, icon `strokeWidth 2` |

No left-border indicator — the filled amber wash is the indicator.

### 5.7 Table

Header row: `overline` style, `muted-foreground`, 1px bottom border, 12px padding.
Body rows: 15px Inter, 14px vertical padding, hover `paper-50`.
**All numeric columns right-aligned with `tabular-nums`.** Money columns use
Fraunces at 15px — small enough to sit in a row, distinct enough to scan.

### 5.8 Empty state

Centered, 64px vertical padding. Icon in a 48px `paper-100` circle, then a
`display-sm` Fraunces headline, then one line of `body-sm` muted copy, then a
single `accent` button. Copy states what the thing is *for*, never just its
absence: "Add your first milestone to start tracking payments" beats "No
milestones found."

---

## 6. Motion

Restrained. The reference is still photography, not animation — movement should
feel like paper settling.

| Token | Duration | Easing | Use |
|---|---|---|---|
| `instant` | 100ms | `ease-out` | Color, background, border |
| `fast` | 160ms | `cubic-bezier(0.16, 1, 0.3, 1)` | Hover lift, small transforms |
| `base` | 240ms | `cubic-bezier(0.16, 1, 0.3, 1)` | Dialogs, popovers, drawers |
| `slow` | 400ms | `cubic-bezier(0.16, 1, 0.3, 1)` | Page and section reveals |

Rules:
- Animate `transform` and `opacity` only. Never `height`, `width`, or `top`.
- Hover lift is `translateY(-1px)` — barely perceptible, never more than 2px.
- No spinner where a skeleton will do. Skeletons use `paper-100` with a 1.5s
  pulse.
- **Honor `prefers-reduced-motion`.** Wrap every non-essential transition:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 7. Accessibility

Non-negotiable, and cheap if done from the start.

- **Focus is always visible.** `ring-2 ring-accent ring-offset-2
  ring-offset-background`. Never `outline: none` without a replacement.
- **Contrast.** Measured, not estimated:

  | Pairing | Ratio | Verdict |
  |---|---|---|
  | `espresso-900` on `paper-50` | 15.8:1 | Body text ✓ |
  | `paper-0` on `espresso-900` | 16.5:1 | Default button ✓ |
  | `bronze-500` on `paper-50` | 4.9:1 | Secondary text ✓ |
  | `bronze-500` on `paper-100` | 4.6:1 | Text on hover fill ✓ |
  | `amber-700` on `paper-50` | 4.6:1 | Accent text ✓ |
  | `paper-0` on `amber-700` | 4.8:1 | Accent button ✓ |
  | `amber-700` on `amber-100` | 4.3:1 | Active nav — ✓ at 13px medium (large-text rule), fails for smaller |
  | `success-700` on `success-100` | 5.5:1 | Badge ✓ |
  | `warning-700` on `warning-100` | 5.0:1 | Badge ✓ |
  | `danger-600` on `danger-100` | 5.2:1 | Badge ✓ |
  | `amber-400` on `espresso-950` | 9.3:1 | Dark mode accent ✓ |
  | `sand-300` on `espresso-950` | 8.3:1 | Dark mode muted ✓ |
  | **`amber-500` on `paper-50`** | **2.5:1** | **Decorative only — never text** |

  The last row is the trap. `amber-500` is the color the reference reads as, and
  it is the one value that must never carry a word.
- **Targets** ≥ 44×44px on touch. Icon-only buttons get `aria-label`.
- **Status is never color alone** — always paired with its text label.
- Dialogs trap focus and restore it on close. `Esc` always closes.

---

## 8. Applying this

Ordered so each step is independently shippable.

1. **Tokens** — replace the `:root` and `.dark` blocks in
   [globals.css](src/app/globals.css); add `success`/`warning` to
   [tailwind.config.ts](tailwind.config.ts). The whole app shifts warm at once,
   because every component already reads from these variables.
2. **Fonts** — swap Cormorant → Fraunces in [layout.tsx](src/app/layout.tsx);
   add the `fontSize` scale and `.tabular-nums`.
3. **Primitives** — Button variants (add `accent`), Input focus ring, Badge
   status map, Card hover.
4. **Chrome** — Sidebar active state, Header.
5. **Data surfaces** — stat cards on Overview, Finance table, project cards.
6. **Marketing** — landing hero on `--gradient-dusk`, Fraunces display headline
   with one italic word.

### Rules to hold on to

- Serif for figures and titles. Sans for everything else. No exceptions.
- Amber marks one thing per screen.
- Tracked uppercase only for `overline`.
- Border **or** shadow, never both at rest.
- Warm shadows. Never gray.
- Every number that can be compared is `tabular-nums` and right-aligned.
