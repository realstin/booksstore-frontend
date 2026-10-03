/**
 * BookReaderV2 — Scroll-based PDF reader built on PDF.js (react-pdf)
 *
 * HOW TO ACCESS
 *   /books/:id/read?v=2   → this component
 *   /books/:id/read       → original BookReader (iframe)
 *
 * FEATURES
 *   - Continuous scroll — all pages in one column, natural reading
 *   - Virtual rendering — only pages near the viewport are painted (fast on big books)
 *   - Page panel — slide-in sidebar with page thumbnails, click any to jump
 *   - Progress scrubber in mini-bar — drag or click to jump anywhere in the book
 *   - Auto-hiding top toolbar
 *   - Always-visible bottom mini-bar: prev / page input / scrubber / next / zoom
 *   - Zoom 50–200 % (Ctrl +/-)
 *   - Theme: Dark / Light / Sepia
 *   - Fullscreen
 *   - Reading progress saved & restored
 *   - Download via backend proxy
 *   - Text layer ON — text is selectable (AI slot ready)
 */

import {
  useState, useEffect, useCallback, useRef, useMemo,
} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Document, Page, pdfjs } from 'react-pdf';
import {
  ArrowLeft, Download, Maximize2, Minimize2,
  ZoomIn, ZoomOut, Sun, Moon, BookText,
  Loader2, AlertCircle, RefreshCw, BookOpen,
  ChevronLeft, ChevronRight, LayoutGrid,
} from 'lucide-react';
import { getBookById, downloadBook } from '../../services/api';
import {
  recordBookOpened,
  updateReadingPage,
  getSavedPage,
} from '../../utils/readingProgress';

import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

const API_URL = import.meta.env.VITE_API_URL;

/* ─────────────────────────────────────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────────────────────────────────────── */

const ZOOM_MIN       = 50;
const ZOOM_MAX       = 200;
const ZOOM_STEP      = 10;
const ZOOM_DEFAULT   = 100;
const PREF_KEY       = 'bookstore_reader_v2_prefs';
// How many pages before/after the viewport to keep rendered (virtualization window)
const RENDER_BUFFER  = 3;

/* ─────────────────────────────────────────────────────────────────────────────
   THEME TOKENS
───────────────────────────────────────────────────────────────────────────── */

const THEMES = {
  dark: {
    bg:       'bg-[#121212]',
    bar:      'bg-[#1c1c1c]/96 border-b border-white/[0.06]',
    minibar:  'bg-[#1c1c1c]/96 border-t border-white/[0.06]',
    panel:    'bg-[#1c1c1c] border-l border-white/[0.07]',
    text:     'text-white',
    muted:    'text-white/40',
    icon:     'text-white/60 hover:text-white hover:bg-white/[0.08] active:bg-white/[0.14]',
    input:    'border-white/[0.12] bg-white/[0.07] text-white focus:border-white/30',
    thumb:    'bg-neutral-800 hover:bg-neutral-700',
    thumbAct: 'ring-2 ring-white',
    scrubBg:  'bg-white/[0.10]',
    scrubFg:  'bg-white',
    seg: {
      wrap:   'bg-white/[0.06]',
      active: 'bg-white/[0.16] text-white',
      idle:   'text-white/50 hover:text-white',
    },
  },
  light: {
    bg:       'bg-neutral-50',
    bar:      'bg-white/96 border-b border-neutral-200',
    minibar:  'bg-white/96 border-t border-neutral-200',
    panel:    'bg-white border-l border-neutral-200',
    text:     'text-neutral-900',
    muted:    'text-neutral-400',
    icon:     'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 active:bg-neutral-200',
    input:    'border-neutral-300 bg-white text-neutral-900 focus:border-neutral-500',
    thumb:    'bg-neutral-100 hover:bg-neutral-200',
    thumbAct: 'ring-2 ring-neutral-900',
    scrubBg:  'bg-neutral-200',
    scrubFg:  'bg-neutral-900',
    seg: {
      wrap:   'bg-neutral-100',
      active: 'bg-white text-neutral-900 shadow-sm',
      idle:   'text-neutral-500 hover:text-neutral-800',
    },
  },
  sepia: {
    bg:       'bg-[#f0e8d5]',
    bar:      'bg-[#f5efe0]/96 border-b border-[#d9c9a8]',
    minibar:  'bg-[#f5efe0]/96 border-t border-[#d9c9a8]',
    panel:    'bg-[#f5efe0] border-l border-[#d9c9a8]',
    text:     'text-[#3d2b1f]',
    muted:    'text-[#b09070]',
    icon:     'text-[#8a6340] hover:text-[#3d2b1f] hover:bg-[#e8dcc0] active:bg-[#ddd0b0]',
    input:    'border-[#c4a87a] bg-[#ede0c8] text-[#3d2b1f] focus:border-[#a07848]',
    thumb:    'bg-[#e8dcc0] hover:bg-[#ddd0b0]',
    thumbAct: 'ring-2 ring-[#7a5030]',
    scrubBg:  'bg-[#d9c9a8]',
    scrubFg:  'bg-[#7a5030]',
    seg: {
      wrap:   'bg-[#e8dcc0]',
      active: 'bg-[#f5efe0] text-[#3d2b1f] shadow-sm',
      idle:   'text-[#8a6340] hover:text-[#3d2b1f]',
    },
  },
};

