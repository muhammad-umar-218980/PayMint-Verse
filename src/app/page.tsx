'use client';

import { useEffect, useRef } from "react";
import Link from "next/link";
import RotatingText from "@/components/RotatingText/RotatingText";
import {
  Users,
  Calculator,
  CheckCircle,
  Receipt,
  Clock,
  Utensils,
  Fuel,
  Building,
  GraduationCap,
  Home,
  Briefcase
} from "lucide-react";

const MEMBERS = [
  {
    id: "umar-amt",
    initial: "U",
    color: "bg-violet-900/40 text-violet-300",
    name: "Umar",
    sub: "paid Rs. 4,800",
    startAmt: "+Rs. 3,600",
    positive: true,
  },
  {
    id: "ali-amt",
    initial: "A",
    color: "bg-cyan-900/30 text-cyan-300",
    name: "Ali",
    sub: "owes Umar",
    startAmt: "-Rs. 1,200",
    positive: false,
  },
  {
    id: "hamza-amt",
    initial: "H",
    color: "bg-emerald-900/30 text-emerald-300",
    name: "Hamza",
    sub: "owes Umar",
    startAmt: "-Rs. 1,200",
    positive: false,
  },
  {
    id: "farhan-amt",
    initial: "F",
    color: "bg-amber-900/30 text-amber-300",
    name: "Farhan",
    sub: "owes Umar",
    startAmt: "-Rs. 1,200",
    positive: false,
  },
];

const EXPENSES = [
  {
    icon: Utensils,
    bg: "bg-violet-900/20 text-violet-400",
    title: "Dinner at Salt",
    by: "Paid by Umar",
    amt: "Rs. 4,800",
  },
  {
    icon: Fuel,
    bg: "bg-cyan-900/15 text-cyan-400",
    title: "Petrol",
    by: "Paid by Ali",
    amt: "Rs. 2,400",
  },
  {
    icon: Building,
    bg: "bg-amber-900/15 text-amber-400",
    title: "Hotel room",
    by: "Paid by Farhan",
    amt: "Rs. 8,000",
  },
];

const SETTLE_MESSAGES = [
  {
    id: "ali-amt",
    newAmt: "+Rs. 2,400",
    newUmarAmt: "+Rs. 2,400",
    msg: "✓ Ali settled · Rs. 1,200",
    settled: false,
  },
  {
    id: "hamza-amt",
    newAmt: "+Rs. 1,200",
    newUmarAmt: "+Rs. 1,200",
    msg: "✓ Hamza settled · Rs. 1,200",
    settled: false,
  },
  {
    id: "farhan-amt",
    newAmt: "Settled ✓",
    newUmarAmt: "Rs. 0",
    msg: "✓ All settled up! 🎉",
    settled: true,
  },
];

