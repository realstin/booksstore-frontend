/**
 * BookStore local preference system.
 *
 * All workspace preferences are stored in localStorage.
 * These are UI/UX preferences, NOT sensitive data.
 * Authentication tokens are never stored here.
 */

const KEYS = {
  THEME:         'bookstore_theme',
  REDUCE_MOTION: 'bookstore_reduce_motion',
  LIBRARY_VIEW:  'bookstore_library_view',
  BOOK_OPENING:  'bookstore_book_opening',
};

const DEFAULTS = {
  theme:        'system',  // 'light' | 'dark' | 'system'
  reduceMotion: false,
  libraryView:  'grid',    // 'grid' | 'list'
  bookOpening:  'details', // 'details' | 'read' (read = open pdfUrl directly)
};

/* ─── Generic helpers ─── */

function get(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function set(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage not available — silently ignore
  }
}

function remove(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

/* ─── Typed accessors ─── */

export const prefs = {
  // Theme
  getTheme:        () => get(KEYS.THEME,         DEFAULTS.theme),
  setTheme:        (v) => set(KEYS.THEME, ['light','dark','system'].includes(v) ? v : DEFAULTS.theme),

  // Reduce motion
  getReduceMotion: () => get(KEYS.REDUCE_MOTION, DEFAULTS.reduceMotion),
  setReduceMotion: (v) => set(KEYS.REDUCE_MOTION, Boolean(v)),

  // Library view
  getLibraryView:  () => get(KEYS.LIBRARY_VIEW,  DEFAULTS.libraryView),
  setLibraryView:  (v) => set(KEYS.LIBRARY_VIEW, ['grid','list'].includes(v) ? v : DEFAULTS.libraryView),

  // Book opening
  getBookOpening:  () => get(KEYS.BOOK_OPENING,  DEFAULTS.bookOpening),
  setBookOpening:  (v) => set(KEYS.BOOK_OPENING, ['details','read'].includes(v) ? v : DEFAULTS.bookOpening),

  // Reset all to defaults
  resetAll() {
    Object.values(KEYS).forEach(remove);
  },

  // Get all as an object
  getAll() {
    return {
      theme:        prefs.getTheme(),
      reduceMotion: prefs.getReduceMotion(),
      libraryView:  prefs.getLibraryView(),
      bookOpening:  prefs.getBookOpening(),
    };
  },
};

export { DEFAULTS };
