import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import {
  BookOpen, Bookmark, Monitor, ArrowRight, ArrowUpRight,
} from "lucide-react";
import Container from "../components/Container";
import Navbar from "../components/Homepage/Navbar";
import Footer from "../components/Homepage/Footer";

const ease = [0.22, 1, 0.36, 1];

/* ─────────────────────────────────────────
   Shared helpers
───────────────────────────────────────── */
function Grain() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        backgroundSize: "200px 200px",
      }}
      aria-hidden="true"
    />
  );
}

function DotGrid({ id }) {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.035]"
      xmlns="http://www.w3.org/2000/svg"
    >
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
   1. HERO — dark editorial, no illustration
───────────────────────────────────────── */
function Hero() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-neutral-950"
      aria-labelledby="about-heading"
    >
      <Grain />

      {/* Soft radial glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)" }}
        aria-hidden="true"
      />

      {/* Top edge */}
      <div
        className="absolute inset-x-0 bottom-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent)" }}
        aria-hidden="true"
      />

      <Container>
        <div className="relative py-24 lg:py-32">

          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.04, ease }}
            className="mb-5 text-[11px] font-semibold uppercase tracking-[0.26em] text-neutral-600"
          >
            About BookStore
          </motion.p>

          {/* Headline — two lines, Fraunces italic */}
          <motion.h1
            id="about-heading"
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.78, delay: 0.1, ease }}
            className="mb-8 max-w-3xl text-[clamp(2.6rem,5.5vw,4.2rem)] leading-[1.06] tracking-[-0.02em] text-white"
            style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 300 }}
          >
            Building a trusted place
            <br />
            <span className="text-neutral-500">for better learning.</span>
          </motion.h1>

          {/* One sentence — max-w-sm, understated */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.22, ease }}
            className="mb-12 max-w-md text-[1.0625rem] leading-[1.78] text-neutral-500"
          >
            One platform where learners find technology books they can actually trust —
            organised, verified, and free of distraction.
          </motion.p>

          {/* CTA row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.34, ease }}
            className="flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Link
              to="/signup"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-[14px] font-semibold text-neutral-950 transition-all duration-200 hover:bg-neutral-100 hover:scale-[1.02] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
            >
              Get Started
              <ArrowRight
                size={15}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
            <Link
              to="/#explore"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-7 py-3 text-[14px] font-semibold text-neutral-400 transition-all duration-200 hover:border-white/30 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
            >
              Explore Books
            </Link>
          </motion.div>

        </div>
      </Container>
    </section>
  );
}

/* ─────────────────────────────────────────
   2. MISSION — free layout, no card, no box
───────────────────────────────────────── */
function Mission() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-white py-24 lg:py-32"
      aria-labelledby="mission-heading"
    >
      <DotGrid id="mission-grid" />

      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-24">

          {/* Left — eyebrow + heading */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease }}
              className="mb-5 text-[11.5px] font-semibold uppercase tracking-[0.2em] text-neutral-400"
            >
              Our Mission
            </motion.p>
            <motion.h2
              id="mission-heading"
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.72, delay: 0.08, ease }}
              className="text-[clamp(1.9rem,3.5vw,2.8rem)] font-bold leading-[1.1] tracking-[-0.02em] text-neutral-950"
            >
              The right book
              <br />
              <span className="text-neutral-400">should be easy to find.</span>
            </motion.h2>
          </div>

          {/* Right — two short paragraphs */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.18, ease }}
            className="flex flex-col justify-center gap-5 text-[1.0625rem] leading-[1.8] text-neutral-500"
          >
            <p>
              There are countless books online. Finding one that is relevant,
              reliable, and worth your time is rarely simple.
            </p>
            <p>
              BookStore was built to change that — one organised, trusted platform
              so you spend less time searching and more time learning.
            </p>
          </motion.div>

        </div>
      </Container>
    </section>
  );
}

/* ─────────────────────────────────────────
   3. THREE THINGS — minimal tiles, consistent
      with Features section on homepage
───────────────────────────────────────── */
const things = [
  {
    icon:  BookOpen,
    title: "Discover trusted books",
    desc:  "Curated technology books in one place — no scattered searches, no wasted time.",
  },
  {
    icon:  Bookmark,
    title: "Build your library",
    desc:  "Save books you value and return to them anytime through your personal collection.",
  },
  {
    icon:  Monitor,
    title: "Read without distraction",
    desc:  "A clean, focused reader with no ads — just you and the content that matters.",
  },
];

