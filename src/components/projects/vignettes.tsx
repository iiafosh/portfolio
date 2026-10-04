import type { VignetteKind } from "@/content/types"
import { cn } from "@/lib/utils"

// Live covers for projects without screenshots: a small product moment on
// a scenic gradient, like joshtilton.com's screens-on-wallpaper cards.
// Pure SVG + CSS; every loop stops under reduced motion and only plays
// while the card is hovered or the sheet is open (".vg-live").

export function Vignette({ kind, live = false, className }: { kind: VignetteKind; live?: boolean; className?: string }) {
  return (
    <div className={cn("vg", `vg-${kind}`, live && "vg-live", className)} aria-hidden="true">
      {kind === "watch" ? <Watch /> : null}
      {kind === "robo" ? <Robo /> : null}
      {kind === "numlab" ? <NumLab /> : null}
      {kind === "chat" ? <Chat /> : null}
      {kind === "portfolio" ? <Portfolio /> : null}
      {kind === "respark" ? <ReSpark /> : null}
      {kind === "fish" ? <Fallback kind={kind} /> : null}
    </div>
  )
}

function Watch() {
  return (
    <div className="vg-stage">
      <div className="watch">
        <span className="watch-strap watch-strap-top" />
        <span className="watch-strap watch-strap-bottom" />
        <div className="watch-case">
          <div className="watch-face">
            <svg viewBox="0 0 120 120" className="watch-svg">
              <circle cx="60" cy="60" r="56" fill="none" stroke="rgb(255 255 255 / 0.08)" strokeWidth="2" />
              <circle
                cx="60"
                cy="60"
                r="56"
                fill="none"
                stroke="#fb7185"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="250 352"
                transform="rotate(-90 60 60)"
                className="watch-ring"
              />
              <path
                className="watch-ecg"
                d="M14 66 h18 l5 -10 l6 22 l7 -40 l7 34 l4 -6 h12 l5 -8 l5 8 h33"
                fill="none"
                stroke="#fb7185"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="watch-readout">
              <span className="watch-bpm">
                <span className="watch-heart">♥</span> 76
              </span>
              <span className="watch-unit">bpm</span>
              <span className="watch-steps">6,214 steps</span>
            </div>
            <span className="watch-lora" />
          </div>
        </div>
      </div>
    </div>
  )
}

