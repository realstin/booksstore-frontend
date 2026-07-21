import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

/* ─────────────────────────────────────────
   Shared easing
───────────────────────────────────────── */
const ease = [0.22, 1, 0.36, 1];

/* ─────────────────────────────────────────
   Floating particles — pure SVG dots,
   each one independently animated
───────────────────────────────────────── */
const particles = [
  { cx: "8%",  cy: "22%", r: 1.5, dur: 7,   delay: 0   },
  { cx: "18%", cy: "68%", r: 1,   dur: 9,   delay: 1.4 },
  { cx: "28%", cy: "40%", r: 2,   dur: 11,  delay: 0.7 },
  { cx: "42%", cy: "15%", r: 1,   dur: 8,   delay: 2.1 },
  { cx: "55%", cy: "78%", r: 1.5, dur: 10,  delay: 0.3 },
  { cx: "65%", cy: "32%", r: 1,   dur: 6.5, delay: 1.8 },
  { cx: "75%", cy: "58%", r: 2,   dur: 9.5, delay: 0.9 },
  { cx: "85%", cy: "20%", r: 1,   dur: 7.5, delay: 2.5 },
  { cx: "92%", cy: "72%", r: 1.5, dur: 11,  delay: 1.1 },
  { cx: "50%", cy: "50%", r: 1,   dur: 13,  delay: 3.2 },
];

function Particles() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -16, 0], opacity: [0.25, 0.55, 0.25] }}
          transition={{
            duration: p.dur,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ left: p.cx, top: p.cy }}
          className="absolute"
        >
          <div
            className="rounded-full bg-white"
            style={{
              width:  p.r * 2,
              height: p.r * 2,
              opacity: 0.3,
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   CTA Section
───────────────────────────────────────── */
function CTA() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-32 lg:py-40"
      style={{ backgroundColor: "#0A0A0A" }}
      aria-labelledby="cta-heading"
    >
      {/* ── Subtle radial glows ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 70% 50% at 20% 50%, rgba(255,255,255,0.03) 0%, transparent 70%),
            radial-gradient(ellipse 50% 60% at 80% 40%, rgba(255,255,255,0.025) 0%, transparent 70%)
          `,
        }}
      />

      {/* ── Floating particles ── */}
      <Particles />

      {/* ── Dot-grid overlay ── */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.04]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="cta-dot-grid"
            x="0" y="0"
            width="28" height="28"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1.5" cy="1.5" r="1.5" fill="white" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#cta-dot-grid)" />
      </svg>

      {/* ── Content ── */}
      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 text-center sm:px-8">

        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          className="mb-6 text-[11.5px] font-semibold uppercase tracking-[0.22em] text-neutral-500"
        >
          Start Your Journey
        </motion.p>

        {/* Heading */}
        <motion.h2
          id="cta-heading"
          initial={{ opacity: 0, y: 22 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, delay: 0.1, ease }}
          className="mb-7 text-[clamp(2.2rem,5vw,3.5rem)] font-bold leading-[1.06] tracking-[-0.03em] text-white"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          Start discovering books
          <br className="hidden sm:block" /> you can trust.
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2, ease }}
          className="mb-12 max-w-xl text-[1.0625rem] leading-[1.8] text-neutral-400"
        >
          Join BookStore and build your personal technology library with carefully
          selected books, distraction-free reading, downloads, favorites, and your
          own saved collection.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.3, ease }}
          className="flex flex-col items-center gap-3 sm:flex-row"
        >
          {/* Primary — white on dark */}
          <Link to="/signup">
            <motion.button
              whileHover={{ scale: 1.03, backgroundColor: "#f5f5f5" }}
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.22 }}
              className="group inline-flex h-14 items-center gap-2.5 rounded-full bg-white px-10 text-[15px] font-semibold tracking-tight text-neutral-950 shadow-[0_0_0_1px_rgba(255,255,255,0.12)] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
            >
              Create Free Account
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </motion.button>
          </Link>

          {/* Secondary — ghost on dark */}
          <Link to="/login">
            <motion.button
              whileHover={{ scale: 1.03, borderColor: "rgba(255,255,255,0.4)" }}
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.22 }}
              className="inline-flex h-14 items-center rounded-full border border-white/20 px-10 text-[15px] font-semibold tracking-tight text-neutral-300 transition-colors duration-300 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
            >
              Log In
            </motion.button>
          </Link>
        </motion.div>

      </div>
    </section>
  );
}

export default CTA;
