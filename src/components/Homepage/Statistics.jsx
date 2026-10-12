import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { BookOpen, Users, Folder, Bookmark, Star } from "lucide-react";
import Container from "../Container";
import { STATS } from "../../constants/stats";
import { useStats } from "../../hooks/useStats";
import statsSnapshot from "../../data/stats-snapshot.json";

/* ─────────────────────────────────────────
   Stats validation + starting values

   The numbers shown come from, in this order:
     1. live data from /api/stats (once it answers)
     2. the build-time snapshot (src/data/stats-snapshot.json), written by
        scripts/fetch-stats.mjs, so the real numbers are part of the page
        itself and do not depend on the backend being awake
     3. the constants in constants/stats.js (last resort)
───────────────────────────────────────── */
const STAT_FIELDS = ["totalBooks", "totalUsers", "totalSavedBooks", "averageRating"];

function isValidStats(data) {
  return (
    data !== null &&
    typeof data === "object" &&
    STAT_FIELDS.every((field) => Number.isFinite(data[field]))
  );
}

/* The snapshot is an empty {} until the first successful prebuild. */
const BASELINE = isValidStats(statsSnapshot) ? statsSnapshot : STATS;

/* ─────────────────────────────────────────
   Animated Counter Hook

   The number starts at its REAL value, so the page content is correct even
   if the animation never runs (for example when a search engine renders the
   page without scrolling). When the section scrolls into view the count-up
   plays from 0. The cards are invisible until then, so nobody sees the
   real number jump to 0.

   If the target changes later (live data arriving and differing from the
   snapshot), the number glides from the value currently shown to the new
   one instead of replaying from 0.
───────────────────────────────────────── */
function useCounter(target, duration = 1800, started = false) {
  const [count, setCount] = useState(target);
  const shownRef = useRef(null); // value currently shown once animation has begun

  useEffect(() => {
    if (!started) return undefined;

    const from = shownRef.current ?? 0;
    let startTime = null;
    let frame;

    const step = (timestamp) => {
      if (startTime === null) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = progress === 1 ? target : from + (target - from) * eased;
      shownRef.current = value;
      setCount(Math.floor(value));
      if (progress < 1) frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, duration, started]);

  /* Before the section is in view, show the real value. */
  return started ? count : target;
}

/* ─────────────────────────────────────────
   Format large numbers (e.g. 58000 → 58,000)
───────────────────────────────────────── */
function formatNumber(n) {
  return n.toLocaleString("en-US");
}

/* ─────────────────────────────────────────
   Build the cards array from the stats to display.
   Technology Categories (42) is kept static — no backend
   value is available for it yet.
───────────────────────────────────────── */
function buildStatCards(s) {
  return [
    {
      icon:        BookOpen,
      value:       s.totalBooks,
      suffix:      "+",
      label:       "Books Available",
      description: "Carefully selected and verified books.",
    },
    {
      icon:        Users,
      value:       s.totalUsers,
      suffix:      "+",
      label:       "Active Learners",
      description: "People building their skills every day.",
    },
    {
      icon:        Folder,
      value:       42,
      suffix:      "",
      label:       "Technology Categories",
      description: "Programming, AI, Web, Mobile and more.",
    },
    {
      icon:        Bookmark,
      value:       s.totalSavedBooks,
      suffix:      "+",
      label:       "Books Saved",
      description: "Personal libraries created by our community.",
    },
    {
      icon:        Star,
      value:       s.averageRating,
      suffix:      "★",
      label:       "Average Rating",
      description: "Average rating from our community.",
      isDecimal:   true,
    },
  ];
}

/* ─────────────────────────────────────────
   StatCard
───────────────────────────────────────── */
function StatCard({ stat, index, started }) {
  const { icon: Icon, value, suffix, label, description, isDecimal } = stat;
  /* Decimal stats: animate the integer×10 value, then display ÷10 */
  const intValue = isDecimal ? Math.round(value * 10) : value;
  const rawCount = useCounter(intValue, 1600 + index * 100, started);
  const displayValue = isDecimal
    ? (rawCount / 10).toFixed(1)
    : formatNumber(rawCount);

  /* The accessible label always uses the real value, never a mid-count one. */
  const finalValue = isDecimal ? value.toFixed(1) : formatNumber(value);

  return (
    <motion.article
      variants={{
        hidden: { opacity: 0, y: 28 },
        show: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.65,
            delay: index * 0.1,
            ease: [0.22, 1, 0.36, 1],
          },
        },
      }}
      whileHover={{
        y: -4,
        scale: 1.02,
        transition: { duration: 0.25, ease: "easeOut" },
      }}
      className="group flex cursor-default flex-col gap-5 rounded-2xl border border-neutral-200 bg-white p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-shadow duration-300 hover:border-neutral-300 hover:shadow-[0_8px_28px_rgba(0,0,0,0.07)]"
      aria-label={`${finalValue}${suffix} ${label} — ${description}`}
    >
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-neutral-100 bg-neutral-50 text-neutral-700 transition-colors duration-300 group-hover:border-neutral-200 group-hover:bg-neutral-100">
        <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
      </span>

      <div className="flex items-end gap-0.5">
        <span className="text-[2.6rem] font-bold leading-none tracking-[-0.03em] text-neutral-950">
          {displayValue}
        </span>
        {suffix && (
          <span className="mb-1 text-[1.6rem] font-bold leading-none tracking-tight text-neutral-400">
            {suffix}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <p className="text-[15px] font-semibold leading-snug text-neutral-800">{label}</p>
        <p className="text-[13.5px] leading-relaxed text-neutral-400">{description}</p>
      </div>
    </motion.article>
  );
}

/* ─────────────────────────────────────────
   Statistics Section
───────────────────────────────────────── */
function Statistics() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  /*
   * The live request refreshes the numbers silently. While it is pending,
   * or if it fails or hangs, the snapshot (or the constants) stay on screen,
   * so there is never an empty state to wait for. `loading` and `error` are
   * deliberately ignored.
   */
  const { stats } = useStats();
  const current   = isValidStats(stats) ? stats : BASELINE;
  const statCards = buildStatCards(current);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-white py-28 lg:py-32"
      aria-labelledby="stats-heading"
    >
      {/* Dot-grid background */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.03]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="stats-dot-grid" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.5" fill="#0f1419" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#stats-dot-grid)" />
      </svg>

      <Container>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 text-center"
        >
          <h2
            id="stats-heading"
            className="mb-3 text-[clamp(1.6rem,3vw,2.25rem)] font-bold tracking-[-0.02em] text-neutral-950"
          >
            Trusted by thousands of learners
          </h2>
          <p className="mx-auto max-w-md text-[1rem] leading-relaxed text-neutral-400">
            Real numbers from a growing community of developers, students and
            professionals worldwide.
          </p>
        </motion.div>

        {/* Cards grid */}
        <motion.div
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5"
        >
          {statCards.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} started={inView} />
          ))}
        </motion.div>
      </Container>
    </section>
  );
}

export default Statistics;