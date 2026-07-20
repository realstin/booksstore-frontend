import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Container from "../../../components/Container";
import Button from "../../../components/Button";

/* ─────────────────────────────────────────
   Animation Variants
───────────────────────────────────────── */
const fadeDown = {
  hidden: { opacity: 0, y: -16 },
  show: { opacity: 1, y: 0 },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

const fadeRight = {
  hidden: { opacity: 0, x: 40 },
  show: { opacity: 1, x: 0 },
};

const transition = (delay = 0, duration = 0.7) => ({
  duration,
  delay,
  ease: [0.22, 1, 0.36, 1],
});

/* ─────────────────────────────────────────
   Floating Background Decoration
───────────────────────────────────────── */
function BackgroundDecor() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Subtle dot-grid pattern */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.035]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="dot-grid"
            x="0"
            y="0"
            width="28"
            height="28"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1.5" cy="1.5" r="1.5" fill="#0f1419" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dot-grid)" />
      </svg>

      {/* Floating circles */}
      <motion.div
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[8%] top-[18%] h-3 w-3 rounded-full border border-neutral-300 bg-transparent"
      />
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        className="absolute left-[18%] bottom-[22%] h-2 w-2 rounded-full bg-neutral-200"
      />
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        className="absolute right-[6%] top-[30%] h-4 w-4 rounded-full border border-neutral-200 bg-transparent"
      />
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute right-[22%] bottom-[15%] h-2 w-2 rounded-full bg-neutral-300"
      />
    </div>
  );
}

