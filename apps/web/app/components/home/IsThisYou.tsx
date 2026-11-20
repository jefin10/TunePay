import type { CSSProperties } from "react";

import { TONES, type Tone } from "../ui/Glyph";

type Said = { who: string; text: string; tone: Tone };

const ROWS: { dur: number; reverse?: boolean; items: Said[] }[] = [
  {
    dur: 45,
    items: [
      { who: "RK", text: "What’s your UPI ID again?", tone: "mint" },
      { who: "AN", text: "I’ll pay you back later.", tone: "lime" },
      { who: "SV", text: "Typing the amount is a pain.", tone: "teal" },
      { who: "MJ", text: "My hands are full.", tone: "emerald" },
    ],
  },
  {
    dur: 60,
    reverse: true,
    items: [
      { who: "PS", text: "The QR is too far away.", tone: "teal" },
      { who: "DK", text: "I can’t read the tiny text.", tone: "mint" },
      { who: "TA", text: "Which app did I pay from?", tone: "lime" },
      { who: "NB", text: "Send it to my number.", tone: "emerald" },
    ],
  },
  {
    dur: 35,
    items: [
      { who: "VR", text: "Splitting the bill takes forever.", tone: "lime" },
      { who: "KM", text: "I’m driving, can it wait?", tone: "emerald" },
      { who: "LS", text: "Did that payment go through?", tone: "mint" },
      { who: "OJ", text: "Who did I just pay?", tone: "teal" },
    ],
  },
];

function Pill({ said, hidden }: { said: Said; hidden?: boolean }) {
  const [hi, mid, lo] = TONES[said.tone];
  return (
    <span className="ity-pill" aria-hidden={hidden || undefined}>
      <span className="avatar" style={{ "--hi": hi, "--mid": mid, "--lo": lo } as CSSProperties}>
        {said.who}
      </span>
      {said.text}
    </span>
  );
}

/**
 * "Is this you?": three rows of the things people say about paying,
 * looping at different speeds and directions (study §8.1). Each row is
 * the content twice, translated by exactly one copy so the loop is seamless.
 */
export function IsThisYou() {
  return (
    <section className="ity" aria-labelledby="ity-title">
      <h2 id="ity-title" className="ity-title" data-reveal="fade-move">
        Is this you?
      </h2>
      <div className="ity-rows">
        {ROWS.map((row, r) => (
          <div
            key={r}
            className="marquee"
            style={{ "--dur": `${row.dur}s`, "--dir": row.reverse ? "reverse" : "normal" } as CSSProperties}
          >
            <div className="marquee-track">
              {row.items.map((s) => (
                <Pill key={s.text} said={s} />
              ))}
              {row.items.map((s) => (
                <Pill key={`${s.text}-copy`} said={s} hidden />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
