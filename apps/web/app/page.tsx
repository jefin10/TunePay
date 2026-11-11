import { Closing } from "./components/Closing";
import { Features } from "./components/Features";
import { Hero } from "./components/Hero";
import { Nav } from "./components/Nav";
import { Showcase } from "./components/Showcase";
import { UnderTheHood } from "./components/UnderTheHood";

export default function Home() {
  return (
    <div id="top" className="relative overflow-x-clip">
      <div aria-hidden className="page-grid" />
      <Nav />
      <main>
        <Hero />
        <Features />
        <Showcase />
        <UnderTheHood />
        <Closing />
      </main>
    </div>
  );
}
