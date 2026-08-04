import { useEffect, useState } from 'react';
import { getStats } from '../services/api';

/**
 * useStats — fetches the BookStore platform statistics from the backend.
 *
 * The backend returns a Stats document cached in MongoDB (updated manually
 * by admins). Response time is ~2ms, compared to ~500ms when calculated live.
 *
 * Returned shape:
 *   stats.totalUsers       — number of registered users
 *   stats.totalBooks       — number of books in the library
 *   stats.totalSavedBooks  — total saves across all users
 *   stats.averageRating    — average book rating (decimal, e.g. 4.7)
 *
 * Usage:
 *   const { stats, loading, error } = useStats();
 */
export function useStats() {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const data = await getStats();
        if (!cancelled) setStats(data);
      } catch (err) {
        if (!cancelled) setError(err.message ?? 'Failed to load stats');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, []);

  return { stats, loading, error };
}
