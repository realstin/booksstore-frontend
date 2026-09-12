import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Bookmark, BookmarkCheck, Download, Loader2, Star, Wifi, WifiOff } from 'lucide-react';
import { getBook, downloadBook } from '../../services/api';
import { useLibrary } from '../../context/LibraryContext';
import './BookDetails.css';

/* ─────────────────────────────────────────
   Helpers
───────────────────────────────────────── */
function formatAuthors(authors) {
  if (!authors) return '';
  if (Array.isArray(authors)) return authors.join(', ');
  return String(authors);
}

function formatCategories(categories) {
  if (!categories) return [];
  if (Array.isArray(categories)) return categories;
  return String(categories).split(',').map((c) => c.trim()).filter(Boolean);
}

function formatCount(n) {
  if (n == null) return '';
  const num = Number(n);
  if (!Number.isFinite(num)) return '';
  return num.toLocaleString();
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay },
});

function FallbackCover({ title }) {
  return (
    <div className="flex h-full min-h-[300px] items-center justify-center bg-neutral-100 p-8 text-center">
      <span className="text-sm font-semibold text-neutral-400">{title}</span>
    </div>
  );
}

/* ─────────────────────────────────────────
   Save button
───────────────────────────────────────── */
function SaveButton({ bookId, initialSaved, initialCount, onSave, onRemove }) {
  const [saved,      setSaved]      = useState(initialSaved);
  const [savesCount, setSavesCount] = useState(initialCount);
  const [saveStatus, setSaveStatus] = useState('idle');
  const [saveError,  setSaveError]  = useState('');

  useEffect(() => { setSaved(initialSaved); }, [initialSaved]);
  useEffect(() => { setSavesCount(initialCount); }, [initialCount]);

  async function handleToggle() {
    if (saveStatus === 'loading' || !bookId) return;
    setSaveStatus('loading');
    setSaveError('');
    try {
      if (saved) {
        const res = await onRemove(bookId);
        setSaved(false);
        if (res.savesCount !== undefined) setSavesCount(res.savesCount);
        else setSavesCount((c) => Math.max(0, (c ?? 1) - 1));
      } else {
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
    <div className="flex w-[154px] min-w-[154px] shrink-0 flex-col gap-1.5">
      <motion.button
        type="button"
        onClick={handleToggle}
        disabled={isLoading}
        whileHover={!isLoading ? { scale: 1.02 } : {}}
        whileTap={!isLoading ? { scale: 0.97 } : {}}
        transition={{ duration: 0.18 }}
        className="inline-flex w-full min-w-0 items-center justify-center gap-2 rounded-full border border-neutral-300 bg-white px-6 py-3 text-[14px] font-semibold text-neutral-700 shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 disabled:cursor-not-allowed disabled:opacity-60"
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

      {savesCount != null && savesCount > 0 && (
        <p className="whitespace-nowrap text-[12px] text-neutral-400">
          {formatCount(savesCount)} {savesCount === 1 ? 'reader saved this' : 'readers saved this'}
        </p>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   Download button
───────────────────────────────────────── */
function DownloadButton({ bookId, bookTitle }) {
  const [dlStatus, setDlStatus] = useState('idle');

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
      link.href = url;
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
    <div className="flex w-[154px] min-w-[154px] shrink-0 flex-col gap-1.5">
      <motion.button
        type="button"
        onClick={handleDownload}
        disabled={dlStatus === 'downloading'}
        whileHover={dlStatus !== 'downloading' ? { scale: 1.02 } : {}}
        whileTap={dlStatus !== 'downloading' ? { scale: 0.97 } : {}}
        transition={{ duration: 0.18 }}
        className="inline-flex w-full min-w-0 items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-6 py-3 text-[14px] font-semibold text-neutral-700 shadow-sm transition-colors hover:border-neutral-400 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
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
  const { id } = useParams();
  const navigate = useNavigate();
  const { isSaved, saveBook: ctxSaveBook, removeBook: ctxRemoveBook, libStatus } = useLibrary();
  const libraryReady = libStatus === 'success';
  const [book, setBook] = useState(null);
  const [status, setStatus] = useState('loading');

  const fetchBook = useCallback(async () => {
    if (!id) return;
    setStatus('loading');
    try {
      const data = await getBook(id);
      setBook(data.book ?? data);
      setStatus('success');
    } catch (err) {
      console.error('Failed to fetch book:', err);
      setStatus(err?.response?.status === 404 ? 'notfound' : 'error');
    }
  }, [id]);

  useEffect(() => { fetchBook(); }, [fetchBook]);

  const authors = book ? formatAuthors(book.authors) : null;
  const categories = book ? formatCategories(book.categories) : [];
  const savesLabel = book ? formatCount(book.savesCount) : null;
  const hasCover = Boolean(book?.coverImage);
  const hasPdf = Boolean(book?.pdfUrl);

  const goToExplore = () => navigate('/explore');

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 sm:px-8 lg:px-10">
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

      {status === 'loading' && <div className="h-80 animate-pulse rounded-2xl bg-neutral-50" />}

      {(status === 'notfound' || status === 'error') && (
        <div className="rounded-2xl border border-neutral-200 bg-white p-8">
          <p className="text-sm text-neutral-500">
            {status === 'notfound' ? 'Book not found.' : 'Unable to load this book.'}
          </p>
          {status === 'error' && (
            <button type="button" onClick={fetchBook} className="mt-4 rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-semibold text-white">
              Try again
            </button>
          )}
        </div>
      )}

      {status === 'success' && book && (
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[260px_1fr] xl:grid-cols-[300px_1fr]">
          <motion.div {...fadeUp(0.04)} className="flex justify-center lg:justify-start">
            <div className="w-56 overflow-hidden rounded-2xl border border-neutral-200 shadow-[0_8px_32px_rgba(0,0,0,0.12)] lg:w-full">
              {hasCover ? (
                <motion.img src={book.coverImage} alt={`Cover of ${book.title}`} loading="lazy" className="aspect-3/4 w-full object-cover" whileHover={{ scale: 1.03 }} transition={{ duration: 0.35 }} />
              ) : (
                <div className="aspect-3/4 w-full"><FallbackCover title={book.title} /></div>
              )}
            </div>
          </motion.div>

          <div className="flex flex-col gap-6">
            <motion.div {...fadeUp(0.08)} className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => (
                <span key={cat} className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-[11.5px] font-semibold uppercase tracking-widest text-neutral-500">{cat}</span>
              ))}
              {book.featured && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-950 px-3 py-1 text-[11.5px] font-semibold text-white"><Star size={10} fill="white" strokeWidth={0} aria-hidden="true" />Community Favorite</span>
              )}
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11.5px] font-semibold ${hasPdf ? 'border border-neutral-200 bg-white text-neutral-600' : 'border border-neutral-100 bg-neutral-50 text-neutral-400'}`}>
                {hasPdf ? <><Wifi size={10} strokeWidth={2} aria-hidden="true" /> Available online</> : <><WifiOff size={10} strokeWidth={2} aria-hidden="true" /> Online reading unavailable</>}
              </span>
            </motion.div>

            <motion.h1 {...fadeUp(0.12)} className="text-[clamp(1.6rem,3.5vw,2.4rem)] font-bold leading-[1.1] tracking-[-0.02em] text-neutral-950">{book.title}</motion.h1>

            {authors && <motion.p {...fadeUp(0.16)} className="text-[15px] text-neutral-500">By <span className="font-semibold text-neutral-700">{authors}</span></motion.p>}

            <motion.div {...fadeUp(0.2)} className="flex flex-wrap items-center gap-5">
              {book.rating > 0 && <span className="flex items-center gap-1.5 text-[14px] text-neutral-700"><Star size={14} fill="currentColor" strokeWidth={0} aria-hidden="true" /><span className="font-semibold">{Number(book.rating).toFixed(1)}</span></span>}
              {savesLabel && <span className="flex items-center gap-1.5 text-[13.5px] text-neutral-500"><Bookmark size={13} strokeWidth={2} aria-hidden="true" />Saved by {savesLabel} readers</span>}
            </motion.div>

            <motion.div {...fadeUp(0.24)}>
              <p className="mb-2 text-[11.5px] font-semibold uppercase tracking-[0.12em] text-neutral-400">About this book</p>
              <p className="text-[14.5px] leading-[1.85] text-neutral-600">{book.description?.trim() ? book.description : 'No description is available for this book yet.'}</p>
            </motion.div>

            <motion.div {...fadeUp(0.3)} id="b6z9gh" className="flex flex-wrap gap-3">
              {hasPdf ? (
                <Link to={`/books/${id}/read`} className="inline-flex w-[154px] min-w-[154px] shrink-0 items-center justify-center gap-2 rounded-full bg-neutral-950 px-6 py-3 text-[14px] font-semibold text-white shadow-sm transition hover:bg-black hover:scale-[1.02] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900" aria-label={`Read ${book.title} online`}>
                  <BookOpen size={16} strokeWidth={2} aria-hidden="true" />Read Online
                </Link>
              ) : (
                <button type="button" disabled className="inline-flex w-[154px] min-w-[154px] shrink-0 cursor-not-allowed items-center justify-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-6 py-3 text-[14px] font-semibold text-neutral-400" aria-label="Online reading not available" aria-disabled="true">
                  <BookOpen size={16} strokeWidth={2} aria-hidden="true" />Read Online
                </button>
              )}

              {libraryReady ? (
                <SaveButton bookId={id} initialSaved={isSaved(id)} initialCount={book.savesCount ?? 0} onSave={ctxSaveBook} onRemove={ctxRemoveBook} />
              ) : (
                <div className="h-12 w-[154px] min-w-[154px] shrink-0 animate-pulse rounded-full bg-neutral-100" aria-hidden="true" />
              )}

              {hasPdf ? (
                <DownloadButton bookId={id} bookTitle={book.title} />
              ) : (
                <button type="button" disabled className="inline-flex w-[154px] min-w-[154px] shrink-0 cursor-not-allowed items-center justify-center gap-2 rounded-full border border-neutral-100 bg-neutral-50 px-6 py-3 text-[14px] font-semibold text-neutral-400" aria-disabled="true">
                  <Download size={16} strokeWidth={2} aria-hidden="true" />Download
                </button>
              )}
            </motion.div>

            {!hasPdf && <motion.p {...fadeUp(0.34)} className="text-[12.5px] text-neutral-400">This book is not available to read online yet.</motion.p>}

            <motion.div {...fadeUp(0.36)}>
              <div className="rounded-2xl border border-neutral-200 bg-white p-6">
                <p className="mb-4 text-[11.5px] font-semibold uppercase tracking-[0.12em] text-neutral-400">Book Details</p>
                <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {book.publisher && <div><dt className="text-xs text-neutral-400">Publisher</dt><dd className="mt-1 text-sm text-neutral-700">{book.publisher}</dd></div>}
                  {book.publishedDate && <div><dt className="text-xs text-neutral-400">Published</dt><dd className="mt-1 text-sm text-neutral-700">{book.publishedDate}</dd></div>}
                  {book.pages && <div><dt className="text-xs text-neutral-400">Pages</dt><dd className="mt-1 text-sm text-neutral-700">{book.pages}</dd></div>}
                  {categories.length > 0 && <div><dt className="text-xs text-neutral-400">Categories</dt><dd className="mt-1 text-sm text-neutral-700">{categories.join(', ')}</dd></div>}
                </dl>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookDetails;
