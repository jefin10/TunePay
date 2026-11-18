import { APK_URL } from "../../lib/screens";
import { Device } from "../ui/Device";
import { ArrowUpRight } from "../ui/Icons";
import { LogoMark } from "../ui/Logo";

/** The closing panel; its round button turns its arrow 45° on hover (study §5.6). */
export function CtaPanel() {
  return (
    <section className="cta" aria-labelledby="cta-title">
      <div className="cta-panel" data-reveal="fade-move">
        <div className="cta-copy">
          <h2 id="cta-title">
            Your voice is your wallet
            <br />
            As simple as talking
          </h2>
          <div className="cta-app">
            <span className="cta-icon">
              <LogoMark ink="#04140d" accent="#fffffe" />
            </span>
            <span className="min-w-0">
              <b>TunePay</b>
              <small>Say it. It’s paid.</small>
            </span>
            <a href={APK_URL} className="big-btn" rel="noopener noreferrer" aria-label="Download TunePay for Android">
              <ArrowUpRight />
            </a>
          </div>
        </div>
        <div aria-hidden className="cta-art">
          <Device className="cta-phone" shots={["success"]} sizes="300px" />
        </div>
      </div>
    </section>
  );
}