/* ─────────────────────────────────────────
   BookShelf Illustration (custom SVG)
───────────────────────────────────────── */
function BookshelfIllustration() {
  return (
    <svg
      viewBox="0 0 480 520"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Illustration of a modern digital bookshelf with books, search, and reading progress features"
      role="img"
      className="w-full max-w-125"
    >
      {/* ── Background card ── */}
      <rect x="20" y="20" width="440" height="480" rx="24" fill="#f9f9f9" stroke="#e5e5e5" strokeWidth="1.5" />

      {/* ── Shelf 1 ── */}
      <rect x="48" y="200" width="384" height="4" rx="2" fill="#e5e5e5" />

      {/* Book 1 — tall dark */}
      <rect x="60" y="112" width="44" height="88" rx="5" fill="#0f1419" />
      <rect x="60" y="112" width="8" height="88" rx="3" fill="#1a2430" />
      <rect x="75" y="130" width="20" height="2" rx="1" fill="#ffffff20" />
      <rect x="75" y="136" width="14" height="2" rx="1" fill="#ffffff15" />

      {/* Book 2 — medium gray */}
      <rect x="112" y="128" width="38" height="72" rx="5" fill="#3f3f3f" />
      <rect x="112" y="128" width="7" height="72" rx="3" fill="#4a4a4a" />
      <rect x="125" y="144" width="16" height="2" rx="1" fill="#ffffff20" />
      <rect x="125" y="150" width="10" height="2" rx="1" fill="#ffffff15" />

      {/* Book 3 — light */}
      <rect x="158" y="118" width="36" height="82" rx="5" fill="#d4d4d4" />
      <rect x="158" y="118" width="7" height="82" rx="3" fill="#c0c0c0" />
      <rect x="170" y="134" width="15" height="2" rx="1" fill="#00000020" />

      {/* Book 4 — medium dark */}
      <rect x="202" y="122" width="42" height="78" rx="5" fill="#262626" />
      <rect x="202" y="122" width="8" height="78" rx="3" fill="#333" />
      <rect x="216" y="140" width="18" height="2" rx="1" fill="#ffffff20" />
      <rect x="216" y="146" width="12" height="2" rx="1" fill="#ffffff15" />

      {/* Book 5 — light gray */}
      <rect x="252" y="132" width="34" height="68" rx="5" fill="#b0b0b0" />
      <rect x="252" y="132" width="7" height="68" rx="3" fill="#a0a0a0" />

      {/* Book 6 — near-black */}
      <rect x="294" y="115" width="40" height="85" rx="5" fill="#171717" />
      <rect x="294" y="115" width="8" height="85" rx="3" fill="#222" />
      <rect x="308" y="132" width="16" height="2" rx="1" fill="#ffffff20" />
      <rect x="308" y="138" width="12" height="2" rx="1" fill="#ffffff15" />

      {/* Book 7 — off-white */}
      <rect x="342" y="125" width="36" height="75" rx="5" fill="#e8e8e8" />
      <rect x="342" y="125" width="7" height="75" rx="3" fill="#ddd" />

      {/* Book 8 — dark */}
      <rect x="386" y="120" width="38" height="80" rx="5" fill="#404040" />
      <rect x="386" y="120" width="7" height="80" rx="3" fill="#4a4a4a" />
      <rect x="399" y="138" width="14" height="2" rx="1" fill="#ffffff20" />

      {/* ── Search bar ── */}
      <rect x="48" y="56" width="260" height="40" rx="10" fill="white" stroke="#e5e5e5" strokeWidth="1.5" />
      {/* Search icon */}
      <circle cx="77" cy="76" r="8" stroke="#a3a3a3" strokeWidth="1.5" />
      <line x1="83" y1="82" x2="89" y2="88" stroke="#a3a3a3" strokeWidth="1.5" strokeLinecap="round" />
      {/* Search placeholder lines */}
      <rect x="100" y="72" width="100" height="3" rx="1.5" fill="#d4d4d4" />
      <rect x="100" y="79" width="68" height="3" rx="1.5" fill="#e5e5e5" />

      {/* Bookmark icon button */}
      <rect x="322" y="56" width="40" height="40" rx="10" fill="white" stroke="#e5e5e5" strokeWidth="1.5" />
      <path d="M334 66h16a2 2 0 0 1 2 2v16l-8-5-8 5V68a2 2 0 0 1 2-2z" fill="#0f1419" />

      {/* Saved icon button */}
      <rect x="372" y="56" width="40" height="40" rx="10" fill="#0f1419" stroke="#0f1419" strokeWidth="1.5" />
      <path d="M384 70l4 4 8-8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

      {/* ── Open book ── */}
      <rect x="48" y="228" width="384" height="180" rx="14" fill="white" stroke="#e5e5e5" strokeWidth="1.5" />
      {/* Book spine */}
      <line x1="240" y1="240" x2="240" y2="396" stroke="#e5e5e5" strokeWidth="1.5" />
      {/* Left page lines */}
      <rect x="68" y="256" width="120" height="3" rx="1.5" fill="#e5e5e5" />
      <rect x="68" y="266" width="100" height="3" rx="1.5" fill="#e5e5e5" />
      <rect x="68" y="276" width="110" height="3" rx="1.5" fill="#e5e5e5" />
      <rect x="68" y="286" width="90" height="3" rx="1.5" fill="#e5e5e5" />
      <rect x="68" y="296" width="115" height="3" rx="1.5" fill="#e5e5e5" />
      <rect x="68" y="306" width="80" height="3" rx="1.5" fill="#e5e5e5" />
      <rect x="68" y="316" width="105" height="3" rx="1.5" fill="#e5e5e5" />
      <rect x="68" y="326" width="95" height="3" rx="1.5" fill="#e5e5e5" />
      {/* Right page lines */}
      <rect x="256" y="256" width="120" height="3" rx="1.5" fill="#e5e5e5" />
      <rect x="256" y="266" width="100" height="3" rx="1.5" fill="#0f1419" />
      <rect x="256" y="276" width="110" height="3" rx="1.5" fill="#0f1419" />
      <rect x="256" y="286" width="85" height="3" rx="1.5" fill="#0f1419" />
      <rect x="256" y="296" width="115" height="3" rx="1.5" fill="#e5e5e5" />
      <rect x="256" y="306" width="80" height="3" rx="1.5" fill="#e5e5e5" />
      <rect x="256" y="316" width="105" height="3" rx="1.5" fill="#e5e5e5" />
      <rect x="256" y="326" width="70" height="3" rx="1.5" fill="#e5e5e5" />

      {/* ── Reading progress bar ── */}
      <rect x="68" y="362" width="344" height="6" rx="3" fill="#f0f0f0" />
      <rect x="68" y="362" width="180" height="6" rx="3" fill="#0f1419" />
      {/* Progress label */}
      <rect x="68" y="376" width="40" height="3" rx="1.5" fill="#d4d4d4" />
      <rect x="340" y="376" width="36" height="3" rx="1.5" fill="#d4d4d4" />

      {/* ── Floating decorative shapes ── */}
      <circle cx="448" cy="44" r="10" fill="#f0f0f0" stroke="#e5e5e5" strokeWidth="1" />
      <circle cx="36" cy="460" r="7" fill="#f0f0f0" stroke="#e5e5e5" strokeWidth="1" />
    </svg>
  );
}

