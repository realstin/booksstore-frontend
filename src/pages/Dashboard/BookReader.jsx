import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Download, Maximize2, Minimize2,
  AlertCircle, Loader2, RefreshCw, BookOpen,
} from 'lucide-react';
import { getBookById, downloadBook } from '../../services/api';
import bookstoreLogo from '../../assets/bookstorelogo.svg';

/* ─────────────────────────────────────────
   Helpers
───────────────────────────────────────── */
function formatAuthors(authors) {
  if (!authors) return null;
  const arr = Array.isArray(authors) ? authors : [String(authors)];
  if (!arr.length) return null;
  if (arr.length === 1) return arr[0];
  return arr.slice(0, -1).join(', ') + ' & ' + arr[arr.length - 1];
}

function safeFilename(title) {
  return (title ?? 'book')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80) + '.pdf';
}

/* ─────────────────────────────────────────
   Download button (reuses the same pattern
   as BookDetails — calls the backend proxy)
───────────────────────────────────────── */
function ReaderDownloadButton({ bookId, bookTitle }) {
  const [status, setStatus] = useState('idle');

  async function handleDownload() {
    if (status === 'downloading') return;
    setStatus('downloading');
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
      setStatus('idle');
    } catch (err) {
      console.error('Reader download failed:', err);
      setStatus('error');
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleDownload}
        disabled={status === 'downloading'}
        className="inline-flex h-9 items-center gap-2 rounded-full border border-white/20 px-4 text-[13px] font-medium text-white/80 transition hover:border-white/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        aria-label={status === 'downloading' ? 'Downloading…' : 'Download this book'}
        aria-busy={status === 'downloading'}
      >
        {status === 'downloading'
          ? <Loader2 size={14} strokeWidth={2} className="animate-spin" aria-hidden="true" />
          : <Download size={14} strokeWidth={2} aria-hidden="true" />
        }
        <span className="hidden sm:inline">
          {status === 'downloading' ? 'Downloading…' : 'Download'}
        </span>
      </button>
      {status === 'error' && (
        <p className="absolute right-0 top-full mt-1 whitespace-nowrap rounded-lg bg-red-900/80 px-3 py-1.5 text-[11.5px] text-red-200" role="alert">
          Download failed.{' '}
          <button onClick={() => setStatus('idle')} className="underline">Retry</button>
        </p>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   Top reader bar
───────────────────────────────────────── */
function ReaderBar({ book, onBack, isFullscreen, onToggleFullscreen }) {
  const authors = formatAuthors(book?.authors);

  return (
    <div className="flex h-14 flex-shrink-0 items-center justify-between gap-4 bg-neutral-950 px-4 sm:px-6">
      {/* Left — back + logo + title */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          aria-label="Back to book details"
        >
          <ArrowLeft size={18} strokeWidth={2} aria-hidden="true" />
        </button>

        <img src={bookstoreLogo} alt="BookStore" className="h-5 w-5 shrink-0 opacity-70" />

        <div className="min-w-0">
          <p className="truncate text-[13.5px] font-semibold text-white leading-tight">
            {book?.title ?? 'Loading…'}
          </p>
          {authors && (
            <p className="truncate text-[11.5px] text-white/50 leading-tight">{authors}</p>
          )}
        </div>
      </div>

      {/* Right — controls */}
      <div className="flex shrink-0 items-center gap-2">
        {book && book.pdfUrl && (
          <ReaderDownloadButton bookId={book._id} bookTitle={book.title} />
        )}

        {/* Fullscreen toggle — only if browser supports it */}
        {document.fullscreenEnabled && (
          <button
            type="button"
            onClick={onToggleFullscreen}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen
              ? <Minimize2 size={15} strokeWidth={2} aria-hidden="true" />
              : <Maximize2 size={15} strokeWidth={2} aria-hidden="true" />
            }
          </button>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Loading skeleton
───────────────────────────────────────── */
function ReaderSkeleton() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 bg-neutral-900">
      <motion.div
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        className="flex flex-col items-center gap-3"
      >
        <BookOpen size={36} strokeWidth={1.25} className="text-neutral-600" aria-hidden="true" />
        <p className="text-[14px] text-neutral-500">Loading book…</p>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Error state
───────────────────────────────────────── */
function ReaderError({ message, onRetry, onBack }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 bg-neutral-900 px-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-neutral-700 bg-neutral-800">
        <AlertCircle size={26} strokeWidth={1.5} className="text-neutral-500" aria-hidden="true" />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-[1rem] font-bold text-white">
          {message ?? 'Unable to open this book right now.'}
        </p>
        <p className="max-w-xs text-[13.5px] text-neutral-400">
          Please try again or go back to the book details.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-full border border-neutral-700 bg-transparent px-5 py-2.5 text-[13.5px] font-medium text-neutral-300 transition hover:border-neutral-500 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          Back to Book
        </button>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[13.5px] font-semibold text-neutral-950 transition hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
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
   No PDF state
───────────────────────────────────────── */
function NoPdfState({ book, onBack }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 bg-neutral-900 px-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-neutral-700 bg-neutral-800">
        <BookOpen size={26} strokeWidth={1.5} className="text-neutral-500" aria-hidden="true" />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-[1rem] font-bold text-white">
          Online reading isn&apos;t available for this book yet.
        </p>
        <p className="max-w-xs text-[13.5px] text-neutral-400">
          This book doesn&apos;t have an online reading version. You may still be able to download it.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-full border border-neutral-700 px-5 py-2.5 text-[13.5px] font-medium text-neutral-300 transition hover:border-neutral-500 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          Back to Book
        </button>
        {book?._id && book?.pdfUrl && (
          <ReaderDownloadButton bookId={book._id} bookTitle={book.title} />
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   BookReader page
───────────────────────────────────────── */
function BookReader() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [book,   setBook]   = useState(null);
  const [status, setStatus] = useState('loading'); // loading | success | notfound | error
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pdfError,     setPdfError]     = useState(false);

  const goBack = () => navigate(`/dashboard/books/${id}`);

  const fetchBook = useCallback(async () => {
    setStatus('loading');
    setBook(null);
    setPdfError(false);
    try {
      const data = await getBookById(id);
      const b = data?.book ?? data;
      setBook(b);
      setStatus('success');
    } catch (err) {
      console.error('BookReader fetch error:', err);
      setStatus(err.status === 404 ? 'notfound' : 'error');
    }
  }, [id]);

  useEffect(() => { fetchBook(); }, [fetchBook]);

  /* Fullscreen */
  function handleToggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  }

  useEffect(() => {
    function onFsChange() {
      setIsFullscreen(Boolean(document.fullscreenElement));
    }
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const hasPdf = Boolean(book?.pdfUrl);

  /* ── Error / not-found ── */
  if (status === 'notfound') {
    return (
      <div className="flex h-screen flex-col bg-neutral-950" style={{ fontFamily: 'var(--font-sans)' }}>
        <ReaderBar book={null} onBack={goBack} isFullscreen={isFullscreen} onToggleFullscreen={handleToggleFullscreen} />
        <div className="flex-1">
          <ReaderError
            message="Book not found."
            onBack={goBack}
          />
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex h-screen flex-col bg-neutral-950" style={{ fontFamily: 'var(--font-sans)' }}>
        <ReaderBar book={null} onBack={goBack} isFullscreen={isFullscreen} onToggleFullscreen={handleToggleFullscreen} />
        <div className="flex-1">
          <ReaderError
            message="We couldn't load this book."
            onRetry={fetchBook}
            onBack={goBack}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex h-screen flex-col overflow-hidden bg-neutral-950"
      style={{ fontFamily: 'var(--font-sans)' }}
    >
      {/* Top bar */}
      <ReaderBar
        book={book}
        onBack={goBack}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
      />

      {/* Reading area */}
      <div className="relative flex-1 overflow-hidden">
        {status === 'loading' && <ReaderSkeleton />}

        {status === 'success' && !hasPdf && (
          <NoPdfState book={book} onBack={goBack} />
        )}

        {status === 'success' && hasPdf && !pdfError && (
          /*
            We embed the PDF using an <iframe> pointing at the pdfUrl.

            WHY IFRAME (not <embed> or <object>):
            - <iframe> is the most widely supported cross-browser approach.
            - Mobile Chrome and Safari both support PDF rendering inside iframes
              for same-origin or CORS-permissive URLs.
            - If the pdfUrl is a Google Drive link, a Cloudinary URL, or similar,
              the browser will render it natively or show its own PDF viewer.

            IMPORTANT: If pdfUrl is cross-origin and the server doesn't send
            Access-Control-Allow-Origin, the iframe will load but the PDF viewer
            inside will handle it. The user can still scroll and read.
            For downloads we use the backend proxy (downloadBook) to ensure
            same-origin delivery.
          */
          <iframe
            key={book._id}
            src={book.pdfUrl}
            title={`Reading: ${book.title}`}
            className="h-full w-full border-0"
            onError={() => setPdfError(true)}
            aria-label={`PDF reader for ${book.title}`}
          />
        )}

        {status === 'success' && hasPdf && pdfError && (
          <ReaderError
            message="The PDF couldn't be displayed in the reader."
            onRetry={() => { setPdfError(false); }}
            onBack={goBack}
          />
        )}
      </div>
    </div>
  );
}

export default BookReader;
