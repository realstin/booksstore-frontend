import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useAnimationFrame } from 'framer-motion';
import { ArrowLeft, Compass, BookOpen } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';

/* ─────────────────────────────────────────
   Shared easing curve — matches the rest
   of the design system.
───────────────────────────────────────── */
const ease = [0.22, 1, 0.36, 1];

/* ─────────────────────────────────────────
   Animated floating book silhouettes
   Renders N small book shapes that drift
   slowly around the background — purely
   decorative, aria-hidden.
───────────────────────────────────────── */
const BOOKS = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  /* distribute evenly so the field feels balanced */
  x: 10 + (i % 3) * 35 + (i > 2 ? 10 : 0),
  y: 12 + Math.floor(i / 3) * 48,
  size: 18 + (i % 3) * 6,
  speed: 0.18 + i * 0.04,
  phase: (i / 6) * Math.PI * 2,
  opacity: 0.045 + (i % 2) * 0.025,
}));

function FloatingBooks() {
  const refs = useRef([]);

  useAnimationFrame((t) => {
    const secs = t / 1000;
    refs.current.forEach((el, i) => {
      if (!el) return;
      const b = BOOKS[i];
      const dy = Math.sin(secs * b.speed + b.phase) * 14;
      const dx = Math.cos(secs * b.speed * 0.6 + b.phase) * 6;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    });
  });

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {BOOKS.map((b, i) => (
        <div
          key={b.id}
          ref={(el) => (refs.current[i] = el)}
          style={{
            position: 'absolute',
            left: `${b.x}%`,
            top: `${b.y}%`,
            opacity: b.opacity,
            willChange: 'transform',
          }}
        >
          {/* Minimal book silhouette in SVG */}
          <svg
            width={b.size}
            height={b.size * 1.3}
            viewBox="0 0 24 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="0" y="0" width="24" height="32" rx="3" fill="#0f1419" />
            <rect x="0" y="0" width="4" height="32" rx="2" fill="#1f2933" />
            <rect x="7" y="5" width="13" height="2" rx="1" fill="#e5e5e5" opacity="0.6" />
            <rect x="7" y="9" width="10" height="2" rx="1" fill="#e5e5e5" opacity="0.35" />
            <rect x="7" y="23" width="13" height="1.5" rx="1" fill="#e5e5e5" opacity="0.25" />
          </svg>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   Dot-grid background — matches the
   CommunityFavorites section pattern.
───────────────────────────────────────── */
function DotGrid() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.025]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="nf-dot-grid"
          x="0"
          y="0"
          width="28"
          height="28"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="1.5" cy="1.5" r="1.5" fill="#0f1419" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#nf-dot-grid)" />
    </svg>
  );
}

/* ─────────────────────────────────────────
   Large "404" glyph — drawn with stroked
   paths so it stays crisp at any size.
───────────────────────────────────────── */
function GlyphFourOhFour() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.9, ease }}
      className="relative select-none"
      aria-hidden="true"
    >
      {/* Blurred glow behind the number */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-32 w-72 rounded-full bg-neutral-200 opacity-60 blur-3xl" />
      </div>

      {/* The number itself */}
      <p
        className="relative font-bold leading-none tracking-[-0.06em] text-neutral-950"
        style={{
          fontSize: 'clamp(7rem, 22vw, 13rem)',
          fontFamily: 'var(--font-sans)',
        }}
      >
        4
        {/* The middle "0" has a subtle open-book icon overlaid */}
        <span className="relative inline-block">
          0
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.45, ease }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <BookOpen
              strokeWidth={1.5}
              className="text-white"
              style={{ width: '38%', height: '38%' }}
            />
          </motion.span>
        </span>
        4
      </p>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   Auto-redirect countdown (10 → 0)
