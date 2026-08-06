import {
  useState, useEffect, useCallback, useRef, useMemo,
} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Download, Maximize2, Minimize2,
  AlertCircle, Loader2, RefreshCw, BookOpen,
  Settings2, ZoomIn, ZoomOut, Sun, Moon, Monitor, BookText,
  ChevronDown,
} from 'lucide-react';
import { getBookById, downloadBook } from '../../services/api';
import { recordBookOpened, updateReadingPage, getSavedPage } from '../../utils/readingProgress';
import bookstoreLogo from '../../assets/bookstorelogo.svg';

/* ═══════════════════════════════════════════
   PREFERENCES — persisted to localStorage
═══════════════════════════════════════════ */
const PREF_KEY = 'bookstore_reader_prefs';

const DEFAULT_PREFS = {
  zoom:        100,   // percent: 50–200
  theme:       'dark', // dark | light | sepia | system
};

function loadPrefs() {
  try {
    const raw = localStorage.getItem(PREF_KEY);
    if (!raw) return { ...DEFAULT_PREFS };
    return { ...DEFAULT_PREFS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_PREFS };
  }
}

function savePrefs(prefs) {
  try { localStorage.setItem(PREF_KEY, JSON.stringify(prefs)); } catch { /* ignore */ }
}

/* ═══════════════════════════════════════════
   THEME CONFIG
═══════════════════════════════════════════ */
const THEMES = {
  dark: {
    bar:    'bg-[#1a1a1a] border-b border-white/[0.06]',
    reader: 'bg-[#121212]',
    panel:  'bg-[#1e1e1e] border border-white/[0.08] text-white',
    icon:   'text-white/70 hover:text-white hover:bg-white/[0.07]',
    label:  'text-white/50',
    seg:    { bg: 'bg-white/[0.07]', active: 'bg-white/[0.14] text-white', text: 'text-white/60' },
  },
  light: {
    bar:    'bg-white border-b border-neutral-200',
    reader: 'bg-neutral-100',
    panel:  'bg-white border border-neutral-200 text-neutral-900',
    icon:   'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100',
    label:  'text-neutral-400',
    seg:    { bg: 'bg-neutral-100', active: 'bg-white text-neutral-900 shadow-sm', text: 'text-neutral-500' },
  },
  sepia: {
    bar:    'bg-[#f5efe0] border-b border-[#d9c9a8]',
    reader: 'bg-[#f0e8d5]',
    panel:  'bg-[#f5efe0] border border-[#d9c9a8] text-[#3d2b1f]',
    icon:   'text-[#7a5c3a] hover:text-[#3d2b1f] hover:bg-[#e8dcc0]',
    label:  'text-[#9b7a50]',
    seg:    { bg: 'bg-[#e8dcc0]', active: 'bg-[#f5efe0] text-[#3d2b1f] shadow-sm', text: 'text-[#7a5c3a]' },
  },
  system: { /* resolved at runtime */ },
};

