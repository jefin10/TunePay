"use client";

import { useRef } from "react";

import { gsap, prefersReducedMotion, useGSAP } from "../../lib/gsap";
import type { ScreenId } from "../../lib/screens";
import { Device } from "../ui/Device";
import { Glyph, type GlyphName, type Tone } from "../ui/Glyph";
import { StoreLinks } from "../ui/StoreLinks";

type Step = {
  title: string;
  glyph: GlyphName;
  tone: Tone;
  blurb: string;
  tags: string[];
  heading: string;
  body: string;
  shot: ScreenId;
};

const STEPS: Step[] = [
  {
    title: "Speak",
    glyph: "mic",
    tone: "mint",
    blurb: "Tap the mic and say it the way you’d text it.",
    tags: ["Voice", "Intent", "UPI"],
    heading: "Say it once, out loud",
    body: "“Send ₹500 to Priya.” Your phone turns speech into text, and a small model works out whether you want to pay, request money or check your balance.",
    shot: "listening",
  },
  {
    title: "Confirm",
    glyph: "shield",
    tone: "teal",
    blurb: "See who gets paid and how much before anything moves.",
    tags: ["Contacts", "UPI ID", "Phone"],
    heading: "Check who and how much",
    body: "TunePay finds the person in your contacts or by UPI ID and fills in the amount. You can still change it before you confirm.",
    shot: "pay",
  },
  {
    title: "Paid",
    glyph: "bolt",
    tone: "lime",
    blurb: "Your fingerprint sends it. The receipt is already filed.",
    tags: ["Biometrics", "History", "Receipts"],
    heading: "Paid, and on the record",
    body: "Nothing moves until you confirm with your fingerprint or device PIN. Then the money lands and the transfer shows up in your history.",
    shot: "success",
  },
];

const SHOTS: ScreenId[] = ["home", ...STEPS.map((s) => s.shot)];
const COLLAPSED = 76;
const EXPANDED = 300;

/**
 * Hero wordmark + the scroll-jacked feature walk (study §7.1, §7.2).
 *
 * One scrubbed timeline runs from the top of the page to the end of the
 * pinned block: first the hero phone zooms out (1.5 → 1, y −70 → 0), then
 * three steps play: the left item rises from +300px and expands, the
 * right copy swaps, and the phone crossfades to that step's screen.
 */
export function HeroWalk() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ desktop: "(min-width: 1024px)", mobile: "(max-width: 1023px)" }, (ctx) => {
        const desktop = Boolean(ctx.conditions?.desktop);
        const travel = prefersReducedMotion() ? 0 : 1;
        const q = gsap.utils.selector(root);
        const walk = q(".walk")[0];
        const phone = q(".walk-phone")[0];
        const sides = q(".hero-sides")[0];
        const items = q(".walk-item");
        const descs = q(".walk-item-desc");
        const texts = q(".walk-text");
        const shot = (id: ScreenId) => q(`[data-shot="${id}"]`);

        gsap.set(items, { autoAlpha: 0, y: 300 * travel, height: COLLAPSED });
        gsap.set(descs, { autoAlpha: 0 });
        gsap.set(texts, { autoAlpha: 0 });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: walk,
            start: 0,
            end: "bottom bottom",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        // Hero zoom-out, and the store links / tagline fading as they leave.
        tl.fromTo(
          phone,
          { scale: travel ? (desktop ? 1.5 : 1.2) : 1, y: -70 * travel },
          { scale: 1, y: 0, duration: 1 },
          0,
        );
        if (desktop) tl.to(sides, { autoAlpha: 0, duration: 0.4 }, 0.1);

        STEPS.forEach((step, i) => {
          const at = 1.3 + i * 1.4;
          const prev = i === 0 ? "home" : STEPS[i - 1].shot;
          if (i > 0) {
            tl.to(items[i - 1], { height: COLLAPSED, duration: 0.5 }, at)
              .to(descs[i - 1], { autoAlpha: 0, duration: 0.2 }, at)
              .to(texts[i - 1], { autoAlpha: 0, y: -100 * travel, duration: 0.25 }, at);
          }
          tl.to(items[i], { autoAlpha: 1, y: 0, height: EXPANDED, duration: 0.5 }, at)
            .to(descs[i], { autoAlpha: 1, duration: 0.3 }, at + 0.25)
            .fromTo(texts[i], { autoAlpha: 0, y: 100 * travel }, { autoAlpha: 1, y: 0, duration: 0.4 }, at + 0.25)
            // Screens are opaque and later ones sit above earlier ones, so fade the
            // new screen in on top and only then drop the old one: no dim midpoint.
            .fromTo(shot(step.shot), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35 }, at)
            .to(shot(prev), { autoAlpha: 0, duration: 0.01 }, at + 0.35);
        });

        // All three settle into their collapsed rows, then a short hold.
        const end = 1.3 + STEPS.length * 1.4;
        tl.to(items[STEPS.length - 1], { height: COLLAPSED, duration: 0.5 }, end - 0.2)
          .to(descs[STEPS.length - 1], { autoAlpha: 0, duration: 0.2 }, end - 0.2)
          .to({}, { duration: 0.6 });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="hero" aria-labelledby="hero-title">
      <div aria-hidden className="hero-haze" />

      <div className="hero-head">
        <h1 id="hero-title" className="hero-word">
          TunePay<span className="sr-only">: pay anyone by saying it</span>
        </h1>
        <div className="hero-sides">
          <StoreLinks />
          <p className="hero-tagline">Your voice is your wallet.</p>
        </div>
      </div>

      <div className="walk" id="how-it-works">
        <div className="walk-sticky">
          <div className="walk-left">
            {STEPS.map((s) => (
              <div key={s.title} className={`walk-item tone-${s.tone}`}>
                <p className="walk-item-desc">{s.blurb}</p>
                <div className="walk-item-head">
                  <Glyph name={s.glyph} tone={s.tone} />
                  {s.title}
                </div>
              </div>
            ))}
          </div>

          <div className="walk-center">
            <Device className="walk-phone" shots={SHOTS} priority />
          </div>

          <div className="walk-right">
            {STEPS.map((s) => (
              <article key={s.title} className="walk-text">
                <p className="tags">{s.tags.join(" • ")}</p>
                <h2 className="walk-heading">{s.heading}</h2>
                <p className="walk-body">{s.body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
