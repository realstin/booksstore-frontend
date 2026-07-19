import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Bookmark, Star, Clock, TrendingUp, BookOpen } from "lucide-react";
import Container from "../../../components/Container";

/* ─────────────────────────────────────────
   Shared easing
───────────────────────────────────────── */
const ease = [0.22, 1, 0.36, 1];

/* ─────────────────────────────────────────
   Animated counter hook
───────────────────────────────────────── */
function useCounter(target, duration = 1600, started = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    let start = null;
    let frame;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.floor(eased * target));
      if (p < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, duration, started]);
  return count;
}

function fmt(n) {
  return n.toLocaleString("en-US");
}

/* ─────────────────────────────────────────
   Data — community stats
───────────────────────────────────────── */
const communityStats = [
  { value: 58000,  suffix: "+", label: "Active Readers" },
  { value: 312000, suffix: "+", label: "Books Saved" },
  { value: 98,     suffix: "%", label: "Reader Satisfaction" },
  { value: 12400,  suffix: "+", label: "Books Available" },
];

/* ─────────────────────────────────────────
   Data — book cards
───────────────────────────────────────── */
const books = [
  {
    id: 1,
    title: "The Pragmatic Programmer",
    author: "David Thomas & Andrew Hunt",
    category: "Programming",
    rating: 4.9,
    saves: 8420,
    readTime: "6 hrs",
    badge: true,
    spine: "#0f1419",
    accent: "#e5e5e5",
  },
  {
    id: 2,
    title: "Clean Code",
    author: "Robert C. Martin",
    category: "Programming",
    rating: 4.8,
    saves: 7130,
    readTime: "5 hrs",
    badge: true,
    spine: "#262626",
    accent: "#d4d4d4",
  },
  {
    id: 3,
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    category: "Backend",
    rating: 4.9,
    saves: 6800,
    readTime: "9 hrs",
    badge: false,
    spine: "#404040",
    accent: "#e8e8e8",
  },
  {
    id: 4,
    title: "You Don't Know JS",
    author: "Kyle Simpson",
    category: "Frontend",
    rating: 4.7,
    saves: 5960,
    readTime: "4 hrs",
    badge: true,
    spine: "#171717",
    accent: "#d0d0d0",
  },
  {
    id: 5,
    title: "Deep Learning with Python",
    author: "François Chollet",
    category: "AI",
    rating: 4.8,
    saves: 5340,
    readTime: "7 hrs",
    badge: false,
    spine: "#333333",
    accent: "#e0e0e0",
  },
  {
    id: 6,
    title: "The Linux Command Line",
    author: "William Shotts",
    category: "DevOps",
    rating: 4.6,
    saves: 4720,
    readTime: "5 hrs",
    badge: false,
    spine: "#1a1a1a",
    accent: "#e5e5e5",
  },
];

/* ─────────────────────────────────────────
   Data — featured / trending book
───────────────────────────────────────── */
const featured = {
  title: "System Design Interview",
  author: "Alex Xu",
  category: "Backend · Architecture",
  description:
    "The most recommended guide for understanding scalable system design. Covers real-world architectures used by top technology companies, written in plain, accessible language.",
  rating: 4.9,
  saves: 14200,
  spine: "#0f1419",
  accent: "#d4d4d4",
};

/* ─────────────────────────────────────────
   Data — categories
───────────────────────────────────────── */
const categories = [
  "Frontend", "Backend", "AI", "Cybersecurity", "Cloud",
  "DevOps", "Mobile", "UI/UX", "Data Science", "Programming",
];

