import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Type,
  AlignJustify,
  List,
  Monitor,
  Zap,
  EyeOff,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Sun,
  Clock,
} from "lucide-react";
import Container from "../../../components/Container";

/* ─────────────────────────────────────────
   Shared easing
───────────────────────────────────────── */
const ease = [0.22, 1, 0.36, 1];

/* ─────────────────────────────────────────
   Data — right-side feature bullets
───────────────────────────────────────── */
const bullets = [
  { icon: Type,          label: "Beautiful typography" },
  { icon: AlignJustify,  label: "Comfortable spacing" },
  { icon: List,          label: "Organized chapters" },
  { icon: Monitor,       label: "Online reader" },
  { icon: Zap,           label: "Fast loading" },
  { icon: EyeOff,        label: "Zero advertisements" },
];

/* ─────────────────────────────────────────
   Data — floating benefit cards
───────────────────────────────────────── */
const benefitCards = [
  {
    title: "No Ads",
    description: "Stay focused without distractions.",
    float: { y: [0, -10, 0], duration: 5.5 },
  },
  {
    title: "Comfortable Reading",
    description: "Typography designed for long study sessions.",
    float: { y: [0, 8, 0], duration: 7 },
  },
  {
    title: "Always Synced",
    description: "Continue reading from where you stopped.",
    float: { y: [0, -7, 0], duration: 6.2 },
  },
];

/* ─────────────────────────────────────────
   Reading Illustration (custom SVG)
───────────────────────────────────────── */
function ReadingIllustration() {
  return (
    <svg
      viewBox="0 0 420 460"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Illustration of a person reading comfortably on a tablet with floating book pages"
      role="img"
      className="w-full max-w-[420px]"
    >
      {/* ── Background card ── */}
      <rect x="16" y="16" width="388" height="428" rx="28" fill="#f9f9f9" stroke="#e8e8e8" strokeWidth="1.5" />

      {/* ── Desk surface ── */}
      <rect x="60" y="310" width="300" height="10" rx="5" fill="#e5e5e5" />

      {/* ── Chair back ── */}
      <rect x="170" y="250" width="80" height="70" rx="12" fill="#e8e8e8" stroke="#d4d4d4" strokeWidth="1.5" />
      {/* Chair seat ── */}
      <rect x="155" y="316" width="110" height="18" rx="8" fill="#e0e0e0" stroke="#d0d0d0" strokeWidth="1.5" />
      {/* Chair legs ── */}
      <rect x="165" y="332" width="8" height="28" rx="4" fill="#d4d4d4" />
      <rect x="247" y="332" width="8" height="28" rx="4" fill="#d4d4d4" />

      {/* ── Person body ── */}
      {/* Torso */}
      <rect x="183" y="255" width="54" height="56" rx="10" fill="#262626" />
      {/* Head */}
      <circle cx="210" cy="236" r="22" fill="#f0e6d3" stroke="#e0cdb8" strokeWidth="1" />
      {/* Hair */}
      <path d="M188 228 Q210 208 232 228 Q228 218 210 214 Q192 218 188 228Z" fill="#1a1a1a" />
      {/* Left arm */}
      <path d="M183 268 Q158 272 152 290" stroke="#f0e6d3" strokeWidth="14" strokeLinecap="round" />
      {/* Right arm — reaching toward tablet */}
      <path d="M237 268 Q264 272 272 285" stroke="#f0e6d3" strokeWidth="14" strokeLinecap="round" />

      {/* ── Tablet on desk ── */}
      <rect x="148" y="260" width="124" height="88" rx="10" fill="#1a1a1a" />
      <rect x="154" y="266" width="112" height="76" rx="7" fill="#f8f8f8" />
      {/* Tablet screen content */}
      <rect x="163" y="276" width="70" height="4" rx="2" fill="#1a1a1a" />
      <rect x="163" y="286" width="94" height="3" rx="1.5" fill="#d4d4d4" />
      <rect x="163" y="293" width="88" height="3" rx="1.5" fill="#d4d4d4" />
      <rect x="163" y="300" width="80" height="3" rx="1.5" fill="#e0e0e0" />
      <rect x="163" y="307" width="90" height="3" rx="1.5" fill="#d4d4d4" />
      {/* Progress bar on tablet */}
      <rect x="163" y="318" width="94" height="3" rx="1.5" fill="#f0f0f0" />
      <rect x="163" y="318" width="52" height="3" rx="1.5" fill="#0f1419" />
      {/* Tablet home bar */}
      <rect x="196" y="344" width="28" height="3" rx="1.5" fill="#555" />

      {/* ── Floating book pages ── */}
      {/* Page 1 — top left */}
      <g transform="rotate(-12, 96, 130)">
        <rect x="66" y="108" width="60" height="78" rx="6" fill="white" stroke="#e0e0e0" strokeWidth="1.5" />
        <rect x="74" y="120" width="36" height="3" rx="1.5" fill="#1a1a1a" />
        <rect x="74" y="128" width="44" height="2.5" rx="1.25" fill="#e0e0e0" />
        <rect x="74" y="134" width="40" height="2.5" rx="1.25" fill="#e0e0e0" />
        <rect x="74" y="140" width="44" height="2.5" rx="1.25" fill="#e8e8e8" />
        <rect x="74" y="146" width="36" height="2.5" rx="1.25" fill="#e0e0e0" />
        <rect x="74" y="152" width="42" height="2.5" rx="1.25" fill="#e8e8e8" />
      </g>

      {/* Page 2 — top right */}
      <g transform="rotate(10, 322, 120)">
        <rect x="296" y="96" width="52" height="68" rx="6" fill="white" stroke="#e0e0e0" strokeWidth="1.5" />
        <rect x="304" y="108" width="30" height="3" rx="1.5" fill="#1a1a1a" />
        <rect x="304" y="116" width="36" height="2.5" rx="1.25" fill="#e0e0e0" />
        <rect x="304" y="122" width="32" height="2.5" rx="1.25" fill="#e8e8e8" />
        <rect x="304" y="128" width="36" height="2.5" rx="1.25" fill="#e0e0e0" />
        <rect x="304" y="134" width="28" height="2.5" rx="1.25" fill="#e8e8e8" />
      </g>

      {/* ── Bookmarks floating ── */}
      <path d="M88 180h18a2 2 0 0 1 2 2v22l-11-7-11 7V182a2 2 0 0 1 2-2z" fill="#0f1419" opacity="0.7" />
      <path d="M318 195h14a2 2 0 0 1 2 2v18l-9-5.5-9 5.5V197a2 2 0 0 1 2-2z" fill="#0f1419" opacity="0.5" />

      {/* ── Reading progress arc ── */}
      <circle cx="210" cy="390" r="28" stroke="#f0f0f0" strokeWidth="6" fill="none" />
      <circle
        cx="210" cy="390" r="28"
        stroke="#0f1419"
        strokeWidth="6"
        fill="none"
        strokeDasharray="105 70"
        strokeLinecap="round"
        transform="rotate(-90 210 390)"
      />
      <text x="210" y="395" textAnchor="middle" fontSize="11" fontWeight="600" fill="#0f1419" fontFamily="system-ui">
        62%
      </text>

      {/* ── Decorative dots ── */}
      <circle cx="52" cy="60" r="5" fill="#e8e8e8" />
      <circle cx="368" cy="380" r="4" fill="#e8e8e8" />
      <circle cx="380" cy="72" r="3" fill="#e0e0e0" />
      <circle cx="46" cy="360" r="3" fill="#e8e8e8" />
    </svg>
  );
}

