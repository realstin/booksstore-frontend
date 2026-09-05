import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookMarked, Compass, RefreshCw, X, Loader2, AlertCircle,
  LayoutGrid, List, Bookmark, ArrowRight, Clock,
} from 'lucide-react';
import { getBookmarks } from '../../services/api';
import { useLibrary } from '../../context/LibraryContext';
import { formatLastRead } from '../../utils/readingProgress';
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
          <div className="h-16 w-12 shrink-0 animate-pulse rounded-lg bg-neutral-100" />
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
    if (book._id) navigate(`/books/${book._id}`);
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
      <div className="h-16 w-12 shrink-0 overflow-hidden rounded-lg border border-neutral-100 bg-neutral-100">
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
          'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900',
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

  /* ── Saved books — from shared LibraryContext (no independent fetch) ── */
  const {
    savedBooks: books,
    libStatus:  status,
    removeBook,
    refresh:    fetchLibrary,
  } = useLibrary();

  const [view, setView] = useState(() => prefs.getLibraryView());

  /* ── Bookmarks ── */
  const [bmarks,    setBmarks]    = useState([]);
  const [bmStatus,  setBmStatus]  = useState('loading');

  const fetchBookmarks = useCallback(async () => {
    setBmStatus('loading');
    try {
      const data = await getBookmarks();
      /* Normalise: { bookmarks: [...] } or array */
      const list = Array.isArray(data) ? data : data.bookmarks ?? [];
      /* Sort newest first */
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setBmarks(list);
      setBmStatus('success');
    } catch {
      setBmStatus('error');
    }
  }, []);

  useEffect(() => { fetchBookmarks(); }, [fetchBookmarks]);

  function handleViewChange(v) {
    setView(v);
    prefs.setLibraryView(v);
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
            <EmptyState onExplore={() => navigate('/explore')} />
          )}

          {count > 0 && view === 'grid' && (
            <motion.div layout
              className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              <AnimatePresence mode="popLayout">
                {books.map((book, i) => (
                  <motion.div
                    key={String(book._id)} layout
                    exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.25, ease } }}>
                    <LibraryBookCard book={book} index={i} onRemove={removeBook} />
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
                    onRemove={removeBook}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </>
      )}

      {/* ── Recent Bookmarks ── */}
      <div className="mt-14">
        <motion.div {...fadeUp(0.05)} className="mb-5">
          <div className="flex items-center gap-2 mb-1">
            <Bookmark size={14} strokeWidth={2} className="text-neutral-400" aria-hidden="true" />
            <h2 className="text-[13.5px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
              Recent Bookmarks
            </h2>
          </div>
          <p className="text-[13px] text-neutral-400">
            Jump back to important pages you've marked.
          </p>
        </motion.div>

        {/* Loading */}
        {bmStatus === 'loading' && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-3 rounded-2xl border border-neutral-100 bg-white p-4">
                <div className="h-16 w-12 shrink-0 animate-pulse rounded-lg bg-neutral-100" />
                <div className="flex flex-1 flex-col gap-2 pt-1">
                  <div className="h-4 w-2/3 animate-pulse rounded bg-neutral-100" />
                  <div className="h-3 w-1/3 animate-pulse rounded bg-neutral-100" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-neutral-100" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {bmStatus === 'error' && (
          <motion.div {...fadeUp(0.1)}
            className="flex flex-col items-center gap-4 rounded-2xl border border-neutral-200 bg-white px-6 py-10 text-center">
            <p className="text-[14px] text-neutral-500">We couldn&apos;t load your bookmarks.</p>
            <button type="button" onClick={fetchBookmarks}
              className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-[13px] font-medium text-neutral-600 transition hover:border-neutral-400 hover:text-neutral-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900">
              <RefreshCw size={12} strokeWidth={2} aria-hidden="true" />
              Try Again
            </button>
          </motion.div>
        )}

        {/* Empty */}
        {bmStatus === 'success' && bmarks.length === 0 && (
          <motion.div {...fadeUp(0.1)}
            className="flex flex-col items-center gap-5 rounded-2xl border border-dashed border-neutral-200 bg-white px-8 py-14 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50">
              <Bookmark size={22} strokeWidth={1.5} className="text-neutral-400" aria-hidden="true" />
            </div>
            <div>
              <p className="text-[15px] font-semibold text-neutral-800">No bookmarks yet</p>
              <p className="mt-1 text-[13.5px] text-neutral-400">Bookmark important pages while reading.</p>
            </div>
            <button type="button" onClick={() => navigate('/explore')}
              className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-5 py-2.5 text-[13.5px] font-medium text-neutral-700 transition hover:border-neutral-400 hover:text-neutral-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900">
              <Compass size={14} strokeWidth={2} aria-hidden="true" />
              Explore Books
            </button>
          </motion.div>
        )}

        {/* Bookmark cards */}
        {bmStatus === 'success' && bmarks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease }}
            className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
          >
            {bmarks.map((bm, i) => {
              /* Backend populates book, or stores bookId/book as object */
              const book      = typeof bm.book === 'object' ? bm.book : null;
              const bookId    = book?._id ?? bm.bookId ?? bm.book;
              const title     = book?.title    ?? 'Unknown Book';
              const cover     = book?.coverImage ?? null;
              const authors   = Array.isArray(book?.authors)
                ? book.authors.join(', ')
                : book?.authors ?? null;
              const lastRead  = bm.createdAt ? formatLastRead(new Date(bm.createdAt).getTime()) : null;

              return (
                <motion.div
                  key={bm._id ?? i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.06, ease }}
                  whileHover={{ y: -2, transition: { duration: 0.18 } }}
                  className="group flex cursor-pointer flex-col gap-0 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.04)] transition-shadow hover:border-neutral-300 hover:shadow-[0_6px_20px_rgba(0,0,0,0.08)]"
                  onClick={() => bookId && navigate(`/books/${bookId}/read?page=${bm.page}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && bookId) navigate(`/books/${bookId}/read?page=${bm.page}`); }}
                  aria-label={`Open ${title} at page ${bm.page}`}
                >
                  {/* Top: cover + info */}
                  <div className="flex gap-3 p-4">
                    {/* Cover */}
                    <div className="h-16 w-12 shrink-0 overflow-hidden rounded-lg border border-neutral-100 bg-neutral-100">
                      {cover ? (
                        <img src={cover} alt="" className="h-full w-full object-cover" loading="lazy" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-neutral-900 text-[10px] font-bold text-neutral-500">
                          {title.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>

                    {/* Text */}
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <p className="truncate text-[13.5px] font-bold text-neutral-950 group-hover:text-neutral-700">
                        {title}
                      </p>
                      {authors && (
                        <p className="truncate text-[12px] text-neutral-500">{authors}</p>
                      )}
                      <span className="mt-1 inline-flex w-fit items-center gap-1 rounded-full bg-neutral-950 px-2 py-0.5 text-[11px] font-semibold text-white">
                        <Bookmark size={9} strokeWidth={2.5} aria-hidden="true" />
                        Page {bm.page}
                      </span>
                      {lastRead && (
                        <span className="mt-0.5 flex items-center gap-1 text-[11px] text-neutral-400">
                          <Clock size={10} strokeWidth={2} aria-hidden="true" />
                          {lastRead}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className={`flex items-center justify-between border-t border-neutral-100 px-4 py-2.5 transition-colors ${bookId ? 'group-hover:bg-neutral-50' : ''}`}>
                    <span className="text-[12px] font-medium text-neutral-500">Continue Reading</span>
                    <ArrowRight size={13} strokeWidth={2} className="text-neutral-400 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>

    </div>
  );
}

export default Library;