/* ─────────────────────────────────────────
   Mini book cover SVG
───────────────────────────────────────── */
function BookCover({ spine, accent, title, size = "sm" }) {
  const w = size === "lg" ? 120 : 72;
  const h = size === "lg" ? 160 : 96;
  const rx = size === "lg" ? 8 : 5;
  const spineW = size === "lg" ? 14 : 9;
  // Derive short initials for the cover
  const words = title.split(" ").filter(Boolean);
  const initials = words.length >= 2
    ? words[0][0] + words[1][0]
    : words[0].slice(0, 2);

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={w}
      height={h}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Cover body */}
      <rect width={w} height={h} rx={rx} fill={spine} />
      {/* Spine highlight */}
      <rect width={spineW} height={h} rx={rx} fill={`${spine}cc`} />
      {/* Accent stripe */}
      <rect x={spineW + 4} y={size === "lg" ? 20 : 12} width={w - spineW - 12} height={size === "lg" ? 4 : 3} rx="2" fill={accent} opacity="0.7" />
      <rect x={spineW + 4} y={size === "lg" ? 30 : 19} width={w - spineW - 20} height={size === "lg" ? 4 : 3} rx="2" fill={accent} opacity="0.4" />
      {/* Initials */}
      <text
        x={w / 2 + spineW / 2}
        y={size === "lg" ? h / 2 + 8 : h / 2 + 6}
        textAnchor="middle"
        fontSize={size === "lg" ? 28 : 18}
        fontWeight="700"
        fill="white"
        opacity="0.9"
        fontFamily="system-ui, sans-serif"
      >
        {initials.toUpperCase()}
      </text>
      {/* Bottom line */}
      <rect x={spineW + 4} y={h - (size === "lg" ? 20 : 14)} width={w - spineW - 12} height={size === "lg" ? 3 : 2} rx="1" fill={accent} opacity="0.35" />
    </svg>
  );
}

