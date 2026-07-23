import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import {
  BookOpen, Search, Bookmark, Download,
  Monitor, ArrowRight, CheckCircle2, Target,
  Lightbulb, Layers,
} from "lucide-react";
import Container from "../components/Container";
import Button from "../components/Button";
import Navbar from "../components/Homepage/Navbar";
import Footer from "../components/Homepage/Footer";

/* ─────────────────────────────────────────
   Shared animation helpers
───────────────────────────────────────── */
const ease = [0.22, 1, 0.36, 1];

const fadeUp = (delay = 0, duration = 0.68) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration, delay, ease },
});

const inViewFadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.65, delay, ease },
});

/* ─────────────────────────────────────────
   Dot-grid background (reused from homepage)
───────────────────────────────────────── */
function DotGrid({ id }) {
  return (
    <svg aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.035]"
      xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id={id} x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="1.5" fill="#0f1419" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/* ─────────────────────────────────────────
   Section hairlines
───────────────────────────────────────── */
function Hairlines() {
  return (
    <>
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />
    </>
  );
}

/* ─────────────────────────────────────────
   1. HERO
───────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative overflow-hidden bg-white" aria-labelledby="about-heading">
      <DotGrid id="about-hero-grid" />

      {/* Floating ambient circles */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[7%] top-[22%] h-3 w-3 rounded-full border border-neutral-300" />
        <motion.div animate={{ y: [0, 9, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          className="absolute left-[16%] bottom-[20%] h-2 w-2 rounded-full bg-neutral-200" />
        <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 0.9 }}
          className="absolute right-[7%] top-[28%] h-4 w-4 rounded-full border border-neutral-200" />
        <motion.div animate={{ y: [0, 7, 0] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute right-[20%] bottom-[18%] h-2 w-2 rounded-full bg-neutral-300" />
      </div>

      <Container>
        <div className="grid grid-cols-1 items-center gap-16 py-24 lg:grid-cols-2 lg:gap-20 lg:py-32">

          {/* Left — text */}
          <div className="flex flex-col">
            <motion.span {...fadeUp(0.04, 0.55)}
              className="mb-6 inline-flex self-start items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-[13px] font-medium text-neutral-600 shadow-sm">
              <BookOpen size={13} strokeWidth={2} aria-hidden="true" />
              About BookStore
            </motion.span>

            <motion.h1 id="about-heading" {...fadeUp(0.12, 0.75)}
              className="mb-6 text-[clamp(2.4rem,5vw,3.6rem)] font-bold leading-[1.08] tracking-[-0.025em] text-neutral-950"
              style={{ fontFamily: "var(--font-sans)" }}>
              Building a trusted place<br className="hidden sm:block" /> for better learning.
            </motion.h1>

            <motion.p {...fadeUp(0.22, 0.7)}
              className="mb-10 max-w-[480px] text-[1.0625rem] leading-[1.8] text-neutral-500">
              BookStore is a platform built to help people discover trusted, up-to-date
              technology books in one organized place — giving learners a simpler path to
              resources that are actually worth their time.
            </motion.p>

            <motion.div {...fadeUp(0.32, 0.68)}
              className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link to="/homepage#explore">
                <Button size="lg" variant="primary" className="group w-full gap-2 sm:w-auto">
                  Explore Books
                  <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">Get Started</Button>
              </Link>
            </motion.div>

            <motion.p {...fadeUp(0.44, 0.62)}
              className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px] text-neutral-400">
              <span className="flex items-center gap-1.5"><span aria-hidden="true">✓</span>No advertisements</span>
              <span aria-hidden="true" className="text-neutral-300">·</span>
              <span>Read online</span>
              <span aria-hidden="true" className="text-neutral-300">·</span>
              <span>Download offline</span>
            </motion.p>
          </div>

          {/* Right — SVG illustration */}
          <motion.div
            initial={{ opacity: 0, x: 36 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.85, delay: 0.2, ease }}
            className="flex items-center justify-center">
            <HeroIllustration />
          </motion.div>

        </div>
      </Container>
    </section>
  );
}

/* ─────────────────────────────────────────
   Hero SVG illustration
───────────────────────────────────────── */
function HeroIllustration() {
  return (
    <div className="relative w-full max-w-[420px]">
      <div aria-hidden="true" className="absolute inset-6 rounded-3xl bg-neutral-100/60 blur-3xl" />
      <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative">
        <svg viewBox="0 0 420 440" fill="none" xmlns="http://www.w3.org/2000/svg"
          aria-label="Illustration of an organized digital bookstore with books and reading tools" role="img"
          className="w-full">
          <rect x="16" y="16" width="388" height="408" rx="24" fill="#f9f9f9" stroke="#e5e5e5" strokeWidth="1.5" />
          {/* Search bar */}
          <rect x="40" y="44" width="240" height="40" rx="10" fill="white" stroke="#e5e5e5" strokeWidth="1.5" />
          <circle cx="67" cy="64" r="8" stroke="#b0b0b0" strokeWidth="1.5" />
          <line x1="73" y1="70" x2="79" y2="76" stroke="#b0b0b0" strokeWidth="1.5" strokeLinecap="round" />
          <rect x="90" y="60" width="100" height="3" rx="1.5" fill="#d4d4d4" />
          <rect x="90" y="67" width="68" height="2.5" rx="1.25" fill="#e5e5e5" />
          {/* Bookmark button */}
          <rect x="294" y="44" width="40" height="40" rx="10" fill="white" stroke="#e5e5e5" strokeWidth="1.5" />
          <path d="M306 54h16a2 2 0 0 1 2 2v16l-8-5-8 5V56a2 2 0 0 1 2-2z" fill="#0f1419" />
          {/* Verified badge */}
          <rect x="344" y="44" width="60" height="40" rx="10" fill="#0f1419" />
          <path d="M356 64l4 4 8-8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="370" y="60" width="26" height="3" rx="1.5" fill="white" opacity="0.7" />
          <rect x="370" y="66" width="18" height="2.5" rx="1.25" fill="white" opacity="0.4" />
          {/* Shelf */}
          <rect x="40" y="196" width="340" height="4" rx="2" fill="#e0e0e0" />
          {/* Books */}
          <rect x="52"  y="116" width="40" height="80" rx="5" fill="#0f1419" />
          <rect x="52"  y="116" width="8"  height="80" rx="3" fill="#1e2a36" />
          <rect x="67"  y="132" width="18" height="2.5" rx="1.25" fill="#ffffff22" />
          <rect x="100" y="124" width="36" height="72" rx="5" fill="#3f3f3f" />
          <rect x="100" y="124" width="7"  height="72" rx="3" fill="#4a4a4a" />
          <rect x="144" y="118" width="38" height="78" rx="5" fill="#c8c8c8" />
          <rect x="144" y="118" width="7"  height="78" rx="3" fill="#b8b8b8" />
          <rect x="190" y="122" width="40" height="74" rx="5" fill="#262626" />
          <rect x="190" y="122" width="8"  height="74" rx="3" fill="#333" />
          <rect x="238" y="130" width="34" height="66" rx="5" fill="#555" />
          <rect x="238" y="130" width="7"  height="66" rx="3" fill="#606060" />
          <rect x="280" y="116" width="40" height="80" rx="5" fill="#171717" />
          <rect x="280" y="116" width="8"  height="80" rx="3" fill="#222" />
          <rect x="328" y="124" width="36" height="72" rx="5" fill="#e0e0e0" />
          <rect x="328" y="124" width="7"  height="72" rx="3" fill="#d0d0d0" />
          {/* Open book / reading card */}
          <rect x="40" y="220" width="340" height="158" rx="14" fill="white" stroke="#e5e5e5" strokeWidth="1.5" />
          <line x1="210" y1="232" x2="210" y2="366" stroke="#e8e8e8" strokeWidth="1.5" />
          <rect x="58"  y="248" width="110" height="3" rx="1.5" fill="#e5e5e5" />
          <rect x="58"  y="257" width="96"  height="2.5" rx="1.25" fill="#e5e5e5" />
          <rect x="58"  y="265" width="104" height="2.5" rx="1.25" fill="#e5e5e5" />
          <rect x="58"  y="273" width="88"  height="2.5" rx="1.25" fill="#e5e5e5" />
          <rect x="224" y="248" width="110" height="3" rx="1.5" fill="#0f1419" />
          <rect x="224" y="257" width="96"  height="2.5" rx="1.25" fill="#0f1419" />
          <rect x="224" y="265" width="104" height="2.5" rx="1.25" fill="#d4d4d4" />
          <rect x="224" y="273" width="80"  height="2.5" rx="1.25" fill="#d4d4d4" />
          {/* Progress */}
          <rect x="58"  y="348" width="304" height="5" rx="2.5" fill="#f0f0f0" />
          <rect x="58"  y="348" width="160" height="5" rx="2.5" fill="#0f1419" />
          {/* Decorative */}
          <circle cx="392" cy="36" r="9" fill="#f0f0f0" stroke="#e5e5e5" strokeWidth="1" />
          <circle cx="30"  cy="400" r="6" fill="#f0f0f0" stroke="#e5e5e5" strokeWidth="1" />
        </svg>
        <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-3 -right-3 h-3 w-3 rounded-full bg-neutral-300" aria-hidden="true" />
        <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-2 -left-3 h-2.5 w-2.5 rounded-full border border-neutral-300" aria-hidden="true" />
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────
   2. WHY WE CAME
───────────────────────────────────────── */
function WhyWeCame() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const steps = [
    { icon: Search,        label: "Search",   delay: 0.1 },
    { icon: BookOpen,      label: "Discover", delay: 0.22 },
    { icon: CheckCircle2,  label: "Trust",    delay: 0.34 },
    { icon: Lightbulb,     label: "Learn",    delay: 0.46 },
  ];

  return (
    <section ref={ref} className="relative overflow-hidden bg-neutral-50/60 py-24 lg:py-32"
      aria-labelledby="why-heading">
      <Hairlines />
      <DotGrid id="why-grid" />
      <Container>
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-24">

          {/* Left — text */}
          <div>
            <motion.p {...inViewFadeUp(0)}
              className="mb-4 text-[11.5px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
              Why We Came
            </motion.p>
            <motion.h2 id="why-heading" {...inViewFadeUp(0.08)}
              className="mb-6 text-[clamp(1.75rem,3.5vw,2.6rem)] font-bold leading-[1.1] tracking-[-0.025em] text-neutral-950"
              style={{ fontFamily: "var(--font-sans)" }}>
              The right book should be easy to find.
            </motion.h2>
            <motion.div {...inViewFadeUp(0.16)} className="space-y-4 text-[1.0625rem] leading-[1.78] text-neutral-500">
              <p>
                There are countless books available online. But finding the right one — relevant,
                reliable, current, and worth your time — is rarely straightforward.
              </p>
              <p>
                BookStore was created to change that. We bring trusted technology books into
                one organized platform, so learners can spend less time searching and more
                time building real skills.
              </p>
            </motion.div>
          </div>

          {/* Right — step flow */}
          <div className="flex flex-col items-center gap-0">
            {steps.map((step, i) => (
              <div key={step.label} className="flex flex-col items-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: step.delay, ease }}
                  className="flex h-16 w-16 items-center justify-center rounded-2xl border border-neutral-200 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
                  <step.icon size={24} strokeWidth={1.6} className="text-neutral-700" aria-hidden="true" />
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.4, delay: step.delay + 0.1, ease }}
                  className="mt-2 text-[12px] font-semibold uppercase tracking-[0.1em] text-neutral-500">
                  {step.label}
                </motion.p>
                {i < steps.length - 1 && (
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={inView ? { scaleY: 1 } : {}}
                    transition={{ duration: 0.4, delay: step.delay + 0.15, ease }}
                    style={{ originY: 0 }}
                    className="my-2 h-8 w-px bg-gradient-to-b from-neutral-300 to-neutral-200"
                    aria-hidden="true" />
                )}
              </div>
            ))}
          </div>

        </div>
      </Container>
    </section>
  );
}

