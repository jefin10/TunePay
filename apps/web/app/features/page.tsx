import type { Metadata } from "next";

import { CardPile } from "../components/features/CardPile";
import { Faq } from "../components/features/Faq";
import { FeatureCards } from "../components/features/FeatureCards";
import { PageHero } from "../components/features/PageHero";
import { CtaPanel } from "../components/home/CtaPanel";

export const metadata: Metadata = {
  title: "Features",
  description: "Pay by voice, pay anyone, scan and pay, request money, searchable history and a biometric lock.",
};

export default function FeaturesPage() {
  return (
    <main>
      <PageHero
        accent="Say it once"
        title="Paid in seconds"
        body="Every feature cuts a step between deciding to pay and the money landing: no IDs to type, no amounts to fiddle with, nothing sent without your fingerprint."
        drifts={[
          { kind: "shot", shot: "home", left: "0", top: "5rem", dx: "24px", dy: "-30px" },
          { kind: "shot", shot: "scan", left: "calc(50% - 6.5rem)", top: "5rem", dx: "-20px", dy: "16px", delay: "-4s", wide: true },
          { kind: "shot", shot: "history", right: "0", top: "7.5rem", dx: "-26px", dy: "34px", delay: "-8s" },
          { kind: "shot", shot: "requests", left: "10%", bottom: "8%", dx: "30px", dy: "-22px", delay: "-2s" },
          { kind: "shot", shot: "security", right: "12%", bottom: "-2%", dx: "-18px", dy: "-36px", delay: "-6s" },
        ]}
      />
      <CardPile />
      <FeatureCards />
      <Faq />
      <CtaPanel />
    </main>
  );
}
