'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import {
  ArrowRight,
  Wallet,
  Users,
  PieChart as PieChartIcon,
  History,
  ShieldCheck,
  Split,
  Landmark,
  Lock,
  KeyRound,
  ServerCog,
} from 'lucide-react';
import {
  LineChart,
  Line,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
} from 'recharts';

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/*  Brand tokens                                                       */
/* ------------------------------------------------------------------ */
// Primary Emerald   #059669   Secondary Emerald #10B981
// Accent Mint       #34D399   Light Mint        #6EE7B7
// Dark Slate        #0F172A   Light Background  #F8FAFC

/* ------------------------------------------------------------------ */
/*  Reveal hook — GSAP + ScrollTrigger, free-tier only (no SplitText)  */
/* ------------------------------------------------------------------ */
function useRevealGroup(selector: string, opts?: { stagger?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const els = ref.current.querySelectorAll(selector);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        els,
        { y: 32, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          stagger: opts?.stagger ?? 0.1,
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 78%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, ref);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}

/* ------------------------------------------------------------------ */
/*  Smooth scroll (Lenis <-> ScrollTrigger)                            */
/* ------------------------------------------------------------------ */
function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    let raf: number;
    function loop(time: number) {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);
}

/* ------------------------------------------------------------------ */
/*  Magnetic button — small, restrained, no gimmick cursor             */
/* ------------------------------------------------------------------ */
function MagneticLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function onMove(e: MouseEvent) {
      const rect = el!.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(el, { x: x * 0.25, y: y * 0.35, duration: 0.4, ease: 'power3.out' });
    }
    function onLeave() {
      gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
    }

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <Link href={href} ref={ref} className={className}>
      {children}
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  NAV — hides on scroll down, reveals on scroll up                   */
/* ------------------------------------------------------------------ */
function Navbar() {
  const barRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let lastY = 0;
    function onScroll() {
      const y = window.scrollY;
      if (!barRef.current) return;
      if (y > lastY && y > 120) {
        gsap.to(barRef.current, { yPercent: -100, duration: 0.4, ease: 'power2.out' });
      } else {
        gsap.to(barRef.current, { yPercent: 0, duration: 0.4, ease: 'power2.out' });
      }
      lastY = y;
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      ref={barRef}
      className="fixed top-0 inset-x-0 z-50 bg-[#0F172A]/70 backdrop-blur-md border-b border-white/[0.06]"
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-8 h-16">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/green logo.png" alt="PayMint Verse" width={30} height={30} className="rounded-lg" />
          <span className="font-semibold text-white text-[16px] tracking-tight">
            PayMint <span className="text-[#34D399]">Verse</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-[14px] font-medium text-slate-300">
          <a href="#features" className="hover:text-white transition-colors">Product</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
          <a href="#security" className="hover:text-white transition-colors">Security</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/auth/login" className="hidden sm:inline-flex text-[14px] font-medium text-slate-300 hover:text-white transition-colors px-3 py-2">
            Log in
          </Link>
          <MagneticLink
            href="/auth/signup"
            className="inline-flex items-center gap-1.5 bg-[#10B981] hover:bg-[#059669] text-[#0F172A] text-[14px] font-semibold px-4 py-2.5 rounded-full transition-colors"
          >
            Get started
            <ArrowRight className="w-3.5 h-3.5" />
          </MagneticLink>
        </div>
      </nav>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/*  HERO — dark, word-by-word reveal (no paid SplitText plugin)        */
/* ------------------------------------------------------------------ */
function Hero() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const ornamentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapRef.current) return;
    const ctx = gsap.context(() => {
      const words = wrapRef.current!.querySelectorAll('.word');
      gsap.fromTo(
        words,
        { yPercent: 120, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.9, ease: 'power4.out', stagger: 0.045, delay: 0.15 }
      );
      gsap.fromTo(
        '.hero-sub, .hero-cta, .hero-badge',
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.08, delay: 0.55 }
      );
      gsap.fromTo(
        '.hero-card',
        { y: 40, opacity: 0, scale: 0.97 },
        { y: 0, opacity: 1, scale: 1, duration: 1, ease: 'power3.out', delay: 0.35 }
      );

      // subtle parallax on ambient ornament
      gsap.to(ornamentRef.current, {
        yPercent: 25,
        ease: 'none',
        scrollTrigger: { trigger: wrapRef.current, start: 'top top', end: 'bottom top', scrub: 1 },
      });
    }, wrapRef);
    return () => ctx.revert();
  }, []);

  const Word = ({ children }: { children: string }) => (
    <span className="inline-block overflow-hidden align-bottom mr-[0.28em]">
      <span className="word inline-block">{children}</span>
    </span>
  );

  return (
    <section ref={wrapRef} className="relative bg-[#0F172A] pt-40 pb-32 px-6 lg:px-8 overflow-hidden">
      <div
        ref={ornamentRef}
        aria-hidden
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] rounded-full opacity-[0.14] blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #10B981 0%, #34D399 40%, transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto relative grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="hero-badge inline-flex items-center gap-2 bg-white/[0.06] border border-white/10 text-[#6EE7B7] text-[13px] font-medium px-3 py-1.5 rounded-full mb-7">
            <span className="w-1.5 h-1.5 rounded-full bg-[#34D399]" />
            Trusted by 10,000+ groups
          </div>

          <h1 className="text-[46px] sm:text-[60px] leading-[1.04] font-bold tracking-tight text-white">
            <div><Word>Stop</Word><Word>chasing</Word></div>
            <div><Word>people</Word><Word>for</Word></div>
            <div><span className="text-[#34D399]"><Word>money.</Word></span></div>
          </h1>

          <p className="hero-sub mt-7 text-[18px] leading-relaxed text-slate-400 max-w-md">
            PayMint Verse tracks, splits, and settles group expenses
            automatically — trips, rent, dinners, or team budgets — with
            balances everyone can trust.
          </p>

          <div className="hero-cta mt-9 flex flex-wrap items-center gap-5">
            <MagneticLink
              href="/auth/signup"
              className="inline-flex items-center gap-2 bg-[#10B981] hover:bg-[#059669] text-[#0F172A] font-semibold text-[15px] px-6 py-3.5 rounded-full transition-colors"
            >
              Create your first group
              <ArrowRight className="w-4 h-4" />
            </MagneticLink>
            <a href="#how-it-works" className="text-[15px] font-medium text-slate-300 hover:text-white transition-colors underline underline-offset-4 decoration-white/20">
              See how it works
            </a>
          </div>
        </div>

        {/* Hero visual */}
        <div className="hero-card relative">
          <div className="relative bg-[#111C33] border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/40 p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-[12.5px] text-slate-500">Northern Trip</p>
                <p className="text-[15px] font-semibold text-white">Group balance</p>
              </div>
              <div className="flex -space-x-2">
                {['A', 'U', 'H'].map((l, i) => (
                  <div
                    key={l}
                    className="w-8 h-8 rounded-full border-2 border-[#111C33] flex items-center justify-center text-[12px] font-semibold text-[#0F172A]"
                    style={{ background: ['#34D399', '#10B981', '#6EE7B7'][i] }}
                  >
                    {l}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/[0.04] rounded-xl p-4 mb-5 border border-white/[0.06]">
              <p className="text-[12.5px] text-slate-500 mb-1">Total tracked</p>
              <p className="text-[28px] font-bold text-white tracking-tight">Rs 84,200</p>
            </div>

            <div className="space-y-2.5">
              <p className="text-[12px] font-semibold text-slate-500 uppercase tracking-wide">Settling up</p>
              <div className="flex items-center gap-2 bg-[#10B981]/10 border border-[#10B981]/25 rounded-lg px-3 py-2.5">
                <span className="font-semibold text-[13.5px] text-white">Ali</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#34D399]" />
                <span className="font-semibold text-[13.5px] text-white">Umar</span>
                <span className="ml-auto text-[13.5px] font-bold text-[#34D399]">Rs 12,000</span>
              </div>
              <p className="text-[12px] text-slate-500 pl-0.5">
                Simplified from Ali → Ahmed → Umar automatically
              </p>
            </div>
          </div>

          <div
            aria-hidden
            className="absolute -bottom-5 -left-5 w-16 h-16 rounded-2xl -z-10"
            style={{ background: 'linear-gradient(135deg,#059669,#34D399)' }}
          />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  TRUST MARQUEE — infinite horizontal scroll, CSS-driven             */
/* ------------------------------------------------------------------ */
function TrustMarquee() {
  const items = [
    '10,000+ active groups',
    'Rs 2M+ settled transparently',
    '4 split methods',
    'EasyPaisa & JazzCash support',
    '99.9% uptime',
    'Bank-level encryption',
  ];
  const loop = [...items, ...items];

  return (
    <section className="bg-[#0F172A] border-y border-white/[0.06] py-6 overflow-hidden">
      <div className="flex w-max animate-[marquee_28s_linear_infinite]">
        {loop.map((t, i) => (
          <div key={i} className="flex items-center gap-3 px-8 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#34D399]" />
            <span className="text-[14px] font-medium text-slate-400 whitespace-nowrap">{t}</span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  PROBLEM -> SOLUTION — horizontal comparison, not two boxes         */
/* ------------------------------------------------------------------ */
function ProblemSolution() {
  const ref = useRevealGroup('.ps-item');

  return (
    <section className="py-28 px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <p className="ps-item text-[13.5px] font-semibold text-[#059669] uppercase tracking-wide mb-3">
          The problem
        </p>
        <h2 className="ps-item text-[34px] sm:text-[42px] font-bold text-[#0F172A] tracking-tight leading-tight max-w-2xl mb-16">
          Shared money is messy. It shouldn&apos;t be.
        </h2>

        <div className="space-y-0">
          {[
            { before: 'Screenshots and sticky notes for who paid what', after: 'Every expense logged the moment it happens' },
            { before: 'Payment chains nobody can untangle', after: 'Debts simplified into the fewest payments' },
            { before: 'Awkward reminders to settle up', after: 'Balances update in real time, for everyone' },
            { before: 'No record once cash changes hands', after: 'A transparent timeline, permanently' },
          ].map((row, i) => (
            <div
              key={i}
              className="ps-item grid md:grid-cols-2 gap-6 py-6 border-t border-slate-200 last:border-b"
            >
              <p className="text-[15px] text-slate-400">{row.before}</p>
              <p className="text-[15px] font-medium text-[#0F172A] flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-[#059669] shrink-0" />
                {row.after}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  FEATURES — editorial alternating rows, not a bento grid            */
/* ------------------------------------------------------------------ */
const balanceData = [
  { m: 'Mon', v: 12 }, { m: 'Tue', v: 18 }, { m: 'Wed', v: 14 },
  { m: 'Thu', v: 26 }, { m: 'Fri', v: 21 }, { m: 'Sat', v: 34 }, { m: 'Sun', v: 29 },
];

function FeatureRow({
  icon: Icon,
  title,
  desc,
  chips,
  visual,
  reverse,
}: {
  icon: any;
  title: string;
  desc: string;
  chips?: string[];
  visual: React.ReactNode;
  reverse?: boolean;
}) {
  const ref = useRevealGroup('.frow', { stagger: 0.12 });

  return (
    <div
      ref={ref}
      className={`grid md:grid-cols-2 gap-12 items-center py-16 border-b border-slate-200 last:border-b-0 ${
        reverse ? 'md:[&>*:first-child]:order-2' : ''
      }`}
    >
      <div className="frow">
        <div className="w-11 h-11 rounded-xl bg-[#ECFDF5] flex items-center justify-center mb-5">
          <Icon className="w-5 h-5 text-[#059669]" />
        </div>
        <h3 className="text-[24px] font-bold text-[#0F172A] mb-3 tracking-tight">{title}</h3>
        <p className="text-[15.5px] text-slate-500 leading-relaxed max-w-md mb-5">{desc}</p>
        {chips && (
          <div className="flex flex-wrap gap-2">
            {chips.map((c) => (
              <span key={c} className="text-[12.5px] font-medium bg-[#F8FAFC] border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg">
                {c}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="frow">{visual}</div>
    </div>
  );
}

function Features() {
  return (
    <section id="features" className="py-8 px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl mb-4 pt-16">
          <p className="text-[13.5px] font-semibold text-[#059669] uppercase tracking-wide mb-3">
            Everything in one place
          </p>
          <h2 className="text-[34px] sm:text-[42px] font-bold text-[#0F172A] tracking-tight leading-tight">
            Built for how groups actually spend money
          </h2>
        </div>

        <FeatureRow
          icon={Wallet}
          title="Smart expense tracking"
          desc="Log title, amount, category, and who paid in seconds. Four ways to split, every time the math checks out — down to the last rupee."
          chips={['Equal', 'Custom amount', 'Percentage', 'Shares']}
          visual={
            <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-6">
              <p className="text-[12.5px] text-slate-400 mb-4">New expense</p>
              <div className="space-y-3">
                <div className="bg-white border border-slate-200 rounded-lg px-4 py-3 text-[14px] text-slate-500">Dinner at Kolachi</div>
                <div className="flex gap-3">
                  <div className="bg-white border border-slate-200 rounded-lg px-4 py-3 text-[14px] text-slate-500 flex-1">Rs 4,800</div>
                  <div className="bg-white border border-slate-200 rounded-lg px-4 py-3 text-[14px] text-slate-500 flex-1">Food</div>
                </div>
                <div className="flex gap-2">
                  {['Equal', 'Custom', '%'].map((s, i) => (
                    <span key={s} className={`text-[12.5px] px-3 py-1.5 rounded-lg font-medium ${i === 0 ? 'bg-[#059669] text-white' : 'bg-white border border-slate-200 text-slate-500'}`}>{s}</span>
                  ))}
                </div>
              </div>
            </div>
          }
        />

        <FeatureRow
          reverse
          icon={PieChartIcon}
          title="Real-time balances"
          desc="For every member, the app continuously calculates total paid, total owed, and current balance — so nobody has to ask."
          visual={
            <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-6">
              <p className="text-[12.5px] text-slate-400 mb-1">This week</p>
              <p className="text-[22px] font-bold text-[#0F172A] mb-4">Balance trend</p>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={balanceData}>
                    <Line type="monotone" dataKey="v" stroke="#059669" strokeWidth={2.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          }
        />

        <FeatureRow
          icon={ArrowRight}
          title="Debt simplification"
          desc="Instead of Ali paying Ahmed who pays Umar, PayMint Verse collapses the chain into Ali → Umar directly. Fewer transfers, same result."
          visual={
            <div className="bg-[#0F172A] rounded-2xl p-8 flex flex-col gap-4">
              <div className="flex items-center gap-2 text-[13.5px] text-slate-500 line-through">
                <span>Ali</span><ArrowRight className="w-3.5 h-3.5" /><span>Ahmed</span><ArrowRight className="w-3.5 h-3.5" /><span>Umar</span>
              </div>
              <div className="flex items-center gap-2 bg-[#10B981]/10 border border-[#10B981]/25 rounded-lg px-4 py-3 w-fit">
                <span className="font-semibold text-[14px] text-white">Ali</span>
                <ArrowRight className="w-4 h-4 text-[#34D399]" />
                <span className="font-semibold text-[14px] text-white">Umar</span>
              </div>
            </div>
          }
        />

        <FeatureRow
          reverse
          icon={Landmark}
          title="Settle your way"
          desc="Cash, bank transfer, EasyPaisa, or JazzCash — recorded the instant it happens, updating every balance in the group automatically."
          visual={
            <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-6 grid grid-cols-2 gap-3">
              {['Cash', 'Bank transfer', 'EasyPaisa', 'JazzCash'].map((m) => (
                <div key={m} className="bg-white border border-slate-200 rounded-lg px-4 py-3 text-[13.5px] font-medium text-[#0F172A] flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-[#059669]" />
                  {m}
                </div>
              ))}
            </div>
          }
        />
      </div>

      {/* small supporting features */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 pt-16">
        {[
          { icon: Users, title: 'Group roles', desc: 'Owner, Admin, Moderator, Member — invite by email.' },
          { icon: History, title: 'Activity timeline', desc: 'Every action recorded — nothing happens quietly.' },
          { icon: Split, title: 'Insights & export', desc: 'Spending by category, monthly trends, CSV export.' },
        ].map((f) => (
          <div key={f.title} className="border border-slate-200 rounded-2xl p-6">
            <f.icon className="w-5 h-5 text-[#059669] mb-4" />
            <h3 className="text-[16px] font-semibold text-[#0F172A] mb-1.5">{f.title}</h3>
            <p className="text-[13.5px] text-slate-500">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  HOW IT WORKS — legitimate numbered sequence + scroll line-draw     */
/* ------------------------------------------------------------------ */
function HowItWorks() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hiw-line',
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.2,
          ease: 'power2.inOut',
          transformOrigin: 'left center',
          scrollTrigger: { trigger: wrapRef.current, start: 'top 70%' },
        }
      );
      gsap.fromTo(
        '.hiw-step',
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: { trigger: wrapRef.current, start: 'top 70%' },
        }
      );
    }, wrapRef);
    return () => ctx.revert();
  }, []);

  const steps = [
    { title: 'Create a group', desc: 'Northern Trip, Apartment Expenses, Office Team — invite by email in seconds.' },
    { title: 'Add an expense', desc: 'Title, amount, category, who paid. Split equally, by percentage, shares, or a custom amount.' },
    { title: 'Balances update instantly', desc: 'Everyone sees who owes what — simplified into the fewest payments automatically.' },
    { title: 'Settle up', desc: 'Cash, bank transfer, EasyPaisa, or JazzCash. One tap, and the balance clears for everyone.' },
  ];

  return (
    <section id="how-it-works" ref={wrapRef} className="py-28 px-6 lg:px-8 bg-[#F8FAFC]">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl mb-16">
          <p className="text-[13.5px] font-semibold text-[#059669] uppercase tracking-wide mb-3">How it works</p>
          <h2 className="text-[34px] sm:text-[42px] font-bold text-[#0F172A] tracking-tight leading-tight">
            From first expense to fully settled
          </h2>
        </div>

        <div className="grid md:grid-cols-4 gap-8 relative">
          <div className="hiw-line hidden md:block absolute top-6 left-[12.5%] right-[12.5%] h-px bg-[#059669]" />
          {steps.map((step, i) => (
            <div key={step.title} className="hiw-step relative">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-[15px] mb-5 relative z-10"
                style={{ background: 'linear-gradient(135deg,#059669,#34D399)' }}
              >
                {i + 1}
              </div>
              <h3 className="text-[16.5px] font-semibold text-[#0F172A] mb-2">{step.title}</h3>
              <p className="text-[14px] text-slate-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  ANALYTICS — dark slab, scroll-scale reveal                         */
/* ------------------------------------------------------------------ */
const categoryData = [
  { name: 'Food', v: 32 }, { name: 'Transport', v: 18 }, { name: 'Stay', v: 24 },
  { name: 'Fun', v: 14 }, { name: 'Other', v: 9 },
];

function AnalyticsShowcase() {
  const cardRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { scale: 0.92, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: wrapRef.current, start: 'top 70%' },
        }
      );
    }, wrapRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={wrapRef} className="py-28 px-6 lg:px-8 bg-[#0F172A] relative overflow-hidden">
      <div
        aria-hidden
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-[0.12] blur-3xl"
        style={{ background: 'radial-gradient(circle,#34D399,transparent 70%)' }}
      />
      <div className="max-w-6xl mx-auto relative grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-[13.5px] font-semibold text-[#6EE7B7] uppercase tracking-wide mb-3">Analytics</p>
          <h2 className="text-[34px] sm:text-[42px] font-bold text-white tracking-tight leading-tight mb-5">
            See where the money actually goes
          </h2>
          <p className="text-[16px] text-slate-400 leading-relaxed max-w-md">
            Spending by category, monthly trends, and a full export to CSV
            whenever you need the raw numbers. No spreadsheets required.
          </p>
        </div>

        <div ref={cardRef} className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
          <p className="text-[12.5px] font-medium text-slate-500 mb-1">Northern Trip · This month</p>
          <p className="text-[22px] font-bold text-white mb-5">Spending by category</p>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <XAxis dataKey="name" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 8, fontSize: 12, color: '#F8FAFC' }}
                />
                <Bar dataKey="v" fill="#34D399" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  TESTIMONIALS                                                       */
/* ------------------------------------------------------------------ */
function Testimonials() {
  const ref = useRevealGroup('.tst-card', { stagger: 0.12 });

  const quotes = [
    { quote: 'We used to argue about who paid for gas. Now the app just tells us.', name: 'Hina R.', tag: 'Trip group · 6 people' },
    { quote: 'Rent, utilities, groceries — settling up went from a monthly headache to a two-minute task.', name: 'Bilal K.', tag: 'Roommates · 3 people' },
    { quote: 'Our team expenses used to live in three chats. Now one record everyone trusts.', name: 'Ayesha M.', tag: 'Small team · 8 people' },
  ];

  return (
    <section className="py-28 px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <div className="max-w-2xl mb-14">
          <p className="text-[13.5px] font-semibold text-[#059669] uppercase tracking-wide mb-3">Built for real groups</p>
          <h2 className="text-[34px] sm:text-[42px] font-bold text-[#0F172A] tracking-tight leading-tight">
            Whoever you split expenses with
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {quotes.map((q) => (
            <div key={q.name} className="tst-card bg-[#F8FAFC] border border-slate-200 rounded-2xl p-7">
              <p className="text-[14.5px] text-slate-600 leading-relaxed mb-6">&ldquo;{q.quote}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[13px] font-semibold"
                  style={{ background: 'linear-gradient(135deg,#059669,#34D399)' }}
                >
                  {q.name[0]}
                </div>
                <div>
                  <p className="text-[13.5px] font-semibold text-[#0F172A]">{q.name}</p>
                  <p className="text-[12.5px] text-slate-400">{q.tag}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  SECURITY                                                            */
/* ------------------------------------------------------------------ */
function Security() {
  const ref = useRevealGroup('.sec-item', { stagger: 0.1 });

  const points = [
    { icon: Lock, title: 'Encrypted by default', desc: 'Your data is protected end-to-end, at rest and in transit.' },
    { icon: KeyRound, title: 'Secure sign-in', desc: 'Email & password or Google — with server-side session handling.' },
    { icon: ServerCog, title: 'Protected access', desc: 'Every route and record is scoped to people you actually invited.' },
  ];

  return (
    <section id="security" className="py-28 px-6 lg:px-8 bg-[#F8FAFC]">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <div className="max-w-2xl mb-14">
          <p className="text-[13.5px] font-semibold text-[#059669] uppercase tracking-wide mb-3">Security</p>
          <h2 className="text-[34px] sm:text-[42px] font-bold text-[#0F172A] tracking-tight leading-tight">
            Your group&apos;s money, kept private
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {points.map((p) => (
            <div key={p.title} className="sec-item flex gap-4">
              <div className="w-11 h-11 shrink-0 rounded-xl bg-white border border-slate-200 flex items-center justify-center">
                <p.icon className="w-5 h-5 text-[#059669]" />
              </div>
              <div>
                <h3 className="text-[16px] font-semibold text-[#0F172A] mb-1.5">{p.title}</h3>
                <p className="text-[14px] text-slate-500 leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  FINAL CTA — magnetic button                                        */
/* ------------------------------------------------------------------ */
function FinalCTA() {
  const ref = useRevealGroup('.cta-item');

  return (
    <section className="px-6 lg:px-8 py-10 bg-white">
      <div
        ref={ref}
        className="max-w-6xl mx-auto rounded-3xl px-8 py-16 sm:py-20 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(120deg,#059669,#10B981)' }}
      >
        <div aria-hidden className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-white/10 blur-2xl" />
        <h2 className="cta-item text-[32px] sm:text-[42px] font-bold text-white tracking-tight max-w-2xl mx-auto leading-tight">
          Stop chasing people for money they already owe you.
        </h2>
        <p className="cta-item text-[16px] text-emerald-50/90 mt-4 max-w-md mx-auto">
          Create your first group free — no card required.
        </p>
        <MagneticLink
          href="/auth/signup"
          className="cta-item inline-flex items-center gap-2 bg-white text-[#059669] font-semibold text-[15px] px-7 py-3.5 rounded-full mt-8"
        >
          Get started for free
          <ArrowRight className="w-4 h-4" />
        </MagneticLink>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  FOOTER                                                              */
/* ------------------------------------------------------------------ */
function Footer() {
  const columns = [
    { title: 'Product', links: ['Features', 'How it works', 'Security', 'Pricing'] },
    { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
    { title: 'Legal', links: ['Privacy policy', 'Terms of service'] },
  ];

  return (
    <footer className="px-6 lg:px-8 py-16 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image src="/green logo.png" alt="PayMint Verse" width={28} height={28} className="rounded-lg" />
              <span className="font-semibold text-[#0F172A] text-[16px]">PayMint Verse</span>
            </div>
            <p className="text-[14px] text-slate-500 max-w-xs leading-relaxed">
              Transparent, automated expense splitting for trips, roommates, families, and teams.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {columns.map((col) => (
              <div key={col.title}>
                <p className="text-[13px] font-semibold text-[#0F172A] mb-3">{col.title}</p>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-[13.5px] text-slate-500 hover:text-[#059669] transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[13px] text-slate-400">© {new Date().getFullYear()} PayMint Verse. All rights reserved.</p>
          <div className="flex items-center gap-1.5 text-[12.5px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" />
            Bank-level encryption
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE                                                                */
/* ------------------------------------------------------------------ */
export default function Homepage() {
  useLenis();

  return (
    <main className="min-h-screen antialiased">
      <Navbar />
      <Hero />
      <TrustMarquee />
      <ProblemSolution />
      <Features />
      <HowItWorks />
      <AnalyticsShowcase />
      <Testimonials />
      <Security />
      <FinalCTA />
      <Footer />
    </main>
  );
}