/* ─────────────────────────────────────────
   3. WHAT WE DO — feature cards
───────────────────────────────────────── */
const features = [
  {
    icon: Search,
    title: "Discover Better Books",
    desc: "Find trusted, up-to-date technology books organized in one clean platform — no more scattered searches.",
  },
  {
    icon: Bookmark,
    title: "Build Your Personal Library",
    desc: "Save the books you value and return to them anytime through your own organized personal library.",
  },
  {
    icon: Monitor,
    title: "Read Without Distractions",
    desc: "A focused online reader designed for comfort — clean typography, no ads, just the content that matters.",
  },
  {
    icon: Download,
    title: "Learn Anywhere",
    desc: "Download books for offline access and keep learning wherever you are, even without an internet connection.",
  },
];

function WhatWeDo() {
  return (
    <section className="relative overflow-hidden bg-white py-24 lg:py-32" aria-labelledby="what-heading">
      <DotGrid id="what-grid" />
      <Hairlines />
      <Container>
        <motion.div {...inViewFadeUp(0)} className="mb-14 text-center">
          <p className="mb-4 text-[11.5px] font-semibold uppercase tracking-[0.18em] text-neutral-400">What We Do</p>
          <h2 id="what-heading"
            className="text-[clamp(1.75rem,3.5vw,2.6rem)] font-bold tracking-[-0.025em] text-neutral-950"
            style={{ fontFamily: "var(--font-sans)" }}>
            One platform. Everything you need to learn.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.article
              key={f.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.62, delay: i * 0.09, ease }}
              whileHover={{ y: -5, transition: { duration: 0.24, ease: "easeOut" } }}
              className="group flex cursor-default flex-col gap-5 rounded-2xl border border-neutral-200 bg-white p-7 shadow-[0_1px_4px_rgba(0,0,0,0.04)] transition-shadow duration-300 hover:border-neutral-300 hover:shadow-[0_10px_32px_rgba(0,0,0,0.07)]">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-neutral-100 bg-neutral-50 text-neutral-700 transition-all duration-300 group-hover:border-neutral-200 group-hover:bg-neutral-100">
                <f.icon size={19} strokeWidth={1.75} aria-hidden="true" />
              </span>
              <div className="flex flex-col gap-2">
                <h3 className="text-[15px] font-semibold leading-snug tracking-tight text-neutral-900">{f.title}</h3>
                <p className="text-[13.5px] leading-[1.75] text-neutral-400">{f.desc}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ─────────────────────────────────────────
   4. OUR APPROACH
───────────────────────────────────────── */
const pillars = [
  { icon: BookOpen,     label: "Quality books"       },
  { icon: Target,       label: "Focused experience"  },
  { icon: Bookmark,     label: "Personal library"    },
  { icon: CheckCircle2, label: "Verified resources"  },
];

function OurApproach() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-70px" });

  return (
    <section ref={ref} className="relative overflow-hidden bg-neutral-50/60 py-24 lg:py-32"
      aria-labelledby="approach-heading">
      <Hairlines />
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <motion.p {...inViewFadeUp(0)}
            className="mb-4 text-[11.5px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
            Our Approach
          </motion.p>
          <motion.h2 id="approach-heading" {...inViewFadeUp(0.08)}
            className="mb-6 text-[clamp(1.75rem,3.5vw,2.6rem)] font-bold leading-[1.1] tracking-[-0.025em] text-neutral-950"
            style={{ fontFamily: "var(--font-sans)" }}>
            Learning deserves a better environment.
          </motion.h2>
          <motion.p {...inViewFadeUp(0.16)}
            className="mb-14 text-[1.0625rem] leading-[1.78] text-neutral-500">
            The environment around learning matters. A clean interface, fewer distractions,
            organized resources, and easy access to books worth reading — these details
            help people stay focused on what matters most.
          </motion.p>

          {/* Pillar icons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            {pillars.map((p, i) => (
              <motion.div
                key={p.label}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1, ease }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="flex cursor-default items-center gap-2.5 rounded-full border border-neutral-200 bg-white px-5 py-2.5 shadow-[0_1px_6px_rgba(0,0,0,0.05)] transition-shadow duration-200 hover:shadow-[0_4px_14px_rgba(0,0,0,0.08)]">
                <p.icon size={15} strokeWidth={1.75} className="text-neutral-700" aria-hidden="true" />
                <span className="text-[13.5px] font-medium text-neutral-700">{p.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ─────────────────────────────────────────
   5. THE EXPERIENCE — numbered steps
───────────────────────────────────────── */
const steps = [
  { num: "01", title: "Discover",  desc: "Find books that match your learning interests from a curated, trusted collection." },
  { num: "02", title: "Save",      desc: "Keep important books in your personal library and return to them whenever you need." },
  { num: "03", title: "Read",      desc: "Enjoy a focused, distraction-free online reading experience built for learners." },
  { num: "04", title: "Download",  desc: "Take your books with you and continue learning offline, anywhere you go." },
];

function TheExperience() {
  return (
    <section className="relative overflow-hidden bg-white py-24 lg:py-32" aria-labelledby="experience-heading">
      <DotGrid id="exp-grid" />
      <Hairlines />
      <Container>
        <motion.div {...inViewFadeUp(0)} className="mb-14 text-center">
          <p className="mb-4 text-[11.5px] font-semibold uppercase tracking-[0.18em] text-neutral-400">The Experience</p>
          <h2 id="experience-heading"
            className="text-[clamp(1.75rem,3.5vw,2.6rem)] font-bold tracking-[-0.025em] text-neutral-950"
            style={{ fontFamily: "var(--font-sans)" }}>
            How BookStore works.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease }}
              className="flex flex-col gap-4 rounded-2xl border border-neutral-100 bg-neutral-50/60 p-7">
              <span className="text-[2rem] font-bold leading-none tracking-[-0.04em] text-neutral-200">
                {s.num}
              </span>
              <div className="flex flex-col gap-1.5">
                <h3 className="text-[16px] font-bold tracking-tight text-neutral-950">{s.title}</h3>
                <p className="text-[13.5px] leading-[1.75] text-neutral-500">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ─────────────────────────────────────────
   6. THE FUTURE
───────────────────────────────────────── */
function TheFuture() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-70px" });

  return (
    <section ref={ref} className="relative overflow-hidden bg-neutral-50/60 py-24 lg:py-32"
      aria-labelledby="future-heading">
      <Hairlines />
      <Container>
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-20">

          {/* Left */}
          <div>
            <motion.p {...inViewFadeUp(0)}
              className="mb-4 text-[11.5px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
              Where We&apos;re Going
            </motion.p>
            <motion.h2 id="future-heading" {...inViewFadeUp(0.08)}
              className="mb-6 text-[clamp(1.75rem,3.5vw,2.6rem)] font-bold leading-[1.1] tracking-[-0.025em] text-neutral-950"
              style={{ fontFamily: "var(--font-sans)" }}>
              Books are only the beginning.
            </motion.h2>
            <motion.p {...inViewFadeUp(0.16)}
              className="text-[1.0625rem] leading-[1.78] text-neutral-500">
              BookStore starts with carefully chosen books and a platform built around
              focused learning. As we grow, we will keep improving how people discover,
              organize, and access knowledge — and explore how technology can help
              surface even better learning resources for every kind of learner.
            </motion.p>
          </div>

          {/* Right — minimal progression diagram */}
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-3">
              {[
                { icon: BookOpen, label: "Books"     },
                { icon: Layers,   label: "Knowledge" },
                { icon: Target,   label: "Growth"    },
              ].map((item, i) => (
                <div key={item.label} className="flex items-center gap-3">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.1 + i * 0.15, ease }}
                    className="flex flex-col items-center gap-2">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-neutral-200 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
                      <item.icon size={22} strokeWidth={1.6} className="text-neutral-700" aria-hidden="true" />
                    </div>
                    <span className="text-[11.5px] font-semibold text-neutral-500">{item.label}</span>
                  </motion.div>
                  {i < 2 && (
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={inView ? { scaleX: 1 } : {}}
                      transition={{ duration: 0.4, delay: 0.25 + i * 0.15, ease }}
                      style={{ originX: 0 }}
                      className="mb-5 h-px w-8 bg-neutral-300"
                      aria-hidden="true" />
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}

/* ─────────────────────────────────────────
   7. FINAL CTA
───────────────────────────────────────── */
function FinalCTA() {
  return (
    <section className="relative overflow-hidden py-28 lg:py-36" style={{ backgroundColor: "#0A0A0A" }}
      aria-labelledby="cta-about-heading">
      {/* Subtle radial glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,255,255,0.04) 0%, transparent 70%)" }} />

      <Container>
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <motion.p {...inViewFadeUp(0)}
            className="mb-5 text-[11.5px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
            Start Learning
          </motion.p>
          <motion.h2 id="cta-about-heading" {...inViewFadeUp(0.08)}
            className="mb-6 text-[clamp(2rem,4.5vw,3rem)] font-bold leading-[1.08] tracking-[-0.025em] text-white"
            style={{ fontFamily: "var(--font-sans)" }}>
            Find your next book.<br className="hidden sm:block" /> Keep learning.
          </motion.h2>
          <motion.p {...inViewFadeUp(0.16)}
            className="mb-10 max-w-md text-[1.0625rem] leading-[1.78] text-neutral-400">
            Discover trusted resources, build your personal library, and create a
            learning experience that works for you.
          </motion.p>
          <motion.div {...inViewFadeUp(0.24)}
            className="flex flex-col items-center gap-3 sm:flex-row">
            <Link to="/homepage#explore">
              <motion.button
                whileHover={{ scale: 1.03, backgroundColor: "#f5f5f5" }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.2 }}
                className="group inline-flex h-13 items-center gap-2 rounded-full bg-white px-9 text-[15px] font-semibold text-neutral-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950">
                Explore Books
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
              </motion.button>
            </Link>
            <Link to="/signup">
              <motion.button
                whileHover={{ scale: 1.03, borderColor: "rgba(255,255,255,0.4)" }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.2 }}
                className="inline-flex h-13 items-center rounded-full border border-white/20 px-9 text-[15px] font-semibold text-neutral-300 transition-colors duration-300 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950">
                Create Your Account
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

/* ─────────────────────────────────────────
   About page — root
───────────────────────────────────────── */
function About() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "var(--font-sans)" }}>
      <Navbar />
      {/* Push content below fixed navbar (h-20 = navbar un-scrolled height) */}
      <div className="h-20" aria-hidden="true" />
      <Hero />
      <WhyWeCame />
      <WhatWeDo />
      <OurApproach />
      <TheExperience />
      <TheFuture />
      <FinalCTA />
      <Footer />
    </div>
  );
}

export default About;
