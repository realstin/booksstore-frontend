import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Container from "../Container";
import Button from "../Button";
import bookshelfIllustration from "../../assets/bookshelf.svg";

/* ─────────────────────────────────────────
   Animation variants
───────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0 },
};

const fadeRight = {
  hidden: { opacity: 0, x: 40 },
  show:   { opacity: 1, x: 0 },
};

const transition = (delay = 0, duration = 0.7) => ({
  duration,
  delay,
  ease: [0.22, 1, 0.36, 1],
});

/* ─────────────────────────────────────────
   Background dot-grid + floating circles
───────────────────────────────────────── */
function BackgroundDecor() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg className="absolute inset-0 h-full w-full opacity-[0.035]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="dot-grid" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.5" fill="#0f1419" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dot-grid)" />
      </svg>
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
   Animated illustration wrapper
   The SVG lives in src/assets/bookshelf.svg
   and is imported as a URL — keeping this
   component file free of inline SVG markup.
───────────────────────────────────────── */
function AnimatedIllustration() {
  return (
    <div className="relative flex items-center justify-center">
      {/* Soft ambient glow behind the card */}
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
        {/* Floating decorative dots */}
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

        {/* Illustration — sourced from src/assets/bookshelf.svg */}
        <img
          src={bookshelfIllustration}
          alt="A modern digital bookshelf showing search, bookmarks, and reading progress"
          className="w-full max-w-[500px]"
          draggable="false"
        />
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Hero section
───────────────────────────────────────── */
function Hero() {
  const scrollToExplore = (event) => {
    event.preventDefault();
    document.getElementById("explore")?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", "#explore");
  };

  return (
    <section className="relative overflow-hidden bg-white" aria-labelledby="hero-heading">
      <BackgroundDecor />

      <Container>
        <div className="relative grid grid-cols-1 items-center gap-16 py-28 lg:grid-cols-2 lg:gap-20 lg:py-32 xl:py-36">

          {/* ── LEFT — text content ── */}
          <div className="flex max-w-xl flex-col lg:max-w-none">

            {/* Headline */}
            <motion.h1
              id="hero-heading"
              variants={fadeUp}
              initial="hidden"
              animate="show"
              transition={transition(0.15, 0.75)}
              className="mb-6 text-[clamp(2.8rem,5.5vw,4.2rem)] font-bold leading-[1.07] tracking-[-0.03em] text-neutral-950"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Discover books
              <br />
              <span className="text-neutral-400">you can trust.</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="show"
              transition={transition(0.28, 0.7)}
              className="mb-10 max-w-sm text-[1.0625rem] leading-[1.78] text-neutral-500"
            >
              Carefully selected technology books in one place —
              so you spend less time searching and more time learning.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              transition={transition(0.4, 0.7)}
              className="flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Link to="/signup">
                <Button size="lg" variant="primary" className="group w-full gap-2 sm:w-auto">
                  Get Started
                  <ArrowRight
                    size={17}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Button>
              </Link>
              <Link to="/#explore" onClick={scrollToExplore}>
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
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
              className="mt-8 flex items-center gap-3 text-[13px] text-neutral-400"
            >
              <span>No ads</span>
              <span className="text-neutral-200" aria-hidden="true">·</span>
              <span>Free to use</span>
              <span className="text-neutral-200" aria-hidden="true">·</span>
              <span>Save your library</span>
            </motion.p>

          </div>

          {/* ── RIGHT — illustration ── */}
          <AnimatedIllustration />

        </div>
      </Container>
    </section>
  );
}

export default Hero;
