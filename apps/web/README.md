# TunePay Landing Page

Marketing site for TunePay, built with Next.js 16, React 19, Tailwind CSS 4 and GSAP (ScrollTrigger). It introduces the app and links to the latest Android build.

## Development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run lint
```

Pages: `app/page.tsx` (home), `app/features/page.tsx` and `app/about/page.tsx`. The nav, footer and floating download bar are in `app/layout.tsx`. App screenshots are in `public/screens/`, logos in `public/`.

## Motion

The site follows the motion grammar documented in `docs/lifelogx/LIFELOGX-ANIMATION-STUDY.md`, in TunePay's mint:

- **Reveals:** add `data-reveal="fade-move" | "fade" | "fade-scale" | "fade-blur" | "scale-down" | "grid"` to any element (optional `--d` delay). One observer in `components/site/SiteEffects.tsx` plays them once, 1000ms + 100ms on `ease`.
- **Hovers:** nav pills and the split-text roll (`ui/RollLabel.tsx`) are pure CSS; underline wipes are any `.wipe` element with a `.wipe-line` > `.wipe-bar` inside.
- **Scrubbed sections** use GSAP ScrollTrigger: the hero zoom and sticky walk (`home/HeroWalk.tsx`), phrase swap (`home/VoiceSection.tsx`), big-word swap (`home/NoTyping.tsx`), card pile (`features/CardPile.tsx`) and scale-on-scroll (`about/ScaleShowcase.tsx`).
- **Illustrations** are the glossy glyphs in `components/ui/Glyph.tsx`.
- `prefers-reduced-motion` keeps opacity crossfades and drops all travel, loops and drifts.

## APK download

The download buttons point to:

```
https://github.com/jefin10/TunePay/releases/latest/download/app-release.apk
```

Publish each Android build (see `../mobile/README.md`) as a GitHub release asset named `app-release.apk` to keep the link working.
