'use client';

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import {
  ArrowRight,
  ArrowUpRight,
  Play,
  Pause,
  Users,
  Receipt,
  Scale,
  Wallet,
  BarChart3,
  ShieldCheck,
  Sparkles,
  Plus,
  Check,
  ChevronDown,
  Utensils,
  Plane,
  Home as HomeIcon,
  Zap,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const EMERALD = {
  ink: "#062e23",
  primary: "#059669",
  secondary: "#10B981",
  mint: "#34D399",
  light: "#6EE7B7",
  paper: "#F5F7F4",
};

export default function Homepage() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    const id = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(id);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  useLayoutEffect(() => {
    if (!root.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%" },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-split]").forEach((el) => {
        const words = el.innerText.split(/(\s+)/);
        el.innerHTML = words
          .map((w) =>
            w.trim()
              ? `<span class="pm-word"><span class="pm-word-inner">${w}</span></span>`
              : w,
          )
          .join("");
        const inners = el.querySelectorAll<HTMLElement>(".pm-word-inner");
        gsap.fromTo(
          inners,
          { yPercent: 110 },
          {
            yPercent: 0,
            duration: 1,
            ease: "power4.out",
            stagger: 0.05,
            scrollTrigger: { trigger: el, start: "top 85%" },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-stagger]").forEach((container) => {
        const items = container.querySelectorAll<HTMLElement>("[data-stagger-item]");
        gsap.fromTo(
          items,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.08,
            scrollTrigger: { trigger: container, start: "top 82%" },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const speed = Number(el.dataset.parallax || 0.3);
        gsap.to(el, {
          yPercent: -speed * 100,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="pm-root">
      <StyleTag />
      <Nav />
      <Hero />
      <TrustStrip />
      <ProblemSolution />
      <FeaturesDeepDive />
      <SplitDemo />
      <SimplifySection />
      <AnalyticsSection />
      <HowItWorks />
      <StatsSection />
      <FinalCTA />
      <Footer />
    </div>
  );
}

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
    <nav
      className={`pm-nav ${scrolled ? "is-scrolled" : ""}`}
      data-cursor-text=""
    >
      <div className="pm-nav-inner">
        <Link href="/" className="pm-logo" data-cursor-text="home">
          <img src="/green logo.png" alt="PayMint" className="pm-logo-img" />
          <span className="pm-brand-text">
            <span className="pm-pay">Pay</span>
            <span className="pm-mint">Mint</span>
            <span className="pm-verse">Verse</span>
          </span>
        </Link>

        <div className="pm-nav-links">
          <a href="#features" className="pm-navlink"><span>Features</span></a>
          <a href="#how" className="pm-navlink"><span>How it works</span></a>
          <div
            className="pm-navlink pm-navlink-menu"
            onMouseEnter={() => setOpenMenu(true)}
            onMouseLeave={() => setOpenMenu(false)}
          >
            <span>Product <ChevronDown size={14} strokeWidth={2.4} /></span>
            <div className={`pm-dropdown ${openMenu ? "is-open" : ""}`}>
              {[
                { t: "Smart splitting", d: "Four methods, one tap", icon: <Scale size={16} /> },
                { t: "Debt simplification", d: "Fewest settlements", icon: <Zap size={16} /> },
                { t: "Analytics", d: "See where money flows", icon: <BarChart3 size={16} /> },
                { t: "Groups", d: "Trips, roommates, teams", icon: <Users size={16} /> },
              ].map((i) => (
                <a key={i.t} href="#features" className="pm-drop-item">
                  <span className="pm-drop-icon">{i.icon}</span>
                  <span>
                    <strong>{i.t}</strong>
                    <em>{i.d}</em>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="pm-nav-actions">
          <Link href="/auth/login" className="pm-login-btn">Login</Link>
          <Link href="/auth/signup" className="pm-cta-btn" data-cursor-text="get started">
            <span>Get started</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <button
          className={`pm-hamburger ${mobileOpen ? "is-open" : ""}`}
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>
    </nav>

    {mounted && createPortal(
      <div className={`pm-mobile-menu ${mobileOpen ? "is-open" : ""}`}>
        <div className="pm-mobile-overlay" onClick={closeMobile} />
        <div className="pm-mobile-panel">
          <a href="#features" className="pm-mobile-link" onClick={closeMobile}>Features</a>
          <a href="#how" className="pm-mobile-link" onClick={closeMobile}>How it works</a>
          <div className="pm-mobile-sep" />
          <span className="pm-mobile-label">Product</span>
          <a href="#features" className="pm-mobile-link" onClick={closeMobile}><Scale size={16} /> Smart splitting</a>
          <a href="#features" className="pm-mobile-link" onClick={closeMobile}><Zap size={16} /> Debt simplification</a>
          <a href="#features" className="pm-mobile-link" onClick={closeMobile}><BarChart3 size={16} /> Analytics</a>
          <a href="#features" className="pm-mobile-link" onClick={closeMobile}><Users size={16} /> Groups</a>
          <div className="pm-mobile-auth-sep" />
          <Link href="/auth/login" className="pm-mobile-login" onClick={closeMobile}>Login</Link>
          <Link href="/auth/signup" className="pm-mobile-signup" onClick={closeMobile}>Get started</Link>
        </div>
      </div>,
      document.body,
    )}
  </>);
}

function Hero() {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="pm-hero">
      <div className="pm-hero-ornaments" aria-hidden>
        <div className="pm-blob pm-blob-1" data-parallax="0.15" />
        <div className="pm-blob pm-blob-2" data-parallax="0.25" />
        <div className="pm-grid-bg" />
      </div>

      <div className="pm-container pm-hero-inner">
        <div className="pm-eyebrow" data-reveal>
          <span className="pm-dot" /> Smart expense management, reimagined
        </div>

        <h1 className="pm-hero-title">
          <span className="pm-h1-line" data-split>Stop chasing people</span>
          <span className="pm-h1-line pm-h1-italic-row">
            <span data-split>for money.</span>
            <span data-split>Start</span>
          </span>
          <span className="pm-h1-line pm-h1-italic" data-split>settling.</span>
        </h1>

        <p className="pm-hero-sub" data-reveal>
          PayMint Verse tracks group expenses, splits bills four ways, simplifies debts to the
          fewest transactions possible, and settles in one tap. No spreadsheets. No IOUs. No
          awkward group chats.
        </p>

        <div className="pm-hero-cta" data-reveal>
          <a href="#cta" className="pm-btn-primary" data-cursor-text="create group">
            <span>Create your group</span>
            <ArrowRight size={17} />
          </a>
          <button
            className="pm-btn-ghost"
            onClick={() => setPlaying((v) => !v)}
            data-cursor-text={playing ? "pause" : "play demo"}
          >
            <span className="pm-play-ico">{playing ? <Pause size={13} /> : <Play size={13} fill="currentColor" />}</span>
            <span>Watch 45s demo</span>
          </button>
        </div>

        <div className="pm-hero-mockup" data-reveal>
          <HeroAppMockup />
        </div>
      </div>
    </section>
  );
}

function HeroAppMockup() {
  return (
    <div className="pm-mockup">
      <div className="pm-mockup-topbar">
        <div className="pm-mockup-dots"><i /><i /><i /></div>
        <div className="pm-mockup-url">paymint.verse / weekend-in-lisbon</div>
      </div>
      <div className="pm-mockup-body">
        <aside className="pm-mockup-side">
          <div className="pm-mock-group active">
            <Plane size={15} /> Weekend in Lisbon
          </div>
          <div className="pm-mock-group"><HomeIcon size={15} /> Apartment 4B</div>
          <div className="pm-mock-group"><Users size={15} /> Studio team</div>
          <div className="pm-mock-group"><Utensils size={15} /> Supper club</div>
          <button className="pm-mock-new"><Plus size={14} /> New group</button>
        </aside>
        <main className="pm-mockup-main">
          <div className="pm-mock-head">
            <div>
              <h4>Weekend in Lisbon</h4>
              <p>4 people · 12 expenses</p>
            </div>
            <div className="pm-mock-balance">
              <span>You are owed</span>
              <strong>$127.40</strong>
            </div>
          </div>
          <div className="pm-mock-list">
            {[
              { icon: <HomeIcon size={14} />, t: "Airbnb — 3 nights", who: "Maya paid", amt: "$420.00" },
              { icon: <Utensils size={14} />, t: "Time Out Market dinner", who: "You paid", amt: "$86.50" },
              { icon: <Plane size={14} />, t: "Uber to airport", who: "Jonas paid", amt: "$34.20" },
              { icon: <Sparkles size={14} />, t: "Fado night tickets", who: "You paid", amt: "$72.00" },
            ].map((e, i) => (
              <div key={i} className="pm-mock-item">
                <span className="pm-mock-ico">{e.icon}</span>
                <div className="pm-mock-txt">
                  <strong>{e.t}</strong>
                  <em>{e.who}</em>
                </div>
                <span className="pm-mock-amt">{e.amt}</span>
              </div>
            ))}
          </div>
          <div className="pm-mock-settle">
            <div>
              <em>Simplified settlement</em>
              <strong>Jonas → You · $92.20</strong>
            </div>
            <button className="pm-mock-btn" data-cursor-text="settle">Settle up <ArrowRight size={13} /></button>
          </div>
        </main>
      </div>
    </div>
  );
}

function TrustStrip() {
  const items = [
    "10k+ groups tracked",
    "$50M+ split fairly",
    "4.9★ user rating",
    "0 spreadsheets required",
    "Bank-level security",
  ];
  return (
    <section className="pm-trust" data-reveal>
      <p className="pm-trust-title">
        Trusted by roommates, weekend crews, wedding parties, and remote teams in 40+ countries.
      </p>
      <div className="pm-trust-track">
        <div className="pm-trust-inner">
          {[...items, ...items].map((t, i) => (
            <span key={i} className="pm-trust-item">
              <span className="pm-trust-star">✦</span> {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProblemSolution() {
  return (
    <section className="pm-ps" id="how">
      <div className="pm-container">
        <div className="pm-ps-eyebrow" data-reveal>
          <em>Why PayMint Verse</em>
        </div>
        <h2 className="pm-ps-title" data-split>
          Group money is messy. We built the calm layer on top.
        </h2>

        <div className="pm-ps-grid" data-stagger>
          <article className="pm-ps-card pm-ps-problem" data-stagger-item>
            <span className="pm-ps-label">The problem</span>
            <ul>
              <li><span>1</span> Someone always pays, no one remembers who.</li>
              <li><span>2</span> Splitting equally is unfair; splitting by shares is math.</li>
              <li><span>3</span> Debts pile up in circles — A owes B owes C owes A.</li>
              <li><span>4</span> The reminder chat gets muted after week two.</li>
            </ul>
          </article>
          <article className="pm-ps-card pm-ps-solution" data-stagger-item>
            <span className="pm-ps-label">The PayMint way</span>
            <ul>
              <li><Check size={16} /> Log an expense in three seconds, from anywhere.</li>
              <li><Check size={16} /> Split evenly, by share, by percentage, or exact amount.</li>
              <li><Check size={16} /> Our engine collapses circular debts into the fewest transfers.</li>
              <li><Check size={16} /> One-tap settlement, receipt in your inbox, done.</li>
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}

function FeaturesDeepDive() {
  const features = [
    {
      icon: <Receipt />,
      title: "Log in seconds",
      body: "Snap a receipt, pick a group, tag participants. We handle the rest.",
      tag: "Capture",
    },
    {
      icon: <Scale />,
      title: "Four ways to split",
      body: "Equal, unequal, percentage, or exact. Change your mind anytime.",
      tag: "Fair",
    },
    {
      icon: <Zap />,
      title: "Debt simplification",
      body: "Our graph engine reduces a mess of IOUs to the minimum number of transfers.",
      tag: "Smart",
    },
    {
      icon: <BarChart3 />,
      title: "Real-time analytics",
      body: "See spend by category, person, and month. Understand where money goes.",
      tag: "Insight",
    },
    {
      icon: <Wallet />,
      title: "One-tap settlement",
      body: "Settle inside the app or export to your payment method of choice.",
      tag: "Close",
    },
    {
      icon: <ShieldCheck />,
      title: "Private by design",
      body: "Row-level security. Your group stays your group. Nothing is sold, ever.",
      tag: "Safe",
    },
  ];
  return (
    <section className="pm-features" id="features">
      <div className="pm-container">
        <div className="pm-sec-head">
          <span className="pm-sec-kicker" data-reveal>Features</span>
          <h2 className="pm-sec-title" data-split>
            A complete toolkit for shared money, without the friction.
          </h2>
          <p className="pm-sec-sub" data-reveal>
            Every feature earns its place. Nothing you have to configure, nothing you have to
            learn, nothing you have to babysit.
          </p>
        </div>

        <div className="pm-feat-grid" data-stagger>
          {features.map((f, i) => (
            <article key={i} className="pm-feat-card" data-stagger-item data-cursor-text="explore">
              <div className="pm-feat-icon">{f.icon}</div>
              <span className="pm-feat-tag">{f.tag}</span>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
              <span className="pm-feat-arrow"><ArrowUpRight size={16} /></span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function SplitDemo() {
  const methods = ["Equally", "By share", "By %", "Exact"] as const;
  const [method, setMethod] = useState<(typeof methods)[number]>("Equally");
  const people = [
    { name: "You", color: EMERALD.primary },
    { name: "Maya", color: EMERALD.mint },
    { name: "Jonas", color: "#0f766e" },
    { name: "Ari", color: EMERALD.light },
  ];
  const total = 240;
  const values: Record<(typeof methods)[number], number[]> = {
    Equally: [60, 60, 60, 60],
    "By share": [96, 72, 48, 24],
    "By %": [90, 60, 60, 30],
    Exact: [110, 40, 55, 35],
  };

  return (
    <section className="pm-split">
      <div className="pm-container">
        <div className="pm-sec-head">
          <span className="pm-sec-kicker" data-reveal>Splits</span>
          <h2 className="pm-sec-title" data-split>
            Four ways to split. Zero arguments.
          </h2>
        </div>

        <div className="pm-split-panel" data-reveal>
          <div className="pm-split-tabs">
            {methods.map((m) => (
              <button
                key={m}
                onClick={() => setMethod(m)}
                className={`pm-split-tab ${method === m ? "is-active" : ""}`}
                data-cursor-text={m.toLowerCase()}
              >
                {m}
              </button>
            ))}
          </div>
          <div className="pm-split-body">
            <div className="pm-split-head">
              <div>
                <em>Dinner at Cantina</em>
                <strong>${total.toFixed(2)}</strong>
              </div>
              <div className="pm-split-meta">Method · <span>{method}</span></div>
            </div>
            <div className="pm-split-list">
              {people.map((p, i) => {
                const v = values[method][i];
                const pct = (v / total) * 100;
                return (
                  <div key={p.name} className="pm-split-row">
                    <span className="pm-split-avatar" style={{ background: p.color }}>
                      {p.name[0]}
                    </span>
                    <span className="pm-split-name">{p.name}</span>
                    <div className="pm-split-bar">
                      <div
                        className="pm-split-fill"
                        style={{ width: `${pct}%`, background: p.color }}
                      />
                    </div>
                    <span className="pm-split-amt">${v.toFixed(2)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  const stats = [
    { n: "500K+", t: "Expenses tracked", d: "Across weekend trips, apartments, and remote teams." },
    { n: "4.9", t: "User satisfaction", d: "Averaged across the App Store and Play Store." },
    { n: "42%", t: "Fewer transfers", d: "Median reduction after debt simplification runs." },
    { n: "1-tap", t: "To settle up", d: "Whether it is $6 or $600, closing out takes seconds." },
  ];
  return (
    <section className="pm-stats">
      <div className="pm-container">
        <div className="pm-stats-head">
          <span className="pm-sec-kicker pm-sec-kicker-light" data-reveal>By the numbers</span>
          <h2 className="pm-stats-title" data-split>
            Numbers that matter, from people who stopped arguing about money.
          </h2>
        </div>
        <div className="pm-stats-grid" data-stagger>
          {stats.map((s) => (
            <div key={s.t} className="pm-stat" data-stagger-item>
              <div className="pm-stat-n">{s.n}</div>
              <div className="pm-stat-t">{s.t}</div>
              <div className="pm-stat-d">{s.d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SimplifySection() {
  const before = [
    { from: "Ali", to: "Ahmed", amt: "PKR 1,200" },
    { from: "Ahmed", to: "Umar", amt: "PKR 1,200" },
    { from: "Sara", to: "Ali", amt: "PKR 800" },
    { from: "Umar", to: "Sara", amt: "PKR 400" },
  ];
  const after = [
    { from: "Ali", to: "Umar", amt: "PKR 800" },
    { from: "Sara", to: "Umar", amt: "PKR 400" },
  ];
  return (
    <section className="pm-simplify" id="simplify">
      <div className="pm-container">
        <div className="pm-sec-head">
          <span className="pm-sec-kicker" data-reveal>Debt simplification</span>
          <h2 className="pm-sec-title" data-split>
            From tangled chains to the <em>fewest possible payments.</em>
          </h2>
          <p className="pm-sec-sub" data-reveal>
            PayMint Verse runs a greedy algorithm across every net balance to collapse circular
            debts. Ali → Ahmed → Umar becomes just Ali → Umar. Less friction, faster settlements,
            fewer awkward reminders.
          </p>
        </div>

        <div className="pm-simp-stats" data-stagger>
          <div className="pm-simp-stat" data-stagger-item><strong>–68%</strong><span>Fewer transactions</span></div>
          <div className="pm-simp-stat" data-stagger-item><strong>1 tap</strong><span>To settle up</span></div>
          <div className="pm-simp-stat" data-stagger-item><strong>Instant</strong><span>Balance updates</span></div>
        </div>

        <div className="pm-simp-grid" data-stagger>
          <div className="pm-simp-card" data-stagger-item>
            <header><span className="pm-simp-pill">Before</span><strong>4 payments</strong></header>
            <ul>
              {before.map((p, i) => (
                <li key={i}><span>{p.from}</span><ArrowRight size={13} /><span>{p.to}</span><em>{p.amt}</em></li>
              ))}
            </ul>
          </div>
          <div className="pm-simp-card pm-simp-card-after" data-stagger-item>
            <header><span className="pm-simp-pill pm-simp-pill-good">After</span><strong>2 payments</strong></header>
            <ul>
              {after.map((p, i) => (
                <li key={i}><span>{p.from}</span><ArrowRight size={13} /><span>{p.to}</span><em>{p.amt}</em></li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function AnalyticsSection() {
  const cats = [
    { t: "Food", p: 32, c: "#059669" },
    { t: "Transport", p: 24, c: "#10B981" },
    { t: "Stay", p: 18, c: "#34D399" },
    { t: "Entertainment", p: 12, c: "#6EE7B7" },
    { t: "Shopping", p: 8, c: "#a7f3d0" },
    { t: "Utilities", p: 4, c: "#062e23" },
    { t: "Other", p: 2, c: "#94a3b8" },
  ];
  const R = 70, C = 2 * Math.PI * R;
  let acc = 0;
  return (
    <section className="pm-analytics" id="analytics">
      <div className="pm-container">
        <div className="pm-sec-head">
          <span className="pm-sec-kicker" data-reveal>Analytics</span>
          <h2 className="pm-sec-title" data-split>
            The clearest picture of <em>where money actually goes.</em>
          </h2>
          <p className="pm-sec-sub" data-reveal>
            Category breakdowns, monthly trends, per-person averages. Export any group to CSV in
            one click for your own records or a shared accountant.
          </p>
        </div>

        <div className="pm-anal-grid" data-stagger>
          <div className="pm-anal-card pm-anal-donut" data-stagger-item>
            <header>
              <div><em>October</em><strong>Spending by category</strong></div>
              <button className="pm-anal-export">Export CSV</button>
            </header>
            <div className="pm-donut-wrap">
              <svg viewBox="0 0 200 200" className="pm-donut">
                <circle cx="100" cy="100" r={R} fill="none" stroke="rgba(6,46,35,0.06)" strokeWidth="22" />
                {cats.map((c) => {
                  const len = (c.p / 100) * C;
                  const dash = `${len} ${C - len}`;
                  const offset = -acc;
                  acc += len;
                  return (
                    <circle key={c.t} cx="100" cy="100" r={R} fill="none" stroke={c.c}
                      strokeWidth="22" strokeDasharray={dash} strokeDashoffset={offset}
                      transform="rotate(-90 100 100)" strokeLinecap="butt" />
                  );
                })}
                <text x="100" y="94" textAnchor="middle" className="pm-donut-lbl">Total</text>
                <text x="100" y="118" textAnchor="middle" className="pm-donut-val">PKR 68.4K</text>
              </svg>
              <ul className="pm-anal-legend">
                {cats.map((c) => (
                  <li key={c.t}><i style={{ background: c.c }} /><span>{c.t}</span><em>{c.p}%</em></li>
                ))}
              </ul>
            </div>
            <footer>
              <div><span>Total</span><strong>PKR 68,420</strong></div>
              <div><span>Avg / person</span><strong>PKR 17,105</strong></div>
              <div><span>Vs last month</span><strong className="pm-up">+12.4%</strong></div>
            </footer>
          </div>

          <div className="pm-anal-card pm-anal-list" data-stagger-item>
            <h4>What you unlock</h4>
            <ul>
              {[
                "Live category donut & monthly trend charts",
                "Per-member spend, owed and settled totals",
                "Filter by group, date range or category",
                "One-click CSV export for any date range",
              ].map((t) => (
                <li key={t}><Check size={16} /> {t}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", t: "Create a group", d: "Trip, apartment, team — invite by link. No accounts required." },
    { n: "02", t: "Log expenses", d: "Snap a receipt or type it in. Three seconds, done." },
    { n: "03", t: "Choose a split", d: "Equal, exact, share, or percentage — per expense." },
    { n: "04", t: "Settle up", d: "PayMint collapses the chain. One tap via EasyPaisa or JazzCash." },
  ];
  return (
    <section className="pm-how">
      <div className="pm-container">
        <div className="pm-sec-head">
          <span className="pm-sec-kicker" data-reveal>How it works</span>
          <h2 className="pm-sec-title" data-split>
            Four steps between <em>chaos and calm.</em>
          </h2>
        </div>
        <ol className="pm-how-grid" data-stagger>
          {steps.map((s) => (
            <li key={s.n} className="pm-how-step" data-stagger-item>
              <span className="pm-how-n">{s.n}</span>
              <strong>{s.t}</strong>
              <p>{s.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="pm-cta" id="cta">
      <div className="pm-container">
        <div className="pm-cta-card">
          <div className="pm-cta-orn" data-parallax="0.2" />
          <span className="pm-cta-kick" data-reveal>Ready when you are</span>
          <h2 className="pm-cta-title" data-split>
            Start tracking shared expenses in the next 30 seconds.
          </h2>
          <p className="pm-cta-sub" data-reveal>
            Free forever for personal groups. No credit card. Bring your friends, roommates, or
            team along in one link.
          </p>
          <div className="pm-cta-actions" data-reveal>
            <a href="#" className="pm-btn-primary pm-btn-primary-lg" data-cursor-text="launch app">
              <span>Launch PayMint Verse</span>
              <ArrowRight size={18} />
            </a>
            <a href="#features" className="pm-btn-ghost pm-btn-ghost-light" data-cursor-text="learn">
              <span>See every feature</span>
            </a>
          </div>
          <div className="pm-cta-chips" data-stagger>
            <div className="pm-cta-chip" data-stagger-item>
              <strong>Free forever</strong><span>For personal groups</span>
            </div>
            <div className="pm-cta-chip" data-stagger-item>
              <strong>No card required</strong><span>Sign up in seconds</span>
            </div>
            <div className="pm-cta-chip" data-stagger-item>
              <strong>Made in Pakistan</strong><span>EasyPaisa &amp; JazzCash built-in</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="pm-footer">
      <div className="pm-container pm-footer-inner">
        <div className="pm-footer-brand">
          <img src="/green logo.png" alt="PayMint" className="pm-logo-img" />
          <span className="pm-brand-text">
            <span className="pm-pay">Pay</span>
            <span className="pm-mint">Mint</span>
            <span className="pm-verse">Verse</span>
          </span>
          <p>The calm layer on top of shared money.</p>
        </div>
        <div className="pm-footer-cols">
          <div>
            <h5>Product</h5>
            <a href="#features">Features</a>
            <a href="#how">How it works</a>
            <a href="#pricing">Pricing</a>
          </div>
          <div>
            <h5>Company</h5>
            <a href="#">About</a>
            <a href="#">Blog</a>
            <a href="#">Careers</a>
          </div>
          <div>
            <h5>Legal</h5>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Security</a>
          </div>
        </div>
      </div>
      <div className="pm-footer-base">
        <span>© {new Date().getFullYear()} PayMint Verse</span>
        <span>Built with intention in emerald.</span>
      </div>
    </footer>
  );
}

function StyleTag() {
  return (
    <style>{`
      :root {
        --ink: ${EMERALD.ink};
        --primary: ${EMERALD.primary};
        --secondary: ${EMERALD.secondary};
        --mint: ${EMERALD.mint};
        --light: ${EMERALD.light};
        --paper: ${EMERALD.paper};
        --line: rgba(6,46,35,0.09);
      }
      .pm-root, .pm-mobile-menu {
        font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif;
      }
      .pm-root {
        color: var(--ink);
        background: var(--paper);
        overflow-x: hidden;
      }
      .pm-root * { box-sizing: border-box; }
      .pm-container { width: 100%; max-width: 1240px; margin: 0 auto; padding: 0 clamp(20px, 4vw, 40px); }

      .pm-nav { position: fixed; top: 14px; left: max(12px, env(safe-area-inset-left)); right: max(12px, env(safe-area-inset-right)); z-index: 100;
        transition: transform .5s cubic-bezier(.6,.05,.2,1), top .3s; }
      .pm-nav.is-hidden { transform: translateY(-140%); }
      .pm-nav.is-scrolled { top: 10px; }
      .pm-nav-inner {
        display: flex; align-items: center; justify-content: space-between; gap: 12px;
        max-width: 1180px; margin: 0 auto; padding: 10px 12px 10px 18px;
        background: rgba(255,255,255,0.78); backdrop-filter: blur(18px) saturate(1.4);
        border: 1px solid rgba(6,46,35,0.08); border-radius: 999px;
        box-shadow: 0 10px 30px -18px rgba(6,46,35,0.25);
      }
      .pm-logo { display: flex; align-items: center; gap: 8px; text-decoration: none; }
      .pm-logo-img { height: 28px; width: auto; }
      .pm-brand-text { display: flex; align-items: center; gap: 0; font-size: 17px; font-weight: 600; letter-spacing: -0.01em; }
      .pm-pay { color: var(--ink); }
      .pm-mint { color: var(--primary); }
      .pm-verse { color: var(--ink); }
      .pm-nav-links { display: flex; align-items: center; gap: 6px; }
      .pm-navlink { position: relative; padding: 8px 14px; font-size: 14px; color: var(--ink); text-decoration: none; border-radius: 999px; display: inline-flex; align-items: center; gap: 4px; cursor: pointer; }
      .pm-navlink > span { position: relative; z-index: 2; display: inline-flex; align-items: center; gap: 4px; }
      .pm-navlink::before { content: ''; position: absolute; inset: 0; background: rgba(6,46,35,0.06); border-radius: 999px; transform: scale(.7); opacity: 0; transition: .3s cubic-bezier(.6,.05,.2,1); }
      .pm-navlink:hover::before { transform: scale(1); opacity: 1; }
      .pm-navlink-menu { padding-right: 12px; }
      .pm-dropdown { position: absolute; top: calc(100% + 10px); left: 50%; transform: translate(-50%, -8px); background: #fff; border: 1px solid var(--line); border-radius: 22px; padding: 10px; width: 320px; opacity: 0; pointer-events: none; transition: .35s cubic-bezier(.6,.05,.2,1); box-shadow: 0 24px 50px -20px rgba(6,46,35,0.2); }
      .pm-dropdown.is-open { opacity: 1; pointer-events: auto; transform: translate(-50%, 0); }
      .pm-drop-item { display: flex; gap: 12px; padding: 10px 12px; border-radius: 14px; align-items: center; text-decoration: none; color: var(--ink); transition: background .25s; }
      .pm-drop-item:hover { background: rgba(5,150,105,0.08); }
      .pm-drop-icon { width: 34px; height: 34px; border-radius: 10px; background: rgba(5,150,105,0.1); color: var(--primary); display: grid; place-items: center; }
      .pm-drop-item strong { display: block; font-size: 13.5px; font-weight: 600; }
      .pm-drop-item em { display: block; font-style: normal; font-size: 12px; color: rgba(6,46,35,0.55); margin-top: 2px; }
      .pm-nav-actions { display: flex; align-items: center; gap: 8px; }
      .pm-login-btn { display: inline-flex; align-items: center; padding: 8px 16px; font-size: 14px; font-weight: 500; color: var(--ink); border-radius: 999px; text-decoration: none; transition: background .25s, transform .3s; }
      .pm-login-btn:hover { background: rgba(6,46,35,0.06); transform: translateY(-1px); }
      .pm-cta-btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 16px 10px 20px; background: var(--ink); color: var(--paper); border-radius: 999px; text-decoration: none; font-size: 14px; font-weight: 500; transition: transform .3s, background .3s; }
      .pm-cta-btn:hover { transform: translateY(-1px); background: var(--primary); }
      .pm-hamburger { display: none; flex-direction: column; gap: 4px; padding: 8px; background: none; border: none; cursor: pointer; }
      .pm-hamburger span { display: block; width: 20px; height: 2px; background: var(--ink); border-radius: 2px; transition: transform .3s, opacity .3s; }
      .pm-hamburger.is-open span:nth-child(1) { transform: translateY(6px) rotate(45deg); }
      .pm-hamburger.is-open span:nth-child(2) { opacity: 0; }
      .pm-hamburger.is-open span:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }
      .pm-mobile-menu { position: fixed; inset: 0; z-index: 101; opacity: 0; pointer-events: none; transition: opacity .35s; }
      .pm-mobile-menu.is-open { opacity: 1; pointer-events: auto; }
      .pm-mobile-overlay { position: fixed; inset: 0; background: rgba(6,46,35,0.55); }
      .pm-mobile-panel { position: fixed; top: 0; right: 0; bottom: 0; width: min(320px, 80vw); background: #fff; padding: 20px 24px 24px; display: flex; flex-direction: column; gap: 2px; transform: translateX(100%); transition: transform .4s cubic-bezier(.6,.05,.2,1); overflow-y: auto; }
      .pm-mobile-menu.is-open .pm-mobile-panel { transform: translateX(0); }
      .pm-mobile-link { display: flex; align-items: center; gap: 10px; padding: 12px 14px; font-size: 15px; font-weight: 500; color: var(--ink); text-decoration: none; border-radius: 14px; transition: background .2s; }
      .pm-mobile-link:hover { background: rgba(6,46,35,0.05); }
      .pm-mobile-link svg { width: 16px; height: 16px; color: var(--primary); flex-shrink: 0; }
      .pm-mobile-sep { height: 1px; background: var(--line); margin: 6px 14px; }
      .pm-mobile-label { display: block; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: .08em; color: rgba(6,46,35,0.5); padding: 8px 14px 4px; }
      .pm-mobile-auth-sep { height: 1px; background: var(--line); margin: 12px 14px 8px; }
      .pm-mobile-login { display: block; text-align: center; padding: 12px; border-radius: 999px; border: 1px solid var(--line); color: var(--ink); text-decoration: none; font-size: 15px; font-weight: 500; transition: background .2s; }
      .pm-mobile-login:hover { background: rgba(6,46,35,0.05); }
      .pm-mobile-signup { display: block; text-align: center; padding: 12px; border-radius: 999px; background: var(--ink); color: var(--paper); text-decoration: none; font-size: 15px; font-weight: 500; transition: background .3s; }
      .pm-mobile-signup:hover { background: var(--primary); }
      @media (max-width: 820px) { .pm-nav-links, .pm-nav-actions { display: none; } .pm-hamburger { display: flex; } }

      .pm-hero { position: relative; padding: 160px 0 80px; overflow: hidden; }
      .pm-hero-ornaments { position: absolute; inset: 0; pointer-events: none; }
      .pm-grid-bg { position: absolute; inset: 0; background-image: linear-gradient(rgba(6,46,35,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(6,46,35,0.05) 1px, transparent 1px); background-size: 60px 60px; mask-image: radial-gradient(ellipse at top, black, transparent 70%); }
      .pm-blob { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.55; }
      .pm-blob-1 { width: 520px; height: 520px; background: radial-gradient(circle, ${EMERALD.mint}, transparent 70%); top: -140px; right: -100px; }
      .pm-blob-2 { width: 400px; height: 400px; background: radial-gradient(circle, ${EMERALD.light}, transparent 70%); top: 240px; left: -120px; opacity: 0.4; }
      .pm-hero-inner { position: relative; }

      .pm-eyebrow { display: inline-flex; align-items: center; gap: 8px; padding: 7px 14px 7px 12px; border: 1px solid var(--line); background: rgba(255,255,255,0.6); backdrop-filter: blur(8px); border-radius: 999px; font-size: 12.5px; font-weight: 500; color: var(--ink); }
      .pm-dot { width: 6px; height: 6px; border-radius: 999px; background: var(--primary); box-shadow: 0 0 0 4px rgba(5,150,105,0.18); }

      .pm-hero-title { margin: 22px 0 30px; font-family: 'Instrument Serif', 'Times New Roman', serif; font-weight: 400; font-size: clamp(48px, 8vw, 108px); line-height: 0.98; letter-spacing: -0.03em; }
      .pm-h1-line { display: block; }
      .pm-h1-italic, .pm-h1-italic-row span[data-split]:last-child, .pm-h1-italic-row > span:last-child { font-style: italic; color: var(--primary); }
      .pm-h1-italic-row { display: inline-flex; flex-wrap: wrap; align-items: center; gap: 18px; }
      .pm-word { display: inline-block; overflow: hidden; vertical-align: bottom; line-height: 1; padding-bottom: 0.06em; }
      .pm-word-inner { display: inline-block; }



      .pm-hero-sub { max-width: 640px; font-size: clamp(16px, 1.4vw, 19px); line-height: 1.55; color: rgba(6,46,35,0.7); }
      .pm-hero-cta { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 34px; }

      .pm-btn-primary { display: inline-flex; align-items: center; gap: 10px; padding: 15px 22px 15px 26px; background: var(--ink); color: var(--paper); border-radius: 999px; font-size: 15px; font-weight: 500; text-decoration: none; transition: .3s cubic-bezier(.6,.05,.2,1); position: relative; overflow: hidden; }
      .pm-btn-primary::before { content: ''; position: absolute; inset: 0; background: linear-gradient(120deg, var(--primary), var(--mint)); opacity: 0; transition: .3s; }
      .pm-btn-primary > * { position: relative; z-index: 1; }
      .pm-btn-primary:hover::before { opacity: 1; }
      .pm-btn-primary:hover { transform: translateY(-2px); }
      .pm-btn-primary-lg { padding: 18px 26px 18px 30px; font-size: 16px; }

      .pm-btn-ghost { display: inline-flex; align-items: center; gap: 10px; padding: 15px 20px; background: transparent; color: var(--ink); border: 1px solid var(--line); border-radius: 999px; font-size: 15px; font-weight: 500; cursor: pointer; text-decoration: none; transition: .3s; font-family: inherit; }
      .pm-btn-ghost:hover { background: rgba(6,46,35,0.05); transform: translateY(-2px); }
      .pm-play-ico { width: 24px; height: 24px; background: rgba(5,150,105,0.15); color: var(--primary); border-radius: 999px; display: grid; place-items: center; }
      .pm-btn-ghost-light { color: var(--paper); border-color: rgba(255,255,255,0.24); }
      .pm-btn-ghost-light:hover { background: rgba(255,255,255,0.08); }

      .pm-hero-mockup { margin-top: 80px; border-radius: 26px; overflow: hidden; box-shadow: 0 40px 80px -30px rgba(6,46,35,0.32), 0 0 0 1px var(--line); background: #fff; }
      .pm-mockup-topbar { display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: linear-gradient(180deg, #fff, #f4f7f4); border-bottom: 1px solid var(--line); }
      .pm-mockup-dots { display: flex; gap: 6px; }
      .pm-mockup-dots i { width: 10px; height: 10px; border-radius: 999px; background: var(--line); display: inline-block; }
      .pm-mockup-dots i:nth-child(1) { background: #ff7369; } .pm-mockup-dots i:nth-child(2) { background: #ffbc42; } .pm-mockup-dots i:nth-child(3) { background: var(--mint); }
      .pm-mockup-url { font-size: 12px; color: rgba(6,46,35,0.55); background: rgba(6,46,35,0.05); padding: 5px 12px; border-radius: 999px; margin: 0 auto; }
      .pm-mockup-body { display: grid; grid-template-columns: 220px 1fr; min-height: 460px; }
      .pm-mockup-side { padding: 20px 12px; border-right: 1px solid var(--line); background: #fbfcfb; display: flex; flex-direction: column; gap: 4px; }
      .pm-mock-group { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 12px; font-size: 13.5px; color: rgba(6,46,35,0.75); cursor: pointer; transition: background .2s; }
      .pm-mock-group:hover { background: rgba(6,46,35,0.05); }
      .pm-mock-group.active { background: var(--ink); color: var(--paper); }
      .pm-mock-new { margin-top: auto; display: flex; align-items: center; gap: 8px; padding: 10px 12px; border: 1px dashed rgba(6,46,35,0.2); background: transparent; border-radius: 12px; color: rgba(6,46,35,0.6); font-size: 13px; cursor: pointer; font-family: inherit; }
      .pm-mockup-main { padding: 28px 32px; display: flex; flex-direction: column; gap: 20px; }
      .pm-mock-head { display: flex; justify-content: space-between; align-items: flex-start; }
      .pm-mock-head h4 { margin: 0 0 4px; font-size: 20px; font-weight: 600; }
      .pm-mock-head p { margin: 0; font-size: 13px; color: rgba(6,46,35,0.55); }
      .pm-mock-balance { text-align: right; }
      .pm-mock-balance span { display: block; font-size: 11.5px; text-transform: uppercase; letter-spacing: .08em; color: rgba(6,46,35,0.5); }
      .pm-mock-balance strong { display: block; font-size: 24px; font-weight: 600; color: var(--primary); margin-top: 2px; }
      .pm-mock-list { display: flex; flex-direction: column; }
      .pm-mock-item { display: flex; align-items: center; gap: 14px; padding: 14px 6px; border-bottom: 1px solid var(--line); }
      .pm-mock-item:last-child { border-bottom: none; }
      .pm-mock-ico { width: 34px; height: 34px; border-radius: 10px; background: rgba(5,150,105,0.1); color: var(--primary); display: grid; place-items: center; }
      .pm-mock-txt { flex: 1; }
      .pm-mock-txt strong { display: block; font-size: 14px; font-weight: 500; }
      .pm-mock-txt em { display: block; font-style: normal; font-size: 12px; color: rgba(6,46,35,0.5); margin-top: 2px; }
      .pm-mock-amt { font-size: 14px; font-weight: 600; }
      .pm-mock-settle { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; background: linear-gradient(120deg, rgba(5,150,105,0.08), rgba(52,211,153,0.08)); border-radius: 16px; border: 1px solid rgba(5,150,105,0.15); }
      .pm-mock-settle em { display: block; font-style: normal; font-size: 11.5px; text-transform: uppercase; letter-spacing: .08em; color: rgba(6,46,35,0.55); }
      .pm-mock-settle strong { display: block; margin-top: 2px; font-size: 15px; font-weight: 600; }
      .pm-mock-btn { display: inline-flex; align-items: center; gap: 6px; padding: 10px 16px; background: var(--ink); color: var(--paper); border: none; border-radius: 999px; font-size: 13px; font-weight: 500; cursor: pointer; font-family: inherit; transition: transform .3s, background .3s; }
      .pm-mock-btn:hover { transform: translateY(-1px); background: var(--primary); }
      @media (max-width: 720px) { .pm-mockup-body { grid-template-columns: 1fr; } .pm-mockup-side { flex-direction: row; overflow-x: auto; border-right: none; border-bottom: 1px solid var(--line); } .pm-mock-new { display: none; } }

      .pm-trust { padding: 60px 0; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); background: #fff; overflow: hidden; }
      .pm-trust-title { max-width: 900px; margin: 0 auto 30px; padding: 0 20px; text-align: center; font-size: clamp(16px, 1.4vw, 19px); color: rgba(6,46,35,0.65); line-height: 1.5; }
      .pm-trust-track { overflow: hidden; }
      .pm-trust-inner { display: flex; gap: 60px; animation: pm-marq2 30s linear infinite; width: max-content; }
      @keyframes pm-marq2 { to { transform: translateX(-50%); } }
      .pm-trust-item { display: inline-flex; align-items: center; gap: 12px; font-size: 15px; font-weight: 500; color: var(--ink); white-space: nowrap; }
      .pm-trust-star { color: var(--primary); }

      .pm-ps { padding: 140px 0; }
      .pm-ps-eyebrow em { font-style: italic; font-family: 'Instrument Serif', serif; font-size: 18px; color: var(--primary); }
      .pm-ps-title { font-family: 'Instrument Serif', serif; font-weight: 400; font-size: clamp(34px, 4.5vw, 60px); line-height: 1.05; letter-spacing: -0.02em; margin: 12px 0 60px; max-width: 900px; }
      .pm-ps-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
      .pm-ps-card { padding: 40px; border-radius: 28px; border: 1px solid var(--line); background: #fff; }
      .pm-ps-problem { background: #fff; }
      .pm-ps-solution { background: var(--ink); color: var(--paper); border-color: transparent; }
      .pm-ps-label { display: inline-block; padding: 6px 12px; border-radius: 999px; font-size: 11.5px; font-weight: 600; text-transform: uppercase; letter-spacing: .1em; margin-bottom: 22px; background: rgba(6,46,35,0.06); color: var(--ink); }
      .pm-ps-solution .pm-ps-label { background: rgba(52,211,153,0.16); color: var(--mint); }
      .pm-ps-card ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 16px; }
      .pm-ps-card li { display: flex; gap: 14px; align-items: flex-start; font-size: 16px; line-height: 1.5; }
      .pm-ps-problem li span { flex-shrink: 0; width: 26px; height: 26px; border-radius: 999px; background: rgba(6,46,35,0.06); color: rgba(6,46,35,0.6); font-size: 12px; font-weight: 600; display: grid; place-items: center; margin-top: 2px; }
      .pm-ps-solution li svg { color: var(--mint); flex-shrink: 0; margin-top: 4px; }
      @media (max-width: 780px) { .pm-ps-grid { grid-template-columns: 1fr; } .pm-ps-card { padding: 28px; } }

      .pm-features { padding: 140px 0; background: #fff; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
      .pm-sec-head { max-width: 780px; margin-bottom: 70px; }
      .pm-sec-kicker { display: inline-block; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: .12em; color: var(--primary); margin-bottom: 18px; }
      .pm-sec-kicker-light { color: var(--mint); }
      .pm-sec-title { font-family: 'Instrument Serif', serif; font-weight: 400; font-size: clamp(34px, 4.5vw, 60px); line-height: 1.05; letter-spacing: -0.02em; margin: 0 0 20px; }
      .pm-sec-sub { font-size: 17px; color: rgba(6,46,35,0.6); line-height: 1.55; max-width: 620px; }
      .pm-feat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
      .pm-feat-card { position: relative; padding: 32px 28px 36px; border-radius: 24px; border: 1px solid var(--line); background: #fbfcfb; overflow: hidden; transition: .4s cubic-bezier(.6,.05,.2,1); cursor: pointer; }
      .pm-feat-card::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(5,150,105,0.08), transparent 60%); opacity: 0; transition: .4s; }
      .pm-feat-card:hover { transform: translateY(-6px); border-color: rgba(5,150,105,0.3); box-shadow: 0 30px 60px -30px rgba(5,150,105,0.35); }
      .pm-feat-card:hover::before { opacity: 1; }
      .pm-feat-card > * { position: relative; }
      .pm-feat-icon { width: 48px; height: 48px; border-radius: 14px; background: var(--ink); color: var(--paper); display: grid; place-items: center; margin-bottom: 20px; }
      .pm-feat-icon svg { width: 22px; height: 22px; }
      .pm-feat-tag { display: inline-block; font-size: 11px; text-transform: uppercase; letter-spacing: .1em; font-weight: 600; color: var(--primary); margin-bottom: 10px; }
      .pm-feat-card h3 { margin: 0 0 10px; font-size: 20px; font-weight: 600; letter-spacing: -0.01em; }
      .pm-feat-card p { margin: 0; font-size: 14.5px; line-height: 1.55; color: rgba(6,46,35,0.6); }
      .pm-feat-arrow { position: absolute; top: 28px; right: 28px; width: 36px; height: 36px; border-radius: 999px; border: 1px solid var(--line); display: grid; place-items: center; color: var(--ink); transition: .3s; }
      .pm-feat-card:hover .pm-feat-arrow { background: var(--ink); color: var(--paper); transform: rotate(45deg); }
      @media (max-width: 900px) { .pm-feat-grid { grid-template-columns: 1fr 1fr; } }
      @media (max-width: 600px) { .pm-feat-grid { grid-template-columns: 1fr; } }

      .pm-split { padding: 140px 0; }
      .pm-split-panel { background: #fff; border: 1px solid var(--line); border-radius: 28px; padding: 8px; box-shadow: 0 40px 80px -40px rgba(6,46,35,0.2); }
      .pm-split-tabs { display: flex; gap: 4px; padding: 6px; background: rgba(6,46,35,0.04); border-radius: 22px; width: fit-content; margin-bottom: 8px; }
      .pm-split-tab { padding: 10px 20px; background: transparent; border: none; border-radius: 16px; font-size: 14px; font-weight: 500; color: rgba(6,46,35,0.6); cursor: pointer; font-family: inherit; transition: .3s; }
      .pm-split-tab:hover { color: var(--ink); }
      .pm-split-tab.is-active { background: #fff; color: var(--ink); box-shadow: 0 6px 16px -8px rgba(6,46,35,0.2); }
      .pm-split-body { padding: 32px 28px; }
      .pm-split-head { display: flex; justify-content: space-between; align-items: center; padding-bottom: 24px; border-bottom: 1px solid var(--line); margin-bottom: 24px; }
      .pm-split-head em { display: block; font-style: normal; font-size: 12px; text-transform: uppercase; letter-spacing: .1em; color: rgba(6,46,35,0.5); }
      .pm-split-head strong { display: block; font-family: 'Instrument Serif', serif; font-weight: 400; font-size: 42px; margin-top: 4px; }
      .pm-split-meta { font-size: 13px; color: rgba(6,46,35,0.55); }
      .pm-split-meta span { color: var(--primary); font-weight: 600; }
      .pm-split-list { display: flex; flex-direction: column; gap: 14px; }
      .pm-split-row { display: grid; grid-template-columns: 34px 90px 1fr 80px; align-items: center; gap: 16px; }
      .pm-split-avatar { width: 34px; height: 34px; border-radius: 999px; color: #fff; font-weight: 600; font-size: 13px; display: grid; place-items: center; }
      .pm-split-name { font-size: 14.5px; font-weight: 500; }
      .pm-split-bar { height: 10px; background: rgba(6,46,35,0.05); border-radius: 999px; overflow: hidden; }
      .pm-split-fill { height: 100%; border-radius: 999px; transition: width .6s cubic-bezier(.6,.05,.2,1); }
      .pm-split-amt { text-align: right; font-size: 15px; font-weight: 600; }

      .pm-stats { padding: 140px 0; background: var(--ink); color: var(--paper); }
      .pm-stats-head { max-width: 820px; margin-bottom: 70px; }
      .pm-stats-title { font-family: 'Instrument Serif', serif; font-weight: 400; font-size: clamp(34px, 4.5vw, 60px); line-height: 1.05; letter-spacing: -0.02em; margin: 0; color: var(--paper); }
      .pm-stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px; }
      .pm-stat { padding-top: 28px; border-top: 1px solid rgba(255,255,255,0.14); }
      .pm-stat-n { font-family: 'Instrument Serif', serif; font-size: clamp(52px, 6vw, 84px); line-height: 1; color: var(--mint); letter-spacing: -0.03em; }
      .pm-stat-t { margin-top: 18px; font-size: 15px; font-weight: 600; color: var(--paper); }
      .pm-stat-d { margin-top: 6px; font-size: 13.5px; line-height: 1.5; color: rgba(255,255,255,0.55); }
      @media (max-width: 900px) { .pm-stats-grid { grid-template-columns: 1fr 1fr; } }
      @media (max-width: 500px) { .pm-stats-grid { grid-template-columns: 1fr; } }

      .pm-cta { padding: 60px 0 140px; }
      .pm-cta-card { position: relative; overflow: hidden; padding: clamp(48px, 8vw, 100px) clamp(24px, 5vw, 80px); border-radius: 40px; background: radial-gradient(ellipse at top right, rgba(52,211,153,0.4), transparent 60%), linear-gradient(160deg, var(--ink), #0a4030); color: var(--paper); }
      .pm-cta-orn { position: absolute; width: 500px; height: 500px; border-radius: 999px; background: radial-gradient(circle, var(--mint), transparent 70%); opacity: 0.2; top: -180px; right: -120px; }
      .pm-cta-kick { display: inline-block; padding: 7px 14px; background: rgba(52,211,153,0.16); color: var(--mint); border-radius: 999px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: .1em; margin-bottom: 24px; }
      .pm-cta-title { position: relative; font-family: 'Instrument Serif', serif; font-weight: 400; font-size: clamp(36px, 5vw, 68px); line-height: 1.05; letter-spacing: -0.02em; margin: 0 0 20px; max-width: 800px; }
      .pm-cta-sub { position: relative; font-size: 17px; color: rgba(255,255,255,0.7); line-height: 1.55; max-width: 560px; }
      .pm-cta-actions { position: relative; display: flex; flex-wrap: wrap; gap: 12px; margin-top: 34px; }

      .pm-footer { padding: 80px 0 30px; background: #fff; border-top: 1px solid var(--line); }
      .pm-footer-inner { display: grid; grid-template-columns: 1fr 2fr; gap: 60px; padding-bottom: 60px; }
      .pm-footer-brand { display: flex; flex-direction: column; gap: 12px; }
      .pm-footer-brand > span { display: flex; align-items: center; gap: 8px; font-weight: 600; }
      .pm-footer-brand em { font-style: normal; color: var(--primary); font-weight: 400; }
      .pm-footer-brand p { margin: 8px 0 0; font-size: 14px; color: rgba(6,46,35,0.55); max-width: 260px; }
      .pm-footer-cols { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; }
      .pm-footer-cols h5 { margin: 0 0 16px; font-size: 12px; text-transform: uppercase; letter-spacing: .12em; color: rgba(6,46,35,0.5); font-weight: 600; }
      .pm-footer-cols a { display: block; padding: 5px 0; font-size: 14px; color: var(--ink); text-decoration: none; transition: color .2s; }
      .pm-footer-cols a:hover { color: var(--primary); }
      .pm-footer-base { display: flex; justify-content: space-between; padding: 24px 20px 0; max-width: 1240px; margin: 0 auto; border-top: 1px solid var(--line); font-size: 13px; color: rgba(6,46,35,0.5); }
      @media (max-width: 760px) { .pm-footer-inner { grid-template-columns: 1fr; } .pm-footer-base { flex-direction: column; gap: 8px; text-align: center; justify-content: center; } }

      .pm-simplify { padding: 140px 0; background: #fff; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
      .pm-sec-title em { font-style: italic; color: var(--primary); }
      .pm-simp-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin: 20px 0 40px; }
      .pm-simp-stat { padding: 22px 24px; border: 1px solid var(--line); border-radius: 20px; background: #fbfcfb; }
      .pm-simp-stat strong { font-family: 'Instrument Serif', serif; font-size: 40px; line-height: 1; color: var(--primary); display: block; }
      .pm-simp-stat span { display: block; margin-top: 8px; font-size: 13px; color: rgba(6,46,35,0.6); }
      .pm-simp-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
      .pm-simp-card { padding: 28px; border-radius: 24px; border: 1px solid var(--line); background: #fbfcfb; }
      .pm-simp-card-after { background: var(--ink); color: var(--paper); border-color: transparent; }
      .pm-simp-card header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; }
      .pm-simp-card header strong { font-size: 14px; opacity: .75; font-weight: 500; }
      .pm-simp-pill { display: inline-block; padding: 5px 12px; border-radius: 999px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .1em; background: rgba(6,46,35,0.08); color: var(--ink); }
      .pm-simp-pill-good { background: rgba(52,211,153,0.18); color: var(--mint); }
      .pm-simp-card ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
      .pm-simp-card li { display: flex; align-items: center; gap: 10px; padding: 12px 14px; background: #fff; border-radius: 14px; font-size: 14px; }
      .pm-simp-card-after li { background: rgba(255,255,255,0.06); }
      .pm-simp-card li em { font-style: normal; margin-left: auto; font-weight: 600; }
      @media (max-width: 780px) { .pm-simp-grid { grid-template-columns: 1fr; } .pm-simp-stats { grid-template-columns: 1fr; } }

      .pm-analytics { padding: 140px 0; }
      .pm-anal-grid { display: grid; grid-template-columns: 1.4fr 1fr; gap: 20px; }
      .pm-anal-card { padding: 28px; border-radius: 24px; border: 1px solid var(--line); background: #fff; }
      .pm-anal-card header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; }
      .pm-anal-card header em { font-style: normal; font-size: 12px; color: rgba(6,46,35,0.55); text-transform: uppercase; letter-spacing: .1em; }
      .pm-anal-card header strong { display: block; font-size: 18px; margin-top: 4px; font-weight: 600; }
      .pm-anal-export { padding: 8px 14px; border-radius: 999px; background: rgba(6,46,35,0.05); border: 1px solid var(--line); font-size: 12.5px; cursor: pointer; font-family: inherit; color: var(--ink); }
      .pm-donut-wrap { display: grid; grid-template-columns: 220px 1fr; gap: 24px; align-items: center; }
      .pm-donut { width: 220px; height: 220px; }
      .pm-donut-lbl { font-size: 11px; fill: rgba(6,46,35,0.55); text-transform: uppercase; letter-spacing: .1em; }
      .pm-donut-val { font-family: 'Instrument Serif', serif; font-size: 22px; fill: var(--ink); }
      .pm-anal-legend { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; }
      .pm-anal-legend li { display: flex; align-items: center; gap: 10px; font-size: 13.5px; }
      .pm-anal-legend i { width: 10px; height: 10px; border-radius: 3px; display: inline-block; }
      .pm-anal-legend em { margin-left: auto; font-style: normal; color: rgba(6,46,35,0.55); font-variant-numeric: tabular-nums; }
      .pm-anal-card footer { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 22px; padding-top: 20px; border-top: 1px solid var(--line); }
      .pm-anal-card footer span { font-size: 11.5px; color: rgba(6,46,35,0.55); text-transform: uppercase; letter-spacing: .08em; }
      .pm-anal-card footer strong { display: block; margin-top: 4px; font-size: 16px; font-weight: 600; }
      .pm-up { color: var(--primary); }
      .pm-anal-list h4 { margin: 0 0 16px; font-family: 'Instrument Serif', serif; font-size: 26px; font-weight: 400; letter-spacing: -0.01em; }
      .pm-anal-list ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 12px; }
      .pm-anal-list li { display: flex; gap: 10px; align-items: flex-start; font-size: 14.5px; line-height: 1.5; color: rgba(6,46,35,0.75); }
      .pm-anal-list li svg { color: var(--primary); margin-top: 3px; flex-shrink: 0; }
      @media (max-width: 900px) { .pm-anal-grid { grid-template-columns: 1fr; } .pm-donut-wrap { grid-template-columns: 1fr; justify-items: center; } }

      .pm-how { padding: 140px 0; background: #fff; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
      .pm-how-grid { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; counter-reset: pm-step; }
      .pm-how-step { padding: 28px 24px; border: 1px solid var(--line); border-radius: 22px; background: #fbfcfb; transition: .3s cubic-bezier(.6,.05,.2,1); }
      .pm-how-step:hover { transform: translateY(-4px); border-color: rgba(5,150,105,0.35); background: #fff; }
      .pm-how-n { display: inline-block; font-family: 'Instrument Serif', serif; font-size: 34px; color: var(--primary); line-height: 1; margin-bottom: 14px; }
      .pm-how-step strong { display: block; font-size: 17px; font-weight: 600; margin-bottom: 6px; letter-spacing: -0.01em; }
      .pm-how-step p { margin: 0; font-size: 14px; color: rgba(6,46,35,0.6); line-height: 1.55; }
      @media (max-width: 900px) { .pm-how-grid { grid-template-columns: 1fr 1fr; } }
      @media (max-width: 560px) { .pm-how-grid { grid-template-columns: 1fr; } }

      .pm-cta-chips { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 40px; }
      .pm-cta-chip { padding: 16px 18px; border-radius: 16px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); }
      .pm-cta-chip strong { display: block; font-size: 14px; font-weight: 600; color: var(--paper); }
      .pm-cta-chip span { display: block; margin-top: 4px; font-size: 12.5px; color: rgba(245,247,244,0.6); }
      @media (max-width: 780px) { .pm-cta-chips { grid-template-columns: 1fr; } }
    `}</style>
  );
}