function Robo() {
  return (
    <div className="vg-stage">
      <div className="vg-window robo-window">
        <div className="vg-titlebar">
          <span />
          <span />
          <span />
          <p>Robo-Space · predictive maintenance</p>
        </div>
        <div className="robo-body">
          {[
            ["TEMP", "302.4 K", "robo-n1"],
            ["RPM", "1,538", "robo-n2"],
            ["TORQUE", "41.2 Nm", "robo-n3"],
          ].map(([label, value, needle]) => (
            <div key={label} className="robo-gauge">
              <svg viewBox="0 0 60 36">
                <path d="M6 32 A24 24 0 0 1 54 32" fill="none" stroke="rgb(255 255 255 / 0.14)" strokeWidth="5" strokeLinecap="round" />
                <path
                  d="M6 32 A24 24 0 0 1 54 32"
                  fill="none"
                  stroke="url(#robo-arc)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray="76"
                  strokeDashoffset="18"
                />
                <defs>
                  <linearGradient id="robo-arc" x1="0" x2="1">
                    <stop offset="0" stopColor="#34d399" />
                    <stop offset="0.7" stopColor="#fbbf24" />
                    <stop offset="1" stopColor="#f87171" />
                  </linearGradient>
                </defs>
                <line x1="30" y1="32" x2="30" y2="13" stroke="white" strokeWidth="2" strokeLinecap="round" className={needle} />
                <circle cx="30" cy="32" r="2.6" fill="white" />
              </svg>
              <p className="robo-label">{label}</p>
              <p className="robo-value">{value}</p>
            </div>
          ))}
          <div className="robo-risk">
            <div className="robo-risk-head">
              <span>Failure risk · Random Forest</span>
              <span className="robo-pct">12%</span>
            </div>
            <div className="robo-bar">
              <span />
            </div>
            <div className="robo-tags">
              {["TWF", "HDF", "PWF", "OSF", "RNF", "OK"].map((t) => (
                <span key={t} className={t === "OK" ? "robo-ok" : undefined}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function NumLab() {
  return (
    <div className="vg-stage">
      <div className="vg-window num-window">
        <div className="vg-titlebar">
          <span />
          <span />
          <span />
          <p>NumLab · Newton–Raphson</p>
        </div>
        <div className="num-body">
          <svg viewBox="0 0 200 120" className="num-plot">
            <line x1="10" y1="80" x2="194" y2="80" stroke="rgb(255 255 255 / 0.25)" strokeWidth="0.8" />
            <line x1="40" y1="8" x2="40" y2="112" stroke="rgb(255 255 255 / 0.25)" strokeWidth="0.8" />
            <path d="M14 112 C 60 108, 92 96, 112 80 S 160 26, 190 10" fill="none" stroke="#a5b4fc" strokeWidth="2.2" />
            <line x1="190" y1="10" x2="140" y2="80" stroke="#fde68a" strokeWidth="1.2" strokeDasharray="3 3" className="num-t1" />
            <line x1="140" y1="52" x2="118" y2="80" stroke="#fde68a" strokeWidth="1.2" strokeDasharray="3 3" className="num-t2" />
            <line x1="118" y1="76" x2="113" y2="80" stroke="#fde68a" strokeWidth="1.2" className="num-t3" />
            <circle cx="112" cy="80" r="3.2" fill="#fde68a" className="num-root" />
          </svg>
          <div className="num-table">
            <p>
              <span>x₀</span> 3.0000
            </p>
            <p className="num-r1">
              <span>x₁</span> 2.4615
            </p>
            <p className="num-r2">
              <span>x₂</span> 2.3077
            </p>
            <p className="num-r3">
              <span>x₃</span> 2.2946 ✓
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Chat() {
  return (
    <div className="vg-stage">
      <div className="vg-window chat-window">
        <div className="vg-titlebar">
          <span />
          <span />
          <span />
          <p>Afosh AI · Gemini</p>
        </div>
        <div className="chat-body">
          <p className="chat-msg chat-me">explain YOLO like I&apos;m 5</p>
          <p className="chat-msg chat-bot">
            bos ya basha 😎 — it looks at the picture <b>once</b> and shouts every object it sees.
          </p>
          <p className="chat-msg chat-me chat-late">and C++ pointers?</p>
          <p className="chat-typing">
            <span />
            <span />
            <span />
          </p>
        </div>
      </div>
    </div>
  )
}

function Portfolio() {
  return (
    <div className="vg-stage">
      <div className="vg-window pf-window">
        <div className="vg-titlebar">
          <span />
          <span />
          <span />
          <p>afosh.dev</p>
        </div>
        <div className="pf-body">
          <p className="pf-hi">Hi, I&apos;m 👋</p>
          <p className="pf-name">Mostafa Kmal.</p>
          <div className="pf-lines">
            <span />
            <span />
            <span />
          </div>
          <div className="pf-floor">
            <span className="pf-slime" />
            <span className="pf-dock">
              <i />
              <i />
              <i />
              <i />
              <i />
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function ReSpark() {
  const parts = [
    ["Arduino Uno", "From a robotics course", "250"],
    ["ESP32 dev board", "Barely used", "180"],
    ["SG90 servo ×4", "Graduation project", "120"],
  ]
  return (
    <div className="vg-stage">
      <div className="rs-phone">
        <div className="rs-notch" />
        <div className="rs-head">
          <span className="rs-logo">♻</span>
          <div>
            <p className="rs-title">ReSpark</p>
            <p className="rs-sub">Give tech a second life</p>
          </div>
        </div>
        <ul className="rs-list">
          {parts.map(([name, note, price]) => (
            <li key={name}>
              <span className="rs-chip" />
              <span className="rs-text">
                <b>{name}</b>
                <i>{note}</i>
              </span>
              <span className="rs-price">{price} EGP</span>
            </li>
          ))}
        </ul>
        <div className="rs-eco">
          <span>AI energy saved</span>
          <span className="rs-bar">
            <span />
          </span>
        </div>
      </div>
    </div>
  )
}

function Fallback({ kind }: { kind: VignetteKind }) {
  return (
    <div className="vg-stage">
      <p className="font-display text-2xl font-bold text-white/90">{kind}</p>
    </div>
  )
}
