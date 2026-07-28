import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles, TrendingUp, Star as StarIcon, RefreshCw,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { getBooks } from '../../services/api';
import DashboardBookCard from '../../components/Dashboard/DashboardBookCard';
import BookCardSkeleton from '../../components/Dashboard/BookCardSkeleton';

/* ─────────────────────────────────────────
   Shared easing
───────────────────────────────────────── */
const ease = [0.22, 1, 0.36, 1];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.62, delay, ease },
});

/* ─────────────────────────────────────────
   Section wrapper
───────────────────────────────────────── */
function Section({ id, title, icon: Icon, delay = 0, children }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.58, delay, ease }}
      aria-labelledby={id}
    >
      <div className="mb-4 flex items-center gap-2">
        {Icon && (
          <Icon
            size={15}
            strokeWidth={2}
            className="text-neutral-400"
            aria-hidden="true"
          />
        )}
        <h2
          id={id}
          className="text-[13.5px] font-semibold uppercase tracking-[0.14em] text-neutral-400"
        >
          {title}
        </h2>
      </div>
      {children}
    </motion.section>
  );
}

/* ─────────────────────────────────────────
   Skeleton grid — shown while loading
───────────────────────────────────────── */
function SkeletonGrid({ count = 6 }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      {Array.from({ length: count }).map((_, i) => (
        <BookCardSkeleton key={i} />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   Empty state
───────────────────────────────────────── */
function EmptyState({ message }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-neutral-200 bg-white px-6 py-10 text-center">
      <p className="text-[13.5px] text-neutral-400">{message}</p>
    </div>
  );
}

/* ─────────────────────────────────────────
   Error state with optional retry
───────────────────────────────────────── */
function ErrorState({ onRetry }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-6 py-8 text-center">
      <p className="text-[13.5px] text-neutral-500">
        Unable to load books right now.
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 px-4 py-1.5 text-[12.5px] font-medium text-neutral-600 transition hover:border-neutral-400 hover:text-neutral-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
        >
          <RefreshCw size={12} strokeWidth={2} aria-hidden="true" />
          Try again
        </button>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   Book card grid
───────────────────────────────────────── */
function BookGrid({ books }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      {books.map((book, i) => (
        <DashboardBookCard
          key={book._id ?? i}
          book={book}
          index={i}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   Section state machine
   status: 'loading' | 'success' | 'error'
───────────────────────────────────────── */
function BookSection({ books, status, emptyMessage, onRetry, skeletonCount = 6 }) {
  if (status === 'loading') return <SkeletonGrid count={skeletonCount} />;
  if (status === 'error')   return <ErrorState onRetry={onRetry} />;
  if (!books || books.length === 0) return <EmptyState message={emptyMessage} />;
  return <BookGrid books={books} />;
}

/* ─────────────────────────────────────────
   Dashboard home page
───────────────────────────────────────── */
function Dashboard() {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] ?? 'there';

  /* ── Data state ── */
  const [recentBooks,    setRecentBooks]    = useState([]);
  const [trendingBooks,  setTrendingBooks]  = useState([]);
  const [featuredBooks,  setFeaturedBooks]  = useState([]);

  const [recentStatus,   setRecentStatus]   = useState('loading');
  const [trendingStatus, setTrendingStatus] = useState('loading');
  const [featuredStatus, setFeaturedStatus] = useState('loading');

  /* ── Fetch all three sections concurrently ── */
  const fetchAllBooks = useCallback(async () => {
    setRecentStatus('loading');
    setTrendingStatus('loading');
    setFeaturedStatus('loading');

    const [recentResult, trendingResult, featuredResult] = await Promise.allSettled([
      getBooks({ sort: '-createdAt',  limit: 6 }),
      getBooks({ sort: '-savesCount', limit: 6 }),
      getBooks({ featured: true,      limit: 6 }),
    ]);

    /* Recently Added */
    if (recentResult.status === 'fulfilled') {
      const data = recentResult.value;
      setRecentBooks(Array.isArray(data) ? data : data.books ?? []);
      setRecentStatus('success');
    } else {
      console.error('Recently Added fetch failed:', recentResult.reason);
      setRecentStatus('error');
    }

    /* Trending */
    if (trendingResult.status === 'fulfilled') {
      const data = trendingResult.value;
      setTrendingBooks(Array.isArray(data) ? data : data.books ?? []);
      setTrendingStatus('success');
    } else {
      console.error('Trending fetch failed:', trendingResult.reason);
      setTrendingStatus('error');
    }

    /* Community Favorites */
    if (featuredResult.status === 'fulfilled') {
      const data = featuredResult.value;
      setFeaturedBooks(Array.isArray(data) ? data : data.books ?? []);
      setFeaturedStatus('success');
    } else {
      console.error('Community Favorites fetch failed:', featuredResult.reason);
      setFeaturedStatus('error');
    }
  }, []);

  useEffect(() => {
    fetchAllBooks();
  }, [fetchAllBooks]);

  /* ── Individual retry handlers ── */
  const retryRecent = useCallback(async () => {
    setRecentStatus('loading');
    try {
      const data = await getBooks({ sort: '-createdAt', limit: 6 });
      setRecentBooks(Array.isArray(data) ? data : data.books ?? []);
      setRecentStatus('success');
    } catch (err) {
      console.error('Recent retry failed:', err);
      setRecentStatus('error');
    }
  }, []);

  const retryTrending = useCallback(async () => {
    setTrendingStatus('loading');
    try {
      const data = await getBooks({ sort: '-savesCount', limit: 6 });
      setTrendingBooks(Array.isArray(data) ? data : data.books ?? []);
      setTrendingStatus('success');
    } catch (err) {
      console.error('Trending retry failed:', err);
      setTrendingStatus('error');
    }
  }, []);

  const retryFeatured = useCallback(async () => {
    setFeaturedStatus('loading');
    try {
      const data = await getBooks({ featured: true, limit: 6 });
      setFeaturedBooks(Array.isArray(data) ? data : data.books ?? []);
      setFeaturedStatus('success');
    } catch (err) {
      console.error('Featured retry failed:', err);
      setFeaturedStatus('error');
    }
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 sm:px-8 lg:px-10">

      {/* ── Welcome header ── */}
      <header className="mb-10">
        <motion.p
          {...fadeUp(0)}
          className="mb-2 text-[11.5px] font-semibold uppercase tracking-[0.2em] text-neutral-400"
        >
          Dashboard
        </motion.p>
        <motion.h1
          {...fadeUp(0.07)}
          className="mb-3 text-[clamp(1.75rem,3.5vw,2.4rem)] font-bold leading-[1.1] tracking-[-0.02em] text-neutral-950"
        >
          Welcome back, {firstName}.
        </motion.h1>
        <motion.p
          {...fadeUp(0.13)}
          className="max-w-lg text-[1rem] leading-[1.75] text-neutral-500"
        >
          Continue your learning journey, discover something new, and build
          your personal library.
        </motion.p>
      </header>

      {/* ── Data sections ── */}
      <div className="flex flex-col gap-12">

        {/* Recently Added */}
        <Section id="recently-added" title="Recently Added" icon={Sparkles} delay={0.18}>
          <BookSection
            books={recentBooks}
            status={recentStatus}
            emptyMessage="No books have been added yet."
            onRetry={retryRecent}
          />
        </Section>

        {/* Trending Books */}
        <Section id="trending-books" title="Trending Books" icon={TrendingUp} delay={0.24}>
          <BookSection
            books={trendingBooks}
            status={trendingStatus}
            emptyMessage="Trending books will appear here as readers discover and save books."
            onRetry={retryTrending}
          />
        </Section>

        {/* Community Favorites */}
        <Section id="community-favorites" title="Community Favorites" icon={StarIcon} delay={0.3}>
          <BookSection
            books={featuredBooks}
            status={featuredStatus}
            emptyMessage="Community favorites will appear here once books are featured."
            onRetry={retryFeatured}
          />
        </Section>

      </div>
    </div>
  );
}

export default Dashboard;
