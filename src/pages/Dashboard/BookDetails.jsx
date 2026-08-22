import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, BookOpen, Bookmark, BookmarkCheck,
  Download, Star, Languages, Building2, Calendar,
  Hash, FileText, RefreshCw, Wifi, WifiOff,
  AlertCircle, Loader2,
} from 'lucide-react';
import { getBookById, downloadBook } from '../../services/api';
import { useLibrary } from '../../context/LibraryContext';

/* ─────────────────────────────────────────
   Shared easing
───────────────────────────────────────── */
const ease = [0.22, 1, 0.36, 1];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease },
});

/* ─────────────────────────────────────────
   Helpers
───────────────────────────────────────── */
function formatCount(n) {
  if (!n && n !== 0) return null;
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K`;
  return String(n);
}

function formatAuthors(authors) {
  if (!authors) return null;
  const arr = Array.isArray(authors) ? authors : [String(authors)];
  if (arr.length === 0) return null;
  if (arr.length === 1) return arr[0];
  const last = arr[arr.length - 1];
  return arr.slice(0, -1).join(', ') + ' & ' + last;
}

function formatCategories(categories) {
  if (!categories) return [];
  if (Array.isArray(categories)) return categories.filter(Boolean);
  return String(categories).split(',').map((c) => c.trim()).filter(Boolean);
}

function formatDate(raw) {
  if (!raw) return null;
  try {
    return new Date(raw).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  } catch {
    return raw;
  }
}

function titleInitials(title = '') {
  return title.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');
}

/* ─────────────────────────────────────────
   Fallback cover (same style as DashboardBookCard)
───────────────────────────────────────── */
function FallbackCover({ title }) {
  const initials = titleInitials(title);
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-neutral-900 p-6">
      <BookOpen size={36} strokeWidth={1.25} className="text-neutral-600" aria-hidden="true" />
      {initials && (
        <span className="text-[1.4rem] font-bold tracking-tight text-neutral-500">{initials}</span>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   Loading skeleton
───────────────────────────────────────── */
function SkeletonDetail() {
  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[280px_1fr]">
      {/* Cover skeleton */}
      <div className="flex justify-center lg:justify-start">
        <div className="aspect-3/4 w-56 animate-pulse rounded-2xl bg-neutral-100 lg:w-full" />
      </div>
      {/* Info skeleton */}
      <div className="flex flex-col gap-5">
        <div className="flex gap-2">
          <div className="h-5 w-20 animate-pulse rounded-full bg-neutral-100" />
          <div className="h-5 w-16 animate-pulse rounded-full bg-neutral-100" />
        </div>
        <div className="h-9 w-3/4 animate-pulse rounded-lg bg-neutral-100" />
        <div className="h-5 w-1/3 animate-pulse rounded bg-neutral-100" />
        <div className="space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-neutral-100" />
          <div className="h-4 w-full animate-pulse rounded bg-neutral-100" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-neutral-100" />
        </div>
        <div className="flex gap-3 pt-2">
          <div className="h-12 w-36 animate-pulse rounded-full bg-neutral-100" />
          <div className="h-12 w-36 animate-pulse rounded-full bg-neutral-100" />
          <div className="h-12 w-32 animate-pulse rounded-full bg-neutral-100" />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Error / Not-found states
───────────────────────────────────────── */
function ErrorState({ notFound, onRetry, onBack }) {
  return (
    <div className="flex flex-col items-center gap-5 rounded-2xl border border-neutral-200 bg-white px-8 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50">
        <AlertCircle size={24} strokeWidth={1.5} className="text-neutral-400" aria-hidden="true" />
      </div>
      <div className="flex flex-col gap-1.5">
        <p className="text-[1rem] font-bold text-neutral-950">
          {notFound ? 'Book not found.' : "We couldn't load this book."}
        </p>
        <p className="max-w-xs text-[13.5px] leading-relaxed text-neutral-500">
          {notFound
            ? 'This book may have been removed or the link may no longer be available.'
            : 'Something went wrong. Please try again.'}
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-5 py-2.5 text-[13.5px] font-medium text-neutral-600 transition hover:border-neutral-400 hover:text-neutral-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          Back to Explore
        </button>
        {!notFound && onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 rounded-full bg-neutral-950 px-5 py-2.5 text-[13.5px] font-medium text-white transition hover:bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
          >
            <RefreshCw size={13} aria-hidden="true" />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   One metadata row
───────────────────────────────────────── */
function MetaRow({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-neutral-100 bg-neutral-50 text-neutral-500">
        <Icon size={13} strokeWidth={2} aria-hidden="true" />
      </span>
      <div className="flex flex-col gap-0.5">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400">{label}</span>
        <span className="text-[13.5px] text-neutral-700">{value}</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Save / Unsave button
   Props:
     bookId       — MongoDB _id of the book
     initialSaved — whether the current user has already saved this book
     initialCount — current savesCount from API
     onSave       — context saveBook(bookId, bookObject) — updates shared list
     onRemove     — context removeBook(bookId)           — updates shared list
───────────────────────────────────────── */
function SaveButton({ bookId, initialSaved, initialCount, onSave, onRemove }) {
  const [saved,      setSaved]      = useState(initialSaved);
  const [savesCount, setSavesCount] = useState(initialCount);
  const [saveStatus, setSaveStatus] = useState('idle'); // idle | loading | error
  const [saveError,  setSaveError]  = useState('');

  /* Keep in sync if parent updates initial values */
  useEffect(() => { setSaved(initialSaved);      }, [initialSaved]);
  useEffect(() => { setSavesCount(initialCount); }, [initialCount]);

  async function handleToggle() {
    if (saveStatus === 'loading' || !bookId) return;
    setSaveStatus('loading');
    setSaveError('');
    try {
      if (saved) {
        /* onRemove comes from LibraryContext — updates shared savedBooks list */
        const res = await onRemove(bookId);
        setSaved(false);
        if (res.savesCount !== undefined) setSavesCount(res.savesCount);
        else setSavesCount((c) => Math.max(0, (c ?? 1) - 1));
      } else {
        /* onSave comes from LibraryContext — updates shared savedBooks list */
        const res = await onSave(bookId);
        setSaved(true);
        if (res.savesCount !== undefined) setSavesCount(res.savesCount);
        else setSavesCount((c) => (c ?? 0) + 1);
      }
      setSaveStatus('idle');
    } catch (err) {
      console.error('Save toggle failed:', err);
      setSaveStatus('error');
      setSaveError(
        saved
          ? 'Unable to remove book. Please try again.'
          : 'Unable to save book. Please try again.'
      );
    }
  }

  const isLoading = saveStatus === 'loading';

  return (
    <div className="flex flex-col gap-1.5">
      <motion.button
        type="button"
        onClick={handleToggle}
        disabled={isLoading}
        whileHover={!isLoading ? { scale: 1.02 } : {}}
        whileTap={!isLoading ? { scale: 0.97 } : {}}
        transition={{ duration: 0.18 }}
        className={[
          'inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-semibold shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 disabled:cursor-not-allowed disabled:opacity-60',
          saved
            ? 'border border-neutral-950 bg-neutral-950 text-white hover:bg-neutral-800 hover:border-neutral-800'
            : 'border border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50',
        ].join(' ')}
        aria-label={
          isLoading
            ? saved ? 'Removing from library…' : 'Saving to library…'
            : saved ? 'Remove from library' : 'Save to library'
        }
        aria-pressed={saved}
        aria-busy={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 size={16} strokeWidth={2} className="animate-spin" aria-hidden="true" />
            {saved ? 'Removing…' : 'Saving…'}
          </>
        ) : saved ? (
          <>
            <BookmarkCheck size={16} strokeWidth={2} aria-hidden="true" />
            Saved
          </>
        ) : (
          <>
            <Bookmark size={16} strokeWidth={2} aria-hidden="true" />
            Save Book
          </>
        )}
      </motion.button>

      {saveStatus === 'error' && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[12.5px] text-red-500"
          role="alert"
        >
          {saveError}
          <button
            type="button"
            onClick={() => setSaveStatus('idle')}
            className="ml-2 underline underline-offset-4 transition hover:text-red-700 focus:outline-none"
          >
            Dismiss
          </button>
        </motion.p>
      )}

      {/* Live saves count feedback */}
      {savesCount != null && savesCount > 0 && (
        <p className="text-[12px] text-neutral-400">
          {formatCount(savesCount)} {savesCount === 1 ? 'reader saved this' : 'readers saved this'}
        </p>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   Download button
   Uses the backend proxy so the browser
   receives a same-origin response with
   Content-Disposition: attachment, which
   reliably triggers a file download even
   when pdfUrl is cross-origin (e.g. S3,
   Google Drive, Cloudinary, CDN).
   The HTML `download` attribute is silently
   ignored by browsers for cross-origin URLs.
───────────────────────────────────────── */
function DownloadButton({ bookId, bookTitle }) {
  const [dlStatus, setDlStatus] = useState('idle'); // idle | downloading | error

  /* Sanitise title into a safe filename */
  function safeFilename(title) {
    return (title ?? 'book')
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .slice(0, 80) + '.pdf';
  }

  async function handleDownload() {
    if (dlStatus === 'downloading') return;
    setDlStatus('downloading');
    try {
      const blob = await downloadBook(bookId);
      const url  = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href     = url;
      link.download = safeFilename(bookTitle);
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setDlStatus('idle');
    } catch (err) {
      console.error('Download failed:', err);
      setDlStatus('error');
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <motion.button
        type="button"
        onClick={handleDownload}
        disabled={dlStatus === 'downloading'}
        whileHover={dlStatus !== 'downloading' ? { scale: 1.02 } : {}}
        whileTap={dlStatus !== 'downloading' ? { scale: 0.97 } : {}}
        transition={{ duration: 0.18 }}
        className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-6 py-3 text-[14px] font-semibold text-neutral-700 shadow-sm transition-colors hover:border-neutral-400 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
        aria-label={dlStatus === 'downloading' ? 'Preparing download…' : 'Download book as PDF'}
        aria-busy={dlStatus === 'downloading'}
      >
        {dlStatus === 'downloading' ? (
          <>
            <Loader2 size={16} strokeWidth={2} className="animate-spin" aria-hidden="true" />
            Preparing download…
          </>
        ) : (
          <>
            <Download size={16} strokeWidth={2} aria-hidden="true" />
            Download
          </>
        )}
      </motion.button>

      {dlStatus === 'error' && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[12.5px] text-red-500"
          role="alert"
        >
          Unable to download this book. Please try again.
          <button
            type="button"
            onClick={() => setDlStatus('idle')}
            className="ml-2 underline underline-offset-4 transition hover:text-red-700 focus:outline-none"
          >
            Dismiss
          </button>
        </motion.p>
      )}
    </div>
  );
}
function BookDetails() {
  const { id }   = useParams();
  const navigate = useNavigate();

  /* ── Library state from shared context (no independent fetch) ── */
  const {
    libStatus,
    isSaved:    isBookSaved,
    saveBook:   ctxSaveBook,
    removeBook: ctxRemoveBook,
  } = useLibrary();

  /* isSaved is derived from shared state — recomputed on every render */
  const isSaved     = isBookSaved(id);
  /* libraryReady: true once the shared library fetch has settled */
  const libraryReady = libStatus !== 'loading';

  const [book,   setBook]   = useState(null);
  const [status, setStatus] = useState('loading');

  const goToExplore = () => navigate('/dashboard/explore');

  const fetchBook = useCallback(async () => {
    setStatus('loading');
    setBook(null);
    try {
      const data = await getBookById(id);
      const b = data?.book ?? data;
      setBook(b);
      setStatus('success');
    } catch (err) {
      console.error('BookDetails fetch error:', err);
      if (err.status === 404) setStatus('notfound');
      else setStatus('error');
    }
  }, [id]);

  useEffect(() => {
    fetchBook();
  }, [fetchBook]);

  const authors    = book ? formatAuthors(book.authors)       : null;
  const categories = book ? formatCategories(book.categories) : [];
  const savesLabel = book ? formatCount(book.savesCount)      : null;
  const hasCover   = Boolean(book?.coverImage);
  const hasPdf     = Boolean(book?.pdfUrl);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 sm:px-8 lg:px-10">

      {/* ── Back button ── */}
      <motion.button
        type="button"
        onClick={goToExplore}
        {...fadeUp(0)}
        whileHover={{ x: -2 }}
        transition={{ duration: 0.18 }}
        className="mb-8 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-[13.5px] font-medium text-neutral-600 shadow-[0_1px_4px_rgba(0,0,0,0.05)] transition-all hover:border-neutral-400 hover:text-neutral-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
        aria-label="Back to Explore"
      >
        <ArrowLeft size={14} aria-hidden="true" />
        Back to Explore
      </motion.button>

      {/* ── States ── */}
      {status === 'loading' && <SkeletonDetail />}

      {(status === 'notfound' || status === 'error') && (
        <ErrorState
          notFound={status === 'notfound'}
          onRetry={status === 'error' ? fetchBook : undefined}
          onBack={goToExplore}
        />
      )}

      {/* ── Book content ── */}
      {status === 'success' && book && (
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[260px_1fr] xl:grid-cols-[300px_1fr]">

          {/* ── LEFT — cover ── */}
          <motion.div {...fadeUp(0.04)} className="flex justify-center lg:justify-start">
            <div className="w-56 overflow-hidden rounded-2xl border border-neutral-200 shadow-[0_8px_32px_rgba(0,0,0,0.12)] lg:w-full">
              {hasCover ? (
                <motion.img
                  src={book.coverImage}
                  alt={`Cover of ${book.title}`}
                  loading="lazy"
                  className="aspect-3/4 w-full object-cover"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.35 }}
                />
              ) : (
                <div className="aspect-3/4 w-full">
                  <FallbackCover title={book.title} />
                </div>
              )}
            </div>
          </motion.div>

          {/* ── RIGHT — info ── */}
          <div className="flex flex-col gap-6">

            {/* Top badges row */}
            <motion.div {...fadeUp(0.08)} className="flex flex-wrap items-center gap-2">
              {/* Category badges */}
              {categories.map((cat) => (
                <span key={cat}
                  className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-[11.5px] font-semibold uppercase tracking-widest text-neutral-500">
                  {cat}
                </span>
              ))}

              {/* Community Favorite badge */}
              {book.featured && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-950 px-3 py-1 text-[11.5px] font-semibold text-white">
                  <Star size={10} fill="white" strokeWidth={0} aria-hidden="true" />
                  Community Favorite
                </span>
              )}

              {/* Availability badge */}
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11.5px] font-semibold ${
                hasPdf
                  ? 'border border-neutral-200 bg-white text-neutral-600'
                  : 'border border-neutral-100 bg-neutral-50 text-neutral-400'
              }`}>
                {hasPdf
                  ? <><Wifi size={10} strokeWidth={2} aria-hidden="true" /> Available online</>
                  : <><WifiOff size={10} strokeWidth={2} aria-hidden="true" /> Online reading unavailable</>
                }
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1 {...fadeUp(0.12)}
              className="text-[clamp(1.6rem,3.5vw,2.4rem)] font-bold leading-[1.1] tracking-[-0.02em] text-neutral-950">
              {book.title}
            </motion.h1>

            {/* Authors */}
            {authors && (
              <motion.p {...fadeUp(0.16)}
                className="text-[15px] text-neutral-500">
                By <span className="font-semibold text-neutral-700">{authors}</span>
              </motion.p>
            )}

            {/* Rating + saves */}
            <motion.div {...fadeUp(0.2)} className="flex flex-wrap items-center gap-5">
              {book.rating > 0 && (
                <span className="flex items-center gap-1.5 text-[14px] text-neutral-700">
                  <Star size={14} fill="currentColor" strokeWidth={0} aria-hidden="true" />
                  <span className="font-semibold">{Number(book.rating).toFixed(1)}</span>
                </span>
              )}
              {savesLabel && (
                <span className="flex items-center gap-1.5 text-[13.5px] text-neutral-500">
                  <Bookmark size={13} strokeWidth={2} aria-hidden="true" />
                  Saved by {savesLabel} readers
                </span>
              )}
            </motion.div>

            {/* Description */}
            <motion.div {...fadeUp(0.24)}>
              <p className="mb-2 text-[11.5px] font-semibold uppercase tracking-[0.12em] text-neutral-400">
                About this book
              </p>
              <p className="text-[14.5px] leading-[1.85] text-neutral-600">
                {book.description?.trim()
                  ? book.description
                  : 'No description is available for this book yet.'}
              </p>
            </motion.div>

            {/* Action buttons */}
            <motion.div {...fadeUp(0.3)} className="flex flex-wrap gap-3">
              {/* Read Online — navigates to the dedicated reader page */}
              {hasPdf ? (
                <Link
                  to={`/dashboard/books/${id}/read`}
                  className="inline-flex items-center gap-2 rounded-full bg-neutral-950 px-6 py-3 text-[14px] font-semibold text-white shadow-sm transition hover:bg-black hover:scale-[1.02] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
                  aria-label={`Read ${book.title} online`}
                >
                  <BookOpen size={16} strokeWidth={2} aria-hidden="true" />
                  Read Online
                </Link>
              ) : (
                <button
                  type="button"
                  disabled
                  className="inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-6 py-3 text-[14px] font-semibold text-neutral-400"
                  aria-label="Online reading not available"
                  aria-disabled="true"
                >
                  <BookOpen size={16} strokeWidth={2} aria-hidden="true" />
                  Read Online
                </button>
              )}

              {/* Save Book */}
              {libraryReady ? (
                <SaveButton
                  bookId={id}
                  initialSaved={isSaved}
                  initialCount={book.savesCount ?? 0}
                  onSave={ctxSaveBook}
                  onRemove={ctxRemoveBook}
                />
              ) : (
                /* Skeleton while library state loads */
                <div className="h-12 w-32 animate-pulse rounded-full bg-neutral-100" aria-hidden="true" />
              )}

              {/* Download */}
              {hasPdf ? (
                <DownloadButton bookId={id} bookTitle={book.title} />
              ) : (
                <button
                  type="button"
                  disabled
                  className="inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-neutral-100 bg-neutral-50 px-6 py-3 text-[14px] font-semibold text-neutral-400"
                  aria-disabled="true"
                >
                  <Download size={16} strokeWidth={2} aria-hidden="true" />
                  Download
                </button>
              )}
            </motion.div>

            {/* Not available message */}
            {!hasPdf && (
              <motion.p {...fadeUp(0.34)} className="text-[12.5px] text-neutral-400">
                This book is not available to read online yet.
              </motion.p>
            )}

            {/* Metadata */}
            <motion.div {...fadeUp(0.36)}>
              <div className="rounded-2xl border border-neutral-200 bg-white p-6">
                <p className="mb-4 text-[11.5px] font-semibold uppercase tracking-[0.12em] text-neutral-400">
                  Book Details
                </p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <MetaRow icon={Languages}  label="Language"       value={book.language} />
                  <MetaRow icon={Building2}  label="Publisher"      value={book.publisher} />
                  <MetaRow icon={Calendar}   label="Published"      value={formatDate(book.publishedDate)} />
                  <MetaRow icon={Hash}       label="ISBN"           value={book.isbn} />
                  <MetaRow icon={FileText}   label="Pages"          value={book.pages ? `${book.pages} pages` : null} />
                  <MetaRow icon={BookOpen}   label="Edition"        value={book.edition ? `${book.edition} edition` : null} />
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      )}
    </div>
  );
}

export default BookDetails;
