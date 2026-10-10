import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import {
  getLibrary,
  saveBook   as apiSaveBook,
  removeBook as apiRemoveBook,
} from '../services/api';

/* ─────────────────────────────────────────────────────────────────────────────
   LibraryContext
   ─────────────────────────────────────────────────────────────────────────────
   Single source of truth for the authenticated user's saved-books list.

   WHY THIS EXISTS
   ───────────────
   Previously Library.jsx, BookDetails.jsx and Profile.jsx each called
   GET /api/users/library independently.  That produced three network
   round-trips per session and three separate snapshots that could
   show inconsistent counts/states to the user.

   This context fetches once, keeps the list in shared state, and exposes
   typed actions (saveBook / removeBook) that update both the backend and
   the shared list atomically, so every consumer stays in sync with zero
   extra fetches.

   GUESTS
   ──────
   The library belongs to a logged-in user. When nobody is logged in, this
   provider makes NO network request: it reports libStatus 'guest' with an
   empty list. This lets public pages (such as a book's details page) use
   the same context without triggering a failing 401 request.

   SHAPE EXPOSED TO CONSUMERS
   ──────────────────────────
   {
     savedBooks : Book[]          – the user's current library (full Book documents)
     libStatus  : 'loading'       – session check or library fetch in progress
                | 'guest'         – session check finished, nobody is logged in
                | 'success'
                | 'error'         – fetch lifecycle state
     isSaved    : (id) => bool    – true if bookId is in savedBooks
     saveBook   : (bookId) => { savesCount }
                                  – calls API, adds book to local list
     removeBook : (bookId) => { savesCount }
                                  – calls API, removes book from local list
     refresh    : () => void      – re-fetches from backend (escape hatch);
                                    does nothing when nobody is logged in
   }
─────────────────────────────────────────────────────────────────────────────── */

const LibraryContext = createContext(null);

export function LibraryProvider({ children }) {
  const { user, isInitialized } = useAuth();
  const isLoggedIn = Boolean(user);

  const [savedBooks, setSavedBooks] = useState([]);
  const [libStatus,  setLibStatus]  = useState('loading');

  /* ── Fetch the library (logged-in users only) ───────────────────────────── */
  const fetchLibrary = useCallback(async () => {
    setLibStatus('loading');
    try {
      const data  = await getLibrary();
      /* Normalise: bare array OR { savedBooks: [...] } OR { books: [...] } */
      const books = Array.isArray(data)
        ? data
        : data.savedBooks ?? data.books ?? [];
      setSavedBooks(books);
      setLibStatus('success');
    } catch (err) {
      console.error('[LibraryContext] fetch error:', err);
      setLibStatus('error');
    }
  }, []);

  /* ── React to the session state ──────────────────────────────────────────── */
  /*
     1. Session check still running  -> do nothing, stay in 'loading'.
     2. Check finished, no user      -> guest: empty list, no network request.
     3. Check finished, user exists  -> fetch their library.
     Re-runs whenever the user logs in or out.
  */
  useEffect(() => {
    if (!isInitialized) return;

    if (!isLoggedIn) {
      setSavedBooks([]);
      setLibStatus('guest');
      return;
    }

    fetchLibrary();
  }, [isInitialized, isLoggedIn, fetchLibrary]);

  /* Manual re-fetch. A guest has no library, so there is nothing to refresh. */
  const refresh = useCallback(() => {
    if (isLoggedIn) fetchLibrary();
  }, [isLoggedIn, fetchLibrary]);

  /* ── Helpers ─────────────────────────────────────────────────────────────── */

  /** Returns true when the given bookId is currently in the user's library. */
  const isSaved = useCallback(
    (bookId) => savedBooks.some((b) => String(b._id ?? b) === String(bookId)),
    [savedBooks]
  );

  /* ── Save ────────────────────────────────────────────────────────────────── */
  /**
   * Save a book.
   * 1. Calls POST /api/users/library/save/:bookId
   * 2. On success, adds the full book object to savedBooks (if the API returns
   *    it) — or at minimum marks the id as saved so isSaved() is immediately
   *    accurate.
   * Returns the API response { saved, savesCount } so callers can update
   * their own savesCount display.
   */
  const saveBook = useCallback(async (bookId, bookObject = null) => {
    const res = await apiSaveBook(bookId);
    /* Only update local list on a genuine new save (not a duplicate) */
    if (res.saved) {
      setSavedBooks((prev) => {
        const alreadyIn = prev.some((b) => String(b._id ?? b) === String(bookId));
        if (alreadyIn) return prev;
        /* Prefer the full book object if the caller supplied one,
           otherwise store a minimal sentinel so isSaved() works. */
        const entry = bookObject ?? { _id: bookId };
        return [...prev, entry];
      });
    }
    return res;
  }, []);

  /* ── Remove ──────────────────────────────────────────────────────────────── */
  /**
   * Remove a book.
   * 1. Calls DELETE /api/users/library/remove/:bookId
   * 2. On success, splices the entry from savedBooks.
   * Returns the API response { saved, savesCount }.
   */
  const removeBook = useCallback(async (bookId) => {
    const res = await apiRemoveBook(bookId);
    if (!res.saved) {
      setSavedBooks((prev) =>
        prev.filter((b) => String(b._id ?? b) !== String(bookId))
      );
    }
    return res;
  }, []);

  /* ── Context value ───────────────────────────────────────────────────────── */
  const value = {
    savedBooks,
    libStatus,
    isSaved,
    saveBook,
    removeBook,
    refresh,
  };

  return (
    <LibraryContext.Provider value={value}>
      {children}
    </LibraryContext.Provider>
  );
}

/**
 * useLibrary — consume the shared library context.
 * Must be used inside a component that is a descendant of LibraryProvider.
 */
export function useLibrary() {
  const ctx = useContext(LibraryContext);
  if (!ctx) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return ctx;
}