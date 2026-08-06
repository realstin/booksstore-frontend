/**
 * Reading Progress — localStorage utility
 *
 * Namespace key: bookstowa_reading_progress
 * Shape: { [bookId]: ReadingEntry }
 *
 * ReadingEntry {
 *   bookId:           string
 *   bookTitle:        string
 *   bookCover:        string | null
 *   authors:          string[] | null
 *   pdfUrl:           string | null
 *   lastReadAt:       number        — Unix ms timestamp
 *   sessionCount:     number
 *   currentPage:      number        — 1-based page number
 *   totalPages:       number | null
 *   progressPercent:  number | null — 0-100
 * }
 *
 * Backward compatible — old entries without currentPage default to 1.
 */

const STORAGE_KEY = 'bookstowa_reading_progress';

/* ─── Raw read/write ─── */
function readStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

function writeStore(store) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch { /* quota exceeded — silently ignore */ }
}

/* ─────────────────────────────────────────
   Record that the user opened a book.
   Call this when BookReader mounts with a valid book.
───────────────────────────────────────── */
export function recordBookOpened(book) {
  if (!book?._id) return;
  const store = readStore();
  const prev  = store[book._id] ?? {};
  store[book._id] = {
    bookId:          book._id,
    bookTitle:       book.title      ?? prev.bookTitle      ?? 'Unknown',
    bookCover:       book.coverImage ?? prev.bookCover      ?? null,
    authors:         Array.isArray(book.authors) ? book.authors : prev.authors ?? null,
    pdfUrl:          book.pdfUrl     ?? prev.pdfUrl         ?? null,
    lastReadAt:      Date.now(),
    sessionCount:    (prev.sessionCount ?? 0) + 1,
    currentPage:     prev.currentPage     ?? 1,
    totalPages:      prev.totalPages      ?? (book.pages ?? null),
    progressPercent: prev.progressPercent ?? null,
  };
  writeStore(store);
}

/* ─────────────────────────────────────────
   Update reading position.
   Debounce calls to this — it is safe to call often but writes are cheap.
───────────────────────────────────────── */
export function updateReadingPage(bookId, currentPage, totalPages) {
  if (!bookId) return;
  const page = Math.max(1, Math.floor(Number(currentPage) || 1));
  const total = totalPages ? Math.max(1, Math.floor(Number(totalPages))) : null;

  const store = readStore();
  const prev  = store[bookId];
  if (!prev) return; // only update if book was already opened

  const safePage   = total ? Math.min(page, total) : page;
  const pct        = total ? Math.round((safePage / total) * 1000) / 10 : null;

  store[bookId] = {
    ...prev,
    currentPage:     safePage,
    totalPages:      total ?? prev.totalPages,
    progressPercent: pct   ?? prev.progressPercent,
    lastReadAt:      Date.now(),
  };
  writeStore(store);
}

/* ─────────────────────────────────────────
   Get stored page for a book (safe, never throws).
   Returns 1 if no valid saved page exists.
───────────────────────────────────────── */
export function getSavedPage(bookId) {
  if (!bookId) return 1;
  try {
    const entry = readStore()[bookId];
    if (!entry) return 1;
    const p = Math.floor(Number(entry.currentPage) || 1);
    return p >= 1 ? p : 1;
  } catch {
    return 1;
  }
}

/* ─────────────────────────────────────────
   Public API
───────────────────────────────────────── */
export function getMostRecentBook() {
  const store   = readStore();
  const entries = Object.values(store);
  if (!entries.length) return null;
  return entries.reduce((best, e) =>
    (e.lastReadAt ?? 0) > (best.lastReadAt ?? 0) ? e : best
  );
}

export function getAllReadingHistory() {
  const store = readStore();
  return Object.values(store).sort((a, b) => (b.lastReadAt ?? 0) - (a.lastReadAt ?? 0));
}

export function getBookProgress(bookId) {
  if (!bookId) return null;
  return readStore()[bookId] ?? null;
}

export function removeBookProgress(bookId) {
  if (!bookId) return;
  const store = readStore();
  delete store[bookId];
  writeStore(store);
}

export function clearReadingHistory() {
  try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
}

export function formatLastRead(timestamp) {
  if (!timestamp) return null;
  const diff = Date.now() - timestamp;
  const min  = Math.floor(diff / 60_000);
  const hr   = Math.floor(diff / 3_600_000);
  const day  = Math.floor(diff / 86_400_000);
  if (min < 2)   return 'Just now';
  if (min < 60)  return `${min} min ago`;
  if (hr  < 24)  return `${hr} hour${hr > 1 ? 's' : ''} ago`;
  if (day === 1) return 'Yesterday';
  if (day < 30)  return `${day} days ago`;
  return new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