───────────────────────────────────────── */
function useCountdown(seconds, onDone) {
  const [count, setCount] = useState(seconds);

  useEffect(() => {
    if (count <= 0) { onDone(); return; }
    const id = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [count, onDone]);

  return count;
}

/* ─────────────────────────────────────────
   Main 404 page
───────────────────────────────────────── */
function NotFound() {
  usePageMeta({
    title: 'Page Not Found | BookStore',
    description: 'The page you are looking for does not exist. Head back to BookStore.',
  });

  const navigate = useNavigate();
  const goHome   = () => navigate('/', { replace: true });
  const count    = useCountdown(10, goHome);

  /* Progress ring radius */
  const R   = 11;
  const C   = 2 * Math.PI * R;
  const pct = count / 10;

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white px-6">
      {/* Decorative layers */}
      <DotGrid />
      <FloatingBooks />

      {/* Top edge line */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent"
      />
      {/* Bottom edge line */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent"
      />

      {/* ── Logo (top-left) ── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease }}
        className="absolute left-6 top-6 sm:left-10 sm:top-8"
      >
        <Link
          to="/"
          className="text-[17px] font-semibold tracking-tight text-neutral-950 transition hover:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
        >
          BookStore
        </Link>
      </motion.div>

      {/* ── Centre content ── */}
      <div className="relative z-10 flex w-full max-w-lg flex-col items-center gap-8 text-center">

        {/* 404 Glyph */}
        <GlyphFourOhFour />

        {/* Copy */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.2, ease }}
          className="flex flex-col gap-3"
        >
          <h1 className="text-[1.6rem] font-bold leading-tight tracking-[-0.02em] text-neutral-950 sm:text-[2rem]">
            This page is missing from the shelf.
          </h1>
          <p className="mx-auto max-w-sm text-[1rem] leading-[1.8] text-neutral-500">
            The URL you visited doesn't exist or may have been moved.
            Let's get you back to something real.
          </p>
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.34, ease }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full bg-neutral-950 px-6 py-3 text-[14px] font-semibold text-white shadow-sm transition hover:bg-neutral-800 hover:scale-[1.02] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
          >
            <ArrowLeft size={15} strokeWidth={2} aria-hidden="true" />
            Back to Home
          </Link>

          <Link
            to="/explore"
            className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-6 py-3 text-[14px] font-semibold text-neutral-700 shadow-sm transition hover:border-neutral-400 hover:bg-neutral-50 hover:scale-[1.02] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
          >
            <Compass size={15} strokeWidth={2} aria-hidden="true" />
            Explore Books
          </Link>
        </motion.div>

        {/* Auto-redirect counter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.55, ease }}
          className="flex items-center gap-2.5 text-[12.5px] text-neutral-400"
          aria-live="polite"
          aria-atomic="true"
        >
          {/* SVG countdown ring */}
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            aria-hidden="true"
          >
            {/* Track */}
            <circle
              cx="14"
              cy="14"
              r={R}
              stroke="#e5e5e5"
              strokeWidth="2.2"
            />
            {/* Progress arc — rotates from 12 o'clock */}
            <circle
              cx="14"
              cy="14"
              r={R}
              stroke="#0f1419"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - pct)}
              transform="rotate(-90 14 14)"
              style={{ transition: 'stroke-dashoffset 0.9s linear' }}
            />
            {/* Number inside ring */}
            <text
              x="14"
              y="14"
              dominantBaseline="central"
              textAnchor="middle"
              fontSize="8.5"
              fontWeight="600"
              fill="#0f1419"
              fontFamily="var(--font-sans)"
            >
              {count}
            </text>
          </svg>

          <span>Redirecting to home in {count}s</span>

          <button
            type="button"
            onClick={() => {
              /* navigate away immediately and kill the countdown */
              navigate('/', { replace: true });
            }}
            className="underline underline-offset-4 transition hover:text-neutral-700 focus:outline-none"
          >
            Go now
          </button>
        </motion.div>

      </div>
    </div>
  );
}

export default NotFound;
