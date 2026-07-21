import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  Bookmark,
  Star,
  Clock,
  TrendingUp,
  BookOpen,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import Container from "../Container";
import { getBooks } from "../../services/api";

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

    const step = (timestamp) => {
      if (!start) start = timestamp;

      const progress = Math.min(
        (timestamp - start) / duration,
        1
      );

      const eased = 1 - Math.pow(1 - progress, 3);

      setCount(Math.floor(eased * target));

      if (progress < 1) {
        frame = requestAnimationFrame(step);
      }
    };

    frame = requestAnimationFrame(step);

    return () => cancelAnimationFrame(frame);
  }, [target, duration, started]);

  return count;
}

/* ─────────────────────────────────────────
   Number formatter
───────────────────────────────────────── */

function fmt(number) {
  return Number(number || 0).toLocaleString("en-US");
}

/* ─────────────────────────────────────────
   Community stats

   These are still static for now.
   Later we can connect these to real
   database statistics.
───────────────────────────────────────── */

const communityStats = [
  {
    value: 58000,
    suffix: "+",
    label: "Active Readers",
  },
  {
    value: 312000,
    suffix: "+",
    label: "Books Saved",
  },
  {
    value: 98,
    suffix: "%",
    label: "Reader Satisfaction",
  },
  {
    value: 12400,
    suffix: "+",
    label: "Books Available",
  },
];

/* ─────────────────────────────────────────
   Categories
───────────────────────────────────────── */

const categories = [
  "Frontend",
  "Backend",
  "AI",
  "Cybersecurity",
  "Cloud",
  "DevOps",
  "Mobile",
  "UI/UX",
  "Data Science",
  "Programming",
];

/* ─────────────────────────────────────────
   Mini fallback book cover SVG

   Used when a book does not have a
   coverImage in the database.
───────────────────────────────────────── */

function BookCover({
  title = "Book",
  coverImage = "",
  size = "sm",
}) {
  const w = size === "lg" ? 120 : 72;
  const h = size === "lg" ? 160 : 96;
  const rx = size === "lg" ? 8 : 5;

  const words = title
    .split(" ")
    .filter(Boolean);

  const initials =
    words.length >= 2
      ? words[0][0] + words[1][0]
      : words[0]?.slice(0, 2) || "BK";

  /* Use real cover image if available */
  if (coverImage) {
    return (
      <div
        className={`overflow-hidden rounded-[${rx}px] bg-neutral-100 shadow-sm`}
        style={{
          width: w,
          height: h,
          borderRadius: rx,
        }}
      >
        <img
          src={coverImage}
          alt={`Cover of ${title}`}
          className="h-full w-full object-cover"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      </div>
    );
  }

  /* Fallback generated cover */
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={w}
      height={h}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Cover */}
      <rect
        width={w}
        height={h}
        rx={rx}
        fill="#0f1419"
      />

      {/* Spine */}
      <rect
        width={size === "lg" ? 14 : 9}
        height={h}
        rx={rx}
        fill="#1f2933"
      />

      {/* Accent lines */}
      <rect
        x={size === "lg" ? 18 : 13}
        y={size === "lg" ? 20 : 12}
        width={size === "lg" ? 88 : 52}
        height={size === "lg" ? 4 : 3}
        rx="2"
        fill="#e5e5e5"
        opacity="0.7"
      />

      <rect
        x={size === "lg" ? 18 : 13}
        y={size === "lg" ? 30 : 19}
        width={size === "lg" ? 70 : 42}
        height={size === "lg" ? 4 : 3}
        rx="2"
        fill="#e5e5e5"
        opacity="0.4"
      />

      {/* Initials */}
      <text
        x={w / 2 + (size === "lg" ? 7 : 4)}
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
      <rect
        x={size === "lg" ? 18 : 13}
        y={h - (size === "lg" ? 20 : 14)}
        width={size === "lg" ? 88 : 52}
        height={size === "lg" ? 3 : 2}
        rx="1"
        fill="#e5e5e5"
        opacity="0.35"
      />
    </svg>
  );
}

/* ─────────────────────────────────────────
   Star rating
───────────────────────────────────────── */