const THEME_OPTIONS = [
  { value: 'dark',  label: 'Dark',  Icon: Moon     },
  { value: 'light', label: 'Light', Icon: Sun      },
  { value: 'sepia', label: 'Sepia', Icon: BookText },
];

/* ─────────────────────────────────────────────────────────────────────────────
   PREFERENCES
───────────────────────────────────────────────────────────────────────────── */

function loadPrefs() {
  try {
    const raw = localStorage.getItem(PREF_KEY);
    return raw
      ? { zoom: ZOOM_DEFAULT, theme: 'dark', ...JSON.parse(raw) }
      : { zoom: ZOOM_DEFAULT, theme: 'dark' };
  } catch { return { zoom: ZOOM_DEFAULT, theme: 'dark' }; }
}
function persistPrefs(p) {
  try { localStorage.setItem(PREF_KEY, JSON.stringify(p)); } catch { /* ignore */ }
}

/* ─────────────────────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────────────────────── */

function safeFilename(title) {
  return (title ?? 'book')
    .toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim()
    .replace(/\s+/g, '-').slice(0, 80) + '.pdf';
}

function calcPageWidth(zoom) {
  return Math.round(Math.min(860, window.innerWidth - 32) * (zoom / 100));
}

/* ─────────────────────────────────────────────────────────────────────────────
   UI ATOMS
───────────────────────────────────────────────────────────────────────────── */

function Spinner({ small }) {
  return (
    <div
      className={`animate-spin rounded-full border-neutral-600 border-t-neutral-300
        ${small ? 'h-4 w-4 border' : 'h-6 w-6 border-2'}`}
      aria-label="Loading…"
    />
  );
}

function IconBtn({ onClick, label, disabled, active, tc, children }) {
  return (
    <button
      type="button" onClick={onClick} disabled={disabled} aria-label={label}
      className={[
        'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
        'transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-current',
        'disabled:opacity-30 disabled:cursor-not-allowed',
        active ? 'bg-white/10' : '',
        tc.icon,
      ].join(' ')}
    >
      {children}
    </button>
  );
}

