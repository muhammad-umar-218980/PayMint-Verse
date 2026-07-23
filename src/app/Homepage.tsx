'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Wallet,
  Users,
  PieChart as PieChartIcon,
  History,
  ShieldCheck,
  Percent,
  Split,
  BadgeCheck,
  Smartphone,
  Landmark,
  Lock,
  KeyRound,
  ServerCog,
  ChevronRight,
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

/* ------------------------------------------------------------------ */
/*  Shared brand tokens                                                */
/* ------------------------------------------------------------------ */
// Primary Emerald   #059669
// Secondary Emerald #10B981
// Accent Mint       #34D399
// Light Mint        #6EE7B7
// Dark Slate        #0F172A
// White             #FFFFFF
// Light Background  #F8FAFC

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ------------------------------------------------------------------ */
/*  NAV                                                                */
/* ------------------------------------------------------------------ */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-8 h-16">
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src="/green_logo.png"
            alt="PayMint Verse"
            width={32}
            height={32}
            className="rounded-lg"
          />
          <span className="font-semibold text-[#0F172A] text-[17px] tracking-tight">
            PayMint <span className="text-[#059669]">Verse</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-[14.5px] font-medium text-slate-600">
          <a href="#product" className="hover:text-[#0F172A] transition-colors">
            Product
          </a>
          <a href="#how-it-works" className="hover:text-[#0F172A] transition-colors">
            How it works
          </a>
          <a href="#security" className="hover:text-[#0F172A] transition-colors">
            Security
          </a>
          <a href="#pricing" className="hover:text-[#0F172A] transition-colors">
            Pricing
          </a>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden sm:inline-flex text-[14.5px] font-medium text-slate-600 hover:text-[#0F172A] transition-colors px-3 py-2 cursor-pointer"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center gap-1.5 bg-[#059669] hover:bg-[#047857] text-white text-[14.5px] font-semibold px-4 py-2.5 rounded-lg transition-all hover:shadow-lg hover:shadow-emerald-900/10 cursor-pointer"
          >
            Get started
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/*  HERO                                                               */
/* ------------------------------------------------------------------ */
function Hero() {
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setSettled(true), 1400);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative pt-40 pb-28 px-6 lg:px-8 overflow-hidden">
      {/* ambient backdrop */}
      <div
        aria-hidden
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full opacity-[0.07] blur-3xl pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, #10B981 0%, #34D399 45%, transparent 70%)',
        }}
      />

      <div className="max-w-7xl mx-auto relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Copy */}
          <div>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="inline-flex items-center gap-2 bg-[#ECFDF5] border border-[#A7F3D0] text-[#047857] text-[13px] font-semibold px-3 py-1.5 rounded-full mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />
              Trusted by 10,000+ groups worldwide
            </motion.div>

            <motion.h1
              variants={fadeUp}
              custom={1}
              initial="hidden"
              animate="show"
              className="text-[44px] sm:text-[56px] leading-[1.05] font-bold tracking-tight text-[#0F172A]"
            >
              Split expenses.
              <br />
              Settle debts.
              <br />
              <span className="text-[#059669]">Stay friends.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              custom={2}
              initial="hidden"
              animate="show"
              className="mt-6 text-[18px] leading-relaxed text-slate-600 max-w-md"
            >
              PayMint Verse automates who owes whom — trips, rent,
              dinners, or team budgets — with transparent, real-time
              balances and one-tap settlements.
            </motion.p>

            <motion.div
              variants={fadeUp}
              custom={3}
              initial="hidden"
              animate="show"
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 bg-[#059669] hover:bg-[#047857] text-white font-semibold text-[15px] px-6 py-3.5 rounded-xl transition-all hover:shadow-xl hover:shadow-emerald-900/15 hover:-translate-y-0.5 cursor-pointer"
              >
                Create your first group
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-1.5 text-[#0F172A] font-semibold text-[15px] px-2 py-3.5 cursor-pointer group"
              >
                See how it works
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            </motion.div>
          </div>

          {/* Hero visual: live balance / debt-simplification card */}
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative bg-white border border-slate-200/80 rounded-2xl shadow-[0_20px_60px_-15px_rgba(15,23,42,0.15)] p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-[12.5px] font-medium text-slate-400">
                    Northern Trip
                  </p>
                  <p className="text-[15px] font-semibold text-[#0F172A]">
                    Group balance
                  </p>
                </div>
                <div className="flex -space-x-2">
                  {['A', 'U', 'H'].map((letter, i) => (
                    <div
                      key={letter}
                      className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[12px] font-semibold text-white"
                      style={{
                        background: ['#059669', '#10B981', '#34D399'][i],
                      }}
                    >
                      {letter}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#F8FAFC] rounded-xl p-4 mb-5">
                <p className="text-[12.5px] text-slate-400 mb-1">
                  Total tracked
                </p>
                <p className="text-[28px] font-bold text-[#0F172A] tracking-tight">
                  Rs 84,200
                </p>
              </div>

              {/* debt simplification visual */}
              <div className="space-y-2.5">
                <p className="text-[12.5px] font-semibold text-slate-400 uppercase tracking-wide">
                  Settling up
                </p>

                <motion.div
                  animate={{ opacity: settled ? 0.35 : 1, height: settled ? 0 : 'auto' }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center gap-2 text-[13.5px] text-slate-400 overflow-hidden"
                >
                  <span className="font-medium">Ali</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span className="font-medium">Ahmed</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span className="font-medium">Umar</span>
                  <span className="ml-auto line-through">Rs 12,000</span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: settled ? 1 : 0 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                  className="flex items-center gap-2 bg-[#ECFDF5] border border-[#A7F3D0] rounded-lg px-3 py-2.5"
                >
                  <span className="font-semibold text-[13.5px] text-[#0F172A]">
                    Ali
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#059669]" />
                  <span className="font-semibold text-[13.5px] text-[#0F172A]">
                    Umar
                  </span>
                  <span className="ml-auto text-[13.5px] font-bold text-[#059669]">
                    Rs 12,000
                  </span>
                </motion.div>
              </div>

              <p className="mt-4 text-[12px] text-slate-400 flex items-center gap-1.5">
                <BadgeCheck className="w-3.5 h-3.5 text-[#059669]" />
                Simplified automatically — 1 payment instead of 2
              </p>
            </div>

            {/* floating folded-corner accent, echoes logo mark */}
            <div
              aria-hidden
              className="absolute -bottom-5 -left-5 w-16 h-16 rounded-2xl -z-10 opacity-90"
              style={{
                background: 'linear-gradient(135deg,#059669,#34D399)',
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  TRUST STRIP                                                        */
/* ------------------------------------------------------------------ */
function TrustStrip() {
  const stats = [
    { value: '10,000+', label: 'Active groups' },
    { value: 'Rs 2M+', label: 'Settled transparently' },
    { value: '4', label: 'Split methods' },
    { value: '99.9%', label: 'Uptime' },
  ];

  return (
    <section className="border-y border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            variants={fadeUp}
            custom={i}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            className="text-center md:text-left"
          >
            <p className="text-[26px] font-bold text-[#0F172A] tracking-tight">
              {s.value}
            </p>
            <p className="text-[13.5px] text-slate-500 mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  PROBLEM -> SOLUTION                                                */
/* ------------------------------------------------------------------ */
function ProblemSolution() {
  return (
    <section className="py-24 px-6 lg:px-8 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="max-w-2xl mb-14"
        >
          <p className="text-[13.5px] font-semibold text-[#059669] uppercase tracking-wide mb-3">
            The problem
          </p>
          <h2 className="text-[34px] sm:text-[40px] font-bold text-[#0F172A] tracking-tight leading-tight">
            Shared money is messy. It shouldn&apos;t be.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="bg-white rounded-2xl border border-slate-200 p-8"
          >
            <p className="text-[13px] font-semibold text-slate-400 uppercase tracking-wide mb-4">
              Before
            </p>
            <ul className="space-y-3 text-[15px] text-slate-500">
              <li>Screenshots and sticky notes for who paid what</li>
              <li>Payment chains nobody can untangle</li>
              <li>Awkward reminders to settle up</li>
              <li>No record once the cash changes hands</li>
            </ul>
          </motion.div>

          <motion.div
            variants={fadeUp}
            custom={1}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="bg-[#0F172A] rounded-2xl p-8 relative overflow-hidden"
          >
            <div
              aria-hidden
              className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-20 blur-2xl"
              style={{ background: '#34D399' }}
            />
            <p className="text-[13px] font-semibold text-[#6EE7B7] uppercase tracking-wide mb-4 relative">
              With PayMint Verse
            </p>
            <ul className="space-y-3 text-[15px] text-slate-200 relative">
              <li>Every expense logged the moment it happens</li>
              <li>Debts simplified into the fewest payments</li>
              <li>Balances update in real time, for everyone</li>
              <li>A transparent timeline, permanently</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  FEATURE BENTO GRID                                                 */
/* ------------------------------------------------------------------ */
const balanceData = [
  { m: 'Mon', v: 12 },
  { m: 'Tue', v: 18 },
  { m: 'Wed', v: 14 },
  { m: 'Thu', v: 26 },
  { m: 'Fri', v: 21 },
  { m: 'Sat', v: 34 },
  { m: 'Sun', v: 29 },
];

function FeaturesBento() {
  return (
    <section id="product" className="py-24 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="max-w-2xl mb-14"
        >
          <p className="text-[13.5px] font-semibold text-[#059669] uppercase tracking-wide mb-3">
            Everything in one place
          </p>
          <h2 className="text-[34px] sm:text-[40px] font-bold text-[#0F172A] tracking-tight leading-tight">
            Built for how groups actually spend money
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-6 gap-5">
          {/* Smart tracking - large */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="md:col-span-4 bg-white border border-slate-200 rounded-2xl p-7 hover:shadow-lg hover:shadow-slate-200/60 transition-shadow"
          >
            <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] flex items-center justify-center mb-4">
              <Wallet className="w-5 h-5 text-[#059669]" />
            </div>
            <h3 className="text-[19px] font-semibold text-[#0F172A] mb-2">
              Smart expense tracking
            </h3>
            <p className="text-[14.5px] text-slate-500 mb-5 max-w-sm">
              Log title, amount, category, and who paid — in seconds.
              Four ways to split, every time the math checks out.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Equal', 'Custom amount', 'Percentage', 'Shares'].map((t) => (
                <span
                  key={t}
                  className="text-[12.5px] font-medium bg-[#F8FAFC] border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg flex items-center gap-1.5"
                >
                  <Split className="w-3 h-3 text-[#10B981]" />
                  {t}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Balances - large with chart */}
          <motion.div
            variants={fadeUp}
            custom={1}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="md:col-span-2 bg-white border border-slate-200 rounded-2xl p-7 hover:shadow-lg hover:shadow-slate-200/60 transition-shadow"
          >
            <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] flex items-center justify-center mb-4">
              <PieChartIcon className="w-5 h-5 text-[#059669]" />
            </div>
            <h3 className="text-[17px] font-semibold text-[#0F172A] mb-1">
              Real-time balances
            </h3>
            <p className="text-[13.5px] text-slate-500 mb-3">
              Know instantly who owes whom.
            </p>
            <div className="h-16 -mx-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={balanceData}>
                  <Line
                    type="monotone"
                    dataKey="v"
                    stroke="#059669"
                    strokeWidth={2.5}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Debt simplification - medium */}
          <motion.div
            variants={fadeUp}
            custom={2}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="md:col-span-3 bg-white border border-slate-200 rounded-2xl p-7 hover:shadow-lg hover:shadow-slate-200/60 transition-shadow"
          >
            <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] flex items-center justify-center mb-4">
              <ArrowRight className="w-5 h-5 text-[#059669]" />
            </div>
            <h3 className="text-[17px] font-semibold text-[#0F172A] mb-2">
              Debt simplification
            </h3>
            <p className="text-[14.5px] text-slate-500">
              Ali → Ahmed → Umar becomes Ali → Umar. Fewer transfers,
              same result, less awkwardness.
            </p>
          </motion.div>

          {/* Settlement methods - medium */}
          <motion.div
            variants={fadeUp}
            custom={3}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="md:col-span-3 bg-white border border-slate-200 rounded-2xl p-7 hover:shadow-lg hover:shadow-slate-200/60 transition-shadow"
          >
            <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] flex items-center justify-center mb-4">
              <Landmark className="w-5 h-5 text-[#059669]" />
            </div>
            <h3 className="text-[17px] font-semibold text-[#0F172A] mb-2">
              Settle your way
            </h3>
            <p className="text-[14.5px] text-slate-500 mb-4">
              Cash, bank transfer, EasyPaisa, or JazzCash — recorded
              the moment it happens.
            </p>
            <div className="flex gap-2">
              <Smartphone className="w-4 h-4 text-slate-400" />
              <Landmark className="w-4 h-4 text-slate-400" />
              <Wallet className="w-4 h-4 text-slate-400" />
            </div>
          </motion.div>

          {/* Roles */}
          <motion.div
            variants={fadeUp}
            custom={4}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="md:col-span-2 bg-white border border-slate-200 rounded-2xl p-7 hover:shadow-lg hover:shadow-slate-200/60 transition-shadow"
          >
            <Users className="w-5 h-5 text-[#059669] mb-4" />
            <h3 className="text-[16px] font-semibold text-[#0F172A] mb-1.5">
              Group roles
            </h3>
            <p className="text-[13.5px] text-slate-500">
              Owner, Admin, Moderator, Member — invite by email.
            </p>
          </motion.div>

          {/* Timeline */}
          <motion.div
            variants={fadeUp}
            custom={5}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="md:col-span-2 bg-white border border-slate-200 rounded-2xl p-7 hover:shadow-lg hover:shadow-slate-200/60 transition-shadow"
          >
            <History className="w-5 h-5 text-[#059669] mb-4" />
            <h3 className="text-[16px] font-semibold text-[#0F172A] mb-1.5">
              Activity timeline
            </h3>
            <p className="text-[13.5px] text-slate-500">
              Every action recorded — nothing happens quietly.
            </p>
          </motion.div>

          {/* Analytics */}
          <motion.div
            variants={fadeUp}
            custom={6}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="md:col-span-2 bg-white border border-slate-200 rounded-2xl p-7 hover:shadow-lg hover:shadow-slate-200/60 transition-shadow"
          >
            <Percent className="w-5 h-5 text-[#059669] mb-4" />
            <h3 className="text-[16px] font-semibold text-[#0F172A] mb-1.5">
              Insights &amp; export
            </h3>
            <p className="text-[13.5px] text-slate-500">
              Spending by category, monthly trends, CSV export.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  HOW IT WORKS                                                       */
/* ------------------------------------------------------------------ */
function HowItWorks() {
  const steps = [
    {
      title: 'Create a group',
      desc: 'Northern Trip, Apartment Expenses, Office Team — invite members by email in seconds.',
    },
    {
      title: 'Add an expense',
      desc: 'Title, amount, category, who paid. Split it equally, by percentage, shares, or a custom amount.',
    },
    {
      title: 'Balances update instantly',
      desc: 'Everyone sees exactly who owes what — simplified automatically into the fewest payments.',
    },
    {
      title: 'Settle up',
      desc: 'Cash, bank transfer, EasyPaisa, or JazzCash. One tap, and the balance clears for everyone.',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 px-6 lg:px-8 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="max-w-2xl mb-16"
        >
          <p className="text-[13.5px] font-semibold text-[#059669] uppercase tracking-wide mb-3">
            How it works
          </p>
          <h2 className="text-[34px] sm:text-[40px] font-bold text-[#0F172A] tracking-tight leading-tight">
            From first expense to fully settled
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-8 relative">
          <div className="hidden md:block absolute top-6 left-[12.5%] right-[12.5%] h-px bg-slate-200" />
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              variants={fadeUp}
              custom={i}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="relative"
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-[15px] mb-5 relative z-10"
                style={{ background: 'linear-gradient(135deg,#059669,#34D399)' }}
              >
                {i + 1}
              </div>
              <h3 className="text-[16.5px] font-semibold text-[#0F172A] mb-2">
                {step.title}
              </h3>
              <p className="text-[14px] text-slate-500 leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  ANALYTICS SHOWCASE (dark contrast slab)                            */
/* ------------------------------------------------------------------ */
const categoryData = [
  { name: 'Food', v: 32 },
  { name: 'Transport', v: 18 },
  { name: 'Stay', v: 24 },
  { name: 'Fun', v: 14 },
  { name: 'Other', v: 9 },
];

function AnalyticsShowcase() {
  return (
    <section className="py-24 px-6 lg:px-8 bg-[#0F172A] relative overflow-hidden">
      <div
        aria-hidden
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-[0.12] blur-3xl"
        style={{ background: 'radial-gradient(circle,#34D399,transparent 70%)' }}
      />
      <div className="max-w-7xl mx-auto relative grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <p className="text-[13.5px] font-semibold text-[#6EE7B7] uppercase tracking-wide mb-3">
            Analytics
          </p>
          <h2 className="text-[34px] sm:text-[40px] font-bold text-white tracking-tight leading-tight mb-5">
            See where the money actually goes
          </h2>
          <p className="text-[16px] text-slate-300 leading-relaxed max-w-md">
            Spending by category, monthly trends, and a full export to
            CSV whenever you need the raw numbers. No spreadsheets
            required.
          </p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          custom={1}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
        >
          <p className="text-[12.5px] font-medium text-slate-400 mb-1">
            Northern Trip · This month
          </p>
          <p className="text-[24px] font-bold text-white mb-5">
            Spending by category
          </p>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <XAxis
                  dataKey="name"
                  stroke="#64748B"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{
                    background: '#1E293B',
                    border: '1px solid #334155',
                    borderRadius: 8,
                    fontSize: 12,
                    color: '#F8FAFC',
                  }}
                />
                <Bar dataKey="v" fill="#34D399" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  TESTIMONIALS BY AUDIENCE                                           */
/* ------------------------------------------------------------------ */
function Testimonials() {
  const quotes = [
    {
      quote:
        'We used to argue about who paid for gas. Now the app just tells us — and nobody has to be the bad guy asking for money back.',
      name: 'Hina R.',
      tag: 'Trip group · 6 people',
    },
    {
      quote:
        'Rent, utilities, groceries — three roommates, one balance. Settling up went from a monthly headache to a two-minute task.',
      name: 'Bilal K.',
      tag: 'Roommates · 3 people',
    },
    {
      quote:
        'Our team expenses used to live in three different chats. PayMint Verse gave us one transparent record everyone trusts.',
      name: 'Ayesha M.',
      tag: 'Small team · 8 people',
    },
  ];

  return (
    <section className="py-24 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="max-w-2xl mb-14"
        >
          <p className="text-[13.5px] font-semibold text-[#059669] uppercase tracking-wide mb-3">
            Built for real groups
          </p>
          <h2 className="text-[34px] sm:text-[40px] font-bold text-[#0F172A] tracking-tight leading-tight">
            Whoever you split expenses with
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {quotes.map((q, i) => (
            <motion.div
              key={q.name}
              variants={fadeUp}
              custom={i}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="bg-white border border-slate-200 rounded-2xl p-7"
            >
              <p className="text-[14.5px] text-slate-600 leading-relaxed mb-6">
                &ldquo;{q.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[13px] font-semibold"
                  style={{ background: 'linear-gradient(135deg,#059669,#34D399)' }}
                >
                  {q.name[0]}
                </div>
                <div>
                  <p className="text-[13.5px] font-semibold text-[#0F172A]">
                    {q.name}
                  </p>
                  <p className="text-[12.5px] text-slate-400">{q.tag}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  SECURITY                                                           */
/* ------------------------------------------------------------------ */
function Security() {
  const points = [
    {
      icon: Lock,
      title: 'Encrypted by default',
      desc: 'Your data is protected end-to-end, at rest and in transit.',
    },
    {
      icon: KeyRound,
      title: 'Secure sign-in',
      desc: 'Email & password or Google — with server-side session handling.',
    },
    {
      icon: ServerCog,
      title: 'Protected access',
      desc: 'Every route and record is scoped to people you actually invited.',
    },
  ];

  return (
    <section id="security" className="py-24 px-6 lg:px-8 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="max-w-2xl mb-14"
        >
          <p className="text-[13.5px] font-semibold text-[#059669] uppercase tracking-wide mb-3">
            Security
          </p>
          <h2 className="text-[34px] sm:text-[40px] font-bold text-[#0F172A] tracking-tight leading-tight">
            Your group&apos;s money, kept private
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {points.map((p, i) => (
            <motion.div
              key={p.title}
              variants={fadeUp}
              custom={i}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="flex gap-4"
            >
              <div className="w-11 h-11 shrink-0 rounded-xl bg-white border border-slate-200 flex items-center justify-center">
                <p.icon className="w-5 h-5 text-[#059669]" />
              </div>
              <div>
                <h3 className="text-[16px] font-semibold text-[#0F172A] mb-1.5">
                  {p.title}
                </h3>
                <p className="text-[14px] text-slate-500 leading-relaxed">
                  {p.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  FINAL CTA                                                          */
/* ------------------------------------------------------------------ */
function FinalCTA() {
  return (
    <section className="px-6 lg:px-8 py-6">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="max-w-7xl mx-auto rounded-3xl px-8 py-16 sm:py-20 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(120deg,#059669,#10B981)' }}
      >
        <div
          aria-hidden
          className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-white/10 blur-2xl"
        />
        <h2 className="text-[32px] sm:text-[42px] font-bold text-white tracking-tight max-w-2xl mx-auto leading-tight">
          Stop chasing people for money they already owe you.
        </h2>
        <p className="text-[16px] text-emerald-50/90 mt-4 max-w-md mx-auto">
          Create your first group free — no card required.
        </p>
        <Link
          href="/signup"
          className="inline-flex items-center gap-2 bg-white text-[#059669] font-semibold text-[15px] px-7 py-3.5 rounded-xl mt-8 hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer"
        >
          Get started for free
          <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  FOOTER                                                             */
/* ------------------------------------------------------------------ */
function Footer() {
  const columns = [
    {
      title: 'Product',
      links: ['Features', 'How it works', 'Security', 'Pricing'],
    },
    {
      title: 'Company',
      links: ['About', 'Blog', 'Careers', 'Contact'],
    },
    {
      title: 'Legal',
      links: ['Privacy policy', 'Terms of service'],
    },
  ];

  return (
    <footer className="px-6 lg:px-8 py-16 mt-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/green_logo.png"
                alt="PayMint Verse"
                width={28}
                height={28}
                className="rounded-lg"
              />
              <span className="font-semibold text-[#0F172A] text-[16px]">
                PayMint Verse
              </span>
            </div>
            <p className="text-[14px] text-slate-500 max-w-xs leading-relaxed">
              Transparent, automated expense splitting for trips,
              roommates, families, and teams.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {columns.map((col) => (
              <div key={col.title}>
                <p className="text-[13px] font-semibold text-[#0F172A] mb-3">
                  {col.title}
                </p>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-[13.5px] text-slate-500 hover:text-[#059669] transition-colors cursor-pointer"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[13px] text-slate-400">
            © {new Date().getFullYear()} PayMint Verse. All rights reserved.
          </p>
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
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */
export default function Homepage() {
  return (
    <main className="min-h-screen bg-white antialiased">
      <Navbar />
      <Hero />
      <TrustStrip />
      <ProblemSolution />
      <FeaturesBento />
      <HowItWorks />
      <AnalyticsShowcase />
      <Testimonials />
      <Security />
      <FinalCTA />
      <Footer />
    </main>
  );
}
