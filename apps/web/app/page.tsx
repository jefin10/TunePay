import { CtaPanel } from "./components/home/CtaPanel";
import { Divider } from "./components/home/Divider";
import { HeroWalk } from "./components/home/HeroWalk";
import { IsThisYou } from "./components/home/IsThisYou";
import { NoTyping } from "./components/home/NoTyping";
import { SimpleGrid } from "./components/home/SimpleGrid";
import { VoiceSection } from "./components/home/VoiceSection";

export default function Home() {
  return (
    <main>
      <HeroWalk />
      <Divider />
      <VoiceSection />
      <IsThisYou />
      <NoTyping />
      <SimpleGrid />
      <CtaPanel />
    </main>
  );
}
