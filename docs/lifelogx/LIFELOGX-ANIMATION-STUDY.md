# LifeLogX — Complete Animation & Interaction Study

> **Source site:** https://az-lifelogx.webflow.io
> **What it is:** "Lifelogx" — an AI-first app marketing template by Azwedo/Wedoflow, built in Webflow.
> **Captured:** 18 Nov 2026, desktop viewport 1280×800 + one Pixel-7 (412×915) pass.
> **Method:** Every number in this document was extracted *programmatically* from the live site — the complete Webflow IX2 interaction manifest (153 events, 59 action lists), all CSS hover/transition rules, the design-token stylesheet (95 CSS variables), and the loaded JS libraries (GSAP 3.13 + SplitText 3.15). Screenshots are saved under `shots/` and a full scroll-through video at `home-scroll-through.mp4`. This is not a visual guess — it is the actual animation data the site ships, with exact durations, easings and keyframes.

---

## Table of contents

1. [Site inventory](#1-site-inventory)
2. [The animation engine](#2-the-animation-engine)
3. [Design tokens](#3-design-tokens)
4. [Trigger taxonomy](#4-trigger-taxonomy)
5. [The complete hover inventory](#5-the-complete-hover-inventory)
6. [Scroll-reveal system](#6-scroll-reveal-system)
7. [Scroll-scrubbed (continuous) choreographies](#7-scroll-scrubbed-continuous-choreographies)
8. [Loops, page-load and timed animations](#8-loops-page-load-and-timed-animations)
9. [Home page — section by section](#9-home-page--section-by-section)
10. [Other pages](#10-other-pages)
11. [Responsive behaviour](#11-responsive-behaviour)
12. [THE PLAN — rebuilding this, step by step](#12-the-plan--rebuilding-this-step-by-step)
13. [Performance & accessibility rules the site follows](#13-performance--accessibility-rules-the-site-follows)
14. [Licensing note](#14-licensing-note)

---

## 1. Site inventory

| Page | Path | Height (desktop) | Role |
|---|---|---|---|
| Home | `/` | 11,800 px | The showpiece — every animation lives here |
| About | `/about` | 3,972 px | Image crossfades + scroll-scaled big image |
| Feature | `/feature` | 7,268 px | The "answers cards" stack that lifts on scroll |
| Blog index | `/blog` | 2,312 px | Hover-dimming card list |
| Blog post (CMS) | `/blogs/how-ai-companions-can-transform-your-life` | — | Rich-text page, shared reveals |
| Contact | `/contact` | 2,299 px | Staggered form field entrances (PAGE_START) |
| Utility | `/404`, `/401`, `/template/*` (style guide, instructions, change-log, licensing) | — | Template scaffolding |

Home page section map (desktop, measured):

| Section | Scroll offset | Height | Screenshot |
|---|---|---|---|
| Hero (heading, store badges, phone mockup) | 80 | 3,358 total | `shots/01-home-hero.png` |
| Sticky scroll-jacked feature walk | 1,038 | 2,400 | `shots/02`, `03`, `04` |
| Divider strip | 3,438 | 242 | `shots/05-home-divider.png` |
| Gradient section (text swaps one-by-one) | 3,680 | 2,800 | `shots/06`, `07`, `08` |
| Capabilities / integrations | 6,480 | 1,020 | `shots/08-home-gradient-texts.png` |
| "No writing" big-text swap + phone | 7,499 | 2,000 | `shots/09`, `10` |
| Answers cards (feature-page twin) | 9,499 | 965 | `shots/11-home-cards.png` |
| Buy-this-template CTA | 10,465 | 506 | `shots/12-home-cta.png` |
| Footer (mouse-reactive gradient) | 10,970 | 788 | `shots/13-home-footer.png` |

**Full-page scroll video:** `home-scroll-through.mp4` (recorded live, ~20s, eased 0→11,800px).

---

## 2. The animation engine

The site runs **two animation systems at once**:

1. **Webflow IX2** (native Webflow Interactions 2.0) — the workhorse. The full manifest lives in `window.Webflow.require('ix2').store.getState().ixData` and contains **153 events** and **59 action lists**. Every reveal, hover, scrub and loop on the site is defined here.
2. **GSAP 3.13 + SplitText 3.15** — loaded for Webflow's newer scroll-linked features (the `gsapFrame` image-sequence engine appears in the bundle, and SplitText is used to split the nav CTA label "Get started" into per-character spans that drive its roll-over hover).

There is **no** ScrollTrigger, no Lenis, no Swiper, no Three.js, no lottie, no canvas. The entire feel comes from:
- `opacity` + `transform` tweens (never layout properties),
- one CSS keyframe (`spin`, for a rotating icon badge),
- a CSS-only marquee pattern (duplicated flex row + translateX loop),
- scroll progress mapped to keyframe ranges (Webflow "scrolling in view" = what GSAP calls a scrubbed timeline).

That's important for the rebuild: **you need exactly four primitives** — a reveal-on-enter tween, a scrubbed progress timeline, a hover in/out pair, and an infinite marquee — and you can reproduce 100% of this site.

---

## 3. Design tokens

The site ships a proper token system (95 `--_*` CSS variables). The load-bearing ones:

```css
:root {
  /* Primitives */
  --_primitives---neutral--neutral-900: /* #000002-ish page */ ;
  --_primitives---neutral--neutral-800: #2b2b2b;
  --_primitives---primary--primary:    #e393bd;   /* the pink */
  --_primitives---primary--text-grey:  #989898;
  --_primitives---primary--text-dark-grey: #717171;
  --_primitives---opacity--neutral-dark-5:    #0000000d;
  --_primitives---opacity--neutral-light-15:  #ffffff26;  /* ghost button idle */
  --_primitives---opacity--neutral-light-20:  #fff3;     /* ghost button fill */
  --_primitives---opacity--neutral-light-30:  #ffffff4d;  /* ghost button hover */
  --_primitives---opacity--neutral-light-60:  #fff9;

  /* Semantics */
  --_semantics---background-default: neutral-900;  /* = #000002 */
  --_semantics---text:               #fffffe;
  --_semantics---text-v2:            neutral-500;  /* secondary text */
  --_semantics---primary:            #e393bd;
  --_semantics---gradient-1st:       #e393bd;
  --_semantics---gradient-4th:       #f34461;      /* footer link hover pink-red */
  --_semantics---border:             neutral-200;

  /* UI styles */
  --_ui-styles---borderradius--xsmall:  /* inputs */;
  --_ui-styles---borderradius--small:   .8rem;
  --_ui-styles---borderradius--medium:  1rem;
  --_ui-styles---fonts--heading: "42 Dotsans", Arial, sans-serif;
  --_ui-styles---fonts--text:    Inter, sans-serif;
}
```

- **Body:** background `#000002`, color `#fffffe`.
- **Accent:** `#e393bd` (soft pink) with `#f34461` as the secondary gradient stop.
- **Type:** `42 Dotsans` for display headings, `Inter` for everything else.
- **Buttons** are 6px-radius ghost surfaces built from white-alpha steps (`15/20/30` ladder) — hover simply steps the alpha up.

---

## 4. Trigger taxonomy

All 153 events reduce to ten trigger types:

| Trigger | Count share | Used for |
|---|---|---|
| `SCROLL_INTO_VIEW` (offset 0%) | ~½ of all events | fade/move/scale/blur reveals |
| `MOUSE_OVER` / `MOUSE_OUT` | ~60 events | every hover pair (links, buttons, cards, images) |
| `SCROLLING_IN_VIEW` | 11 events | scrubbed choreographies (sticky section, gradients, cards) |
| `MOUSE_CLICK` / `MOUSE_SECOND_CLICK` | pairs | toggles: FAQ open/close, careers accordion |
| `PAGE_START` | 10 events | nav-entrance, about hero float, contact form stagger |
| `NAVBAR_OPEN` / `NAVBAR_CLOSE` | 1 pair | the mobile menu morph (burger→X) |
| `MOUSE_MOVE` | 10 events | footer gradient follows the cursor |
| `MOUSE_X` (continuous) | 1 | footer gradient horizontal mapping |
| Loop timers | via long-duration tweens | marquees (30s / 60s) |

---

## 5. The complete hover inventory

Every hover is an in/out *pair* of action lists — the OUT always restores the initial state with the same duration. Exact data:

### 5.1 Link pill — "Modular Link Background" (nav links)

Trigger: `MOUSE_OVER` / `MOUSE_OUT` on `.nav-link-holder` and `.nav-link`.

```
IN:  group1 (initial state): opacity 0,      scale 0.7
     group2:                 opacity 1 (500ms, ease), scale 1 (500ms, ease)
OUT: opacity 0 (500ms, ease), scale 0.7 (500ms, ease)
```

A rounded background chip behind the label **scales from 0.7 with a fade over 500ms**. Because group 1 is registered as the initial state, the chip is invisible until first hover. The same 3-value pattern (`0.7→1` scale + `0→1` opacity, 500ms, `ease`) is reused for `.link`, `.hero-link` (via separate opacity-only variant), `.nav-link-2` (footer) and `.text-style-link-2`.

**CSS layer:** `.nav-link` color changes to `--_semantics---primary` (pink) on hover; `.link-color` transitions `color 0.35s`; `.nav-link-2:hover { color: rgb(243,68,97) }` — the footer swaps to the hot pink instead.

### 5.2 Underline wipe — "Link Underline -> In/Out" (`.link-with-line`, `.text-style-link-2`)

```
IN:  (initial) underline translated x: -101%
     → x: 0 over 700ms ease
OUT: → x: 101% over 800ms ease
     → snap back to -101% at 0ms
```

An underline bar (child element, width 100%+1%) **slides across the label from left on hover and exits right** — the classic wipe-through effect. The element is `overflow: hidden` so the bar hides outside the label's box. The 0ms snap-back after the exit keeps it hidden for the next entry.

### 5.3 Hero badge pill (`.hero-link`)

- **CSS:** `background rgba(0,0,0,0.1)` → `rgba(0,0,0,0.2)` on hover, `transition: background-color 0.3s, color 0.35s`.
- **IX2:** a secondary glyph inside fades in 300ms (opacity 0→1) — the pill's small icon crossfades to its hover variant.

### 5.4 Split-text rollover CTA ("Get started", `.button`)

The nav CTA's label is split per character by **GSAP SplitText**. Two stacked copies of the label sit inside an `overflow: hidden` box. On hover the top copy slides up (per-char staggered) and the second copy (resting at +20px offset, visible in the a11y tree at `y: 50`) takes its place — a vertical roll. Combined with the pill background scale-in (§5.1), this is the site's most "premium-feeling" hover.

### 5.5 Feature cards — "feature-card-on-hover"

Trigger on cards (all breakpoints; six instances on `/feature`):

```
IN:  (initial) inner image y-offsets: -80 and +80
     → both to y: 0 over 600ms ease
OUT: → -80 / +80 over 600ms ease
```

On hover the card's *inner illustration* is assembled from two halves that **slide together** (one drops from above, one rises from below, 600ms). Hover out splits them apart again.

### 5.6 Big button — "big-button-hover" (`.big-button`, e.g. "Buy this template")

```
IN:  rotate 0 → 45° (500ms ease)     OUT: 45° → 0 (500ms ease)
```

The circular button's inner glyph rotates **45° on hover** — an arrow/plus icon that "aims" itself. Same mechanic as the FAQ plus (below).

### 5.7 About images — "about-image-on-hover"

Two overlapping images per tile; the top one is `opacity 0` initially:
`IN: opacity 1 (700ms ease)` — hover **crossfades to the alternate image**. `OUT` fades back.

### 5.8 Accordion triggers (FAQ / Careers)

**FAQ (`MOUSE_CLICK` + `MOUSE_SECOND_CLICK`):**

```
Open:   plus glyph rotate 0 → 135° (350ms ease)  → becomes an ×
        body fades in (500ms ease)
        height animates open (350ms ease)
Close:  rotate back 0, body fades out, height animates closed
```

**Careers ("Career - Open/Close"):** same plus-glyph rotate to **135°**, plus a size animation — the trigger row expands and the panel content fades in 700ms.

### 5.9 Ghost buttons / form inputs / blog cards (pure CSS)

| Element | Hover | Transition |
|---|---|---|
| `.button.is-secondary` | bg alpha 20 → 30 | instant token step |
| `.button.button-active-card` | bg alpha 20 → 30 | instant |
| `.tab-link` | `opacity: 0.7` | — |
| `.blog-link` | `opacity: 0.8` | `opacity 0.45s` |
| `.form-input` | `opacity: 0.8` | — |
| `.buy-template-panel` | border-color to primary (CSS + IX2 "Buy This Template - Fade In") | — |
| `.active-card-link` | text-decoration none; an absolutely-positioned bordered "bg-2nd" layer lifts z-index (border glow via two stacked layers) | — |

### 5.10 Nav menu morph (mobile)

`NAVBAR_OPEN`: the two burger bars translate ∓8px, fade out (400ms), then two diagonal lines rotate **−45° / +45°** back in — burger→X. `NAVBAR_CLOSE` reverses it. Panels themselves are CSS-positioned dropdowns.

**Hover captures:** `shots/14-hover-nav-link.png`, `shots/15-hover-big-button.png`, `shots/16-hover-buy-template.png`.

---

## 6. Scroll-reveal system

Four reusable reveal "recipes" cover the whole site. All fire at `SCROLL_INTO_VIEW` with **0% offset** (the moment the element's top touches the viewport bottom), all hold an initial hidden state via group-1, all use `ease` (Webflow's easeInOut-ish curve) with **1000ms duration and a 100ms delay**:

| Recipe | Initial → Final | Classes on the site | Where |
|---|---|---|---|
| **Fade + Move** | `opacity 0, y +25px → 1, y 0` (1000ms, delay 100ms) | `.fade-in-move-on-scroll`, `.anim-on-scroll`, `.careers_01-item`, `.faq_02-item`, `.blog-title`, `.footer-link`, `.list-item-with-checkicon`, `.little-grid-item`, `.instruction-item`, most `*` targets | everywhere — the default reveal |
| **Fade only** | `opacity 0 → 1` (1000ms, delay 100ms) | `.fade-in-on-scroll`, `.empty-container`, `.section-background` | dividers, backgrounds |
| **Fade + Scale** | `opacity 0, scale 0.9 → 1, 1` (1000ms, delay 100ms) | `.big-icon-image`, feature-card grids | images, icon tiles |
| **Fade + Blur** | `opacity 0 + blur → 1 + blur 0` (1000ms, delay 100ms) | `.fade-in-blur-on-scroll` | select headings |
| **Fade + "Slace" (scale-down)** | `opacity 0, scale 1.1 → 1, 1` | `.fade-in-slace-on-scroll` | elements that shrink into place |

Staggering is **not per-child timelines** — it is per-element delays: sibling items in one row each carry the same interaction with an incremental delay (visible as e.g. "Anim On Scroll 4/5/2" variants with 700ms/100ms). The gradient-grid section staggers columns at **0 / +300ms / +600ms** (see §7.4).

The reveal envelope to memorise: **`[hidden state] → [visible state], 1000ms, 100ms delay, ease`, trigger at 0% scroll offset, play once.**

---

## 7. Scroll-scrubbed (continuous) choreographies

These are the showpieces. Webflow `SCROLLING_IN_VIEW` = a timeline whose progress is **scroll position through the section** (what GSAP calls a scrub). Each has keyframes at scroll percentages:

### 7.1 `sticky-section-home` — the hero feature walk (shots 02–04)

A 2,400px-tall sticky container (`position: sticky`) pins while the page scrolls 3,038px. Inside, three "expandable items" and three "features texts" swap and a stack of phone screenshots crossfades:

```
40%:  item_1 hides (op 0, y+300); texts_1 fades in; phone shot _4 visible
50%:  item_1 back to op 1 (it pops back OUT — inverted feel); texts_1 op 1
60%:  item_2 fades out → texts swap to _2
65%:  item_2 op 1; phone shot _3 visible; texts_2 in
75%:  shot _3 out; item_3 rises from y+300; texts_2 slides out y-100
80%:  item_3 in; phone shot _2 visible; texts_3 in from y-100
90%:  shot _2 out; texts_3 settles at y-200
```

Read: **left column text blocks fade in/out, center phone screenshots crossfade, right column items pop** — all driven by raw scroll progress at coarse 5–10% keyframes. A 7-keyframe scrub with nothing but opacity + translateY.

### 7.2 `Hero Home Mobile Animation - Desktop` (+ variant 2)

The hero's big phone image:

```
0%:   scale 1.5, translateY -70
100%: scale 1,   translateY 0
```

**The phone zooms out and rises as you scroll away from the hero** — a 2-keyframe scrub. Variant 2 additionally crossfades the same `integrations-image-hero._4/_3/_2` screenshots at 20/40/72%.

### 7.3 `capabilities-section-bg`

```
39%: opacity 0 → 46%: opacity 1
```

A background layer for the capabilities section fades in over a 7% scroll range exactly when the section is centered.

### 7.4 `gradient-show-hide-anim` (+ `-feature` variant)

Two decorative gradient blobs (`gradient-anim-1/2`) ride **behind the content**:

```
20%: op 0 → 32%: op 1 → 50%: op 0     (home)
20%: op 0 → 50%: op 1 → 78%: op 0     (feature page — longer dwell)
```

### 7.5 `gradient-grid-home-anim` — the staggered grid entrance

```
G1 (initial): columns at y+20/30, scale 0.9, op 0
G2:           col1 → y0/scale1 (1000ms)  col2 → delay 300ms  col3 → delay 600ms
```

Three columns rise with a 300ms cascade.

### 7.6 `gradient-text-one-by-one` — text swap carousel (shots 06–08)

Inside a 2,800px gradient section, four text holders occupy the same spot:

```
0–5%:  text_1 fades in from y+20
25%:   text_1 out, text_2 in from y+20
50%:   text_2 out, text_3 in
75%:   text_3 out, text_4 in
```

Each phrase rises 20px as it appears; the outgoing one just fades. **A scroll-driven testimonial/phrase carousel with 4 items and 11 keyframes.**

### 7.7 `no-writing-gradient` — big display-text swap (shots 09–10)

```
25%: big-text_2 op 1 → 35%: out, big-text_3 in
45%: big-text_3 op 1 → 55%: out, big-text_4 in
65%: big-text_4 op 1
```

Same idea as §7.6 but for huge gradient headline lines swapping mid-scroll.

### 7.8 `cards-move-up` — the answers stack (shot 11, feature page §)

Three cards physically **lift off a pile** as you scroll:

```
0%:   card_1 resting, rotate 15°
20%:  card_1 y -170 (lifted), card_2 revealed at rotate -18°
40%:  card_2 y -180, card_3 revealed at rotate 10°
60%:  card_3 y -160
```

Cards rise 160–180px in sequence, each pre-rotated (±10–18°) so the pile looks casually stacked.

### 7.9 `big-about-image-while-scroll`

```
10%: scale 0.9 → 50%: scale 1
```

The about page's big image grows as you scroll past it (subtle Ken-Burns-on-scroll).

### 7.10 `gradient-footer-on-mouse-move`

A `MOUSE_X` continuous action: the footer gradient layer translates `x: -110 → +110` mapped to the cursor's horizontal position — **the footer glow follows your mouse** across the whole section.

### 7.11 `about-hero-images` (PAGE_START, not scrub)

Four decorative hero images drift to offset positions (±20–70px) over **15 seconds** — a slow ambient float loop.

---

## 8. Loops, page-load and timed animations

### 8.1 Marquees (pure translateX loops)

```
CTA-08 Loop:        two layers, x 0 → -100 over 60,000ms (60s), linear, infinite
Community Loop:     30,000ms (30s)
New Timed Animation: y 0 → -100 over 60,000ms (vertical loop)
```

Mechanics (from CSS): `.community-loop` is a flex row at `width: 110%; min-width: 110%`, with a `.community-loop-absolute` duplicate at `margin-left: 2rem; inset: 0 auto 0 100%` — the content exists **twice**, and the loop translates the wrapper until copy 2 sits where copy 1 was, then snaps (0ms reset group). This is the standard CSS marquee pattern; the "animation" is just a 30–60s IX2 tween with a 0ms reset keyframe.

### 8.2 `nav-icon` — 20,000ms rotate to 360°

A small badge/icon in the nav **rotates continuously for 20 seconds per revolution** (`rotate 0 → 360, 20000ms, ease`, reset group at 0ms). The only true "spin" on the site besides the one CSS `spin` keyframe.

### 8.3 `nav-anim` (PAGE_START)

Nav contents: `opacity 0 → 1, 1000ms, delay 200ms`. The nav fades in slightly after first paint.

### 8.4 `contact-page-load` (PAGE_START)

Three form blocks stagger in: `1000ms` with delays **0 / 300 / 600ms**.

### 8.5 `Buy This Template - Fade In`

The floating buy bar: fades in with `y +20 → 0` over 1000ms — **3 seconds after** the section scrolls into view (`delay 3000ms`). Deliberately late so it doesn't compete with section content.

### 8.6 `confirmation-card` / `organized-card` (home sticky companions)

Entrance with personality: `opacity 0, scale 0.9, rotate 0 → opacity 1, scale 1 (1000ms, delay 100) + rotate ∓4.4° (1000ms, delay 300)`. **Cards land slightly rotated** (-6° and +4.44°) — the "tossed on a table" look.

---

## 9. Home page — section by section

**Hero (shots 01–02).** Huge `42 Dotsans` wordmark "Lifelogx" sits center-top. Left: two app-store badges, each a link row with icon + two-line label. Right: the tagline "The friend who never forgets." Below: the phone mockup stack that §7.2 zooms from 1.5→1 as you scroll. Everything above the fold also plays a `nav-anim` fade and the SplitText CTA rolls on hover.

**Sticky feature walk (shots 02–04, video 0:02–0:08).** The centerpiece — §7.1. Left column: three feature text blocks (Interaction / Conversation / Organised). Center: phone screenshots crossfading. Right: "expandable items" that slide up from +300px as their turn comes. The whole 2,400px block is `position: sticky`, so the visual stays pinned while ~3,000px of scroll plays the choreography.

**Divider (shot 05).** 242px strip, fade-only reveal.

**Gradient section (shots 06–08).** 2,800px tall with a background image and two ambient gradient blobs (§7.4). Text phrases swap one-by-one (§7.6) as you scroll — the section *is* the slider. A capabilities background layer fades in at 39–46% (§7.3).

**"No writing" section (shots 09–10).** 2,000px: giant gradient display lines swap mid-scroll (§7.7) over a phone mockup section; the phone has its own zoom-out scrub.

**Answers cards (shot 11).** The stack-lift choreography (§7.8) — cards lift 170–180px one after another.

**Buy CTA (shot 12).** Ghost-button panel, hover = token alpha step; the floating "Buy this template" bar fades in late (§8.5); the big round button rotates its glyph 45° on hover (§5.6).

**Footer (shot 13).** Near-black, links flip to hot pink `#f34461`; the footer gradient layer tracks the cursor's X (§7.10). Store badges repeat with the underline-wipe hover.

---

## 10. Other pages

### About (`shots/17-19`)
- `hero-about` (800px) with the four drifting decorative images (§7.11, 15s ambient float).
- Image tiles with **hover crossfade** (§5.7).
- The `big-about-image` grows 0.9→1 while scrolling (§7.9).
- Careers accordion rows: click → glyph rotates 135°, row expands (§5.7 note).

### Feature (`shots/20-22`)
- `hero-features` (800px), then a 1,418px content section with standard reveals.
- **`answers-card-section-holder` (2,080px)** — the cards-move-up stack (§7.8).
- Six feature cards with the hover split-image effect (§5.5).
- The longer-dwell gradient blobs variant (§7.4).

### Blog (`shot/23`) / Blog post (`shot/24`)
- Blog list: cards dim to 0.8 opacity on hover (`transition: opacity 0.45s`), titles use the fade+move reveal, `blog-title` reveal on the post page.
- Post: rich text with shared token styles; reveals only — no scrubbed sequences.

### Contact (`shot/25`)
- `contact-page-load`: form blocks stagger in at 0/300/600ms on PAGE_START.
- `.form-input` hover dims to 0.8; focus swaps border + background tokens.
- FAQ accordion pattern (§5.7) reused for any collapsible help rows.

---

## 11. Responsive behaviour

- Every IX2 event declares `mediaQueries: ["main", "medium", "small", "tiny"]` — the interactions are authored **per breakpoint** (four editions), not scaled.
- The home hero has a separate mobile scrub (`sticky-section-home-mobile`, 7 keyframes over a compressed range) and its own hero phone zoom (`Hero Home Mobile Animation`, scale 1.5→1, y −70→0).
- The navbar collapses to the burger morph (§5.10) below `medium`.
- Mobile capture: `shots/26-home-mobile.png` (Pixel-7 412×915).

---

## 12. THE PLAN — rebuilding this, step by step

Target stack recommendation: **Next.js/React + GSAP core + ScrollTrigger + SplitText (free since 3.13) + Lenis (optional)**. GSAP maps 1:1 onto IX2 semantics: `ScrollTrigger` = `SCROLL_INTO_VIEW`/`SCROLLING_IN_VIEW`, `gsap.to` with reversal = hover pairs, `repeat: -1` = loops. Everything below uses **only** transform/opacity.

### Phase 0 — Foundation (half day)

1. Define the token layer exactly as §3 (95 vars → prune to ~40 you'll use): bg `#000002`, text `#fffffe`, accent `#e393bd`, accent-2 `#f34461`, alpha ladder `4/15/20/30/60`, radii `.8/1rem`, display font + body font. Ship as CSS custom properties + Tailwind theme extension if you use Tailwind.
2. Install `gsap`, `@gsap/splittext` (or the npm `gsap/SplitText`), `lenis` (only if you want inertial smooth scroll — the original does NOT smooth-scroll).
3. Create the app shell: a `RevealProvider` that registers one IntersectionObserver-based `data-reveal` system, and a `useScrollProgress(ref)` hook wrapping ScrollTrigger scrub.

### Phase 1 — The four reveal primitives (1 day)

4. `data-reveal="fade-move" | "fade" | "fade-scale" | "fade-blur" | "fade-scale-down"` attribute → observer at threshold 0 → `gsap.to(el, { opacity: 1, y: 0, duration: 1, delay: 0.1, ease: 'power2.out', paused reveal once })`. Initial states set via CSS (`[data-reveal]{opacity:0}`) so there's no flash.
   - Map every element class from §6 onto one of these. Default duration **1s, delay 100ms** everywhere — the site's uniform cadence is why it feels calm.
5. Stagger: `data-reveal-stagger="300"` on a grid parent → per-child delay `i * 300ms` (mirrors `gradient-grid-home-anim` and the 0/300/600 column cascade).
6. Late reveals: `data-reveal-delay="3000"` for the buy bar (§8.5).

### Phase 2 — Hover system (1 day)

7. `<HoverPill>` — nav link background: span scaled 0.7/op 0 → 1/1 on enter, reverse on leave, 500ms power2. Keep it a paired in/out tween so interruption is instant (GSAP `overwrite: 'auto'`).
8. `<WipeLink>` — underline bar: `xPercent -101 → 0` in 700ms on enter, `0 → 101` in 800ms on leave then snap to -101. Bar is `width: calc(100% + 1px)` inside `overflow: hidden`.
9. `<SplitRoll CTA>` — SplitText the label into chars, two stacked copies, on hover animate both copies `y: -100%` (out) and `y: 0→-100%` (in) with a 0.02s char stagger; combined with the HoverPill background.
10. `<MorphIcon>` for FAQ/careers/big-button — rotate 135° (or 45°) on state change, 350–500ms power2.
11. `<SplitImageCard>` — hover slides two half-images together (y ∓80 → 0, 600ms).
12. `<CrossfadeImage>` — hover fades to the alt image (700ms).
13. Pure-CSS hovers (no JS): ghost buttons via alpha tokens 20→30, blog card `opacity .8` 450ms, tab links 0.7, inputs 0.8.

### Phase 3 — Scrubbed choreographies (2 days)

14. `StickyFeatures` (home §7.1): a sticky container of height N; a `ScrollTrigger` with `scrub: true, start: 'top top', end: '+=2400'`; a single timeline with the 7-keyframe table from §7.1 transcribed literally (positions in %). Items: `y: 300, autoAlpha: 0` keyframes; phone shots: crossfade at 50/65/80%.
15. `HeroZoom` (§7.2): scrub `scale 1.5→1, y -70→0` across the hero's own height.
16. `GradientBlobs` (§7.4): scrub `autoAlpha 0→1→0` between 20–32–50% of the section.
17. `TextSwap` (§7.6/7.7): generic component taking `items: string[]` and a keyframe table; renders stacked absolute text lines; timeline swaps them (out = fade, in = fade + y 20→0) at the scroll percentages. Reuse for both the phrase carousel and the big gradient headline.
18. `CardsMoveUp` (§7.8): three absolutely stacked cards, pre-rotated 15/−18/10°, scrubbed `y: -170/-180/-160` at 20/40/60%.
19. `MouseGradient` (§7.10): footer layer, `x: -110→110` mapped to cursor X over the footer (quickTo for smoothness).
20. `ScaleOnScroll` (§7.9): scrub 0.9→1 across the image's passage.
21. `SectionBgFade` (§7.3): scrub opacity 0→1 across 39–46% of its wrapper.

### Phase 4 — Loops, page load, menus (half day)

22. `Marquee` component: duplicated flex row (`width: 110%`), GSAP `xPercent: -50` — no wait: match the site — translate content width with a 30s/60s linear infinite tween + snap reset; or CSS `@keyframes marquee { to { transform: translateX(-50%) } }` on a doubled row (simpler, GPU-cheap, identical look).
23. Spin badge: CSS `@keyframes spin` 20s linear infinite (the site's one CSS keyframe).
24. Page-load stagger: nav fade (200ms delay), contact form rows 0/300/600ms, ambient hero drift (15s yoyo floats ±20–70px).
25. Burger morph: two bars, translate ∓8 + fade (400ms), diagonals rotate ∓45° in (400ms, delay 400ms); reverse on close (exact table in §5.10).

### Phase 5 — Responsive & polish (1 day)

26. `gsap.matchMedia()`: author the desktop scrubs under `(min-width: 992px)`, the mobile variants (compressed sticky walk, hero zoom) under tablet/phone editions — mirroring Webflow's four breakpoints.
27. `prefers-reduced-motion`: kill scrub timelines (leave static final states), keep only opacity crossfades ≤ 200ms, stop marquees, stop the spin.
28. Performance pass: everything is transform/opacity already; add `will-change: transform` only on the sticky elements and the marquee rows; ensure the sticky section is `contain: layout paint` candidate; lazy-mount below-fold scrubs (ScrollTrigger handles this natively).

### Phase 6 — Content & pages (1–2 days)

29. Build the page skeletons from §1's section map: home (9 sections), about (4), feature (6), blog (1), post (rich text), contact (form). Apply primitives per the section walkthroughs (§9–10).
30. Reproduce the composition details: tossed cards (±4–15° resting rotations), the `42 Dotsans`-class display font at hero scale, near-black `#000002` canvas, pink `#e393bd` accents, ghost-alpha buttons, hairline borders.

**Total estimate: ~6 focused days** for a faithful clone; 2 days for the skeleton (hero + sticky walk + reveals + footer) which already delivers 80% of the perceived motion.

### Component/API sketch

```tsx
<Section data-reveal-stagger={300}>          {/* Phase 1 */}
<HoverPill label="Features" />                {/* Phase 2 */}
<SplitRoll label="Get started" />             {/* Phase 2 */}
<WipeLink>Read the changelog</WipeLink>       {/* Phase 2 */}
<StickyFeatures steps={steps} />              {/* Phase 3 */}
<TextSwap items={phrases} />                  {/* Phase 3 */}
<CardsMoveUp cards={cards} />                  {/* Phase 3 */}
<Marquee speed={30}>{logos}</Marquee>          {/* Phase 4 */}
<MouseGradientFooter />                       {/* Phase 3 */}
```

---

## 13. Performance & accessibility rules the site follows

- **Transform + opacity only.** No scroll-driven width/height/top/left anywhere. The two height animations (FAQ/careers accordions) are click-triggered, not scroll-linked.
- **Initial states are baked** (group-1 "initial state" pattern / CSS defaults), so first paint never flashes content then hides it.
- **One IntersectionObserver** (Webflow's engine) drives all ~90 reveal events; there are no per-element scroll listeners — the scrubs ride one rAF-linked scroll channel.
- **0% scroll offset** on reveals (fire early, feel eager) but **scrubs start at 10–20%** (feel deliberate).
- **Uniform timing**: 500ms hovers, 1000ms+100ms reveals, 350–700ms accordions. The consistency is the polish.
- **Reduced motion**: the shipped Webflow runtime respects it for IX2 by default; a rebuild should gate per Phase 5 §27.
- Focus states: `:focus-visible` outlines are left to the browser defaults on this site (a template shortcut — a quality rebuild should add custom mint focus rings).

---

## 14. Licensing note

LifelogX is a **paid Webflow template** (© Azwedo / Wedoflow). This study is for learning and private experimentation. Don't ship a pixel-for-pixel commercial clone of it; use the mechanics — the reveal grammar, the scrub choreographies, the hover pairs — with your own content and brand (which, for TunePay, you already have).

---

## Artifact index

- `shots/01…26` — 26 viewport captures (13 home scroll positions, 3 hover states, about ×3, feature ×3, blog, post, contact, 1 mobile).
- `home-scroll-through.mp4` — live 20s scroll recording of the full home page.