/* ─────────────────────────────────────────
   Bullet item
───────────────────────────────────────── */
function BulletItem({ icon: Icon, label, index, inView }) {
  return (
    <motion.li
      initial={{ opacity: 0, x: 20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.55, delay: 0.1 + index * 0.08, ease }}
      className="group flex cursor-default items-center gap-4"
    >
      {/* Black circle icon */}
      <span className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-neutral-950 text-white shadow-[0_2px_6px_rgba(0,0,0,0.15)] transition-transform duration-200 group-hover:scale-110">
        <Icon size={15} strokeWidth={2} aria-hidden="true" />
      </span>
      <span className="text-[15px] font-medium text-neutral-700 transition-colors duration-200 group-hover:text-neutral-950">
        {label}
      </span>
    </motion.li>
  );
}

/* ─────────────────────────────────────────
   Reader Mockup
───────────────────────────────────────── */
function ReaderMockup({ inView }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.2, ease }}
      className="relative mx-auto w-full max-w-3xl"
      aria-label="BookStore reader interface preview"
    >
      {/* Outer shell — browser-chrome style */}
      <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-[0_24px_60px_rgba(0,0,0,0.09)]">

        {/* ── Window chrome bar ── */}
        <div className="flex items-center justify-between border-b border-neutral-100 bg-neutral-50 px-5 py-3.5">
          {/* Traffic lights */}
          <div className="flex items-center gap-2" aria-hidden="true">
            <span className="h-3 w-3 rounded-full bg-neutral-300" />
            <span className="h-3 w-3 rounded-full bg-neutral-300" />
            <span className="h-3 w-3 rounded-full bg-neutral-300" />
          </div>
          {/* Fake URL bar */}
          <div className="flex h-7 w-56 items-center justify-center rounded-full bg-neutral-100 px-4">
            <span className="text-[11px] font-medium text-neutral-400">bookstore.app/reader</span>
          </div>
          {/* Right side controls */}
          <div className="flex items-center gap-3" aria-hidden="true">
            <Sun size={14} className="text-neutral-400" />
            <span className="text-[11px] font-medium text-neutral-400">Aa</span>
          </div>
        </div>

        {/* ── Reader toolbar ── */}
        <div className="flex items-center justify-between border-b border-neutral-100 bg-white px-8 py-4">
          {/* Nav: prev chapter */}
          <button
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium text-neutral-500 transition hover:bg-neutral-50 hover:text-neutral-900"
            aria-label="Previous chapter"
          >
            <ChevronLeft size={15} strokeWidth={2} aria-hidden="true" />
            Prev
          </button>

          {/* Center: book + chapter info */}
          <div className="flex flex-col items-center gap-0.5">
            <p className="text-[13px] font-semibold text-neutral-900">Clean Code</p>
            <p className="text-[11.5px] text-neutral-400">Chapter 3 — Functions</p>
          </div>

          {/* Nav: next chapter */}
          <button
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium text-neutral-500 transition hover:bg-neutral-50 hover:text-neutral-900"
            aria-label="Next chapter"
          >
            Next
            <ChevronRight size={15} strokeWidth={2} aria-hidden="true" />
          </button>
        </div>

        {/* ── Reading content ── */}
        <div className="px-12 py-10 sm:px-20">

          {/* Font-size controls + bookmark + reading time */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-1.5" aria-label="Font size controls">
              <button
                className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition hover:border-neutral-400 hover:text-neutral-900"
                aria-label="Decrease font size"
              >
                <Minus size={11} strokeWidth={2.5} />
              </button>
              <span className="px-1 text-[12px] font-semibold text-neutral-400">Aa</span>
              <button
                className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition hover:border-neutral-400 hover:text-neutral-900"
                aria-label="Increase font size"
              >
                <Plus size={11} strokeWidth={2.5} />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-[12px] text-neutral-400">
                <Clock size={12} aria-hidden="true" />
                14 min left
              </span>
              <button
                className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition hover:border-neutral-400 hover:text-neutral-900"
                aria-label="Bookmark this page"
              >
                <Bookmark size={12} strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-8" role="progressbar" aria-valuenow={38} aria-valuemin={0} aria-valuemax={100} aria-label="Reading progress: 38%">
            <div className="mb-2 flex justify-between text-[11px] text-neutral-400">
              <span>Chapter progress</span>
              <span>38%</span>
            </div>
            <div className="h-1 w-full overflow-hidden rounded-full bg-neutral-100">
              <div className="h-full w-[38%] rounded-full bg-neutral-950" />
            </div>
          </div>

          {/* Chapter heading */}
          <h3 className="mb-6 text-[clamp(1.1rem,2vw,1.4rem)] font-bold leading-snug tracking-tight text-neutral-950">
            Chapter 3: Functions
          </h3>

          {/* Body paragraphs */}
          <div className="space-y-5 text-[15px] leading-[1.85] text-neutral-600">
            <p>
              Functions are the first line of organization in any program. Writing them well is one of the
              most important skills a developer can develop. Small, focused functions that do one thing
              are vastly easier to read, test, and maintain than large, multi-purpose ones.
            </p>
            <p>
              The ideal function is short, has a descriptive name, and does exactly one thing at one level
              of abstraction. When a function mixes high-level policy with low-level detail it becomes
              harder to understand and harder to change. Keeping the levels of abstraction consistent
              within a function makes it far easier to read.
            </p>
            <p className="text-neutral-400">
              Functions should have no side effects. A side effect is a lie — your function promises to do
              one thing but also does hidden things. Avoid output arguments, prefer exceptions over error
              codes, and never repeat yourself...
            </p>
          </div>

          {/* Page number */}
          <div className="mt-10 flex items-center justify-center">
            <span className="text-[12px] font-medium text-neutral-300">Page 47 of 124</span>
          </div>
        </div>
      </div>

      {/* ── Floating benefit cards ── */}
      {/* Card 1 — top-left */}
      <motion.div
        animate={{ y: benefitCards[0].float.y }}
        transition={{ duration: benefitCards[0].float.duration, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-4 top-20 hidden w-48 rounded-2xl border border-neutral-200 bg-white p-4 shadow-[0_8px_24px_rgba(0,0,0,0.08)] sm:-left-16 lg:block"
        aria-hidden="true"
      >
        <p className="mb-1 text-[13px] font-semibold text-neutral-900">{benefitCards[0].title}</p>
        <p className="text-[12px] leading-relaxed text-neutral-400">{benefitCards[0].description}</p>
      </motion.div>

      {/* Card 2 — bottom-left */}
      <motion.div
        animate={{ y: benefitCards[1].float.y }}
        transition={{ duration: benefitCards[1].float.duration, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-6 -left-4 hidden w-52 rounded-2xl border border-neutral-200 bg-white p-4 shadow-[0_8px_24px_rgba(0,0,0,0.08)] sm:-left-16 lg:block"
        aria-hidden="true"
      >
        <p className="mb-1 text-[13px] font-semibold text-neutral-900">{benefitCards[1].title}</p>
        <p className="text-[12px] leading-relaxed text-neutral-400">{benefitCards[1].description}</p>
      </motion.div>

      {/* Card 3 — top-right */}
      <motion.div
        animate={{ y: benefitCards[2].float.y }}
        transition={{ duration: benefitCards[2].float.duration, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-4 top-16 hidden w-48 rounded-2xl border border-neutral-200 bg-white p-4 shadow-[0_8px_24px_rgba(0,0,0,0.08)] sm:-right-16 lg:block"
        aria-hidden="true"
      >
        <p className="mb-1 text-[13px] font-semibold text-neutral-900">{benefitCards[2].title}</p>
        <p className="text-[12px] leading-relaxed text-neutral-400">{benefitCards[2].description}</p>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   ReadingExperience Section
───────────────────────────────────────── */
function ReadingExperience() {
  const ref     = useRef(null);
  const inView  = useInView(ref, { once: true, margin: "-80px" });

  const mockRef    = useRef(null);
  const mockInView = useInView(mockRef, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-neutral-50/60 py-28 lg:py-32"
      aria-labelledby="reading-heading"
    >
      {/* Dot-grid */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.04]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="re-dot-grid" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.5" fill="#0f1419" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#re-dot-grid)" />
      </svg>

      {/* Edge hairlines */}
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />

      <Container>

        {/* ══════════════════════════════════════
            ZONE 1 — Two-column intro
        ══════════════════════════════════════ */}
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-24">

          {/* Left — illustration */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.85, ease }}
            className="flex justify-center lg:justify-start"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              {/* Ambient glow */}
              <div
                aria-hidden="true"
                className="absolute inset-6 rounded-3xl bg-neutral-200/50 blur-2xl"
              />
              <div className="relative">
                <ReadingIllustration />
              </div>
            </motion.div>
          </motion.div>

          {/* Right — text + bullets */}
          <div className="flex flex-col">

            {/* Eyebrow */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.05, ease }}
              className="mb-4 text-[11.5px] font-semibold uppercase tracking-[0.18em] text-neutral-400"
            >
              Reading Experience
            </motion.p>

            {/* Heading */}
            <motion.h2
              id="reading-heading"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.12, ease }}
              className="mb-6 text-[clamp(1.75rem,3.5vw,2.6rem)] font-bold leading-[1.1] tracking-[-0.025em] text-neutral-950"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              A reading experience
              <br />designed for focus.
            </motion.h2>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.22, ease }}
              className="mb-10 max-w-[500px] space-y-4 text-[15.5px] leading-[1.8] text-neutral-500"
            >
              <p>
                Learning shouldn&apos;t feel exhausting. Many online documents are
                difficult to read because of cluttered layouts, poor typography,
                advertisements and distracting interfaces.
              </p>
              <p>
                BookStore is designed differently. Our reader provides clean
                typography, comfortable spacing, organized documents,
                distraction-free reading and a beautiful interface that keeps
                learners engaged for longer.
              </p>
              <p className="text-[14px] font-medium text-neutral-400">
                Because a better reading environment helps people learn better.
              </p>
            </motion.div>

            {/* Feature bullets */}
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2" role="list">
              {bullets.map((bullet, i) => (
                <BulletItem
                  key={bullet.label}
                  icon={bullet.icon}
                  label={bullet.label}
                  index={i}
                  inView={inView}
                />
              ))}
            </ul>
          </div>
        </div>

        {/* ══════════════════════════════════════
            ZONE 2 — Reader mockup
        ══════════════════════════════════════ */}
        <div
          ref={mockRef}
          className="mt-28 lg:mt-36"
        >
          {/* Zone heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={mockInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, ease }}
            className="mb-14 text-center"
          >
            <p className="mb-3 text-[11.5px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
              The Reader
            </p>
            <h3 className="text-[clamp(1.4rem,2.5vw,2rem)] font-bold tracking-[-0.02em] text-neutral-950">
              Built for the way you actually read
            </h3>
          </motion.div>

          {/* Mockup + floating cards — extra horizontal room for the cards */}
          <div className="px-0 lg:px-20">
            <ReaderMockup inView={mockInView} />
          </div>
        </div>

      </Container>
    </section>
  );
}

export default ReadingExperience;