function Stars({ rating = 0 }) {
  return (
    <span
      className="flex items-center gap-0.5"
      aria-label={`Rating: ${rating} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={11}
          strokeWidth={0}
          fill={
            star <= Math.round(rating)
              ? "#0f1419"
              : "#d4d4d4"
          }
          aria-hidden="true"
        />
      ))}

      <span className="ml-1 text-[11.5px] font-semibold text-neutral-700">
        {Number(rating || 0).toFixed(1)}
      </span>
    </span>
  );
}

/* ─────────────────────────────────────────
   Stat chip
───────────────────────────────────────── */

function StatChip({
  value,
  suffix,
  label,
  index,
  started,
}) {
  const count = useCounter(
    value,
    1500 + index * 80,
    started
  );

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={
        started
          ? {
              opacity: 1,
              y: 0,
            }
          : {}
      }
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease,
      }}
      className="flex flex-col items-center gap-1 rounded-2xl border border-neutral-200 bg-white px-6 py-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
    >
      <p className="text-[1.9rem] font-bold leading-none tracking-[-0.03em] text-neutral-950">
        {fmt(count)}
        <span className="text-[1.2rem] text-neutral-400">
          {suffix}
        </span>
      </p>

      <p className="text-[12.5px] font-medium text-neutral-500">
        {label}
      </p>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   Book card

   Uses REAL book data from MongoDB
───────────────────────────────────────── */

function BookCard({ book, index }) {
  const [hovered, setHovered] = useState(false);

  const author =
    Array.isArray(book.authors) &&
    book.authors.length > 0
      ? book.authors.join(" & ")
      : "Unknown Author";

  const category =
    Array.isArray(book.categories) &&
    book.categories.length > 0
      ? book.categories[0]
      : "Book";

  return (
    <motion.article
      variants={{
        hidden: {
          opacity: 0,
          y: 28,
        },

        show: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.62,
            delay: index * 0.08,
            ease,
          },
        },
      }}
      whileHover={{
        y: -6,
        transition: {
          duration: 0.24,
          ease: "easeOut",
        },
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="group relative flex cursor-default flex-col gap-5 overflow-hidden rounded-3xl border border-neutral-200 bg-white p-7 shadow-[0_1px_4px_rgba(0,0,0,0.04)] transition-shadow duration-300 hover:border-neutral-300 hover:shadow-[0_12px_36px_rgba(0,0,0,0.08)]"
      aria-label={`${book.title} by ${author}`}
    >
      {/* Favorite badge */}

      {book.featured && (
        <motion.span
          animate={{
            y: [0, -3, 0],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute right-5 top-5 inline-flex items-center gap-1 rounded-full bg-neutral-950 px-2.5 py-1 text-[10.5px] font-semibold text-white"
        >
          <Star
            size={9}
            fill="white"
            strokeWidth={0}
          />

          Favorite
        </motion.span>
      )}

      {/* Real book cover */}

      <motion.div
        animate={
          hovered
            ? {
                scale: 1.06,
              }
            : {
                scale: 1,
              }
        }
        transition={{
          duration: 0.28,
          ease: "easeOut",
        }}
        className="self-start"
      >
        <BookCover
          title={book.title}
          coverImage={book.coverImage}
        />
      </motion.div>

      {/* Book information */}

      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-400">
          {category}
        </span>

        <h3 className="text-[14.5px] font-bold leading-snug tracking-tight text-neutral-950 transition-colors group-hover:text-neutral-700">
          {book.title}
        </h3>

        <p className="text-[12.5px] text-neutral-400">
          {author}
        </p>
      </div>

      {/* Book stats */}

      <div className="flex items-center justify-between">
        <Stars rating={book.rating} />

        <div className="flex items-center gap-3 text-[11.5px] text-neutral-400">
          <span className="flex items-center gap-1">
            <Bookmark
              size={10}
              strokeWidth={2}
            />

            {fmt(book.savesCount)}
          </span>

          {book.pages && (
            <span className="flex items-center gap-1">
              <BookOpen
                size={10}
                strokeWidth={2}
              />

              {book.pages} pages
            </span>
          )}
        </div>
      </div>

      {/* Read more */}

      <motion.div
        initial={{
          opacity: 0,
          height: 0,
        }}
        animate={
          hovered
            ? {
                opacity: 1,
                height: "auto",
              }
            : {
                opacity: 0,
                height: 0,
              }
        }
        transition={{
          duration: 0.22,
          ease: "easeOut",
        }}
        className="overflow-hidden"
      >
        <button
          type="button"
          className="mt-1 w-full rounded-xl bg-neutral-950 py-2.5 text-[13px] font-semibold text-white transition hover:bg-neutral-800 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
        >
          Read More
        </button>
      </motion.div>
    </motion.article>
  );
}

/* ─────────────────────────────────────────
   Featured / Trending card

   Uses REAL database book
───────────────────────────────────────── */

function FeaturedCard({
  featured,
  inView,
}) {
  if (!featured) return null;

  const author =
    Array.isArray(featured.authors) &&
    featured.authors.length > 0
      ? featured.authors.join(" & ")
      : "Unknown Author";

  const category =
    Array.isArray(featured.categories) &&
    featured.categories.length > 0
      ? featured.categories.join(" · ")
      : "Featured Book";

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 32,
      }}
      animate={
        inView
          ? {
              opacity: 1,
              y: 0,
            }
          : {}
      }
      transition={{
        duration: 0.75,
        delay: 0.1,
        ease,
      }}
      className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.07)]"
      aria-label={`Featured book: ${featured.title}`}
    >
      <div className="grid grid-cols-1 gap-0 md:grid-cols-[auto_1fr]">
        {/* Cover */}

        <div className="flex items-center justify-center bg-neutral-50 p-12 md:px-14 md:py-16">
          <motion.div
            animate={{
              y: [0, -8, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <BookCover
              title={featured.title}
              coverImage={featured.coverImage}
              size="lg"
            />
          </motion.div>
        </div>

        {/* Content */}

        <div className="flex flex-col justify-center gap-6 p-10 md:p-12">
          {/* Trending badge */}

          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1 text-[11.5px] font-semibold text-neutral-700 shadow-sm">
            <TrendingUp
              size={12}
              strokeWidth={2.5}
            />

            Trending This Month
          </span>

          {/* Title */}

          <div>
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
              {category}
            </p>

            <h3 className="mb-2 text-[clamp(1.3rem,2.5vw,1.8rem)] font-bold leading-tight tracking-tight text-neutral-950">
              {featured.title}
            </h3>

            <p className="text-[13.5px] text-neutral-400">
              by {author}
            </p>
          </div>

          {/* Description */}

          <p className="max-w-md text-[14.5px] leading-[1.8] text-neutral-500">
            {featured.description ||
              "Discover this trusted resource selected by the BookStore community."}
          </p>

          {/* Rating and saves */}

          <div className="flex flex-wrap items-center gap-5">
            <Stars rating={featured.rating} />

            <span className="flex items-center gap-1.5 text-[12.5px] text-neutral-400">
              <Bookmark
                size={12}
                strokeWidth={2}
              />

              Saved by {fmt(featured.savesCount)} readers
            </span>
          </div>

          {/* Actions */}

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-neutral-950 px-6 py-3 text-[13.5px] font-semibold text-white shadow-sm transition hover:scale-[1.02] hover:bg-neutral-800 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
            >
              <BookOpen
                size={15}
                strokeWidth={2}
              />

              Read Online
            </button>

            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-6 py-3 text-[13.5px] font-semibold text-neutral-800 transition hover:scale-[1.02] hover:border-neutral-400 hover:bg-neutral-50 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
            >
              <Bookmark
                size={15}
                strokeWidth={2}
              />

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
      initial={{
        opacity: 0,
        y: 18,
      }}
      animate={
        inView
          ? {
              opacity: 1,
              y: 0,
            }
          : {}
      }
      transition={{
        duration: 0.6,
        delay: 0.15,
        ease,
      }}
      className="flex flex-wrap justify-center gap-2.5"
      role="list"
      aria-label="Browse by category"
    >
      {categories.map((category, index) => (
        <motion.button
          key={category}
          initial={{
            opacity: 0,
            scale: 0.9,
          }}
          animate={
            inView
              ? {
                  opacity: 1,
                  scale: 1,
                }
              : {}
          }
          transition={{
            duration: 0.4,
            delay: 0.05 + index * 0.04,
            ease,
          }}
          whileHover={{
            scale: 1.05,
          }}
          whileTap={{
            scale: 0.96,
          }}
          className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-[13px] font-medium text-neutral-600 shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-colors hover:border-neutral-950 hover:bg-neutral-950 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
          role="listitem"
        >
          {category}
        </motion.button>
      ))}
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   Loading state
───────────────────────────────────────── */

function BooksLoading() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div
          key={item}
          className="animate-pulse rounded-3xl border border-neutral-200 bg-white p-7"
        >
          <div className="h-24 w-18 rounded-md bg-neutral-200" />

          <div className="mt-6 space-y-3">
            <div className="h-3 w-20 rounded bg-neutral-200" />
            <div className="h-5 w-3/4 rounded bg-neutral-200" />
            <div className="h-3 w-1/2 rounded bg-neutral-200" />
          </div>

          <div className="mt-6 h-4 w-full rounded bg-neutral-200" />
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   Error state
───────────────────────────────────────── */

function BooksError({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-neutral-200 bg-neutral-50 px-6 py-16 text-center">
      <AlertCircle
        size={32}
        className="mb-4 text-neutral-500"
      />

      <h3 className="mb-2 text-lg font-bold text-neutral-900">
        We couldn't load the books
      </h3>

      <p className="mb-6 max-w-md text-sm leading-relaxed text-neutral-500">
        {message ||
          "Something went wrong while connecting to the BookStore library."}
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center gap-2 rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800 active:scale-95"
      >
        <RefreshCw size={15} />

        Try Again
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────
   Community Favorites Section
───────────────────────────────────────── */

function CommunityFavorites() {
  const ref = useRef(null);

  const inView = useInView(ref, {
    once: true,
    margin: "-80px",
  });

  const statsRef = useRef(null);

  const statsInView = useInView(statsRef, {
    once: true,
    margin: "-60px",
  });

  const cardsRef = useRef(null);

  const cardsInView = useInView(cardsRef, {
    once: true,
    margin: "-60px",
  });

  const featRef = useRef(null);

  const featInView = useInView(featRef, {
    once: true,
    margin: "-60px",
  });

  const catRef = useRef(null);

  const catInView = useInView(catRef, {
    once: true,
    margin: "-60px",
  });

  const socialRef = useRef(null);

  const socialInView = useInView(socialRef, {
    once: true,
    margin: "-60px",
  });

  /* ─────────────────────────────────────────
     Real database books
  ───────────────────────────────────────── */

  const [books, setBooks] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  /* ─────────────────────────────────────────
     Fetch books from backend
  ───────────────────────────────────────── */

  const fetchCommunityBooks = async () => {
    try {
      setLoading(true);
      setError("");

      /*
        Ask backend for featured books.

        Sort by savesCount descending,
        so books saved by the most readers
        appear first.

        Limit to 6 books for the homepage.
      */

      const data = await getBooks({
        featured: true,
        limit: 6,
        sort: "-savesCount",
      });

      setBooks(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (err) {
      console.error(
        "Failed to load community books:",
        err
      );

      setError(
        err.message ||
          "Unable to load books from the server."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ─────────────────────────────────────────
     Load books when component mounts
  ───────────────────────────────────────── */

  useEffect(() => {
    fetchCommunityBooks();
  }, []);

  /*
    The first book is used as the
    trending/featured book.

    Because the backend sorts by savesCount,
    this will be the most-saved featured book.
  */

  const featuredBook = books[0];

  /*
    Remaining books are displayed
    in the Community Favorites grid.
  */

  const communityBooks = books.slice(1);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-white py-28 lg:py-32"
      aria-labelledby="community-heading"
    >
      {/* Dot grid */}

      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.03]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="cf-dot-grid"
            x="0"
            y="0"
            width="28"
            height="28"
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx="1.5"
              cy="1.5"
              r="1.5"
              fill="#0f1419"
            />
          </pattern>
        </defs>

        <rect
          width="100%"
          height="100%"
          fill="url(#cf-dot-grid)"
        />
      </svg>

      {/* Top border */}

      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-neutral-200 to-transparent"
      />

      {/* Bottom border */}

      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-neutral-200 to-transparent"
      />

      <Container>
        {/* ══════════════════════════════════════
            ZONE 1 — Header
        ══════════════════════════════════════ */}

        <motion.div
          initial={{
            opacity: 0,
            y: 22,
          }}
          animate={
            inView
              ? {
                  opacity: 1,
                  y: 0,
                }
              : {}
          }
          transition={{
            duration: 0.7,
            ease,
          }}
          className="mb-16 text-center"
        >
          <p className="mb-4 text-[11.5px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
            Community Favorites
          </p>

          <h2
            id="community-heading"
            className="mb-5 text-[clamp(1.9rem,4vw,2.75rem)] font-bold leading-[1.1] tracking-tight text-neutral-950"
          >
            Trusted by readers.
            <br className="hidden sm:block" />
            Chosen by the community.
          </h2>

          <p className="mx-auto max-w-160 text-[1.0625rem] leading-[1.75] text-neutral-500">
            Discover books that readers are saving,
            recommending, and finding valuable.
            Instead of searching endlessly, find
            trusted resources that the BookStore
            community has already discovered.
          </p>
        </motion.div>

        {/* ══════════════════════════════════════
            ZONE 2 — Community stats
        ══════════════════════════════════════ */}

        <div
          ref={statsRef}
          className="mb-20 grid grid-cols-2 gap-4 lg:grid-cols-4"
        >
          {communityStats.map(
            (stat, index) => (
              <StatChip
                key={stat.label}
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
                index={index}
                started={statsInView}
              />
            )
          )}
        </div>

        {/* ══════════════════════════════════════
            ZONE 3 — Real database books
        ══════════════════════════════════════ */}

        <div ref={cardsRef} className="mb-20">
          {loading && <BooksLoading />}

          {!loading && error && (
            <BooksError
              message={error}
              onRetry={fetchCommunityBooks}
            />
          )}

          {!loading &&
            !error &&
            communityBooks.length === 0 && (
              <div className="rounded-3xl border border-neutral-200 bg-neutral-50 px-6 py-16 text-center">
                <BookOpen
                  size={32}
                  className="mx-auto mb-4 text-neutral-400"
                />

                <h3 className="mb-2 text-lg font-bold text-neutral-900">
                  No community favorites yet
                </h3>

                <p className="text-sm text-neutral-500">
                  Featured books will appear here
                  once they are added to the BookStore
                  library.
                </p>
              </div>
            )}

          {!loading &&
            !error &&
            communityBooks.length > 0 && (
              <motion.div
                variants={{
                  hidden: {},
                  show: {
                    transition: {
                      staggerChildren: 0.08,
                    },
                  },
                }}
                initial="hidden"
                animate={
                  cardsInView
                    ? "show"
                    : "hidden"
                }
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                {communityBooks.map(
                  (book, index) => (
                    <BookCard
                      key={book._id}
                      book={book}
                      index={index}
                    />
                  )
                )}
              </motion.div>
            )}
        </div>

        {/* ══════════════════════════════════════
            ZONE 4 — Categories
        ══════════════════════════════════════ */}

        <div
          ref={catRef}
          className="mb-20"
        >
          <motion.p
            initial={{
              opacity: 0,
              y: 14,
            }}
            animate={
              catInView
                ? {
                    opacity: 1,
                    y: 0,
                  }
                : {}
            }
            transition={{
              duration: 0.55,
              ease,
            }}
            className="mb-7 text-center text-[11.5px] font-semibold uppercase tracking-[0.18em] text-neutral-400"
          >
            Browse by Category
          </motion.p>

          <CategoryChips
            inView={catInView}
          />
        </div>

        {/* ══════════════════════════════════════
            ZONE 6 — Social proof
        ══════════════════════════════════════ */}

        <motion.div
          ref={socialRef}
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={
            socialInView
              ? {
                  opacity: 1,
                  y: 0,
                }
              : {}
          }
          transition={{
            duration: 0.65,
            ease,
          }}
          className="flex flex-col items-center gap-4 text-center"
        >
          {/* Stars */}

          <div
            className="flex items-center gap-1"
            aria-label="Five star rating"
          >
            {[1, 2, 3, 4, 5].map(
              (star) => (
                <Star
                  key={star}
                  size={22}
                  strokeWidth={0}
                  fill="#0f1419"
                  aria-hidden="true"
                />
              )
            )}
          </div>

          <p className="text-[1.1rem] font-semibold text-neutral-900">
            Loved by thousands of learners around the world.
          </p>

          <p className="max-w-sm text-[15px] leading-relaxed text-neutral-400">
            Join the growing community building
            their personal learning library.
          </p>
        </motion.div>
      </Container>
    </section>
  );
}

export default CommunityFavorites;