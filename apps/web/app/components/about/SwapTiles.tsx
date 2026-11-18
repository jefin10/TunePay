import Image from "next/image";
import type { CSSProperties } from "react";

import { SCREENS, type ScreenId } from "../../lib/screens";

const TILES: { title: string; body: string; a: ScreenId; b: ScreenId }[] = [
  { title: "Built around one button", body: "The mic sits in the middle of the nav bar, one thumb away.", a: "home", b: "voice" },
  { title: "Asks before it acts", body: "Every payment stops on a confirm sheet you can still edit.", a: "listening", b: "pay" },
  { title: "Keeps the receipts", body: "Sent, received and failed, searchable by name.", a: "success", b: "history" },
];

/** Hover a tile and its screenshot crossfades to the next step (700ms, study §5.7). */
export function SwapTiles() {
  return (
    <section className="px-[var(--pad-x)] py-24" aria-labelledby="swap-title">
      <h2
        id="swap-title"
        data-reveal="fade-move"
        className="font-display mx-auto mb-14 max-w-3xl text-center text-[clamp(2.2rem,5vw,4rem)] leading-[1.08] font-medium tracking-[-0.03em]"
      >
        Small screens,
        <br />
        <span className="text-mint-grad">clear decisions</span>
      </h2>
      <div className="mx-auto grid max-w-[82rem] gap-6 md:grid-cols-3">
        {TILES.map((t, i) => (
          <article
            key={t.title}
            tabIndex={0}
            className="swap-card"
            data-reveal="fade-scale"
            style={{ "--d": `${i * 150}ms` } as CSSProperties}
          >
            <div className="swap-tile">
              <Image src={SCREENS[t.a].src} alt={SCREENS[t.a].alt} fill sizes="(max-width: 768px) 92vw, 420px" />
              <Image src={SCREENS[t.b].src} alt="" fill sizes="(max-width: 768px) 92vw, 420px" className="swap-alt" />
            </div>
            <h3 className="font-display mt-5 text-2xl font-medium tracking-[-0.015em]">{t.title}</h3>
            <p className="mt-2 leading-relaxed text-fog">{t.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