/* ─────────────────────────────────────────
   Star rating display
───────────────────────────────────────── */
function Stars({ rating }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`Rating: ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={11}
          strokeWidth={0}
          fill={s <= Math.round(rating) ? "#0f1419" : "#d4d4d4"}
          aria-hidden="true"
        />
      ))}
      <span className="ml-1 text-[11.5px] font-semibold text-neutral-700">{rating}</span>
    </span>
  );
}

/* ─────────────────────────────────────────
   Stat chip (community stats row)
───────────────────────────────────────── */
function StatChip({ value, suffix, label, index, started }) {
  const count = useCounter(value, 1500 + index * 80, started);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={started ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease }}
      className="flex flex-col items-center gap-1 rounded-2xl border border-neutral-200 bg-white px-6 py-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
    >
      <p className="text-[1.9rem] font-bold leading-none tracking-[-0.03em] text-neutral-950">
        {fmt(count)}<span className="text-[1.2rem] text-neutral-400">{suffix}</span>
      </p>
      <p className="text-[12.5px] font-medium text-neutral-500">{label}</p>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   Book card
───────────────────────────────────────── */
function BookCard({ book, index }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.article
      variants={{
        hidden: { opacity: 0, y: 28 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.62, delay: index * 0.08, ease },
        },
      }}
      whileHover={{ y: -6, transition: { duration: 0.24, ease: "easeOut" } }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="group relative flex cursor-default flex-col gap-5 overflow-hidden rounded-3xl border border-neutral-200 bg-white p-7 shadow-[0_1px_4px_rgba(0,0,0,0.04)] transition-shadow duration-300 hover:border-neutral-300 hover:shadow-[0_12px_36px_rgba(0,0,0,0.08)]"
      aria-label={`${book.title} by ${book.author}`}
    >
      {/* Community Favorite badge */}
      {book.badge && (
        <motion.span
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-5 top-5 inline-flex items-center gap-1 rounded-full bg-neutral-950 px-2.5 py-1 text-[10.5px] font-semibold text-white"
          aria-label="Community Favorite"
        >
          <Star size={9} fill="white" strokeWidth={0} aria-hidden="true" />
          Favorite
        </motion.span>
      )}

      {/* Book cover */}
      <motion.div
        animate={hovered ? { scale: 1.06 } : { scale: 1 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className="self-start"
      >
        <BookCover spine={book.spine} accent={book.accent} title={book.title} />
      </motion.div>

      {/* Meta */}
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-400">
          {book.category}
        </span>
        <h3 className="text-[14.5px] font-bold leading-snug tracking-tight text-neutral-950 transition-colors group-hover:text-neutral-700">
          {book.title}
        </h3>
        <p className="text-[12.5px] text-neutral-400">{book.author}</p>
      </div>

      {/* Stats row */}
      <div className="flex items-center justify-between">
        <Stars rating={book.rating} />
        <div className="flex items-center gap-3 text-[11.5px] text-neutral-400">
          <span className="flex items-center gap-1">
            <Bookmark size={10} strokeWidth={2} aria-hidden="true" />
            {fmt(book.saves)}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={10} strokeWidth={2} aria-hidden="true" />
            {book.readTime}
          </span>
        </div>
      </div>

      {/* Read more — appears on hover */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={hovered ? { opacity: 1, height: "auto" } : { opacity: 0, height: 0 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="overflow-hidden"
      >
        <button
          className="mt-1 w-full rounded-xl bg-neutral-950 py-2.5 text-[13px] font-semibold text-white transition hover:bg-neutral-800 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
          aria-label={`Read more about ${book.title}`}
        >
          Read More
        </button>
      </motion.div>
    </motion.article>
  );
}

/* ─────────────────────────────────────────
   Featured / Trending card
───────────────────────────────────────── */
function FeaturedCard({ inView }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay: 0.1, ease }}
      className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.07)]"
      aria-label={`Featured book: ${featured.title}`}
    >
      <div className="grid grid-cols-1 gap-0 md:grid-cols-[auto_1fr]">

        {/* Left — large cover */}
        <div className="flex items-center justify-center bg-neutral-50 p-12 md:px-14 md:py-16">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <BookCover
              spine={featured.spine}
              accent={featured.accent}
              title={featured.title}
              size="lg"
            />
          </motion.div>
        </div>

        {/* Right — content */}
        <div className="flex flex-col justify-center gap-6 p-10 md:p-12">
          {/* Trending badge */}
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1 text-[11.5px] font-semibold text-neutral-700 shadow-sm">
            <TrendingUp size={12} strokeWidth={2.5} aria-hidden="true" />
            Trending This Month
          </span>

          {/* Title */}
          <div>
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
              {featured.category}
            </p>
            <h3 className="mb-2 text-[clamp(1.3rem,2.5vw,1.8rem)] font-bold leading-tight tracking-tight text-neutral-950">
              {featured.title}
            </h3>
            <p className="text-[13.5px] text-neutral-400">by {featured.author}</p>
          </div>

          {/* Description */}
          <p className="max-w-md text-[14.5px] leading-[1.8] text-neutral-500">
            {featured.description}
          </p>

          {/* Rating + saves */}
          <div className="flex flex-wrap items-center gap-5">
            <Stars rating={featured.rating} />
            <span className="flex items-center gap-1.5 text-[12.5px] text-neutral-400">
              <Bookmark size={12} strokeWidth={2} aria-hidden="true" />
              Saved by {fmt(featured.saves)}+ readers
            </span>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3">
            <button className="inline-flex items-center gap-2 rounded-full bg-neutral-950 px-6 py-3 text-[13.5px] font-semibold text-white shadow-sm transition hover:bg-neutral-800 hover:scale-[1.02] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2">
              <BookOpen size={15} strokeWidth={2} aria-hidden="true" />
              Read Online
            </button>
            <button className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-6 py-3 text-[13.5px] font-semibold text-neutral-800 transition hover:border-neutral-400 hover:bg-neutral-50 hover:scale-[1.02] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2">
              <Bookmark size={15} strokeWidth={2} aria-hidden="true" />
              Save Book
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   Category chips
───────────────────────────────────────── */
function CategoryChips({ inView }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.15, ease }}
      className="flex flex-wrap justify-center gap-2.5"
      role="list"
      aria-label="Browse by category"
    >
      {categories.map((cat, i) => (
        <motion.button
          key={cat}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.05 + i * 0.04, ease }}
          whileHover={{ scale: 1.05, transition: { duration: 0.18 } }}
          whileTap={{ scale: 0.96 }}
          className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-[13px] font-medium text-neutral-600 shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-colors hover:border-neutral-950 hover:bg-neutral-950 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
          role="listitem"
        >
          {cat}
        </motion.button>
      ))}
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   CommunityFavorites Section
───────────────────────────────────────── */
function CommunityFavorites() {
  const ref         = useRef(null);
  const inView      = useInView(ref, { once: true, margin: "-80px" });

  const statsRef    = useRef(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-60px" });

  const cardsRef    = useRef(null);
  const cardsInView = useInView(cardsRef, { once: true, margin: "-60px" });

  const featRef     = useRef(null);
  const featInView  = useInView(featRef, { once: true, margin: "-60px" });

  const catRef      = useRef(null);
  const catInView   = useInView(catRef, { once: true, margin: "-60px" });

  const socialRef   = useRef(null);
  const socialInView = useInView(socialRef, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-white py-28 lg:py-32"
      aria-labelledby="community-heading"
    >
      {/* Dot-grid */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.03]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="cf-dot-grid" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.5" fill="#0f1419" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#cf-dot-grid)" />
      </svg>

      {/* Edge hairlines */}
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-neutral-200 to-transparent" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-neutral-200 to-transparent" />

      <Container>

        {/* ══════════════════════════════════════
            ZONE 1 — Section header
        ══════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease }}
          className="mb-16 text-center"
        >
          <p className="mb-4 text-[11.5px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
            Community Favorites
          </p>
          <h2
            id="community-heading"
            className="mb-5 text-[clamp(1.9rem,4vw,2.75rem)] font-bold leading-[1.1] tracking-tight text-neutral-950"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Trusted by readers.
            <br className="hidden sm:block" />
            Chosen by the community.
          </h2>
          <p className="mx-auto max-w-160 text-[1.0625rem] leading-[1.75] text-neutral-500">
            Thousands of learners are discovering, saving and recommending books every day.
            Instead of searching endlessly, discover books other learners have already found valuable.
            Community favorites help you quickly identify trusted resources worth your time.
          </p>
        </motion.div>

        {/* ══════════════════════════════════════
            ZONE 2 — Community stats strip
        ══════════════════════════════════════ */}
        <div
          ref={statsRef}
          className="mb-20 grid grid-cols-2 gap-4 lg:grid-cols-4"
        >
          {communityStats.map((s, i) => (
            <StatChip
              key={s.label}
              value={s.value}
              suffix={s.suffix}
              label={s.label}
              index={i}
              started={statsInView}
            />
          ))}
        </div>

        {/* ══════════════════════════════════════
            ZONE 3 — Book cards grid
        ══════════════════════════════════════ */}
        <motion.div
          ref={cardsRef}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
          initial="hidden"
          animate={cardsInView ? "show" : "hidden"}
          className="mb-20 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {books.map((book, i) => (
            <BookCard key={book.id} book={book} index={i} />
          ))}
        </motion.div>

        {/* ══════════════════════════════════════
            ZONE 4 — Categories
        ══════════════════════════════════════ */}
        <div ref={catRef} className="mb-20">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={catInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, ease }}
            className="mb-7 text-center text-[11.5px] font-semibold uppercase tracking-[0.18em] text-neutral-400"
          >
            Browse by Category
          </motion.p>
          <CategoryChips inView={catInView} />
        </div>

        {/* ══════════════════════════════════════
            ZONE 5 — Trending featured book
        ══════════════════════════════════════ */}
        <div ref={featRef} className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={featInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, ease }}
            className="mb-10 text-center"
          >
            <p className="mb-3 text-[11.5px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
              Trending Now
            </p>
            <h3 className="text-[clamp(1.4rem,2.5vw,2rem)] font-bold tracking-[-0.02em] text-neutral-950">
              The book everyone is reading right now
            </h3>
          </motion.div>
          <FeaturedCard inView={featInView} />
        </div>

        {/* ══════════════════════════════════════
            ZONE 6 — Social proof
        ══════════════════════════════════════ */}
        <motion.div
          ref={socialRef}
          initial={{ opacity: 0, y: 20 }}
          animate={socialInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease }}
          className="flex flex-col items-center gap-4 text-center"
        >
          {/* Stars */}
          <div className="flex items-center gap-1" aria-label="Five star rating">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={22}
                strokeWidth={0}
                fill="#0f1419"
                aria-hidden="true"
              />
            ))}
          </div>

          <p className="text-[1.1rem] font-semibold text-neutral-900">
            Loved by thousands of learners around the world.
          </p>
          <p className="max-w-sm text-[15px] leading-relaxed text-neutral-400">
            Join the growing community building their personal learning library.
          </p>
        </motion.div>

      </Container>
    </section>
  );
}

export default CommunityFavorites;
