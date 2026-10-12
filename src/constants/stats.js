/**
 * BookStore platform statistics — fallback values only.
 *
 * Statistics.jsx fetches live data from GET /api/stats via useStats().
 * These values are used as a silent fallback if that request fails,
 * so visitors always see numbers rather than a broken UI.
 *
 * These should be kept roughly up to date but are no longer the
 * primary source of truth.
 */
export const STATS = {
  totalUsers:      31,
  totalBooks:      10,
  totalSavedBooks: 12,
  averageRating:   4.6,
};
