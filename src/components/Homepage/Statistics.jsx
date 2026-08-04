import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { BookOpen, Users, Folder, Bookmark, Star } from "lucide-react";
import Container from "../Container";
import { getStats } from "../../services/api";

/* ─────────────────────────────────────────
   Animated Counter Hook
───────────────────────────────────────── */
function useCounter(target, duration = 1800, started = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!started) return;

    let startTime = null;
    let frame;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, duration, started]);

  return count;
}

/* ─────────────────────────────────────────
   Format large numbers (e.g. 58000 → 58,000)
───────────────────────────────────────── */
function formatNumber(n) {
  return n.toLocaleString("en-US");
}

/* ─────────────────────────────────────────
   StatCard
───────────────────────────────────────── */
function StatCard({ stat, index, started }) {
  const { icon: Icon, value, suffix, label, description, isDecimal } = stat;
  /* Decimal stats (e.g. averageRating 4.7) are displayed as-is — the
     counter animation only makes sense for integers. */
  const intValue = isDecimal ? Math.round(value * 10) : value;
  const rawCount = useCounter(intValue, 1600 + index * 100, started);
  const displayValue = isDecimal
    ? (rawCount / 10).toFixed(1)
    : formatNumber(rawCount);

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
      className="group flex flex-col gap-5 rounded-2xl border border-neutral-200 bg-white p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-shadow duration-300 hover:border-neutral-300 hover:shadow-[0_8px_28px_rgba(0,0,0,0.07)] cursor-default"
      aria-label={`${displayValue}${suffix} ${label} — ${description}`}
    >
      {/* Icon */}
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-neutral-100 bg-neutral-50 text-neutral-700 transition-colors duration-300 group-hover:border-neutral-200 group-hover:bg-neutral-100">
        <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
      </span>

      {/* Number */}
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

      {/* Label + Description */}
      <div className="flex flex-col gap-1.5">
        <p className="text-[15px] font-semibold leading-snug text-neutral-800">
          {label}
        </p>
        <p className="text-[13.5px] leading-relaxed text-neutral-400">
          {description}
        </p>
      </div>
    </motion.article>
  );
}

/* ─────────────────────────────────────────
   Loading Skeleton
───────────────────────────────────────── */
function StatCardSkeleton() {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-8 animate-pulse">
      <div className="h-11 w-11 rounded-xl bg-neutral-200 mb-5" />
      <div className="h-8 w-24 bg-neutral-200 rounded mb-4" />
      <div className="h-4 w-32 bg-neutral-200 rounded mb-2" />
      <div className="h-3 w-full bg-neutral-200 rounded" />
    </div>
  );
}

/* ─────────────────────────────────────────
   Statistics Section
───────────────────────────────────────── */
function Statistics() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  // ===== STATE FOR REAL STATS =====
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ===== FETCH STATS FROM BACKEND =====
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getStats();

        // Transform backend data into stats array format
        setStats([
          {
            icon: BookOpen,
            value: data.totalBooks,
            suffix: "+",
            label: "Books Available",
            description: "Carefully selected and verified books.",
          },
          {
            icon: Users,
            value: data.totalUsers,
            suffix: "+",
            label: "Active Learners",
            description: "People building their skills every day.",
          },
          {
            icon: Folder,
            value: 42,
            suffix: "",
            label: "Technology Categories",
            description: "Programming, AI, Web, Mobile and more.",
          },
          {
            icon: Bookmark,
            value: data.totalSavedBooks ?? data.totalSaves ?? 0,
            suffix: "+",
            label: "Books Saved",
            description: "Personal libraries created by our community.",
          },
          {
            icon: Star,
            value: data.averageRating ?? 0,
            suffix: "★",
            label: "Average Rating",
            description: "Average rating from our community.",
            isDecimal: true,
          },
        ]);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
        setError(err.message);
        setStats([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-white py-28 lg:py-32"
      aria-labelledby="stats-heading"
    >
      {/* Subtle dot-grid background */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.03]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="stats-dot-grid"
            x="0"
            y="0"
            width="28"
            height="28"
            patternUnits="userSpaceOnUse"
          >
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
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Trusted by thousands of learners
          </h2>
          <p className="mx-auto max-w-md text-[1rem] leading-relaxed text-neutral-400">
            Real numbers from a growing community of developers, students and
            professionals worldwide.
          </p>
        </motion.div>

        {/* Cards grid - Loading State */}
        {loading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {[1, 2, 3, 4, 5].map((i) => (
              <StatCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Cards grid - Error State */}
        {!loading && error && (
          <div className="text-center py-12">
            <p className="text-red-600 font-semibold mb-2">Failed to load statistics</p>
            <p className="text-neutral-500 text-sm">{error}</p>
          </div>
        )}

        {/* Cards grid - Success State */}
        {!loading && !error && stats.length > 0 && (
          <motion.div
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5"
          >
            {stats.map((stat, i) => (
              <StatCard key={stat.label} stat={stat} index={i} started={inView} />
            ))}
          </motion.div>
        )}
      </Container>
    </section>
  );
}

export default Statistics;