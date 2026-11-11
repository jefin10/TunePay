"use client";

import { useEffect, useRef, useState } from "react";

import type { ScreenId } from "../lib/screens";
import { Phone } from "./Phone";

type Step = {
  kicker: string;
  title: string;
  body: string;
  screen: ScreenId;
  tilt: [number, number];
};

const STEPS: Step[] = [
  {
    kicker: "01",
    title: "Tap the mic.",
    body: "Open the voice tab, or hit the mic in the middle of the nav bar, and TunePay starts listening.",
    screen: "voice",
    tilt: [4, 22],
  },
  {
    kicker: "02",
    title: "Say it like you’d text it.",
    body: "“Send 500 to Priya.” “What’s my balance?” “Request 300 from Mom.” A CNN classifies the intent and spaCy pulls out the name, number and amount.",
    screen: "listening",
    tilt: [6, -22],
  },
  {
    kicker: "03",
    title: "Check who and how much.",
    body: "TunePay finds the person in your contacts or on UPI and shows who will be paid, with the amount still editable before you confirm.",
    screen: "pay",
    tilt: [2, 20],
  },
  {
    kicker: "04",
    title: "Confirm, and it’s sent.",
    body: "Nothing moves until you confirm with your fingerprint or device PIN. Then the money lands and the transfer shows up in your history.",
    screen: "success",
    tilt: [8, -18],
  },
];

/**
 * The phone stays pinned in the viewport while the step cards scroll past
 * it; whichever card crosses the middle of the screen drives the phone.
 */
export function Showcase() {
  const [active, setActive] = useState(0);
  const stepRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(Number((entry.target as HTMLElement).dataset.step));
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    stepRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const step = STEPS[active];

  return (
    <section id="how-it-works" className="relative scroll-mt-16 pt-24 sm:pt-32">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <p className="eyebrow mx-auto">
          <span className="eyebrow-dot" /> How it works
        </p>
        <h2 className="section-title mx-auto mt-5 max-w-3xl">
          From a sentence to a settled payment in four steps.
        </h2>
      </div>

      <div className="relative mt-8">
        <div className="pointer-events-none sticky top-0 flex h-[100svh] items-start justify-center pt-24 lg:items-center lg:pt-0">
          <Phone
            screen={step.screen}
            rotateX={step.tilt[0]}
            rotateY={step.tilt[1]}
            className="phone-showcase"
          />
          <ol aria-hidden className="showcase-progress">
            {STEPS.map((s, i) => (
              <li key={s.kicker} className={i === active ? "is-active" : ""} />
            ))}
          </ol>
        </div>

        <div className="relative -mt-[100svh]">
          {STEPS.map((s, i) => (
            <article
              key={s.kicker}
              ref={(el) => {
                stepRefs.current[i] = el;
              }}
              data-step={i}
              className={`flex min-h-[100svh] items-end px-4 pb-10 sm:px-6 lg:items-center lg:px-8 lg:pb-0 ${
                i % 2 ? "lg:justify-end" : "lg:justify-start"
              } justify-center`}
            >
              <div
                className={`showcase-card ${i === active ? "is-active" : ""} lg:mx-[max(2rem,calc((100vw-80rem)/2+2rem))]`}
              >
                <span className="font-mono text-sm text-violet-300">{s.kicker}</span>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  {s.title}
                </h3>
                <p className="mt-3 leading-relaxed text-slate-300">{s.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