function ThemeSeg({ value, onChange, tc }) {
  return (
    <div className={`flex items-center gap-0.5 rounded-xl p-1 ${tc.seg.wrap}`} role="group" aria-label="Reader theme">
      {THEME_OPTIONS.map(({ value: v, label, Icon }) => (
        <button
          key={v} type="button" onClick={() => onChange(v)}
          aria-pressed={value === v} aria-label={`${label} theme`}
          className={[
            'flex h-7 items-center gap-1.5 rounded-lg px-2.5 text-[12px] font-medium',
            'transition-all duration-150 focus:outline-none',
            value === v ? tc.seg.active : tc.seg.idle,
          ].join(' ')}
        >
          <Icon size={12} strokeWidth={2} aria-hidden="true" />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   DOWNLOAD BUTTON
───────────────────────────────────────────────────────────────────────────── */

function DownloadBtn({ bookId, bookTitle, tc }) {
  const [busy, setBusy] = useState(false);
  async function handle() {
    if (busy) return;
    setBusy(true);
    try {
      const blob = await downloadBook(bookId);
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href = url; a.download = safeFilename(bookTitle);
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
    } finally { setBusy(false); }
  }
  return (
    <IconBtn onClick={handle} label={busy ? 'Downloading…' : 'Download PDF'} disabled={busy} tc={tc}>
      {busy ? <Loader2 size={15} strokeWidth={2} className="animate-spin" /> : <Download size={15} strokeWidth={2} />}
    </IconBtn>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PAGE PANEL  — slide-in sidebar with page tiles
───────────────────────────────────────────────────────────────────────────── */

function PagePanel({ open, numPages, currentPage, onJump, pdfUrl, tc }) {
  const panelRef     = useRef(null);
  const activeRef    = useRef(null);

  // Scroll the active tile into view whenever the panel opens or page changes
  useEffect(() => {
    if (open && activeRef.current) {
      activeRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [open, currentPage]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="page-panel"
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0,      opacity: 1 }}
          exit={{   x: '100%', opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className={[
            'absolute right-0 top-0 z-30 h-full w-52 overflow-y-auto',
            'flex flex-col gap-0 py-3',
            'backdrop-blur-md transition-colors duration-300',
            tc.panel,
          ].join(' ')}
          aria-label="Page panel"
          ref={panelRef}
        >
          <p className={`mb-2 px-3 text-[11px] font-semibold uppercase tracking-widest ${tc.muted}`}>
            Pages
          </p>

          {Array.from({ length: numPages }, (_, i) => {
            const pg  = i + 1;
            const act = pg === currentPage;
            return (
              <button
                key={pg}
                ref={act ? activeRef : null}
                type="button"
                onClick={() => onJump(pg)}
                aria-label={`Go to page ${pg}`}
                aria-current={act ? 'page' : undefined}
                className={[
                  'mx-2 mb-1 flex items-center gap-2.5 rounded-xl px-2 py-2',
                  'transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-current',
                  act ? `${tc.thumb} ${tc.thumbAct}` : tc.thumb,
                ].join(' ')}
              >
                {/* Thumbnail placeholder — tiny PDF.js render */}
                <div className="h-14 w-10 shrink-0 overflow-hidden rounded-md bg-neutral-700">
                  <Document file={{ url: pdfUrl, withCredentials: true }} loading={null} error={null}>
                    <Page
                      pageNumber={pg}
                      width={40}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      loading={<div className="h-14 w-10 bg-neutral-800" />}
                      error={<div className="h-14 w-10 bg-neutral-800" />}
                    />
                  </Document>
                </div>

                <span className={`text-[12px] font-semibold tabular-nums ${act ? tc.text : tc.muted}`}>
                  {pg}
                </span>
              </button>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   TOP TOOLBAR
───────────────────────────────────────────────────────────────────────────── */

function Toolbar({
  book, visible, currentPage, numPages,
  zoom, onZoomIn, onZoomOut, onZoomReset,
  theme, onThemeChange,
  showPanel, onTogglePanel,
  isFullscreen, onFullscreen,
  tc,
}) {
  return (
    <motion.div
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : -6 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      aria-hidden={!visible}
      className={[
        'sticky top-0 z-20 flex shrink-0 items-center gap-2 px-3 sm:px-4',
        'backdrop-blur-md transition-colors duration-300',
        tc.bar,
      ].join(' ')}
      style={{ height: '52px' }}
    >
      {/* Left: back + title */}
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <IconBtn onClick={() => history.back()} label="Back to book details" tc={tc}>
          <ArrowLeft size={16} strokeWidth={2.2} />
        </IconBtn>
        <div className="hidden min-w-0 sm:block">
          <p className={`truncate text-[13px] font-semibold ${tc.text}`} style={{ maxWidth: '200px' }}>
            {book?.title ?? ''}
          </p>
          {numPages !== null && (
            <p className={`text-[11px] ${tc.muted}`}>Page {currentPage} of {numPages}</p>
          )}
        </div>
      </div>

      {/* Right controls */}
      <div className="flex shrink-0 items-center gap-1">

        {/* Zoom (desktop) */}
        <div className="hidden items-center gap-0.5 sm:flex">
          <IconBtn onClick={onZoomOut} label="Zoom out" disabled={zoom <= ZOOM_MIN} tc={tc}>
            <ZoomOut size={14} strokeWidth={2} />
          </IconBtn>
          <button
            type="button" onClick={onZoomReset}
            aria-label={`Zoom ${zoom}%. Click to reset.`}
            className={`min-w-[2.8rem] rounded-lg px-2 py-1 text-[12px] font-semibold tabular-nums transition focus:outline-none ${tc.icon}`}
          >
            {zoom}%
          </button>
          <IconBtn onClick={onZoomIn} label="Zoom in" disabled={zoom >= ZOOM_MAX} tc={tc}>
            <ZoomIn size={14} strokeWidth={2} />
          </IconBtn>
        </div>

        {/* Theme */}
        <ThemeSeg value={theme} onChange={onThemeChange} tc={tc} />

        {/* Download */}
        {book?._id && book?.pdfUrl && (
          <DownloadBtn bookId={book._id} bookTitle={book.title} tc={tc} />
        )}

        {/* Page panel toggle */}
        {numPages !== null && (
          <IconBtn onClick={onTogglePanel} label={showPanel ? 'Close page panel' : 'Open page panel'} active={showPanel} tc={tc}>
            <LayoutGrid size={15} strokeWidth={2} />
          </IconBtn>
        )}

        {/* Fullscreen */}
        {document.fullscreenEnabled && (
          <IconBtn onClick={onFullscreen} label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'} tc={tc}>
            {isFullscreen ? <Minimize2 size={14} strokeWidth={2} /> : <Maximize2 size={14} strokeWidth={2} />}
          </IconBtn>
        )}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   BOTTOM MINI-BAR
   prev | page-input / total | progress scrubber | next | zoom (mobile)
───────────────────────────────────────────────────────────────────────────── */

function MiniBar({
  currentPage, numPages, onScrollToPage,
  zoom, onZoomIn, onZoomOut,
  pageInputVal, onPageInputChange, onPageInputCommit,
  tc,
}) {
  if (numPages === null) return null;

  const pct = numPages > 1 ? ((currentPage - 1) / (numPages - 1)) * 100 : 100;

  function handleScrubClick(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const page  = Math.round(ratio * (numPages - 1)) + 1;
    onScrollToPage(page);
  }

  return (
    <div
      className={[
        'sticky bottom-0 z-20 flex items-center gap-2 px-3 py-2',
        'backdrop-blur-md transition-colors duration-300',
        tc.minibar,
      ].join(' ')}
    >
      {/* Prev */}
      <button
        type="button" onClick={() => onScrollToPage(currentPage - 1)}
        disabled={currentPage <= 1} aria-label="Previous page"
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition focus:outline-none disabled:opacity-25 ${tc.icon}`}
      >
        <ChevronLeft size={16} strokeWidth={2.2} />
      </button>

      {/* Page input */}
      <div className="flex shrink-0 items-center gap-1">
        <input
          type="number" min={1} max={numPages}
          value={pageInputVal}
          onChange={onPageInputChange}
          onBlur={onPageInputCommit}
          onKeyDown={(e) => { if (e.key === 'Enter') onPageInputCommit(e); }}
          aria-label="Jump to page"
          className={[
            'w-11 rounded-lg border px-1 py-0.5 text-center text-[12px] font-semibold',
            'outline-none transition focus-visible:ring-2 focus-visible:ring-current',
            'appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
            tc.input,
          ].join(' ')}
        />
        <span className={`text-[12px] ${tc.muted}`}>/ {numPages}</span>
      </div>

      {/* Progress scrubber — clickable + shows progress fill */}
      <div
        className={`relative mx-1 h-1.5 flex-1 cursor-pointer rounded-full ${tc.scrubBg}`}
        onClick={handleScrubClick}
        role="slider"
        aria-label="Reading progress"
        aria-valuenow={currentPage}
        aria-valuemin={1}
        aria-valuemax={numPages}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft')  onScrollToPage(currentPage - 1);
          if (e.key === 'ArrowRight') onScrollToPage(currentPage + 1);
        }}
      >
        <div
          className={`h-full rounded-full transition-all duration-300 ${tc.scrubFg}`}
          style={{ width: `${pct}%` }}
        />
        {/* Scrubber thumb dot */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full shadow-md transition-all duration-300 ${tc.scrubFg}`}
          style={{ left: `calc(${pct}% - 6px)` }}
        />
      </div>

      {/* Next */}
      <button
        type="button" onClick={() => onScrollToPage(currentPage + 1)}
        disabled={currentPage >= numPages} aria-label="Next page"
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition focus:outline-none disabled:opacity-25 ${tc.icon}`}
      >
        <ChevronRight size={16} strokeWidth={2.2} />
      </button>

      {/* Zoom — visible on mobile only */}
      <div className="flex items-center gap-0.5 sm:hidden">
        <button
          type="button" onClick={onZoomOut} disabled={zoom <= ZOOM_MIN}
          aria-label="Zoom out"
          className={`flex h-7 w-7 items-center justify-center rounded-full transition ${tc.icon} disabled:opacity-25`}
        >
          <ZoomOut size={13} strokeWidth={2} />
        </button>
        <span className={`w-9 text-center text-[11px] font-semibold tabular-nums ${tc.muted}`}>{zoom}%</span>
        <button
          type="button" onClick={onZoomIn} disabled={zoom >= ZOOM_MAX}
          aria-label="Zoom in"
          className={`flex h-7 w-7 items-center justify-center rounded-full transition ${tc.icon} disabled:opacity-25`}
        >
          <ZoomIn size={13} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ERROR / EMPTY SCREENS
───────────────────────────────────────────────────────────────────────────── */

function CenteredStatus({ children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#121212] px-6">
      <div className="flex max-w-sm flex-col items-center gap-5 text-center">{children}</div>
    </div>
  );
}

function BookLoadError({ message, onRetry, onBack }) {
  return (
    <CenteredStatus>
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-neutral-700 bg-neutral-800">
        <AlertCircle size={24} strokeWidth={1.5} className="text-neutral-500" />
      </div>
      <p className="text-[1rem] font-bold text-white">{message}</p>
      <div className="flex flex-wrap justify-center gap-3">
        <button type="button" onClick={onBack}
          className="inline-flex items-center gap-2 rounded-full border border-neutral-700 px-5 py-2.5 text-[13px] font-medium text-neutral-300 transition hover:border-neutral-500 hover:text-white focus:outline-none">
          <ArrowLeft size={13} /> Back
        </button>
        {onRetry && (
          <button type="button" onClick={onRetry}
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[13px] font-semibold text-neutral-950 transition hover:bg-neutral-100 focus:outline-none">
            <RefreshCw size={13} /> Try Again
          </button>
        )}
      </div>
    </CenteredStatus>
  );
}

function NoPdfMessage({ onBack }) {
  return (
    <CenteredStatus>
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-neutral-700 bg-neutral-800">
        <BookOpen size={24} strokeWidth={1.5} className="text-neutral-500" />
      </div>
      <p className="text-[1rem] font-bold text-white">No reading version available.</p>
      <p className="text-[13px] text-neutral-400">This book doesn&apos;t have an online reading version yet.</p>
      <button type="button" onClick={onBack}
        className="inline-flex items-center gap-2 rounded-full border border-neutral-700 px-5 py-2.5 text-[13px] font-medium text-neutral-300 transition hover:border-neutral-500 hover:text-white focus:outline-none">
        <ArrowLeft size={13} /> Back to Book
      </button>
    </CenteredStatus>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────────────────── */

function BookReaderV2() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const goBack   = useCallback(() => navigate(`/books/${id}`), [navigate, id]);

  /* ── Prefs ── */
  const [prefs, setPrefsState] = useState(loadPrefs);
  function updatePref(key, value) {
    setPrefsState((p) => { const next = { ...p, [key]: value }; persistPrefs(next); return next; });
  }
  const tc = THEMES[prefs.theme] ?? THEMES.dark;

  /* ── Book ── */
  const [book,       setBook]       = useState(null);
  const [bookStatus, setBookStatus] = useState('loading');

  const fetchBook = useCallback(async () => {
    setBookStatus('loading'); setBook(null);
    try {
      const data = await getBookById(id);
      const b    = data?.book ?? data;
      setBook(b); setBookStatus('success');
      recordBookOpened(b);
    } catch (err) {
      setBookStatus(err.status === 404 ? 'notfound' : 'error');
    }
  }, [id]);

  useEffect(() => { fetchBook(); }, [fetchBook]);

  /* ── PDF state ── */
  const [numPages,  setNumPages]  = useState(null);
  const [pdfStatus, setPdfStatus] = useState('idle');
  const [pdfError,  setPdfError]  = useState(null);

  /* ── Page tracking via IntersectionObserver ── */
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInputVal, setPageInputVal] = useState('1');
  const pageRefs     = useRef({});
  const scrollAreaRef = useRef(null);
  const observerRef  = useRef(null);
  const ratiosRef    = useRef({});   // stable map: page → intersectionRatio

  // Keep pageInputVal in sync with currentPage when scrolling
  useEffect(() => { setPageInputVal(String(currentPage)); }, [currentPage]);

  useEffect(() => {
    if (numPages === null) return;
    observerRef.current?.disconnect();
    ratiosRef.current = {};

    observerRef.current = new IntersectionObserver(
      (obs) => {
        obs.forEach((entry) => {
          ratiosRef.current[Number(entry.target.dataset.page)] = entry.intersectionRatio;
        });
        const entries = Object.entries(ratiosRef.current);
        if (!entries.length) return;
        const [bestPage] = entries.sort((a, b) => b[1] - a[1])[0];
        const n = Number(bestPage);
        if (n >= 1) setCurrentPage(n);
      },
      { root: scrollAreaRef.current, threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] }
    );

    Object.values(pageRefs.current).forEach((el) => {
      if (el) observerRef.current.observe(el);
    });
    return () => observerRef.current?.disconnect();
  }, [numPages]);

  /* ── Reading progress ── */
  const progressTimer = useRef(null);
  useEffect(() => {
    if (!book?._id || currentPage < 1) return;
    clearTimeout(progressTimer.current);
    progressTimer.current = setTimeout(() => {
      updateReadingPage(book._id, currentPage, numPages ?? book?.pages ?? null);
    }, 800);
    return () => clearTimeout(progressTimer.current);
  }, [currentPage, book, numPages]);

  useEffect(() => {
    return () => {
      clearTimeout(progressTimer.current);
      if (book?._id && currentPage > 0)
        updateReadingPage(book._id, currentPage, numPages ?? book?.pages ?? null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [book, currentPage, numPages]);

  /* ── Restore saved page ── */
  const [resumeToast, setResumeToast] = useState(null);
  useEffect(() => {
    if (pdfStatus !== 'success' || numPages === null) return;
    const saved = getSavedPage(id);
    if (saved > 1) {
      const t = setTimeout(() => {
        scrollToPage(saved);
        setResumeToast(saved);
        setTimeout(() => setResumeToast(null), 3000);
      }, 400);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdfStatus, numPages]);

  /* ── Scroll to page ── */
  function scrollToPage(page) {
    const clamped = Math.max(1, Math.min(numPages ?? 1, page));
    const el = pageRefs.current[clamped];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ── Page input handlers ── */
  function handlePageInputChange(e) { setPageInputVal(e.target.value); }
  function handlePageInputCommit(e) {
    const n = parseInt(e.target.value, 10);
    if (!isNaN(n) && n >= 1) scrollToPage(n);
    else setPageInputVal(String(currentPage));
  }

  /* ── Virtual rendering — only paint pages near viewport ── */
  const visiblePages = useMemo(() => {
    if (numPages === null) return new Set();
    const s = new Set();
    for (let p = Math.max(1, currentPage - RENDER_BUFFER);
         p <= Math.min(numPages, currentPage + RENDER_BUFFER); p++) {
      s.add(p);
    }
    return s;
  }, [currentPage, numPages]);

  /* ── Page width ── */
  const [pageWidth, setPageWidth] = useState(() => calcPageWidth(prefs.zoom));
  useEffect(() => { setPageWidth(calcPageWidth(prefs.zoom)); }, [prefs.zoom]);
  useEffect(() => {
    function onResize() { setPageWidth(calcPageWidth(prefs.zoom)); }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [prefs.zoom]);

  /* ── Zoom ── */
  function zoomIn()    { updatePref('zoom', Math.min(ZOOM_MAX, prefs.zoom + ZOOM_STEP)); }
  function zoomOut()   { updatePref('zoom', Math.max(ZOOM_MIN, prefs.zoom - ZOOM_STEP)); }
  function zoomReset() { updatePref('zoom', ZOOM_DEFAULT); }

  /* ── Fullscreen ── */
  const containerRef   = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  function toggleFullscreen() {
    if (!document.fullscreenElement) containerRef.current?.requestFullscreen?.().catch(() => {});
    else document.exitFullscreen?.().catch(() => {});
  }
  useEffect(() => {
    const h = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', h);
    return () => document.removeEventListener('fullscreenchange', h);
  }, []);

  /* ── Auto-hide toolbar ── */
  const [toolbarVisible, setToolbarVisible] = useState(true);
  const hideTimer = useRef(null);
  const resetHideTimer = useCallback(() => {
    setToolbarVisible(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setToolbarVisible(false), 3500);
  }, []);
  useEffect(() => { resetHideTimer(); return () => clearTimeout(hideTimer.current); }, [resetHideTimer]);

  /* ── Page panel ── */
  const [showPanel, setShowPanel] = useState(false);

  /* ── Keyboard shortcuts ── */
  useEffect(() => {
    function handler(e) {
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'ArrowLeft'  || e.key === 'PageUp')    { e.preventDefault(); scrollToPage(currentPage - 1); }
      if (e.key === 'ArrowRight' || e.key === 'PageDown')   { e.preventDefault(); scrollToPage(currentPage + 1); }
      if ((e.key === '+' || e.key === '=') && (e.ctrlKey || e.metaKey)) { e.preventDefault(); zoomIn(); }
      if (e.key === '-' && (e.ctrlKey || e.metaKey))                    { e.preventDefault(); zoomOut(); }
      if (e.key === 'g' || e.key === 'G') setShowPanel((v) => !v);
    }
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, prefs.zoom, numPages]);

  const pdfUrl = book?._id ? `${API_URL}/api/books/${book._id}/pdf` : null;

  /* ─────────────────────────────────────────────────────────────────────────
     EARLY RETURNS
  ───────────────────────────────────────────────────────────────────────── */

  if (bookStatus === 'loading') {
    return <CenteredStatus><Spinner /><p className="text-[13.5px] text-neutral-400">Opening book…</p></CenteredStatus>;
  }
  if (bookStatus === 'notfound') return <BookLoadError message="Book not found." onBack={goBack} />;
  if (bookStatus === 'error')    return <BookLoadError message="Could not load this book." onRetry={fetchBook} onBack={goBack} />;
  if (!book?.pdfUrl)             return <NoPdfMessage onBack={goBack} />;

  /* ─────────────────────────────────────────────────────────────────────────
     MAIN RENDER
  ───────────────────────────────────────────────────────────────────────── */

  return (
    <div
      ref={containerRef}
      className={`flex h-screen flex-col overflow-hidden transition-colors duration-300 ${tc.bg}`}
      style={{ fontFamily: 'var(--font-sans)' }}
      onMouseMove={resetHideTimer}
      onTouchStart={resetHideTimer}
    >
      {/* ── Top toolbar ── */}
      <Toolbar
        book={book}
        visible={toolbarVisible}
        currentPage={currentPage}
        numPages={numPages}
        zoom={prefs.zoom}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onZoomReset={zoomReset}
        theme={prefs.theme}
        onThemeChange={(v) => updatePref('theme', v)}
        showPanel={showPanel}
        onTogglePanel={() => setShowPanel((v) => !v)}
        isFullscreen={isFullscreen}
        onFullscreen={toggleFullscreen}
        tc={tc}
      />

      {/* ── Content area (scroll + panel side by side) ── */}
      <div className="relative flex flex-1 overflow-hidden">

        {/* ── Scrollable PDF column ── */}
        <div
          ref={scrollAreaRef}
          className="flex-1 overflow-y-auto"
        >
          {/* Resumed toast */}
          <AnimatePresence>
            {resumeToast && (
              <motion.div
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}
                className="fixed left-1/2 top-16 z-30 -translate-x-1/2 rounded-full bg-black/70 px-4 py-2 text-[12.5px] font-medium text-white backdrop-blur-sm"
                aria-live="polite"
              >
                Resumed from page {resumeToast}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Document */}
          <Document
            file={{ url: pdfUrl, withCredentials: true }}
            onLoadSuccess={({ numPages: n }) => { setNumPages(n); setPdfStatus('success'); }}
            onLoadError={(err) => { setPdfError(err); setPdfStatus('error'); }}
            onLoadProgress={() => { if (pdfStatus === 'idle') setPdfStatus('loading'); }}
            loading={
              <div className="flex flex-col items-center gap-4 py-24">
                <Spinner />
                <p className="text-[13px] text-neutral-500">Loading PDF…</p>
              </div>
            }
            error={null}
            className="flex flex-col items-center"
          >
            {/* PDF load error */}
            {pdfStatus === 'error' && (
              <div className="mx-auto mt-16 max-w-md rounded-2xl border border-red-900/40 bg-red-950/30 px-6 py-5 text-center">
                <p className="mb-1 text-[14px] font-semibold text-red-300">Could not load the PDF</p>
                <p className="mb-3 text-[12.5px] text-red-400/80">{pdfError?.message ?? 'Unknown error'}</p>
                <p className="text-[11px] text-neutral-600">Proxy: {pdfUrl}</p>
              </div>
            )}

            {/* Pages — virtualized */}
            {pdfStatus !== 'error' && numPages !== null &&
              Array.from({ length: numPages }, (_, i) => {
                const pageNum  = i + 1;
                const shouldRender = visiblePages.has(pageNum);
                // Approximate A4 height when not rendered, keeps scroll position stable
                const placeholderH = Math.round(pageWidth * 1.414);

                return (
                  <div
                    key={pageNum}
                    ref={(el) => {
                      pageRefs.current[pageNum] = el;
                      if (el && observerRef.current) observerRef.current.observe(el);
                    }}
                    data-page={pageNum}
                    className="mx-auto my-3 overflow-hidden rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
                    style={{ width: pageWidth, minHeight: placeholderH }}
                  >
                    {shouldRender ? (
                      <Page
                        pageNumber={pageNum}
                        width={pageWidth}
                        renderTextLayer={true}
                        renderAnnotationLayer={false}
                        loading={
                          <div
                            style={{ width: pageWidth, height: placeholderH }}
                            className="flex items-center justify-center bg-neutral-900"
                          >
                            <Spinner small />
                          </div>
                        }
                        error={
                          <div
                            style={{ width: pageWidth, height: 80 }}
                            className="flex items-center justify-center bg-neutral-900"
                          >
                            <p className="text-[12px] text-red-400">Page {pageNum} failed.</p>
                          </div>
                        }
                      />
                    ) : (
                      /* Placeholder keeps layout stable while page is out of render window */
                      <div
                        style={{ width: pageWidth, height: placeholderH }}
                        className="flex items-center justify-center bg-neutral-900/60"
                      >
                        <p className={`text-[11px] ${tc.muted}`}>{pageNum}</p>
                      </div>
                    )}
                  </div>
                );
              })
            }

            {numPages !== null && <div style={{ height: '24px' }} />}
          </Document>

          {/*
           * ── AI SELECTION SLOT ──────────────────────────────────────────
           * Text layer is live (renderTextLayer={true}).
           * Next: listen to mouseup, read window.getSelection(),
           * show AI popover anchored to the selection bounding rect.
           * ──────────────────────────────────────────────────────────────
           */}
        </div>

        {/* ── Page panel overlay (right side) ── */}
        {numPages !== null && (
          <PagePanel
            open={showPanel}
            numPages={numPages}
            currentPage={currentPage}
            onJump={(pg) => { scrollToPage(pg); setShowPanel(false); }}
            pdfUrl={pdfUrl}
            tc={tc}
          />
        )}

        {/* Dim overlay when panel is open on mobile */}
        <AnimatePresence>
          {showPanel && (
            <motion.div
              key="dim"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 z-20 bg-black/40 sm:hidden"
              onClick={() => setShowPanel(false)}
              aria-hidden="true"
            />
          )}
        </AnimatePresence>
      </div>

      {/* ── Bottom mini-bar ── */}
      <MiniBar
        currentPage={currentPage}
        numPages={numPages}
        onScrollToPage={scrollToPage}
        zoom={prefs.zoom}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        pageInputVal={pageInputVal}
        onPageInputChange={handlePageInputChange}
        onPageInputCommit={handlePageInputCommit}
        tc={tc}
      />
    </div>
  );
}

export default BookReaderV2;