// ─── Live Debt Card ─────────────────────────────────────────────────────────────
function DebtCard() {
  const progressRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const idxRef = useRef(0);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const reset = () => {
      MEMBERS.forEach((m) => {
        const el = document.getElementById(m.id);
        if (!el) return;
        el.textContent = m.startAmt;
        el.className = `font-space text-[15px] font-bold ${m.positive ? "text-emerald-400" : "text-red-400"}`;
      });
      if (progressRef.current) progressRef.current.style.width = "0%";
      if (textRef.current)
        textRef.current.textContent = "✓ Ali settled · Rs. 1,200";
      idxRef.current = 0;
      timer = setTimeout(runSettle, 1200);
    };

    const runSettle = () => {
      const cur = SETTLE_MESSAGES[idxRef.current];
      if (textRef.current) textRef.current.textContent = cur.msg;
      if (progressRef.current) progressRef.current.style.width = "0%";

      timer = setTimeout(() => {
        if (progressRef.current) progressRef.current.style.width = "100%";

        timer = setTimeout(() => {
          const el = document.getElementById(cur.id);
          if (el) {
            el.textContent = cur.newAmt;
            el.className = `font-space text-[15px] font-bold ${cur.settled ? "text-slate-400" : "text-slate-300"}`;
          }
          const umarEl = document.getElementById("umar-amt");
          if (umarEl) {
            umarEl.textContent = cur.newUmarAmt;
            if (cur.newUmarAmt === "Rs. 0")
              umarEl.className =
                "font-space text-[15px] font-bold text-slate-400";
          }

          idxRef.current++;
          if (idxRef.current < SETTLE_MESSAGES.length) {
            timer = setTimeout(runSettle, 2000);
          } else {
            timer = setTimeout(reset, 2500);
          }
        }, 2400);
      }, 400);
    };

    timer = setTimeout(runSettle, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full max-w-[420px] flex flex-col gap-3">
      {/* Glow orbs */}
      <div className="absolute -top-16 -right-10 w-72 h-72 rounded-full bg-violet-700/18 blur-[60px] pointer-events-none" />
      <div className="absolute bottom-0 -left-14 w-52 h-52 rounded-full bg-indigo-600/12 blur-[60px] pointer-events-none" />

      {/* Debt summary card */}
      <div className="relative bg-[#151f30] border border-violet-900/20 rounded-2xl p-5 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-space text-[15px] font-semibold text-white">
            Lahore Trip 🚌
          </h4>
          <span className="text-[11px] text-violet-400 bg-violet-900/25 px-2.5 py-0.5 rounded-full">
            4 members
          </span>
        </div>

        {MEMBERS.map((m) => (
          <div
            key={m.id}
            className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-b-0"
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`w-[34px] h-[34px] rounded-full flex items-center justify-center text-[13px] font-bold font-space ${m.color}`}
              >
                {m.initial}
              </div>
              <div>
                <p className="text-sm font-medium text-white">{m.name}</p>
                <p className="text-[11px] text-slate-400">{m.sub}</p>
              </div>
            </div>
            <span
              id={m.id}
              className={`font-space text-[15px] font-bold transition-all duration-300 ${m.positive ? "text-emerald-400" : "text-red-400"}`}
            >
              {m.startAmt}
            </span>
          </div>
        ))}

        <div className="mt-3.5 relative overflow-hidden rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
          <div
            ref={progressRef}
            className="absolute top-0 left-0 h-full bg-emerald-500/15 rounded-xl transition-[width] duration-1800 ease-in-out"
            style={{ width: "0%" }}
          />
          <p
            ref={textRef}
            className="relative z-10 text-center py-3 text-sm font-semibold font-space"
          >
            ✓ Ali settled · Rs. 1,200
          </p>
        </div>
      </div>

      <div className="bg-[#151f30] border border-violet-900/20 rounded-2xl px-5 py-4 shadow-2xl z-10">
        <h5 className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-3">
          Recent expenses
        </h5>
        {EXPENSES.map((e, i) => {
          const Icon = e.icon;
          return (
            <div
              key={i}
              className="flex items-center justify-between py-2 border-b border-white/5 last:border-b-0"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${e.bg}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{e.title}</p>
                  <p className="text-[11px] text-slate-400">{e.by}</p>
                </div>
              </div>
              <span className="font-space text-sm font-bold text-white">
                {e.amt}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function HomePage() {
  // Simple scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      const nav = document.getElementById("main-nav");
      if (nav) {
        if (window.scrollY > 20) {
          nav.classList.add("bg-[#0B1120]/90", "backdrop-blur-md", "shadow-sm", "border-white/10");
          nav.classList.remove("bg-transparent", "border-transparent");
        } else {
          nav.classList.remove("bg-[#0B1120]/90", "backdrop-blur-md", "shadow-sm", "border-white/10");
          nav.classList.add("bg-transparent", "border-transparent");
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0B1120] text-white overflow-x-hidden font-sans selection:bg-violet-500/30">
      
      {/* ── 1. NAVBAR ── */}
      <nav 
        id="main-nav" 
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-[6%] h-[75px] bg-transparent border-b border-transparent transition-all duration-300"
      >
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Logo" className="w-8 h-8 drop-shadow-[0_0_8px_rgba(124,58,237,0.4)]" />
          <span className="font-space text-[22px] font-bold text-white">
            Pay<span className="text-violet-400">Mint</span> Verse
          </span>
        </div>

        <ul className="hidden lg:flex gap-8">
          {["Features", "How It Works", "About"].map((link) => (
            <li key={link}>
              <a
                href="#"
                className="text-[15px] font-medium text-slate-300 hover:text-white transition-colors"
              >
                {link}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          <Link href="/auth/login" className="text-[15px] font-medium text-slate-300 hover:text-white transition-colors hidden sm:block px-2">
            Login
          </Link>
          <Link href="/auth/signup" className="px-5 py-2.5 text-[15px] font-semibold text-white bg-violet-700 rounded-xl hover:bg-violet-600 transition-colors shadow-[0_0_15px_rgba(124,58,237,0.2)]">
            Get Started
          </Link>
        </div>
      </nav>

      {/* ── 2. HERO SECTION ── */}
      <section className="pt-24 pb-20 px-[6%] grid grid-cols-1 lg:grid-cols-2 items-center gap-16 min-h-[90vh]">
        <div className="max-w-[600px] relative z-10">
          <h1 className="font-space text-[clamp(44px,5.5vw,72px)] font-bold leading-[1.1] tracking-tight mb-6">
            Split{" "}
            <RotatingText
              texts={["bills.", "trips.", "dinners.", "rent.", "chai."]}
              mainClassName="inline-flex px-4 py-1 bg-violet-700/30 text-violet-300 overflow-hidden rounded-2xl"
              splitLevelClassName="overflow-hidden pb-1"
              staggerFrom="last"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-120%" }}
              staggerDuration={0.025}
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              rotationInterval={3000}
            />
            <br />
            <span className="text-violet-400">Not friendships.</span>
          </h1>
          
          <p className="text-[18px] text-slate-400 leading-[1.7] mb-10 max-w-[480px]">
            PayMint Verse tracks group expenses, calculates who owes whom, and settles debts — so your trips stay drama-free.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Link href="/auth/signup" className="px-8 py-4 text-[16px] font-semibold bg-violet-700 text-white rounded-xl hover:bg-violet-600 hover:-translate-y-px transition-all duration-200 shadow-[0_8px_24px_rgba(124,58,237,0.3)] inline-block text-center">
              Create Group
            </Link>
            <button className="px-8 py-4 text-[16px] font-medium text-white border border-violet-900/40 rounded-xl hover:border-violet-400 bg-white/5 transition-colors">
              View Demo
            </button>
          </div>
        </div>

        {/* Right — live card */}
        <div className="hidden lg:flex items-center justify-center relative z-10">
          <DebtCard />
        </div>
      </section>

      {/* ── 3. PROBLEM SECTION ── */}
      <section className="px-[6%] py-28 bg-[#151f30]/40 border-y border-white/5">
        <div className="text-center max-w-[700px] mx-auto mb-16">
          <h2 className="font-space text-[clamp(32px,4vw,48px)] font-bold tracking-tight text-white mb-6">
            Group expenses get messy fast.
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1200px] mx-auto">
          {/* Card 1 */}
          <div className="bg-[#151f30] border border-violet-900/20 rounded-3xl p-10 flex flex-col items-center text-center hover:border-violet-700/30 transition-colors">
            <div className="w-16 h-16 rounded-2xl bg-violet-900/30 border border-violet-700/40 flex items-center justify-center text-violet-400 mb-8">
              <Receipt className="w-8 h-8" />
            </div>
            <h3 className="font-space text-xl font-bold text-white mb-4">Who paid for dinner?</h3>
            <p className="text-slate-400 text-[15px] leading-[1.7]">Nobody remembers after a few days.</p>
          </div>
          
          {/* Card 2 */}
          <div className="bg-[#151f30] border border-violet-900/20 rounded-3xl p-10 flex flex-col items-center text-center hover:border-violet-700/30 transition-colors">
            <div className="w-16 h-16 rounded-2xl bg-violet-900/30 border border-violet-700/40 flex items-center justify-center text-violet-400 mb-8">
              <Calculator className="w-8 h-8" />
            </div>
            <h3 className="font-space text-xl font-bold text-white mb-4">Who owes whom?</h3>
            <p className="text-slate-400 text-[15px] leading-[1.7]">Manual calculations lead to mistakes.</p>
          </div>
          
          {/* Card 3 */}
          <div className="bg-[#151f30] border border-violet-900/20 rounded-3xl p-10 flex flex-col items-center text-center hover:border-violet-700/30 transition-colors">
            <div className="w-16 h-16 rounded-2xl bg-violet-900/30 border border-violet-700/40 flex items-center justify-center text-violet-400 mb-8">
              <Clock className="w-8 h-8" />
            </div>
            <h3 className="font-space text-xl font-bold text-white mb-4">Where's the money?</h3>
            <p className="text-slate-400 text-[15px] leading-[1.7]">Settlements get forgotten and delayed.</p>
          </div>
        </div>
      </section>

      {/* ── 4. HOW IT WORKS ── */}
      <section className="px-[6%] py-32 relative">
        <h2 className="font-space text-[clamp(32px,4vw,48px)] font-bold tracking-tight text-white mb-20 text-center">
          How It Works
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative max-w-[1200px] mx-auto">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-[28px] left-[15%] right-[15%] h-px bg-violet-900/50" />
          
          {/* Step 1 */}
          <div className="relative text-center group">
            <div className="w-14 h-14 rounded-full bg-[#0B1120] border-2 border-violet-600/50 text-violet-400 text-lg font-bold flex items-center justify-center mx-auto mb-6 relative z-10 font-space group-hover:bg-violet-900/20 transition-colors">1</div>
            <h3 className="font-space text-xl font-bold text-white mb-6">Create Group</h3>
            <div className="bg-[#151f30] border border-violet-900/20 rounded-2xl p-5 inline-block text-left w-full max-w-[200px] mx-auto text-sm shadow-lg">
              <div className="flex items-center gap-3 mb-3 text-slate-300 font-medium"><div className="w-2 h-2 rounded-full bg-violet-500" /> Hostel Room</div>
              <div className="flex items-center gap-3 mb-3 text-slate-300 font-medium"><div className="w-2 h-2 rounded-full bg-cyan-500" /> Karachi Trip</div>
              <div className="flex items-center gap-3 text-slate-300 font-medium"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Friends Circle</div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative text-center group">
            <div className="w-14 h-14 rounded-full bg-[#0B1120] border-2 border-violet-600/50 text-violet-400 text-lg font-bold flex items-center justify-center mx-auto mb-6 relative z-10 font-space group-hover:bg-violet-900/20 transition-colors">2</div>
            <h3 className="font-space text-xl font-bold text-white mb-6">Add Expenses</h3>
            <div className="bg-[#151f30] border border-violet-900/20 rounded-2xl p-5 inline-block text-left w-full max-w-[200px] mx-auto text-sm shadow-lg">
              <div className="flex items-center gap-3 mb-3 text-slate-300 font-medium"><Utensils className="w-4 h-4 text-orange-400" /> Dinner</div>
              <div className="flex items-center gap-3 mb-3 text-slate-300 font-medium"><Fuel className="w-4 h-4 text-cyan-400" /> Fuel</div>
              <div className="flex items-center gap-3 text-slate-300 font-medium"><Building className="w-4 h-4 text-violet-400" /> Hotel</div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative text-center group">
            <div className="w-14 h-14 rounded-full bg-[#0B1120] border-2 border-violet-600/50 text-violet-400 text-lg font-bold flex items-center justify-center mx-auto mb-6 relative z-10 font-space group-hover:bg-violet-900/20 transition-colors">3</div>
            <h3 className="font-space text-xl font-bold text-white mb-6">Split Automatically</h3>
            <div className="bg-[#151f30] border border-violet-900/20 rounded-2xl p-5 inline-flex items-center justify-center w-full max-w-[200px] mx-auto h-[132px] text-center shadow-lg">
              <p className="text-[15px] font-medium text-slate-300 leading-[1.6]">Equal split<br/>calculations</p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="relative text-center group">
            <div className="w-14 h-14 rounded-full bg-[#0B1120] border-2 border-violet-600/50 text-violet-400 text-lg font-bold flex items-center justify-center mx-auto mb-6 relative z-10 font-space group-hover:bg-violet-900/20 transition-colors">4</div>
            <h3 className="font-space text-xl font-bold text-white mb-6">Settle Balances</h3>
            <div className="bg-[#151f30] border border-violet-900/20 rounded-2xl p-5 inline-flex items-center justify-center w-full max-w-[200px] mx-auto h-[132px] text-center shadow-lg">
              <p className="text-[15px] font-medium text-slate-300 leading-[1.6]">Know exactly<br/>who owes whom</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. FEATURE SHOWCASE ── */}
      <section className="py-24 bg-[#151f30]/20 border-y border-white/5 overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-[6%] space-y-32">
          
          {/* Feature 1 */}
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            <div className="flex-1 w-full relative max-w-[500px]">
              <div className="absolute inset-0 bg-violet-600/20 blur-[80px] rounded-full" />
              <div className="bg-[#0B1120] border border-violet-900/40 rounded-3xl p-6 md:p-8 relative shadow-2xl">
                <div className="flex items-center gap-4 border-b border-white/5 pb-5 mb-5">
                  <div className="w-12 h-12 bg-violet-900/40 rounded-xl flex items-center justify-center shrink-0">
                    <Utensils className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg font-space">Dinner at Salt</p>
                    <p className="text-slate-400 text-xs">Paid by Umar</p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-white font-bold font-space">PKR 4,800</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-cyan-900/40 rounded-xl flex items-center justify-center shrink-0">
                    <Fuel className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg font-space">Petrol</p>
                    <p className="text-slate-400 text-xs">Paid by Ali</p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-white font-bold font-space">PKR 2,400</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-space text-[32px] md:text-[40px] font-bold text-white mb-6">Track Every Expense</h3>
              <p className="text-slate-400 text-[17px] leading-[1.8]">
                Log shared expenses the moment they happen. Add the payer, the total amount, and attach it to a specific group. No more scrolling through weeks of group chats to find out who paid for what.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col lg:flex-row-reverse items-center gap-16 lg:gap-24">
            <div className="flex-1 w-full relative max-w-[500px]">
              <div className="absolute inset-0 bg-red-600/10 blur-[80px] rounded-full" />
              <div className="bg-[#0B1120] border border-violet-900/40 rounded-3xl p-6 md:p-8 relative shadow-2xl space-y-4">
                <div className="flex justify-between items-center bg-[#151f30] rounded-2xl p-5 border border-white/5">
                  <p className="text-slate-300 font-medium text-[15px]">Ali owes Umar</p>
                  <p className="text-red-400 font-bold font-space text-lg">PKR 1,200</p>
                </div>
                <div className="flex justify-between items-center bg-[#151f30] rounded-2xl p-5 border border-white/5">
                  <p className="text-slate-300 font-medium text-[15px]">Ahmed owes Umar</p>
                  <p className="text-red-400 font-bold font-space text-lg">PKR 1,200</p>
                </div>
                <div className="flex justify-between items-center bg-[#151f30] rounded-2xl p-5 border border-white/5">
                  <p className="text-slate-300 font-medium text-[15px]">Farhan owes Umar</p>
                  <p className="text-red-400 font-bold font-space text-lg">PKR 1,200</p>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-space text-[32px] md:text-[40px] font-bold text-white mb-6">Automatic Balance Calculation</h3>
              <p className="text-slate-400 text-[17px] leading-[1.8]">
                Our algorithm automatically calculates the most efficient way to settle debts. Every time an expense is added, individual balances are updated instantly.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            <div className="flex-1 w-full relative max-w-[500px]">
              <div className="absolute inset-0 bg-emerald-600/15 blur-[80px] rounded-full" />
              <div className="bg-[#0B1120] border border-emerald-900/30 rounded-3xl p-8 relative shadow-2xl text-center">
                <div className="w-20 h-20 rounded-full bg-emerald-900/30 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-emerald-400" />
                </div>
                <h4 className="font-space text-white font-bold text-2xl mb-2">Ali Settled Up</h4>
                <p className="text-slate-400 text-[15px] mb-8">Paid PKR 1,200 to Umar</p>
                <button className="w-full py-4 bg-emerald-500/10 text-emerald-400 font-bold rounded-2xl border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors">
                  Mark as Received
                </button>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-space text-[32px] md:text-[40px] font-bold text-white mb-6">Settlement Tracking</h3>
              <p className="text-slate-400 text-[17px] leading-[1.8]">
                Record payments when someone pays you back. Keep everyone on the same page with a clear history of who settled up and when.
              </p>
            </div>
          </div>
          
        </div>
      </section>

      {/* ── 6. INTERACTIVE DEMO PREVIEW ── */}
      <section className="px-[6%] py-32 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-[1000px] mx-auto">
          <h2 className="font-space text-[clamp(32px,4vw,48px)] font-bold tracking-tight text-white mb-16 text-center">
            Interactive Demo Preview
          </h2>

          <div className="bg-[#0B1120] border border-violet-900/40 rounded-[2rem] p-8 md:p-14 shadow-2xl relative z-10 flex flex-col md:flex-row gap-12 lg:gap-20">
            {/* Left Side: Expense Info */}
            <div className="flex-1 space-y-8">
              <div>
                <p className="text-[11px] text-violet-400 uppercase tracking-widest font-bold mb-2">Group</p>
                <h3 className="text-3xl font-space font-bold text-white">Karachi Trip</h3>
              </div>
              
              <div className="bg-[#151f30] rounded-3xl p-7 border border-white/5">
                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-6">Expense Details</p>
                <div className="flex items-center gap-5 mb-6">
                  <div className="w-14 h-14 bg-orange-900/20 border border-orange-700/30 rounded-2xl flex items-center justify-center shrink-0">
                    <Utensils className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <p className="font-space text-white font-bold text-xl mb-1">Pizza</p>
                    <p className="text-slate-400 text-[13px]">Paid by <span className="text-white font-medium">Umar</span></p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="font-space text-white font-bold text-2xl">PKR 4000</p>
                  </div>
                </div>
                <div className="pt-5 border-t border-white/5 flex justify-between items-center text-[15px]">
                  <span className="text-slate-400">Split among 4 members</span>
                  <span className="text-white font-medium bg-white/5 px-3 py-1.5 rounded-lg">Each owes PKR 1000</span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="w-px bg-white/10 hidden md:block" />

            {/* Right Side: Balances */}
            <div className="flex-1 flex flex-col justify-center">
              <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-6">Live Balances</p>
              <div className="space-y-4">
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-red-900/40 flex items-center justify-center text-red-400 font-bold font-space">A</div>
                    <span className="text-slate-300 font-medium">Ali &rarr; Umar</span>
                  </div>
                  <span className="text-red-400 font-bold font-space text-lg">1000</span>
                </div>
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-red-900/40 flex items-center justify-center text-red-400 font-bold font-space">Ah</div>
                    <span className="text-slate-300 font-medium">Ahmed &rarr; Umar</span>
                  </div>
                  <span className="text-red-400 font-bold font-space text-lg">1000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. USE CASES ── */}
      <section className="px-[6%] py-32 bg-[#151f30]/40 border-y border-white/5">
        <h2 className="font-space text-[clamp(32px,4vw,48px)] font-bold tracking-tight text-white mb-20 text-center">
          Built for every shared expense.
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-[1200px] mx-auto">
          {/* Students */}
          <div className="bg-[#151f30] border border-violet-900/20 rounded-3xl p-8 hover:border-violet-500/30 transition-colors">
            <div className="w-12 h-12 bg-violet-900/30 rounded-xl flex items-center justify-center mb-6">
              <GraduationCap className="w-6 h-6 text-violet-400" />
            </div>
            <h3 className="font-space text-xl font-bold text-white mb-6">Students</h3>
            <ul className="space-y-4 text-slate-400 text-[15px]">
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-violet-400 rounded-full shrink-0" /> Hostel expenses</li>
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-violet-400 rounded-full shrink-0" /> University trips</li>
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-violet-400 rounded-full shrink-0" /> Group projects</li>
            </ul>
          </div>
          {/* Friends */}
          <div className="bg-[#151f30] border border-violet-900/20 rounded-3xl p-8 hover:border-violet-500/30 transition-colors">
            <div className="w-12 h-12 bg-violet-900/30 rounded-xl flex items-center justify-center mb-6">
              <Users className="w-6 h-6 text-violet-400" />
            </div>
            <h3 className="font-space text-xl font-bold text-white mb-6">Friends</h3>
            <ul className="space-y-4 text-slate-400 text-[15px]">
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-violet-400 rounded-full shrink-0" /> Road trips</li>
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-violet-400 rounded-full shrink-0" /> Dinners</li>
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-violet-400 rounded-full shrink-0" /> Events</li>
            </ul>
          </div>
          {/* Families */}
          <div className="bg-[#151f30] border border-violet-900/20 rounded-3xl p-8 hover:border-violet-500/30 transition-colors">
            <div className="w-12 h-12 bg-violet-900/30 rounded-xl flex items-center justify-center mb-6">
              <Home className="w-6 h-6 text-violet-400" />
            </div>
            <h3 className="font-space text-xl font-bold text-white mb-6">Families</h3>
            <ul className="space-y-4 text-slate-400 text-[15px]">
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-violet-400 rounded-full shrink-0" /> Utilities</li>
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-violet-400 rounded-full shrink-0" /> Household expenses</li>
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-violet-400 rounded-full shrink-0" /> Shared purchases</li>
            </ul>
          </div>
          {/* Teams */}
          <div className="bg-[#151f30] border border-violet-900/20 rounded-3xl p-8 hover:border-violet-500/30 transition-colors">
            <div className="w-12 h-12 bg-violet-900/30 rounded-xl flex items-center justify-center mb-6">
              <Briefcase className="w-6 h-6 text-violet-400" />
            </div>
            <h3 className="font-space text-xl font-bold text-white mb-6">Teams</h3>
            <ul className="space-y-4 text-slate-400 text-[15px]">
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-violet-400 rounded-full shrink-0" /> Subscriptions</li>
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-violet-400 rounded-full shrink-0" /> Office outings</li>
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-violet-400 rounded-full shrink-0" /> Shared budgets</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── 8. WHY PAYMINT VERSE (Philosophy) ── */}
      <section className="px-[6%] py-32 text-center max-w-[800px] mx-auto">
        <h2 className="font-space text-[clamp(32px,4vw,48px)] font-bold tracking-tight text-white mb-8">
          Designed to keep friendships intact.
        </h2>
        <p className="text-[18px] md:text-[20px] text-slate-400 leading-[1.8]">
          Money shouldn't create confusion between people.<br className="hidden md:block"/>
          PayMint Verse helps groups stay transparent,<br className="hidden md:block"/>
          organized, and fair.
        </p>
      </section>

      {/* ── DEVELOPMENT JOURNEY ── */}
      <section className="px-[6%] py-24 border-t border-white/5 bg-[#0B1120]">
        <div className="max-w-[900px] mx-auto bg-gradient-to-br from-[#151f30] to-[#0B1120] border border-violet-900/40 rounded-[2.5rem] p-10 md:p-16 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/10 blur-[100px] rounded-full pointer-events-none" />
          <p className="text-[12px] font-bold uppercase tracking-widest text-violet-400 mb-4">
            Development Journey
          </p>
          <h2 className="font-space text-3xl md:text-4xl font-bold text-white mb-8">
            Why I Built PayMint Verse
          </h2>
          <p className="text-slate-300 leading-[1.9] text-[16px] md:text-[18px] max-w-[700px]">
            As a CS student, I noticed that splitting expenses during trips and university activities was always confusing. PayMint Verse started as a project to solve that problem while helping me learn system design and full-stack development.
          </p>
        </div>
      </section>

      {/* ── 9. CALL TO ACTION ── */}
      <section className="px-[6%] py-32 bg-[#080c14] border-t border-white/5 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-violet-900/5 pointer-events-none" />
        <div className="relative z-10 max-w-[700px] mx-auto">
          <h2 className="font-space text-[clamp(36px,4.5vw,56px)] font-bold tracking-tight text-white mb-12">
            Ready to stop arguing over expenses?
          </h2>
          <div className="flex flex-wrap gap-5 justify-center">
            <Link href="/auth/signup" className="px-10 py-5 text-[16px] font-bold bg-violet-700 text-white rounded-2xl hover:bg-violet-600 hover:-translate-y-1 transition-all duration-300 shadow-[0_10px_30px_rgba(124,58,237,0.3)] inline-block text-center">
              Create Your First Group
            </Link>
            <button className="px-10 py-5 text-[16px] font-semibold text-white border border-white/10 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors">
              Explore Demo
            </button>
          </div>
        </div>
      </section>

      {/* ── 10. FOOTER ── */}
      <footer className="px-[6%] py-20 bg-[#0B1120] border-t border-white/10 relative z-10">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 mb-20">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img src="/logo.png" alt="Logo" className="w-7 h-7" />
              <span className="font-space text-2xl font-bold text-white">
                Pay<span className="text-violet-400">Mint</span> Verse
              </span>
            </div>
            <p className="text-slate-400 text-[15px] max-w-[320px] leading-[1.8]">
              A modern platform to track shared expenses, calculate balances, and settle debts efficiently.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Product</h4>
            <ul className="space-y-4 text-[15px] text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Groups</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Expenses</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Settlements</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Resources</h4>
            <ul className="space-y-4 text-[15px] text-slate-400 mb-10">
              <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">GitHub</a></li>
            </ul>
            
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Social</h4>
            <ul className="space-y-4 text-[15px] text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
              <li><a href="#" className="hover:text-white transition-colors">GitHub</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[14px] text-slate-500">
          <p>© 2026 PayMint Verse</p>
          <p>Built by Muhammad Umar</p>
        </div>
      </footer>
      
    </div>
  );
}