function resolveTheme(theme) {
  if (theme !== 'system') return theme;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/* ═══════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════
   DOWNLOAD BUTTON (unchanged logic)
═══════════════════════════════════════════ */
function ReaderDownloadButton({ bookId, bookTitle, tc }) {
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
        className={`inline-flex h-8 w-8 items-center justify-center rounded-full transition disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-current ${tc.icon}`}
        aria-label={status === 'downloading' ? 'Downloading…' : 'Download book'}
      >
        {status === 'downloading'
          ? <Loader2 size={15} strokeWidth={2} className="animate-spin" />
          : <Download size={15} strokeWidth={2} />
        }
      </button>
      {status === 'error' && (
        <p className="absolute right-0 top-full z-50 mt-1.5 whitespace-nowrap rounded-xl bg-red-950/90 px-3 py-2 text-[11.5px] text-red-200 shadow-lg" role="alert">
          Download failed.{' '}
          <button onClick={() => setStatus('idle')} className="underline underline-offset-2">Retry</button>
        </p>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   SETTINGS PANEL
═══════════════════════════════════════════ */
const THEME_OPTIONS = [
  { value: 'dark',   label: 'Dark',   icon: Moon    },
  { value: 'light',  label: 'Light',  icon: Sun     },
  { value: 'sepia',  label: 'Sepia',  icon: BookText },
  { value: 'system', label: 'System', icon: Monitor },
];

function SegControl({ options, value, onChange, tc }) {
  return (
    <div className={`flex gap-1 rounded-xl p-1 ${tc.seg.bg}`} role="group">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          aria-pressed={value === opt.value}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-[12px] font-medium transition-all duration-150 focus:outline-none
            ${value === opt.value ? tc.seg.active : tc.seg.text}`}
        >
          {opt.icon && <opt.icon size={12} strokeWidth={2} aria-hidden="true" />}
          <span>{opt.label}</span>
        </button>
      ))}
    </div>
  );
}

function SettingsPanel({ prefs, onPrefsChange, tc, onClose, isMobile }) {
  const base = `absolute z-50 shadow-2xl rounded-2xl overflow-hidden ${tc.panel}`;
  const pos   = isMobile
    ? 'bottom-0 left-0 right-0 rounded-b-none rounded-t-2xl'
    : 'top-full right-0 mt-2 w-72';

  return (
    <AnimatePresence>
      <motion.div
        initial={isMobile ? { y: '100%' } : { opacity: 0, y: -8, scale: 0.97 }}
        animate={isMobile ? { y: 0 }       : { opacity: 1, y: 0, scale: 1 }}
        exit={isMobile    ? { y: '100%' }  : { opacity: 0, y: -6, scale: 0.97 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className={`${base} ${pos}`}
        role="dialog"
        aria-label="Reading preferences"
      >
        {isMobile && (
          <div className="flex items-center justify-between px-5 pt-4 pb-2">
            <p className="text-[13px] font-bold">Reading settings</p>
            <button type="button" onClick={onClose} className={`rounded-full p-1.5 transition ${tc.icon}`} aria-label="Close settings">
              <ChevronDown size={16} />
            </button>
          </div>
        )}

        <div className="flex flex-col gap-5 p-5 pt-4">
          {/* Theme */}
          <div className="flex flex-col gap-2.5">
            <p className={`text-[11px] font-semibold uppercase tracking-[0.1em] ${tc.label}`}>Theme</p>
            <SegControl options={THEME_OPTIONS} value={prefs.theme} onChange={(v) => onPrefsChange('theme', v)} tc={tc} />
          </div>

          {/* Zoom */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <p className={`text-[11px] font-semibold uppercase tracking-[0.1em] ${tc.label}`}>Zoom</p>
              <span className="text-[12px] font-semibold opacity-70">{prefs.zoom}%</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onPrefsChange('zoom', Math.max(50, prefs.zoom - 10))}
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition ${tc.icon}`}
                aria-label="Zoom out"
              >
                <ZoomOut size={15} strokeWidth={2} />
              </button>
              <input
                type="range" min={50} max={200} step={10}
                value={prefs.zoom}
                onChange={(e) => onPrefsChange('zoom', Number(e.target.value))}
                className="h-1.5 flex-1 cursor-pointer accent-current opacity-70"
                aria-label="Zoom level"
              />
              <button
                type="button"
                onClick={() => onPrefsChange('zoom', Math.min(200, prefs.zoom + 10))}
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition ${tc.icon}`}
                aria-label="Zoom in"
              >
                <ZoomIn size={15} strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════
   READER TOOLBAR
═══════════════════════════════════════════ */
function ReaderToolbar({
  book, visible, prefs, onPrefsChange,
  isFullscreen, onToggleFullscreen,
  showSettings, onToggleSettings,
  onBack, tc, settingsPanelRef, isMobile,
}) {
  const authors = formatAuthors(book?.authors);

  return (
    <motion.div
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : -4 }}
      transition={{ duration: 0.22, ease: 'easeInOut' }}
      className={`flex h-13 shrink-0 items-center justify-between gap-3 px-3 sm:px-5 transition-colors duration-300 ${tc.bar}`}
      style={{ height: '52px' }}
    >
      {/* Left — back + logo + title */}
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition ${tc.icon}`}
          aria-label="Back to book details"
        >
          <ArrowLeft size={16} strokeWidth={2.2} aria-hidden="true" />
        </button>

        <img src={bookstoreLogo} alt="" aria-hidden="true" className="h-4.5 w-4.5 shrink-0 opacity-50" style={{ height: '18px', width: '18px' }} />

        <div className="min-w-0 hidden sm:block">
          <p className="truncate text-[13px] font-semibold leading-tight" style={{ maxWidth: '220px' }}>
            {book?.title ?? 'Loading…'}
          </p>
          {authors && (
            <p className={`truncate text-[11px] leading-tight ${tc.label}`} style={{ maxWidth: '220px' }}>
              {authors}
            </p>
          )}
        </div>
      </div>

      {/* Center — zoom controls (desktop) */}
      <div className="hidden items-center gap-1 sm:flex">
        <button
          type="button"
          onClick={() => onPrefsChange('zoom', Math.max(50, prefs.zoom - 10))}
          className={`flex h-8 w-8 items-center justify-center rounded-full transition ${tc.icon}`}
          aria-label="Zoom out"
        >
          <ZoomOut size={14} strokeWidth={2} />
        </button>
        <button
          type="button"
          onClick={() => onPrefsChange('zoom', 100)}
          className={`min-w-[3rem] rounded-lg px-2 py-1 text-[12px] font-semibold tabular-nums transition ${tc.icon}`}
          aria-label={`Zoom: ${prefs.zoom}%. Click to reset.`}
        >
          {prefs.zoom}%
        </button>
        <button
          type="button"
          onClick={() => onPrefsChange('zoom', Math.min(200, prefs.zoom + 10))}
          className={`flex h-8 w-8 items-center justify-center rounded-full transition ${tc.icon}`}
          aria-label="Zoom in"
        >
          <ZoomIn size={14} strokeWidth={2} />
        </button>
      </div>

      {/* Right — settings + fullscreen + download */}
      <div className="flex shrink-0 items-center gap-1">
        {/* Settings */}
        <div className="relative" ref={settingsPanelRef}>
          <button
            type="button"
            onClick={onToggleSettings}
            aria-expanded={showSettings}
            aria-haspopup="dialog"
            aria-label="Reading settings"
            className={`flex h-8 w-8 items-center justify-center rounded-full transition ${tc.icon} ${showSettings ? 'bg-white/10' : ''}`}
          >
            <Settings2 size={15} strokeWidth={2} />
          </button>

          {showSettings && !isMobile && (
            <SettingsPanel
              prefs={prefs}
              onPrefsChange={onPrefsChange}
              tc={tc}
              onClose={onToggleSettings}
              isMobile={false}
            />
          )}
        </div>

        {/* Download */}
        {book?._id && book?.pdfUrl && (
          <ReaderDownloadButton bookId={book._id} bookTitle={book.title} tc={tc} />
        )}

        {/* Fullscreen */}
        {document.fullscreenEnabled && (
          <button
            type="button"
            onClick={onToggleFullscreen}
            className={`flex h-8 w-8 items-center justify-center rounded-full transition ${tc.icon}`}
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen
              ? <Minimize2 size={14} strokeWidth={2} />
              : <Maximize2 size={14} strokeWidth={2} />
            }
          </button>
        )}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   STATIC ERROR / LOADING STATES
═══════════════════════════════════════════ */
function ReaderSkeleton() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 bg-[#121212]">
      <motion.div
        animate={{ opacity: [0.35, 0.7, 0.35] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="flex flex-col items-center gap-3"
      >
        <BookOpen size={32} strokeWidth={1.25} className="text-neutral-600" aria-hidden="true" />
        <p className="text-[13.5px] text-neutral-500">Opening book…</p>
      </motion.div>
    </div>
  );
}

function ReaderError({ message, onRetry, onBack }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 bg-[#121212] px-8 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-neutral-700 bg-neutral-800">
        <AlertCircle size={24} strokeWidth={1.5} className="text-neutral-500" aria-hidden="true" />
      </div>
      <div className="flex flex-col gap-1.5">
        <p className="text-[1rem] font-bold text-white">{message ?? 'Unable to open this book.'}</p>
        <p className="max-w-xs text-[13px] text-neutral-400">Please try again or go back to the book details.</p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <button type="button" onClick={onBack}
          className="inline-flex items-center gap-2 rounded-full border border-neutral-700 px-5 py-2.5 text-[13px] font-medium text-neutral-300 transition hover:border-neutral-500 hover:text-white focus:outline-none">
          <ArrowLeft size={13} />&nbsp;Back to Book
        </button>
        {onRetry && (
          <button type="button" onClick={onRetry}
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[13px] font-semibold text-neutral-950 transition hover:bg-neutral-100 focus:outline-none">
            <RefreshCw size={13} />&nbsp;Try Again
          </button>
        )}
      </div>
    </div>
  );
}

function NoPdfState({ book, onBack, tc }) {
  return (
    <div className={`flex h-full flex-col items-center justify-center gap-6 px-8 text-center ${tc.reader}`}>
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-neutral-700 bg-neutral-800">
        <BookOpen size={24} strokeWidth={1.5} className="text-neutral-500" aria-hidden="true" />
      </div>
      <div className="flex flex-col gap-1.5">
        <p className="text-[1rem] font-bold text-white">Online reading isn&apos;t available yet.</p>
        <p className="max-w-xs text-[13px] text-neutral-400">This book doesn&apos;t have a reading version, but you can download it.</p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <button type="button" onClick={onBack}
          className="inline-flex items-center gap-2 rounded-full border border-neutral-700 px-5 py-2.5 text-[13px] font-medium text-neutral-300 transition hover:border-neutral-500 hover:text-white focus:outline-none">
          <ArrowLeft size={13} />&nbsp;Back to Book
        </button>
        {book?._id && book?.pdfUrl && (
          <ReaderDownloadButton bookId={book._id} bookTitle={book.title} tc={tc} />
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN BookReader
═══════════════════════════════════════════ */
function BookReader() {
  const { id }   = useParams();
  const navigate = useNavigate();

  /* ── Book data ── */
  const [book,     setBook]     = useState(null);
  const [status,   setStatus]   = useState('loading');
  const [pdfError, setPdfError] = useState(false);

  /* ── Page tracking ── */
  const [currentPage,  setCurrentPage]  = useState(1);
  const [pageInput,    setPageInput]    = useState('1');   // controlled input string
  const [resumedFrom,  setResumedFrom]  = useState(null);  // page we resumed at (for toast)
  const pageUpdateTimer = useRef(null);                    // debounce timer

  /* ── Preferences ── */
  const [prefs, setPrefsState] = useState(loadPrefs);

  function updatePref(key, value) {
    setPrefsState((p) => {
      const next = { ...p, [key]: value };
      savePrefs(next);
      return next;
    });
  }

  /* ── UI state ── */
  const [isFullscreen,  setIsFullscreen]  = useState(false);
  const [showSettings,  setShowSettings]  = useState(false);
  const [toolbarVisible, setToolbarVisible] = useState(true);

  /* ── Refs ── */
  const settingsPanelRef = useRef(null);
  const hideTimerRef     = useRef(null);
  const containerRef     = useRef(null);

  /* ── Responsive ── */
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  /* ── Resolved theme (handles 'system') ── */
  const resolvedTheme = useMemo(() => resolveTheme(prefs.theme), [prefs.theme]);
  const tc = THEMES[resolvedTheme] ?? THEMES.dark;

  /* Watch system preference if theme === 'system' */
  useEffect(() => {
    if (prefs.theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => setPrefsState((p) => ({ ...p })); // force re-render
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [prefs.theme]);

  /* ── Fetch book + restore saved page ── */
  const goBack = useCallback(() => navigate(`/dashboard/books/${id}`), [navigate, id]);

  const fetchBook = useCallback(async () => {
    setStatus('loading');
    setBook(null);
    setPdfError(false);
    try {
      const data  = await getBookById(id);
      const b     = data?.book ?? data;
      setBook(b);
      setStatus('success');
      recordBookOpened(b);
      /* Restore saved page */
      const saved = getSavedPage(id);
      if (saved > 1) {
        setCurrentPage(saved);
        setPageInput(String(saved));
        setResumedFrom(saved);
        /* Auto-hide "Resumed" toast after 3 s */
        setTimeout(() => setResumedFrom(null), 3000);
      } else {
        setCurrentPage(1);
        setPageInput('1');
      }
    } catch (err) {
      setStatus(err.status === 404 ? 'notfound' : 'error');
    }
  }, [id]);

  useEffect(() => { fetchBook(); }, [fetchBook]);

  /* ── Navigate to a specific page ── */
  function navigateToPage(page) {
    const n     = Math.max(1, Math.floor(Number(page) || 1));
    const total = book?.pages ?? null;
    const safe  = total ? Math.min(n, total) : n;
    setCurrentPage(safe);
    setPageInput(String(safe));
    /* Debounced persistence — 800 ms after last change */
    if (pageUpdateTimer.current) clearTimeout(pageUpdateTimer.current);
    pageUpdateTimer.current = setTimeout(() => {
      updateReadingPage(id, safe, total);
    }, 800);
  }

  /* ── Persist on unmount (catch navigation away) ── */
  useEffect(() => {
    return () => {
      if (pageUpdateTimer.current) clearTimeout(pageUpdateTimer.current);
      /* Flush immediately on unmount */
      if (book?._id) {
        updateReadingPage(book._id, currentPage, book?.pages ?? null);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [book, currentPage]);

  /* ── Auto-hide toolbar ── */
  function resetHideTimer() {
    setToolbarVisible(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      if (!showSettings) setToolbarVisible(false);
    }, 3000);
  }

  useEffect(() => {
    resetHideTimer();
    return () => clearTimeout(hideTimerRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showSettings]);

  function handleActivity() { resetHideTimer(); }

  /* ── Fullscreen ── */
  function handleToggleFullscreen() {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  }

  useEffect(() => {
    const handler = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  /* ── Close settings when clicking outside ── */
  useEffect(() => {
    if (!showSettings) return;
    function handler(e) {
      if (settingsPanelRef.current && !settingsPanelRef.current.contains(e.target)) {
        setShowSettings(false);
      }
    }
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [showSettings]);

  /* ── Keyboard shortcuts ── */
  useEffect(() => {
    function handler(e) {
      if (e.key === 'Escape' && showSettings) { setShowSettings(false); return; }
      if ((e.key === '+' || e.key === '=') && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        updatePref('zoom', Math.min(200, prefs.zoom + 10));
      }
      if (e.key === '-' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        updatePref('zoom', Math.max(50, prefs.zoom - 10));
      }
    }
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showSettings, prefs.zoom]);

  /* ── Render ── */
  const hasPdf = Boolean(book?.pdfUrl);

  /* Error/notfound — bare layout */
  if (status === 'notfound' || status === 'error') {
    return (
      <div className="flex h-screen flex-col bg-[#121212]" style={{ fontFamily: 'var(--font-sans)' }}>
        <ReaderToolbar
          book={null} visible tc={THEMES.dark}
          prefs={prefs} onPrefsChange={updatePref}
          isFullscreen={isFullscreen} onToggleFullscreen={handleToggleFullscreen}
          showSettings={false} onToggleSettings={() => {}}
          onBack={goBack} settingsPanelRef={settingsPanelRef} isMobile={isMobile}
        />
        <div className="flex-1">
          <ReaderError
            message={status === 'notfound' ? 'Book not found.' : "We couldn't load this book."}
            onRetry={status === 'error' ? fetchBook : undefined}
            onBack={goBack}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`flex h-screen flex-col overflow-hidden transition-colors duration-300 ${tc.reader}`}
      style={{ fontFamily: 'var(--font-sans)' }}
      onMouseMove={handleActivity}
      onTouchStart={handleActivity}
      onClick={handleActivity}
    >
      {/* ── Toolbar ── */}
      <ReaderToolbar
        book={book}
        visible={toolbarVisible}
        tc={tc}
        prefs={prefs}
        onPrefsChange={updatePref}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
        showSettings={showSettings}
        onToggleSettings={() => setShowSettings((v) => !v)}
        onBack={goBack}
        settingsPanelRef={settingsPanelRef}
        isMobile={isMobile}
      />

      {/* ── Mobile settings bottom sheet ── */}
      {showSettings && isMobile && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setShowSettings(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 z-50">
            <SettingsPanel
              prefs={prefs} onPrefsChange={updatePref}
              tc={tc} onClose={() => setShowSettings(false)} isMobile
            />
          </div>
        </>
      )}

      {/* ── Reading area ── */}
      <div className="relative flex-1 overflow-hidden">
        {status === 'loading' && <ReaderSkeleton />}

        {status === 'success' && !hasPdf && (
          <NoPdfState book={book} onBack={goBack} tc={tc} />
        )}

        {status === 'success' && hasPdf && !pdfError && (
          <>
            {/* Resumed toast */}
            {resumedFrom && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3 }}
                className="absolute left-1/2 top-3 z-20 -translate-x-1/2 rounded-full bg-black/70 px-4 py-1.5 text-[12.5px] font-medium text-white/90 backdrop-blur-sm"
                aria-live="polite"
              >
                Resumed from page {resumedFrom}
              </motion.div>
            )}

            {/* Page navigation bar */}
            <div className={`flex items-center justify-center gap-2 py-2 text-[13px] ${tc.bar}`}>
              <button
                type="button"
                onClick={() => navigateToPage(currentPage - 1)}
                disabled={currentPage <= 1}
                className={`flex h-7 w-7 items-center justify-center rounded-full transition disabled:opacity-30 ${tc.icon}`}
                aria-label="Previous page"
              >
                ‹
              </button>
              <span className={`${tc.label} text-[12px]`}>Page</span>
              <input
                type="number"
                min={1}
                max={book?.pages || undefined}
                value={pageInput}
                onChange={(e) => setPageInput(e.target.value)}
                onBlur={(e) => {
                  const n = parseInt(e.target.value, 10);
                  if (!isNaN(n) && n >= 1) navigateToPage(n);
                  else setPageInput(String(currentPage));
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const n = parseInt(e.target.value, 10);
                    if (!isNaN(n) && n >= 1) navigateToPage(n);
                  }
                }}
                className={`w-16 rounded-lg border px-2 py-0.5 text-center text-[13px] font-semibold outline-none transition
                  ${resolvedTheme === 'dark'
                    ? 'border-white/10 bg-white/10 text-white'
                    : resolvedTheme === 'sepia'
                    ? 'border-[#c4a87a] bg-[#ede0c8] text-[#3d2b1f]'
                    : 'border-neutral-200 bg-white text-neutral-900'}`}
                aria-label="Current page number"
              />
              {book?.pages && (
                <span className={`${tc.label} text-[12px]`}>of {book.pages}</span>
              )}
              <button
                type="button"
                onClick={() => navigateToPage(currentPage + 1)}
                disabled={book?.pages ? currentPage >= book.pages : false}
                className={`flex h-7 w-7 items-center justify-center rounded-full transition disabled:opacity-30 ${tc.icon}`}
                aria-label="Next page"
              >
                ›
              </button>
            </div>

            <iframe
              key={`${book._id}-${prefs.zoom}-${currentPage}`}
              src={`${book.pdfUrl}#page=${currentPage}`}
              title={`Reading: ${book.title}`}
              className="border-0 transition-all duration-300"
              style={{
                width:  `${prefs.zoom}%`,
                height: 'calc(100% - 36px)',
                marginLeft:  'auto',
                marginRight: 'auto',
                display: 'block',
                maxWidth: '100%',
              }}
              onError={() => setPdfError(true)}
              aria-label={`PDF reader for ${book.title}`}
            />
          </>
        )}

        {status === 'success' && hasPdf && pdfError && (
          <ReaderError
            message="The PDF couldn't be displayed."
            onRetry={() => setPdfError(false)}
            onBack={goBack}
          />
        )}
      </div>
    </div>
  );
}

export default BookReader;
