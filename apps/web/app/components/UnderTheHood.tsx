const PARTS = [
  {
    name: "Mobile app",
    stack: "React Native · Expo · TypeScript",
    body: "Expo Router screens, React Query data, native biometrics, camera, contacts and speech recognition.",
  },
  {
    name: "Payments API",
    stack: "Django · PostgreSQL",
    body: "OTP sign-in, accounts, transfers by phone or UPI ID, and money requests.",
  },
  {
    name: "Voice intelligence",
    stack: "Flask · TensorFlow · spaCy",
    body: "A CNN intent classifier decides what you asked for; named-entity extraction finds who and how much.",
  },
  {
    name: "Conversation",
    stack: "Rasa",
    body: "Anything that is not a payment, like “hello” or “what can you do?”, goes to a Rasa assistant.",
  },
];

const FLOW = ["You speak", "Intent (CNN)", "Name + amount", "You confirm", "Transfer"];

export function UnderTheHood() {
  return (
    <section id="under-the-hood" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="eyebrow">
            <span className="eyebrow-dot" /> Under the hood
          </p>
          <h2 className="section-title mt-5">Four services, one sentence.</h2>
          <p className="mt-4 text-lg text-slate-400">
            TunePay is open source. Every part runs in Docker next to the app.
          </p>
        </div>

        <ol className="mt-12 flex flex-wrap items-center gap-2 text-sm">
          {FLOW.map((f, i) => (
            <li key={f} className="flex items-center gap-2">
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-slate-200">
                {f}
              </span>
              {i < FLOW.length - 1 && (
                <svg aria-hidden viewBox="0 0 20 20" className="h-4 w-4 text-violet-400" fill="currentColor">
                  <path d="M7.3 4.3a1 1 0 0 1 1.4 0l5 5a1 1 0 0 1 0 1.4l-5 5a1 1 0 0 1-1.4-1.4L11.6 10 7.3 5.7a1 1 0 0 1 0-1.4Z" />
                </svg>
              )}
            </li>
          ))}
        </ol>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PARTS.map((p) => (
            <div key={p.name} className="glass-card">
              <p className="font-mono text-xs uppercase tracking-widest text-violet-300">{p.stack}</p>
              <h3 className="mt-4 text-lg font-semibold text-white">{p.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
