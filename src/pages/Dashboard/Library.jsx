import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookMarked, Compass, RefreshCw, X, Loader2, AlertCircle,
  LayoutGrid, List,
} from 'lucide-react';
import { getLibrary, removeBook } from '../../services/api';
import { prefs } from '../../utils/preferences';
import DashboardBookCard from '../../components/Dashboard/DashboardBookCard';
import BookCardSkeleton  from '../../components/Dashboard/BookCardSkeleton';

/* ─────────────────────────────────────────
   Shared easing (matches rest of dashboard)
───────────────────────────────────────── */
const ease = [0.22, 1, 0.36, 1];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease },
});

/* ─────────────────────────────────────────
   Skeleton grids
───────────────────────────────────────── */
function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <BookCardSkeleton key={i} />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   List row skeleton
───────────────────────────────────────── */
function SkeletonList() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 rounded-2xl border border-neutral-100 bg-white p-4">
          <div className="h-16 w-12 flex-shrink-0 animate-pulse rounded-lg bg-neutral-100" />
          <div className="flex flex-1 flex-col gap-2">
            <div className="h-4 w-2/3 animate-pulse rounded bg-neutral-100" />
            <div className="h-3.5 w-1/3 animate-pulse rounded bg-neutral-100" />
          </div>
          <div className="h-7 w-7 animate-pulse rounded-full bg-neutral-100" />
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   Empty state
───────────────────────────────────────── */
function EmptyState({ onExplore }) {
  return (
    <motion.div
      {...fadeUp(0.1)}
      className="flex flex-col items-center gap-6 rounded-2xl border border-dashed border-neutral-200 bg-white px-8 py-20 text-center"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
        <BookMarked size={26} strokeWidth={1.5} className="text-neutral-400" aria-hidden="true" />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-[1rem] font-bold text-neutral-950">Your library is empty.</p>
        <p className="max-w-xs text-[14px] leading-relaxed text-neutral-500">
          Save books from Explore and they will appear here in your personal collection.
        </p>
      </div>
      <button
        type="button"
        onClick={onExplore}
        className="inline-flex items-center gap-2 rounded-full bg-neutral-950 px-7 py-3 text-[14px] font-semibold text-white transition hover:bg-black hover:scale-[1.02] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
      >
        <Compass size={15} strokeWidth={2} aria-hidden="true" />
        Explore Books
      </button>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   Error state
───────────────────────────────────────── */
function ErrorState({ onRetry }) {
  return (
    <motion.div
      {...fadeUp(0.1)}
      className="flex flex-col items-center gap-5 rounded-2xl border border-neutral-200 bg-white px-8 py-16 text-center"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50">
        <AlertCircle size={24} strokeWidth={1.5} className="text-neutral-400" aria-hidden="true" />
      </div>
      <div className="flex flex-col gap-1.5">
        <p className="text-[1rem] font-bold text-neutral-950">Unable to load your library.</p>
        <p className="max-w-xs text-[13.5px] leading-relaxed text-neutral-500">
          Something went wrong while fetching your saved books. Please try again.
        </p>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-5 py-2.5 text-[13.5px] font-medium text-neutral-600 transition hover:border-neutral-400 hover:text-neutral-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
      >
        <RefreshCw size={13} strokeWidth={2} aria-hidden="true" />
        Try Again
      </button>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   List-view row for a library book
───────────────────────────────────────── */
function LibraryListRow({ book, onRemove }) {
  const navigate = useNavigate();
  const [removeStatus, setRemoveStatus] = useState('idle');

  const hasCover  = Boolean(book.coverImage);
  const authors   = Array.isArray(book.authors)
    ? book.authors.join(', ')
    : book.authors ?? '';

  function handleRowClick() {
    if (book._id) navigate(`/dashboard/books/${book._id}`);
  }

  async function handleRemove(e) {
    e.stopPropagation();
    if (removeStatus === 'loading') return;
    setRemoveStatus('loading');
    try {
      await removeBook(book._id);
      onRemove(book._id);
    } catch {
      setRemoveStatus('error');
      setTimeout(() => setRemoveStatus('idle'), 3000);
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.2 } }}
      onClick={handleRowClick}
      className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-[0_1px_4px_rgba(0,0,0,0.04)] transition-shadow hover:border-neutral-300 hover:shadow-[0_4px_16px_rgba(0,0,0,0.07)]"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleRowClick(); }}
      aria-label={`Open ${book.title}`}
    >
      {/* Cover thumbnail */}
      <div className="h-16 w-12 flex-shrink-0 overflow-hidden rounded-lg border border-neutral-100 bg-neutral-100">
        {hasCover ? (
          <img src={book.coverImage} alt="" className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-neutral-900 text-[10px] font-bold text-neutral-500">
            {(book.title ?? '').slice(0, 2).toUpperCase()}
          </div>
        )}
      </div>

      {/* Title + author */}
      <div className="flex flex-1 flex-col gap-0.5 min-w-0">
        <p className="truncate text-[14px] font-semibold text-neutral-950 group-hover:text-neutral-700">
          {book.title}
        </p>
        {authors && (
          <p className="truncate text-[12.5px] text-neutral-400">{authors}</p>
        )}
      </div>

      {/* Remove button */}
      <motion.button
        type="button"
        onClick={handleRemove}
        disabled={removeStatus === 'loading'}
        whileHover={removeStatus !== 'loading' ? { scale: 1.1 } : {}}
        whileTap={removeStatus !== 'loading' ? { scale: 0.92 } : {}}
        transition={{ duration: 0.16 }}
        className={[
          'flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900',
          removeStatus === 'error'
            ? 'border-red-200 bg-red-50 text-red-400'
            : 'border-neutral-200 bg-white text-neutral-400 hover:border-neutral-950 hover:bg-neutral-950 hover:text-white',
          removeStatus === 'loading' ? 'cursor-not-allowed opacity-50' : '',
        ].join(' ')}
        aria-label={removeStatus === 'loading' ? 'Removing…' : `Remove ${book.title}`}
      >
        {removeStatus === 'loading'
          ? <Loader2 size={11} strokeWidth={2.5} className="animate-spin" aria-hidden="true" />
          : <X size={11} strokeWidth={2.5} aria-hidden="true" />
        }
      </motion.button>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   LibraryBookCard (grid view wrapper — unchanged)
───────────────────────────────────────── */
function LibraryBookCard({ book, index, onRemove }) {
  const [removeStatus, setRemoveStatus] = useState('idle'); // idle | loading | error

  async function handleRemove(e) {
    e.stopPropagation(); // don't navigate to book details
    if (removeStatus === 'loading') return;
    setRemoveStatus('loading');
    try {
      await removeBook(book._id);
      onRemove(book._id); // tell parent to remove from list
    } catch (err) {
      console.error('Remove failed:', err);
      setRemoveStatus('error');
      /* Auto-reset error after 3 s so user can try again */
      setTimeout(() => setRemoveStatus('idle'), 3000);
    }
  }

  return (
    <div className="relative">
      {/* Existing card handles click → book details */}
      <DashboardBookCard book={book} index={index} />

      {/* Remove button — top-right overlay */}
      <div className="absolute right-2 top-2 z-10">
        <motion.button
          type="button"
          onClick={handleRemove}
          disabled={removeStatus === 'loading'}
          whileHover={removeStatus !== 'loading' ? { scale: 1.1 } : {}}
          whileTap={removeStatus !== 'loading' ? { scale: 0.92 } : {}}
          transition={{ duration: 0.16 }}
          className={[
            'flex h-7 w-7 items-center justify-center rounded-full border text-[11px] font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900',
            removeStatus === 'error'
              ? 'border-red-200 bg-red-50 text-red-500'
              : 'border-neutral-200 bg-white text-neutral-500 shadow-[0_1px_4px_rgba(0,0,0,0.08)] hover:border-neutral-950 hover:bg-neutral-950 hover:text-white',
            removeStatus === 'loading' ? 'cursor-not-allowed opacity-60' : '',
          ].join(' ')}
          aria-label={
            removeStatus === 'loading'
              ? 'Removing…'
              : removeStatus === 'error'
              ? 'Remove failed — click to retry'
              : `Remove ${book.title} from library`
          }
          aria-busy={removeStatus === 'loading'}
        >
          {removeStatus === 'loading' ? (
            <Loader2 size={11} strokeWidth={2.5} className="animate-spin" aria-hidden="true" />
          ) : (
            <X size={11} strokeWidth={2.5} aria-hidden="true" />
          )}
        </motion.button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Library page
───────────────────────────────────────── */
function Library() {
  const navigate = useNavigate();

  const [books,  setBooks]  = useState([]);
  const [status, setStatus] = useState('loading');
  const [view,   setView]   = useState(() => prefs.getLibraryView());

  const fetchLibrary = useCallback(async () => {
    setStatus('loading');
    try {
      const data = await getLibrary();
      const list = Array.isArray(data)
        ? data
        : data.savedBooks ?? data.books ?? [];
      setBooks(list);
      setStatus('success');
    } catch (err) {
      console.error('Library fetch error:', err);
      setStatus('error');
    }
  }, []);

  useEffect(() => { fetchLibrary(); }, [fetchLibrary]);

  function handleViewChange(v) {
    setView(v);
    prefs.setLibraryView(v);
  }

  function handleRemoved(bookId) {
    setBooks((prev) => prev.filter((b) => String(b._id) !== String(bookId)));
  }

  const count      = books.length;
  const countLabel = count === 1 ? '1 book' : `${count} books`;

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 sm:px-8 lg:px-10">

      {/* ── Page header ── */}
      <header className="mb-8">
        <motion.p {...fadeUp(0)}
          className="mb-2 text-[11.5px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
          My Library
        </motion.p>
        <motion.h1 {...fadeUp(0.07)}
          className="mb-3 text-[clamp(1.75rem,3.5vw,2.4rem)] font-bold leading-[1.1] tracking-[-0.02em] text-neutral-950">
          Your saved books, all in one place.
        </motion.h1>
        <motion.p {...fadeUp(0.13)}
          className="max-w-lg text-[1rem] leading-[1.75] text-neutral-500">
          Build your personal reading collection. Every book you save appears
          here so you can return to it at any time.
        </motion.p>
      </header>

      {/* ── Loading ── */}
      {status === 'loading' && (view === 'grid' ? <SkeletonGrid /> : <SkeletonList />)}

      {/* ── Error ── */}
      {status === 'error' && <ErrorState onRetry={fetchLibrary} />}

      {/* ── Success ── */}
      {status === 'success' && (
        <>
          {/* Count + view toggle */}
          {count > 0 && (
            <motion.div {...fadeUp(0.1)}
              className="mb-6 flex items-center justify-between">
              <p className="text-[13px] text-neutral-400">{countLabel}</p>

              {/* View toggle */}
              <div className="flex items-center gap-1 rounded-xl border border-neutral-200 bg-neutral-50 p-1">
                <button
                  type="button"
                  onClick={() => handleViewChange('grid')}
                  aria-pressed={view === 'grid'}
                  aria-label="Grid view"
                  className={[
                    'flex h-7 w-7 items-center justify-center rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900',
                    view === 'grid'
                      ? 'bg-white text-neutral-950 shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
                      : 'text-neutral-400 hover:text-neutral-700',
                  ].join(' ')}
                >
                  <LayoutGrid size={14} strokeWidth={2} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => handleViewChange('list')}
                  aria-pressed={view === 'list'}
                  aria-label="List view"
                  className={[
                    'flex h-7 w-7 items-center justify-center rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900',
                    view === 'list'
                      ? 'bg-white text-neutral-950 shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
                      : 'text-neutral-400 hover:text-neutral-700',
                  ].join(' ')}
                >
                  <List size={14} strokeWidth={2} aria-hidden="true" />
                </button>
              </div>
            </motion.div>
          )}

          {count === 0 && (
            <EmptyState onExplore={() => navigate('/dashboard/explore')} />
          )}

          {count > 0 && view === 'grid' && (
            <motion.div layout
              className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              <AnimatePresence mode="popLayout">
                {books.map((book, i) => (
                  <motion.div
                    key={String(book._id)} layout
                    exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.25, ease } }}>
                    <LibraryBookCard book={book} index={i} onRemove={handleRemoved} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {count > 0 && view === 'list' && (
            <div className="flex flex-col gap-3">
              <AnimatePresence mode="popLayout">
                {books.map((book) => (
                  <LibraryListRow
                    key={String(book._id)}
                    book={book}
                    onRemove={handleRemoved}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </>
      )}

    </div>
  );
}

export default Library;