function ThreeThings() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-neutral-50/60 py-24 lg:py-28"
      aria-labelledby="things-heading"
    >
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-neutral-200 to-transparent" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-neutral-200 to-transparent" />

      <Container>

        {/* Header — left-aligned, editorial */}
        <div className="mb-14">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, ease }}
            className="mb-4 text-[11.5px] font-semibold uppercase tracking-[0.2em] text-neutral-400"
          >
            What We Offer
          </motion.p>
          <motion.h2
            id="things-heading"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.68, delay: 0.08, ease }}
            className="text-[clamp(1.8rem,3.5vw,2.6rem)] font-bold leading-[1.1] tracking-[-0.02em] text-neutral-950"
          >
            Everything you need.
            <br />
            <span className="text-neutral-400">Nothing you don&apos;t.</span>
          </motion.h2>
        </div>

        {/* Three tiles */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {things.map((t, i) => (
            <motion.article
              key={t.title}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.68, delay: i * 0.12, ease }}
              whileHover={{ y: -5, transition: { duration: 0.24, ease: "easeOut" } }}
              className="group flex cursor-default flex-col gap-6 rounded-3xl border border-neutral-200 bg-white p-10 shadow-[0_1px_4px_rgba(0,0,0,0.04)] transition-shadow duration-300 hover:border-neutral-300 hover:shadow-[0_12px_36px_rgba(0,0,0,0.07)]"
              aria-label={`${t.title} — ${t.desc}`}
            >
              <motion.span
                whileHover={{ scale: 1.05, rotate: 6 }}
                transition={{ duration: 0.26, ease: "easeOut" }}
                className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-neutral-950 text-white shadow-[0_2px_8px_rgba(0,0,0,0.18)]"
                aria-hidden="true"
              >
                <t.icon size={22} strokeWidth={1.75} />
              </motion.span>
              <div className="flex flex-col gap-2">
                <h3 className="text-[16px] font-semibold tracking-tight text-neutral-900">{t.title}</h3>
                <p className="text-[14px] leading-[1.75] text-neutral-400">{t.desc}</p>
              </div>
            </motion.article>
          ))}
        </div>

      </Container>
    </section>
  );
}

/* ─────────────────────────────────────────
   4. HOW IT WORKS — four numbered steps
───────────────────────────────────────── */
const steps = [
  { num: "01", title: "Discover",  desc: "Browse a curated collection of trusted technology books." },
  { num: "02", title: "Save",      desc: "Add books to your personal library and revisit them anytime." },
  { num: "03", title: "Read",      desc: "Open any book in a clean, distraction-free online reader." },
  { num: "04", title: "Download",  desc: "Take books offline and keep learning wherever you go." },
];

function HowItWorks() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-white py-24 lg:py-28"
      aria-labelledby="how-heading"
    >
      <DotGrid id="how-grid" />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-neutral-200 to-transparent" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-neutral-200 to-transparent" />

      <Container>

        <div className="mb-14">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, ease }}
            className="mb-4 text-[11.5px] font-semibold uppercase tracking-[0.2em] text-neutral-400"
          >
            How It Works
          </motion.p>
          <motion.h2
            id="how-heading"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.68, delay: 0.08, ease }}
            className="text-[clamp(1.8rem,3.5vw,2.6rem)] font-bold leading-[1.1] tracking-[-0.02em] text-neutral-950"
          >
            Four steps.
            <br />
            <span className="text-neutral-400">That is all it takes.</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.62, delay: i * 0.1, ease }}
              className="flex flex-col gap-5 rounded-3xl border border-neutral-100 bg-neutral-50/60 p-8"
            >
              {/* Big number */}
              <span
                className="text-[3rem] font-bold leading-none tracking-[-0.04em] text-neutral-100"
                aria-hidden="true"
              >
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
   5. FINAL CTA — dark, consistent with site
───────────────────────────────────────── */
function FinalCTA() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-neutral-950 py-28 lg:py-36"
      aria-labelledby="cta-heading"
    >
      <Grain />

      {/* Radial glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, rgba(255,255,255,0.18) 0%, transparent 70%)" }}
        aria-hidden="true"
      />

      {/* Top edge */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent)" }}
        aria-hidden="true"
      />

      <Container>
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, ease }}
            className="mb-5 text-[11px] font-semibold uppercase tracking-[0.26em] text-neutral-600"
          >
            Start Learning
          </motion.p>

          <motion.h2
            id="cta-heading"
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.75, delay: 0.08, ease }}
            className="mb-6 text-[clamp(2rem,4.5vw,3.2rem)] leading-[1.07] tracking-[-0.02em] text-white"
            style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 300 }}
          >
            Find your next book.
            <br />
            <span className="text-neutral-500">Keep learning.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.68, delay: 0.18, ease }}
            className="mb-10 max-w-sm text-[1.0625rem] leading-[1.78] text-neutral-500"
          >
            Discover trusted resources, build your personal library,
            and learn at your own pace.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.28, ease }}
            className="flex flex-col items-center gap-3 sm:flex-row"
          >
            <Link
              to="/signup"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-[14.5px] font-semibold text-neutral-950 transition-all duration-200 hover:bg-neutral-100 hover:scale-[1.02] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
            >
              Create your account
              <ArrowUpRight
                size={14}
                className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </Link>
            <Link
              to="/#explore"
              className="inline-flex items-center rounded-full border border-white/15 px-8 py-3.5 text-[14.5px] font-semibold text-neutral-400 transition-all duration-200 hover:border-white/30 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
            >
              Explore Books
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
      <div className="h-20" aria-hidden="true" />
      <Hero />
      <Mission />
      <ThreeThings />
      <HowItWorks />
      <FinalCTA />
      <Footer />
    </div>
  );
}

export default About;