/* ─────────────────────────────────────────
   Animated Bookshelf (wraps illustration)
───────────────────────────────────────── */
function AnimatedIllustration() {
  return (
    <div className="relative flex items-center justify-center">
      {/* Soft ambient glow behind card */}
      <div
        aria-hidden="true"
        className="absolute inset-8 rounded-3xl bg-neutral-100 blur-3xl opacity-60"
      />
      <motion.div
        variants={fadeRight}
        initial="hidden"
        animate="show"
        transition={transition(0.35, 0.85)}
        className="relative w-full"
      >
        {/* Floating dots on the illustration */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-4 -right-4 h-3 w-3 rounded-full bg-neutral-300"
          aria-hidden="true"
        />
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-3 -left-4 h-2.5 w-2.5 rounded-full border border-neutral-300"
          aria-hidden="true"
        />
        <BookshelfIllustration />
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Hero
───────────────────────────────────────── */
function Hero() {
  return (
    <section
      className="relative overflow-hidden bg-white"
      aria-labelledby="hero-heading"
    >
      <BackgroundDecor />

      <Container>
        <div className="relative grid grid-cols-1 items-center gap-16 py-28 lg:grid-cols-2 lg:gap-20 lg:py-32 xl:py-36">

          {/* ── LEFT COLUMN ── */}
          <div className="flex max-w-xl flex-col lg:max-w-none">

            {/* Badge */}
            <motion.div
              variants={fadeDown}
              initial="hidden"
              animate="show"
              transition={transition(0.05, 0.6)}
              className="mb-8 inline-flex self-start"
            >
              <span className="group inline-flex cursor-default items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-sm font-medium text-neutral-700 shadow-sm transition-all duration-300 hover:border-neutral-300 hover:shadow-md">
                Verified Learning Resources
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              id="hero-heading"
              variants={fadeUp}
              initial="hidden"
              animate="show"
              transition={transition(0.15, 0.75)}
              className="mb-7 text-[clamp(2.6rem,5.5vw,4rem)] font-bold leading-[1.1] tracking-[-0.02em] text-neutral-950"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Building the Future
              <br />
              of Trusted
              <br />
              Learning
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="show"
              transition={transition(0.28, 0.7)}
              className="mb-10 max-w-110 text-[1.0625rem] leading-[1.75] text-neutral-500"
            >
              BookStore is the world&apos;s most trusted platform for discovering
              up-to-date, carefully selected technology books that help learners
              build real skills and grow their careers.
              <span className="mt-2 block text-neutral-400">
                We organize trusted books in one place — so you spend less time
                searching and more time learning.
              </span>
            </motion.p>

            {/* Buttons */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              transition={transition(0.4, 0.7)}
              className="flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Link to="/signup">
                <Button
                  size="lg"
                  variant="primary"
                  className="group w-full gap-2 sm:w-auto"
                >
                  Get Started
                  <ArrowRight
                    size={17}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Button>
              </Link>

              <Link to="/homepage#library">
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full sm:w-auto"
                >
                  Explore Library
                </Button>
              </Link>
            </motion.div>

            {/* Trust line */}
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="show"
              transition={transition(0.52, 0.65)}
              className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px] text-neutral-400"
              aria-label="Features: No advertisements, Read online, Download offline, Save your own library"
            >
              <span className="flex items-center gap-1.5">
                <span className="text-neutral-500" aria-hidden="true">✓</span>
                No advertisements
              </span>
              <span className="text-neutral-300" aria-hidden="true">·</span>
              <span>Save your own library</span>
              <span className="text-neutral-300" aria-hidden="true">·</span>
              <span>Learn and Grow</span>
            </motion.p>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <AnimatedIllustration />
        </div>
      </Container>
    </section>
  );
}

export default Hero;
