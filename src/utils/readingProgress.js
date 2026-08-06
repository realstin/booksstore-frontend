/**
 * Reading Progress — localStorage utility
 *
 * Namespace key: bookstowa_reading_progress
 * Shape: { [bookId]: ReadingEntry }
 *
 * ReadingEntry {
 *   bookId:    string        — MongoDB _id
 *   bookTitle: string        — denormalised for fast display
 *   bookCover: string|null   — coverImage URL
 *   authors:   string[]|null
 *   pdfUrl:    string|null
 *   lastReadAt: number       — Unix ms timestamp
 *   sessionCount: number     — how many times opened
 * }
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

/* ─── Public API ─── */

/**
 * Record that the user opened a book.
 * Call this when BookReader mounts with a valid book.
 */
export function recordBookOpened(book) {
  if (!book?._id) return;
  const store = readStore();
  const prev  = store[book._id] ?? {};
  store[book._id] = {
    bookId:       book._id,
    bookTitle:    book.title    ?? prev.bookTitle    ?? 'Unknown',
    bookCover:    book.coverImage ?? prev.bookCover  ?? null,
    authors:      Array.isArray(book.authors)
                    ? book.authors
                    : prev.authors ?? null,
    pdfUrl:       book.pdfUrl   ?? prev.pdfUrl       ?? null,
    lastReadAt:   Date.now(),
    sessionCount: (prev.sessionCount ?? 0) + 1,
  };
  writeStore(store);
}

/**
 * Returns the most recently read book entry, or null.
 */
export function getMostRecentBook() {
  const store   = readStore();
  const entries = Object.values(store);
  if (!entries.length) return null;
  return entries.reduce((best, e) =>
    (e.lastReadAt ?? 0) > (best.lastReadAt ?? 0) ? e : best
  );
}

/**
 * Returns all reading entries sorted by lastReadAt descending.
 */
export function getAllReadingHistory() {
  const store = readStore();
  return Object.values(store).sort((a, b) => (b.lastReadAt ?? 0) - (a.lastReadAt ?? 0));
}

/**
 * Returns the entry for a specific book, or null.
 */
export function getBookProgress(bookId) {
  if (!bookId) return null;
  return readStore()[bookId] ?? null;
}

/**
 * Removes a book from reading history.
 */
export function removeBookProgress(bookId) {
  if (!bookId) return;
  const store = readStore();
  delete store[bookId];
  writeStore(store);
}

/**
 * Clears all reading history.
 */
export function clearReadingHistory() {
  try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
}

/**
 * Format lastReadAt into a human-readable relative string.
 * e.g. "Just now", "2 hours ago", "Yesterday", "3 days ago"
 */
export function formatLastRead(timestamp) {
  if (!timestamp) return null;
  const diff = Date.now() - timestamp;
  const min  = Math.floor(diff / 60_000);
  const hr   = Math.floor(diff / 3_600_000);
  const day  = Math.floor(diff / 86_400_000);
  if (min < 2)  return 'Just now';
  if (min < 60) return `${min} min ago`;
  if (hr  < 24) return `${hr} hour${hr > 1 ? 's' : ''} ago`;
  if (day === 1) return 'Yesterday';
  if (day < 30) return `${day} days ago`;
  return new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
